import { useGetAlbumDetails } from "@/hooks/use-album";
import { AlbumEditForm } from "./AlbumEditForm";
import { UpdateAlbumType } from "@/lib/schema/album.schema";

interface AlbumEditContentProps {
  albumId: string;
}

export function AlbumEditContent({ albumId }: AlbumEditContentProps) {
  const { data: album } = useGetAlbumDetails({ albumId });

  if (!album) {
    return null;
  }

  const transformedData: UpdateAlbumType = {
    title: album.title,
    releaseDate: album.releaseDate,
    albumType: album.albumType,
    releaseStatus: album.releaseStatus,
    coverImageUrl: album.coverImageUrl || "",
    upc: album.upc || "",
    recordLabel: album.recordLabel || "",
    copyright: album.copyright || "",
    artistIds:
      album.artists?.map((a) => ({
        artistId: a.artistId,
        role: a.role,
        name: a.artist?.name,
      })) || [],
    genreIds: album.genres?.map((g) => g.genreId) || [],
  };

  return <AlbumEditForm data={transformedData} albumId={albumId} />;
}
