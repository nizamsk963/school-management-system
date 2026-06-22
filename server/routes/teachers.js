import express from 'express';
import { Teacher } from '../models/Teacher.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Teacher', 'Student', 'Parent', 'Accountant'), async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

router.post('/', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.status(201).json(teacher);
});

router.put('/:id', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(teacher);
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ message: 'Teacher deleted' });
});

export const teacherRouter = router;
