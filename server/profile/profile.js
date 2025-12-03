// server/profile/profile.js
const prisma = require("../lib/prisma");
const express = require('express');
const { requireAuth } = require('../middleware/auth');
// LaTeX-based resume generation has been removed in favor of an HTML template
const PDFGenerator = require('../services/pdfGenerator');

const router = express.Router();

// Get user profile with all data
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        githubUrl: true,
        hackerrankUrl: true,
        geeksforgeeksUrl: true,
        codeforcesUrl: true,
        leetcodeUrl: true,
        codechefUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        portfolioUrl: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        certifications: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json({ user });
  } catch (err) {
    console.error('Profile error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Export full profile data as JSON file
router.get('/export', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        githubUrl: true,
        hackerrankUrl: true,
        geeksforgeeksUrl: true,
        codeforcesUrl: true,
        leetcodeUrl: true,
        codechefUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        portfolioUrl: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        certifications: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const filename = `rezoom-profile-${(user.name || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.send(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error('Export profile error', err);
    return res.status(500).json({ message: 'Failed to export profile' });
  }
});

// Update user profile with social links and contact info
router.put('/', requireAuth, async (req, res) => {
  try {
    console.log('Profile update request:', req.body);
    console.log('User ID:', req.user.id);
    
    const {
      name,
      phoneNumber,
      githubUrl,
      hackerrankUrl,
      geeksforgeeksUrl,
      codeforcesUrl,
      leetcodeUrl,
      codechefUrl,
      linkedinUrl,
      twitterUrl,
      portfolioUrl
    } = req.body;

    // Prepare update data, handling empty strings as null
    const updateData = {};
    if (name !== undefined && name !== '') updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl || null;
    if (hackerrankUrl !== undefined) updateData.hackerrankUrl = hackerrankUrl || null;
    if (geeksforgeeksUrl !== undefined) updateData.geeksforgeeksUrl = geeksforgeeksUrl || null;
    if (codeforcesUrl !== undefined) updateData.codeforcesUrl = codeforcesUrl || null;
    if (leetcodeUrl !== undefined) updateData.leetcodeUrl = leetcodeUrl || null;
    if (codechefUrl !== undefined) updateData.codechefUrl = codechefUrl || null;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl || null;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl || null;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl || null;

    console.log('Update data:', updateData);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        githubUrl: true,
        hackerrankUrl: true,
        geeksforgeeksUrl: true,
        codeforcesUrl: true,
        leetcodeUrl: true,
        codechefUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        portfolioUrl: true
      }
    });

    console.log('Updated user:', user);
    return res.json({ user });
  } catch (err) {
    console.error('Update profile error', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// EXPERIENCE CRUD
router.post('/experiences', requireAuth, async (req, res) => {
  try {
    const { company, role, startDate, endDate, description, technologies } = req.body;
    if (!company || !role || !startDate || !description) {
      return res.status(400).json({ message: 'company, role, startDate, and description are required' });
    }

    const experience = await prisma.experience.create({
      data: { 
        company, 
        role, 
        startDate: new Date(startDate), 
        endDate: endDate ? new Date(endDate) : null,
        description,
        technologies,
        userId: req.user.id 
      }
    });

    return res.status(201).json({ experience });
  } catch (err) {
    console.error('Create experience error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/experiences', requireAuth, async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { userId: req.user.id },
      orderBy: { startDate: 'desc' }
    });
    return res.json({ experiences });
  } catch (err) {
    console.error('Get experiences error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/experiences/:id', requireAuth, async (req, res) => {
  try {
    const { company, role, startDate, endDate, description, technologies } = req.body;
    const experienceId = parseInt(req.params.id);

    const experience = await prisma.experience.update({
      where: { id: experienceId, userId: req.user.id },
      data: { 
        company, 
        role, 
        startDate: new Date(startDate), 
        endDate: endDate ? new Date(endDate) : null,
        description,
        technologies
      }
    });

    return res.json({ experience });
  } catch (err) {
    console.error('Update experience error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/experiences/:id', requireAuth, async (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);
    await prisma.experience.delete({
      where: { id: experienceId, userId: req.user.id }
    });
    return res.json({ message: 'Experience deleted' });
  } catch (err) {
    console.error('Delete experience error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// EDUCATION CRUD
router.post('/educations', requireAuth, async (req, res) => {
  try {
    const { degree, institution, startYear, endYear, description } = req.body;
    if (!degree || !institution || !startYear) {
      return res.status(400).json({ message: 'degree, institution, and startYear are required' });
    }

    const education = await prisma.education.create({
      data: { 
        degree, 
        institution, 
        startYear: parseInt(startYear), 
        endYear: endYear ? parseInt(endYear) : null,
        description, 
        userId: req.user.id 
      }
    });

    return res.status(201).json({ education });
  } catch (err) {
    console.error('Create education error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/educations', requireAuth, async (req, res) => {
  try {
    const educations = await prisma.education.findMany({
      where: { userId: req.user.id },
      orderBy: { startYear: 'desc' }
    });
    return res.json({ educations });
  } catch (err) {
    console.error('Get educations error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/educations/:id', requireAuth, async (req, res) => {
  try {
    const { degree, institution, startYear, endYear, description } = req.body;
    const educationId = parseInt(req.params.id);

    const education = await prisma.education.update({
      where: { id: educationId, userId: req.user.id },
      data: { 
        degree, 
        institution, 
        startYear: parseInt(startYear), 
        endYear: endYear ? parseInt(endYear) : null,
        description 
      }
    });

    return res.json({ education });
  } catch (err) {
    console.error('Update education error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/educations/:id', requireAuth, async (req, res) => {
  try {
    const educationId = parseInt(req.params.id);
    await prisma.education.delete({
      where: { id: educationId, userId: req.user.id }
    });
    return res.json({ message: 'Education deleted' });
  } catch (err) {
    console.error('Delete education error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// SKILLS CRUD
router.post('/skills', requireAuth, async (req, res) => {
  try {
    const { name, proficiency } = req.body;
    if (!name || !proficiency) {
      return res.status(400).json({ message: 'name and proficiency are required' });
    }

    const skill = await prisma.skill.create({
      data: { name, proficiency, userId: req.user.id }
    });

    return res.status(201).json({ skill });
  } catch (err) {
    console.error('Create skill error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/skills', requireAuth, async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: req.user.id }
    });
    return res.json({ skills });
  } catch (err) {
    console.error('Get skills error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/skills/:id', requireAuth, async (req, res) => {
  try {
    const { name, proficiency } = req.body;
    const skillId = parseInt(req.params.id);

    const skill = await prisma.skill.update({
      where: { id: skillId, userId: req.user.id },
      data: { name, proficiency }
    });

    return res.json({ skill });
  } catch (err) {
    console.error('Update skill error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/skills/:id', requireAuth, async (req, res) => {
  try {
    const skillId = parseInt(req.params.id);
    await prisma.skill.delete({
      where: { id: skillId, userId: req.user.id }
    });
    return res.json({ message: 'Skill deleted' });
  } catch (err) {
    console.error('Delete skill error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PROJECTS CRUD
router.post('/projects', requireAuth, async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'title and description are required' });
    }

    const project = await prisma.project.create({
      data: { title, description, techStack, githubUrl, liveUrl, userId: req.user.id }
    });

    return res.status(201).json({ project });
  } catch (err) {
    console.error('Create project error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/projects', requireAuth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id }
    });
    return res.json({ projects });
  } catch (err) {
    console.error('Get projects error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/projects/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl } = req.body;
    const projectId = parseInt(req.params.id);

    const project = await prisma.project.update({
      where: { id: projectId, userId: req.user.id },
      data: { title, description, techStack, githubUrl, liveUrl }
    });

    return res.json({ project });
  } catch (err) {
    console.error('Update project error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/projects/:id', requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    await prisma.project.delete({
      where: { id: projectId, userId: req.user.id }
    });
    return res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Delete project error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// CERTIFICATIONS CRUD
router.post('/certifications', requireAuth, async (req, res) => {
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;
    if (!title || !issuer || !issueDate) {
      return res.status(400).json({ message: 'title, issuer, and issueDate are required' });
    }

    const certification = await prisma.certification.create({
      data: { 
        title, 
        issuer, 
        issueDate: new Date(issueDate), 
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId, 
        credentialUrl, 
        userId: req.user.id 
      }
    });

    return res.status(201).json({ certification });
  } catch (err) {
    console.error('Create certification error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/certifications', requireAuth, async (req, res) => {
  try {
    const certifications = await prisma.certification.findMany({
      where: { userId: req.user.id }
    });
    return res.json({ certifications });
  } catch (err) {
    console.error('Get certifications error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/certifications/:id', requireAuth, async (req, res) => {
  try {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;
    const certId = parseInt(req.params.id);

    const certification = await prisma.certification.update({
      where: { id: certId, userId: req.user.id },
      data: { 
        title, 
        issuer, 
        issueDate: new Date(issueDate), 
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId, 
        credentialUrl 
      }
    });

    return res.json({ certification });
  } catch (err) {
    console.error('Update certification error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/certifications/:id', requireAuth, async (req, res) => {
  try {
    const certId = parseInt(req.params.id);
    await prisma.certification.delete({
      where: { id: certId, userId: req.user.id }
    });
    return res.json({ message: 'Certification deleted' });
  } catch (err) {
    console.error('Delete certification error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Get all resumes for a user
router.get("/resumes", requireAuth, async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ resumes });
  } catch (err) {
    console.error('Get resumes error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific resume by ID
router.get("/resumes/:id", requireAuth, async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const resume = await prisma.resume.findFirst({
      where: { 
        id: resumeId, 
        userId: req.user.id 
      }
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    return res.json({ resume });
  } catch (err) {
    console.error('Get resume error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate a new resume
router.post("/resumes",requireAuth, async(req,res) => {
  try{
    const { title, template = 'professional' } = req.body;
    console.log('[ResumeBuilder][REST] Generate resume requested', {
      userId: req.user.id,
      title: title || null,
      template,
      source: 'rest_api'
    });
    // Get user data with all related information
    const user = await prisma.user.findUnique({
      where:{id : req.user.id},
      include: {experiences: {
        orderBy: { startDate: 'desc' }
      },
      educations: {
        orderBy: { startYear: 'desc' }
      },
      skills: true,
      projects: {
        orderBy: { createdAt: 'desc' }
      },
      certifications: {
        orderBy: { issueDate: 'desc' }
      }
    }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Simple ATS-friendly summary text stored as resume.content.
    const experiencesCount = Array.isArray(user.experiences) ? user.experiences.length : 0;
    const yearsLabel = experiencesCount > 0 ? `${experiencesCount}+ years` : 'experience';
    const topSkills = (Array.isArray(user.skills) ? user.skills : [])
      .map((s) => s.name)
      .filter(Boolean)
      .slice(0, 6)
      .join(', ') || 'software engineering';

    const resumeContent = `Software Engineer with ${yearsLabel} in ${topSkills}, seeking full-time software engineering roles.`;
    const resume = await prisma.resume.create({
      data: {
        title: title || `${user.name} - Resume`,
        content: resumeContent,
        userId: req.user.id
      }
    });
    console.log('[ResumeBuilder][REST] Resume created', {
      userId: req.user.id,
      resumeId: resume.id,
      title: resume.title
    });
    return res.status(201).json({ resume });

  }catch(err){
    console.error('Create resume error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a resume
router.delete('/resumes/:id', requireAuth, async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    
    await prisma.resume.delete({
      where: { 
        id: resumeId, 
        userId: req.user.id 
      }
    });

    return res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete resume error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Handle OPTIONS request for CORS preflight
router.options('/resumes/:id/pdf', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    /\.vercel\.app$/, // Allow all Vercel deployments
    /\.netlify\.app$/  // Allow Netlify deployments
  ].filter(Boolean);
  
  const isAllowed = allowedOrigins.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }
    return false;
  });
  
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Generate PDF from resume using HTML template (Format-1)
router.get('/resumes/:id/pdf', requireAuth, async (req, res) => {
  console.log('api hit');
  try {
    const resumeId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        experiences: true,
        educations: true,
        projects: true,
        skills: true,
        certifications: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resume = await prisma.resume.findFirst({
      where: { 
        id: resumeId, 
        userId: req.user.id 
      },
    });
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Build structured data for Format-1 template
    const links = [
      user.linkedinUrl,
      user.githubUrl,
      user.portfolioUrl,
      user.hackerrankUrl,
      user.leetcodeUrl,
      user.codeforcesUrl,
      user.codechefUrl,
      user.geeksforgeeksUrl,
      user.twitterUrl,
    ].filter(Boolean);

    const summary = resume.content || '';

    const education = user.educations.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      years: `${edu.startYear} - ${edu.endYear || 'Present'}`,
      grade: edu.description || '',
    }));

    const internships = user.experiences.map((exp) => ({
      role: exp.role,
      company: exp.company,
      duration: `${exp.startDate.toISOString().slice(0, 10)} - ${
        exp.endDate ? exp.endDate.toISOString().slice(0, 10) : 'Present'
      }`,
      points: [exp.description].filter(Boolean),
    }));

    const projects = user.projects.map((proj) => ({
      name: proj.title,
      links: [proj.githubUrl, proj.liveUrl].filter(Boolean).join(' | '),
      points: [proj.description].filter(Boolean),
    }));

    const certifications = user.certifications.map((cert) => {
      const parts = [
        cert.title,
        cert.issuer,
        cert.credentialId ? `Credential ID: ${cert.credentialId}` : null,
      ].filter(Boolean);
      return parts.join(' - ');
    });

    const skills = [
      {
        category: 'Technical Skills',
        items: user.skills.map((s) => s.name),
      },
    ];

    const extra = [];

    const pdfData = {
      name: user.name,
      phone: user.phoneNumber || '',
      email: user.email,
      links,
      summary,
      education,
      internships,
      projects,
      certifications,
      skills,
      extra,
    };

    const pdfGenerator = new PDFGenerator();
    const pdfBuffer = await pdfGenerator.generatePDF(pdfData, `resume_${resumeId}`);
    // Set CORS headers for PDF - use the same logic as main CORS config
    const origin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_FRONTEND_URL,
      /\.vercel\.app$/, // Allow all Vercel deployments
      /\.netlify\.app$/  // Allow Netlify deployments
    ].filter(Boolean);
    
    // Check if origin is allowed (same logic as main CORS)
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Set headers for PDF download with user name
    const filename = `Resume-${user.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    return res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Handle OPTIONS request for CORS preflight
router.options('/resumes/pdf', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    /\.vercel\.app$/, // Allow all Vercel deployments
    /\.netlify\.app$/  // Allow Netlify deployments
  ].filter(Boolean);
  
  const isAllowed = allowedOrigins.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }
    return false;
  });
  
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

module.exports = router;