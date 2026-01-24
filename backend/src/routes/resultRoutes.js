import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';

const router = express.Router();

/**
 * RESULT ROUTES
 * Resources: results
 */

// @route   POST /api/results/sign
// @access  Protected (Faculty - Sign)
// Faculty must sign results before they are published.
router.post('/sign', protect, authorize(RESOURCES.RESULTS, ACTIONS.SIGN), (req, res) => {
    res.status(200).json({ message: 'Access Granted: Signing result', userId: req.user._id });
});

export default router;
