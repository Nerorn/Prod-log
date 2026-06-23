import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
	test("should display error message on invalid credentials", async ({ page }) => {
		await page.goto("/login");
		// Wait for hydration
		await page.waitForTimeout(2000);

		await page.getByLabel("E-mail").fill("wrong@example.com");
		await page.getByLabel("Senha").fill("wrongpass");
		await page.getByRole("button", { name: "Entrar" }).click();

		const errorMsg = page.locator("p.text-destructive");
		await expect(errorMsg).toBeVisible();
	});

	test("should successfully login with valid credentials and then logout", async ({ page }) => {
		await page.goto("/login");
		// Wait for hydration
		await page.waitForTimeout(2000);

		await page.getByLabel("E-mail").fill("admin@example.com");
		await page.getByLabel("Senha").fill("admin123");
		await page.getByRole("button", { name: "Entrar" }).click();

		// Verify redirect to products page
		await expect(page).toHaveURL(/\/products/);

		// Verify user top bar displays user name
		await expect(page.locator("header")).toContainText("Administrador");

		// Click logout button
		await page.getByRole("button", { name: "Sair" }).click();

		// Verify redirect back to login page
		await expect(page).toHaveURL(/\/login/);
	});
});
