/** Default password when `SITE_PASSWORD` is not set. Override via env in production. */
export const DEFAULT_SITE_PASSWORD = "house";

/** Default session cookie value when `SITE_AUTH_TOKEN` is not set. Override via env in production. */
const DEFAULT_SITE_AUTH_TOKEN = "pom-dashboard-default-site-auth-token-v1";

export type SiteAuthConfig = { password: string; token: string };

/**
 * Returns password + cookie token when site auth is enabled.
 * Returns null when `SITE_AUTH_DISABLED` is set (open site, no gate).
 */
export function getSiteAuthConfig(): SiteAuthConfig | null {
  if (process.env.SITE_AUTH_DISABLED === "1" || process.env.SITE_AUTH_DISABLED === "true") {
    return null;
  }
  const password = process.env.SITE_PASSWORD?.length
    ? process.env.SITE_PASSWORD
    : DEFAULT_SITE_PASSWORD;
  const token = process.env.SITE_AUTH_TOKEN?.length
    ? process.env.SITE_AUTH_TOKEN
    : DEFAULT_SITE_AUTH_TOKEN;
  return { password, token };
}
