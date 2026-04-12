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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetAlbumArtists, useGetAlbums } from "@/hooks/use-album";
import {
  useCreateRecording,
  useUpdateRecordingAudio,
} from "@/hooks/use-recording";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { RecordingSelector } from "@/pages/albums/components/RecordingSelector";
import { useForm } from "@refinedev/react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Disc,
  Loader2,
  Music,
  Save,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STEPS = [
  { id: "recording", title: "Audio Recording", icon: Music },
  { id: "album", title: "Album Context", icon: Disc },
  { id: "artists", title: "Track Artists", icon: Users },
  { id: "metadata", title: "Final Details", icon: Save },
] as const;

export function TrackCreate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(
    null,
  );
  const [selectedRecordingTitle, setSelectedRecordingTitle] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const [creationMode, setCreationMode] = useState<"select" | "create">(
    "select",
  );
  const [newRecordingTitle, setNewRecordingTitle] = useState("");
  const [newRecordingIsrc, setNewRecordingIsrc] = useState("");
  const [newRecordingBpm, setNewRecordingBpm] = useState("");
  const [newRecordingKey, setNewRecordingKey] = useState("");
  const [newRecordingIsExplicit, setNewRecordingIsExplicit] = useState(false);
  const [newRecordingHasLyrics, setNewRecordingHasLyrics] = useState(false);
  const [newRecordingLyrics, setNewRecordingLyrics] = useState("");
  const [newRecordingArtists, setNewRecordingArtists] = useState<
    {
      artistId: string;
      role: "PRIMARY" | "FEATURED" | "PRODUCER";
      name?: string;
    }[]
  >([]);
  const [createdRecordingId, setCreatedRecordingId] = useState<string | null>(
    null,
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { data: albums, isLoading: isLoadingAlbums } = useGetAlbums({
    pageSize: 100,
  });
  const { data: albumArtists, isLoading: isLoadingArtists } =
    useGetAlbumArtists(selectedAlbumId, {
      enabled: currentStep >= 2 && !!selectedAlbumId,
    });

  const createRecording = useCreateRecording();
  const updateRecordingAudio = useUpdateRecordingAudio();

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    refineCoreProps: {
      resource: "tracks",
      action: "create",
    },
    defaultValues: {
      recordingId: "",
      albumId: "",
      trackNumber: 1,
      discNumber: 1,
      artistIds: [] as any[],
      overrideTitle: "",
      coverImageUrl: "",
    },
  });

  useEffect(() => {
    if (albumArtists && albumArtists.length > 0 && currentStep === 2) {
      const inheritedArtists = albumArtists.map((a) => ({
        artistId: a.artistId,
        role: a.role,
        name: a.artist?.name,
      }));
      setValue("artistIds", inheritedArtists);
    }
  }, [albumArtists, currentStep, setValue]);

  const handleSelectRecording = (recordingId: string, title: string) => {
    setSelectedRecordingId(recordingId);
    setSelectedRecordingTitle(title);
    setValue("recordingId", recordingId);
  };

  /**
   * Create the recording in the DB first, then allow audio upload
   */
  const handleCreateRecording = async () => {
    if (!newRecordingTitle.trim()) return;

    try {
      const recording = await createRecording.mutateAsync({
        title: newRecordingTitle.trim(),
        isrc: newRecordingIsrc.trim() || undefined,
        bpm: newRecordingBpm ? parseInt(newRecordingBpm) : undefined,
        key: newRecordingKey.trim() || undefined,
        isExplicit: newRecordingIsExplicit,
        hasLyrics: newRecordingHasLyrics,
        lyrics: newRecordingLyrics.trim() || undefined,
        artistIds: newRecordingArtists.length
          ? newRecordingArtists.map((a) => ({
              artistId: a.artistId,
              role: a.role,
            }))
          : undefined,
      });

      setCreatedRecordingId(recording.id);
      setSelectedRecordingId(recording.id);
      setSelectedRecordingTitle(recording.title);
      setValue("recordingId", recording.id);
      toast.success("Recording created! Upload audio now or continue.");
    } catch {
      toast.error("Failed to create recording");
    }
  };

  /**
   * After audio is uploaded, update the recording with URL and duration
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
      toast.success("Audio uploaded successfully!");
    } catch {
      toast.error("Failed to associate audio with recording");
    }
  };

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setValue("albumId", albumId);
  };

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

  const onSubmit = (values: any) => {
    onFinish({
      recordingId: values.recordingId,
      albumId: values.albumId,
      trackNumber: parseInt(values.trackNumber),
      discNumber: parseInt(values.discNumber) || 1,
      artistIds: values.artistIds?.map((a: any) => ({
        artistId: a.artistId,
        role: a.role,
      })),
      overrideTitle: values.overrideTitle || undefined,
      coverImageUrl: values.coverImageUrl || undefined,
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!selectedRecordingId;
      case 1:
        return !!selectedAlbumId;
      case 2:
        return watch("artistIds")?.length > 0;
      case 3:
        return !!watch("trackNumber");
      default:
        return false;
    }
  };

  const selectedAlbum = albums?.data?.find(
    (a: any) => a.id === selectedAlbumId,
  );

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 0 && (
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
              {/* Mode toggle */}
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

              {/* Select existing recording */}
              {creationMode === "select" && !createdRecordingId && (
                <div className="space-y-2">
                  <Label>Select Recording</Label>
                  <RecordingSelector
                    value={selectedRecordingId}
                    onChange={handleSelectRecording}
                  />
                  {selectedRecordingId && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">
                        Selected: {selectedRecordingTitle}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {creationMode === "create" && (
                <div className="space-y-4">
                  {!createdRecordingId ? (
                    <>
                      <div className="space-y-2">
                        <Label>Recording Title *</Label>
                        <Input
                          value={newRecordingTitle}
                          onChange={(e) => setNewRecordingTitle(e.target.value)}
                          placeholder="Recording title"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>ISRC</Label>
                          <Input
                            value={newRecordingIsrc}
                            onChange={(e) =>
                              setNewRecordingIsrc(e.target.value)
                            }
                            placeholder="e.g. USRC17607839"
                            className="font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>BPM</Label>
                          <Input
                            type="number"
                            value={newRecordingBpm}
                            onChange={(e) => setNewRecordingBpm(e.target.value)}
                            placeholder="e.g. 120"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Musical Key</Label>
                          <Input
                            value={newRecordingKey}
                            onChange={(e) => setNewRecordingKey(e.target.value)}
                            placeholder="e.g. C Major"
                          />
                        </div>
                      </div>

                      <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={newRecordingIsExplicit}
                            onCheckedChange={setNewRecordingIsExplicit}
                          />
                          <Label>Explicit</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={newRecordingHasLyrics}
                            onCheckedChange={setNewRecordingHasLyrics}
                          />
                          <Label>Has Lyrics</Label>
                        </div>
                      </div>

                      {newRecordingHasLyrics && (
                        <div className="space-y-2">
                          <Label>Lyrics</Label>
                          <Textarea
                            value={newRecordingLyrics}
                            onChange={(e) =>
                              setNewRecordingLyrics(e.target.value)
                            }
                            placeholder="Enter lyrics..."
                            rows={4}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Recording Artists</Label>
                        <ArtistSelector
                          value={newRecordingArtists}
                          onChange={setNewRecordingArtists}
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleCreateRecording}
                        disabled={
                          createRecording.isPending || !newRecordingTitle.trim()
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
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                          ✓ Recording "{selectedRecordingTitle}" created
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Audio (Optional)</Label>
                        <FileUpload
                          accept="audio"
                          recordingId={createdRecordingId}
                          value={audioUrl || undefined}
                          onChange={handleAudioUploaded}
                        />
                      </div>

                      {audioUrl && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            ✓ Audio uploaded successfully
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Album */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc className="h-5 w-5" />
                Step 2: Select Album
              </CardTitle>
              <CardDescription>
                Choose which album this track belongs to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Album *</Label>
                <Select
                  value={selectedAlbumId || ""}
                  onValueChange={handleSelectAlbum}
                >
                  <SelectTrigger>
                    {isLoadingAlbums ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading albums...
                      </span>
                    ) : (
                      <SelectValue placeholder="Select album..." />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {!albums?.data?.length && !isLoadingAlbums && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No albums found. Please create an album first.
                      </div>
                    )}
                    {albums?.data?.map((album: any) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedAlbumId && selectedAlbum && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Selected: {selectedAlbum.title}
                    </p>
                  </div>
                )}
              </div>

              {selectedAlbumId && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Track Number *</Label>
                    <Input
                      type="number"
                      min={1}
                      {...register("trackNumber", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Disc Number</Label>
                    <Input
                      type="number"
                      min={1}
                      defaultValue={1}
                      {...register("discNumber")}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Artists */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 3: Track Artists
              </CardTitle>
              <CardDescription>
                Artists are auto-populated from the album. Edit to add featured
                artists or modify roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingArtists && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading album artists...</span>
                </div>
              )}

              {!isLoadingArtists && albumArtists && albumArtists.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Inherited from Album
                  </Label>
                  <div className="rounded-md border bg-muted/50 p-4 space-y-2">
                    {albumArtists.map((artist) => (
                      <div
                        key={artist.artistId}
                        className="flex items-center gap-2"
                      >
                        <span className="font-medium">
                          {artist.artist?.name}
                        </span>
                        <Badge variant="secondary">{artist.role}</Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These artists are inherited from the album. You can modify
                    them below.
                  </p>
                </div>
              )}

              {!isLoadingArtists &&
                (!albumArtists || albumArtists.length === 0) && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      No artists found for this album. Please add artists to the
                      album first, or manually add artists below.
                    </p>
                  </div>
                )}

              <div className="space-y-2">
                <Label>Track Artists *</Label>
                <ArtistSelector
                  value={watch("artistIds") || []}
                  onChange={(val) => setValue("artistIds", val)}
                />
                {watch("artistIds")?.length === 0 && (
                  <p className="text-xs text-destructive">
                    At least one artist is required
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Final Details */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Step 4: Final Details
              </CardTitle>
              <CardDescription>
                Review and finalize track details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Override Title (Optional)</Label>
                <Input
                  {...register("overrideTitle")}
                  placeholder="Different title for this album"
                />
                <p className="text-xs text-muted-foreground">
                  Use this if the track title should differ from the recording
                  title in this album context.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Track Image (Optional)</Label>
                <FileUpload
                  accept="image"
                  value={watch("coverImageUrl")}
                  onChange={(url) => setValue("coverImageUrl", url)}
                />
                <p className="text-xs text-muted-foreground">
                  Defaults to album cover if not set
                </p>
              </div>

              <div className="rounded-md border p-4 space-y-2">
                <h4 className="font-semibold">Summary</h4>
                <div className="text-sm space-y-1">
                  <div>
                    Recording: {selectedRecordingTitle || "Not selected"}
                  </div>
                  <div>
                    Album:{" "}
                    {selectedAlbum ? selectedAlbum.title : "Not selected"}
                  </div>
                  <div>Track #: {watch("trackNumber") || "Not set"}</div>
                  <div>Artists: {watch("artistIds")?.length || 0} selected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} disabled={!canProceed()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={formLoading || !canProceed()}>
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Track...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Track
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </CreateView>
  );
}
