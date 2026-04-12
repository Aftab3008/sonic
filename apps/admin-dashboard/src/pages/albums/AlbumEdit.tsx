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
import { FileUpload } from "@/components/file-upload";
import { Save, Users, Tag } from "lucide-react";
import { ArtistSelector } from "@/pages/albums/components/ArtistSelector";
import { GenreSelector } from "@/pages/albums/components/GenreSelector";
import * as React from "react";

export function AlbumEdit() {
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({ refineCoreProps: { resource: "albums", action: "edit" } });

  const album = queryResult?.data?.data;

  React.useEffect(() => {
    if (album) {
      if (album.artists && !watch("artistIds")) {
        setValue("artistIds", album.artists.map((a: any) => ({
          artistId: a.artistId,
          role: a.role,
          name: a.artist?.name
        })));
      }
      if (album.genres && !watch("genreIds")) {
        setValue("genreIds", album.genres.map((g: any) => g.genreId));
      }
    }
  }, [album, setValue]);

  return (
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input {...register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Release Date *</Label>
                <Input type="date" {...register("releaseDate")} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Album Type</Label>
                <Select
                  onValueChange={(v) => setValue("albumType", v)}
                  value={watch("albumType")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALBUM">Album</SelectItem>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="EP">EP</SelectItem>
                    <SelectItem value="COMPILATION">Compilation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Release Status</Label>
                <Select
                  onValueChange={(v) => setValue("releaseStatus", v)}
                  value={watch("releaseStatus")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <FileUpload
                accept="image"
                value={watch("coverImageUrl")}
                onChange={(url) => setValue("coverImageUrl", url)}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-semibold">Artists</Label>
                </div>
                <ArtistSelector
                  value={watch("artistIds") || []}
                  onChange={(val) => setValue("artistIds", val)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-semibold">Genres</Label>
                </div>
                <GenreSelector
                  value={watch("genreIds") || []}
                  onChange={(val) => setValue("genreIds", val)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>UPC</Label>
                <Input {...register("upc")} />
              </div>
              <div className="space-y-2">
                <Label>Record Label</Label>
                <Input {...register("recordLabel")} />
              </div>
              <div className="space-y-2">
                <Label>Copyright</Label>
                <Input {...register("copyright")} />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}>
            <Save className="h-4 w-4 mr-2" />
            Update Album
          </Button>
        </div>
      </form>
    </EditView>
  );
}
