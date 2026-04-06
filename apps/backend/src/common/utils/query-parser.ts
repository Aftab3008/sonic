import { SQL, ilike, eq } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import type { CursorPaginationParams } from '../types/pagination.types';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/**
 * Parses raw query-string parameters into a validated `CursorPaginationParams`.
 *
 * Supported params:
 *   pageSize          → items per page (default 10, max 100)
 *   cursor            → opaque base64 cursor from a previous response
 *   direction         → 'next' | 'prev' (default 'next')
 *   _sort, _order     → sort field & direction (for Refine compatibility)
 *   <field>=<value>   → exact / ilike filters (matched against filterableColumns)
 */
export function parseCursorQuery(
  query: Record<string, string | undefined>,
  filterableColumns?: Record<string, PgColumn>,
): CursorPaginationParams {
  // --- Page size -----------------------------------------------------------
  const rawPageSize = parseInt(query.pageSize ?? '', 10);
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0
    ? Math.min(rawPageSize, MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  // --- Cursor & direction --------------------------------------------------
  const cursor = query.cursor || undefined;
  const direction = query.direction === 'prev' ? 'prev' : 'next';

  // --- Sorting (Refine convention: _sort / _order) -------------------------
  const sortField = query._sort || undefined;
  const sortOrder = (query._order?.toLowerCase() === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

  // --- Filters -------------------------------------------------------------
  const reservedKeys = new Set([
    'pageSize', 'cursor', 'direction',
    '_sort', '_order', '_start', '_end',
  ]);

  const filters: Record<string, string> = {};
  if (filterableColumns) {
    for (const key of Object.keys(filterableColumns)) {
      if (reservedKeys.has(key)) continue;
      const value = query[key];
      if (value !== undefined && value !== '') {
        filters[key] = value;
      }
    }
  }

  return { cursor, direction, pageSize, sortField, sortOrder, filters };
}

/**
 * Builds Drizzle `SQL` filter conditions from the parsed filter map.
 */
export function buildFilterConditions(
  filters: Record<string, string>,
  filterableColumns: Record<string, PgColumn>,
): SQL[] {
  const conditions: SQL[] = [];

  for (const [key, value] of Object.entries(filters)) {
    const column = filterableColumns[key];
    if (!column) continue;

    if (column.dataType === 'string') {
      conditions.push(ilike(column, `%${value}%`));
    } else {
      conditions.push(eq(column, value));
    }
  }

  return conditions;
}
