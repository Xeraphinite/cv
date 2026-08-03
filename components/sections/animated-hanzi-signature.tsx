"use client";

import { useId, useState, type CSSProperties } from "react";
import zhengData from "hanzi-writer-data/郑.json";
import traditionalZhengData from "hanzi-writer-data/鄭.json";
import keData from "hanzi-writer-data/恪.json";
import youData from "hanzi-writer-data/悠.json";
import { lauraSignatureGlyphs } from "./laura-signature-glyphs";

interface AnimatedHanziSignatureProps {
	text: string;
	reading?: string;
}

interface SignatureStyle extends CSSProperties {
	"--cv-signature-delay": string;
	"--cv-signature-duration": string;
	"--cv-signature-final-delay"?: string;
	"--cv-signature-stroke-settle-delay"?: string;
}

const CHARACTER_SIZE = 1024;
const SIGNATURE_BASELINE = 925;
const READING_HEIGHT = 240;
const READING_BASELINE = 210;
const READING_SCALE = 0.24;
const CHARACTER_PAUSE = 100;
const STROKE_PAUSE = 28;
const STROKE_REGION_WIDTH = 260;

const characterData = {
	郑: zhengData,
	鄭: traditionalZhengData,
	恪: keData,
	悠: youData,
} as const;

type SignatureCharacter = keyof typeof characterData;
type LauraGlyphCharacter = keyof typeof lauraSignatureGlyphs;

function isSignatureCharacter(value: string): value is SignatureCharacter {
	return value in characterData && value in lauraSignatureGlyphs;
}

function isLauraGlyphCharacter(value: string): value is LauraGlyphCharacter {
	return value in lauraSignatureGlyphs;
}

function pointsToPath(points: readonly (readonly number[])[]) {
	return points
		.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
		.join(" ");
}

function getPointBounds(points: readonly (readonly number[])[]) {
	const xValues = points.map(([x]) => x);
	const yValues = points.map(([, y]) => y);

	return {
		maxX: Math.max(...xValues),
		maxY: Math.max(...yValues),
		minX: Math.min(...xValues),
		minY: Math.min(...yValues),
	};
}

function fitStrokePoints(
	character: SignatureCharacter,
	characterOffset: number,
	points: readonly (readonly number[])[],
	sourceBounds: ReturnType<typeof getPointBounds>,
) {
	const glyph = lauraSignatureGlyphs[character];
	const [targetMinX, targetMinY, targetMaxX, targetMaxY] = glyph.bounds;
	const centeredOffset = (CHARACTER_SIZE - glyph.advance) / 2;
	const scaleX =
		(targetMaxX - targetMinX) / (sourceBounds.maxX - sourceBounds.minX);
	const scaleY =
		(targetMaxY - targetMinY) / (sourceBounds.maxY - sourceBounds.minY);

	return points.map(([x, y]) => [
		characterOffset +
			centeredOffset +
			targetMinX +
			(x - sourceBounds.minX) * scaleX,
		SIGNATURE_BASELINE - (targetMinY + (y - sourceBounds.minY) * scaleY),
	]);
}

function getStrokeDuration(points: readonly (readonly number[])[]) {
	let length = 0;

	for (let index = 1; index < points.length; index += 1) {
		const [previousX, previousY] = points[index - 1];
		const [currentX, currentY] = points[index];
		length += Math.hypot(currentX - previousX, currentY - previousY);
	}

	return Math.round(Math.min(350, Math.max(145, length * 0.42)));
}

function getSignatureGlyphTransform(
	character: SignatureCharacter,
	offset: number,
) {
	const glyph = lauraSignatureGlyphs[character];
	const centeredOffset = (CHARACTER_SIZE - glyph.advance) / 2;

	return `translate(${offset + centeredOffset} ${SIGNATURE_BASELINE}) scale(1 -1)`;
}

function HandwrittenReading({
	segments,
	width,
}: {
	segments: string[];
	width: number;
}) {
	return (
		<svg
			className="cv-hanzi-signature-reading"
			viewBox={`0 0 ${width} ${READING_HEIGHT}`}
			aria-hidden="true"
		>
			{segments.map((segment, segmentIndex) => {
				const glyphs = Array.from(segment).filter(isLauraGlyphCharacter);
				const lastGlyph = glyphs.at(-1);
				const visibleLeft = glyphs[0]
					? lauraSignatureGlyphs[glyphs[0]].bounds[0]
					: 0;
				const visibleRight = lastGlyph
					? glyphs
							.slice(0, -1)
							.reduce(
								(total, character) =>
									total + lauraSignatureGlyphs[character].advance,
								0,
							) + lauraSignatureGlyphs[lastGlyph].bounds[2]
					: 0;
				let glyphOffset =
					segmentIndex * CHARACTER_SIZE +
					CHARACTER_SIZE / 2 -
					((visibleLeft + visibleRight) / 2) * READING_SCALE;

				return (
					<g key={`${segment}-${segmentIndex}`}>
						{glyphs.map((character, glyphIndex) => {
							const glyph = lauraSignatureGlyphs[character];
							const transform = `translate(${glyphOffset} ${READING_BASELINE}) scale(${READING_SCALE} -${READING_SCALE})`;
							glyphOffset += glyph.advance * READING_SCALE;

							return (
								<path
									key={`${character}-${glyphIndex}`}
									d={glyph.path}
									transform={transform}
								/>
							);
						})}
					</g>
				);
			})}
		</svg>
	);
}

