import { Simulation } from "../lib/Simulation.js";
import { SquareWell } from "./particles/SquareWell.js";

const sim = new Simulation();

window.SquareWell = SquareWell;
window.sim = sim;