import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import { useParams } from "react-router";
import { UserProfileCard } from "./components/user-profile-card";
import { UserProfileSkeleton } from "./components/user-profile-skeleton";
import { UserSessionsList } from "./components/user-sessions-list";
import { UserSessionsSkeleton } from "./components/user-sessions-skeleton";

export function UserDetails() {
  const { id } = useParams();

  if (!id) {
    return (
      <ShowView>
        <ShowViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid user ID
        </div>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader title="User Details" />
      
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
    </ShowView>
  );
}
