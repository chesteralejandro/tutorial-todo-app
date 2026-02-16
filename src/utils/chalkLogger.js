const chalk = require('chalk').default;

class Logger {
	success(message) {
		console.log(chalk.bgGreen.whiteBright(message));
	}

	error(message) {
		console.error(chalk.bgRed.whiteBright(message));
	}

	customLink(label, message) {
		console.log(label, chalk.blueBright(message));
	}
}

module.exports = new Logger();
