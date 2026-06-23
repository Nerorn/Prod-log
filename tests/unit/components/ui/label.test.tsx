import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Label } from "#/components/ui/label";

describe("Label", () => {
	it("renders label text", () => {
		render(<Label>Email</Label>);
		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("has data-slot attribute", () => {
		render(<Label data-testid="label">Name</Label>);
		expect(screen.getByTestId("label")).toHaveAttribute("data-slot", "label");
	});

	it("merges custom className", () => {
		render(<Label className="custom" data-testid="label">Test</Label>);
		expect(screen.getByTestId("label").className).toContain("custom");
	});

	it("associates with input via htmlFor", () => {
		render(
			<>
				<Label htmlFor="test-input">Test Label</Label>
				<input id="test-input" />
			</>,
		);
		expect(screen.getByText("Test Label")).toHaveAttribute("for", "test-input");
	});
});
