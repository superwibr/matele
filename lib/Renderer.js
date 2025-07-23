import { Simulation } from "./Simulation.js";

export class Renderer {
    /**
     * @param {Simulation} simulation
     * @param {HTMLCanvasElement} canvas
     * @param {Object} map An object of field names paired with a 
     *                     function that returns an rgb value for a given input number 
     */
    constructor(simulation, canvas, map) {
        this.sim = simulation;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.map = map;

        // Precompute half dimensions
        this.halfw = canvas.width / 2;
        this.halfh = canvas.height / 2;

        // Reuse image data buffer
        this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
        this.data = this.imageData.data;

        // Precompute samplers
        this.samplers = Object.entries(this.map).map(([name, fn]) => {
            return (x, y) => fn(this.sim.read(name, [x, y]));
        });
    }

    draw() {
        const { width, height } = this.canvas;
        const { data, halfw, halfh, samplers } = this;

        let i = 0;

        for (let y = 0; y < height; y++) {
            const worldY = y - halfh;

            for (let x = 0; x < width; x++) {
                const worldX = x - halfw;

                let r = 0, g = 0, b = 0;

                for (const sample of samplers) {
                    const [sr, sg, sb] = sample(worldX, worldY);
                    r += sr;
                    g += sg;
                    b += sb;
                }

                // Clamp to 0-255
                r = Math.min(255, Math.max(0, r));
                g = Math.min(255, Math.max(0, g));
                b = Math.min(255, Math.max(0, b));

                data[i++] = r;
                data[i++] = g;
                data[i++] = b;
                data[i++] = 255; // Alpha
            }
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }

    /** @type {number?} */
    iid = null;

    start() {
        console.log(`Rendering ${this.canvas.width * this.canvas.height * (1000 / this.sim.urate)} values per second`);

        this.stop();
        const loop = () => {
            this.draw();
            this.iid = requestAnimationFrame(loop);
        };
        this.iid = requestAnimationFrame(loop);
    }

    stop() {
        if (this.iid !== null) {
            cancelAnimationFrame(this.iid);
            this.iid = null;
        }
    }
}