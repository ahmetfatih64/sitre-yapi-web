import { prisma } from "../index";

export type MediaKind = "IMAGE" | "VIDEO" | "PDF" | "OTHER";

export interface MediaItem {
  id: string;
  storageKey: string;
  url: string;
  kind: MediaKind;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption: string | null;
  projectId: string | null;
  uploadedById: string | null;
  createdAt: Date;
}

function kindFromMime(mime: string): MediaKind {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  return "OTHER";
}

export const mediaRepo = {
  async listForProject(projectId: string): Promise<MediaItem[]> {
    return (await prisma.mediaAttachment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 200,
    })) as MediaItem[];
  },

  async listUnattached(limit = 50): Promise<MediaItem[]> {
    return (await prisma.mediaAttachment.findMany({
      where: { projectId: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    })) as MediaItem[];
  },

  async attach(input: {
    storageKey: string;
    url: string;
    mimeType: string;
    byteSize: number;
    projectId: string | null;
    uploadedById: string | null;
    alt?: string | null;
    caption?: string | null;
  }): Promise<{ id: string }> {
    return (await prisma.mediaAttachment.upsert({
      where: { storageKey: input.storageKey },
      create: {
        storageKey: input.storageKey,
        url: input.url,
        kind: kindFromMime(input.mimeType) as never,
        mimeType: input.mimeType,
        byteSize: input.byteSize,
        projectId: input.projectId,
        uploadedById: input.uploadedById,
        alt: input.alt ?? null,
        caption: input.caption ?? null,
      },
      update: {
        url: input.url,
        projectId: input.projectId,
        alt: input.alt ?? null,
        caption: input.caption ?? null,
      },
      select: { id: true },
    })) as { id: string };
  },

  async setProject(id: string, projectId: string | null): Promise<void> {
    await prisma.mediaAttachment.update({
      where: { id },
      data: { projectId },
    });
  },

  async delete(id: string): Promise<{ storageKey: string } | null> {
    const row = (await prisma.mediaAttachment
      .delete({ where: { id }, select: { storageKey: true } })
      .catch(() => null)) as { storageKey: string } | null;
    return row;
  },
};
