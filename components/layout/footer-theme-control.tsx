"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FooterSwitcher, FooterSwitcherPlaceholder } from "./footer-switcher";

const themeOptions = [
	{
		value: "light",
		labelKey: "footer.themeOptions.light",
		icon: "mingcute:sun-line",
	},
	{
		value: "dark",
		labelKey: "footer.themeOptions.dark",
		icon: "mingcute:moon-line",
	},
	{
		value: "system",
		labelKey: "footer.themeOptions.system",
		icon: "mingcute:computer-line",
	},
] as const;

export function FooterThemeControl() {
	const t = useTranslations();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <FooterSwitcherPlaceholder />;
	}

	const currentThemeOption =
		themeOptions.find((option) => option.value === theme) || themeOptions[2];
	const currentThemeLabel = t(currentThemeOption.labelKey);
	const controlLabel = t("tooltips.footer.theme", {
		theme: currentThemeLabel,
	});

	return (
		<FooterSwitcher
			value={theme || "system"}
			triggerLabel={currentThemeLabel}
			ariaLabel={controlLabel}
			tooltip={controlLabel}
			options={themeOptions.map((option) => ({
				value: option.value,
				label: t(option.labelKey),
				icon: option.icon,
			}))}
			onValueChange={setTheme}
		/>
	);
}
