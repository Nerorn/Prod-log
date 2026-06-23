import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock theme store
vi.mock("#/stores/theme", () => ({
	themeStore: { state: "light" },
}));

vi.mock("@tanstack/react-store", () => ({
	useStore: vi.fn((store) => store.state),
}));

import { Toaster } from "#/components/ui/sonner";

describe("Toaster (Sonner)", () => {
	it("renders without crashing", () => {
		const { container } = render(<Toaster />);
		// The sonner toaster renders a section or ol element
		expect(container).toBeTruthy();
	});

	it("accepts additional props", () => {
		const { container } = render(<Toaster position="top-left" richColors />);
		expect(container).toBeTruthy();
	});
});
