import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router";
import { UserProfileCard } from "./components/user-profile-card";
import { UserProfileSkeleton } from "./components/user-profile-skeleton";
import { UserSessionsList } from "./components/user-sessions-list";
import { UserSessionsSkeleton } from "./components/user-sessions-skeleton";

export function UserShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Invalid user ID
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center relative gap-2">
        <div className="bg-background z-2 pr-4">
          <Breadcrumb />
        </div>
        <Separator className="absolute left-0 right-0 z-1" />
      </div>
      <div className="flex items-center gap-2 -ml-2.5">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">User Details</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ComponentErrorBoundary fallback="Error loading profile">
          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfileCard userId={id} />
          </Suspense>
        </ComponentErrorBoundary>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Active Sessions</h3>
          </CardHeader>
          <CardContent>
            <ComponentErrorBoundary fallback="Error loading sessions">
              <Suspense fallback={<UserSessionsSkeleton />}>
                <UserSessionsList userId={id} />
              </Suspense>
            </ComponentErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
