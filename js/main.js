/* =========================================================
   LA CHOCOLATERÍA BY BELATE — interaction layer
   GSAP + ScrollTrigger + Lenis, with graceful fallbacks.
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  const isTouch = window.matchMedia('(hover: none)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     1. IMAGE SLOT FALLBACK
     Show the elegant labeled placeholder until a real photo
     exists at the referenced path.
  --------------------------------------------------------- */
  function wireMediaSlots() {
    $$('.media').forEach((fig) => {
      const video = fig.querySelector('video');
      const img = fig.querySelector('img');
      if (video) {
        // a video errors only if the file is missing; until then the poster paints
        video.addEventListener('error', () => fig.classList.add('is-empty'));
        const src = video.querySelector('source');
        if (src) src.addEventListener('error', () => fig.classList.add('is-empty'));
        return;
      }
      if (!img) { fig.classList.add('is-empty'); return; }
      const fail = () => fig.classList.add('is-empty');
      const ok = () => { img.naturalWidth > 1 ? fig.classList.remove('is-empty') : fail(); };
      if (img.complete) { img.naturalWidth > 1 ? ok() : fail(); }
      else { img.addEventListener('load', ok); img.addEventListener('error', fail); }
    });
  }

  /* ---------------------------------------------------------
     1b. VIDEO PLAY-ON-VISIBLE (performance + lazy)
  --------------------------------------------------------- */
  function initVideos() {
    if (reduceMotion) {
      // Respect the user: freeze every video on its poster frame
      $$('video.media__video').forEach((v) => { v.removeAttribute('autoplay'); v.autoplay = false; try { v.pause(); } catch (e) {} });
      return;
    }
    const vids = $$('video.media__video[data-lazy]');
    if (!('IntersectionObserver' in window)) {
      // No IO: just try to play them (still cheap because muted)
      if (!reduceMotion) vids.forEach((v) => v.play().catch(() => {}));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (!reduceMotion) { v.preload = 'auto'; v.play().catch(() => {}); }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    vids.forEach((v) => io.observe(v));
  }

  /* ---------------------------------------------------------
     2. LENIS SMOOTH SCROLL
  --------------------------------------------------------- */
  let lenis = null;
  function initLenis() {
    if (reduceMotion || !hasLenis) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------------------------------------------------------
     3. PRELOADER
  --------------------------------------------------------- */
  function runPreloader(done) {
    const pre = $('#preloader');
    if (!pre || reduceMotion) { if (pre) pre.style.display = 'none'; done(); return; }

    document.documentElement.style.overflow = 'hidden';
    const countEl = $('#plCount');
    const fill = $('.preloader__line-fill');
    const logo = $('.preloader__logo');
    if (logo) requestAnimationFrame(() => logo.classList.add('is-in'));

    // Run-once finisher + safety net: setTimeout fires even when the tab is
    // backgrounded (unlike rAF/GSAP ticker), so scroll is never left locked.
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      pre.classList.add('is-done');
      document.documentElement.style.overflow = '';
      done();
    };
    const safety = setTimeout(finish, 5000);
    const complete = () => { clearTimeout(safety); finish(); };

    const tl = hasGSAP ? gsap.timeline() : null;
    if (tl) {
      tl.to(fill, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.35)
        .to({ v: 0 }, {
          v: 100, duration: 1.7, ease: 'power2.inOut',
          onUpdate: function () { countEl.textContent = Math.round(this.targets()[0].v); }
        }, 0.35)
        .add(complete, '+=0.25');
    } else {
      // No GSAP: quick numeric count then reveal
      let v = 0;
      const id = setInterval(() => {
        v += 4; if (v > 100) v = 100;
        countEl.textContent = v; if (fill) fill.style.transform = `scaleX(${v / 100})`;
        if (v >= 100) { clearInterval(id); setTimeout(complete, 400); }
      }, 30);
    }
  }

  /* ---------------------------------------------------------
     4. HERO ENTRANCE
  --------------------------------------------------------- */
  function revealHero() {
    const lines = $$('.hero__title .word');
    const masks = $$('.hero .line-mask > span');
    if (reduceMotion || !hasGSAP) {
      [...lines, ...masks].forEach((el) => { el.style.transform = 'none'; el.style.opacity = '1'; });
      return;
    }
    gsap.set([...lines, ...masks], { yPercent: 110, opacity: 0 });
    // cinematic letterbox open of the hero video
    gsap.fromTo('.hero__media', { clipPath: 'inset(46% 0 46% 0)' },
      { clipPath: 'inset(0% 0 0% 0)', duration: 1.5, ease: 'expo.inOut' });
    const tl = gsap.timeline();
    tl.to(masks.filter((m) => m.closest('.hero__eyebrow')), { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out' }, 0)
      .to(lines, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.09 }, 0.1)
      .to(masks.filter((m) => m.closest('.hero__sub')), { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out' }, 0.5);

    // parallax on hero image
    if (hasST) {
      gsap.to('.hero__media video, .hero__media img', {
        yPercent: 12, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ---------------------------------------------------------
     5. GENERIC REVEALS (IntersectionObserver — robust)
  --------------------------------------------------------- */
  function initReveals() {
    const targets = $$([
      '.manifesto__foot', '.esp__head', '.tortas__content > *', '.catering__inner > *',
      '.ig__head > *', '.visita__head > *', '.visita__grid',
      '.footer__top', '.footer__cols', '.caja__intro'
    ].join(','));

    targets.forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.setAttribute('data-reveal-delay', String((i % 3) + 1));
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     5b. CINEMATIC MEDIA REVEALS (clip-path wipe + scale)
  --------------------------------------------------------- */
  function initCinematicReveals() {
    const targets = $$('.tortas__media, .catering__media, .ig__item, .visita__storefront, .visita__map');
    // Progressive enhancement: default media is fully visible; only clip when
    // motion is allowed and IO exists, then reveal on enter.
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    targets.forEach((el) => el.classList.add('reveal-media'));
    const reveal = (el) => el.classList.add('is-revealed');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));

    // Robustness: never leave media clipped if IO is throttled (hidden/headless
    // tab). Reveal anything already on screen now + on first visibility, and a
    // last-resort timer reveals the rest.
    const sweep = () => targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) { reveal(el); io.unobserve(el); }
    });
    window.addEventListener('load', sweep);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sweep(); });
    setTimeout(() => targets.forEach(reveal), 6000);
  }

  /* ---------------------------------------------------------
     5c. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  function initProgress() {
    const bar = $('#progress');
    if (!bar || reduceMotion) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    // native scroll fires even while Lenis drives it, so this stays in sync
    window.addEventListener('scroll', update, { passive: true });
    if (lenis) lenis.on('scroll', update);
    update();
  }

  /* ---------------------------------------------------------
     6. MANIFESTO WORD-BY-WORD BRIGHTEN
  --------------------------------------------------------- */
  function initManifesto() {
    const el = $('.reveal-words');
    if (!el) return;
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.innerHTML = text.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    const words = $$('.w', el);

    if (reduceMotion || !hasST) { words.forEach((w) => (w.style.opacity = '1')); return; }
    gsap.to(words, {
      opacity: 1, ease: 'none', stagger: 0.5,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: 0.6 }
    });
  }

  /* ---------------------------------------------------------
     7. ESPECIALIDADES — horizontal scroll
  --------------------------------------------------------- */
  function initHorizontal() {
    const pin = $('.esp__pin');
    const track = $('#espTrack');
    if (!pin || !track) return;
    if (reduceMotion || !hasST || isTouch) {
      // Native horizontal swipe fallback (the .is-native class turns the
      // max-content track into a real scroll container — see CSS).
      track.classList.add('is-native');
      const hint = $('.esp__hint'); if (hint) hint.textContent = 'Desliza →';
      return;
    }
    // distance the track must translate so its right edge (incl. padding) meets the viewport edge
    const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -getScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.especialidades',
        start: 'top top',
        end: () => '+=' + getScroll(),
        pin: pin,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  }

  /* ---------------------------------------------------------
     8. "LA CAJA" — signature compartment reveal
  --------------------------------------------------------- */
  function initCaja() {
    const sec = $('#caja');
    const lid = $('#cajaLid');
    const cells = $$('.caja .cell').sort((a, b) => (+a.style.getPropertyValue('--d')) - (+b.style.getPropertyValue('--d')));
    const titleLines = $$('.caja__title-line');
    if (!sec) return;

    if (reduceMotion || !hasST) {
      cells.forEach((c) => { c.style.transform = 'none'; c.style.opacity = '1'; });
      if (lid) lid.style.display = 'none';
      return;
    }

    gsap.set(cells, { scale: 0.6, y: 20, opacity: 0 });
    gsap.set(titleLines, { yPercent: 110, opacity: 0 });

    const box = $('#cajaBox');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: '+=160%',
        pin: '.caja__pin',
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => { if (box) box.classList.toggle('is-open', self.progress > 0.42); }
      }
    });

    tl.to(titleLines, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0)
      .to(lid, { rotateX: -118, y: '-8%', opacity: 0.15, duration: 1, ease: 'power3.inOut' }, 0.5)
      .to(cells, { scale: 1, y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.5)' }, 0.85);
  }

  /* ---------------------------------------------------------
     9. CUSTOM CURSOR
  --------------------------------------------------------- */
  function initCursor() {
    if (reduceMotion || isTouch || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const cursor = $('.cursor');
    const label = $('.cursor__label');
    if (!cursor) return;
    document.body.classList.add('cursor-ready');

    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    $$('a, button, [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        label.textContent = el.getAttribute('data-cursor') || '';
      });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('is-hover'); label.textContent = ''; });
    });
  }

  /* ---------------------------------------------------------
     10. MAGNETIC BUTTONS
  --------------------------------------------------------- */
  function initMagnetic() {
    if (reduceMotion || isTouch || !hasGSAP) return;
    $$('.magnetic').forEach((el) => {
      const strength = 0.4;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
    });
  }

  /* ---------------------------------------------------------
     11. MENU OVERLAY
  --------------------------------------------------------- */
  function initMenu() {
    const toggle = $('#menuToggle');
    const overlay = $('#overlay');
    const label = $('.menu-toggle__label');
    if (!toggle || !overlay) return;

    const setLabel = (open) => { if (label) label.textContent = open ? label.dataset.close : label.dataset.open; };
    const open = () => {
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.setAttribute('aria-hidden', 'false');
      setLabel(true);
      if (lenis) lenis.stop();
    };
    const close = () => {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      setLabel(false);
      if (lenis) lenis.start();
    };
    toggle.addEventListener('click', () => (document.body.classList.contains('menu-open') ? close() : open()));
    $$('.overlay__links a, .overlay__contact').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) close(); });
  }

  /* ---------------------------------------------------------
     12. SMOOTH ANCHOR SCROLL (Lenis-aware)
  --------------------------------------------------------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------------------------------------------------------
     13. NAV HIDE-ON-SCROLL-DOWN (subtle)
  --------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    let last = 0;
    const onScroll = (y) => {
      if (document.body.classList.contains('menu-open')) { nav.style.transform = 'none'; return; }
      if (y > last && y > 200) nav.style.transform = 'translateY(-110%)';
      else nav.style.transform = 'none';
      last = y;
    };
    nav.style.transition = 'transform .5s cubic-bezier(.6,.01,.05,1)';
    if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
    else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }

  /* ---------------------------------------------------------
     BOOT
  --------------------------------------------------------- */
  function boot() {
    document.getElementById('year').textContent = new Date().getFullYear();
    wireMediaSlots();
    initVideos();
    initLenis();
    initMenu();
    initAnchors();
    initCursor();
    initMagnetic();
    initNav();
    initProgress();

    runPreloader(() => {
      revealHero();
      initReveals();
      initCinematicReveals();
      initManifesto();
      initHorizontal();
      initCaja();
      if (hasST) ScrollTrigger.refresh();
    });

    // Refresh ScrollTrigger after fonts load (layout shift guard)
    if (document.fonts && hasST) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => { if (hasST) ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
