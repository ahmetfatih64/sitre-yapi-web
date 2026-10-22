/**
 * JSON-LD'yi <script> blogunda guvenle gomulebilir bicimde serilestirir.
 *
 * `JSON.stringify` `<` karakterini kacirmaz. Veri icindeki bir
 * `</script>` dizisi bu yuzden script blogunu erkenden kapatir ve
 * ardindan gelen her sey calistirilabilir HTML olarak yorumlanir:
 *
 *   name: 'Ev </script><script>...</script>'
 *
 * Proje adi, aciklama ve adres gibi alanlar yonetim panelinden
 * duzenlenebildigi icin bu gercek bir XSS yoludur. `<` karakterini
 * `\u003c` olarak kacirmak diziyi bozar; JSON cozumlemesi ayni kalir.
 *
 * U+2028 / U+2029 ayrica kacirilir: JSON'da gecerli olsalar da eski
 * JavaScript cozumleyicilerinde satir sonu sayilip sozdizimini bozarlar.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
