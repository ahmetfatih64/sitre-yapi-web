export const CONSENT_COOKIE = "sitre.consent.v1";
export const CURRENT_CONSENT_POLICY_VERSION = "2026-04-14";

export type ConsentCategory = "functional" | "analytics" | "marketing";

export interface ConsentState {
  /** Functional is always true — required for the site to work. */
  functional: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of last decision. */
  decidedAt: string | null;
  /** Policy version the user consented against. */
  policyVersion: string;
}

export const DEFAULT_CONSENT: ConsentState = {
  functional: true,
  analytics: false,
  marketing: false,
  decidedAt: null,
  policyVersion: CURRENT_CONSENT_POLICY_VERSION,
};

export function acceptAll(): ConsentState {
  return {
    functional: true,
    analytics: true,
    marketing: true,
    decidedAt: new Date().toISOString(),
    policyVersion: CURRENT_CONSENT_POLICY_VERSION,
  };
}

export function rejectAll(): ConsentState {
  return {
    functional: true,
    analytics: false,
    marketing: false,
    decidedAt: new Date().toISOString(),
    policyVersion: CURRENT_CONSENT_POLICY_VERSION,
  };
}

export function customConsent(
  analytics: boolean,
  marketing: boolean
): ConsentState {
  return {
    functional: true,
    analytics,
    marketing,
    decidedAt: new Date().toISOString(),
    policyVersion: CURRENT_CONSENT_POLICY_VERSION,
  };
}

export function hasDecided(state: ConsentState | null | undefined): boolean {
  return Boolean(state?.decidedAt);
}
