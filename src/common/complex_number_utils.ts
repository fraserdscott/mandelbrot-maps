import { XYType } from '../common/types';

const FLOATING_POINT_TOLERANCE = 1e-17;

const equal = (a: XYType, b: XYType): boolean => {
  const xDiff: number = Math.abs(a[0] - b[0]);
  const yDiff: number = Math.abs(a[1] - b[1]);
  return xDiff < FLOATING_POINT_TOLERANCE && yDiff < FLOATING_POINT_TOLERANCE;
};

const add = function (a: XYType, b: XYType): XYType {
  return [a[0] + b[0], a[1] + b[1]];
};

const square = (c: XYType): XYType => {
  return [Math.pow(c[0], 2) - Math.pow(c[1], 2), 2.0 * c[0] * c[1]];
};

export const forwardOrbit = function (
  z: XYType,
  c: XYType,
  maxIterations: number,
): [orbit: XYType[], prePeriod: number, period: number] {
  const orbit: XYType[] = [];
  for (let i = 0; i < maxIterations; i++) {
    // eslint-disable-next-line no-loop-func
    const similar = orbit.findIndex((elem) => equal(elem, z));
    if (similar !== -1) {
      return [orbit, similar, i - similar];
    }
    orbit.push(z);
    z = add(square(z), c);
  }
  return [orbit, -1, -1];
};

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: XYType): string {
  return `${round(c[0], 3)}${c[1] >= 0 ? '+' : ''}${round(c[1], 3)}i`;
}
