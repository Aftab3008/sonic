import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { Save } from "lucide-react";

export function TrackCreate() {
  const {
    refineCore: { onFinish, formLoading },
    register, handleSubmit, setValue, watch,
  } = useForm({ refineCoreProps: { resource: "tracks", action: "create" } });

  const { query: albumsQuery } = useList({ resource: "albums", pagination: { pageSize: 100 } });

  return (
    <CreateView>
      <CreateViewHeader />
      <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Title *</Label><Input {...register("title", { required: true })} placeholder="Track title" /></div>
              <div className="space-y-2">
                <Label>Album *</Label>
                <Select onValueChange={(v) => setValue("albumId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select album" /></SelectTrigger>
                  <SelectContent>
                    {albumsQuery?.data?.data?.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Track # *</Label><Input type="number" {...register("trackNumber", { required: true, valueAsNumber: true })} /></div>
              <div className="space-y-2"><Label>BPM</Label><Input type="number" {...register("bpm", { valueAsNumber: true })} /></div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>ISRC</Label><Input {...register("isrc")} /></div>
              <div className="space-y-2">
                <Label>Release Status</Label>
                <Select onValueChange={(v) => setValue("releaseStatus", v)} defaultValue="DRAFT">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={watch("isExplicit") || false} onCheckedChange={(v) => setValue("isExplicit", v)} />
                <Label>Explicit</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={watch("hasLyrics") || false} onCheckedChange={(v) => setValue("hasLyrics", v)} />
                <Label>Has Lyrics</Label>
              </div>
            </div>

            {watch("hasLyrics") && (
              <div className="space-y-2"><Label>Lyrics</Label><Textarea {...register("lyrics")} rows={8} placeholder="Enter lyrics..." /></div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={formLoading}><Save className="h-4 w-4 mr-2" />Save Track</Button>
        </div>
      </form>
    </CreateView>
  );
}
