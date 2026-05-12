import { Store } from "@tanstack/store";

export type Theme = "light" | "dark";

const STORAGE_KEY = "prod-log-theme";

function readInitial(): Theme {
	if (typeof window === "undefined") return "light";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") return stored;
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export const themeStore = new Store<Theme>(readInitial());

function apply(theme: Theme) {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle("dark", theme === "dark");
}

if (typeof window !== "undefined") {
	apply(themeStore.state);
	themeStore.subscribe(() => {
		const next = themeStore.state;
		window.localStorage.setItem(STORAGE_KEY, next);
		apply(next);
	});
}

export function toggleTheme() {
	themeStore.setState((s) => (s === "dark" ? "light" : "dark"));
}

export function setTheme(theme: Theme) {
	themeStore.setState(() => theme);
}
