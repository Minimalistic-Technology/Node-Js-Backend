// import mongoose, { Schema, Document } from 'mongoose';

// export interface ICheckInCheckOut {
//   dateTime: Date;
//   city?: string;
//   state?: string;
//   country?: string;
//   ip?: string;
//   lat?: number;
//   long?: number;
// }

// export interface IHistoryEntry {
//   checkIn: ICheckInCheckOut;
//   checkOut: ICheckInCheckOut | null;
// }

// export interface IHistory extends Document {
//   userId: mongoose.Types.ObjectId;
//   history: IHistoryEntry[];
// }

// const CheckInCheckOutSchema = new Schema<ICheckInCheckOut>(
//   {
//     dateTime: { type: Date, required: true },
//     city: { type: String, required: false },
//     state: { type: String, required: false },
//     country: { type: String, required: false },
//     ip: { type: String, required: false },
//     lat: { type: Number, required: false },
//     long: { type: Number, required: false },
//   },
//   { _id: false }
// );

// const historyEntrySchema = new Schema<IHistoryEntry>(
//   {
//     checkIn: { type: CheckInCheckOutSchema, required: true },
//     checkOut: { type: CheckInCheckOutSchema, default: null },
//   },
//   { timestamps: true }
// );

// const historySchema = new Schema<IHistory>({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'AuthUser',
//     required: true,
//   },
//   history: [historyEntrySchema],
// });

// export const HistoryModel = mongoose.model<IHistory>('HRMUserHistory', historySchema);


import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckInCheckOut {
  dateTime: Date;
  city?: string;
  state?: string;
  country?: string;
  ip?: string;
  lat?: number;
  long?: number;
}

export interface ISession {
  checkIn: ICheckInCheckOut;
  checkOut?: ICheckInCheckOut;
}

export interface IAttendance extends Document {
  eid: number; // References eid from AuthUserModel
  date: string; // "YYYY-MM-DD"
  sessions: ISession[];
  totalHours: number;
  createdAt: Date;
  updatedAt: Date;
}



const CheckInCheckOutSchema = new Schema<ICheckInCheckOut>(
  {
    dateTime: { type: Date, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    ip: { type: String },
    lat: { type: Number },
    long: { type: Number },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>({
  checkIn: { type: CheckInCheckOutSchema, required: true },
  checkOut: { type: CheckInCheckOutSchema },
});

const AttendanceSchema = new Schema<IAttendance>(
  {
    eid: {
      type: Number,
      ref: 'AuthUser',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    sessions: { type: [SessionSchema], default: [] },
    totalHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });



export const AttendanceModel =  mongoose.model<IAttendance>('Attendance', AttendanceSchema);
