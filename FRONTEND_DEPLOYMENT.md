# 🚀 Frontend-Only Deployment Guide

## Quick Fix for 404 Errors

The 404 error is happening because Vercel is trying to deploy the entire monorepo. Let's deploy just the frontend first.

## Step 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Connect your GitHub repository
   - Select "REZOOM - The Ultimate Resume Builder"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `client` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client directory
cd client

# Deploy
vercel --prod
```

## Step 2: Deploy Backend Separately

### Option A: Deploy Backend to Railway (Recommended)

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend**
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**
   ```
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   PORT=3001
   ```

### Option B: Deploy Backend to Vercel (Advanced)

Create a separate Vercel project for the backend:

1. **Create New Vercel Project**
   - Import same repository
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty

2. **Add vercel.json in server directory**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.js"
       }
     ]
   }
   ```

## Step 3: Update Frontend API URL

After deploying the backend, update your frontend environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

Or if using Vercel for backend:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

## Step 4: Test Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test `https://your-backend-url/api/auth/signup`
3. **Integration**: Try signing up from the frontend

## Troubleshooting

### Common Issues:

1. **404 on Frontend**
   - Make sure Root Directory is set to `client`
   - Check that Build Command is `npm run build`

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS settings on backend
   - Ensure backend is deployed and running

3. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

## Database Setup

For production, use one of these:

### Option A: PlanetScale (Recommended)
```bash
# Get connection string from PlanetScale dashboard
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/database?sslaccept=strict"
```

### Option B: Railway Database
```bash
# Railway will provide connection string
DATABASE_URL="mysql://username:password@containers-us-west-xyz.railway.app:port/railway"
```

### Option C: Vercel Postgres
```bash
# Vercel will provide connection string
DATABASE_URL="postgresql://username:password@ep-xyz.us-east-1.postgres.vercel-storage.com/database"
```

## Final Configuration

After both deployments:

1. **Frontend URL**: `https://your-frontend.vercel.app`
2. **Backend URL**: `https://your-backend.railway.app` (or Vercel)
3. **Environment Variables**:
   ```
   # Frontend (Vercel)
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   
   # Backend (Railway)
   DATABASE_URL=your-database-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   ```

## Benefits of This Approach

- ✅ **Simpler Deployment**: No complex monorepo configuration
- ✅ **Better Performance**: Frontend and backend can scale independently
- ✅ **Easier Debugging**: Separate logs and monitoring
- ✅ **Cost Effective**: Use free tiers for both services
- ✅ **Flexibility**: Can deploy to different providers

Your REZOOM resume builder will be live and working! 🎉
