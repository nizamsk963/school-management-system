import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const defaultPassword = 'password123';
const seededAccounts = [
  { email: 'superadmin@school.local', role: 'Super Admin' },
  { email: 'principal@school.local', role: 'Principal' },
  { email: 'vice-principal@school.local', role: 'Vice Principal' },
  { email: 'admin@school.local', role: 'Admin' },
  { email: 'accountant@school.local', role: 'Accountant' },
  { email: 'staff@school.local', role: 'Staff' },
  { email: 'student@school.local', role: 'Student' }
];

if (!mongoUri) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const results = [];

    for (const account of seededAccounts) {
      const loginId = account.email;
      const existing = await User.findOne({ $or: [{ email: account.email }, { loginId }] });
      if (existing) {
        results.push({ email: account.email, created: false, reason: 'Already exists' });
        continue;
      }

      const user = await User.create({
        email: account.email,
        loginId,
        passwordHash,
        role: account.role
      });
      results.push({ email: account.email, created: true, role: account.role });
    }

    console.log('Default dashboard accounts seeded:');
    console.table(results.map(({ email, created, role, reason }) => ({ email, role: role || '-', created, reason: reason || '' })));
    console.log(`Default password for all seeded accounts: ${defaultPassword}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding default dashboard accounts:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

main();
