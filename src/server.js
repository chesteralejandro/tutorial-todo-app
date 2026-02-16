const http = require('node:http');

const app = require('./app.js');
const mongodb = require('./config/db.js');
const { default: chalk } = require('chalk');

const PORT = process.env.PORT || 3000;

async function startServer() {
	const server = http.createServer(app);

	try {
		await mongodb.connect();

		server.listen(PORT, () => {
			console.log(
				chalk.bgGreen.whiteBright('Success! Server is Listening.'),
			);
			console.log(
				'Follow link:',
				chalk.blueBright(`http://localhost:${PORT}`),
			);
		});
	} catch (error) {
		console.error(error.message);
	}
}

startServer();
