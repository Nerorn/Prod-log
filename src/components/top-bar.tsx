import { useRouter } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "#/components/theme-toggle";
import { Button } from "#/components/ui/button";
import { logoutFn } from "#/lib/session";

export function TopBar({ userName }: { userName: string }) {
	const router = useRouter();

	async function handleLogout() {
		try {
			await logoutFn();
			toast.success("Sessão encerrada");
			await router.invalidate();
			router.navigate({ to: "/login" });
		} catch {
			toast.error("Não foi possível encerrar a sessão");
		}
	}

	return (
		<header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<span className="hidden text-sm text-muted-foreground sm:inline">
				{userName}
			</span>
			<ThemeToggle />
			<Button type="button" variant="outline" size="sm" onClick={handleLogout}>
				<LogOutIcon className="size-4" />
				Sair
			</Button>
		</header>
	);
}
