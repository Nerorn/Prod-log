import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

describe("Table components", () => {
	it("renders a full table with all sub-components", () => {
		render(
			<Table>
				<TableCaption>A list of items</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Value</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Item 1</TableCell>
						<TableCell>100</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Total</TableCell>
						<TableCell>100</TableCell>
					</TableRow>
				</TableFooter>
			</Table>,
		);

		expect(screen.getByText("A list of items")).toBeInTheDocument();
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Total")).toBeInTheDocument();
	});

	it("Table has correct data-slot", () => {
		render(
			<Table data-testid="table">
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);
		// The table wrapper should be present
		expect(screen.getByText("Cell")).toBeInTheDocument();
	});

	it("TableHeader has data-slot", () => {
		const { container } = render(
			<table>
				<TableHeader data-testid="header">
					<tr>
						<th>Test</th>
					</tr>
				</TableHeader>
			</table>,
		);
		const thead = container.querySelector("[data-slot='table-header']");
		expect(thead).toBeInTheDocument();
	});

	it("TableBody has data-slot", () => {
		const { container } = render(
			<table>
				<TableBody data-testid="body">
					<tr>
						<td>Test</td>
					</tr>
				</TableBody>
			</table>,
		);
		const tbody = container.querySelector("[data-slot='table-body']");
		expect(tbody).toBeInTheDocument();
	});

	it("TableFooter has data-slot", () => {
		const { container } = render(
			<table>
				<TableFooter>
					<tr>
						<td>Foot</td>
					</tr>
				</TableFooter>
			</table>,
		);
		const tfoot = container.querySelector("[data-slot='table-footer']");
		expect(tfoot).toBeInTheDocument();
	});

	it("TableRow has data-slot", () => {
		const { container } = render(
			<table>
				<tbody>
					<TableRow>
						<td>Row</td>
					</TableRow>
				</tbody>
			</table>,
		);
		const tr = container.querySelector("[data-slot='table-row']");
		expect(tr).toBeInTheDocument();
	});

	it("TableHead has data-slot", () => {
		const { container } = render(
			<table>
				<thead>
					<tr>
						<TableHead>Head</TableHead>
					</tr>
				</thead>
			</table>,
		);
		const th = container.querySelector("[data-slot='table-head']");
		expect(th).toBeInTheDocument();
	});

	it("TableCell has data-slot", () => {
		const { container } = render(
			<table>
				<tbody>
					<tr>
						<TableCell>Cell</TableCell>
					</tr>
				</tbody>
			</table>,
		);
		const td = container.querySelector("[data-slot='table-cell']");
		expect(td).toBeInTheDocument();
	});

	it("TableCaption has data-slot", () => {
		const { container } = render(
			<table>
				<TableCaption>Caption</TableCaption>
			</table>,
		);
		const caption = container.querySelector("[data-slot='table-caption']");
		expect(caption).toBeInTheDocument();
	});

	it("merges custom className on Table sub-components", () => {
		const { container } = render(
			<table>
				<TableHeader className="custom-header">
					<tr>
						<TableHead className="custom-head">H</TableHead>
					</tr>
				</TableHeader>
				<TableBody className="custom-body">
					<TableRow className="custom-row">
						<TableCell className="custom-cell">C</TableCell>
					</TableRow>
				</TableBody>
			</table>,
		);
		expect(container.querySelector(".custom-header")).toBeInTheDocument();
		expect(container.querySelector(".custom-head")).toBeInTheDocument();
		expect(container.querySelector(".custom-body")).toBeInTheDocument();
		expect(container.querySelector(".custom-row")).toBeInTheDocument();
		expect(container.querySelector(".custom-cell")).toBeInTheDocument();
	});
});
