import { Palette, Save, User, UserCheck } from "lucide-react";

export const STEPS = [
  { id: "identity", title: "Identity", icon: User },
  { id: "visuals", title: "Visuals", icon: Palette },
  { id: "socials", title: "Socials & Verification", icon: UserCheck },
  { id: "review", title: "Review", icon: Save },
] as const;
