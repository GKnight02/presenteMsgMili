/* =========================================================
   Escenas: intro, temas de cada carta, final y cofre
   Cada escena devuelve { el, enter(), destroy() }
   ========================================================= */
(function () {
  const { E, anim, wait, rand, pick, clamp, h, wordParagraphs, revealWords, stars, floaters, canvasLayer, depth, burst, floatText, shootingStars, hide, fadeUp, sceneBase, every, stopper } = FX;
  const centerOf = (e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------------------------------------------------------
     1) CARTA — el sobre cae, tiembla, estalla en corazones
        y la carta sube; el texto aparece como tinta
     --------------------------------------------------------- */
  function carta({ msg }) {
    const el = sceneBase('th-carta', '#f1d9bd');
    depth(floaters(el, 12, ['heart-s', 'heart-s-rose', 'heart-s', 'sparkle-s']), 14);
    const wrap = h('div', 'carta-wrap tilt');
    const letter = h('article', 'letter scroll');
    letter.innerHTML = '<div class="letter-stamp"></div><div class="letter-body"></div><p class="sign"><small>Con cariño,</small><span></span></p>';
    const stamp = letter.querySelector('.letter-stamp');
    stamp.appendChild(PX.img('heart-rose', 3));
    const { frag, words } = wordParagraphs(msg.mensaje);
    letter.querySelector('.letter-body').appendChild(frag);
    letter.querySelector('.sign span').textContent = msg.de;
    const env = PX.img('envelope', 8, 'carta-env');
    const post = h('div', 'postmark', '<span>con cariño</span><b>♥</b><span>para ti</span>');
    letter.appendChild(post);
    const dried = ['flower-peach', 'flower-lilac'].map((n, i) => { const f = PX.img(n, 3, 'dried d' + i); letter.appendChild(f); return f; });
    const pencil = depth(h('i', 'pencil'), 18);
    const cup = depth(h('div', 'cup', '<i class="steam s1"></i><i class="steam s2"></i><i class="steam s3"></i>'), 12);
    el.append(pencil, cup);
    wrap.append(letter, env);
    el.append(wrap);
    const st = stopper();
    const poke = () => {
      const [x, y] = centerOf(stamp);
      burst(el, x, y, { n: 8, spread: 70 });
      anim(stamp, [{ transform: 'rotate(6deg) scale(1)' }, { transform: 'rotate(-8deg) scale(1.2)' }, { transform: 'rotate(6deg) scale(1)' }], { duration: 450, easing: E.back, fill: 'none' });
    };
    stamp.addEventListener('click', poke);

    return {
      el,
      destroy() { st.stop(); },
      async enter() {
        const sign = letter.querySelector('.sign');
        hide(letter, env, words, sign, stamp, post, dried, pencil, cup);
        anim(pencil, [{ opacity: 0, transform: 'translateX(60px) rotate(30deg)' }, { opacity: 1, transform: 'rotate(-28deg)' }], { duration: 1200, delay: 600, easing: E.out });
        anim(cup, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 400, easing: E.out });
        await anim(env, [
          { opacity: 0, transform: 'translateY(-65vh) rotate(-28deg)' },
          { opacity: 1, transform: 'translateY(10px) rotate(6deg)', offset: 0.7 },
          { opacity: 1, transform: 'translateY(-6px) rotate(-2deg)', offset: 0.85 },
          { opacity: 1, transform: 'none' }
        ], { duration: 1100, easing: E.out, delay: 250 });
        await anim(env, [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg) scale(1.03)' }, { transform: 'rotate(6deg) scale(1.05)' }, { transform: 'rotate(-3deg) scale(1.07)' }, { transform: 'scale(1.08)' }], { duration: 600, easing: 'ease-in-out' });
        const r = env.getBoundingClientRect();
        burst(el, r.left + r.width / 2, r.top + r.height / 2, { n: 16, spread: 170, scale: 4 });
        anim(env, [{ opacity: 1, transform: 'scale(1.08)' }, { opacity: 0, transform: 'translateY(170px) scale(0.8)' }], { duration: 700, easing: E.in });
        await anim(letter, [
          { opacity: 0, transform: 'translateY(110px) scale(0.86) rotate(4deg)' },
          { opacity: 1, transform: 'translateY(0) scale(1) rotate(-1deg)' }
        ], { duration: 950, easing: E.drawer, delay: 80 });
        anim(stamp, [{ opacity: 0, transform: 'rotate(40deg) scale(1.8)' }, { opacity: 1, transform: 'rotate(6deg) scale(1)' }], { duration: 500, easing: E.back });
        anim(post, [{ opacity: 0, transform: 'rotate(-14deg) scale(1.6)' }, { opacity: 0.75, transform: 'rotate(-14deg) scale(1)' }], { duration: 380, delay: 350, easing: E.in });
        dried.forEach((d, i) => anim(d, [{ opacity: 0, transform: 'scale(0.3) rotate(-90deg)' }, { opacity: 1, transform: `rotate(${i ? 18 : -22}deg)` }], { duration: 700, delay: 500 + i * 200, easing: E.back }));
        await revealWords(words, { total: 1700, maxStep: 45, duration: 520, from: { opacity: 0, transform: 'translateX(-5px)', filter: 'blur(3px)' } });
        await anim(sign, [{ opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], { duration: 1100, easing: E.inOut });
        const s = sign.getBoundingClientRect();
        burst(el, s.right - 20, s.top + s.height / 2, { n: 6, spread: 50, scale: 2 });
        st(every(poke, 3800, 6000, 1500));
        st(every(() => {
          const r = letter.getBoundingClientRect();
          burst(el, pick([r.left + 10, r.right - 10]), rand(r.top + 40, r.bottom - 40), { n: 4, spread: 60, scale: 3, up: 60 });
        }, 2200, 3600, 800));
      }
    };
  }

  /* ---------------------------------------------------------
     2) NOCHE — cielo con profundidad, estrellas fugaces y
        una constelación en forma de corazón que se dibuja
     --------------------------------------------------------- */
  function noche({ msg }) {
    const el = sceneBase('th-noche', '#1b1840');
    const st = stopper();
    el.appendChild(depth(h('div', 'aurora', '<i></i><i></i><i></i>'), 3));
    el.appendChild(depth(h('div', 'noche-hills'), 8));
    const many = innerWidth < 600 ? 1 : 1.7;
    depth(stars(el, Math.round(30 * many), ['sparkle-s']), 4);
    depth(stars(el, Math.round(18 * many)), 14);
    const moon = depth(PX.img('moon', 6, 'noche-moon'), 26);
    el.appendChild(moon);
    const stopShoot = shootingStars(el);

    const box = h('div', 'noche-text scroll tilt');
    const pts = [[50, 90], [20, 60], [10, 34], [24, 12], [42, 14], [50, 30], [58, 14], [76, 12], [90, 34], [80, 60]];
    const constel = h('div', 'constel');
    constel.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="${pts.map((p) => p.join(',')).join(' ')}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`;
    const cstars = pts.map(([x, y], i) => {
      const s = PX.img(i % 3 ? 'sparkle-s' : 'sparkle', i % 3 ? 3 : 2, 'cstar');
      s.style.left = x + '%';
      s.style.top = y + '%';
      constel.appendChild(s);
      return s;
    });
    const eb = h('p', 'eyebrow', 'una estrella para ti');
    const body = h('div', 'noche-body');
    const { frag, words } = wordParagraphs(msg.mensaje);
    body.appendChild(frag);
    const sign = h('p', 'noche-sign');
    sign.appendChild(PX.img('star', 2));
    sign.appendChild(document.createTextNode(' ' + msg.de));
    box.append(constel, eb, body, sign);
    el.appendChild(box);

    return {
      el,
      async enter() {
        hide(eb, sign, words, cstars);
        anim(moon, [{ opacity: 0, transform: 'translateY(-30px) rotate(-20deg) scale(0.9)' }, { opacity: 1, transform: 'none' }], { duration: 1600, easing: E.out });
        cstars.forEach((s, i) => anim(s, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(0.3)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 500, delay: 200 + i * 110, easing: E.back }));
        anim(constel.querySelector('polygon'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1800, delay: 700, easing: E.inOut });
        fadeUp([eb], { delay: 500 });
        await revealWords(words, { total: 2600, delay: 900, duration: 1000, from: { opacity: 0, filter: 'blur(10px)', transform: 'translateY(6px) scale(1.15)' } });
        await anim(sign, [{ opacity: 0, letterSpacing: '0.5em' }, { opacity: 1, letterSpacing: '0.08em' }], { duration: 1200, easing: E.out });
        const r = constel.getBoundingClientRect();
        burst(el, r.left + r.width / 2, r.top + r.height / 2, { names: ['sparkle', 'sparkle-s', 'sparkle-pink'], n: 12, spread: 110, scale: 2, up: 0 });
        constel.classList.add('glow');
        st(every(() => {
          const x = rand(innerWidth * 0.08, innerWidth * 0.92), y = rand(innerHeight * 0.08, innerHeight * 0.4);
          burst(el, x, y, { names: ['sparkle', 'sparkle-pink', 'star'], n: 6, spread: 50, scale: 2, up: 0, z: 1 });
          floatText(el, x, y, pick(['un deseo ✦', '✦', 'para ti ✦']), 'wish');
        }, 3500, 6000, 1500));
        st(every(() => cstars.forEach((s, i) => anim(s, [{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-50%,-50%) scale(1.7)' }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: 500, delay: i * 70, fill: 'none' })), 5000, 7000, 3000));
      },
      destroy() { stopShoot(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     3) JARDÍN — flores que crecen y reaccionan al tocarlas,
        polen flotando y una mariposa que se posa en la tarjeta
     --------------------------------------------------------- */
  function jardin({ msg }) {
    const el = sceneBase('th-jardin', '#cdeccf');
    depth(floaters(el, 12, ['sparkle-s']), 10).classList.add('pollen');
    const garden = depth(h('div', 'garden'), 5);
    const count = clamp(Math.round(innerWidth / 64), 6, 18);
    const names = ['stem-pink', 'stem-lilac', 'stem-white', 'stem-peach', 'stem-sky'];
    const flowers = [];
    const poke = (f) => {
      const r = f.getBoundingClientRect();
      burst(el, r.left + r.width / 2, r.top + 10, { n: 6, spread: 50, scale: 2, names: ['heart-s', 'sparkle-s', 'heart-s-rose'] });
      anim(f.firstChild, [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-12deg) scale(1.08, 0.92)' }, { transform: 'rotate(9deg) scale(0.96, 1.06)' }, { transform: 'rotate(-4deg)' }, { transform: 'none' }], { duration: 700, easing: 'ease-out', fill: 'none' });
    };
    for (let i = 0; i < count; i++) {
      const f = h('span', 'gflower');
      f.style.left = ((i + 0.5) / count) * 100 + rand(-2, 2) + '%';
      f.style.setProperty('--sd', rand(2.6, 4.2).toFixed(2) + 's');
      f.style.setProperty('--sdl', (-rand(0, 3)).toFixed(2) + 's');
      f.style.zIndex = (Math.random() * 3) | 0;
      f.appendChild(PX.img(pick(names), innerWidth < 600 ? 3 : 4));
      f.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') poke(f); });
      f.addEventListener('click', () => poke(f));
      garden.appendChild(f);
      flowers.push(f);
    }
    garden.appendChild(h('div', 'grass'));
    el.appendChild(garden);
    ['butterfly', 'butterfly-pink'].forEach((n, i) => {
      const b = h('span', `bfly b${i + 1}`);
      b.appendChild(PX.img(n, 3));
      el.appendChild(b);
    });

    const wrap = h('div', 'jardin-wrap tilt');
    const card = h('article', 'jardin-card scroll');
    card.innerHTML = '<header><span class="jc-icon"></span><p class="eyebrow">para que florezcas</p></header><div class="jc-body"></div><p class="sign"></p>';
    card.querySelector('.jc-icon').appendChild(PX.img('flower', 2));
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.jc-body').appendChild(frag);
    card.querySelector('.sign').textContent = '— ' + msg.de;
    const lander = h('span', 'lander');
    lander.appendChild(PX.img('butterfly-sky', 3));
    const bug = h('span', 'ladybug');
    bug.appendChild(PX.img('ladybug', 3));
    const holder = h('div', 'card-holder');
    holder.append(card, lander, bug);
    wrap.appendChild(holder);
    el.appendChild(wrap);
    el.appendChild(depth(h('div', 'sun-glow'), 4));
    const st = stopper();

    return {
      el,
      destroy() { st.stop(); },
      async enter() {
        bug.style.opacity = '0';
        const sign = card.querySelector('.sign'), head = card.querySelector('header');
        hide(card, words, sign, head, lander);
        flowers.forEach((f) =>
          anim(f.firstChild, [
            { clipPath: 'inset(100% 0 0 0)', transform: 'scaleY(0.6)' },
            { clipPath: 'inset(0 0 0 0)', transform: 'scaleY(1.08)', offset: 0.75 },
            { clipPath: 'inset(0 0 0 0)', transform: 'none' }
          ], { duration: 1200, delay: 150 + rand(0, 800), easing: E.out })
        );
        await anim(card, [{ opacity: 0, transform: 'translateY(40px) scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: E.back, delay: 500 });
        fadeUp([head], { y: 8 });
        anim(lander, [
          { opacity: 1, transform: 'translate(-75vw, 45vh) rotate(-30deg)' },
          { opacity: 1, transform: 'translate(-30vw, -12vh) rotate(10deg)', offset: 0.45 },
          { opacity: 1, transform: 'translate(-6vw, 4vh) rotate(-10deg)', offset: 0.8 },
          { opacity: 1, transform: 'none' }
        ], { duration: 3000, easing: E.inOut }).then(() => lander.classList.add('rest'));
        await revealWords(words, { total: 2000, duration: 600, easing: E.back, from: { opacity: 0, transform: 'translateY(0.5em) scale(0.85)' } });
        await fadeUp([sign], { y: 6 });
        bug.style.opacity = '';
        bug.classList.add('walk');
        st(every(() => poke(pick(flowers)), 1100, 2200, 400));
        st(every(() => {
          const r = card.getBoundingClientRect();
          floatText(el, rand(r.left + 40, r.right - 40), r.top - 6, pick(['♥', '✿', '¡florece!', '♥']));
        }, 4200, 6500, 2500));
      }
    };
  }

  /* ---------------------------------------------------------
     4) RPG — conejito, vida que se llena, máquina de escribir
        y "¡+999 AMOR!" al terminar
     --------------------------------------------------------- */
  function rpg({ msg }) {
    const el = sceneBase('th-rpg', '#e6d4ff');
    const hud = h('div', 'rpg-hud');
    const hp = h('div', 'hp', '<b>HP</b>');
    const hearts = [];
    for (let i = 0; i < 5; i++) { const im = PX.img('heart-s-empty', 3); hp.appendChild(im); hearts.push(im); }
    const lv = h('div', 'lv', 'LV <b>∞</b>');
    hud.append(hp, lv);
    const banner = h('p', 'rpg-banner', '★ ¡Mensaje recibido! ★');
    const hero = h('button', 'rpg-hero');
    hero.type = 'button';
    hero.setAttribute('aria-label', 'Conejito');
    const sprite = PX.img('bunny', innerWidth < 600 ? 4 : 6, 'hero-sprite');
    hero.appendChild(sprite);
    const orbit = h('div', 'orbit');
    ['heart-s', 'sparkle', 'heart-s-rose'].forEach((n) => { const s = h('span'); s.appendChild(PX.img(n, 3)); orbit.appendChild(s); });
    hero.appendChild(orbit);
    const shadow = h('i', 'hero-shadow');
    hero.appendChild(shadow);
    const box = h('div', 'rpg-box');
    box.innerHTML = '<div class="rpg-name"></div><div class="rpg-text scroll"><span class="shown"></span><span class="rest"></span></div><span class="rpg-caret">▼</span>';
    box.querySelector('.rpg-name').textContent = msg.de;
    const text = String(msg.mensaje).trim();
    const shown = box.querySelector('.shown'), rest = box.querySelector('.rest'), caret = box.querySelector('.rpg-caret');
    rest.textContent = text;
    el.append(hud, banner, hero, box);

    const jump = (big) => {
      const r = sprite.getBoundingClientRect();
      anim(sprite, [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(4px) scale(1.12, 0.88)', offset: 0.15 },
        { transform: `translateY(${big ? -60 : -34}px) scale(0.94, 1.06)`, offset: 0.5 },
        { transform: 'translateY(2px) scale(1.08, 0.92)', offset: 0.85 },
        { transform: 'translateY(0) scale(1)' }
      ], { duration: big ? 750 : 560, easing: 'ease-in-out', fill: 'none' });
      burst(el, r.left + r.width / 2, r.top + r.height * 0.3, { n: big ? 14 : 6, spread: big ? 140 : 70 });
    };
    hero.addEventListener('click', () => {
      jump(false);
      const r = sprite.getBoundingClientRect();
      floatText(el, r.left + r.width / 2, r.top, pick(['+1 ♥', '¡abrazo!', '+1 ánimo', '¡yay!']));
    });

    let raf, k = 0, done = false, celebrated = false;
    const celebrate = () => {
      if (celebrated) return;
      celebrated = true;
      const r = sprite.getBoundingClientRect();
      jump(true);
      floatText(el, r.left + r.width / 2, r.top - 10, '+999 AMOR', 'big');
      anim(lv, [{ transform: 'scale(1)' }, { transform: 'scale(1.35)', color: '#f2506b' }, { transform: 'scale(1)' }], { duration: 600, easing: E.back, fill: 'none' });
    };
    const exp = h('div', 'exp', '<b>EXP</b><i><u></u></i>');
    hud.appendChild(exp);
    const expBar = exp.querySelector('u');
    const coins = h('div', 'coins');
    el.appendChild(coins);
    let typed;
    const typedP = new Promise((r) => (typed = r));
    const finish = () => {
      if (done) return;
      done = true; cancelAnimationFrame(raf); shown.textContent = text; rest.textContent = ''; caret.classList.add('on');
      expBar.style.transform = 'scaleX(1)';
      celebrate();
      setTimeout(typed, 900);
    };
    box.addEventListener('click', () => { if (!done) finish(); });
    const st = stopper();
    const autoPlay = () => {
      jump(false);
      const r = sprite.getBoundingClientRect();
      floatText(el, r.left + r.width / 2, r.top, pick(['+1 ♥', '¡abrazo!', '+1 ánimo', '¡yay!', '+10 fuerza', '¡tú puedes!']));
      const c = PX.img(pick(['star', 'heart-s', 'heart-s-rose']), 3, 'coin');
      c.style.left = rand(10, 90) + '%';
      coins.appendChild(c);
      anim(c, [{ transform: 'translateY(-10vh) rotate(0)', opacity: 1 }, { transform: 'translateY(110vh) rotate(360deg)', opacity: 1 }], { duration: rand(2200, 3400), easing: 'linear' }).then(() => c.remove());
    };

    return {
      el,
      destroy() { done = true; cancelAnimationFrame(raf); st.stop(); },
      async enter() {
        hide(hud, banner, hero, box);
        anim(hud, [{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 150 });
        hearts.forEach((im, i) => setTimeout(() => {
          im.src = PX.url('heart-s-rose');
          anim(im, [{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300, easing: E.back, fill: 'none' });
        }, 700 + i * 160));
        anim(banner, [
          { opacity: 0, transform: 'scale(0.6) rotate(-4deg)' },
          { opacity: 1, transform: 'scale(1.1) rotate(2deg)', offset: 0.6 },
          { opacity: 1, transform: 'scale(1) rotate(0)' }
        ], { duration: 600, easing: E.out, delay: 300 });
        anim(hero, [{ opacity: 0, transform: 'translateY(-60vh)' }, { opacity: 1, transform: 'translateY(0)', offset: 0.7 }, { opacity: 1, transform: 'translateY(-14px)', offset: 0.85 }, { opacity: 1, transform: 'none' }], { duration: 900, easing: E.in, delay: 450 })
          .then(() => { const r = sprite.getBoundingClientRect(); burst(el, r.left + r.width / 2, r.bottom - 6, { names: ['sparkle-s'], n: 8, spread: 60, up: 0, scale: 3 }); });
        await anim(box, [{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: E.drawer, delay: 900 });
        st(every(autoPlay, 2600, 4200, 2200));
        if (FX.reduce.matches) { finish(); return typedP; }
        const cps = Math.max(38, text.length / 6);
        let last = performance.now();
        const tick = (t) => {
          if (done) return;
          k = Math.min(text.length, k + ((t - last) / 1000) * cps);
          last = t;
          const n = Math.floor(k);
          shown.textContent = text.slice(0, n);
          rest.textContent = text.slice(n);
          expBar.style.transform = `scaleX(${n / text.length})`;
          if (n >= text.length) return finish();
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return typedP;
      }
    };
  }

  /* ---------------------------------------------------------
     5) SCRAPBOOK — nota que cae, cintas que se pegan, stickers
        que rebotan y garabatos dibujados a mano
     --------------------------------------------------------- */
  function scrapbook({ msg }) {
    const el = sceneBase('th-scrap', '#e8d3b6');
    const wrap = h('div', 'scrap-wrap tilt');
    const note = h('article', 'note');
    note.innerHTML = '<i class="tape t1"></i><i class="tape t2"></i><div class="note-inner scroll"><p class="eyebrow">guardado con cariño</p><div class="note-body"></div><p class="sign"><span></span><svg class="underline" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 25 2, 55 12, 98 4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></p></div>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    note.querySelector('.note-body').appendChild(frag);
    const sign = note.querySelector('.sign');
    sign.querySelector('span').textContent = 'con amor, ' + msg.de;
    sign.appendChild(PX.img('heart-s-rose', 2));
    const doodles = h('div', 'doodles');
    doodles.innerHTML =
      '<svg class="d1" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 34 C 4 22, 6 6, 20 14 C 34 6, 36 22, 20 34 Z" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>' +
      '<svg class="d2" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 32 C 10 6, 32 4, 32 20 C 32 30, 18 30, 18 22 C 18 15, 27 15, 27 22" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>' +
      '<svg class="d3" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4 L 23 16 L 36 17 L 26 24 L 30 36 L 20 29 L 10 36 L 14 24 L 4 17 L 17 16 Z" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
    const stickers = [['strawberry', 's1', 4, -12], ['bow', 's2', 3, 10], ['star-pink', 's3', 3, 14], ['flower-peach', 's4', 3, -8], ['heart-rose', 's5', 3, 6]].map(([n, c, sc, r]) => {
      const s = h('button', 'sticker ' + c);
      s.type = 'button';
      s.setAttribute('aria-label', 'Sticker');
      s.style.setProperty('--r', r + 'deg');
      s.dataset.r = r;
      s.appendChild(PX.img(n, sc));
      s.addEventListener('click', () => {
        const b = s.getBoundingClientRect();
        burst(el, b.left + b.width / 2, b.top + b.height / 2, { n: 7, spread: 60, scale: 2 });
        anim(s, [{ transform: `rotate(${r}deg) scale(1)` }, { transform: `rotate(${r - 25}deg) scale(1.3)` }, { transform: `rotate(${r + 15}deg) scale(0.95)` }, { transform: `rotate(${r}deg) scale(1)` }], { duration: 550, easing: E.back, fill: 'none' });
      });
      return s;
    });
    const clip = h('i', 'paperclip');
    note.appendChild(clip);
    const polaroid = h('div', 'polaroid', '<div class="pol-pic"></div><span>nosotros ♥</span>');
    polaroid.querySelector('.pol-pic').appendChild(PX.img('bunny', 3));
    const holder = h('div', 'card-holder');
    holder.append(doodles, polaroid, note, ...stickers);
    wrap.appendChild(holder);
    el.appendChild(wrap);
    const st = stopper();

    return {
      el,
      destroy() { st.stop(); },
      async enter() {
        hide(polaroid, clip);
        anim(polaroid, [{ opacity: 0, transform: 'translate(40px, -30px) rotate(30deg)' }, { opacity: 1, transform: 'rotate(-9deg)' }], { duration: 900, delay: 900, easing: E.back });
        anim(clip, [{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 700, easing: E.back });
        const eb = note.querySelector('.eyebrow'), tapes = [...note.querySelectorAll('.tape')];
        hide(note, stickers, words, sign, eb, tapes);
        await anim(note, [
          { opacity: 0, transform: 'translateY(-90px) rotate(-12deg) scale(1.06)' },
          { opacity: 1, transform: 'translateY(8px) rotate(3deg) scale(1)', offset: 0.7 },
          { opacity: 1, transform: 'translateY(0) rotate(1.5deg) scale(1)' }
        ], { duration: 850, easing: E.out, delay: 200 });
        tapes.forEach((t, i) => {
          const rot = i ? 28 : -32;
          anim(t, [{ opacity: 0, transform: `rotate(${rot}deg) scaleX(0.2)` }, { opacity: 1, transform: `rotate(${rot}deg) scaleX(1)` }], { duration: 380, delay: i * 140, easing: E.out });
        });
        stickers.forEach((s, i) =>
          anim(s, [{ opacity: 0, transform: 'scale(0.4) rotate(-60deg)' }, { opacity: 1, transform: `scale(1) rotate(${s.dataset.r}deg)` }], { duration: 560, easing: E.back, delay: 250 + i * 110 })
        );
        doodles.querySelectorAll('path').forEach((p, i) => anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, delay: 600 + i * 350, easing: E.inOut }));
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2200, maxStep: 55, duration: 450, from: { opacity: 0, transform: 'translateY(5px) rotate(-6deg)' } });
        await anim(sign, [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 500 });
        await anim(sign.querySelector('.underline path'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700, easing: E.inOut });
        let k = 0;
        st(every(() => stickers[k++ % stickers.length].click(), 1500, 2600, 300));
        st(every(() => doodles.querySelectorAll('path').forEach((p, i) => anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1100, delay: i * 300, easing: E.inOut })), 7000, 9000, 6000));
      }
    };
  }

  /* ---------------------------------------------------------
     6) LLUVIA → ARCOÍRIS — relámpago, viento que sigue al
        puntero, las nubes se abren y sale el sol
     --------------------------------------------------------- */
  function lluvia({ msg }) {
    const el = sceneBase('th-lluvia', '#bfe0ff');
    const clear = h('div', 'sky-clear');
    el.appendChild(clear);
    const sun = depth(PX.img('sun', 5, 'll-sun'), 18);
    const rb = depth(h('div', 'rainbow'), 8);
    const colors = ['#ff9aa8', '#ffc48a', '#ffe38a', '#a8e6a1', '#9ccfff', '#c3a8ff'];
    rb.innerHTML = `<svg viewBox="0 0 220 115" aria-hidden="true">${colors.map((c, i) => {
      const r = 100 - i * 9;
      return `<path d="M ${110 - r} 112 A ${r} ${r} 0 0 1 ${110 + r} 112" stroke="${c}" stroke-width="9" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`;
    }).join('')}</svg>`;
    const clouds = [PX.img('cloud', 5, 'll-cloud c1'), PX.img('cloud', 4, 'll-cloud c2')].map((c, i) => depth(c, 12 + i * 8));
    const storm = [0, 1, 2].map((i) => depth(PX.img('cloud', innerWidth < 600 ? 6 : 9, 'storm s' + i), 6 + i * 6));
    const flash = h('div', 'flash');
    const puddles = h('div', 'puddles');
    for (let i = 0; i < 4; i++) { const p = h('i'); p.style.left = 8 + i * 24 + rand(-4, 4) + '%'; p.style.setProperty('--dl', (-rand(0, 2)).toFixed(2) + 's'); puddles.appendChild(p); }
    el.append(sun, rb, ...clouds, ...storm, puddles, flash);
    const st = stopper();

    let rainI = 1;
    const drops = Array.from({ length: innerWidth < 600 ? 90 : 170 }, () => ({ x: rand(-100, innerWidth + 100), y: rand(-innerHeight, innerHeight), v: rand(520, 900), l: rand(8, 16) }));
    const splashes = [];
    const layer = canvasLayer(el, (ctx, w, hh, dt) => {
      const wind = FX.pointer.x * 220;
      ctx.fillStyle = 'rgba(225,238,255,0.75)';
      drops.forEach((d) => {
        if (d.dead) return;
        d.y += d.v * dt;
        d.x += wind * dt;
        const lean = (wind / d.v) * d.l;
        ctx.fillRect(Math.round(d.x), Math.round(d.y), 2, Math.round(d.l * 0.5));
        ctx.fillRect(Math.round(d.x + lean * 0.5), Math.round(d.y + d.l * 0.5), 2, Math.round(d.l * 0.5));
        if (d.y > hh) {
          if (splashes.length < 80) splashes.push({ x: d.x, y: hh - 4, life: 0.3 });
          if (Math.random() < rainI) { d.y = rand(-60, -10); d.x = rand(-100, w + 100); } else d.dead = true;
        }
      });
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life -= dt;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(225,238,255,${s.life * 2.5})`;
        ctx.fillRect(s.x - 4, s.y - (0.3 - s.life) * 20, 2, 2);
        ctx.fillRect(s.x + 3, s.y - (0.3 - s.life) * 20, 2, 2);
      }
    });

    const card = h('article', 'lluvia-card scroll');
    card.innerHTML = '<p class="eyebrow">después de la lluvia</p><div class="ll-body"></div><p class="pill"></p>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.ll-body').appendChild(frag);
    card.querySelector('.pill').textContent = msg.de;
    const wrap = h('div', 'lluvia-wrap tilt');
    wrap.appendChild(card);
    el.appendChild(wrap);
    let stopped = false, timer;

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), pill = card.querySelector('.pill');
        hide(card, clear, sun, words, pill, eb, clouds);
        storm.forEach((s, i) => anim(s, [{ transform: 'translateY(-40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, delay: i * 120 }));
        await wait(600);
        anim(flash, [{ opacity: 0 }, { opacity: 0.85, offset: 0.08 }, { opacity: 0.1, offset: 0.2 }, { opacity: 0.6, offset: 0.3 }, { opacity: 0 }], { duration: 700, easing: 'linear', fill: 'none' });
        await wait(900);
        if (stopped) return;
        const t0 = performance.now();
        timer = setInterval(() => { rainI = Math.max(0, 1 - (performance.now() - t0) / 1200); if (!rainI) clearInterval(timer); }, 60);
        storm.forEach((s, i) => anim(s, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${(i - 1 || -1) * 70}vw)`, opacity: 0 }], { duration: 2200, easing: E.inOut, delay: 200 + i * 100 }));
        anim(clear, [{ opacity: 0 }, { opacity: 1 }], { duration: 1800, easing: 'ease-in-out' });
        anim(sun, [{ opacity: 0, transform: 'translateY(80px) rotate(-90deg)' }, { opacity: 1, transform: 'none' }], { duration: 1800, easing: E.out, delay: 300 });
        clouds.forEach((c, i) => anim(c, [{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'none' }], { duration: 1400, delay: 900 + i * 200 }));
        const paths = [...rb.querySelectorAll('path')];
        paths.forEach((p, i) => anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1500, delay: 500 + i * 110, easing: E.inOut }));
        setTimeout(() => {
          if (stopped) return;
          const r = rb.getBoundingClientRect();
          burst(el, r.left + r.width * 0.08, r.bottom - 6, { names: ['sparkle', 'sparkle-s', 'sparkle-pink'], n: 8, spread: 60, scale: 2, z: 1 });
          burst(el, r.right - r.width * 0.08, r.bottom - 6, { names: ['sparkle', 'sparkle-s', 'sparkle-pink'], n: 8, spread: 60, scale: 2, z: 1 });
        }, 2300);
        await anim(card, [{ opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }], { duration: 1000, delay: 700 });
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2000, duration: 600, easing: E.back, from: { opacity: 0, transform: 'translateY(-16px)' } });
        await anim(pill, [{ opacity: 0, transform: 'scale(0.7) rotate(-6deg)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, easing: E.back });
        puddles.classList.add('calm');
        st(every(() => {
          const r = rb.getBoundingClientRect();
          const a = rand(0.1, 0.9) * Math.PI;
          const x = r.left + r.width / 2 - Math.cos(a) * r.width * 0.42, y = r.bottom - Math.sin(a) * r.height * 0.85;
          burst(el, x, y, { names: ['sparkle', 'sparkle-s', 'sparkle-pink', 'heart-s'], n: 5, spread: 40, scale: 2, up: 0, z: 2 });
        }, 900, 1700, 200));
        st(every(() => {
          const [x, y] = centerOf(sun);
          anim(sun, [{ transform: 'none' }, { transform: 'scale(1.15) rotate(20deg)' }, { transform: 'none' }], { duration: 900, easing: E.back, fill: 'none' });
          floatText(el, x, y, pick(['¡sale el sol!', '☀', '♥']));
        }, 6000, 8000, 3000));
      },
      destroy() { stopped = true; clearInterval(timer); layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     7) ATARDECER — sol con rayos girando, aves pixel,
        nubes con profundidad y una gran nube de texto
     --------------------------------------------------------- */
  function atardecer({ msg }) {
    const el = sceneBase('th-sunset', '#ffc9a8');
    const sun = h('div', 'sunset-sun');
    sun.append(h('i', 'rays'), PX.img('sun', innerWidth < 600 ? 9 : 13));
    el.appendChild(depth(h('div', 'sun-holder'), 6)).appendChild(sun);
    for (let i = 0; i < 7; i++) {
      const sc = pick([3, 4, 5, 6]);
      const holder = depth(h('div', 'cloud-holder'), sc * 4);
      const c = PX.img('cloud', sc, 'drift');
      holder.style.top = rand(3, 72) + '%';
      c.style.setProperty('--d', (110 - sc * 10 + rand(-10, 10)).toFixed(0) + 's');
      c.style.setProperty('--dl', (-rand(0, 90)).toFixed(0) + 's');
      c.style.opacity = (0.45 + sc * 0.08).toFixed(2);
      holder.appendChild(c);
      el.appendChild(holder);
    }
    const birdSvg = '<svg viewBox="0 0 9 4" shape-rendering="crispEdges" aria-hidden="true"><path d="M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM4 2h1v1H4zM5 1h1v1H5zM6 0h1v1H6zM7 0h1v1H7z" transform="translate(0.5 0)"/></svg>';
    for (let i = 0; i < 5; i++) {
      const b = h('span', 'bird', birdSvg);
      b.style.top = rand(8, 40) + '%';
      b.style.setProperty('--d', rand(16, 28).toFixed(1) + 's');
      b.style.setProperty('--dl', (-rand(0, 20)).toFixed(1) + 's');
      b.style.setProperty('--s', rand(0.7, 1.3).toFixed(2));
      el.appendChild(b);
    }
    const bf = h('span', 'bfly b3');
    bf.appendChild(PX.img('butterfly-sky', 3));
    el.appendChild(bf);
    const sea = depth(h('div', 'sunset-sea'), 4);
    for (let i = 0; i < 14; i++) {
      const g = h('i');
      g.style.left = rand(20, 80) + '%';
      g.style.top = rand(10, 90) + '%';
      g.style.width = rand(14, 50).toFixed(0) + 'px';
      g.style.setProperty('--dl', (-rand(0, 3)).toFixed(2) + 's');
      sea.appendChild(g);
    }
    el.appendChild(sea);
    const st = stopper();

    const bubble = h('article', 'cloud-bubble');
    bubble.innerHTML = '<div class="cb-inner scroll"><p class="eyebrow">pensando en ti</p><div class="cb-body"></div></div><i class="puff p1"></i><i class="puff p2"></i><i class="puff p3"></i>';
    const { frag, words } = wordParagraphs(msg.mensaje);
    bubble.querySelector('.cb-body').appendChild(frag);
    const tag = h('p', 'cb-tag');
    tag.appendChild(PX.img('heart-s', 2));
    tag.appendChild(document.createTextNode(' ' + msg.de));
    const wrap = h('div', 'cb-wrap tilt');
    const floaty = h('div', 'cb-float');
    floaty.append(bubble, tag);
    wrap.appendChild(floaty);
    el.appendChild(wrap);

    return {
      el,
      async enter() {
        const eb = bubble.querySelector('.eyebrow'), puffs = [...bubble.querySelectorAll('.puff')];
        hide(bubble, tag, words, eb, puffs);
        anim(sun, [{ transform: 'translate(-50%, 55%)' }, { transform: 'translate(-50%, 0)' }], { duration: 2400, easing: E.drawer });
        await anim(bubble, [
          { opacity: 0, transform: 'translateY(40px) scale(0.86)', borderRadius: '50%' },
          { opacity: 1, transform: 'translateY(-6px) scale(1.02)', offset: 0.7 },
          { opacity: 1, transform: 'none' }
        ], { duration: 1100, easing: E.out, delay: 400 });
        floaty.classList.add('floating');
        puffs.forEach((p, i) => anim(p, [{ opacity: 0, transform: 'scale(0.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 400, delay: i * 120, easing: E.back }));
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2400, duration: 900, from: { opacity: 0, transform: 'translateY(12px) scale(0.92)', filter: 'blur(5px)' } });
        await anim(tag, [{ opacity: 0, transform: 'translateY(-12px) scale(0.8)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: E.back });
        const r = tag.getBoundingClientRect();
        burst(el, r.left + 18, r.top + r.height / 2, { n: 8, spread: 60, scale: 2 });
        st(every(() => {
          const b = bubble.getBoundingClientRect();
          burst(el, rand(b.left + 30, b.right - 30), b.top + 10, { names: ['heart-s', 'sparkle-s', 'heart-s-rose'], n: 4, spread: 50, scale: 2, up: 50 });
        }, 1800, 3200, 600));
        st(every(() => {
          const t = tag.getBoundingClientRect();
          floatText(el, t.left + t.width / 2, t.top, pick(['♥', 'pensando en ti', '♥ ♥']));
        }, 5000, 7500, 2500));
      },
      destroy() { st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     8) SAKURA — ráfaga de pétalos, el puntero sopla viento,
        flores que se abren en la rama y tarjeta colgante
     --------------------------------------------------------- */
  function sakura({ msg }) {
    const el = sceneBase('th-sakura', '#ffd6e4');
    const branch = depth(h('div', 'branch'), 10);
    const blooms = ['flower-white', 'flower', 'flower-white', 'flower-white', 'flower', 'flower-white'].map((n, i) => {
      const f = PX.img(n, 3, 'bl b' + i);
      branch.appendChild(f);
      return f;
    });
    el.appendChild(branch);
    const lanterns = [12, 88, 74].map((x, i) => {
      const l = depth(h('span', 'lantern-hang'), 8 + i * 6);
      l.style.left = x + '%';
      l.style.setProperty('--len', [70, 40, 110][i] + 'px');
      l.style.setProperty('--sd', (-i * 0.9).toFixed(1) + 's');
      l.appendChild(PX.img('lantern', innerWidth < 600 ? 3 : 4));
      el.appendChild(l);
      return l;
    });
    if (innerWidth < 600) lanterns[0].style.display = 'none';
    const st = stopper();
    const petalSprite = PX.build('petal').canvas;
    let gust = 420;
    const petals = Array.from({ length: innerWidth < 600 ? 26 : 46 }, () => ({
      x: rand(-innerWidth * 0.6, innerWidth), y: rand(-innerHeight, innerHeight), vy: rand(30, 70), vx: rand(10, 40), ph: rand(0, 6.28), s: pick([2, 3, 3, 4]), r: rand(0, 6.28), vr: rand(-1.5, 1.5)
    }));
    const layer = canvasLayer(el, (ctx, w, hh, dt, t) => {
      gust *= Math.pow(0.35, dt);
      const wind = gust + FX.pointer.vx * 4;
      petals.forEach((p) => {
        p.y += p.vy * dt;
        p.x += (p.vx + wind + Math.sin(t / 900 + p.ph) * 30) * dt;
        p.r += (p.vr + wind * 0.004) * dt;
        if (p.y > hh + 20 || p.x > w + 40) { p.y = rand(-40, -10); p.x = rand(-60, w); }
        if (p.x < -60) p.x = w + 20;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.scale(p.s * Math.cos(t / 600 + p.ph), p.s);
        ctx.drawImage(petalSprite, -2.5, -2.5);
        ctx.restore();
      });
    });
    const hang = h('div', 'tanzaku-wrap');
    const card = h('article', 'tanzaku');
    card.innerHTML = '<span class="tz-rose"></span><div class="tz-inner scroll"><p class="eyebrow">con todo mi cariño</p><div class="tz-body"></div><p class="sign"></p></div>';
    card.querySelector('.tz-rose').appendChild(PX.img('rose', 3));
    const { frag, words } = wordParagraphs(msg.mensaje);
    card.querySelector('.tz-body').appendChild(frag);
    card.querySelector('.sign').textContent = msg.de;
    hang.append(h('i', 'tz-string'), card);
    const tilt = h('div', 'tz-tilt tilt');
    tilt.appendChild(hang);
    el.appendChild(tilt);
    card.querySelector('.tz-rose').addEventListener('click', (e) => {
      burst(el, e.clientX, e.clientY, { names: ['petal', 'heart-s'], n: 10, spread: 90, scale: 3 });
      gust = 300;
    });

    return {
      el,
      async enter() {
        const eb = card.querySelector('.eyebrow'), sign = card.querySelector('.sign');
        hide(words, sign, eb, blooms);
        anim(branch, [{ opacity: 0, transform: 'translateX(-40px) rotate(-6deg)' }, { opacity: 1, transform: 'none' }], { duration: 1000 });
        blooms.forEach((b, i) => anim(b, [{ opacity: 0, transform: 'scale(0.4) rotate(-120deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 700, delay: 500 + i * 140, easing: E.back }));
        await anim(hang, [
          { transform: 'translateY(-110vh) rotate(0deg)' },
          { transform: 'translateY(12px) rotate(4deg)', offset: 0.65 },
          { transform: 'translateY(-4px) rotate(-2.5deg)', offset: 0.82 },
          { transform: 'translateY(0) rotate(0deg)' }
        ], { duration: 1500, easing: E.out, delay: 150 });
        hang.classList.add('sway');
        fadeUp([eb], { y: 6 });
        await revealWords(words, { total: 2200, duration: 800, from: { opacity: 0, transform: 'translate(-12px, -8px) rotate(-10deg)' } });
        await fadeUp([sign], { y: 6 });
        gust = 260;
        st(every(() => {
          gust = rand(260, 420);
          const [x, y] = centerOf(card.querySelector('.tz-rose'));
          burst(el, x, y, { names: ['petal', 'heart-s'], n: 8, spread: 80, scale: 3 });
        }, 4500, 7000, 2500));
        st(every(() => blooms.forEach((b, i) => anim(b, [{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.3) rotate(25deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 600, delay: i * 90, fill: 'none', easing: E.back })), 6000, 8000, 4000));
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     REGISTRO DE ESTILOS
     Cada estilo tiene un nombre (el que se puede poner en
     mensajes.js con  estilo: 'nombre') y un color de sobre.
     ORDER es el orden por defecto de los 15 estilos.
     --------------------------------------------------------- */
  const REG = {
    carta: { fn: carta, seal: 'rose' },
    noche: { fn: noche, seal: 'lilac' },
    jardin: { fn: jardin, seal: 'mint' },
    videojuego: { fn: rpg, seal: 'gold' },
    scrapbook: { fn: scrapbook, seal: 'plum' },
    lluvia: { fn: lluvia, seal: 'sky' },
    atardecer: { fn: atardecer, seal: 'peach' },
    sakura: { fn: sakura, seal: 'pink' },
    ...(window.THEMES_EXTRA || {})
  };
  const ORDER = ['carta', 'noche', 'jardin', 'videojuego', 'scrapbook', 'lluvia', 'mew', 'pochita', 'oceano', 'cine', 'nieve', 'sakura', 'globos', 'luciernagas', 'musica'].filter((n) => REG[n]);
  const ALIAS = { rpg: 'videojuego', juego: 'videojuego', mar: 'oceano', perrito: 'pochita', perro: 'pochita', bosque: 'luciernagas', luciernaga: 'luciernagas', cohete: 'espacio', gatito: 'mew' };
  const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  let ASSIGN = [];
  /* reparte los estilos: respeta los que se eligieron a mano y
     completa el resto con los que falten, en orden, sin repetir */
  function assign(list) {
    const want = list.map((m, i) => {
      if (!m.estilo) return null;
      const k = ALIAS[norm(m.estilo)] || norm(m.estilo);
      if (REG[k]) return k;
      console.warn(`mensajes.js: el estilo "${m.estilo}" (mensaje ${i + 1}) no existe. Opciones: ${Object.keys(REG).join(', ')}`);
      return null;
    });
    const used = new Set(want.filter(Boolean));
    const free = ORDER.filter((n) => !used.has(n));
    ASSIGN = want.map((k, i) => k || free.shift() || ORDER[i % ORDER.length]);
    return ASSIGN;
  }
  const styleOf = (i) => ASSIGN[i] || ORDER[i % ORDER.length];
  const sealFor = (i) => REG[styleOf(i)].seal;
  const envFor = (i) => (sealFor(i) === 'rose' ? 'envelope' : 'envelope-' + sealFor(i));
  const TRANSITIONS = ['iris', 'pixels', 'wipe', 'curtain', 'diamond', 'rise', 'blinds', 'blur', 'zoom', 'pixels', 'slide', 'iris', 'curtain', 'blur', 'diamond'];

  function message(ctx) {
    const s = REG[styleOf(ctx.idx)].fn(ctx);
    s.el.setAttribute('aria-label', `Carta ${ctx.idx + 1} de ${ctx.total}, de ${ctx.msg.de}`);
    return s;
  }

  /* ---------------------------------------------------------
     INTRO — caja de regalo con cartas
     --------------------------------------------------------- */
  function intro({ data, unlocked, onOpen, onChest }) {
    const N = data.mensajes.length;
    const el = h('section', 'scene th-intro');
    el.dataset.tint = '#2d1838';
    const st = stopper();
    el.appendChild(h('div', 'intro-blobs', '<i></i><i></i><i></i>'));
    depth(stars(el, innerWidth < 600 ? 40 : 70), 10);
    depth(floaters(el, 9), 18);
    const moon = depth(PX.img('moon', innerWidth < 600 ? 4 : 5, 'intro-moon'), 24);
    el.appendChild(moon);
    const stopShoot = shootingStars(el, [2600, 5200]);
    const horizon = h('div', 'horizon');
    const wins = [];
    for (let i = 0; i < (innerWidth < 600 ? 22 : 40); i++) {
      const w = h('i', 'win');
      w.style.left = rand(1, 99) + '%';
      w.style.bottom = rand(4, 46) + '%';
      if (Math.random() < 0.4) w.classList.add('on');
      horizon.appendChild(w);
      wins.push(w);
    }
    el.appendChild(horizon);

    const copy = h('div', 'intro-copy');
    const eyebrow = h('p', 'eyebrow intro-eyebrow');
    eyebrow.appendChild(PX.img('heart-s', 2));
    eyebrow.appendChild(document.createTextNode(' Para ' + data.para));
    const title = h('h1', 'intro-title');
    const smile = [...'sonreír'].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');
    const words = ['Hay', 'personas', 'que', 'quieren', 'verte', `<em>${smile}</em>`];
    title.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    const lead = h('p', 'intro-lead', 'Cada una escribió algo pensando en ti, y lo guardamos todo en esta caja.');
    copy.append(eyebrow, title, lead);

    const gift = h('button', 'gift');
    gift.type = 'button';
    gift.setAttribute('aria-label', 'Abrir la caja de cartas');
    const inner = h('span', 'gift-inner');
    const glow = h('span', 'gift-glow');
    const rays = h('span', 'gift-rays');
    const orbit = h('span', 'gift-orbit');
    ['heart-s', 'sparkle', 'heart-s-rose', 'star'].forEach((n, i) => {
      const o = h('i');
      o.style.setProperty('--dl', (-i * 1.75) + 's');
      o.appendChild(PX.img(n, 3));
      orbit.appendChild(o);
    });
    const letters = h('span', 'gift-letters');
    const envs = [];
    const ne = Math.min(N, 7);
    for (let i = 0; i < ne; i++) {
      const e = PX.img(envFor(i), 4, 'gift-env');
      e.style.left = 50 + (i - (ne - 1) / 2) * 11 + '%';
      letters.appendChild(e);
      envs.push(e);
    }
    const body = PX.img('giftBody', 1, 'gift-body');
    const lidWrap = h('span', 'gift-lid');
    lidWrap.append(PX.img('bow', 1, 'gift-bow'), PX.img('giftLid', 1, 'gift-lidimg'));
    inner.append(rays, glow, letters, body, lidWrap);
    gift.append(orbit, inner);

    const touch = !FX.canHover.matches;
    const hint = h('p', 'intro-hint', touch ? 'Toca la caja para abrirla' : 'Haz clic en la caja para abrirla');
    const count = h('p', 'intro-count', `<b>0</b> ${N === 1 ? 'carta te espera' : 'cartas te esperan'}`);
    const AUTO = 12000;
    const auto = h('div', 'intro-auto', '<span>o espera un momento y se abrirá sola</span><i><u></u></i>');
    el.append(copy, gift, hint, count, auto);

    let chestLink;
    if (unlocked) {
      chestLink = h('button', 'link-btn intro-chest', 'Ir directo a mi cofre →');
      chestLink.type = 'button';
      chestLink.addEventListener('click', onChest);
      el.appendChild(chestLink);
    }

    let opened = false, autoAnim = null, autoTimer = 0;
    const open = async () => {
      if (opened) return;
      opened = true;
      st.stop();
      clearTimeout(autoTimer);
      if (autoAnim) autoAnim.pause();
      gift.classList.remove('idle');
      gift.disabled = true;
      anim(copy, [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(8px)', transform: 'translateY(-16px)' }], { duration: 600 });
      [hint, count, chestLink, auto].forEach((x) => x && anim(x, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 }));
      anim(rays, [{ opacity: 0.5, scale: 1 }, { opacity: 1, scale: 1.8 }], { duration: 1600, easing: E.out });
      await anim(inner, [
        { transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(-6deg) scale(1.03)' },
        { transform: 'rotate(6deg) scale(1.05)' }, { transform: 'rotate(-3deg) scale(1.06, 0.92)' }, { transform: 'scale(0.98, 1.05)' }, { transform: 'none' }
      ], { duration: 900, easing: 'ease-in-out' });
      const [gx, gy] = centerOf(inner);
      burst(el, gx, gy - 30, { names: ['heart-s', 'heart-s-rose', 'sparkle', 'star', 'sparkle-pink'], n: 26, spread: 220, scale: 3, up: 60 });
      anim(lidWrap, [{ transform: 'none', opacity: 1 }, { transform: 'translate(-30%, -260%) rotate(-28deg)', opacity: 0 }], { duration: 900, easing: E.out });
      anim(glow, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(0.6)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.4)' }], { duration: 900, easing: E.out });
      anim(orbit, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: 2.2 }], { duration: 900, easing: E.out });
      await Promise.all(envs.map((e, i) => {
        const mid = (envs.length - 1) / 2;
        const x = (i - mid) * (innerWidth < 600 ? 31 : 64);
        const y = -(innerWidth < 600 ? 150 : 200) + Math.abs(i - mid) * 18 - rand(0, 30);
        return anim(e, [
          { transform: 'translate(-50%, 0) rotate(0deg)' },
          { transform: `translate(calc(-50% + ${x}px), ${y}px) rotate(${(i - mid) * 9}deg) scale(1.1)` }
        ], { duration: 950, delay: 120 + i * 70, easing: E.back });
      }));
      envs.forEach((e, i) => anim(e, [{ translate: '0 0' }, { translate: '0 -8px' }, { translate: '0 0' }], { duration: 500, delay: i * 60, fill: 'none' }));
      await wait(500);
      const r = gift.getBoundingClientRect();
      onOpen({ x: r.left + r.width / 2, y: r.top + r.height * 0.1 });
    };
    gift.addEventListener('click', open);

    return {
      el,
      destroy() { st.stop(); stopShoot(); clearTimeout(autoTimer); if (autoAnim) autoAnim.cancel(); },
      async enter() {
        const ws = title.querySelectorAll('.w');
        hide(eyebrow, [...ws], lead, gift, hint, count, chestLink, auto, moon);
        anim(moon, [{ opacity: 0, transform: 'translateY(20px) rotate(-20deg)' }, { opacity: 1, transform: 'none' }], { duration: 1800, easing: E.out });
        anim(eyebrow, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 200 });
        ws.forEach((w, i) => anim(w, [{ opacity: 0, transform: 'translateY(0.5em)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 800, delay: 380 + i * 90 }));
        setTimeout(() => title.classList.add('alive'), 1400);
        anim(lead, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 1000 });
        await anim(gift, [{ opacity: 0, transform: 'translateY(40px) scale(0.94)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 1100, easing: E.back });
        if (opened) return;
        gift.classList.add('idle');
        fadeUp([hint, count, auto, chestLink].filter(Boolean), { step: 120, y: 6 });
        const b = count.querySelector('b');
        const t0 = performance.now();
        const tickCount = () => {
          const p = clamp((performance.now() - t0) / 1200, 0, 1);
          b.textContent = Math.round(N * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tickCount);
        };
        requestAnimationFrame(tickCount);
        st(every(() => { const w = pick(wins); w.classList.toggle('on'); }, 250, 700, 300));
        st(every(() => {
          const [x, y] = centerOf(inner);
          const a = rand(0, Math.PI * 2), d = rand(60, 120);
          burst(el, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6 - 20, { names: ['sparkle', 'sparkle-s', 'sparkle-pink'], n: 3, spread: 30, scale: 2, up: 10 });
        }, 500, 1100, 200));
        st(every(() => {
          const e = pick(envs);
          anim(e, [{ transform: 'translate(-50%, 0)' }, { transform: 'translate(-50%, -38%) rotate(-6deg)' }, { transform: 'translate(-50%, -30%) rotate(5deg)' }, { transform: 'translate(-50%, 0)' }], { duration: 900, easing: E.out, fill: 'none' });
        }, 1400, 2600, 800));
        if (!FX.reduce.matches) {
          autoAnim = auto.querySelector('u').animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: AUTO, easing: 'linear', fill: 'forwards' });
          autoTimer = setTimeout(open, AUTO);
          gift.addEventListener('pointerenter', () => { if (autoAnim && !opened) autoAnim.pause(); });
          gift.addEventListener('pointerleave', () => { if (autoAnim && !opened) autoAnim.play(); });
          autoAnim.finished.then(() => { if (!opened) open(); }, () => {});
          clearTimeout(autoTimer);
        }
      }
    };
  }

  /* ---------------------------------------------------------
     FINAL — remolino de cartas que forma un mensaje
     --------------------------------------------------------- */
  function finale({ data, onChest }) {
    const msgs = data.mensajes;
    const N = msgs.length;
    const el = h('section', 'scene th-finale');
    el.dataset.tint = '#24122f';
    const st = stopper();
    el.appendChild(h('div', 'finale-nebula', '<i></i><i></i><i></i>'));
    stars(el, innerWidth < 600 ? 40 : 70);
    const glow = h('div', 'finale-glow');
    const flash = h('div', 'finale-flash');
    el.appendChild(glow);
    const eyebrow = h('p', 'eyebrow finale-eyebrow', 'todas estas personas están contigo');
    const counter = h('p', 'finale-count');
    const sr = h('h2', 'sr-only');
    sr.textContent = data.final.lineas.join(' ');
    const srNames = h('p', 'sr-only');
    srNames.textContent = 'Con cariño de: ' + msgs.map((m) => m.de).join(', ');
    const swirl = h('div', 'swirl');
    const small = innerWidth < 600;
    const cards = msgs.map((m, i) => {
      const c = h('div', 'fcard');
      c.appendChild(PX.img(envFor(i), small ? 3 : 4));
      const n = h('span', 'fname');
      n.textContent = m.de;
      c.appendChild(n);
      swirl.appendChild(c);
      return { el: c, side: i % 2 ? 1 : -1, sy: rand(-0.28, 0.28), cy: rand(-0.12, 0.08), counted: false };
    });
    const foot = h('div', 'finale-foot');
    const sub = h('p', 'finale-sub');
    sub.textContent = data.final.sub;
    const hint = h('p', 'finale-hint', `${FX.canHover.matches ? 'Haz clic en' : 'Toca'} el cofre para abrirlo`);
    foot.append(sub, hint);
    /* cofre que cae al terminar el remolino y guarda todas las cartas */
    const fchest = h('button', 'fchest');
    fchest.type = 'button';
    fchest.setAttribute('aria-label', 'Abrir el cofre con todas tus cartas');
    const fGlow = h('i', 'fc-glow');
    const fLid = PX.img('chestLid', 1, 'fc-lid');
    const fBody = PX.img('chestBody', 1, 'fc-body');
    fchest.append(fGlow, fLid, fBody);
    el.append(eyebrow, counter, sr, srNames, fchest, swirl, flash, foot);
    let chestDropped = false, chestReady = false, chestOpening = false;
    const lay = { textCY: 0, chestCY: 0, mouthY: 0, cw: 0, bh: 0 };
    const layout = () => {
      lay.cw = Math.min(250, W * 0.58, H * 0.36);
      lay.bh = lay.cw * 28 / 46;
      lay.textCY = H * (H < 700 ? 0.25 : 0.27);
      lay.chestCY = H * (H < 520 ? 0.6 : 0.63);
      lay.mouthY = lay.chestCY - lay.bh / 2;
      fchest.style.width = lay.cw + 'px';
      fchest.style.top = lay.chestCY + 'px';
      foot.style.top = Math.min(H - (H < 520 ? 72 : 110), lay.chestCY + lay.bh / 2 + (H < 520 ? 10 : 22)) + 'px';
    };
    const dropChest = () => {
      if (chestDropped) return;
      chestDropped = true;
      fchest.style.visibility = 'visible';
      fLid.style.opacity = '1';
      anim(fchest, [
        { transform: 'translate(-50%, -50%) translateY(-90vh) rotate(-8deg)' },
        { transform: 'translate(-50%, -50%) translateY(0) rotate(2deg) scale(1.06, 0.9)', offset: 0.72 },
        { transform: 'translate(-50%, -50%) translateY(-22px) rotate(-1deg)', offset: 0.86 },
        { transform: 'translate(-50%, -50%)' }
      ], { duration: 950, easing: E.in }).then((a) => {
        a.cancel();
        const r = fBody.getBoundingClientRect();
        burst(el, r.left + 10, r.bottom - 6, { names: ['sparkle-s'], n: 7, spread: 70, scale: 3, up: 0, z: 5 });
        burst(el, r.right - 10, r.bottom - 6, { names: ['sparkle-s'], n: 7, spread: 70, scale: 3, up: 0, z: 5 });
      });
    };
    const closeChest = () => {
      anim(fLid, [{ transform: 'scaleY(1)', opacity: 1 }, { transform: 'scaleY(0.05)', opacity: 0 }], { duration: 260, easing: E.in, fill: 'forwards' });
      setTimeout(() => anim(fchest, [{ transform: 'translate(-50%, -50%) scale(1)' }, { transform: 'translate(-50%, -50%) scale(1.12, 0.88)' }, { transform: 'translate(-50%, -50%) scale(0.96, 1.05)' }, { transform: 'translate(-50%, -50%)' }], { duration: 520, easing: E.out, fill: 'none' }), 240);
    };
    const openChest = async () => {
      if (!chestReady || chestOpening) return;
      chestOpening = true;
      fchest.classList.remove('ready');
      anim(foot, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      await anim(fchest, [
        { transform: 'translate(-50%, -50%) rotate(0)' }, { transform: 'translate(-50%, -50%) rotate(-4deg)' }, { transform: 'translate(-50%, -50%) rotate(4deg)' },
        { transform: 'translate(-50%, -50%) rotate(-3deg) scale(1.04)' }, { transform: 'translate(-50%, -50%) scale(1.06, 0.94)' }, { transform: 'translate(-50%, -50%)' }
      ], { duration: 650, easing: 'ease-in-out', fill: 'none' });
      fLid.getAnimations().forEach((a) => a.cancel());
      anim(fLid, [{ transform: 'scaleY(0.05)', opacity: 0 }, { transform: 'scaleY(1.15)', opacity: 1, offset: 0.6 }, { transform: 'scaleY(1)', opacity: 1 }], { duration: 550, easing: E.out });
      anim(fGlow, [{ opacity: 0, transform: 'translate(-50%, -50%) scale(0.3)' }, { opacity: 1, transform: 'translate(-50%, -50%) scale(1.3)' }], { duration: 900, easing: E.out });
      const r = fBody.getBoundingClientRect();
      burst(el, r.left + r.width / 2, r.top, { names: ['heart-s', 'heart-s-rose', 'sparkle', 'star', 'sparkle-pink'], n: 26, spread: 220, scale: 3, up: 80, z: 6 });
      msgs.forEach((m, i) => {
        if (i > 9) return;
        const e = PX.img(envFor(i), small ? 2 : 3, 'fc-env');
        e.style.left = r.left + r.width / 2 + 'px';
        e.style.top = r.top + 'px';
        el.appendChild(e);
        const a = (i / Math.min(10, msgs.length)) * Math.PI - Math.PI;
        const d = rand(90, 170);
        anim(e, [
          { transform: 'translate(-50%, -50%) scale(0.3)', opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d * 0.9 - 40}px)) rotate(${rand(-30, 30)}deg) scale(1.1)`, opacity: 1 }
        ], { duration: 900, delay: 150 + i * 40, easing: E.back });
      });
      await wait(1300);
      onChest();
    };
    fchest.addEventListener('click', openChest);

    const COLORS = ['#ffd5e3', '#ff9cc0', '#ffe9a6', '#ffffff', '#ffc2d8', '#e0d4ff'];
    const trail = [], arms = [], fw = [];
    let particles = [];
    let crisp = null;
    let start = 0, phase = 'wait', textStart = 0, boomAt = 0, footShown = false, W = innerWidth, H = innerHeight;
    let cy0 = H * 0.46;

    /* tiempos del desfile de nombres y del remolino */
    const G = N <= 1 ? 0 : clamp(8000 / N, 480, 950);
    const TIN = 1900;
    const ALLIN = (N - 1) * G + TIN;
    const VS = ALLIN + 1100;
    const VD = 3000;
    const END = VS + VD;
    const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    async function buildText() {
      try { await Promise.all([document.fonts.load('600 80px Fraunces'), document.fonts.load('700 80px Caveat')]); } catch (e) { /* sin fuentes, igual sigue */ }
      const lines = data.final.lineas;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const x = c.getContext('2d');
      const fontFor = (i, fs) => (i === lines.length - 1 && lines.length > 1 ? `700 ${fs * 1.35}px Caveat, cursive` : `600 ${fs}px Fraunces, Georgia, serif`);
      let fs = Math.min(W * 0.13, 112);
      const widest = () => Math.max(...lines.map((l, i) => { x.font = fontFor(i, fs); return x.measureText(l).width; }));
      while (widest() > W * 0.88 && fs > 18) fs *= 0.94;
      let lh = fs * 1.25;
      while (lh * lines.length > H * 0.3 && fs > 18) { fs *= 0.94; lh = fs * 1.25; }
      const blockH = lh * lines.length;
      const top = lay.textCY - blockH / 2;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillStyle = '#fff';
      lines.forEach((l, i) => { x.font = fontFor(i, fs); x.fillText(l, W / 2, top + lh * (i + 0.5)); });
      crisp = { lines, fontFor, fs, lh, top };
      let gap = clamp(Math.round(fs / 18), 2, 5);
      const img = x.getImageData(0, 0, W, H).data;
      let pts = [];
      const sample = () => {
        pts = [];
        for (let yy = 0; yy < H; yy += gap) for (let xx = 0; xx < W; xx += gap) if (img[(yy * W + xx) * 4 + 3] > 140) pts.push([xx, yy]);
      };
      sample();
      while (pts.length > 4800) { gap++; sample(); }
      const cx = W / 2;
      particles = pts.map(([tx, ty]) => {
        const a = rand(0, Math.PI * 2), r = rand(Math.min(W, H) * 0.2, Math.min(W, H) * 0.7);
        return {
          sx: cx + rand(-lay.cw * 0.3, lay.cw * 0.3), sy: lay.mouthY + rand(-4, 4),
          cx: cx + Math.cos(a) * r, cy: lay.mouthY - Math.abs(Math.sin(a)) * r,
          tx, ty, ox: 0, oy: 0, s: Math.max(2, gap - 1), c: pick(COLORS), d: rand(0, 700), ph: rand(0, 6.28)
        };
      });
    }

    /* fuego artificial con forma de corazón */
    function firework(x, y) {
      const col = pick(['#ff86b0', '#ffd25e', '#b9a0ff', '#8fe0b8', '#ffffff']);
      const n = 34, k = rand(5, 8);
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3), hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        fw.push({ x, y, vx: hx * k, vy: hy * k, life: 1.4, c: col });
      }
    }

    const layer = canvasLayer(el, (ctx, w, hh, dt, t) => {
      if (phase === 'wait') return;
      const now = t - start;
      const cx = w / 2;
      const pvC = clamp((now - VS) / VD, 0, 1);
      cy0 = hh * 0.44 + (lay.mouthY - hh * 0.44) * easeIO(pvC);
      const R = Math.min(w, hh) * (w < 600 ? 0.38 : 0.33);
      if (phase === 'swirl' && now > VS + VD * 0.12) dropChest();

      if (phase === 'swirl') {
        const pv = clamp((now - VS) / VD, 0, 1);
        const theta = (now / 1000) * 0.55 + Math.pow(pv, 3) * 11;
        const radius = R * (1 - Math.pow(pv, 2.4)) * (1 + 0.04 * Math.sin(now / 320) * (1 - pv));
        /* anillo guía */
        if (radius > 4) {
          ctx.strokeStyle = `rgba(255,194,216,${0.14 * (1 - pv)})`;
          ctx.setLineDash([3, 7]);
          ctx.beginPath();
          ctx.ellipse(cx, cy0, radius, radius * 0.62, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        /* brazos de la espiral */
        if (pv > 0) {
          for (let k = 0; k < 6 * pv + 1; k++) arms.push({ a: rand(0, Math.PI * 2), r: rand(radius * 0.8, R * 1.15), c: pick(COLORS), s: pick([2, 3, 3, 4]) });
        } else if (Math.random() < 0.35) {
          arms.push({ a: rand(0, Math.PI * 2), r: R * rand(0.95, 1.1), c: pick(COLORS), s: 2, slow: true });
        }
        let shown = 0;
        cards.forEach((c, i) => {
          const ti = i * G;
          const u = clamp((now - ti) / TIN, 0, 1);
          if (now < ti) { c.el.style.opacity = 0; return; }
          if (!c.counted) {
            c.counted = true;
            c.el.classList.add('hot');
            setTimeout(() => c.el.classList.remove('hot'), TIN * 0.8);
          }
          shown++;
          const a = (i / N) * Math.PI * 2 + theta;
          const tx = Math.cos(a) * radius, ty = Math.sin(a) * radius * 0.62;
          const dz = Math.sin(a);
          const e = easeIO(u);
          const sx = c.side * (w / 2 + 160), sy = c.sy * hh;
          const qx = -c.side * w * 0.04, qy = c.cy * hh;
          const x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * qx + e * e * tx;
          const y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * qy + e * e * ty;
          const orbitSc = 0.8 + 0.3 * ((dz + 1) / 2);
          const sc = orbitSc * (1 + 1.1 * Math.sin(Math.PI * u)) * (1 - 0.75 * Math.pow(pv, 2));
          const rot = (1 - u) * c.side * -14 + pv * ((a * 180) / Math.PI + 90);
          const op = Math.min(u / 0.12, 1) * (pv > 0.85 ? 1 - (pv - 0.85) / 0.15 : 1) * (u >= 1 ? 0.65 + 0.35 * ((dz + 1) / 2) : 1);
          c.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y + cy0 - hh / 2}px) rotate(${rot}deg) scale(${sc})`;
          c.el.style.opacity = op;
          c.el.style.zIndex = u < 1 ? 300 : Math.round((dz + 1) * 50);
          if (Math.random() < (u < 1 ? 0.9 : 0.45)) trail.push({ x: cx + x + rand(-6, 6), y: cy0 + y + rand(-6, 6), life: 0.8, c: pick(COLORS), s: pick([2, 3, 4]) });
        });
        counter.textContent = shown ? `${shown} ${shown === 1 ? 'persona te escribió' : 'personas te escribieron'}` : '';
        if (now >= END) {
          phase = 'text';
          textStart = t;
          boomAt = t;
          swirl.style.display = 'none';
          anim(counter, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 });
          closeChest();
          anim(flash, [{ opacity: 0 }, { opacity: 0.6, offset: 0.12 }, { opacity: 0 }], { duration: 1000, easing: 'ease-out' });
          anim(glow, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(0.3)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], { duration: 1400, easing: E.out });
          burst(el, cx, lay.mouthY, { names: ['heart', 'heart-rose', 'heart-s', 'sparkle', 'star'], n: 30, spread: Math.min(w, hh) * 0.45, scale: 3, up: 60, z: 5 });
        }
      }

      /* brazos de la espiral: caen hacia el centro girando */
      const pvNow = clamp((now - VS) / VD, 0, 1);
      for (let i = arms.length - 1; i >= 0; i--) {
        const q = arms[i];
        q.a += dt * (q.slow ? 0.9 : 2.5 + 6 * pvNow);
        q.r -= dt * (q.slow ? 6 : 60 + 260 * pvNow);
        if (q.r <= 2 || phase !== 'swirl') { arms.splice(i, 1); continue; }
        ctx.globalAlpha = clamp(q.r / 60, 0, 1) * (q.slow ? 0.5 : 0.9);
        ctx.fillStyle = q.c;
        ctx.fillRect(Math.round(cx + Math.cos(q.a) * q.r), Math.round(cy0 + Math.sin(q.a) * q.r * 0.62), q.s, q.s);
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const q = trail[i];
        q.life -= dt;
        if (q.life <= 0) { trail.splice(i, 1); continue; }
        ctx.globalAlpha = q.life / 0.8;
        ctx.fillStyle = q.c;
        ctx.fillRect(Math.round(q.x), Math.round(q.y), q.s, q.s);
      }
      ctx.globalAlpha = 1;

      /* onda expansiva */
      if (boomAt) {
        const b = (t - boomAt) / 1000;
        if (b < 1.2) {
          [0, 0.18].forEach((off) => {
            const p = clamp((b - off) / 1, 0, 1);
            if (p <= 0 || p >= 1) return;
            ctx.strokeStyle = `rgba(255,214,230,${(1 - p) * 0.8})`;
            ctx.lineWidth = 6 * (1 - p) + 1;
            ctx.beginPath();
            ctx.ellipse(cx, cy0, p * Math.max(w, hh) * 0.7, p * Math.max(w, hh) * 0.45, 0, 0, Math.PI * 2);
            ctx.stroke();
          });
        }
      }

      if (phase === 'text' || phase === 'done') {
        const te = t - textStart;
        let all = true;
        /* cuando las partículas ya llegaron, aparece el texto nítido para que se lea perfecto */
        const crispA = crisp ? clamp((te - 1900) / 1000, 0, 1) : 0;
        if (crispA > 0) {
          ctx.save();
          ctx.globalAlpha = crispA;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fff6fa';
          ctx.shadowColor = 'rgba(255, 134, 176, 0.85)';
          ctx.shadowBlur = 18 + Math.sin(t / 700) * 6;
          crisp.lines.forEach((l, i) => { ctx.font = crisp.fontFor(i, crisp.fs); ctx.fillText(l, w / 2, crisp.top + crisp.lh * (i + 0.5)); });
          ctx.restore();
        }
        const hover = FX.canHover.matches;
        const mx = ((FX.pointer.x + 1) / 2) * w, my = ((FX.pointer.y + 1) / 2) * hh;
        particles.forEach((q) => {
          const p = clamp((te - q.d) / 1600, 0, 1);
          if (p < 1) all = false;
          const e = 1 - Math.pow(1 - p, 3);
          let ix = (1 - e) * (1 - e) * q.sx + 2 * (1 - e) * e * q.cx + e * e * q.tx;
          let iy = (1 - e) * (1 - e) * q.sy + 2 * (1 - e) * e * q.cy + e * e * q.ty;
          if (phase === 'done') {
            ix += Math.sin(t / 900 + q.ph) * 0.8;
            iy += Math.cos(t / 1100 + q.ph) * 0.8;
            if (hover) {
              const dx = ix - mx, dy = iy - my, d2 = dx * dx + dy * dy;
              if (d2 < 3600) { const f = (1 - d2 / 3600) * 14; q.ox += (dx / Math.sqrt(d2 + 1) * f - q.ox) * 0.2; q.oy += (dy / Math.sqrt(d2 + 1) * f - q.oy) * 0.2; }
              else { q.ox *= 0.9; q.oy *= 0.9; }
              ix += q.ox; iy += q.oy;
            }
          }
          ctx.globalAlpha = (p === 0 ? 0 : p < 1 ? 0.5 + p * 0.5 : 0.86 + Math.sin(t / 380 + q.ph) * 0.14) * (1 - 0.6 * crispA);
          ctx.fillStyle = q.c;
          ctx.fillRect(Math.round(ix), Math.round(iy), q.s, q.s);
        });
        ctx.globalAlpha = 1;
        if (all && !footShown) {
          footShown = true;
          phase = 'done';
          anim(foot, [{ opacity: 0, transform: 'translate(-50%, 14px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 800 });
          chestReady = true;
          fchest.classList.add('ready');
          firework(w * 0.2, hh * 0.25);
          firework(w * 0.8, hh * 0.22);
          st(every(() => firework(rand(w * 0.12, w * 0.88), rand(hh * 0.1, hh * 0.32)), 1400, 2600, 1200));
        }
      }

      for (let i = fw.length - 1; i >= 0; i--) {
        const q = fw[i];
        q.vx *= Math.pow(0.25, dt); q.vy *= Math.pow(0.25, dt); q.vy += 30 * dt;
        q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
        if (q.life <= 0) { fw.splice(i, 1); continue; }
        ctx.globalAlpha = clamp(q.life, 0, 1);
        ctx.fillStyle = q.c;
        ctx.fillRect(Math.round(q.x), Math.round(q.y), 3, 3);
      }
      ctx.globalAlpha = 1;
    }, 'layer finale-canvas');

    return {
      el,
      async enter() {
        hide(foot, eyebrow);
        cards.forEach((c) => (c.el.style.opacity = 0));
        W = innerWidth; H = innerHeight;
        layout();
        fchest.style.visibility = 'hidden';
        const ready = buildText();
        anim(eyebrow, [{ opacity: 0, transform: 'translate(-50%, 8px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 900, delay: 300 });
        await ready;
        await wait(700);
        start = performance.now();
        if (FX.reduce.matches) {
          swirl.style.display = 'none';
          fchest.style.visibility = 'visible';
          fLid.style.opacity = '0';
          chestDropped = true;
          particles.forEach((q) => (q.d = 0));
          phase = 'text';
          textStart = start - 5000;
        } else phase = 'swirl';
      },
      destroy() { layer.stop(); st.stop(); }
    };
  }

  /* ---------------------------------------------------------
     COFRE — cartas guardadas para volver a leer
     --------------------------------------------------------- */
  function chest({ data, ceremony, onOpen, onFinale, onRestart }) {
    const el = h('section', 'scene th-chest');
    el.dataset.tint = '#2a1730';
    depth(stars(el, innerWidth < 600 ? 30 : 55), 10);
    const scroller = h('div', 'chest-scroll');
    const head = h('header', 'chest-head');
    head.innerHTML = `<p class="eyebrow">tu cofre</p><h2>Cartas para volver a leer</h2><p class="chest-sub">${FX.canHover.matches ? 'Elige' : 'Toca'} una carta cuando quieras sentirte acompañada.</p>`;

    const area = h('div', 'chest-area');
    const lid = PX.img('chestLid', 1, 'chest-lid');
    const body = PX.img('chestBody', 1, 'chest-body');
    const letters = h('div', 'chest-letters');
    const small = innerWidth < 600;
    const items = data.mensajes.map((m, i) => {
      const b = h('button', 'lcard');
      b.type = 'button';
      b.setAttribute('aria-label', `Leer la carta de ${m.de}`);
      const rr = rand(-9, 9).toFixed(1), yy = rand(0, 12).toFixed(0);
      b.dataset.t = `translateY(${yy}px) rotate(${rr}deg)`;
      b.style.setProperty('--r', rr + 'deg');
      b.style.setProperty('--y', yy + 'px');
      b.style.setProperty('--bd', (-rand(0, 3)).toFixed(2) + 's');
      const bubble = h('span', 'bubble');
      bubble.textContent = m.de;
      b.append(bubble, PX.img(envFor(i), small ? 3 : 4, 'lenv'));
      b.addEventListener('click', () => {
        const r = b.getBoundingClientRect();
        anim(b, [{ transform: b.dataset.t + ' scale(1)' }, { transform: 'translateY(-10px) rotate(0deg) scale(1.08)' }], { duration: 260, easing: E.out });
        onOpen(i, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      });
      letters.appendChild(b);
      return b;
    });
    area.append(h('i', 'chest-glow'), lid, letters, body);

    const st = stopper();

    const actions = h('div', 'chest-actions');
    const again = h('button', 'link-btn', 'Ver el final otra vez');
    const restart = h('button', 'link-btn', 'Empezar desde la caja');
    again.type = restart.type = 'button';
    again.addEventListener('click', onFinale);
    restart.addEventListener('click', onRestart);
    actions.append(again, restart);
    scroller.append(head, area, actions);
    el.appendChild(scroller);

    const lettersOut = () => {
      items.forEach((b, i) =>
        anim(b, [{ opacity: 0, transform: 'translateY(70px) rotate(0deg) scale(0.5)' }, { opacity: 1, transform: 'translateY(-30px) rotate(0deg) scale(1.05)', offset: 0.6 }, { opacity: 1, transform: b.dataset.t + ' scale(1)' }], { duration: 900, delay: i * 90, easing: E.out, fill: 'backwards' })
          .then(() => { b.style.opacity = ''; b.classList.add('bob'); })
      );
    };
    return {
      el,
      destroy() { st.stop(); },
      async enter() {
        const hs = head.children;
        hide([...hs], lid, body, items, actions);
        if (ceremony && !FX.reduce.matches) {
          /* viene del final: el cofre ya está abierto y las cartas salen volando */
          lid.style.opacity = '1';
          body.style.opacity = '1';
          scroller.scrollTop = scroller.scrollHeight;
          anim(area.querySelector('.chest-glow'), [{ opacity: 0 }, { opacity: 1 }], { duration: 900 });
          await wait(250);
          const [cx, cy] = centerOf(body);
          burst(el, cx, cy - 30, { names: ['heart-s', 'heart-s-rose', 'sparkle', 'star', 'sparkle-pink'], n: 20, spread: 200, scale: 3, up: 70 });
          lettersOut();
          await wait(1600);
          scroller.scrollTo({ top: 0, behavior: 'smooth' });
          fadeUp(hs, { step: 110 });
          fadeUp([actions], { delay: 500 });
          return;
        }
        fadeUp(hs, { step: 110, delay: 150 });
        anim(lid, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 350 });
        await anim(body, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 350, easing: E.out });
        items.forEach((b, i) =>
          anim(b, [{ opacity: 0, transform: 'translateY(60px) rotate(0deg) scale(0.9)' }, { opacity: 1, transform: b.dataset.t + ' scale(1)' }], { duration: 700, delay: i * 70, easing: E.back, fill: 'backwards' })
            .then(() => { b.style.opacity = ''; b.classList.add('bob'); })
        );
        fadeUp([actions], { delay: 400 + items.length * 70 });
      }
    };
  }

  window.SCENES = { message, intro, finale, chest, TRANSITIONS, STYLES: Object.keys(REG), ORDER, assign, styleOf, sealFor, envFor };
})();
