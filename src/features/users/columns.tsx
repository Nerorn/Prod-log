import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { ConfirmDelete } from "#/components/confirm-delete";
import { Button } from "#/components/ui/button";

export interface UserRow {
	id: string;
	email: string;
	name: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserColumnsOptions {
	onEdit: (user: UserRow) => void;
	onDelete: (user: UserRow) => void;
	currentUserId?: string;
}

export function buildUserColumns({
	onEdit,
	onDelete,
	currentUserId,
}: UserColumnsOptions): ColumnDef<UserRow>[] {
	return [
		{ header: "E-mail", accessorKey: "email" },
		{ header: "Nome", accessorKey: "name" },
		{
			header: "Perfil",
			accessorKey: "role",
			cell: ({ row }) => (row.original.role === "admin" ? "Admin" : "Usuário"),
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
			cell: ({ row }) => {
				const isSelf = row.original.id === currentUserId;
				return (
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
									disabled={isSelf}
									aria-label="Excluir"
								>
									<Trash2Icon className="size-4 text-destructive" />
								</Button>
							}
							title={`Excluir ${row.original.name}?`}
							description="O usuário será removido permanentemente."
							onConfirm={() => onDelete(row.original)}
						/>
					</div>
				);
			},
		},
	];
}
