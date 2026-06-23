import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserForm } from "#/features/users/form";

// Mock the Select component to make role switching testable in jsdom
vi.mock("#/components/ui/select", () => ({
	Select: ({ value, onValueChange }: any) => (
		<select
			data-testid="mock-select"
			id="role"
			value={value}
			onChange={(e) => onValueChange?.(e.target.value)}
		>
			<option value="user">Usuário</option>
			<option value="admin">Admin</option>
		</select>
	),
	SelectTrigger: () => null,
	SelectContent: () => null,
	SelectItem: () => null,
	SelectValue: () => null,
}));

describe("UserForm", () => {
	it("renders all form fields in create mode", () => {
		render(<UserForm mode="create" onSubmit={vi.fn()} />);

		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
		expect(screen.getByLabelText("Nome")).toBeInTheDocument();
		expect(screen.getByLabelText("Perfil")).toBeInTheDocument();
		expect(screen.getByLabelText("Senha")).toBeInTheDocument();
	});

	it("renders password label differently in edit mode", () => {
		render(<UserForm mode="edit" onSubmit={vi.fn()} />);

		expect(
			screen.getByLabelText("Nova senha (deixe em branco para manter)"),
		).toBeInTheDocument();
	});

	it("renders submit button with default label", () => {
		render(<UserForm mode="create" onSubmit={vi.fn()} />);
		expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
	});

	it("renders submit button with custom label", () => {
		render(<UserForm mode="create" onSubmit={vi.fn()} submitLabel="Criar" />);
		expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
	});

	it("renders cancel button when onCancel is provided", () => {
		const onCancel = vi.fn();
		render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={onCancel} />);
		const cancelBtn = screen.getByRole("button", { name: "Cancelar" });
		expect(cancelBtn).toBeInTheDocument();
		fireEvent.click(cancelBtn);
		expect(onCancel).toHaveBeenCalled();
	});

	it("does not render cancel button without onCancel", () => {
		render(<UserForm mode="create" onSubmit={vi.fn()} />);
		expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();
	});

	it("populates default values", () => {
		render(
			<UserForm
				mode="edit"
				onSubmit={vi.fn()}
				defaultValues={{
					email: "test@example.com",
					name: "Test User",
					role: "admin",
				}}
			/>,
		);
		expect(screen.getByLabelText("E-mail")).toHaveValue("test@example.com");
		expect(screen.getByLabelText("Nome")).toHaveValue("Test User");
		expect(screen.getByTestId("mock-select")).toHaveValue("admin");
	});

	it("handles form inputs changes and submission in create mode", async () => {
		const onSubmit = vi.fn();
		render(<UserForm mode="create" onSubmit={onSubmit} />);

		const emailInput = screen.getByLabelText("E-mail");
		const nameInput = screen.getByLabelText("Nome");
		const roleSelect = screen.getByTestId("mock-select");
		const passInput = screen.getByLabelText("Senha");

		fireEvent.change(emailInput, { target: { value: "john@example.com" } });
		fireEvent.change(nameInput, { target: { value: "John Doe" } });
		fireEvent.change(roleSelect, { target: { value: "admin" } });
		fireEvent.change(passInput, { target: { value: "secure123" } });

		fireEvent.blur(emailInput);
		fireEvent.blur(nameInput);
		fireEvent.blur(passInput);

		const submitBtn = screen.getByRole("button", { name: "Salvar" });
		fireEvent.click(submitBtn);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith({
				email: "john@example.com",
				name: "John Doe",
				role: "admin",
				password: "secure123",
			});
		});
	});

	it("displays validation errors for invalid input", async () => {
		render(<UserForm mode="create" onSubmit={vi.fn()} />);

		const emailInput = screen.getByLabelText("E-mail");
		const nameInput = screen.getByLabelText("Nome");
		const passInput = screen.getByLabelText("Senha");

		fireEvent.change(emailInput, { target: { value: "invalid-email" } });
		// Change value first to trigger change state, then clear it
		fireEvent.change(nameInput, { target: { value: "A" } });
		fireEvent.change(nameInput, { target: { value: "" } });
		fireEvent.change(passInput, { target: { value: "123" } });

		fireEvent.blur(emailInput);
		fireEvent.blur(nameInput);
		fireEvent.blur(passInput);

		await waitFor(() => {
			expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
			expect(screen.getByText("Nome obrigatório")).toBeInTheDocument();
			expect(screen.getByText("Senha mínima de 6 caracteres")).toBeInTheDocument();
		});
	});
});
