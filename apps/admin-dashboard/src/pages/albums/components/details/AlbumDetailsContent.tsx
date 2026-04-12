import { ErrorFetch } from "@/components/ErrorFetch";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAlbumDetails } from "@/hooks/use-album";

interface AlbumDetailsContentProps {
  albumId: string;
}

export default function AlbumDetailsContent({
  albumId,
}: AlbumDetailsContentProps) {
  const { data: record } = useGetAlbumDetails({ albumId });

  if (!record) {
    return <ErrorFetch />;
  }

  const hasMultipleDiscs = record.tracks?.some((t) => (t.discNumber ?? 1) > 1);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="pt-6 space-y-4">
          {record.coverImageUrl && (
            <img
              src={record.coverImageUrl}
              alt={record.title}
              className="w-full aspect-square object-cover rounded-lg"
            />
          )}
          <h3 className="text-xl font-bold">{record.title}</h3>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={record.albumType} />
            <StatusBadge status={record.releaseStatus} />
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Release Date</span>
              <span>{record.releaseDate}</span>
            </div>
            {record.upc && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">UPC</span>
                <span>{record.upc}</span>
              </div>
            )}
            {record.recordLabel && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Label</span>
                <span>{record.recordLabel}</span>
              </div>
            )}
            {record.copyright && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Copyright</span>
                <span>{record.copyright}</span>
              </div>
            )}
          </div>
          {record.artists && record.artists.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Artists</p>
                {record.artists.map((a) => (
                  <span
                    key={a.artistId}
                    className="text-sm text-muted-foreground"
                  >
                    {a.artist?.name} ({a.role}){", "}
                  </span>
                ))}
              </div>
            </>
          )}
          {record.genres && record.genres.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Genres</p>
                <div className="flex flex-wrap gap-1">
                  {record.genres.map((g) => (
                    <span
                      key={g.genreId}
                      className="text-xs bg-muted px-2 py-0.5 rounded-full"
                    >
                      {g.genre?.name}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          {record.tracks && record.tracks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {hasMultipleDiscs && (
                    <TableHead className="w-12">Disc</TableHead>
                  )}
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.tracks.map((t) => {
                  const durationMs = t.recording?.durationMs || 0;
                  const mins = Math.floor(durationMs / 60000);
                  const secs = String(
                    Math.floor((durationMs % 60000) / 1000),
                  ).padStart(2, "0");
                  const title =
                    t.overrideTitle || t.recording?.title || "Unknown Title";

                  return (
                    <TableRow key={t.id}>
                      <TableCell>{t.trackNumber}</TableCell>
                      {hasMultipleDiscs && (
                        <TableCell>{t.discNumber}</TableCell>
                      )}
                      <TableCell className="font-medium">{title}</TableCell>
                      <TableCell>
                        {mins}:{secs}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            t.recording?.audioProcessStatus || "PENDING_UPLOAD"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tracks added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
