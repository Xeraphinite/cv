"use client";

import {
	play,
	setEnabled as setCuelumeEnabled,
	setVolume,
	sounds,
	type SoundName,
} from "cuelume";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const STORAGE_KEY = "minimal-cv-preferences-v1";
const INTERACTIVE_SELECTOR =
	'a[href], button, input, select, textarea, [role="button"], [role="link"], [role="menuitem"], [role="radio"], [role="switch"], [role="tab"]';
const soundNames = new Set<string>(sounds);

interface StoredPreferences {
	soundEnabled?: boolean;
}

interface SoundPreferencesContextValue {
	soundEnabled: boolean;
	setSoundEnabled: (enabled: boolean) => void;
}

const SoundPreferencesContext =
	createContext<SoundPreferencesContextValue | null>(null);

function getInteractiveTarget(event: Event) {
	if (!(event.target instanceof Element)) return null;

	const target = event.target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
	if (
		!target ||
		target.matches(":disabled") ||
		target.getAttribute("aria-disabled") === "true" ||
		target.closest("[data-sound-ignore]")
	) {
		return null;
	}

	return target;
}

function getCue(target: HTMLElement): SoundName {
	const requested = target.dataset.sound;
	return requested && soundNames.has(requested)
		? (requested as SoundName)
		: "press";
}

export function InteractionSoundProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [soundEnabled, setSoundEnabledState] = useState(true);

	useEffect(() => {
		setVolume(0.22);

		try {
			const saved = window.localStorage.getItem(STORAGE_KEY);
			const preferences = saved
				? (JSON.parse(saved) as StoredPreferences)
				: null;
			const enabled = preferences?.soundEnabled ?? true;
			setSoundEnabledState(enabled);
			setCuelumeEnabled(enabled);
		} catch {
			setCuelumeEnabled(true);
		}
	}, []);

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			const target = getInteractiveTarget(event);
			if (target) play(getCue(target));
		};

		const handleKeyboardActivation = (event: MouseEvent) => {
			if (event.detail !== 0) return;
			const target = getInteractiveTarget(event);
			if (target) play(getCue(target));
		};

		document.addEventListener("pointerdown", handlePointerDown, true);
		document.addEventListener("click", handleKeyboardActivation, true);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown, true);
			document.removeEventListener("click", handleKeyboardActivation, true);
		};
	}, []);

	const setSoundEnabled = useCallback((enabled: boolean) => {
		setSoundEnabledState(enabled);
		setCuelumeEnabled(enabled);

		try {
			window.localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ soundEnabled: enabled } satisfies StoredPreferences),
			);
		} catch {
			// Sound still works for this visit when storage is unavailable.
		}

		if (enabled) play("ready", { volume: 0.55 });
	}, []);

	const value = useMemo(
		() => ({ soundEnabled, setSoundEnabled }),
		[soundEnabled, setSoundEnabled],
	);

	return (
		<SoundPreferencesContext.Provider value={value}>
			{children}
		</SoundPreferencesContext.Provider>
	);
}

export function useSoundPreferences() {
	const context = useContext(SoundPreferencesContext);
	if (!context) {
		throw new Error(
			"useSoundPreferences must be used within InteractionSoundProvider",
		);
	}
	return context;
}
