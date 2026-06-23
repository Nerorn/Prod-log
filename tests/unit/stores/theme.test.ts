import { describe, expect, it, vi, beforeEach } from "vitest";

// We need to mock window and localStorage before importing the module
const mockGetItem = vi.fn();
const mockSetItem = vi.fn();
const mockMatchMedia = vi.fn();

Object.defineProperty(globalThis, "localStorage", {
	value: { getItem: mockGetItem, setItem: mockSetItem },
	writable: true,
});

Object.defineProperty(globalThis, "matchMedia", {
	value: mockMatchMedia,
	writable: true,
});

describe("theme store", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
		mockGetItem.mockReset();
		mockSetItem.mockReset();
		mockMatchMedia.mockReset();
	});

	it("readInitial returns stored 'dark' theme", async () => {
		mockGetItem.mockReturnValue("dark");
		const { themeStore } = await import("#/stores/theme");
		expect(themeStore.state).toBe("dark");
	});

	it("readInitial returns stored 'light' theme", async () => {
		mockGetItem.mockReturnValue("light");
		const { themeStore } = await import("#/stores/theme");
		expect(themeStore.state).toBe("light");
	});

	it("readInitial falls back to matchMedia when nothing stored", async () => {
		mockGetItem.mockReturnValue(null);
		mockMatchMedia.mockReturnValue({ matches: true });
		const { themeStore } = await import("#/stores/theme");
		expect(themeStore.state).toBe("dark");
	});

	it("readInitial falls back to light when matchMedia returns false", async () => {
		mockGetItem.mockReturnValue(null);
		mockMatchMedia.mockReturnValue({ matches: false });
		const { themeStore } = await import("#/stores/theme");
		expect(themeStore.state).toBe("light");
	});

	it("toggleTheme switches from light to dark", async () => {
		mockGetItem.mockReturnValue("light");
		const { themeStore, toggleTheme } = await import("#/stores/theme");
		expect(themeStore.state).toBe("light");
		toggleTheme();
		expect(themeStore.state).toBe("dark");
	});

	it("setTheme sets a specific theme", async () => {
		mockGetItem.mockReturnValue("light");
		const { themeStore, setTheme } = await import("#/stores/theme");
		setTheme("dark");
		expect(themeStore.state).toBe("dark");
		setTheme("light");
		expect(themeStore.state).toBe("light");
	});
});
