"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ACTORS = ["owner", "admin", "editor", "sales"] as const;
type Actor = (typeof ACTORS)[number];

export function DevLogin() {
  const router = useRouter();
  const [actor, setActor] = useState<Actor>("owner");

  function login() {
    document.cookie = `x-dev-actor=${actor}; Path=/; Max-Age=86400; SameSite=Lax`;
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-brand-soft)]">
        Geliştirme oturumu — bir rol seç ve giriş yap. Bu mekanizma yalnızca
        NODE_ENV=development&apos;ta çalışır.
      </p>
      <select
        value={actor}
        onChange={(e) => setActor(e.target.value as Actor)}
        className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm"
      >
        {ACTORS.map((a) => (
          <option key={a} value={a}>
            {a.toUpperCase()}
          </option>
        ))}
      </select>
      <button onClick={login} className="btn btn-primary">
        Giriş yap
      </button>
    </div>
  );
}
