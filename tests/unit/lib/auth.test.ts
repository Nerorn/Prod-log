import { describe, expect, it } from "vitest";

import {
	SESSION_COOKIE,
	SESSION_DURATION_MS,
	generateSessionToken,
	hashPassword,
	verifyPassword,
} from "#/lib/auth";

describe("auth constants", () => {
	it("SESSION_COOKIE has the correct value", () => {
		expect(SESSION_COOKIE).toBe("prod_log_session");
	});

	it("SESSION_DURATION_MS is 30 days", () => {
		expect(SESSION_DURATION_MS).toBe(1000 * 60 * 60 * 24 * 30);
	});
});

describe("hashPassword / verifyPassword", () => {
	it("hashes and verifies a password", async () => {
		const plain = "mySecretPassword123";
		const hashed = await hashPassword(plain);

		expect(hashed).not.toBe(plain);
		expect(typeof hashed).toBe("string");
		expect(hashed.length).toBeGreaterThan(0);

		const isValid = await verifyPassword(plain, hashed);
		expect(isValid).toBe(true);
	});

	it("rejects wrong password", async () => {
		const hashed = await hashPassword("correct");
		const isValid = await verifyPassword("wrong", hashed);
		expect(isValid).toBe(false);
	});
});

describe("generateSessionToken", () => {
	it("generates a 64-char hex string", () => {
		const token = generateSessionToken();
		expect(token).toHaveLength(64);
		expect(/^[0-9a-f]{64}$/.test(token)).toBe(true);
	});

	it("generates unique tokens", () => {
		const token1 = generateSessionToken();
		const token2 = generateSessionToken();
		expect(token1).not.toBe(token2);
	});
});
