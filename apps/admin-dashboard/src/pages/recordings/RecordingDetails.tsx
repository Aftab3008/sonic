import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { useNavigate, useParams } from "react-router";
import { Suspense } from "react";
import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { RecordingDetailsContent } from "./components/RecordingDetailsContent";
import { RecordingDetailsSkeleton } from "./components/RecordingDetailsSkeleton";

export function RecordingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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
            // onSuccess={() => navigate("/recordings")}
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
