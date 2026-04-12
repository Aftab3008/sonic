import { FileUpload } from "@/components/file-upload";
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
import { Switch } from "@/components/ui/switch";
import { CreateTrackType } from "@/lib/schema/track.schema";
import { Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ReviewStepProps {
  form: UseFormReturn<CreateTrackType>;
  selectedRecordingTitle: string;
  selectedAlbumTitle: string;
}

export function ReviewStep({
  form,
  selectedRecordingTitle,
  selectedAlbumTitle,
}: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Step 4: Final Details
        </CardTitle>
        <CardDescription>Review and finalize track details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="overrideTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Override Title (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Different title for this album"
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
            name="overrideIsExplicit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Explicit Override</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track Image (Optional)</FormLabel>
              <FormControl>
                <FileUpload
                  accept="image"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-md border p-4 bg-muted/20 space-y-2">
          <h4 className="font-semibold text-sm">Summary</h4>
          <div className="text-xs space-y-1">
            <div>Recording: {selectedRecordingTitle || "Not selected"}</div>
            <div>Album: {selectedAlbumTitle || "Not selected"}</div>
            <div>Track #: {form.watch("trackNumber")}</div>
            <div>
              Artists: {(form.watch("artistIds") || []).length} selected
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
