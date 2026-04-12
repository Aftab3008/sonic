import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetAlbums } from "@/hooks/use-album";
import { useCreateTrack } from "@/hooks/use-track";
import { CreateTrackSchema, CreateTrackType } from "@/lib/schema/track.schema";
import { Album } from "@/types/admin.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { STEPS } from "../../constants/steps";
import { RecordingStep } from "./steps/RecordingStep";
import { AlbumStep } from "./steps/AlbumStep";
import { ArtistStep } from "./steps/ArtistStep";
import { ReviewStep } from "./steps/ReviewStep";

export function TrackCreateForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecordingTitle, setSelectedRecordingTitle] = useState("");

  const { data: albumsResponse } = useGetAlbums({ pageSize: 100 });
  const createTrack = useCreateTrack();

  const form = useForm<CreateTrackType>({
    resolver: zodResolver(CreateTrackSchema),
    defaultValues: {
      recordingId: "",
      albumId: "",
      trackNumber: 1,
      discNumber: 1,
      artistIds: [],
      overrideTitle: "",
      coverImageUrl: "",
      overrideIsExplicit: false,
    },
  });

  const { isSubmitting } = form.formState;
  const selectedAlbumId = form.watch("albumId");
  const selectedAlbum = albumsResponse?.data?.find(
    (a: Album) => a.id === selectedAlbumId,
  );
  const selectedAlbumTitle = selectedAlbum?.title || "";

  const onSubmit = async (values: CreateTrackType) => {
    try {
      await createTrack.mutateAsync(values, {
        onSuccess: () => {
          toast.success("Track created successfully");
          navigate("/tracks");
        },
        onError: () => {
          toast.error("Failed to create track");
        },
      });
    } catch {
      console.error("Failed to create track");
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!form.watch("recordingId");
      case 1:
        return !!form.watch("albumId");
      case 2:
        return (form.watch("artistIds") || []).length > 0;
      case 3:
        return !!form.watch("trackNumber");
      default:
        return false;
    }
  };

  return (
    <CreateView>
      <CreateViewHeader />

      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isComplete
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-border mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 0 && (
            <RecordingStep
              form={form}
              onRecordingSelected={setSelectedRecordingTitle}
            />
          )}

          {currentStep === 1 && <AlbumStep form={form} />}

          {currentStep === 2 && <ArtistStep form={form} />}

          {currentStep === 3 && (
            <ReviewStep
              form={form}
              selectedRecordingTitle={selectedRecordingTitle}
              selectedAlbumTitle={selectedAlbumTitle}
            />
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Track...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Track
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </CreateView>
  );
}
