// server/automation/langgraph.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import prisma from "../lib/prisma.js";

// Lightweight fetch helper that works both in Node 18+ (global fetch)
// and older Node versions via dynamic import of node-fetch.
const httpFetch =
  typeof fetch === "function"
    ? fetch
    : (...args) =>
        import("node-fetch").then(({ default: fetchFn }) => fetchFn(...args));

// Define custom agent state (extends MessagesAnnotation with additional fields)
const AgentState = Annotation.Root({
  // Messages from MessagesAnnotation
  messages: MessagesAnnotation.spec.messages,
  // Custom fields for your automation workflow
  userId: Annotation({
    reducer: (x, y) => y ?? x, // Keep the latest value
  }),
  scrapedData: Annotation({
    reducer: (x, y) => y ?? x, // Store scraped content
  }),
  resumeId: Annotation({
    reducer: (x, y) => y ?? x, // Store created resume ID
  }),
  currentStep: Annotation({
    reducer: (x, y) => y ?? x, // Track workflow step (e.g., "scraping", "generating", "saving")
  }),
});

// ========== CRUD TOOLS ==========
// Helper to create tools with state access
// We'll store current state in a closure during graph execution
let currentState = null;

function setCurrentState(state) {
  currentState = state;
}

function getCurrentState() {
  return currentState;
}

function ensureUserId() {
  const state = getCurrentState();
  if (!state || !state.userId) {
    throw new Error("userId is required but not found in state");
  }
  return state.userId;
}

// Profile Tools
const getProfileTool = new DynamicStructuredTool({
  name: "get_user_profile",
  description: "Get the user's complete profile including all experiences, educations, skills, projects, and certifications",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startYear: 'desc' } },
        skills: true,
        projects: { orderBy: { createdAt: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } }
      }
    });
    return JSON.stringify(user, null, 2);
  },
});

// Parse and update social links from free-form text
const parseAndUpdateSocialLinksTool = new DynamicStructuredTool({
  name: "parse_and_update_social_links",
  description: "Given any free-form text, extract the user's social/profile links (GitHub, LinkedIn, portfolio/personal website, Twitter, LeetCode, Codeforces, CodeChef, HackerRank, GeeksforGeeks) and update the corresponding fields on the user profile in the database. Only update fields for links that are actually present in the text.",
  schema: z.object({
    text: z.string().describe("The raw text that may contain one or more social/profile URLs."),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const text = input.text || "";

    // Basic URL extraction
    const urlRegex = /https?:\/\/[^\s)]+/gi;
    const urls = text.match(urlRegex) || [];

    const updateData = {};

    for (const rawUrl of urls) {
      let url = rawUrl.trim();
      // Strip trailing punctuation
      url = url.replace(/[),.]+$/, "");

      try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        // Only set each field once per invocation, keeping the first URL seen
        if (host.includes("github.com")) {
          if (!updateData.githubUrl) updateData.githubUrl = url;
        } else if (host.includes("linkedin.com")) {
          if (!updateData.linkedinUrl) updateData.linkedinUrl = url;
        } else if (host.includes("twitter.com") || host.includes("x.com")) {
          if (!updateData.twitterUrl) updateData.twitterUrl = url;
        } else if (host.includes("leetcode.com")) {
          if (!updateData.leetcodeUrl) updateData.leetcodeUrl = url;
        } else if (host.includes("codeforces.com")) {
          if (!updateData.codeforcesUrl) updateData.codeforcesUrl = url;
        } else if (host.includes("codechef.com")) {
          if (!updateData.codechefUrl) updateData.codechefUrl = url;
        } else if (host.includes("hackerrank.com")) {
          if (!updateData.hackerrankUrl) updateData.hackerrankUrl = url;
        } else if (host.includes("geeksforgeeks.org")) {
          if (!updateData.geeksforgeeksUrl) updateData.geeksforgeeksUrl = url;
        } else {
          // Treat any other valid URL as a potential portfolio/personal site
          // Only set portfolioUrl if we don't already have a more specific match from this text
          if (!updateData.portfolioUrl) {
            updateData.portfolioUrl = url;
          }
        }
      } catch (e) {
        // Ignore invalid URLs
        continue;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return "No recognizable social/profile links were found in the provided text.";
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return JSON.stringify(
      {
        message: "Social/profile links parsed and updated successfully.",
        updatedFields: Object.keys(updateData),
        user,
      },
      null,
      2
    );
  },
});

