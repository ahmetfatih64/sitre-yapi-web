import { test, expect } from "@playwright/test";

/** Çerez barı tıklamaları engelliyor; testlerden önce kapatılır. */
async function dismissConsent(page: import("@playwright/test").Page) {
  const accept = page.getByRole("button", { name: /tümünü kabul et/i });
  if (await accept.isVisible().catch(() => false)) await accept.click();
}

test.describe("proje rayı", () => {
  test("ok düğmeleri sayaç ve konumu ilerletir", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);

    const rail = page.locator(".rail");
    await rail.scrollIntoViewIfNeeded();

    const next = page.getByRole("button", { name: "Sonraki proje" });
    const prev = page.getByRole("button", { name: "Önceki proje" });

    // İlk kartta önceki devre dışı olmalı
    await expect(prev).toBeDisabled();

    const startX = await rail.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect
      .poll(() => rail.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(startX);

    await expect(prev).toBeEnabled();
  });

  test("kartlar dinlenirken özeti gizler, işaretlenince açar", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);

    const card = page.locator(".slide-card").first();
    await card.scrollIntoViewIfNeeded();
    const reveal = card.locator(".slide-card__reveal");

    await expect.poll(() => reveal.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await card.hover();
    await expect.poll(() => reveal.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });

  test("kart künyesinde teslim ibaresi tekrarlanmaz", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);
    const kunye = await page.locator(".slide-card .eyebrow").allTextContents();
    expect(kunye.length).toBeGreaterThan(0);
    for (const text of kunye) {
      expect(text.toLocaleLowerCase("tr")).not.toContain("teslim teslim");
    }
  });
});

test.describe("galeri lightbox", () => {
  test("açılır, odağı içeride tutar ve Escape ile kapanır", async ({ page }) => {
    await page.goto("/projeler/sitre-urla-konaklari");
    await dismissConsent(page);

    await page.locator("#galeri").scrollIntoViewIfNeeded();
    await page.locator("#galeri button").filter({ has: page.locator("img") }).first().click();

    const dialog = page.locator('[aria-label="Galeri büyük görünüm"]');
    await expect(dialog).toBeVisible();

    // Odak tuzağı: birkaç Tab sonrasında hâlâ diyalog içinde olmalı
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () => !!document.activeElement?.closest('[aria-label="Galeri büyük görünüm"]')
      );
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("harita çerez onayı", () => {
  test("onay verilmeden iframe yüklenmez", async ({ page }) => {
    const externalHosts: string[] = [];
    page.on("request", (r) => {
      const host = new URL(r.url()).host;
      if (!host.includes("localhost")) externalHosts.push(host);
    });

    await page.goto("/iletisim");
    await page.getByRole("button", { name: /reddet/i }).click();
    await page.waitForTimeout(1500);

    await expect(page.locator(".map-consent")).toBeVisible();
    expect(await page.locator("iframe").count()).toBe(0);
    expect(externalHosts.filter((h) => h.includes("google"))).toHaveLength(0);
  });

  test("elle yüklendiğinde harita gelir", async ({ page }) => {
    await page.goto("/iletisim");
    await page.getByRole("button", { name: /reddet/i }).click();
    await page.getByRole("button", { name: /haritayı yükle/i }).click();
    await expect(page.locator("iframe")).toHaveCount(1);
  });
});

test.describe("hero videosu", () => {
  test("duraklatılıp yeniden oynatılabilir", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);

    const toggle = page.getByRole("button", { name: "Videoyu duraklat" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Videoyu oynat" })).toBeVisible();
    expect(await page.evaluate(() => document.querySelector("video")!.paused)).toBe(true);

    await page.getByRole("button", { name: "Videoyu oynat" }).click();
    await expect(page.getByRole("button", { name: "Videoyu duraklat" })).toBeVisible();
  });

  test("hareket azaltma tercihinde otomatik oynamaz", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(2000);
    expect(await page.evaluate(() => document.querySelector("video")!.paused)).toBe(true);
    await context.close();
  });
});

test.describe("proje filtresi", () => {
  test("duruma göre süzer", async ({ page }) => {
    await page.goto("/projeler");
    await dismissConsent(page);

    const all = await page.locator(".slide-card").count();
    expect(all).toBeGreaterThan(1);

    await page.getByRole("button", { name: "Aktif Satış", exact: true }).click();
    await expect.poll(() => page.locator(".slide-card").count()).toBeLessThan(all);

    await page.getByRole("button", { name: "Tümü", exact: true }).click();
    await expect.poll(() => page.locator(".slide-card").count()).toBe(all);
  });
});

test.describe("gizli mobil menü", () => {
  test("masaüstünde klavye odağı almaz", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);

    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const inDrawer = await page.evaluate(
        () => !!document.activeElement?.closest("#mobile-nav")
      );
      expect(inDrawer).toBe(false);
    }
  });
});

