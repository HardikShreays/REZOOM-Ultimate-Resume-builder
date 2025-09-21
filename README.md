# 🚀 REZOOM - The Ultimate Resume Builder

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Prisma-Database-orange?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql" alt="MySQL" />
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
- [📁 Project Structure](#-project-structure)
- [🔧 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [📊 Database Schema](#-database-schema)
- [🔐 Authentication](#-authentication)
- [📱 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Features
- **🤖 AI-Powered Generation**: Generate role-specific resumes automatically based on your profile data
- **📄 ATS Optimization**: Every resume is optimized to pass Applicant Tracking Systems
- **📄 PDF Export**: Download professional PDF resumes with custom naming (Resume-{Name}.pdf)
- **👁️ PDF Preview**: View resumes in browser before downloading
- **🎨 Multiple Templates**: Choose from ATS-Friendly, Professional, and Creative templates
- **👤 User Profiles**: Comprehensive user profiles with social links and portfolio integration
- **📚 Experience Management**: Add and manage work experiences with detailed descriptions
- **🎓 Education Tracking**: Track educational background and achievements
- **💼 Project Portfolio**: Showcase your projects with tech stacks and live links
- **🛠️ Skills Management**: Organize skills by proficiency levels
- **🏆 Certifications**: Track professional certifications and credentials
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

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
- **🐬 MySQL** - Relational database
- **🔐 JWT** - JSON Web Token authentication
- **🛡️ Bcrypt** - Password hashing
- **📄 Puppeteer** - PDF generation from LaTeX content
- **📝 LaTeX** - Professional document formatting

### Development Tools
- **📝 ESLint** - Code linting and formatting
- **🔄 Nodemon** - Development server auto-restart
- **🎨 PostCSS** - CSS processing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
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
   DATABASE_URL="mysql://username:password@localhost:3306/rezoom_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3001
   ```

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
3. **Generate Resume** - Go to Dashboard → Resume Builder
4. **Choose Template** - Select from ATS-Friendly, Professional, or Creative
5. **Download PDF** - Click "Download PDF" to get your professional resume

**PDF Format**: Files are automatically named as `Resume-{YourName}.pdf`

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
│   │   ├── profile.js              # User profile CRUD operations
│   │   └── resumeGen.js            # LaTeX resume generation
│   ├── services/                   # Business logic services
│   │   └── pdfGenerator.js         # PDF generation with Puppeteer
│   ├── lib/                        # Database connection
│   ├── migrations/                 # Database migrations
│   ├── temp/                       # Temporary files for PDF generation
│   ├── resume.cls                  # LaTeX resume template
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

## 📄 PDF Generation Technology

REZOOM uses advanced PDF generation technology to create professional resumes:

### LaTeX to PDF Pipeline
1. **Profile Data Collection** - User profile information is gathered
2. **LaTeX Generation** - Custom LaTeX templates are populated with user data
3. **HTML Conversion** - LaTeX content is converted to HTML for rendering
4. **PDF Generation** - Puppeteer renders HTML to high-quality PDF
5. **Custom Naming** - PDFs are named with format `Resume-{UserName}.pdf`

### Available Templates
- **ATS-Friendly**: Clean, professional format optimized for ATS systems
- **Professional**: Modern professional format with enhanced styling
- **Creative**: Creative format with visual elements

### Features
- **High-Quality Output**: 300 DPI PDF generation
- **A4 Format**: Standard resume paper size
- **Professional Styling**: Times New Roman font, proper margins
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

### v2.0.0 - PDF Generation & Enhanced UI
- ✅ **PDF Export Functionality** - Download professional PDF resumes
- ✅ **PDF Preview** - View resumes in browser before downloading
- ✅ **Custom PDF Naming** - Files named as `Resume-{UserName}.pdf`
- ✅ **Removed LaTeX Downloads** - Streamlined UI, PDF-only downloads
- ✅ **Enhanced Page Titles** - Dynamic SEO-optimized page titles
- ✅ **Improved Navigation** - Better user experience with clear page structure
- ✅ **Professional Templates** - ATS-Friendly, Professional, and Creative options

### Technical Improvements
- **Puppeteer Integration** - High-quality PDF generation
- **LaTeX to HTML Conversion** - Advanced document rendering
- **Dynamic Metadata** - SEO-optimized page titles and descriptions
- **Enhanced Security** - Protected PDF downloads with JWT authentication

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

### Resume Builder
- Template selection interface
- PDF preview and download functionality
- Professional resume generation
- Custom naming and organization

---

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

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database ORM
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives

---

<div align="center">
  <p>Made with ❤️ by Hardik Shreyas</p>
  <p>
    <a href="#-rezoom---the-ultimate-resume-builder">⬆️ Back to Top</a>
  </p>
  </p>
</div>
