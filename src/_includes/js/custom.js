// © 2024 Laserfiche.
// See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.

(() => {
  const setThemeIcon = (theme) => {
    const toggleDarkMode = document.getElementById('theme-toggle');
    const svg = toggleDarkMode.querySelector('use');
    if (theme === 'dark') {
      svg.setAttribute('href', '#svg-sun');
    } else {
      svg.setAttribute('href', '#svg-moon');
    }
  }
  if (localStorage.getItem('color-scheme') === null) {
    const newColorScheme =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

    document.hidden;
    jtd.setTheme(newColorScheme);
    localStorage.setItem('color-scheme', newColorScheme);

    window.addEventListener('DOMContentLoaded', function () {
      setThemeIcon(newColorScheme);
    });
  } else {
    jtd.setTheme(localStorage.getItem('color-scheme'));
    window.addEventListener('DOMContentLoaded', function () {
      setThemeIcon(localStorage.getItem('color-scheme'));
    });
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (localStorage.getItem('color-scheme') === null) {
        const newColorScheme = event.matches ? 'dark' : 'light';
        jtd.setTheme(newColorScheme);
        setThemeIcon(newColorScheme);
        localStorage.setItem('color-scheme', newColorScheme);
      }
    });

  window.addEventListener('DOMContentLoaded', function () {
    const toggleDarkMode = document.getElementById('theme-toggle');
    jtd.addEvent(toggleDarkMode, 'click', function () {
      const newColorScheme = jtd.getTheme() !== 'dark' ? 'dark' : 'light';
      jtd.setTheme(newColorScheme);
      setThemeIcon(newColorScheme);
      localStorage.setItem('color-scheme', newColorScheme);
    });
  });
})(window.jtd);
