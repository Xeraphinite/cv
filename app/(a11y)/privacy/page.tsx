import { defaultLocale } from "@/i18n";
import PrivacyStatementPage, {
	generateMetadata as generatePrivacyMetadata,
} from "../[locale]/privacy/page";

export async function generateMetadata() {
	return generatePrivacyMetadata({
		params: Promise.resolve({ locale: defaultLocale }),
	});
}

export default async function DefaultPrivacyStatementPage() {
	return PrivacyStatementPage({
		params: Promise.resolve({ locale: defaultLocale }),
	});
}
