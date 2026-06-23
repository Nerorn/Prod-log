import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the full Select to avoid Radix portal/timeout issues in jsdom
vi.mock("radix-ui", () => {
	return {
		Select: {
			Root: ({ children, ...props }: any) => <div data-slot="select" {...props}>{children}</div>,
			Group: ({ children, ...props }: any) => <div data-slot="select-group" {...props}>{children}</div>,
			Value: ({ children, ...props }: any) => <span data-slot="select-value" {...props}>{children}</span>,
			Trigger: ({ children, ...props }: any) => <button role="combobox" type="button" data-slot="select-trigger" {...props}>{children}</button>,
			Content: ({ children, ...props }: any) => <div data-slot="select-content" {...props}>{children}</div>,
			Label: ({ children, ...props }: any) => <span data-slot="select-label" {...props}>{children}</span>,
			Item: ({ children, ...props }: any) => <div data-slot="select-item" role="option" {...props}>{children}</div>,
			ItemText: ({ children }: any) => <span>{children}</span>,
			ItemIndicator: ({ children }: any) => <span>{children}</span>,
			Separator: (props: any) => <hr data-slot="select-separator" {...props} />,
			ScrollUpButton: ({ children, ...props }: any) => <div {...props}>{children}</div>,
			ScrollDownButton: ({ children, ...props }: any) => <div {...props}>{children}</div>,
			Icon: ({ children }: any) => <span>{children}</span>,
			Portal: ({ children }: any) => <div>{children}</div>,
			Viewport: ({ children, ...props }: any) => <div {...props}>{children}</div>,
		},
	};
});

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";

describe("Select", () => {
	it("renders a select trigger", () => {
		render(
			<Select defaultValue="a">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">Option A</SelectItem>
					<SelectItem value="b">Option B</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("renders with sm size trigger", () => {
		render(
			<Select defaultValue="a">
				<SelectTrigger size="sm">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="a">Item A</SelectItem>
				</SelectContent>
			</Select>,
		);
		const trigger = screen.getByRole("combobox");
		expect(trigger).toHaveAttribute("data-size", "sm");
	});

	it("renders with groups and labels", () => {
		render(
			<Select defaultValue="a">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Group 1</SelectLabel>
						<SelectItem value="a">Item A</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Group 2</SelectLabel>
						<SelectItem value="b">Item B</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByRole("combobox")).toBeInTheDocument();
		expect(screen.getByText("Group 1")).toBeInTheDocument();
		expect(screen.getByText("Group 2")).toBeInTheDocument();
	});

	it("renders items in content", () => {
		render(
			<Select defaultValue="val1">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="val1">First Value</SelectItem>
					<SelectItem value="val2">Second Value</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByText("First Value")).toBeInTheDocument();
		expect(screen.getByText("Second Value")).toBeInTheDocument();
	});
});
