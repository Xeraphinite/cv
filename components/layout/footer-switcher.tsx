"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FooterSwitcherOption {
	value: string;
	label: string;
	icon: string;
}

interface FooterSwitcherProps {
	value: string;
	triggerLabel: string;
	ariaLabel: string;
	tooltip: string;
	options: readonly FooterSwitcherOption[];
	onValueChange: (value: string) => void;
}

const triggerClassName =
	"h-7 shrink-0 gap-1.5 rounded-xl px-2 hover:bg-muted/50";
const itemClassName = "cursor-pointer gap-2";

export function FooterSwitcherPlaceholder() {
	return (
		<span aria-hidden="true" className="inline-block h-7 w-[5.5rem] shrink-0" />
	);
}

export function FooterSwitcher({
	value,
	triggerLabel,
	ariaLabel,
	tooltip,
	options,
	onValueChange,
}: FooterSwitcherProps) {
	const currentOption =
		options.find((option) => option.value === value) ?? options[0];

	if (!currentOption) {
		return null;
	}

	return (
		<DropdownMenu modal={false}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className={triggerClassName}
							aria-label={ariaLabel}
						>
							<Icon icon={currentOption.icon} className="h-3.5 w-3.5" />
							<span className="cv-locale-sans truncate text-sm">
								{triggerLabel}
							</span>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent side="top">
					<span>{tooltip}</span>
				</TooltipContent>
			</Tooltip>

			<DropdownMenuContent
				align="end"
				className="w-40 rounded-xl"
				sideOffset={8}
			>
				<DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
					{options.map((option) => (
						<DropdownMenuRadioItem
							key={option.value}
							value={option.value}
							className={itemClassName}
						>
							<Icon icon={option.icon} className="h-4 w-4" />
							<span className="cv-locale-sans">{option.label}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
