/* eslint-disable @next/next/no-img-element --
 * Yüklenen medyanın URL'i çalışma zamanında (R2/yerel adaptör) üretiliyor.
 * next/image için remotePatterns tanımı gerekir; yönetim paneli önizlemesinde
 * optimizasyonun getirisi yok.
 */
"use client";

import { useState, useTransition } from "react";
import type { MediaItem } from "@sitre/db/repos/media";
import { MediaUploader } from "../../media/MediaUploader";
import { linkMediaToProject, deleteMedia } from "../../media/actions";

interface MediaGalleryProps {
  projectId: string;
  items: MediaItem[];
}

export function MediaGallery({ projectId, items }: MediaGalleryProps) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string>("");

  function onUnattach(id: string): void {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("projectId", "");
    start(async () => {
      const result = await linkMediaToProject(fd);
      setMessage(result.ok ? "Bağlantı kaldırıldı." : `Hata: ${result.error}`);
    });
  }

  function onDelete(id: string): void {
    if (!confirm("Bu medyayı kalıcı silmek istiyor musunuz?")) return;
    const fd = new FormData();
    fd.set("id", id);
    start(async () => {
      const result = await deleteMedia(fd);
      setMessage(result.ok ? "Silindi." : `Hata: ${result.error}`);
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
          Medya
        </h2>
        {message && (
          <span className="text-xs text-[var(--color-brand-soft)]">{message}</span>
        )}
      </header>

      <MediaUploader projectId={projectId} />

      {items.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-brand-soft)]">
          Bu projeye bağlı medya yok.
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-[var(--color-surface-muted,#f5f5f5)] flex items-center justify-center overflow-hidden">
                {item.kind === "IMAGE" ? (
                  <img
                    src={item.url}
                    alt={item.alt ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-mono text-[var(--color-brand-soft)]">
                    {item.kind}
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col gap-2 text-xs">
                <span className="font-mono break-all text-[var(--color-brand-soft)]">
                  {item.storageKey}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onUnattach(item.id)}
                    className="border border-[var(--color-border)] rounded px-2 py-1"
                  >
                    Bağlantıyı kaldır
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onDelete(item.id)}
                    className="border border-[var(--color-border)] rounded px-2 py-1 text-red-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
