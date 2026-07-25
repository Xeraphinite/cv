"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { getResponsiveImageProps } from "@/lib/image-utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HeroLocation } from "@/components/sections/hero-location";
import { MarkdownText } from "@/components/ui/markdown-text";
import {
	decodeEmailFromClient,
	encodeEmailForClient,
	toObfuscatedMailtoHref,
} from "@/lib/email-obfuscation";
import { getFontClass, getTypographyClasses } from "@/lib/utils";
import type { SocialProfileData } from "@/lib/types/cv";

const containsHanCharacters = (value: string) => /\p{Script=Han}/u.test(value);

interface HeroSectionProps {
	data: {
		name: string;
		enName?: string;
		furiganaName?: string;
		furigana?: string;
		avatar: string;
		location: string;
		age: string | number;
		position?: string;
		bio?: string;
		description?: string;
		social: {
			email?: string;
			github?: string;
			wechat?: string;
			website?: string;
			googleScholar?: string;
			orcid?: string;
			bluesky?: string;
			phone?: string;
			linkedin?: string;
			twitter?: string;
			researchGate?: string;
		};
	};
	locale?: string;
	socialProfiles?: SocialProfileData;
}

const socialPlatforms = [
	{
		key: "email",
		iconLine: "mingcute:mail-line",
		iconFill: "mingcute:mail-fill",
		getHref: (value: string) => toObfuscatedMailtoHref(value),
		getLabel: (value: string) => value,
		title: "Email",
		external: false,
	},
	{
		key: "github",
		iconLine: "mingcute:github-line",
		iconFill: "mingcute:github-fill",
		getHref: (value: string) => value,
		getLabel: (value: string) => value.split("/").pop() || "GitHub",
		title: "GitHub",
		external: true,
	},
	{
		key: "wechat",
		iconLine: "mingcute:wechat-line",
		iconFill: "mingcute:wechat-fill",
		getHref: (_value: string) => "#",
		getLabel: (value: string) => value,
		title: "WeChat",
		external: false,
	},
	{
		key: "website",
		iconLine: "mingcute:world-line",
		iconFill: "mingcute:world-fill",
		getHref: (value: string) => value,
		getLabel: (value: string) => {
			try {
				return new URL(value).hostname.replace(/^www\./, "");
			} catch {
				return value.replace(/^https?:\/\/(www\.)?/, "");
			}
		},
		title: "Website",
		external: true,
	},
	{
		key: "googleScholar",
		iconLine: "academicons:google-scholar",
		iconFill: "academicons:google-scholar",
		getHref: (value: string) => value,
		getLabel: (_value: string) => "Google Scholar",
		title: "Google Scholar",
		external: true,
	},
	{
		key: "orcid",
		iconLine: "academicons:orcid",
		iconFill: "academicons:orcid",
		getHref: (value: string) => value,
		getLabel: (_value: string) => "ORCID",
		title: "ORCID",
		external: true,
	},
	{
		key: "bluesky",
		iconLine: "mingcute:bluesky-social-line",
		iconFill: "mingcute:bluesky-social-fill",
		getHref: (value: string) => value,
		getLabel: (_value: string) => "Bluesky",
		title: "Bluesky",
		external: true,
	},
] as const;

type SocialPlatformKey = (typeof socialPlatforms)[number]["key"];

function HoverTip({ children, tip }: { children: ReactNode; tip: string }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent side="top" align="start">
				<span>{tip}</span>
			</TooltipContent>
		</Tooltip>
	);
}

function ObfuscatedEmailLabel({ email }: { email: string }) {
	const encoded = useMemo(() => encodeEmailForClient(email), [email]);
	const [decoded, setDecoded] = useState("");

	useEffect(() => {
		setDecoded(decodeEmailFromClient(encoded));
	}, [encoded]);

	return <>{decoded || "\u00a0"}</>;
}

interface ContactHoverCardProps {
	children: ReactNode;
	platform: SocialPlatformKey;
	icon: string;
	title: string;
	label: string;
	rawValue: string;
	action: string;
	external: boolean;
	avatar: string;
	profileName: string;
	position?: string;
	socialProfiles?: SocialProfileData;
}

