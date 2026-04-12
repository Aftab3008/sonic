import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Suspense } from "react";
import { useParams } from "react-router";
import { RecordingDetailsContent } from "./components/details/RecordingDetailsContent";
import { RecordingDetailsSkeleton } from "./components/details/RecordingDetailsSkeleton";

export function RecordingDetails() {
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
    <ShowView>
      <ShowViewHeader
        actions={
          <DeleteButton
            variant="outline"
            className="text-red-500"
            recordItemId={id}
            resource="recordings"
          />
        }
      />

      <ComponentErrorBoundary fallback="Error loading recording details">
        <Suspense fallback={<RecordingDetailsSkeleton />}>
          <RecordingDetailsContent recordingId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </ShowView>
  );
}
