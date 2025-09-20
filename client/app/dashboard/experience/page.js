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
  ArrowLeft,
  Calendar,
  Building,
  Briefcase,
  MapPin,
  Code,
  X
} from "lucide-react";
import api from '@/services/api';

export default function ExperiencePage() {
  const [user, setUser] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: '',
    isCurrent: false
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
        await fetchExperiences();
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

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/profile/experiences');
      setExperiences(response.data.experiences);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
        startDate: new Date(formData.startDate),
        endDate: formData.isCurrent ? null : new Date(formData.endDate),
        technologies: selectedTechs.join(', ')
      };

      if (editingExperience) {
        await api.put(`/profile/experiences/${editingExperience.id}`, submitData);
      } else {
        await api.post('/profile/experiences', submitData);
      }
      
      await fetchExperiences();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save experience');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: '',
      isCurrent: false
    });
    setSelectedTechs([]);
    setTechInput('');
    setShowTechDropdown(false);
    setEditingExperience(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      role: experience.role,
      startDate: new Date(experience.startDate).toISOString().split('T')[0],
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
      description: experience.description,
      technologies: experience.technologies || '',
      isCurrent: !experience.endDate
    });
    setSelectedTechs(experience.technologies ? experience.technologies.split(',').map(tech => tech.trim()) : []);
    setShowForm(true);
  };

  const handleDelete = async (experienceId) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await api.delete(`/profile/experiences/${experienceId}`);
      await fetchExperiences();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete experience');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let totalMonths = years * 12 + months;
    if (end.getDate() < start.getDate()) totalMonths--;
    
    const yearsPart = Math.floor(totalMonths / 12);
    const monthsPart = totalMonths % 12;
    
    let duration = '';
    if (yearsPart > 0) duration += `${yearsPart} year${yearsPart > 1 ? 's' : ''}`;
    if (monthsPart > 0) {
      if (duration) duration += ' ';
      duration += `${monthsPart} month${monthsPart > 1 ? 's' : ''}`;
    }
    
    return duration || 'Less than a month';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Experience</h1>
          <p className="text-gray-600">Manage your professional work experience</p>
        </div>

        {/* Add Experience Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Work Experience
          </Button>
        </div>

        {/* Experience Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingExperience ? 'Edit Experience' : 'Add Work Experience'}
              </CardTitle>
              <CardDescription>
                Fill in your work experience details
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
                    <label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g., Google, Microsoft, Startup Inc."
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Job Title *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer, Product Manager"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={formData.isCurrent}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="isCurrent"
                    name="isCurrent"
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">
                    I currently work here
                  </label>
                </div>

                <div className="space-y-2">
                  <label htmlFor="technologies" className="text-sm font-medium text-gray-700">
                    Technologies Used
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

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Job Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your role, responsibilities, achievements, and key projects..."
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingExperience ? 'Update Experience' : 'Add Experience')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Experiences List */}
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No work experience yet</h3>
                <p className="text-gray-600 mb-4">Start building your professional profile by adding your work experience</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Experience
                </Button>
              </CardContent>
            </Card>
          ) : (
            experiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-xl">{experience.company}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-lg font-medium text-gray-700">{experience.role}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {calculateDuration(experience.startDate, experience.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(experience)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(experience.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experience.technologies && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Code className="h-4 w-4 mr-1" />
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.split(',').map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{experience.description}</p>
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