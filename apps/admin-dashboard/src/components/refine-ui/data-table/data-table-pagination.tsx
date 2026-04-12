 ;

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
} from "lucide-react";
import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CursorPaginationActions = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goNextPage: () => void;
  goPrevPage: () => void;
  goFirstPage: () => void;
};

type DataTablePaginationProps = {
  pageSize: number;
  setPageSize: (size: number) => void;
  total?: number;
  /** Cursor-based pagination controls. When provided, these take priority. */
  cursorPagination?: CursorPaginationActions;
  /** Offset-based fallback props (used when cursorPagination is not provided). */
  currentPage?: number;
  pageCount?: number;
  setCurrentPage?: (page: number) => void;
};

export function DataTablePagination({
  pageSize,
  setPageSize,
  total,
  cursorPagination,
  currentPage,
  pageCount,
  setCurrentPage,
}: DataTablePaginationProps) {
  const pageSizeOptions = useMemo(() => {
    const baseOptions = [10, 20, 30, 40, 50];
    const optionsSet = new Set(baseOptions);

    if (!optionsSet.has(pageSize)) {
      optionsSet.add(pageSize);
    }

    return Array.from(optionsSet).sort((a, b) => a - b);
  }, [pageSize]);

  // Use cursor-based pagination when available; fall back to offset-based
  const isCursor = !!cursorPagination;

  const canGoPrev = isCursor
    ? cursorPagination!.hasPrevPage
    : (currentPage ?? 1) > 1;

  const canGoNext = isCursor
    ? cursorPagination!.hasNextPage
    : (currentPage ?? 1) < (pageCount ?? 1);

  const handlePrev = () => {
    if (isCursor) {
      cursorPagination!.goPrevPage();
    } else if (setCurrentPage && currentPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (isCursor) {
      cursorPagination!.goNextPage();
    } else if (setCurrentPage && currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (isCursor) {
      cursorPagination!.goFirstPage();
    } else if (setCurrentPage) {
      setCurrentPage(1);
    }
  };

  return (
    <div
      className={cn(
        "flex",
        "items-center",
        "justify-between",
        "flex-wrap",
        "px-2",
        "w-full",
        "gap-2",
      )}
    >
      <div
        className={cn(
          "flex-1",
          "text-sm",
          "text-muted-foreground",
          "whitespace-nowrap",
        )}
      >
        {typeof total === "number" ? `${total.toLocaleString()} row(s)` : null}
      </div>
      <div className={cn("flex", "items-center", "flex-wrap", "gap-2")}>
        <div className={cn("flex", "items-center", "gap-2")}>
          <span className={cn("text-sm", "font-medium")}>Rows per page</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className={cn("h-8", "w-[70px]")}>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={cn("flex", "items-center", "flex-wrap", "gap-2")}>
          {/* For offset pagination, show "Page X of Y". For cursor, just show total. */}
          {!isCursor && currentPage != null && pageCount != null && (
            <div
              className={cn(
                "flex",
                "items-center",
                "justify-center",
                "text-sm",
                "font-medium",
              )}
            >
              Page {currentPage} of {pageCount}
            </div>
          )}
          <div className={cn("flex", "items-center", "gap-2")}>
            <Button
              variant="outline"
              className={cn("hidden", "h-8", "w-8", "p-0", "lg:flex")}
              onClick={handleFirst}
              disabled={!canGoPrev}
              aria-label="Go to first page"
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className={cn("h-8", "w-8", "p-0")}
              onClick={handlePrev}
              disabled={!canGoPrev}
              aria-label="Go to previous page"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className={cn("h-8", "w-8", "p-0")}
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Go to next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

DataTablePagination.displayName = "DataTablePagination";
