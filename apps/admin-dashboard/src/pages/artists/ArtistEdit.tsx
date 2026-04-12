import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Suspense } from "react";
import { useParams } from "react-router";
import { ArtistEditContent } from "./components/edit/ArtistEditContent";
import { ArtistEditSkeleton } from "./components/edit/ArtistEditSkeleton";

export function ArtistEdit() {
  const { id } = useParams();

  if (!id) {
    return (
      <ShowView>
        <ShowViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid artist ID
        </div>
      </ShowView>
    );
  }

  return (
    <EditView>
      <EditViewHeader />
      <ComponentErrorBoundary>
        <Suspense fallback={<ArtistEditSkeleton />}>
          <ArtistEditContent artistId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </EditView>
  );
}
