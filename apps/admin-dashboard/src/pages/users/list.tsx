import { Suspense, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { UserListTable } from "./components/user-list-table";
import { UserListSkeleton } from "./components/user-list-table-skeleton";
import { ComponentErrorBoundary } from "@/components/component-error-boundary";

export function UserList() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const currentParams = {
    limit,
    offset,
    searchField: search ? ("email" as const) : undefined,
    searchValue: search || undefined,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center relative gap-2">
        <div className="bg-background z-2 pr-4">
          <Breadcrumb />
        </div>
        <Separator className="absolute left-0 right-0 z-1" />
      </div>
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(0);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <ComponentErrorBoundary fallback="Error loading users list">
              <Suspense fallback={<UserListSkeleton />}>
                <UserListTable params={currentParams} />
              </Suspense>
            </ComponentErrorBoundary>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(0, offset - limit))}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => setOffset(offset + limit)}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

