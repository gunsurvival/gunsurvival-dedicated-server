import Sprite from "./Sprite.js";
import {images} from "../../globals/asset.global.js";

export default class Bullet extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Bullet",
				smoothRotate: false,
				speedRotate: 0.06,
				speedMove: 0.2,
				liveTime: 40
			},
			config
		);
		super(config);
		this.chains = [];
		for (let i = 0; i < 5; i++) {
			this.chains.push({x: this.pos.x, y: this.pos.y});
		}
	}

	update(sketch) {
		super.update(sketch);
		for (let i = this.chains.length - 1; i > 0; i--) {
			this.chains[i].x = this.chains[i - 1].x;
			this.chains[i].y = this.chains[i - 1].y;
		}
		this.chains[0].x = this.pos.x;
		this.chains[0].y = this.pos.y;
		sketch.strokeWeight(6);
		sketch.stroke("white");
		for (let i = 0; i < this.chains.length - 1; i++) {
			sketch.line(
				this.chains[i].x,
				this.chains[i].y,
				this.chains[i + 1].x,
				this.chains[i + 1].y
			);
		}
		// this.rotateTo(
		// 	Math.atan2(this.targetPos.y - this.pos.y, this.targetPos.x - this.pos.x)
		// );
		// sketch.rotate(this.angle);
		// sketch.image(images["Bullet.png"], 0, 0);
	}

	onUpdate({pos, tick} = {}) {
		this.moveTo(pos);
		this.liveTime = 40;
	}

	getBoundary() {
		return {
			width: images["Bullet.png"].width,
			height: images["Bullet.png"].height
		};
	}
}
