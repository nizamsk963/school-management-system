import express from 'express';
import { School } from '../models/School.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Teacher', 'Student', 'Parent', 'Accountant'), async (req, res) => {
  const schools = await School.find();
  res.json(schools);
});

router.post('/', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.id;
    delete payload._id;
    const school = await School.create(payload);
    res.status(201).json(school);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(school);
});

router.delete('/:id', authenticate, authorize('Super Admin'), async (req, res) => {
  await School.findByIdAndDelete(req.params.id);
  res.json({ message: 'School deleted' });
});

export const schoolRouter = router;
