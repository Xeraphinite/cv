import { defaultLocale } from "@/i18n";
import LocaleHome from "./[locale]/page";

export default async function DefaultLocaleHome() {
	return LocaleHome({
		params: Promise.resolve({ locale: defaultLocale }),
	});
}
