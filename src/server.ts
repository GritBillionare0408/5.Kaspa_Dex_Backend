import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import { databaseService } from './database';
import userRouter from './routes/userRouter';
import { test_login } from './test/test_user';
import { init, safeServer } from './utils/serverUtils';
import { config, validateEnvironment } from './config/environment';

dotenv.config();
validateEnvironment();

const app = express();
const router = express.Router();

init(app);
safeServer();

app.use('/user', userRouter);
app.use('/api', router);

const startServer = async () => {
	try {
		await databaseService.connect();

		const PORT = config.server.port;
		const server = app.listen(PORT, async () => {
			console.log(`
🚀 Kaspa Backend Server Started Successfully!
📡 Server running on port ${PORT}
🗄️  Database: Connected
🌐 API Base URL: ${config.domain.backend}
📋 Available endpoints:
   - POST /user/login      (User Login & Auto-Registration + JWT)
   - POST /user/logout     (User Logout with JWT Authentication)
   - GET  /health          (Health Check)
   - GET  /api             (API Health Check)
			`);
		});

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

startServer();

// Test Scripts
test_login();
