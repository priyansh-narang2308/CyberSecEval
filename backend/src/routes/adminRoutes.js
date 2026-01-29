import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';

import User from '../models/User.js';
import SecurityLog from '../models/SecurityLog.js';
import { rotateKeyPair, getPublicKey } from '../utils/cryptoUtils.js';

const router = express.Router();

/**
 * @route   GET /api/admin/stats
 * @access  Protected (Admin only)
 * @desc    Fetch real system statistics (User counts by role)
 */
router.get('/stats', protect, authorize(RESOURCES.USERS, ACTIONS.MANAGE), async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const facultyCount = await User.countDocuments({ role: 'faculty' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        const totalLogs = await SecurityLog.countDocuments();

        res.status(200).json({
            stats: [
                { role: 'Students', count: studentCount, color: 'bg-primary' },
                { role: 'Faculty', count: facultyCount, color: 'bg-success' },
                { role: 'Administrators', count: adminCount, color: 'bg-warning' }
            ],
            totalUsers: studentCount + facultyCount + adminCount,
            totalLogs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

/**
 * @route   GET /api/admin/logs
 * @access  Protected (Admin only)
 * @desc    Fetch recent system security logs
 */
router.get('/logs', protect, authorize(RESOURCES.USERS, ACTIONS.MANAGE), async (req, res) => {
    try {
        const logs = await SecurityLog.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

/**
 * @route   POST /api/admin/rotate-keys
 * @access  Protected (Admin only)
 * @desc    Rotates the server RSA key pair (High security action)
 */
router.post('/rotate-keys', protect, authorize(RESOURCES.USERS, ACTIONS.MANAGE), async (req, res) => {
    try {
        const newPublicKey = rotateKeyPair();
        
        await SecurityLog.create({
            action: 'RSA Key Rotation',
            user: req.user.email,
            status: 'success',
            details: 'Server RSA-2048 key pair force-rotated by Admin.'
        });

        res.status(200).json({ 
            message: 'RSA Key Pair Rotated Successfully',
            publicKey: newPublicKey
        });
    } catch (error) {
        res.status(500).json({ message: 'Error rotating keys' });
    }
});

// @route   GET /api/admin/users
// @access  Protected (Admin - Manage Users)
router.get('/users', protect, authorize(RESOURCES.USERS, ACTIONS.MANAGE), async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash -mfaOTP');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.get('/my-logs', protect, async (req, res) => {
    try {
        const logs = await SecurityLog.find({ user: req.user.email })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching personal logs' });
    }
});

export default router;
