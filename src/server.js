const http = require('node:http');

const app = require('./app.js');

const server = http.createServer(app);

const PORT = 3000;

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
