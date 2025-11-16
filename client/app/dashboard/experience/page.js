'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/shell";
import { Plus, Edit, Trash2, Calendar, Building, Briefcase, Code, X } from "lucide-react";
import api from "@/services/api";

const TECHNOLOGY_LIBRARY = [
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Nuxt.js",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "HTML",
  "CSS",
  "Sass",
  "Tailwind CSS",
  "Bootstrap",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Firebase",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "GitLab",
  "Jenkins",
  "CI/CD",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
];

export default function ExperiencePage() {
  const [user, setUser] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: "",
    isCurrent: false,
  });
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
        await fetchExperiences();
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTechDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get("/profile/experiences");
      setExperiences(response.data.experiences);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTechAdd = (tech) => {
    if (tech && !selectedTechs.includes(tech)) {
      setSelectedTechs((prev) => [...prev, tech]);
      setTechInput("");
      setShowTechDropdown(false);
    }
  };

  const handleTechRemove = (techToRemove) => {
    setSelectedTechs((prev) => prev.filter((tech) => tech !== techToRemove));
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
    setShowTechDropdown(true);
  };

  const handleTechInputKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (techInput.trim()) {
        handleTechAdd(techInput.trim());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.isCurrent ? null : new Date(formData.endDate),
        technologies: selectedTechs.join(", "),
      };

      if (editingExperience) {
        await api.put(`/profile/experiences/${editingExperience.id}`, submitData);
      } else {
        await api.post("/profile/experiences", submitData);
      }

      await fetchExperiences();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save experience");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: "",
      isCurrent: false,
    });
    setSelectedTechs([]);
    setTechInput("");
    setShowTechDropdown(false);
    setEditingExperience(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      role: experience.role,
      startDate: new Date(experience.startDate).toISOString().split("T")[0],
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split("T")[0] : "",
      description: experience.description,
      technologies: experience.technologies || "",
      isCurrent: !experience.endDate,
    });
    setSelectedTechs(
      experience.technologies ? experience.technologies.split(",").map((tech) => tech.trim()) : []
    );
    setShowForm(true);
  };

  const handleDelete = async (experienceId) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      await api.delete(`/profile/experiences/${experienceId}`);
      await fetchExperiences();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete experience");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    let totalMonths = years * 12 + months;
    if (end.getDate() < start.getDate()) totalMonths--;

    const yearsPart = Math.floor(totalMonths / 12);
    const monthsPart = totalMonths % 12;

    let duration = "";
    if (yearsPart > 0) duration += `${yearsPart} year${yearsPart > 1 ? "s" : ""}`;
    if (monthsPart > 0) {
      if (duration) duration += " ";
      duration += `${monthsPart} month${monthsPart > 1 ? "s" : ""}`;
    }

    return duration || "Less than a month";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col.items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border/50 border-t-primary"></div>
          <p className="text-[12px] uppercase tracking-[0.3em] text-foreground/60">
            Collecting experience records
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout} backHref="/dashboard" backLabel="Dashboard">
      <section className="space-y-6 border-b border-border/80 pb-10">
        <Badge className="border-border/50 bg-accent/70 text-foreground/60">Experience editor</Badge>
        <div className="grid gap-10 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-6">
            <h1 className="font-serif text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05]">
              Curate your work history like a publication timeline.
            </h1>
            <p className="max-w-md text-[15px] leading-8 text-foreground/70">
              Document each role with the clarity of an editorial feature. Highlight measurable impact, evolving
              responsibilities, and the technologies that shaped your craft.
            </p>
            <Button size="lg" onClick={() => setShowForm(true)} className="w-full max-w-xs justify-center">
              <Plus className="mr-2 h-4 w-4" />
              Add experience
            </Button>
          </div>
          <Card className="border border-border/70 bg-card/90">
            <CardHeader className="space-y-4">
              <CardTitle className="font-serif text-3xl">What recruiters notice</CardTitle>
              <CardDescription className="text-[15px] leading-7 text-foreground/70">
                Lead with metrics, underscore collaboration, and close with the tools that supported delivery. Each entry
                should read like a mini case study.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-10 text-[12px] uppercase tracking-[0.22em] text-foreground/60">
              <p>• Present-tense for current roles, past-tense for previous engagements</p>
              <p>• Anchor achievements to outcomes: revenue, adoption, efficiency gains</p>
              <p>• Match keywords from the job description to improve ATS alignment</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {showForm && (
        <Card className="mt-10 border border-border/70 bg-card/90">
          <CardHeader className="space-y-3">
            <CardTitle className="font-serif text-2xl">
              {editingExperience ? "Update experience" : "Add new experience"}
            </CardTitle>
            <CardDescription className="text-[15px] leading-7 text-foreground/70">
              Chronicle the role, your responsibilities, and the impact you delivered.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12">
            <form onSubmit={handleSubmit} className="space-y-7">
              {error ? (
                <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="company">
                    Company name*
                  </label>
                  <div className="relative">
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Studio, startup, or enterprise"
                      required
                      className="pl-10"
                    />
                    <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="role">
                    Role title*
                  </label>
                  <div className="relative">
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Lead Product Designer"
                      required
                      className="pl-10"
                    />
                    <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="startDate">
                    Start date*
                  </label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="endDate">
                    End date
                  </label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      disabled={formData.isCurrent}
                      className="pl-10"
                    />
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  </div>
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
                  I currently hold this role
                </label>
              </div>

              <div className="space-y-3" ref={dropdownRef}>
                <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70">
                  Technologies used
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTechs.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-2 rounded-full px-4 py-1">
                      <span className="text-[11px] uppercase tracking-[0.24em]">{tech}</span>
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
                    placeholder="Add frameworks, tooling, or methodologies"
                  />
                  {showTechDropdown && (
                    <div className="absolute z-10 mt-2 max-h-52 w-full overflow-y-auto rounded-3xl border border-border/70 bg-card shadow-xl">
                      {TECHNOLOGY_LIBRARY.filter(
                        (tech) =>
                          tech.toLowerCase().includes(techInput.toLowerCase()) && !selectedTechs.includes(tech)
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

              <div className="space-y-3">
                <label className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/70" htmlFor="description">
                  Narrative summary*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Lead with impact, back it with metrics, close with collaboration."
                  rows={6}
                  required
                  className="w-full rounded-3xl border border-border/70 bg-transparent px-6 py-4 text-sm leading-relaxed text-foreground/80 placeholder:text-foreground/40 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={submitting} className="px-7">
                  {submitting ? "Saving" : editingExperience ? "Update experience" : "Add experience"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="px-7">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <section className="mt-12 space-y-6">
        {experiences.length === 0 ? (
          <Card className="border border-border/70 bg-card/80 text-center">
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Briefcase className="h-12 w-12 text-foreground/40" />
              <h3 className="font-serif text-2xl">No experience entries yet</h3>
              <p className="max-w-md text-[14px] leading-7 text-foreground/60">
                Build your professional timeline to unlock AI-guided bullet suggestions and tailored resume drafts.
              </p>
              <Button onClick={() => setShowForm(true)} className="px-7">
                <Plus className="mr-2 h-4 w-4" />
                Add your first role
              </Button>
            </CardContent>
          </Card>
        ) : (
          experiences.map((experience) => (
            <Card key={experience.id} className="border border-border/70 bg-card/90 transition hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-primary" />
                      <CardTitle className="font-serif text-2xl">{experience.company}</CardTitle>
                    </div>
                    <p className="text-[14px] uppercase tracking-[0.22em] text-foreground/60">
                      {experience.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[13px] uppercase tracking-[0.22em] text-foreground/50">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(experience.startDate)} – {experience.endDate ? formatDate(experience.endDate) : "Present"}
                      </span>
                      <span>{calculateDuration(experience.startDate, experience.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(experience)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(experience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                {experience.technologies ? (
                  <div className="space-y-3">
                    <h4 className="text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/60">
                      Core stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.split(",").map((tech) => (
                        <Badge key={tech} variant="secondary" className="rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.24em]">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="rounded-3xl border border-border/60 bg-card/80 px-6 py-5 text-sm leading-7 text-foreground/80">
                  <p className="whitespace-pre-wrap">{experience.description}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </DashboardShell>
  );
}
