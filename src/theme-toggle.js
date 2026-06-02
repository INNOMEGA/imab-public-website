(function () {
  var storageKey = 'theme';
  var root = document.documentElement;
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function readStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function getPreferredTheme() {
    var storedTheme = readStoredTheme();
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return media.matches ? 'dark' : 'light';
  }

  function updateToggleUI(isDark) {
    toggles.forEach(function (toggle) {
      toggle.setAttribute('aria-pressed', String(isDark));
      var label = toggle.querySelector('[data-theme-label]');
      var icon = toggle.querySelector('[data-theme-icon]');
      if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
      if (icon) icon.textContent = isDark ? '☀' : '◐';
    });
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    updateToggleUI(isDark);
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the in-memory theme applied.
    }
  }

  applyTheme(getPreferredTheme());

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
      storeTheme(nextTheme);
      applyTheme(nextTheme);
    });
  });

  if (media.addEventListener) {
    media.addEventListener('change', function (event) {
      var storedTheme = readStoredTheme();
      if (storedTheme === 'light' || storedTheme === 'dark') return;
      applyTheme(event.matches ? 'dark' : 'light');
    });
  }
})();
