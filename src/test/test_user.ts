import axios from 'axios';
import { config } from '../config/environment';

/**
 * Test function for user login and logout endpoints with JWT
 */
export async function test_login(): Promise<void> {
	try {
		// Generate random wallet address
		const randomWalletAddress = 'kaspa_' + Math.random().toString(36).substring(2, 15);

		console.log(`🧪 Testing /user/login with wallet: ${randomWalletAddress}`);

		// Test Login
		const loginResponse = await axios.post(`${config.domain.backend}/user/login`, {
			wallet_address: randomWalletAddress
		});

		console.log('✅ Login test successful:', loginResponse.data);

		// Extract JWT token from login response
		const token = loginResponse.data.data?.token;
		if (!token) {
			throw new Error('No JWT token received from login');
		}

		console.log(`🔑 JWT Token received: ${token.substring(0, 20)}...`);

		// Test Logout with JWT token
		console.log(`🧪 Testing /user/logout with JWT token`);

		const logoutResponse = await axios.post(`${config.domain.backend}/user/logout`, {}, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		console.log('✅ Logout test successful:', logoutResponse.data);

	} catch (error: any) {
		console.error('❌ Test failed:', error.response?.data || error.message);
	}
}