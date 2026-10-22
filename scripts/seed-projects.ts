/**
 * Depodaki TS proje içeriğini veritabanına aktarır ve yayınlar.
 *
 * Çalıştırma:  npm run db:seed
 * Gereksinim:  DATABASE_URL tanımlı ve migration uygulanmış olmalı.
 *
 * Idempotent: slug üzerinden upsert yapar, tekrar çalıştırmak güvenlidir.
 * Zaten yayında olan bir projeyi tekrar yayınlar (projeksiyonu tazeler).
 */
import { PrismaClient } from "@prisma/client";
import { projects } from "../src/content/projects/index";
import { projectSchema } from "../src/content/projects/schema";

const prisma = new PrismaClient();

const STATUS_TO_DB = {
  active: "ACTIVE",
  completed: "COMPLETED",
  upcoming: "UPCOMING",
} as const;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tanımlı değil. .env.local dosyanızı kontrol edin.");
    process.exit(1);
  }

  console.log(`\n${projects.length} proje aktarılacak.\n`);

  for (const project of projects) {
    // Aktarmadan önce doğrula: bozuk içerik veritabanına girmemeli.
    const parsed = projectSchema.safeParse(project);
    if (!parsed.success) {
      console.error(`  ✗ ${project.slug} — şema doğrulaması başarısız:`);
      for (const issue of parsed.error.issues.slice(0, 3)) {
        console.error(`      ${issue.path.join(".")}: ${issue.message}`);
      }
      process.exitCode = 1;
      continue;
    }

    const data = {
      slug: project.slug,
      name: project.name,
      status: STATUS_TO_DB[project.status],
      publishState: "PUBLISHED" as const,
      shortSummary: project.shortSummary,
      description: project.concept.body.join("\n\n"),
      locationLabel: project.locationLabel,
      addressStreet: project.location.address,
      addressCity: project.locationLabel,
      lat: project.location.coordinates.lat,
      lng: project.location.coordinates.lng,
      metaTitle: project.meta.title,
      metaDescription: project.meta.description,
      ogImageUrl: project.meta.ogImage ?? null,
      coverImageUrl: project.coverImage.src,
      tags: project.tags,
      contentJson: parsed.data as unknown as object,
      publishedAt: new Date(),
    };

    const row = await prisma.project.upsert({
      where: { slug: project.slug },
      create: data,
      update: data,
      select: { id: true },
    });

    const revision = await prisma.projectRevision.create({
      data: {
        projectId: row.id,
        authorId: null,
        message: "seed:import",
        payload: { source: "src/content/projects" },
      },
      select: { id: true },
    });

    const payload = {
      ...parsed.data,
      // Sütunlar otorite; composePayload ile aynı kural.
      slug: project.slug,
      name: project.name,
      status: project.status,
    };

    await prisma.publishedProjectProjection.upsert({
      where: { projectId: row.id },
      create: {
        projectId: row.id,
        slug: project.slug,
        payload,
        publishedAt: new Date(),
        revisionId: revision.id,
      },
      update: {
        slug: project.slug,
        payload,
        publishedAt: new Date(),
        revisionId: revision.id,
      },
    });

    console.log(`  ✓ ${project.slug} — aktarıldı ve yayınlandı`);
  }

  const count = await prisma.publishedProjectProjection.count();
  console.log(`\nVeritabanında yayınlanmış proje sayısı: ${count}\n`);
}

main()
  .catch((error) => {
    console.error("\nTohumlama başarısız:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
