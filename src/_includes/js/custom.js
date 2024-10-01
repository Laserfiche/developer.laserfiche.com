// © 2024 Laserfiche.
// See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.

(() => {
  const setThemeIcon = (theme) => {
    const toggleDarkMode = document.getElementById('theme-toggle');
    const svg = toggleDarkMode.querySelector('use');
    if (theme === 'dark') {
      svg.setAttribute('href', '#svg-sun');
      toggleDarkMode.setAttribute('title', 'Light mode');
    } else {
      svg.setAttribute('href', '#svg-moon');
      toggleDarkMode.setAttribute('title', 'Dark mode');
    }
  };

  const setThemeAndIcon = (theme) => {
    if (theme === null) {
      theme =
        window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }
    jtd.setTheme(theme);
    setThemeIcon(theme);
    localStorage.setItem('color-scheme', theme);
  };

  jtd.onReady(function (event) {
    var theme = localStorage.getItem('color-scheme');
    setThemeAndIcon(theme);

    const toggleDarkMode = document.getElementById('theme-toggle');
    jtd.addEvent(toggleDarkMode, 'click', function () {
      const newColorScheme = jtd.getTheme() !== 'dark' ? 'dark' : 'light';
      setThemeAndIcon(newColorScheme);
    });
  });

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (localStorage.getItem('color-scheme') === null) {
        const newColorScheme = event.matches ? 'dark' : 'light';
        setThemeAndIcon(newColorScheme);
      }
    });

})(window.jtd);
