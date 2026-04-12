import { useForm } from "@refinedev/react-hook-form";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { StatusBadge } from "@/components/status-badge";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { Loader2, Save } from "lucide-react";
import { useUpdateRecordingAudio } from "@/hooks/use-recording";
import { toast } from "sonner";

export function RecordingEdit() {
  const {
    refineCore: { onFinish, formLoading, query },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    refineCoreProps: { resource: "recordings", action: "edit" },
  });

  const updateAudio = useUpdateRecordingAudio();
  const recordingId = query?.data?.data?.id as string | undefined;
  const currentStatus = watch("audioProcessStatus");

  const handleOnFinish = (values: any) => {
    const artists = values.artistIds?.map((a: any) => ({
      artistId: a.artistId,
      role: a.role,
    }));

    onFinish({
      title: values.title,
      isrc: values.isrc || undefined,
      bpm: values.bpm ? parseInt(values.bpm) : undefined,
      key: values.key || undefined,
      isExplicit: values.isExplicit,
      hasLyrics: values.hasLyrics,
      lyrics: values.lyrics || undefined,
      artistIds: artists,
    });
  };

  const handleAudioUploaded = async (
    url: string,
    metadata?: { duration?: number },
  ) => {
    if (!url || !recordingId) return;

    try {
      await updateAudio.mutateAsync({
        recordingId,
        audioUrl: url,
        durationMs: metadata?.duration || 0,
      });
      setValue("audioUrl", url);
      setValue("audioProcessStatus", "UPLOADED");
      toast.success("Audio uploaded successfully!");
    } catch {
      toast.error("Failed to update recording with audio");
    }
  };

  return (
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(handleOnFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="Recording title"
                />
              </div>
              <div className="space-y-2">
                <Label>ISRC</Label>
                <Input
                  {...register("isrc")}
                  placeholder="e.g. USRC17607839"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>BPM</Label>
                <Input
                  type="number"
                  min={1}
                  max={300}
                  {...register("bpm")}
                  placeholder="e.g. 120"
                />
              </div>
              <div className="space-y-2">
                <Label>Musical Key</Label>
                <Input {...register("key")} placeholder="e.g. C Major" />
              </div>
              <div className="space-y-2">
                <Label>Audio Status</Label>
                <div className="pt-2">
                  {currentStatus ? (
                    <StatusBadge status={currentStatus} />
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  checked={watch("isExplicit") || false}
                  onCheckedChange={(v) => setValue("isExplicit", v)}
                />
                <Label>Explicit Content</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={watch("hasLyrics") || false}
                  onCheckedChange={(v) => setValue("hasLyrics", v)}
                />
                <Label>Has Lyrics</Label>
              </div>
            </div>

            {watch("hasLyrics") && (
              <div className="space-y-2">
                <Label>Lyrics</Label>
                <Textarea
                  {...register("lyrics")}
                  placeholder="Enter lyrics..."
                  rows={6}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Artists</Label>
              <ArtistSelector
                value={
                  watch("artists")?.map((a: any) => ({
                    artistId: a.artistId || a.artist?.id,
                    role: a.role,
                    name: a.name || a.artist?.name,
                  })) || []
                }
                onChange={(val) => setValue("artistIds", val)}
              />
            </div>

            <div className="space-y-2">
              <Label>Audio File</Label>
              {recordingId ? (
                <FileUpload
                  accept="audio"
                  recordingId={recordingId as string}
                  value={watch("audioUrl")}
                  onChange={handleAudioUploaded}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Save the recording first to enable audio upload.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}>
            {formLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Recording
              </>
            )}
          </Button>
        </div>
      </form>
    </EditView>
  );
}
