import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "#/components/data-table";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import {
	buildProductColumns,
	type ProductRow,
} from "#/features/products/columns";
import { ProductForm, type ProductFormValues } from "#/features/products/form";
import { useTRPC } from "#/integrations/trpc/react";

export const Route = createFileRoute("/_authed/products")({
	component: ProductsPage,
});

function ProductsPage() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const productsQuery = useQuery(trpc.products.list.queryOptions());

	const [dialogState, setDialogState] = useState<
		{ mode: "create" } | { mode: "edit"; product: ProductRow } | null
	>(null);

	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: trpc.products.list.queryKey() });

	const createMutation = useMutation(
		trpc.products.create.mutationOptions({
			onSuccess: async () => {
				toast.success("Produto criado");
				await invalidate();
				setDialogState(null);
			},
		}),
	);

	const updateMutation = useMutation(
		trpc.products.update.mutationOptions({
			onSuccess: async () => {
				toast.success("Produto atualizado");
				await invalidate();
				setDialogState(null);
			},
		}),
	);

	const deleteMutation = useMutation(
		trpc.products.delete.mutationOptions({
			onSuccess: async () => {
				toast.success("Produto excluído");
				await invalidate();
			},
		}),
	);

	const columns = buildProductColumns({
		onEdit: (product) => setDialogState({ mode: "edit", product }),
		onDelete: (product) => deleteMutation.mutate({ id: product.id }),
	});

	async function handleSubmit(values: ProductFormValues) {
		if (dialogState?.mode === "edit") {
			await updateMutation.mutateAsync({
				...values,
				id: dialogState.product.id,
			});
		} else {
			await createMutation.mutateAsync(values);
		}
	}

	return (
		<section className="grid gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Produtos</h1>
					<p className="text-sm text-muted-foreground">
						Gerencie o catálogo de produtos.
					</p>
				</div>
				<Button onClick={() => setDialogState({ mode: "create" })}>
					<PlusIcon className="size-4" /> Adicionar
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={productsQuery.data ?? []}
				emptyMessage={
					productsQuery.isLoading ? "Carregando…" : "Nenhum produto cadastrado"
				}
			/>

			<Dialog
				open={dialogState !== null}
				onOpenChange={(open) => {
					if (!open) setDialogState(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{dialogState?.mode === "edit" ? "Editar produto" : "Novo produto"}
						</DialogTitle>
						<DialogDescription>
							Preencha os campos para{" "}
							{dialogState?.mode === "edit" ? "atualizar" : "adicionar"} um
							produto.
						</DialogDescription>
					</DialogHeader>
					{dialogState ? (
						<ProductForm
							submitLabel={dialogState.mode === "edit" ? "Salvar" : "Criar"}
							defaultValues={
								dialogState.mode === "edit"
									? {
											sku: dialogState.product.sku,
											name: dialogState.product.name,
											description: dialogState.product.description ?? "",
											priceCents: dialogState.product.priceCents,
											stock: dialogState.product.stock,
										}
									: undefined
							}
							isSubmitting={
								createMutation.isPending || updateMutation.isPending
							}
							onSubmit={handleSubmit}
							onCancel={() => setDialogState(null)}
						/>
					) : null}
				</DialogContent>
			</Dialog>
		</section>
	);
}