// Import GitHub profile data (public repos) and create projects
const importGithubProfileTool = new DynamicStructuredTool({
  name: "import_github_profile_from_url",
  description:
    "Given a GitHub profile URL, fetch public repositories and create project entries for the user. Only add new projects for repos that are not already linked by githubUrl. Do not invent data.",
  schema: z.object({
    url: z.string().url().describe("GitHub profile URL, e.g. https://github.com/username"),
    maxRepos: z
      .number()
      .int()
      .min(1)
      .max(30)
      .optional()
      .describe("Maximum number of recent repositories to import (default 8)."),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const githubUrl = input.url.trim();
    const limit = input.maxRepos || 8;

    let username;
    try {
      const parsed = new URL(githubUrl);
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (!parts[0]) {
        throw new Error("Invalid GitHub profile URL");
      }
      username = parts[0];
    } catch (e) {
      throw new Error("Invalid GitHub profile URL");
    }

    const base = "https://api.github.com";
    const headers = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const userResp = await httpFetch(`${base}/users/${username}`, {
      headers,
    });
    if (!userResp.ok) {
      throw new Error(
        `Failed to fetch GitHub user ${username}: ${userResp.status} ${userResp.statusText}`
      );
    }
    const userData = await userResp.json();

    const reposResp = await httpFetch(
      `${base}/users/${username}/repos?sort=updated&per_page=${limit}`,
      { headers }
    );
    if (!reposResp.ok) {
      throw new Error(
        `Failed to fetch repositories for ${username}: ${reposResp.status} ${reposResp.statusText}`
      );
    }
    const repos = await reposResp.json();

    const createdProjects = [];

    for (const repo of repos) {
      // Skip forks and archived repos to keep data relevant
      if (repo.fork || repo.archived) continue;

      const githubRepoUrl = repo.html_url;
      if (!githubRepoUrl) continue;

      // Avoid duplicates by githubUrl
      const existing = await prisma.project.findFirst({
        where: { userId, githubUrl: githubRepoUrl },
      });
      if (existing) continue;

      const title = repo.name || "GitHub Project";
      const description =
        repo.description ||
        `GitHub repository ${repo.name || ""}`.trim();

      const techStackParts = [];
      if (repo.language) techStackParts.push(repo.language);
      const techStack = techStackParts.join(", ");

      const project = await prisma.project.create({
        data: {
          userId,
          title,
          description,
          techStack: techStack || "GitHub",
          githubUrl: githubRepoUrl,
          liveUrl: repo.homepage || null,
        },
      });

      createdProjects.push({
        id: project.id,
        title: project.title,
        githubUrl: project.githubUrl,
      });
    }

    return {
      username,
      importedProjects: createdProjects.length,
      projects: createdProjects,
      githubProfile: {
        htmlUrl: userData.html_url,
        name: userData.name,
        bio: userData.bio,
      },
    };
  },
});

const updateProfileTool = new DynamicStructuredTool({
  name: "update_user_profile",
  description: "Update user profile information (name, phone, social links). Ensure all URLs are valid and properly formatted. Do NOT modify or invent data.",
  schema: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
    twitterUrl: z.string().url().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const updateData = {};
    Object.keys(input).forEach(key => {
      if (input[key] !== undefined && input[key] !== '') {
        updateData[key] = input[key] || null;
      }
    });
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    return JSON.stringify(user, null, 2);
  },
});

// Experience Tools
const createExperienceTool = new DynamicStructuredTool({
  name: "create_experience",
  description: "Create a new work experience entry. Filter out irrelevant details and rewrite descriptions to be professional, concise, and achievement-oriented. Use action verbs and quantify results when possible. Do NOT add information that wasn't provided.",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
    technologies: z.string().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const experience = await prisma.experience.create({
      data: {
        ...input,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        userId
      }
    });
    return JSON.stringify(experience, null, 2);
  },
});

