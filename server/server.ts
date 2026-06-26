import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { supabaseAdmin, REALTIME_CHANNELS } from './config/supabase';
import { authRoutes } from './routes/auth';
import { fileRoutes } from './routes/files';
import { folderRoutes } from './routes/folders';
import { shareRoutes } from './routes/shares';
import { adminRoutes } from './routes/admin';
import { auditRoutes } from './routes/audit';
import { userRoutes } from './routes/users';
import { realtimeService } from './services/realtime';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 auth attempts per windowMs (increased for development)
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation (can be enhanced)
    const allowedTypes = [
      'image/',
      'video/',
      'audio/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument',
      'text/',
      'application/zip',
      'application/x-rar-compressed'
    ];

    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);

  // Log to audit logs for important operations (only if Supabase is available)
  if (supabaseAdmin && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    supabaseAdmin.from('audit_logs').insert({
      action: `api.${req.method.toLowerCase()}`,
      resource_type: 'api',
      details: {
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent')
      },
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }).then(() => {}, (err: any) => console.error('Audit log error:', err));
  }

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/shares', shareRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/users', userRoutes);

// File upload endpoint with multer
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // File upload logic will be handled in the file routes
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling middleware
app.use(async (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  // Log error to audit logs
  try {
    await supabaseAdmin?.from('audit_logs').insert({
      action: 'error.api',
      resource_type: 'api',
      details: {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
      },
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      severity: 'error'
    });
  } catch (logErr) {
    console.error('Error logging failed:', logErr);
  }

  // Send appropriate error response
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.code === 'PGRST116') { // Supabase not found error
    return res.status(404).json({ error: 'Resource not found' });
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize real-time service
realtimeService.initialize(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 CloudLock API server running on port ${PORT}`);
  console.log(`📡 Real-time features enabled`);
  console.log(`🔒 Security middleware active`);
  console.log(`📊 Audit logging enabled`);
});

export { app, server, io };
