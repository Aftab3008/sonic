import { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Users, Disc, Music, ExternalLink } from "lucide-react";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { useGetAlbums } from "@/hooks/use-album";
import { useGetRecording } from "@/hooks/use-recording";
import { Link } from "react-router";

export function TrackEdit() {
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({ refineCoreProps: { resource: "tracks", action: "edit" } });

  const track = queryResult?.data?.data;
  const recordingId = track?.recordingId;
  const albumId = watch("albumId") || track?.albumId;

  const { data: recording } = useGetRecording(recordingId);
  const { data: albums } = useGetAlbums({ pageSize: 100 });

  useEffect(() => {
    if (track && track.artists && !watch("artistIds")) {
      setValue(
        "artistIds",
        track.artists.map((a: any) => ({
          artistId: a.artistId,
          role: a.role,
          name: a.artist?.name,
        })),
      );
    }
  }, [track, setValue, watch]);

  // Handle album change - offer to reload artists
  const handleAlbumChange = (newAlbumId: string) => {
    setValue("albumId", newAlbumId);
    // Note: Artists are not automatically reloaded on edit
    // This preserves manual changes made to track artists
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

  const effectiveTitle =
    watch("overrideTitle") || recording?.title || "Unknown";
  const effectiveDuration = recording?.durationMs;

  return (
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Recording</Label>
              </div>

              {recording ? (
                <div className="rounded-md border bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{recording.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Duration:{" "}
                        {effectiveDuration
                          ? `${Math.round(effectiveDuration / 1000)}s`
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
                            {a.artist?.name} ({a.role})
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
                  Loading recording...
                </div>
              )}

              <input type="hidden" {...register("recordingId")} />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4 text-muted-foreground" />
                <Label className="font-semibold">Album Context</Label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Album *</Label>
                  <Select
                    onValueChange={handleAlbumChange}
                    value={watch("albumId")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {albums?.data?.map((a: any) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Override Title</Label>
                  <Input
                    {...register("overrideTitle")}
                    placeholder={`Defaults to: ${recording?.title || "recording title"}`}
                  />
                  <p className="text-xs text-muted-foreground">
                    Different title for this album context
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Track Number *</Label>
                  <Input
                    type="number"
                    min={1}
                    {...register("trackNumber", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Disc Number</Label>
                  <Input
                    type="number"
                    min={1}
                    defaultValue={1}
                    {...register("discNumber", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-semibold">Track Artists</Label>
                </div>
                {recording?.artists && recording.artists.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Inherited from recording
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
                        {a.artist?.name} ({a.role})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <ArtistSelector
                value={watch("artistIds") || []}
                onChange={(val) => setValue("artistIds", val)}
              />
            </div>

            <Separator />
            <div className="space-y-2">
              <Label>Track-Specific Image (Optional)</Label>
              {watch("coverImageUrl") ? (
                <div className="space-y-2">
                  <img
                    src={watch("coverImageUrl")}
                    alt="Track cover"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("coverImageUrl", "")}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No track-specific image. Album cover will be used.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}>
            <Save className="h-4 w-4 mr-2" />
            Update Track
          </Button>
        </div>
      </form>
    </EditView>
  );
}
