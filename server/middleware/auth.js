import jwt from 'jsonwebtoken';

function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ message: 'Missing Authorization token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function signToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn, ...options });
}



