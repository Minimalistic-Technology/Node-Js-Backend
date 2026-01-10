import { Schema, model, Types } from 'mongoose';

export enum AuditEventType {
  SIGNUP = 'SIGNUP',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAIL = 'LOGIN_FAIL',
  REFRESH = 'REFRESH',
  LOGOUT = 'LOGOUT',
  VERIFICATION_REQUEST = 'VERIFICATION_REQUEST',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
  OAUTH_SUCCESS = 'OAUTH_SUCCESS',
  OAUTH_FAIL = 'OAUTH_FAIL',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  ACCOUNT_LOCKOUT = 'ACCOUNT_LOCKOUT',
  TOKEN_REUSE_DETECTED = 'TOKEN_REUSE_DETECTED',
}

const auditLogSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  eventType: {
    type: String,
    enum: Object.values(AuditEventType),
    required: true,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  meta: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AuditLog = model('AuditLog', auditLogSchema);

export default AuditLog;

