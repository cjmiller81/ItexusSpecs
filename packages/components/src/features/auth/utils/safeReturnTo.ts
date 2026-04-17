/**
 * Harden a user-supplied `return_to` / `returnTo` query parameter against
 * open-redirect abuse.
 *
 * Rules:
 *   - Relative same-origin paths (starting with "/") are preserved, except
 *     protocol-relative strings ("//evil.com/...") which are rejected.
 *   - Absolute URLs are only preserved when their origin matches the current
 *     browser origin. Otherwise the fallback is returned.
 *   - Any parse error or empty input returns the fallback.
 *
 * The fallback defaults to "/" (application home).
 */
export const safeReturnTo = (
  value: string | string[] | undefined | null,
  fallback: string = "/",
): string => {
  if (!value) return fallback
  const candidate = Array.isArray(value) ? value[0] : value
  if (!candidate || typeof candidate !== "string") return fallback

  // Protocol-relative URLs could redirect off-site ("//evil.com/x").
  if (candidate.startsWith("//")) return fallback

  // Same-origin relative path — safe.
  if (candidate.startsWith("/")) return candidate

  // Absolute URL — require same origin.
  if (typeof window === "undefined") return fallback

  try {
    const parsed = new URL(candidate, window.location.href)
    if (parsed.origin === window.location.origin) {
      return parsed.pathname + parsed.search + parsed.hash
    }
  } catch {
    // Fall through.
  }

  return fallback
}
