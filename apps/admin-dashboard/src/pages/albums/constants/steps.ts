import { Disc, Image, Save, Tag, Users } from "lucide-react";

export const STEPS = [
  { id: "details", title: "Album Details", icon: Disc },
  { id: "artwork", title: "Cover Art", icon: Image },
  { id: "artists-genres", title: "Artists & Genres", icon: Users },
  { id: "metadata", title: "Label & Metadata", icon: Tag },
  { id: "review", title: "Review", icon: Save },
] as const;
