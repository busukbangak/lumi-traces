import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import { connectDB, disconnectDB } from './database'

const PORT = Number(process.env.PORT) || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const DB_NAME = process.env.DB_NAME || 'lumi-traces'

const app = express()
app.use(cors())
app.use(express.json())

async function start() {
  try {
    await connectDB(MONGODB_URI, DB_NAME)

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB()
  process.exit(0)
})
process.on('SIGTERM', async () => {
  await disconnectDB()
  process.exit(0)
})

// Start server
start();


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});