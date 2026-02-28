"use client";

import { evaluateSync } from "@mdx-js/mdx";
import { Icon } from "@iconify/react";
import { useMDXComponents } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types.js";
import type {
	AnchorHTMLAttributes,
	ComponentType,
	HTMLAttributes,
} from "react";
import { useMemo } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownTextProps {
	content?: string;
	className?: string;
	inline?: boolean;
	showLinkIcon?: boolean;
}

const LINK_CLASS_NAME = "inline-url-link";

function MarkdownAnchor({
	children,
	className,
	href,
	showLinkIcon,
	title,
	...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { showLinkIcon: boolean }) {
	const resolvedHref = href ?? "";
	const isExternal = /^https?:\/\//.test(resolvedHref);

	return (
		<a
			{...props}
			href={resolvedHref}
			className={cn(LINK_CLASS_NAME, className)}
			target={isExternal ? "_blank" : props.target}
			rel={isExternal ? "noopener noreferrer" : props.rel}
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

function createMarkdownComponents(
	inline: boolean,
	showLinkIcon: boolean,
): MDXComponents {
	const Paragraph = ({
		children,
		className,
		...props
	}: HTMLAttributes<HTMLElement>) =>
		inline ? (
			<Fragment>{children}</Fragment>
		) : (
			<p {...props} className={cn("text-base leading-relaxed", className)}>
				{children}
			</p>
		);

	return {
		a: (props) => <MarkdownAnchor {...props} showLinkIcon={showLinkIcon} />,
		p: Paragraph,
		ul: ({ className, ...props }) => (
			<ul {...props} className={cn("list-disc pl-5", className)} />
		),
		ol: ({ className, ...props }) => (
			<ol {...props} className={cn("list-decimal pl-5", className)} />
		),
		li: ({ className, ...props }) => (
			<li {...props} className={cn(className)} />
		),
		code: ({ className, ...props }) => (
			<code {...props} className={cn("font-mono", className)} />
		),
		pre: ({ className, ...props }) => (
			<pre
				{...props}
				className={cn(
					"overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-base",
					className,
				)}
			/>
		),
	};
}

function compileMarkdown(
	source: string,
	components: MDXComponents,
): ComponentType<{ components?: MDXComponents }> | null {
	try {
		const evaluated = evaluateSync(source, {
			Fragment,
			jsx,
			jsxs,
			remarkPlugins: [remarkGfm, remarkBreaks],
			useMDXComponents: () => components,
		});

		return evaluated.default;
	} catch (error) {
		console.error("Failed to evaluate markdown content:", error);
		return null;
	}
}

export function MarkdownText({
	content,
	className,
	inline = false,
	showLinkIcon = true,
}: MarkdownTextProps) {
	const normalizedContent = content?.replace(/\r\n?/g, "\n").trim();
	const components = useMDXComponents(
		useMemo(
			() => createMarkdownComponents(inline, showLinkIcon),
			[inline, showLinkIcon],
		),
	);
	const Content = useMemo(
		() =>
			normalizedContent ? compileMarkdown(normalizedContent, components) : null,
		[components, normalizedContent],
	);

	if (!normalizedContent) {
		return null;
	}

	const Wrapper = inline ? "span" : "div";
	const blockSpacingClass = inline
		? ""
		: "[&_ol+*]:mt-4 [&_p+p]:mt-4 [&_ul+*]:mt-4";

	return (
		<Wrapper className={cn(blockSpacingClass, className)}>
			{Content ? <Content components={components} /> : normalizedContent}
		</Wrapper>
	);
}
