/* =========================================================
   Utilidades de animación, efectos y transiciones
   ========================================================= */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');

  // Curvas: ease-out fuerte para entradas, in-out para movimiento en pantalla
  const E = {
    out: 'cubic-bezier(0.23, 1, 0.32, 1)',
    inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
    drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
    back: 'cubic-bezier(0.34, 1.5, 0.64, 1)',
    in: 'cubic-bezier(0.55, 0, 1, 0.45)'
  };

  function anim(el, kf, o = {}) {
    if (!el || !el.animate) return Promise.resolve();
    const opts = { duration: 400, easing: E.out, fill: 'both', ...o };
    if (reduce.matches) { opts.duration = Math.min(opts.duration, 120); opts.delay = Math.min(opts.delay || 0, 60); }
    const a = el.animate(kf, opts);
    return a.finished.then(() => a, () => a);
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, reduce.matches ? Math.min(ms, 60) : ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function h(tag, cls, html) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* parrafos a partir del texto del mensaje */
  function paragraphs(text, cls = '') {
    const frag = document.createDocumentFragment();
    String(text).split(/\n{2,}|\r?\n/).filter((p) => p.trim()).forEach((p) => {
      const el = h('p', cls);
      el.textContent = p.trim();
      frag.appendChild(el);
    });
    return frag;
  }

  /* parrafos con cada palabra en un span (para revelado palabra por palabra) */
  function wordParagraphs(text, cls = '') {
    const frag = document.createDocumentFragment();
    const words = [];
    String(text).split(/\n{2,}|\r?\n/).filter((p) => p.trim()).forEach((p) => {
      const el = h('p', cls);
      p.trim().split(/\s+/).forEach((w, i) => {
        if (i) el.appendChild(document.createTextNode(' '));
        const s = h('span', 'w');
        s.textContent = w;
        el.appendChild(s);
        words.push(s);
      });
      frag.appendChild(el);
    });
    return { frag, words };
  }

  function revealWords(words, { total = 1800, from = { opacity: 0, filter: 'blur(6px)', transform: 'translateY(6px)' }, delay = 0, duration = 650, easing = E.out, maxStep = 40 } = {}) {
    const step = Math.min(maxStep, total / Math.max(1, words.length));
    const to = { opacity: 1, transform: 'none' };
    if ('filter' in from) to.filter = 'blur(0px)';
    words.forEach((w, i) => anim(w, [from, to], { duration, delay: delay + i * step, easing }));
    return wait(delay + words.length * step + duration * 0.6);
  }

  /* ---------- ayudas compartidas por las escenas ---------- */
  const hide = (...els) => els.flat().forEach((e) => e && (e.style.opacity = '0'));
  const fadeUp = (els, { delay = 0, step = 90, y = 14, duration = 700 } = {}) =>
    Promise.all([...els].map((e, i) =>
      anim(e, [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], { duration, delay: delay + i * step })
    ));
  function sceneBase(theme, tint) {
    const el = h('section', `scene msg ${theme}`);
    el.dataset.tint = tint;
    el.setAttribute('role', 'region');
    const extra = window.SCENE_EXTRAS && window.SCENE_EXTRAS[theme];
    if (extra) { try { extra(el); } catch (e) { console.error(e); } }
    return el;
  }
  /* repite fn cada [min, max] ms (con un primer retraso); devuelve stop() */
  function every(fn, min, max = min, first = min) {
    let alive = true, timer;
    const tick = () => {
      if (!alive) return;
      if (!document.hidden) { try { fn(); } catch (e) { console.error(e); } }
      timer = setTimeout(tick, rand(min, max));
    };
    timer = setTimeout(tick, first);
    return () => { alive = false; clearTimeout(timer); };
  }
  /* junta varias funciones stop() en una */
  function stopper() {
    const fns = [];
    const add = (f) => { if (typeof f === 'function') fns.push(f); return f; };
    add.stop = () => { fns.splice(0).forEach((f) => { try { f(); } catch (e) { /* nada */ } }); };
    return add;
  }

  /* ---------- puntero / inclinación global para parallax ----------
     Escribe --px y --py (-1..1) en <html>; .depth y .tilt los usan */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, vx: 0 };
  let lastX = null;
  addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;
    if (lastX != null) pointer.vx += e.clientX - lastX;
    lastX = e.clientX;
  }, { passive: true });
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    pointer.tx = clamp(e.gamma / 25, -1, 1);
    pointer.ty = clamp((e.beta - 50) / 25, -1, 1);
  }, { passive: true });
  (function loop() {
    const ox = pointer.x, oy = pointer.y;
    pointer.x += (pointer.tx - pointer.x) * 0.07;
    pointer.y += (pointer.ty - pointer.y) * 0.07;
    pointer.vx *= 0.9;
    if (!reduce.matches && (Math.abs(pointer.x - ox) > 0.0005 || Math.abs(pointer.y - oy) > 0.0005)) {
      document.documentElement.style.setProperty('--px', pointer.x.toFixed(3));
      document.documentElement.style.setProperty('--py', pointer.y.toFixed(3));
    }
    requestAnimationFrame(loop);
  })();

  function depth(el, d) {
    el.classList.add('depth');
    el.style.setProperty('--depth', d);
    return el;
  }

  /* ráfaga de sprites pixel desde un punto (coords de pantalla) */
  function burst(container, x, y, { names = ['heart-s', 'heart-s-rose', 'sparkle-s'], n = 10, spread = 90, scale = 3, up = 30, z = 30 } = {}) {
    if (reduce.matches) return;
    const box = container.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const s = PX.img(pick(names), scale, 'burst');
      s.style.left = x - box.left + 'px';
      s.style.top = y - box.top + 'px';
      s.style.zIndex = z;
      container.appendChild(s);
      const a = rand(0, Math.PI * 2), d = rand(spread * 0.45, spread);
      const dx = Math.cos(a) * d, dy = Math.sin(a) * d - up;
      anim(s, [
        { transform: 'translate(-50%,-50%) scale(0.5)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.75}px), calc(-50% + ${dy * 0.75}px)) scale(1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 26}px)) scale(0.7) rotate(${rand(-40, 40)}deg)`, opacity: 0 }
      ], { duration: rand(750, 1150), easing: E.out }).then(() => s.remove());
    }
  }

  /* texto que sube y se desvanece (tipo videojuego) */
  function floatText(container, x, y, text, cls = '') {
    const box = container.getBoundingClientRect();
    const t = h('span', 'float-txt ' + cls);
    t.textContent = text;
    t.style.left = x - box.left + 'px';
    t.style.top = y - box.top + 'px';
    container.appendChild(t);
    anim(t, [
      { transform: 'translate(-50%, 0) scale(0.8)', opacity: 0 },
      { transform: 'translate(-50%, -20px) scale(1.1)', opacity: 1, offset: 0.25 },
      { transform: 'translate(-50%, -70px) scale(1)', opacity: 0 }
    ], { duration: 1600, easing: E.out }).then(() => t.remove());
  }

  /* estrellas fugaces aleatorias; devuelve stop() */
  function shootingStars(container, every = [1800, 4200]) {
    let alive = true, timer;
    const spawn = () => {
      if (!alive) return;
      const s = h('i', 'shoot');
      const ang = rand(18, 34);
      s.style.left = rand(-5, 70) + '%';
      s.style.top = rand(2, 45) + '%';
      s.style.transform = `rotate(${ang}deg)`;
      container.appendChild(s);
      const dist = rand(220, 420);
      anim(s, [
        { opacity: 0, transform: `rotate(${ang}deg) translateX(0) scaleX(0.4)` },
        { opacity: 1, transform: `rotate(${ang}deg) translateX(${dist * 0.3}px) scaleX(1)`, offset: 0.25 },
        { opacity: 0, transform: `rotate(${ang}deg) translateX(${dist}px) scaleX(0.6)` }
      ], { duration: rand(700, 1100), easing: 'linear' }).then(() => s.remove());
      timer = setTimeout(spawn, rand(every[0], every[1]));
    };
    timer = setTimeout(spawn, 600);
    return () => { alive = false; clearTimeout(timer); };
  }

  /* estrellas / destellos pixel en un contenedor */
  function stars(container, n = 30, names = ['sparkle', 'sparkle-s', 'sparkle-s', 'sparkle-pink']) {
    const layer = h('div', 'stars');
    for (let i = 0; i < n; i++) {
      const name = pick(names);
      const s = PX.img(name, name === 'sparkle-s' ? 2 : pick([2, 3]), 'star');
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.setProperty('--d', rand(1.8, 4.5).toFixed(2) + 's');
      s.style.setProperty('--dl', (-rand(0, 5)).toFixed(2) + 's');
      layer.appendChild(s);
    }
    container.appendChild(layer);
    return layer;
  }

  /* pixel art flotando hacia arriba */
  function floaters(container, n = 8, names = ['heart-s', 'heart-s-rose', 'sparkle-s']) {
    const layer = h('div', 'floaters');
    for (let i = 0; i < n; i++) {
      const s = PX.img(pick(names), pick([3, 4]), 'floater');
      s.style.left = rand(2, 96) + '%';
      s.style.setProperty('--d', rand(9, 16).toFixed(1) + 's');
      s.style.setProperty('--dl', (-rand(0, 16)).toFixed(1) + 's');
      s.style.setProperty('--x', rand(-40, 40).toFixed(0) + 'px');
      layer.appendChild(s);
    }
    container.appendChild(layer);
    return layer;
  }

  /* capa canvas con loop; draw(ctx, w, h, dt, t) */
  function canvasLayer(parent, draw, cls = 'layer') {
    const c = h('canvas', cls);
    parent.appendChild(c);
    const ctx = c.getContext('2d');
    let w = 1, hh = 1, alive = true, raf, last = performance.now();
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth || parent.clientWidth || innerWidth;
      hh = c.clientHeight || parent.clientHeight || innerHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    }
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();
    function loop(t) {
      if (!alive) return;
      const dt = Math.min(50, t - last) / 1000;
      last = t;
      ctx.clearRect(0, 0, w, hh);
      draw(ctx, w, hh, dt, t);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return { canvas: c, ctx, stop() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
  }

  /* destellos al tocar la pantalla */
  const SPARK_COLORS = ['#ff86b0', '#ffd25e', '#ffffff', '#b9a0ff', '#8fe0b8'];
  function tapSparkles(e) {
    if (reduce.matches) return;
    const n = 7;
    for (let i = 0; i < n; i++) {
      const s = h('span', 'tap-spark');
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.style.background = pick(SPARK_COLORS);
      document.body.appendChild(s);
      const a = (i / n) * Math.PI * 2 + rand(-0.3, 0.3), d = rand(22, 46);
      anim(s, [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0.4)`, opacity: 0 }
      ], { duration: rand(420, 620), easing: E.out }).then(() => s.remove());
    }
  }

  /* =========================================================
     Transiciones entre escenas
     t(stage, oldEl, newEl, attach, origin) -> Promise
     attach() inserta la nueva escena y arranca su animación
     ========================================================= */
  const vw = () => innerWidth, vh = () => innerHeight;

  async function coverGrid(stage, tint, attach, oldEl) {
    const size = innerWidth < 600 ? 42 : 64;
    const cols = Math.ceil(vw() / size), rows = Math.ceil(vh() / size);
    const ov = h('div', 'tx-grid');
    ov.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    ov.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    const cells = [];
    for (let i = 0; i < cols * rows; i++) {
      const c = h('i');
      c.style.background = tint;
      ov.appendChild(c);
      cells.push(c);
    }
    stage.appendChild(ov);
    const cx = cols / 2, cy = rows / 2;
    const delayOf = (i) => {
      const x = i % cols, y = (i / cols) | 0;
      return Math.hypot(x - cx, y - cy) * 28 + rand(0, 140);
    };
    await Promise.all(cells.map((c, i) => anim(c, [{ opacity: 0, transform: 'scale(0.3)' }, { opacity: 1, transform: 'scale(1.02)' }], { duration: 260, delay: delayOf(i), easing: E.out })));
    if (oldEl) oldEl.remove();
    attach();
    await Promise.all(cells.map((c, i) => anim(c, [{ opacity: 1, transform: 'scale(1.02)' }, { opacity: 0, transform: 'scale(0.3)' }], { duration: 300, delay: rand(0, 380), easing: E.in })));
    ov.remove();
  }

  const T = {
    iris(stage, o, n, attach, org) {
      const x = org ? org.x : vw() / 2, y = org ? org.y : vh() / 2;
      const R = Math.hypot(Math.max(x, vw() - x), Math.max(y, vh() - y)) + 20;
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }], { duration: 900, easing: E.inOut });
      return anim(n, [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }], { duration: 950, easing: E.inOut });
    },
    pixels(stage, o, n, attach) {
      return coverGrid(stage, n.dataset.tint || '#ffc2d8', attach, o);
    },
    wipe(stage, o, n, attach, org, dir = 1) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: `translateX(${-12 * dir}%)`, filter: 'brightness(0.7)' }], { duration: 900, easing: E.inOut });
      const from = dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      return anim(n, [{ clipPath: from }, { clipPath: 'inset(0 0 0 0)' }], { duration: 900, easing: E.inOut });
    },
    curtain(stage, o, n, attach) {
      const ov = h('div', 'tx-curtain');
      const l = h('i'), r = h('i');
      l.style.background = r.style.background = n.dataset.tint || '#f7a8c2';
      ov.append(l, r);
      stage.appendChild(ov);
      return Promise.all([
        anim(l, [{ transform: 'translateX(-101%)' }, { transform: 'translateX(0)' }], { duration: 620, easing: E.inOut }),
        anim(r, [{ transform: 'translateX(101%)' }, { transform: 'translateX(0)' }], { duration: 620, easing: E.inOut })
      ]).then(async () => {
        if (o) o.remove();
        attach();
        await wait(80);
        await Promise.all([
          anim(l, [{ transform: 'translateX(0)' }, { transform: 'translateX(-101%)' }], { duration: 760, easing: E.inOut }),
          anim(r, [{ transform: 'translateX(0)' }, { transform: 'translateX(101%)' }], { duration: 760, easing: E.inOut })
        ]);
        ov.remove();
      });
    },
    diamond(stage, o, n, attach) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ transform: 'scale(1) rotate(0deg)', opacity: 1 }, { transform: 'scale(0.9) rotate(-3deg)', opacity: 0.4 }], { duration: 1000, easing: E.inOut });
      return anim(n, [
        { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
        { clipPath: 'polygon(50% -60%, 160% 50%, 50% 160%, -60% 50%)' }
      ], { duration: 1000, easing: E.inOut });
    },
    rise(stage, o, n, attach) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(0.92)', filter: 'brightness(0.55)' }], { duration: 850, easing: E.drawer });
      return anim(n, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 850, easing: E.drawer });
    },
    blinds(stage, o, n, attach) {
      const count = innerWidth < 600 ? 6 : 10;
      const ov = h('div', 'tx-blinds');
      const bars = [];
      for (let i = 0; i < count; i++) {
        const b = h('i');
        b.style.background = n.dataset.tint || '#fff3df';
        ov.appendChild(b);
        bars.push(b);
      }
      stage.appendChild(ov);
      return Promise.all(bars.map((b, i) => anim(b, [{ transform: 'scaleY(0.001)' }, { transform: 'scaleY(1)' }], { duration: 480, delay: i * 45, easing: E.inOut })))
        .then(async () => {
          if (o) o.remove();
          attach();
          bars.forEach((b) => (b.style.transformOrigin = 'bottom'));
          await Promise.all(bars.map((b, i) => anim(b, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.001)' }], { duration: 520, delay: i * 45, easing: E.inOut })));
          ov.remove();
        });
    },
    blur(stage, o, n, attach) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(12px)' }], { duration: 800, easing: E.out });
      return anim(n, [{ opacity: 0, filter: 'blur(18px)', transform: 'scale(1.06)' }, { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }], { duration: 1000, easing: E.out });
    },
    zoom(stage, o, n, attach) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { transform: 'scale(1.35)', opacity: 0, filter: 'blur(8px)' }], { duration: 900, easing: E.inOut });
      return anim(n, [{ transform: 'scale(0.6) rotate(-6deg)', opacity: 0 }, { transform: 'scale(1) rotate(0deg)', opacity: 1 }], { duration: 1000, easing: E.out, delay: 150 });
    },
    slide(stage, o, n, attach, org, dir = 1) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ transform: 'translateX(0) rotate(0deg)' }, { transform: `translateX(${-60 * dir}%) rotate(${-4 * dir}deg)`, opacity: 0.3 }], { duration: 950, easing: E.inOut });
      return anim(n, [{ transform: `translateX(${100 * dir}%) rotate(${5 * dir}deg)` }, { transform: 'translateX(0) rotate(0deg)' }], { duration: 950, easing: E.inOut });
    },
    fade(stage, o, n, attach) {
      n.style.zIndex = 3;
      attach();
      if (o) anim(o, [{ opacity: 1 }, { opacity: 0 }], { duration: 500 });
      return anim(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
    }
  };

  window.FX = { hide, fadeUp, sceneBase, every, stopper, E, anim, wait, rand, pick, clamp, h, esc, paragraphs, wordParagraphs, revealWords, stars, floaters, canvasLayer, tapSparkles, T, reduce, canHover, pointer, depth, burst, floatText, shootingStars };
})();
