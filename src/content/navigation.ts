export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Projeler", href: "/projeler" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "İletişim", href: "/iletisim" },
];

export const footerNav = {
  keşfet: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Projeler", href: "/projeler" },
    { label: "Hizmetler", href: "/hizmetler" },
  ] satisfies NavItem[],
  kurumsal: [
    { label: "İletişim", href: "/iletisim" },
    { label: "KVKK", href: "/kvkk" },
    { label: "Çerez Politikası", href: "/cerez-politikasi" },
  ] satisfies NavItem[],
};
