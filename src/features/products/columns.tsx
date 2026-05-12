import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { ConfirmDelete } from "#/components/confirm-delete";
import { Button } from "#/components/ui/button";
import { formatBRL } from "#/lib/format";

export interface ProductRow {
	id: string;
	sku: string;
	name: string;
	description: string | null;
	priceCents: number;
	stock: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductColumnsOptions {
	onEdit: (product: ProductRow) => void;
	onDelete: (product: ProductRow) => void;
}

export function buildProductColumns({
	onEdit,
	onDelete,
}: ProductColumnsOptions): ColumnDef<ProductRow>[] {
	return [
		{ header: "SKU", accessorKey: "sku" },
		{ header: "Nome", accessorKey: "name" },
		{
			header: "Preço",
			accessorKey: "priceCents",
			cell: ({ row }) => formatBRL(row.original.priceCents),
		},
		{
			header: "Estoque",
			accessorKey: "stock",
			cell: ({ row }) => (
				<span
					className={
						row.original.stock === 0
							? "text-destructive font-medium"
							: undefined
					}
				>
					{row.original.stock}
				</span>
			),
		},
		{
			header: "Criado em",
			accessorKey: "createdAt",
			cell: ({ row }) =>
				new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
		},
		{
			id: "actions",
			header: () => <span className="sr-only">Ações</span>,
			cell: ({ row }) => (
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						size="icon"
						variant="ghost"
						onClick={() => onEdit(row.original)}
						aria-label="Editar"
					>
						<PencilIcon className="size-4" />
					</Button>
					<ConfirmDelete
						trigger={
							<Button
								type="button"
								size="icon"
								variant="ghost"
								aria-label="Excluir"
							>
								<Trash2Icon className="size-4 text-destructive" />
							</Button>
						}
						title={`Excluir ${row.original.name}?`}
						description="O produto será removido permanentemente."
						onConfirm={() => onDelete(row.original)}
					/>
				</div>
			),
		},
	];
}
