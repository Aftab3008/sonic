import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "../constants/constants";
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
    res.data?.success && res.data?.data !== undefined
      ? res.data.data
      : res.data,
});

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
  getList: async ({
    resource,
    pagination,
    meta,
    filters,
    sorters,
  }: {
    resource: string;
    pagination?: { pageSize: number };
    meta?: { cursor?: string; direction?: "next" | "prev" };
    filters?: Array<{ field: string; operator?: string; value: any }>;
    sorters?: Array<{ field: string; order: "asc" | "desc" }>;
  }) => {
    const url = resource;
    const query = new URLSearchParams();

    // ---- Page size --------------------------------------------------------
    const pageSize = pagination?.pageSize || 10;
    query.set("pageSize", pageSize.toString());

    // ---- Cursor & direction (passed via meta from list pages) -------------
    if (meta?.cursor) {
      query.set("cursor", meta.cursor);
    }
    if (meta?.direction) {
      query.set("direction", meta.direction);
    }

    // ---- Filters ----------------------------------------------------------
    if (filters) {
      for (const filter of filters) {
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
    if (sorters && sorters.length > 0) {
      query.set("_sort", sorters[0].field);
      query.set("_order", sorters[0].order);
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

  getOne: async ({ resource, id }: { resource: string; id: string }) =>
    unwrap(await simpleRestProvider.getOne({ resource, id })),
  create: async ({
    resource,
    variables,
  }: {
    resource: string;
    variables: any;
  }) => unwrap(await simpleRestProvider.create({ resource, variables })),
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
