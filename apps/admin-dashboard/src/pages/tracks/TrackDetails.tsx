import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { useParams } from "react-router";
import { Suspense } from "react";
import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { TrackDetailsContent } from "./components/details/TrackDetailsContent";
import { TrackDetailsSkeleton } from "./components/details/TrackDetailsSkeleton";

export function TrackDetails() {
  const { id } = useParams();

  if (!id) {
    return (
      <ShowView>
        <ShowViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid track ID
        </div>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader />
      <ComponentErrorBoundary fallback="Error loading track details">
        <Suspense fallback={<TrackDetailsSkeleton />}>
          <TrackDetailsContent trackId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </ShowView>
  );
}
