import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateAlbumType } from "@/lib/schema/album.schema";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Users } from "lucide-react";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { GenreSelector } from "@/pages/albums/components/GenreSelector";

interface ArtistsGenresStepProps {
  form: UseFormReturn<CreateAlbumType>;
}

export function ArtistsGenresStep({ form }: ArtistsGenresStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Step 3: Artists & Genres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <FormLabel className="font-semibold">Artists</FormLabel>
            </div>
            <FormField
              control={form.control}
              name="artistIds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ArtistSelector
                      value={
                        field.value?.map((a) => ({
                          artistId: a.artistId,
                          role: a.role || "PRIMARY",
                          name: a.name,
                        })) || []
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <FormLabel className="font-semibold">Genres</FormLabel>
            </div>
            <FormField
              control={form.control}
              name="genreIds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <GenreSelector
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
