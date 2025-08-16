import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import { databaseService } from '../database';
import { ApiResponse } from '../models/User';
import { config } from '../config/environment';

/**
 * Initialize middleware for the Express app
 */
export function init(app: express.Application) {
	const corsOptions: CorsOptions = {
		origin: config.cors.allowedOrigins, // Use configured origins
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
		credentials: false, // Set to true if you want to allow cookies/auth headers
		preflightContinue: false, // Pass control to next handler after OPTIONS
		optionsSuccessStatus: 204, // Some legacy browsers choke on 204
	};

	app.use(express.json());

	app.use((req: Request, res: Response, next: NextFunction) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader(
			"Access-Control-Allow-Methods",
			"GET, POST, PATCH, PUT, DELETE"
		);
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
		next();
	});

	app.use(cors(corsOptions));
}

/**
 * Safe server shutdown handling
 */
export function safeServer() {
	// Graceful shutdown handler
	const gracefulShutdown = async () => {
		console.log('🛑 Received shutdown signal. Graceful shutdown initiated...');
		try {
			await databaseService.disconnect();
			console.log('✅ Graceful shutdown completed');
			process.exit(0);
		} catch (error) {
			console.error('❌ Error during graceful shutdown:', error);
			process.exit(1);
		}
	};

	// Handle shutdown signals
	process.on('SIGTERM', gracefulShutdown);
	process.on('SIGINT', gracefulShutdown);
}

/**
 * Standard success response utility
 * @param res - Express Response object
 * @param message - Success message
 * @param data - Data to return
 * @param statusCode - HTTP status code (default: 200)
 */
export function ReturnTrueData<T = any>(
	res: Response,
	message: string,
	data?: T,
	statusCode: number = 200
): Response {
	return res.status(statusCode).json({
		success: true,
		message,
		data
	} as ApiResponse<T>);
}

/**
 * Standard error response utility
 * @param res - Express Response object
 * @param message - Error message
 * @param error - Error details
 * @param statusCode - HTTP status code (default: 400)
 */
export function ReturnFalseData(
	res: Response,
	message: string,
	error?: string,
	statusCode: number = 400
): Response {
	return res.status(statusCode).json({
		success: false,
		message,
		error
	} as ApiResponse);
}
