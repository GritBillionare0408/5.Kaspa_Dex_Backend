import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { databaseService } from './database';
dotenv.config();

const app = express();
const router = express.Router();

const corsOptions: CorsOptions = {
	origin: '*', // Allow all origins; replace with array or function to restrict
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

app.use(cors({ origin: "*", }));

// Root route
app.get('/', (req: Request, res: Response) => {
	res.json({
		success: true,
		message: 'Kaspa Backend API is running',
		data: {
			version: '1.0.0',
			timestamp: new Date().toISOString(),
			database: databaseService.isDbConnected() ? 'connected' : 'disconnected',
			message: "✅ Good Network"
		},
	});
});

app.use('/api', router);

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

// Start server with database connection
const startServer = async () => {
	try {
		// Connect to database
		await databaseService.connect();

		// Start server on port 5184
		const PORT = 5184;
		const server = app.listen(PORT, () => {
			console.log(`
🚀 Kaspa Backend Server Started Successfully!
📡 Server running on port ${PORT}
🗄️  Database: Connected
🌐 API Base URL: http://localhost:${PORT}
📋 Available endpoints:
   - GET  /               (Root)
   - GET  /health         (Health Check)
   - GET  /api            (API Health Check)
			`);
		});

		// Handle server errors
		server.on('error', (error: any) => {
			if (error.code === 'EADDRINUSE') {
				console.error(`❌ Port ${PORT} is already in use`);
			} else {
				console.error('❌ Server error:', error);
			}
			process.exit(1);
		});

	} catch (error) {
		console.error('❌ Failed to start server:', error);
		process.exit(1);
	}
};

// Initialize server
startServer();
