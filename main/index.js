require('dotenv').config();
const express = require('express');
const {Server} = require('socket.io');
const app = express();
const httpServer = app.listen(process.env.PORT, () => console.log('Server started on :*' + process.env.PORT));
const io = new Server(httpServer);
const {initLogger, setTerminalTitle} = require('./helpers/console');
const GameServer = require('./GameServer');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

initLogger();

global.SERVER_CONFIG = require('./configs/SERVER_CONFIG');
const gameServer = new GameServer(io);

let lastTPS = 0;
setInterval(() => {
	const memoryUsage = process.memoryUsage().heapTotal / 1024 / 1024;
	let symbol = '=';
	if (gameServer.tps > lastTPS) symbol = '↑';
	if (gameServer.tps < lastTPS) symbol = '↓';
	setTerminalTitle(
		`GUNSURVIVAL DEDICATED SERVER - MEMORY: ${memoryUsage.toFixed(
			2
		)}MB - TICKRATES: ${gameServer.tps}${symbol}`
	);
	lastTPS = gameServer.tps;
}, 3000);

module.exports = app;
