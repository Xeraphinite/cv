import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n";

export default createMiddleware({
	// A list of all locales that are supported.
	locales,

	// Used when no locale matches.
	defaultLocale,

	// Use no prefix for default locale (e.g. /, /about) and prefixes for others (e.g. /zh/about).
	localePrefix: "as-needed",

	// Keep default locale on unprefixed routes instead of auto-redirecting to browser locale.
	localeDetection: false,

	// Alternate links for better SEO.
	alternateLinks: true,
});

export const config = {
	// Match all pathnames except `/api`, `/_next`, `/_vercel`, and file requests.
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
