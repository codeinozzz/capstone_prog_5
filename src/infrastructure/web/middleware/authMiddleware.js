import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-client';

const client = jwksClient({
  jwksUri: 'http://localhost:8080/realms/hotel-realm/protocol/openid-connect/certs'
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Error getting signing key:', err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

export const authenticate = (req, res, next) => {
  console.log('Authenticating request...');
  
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
      message: 'Please include Bearer token in Authorization header'
    });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token received:', token ? `${token.substring(0, 50)}...` : 'None');

  jwt.verify(token, getKey, {
    audience: 'account',
    issuer: 'http://localhost:8080/realms/hotel-realm',
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        details: err.message
      });
    }

    console.log('Token verified successfully');
    console.log('User:', decoded.preferred_username);
    console.log('Roles:', decoded.realm_access?.roles);

    req.user = {
      id: decoded.sub,
      username: decoded.preferred_username,
      email: decoded.email,
      roles: decoded.realm_access?.roles || [],
      tokenData: decoded
    };

    next();
  });
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  authenticate(req, res, (err) => {
    if (err) {
      req.user = null;
    }
    next();
  });
};