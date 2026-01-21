import User from '../models/User.js';
import { hashContent, compareContent, generateOTP, generateToken } from '../utils/authUtils.js';
import { sendOTP } from '../utils/mailUtils.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { username, email, role, password, name, universityId } = req.body;

        if (!username || !email || !password || !name || !universityId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userExists = await User.findOne({ 
            $or: [{ email }, { username }, { universityId }] 
        });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await hashContent(password);

        const user = await User.create({
            username,
            name,
            email,
            universityId,
            role: role || 'student',
            passwordHash
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
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await compareContent(password, user.passwordHash);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const otp = generateOTP();
        const otpHash = await hashContent(otp);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 

        user.mfaOTP = otpHash;
        user.mfaExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        await sendOTP(user.email, otp);

        res.status(200).json({
            message: 'MFA required',
            step: 'mfa-pending',
            identifier: identifier
        });

    } catch (error) {
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
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        const token = generateToken({
            userId: user._id,
            role: user.role
        });

        user.mfaOTP = null;
        user.mfaExpiry = null;
        await user.save();

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
