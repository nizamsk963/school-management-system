import express from 'express';
import { Student } from '../models/Student.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('Super Admin', 'Principal', 'Vice Principal', 'Admin', 'Teacher', 'Student', 'Parent', 'Accountant'), async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post('/', authenticate, authorize('Super Admin', 'Principal', 'Vice Principal', 'Admin'), async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
});

router.put('/:id', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Principal', 'Admin'), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student deleted' });
});

export const studentRouter = router;
