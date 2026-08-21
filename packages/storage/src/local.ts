/**
 * Dev-only adapter. Returns a fake presigned URL pointing at a local
 * Next.js route handler that accepts the PUT and persists nothing.
 * Lets the admin UI exercise the upload flow before R2 is provisioned.
 */
import type { PresignRequest, PresignedUpload, StorageAdapter } from "./types";

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private readonly baseUrl: string) {}

  async presignUpload(req: PresignRequest): Promise<PresignedUpload> {
    const ext = req.filename.split(".").pop() ?? "bin";
    const key = `${req.prefix}/${cryptoRandom()}.${ext}`;
    return {
      uploadUrl: `${this.baseUrl}/api/admin/upload/local?key=${encodeURIComponent(key)}`,
      publicUrl: `${this.baseUrl}/dev-uploads/${key}`,
      storageKey: key,
      headers: { "content-type": req.contentType },
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    };
  }

  async delete(_key: string): Promise<void> {

  }
}

function cryptoRandom(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
