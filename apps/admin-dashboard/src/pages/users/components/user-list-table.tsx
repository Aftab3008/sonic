import { useState } from "react";
import {
  useSuspenseListUsers,
  useBanUser,
  useUnbanUser,
} from "@/hooks/use-admin";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { Eye, Ban, ShieldCheck } from "lucide-react";
import type { ListUsersParams, User } from "../../../types/admin.types";

interface UserListTableProps {
  params: ListUsersParams;
}

export function UserListTable({ params }: UserListTableProps) {
  const navigate = useNavigate();
  const { data } = useSuspenseListUsers(params);
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  const [banDialog, setBanDialog] = useState<{
    open: boolean;
    userId: string;
    name: string;
  }>({ open: false, userId: "", name: "" });
  const [banReason, setBanReason] = useState("");

  const users = data?.users ?? [];

  if (users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={7}
            className="text-center py-8 text-muted-foreground"
          >
            No users found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {users.map((user: User) => (
          <TableRow
            key={user.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/users/show/${user.id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} />
                  <AvatarFallback>
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {user.email}
            </TableCell>
            <TableCell>
              <StatusBadge status={user.role || "user"} />
            </TableCell>
            <TableCell>
              <StatusBadge status={String(!!user.banned)} />
            </TableCell>
            <TableCell>
              <StatusBadge
                status={user.emailVerified ? "verified" : "unverified"}
              />
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div
                className="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => navigate(`/users/show/${user.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {user.banned ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => unbanUser.mutate({ userId: user.id })}
                  >
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => {
                      setBanDialog({
                        open: true,
                        userId: user.id,
                        name: user.name,
                      });
                      setBanReason("");
                    }}
                  >
                    <Ban className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <ConfirmDialog
        open={banDialog.open}
        onOpenChange={(open) => setBanDialog({ ...banDialog, open })}
        title={`Ban ${banDialog.name}?`}
        description="This will prevent the user from accessing the application."
        confirmLabel="Ban User"
        onConfirm={() => {
          banUser.mutate({
            userId: banDialog.userId,
            banReason: banReason || undefined,
          });
          setBanDialog({ open: false, userId: "", name: "" });
        }}
      >
        <div className="space-y-2">
          <Label>Ban Reason (optional)</Label>
          <Textarea
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Reason for banning..."
          />
        </div>
      </ConfirmDialog>
    </>
  );
}