function ContactCardArrow({ external }: { external: boolean }) {
	return (
		<Icon
			icon={
				external ? "mingcute:arrow-right-up-fill" : "mingcute:arrow-right-line"
			}
			className="h-4 w-4 shrink-0"
			aria-hidden="true"
		/>
	);
}

function ContactCardContent({
	platform,
	icon,
	title,
	label,
	rawValue,
	action,
	external,
	avatar,
	profileName,
	position,
	socialProfiles,
}: Omit<ContactHoverCardProps, "children">) {
	if (platform === "email") {
		return (
			<div className="cv-email-envelope">
				<div className="cv-email-envelope-flap" aria-hidden="true" />
				<div className="cv-email-envelope-return">
					<span>FROM</span>
					{profileName}
					<br />
					CURRICULUM VITAE
				</div>
				<div className="cv-email-envelope-stamps" aria-hidden="true">
					<div className="cv-email-envelope-stamp cv-email-envelope-stamp-portrait">
						<Image src={avatar} alt="" width={32} height={32} />
						<span>CV · MAIL</span>
					</div>
					<div className="cv-email-envelope-stamp cv-email-envelope-stamp-mark">
						<span className="cv-email-envelope-stamp-star">✦</span>
						<span>POST</span>
					</div>
				</div>
				<div className="cv-email-envelope-postmark" aria-hidden="true" />
				<div className="cv-email-envelope-address">
					<span>TO</span>
					<ObfuscatedEmailLabel email={rawValue} />
				</div>
			</div>
		);
	}

	if (platform === "github") {
		const github = socialProfiles?.github;
		const contributionLevels = github?.contributionLevels ?? [];

		return (
			<div className="cv-github-card-body">
				<div className="cv-github-card-heading">
					<strong>@{github?.login || label}</strong>
					{github?.bio ? <span>{github.bio}</span> : null}
				</div>
				<div className="cv-github-contributions" aria-hidden="true">
					{Array.from({ length: 25 }, (_, columnIndex) => (
						<span key={`github-column-${columnIndex}`}>
							{contributionLevels
								.slice(columnIndex * 7, columnIndex * 7 + 7)
								.map((level, rowIndex) => (
									<i
										key={`github-cell-${columnIndex}-${rowIndex}`}
										data-level={level}
									/>
								))}
						</span>
					))}
				</div>
				<div className="cv-github-card-footer">
					<span>
						<strong>{github?.contributions.toLocaleString() || "—"}</strong>
						<span>contributions</span>
						<span aria-hidden="true">·</span>
						<strong>{github?.followers.toLocaleString() || "—"}</strong>
						<span>followers</span>
					</span>
					<Icon icon={icon} className="h-4 w-4" aria-hidden="true" />
				</div>
			</div>
		);
	}

	if (platform === "googleScholar") {
		const scholar = socialProfiles?.googleScholar;
		const maxYearlyCitations = Math.max(
			1,
			...(scholar?.citationsByYear.map(({ citations }) => citations) ?? []),
		);

		return (
			<div className="cv-scholar-card-body">
				<div className="cv-scholar-card-accent" aria-hidden="true" />
				<div className="cv-scholar-card-header">
					<div className="cv-scholar-card-icon">
						<Icon icon={icon} className="h-5 w-5" aria-hidden="true" />
					</div>
					<div>
						<strong>{scholar?.name || profileName}</strong>
						<span>{title}</span>
					</div>
				</div>
				<div className="cv-scholar-card-profile">
					<span>{scholar?.affiliation || "Google Scholar"}</span>
					{scholar?.interests.length ? (
						<small>{scholar.interests.join(" · ")}</small>
					) : null}
				</div>
				<div className="cv-scholar-card-metrics">
					<div
						className="cv-scholar-citation-chart"
						role="img"
						aria-label={
							scholar?.citationsByYear
								.map(({ year, citations }) => `${year}: ${citations} citations`)
								.join(", ") || "Citations by year"
						}
					>
						{scholar?.citationsByYear.map(({ year, citations }) => (
							<span
								key={year}
								title={`${year}: ${citations} citations`}
								aria-hidden="true"
							>
								<i
									style={{
										height: `${Math.max(8, (citations / maxYearlyCitations) * 100)}%`,
									}}
								/>
								<small>{year}</small>
							</span>
						))}
					</div>
					<div>
						<span>
							<strong>{scholar?.citations.toLocaleString() || "—"}</strong>{" "}
							citations
						</span>
						<span>
							<strong>{scholar?.hIndex.toLocaleString() || "—"}</strong> h-index
						</span>
						<span>
							<strong>{scholar?.i10Index.toLocaleString() || "—"}</strong>{" "}
							i10-index
						</span>
					</div>
				</div>
				<div className="cv-scholar-card-footer">
					<span>{action}</span>
					<ContactCardArrow external={external} />
				</div>
			</div>
		);
	}

	if (platform === "bluesky" || platform === "wechat") {
		const bluesky =
			platform === "bluesky" ? socialProfiles?.bluesky : undefined;
		const handle =
			platform === "bluesky"
				? `@${bluesky?.handle || rawValue.split("/").filter(Boolean).pop() || label}`
				: label;
		return (
			<div className="cv-social-card-body">
				<div className="cv-social-card-header">
					<Image
						src={bluesky?.avatarUrl || avatar}
						alt=""
						width={40}
						height={40}
						unoptimized={Boolean(bluesky?.avatarUrl)}
						onError={(event) => {
							if (event.currentTarget.dataset.fallbackApplied) return;
							event.currentTarget.dataset.fallbackApplied = "true";
							event.currentTarget.srcset = "";
							event.currentTarget.src = avatar;
						}}
						className="cv-social-card-avatar"
					/>
					<div className="cv-social-card-names">
						<strong>{bluesky?.displayName || profileName}</strong>
						<span>{handle}</span>
					</div>
					<Icon icon={icon} className="h-4 w-4" aria-hidden="true" />
				</div>
				{bluesky?.description ? <p>{bluesky.description}</p> : null}
				<div className="cv-social-card-footer">
					{typeof bluesky?.followersCount === "number" ? (
						<span>
							<strong>{bluesky.followersCount.toLocaleString()}</strong>{" "}
							followers
							{typeof bluesky.postsCount === "number"
								? ` · ${bluesky.postsCount.toLocaleString()} posts`
								: ""}
						</span>
					) : (
						<span>{action}</span>
					)}
					<ContactCardArrow external={external} />
				</div>
			</div>
		);
	}

	return (
		<div className="cv-link-preview-card">
			<div className="cv-link-preview-site">
				<Icon icon={icon} className="h-3.5 w-3.5" aria-hidden="true" />
				<span>{label}</span>
			</div>
			<strong>{profileName}</strong>
			<p>{position || title}</p>
			<div className="cv-link-preview-footer">
				<span>{action}</span>
				<ContactCardArrow external={external} />
			</div>
		</div>
	);
}

