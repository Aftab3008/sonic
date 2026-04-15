import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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
  useCreateRecording,
  useConfirmRecordingUpload,
} from "@/hooks/use-recording";
import { RecordingSelector } from "@/pages/albums/components/RecordingSelector";
import {
  ArtistSelector,
  ArtistSelection,
} from "@/pages/albums/components/ArtistSelector";
import { Music, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateTrackType } from "@/lib/schema/track.schema";
import { toast } from "sonner";

interface RecordingStepProps {
  form: UseFormReturn<CreateTrackType>;
  onRecordingSelected: (title: string) => void;
}

export function RecordingStep({
  form,
  onRecordingSelected,
}: RecordingStepProps) {
  const [creationMode, setCreationMode] = useState<"select" | "create">(
    "select",
  );
  const [createdRecordingId, setCreatedRecordingId] = useState<string | null>(
    null,
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [newRecording, setNewRecording] = useState({
    title: "",
    isrc: "",
    bpm: "",
    key: "",
    isExplicit: false,
    hasLyrics: false,
    lyrics: "",
    artists: [] as ArtistSelection[],
  });

  const createRecording = useCreateRecording();
  const confirmUpload = useConfirmRecordingUpload();

  const handleCreateRecording = async () => {
    if (!newRecording.title.trim()) return;

    try {
      const recording = await createRecording.mutateAsync({
        title: newRecording.title.trim(),
        isrc: newRecording.isrc.trim() || undefined,
        bpm: newRecording.bpm ? parseInt(newRecording.bpm) : undefined,
        key: newRecording.key.trim() || undefined,
        isExplicit: newRecording.isExplicit,
        hasLyrics: newRecording.hasLyrics,
        lyrics: newRecording.lyrics.trim() || undefined,
        artistIds: newRecording.artists.length
          ? newRecording.artists.map((a) => ({
              artistId: a.artistId,
              role: a.role,
            }))
          : undefined,
      });

      setCreatedRecordingId(recording.id);
      onRecordingSelected(recording.title);
      form.setValue("recordingId", recording.id);
      toast.success("Recording created! Upload audio now or continue.");
    } catch {
      toast.error("Failed to create recording");
    }
  };

  const handleAudioUploaded = async (
    url: string,
    metadata?: { duration?: number },
  ) => {
    if (!url || !createdRecordingId) return;

    setAudioUrl(url);
    try {
      await confirmUpload.mutateAsync({
        recordingId: createdRecordingId,
        sourceAudioUrl: url,
        durationMs: metadata?.duration,
      });
      toast.success("Audio uploaded and processing started!");
    } catch {
      toast.error("Failed to associate audio with recording");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Step 1: Select or Create Recording
        </CardTitle>
        <CardDescription>
          Choose an existing recording or create a new one with audio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={creationMode === "select" ? "default" : "outline"}
            size="sm"
            onClick={() => setCreationMode("select")}
            disabled={!!createdRecordingId}
          >
            Select Existing
          </Button>
          <Button
            type="button"
            variant={creationMode === "create" ? "default" : "outline"}
            size="sm"
            onClick={() => setCreationMode("create")}
            disabled={!!createdRecordingId}
          >
            Create New
          </Button>
        </div>

        {creationMode === "select" && !createdRecordingId && (
          <FormField
            control={form.control}
            name="recordingId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Select Recording</FormLabel>
                <FormControl>
                  <RecordingSelector
                    value={field.value}
                    onChange={(id, title) => {
                      field.onChange(id);
                      onRecordingSelected(title);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {creationMode === "create" && (
          <div className="space-y-4">
            {!createdRecordingId ? (
              <>
                <div className="space-y-2">
                  <FormLabel>Recording Title *</FormLabel>
                  <Input
                    value={newRecording.title}
                    onChange={(e) =>
                      setNewRecording({
                        ...newRecording,
                        title: e.target.value,
                      })
                    }
                    placeholder="Recording title"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <FormLabel>ISRC</FormLabel>
                    <Input
                      value={newRecording.isrc}
                      onChange={(e) =>
                        setNewRecording({
                          ...newRecording,
                          isrc: e.target.value,
                        })
                      }
                      placeholder="e.g. USRC17607839"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>BPM</FormLabel>
                    <Input
                      type="number"
                      value={newRecording.bpm}
                      onChange={(e) =>
                        setNewRecording({
                          ...newRecording,
                          bpm: e.target.value,
                        })
                      }
                      placeholder="e.g. 120"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Musical Key</FormLabel>
                    <Input
                      value={newRecording.key}
                      onChange={(e) =>
                        setNewRecording({
                          ...newRecording,
                          key: e.target.value,
                        })
                      }
                      placeholder="e.g. C Major"
                    />
                  </div>
                </div>

                <div className="flex gap-8">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={newRecording.isExplicit}
                      onCheckedChange={(checked) =>
                        setNewRecording({
                          ...newRecording,
                          isExplicit: checked,
                        })
                      }
                    />
                    <FormLabel>Explicit</FormLabel>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={newRecording.hasLyrics}
                      onCheckedChange={(checked) =>
                        setNewRecording({ ...newRecording, hasLyrics: checked })
                      }
                    />
                    <FormLabel>Has Lyrics</FormLabel>
                  </div>
                </div>

                {newRecording.hasLyrics && (
                  <div className="space-y-2">
                    <FormLabel>Lyrics</FormLabel>
                    <Textarea
                      value={newRecording.lyrics}
                      onChange={(e) =>
                        setNewRecording({
                          ...newRecording,
                          lyrics: e.target.value,
                        })
                      }
                      placeholder="Enter lyrics..."
                      rows={4}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <FormLabel>Recording Artists</FormLabel>
                  <ArtistSelector
                    value={newRecording.artists}
                    onChange={(artists) =>
                      setNewRecording({ ...newRecording, artists })
                    }
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleCreateRecording}
                  disabled={
                    createRecording.isPending || !newRecording.title.trim()
                  }
                >
                  {createRecording.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Recording...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Recording
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    ✓ Recording created
                  </p>
                </div>
                <div className="space-y-2">
                  <FormLabel>Upload Audio (Optional)</FormLabel>
                  <FileUpload
                    accept="audio"
                    recordingId={createdRecordingId}
                    value={audioUrl || undefined}
                    onChange={handleAudioUploaded}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
