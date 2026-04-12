import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
  ARCHIVED: { label: "Archived", variant: "outline" },
  ALBUM: { label: "Album", variant: "default" },
  SINGLE: { label: "Single", variant: "secondary" },
  EP: { label: "EP", variant: "secondary" },
  COMPILATION: { label: "Compilation", variant: "outline" },
  admin: { label: "Admin", variant: "destructive" },
  user: { label: "User", variant: "secondary" },
  true: { label: "Banned", variant: "destructive" },
  false: { label: "Active", variant: "default" },
  verified: { label: "Verified", variant: "default" },
  unverified: { label: "Unverified", variant: "outline" },
  PENDING_UPLOAD: { label: "Pending Upload", variant: "secondary" },
  UPLOADED: { label: "Uploaded", variant: "default" },
  PROCESSING: { label: "Processing", variant: "secondary" },
  SUCCEEDED: { label: "Succeeded", variant: "default" },
  FAILED: { label: "Failed", variant: "destructive" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    variant: "outline" as const,
  };
  return (
    <Badge variant={config.variant} className={cn("capitalize", className)}>
      {config.label}
    </Badge>
  );
}
