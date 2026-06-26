import { supabaseAdmin, STORAGE_BUCKETS } from '../config/supabase';
import { EncryptionService, EncryptionResult } from './encryption';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import crypto from 'crypto';

export interface FileUploadOptions {
  userId: string;
  folderId?: string;
  masterKey: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResult {
  fileId: string;
  storagePath: string;
  encryptionResult: EncryptionResult;
  hash: string;
  size: number;
}

export interface FileDownloadOptions {
  userId: string;
  masterKey: string;
  verifyIntegrity?: boolean;
}

export class FileStorageService {
  /**
   * Upload file with encryption
   */
  static async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    options: FileUploadOptions
  ): Promise<FileUploadResult> {
    try {
      const { userId, folderId, masterKey } = options;

      // Generate file hash for integrity verification
      const fileHash = EncryptionService.generateHash(fileBuffer);

      // Encrypt file data
      const encryptionResult = await EncryptionService.encryptFile(
        fileBuffer,
        userId,
        masterKey
      );

      // Generate unique storage path
      const fileExtension = path.extname(originalName);
      const fileName = path.basename(originalName, fileExtension);
      const timestamp = Date.now();
      const randomId = crypto.randomBytes(8).toString('hex');
      const storagePath = `users/${userId}/${timestamp}_${randomId}_${fileName}${fileExtension}`;

      // Upload encrypted file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKETS.FILES)
        .upload(storagePath, encryptionResult.encryptedData, {
          contentType: 'application/octet-stream',
          duplex: 'half'
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Get file metadata
      const { data: fileData, error: fileError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKETS.FILES)
        .list(`users/${userId}`, {
          search: path.basename(storagePath)
        });

      if (fileError) {
        throw new Error(`Failed to get file metadata: ${fileError.message}`);
      }

      const fileSize = fileData?.[0]?.metadata?.size || fileBuffer.length;

      // Create file record in database
      const { data: fileRecord, error: dbError } = await supabaseAdmin
        .from('files')
        .insert({
          name: path.basename(originalName),
          original_name: originalName,
          extension: fileExtension.slice(1), // Remove the dot
          mime_type: this.getMimeType(fileExtension),
          size: fileSize,
          folder_id: folderId || null,
          owner_id: userId,
          storage_path: storagePath,
          storage_bucket: STORAGE_BUCKETS.FILES,
          encryption_key_id: encryptionResult.keyId,
          encryption_iv: encryptionResult.iv.toString('hex'),
          encryption_salt: encryptionResult.salt.toString('hex'),
          file_hash: fileHash,
          version: 1
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabaseAdmin.storage
          .from(STORAGE_BUCKETS.FILES)
          .remove([storagePath]);
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      // Update folder statistics if folder is specified
      if (folderId) {
        await this.updateFolderStats(folderId);
      }

      return {
        fileId: fileRecord.id,
        storagePath,
        encryptionResult,
        hash: fileHash,
        size: fileSize
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download and decrypt file
   */
  static async downloadFile(
    fileId: string,
    options: FileDownloadOptions
  ): Promise<{ data: Buffer; metadata: any }> {
    try {
      const { userId, masterKey, verifyIntegrity = true } = options;

      // Get file record
      const { data: fileRecord, error: fileError } = await supabaseAdmin
        .from('files')
        .select(`
          *,
          encryption_keys!inner(*)
        `)
        .eq('id', fileId)
        .eq('owner_id', userId)
        .single();

      if (fileError || !fileRecord) {
        throw new Error('File not found or access denied');
      }

      // Download encrypted file from storage
      const { data: encryptedData, error: downloadError } = await supabaseAdmin.storage
        .from(fileRecord.storage_bucket)
        .download(fileRecord.storage_path);

      if (downloadError || !encryptedData) {
        throw new Error(`Storage download failed: ${downloadError?.message}`);
      }

      // Convert blob to buffer
      const encryptedBuffer = Buffer.from(await encryptedData.arrayBuffer());

      // Decrypt file
      const decryptionResult = await EncryptionService.decryptFile(
        encryptedBuffer,
        fileRecord.encryption_key_id,
        Buffer.from(fileRecord.encryption_iv, 'hex'),
        Buffer.from(fileRecord.encryption_salt, 'hex'),
        masterKey
      );

      // Verify integrity if requested
      if (verifyIntegrity && !decryptionResult.verified) {
        throw new Error('File integrity verification failed');
      }

      // Log file access
      await supabaseAdmin.from('file_access_logs').insert({
        file_id: fileId,
        user_id: userId,
        access_type: 'download'
      });

      return {
        data: decryptionResult.decryptedData,
        metadata: {
          name: fileRecord.original_name,
          size: fileRecord.size,
          mimeType: fileRecord.mime_type,
          hash: fileRecord.file_hash,
          verified: decryptionResult.verified
        }
      };
    } catch (error) {
      throw new Error(`File download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      // Get file record
      const { data: fileRecord, error: fileError } = await supabaseAdmin
        .from('files')
        .select('storage_path, storage_bucket, folder_id')
        .eq('id', fileId)
        .eq('owner_id', userId)
        .single();

      if (fileError || !fileRecord) {
        throw new Error('File not found or access denied');
      }

      // Delete from storage
      const { error: storageError } = await supabaseAdmin.storage
        .from(fileRecord.storage_bucket)
        .remove([fileRecord.storage_path]);

      if (storageError) {
        console.error('Storage deletion failed:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Mark as deleted in database (soft delete)
      const { error: dbError } = await supabaseAdmin
        .from('files')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', fileId);

      if (dbError) {
        throw new Error(`Database update failed: ${dbError.message}`);
      }

      // Update folder statistics
      if (fileRecord.folder_id) {
        await this.updateFolderStats(fileRecord.folder_id);
      }

      // Log deletion
      await supabaseAdmin.from('audit_logs').insert({
        user_id: userId,
        action: 'file.delete',
        resource_type: 'file',
        resource_id: fileId
      });
    } catch (error) {
      throw new Error(`File deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(fileId: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('files')
      .select(`
        id,
        name,
        original_name,
        extension,
        mime_type,
        size,
        folder_id,
        owner_id,
        file_hash,
        version,
        is_shared,
        share_count,
        created_at,
        updated_at,
        folders:folder_id (
          id,
          name,
          path
        )
      `)
      .eq('id', fileId)
      .eq('owner_id', userId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }

    return data;
  }

  /**
   * List files in folder
   */
  static async listFiles(folderId: string | null, userId: string, limit = 50, offset = 0) {
    let query = supabaseAdmin
      .from('files')
      .select(`
        id,
        name,
        original_name,
        extension,
        mime_type,
        size,
        file_hash,
        version,
        is_shared,
        share_count,
        created_at,
        updated_at
      `)
      .eq('owner_id', userId)
      .eq('is_deleted', false)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (folderId) {
      query = query.eq('folder_id', folderId);
    } else {
      query = query.is('folder_id', null);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data;
  }

  /**
   * Update folder statistics
   */
  private static async updateFolderStats(folderId: string): Promise<void> {
    // Get file count and total size for the folder
    const { data: files, error } = await supabaseAdmin
      .from('files')
      .select('size')
      .eq('folder_id', folderId)
      .eq('is_deleted', false);

    if (error) {
      console.error('Failed to update folder stats:', error);
      return;
    }

    const fileCount = files?.length || 0;
    const totalSize = files?.reduce((sum, file) => sum + file.size, 0) || 0;

    // Get subfolder count
    const { data: subfolders, error: folderError } = await supabaseAdmin
      .from('folders')
      .select('id')
      .eq('parent_id', folderId);

    const folderCount = subfolders?.length || 0;

    // Update folder
    await supabaseAdmin
      .from('folders')
      .update({
        total_size: totalSize,
        file_count: fileCount,
        folder_count: folderCount
      })
      .eq('id', folderId);
  }

  /**
   * Get MIME type from file extension
   */
  private static getMimeType(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript'
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}
