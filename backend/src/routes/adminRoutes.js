import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';

const router = express.Router();

/**
 * ADMIN ROUTES
 * Resources: users (or generic admin tasks)
 */

// @route   GET /api/admin/users
// @access  Protected (Admin - Manage Users)
router.get('/users', protect, authorize(RESOURCES.USERS, ACTIONS.MANAGE), (req, res) => {
    res.status(200).json({ 
        message: 'Access Granted: Viewing all users', 
        users: [
            { id: 1, name: 'Alice (Student)' },
            { id: 2, name: 'Bob (Faculty)' }
        ]
    });
});

export default router;
