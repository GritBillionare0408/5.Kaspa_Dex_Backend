import express, { Request, Response } from 'express';
import { databaseService } from '../database';
import { Collection } from 'mongodb';
import { User, LoginRequest } from '../models/User';
import { ReturnTrueData, ReturnFalseData } from '../utils/serverUtils';
import { generateToken } from '../config/jwt';
import { authenticateJWT } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const { wallet_address }: LoginRequest = req.body;

		// Validate wallet_address
		if (!wallet_address || typeof wallet_address !== 'string' || wallet_address.trim().length === 0) {
			return ReturnFalseData(res, 'wallet_address is required and cannot be empty', 'Invalid input', 400);
		}

		const usersCollection: Collection<User> = databaseService.getCollection<User>('users');
		let user = await usersCollection.findOne({ publicKey: wallet_address });

		if (user) {
			// User exists - update joined to true
			await usersCollection.updateOne(
				{ publicKey: wallet_address },
				{ $set: { joined: true } }
			);

			// Generate JWT token
			const token = generateToken(user._id?.toString() || '', user.publicKey);

			return ReturnTrueData(res, 'User logged in successfully', {
				id: user._id?.toString(),
				publicKey: user.publicKey,
				created_date: user.created_date,
				permission: user.permission,
				joined: true,
				action: 'existing_user_login',
				token: token
			}, 200);
		}

		// User doesn't exist - register new user
		const currentDate = new Date();
		const newUser: User = {
			publicKey: wallet_address,
			created_date: currentDate,
			permission: 'user',
			joined: true
		} as User;

		const insertResult = await usersCollection.insertOne(newUser);

		if (!insertResult.insertedId) {
			return ReturnFalseData(res, 'Failed to create user account', 'Database insertion failed', 500);
		}

		// Generate JWT token for new user
		const token = generateToken(insertResult.insertedId.toString(), newUser.publicKey);

		return ReturnTrueData(res, 'User registered and logged in successfully', {
			id: insertResult.insertedId.toString(),
			publicKey: newUser.publicKey,
			created_date: newUser.created_date,
			permission: newUser.permission,
			joined: newUser.joined,
			action: 'new_user_registered_and_login',
			token: token
		}, 201);

	} catch (error) {
		console.error('❌ User login error:', error);
		return ReturnFalseData(res, 'Internal server error during user login', 'An unexpected error occurred', 500);
	}
});

userRouter.post('/logout', authenticateJWT, async (req: Request, res: Response) => {
	try {
		// Get user data from JWT token (added by authenticateJWT middleware)
		const userJWT = req.user!;

		console.log(`🔓 Logout request from user: ${userJWT.walletAddress}`);

		const usersCollection: Collection<User> = databaseService.getCollection<User>('users');

		// Update user's joined status to false
		const updateResult = await usersCollection.updateOne(
			{ publicKey: userJWT.walletAddress },
			{ $set: { joined: false } }
		);

		if (updateResult.matchedCount === 0) {
			return ReturnFalseData(res, 'User not found', 'Invalid user credentials', 404);
		}

		if (updateResult.modifiedCount === 0) {
			console.warn(`⚠️ User ${userJWT.walletAddress} was already logged out`);
		}

		return ReturnTrueData(res, 'User logged out successfully', {
			publicKey: userJWT.walletAddress,
			joined: false,
			loggedOutAt: new Date()
		}, 200);

	} catch (error) {
		console.error('❌ User logout error:', error);
		return ReturnFalseData(res, 'Internal server error during user logout', 'An unexpected error occurred', 500);
	}
});


export default userRouter;
