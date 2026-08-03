const allowedImageHosts = new Set([
	"avatars.githubusercontent.com",
	"cdn.bsky.app",
]);

export const runtime = "edge";

export async function GET(request: Request) {
	const source = new URL(request.url).searchParams.get("url");
	if (!source) {
		return new Response("Missing image URL", { status: 400 });
	}

	let sourceUrl: URL;
	try {
		sourceUrl = new URL(source);
	} catch {
		return new Response("Invalid image URL", { status: 400 });
	}

	if (
		sourceUrl.protocol !== "https:" ||
		!allowedImageHosts.has(sourceUrl.hostname)
	) {
		return new Response("Image host is not allowed", { status: 403 });
	}

	const upstream = await fetch(sourceUrl, {
		headers: {
			Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
		},
	});

	if (!upstream.ok || !upstream.body) {
		return new Response("Unable to load image", { status: 502 });
	}

	const contentType = upstream.headers.get("content-type") || "";
	if (!contentType.startsWith("image/")) {
		return new Response("Upstream response is not an image", { status: 415 });
	}

	return new Response(upstream.body, {
		headers: {
			"Cache-Control": "public, max-age=86400, s-maxage=2592000",
			"Content-Type": contentType,
		},
	});
}
