import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subjects: [{ type: String }],
  salary: { type: Number, required: true },
  leaveStatus: { type: String, enum: ['None', 'Pending', 'Approved', 'Denied'], default: 'None' },
  assignedClasses: [{ type: String }]
}, { timestamps: true });

export const Teacher = mongoose.model('Teacher', teacherSchema);
