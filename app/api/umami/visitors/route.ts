import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type UmamiStatsResponse = {
	visitors?: number;
};

type UmamiActiveResponse = {
	visitors?: number;
	x?: number;
};

function getUmamiConfig() {
	const apiBase = process.env.UMAMI_API_BASE_URL || "https://api.umami.is/v1";
	const apiKey = process.env.UMAMI_API_KEY;
	const websiteId =
		process.env.UMAMI_WEBSITE_ID || process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

	return { apiBase, apiKey, websiteId };
}

async function fetchUmamiJson<T>(url: string, apiKey: string) {
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"x-umami-api-key": apiKey,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`Umami request failed: ${response.status}`);
	}

	return (await response.json()) as T;
}

export async function GET() {
	const { apiBase, apiKey, websiteId } = getUmamiConfig();

	if (!apiKey || !websiteId) {
		return NextResponse.json(
			{ visitors: null, activeVisitors: null },
			{ status: 200 },
		);
	}

	const startAt = 0;
	const endAt = Date.now();
	const statsUrl = new URL(
		`${apiBase.replace(/\/$/, "")}/websites/${websiteId}/stats`,
	);
	statsUrl.searchParams.set("startAt", String(startAt));
	statsUrl.searchParams.set("endAt", String(endAt));
	const activeUrl = new URL(
		`${apiBase.replace(/\/$/, "")}/websites/${websiteId}/active`,
	);

	try {
		const [statsResult, activeResult] = await Promise.allSettled([
			fetchUmamiJson<UmamiStatsResponse>(statsUrl.toString(), apiKey),
			fetchUmamiJson<UmamiActiveResponse>(activeUrl.toString(), apiKey),
		]);
		const visitors =
			statsResult.status === "fulfilled" &&
			typeof statsResult.value.visitors === "number"
				? Math.max(0, statsResult.value.visitors)
				: null;
		const activeVisitors =
			activeResult.status === "fulfilled"
				? typeof activeResult.value.visitors === "number"
					? Math.max(0, activeResult.value.visitors)
					: typeof activeResult.value.x === "number"
						? Math.max(0, activeResult.value.x)
						: null
				: null;

		return NextResponse.json(
			{ visitors, activeVisitors },
			{
				status: 200,
				headers: {
					"Cache-Control": "no-store",
				},
			},
		);
	} catch {
		return NextResponse.json(
			{ visitors: null, activeVisitors: null },
			{ status: 200 },
		);
	}
}
