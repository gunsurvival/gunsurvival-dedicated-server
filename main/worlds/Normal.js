const World = require('./World');
const Sprite = require('../sprites');

module.exports = class Normal extends World {
	constructor(options) {
		super({
			QTSetting: {
				ignoreTags: ['large']
			},
			...options
		});
		for (let i = -2000; i < 2000; i += Math.random() * 50 + 300) {
			for (let j = -2000; j < 2000; j += Math.random() * 50 + 300) {
				this.add(
					new Sprite.Bush({
						world: this,
						pos: {
							x: i,
							y: j
						}
					})
				);
			}
		}
	}

	data() {
		const out = [];
		for (let i = 0; i < this.sprites.length; i++) {
			out.push(...this.sprites[i].map(s => s.getMetadata()));
		}
		return out;
	}
};
