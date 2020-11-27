import { XYType } from '../common/types';

export function magnitude(p: XYType): number {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

const distance = (a: XYType, b: XYType) => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

const add = function (a: XYType, b: XYType): XYType {
  return [a[0] + b[0], a[1] + b[1]];
};

const sub = function (a: XYType, b: XYType): XYType {
  return [a[0] - b[0], a[1] - b[1]];
};

const mult = function (a: XYType, b: XYType): XYType {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
};

const divide = function (x: XYType, y: XYType): XYType {
  const d = Math.pow(y[0], 2) + Math.pow(y[1], 2);
  return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d];
};

const square = (c: XYType): XYType => {
  return [Math.pow(c[0], 2) - Math.pow(c[1], 2), 2.0 * c[0] * c[1]];
};

const sqrt = (c: XYType): XYType => {
  const theta = Math.atan2(c[1], c[0]);
  const r2 = Math.sqrt(magnitude(c));
  return [r2 * Math.cos(theta / 2), r2 * Math.sin(theta / 2)];
};

export function complexNumbersEqual(a: XYType, b: XYType): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export const backwardsOrbit = function (z: XYType, c: XYType, t: number): XYType {
  for (let i = 0; i < t; i++) {
    z = sqrt(sub(z, c));
  }
  return z;
};

export const backwardsOrbitNeg = function (z: XYType, c: XYType, t: number): XYType {
  for (let i = 0; i < t; i++) {
    z = [-sqrt(sub(z, c))[0], -sqrt(sub(z, c))[1]];
  }
  return z;
};

export const orbit = function (z: XYType, c: XYType, t: number): XYType {
  for (let i = 0; i < t; i++) {
    z = add(square(z), c);
  }
  return z;
};

/**
 * Take the derivative of f sub c with respect to z
 *
 * This value depends not on z per se., but the orbit of z.
 *
 * @param z - The point we're taking the derivative w.r.t
 * @param c - The fixed constant +c of iteration
 * @param t - How many iterations to go for
 * @returns The derivative of W at c
 */
const orbitEigenvalue = function (z: XYType, c: XYType, t: number): XYType {
  let der: XYType = [1, 0];
  for (let i = 0; i < t; i++) {
    der = mult([2, 0], mult(der, z));
    z = add(square(z), c);
  }

  return der;
};

/**
 * Find the preperiod of a given point under iteration. This assumes it is preperiodic
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: nonsense, otherwise: -1.
 */
export const prePeriod = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < 0.001);
    if (similar !== -1) return similar;

    z = newZ;
  }
  return -1;
};

/**
 * Find the period of a given point under iteration.
 *
 * @param c - The point
 * @returns The period, otherwise: -1.
 */
export const period = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [];
  for (let i = 1; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < 0.01);
    if (similar !== -1) {
      // we've hit a cycle
      return i - similar;
    }
    z = newZ;
  }
  return -1;
};

/**
 * Subtract the first iterate in a cycle from the last.
 *
 * @param c - The point we care about. Must be periodic or preperiodic
 * @param z - The preperiod of c
 * @param l - The period of c
 * @returns The derivative of W at c
 */
const W = function (c: XYType, l: number, p: number) {
  const endOfCycle = orbit(c, c, l + p);
  const startOfCycle = orbit(c, c, l);

  return sub(endOfCycle, startOfCycle);
};

/**
 * Finds the numerical derivative of a function.
 *
 * @param c - The point we are taking the derivative of
 * @returns The derivative of f at c
 */
const numericalDerivative = function (c: XYType, f: (c: XYType) => XYType): XYType {
  const h = 1e-9;
  const withoutH = f(c);
  const withH = f(add(c, [h, 0]));

  return [sub(withH, withoutH)[0] / h, sub(withH, withoutH)[1] / h];
};

/**
 *
 * @param c - The point at the centre of the branch
 * @param l - The preperiod of c
 * @param p - The period of z
 * @returns The size of the branch
 */
export const magnificationRotationMandelbrot = function (
  c: XYType,
  l: number,
  p: number,
): XYType {
  const firstIterateInCycle: XYType = orbit(c, c, l);
  const cycleEigenvalue: XYType = orbitEigenvalue(firstIterateInCycle, c, p);

  return divide(
    numericalDerivative(c, (x: XYType) => W(x, l, p)),
    sub(cycleEigenvalue, [1, 0]),
  );
};

/**
 *
 * @param c - The point that defines the Julia set
 * @param z - The point at the centre of the branch
 * @param l - The preperiod of z
 * @returns The size of the branch
 */
export const magnificationRotationJulia = function (
  c: XYType,
  z: XYType,
  prePeriod: number,
): XYType {
  return orbitEigenvalue(z, c, prePeriod);
};

export function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: XYType): string {
  return `${round(c[0], 3)}${c[1] >= 0 ? '+' : ''}${round(c[1], 3)}i`;
}

export function formatAngle(angle: number): string {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}

function findPotentialPreperiod(c: XYType): number {
  let z: XYType = c;
  let minNumber = 4;
  let minp = -1;
  for (let i = 0; i < 50; i++) {
    const newZ: XYType = add(square(z), c);
    const x = sub(newZ, z);
    if (magnitude(x) < minNumber) {
      minNumber = magnitude(x);
      minp = i;
    }
    z = newZ;
  }
  return minp;
}

const Wfried = function (c: XYType, l: number, p: number) {
  const endOfCycle = orbitEigenvalue(c, c, l + p);
  const startOfCycle = orbitEigenvalue(c, c, l);

  return sub(endOfCycle, startOfCycle);
};

export const findMisiurewicz = function (c: XYType): XYType {
  const q = findPotentialPreperiod(c);
  const p = 1;
  for (let i = 0; i < 1000; i++) {
    const F = W(c, q, p);
    const Fdash = Wfried(c, q, p);
    c = sub(c, mult([0.01, 0], divide(F, Fdash)));
  }
  return c;
};
