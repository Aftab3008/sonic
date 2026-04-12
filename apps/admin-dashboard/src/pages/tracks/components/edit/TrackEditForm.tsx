import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUpdateTrack } from "@/hooks/use-track";
import { UpdateTrackSchema, UpdateTrackType } from "@/lib/schema/track.schema";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { Album, Recording } from "@/types/admin.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Disc, ExternalLink, Loader2, Music, Save, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

interface TrackEditFormProps {
  data: UpdateTrackType;
  trackId: string;
  albums: Album[];
  recording: Recording | null;
}

export function TrackEditForm({
  data,
  trackId,
  albums,
  recording,
}: TrackEditFormProps) {
  const navigate = useNavigate();
  const updateTrack = useUpdateTrack();

  const form = useForm({
    resolver: zodResolver(UpdateTrackSchema),
    defaultValues: {
      recordingId: data.recordingId,
      albumId: data.albumId,
      trackNumber: data.trackNumber,
      discNumber: data.discNumber,
      artistIds: data.artistIds,
      overrideTitle: data.overrideTitle,
      coverImageUrl: data.coverImageUrl,
      overrideIsExplicit: data.overrideIsExplicit,
    },
  });

  const { isSubmitting } = form.formState;

  const handleOnFinish = async (values: UpdateTrackType) => {
    try {
      await updateTrack.mutateAsync(
        { id: trackId, data: values },
        {
          onSuccess: () => {
            toast.success("Track updated successfully");
            navigate("/tracks");
          },
          onError: () => {
            toast.error("Failed to update track");
          },
        },
      );
    } catch {
      console.error("Failed to update track");
    }
  };

  const effectiveDuration = recording?.durationMs;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <FormLabel className="font-semibold">Recording</FormLabel>
              </div>

              {recording ? (
                <div className="rounded-md border bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{recording.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Duration:{" "}
                        {effectiveDuration
                          ? `${Math.floor(effectiveDuration / 60000)}:${String(Math.floor((effectiveDuration % 60000) / 1000)).padStart(2, "0")}`
                          : "Unknown"}
                      </p>
                    </div>
                    <Link
                      to={`/recordings/edit/${recording.id}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Edit Recording <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  {recording.artists && recording.artists.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Recording Artists
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recording.artists.map((a: any) => (
                          <Badge key={a.artistId} variant="secondary">
                            {a.artist?.name || a.name} ({a.role})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {recording.audioUrl && (
                    <audio controls className="w-full" src={recording.audioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Recording information unavailable
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4 text-muted-foreground" />
                <FormLabel className="font-semibold">Album Context</FormLabel>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="albumId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select album" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {albums.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overrideTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Override Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Defaults to: ${recording?.title || "recording title"}`}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Leave blank to use recording title
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="trackNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Track Number *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disc Number</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overrideIsExplicit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end pb-2">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={
                              field.value ?? recording?.isExplicit ?? false
                            }
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Explicit Override</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <FormLabel className="font-semibold">Track Artists</FormLabel>
                </div>
                {recording?.artists && recording.artists.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Inherited from recording if not provided
                  </span>
                )}
              </div>

              {recording?.artists && recording.artists.length > 0 && (
                <div className="rounded-md border bg-muted/50 p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Original Recording Artists
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recording.artists.map((a: any) => (
                      <Badge key={a.artistId} variant="outline">
                        {a.artist?.name || a.name} ({a.role})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track-Specific Image (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image URL..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  {field.value && (
                    <div className="mt-2 relative w-32 h-32">
                      <img
                        src={field.value}
                        alt="Track cover"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => field.onChange("")}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
                Update Track
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
