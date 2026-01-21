import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashContent = async (content) => {
    const saltRounds = 10;
    return await bcrypt.hash(content, saltRounds);
};

export const compareContent = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    });
};
