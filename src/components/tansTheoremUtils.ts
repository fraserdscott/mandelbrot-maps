export function magnitude(p: [number, number]): number {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

const distance = (a: [number, number], b: [number, number]) => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

const add = function (a: [number, number], b: [number, number]): [number, number] {
  return [a[0] + b[0], a[1] + b[1]];
};

const sub = function (a: [number, number], b: [number, number]): [number, number] {
  return [a[0] - b[0], a[1] - b[1]];
};

const mult = function (a: [number, number], b: [number, number]): [number, number] {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
};

const divide = function (x: [number, number], y: [number, number]): [number, number] {
  const d = Math.pow(y[0], 2) + Math.pow(y[1], 2);
  return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d];
};

const square = (c: [number, number]): [number, number] => {
  return [Math.pow(c[0], 2) - Math.pow(c[1], 2), 2.0 * c[0] * c[1]];
};

export function complexNumbersEqual(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export const orbit = function (
  z: [number, number],
  c: [number, number],
  t: number,
): [number, number] {
  for (let i = 0; i < t; i++) {
    z = add(square(z), c);
  }
  return z;
};

/**
 * Take the derivative of f sub c with respect to z
 *
 * @param z - The point we're taking the derivative w.r.t
 * @param c - The fixed constant +c of iteration
 * @param t - How many iterations to go for
 * @returns The derivative of W at c
 */
const orbitDerivative = function (
  z: [number, number],
  c: [number, number],
  t: number,
): [number, number] {
  let der: [number, number] = [1, 0];
  for (let i = 0; i < t; i++) {
    der = [2 * mult(der, z)[0], 2 * mult(der, z)[1]];
    z = add(square(z), c);
  }

  return der;
};

/**
 * Find the preperiod of a given point under iteration.
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: 0, otherwise: -1.
 */
export const prePeriod = (c: [number, number]) => {
  let z: [number, number] = [0, 0];
  const olds: [number, number][] = [];
  for (let i = -1; i < 100; i++) {
    olds.push(z);
    const newZ: [number, number] = add(square(z), c);
    if (olds.find((elem) => distance(elem, newZ) < 0.01)) {
      // we've hit a cycle
      return i;
    }
    z = newZ;
  }
  return -1;
};

/**
 * Find the period of a given point under iteration.
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: 0, otherwise: -1.
 */
export const period = (c: [number, number]) => {
  let z: [number, number] = [0, 0];
  const olds: [number, number][] = [];
  for (let i = -1; i < 100; i++) {
    olds.push(z);
    const newZ: [number, number] = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < 0.01);
    if (similar !== -1) {
      // we've hit a cycle
      return i - similar + 2;
    }
    z = newZ;
  }
  return -1;
};

/**
 * Subtract the end of a cycle from the start.
 *
 * @param c - The point we care about. Must be periodic or preperiodic
 * @param z - The preperiod of c
 * @param l - The period of c
 * @returns The derivative of W at c
 */
const W = function (c: [number, number], l: number, p: number) {
  const endOfCycle = orbit([0, 0], c, 1 + l + p);
  const startOfCycle = orbit([0, 0], c, 1 + l);

  return sub(endOfCycle, startOfCycle);
};

/**
 * Finds the numerical derivative of the function W.
 *
 * @param c - The point we are taking the derivative of
 * @param l - The preperiod of c
 * @param p - The period of c
 * @returns The derivative of W at c
 */
const findWPrime = function (
  c: [number, number],
  l: number,
  p: number,
): [number, number] {
  const h = 1e-8;
  const withoutH = W(c, l, p);
  const withH = W([c[0] + h, c[1]], l, p);

  return [sub(withH, withoutH)[0] / h, sub(withH, withoutH)[1] / h];
};

/**
 * Find (1/the size) of a branch in a given Julia set.
 *
 * This is given by looking at the rate of change around z -
 * how different is the behaviour of nearby points under iteration?
 *
 * In this sense, the larger the rate of change, the smaller the branch is.
 *
 * @param c - The point that defines the Julia set
 * @param z - The point at the centre of the branch
 * @param l - The preperiod of z
 * @returns The size of the branch
 */
export const findA = function (
  c: [number, number],
  z: [number, number],
  l: number,
): [number, number] {
  return orbitDerivative(z, c, l);
};

/**
 * Find (1/the size) of a branch in the Mandelbrot set.
 *
 * This is given by looking at the rate of change around c -
 * how different is the behaviour of nearby points under iteration?
 *
 * In this sense, the larger the rate of change, the smaller the branch is.
 *
 * @param c - The point at the centre of the branch
 * @param l - The preperiod of c
 * @param p - The period of z
 * @returns The size of the branch
 */
export const findU = function (
  c: [number, number],
  l: number,
  p: number,
): [number, number] {
  return divide(findWPrime(c, l, p), sub(orbitDerivative(orbit(c, c, l), c, p), [1, 0]));
};

export function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: [number, number]): string {
  return `${round(c[0], 2)}${c[1] >= 0 ? '+' : ''}${round(c[1], 2)}i`;
}

const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
export function formatMisiurewiczName(c: [number, number]): string {
  let pre = `M${prePeriod(c).toString()},${period(c)}`;
  for (let i = 0; i < 10; i++) {
    pre = pre.replaceAll(i.toString(), subscripts[i]);
  }
  return pre;
}

export function formatAngle(angle: number): string {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}
