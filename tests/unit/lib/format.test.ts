import { describe, expect, it } from "vitest";

import { formatBRL, parseBRLInput } from "#/lib/format";

describe("formatBRL", () => {
	it("formats zero cents as R$ 0,00", () => {
		expect(formatBRL(0)).toBe("R$\u00A00,00");
	});

	it("formats 100 cents as R$ 1,00", () => {
		expect(formatBRL(100)).toBe("R$\u00A01,00");
	});

	it("formats 1050 cents as R$ 10,50", () => {
		expect(formatBRL(1050)).toBe("R$\u00A010,50");
	});

	it("formats large values correctly", () => {
		expect(formatBRL(1234567)).toBe("R$\u00A012.345,67");
	});

	it("formats negative values", () => {
		expect(formatBRL(-500)).toBe("-R$\u00A05,00");
	});
});

describe("parseBRLInput", () => {
	it("parses a clean numeric string", () => {
		expect(parseBRLInput("1234")).toBe(1234);
	});

	it("strips non-digit characters", () => {
		expect(parseBRLInput("R$ 12,34")).toBe(1234);
	});

	it("returns 0 for empty string", () => {
		expect(parseBRLInput("")).toBe(0);
	});

	it("returns 0 for non-numeric input", () => {
		expect(parseBRLInput("abc")).toBe(0);
	});

	it("handles input with spaces and dots", () => {
		expect(parseBRLInput("12.345,67")).toBe(1234567);
	});
});
