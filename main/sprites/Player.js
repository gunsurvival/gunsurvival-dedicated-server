const SAT = require('sat');
const Sprite = require('./Sprite');

module.exports = class Player extends Sprite {
	constructor(options) {
		super(options);
		const {speed = 7} = options;
		this.baseSpeed = speed;
		this.speed = speed;
		this.moving = {
			up: false,
			down: false,
			left: false,
			right: false
		};
		this.mouse = {
			left: false,
			right: false,
			middle: false
		};
	}

	update() {
		super.update();
		this.pos.add(this.getSpeedV());
	}

	getSpeedV() {
		// console.log(this.world);
		return new SAT.Vector(
			this.moving.left ? -1 : this.moving.right ? 1 : 0,
			this.moving.up ? -1 : this.moving.down ? 1 : 0
		).scale(
			(1 / Math.sqrt(2)) * this.speed * (32 / this.world.room.gameServer.tps)
		);
	}
};
