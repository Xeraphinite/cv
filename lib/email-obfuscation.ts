const MAILTO_PREFIX = "mailto:";

function sanitizeEmail(email: string): string {
	return email.trim();
}

export function getEmailFromMailtoHref(href: string): string | null {
	if (!href.toLowerCase().startsWith(MAILTO_PREFIX)) {
		return null;
	}

	const raw = href.slice(MAILTO_PREFIX.length).split("?")[0] ?? "";
	if (!raw) {
		return null;
	}

	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

export function toObfuscatedMailtoHref(email: string): string {
	return `${MAILTO_PREFIX}${encodeURIComponent(sanitizeEmail(email))}`;
}

export function encodeEmailForClient(email: string): string {
	return Array.from(sanitizeEmail(email))
		.map((char) => (char.codePointAt(0) ?? 0) + 7)
		.join(".");
}

export function decodeEmailFromClient(encoded: string): string {
	if (!encoded) {
		return "";
	}

	return encoded
		.split(".")
		.map((part) => {
			const value = Number.parseInt(part, 10);
			if (Number.isNaN(value)) {
				return "";
			}

			return String.fromCodePoint(value - 7);
		})
		.join("");
}
