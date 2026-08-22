/* ══════════════════════════════════════════════════════════════════════
   CAPIWARA.COM — main.js
   Landing de una sola pantalla. IIFE clásico, sin módulos ES, sin npm.
   Cada init dentro de safe(): si uno falla, los demás siguen.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────
     ⚙️  LO ÚNICO QUE TENÉS QUE TOCAR
     Cambiá DESTINO y se aplica a TODOS los botones de la página.
     (El mismo link está en el HTML como respaldo por si el JS no corre.)
     ──────────────────────────────────────────────────────────────── */
  var CONFIG = {
    DESTINO: 'https://capiwara.com/',
    NUEVA_PESTANA: true
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

  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var fine = false;
  try { fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) {}

  /* ── 1 · CTA ──────────────────────────────────────────────────── */
  function initCta() {
    var url = String(CONFIG.DESTINO || '').trim();
    var ok = /^https?:\/\/\S+$/i.test(url);
    $$('[data-cta]').forEach(function (a) {
      if (ok) {
        a.setAttribute('href', url);
        if (CONFIG.NUEVA_PESTANA) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        } else {
          a.removeAttribute('target');
        }
      }
    });
    if (!ok && window.console) {
      console.warn('[CAPI] Poné tu link en CONFIG.DESTINO (main.js). Se usa el del HTML.');
    }
  }

  /* ── 2 · Tickers infinitos (duplican su contenido una sola vez) ── */
  function initTickers() {
    $$('[data-ticker]').forEach(function (t) {
      if (t.dataset.cloned === '1') return;      // idempotente
      t.dataset.cloned = '1';
      t.innerHTML = t.innerHTML + t.innerHTML;
    });
  }

  /* ── 3 · Confeti dorado ───────────────────────────────────────── */
  function initConfetti() {
    var box = $('.confetti');
    if (!box || reduced) return;
    if (box.children.length > 0) return;         // idempotente

    var colores = ['#f3c543', '#ffe9ae', '#a2700c', '#f3c543', '#48a4ff'];
    var n = window.innerWidth < 760 ? 14 : 26;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      var w = 5 + Math.random() * 6;
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.width = w.toFixed(1) + 'px';
      s.style.height = (w * (1.2 + Math.random())).toFixed(1) + 'px';
      s.style.background = colores[(Math.random() * colores.length) | 0];
      s.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
      s.style.animationDuration = (7 + Math.random() * 9).toFixed(1) + 's';
      s.style.animationDelay = (-Math.random() * 14).toFixed(1) + 's';
      frag.appendChild(s);
    }
    box.appendChild(frag);
  }

  /* ── 4 · Chispas doradas (canvas) ─────────────────────────────── */
  function initSparks() {
    var cv = $('#fx');
    if (!cv || reduced) return;
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], raf = null, on = true;

    function resize() {
      var r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var n = w < 700 ? 30 : w < 1200 ? 55 : 80;
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.1 + 0.4,
          vy: -(Math.random() * 0.3 + 0.07),
          vx: (Math.random() - 0.5) * 0.2,
          a: Math.random() * 0.6 + 0.18,
          p: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      if (!on) { raf = null; return; }
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy; p.x += p.vx; p.p += 0.025;
        if (p.y < -14) { p.y = h + 12; p.x = Math.random() * w; }
        if (p.x < -14) p.x = w + 12;
        if (p.x > w + 14) p.x = -12;
        var tw = p.a * (0.55 + 0.45 * Math.sin(p.p));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,214,120,' + tw.toFixed(3) + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(resize, 200);
    });

    document.addEventListener('visibilitychange', function () {
      on = !document.hidden;
      if (on && !raf) draw();
    });
  }

  /* ── 5 · Parallax con el mouse (sólo puntero fino) ────────────── */
  function initMouseParallax() {
    if (!fine || reduced) return;
    var layers = $$('[data-depth]');
    if (!layers.length) return;

    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 8;
        el.style.translate = (cx * d).toFixed(2) + 'px ' + (cy * d).toFixed(2) + 'px';
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ── 6 · Imágenes opcionales ──────────────────────────────────────
     Cada [data-img] que no cargue marca su contenedor [data-box] con
     .no-img y el CSS muestra la alternativa. La página nunca se rompe
     por una imagen que falta.                                        */
  function initImageFallback() {
    $$('[data-img]').forEach(function (img) {
      var box = img.closest ? img.closest('[data-box]') : null;
      if (!box) return;
      var fail = function () { box.classList.add('no-img'); };
      if (img.complete && img.naturalWidth === 0) fail();
      img.addEventListener('error', fail);
    });
  }

  /* ── 7 · Bloquear cualquier scroll accidental ─────────────────── */
  function initNoScroll() {
    // La página es de una sola pantalla: si algo empuja el scroll, lo devolvemos.
    window.addEventListener('scroll', function () {
      if (window.pageYOffset !== 0) window.scrollTo(0, 0);
    }, { passive: true });
  }

  /* ── 8 · Alto real en móviles (barra de direcciones) ──────────── */
  function initViewportFix() {
    function set() {
      document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
    }
    set();
    window.addEventListener('resize', set);
    window.addEventListener('orientationchange', set);
  }

  /* ── Arranque ─────────────────────────────────────────────────── */
  function boot() {
    safe(initViewportFix, 'viewport');
    safe(initImageFallback, 'imagen');
    safe(initCta, 'cta');
    safe(initTickers, 'tickers');
    safe(initConfetti, 'confetti');
    safe(initSparks, 'sparks');
    safe(initMouseParallax, 'parallax');
    safe(initNoScroll, 'noscroll');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
