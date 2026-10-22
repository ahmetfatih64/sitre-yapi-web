export type ProcessStep = {
  n: string;
  title: string;
  body: string;
};

/**
 * Çalışma yöntemi. Hem anasayfadaki süreç şeridi hem de Hakkımızda sayfası
 * bu tek kaynağı kullanır.
 */
export const processSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Fikir",
    body: "Arsanın ve bağlamın dilini dinleyerek mimari bir fikir kurarız.",
  },
  {
    n: "02",
    title: "Tasarım",
    body: "Kütle, peyzaj ve iç mekanı bir bütün olarak çözümleriz.",
  },
  {
    n: "03",
    title: "İnşaat",
    body: "Şantiyeyi kendi ekibimizle yönetir; kaliteyi taahhüt altına alırız.",
  },
  {
    n: "04",
    title: "Teslim",
    body: "Teslim bir son değil, başlangıç. Kayıt ve evraklar açık.",
  },
  {
    n: "05",
    title: "Sonrası",
    body: "Teslim sonrası iletişim ve bakım desteğiyle ilişkiyi sürdürürüz.",
  },
];
