import { useState } from "react";
import { useApiUrl, useCustomMutation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/file-upload";
import { useGetTrackDetails } from "@/hooks/use-track";

interface TrackDetailsContentProps {
  trackId: string;
}

export function TrackDetailsContent({ trackId }: TrackDetailsContentProps) {
  const { data: record } = useGetTrackDetails({ trackId });
  const apiUrl = useApiUrl();
  const { mutateAsync } = useCustomMutation();
  const [uploading, setUploading] = useState(false);

  const onAudioUpload = async (url: string) => {
    if (!url) return;
    setUploading(true);
    try {
      await mutateAsync({
        url: `${apiUrl}/tracks/${record.id}/status`,
        method: "patch",
        values: { status: "UPLOADED" },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Failed to update track status.");
    } finally {
      setUploading(false);
    }
  };

  const mins = record.durationMs ? Math.floor(record.durationMs / 60000) : 0;
  const secs = record.durationMs
    ? String(Math.floor((record.durationMs % 60000) / 1000)).padStart(2, "0")
    : "00";

  return (
    <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Track Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Title</span>
              <span className="font-medium">{record.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Album</span>
              <span>{record.album?.title ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Track #</span>
              <span>{record.trackNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>
                {mins}:{secs}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Play Count</span>
              <span>{record.playCount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Release Status</span>
              <StatusBadge status={record.releaseStatus} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Audio Status</span>
              <StatusBadge status={record.audioProcessStatus} />
            </div>
            {record.isExplicit && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Explicit</span>
                <StatusBadge status="ARCHIVED" />
              </div>
            )}
            {record.isrc && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISRC</span>
                <span>{record.isrc}</span>
              </div>
            )}
            {record.bpm && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">BPM</span>
                <span>{record.bpm}</span>
              </div>
            )}
          </div>
          {record.audioProcessStatus === "PENDING_UPLOAD" ||
          !record.audioUrl ? (
            <>
              <Separator />
              <div className="space-y-4">
                <p className="text-sm font-medium text-red-500">
                  Audio Missing
                </p>
                {record.recordingId ? (
                  <FileUpload
                    accept="audio"
                    recordingId={record.recordingId}
                    onChange={onAudioUpload}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recording associated with this track.
                  </p>
                )}
              </div>
            </>
          ) : record.audioUrl ? (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Audio Preview</p>
                <audio controls className="w-full" src={record.audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {record.artists?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {record.artists.map((a: any) => (
                  <div
                    key={a.artistId}
                    className="flex justify-between text-sm"
                  >
                    <span className="font-medium">{a.artist?.name}</span>
                    <StatusBadge status={a.role} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {record.hasLyrics && record.lyrics && (
          <Card>
            <CardHeader>
              <CardTitle>Lyrics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                {record.lyrics}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
