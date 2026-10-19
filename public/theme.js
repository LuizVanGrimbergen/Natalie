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
  // Every page starts with a photo (dark in both themes), so the bar color doesn't change here;
  // the story re-tints per scene (scripts/scenes/tint.ts).
  if (theme === 'light') root.setAttribute('data-theme', 'light');
})();
