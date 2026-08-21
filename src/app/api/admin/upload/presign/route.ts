import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { can } from "@sitre/auth";
import { getStorage } from "@/lib/storage/factory";
import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES } from "@sitre/storage";

export const runtime = "nodejs";

const schema = z.object({
  contentType: z.string(),
  prefix: z.string().regex(/^[a-z0-9/_-]+$/i),
  filename: z.string().min(1).max(200),
  byteSize: z.number().int().positive(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  if (!can(session.user.role, "media.upload")) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }
  const { contentType, prefix, filename, byteSize } = parsed.data;

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return NextResponse.json(
      { ok: false, error: "unsupported_content_type" },
      { status: 415 }
    );
  }
  if (byteSize > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 });
  }

  const presigned = await getStorage().presignUpload({
    contentType,
    prefix,
    filename,
    maxBytes: MAX_UPLOAD_BYTES,
  });

  return NextResponse.json({ ok: true, presigned });
}
