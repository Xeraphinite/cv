import { defaultLocale } from "@/i18n";
import AccessibilityLocaleLayout from "./[locale]/layout";

export default async function DefaultAccessibilityLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return AccessibilityLocaleLayout({
		children,
		params: Promise.resolve({ locale: defaultLocale }),
	});
}
