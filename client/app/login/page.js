'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Eye, EyeOff } from "lucide-react";
import Link from 'next/link';
import api from '@/services/api';
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "Sign In | REZOOM";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      const { token } = response.data;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-12 sm:px-6 lg:px-12">
        <header className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em]">
          <Link href="/" className="flex items-center gap-3 text-foreground/80 transition hover:text-foreground">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card shadow-sm">
              <FileText className="h-5 w-5" />
            </span>
            REZOOM
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle className="h-11 w-11 rounded-full border border-transparent text-foreground/70 hover:text-foreground" />
            <Link href="/signup" className="hidden text-[11px] tracking-[0.28em] text-foreground/50 transition hover:text-foreground md:inline-flex">
              Create account
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-16 py-16 lg:grid-cols-[0.85fr,1fr]">
          <div className="space-y-7">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-foreground/40">
              Sign in to continue
            </span>
            <h1 className="font-serif text-[clamp(2.8rem,4vw,3.8rem)] leading-[1.05] text-foreground">
              Your next role starts with a resume that reads like an editorial feature.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Access your tailored dashboards, AI drafting tools, and curated interview notes. Everything stays in one
              refined workspace built to keep your story consistent.
            </p>
            <div className="grid gap-4 text-[12px] uppercase tracking-[0.22em] text-foreground/60 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/80 bg-card px-6 py-5 shadow-sm">
                <p className="font-serif text-lg text-foreground">Curated experience</p>
                <span className="mt-3 block text-foreground/60">Save multiple resume editions without losing context.</span>
              </div>
              <div className="rounded-3xl border border-border/80 bg-card px-6 py-5 shadow-sm">
                <p className="font-serif text-lg text-foreground">Instant tailoring</p>
                <span className="mt-3 block text-foreground/60">Match every job description in minutes, not hours.</span>
              </div>
            </div>
          </div>

          <Card className="border border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-4">
              <CardTitle className="text-center font-serif text-3xl">Sign in</CardTitle>
              <CardDescription className="text-center text-[14px] uppercase tracking-[0.28em] text-foreground/60">
                Enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 transition hover:text-foreground/80"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full justify-center" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-8 text-center text-[12px] uppercase tracking-[0.24em] text-foreground/60">
                <p>
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-primary transition hover:text-primary/80">
                    Join Rezoom
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="flex items-center justify-between border-t border-border/70 pt-6 text-[11px] uppercase tracking-[0.28em] text-foreground/40">
          <span>© {new Date().getFullYear()} Rezoom Studio</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link href="/" className="transition hover:text-foreground">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
