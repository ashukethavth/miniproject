// Global types and interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  updatedAt: string;
  ownerId: string;
}
