// const Quadtree = require("../helpers/Quadtree");
const SAT = require('sat');
const QuadtreeManager = require('../helpers/QuadtreeManager');

module.exports = class World {
	constructor({room, sprites = [], indexTags = {}, QTSetting = {}}) {
		this.room = room;
		this.sprites = sprites;
		this.indexTags = indexTags;
		this.QTManager = new QuadtreeManager({
			...{boundary: [0, 0, 2000, 2000]},
			...QTSetting
		});
		this.executedOCE = {};
	}

	getSpritesByTag(tag) {
		return this.sprites[this.indexTags[tag]] || [];
	}

	add(sprite) {
		const tag = sprite.tag;
		let index = this.indexTags[tag];
		if (!index) {
			this.indexTags[tag] = this.sprites.push([sprite]) - 1;
		} else {
			this.sprites[index].push(sprite);
		}
	}

	remove(sprite) {
		const index = this.find({id: sprite.id}, true);
		if (index != -1) this.getSpritesByTag(sprite.tag).splice(index, 1);
	}

	find(query, returnIndex = false) {
		for (let i = 0; i < this.sprites.length; i++) {
			for (let j = 0; j < this.sprites[i].length; j++) {
				let found = true;
				for (const property in query)
					if (this.sprites[i][j][property] != query[property]) {
						found = false;
						break;
					}
				if (found) return returnIndex ? j : this.sprites[i][j];
			}
		}
		return returnIndex ? -1 : undefined;
	}

	nextTick() {
		this.QTManager.reset();
		for (let i = 0; i < this.sprites.length; i++) {
			for (let j = 0; j < this.sprites[i].length; j++) {
				const sprite = this.sprites[i][j];
				sprite.update();
				sprite.tick++;
				this.QTManager.insert(sprite);
			}
		}
		const allCollisions = [];
		const collided = {};
		for (let i = 0; i < this.sprites.length; i++) {
			for (let j = 0; j < this.sprites[i].length; j++) {
				const sprite = this.sprites[i][j];
				const result = this.QTManager.query(sprite.pos.x, sprite.pos.y);
				if (result.length <= 1) continue;

				const groupCollisions = [];
				for (let k = 0; k < result.length; k++) {
					const point = result[k];
					if (sprite == point.userData) continue;
					const rigid1 = sprite.rigidBody;
					const rigid2 = point.userData.rigidBody;
					const response = new SAT.Response();
					if (
						SAT[`test${rigid1.constructor.name}${rigid2.constructor.name}`](
							rigid1,
							rigid2,
							response
						)
					) {
						groupCollisions.push([point.userData, response]);
						collided[sprite.id + point.userData.id] = true;
					}
				}
				allCollisions.push({
					sprite,
					collisions: groupCollisions
				});
			}
		}

		for (let bid in this.executedOCE) {
			if (!collided[bid]) {
				const [sprite, other] = this.executedOCE[bid];
				sprite.onCollisionExit(other);
				delete this.executedOCE[bid];
			}
		}

		for (let i = 0; i < allCollisions.length; i++) {
			const {sprite, collisions} = allCollisions[i];

			for (let j = 0; j < collisions.length; j++) {
				const [other, response] = collisions[j];
				if (!this.executedOCE[sprite.id + other.id]) {
					sprite.onCollisionEnter(other, response);
					this.executedOCE[sprite.id + other.id] = [sprite, other];
				} else {
					sprite.onCollisionStay(other, response);
				}
			}
		}
	}

	static isTags(item1, item2, comparisonType) {
		// btw is not "By the way" but "Between"
		return (
			comparisonType.includes(item1.tag) || comparisonType.includes(item2.tag)
		);
	}

	onCollision(item1, item2) {}
};
