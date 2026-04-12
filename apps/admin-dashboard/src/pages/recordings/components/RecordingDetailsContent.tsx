import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { Clock, FileAudio, Music, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetRecordingDetails } from "@/hooks/use-recording";

interface RecordingDetailsContentProps {
  recordingId: string;
}

function formatDuration(ms?: number): string {
  if (!ms) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RecordingDetailsContent({
  recordingId,
}: RecordingDetailsContentProps) {
  const navigate = useNavigate();
  const { data: recording } = useGetRecordingDetails({ recordingId });

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Recording Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium text-lg">{recording.title}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Status:</p>
            <StatusBadge status={recording.audioProcessStatus} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(recording.durationMs)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ISRC</p>
              <p className="font-mono text-sm">{recording.isrc || "—"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">BPM</p>
              <p className="font-medium">{recording.bpm || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Key</p>
              <p className="font-medium">{recording.key || "—"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {recording.isExplicit && (
              <Badge variant="destructive">Explicit</Badge>
            )}
            {recording.hasLyrics && (
              <Badge variant="secondary">Has Lyrics</Badge>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm">
              {new Date(recording.createdAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {recording.audioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio
                controls
                className="w-full"
                src={recording.audioUrl}
                preload="metadata"
              >
                Your browser does not support the audio element.
              </audio>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">File Size</p>
                  <p>{formatFileSize(recording.fileSize)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Codec</p>
                  <p>{recording.codec || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bitrate</p>
                  <p>
                    {recording.bitrate
                      ? `${Math.round(recording.bitrate / 1000)} kbps`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sample Rate</p>
                  <p>
                    {recording.sampleRate ? `${recording.sampleRate} Hz` : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Artists ({recording.artists?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recording.artists && recording.artists.length > 0 ? (
              <div className="space-y-2">
                {recording.artists.map((ra: any) => (
                  <div
                    key={`${ra.recordingId}-${ra.artistId}-${ra.role}`}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <span className="font-medium">
                      {ra.artist?.name || "Unknown"}
                    </span>
                    <Badge variant="outline">{ra.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No artists assigned
              </p>
            )}
          </CardContent>
        </Card>

        {recording.tracks && recording.tracks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Used in Tracks ({recording.tracks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recording.tracks.map((track: any) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate(`/tracks/show/${track.id}`)}
                  >
                    <div>
                      <span className="font-medium">
                        {track.overrideTitle || recording.title}
                      </span>
                      {track.album && (
                        <span className="text-sm text-muted-foreground ml-2">
                          in {track.album.title}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Track #{track.trackNumber}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recording.hasLyrics && recording.lyrics && (
          <Card>
            <CardHeader>
              <CardTitle>Lyrics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                {recording.lyrics}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
