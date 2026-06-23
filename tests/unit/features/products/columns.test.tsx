import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	buildProductColumns,
	type ProductRow,
} from "#/features/products/columns";

// Mock the ConfirmDelete so we don't depend on the alert dialog behavior
vi.mock("#/components/confirm-delete", () => ({
	ConfirmDelete: ({ trigger, onConfirm }: any) => (
		<div data-testid="confirm-delete" onClick={onConfirm}>
			{trigger}
		</div>
	),
}));

// Mock router
vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to, ...props }: any) => (
		<a href={to} {...props}>{children}</a>
	),
}));

const mockProduct: ProductRow = {
	id: "p1",
	sku: "SKU-001",
	name: "Product One",
	description: "A test product",
	priceCents: 1500,
	stock: 10,
	createdAt: new Date("2024-01-15"),
	updatedAt: new Date("2024-01-15"),
};

const zeroStockProduct: ProductRow = {
	...mockProduct,
	id: "p2",
	stock: 0,
};

describe("buildProductColumns", () => {
	const onEdit = vi.fn();
	const onDelete = vi.fn();

	it("returns an array of column definitions", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		expect(Array.isArray(columns)).toBe(true);
		expect(columns.length).toBe(6);
	});

	it("has SKU column", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const skuCol = columns.find((c) => "accessorKey" in c && c.accessorKey === "sku");
		expect(skuCol).toBeDefined();
		expect((skuCol as any).header).toBe("SKU");
	});

	it("has Name column", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const nameCol = columns.find((c) => "accessorKey" in c && c.accessorKey === "name");
		expect(nameCol).toBeDefined();
		expect((nameCol as any).header).toBe("Nome");
	});

	it("has price column that formats as BRL", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const priceCol = columns.find(
			(c) => "accessorKey" in c && c.accessorKey === "priceCents",
		);
		expect(priceCol).toBeDefined();

		// Test the cell renderer
		const cellFn = (priceCol as any).cell;
		const result = cellFn({ row: { original: mockProduct } });
		expect(result).toContain("15");
	});

	it("has stock column with red text for zero stock", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const stockCol = columns.find(
			(c) => "accessorKey" in c && c.accessorKey === "stock",
		);
		expect(stockCol).toBeDefined();

		const cellFn = (stockCol as any).cell;
		// Non-zero stock
		const result = cellFn({ row: { original: mockProduct } });
		const { container } = render(result);
		const span = container.querySelector("span");
		expect(span?.className ?? "").not.toContain("text-destructive");
		expect(span?.textContent).toBe("10");
	});

	it("stock column shows destructive class for zero stock", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const stockCol = columns.find(
			(c) => "accessorKey" in c && c.accessorKey === "stock",
		);
		const cellFn = (stockCol as any).cell;
		const result = cellFn({ row: { original: zeroStockProduct } });
		const { container } = render(result);
		const span = container.querySelector("span");
		expect(span?.className).toContain("text-destructive");
	});

	it("has created date column", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const dateCol = columns.find(
			(c) => "accessorKey" in c && c.accessorKey === "createdAt",
		);
		expect(dateCol).toBeDefined();
		const cellFn = (dateCol as any).cell;
		const result = cellFn({ row: { original: mockProduct } });
		expect(typeof result).toBe("string");
	});

	it("has actions column with edit and delete", () => {
		const columns = buildProductColumns({ onEdit, onDelete });
		const actionsCol = columns.find((c) => "id" in c && c.id === "actions");
		expect(actionsCol).toBeDefined();

		// Test the header renders Ações (sr-only)
		const headerFn = (actionsCol as any).header;
		const headerResult = headerFn();
		const { container: hc } = render(headerResult);
		expect(hc.querySelector(".sr-only")?.textContent).toBe("Ações");

		// Test the cell renders edit and delete buttons
		const cellFn = (actionsCol as any).cell;
		const result = cellFn({ row: { original: mockProduct } });
		const { container } = render(result);
		expect(container.querySelector('[aria-label="Editar"]')).toBeInTheDocument();
		expect(container.querySelector('[aria-label="Excluir"]')).toBeInTheDocument();
	});
});
