import { XYType } from '../common/types';

const FLOATING_POINT_TOLERANCE = 1e-10;

const equal = (a: XYType, b: XYType): boolean => {
  const xDiff: number = Math.abs(a[0] - b[0]);
  const yDiff: number = Math.abs(a[1] - b[1]);
  return xDiff < FLOATING_POINT_TOLERANCE && yDiff < FLOATING_POINT_TOLERANCE;
};

const magnitude = (a: XYType): number => {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
};

const add = function (a: XYType, b: XYType): XYType {
  return [a[0] + b[0], a[1] + b[1]];
};

const square = (c: XYType): XYType => {
  return [Math.pow(c[0], 2) - Math.pow(c[1], 2), 2.0 * c[0] * c[1]];
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

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: XYType): string {
  return `${round(c[0], 3)}${c[1] >= 0 ? '+' : ''}${round(c[1], 3)}i`;
}
