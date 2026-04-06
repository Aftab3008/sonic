import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { Disc3, LayoutDashboard, Mic2, Music, Tags, Users } from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { AlbumCreate } from "./pages/albums/create";
import { AlbumEdit } from "./pages/albums/edit";
import { AlbumList } from "./pages/albums/list";
import { AlbumShow } from "./pages/albums/show";
import { ArtistCreate } from "./pages/artists/create";
import { ArtistEdit } from "./pages/artists/edit";
import { ArtistList } from "./pages/artists/list";
import { ArtistShow } from "./pages/artists/show";
import { DashboardPage } from "./pages/dashboard";
import { GenreCreate } from "./pages/genres/create";
import { GenreEdit } from "./pages/genres/edit";
import { GenreList } from "./pages/genres/list";
import { Login } from "./pages/login";
import { TrackCreate } from "./pages/tracks/create";
import { TrackEdit } from "./pages/tracks/edit";
import { TrackList } from "./pages/tracks/list";
import { TrackShow } from "./pages/tracks/show";
import { UserList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              authProvider={authProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <LayoutDashboard size={18} />,
                  },
                },
                {
                  name: "artists",
                  list: "/artists",
                  create: "/artists/create",
                  edit: "/artists/edit/:id",
                  show: "/artists/show/:id",
                  meta: {
                    label: "Artists",
                    icon: <Mic2 size={18} />,
                  },
                },
                {
                  name: "albums",
                  list: "/albums",
                  create: "/albums/create",
                  edit: "/albums/edit/:id",
                  show: "/albums/show/:id",
                  meta: {
                    label: "Albums",
                    icon: <Disc3 size={18} />,
                  },
                },
                {
                  name: "tracks",
                  list: "/tracks",
                  create: "/tracks/create",
                  edit: "/tracks/edit/:id",
                  show: "/tracks/show/:id",
                  meta: {
                    label: "Tracks",
                    icon: <Music size={18} />,
                  },
                },
                {
                  name: "genres",
                  list: "/genres",
                  create: "/genres/create",
                  edit: "/genres/edit/:id",
                  meta: {
                    label: "Genres",
                    icon: <Tags size={18} />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  show: "/users/show/:id",
                  meta: {
                    label: "Users",
                    icon: <Users size={18} />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "s5UdGl-aQMQIX-3IJ2L2",
                title: {
                  text: "Resso Admin",
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
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />

                  <Route path="/artists">
                    <Route index element={<ArtistList />} />
                    <Route path="create" element={<ArtistCreate />} />
                    <Route path="edit/:id" element={<ArtistEdit />} />
                    <Route path="show/:id" element={<ArtistShow />} />
                  </Route>

                  <Route path="/albums">
                    <Route index element={<AlbumList />} />
                    <Route path="create" element={<AlbumCreate />} />
                    <Route path="edit/:id" element={<AlbumEdit />} />
                    <Route path="show/:id" element={<AlbumShow />} />
                  </Route>

                  <Route path="/tracks">
                    <Route index element={<TrackList />} />
                    <Route path="create" element={<TrackCreate />} />
                    <Route path="edit/:id" element={<TrackEdit />} />
                    <Route path="show/:id" element={<TrackShow />} />
                  </Route>

                  <Route path="/genres">
                    <Route index element={<GenreList />} />
                    <Route path="create" element={<GenreCreate />} />
                    <Route path="edit/:id" element={<GenreEdit />} />
                  </Route>

                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="show/:id" element={<UserShow />} />
                  </Route>

                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                <Route
                  element={
                    <Authenticated
                      key="authenticated-auth"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
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

export default App;
