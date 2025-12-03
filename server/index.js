import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
// pdf-parse v1.1.1 exports a function directly; this will always be a function
// Import the core parser implementation directly to avoid test-file lookups in some environments
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from './lib/prisma.js';

const genAI = process.env.GOOGLE_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) : null;

const app = express();
// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_FRONTEND_URL,
      /\.vercel\.app$/, // Allow all Vercel deployments
      /\.netlify\.app$/  // Allow Netlify deployments
    ].filter(Boolean); // Remove undefined values
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Simple health route
app.get("/", (req, res) => res.send("Backend running 🚀"));

// Auth routes
import authRouter from './routes/auth.js';
app.use('/auth', authRouter);
// profile router
import profileRouter from './profile/profile.js';
app.use('/profile', profileRouter);

// Chat/AI agent routes
import { requireAuth } from './middleware/auth.js';
import { runChat } from './agent/langgraph.js';

app.post('/chat', requireAuth, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Convert messages to LangChain format if needed
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'assistant' : msg.role,
      content: msg.content || msg.text || '',
    }));

    const result = await runChat(formattedMessages, {
      userId: req.user.id,
    });

    // Extract reply content from LangChain message object
    const replyMessage = result.reply;
    const replyContent = replyMessage?.content || replyMessage?.text || 'I apologize, but I encountered an error processing your request.';

    // Detect operations from the reply content and state
    const operations = [];
    
    // Check if a resume was created
    if (result.state?.resumeId) {
      operations.push({
        type: 'resume_created',
        id: result.state.resumeId,
        message: 'Resume created successfully',
        link: `/dashboard/resumes`,
      });
    }
    
    // Parse reply content to detect operations
    const contentLower = replyContent.toLowerCase();
    if (contentLower.includes('experience') && (contentLower.includes('added') || contentLower.includes('created'))) {
      operations.push({
        type: 'experience_added',
        message: 'Experience added to your profile',
        link: `/dashboard/experience`,
      });
    }
    if (contentLower.includes('project') && (contentLower.includes('added') || contentLower.includes('created'))) {
      operations.push({
        type: 'project_added',
        message: 'Project added to your profile',
        link: `/dashboard/projects`,
      });
    }
    if (contentLower.includes('skill') && (contentLower.includes('added') || contentLower.includes('created'))) {
      operations.push({
        type: 'skill_added',
        message: 'Skill added to your profile',
        link: `/dashboard/skills`,
      });
    }

    res.json({
      reply: {
        role: 'assistant',
        content: replyContent,
      },
      state: result.state,
      operations: operations,
    });
  } catch (err) {
    console.error('Chat error:', err);
    const errorMessage = err.message === 'Invalid input detected. Please rephrase your request.' 
      ? err.message 
      : 'Chat failed';
    res.status(500).json({ error: 'Chat failed', message: errorMessage });
  }
});

