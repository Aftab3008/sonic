import { useState } from "react";
import {
  useBanUser,
  useUnbanUser,
  useSetRole,
  useSuspenseUser,
} from "@/hooks/use-admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { Ban, ShieldCheck } from "lucide-react";

interface UserProfileCardProps {
  userId: string;
}

export function UserProfileCard({ userId }: UserProfileCardProps) {
  const { data: user } = useSuspenseUser(userId);
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const setRole = useSetRole();

  const [banDialog, setBanDialog] = useState(false);

  return (
    <>
      <Card className="lg:col-span-1">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="text-2xl">
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <StatusBadge status={user.role} />
            <StatusBadge status={String(user.banned)} />
            <StatusBadge
              status={user.emailVerified ? "verified" : "unverified"}
            />
          </div>
          <Separator />
          <div className="w-full space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
            {user.banned && user.banReason && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ban Reason</span>
                <span className="text-destructive">{user.banReason}</span>
              </div>
            )}
            {user.banned && user.banExpires && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ban Expires</span>
                <span>{new Date(user.banExpires).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <Separator />
          <div className="w-full space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-xs">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language</span>
              <span>{user.lang || "en"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Terms Accepted</span>
              <span>{user.termsAccepted ? "Yes" : "No"}</span>
            </div>
          </div>
          <Separator />
          <div className="w-full space-y-2">
            {user.banned ? (
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => unbanUser.mutate({ userId: user.id })}
              >
                <ShieldCheck className="h-4 w-4 mr-2 text-green-500" /> Unban
                User
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive/80 cursor-pointer"
                onClick={() => setBanDialog(true)}
              >
                <Ban className="h-4 w-4 mr-2" /> Ban User
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() =>
                setRole.mutate({
                  userId: user.id,
                  role: user.role === "admin" ? "user" : "admin",
                })
              }
            >
              Toggle Role → {user.role === "admin" ? "User" : "Admin"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={banDialog}
        onOpenChange={setBanDialog}
        title={`Ban ${user.name}?`}
        description="This will prevent the user from accessing the application."
        confirmLabel="Ban User"
        onConfirm={() => {
          banUser.mutate({ userId: user.id });
          setBanDialog(false);
        }}
      />
    </>
  );
}
