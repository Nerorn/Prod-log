import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";

const baseSchema = z.object({
	email: z.string().email("E-mail inválido").max(120),
	name: z.string().trim().min(1, "Nome obrigatório").max(120),
	role: z.enum(["admin", "user"]),
});

const createSchema = baseSchema.extend({
	password: z.string().min(6, "Senha mínima de 6 caracteres"),
});

const editSchema = baseSchema.extend({
	password: z.string().min(6).optional().or(z.literal("")),
});

export type UserFormValues = z.infer<typeof createSchema>;

export interface UserFormProps {
	defaultValues?: Partial<UserFormValues>;
	mode: "create" | "edit";
	submitLabel?: string;
	onSubmit: (values: UserFormValues) => Promise<void> | void;
	onCancel?: () => void;
	isSubmitting?: boolean;
}

export function UserForm({
	defaultValues,
	mode,
	submitLabel = "Salvar",
	onSubmit,
	onCancel,
	isSubmitting,
}: UserFormProps) {
	const schema = mode === "create" ? createSchema : editSchema;
	const form = useForm({
		defaultValues: {
			email: defaultValues?.email ?? "",
			name: defaultValues?.name ?? "",
			role: defaultValues?.role ?? "user",
			password: "",
		} as UserFormValues,
		onSubmit: async ({ value }) => {
			const parsed = schema.parse(value) as UserFormValues;
			await onSubmit(parsed);
		},
	});

	return (
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
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			/>

			<form.Field
				name="name"
				validators={{ onChange: schema.shape.name }}
				children={(field) => (
					<div className="grid gap-1.5">
						<Label htmlFor={field.name}>Nome</Label>
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			/>

			<form.Field
				name="role"
				children={(field) => (
					<div className="grid gap-1.5">
						<Label htmlFor={field.name}>Perfil</Label>
						<Select
							value={field.state.value}
							onValueChange={(v) =>
								field.handleChange(v as UserFormValues["role"])
							}
						>
							<SelectTrigger id={field.name}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user">Usuário</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			/>

			<form.Field
				name="password"
				validators={{
					onChange: mode === "create" ? createSchema.shape.password : undefined,
				}}
				children={(field) => (
					<div className="grid gap-1.5">
						<Label htmlFor={field.name}>
							{mode === "create"
								? "Senha"
								: "Nova senha (deixe em branco para manter)"}
						</Label>
						<Input
							id={field.name}
							name={field.name}
							type="password"
							autoComplete="new-password"
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						<FieldError errors={field.state.meta.errors} />
					</div>
				)}
			/>

			<div className="flex items-center justify-end gap-2">
				{onCancel ? (
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancelar
					</Button>
				) : null}
				<form.Subscribe
					selector={(s) => [s.canSubmit, s.isSubmitting] as const}
					children={([canSubmit, submitting]) => (
						<Button
							type="submit"
							disabled={!canSubmit || submitting || isSubmitting}
						>
							{submitLabel}
						</Button>
					)}
				/>
			</div>
		</form>
	);
}

function FieldError({ errors }: { errors: unknown[] }) {
	if (!errors.length) return null;
	const msg = errors
		.map((e) => {
			if (!e) return null;
			if (typeof e === "string") return e;
			if (typeof e === "object" && e !== null && "message" in e)
				return String((e as { message: unknown }).message);
			return String(e);
		})
		.filter(Boolean)
		.join(", ");
	if (!msg) return null;
	return <p className="text-xs text-destructive">{msg}</p>;
}