function ContactHoverCard({
	children,
	platform,
	...contentProps
}: ContactHoverCardProps) {
	const variantClass =
		platform === "email"
			? "cv-contact-card-email"
			: platform === "github"
				? "cv-contact-card-github"
				: platform === "googleScholar"
					? "cv-contact-card-scholar"
					: platform === "bluesky" || platform === "wechat"
						? "cv-contact-card-social"
						: "cv-contact-card-link";

	return (
		<HoverCard openDelay={140} closeDelay={100}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent
				side="top"
				align="start"
				sideOffset={10}
				collisionPadding={16}
				className={`cv-contact-card ${variantClass}`}
			>
				<ContactCardContent platform={platform} {...contentProps} />
			</HoverCardContent>
		</HoverCard>
	);
}

export function HeroSection({
	data,
	locale,
	socialProfiles,
}: HeroSectionProps) {
	const t = useTranslations();
	const typographyClasses = getTypographyClasses(locale);
	const fontClass = getFontClass(locale);
	const [resolvedSocialProfiles, setResolvedSocialProfiles] =
		useState(socialProfiles);

	useEffect(() => {
		const controller = new AbortController();

		fetch("/api/social-profiles", { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error("Profile refresh failed");
				return response.json() as Promise<SocialProfileData>;
			})
			.then(setResolvedSocialProfiles)
			.catch(() => {
				// The verified server-rendered snapshot remains visible.
			});

		return () => controller.abort();
	}, []);

	const handleDownloadPDF = () => {
		const link = document.createElement("a");
		link.href = "/files/cv.pdf";
		link.download = `${data.name.replace(/\s+/g, "_")}_CV.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const formatNameWithRuby = () => {
		if (locale === "ja") {
			const segmentationTemplate = data.furiganaName || data.name;
			const templateSegments = segmentationTemplate
				.split("|")
				.map((segment) => segment.trim())
				.filter(Boolean);
			const rubySegments = (data.furigana || "")
				.split("|")
				.map((segment) => segment.trim())
				.filter(Boolean);
			const localizedNameChars = Array.from(data.name);
			const templateSegmentLengths = templateSegments.map(
				(segment) => Array.from(segment).length,
			);
			const canMapTemplateToLocalizedName =
				templateSegments.length > 1 &&
				templateSegmentLengths.reduce((sum, length) => sum + length, 0) ===
					localizedNameChars.length;

			const baseSegments = canMapTemplateToLocalizedName
				? templateSegmentLengths.reduce<string[]>((segments, length, index) => {
						const start = templateSegmentLengths
							.slice(0, index)
							.reduce((sum, part) => sum + part, 0);
						segments.push(
							localizedNameChars.slice(start, start + length).join(""),
						);
						return segments;
					}, [])
				: templateSegments;

			const hasSegmentedRuby =
				rubySegments.length > 0 && rubySegments.length === baseSegments.length;

			if (hasSegmentedRuby) {
				return (
					<span aria-label={data.name} className="cv-ruby-group">
						{baseSegments.map((baseSegment, index) => (
							<ruby key={`${baseSegment}-${index}`} className="cv-ruby">
								{baseSegment}
								<rt>{rubySegments[index]}</rt>
							</ruby>
						))}
					</span>
				);
			}

			if (data.furigana) {
				const fallbackBase = data.furiganaName || data.name;
				return (
					<ruby className="cv-ruby">
						{fallbackBase}
						<rt>{data.furigana}</rt>
					</ruby>
				);
			}

			return data.name;
		}

		return data.name;
	};

	const getPrimaryName = () => {
		if (locale === "en") {
			return data.enName || data.name;
		}
		return formatNameWithRuby();
	};

	const getSecondaryName = () => {
		if (locale === "en") {
			if (data.enName && data.name && data.enName !== data.name) {
				return data.name;
			}
			return undefined;
		}
		if (data.enName && data.enName !== data.name) {
			return data.enName;
		}
		return undefined;
	};

	const renderWrappedPosition = (position: string) => {
		const parts = position
			.split(",")
			.map((part) => part.trim())
			.filter(Boolean);

		if (parts.length <= 1) {
			return (
				<MarkdownText
					content={position}
					className={`${typographyClasses.body} cv-body-emphasis text-foreground/85`}
				/>
			);
		}

		return (
			<p
				className={`${typographyClasses.body} cv-body-emphasis text-foreground/85`}
			>
				<span className="inline-flex flex-wrap gap-x-1">
					{parts.map((part, index) => {
						const suffix = index < parts.length - 1 ? "," : "";
						return (
							<span key={`${part}-${index}`} className="whitespace-nowrap">
								{part}
								{suffix}
							</span>
						);
					})}
				</span>
			</p>
		);
	};

	const formatAge = (ageString: string | number) => {
		if (typeof ageString === "string" && ageString.includes("-")) {
			const [year, month] = ageString.split("-");
			const birthDate = new Date(
				Number.parseInt(year, 10),
				Number.parseInt(month, 10) - 1,
			);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			return `${age} ${t("content.yearsOld")}`;
		}
		return `${ageString} ${t("content.yearsOld")}`;
	};

	const getSocialHoverTip = (key: (typeof socialPlatforms)[number]["key"]) => {
		switch (key) {
			case "email":
				return t("tooltips.hero.email");
			case "github":
				return t("tooltips.hero.github");
			case "wechat":
				return t("tooltips.hero.wechat");
			case "website":
				return t("tooltips.hero.website");
			case "googleScholar":
				return t("tooltips.hero.googleScholar");
			case "orcid":
				return t("tooltips.hero.orcid");
			case "bluesky":
				return t("tooltips.hero.bluesky");
			default:
				return t("tooltips.hero.contact");
		}
	};

	const primaryName = getPrimaryName();
	const secondaryName = getSecondaryName();
	const secondaryNameClass = secondaryName
		? locale === "en" && containsHanCharacters(secondaryName)
			? "cv-subtitle font-zh-serif tracking-zh text-muted-foreground/80"
			: `${typographyClasses.subtitle} text-muted-foreground/80`
		: "";

	return (
		<header className="mb-6 sm:mb-8">
			<div className="cv-card">
				<div className="grid grid-cols-1 gap-6">
					<div className="cv-avatar relative h-28 w-28 sm:h-32 sm:w-32">
						<Image
							src={data.avatar || "/images/placeholders/placeholder-user.jpg"}
							alt={`${data.name} - ${data.enName ?? data.name}`}
							fill
							className="object-cover"
							priority
							{...getResponsiveImageProps(
								data.avatar || "/images/placeholders/placeholder-user.jpg",
								"(max-width: 768px) 112px, 128px",
							)}
						/>
					</div>

					<div className="min-w-0 [&>*:not(:last-child)]:mb-4">
						<div>
							<h1 className={`${typographyClasses.title} mb-2`}>
								{primaryName}
							</h1>

							{secondaryName && (
								<h2 className={secondaryNameClass}>{secondaryName}</h2>
							)}
						</div>

						{data.description && (
							<MarkdownText
								content={data.description}
								className={`${typographyClasses.body} text-primary/90`}
							/>
						)}

						{data.position && renderWrappedPosition(data.position)}

						<TooltipProvider delayDuration={120}>
							<div className="flex flex-col [&>*:not(:last-child)]:mb-3">
								{data.location && (
									<HeroLocation location={data.location} locale={locale} />
								)}

								{socialPlatforms.map(
									({
										key,
										iconLine,
										iconFill,
										getHref,
										getLabel,
										title,
										external,
									}) => {
										const value = data.social[key as keyof typeof data.social];
										if (!value) return null;

										const href = getHref(value);
										const label = getLabel(value);
										const isClickable = key !== "wechat";
										const labelClass = "break-all";
										const labelContent =
											key === "email" ? (
												<ObfuscatedEmailLabel email={value} />
											) : (
												label
											);
										const hoverCard = {
											platform: key,
											icon: iconFill,
											title,
											label,
											rawValue: value,
											action: getSocialHoverTip(key),
											external,
											avatar:
												data.avatar ||
												"/images/placeholders/placeholder-user.jpg",
											profileName: data.enName || data.name,
											position: data.position,
											socialProfiles: resolvedSocialProfiles,
										};

										if (isClickable) {
											return (
												<ContactHoverCard key={key} {...hoverCard}>
													<a
														href={href}
														target={external ? "_blank" : undefined}
														rel={external ? "noopener noreferrer" : undefined}
														className="cv-contact-link group"
													>
														<div className="relative h-4 w-4">
															<Icon
																icon={iconLine}
																className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
															/>
															<Icon
																icon={iconFill}
																className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
															/>
														</div>
														<span className={labelClass}>{labelContent}</span>
													</a>
												</ContactHoverCard>
											);
										}

										return (
											<ContactHoverCard key={key} {...hoverCard}>
												<span
													className="cv-contact-link group"
													tabIndex={0}
													role="note"
												>
													<div className="relative h-4 w-4">
														<Icon
															icon={iconLine}
															className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
														/>
														<Icon
															icon={iconFill}
															className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
														/>
													</div>
													<span className={labelClass}>{labelContent}</span>
												</span>
											</ContactHoverCard>
										);
									},
								)}

								<HoverTip tip={t("tooltips.hero.downloadPdf")}>
									<button
										type="button"
										onClick={handleDownloadPDF}
										className="cv-contact-link group"
									>
										<div className="relative h-4 w-4">
											<Icon
												icon="mingcute:pdf-line"
												className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
											/>
											<Icon
												icon="mingcute:pdf-fill"
												className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
											/>
										</div>
										<span>PDF</span>
									</button>
								</HoverTip>

								{data.age && (
									<HoverTip tip={t("tooltips.hero.age")}>
										<span
											className={`cv-contact-link inline-flex items-center gap-2 ${typographyClasses.meta}`}
										>
											<Icon
												icon="mingcute:calendar-line"
												className="h-4 w-4 text-primary/70"
											/>
											<span className={`font-medium ${fontClass}`}>
												{formatAge(data.age)}
											</span>
										</span>
									</HoverTip>
								)}
							</div>
						</TooltipProvider>
					</div>
				</div>
			</div>
		</header>
	);
}
