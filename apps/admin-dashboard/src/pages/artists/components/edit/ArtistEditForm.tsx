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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateArtist } from "@/hooks/use-artist";
import {
  UpdateArtistSchema,
  UpdateArtistType,
} from "@/lib/schema/artist.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ArtistEditFormProps {
  data: UpdateArtistType;
  artistId: string;
}

export function ArtistEditForm({ data, artistId }: ArtistEditFormProps) {
  const navigate = useNavigate();
  const updateArtist = useUpdateArtist();

  const form = useForm({
    resolver: zodResolver(UpdateArtistSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
      bio: data.bio,
      imageUrl: data.imageUrl,
      headerImageUrl: data.headerImageUrl,
      isVerified: data.isVerified,
      socialLinks: {
        instagram: data.socialLinks?.instagram,
        twitter: data.socialLinks?.twitter,
        website: data.socialLinks?.website,
      },
    },
  });

  const { isSubmitting } = form.formState;

  const handleOnFinish = async (values: UpdateArtistType) => {
    try {
      await updateArtist.mutateAsync(
        { id: artistId, data: values },
        {
          onSuccess: () => {
            toast.success("Artist updated successfully");
            navigate("/artists");
          },
          onError: () => {
            toast.error("Failed to update artist");
          },
        },
      );
    } catch {
      console.error("Failed to update artist");
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="artist-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Artist biography..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
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
              <FormField
                control={form.control}
                name="headerImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Image</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Verified Artist</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel className="text-base font-medium">
                Social Links
              </FormLabel>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="socialLinks.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="@handle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Twitter
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="@handle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialLinks.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                Update Artist
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
