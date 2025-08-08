export const globalErrorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack:', err.stack);

  const errorResponse = {
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  };

  let statusCode = 500;

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse.error = 'Authentication failed';
  }
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error = 'Validation failed';
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json(errorResponse);
};