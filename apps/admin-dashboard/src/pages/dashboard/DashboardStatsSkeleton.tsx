import { Disc3, Mic2, Music, Tags, Users } from "lucide-react";
import { StatCard } from "./StatCard";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Total Artists"
        icon={Mic2}
        color="bg-violet-500"
        isLoading
      />
      <StatCard
        title="Total Albums"
        icon={Disc3}
        color="bg-blue-500"
        isLoading
      />
      <StatCard
        title="Total Tracks"
        icon={Music}
        color="bg-emerald-500"
        isLoading
      />
      <StatCard
        title="Total Genres"
        icon={Tags}
        color="bg-amber-500"
        isLoading
      />
      <StatCard
        title="Total Users"
        icon={Users}
        color="bg-rose-500"
        isLoading
      />
    </div>
  );
}
