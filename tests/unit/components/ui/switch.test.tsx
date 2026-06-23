import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock radix-ui Switch to avoid jsdom timeout issues
vi.mock("radix-ui", () => ({
	Switch: {
		Root: ({ children, className, ...props }: any) => (
			<button type="button" role="switch" className={className} {...props}>
				{children}
			</button>
		),
		Thumb: (props: any) => <span {...props} />,
	},
}));

import { Switch } from "#/components/ui/switch";

describe("Switch", () => {
	it("renders a switch", () => {
		render(<Switch aria-label="Toggle" />);
		const switchEl = screen.getByRole("switch");
		expect(switchEl).toBeInTheDocument();
	});

	it("has data-slot attribute", () => {
		render(<Switch aria-label="Toggle" />);
		const switchEl = screen.getByRole("switch");
		expect(switchEl).toHaveAttribute("data-slot", "switch");
	});

	it("renders with default size", () => {
		render(<Switch aria-label="Toggle" />);
		const switchEl = screen.getByRole("switch");
		expect(switchEl).toHaveAttribute("data-size", "default");
	});

	it("renders with sm size", () => {
		render(<Switch size="sm" aria-label="Toggle" />);
		const switchEl = screen.getByRole("switch");
		expect(switchEl).toHaveAttribute("data-size", "sm");
	});

	it("merges custom className", () => {
		render(<Switch className="custom" aria-label="Toggle" />);
		const switchEl = screen.getByRole("switch");
		expect(switchEl.className).toContain("custom");
	});
});
