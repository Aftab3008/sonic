import { useForm } from "@refinedev/react-hook-form";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { Save } from "lucide-react";

export function ArtistEdit() {
  const {
    refineCore: { onFinish, formLoading, query },
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({ refineCoreProps: { resource: "artists", action: "edit" } });

  return (
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input {...register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input {...register("slug", { required: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea {...register("bio")} rows={4} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <FileUpload accept="image" value={watch("imageUrl")} onChange={(url) => setValue("imageUrl", url)} />
              </div>
              <div className="space-y-2">
                <Label>Header Image</Label>
                <FileUpload accept="image" value={watch("headerImageUrl")} onChange={(url) => setValue("headerImageUrl", url)} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={watch("isVerified") || false} onCheckedChange={(v) => setValue("isVerified", v)} />
              <Label>Verified Artist</Label>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Social Links</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Instagram</Label>
                  <Input {...register("socialLinks.instagram")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Twitter</Label>
                  <Input {...register("socialLinks.twitter")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Website</Label>
                  <Input {...register("socialLinks.website")} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}>
            <Save className="h-4 w-4 mr-2" />
            Update Artist
          </Button>
        </div>
      </form>
    </EditView>
  );
}