export function AnimatedHanziSignature({
	text,
	reading,
}: AnimatedHanziSignatureProps) {
	const characters = Array.from(text).filter(isSignatureCharacter);
	const readingSegments = reading?.split("|") ?? [];
	const width = characters.length * CHARACTER_SIZE;
	const signatureId = `signature-${useId().replaceAll(":", "")}`;
	const maskId = `${signatureId}-mask`;
	const [hasPlayed, setHasPlayed] = useState(false);
	let elapsed = 0;

	if (characters.length === 0) {
		return null;
	}

	const animatedCharacters = characters.map((character, characterIndex) => {
		const characterOffset = characterIndex * CHARACTER_SIZE;
		const sourceBounds = getPointBounds(
			characterData[character].medians.flat(),
		);
		const fittedPaths = characterData[character].medians.map((points) =>
			pointsToPath(
				fitStrokePoints(character, characterOffset, points, sourceBounds),
			),
		);
		const strokes = characterData[character].medians.map(
			(points, strokeIndex) => {
				const duration = getStrokeDuration(points);
				const delay = elapsed;
				elapsed += duration + STROKE_PAUSE;

				return {
					delay,
					duration,
					key: `${character}-${strokeIndex}`,
					laterPaths: fittedPaths.slice(strokeIndex + 1),
					path: fittedPaths[strokeIndex],
					regionMaskId: `${signatureId}-stroke-${characterIndex}-${strokeIndex}`,
				};
			},
		);
		const finalDelay = elapsed + 40;
		elapsed += CHARACTER_PAUSE;

		return {
			character,
			characterOffset,
			finalDelay,
			strokes,
		};
	});

	const accessibleReading = readingSegments.join(" ");
	const label = accessibleReading ? `${text} (${accessibleReading})` : text;

	return (
		<span
			className="cv-hanzi-signature"
			role="img"
			aria-label={label}
			data-name-form={characters[0] === "鄭" ? "traditional" : "simplified"}
			data-writing={hasPlayed ? "true" : "false"}
			onPointerEnter={() => setHasPlayed(true)}
		>
			{readingSegments.length === characters.length ? (
				<HandwrittenReading segments={readingSegments} width={width} />
			) : null}
			<svg viewBox={`0 0 ${width} ${CHARACTER_SIZE}`} aria-hidden="true">
				<defs>
					<mask
						id={maskId}
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width={width}
						height={CHARACTER_SIZE}
					>
						{animatedCharacters.map(({ character, characterOffset }) => (
							<path
								key={character}
								className="cv-hanzi-signature-mask-shape"
								d={lauraSignatureGlyphs[character].path}
								transform={getSignatureGlyphTransform(
									character,
									characterOffset,
								)}
							/>
						))}
					</mask>
					{animatedCharacters.flatMap(({ strokes }) =>
						strokes.map(({ key, laterPaths, path, regionMaskId }) => (
							<mask
								key={key}
								id={regionMaskId}
								className="cv-hanzi-signature-stroke-region-mask"
								maskUnits="userSpaceOnUse"
								x="0"
								y="0"
								width={width}
								height={CHARACTER_SIZE}
							>
								<rect width={width} height={CHARACTER_SIZE} fill="black" />
								<path
									d={path}
									fill="none"
									stroke="white"
									strokeWidth={STROKE_REGION_WIDTH}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								{laterPaths.map((laterPath, laterIndex) => (
									<path
										key={`${key}-later-${laterIndex}`}
										d={laterPath}
										fill="none"
										stroke="black"
										strokeWidth={STROKE_REGION_WIDTH}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								))}
							</mask>
						)),
					)}
				</defs>

				<g mask={`url(#${maskId})`}>
					{animatedCharacters.flatMap(({ finalDelay, strokes }) =>
						strokes.map(({ delay, duration, key, path, regionMaskId }) => {
							const style: SignatureStyle = {
								"--cv-signature-delay": `${delay}ms`,
								"--cv-signature-duration": `${duration}ms`,
								"--cv-signature-stroke-settle-delay": `${finalDelay}ms`,
							};

							return (
								<path
									key={key}
									className="cv-hanzi-signature-stroke"
									d={path}
									mask={`url(#${regionMaskId})`}
									pathLength={1}
									style={style}
								/>
							);
						}),
					)}
				</g>

				{animatedCharacters.map(
					({ character, characterOffset, finalDelay }) => {
						const style: SignatureStyle = {
							"--cv-signature-delay": "0ms",
							"--cv-signature-duration": "0ms",
							"--cv-signature-final-delay": `${finalDelay}ms`,
						};

						return (
							<path
								key={character}
								className="cv-hanzi-signature-final"
								d={lauraSignatureGlyphs[character].path}
								style={style}
								transform={getSignatureGlyphTransform(
									character,
									characterOffset,
								)}
							/>
						);
					},
				)}
			</svg>
		</span>
	);
}
