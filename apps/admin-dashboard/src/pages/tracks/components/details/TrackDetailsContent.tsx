import { FileUpload } from "@/components/file-upload";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUpdateRecordingAudio } from "@/hooks/use-recording";
import { useGetTrackDetails } from "@/hooks/use-track";
import { trackKeys } from "@/lib/react-query/query-keys";
import { TrackArtist } from "@/types/admin.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface TrackDetailsContentProps {
  trackId: string;
}

export function TrackDetailsContent({ trackId }: TrackDetailsContentProps) {
  const queryClient = useQueryClient();
  const { data: track } = useGetTrackDetails({ trackId });
  const updateRecordingAudio = useUpdateRecordingAudio();
  const [uploading, setUploading] = useState(false);
  console.log("Track details data:", track);

  if (!track) {
    return null;
  }

  const onAudioUpload = async (
    url: string,
    metadata?: { duration?: number },
  ) => {
    if (!url || !track.recordingId) {
      return;
    }
    setUploading(true);
    try {
      await updateRecordingAudio.mutateAsync({
        recordingId: track.recordingId,
        audioUrl: url,
        durationMs: metadata?.duration || 0,
      });
      toast.success("Audio updated successfully!");
      queryClient.invalidateQueries({ queryKey: trackKeys.details(trackId) });
    } catch (e) {
      console.error(e);
      toast.error("Failed to update track audio.");
    } finally {
      setUploading(false);
    }
  };

  const recording = track.recording;
  const displayTitle =
    track.overrideTitle || recording?.title || "Untitled Track";
  const isExplicit = track.overrideIsExplicit ?? recording?.isExplicit ?? false;
  const durationMs = recording?.durationMs || 0;

  const mins = Math.floor(durationMs / 60000);
  const secs = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Track Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Display Title</span>
              <span className="font-medium">{displayTitle}</span>
            </div>
            {track.overrideTitle && (
              <div className="flex justify-between text-xs italic text-muted-foreground">
                <span>Original Recording Title</span>
                <span>{recording?.title || "—"}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Album</span>
              <span>{track.album?.title ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Track #</span>
              <span>
                {track.trackNumber} (Disc {track.discNumber})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>
                {mins}:{secs}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Play Count</span>
              <span>{track.playCount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Explicit</span>
              <StatusBadge status={isExplicit ? "ARCHIVED" : "PUBLISHED"} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Audio Status</span>
              <StatusBadge
                status={recording?.audioProcessStatus || "PENDING_UPLOAD"}
              />
            </div>
            {recording?.isrc && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISRC</span>
                <span className="font-mono">{recording.isrc}</span>
              </div>
            )}
          </div>

          {!recording?.audioUrl ? (
            <>
              <Separator />
              <div className="space-y-4">
                <p className="text-sm font-medium text-destructive">
                  Audio Missing
                </p>
                <FileUpload
                  accept="audio"
                  recordingId={track.recordingId}
                  onChange={onAudioUpload}
                />
              </div>
            </>
          ) : (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Audio Preview</p>
                <audio controls className="w-full" src={recording.audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {track.artists && track.artists.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {track.artists.map((a: TrackArtist) => (
                  <div
                    key={a.artistId}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-medium">{a.artist?.name}</span>
                    <StatusBadge status={a.role} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recording?.hasLyrics && recording.lyrics && (
          <Card>
            <CardHeader>
              <CardTitle>Lyrics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans bg-muted/30 p-4 rounded-md border">
                {recording.lyrics}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
