import { defineConfig } from "vitest/config";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	resolve: {
		alias: {
			"#": "/src",
		},
	},
	plugins: [tailwindcss(), viteReact()],
	test: {
		globals: true,
		environment: "jsdom",
		testTimeout: 15000,
		setupFiles: ["./tests/setupTests.ts"],
		include: ["tests/unit/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.gen.ts",
				"src/generated/**/*",
				"src/main.tsx",
				"src/routeTree.gen.ts",
				"src/db.ts",
				"src/env.ts",
				"src/router.tsx",
				"src/lib/session.ts",
				"src/routes/**/*",
				"src/integrations/trpc/init.ts",
				"src/integrations/trpc/router.ts",
				"src/integrations/trpc/react.ts",
				"src/integrations/tanstack-query/**/*",
			],
		},
	},
});
