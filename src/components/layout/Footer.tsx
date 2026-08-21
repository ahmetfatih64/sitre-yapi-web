import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site.config";
import { footerNav } from "@/content/navigation";

export function Footer() {
  return (
    <footer style={{ background: "#1e1c1a" }} className="text-[#d9d5d0]">
      {/* Üst kısım — logo + nav + iletişim */}
      <div className="container-page pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo + açıklama */}
          <div className="md:col-span-4">
            <Image
              src="/brand/alt_logo.jpeg"
              alt="Sitre Yapı — Mimarlık Mühendislik"
              width={220}
              height={68}
              className="object-contain mb-6"
            />
            <p className="text-sm text-[#9a9590] leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Keşfet */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent)] mb-5">
              Keşfet
            </h3>
            <ul className="flex flex-col gap-3">
              {footerNav.keşfet.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#bdb7ad] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent)] mb-5">
              Kurumsal
            </h3>
            <ul className="flex flex-col gap-3">
              {footerNav.kurumsal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#bdb7ad] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent)] mb-5">
              İletişim
            </h3>
            <address className="not-italic text-sm text-[#bdb7ad] leading-relaxed">
              {siteConfig.contact.address.street}
              <br />
              {siteConfig.contact.address.city},{" "}
              {siteConfig.contact.address.country}
            </address>
            <div className="mt-4 flex flex-col gap-1">
              {siteConfig.founders.map((f) => (
                <span key={f.name} className="text-sm">
                  <span className="text-[var(--color-accent)]">{f.name}</span>
                  {" — "}
                  <a href={f.phoneHref} className="text-[#bdb7ad] hover:text-white transition-colors">
                    {f.phone}
                  </a>
                </span>
              ))}
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="block mt-3 text-sm text-[#bdb7ad] hover:text-white transition-colors"
            >
              {siteConfig.contact.email}
            </a>
            <ul className="mt-6 flex gap-4">
              {siteConfig.social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="text-xs uppercase tracking-[0.14em] text-[#7a756f] hover:text-white transition-colors"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alt çizgi — copyright */}
      <div style={{ background: "#141210" }} className="py-6">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5a5957]">
            © {new Date().getFullYear()} {siteConfig.legal.companyName}. Tüm
            hakları saklıdır.
          </p>
          <p className="text-xs text-[#5a5957]">
            Mimarlık · Mühendislik
          </p>
        </div>
      </div>
    </footer>
  );
}
