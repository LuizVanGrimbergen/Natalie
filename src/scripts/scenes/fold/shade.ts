import type { Face, Hinge } from './geometry';

/* Colors of the folding dome, after the real one in hero.avif: copper panels lit
   warm from one side, the inner sides dark, aluminium seams. */

export function faceFill(face: Face) {
  const l = face.light;
  return face.outside ? `hsl(${20 + l * 4} ${44 + l * 12}% ${18 + l * 26}%)` : `hsl(20 30% ${6 + l * 8}%)`;
}

export function faceSeam(face: Face) {
  return face.outside ? 'rgb(167 173 176 / 0.75)' : 'rgb(167 173 176 / 0.25)';
}

/** Copper-300 hinge, glowing only while its fold is moving. */
export function hingeStroke(hinge: Hinge) {
  return `rgb(212 154 114 / ${0.9 * hinge.active * (hinge.outside ? 1 : 0.35)})`;
}