const getExperiencesTool = new DynamicStructuredTool({
  name: "get_experiences",
  description: "Get all work experiences for the user",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const experiences = await prisma.experience.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' }
    });
    return JSON.stringify(experiences, null, 2);
  },
});

const updateExperienceTool = new DynamicStructuredTool({
  name: "update_experience",
  description: "Update an existing work experience. Filter and rewrite content to be more professional and impactful while preserving all factual information. Do NOT invent or hallucinate data.",
  schema: z.object({
    id: z.number(),
    company: z.string().optional(),
    role: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    technologies: z.string().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const { id, ...updateData } = input;
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    const experience = await prisma.experience.update({
      where: { id, userId },
      data: updateData
    });
    return JSON.stringify(experience, null, 2);
  },
});

const deleteExperienceTool = new DynamicStructuredTool({
  name: "delete_experience",
  description: "Delete a work experience entry",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    await prisma.experience.delete({
      where: { id: input.id, userId }
    });
    return `Experience ${input.id} deleted successfully`;
  },
});

// Education Tools
const createEducationTool = new DynamicStructuredTool({
  name: "create_education",
  description: "Create a new education entry",
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    startYear: z.number(),
    endYear: z.number().optional(),
    description: z.string().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const education = await prisma.education.create({
      data: { ...input, userId }
    });
    return JSON.stringify(education, null, 2);
  },
});

const getEducationsTool = new DynamicStructuredTool({
  name: "get_educations",
  description: "Get all education entries for the user",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const educations = await prisma.education.findMany({
      where: { userId },
      orderBy: { startYear: 'desc' }
    });
    return JSON.stringify(educations, null, 2);
  },
});

const updateEducationTool = new DynamicStructuredTool({
  name: "update_education",
  description: "Update an existing education entry",
  schema: z.object({
    id: z.number(),
    degree: z.string().optional(),
    institution: z.string().optional(),
    startYear: z.number().optional(),
    endYear: z.number().optional(),
    description: z.string().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const { id, ...updateData } = input;
    const education = await prisma.education.update({
      where: { id, userId },
      data: updateData
    });
    return JSON.stringify(education, null, 2);
  },
});

const deleteEducationTool = new DynamicStructuredTool({
  name: "delete_education",
  description: "Delete an education entry",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    await prisma.education.delete({
      where: { id: input.id, userId }
    });
    return `Education ${input.id} deleted successfully`;
  },
});

// Skill Tools
const createSkillTool = new DynamicStructuredTool({
  name: "create_skill",
  description: "Create a new skill entry",
  schema: z.object({
    name: z.string(),
    proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const skill = await prisma.skill.create({
      data: { ...input, userId }
    });
    return JSON.stringify(skill, null, 2);
  },
});

const getSkillsTool = new DynamicStructuredTool({
  name: "get_skills",
  description: "Get all skills for the user",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const skills = await prisma.skill.findMany({
      where: { userId }
    });
    return JSON.stringify(skills, null, 2);
  },
});

const updateSkillTool = new DynamicStructuredTool({
  name: "update_skill",
  description: "Update an existing skill",
  schema: z.object({
    id: z.number(),
    name: z.string().optional(),
    proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const { id, ...updateData } = input;
    const skill = await prisma.skill.update({
      where: { id, userId },
      data: updateData
    });
    return JSON.stringify(skill, null, 2);
  },
});

const deleteSkillTool = new DynamicStructuredTool({
  name: "delete_skill",
  description: "Delete a skill entry",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    await prisma.skill.delete({
      where: { id: input.id, userId }
    });
    return `Skill ${input.id} deleted successfully`;
  },
});

// Project Tools
const createProjectTool = new DynamicStructuredTool({
  name: "create_project",
  description: "Create a new project entry. Filter irrelevant details and rewrite descriptions professionally. Highlight key technologies, achievements, and impact. Do NOT add information that wasn't provided.",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.string().optional(),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const project = await prisma.project.create({
      data: { ...input, userId }
    });
    return JSON.stringify(project, null, 2);
  },
});

