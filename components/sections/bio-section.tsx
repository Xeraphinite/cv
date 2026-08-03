"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import type { MDXComponents } from "mdx/types.js";
import { MarkdownText } from "@/components/ui/markdown-text";
import { BioMark } from "./bio-mark";

interface BioSectionProps {
	bio?: string;
}

const BIO_MDX_COMPONENTS: MDXComponents = {
	BioMark,
};

export function BioSection({ bio }: BioSectionProps) {
	const t = useTranslations();

	if (!bio?.trim()) return null;

	return (
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:user-3-line"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("navigation.about")}
			</h2>

			<div className="cv-body text-foreground leading-relaxed">
				<MarkdownText
					className="[&_p]:text-lg"
					content={bio}
					mdxComponents={BIO_MDX_COMPONENTS}
				/>
			</div>
		</section>
	);
}
