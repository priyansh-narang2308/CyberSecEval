import express from 'express';
import { registerUser, loginUser, verifyMFA } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/mfa-verify', verifyMFA);

export default router;
