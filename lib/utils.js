export const derivative = (f, h = 0.001) => x => (f(x + h) - f(x - h)) / (2 * h);

export const fixedpoint = (x, h = 0.001) => Math.round(x / h) * h;

export const ljPotential = (n, m, eps, sig) => r => (4 * eps * sig ** n / r ** n) - (4 * eps * sig ** m / r ** m);