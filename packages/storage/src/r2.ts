/**
 * Cloudflare R2 (S3-compatible) presigner. Implements PutObject sigv4 by hand
 * to avoid pulling in the full aws-sdk on the edge. Activate by setting:
 *   R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_BASE
 */
import type { PresignRequest, PresignedUpload, StorageAdapter } from "./types";

export interface R2Config {
  accountId: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Public CDN base, e.g. https://cdn.sitreyapi.com */
  publicBase: string;
  /** Signature TTL in seconds (default 300). */
  expiresIn?: number;
}

export class R2StorageAdapter implements StorageAdapter {
  constructor(private readonly cfg: R2Config) {}

  async presignUpload(req: PresignRequest): Promise<PresignedUpload> {
    const ext = req.filename.split(".").pop() ?? "bin";
    const key = `${req.prefix}/${cryptoRandom()}.${ext}`;
    const expiresIn = this.cfg.expiresIn ?? 300;
    const host = `${this.cfg.bucket}.${this.cfg.accountId}.r2.cloudflarestorage.com`;
    const url = await sigV4PresignPut({
      host,
      key,
      contentType: req.contentType,
      maxBytes: req.maxBytes,
      accessKeyId: this.cfg.accessKeyId,
      secretAccessKey: this.cfg.secretAccessKey,
      expiresIn,
      region: "auto",
      service: "s3",
    });
    return {
      uploadUrl: url,
      publicUrl: `${this.cfg.publicBase.replace(/\/$/, "")}/${key}`,
      storageKey: key,
      headers: {
        "content-type": req.contentType,
      },
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    };
  }

  async delete(_key: string): Promise<void> {

    throw new Error("R2 delete not yet implemented");
  }
}

function cryptoRandom(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

interface SigArgs {
  host: string;
  key: string;
  contentType: string;
  maxBytes: number;
  accessKeyId: string;
  secretAccessKey: string;
  expiresIn: number;
  region: string;
  service: string;
}

async function sigV4PresignPut(a: SigArgs): Promise<string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${a.region}/${a.service}/aws4_request`;
  const credential = `${a.accessKeyId}/${credentialScope}`;

  const params = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": credential,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(a.expiresIn),
    "X-Amz-SignedHeaders": "host",
  });

  const canonicalUri = `/${a.key.split("/").map(encodeURIComponent).join("/")}`;
  const canonicalQuery = [...params.entries()]
    .sort(([x], [y]) => (x < y ? -1 : 1))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuery,
    `host:${a.host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = await hmac(`AWS4${a.secretAccessKey}`, dateStamp);
  const kRegion = await hmac(kDate, a.region);
  const kService = await hmac(kRegion, a.service);
  const kSigning = await hmac(kService, "aws4_request");
  const signature = bytesToHex(
    new Uint8Array(await crypto.subtle.sign("HMAC", await importHmacKey(kSigning), enc(stringToSign)))
  );

  return `https://${a.host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

const enc = (s: string) => new TextEncoder().encode(s);
const bytesToHex = (b: Uint8Array) =>
  Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");

async function sha256Hex(s: string): Promise<string> {
  return bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", enc(s))));
}

async function importHmacKey(raw: Uint8Array | string): Promise<CryptoKey> {
  const keyData: BufferSource =
    typeof raw === "string" ? enc(raw) : new Uint8Array(raw);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function hmac(key: Uint8Array | string, msg: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.sign("HMAC", await importHmacKey(key), enc(msg)));
}
