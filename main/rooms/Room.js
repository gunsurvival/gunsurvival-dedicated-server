const uniqid = require('uniqid');
const Manager = require('../helpers/Manager');

module.exports = class Room extends Manager {
	constructor({
		gameServer,
		id = uniqid(),
		master,
		description = 'New Game!',
		maxPlayer = 1,
		password = '',
		timeCreate = Date.now()
	}) {
		super();
		this.gameServer = gameServer;
		this.id = id;
		this.master = master;
		this.description = description;
		this.maxPlayer = maxPlayer;
		this.password = password;
		this.timeCreate = timeCreate;
		this.onMessageHandlers = {
			'room-leave': async socket => {
				try {
					await this.onLeave(socket, true);
					this.onAnyLeave(socket);
				} catch (e) {
					socket.emit('error', e.message);
				}
			}
		};
		this.updateInterval;
		this.onCreate();
	}

	emit(eventName, ...args) {
		this.gameServer.io.to(this.id).emit(eventName, ...args);
	}

	getMetadata() {
		return {
			id: this.id,
			master: this.master,
			description: this.description,
			maxPlayer: this.maxPlayer,
			playing: this.items.length,
			timeCreate: this.timeCreate
		};
	}

	async requestJoin(socket, options) {
		if (this.find({id: socket.id}))
			throw new Error('Bạn đã tham gia phòng này rồi!');
		if (this.items.length >= this.maxPlayer) {
			if (this.id.includes('lobby'))
				throw new Error('Sảnh chờ quá tải, hãy thử tải lại trang!');
			throw new Error('Phòng đã đủ số lượng người chơi!');
		}
		await this.onJoin(socket, options);
		socket.join(this.id);
		this.add(socket);
	}

	onMessage(eventName, cb) {
		this.onMessageHandlers[eventName] = cb;
		// returns a method to unbind the callback
		return () => delete this.onMessageHandlers[eventName];
	}

	onAnyLeave(socket) {
		// consented and not consented
		this.emit('room-leave', socket.id);
		socket.leave(this.id);
		this.remove({id: socket.id});
		if (this.items.length <= 0) this.destroy();
	}

	async onCreate() {}

	async onJoin(socket, options) {}

	async onLeave(socket, consented) {}

	async onDispose() {}

	start() {}

	destroy() {
		clearInterval(this.updateInterval);
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].leave(this.id);
		}
		this.removed = true;
	}
};
