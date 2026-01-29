import User from '../models/User.js';
import SecurityLog from '../models/SecurityLog.js';
import { hashContent, compareContent, generateOTP, generateToken } from '../utils/authUtils.js';
import { sendOTP } from '../utils/mailUtils.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { username, email, role, password, name, universityId, mfaEnabled } = req.body;

        if (!username || !email || !password || !name || !universityId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email already registered' });

        const usernameExists = await User.findOne({ username });
        if (usernameExists) return res.status(400).json({ message: 'Username already taken' });

        const idExists = await User.findOne({ universityId });
        if (idExists) return res.status(400).json({ message: 'University ID already registered' });

        const passwordHash = await hashContent(password);

        const user = await User.create({
            username,
            name,
            email,
            universityId,
            role: role || 'student',
            passwordHash,
            mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : true
        });

        await SecurityLog.create({
            action: 'User Registration',
            user: email,
            details: `New ${user.role} account created for ${name}.`
        });

        res.status(201).json({
            message: 'User registered successfully. You can now login.',
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login with credentials (SFA)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({ 
            $or: [{ email: identifier }, { username: identifier }] 
        });

        if (!user) {
            await SecurityLog.create({
                action: 'Login Attempt',
                user: identifier,
                status: 'failed',
                details: 'Non-existent user attempt.'
            });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await compareContent(password, user.passwordHash);
        if (!isPasswordMatch) {
            await SecurityLog.create({
                action: 'Login Attempt',
                user: user.email,
                status: 'failed',
                details: 'Wrong password entered.'
            });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.mfaEnabled) {
            const otp = generateOTP();
            const otpHash = await hashContent(otp);
            const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 

            user.mfaOTP = otpHash;
            user.mfaExpiry = otpExpiry;
            await user.save();

            await sendOTP(user.email, otp);

            await SecurityLog.create({
                action: 'MFA Initiated',
                user: user.email,
                details: 'OTP sent to email for secondary authentication.'
            });

            return res.status(200).json({
                message: 'MFA required',
                step: 'mfa-pending',
                identifier: identifier
            });
        }

        const token = generateToken({
            userId: user._id,
            role: user.role
        });

        await SecurityLog.create({
            action: 'User Login',
            user: user.email,
            details: 'SFA login (Direct)'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                universityId: user.universityId,
                role: user.role,
                mfaEnabled: user.mfaEnabled
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify MFA (MFA)
// @route   POST /api/auth/mfa-verify
export const verifyMFA = async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        const user = await User.findOne({ 
            $or: [{ email: identifier }, { username: identifier }] 
        });

        if (!user || !user.mfaOTP || !user.mfaExpiry) {
            return res.status(400).json({ message: 'MFA session not found or expired' });
        }

        if (new Date() > user.mfaExpiry) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        const isOtpMatch = await compareContent(otp, user.mfaOTP);
        if (!isOtpMatch) {
            await SecurityLog.create({
                action: 'MFA Verification',
                user: user.email,
                status: 'failed',
                details: 'Incorrect OTP entered.'
            });
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        const token = generateToken({
            userId: user._id,
            role: user.role
        });

        user.mfaOTP = null;
        user.mfaExpiry = null;
        await user.save();

        await SecurityLog.create({
            action: 'MFA Verification',
            user: user.email,
            status: 'success',
            details: 'Successful 2FA login.'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                universityId: user.universityId,
                role: user.role,
                mfaEnabled: user.mfaEnabled
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
