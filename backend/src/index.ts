import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import chatsRouter from './routes/chats.js';
import messagesRouter from './routes/messages.js';
import filesRouter from './routes/files.js';
import aiRouter from './routes/ai.js';
import emailRouter from './routes/email.js';
import { getBlocksMode } from './blocks/index.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const USE_AWS_BLOCKS_EMULATION = process.env.USE_AWS_BLOCKS_EMULATION !== 'false';

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // ローカル開発環境
    const localOrigins = ['http://localhost:3000', 'http://localhost:5173'];
    // Codespaces環境
    const codespacesOrigin = origin && origin.match(/app\.github\.dev$/);
    
    if (!origin || localOrigins.includes(origin) || codespacesOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  const blocksMode = getBlocksMode();
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    blocksMode: blocksMode.description,
    isEmulation: blocksMode.isEmulation,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/files', filesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/email', emailRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  const blocksMode = getBlocksMode();
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  AWS Blocks Chatbot Backend                                    ║
║  Express Server Listening                                      ║
╚════════════════════════════════════════════════════════════════╝

Environment: ${NODE_ENV}
Port: ${PORT}
Blocks Mode: ${blocksMode.description}
Base URL: http://localhost:${PORT}

Endpoints:
  - /api/auth      (Authentication)
  - /api/chats     (Chat Management)
  - /api/messages  (Message Handling)
  - /api/files     (File Upload/Storage)
  - /api/ai        (AI Response Generation)
  - /api/email     (Email Notifications)
  `);
});

export default app;
