import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';

const router = express.Router();

/**
 * SUBMISSION ROUTES
 * Resources: submissions
 */

// @route   POST /api/submissions/evaluate
// @access  Protected (Faculty - Evaluate)
// Note: Students can write submissions (via a different endpoint typically), 
// but only Faculty can evaluate them.
router.post('/evaluate', protect, authorize(RESOURCES.SUBMISSIONS, ACTIONS.EVALUATE), (req, res) => {
    res.status(200).json({ message: 'Access Granted: Evaluating submission', userId: req.user._id });
});

export default router;
