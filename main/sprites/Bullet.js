const SAT = require('sat');
const Sprite = require('./Sprite');

module.exports = class Bullet extends Sprite {
	constructor(options) {
		super(options);
		const {owner} = options;
		this.owner = owner;
		this.rigidBody = new SAT.Circle(this.pos, 4);
		this.QTRange = 4;
	}

	onCollisionEnter(other, response) {}

	onCollisionStay(other, response) {
		switch (other.constructor.name) {
		case 'Rock':
		case 'Tree':
			this.pos.sub(response.overlapV);
			this.vel.x -= response.overlapV.x;
			this.vel.y -= response.overlapV.y;
			break;
		case 'Gunner':
			if (other == this.owner) break;
			this.pos.sub(response.overlapV);
			this.vel.x -= response.overlapV.x * 5;
			this.vel.y -= response.overlapV.y * 5;
			// this.destroy();
			break;
		}
	}

	onCollisionExit(other) {}

	update() {
		super.update();
		if (this.vel.len() < 1) {
			this.destroy();
		}
	}
};
