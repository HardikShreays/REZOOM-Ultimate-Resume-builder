const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')


dotenv.config();


const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL],
  credentials: true
}));
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