test.describe("kat planı", () => {
  const PLAN_URL = "/projeler/sitre-urla-konaklari#planlar";

  test("şematik plan oda adlarını ve alanlarını gösterir", async ({ page }) => {
    await page.goto(PLAN_URL);
    await dismissConsent(page);

    const plan = page.locator("#planlar svg[role='img']").first();
    await plan.scrollIntoViewIfNeeded();
    await expect(plan).toBeVisible();

    // Plan veriden üretildiği için oda adı ve m² hem planda hem listede olmalı.
    await expect(plan.getByText("Salon", { exact: true })).toBeVisible();
    await expect(plan.getByText("44 m²", { exact: true })).toBeVisible();

    await expect(
      page.getByText(/şematik gösterim/i).first()
    ).toBeVisible();
  });

  test("oda listesine odaklanmak plandaki odayı vurgular", async ({ page }) => {
    await page.goto(PLAN_URL);
    await dismissConsent(page);

    const section = page.locator("#planlar");
    await section.scrollIntoViewIfNeeded();

    const salon = section.getByRole("button", { name: /^Salon/ }).first();
    await expect(salon).toHaveAttribute("aria-pressed", "false");

    await salon.hover();
    await expect(salon).toHaveAttribute("aria-pressed", "true");
  });

  test("kuzey oku cephe yönüne göre döner", async ({ page }) => {
    await page.goto(PLAN_URL);
    await dismissConsent(page);

    const plan = page.locator("#planlar svg[role='img']").first();
    await plan.scrollIntoViewIfNeeded();

    // A-Tipi cephesi Güney-Batı → 225°
    await expect(plan.locator("g[transform='rotate(225)']")).toHaveCount(1);
  });

  test("karşılaştırma görünümü planları kolon kolon listeler", async ({ page }) => {
    await page.goto(PLAN_URL);
    await dismissConsent(page);

    const toggle = page.getByRole("button", { name: "Planları karşılaştır" });
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();

    const table = page.locator("#planlar table");
    await expect(table).toBeVisible();

    // Her plan tipi bir kolon başlığı olmalı
    await expect(table.getByRole("columnheader", { name: "A-Tipi" })).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "B-Tipi" })).toBeVisible();

    // Metrik satırları hizalı karşılaştırma için şart
    await expect(table.getByRole("rowheader", { name: "Brüt alan" })).toBeVisible();
    await expect(table.getByRole("rowheader", { name: "Net alan" })).toBeVisible();

    await page.getByRole("button", { name: "Tek plan görünümü" }).click();
    await expect(table).toBeHidden();
  });
});

test.describe("sanal tur", () => {
  const TOUR_URL = "/projeler/sitre-urla-konaklari#sanal-tur";

  test("görüntüleyici ve panorama sayfa açılışında indirilmez", async ({ page }) => {
    const heavy: string[] = [];
    page.on("request", (r) => {
      const url = r.url();
      if (url.includes("pannellum") || url.includes("panorama-")) heavy.push(url);
    });

    await page.goto(TOUR_URL);
    await dismissConsent(page);
    await page.locator("#sanal-tur").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("button", { name: "Sanal turu başlat" })
    ).toBeVisible();

    // Kapak görünürken bile ağır dosyalar beklemede kalmalı.
    expect(heavy).toEqual([]);
  });

  test("turu başlatınca görüntüleyici açılır ve kapatılabilir", async ({ page }) => {
    await page.goto(TOUR_URL);
    await dismissConsent(page);

    const section = page.locator("#sanal-tur");
    await section.scrollIntoViewIfNeeded();

    await page.getByRole("button", { name: "Sanal turu başlat" }).click();

    const close = page.getByRole("button", { name: "Turu kapat" });
    await expect(close).toBeVisible({ timeout: 30000 });
    await expect(section.locator("canvas")).toBeVisible();

    await close.click();
    await expect(
      page.getByRole("button", { name: "Sanal turu başlat" })
    ).toBeVisible();
  });

  test("temsilî görsel olduğu ve kaynağı belirtilir", async ({ page }) => {
    await page.goto(TOUR_URL);
    await dismissConsent(page);
    await page.locator("#sanal-tur").scrollIntoViewIfNeeded();

    await expect(
      page.getByText(/Temsilî görselleştirme.*Poly Haven.*CC0/i)
    ).toBeVisible();
  });
});

