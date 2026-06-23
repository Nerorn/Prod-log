import { test, expect } from "@playwright/test";

test.describe("Users Management", () => {
	test.beforeEach(async ({ page }) => {
		// Log in as admin
		await page.goto("/login");
		// Wait for hydration
		await page.waitForTimeout(2000);

		await page.getByLabel("E-mail").fill("admin@example.com");
		await page.getByLabel("Senha").fill("admin123");
		await page.getByRole("button", { name: "Entrar" }).click();
		await expect(page).toHaveURL(/\/products/);

		// Navigate to Users page via sidebar
		await page.getByRole("link", { name: "Usuários" }).click();
		await expect(page).toHaveURL(/\/users/);
		await expect(page.locator("h1")).toHaveText("Usuários");
	});

	test("should create, edit, and delete a user", async ({ page }) => {
		// --- CREATE ---
		await page.getByRole("button", { name: "Adicionar" }).click();

		await page.getByLabel("E-mail").fill("e2e-user@example.com");
		await page.getByLabel("Nome").fill("E2E Test User");
		
		// Radix UI Select interaction: click trigger, then click option in portal
		await page.getByRole("combobox", { name: "Perfil" }).click();
		await page.getByRole("option", { name: "Admin" }).click();

		await page.getByLabel("Senha").fill("password123");

		await page.getByRole("button", { name: "Criar" }).click();

		// Verify created user exists in table
		const row = page.locator("tr", { hasText: "e2e-user@example.com" });
		await expect(row).toBeVisible();
		await expect(row).toContainText("E2E Test User");
		await expect(row).toContainText("Admin");

		// --- EDIT ---
		await row.getByRole("button", { name: "Editar" }).click();

		// Edit name and role
		await page.getByLabel("Nome").fill("E2E Test User Updated");
		await page.getByRole("combobox", { name: "Perfil" }).click();
		await page.getByRole("option", { name: "Usuário" }).click();

		await page.getByRole("button", { name: "Salvar" }).click();

		// Verify updated details in table
		const updatedRow = page.locator("tr", { hasText: "e2e-user@example.com" });
		await expect(updatedRow).toContainText("E2E Test User Updated");
		await expect(updatedRow).toContainText("Usuário");

		// --- DELETE ---
		await updatedRow.getByRole("button", { name: "Excluir" }).click();
		
		// In confirm dialog, click Excluir
		await page.getByRole("button", { name: "Excluir" }).click();

		// Verify user is removed
		await expect(page.locator("tr", { hasText: "e2e-user@example.com" })).not.toBeVisible();
	});
});
