export const one = (root: ParentNode, selector: string) => root.querySelector<HTMLElement>(selector)!;
export const all = (root: ParentNode, selector: string) => root.querySelectorAll<HTMLElement>(selector);
export const path = (root: ParentNode, selector: string) => root.querySelector<SVGGeometryElement>(selector)!;

/** Elements of one build step, marked with data-reveal="n" in the markup. */
export const reveal = (scene: HTMLElement, step: number) => all(scene, `[data-reveal="${step}"]`);
