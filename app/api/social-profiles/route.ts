import { NextResponse } from "next/server";
import { getSocialProfileData } from "@/lib/social-profile-data";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
	const profiles = await getSocialProfileData();

	return NextResponse.json(profiles, {
		headers: {
			"Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
		},
	});
}
