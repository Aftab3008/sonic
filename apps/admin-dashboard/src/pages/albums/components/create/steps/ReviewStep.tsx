import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAlbumType } from "@/lib/schema/album.schema";
import { Calendar, Disc, Save, Tag, Users } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ReviewStepProps {
  form: UseFormReturn<CreateAlbumType>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Step 5: Review Album Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Album Information
              </h4>
              <p className="text-lg font-semibold">{values.title}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Disc className="h-3 w-3" /> {values.albumType}
                </Badge>
                <Badge
                  variant={
                    values.releaseStatus === "PUBLISHED"
                      ? "default"
                      : "secondary"
                  }
                  className="flex items-center gap-1"
                >
                  {values.releaseStatus}
                </Badge>
                {values.releaseDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {values.releaseDate}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Artists & Genres
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Artists:</span>
                  <span>
                    {values.artistIds && values.artistIds.length > 0
                      ? values.artistIds.map((a) => a.name).join(", ")
                      : "No artists selected"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Genres:</span>
                  <div className="flex flex-wrap gap-1">
                    {values.genreIds && values.genreIds.length > 0 ? (
                      values.genreIds.map((g, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[10px] px-1 py-0"
                        >
                          {g}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Distribution & Copyright
              </h4>
              <div className="grid grid-cols-1 gap-1 text-sm">
                <div>
                  <span className="text-muted-foreground">UPC:</span>{" "}
                  {values.upc || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Label:</span>{" "}
                  {values.recordLabel || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">©:</span>{" "}
                  {values.copyright || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Album Artwork
              </h4>
              <div className="aspect-square max-w-60 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                {values.coverImageUrl ? (
                  <img
                    src={values.coverImageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Disc className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      No Artwork Uploaded
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Please review all information before creating the album. Ensure the
            release status and artists are correct.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
