const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");
const { getPlaiceholder } = require("plaiceholder");

async function optimizeImages() {
	const publicDir = path.join(__dirname, "..", "public");
	const avatarPath = path.join(publicDir, "avatar.png");

	if (!fs.existsSync(avatarPath)) {
		console.log("❌ avatar.png not found");
		return;
	}

	try {
		// Generate optimized versions at different sizes
		const sizes = [
			{ width: 128, suffix: "-128" },
			{ width: 256, suffix: "-256" },
			{ width: 96, suffix: "-96" }, // for print
		];

		const blurData = {};

		for (const { width, suffix } of sizes) {
			// WebP version
			await sharp(avatarPath)
				.resize(width, width, { fit: "cover" })
				.webp({ quality: 85, effort: 6 })
				.toFile(path.join(publicDir, `avatar${suffix}.webp`));

			// AVIF version (smaller but newer format)
			await sharp(avatarPath)
				.resize(width, width, { fit: "cover" })
				.avif({ quality: 75, effort: 9 })
				.toFile(path.join(publicDir, `avatar${suffix}.avif`));

			// Optimized PNG fallback
			await sharp(avatarPath)
				.resize(width, width, { fit: "cover" })
				.png({ quality: 85, compressionLevel: 9 })
				.toFile(path.join(publicDir, `avatar${suffix}.png`));

			// Generate blur placeholder for this size
			const buffer = await sharp(avatarPath)
				.resize(width, width, { fit: "cover" })
				.png()
				.toBuffer();

			const { base64 } = await getPlaiceholder(buffer);
			blurData[`avatar${suffix}`] = base64;

			console.log(
				`✅ Generated optimized avatar at ${width}x${width} with blur placeholder`,
			);
		}

		// Print blur data for manual inclusion in lib/image-utils.ts
		console.log("\n🎨 Generated blur data (copy to lib/image-utils.ts):");
		console.log(
			`const blurData: Record<string, string> = ${JSON.stringify(blurData, null, 2)};`,
		);

		// Get file sizes for comparison
		const originalSize = fs.statSync(avatarPath).size;
		const optimizedSize = fs.statSync(
			path.join(publicDir, "avatar-128.webp"),
		).size;

		console.log("\n📊 Size comparison for 128x128:");
		console.log(`Original: ${(originalSize / 1024).toFixed(1)} KB`);
		console.log(`WebP: ${(optimizedSize / 1024).toFixed(1)} KB`);
		console.log(
			`Savings: ${(((originalSize - optimizedSize) / originalSize) * 100).toFixed(1)}%`,
		);
	} catch (error) {
		console.error("❌ Error optimizing images:", error);
	}
}

optimizeImages();
