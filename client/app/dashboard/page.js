 'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/shell";
import { FileText, User, Plus, Eye } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user) {
      document.title = `Dashboard – ${user.name} | REZOOM`;
    } else {
      document.title = "Dashboard | REZOOM";
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/50 border-t-primary"></div>
          <p className="text-[12px] uppercase tracking-[0.3em] text-foreground/60">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <section className="grid gap-12 border-b border-border/80 pb-12 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-6">
          <Badge className="border-border/60 bg-accent/80 text-foreground/60">Dashboard overview</Badge>
          <h2 className="font-serif text-[clamp(2.8rem,4vw,3.6rem)] leading-[1.05]">
            Welcome back, {user?.name}. Your narrative is ready to evolve.
          </h2>
          <p className="max-w-md text-[15px] leading-8 text-foreground/70">
            Continue refining your story, keep experiences aligned with the roles you want next, and generate resume
            editions that read with clarity and authority.
          </p>
          <div className="grid gap-4 text-[12px] uppercase tracking-[0.24em] text-foreground/60 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-card/90 px-6 py-5 shadow-sm">
              <p className="font-serif text-lg text-foreground">Profile integrity</p>
              <span className="mt-2 block text-foreground/60">
                Ensure every section is complete before exporting new resumes.
              </span>
            </div>
            <div className="rounded-3xl border border-border/80 bg-card/90 px-6 py-5 shadow-sm">
              <p className="font-serif text-lg text-foreground">Narrative consistency</p>
              <span className="mt-2 block text-foreground/60">
                Reuse bullet libraries to stay consistent across every application.
              </span>
            </div>
          </div>
        </div>

        <Card className="border border-border/70 bg-card/90">
          <CardHeader className="space-y-4">
            <CardTitle className="font-serif text-3xl">View complete profile</CardTitle>
            <CardDescription className="text-[15px] leading-7 text-foreground/70">
              Review every section—from experience highlights to skills—before generating a fresh resume edition.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pb-10">
            <div className="rounded-3xl border border-border/60 bg-accent/40 px-5 py-4 text-[12px] uppercase tracking-[0.24em] text-foreground/60">
              Last updated{" "}
              <span className="font-semibold text-foreground">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "recently"}
              </span>
            </div>
            <Link href="/dashboard/profile">
              <Button size="lg" className="w-full justify-center">
                <Eye className="mr-2 h-4 w-4" />
                Review profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border/70 bg-card/90 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg uppercase tracking-[0.24em]">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Maintain your bio, contact details, and headline statement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-[13px] uppercase tracking-[0.24em] text-foreground/60">Email · {user?.email}</p>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full justify-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/90 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-[0.24em]">Skills</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Curate the technical and human skills you want recruiters to notice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/skills">
                <Button className="w-full justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage skills
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/90 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-[0.24em]">Projects</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Showcase deliverables, impact metrics, and collaborators for each project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/projects">
                <Button className="w-full justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage projects
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/90 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-[0.24em]">Experience</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Document roles with quantifiable impact and key achievements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/experience">
                <Button className="w-full justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage experience
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/90 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-[0.24em]">Education</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Capture academic background, honors, and relevant coursework.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/education">
                <Button className="w-full justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage education
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/90 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-[0.24em]">Certifications</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Add credentials that reinforce expertise and ongoing learning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/certifications">
                <Button className="w-full justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage certifications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <Card className="border border-dashed border-border/70 bg-card/80 text-center">
          <CardContent className="flex flex-col items-center gap-6 py-12">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border/60 bg-card">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-serif text-3xl">Ready to craft your next edition?</h3>
            <p className="max-w-md text-[15px] leading-7 text-foreground/70">
              Generate an ATS-optimized resume that mirrors your latest updates. Switch templates, tailor bullets, and
              export in seconds.
            </p>
            <Link href="/dashboard/resumes">
              <Button size="lg" className="px-8">
                Generate resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}