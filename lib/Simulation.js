import { Particle } from "./Particle.js";
import { derivative, fixedpoint } from "./utils.js";

export class Simulation {
	/** @type {Particle[]} */
	particles = [];

	/**
	 * Adds a particle into the simulation
	 * @param {Particle} particle 
	 */
	add(particle) {
		this.particles.push(particle);
		particle.sim = this;
	}

	/** 
	 * The step between samples for calculating the derivative in a field
	 * @type {number}
	 */
	derivativePrecision = 0.001;

	/** 
	 * @param {string} field
	 * @param {[number,number]} position 
	 * @returns {number}
	 */
	read(field, position) {
		let val = 0;

		// Direct iteration instead of filter/map/reduce chain
		for (let i = 0; i < this.particles.length; i++) {
			const particle = this.particles[i];
			if (field in particle.write) {
				const write = particle.write[field]([
					position[0] - particle.pos[0],
					position[1] - particle.pos[1]
				]);
				if (!isNaN(write)) {
					val += write;
				}
			}
		}

		return val;
	}

	/** 
	 * @param {string} field
	 * @param {[number,number]} position 
	 * @returns {[number,number]}
	 */
	readdiff(field, position) {
		// Cache derivativePrecision to avoid repeated property access
		const dp = this.derivativePrecision;

		return [
			fixedpoint(
				derivative(
					x => this.read(field, [x, position[1]]),
					dp
				)(position[0]),
				dp
			),
			fixedpoint(
				derivative(
					x => this.read(field, [position[0], x]),
					dp
				)(position[1]),
				dp
			),
		];
	}

	update(dt) {
		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].update(dt);
		}
	}

	/** @type {number?} */
	iid = null;

	/** @type {number} */
	urate = 1000;

	start(rate) {
		this.urate = rate;
		this.stop();
		this.iid = setInterval(() => this.update(1), rate);
	}

	stop() {
		if (this.iid === null) return;
		clearInterval(this.iid);
		this.iid = null;
	}
}