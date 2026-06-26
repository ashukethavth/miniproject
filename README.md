# CloudLock - Secure Cloud File Storage

A comprehensive secure cloud file storage platform with end-to-end encryption, real-time collaboration, and advanced security features.

## Features

- **End-to-End Encryption**: AES-256-GCM encryption for all files
- **Real-time Collaboration**: Live file sharing and notifications
- **Advanced Security**: Zero-trust architecture with comprehensive audit logging
- **File Versioning**: Complete version history and restoration
- **Role-Based Access Control**: Granular permissions and user management
- **Real-time Features**: WebSocket-based live updates and notifications

## Architecture

This project consists of:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Supabase
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage with encryption
- **Real-time**: Supabase Realtime + Socket.io

## Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase account and project
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd cloudlock
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Fill in your Supabase credentials and other environment variables
```

### 3. Database Setup
```bash
# Run database schema setup (requires PostgreSQL connection)
npm run db:setup
```

### 4. Start Development Servers

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
npm run server:dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
cloudlock/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
├── server/                # Backend API server
│   ├── config/            # Configuration files
│   ├── database/          # Database schema and migrations
│   ├── middleware/        # Express middleware
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   └── types/             # TypeScript definitions
├── public/                # Static assets
└── dist/                  # Build output
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify session

### Files
- `POST /api/files/upload` - Upload encrypted file
- `GET /api/files/:id/download` - Download and decrypt file
- `GET /api/files` - List user files
- `PUT /api/files/:id` - Update file metadata
- `DELETE /api/files/:id` - Delete file

### Folders
- `POST /api/folders` - Create folder
- `GET /api/folders/tree` - Get folder hierarchy
- `GET /api/folders/:id/contents` - Get folder contents
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

## Security Features

- **Client-side Encryption**: Files are encrypted before upload
- **Zero-Knowledge Architecture**: Server never sees decryption keys
- **Audit Logging**: Complete activity tracking
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive sanitization
- **Session Management**: Secure JWT-based sessions

## Development

### Available Scripts
```bash
npm run dev          # Start frontend development server
npm run server:dev   # Start backend development server
npm run build        # Build frontend for production
npm run lint         # Run TypeScript type checking
npm run clean        # Clean build artifacts
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Comprehensive error handling

## Deployment

### Frontend
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend
```bash
npm run server
# Deploy to your preferred Node.js hosting platform
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
