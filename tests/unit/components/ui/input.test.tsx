import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "#/components/ui/input";

describe("Input", () => {
	it("renders an input element", () => {
		render(<Input data-testid="input" />);
		const input = screen.getByTestId("input");
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe("INPUT");
	});

	it("has data-slot attribute", () => {
		render(<Input data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveAttribute("data-slot", "input");
	});

	it("passes type prop", () => {
		render(<Input type="email" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
	});

	it("merges custom className", () => {
		render(<Input className="custom" data-testid="input" />);
		expect(screen.getByTestId("input").className).toContain("custom");
	});

	it("passes placeholder prop", () => {
		render(<Input placeholder="Enter text" />);
		expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
	});

	it("supports disabled state", () => {
		render(<Input disabled data-testid="input" />);
		expect(screen.getByTestId("input")).toBeDisabled();
	});
});
