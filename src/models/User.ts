import { Document } from 'mongodb';

export interface User extends Document {
	// _id is automatically provided by MongoDB
	publicKey: string;
	created_date: Date;
	permission: string;
	joined: boolean;
}

export interface LoginRequest {
	wallet_address: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}
