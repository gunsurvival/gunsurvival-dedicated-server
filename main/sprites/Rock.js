const SAT = require('sat');
const Sprite = require('./Sprite');

module.exports = class Rock extends Sprite {
	constructor(options) {
		super(options);
		this.rigidBody = new SAT.Circle(this.pos, 80);
		this.QTRange = 80;
	}

	onCollisionEnter(other, response) {}

	onCollisionStay() {}

	onCollisionExit() {}
};
