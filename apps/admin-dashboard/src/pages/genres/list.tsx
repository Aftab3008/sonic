import { useTable } from "@refinedev/react-table";
import { type ColumnDef } from "@tanstack/react-table";
import { useState, useCallback, useMemo } from "react";
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
          recordItemId={row.original.id}
        />
      </div>
    ),
  },
];

export function GenreList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const table = useTable<Genre>({
    columns,
    refineCoreProps: {
      resource: "genres",
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
