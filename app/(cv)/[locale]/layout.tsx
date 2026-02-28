import "../../globals.css";

import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { IBM_Plex_Sans, Spectral } from "next/font/google";
import Script from "next/script";
import { getDirection } from "@/lib/i18n-utils";
import { type Locale, locales } from "@/i18n";
import { appConfig } from "@/lib/config/app-config";
import { CVFooter } from "@/components/layout/cv-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getCVLastUpdated } from "@/lib/load-cv-data";

const spectral = Spectral({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
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

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const localePath =
		localeTyped === appConfig.intl.defaultLocale ? "/" : `/${localeTyped}`;

	const currentTitle = appConfig.site.namesByLocale[localeTyped];
	const currentDescription = appConfig.site.namesByLocale[localeTyped];

	return {
		metadataBase: new URL(appConfig.site.metadataBase),
		title: currentTitle,
		description: currentDescription,
		keywords: [
			"Keyou Zheng",
			"郑恪悠",
			"CV",
			"Resume",
			"研究生",
			"Graduate Student",
		],
		authors: [{ name: "Keyou Zheng" }],
		creator: "Keyou Zheng",
		publisher: "Keyou Zheng",
		generator: "Next.js",
		robots: "index, follow",
		icons: {
			icon: [{ url: "/icon.png", type: "image/png" }],
			shortcut: ["/icon.png"],
			apple: [{ url: "/icon.png", type: "image/png" }],
		},
		alternates: {
			canonical: localePath,
			languages: Object.fromEntries(
				locales.map((loc) => [
					loc,
					loc === appConfig.intl.defaultLocale ? "/" : `/${loc}`,
				]),
			),
		},
		openGraph: {
			title: currentTitle,
			description: currentDescription,
			type: "profile",
			locale: localeTyped,
			alternateLocale: locales.filter((loc) => loc !== localeTyped),
			siteName: "Keyou Zheng - Professional CV",
			images: [
				{
					url: "/icon.png",
					width: 400,
					height: 400,
					alt: "Keyou Zheng",
				},
			],
		},
		twitter: {
			card: "summary",
			title: currentTitle,
			description: currentDescription,
			images: ["/icon.png"],
		},
	};
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
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
	const lastUpdated = await getCVLastUpdated(localeTyped);
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
						<CVFooter
							className="lg:hidden"
							lastUpdated={lastUpdated}
							showLocaleThemeControls
						/>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
