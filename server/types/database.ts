export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          timestamp: string
          severity: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
          severity?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
          severity?: string
        }
      }
      encryption_keys: {
        Row: {
          id: string
          user_id: string
          key_type: string
          encrypted_key: string
          key_hash: string | null
          algorithm: string
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key_type: string
          encrypted_key: string
          key_hash?: string | null
          algorithm?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key_type?: string
          encrypted_key?: string
          key_hash?: string | null
          algorithm?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
      file_access_logs: {
        Row: {
          id: string
          file_id: string
          user_id: string | null
          access_type: string
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id?: string | null
          access_type: string
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string | null
          access_type?: string
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
        }
      }
      files: {
        Row: {
          id: string
          name: string
          original_name: string
          extension: string | null
          mime_type: string | null
          size: number
          folder_id: string | null
          owner_id: string
          storage_path: string
          storage_bucket: string
          encryption_key_id: string | null
          encryption_iv: string | null
          encryption_salt: string | null
          file_hash: string
          version: number
          parent_version_id: string | null
          is_shared: boolean
          share_count: number
          is_deleted: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          original_name: string
          extension?: string | null
          mime_type?: string | null
          size: number
          folder_id?: string | null
          owner_id: string
          storage_path: string
          storage_bucket?: string
          encryption_key_id?: string | null
          encryption_iv?: string | null
          encryption_salt?: string | null
          file_hash: string
          version?: number
          parent_version_id?: string | null
          is_shared?: boolean
          share_count?: number
          is_deleted?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          original_name?: string
          extension?: string | null
          mime_type?: string | null
          size?: number
          folder_id?: string | null
          owner_id?: string
          storage_path?: string
          storage_bucket?: string
          encryption_key_id?: string | null
          encryption_iv?: string | null
          encryption_salt?: string | null
          file_hash?: string
          version?: number
          parent_version_id?: string | null
          is_shared?: boolean
          share_count?: number
          is_deleted?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      file_versions: {
        Row: {
          id: string
          file_id: string
          version_number: number
          name: string
          size: number
          storage_path: string
          encryption_key_id: string | null
          encryption_iv: string | null
          encryption_salt: string | null
          file_hash: string
          changed_by: string | null
          change_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          version_number: number
          name: string
          size: number
          storage_path: string
          encryption_key_id?: string | null
          encryption_iv?: string | null
          encryption_salt?: string | null
          file_hash: string
          changed_by?: string | null
          change_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          version_number?: number
          name?: string
          size?: number
          storage_path?: string
          encryption_key_id?: string | null
          encryption_iv?: string | null
          encryption_salt?: string | null
          file_hash?: string
          changed_by?: string | null
          change_reason?: string | null
          created_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          owner_id: string
          path: string
          path_array: string[]
          is_shared: boolean
          share_count: number
          total_size: number
          file_count: number
          folder_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          owner_id: string
          path: string
          path_array: string[]
          is_shared?: boolean
          share_count?: number
          total_size?: number
          file_count?: number
          folder_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          owner_id?: string
          path?: string
          path_array?: string[]
          is_shared?: boolean
          share_count?: number
          total_size?: number
          file_count?: number
          folder_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          resource: string
          action: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          resource: string
          action: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          resource?: string
          action?: string
          description?: string | null
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          device_info: Json | null
          ip_address: string | null
          user_agent: string | null
          is_active: boolean
          expires_at: string
          last_activity_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          device_info?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          is_active?: boolean
          expires_at: string
          last_activity_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          device_info?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          is_active?: boolean
          expires_at?: string
          last_activity_at?: string
          created_at?: string
        }
      }
      shares: {
        Row: {
          id: string
          resource_type: string
          resource_id: string
          shared_by: string
          shared_with: string
          permission_level: string
          share_token: string | null
          password_hash: string | null
          expires_at: string | null
          download_count: number
          max_downloads: number | null
          is_revoked: boolean
          revoked_at: string | null
          revoked_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resource_type: string
          resource_id: string
          shared_by: string
          shared_with: string
          permission_level: string
          share_token?: string | null
          password_hash?: string | null
          expires_at?: string | null
          download_count?: number
          max_downloads?: number | null
          is_revoked?: boolean
          revoked_at?: string | null
          revoked_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resource_type?: string
          resource_id?: string
          shared_by?: string
          shared_with?: string
          permission_level?: string
          share_token?: string | null
          password_hash?: string | null
          expires_at?: string | null
          download_count?: number
          max_downloads?: number | null
          is_revoked?: boolean
          revoked_at?: string | null
          revoked_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_role_assignments: {
        Row: {
          id: string
          user_id: string
          role_id: string
          assigned_by: string | null
          assigned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          assigned_by?: string | null
          assigned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          assigned_by?: string | null
          assigned_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          name: string
          description: string | null
          permissions: Json
          is_system_role: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          permissions?: Json
          is_system_role?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          permissions?: Json
          is_system_role?: boolean
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          is_email_verified: boolean
          email_verified_at: string | null
          password_hash: string | null
          two_factor_enabled: boolean
          two_factor_secret: string | null
          recovery_codes: string[] | null
          account_status: string
          last_login_at: string | null
          login_attempts: number
          lockout_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_email_verified?: boolean
          email_verified_at?: string | null
          password_hash?: string | null
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          recovery_codes?: string[] | null
          account_status?: string
          last_login_at?: string | null
          login_attempts?: number
          lockout_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_email_verified?: boolean
          email_verified_at?: string | null
          password_hash?: string | null
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          recovery_codes?: string[] | null
          account_status?: string
          last_login_at?: string | null
          login_attempts?: number
          lockout_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
