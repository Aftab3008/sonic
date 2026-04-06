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
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import type { Album, AlbumArtist } from "@/types/admin.types";

const columns: ColumnDef<Album>[] = [
  {
    id: "coverImageUrl",
    header: "",
    accessorKey: "coverImageUrl",
    cell: ({ getValue }) => (
      <div className="h-10 w-10 rounded bg-muted overflow-hidden">
        {getValue() ? (
          <img
            src={getValue() as string}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
            —
          </div>
        )}
      </div>
    ),
    enableSorting: false,
  },
  { id: "title", header: "Title", accessorKey: "title" },
  {
    id: "albumType",
    header: "Type",
    accessorKey: "albumType",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    id: "releaseStatus",
    header: "Status",
    accessorKey: "releaseStatus",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    id: "artists",
    header: "Artists",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.artists
          ?.map((a: AlbumArtist) => a.artist?.name)
          .filter(Boolean)
          .join(", ") || "—"}
      </span>
    ),
    enableSorting: false,
  },
  { id: "releaseDate", header: "Release Date", accessorKey: "releaseDate" },
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

export function AlbumList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const table = useTable<Album>({
    columns,
    refineCoreProps: {
      resource: "albums",
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
