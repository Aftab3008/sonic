import { useState } from "react";
import { useShow, useApiUrl, useCustomMutation } from "@refinedev/core";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrackShow() {
  const { query } = useShow({ resource: "tracks" });
  const record = query?.data?.data as any;
  const apiUrl = useApiUrl();
  const { mutateAsync } = useCustomMutation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!record) return null;

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const { data: urlData } = await mutateAsync({
        url: `${apiUrl}/tracks/${record.id}/upload-url`,
        method: "post",
        values: { filename: file.name, contentType: file.type }
      });
      
      await fetch(urlData.data.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      
      await mutateAsync({
        url: `${apiUrl}/tracks/${record.id}/status`,
        method: "patch",
        values: { status: "UPLOADED" }
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Upload failed. Disallow ad-blockers and ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const mins = record.durationMs ? Math.floor(record.durationMs / 60000) : 0;
  const secs = record.durationMs ? String(Math.floor((record.durationMs % 60000) / 1000)).padStart(2, "0") : "00";

  return (
    <ShowView>
      <ShowViewHeader />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Track Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span className="font-medium">{record.title}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Album</span><span>{record.album?.title ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Track #</span><span>{record.trackNumber}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{mins}:{secs}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Play Count</span><span>{record.playCount?.toLocaleString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Release Status</span><StatusBadge status={record.releaseStatus} /></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Audio Status</span><StatusBadge status={record.audioProcessStatus} /></div>
              {record.isExplicit && <div className="flex justify-between items-center"><span className="text-muted-foreground">Explicit</span><StatusBadge status="ARCHIVED" /></div>}
              {record.isrc && <div className="flex justify-between"><span className="text-muted-foreground">ISRC</span><span>{record.isrc}</span></div>}
              {record.bpm && <div className="flex justify-between"><span className="text-muted-foreground">BPM</span><span>{record.bpm}</span></div>}
            </div>
            {(record.audioProcessStatus === 'PENDING_UPLOAD' || !record.audioUrl) ? (
              <>
                <Separator />
                <div className="space-y-4">
                  <p className="text-sm font-medium text-red-500">Audio Missing</p>
                  <div className="flex flex-col gap-2">
                    <Input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Button onClick={handleUpload} disabled={!file || uploading}>
                      {uploading ? "Uploading..." : "Upload Track Audio"}
                    </Button>
                  </div>
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
              <CardHeader><CardTitle>Artists</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {record.artists.map((a: any) => (
                    <div key={a.artistId} className="flex justify-between text-sm">
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
              <CardHeader><CardTitle>Lyrics</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{record.lyrics}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ShowView>
  );
}
