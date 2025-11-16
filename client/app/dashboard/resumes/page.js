'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  Plus,
  Trash2,
  FileText,
  FileDown,
  RefreshCw,
  Settings,
  Palette,
  FileImage
} from "lucide-react";
import api from '@/services/api';

export default function ResumesPage() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('ats-friendly');
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [openPdf, setopenPdf] = useState(false)

  const templates = [
    {
      id: 'ats-friendly',
      name: 'ATS-Friendly',
      description: 'Clean, professional format optimized for ATS systems',
      features: ['ATS Optimized', 'Professional', 'Clean Layout']
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Modern professional format with enhanced styling',
      features: ['Modern Design', 'Enhanced Styling', 'Professional']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Creative format with visual elements',
      features: ['Creative Design', 'Visual Elements', 'Stand Out']
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchResumes();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Set page title dynamically
  useEffect(() => {
    if (user) {
      document.title = `Resume Builder - ${user.name} | REZOOM`;
    } else {
      document.title = 'Resume Builder | REZOOM';
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/profile/resumes');
      setResumes(response.data.resumes);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handleGenerateResume = async (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) {
      setError('Please enter a resume title');
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/profile/resumes', {
        title: resumeTitle,
        template: selectedTemplate
      });
      
      setSuccess('Resume generated successfully!');
      setResumeTitle('');
      setShowForm(false);
      await fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await api.delete(`/profile/resumes/${resumeId}`);
      await fetchResumes();
      setSuccess('Resume deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };



  const handleViewPDF = async (resume) => {
    setopenPdf(true);
    setError(''); // Clear any previous errors
    
    try {
      // Use the same API service that handles CORS properly
      const response = await api.get(`/profile/resumes/${resume.id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (err) {
      console.error('PDF view error:', err);
      setError('Failed to open PDF preview');
    } finally {
      // Always reset the loading state
      setopenPdf(false);
    }
  };

  const handleDownloadPDF = async (resume) => {
    try {
      const response = await api.get(`/profile/resumes/${resume.id}/pdf`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume-${user.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download PDF');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-foreground/60">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/60 border-t-primary" />
          <p className="text-[12px] uppercase tracking-[0.3em]">Preparing resume workspace</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      <div className="space-y-10">
        {success && (
          <div className="rounded-3xl border border-green-300/60 bg-green-500/10 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {openPdf && (
          <div className="rounded-3xl border border-primary/40 bg-primary/10 px-5 py-4 text-sm text-primary flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" /> Opening PDF preview...
          </div>
        )}

        <section className="grid gap-12 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-6">
            <Badge className="border-border/60 bg-accent/70 text-foreground/60">Resume studio</Badge>
            <h1 className="font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05]">
              Generate polished resumes tailored to every opportunity.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Reuse your profile data, switch templates, and export ATS-friendly PDFs in minutes. Keep a curated library so
              you can respond to new roles without starting from scratch.
            </p>
            <Button size="lg" className="w-full max-w-xs justify-center" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate resume
            </Button>
          </div>

          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-4">
              <CardTitle className="font-serif text-3xl">Tips for stronger resumes</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Choose the right template, keep keywords aligned to the posting, and refresh quantifiable wins each time you
                submit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-10 text-[12px] uppercase tracking-[0.24em] text-foreground/60">
              <p className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" /> Tailor language to the role you are targeting.
              </p>
              <p className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" /> Pick a template that matches company tone.
              </p>
              <p className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" /> Refresh your metrics after each milestone.
              </p>
            </CardContent>
          </Card>
        </section>

        {showForm && (
          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-3">
              <CardTitle className="font-serif text-2xl">{generating ? 'Generating resume' : 'Create a new resume'}</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Name your resume, select a template, and let the system assemble a polished PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10 space-y-6">
              <form onSubmit={handleGenerateResume} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="title">
                    Resume title*
                  </label>
                  <Input
                    id="title"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder="e.g., Staff Engineer Resume, Product Manager Resume"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Choose template
                  </label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition ${
                          selectedTemplate === template.id
                            ? 'border-foreground ring-2 ring-foreground'
                            : 'border-border hover:-translate-y-1 hover:shadow-xl'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardHeader className="space-y-3 pb-3">
                          <CardTitle className="flex items-center gap-2 font-serif text-lg">
                            <Palette className="h-4 w-4" />
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-6 text-foreground/70">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-2">
                            {template.features.map((feature) => (
                              <Badge key={feature} className="rounded-full bg-accent/60 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-foreground/70">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={generating} className="px-7">
                    {generating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating
                      </>
                    ) : (
                      <>
                        <FileDown className="mr-2 h-4 w-4" /> Generate resume
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-7">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl">Your resume archive</h2>
              <p className="text-[14px] leading-7 text-foreground/60">
                {resumes.length
                  ? 'Preview, download, or refine your latest editions before you apply.'
                  : 'Once you generate resumes, they will appear here for quick access.'}
              </p>
            </div>
            {resumes.length > 0 && (
              <Button variant="outline" className="px-6" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Generate another
              </Button>
            )}
          </div>

          {resumes.length === 0 ? (
            <Card className="border border-dashed border-border/70 bg-card/80 text-center">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-[14px] uppercase tracking-[0.24em] text-foreground/60">
                <FileImage className="h-12 w-12 text-foreground/40" />
                No resumes yet—generate your first edition to unlock downloads and previews.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="border border-border/70 bg-card/90 transition hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2 font-serif text-xl text-foreground">
                          <FileText className="h-4 w-4 text-primary" />
                          {resume.title}
                        </CardTitle>
                        <CardDescription className="text-[13px] uppercase tracking-[0.24em] text-foreground/50">
                          Created {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {resume.updatedAt !== resume.createdAt && (
                            <span>
                              {' '}
                              • Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPDF(resume)}
                          className="text-primary hover:text-primary"
                          title="View PDF preview"
                        >
                          <FileImage className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(resume)}
                          className="text-primary hover:text-primary"
                          title="Download PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteResume(resume.id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete resume"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-3xl border border-border/60 bg-card/80 px-5 py-4">
                      <p className="text-sm leading-7 text-foreground/70">
                        {resume.content?.length ? `${resume.content.length} characters of tailored content ready for export.` : 'Generated resume content ready for export.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-foreground/50">
                      <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary">ATS Friendly</Badge>
                      <Badge className="rounded-full bg-accent/60 px-4 py-1 text-foreground/70">Template: {resume.template || 'N/A'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-dashed border-border/70 bg-card/80 px-6 py-10 text-center text-[14px] uppercase tracking-[0.24em] text-foreground/60">
          Need brand-specific styling? Export as PDF and retouch in Figma or send to your design partner.
        </section>
      </div>
    </DashboardShell>
  );
}
