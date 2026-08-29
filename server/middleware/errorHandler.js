/**
 * Global API Error Handling Middleware
 * Ensures no raw stack traces are sent to clients while returning structured error responses.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages.join(', ')
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid Identifier',
      message: `Resource not found with id: ${err.value}`
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate Key Error',
      message: 'A resource with this key already exists.'
    });
  }

  // Fallback internal server error
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: 'Server Error',
    message: err.message || 'An unexpected internal server error occurred.'
  });
};
