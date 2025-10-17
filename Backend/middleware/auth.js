import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * SOLID PRINCIPLE: Single Responsibility Principle (SRP)
 * This module has one responsibility: Handle authentication and authorization
 * Each function does one specific thing related to auth
 */

/**
 * SOLID PRINCIPLE: Open/Closed Principle (OCP)
 * The protect middleware is open for extension (can be used with different routes)
 * but closed for modification (core auth logic doesn't need to change)
 */

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

/**
 * SOLID PRINCIPLE: Liskov Substitution Principle (LSP)
 * The authorize function returns middleware that can substitute for any Express middleware
 * It maintains the same contract: (req, res, next) => void
 */

/**
 * SOLID PRINCIPLE: Interface Segregation Principle (ISP)
 * We provide specific role middlewares (adminOnly, dispatcherOnly, etc.)
 * so clients can depend only on what they need, not a generic authorize function
 */

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