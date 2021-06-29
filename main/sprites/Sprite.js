const SAT = require('sat');
const uniqid = require('uniqid');

module.exports = class Sprite {
	constructor({
		world,
		id = uniqid(),
		tag = this.constructor.name,
		pos = {x: 0, y: 0},
		vel = {x: 0, y: 0},
		friction = 0.9,
		angle = 0,
		rigidBody,
		QTRange = 0
	} = {}) {
		this.world = world;
		this.id = id;
		this.tag = tag;
		this.pos = new SAT.Vector(pos.x, pos.y);
		this.vel = new SAT.Vector(vel.x, vel.y);
		this.friction = friction;
		this.angle = angle;
		this.rigidBody = rigidBody;
		this.QTRange = QTRange;

		this.tick = 0;
		this._COLLIDED = {};
	}

	emit(eventName, ...args) {
		this.world.room.gameServer.io.to(this.id).emit(eventName, ...args);
	}

	update() {
		this.pos.add(this.vel);
		// this.vel.x -= 2 * (32 / this.world.room.gameServer.tps);
		// this.vel.y -= 2 * (32 / this.world.room.gameServer.tps);
	}

	getMetadata() {
		return {
			className: this.constructor.name,
			id: this.id,
			pos: this.pos,
			angle: this.angle,
			tick: this.tick
		};
	}

	destroy() {
		this.removed = true;
	}

	onCollisionEnter(other, response) {}

	onCollisionStay(other, response) {}

	onCollisionExit(other) {}
};
