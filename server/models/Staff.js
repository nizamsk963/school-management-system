import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  loginId: { type: String, unique: true, sparse: true },
  department: { type: String, required: true },
  position: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  phone: { type: String },
  dateJoined: { type: Date, default: Date.now },
  salary: { type: Number },
  qualifications: { type: String },
  address: { type: String },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
}, { timestamps: true });

export const Staff = mongoose.model('Staff', staffSchema);
