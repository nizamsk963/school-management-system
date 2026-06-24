import express from 'express';
import { User } from '../models/User.js';
import { Staff } from '../models/Staff.js';
import { authenticate, authorize } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create staff member with password
router.post('/create', authenticate, authorize('Admin', 'Principal', 'Accountant'), async (req, res) => {
  try {
    const { name, email, loginId, password, department, position, phone, salary, address, qualifications } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'Name, email, password, and department are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user account for staff
    const newUser = new User({
      email,
      loginId: loginId || `STF-${Date.now()}`,
      passwordHash,
      role: 'Staff'
    });

    await newUser.save();

    // Create staff profile
    const newStaff = new Staff({
      userId: newUser._id,
      name,
      email,
      loginId: newUser.loginId,
      department,
      position: position || 'Staff Member',
      phone,
      salary,
      address,
      qualifications,
      status: 'Active'
    });

    await newStaff.save();

    res.status(201).json({
      message: 'Staff member created successfully.',
      staff: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        loginId: newStaff.loginId,
        department: newStaff.department,
        status: newStaff.status
      }
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Failed to create staff member.' });
  }
});

// Get all staff members
router.get('/', authenticate, authorize('Admin', 'Principal', 'Accountant'), async (req, res) => {
  try {
    const staffMembers = await Staff.find()
      .select('-__v')
      .populate('userId', 'email loginId role')
      .lean();
    
    res.json(staffMembers);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to fetch staff members.' });
  }
});

// Get staff member by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select('-__v')
      .populate('userId', 'email loginId role')
      .lean();
    
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }
    
    res.json(staff);
  } catch (error) {
    console.error('Get staff by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch staff member.' });
  }
});

// Update staff member
router.put('/:id', authenticate, authorize('Admin', 'Principal', 'Accountant'), async (req, res) => {
  try {
    const { name, department, position, phone, salary, status, address, qualifications } = req.body;
    
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        name,
        department,
        position,
        phone,
        salary,
        status,
        address,
        qualifications
      },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    res.json({
      message: 'Staff member updated successfully.',
      staff: updatedStaff
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update staff member.' });
  }
});

// Reset staff password
router.post('/:id/reset-password', authenticate, authorize('Admin', 'Principal', 'Accountant'), async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required.' });
    }

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    const user = await User.findById(staff.userId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ message: 'Password reset successfully for staff member.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Delete staff member
router.delete('/:id', authenticate, authorize('Admin', 'Principal'), async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    // Also delete associated user account
    if (staff.userId) {
      await User.findByIdAndDelete(staff.userId);
    }

    res.json({ message: 'Staff member deleted successfully.' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Failed to delete staff member.' });
  }
});

export { router as staffRouter };
