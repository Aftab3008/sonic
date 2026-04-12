import { lazy } from "react";

export const Dashboard = lazy(() =>
  import("../pages/dashboard/Dashboard").then((m) => ({
    default: m.Dashboard,
  })),
);

export const ArtistsList = lazy(() =>
  import("../pages/artists/ArtistsList").then((m) => ({
    default: m.ArtistsList,
  })),
);
export const ArtistCreate = lazy(() =>
  import("../pages/artists/ArtistCreate").then((m) => ({
    default: m.ArtistCreate,
  })),
);
export const ArtistEdit = lazy(() =>
  import("../pages/artists/ArtistEdit").then((m) => ({
    default: m.ArtistEdit,
  })),
);
export const ArtistDetails = lazy(() =>
  import("../pages/artists/ArtistDetails").then((m) => ({
    default: m.ArtistDetails,
  })),
);

export const AlbumsList = lazy(() =>
  import("../pages/albums/AlbumsList").then((m) => ({ default: m.AlbumsList })),
);
export const AlbumCreate = lazy(() =>
  import("../pages/albums/AlbumCreate").then((m) => ({
    default: m.AlbumCreate,
  })),
);
export const AlbumEdit = lazy(() =>
  import("../pages/albums/AlbumEdit").then((m) => ({ default: m.AlbumEdit })),
);
export const AlbumDetails = lazy(() =>
  import("../pages/albums/AlbumDetails").then((m) => ({
    default: m.AlbumDetails,
  })),
);

export const TrackList = lazy(() =>
  import("../pages/tracks/TracksList").then((m) => ({ default: m.TracksList })),
);
export const TrackCreate = lazy(() =>
  import("../pages/tracks/TrackCreate").then((m) => ({
    default: m.TrackCreate,
  })),
);
export const TrackEdit = lazy(() =>
  import("../pages/tracks/TrackEdit").then((m) => ({ default: m.TrackEdit })),
);
export const TrackDetails = lazy(() =>
  import("../pages/tracks/TrackDetails").then((m) => ({
    default: m.TrackDetails,
  })),
);

export const RecordingsList = lazy(() =>
  import("../pages/recordings/RecordingsList").then((m) => ({
    default: m.RecordingsList,
  })),
);
export const RecordingCreate = lazy(() =>
  import("../pages/recordings/RecordingCreate").then((m) => ({
    default: m.RecordingCreate,
  })),
);
export const RecordingEdit = lazy(() =>
  import("../pages/recordings/RecordingEdit").then((m) => ({
    default: m.RecordingEdit,
  })),
);
export const RecordingDetails = lazy(() =>
  import("../pages/recordings/RecordingDetails").then((m) => ({
    default: m.RecordingDetails,
  })),
);

export const GenresList = lazy(() =>
  import("../pages/genres/GenresList").then((m) => ({ default: m.GenresList })),
);
export const GenreCreate = lazy(() =>
  import("../pages/genres/GenreCreate").then((m) => ({
    default: m.GenreCreate,
  })),
);
export const GenreEdit = lazy(() =>
  import("../pages/genres/GenreEdit").then((m) => ({ default: m.GenreEdit })),
);

export const UsersList = lazy(() =>
  import("../pages/users/UsersList").then((m) => ({ default: m.UsersList })),
);
export const UserDetails = lazy(() =>
  import("../pages/users/UserDetails").then((m) => ({
    default: m.UserDetails,
  })),
);

export const Login = lazy(() =>
  import("../pages/login/Login").then((m) => ({ default: m.Login })),
);
