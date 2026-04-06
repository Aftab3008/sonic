/**
 * Pagination metadata returned alongside every list endpoint response.
 * Mirrors the backend `CursorPage<T>.pagination` shape.
 */
export interface PaginationMeta {
  total: number;
  pageSize: number;
  nextCursor: string | null;
  prevCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * The envelope returned by the backend for paginated list endpoints.
 * After the TransformInterceptor wraps it, the actual HTTP response is:
 * `{ success: true, data: CursorPage<T>, timestamp: string }`
 */
export interface CursorPage<T> {
  data: T[];
  pagination: PaginationMeta;
}
