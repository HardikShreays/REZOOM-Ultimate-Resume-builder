'use client';

import { useState, useEffect } from 'react';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Education</h1>
          <p className="text-gray-600">Manage your educational background</p>
        </div>

        {/* Add Education Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        {/* Education Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingEducation ? 'Edit Education' : 'Add Education'}
              </CardTitle>
              <CardDescription>
                Fill in your educational background details
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
                    <label htmlFor="degree" className="text-sm font-medium text-gray-700">
                      Degree/Qualification *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="degree"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        onFocus={() => setShowDegreeDropdown(true)}
                        placeholder="e.g., Bachelor of Computer Science, MBA, PhD in Physics"
                        required
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDegreeDropdown(!showDegreeDropdown)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {showDegreeDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                          {popularDegrees
                            .filter(degree => 
                              degree.toLowerCase().includes(formData.degree.toLowerCase())
                            )
                            .map((degree, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleDegreeSelect(degree)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                              >
                                {degree}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="institution" className="text-sm font-medium text-gray-700">
                      Institution *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="e.g., Stanford University, MIT, Harvard Business School"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="startYear" className="text-sm font-medium text-gray-700">
                      Start Year *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="startYear"
                        name="startYear"
                        type="number"
                        min="1950"
                        max="2030"
                        value={formData.startYear}
                        onChange={handleChange}
                        placeholder="2020"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endYear" className="text-sm font-medium text-gray-700">
                      End Year
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="endYear"
                        name="endYear"
                        type="number"
                        min="1950"
                        max="2030"
                        value={formData.endYear}
                        onChange={handleChange}
                        placeholder="2024"
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
                    I am currently studying here
                  </label>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Relevant coursework, honors, achievements, GPA, thesis topic, etc."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingEducation ? 'Update Education' : 'Add Education')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Education List */}
        <div className="space-y-6">
          {educations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No education added yet</h3>
                <p className="text-gray-600 mb-4">Start building your educational profile by adding your degrees and qualifications</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Education
                </Button>
              </CardContent>
            </Card>
          ) : (
            educations.map((education) => (
              <Card key={education.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getDegreeIcon(education.degree)}</span>
                        <div>
                          <CardTitle className="text-xl">{education.degree}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-lg font-medium text-gray-700">{education.institution}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {education.startYear} - {education.endYear || 'Present'}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getDegreeLevel(education.degree)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(education)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(education.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {education.description && (
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{education.description}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}