import { defaultLocale } from "@/i18n";
import LocaleLayout, {
	generateMetadata as generateLocaleMetadata,
} from "./[locale]/layout";

export async function generateMetadata() {
	return generateLocaleMetadata({
		params: Promise.resolve({ locale: defaultLocale }),
	});
}

export default async function DefaultLocaleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return LocaleLayout({
		children,
		params: Promise.resolve({ locale: defaultLocale }),
	});
}
