import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TopBar } from "#/components/top-bar";
import { logoutFn } from "#/lib/session";

// Mock router
const mockNavigate = vi.fn();
const mockInvalidate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({
		navigate: mockNavigate,
		invalidate: mockInvalidate,
	}),
}));

// Mock logout
vi.mock("#/lib/session", () => ({
	logoutFn: vi.fn(),
}));

// Mock theme toggle to simplify
vi.mock("#/components/theme-toggle", () => ({
	ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

// Mock toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("TopBar", () => {
	it("renders the user name", () => {
		render(<TopBar userName="John Doe" />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
	});

	it("calls logout, invalidates and navigates on success", async () => {
		vi.mocked(logoutFn).mockResolvedValueOnce(undefined);
		render(<TopBar userName="John Doe" />);

		const logoutButton = screen.getByRole("button", { name: /sair/i });
		fireEvent.click(logoutButton);

		expect(logoutFn).toHaveBeenCalled();
		await waitFor(() => expect(mockInvalidate).toHaveBeenCalled());
		expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
	});

	it("shows error toast if logout fails", async () => {
		vi.mocked(logoutFn).mockRejectedValueOnce(new Error("Failed"));
		render(<TopBar userName="John Doe" />);

		const logoutButton = screen.getByRole("button", { name: /sair/i });
		fireEvent.click(logoutButton);

		expect(logoutFn).toHaveBeenCalled();
		
		const { toast } = await import("sonner");
		await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Não foi possível encerrar a sessão"));
	});
});
