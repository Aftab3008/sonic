import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateAlbum } from "@/hooks/use-album";
import { CreateAlbumSchema, CreateAlbumType } from "@/lib/schema/album.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { STEPS } from "../../constants/steps";
import { DetailsStep } from "./steps/DetailsStep";
import { ArtworkStep } from "./steps/ArtworkStep";
import { ArtistsGenresStep } from "./steps/ArtistsGenresStep";
import { MetadataStep } from "./steps/MetadataStep";
import { ReviewStep } from "./steps/ReviewStep";

export function AlbumCreateForm() {
  const createAlbum = useCreateAlbum();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<CreateAlbumType>({
    resolver: zodResolver(CreateAlbumSchema),
    defaultValues: {
      title: "",
      releaseDate: "",
      albumType: "ALBUM",
      releaseStatus: "DRAFT",
      coverImageUrl: "",
      artistIds: [],
      genreIds: [],
      upc: "",
      recordLabel: "",
      copyright: "",
    },
  });

  const { isSubmitting } = form.formState;

  const nextStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields as any);
    
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 0:
        return ["title", "releaseDate", "albumType", "releaseStatus"];
      case 1:
        return ["coverImageUrl"];
      case 2:
        return ["artistIds", "genreIds"];
      case 3:
        return ["upc", "recordLabel", "copyright"];
      default:
        return [];
    }
  };

  const handleOnFinish = async (values: CreateAlbumType) => {
    try {
      const artists = values.artistIds?.map((a) => ({
        artistId: a.artistId,
        role: a.role,
      }));

      await createAlbum.mutateAsync(
        {
          ...values,
          artistIds: artists,
        },
        {
          onSuccess: () => {
            toast.success("Album created successfully");
            navigate("/albums");
          },
          onError: () => {
            toast.error("Failed to create album");
          },
        },
      );
    } catch {
      console.error("Failed to create album");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!form.watch("title") && !!form.watch("releaseDate");
      case 1:
        return true; // Artwork is optional
      case 2:
        return (form.watch("artistIds") || []).length > 0;
      case 3:
        return true;
      case 4:
        return true;
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
        <form
          onSubmit={form.handleSubmit(handleOnFinish)}
          className="space-y-6"
        >
          {currentStep === 0 && <DetailsStep form={form} />}
          {currentStep === 1 && <ArtworkStep form={form} />}
          {currentStep === 2 && <ArtistsGenresStep form={form} />}
          {currentStep === 3 && <MetadataStep form={form} />}
          {currentStep === 4 && <ReviewStep form={form} />}

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
                    Creating Album...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Album
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
