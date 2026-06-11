/* ════════════════════════════════════════════
   一吃一符 · Presentation Website
   Vanilla JS — No frameworks
   ════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────
   LOADER
────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const fill = loader.querySelector('.loader-fill');
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 14 + 5;
    if (p >= 100) { p = 100; clearInterval(tick); }
    if (fill) fill.style.width = p + '%';
  }, 70);
  document.body.style.overflow = 'hidden';
  const hide = () => {
    clearInterval(tick);
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
    }, 320);
  };
  if (document.readyState === 'complete') setTimeout(hide, 1700);
  else window.addEventListener('load', () => setTimeout(hide, 1700));
})();


/* ──────────────────────────────────
   SLIDE STATE
────────────────────────────────── */
const slides = Array.from(document.querySelectorAll('.slide'));
const TOTAL  = slides.length;
let current  = 0;

function setSlide(idx) {
  if (idx < 0 || idx >= TOTAL) return;
  current = idx;
  const s   = slides[idx];
  const num = s.dataset.num || String(idx + 1).padStart(2, '0');
  const ttl = s.dataset.title || '';

  const counter  = document.getElementById('slideCounter');
  const title    = document.getElementById('slideTitle');
  const progress = document.getElementById('headerProgress');
  if (counter)  counter.textContent  = num + ' / ' + String(TOTAL).padStart(2, '0');
  if (title)    title.textContent    = ttl;
  if (progress) progress.style.width = (TOTAL > 1 ? idx / (TOTAL - 1) * 100 : 0) + '%';

  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}


/* ──────────────────────────────────
   INTERSECTION OBSERVER — track current slide
────────────────────────────────── */
(function initSlideTracker() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        const idx = slides.indexOf(e.target);
        if (idx !== -1) setSlide(idx);
        e.target.classList.add('entered');
      }
    });
  }, { threshold: 0.5 });
  slides.forEach(s => obs.observe(s));
  setSlide(0);
})();


/* ──────────────────────────────────
   DOT NAV
────────────────────────────────── */
document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const t = document.getElementById(dot.dataset.target);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ──────────────────────────────────
   FULLSCREEN MENU
────────────────────────────────── */
(function initMenu() {
  const btn   = document.getElementById('menuBtn');
  const menu  = document.getElementById('fullMenu');
  const close = document.getElementById('menuClose');
  const open  = () => { menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); };
  const shut  = () => { menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };
  if (btn)   btn.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  menu.querySelectorAll('.fm-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      shut();
    });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();


/* ──────────────────────────────────
   KEYBOARD ARROW NAVIGATION
────────────────────────────────── */
document.addEventListener('keydown', e => {
  const menu = document.getElementById('fullMenu');
  if (menu.classList.contains('open')) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    const next = slides[Math.min(current + 1, TOTAL - 1)];
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    const prev = slides[Math.max(current - 1, 0)];
    if (prev) prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});


/* ──────────────────────────────────
   SMOOTH ANCHOR LINKS
────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ──────────────────────────────────
   SCROLL REVEAL  .reveal → .in
────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('in'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ──────────────────────────────────
   COUNTER ANIMATION
────────────────────────────────── */
(function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1500;
      const start  = performance.now();
      const step = now => {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(c => obs.observe(c));
})();


/* ──────────────────────────────────
   TOAST
────────────────────────────────── */
const BLESSINGS = {
  wealth:    { icon: '✦', title: '財運符', msg: '願你財源廣進，一吃一符。' },
  health:    { icon: '✿', title: '健康符', msg: '願你身體健康，百病不侵。' },
  love:      { icon: '♡', title: '愛情符', msg: '願你遇見良緣，愛情甜蜜。' },
  longevity: { icon: '◎', title: '長壽符', msg: '願你歲月靜好，長壽如意。' },
  relations: { icon: '❋', title: '人緣符', msg: '願你貴人相助，廣結善緣。' },
  career:    { icon: '▲', title: '事業符', msg: '願你事業有成，步步高升。' },
};
let toastTimer;
function showToast(key) {
  const d = BLESSINGS[key]; if (!d) return;
  document.getElementById('toastIcon').textContent  = d.icon;
  document.getElementById('toastTitle').textContent = d.title;
  document.getElementById('toastMsg').textContent   = d.msg;
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ──────────────────────────────────
   S05 BLESSING BUTTONS
────────────────────────────────── */
document.querySelectorAll('.bles-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bles-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    showToast(btn.dataset.blessing);
  });
});


/* ──────────────────────────────────
   S07 PRODUCT PICKER
────────────────────────────────── */
document.querySelectorAll('.prod-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.prod-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    showToast(btn.dataset.blessing);
  });
});


/* ──────────────────────────────────
   S13 VIDEO PLAY
────────────────────────────────── */
(function initVideo() {
  const area = document.getElementById('videoPlayArea');
  if (!area) return;
  const play = () => {
    const icon = document.getElementById('toastIcon');
    const ttl  = document.getElementById('toastTitle');
    const msg  = document.getElementById('toastMsg');
    if (icon) icon.textContent = '▶';
    if (ttl)  ttl.textContent  = '見證影片';
    if (msg)  msg.textContent  = '「有些力量來自肌肉，有些力量來自相信。」';
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
    }
  };
  area.addEventListener('click', play);
  area.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
})();
