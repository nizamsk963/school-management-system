import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  grade: { type: String, required: true },
  section: { type: String, default: 'A' },
  dateOfBirth: { type: String },
  parentName: { type: String, required: true },
  parentContact: { type: String, required: true },
  parentEmail: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  comments: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  reviewedBy: { type: String, default: '' }
}, { timestamps: true });

export const Admission = mongoose.model('Admission', admissionSchema);
