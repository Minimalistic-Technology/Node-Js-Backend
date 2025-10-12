import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  eid: number; 
  from: Date; 
  to: Date;  
  reason: string; 
  email : String;
  status: 'Pending' | 'Approved' | 'Rejected';
  handledBy: number;   
  appliedAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new Schema<ILeave>(
  {
    eid: { type: Number, ref: 'AuthUser', required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    reason: { type: String },
    email:{ type : String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    handledBy: { type: Number, ref: 'AuthUser' },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export const LeaveModel = mongoose.model<ILeave>('Leave', LeaveSchema);
