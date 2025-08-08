import { clerkClient } from '@clerk/clerk-sdk-node';

export const requireAuth = async (req, res, next) => {
  console.log('Checking Clerk authentication...');
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please provide Bearer token'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await clerkClient.verifyToken(token);
    
    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Get user info from Clerk
    const user = await clerkClient.users.getUser(payload.sub);
    
    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username || user.emailAddresses[0]?.emailAddress
    };

    console.log('User authenticated:', req.user.email);
    next();
  } catch (error) {
    console.error('Clerk auth error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await clerkClient.verifyToken(token);
    
    if (payload && payload.sub) {
      const user = await clerkClient.users.getUser(payload.sub);
      req.user = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || user.emailAddresses[0]?.emailAddress
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};