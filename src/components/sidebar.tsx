import { Link } from "@tanstack/react-router";
import { BoxIcon, PackageIcon, UsersIcon } from "lucide-react";

import { Button } from "#/components/ui/button";

export function Sidebar() {
	return (
		<aside className="hidden w-56 shrink-0 border-r bg-card md:flex md:flex-col">
			<div className="flex h-14 items-center gap-2 border-b px-4">
				<BoxIcon className="size-5 text-primary" />
				<span className="text-lg font-semibold tracking-tight">prodlog</span>
			</div>
			<nav className="flex flex-1 flex-col gap-1 p-3">
				<Button
					asChild
					variant="ghost"
					className="justify-start gap-2"
					size="sm"
				>
					<Link
						to="/products"
						activeProps={{ className: "bg-accent text-accent-foreground" }}
					>
						<PackageIcon className="size-4" />
						Produtos
					</Link>
				</Button>
				<Button
					asChild
					variant="ghost"
					className="justify-start gap-2"
					size="sm"
				>
					<Link
						to="/users"
						activeProps={{ className: "bg-accent text-accent-foreground" }}
					>
						<UsersIcon className="size-4" />
						Usuários
					</Link>
				</Button>
			</nav>
		</aside>
	);
}
