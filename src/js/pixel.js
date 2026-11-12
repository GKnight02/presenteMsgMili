/* =========================================================
   Pixel art procedural: cada sprite se dibuja en una grilla,
   se ilumina (luz arriba-izquierda, sombra abajo-derecha) y
   se le pone contorno. Luego se convierte a dataURL.
   ========================================================= */
(function () {
  const OUT = '#2b1733';
  const PAL = {
    pink:   { base: '#ff86b0', light: '#ffc2d8', dark: '#de538a' },
    rose:   { base: '#f2506b', light: '#ff919f', dark: '#b8324f' },
    blush:  { base: '#f7a8c2', light: '#ffd5e3', dark: '#de7c9f' },
    gold:   { base: '#ffd25e', light: '#fff2b8', dark: '#e0a033' },
    cream:  { base: '#fff3df', light: '#ffffff', dark: '#ecd0a8' },
    lilac:  { base: '#b9a0ff', light: '#e0d4ff', dark: '#8c6ce0' },
    mint:   { base: '#8fe0b8', light: '#cdf6e0', dark: '#52b387' },
    leaf:   { base: '#62b86f', light: '#9dda90', dark: '#3c8650' },
    sky:    { base: '#8ec9ff', light: '#d2eaff', dark: '#5a98de' },
    peach:  { base: '#ffb08a', light: '#ffd8c2', dark: '#e57e58' },
    white:  { base: '#ffffff', light: '#ffffff', dark: '#dcd7f2' },
    wood:   { base: '#b06a3b', light: '#d08b56', dark: '#7f451f' },
    woodIn: { base: '#6c3d24', light: '#865032', dark: '#4c2816' },
    moon:   { base: '#fff0b8', light: '#fffbe8', dark: '#e6cc78' },
    red:    { base: '#ef4b5f', light: '#ff8b97', dark: '#b42b43' },
    plum:   { base: '#8a4f9e', light: '#b07cc2', dark: '#633675' },
    teal:   { base: '#3fc1c9', light: '#9be8ec', dark: '#23868f' },
    ice:    { base: '#a8d8f0', light: '#e4f6ff', dark: '#6aa9cf' },
    indigo: { base: '#6d6bff', light: '#aeacff', dark: '#4542c8' },
    coral:  { base: '#ff7a6b', light: '#ffb3a8', dark: '#d9503f' },
    berry:  { base: '#d6408f', light: '#f28bc0', dark: '#9c2566' },
    orange: { base: '#ff9a3c', light: '#ffc98a', dark: '#d96b14' },
    snow:   { base: '#f4f8ff', light: '#ffffff', dark: '#c9d6ec' },
    pine:   { base: '#2f8a5b', light: '#4fb27a', dark: '#1d5e3d' }
  };

  /* ---------- grilla ---------- */
  const G = (w, h) => ({ w, h, d: new Array(w * h).fill(null) });
  const get = (g, x, y) => (x < 0 || y < 0 || x >= g.w || y >= g.h ? null : g.d[y * g.w + x]);
  const set = (g, x, y, c) => { if (x >= 0 && y >= 0 && x < g.w && y < g.h) g.d[y * g.w + x] = c; };
  const rect = (g, x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(g, i, j, c); };

  function line(g, x0, y0, x1, y1, c) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      set(g, x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  /* mascara: fn(u, v, i, j) con u,v normalizados en [-1, 1] */
  function mask(w, h, fn) {
    const m = G(w, h);
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const u = ((i + 0.5) / w) * 2 - 1;
        const v = ((j + 0.5) / h) * 2 - 1;
        if (fn(u, v, i, j)) m.d[j * w + i] = 1;
      }
    return m;
  }

  /* pinta una mascara con luz y sombra */
  function paint(dst, m, pal, ox = 0, oy = 0, fn) {
    for (let j = 0; j < m.h; j++)
      for (let i = 0; i < m.w; i++) {
        if (!m.d[j * m.w + i]) continue;
        const L = !get(m, i - 1, j) || !get(m, i, j - 1);
        const D = !get(m, i + 1, j) || !get(m, i, j + 1);
        let c = D ? pal.dark : L ? pal.light : pal.base;
        if (fn) {
          const r = fn(i, j, c, { L, D, u: ((i + 0.5) / m.w) * 2 - 1, v: ((j + 0.5) / m.h) * 2 - 1 });
          if (r) c = r;
        }
        set(dst, ox + i, oy + j, c);
      }
  }

  function outline(g, c = OUT) {
    const add = [];
    for (let y = 0; y < g.h; y++)
      for (let x = 0; x < g.w; x++) {
        if (get(g, x, y)) continue;
        if (get(g, x - 1, y) || get(g, x + 1, y) || get(g, x, y - 1) || get(g, x, y + 1)) add.push([x, y]);
      }
    add.forEach(([x, y]) => set(g, x, y, c));
    return g;
  }

  const specAt = (g, m, ox, oy, i, j, c = '#ffffff') => { if (get(m, i, j)) set(g, ox + i, oy + j, c); };

  function fromRows(rows, map) {
    const w = Math.max(...rows.map((r) => r.length));
    const g = G(w, rows.length);
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (map[ch]) set(g, x, y, map[ch]); }));
    return g;
  }

  function pointInPoly(x, y, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  /* ---------- sprites ---------- */
  const heartFn = (u, v) => {
    const x = u * 1.22, y = -v * 1.28 + 0.12;
    const a = x * x + y * y - 1;
    return a * a * a - x * x * y * y * y <= 0;
  };

  function heart(p = 'pink') {
    const W = 15, H = 13, g = G(W + 2, H + 2);
    const m = mask(W, H, heartFn);
    paint(g, m, PAL[p], 1, 1);
    specAt(g, m, 1, 1, 3, 2); specAt(g, m, 1, 1, 2, 3); specAt(g, m, 1, 1, 3, 3, PAL[p].light);
    return outline(g);
  }

  function heartSmall(p = 'pink') {
    const g = fromRows([
      '.kk.kk.',
      'kwrkrrk',
      'krrrrdk',
      'krrrrdk',
      '.krrdk.',
      '..kdk..',
      '...k...'
    ], { k: OUT, r: PAL[p].base, w: '#ffffff', d: PAL[p].dark });
    return g;
  }

  function flowerHead(g, ox, oy, S, petal, center, n) {
    const pm = mask(S, S, (u, v) => {
      for (let k = 0; k < n; k++) {
        const a = (k * 2 * Math.PI) / n - Math.PI / 2;
        const dx = u - Math.cos(a) * 0.5, dy = v - Math.sin(a) * 0.5;
        const ru = dx * Math.cos(a) + dy * Math.sin(a);
        const rv = -dx * Math.sin(a) + dy * Math.cos(a);
        if ((ru * ru) / 0.25 + (rv * rv) / 0.13 <= 1) return true;
      }
      return false;
    });
    paint(g, pm, PAL[petal], ox, oy, (i, j, c, e) => {
      // venas suaves en cada petalo
      const ang = Math.atan2(e.v, e.u), r = Math.hypot(e.u, e.v);
      const k = ((ang + Math.PI / 2) / (2 * Math.PI)) * n;
      if (r > 0.35 && r < 0.8 && Math.abs(k - Math.round(k)) < 0.06 && !e.D) return PAL[petal].dark;
      return null;
    });
    const cm = mask(S, S, (u, v) => u * u + v * v <= 0.1);
    paint(g, cm, PAL[center], ox, oy, (i, j, c, e) => ((i + j) % 3 === 0 && !e.L && !e.D ? PAL[center].dark : null));
  }

  function flower(petal = 'pink', center = 'gold', n = 5) {
    const S = 15, g = G(S + 2, S + 2);
    flowerHead(g, 1, 1, S, petal, center, n);
    return outline(g);
  }

  function flowerStem(petal = 'pink', center = 'gold', n = 5, stemH = 16) {
    const S = 13, W = S + 6, H = S + stemH + 2;
    const g = G(W, H);
    const cx = Math.floor(W / 2);
    const stem = G(W, H);
    rect(stem, cx - 1, S - 2, 2, stemH + 2, 1);
    paint(g, stem, PAL.leaf);
    const l1 = mask(6, 4, (u, v) => u * u + v * v <= 1);
    const l2 = mask(6, 4, (u, v) => u * u + v * v <= 1);
    paint(g, l1, PAL.leaf, cx - 7, S + Math.floor(stemH * 0.35));
    paint(g, l2, PAL.leaf, cx + 1, S + Math.floor(stemH * 0.6));
    flowerHead(g, 3, 1, S, petal, center, n);
    return outline(g);
  }

  function rose() {
    const g = G(17, 19);
    const leaf = mask(7, 5, (u, v) => u * u + v * v <= 1);
    paint(g, leaf, PAL.leaf, 1, 12);
    paint(g, leaf, PAL.leaf, 9, 12);
    const S = 13;
    const m = mask(S, S, (u, v) => u * u + v * v <= 1);
    paint(g, m, PAL.rose, 2, 1, (i, j, c, e) => {
      const r = Math.hypot(e.u, e.v), th = Math.atan2(e.v, e.u);
      const s = (((th / (2 * Math.PI)) + r * 2.1) % 1 + 1) % 1;
      if (r < 0.2) return PAL.rose.dark;
      if (s < 0.2 && !e.L) return PAL.rose.dark;
      return null;
    });
    specAt(g, m, 2, 1, 3, 2, PAL.rose.light);
    specAt(g, m, 2, 1, 2, 3, PAL.rose.light);
    return outline(g);
  }

  function star(p = 'gold') {
    const S = 13, g = G(S + 2, S + 2);
    const pts = [];
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 0.46 : 1.04;
      pts.push([Math.cos(a) * r, Math.sin(a) * r + 0.08]);
    }
    const m = mask(S, S, (u, v) => pointInPoly(u, v, pts));
    paint(g, m, PAL[p], 1, 1);
    specAt(g, m, 1, 1, 6, 3); specAt(g, m, 1, 1, 5, 5, PAL[p].light);
    return outline(g);
  }

  function sparkle(main = '#ffffff', core = '#ffe9a6') {
    return fromRows([
      '...w...',
      '...w...',
      '..wyw..',
      'wwyyyww',
      '..wyw..',
      '...w...',
      '...w...'
    ], { w: main, y: core });
  }

  function sparkleSmall(main = '#ffffff') {
    return fromRows(['.w.', 'www', '.w.'], { w: main });
  }

  function moon() {
    const S = 16, g = G(S + 2, S + 2);
    const m = mask(S, S, (u, v) => u * u + v * v <= 1 && (u - 0.45) ** 2 + (v + 0.3) ** 2 > 0.62);
    paint(g, m, PAL.moon, 1, 1);
    [[4, 7], [3, 10], [6, 12], [5, 4]].forEach(([i, j]) => specAt(g, m, 1, 1, i, j, PAL.moon.dark));
    return outline(g, '#5b4a7a');
  }

  function cloud() {
    const W = 24, H = 13, g = G(W + 2, H + 2);
    const circles = [[6, 8, 5], [12, 5.5, 6], [18.5, 8, 5]];
    const m = mask(W, H, (u, v, i, j) => {
      if (j > 11) return false;
      if (i >= 3 && i <= 21 && j >= 8) return true;
      return circles.some(([cx, cy, r]) => (i + 0.5 - cx) ** 2 + (j + 0.5 - cy) ** 2 <= r * r);
    });
    paint(g, m, PAL.white, 1, 1);
    return outline(g, '#b1a6dc');
  }

  function butterfly(p = 'lilac') {
    const W = 17, H = 13, g = G(W + 2, H + 3);
    const m = mask(W, H, (u, v, i, j) => {
      const ax = Math.abs(i - 8);
      if (ax < 1) return false;
      const up = ((ax - 4) / 4.2) ** 2 + ((j - 4) / 4.2) ** 2 <= 1;
      const lo = ((ax - 3.4) / 3) ** 2 + ((j - 9.6) / 3) ** 2 <= 1;
      return up || lo;
    });
    paint(g, m, PAL[p], 1, 2, (i, j, c, e) => {
      const ax = Math.abs(i - 8);
      if ((ax - 4.6) ** 2 + (j - 3.6) ** 2 < 1.7 && !e.D) return '#fff7fb';
      if ((ax - 3.6) ** 2 + (j - 9.6) ** 2 < 0.9 && !e.D) return PAL.gold.base;
      return null;
    });
    const body = '#4a2a40';
    for (let j = 4; j <= 12; j++) set(g, 9, j, body);
    set(g, 9, 3, body);
    set(g, 8, 2, OUT); set(g, 7, 1, OUT); set(g, 10, 2, OUT); set(g, 11, 1, OUT);
    return outline(g);
  }

  function envelope(seal = 'rose', paper = 'cream') {
    const W = 22, H = 16, g = G(W, H);
    const m = G(20, 14); rect(m, 0, 0, 20, 14, 1);
    paint(g, m, PAL[paper], 1, 1);
    const fold = PAL[paper].dark;
    line(g, 1, 13, 8, 8, fold); line(g, 20, 13, 13, 8, fold);
    line(g, 1, 1, 10, 9, fold); line(g, 20, 1, 11, 9, fold);
    const hs = fromRows(['rr.rr', 'rwrrr', 'rrrrr', '.rrr.', '..r..'], { r: PAL[seal].base, w: PAL[seal].light });
    hs.d.forEach((c, k) => { if (c) set(g, 8 + (k % 5), 6 + ((k / 5) | 0), c); });
    return outline(g);
  }

  /* sobre abierto: solapa arriba y la carta asomando */
  function envelopeOpen(seal = 'rose', paper = 'cream') {
    const W = 22, H = 24, g = G(W, H);
    const P = PAL[paper];
    const fm = mask(20, 10, (u, v, i, j) => pointInPoly(i + 0.5, j + 0.5, [[0, 10], [20, 10], [10, 0]]));
    paint(g, fm, { base: P.dark, light: P.base, dark: P.dark }, 1, 0);
    rect(g, 3, 3, 16, 9, OUT);
    rect(g, 4, 4, 14, 8, '#ffffff');
    line(g, 6, 6, 15, 6, '#dcd7f2'); line(g, 6, 8, 13, 8, '#dcd7f2');
    const hs = fromRows(['r.r', 'rrr', '.r.'], { r: PAL[seal].base });
    hs.d.forEach((c, k) => { if (c) set(g, 14 + (k % 3), 8 + ((k / 3) | 0), c); });
    const pm = G(20, 12); rect(pm, 0, 0, 20, 12, 1);
    paint(g, pm, P, 1, 11);
    rect(g, 1, 10, 20, 1, OUT);
    line(g, 1, 22, 9, 16, P.dark); line(g, 20, 22, 12, 16, P.dark);
    return outline(g);
  }

  /* ---------- sprites de los estilos nuevos ---------- */
  const rows = (r, map, o = true) => (o ? outline(fromRows(r, map)) : fromRows(r, map));

  function fish(p = 'orange') {
    const P = PAL[p];
    return rows([
      '....bbbbb.....',
      '..bblllbbb..tt',
      '.bbwkbbbbbb.tt',
      'bbbbbbbbbbbbt.',
      '.bbbbbbbbbb.tt',
      '..bbdddbbb..tt',
      '....bbbbb.....'
    ], { b: P.base, l: P.light, d: P.dark, w: '#ffffff', k: OUT, t: P.dark });
  }
  function bottle() {
    return rows([
      '..cc..', '..cc..', '.gggg.', '.gwgg.', '.gwgg.', 'gggggg', 'gwpppg', 'gwpgpg', 'gwpppg',
      'gwprpg', 'gwpppg', 'gwpgpg', 'gwpppg', 'gggggg', '.gggg.'
    ], { c: PAL.wood.base, g: '#8fd7d0', w: '#e6fffb', p: PAL.cream.base, r: PAL.rose.base });
  }
  function seaweed() {
    return rows([
      '.l..', '.ll.', '..l.', '..ll', '.ll.', '.l..', 'll..', '.ll.', '..l.', '..ll', '.ll.', '.ld.', 'ld..', 'dd..'
    ], { l: PAL.leaf.light, d: PAL.leaf.dark });
  }
  function snowflake() {
    return rows(['...w...', '.w.w.w.', '..www..', 'wwwbwww', '..www..', '.w.w.w.', '...w...'], { w: '#ffffff', b: '#cfe8ff' }, false);
  }
  function pineTree() {
    const W = 15, H = 20, g = G(W, H);
    [[0, 5], [4, 6], [8, 7]].forEach(([y0, hgt]) => {
      for (let j = 0; j < hgt; j++) {
        const half = Math.round(((j + 1) / hgt) * (3 + y0 / 3));
        for (let i = 7 - half; i <= 7 + half; i++) {
          const edge = i === 7 - half || i === 7 + half;
          let c = i > 7 ? PAL.pine.dark : i < 6 ? PAL.pine.light : PAL.pine.base;
          if (j === 0 || (j === 1 && edge)) c = '#ffffff';
          set(g, i, y0 + j + 1, c);
        }
      }
    });
    rect(g, 6, 16, 3, 3, PAL.wood.dark);
    return outline(g);
  }
  function snowman() {
    return rows([
      '...kkkkk...', '...kkkkk...', '..kkkkkkk..', '...wwwww...', '..wwkwkww..', '..wwwoooo..', '...wwwww...',
      '..rrrrrrr..', '.wwwwrrwww.', 'wwwwwkwwwww', 'wwwwwwwwwww', 'wwwwwkwwwws', '.wwwwwwwws.', '..wwwwwss..'
    ], { k: OUT, w: '#ffffff', o: PAL.orange.base, r: PAL.red.base, s: PAL.snow.dark });
  }
  function rocket() {
    return rows([
      '....r....', '...rrr...', '...www...', '..wwwww..', '..wbbbw..', '..wblbw..', '..wbbbw..', '..wwwww..',
      '..wwwww..', '.rwwswwr.', 'rrwwswwrr', 'rr.www.rr', 'r..ddd..r'
    ], { r: PAL.red.base, w: '#f4f1ff', s: '#d2cdea', b: PAL.sky.base, l: '#ffffff', d: '#6c6488' });
  }
  function flame() {
    return rows(['.oyo.', 'oyyyo', 'oyyyo', '.oyo.', '..o..'], { o: PAL.orange.base, y: '#fff2b8' }, false);
  }
  function planet(p = 'peach', ringC = '#fff2b8') {
    const W = 32, H = 22, g = G(W, H);
    const ring = (front) => {
      for (let a = 0; a < Math.PI * 2; a += 0.02) {
        const sn = Math.sin(a);
        if (front ? sn < 0 : sn >= 0) continue;
        set(g, Math.round(16 + Math.cos(a) * 15), Math.round(11 + sn * 3.2 - Math.cos(a) * 2), ringC);
      }
    };
    ring(false);
    const m = mask(16, 16, (u, v) => u * u + v * v <= 1);
    paint(g, m, PAL[p], 8, 3, (i, j, c) => (j % 5 === 2 && c === PAL[p].base ? PAL[p].light : null));
    ring(true);
    return outline(g);
  }
  function note(p = 'pink') {
    const P = PAL[p];
    return rows(['..cc...', '..ccc..', '..c.cc.', '..c..c.', '..c....', '.cc....', 'ccc....', 'ccd....', '.d.....'], { c: P.base, d: P.dark });
  }
  function ladybug() {
    return rows(['..kk..', '.rkkr.', 'rkrrkr', 'rrkkrr', 'rkrrkr', '.rrrr.'], { k: OUT, r: PAL.red.base });
  }
  function lantern() {
    return rows(['..kk..', '.kkkk.', 'rrrrrr', 'rlrrrr', 'rlrrrr', 'rlrrrr', 'rrrrrr', '.kkkk.', '..yy..', '..y...'],
      { k: OUT, r: PAL.red.base, l: PAL.red.light, y: PAL.gold.base });
  }

  function giftBody() {
    const W = 34, H = 22, g = G(W + 2, H + 2);
    const m = G(W, H); rect(m, 0, 0, W, H, 1);
    paint(g, m, PAL.blush, 1, 1, (i, j, c, e) => {
      if (e.L || e.D) return null;
      if ((i % 6 === 2 && j % 6 === 3) || (i % 6 === 5 && j % 6 === 0)) return PAL.blush.light;
      return null;
    });
    const r = G(W, H); rect(r, 14, 0, 6, H, 1);
    paint(g, r, PAL.gold, 1, 1);
    rect(g, 1, 1, W, 1, PAL.blush.dark); rect(g, 15, 1, 6, 1, PAL.gold.dark);
    return outline(g);
  }

  function giftLid() {
    const W = 38, H = 8, g = G(W + 2, H + 2);
    const m = G(W, H); rect(m, 0, 0, W, H, 1);
    paint(g, m, PAL.pink, 1, 1);
    const r = G(W, H); rect(r, 16, 0, 6, H, 1);
    paint(g, r, PAL.gold, 1, 1);
    return outline(g);
  }

  function bow() {
    const W = 22, H = 11, g = G(W + 2, H + 2);
    const m = mask(W, H, (u, v, i, j) => {
      const loop = (cx) => ((i + 0.5 - cx) / 5.2) ** 2 + ((j + 0.5 - 5.5) / 5) ** 2 <= 1;
      const hole = (cx) => ((i + 0.5 - cx) / 2) ** 2 + ((j + 0.5 - 5.5) / 1.7) ** 2 < 1;
      if (i >= 9 && i <= 12 && j >= 2 && j <= 8) return true;
      return (loop(5.5) && !hole(5.2)) || (loop(16.5) && !hole(16.8));
    });
    paint(g, m, PAL.gold, 1, 1);
    rect(g, 10, 4, 4, 4, PAL.gold.dark);
    return outline(g);
  }

  function chestLid() {
    const W = 44, H = 16, g = G(W + 2, H + 2);
    const rr = 4;
    const inLid = (i, j) => {
      if (j < rr && i < rr) return (rr - i - 0.5) ** 2 + (rr - j - 0.5) ** 2 <= rr * rr;
      if (j < rr && i >= W - rr) return (i - (W - rr) + 0.5) ** 2 + (rr - j - 0.5) ** 2 <= rr * rr;
      return true;
    };
    const m = mask(W, H, (u, v, i, j) => inLid(i, j));
    paint(g, m, PAL.woodIn, 1, 1, (i, j, c, e) => (j % 5 === 4 && !e.L && !e.D ? '#432212' : null));
    const b = mask(W, H, (u, v, i, j) => inLid(i, j) && ((i >= 5 && i < 9) || (i >= 35 && i < 39) || j >= 13));
    paint(g, b, PAL.gold, 1, 1);
    return outline(g);
  }

  function chestBody() {
    const W = 44, H = 26, g = G(W + 2, H + 2);
    const m = G(W, H); rect(m, 0, 0, W, H, 1);
    paint(g, m, PAL.wood, 1, 1, (i, j, c, e) => {
      if (e.L || e.D) return null;
      if (j % 7 === 6) return '#6a3618';
      if ((i * 7 + j * 13) % 23 === 0) return PAL.wood.light;
      return null;
    });
    const b = mask(W, H, (u, v, i, j) => (i >= 5 && i < 9) || (i >= 35 && i < 39) || j < 3);
    paint(g, b, PAL.gold, 1, 1, (i, j, c, e) => ((j % 6 === 5 && i < 40) && !e.L && !e.D ? PAL.gold.light : null));
    const lock = G(W, H); rect(lock, 18, 7, 8, 10, 1);
    paint(g, lock, PAL.gold, 1, 1);
    [[22, 10], [23, 10], [22, 11], [23, 11], [22, 12], [23, 12], [22, 13], [23, 13]].forEach(([x, y]) => set(g, x, y, OUT));
    [[21, 11], [24, 11]].forEach(([x, y]) => set(g, x, y, '#3a1d10'));
    return outline(g);
  }

  function strawberry() {
    const W = 15, H = 14, g = G(W + 2, H + 6);
    const m = mask(W, H, (u, v) => {
      const t = (v + 1) / 2;
      const hw = 0.98 - Math.pow(t, 2.2) * 0.8;
      const top = t < 0.12 ? Math.sqrt(t / 0.12) : 1;
      return Math.abs(u) <= hw * top;
    });
    paint(g, m, PAL.red, 1, 4, (i, j, c, e) => {
      if (e.D) return null;
      if (j % 3 === 1 && (i + (j % 2 ? 2 : 0)) % 4 === 0) return '#ffe7a3';
      return null;
    });
    specAt(g, m, 1, 4, 3, 2, '#ffd0d6');
    const leaf = mask(W, 5, (u, v, i, j) => {
      const x = i - 7;
      if (j < 2) return x === 0 || (x === 1 && j === 1);
      return Math.abs(x) <= 7 - (j - 2) * 2.2 && (Math.abs(x) + j) % 3 !== 0;
    });
    paint(g, leaf, PAL.leaf, 1, 1);
    return outline(g);
  }

  function mushroom() {
    const g = G(20, 19);
    const stem = G(8, 7); rect(stem, 0, 0, 8, 7, 1);
    paint(g, stem, PAL.cream, 6, 10);
    set(g, 8, 12, OUT); set(g, 11, 12, OUT);
    set(g, 7, 13, PAL.pink.base); set(g, 12, 13, PAL.pink.base);
    set(g, 9, 14, OUT); set(g, 10, 14, OUT);
    const dots = [[4.5, 4, 1.7], [11.5, 3, 2.1], [8.5, 7.4, 1.3], [15.2, 7, 1.3], [1.8, 7.6, 1]];
    const cap = mask(18, 10, (u, v) => u * u + ((v - 1) / 1.95) ** 2 <= 1);
    paint(g, cap, PAL.red, 1, 1, (i, j, c, e) => {
      if (dots.some(([x, y, r]) => (i + 0.5 - x) ** 2 + (j + 0.5 - y) ** 2 <= r * r)) return e.D ? '#f1dccf' : '#ffffff';
      return null;
    });
    return outline(g);
  }

  /* conejito abrazando un corazón */
  function bunny() {
    const W = 22, H = 28, g = G(W + 2, H + 2);
    const ell = (cx, cy, rx, ry) => (u, v, i, j) => ((i + 0.5 - cx) / rx) ** 2 + ((j + 0.5 - cy) / ry) ** 2 <= 1;
    const fur = { base: '#fffafc', light: '#ffffff', dark: '#e3d6ee' };
    // cuerpo y patitas
    paint(g, mask(W, H, ell(11, 23.5, 7, 4.6)), fur, 1, 1);
    paint(g, mask(W, H, ell(6.5, 26.2, 2.6, 1.6)), fur, 1, 1);
    paint(g, mask(W, H, ell(15.5, 26.2, 2.6, 1.6)), fur, 1, 1);
    // orejas (una doblada)
    const earL = mask(W, H, ell(7, 6.5, 2.4, 6.2));
    const earR = mask(W, H, (u, v, i, j) => ell(15.2, 6.8, 2.4, 6)(u, v, i, j) && !(j < 3 && i > 15));
    paint(g, earL, fur, 1, 1);
    paint(g, earR, fur, 1, 1);
    paint(g, mask(W, H, ell(7, 7.5, 1, 4.4)), PAL.blush, 1, 1);
    paint(g, mask(W, H, ell(15.2, 8, 1, 4)), PAL.blush, 1, 1);
    // cabeza
    paint(g, mask(W, H, ell(11, 15.5, 7.6, 6)), fur, 1, 1);
    // cara
    const eye = '#2b1733';
    [[7, 15], [8, 15], [7, 16], [8, 16], [14, 15], [15, 15], [14, 16], [15, 16]].forEach(([x, y]) => set(g, x, y, eye));
    set(g, 7, 15, '#ffffff'); set(g, 14, 15, '#ffffff');
    [[5, 18], [6, 18], [16, 18], [17, 18]].forEach(([x, y]) => set(g, x, y, PAL.pink.base));
    set(g, 11, 17, PAL.pink.dark); set(g, 12, 17, PAL.pink.dark);
    set(g, 11, 18, eye); set(g, 12, 18, eye);
    // corazón que abraza
    const hs = fromRows(['.rr.rr.', 'rwrrrrr', 'rrrrrrd', '.rrrrd.', '..rrd..', '...d...'], { r: PAL.rose.base, w: PAL.rose.light, d: PAL.rose.dark });
    hs.d.forEach((c, k) => { if (c) set(g, 9 + (k % 7), 21 + ((k / 7) | 0), c); });
    // bracitos
    set(g, 8, 23, fur.dark); set(g, 16, 23, fur.dark);
    return outline(g);
  }

  function heartEmpty() {
    return fromRows([
      '.kk.kk.',
      'keekeek',
      'keeeeek',
      'keeeeek',
      '.keeek.',
      '..kek..',
      '...k...'
    ], { k: OUT, e: '#e9dff2' });
  }

  function sun() {
    const g = G(23, 23);
    const m = mask(13, 13, (u, v) => u * u + v * v <= 1);
    paint(g, m, PAL.gold, 5, 5);
    specAt(g, m, 5, 5, 3, 3);
    const c = PAL.gold.dark;
    [[11, 0, 11, 2], [11, 20, 11, 22], [0, 11, 2, 11], [20, 11, 22, 11], [3, 3, 4, 4], [18, 3, 19, 4], [3, 19, 4, 18], [18, 18, 19, 19]]
      .forEach(([a, b, x, y]) => line(g, a, b, x, y, c));
    return g;
  }

  function petal() {
    return fromRows(['.pp..', 'pwpp.', 'ppppp', '.ppdp', '..dd.'], { p: '#ffc3d6', w: '#fff1f6', d: '#f39ab8' });
  }

  /* ---------- registro ---------- */
  const builders = {
    heart: () => heart('pink'),
    'heart-rose': () => heart('rose'),
    'heart-lilac': () => heart('lilac'),
    'heart-gold': () => heart('gold'),
    'heart-s': () => heartSmall('pink'),
    'heart-s-rose': () => heartSmall('rose'),
    flower: () => flower('pink', 'gold', 5),
    'flower-lilac': () => flower('lilac', 'gold', 6),
    'flower-white': () => flower('white', 'gold', 8),
    'flower-peach': () => flower('peach', 'rose', 5),
    'stem-pink': () => flowerStem('pink', 'gold', 5, 18),
    'stem-lilac': () => flowerStem('lilac', 'gold', 6, 24),
    'stem-white': () => flowerStem('white', 'gold', 8, 14),
    'stem-peach': () => flowerStem('peach', 'rose', 5, 20),
    'stem-sky': () => flowerStem('sky', 'gold', 6, 16),
    rose,
    star: () => star('gold'),
    'star-pink': () => star('pink'),
    sparkle: () => sparkle(),
    'sparkle-pink': () => sparkle('#ffc2d8', '#ffffff'),
    'sparkle-s': () => sparkleSmall(),
    moon,
    cloud,
    butterfly: () => butterfly('lilac'),
    'butterfly-pink': () => butterfly('pink'),
    'butterfly-sky': () => butterfly('sky'),
    envelope: () => envelope('rose'),
    'envelope-lilac': () => envelope('lilac'),
    'envelope-mint': () => envelope('mint'),
    'envelope-sky': () => envelope('sky'),
    'envelope-gold': () => envelope('gold'),
    'envelope-pink': () => envelope('pink', 'blush'),
    'fish-orange': () => fish('orange'), 'fish-pink': () => fish('pink'), 'fish-teal': () => fish('teal'), 'fish-gold': () => fish('gold'),
    bottle, seaweed, snowflake, pineTree, snowman, rocket, flame, ladybug, lantern,
    planet: () => planet('peach'), 'planet-teal': () => planet('teal', '#e0d4ff'),
    'note-pink': () => note('pink'), 'note-gold': () => note('gold'), 'note-lilac': () => note('lilac'), 'note-mint': () => note('mint'),
    giftBody, giftLid, bow,
    chestLid, chestBody,
    strawberry, mushroom, bunny, sun, petal,
    'heart-s-empty': heartEmpty
  };

  /* sobres cerrados y abiertos para cada color de sello */
  ['rose', 'lilac', 'mint', 'gold', 'plum', 'sky', 'peach', 'pink', 'teal', 'red', 'ice', 'indigo', 'coral', 'leaf', 'berry'].forEach((c) => {
    const paper = c === 'pink' ? 'blush' : 'cream';
    if (!builders['envelope-' + c]) builders['envelope-' + c] = () => envelope(c, paper);
    builders['open-' + c] = () => envelopeOpen(c, paper);
  });

  const cache = new Map();
  function build(name) {
    if (cache.has(name)) return cache.get(name);
    const g = builders[name]();
    const c = document.createElement('canvas');
    c.width = g.w; c.height = g.h;
    const x = c.getContext('2d');
    g.d.forEach((col, k) => { if (col) { x.fillStyle = col; x.fillRect(k % g.w, (k / g.w) | 0, 1, 1); } });
    const out = { url: c.toDataURL(), w: g.w, h: g.h, canvas: c };
    cache.set(name, out);
    return out;
  }

  /* img pixelada; scale = cuantos px de pantalla por pixel */
  function img(name, scale = 4, cls = '') {
    const s = build(name);
    const el = document.createElement('img');
    el.src = s.url;
    el.alt = '';
    el.draggable = false;
    el.className = 'px ' + cls;
    el.width = s.w * scale;
    el.height = s.h * scale;
    return el;
  }

  window.PX = { build, img, url: (n) => build(n).url, names: Object.keys(builders), PAL, OUT };
})();
