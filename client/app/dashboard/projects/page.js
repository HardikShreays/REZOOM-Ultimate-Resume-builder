'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  Code,
  X
} from "lucide-react";
import api from '@/services/api';
import { DashboardShell } from "@/components/dashboard/shell";

export default function ProjectsPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: ''
  });
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const dropdownRef = useRef(null);

  const popularTechs = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
    'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
    'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD',
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchProjects();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTechDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/profile/projects');
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTechAdd = (tech) => {
    if (tech && !selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech]);
      setTechInput('');
      setShowTechDropdown(false);
    }
  };

  const handleTechRemove = (techToRemove) => {
    setSelectedTechs(selectedTechs.filter(tech => tech !== techToRemove));
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
    setShowTechDropdown(true);
  };

  const handleTechInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (techInput.trim()) {
        handleTechAdd(techInput.trim());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        techStack: selectedTechs.join(', ')
      };

      if (editingProject) {
        await api.put(`/profile/projects/${editingProject.id}`, submitData);
      } else {
        await api.post('/profile/projects', submitData);
      }
      
      await fetchProjects();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      liveUrl: ''
    });
    setSelectedTechs([]);
    setTechInput('');
    setShowTechDropdown(false);
    setEditingProject(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || ''
    });
    setSelectedTechs(project.techStack ? project.techStack.split(',').map(tech => tech.trim()) : []);
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await api.delete(`/profile/projects/${projectId}`);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
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
          <p className="text-[12px] uppercase tracking-[0.3em]">Loading projects</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      <div className="space-y-12">
        <section className="grid gap-12 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-6">
            <Badge className="border-border/60 bg-accent/70 text-foreground/60">Project library</Badge>
            <h1 className="font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05]">
              Capture your best work with structured, compelling case studies.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Highlight the problem, your contribution, and the results. Pair each project with the stack that powered
              it to show depth and breadth at a glance.
            </p>
            <Button size="lg" className="w-full max-w-xs justify-center" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add project
            </Button>
          </div>

          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-4">
              <CardTitle className="font-serif text-3xl">What to include</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Tell the full story: business context, your role, the stack, and the measurable impact. Projects written
                this way make it easy to tailor your resume for each role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-10 text-[12px] uppercase tracking-[0.24em] text-foreground/60">
              <p className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" /> Mention scope and team size for collaboration context.
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Add timelines and release cadences to show delivery pace.
              </p>
              <p className="flex items-center gap-2">
                <Github className="h-4 w-4 text-primary" /> Link to repos or demos so reviewers can explore further.
              </p>
            </CardContent>
          </Card>
        </section>

        {showForm && (
          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-3">
              <CardTitle className="font-serif text-2xl">
                {editingProject ? 'Update project' : 'Add a new project'}
              </CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Capture the essentials—outcome, your role, and the technologies used.
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
                      Project title*
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="AI resume builder platform"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="githubUrl">
                      GitHub repository
                    </label>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="liveUrl">
                    Live demo
                  </label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="description">
                    Project summary*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the challenge, your contribution, and the outcome."
                    rows={5}
                    required
                    className="w-full rounded-3xl border border-border/70 bg-transparent px-6 py-4 text-sm leading-relaxed text-foreground/80 placeholder:text-foreground/40 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-3" ref={dropdownRef}>
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                    Tech stack
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechs.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-2 rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.24em]">
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleTechRemove(tech)}
                          className="text-foreground/50 transition hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      value={techInput}
                      onChange={handleTechInputChange}
                      onKeyDown={handleTechInputKeyPress}
                      onFocus={() => setShowTechDropdown(true)}
                      placeholder="Add frameworks, libraries, or tooling"
                    />
                    {showTechDropdown && (
                      <div className="absolute z-10 mt-2 max-h-52 w-full overflow-y-auto rounded-3xl border border-border/70 bg-card shadow-xl">
                        {popularTechs
                          .filter(
                            (tech) => tech.toLowerCase().includes(techInput.toLowerCase()) && !selectedTechs.includes(tech)
                          )
                          .slice(0, 12)
                          .map((tech) => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => handleTechAdd(tech)}
                              className="flex w-full items-center justify-between px-5 py-3 text-left text-[13px] uppercase tracking-[0.24em] text-foreground/70 transition hover:bg-accent/60"
                            >
                              {tech}
                              <Plus className="h-3 w-3" />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={submitting} className="px-7">
                    {submitting ? 'Saving' : editingProject ? 'Update project' : 'Add project'}
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
              <h2 className="font-serif text-2xl">Project catalog</h2>
              <p className="text-[14px] leading-7 text-foreground/60">
                {projects.length
                  ? 'Edit, reorder, or archive your most persuasive case studies.'
                  : 'Once you add projects, they will appear here with quick edit controls.'}
              </p>
            </div>
            {projects.length > 0 && (
              <Button variant="outline" className="px-6" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add another
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <Card className="border border-dashed border-border/70 bg-card/80 text-center">
              <CardContent className="py-12 text-[14px] uppercase tracking-[0.24em] text-foreground/60">
                Start documenting your flagship projects to tailor resumes with evidence.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <Card key={project.id} className="border border-border/70 bg-card/90 transition hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <CardTitle className="font-serif text-xl text-foreground">{project.title}</CardTitle>
                        <div className="flex items-center gap-2 text-[13px] uppercase tracking-[0.24em] text-foreground/50">
                          <Calendar className="h-4 w-4" />
                          {new Date(project.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm leading-7 text-foreground/80">
                    <p>{project.description}</p>

                    {project.techStack && (
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/60">
                          Tech stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.split(',').map((tech) => (
                            <Badge key={tech} variant="secondary" className="rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.24em]">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-[13px] uppercase tracking-[0.24em]">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/70 transition hover:text-primary"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-foreground/70 transition hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live demo
                        </a>
                      )}
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