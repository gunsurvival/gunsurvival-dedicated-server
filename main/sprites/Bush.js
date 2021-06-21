const SAT = require('sat');
const Sprite = require('./Sprite');

module.exports = class Bush extends Sprite {
	constructor(options) {
		super(options);
		this.rigidBody = new SAT.Circle(this.pos, 40);
		this.QTRange = 40;
	}

	onCollisionEnter(other, response) {}

	onCollisionStay() {}

	onCollisionExit() {}
};
