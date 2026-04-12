import { useSuspenseDashboardStats } from "@/hooks/use-admin";
import { Disc3, Mic2, Music, Tags, Users } from "lucide-react";
import { StatCard } from "./StatCard";

export function DashboardStats() {
  const { data: stats } = useSuspenseDashboardStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        title="Total Artists"
        value={stats.artists}
        icon={Mic2}
        color="bg-violet-500"
      />
      <StatCard
        title="Total Albums"
        value={stats.albums}
        icon={Disc3}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Tracks"
        value={stats.tracks}
        icon={Music}
        color="bg-emerald-500"
      />
      <StatCard
        title="Total Genres"
        value={stats.genres}
        icon={Tags}
        color="bg-amber-500"
      />
      <StatCard
        title="Total Users"
        value={stats.users}
        icon={Users}
        color="bg-rose-500"
      />
    </div>
  );
}
