import { createLlmsTextResponse, buildLlmsText } from "@/lib/llms-txt";

export const runtime = "edge";

export async function GET() {
	const body = await buildLlmsText();
	return createLlmsTextResponse(body);
}
