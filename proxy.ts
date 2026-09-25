import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, hasLocale, LOCALE_COOKIE, matchLocale } from "@/lib/i18n";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

const ADMIN_HOST = process.env.ADMIN_HOST ?? "app.saad.uz";
const MAIN_HOST = ADMIN_HOST.replace(/^app\./, "");

/**
 * app.saad.uz/*  -> rewritten to /admin/*  (so app.saad.uz/ opens the panel)
 * saad.uz/admin  -> redirected to app.saad.uz/admin
 * saad.uz/blogs  -> redirected to saad.uz/{uz|ru|en}/blogs (saved choice, then browser language)
 * Locally the panel is reachable at http://app.localhost:3000 or http://localhost:3000/admin.
 *
 * The session check here is only an optimistic redirect; pages and actions call requireAdmin().
 */
export async function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  const { pathname, search } = request.nextUrl;
  const onAdminHost = host === ADMIN_HOST || host.startsWith("app.");

  if (!onAdminHost && pathname.startsWith("/admin") && (host === MAIN_HOST || host === `www.${MAIN_HOST}`)) {
    return NextResponse.redirect(`https://${ADMIN_HOST}${pathname}${search}`);
  }

  const adminPath =
    onAdminHost && !pathname.startsWith("/admin") ? `/admin${pathname === "/" ? "" : pathname}` : pathname;

  if (!adminPath.startsWith("/admin")) return withLocale(request);

  const isLoginPage = adminPath === "/admin/login";
  const signedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!signedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (signedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response =
    adminPath === pathname
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(`${adminPath}${search}`, request.url));
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/** Public pages live under /uz, /ru and /en; anything else gets the visitor's language prefixed. */
function withLocale(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  // API routes and files (anything with an extension) are not localized.
  if (hasLocale(first) || first === "api" || /\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  const locale = hasLocale(saved) ? saved : (matchLocale(request.headers.get("accept-language")) ?? DEFAULT_LOCALE);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images/|uploads/|icon.png|apple-icon.png|opengraph-image|robots.txt|sitemap.xml).*)",
  ],
};
