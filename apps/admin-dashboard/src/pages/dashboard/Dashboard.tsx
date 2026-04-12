import { Suspense } from "react";
import { DashboardStats } from "./DashboardStats";
import { DashboardStatsSkeleton } from "./DashboardStatsSkeleton";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Sonic Admin Panel</p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
