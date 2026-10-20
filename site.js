// Shared by every page: light/dark switch and the visit counter in the footer.
(() => {
  const root = document.documentElement, fr = root.lang === 'fr';
  const T = fr ? {dark: 'Passer en mode sombre', light: 'Passer en mode clair', visits: n => `${n} visites`}
               : {dark: 'Switch to dark mode', light: 'Switch to light mode', visits: n => `${n} visits`};

  /* ---------- theme ---------- */
  const sysDark = matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || (sysDark.matches ? 'dark' : 'light');
  const btn = document.querySelector('.theme-btn');
  const label = () => { if (btn) btn.setAttribute('aria-label', current() === 'dark' ? T.light : T.dark), btn.title = btn.getAttribute('aria-label'); };
  label();
  sysDark.addEventListener('change', label);
  if (btn) btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; try { localStorage.setItem('theme', next); } catch (e) {} label(); };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('vt-theme');
      document.startViewTransition(apply).finished.finally(() => root.classList.remove('vt-theme'));
    } else apply();
  });

  /* ---------- visit counter (GoatCounter: no cookies, no personal data) ---------- */
  const out = document.querySelector('.visits');
  if (out && location.hostname.endsWith('github.io')) {
    fetch('https://yanisberard.goatcounter.com/counter/TOTAL.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { if (d && d.count) { out.textContent = T.visits(String(d.count).replace(/[, ]/g, ' ')); out.hidden = false; } })
      .catch(() => {});
  }
})();
