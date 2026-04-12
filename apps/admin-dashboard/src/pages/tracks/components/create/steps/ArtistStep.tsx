import { Badge } from "@/components/ui/badge";
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
import { CreateTrackType } from "@/lib/schema/track.schema";
import { useGetAlbumArtists } from "@/hooks/use-album";
import {
  ArtistSelector,
  ArtistSelection,
} from "@/pages/albums/components/ArtistSelector";
import { AlbumArtist } from "@/types/admin.types";
import { Users, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

interface ArtistStepProps {
  form: UseFormReturn<CreateTrackType>;
}

export function ArtistStep({ form }: ArtistStepProps) {
  const selectedAlbumId = form.watch("albumId");
  const { data: albumArtists, isLoading: isLoadingArtists } =
    useGetAlbumArtists(selectedAlbumId || null);

  const hasInherited = useRef(false);

  useEffect(() => {
    if (
      albumArtists &&
      albumArtists.length > 0 &&
      !hasInherited.current &&
      (!form.getValues("artistIds") ||
        form.getValues("artistIds")?.length === 0)
    ) {
      const inheritedArtists: ArtistSelection[] = albumArtists.map((a) => ({
        artistId: a.artistId || a.artist.id,
        role: a.role,
        name: a.artist.name,
      }));
      form.setValue("artistIds", inheritedArtists);
      hasInherited.current = true;
    }
  }, [albumArtists, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Step 3: Track Artists
        </CardTitle>
        <CardDescription>
          Artists are auto-populated from the album
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingArtists && (
          <div className="flex items-center gap-2 text-muted-foreground pt-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading album artists...</span>
          </div>
        )}

        {!isLoadingArtists && albumArtists && albumArtists.length > 0 && (
          <div className="space-y-2">
            <FormLabel className="text-xs uppercase text-muted-foreground">
              Inherited from Album
            </FormLabel>
            <div className="rounded-md border bg-muted/50 p-4 flex flex-wrap gap-2">
              {albumArtists.map((artist: AlbumArtist) => (
                <Badge key={artist.artistId} variant="secondary">
                  {artist.artist.name} ({artist.role})
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
              <FormLabel>Track Artists *</FormLabel>
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
  );
}
