import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES, RESOURCES, ACTIONS } from '../config/accessControlMatrix.js';
import EncryptedSubmission from '../models/EncryptedSubmission.js';
import { 
    generateAESKey, 
    encryptData, 
    encryptSessionKey, 
    decryptSessionKey, 
    decryptData 
} from '../utils/cryptoUtils.js';

const router = express.Router();

import SecurityLog from '../models/SecurityLog.js';

router.get('/', protect, authorize(RESOURCES.SUBMISSIONS, ACTIONS.READ), async (req, res) => {
    try {
        const submissions = await EncryptedSubmission.find()
            .populate('student', 'name universityId email')
            .sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions' });
    }
});

router.post('/submit', protect, authorize(RESOURCES.SUBMISSIONS, ACTIONS.WRITE), async (req, res) => {
    try {
        const { examId, encryptedData, iv, encryptedSessionKey } = req.body;

        if (!examId || !encryptedData || !iv || !encryptedSessionKey) {
            return res.status(400).json({ message: 'Missing required encrypted fields' });
        }

        const submission = await EncryptedSubmission.create({
            student: req.user._id,
            examId,
            encryptedData,
            iv,
            encryptedSessionKey
        });

        await SecurityLog.create({
            action: 'Hybrid Submission',
            user: req.user.email,
            status: 'success',
            details: `Secure submission for ${examId}. Encrypted with AES-256-CBC.`
        });

        res.status(201).json({
            message: 'Secure submission accepted and stored.',
            submissionId: submission._id,
            audit: {
                status: 'ENCRYPTED_AT_SOURCE',
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ message: 'Failed to process secure submission' });
    }
});

/**
 * @route   GET /api/hybrid/decrypt/:id
 * @access  Protected (Faculty/Admin only)
 * @desc    Retrieves key, decrypts AES key with Private Key, then decrypts data.
 */
router.get('/decrypt/:id', protect, authorize(RESOURCES.SUBMISSIONS, ACTIONS.READ), async (req, res) => {
    try {
        const submission = await EncryptedSubmission.findById(req.params.id).populate('student', 'name email');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // 1. Decrypt the Session Key
        // Only the server (holding the Private Key) can do this.
        const sessionKey = decryptSessionKey(submission.encryptedSessionKey);

        // 2. Decrypt the Data
        const decryptedString = decryptData(submission.encryptedData, sessionKey, submission.iv);
        
        // Parse back to JSON
        const answers = JSON.parse(decryptedString);

        await SecurityLog.create({
            action: 'Zero-Knowledge Decryption',
            user: req.user.email,
            status: 'success',
            details: `Decrypted session for student: ${submission.student.name}. Plaintext restored.`
        });

        res.status(200).json({
            message: 'Decryption successful',
            submissionInfo: {
                student: submission.student,
                examId: submission.examId,
                submittedAt: submission.createdAt
            },
            decryptedAnswers: answers,
            securityAudit: {
                decryptedBy: req.user.email,
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ message: 'Decryption failed (Key mismatch or integrity error)' });
    }
});

export default router;
