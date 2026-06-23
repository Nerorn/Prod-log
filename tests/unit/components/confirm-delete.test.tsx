import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmDelete } from "#/components/confirm-delete";

describe("ConfirmDelete", () => {
	it("renders the trigger", () => {
		render(
			<ConfirmDelete
				trigger={<button type="button">Delete</button>}
				onConfirm={vi.fn()}
			/>,
		);
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it("opens dialog when trigger is clicked", async () => {
		render(
			<ConfirmDelete
				trigger={<button type="button">Delete</button>}
				onConfirm={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByText("Delete"));
		expect(await screen.findByText("Confirmar exclusão")).toBeInTheDocument();
		expect(screen.getByText("Esta ação não pode ser desfeita.")).toBeInTheDocument();
	});

	it("renders with custom title and description", async () => {
		render(
			<ConfirmDelete
				trigger={<button type="button">Remove</button>}
				title="Custom Title"
				description="Custom desc"
				onConfirm={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByText("Remove"));
		expect(await screen.findByText("Custom Title")).toBeInTheDocument();
		expect(screen.getByText("Custom desc")).toBeInTheDocument();
	});

	it("renders custom button labels", async () => {
		render(
			<ConfirmDelete
				trigger={<button type="button">Remove</button>}
				confirmLabel="Yes, delete"
				cancelLabel="No, keep"
				onConfirm={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByText("Remove"));
		expect(await screen.findByText("Yes, delete")).toBeInTheDocument();
		expect(screen.getByText("No, keep")).toBeInTheDocument();
	});

	it("calls onConfirm when confirm button is clicked", async () => {
		const onConfirm = vi.fn();
		render(
			<ConfirmDelete
				trigger={<button type="button">Delete</button>}
				onConfirm={onConfirm}
			/>,
		);
		fireEvent.click(screen.getByText("Delete"));
		const confirmBtn = await screen.findByText("Excluir");
		fireEvent.click(confirmBtn);
		expect(onConfirm).toHaveBeenCalled();
	});
});
