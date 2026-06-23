import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "#/components/ui/textarea";

describe("Textarea", () => {
	it("renders a textarea element", () => {
		render(<Textarea data-testid="textarea" />);
		const el = screen.getByTestId("textarea");
		expect(el).toBeInTheDocument();
		expect(el.tagName).toBe("TEXTAREA");
	});

	it("has data-slot attribute", () => {
		render(<Textarea data-testid="textarea" />);
		expect(screen.getByTestId("textarea")).toHaveAttribute("data-slot", "textarea");
	});

	it("merges custom className", () => {
		render(<Textarea className="custom" data-testid="textarea" />);
		expect(screen.getByTestId("textarea").className).toContain("custom");
	});

	it("passes placeholder prop", () => {
		render(<Textarea placeholder="Type here" />);
		expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
	});

	it("supports disabled state", () => {
		render(<Textarea disabled data-testid="textarea" />);
		expect(screen.getByTestId("textarea")).toBeDisabled();
	});
});
