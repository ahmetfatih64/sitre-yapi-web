import { z } from "zod";

/** E.164-ish; tolerates Turkish formatting but strips to digits for storage. */
const phoneRegex = /^[+0-9 ()\-.]{7,24}$/;

export const contactSchema = z
  .object({
    name: z
      .string({ required_error: "Lütfen adınızı ve soyadınızı girin." })
      .trim()
      .min(2, "Lütfen adınızı ve soyadınızı girin.")
      .max(80),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Geçerli bir telefon numarası girin.")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .trim()
      .email("Geçerli bir e-posta adresi girin.")
      .optional()
      .or(z.literal("")),
    subject: z.string().trim().max(120).optional(),
    projectInterest: z.string().trim().max(120).optional(),
    message: z.string().trim().max(2000).optional(),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Devam etmek için onay vermeniz gerekiyor.",
      }),
    }),

    // Context — preserved for attribution.
    source: z.string().trim().max(60).optional(),
    projectId: z.string().trim().max(60).optional(),
    planId: z.string().trim().max(60).optional(),
    ctaContext: z.string().trim().max(60).optional(),
    utm: z
      .object({
        source: z.string().max(60).optional(),
        medium: z.string().max(60).optional(),
        campaign: z.string().max(120).optional(),
        term: z.string().max(120).optional(),
        content: z.string().max(120).optional(),
      })
      .partial()
      .optional(),

    // Anti-abuse.
    website: z.string().max(0).optional(), // honeypot
    turnstileToken: z.string().optional(),
  })
  .refine((d) => Boolean(d.phone) || Boolean(d.email), {
    message: "Lütfen telefon veya e-posta bilgisi verin.",
    path: ["phone"],
  });

export type ContactFormValues = z.input<typeof contactSchema>;
export type ContactFormParsed = z.output<typeof contactSchema>;
