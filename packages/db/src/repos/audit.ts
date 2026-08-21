import { prisma } from "../index";

export interface AuditEntry {
  id: string;
  createdAt: Date;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  ipHash: string | null;
  diff: unknown;
}

function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  // Store only a short, non-reversible fingerprint (KVKK veri minimizasyonu).
  // Real hash uses Node crypto when called from a server runtime.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createHash } = require("node:crypto") as typeof import("node:crypto");
    return createHash("sha256").update(`ip:${ip}`).digest("hex").slice(0, 32);
  } catch {
    return null;
  }
}

export const auditRepo = {
  async list(limit = 100): Promise<AuditEntry[]> {
    return (await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        actorId: true,
        action: true,
        entity: true,
        entityId: true,
        ipHash: true,
        diff: true,
      },
    })) as AuditEntry[];
  },

  async record(entry: {
    actorId: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    ip?: string | null;
    diff?: unknown;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        ipHash: hashIp(entry.ip),
        diff: (entry.diff ?? null) as never,
      },
    });
  },
};
