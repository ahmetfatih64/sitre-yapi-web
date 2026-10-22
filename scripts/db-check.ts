/**
 * Veritabanı bağlantısını ve içerik durumunu doğrular.
 *
 * Kullanım: npm run db:check
 *
 * Dağıtım sonrası "gerçekten bağlandı mı, içerik yerinde mi" sorusunu
 * tahmine bırakmamak için. Bağlantı adresini ekrana basmaz.
 */
import { PrismaClient } from "@prisma/client";

const EXPECTED_TABLES = 16; // 15 model + _prisma_migrations

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tanımlı değil.");
    process.exit(1);
  }

  // Sunucu kimliğini parolasız göster.
  const host = process.env.DATABASE_URL.replace(
    /^.*@([^/?]+).*$/,
    "$1"
  );
  console.log(`\nSunucu: ${host}\n`);

  const prisma = new PrismaClient();
  const started = Date.now();

  try {
    const version = await prisma.$queryRaw<{ v: string }[]>`SELECT version() AS v`;
    console.log(`  ${version[0].v.split(",")[0]}`);
    console.log(`  bağlantı gecikmesi: ${Date.now() - started} ms`);

    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
    console.log(`\n  tablo: ${tables.length}/${EXPECTED_TABLES}`);
    if (tables.length < EXPECTED_TABLES) {
      console.error("  ✗ Eksik tablo var — migration uygulanmamış olabilir.");
      process.exitCode = 1;
    }

    const [projects, published, users, leads] = await Promise.all([
      prisma.project.count(),
      prisma.publishedProjectProjection.count(),
      prisma.user.count(),
      prisma.lead.count(),
    ]);

    console.log(`  proje: ${projects}  yayınlanmış: ${published}`);
    console.log(`  kullanıcı: ${users}  talep: ${leads}`);

    if (published === 0) {
      console.error(
        "\n  ✗ Yayınlanmış proje yok — site TS içeriğine düşecek. `npm run db:seed` çalıştırın."
      );
      process.exitCode = 1;
    }

    const owners = await prisma.user.count({ where: { role: "OWNER" } });
    if (users > 0 && owners === 0) {
      console.error(
        "\n  ✗ Hiç OWNER yok — yönetim paneline erişilemez. `npm run db:promote -- <eposta>`"
      );
      process.exitCode = 1;
    }

    if (!process.exitCode) console.log("\n  Veritabanı hazır.\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("\nBağlantı başarısız:", error instanceof Error ? error.message : error);
  process.exit(1);
});
