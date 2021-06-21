const {Quadtree, Point, Rectangle, Circle} = require('../helpers/Quadtree');

module.exports = class QuadtreeManager {
	constructor({boundary = [0, 0, 0, 0], split = 4, ignoreTags = []} = {}) {
		this.boundary = new Rectangle(...boundary);
		this.split = split;
		this.ignoreTags = ignoreTags;

		this.isIgnore = {};
		for (const tag of this.ignoreTags) {
			this.isIgnore[tag] = true;
		}

		this.reset();
		this.lrgstRange = 0; // largest diameter range to query
	}

	reset() {
		this.quadtree = new Quadtree(this.boundary, this.split);
	}

	insert(sprite) {
		if (this.isIgnore[sprite.tag]) return;
		this.quadtree.insert(new Point(sprite.pos.x, sprite.pos.y, sprite));
		const QTRange = sprite.QTRange;
		if (this.lrgstRange < QTRange) this.lrgstRange = QTRange;
	}

	query(x, y) {
		return this.quadtree.query(new Circle(x, y, this.lrgstRange * 2));
	}
};

/*
a = {x: , y :}
translate - -
a.x * Math.cos(angle)
a.y * Math.sin(angle)
*/
