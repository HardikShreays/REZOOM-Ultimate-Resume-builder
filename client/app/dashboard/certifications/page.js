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
  Award,
  ExternalLink,
  Certificate,
  Clock
} from "lucide-react";
import api from '@/services/api';

export default function CertificationsPage() {
  const [user, setUser] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
        await fetchCertifications();
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/profile/certifications');
      setCertifications(response.data.certifications);
    } catch (err) {
      console.error('Failed to fetch certifications:', err);
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
      const submitData = {
        ...formData,
        issueDate: new Date(formData.issueDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null
      };

      if (editingCertification) {
        await api.put(`/profile/certifications/${editingCertification.id}`, submitData);
      } else {
        await api.post('/profile/certifications', submitData);
      }
      
      await fetchCertifications();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save certification');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    });
    setEditingCertification(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (certification) => {
    setEditingCertification(certification);
    setFormData({
      title: certification.title,
      issuer: certification.issuer,
      issueDate: new Date(certification.issueDate).toISOString().split('T')[0],
      expiryDate: certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : '',
      credentialId: certification.credentialId || '',
      credentialUrl: certification.credentialUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (certificationId) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      await api.delete(`/profile/certifications/${certificationId}`);
      await fetchCertifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete certification');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certifications</h1>
          <p className="text-gray-600">Manage your professional certifications</p>
        </div>

        {/* Add Certification Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Certification
          </Button>
        </div>

        {/* Certification Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingCertification ? 'Edit Certification' : 'Add New Certification'}
              </CardTitle>
              <CardDescription>
                Add your professional certifications and credentials
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
                      Certification Title *
                    </label>
                    <div className="relative">
                      <Certificate className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., AWS Certified Solutions Architect"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="issuer" className="text-sm font-medium text-gray-700">
                      Issuing Organization *
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="issuer"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="e.g., Amazon Web Services, Microsoft, Google"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="issueDate" className="text-sm font-medium text-gray-700">
                      Issue Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        value={formData.issueDate}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                      Expiry Date (Optional)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="credentialId" className="text-sm font-medium text-gray-700">
                      Credential ID (Optional)
                    </label>
                    <Input
                      id="credentialId"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleChange}
                      placeholder="e.g., AWS-123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="credentialUrl" className="text-sm font-medium text-gray-700">
                      Credential URL (Optional)
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="credentialUrl"
                        name="credentialUrl"
                        type="url"
                        value={formData.credentialUrl}
                        onChange={handleChange}
                        placeholder="https://credly.com/badges/..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingCertification ? 'Update Certification' : 'Add Certification')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Certifications List */}
        <div className="grid gap-6">
          {certifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Certificate className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No certifications added yet</h3>
                <p className="text-gray-600 mb-4">Start building your professional credentials by adding your first certification</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Certification
                </Button>
              </CardContent>
            </Card>
          ) : (
            certifications.map((certification) => (
              <Card key={certification.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Certificate className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl">{certification.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Award className="h-4 w-4 text-gray-500" />
                            <span className="text-lg font-medium text-gray-700">{certification.issuer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Issued: {formatDate(certification.issueDate)}
                        </div>
                        {certification.expiryDate && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Expires: {formatDate(certification.expiryDate)}
                          </div>
                        )}
                      </div>
                      {certification.expiryDate && (
                        <div className="mt-2">
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
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(certification)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(certification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certification.credentialId && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Credential ID</h4>
                        <p className="text-sm text-gray-600 font-mono">{certification.credentialId}</p>
                      </div>
                    )}
                    
                    {certification.credentialUrl && (
                      <div>
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Credential
                        </a>
                      </div>
                    )}
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
