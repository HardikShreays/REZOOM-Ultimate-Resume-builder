'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  User, 
  LogOut, 
  ArrowLeft,
  Calendar,
  Building,
  Briefcase,
  GraduationCap,
  MapPin,
  Award,
  Code,
  Star,
  ExternalLink,
  Github,
  Clock,
  TrendingUp,
  Edit,
  Plus,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  Save,
  X
} from "lucide-react";
import Link from 'next/link';
import api from '@/services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    githubUrl: '',
    hackerrankUrl: '',
    geeksforgeeksUrl: '',
    codeforcesUrl: '',
    leetcodeUrl: '',
    codechefUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    portfolioUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchProfileData();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/profile/');
      setProfileData(response.data.user);
      setEditForm({
        name: response.data.user.name || '',
        phoneNumber: response.data.user.phoneNumber || '',
        githubUrl: response.data.user.githubUrl || '',
        hackerrankUrl: response.data.user.hackerrankUrl || '',
        geeksforgeeksUrl: response.data.user.geeksforgeeksUrl || '',
        codeforcesUrl: response.data.user.codeforcesUrl || '',
        leetcodeUrl: response.data.user.leetcodeUrl || '',
        codechefUrl: response.data.user.codechefUrl || '',
        linkedinUrl: response.data.user.linkedinUrl || '',
        twitterUrl: response.data.user.twitterUrl || '',
        portfolioUrl: response.data.user.portfolioUrl || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
    }
  };

  const handleEditProfile = () => {
    console.log('Starting to edit profile...');
    console.log('Current profile data:', profileData);
    console.log('Current edit form:', editForm);
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    // Reset form to original values
    setEditForm({
      name: profileData?.name || '',
      phoneNumber: profileData?.phoneNumber || '',
      githubUrl: profileData?.githubUrl || '',
      hackerrankUrl: profileData?.hackerrankUrl || '',
      geeksforgeeksUrl: profileData?.geeksforgeeksUrl || '',
      codeforcesUrl: profileData?.codeforcesUrl || '',
      leetcodeUrl: profileData?.leetcodeUrl || '',
      codechefUrl: profileData?.codechefUrl || '',
      linkedinUrl: profileData?.linkedinUrl || '',
      twitterUrl: profileData?.twitterUrl || '',
      portfolioUrl: profileData?.portfolioUrl || ''
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      console.log('Sending profile update:', editForm);
      const response = await api.put('/profile/', editForm);
      console.log('Profile update response:', response.data);
      setProfileData(response.data.user);
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert(`Failed to update profile: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`Input change: ${field} = ${value}`);
    setEditForm(prev => {
      const newForm = {
        ...prev,
        [field]: value
      };
      console.log('Updated edit form:', newForm);
      return newForm;
    });
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

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Expert':
        return 'bg-purple-100 text-purple-800';
      case 'Advanced':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All About Me</h1>
          <p className="text-xl text-gray-600">Your complete professional profile</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Work Experience</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData?.experiences?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Skills</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData?.skills?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData?.projects?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData?.certifications?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Profile Completion
            </CardTitle>
            <CardDescription>
              Track your profile completeness and get insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Profile Completion Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                  <span className="text-sm font-medium text-gray-700">
                    {(() => {
                      const totalSections = 6; // Personal info, skills, experience, education, projects, certifications
                      let completedSections = 0;
                      
                      // Personal info (name, email are always present)
                      if (profileData?.name && profileData?.email) completedSections++;
                      
                      // Skills
                      if (profileData?.skills && profileData.skills.length > 0) completedSections++;
                      
                      // Experience
                      if (profileData?.experiences && profileData.experiences.length > 0) completedSections++;
                      
                      // Education
                      if (profileData?.educations && profileData.educations.length > 0) completedSections++;
                      
                      // Projects
                      if (profileData?.projects && profileData.projects.length > 0) completedSections++;
                      
                      // Certifications
                      if (profileData?.certifications && profileData.certifications.length > 0) completedSections++;
                      
                      const percentage = Math.round((completedSections / totalSections) * 100);
                      return `${percentage}%`;
                    })()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(() => {
                        const totalSections = 6;
                        let completedSections = 0;
                        
                        if (profileData?.name && profileData?.email) completedSections++;
                        if (profileData?.skills && profileData.skills.length > 0) completedSections++;
                        if (profileData?.experiences && profileData.experiences.length > 0) completedSections++;
                        if (profileData?.educations && profileData.educations.length > 0) completedSections++;
                        if (profileData?.projects && profileData.projects.length > 0) completedSections++;
                        if (profileData?.certifications && profileData.certifications.length > 0) completedSections++;
                        
                        return (completedSections / totalSections) * 100;
                      })()}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profileData?.name && profileData?.email ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <User className={`h-5 w-5 ${profileData?.name && profileData?.email ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Personal Info</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.name && profileData?.email ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profileData?.skills && profileData.skills.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Award className={`h-5 w-5 ${profileData?.skills && profileData.skills.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Skills</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.skills && profileData.skills.length > 0 ? `${profileData.skills.length} skills` : 'No skills'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profileData?.experiences && profileData.experiences.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Briefcase className={`h-5 w-5 ${profileData?.experiences && profileData.experiences.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experience</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.experiences && profileData.experiences.length > 0 ? `${profileData.experiences.length} positions` : 'No experience'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profileData?.educations && profileData.educations.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <GraduationCap className={`h-5 w-5 ${profileData?.educations && profileData.educations.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Education</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.educations && profileData.educations.length > 0 ? `${profileData.educations.length} degrees` : 'No education'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profileData?.projects && profileData.projects.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Code className={`h-5 w-5 ${profileData?.projects && profileData.projects.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Projects</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.projects && profileData.projects.length > 0 ? `${profileData.projects.length} projects` : 'No projects'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profileData?.certifications && profileData.certifications.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Star className={`h-5 w-5 ${profileData?.certifications && profileData.certifications.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Certifications</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.certifications && profileData.certifications.length > 0 ? `${profileData.certifications.length} certificates` : 'No certifications'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {(!profileData?.skills || profileData.skills.length === 0) && (
                    <Link href="/dashboard/skills">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Skills
                      </Button>
                    </Link>
                  )}
                  {(!profileData?.experiences || profileData.experiences.length === 0) && (
                    <Link href="/dashboard/experience">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Experience
                      </Button>
                    </Link>
                  )}
                  {(!profileData?.educations || profileData.educations.length === 0) && (
                    <Link href="/dashboard/education">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Education
                      </Button>
                    </Link>
                  )}
                  {(!profileData?.projects || profileData.projects.length === 0) && (
                    <Link href="/dashboard/projects">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Projects
                      </Button>
                    </Link>
                  )}
                  {(!profileData?.certifications || profileData.certifications.length === 0) && (
                    <Link href="/dashboard/certifications">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Certifications
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Personal Information
              </CardTitle>
              {!editingProfile ? (
                <Button variant="outline" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingProfile ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={profileData?.email || ''}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be modified</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                    <Input
                      type="url"
                      value={editForm.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <Input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode URL</label>
                    <Input
                      type="url"
                      value={editForm.leetcodeUrl}
                      onChange={(e) => handleInputChange('leetcodeUrl', e.target.value)}
                      placeholder="https://leetcode.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HackerRank URL</label>
                    <Input
                      type="url"
                      value={editForm.hackerrankUrl}
                      onChange={(e) => handleInputChange('hackerrankUrl', e.target.value)}
                      placeholder="https://hackerrank.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GeeksforGeeks URL</label>
                    <Input
                      type="url"
                      value={editForm.geeksforgeeksUrl}
                      onChange={(e) => handleInputChange('geeksforgeeksUrl', e.target.value)}
                      placeholder="https://auth.geeksforgeeks.org/user/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Codeforces URL</label>
                    <Input
                      type="url"
                      value={editForm.codeforcesUrl}
                      onChange={(e) => handleInputChange('codeforcesUrl', e.target.value)}
                      placeholder="https://codeforces.com/profile/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CodeChef URL</label>
                    <Input
                      type="url"
                      value={editForm.codechefUrl}
                      onChange={(e) => handleInputChange('codechefUrl', e.target.value)}
                      placeholder="https://codechef.com/users/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                    <Input
                      type="url"
                      value={editForm.twitterUrl}
                      onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                    <Input
                      type="url"
                      value={editForm.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{profileData?.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <User className="h-4 w-4 mr-2" />
                      <span>{profileData?.email}</span>
                    </div>
                    {profileData?.phoneNumber && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{profileData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {(profileData?.githubUrl || profileData?.linkedinUrl || profileData?.leetcodeUrl || 
                  profileData?.hackerrankUrl || profileData?.geeksforgeeksUrl || profileData?.codeforcesUrl || 
                  profileData?.codechefUrl || profileData?.twitterUrl || profileData?.portfolioUrl) && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profileData?.githubUrl && (
                        <a
                          href={profileData.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Github className="h-5 w-5 mr-3 text-gray-700" />
                          <span className="text-sm font-medium">GitHub</span>
                        </a>
                      )}
                      {profileData?.linkedinUrl && (
                        <a
                          href={profileData.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Linkedin className="h-5 w-5 mr-3 text-blue-600" />
                          <span className="text-sm font-medium">LinkedIn</span>
                        </a>
                      )}
                      {profileData?.leetcodeUrl && (
                        <a
                          href={profileData.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Code className="h-5 w-5 mr-3 text-orange-500" />
                          <span className="text-sm font-medium">LeetCode</span>
                        </a>
                      )}
                      {profileData?.hackerrankUrl && (
                        <a
                          href={profileData.hackerrankUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Code className="h-5 w-5 mr-3 text-green-600" />
                          <span className="text-sm font-medium">HackerRank</span>
                        </a>
                      )}
                      {profileData?.geeksforgeeksUrl && (
                        <a
                          href={profileData.geeksforgeeksUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Code className="h-5 w-5 mr-3 text-green-700" />
                          <span className="text-sm font-medium">GeeksforGeeks</span>
                        </a>
                      )}
                      {profileData?.codeforcesUrl && (
                        <a
                          href={profileData.codeforcesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Code className="h-5 w-5 mr-3 text-red-500" />
                          <span className="text-sm font-medium">Codeforces</span>
                        </a>
                      )}
                      {profileData?.codechefUrl && (
                        <a
                          href={profileData.codechefUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Code className="h-5 w-5 mr-3 text-brown-600" />
                          <span className="text-sm font-medium">CodeChef</span>
                        </a>
                      )}
                      {profileData?.twitterUrl && (
                        <a
                          href={profileData.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Twitter className="h-5 w-5 mr-3 text-blue-400" />
                          <span className="text-sm font-medium">Twitter</span>
                        </a>
                      )}
                      {profileData?.portfolioUrl && (
                        <a
                          href={profileData.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="h-5 w-5 mr-3 text-purple-600" />
                          <span className="text-sm font-medium">Portfolio</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 mr-2" />
                Skills
              </CardTitle>
              <Link href="/dashboard/skills">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skills
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profileData?.skills && profileData.skills.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getProficiencyIcon(skill.proficiency)}
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <Badge className={getProficiencyColor(skill.proficiency)}>
                      {skill.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No skills added yet</p>
                <Link href="/dashboard/skills">
                  <Button variant="outline" className="mt-4">
                    Add Your First Skill
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Experience Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Briefcase className="h-6 w-6 mr-2" />
                Work Experience
              </CardTitle>
              <Link href="/dashboard/experience">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profileData?.experiences && profileData.experiences.length > 0 ? (
              <div className="space-y-6">
                {profileData.experiences.map((experience) => (
                  <div key={experience.id} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{experience.role}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          <span className="font-medium">{experience.company}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{calculateDuration(experience.startDate, experience.endDate)}</span>
                        </div>
                      </div>
                    </div>
                    {experience.technologies && (
                      <div className="mb-3">
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
                    <p className="text-gray-700 whitespace-pre-wrap">{experience.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No work experience added yet</p>
                <Link href="/dashboard/experience">
                  <Button variant="outline" className="mt-4">
                    Add Your First Experience
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                Education
              </CardTitle>
              <Link href="/dashboard/education">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profileData?.educations && profileData.educations.length > 0 ? (
              <div className="space-y-6">
                {profileData.educations.map((education) => (
                  <div key={education.id} className="border-l-4 border-green-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{education.degree}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-medium">{education.institution}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {education.startYear} - {education.endYear || 'Present'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {education.description && (
                      <p className="text-gray-700 whitespace-pre-wrap mt-2">{education.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No education added yet</p>
                <Link href="/dashboard/education">
                  <Button variant="outline" className="mt-4">
                    Add Your First Education
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Code className="h-6 w-6 mr-2" />
                Projects
              </CardTitle>
              <Link href="/dashboard/projects">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Projects
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profileData?.projects && profileData.projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {profileData.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    {project.techStack && (
                      <div className="mb-3">
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
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
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
                          className="flex items-center text-green-600 hover:text-green-700 text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No projects added yet</p>
                <Link href="/dashboard/projects">
                  <Button variant="outline" className="mt-4">
                    Add Your First Project
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 mr-2" />
                Certifications
              </CardTitle>
              <Link href="/dashboard/certifications">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certifications
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profileData?.certifications && profileData.certifications.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {profileData.certifications.map((certification) => (
                  <div key={certification.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{certification.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Award className="h-4 w-4 mr-2" />
                          <span>{certification.issuer}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Issued: {formatFullDate(certification.issueDate)}</span>
                          {certification.expiryDate && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Expires: {formatFullDate(certification.expiryDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {certification.expiryDate && (
                        <div>
                          {isExpired(certification.expiryDate) ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : isExpiringSoon(certification.expiryDate) ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Expires Soon
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Valid
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    {certification.credentialId && (
                      <p className="text-sm text-gray-600 font-mono mb-2">ID: {certification.credentialId}</p>
                    )}
                    {certification.credentialUrl && (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No certifications added yet</p>
                <Link href="/dashboard/certifications">
                  <Button variant="outline" className="mt-4">
                    Add Your First Certification
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resume Generation CTA */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Ready to Generate Your Resume?
            </h3>
            <p className="text-gray-600 mb-6">
              All your information is organized and ready to create a professional resume
            </p>
            <Link href="/dashboard/resumes">
              <Button size="lg" className="px-8">
                Generate Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}