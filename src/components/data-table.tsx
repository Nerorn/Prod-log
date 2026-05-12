import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_PAGE_SIZE = 20;

interface DataTableProps<TData> {
	columns: ColumnDef<TData, unknown>[];
	data: TData[];
	emptyMessage?: string;
	defaultPageSize?: number;
}

export function DataTable<TData>({
	columns,
	data,
	emptyMessage = "Sem registros",
	defaultPageSize = DEFAULT_PAGE_SIZE,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageIndex: 0, pageSize: defaultPageSize },
		},
	});

	const { pageIndex, pageSize } = table.getState().pagination;
	const totalRows = table.getRowCount();
	const pageCount = table.getPageCount() || 1;
	const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
	const lastRow = Math.min(totalRows, (pageIndex + 1) * pageSize);

	return (
		<div className="grid gap-3">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((group) => (
							<TableRow key={group.id}>
								{group.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3 text-sm">
				<div className="flex items-center gap-2 text-muted-foreground">
					<span>Linhas por página</span>
					<Select
						value={String(pageSize)}
						onValueChange={(v) => table.setPageSize(Number(v))}
					>
						<SelectTrigger size="sm" className="h-8 w-[80px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZE_OPTIONS.map((opt) => (
								<SelectItem key={opt} value={String(opt)}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-3 text-muted-foreground">
					<span>
						{firstRow}–{lastRow} de {totalRows}
					</span>
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="size-8"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							aria-label="Página anterior"
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<span className="px-2 tabular-nums">
							{pageIndex + 1} / {pageCount}
						</span>
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="size-8"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							aria-label="Próxima página"
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
