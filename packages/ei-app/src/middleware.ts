import { NextResponse, type NextRequest } from "next/server"

/**
 * Server-side auth gate. Without this, unauthenticated users briefly render
 * protected pages (and fire client-side data requests) before the in-app
 * `OryAuthGateway` redirects them to `/ui/login`.
 *
 * The middleware forwards the incoming cookies to Ory's `/sessions/whoami`
 * endpoint and:
 *   - allows the request through if the session is valid (HTTP 200)
 *   - redirects to `/ui/login?return_to=...` otherwise
 *
 * Ory auth UI routes, Next.js internals and static assets bypass the check
 * via the `matcher` config below and the `PUBLIC_PATH_PREFIXES` list.
 */

const ORY_SDK_URL =
  process.env.ORY_SDK_URL || process.env.NEXT_PUBLIC_ORY_SDK_URL || ""

// Paths that must be reachable without a session.
const PUBLIC_PATH_PREFIXES = [
  "/ui/login",
  "/ui/registration",
  "/ui/recovery",
  "/ui/error",
  "/ui/logout",
  "/ui/settings",
  "/self-service",
]

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATH_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // If Ory isn't configured (e.g. in some local dev setups), fail open so we
  // don't break the app. The client-side gateway will still enforce auth.
  if (!ORY_SDK_URL) {
    return NextResponse.next()
  }

  try {
    const whoami = await fetch(`${ORY_SDK_URL}/sessions/whoami`, {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        accept: "application/json",
      },
      // Ory tokens live on cookies; we forward them above. Avoid Next's fetch
      // cache so revoked sessions are noticed immediately.
      cache: "no-store",
    })

    if (whoami.ok) {
      return NextResponse.next()
    }
  } catch (err) {
    // Network error talking to Ory — treat as unauthenticated rather than
    // exposing protected content.
    console.error("middleware: whoami request failed", err)
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = "/ui/login"
  loginUrl.search = ""
  loginUrl.searchParams.set("return_to", `${pathname}${search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // Run on every request except Next.js internals, the API routes, the MSW
  // service worker, and common static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|json)$).*)",
  ],
}
