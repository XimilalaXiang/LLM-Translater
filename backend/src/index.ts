import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/schema';
import { knowledgeService } from './services/knowledgeService';
import modelRoutes from './routes/modelRoutes';
import translationRoutes from './routes/translationRoutes';
import knowledgeRoutes from './routes/knowledgeRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize database
initDatabase();

// Load existing knowledge bases
knowledgeService.loadExistingKnowledgeBases().catch(err => {
  console.error('Failed to load knowledge bases:', err);
});

// Routes
app.use('/api/models', modelRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    Legal Translation Review System - Backend Server      ║
║                                                           ║
║    Server running on: http://localhost:${PORT}              ║
║    Environment: ${process.env.NODE_ENV || 'development'}                        ║
║                                                           ║
║    API Endpoints:                                         ║
║    - GET  /api/health                                     ║
║    - *    /api/models                                     ║
║    - *    /api/translations                               ║
║    - *    /api/knowledge                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
