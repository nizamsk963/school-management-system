import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const validRoles = ['Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Teacher', 'Student', 'Parent', 'Accountant', 'Staff'];

const normalizeRole = (r) => {
  if (!r || typeof r !== 'string') return r;
  const t = r.trim().toLowerCase();
  return validRoles.find(v => v.toLowerCase() === t) || r;
};

const roleCreationPolicy = {
  'Super Admin': {
    allowedCreators: ['Super Admin'],
    description: 'Only an existing Super Admin may create another Super Admin after the initial setup.'
  },
  'Principal': {
    allowedCreators: ['Super Admin'],
    description: 'Only a Super Admin may create a Principal account.'
  },
  'Admin': {
    allowedCreators: ['Super Admin', 'Principal'],
    description: 'Super Admins and Principals may create Admin accounts.'
  },
  'Accountant': {
    allowedCreators: ['Super Admin', 'Principal', 'Admin'],
    description: 'Super Admins, Principals, and Admins may create Accountant accounts.'
  },
  'Vice Principal': {
    allowedCreators: ['Super Admin', 'Principal'],
    description: 'Super Admins and Principals may create Vice Principal accounts.'
  },
  'Staff': {
    allowedCreators: ['Super Admin', 'Principal', 'Admin', 'Accountant'],
    description: 'Super Admins, Principals, Admins, and Accountants may create Staff accounts.'
  },
  'Teacher': {
    allowedCreators: ['Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Accountant'],
    description: 'Super Admins, Principals, Vice Principals, Admins, and Accountants may create Teacher accounts.'
  },
  'Student': {
    allowedCreators: ['Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Accountant'],
    description: 'Super Admins, Principals, Vice Principals, Admins, and Accountants may create Student accounts.'
  },
  'Parent': {
    allowedCreators: ['Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Accountant'],
    description: 'Super Admins, Principals, Vice Principals, Admins, and Accountants may create Parent accounts.'
  }
};

const authenticateRegisterRequest = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { status: 401, message: 'Authorization header required', policy: roleCreationPolicy };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId);
    if (!user) throw { status: 401, message: 'User not found', policy: roleCreationPolicy };
    return user;
  } catch (error) {
    throw { status: 401, message: 'Invalid or expired token', policy: roleCreationPolicy };
  }
};

const canCreateRole = (creatorRole, targetRole) => {
  if (!roleCreationPolicy[targetRole]) return false;
  return roleCreationPolicy[targetRole].allowedCreators.includes(creatorRole);
};

router.post('/register', async (req, res) => {
  const { email, password, role: rawRole, loginId } = req.body;
  const role = normalizeRole(rawRole);
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Requested role is not valid.' });
  }

  try {
    const userCount = await User.countDocuments();
    let currentUser = null;

    if (role === 'Super Admin' && userCount === 0) {
      // Allow the first Super Admin account during initial setup.
    } else {
      // Require an authenticated creator for any registration after initial setup.
      try {
        currentUser = await authenticateRegisterRequest(req);
      } catch (authErr) {
        return res.status(403).json({ error: 'Registration is restricted. Contact a Super Admin to create accounts.', policy: roleCreationPolicy });
      }
      if (role === 'Super Admin') {
        if (currentUser.role !== 'Super Admin') {
          return res.status(403).json({
            error: 'Only Super Admins can create other Super Admins.',
            policy: roleCreationPolicy[role]
          });
        }
      } else if (!canCreateRole(currentUser.role, role)) {
        return res.status(403).json({
          error: `Unauthorized to create ${role}. ${roleCreationPolicy[role].description}`,
          policy: {
            requestedRole: role,
            creatorRole: currentUser.role,
            allowedCreators: roleCreationPolicy[role].allowedCreators,
            description: roleCreationPolicy[role].description
          }
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Ensure role is stored as the normalized/canonical role
    const userData = { email, passwordHash, role };
    if (loginId) userData.loginId = loginId;
    const user = await User.create(userData);
    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '12h' });
    res.status(201).json({ message: 'User registered', userId: user._id, token, policy: roleCreationPolicy[role] });
  } catch (error) {
    if (error.status && error.message) {
      const response = { error: error.message };
      if (error.policy) response.policy = error.policy;
      return res.status(error.status).json(response);
    }

    let errorMessage = 'Registration failed. Please check your inputs.';
    if (error.code === 11000 && error.keyValue?.email) {
      errorMessage = 'This email is already registered.';
    } else if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(errItem => errItem.message).join(' ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required.' });
  }

  const user = await User.findOne({ $or: [{ email: identifier }, { loginId: identifier }] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // Return normalized role in response for client-side routing
  const canonicalRole = normalizeRole(user.role);
  const token = jwt.sign({ userId: user._id, role: canonicalRole, email: user.email }, jwtSecret, { expiresIn: '12h' });
  res.json({ message: 'Login successful', role: canonicalRole, userId: user._id, token });
});

export const authRouter = router;
