"use client";

import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import { cn } from "@/lib/utils";
import { Music, Loader2 } from "lucide-react";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-8 min-h-svh",
        "bg-linear-to-br from-background via-background to-muted/30",
      )}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary">
          <Music className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Resso Admin</h1>
          <p className="text-xs text-muted-foreground">
            Music Management Platform
          </p>
        </div>
      </div>

      <Card className="w-full max-w-105 shadow-xl border-border/50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold">
            Sign in to your account
          </CardTitle>
          <CardDescription>Enter your admin credentials below</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@resso.app"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        Admin access only. Contact your administrator for credentials.
      </p>
    </div>
  );
};