const getProjectsTool = new DynamicStructuredTool({
  name: "get_projects",
  description: "Get all projects for the user",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const projects = await prisma.project.findMany({
      where: { userId }
    });
    return JSON.stringify(projects, null, 2);
  },
});

const updateProjectTool = new DynamicStructuredTool({
  name: "update_project",
  description: "Update an existing project",
  schema: z.object({
    id: z.number(),
    title: z.string().optional(),
    description: z.string().optional(),
    techStack: z.string().optional(),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const { id, ...updateData } = input;
    const project = await prisma.project.update({
      where: { id, userId },
      data: updateData
    });
    return JSON.stringify(project, null, 2);
  },
});

const deleteProjectTool = new DynamicStructuredTool({
  name: "delete_project",
  description: "Delete a project entry",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    await prisma.project.delete({
      where: { id: input.id, userId }
    });
    return `Project ${input.id} deleted successfully`;
  },
});

// Certification Tools
const createCertificationTool = new DynamicStructuredTool({
  name: "create_certification",
  description: "Create a new certification entry",
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const certification = await prisma.certification.create({
      data: {
        ...input,
        issueDate: new Date(input.issueDate),
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
        userId
      }
    });
    return JSON.stringify(certification, null, 2);
  },
});

const getCertificationsTool = new DynamicStructuredTool({
  name: "get_certifications",
  description: "Get all certifications for the user",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const certifications = await prisma.certification.findMany({
      where: { userId }
    });
    return JSON.stringify(certifications, null, 2);
  },
});

const updateCertificationTool = new DynamicStructuredTool({
  name: "update_certification",
  description: "Update an existing certification",
  schema: z.object({
    id: z.number(),
    title: z.string().optional(),
    issuer: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url().optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const { id, ...updateData } = input;
    if (updateData.issueDate) updateData.issueDate = new Date(updateData.issueDate);
    if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate);
    const certification = await prisma.certification.update({
      where: { id, userId },
      data: updateData
    });
    return JSON.stringify(certification, null, 2);
  },
});

const deleteCertificationTool = new DynamicStructuredTool({
  name: "delete_certification",
  description: "Delete a certification entry",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    await prisma.certification.delete({
      where: { id: input.id, userId }
    });
    return `Certification ${input.id} deleted successfully`;
  },
});

// Resume Tools
const getResumesTool = new DynamicStructuredTool({
  name: "get_resumes",
  description: "Get all resumes for the user",
  schema: z.object({}),
  func: async (input) => {
    const userId = ensureUserId();
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return JSON.stringify(resumes, null, 2);
  },
});

const getResumeTool = new DynamicStructuredTool({
  name: "get_resume",
  description: "Get a specific resume by ID",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    const resume = await prisma.resume.findFirst({
      where: { id: input.id, userId }
    });
    if (!resume) return `Resume ${input.id} not found`;
    return JSON.stringify(resume, null, 2);
  },
});

