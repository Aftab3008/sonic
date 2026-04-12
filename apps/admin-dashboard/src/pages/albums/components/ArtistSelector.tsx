import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetArtists } from "@/hooks/use-artist";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, UserPlus, X } from "lucide-react";
import { useState } from "react";

export interface ArtistSelection {
  artistId: string;
  role: "PRIMARY" | "FEATURED" | "PRODUCER";
  name?: string;
}

interface ArtistSelectorProps {
  value?: ArtistSelection[];
  onChange: (value: ArtistSelection[]) => void;
  maxArtists?: number;
}

export function ArtistSelector({
  value = [],
  onChange,
  maxArtists,
}: ArtistSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: artists, isLoading } = useGetArtists();

  const selectedArtists = value;

  const handleSelect = (artistId: string, name: string) => {
    if (selectedArtists.some((a) => a.artistId === artistId)) {
      onChange(selectedArtists.filter((a) => a.artistId !== artistId));
    } else {
      if (maxArtists && selectedArtists.length >= maxArtists) return;
      onChange([...selectedArtists, { artistId, role: "PRIMARY", name }]);
    }
  };

  const handleRoleChange = (
    artistId: string,
    role: ArtistSelection["role"],
  ) => {
    onChange(
      selectedArtists.map((a) =>
        a.artistId === artistId ? { ...a, role } : a,
      ),
    );
  };

  const removeArtist = (artistId: string) => {
    onChange(selectedArtists.filter((a) => a.artistId !== artistId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-10 p-1 border rounded-md bg-background">
        {selectedArtists.length === 0 && (
          <span className="text-sm text-muted-foreground px-2 py-1">
            No artists selected
          </span>
        )}
        {selectedArtists.map((artist) => (
          <div
            key={artist.artistId}
            className="flex items-center gap-1 bg-secondary text-secondary-foreground pl-2 pr-1 py-1 rounded-md text-sm border"
          >
            <span className="font-medium">{artist.name}</span>
            <Select
              value={artist.role}
              onValueChange={(v) =>
                handleRoleChange(artist.artistId, v as ArtistSelection["role"])
              }
            >
              <SelectTrigger className="h-6 w-22.5 text-[10px] px-1 border-none bg-transparent focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMARY">Primary</SelectItem>
                <SelectItem value="FEATURED">Featured</SelectItem>
                <SelectItem value="PRODUCER">Producer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => removeArtist(artist.artistId)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <UserPlus className="h-4 w-4" />
              Add Artist...
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search artists..." />
            <CommandList>
              <CommandEmpty>No artist found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <CommandItem disabled className="justify-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-xs text-muted-foreground">
                        Loading artists...
                      </span>
                    </div>
                  </CommandItem>
                ) : (
                  artists?.map((artist) => {
                    if (!artist) return null;
                    return (
                      <CommandItem
                        key={artist.id}
                        value={artist.name}
                        onSelect={() => {
                          handleSelect(artist.id!, artist.name!);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedArtists.some(
                              (a) => a.artistId === artist.id,
                            )
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {artist.name}
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
