import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabaseIfEmpty } from './utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Process resiliency handlers
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Security & Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDemo = process.env.DEMO_MODE === 'true' || !process.env.AI_API_KEY;
  res.status(200).json({
    status: 'healthy',
    product: 'LeadPilot AI',
    version: '1.0.0',
    aiEngine: {
      mode: isDemo ? 'DEMO_MODE (Deterministic Heuristic)' : 'LIVE (Gemini 3.7 Flash)',
      isDemoMode: isDemo,
      model: isDemo ? 'deterministic-icp-v1' : 'gemini-3.7-flash',
      status: 'operational'
    },
    timestamp: new Date().toISOString()
  });
});

// Reset / Seed database endpoint
app.post('/api/seed/reset', async (req, res, next) => {
  try {
    await seedDatabaseIfEmpty(true);
    res.status(200).json({
      success: true,
      message: 'Database successfully re-seeded with default 32 B2B leads dataset.'
    });
  } catch (err) {
    next(err);
  }
});

// Lead Routes
app.use('/api/leads', leadRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

// Bootstrap Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabaseIfEmpty(false);

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 LeadPilot AI Server running on port ${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   API:    http://localhost:${PORT}/api/leads`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();

export default app;
