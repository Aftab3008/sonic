import { useTable } from "@refinedev/react-table";
import { type ColumnDef } from "@tanstack/react-table";
import { useState, useCallback, useMemo } from "react";
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
        <AvatarImage src={row.original.imageUrl ?? undefined} alt={row.original.name} />
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
          recordItemId={row.original.id}
        />
      </div>
    ),
  },
];

export function ArtistList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const table = useTable<Artist>({
    columns,
    refineCoreProps: {
      resource: "artists",
      pagination: { mode: "server", pageSize: 10 },
      meta: { cursor, direction },
      queryOptions: {
        placeholderData: keepPreviousData,
      },
    },
  });

  const { tableQuery } = table.refineCore;
  const result = tableQuery.data as any;
  const hasNextPage = result?.hasNextPage ?? false;
  const hasPrevPage = result?.hasPrevPage ?? false;
  const nextCursor = result?.nextCursor ?? null;
  const prevCursor = result?.prevCursor ?? null;

  const goNextPage = useCallback(() => {
    if (nextCursor) {
      setCursor(nextCursor);
      setDirection("next");
    }
  }, [nextCursor]);

  const goPrevPage = useCallback(() => {
    if (prevCursor) {
      setCursor(prevCursor);
      setDirection("prev");
    }
  }, [prevCursor]);

  const goFirstPage = useCallback(() => {
    setCursor(undefined);
    setDirection("next");
  }, []);

  const paginationProps = useMemo(
    () => ({ hasNextPage, hasPrevPage, goNextPage, goPrevPage, goFirstPage }),
    [hasNextPage, hasPrevPage, goNextPage, goPrevPage, goFirstPage],
  );

  return (
    <ListView>
      <ListViewHeader canCreate />
      <DataTable table={table} cursorPagination={paginationProps} />
    </ListView>
  );
}
