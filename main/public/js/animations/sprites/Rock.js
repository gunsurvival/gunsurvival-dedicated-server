import Sprite from "./Sprite.js";
import {images} from "../../globals/asset.global.js";

export default class Rock extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Rock",
				infinite: true
			},
			config
		);
		super(config);
	}

	update(sketch) {
		super.update(sketch);
		if (this.hideAmount < 0) this.hideAmount = 0;
		if (this.hideAmount > 0) {
			if (this.toggleShake == -1) this.rotateTo(this.targetAngle - 1);
			if (this.toggleShake == 1) this.rotateTo(this.targetAngle + 1);
			if (this.angle <= this._angle - 0.12) this.toggleShake = 1;
			if (this.angle >= this._angle + 0.12) this.toggleShake = -1;
		} else {
			this.rotateTo(this._angle);
			this.speedRotate = 0.0017;
		}
		sketch.image(images["Rock.png"], 0, 0);
	}

	onUpdate({pos, hideAmount, tick} = {}) {
		this.moveTo(pos);
		this.hideAmount = hideAmount;
	}

	getBoundary() {
		return {
			width: images["Rock.png"].width,
			height: images["Rock.png"].height
		};
	}
}
