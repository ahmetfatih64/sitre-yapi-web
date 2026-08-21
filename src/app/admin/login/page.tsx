import { env } from "@/lib/env";
import { DevLogin } from "./DevLogin";

export const metadata = {
  title: "Yönetim Girişi — Sitre Yapı",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] grid place-items-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="eyebrow mb-2">Yönetim Paneli</p>
        <h1 className="text-2xl mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Giriş
        </h1>

        {env.IS_PROD ? (
          <div className="text-sm text-[var(--color-brand-soft)] space-y-3">
            <p>Üretim ortamında giriş için passkey veya kurumsal SSO gereklidir.</p>
            <p className="italic text-xs">
              Auth.js v5 entegrasyonu NEXTAUTH_SECRET ve DATABASE_URL sağlandığında devreye alınır.
            </p>
          </div>
        ) : (
          <DevLogin />
        )}
      </div>
    </div>
  );
}
