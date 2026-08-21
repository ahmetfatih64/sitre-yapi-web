export type Service = {
  id: string;
  title: string;
  summary: string;
  body: string;
};

export const services: Service[] = [
  {
    id: "proje-gelistirme",
    title: "Proje Geliştirme",
    summary:
      "Arsa analizinden teslime kadar uzun soluklu bir yapı sürecini tek elden yürütüyoruz.",
    body: "Fizibilite, arsa seçimi, konsept geliştirme ve finansman planlamasında stratejik rolümüzü koruruz. Her projeyi, bulunduğu yerin mimari diliyle kurarız.",
  },
  {
    id: "mimari-danismanlik",
    title: "Mimari Danışmanlık",
    summary:
      "Kütle, cephe, peyzaj ve iç çözümleri bir bütün olarak kurgulayan mimari danışmanlık.",
    body: "Tasarım kararlarının hiçbirinin dekorasyon olmadığı, mekana, malzemeye ve akışa dayanan bir mimari yaklaşımla çalışırız.",
  },
  {
    id: "yapim-ve-taahhut",
    title: "Yapım ve Taahhüt",
    summary:
      "Şantiye yönetimi, maliyet kontrolü ve teslim kalitesinde tek merkezli bir sorumluluk.",
    body: "Planlama, satın alma, saha koordinasyonu ve iş güvenliği süreçlerini kendi ekibimizle yürütür; teslim edilen kaliteyi taahhüt altına alırız.",
  },
  {
    id: "yatirim-danismanligi",
    title: "Yatırım Danışmanlığı",
    summary:
      "Değer, getiri ve süreç şeffaflığı odaklı kurumsal yatırımcı ilişkisi.",
    body: "Kurumsal yatırımcılara portföy seçimi, satış stratejisi ve süreç raporlamasında net bir muhatap olarak çalışırız.",
  },
];
