import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

describe("DropdownMenu", () => {
	it("renders the trigger", () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);
		expect(screen.getByText("Menu")).toBeInTheDocument();
	});

	it("shows menu content when opened", async () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem inset>Indented</DropdownMenuItem>
					<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		expect(await screen.findByText("Actions")).toBeInTheDocument();
		expect(screen.getByText("Edit")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
		expect(screen.getByText("Indented")).toBeInTheDocument();
		expect(screen.getByText("⌘K")).toBeInTheDocument();
	});

	it("renders checkbox items", async () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem checked>
						Checked item
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem checked={false}>
						Unchecked item
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		expect(await screen.findByText("Checked item")).toBeInTheDocument();
		expect(screen.getByText("Unchecked item")).toBeInTheDocument();
	});

	it("renders radio group items", async () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuRadioGroup value="option1">
						<DropdownMenuRadioItem value="option1">
							Option 1
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="option2">
							Option 2
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		expect(await screen.findByText("Option 1")).toBeInTheDocument();
		expect(screen.getByText("Option 2")).toBeInTheDocument();
	});

	it("renders sub menu", async () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Sub item</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		expect(await screen.findByText("More")).toBeInTheDocument();
	});

	it("renders sub trigger with inset", async () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger inset>Inset Sub</DropdownMenuSubTrigger>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const trigger = await screen.findByText("Inset Sub");
		expect(trigger.closest("[data-inset]")).toBeInTheDocument();
	});

	it("renders label with inset", async () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const label = await screen.findByText("Inset Label");
		expect(label.closest("[data-inset]")).toBeInTheDocument();
	});
});
