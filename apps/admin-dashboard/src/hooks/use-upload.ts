import { kyInstance } from "@/providers/dataProvider";
import { StandardResponse } from "@/types/admin.types";
import { useMutation } from "@tanstack/react-query";

/**
 * Get audio duration from a File via the browser's Audio API.
 * Returns duration in milliseconds, or undefined if metadata can't be read.
 */
function getAudioDuration(file: File): Promise<number | undefined> {
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
}

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  fileUrl: string;
}

/**
 * Hook for uploading recording audio via the presigned URL flow:
 * 1. Get presigned URL from backend (includes final fileUrl)
 * 2. Upload file to S3 using presigned URL
 * 3. Return the permanent file URL and audio duration
 *
 * The caller is responsible for updating the recording's audioUrl/durationMs
 * via useUpdateRecordingAudio after this succeeds.
 */
export const usePresignedAudioUpload = () => {
  return useMutation({
    mutationFn: async ({
      file,
      recordingId,
    }: {
      file: File;
      recordingId: string;
    }) => {
      const presignedRes = await kyInstance
        .get("upload/presigned-url/recording-audio", {
          searchParams: {
            filename: file.name,
            contentType: file.type,
            recordingId,
          },
        })
        .json<StandardResponse<PresignedUrlResponse>>();

      const { uploadUrl, fileUrl } = presignedRes.data;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("S3 upload failed");
      }

      const durationMs = await getAudioDuration(file);

      return { fileUrl, durationMs };
    },
  });
};

/**
 * Hook for uploading images via the presigned URL flow.
 * Backend returns the permanent fileUrl — no client-side URL construction.
 */
export const usePresignedImageUpload = () => {
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // Step 1: Get presigned URL from backend
      const presignedRes = await kyInstance
        .get("upload/presigned-url/image", {
          searchParams: {
            filename: file.name,
            contentType: file.type,
          },
        })
        .json<StandardResponse<PresignedUrlResponse>>();

      const { uploadUrl, fileUrl } = presignedRes.data;

      // Step 2: Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("S3 upload failed");
      }

      return { fileUrl };
    },
  });
};
