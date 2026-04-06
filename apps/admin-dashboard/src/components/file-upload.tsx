"use client";

import { useCallback, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, FileAudio, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/providers/constants";

type FileUploadProps = {
  accept: "image" | "audio";
  value?: string;
  onChange: (url: string) => void;
  className?: string;
};

export function FileUpload({
  accept,
  value,
  onChange,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptMap = {
    image: "image/jpeg,image/png,image/webp,image/gif",
    audio: "audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/aac,audio/ogg",
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const endpoint = accept === "image" ? "image" : "audio";
        const res = await fetch(`${API_URL}/api/upload/${endpoint}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        onChange(data.url);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }
    },
    [accept, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile],
  );

  const Icon = accept === "audio" ? FileAudio : ImageIcon;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center",
          "transition-colors duration-200 cursor-pointer",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          uploading && "pointer-events-none opacity-60",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
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
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground/70">
              {accept === "image"
                ? "JPG, PNG, WebP, GIF (max 10MB)"
                : "MP3, WAV, FLAC, AAC, OGG (max 100MB)"}
            </p>
          </div>
        )}
      </div>

      {value && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm truncate flex-1">
            {value.split("/").pop()}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {value && accept === "image" && (
        <img
          src={value}
          alt="Preview"
          className="h-24 w-24 object-cover rounded-md border"
        />
      )}
    </div>
  );
}
