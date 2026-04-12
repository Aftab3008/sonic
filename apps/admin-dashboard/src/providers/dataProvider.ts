import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "../constants/constants";
import type { CursorPage } from "@/types/pagination.types";
import type {
  DataProvider,
  GetListParams,
  GetListResponse,
  BaseRecord,
  CrudFilters,
  CrudSorting,
} from "@refinedev/core";

const { dataProvider: simpleRestProvider, kyInstance } =
  createSimpleRestDataProvider({
    apiURL: `${API_URL}/api/admin`,
    kyOptions: {
      credentials: "include",
    },
  });

/**
 * Custom response type for list actions that include cursor metadata.
 */
export interface CursorPaginationResponse<
  TData extends BaseRecord = BaseRecord,
> extends GetListResponse<TData> {
  nextCursor: string | null;
  prevCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

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

export const dataProvider: DataProvider = {
  /**
   * List endpoint — cursor-paginated.
   */
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    pagination,
    meta,
    filters,
    sorters,
  }: GetListParams): Promise<CursorPaginationResponse<TData>> => {
    const url = resource;
    const query = new URLSearchParams();

    const pageSize = pagination?.pageSize || 10;
    query.set("pageSize", pageSize.toString());

    if (meta?.cursor) {
      query.set("cursor", meta.cursor as string);
    }
    if (meta?.direction) {
      query.set("direction", meta.direction as string);
    }

    if (filters) {
      for (const filter of filters as CrudFilters) {
        if (
          "field" in filter &&
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ""
        ) {
          query.set(filter.field, String(filter.value));
        }
      }
    }

    if (sorters && (sorters as CrudSorting).length > 0) {
      const firstSorter = (sorters as CrudSorting)[0];
      query.set("_sort", firstSorter.field);
      query.set("_order", firstSorter.order);
    }
    const response = await kyInstance.get(url, { searchParams: query });
    const json = (await response.json()) as any;

    const cursorPage: CursorPage<TData> = json.success ? json.data : json;

    return {
      data: cursorPage.data,
      total: cursorPage.pagination.total,
      nextCursor: cursorPage.pagination.nextCursor,
      prevCursor: cursorPage.pagination.prevCursor,
      hasNextPage: cursorPage.pagination.hasNextPage,
      hasPrevPage: cursorPage.pagination.hasPrevPage,
    };
  },

  /**
   * Single record deletion.
   */
  deleteOne: async (params) =>
    unwrap(await simpleRestProvider.deleteOne(params)),

  /* 
    The following methods are currently unused in the project as all create/update/show 
    flows have been migrated to custom React Query hooks. They are provided as stubs 
    to satisfy the DataProvider interface if needed, or simply omitted if optional.
  */
  getOne: async ({ resource, id, meta }) =>
    unwrap(await simpleRestProvider.getOne({ resource, id, meta })),

  create: () => {
    throw new Error("Not implemented: Use custom hooks instead.");
  },
  update: () => {
    throw new Error("Not implemented: Use custom hooks instead.");
  },
  getApiUrl: () => `${API_URL}/api`,
};

export { kyInstance };
