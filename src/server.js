const http = require('node:http');

const app = require('./app.js');
const mongodb = require('./config/db.js');
const logger = require('./utils/chalkLogger.js');

const PORT = process.env.PORT || 3000;

async function startServer() {
	const server = http.createServer(app);

	try {
		await mongodb.connect();

		server.listen(PORT, '0.0.0.0', () => {
			logger.success('Success! Server is Listening.');
		});
	} catch (error) {
		logger.error(error.message);
	}
}

startServer();
