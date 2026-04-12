import { Check, ChevronsUpDown, X, Tag } from "lucide-react";
import { useGetGenres } from "@/hooks/use-genre";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";

interface GenreSelectorProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export function GenreSelector({ value = [], onChange }: GenreSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: genres, isLoading } = useGetGenres();

  const options = useMemo(() => {
    return (
      genres?.map((g) => ({
        label: g.name,
        value: g.id,
      })) || []
    );
  }, [genres]);

  const handleSelect = (genreId: string) => {
    if (value.includes(genreId)) {
      onChange(value.filter((id) => id !== genreId));
    } else {
      onChange([...value, genreId]);
    }
  };

  const removeGenre = (genreId: string) => {
    onChange(value.filter((id) => id !== genreId));
  };

  const selectedLabels = useMemo(() => {
    return value.map((id) => {
      const option = options?.find((o) => o.value === id);
      return option ? option.label : id;
    });
  }, [value, options]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md bg-background">
        {value.length === 0 && (
          <span className="text-sm text-muted-foreground px-1 py-1">
            No genres selected
          </span>
        )}
        {value.map((id, index) => (
          <Badge
            key={id}
            variant="secondary"
            className="flex items-center gap-1 pl-2 pr-1 py-1"
          >
            {selectedLabels[index]}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 hover:bg-transparent"
              onClick={() => removeGenre(id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
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
              <Tag className="h-4 w-4" />
              Select Genres...
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search genres..." />
            <CommandList>
              <CommandEmpty>No genre found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <CommandItem disabled className="justify-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-xs text-muted-foreground">
                        Loading genres...
                      </span>
                    </div>
                  </CommandItem>
                ) : (
                  options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        handleSelect(option.value as string);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(option.value as string)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
