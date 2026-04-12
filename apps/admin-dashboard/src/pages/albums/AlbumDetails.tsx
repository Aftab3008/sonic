import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Suspense } from "react";
import { useParams } from "react-router";
import AlbumDetailsContent from "./components/AlbumDetailsContent";
import { AlbumDetailsSkeleton } from "./components/AlbumDetailsSkeleton";

export function AlbumDetails() {
  const { id } = useParams();

  if (!id) {
    return (
      <ShowView>
        <ShowViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid album ID
        </div>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader />
      <ComponentErrorBoundary fallback="Error loading album details">
        <Suspense fallback={<AlbumDetailsSkeleton />}>
          <AlbumDetailsContent albumId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </ShowView>
  );
}