test.describe("içerik güvenlik politikası", () => {
  /**
   * Bu testler üretimde tüm JavaScript'i engelleyen bir hatanın nöbetçisidir:
   * nonce'lu politika yalnızca dinamik render edilen rotalarda çalışır,
   * statik üretilen sayfalarda script'ler nonce taşıyamaz ve `strict-dynamic`
   * `'self'` kaynağını yok saydığı için sayfa hiç hidratlanmaz.
   */
  async function scriptSrc(page: import("@playwright/test").Page, path: string) {
    const res = await page.request.get(path, { maxRedirects: 0 });
    const csp = res.headers()["content-security-policy"];
    expect(csp, `${path} için CSP başlığı yok`).toBeTruthy();
    const directive = csp
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("script-src"));
    expect(directive, `${path} için script-src yok`).toBeTruthy();
    return directive as string;
  }

  test("statik sayfalar nonce'suz politika alır", async ({ page }) => {
    const directive = await scriptSrc(page, "/projeler/sitre-urla-konaklari");
    expect(directive).not.toContain("strict-dynamic");
    expect(directive).not.toContain("nonce-");
    expect(directive).toContain("'self'");
  });

  test("dinamik rotalar nonce'lu katı politika alır", async ({ page }) => {
    const directive = await scriptSrc(page, "/admin");
    expect(directive).toContain("strict-dynamic");
    expect(directive).toMatch(/'nonce-[^']+'/);
    expect(directive).not.toContain("'unsafe-inline'");
  });

  test("sayfa yüklenirken CSP ihlali oluşmaz", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (m) => {
      if (/Content Security Policy|Refused to (load|execute)/i.test(m.text())) {
        violations.push(m.text().slice(0, 160));
      }
    });

    await page.goto("/projeler/sitre-urla-konaklari");
    await dismissConsent(page);
    // Etkileşimin gerçekten çalıştığı, yani hidratlandığı kanıtı.
    await page.locator("#planlar").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Planları karşılaştır" }).click();
    await expect(page.locator("#planlar table")).toBeVisible();

    expect(violations).toEqual([]);
  });
});

