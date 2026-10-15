// Loaded blocking in <head> on the story page, so the classes are set before first paint.
// Motion is opt-in: without JS or with reduced motion the page stays a plain, readable flow.
//   html.motion        — scenes animate
//   html.motion.paged  — touch screens: one swipe per screen instead of one long scroll
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var root = document.documentElement;
  root.classList.add('motion');
  if (matchMedia('(hover: none) and (pointer: coarse)').matches) root.classList.add('paged');
  // Safety net: if the scene script never arrives, fall back to the static composition.
  setTimeout(function () {
    if (!window.__scenesReady) root.classList.remove('motion', 'paged');
  }, 6000);
}
