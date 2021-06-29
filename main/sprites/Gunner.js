const SAT = require('sat');
const Player = require('./Player');
const Bullet = require('./Bullet');

module.exports = class Gunner extends Player {
	constructor(options) {
		super(options);
		this.rigidBody = new SAT.Circle(this.pos, 40);
		this.QTRange = 40;
	}

	onCollisionEnter(other, response) {
		switch (other.constructor.name) {
		case 'Bush':
			this.visible = false;
			this.speed = this.speed * 0.3;
			break;
		}
	}

	onCollisionStay(other, response) {
		switch (other.constructor.name) {
		case 'Gunner':
		case 'Rock':
			this.pos.sub(response.overlapV.scale(0.5, 0.5));
			break;
		case 'Bullet':
			this.pos.sub(response.overlapV.scale(0.5, 0.5));
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

	shoot(angle) {
		this.shootInterval = setInterval(() => {
			const speedX = Math.cos(this.angle) * 20;
			const speedY = Math.sin(this.angle) * 20;
			this.world.add(
				new Bullet({
					world: this.world,
					owner: this,
					pos: {x: this.pos.x, y: this.pos.y},
					vel: {x: speedX, y: speedY}
				})
			);
		}, 100);
	}

	stopShoot(angle) {
		clearInterval(this.shootInterval);
	}
};
