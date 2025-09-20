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
  Eye, 
  Download,
  Trash2,
  Edit,
  ArrowLeft,
  FileDown,
  RefreshCw,
  Settings,
  Palette
} from "lucide-react";
import Link from 'next/link';
import api from '@/services/api';

export default function ResumesPage() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('ats-friendly');
  const [resumeTitle, setResumeTitle] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const templates = [
    {
      id: 'ats-friendly',
      name: 'ATS-Friendly',
      description: 'Clean, professional format optimized for ATS systems',
      features: ['ATS Optimized', 'Professional', 'Clean Layout']
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Modern professional format with enhanced styling',
      features: ['Modern Design', 'Enhanced Styling', 'Professional']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Creative format with visual elements',
      features: ['Creative Design', 'Visual Elements', 'Stand Out']
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchResumes();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/profile/resumes');
      setResumes(response.data.resumes);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handleGenerateResume = async (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) {
      setError('Please enter a resume title');
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/profile/resumes', {
        title: resumeTitle,
        template: selectedTemplate
      });
      
      setSuccess('Resume generated successfully!');
      setResumeTitle('');
      setShowForm(false);
      await fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await api.delete(`/profile/resumes/${resumeId}`);
      await fetchResumes();
      setSuccess('Resume deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleDownloadResume = async (resume) => {
    try {
      // Create a blob from the LaTeX content
      const blob = new Blob([resume.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.tex`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download resume');
    }
  };

  const handlePreviewResume = (resume) => {
    // Open LaTeX content in a new window for preview
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Resume Preview - ${resume.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .actions { margin: 20px 0; }
            button { margin-right: 10px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Resume Preview: ${resume.title}</h1>
            <p>LaTeX Source Code</p>
          </div>
          <div class="actions">
            <button onclick="downloadResume()">Download .tex File</button>
            <button onclick="window.close()">Close Preview</button>
          </div>
          <pre>${resume.content}</pre>
          <script>
            function downloadResume() {
              const blob = new Blob([\`${resume.content.replace(/`/g, '\\`')}\`], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '${resume.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.tex';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }
          </script>
        </body>
      </html>
    `);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
          <p className="text-gray-600">Generate professional, ATS-friendly resumes from your profile data</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Generate New Resume Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate New Resume
          </Button>
        </div>

        {/* Resume Generation Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Generate New Resume
              </CardTitle>
              <CardDescription>
                Choose a template and generate your professional resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateResume} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Resume Title *
                  </label>
                  <Input
                    id="title"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder="e.g., Software Engineer Resume, Data Scientist Resume"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Choose Template
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          selectedTemplate === template.id 
                            ? 'ring-2 ring-blue-500 border-blue-500' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center">
                            <Palette className="h-4 w-4 mr-2" />
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={generating}>
                    {generating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Resume
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Resumes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
          {resumes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes generated yet</h3>
                <p className="text-gray-600 mb-4">Create your first professional resume using your profile data</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Your First Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          {resume.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Created: {new Date(resume.createdAt).toLocaleDateString()}
                          {resume.updatedAt !== resume.createdAt && (
                            <span> • Updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewResume(resume)}
                          title="Preview Resume"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadResume(resume)}
                          title="Download .tex File"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteResume(resume.id)}
                          title="Delete Resume"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600 font-mono">
                        LaTeX format • {resume.content.length} characters • Professional template
                      </p>
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
