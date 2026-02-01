// lib/auth/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
  role: 'STUDENT' | 'ADMIN'
}

export interface RefreshTokenPayload {
  userId: string
  tokenVersion: number
}

/**
 * Generate access token (short-lived: 15 minutes)
 */
export function generateAccessToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: '15m',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

/**
 * Generate refresh token (long-lived: 7 days)
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    expiresIn: '7d',
  }
  return jwt.sign(payload, JWT_REFRESH_SECRET, options)
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload
  } catch (error) {
    return null
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

