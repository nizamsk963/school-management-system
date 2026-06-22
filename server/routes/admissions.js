import express from 'express';
import { Admission } from '../models/Admission.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authenticate, authorize('Super Admin', 'Principal', 'Vice Principal', 'Admin'), async (req, res) => {
  const admissions = await Admission.find();
  res.json(admissions);
});

router.put('/:id', authenticate, authorize('Super Admin', 'Principal', 'Vice Principal', 'Admin'), async (req, res) => {
  const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(admission);
});

export const admissionRouter = router;
