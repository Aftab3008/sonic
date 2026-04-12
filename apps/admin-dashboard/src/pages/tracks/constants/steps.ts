import { Disc, Music, Save, Users } from "lucide-react";

export const STEPS = [
  { id: "recording", title: "Audio Recording", icon: Music },
  { id: "album", title: "Album Context", icon: Disc },
  { id: "artists", title: "Track Artists", icon: Users },
  { id: "metadata", title: "Final Details", icon: Save },
] as const;
