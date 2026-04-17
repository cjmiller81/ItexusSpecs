/**
 * Minimal structured logger for the auth layer.
 *
 * Goals:
 *   - Keep production output silent: flows that fail have deterministic
 *     recovery paths (redirect to /ui/login or /ui/error), so emitting
 *     console noise in prod only helps attackers fingerprint the app.
 *   - Still surface information in development so integrators can debug.
 *
 * Swap the implementation out for a real telemetry sink (Sentry, Datadog,
 * etc.) by changing this file — all call sites already route through it.
 */

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV !== "production"

type Args = unknown[]

export const authLogger = {
  debug: (...args: Args): void => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug("[auth]", ...args)
    }
  },
  warn: (...args: Args): void => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn("[auth]", ...args)
    }
  },
  error: (...args: Args): void => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error("[auth]", ...args)
    }
  },
}
