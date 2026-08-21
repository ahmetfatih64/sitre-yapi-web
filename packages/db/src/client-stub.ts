/**
 * Minimal type surface so consumer modules compile before `prisma generate`
 * has produced the real client. Mirrors only the methods we currently call;
 * extend as the schema is consumed.
 */
export interface PrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  user: ModelDelegate;
  session: ModelDelegate;
  account: ModelDelegate;
  passkey: ModelDelegate;
  auditLog: ModelDelegate;
  project: ModelDelegate;
  projectRevision: ModelDelegate;
  publishedProjectProjection: ModelDelegate;
  plan: ModelDelegate;
  amenity: ModelDelegate;
  mediaAttachment: ModelDelegate;
  lead: ModelDelegate;
  leadNote: ModelDelegate;
  outboxEvent: ModelDelegate;
}

interface ModelDelegate {
  findUnique(args: unknown): Promise<unknown>;
  findFirst(args: unknown): Promise<unknown>;
  findMany(args?: unknown): Promise<unknown[]>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  upsert(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
  count(args?: unknown): Promise<number>;
}

export function stubClient(): PrismaClient {
  const die = async (): Promise<never> => {
    throw new Error(
      "[@sitre/db] Prisma client not generated. Provision DATABASE_URL and run `npm run -w @sitre/db generate`."
    );
  };
  const model: ModelDelegate = {
    findUnique: die,
    findFirst: die,
    findMany: die,
    create: die,
    update: die,
    upsert: die,
    delete: die,
    count: die,
  };
  return {
    $connect: async () => {},
    $disconnect: async () => {},
    user: model,
    session: model,
    account: model,
    passkey: model,
    auditLog: model,
    project: model,
    projectRevision: model,
    publishedProjectProjection: model,
    plan: model,
    amenity: model,
    mediaAttachment: model,
    lead: model,
    leadNote: model,
    outboxEvent: model,
  };
}
