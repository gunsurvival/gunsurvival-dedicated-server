const chalk = require('chalk');

class Logger {
	constructor(prefixTags = []) {
		this.prefixTags = prefixTags;
	}

	getPrefix(tags) {
		const finalTags = this.prefixTags.concat(tags);
		let prefix = '';
		for (let i = 0; i < finalTags.length; i++) {
			const {tag, color, bgColor} = finalTags[i];
			prefix += chalk[color][bgColor](`[ ${tag} ]`) + ' ';
		}
		return prefix;
	}

	log(msg = '', msgColor = 'white', ...tags) {
		const prefix = this.getPrefix(tags);
		console.log(prefix + chalk[msgColor](msg));
	}

	info(msg = '', msgColor = 'white', ...tags) {
		const prefix = this.getPrefix(
			[
				{
					tag: 'INFO',
					color: 'white',
					bgColor: 'bgCyan'
				}
			].concat(tags)
		);
		console.log(prefix + chalk[msgColor](msg));
	}

	debug(msg = '', msgColor = 'cyan', ...tags) {
		const prefix = this.getPrefix(
			[
				{
					tag: 'DEBUG',
					color: 'white',
					bgColor: 'bgCyan'
				}
			].concat(tags)
		);
		console.log(prefix + chalk[msgColor](msg));
	}

	error(msg = '', msgColor = 'red', ...tags) {
		const prefix = this.getPrefix(
			[
				{
					tag: 'ERROR',
					color: 'white',
					bgColor: 'bgRed'
				}
			].concat(tags)
		);
		console.log(prefix + chalk[msgColor](msg));
	}

	done(msg = '', msgColor = 'green', ...tags) {
		const prefix = this.getPrefix(
			[
				{
					tag: 'DONE',
					color: 'white',
					bgColor: 'bgGreen'
				}
			].concat(tags)
		);
		console.log(prefix + chalk[msgColor](msg));
	}

	success(msg = '', msgColor = 'green', ...tags) {
		const prefix = this.getPrefix(
			[
				{
					tag: 'SUCCESS',
					color: 'white',
					bgColor: 'bgGreen'
				}
			].concat(tags)
		);
		console.log(prefix + chalk[msgColor](msg));
	}

	warn(msg = '', msgColor = 'yellow', ...tags) {
		const prefix = this.getPrefix(
			[
				{
					tag: 'WARN',
					color: 'white',
					bgColor: 'bgYellow'
				}
			].concat(tags)
		);
		console.log(prefix + chalk[msgColor](msg));
	}
}

const initLogger = (prefix, prop = 'newLogger') => {
	console[prop] = new Logger(prefix);
};

const setTerminalTitle = text => {
	process.stdout.write(
		`${String.fromCharCode(27)}]0;${text}${String.fromCharCode(7)}`
	);
};

module.exports = {
	initLogger,
	setTerminalTitle
};
