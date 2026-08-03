import { createMarkdownResponse, getSiteStatement } from "@/lib/site-statement";

export const runtime = "edge";

export function GET() {
	return createMarkdownResponse(getSiteStatement());
}
