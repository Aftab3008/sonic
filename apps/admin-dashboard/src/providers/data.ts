import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import type { CursorPage } from "@/types/pagination.types";

const { dataProvider: simpleRestProvider, kyInstance } =
  createSimpleRestDataProvider({
    apiURL: `${API_URL}/api`,
    kyOptions: {
      credentials: "include",
    },
  });

// ---------------------------------------------------------------------------
// Unwrap helper: TransformInterceptor wraps responses as { success, data, timestamp }.
// Refine expects { data: T } for single-record operations.
// ---------------------------------------------------------------------------
const unwrap = (res: any) => ({
  ...res,
  data:
    res.data?.success && res.data?.data !== undefined ? res.data.data : res.data,
});

// ---------------------------------------------------------------------------
// Data Provider
// ---------------------------------------------------------------------------
export const dataProvider = {
  ...simpleRestProvider,

  /**
   * List endpoint — cursor-paginated.
   *
   * Reads the `CursorPage<T>` envelope from the response body (not headers)
   * and maps it to Refine's expected `{ data, total }` format.
   *
   * Cursor metadata is propagated via `meta` on the returned result so that
   * list pages can access `hasNextPage`, `hasPrevPage`, `nextCursor`, etc.
   */
  getList: async (params: any) => {
    const url = params.resource;
    const query = new URLSearchParams();

    // ---- Page size --------------------------------------------------------
    const pageSize = params.pagination?.pageSize || 10;
    query.set("pageSize", pageSize.toString());

    // ---- Cursor & direction (passed via meta from list pages) -------------
    if (params.meta?.cursor) {
      query.set("cursor", params.meta.cursor);
    }
    if (params.meta?.direction) {
      query.set("direction", params.meta.direction);
    }

    // ---- Filters ----------------------------------------------------------
    if (params.filters) {
      for (const filter of params.filters) {
        if (
          filter.field &&
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ""
        ) {
          query.set(filter.field, filter.value);
        }
      }
    }

    // ---- Sorting (Refine convention) --------------------------------------
    if (params.sorters && params.sorters.length > 0) {
      query.set("_sort", params.sorters[0].field);
      query.set("_order", params.sorters[0].order);
    }

    // ---- Execute request --------------------------------------------------
    const response = await kyInstance.get(url, { searchParams: query });
    const json = (await response.json()) as any;

    // Unwrap TransformInterceptor envelope: { success, data: CursorPage<T> }
    const cursorPage: CursorPage<any> = json.success ? json.data : json;

    return {
      data: cursorPage.data,
      total: cursorPage.pagination.total,
      // Extra metadata — accessible via `tableQueryResult.data` in list pages
      nextCursor: cursorPage.pagination.nextCursor,
      prevCursor: cursorPage.pagination.prevCursor,
      hasNextPage: cursorPage.pagination.hasNextPage,
      hasPrevPage: cursorPage.pagination.hasPrevPage,
    };
  },

  getOne: async (params: any) =>
    unwrap(await simpleRestProvider.getOne(params)),
  create: async (params: any) =>
    unwrap(await simpleRestProvider.create(params)),
  update: async (params: any) =>
    unwrap(await simpleRestProvider.update(params)),
  deleteOne: async (params: any) =>
    unwrap(await simpleRestProvider.deleteOne(params)),
  getMany: simpleRestProvider.getMany
    ? async (params: any) => unwrap(await simpleRestProvider.getMany!(params))
    : undefined,
  updateMany: simpleRestProvider.updateMany
    ? async (params: any) =>
        unwrap(await simpleRestProvider.updateMany!(params))
    : undefined,
  deleteMany: simpleRestProvider.deleteMany
    ? async (params: any) =>
        unwrap(await simpleRestProvider.deleteMany!(params))
    : undefined,
  custom: simpleRestProvider.custom
    ? async (params: any) => unwrap(await simpleRestProvider.custom!(params))
    : undefined,
};

export { kyInstance };
