import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function signJwtToken(payload: object) {
  return jwt.sign(payload, SECRET, {
    expiresIn: '1h',
  });
}

export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
