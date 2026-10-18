/*
 * The dome's shape: a rhombic triacontahedron (30 rhombi), folded from one flat net.
 * Vertex and face data from Paul Bourke, https://paulbourke.net/geometry/Rhombic_triacontahedron/
 * The net (a spanning tree over the faces) is our own, checked for overlap.
 * Pure math, no DOM: used by the canvas in the browser and by Shape.astro at build time.
 */

type Vec = [number, number, number];
type Mat = [Vec, Vec, Vec];
export type Point = [number, number];

const PHI = (1 + Math.sqrt(5)) / 2;
// Bourke's coordinates use 2 and 3 as shorthand for 1/φ and φ.
const decode = (c: number) => (Math.abs(c) === 2 ? Math.sign(c) / PHI : Math.abs(c) === 3 ? Math.sign(c) * PHI : c);
const RAW = [
  [-1, 0, 3], [-1, 1, 1], [0, 2, 3], [0, -2, 3], [-1, -1, 1], [3, 1, 0], [1, 1, 1], [0, 3, 1], [1, 0, 3], [3, 0, 2], [1, -1, 1],
  [0, -3, 1], [-3, 0, 2], [-3, 1, 0], [-2, 3, 0], [2, 3, 0], [3, -1, 0], [2, -3, 0], [3, 0, -2], [0, -3, -1], [-2, -3, 0],
  [-3, -1, 0], [-3, 0, -2], [-1, -1, -1], [1, -1, -1], [0, -2, -3], [-1, 0, -3], [1, 0, -3], [1, 1, -1], [0, 2, -3], [-1, 1, -1],
  [0, 3, -1],
];
const V = RAW.map((v) => v.map(decode) as Vec);
export const FACES = [
  [0, 2, 8, 3], [25, 26, 29, 27], [2, 7, 6, 8], [3, 8, 10, 11], [0, 1, 7, 2], [27, 28, 31, 29], [0, 3, 11, 4], [19, 24, 27, 25],
  [26, 29, 31, 30], [5, 6, 7, 15], [10, 11, 17, 16], [5, 15, 31, 28], [1, 7, 14, 13], [4, 11, 20, 21], [13, 14, 31, 30],
  [16, 17, 19, 24], [19, 20, 21, 23], [5, 6, 8, 9], [0, 1, 13, 12], [19, 23, 26, 25], [8, 9, 16, 10], [5, 18, 27, 28],
  [0, 4, 21, 12], [13, 22, 26, 30], [16, 18, 27, 24], [21, 22, 26, 23], [7, 14, 31, 15], [11, 17, 19, 20], [5, 9, 16, 18],
  [12, 13, 22, 21],
];
/** Child face → the face it hangs from in the flat net. */
const PARENT: Record<number, number> = {
  2: 0, 3: 0, 6: 0, 4: 0, 20: 3, 10: 3, 22: 6, 13: 6, 9: 2, 17: 2, 15: 10, 27: 10, 7: 15, 24: 15, 29: 22, 18: 22, 19: 7, 1: 7,
  23: 29, 25: 29, 28: 20, 16: 13, 11: 9, 26: 9, 21: 24, 5: 11, 14: 23, 8: 23, 12: 14,
};
const ROOT = 0;

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec): Vec => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};
const mv = (m: Mat, v: Vec): Vec => [dot(m[0], v), dot(m[1], v), dot(m[2], v)];
const mm = (a: Mat, b: Mat): Mat => a.map((r) => [0, 1, 2].map((j) => r[0] * b[0][j] + r[1] * b[1][j] + r[2] * b[2][j])) as Mat;
const IDENTITY: Mat = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
function rotation(axis: Vec, angle: number): Mat {
  const [x, y, z] = norm(axis);
  const c = Math.cos(angle), s = Math.sin(angle), C = 1 - c;
  return [
    [c + x * x * C, x * y * C - z * s, x * z * C + y * s],
    [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
    [z * x * C - y * s, z * y * C + x * s, c + z * z * C],
  ];
}

const NORMALS = FACES.map((f) => norm([0, 1, 2].map((k) => f.reduce((s, i) => s + V[i][k], 0)) as Vec));
const edgeKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
function sharedEdge(i: number, j: number): [number, number] {
  const edges = new Set(FACES[i].map((v, k) => edgeKey(v, FACES[i][(k + 1) % 4])));
  for (let k = 0; k < 4; k++) {
    const a = FACES[j][k], b = FACES[j][(k + 1) % 4];
    if (edges.has(edgeKey(a, b))) return [a, b];
  }
  throw new Error(`faces ${i} and ${j} share no edge`);
}

// Breadth-first order from the root, so every parent is placed before its children.
const children = FACES.map(() => [] as number[]);
for (const [c, p] of Object.entries(PARENT)) children[p].push(+c);
const ORDER = [ROOT];
const DEPTH: number[] = [];
DEPTH[ROOT] = 0;
for (let i = 0; i < ORDER.length; i++) for (const c of children[ORDER[i]]) (DEPTH[c] = DEPTH[ORDER[i]] + 1), ORDER.push(c);
export const MAX_DEPTH = Math.max(...DEPTH);
/** Per child: the hinge vertices and the angle that lays it flat into its parent's plane. */
const HINGES = ORDER.slice(1).map((c) => {
  const p = PARENT[c];
  const [a, b] = sharedEdge(c, p);
  const axis = norm(sub(V[b], V[a]));
  const angle = Math.atan2(dot(axis, cross(NORMALS[c], NORMALS[p])), dot(NORMALS[c], NORMALS[p]));
  return { c, p, a, b, axis, angle, ia: FACES[c].indexOf(a), ib: FACES[c].indexOf(b) };
});

// The root face turned towards the viewer.
const TOWARDS: Mat = (() => {
  const n = NORMALS[ROOT], t: Vec = [0, 0, 1];
  const axis = cross(n, t);
  if (Math.hypot(...axis) < 1e-9) return dot(n, t) > 0 ? IDENTITY : rotation([1, 0, 0], Math.PI);
  return rotation(cross(n, t), Math.acos(Math.max(-1, Math.min(1, dot(n, t)))));
})();

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
/** How far ahead the folds near the centre run of those at the ends. */
const STAGGER = 0.55;

export interface Face {
  index: number;
  depth: number;
  points: Point[];
  /** Facing the viewer with its outer side. */
  outside: boolean;
  /** 0–1, how much it faces the light. */
  light: number;
  z: number;
}
export interface Hinge {
  from: Point;
  to: Point;
  /** 0–1, how much this fold is moving right now (peaks halfway). */
  active: number;
  outside: boolean;
}
export interface View {
  /** 0 = flat net, 1 = closed dome. */
  fold: number;
  /** Rotation about the vertical axis, in radians. */
  turn: number;
  /** Tilt towards the viewer, in radians. */
  tilt: number;
}

const LIGHT = norm([-0.35, 0.55, 0.76]);

/**
 * Faces (back to front) and hinges in screen units: centred on 0, y down,
 * sized so the shape fits a square of side 1 (the closed dome fills ~0.9).
 */
export function project({ fold, turn, tilt }: View): { faces: Face[]; hinges: Hinge[] } {
  // Each fold runs its own part of the whole, the ones nearest the centre first.
  const open = 1 - fold;
  const place: { R: Mat; t: Vec; e: number }[] = [];
  place[ROOT] = { R: IDENTITY, t: [0, 0, 0], e: 0 };
  for (const h of HINGES) {
    const local = Math.min(1, Math.max(0, open * (1 + STAGGER) - STAGGER * (1 - (DEPTH[h.c] - 1) / Math.max(1, MAX_DEPTH - 1))));
    const e = easeInOut(local);
    const R = rotation(h.axis, e * h.angle);
    const t = sub(V[h.a], mv(R, V[h.a]));
    const P = place[h.p];
    place[h.c] = { R: mm(P.R, R), t: add(mv(P.R, t), P.t), e };
  }

  const cy = Math.cos(turn), sy = Math.sin(turn), cx = Math.cos(tilt), sx = Math.sin(tilt);
  const view = (p: Vec): Vec => {
    const x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
    return [x, p[1] * cx - z * sx, p[1] * sx + z * cx];
  };
  const world = FACES.map((f, k) => f.map((i) => mv(TOWARDS, add(mv(place[k].R, V[i]), place[k].t))));
  const all = world.flat();
  const centre = [0, 1, 2].map((j) => all.reduce((s, p) => s + p[j], 0) / all.length) as Vec;
  const viewed = world.map((poly) => poly.map((p) => view(sub(p, centre))));
  const radius = Math.max(1.95, ...viewed.flat().map((p) => Math.hypot(...p)));
  const scale = 0.46 / radius;
  const toScreen = (p: Vec): Point => {
    const k = 12 / (12 - p[2] / (radius / 1.95));
    return [p[0] * scale * k, -p[1] * scale * k];
  };

  const screen = viewed.map((poly) => poly.map(toScreen));
  const faces = viewed
    .map((poly, k): Face => {
      const n = view(mv(TOWARDS, mv(place[k].R, NORMALS[k])));
      return {
        index: k,
        depth: DEPTH[k],
        points: screen[k],
        outside: n[2] > 0,
        light: Math.abs(dot(n, LIGHT)),
        z: poly.reduce((s, p) => s + p[2], 0) / 4,
      };
    })
    .sort((a, b) => a.z - b.z);
  const facing = new Map(faces.map((f) => [f.index, f.outside]));
  const hinges = HINGES.map(
    (h): Hinge => ({
      from: screen[h.c][h.ia],
      to: screen[h.c][h.ib],
      active: 1 - Math.abs(place[h.c].e - 0.5) * 2,
      outside: facing.get(h.c)!,
    }),
  );
  return { faces, hinges };
}
