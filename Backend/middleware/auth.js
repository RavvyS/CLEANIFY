import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Role-based authorization
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. ${req.user.role} role cannot access this resource.`
            });
        }

        next();
    };
};

// Specific role middlewares for convenience
export const adminOnly = authorize('admin');
export const dispatcherOnly = authorize('dispatcher');
export const collectorOnly = authorize('collector');
export const householderOnly = authorize('householder');

// Combined middleware for multiple roles
export const adminOrDispatcher = authorize('admin', 'dispatcher');

export default protect;