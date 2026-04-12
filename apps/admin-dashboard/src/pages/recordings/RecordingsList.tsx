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
import type { Recording } from "@/types/admin.types";

function formatDuration(ms?: number): string {
  if (!ms) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const columns: ColumnDef<Recording>[] = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.title}</div>
    ),
  },
  {
    id: "audioProcessStatus",
    header: "Status",
    accessorKey: "audioProcessStatus",
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() as string} />
    ),
  },
  {
    id: "durationMs",
    header: "Duration",
    accessorKey: "durationMs",
    cell: ({ getValue }) => formatDuration(getValue() as number | undefined),
  },
  {
    id: "isrc",
    header: "ISRC",
    accessorKey: "isrc",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {(getValue() as string) || "—"}
      </span>
    ),
  },
  {
    id: "artists",
    header: "Artists",
    accessorKey: "artists",
    cell: ({ row }) => {
      const artists = row.original.artists;
      if (!artists?.length) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-sm">
          {artists.map((a) => a.artist?.name).filter(Boolean).join(", ")}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "createdAt",
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString(),
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

export function RecordingsList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const table = useTable<Recording>({
    columns,
    refineCoreProps: {
      resource: "recordings",
      pagination: { mode: "server", pageSize: 10 },
      meta: { cursor, direction },
      queryOptions: {
        placeholderData: keepPreviousData,
      },
    },
  });

  const { tableQuery } = table.refineCore;
  const result = tableQuery.data;
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
