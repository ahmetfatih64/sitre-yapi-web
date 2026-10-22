import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site.config";
import { footerNav } from "@/content/navigation";

const columns = [
  { title: "Keşfet", items: footerNav.keşfet },
  { title: "Kurumsal", items: footerNav.kurumsal },
];

export function Footer() {
  return (
    <footer className="site-footer grain" data-print="hide">
      <div className="container-page relative z-[2]">
        {/* Marka bloğu — künye satırı olarak, ince çizgi üstünde */}
        <div className="site-footer__top">
          <Link href="/" className="site-footer__brand" aria-label="Sitre Yapı ana sayfa">
            <Image
              src="/brand/ana_logo.jpeg"
              alt="Sitre Yapı logo"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <span className="site-footer__wordmark">
              <span className="site-footer__name">
                Sitre <span className="text-[var(--color-accent)]">Yapı</span>
              </span>
              <span className="site-footer__discipline-sm">
                Mimarlık - Mühendislik
              </span>
            </span>
          </Link>
          <p className="site-footer__claim">{siteConfig.tagline}</p>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__about">
            <p className="site-footer__desc">{siteConfig.description}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="site-footer__heading">{column.title}</h3>
              <ul className="site-footer__links">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="site-footer__contact">
            <h3 className="site-footer__heading">İletişim</h3>
            <address className="site-footer__address">
              {siteConfig.contact.address.street}
              <br />
              {siteConfig.contact.address.city}, {siteConfig.contact.address.country}
            </address>

            <ul className="site-footer__people">
              {siteConfig.founders.map((person) => (
                <li key={person.phoneHref}>
                  <span className="site-footer__person">{person.name}</span>
                  <a href={person.phoneHref} className="site-footer__link">
                    {person.phone}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="site-footer__mail"
            >
              {siteConfig.contact.email}
            </a>

            <ul className="site-footer__social">
              {siteConfig.social.map((channel) => (
                <li key={channel.platform}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer__social-link"
                  >
                    {channel.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">
        <div className="container-page site-footer__bar-inner">
          <p>
            © {new Date().getFullYear()} {siteConfig.legal.companyName}. Tüm
            hakları saklıdır.
          </p>
          <p className="site-footer__discipline">Mimarlık · Mühendislik</p>
          <a href="#main" className="site-footer__top-link">
            Başa dön
            <span aria-hidden>↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
