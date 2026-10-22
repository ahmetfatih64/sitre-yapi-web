/**
 * Bir kullanıcıya rol atar.
 *
 * Auth.js ile ilk giriş yapan kişi şemadaki varsayılan `VIEWER` rolünü alır
 * (schema.prisma: role UserRole @default(VIEWER)). Yönetim paneline erişmek
 * için en az bir OWNER gerekir; bu script o tek seferlik yükseltmeyi yapar.
 *
 * Kullanım:
 *   npm run db:promote -- ahmet@ornek.com
 *   npm run db:promote -- ahmet@ornek.com ADMIN
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ROLES = ["OWNER", "ADMIN", "EDITOR", "SALES", "VIEWER"] as const;
type Role = (typeof ROLES)[number];

async function main() {
  const [email, roleArg = "OWNER"] = process.argv.slice(2);

  if (!email) {
    console.error("Kullanım: npm run db:promote -- <e-posta> [ROL]");
    console.error(`Roller: ${ROLES.join(", ")}`);
    process.exit(1);
  }
  if (!ROLES.includes(roleArg as Role)) {
    console.error(`Geçersiz rol: ${roleArg}. Roller: ${ROLES.join(", ")}`);
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  });

  if (!existing) {
    console.error(`\n${email} adresiyle kullanıcı bulunamadı.`);
    console.error(
      "Önce /admin/login üzerinden e-posta bağlantısıyla giriş yapın; " +
        "kullanıcı ilk girişte oluşturulur.\n"
    );
    const others = await prisma.user.findMany({
      select: { email: true, role: true },
      take: 10,
    });
    if (others.length) {
      console.error("Kayıtlı kullanıcılar:");
      for (const u of others) console.error(`  ${u.email} — ${u.role}`);
    }
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: roleArg as Role },
    select: { email: true, role: true },
  });

  console.log(`\n${updated.email} → ${updated.role} (önceki: ${existing.role})\n`);
}

main()
  .catch((e) => {
    console.error("Başarısız:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
