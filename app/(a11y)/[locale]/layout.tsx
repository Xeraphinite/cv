import "../../globals.css";
import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/700.css";

import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { IBM_Plex_Sans, Spectral } from "next/font/google";
import Script from "next/script";
import { CVFooter } from "@/components/layout/cv-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { type Locale, locales } from "@/i18n";
import { getDirection } from "@/lib/i18n-utils";

const spectral = Spectral({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-spectral",
});

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-ibm-plex-sans",
});

const notoSerifCjkStylesheet =
	"https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Serif+JP:wght@400;500;600;700&family=Noto+Serif+KR:wght@400;500;600;700&display=swap";

export const runtime = "edge";

export default async function AccessibilityLocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeTyped = locale as Locale;

	if (!locales.includes(localeTyped)) {
		notFound();
	}

	const messages = await getMessages({ locale: localeTyped });
	const direction = getDirection(localeTyped);
	const umamiWebsiteId =
		process.env.UMAMI_WEBSITE_ID || process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
	const umamiScriptUrl =
		process.env.UMAMI_SCRIPT_URL ||
		process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
		"https://cloud.umami.is/script.js";

	return (
		<html lang={localeTyped} dir={direction} suppressHydrationWarning>
			<head>
				<link href="https://fonts.googleapis.com" rel="preconnect" />
				<link
					crossOrigin=""
					href="https://fonts.gstatic.com"
					rel="preconnect"
				/>
				<link href={notoSerifCjkStylesheet} rel="stylesheet" />
			</head>
			<body className={`${spectral.variable} ${ibmPlexSans.variable}`}>
				{umamiWebsiteId ? (
					<Script
						src={umamiScriptUrl}
						data-website-id={umamiWebsiteId}
						strategy="afterInteractive"
					/>
				) : null}
				<NextIntlClientProvider locale={localeTyped} messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
						<CVFooter className="lg:hidden" showLocaleThemeControls />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
