import "../globals.css";

import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { IBM_Plex_Sans, Spectral } from "next/font/google";
import { getDirection } from "@/lib/i18n-utils";
import { type Locale, locales } from "@/i18n";
import { appConfig } from "@/lib/config/app-config";
import { CVHeader } from "@/components/layout/cv-header";
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
	const renderedAt = new Date().toISOString();

	return (
		<html lang={localeTyped} dir={direction} suppressHydrationWarning>
			<body className={`${spectral.variable} ${ibmPlexSans.variable}`}>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<CVHeader />
						{children}
						<CVFooter
							className="lg:hidden"
							lastUpdated={lastUpdated}
							renderedAt={renderedAt}
						/>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
