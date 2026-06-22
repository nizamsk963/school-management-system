import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI not set in environment.');
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const count = await User.countDocuments();
    const defaultEmail = 'superadmin@school.local';
    const defaultPassword = 'SuperAdmin123!';

    const force = process.argv.includes('--force');

    if (count === 0) {
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      const user = await User.create({ email: defaultEmail, passwordHash, role: 'Super Admin' });
      const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '12h' });
      console.log(JSON.stringify({ created: true, email: defaultEmail, password: defaultPassword, token }, null, 2));
    } else if (force) {
      const ts = Date.now();
      const email = `superadmin+${ts}@school.local`;
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      const user = await User.create({ email, passwordHash, role: 'Super Admin' });
      const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '12h' });
      console.log(JSON.stringify({ created: true, email, password: defaultPassword, token }, null, 2));
    } else {
      console.log(JSON.stringify({ created: false, message: 'Users already exist. Use --force to create a new Super Admin.' }));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating Super Admin:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

main();
