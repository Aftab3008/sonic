import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { useParams } from "react-router";
import { Suspense } from "react";
import { TrackEditContent } from "./components/edit/TrackEditContent";
import { TrackEditSkeleton } from "./components/edit/TrackEditSkeleton";
import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";

export function TrackEdit() {
  const { id } = useParams<{ id: string }>();

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
    <EditView>
      <EditViewHeader />
      <ComponentErrorBoundary>
        <Suspense fallback={<TrackEditSkeleton />}>
          <TrackEditContent trackId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </EditView>
  );
}
