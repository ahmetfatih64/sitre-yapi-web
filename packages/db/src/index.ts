/**
 * Prisma client singleton. Web app and admin import from "@sitre/db".
 *
 * The actual `@prisma/client` is a peer dep — install it at the workspace
 * root once a database is provisioned. Until then this module re-exports
 * a typed stub so consumer code compiles in dev / CI without DB access.
 */
import type { PrismaClient as PrismaClientType } from "./client-stub";

declare global {

  var __sitrePrisma: PrismaClientType | undefined;
}

let prisma: PrismaClientType;

try {

  const mod: { PrismaClient: new () => PrismaClientType } = require("@prisma/client");
  prisma = globalThis.__sitrePrisma ?? new mod.PrismaClient();
  if (process.env.NODE_ENV !== "production") globalThis.__sitrePrisma = prisma;
} catch {

  console.warn(
    "[@sitre/db] @prisma/client not installed — using stub. Run `npm i @prisma/client` and `prisma generate` in packages/db."
  );

  const stub: PrismaClientType = require("./client-stub").stubClient();
  prisma = stub;
}

export { prisma };
export type { PrismaClientType as PrismaClient };
