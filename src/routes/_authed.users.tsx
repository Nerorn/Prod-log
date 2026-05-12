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
import { buildUserColumns, type UserRow } from "#/features/users/columns";
import { UserForm, type UserFormValues } from "#/features/users/form";
import { useTRPC } from "#/integrations/trpc/react";

export const Route = createFileRoute("/_authed/users")({
	component: UsersPage,
});

function UsersPage() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { user: currentUser } = Route.useRouteContext();
	const usersQuery = useQuery(trpc.users.list.queryOptions());

	const [dialogState, setDialogState] = useState<
		{ mode: "create" } | { mode: "edit"; user: UserRow } | null
	>(null);

	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: trpc.users.list.queryKey() });

	const createMutation = useMutation(
		trpc.users.create.mutationOptions({
			onSuccess: async () => {
				toast.success("Usuário criado");
				await invalidate();
				setDialogState(null);
			},
		}),
	);

	const updateMutation = useMutation(
		trpc.users.update.mutationOptions({
			onSuccess: async () => {
				toast.success("Usuário atualizado");
				await invalidate();
				setDialogState(null);
			},
		}),
	);

	const deleteMutation = useMutation(
		trpc.users.delete.mutationOptions({
			onSuccess: async () => {
				toast.success("Usuário excluído");
				await invalidate();
			},
		}),
	);

	const columns = buildUserColumns({
		onEdit: (user) => setDialogState({ mode: "edit", user }),
		onDelete: (user) => deleteMutation.mutate({ id: user.id }),
		currentUserId: currentUser.id,
	});

	async function handleSubmit(values: UserFormValues) {
		if (dialogState?.mode === "edit") {
			await updateMutation.mutateAsync({ ...values, id: dialogState.user.id });
		} else {
			await createMutation.mutateAsync(values);
		}
	}

	return (
		<section className="grid gap-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Usuários</h1>
					<p className="text-sm text-muted-foreground">
						Gerencie quem pode acessar o painel.
					</p>
				</div>
				<Button onClick={() => setDialogState({ mode: "create" })}>
					<PlusIcon className="size-4" /> Adicionar
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={usersQuery.data ?? []}
				emptyMessage={
					usersQuery.isLoading ? "Carregando…" : "Nenhum usuário cadastrado"
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
							{dialogState?.mode === "edit" ? "Editar usuário" : "Novo usuário"}
						</DialogTitle>
						<DialogDescription>
							Preencha os campos para{" "}
							{dialogState?.mode === "edit" ? "atualizar" : "adicionar"} um
							usuário.
						</DialogDescription>
					</DialogHeader>
					{dialogState ? (
						<UserForm
							mode={dialogState.mode}
							submitLabel={dialogState.mode === "edit" ? "Salvar" : "Criar"}
							defaultValues={
								dialogState.mode === "edit"
									? {
											email: dialogState.user.email,
											name: dialogState.user.name,
											role: dialogState.user.role as UserFormValues["role"],
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
