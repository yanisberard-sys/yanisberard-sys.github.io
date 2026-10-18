// Mobile menu: the ☰ button shows or hides the section links on narrow screens.
(() => {
  const mast = document.querySelector('.mast'), btn = mast && mast.querySelector('.menu-btn');
  if (!btn) return;
  const set = open => { mast.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(!mast.classList.contains('open')));
  mast.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  document.addEventListener('click', e => { if (!mast.contains(e.target)) set(false); });
})();
