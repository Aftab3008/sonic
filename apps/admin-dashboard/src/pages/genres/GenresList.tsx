import { useCursorTable } from "@/hooks/use-cursor-table";
import { type ColumnDef } from "@tanstack/react-table";
import { keepPreviousData } from "@tanstack/react-query";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import type { Genre } from "@/types/admin.types";

const columns: ColumnDef<Genre>[] = [
  {
    id: "color",
    header: "",
    accessorKey: "primaryColor",
    cell: ({ row }) => (
      <div className="flex gap-1">
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.primaryColor || "#888" }}
        />
      </div>
    ),
    enableSorting: false,
  },
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "slug", header: "Slug", accessorKey: "slug" },
  { id: "icon", header: "Icon", accessorKey: "icon" },
  {
    id: "actions",
    header: "Actions",
    size: 120,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <EditButton
          size="icon"
          variant="ghost"
          recordItemId={row.original.id}
        />
        <DeleteButton
          size="icon"
          variant="ghost"
          className="text-red-600 hover:text-red-400"
          recordItemId={row.original.id}
        />
      </div>
    ),
  },
];

export function GenresList() {
  const table = useCursorTable<Genre>({
    columns,
    refineCoreProps: {
      resource: "genres",
      pagination: { mode: "server", pageSize: 10 },
      queryOptions: {
        placeholderData: keepPreviousData,
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader canCreate />
      <DataTable table={table} cursorPagination={table.cursorPagination} />
    </ListView>
  );
}
