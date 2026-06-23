import { describe, expect, it } from "vitest";

import { cn } from "#/lib/utils";

describe("cn", () => {
	it("merges class names", () => {
		const result = cn("foo", "bar");
		expect(result).toBe("foo bar");
	});

	it("handles conditional classes", () => {
		const result = cn("base", false && "hidden", "visible");
		expect(result).toBe("base visible");
	});

	it("handles undefined values", () => {
		const result = cn("base", undefined, null, "end");
		expect(result).toBe("base end");
	});

	it("merges tailwind conflicts", () => {
		// tailwind-merge should keep the last conflicting class
		const result = cn("px-4", "px-6");
		expect(result).toBe("px-6");
	});

	it("returns empty string for no input", () => {
		expect(cn()).toBe("");
	});
});
