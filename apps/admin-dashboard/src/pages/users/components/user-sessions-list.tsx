import { useState } from "react";
import {
  useSuspenseUserSessions,
  useSuspenseUser,
  useRevokeSession,
  useRevokeAllSessions,
} from "@/hooks/use-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Trash2, UserX } from "lucide-react";

interface UserSessionsListProps {
  userId: string;
}

export function UserSessionsList({ userId }: UserSessionsListProps) {
  const { data: user } = useSuspenseUser(userId);
  const { data: sessions } = useSuspenseUserSessions(userId);
  const revokeSession = useRevokeSession();
  const revokeAllSessions = useRevokeAllSessions();

  const [revokeDialog, setRevokeDialog] = useState<{
    open: boolean;
    token: string;
  }>({ open: false, token: "" });

  const [revokeAllDialog, setRevokeAllDialog] = useState(false);

  return (
    <div className="space-y-4">
      {sessions.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="destructive"
            size="sm"
            className="cursor-pointer"
            onClick={() => setRevokeAllDialog(true)}
          >
            <UserX className="h-4 w-4 mr-1" /> Revoke All
          </Button>
        </div>
      )}

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No active sessions.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead>User Agent</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">
                  {s.ipAddress || "—"}
                </TableCell>
                <TableCell className="max-w-50 truncate text-xs text-muted-foreground">
                  {s.userAgent || "—"}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(s.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(s.expiresAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() =>
                      setRevokeDialog({ open: true, token: s.token })
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={revokeDialog.open}
        onOpenChange={(open) => setRevokeDialog({ ...revokeDialog, open })}
        title="Revoke Session?"
        description="This will force the user to re-authenticate on this device."
        confirmLabel="Revoke"
        onConfirm={() => {
          revokeSession.mutate({ sessionToken: revokeDialog.token });
          setRevokeDialog({ open: false, token: "" });
        }}
      />

      <ConfirmDialog
        open={revokeAllDialog}
        onOpenChange={setRevokeAllDialog}
        title="Revoke All Sessions?"
        description={`This will sign out ${user.name} from all devices.`}
        confirmLabel="Revoke All"
        onConfirm={() => {
          revokeAllSessions.mutate({ userId });
          setRevokeAllDialog(false);
        }}
      />
    </div>
  );
}
