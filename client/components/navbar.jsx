"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800/80 dark:bg-[#16161d]/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold uppercase tracking-[0.18em] text-slate-700 transition-colors dark:text-slate-200"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100 shadow-sm transition-colors dark:border-slate-700 dark:bg-[#1f1f27]">
            <FileText className="h-5 w-5 text-slate-800 transition-colors dark:text-slate-200" />
          </span>
          REZOOM
        </Link>
        <div className="hidden items-center gap-10 text-[12px] font-semibold uppercase tracking-[0.28em] text-slate-500 transition-colors dark:text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Features
          </a>
          <a href="#workflow" className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Workflow
          </a>
          <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-slate-100">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100" />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-full border border-transparent px-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-600"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full px-6 text-xs font-semibold uppercase tracking-[0.22em]">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#16161d] dark:text-slate-300 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            <a href="#features" className="transition hover:text-slate-900 dark:hover:text-slate-100">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-slate-900 dark:hover:text-slate-100">
              Workflow
            </a>
            <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-slate-100">
              Pricing
            </a>
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="w-full rounded-full border border-transparent px-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-600"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full rounded-full px-6 text-xs font-semibold uppercase tracking-[0.22em]">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


