import { XYType } from '../common/types';

export const MAX_DEPTH = 4;

const FLOATING_POINT_TOLERANCE = 1e-10;
const MAX_PREPERIOD = 1000;

const equal = (a: XYType, b: XYType): boolean => {
  const d = sub(a, b);
  const dx: number = Math.abs(d[0]);
  const dy: number = Math.abs(d[1]);
  return dx < FLOATING_POINT_TOLERANCE && dy < FLOATING_POINT_TOLERANCE;
};

function magnitude(p: XYType): number {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

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

const preImagePositive = function (z: XYType, c: XYType): XYType {
  return sqrt(sub(z, c));
};

const preImageNegative = function (z: XYType, c: XYType): XYType {
  return mult([-1, 0], preImagePositive(z, c));
};

const orbit = function (z: XYType, c: XYType, t: number): XYType {
  for (let i = 0; i < t; i++) {
    z = add(square(z), c);
  }
  return z;
};

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
const prePeriod = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => equal(elem, newZ));
    if (similar !== -1) return similar;

    z = newZ;
  }
  return -1;
};

/**
 * Find the period of a given point.
 *
 * @param z - The point
 * @param c - The constant of iteration
 * @returns The period, otherwise: -1.
 */
const period = (z: XYType, c: XYType): number => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => equal(elem, newZ));
    if (similar !== -1) {
      // we've hit a cycle
      return i - similar + 1;
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

const cycleEigenvalue = (c: XYType, l: number, p: number): XYType => {
  const firstIterateInCycle: XYType = orbit(c, c, l);
  return orbitEigenvalue(firstIterateInCycle, c, p);
};

/**
 *
 * @param c - The point at the centre of the branch
 * @param l - The preperiod of c
 * @param p - The period of z
 * @returns The size of the branch
 */
const magnificationRotationMandelbrot = function (
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
 * the point where zero enters a cycle
 *
 * @param c - The point
 * @returns If it's preperiodic: the preperiod, if it's periodic: nonsense, otherwise: -1.
 */
const getAlpha = (z: XYType, c: XYType): XYType => {
  const olds: XYType[] = [];
  for (let i = 0; i < 50; i++) {
    olds.push(z);
    const newZ: XYType = add(square(z), c);
    const similar = olds.findIndex((elem) => equal(elem, newZ));
    if (similar !== -1) return newZ;

    z = newZ;
  }
  return [-7, -7];
};

const reachAlpha = function (c: XYType, z: XYType): number {
  const alpha = getAlpha([0, 0], c);
  for (let i = 0; i < 50; i++) {
    if (equal(alpha, z)) return i;
    z = add(square(z), c);
  }
  return -1;
};

const magnificationRotationJulia = function (c: XYType, z: XYType, q: number): XYType {
  return orbitEigenvalue(z, c, reachAlpha(c, z));
};

export function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: XYType, precision = 3): string {
  return `${round(c[0], precision)}${c[1] >= 0 ? '+' : ''}${round(c[1], precision)}i`;
}

export function formatAngle(angle: number): string {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}

function findPotentialPreperiod(c: XYType): number {
  let z: XYType = c;
  let minDistance = 4;
  let minPreperiod = -1;
  for (let i = 0; i < MAX_PREPERIOD; i++) {
    const newZ: XYType = add(square(z), c);
    const distance = magnitude(sub(newZ, z));
    if (distance < minDistance) {
      minDistance = distance;
      minPreperiod = i;
    }
    z = newZ;
  }
  return minPreperiod;
}

const Wfried = function (c: XYType, l: number, p: number) {
  const endOfCycle = orbitEigenvalue(c, c, l + p);
  const startOfCycle = orbitEigenvalue(c, c, l);

  return sub(endOfCycle, startOfCycle);
};

export const findNearestMisiurewiczPoint = function (
  c: XYType,
  iterations: number,
): XYType {
  const q = findPotentialPreperiod(c);
  if (q === -1) {
    return [0, 0];
  }
  const p = 1;
  const learningRate: XYType = [0.01, 0];
  for (let i = 0; i < iterations; i++) {
    const F = W(c, q, p);
    const Fdash = Wfried(c, q, p);
    c = sub(c, mult(learningRate, divide(F, Fdash)));
  }
  return c;
};

const depthFirstSearch = (z: XYType, c: XYType, zs: XYType[], depth: number) => {
  zs.push(z);
  if (equal(z, c) && depth > 0) {
    depthFirstSearch(preImagePositive(z, c), c, zs, depth - 1);
    depthFirstSearch(preImageNegative(z, c), c, zs, depth - 1);
  }
  return zs;
};

export const similarPoints = (c: PreperiodicPoint, depth: number): PreperiodicPoint[] => {
  const zs: XYType[] = [];

  let z = orbit(c.point, c.point, c.prePeriod);
  for (let i = 0; i < c.period; i++) {
    zs.push(z);
    depthFirstSearch(mult([-1, 0], z), c.point, zs, depth);
    z = add(square(z), c.point);
  }
  return zs.map((p) => new PreperiodicPoint(c.point, p, true));
};

const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
export class PreperiodicPoint {
  point: XYType;
  prePeriod: number;
  period: number;
  factor: XYType;
  factorAngle: number;
  factorMagnitude: number;
  selfSimilarityFactor: XYType;
  selfSimilarityFactorMagnitude: number;
  selfSimilarityFactorAngle: number;

  constructor(c: XYType, z: XYType, julia: boolean) {
    this.point = z;

    this.prePeriod = prePeriod(this.point, c);
    this.period = period(this.point, c);

    this.factor = magnificationRotationMandelbrot(c, this.prePeriod, this.period);
    if (julia) this.factor = magnificationRotationJulia(c, this.point, this.prePeriod);

    this.factorMagnitude = magnitude(this.factor);
    this.factorAngle = Math.atan2(this.factor[1], this.factor[0]);

    this.selfSimilarityFactor = cycleEigenvalue(this.point, this.prePeriod, this.period);
    this.selfSimilarityFactorMagnitude = magnitude(this.selfSimilarityFactor);
    this.selfSimilarityFactorAngle = Math.atan2(
      this.selfSimilarityFactor[1],
      this.selfSimilarityFactor[0],
    );
  }

  toString(): string {
    let pre = `M${this.prePeriod},${this.period}`;
    for (let i = 0; i < 10; i++) {
      pre = pre.replaceAll(i.toString(), subscripts[i]);
    }
    return pre;
  }
}

/**
 * Check if a point is within a given "bounding" box.
 *
 * @param {p} A point.
 * @param {boxCentre} The centre of the box.
 * @param {boxWidth} The width of the box.
 * @param {boxHeight} The height of the box.
 * @param {boxAngle} The angle the box makes with the x-axis.
 */
export const withinBoundingBox = (
  p: XYType,
  boxCentre: XYType,
  boxWidth: number,
  boxHeight: number,
  boxAngle: number,
): boolean => {
  const dx = p[0] - boxCentre[0];
  const dy = p[1] - boxCentre[1];

  const horizontalDistance: number = Math.abs(
    dx * Math.cos(boxAngle) - dy * Math.sin(boxAngle),
  );
  const verticalDistance: number = Math.abs(
    dx * Math.sin(boxAngle) + dy * Math.cos(boxAngle),
  );

  return horizontalDistance < boxWidth && verticalDistance < boxHeight;
};

export enum OrbitFlag {
  Divergent,
  Cyclic,
  Acyclic,
}

export const forwardOrbit = function (
  z: XYType,
  c: XYType,
  maxIterations: number,
): [orbit: XYType[], prePeriod: number, period: number, flag: OrbitFlag] {
  const orbit: XYType[] = [];
  let preperiod = maxIterations;
  let period = 0;
  let flag = OrbitFlag.Acyclic;
  for (let i = 0; i < maxIterations; i++) {
    // eslint-disable-next-line no-loop-func
    orbit.push(z);
    z = add(square(z), c);
    if (magnitude(z) >= 2) {
      preperiod = i;
      flag = OrbitFlag.Divergent;
    }
  }
  if (flag === OrbitFlag.Divergent) {
    return [orbit, preperiod, -1, flag];
  }

  [preperiod, period] = brent(orbit, maxIterations);
  if (preperiod === -1) {
    return [orbit.slice(0, preperiod + period), -1, -1, OrbitFlag.Acyclic];
  }
  return [orbit.slice(0, preperiod + period), preperiod, period, OrbitFlag.Cyclic];
};

/**
 * This is a Brent's algorithm implementation for cycle detection.
 * https://en.wikipedia.org/wiki/Cycle_detection#Brent's_algorithm
 *
 * @param array which contains cycles
 * @param length array length
 * @return length of the cycle
 */
const brent = (array: XYType[], length: number): [number, number] => {
  // Search successive powers of two
  let power_of_two = 1;
  let period = 1; // Length of the cycle

  let tortoise_pos = 0;
  let hare_pos = 1;

  let tortoise = array[tortoise_pos];
  let hare = array[hare_pos];

  while (!equal(tortoise, hare) && tortoise_pos < length) {
    // Time to start a new power of two?
    if (power_of_two === period) {
      // Move tortoise forward to hare pos
      tortoise_pos = hare_pos;
      tortoise = array[tortoise_pos];

      power_of_two *= 2;
      period = 0;
    }

    // Move hare 1 step forward the hare
    hare_pos++;
    hare = array[hare_pos];
    if (!hare) {
      return [-1, -1];
    }

    period += 1;
  }

  return equal(tortoise, hare) ? [tortoise_pos, period] : [-1, -1];
};
