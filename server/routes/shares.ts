import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// TODO: Implement sharing endpoints
// - Create share
// - List shares
// - Update share permissions
// - Revoke share
// - Accept share
// - Public share access

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Shares API - Coming soon' });
});

export { router as shareRoutes };
