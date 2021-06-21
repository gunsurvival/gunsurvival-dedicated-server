const SAT = require('sat');
const Player = require('./Player');

module.exports = class Gunner extends Player {
	constructor(options) {
		super(options);
		this.rigidBody = new SAT.Circle(this.pos, 40);
		this.QTRange = 40;
	}

	onCollisionStay(other, response) {
		switch (other.constructor.name) {
		case 'Gunner':
		case 'Rock':
			this.pos.x -= response.overlapV.x / 2;
			this.pos.y -= response.overlapV.y / 2;
			break;
		}
	}

	onCollisionEnter(other, response) {
		switch (other.constructor.name) {
		case 'Bush':
			this.visible = false;
			this.speed = this.speed * 0.3;
			break;
		}
	}

	onCollisionExit(other) {
		switch (other.constructor.name) {
		case 'Bush':
			this.visible = true;
			this.speed = this.baseSpeed;
			break;
		}
	}
};
