'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github,
  Calendar,
  Code,
  ArrowLeft,
  X
} from "lucide-react";
import api from '@/services/api';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">REZOOM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>

        {/* Add Project Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </div>

        {/* Project Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </CardTitle>
              <CardDescription>
                Fill in the details of your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Project Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., E-commerce Website"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="techStack" className="text-sm font-medium text-gray-700">
                      Tech Stack
                    </label>
                    <div className="space-y-2" ref={dropdownRef}>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTechs.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleTechRemove(tech)}
                              className="ml-1 hover:text-red-500"
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
                          onKeyPress={handleTechInputKeyPress}
                          onFocus={() => setShowTechDropdown(true)}
                          placeholder="Type or select technologies..."
                          className="mb-2"
                        />
                        {showTechDropdown && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                            {popularTechs
                              .filter(tech => 
                                tech.toLowerCase().includes(techInput.toLowerCase()) && 
                                !selectedTechs.includes(tech)
                              )
                              .slice(0, 10)
                              .map((tech, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleTechAdd(tech)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                >
                                  {tech}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project, what it does, key features, challenges solved, etc."
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="githubUrl" className="text-sm font-medium text-gray-700">
                      GitHub URL
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="githubUrl"
                        name="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="liveUrl" className="text-sm font-medium text-gray-700">
                      Live Demo URL
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="liveUrl"
                        name="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={handleChange}
                        placeholder="https://your-project.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Start building your portfolio by adding your first project</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.techStack && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.split(',').map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          View Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </a>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}