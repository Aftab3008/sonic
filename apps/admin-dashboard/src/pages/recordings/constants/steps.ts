import { FileAudio, Music, Users } from "lucide-react";

export const STEPS = [
  { id: "metadata", title: "Recording Details", icon: Music },
  { id: "artists", title: "Artists", icon: Users },
  { id: "audio", title: "Upload Audio", icon: FileAudio },
] as const;
