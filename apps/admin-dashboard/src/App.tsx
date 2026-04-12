import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import "./App.css";
import {
  DashboardSkeleton,
  FormSkeleton,
  ListSkeleton,
  ShowSkeleton,
} from "./components/page-skeletons";
import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import {
  AlbumCreate,
  AlbumEdit,
  AlbumsList,
  AlbumDetails,
  ArtistCreate,
  ArtistEdit,
  ArtistsList,
  ArtistDetails,
  Dashboard,
  GenreCreate,
  GenreEdit,
  GenresList,
  Login,
  RecordingCreate,
  RecordingDetails,
  RecordingEdit,
  RecordingsList,
  TrackCreate,
  TrackEdit,
  TrackList,
  TrackDetails,
  UsersList,
  UserDetails,
} from "./config/lazy-pages";
import { AppProviders } from "./providers/AppProviders";

function App() {
  return (
    <AppProviders>
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
          <Route
            index
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route path="/artists">
            <Route
              index
              element={
                <Suspense fallback={<ListSkeleton />}>
                  <ArtistsList />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <ArtistCreate />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <ArtistEdit />
                </Suspense>
              }
            />
            <Route
              path="show/:id"
              element={
                <Suspense fallback={<ShowSkeleton />}>
                  <ArtistDetails />
                </Suspense>
              }
            />
          </Route>

          <Route path="/albums">
            <Route
              index
              element={
                <Suspense fallback={<ListSkeleton />}>
                  <AlbumsList />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <AlbumCreate />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <AlbumEdit />
                </Suspense>
              }
            />
            <Route
              path="show/:id"
              element={
                <Suspense fallback={<ShowSkeleton />}>
                  <AlbumDetails />
                </Suspense>
              }
            />
          </Route>

          <Route path="/tracks">
            <Route
              index
              element={
                <Suspense fallback={<ListSkeleton />}>
                  <TrackList />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <TrackCreate />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <TrackEdit />
                </Suspense>
              }
            />
            <Route
              path="show/:id"
              element={
                <Suspense fallback={<ShowSkeleton />}>
                  <TrackDetails />
                </Suspense>
              }
            />
          </Route>

          <Route path="/recordings">
            <Route
              index
              element={
                <Suspense fallback={<ListSkeleton />}>
                  <RecordingsList />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <RecordingCreate />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <RecordingEdit />
                </Suspense>
              }
            />
            <Route
              path="show/:id"
              element={
                <Suspense fallback={<ShowSkeleton />}>
                  <RecordingDetails />
                </Suspense>
              }
            />
          </Route>

          <Route path="/genres">
            <Route
              index
              element={
                <Suspense fallback={<ListSkeleton />}>
                  <GenresList />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <GenreCreate />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<FormSkeleton />}>
                  <GenreEdit />
                </Suspense>
              }
            />
          </Route>

          <Route path="/users">
            <Route
              index
              element={
                <Suspense fallback={<ListSkeleton />}>
                  <UsersList />
                </Suspense>
              }
            />
            <Route
              path="show/:id"
              element={
                <Suspense fallback={<ShowSkeleton />}>
                  <UserDetails />
                </Suspense>
              }
            />
          </Route>

          <Route path="*" element={<ErrorComponent />} />
        </Route>

        <Route
          element={
            <Authenticated key="authenticated-auth" fallback={<Outlet />}>
              <NavigateToResource />
            </Authenticated>
          }
        >
          <Route
            path="/login"
            element={
              <Suspense fallback={<FormSkeleton />}>
                <Login />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </AppProviders>
  );
}

export default App;
