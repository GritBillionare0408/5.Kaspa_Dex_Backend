import { MongoClient, Db, Collection, Document } from 'mongodb';
import { config } from '../config/environment';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
	private client: MongoClient | null = null;
	private db: Db | null = null;
	private isConnected: boolean = false;

	/**
	 * Connect to MongoDB
	 */
	public async connect(): Promise<void> {
		try {
			const mongoUrl = config.database.url;
			const dbName = config.database.name;

			this.client = new MongoClient(mongoUrl);
			await this.client.connect();
			this.db = this.client.db(dbName);
			this.isConnected = true;

			console.log('✅ Connected to MongoDB successfully');
			console.log(`📊 Database: ${dbName}`);
			console.log(`🔗 URL: ${mongoUrl}`);
		} catch (error) {
			console.error('❌ MongoDB connection failed:', error);
			this.isConnected = false;
			throw error;
		}
	}

	/**
	 * Disconnect from MongoDB
	 */
	public async disconnect(): Promise<void> {
		try {
			if (this.client) {
				await this.client.close();
				this.client = null;
				this.db = null;
				this.isConnected = false;
				console.log('✅ Disconnected from MongoDB');
			}
		} catch (error) {
			console.error('❌ Error disconnecting from MongoDB:', error);
			throw error;
		}
	}

	/**
	 * Get database instance
	 */
	public getDb(): Db {
		if (!this.db) {
			throw new Error('Database not connected. Call connect() first.');
		}
		return this.db;
	}

	/**
	 * Get a collection
	 */
	public getCollection<T extends Document = Document>(name: string): Collection<T> {
		return this.getDb().collection<T>(name);
	}

	/**
	 * Check if database is connected
	 */
	public isDbConnected(): boolean {
		return this.isConnected;
	}

	/**
	 * Health check for database
	 */
	public async healthCheck(): Promise<boolean> {
		try {
			if (!this.db) {
				return false;
			}
			await this.db.admin().ping();
			return true;
		} catch (error) {
			console.error('❌ Database health check failed:', error);
			return false;
		}
	}

	/**
	 * Get users collection
	 */
	public getUsersCollection() {
		return this.getCollection('users');
	}
}

// Export singleton instance
export const databaseService = new DatabaseService();
