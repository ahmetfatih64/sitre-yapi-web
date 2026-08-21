/**
 * Static redirect table. Moves to `redirects` DB table in a later phase;
 * interface stays stable so callers don't change.
 */
export interface RedirectRule {
  from: string;
  to: string;
  statusCode: 301 | 302 | 307 | 308;
}

export const redirects: RedirectRule[] = [
  // Example: { from: "/eski-yol", to: "/projeler", statusCode: 301 },
];

const byFrom = new Map(redirects.map((r) => [r.from, r]));

export function lookupRedirect(pathname: string): RedirectRule | undefined {
  return byFrom.get(pathname);
}
