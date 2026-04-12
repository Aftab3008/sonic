import { useGetAlbums } from "@/hooks/use-album";
import { useGetRecording } from "@/hooks/use-recording";
import { useGetTrackDetails } from "@/hooks/use-track";
import { UpdateTrackType } from "@/lib/schema/track.schema";
import { TrackEditForm } from "./TrackEditForm";

interface TrackEditContentProps {
  trackId: string;
}

export function TrackEditContent({ trackId }: TrackEditContentProps) {
  const { data: track } = useGetTrackDetails({ trackId });

  const recordingId = track?.recordingId || null;
  const { data: recording } = useGetRecording(recordingId);
  const { data: albumsResponse } = useGetAlbums({ pageSize: 100 });

  if (!track || !albumsResponse) {
    return null;
  }

  const albums = albumsResponse.data || [];

  const transformedData: UpdateTrackType = {
    recordingId: track.recordingId,
    albumId: track.albumId,
    trackNumber: track.trackNumber,
    discNumber: track.discNumber ?? 1,
    artistIds:
      track.artists?.map((a) => ({
        artistId: a.artistId || a.artist?.id,
        role: a.role,
        name: a.artist?.name,
      })) || [],
    overrideTitle: track.overrideTitle || "",
    coverImageUrl: track.coverImageUrl || "",
    overrideIsExplicit: track.overrideIsExplicit ?? undefined,
  };

  return (
    <TrackEditForm
      data={transformedData}
      trackId={trackId}
      albums={albums}
      recording={recording || null}
    />
  );
}
