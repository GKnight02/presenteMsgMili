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
          words.forEach((w, i) => setTimeout(() => { w.classList.add('sung'); if (i === words.length - 1) setTimeout(res, 400); }, FX.reduce.matches ? 0 : i * step));
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

  window.THEMES_EXTRA = [
    { fn: mar, seal: 'teal' },
    { fn: cine, seal: 'red' },
    { fn: nieve, seal: 'ice' },
    { fn: espacio, seal: 'indigo' },
    { fn: globos, seal: 'coral' },
    { fn: bosque, seal: 'leaf' },
    { fn: musica, seal: 'berry' }
  ];
})();
