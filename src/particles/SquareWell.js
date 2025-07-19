import { Particle } from "../../lib/Particle.js";

export class SquareWell extends Particle {
	write = {
		gravity: ([x, y]) => Math.max(Math.abs(x), Math.abs(y))
	}
}