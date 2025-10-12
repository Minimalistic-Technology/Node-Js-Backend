// import mongoose from 'mongoose';

// const authUserSchema = new mongoose.Schema({
//   eid :{type : Number , unique :true , required: true }, 
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['User', 'Admin'], required: true },
//   address : { type:String , required: true},
//   contact : {type:String , required:true},
//   doj:{type : Date , required: true , default: () => {   // format =>  "YYYY-MM-DD" 
//     const today = new Date();
//     return today.toISOString().split('T')[0];  
//   }}
// }, { timestamps: true });

// export const AuthUserModel = mongoose.model('AuthUser', authUserSchema); 

import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },  // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['User', 'Admin', 'default'], default: 'default' },
  contact: { type: String },
  address: { type: String },
  dateOfJoin: { type: Date, default: () => new Date() },
  photoURL: { type: String },            // For social login
  provider: { type: String },            // 'google', 'facebook', etc.
}, { timestamps: true });

export const AuthUserModel = mongoose.model('AuthUser', authUserSchema);