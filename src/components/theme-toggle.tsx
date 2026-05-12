import { useStore } from "@tanstack/react-store";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { themeStore, toggleTheme } from "#/stores/theme";

export function ThemeToggle() {
	const theme = useStore(themeStore);
	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}
		>
			{theme === "dark" ? (
				<SunIcon className="size-4" />
			) : (
				<MoonIcon className="size-4" />
			)}
		</Button>
	);
}
