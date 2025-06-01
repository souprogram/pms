import { useState } from "react";
import { Link } from "react-router";
import { useUserProfile } from "../../hooks/use-profile";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginWithPassword, loginWithGoogle, isLoggingIn } = useUserProfile();

  const error =
    loginWithPassword.error?.message || loginWithGoogle.error?.message;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Prijava</CardTitle>

          <CardDescription>
            <div className="flex flex-col gap-4">
              <div className="">Upiši informacije za prijavu</div>

              <Button
                variant="outline"
                onClick={() => loginWithGoogle.mutate()}
              >
                Ili se prijavi s Google accountom
              </Button>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={() => loginWithPassword.mutate({ email, password })}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Lozinka</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Zaboravio si lozinku?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Prijavljivanje..." : "Prijavi se"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Nisi registriran?{" "}
              <Link to="/sign-up" className="underline underline-offset-4">
                Registriraj se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
