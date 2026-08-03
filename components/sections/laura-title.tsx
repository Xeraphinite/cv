const LAURA_TITLE_TEXT = "Keyou (Key) Zheng";

interface LauraTitleProps {
	text: string;
}

export function LauraTitle({ text }: LauraTitleProps) {
	if (text !== LAURA_TITLE_TEXT) {
		return <span className="cv-hero-english-name-fallback">{text}</span>;
	}

	return (
		<>
			<span className="sr-only">{text}</span>
			<span className="cv-laura-title" aria-hidden="true" />
		</>
	);
}
