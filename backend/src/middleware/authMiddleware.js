import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ACCESS_CONTROL_MATRIX } from '../config/accessControlMatrix.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

        console.log(`[AUTH CHECK] User: ${req.user.username}, Role: ${role}, Resource: ${resource}, Action: ${action}, Permissions: ${JSON.stringify(permissions)}`);

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
