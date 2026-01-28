import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';

const router = express.Router();

// @route   GET /api/exams
// @access  Protected (Student, Faculty, Admin - Read)
router.get('/', protect, authorize(RESOURCES.EXAMS, ACTIONS.READ), (req, res) => {
    res.status(200).json({ message: 'Access Granted: Reading all exams', userId: req.user._id });
});

// @route   POST /api/exams
// @access  Protected (Faculty, Admin - Write)
router.post('/', protect, authorize(RESOURCES.EXAMS, ACTIONS.WRITE), (req, res) => {
    res.status(201).json({ message: 'Access Granted: Creating new exam', userId: req.user._id });
});

export default router;
