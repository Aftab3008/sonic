import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { useParsed } from "@refinedev/core";
import { Suspense } from "react";
import { RecordingEditContent } from "./components/edit/RecordingEditContent";
import { RecordingEditSkeleton } from "./components/edit/RecordingEditSkeleton";
import { useParams } from "react-router";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";

export function RecordingEdit() {
  const { id } = useParams();

  if (!id) {
    return (
      <ShowView>
        <ShowViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid recording ID
        </div>
      </ShowView>
    );
  }

  return (
    <EditView>
      <EditViewHeader />
      <ComponentErrorBoundary>
        <Suspense fallback={<RecordingEditSkeleton />}>
          <RecordingEditContent recordingId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </EditView>
  );
}
