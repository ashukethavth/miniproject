export type FileType = 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'archive' | 'code' | 'other';

export interface FileMetadata {
  id: string;
  name: string;
  type: FileType;
  size: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  encryptionStatus: 'encrypted' | 'processing' | 'decrypted';
  encryptionLevel: 'AES-256' | 'ChaCha20' | 'RSA-4096';
  mimeType: string;
  hash: string;
  tags: string[];
  isFavorite: boolean;
  parentId: string | null;
}

export interface FolderMetadata {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  owner: string;
  fileCount: number;
  totalSize: number;
  isFavorite: boolean;
}

export interface FileActivity {
  id: string;
  fileId: string;
  userId: string;
  userName: string;
  action: 'upload' | 'download' | 'rename' | 'move' | 'delete' | 'share' | 'view';
  timestamp: string;
  details?: string;
}

export interface FileVersion {
  id: string;
  fileId: string;
  version: number;
  size: number;
  createdAt: string;
  hash: string;
  createdBy: string;
}
