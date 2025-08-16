import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration interface
 */
interface EnvironmentConfig {
	// Database Configuration
	database: {
		url: string;
		name: string;
	};

	// Server Configuration
	server: {
		port: number;
		nodeEnv: string;
	};

	// Domain Configuration
	domain: {
		backend: string;
		apiBase: string;
	};

	// CORS Configuration
	cors: {
		allowedOrigins: string;
	};
}

/**
 * Environment configuration object
 */
export const config: EnvironmentConfig = {
	database: {
		url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
		name: process.env.MONGO_PATH || 'kaspa_dex'
	},

	server: {
		port: parseInt(process.env.PORT || '5184', 10),
		nodeEnv: process.env.NODE_ENV || 'development'
	},

	domain: {
		backend: process.env.BACKEND_DOMAIN || 'https://tron-sunswap.com',
		apiBase: process.env.API_BASE_URL || 'https://tron-sunswap.com'
	},

	cors: {
		allowedOrigins: process.env.ALLOWED_ORIGINS || '*'
	}
};

/**
 * Environment validation
 */
export function validateEnvironment(): void {
	const requiredEnvVars = [
		'MONGODB_URL',
		'MONGO_PATH',
		'BACKEND_DOMAIN'
	];

	const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

	if (missingVars.length > 0) {
		console.warn(`⚠️  Warning: Missing optional environment variables: ${missingVars.join(', ')}`);
		console.warn('📝 Using default values. Consider creating a .env file with proper configuration.');
	}
}
