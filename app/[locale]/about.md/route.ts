import { type Locale, locales } from "@/i18n";
import { createMarkdownResponse, getSiteStatement } from "@/lib/site-statement";

export const runtime = "edge";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ locale: string }> },
) {
	const { locale } = await params;

	if (!locales.includes(locale as Locale)) {
		return new Response("Not Found", { status: 404 });
	}

	return createMarkdownResponse(getSiteStatement(locale));
}
