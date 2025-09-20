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
  Star,
  Award,
  TrendingUp
} from "lucide-react";
import api from '@/services/api';

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

  const proficiencyLevels = [
    { value: 'Beginner', label: 'Beginner', color: 'bg-gray-100 text-gray-800' },
    { value: 'Intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    { value: 'Advanced', label: 'Advanced', color: 'bg-green-100 text-green-800' },
    { value: 'Expert', label: 'Expert', color: 'bg-purple-100 text-purple-800' }
  ];

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
    setFormData({
      name: '',
      proficiency: ''
    });
    setEditingSkill(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      proficiency: skill.proficiency
    });
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

  const getProficiencyColor = (proficiency) => {
    const level = proficiencyLevels.find(p => p.value === proficiency);
    return level ? level.color : 'bg-gray-100 text-gray-800';
  };

  const getProficiencyIcon = (proficiency) => {
    switch (proficiency) {
      case 'Expert':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'Advanced':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'Intermediate':
        return <Award className="h-4 w-4 text-blue-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-500" />;
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills</h1>
          <p className="text-gray-600">Manage your technical and soft skills</p>
        </div>

        {/* Add Skill Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Skill
          </Button>
        </div>

        {/* Skill Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </CardTitle>
              <CardDescription>
                Add your skills with proficiency levels
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
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Skill Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., JavaScript, React, Project Management"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="proficiency" className="text-sm font-medium text-gray-700">
                      Proficiency Level *
                    </label>
                    <select
                      id="proficiency"
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select proficiency level</option>
                      {proficiencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Add Skill')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Skills List */}
        <div className="grid gap-4">
          {skills.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills added yet</h3>
                <p className="text-gray-600 mb-4">Start building your skills profile by adding your first skill</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{skill.name}</h3>
                        <div className="flex items-center space-x-2">
                          {getProficiencyIcon(skill.proficiency)}
                          <Badge className={getProficiencyColor(skill.proficiency)}>
                            {skill.proficiency}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(skill)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(skill.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
