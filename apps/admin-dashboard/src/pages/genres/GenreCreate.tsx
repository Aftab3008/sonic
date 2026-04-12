import { useForm } from "@refinedev/react-hook-form";
import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

export function GenreCreate() {
  const {
    refineCore: { onFinish, formLoading },
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm({ refineCoreProps: { resource: "genres", action: "create" } });

  return (
    <CreateView>
      <CreateViewHeader />
      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  {...register("name", { required: true })}
                  placeholder="Genre name"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  {...register("slug", { required: true })}
                  placeholder="genre-slug"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Input {...register("icon")} placeholder="🎵 or icon name" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <Input
                  type="color"
                  {...register("primaryColor")}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <Input
                  type="color"
                  {...register("secondaryColor")}
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading || isSubmitting}>
            {!formLoading && !isSubmitting && <Save className="h-4 w-4 mr-2" />}
            {formLoading || isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </CreateView>
  );
}
