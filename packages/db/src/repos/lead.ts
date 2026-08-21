import { prisma } from "../index";

export interface LeadFilter {
  status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON";
  assigneeId?: string;
  projectId?: string;
  limit?: number;
  cursor?: string;
}

export interface LeadListItem {
  id: string;
  receivedAt: Date;
  status: string;
  source: string;
  name: string;
  email: string | null;
  phone: string | null;
  projectInterest: string | null;
  assigneeId: string | null;
}

export const leadRepo = {
  async list(filter: LeadFilter = {}): Promise<LeadListItem[]> {
    const where: Record<string, unknown> = {};
    if (filter.status) where.status = filter.status;
    if (filter.assigneeId) where.assigneeId = filter.assigneeId;
    if (filter.projectId) where.projectId = filter.projectId;

    const rows = (await prisma.lead.findMany({
      where,
      orderBy: { receivedAt: "desc" },
      take: filter.limit ?? 50,
      ...(filter.cursor ? { cursor: { id: filter.cursor }, skip: 1 } : {}),
      select: {
        id: true,
        receivedAt: true,
        status: true,
        source: true,
        name: true,
        email: true,
        phone: true,
        projectInterest: true,
        assigneeId: true,
      },
    })) as LeadListItem[];
    return rows;
  },

  async create(input: {
    id?: string;
    name: string;
    email: string | null;
    phone: string | null;
    message: string | null;
    subject: string | null;
    projectInterest: string | null;
    source: string;
    projectId: string | null;
    ctaContext: string | null;
    utm: Record<string, string> | null;
    dedupeHash: string;
    consentPolicyVersion: string;
    ipHash: string | null;
    userAgentHash: string | null;
  }): Promise<{ id: string }> {
    const created = (await prisma.lead.create({
      data: {
        ...(input.id ? { id: input.id } : {}),
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        subject: input.subject,
        projectInterest: input.projectInterest,
        source: input.source as never,
        projectId: input.projectId,
        ctaContext: input.ctaContext,
        utm: (input.utm ?? null) as never,
        dedupeHash: input.dedupeHash,
        consentPolicyVersion: input.consentPolicyVersion,
        ipHash: input.ipHash,
        userAgentHash: input.userAgentHash,
      },
      select: { id: true },
    })) as { id: string };
    return created;
  },

  async assign(id: string, assigneeId: string | null): Promise<void> {
    await prisma.lead.update({ where: { id }, data: { assigneeId } });
  },

  async setStatus(id: string, status: LeadListItem["status"]): Promise<void> {
    await prisma.lead.update({ where: { id }, data: { status } });
  },
};
