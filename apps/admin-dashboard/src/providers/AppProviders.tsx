import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { Music } from "lucide-react";
import { BrowserRouter } from "react-router";
import { Toaster } from "../components/refine-ui/notification/toaster";
import { useNotificationProvider } from "../components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "../components/refine-ui/theme/theme-provider";
import { resources } from "../config/resources";
import { authProvider } from "./auth";
import { dataProvider } from "./dataProvider";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              routerProvider={routerProvider}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "s5UdGl-aQMQIX-3IJ2L2",
                title: {
                  text: "Sonic Admin",
                  icon: <Music className="text-primary" />,
                },
                reactQuery: {
                  clientConfig: {
                    defaultOptions: {
                      queries: {
                        staleTime: 5 * 60 * 1000,
                        refetchOnWindowFocus: true,
                        retry: 1,
                      },
                    },
                  },
                },
              }}
            >
              {children}
              <Toaster richColors={true} />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}