test.describe("etiket süzgeci", () => {
  test("etiket seçimi listeyi daraltır ve URL'ye yazılır", async ({ page }) => {
    await page.goto("/projeler");
    await dismissConsent(page);

    const cards = page.locator(".slide-card");
    const all = await cards.count();
    expect(all).toBeGreaterThan(1);

    await page.getByRole("button", { name: "Doğa", exact: true }).click();
    await expect.poll(() => cards.count()).toBeLessThan(all);
    // Dev sunucusunda router.replace bir RSC isteği tetikler; paralel koşuda
    // varsayılan 5 sn'yi aşabiliyor. Belirlenimci bekleme kullanılır.
    await page.waitForURL(/etiket=/, { timeout: 20_000 });
  });

  test("birden çok etiket 'veya' olarak birleşir", async ({ page }) => {
    await page.goto("/projeler");
    await dismissConsent(page);
    const cards = page.locator(".slide-card");

    const all = await cards.count();
    await page.getByRole("button", { name: "Doğa", exact: true }).click();
    await expect.poll(() => cards.count()).toBeLessThan(all);
    const tek = await cards.count();

    await page.getByRole("button", { name: "Modern", exact: true }).click();
    // İkinci etiket listeyi genişletmeli; ilk seçim kaybolmamalı.
    await expect.poll(() => cards.count()).toBeGreaterThan(tek);
    await expect(
      page.getByRole("button", { name: "Doğa", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("filtrelenmiş adres paylaşılabilir", async ({ page }) => {
    await page.goto("/projeler?durum=active&etiket=Konut");
    await dismissConsent(page);

    await expect(
      page.getByRole("button", { name: "Aktif Satış", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "Konut", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".slide-card")).toHaveCount(1);
  });

  test("geçersiz süzgeç değeri sayfayı bozmaz", async ({ page }) => {
    await page.goto("/projeler?durum=uydurma&etiket=OlmayanEtiket");
    await dismissConsent(page);

    // Tanınmayan değerler yok sayılır, tüm projeler listelenir.
    await expect(
      page.getByRole("button", { name: "Tümü", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".slide-card").first()).toBeVisible();
  });

  test("süzgeci temizle başlangıca döndürür", async ({ page }) => {
    await page.goto("/projeler");
    await dismissConsent(page);
    const cards = page.locator(".slide-card");
    const all = await cards.count();

    await page.getByRole("button", { name: "Doğa", exact: true }).click();
    await expect.poll(() => cards.count()).toBeLessThan(all);

    await page.getByRole("button", { name: "Süzgeci temizle" }).click();
    await expect.poll(() => cards.count()).toBe(all);
    await page.waitForURL((url) => !/etiket=|durum=/.test(url.search), {
      timeout: 20_000,
    });
  });
});

test.describe("inşaat ilerlemesi", () => {
  test("aktif projede aşamalar ve hesaplanan yüzde görünür", async ({ page }) => {
    await page.goto("/projeler/sitre-urla-konaklari");
    await dismissConsent(page);

    const section = page.locator("#ilerleme");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    // Yüzde veriden hesaplanır: 9 aşamanın 3'ü bitti + 1 sürüyor = %39
    await expect(section.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "39"
    );
    await expect(section.getByText("9 aşamanın 3 tanesi tamamlandı")).toBeVisible();
    await expect(section.getByRole("listitem")).toHaveCount(9);
  });

  test("süren aşama tek ve işaretli olur", async ({ page }) => {
    await page.goto("/projeler/sitre-urla-konaklari");
    await dismissConsent(page);
    const section = page.locator("#ilerleme");
    await section.scrollIntoViewIfNeeded();

    await expect(section.getByText("Sürüyor", { exact: true })).toHaveCount(1);
  });

  test("tamamlanmış projede ilerleme yüzde 100'dür", async ({ page }) => {
    await page.goto("/projeler/sitre-bornova-park");
    await dismissConsent(page);

    const section = page.locator("#ilerleme");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
    await expect(section.getByText("Sürüyor", { exact: true })).toHaveCount(0);
  });

  test("ilerleme verisi olmayan projede bölüm hiç çıkmaz", async ({ page }) => {
    await page.goto("/projeler/sitre-cesme-residence");
    await dismissConsent(page);
    await expect(page.locator("#ilerleme")).toHaveCount(0);
  });
});

test.describe("katalog / baskı", () => {
  const URL = "/projeler/sitre-urla-konaklari";

  test("baskıda ekran kabuğu çıkmaz, katalog künyesi çıkar", async ({ page }) => {
    await page.goto(URL);
    await dismissConsent(page);
    await page.emulateMedia({ media: "print" });

    await expect(page.locator("header[data-print='hide']").first()).toBeHidden();
    await expect(page.locator("footer").first()).toBeHidden();
    await expect(page.locator("#sanal-tur")).toBeHidden();
    await expect(page.locator(".print-cover")).toBeVisible();
  });

  test("sahneleme animasyonu baskıda içeriği gizlemez", async ({ page }) => {
    // Bu kural olmadan katalogun büyük bölümü boş basılır.
    await page.goto(URL);
    await dismissConsent(page);
    await page.emulateMedia({ media: "print" });

    const opacities = await page
      .locator(".reveal")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
    expect(opacities.length).toBeGreaterThan(0);
    expect(opacities.every((o) => o === "1")).toBe(true);
  });

  test("baskıda tüm plan tipleri yer alır", async ({ page }) => {
    await page.goto(URL);
    await dismissConsent(page);
    await page.emulateMedia({ media: "print" });

    const sheets = page.locator(".print-plans__item");
    await expect(sheets).toHaveCount(3);
    await expect(page.locator(".print-plans svg[role='img']")).toHaveCount(3);
    // Plan kodu başlığı görünmeli (semantik <header> yanlışlıkla gizlenmesin).
    await expect(page.locator(".print-plans__header").first()).toBeVisible();
  });

  test("baskıda eylem düğmesi kalmaz ama oda listesi kalır", async ({ page }) => {
    await page.goto(URL);
    await dismissConsent(page);
    await page.emulateMedia({ media: "print" });

    await expect(page.locator(".btn:visible")).toHaveCount(0);
    await expect(
      page.locator(".print-plans").getByText("Salon", { exact: true }).first()
    ).toBeVisible();
  });

  test("ekranda katalog künyesi görünmez", async ({ page }) => {
    await page.goto(URL);
    await dismissConsent(page);
    await expect(page.locator(".print-cover")).toBeHidden();
    await expect(page.locator(".print-plans")).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Kataloğu indir" })
    ).toBeVisible();
  });
});

test.describe("fontlar", () => {
  test("yerel fontlar yüklenir, Google'a istek gitmez", async ({ page }) => {
    const disaridan: string[] = [];
    page.on("request", (r) => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) disaridan.push(r.url());
    });

    await page.goto("/hakkimizda");
    await dismissConsent(page);
    await page.evaluate(() => document.fonts.ready);

    expect(disaridan, "fontlar depodan servis edilmeli").toEqual([]);

    const kaynaklar = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((e) => e.name)
        .filter((n) => /\.woff2?(\?|$)/.test(n))
    );
    expect(kaynaklar.length).toBeGreaterThan(0);

    /**
     * Sözleşme: hiçbir font üçüncü taraftan gelmez. Yol deseni yerine
     * kaynak (origin) karşılaştırılır — geliştirme sunucusu kendi hata
     * katmanı fontunu `/__nextjs_font/` altından servis ediyor ve yola
     * bakan bir kontrol bu yüzden üretimde olmayan bir şeye takılıyordu.
     */
    const disKaynak = kaynaklar.filter(
      (n) => new URL(n).origin !== new URL(page.url()).origin
    );
    expect(disKaynak, "fontlar yalnızca kendi sunucumuzdan gelmeli").toEqual([]);
  });

  test("Türkçe karakterler yerel fonttan gelir", async ({ page }) => {
    /**
     * `latin-ext` alt kümesi atlanırsa ş, ğ, İ, ı yedek fonta düşer ve
     * metin gözle görülür biçimde bozulur. Font Loading API bunu doğrudan
     * söyleyebilir: check() istenen metnin tüm glifleri yüklü yüzlerde
     * varsa true döner.
     */
    await page.goto("/hakkimizda");
    await dismissConsent(page);
    await page.evaluate(() => document.fonts.ready);

    const sonuc = await page.evaluate(() => {
      const gövde = getComputedStyle(document.body).fontFamily.split(",")[0].trim();
      const başlık = getComputedStyle(document.querySelector("h1")!)
        .fontFamily.split(",")[0]
        .trim();
      const tr = "çÇğĞıİöÖşŞüÜ";
      return {
        gövde,
        başlık,
        gövdeKapsar: document.fonts.check(`20px ${gövde}`, tr),
        başlıkKapsar: document.fonts.check(`80px ${başlık}`, tr),
      };
    });

    expect(sonuc.gövdeKapsar, `gövde fontu (${sonuc.gövde}) Türkçe karakterleri kapsamıyor`).toBe(true);
    expect(sonuc.başlıkKapsar, `başlık fontu (${sonuc.başlık}) Türkçe karakterleri kapsamıyor`).toBe(true);
  });

  test("başlık yedek fonta düşmez", async ({ page }) => {
    await page.goto("/hakkimizda");
    await dismissConsent(page);
    await page.evaluate(() => document.fonts.ready);

    const aile = await page.evaluate(
      () => getComputedStyle(document.querySelector("h1")!).fontFamily
    );
    // next/font yerel dosyadan karma aile adı üretir; Georgia'ya düşmemeli.
    expect(aile.split(",")[0].trim().replace(/"/g, "")).not.toMatch(/Georgia|serif/i);
  });
});
