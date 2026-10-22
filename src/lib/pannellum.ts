/**
 * Pannellum 360° görüntüleyicisini isteğe bağlı yükler.
 *
 * Görüntüleyici ve panorama yalnızca kullanıcı turu başlattığında indirilir;
 * sayfa açılışında hiçbir maliyeti yoktur. Dosyalar kendi sunucumuzdan
 * gelir (`public/vendor/pannellum/`), bkz. oradaki README.
 */

export type PannellumViewer = {
  destroy: () => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
};

type PannellumApi = {
  viewer: (
    container: HTMLElement | string,
    config: Record<string, unknown>
  ) => PannellumViewer;
};

declare global {
  interface Window {
    pannellum?: PannellumApi;
  }
}

const SCRIPT_SRC = "/vendor/pannellum/pannellum.js";
const STYLE_HREF = "/vendor/pannellum/pannellum.css";

/** Aynı anda birden çok çağrı gelse de dosyalar bir kez indirilir. */
let loading: Promise<PannellumApi> | null = null;

function injectStyle(): void {
  if (document.querySelector(`link[href="${STYLE_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = STYLE_HREF;
  document.head.appendChild(link);
}

export function loadPannellum(): Promise<PannellumApi> {
  if (window.pannellum) return Promise.resolve(window.pannellum);
  if (loading) return loading;

  loading = new Promise<PannellumApi>((resolve, reject) => {
    injectStyle();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    const script = existing ?? document.createElement("script");

    const onLoad = () => {
      if (window.pannellum) resolve(window.pannellum);
      else reject(new Error("pannellum yüklendi ama window.pannellum tanımsız"));
    };
    const onError = () => {
      // Sonraki denemenin yeniden indirebilmesi için önbelleği boşalt.
      loading = null;
      script.remove();
      reject(new Error("pannellum indirilemedi"));
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });

    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return loading;
}

/**
 * Cihazın WebGL doku sınırı. Panorama bu sınırı aşarsa görüntüleyici
 * boş/bozuk görüntü verir, bu yüzden boyut buna göre seçilir.
 * WebGL yoksa 0 döner.
 */
export function maxTextureSize(): number {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return 0;
    const size: unknown = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    return typeof size === "number" ? size : 0;
  } catch {
    return 0;
  }
}

/**
 * Hangi panorama dosyasının yükleneceğine karar verir.
 * Dar ekranda bant genişliği için, düşük doku sınırında ise zorunluluktan
 * küçük sürüm seçilir.
 */
export function pickPanorama(options: {
  wide: string;
  narrow: string;
  viewportWidth: number;
  maxTexture: number;
  /** `wide` dosyasının piksel genişliği. */
  wideWidth?: number;
}): string {
  const { wide, narrow, viewportWidth, maxTexture, wideWidth = 4096 } = options;
  if (maxTexture > 0 && maxTexture < wideWidth) return narrow;
  if (viewportWidth < 768) return narrow;
  return wide;
}
