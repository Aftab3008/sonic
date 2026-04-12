import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { Suspense } from "react";
import { useParams } from "react-router";
import { AlbumEditContent } from "./components/edit/AlbumEditContent";
import { AlbumEditSkeleton } from "./components/edit/AlbumEditSkeleton";

export function AlbumEdit() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <EditView>
        <EditViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid album ID
        </div>
      </EditView>
    );
  }

  return (
    <EditView>
      <EditViewHeader />
      <ComponentErrorBoundary fallback="Error loading album details">
        <Suspense fallback={<AlbumEditSkeleton />}>
          <AlbumEditContent albumId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </EditView>
  );
}
