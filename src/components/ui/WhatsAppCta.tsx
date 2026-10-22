import { siteConfig } from "@/content/site.config";

/**
 * Bağlamı önceden yazılmış WhatsApp bağlantısı.
 *
 * Türkiye'de form doldurmaktan belirgin şekilde yüksek dönüşüm veriyor;
 * ayrıca karşı taraf ilk mesajda hangi proje ve daire tipiyle ilgilenildiğini
 * görüyor, "hangi projeydi?" turu yaşanmıyor.
 */
export function WhatsAppCta({
  contextLabel,
  className,
  children,
}: {
  contextLabel: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const phone = siteConfig.contact.whatsapp.replace(/[^\d]/g, "");
  const text = `Merhaba, ${contextLabel} hakkında bilgi almak istiyorum.`;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`WhatsApp ile sor: ${contextLabel}`}
    >
      {children ?? "WhatsApp'tan sor"}
    </a>
  );
}
