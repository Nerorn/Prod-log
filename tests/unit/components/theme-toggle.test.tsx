import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "#/components/theme-toggle";
import { toggleTheme } from "#/stores/theme";

// Mock the theme store and the toggle action
vi.mock("#/stores/theme", () => ({
	themeStore: { state: "light" },
	toggleTheme: vi.fn(),
}));

vi.mock("@tanstack/react-store", () => ({
	useStore: vi.fn((store) => store.state),
}));

describe("ThemeToggle", () => {
	it("renders correctly with light theme", () => {
		render(<ThemeToggle />);
		// Light theme should show the moon icon (to switch to dark)
		const button = screen.getByRole("button", { name: "Tema escuro" });
		expect(button).toBeInTheDocument();
	});

	it("calls toggleTheme when clicked", () => {
		render(<ThemeToggle />);
		const button = screen.getByRole("button");
		fireEvent.click(button);
		expect(toggleTheme).toHaveBeenCalled();
	});
});
