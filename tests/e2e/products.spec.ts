import { test, expect } from "@playwright/test";

test.describe("Products Management", () => {
	test.beforeEach(async ({ page }) => {
		// Log in as admin
		await page.goto("/login");
		// Wait for hydration
		await page.waitForTimeout(2000);

		await page.getByLabel("E-mail").fill("admin@example.com");
		await page.getByLabel("Senha").fill("admin123");
		await page.getByRole("button", { name: "Entrar" }).click();
		await expect(page).toHaveURL(/\/products/);
	});

	test("should create, edit, and delete a product", async ({ page }) => {
		// --- CREATE ---
		await page.getByRole("button", { name: "Adicionar" }).click();

		await page.getByLabel("SKU").fill("E2E-999");
		await page.getByLabel("Nome").fill("Product E2E Test");
		await page.getByLabel("Descrição").fill("This is a product created by E2E test");
		await page.getByLabel("Preço").fill("150,50");
		await page.getByLabel("Estoque").fill("10");

		await page.getByRole("button", { name: "Criar" }).click();

		// Verify created product exists in table
		const row = page.locator("tr", { hasText: "E2E-999" });
		await expect(row).toBeVisible();
		await expect(row).toContainText("Product E2E Test");
		await expect(row).toContainText("R$ 150,50");
		await expect(row).toContainText("10");

		// --- EDIT ---
		await row.getByRole("button", { name: "Editar" }).click();

		// Edit name and stock
		await page.getByLabel("Nome").fill("Product E2E Test Updated");
		await page.getByLabel("Estoque").fill("20");

		await page.getByRole("button", { name: "Salvar" }).click();

		// Verify updated details in table
		await expect(page.locator("tr", { hasText: "E2E-999" })).toContainText("Product E2E Test Updated");
		await expect(page.locator("tr", { hasText: "E2E-999" })).toContainText("20");

		// --- DELETE ---
		await page.locator("tr", { hasText: "E2E-999" }).getByRole("button", { name: "Excluir" }).click();
		
		// In confirm dialog, click Excluir
		await page.getByRole("button", { name: "Excluir" }).click();

		// Verify product is removed
		await expect(page.locator("tr", { hasText: "E2E-999" })).not.toBeVisible();
	});
});
