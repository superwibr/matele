import { Simulation } from "./Simulation.js";

export class Particle {
	/** @type {Simulation?} */
	sim = null;

	/** @type {[number,number]} */
	pos = [0, 0];

	/** @type {Object<string,function>} */
	write = {};

	update(dt) {

	}

	constructor(x, y){
		this.pos = [x ?? 0, y ?? 0]
	}
}