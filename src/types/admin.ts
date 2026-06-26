export interface Share {
  id: string;
  fileName: string;
  fileId: string;
  type: 'link' | 'user' | 'group';
  status: 'active' | 'expired' | 'revoked';
  permissions: ('view' | 'download' | 'edit' | 'comment')[];
  expiresAt: string | null;
  accessCount: number;
  lastAccessed: string | null;
  sharedWith: string; // Email or "Anyone with link"
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resourceType: 'file' | 'folder' | 'user' | 'system' | 'share';
  resourceId: string;
  resourceName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  ipAddress: string;
  location: string;
  details: string;
}

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'suspended' | 'pending';
  storageUsed: number;
  storageLimit: number;
  lastLogin: string;
  createdAt: string;
  mfaEnabled: boolean;
  mfaType: 'sms' | 'totp' | 'none';
  phoneNumber?: string;
}

export interface UserAccount extends User {
  name: string; // for backward compatibility in UI
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalStorage: number;
  usedStorage: number;
  totalFiles: number;
  securityIncidents: number;
}
