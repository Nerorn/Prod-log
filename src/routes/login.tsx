import { useForm } from "@tanstack/react-form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { getCurrentUserFn, loginFn } from "#/lib/session";

const schema = z.object({
	email: z.string().email("E-mail inválido"),
	password: z.string().min(1, "Senha obrigatória"),
});

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const user = await getCurrentUserFn();
		if (user) throw redirect({ to: "/products" });
	},
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			setSubmitError(null);
			try {
				const parsed = schema.parse(value);
				await loginFn({ data: parsed });
				toast.success("Bem-vindo!");
				await router.invalidate();
				router.navigate({ to: "/products" });
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Falha ao entrar";
				setSubmitError(msg);
			}
		},
	});

	return (
		<div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Entrar no prod-log</CardTitle>
					<CardDescription>
						Use suas credenciais para acessar o painel.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit();
						}}
						className="grid gap-4"
					>
						<form.Field
							name="email"
							validators={{ onChange: schema.shape.email }}
							children={(field) => (
								<div className="grid gap-1.5">
									<Label htmlFor={field.name}>E-mail</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										autoComplete="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</div>
							)}
						/>
						<form.Field
							name="password"
							validators={{ onChange: schema.shape.password }}
							children={(field) => (
								<div className="grid gap-1.5">
									<Label htmlFor={field.name}>Senha</Label>
									<Input
										id={field.name}
										name={field.name}
										type="password"
										autoComplete="current-password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</div>
							)}
						/>
						{submitError ? (
							<p className="text-sm text-destructive">{submitError}</p>
						) : null}
						<form.Subscribe
							selector={(s) => [s.canSubmit, s.isSubmitting] as const}
							children={([canSubmit, submitting]) => (
								<Button type="submit" disabled={!canSubmit || submitting}>
									{submitting ? "Entrando…" : "Entrar"}
								</Button>
							)}
						/>
						<p className="text-xs text-muted-foreground text-center">
							Tente <code>admin@example.com</code> / <code>admin123</code>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
