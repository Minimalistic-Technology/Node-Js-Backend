import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {type: String , required: true},
  role: { type: String, enum: ['user', 'admin', 'hr'], default: 'user' },
  contact: { type: String },
  address: { type: String },
  dateOfJoin: { type: Date, default: () => new Date() },
  photoURL: { type: String },            
}, { timestamps: true });

export const AuthUserModel = mongoose.model('AuthUser', authUserSchema);



// with firebase
// import mongoose from 'mongoose';

// const authUserSchema = new mongoose.Schema({
//   uid: { type: String, unique: true, required: true },  // Firebase UID
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, enum: ['User', 'Admin', 'default'], default: 'default' },
//   contact: { type: String },
//   address: { type: String },
//   dateOfJoin: { type: Date, default: () => new Date() },
//   photoURL: { type: String },            // For social login
//   provider: { type: String },            // 'google', 'facebook', etc.
// }, { timestamps: true });

// export const AuthUserModel = mongoose.model('AuthUser', authUserSchema);