# CloudLock Backend

This is the backend API server for CloudLock, a secure cloud file storage platform.

## Features

- **Database Schema**: Complete PostgreSQL schema with users, files, folders, shares, and audit logs
- **File Storage**: Secure file upload/download with client-side encryption
- **Authentication**: JWT-based authentication with session management
- **Real-time**: WebSocket support for live notifications and updates
- **Security**: Comprehensive security middleware and validation
- **Audit Logging**: Complete activity tracking and monitoring

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**
   Run the database schema setup:
   ```bash
   npm run db:setup
   ```

4. **Supabase Configuration**
   - Create storage buckets: `files`, `avatars`, `temp`
   - Set up Row Level Security (RLS) policies
   - Enable real-time for required tables

## Running the Server

**Development Mode:**
```bash
npm run server:dev
```

**Production Mode:**
```bash
npm run server
```

The server will start on port 5000 by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify session

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:fileId/download` - Download file
- `GET /api/files` - List files
- `PUT /api/files/:fileId` - Update file
- `DELETE /api/files/:fileId` - Delete file

### Folders
- `POST /api/folders` - Create folder
- `GET /api/folders/:folderId/contents` - Get folder contents
- `GET /api/folders/tree` - Get folder tree
- `PUT /api/folders/:folderId` - Update folder
- `DELETE /api/folders/:folderId` - Delete folder

### Real-time Features
- File upload progress
- Live notifications
- Real-time collaboration
- Security alerts

## Security Features

- **Encryption**: AES-256-GCM encryption for files
- **Rate Limiting**: Request rate limiting and abuse prevention
- **Input Validation**: Comprehensive input sanitization
- **Audit Logging**: Complete activity tracking
- **Session Management**: Secure session handling
- **CORS**: Configured CORS policies

## Architecture

```
server/
├── config/          # Configuration files
├── database/        # Database schema and migrations
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── services/        # Business logic services
└── types/           # TypeScript type definitions
```

## Development

- Uses TypeScript for type safety
- Express.js for API framework
- Supabase for database and real-time features
- Socket.io for WebSocket connections
- Comprehensive error handling and logging
