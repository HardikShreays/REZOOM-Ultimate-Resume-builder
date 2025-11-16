"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, User, ArrowLeft } from "lucide-react";

export function DashboardShell({ user, onLogout, backHref, backLabel = "Back", children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            {backHref ? (
              <Link href={backHref}>
                <Button variant="ghost" size="sm" className="rounded-full border border-transparent px-5 text-[11px] tracking-[0.24em]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backLabel}
                </Button>
              </Link>
            ) : null}
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card shadow-sm">
              <FileText className="h-5 w-5 text-foreground/80" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground/50">Rezoom Studio</p>
              <h1 className="font-serif text-3xl">Editorial Workspace</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle className="h-11 w-11 rounded-full border border-transparent text-foreground/70 hover:text-foreground" />
            {user ? (
              <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-card/80 px-5 py-2 text-[12px] uppercase tracking-[0.24em] text-foreground/70 md:flex">
                <User className="h-4 w-4" />
                {user.name}
              </div>
            ) : null}
            <Button variant="outline" size="sm" onClick={onLogout} className="px-6">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 py-10">{children}</main>

        <footer className="border-t border-border/80 pt-6 text-[11px] uppercase tracking-[0.28em] text-foreground/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Rezoom Studio</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="transition hover:text-foreground">
                Support
              </Link>
              <Link href="/" className="transition hover:text-foreground">
                Settings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


