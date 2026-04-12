import { RefreshCcw } from "lucide-react";


export function ErrorFetch() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <RefreshCcw className="h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">Failed to fetch</p>
    </div>
  );
}