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

/**
 * @route   POST /api/hybrid/submit
 * @access  Protected (Student)
 * @desc    Simulates a secure client-side submission.
 *          Since we cannot use frontend crypto, this endpoint:
 *          1. Accepts plaintext data (simulating user input).
 *          2. Generates a fresh AES session key.
 *          3. Encrypts the data with AES.
 *          4. Encrypts the AES key with the Server's RSA Public Key.
 *          5. Stores ONLY the encrypted blobs in MongoDB.
 *          THIS ENSURES DATA AT REST IS ENCRYPTED.
 */
router.post('/submit', protect, authorize(RESOURCES.SUBMISSIONS, ACTIONS.WRITE), async (req, res) => {
    try {
        const { examId, answers } = req.body;

        if (!examId || !answers) {
            return res.status(400).json({ message: 'Missing examId or answers' });
        }

        // 1. Generate ephemeral AES Session Key
        const sessionKey = generateAESKey();

        // 2. Encrypt the sensitive data (answers)
        // Convert answers object to string for encryption
        const plainTextData = JSON.stringify(answers);
        const { encryptedData, iv } = encryptData(plainTextData, sessionKey);

        // 3. Encrypt the Session Key using RSA
        // This simulates the client protecting the key before transport/storage
        const encryptedSessionKey = encryptSessionKey(sessionKey);

        // 4. Store in Database
        // Note: We do NOT store the plainTextData or the raw sessionKey
        const submission = await EncryptedSubmission.create({
            student: req.user._id,
            examId,
            encryptedData,
            iv,
            encryptedSessionKey: encryptedSessionKey.toString('hex')
        });

        res.status(201).json({
            message: 'Submission encrypted and stored successfully.',
            submissionId: submission._id,
            encryptionDetails: {
                algorithm: 'Hybrid (RSA-2048 + AES-256-CBC)',
                iv: iv,
                note: 'Data is encrypted at rest. Only faculty can decrypt.'
            }
        });

    } catch (error) {
        console.error('Encryption error:', error);
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

        res.status(200).json({
            message: 'Decryption successful',
            submissionInfo: {
                student: submission.student,
                examId: submission.examId,
                submittedAt: submission.createdAt
            },
            decryptedAnswers: answers,
            securityAudit: {
                decryptedBy: req.user.username,
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ message: 'Decryption failed (Key mismatch or integrity error)' });
    }
});

export default router;
