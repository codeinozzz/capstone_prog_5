import express from 'express';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

export const createAuthRoutes = () => {
  const router = express.Router();

  router.get('/config', (req, res) => {
    res.json({
      success: true,
      message: 'Keycloak configuration',
      data: {
        realm: 'hotel-realm',
        authServerUrl: 'http://localhost:8080',
        clientId: 'hotel-api',
        endpoints: {
          auth: 'http://localhost:8080/realms/hotel-realm/protocol/openid-connect/auth',
          token: 'http://localhost:8080/realms/hotel-realm/protocol/openid-connect/token',
          userinfo: 'http://localhost:8080/realms/hotel-realm/protocol/openid-connect/userinfo',
          logout: 'http://localhost:8080/realms/hotel-realm/protocol/openid-connect/logout'
        }
      }
    });
  });

  router.get('/user', authenticate, (req, res) => {
    console.log('Getting user info for:', req.user.username);
    
    res.json({
      success: true,
      message: 'User authenticated successfully',
      data: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        roles: req.user.roles,
        authenticated: true,
        tokenInfo: {
          issuer: req.user.tokenData.iss,
          audience: req.user.tokenData.aud,
          expiresAt: new Date(req.user.tokenData.exp * 1000).toISOString()
        }
      }
    });
  });

  router.get('/verify', authenticate, (req, res) => {
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        valid: true,
        username: req.user.username,
        roles: req.user.roles,
        expires: new Date(req.user.tokenData.exp * 1000).toISOString()
      }
    });
  });

  router.get('/status', optionalAuth, (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        authenticated: true,
        message: 'User is authenticated',
        user: {
          username: req.user.username,
          email: req.user.email,
          roles: req.user.roles
        }
      });
    } else {
      res.json({
        success: true,
        authenticated: false,
        message: 'No authentication provided or invalid token'
      });
    }
  });

  router.get('/help', (req, res) => {
    res.json({
      success: true,
      message: 'Authentication help',
      howToGetToken: {
        method: 'POST',
        url: 'http://localhost:8080/realms/hotel-realm/protocol/openid-connect/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          username: 'test',
          password: '123',
          grant_type: 'password',
          client_id: 'hotel-api'
        }
      },
      howToUseToken: {
        header: 'Authorization',
        value: 'Bearer {your_access_token}'
      },
      testEndpoints: [
        'GET /api/auth/user (protected)',
        'GET /api/auth/verify (protected)',
        'GET /api/auth/status (optional auth)',
        'GET /api/auth/config (public)'
      ]
    });
  });

  return router;
};