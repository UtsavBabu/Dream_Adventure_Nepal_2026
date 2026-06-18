import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mountain } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Login — Dream Adventure Nepal" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <a href="/" className="inline-flex items-center gap-2 font-display text-xl">
            <Mountain className="h-5 w-5 text-accent" /> Dream Adventure Nepal
          </a>
          <div>
            <h1 className="font-display text-5xl leading-tight">
              Admin <span className="italic text-gradient-accent">studio</span>
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              Sign in to edit hero, adventures, testimonials, gallery and every detail of your site.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-md space-y-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Welcome back
            </div>
            <h2 className="mt-2 font-display text-3xl text-primary">Sign in to continue</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use the admin credentials you created.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full btn-hero py-6 text-sm font-semibold"
          >
            {busy ? "Please wait…" : "Sign In"}
          </Button>

          <Link to="/" className="block text-center text-xs text-muted-foreground">
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}
