import { MAX_DEPTH, project, type Point, type View } from './geometry';
import { faceFill, faceSeam, hingeStroke } from './shade';

export interface FoldState extends View {
  /** 0–1, the net appearing from the centre rhombus outward. */
  appear: number;
}

/** Draws the folding dome on a canvas; render() is called by the scene's timeline on every update. */
export function foldCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let width = 0;
  let height = 0;
  let last: FoldState | null = null;

  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (last) render(last);
  }

  function render(state: FoldState) {
    last = state;
    const size = Math.min(width, height);
    const at = ([x, y]: Point): Point => [width / 2 + x * size, height / 2 + y * size];
    const { faces, hinges } = project(state);
    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (const face of faces) {
      // Faces nearer the centre of the net appear first.
      const alpha = Math.min(1, Math.max(0, (state.appear * 1.6 - (face.depth / MAX_DEPTH) * 0.6) / 0.4));
      if (!alpha) continue;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      face.points.map(at).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = faceFill(face);
      ctx.fill();
      ctx.strokeStyle = faceSeam(face);
      ctx.lineWidth = Math.max(1, size / 360);
      ctx.stroke();
    }
    ctx.globalAlpha = state.appear;
    for (const hinge of hinges) {
      ctx.strokeStyle = hingeStroke(hinge);
      ctx.lineWidth = hinge.outside ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(...at(hinge.from));
      ctx.lineTo(...at(hinge.to));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  return render;
}
