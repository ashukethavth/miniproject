import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Admin-only routes
router.use(requireRole(['admin']));

// TODO: Implement admin endpoints
// - User management
// - System statistics
// - Security monitoring
// - Configuration management

router.get('/stats', (req: Request, res: Response) => {
  res.json({ message: 'Admin stats API - Coming soon' });
});

export { router as adminRoutes };
