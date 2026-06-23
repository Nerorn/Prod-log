import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProductForm } from "#/features/products/form";

describe("ProductForm", () => {
	it("renders all form fields", () => {
		render(<ProductForm onSubmit={vi.fn()} />);

		expect(screen.getByLabelText("SKU")).toBeInTheDocument();
		expect(screen.getByLabelText("Nome")).toBeInTheDocument();
		expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
		expect(screen.getByLabelText("Preço")).toBeInTheDocument();
		expect(screen.getByLabelText("Estoque")).toBeInTheDocument();
	});

	it("renders submit button with default label", () => {
		render(<ProductForm onSubmit={vi.fn()} />);
		expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
	});

	it("renders submit button with custom label", () => {
		render(<ProductForm onSubmit={vi.fn()} submitLabel="Criar" />);
		expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
	});

	it("renders cancel button when onCancel is provided", () => {
		const onCancel = vi.fn();
		render(<ProductForm onSubmit={vi.fn()} onCancel={onCancel} />);
		const cancelBtn = screen.getByRole("button", { name: "Cancelar" });
		expect(cancelBtn).toBeInTheDocument();
		fireEvent.click(cancelBtn);
		expect(onCancel).toHaveBeenCalled();
	});

	it("does not render cancel button without onCancel", () => {
		render(<ProductForm onSubmit={vi.fn()} />);
		expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();
	});

	it("populates default values", () => {
		render(
			<ProductForm
				onSubmit={vi.fn()}
				defaultValues={{
					sku: "TEST-001",
					name: "Test Product",
					description: "A description",
					priceCents: 1500,
					stock: 42,
				}}
			/>,
		);
		expect(screen.getByLabelText("SKU")).toHaveValue("TEST-001");
		expect(screen.getByLabelText("Nome")).toHaveValue("Test Product");
		expect(screen.getByLabelText("Descrição")).toHaveValue("A description");
		expect(screen.getByLabelText("Estoque")).toHaveValue(42);
	});

	it("handles form inputs changes and submission", async () => {
		const onSubmit = vi.fn();
		render(<ProductForm onSubmit={onSubmit} />);

		const skuInput = screen.getByLabelText("SKU");
		const nameInput = screen.getByLabelText("Nome");
		const descInput = screen.getByLabelText("Descrição");
		const priceInput = screen.getByLabelText("Preço");
		const stockInput = screen.getByLabelText("Estoque");

		fireEvent.change(skuInput, { target: { value: "NEW-SKU" } });
		fireEvent.change(nameInput, { target: { value: "New Product Name" } });
		fireEvent.change(descInput, { target: { value: "New Description" } });
		fireEvent.change(priceInput, { target: { value: "10,50" } });
		fireEvent.change(stockInput, { target: { value: "15" } });

		fireEvent.blur(skuInput);
		fireEvent.blur(nameInput);
		fireEvent.blur(priceInput);
		fireEvent.blur(stockInput);

		const submitBtn = screen.getByRole("button", { name: "Salvar" });
		fireEvent.click(submitBtn);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith({
				sku: "NEW-SKU",
				name: "New Product Name",
				description: "New Description",
				priceCents: 1050,
				stock: 15,
			});
		});
	});

	it("displays validation errors for invalid input", async () => {
		render(<ProductForm onSubmit={vi.fn()} />);

		const skuInput = screen.getByLabelText("SKU");
		const nameInput = screen.getByLabelText("Nome");
		const priceInput = screen.getByLabelText("Preço");
		const stockInput = screen.getByLabelText("Estoque");

		// Change value first to trigger change state, then clear it
		fireEvent.change(skuInput, { target: { value: "A" } });
		fireEvent.change(skuInput, { target: { value: "" } });

		fireEvent.change(nameInput, { target: { value: "A" } });
		fireEvent.change(nameInput, { target: { value: "" } });

		fireEvent.change(priceInput, { target: { value: "-5,00" } });
		fireEvent.change(stockInput, { target: { value: "-1" } });

		fireEvent.blur(skuInput);
		fireEvent.blur(nameInput);
		fireEvent.blur(priceInput);
		fireEvent.blur(stockInput);

		// Wait for the async validations to run and update state
		await waitFor(() => {
			expect(screen.getByText("SKU obrigatório")).toBeInTheDocument();
			expect(screen.getByText("Nome obrigatório")).toBeInTheDocument();
		});
	});
});
