import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../config/jwt';
import { ReturnFalseData } from '../utils/serverUtils';

// Extend Express Request to include user data
declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload;
		}
	}
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and adds user data to request
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
	try {
		// Extract token from Authorization header
		const token = extractTokenFromHeader(req.headers.authorization);

		// Verify and decode token
		const decoded = verifyToken(token);

		// Add user data to request object
		req.user = decoded;

		console.log(`✅ JWT Authentication successful for user: ${decoded.walletAddress}`);
		next();

	} catch (error: any) {
		console.error('❌ JWT Authentication failed:', error.message);

		ReturnFalseData(
			res,
			'Authentication failed',
			error.message || 'Invalid or missing token',
			401
		);
		return;
	}
};

/**
 * Optional JWT Authentication Middleware
 * Adds user data to request if token is provided, but doesn't fail if missing
 */
export const optionalJWT = (req: Request, res: Response, next: NextFunction): void => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const token = extractTokenFromHeader(authHeader);
			const decoded = verifyToken(token);
			req.user = decoded;
			console.log(`✅ Optional JWT found for user: ${decoded.walletAddress}`);
		}

		next();

	} catch (error: any) {
		console.warn('⚠️ Optional JWT verification failed:', error.message);
		// Continue without authentication for optional middleware
		next();
	}
};
