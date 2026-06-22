import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, sparse: true },
  loginId: { type: String, unique: true, sparse: true },
  admissionNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  grade: { type: String, required: true },
  section: { type: String, required: true },
  teacher: {
    id: { type: String },
    name: { type: String },
    email: { type: String }
  },
  parent: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String }
  },
  attendance: {
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    late: { type: Number, default: 0 }
  },
  marks: { type: Map, of: Number },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);
