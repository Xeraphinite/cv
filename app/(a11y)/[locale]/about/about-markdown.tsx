"use client";

import dynamic from "next/dynamic";

type MarkdownTextProps = Parameters<
	typeof import("@/components/ui/markdown-text").MarkdownText
>[0];

const MarkdownText = dynamic<MarkdownTextProps>(
	() =>
		import("@/components/ui/markdown-text").then(
			(markdownModule) => markdownModule.MarkdownText,
		),
	{ ssr: false },
);

export function AboutMarkdown(props: MarkdownTextProps) {
	return <MarkdownText {...props} />;
}
