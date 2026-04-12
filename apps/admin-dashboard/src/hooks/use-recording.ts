import { recordingKeys } from "@/lib/react-query/query-keys";
import { CreateRecordingType } from "@/lib/schema/recording.schema";
import { kyInstance } from "@/providers/dataProvider";
import { Recording, StandardResponse } from "@/types/admin.types";
import { useInvalidate } from "@refinedev/core";
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useGetAllRecordings = () => {
  return useQuery({
    queryKey: recordingKeys.allList(),
    queryFn: async () => {
      const res = await kyInstance
        .get("recordings/all")
        .json<
          StandardResponse<
            {
              id: string;
              title: string;
              audioProcessStatus: string;
              durationMs?: number;
            }[]
          >
        >();
      return res.data;
    },
  });
};


export const useGetRecording = (recordingId: string | null) => {
  return useQuery({
    queryKey: recordingKeys.details(recordingId || ""),
    queryFn: async () => {
      if (!recordingId) return null;
      const res = await kyInstance
        .get(`recordings/${recordingId}`)
        .json<StandardResponse<Recording>>();
      return res.data;
    },
    enabled: !!recordingId,
  });
};

export const useGetRecordingDetails = ({
  recordingId,
}: {
  recordingId: string;
}) => {
  return useSuspenseQuery({
    queryKey: recordingKeys.details(recordingId),
    queryFn: async () => {
      const res = await kyInstance
        .get(`recordings/${recordingId}`)
        .json<StandardResponse<Recording>>();
      return res.data;
    },
  });
};


export const useGetRecordings = (params?: {
  search?: string;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: recordingKeys.list(params?.search || ""),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.pageSize)
        searchParams.set("pageSize", params.pageSize.toString());

      const res = await kyInstance
        .get(`recordings?${searchParams}`)
        .json<
          StandardResponse<{
            data: Recording[];
            hasNextPage: boolean;
            nextCursor?: string;
          }>
        >();
      return res.data;
    },
  });
};


export const useCreateRecording = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (data: CreateRecordingType) => {
      const res = await kyInstance
        .post("recordings", { json: data })
        .json<StandardResponse<Recording>>();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recordingKeys.allList() });
      invalidate({
        resource: "recordings",
        invalidates: ["list", "many"],
      });
    },
  });
};

export const useUpdateRecording = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateRecordingType>;
    }) => {
      const res = await kyInstance
        .patch(`recordings/${id}`, { json: data })
        .json<StandardResponse<Recording>>();
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: recordingKeys.details(data.id),
      });
      queryClient.invalidateQueries({ queryKey: recordingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recordingKeys.allList() });
      invalidate({
        resource: "recordings",
        invalidates: ["list", "many", "detail"],
        id: data.id,
      });
    },
  });
};


export const useDeleteRecording = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (recordingId: string) => {
      await kyInstance.delete(`recordings/${recordingId}`).json();
    },
    onSuccess: (_, recordingId) => {
      queryClient.invalidateQueries({ queryKey: recordingKeys.all });
      invalidate({
        resource: "recordings",
        invalidates: ["list", "many", "detail"],
        id: recordingId,
      });
    },
  });
};


export const useUpdateRecordingAudio = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async ({
      recordingId,
      audioUrl,
      durationMs,
    }: {
      recordingId: string;
      audioUrl: string;
      durationMs: number;
    }) => {
      const res = await kyInstance
        .patch(`recordings/${recordingId}`, {
          json: { audioUrl, durationMs, audioProcessStatus: "UPLOADED" },
        })
        .json<StandardResponse<Recording>>();
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: recordingKeys.details(data.id),
      });
      queryClient.invalidateQueries({ queryKey: recordingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recordingKeys.allList() });
      invalidate({
        resource: "recordings",
        invalidates: ["list", "many", "detail"],
        id: data.id,
      });
    },
  });
};
