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
import { useUpdateGenre } from "@/hooks/use-genre";
import { UpdateGenreSchema, UpdateGenreType } from "@/lib/schema/genre.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface GenreEditFormProps {
  data: UpdateGenreType;
  genreId: string;
}

export function GenreEditForm({ data, genreId }: GenreEditFormProps) {
  const navigate = useNavigate();
  const updateGenre = useUpdateGenre();

  const form = useForm({
    resolver: zodResolver(UpdateGenreSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
    },
  });

  const { isSubmitting } = form.formState;

  const handleOnFinish = async (values: UpdateGenreType) => {
    try {
      await updateGenre.mutateAsync(
        { id: genreId, data: values },
        {
          onSuccess: () => {
            toast.success("Genre updated successfully");
            navigate("/genres");
          },
          onError: () => {
            toast.error("Failed to update genre");
          },
        },
      );
    } catch {
      console.error("Failed to update genre");
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
                      <Input placeholder="Genre name" {...field} />
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
                      <Input placeholder="genre-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input placeholder="🎵 or icon name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <Input type="color" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Color</FormLabel>
                    <FormControl>
                      <Input type="color" className="h-10" {...field} />
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
                Update Genre
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
