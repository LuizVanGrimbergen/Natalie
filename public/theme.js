// Loaded blocking in <head> on every page, so the chosen theme is there before first paint.
// Dark is the default; the navbar's switch stores 'light' or 'dark' (scripts/theme.ts).
(function () {
  var root = document.documentElement;
  // Scripts run: the navbar shows its light/dark switch (html.js).
  root.classList.add('js');
  var theme = 'dark';
  try {
    theme = localStorage.getItem('theme') || 'dark';
  } catch (e) {}
  if (theme !== 'light') return;
  root.setAttribute('data-theme', 'light');
  // Pages that are light in the light theme (data-tint-light) color Safari's bars at once.
  var light = root.getAttribute('data-tint-light');
  if (light) {
    root.style.setProperty('--tint', light);
    root.setAttribute('data-surface', 'light');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light);
  }
})();
