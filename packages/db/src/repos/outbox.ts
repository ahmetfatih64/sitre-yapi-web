import { prisma } from "../index";

export type OutboxRow = {
  id: string;
  topic: string;
  payload: unknown;
  attempts: number;
  scheduledFor: Date;
};

export const outboxRepo = {
  async enqueue(topic: string, payload: unknown): Promise<void> {
    await prisma.outboxEvent.create({ data: { topic, payload: payload as never } });
  },

  async claimBatch(limit: number): Promise<OutboxRow[]> {
    return (await prisma.outboxEvent.findMany({
      where: { status: "PENDING", scheduledFor: { lte: new Date() } },
      orderBy: { scheduledFor: "asc" },
      take: limit,
    })) as OutboxRow[];
  },

  async markSent(id: string): Promise<void> {
    await prisma.outboxEvent.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });
  },

  async markFailed(id: string, error: string, attempts: number): Promise<void> {
    const backoffMin = Math.min(60, 2 ** attempts);
    await prisma.outboxEvent.update({
      where: { id },
      data: {
        status: attempts >= 8 ? "FAILED" : "PENDING",
        attempts,
        lastError: error,
        scheduledFor: new Date(Date.now() + backoffMin * 60_000),
      },
    });
  },
};
