export interface PresignRequest {
  /** MIME type that the client will PUT. */
  contentType: string;
  /** Logical folder ("projects/abc/gallery"). */
  prefix: string;
  /** Original filename (used for extension + display). */
  filename: string;
  /** Hard byte-size cap enforced server-side via signed condition. */
  maxBytes: number;
}

export interface PresignedUpload {
  /** PUT URL the browser uploads to. */
  uploadUrl: string;
  /** Final public read URL once the object lands. */
  publicUrl: string;
  /** Storage key (DB foreign key). */
  storageKey: string;
  /** Required headers the browser must echo on PUT. */
  headers: Record<string, string>;
  /** Signature TTL — UI must re-request after expiry. */
  expiresAt: string;
}

export interface StorageAdapter {
  presignUpload(req: PresignRequest): Promise<PresignedUpload>;
  delete(storageKey: string): Promise<void>;
}

export const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB
