import { useTable, type UseTableReturnType, type UseTableProps } from "@refinedev/react-table";
import { useState, useCallback, useMemo } from "react";
import type { BaseRecord, HttpError } from "@refinedev/core";
import type { CursorPaginationResponse } from "@/providers/dataProvider";
import type { CursorPaginationActions } from "@/components/refine-ui/data-table/data-table-pagination";

/**
 * Return type for useCursorTable hook.
 * It extends the standard Refine useTable return type by:
 * 1. Adding the cursorPagination actions.
 * 2. Narrowing the tableQuery data type to include cursor metadata.
 */
export type UseCursorTableReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
> = Omit<UseTableReturnType<TData, TError>, "refineCore"> & {
  refineCore: Omit<UseTableReturnType<TData, TError>["refineCore"], "tableQuery"> & {
    tableQuery: Omit<
      UseTableReturnType<TData, TError>["refineCore"]["tableQuery"],
      "data"
    > & {
      data: CursorPaginationResponse<TData> | undefined;
    };
  };
  cursorPagination: CursorPaginationActions;
};

export function useCursorTable<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>(
  props: UseTableProps<TQueryFnData, TError, TData>,
): UseCursorTableReturnType<TData, TError> {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const table = useTable<TQueryFnData, TError, TData>({
    ...props,
    refineCoreProps: {
      ...props.refineCoreProps,
      meta: {
        ...props.refineCoreProps?.meta,
        cursor,
        direction,
      },
    },
  });

  const { tableQuery } = table.refineCore;
  // Cast the data to our custom response type to access cursor metadata
  const result = tableQuery.data as
    | CursorPaginationResponse<TData>
    | undefined;

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

  const cursorPagination = useMemo(
    () => ({
      hasNextPage,
      hasPrevPage,
      goNextPage,
      goPrevPage,
      goFirstPage,
    }),
    [hasNextPage, hasPrevPage, goNextPage, goPrevPage, goFirstPage],
  );

  return {
    ...table,
    refineCore: {
      ...table.refineCore,
      tableQuery: table.refineCore.tableQuery,
    },
    cursorPagination,
  } as UseCursorTableReturnType<TData, TError>;
}
