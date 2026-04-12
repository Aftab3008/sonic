import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateArtistType } from "@/lib/schema/artist.schema";
import { CheckCircle, Globe, Instagram, Save, Twitter } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ReviewStepProps {
  form: UseFormReturn<CreateArtistType>;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Step 4: Review Artist Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Name & Identification
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{values.name}</p>
                {values.isVerified && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                @{values.slug}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Biography
              </h4>
              <p className="text-sm line-clamp-4">
                {values.bio || "No biography provided."}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Social Links
              </h4>
              <div className="flex flex-wrap gap-4">
                {values.socialLinks?.instagram && (
                  <div className="flex items-center gap-1 text-sm">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <span>{values.socialLinks.instagram}</span>
                  </div>
                )}
                {values.socialLinks?.twitter && (
                  <div className="flex items-center gap-1 text-sm">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    <span>{values.socialLinks.twitter}</span>
                  </div>
                )}
                {values.socialLinks?.website && (
                  <div className="flex items-center gap-1 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{values.socialLinks.website}</span>
                  </div>
                )}
                {!values.socialLinks?.instagram &&
                  !values.socialLinks?.twitter &&
                  !values.socialLinks?.website && (
                    <p className="text-sm text-muted-foreground italic">
                      No social links added.
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Images Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                  {values.imageUrl ? (
                    <img
                      src={values.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No Profile Image
                    </span>
                  )}
                </div>
                <div className="aspect-video rounded-lg border bg-muted flex items-center justify-center overflow-hidden self-center">
                  {values.headerImageUrl ? (
                    <img
                      src={values.headerImageUrl}
                      alt="Header"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No Header Image
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-1 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Profile
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  Header
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Please review all information before creating the artist. You can go
            back to any step to make changes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
