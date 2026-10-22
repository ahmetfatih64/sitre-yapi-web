import { prisma } from "../index";

export interface ProjectListItem {
  id: string;
  slug: string;
  name: string;
  status: string;
  publishState: string;
  updatedAt: Date;
}

export interface ProjectDraft {
  id: string;
  slug: string;
  name: string;
  status: string;
  publishState: string;
  shortSummary: string;
  description: string;
  locationLabel: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverImageUrl: string | null;
  updatedAt: Date;
}

export type PublishState = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

/**
 * Yayınlanmış projeksiyonun yükü, sitenin beklediği zengin `Project` şeklidir.
 *
 * Sorgulanabilir alanlar (slug, ad, durum, meta…) sütunlarda tutulur ve
 * yük oluşturulurken JSON'un üzerine yazılır — böylece sütunlar tek
 * otorite olur ve JSON ile sütun arasında sessiz bir tutarsızlık oluşmaz.
 */
const STATUS_TO_SITE: Record<string, string> = {
  ACTIVE: "active",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
};

function composePayload(row: Record<string, unknown>): Record<string, unknown> {
  const content =
    row.contentJson && typeof row.contentJson === "object"
      ? (row.contentJson as Record<string, unknown>)
      : {};

  const existingCover =
    content.coverImage && typeof content.coverImage === "object"
      ? (content.coverImage as Record<string, unknown>)
      : {};

  return {
    ...content,
    slug: row.slug,
    name: row.name,
    status: STATUS_TO_SITE[String(row.status)] ?? "upcoming",
    locationLabel: row.locationLabel,
    shortSummary: row.shortSummary,
    tags: Array.isArray(row.tags) ? row.tags : [],
    coverImage: {
      src: row.coverImageUrl ?? existingCover.src ?? "",
      alt: existingCover.alt ?? row.name ?? "",
    },
    meta: {
      title: row.metaTitle ?? row.name ?? "",
      description: row.metaDescription ?? row.shortSummary ?? "",
      ...(row.ogImageUrl ? { ogImage: row.ogImageUrl } : {}),
    },
  };
}

const PUBLISH_SELECT = {
  id: true,
  slug: true,
  name: true,
  status: true,
  shortSummary: true,
  description: true,
  locationLabel: true,
  addressStreet: true,
  addressCity: true,
  lat: true,
  lng: true,
  metaTitle: true,
  metaDescription: true,
  ogImageUrl: true,
  coverImageUrl: true,
  tags: true,
  contentJson: true,
  publishedAt: true,
} as const;

export const projectRepo = {
  async listForAdmin(): Promise<ProjectListItem[]> {
    return (await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        slug: true,
        name: true,
        status: true,
        publishState: true,
        updatedAt: true,
      },
    })) as ProjectListItem[];
  },

  async getDraft(id: string): Promise<ProjectDraft | null> {
    return (await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        name: true,
        status: true,
        publishState: true,
        shortSummary: true,
        description: true,
        locationLabel: true,
        metaTitle: true,
        metaDescription: true,
        coverImageUrl: true,
        updatedAt: true,
      },
    })) as ProjectDraft | null;
  },

  async createDraft(input: {
    slug: string;
    name: string;
    shortSummary: string;
    description: string;
    locationLabel: string;
    authorId: string | null;
  }): Promise<{ id: string }> {
    const created = (await prisma.project.create({
      data: {
        slug: input.slug,
        name: input.name,
        shortSummary: input.shortSummary,
        description: input.description,
        locationLabel: input.locationLabel,
        publishState: "DRAFT" as never,
      },
      select: { id: true },
    })) as { id: string };

    await prisma.projectRevision.create({
      data: {
        projectId: created.id,
        authorId: input.authorId,
        message: "create",
        payload: input as never,
      },
    });

    return created;
  },

  async updateDraft(
    id: string,
    patch: Partial<Omit<ProjectDraft, "id" | "updatedAt" | "publishState">>,
    authorId: string | null,
    message = "update"
  ): Promise<void> {
    await prisma.project.update({ where: { id }, data: patch as never });
    await prisma.projectRevision.create({
      data: {
        projectId: id,
        authorId,
        message,
        payload: patch as never,
      },
    });
  },

  async transition(
    id: string,
    to: PublishState,
    authorId: string | null
  ): Promise<void> {
    const now = new Date();
    await prisma.project.update({
      where: { id },
      data: {
        publishState: to as never,
        ...(to === "PUBLISHED" ? { publishedAt: now } : {}),
      },
    });

    const revision = (await prisma.projectRevision.create({
      data: {
        projectId: id,
        authorId,
        message: `transition:${to}`,
        payload: { to } as never,
      },
      select: { id: true },
    })) as { id: string };

    if (to === "PUBLISHED") {
      const full = (await prisma.project.findUnique({
        where: { id },
        select: PUBLISH_SELECT,
      })) as Record<string, unknown> | null;

      if (full) {
        await prisma.publishedProjectProjection.upsert({
          where: { projectId: id },
          create: {
            projectId: id,
            slug: full.slug as string,
            payload: composePayload(full) as never,
            publishedAt: now,
            revisionId: revision.id,
          },
          update: {
            slug: full.slug as string,
            payload: composePayload(full) as never,
            publishedAt: now,
            revisionId: revision.id,
          },
        });
      }
    }

    if (to === "ARCHIVED") {
      await prisma.publishedProjectProjection
        .delete({ where: { projectId: id } })
        .catch(() => undefined);
    }
  },

  /** Tek projenin yayın yükü. Bulunamazsa null. */
  async getPublishedBySlug(slug: string): Promise<unknown | null> {
    const row = (await prisma.publishedProjectProjection.findUnique({
      where: { slug },
      select: { payload: true },
    })) as { payload: unknown } | null;
    return row?.payload ?? null;
  },

  /**
   * Yayınlanmış tüm projelerin yükleri, en yeni önce.
   * Slug listesi alıp tek tek sorgulamak N+1 üretiyordu.
   */
  async listPublished(): Promise<unknown[]> {
    const rows = (await prisma.publishedProjectProjection.findMany({
      select: { payload: true },
      orderBy: { publishedAt: "desc" },
    })) as { payload: unknown }[];
    return rows.map((r) => r.payload);
  },

  async listPublishedSlugs(): Promise<string[]> {
    const rows = (await prisma.publishedProjectProjection.findMany({
      select: { slug: true },
    })) as { slug: string }[];
    return rows.map((r) => r.slug);
  },
};
