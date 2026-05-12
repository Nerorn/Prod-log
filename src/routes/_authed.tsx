import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Sidebar } from "#/components/sidebar";
import { TopBar } from "#/components/top-bar";
import { getCurrentUserFn } from "#/lib/session";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async () => {
		const user = await getCurrentUserFn();
		if (!user) throw redirect({ to: "/login" });
		return { user };
	},
	component: AuthedLayout,
});

function AuthedLayout() {
	const { user } = Route.useRouteContext();
	return (
		<div className="flex min-h-svh bg-background">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<TopBar userName={user.name} />
				<main className="flex-1 px-4 py-6 md:px-6">
					<div className="mx-auto max-w-6xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
