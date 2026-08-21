"use client";

import { useState } from "react";
import { attachMedia } from "./actions";

interface PresignResponse {
  ok: boolean;
  presigned?: {
    uploadUrl: string;
    publicUrl: string;
    storageKey: string;
    headers: Record<string, string>;
    expiresAt: string;
  };
  error?: string;
}

type Status = "idle" | "presigning" | "uploading" | "attaching" | "done" | "error";

export function MediaUploader({ projectId }: { projectId?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  async function handleUpload(file: File): Promise<void> {
    setMessage("");
    setPublicUrl(null);
    setStatus("presigning");

    try {
      const res = await fetch("/api/admin/upload/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentType: file.type,
          prefix: projectId ? `projects/${projectId}` : "projects/inbox",
          filename: file.name,
          byteSize: file.size,
        }),
      });
      const data = (await res.json()) as PresignResponse;
      if (!res.ok || !data.ok || !data.presigned) {
        setStatus("error");
        setMessage(data.error ?? `presign_failed_${res.status}`);
        return;
      }

      setStatus("uploading");
      const put = await fetch(data.presigned.uploadUrl, {
        method: "PUT",
        headers: data.presigned.headers,
        body: file,
      });
      if (!put.ok) {
        setStatus("error");
        setMessage(`upload_failed_${put.status}`);
        return;
      }

      setStatus("attaching");
      const fd = new FormData();
      fd.set("storageKey", data.presigned.storageKey);
      fd.set("url", data.presigned.publicUrl);
      fd.set("mimeType", file.type);
      fd.set("byteSize", String(file.size));
      if (projectId) fd.set("projectId", projectId);
      const attach = await attachMedia(fd);
      if (!attach.ok) {
        setStatus("error");
        setMessage(`attach_failed: ${attach.error}`);
        return;
      }

      setStatus("done");
      setPublicUrl(data.presigned.publicUrl);
      setMessage(`Yüklendi: ${data.presigned.storageKey}`);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "unknown";
      setStatus("error");
      setMessage(m);
    }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          Dosya seç (JPG/PNG/WebP/MP4/PDF, max 50MB)
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
          disabled={status === "presigning" || status === "uploading" || status === "attaching"}
          className="text-sm"
        />
      </label>
      {status !== "idle" && (
        <div className="text-sm text-[var(--color-brand-soft)]">
          Durum: <span className="font-mono">{status}</span>
          {message ? ` — ${message}` : ""}
        </div>
      )}
      {publicUrl && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline break-all"
        >
          {publicUrl}
        </a>
      )}
    </div>
  );
}
