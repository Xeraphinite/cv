import { defaultLocale } from "@/i18n";
import AccessibilityStatementPage, {
	generateMetadata as generateAccessibilityMetadata,
} from "../[locale]/accessibility/page";

export async function generateMetadata() {
	return generateAccessibilityMetadata({
		params: Promise.resolve({ locale: defaultLocale }),
	});
}

export default async function DefaultAccessibilityStatementPage() {
	return AccessibilityStatementPage({
		params: Promise.resolve({ locale: defaultLocale }),
	});
}
