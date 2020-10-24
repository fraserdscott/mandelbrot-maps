export function magnitude(p: [number, number]) {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

const distance = (a: [number, number], b: [number, number]) => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

const orbit = function (
  z: [number, number],
  c: [number, number],
  t: number,
): [number, number] {
  for (let i = 0; i < t; i++) {
    z = add(square(z), c);
  }
  return z;
};

const derivOrbit = function (
  z: [number, number],
  c: [number, number],
  t: number,
): [number, number] {
  let der: [number, number] = [1, 0];
  for (let i = 0; i < t; i++) {
    const new_z: [number, number] = add(square(z), c);
    const new_der: [number, number] = [
      2 * (der[0] * z[0] - der[1] * z[1]),
      2 * (der[0] * z[1] + der[1] * z[0]),
    ];
    z = new_z;
    der = new_der;
  }

  return der;
};

const add = function (a: [number, number], b: [number, number]): [number, number] {
  return [a[0] + b[0], a[1] + b[1]];
};

const sub = function (a: [number, number], b: [number, number]): [number, number] {
  return [a[0] - b[0], a[1] - b[1]];
};

const divide = function (x: [number, number], y: [number, number]): [number, number] {
  const d = Math.pow(y[0], 2) + Math.pow(y[1], 2);
  return [(x[0] * y[0] + x[1] * y[1]) / d, (x[1] * y[0] - x[0] * y[1]) / d];
};

const square = (c: [number, number]): [number, number] => {
  return [Math.pow(c[0], 2) - Math.pow(c[1], 2), 2.0 * c[0] * c[1]];
};

export function complexNumbersEqual(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

const findWPrime = function (
  c: [number, number],
  l: number,
  p: number,
): [number, number] {
  const h = 1e-8;
  let h1 = orbit([0, 0], [c[0] + h, c[1]], l + 1 + p);
  let h2 = orbit([0, 0], [c[0] + h, c[1]], l + 1);
  const eps = sub(h1, h2);
  h1 = orbit([0, 0], c, l + 1 + p);
  h2 = orbit([0, 0], c, l + 1);
  const tru = sub(h1, h2);

  return [sub(eps, tru)[0] / h, sub(eps, tru)[1] / h];
};

export const prePeriod = (c: [number, number]) => {
  let z: [number, number] = [0, 0];
  for (let i = 0; i < 100; i++) {
    const newZ: [number, number] = add(square(z), c);
    if (distance(z, newZ) < Math.pow(10, -2)) {
      return i - 1;
    }
    z = newZ;
  }
  return -1;
};

export const findA = function (c: [number, number], l: number): [number, number] {
  return derivOrbit(c, c, l);
};

export const findU = function (
  c: [number, number],
  l: number,
  p: number,
): [number, number] {
  return divide(findWPrime(c, l, p), sub(derivOrbit(orbit(c, c, l), c, p), [1, 0]));
};

export const magnificationMandelbrot = function (c: [number, number]): number {
  const u: [number, number] = findU(c, prePeriod(c), 1);
  return magnitude(u);
};

export const magnificationJulia = function (c: [number, number]): number {
  const a: [number, number] = findA(c, prePeriod(c));
  return magnitude(a);
};

export const rotationMandelbrot = function (c: [number, number]): number {
  const u: [number, number] = findU(c, prePeriod(c), 1);
  return -Math.atan2(u[1], u[0]);
};

export const rotationJulia = function (c: [number, number]): number {
  const a: [number, number] = findA(c, prePeriod(c));
  return -Math.atan2(a[1], a[0]);
};

export function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatComplexNumber(c: [number, number]) {
  return `${round(c[0], 2)}${c[1] >= 0 ? '+' : ''}${round(c[1], 2)}j`;
}

export function formatMisiurewiczName(c: [number, number]) {
  return `M${prePeriod(c)},${1}`;
}

export function formatAngle(angle: number) {
  return `${round((180 / Math.PI) * angle, 0)}°`;
}
