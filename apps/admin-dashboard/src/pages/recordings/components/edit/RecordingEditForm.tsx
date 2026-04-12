import { FileUpload } from "@/components/file-upload";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateRecording,
  useUpdateRecordingAudio,
} from "@/hooks/use-recording";
import {
  UpdateRecordingSchema,
  UpdateRecordingType,
} from "@/lib/schema/recording.schema";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface RecordingEditFormProps {
  data: UpdateRecordingType;
  recordingId: string;
  audioUrl?: string;
  audioStatus: string;
}

export function RecordingEditForm({
  data,
  recordingId,
  audioUrl,
  audioStatus,
}: RecordingEditFormProps) {
  const navigate = useNavigate();
  const updateRecording = useUpdateRecording();
  const updateAudio = useUpdateRecordingAudio();

  const form = useForm({
    resolver: zodResolver(UpdateRecordingSchema),
    defaultValues: {
      title: data.title,
      isrc: data.isrc,
      bpm: data.bpm,
      key: data.key,
      isExplicit: data.isExplicit,
      hasLyrics: data.hasLyrics,
      lyrics: data.lyrics,
      artistIds: data.artistIds,
    },
  });

  const { isSubmitting } = form.formState;

  const handleOnFinish = async (values: UpdateRecordingType) => {
    try {
      await updateRecording.mutateAsync(
        { id: recordingId, data: values },
        {
          onSuccess: () => {
            toast.success("Recording updated successfully");
            navigate("/recordings");
          },
          onError: () => {
            toast.error("Failed to update recording");
          },
        },
      );
    } catch {
      console.error("Failed to update recording");
    }
  };

  const handleAudioUploaded = async (
    url: string,
    metadata?: { duration?: number },
  ) => {
    if (!url) {
      return;
    }

    try {
      await updateAudio.mutateAsync(
        {
          recordingId,
          audioUrl: url,
          durationMs: metadata?.duration || 0,
        },
        {
          onSuccess: () => {
            toast.success("Audio uploaded successfully!");
          },
          onError: () => {
            toast.error("Failed to update recording with audio");
          },
        },
      );
    } catch {
      console.error("Failed to update recording with audio");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Recording title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISRC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. USRC17607839"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="bpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BPM</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 120"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Musical Key</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. C Major" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Audio Status</FormLabel>
                <div className="pt-2">
                  <StatusBadge status={audioStatus as any} />
                </div>
              </FormItem>
            </div>

            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="isExplicit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Explicit Content</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasLyrics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Has Lyrics</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("hasLyrics") && (
              <FormField
                control={form.control}
                name="lyrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lyrics</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter lyrics..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="artistIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artists</FormLabel>
                  <FormControl>
                    <ArtistSelector
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Audio File</FormLabel>
              <FileUpload
                accept="audio"
                recordingId={recordingId}
                value={audioUrl || ""}
                onChange={handleAudioUploaded}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
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
    </Form>
  );
}
