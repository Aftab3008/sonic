import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 border border-dashed rounded-lg bg-muted/50 w-full h-full min-h-[150px]">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="space-y-1">
            <h3 className="font-medium text-sm">
              {this.props.fallback || "Failed to load component"}
            </h3>
            <p className="text-xs text-muted-foreground break-words max-w-[250px]">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
            }}
          >
            <RefreshCcw className="h-3 w-3 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
