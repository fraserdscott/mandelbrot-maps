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

export function complexNumbersEqual(a: XYType, b: XYType): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

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

export const periodEigenvalue = function (z: XYType, c: XYType, period: number): XYType {
  return orbitEigenvalue(z, c, period);
};

/**
 * Find the preperiod of a given point under iteration. This assumes it is preperiodic
 *
 * @param c - The point
 * @returns `If `it's preperiodic: the preperiod, if it's periodic: 0, otherwise: -1.
 */
export const prePeriod = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [[0, 0]];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => distance(elem, newZ) < 0.005);
    if (similar !== -1) {
      // we've hit a cycle
      return similar;
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
 * Subtract the end of a cycle from the start.
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
 * @returns The derivative of W at c
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
  return divide(
    numericalDerivative(c, function (x: XYType) {
      return W(x, l, p);
    }),
    sub(periodEigenvalue(orbit(c, c, l), c, p), [1, 0]),
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
  return `${round(c[0], 2)}${c[1] >= 0 ? '+' : ''}${round(c[1], 2)}i`;
}

export function formatAngle(angle: number): string {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}
