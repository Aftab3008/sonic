import { FileUpload } from "@/components/file-upload";
import { StatusBadge } from "@/components/status-badge";
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
  useCreateRecording,
  useConfirmRecordingUpload,
} from "@/hooks/use-recording";
import {
  CreateRecordingSchema,
  CreateRecordingType,
} from "@/lib/schema/recording.schema";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { STEPS } from "../../constants/steps";

export function RecordingCreateForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [createdRecordingId, setCreatedRecordingId] = useState<string | null>(
    null,
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioProcessStatus, setAudioProcessStatus] = useState<
    "PENDING_UPLOAD" | "UPLOADED" | "PROCESSING" | "SUCCEEDED" | "FAILED"
  >("PENDING_UPLOAD");

  const createRecording = useCreateRecording();
  const confirmUpload = useConfirmRecordingUpload();

  const form = useForm<CreateRecordingType>({
    resolver: zodResolver(CreateRecordingSchema),
    defaultValues: {
      title: "",
      isrc: "",
      bpm: undefined,
      key: "",
      isExplicit: false,
      hasLyrics: false,
      lyrics: "",
      artistIds: [],
    },
  });

  const { isSubmitting } = form.formState;

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

  const handleCreateAndContinue = async (values: CreateRecordingType) => {
    try {
      const recording = await createRecording.mutateAsync(values);
      setCreatedRecordingId(recording.id);
      setCurrentStep(2);
      toast.success("Recording created! Now upload the audio file.");
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
      setAudioProcessStatus("UPLOADED");
      toast.success("Audio uploaded and processing started!");
    } catch {
      toast.error("Audio uploaded to S3 but failed to update recording");
    }
  };

  const handleFinish = () => {
    navigate("/recordings");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!form.watch("title")?.trim();
      case 1:
        return true;
      case 2:
        return !!createdRecordingId;
      default:
        return false;
    }
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

      <Form {...form}>
        <form className="space-y-6">
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

                <div className="grid gap-4 md:grid-cols-3">
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
                <FormField
                  control={form.control}
                  name="artistIds"
                  render={({ field }) => (
                    <FormItem>
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
                <div className="rounded-md border p-4 space-y-2">
                  <h4 className="font-semibold">Recording Summary</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-muted-foreground">Title:</span>{" "}
                      {form.getValues("title")}
                    </div>
                    {form.getValues("isrc") && (
                      <div>
                        <span className="text-muted-foreground">ISRC:</span>{" "}
                        <span className="font-mono">
                          {form.getValues("isrc")}
                        </span>
                      </div>
                    )}
                    {form.getValues("bpm") && (
                      <div>
                        <span className="text-muted-foreground">BPM:</span>{" "}
                        {form.getValues("bpm")}
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Artists:</span>{" "}
                      {form.getValues("artistIds") &&
                      form.getValues("artistIds")!.length > 0
                        ? form
                            .getValues("artistIds")!
                            .map((a) => a.name)
                            .join(", ")
                        : "None"}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Flags:</span>
                      {form.getValues("isExplicit") && (
                        <Badge variant="destructive">Explicit</Badge>
                      )}
                      {form.getValues("hasLyrics") && (
                        <Badge variant="secondary">Has Lyrics</Badge>
                      )}
                      {!form.getValues("isExplicit") &&
                        !form.getValues("hasLyrics") && (
                          <span className="text-muted-foreground">None</span>
                        )}
                    </div>
                  </div>
                </div>

                {createdRecordingId ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {/* <StatusBadge status={audioStatus} /> */}
                    </div>
                    <FileUpload
                      accept="audio"
                      recordingId={createdRecordingId}
                      value={audioUrl || undefined}
                      processStatus={audioProcessStatus}
                      onChange={handleAudioUploaded}
                    />
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
                  onClick={form.handleSubmit(handleCreateAndContinue)}
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
        </form>
      </Form>
    </CreateView>
  );
}
