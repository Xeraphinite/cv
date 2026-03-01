export interface OwnerNameMatcherOptions {
	ownerName?: string;
	ownerEnName?: string;
	ownerAliases?: string[];
}

function normalizeName(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^\p{L}\p{N}]+/gu, "");
}

function buildNameVariants(value?: string): string[] {
	if (!value) return [];
	const trimmed = value.trim();
	if (!trimmed) return [];

	const withoutParen = trimmed
		.replace(/\s*\([^)]*\)\s*/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const tokens = withoutParen
		.replace(/[.*]/g, "")
		.split(/[\s,]+/)
		.map((token) => token.trim())
		.filter(Boolean);

	const variants = new Set<string>([trimmed, withoutParen]);
	if (tokens.length >= 2) {
		const first = tokens[0];
		const last = tokens[tokens.length - 1];
		variants.add(`${first} ${last}`);
		variants.add(`${last} ${first}`);
		variants.add(`${last} ${first.charAt(0)}`);
		variants.add(`${first} ${last.charAt(0)}`);
	}

	return Array.from(variants).map(normalizeName).filter(Boolean);
}

export function createOwnerNameMatcher({
	ownerName,
	ownerEnName,
	ownerAliases = [],
}: OwnerNameMatcherOptions): (name: string) => boolean {
	const ownerNameVariants = new Set<string>([
		...buildNameVariants(ownerName),
		...buildNameVariants(ownerEnName),
		...ownerAliases.flatMap((alias) => buildNameVariants(alias)),
	]);

	return (name: string) => {
		const variants = buildNameVariants(name);
		return variants.some((variant) => ownerNameVariants.has(variant));
	};
}
