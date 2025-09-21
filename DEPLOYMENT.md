# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Push your code to GitHub
3. **Database** - Set up a production database (PlanetScale, Railway, or Vercel Postgres)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

## Step 2: Database Setup (Choose One)

### Option A: PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get your connection string
4. Copy your schema from `server/schema.prisma`

### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new MySQL database
3. Get your connection string

### Option C: Vercel Postgres
1. In your Vercel project dashboard
2. Go to Storage tab
3. Create a new Postgres database

## Step 3: Deploy to Vercel

### 3.1 Connect Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select "REZOOM - The Ultimate Resume Builder"

### 3.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3.3 Environment Variables
Add these environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL="your-production-database-url"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-for-production"

# API URL (will be set automatically)
NEXT_PUBLIC_API_URL="https://your-app.vercel.app"

# Node Environment
NODE_ENV="production"
```

### 3.4 Deploy
Click "Deploy" and wait for the build to complete.

## Step 4: Configure API Routes

Your `vercel.json` file is already configured to handle both frontend and backend routes:

- Frontend routes: `/*` → serves Next.js app
- API routes: `/api/*` → serves Express.js backend

## Step 5: Database Migration

After deployment, run database migrations:

1. Go to your Vercel project dashboard
2. Go to Functions tab
3. Create a new function to run migrations:

```javascript
// api/migrate.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Step 6: Test Your Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **API**: Test `https://your-app.vercel.app/api/auth/signup`
3. **PDF Generation**: Test resume creation and PDF download

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (should be 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if database is accessible from Vercel
   - Ensure Prisma schema is up to date

3. **PDF Generation Issues**
   - Puppeteer needs additional configuration for Vercel
   - May need to use `@sparticuz/chromium` for serverless

### Puppeteer Configuration for Vercel:

Update `server/services/pdfGenerator.js`:

```javascript
const puppeteer = require('puppeteer');

// For Vercel deployment
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ]
});
```

## Production Checklist

- [ ] Environment variables set
- [ ] Database connected and migrated
- [ ] JWT secret is secure
- [ ] PDF generation working
- [ ] Authentication working
- [ ] CORS configured properly
- [ ] Error handling in place
- [ ] Logging configured

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update environment variables with new domain

## Monitoring

- Use Vercel Analytics to monitor performance
- Set up error tracking with Sentry
- Monitor database performance
- Track PDF generation success rates

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test database connectivity
4. Verify API endpoints are working

Your REZOOM resume builder should now be live on Vercel! 🎉
