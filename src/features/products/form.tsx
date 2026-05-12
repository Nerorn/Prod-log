import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { formatBRL, parseBRLInput } from "#/lib/format";

const schema = z.object({
	sku: z.string().trim().min(1, "SKU obrigatório").max(64),
	name: z.string().trim().min(1, "Nome obrigatório").max(120),
	description: z.string().trim().max(500).optional(),
	priceCents: z.number().int().min(0, "Preço inválido"),
	stock: z.number().int().min(0, "Estoque inválido"),
});

export type ProductFormValues = z.infer<typeof schema>;

export interface ProductFormProps {
	defaultValues?: Partial<ProductFormValues>;
	submitLabel?: string;
	onSubmit: (values: ProductFormValues) => Promise<void> | void;
	onCancel?: () => void;
	isSubmitting?: boolean;
}

export function ProductForm({
	defaultValues,
	submitLabel = "Salvar",
	onSubmit,
	onCancel,
	isSubmitting,
}: ProductFormProps) {
	const form = useForm({
		defaultValues: {
			sku: defaultValues?.sku ?? "",
			name: defaultValues?.name ?? "",
			description: defaultValues?.description ?? "",
			priceCents: defaultValues?.priceCents ?? 0,
			stock: defaultValues?.stock ?? 0,
		} as ProductFormValues,
		onSubmit: async ({ value }) => {
			await onSubmit(schema.parse(value));
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
				name="sku"
				validators={{ onChange: schema.shape.sku }}
				children={(field) => (
					<div className="grid gap-1.5">
						<Label htmlFor={field.name}>SKU</Label>
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="ABC-123"
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
				name="description"
				children={(field) => (
					<div className="grid gap-1.5">
						<Label htmlFor={field.name}>Descrição</Label>
						<Textarea
							id={field.name}
							name={field.name}
							rows={3}
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					</div>
				)}
			/>

			<div className="grid grid-cols-2 gap-4">
				<form.Field
					name="priceCents"
					validators={{ onChange: schema.shape.priceCents }}
					children={(field) => (
						<div className="grid gap-1.5">
							<Label htmlFor={field.name}>Preço</Label>
							<Input
								id={field.name}
								name={field.name}
								inputMode="numeric"
								value={formatBRL(field.state.value)}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(parseBRLInput(e.target.value))
								}
							/>
							<FieldError errors={field.state.meta.errors} />
						</div>
					)}
				/>
				<form.Field
					name="stock"
					validators={{ onChange: schema.shape.stock }}
					children={(field) => (
						<div className="grid gap-1.5">
							<Label htmlFor={field.name}>Estoque</Label>
							<Input
								id={field.name}
								name={field.name}
								type="number"
								min={0}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(Number.parseInt(e.target.value || "0", 10))
								}
							/>
							<FieldError errors={field.state.meta.errors} />
						</div>
					)}
				/>
			</div>

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
