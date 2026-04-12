import { ResourceProps } from "@refinedev/core";
import { Disc3, LayoutDashboard, Mic2, Music, Radio, Tags, Users } from "lucide-react";

export const resources: ResourceProps[] = [
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
    name: "recordings",
    list: "/recordings",
    create: "/recordings/create",
    edit: "/recordings/edit/:id",
    show: "/recordings/show/:id",
    meta: {
      label: "Recordings",
      icon: <Radio size={18} />,
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
];
