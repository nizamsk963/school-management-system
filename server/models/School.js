import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  board: { type: String, required: true },
  licenseKey: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  tier: { type: String, enum: ['Basic', 'Premium', 'Enterprise'], default: 'Basic' }
}, { timestamps: true });

export const School = mongoose.model('School', schoolSchema);
