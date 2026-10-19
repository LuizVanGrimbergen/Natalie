// Loaded blocking in <head> on every page, so the chosen theme is there before first paint.
// Light is the default; the navbar's switch stores 'light' or 'dark' (scripts/theme.ts).
(function () {
  var root = document.documentElement;
  // Scripts run: the navbar shows its light/dark switch (html.js).
  root.classList.add('js');
  var theme = 'light';
  try {
    theme = localStorage.getItem('theme') || 'light';
  } catch (e) {}
  // Safari's bars follow the theme from the first paint (every page starts with a photo whose
  // edges are flat wood, or ivory in the light theme); the story then re-tints per scene
  // (scripts/scenes/tint.ts), scripts/theme.ts does the same on the switch.
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    var tint = root.getAttribute('data-tint-light');
    root.style.setProperty('--tint', tint);
    root.setAttribute('data-surface', 'light');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', tint);
  }
})();