const createResumeTool = new DynamicStructuredTool({
  name: "create_resume",
  description: "Generate and create a new resume from user's profile data. CRITICAL: Filter information to include only relevant, recent, and impactful content. Rewrite all descriptions to be professional, achievement-oriented, and ATS-friendly. Prioritize quantifiable results and action verbs. NEVER hallucinate or invent data - only use information that exists in the user's profile. If information is missing, the resume should reflect what's actually available.",
  schema: z.object({
    title: z.string().optional(),
    template: z.enum(["ats-friendly", "professional", "modern"]).optional(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    // HTML-based PDF generation: create a simple ATS-style summary string
    console.log('[ResumeBuilder][Bot] create_resume tool invoked', {
      userId,
      title: input.title || null,
      template: input.template || 'ats-friendly',
      source: 'langgraph_tool'
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startYear: 'desc' } },
        skills: true,
        projects: { orderBy: { createdAt: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } }
      }
    });
    if (!user) throw new Error("User not found");

    const experiencesCount = Array.isArray(user.experiences) ? user.experiences.length : 0;
    const yearsLabel = experiencesCount > 0 ? `${experiencesCount}+ years` : 'experience';
    const topSkills = (Array.isArray(user.skills) ? user.skills : [])
      .map((s) => s.name)
      .filter(Boolean)
      .slice(0, 6)
      .join(', ') || 'software engineering';

    // Let AI decide the most relevant 2–3 projects when possible
    const rawProjects = Array.isArray(user.projects) ? user.projects : [];
    const projectSummaries = rawProjects.map((p, idx) => ({
      index: idx,
      title: p.title,
      description: p.description,
      techStack: p.techStack,
    }));

    let selectedProjectIndexes = [];

    if (projectSummaries.length > 0 && process.env.GOOGLE_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-lite" });

        const prompt = `
You are selecting the 2–3 most relevant, impressive projects for a one-page software engineer resume.

Return ONLY valid JSON, no text, with this exact shape:
{"indexes":[0,2,3]}

Guidelines:
- Prefer recent, complex, and impact-focused projects.
- Prefer projects that match typical software engineering roles.
- Use the "index" field from each project object, not titles.

Projects:
${JSON.stringify(projectSummaries, null, 2)}
        `.trim();

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Some models still wrap JSON in ```json fences; strip them defensively.
        let jsonText = text;
        const fenced = jsonText.match(/```(?:json)?([\s\S]*?)```/i);
        if (fenced) {
          jsonText = fenced[1].trim();
        }

        const parsed = JSON.parse(jsonText);
        if (parsed && Array.isArray(parsed.indexes)) {
          selectedProjectIndexes = parsed.indexes
            .filter((i) => Number.isInteger(i) && i >= 0 && i < rawProjects.length)
            .slice(0, 3);
        }
      } catch (e) {
        console.error("AI project selection failed, falling back to first 3:", e);
      }
    }

    // Fallback: if AI failed or returned nothing, just take first 3
    if (selectedProjectIndexes.length === 0) {
      selectedProjectIndexes = rawProjects.map((_, idx) => idx).slice(0, 3);
    }

    const topProjects = selectedProjectIndexes
      .map((i) => rawProjects[i])
      .filter(Boolean)
      .map((p) => p.title);

    const projectsLine = topProjects.length
      ? ` Key projects: ${topProjects.join(', ')}.`
      : '';

    const resumeContent = `Software Engineer with ${yearsLabel} in ${topSkills}, seeking full-time software engineering roles.${projectsLine}`;
    const resume = await prisma.resume.create({
      data: {
        title: input.title || `${user.name} - Resume`,
        content: resumeContent,
        userId
      }
    });
    console.log('[ResumeBuilder][Bot] Resume created', {
      userId,
      resumeId: resume.id,
      title: resume.title
    });
    // Return structured data so LangGraph can merge resumeId into state
    return {
      resumeId: resume.id,
      resume,
      message: "Resume created successfully",
    };
  },
});

const deleteResumeTool = new DynamicStructuredTool({
  name: "delete_resume",
  description: "Delete a resume",
  schema: z.object({
    id: z.number(),
  }),
  func: async (input) => {
    const userId = ensureUserId();
    await prisma.resume.delete({
      where: { id: input.id, userId }
    });
    return `Resume ${input.id} deleted successfully`;
  },
});

// Collect all tools
const tools = [
  getProfileTool,
  updateProfileTool,
  parseAndUpdateSocialLinksTool,
  importGithubProfileTool,
  createExperienceTool,
  getExperiencesTool,
  updateExperienceTool,
  deleteExperienceTool,
  createEducationTool,
  getEducationsTool,
  updateEducationTool,
  deleteEducationTool,
  createSkillTool,
  getSkillsTool,
  updateSkillTool,
  deleteSkillTool,
  createProjectTool,
  getProjectsTool,
  updateProjectTool,
  deleteProjectTool,
  createCertificationTool,
  getCertificationsTool,
  updateCertificationTool,
  deleteCertificationTool,
  getResumesTool,
  getResumeTool,
  createResumeTool,
  deleteResumeTool,
];

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a professional resume advisor and career consultant for REZOOM, an AI-powered resume builder platform. Your role is to guide users in creating exceptional, ATS-friendly resumes that accurately represent their professional journey.

**CORE PRINCIPLES:**
1. **Professional & Honest**: Be direct, honest, and professional in all interactions. Provide constructive feedback without sugar-coating. If a user's experience or skills need improvement, tell them clearly and suggest actionable steps.

2. **Data Integrity**: 
   - NEVER hallucinate or invent data. Only use information that the user provides or that exists in their profile.
   - When filtering or rewriting data during CRUD operations, preserve the original meaning and facts.
   - If information is missing, ask the user for it rather than making assumptions.

3. **Smart Filtering & Rewriting**:
   - When creating or updating entries (experiences, projects, skills, etc.), filter out irrelevant or redundant information.
   - Rewrite content to be more professional, concise, and impactful while maintaining accuracy.
   - Use action verbs, quantify achievements, and highlight relevant accomplishments.
   - Remove filler words, vague descriptions, and unprofessional language.

4. **Resume Generation**:
   - When creating resumes, filter information to include only what's relevant to the user's goals or the job they're targeting.
   - Prioritize recent, relevant experiences and achievements.
   - Rewrite bullet points to be achievement-oriented and results-focused.
   - Ensure consistency in formatting, tone, and style throughout the resume.
   - Do NOT add information that wasn't provided by the user.

5. **Tool Usage & Capabilities**:
   - You can directly create, update, or delete profile data by calling the provided tools. Never say you cannot modify the backend.
   - Use the available tools proactively whenever a user asks you to add/edit/delete anything (experiences, education, skills, projects, certifications) or to create/manage resumes.
   - You have full permission to create resumes (use the create_resume tool) and save them to the user's profile. If a user asks for a resume, generate it and confirm it was saved.
   - When a user wants to view data, call the corresponding get_ tools and present the results clearly.
   - Always confirm with the user before deleting or overwriting data.
   - After using tools, summarize exactly what was done (e.g., “Created resume titled X – view it here: /dashboard/resumes”).
   - Whenever a user message contains one or more URLs that look like social/profile links (GitHub, LinkedIn, portfolio/personal site, Twitter/X, LeetCode, Codeforces, CodeChef, HackerRank, GeeksforGeeks), call the parse_and_update_social_links tool with the raw user text to store those URLs on the user's profile before replying.
   - When a user shares a GitHub profile URL, also call the import_github_profile_from_url tool to import a small number of their public repositories as projects (avoiding duplicates), then clearly tell them what was imported.
   - When a user asks you to "scrape" or "pull from" LinkedIn, GitHub, or any external site:
     - Explain briefly that you cannot directly browse arbitrary web pages, but for GitHub you can use the import_github_profile_from_url tool to import public repositories.
     - Still call parse_and_update_social_links on their message so the shared URLs are saved to their profile.
     - Ask them to share either (a) the URL and important sections of their profile text, or (b) a resume/export of their profile.
     - When they share profile/resume text, extract only factual, relevant experience/education/skills/projects/certifications and save them using the appropriate create_ tools without inventing data.

6. **Communication Style**:
   - Be concise but thorough.
   - Ask clarifying questions when needed.
   - Provide specific, actionable advice.
   - Celebrate user achievements while being honest about areas for improvement.
   - Format your responses cleanly: use line breaks, bullet points (with dashes), and clear paragraphs.
   - Avoid markdown formatting symbols like asterisks (*) or backticks unless absolutely necessary.
   - Write in a natural, conversational tone that's professional yet approachable.

7. **Response Formatting**:
   - Use clear, readable formatting without markdown symbols.
   - Use line breaks to separate ideas.
   - Use dashes (-) for lists instead of asterisks.
   - When mentioning actions taken (like creating a resume or adding an experience), clearly state what was done and provide context.

Remember: Your goal is to help users create resumes that accurately and powerfully represent their professional story, not to embellish or fabricate their experience.`;

// 1. LLM instance (Gemini) with tools bound
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "models/gemini-2.0-flash-lite",
}).bindTools(tools);

// 2. Assistant node: calls LLM and may return tool calls
async function assistantNode(state) {
  setCurrentState(state); // Make state available to tools
  let { messages } = state;
  
  // Separate system message from other messages
  const systemMessage = messages.find(msg => msg instanceof SystemMessage);
  const nonSystemMessages = messages.filter(msg => !(msg instanceof SystemMessage));
  
  // Ensure system message exists and is first
  const systemMsg = systemMessage || new SystemMessage(SYSTEM_PROMPT);
  
  // Prepare messages array with system message always first
  const messagesForLLM = [systemMsg, ...nonSystemMessages];
  
  // Invoke LLM with messages (system message first)
  const response = await llm.invoke(messagesForLLM);
  
  // Return updated messages - system message always first, then all other messages including response
  const updatedMessages = [systemMsg, ...nonSystemMessages, response];
  
  return { messages: updatedMessages };
}

// 3. Tool node: executes tool calls with state access
const toolNode = new ToolNode(tools);
// Wrap toolNode to ensure state is set
const toolNodeWithState = async (state) => {
  setCurrentState(state);
  return await toolNode.invoke(state);
};

// 4. Conditional routing: check if we need to call tools
function shouldContinue(state) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  // If the last message has tool calls, route to tools
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  // Otherwise, we're done
  return "end";
}

