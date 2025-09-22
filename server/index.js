const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')


dotenv.config();


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
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
// profile router
const profileRouter = require('./profile/profile')
app.use('/profile', profileRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
