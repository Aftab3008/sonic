import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { StatusBadge } from "@/components/status-badge";
import type { Track, TrackArtist } from "@/types/admin.types";
import { useTable } from "@refinedev/react-table";
import { keepPreviousData } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

const columns: ColumnDef<Track>[] = [
  { id: "title", header: "Title", accessorKey: "title" },
  {
    id: "album",
    header: "Album",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.album?.title ?? "—"}</span>
    ),
    enableSorting: false,
  },
  {
    id: "artists",
    header: "Artists",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.artists
          ?.map((a: TrackArtist) => a.artist?.name)
          .filter(Boolean)
          .join(", ") || "—"}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: "durationMs",
    header: "Duration",
    accessorKey: "durationMs",
    cell: ({ getValue }) => {
      const ms = getValue() as number | null;
      if (!ms) return "—";
      return `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
    },
  },
  { id: "trackNumber", header: "#", accessorKey: "trackNumber" },
  {
    id: "isExplicit",
    header: "Explicit",
    accessorKey: "isExplicit",
    cell: ({ getValue }) =>
      getValue() ? (
        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500 border border-red-500/20">
          E
        </span>
      ) : null,
  },
  {
    id: "releaseStatus",
    header: "Status",
    accessorKey: "releaseStatus",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
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

export function TracksList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const table = useTable<Track>({
    columns,
    refineCoreProps: {
      resource: "tracks",
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
