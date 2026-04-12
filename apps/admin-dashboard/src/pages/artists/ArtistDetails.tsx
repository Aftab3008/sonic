import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Suspense } from "react";
import { useParams } from "react-router";
import { ArtistDetailsContent } from "./components/details/ArtistDetailsContent";
import { ArtistDetailsSkeleton } from "./components/details/ArtistDetailsSkeleton";

export function ArtistDetails() {
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
    <ShowView>
      <ShowViewHeader
        actions={
          <>
            <EditButton variant="outline" size="sm" />
          </>
        }
        hideDefaultActions
      />
      <ComponentErrorBoundary fallback="Error loading artist details">
        <Suspense fallback={<ArtistDetailsSkeleton />}>
          <ArtistDetailsContent artistId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </ShowView>
  );
}
