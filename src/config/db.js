const { MongoClient, ObjectId } = require('mongodb');

const logger = require('../utils/chalkLogger.js');

const DATABASE_COLLECTION_NAME = 'items';

class Database {
	constructor() {
		this.itemsCollection = undefined;
	}

	async connect() {
		try {
			const client = new MongoClient(process.env.DATABASE_URI);
			await client.connect();

			logger.success('Success! Database is Connected.');

			this.itemsCollection = client
				.db()
				.collection(DATABASE_COLLECTION_NAME);
		} catch (error) {
			throw new Error(error);
		}
	}

	getIdFormat(id) {
		return new ObjectId(id);
	}
}

module.exports = new Database();
