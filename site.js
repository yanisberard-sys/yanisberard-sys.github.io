// Shared by every page: light/dark switch and the visit counter in the footer.
(() => {
  const root = document.documentElement, fr = root.lang === 'fr';
  const T = fr ? {dark: 'Passer en mode sombre', light: 'Passer en mode clair', visits: n => `${n} visites`, copy: 'Copier l’adresse', copied: 'Copié'}
               : {dark: 'Switch to dark mode', light: 'Switch to light mode', visits: n => `${n} visits`, copy: 'Copy address', copied: 'Copied'};

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

  /* ---------- "last updated": month of the last deploy, read from the server ---------- */
  const up = document.querySelector('.updated');
  if (up && location.protocol.startsWith('http')) {
    fetch(location.href, {method: 'HEAD', cache: 'no-store'})
      .then(r => { const h = r.headers.get('last-modified'), d = h && new Date(h); if (d && !isNaN(d)) up.textContent = (fr ? 'Mis à jour en ' : 'Last updated ') + d.toLocaleDateString(fr ? 'fr-FR' : 'en-GB', {month: 'long', year: 'numeric'}); })
      .catch(() => {});
  }

  /* ---------- copy the email address (footer) ---------- */
  const copyBtn = document.getElementById('copy'), mail = document.getElementById('mail');
  if (copyBtn && mail) copyBtn.addEventListener('click', () => {
    const done = () => { copyBtn.textContent = T.copied; setTimeout(() => copyBtn.textContent = T.copy, 1800); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(mail); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(mail.textContent).then(done, fallback); } catch (e) { fallback(); }
  });

  /* ---------- scroll reveal: blocks below the fold fade in (not the photo gallery) ---------- */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pending'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(el => { if (!el.closest('.gallery') && el.getBoundingClientRect().top > innerHeight) { el.classList.add('pending'); io.observe(el); } });
  }
})();
