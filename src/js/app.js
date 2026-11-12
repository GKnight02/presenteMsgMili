/* =========================================================
   Controlador: navegación entre escenas
   ========================================================= */
(function () {
  /* ---- lee mensajes.js y normaliza el texto ---- */
  const clean = (t) => String(t || '')
    .replace(/\r/g, '')
    .split(/\n\s*\n/)
    .map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean).join(' '))
    .filter(Boolean)
    .join('\n\n');

  const lista = typeof MENSAJES !== 'undefined' && Array.isArray(MENSAJES) ? MENSAJES : null;
  const aj = typeof AJUSTES !== 'undefined' && AJUSTES ? AJUSTES : {};
  if (!lista || !lista.length) {
    document.getElementById('stage').innerHTML =
      '<div class="setup-error"><p>No se pudieron leer los mensajes.</p><p>Revisa <b>mensajes.js</b>: puede faltar una coma, una comilla o una comilla invertida ` al cerrar un mensaje.</p></div>';
    return;
  }
  const para = aj.para || 'ti';
  const data = {
    para,
    mensajes: lista.map((m, i) => ({ de: String(m.nombre || m.de || `Alguien especial ${i + 1}`).trim(), mensaje: clean(m.mensaje), estilo: m.estilo })),
    final: {
      lineas: Array.isArray(aj.finalLineas) && aj.finalLineas.length ? aj.finalLineas : ['Nunca estás sola', para],
      sub: aj.finalSub || 'Cada una de estas cartas es tuya para siempre.'
    }
  };
  const msgs = data.mensajes;
  const N = msgs.length;
  const stage = document.getElementById('stage');
  const nav = document.getElementById('nav');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const counter = document.getElementById('counter');
  const dots = document.getElementById('dots');
  const toChest = document.getElementById('toChest');
  const KEY = 'cartas-mili-cofre';

  const store = {
    get() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } },
    set() { try { localStorage.setItem(KEY, '1'); } catch (e) { /* sin almacenamiento */ } }
  };

  const state = { mode: 'intro', idx: -1, seen: -1, fromChest: false, unlocked: store.get() };
  if (state.unlocked) state.seen = N - 1;
  let current = null;
  let busy = false;

  /* ---- tendedero: un sobre colgado por carta ---- */
  SCENES.assign(msgs);
  const sealOf = SCENES.sealFor;
  const closedSprite = SCENES.envFor;
  const PEG = 44; // separacion entre sobres (px)
  const nePic = nextBtn.querySelector('.ne-pic');
  const neK = nextBtn.querySelector('.ne-k');
  const neDe = nextBtn.querySelector('.ne-de');
  let nePicName = '';

  const pegs = msgs.map((m, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'peg';
    b.style.left = `${i * PEG}px`;
    b.style.setProperty('--sd', `${-((i * 0.53) % 2.6)}s`);
    b.setAttribute('aria-label', `Carta ${i + 1}, de ${m.de}`);
    b.title = `de ${m.de}`;
    const sw = document.createElement('span');
    sw.className = 'peg-swing';
    const pin = document.createElement('span');
    pin.className = 'peg-pin';
    sw.append(pin, PX.img(closedSprite(i), 1, 'pe-closed'), PX.img(`open-${sealOf(i)}`, 1, 'pe-open'));
    b.appendChild(sw);
    b.addEventListener('click', () => jump(i, b));
    dots.appendChild(b);
    return b;
  });
  dots.style.width = `${(N - 1) * PEG}px`;

  /* el sobre vuela desde la navegacion hacia el centro */
  function fly(fromEl) {
    if (!fromEl || FX.reduce.matches) return;
    const r = fromEl.getBoundingClientRect();
    if (!r.width) return;
    const c = fromEl.cloneNode(true);
    c.className = 'px fly-env';
    Object.assign(c.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(c);
    const dx = innerWidth / 2 - (r.left + r.width / 2);
    const dy = innerHeight * 0.45 - (r.top + r.height / 2);
    FX.anim(c, [
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1, easing: FX.E.out },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.75 - 50}px) scale(2.6) rotate(-14deg)`, opacity: 1, offset: 0.6, easing: 'ease-in' },
      { transform: `translate(${dx}px, ${dy}px) scale(4.2) rotate(8deg)`, opacity: 0 }
    ], { duration: 950, easing: 'linear' }).then(() => c.remove());
  }

  let joltT = 0;
  function joltPegs() {
    clearTimeout(joltT);
    pegs.forEach((p) => p.classList.remove('jolt'));
    void dots.offsetWidth;
    pegs.forEach((p) => p.classList.add('jolt'));
    joltT = setTimeout(() => pegs.forEach((p) => p.classList.remove('jolt')), 1300);
  }
  toChest.appendChild(PX.img('chestBody', 1, 'sc-ico'));

  async function show(scene, tx = 'fade', origin, dir = 1) {
    if (busy) return false;
    busy = true;
    const old = current;
    current = scene;
    const attach = () => {
      stage.appendChild(scene.el);
      scene.entered = Promise.resolve(scene.enter ? scene.enter() : null).catch((e) => console.error(e));
    };
    try {
      const fn = FX.T[tx] || FX.T.fade;
      await fn(stage, old && old.el, scene.el, attach, origin, dir);
    } catch (e) {
      console.error(e);
      if (!scene.el.isConnected) attach();
    } finally {
      if (old) {
        if (old.destroy) old.destroy();
        old.el.remove();
      }
      scene.el.getAnimations().forEach((a) => a.cancel());
      scene.el.style.zIndex = '';
      busy = false;
    }
    return true;
  }

  function updateUI() {
    const inMsg = state.mode === 'msg';
    nav.hidden = !inMsg;
    toChest.hidden = !(inMsg && state.unlocked);
    if (!inMsg) return;
    const idx = state.idx;
    counter.textContent = `${idx + 1} de ${N}`;

    const moved = dots.dataset.idx !== String(idx);
    dots.dataset.idx = idx;
    dots.style.transform = `translateX(${-idx * PEG}px)`;
    pegs.forEach((p, i) => {
      const allowed = state.unlocked || i <= state.seen + 1;
      p.classList.toggle('cur', i === idx);
      p.classList.toggle('read', i <= state.seen && i !== idx);
      p.classList.toggle('locked', !allowed);
      p.classList.toggle('upnext', i === idx + 1);
      p.disabled = !allowed || i === idx;
      if (i === idx) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
    });
    if (moved) joltPegs();

    prevBtn.disabled = idx === 0;
    const last = idx === N - 1;
    let pic, k, de;
    if (!last) { pic = closedSprite(idx + 1); k = 'Siguiente'; de = `de ${msgs[idx + 1].de}`; }
    else if (state.fromChest) { pic = 'chestBody'; k = 'Volver'; de = 'al cofre'; }
    else { pic = 'heart-gold'; k = 'Mensaje final'; de = 'de todos para ti'; }
    if (pic !== nePicName) {
      nePicName = pic;
      nePic.replaceChildren(PX.img(pic, 1));
      if (moved) FX.anim(nePic, [{ transform: 'translateY(26px) rotate(-20deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: 250, easing: FX.E.back });
    }
    neK.textContent = k;
    neDe.textContent = de;
    nextBtn.classList.toggle('final', last);
    nextBtn.setAttribute('aria-label', last ? `${k} ${de}` : `Carta siguiente, ${de}`);
  }

  /* ---- la persona pasa de carta cuando quiera ----
     Cuando la carta termina de mostrarse, el botón "Siguiente" late
     suavemente para indicar que puede continuar. */
  let nudgeTok = 0;
  function nudgeWhenReady(scene) {
    const tok = ++nudgeTok;
    nextBtn.classList.remove('nudge');
    (scene.entered || Promise.resolve()).then(() => FX.wait(900)).then(() => {
      if (tok === nudgeTok && state.mode === 'msg' && current === scene) nextBtn.classList.add('nudge');
    });
  }

  function goMsg(i, tx, origin, dir = 1) {
    if (busy || i < 0 || i >= N) return;
    const scene = SCENES.message({ msg: msgs[i], idx: i, total: N });
    state.mode = 'msg';
    state.idx = i;
    state.seen = Math.max(state.seen, i);
    nextBtn.classList.remove('nudge');
    show(scene, tx || SCENES.TRANSITIONS[i % SCENES.TRANSITIONS.length], origin, dir).then((ok) => { if (ok && current === scene) nudgeWhenReady(scene); });
    updateUI();
  }

  /* ---- música: lista de canciones desde que se abre la caja.
     Entre una y otra hay un fundido cruzado (la que termina baja mientras la
     siguiente sube) y, al acabar la última, vuelve a empezar por la primera. ---- */
  const tracks = (Array.isArray(aj.canciones) ? aj.canciones : [aj.cancion])
    .filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim());
  const players = tracks.length ? [new Audio(), new Audio()] : [];
  const CROSS = FX.clamp(Number(aj.fundido ?? 5) || 0, 0.5, 15); // segundos de fundido
  const vol = FX.clamp(Number(aj.volumen ?? 0.7) || 0, 0, 1);
  let cur = 0, trackIdx = 0, fails = 0, muted = false;
  let songStarted = false, songDone = false;
  const load = (a, i) => { a.src = tracks[i]; a.dataset.i = String(i); };
  players.forEach((a) => {
    a.preload = 'auto';
    a.loop = false;
    a.addEventListener('error', () => {
      if (a.dataset.i) console.warn(`No se pudo cargar la canción "${tracks[+a.dataset.i]}". Revisa el nombre en mensajes.js y que el archivo esté en la carpeta musica.`);
    });
    /* poco antes de que termine la canción actual, empieza la siguiente */
    a.addEventListener('timeupdate', () => {
      if (a !== players[cur] || songDone || !isFinite(a.duration)) return;
      if (a.duration - a.currentTime <= Math.min(CROSS, a.duration / 3)) next();
    });
    a.addEventListener('ended', () => { if (a === players[cur] && !songDone) next(); });
  });
  const muteBtn = document.getElementById('muteBtn');
  const showMute = () => { muteBtn.hidden = !(players.length && songStarted && !songDone); };
  /* cambia el volumen de un reproductor poco a poco;
     la promesa da true si terminó y false si otro fundido lo interrumpió */
  function fadeEl(a, target, ms) {
    const tok = (a._fadeTok = (a._fadeTok || 0) + 1), from = a.volume, t0 = performance.now();
    return new Promise((res) => {
      const step = () => {
        if (tok !== a._fadeTok) return res(false);
        const p = Math.min(1, (performance.now() - t0) / ms);
        a.volume = from + (target - from) * p;
        if (p < 1) requestAnimationFrame(step); else res(true);
      };
      requestAnimationFrame(step);
    });
  }
  /* pasa a la siguiente canción de la lista (tras la última, la primera) */
  function next() {
    const out = players[cur], inc = players[1 - cur];
    const ni = (trackIdx + 1) % tracks.length, ms = CROSS * 1000;
    cur = 1 - cur;
    trackIdx = ni;
    if (inc.dataset.i !== String(ni)) load(inc, ni);
    inc.currentTime = 0;
    inc.volume = 0;
    inc.muted = muted;
    inc.play().then(() => { fails = 0; fadeEl(inc, vol, ms); })
      .catch(() => { if (!songDone && ++fails < tracks.length) next(); });
    if (!out.paused) {
      fadeEl(out, 0, ms).then((done) => {
        if (done && out !== players[cur]) { out.pause(); load(out, (ni + 1) % tracks.length); }
      });
    }
  }
  function playSong() {
    if (!players.length || songStarted) return;
    songStarted = true;
    const [a, b] = players;
    load(a, 0);
    a.volume = 0;
    a.play().then(() => { showMute(); fadeEl(a, vol, 2000); })
      .catch(() => { /* sin archivo o el navegador no lo permitió: sigue sin música */ });
    /* deja lista la siguiente; se "desbloquea" ahora, con el toque de ella,
       para que los navegadores del móvil la dejen sonar más tarde */
    load(b, 1 % tracks.length);
    b.muted = true;
    b.play().then(() => { if (b !== players[cur]) { b.pause(); b.currentTime = 0; } b.muted = muted; })
      .catch(() => { b.muted = muted; });
  }
  /* al abrir el cofre: si todavía suena, se apaga suavemente y no vuelve */
  function stopSong(ms = 2200) {
    if (!players.length || !songStarted || songDone) return;
    songDone = true;
    showMute();
    players.forEach((a) => { if (!a.paused) fadeEl(a, 0, ms).then(() => a.pause()); });
  }
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    players.forEach((a) => { a.muted = muted; });
    muteBtn.classList.toggle('off', muted);
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.setAttribute('aria-label', muted ? 'Activar la música' : 'Silenciar la música');
    muteBtn.title = muted ? 'Activar música' : 'Silenciar';
  });

  function goIntro() {
    if (busy) return;
    state.mode = 'intro';
    state.fromChest = false;
    show(SCENES.intro({
      data,
      unlocked: state.unlocked,
      onOpen: (o) => goMsg(0, 'iris', o),
      onStart: playSong,
      onChest: () => goChest('blur')
    }), current ? 'blur' : 'fade');
    updateUI();
  }

  function goFinale() {
    if (busy) return;
    state.mode = 'finale';
    show(SCENES.finale({ data, onChest: () => { state.unlocked = true; store.set(); goChest('blur', undefined, true); } }), 'fade');
    updateUI();
  }

  function goChest(tx = 'blur', origin, ceremony = false) {
    if (busy) return;
    stopSong();
    state.mode = 'chest';
    state.fromChest = true;
    state.unlocked = true;
    store.set();
    show(SCENES.chest({
      data,
      ceremony,
      onOpen: (i, o) => goMsg(i, 'iris', o),
      onFinale: goFinale,
      onRestart: goIntro
    }), tx, origin);
    updateUI();
  }

  function jump(i, peg) {
    if (state.mode !== 'msg' || busy || i === state.idx) return;
    if (!state.unlocked && i > state.seen + 1) return;
    const img = peg.querySelector(i <= state.seen ? '.pe-open' : '.pe-closed');
    const r = peg.getBoundingClientRect();
    fly(img);
    goMsg(i, 'iris', { x: r.left + r.width / 2, y: r.top + r.height / 2 }, i > state.idx ? 1 : -1);
  }

  function next() {
    if (state.mode !== 'msg' || busy) return;
    if (state.idx < N - 1) { fly(nePic.firstChild); goMsg(state.idx + 1); }
    else if (state.fromChest) goChest('rise');
    else goFinale();
  }

  function prev() {
    if (state.mode !== 'msg' || busy || state.idx === 0) return;
    goMsg(state.idx - 1, 'wipe', null, -1);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  toChest.addEventListener('click', () => goChest('blur'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Escape' && state.mode === 'msg' && state.unlocked) goChest('blur');
  });

  /* gesto de deslizar en móvil */
  let sx = 0, sy = 0, st = 0;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; st = performance.now(); }, { passive: true });
  stage.addEventListener('pointerup', (e) => {
    if (state.mode !== 'msg' || e.pointerType === 'mouse') return;
    const dx = e.clientX - sx, dy = e.clientY - sy, dt = performance.now() - st;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 700) (dx < 0 ? next : prev)();
  }, { passive: true });

  document.addEventListener('pointerdown', FX.tapSparkles, { passive: true });

  goIntro();
})();
