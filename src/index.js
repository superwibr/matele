import { Renderer } from "../lib/Renderer.js";
import { Simulation } from "../lib/Simulation.js";
import { SquareLJP } from "./particles/SquareLJP.js";
import { SquareWell } from "./particles/SquareWell.js";

const sim = new Simulation();

const canvas = document.querySelector("canvas");
const ren = new Renderer(sim, canvas, {
	gravity(v) {
		return v > 0 ? [v, 0, 0] : [0, 0, Math.abs(v*5)];
	}
});

ren.start();

window.SquareWell = SquareWell;
window.SquareLJP = SquareLJP;
window.sim = sim;
window.ren = ren;