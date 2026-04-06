/**
 * Cursor-paginated response envelope.
 * Every list endpoint returns this shape before the TransformInterceptor wraps it.
 */
export interface CursorPage<T> {
  data: T[];
  pagination: {
    /** Total row count matching the active filters (excluding cursor window). */
    total: number;
    /** Number of items requested per page. */
    pageSize: number;
    /** Opaque cursor pointing to the next page. `null` when on the last page. */
    nextCursor: string | null;
    /** Opaque cursor pointing to the previous page. `null` when on the first page. */
    prevCursor: string | null;
    /** Convenience boolean — true when `nextCursor` is non-null. */
    hasNextPage: boolean;
    /** Convenience boolean — true when `prevCursor` is non-null. */
    hasPrevPage: boolean;
  };
}

/**
 * Parsed & validated cursor-pagination query parameters.
 * The query-parser transforms raw query-string values into this contract.
 */
export interface CursorPaginationParams {
  cursor?: string;
  direction: 'next' | 'prev';
  pageSize: number;
  sortField?: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, string>;
}
