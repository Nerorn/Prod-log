import { createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentUserFn } from "#/lib/session";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const user = await getCurrentUserFn();
		throw redirect({ to: user ? "/products" : "/login" });
	},
});
