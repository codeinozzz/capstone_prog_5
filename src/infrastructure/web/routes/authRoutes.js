import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/clerkMiddleware.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const createAuthRoutes = () => {
  const router = express.Router();

  // Get current user info (protected)
  router.get('/user', requireAuth, (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user,
        authenticated: true
      }
    });
  });

  // Check auth status (optional)
  router.get('/status', optionalAuth, (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        authenticated: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          username: req.user.username
        }
      });
    } else {
      res.json({
        success: true,
        authenticated: false,
        message: 'No authentication provided'
      });
    }
  });

  // Get all users (admin endpoint)
  router.get('/users', requireAuth, async (req, res) => {
    try {
      const users = await clerkClient.users.getUserList();
      
      res.json({
        success: true,
        data: users.map(user => ({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          createdAt: user.createdAt
        })),
        total: users.length
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users'
      });
    }
  });

  // Configuration info
  router.get('/config', (req, res) => {
    res.json({
      success: true,
      message: 'Clerk authentication configuration',
      data: {
        authType: 'clerk',
        provider: 'Clerk',
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        endpoints: {
          user: 'GET /api/auth/user (protected)',
          status: 'GET /api/auth/status (optional)',
          users: 'GET /api/auth/users (protected)',
          config: 'GET /api/auth/config (public)'
        },
        frontend: {
          note: 'Use Clerk frontend components for login/register',
          components: ['<SignIn />', '<SignUp />', '<UserButton />'],
          documentation: 'https://clerk.com/docs'
        }
      }
    });
  });

  // Help information
  router.get('/help', (req, res) => {
    res.json({
      success: true,
      message: 'Clerk authentication help',
      setup: {
        backend: 'Already configured with middleware',
        frontend: {
          install: 'npm install @clerk/clerk-react (for React) or @clerk/clerk-js (vanilla)',
          setup: 'Wrap app with ClerkProvider using CLERK_PUBLISHABLE_KEY',
          components: 'Use <SignIn>, <SignUp>, <UserButton> components'
        }
      },
      usage: {
        authentication: 'Clerk handles login/register in frontend automatically',
        apiCalls: 'Frontend automatically includes auth token in requests',
        tokenFormat: 'Authorization: Bearer {clerk_token}'
      },
      examples: {
        react: {
          install: 'npm install @clerk/clerk-react',
          setup: 'ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}',
          components: '<SignIn />, <SignUp />, <UserButton />'
        },
        apiCall: {
          note: 'Clerk automatically adds Authorization header',
          example: 'fetch("/api/hotels") // Token added automatically'
        }
      }
    });
  });

  return router;
};