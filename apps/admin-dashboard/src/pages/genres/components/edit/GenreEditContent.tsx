import { useGetGenreDetails } from "@/hooks/use-genre";
import { UpdateGenreType } from "@/lib/schema/genre.schema";
import { GenreEditForm } from "./GenreEditForm";

interface GenreEditContentProps {
  genreId: string;
}

export function GenreEditContent({ genreId }: GenreEditContentProps) {
  const { data: genre } = useGetGenreDetails({ genreId });

  if (!genre) return null;

  const transformedData: UpdateGenreType = {
    name: genre.name,
    slug: genre.slug,
    icon: genre.icon || "",
    primaryColor: genre.primaryColor || "#000000",
    secondaryColor: genre.secondaryColor || "#000000",
  };

  return <GenreEditForm data={transformedData} genreId={genreId} />;
}
