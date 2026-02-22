import { Icon } from "@iconify/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarkdownTextProps {
	content?: string;
	className?: string;
	inline?: boolean;
	showLinkIcon?: boolean;
}

const LINK_CLASS_NAME = "inline-url-link";

const INLINE_TOKEN_PATTERN =
	/(?<mdLink>\[(?<mdLabel>[^\]]+)\]\((?<mdHref>[^)\s]+)(?:\s+"(?<mdTitle>[^"]*)")?\))|(?<htmlLink><a\s+href=['"](?<htmlHref>[^'"]+)['"][^>]*>(?<htmlLabel>.*?)<\/a>)|`(?<code>[^`]+)`|\*\*(?<strong1>[^*]+)\*\*|__(?<strong2>[^_]+)__|\*(?<em1>[^*]+)\*|_(?<em2>[^_]+)_/gim;

function renderLink(
	href: string,
	children: ReactNode,
	showLinkIcon: boolean,
	key: string,
	title?: string,
) {
	const isExternal = /^https?:\/\//.test(href);
	return (
		<a
			key={key}
			href={href}
			className={LINK_CLASS_NAME}
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			title={title}
		>
			<span className="inline-flex items-center gap-1">
				<span className="inline-url-link-text">{children}</span>
				{showLinkIcon ? (
					<Icon
						aria-hidden="true"
						icon="mingcute:arrow-right-up-fill"
						className="inline-url-link-icon h-3 w-3 shrink-0"
					/>
				) : null}
			</span>
		</a>
	);
}

function parseInlineMarkdown(
	text: string,
	showLinkIcon: boolean,
	keyPrefix: string,
): ReactNode[] {
	const result: ReactNode[] = [];
	let lastIndex = 0;
	let tokenIndex = 0;

	for (const match of text.matchAll(INLINE_TOKEN_PATTERN)) {
		if (match.index === undefined) continue;

		if (match.index > lastIndex) {
			result.push(text.slice(lastIndex, match.index));
		}

		const groups = match.groups ?? {};
		const key = `${keyPrefix}-${tokenIndex}`;

		if (groups.mdLink && groups.mdHref && groups.mdLabel) {
			result.push(
				renderLink(
					groups.mdHref,
					parseInlineMarkdown(
						groups.mdLabel,
						showLinkIcon,
						`${keyPrefix}-md-label-${tokenIndex}`,
					),
					showLinkIcon,
					key,
					groups.mdTitle,
				),
			);
		} else if (groups.htmlLink && groups.htmlHref) {
			const htmlLabel = groups.htmlLabel ?? groups.htmlHref;
			result.push(
				renderLink(
					groups.htmlHref,
					parseInlineMarkdown(
						htmlLabel,
						showLinkIcon,
						`${keyPrefix}-html-label-${tokenIndex}`,
					),
					showLinkIcon,
					key,
				),
			);
		} else if (groups.code) {
			result.push(
				<code key={key} className="font-mono">
					{groups.code}
				</code>,
			);
		} else if (groups.strong1 || groups.strong2) {
			const strongText = groups.strong1 ?? groups.strong2 ?? "";
			result.push(
				<strong key={key}>
					{parseInlineMarkdown(
						strongText,
						showLinkIcon,
						`${keyPrefix}-strong-${tokenIndex}`,
					)}
				</strong>,
			);
		} else if (groups.em1 || groups.em2) {
			const emText = groups.em1 ?? groups.em2 ?? "";
			result.push(
				<em key={key}>
					{parseInlineMarkdown(
						emText,
						showLinkIcon,
						`${keyPrefix}-em-${tokenIndex}`,
					)}
				</em>,
			);
		} else {
			result.push(match[0]);
		}

		lastIndex = match.index + match[0].length;
		tokenIndex += 1;
	}

	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	return result;
}

function renderInlineContent(
	text: string,
	showLinkIcon: boolean,
	keyPrefix: string,
): ReactNode[] {
	const lines = text.split("\n");
	const output: ReactNode[] = [];

	lines.forEach((line, lineIndex) => {
		if (lineIndex > 0) {
			output.push(<br key={`${keyPrefix}-br-${lineIndex}`} />);
		}
		output.push(
			...parseInlineMarkdown(
				line,
				showLinkIcon,
				`${keyPrefix}-line-${lineIndex}`,
			),
		);
	});

	return output;
}

function isUnorderedListBlock(lines: string[]): boolean {
	return lines.length > 0 && lines.every((line) => /^[-*+]\s+/.test(line));
}

function isOrderedListBlock(lines: string[]): boolean {
	return lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line));
}

function renderBlock(
	block: string,
	showLinkIcon: boolean,
	blockIndex: number,
): ReactNode {
	const lines = block
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

	if (isUnorderedListBlock(lines)) {
		return (
			<ul key={`ul-${blockIndex}`} className="list-disc pl-5">
				{lines.map((line, lineIndex) => (
					<li key={`ul-${blockIndex}-${lineIndex}`}>
						{renderInlineContent(
							line.replace(/^[-*+]\s+/, ""),
							showLinkIcon,
							`ul-${blockIndex}-${lineIndex}`,
						)}
					</li>
				))}
			</ul>
		);
	}

	if (isOrderedListBlock(lines)) {
		return (
			<ol key={`ol-${blockIndex}`} className="list-decimal pl-5">
				{lines.map((line, lineIndex) => (
					<li key={`ol-${blockIndex}-${lineIndex}`}>
						{renderInlineContent(
							line.replace(/^\d+\.\s+/, ""),
							showLinkIcon,
							`ol-${blockIndex}-${lineIndex}`,
						)}
					</li>
				))}
			</ol>
		);
	}

	return (
		<p key={`p-${blockIndex}`}>
			{renderInlineContent(lines.join("\n"), showLinkIcon, `p-${blockIndex}`)}
		</p>
	);
}

export function MarkdownText({
	content,
	className,
	inline = false,
	showLinkIcon = true,
}: MarkdownTextProps) {
	if (!content?.trim()) {
		return null;
	}

	const Wrapper = inline ? "span" : "div";
	const blockSpacingClass = inline ? "" : "[&_p+p]:mt-4";
	const normalizedContent = content.replace(/\r\n?/g, "\n").trim();
	const blocks = normalizedContent.split(/\n{2,}/).filter(Boolean);

	return (
		<Wrapper className={cn(blockSpacingClass, className)}>
			{inline
				? renderInlineContent(normalizedContent, showLinkIcon, "inline")
				: blocks.map((block, blockIndex) =>
						renderBlock(block, showLinkIcon, blockIndex),
					)}
		</Wrapper>
	);
}
