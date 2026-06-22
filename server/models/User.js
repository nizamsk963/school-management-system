import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  loginId: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Teacher', 'Student', 'Parent', 'Accountant', 'Staff'], required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, refPath: 'profileModel' },
  profileModel: { type: String, enum: ['School', 'Student', 'Teacher'], default: 'School' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
