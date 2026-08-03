"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState, useTransition } from "react";
import { useSoundPreferences } from "@/components/sound-provider";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Locale, localeLabels, locales } from "@/i18n";
import { createLocalizedPath, getLocaleFromPathname } from "@/lib/i18n-utils";

const languageFlags: Record<Locale, string> = {
	en: "twemoji:flag-united-states",
	zh: "twemoji:flag-china",
	ja: "twemoji:flag-japan",
};

const themeOptions = [
	{
		value: "light",
		labelKey: "footer.themeOptions.light",
		icon: "mingcute:sun-line",
	},
	{
		value: "system",
		labelKey: "footer.themeOptions.system",
		icon: "mingcute:computer-line",
	},
	{
		value: "dark",
		labelKey: "footer.themeOptions.dark",
		icon: "mingcute:moon-line",
	},
] as const;

const optionClassName =
	"cv-locale-sans flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

interface PreferenceOptionProps {
	active: boolean;
	children: React.ReactNode;
	disabled?: boolean;
	onClick: () => void;
}

function PreferenceOption({
	active,
	children,
	disabled = false,
	onClick,
}: PreferenceOptionProps) {
	return (
		<button
			type="button"
			aria-pressed={active}
			className={clsx(
				optionClassName,
				active
					? "bg-background text-foreground shadow-sm"
					: "text-muted-foreground hover:text-foreground",
			)}
			data-sound="toggle"
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export function PreferencesControl() {
	const t = useTranslations();
	const pathname = usePathname();
	const router = useRouter();
	const currentLocale = getLocaleFromPathname(pathname) || "en";
	const { theme, setTheme } = useTheme();
	const { soundEnabled, setSoundEnabled } = useSoundPreferences();
	const [mounted, setMounted] = useState(false);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setMounted(true);
	}, []);

	const activeTheme = mounted ? (theme ?? "system") : "system";
	const preferencesLabel = t("footer.preferences");

	const handleLocaleChange = (locale: Locale) => {
		if (locale === currentLocale) return;
		startTransition(() => {
			router.push(createLocalizedPath(pathname, locale));
		});
	};

	return (
		<Popover>
			<Tooltip>
				<TooltipTrigger asChild>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-7 shrink-0 gap-1.5 rounded-xl px-2 hover:bg-muted/50"
							aria-label={t("tooltips.footer.preferences")}
						>
							<Icon icon="mingcute:settings-3-line" className="h-3.5 w-3.5" />
							<span className="cv-locale-sans text-sm">{preferencesLabel}</span>
						</Button>
					</PopoverTrigger>
				</TooltipTrigger>
				<TooltipContent side="top">
					<span>{t("tooltips.footer.preferences")}</span>
				</TooltipContent>
			</Tooltip>

			<PopoverContent
				align="end"
				aria-label={preferencesLabel}
				className="cv-locale-sans w-72 rounded-xl border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-zinc-900/95"
				side="top"
				sideOffset={8}
			>
				<div className="space-y-3">
					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5 px-0.5 text-muted-foreground text-sm">
							<Icon icon="mingcute:translate-2-line" className="h-3.5 w-3.5" />
							<span>{t("common.language")}</span>
						</div>
						<div
							aria-label={t("common.language")}
							className="flex gap-1 rounded-xl bg-muted/70 p-1"
							role="group"
						>
							{locales.map((locale) => (
								<PreferenceOption
									key={locale}
									active={currentLocale === locale}
									disabled={isPending}
									onClick={() => handleLocaleChange(locale)}
								>
									<Icon icon={languageFlags[locale]} className="h-3.5 w-3.5" />
									<span className="truncate">{localeLabels[locale]}</span>
								</PreferenceOption>
							))}
						</div>
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5 px-0.5 text-muted-foreground text-sm">
							<Icon icon="mingcute:palette-line" className="h-3.5 w-3.5" />
							<span>{t("footer.appearance")}</span>
						</div>
						<div
							aria-label={t("footer.appearance")}
							className="flex gap-1 rounded-xl bg-muted/70 p-1"
							role="group"
						>
							{themeOptions.map((option) => (
								<PreferenceOption
									key={option.value}
									active={activeTheme === option.value}
									disabled={!mounted}
									onClick={() => setTheme(option.value)}
								>
									<Icon icon={option.icon} className="h-3.5 w-3.5" />
									<span>{t(option.labelKey)}</span>
								</PreferenceOption>
							))}
						</div>
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5 px-0.5 text-muted-foreground text-sm">
							<Icon icon="mingcute:volume-line" className="h-3.5 w-3.5" />
							<span>{t("footer.sound")}</span>
						</div>
						<div
							aria-label={t("footer.sound")}
							className="flex gap-1 rounded-xl bg-muted/70 p-1"
							role="group"
						>
							<PreferenceOption
								active={soundEnabled}
								onClick={() => setSoundEnabled(true)}
							>
								<Icon icon="mingcute:volume-line" className="h-3.5 w-3.5" />
								<span>{t("footer.soundOptions.on")}</span>
							</PreferenceOption>
							<PreferenceOption
								active={!soundEnabled}
								onClick={() => setSoundEnabled(false)}
							>
								<Icon
									icon="mingcute:volume-mute-line"
									className="h-3.5 w-3.5"
								/>
								<span>{t("footer.soundOptions.off")}</span>
							</PreferenceOption>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
