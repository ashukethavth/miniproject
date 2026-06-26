import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/supabase';
import { EncryptionService } from '../services/encryption';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ✅ Custom Request type
interface AuthRequest extends Request {
  user?: any;
}

// ================= VALIDATIONS =================
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').optional().isLength({ min: 2, max: 100 }),
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

// ================= REGISTER =================
router.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, username } = req.body;

    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = EncryptionService.hashPassword(password);

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        email,
        username,
        full_name: fullName,
        password_hash: passwordHash,
        role: 'user',
        account_status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ================= LOGIN =================
router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt', { email });

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.warn('Login failed user not found', { email, error });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = EncryptionService.verifyPassword(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = EncryptionService.generateShareToken();

    res.json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ================= LOGOUT =================
router.post('/logout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await supabaseAdmin
        .from('sessions')
        .update({ is_active: false })
        .eq('session_token', token);
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ================= VERIFY =================
router.get('/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      valid: true,
      user: req.user,
    });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// ================= CHANGE PASSWORD =================
router.post(
  '/change-password',
  authMiddleware,
  [body('currentPassword').exists(), body('newPassword').isLength({ min: 8 })],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      const isValid = EncryptionService.verifyPassword(
        currentPassword,
        user.password_hash
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Incorrect password' });
      }

      const newHash = EncryptionService.hashPassword(newPassword);

      await supabaseAdmin
        .from('users')
        .update({ password_hash: newHash })
        .eq('id', user.id);

      res.json({ message: 'Password updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }
);

// ================= EXPORT =================
export { router as authRoutes };