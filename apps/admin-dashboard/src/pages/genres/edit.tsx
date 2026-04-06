import { useForm } from "@refinedev/react-hook-form";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

export function GenreEdit() {
  const {
    refineCore: { onFinish, formLoading },
    register, handleSubmit,
  } = useForm({ refineCoreProps: { resource: "genres", action: "edit" } });

  return (
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Name</Label><Input {...register("name")} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input {...register("slug")} /></div>
            </div>
            <div className="space-y-2"><Label>Icon</Label><Input {...register("icon")} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Primary Color</Label><Input type="color" {...register("primaryColor")} className="h-10" /></div>
              <div className="space-y-2"><Label>Secondary Color</Label><Input type="color" {...register("secondaryColor")} className="h-10" /></div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}><Save className="h-4 w-4 mr-2" />Update Genre</Button>
        </div>
      </form>
    </EditView>
  );
}
