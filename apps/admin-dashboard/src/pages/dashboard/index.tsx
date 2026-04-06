import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useList } from "@refinedev/core";
import { Mic2, Disc3, Music, Tags, Users, TrendingUp } from "lucide-react";
import { useListUsers } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

function StatCard({ title, value, icon: Icon, description, color }: {
  title: string;
  value: number | string;
  icon: any;
  description?: string;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { query: artistsQuery } = useList({ resource: "artists", pagination: { pageSize: 1 } });
  const { query: albumsQuery } = useList({ resource: "albums", pagination: { pageSize: 1 } });
  const { query: tracksQuery } = useList({ resource: "tracks", pagination: { pageSize: 1 } });
  const { query: genresQuery } = useList({ resource: "genres", pagination: { pageSize: 1 } });
  const { data: usersData } = useListUsers({ limit: 1 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Resso Admin Panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Artists"
          value={artistsQuery?.data?.total ?? 0}
          icon={Mic2}
          color="bg-violet-500"
        />
        <StatCard
          title="Total Albums"
          value={albumsQuery?.data?.total ?? 0}
          icon={Disc3}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Tracks"
          value={tracksQuery?.data?.total ?? 0}
          icon={Music}
          color="bg-emerald-500"
        />
        <StatCard
          title="Total Genres"
          value={genresQuery?.data?.total ?? 0}
          icon={Tags}
          color="bg-amber-500"
        />
        <StatCard
          title="Total Users"
          value={usersData?.users?.length ?? 0}
          icon={Users}
          color="bg-rose-500"
        />
      </div>
    </div>
  );
}
