import { Schema, model, models, Document, Types } from 'mongoose';
import { IUser } from './User';

export type AuditAction = 'create' | 'update' | 'delete' | 'status-change' | 'role-change' | 'login';

export interface IAuditLog extends Document {
  actor: Types.ObjectId | IUser;
  action: AuditAction;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'status-change', 'role-change', 'login'],
      required: true,
    },
    entity: { type: String, required: true, trim: true },
    entityId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

const AuditLog = models.AuditLog || model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;






