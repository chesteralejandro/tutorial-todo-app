const { MongoClient, ObjectId } = require('mongodb');

const logger = require('../utils/chalkLogger.js');

const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

const DATABASE_URI = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@free-tutorial-cluster.xqk44sl.mongodb.net/${DATABASE_NAME}?appName=Free-Tutorial-Cluster&retryWrites=true&w=majority`;
const DATABASE_COLLECTION_NAME = 'items';

class Database {
	constructor() {
		this.itemsCollection = undefined;
	}

	async connect() {
		try {
			const client = new MongoClient(DATABASE_URI);
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
