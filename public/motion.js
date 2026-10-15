// Loaded blocking in <head> on the story page, so html.motion is set before first paint.
// Motion is opt-in: without JS or with reduced motion the page stays a plain, readable flow.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion');
  // Safety net: if the scene script never arrives, fall back to the static composition.
  setTimeout(function () {
    if (!window.__scenesReady) document.documentElement.classList.remove('motion');
  }, 6000);
}
