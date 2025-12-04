# 🚀 REZOOM - The Ultimate Resume Builder

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Prisma-Database-orange?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
</div>

<br>

<div align="center">
  <h3>✨ AI-Powered Resume Builder for Modern Professionals</h3>
  <p>Create ATS-friendly, role-specific resumes in minutes with our intelligent resume builder</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🤖 AI Features](#-ai-features)
- [📁 Project Structure](#-project-structure)
- [🔧 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [📄 PDF Generation Technology](#-pdf-generation-technology)
- [📊 Database Schema](#-database-schema)
- [🔐 Authentication](#-authentication)
- [🚀 Deployment](#-deployment)
- [🆕 Recent Updates](#-recent-updates)
- [📱 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Features
- **🤖 AI-Powered Chat Assistant**: Interactive AI assistant powered by Google Gemini 2.0 Flash Lite and LangGraph that helps you build and optimize your resume through natural conversation
- **📄 AI Resume Generation**: Generate role-specific resumes automatically based on your profile data with intelligent filtering and optimization
- **📤 PDF Resume Upload & Parsing**: Upload your existing PDF resume and let AI extract and populate your profile automatically
- **🔗 GitHub Profile Import**: Automatically import your GitHub repositories as projects with a single URL
- **📄 ATS Optimization**: Every resume is optimized to pass Applicant Tracking Systems
- **📄 PDF Export**: Download professional PDF resumes with custom naming (Resume-{Name}.pdf)
- **👁️ PDF Preview**: View resumes in browser before downloading
- **🎨 Multiple Templates**: Choose from ATS-Friendly, Professional, and Creative templates
- **👤 User Profiles**: Comprehensive user profiles with social links (GitHub, LinkedIn, Portfolio, Twitter, LeetCode, Codeforces, etc.) and portfolio integration
- **📚 Experience Management**: Add and manage work experiences with detailed descriptions
- **🎓 Education Tracking**: Track educational background and achievements
- **💼 Project Portfolio**: Showcase your projects with tech stacks and live links
- **🛠️ Skills Management**: Organize skills by proficiency levels
- **🏆 Certifications**: Track professional certifications and credentials
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Beautiful dark mode support with theme toggle

### 🔒 Security Features
- **🔐 JWT Authentication**: Secure token-based authentication
- **🛡️ Password Hashing**: Bcrypt password encryption
- **🔒 Protected Routes**: Secure API endpoints with middleware
- **🌐 CORS Configuration**: Cross-origin resource sharing setup

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19.1.0** - Modern React with latest features
- **🎨 Next.js 15.5.3** - Full-stack React framework with Turbopack
- **💅 Tailwind CSS 4** - Utility-first CSS framework
- **🎭 Radix UI** - Accessible component primitives
- **📦 Lucide React** - Beautiful icon library
- **🔧 Axios** - HTTP client for API requests

### Backend
- **🚀 Node.js** - JavaScript runtime
- **⚡ Express.js** - Fast, unopinionated web framework
- **🗄️ Prisma** - Modern database ORM
- **🐘 PostgreSQL** - Relational database
- **🔐 JWT** - JSON Web Token authentication
- **🛡️ Bcrypt** - Password hashing
- **📄 Puppeteer** - HTML-based PDF generation (with `puppeteer-core` + `@sparticuz/chromium`)
- **🤖 Google Gemini AI** - AI-powered chat assistant and resume parsing
- **🔄 LangGraph** - AI agent workflow orchestration
- **📝 LangChain** - LLM application framework

### Development Tools
- **📝 ESLint** - Code linting and formatting
- **🔄 Nodemon** - Development server auto-restart
- **🎨 PostCSS** - CSS processing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rezoom-resume-builder.git
   cd rezoom-resume-builder
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rezoom_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3001
   GOOGLE_API_KEY="your-google-gemini-api-key"
   FRONTEND_URL="http://localhost:3000"
   NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"
   ```
   
   **Note**: Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey). This is required for:
   - AI chat assistant functionality
   - PDF resume parsing
   - AI-powered resume generation

4. **Database Setup**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development servers**
   
   **Terminal 1 - Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend Server:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Quick Start - Generate Your First Resume

1. **Create Account** - Sign up at http://localhost:3000/signup
2. **Build Profile** - Add your experience, education, skills, and projects
   - **Option A**: Manually add information through the dashboard
   - **Option B**: Use the AI Chat Assistant to add information through conversation
   - **Option C**: Upload your existing PDF resume and let AI extract the data
   - **Option D**: Import your GitHub profile to automatically add projects
3. **Generate Resume** - Go to Dashboard → Resume Builder
4. **Choose Template** - Select from ATS-Friendly, Professional, or Creative
5. **Download PDF** - Click "Download PDF" to get your professional resume

**PDF Format**: Files are automatically named as `Resume-{YourName}.pdf`

### AI Chat Assistant

The AI Chat Assistant is your personal resume consultant powered by Google Gemini 2.0 Flash Lite:

- **Natural Conversation**: Chat naturally about your career and resume
- **Smart Data Entry**: Add experiences, projects, skills, and education through conversation
- **Intelligent Filtering**: AI filters and optimizes your content for ATS compatibility
- **Professional Rewriting**: Automatically rewrites descriptions to be more impactful
- **Resume Generation**: Create resumes directly through chat
- **GitHub Integration**: Import GitHub repositories by sharing your profile URL
- **Social Links Extraction**: Automatically extracts and saves social profile links from your messages

**Example Chat Commands**:
- "Add my experience as a Software Engineer at Google from 2020 to 2023"
- "Import my GitHub profile: https://github.com/username"
- "Create a resume for a Software Engineer position"
- "Add my project: E-commerce app built with React and Node.js"

---

## 📁 Project Structure

```
REZOOM - The Ultimate Resume Builder/
├── client/                          # Next.js Frontend
│   ├── app/                         # App Router (Next.js 13+)
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── certifications/     # Certifications management
│   │   │   ├── education/          # Education management
│   │   │   ├── experience/         # Work experience management
│   │   │   ├── profile/            # User profile management
│   │   │   ├── projects/           # Project portfolio
│   │   │   ├── resumes/            # Resume builder & PDF generation
│   │   │   └── skills/             # Skills management
│   │   ├── login/                  # Authentication pages
│   │   ├── signup/
│   │   ├── layout.js               # Root layout with SEO metadata
│   │   └── page.js                 # Landing page
│   ├── components/                 # Reusable UI components
│   │   └── ui/                     # Base UI components
│   ├── services/                   # API service layer
│   └── lib/                        # Utility functions
├── server/                         # Express.js Backend
│   ├── routes/                     # API route handlers
│   │   └── auth.js                 # Authentication routes
│   ├── middleware/                 # Custom middleware
│   │   └── auth.js                 # JWT authentication middleware
│   ├── profile/                    # Profile management routes
│   │   └── profile.js              # User profile CRUD operations
│   ├── services/                   # Business logic services
│   │   └── pdfGenerator.js         # HTML-based PDF generation with Puppeteer
│   ├── lib/                        # Database connection
│   ├── migrations/                 # Database migrations
│   ├── temp/                       # Temporary files for PDF generation
│   └── schema.prisma              # Database schema
└── README.md                       # Project documentation
```

---

## 🔧 API Documentation

### Authentication Endpoints

#### `POST /auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### `GET /auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### Profile Management Endpoints

#### `GET /profile`
Get user profile data.

#### `PUT /profile`
Update user profile information.

#### `POST /profile/experience`
Add work experience.

#### `POST /profile/education`
Add education record.

#### `POST /profile/project`
Add project to portfolio.

#### `POST /profile/skill`
Add skill to profile.

#### `POST /profile/certification`
Add certification.

### AI Chat & Resume Parsing Endpoints

#### `POST /chat`
Chat with the AI assistant for resume guidance and profile management.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Add my experience as a Software Engineer at Google"
    }
  ]
}
```

**Response:**
```json
{
  "reply": {
    "content": "I've added your experience at Google..."
  },
  "operations": [
    {
      "type": "experience_added",
      "message": "Experience added to your profile",
      "link": "/dashboard/experience"
    }
  ]
}
```

#### `POST /profile/upload-resume`
Upload a PDF resume and extract profile data automatically.

**Request:** Multipart form data with `resume` file

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "summary": "Added 3 experiences, 2 educations, 5 skills..."
}
```

### Resume & PDF Generation Endpoints

#### `GET /profile/resumes`
Get all resumes for the authenticated user.

#### `POST /profile/resumes`
Generate a new resume with specified template.

**Request Body:**
```json
{
  "title": "Software Engineer Resume",
  "template": "ats-friendly"
}
```

#### `GET /profile/resumes/:id/pdf`
Download resume as PDF file.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:** PDF file download with filename format: `Resume-{UserName}.pdf`

#### `DELETE /profile/resumes/:id`
Delete a specific resume.

---

## 🎨 UI Components

The project uses a modern component library built with:

- **Radix UI Primitives** - Accessible, unstyled UI components
- **Tailwind CSS** - Utility-first styling
- **Custom Components** - Reusable UI elements

### Available Components
- `Button` - Customizable button component
- `Card` - Content container with header, content, and footer
- `Input` - Form input with validation states
- `Badge` - Status and category indicators

---

## 🤖 AI Features

REZOOM leverages Google Gemini 2.0 Flash Lite and LangGraph to provide intelligent resume building assistance:

### AI Chat Assistant

The AI Chat Assistant is built on LangGraph, providing a sophisticated conversational interface for resume building:

- **Natural Language Processing**: Understand and process natural language requests
- **Context-Aware Conversations**: Maintains conversation context across multiple messages
- **Tool-Based Actions**: Uses structured tools to perform CRUD operations on your profile
- **Smart Content Optimization**: Automatically filters and rewrites content for ATS compatibility
- **Professional Guidance**: Provides honest, constructive feedback on your resume

### AI Capabilities

1. **Profile Data Management**
   - Add/update/delete experiences, education, skills, projects, and certifications
   - Extract social profile links from messages (GitHub, LinkedIn, Portfolio, etc.)
   - Import GitHub repositories as projects

2. **Resume Generation**
   - Generate role-specific resumes with intelligent filtering
   - Optimize content for ATS systems
   - Rewrite descriptions to be more impactful and achievement-oriented

3. **PDF Resume Parsing**
   - Upload existing PDF resumes
   - Extract structured data (experiences, education, skills, etc.)
   - Automatically populate profile with extracted information

4. **Content Intelligence**
   - Filter out irrelevant or redundant information
   - Use action verbs and quantify achievements
   - Remove filler words and unprofessional language
   - Maintain data integrity (never hallucinates or invents data)

### AI Architecture

- **LangGraph**: Workflow orchestration for multi-step AI operations
- **LangChain**: LLM application framework
- **Google Gemini 2.0 Flash Lite**: Fast, efficient language model
- **Tool System**: Structured tools for database operations
- **State Management**: Maintains conversation state and user context

---

## 📄 PDF Generation Technology

REZOOM uses an HTML + CSS pipeline rendered through Puppeteer to create professional, ATS-friendly resumes:

1. **Profile Data Collection** - User profile information is gathered from the database
2. **Structured JSON Assembly** - Profile data is converted to a structured JSON object
3. **HTML Rendering** - A clean, semantic HTML + CSS template (Format-1) is populated with this data
4. **PDF Generation** - `puppeteer-core` with `@sparticuz/chromium` renders the HTML to a high-quality A4 PDF
5. **Custom Naming** - PDFs are named with format `Resume-{UserName}.pdf`

### Format-1 Template
- **ATS-Friendly**: Clean, single-column layout with semantic sections
- **Typography**: Arial, 12px body text, 20px uppercase name heading, 11px contact line
- **Sections**: Objective / Summary, Education, Experience, Projects, Certifications, Skills, Extras
- **Structure**: Simple lists and a 2-column skills table with tight bullet spacing

### Features
- **High-Quality Output**: A4 PDF with proper margins (`0.5in` on all sides)
- **Semantic HTML**: No decorative elements that confuse ATS systems
- **Browser Preview**: View PDFs in browser before downloading
- **Secure Downloads**: Protected by JWT authentication

---

## 📊 Database Schema

### Core Models

#### User
```prisma
model User {
  id             Int             @id @default(autoincrement())
  name           String
  email          String          @unique
  password       String
  phoneNumber    String?
  githubUrl      String?
  linkedinUrl    String?
  portfolioUrl   String?
  // ... other social links
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

#### Resume
```prisma
model Resume {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Experience
```prisma
model Experience {
  id           Int      @id @default(autoincrement())
  company      String
  role         String
  startDate    DateTime
  endDate      DateTime?
  description  String   @db.Text
  technologies String?  @db.Text
  userId       Int
  user         User     @relation(fields: [userId], references: [id])
}
```

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Signup/Login** - Users receive a JWT token upon successful authentication
2. **Protected Routes** - API endpoints require valid JWT tokens
3. **Token Validation** - Middleware validates tokens on protected routes
4. **User Context** - Frontend stores and manages authentication state

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- CORS configuration
- Input validation and sanitization

---

## 🆕 Recent Updates

### v3.0.0 - AI Chat Assistant & Advanced Features
- ✅ **AI Chat Assistant** - Interactive AI-powered resume consultant using Google Gemini 2.0 Flash Lite and LangGraph
- ✅ **PDF Resume Upload & Parsing** - Upload existing PDF resumes and automatically extract profile data
- ✅ **GitHub Profile Import** - Import GitHub repositories as projects with a single URL
- ✅ **Smart Social Links Extraction** - Automatically extract and save social profile links from chat messages
- ✅ **Intelligent Content Filtering** - AI filters and optimizes resume content for ATS compatibility
- ✅ **Professional Content Rewriting** - AI rewrites descriptions to be more impactful and achievement-oriented
- ✅ **Natural Language Profile Management** - Add experiences, projects, skills through conversation

### v2.0.0 - PDF Generation & Enhanced UI
- ✅ **PDF Export Functionality** - Download professional PDF resumes
- ✅ **PDF Preview** - View resumes in browser before downloading
- ✅ **Custom PDF Naming** - Files named as `Resume-{UserName}.pdf`
- ✅ **Removed LaTeX Downloads** - Streamlined UI, PDF-only downloads
- ✅ **Enhanced Page Titles** - Dynamic SEO-optimized page titles
- ✅ **Improved Navigation** - Better user experience with clear page structure
- ✅ **Professional Templates** - ATS-Friendly, Professional, and Creative options

### Technical Improvements
- **LangGraph Integration** - Advanced AI agent workflow orchestration
- **Google Gemini AI** - State-of-the-art language model for chat and parsing
- **Puppeteer Integration** - High-quality PDF generation
- **Dynamic Metadata** - SEO-optimized page titles and descriptions
- **Enhanced Security** - Protected PDF downloads with JWT authentication
- **CORS Configuration** - Flexible CORS setup for multiple deployment environments

---

## 📱 Screenshots

### Landing Page
- Modern, responsive design with gradient backgrounds
- Feature highlights with animated cards
- Call-to-action sections with professional CTAs
- Professional statistics and testimonials

### Dashboard
- Comprehensive user profile management
- Experience tracking with date ranges
- Project portfolio with tech stack display
- Skills and certifications management
- Resume builder with template selection
- AI Chat Assistant access

### AI Chat Assistant
- Natural conversation interface
- Real-time profile updates
- Smart notifications for operations
- GitHub profile import
- PDF resume upload and parsing

### Resume Builder
- Template selection interface
- PDF preview and download functionality
- Professional resume generation
- Custom naming and organization

---

## 🚀 Deployment

### Production Deployment

For detailed deployment instructions, see:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Full Vercel deployment guide
- **[FRONTEND_DEPLOYMENT.md](./FRONTEND_DEPLOYMENT.md)** - Frontend-only deployment guide

### Quick Deployment Options

1. **Vercel (Frontend + Backend)**
   - Deploy frontend to Vercel with root directory `client`
   - Deploy backend separately or use Vercel serverless functions
   - Configure environment variables in Vercel dashboard

2. **Railway (Backend) + Vercel (Frontend)**
   - Deploy backend to Railway with root directory `server`
   - Deploy frontend to Vercel with root directory `client`
   - Update `NEXT_PUBLIC_API_URL` in frontend environment variables

### Required Environment Variables

**Backend:**
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_API_KEY` - Google Gemini API key (required for AI features)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS
- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL for CORS

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure AI features work with proper API keys

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database ORM
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives
- **Google Gemini** - For powerful AI capabilities
- **LangChain & LangGraph** - For AI agent orchestration
- **Puppeteer** - For high-quality PDF generation

## 📚 Additional Resources

- **API Documentation** - See [API Documentation](#-api-documentation) section above
- **Deployment Guides** - See [DEPLOYMENT.md](./DEPLOYMENT.md) and [FRONTEND_DEPLOYMENT.md](./FRONTEND_DEPLOYMENT.md)
- **Database Schema** - See [Database Schema](#-database-schema) section above

---

<div align="center">
  <p>Made with ❤️ by Hardik Shreyas</p>
  <p>
    <a href="#-rezoom---the-ultimate-resume-builder">⬆️ Back to Top</a>
  </p>
  </p>
</div>
