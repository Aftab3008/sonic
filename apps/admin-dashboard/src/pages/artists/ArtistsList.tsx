import { useCursorTable } from "@/hooks/use-cursor-table";
import { type ColumnDef } from "@tanstack/react-table";
import { keepPreviousData } from "@tanstack/react-query";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import type { Artist } from "@/types/admin.types";

const columns: ColumnDef<Artist>[] = [
  {
    id: "image",
    header: "",
    accessorKey: "imageUrl",
    cell: ({ row }) => (
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={row.original.imageUrl ?? undefined}
          alt={row.original.name}
        />
        <AvatarFallback>{row.original.name?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "slug", header: "Slug", accessorKey: "slug" },
  {
    id: "isVerified",
    header: "Verified",
    accessorKey: "isVerified",
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() ? "verified" : "unverified"} />
    ),
  },
  {
    id: "monthlyListeners",
    header: "Listeners",
    accessorKey: "monthlyListeners",
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    size: 120,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ShowButton
          size="icon"
          variant="ghost"
          recordItemId={row.original.id}
        />
        <EditButton
          size="icon"
          variant="ghost"
          recordItemId={row.original.id}
        />
        <DeleteButton
          size="icon"
          variant="ghost"
          className="text-red-500"
          recordItemId={row.original.id}
        />
      </div>
    ),
  },
];

export function ArtistsList() {
  const table = useCursorTable<Artist>({
    columns,
    refineCoreProps: {
      resource: "artists",
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
