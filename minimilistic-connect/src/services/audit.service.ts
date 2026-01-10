import AuditLog, { AuditEventType } from '@/models/AuditLog.model';
import { Types } from 'mongoose';

interface AuditLogData {
  userId?: string;
  eventType: AuditEventType;
  ip?: string;
  userAgent?: string;
  meta?: any; // Changed from Record<string, unknown>
}

export const auditService = {
  log: async (data: AuditLogData) => {
    try {
      await AuditLog.create({
        userId: data.userId ? new Types.ObjectId(data.userId) : undefined,
        eventType: data.eventType,
        ip: data.ip,
        userAgent: data.userAgent,
        meta: data.meta || undefined,
      });
    } catch (error) {
      // Log to console/file if DB logging fails
      console.error('Failed to write to audit log:', error);
    }
  },
};
