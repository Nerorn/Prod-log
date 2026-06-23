import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

describe("Card", () => {
	it("renders children", () => {
		render(<Card>Card content</Card>);
		expect(screen.getByText("Card content")).toBeInTheDocument();
	});

	it("has the correct data-slot", () => {
		render(<Card data-testid="card">test</Card>);
		expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
	});

	it("merges custom className", () => {
		render(<Card className="my-custom" data-testid="card">test</Card>);
		expect(screen.getByTestId("card").className).toContain("my-custom");
	});
});

describe("CardHeader", () => {
	it("renders with data-slot", () => {
		render(<CardHeader data-testid="header">Header</CardHeader>);
		expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "card-header");
	});
});

describe("CardTitle", () => {
	it("renders with data-slot", () => {
		render(<CardTitle data-testid="title">Title</CardTitle>);
		expect(screen.getByTestId("title")).toHaveAttribute("data-slot", "card-title");
	});
});

describe("CardDescription", () => {
	it("renders with data-slot", () => {
		render(<CardDescription data-testid="desc">Desc</CardDescription>);
		expect(screen.getByTestId("desc")).toHaveAttribute("data-slot", "card-description");
	});
});

describe("CardAction", () => {
	it("renders with data-slot", () => {
		render(<CardAction data-testid="action">Action</CardAction>);
		expect(screen.getByTestId("action")).toHaveAttribute("data-slot", "card-action");
	});
});

describe("CardContent", () => {
	it("renders with data-slot", () => {
		render(<CardContent data-testid="content">Content</CardContent>);
		expect(screen.getByTestId("content")).toHaveAttribute("data-slot", "card-content");
	});
});

describe("CardFooter", () => {
	it("renders with data-slot", () => {
		render(<CardFooter data-testid="footer">Footer</CardFooter>);
		expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "card-footer");
	});
});
