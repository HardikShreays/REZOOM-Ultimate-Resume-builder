import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, FileText, Layers, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "REZOOM - Build Your Perfect Resume | AI-Powered Resume Builder",
  description: "Create ATS-friendly, professional resumes in minutes with REZOOM. AI-powered resume builder that helps you land your dream job.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f7f5] text-slate-900 transition-colors dark:bg-[#101014] dark:text-slate-100">
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
      </nav>

      <main>
        <section className="border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-[#121217]">
          <div className="mx-auto grid max-w-6xl items-start gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr,1.1fr] lg:pb-28">
            <div>
              <Badge
                variant="outline"
                className="mb-6 border-slate-300 bg-slate-100 text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-600 transition-colors dark:border-slate-700 dark:bg-[#1b1b26] dark:text-slate-300"
              >
                Smart Resume Platform
            </Badge>
              <h1 className="font-serif text-[clamp(3rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-tighter text-slate-900 transition-colors dark:text-slate-100">
                Craft resumes with the weight of a headline story.
            </h1>
              <p className="mt-7 max-w-xl text-[15px] leading-7 text-slate-600 transition-colors sm:text-[16px] sm:leading-8 dark:text-slate-400">
                Position yourself like a feature piece. REZOOM pairs editorial typography with AI precision so your
                experience reads with authority, intention, and a clear narrative arc.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup">
                  <Button size="lg" className="w-full rounded-full px-8 text-xs font-semibold uppercase tracking-[0.28em] sm:w-auto">
                    Build your resume
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border border-slate-300 px-7 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
                  >
                    Explore the demo
              </Button>
                </Link>
            </div>
              <div className="mt-12 grid gap-6 text-sm text-slate-600 transition-colors sm:grid-cols-3 dark:text-slate-400">
                <div className="rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 shadow-sm transition-colors dark:border-slate-600 dark:bg-[#181822]">
                  <span className="font-semibold text-slate-900 transition-colors dark:text-slate-100">10k+</span>
                  <p className="mt-1 leading-6">resumes built with confidence</p>
          </div>
                <div className="rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 shadow-sm transition-colors dark:border-slate-600 dark:bg-[#181822]">
                  <span className="font-semibold text-slate-900 transition-colors dark:text-slate-100">95% pass rate</span>
                  <p className="mt-1 leading-6">through ATS keyword filters</p>
        </div>
                <div className="rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 shadow-sm transition-colors dark:border-slate-600 dark:bg-[#181822]">
                  <span className="font-semibold text-slate-900 transition-colors dark:text-slate-100">4.9 / 5</span>
                  <p className="mt-1 leading-6">average customer satisfaction</p>
                </div>
              </div>
            </div>
            <Card className="border border-slate-200 bg-slate-900 text-slate-50 shadow-xl shadow-slate-900/10 transition-colors dark:border-slate-700 dark:bg-[#1b1b24]">
              <CardHeader className="space-y-5 pb-7">
                <Badge className="w-fit border border-white/20 bg-white/5 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-200 transition-colors dark:border-white/10 dark:bg-white/10 dark:text-slate-50">
                  Preview
                </Badge>
                <CardTitle className="font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-50">
                  Clean, confident spreads in seconds.
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-200/80">
                  Drag-and-drop sections, instant tone refinement, and tailored bullet suggestions aligned to every
                  role.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-4 border-t border-white/10 p-6 text-sm text-slate-200">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors dark:border-white/15 dark:bg-white/5">
                  <Sparkles className="mt-0.5 h-4 w-4 text-slate-50" />
                  <div>
                    <p className="font-serif text-lg font-semibold text-slate-50">AI drafting that sounds like you</p>
                    <p className="mt-1 leading-6 text-slate-200/80">
                      Context-aware prompts help you translate achievements into concise, compelling bullets.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors dark:border-white/15 dark:bg-white/5">
                  <Layers className="mt-0.5 h-4 w-4 text-slate-50" />
                  <div>
                    <p className="font-serif text-lg font-semibold text-slate-50">Flexible sections & layouts</p>
                    <p className="mt-1 leading-6 text-slate-200/80">
                      Swap templates, reorder sections, and tailor each resume to the job in one place.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors dark:border-white/15 dark:bg-white/5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-50" />
                  <div>
                    <p className="font-serif text-lg font-semibold text-slate-50">ATS-ready structure</p>
                    <p className="mt-1 leading-6 text-slate-200/80">
                      Clean markup, consistent typography, and keyword guidance keep you interview-ready.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-24 transition-colors sm:px-6 dark:text-slate-100">
          <div className="grid gap-16 lg:grid-cols-[0.6fr,1fr]">
            <div className="flex flex-col gap-6 border-l-2 border-slate-900 pl-6 transition-colors dark:border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500 transition-colors dark:text-slate-400">
                Editorial Features
              </span>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-slate-900 transition-colors dark:text-slate-100 sm:text-[48px]">
                A focused toolkit for modern job seekers with story to tell.
              </h2>
              <p className="max-w-md text-[15px] leading-7 text-slate-600 transition-colors dark:text-slate-400">
                Every detail is curated like a print spread: bold typographic hierarchy, deliberate spacing, and a single
                accent tone to draw attention to what matters most.
              </p>
              <Link
                href="#pricing"
                className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-slate-700 underline underline-offset-8 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 md:inline-flex"
              >
                Explore plans
              </Link>
                </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-[#16161d]">
                <CardHeader className="space-y-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors dark:border-slate-600 dark:bg-[#1f1f27]">
                    <Sparkles className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </span>
                  <CardTitle className="font-serif text-2xl font-semibold text-slate-900 transition-colors dark:text-slate-100">
                    Guided drafting
                  </CardTitle>
                  <CardDescription className="text-[15px] leading-7 text-slate-600 dark:text-slate-400">
                    Structured prompts surface the language that elevates your highlights to compelling copy.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-[#16161d]">
                <CardHeader className="space-y-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors dark:border-slate-600 dark:bg-[#1f1f27]">
                    <Layers className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </span>
                  <CardTitle className="font-serif text-2xl font-semibold text-slate-900 transition-colors dark:text-slate-100">
                    Reusable building blocks
                  </CardTitle>
                  <CardDescription className="text-[15px] leading-7 text-slate-600 dark:text-slate-400">
                    Save tailored variants for every role and keep tone consistent across applications.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-[#16161d]">
                <CardHeader className="space-y-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors dark:border-slate-600 dark:bg-[#1f1f27]">
                    <ShieldCheck className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </span>
                  <CardTitle className="font-serif text-2xl font-semibold text-slate-900 transition-colors dark:text-slate-100">
                    ATS alignment
                  </CardTitle>
                  <CardDescription className="text-[15px] leading-7 text-slate-600 dark:text-slate-400">
                    Automatic formatting checks and keyword guidance guarantee on-brand, compliant output.
                </CardDescription>
              </CardHeader>
            </Card>
              <Card className="border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-[#16161d]">
                <CardHeader className="space-y-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors dark:border-slate-600 dark:bg-[#1f1f27]">
                    <UserCheck className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </span>
                  <CardTitle className="font-serif text-2xl font-semibold text-slate-900 transition-colors dark:text-slate-100">
                    Personalized share links
                  </CardTitle>
                  <CardDescription className="text-[15px] leading-7 text-slate-600 dark:text-slate-400">
                    Deliver polished resume hubs with supporting collateral and recruiter notes in one link.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

        <section id="workflow" className="border-t border-b border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-[#121217]">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[0.55fr,1fr]">
              <div className="flex flex-col gap-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500 transition-colors dark:text-slate-400">
                  The Process
                </span>
                <h2 className="font-serif text-[44px] font-semibold leading-snug text-slate-900 transition-colors dark:text-slate-100">
                  A workflow composed like an editorial feature.
            </h2>
                <p className="max-w-md text-[15px] leading-7 text-slate-600 transition-colors dark:text-slate-400">
                  Move from raw notes to polished prose in deliberate stages. Each step is defined, with just enough
                  guidance to stay focused on the story you’re presenting.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="group rounded-3xl border border-slate-200 bg-[#f8f7f5] p-8 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-slate-900 dark:border-slate-700 dark:bg-[#181822] dark:hover:border-slate-200"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-900 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition-colors dark:border-slate-100 dark:text-slate-100">
                      {`0${step}`}
                    </span>
                    <h3 className="mt-6 font-serif text-2xl font-semibold text-slate-900 transition-colors dark:text-slate-100">
                      {step === 1 && "Build your profile once"}
                      {step === 2 && "Tailor to every role"}
                      {step === 3 && "Share with confidence"}
                    </h3>
                    <p className="mt-4 text-[15px] leading-7 text-slate-600 transition-colors dark:text-slate-400">
                      {step === 1 &&
                        "Import, refine, and highlight outcomes. Your details live in a structured narrative workspace."}
                      {step === 2 &&
                        "Compare job descriptions, adjust tone instantly, and spotlight the wins that match the brief."}
                      {step === 3 &&
                        "Export editorial-grade PDFs or send a living resume link with instant updates and tracking."}
              </p>
            </div>
                ))}
            </div>
          </div>
        </div>
      </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 transition-colors sm:px-6 dark:text-slate-100">
          <div className="grid gap-14 lg:grid-cols-[1fr,1.2fr]">
            <div>
              <h2 className="font-serif text-[44px] font-semibold leading-snug text-slate-900 transition-colors dark:text-slate-100">
                Choose a plan that scales with your search
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-7 text-slate-600 transition-colors dark:text-slate-400">
                Start free and upgrade when you need deeper insights, collaborative reviews, or unlimited tailored
                resumes.
              </p>
              <div className="mt-12 space-y-4 text-slate-600 transition-colors dark:text-slate-400">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 text-slate-700 dark:text-slate-200" />
                  <span className="text-sm leading-6">
                    Transparent pricing with simple monthly or quarterly billing.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 text-slate-700 dark:text-slate-200" />
                  <span className="text-sm leading-6">
                    Unlimited exports, flexible templates, and shared notes included on every plan.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 text-slate-700 dark:text-slate-200" />
                  <span className="text-sm leading-6">
                    Live support from resume specialists when you want a second set of eyes.
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition-colors dark:border-slate-700 dark:bg-[#16161d]">
                <CardHeader className="space-y-4">
                  <div className="space-y-4">
                    <Badge className="rounded-full bg-slate-100 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700 transition-colors dark:bg-[#1f1f27] dark:text-slate-200">
                      Starter
                    </Badge>
                    <p className="font-serif text-4xl font-semibold text-slate-900 transition-colors dark:text-slate-100">$0</p>
                    <p className="text-[13px] uppercase tracking-[0.22em] text-slate-500 transition-colors dark:text-slate-400">
                      Launch with essentials
                    </p>
                  </div>
                  <ul className="space-y-3 text-[15px] leading-7 text-slate-600 transition-colors dark:text-slate-400">
                    <li>One active resume</li>
                    <li>AI bullet suggestions</li>
                    <li>Shareable resume link</li>
                  </ul>
                  <Button className="w-full rounded-full px-6 text-xs font-semibold uppercase tracking-[0.22em]">
                    Get started
                  </Button>
                </CardHeader>
              </Card>
              <Card className="border border-slate-200 bg-slate-900 text-slate-50 shadow-lg shadow-slate-900/10 transition-colors dark:border-slate-700 dark:bg-[#1b1b24] dark:text-slate-100">
                <CardHeader className="space-y-4">
                  <div className="space-y-4">
                    <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                      Pro
                    </Badge>
                    <p className="font-serif text-4xl font-semibold text-white transition-colors dark:text-slate-100">$18</p>
                    <p className="text-[13px] uppercase tracking-[0.22em] text-slate-200/80">All-access toolkit</p>
                  </div>
                  <ul className="space-y-3 text-[15px] leading-7 text-slate-200/90">
                    <li>Unlimited tailored resumes</li>
                    <li>Collaboration with mentors</li>
                    <li>ATS scoring & change tracking</li>
                  </ul>
                  <Button className="w-full rounded-full bg-white px-6 text-xs font-semibold uppercase tracking-[0.22em] text-slate-900 hover:bg-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                    Upgrade
                  </Button>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-[#0f0f15] dark:text-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 md:grid-cols-[1.3fr,1fr,1fr,1fr]">
            <div className="space-y-4 text-sm leading-6 text-slate-600 transition-colors dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition-colors dark:border-slate-700 dark:bg-[#1f1f27]">
                  <FileText className="h-5 w-5 text-slate-700 transition-colors dark:text-slate-200" />
                </span>
                <span className="text-lg font-semibold text-slate-900 transition-colors dark:text-slate-100">REZOOM</span>
              </div>
              <p>
                A thoughtful resume builder for people who want clarity, control, and consistent results across every job
                search.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 transition-colors dark:text-slate-400">Product</h3>
              <ul className="space-y-3 text-sm text-slate-600 transition-colors dark:text-slate-400">
                <li>
                  <a href="#features" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#workflow" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Workflow
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 transition-colors dark:text-slate-400">Company</h3>
              <ul className="space-y-3 text-sm text-slate-600 transition-colors dark:text-slate-400">
                <li>
                  <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 transition-colors dark:text-slate-400">Support</h3>
              <ul className="space-y-3 text-sm text-slate-600 transition-colors dark:text-slate-400">
                <li>
                  <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 transition-colors dark:border-slate-700 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} REZOOM. Designed for real-world job searches.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                LinkedIn
              </a>
              <a href="#" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                Twitter
              </a>
              <a href="mailto:support@rezoom.app" className="transition hover:text-slate-900 dark:hover:text-slate-100">
                support@rezoom.app
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}