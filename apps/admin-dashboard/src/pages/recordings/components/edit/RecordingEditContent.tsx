import { useGetRecordingDetails } from "@/hooks/use-recording";
import { UpdateRecordingType } from "@/lib/schema/recording.schema";
import { RecordingEditForm } from "./RecordingEditForm";

interface RecordingEditContentProps {
  recordingId: string;
}

export function RecordingEditContent({
  recordingId,
}: RecordingEditContentProps) {
  const { data: recording } = useGetRecordingDetails({ recordingId });

  if (!recording) {
    return null;
  }

  const transformedData: UpdateRecordingType = {
    title: recording.title,
    isrc: recording.isrc || "",
    bpm: recording.bpm || undefined,
    key: recording.key || "",
    isExplicit: recording.isExplicit,
    hasLyrics: recording.hasLyrics,
    lyrics: recording.lyrics || "",
    artistIds:
      recording.artists?.map((a) => ({
        artistId: a.artistId,
        role: a.role,
        name: a.artist?.name,
      })) || [],
  };

  return (
    <RecordingEditForm
      data={transformedData}
      recordingId={recordingId}
      audioUrl={recording.audioUrl}
      audioStatus={recording.audioProcessStatus}
    />
  );
}
