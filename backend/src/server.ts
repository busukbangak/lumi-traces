import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import { connectDB, disconnectDB } from './database'
import tracesRoutes from './routes/tracesRoutes';
import imageRoutes from './routes/imagesRoutes';
import authRoutes from './routes/authRoutes';
import { generalLimiter } from './middlewares/rateLimiter';

const PORT = Number(process.env.PORT) || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const NODE_ENV = process.env.NODE_ENV || 'development'
const DB_NAME = NODE_ENV 

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', generalLimiter)

async function start() {
  // Database Connection
  await connectDB(MONGODB_URI, DB_NAME);

  // Routes
  app.use('/api', authRoutes);
  app.use('/api', imageRoutes);
  app.use('/api', tracesRoutes);

  // Server Start
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

// Disconnect DB on termination signals
process.on('SIGINT', async () => {
  await disconnectDB()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await disconnectDB()
  process.exit(0)
})

// Start the server
start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
