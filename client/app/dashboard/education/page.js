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
  GraduationCap,
  MapPin,
  Award,
  ChevronDown
} from "lucide-react";
import api from '@/services/api';

export default function EducationPage() {
  const [user, setUser] = useState(null);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    startYear: '',
    endYear: '',
    description: '',
    isCurrent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  const router = useRouter();

  const popularDegrees = [
    'Bachelor of Computer Science',
    'Bachelor of Engineering',
    'Bachelor of Science',
    'Bachelor of Arts',
    'Bachelor of Business Administration',
    'Master of Computer Science',
    'Master of Engineering',
    'Master of Science',
    'Master of Business Administration (MBA)',
    'Master of Arts',
    'PhD in Computer Science',
    'PhD in Engineering',
    'PhD in Physics',
    'PhD in Mathematics',
    'PhD in Business',
    'Associate Degree',
    'Diploma',
    'Certificate',
    'High School Diploma',
    'GED'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchEducations();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchEducations = async () => {
    try {
      const response = await api.get('/profile/educations');
      setEducations(response.data.educations);
    } catch (err) {
      console.error('Failed to fetch educations:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDegreeSelect = (degree) => {
    setFormData({
      ...formData,
      degree: degree
    });
    setShowDegreeDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        startYear: parseInt(formData.startYear),
        endYear: formData.isCurrent ? null : parseInt(formData.endYear)
      };

      if (editingEducation) {
        await api.put(`/profile/educations/${editingEducation.id}`, submitData);
      } else {
        await api.post('/profile/educations', submitData);
      }
      
      await fetchEducations();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save education');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      startYear: '',
      endYear: '',
      description: '',
      isCurrent: false
    });
    setEditingEducation(null);
    setShowForm(false);
    setError('');
    setShowDegreeDropdown(false);
  };

  const handleEdit = (education) => {
    setEditingEducation(education);
    setFormData({
      degree: education.degree,
      institution: education.institution,
      startYear: education.startYear.toString(),
      endYear: education.endYear ? education.endYear.toString() : '',
      description: education.description || '',
      isCurrent: !education.endYear
    });
    setShowForm(true);
  };

  const handleDelete = async (educationId) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    
    try {
      await api.delete(`/profile/educations/${educationId}`);
      await fetchEducations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete education');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const getDegreeIcon = (degree) => {
    const lowerDegree = degree.toLowerCase();
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
      return '🎓';
    } else if (lowerDegree.includes('master') || lowerDegree.includes('ms') || lowerDegree.includes('ma')) {
      return '🎓';
    } else if (lowerDegree.includes('bachelor') || lowerDegree.includes('bs') || lowerDegree.includes('ba')) {
      return '🎓';
    } else if (lowerDegree.includes('associate') || lowerDegree.includes('diploma')) {
      return '🎓';
    } else if (lowerDegree.includes('certificate') || lowerDegree.includes('certification')) {
      return '📜';
    }
    return '🎓';
  };

  const getDegreeLevel = (degree) => {
    const lowerDegree = degree.toLowerCase();
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
      return 'Doctorate';
    } else if (lowerDegree.includes('master') || lowerDegree.includes('ms') || lowerDegree.includes('ma')) {
      return 'Master\'s';
    } else if (lowerDegree.includes('bachelor') || lowerDegree.includes('bs') || lowerDegree.includes('ba')) {
      return 'Bachelor\'s';
    } else if (lowerDegree.includes('associate') || lowerDegree.includes('diploma')) {
      return 'Associate';
    } else if (lowerDegree.includes('certificate') || lowerDegree.includes('certification')) {
      return 'Certificate';
    }
    return 'Other';
  };

  if (loading) {
    return (
      <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
        <div className="flex h-[60vh] flex-col.items-center justify-center gap-4 text-foreground/60">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/60 border-t-primary" />
          <p className="text-[12px] uppercase tracking-[0.3em]">Gathering academic history</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      <div className="space-y-12">
        <section className="grid gap-12 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-6">
            <Badge className="border-border/60 bg-accent/70 text-foreground/60">Academic record</Badge>
            <h1 className="font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05]">
              Chronicle your education with the polish of an admissions dossier.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Highlight programs, honors, and research. A structured academic timeline signals credibility and sets up
              your professional narrative.
            </p>
            <Button size="lg" className="w-full max-w-xs justify-center" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add education
            </Button>
          </div>

          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-4">
              <CardTitle className="font-serif text-3xl">What to capture</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Admissions teams look for consistency, specialization, and impact. Translate coursework, research, and
                leadership roles into crisp talking points recruiters can trust.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-10 text-[12px] uppercase tracking-[0.24em] text-foreground/60">
              <p className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" /> Include thesis topics or concentrations that match the
                role.
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Add timelines and honors to show sustained excellence.
              </p>
              <p className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Mention scholarships, fellowships, or leadership recognition.
              </p>
            </CardContent>
          </Card>
        </section>

        {showForm && (
          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-3">
              <CardTitle className="font-serif text-2xl">
                {editingEducation ? 'Update education' : 'Add a new education entry'}
              </CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Detail the program, institution, and achievements that made the experience matter.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-3" onClick={() => setShowDegreeDropdown((prev) => !prev)}>
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Degree*
                  </label>
                  <div className="relative">
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="e.g., Master of Computer Science"
                      required
                      readOnly
                      className="cursor-pointer pr-12"
                    />
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    {showDegreeDropdown && (
                      <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-3xl border border-border/70 bg-card shadow-xl">
                        {popularDegrees.map((degree) => (
                          <button
                            key={degree}
                            type="button"
                            onClick={() => handleDegreeSelect(degree)}
                            className="flex w-full items-center justify-between px-5 py-3 text-left text-[13px] uppercase tracking-[0.24em] text-foreground/70 transition hover:bg-accent/60"
                          >
                            {degree}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="institution">
                    Institution*
                  </label>
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="University name"
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="startYear">
                      Start year*
                    </label>
                    <Input
                      id="startYear"
                      name="startYear"
                      type="number"
                      value={formData.startYear}
                      onChange={handleChange}
                      placeholder="2019"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="endYear">
                      End year
                    </label>
                    <Input
                      id="endYear"
                      name="endYear"
                      type="number"
                      value={formData.endYear}
                      onChange={handleChange}
                      placeholder="2023"
                      disabled={formData.isCurrent}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="isCurrent"
                    name="isCurrent"
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label className="text-[12px] uppercase tracking-[0.24em] text-foreground/70" htmlFor="isCurrent">
                    I currently attend this program
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="description">
                    Key achievements
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Highlight coursework, leadership, research, or awards."
                    rows={5}
                    className="w-full rounded-3xl border border-border/70 bg-transparent px-6 py-4 text-sm leading-relaxed text-foreground/80 placeholder:text-foreground/40 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={submitting} className="px-7">
                    {submitting ? 'Saving' : editingEducation ? 'Update education' : 'Add education'}
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
              <h2 className="font-serif text-2xl">Academic timeline</h2>
              <p className="text-[14px] leading-7 text-foreground/60">
                {educations.length
                  ? 'Refine entries to underscore relevance for your next role.'
                  : 'Once you add education entries, they will appear here with quick edit controls.'}
              </p>
            </div>
            {educations.length > 0 && (
              <Button variant="outline" className="px-6" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add another
              </Button>
            )}
          </div>

          {educations.length === 0 ? (
            <Card className="border border-dashed border-border/70 bg-card/80 text-center">
              <CardContent className="py-12 text-[14px] uppercase tracking-[0.24em] text-foreground/60">
                Build your academic timeline to strengthen credibility.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {educations.map((education) => (
                <Card key={education.id} className="border border-border/70 bg-card/90 transition hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <CardTitle className="font-serif text-xl text-foreground">{education.degree}</CardTitle>
                        <p className="text-[13px] uppercase tracking-[0.24em] text-foreground/50">
                          {education.institution}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.24em] text-foreground/50">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {education.startYear} – {education.endYear ? education.endYear : 'Present'}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {getDegreeLevel(education.degree)} level
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(education)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(education.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm leading-7 text-foreground/80">
                    <div className="rounded-3xl border border-border/60 bg-card/80 px-5 py-4">
                      <p className="whitespace-pre-wrap">{education.description || 'No additional details provided.'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-foreground/50">
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {getDegreeIcon(education.degree)}
                      </span>
                      {education.isCurrent ? (
                        <Badge className="rounded-full bg-primary/10 text-primary">Currently enrolled</Badge>
                      ) : null}
                    </div>
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