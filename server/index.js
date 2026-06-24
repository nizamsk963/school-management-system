import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { schoolRouter } from './routes/schools.js';
import { studentRouter } from './routes/students.js';
import { teacherRouter } from './routes/teachers.js';
import { admissionRouter } from './routes/admissions.js';
import { authRouter } from './routes/auth.js';
import { paymentsRouter } from './routes/payments.js';
import { staffRouter } from './routes/staff.js';
import { User } from './models/User.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/schools', schoolRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/admissions', admissionRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/staff', staffRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const defaultDashboardAccounts = [
  { email: 'superadmin@school.local', role: 'Super Admin' },
  { email: 'principal@school.local', role: 'Principal' },
  { email: 'vice-principal@school.local', role: 'Vice Principal' },
  { email: 'admin@school.local', role: 'Admin' },
  { email: 'accountant@school.local', role: 'Accountant' },
  { email: 'staff@school.local', role: 'Staff' },
  { email: 'student@school.local', role: 'Student' }
];

const defaultDashboardPassword = 'password123';

async function ensureDefaultAccounts() {
  const hash = await bcrypt.hash(defaultDashboardPassword, 10);
  for (const account of defaultDashboardAccounts) {
    const existing = await User.findOne({ $or: [{ email: account.email }, { loginId: account.email }] });
    if (!existing) {
      await User.create({
        email: account.email,
        loginId: account.email,
        passwordHash: hash,
        role: account.role
      });
      console.log(`Created default account: ${account.email} (${account.role})`);
    }
  }
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await ensureDefaultAccounts();
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
