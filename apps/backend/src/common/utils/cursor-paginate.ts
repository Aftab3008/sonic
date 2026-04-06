import { SQL, and, gt, lt, desc, asc, eq, or, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CursorPage, CursorPaginationParams } from '../types/pagination.types';
import { buildFilterConditions } from './query-parser';



export interface CursorPayload {
  /** Value of the sort column for the cursor row. */
  s: unknown;
  /** Primary key (id) of the cursor row — tie-breaker. */
  id: string;
}

/**
 * Encode a cursor payload into an opaque base64url string.
 */
export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Decode an opaque cursor string back into its payload.
 * Returns `undefined` if the cursor is malformed.
 */
export function decodeCursor(cursor: string): CursorPayload | undefined {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && 'id' in parsed) {
      return parsed as CursorPayload;
    }
    return undefined;
  } catch {
    return undefined;
  }
}


export interface CursorPaginateOptions<TSchema extends Record<string, any>> {
  /** Drizzle DB connection. */
  db: NodePgDatabase<TSchema>;
  /** Relational query builder — e.g. `db.query.album`. */
  queryBuilder: {
    findMany: (opts: any) => Promise<any[]>;
  };
  /** The Drizzle table object — used for the count query. */
  table: any; // PgTableWithColumns
  /** Parsed pagination params from request. */
  params: CursorPaginationParams;
  /** Map of field names to Drizzle PgColumn objects that are sortable. */
  sortableColumns: Record<string, PgColumn>;
  /** Map of field names to Drizzle PgColumn objects that are filterable. */
  filterableColumns: Record<string, PgColumn>;
  /** Default sort column when none specified. */
  defaultSortColumn: PgColumn;
  /** Primary key column — used as tie-breaker in composite cursor. */
  idColumn: PgColumn;
  /** Extra opts passed to `findMany` (e.g. `with` for eager-loading relations). */
  findManyExtras?: Record<string, any>;
}

/**
 * Production-grade cursor pagination with composite cursors, bidirectional
 * traversal, and proper tie-breaking for non-unique sort columns.
 *
 * Returns a fully populated `CursorPage<T>`.
 */
