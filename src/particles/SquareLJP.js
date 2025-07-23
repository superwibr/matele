import { Particle } from "../../lib/Particle.js";
import { ljPotential } from "../../lib/utils.js";

export class SquareLJP extends Particle {
	write = {
		gravity: ([x, y]) => ljPotential(12, 0.5, 10, 5)(Math.max(Math.abs(x), Math.abs(y)))
	}
}