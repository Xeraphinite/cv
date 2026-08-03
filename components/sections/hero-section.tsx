"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
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
import { AnimatedHanziSignature } from "@/components/sections/animated-hanzi-signature";
import { LauraTitle } from "@/components/sections/laura-title";
import { MarkdownText } from "@/components/ui/markdown-text";
import { PaperTextureImage } from "@/components/ui/paper-texture-image";
import {
	decodeEmailFromClient,
	encodeEmailForClient,
	toObfuscatedMailtoHref,
} from "@/lib/email-obfuscation";
import { getFontClass, getTypographyClasses } from "@/lib/utils";
import type { SocialProfileData } from "@/lib/types/cv";

const quillPenLineIcon: IconifyIcon = {
	body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.93 16.865s6.189.174 9.899-3.536c.988-.988 1.7-2.152 2.214-3.328c.294-.673.523-1.35.7-2l.181-.702M5.93 16.865s.533-5.483 4.243-9.193c3.668-3.668 9.069-4.23 9.19-4.242q.004 0 .005.004c.066.095 1.091 1.63-.187 3.567a2 2 0 0 1-.256.298M5.93 16.865S5.5 20 5.5 21M14 10c1.349-.45 3.965-1.767 4.924-2.702"/>',
	width: 24,
	height: 24,
};

const quillPenFillIcon: IconifyIcon = {
	body: '<path fill="currentColor" d="M19.262 2.435a1.01 1.01 0 0 1 .944.454c.94 1.412.768 3.478-.285 4.795l-.002-.001c-.264.342-.647.657-1.012.919c-.439.316-.962.636-1.499.933c-.443.246-.91.484-1.363.699c.916.043 1.972.018 3.039-.137q-.06.151-.125.304c-.552 1.263-1.328 2.54-2.424 3.635c-2.05 2.05-4.74 2.992-6.843 3.431c-1.175.246-2.199.34-2.882.377l-.102.831c-.11.927-.17 1.898-.208 2.325c-.047.54-.448 1-1 1a1 1 0 0 1-1-1c0-.571.117-1.669.222-2.56c.204-1.731.445-3.426.986-5.09c.625-1.92 1.75-4.379 3.757-6.385c3.933-3.933 9.649-4.515 9.797-4.53"/>',
	width: 24,
	height: 24,
};

interface HeroSectionProps {
	data: {
		name: string;
		enName?: string;
		furiganaName?: string;
		furigana?: string;
		avatar: string;
		portrait?: string;
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
			writing?: string;
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
		key: "writing",
		iconLine: quillPenLineIcon,
		iconFill: quillPenFillIcon,
		getHref: (value: string) => value,
		getLabel: (_value: string) => "Writing",
		title: "Writing",
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
	icon: string | IconifyIcon;
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
						<PaperTextureImage
							src={avatar}
							alt=""
							sizes="32px"
							className="h-8 w-8"
						/>
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
					<PaperTextureImage
						src={bluesky?.avatarUrl || avatar}
						alt=""
						sizes="40px"
						unoptimized={Boolean(bluesky?.avatarUrl)}
						fallbackSrc={avatar}
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

	if (platform === "writing") {
		let hostname = rawValue.replace(/^https?:\/\//, "").replace(/\/$/, "");
		try {
			hostname = new URL(rawValue).hostname.replace(/^www\./, "");
		} catch {
			// Keep the readable fallback derived from the supplied URL.
		}

		return (
			<div className="cv-writing-card">
				<div className="cv-writing-card-header">
					<span className="cv-writing-card-icon">
						<Icon icon={icon} className="h-5 w-5" aria-hidden="true" />
					</span>
					<span>{hostname}</span>
				</div>
				<strong>{label}</strong>
				<p>{profileName}</p>
				<div className="cv-writing-card-footer">
					<span>{action}</span>
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
					: platform === "writing"
						? "cv-contact-card-writing"
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
	const [portraitCardOpen, setPortraitCardOpen] = useState(false);

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
			case "writing":
				return t("tooltips.hero.writing");
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

	const signatureText = (data.furiganaName || data.name).replaceAll("|", "");
	const englishName = data.enName || data.name;
	const avatarSource =
		data.avatar || "/images/placeholders/placeholder-user.jpg";
	const portraitSource = data.portrait || avatarSource;

	return (
		<header className="mb-6 sm:mb-8">
			<div className="cv-card">
				<div className="grid grid-cols-1 gap-6">
					<HoverCard
						open={portraitCardOpen}
						onOpenChange={setPortraitCardOpen}
						openDelay={140}
						closeDelay={120}
					>
						<HoverCardTrigger asChild>
							<button
								type="button"
								className="cv-avatar aspect-square w-full max-w-80 sm:max-w-72 lg:max-w-none"
								aria-label={t("tooltips.hero.avatarShowPhoto")}
								aria-controls="hero-portrait-preview"
								aria-expanded={portraitCardOpen}
								onFocus={() => setPortraitCardOpen(true)}
								onBlur={() => setPortraitCardOpen(false)}
								onClick={() => setPortraitCardOpen(true)}
							>
								<PaperTextureImage
									src={avatarSource}
									alt={`${data.name} - ${data.enName ?? data.name}`}
									className="h-full w-full"
									priority
									{...getResponsiveImageProps(
										avatarSource,
										"(max-width: 639px) 320px, (max-width: 1023px) 288px, 320px",
									)}
								/>
							</button>
						</HoverCardTrigger>
						<HoverCardContent
							id="hero-portrait-preview"
							role="region"
							aria-label={t("tooltips.hero.avatarCardCaption")}
							side="bottom"
							align="start"
							sideOffset={12}
							collisionPadding={16}
							className="cv-avatar-card"
						>
							<PaperTextureImage
								src={portraitSource}
								alt={`${t("tooltips.hero.avatarCardCaption")} - ${data.name}`}
								className="aspect-[7/5] w-full rounded-lg"
								imageClassName="cv-avatar-card-photo"
								{...getResponsiveImageProps(
									portraitSource,
									"(max-width: 639px) calc(100vw - 48px), 416px",
								)}
							/>
							<p className="cv-avatar-card-caption">
								{t("tooltips.hero.avatarCardCaption")}
							</p>
						</HoverCardContent>
					</HoverCard>

					<div className="min-w-0 [&>*:not(:last-child)]:mb-4">
						<div>
							<h1 className="mb-2">
								<AnimatedHanziSignature
									text={signatureText}
									reading={locale === "ja" ? data.furigana : undefined}
								/>
							</h1>

							<h2 className="cv-hero-english-name text-muted-foreground/85">
								<LauraTitle text={englishName} />
							</h2>
						</div>

						{data.description && (
							<MarkdownText
								content={data.description}
								className={`${typographyClasses.body} text-primary/90`}
							/>
						)}

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
										title: defaultTitle,
										external,
									}) => {
										const value = data.social[key as keyof typeof data.social];
										if (!value) return null;

										const href = getHref(value);
										const title =
											key === "writing" ? t("content.writing") : defaultTitle;
										const label =
											key === "writing"
												? t("content.writing")
												: getLabel(value);
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
