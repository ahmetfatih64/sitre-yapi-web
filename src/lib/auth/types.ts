/**
 * Local re-typing of the bits of Auth.js v5 we actually consume. Avoids
 * pulling next-auth into the bundle until the package is installed.
 */
export interface NextAuthConfig {
  session: { strategy: "database" | "jwt"; maxAge?: number };
  pages?: { signIn?: string };
  callbacks?: {
    authorized?(args: {
      auth: { user?: unknown } | null;
      request: { nextUrl: URL };
    }): boolean;
    session?(args: { session: { user?: unknown }; user?: unknown }): unknown;
  };
  events?: {
    signIn?(args: { user?: { id?: string } }): Promise<void>;
  };
  providers: unknown[];
}