// 5. Build the graph with tool support
const builder = new StateGraph(AgentState)
  .addNode("assistant", assistantNode)
  .addNode("tools", toolNodeWithState)
  .addEdge("__start__", "assistant")
  .addConditionalEdges("assistant", shouldContinue, {
    tools: "tools",
    end: "__end__"
  })
  .addEdge("tools", "assistant"); // After tools execute, go back to assistant

const app = builder.compile();

// Prompt injection protection
function sanitizeUserInput(input) {
  if (!input || typeof input !== 'string') return input;
  
  // List of potentially harmful patterns
  const dangerousPatterns = [
    /ignore (previous|all) (instructions|prompts?|commands?)/i,
    /forget (previous|all) (instructions|prompts?|commands?)/i,
    /you are now (a|an) .* (instead|now)/i,
    /system:.*/i,
    /\[INST\].*\[\/INST\]/i,
    /<\|.*\|>/i,
    /(roleplay|pretend|act as|you are) .* (ignore|forget|disregard)/i,
  ];
  
  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      throw new Error('Invalid input detected. Please rephrase your request.');
    }
  }
  
  // Remove excessive whitespace and normalize
  return input.trim().replace(/\s+/g, ' ');
}

// Helper to convert plain message objects to LangChain message types
function convertToLangChainMessages(messages) {
  return messages.map(msg => {
    // Sanitize user messages only
    if (msg.role === "user") {
      msg.content = sanitizeUserInput(msg.content);
    }
    
    if (msg.role === "system") {
      return new SystemMessage(msg.content || "");
    } else if (msg.role === "assistant") {
      return new AIMessage(msg.content || "");
    } else {
      return new HumanMessage(msg.content || "");
    }
  });
}

// 4. Helper used by Express route
export async function runChat(messages, options = {}) {
  // messages: [{ role: "user" | "assistant" | "system", content: string }, ...]
  // options: { userId?, scrapedData?, resumeId?, currentStep? }
  
  // Convert plain message objects to LangChain message types
  const langChainMessages = convertToLangChainMessages(messages);
  
  const initialState = {
    messages: langChainMessages,
    userId: options.userId || null,
    scrapedData: options.scrapedData || null,
    resumeId: options.resumeId || null,
    currentStep: options.currentStep || null,
  };
  const result = await app.invoke(initialState);
  
  // Extract the last message (assistant reply)
  const lastMessage = result.messages[result.messages.length - 1];
  
  return {
    reply: lastMessage,
    state: {
      userId: result.userId,
      scrapedData: result.scrapedData,
      resumeId: result.resumeId,
      currentStep: result.currentStep,
    },
  };
}