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
import { StatusBadge } from "@/components/status-badge";
import { useGetAllRecordings } from "@/hooks/use-recording";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Music } from "lucide-react";
import { useState } from "react";

interface RecordingSelectorProps {
  value?: string | null;
  onChange: (recordingId: string, title: string) => void;
  disabled?: boolean;
}

function formatDuration(ms?: number): string {
  if (!ms) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RecordingSelector({
  value,
  onChange,
  disabled,
}: RecordingSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: recordings, isLoading } = useGetAllRecordings();

  const selectedRecording = recordings?.find((r) => r.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedRecording ? (
            <span className="flex items-center gap-2 truncate">
              <Music className="h-4 w-4 shrink-0" />
              <span className="truncate">{selectedRecording.title}</span>
              {selectedRecording.durationMs && (
                <span className="text-muted-foreground text-xs">
                  ({formatDuration(selectedRecording.durationMs)})
                </span>
              )}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Music className="h-4 w-4" />
              Select a recording...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search recordings..." />
          <CommandList>
            <CommandEmpty>No recording found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem disabled className="justify-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-xs text-muted-foreground">
                      Loading recordings...
                    </span>
                  </div>
                </CommandItem>
              ) : (
                recordings?.map((recording) => (
                  <CommandItem
                    key={recording.id}
                    value={recording.title}
                    onSelect={() => {
                      onChange(recording.id, recording.title);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === recording.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="truncate">{recording.title}</span>
                      {recording.durationMs && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDuration(recording.durationMs)}
                        </span>
                      )}
                    </div>
                    <StatusBadge
                      status={recording.audioProcessStatus}
                      className="ml-2 shrink-0"
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
