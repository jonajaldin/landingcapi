/* ══════════════════════════════════════════════════════════════════════
   CAPI — main.js
   Patrón IIFE clásico (sin módulos ES, sin imports, sin npm).
   Cada init va envuelto en safe() para que un fallo no tumbe el resto.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────
     ⚙️  CONFIGURACIÓN — LO ÚNICO QUE NECESITÁS TOCAR
     ────────────────────────────────────────────────────────────────
     Cambiá DESTINO por el link de la plataforma.
     Se aplica automáticamente a TODOS los botones azules de la página.
     (En el HTML ya está puesto el mismo link como respaldo, por si el
      JS no llega a ejecutarse.)
  */
  var CONFIG = {
    DESTINO: 'https://capiwara.com/',
    NUEVA_PESTANA: true          // true = abre en pestaña nueva
  };
  window.__CAPI__ = CONFIG;

  /* ── util ─────────────────────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); } catch (e) {
      if (window.console && console.warn) console.warn('[CAPI] ' + name + ':', e);
    }
  }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  var reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}
  // Ojo: NO usamos reducedMotion para apagar microinteracciones (Windows lo
  // trae activado por defecto en muchos equipos). Sólo para el canvas.

  /* ── 1 · Splash ───────────────────────────────────────────────── */
  function initSplash() {
    var splash = $('#splash');
    if (!splash) return;
    var out = function () { splash.classList.add('is-out'); };
    // Se va cuando carga todo…
    window.addEventListener('load', function () { setTimeout(out, 380); });
    // …y pase lo que pase, a los 2.8s (además de la animación CSS de respaldo)
    setTimeout(out, 2800);
    setTimeout(function () { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 6000);
  }

  /* ── 2 · CTA: un solo link para todos los botones ─────────────── */
  function initCta() {
    var url = String(CONFIG.DESTINO || '').trim();
    var valid = /^https?:\/\/\S+$/i.test(url);
    $$('[data-cta]').forEach(function (a) {
      if (valid) {
        a.setAttribute('href', url);
        if (CONFIG.NUEVA_PESTANA) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        } else {
          a.removeAttribute('target');
        }
      }
      // pequeño feedback táctil
      a.addEventListener('pointerdown', function () {
        a.style.transform = 'translateY(-1px) scale(.985)';
      });
      a.addEventListener('pointerup', function () { a.style.transform = ''; });
      a.addEventListener('pointerleave', function () { a.style.transform = ''; });
    });
    if (!valid && window.console) {
      console.warn('[CAPI] Poné tu link en CONFIG.DESTINO (main.js). Se usa el href del HTML.');
    }
  }

  /* ── 3 · Reveal on scroll ─────────────────────────────────────── */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    var showAll = function () {
      items.forEach(function (el) { el.classList.add('is-in'); });
    };

    if (!('IntersectionObserver' in window)) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        // escalonado suave dentro de cada bloque
        var sibs = el.parentNode ? $$('.reveal', el.parentNode) : [el];
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 5) * 90 : 0) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.03, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });

    // Red de seguridad: a los 6s nada puede seguir oculto
    setTimeout(showAll, 6000);
  }

  /* ── 4 · Nav sticky ───────────────────────────────────────────── */
  function initNav() {
    var nav = $('#nav');
    var sticky = $('#stickyCta');
    if (!nav) return;
    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        nav.classList.toggle('is-stuck', y > 40);
        if (sticky) sticky.classList.toggle('is-on', y > window.innerHeight * 0.7);
        tick = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 5 · Anchors con scroll nativo ────────────────────────────── */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        var top = t.getBoundingClientRect().top + (window.pageYOffset || 0) - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── 6 · Parallax suave ───────────────────────────────────────── */
  function initParallax() {
    var els = $$('[data-parallax]');
    if (!els.length || window.innerWidth < 760) return;
    var tick = false;
    function run() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        els.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var k = parseFloat(el.getAttribute('data-parallax')) || 0.05;
          var mid = r.top + r.height / 2 - vh / 2;
          el.style.setProperty('--py', (-mid * k).toFixed(1) + 'px');
          el.style.translate = '0 ' + (-mid * k).toFixed(1) + 'px';
        });
        tick = false;
      });
    }
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run);
    run();
  }

  /* ── 7 · Contadores ───────────────────────────────────────────── */
  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    function animate(el) {
      if (el.dataset.done === '1') return;   // idempotente
      el.dataset.done = '1';
      var end = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400, t0 = null;
      function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animate); return;
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.05 });
    nums.forEach(function (n) { io.observe(n); });
    setTimeout(function () { nums.forEach(animate); }, 6000);
  }

  /* ── 8 · Tilt en tarjetas (sólo puntero fino) ─────────────────── */
  function initTilt() {
    var fine = false;
    try { fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) {}
    if (!fine) return;

    $$('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' +
          (x * 6).toFixed(2) + 'deg) translateY(-5px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ── 9 · Ticker infinito (duplica el contenido una sola vez) ──── */
  function initTicker() {
    var track = $('#ticker');
    if (!track || track.dataset.cloned === '1') return;
    track.dataset.cloned = '1';
    track.innerHTML = track.innerHTML + track.innerHTML;
  }

  /* ── 10 · Chispas doradas (canvas ligero) ─────────────────────── */
  function initSparks() {
    var cv = $('#sparks');
    if (!cv || reducedMotion) return;
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], raf = null, running = true;

    function resize() {
      var r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var n = w < 700 ? 26 : w < 1200 ? 44 : 62;
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.9 + 0.5,
          vy: -(Math.random() * 0.22 + 0.06),
          vx: (Math.random() - 0.5) * 0.16,
          a: Math.random() * 0.55 + 0.15,
          p: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy; p.x += p.vx; p.p += 0.02;
        if (p.y < -12) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -12) p.x = w + 10;
        if (p.x > w + 12) p.x = -10;
        var tw = p.a * (0.6 + 0.4 * Math.sin(p.p));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,214,110,' + tw.toFixed(3) + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(resize, 180);
    });

    // pausa cuando el hero sale de pantalla (ahorra batería)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          running = e.isIntersecting;
          if (running && !raf) draw();
          if (!running && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.02 }).observe(cv);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else { running = true; if (!raf) draw(); }
    });
  }

  /* ── 11 · Imágenes opcionales: si faltan, la escena sigue viva ── */
  function initImageFallbacks() {
    [['.capi', '.hero-figure'], ['.capi-2', '.showcase-figure']].forEach(function (pair) {
      var img = $(pair[0]);
      var box = $(pair[1]);
      if (!img || !box) return;
      var fail = function () { box.classList.add('no-img'); };
      if (img.complete && img.naturalWidth === 0) fail();
      img.addEventListener('error', fail);
    });
  }

  /* ── 12 · Año del footer ──────────────────────────────────────── */
  function initYear() {
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ── Arranque ─────────────────────────────────────────────────── */
  function boot() {
    safe(initSplash, 'splash');
    safe(initImageFallbacks, 'imagenes');
    safe(initCta, 'cta');
    safe(initReveal, 'reveal');
    safe(initNav, 'nav');
    safe(initAnchors, 'anchors');
    safe(initParallax, 'parallax');
    safe(initCounters, 'counters');
    safe(initTilt, 'tilt');
    safe(initTicker, 'ticker');
    safe(initSparks, 'sparks');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
