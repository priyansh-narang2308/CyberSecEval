import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ACCESS_CONTROL_MATRIX } from '../config/accessControlMatrix.js';

/**
 * Authentication Middleware (JWT Protection)
 * Verifies the token and attaches the user object to the request.
 */
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (exclude password)
            req.user = await User.findById(decoded.userId).select('-passwordHash -mfaOTP');

            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Authorization Middleware (ACM Enforcement)
 * Checks if the user's role has the required permission (action) on the resource.
 * 
 * @param {string} resource - The object being accessed (e.g., 'exams')
 * @param {string} action - The action being performed (e.g., 'read', 'write')
 */
export const authorize = (resource, action) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const role = req.user.role;
        const permissions = ACCESS_CONTROL_MATRIX[role] ? ACCESS_CONTROL_MATRIX[role][resource] : null;

        /**
         * ENFORCEMENT LOGIC:
         * 1. Retrieve the permissions list for the current User Role and Target Resource.
         * 2. Check if the requested Action exists in that list.
         * 3. If yes, ALLOW.
         * 4. If no (or no permissions exist), DENY with 403.
         */
        if (permissions && permissions.includes(action)) {
            next();
        } else {
            console.log(`[ACCESS DENIED] User: ${req.user.username}, Role: ${role}, Attempted: ${action} on ${resource}`);
            res.status(403).json({ 
                message: 'Access denied: insufficient permissions',
                details: `Role '${role}' cannot perform '${action}' on '${resource}'`
            });
        }
    };
};
