import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmbedMap } from "@/components/ui/EmbedMap";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/content/site.config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  path: "/iletisim",
  description:
    "Sitre Yapı ile iletişime geçin. Ofis adresi, telefon, e-posta ve online iletişim formu.",
});

export default function IletisimPage() {
  const { contact } = siteConfig;
  return (
    <>
      <section className="section pt-40">
        <div className="container-page grid md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <SectionHeading
              overline="İletişim"
              title="İletişime geçin."
              description="Kısa bir form yeterli. Sizi yanıtsız bırakmıyoruz."
              as="h1"
              size="xl"
            />
          </div>
          <div className="md:col-span-6 flex flex-col gap-8">
            <div>
              <p className="eyebrow mb-3">Ofis</p>
              <address className="not-italic text-[var(--color-brand-soft)]">
                {contact.address.street}
                <br />
                {contact.address.city}, {contact.address.country}
              </address>
            </div>
            <div>
              <p className="eyebrow mb-3">Telefon & e-posta</p>
              <p>
                <a href={contact.phoneHref} className="hover:text-[var(--color-accent)]">
                  {contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-[var(--color-accent)]"
                >
                  {contact.email}
                </a>
              </p>
            </div>
            <div>
              <p className="eyebrow mb-3">Çalışma saatleri</p>
              <ul className="text-sm text-[var(--color-brand-soft)] flex flex-col gap-1">
                {contact.hours.map((h) => (
                  <li
                    key={h.label}
                    className="flex justify-between max-w-xs border-b border-[var(--color-border)] py-2"
                  >
                    <span>{h.label}</span>
                    <span>{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="border-t border-[var(--color-border)] pt-16">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5">
                <p className="eyebrow mb-3">Kurucular</p>
                <div className="flex flex-col gap-4 mb-8">
                  {siteConfig.founders.map((f) => (
                    <div key={f.name}>
                      <p className="font-medium text-[var(--color-brand)]">{f.name}</p>
                      <a
                        href={f.phoneHref}
                        className="text-sm text-[var(--color-brand-soft)] hover:text-[var(--color-accent)]"
                      >
                        {f.phone}
                      </a>
                    </div>
                  ))}
                </div>
                <Image
                  src="/brand/cardvisid.jpeg"
                  alt="Sitre Yapı kartvizit"
                  width={480}
                  height={280}
                  className="rounded-lg border border-[var(--color-border)] shadow-sm object-cover w-full"
                />
              </div>
              <div className="md:col-span-7">
                <SectionHeading overline="Form" title="Bize yazın." />
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <EmbedMap
            lat={contact.address.lat}
            lng={contact.address.lng}
            query={`${contact.address.street}, ${contact.address.city}, ${contact.address.country}`}
            label={`Sitre Yapı — ${contact.address.street}, ${contact.address.city}`}
          />
        </div>
      </section>
    </>
  );
}
