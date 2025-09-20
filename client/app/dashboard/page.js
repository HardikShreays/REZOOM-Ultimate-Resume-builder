'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, LogOut, Plus, Eye } from "lucide-react";
import Link from 'next/link';
import api from '@/services/api';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">REZOOM</span>
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your profile and build your perfect resume
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">View Complete Profile</h2>
                  <p className="text-gray-600">See all your information organized in one place</p>
                </div>
                <Link href="/dashboard/profile">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-5 w-5 mr-2" />
                    All About Me
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Email: {user?.email}
              </p>
              <div className="flex space-x-2">
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Add your technical and soft skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/skills">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Skills
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Projects Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Showcase your work and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/projects">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Projects
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
              <CardDescription>
                Add your work experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/experience">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Experience
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Add your educational background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/education">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Education
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Add your professional certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/certifications">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Certifications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Resume Builder Section */}
        <div className="mt-12">
          <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to build your resume?
              </h3>
              <p className="text-gray-600 mb-6">
                Generate a professional resume from your profile data
              </p>
              <Button size="lg" className="px-8">
                Generate Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}