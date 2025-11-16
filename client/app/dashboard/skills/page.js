'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/shell";
import { Plus, Edit, Trash2, Star, Award, TrendingUp } from "lucide-react";
import api from '@/services/api';

const proficiencyBadges = {
  Beginner: "bg-accent/60 text-foreground/70",
  Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200",
  Advanced: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-200",
  Expert: "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-200",
};

export default function SkillsPage() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    proficiency: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchSkills();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/profile/skills');
      setSkills(response.data.skills);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
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
      if (editingSkill) {
        await api.put(`/profile/skills/${editingSkill.id}`, formData);
      } else {
        await api.post('/profile/skills', formData);
      }

      await fetchSkills();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skill');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', proficiency: '' });
    setEditingSkill(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, proficiency: skill.proficiency });
    setShowForm(true);
  };

  const handleDelete = async (skillId) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await api.delete(`/profile/skills/${skillId}`);
      await fetchSkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete skill');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const renderLoadingState = () => (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-foreground/60">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/60 border-t-primary" />
      <p className="text-[12px] uppercase tracking-[0.3em]">Loading skill library</p>
    </div>
  );

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      {loading ? (
        renderLoadingState()
      ) : (
        <div className="space-y-12">
          <section className="grid gap-12 lg:grid-cols-[0.85fr,1.15fr]">
            <div className="space-y-6">
              <Badge className="border-border/60 bg-accent/70 text-foreground/60">Skill architecture</Badge>
              <h1 className="font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05]">
                Curate the capabilities that tell your professional story.
              </h1>
              <p className="max-w-md text-[15px] leading-8 text-foreground/70">
                Group technical expertise, highlight leadership abilities, and map your proficiency so hiring teams can see
                the depth and breadth of your craft.
              </p>
              <Button size="lg" className="w-full max-w-xs justify-center" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add skill
              </Button>
            </div>

            <Card className="border border-border/70 bg-card/90">
              <CardHeader className="space-y-4">
                <CardTitle className="font-serif text-3xl">Why proficiency matters</CardTitle>
                <CardDescription className="text-[15px] leading-7 text-foreground/70">
                  Communicate how you apply each skill: from methodical execution to leadership-level mastery. Pair the
                  right keywords with clear capability markers to strengthen ATS alignment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-10 text-[12px] uppercase tracking-[0.24em] text-foreground/60">
                <p className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" /> High-impact skills deserve quantifiable context.
                </p>
                <p className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Showcase growth—from foundational to advanced proficiency.
                </p>
                <p className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Signal readiness for the next role with targeted expertise.
                </p>
              </CardContent>
            </Card>
          </section>

          {showForm && (
            <Card className="border border-border/70 bg-card/90">
              <CardHeader className="space-y-3">
                <CardTitle className="font-serif text-2xl">
                  {editingSkill ? 'Update skill' : 'Add a new skill'}
                </CardTitle>
                <CardDescription className="text-[15px] leading-7 text-foreground/70">
                  Set the proficiency level that best reflects your current capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="name">
                      Skill name*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., React, Strategic planning"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="proficiency">
                      Proficiency*
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {proficiencyLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, proficiency: level }))}
                          className={`rounded-3xl border px-4 py-3 text-[11px] uppercase tracking-[0.24em] transition ${
                            formData.proficiency === level
                              ? 'border-foreground text-foreground'
                              : 'border-border text-foreground/60 hover:border-foreground/60'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={submitting} className="px-7">
                      {submitting ? 'Saving' : editingSkill ? 'Update skill' : 'Add skill'}
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
                <h2 className="font-serif text-2xl">Skill inventory</h2>
                <p className="text-[14px] leading-7 text-foreground/60">
                  {skills.length ? 'Update, reorder, or deepen the skills that define your toolkit.' : 'Once you add skills, they will appear here with quick edit controls.'}
                </p>
              </div>
              {skills.length > 0 && (
                <Button variant="outline" className="px-6" onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add another
                </Button>
              )}
            </div>

            {skills.length === 0 ? (
              <Card className="border border-dashed border-border/70 bg-card/80 text-center">
                <CardContent className="py-12 text-[14px] uppercase tracking-[0.24em] text-foreground/60">
                  Start building your skills inventory to tailor resumes for each role.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <Card key={skill.id} className="border border-border/70 bg-card/90 transition hover:-translate-y-1 hover:shadow-xl">
                    <CardHeader className="space-y-3">
                      <CardTitle className="font-serif text-xl text-foreground">
                        {skill.name}
                      </CardTitle>
                      <Badge
                        className={`rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.24em] ${
                          proficiencyBadges[skill.proficiency] ?? 'bg-accent/60 text-foreground/70'
                        }`}
                      >
                        {skill.proficiency}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
