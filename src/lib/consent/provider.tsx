"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CONSENT_COOKIE,
  CURRENT_CONSENT_POLICY_VERSION,
  ConsentState,
  DEFAULT_CONSENT,
  acceptAll,
  customConsent,
  hasDecided,
  rejectAll,
} from "./policy";

interface ConsentContextValue {
  state: ConsentState;
  decided: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  customize: (analytics: boolean, marketing: boolean) => void;
  reopen: () => void;
  prefsOpen: boolean;
  closePrefs: () => void;
}

const Ctx = createContext<ConsentContextValue | null>(null);

function readCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1];
  if (!raw) return null;
  try {
    const decoded = JSON.parse(decodeURIComponent(raw)) as ConsentState;
    if (decoded.policyVersion !== CURRENT_CONSENT_POLICY_VERSION) return null;
    return decoded;
  } catch {
    return null;
  }
}

function writeCookie(state: ConsentState) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(state));
  const sixMonths = 60 * 60 * 24 * 180;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${sixMonths}; SameSite=Lax${secure}`;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>(DEFAULT_CONSENT);
  const [decided, setDecided] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    const existing = readCookie();
    if (existing && hasDecided(existing)) {
      setState(existing);
      setDecided(true);
    }
  }, []);

  const commit = useCallback((next: ConsentState) => {
    setState(next);
    setDecided(true);
    setPrefsOpen(false);
    writeCookie(next);
    // Broadcast so analytics/marketing scripts can mount/unmount.
    window.dispatchEvent(new CustomEvent("consentchange", { detail: next }));
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      decided,
      acceptAll: () => commit(acceptAll()),
      rejectAll: () => commit(rejectAll()),
      customize: (a, m) => commit(customConsent(a, m)),
      reopen: () => setPrefsOpen(true),
      prefsOpen,
      closePrefs: () => setPrefsOpen(false),
    }),
    [state, decided, prefsOpen, commit]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConsent(): ConsentContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useConsent must be used within ConsentProvider");
  return v;
}
