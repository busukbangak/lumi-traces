import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from '../src/database';
import tracesRoutes from '../src/routes/tracesRoutes';
import imageRoutes from '../src/routes/imagesRoutes';
import authRoutes from '../src/routes/authRoutes';
import { generalLimiter } from '../src/middlewares/rateLimiter';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_NAME = NODE_ENV;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', generalLimiter);

// Database connection (cached for serverless)
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    await connectDB(MONGODB_URI, DB_NAME);
    isConnected = true;
  }
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await ensureDbConnection();
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', imageRoutes);
app.use('/api', tracesRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Export for Vercel
export default app;
