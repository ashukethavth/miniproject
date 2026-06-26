import { Server, Socket } from 'socket.io';
import { supabaseAdmin, REALTIME_CHANNELS } from '../config/supabase';

class RealtimeService {
  private io: Server | null = null;
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  initialize(io: Server) {
    this.io = io;

    io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      // Authenticate socket connection
      socket.on('authenticate', (data: { userId: string; token: string }) => {
        this.authenticateSocket(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // File upload progress
      socket.on('file-upload-progress', (data) => {
        this.handleFileUploadProgress(socket, data);
      });

      // Join file room for real-time updates
      socket.on('join-file-room', (fileId: string) => {
        socket.join(`file-${fileId}`);
      });

      // Leave file room
      socket.on('leave-file-room', (fileId: string) => {
        socket.leave(`file-${fileId}`);
      });

      // Join folder room
      socket.on('join-folder-room', (folderId: string) => {
        socket.join(`folder-${folderId}`);
      });

      // Leave folder room
      socket.on('leave-folder-room', (folderId: string) => {
        socket.leave(`folder-${folderId}`);
      });
    });

    // Set up Supabase realtime subscriptions
    this.setupSupabaseRealtime();
  }

  private async authenticateSocket(socket: Socket, data: { userId: string; token: string }) {
    try {
      // Verify session token
      const { data: session, error } = await supabaseAdmin
        .from('sessions')
        .select('user_id')
        .eq('session_token', data.token)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session || session.user_id !== data.userId) {
        socket.emit('authentication-error', { message: 'Invalid authentication' });
        return;
      }

      // Store authenticated user
      this.connectedUsers.set(data.userId, socket.id);
      socket.data.userId = data.userId;

      // Join user-specific room
      socket.join(`user-${data.userId}`);

      socket.emit('authenticated', { userId: data.userId });

      console.log(`User ${data.userId} authenticated on socket ${socket.id}`);
    } catch (error) {
      console.error('Socket authentication error:', error);
      socket.emit('authentication-error', { message: 'Authentication failed' });
    }
  }

  private handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  private handleFileUploadProgress(socket: Socket, data: { fileId: string; progress: number }) {
    const userId = socket.data.userId;
    if (!userId) return;

    // Broadcast progress to user's room
    socket.to(`user-${userId}`).emit('file-upload-progress', {
      fileId: data.fileId,
      progress: data.progress,
      userId
    });
  }

  private setupSupabaseRealtime() {
    if (!supabaseAdmin) {
      console.log('⚠️  Supabase not available - realtime features disabled');
      return;
    }

    // Subscribe to audit logs for real-time notifications
    const auditSubscription = supabaseAdmin
      .channel(REALTIME_CHANNELS.AUDIT_LOGS)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'audit_logs'
      }, (payload) => {
        this.handleAuditLogEvent(payload);
      })
      .subscribe();

    // Subscribe to file changes
    const fileSubscription = supabaseAdmin
      .channel(REALTIME_CHANNELS.FILE_UPDATES)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'files'
      }, (payload) => {
        this.handleFileEvent(payload);
      })
      .subscribe();

    // Subscribe to share changes
    const shareSubscription = supabaseAdmin
      .channel(REALTIME_CHANNELS.SHARE_UPDATES)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shares'
      }, (payload) => {
        this.handleShareEvent(payload);
      })
      .subscribe();

    console.log('Supabase realtime subscriptions established');
  }

  private handleAuditLogEvent(payload: any) {
    const log = payload.new;

    // Send security alerts to admins
    if (log.severity === 'error' || log.severity === 'critical') {
      this.io?.to('admin-room').emit('security-alert', {
        type: 'audit-log',
        data: log
      });
    }

    // Send user-specific notifications
    if (log.user_id) {
      this.io?.to(`user-${log.user_id}`).emit('notification', {
        type: 'audit-log',
        data: log
      });
    }
  }

  private handleFileEvent(payload: any) {
    const file = payload.new || payload.old;
    const event = payload.eventType;

    if (!file) return;

    // Notify file owner
    if (file.owner_id) {
      this.io?.to(`user-${file.owner_id}`).emit('file-update', {
        event,
        file
      });
    }

    // Notify folder watchers
    if (file.folder_id) {
      this.io?.to(`folder-${file.folder_id}`).emit('folder-content-update', {
        event,
        type: 'file',
        data: file
      });
    }
  }

  private handleShareEvent(payload: any) {
    const share = payload.new || payload.old;
    const event = payload.eventType;

    if (!share) return;

    // Notify share creator
    if (share.shared_by) {
      this.io?.to(`user-${share.shared_by}`).emit('share-update', {
        event,
        share
      });
    }

    // Notify share recipient
    if (share.shared_with) {
      this.io?.to(`user-${share.shared_with}`).emit('share-received', {
        event,
        share
      });
    }
  }

  // Public methods for emitting events from other parts of the app
  emitToUser(userId: string, event: string, data: any) {
    this.io?.to(`user-${userId}`).emit(event, data);
  }

  emitToRoom(room: string, event: string, data: any) {
    this.io?.to(room).emit(event, data);
  }

  emitToAdmins(event: string, data: any) {
    this.io?.to('admin-room').emit(event, data);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is connected
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

export const realtimeService = new RealtimeService();
