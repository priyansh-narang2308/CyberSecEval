import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';

const router = express.Router();


// @route   GET /api/admin/users
// @access  Protected (Admin - Manage Users)
router.get('/users', protect, authorize(RESOURCES.USERS, ACTIONS.MANAGE), (req, res) => {
    res.status(200).json({ 
        message: 'Access Granted: Viewing all users', 
        users: [
            { id: 1, name: 'Priyansh (Student)' },
            { id: 2, name: 'Kaushal (Faculty)' }
        ]
    });
});

export default router;
