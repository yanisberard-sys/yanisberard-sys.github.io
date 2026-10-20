// Photography page: map filter and full-screen viewer (zoom from the thumbnail, swipe, counter).
(() => {
  const fr = document.documentElement.lang === 'fr';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const figs = [...document.querySelectorAll('.gallery figure')];
  const vt = fn => (document.startViewTransition && !reduce) ? document.startViewTransition(fn) : fn();

  /* ---------- map filter ---------- */
  let place = '';
  const chips = [...document.querySelectorAll('.chip')], dots = [...document.querySelectorAll('.dot')];
  const setPlace = p => {
    place = p === place ? '' : p;
    vt(() => {
      figs.forEach(f => { f.hidden = !!place && f.dataset.place !== place; f.classList.remove('pending'); });
      chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.place === place)));
      dots.forEach(d => { d.classList.toggle('active', d.dataset.place === place); d.setAttribute('aria-pressed', String(d.dataset.place === place)); });
      document.querySelector('.atlas').classList.toggle('filtered', !!place);
    });
  };
  chips.forEach(c => c.addEventListener('click', () => setPlace(c.dataset.place)));
  dots.forEach(d => {
    d.addEventListener('click', () => setPlace(d.dataset.place));
    d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlace(d.dataset.place); } });
  });
  // hovering a chip lights its dot, and the reverse
  const hl = (p, on) => { dots.forEach(d => d.classList.toggle('hot', on && d.dataset.place === p)); chips.forEach(c => c.classList.toggle('hot', on && c.dataset.place === p)); };
  [...chips, ...dots].forEach(el => { el.addEventListener('pointerenter', () => hl(el.dataset.place, true)); el.addEventListener('pointerleave', () => hl(el.dataset.place, false)); });

  /* ---------- viewer ---------- */
  const lb = document.getElementById('lb'), stage = lb.querySelector('.lb-stage'), img = document.getElementById('lb-img');
  const bg = lb.querySelector('.lb-bg img'), cap = document.getElementById('lb-cap'), count = lb.querySelector('.lb-count');
  const visible = () => figs.filter(f => !f.hidden);
  let cur = null;
  const thumb = f => f.querySelector('img');
  const fill = f => {
    cur = f; const t = thumb(f), list = visible();
    img.src = t.currentSrc || t.src; img.alt = t.alt; bg.src = img.src;
    cap.textContent = f.querySelector('figcaption').textContent;
    count.textContent = `${list.indexOf(f) + 1} / ${list.length}`;
    history.replaceState(null, '', '#' + f.id);
    const i = list.indexOf(f); [list[i - 1], list[i + 1]].forEach(n => { if (n) new Image().src = thumb(n).src; });
  };
  const rectOf = el => el.getBoundingClientRect();
  const flip = (from, to) => {
    const s = from.width / to.width;
    return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${s})`;
  };
  const open = async f => {
    fill(f);
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    document.documentElement.classList.add('lb-open');
    try { await img.decode(); } catch (e) {}
    if (reduce) return;
    const a = rectOf(thumb(f)), b = rectOf(img);
    img.animate([{transform: flip(a, b), transformOrigin: '0 0'}, {transform: 'none', transformOrigin: '0 0'}], {duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)'});
    lb.animate([{backgroundColor: 'rgba(10,11,14,0)'}, {backgroundColor: 'rgba(10,11,14,.92)'}], {duration: 360, easing: 'ease-out'});
    lb.querySelectorAll('.lb-bg, .lb-bar, .lb-side').forEach(el => el.animate([{opacity: 0}, {opacity: 1}], {duration: 420, delay: 120, fill: 'backwards'}));
  };
  const close = async () => {
    if (!lb.open) return;
    const t = cur && thumb(cur), a = t && rectOf(t);
    if (!reduce && a && a.bottom > 0 && a.top < innerHeight) {
      const b = rectOf(img);
      lb.querySelectorAll('.lb-bg, .lb-bar, .lb-side').forEach(el => el.animate([{opacity: 1}, {opacity: 0}], {duration: 200, fill: 'forwards'}));
      lb.animate([{backgroundColor: 'rgba(10,11,14,.92)'}, {backgroundColor: 'rgba(10,11,14,0)'}], {duration: 360, fill: 'forwards'});
      await img.animate([{transform: 'none', transformOrigin: '0 0'}, {transform: flip(a, b), transformOrigin: '0 0'}], {duration: 380, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards'}).finished.catch(() => {});
    }
    lb.close(); lb.getAnimations({subtree: true}).forEach(an => an.cancel());
    document.documentElement.classList.remove('lb-open');
    history.replaceState(null, '', location.pathname);
  };
  const go = async (dir, fromDrag = 0) => {
    const list = visible(); if (list.length < 2) return snap();
    const next = list[(list.indexOf(cur) + dir + list.length) % list.length];
    if (!reduce) await img.animate([{transform: `translateX(${fromDrag}px)`, opacity: 1}, {transform: `translateX(${-dir * 90}px)`, opacity: 0}], {duration: 170, easing: 'ease-in', fill: 'forwards'}).finished.catch(() => {});
    fill(next);
    try { await img.decode(); } catch (e) {}
    img.getAnimations().forEach(an => an.cancel());
    if (!reduce) img.animate([{transform: `translateX(${dir * 90}px)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)'});
  };
  const snap = () => { img.style.transform = ''; img.style.opacity = ''; };

  figs.forEach(f => f.querySelector('button').addEventListener('click', () => open(f)));
  lb.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); go(+b.dataset.go); }));
  document.getElementById('lb-close').addEventListener('click', close);
  lb.addEventListener('cancel', e => { e.preventDefault(); close(); });
  addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });

  // swipe (finger, pen, or mouse drag); a plain tap on the dark area closes
  let x0 = null, y0 = 0, dx = 0, moved = false;
  stage.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => {
    if (x0 === null) return; dx = e.clientX - x0;
    if (Math.abs(dx) > 6) moved = true;
    if (moved) { img.style.transform = `translateX(${dx}px)`; img.style.opacity = String(1 - Math.min(.6, Math.abs(dx) / 600)); }
  });
  const end = e => {
    if (x0 === null) return;
    const wasDrag = moved, d = dx, onImg = e.target === img; x0 = null;
    if (wasDrag && Math.abs(d) > 60) { snap(); go(d < 0 ? 1 : -1, d); }
    else if (wasDrag) { img.animate([{transform: `translateX(${d}px)`}, {transform: 'none'}], {duration: 220, easing: 'ease-out'}); snap(); }
    else if (!onImg && Math.abs(e.clientY - y0) < 6) close();
  };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', () => { x0 = null; snap(); });

  // deep link: photography.html#p7 opens that photograph
  const h = location.hash.match(/^#p(\d+)$/);
  if (h) { const f = document.getElementById('p' + h[1]); if (f) requestAnimationFrame(() => open(f)); }
  void fr;
})();
