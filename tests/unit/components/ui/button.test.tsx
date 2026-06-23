import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "#/components/ui/button";

describe("Button", () => {
	it("renders children", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
	});

	it("renders with default variant and size", () => {
		render(<Button>Default</Button>);
		const btn = screen.getByRole("button");
		expect(btn).toHaveAttribute("data-variant", "default");
		expect(btn).toHaveAttribute("data-size", "default");
		expect(btn).toHaveAttribute("data-slot", "button");
	});

	it("renders with destructive variant", () => {
		render(<Button variant="destructive">Delete</Button>);
		const btn = screen.getByRole("button");
		expect(btn).toHaveAttribute("data-variant", "destructive");
	});

	it("renders with outline variant", () => {
		render(<Button variant="outline">Outline</Button>);
		const btn = screen.getByRole("button");
		expect(btn).toHaveAttribute("data-variant", "outline");
	});

	it("renders with ghost variant", () => {
		render(<Button variant="ghost">Ghost</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-variant", "ghost");
	});

	it("renders with link variant", () => {
		render(<Button variant="link">Link</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-variant", "link");
	});

	it("renders with secondary variant", () => {
		render(<Button variant="secondary">Sec</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-variant", "secondary");
	});

	it("renders with sm size", () => {
		render(<Button size="sm">Small</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-size", "sm");
	});

	it("renders with lg size", () => {
		render(<Button size="lg">Large</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
	});

	it("renders with icon size", () => {
		render(<Button size="icon">I</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-size", "icon");
	});

	it("renders with xs size", () => {
		render(<Button size="xs">XS</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("data-size", "xs");
	});

	it("renders as child (Slot) when asChild is true", () => {
		render(
			<Button asChild>
				<a href="/test">Link</a>
			</Button>,
		);
		const link = screen.getByRole("link", { name: "Link" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/test");
	});

	it("applies additional className", () => {
		render(<Button className="custom-class">Btn</Button>);
		const btn = screen.getByRole("button");
		expect(btn.className).toContain("custom-class");
	});

	it("passes extra props like disabled", () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});
});

describe("buttonVariants", () => {
	it("returns a string of classes", () => {
		const classes = buttonVariants({ variant: "default", size: "default" });
		expect(typeof classes).toBe("string");
		expect(classes.length).toBeGreaterThan(0);
	});
});
