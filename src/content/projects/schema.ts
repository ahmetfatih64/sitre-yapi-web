import { z } from "zod";

/**
 * Proje içeriğinin çalışma zamanı doğrulaması.
 *
 * Neden gerekli: içerik artık iki kaynaktan gelebiliyor — depodaki TS
 * dosyaları (derleme zamanında tip güvenli) ve veritabanındaki
 * `Project.contentJson` (tip güvencesi yok, `unknown` olarak gelir).
 * Veritabanından okunan her kayıt sayfaya ulaşmadan önce buradan geçer.
 *
 * Şema `types.ts` içindeki `Project` tipini birebir yansıtır; ikisi
 * ayrışırsa `projectSchema` derleme hatası verir (aşağıdaki tip kontrolü).
 */

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
});

const nearbyCategorySchema = z.enum([
  "okul",
  "saglik",
  "alisveris",
  "ulasim",
  "sosyal",
  "doga",
]);

export const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  locationLabel: z.string(),
  status: z.enum(["active", "completed", "upcoming"]),
  tags: z.array(z.string()),
  shortSummary: z.string(),
  coverImage: imageSchema,

  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogImage: z.string().optional(),
  }),

  hero: z.object({
    overline: z.string(),
    title: z.string(),
    subtitle: z.string(),
    location: z.string(),
    image: imageSchema,
    primaryCtaLabel: z.string(),
    secondaryCtaLabel: z.string().optional(),
  }),

  concept: z.object({
    overline: z.string(),
    title: z.string(),
    body: z.array(z.string()),
    highlights: z.array(z.string()),
    image: imageSchema,
  }),

  location: z.object({
    overline: z.string(),
    title: z.string(),
    address: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
    body: z.array(z.string()),
    nearby: z.array(
      z.object({
        name: z.string(),
        category: nearbyCategorySchema,
        distance: z.string(),
      })
    ),
  }),

  features: z.array(z.object({ label: z.string(), value: z.string() })),

  gallery: z.object({
    overline: z.string(),
    title: z.string(),
    categories: z.array(z.string()),
    items: z.array(
      z.object({
        id: z.string(),
        src: z.string().min(1),
        alt: z.string(),
        category: z.string(),
        caption: z.string().optional(),
      })
    ),
  }),

  amenities: z.object({
    overline: z.string(),
    title: z.string(),
    items: z.array(
      z.object({ name: z.string(), description: z.string().optional() })
    ),
  }),

  siteplan: z.object({
    overline: z.string(),
    title: z.string(),
    image: imageSchema,
  }),

  plans: z.object({
    overline: z.string(),
    title: z.string(),
    categories: z.array(z.string()),
    items: z.array(
      z.object({
        category: z.string(),
        code: z.string(),
        image: imageSchema.optional(),
        totalArea: z.number(),
        netArea: z.number(),
        rooms: z.array(z.object({ name: z.string(), area: z.number() })),
        orientation: z.string().optional(),
        floorRange: z.string().optional(),
      })
    ),
  }),

  progress: z
    .object({
      overline: z.string(),
      title: z.string(),
      updatedAt: z.string().optional(),
      milestones: z.array(
        z.object({
          label: z.string(),
          status: z.enum(["done", "active", "planned"]),
          date: z.string().optional(),
          note: z.string().optional(),
        })
      ),
    })
    .optional(),

  tour: z
    .object({
      available: z.boolean(),
      embedUrl: z.string().optional(),
      panorama: z
        .object({
          wide: z.string(),
          narrow: z.string(),
          poster: z.string(),
          posterAlt: z.string(),
          initialYaw: z.number().optional(),
          credit: z.string().optional(),
          isConcept: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),

  bottomCta: z.object({
    title: z.string(),
    description: z.string(),
    primaryCtaLabel: z.string(),
    secondaryCtaLabel: z.string(),
  }),
});

export type ProjectFromSchema = z.infer<typeof projectSchema>;

/**
 * Doğrulanmamış bir kaydı projeye çevirir. Geçersizse null döner ve
 * nedenini loglar — tek bozuk kayıt tüm listeyi düşürmemeli.
 */
export function parseProject(input: unknown, context: string) {
  const result = projectSchema.safeParse(input);
  if (result.success) return result.data;
  console.warn(
    `[content] geçersiz proje kaydı (${context}):`,
    result.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`)
  );
  return null;
}
