import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	buildUserColumns,
	type UserRow,
} from "#/features/users/columns";

// Mock the ConfirmDelete
vi.mock("#/components/confirm-delete", () => ({
	ConfirmDelete: ({ trigger, onConfirm }: any) => (
		<div data-testid="confirm-delete" onClick={onConfirm}>
			{trigger}
		</div>
	),
}));

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: any) => (
		<a href={to} {...props}>{children}</a>
	),
}));

const mockUser: UserRow = {
	id: "u1",
	email: "john@example.com",
	name: "John Doe",
	role: "admin",
	createdAt: new Date("2024-01-15"),
	updatedAt: new Date("2024-01-15"),
};

const regularUser: UserRow = {
	...mockUser,
	id: "u2",
	role: "user",
	name: "Jane Doe",
};

describe("buildUserColumns", () => {
	const onEdit = vi.fn();
	const onDelete = vi.fn();

	it("returns an array of column definitions", () => {
		const columns = buildUserColumns({ onEdit, onDelete });
		expect(Array.isArray(columns)).toBe(true);
		expect(columns.length).toBe(5);
	});

	it("has email column", () => {
		const columns = buildUserColumns({ onEdit, onDelete });
		const emailCol = columns.find((c) => "accessorKey" in c && c.accessorKey === "email");
		expect(emailCol).toBeDefined();
		expect((emailCol as any).header).toBe("E-mail");
	});

	it("has name column", () => {
		const columns = buildUserColumns({ onEdit, onDelete });
		const nameCol = columns.find((c) => "accessorKey" in c && c.accessorKey === "name");
		expect(nameCol).toBeDefined();
	});

	it("has role column that maps admin to Admin", () => {
		const columns = buildUserColumns({ onEdit, onDelete });
		const roleCol = columns.find(
			(c) => "accessorKey" in c && c.accessorKey === "role",
		);
		expect(roleCol).toBeDefined();

		const cellFn = (roleCol as any).cell;
		expect(cellFn({ row: { original: mockUser } })).toBe("Admin");
		expect(cellFn({ row: { original: regularUser } })).toBe("Usuário");
	});

	it("has created date column", () => {
		const columns = buildUserColumns({ onEdit, onDelete });
		const dateCol = columns.find(
			(c) => "accessorKey" in c && c.accessorKey === "createdAt",
		);
		expect(dateCol).toBeDefined();
		const cellFn = (dateCol as any).cell;
		expect(typeof cellFn({ row: { original: mockUser } })).toBe("string");
	});

	it("has actions column", () => {
		const columns = buildUserColumns({ onEdit, onDelete });
		const actionsCol = columns.find((c) => "id" in c && c.id === "actions");
		expect(actionsCol).toBeDefined();
	});

	it("disables delete button for current user (isSelf)", () => {
		const columns = buildUserColumns({
			onEdit,
			onDelete,
			currentUserId: "u1",
		});
		const actionsCol = columns.find((c) => "id" in c && c.id === "actions");
		const cellFn = (actionsCol as any).cell;
		const result = cellFn({ row: { original: mockUser } });
		const { container } = render(result);
		const deleteBtn = container.querySelector('[aria-label="Excluir"]');
		expect(deleteBtn).toBeDisabled();
	});

	it("enables delete button for other users", () => {
		const columns = buildUserColumns({
			onEdit,
			onDelete,
			currentUserId: "u1",
		});
		const actionsCol = columns.find((c) => "id" in c && c.id === "actions");
		const cellFn = (actionsCol as any).cell;
		const result = cellFn({ row: { original: regularUser } });
		const { container } = render(result);
		const deleteBtn = container.querySelector('[aria-label="Excluir"]');
		expect(deleteBtn).not.toBeDisabled();
	});
});
