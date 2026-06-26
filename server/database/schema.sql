-- CloudLock Database Schema for Supabase
-- Complete schema for secure file sharing platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user', -- admin, user
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_totp_secret VARCHAR(255),
    mfa_sms_enabled BOOLEAN DEFAULT FALSE,
    mfa_backup_codes TEXT[], -- Hashed backup codes
    account_status VARCHAR(50) DEFAULT 'active', -- active, suspended, deactivated
    last_login_at TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    lockout_until TIMESTAMPTZ,
    trusted_devices JSONB DEFAULT '[]', -- Array of trusted device fingerprints
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MFA challenges table
CREATE TABLE public.mfa_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_type VARCHAR(50) NOT NULL, -- sms, totp, backup
    challenge_data JSONB, -- Additional data like phone number
    code_hash VARCHAR(255), -- Hashed verification code
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions table for tracking
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    device_fingerprint JSONB,
    ip_address INET,
    user_agent TEXT,
    location JSONB, -- Geolocation data
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs for security events
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- User roles and permissions for RBAC
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User role assignments
CREATE TABLE user_role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Folders table with hierarchical structure
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    path TEXT NOT NULL, -- Full path for quick access
    path_array UUID[] NOT NULL, -- Array of parent IDs for efficient queries
    is_shared BOOLEAN DEFAULT FALSE,
    share_count INTEGER DEFAULT 0,
    total_size BIGINT DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    folder_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files table with encryption metadata and versioning
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    extension VARCHAR(50),
    mime_type VARCHAR(100),
    size BIGINT NOT NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL, -- Supabase Storage path
    storage_bucket VARCHAR(100) DEFAULT 'files',
    encryption_key_id UUID, -- References encryption_keys
    encryption_iv BYTEA, -- Initialization vector
    encryption_salt BYTEA, -- Salt for key derivation
    file_hash VARCHAR(64) NOT NULL, -- SHA-256 hash
    version INTEGER DEFAULT 1,
    parent_version_id UUID REFERENCES files(id), -- For versioning
    is_shared BOOLEAN DEFAULT FALSE,
    share_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- File versions table for version history
CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    encryption_key_id UUID,
    encryption_iv BYTEA,
    encryption_salt BYTEA,
    file_hash VARCHAR(64) NOT NULL,
    changed_by UUID REFERENCES users(id),
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encryption keys table for key management
CREATE TABLE encryption_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_type VARCHAR(50) NOT NULL, -- 'file', 'folder', 'master'
    encrypted_key TEXT NOT NULL, -- Encrypted with user's master key
    key_hash VARCHAR(64), -- Hash for integrity verification
    algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shares table with permission and expiration tracking
CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL, -- 'file', 'folder'
    resource_id UUID NOT NULL, -- References files or folders
    shared_by UUID REFERENCES users(id) ON DELETE CASCADE,
    shared_with UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_level VARCHAR(50) NOT NULL, -- 'read', 'write', 'admin'
    share_token VARCHAR(255) UNIQUE, -- Public share token
    password_hash VARCHAR(255), -- Optional password protection
    expires_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table for active session tracking
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table for comprehensive activity tracking
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- 'file', 'folder', 'share', 'user'
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES sessions(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    severity VARCHAR(20) DEFAULT 'info' -- 'debug', 'info', 'warning', 'error', 'critical'
);

-- File access logs for detailed tracking
CREATE TABLE file_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    access_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'upload', 'delete', 'share'
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES sessions(id),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_folders_owner_id ON folders(owner_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_folders_path ON folders(path);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_owner_id ON files(owner_id);
CREATE INDEX idx_files_storage_path ON files(storage_path);
CREATE INDEX idx_shares_resource_id ON shares(resource_id);
CREATE INDEX idx_shares_shared_with ON shares(shared_with);
CREATE INDEX idx_shares_share_token ON shares(share_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_session_token ON sessions(session_token);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shares_updated_at BEFORE UPDATE ON shares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO user_roles (name, description, permissions, is_system_role) VALUES
('admin', 'Administrator with full access', '{"*": "*"}', true),
('user', 'Regular user', '{"files": ["read", "write"], "folders": ["read", "write"]}', true);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for MFA challenges
CREATE POLICY "Users can view their own MFA challenges" ON public.mfa_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA challenges" ON public.mfa_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA challenges" ON public.mfa_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for audit logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile email
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update profile email
CREATE TRIGGER on_auth_user_email_updated
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();
INSERT INTO user_roles (name, description, permissions, is_system_role) VALUES
('admin', 'Full system administrator', '{"*": "*"}', true),
('user', 'Standard user', '{"files": ["read", "write", "delete"], "folders": ["read", "write", "delete"], "shares": ["read", "write"]}', true),
('viewer', 'Read-only user', '{"files": ["read"], "folders": ["read"], "shares": ["read"]}', true);

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
('files.read', 'files', 'read', 'Read files'),
('files.write', 'files', 'write', 'Create and modify files'),
('files.delete', 'files', 'delete', 'Delete files'),
('folders.read', 'folders', 'read', 'Read folders'),
('folders.write', 'folders', 'write', 'Create and modify folders'),
('folders.delete', 'folders', 'delete', 'Delete folders'),
('shares.read', 'shares', 'read', 'View shares'),
('shares.write', 'shares', 'write', 'Create and manage shares'),
('shares.delete', 'shares', 'delete', 'Delete shares'),
('users.read', 'users', 'read', 'View user information'),
('users.write', 'users', 'write', 'Modify user information'),
('users.delete', 'users', 'delete', 'Delete users'),
('audit.read', 'audit', 'read', 'View audit logs'),
('admin.full', 'admin', 'full', 'Full administrative access');
