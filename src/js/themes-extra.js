/* =========================================================
   Estilos de carta 9 a 15
   Cada uno devuelve { el, enter(), destroy() }.
   enter() termina cuando el mensaje ya se terminó de mostrar.
   ========================================================= */
(function () {
  const { E, anim, wait, rand, pick, clamp, h, wordParagraphs, revealWords, stars, floaters, canvasLayer, depth, burst, floatText, shootingStars, hide, fadeUp, sceneBase, every, stopper } = FX;
  const small = () => innerWidth < 600;

  /* ---------------------------------------------------------
     9) OCÉANO — rayos de luz, peces, algas, burbujas y una
        botella que sube, se destapa y desenrolla el mensaje
     --------------------------------------------------------- */
  function mar({ msg }) {
    const el = sceneBase('th-mar', '#1d5f7a');
    const st = stopper();
    el.appendChild(h('div', 'mar-rays'));
    const bed = depth(h('div', 'mar-bed'), 6);
    const nw = clamp(Math.round(innerWidth / 80), 6, 16);
    for (let i = 0; i < nw; i++) {
      const w = PX.img('seaweed', pick([4, 5, 6]), 'weed');
      w.style.left = ((i + 0.5) / nw) * 100 + rand(-3, 3) + '%';
      w.style.setProperty('--sd', rand(2.4, 4).toFixed(2) + 's');
      w.style.setProperty('--sdl', (-rand(0, 3)).toFixed(2) + 's');
      bed.appendChild(w);
    }
    for (let i = 0; i < 4; i++) {
      const sh = PX.img(pick(['star', 'star-pink']), 3, 'shell');
      sh.style.left = rand(5, 92) + '%';
      sh.style.rotate = rand(-30, 30) + 'deg';
      bed.appendChild(sh);
    }
    el.appendChild(bed);
    ['fish-orange', 'fish-pink', 'fish-teal', 'fish-gold', 'fish-orange'].forEach((n, i) => {
      const f = h('span', 'fish' + (i % 2 ? ' rev' : ''));
      f.appendChild(PX.img(n, pick([3, 4])));
      f.style.top = rand(10, 72) + '%';
      f.style.setProperty('--d', rand(14, 26).toFixed(1) + 's');
      f.style.setProperty('--dl', (-rand(0, 20)).toFixed(1) + 's');
      el.appendChild(depth(f, 6 + i * 4));
    });

    const fresh = (w, hh, init) => ({ x: rand(0, w), y: init ? rand(0, hh) : hh + rand(0, 40), r: pick([2, 3, 3, 4, 5]), v: rand(28, 64), ph: rand(0, 6.28) });
    const bubbles = Array.from({ length: small() ? 26 : 46 }, () => fresh(innerWidth, innerHeight, true));
    let extra = [];
    const layer = canvasLayer(el, (ctx, w, hh, dt, t) => {
      ctx.lineWidth = 1.5;
      for (const b of bubbles.concat(extra)) {
        b.y -= b.v * dt;
        b.x += Math.sin(t / 600 + b.ph) * 14 * dt;
        if (b.y < -12) { if (b.temp) b.dead = true; else Object.assign(b, fresh(w, hh, false)); }
        ctx.strokeStyle = 'rgba(220,250,255,0.6)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(Math.round(b.x - b.r * 0.5), Math.round(b.y - b.r * 0.5), 2, 2);
      }
      extra = extra.filter((b) => !b.dead);
    });
    const puff = (x, y, n = 10) => { for (let i = 0; i < n; i++) extra.push({ x: x + rand(-16, 16), y: y + rand(-6, 6), r: pick([2, 3, 4, 5]), v: rand(70, 140), ph: rand(0, 6), temp: true }); };

    const wrap = h('div', 'mar-wrap tilt');
    const roll = h('div', 'mar-roll');
    const rodT = h('i', 'rod'), rodB = h('i', 'rod');
    const paper = h('article', 'mar-paper scroll');
    paper.innerHTML = '<p class="eyebrow">un mensaje en una botella</p><div class="mp-body"></div><p class="sign"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    paper.querySelector('.mp-body').appendChild(frag);
    paper.querySelector('.sign').textContent = '— ' + msg.de;
    roll.append(rodT, paper, rodB);
    const bottle = PX.img('bottle', small() ? 7 : 9, 'mar-bottle');
    wrap.append(roll, bottle);
    el.appendChild(wrap);

    return {
      el,
      async enter() {
        const eb = paper.querySelector('.eyebrow'), sign = paper.querySelector('.sign');
        hide(roll, words, eb, sign);
        await anim(bottle, [
          { opacity: 0, transform: 'translateY(60vh) rotate(-25deg)' },
          { opacity: 1, transform: 'translateY(-14px) rotate(10deg)', offset: 0.7 },
          { opacity: 1, transform: 'translateY(0) rotate(-4deg)' }
        ], { duration: 1700, easing: E.out, delay: 200 });
        await anim(bottle, [{ transform: 'rotate(-4deg)' }, { transform: 'rotate(8deg) scale(1.04)' }, { transform: 'rotate(-8deg) scale(1.06)' }, { transform: 'rotate(0) scale(1.08)' }], { duration: 650, easing: 'ease-in-out' });
        const r = bottle.getBoundingClientRect();
        puff(r.left + r.width / 2, r.top + 8, 18);
        burst(el, r.left + r.width / 2, r.top, { names: ['sparkle', 'sparkle-s', 'heart-s'], n: 12, spread: 110, scale: 3 });
        anim(bottle, [{ opacity: 1, transform: 'scale(1.08)' }, { opacity: 0, transform: 'translateY(-50px) scale(0.6) rotate(20deg)' }], { duration: 600, easing: E.in });
        anim(roll, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        const H = paper.offsetHeight / 2;
        anim(rodT, [{ transform: `translateY(${H}px)` }, { transform: 'none' }], { duration: 1100, easing: E.inOut });
        anim(rodB, [{ transform: `translateY(${-H}px)` }, { transform: 'none' }], { duration: 1100, easing: E.inOut });
        await anim(paper, [{ clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 1100, easing: E.inOut });
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2200, duration: 700, easing: E.back, from: { opacity: 0, transform: 'translateY(12px) rotate(-5deg)' } });
        await fadeUp([sign], { y: 6 });
        st(every(() => { const w = el.clientWidth; puff(rand(w * 0.1, w * 0.9), el.clientHeight - 30, 8); }, 2200, 4200, 600));
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     10) CINE — telón que se abre, luces de marquesina,
         cuenta regresiva 3·2·1 y créditos con su nombre
     --------------------------------------------------------- */
  let grainURL = null;
  function grain() {
    if (grainURL) return grainURL;
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    const x = c.getContext('2d');
    const img = x.createImageData(96, 96);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = Math.random() < 0.5 ? 18 : 0;
    }
    x.putImageData(img, 0, 0);
    return (grainURL = c.toDataURL());
  }

  function cine({ msg }) {
    const el = sceneBase('th-cine', '#1a0f14');
    const st = stopper();
    const bulbs = h('div', 'cine-bulbs');
    const nb = clamp(Math.round(innerWidth / 34), 12, 40);
    for (let i = 0; i < nb; i++) { const b = h('i'); b.style.setProperty('--i', i % 3); bulbs.appendChild(b); }
    const beam = h('div', 'cine-beam');
    floaters(beam, 10, ['sparkle-s']);
    const screen = h('div', 'cine-screen');
    const leader = h('div', 'leader');
    leader.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring" cx="50" cy="50" r="44"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/><circle class="sweep" cx="50" cy="50" r="22" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><b>3</b>';
    const card = h('article', 'cine-card scroll');
    card.innerHTML = '<p class="eyebrow">una función especial para ti</p><div class="cc-body"></div><div class="credits"><small>escrito y dirigido por</small><b></b></div>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.cc-body').appendChild(frag);
    card.querySelector('.credits b').textContent = msg.de;
    const scratch = h('i', 'scratch');
    const grainEl = h('i', 'cine-grain');
    grainEl.style.backgroundImage = `url(${grain()})`;
    screen.append(leader, card, scratch, grainEl);
    const wrap = h('div', 'cine-wrap tilt');
    wrap.appendChild(screen);
    const val = h('div', 'valance');
    const cl = h('div', 'curtain l'), cr = h('div', 'curtain r');
    const seats = h('div', 'seats');
    el.append(beam, wrap, cl, cr, val, bulbs, seats);

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), credits = card.querySelector('.credits');
        hide(card, words, eb, credits, screen);
        await wait(350);
        anim(cl, [{ transform: 'translateX(0)' }, { transform: 'translateX(-86%)' }], { duration: 1700, easing: E.inOut });
        anim(cr, [{ transform: 'translateX(0)' }, { transform: 'translateX(86%)' }], { duration: 1700, easing: E.inOut });
        await wait(900);
        await anim(screen, [{ opacity: 0 }, { opacity: 0.7, offset: 0.2 }, { opacity: 0.2, offset: 0.35 }, { opacity: 1 }], { duration: 700, easing: 'linear' });
        const num = leader.querySelector('b'), sweep = leader.querySelector('.sweep');
        for (const n of ['3', '2', '1']) {
          num.textContent = n;
          anim(num, [{ transform: 'scale(1.5)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300, easing: E.back });
          await anim(sweep, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 720, easing: 'linear' });
        }
        await anim(leader, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.6)' }], { duration: 380, easing: E.in });
        leader.remove();
        anim(card, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2400, duration: 900, from: { opacity: 0, filter: 'blur(5px)', transform: 'scale(1.08)' } });
        await anim(credits, [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: E.out });
        st(every(() => {
          scratch.style.left = rand(8, 92) + '%';
          anim(scratch, [{ opacity: 0 }, { opacity: 0.8 }, { opacity: 0.1 }, { opacity: 0.6 }, { opacity: 0 }], { duration: 380, easing: 'steps(4)' });
        }, 1800, 4200, 500));
        st(every(() => {
          const r = screen.getBoundingClientRect();
          burst(el, rand(r.left + 20, r.right - 20), r.top + 10, { names: ['star', 'sparkle', 'heart-s'], n: 6, spread: 60, scale: 2, up: 10 });
        }, 4500, 7000, 3000));
      },
      destroy() { st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     11) NIEVE — nevada con viento, pinos, muñeco de nieve y
         una ventana empañada que se limpia para leer
     --------------------------------------------------------- */
  function nieve({ msg }) {
    const el = sceneBase('th-nieve', '#cfe3f5');
    const st = stopper();
    depth(stars(el, small() ? 18 : 30, ['sparkle-s']), 4);
    el.appendChild(depth(h('div', 'hills back'), 6));
    const trees = depth(h('div', 'trees'), 10);
    const nt = clamp(Math.round(innerWidth / 110), 4, 12);
    for (let i = 0; i < nt; i++) {
      const t = PX.img('pineTree', pick([4, 5, 6]), 'tree');
      t.style.left = ((i + 0.5) / nt) * 100 + rand(-4, 4) + '%';
      trees.appendChild(t);
    }
    el.appendChild(trees);
    el.appendChild(depth(h('div', 'hills front'), 14));
    const snowman = depth(h('span', 'snowman'), 16);
    snowman.appendChild(PX.img('snowman', small() ? 4 : 6));
    el.appendChild(snowman);

    let gust = 0;
    const flake = (w, hh, init) => ({ x: rand(-50, w + 50), y: init ? rand(-hh, hh) : rand(-40, -5), s: pick([2, 2, 3, 3, 4]), v: rand(30, 80), ph: rand(0, 6.28) });
    const flakes = Array.from({ length: small() ? 110 : 200 }, () => flake(innerWidth, innerHeight, true));
    const layer = canvasLayer(el, (ctx, w, hh, dt, t) => {
      gust *= Math.pow(0.4, dt);
      const wind = FX.pointer.x * 40 + gust;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      flakes.forEach((f) => {
        f.y += f.v * dt * (0.6 + f.s * 0.2);
        f.x += (wind + Math.sin(t / 700 + f.ph) * 18) * dt;
        if (f.y > hh + 6) Object.assign(f, flake(w, hh, false));
        if (f.x > w + 60) f.x = -40; else if (f.x < -60) f.x = w + 40;
        ctx.fillRect(Math.round(f.x), Math.round(f.y), f.s, f.s);
      });
    });

    const wrap = h('div', 'nieve-wrap tilt');
    const win = h('article', 'ventana');
    win.innerHTML = '<div class="vidrio scroll"><p class="eyebrow">para calentar el corazón</p><div class="vd-body"></div><p class="sign"></p></div><i class="escarcha"></i><i class="snowcap"></i>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    win.querySelector('.vd-body').appendChild(frag);
    win.querySelector('.sign').textContent = '— ' + msg.de;
    const corners = ['c1', 'c2', 'c3'].map((c) => { const f = PX.img('snowflake', 3, 'vflake ' + c); win.appendChild(f); return f; });
    wrap.appendChild(win);
    el.appendChild(wrap);

    return {
      el,
      async enter() {
        const eb = win.querySelector('.eyebrow'), sign = win.querySelector('.sign'), frost = win.querySelector('.escarcha');
        hide(win, words, eb, sign, corners);
        [...trees.children].forEach((t, i) => anim(t, [{ transform: 'translate(-50%, 40px)', opacity: 0 }, { transform: 'translate(-50%, 0)', opacity: 1 }], { duration: 900, delay: i * 70, easing: E.back }));
        anim(snowman, [{ opacity: 0, transform: 'translateY(40px) scale(0.8)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 500, easing: E.back });
        await anim(win, [{ opacity: 0, transform: 'translateY(-40px) rotate(-2deg)' }, { opacity: 1, transform: 'none' }], { duration: 1000, easing: E.out, delay: 300 });
        corners.forEach((c, i) => anim(c, [{ opacity: 0, transform: 'scale(0) rotate(-90deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 600, delay: i * 150, easing: E.back }));
        gust = 260;
        anim(frost, [{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }], { duration: 2400, easing: E.inOut });
        fadeUp([eb], { y: 6, delay: 200 });
        await revealWords(words, { total: 2300, duration: 800, delay: 300, from: { opacity: 0, filter: 'blur(8px)' } });
        await fadeUp([sign], { y: 6 });
        st(every(() => { gust = pick([-1, 1]) * rand(160, 320); }, 5000, 8000, 2000));
        st(every(() => {
          const im = snowman.firstChild;
          anim(im, [{ transform: 'none' }, { transform: 'translateY(-14px) rotate(-6deg)' }, { transform: 'translateY(0) scale(1.08, 0.92)' }, { transform: 'none' }], { duration: 650, easing: 'ease-in-out', fill: 'none' });
          const r = snowman.getBoundingClientRect();
          floatText(el, r.left + r.width / 2, r.top, pick(['¡brr!', '♥', '¡abrazo!', '¡ánimo!']));
        }, 4000, 6500, 1500));
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     12) ESPACIO — salto a hipervelocidad, planetas, un cohete
         que entrega la carta y una transmisión en pantalla
     --------------------------------------------------------- */
  function espacio({ msg }) {
    const el = sceneBase('th-espacio', '#0d0a26');
    const st = stopper();
    let speed = 2.6;
    const pts = Array.from({ length: small() ? 160 : 300 }, () => ({ x: rand(-1, 1), y: rand(-1, 1), z: rand(0.05, 1) }));
    const layer = canvasLayer(el, (ctx, w, hh, dt) => {
      speed = Math.max(0.06, speed * Math.pow(0.45, dt));
      const cx = w / 2, cy = hh / 2, k = Math.max(w, hh) * 0.5;
      pts.forEach((p) => {
        const pz = p.z;
        p.z -= speed * dt * 0.5;
        if (p.z <= 0.02) { p.x = rand(-1, 1); p.y = rand(-1, 1); p.z = 1; return; }
        const sx = cx + (p.x / p.z) * k, sy = cy + (p.y / p.z) * k;
        const ox = cx + (p.x / pz) * k, oy = cy + (p.y / pz) * k;
        const a = clamp(1.2 - p.z, 0.2, 1);
        if (speed > 0.4) {
          ctx.strokeStyle = `rgba(220,225,255,${a})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(sx, sy); ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(235,235,255,${a})`;
          const s = p.z < 0.3 ? 3 : 2;
          ctx.fillRect(Math.round(sx), Math.round(sy), s, s);
        }
      });
    });
    const pl1 = depth(PX.img('planet', small() ? 4 : 6, 'planet p1'), 22);
    const pl2 = depth(PX.img('planet-teal', small() ? 3 : 4, 'planet p2'), 12);
    const moon = depth(PX.img('moon', 3, 'planet p3'), 30);
    el.append(pl1, pl2, moon);
    const rocket = h('span', 'rocket');
    rocket.append(PX.img('rocket', small() ? 4 : 5, 'r-body'), PX.img('flame', small() ? 4 : 5, 'r-flame'));
    el.appendChild(rocket);
    const stopShoot = shootingStars(el, [2500, 5000]);

    const wrap = h('div', 'esp-wrap tilt');
    const card = h('article', 'transmision scroll');
    card.innerHTML = '<p class="tx-head"><i class="dot"></i> transmisión recibida</p><div class="tx-body"></div><p class="sign"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.tx-body').appendChild(frag);
    card.querySelector('.sign').textContent = '— enviado por ' + msg.de + ', con amor desde la Tierra';
    wrap.appendChild(card);
    el.appendChild(wrap);

    const fly = (big) => anim(rocket, big ? [
      { transform: 'translate(-60vw, 55vh) rotate(45deg)', opacity: 1 },
      { transform: 'translate(0, 0) rotate(30deg) scale(1.2)', opacity: 1, offset: 0.55 },
      { transform: 'translate(65vw, -60vh) rotate(40deg)', opacity: 1 }
    ] : [
      { transform: 'translate(60vw, 30vh) rotate(-60deg) scale(0.6)', opacity: 1 },
      { transform: 'translate(-65vw, -35vh) rotate(-60deg) scale(0.6)', opacity: 1 }
    ], { duration: big ? 2000 : 5200, easing: big ? E.inOut : 'linear' });

    return {
      el,
      async enter() {
        const head = card.querySelector('.tx-head'), sign = card.querySelector('.sign');
        hide(card, words, head, sign, pl1, pl2, moon);
        [pl1, pl2, moon].forEach((p, i) => anim(p, [{ opacity: 0, transform: 'scale(0.5)' }, { opacity: 1, transform: 'none' }], { duration: 1600, delay: 700 + i * 200, easing: E.out }));
        await wait(900);
        fly(true);
        await wait(1100);
        burst(el, innerWidth / 2, innerHeight / 2, { names: ['sparkle', 'sparkle-s', 'star', 'heart-s'], n: 18, spread: 160, scale: 3, up: 0 });
        await anim(card, [{ opacity: 0, transform: 'scale(0.2) rotate(-10deg)' }, { opacity: 1, transform: 'scale(1.04)', offset: 0.7 }, { opacity: 1, transform: 'none' }], { duration: 800, easing: E.out });
        fadeUp([head], { y: 4 });
        await revealWords(words, { total: 2300, duration: 500, from: { opacity: 0, transform: 'translateX(-8px) skewX(-25deg)', filter: 'blur(3px)' } });
        await anim(sign, [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], { duration: 1000, easing: 'steps(18)' });
        st(every(() => fly(false), 9000, 13000, 2500));
      },
      destroy() { layer.stop(); stopShoot(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     13) GLOBOS — guirnalda, confeti, globos que flotan y
         revientan, y una tarjeta que sube colgada de globos
     --------------------------------------------------------- */
  const BAL = ['#ff86b0', '#ffd25e', '#8ec9ff', '#b9a0ff', '#8fe0b8', '#ff7a6b'];
  function balloon(cls, color) {
    const b = h('span', 'bal ' + cls);
    b.style.setProperty('--c', color);
    b.innerHTML = '<i class="b-knot"></i><i class="b-str"></i>';
    return b;
  }
  function globos({ msg }) {
    const el = sceneBase('th-globos', '#ffe9f3');
    const st = stopper();
    const bunting = h('div', 'bunting');
    const nf = clamp(Math.round(innerWidth / 46), 8, 30);
    for (let i = 0; i < nf; i++) {
      const f = h('i');
      f.style.background = BAL[i % BAL.length];
      f.style.setProperty('--sd', (-rand(0, 2)).toFixed(2) + 's');
      f.style.top = Math.sin((i / (nf - 1)) * Math.PI) * 18 + 'px';
      bunting.appendChild(f);
    }
    const bg = [];
    for (let i = 0; i < (small() ? 7 : 12); i++) {
      const b = balloon('bg', pick(BAL));
      b.style.left = rand(2, 94) + '%';
      b.style.setProperty('--d', rand(12, 20).toFixed(1) + 's');
      b.style.setProperty('--dl', (-rand(0, 20)).toFixed(1) + 's');
      b.style.setProperty('--s', rand(0.6, 1.1).toFixed(2));
      el.appendChild(depth(b, 6 + (i % 3) * 5));
      bg.push(b);
    }
    el.appendChild(bunting);

    let bits = [];
    const COLORS = ['#ff86b0', '#ffd25e', '#8ec9ff', '#b9a0ff', '#8fe0b8', '#ff7a6b', '#ffffff'];
    const cannon = (x, y, dir, n = 60) => {
      for (let i = 0; i < n; i++) {
        const a = (-90 + dir * rand(15, 55)) * (Math.PI / 180), v = rand(380, 820);
        bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rand(0, 6), vr: rand(-8, 8), c: pick(COLORS), w: pick([4, 6, 8]), hh: pick([3, 4]), life: rand(2.5, 4) });
      }
    };
    const pop = (x, y) => { for (let i = 0; i < 26; i++) { const a = rand(0, 6.28), v = rand(120, 320); bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, r: rand(0, 6), vr: rand(-8, 8), c: pick(COLORS), w: 4, hh: 3, life: rand(1.2, 2) }); } };
    const layer = canvasLayer(el, (ctx, w, hh, dt) => {
      bits.forEach((b) => {
        b.vy += 520 * dt; b.vx *= Math.pow(0.5, dt); b.vy = Math.min(b.vy, 160 + Math.abs(b.vx) * 0.2);
        b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt; b.life -= dt;
        ctx.save();
        ctx.globalAlpha = clamp(b.life, 0, 1);
        ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.scale(Math.cos(b.r * 1.7), 1);
        ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.hh / 2, b.w, b.hh);
        ctx.restore();
      });
      bits = bits.filter((b) => b.life > 0 && b.y < hh + 20);
    });

    const wrap = h('div', 'globo-wrap tilt');
    const holder = h('div', 'gc-holder');
    const cluster = h('div', 'gc-cluster');
    [['l', BAL[0]], ['c', BAL[1]], ['r', BAL[2]]].forEach(([c, col]) => cluster.appendChild(balloon('big ' + c, col)));
    const card = h('article', 'gc-card scroll');
    card.innerHTML = '<p class="eyebrow">¡una sorpresa para ti!</p><div class="gc-body"></div><p class="ribbon"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.gc-body').appendChild(frag);
    card.querySelector('.ribbon').textContent = 'con cariño, ' + msg.de;
    holder.append(cluster, card);
    wrap.appendChild(holder);
    el.appendChild(wrap);

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), rib = card.querySelector('.ribbon');
        hide(words, eb, rib);
        const W = el.clientWidth, HH = el.clientHeight;
        await wait(250);
        cannon(0, HH, 1); cannon(W, HH, -1);
        const rise = await anim(holder, [
          { transform: 'translateY(110vh) rotate(-4deg)' },
          { transform: 'translateY(-18px) rotate(2deg)', offset: 0.75 },
          { transform: 'translateY(0) rotate(0)' }
        ], { duration: 2000, easing: E.out });
        rise.cancel();
        holder.classList.add('float');
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2100, duration: 550, easing: E.back, from: { opacity: 0, transform: 'scale(0.3) rotate(-10deg)' } });
        await anim(rib, [{ opacity: 0, transform: 'scaleX(0.2) rotate(-3deg)' }, { opacity: 1, transform: 'scaleX(1) rotate(-2deg)' }], { duration: 600, easing: E.back });
        st(every(() => {
          const b = pick(bg);
          const r = b.getBoundingClientRect();
          if (r.top < 0 || r.bottom > innerHeight) return;
          const box = el.getBoundingClientRect();
          pop(r.left + r.width / 2 - box.left, r.top + r.height * 0.35 - box.top);
          floatText(el, r.left + r.width / 2, r.top, '¡pop!');
          const a = b.animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 1.5 }], { duration: 160, fill: 'forwards' });
          setTimeout(() => a.cancel(), 3500);
        }, 2600, 4800, 800));
        st(every(() => { const w = el.clientWidth, hh = el.clientHeight; cannon(0, hh, 1, 35); cannon(w, hh, -1, 35); }, 8000, 11000, 6000));
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     14) LUCIÉRNAGAS — bosque de noche con neblina; las
         luciérnagas iluminan las palabras y forman un corazón
     --------------------------------------------------------- */
  function bosque({ msg }) {
    const el = sceneBase('th-bosque', '#0e2219');
    const st = stopper();
    const moon = depth(PX.img('moon', small() ? 4 : 5, 'b-moon'), 20);
    el.appendChild(moon);
    depth(stars(el, small() ? 20 : 34, ['sparkle-s']), 4);
    [['far', 10, [3, 4]], ['mid', 7, [5, 6]], ['near', 5, [7, 9]]].forEach(([cls, per, sc], k) => {
      const row = depth(h('div', 'forest ' + cls), 4 + k * 7);
      const n = clamp(Math.round(innerWidth / (per * 12)), 5, 18);
      for (let i = 0; i < n; i++) {
        const t = PX.img('pineTree', pick(sc), 'ftree');
        t.style.left = ((i + 0.5) / n) * 100 + rand(-5, 5) + '%';
        row.appendChild(t);
      }
      el.appendChild(row);
    });
    el.appendChild(h('div', 'mist'));

    let mode = 'wander', modeT = 0, alpha = 0;
    const N = small() ? 34 : 56;
    const flies = Array.from({ length: N }, (_, i) => ({ x: rand(0, innerWidth), y: rand(innerHeight * 0.2, innerHeight), vx: rand(-20, 20), vy: rand(-20, 20), ph: rand(0, 6.28), k: i / N, boost: 0 }));
    const heartAt = (k, w, hh) => {
      const t = k * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const s = Math.min(w, hh) / (w < 600 ? 30 : 38);
      return [w / 2 + x * s * (w < 600 ? 0.95 : 1.25), hh * 0.47 + y * s];
    };
    const layer = canvasLayer(el, (ctx, w, hh, dt, t) => {
      alpha = Math.min(1, alpha + dt * 0.6);
      if (mode === 'heart' && t - modeT > 4200) mode = 'wander';
      flies.forEach((f) => {
        if (mode === 'heart') {
          const [tx, ty] = heartAt(f.k, w, hh);
          f.vx += (tx - f.x) * 2.2 * dt; f.vy += (ty - f.y) * 2.2 * dt;
          f.vx *= Math.pow(0.15, dt); f.vy *= Math.pow(0.15, dt);
        } else {
          f.vx += rand(-60, 60) * dt; f.vy += rand(-60, 60) * dt;
          f.vx = clamp(f.vx, -40, 40); f.vy = clamp(f.vy, -40, 40);
          if (f.x < 10) f.vx += 30 * dt * 10; if (f.x > w - 10) f.vx -= 30 * dt * 10;
          if (f.y < hh * 0.1) f.vy += 30 * dt * 10; if (f.y > hh - 10) f.vy -= 30 * dt * 10;
        }
        f.x += f.vx * dt; f.y += f.vy * dt;
        f.boost = Math.max(0, f.boost - dt);
        const blink = (0.55 + 0.45 * Math.sin(t / 420 + f.ph * 3)) * alpha + f.boost;
        const r = 10 + f.boost * 14;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, `rgba(255,236,140,${0.55 * blink})`);
        g.addColorStop(1, 'rgba(255,236,140,0)');
        ctx.fillStyle = g;
        ctx.fillRect(f.x - r, f.y - r, r * 2, r * 2);
        ctx.fillStyle = `rgba(255,250,210,${Math.min(1, blink + 0.2)})`;
        ctx.fillRect(Math.round(f.x - 1), Math.round(f.y - 1), 3, 3);
      });
    }, 'layer fireflies');
    const heart = () => { mode = 'heart'; modeT = performance.now(); };

    const wrap = h('div', 'bosque-wrap tilt');
    const card = h('article', 'bosque-card scroll');
    card.innerHTML = '<p class="eyebrow">una luz para tu camino</p><div class="bc-body"></div><p class="sign"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.bc-body').appendChild(frag);
    card.querySelector('.sign').textContent = '— ' + msg.de;
    wrap.appendChild(card);
    el.appendChild(wrap);

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), sign = card.querySelector('.sign');
        hide(card, eb, sign);
        words.forEach((w) => w.classList.add('dim'));
        anim(moon, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 1800 });
        await anim(card, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 1100, delay: 500 });
        fadeUp([eb], { y: 6 });
        const step = Math.min(110, 2600 / Math.max(1, words.length));
        await new Promise((res) => {
          words.forEach((w, i) => setTimeout(() => {
            w.classList.remove('dim');
            w.classList.add('lit');
            const f = flies[i % flies.length];
            f.boost = 0.8;
            if (i === words.length - 1) setTimeout(res, 500);
          }, FX.reduce.matches ? 0 : i * step));
          if (!words.length) res();
        });
        await anim(sign, [{ opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 900 });
        heart();
        st(every(heart, 9000, 12000, 9000));
        st(every(() => { for (let i = 0; i < 6; i++) pick(flies).boost = 1; }, 1500, 3000));
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     15) MÚSICA — tocadiscos girando, ecualizador, notas
         flotando y letra estilo karaoke
     --------------------------------------------------------- */
  function musica({ msg }) {
    const el = sceneBase('th-musica', '#2a1b3d');
    const st = stopper();
    el.appendChild(h('div', 'mus-floor'));
    depth(stars(el, small() ? 16 : 28, ['sparkle-s', 'sparkle-pink']), 6);
    depth(floaters(el, small() ? 8 : 14, ['note-pink', 'note-gold', 'note-lilac', 'note-mint']), 14);
    const eq = h('div', 'eq');
    const nb = clamp(Math.round(innerWidth / 22), 14, 48);
    for (let i = 0; i < nb; i++) {
      const b = h('i');
      b.style.setProperty('--d', rand(0.35, 0.9).toFixed(2) + 's');
      b.style.setProperty('--dl', (-rand(0, 1)).toFixed(2) + 's');
      b.style.setProperty('--hmax', rand(30, 100).toFixed(0) + '%');
      eq.appendChild(b);
    }
    el.appendChild(eq);
    const deck = depth(h('div', 'deck'), 12);
    deck.innerHTML = '<div class="vinilo"><i class="label"></i></div><i class="brazo"></i>';
    el.appendChild(deck);

    const wrap = h('div', 'mus-wrap tilt');
    const card = h('article', 'letra');
    card.innerHTML = '<header><span class="disc"></span><div><p class="eyebrow">canción para ti</p><p class="artist"></p></div></header><div class="lt-body scroll"></div><div class="pista"><span>0:00</span><i><b></b></i><span>∞</span></div>';
    card.querySelector('.disc').appendChild(PX.img('note-pink', 3));
    card.querySelector('.artist').textContent = 'dedicada por ' + msg.de;
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.lt-body').appendChild(frag);
    wrap.appendChild(card);
    el.appendChild(wrap);
    const vinyl = deck.querySelector('.vinilo'), arm = deck.querySelector('.brazo');

    return {
      el,
      async enter() {
        const head = card.querySelector('header'), bar = card.querySelector('.pista b'), pista = card.querySelector('.pista'), time = pista.querySelector('span');
        hide(card, head, pista, deck);
        await anim(deck, [{ opacity: 0, transform: 'translateY(30px) rotate(-8deg)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: E.back, delay: 200 });
        await anim(arm, [{ transform: 'rotate(-38deg)' }, { transform: 'rotate(0deg)' }], { duration: 900, easing: E.inOut });
        vinyl.classList.add('spin');
        el.classList.add('playing');
        await anim(card, [{ opacity: 0, transform: 'translateX(40px) scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: E.out });
        fadeUp([head, pista], { y: 6, step: 160 });
        words.forEach((w) => w.classList.add('kara'));
        const step = Math.min(170, 4200 / Math.max(1, words.length));
        const total = step * words.length;
        anim(bar, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: total + 600, easing: 'linear' });
        const t0 = performance.now();
        const clock = setInterval(() => {
          const s = Math.floor((performance.now() - t0) / 1000);
          time.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        }, 250);
        st(() => clearInterval(clock));
        await new Promise((res) => {
          words.forEach((w, i) => setTimeout(() => { w.classList.add('sung'); FX.follow(w); if (i === words.length - 1) setTimeout(res, 400); }, FX.reduce.matches ? 0 : i * step));
          if (!words.length) res();
        });
        st(every(() => {
          const r = vinyl.getBoundingClientRect();
          burst(el, r.left + r.width / 2, r.top + r.height / 2, { names: ['note-pink', 'note-gold', 'note-lilac', 'note-mint'], n: 5, spread: 90, scale: 3, up: 50 });
        }, 2200, 3800, 300));
      },
      destroy() { st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     POCHITA — patio soleado: el perrito llega corriendo con la
     carta en la boca, la suelta, salta encima de la tarjeta y
     se queda jugando (salta, ladra, camina, mueve la colita)
     --------------------------------------------------------- */
  function pochita({ msg }) {
    const el = sceneBase('th-perro', '#bfe8ff');
    const st = stopper();
    /* playa: sol con rayos, nubes, gaviotas, mar con olas y velero,
       palmeras, sombrilla, castillo de arena, cangrejo y pelota */
    const sun = depth(h('div', 'b-sun'), 10);
    sun.append(h('i', 'rays'), PX.img('sun', small() ? 5 : 7));
    el.appendChild(sun);
    for (let i = 0; i < 4; i++) {
      const sc = pick([3, 4, 5]);
      const holder = depth(h('div', 'cloud-holder'), sc * 3);
      const c = PX.img('cloud', sc, 'drift');
      holder.style.top = rand(3, 30) + '%';
      c.style.setProperty('--d', (90 - sc * 8 + rand(-10, 10)).toFixed(0) + 's');
      c.style.setProperty('--dl', (-rand(0, 80)).toFixed(0) + 's');
      holder.appendChild(c);
      el.appendChild(holder);
    }
    const birdSvg = '<svg viewBox="0 0 9 4" shape-rendering="crispEdges" aria-hidden="true"><path d="M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM4 2h1v1H4zM5 1h1v1H5zM6 0h1v1H6zM7 0h1v1H7z" transform="translate(0.5 0)"/></svg>';
    for (let i = 0; i < 4; i++) {
      const b = h('span', 'bird gull', birdSvg);
      b.style.top = rand(8, 34) + '%';
      b.style.setProperty('--d', rand(16, 28).toFixed(1) + 's');
      b.style.setProperty('--dl', (-rand(0, 20)).toFixed(1) + 's');
      b.style.setProperty('--s', rand(0.7, 1.2).toFixed(2));
      el.appendChild(b);
    }
    const sea = depth(h('div', 'b-sea', '<i class="w w1"></i><i class="w w2"></i><i class="w w3"></i>'), 5);
    for (let i = 0; i < 16; i++) {
      const g = h('i', 'glint');
      g.style.left = rand(2, 96) + '%';
      g.style.top = rand(8, 80) + '%';
      g.style.width = rand(10, 34).toFixed(0) + 'px';
      g.style.setProperty('--dl', (-rand(0, 3)).toFixed(2) + 's');
      sea.appendChild(g);
    }
    sea.appendChild(h('div', 'boat', '<i class="sail"></i><i class="sail2"></i><i class="hull"></i>'));
    el.appendChild(sea);
    const sand = h('div', 'b-sand', '<i class="foam"></i><i class="wet"></i>');
    for (let i = 0; i < 7; i++) {
      const sh = PX.img(pick(['star', 'star-pink', 'heart-s', 'flower-peach']), 2, 'b-shell');
      sh.style.left = rand(3, 95) + '%';
      sh.style.bottom = rand(8, 60) + '%';
      sh.style.rotate = rand(-30, 30) + 'deg';
      sand.appendChild(sh);
    }
    const palms = ['l', 'r'].map((side) => {
      const p = h('div', 'palm ' + side, '<i class="trunk"></i><i class="fronds"><i></i><i></i><i></i><i></i><i></i><i></i></i><i class="coco"></i>');
      sand.appendChild(p);
      return p;
    });
    sand.appendChild(h('div', 'umbrella', '<i class="top"></i><i class="pole"></i><i class="towel"></i>'));
    const house = h('div', 'castle', '<i class="t1"></i><i class="t2"></i><i class="t3"></i><i class="gate"></i><b class="flag"></b>');
    sand.appendChild(house);
    const crabEl = h('span', 'crab');
    const crabImg = PX.img('crab', small() ? 3 : 4);
    crabEl.appendChild(crabImg);
    sand.appendChild(crabEl);
    let crabStep = 0;
    const crabT = setInterval(() => { crabStep ^= 1; crabImg.src = PX.url(crabStep ? 'crab-step' : 'crab'); }, 180);
    st(() => clearInterval(crabT));
    const ball = h('span', 'ball bball');
    sand.appendChild(ball);
    el.appendChild(sand);
    const bf = h('span', 'bfly b1');
    bf.appendChild(PX.img('butterfly-pink', 3));
    el.appendChild(bf);

    const wrap = h('div', 'perro-wrap tilt');
    const card = h('article', 'perro-card scroll');
    card.innerHTML = '<p class="eyebrow">te traje algo</p><div class="pc-body"></div><p class="sign"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.pc-body').appendChild(frag);
    card.querySelector('.sign').textContent = '— ' + msg.de;
    const paws = ['pw1', 'pw2', 'pw3'].map((c) => { const p = PX.img('paw', 4, 'pawprint ' + c); card.appendChild(p); return p; });
    wrap.appendChild(card);
    el.appendChild(wrap);

    const SC = small() ? 3 : 4;
    const pup = h('div', 'pup');
    const pimg = PX.img('pochi-idle0', SC, 'pup-img');
    const env = PX.img('envelope', 2, 'pup-env');
    pup.append(pimg, env);
    el.appendChild(pup);
    const PW = 47 * SC, PH = 30 * SC;
    let px = -PW - 40, py = 0, facing = 1;

    /* cuadros segun lo que esta haciendo */
    let state = 'idle', stateUntil = 0, tick = 0, cur = '';
    const SEQ = {
      run: ['pochi-run0', 'pochi-run1', 'pochi-run2', 'pochi-run3'],
      idle: ['pochi-idle0', 'pochi-idle1'],
      happy: ['pochi-happy0', 'pochi-happy1'],
      bark: ['pochi-bark'],
      jump: ['pochi-jump']
    };
    const setState = (s, ms = 0) => { state = s; stateUntil = ms ? performance.now() + ms : 0; tick = 0; };
    const animT = setInterval(() => {
      if (stateUntil && performance.now() > stateUntil) setState('idle');
      const seq = SEQ[state];
      let n = seq[tick % seq.length];
      if (state === 'idle') {
        n = seq[Math.floor(tick / 4) % 2];
        if (tick % 37 === 36) n = 'pochi-blink';
      }
      tick++;
      if (n !== cur) { cur = n; pimg.src = PX.url(n); }
      pimg.style.translate = state === 'run' && tick % 2 ? `0 ${-SC}px` : '0 0';
    }, 95);
    st(() => clearInterval(animT));

    const place = () => {
      pup.style.transform = `translate(${px}px, ${py}px)`;
      pup.classList.toggle('left', facing < 0);
    };
    const moveTo = async (x, y, dur, arc = 0) => {
      facing = x < px ? -1 : x > px ? 1 : facing;
      pup.classList.toggle('left', facing < 0);
      const from = `translate(${px}px, ${py}px)`, to = `translate(${x}px, ${y}px)`;
      const kf = arc
        ? [{ transform: from, easing: 'ease-out' }, { transform: `translate(${(px + x) / 2}px, ${Math.min(py, y) - arc}px)`, easing: 'ease-in' }, { transform: to }]
        : [{ transform: from }, { transform: to }];
      const a = await anim(pup, kf, { duration: dur, easing: arc ? 'linear' : 'ease-in-out' });
      px = x; py = y;
      place();
      a.cancel();
    };
    const bark = (txt) => {
      setState('bark', 480);
      const r = pup.getBoundingClientRect();
      floatText(el, r.left + r.width * (facing > 0 ? 0.8 : 0.2), r.top, txt || pick(['¡guau!', '¡guau guau!', '♥', '¡te quiero!']));
    };
    const dust = () => {
      const r = pup.getBoundingClientRect();
      burst(el, r.left + r.width * (facing > 0 ? 0.2 : 0.8), r.bottom - 4, { names: ['sparkle-s'], n: 2, spread: 24, scale: 2, up: 0 });
    };
    const onCard = () => {
      const b = el.getBoundingClientRect(), c = card.getBoundingClientRect();
      return { minX: c.left - b.left - PW * 0.15, maxX: c.right - b.left - PW * 0.85, y: Math.max(c.top - b.top - PH + 6, 6) };
    };
    let busyPup = false;
    const action = async () => {
      if (busyPup) return;
      busyPup = true;
      const o = onCard();
      const r = Math.random();
      if (r < 0.3) {
        setState('jump');
        await anim(pup, [{ transform: `translate(${px}px, ${py}px)` }, { transform: `translate(${px}px, ${py - 46}px)`, easing: 'ease-in' }, { transform: `translate(${px}px, ${py}px)` }], { duration: 560, easing: 'ease-out', fill: 'none' });
        dust();
        bark();
      } else if (r < 0.65) {
        const nx = clamp(rand(o.minX, o.maxX), o.minX, o.maxX);
        setState('run');
        const dustT = setInterval(dust, 260);
        await moveTo(nx, o.y, clamp(Math.abs(nx - px) * 4, 500, 1800));
        clearInterval(dustT);
        setState('idle');
      } else if (r < 0.85) {
        setState('happy', 1500);
        bark(pick(['♥', '¡guau!']));
        setState('happy', 1500);
        const pr = pup.getBoundingClientRect();
        burst(el, pr.left + pr.width / 2, pr.top + 10, { names: ['heart-s', 'heart-s-rose'], n: 5, spread: 50, scale: 3, up: 40 });
        await wait(1500);
      } else {
        facing = -facing;
        place();
        await wait(500);
        bark();
      }
      busyPup = false;
    };

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), sign = card.querySelector('.sign');
        hide(card, words, eb, sign, paws, sun, house);
        anim(sun, [{ opacity: 0, transform: 'translateY(40px) rotate(-60deg)' }, { opacity: 1, transform: 'none' }], { duration: 1500, easing: E.out });
        anim(house, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 300, easing: E.back });
        const W = el.clientWidth, Hh = el.clientHeight;
        const ground = Hh - (small() ? 150 : 128) - PH;
        py = ground; px = -PW - 40; place();
        setState('run');
        const dustT = setInterval(dust, 240);
        await moveTo(W / 2 - PW / 2, ground, 2000);
        clearInterval(dustT);
        setState('idle');
        await wait(200);
        bark('¡guau!');
        const er = env.getBoundingClientRect(), cr = card.getBoundingClientRect();
        const dx = cr.left + cr.width / 2 - (er.left + er.width / 2), dy = cr.top + cr.height / 2 - (er.top + er.height / 2);
        await anim(env, [
          { transform: 'none', opacity: 1 },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) rotate(-20deg) scale(2)`, opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(3.4)`, opacity: 0 }
        ], { duration: 900, easing: E.inOut });
        env.style.visibility = 'hidden';
        burst(el, cr.left + cr.width / 2, cr.top + cr.height / 2, { names: ['heart-s', 'heart-s-rose', 'sparkle', 'paw'], n: 16, spread: 150, scale: 3 });
        await anim(card, [{ opacity: 0, transform: 'scale(0.3) rotate(-6deg)' }, { opacity: 1, transform: 'scale(1.03)', offset: 0.7 }, { opacity: 1, transform: 'none' }], { duration: 750, easing: E.out });
        paws.forEach((p, i) => anim(p, [{ opacity: 0, transform: 'scale(1.8)' }, { opacity: 0.55, transform: 'scale(1)' }], { duration: 350, delay: 200 + i * 220, easing: E.in }));
        const o = onCard();
        setState('jump');
        moveTo(clamp(o.maxX - 10, o.minX, o.maxX), o.y, 900, 120).then(() => { dust(); setState('happy', 1400); bark('♥'); setState('happy', 1400); });
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2100, duration: 600, easing: E.back, from: { opacity: 0, transform: 'translateY(10px) scale(0.8)' } });
        await fadeUp([sign], { y: 6 });
        st(every(action, 2400, 4200, 1200));
        st(every(() => { ball.classList.remove('roll'); void ball.offsetWidth; ball.classList.add('roll'); }, 6000, 9000, 3000));
      },
      destroy() { st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     MEW — cielo de ensueño con burbujas; llega dentro de una
     burbuja psíquica, revela el mensaje y vuela alrededor de
     la carta riéndose, girando y dejando destellos
     --------------------------------------------------------- */
  function mewTheme({ msg }) {
    const el = sceneBase('th-mew', '#1a1036');
    const st = stopper();
    /* espacio: estrellas en capas que titilan, nebulosas, galaxia en espiral,
       un planeta grande que gira con su luna, asteroides y cometas */
    const sky = Array.from({ length: small() ? 150 : 280 }, () => ({
      x: Math.random(), y: Math.random(), z: pick([1, 1, 1, 2, 2, 3]), ph: rand(0, 6.28), sp: rand(0.5, 2.2),
      c: pick(['#ffffff', '#ffe9f3', '#e0d4ff', '#cfe9ff', '#fff2b8'])
    }));
    const sf = canvasLayer(el, (ctx, w, hh, dt, t) => {
      sky.forEach((q) => {
        q.x -= dt * 0.005 * q.z;
        if (q.x < 0) q.x += 1;
        const x = Math.round(q.x * w + FX.pointer.x * q.z * 8), y = Math.round(q.y * hh + FX.pointer.y * q.z * 5);
        const a = 0.3 + 0.7 * Math.abs(Math.sin((t / 1000) * q.sp + q.ph));
        ctx.globalAlpha = a;
        ctx.fillStyle = q.c;
        ctx.fillRect(x, y, q.z, q.z);
        if (q.z === 3 && a > 0.85) {
          ctx.globalAlpha = (a - 0.85) * 5;
          ctx.fillRect(x - 3, y + 1, 9, 1);
          ctx.fillRect(x + 1, y - 3, 1, 9);
        }
      });
      ctx.globalAlpha = 1;
    }, 'layer m-stars');
    st(() => sf.stop());
    el.appendChild(depth(h('div', 'm-nebula', '<i></i><i></i><i></i>'), 4));
    el.appendChild(depth(h('div', 'm-galaxy', '<i></i><i></i>'), 7));
    const planetBig = depth(h('div', 'm-planet', '<i class="mpl-ring back"></i><i class="mpl-body"><i class="mpl-surface"></i></i><i class="mpl-ring front"></i><i class="mpl-orbit"></i>'), 12);
    planetBig.querySelector('.mpl-orbit').appendChild(PX.img('moon', small() ? 2 : 3, 'mpl-moon'));
    el.appendChild(planetBig);
    el.appendChild(depth(PX.img('planet', small() ? 3 : 4, 'm-pl p1'), 18));
    el.appendChild(depth(PX.img('planet-teal', small() ? 2 : 3, 'm-pl p2'), 24));
    for (let i = 0; i < (small() ? 5 : 9); i++) {
      const r = h('span', 'm-rock');
      r.style.top = rand(5, 90) + '%';
      const sz = rand(6, 18);
      r.style.width = sz + 'px';
      r.style.height = sz * rand(0.7, 1) + 'px';
      r.style.setProperty('--d', rand(22, 48).toFixed(1) + 's');
      r.style.setProperty('--dl', (-rand(0, 48)).toFixed(1) + 's');
      r.style.setProperty('--rd', rand(4, 12).toFixed(1) + 's');
      el.appendChild(r);
    }
    st(shootingStars(el, [1600, 3600]));
    depth(floaters(el, small() ? 5 : 8, ['sparkle-pink', 'sparkle-s', 'heart-s']), 12);

    const wrap = h('div', 'mew-wrap tilt');
    const card = h('article', 'mew-card scroll');
    card.innerHTML = '<p class="eyebrow">alguien vino a saludarte</p><div class="mc-body"></div><p class="sign"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.mc-body').appendChild(frag);
    card.querySelector('.sign').textContent = '— ' + msg.de;
    wrap.appendChild(card);
    el.appendChild(wrap);

    const SC = small() ? 4 : 5;
    const mew = h('div', 'mew');
    const inner = h('div', 'mew-inner');
    const mimg = PX.img('mew-f0', SC, 'mew-img');
    inner.appendChild(mimg);
    let curFrame = 'mew-f0';
    const setFrame = (n) => { if (n !== curFrame) { curFrame = n; mimg.src = PX.url(n); } };
    const psy = h('i', 'psy');
    mew.append(psy, inner);
    el.appendChild(mew);
    const MW = 28 * SC, MH = 27 * SC;

    let mode = 'wait', x = -200, y = -200, a = -Math.PI / 2, holdX = 0, holdY = 0, lx = x, ly = y;
    let spinning = false, blinkUntil = 0, nextBlink = 0, winkUntil = 0;
    const trail = [];
    const layer = canvasLayer(el, (ctx, w, hh, dt, t) => {
      if (mode !== 'wait') {
        const b = el.getBoundingClientRect(), c = card.getBoundingClientRect();
        const cx = c.left - b.left + c.width / 2, cy = c.top - b.top + c.height / 2;
        let tx, ty;
        if (mode === 'orbit') {
          a += dt * 0.75;
          const rx = Math.min(c.width / 2 + MW * 0.35, w / 2 - MW * 0.35);
          const ry = Math.min(c.height / 2 + MH * 0.3, hh / 2 - MH * 0.45);
          tx = cx + Math.cos(a) * rx;
          ty = cy + Math.sin(a) * ry + Math.sin(a * 2) * 18;
        } else { tx = holdX; ty = holdY; }
        const k = Math.min(1, dt * (mode === 'orbit' ? 3.2 : 5));
        x += (tx - x) * k;
        y += (ty - y) * k;
        const vx = (x - lx) / Math.max(dt, 0.001), vy = (y - ly) / Math.max(dt, 0.001);
        lx = x; ly = y;
        const bob = Math.sin(t / 320) * 6;
        if (Math.abs(vx) > 8) mew.classList.toggle('left', vx < 0);
        /* cuadro de animacion segun lo que esta haciendo */
        if (!nextBlink) nextBlink = t + 2500;
        if (t > nextBlink) { blinkUntil = t + 140; nextBlink = t + rand(2200, 4200); }
        const speed = Math.hypot(vx, vy);
        if (spinning) setFrame('mew-curl');
        else if (mew.classList.contains('laughing')) setFrame(Math.floor(t / 150) % 2 ? 'mew-laugh1' : 'mew-laugh0');
        else if (t < winkUntil) setFrame('mew-wink');
        else if (t < blinkUntil) setFrame('mew-blink');
        else setFrame('mew-f' + (Math.floor(t / (speed > 90 ? 95 : 150)) % 4));
        /* se estira al subir y se aplasta al bajar */
        const sq = clamp(-vy * 0.0012, -0.1, 0.1);
        mew.style.transform = `translate(${x - MW / 2}px, ${y - MH / 2 + bob}px) rotate(${clamp(vx * 0.04, -16, 16)}deg) scale(${1 - sq * 0.6}, ${1 + sq})`;
        if (Math.random() < 0.6) trail.push({ x: x + rand(-14, 14), y: y + rand(0, 24) + bob, life: 0.9, c: pick(['#ffc2d8', '#ffffff', '#e0d4ff', '#ffe9a6']), s: pick([2, 3, 4]) });
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const q = trail[i];
        q.life -= dt;
        q.y += 12 * dt;
        if (q.life <= 0) { trail.splice(i, 1); continue; }
        ctx.globalAlpha = q.life / 0.9;
        ctx.fillStyle = q.c;
        ctx.fillRect(Math.round(q.x), Math.round(q.y), q.s, q.s);
      }
      ctx.globalAlpha = 1;
    }, 'layer mew-trail');

    const laugh = async () => {
      if (mode !== 'orbit') return;
      mode = 'hold'; holdX = x; holdY = y;
      mew.classList.add('laughing');
      floatText(el, x, y - MH / 2, pick(['jijiji ♥', '¡mew!', 'jeje', '¡mew mew!', 'jiji ✦']));
      burst(el, el.getBoundingClientRect().left + x, el.getBoundingClientRect().top + y, { names: ['heart-s', 'heart-s-rose', 'sparkle-pink'], n: 7, spread: 70, scale: 3, up: 30 });
      await wait(1700);
      mew.classList.remove('laughing');
      mode = 'orbit';
    };
    const spin = () => {
      if (mode !== 'orbit') return;
      spinning = true;
      anim(inner, [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(180deg) scale(1.15)' }, { transform: 'rotate(360deg) scale(1)' }], { duration: 750, easing: 'ease-in-out', fill: 'none' }).then(() => { spinning = false; });
      a += 0.6;
    };
    const tickle = () => {
      if (mode !== 'orbit') return;
      anim(card, [{ transform: 'none' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(1.5deg)' }, { transform: 'rotate(-1deg)' }, { transform: 'none' }], { duration: 500, easing: 'ease-in-out', fill: 'none' });
      winkUntil = performance.now() + 1200;
      floatText(el, x, y - MH / 2, pick(['¡cosquillas!', 'jiji']));
    };

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), sign = card.querySelector('.sign');
        hide(card, words, eb, sign);
        const W = el.clientWidth, Hh = el.clientHeight;
        x = -MW; y = Hh * 0.25; lx = x;
        holdX = W / 2; holdY = Hh * 0.45;
        mode = 'hold';
        mew.classList.add('bubbled');
        await wait(1700);
        mew.classList.remove('bubbled');
        const b = el.getBoundingClientRect();
        burst(el, b.left + x, b.top + y, { names: ['sparkle', 'sparkle-pink', 'sparkle-s', 'heart-s'], n: 18, spread: 130, scale: 3, up: 0 });
        mew.classList.add('laughing');
        floatText(el, x, y - MH / 2, '¡mew!');
        await wait(900);
        mew.classList.remove('laughing');
        mode = 'orbit';
        a = -Math.PI / 2;
        await anim(card, [
          { opacity: 0, transform: 'scale(0.4)', filter: 'blur(12px) hue-rotate(60deg)' },
          { opacity: 1, transform: 'scale(1.04)', filter: 'blur(0) hue-rotate(0deg)', offset: 0.7 },
          { opacity: 1, transform: 'none', filter: 'none' }
        ], { duration: 1000, easing: E.out });
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2300, duration: 800, from: { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-8px) scale(1.2)' } });
        await fadeUp([sign], { y: 6 });
        st(every(laugh, 3800, 6000, 1500));
        st(every(spin, 6500, 9000, 4500));
        st(every(tickle, 9000, 13000, 7000));
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* registro por nombre: { nombre: { fn, seal } } */
  window.THEMES_EXTRA = {
    oceano: { fn: mar, seal: 'teal' },
    cine: { fn: cine, seal: 'red' },
    nieve: { fn: nieve, seal: 'ice' },
    espacio: { fn: espacio, seal: 'indigo' },
    globos: { fn: globos, seal: 'coral' },
    luciernagas: { fn: bosque, seal: 'leaf' },
    musica: { fn: musica, seal: 'berry' },
    pochita: { fn: pochita, seal: 'orange' },
    mew: { fn: mewTheme, seal: 'blush' }
  };
})();
