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
        select: {
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
          publishedAt: true,
        },
      })) as Record<string, unknown> | null;

      if (full) {
        await prisma.publishedProjectProjection.upsert({
          where: { projectId: id },
          create: {
            projectId: id,
            slug: full.slug as string,
            payload: full as never,
            publishedAt: now,
            revisionId: revision.id,
          },
          update: {
            slug: full.slug as string,
            payload: full as never,
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

  async getPublishedBySlug(slug: string): Promise<unknown | null> {
    return prisma.publishedProjectProjection.findUnique({ where: { slug } });
  },

  async listPublishedSlugs(): Promise<string[]> {
    const rows = (await prisma.publishedProjectProjection.findMany({
      select: { slug: true },
    })) as { slug: string }[];
    return rows.map((r) => r.slug);
  },
};
