import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const sessionToken = authHeader.substring(7);

    // Verify session
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        users (
          id,
          email,
          username,
          full_name,
          avatar_url,
          is_email_verified,
          two_factor_enabled,
          account_status,
          password_hash
        )
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Check user account status
    if (session.users.account_status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // Update session activity
    await supabaseAdmin
      .from('sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', session.id);

    // Attach user and session to request
    req.user = session.users;
    req.session = session;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get user roles
      const { data: roles, error } = await supabaseAdmin
        .from('user_role_assignments')
        .select(`
          user_roles!inner (
            name
          )
        `)
        .eq('user_id', userId);

      if (error) {
        return res.status(500).json({ error: 'Failed to verify permissions' });
      }

      const userRoleNames = (roles as any)?.map((r: any) => r.user_roles?.name) || [];

      // Check if user has required role
      const hasRequiredRole = requiredRoles.some(role => userRoleNames.includes(role));

      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get user permissions
      const { data: roleAssignments, error } = await supabaseAdmin
        .from('user_role_assignments')
        .select(`
          user_roles!inner (
            permissions
          )
        `)
        .eq('user_id', userId);

      if (error) {
        return res.status(500).json({ error: 'Failed to verify permissions' });
      }

      // Check permissions
      let hasPermission = false;
      for (const assignment of roleAssignments || []) {
        const permissions = (assignment as any).user_roles?.permissions;
        if (permissions?.['*'] === '*' ||
            permissions?.[resource]?.includes(action) ||
            permissions?.[resource] === '*') {
          hasPermission = true;
          break;
        }
      }

      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};
