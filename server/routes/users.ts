import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// TODO: Implement user management endpoints
// - Get user profile
// - Update profile
// - Change password
// - Enable 2FA
// - Manage recovery codes

router.get('/profile', (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      fullName: req.user.full_name,
      avatarUrl: req.user.avatar_url,
      isEmailVerified: req.user.is_email_verified,
      twoFactorEnabled: req.user.two_factor_enabled,
      accountStatus: req.user.account_status,
      createdAt: req.user.created_at
    }
  });
});

export { router as userRoutes };
