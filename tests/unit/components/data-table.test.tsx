import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "#/components/data-table";

// Mock the Select component to avoid Radix UI portal issues
vi.mock("#/components/ui/select", () => ({
	Select: ({ children }: any) => <div data-testid="select">{children}</div>,
	SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
	SelectContent: ({ children }: any) => <div>{children}</div>,
	SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
	SelectValue: () => <span>Value</span>,
}));

interface TestRow {
	id: string;
	name: string;
	value: number;
}

const testColumns = [
	{ header: "Name", accessorKey: "name" as const },
	{ header: "Amount", accessorKey: "value" as const },
];

const testData: TestRow[] = [
	{ id: "1", name: "Item 1", value: 100 },
	{ id: "2", name: "Item 2", value: 200 },
	{ id: "3", name: "Item 3", value: 300 },
];

describe("DataTable", () => {
	it("renders table with data", () => {
		render(<DataTable columns={testColumns} data={testData} />);
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Amount")).toBeInTheDocument();
		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
		expect(screen.getByText("Item 3")).toBeInTheDocument();
	});

	it("shows empty message when no data", () => {
		render(<DataTable columns={testColumns} data={[]} />);
		expect(screen.getByText("Sem registros")).toBeInTheDocument();
	});

	it("shows custom empty message", () => {
		render(
			<DataTable columns={testColumns} data={[]} emptyMessage="Nothing here" />,
		);
		expect(screen.getByText("Nothing here")).toBeInTheDocument();
	});

	it("renders pagination controls", () => {
		render(<DataTable columns={testColumns} data={testData} />);
		expect(screen.getByText("Linhas por página")).toBeInTheDocument();
		expect(screen.getByLabelText("Página anterior")).toBeInTheDocument();
		expect(screen.getByLabelText("Próxima página")).toBeInTheDocument();
	});

	it("shows row count info", () => {
		render(<DataTable columns={testColumns} data={testData} />);
		// Should show something like "1–3 de 3"
		expect(screen.getByText(/de 3/)).toBeInTheDocument();
	});

	it("disables previous page button on first page", () => {
		render(<DataTable columns={testColumns} data={testData} />);
		expect(screen.getByLabelText("Página anterior")).toBeDisabled();
	});

	it("uses custom defaultPageSize", () => {
		// Create 25 items
		const manyItems = Array.from({ length: 25 }, (_, i) => ({
			id: String(i),
			name: `Item ${i}`,
			value: i,
		}));

		render(
			<DataTable columns={testColumns} data={manyItems} defaultPageSize={10} />,
		);
		// Should show first 10 items
		expect(screen.getByText("Item 0")).toBeInTheDocument();
		expect(screen.getByText("Item 9")).toBeInTheDocument();
		expect(screen.queryByText("Item 10")).not.toBeInTheDocument();
	});
});
