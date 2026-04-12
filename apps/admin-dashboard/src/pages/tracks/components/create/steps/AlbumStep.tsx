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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTrackType } from "@/lib/schema/track.schema";
import { useGetAlbums } from "@/hooks/use-album";
import { Album } from "@/types/admin.types";
import { Disc, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface AlbumStepProps {
  form: UseFormReturn<CreateTrackType>;
}

export function AlbumStep({ form }: AlbumStepProps) {
  const { data: albums, isLoading: isLoadingAlbums } = useGetAlbums({
    pageSize: 100,
  });

  return (
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
        <FormField
          control={form.control}
          name="albumId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Album *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
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
                </FormControl>
                <SelectContent>
                  {albums?.data?.map((album: Album) => (
                    <SelectItem key={album.id} value={album.id}>
                      {album.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("albumId") && (
          <div className="grid gap-4 md:grid-cols-2">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
