import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateArtist } from "@/hooks/use-artist";
import {
  CreateArtistSchema,
  CreateArtistType,
} from "@/lib/schema/artist.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { STEPS } from "../../constants/steps";
import { IdentityStep } from "./steps/IdentityStep";
import { VisualsStep } from "./steps/VisualsStep";
import { SocialsStep } from "./steps/SocialsStep";
import { ReviewStep } from "./steps/ReviewStep";

export function ArtistCreateForm() {
  const createArtist = useCreateArtist();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<CreateArtistType>({
    resolver: zodResolver(CreateArtistSchema),
    defaultValues: {
      name: "",
      slug: "",
      bio: "",
      imageUrl: "",
      headerImageUrl: "",
      isVerified: false,
      socialLinks: {
        instagram: "",
        twitter: "",
        website: "",
      },
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
        return ["name", "slug", "bio"];
      case 1:
        return ["imageUrl", "headerImageUrl"];
      case 2:
        return ["isVerified", "socialLinks.instagram", "socialLinks.twitter", "socialLinks.website"];
      default:
        return [];
    }
  };

  const handleOnFinish = async (values: CreateArtistType) => {
    try {
      await createArtist.mutateAsync(values, {
        onSuccess: () => {
          toast.success("Artist created successfully");
          navigate("/artists");
        },
        onError: () => {
          toast.error("Failed to create artist");
        },
      });
    } catch {
      console.error("Failed to create artist");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!form.watch("name") && !!form.watch("slug");
      case 1:
        return true; // Images are optional
      case 2:
        return true; // Socials are optional
      case 3:
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
          {currentStep === 0 && <IdentityStep form={form} />}
          {currentStep === 1 && <VisualsStep form={form} />}
          {currentStep === 2 && <SocialsStep form={form} />}
          {currentStep === 3 && <ReviewStep form={form} />}

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
                    Creating Artist...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Artist
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
