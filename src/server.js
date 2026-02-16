const http = require('node:http');

const app = require('./app.js');
const mongodb = require('./config/db.js');
const logger = require('./utils/chalkLogger.js');

const PORT = process.env.PORT || 3000;

async function startServer() {
	const server = http.createServer(app);

	try {
		await mongodb.connect();

		server.listen(PORT, () => {
			logger.success('Success! Server is Listening.');
			logger.customLink('Follow link:', `http://localhost:${PORT}`);
		});
	} catch (error) {
		logger.error(error.message);
	}
}

startServer();
