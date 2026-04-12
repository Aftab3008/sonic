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
import { GenreEditContent } from "./components/edit/GenreEditContent";
import { GenreEditSkeleton } from "./components/edit/GenreEditSkeleton";

export function GenreEdit() {
  const { id } = useParams();

  if (!id) {
    return (
      <ShowView>
        <ShowViewHeader />
        <div className="py-8 text-center text-muted-foreground">
          Invalid genre ID
        </div>
      </ShowView>
    );
  }

  return (
    <EditView>
      <EditViewHeader />
      <ComponentErrorBoundary>
        <Suspense fallback={<GenreEditSkeleton />}>
          <GenreEditContent genreId={id} />
        </Suspense>
      </ComponentErrorBoundary>
    </EditView>
  );
}
