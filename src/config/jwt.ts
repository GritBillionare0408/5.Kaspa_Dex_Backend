import jwt from 'jsonwebtoken';

export const JWT_CONFIG = {
	secret: 'kaspa dex by grit',
	expiresIn: '24h' as string, // Token expires in 24 hours
	issuer: 'kaspa-dex',
};

export interface JWTPayload {
	userId: string;
	walletAddress: string;
	iat?: number;
	exp?: number;
	iss?: string;
}

/**
 * Generate JWT token for user
 */
export const generateToken = (userId: string, walletAddress: string): string => {
	const payload: JWTPayload = {
		userId,
		walletAddress,
	};

	return jwt.sign(payload, JWT_CONFIG.secret, {
		expiresIn: '24h',
		issuer: 'kaspa-dex',
	});
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
	try {
		const decoded = jwt.verify(token, JWT_CONFIG.secret, {
			issuer: 'kaspa-dex',
		}) as JWTPayload;

		return decoded;
	} catch (error) {
		throw new Error('Invalid or expired token');
	}
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string => {
	if (!authHeader) {
		throw new Error('Authorization header is required');
	}

	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		throw new Error('Authorization header format must be: Bearer <token>');
	}

	return parts[1];
};
