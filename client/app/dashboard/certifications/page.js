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
  Edit,
  Trash2,
  Calendar,
  Award,
  ExternalLink,
  GraduationCap,
  Clock
} from "lucide-react";
import api from '@/services/api';

export default function CertificationsPage() {
  const [user, setUser] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchCertifications();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/profile/certifications');
      setCertifications(response.data.certifications);
    } catch (err) {
      console.error('Failed to fetch certifications:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        issueDate: new Date(formData.issueDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null
      };

      if (editingCertification) {
        await api.put(`/profile/certifications/${editingCertification.id}`, submitData);
      } else {
        await api.post('/profile/certifications', submitData);
      }
      
      await fetchCertifications();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save certification');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    });
    setEditingCertification(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (certification) => {
    setEditingCertification(certification);
    setFormData({
      title: certification.title,
      issuer: certification.issuer,
      issueDate: new Date(certification.issueDate).toISOString().split('T')[0],
      expiryDate: certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : '',
      credentialId: certification.credentialId || '',
      credentialUrl: certification.credentialUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (certificationId) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      await api.delete(`/profile/certifications/${certificationId}`);
      await fetchCertifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete certification');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (loading) {
    return (
      <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-foreground/60">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/60 border-t-primary" />
          <p className="text-[12px] uppercase tracking-[0.3em]">Gathering certifications</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      <div className="space-y-12">
        <section className="grid gap-12 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-6">
            <Badge className="border-border/60 bg-accent/70 text-foreground/60">Credentials</Badge>
            <h1 className="font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05]">
              Showcase certifications that reinforce your expertise and currency.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Track renewal dates, credential IDs, and links so recruiters can verify your accomplishments instantly.
              Highlight the badges that differentiate your skillset.
            </p>
            <Button size="lg" className="w-full max-w-xs justify-center" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add certification
            </Button>
          </div>

          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-4">
              <CardTitle className="font-serif text-3xl">Keep them current</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Hiring teams love verifiable proof. Include credential IDs, renewal cycles, and direct links so nothing is
                left to chance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-10 text-[12px] uppercase tracking-[0.24em] text-foreground/60">
              <p className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Pair each badge with a sentence about the capability it proves.
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Flag expirations to stay ahead of recertification windows.
              </p>
              <p className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" /> Link to credential pages for instant verification.
              </p>
            </CardContent>
          </Card>
        </section>

        {showForm && (
          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-3">
              <CardTitle className="font-serif text-2xl">
                {editingCertification ? 'Update certification' : 'Add a new certification'}
              </CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Keep credential details precise so review teams can validate them quickly.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="title">
                      Certification title*
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="AWS Certified Solutions Architect"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="issuer">
                      Issuer*
                    </label>
                    <Input
                      id="issuer"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleChange}
                      placeholder="Amazon Web Services"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="issueDate">
                      Issue date*
                    </label>
                    <Input
                      id="issueDate"
                      name="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="expiryDate">
                      Expiry date
                    </label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="credentialId">
                      Credential ID
                    </label>
                    <Input
                      id="credentialId"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleChange}
                      placeholder="Credential identifier"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="credentialUrl">
                      Credential URL
                    </label>
                    <Input
                      id="credentialUrl"
                      name="credentialUrl"
                      value={formData.credentialUrl}
                      onChange={handleChange}
                      placeholder="https://verify.example.com"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={submitting} className="px-7">
                    {submitting ? 'Saving' : editingCertification ? 'Update certification' : 'Add certification'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="px-7">
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
              <h2 className="font-serif text-2xl">Certification tracker</h2>
              <p className="text-[14px] leading-7 text-foreground/60">
                {certifications.length
                  ? 'Stay on top of renewals and keep proof ready for every interview.'
                  : 'Once you add certifications, they will appear here with quick edit controls.'}
              </p>
            </div>
            {certifications.length > 0 && (
              <Button variant="outline" className="px-6" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add another
              </Button>
            )}
          </div>

        {certifications.length === 0 ? (
          <Card className="border border-dashed border-border/70 bg-card/80 text-center">
            <CardContent className="py-12 text-[14px] uppercase tracking-[0.24em] text-foreground/60">
              Record your certifications to boost credibility with verifiable proof.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((certification) => (
              <Card key={certification.id} className="border border-border/70 bg-card/90 transition hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <CardTitle className="font-serif text-xl text-foreground">{certification.title}</CardTitle>
                      <p className="text-[13px] uppercase tracking-[0.24em] text-foreground/50">
                        {certification.issuer}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.24em] text-foreground/50">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Issued {formatDate(certification.issueDate)}
                        </span>
                        {certification.expiryDate && (
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Expires {formatDate(certification.expiryDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(certification)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(certification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-foreground/80">
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-foreground/50">
                    <Badge
                      className={`rounded-full px-4 py-1 ${
                        isExpired(certification.expiryDate)
                          ? 'bg-destructive/10 text-destructive'
                          : isExpiringSoon(certification.expiryDate)
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {isExpired(certification.expiryDate)
                        ? 'Expired'
                        : isExpiringSoon(certification.expiryDate)
                        ? 'Renew soon'
                        : 'Active'}
                    </Badge>
                    <span className="inline-flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> Credential
                    </span>
                    {certification.credentialId && (
                      <span className="font-mono text-xs text-foreground/60">ID: {certification.credentialId}</span>
                    )}
                  </div>

                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.24em] text-foreground/70 transition hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View credential
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </section>
      </div>
    </DashboardShell>
  );
}
