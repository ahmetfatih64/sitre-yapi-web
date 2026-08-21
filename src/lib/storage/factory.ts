import {
  LocalStorageAdapter,
  R2StorageAdapter,
  type StorageAdapter,
} from "@sitre/storage";
import { env } from "@/lib/env";
import { siteConfig } from "@/content/site.config";

let cached: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (cached) return cached;
  if (env.HAS_R2) {
    cached = new R2StorageAdapter({
      accountId: env.R2_ACCOUNT_ID!,
      bucket: env.R2_BUCKET!,
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      publicBase: env.R2_PUBLIC_BASE!,
    });
  } else {
    cached = new LocalStorageAdapter(env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url);
  }
  return cached;
}
