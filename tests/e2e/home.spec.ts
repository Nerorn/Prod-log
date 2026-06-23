import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("/");

	// Verify that the page loads correctly (replace with actual title or element)
	// Example: await expect(page).toHaveTitle(/Prod Log/i);
	// We check if the body exists
	const body = page.locator("body");
	await expect(body).toBeVisible();
});
