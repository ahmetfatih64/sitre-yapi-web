# Claude / Ajan Ekosistemi — Yerel Repolar Özeti

Bu dosya, `repos` klasöründeki projelerin **Claude Code**, **MCP**, **AGENTS.md** ve ajan odaklı geliştirme açısından ne işe yaradığını özetler. Tarih: 2026-04-11.

---

## Hızlı karşılaştırma

| Proje (yerel klasör) | Upstream (GitHub) | Claude ile ilişki |
|----------------------|-------------------|-------------------|
| `claude-code-main/claude-code-main` | [anthropics/claude-code](https://github.com/anthropics/claude-code) | Resmi terminal/IDE ajan aracı; eklenti kaynakları |
| `everything-claude-code-main/everything-claude-code-main` | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | Üretim odaklı beceri, ajan, hook, kural kataloğu (ECC) |
| `dify-main/dify-main` | [langgenius/dify](https://github.com/langgenius/dify) | LLM uygulama platformu; `AGENTS.md` + Claude Code GitHub Action (i18n) |
| `paperclip-master/paperclip-master` | paperclipai/paperclip (fork notları repoda) | AI şirketleri için kontrol düzlemi; çoklu ajan adaptörleri (Claude dahil) |
| `mcp_excalidraw-main/mcp_excalidraw-main` | [yctimlin/mcp_excalidraw](https://github.com/yctimlin/mcp_excalidraw) | Excalidraw için MCP sunucusu + taşınabilir agent skill |

---

## 1. Claude Code (resmi) — `claude-code-main/claude-code-main`

### Ne işe yarar?

Terminalde ve IDE’de çalışan **ajanik kodlama aracı**: kod tabanını anlama, rutin işleri yürütme, git akışları, doğal dil komutları. GitHub’da `@claude` ile de kullanım senaryosu var.

### Teknik notlar

- Kurulum: resmi dokümantasyon önerisi — `install.sh` / `install.ps1`, Homebrew, WinGet; **npm global kurulum “deprecated”** olarak işaretlenmiş.
- Paket: `@anthropic-ai/claude-code` (npm üzerinden sürüm rozeti README’de).
- Repo içeriği: **örnek ayarlar**, **hook örnekleri**, **MDM/policy örnekleri**, **Dev Container**, GitHub issue şablonları, **resmi eklentiler** (`plugins/`).

### Eklenti sistemi (`plugins/README.md`)

Örnek eklentiler: `feature-dev` (7 fazlı özellik geliştirme, `code-explorer` / `code-architect` / `code-reviewer`), `code-review` ve `pr-review-toolkit` (PR inceleme ajanları), `commit-commands`, `plugin-dev` (eklenti geliştirme becerileri), `security-guidance` (PreToolUse güvenlik hook’u), `hookify`, `ralph-wiggum` (döngüsel iterasyon), `frontend-design`, `agent-sdk-dev`, `claude-opus-4-5-migration`, vb.

Standart yapı: `.claude-plugin/plugin.json`, isteğe bağlı `commands/`, `agents/`, `skills/`, `hooks/`, `.mcp.json`.

### Ajan / geliştirici için pratik

- Öğrenme ve entegrasyon için önce [Claude Code dokümantasyonu](https://code.claude.com/docs/en/overview) ve [eklenti dokümantasyonu](https://docs.claude.com/en/docs/claude-code/plugins).
- Kendi projenizde eklenti desenlerini kopyalarken bu repodaki `plugins/*` yapısını referans alın.

---

## 2. Everything Claude Code (ECC) — `everything-claude-code-main/everything-claude-code-main`

### Ne işe yarar?

Claude Code ve diğer “harness”lar (Codex, Cursor, OpenCode, Gemini, …) için **genişletilmiş üretim sistemi**: çok sayıda özelleşmiş ajan, skill, komut, hook, kural, MCP yapılandırması. Hackathon odaklı büyümüş bir topluluk/ecosystem reposu; npm paketleri (`ecc-universal`, `ecc-agentshield` vb.) ve harici “guide” içerikleri README’de özetleniyor.

### `AGENTS.md` özeti (bu repoda)

- İlkeler: ajan öncelikli delegasyon, TDD, güvenlik, immutability, planla-sonra-uygula.
- Onlarca isimlendirilmiş ajan (ör. `planner`, `architect`, `tdd-guide`, `code-reviewer`, `security-reviewer`, dil-özel reviewer/build-resolver’lar).
- **%80+ test kapsamı** ve red → green → refactor TDD akışı vurgulanıyor.
- **Yüzey politikası:** `skills/` kanonik; `commands/` miras / uyumluluk için.
- Dizin haritası: `agents/`, `skills/`, `commands/`, `hooks/`, `rules/`, `scripts/`, `mcp-configs/`, `tests/`; ayrıca `ecc2/` altında Rust kontrol düzlemi prototipi (alpha) bahsi.

### Ajan / geliştirici için pratik

- Tek bir “kurallar dosyası” yerine **ECC’yi kütüphane gibi** kullanın: ihtiyaç duyduğunuz dil/alan ajanını ve skill’i seçip kendi `.cursor/rules` veya Claude proje ayarlarınıza uyarlayın.
- README’deki rehberler (shorthand / longform / security) kurulum ve token bellek stratejileri için dış kaynak.

---

## 3. Dify — `dify-main/dify-main`

### Ne işe yarar?

Açık kaynak **LLM uygulama platformu**: arayüz üzerinden ajanik iş akışları, RAG, model yönetimi. Kod: **Python Flask API** (`api/`, DDD), **Next.js** (`web/`), **Docker** (`docker/`).

### Claude ile doğrudan bağlantılar

- Kök [`AGENTS.md`](dify-main/dify-main/AGENTS.md): proje özeti, backend/frontend alt rehberlere yönlendirme, TDD, tip güvenliği, i18n kuralı (`web/i18n/en-US/`).
- [`api/AGENTS.md`](dify-main/dify-main/api/AGENTS.md): modül/fonksiyon docstring’lerinin **spesifikasyon parçası** olduğu; yorumları kodla çeliştiğinde kaynağın kod olduğu kuralları.
- [`web/AGENTS.md`](dify-main/dify-main/web/AGENTS.md): overlay migrasyonu, query/mutation kalıpları, `frontend-testing` skill’inin zorunlu referans olması.
- GitHub Actions: **“Translate i18n Files with Claude Code”** — `anthropics/claude-code-action` ile `en-US` değişikliklerinden çevirileri senkronlama (`.github/workflows/translate-i18n-claude.yml`).
- Proje içi `.agents/skills/` (ör. frontend-testing) Claude ile test üretimi için yazılmış skill örnekleri.

### Ajan / geliştirici için pratik

- Dify’de çalışırken **mutlaka** dokunduğunuz katmanın `AGENTS.md` dosyasını okuyun.
- UI metni eklerken İngilizce JSON kaynaklarına yazın; çeviri otomasyonu Claude Code pipeline’ına bağlı.

---

## 4. Paperclip — `paperclip-master/paperclip-master`

### Ne işe yarar?

**AI ajan şirketleri için kontrol düzlemi** (görevler, onaylar, bütçe, aktivite logları). V1 uygulama sözleşmesi `doc/SPEC-implementation.md` içinde.

### Teknik yığın

- `server/`: Express REST API
- `ui/`: React + Vite
- `packages/db/`: Drizzle, migrasyonlar
- `packages/shared/`, `packages/adapters/`: **Claude, Codex, Cursor** vb. ajan adaptörleri
- Geliştirme: `pnpm`; yerel DB için `DATABASE_URL` boş bırakılınca PGlite

### `AGENTS.md` vurguları

- Önce okunacak doküman sırası: `GOAL`, `PRODUCT`, `SPEC-implementation`, `DEVELOPING`, `DATABASE`.
- Şirket kapsamı (multi-tenant) ve API sözleşmelerinin katmanlar arası senkronu zorunlu.
- PR şablonu: “Thinking Path”, “Model Used” dahil tüm bölümler doldurulacak.
- Repoda **fork’a özel** bölüm (HenkDz): Hermes adaptörünün plugin ile dışlanması, port 3101+, Windows/NTFS uyarıları.

### Ajan / geliştirici için pratik

- Paperclip’te özellik eklerken önce `doc/SPEC-implementation.md` ile hizayı kontrol edin.
- Adaptör veya ajan API’si değişiyorsa `packages/shared` + `server` + `ui` birlikte güncellenmeli.

---

## 5. MCP Excalidraw — `mcp_excalidraw-main/mcp_excalidraw-main`

### Ne işe yarar?

Canlı **Excalidraw tuvali** + **MCP (stdio)** ile ajanların diyagram üzerinde CRUD, sahne tanıma, ekran görüntüsü, snapshot, Mermaid içe aktarma vb. yapmaları. Resmi Excalidraw MCP’sinden farkı: kalıcı tuval, öğe düzeyi kontrol, geri bildirim döngüsü (`describe_scene`, `get_canvas_screenshot`).

### Bileşenler

- Tuval sunucusu (varsayılan `http://localhost:3000`)
- MCP sunucusu: `EXPRESS_SERVER_URL` ile tuvala bağlanır
- İsteğe bağlı **agent skill** (`skills/excalidraw-skill/`): MCP yoksa REST’e düşebilir

### İstemci uyumu

README: Claude Desktop, Claude Code, Cursor, Codex CLI, OpenCode, Antigravity vb. için yapılandırma bölümleri.

### Ajan / geliştirici için pratik

- Diyagram gerektiren mimari dokümantasyon veya iteratif “çiz → gör → düzelt” akışları için MCP + tuvali birlikte çalıştırın.
- Ağa açmadan önce güvenlik notu: varsayılan localhost; `0.0.0.0` için erişim kontrolü gerekir.

---

## Birlikte düşünme (önerilen rol ayrımı)

| İhtiyaç | Ana kaynak |
|---------|------------|
| Resmi araç, eklenti şeması, Agent SDK yolu | `claude-code-main` |
| Hazır ajan/skill/kural kütüphanesi ve çoklu IDE stratejisi | `everything-claude-code-main` |
| Ürün içi LLM/RAG platformu ve ekip AGENTS kuralları | `dify-main` |
| Ajan ekiplerini yöneten kontrol düzlemi ve adaptörler | `paperclip-master` |
| Görsel diyagram ve MCP araçları | `mcp_excalidraw-main` |

---

## Bu `agent.md` dosyası için kullanım

Bunu kendi ajanınıza veya Cursor/Claude proje talimatlarına şu şekilde bağlayabilirsiniz: “Önce `agent.md` içindeki ilgili repo bölümünü oku; derin kurallar için o projenin kendi `AGENTS.md` dosyasına in.”

Yerel kopyalar upstream’den geride kalabilir; kritik davranış için ilgili GitHub `main` dalını ve resmi dokümantasyonu doğrulayın.
