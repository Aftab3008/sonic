import { FileUpload } from "@/components/file-upload";
import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateRecording,
  useUpdateRecordingAudio,
} from "@/hooks/use-recording";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import {
  ArrowLeft,
  ArrowRight,
  FileAudio,
  Loader2,
  Music,
  Save,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const STEPS = [
  { id: "metadata", title: "Recording Details", icon: Music },
  { id: "artists", title: "Artists", icon: Users },
  { id: "audio", title: "Upload Audio", icon: FileAudio },
] as const;

export function RecordingCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [title, setTitle] = useState("");
  const [isrc, setIsrc] = useState("");
  const [bpm, setBpm] = useState("");
  const [musicalKey, setMusicalKey] = useState("");
  const [isExplicit, setIsExplicit] = useState(false);
  const [hasLyrics, setHasLyrics] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [artistIds, setArtistIds] = useState<
    { artistId: string; role: "PRIMARY" | "FEATURED" | "PRODUCER"; name?: string }[]
  >([]);

  // Created recording state (after Step 2 submit)
  const [createdRecordingId, setCreatedRecordingId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const createRecording = useCreateRecording();
  const updateRecordingAudio = useUpdateRecordingAudio();

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return title.trim().length > 0;
      case 1:
        return true; // Artists are optional for recordings
      case 2:
        return !!createdRecordingId;
      default:
        return false;
    }
  };

  /**
   * When moving from Step 2 → Step 3, create the recording in the DB.
   * This gives us the recording ID needed for audio upload.
   */
  const handleCreateAndContinue = async () => {
    try {
      const recording = await createRecording.mutateAsync({
        title: title.trim(),
        isrc: isrc.trim() || undefined,
        bpm: bpm ? parseInt(bpm) : undefined,
        key: musicalKey.trim() || undefined,
        isExplicit,
        hasLyrics,
        lyrics: lyrics.trim() || undefined,
        artistIds: artistIds.length
          ? artistIds.map((a) => ({ artistId: a.artistId, role: a.role }))
          : undefined,
      });

      setCreatedRecordingId(recording.id);
      setCurrentStep(2);
      toast.success("Recording created! Now upload the audio file.");
    } catch {
      toast.error("Failed to create recording");
    }
  };

  /**
   * After audio is uploaded via the FileUpload component,
   * update the recording with the audio URL and duration.
   */
  const handleAudioUploaded = async (
    url: string,
    metadata?: { duration?: number },
  ) => {
    if (!url || !createdRecordingId) return;

    setAudioUrl(url);

    try {
      await updateRecordingAudio.mutateAsync({
        recordingId: createdRecordingId,
        audioUrl: url,
        durationMs: metadata?.duration || 0,
      });
      toast.success("Audio uploaded and linked to recording!");
    } catch {
      toast.error("Audio uploaded to S3 but failed to update recording");
    }
  };

  const handleFinish = () => {
    navigate("/recordings");
  };

  return (
    <CreateView>
      <CreateViewHeader />
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isComplete
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-border mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Step 1: Recording Details
            </CardTitle>
            <CardDescription>
              Enter the canonical metadata for this recording
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Recording title"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>ISRC</Label>
                <Input
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  placeholder="e.g. USRC17607839"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  International Standard Recording Code
                </p>
              </div>
              <div className="space-y-2">
                <Label>BPM</Label>
                <Input
                  type="number"
                  min={1}
                  max={300}
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                  placeholder="e.g. 120"
                />
              </div>
              <div className="space-y-2">
                <Label>Musical Key</Label>
                <Input
                  value={musicalKey}
                  onChange={(e) => setMusicalKey(e.target.value)}
                  placeholder="e.g. C Major"
                />
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  id="isExplicit"
                  checked={isExplicit}
                  onCheckedChange={setIsExplicit}
                />
                <Label htmlFor="isExplicit">Explicit Content</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="hasLyrics"
                  checked={hasLyrics}
                  onCheckedChange={setHasLyrics}
                />
                <Label htmlFor="hasLyrics">Has Lyrics</Label>
              </div>
            </div>

            {hasLyrics && (
              <div className="space-y-2">
                <Label>Lyrics</Label>
                <Textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Enter lyrics..."
                  rows={6}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Step 2: Recording Artists
            </CardTitle>
            <CardDescription>
              Select the artists who performed on this recording
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ArtistSelector value={artistIds} onChange={setArtistIds} />
            {artistIds.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No artists selected. You can add artists later.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Step 3: Upload Audio
            </CardTitle>
            <CardDescription>
              {createdRecordingId
                ? "Upload the audio file for this recording"
                : "The recording will be created first, then you can upload audio"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary of what was created */}
            <div className="rounded-md border p-4 space-y-2">
              <h4 className="font-semibold">Recording Summary</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">Title:</span>{" "}
                  {title}
                </div>
                {isrc && (
                  <div>
                    <span className="text-muted-foreground">ISRC:</span>{" "}
                    <span className="font-mono">{isrc}</span>
                  </div>
                )}
                {bpm && (
                  <div>
                    <span className="text-muted-foreground">BPM:</span> {bpm}
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Artists:</span>{" "}
                  {artistIds.length > 0
                    ? artistIds.map((a) => a.name).join(", ")
                    : "None"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Flags:</span>
                  {isExplicit && <Badge variant="destructive">Explicit</Badge>}
                  {hasLyrics && <Badge variant="secondary">Has Lyrics</Badge>}
                  {!isExplicit && !hasLyrics && (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </div>

            {createdRecordingId ? (
              <div className="space-y-4">
                <FileUpload
                  accept="audio"
                  recordingId={createdRecordingId}
                  value={audioUrl || undefined}
                  onChange={handleAudioUploaded}
                />
                {audioUrl && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✓ Audio uploaded successfully
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p>Creating recording...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0 || currentStep === 2}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < STEPS.length - 1 ? (
          currentStep === 1 ? (
            <Button
              type="button"
              onClick={handleCreateAndContinue}
              disabled={!canProceed() || createRecording.isPending}
            >
              {createRecording.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Recording...
                </>
              ) : (
                <>
                  Create Recording & Upload Audio
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )
        ) : (
          <Button type="button" onClick={handleFinish}>
            <Save className="h-4 w-4 mr-2" />
            {audioUrl ? "Done" : "Skip Audio & Finish"}
          </Button>
        )}
      </div>
    </CreateView>
  );
}