export async function cursorPaginate<T, TSchema extends Record<string, any>>(
  opts: CursorPaginateOptions<TSchema>,
): Promise<CursorPage<T>> {
  const {
    db,
    queryBuilder,
    table,
    params,
    sortableColumns,
    filterableColumns,
    defaultSortColumn,
    idColumn,
    findManyExtras,
  } = opts;

  const { pageSize, sortOrder, direction } = params;

  // ---- Resolve sort column ------------------------------------------------
  const sortCol = params.sortField
    ? sortableColumns[params.sortField] ?? defaultSortColumn
    : defaultSortColumn;

  // ---- Build filter conditions --------------------------------------------
  const filterConditions = buildFilterConditions(params.filters, filterableColumns);

  // ---- Build cursor condition (composite: sortCol + id) -------------------
  let cursorCondition: SQL | undefined;
  if (params.cursor) {
    const decoded = decodeCursor(params.cursor);
    if (decoded) {
      let sortValue: unknown = decoded.s;

      // Coerce date strings back to proper format for timestamp columns
      if (isDateColumn(sortCol) && typeof sortValue === 'string') {
        sortValue = new Date(sortValue).toISOString();
      }

      const cursorId = decoded.id;

      // Determine comparison direction:
      //   next + asc  → (sortCol, id) > (cursorSort, cursorId)
      //   next + desc → (sortCol, id) < (cursorSort, cursorId)
      //   prev + asc  → (sortCol, id) < (cursorSort, cursorId)
      //   prev + desc → (sortCol, id) > (cursorSort, cursorId)
      const seekForward =
        (direction === 'next' && sortOrder === 'asc') ||
        (direction === 'prev' && sortOrder === 'desc');

      const cmpSort = seekForward ? gt : lt;
      const cmpId = seekForward ? gt : lt;

      // Composite seek: (sortCol > cursorSort) OR (sortCol = cursorSort AND id > cursorId)
      cursorCondition = or(
        cmpSort(sortCol, sortValue),
        and(eq(sortCol, sortValue), cmpId(idColumn, cursorId)),
      );
    }
  }

  // ---- Combine WHERE conditions -------------------------------------------
  const allConditions = [...filterConditions];
  if (cursorCondition) allConditions.push(cursorCondition);
  const where = allConditions.length > 0 ? and(...allConditions) : undefined;

  // ---- Determine ORDER BY -------------------------------------------------
  // For "prev" direction we invert the sort so we fetch rows "before" the cursor,
  // then reverse the result set to present them in correct order.
  const invertSort = direction === 'prev';
  const effectiveOrder = invertSort
    ? (sortOrder === 'asc' ? 'desc' : 'asc')
    : sortOrder;

  const orderByList = [
    effectiveOrder === 'desc' ? desc(sortCol) : asc(sortCol),
    effectiveOrder === 'desc' ? desc(idColumn) : asc(idColumn),
  ];

  // ---- Execute queries in parallel ----------------------------------------
  const [rawData, countResult] = await Promise.all([
    queryBuilder.findMany({
      where,
      orderBy: orderByList,
      limit: pageSize + 1, // fetch one extra to detect hasMore
      ...findManyExtras,
    }),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(table)
      .where(filterConditions.length > 0 ? and(...filterConditions) : undefined),
  ]);

  // ---- Determine hasMore, trim data, reverse if needed --------------------
  const hasMore = rawData.length > pageSize;
  if (hasMore) rawData.pop(); // remove the extra sentinel record

  // If we fetched backwards, reverse so final data is in the expected sort order
  if (invertSort) rawData.reverse();

  const data = rawData as T[];
  const total = countResult[0]?.count ?? 0;

  // ---- Build cursors from first/last items of the page --------------------
  const firstItem = data.length > 0 ? (data[0] as any) : null;
  const lastItem = data.length > 0 ? (data[data.length - 1] as any) : null;

  const sortColKey = getSortColumnKey(sortCol);

  let nextCursor: string | null = null;
  let prevCursor: string | null = null;

  if (direction === 'next') {
    // Forward pagination
    if (hasMore && lastItem) {
      nextCursor = encodeCursor({
        s: extractSortValue(lastItem, sortCol, sortColKey),
        id: lastItem.id,
      });
    }
    // We have a previous page if a cursor was provided (i.e., we're not on page 1)
    if (params.cursor && firstItem) {
      prevCursor = encodeCursor({
        s: extractSortValue(firstItem, sortCol, sortColKey),
        id: firstItem.id,
      });
    }
  } else {
    // Backward pagination (direction === 'prev')
    // After reversing, the last item is the boundary for "next"
    if (lastItem) {
      nextCursor = encodeCursor({
        s: extractSortValue(lastItem, sortCol, sortColKey),
        id: lastItem.id,
      });
    }
    // There's a previous page if we fetched a full page going backwards
    if (hasMore && firstItem) {
      prevCursor = encodeCursor({
        s: extractSortValue(firstItem, sortCol, sortColKey),
        id: firstItem.id,
      });
    }
  }

  return {
    data,
    pagination: {
      total,
      pageSize,
      nextCursor,
      prevCursor,
      hasNextPage: nextCursor !== null,
      hasPrevPage: prevCursor !== null,
    },
  };
}


/**
 * Determines the JS property name of a Drizzle column for accessing row values.
 * Drizzle columns have a `.name` that is the *SQL* column name (snake_case).
 * The relational query builder returns camelCase keys matching the schema definition.
 * We need the schema field name — which is the column's `_.name` or the mapped key.
 */
function getSortColumnKey(col: PgColumn): string {
  // Drizzle exposes the TS property name via `col._.name` (internal but stable)
  try {
    return (col as any)._.name as string;
  } catch {
    // Fallback: convert SQL column name from snake_case to camelCase
    const sqlName: string = col.name;
    return sqlName.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
  }
}

/**
 * Extracts the sort column value from a row, handling Date serialization.
 */
function extractSortValue(
  row: Record<string, any>,
  col: PgColumn,
  key: string,
): unknown {
  const value = row[key];
  if (value instanceof Date) return value.toISOString();
  return value;
}

/**
 * Checks if a column is a date/timestamp type.
 */
function isDateColumn(col: PgColumn): boolean {
  // Drizzle's PgColumn exposes dataType; timestamp columns report 'date'
  return col.dataType === 'date' || col.columnType === 'PgTimestamp';
}