// Resume upload endpoint
// On Vercel and many serverless platforms, only /tmp is writable.
import multer from 'multer';
const upload = multer({ dest: '/tmp', limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

app.post('/chat/upload-resume', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!genAI) {
      return res.status(500).json({ error: 'Resume parsing is not configured (missing GOOGLE_API_KEY).' });
    }

    const pdfBuffer = await fs.readFile(req.file.path);
    await fs.unlink(req.file.path).catch(() => {});

    const parsed = await pdfParse(pdfBuffer);
    const text = parsed.text?.trim();
    if (!text) {
      return res.status(400).json({ error: 'Unable to extract text from the uploaded PDF. Please upload a clearer file.' });
    }

    const structuredData = await extractStructuredResumeData(text);
    const summary = await persistExtractedData(structuredData, req.user.id);

    res.json({
      message: `Resume uploaded and parsed. Added ${summary.experiences} experiences, ${summary.educations} education entries, ${summary.projects} projects, ${summary.skills} skills, and ${summary.certifications} certifications.`,
      summary,
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to upload resume', message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

async function extractStructuredResumeData(resumeText) {
  const prompt = `You are an expert resume parser. Analyze the provided resume text and return ONLY valid JSON (without markdown or commentary) using this schema:
{
  "experiences": [
    {
      "company": "string",
      "role": "string",
      "startDate": "Month Year or YYYY",
      "endDate": "Month Year or YYYY or Present",
      "description": "2-3 bullet summary",
      "technologies": "comma separated list"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "startYear": "YYYY",
      "endYear": "YYYY or blank",
      "description": "string"
    }
  ],
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "techStack": "comma separated list",
      "githubUrl": "url or blank",
      "liveUrl": "url or blank"
    }
  ],
  "certifications": [
    {
      "title": "string",
      "issuer": "string",
      "issueDate": "Month Year or YYYY",
      "expiryDate": "Month Year or YYYY or blank",
      "credentialId": "string",
      "credentialUrl": "url or blank"
    }
  ]
}

If a section is missing, return an empty array for it. Never fabricate data. Resume text:
${resumeText}`;

  // Use a generally available model for structured JSON parsing
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-lite' });
  const result = await model.generateContent([{ text: prompt }]);
  const raw = result.response.text().trim();
  const jsonString = extractJsonFromString(raw);
  return JSON.parse(jsonString);
}

function extractJsonFromString(text) {
  const fenced = text.match(/```json\\s*([\\s\\S]*?)```/i);
  if (fenced) {
    return fenced[1];
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Failed to parse AI output as JSON.');
  }
  return text.slice(start, end + 1);
}

async function persistExtractedData(data, userId) {
  const summary = {
    experiences: 0,
    educations: 0,
    skills: 0,
    projects: 0,
    certifications: 0,
  };

  if (Array.isArray(data.experiences)) {
    for (const exp of data.experiences) {
      if (!exp.company || !exp.role) continue;
      const startDate = parseDate(exp.startDate);
      if (!startDate) continue;
      const endDate = parseDate(exp.endDate);
      await prisma.experience.create({
        data: {
          userId,
          company: exp.company,
          role: exp.role,
          startDate,
          endDate,
          description: exp.description || '',
          technologies: exp.technologies || '',
        },
      });
      summary.experiences += 1;
    }
  }

  if (Array.isArray(data.education)) {
    for (const edu of data.education) {
      if (!edu.degree || !edu.institution) continue;
      const startYear = parseYear(edu.startYear);
      if (!startYear) continue;
      const endYear = parseYear(edu.endYear);
      await prisma.education.create({
        data: {
          userId,
          degree: edu.degree,
          institution: edu.institution,
          startYear,
          endYear,
          description: edu.description || '',
        },
      });
      summary.educations += 1;
    }
  }

  if (Array.isArray(data.skills)) {
    for (const skl of data.skills) {
      const name = typeof skl === 'string' ? skl : skl?.name;
      if (!name) continue;
      await prisma.skill.create({
        data: {
          userId,
          name,
          proficiency: 'Intermediate',
        },
      });
      summary.skills += 1;
    }
  }

  if (Array.isArray(data.projects)) {
    for (const proj of data.projects) {
      if (!proj.title || !proj.description) continue;
      await prisma.project.create({
        data: {
          userId,
          title: proj.title,
          description: proj.description,
          techStack: proj.techStack || '',
          githubUrl: proj.githubUrl || null,
          liveUrl: proj.liveUrl || null,
        },
      });
      summary.projects += 1;
    }
  }

  if (Array.isArray(data.certifications)) {
    for (const cert of data.certifications) {
      if (!cert.title || !cert.issuer) continue;
      await prisma.certification.create({
        data: {
          userId,
          title: cert.title,
          issuer: cert.issuer,
          issueDate: parseDate(cert.issueDate) || new Date(),
          expiryDate: parseDate(cert.expiryDate),
          credentialId: cert.credentialId || null,
          credentialUrl: cert.credentialUrl || null,
        },
      });
      summary.certifications += 1;
    }
  }

  return summary;
}

function parseDate(value) {
  if (!value) return null;
  if (typeof value === 'number') {
    const fromYear = new Date(`${value}-01-01`);
    return isNaN(fromYear) ? null : fromYear;
  }
  const str = value.toString().trim();
  if (!str || str.toLowerCase() === 'present') {
    return null;
  }
  const direct = new Date(str);
  if (!isNaN(direct)) return direct;
  const yearMatch = str.match(/\\b(19|20)\\d{2}\\b/);
  if (yearMatch) {
    const approx = new Date(`${yearMatch[0]}-01-01`);
    if (!isNaN(approx)) return approx;
  }
  return null;
}

function parseYear(value) {
  if (!value) return null;
  if (typeof value === 'number') return value;
  const match = value.toString().match(/\\b(19|20)\\d{2}\\b/);
  return match ? parseInt(match[0], 10) : null;
}
