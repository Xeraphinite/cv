import { type Locale, locales } from "@/i18n";
import { buildLlmsText, createLlmsTextResponse } from "@/lib/llms-txt";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ locale: string }> },
) {
	const { locale } = await params;

	if (!locales.includes(locale as Locale)) {
		return new Response("Not Found", { status: 404 });
	}

	const body = await buildLlmsText(locale);
	return createLlmsTextResponse(body);
}
