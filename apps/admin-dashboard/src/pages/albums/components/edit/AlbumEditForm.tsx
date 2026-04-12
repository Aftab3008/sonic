import { FileUpload } from "@/components/file-upload";
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
import { useUpdateAlbum } from "@/hooks/use-album";
import {
  UpdateAlbumSchema,
  UpdateAlbumType
} from "@/lib/schema/album.schema";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { GenreSelector } from "@/pages/albums/components/GenreSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Tag, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface AlbumEditFormProps {
  data: UpdateAlbumType;
  albumId: string;
}

export function AlbumEditForm({ data, albumId }: AlbumEditFormProps) {
  const navigate = useNavigate();
  const updateAlbum = useUpdateAlbum();

  const form = useForm<UpdateAlbumType>({
    resolver: zodResolver(UpdateAlbumSchema),
    defaultValues: {
      title: data.title,
      releaseDate: data.releaseDate,
      albumType: data.albumType,
      releaseStatus: data.releaseStatus,
      coverImageUrl: data.coverImageUrl,
      artistIds: data.artistIds,
      genreIds: data.genreIds,
      upc: data.upc,
      recordLabel: data.recordLabel,
      copyright: data.copyright,
    },
  });

  const { isSubmitting } = form.formState;

  const handleOnFinish = async (values: UpdateAlbumType) => {
    try {
      const artists = values.artistIds?.map((a) => ({
        artistId: a.artistId,
        role: a.role,
      }));

      await updateAlbum.mutateAsync(
        {
          id: albumId,
          data: {
            ...values,
            artistIds: artists,
          },
        },
        {
          onSuccess: () => {
            toast.success("Album updated successfully");
            navigate("/albums");
          },
          onError: () => {
            toast.error("Failed to update album");
          },
        },
      );
    } catch {
      console.error("Failed to update album");
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
                      <Input placeholder="Album title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="albumType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Album Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALBUM">Album</SelectItem>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="EP">EP</SelectItem>
                        <SelectItem value="COMPILATION">Compilation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      accept="image"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="upc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Universal Product Code"
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
                name="recordLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Label</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="copyright"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copyright</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="© 2026 ..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                Update Album
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
