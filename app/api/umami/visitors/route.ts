import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type UmamiStatsResponse = {
	visitors?: number;
};

function getUmamiConfig() {
	const apiBase = process.env.UMAMI_API_BASE_URL || "https://api.umami.is/v1";
	const apiKey = process.env.UMAMI_API_KEY;
	const websiteId =
		process.env.UMAMI_WEBSITE_ID || process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

	return { apiBase, apiKey, websiteId };
}

export async function GET() {
	const { apiBase, apiKey, websiteId } = getUmamiConfig();

	if (!apiKey || !websiteId) {
		return NextResponse.json({ visitors: null }, { status: 200 });
	}

	const startAt = 0;
	const endAt = Date.now();
	const url = new URL(
		`${apiBase.replace(/\/$/, "")}/websites/${websiteId}/stats`,
	);
	url.searchParams.set("startAt", String(startAt));
	url.searchParams.set("endAt", String(endAt));

	try {
		const response = await fetch(url.toString(), {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return NextResponse.json({ visitors: null }, { status: 200 });
		}

		const payload = (await response.json()) as UmamiStatsResponse;
		const visitors =
			typeof payload.visitors === "number"
				? Math.max(0, payload.visitors)
				: null;

		return NextResponse.json(
			{ visitors },
			{
				status: 200,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	} catch {
		return NextResponse.json({ visitors: null }, { status: 200 });
	}
}
