import type { LeadRecord } from "./types";
import { env } from "@/lib/env";
import { outboxRepo } from "@sitre/db/repos/outbox";

/**
 * Outbox topic registry. Kept as string literal union so downstream
 * workers (QStash / BullMQ) can dispatch by topic.
 */
export type OutboxTopic =
  | "lead.received"
  | "lead.notify.email"
  | "lead.notify.slack"
  | "lead.crm.push";

export interface OutboxEvent<T = unknown> {
  id: string;
  topic: OutboxTopic;
  payload: T;
  createdAt: string;
  attempts: number;
}

export interface OutboxAdapter {
  publish<T>(topic: OutboxTopic, payload: T): Promise<OutboxEvent<T>>;
}

class LogOutbox implements OutboxAdapter {
  async publish<T>(topic: OutboxTopic, payload: T): Promise<OutboxEvent<T>> {
    const ev: OutboxEvent<T> = {
      id: crypto.randomUUID(),
      topic,
      payload,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    // Structured, PII-minimized log line. Replace with DB adapter when schema lands.
    console.info(`[outbox] publish topic=${topic} id=${ev.id}`);
    return ev;
  }
}

class DbOutbox implements OutboxAdapter {
  async publish<T>(topic: OutboxTopic, payload: T): Promise<OutboxEvent<T>> {
    const ev: OutboxEvent<T> = {
      id: crypto.randomUUID(),
      topic,
      payload,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    try {
      await outboxRepo.enqueue(topic, payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown";
      console.warn(`[outbox] db enqueue failed topic=${topic}: ${message}`);
    }
    return ev;
  }
}

let adapter: OutboxAdapter = env.HAS_DB ? new DbOutbox() : new LogOutbox();

export function setOutboxAdapter(next: OutboxAdapter) {
  adapter = next;
}

export function publishOutbox<T>(topic: OutboxTopic, payload: T) {
  return adapter.publish(topic, payload);
}

/** Convenience for the canonical "new lead" sequence. */
export async function emitLeadReceived(lead: LeadRecord) {
  const payload = {
    id: lead.id,
    name: lead.name,
    contact: { phone: lead.phone, email: lead.email },
    context: {
      source: lead.source,
      projectId: lead.projectId,
      planId: lead.planId,
      ctaContext: lead.ctaContext,
      utm: lead.utm,
    },
    consentPolicyVersion: lead.consentPolicyVersion,
    receivedAt: lead.receivedAt,
  };
  await publishOutbox("lead.received", payload);
  await publishOutbox("lead.notify.email", payload);
  // lead.crm.push / lead.notify.slack emitted when adapters are wired.
}
