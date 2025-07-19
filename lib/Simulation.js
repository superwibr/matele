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
	 * The range at which read samples are considered identical
	 * @type {number}
	 */
	sampleTolerance = 0.5;

	/**
	 * The step between samples for calculating the derivative in a field
	 * @type {number}
	 */
	derivativePrecision = 0.001;

	/** @type {[string,number,number,number][]} */
	readMemo = [];

	/** 
	 * @param {string} field
	 * @param {[number,number]} position 
	 */
	findReadMemo(field, position) {
		const validMemos = this.readMemo
			.filter(memo => memo[0] === field)
			.filter(memo => Math.abs(memo[1] - position[0]) < this.sampleTolerance)
			.filter(memo => Math.abs(memo[2] - position[1]) < this.sampleTolerance);

		if (validMemos.length === 0) return null;

		const perfect = validMemos.find(memo => memo[1] === position[0] && memo[2] === position[1]);

		if (perfect !== undefined) return perfect[3];

		const avg = validMemos.reduce((acc, memo) => acc + memo[3], 0) / validMemos.length;

		return avg;
	}

	/** 
	 * @param {string} field
	 * @param {[number,number]} position 
	 * @returns {number}
	 */
	read(field, position, noMemo = false) {
		const memo = noMemo ? null : this.findReadMemo(field, position);

		if (memo !== null) return memo;

		const val = this.particles
			.filter(particle => field in particle.write)
			.map(particle => particle.write[field](position))
			.reduce((acc, write) => acc + write, 0);

		this.readMemo.push([field, ...position, val]);

		return val;
	}

	/** 
	 * @param {string} field
	 * @param {[number,number]} position 
	 * @returns {[number,number]}
	 */
	readdiff(field, position) {
		return [
			fixedpoint(
				derivative(
					x => this.read(field, [x, position[1]], true),
					this.derivativePrecision
				)(position[0]),
				this.derivativePrecision
			),
			fixedpoint(
				derivative(
					x => this.read(field, [position[0], x], true),
					this.derivativePrecision
				)(position[1]),
				this.derivativePrecision
			),
		];
	}

	update(dt) {
		this.particles.forEach(particle => particle.update(dt));
		this.readMemo.length = 0;
	}
}