import { useGetArtistDetails } from "@/hooks/use-artist";
import { UpdateArtistType } from "@/lib/schema/artist.schema";
import { ArtistEditForm } from "./ArtistEditForm";

interface ArtistEditContentProps {
  artistId: string;
}

export function ArtistEditContent({ artistId }: ArtistEditContentProps) {
  const { data: artist } = useGetArtistDetails({ artistId });

  if (!artist) {
    return null;
  }

  const transformedData: UpdateArtistType = {
    name: artist.name,
    slug: artist.slug,
    bio: artist.bio || "",
    imageUrl: artist.imageUrl || "",
    headerImageUrl: artist.headerImageUrl || "",
    isVerified: artist.isVerified,
    socialLinks: {
      instagram: artist.socialLinks?.instagram || "",
      twitter: artist.socialLinks?.twitter || "",
      website: artist.socialLinks?.website || "",
    },
  };

  return <ArtistEditForm data={transformedData} artistId={artistId} />;
}
