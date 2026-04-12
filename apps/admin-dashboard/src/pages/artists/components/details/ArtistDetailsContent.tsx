import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { Globe, Instagram, Twitter } from "lucide-react";
import { useGetArtistDetails } from "@/hooks/use-artist";
import { ErrorFetch } from "@/components/ErrorFetch";

interface ArtistDetailsContentProps {
  artistId: string;
}

export function ArtistDetailsContent({ artistId }: ArtistDetailsContentProps) {
  const { data: record } = useGetArtistDetails({ artistId });

  if (!record) {
    return <ErrorFetch />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 animate-in fade-in duration-500">
      <Card className="lg:col-span-1">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={record.imageUrl ?? undefined} />
            <AvatarFallback className="text-2xl">
              {record.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{record.name}</h3>
            <p className="text-sm text-muted-foreground">@{record.slug}</p>
          </div>
          <StatusBadge status={record.isVerified ? "verified" : "unverified"} />
          <Separator />
          <div className="text-sm text-muted-foreground">
            <p>
              {record.monthlyListeners?.toLocaleString() ?? 0} monthly listeners
            </p>
          </div>
          {record.socialLinks && (
            <div className="flex gap-3">
              {record.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${record.socialLinks.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {record.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${record.socialLinks.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {record.socialLinks.website && (
                <a
                  href={record.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {record.bio || "No biography provided."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
