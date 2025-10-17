import mongoose from 'mongoose';
const { ValidationError } = mongoose;

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ValidationError) {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `Duplicate value for ${field}. This ${field} is already in use.`
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token or no token provided' });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
  }

  res.status(500).json({ message: 'Internal server error' });
};