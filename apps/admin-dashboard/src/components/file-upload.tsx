import { useCallback, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  Loader2,
  FileAudio,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { kyInstance } from "@/providers/dataProvider";
import { StandardResponse } from "@/types/admin.types";
import { PresignedUrlResponse } from "@/hooks/use-upload";

type FileUploadProps = {
  accept: "image" | "audio";
  value?: string;
  onChange: (url: string, metadata?: { duration?: number }) => void;
  className?: string;
  recordingId?: string;
  disabled?: boolean;
  processStatus?:
    | "PENDING_UPLOAD"
    | "UPLOADED"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED";
};

export function FileUpload({
  accept,
  value,
  onChange,
  className,
  recordingId,
  disabled = false,
  processStatus,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptMap = {
    image: "image/jpeg,image/png,image/webp,image/gif",
    audio: "audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/aac,audio/ogg",
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setSelectedFileName(file.name);
      setError(null);
      setUploading(true);

      try {
        let responseData: { uploadUrl: string; key: string; fileUrl: string };

        if (accept === "audio") {
          if (!recordingId) {
            throw new Error("recordingId is required for audio uploads");
          }
          const json = await kyInstance
            .get("upload/presigned-url/recording-audio", {
              searchParams: {
                filename: file.name,
                contentType: file.type,
                recordingId,
              },
            })
            .json<StandardResponse<PresignedUrlResponse>>();
          responseData = json.data ?? json;
        } else {
          const json = await kyInstance
            .get("upload/presigned-url/image", {
              searchParams: {
                filename: file.name,
                contentType: file.type,
              },
            })
            .json<StandardResponse<PresignedUrlResponse>>();

          responseData = json.data ?? json;
        }

        const { uploadUrl, fileUrl } = responseData;

        if (!uploadUrl || !fileUrl) {
          throw new Error(
            "Invalid presigned URL response — missing uploadUrl or fileUrl",
          );
        }

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error(`S3 upload failed (${uploadRes.status})`);
        }

        let duration: number | undefined;
        if (accept === "audio") {
          duration = await getAudioDuration(file);
        }

        onChange(fileUrl, { duration });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed unexpectedly";
        setError(message);
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [accept, onChange, recordingId],
  );

  const getAudioDuration = (file: File): Promise<number | undefined> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src);
        resolve(Math.round(audio.duration * 1000));
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audio.src);
        resolve(undefined);
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile, disabled],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    },
    [uploadFile],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFileName(null);
      setError(null);
      onChange("");
    },
    [onChange],
  );

  const isDisabled =
    disabled || uploading || (accept === "audio" && !recordingId);

  // Disable clear for audio recordings that have progressed past PENDING_UPLOAD
  const canClear =
    accept === "image" ||
    !processStatus ||
    processStatus === "PENDING_UPLOAD" ||
    processStatus === "FAILED";

  const Icon = accept === "audio" ? FileAudio : ImageIcon;
  const hasValue = !!value;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center",
          "transition-colors duration-200",
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-primary/50",
          dragOver
            ? "border-primary bg-primary/5"
            : hasValue
              ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
              : "border-muted-foreground/25",
          uploading && "pointer-events-none",
        )}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptMap[accept]}
          onChange={handleFileChange}
          className="hidden"
          disabled={isDisabled}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-primary">
              Uploading{selectedFileName ? `: ${selectedFileName}` : "..."}
            </p>
            <p className="text-xs text-muted-foreground">
              Please wait while the file is being uploaded to storage
            </p>
          </div>
        ) : processStatus === "PROCESSING" ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-primary">
              Processing audio...
            </p>
            <p className="text-xs text-muted-foreground">
              Audio is being converted to streaming format
            </p>
          </div>
        ) : processStatus === "FAILED" ? (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Processing failed
            </p>
            <p className="text-xs text-muted-foreground">
              Click to retry upload
            </p>
          </div>
        ) : hasValue ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Upload complete
            </p>
            <p className="text-xs text-muted-foreground">
              Click to replace with a different file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {accept === "audio" && !recordingId
                ? "Create the recording first to enable audio upload"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {accept === "image"
                ? "JPG, PNG, WebP, GIF (max 10MB)"
                : "MP3, WAV, FLAC, AAC, OGG (max 100MB)"}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-700 dark:text-red-300 flex-1">
            {error}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {hasValue && canClear && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm truncate flex-1">
            {selectedFileName || value.split("/").pop()}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {hasValue && !canClear && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm truncate flex-1">
            {selectedFileName || value.split("/").pop()}
          </span>
        </div>
      )}

      {hasValue && accept === "image" && (
        <img
          src={value}
          alt="Preview"
          className="h-24 w-24 object-cover rounded-md border"
        />
      )}

      {accept === "audio" && processStatus === "SUCCEEDED" && value && (
        <audio controls className="w-full" src={value} preload="metadata">
          Your browser does not support the audio element.
        </audio>
      )}

      {accept === "audio" && processStatus === "PROCESSING" && (
        <div className="p-4 bg-muted rounded text-center text-sm text-muted-foreground">
          Audio player will appear when processing completes
        </div>
      )}

      {accept === "audio" && processStatus === "FAILED" && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded text-center text-sm text-red-700 dark:text-red-300">
          Audio processing failed. Please upload again.
        </div>
      )}
    </div>
  );
}
