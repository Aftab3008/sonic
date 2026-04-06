import { useForm } from "@refinedev/react-hook-form";
import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
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
import { Save } from "lucide-react";

export function AlbumCreate() {
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({ refineCoreProps: { resource: "albums", action: "create" } });

  return (
    <CreateView>
      <CreateViewHeader />
      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="Album title"
                />
              </div>
              <div className="space-y-2">
                <Label>Release Date *</Label>
                <Input
                  type="date"
                  {...register("releaseDate", { required: true })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Album Type</Label>
                <Select
                  onValueChange={(v) => setValue("albumType", v)}
                  defaultValue="ALBUM"
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
                  defaultValue="DRAFT"
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

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>UPC</Label>
                <Input
                  {...register("upc")}
                  placeholder="Universal Product Code"
                />
              </div>
              <div className="space-y-2">
                <Label>Record Label</Label>
                <Input {...register("recordLabel")} />
              </div>
              <div className="space-y-2">
                <Label>Copyright</Label>
                <Input {...register("copyright")} placeholder="© 2026 ..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Album
          </Button>
        </div>
      </form>
    </CreateView>
  );
}
