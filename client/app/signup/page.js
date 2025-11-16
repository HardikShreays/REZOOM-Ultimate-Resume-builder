'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Sign Up | REZOOM";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await api.post("/auth/signup", signupData);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <Card className="border border-border/70 bg-card/95 px-10 py-12 text-center shadow-[0_24px_48px_-28px_rgba(14,14,22,0.45)]">
            <CardContent className="space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <CheckCircle className="h-9 w-9 text-primary" />
              </div>
              <h2 className="font-serif text-3xl">Account ready</h2>
              <p className="text-[14px] uppercase tracking-[0.28em] text-foreground/60">
                Redirecting to your editorial workspace
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <ThemeToggle className="h-11 w-11 rounded-full border border-transparent text-foreground/70 hover:text-foreground" />
        </header>

        <div className="grid flex-1 items-center gap-16 py-16 lg:grid-cols-[0.9fr,1fr]">
          <div className="space-y-7">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-foreground/40">
              Create your account
            </span>
            <h1 className="font-serif text-[clamp(3rem,4vw,4rem)] leading-[1.04] text-foreground">
              Build an editorial-grade resume library tailored to every role.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Produce polished narratives for each application, collaborate with mentors, and keep your personal brand
              consistent across every interview.
            </p>
            <div className="space-y-4 text-[12px] uppercase tracking-[0.22em] text-foreground/60">
              <div className="rounded-3xl border border-border/80 bg-card px-6 py-5 shadow-sm">
                <p className="font-serif text-lg text-foreground">Unlimited tailored resumes</p>
                <span className="mt-3 block text-foreground/60">
                  Save versions for each opportunity with guided recommendations at every step.
                </span>
              </div>
              <div className="rounded-3xl border border-border/80 bg-card px-6 py-5 shadow-sm">
                <p className="font-serif text-lg text-foreground">AI story coaching</p>
                <span className="mt-3 block text-foreground/60">
                  Translate projects into precise, results-driven copy aligned with job requirements.
                </span>
              </div>
            </div>
          </div>

          <Card className="border border-border/70 bg-card/90 backdrop-blur">
            <CardHeader className="space-y-4">
              <CardTitle className="text-center font-serif text-3xl">Join Rezoom</CardTitle>
              <CardDescription className="text-center text-[14px] uppercase tracking-[0.28em] text-foreground/60">
                It takes less than two minutes
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
                  <label htmlFor="name" className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Full name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                    required
                  />
                </div>

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
                      placeholder="Create a password"
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

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 transition hover:text-foreground/80"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full justify-center" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <div className="mt-8 text-center text-[12px] uppercase tracking-[0.24em] text-foreground/60">
                <p>
                  Already a member?{" "}
                  <Link href="/login" className="text-primary transition hover:text-primary/80">
                    Sign in
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
              Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
