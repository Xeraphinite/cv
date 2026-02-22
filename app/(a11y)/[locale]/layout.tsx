import "../../globals.css";

import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { IBM_Plex_Sans, Spectral } from "next/font/google";
import { CVHeader } from "@/components/layout/cv-header";
import { CVFooter } from "@/components/layout/cv-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { type Locale, locales } from "@/i18n";
import { getDirection } from "@/lib/i18n-utils";

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
	const renderedAt = new Date().toISOString();

	return (
		<html lang={localeTyped} dir={direction} suppressHydrationWarning>
			<body className={`${spectral.variable} ${ibmPlexSans.variable}`}>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<CVHeader />
						{children}
						<CVFooter className="lg:hidden" renderedAt={renderedAt} />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
