import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS, ROLES } from '../config/accessControlMatrix.js';
import SignedResult from '../models/SignedResult.js';
import SecurityLog from '../models/SecurityLog.js';
import { signData, verifySignature } from '../utils/cryptoUtils.js';

const router = express.Router();

/**
 * @route   POST /api/signature/sign-result
 * @access  Protected (Faculty only)
 * @desc    Hashes and Signs an exam result to ensure integrity and authenticity.
 */
router.post('/sign-result', protect, authorize(RESOURCES.RESULTS, ACTIONS.SIGN), async (req, res) => {
    try {
        const { studentName, examTitle, score } = req.body;

        if (!studentName || !examTitle || score === undefined) {
            return res.status(400).json({ message: 'Missing required result fields' });
        }

        // 1. Construct the data object to be signed
        const resultData = {
            studentName,
            examTitle,
            score,
            timestamp: new Date().toISOString() // Include timestamp to prevent replay attacks
        };

        // 2. Generate Hash and Digital Signature
        const { signature, hash } = signData(resultData);

        // 3. Store Signed Result
        const signedResult = await SignedResult.create({
            studentName,
            examTitle,
            score,
            resultData,
            hash,
            signature,
            signedBy: req.user._id
        });

        // 4. Log the action
        await SecurityLog.create({
            action: 'Digital Signature',
            user: req.user.email,
            details: `Signed result for ${studentName} (${examTitle})`
        });

        res.status(201).json({
            message: 'Result signed and stored successfully',
            resultId: signedResult._id,
            integrityProof: {
                hash,
                signature
            }
        });

    } catch (error) {
        console.error('Signing error:', error);
        res.status(500).json({ message: 'Failed to sign result' });
    }
});

/**
 * @route   POST /api/signature/verify/:id
 * @access  Protected (Authorized users)
 * @desc    Verifies the integrity and authenticity of a stored result.
 */
router.post('/verify/:id', protect, async (req, res) => {
    try {
        const result = await SignedResult.findById(req.params.id).populate('signedBy', 'name email');

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // 1. Verify Signature
        const isValid = verifySignature(result.resultData, result.signature);

        if (isValid) {
            await SecurityLog.create({
                action: 'Integrity Verification',
                user: req.user.email,
                status: 'success',
                details: `Verified signature for result ${result._id}. Data is untampered.`
            });

            res.status(200).json({
                status: 'VALID',
                message: 'Signature is valid. Data Integrity confirmed.',
                details: {
                    signedBy: result.signedBy.name,
                    score: result.score,
                    status: 'Untampered'
                }
            });
        } else {
            await SecurityLog.create({
                action: 'Integrity Verification',
                user: req.user.email,
                status: 'alert',
                details: `SECURITY ALERT: Verification failed for result ${result._id}. Potential tampering detected!`
            });

            res.status(400).json({
                status: 'INVALID',
                message: 'WARNING: Data integrity compromised! Signature verification failed.',
                details: {
                    alert: 'The result data does not match the signature.'
                }
            });
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Verification process failed' });
    }
});

/**
 * @route   GET /api/signature/results
 * @access  Protected
 * @desc    Retrieves all digitally signed results.
 */
router.get('/results', protect, async (req, res) => {
    try {
        const results = await SignedResult.find()
            .populate('signedBy', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch signed results' });
    }
});

// A malicious route to demonstrate tampering (For Educational/Demo purposes only)
router.post('/tamper/:id', protect, async (req, res) => {
    try {
        const result = await SignedResult.findById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Not found' });

        // Artificially modify the score without updating the signature
        result.score = 99;
        result.resultData.score = 99;
        await result.save();
        
        res.status(200).json({ message: 'Result tampered! Score changed manually in DB.' });
    } catch (error) {
        res.status(500).json({ message: 'Tamper failed' });
    }
});

export default router;
