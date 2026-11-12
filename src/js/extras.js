/* =========================================================
   Detalles animados extra para cada escena.
   FX.sceneBase llama a SCENE_EXTRAS[tema](el) al crear la escena.
   Todo es decorativo (pointer-events: none) y animado con CSS.
   ========================================================= */
(function () {
  const { h, rand, pick, depth, floaters } = FX;
  const small = () => innerWidth < 600;
  const many = (n, make) => Array.from({ length: n }, (_, i) => make(i));
  const birdSvg = '<svg viewBox="0 0 9 4" shape-rendering="crispEdges" aria-hidden="true"><path d="M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM4 2h1v1H4zM5 1h1v1H5zM6 0h1v1H6zM7 0h1v1H7z" transform="translate(0.5 0)"/></svg>';
  const birds = (el, n, cls) => many(n, () => {
    const b = h('span', 'bird ' + cls, birdSvg);
    b.style.top = rand(6, 32) + '%';
    b.style.setProperty('--d', rand(16, 28).toFixed(1) + 's');
    b.style.setProperty('--dl', (-rand(0, 20)).toFixed(1) + 's');
    b.style.setProperty('--s', rand(0.6, 1.1).toFixed(2));
    el.appendChild(b);
    return b;
  });

  window.SCENE_EXTRAS = {
    /* carta: rayo de luz de ventana con polvito flotando */
    'th-carta'(el) {
      const beam = h('div', 'x-beam');
      floaters(beam, small() ? 6 : 10, ['sparkle-s']);
      el.appendChild(beam);
    },
    /* noche: casita con ventana encendida y humo, nube que pasa frente a la luna */
    'th-noche'(el) {
      el.appendChild(depth(h('div', 'x-house', '<i class="roof"></i><i class="win"></i><i class="chim"></i><i class="smoke s1"></i><i class="smoke s2"></i><i class="smoke s3"></i>'), 8));
      const c = PX.img('cloud', 4, 'x-mooncloud');
      el.appendChild(c);
    },
    /* jardín: abejitas volando en ochos */
    'th-jardin'(el) {
      many(small() ? 2 : 3, (i) => {
        const b = h('span', 'x-bee b' + i, '<i class="wing"></i><i class="wing w2"></i>');
        el.appendChild(b);
      });
    },
    /* videojuego: suelo de colinas que avanza y bloques "?" */
    'th-rpg'(el) {
      el.appendChild(h('div', 'x-hills8'));
      many(small() ? 2 : 3, (i) => {
        const q = h('span', 'x-qblock q' + i, '?');
        el.appendChild(q);
      });
    },
    /* scrapbook: guirnalda de lucecitas */
    'th-scrap'(el) {
      const g = h('div', 'x-lights');
      many(Math.max(8, Math.round(innerWidth / 60)), (i) => { const b = h('i'); b.style.setProperty('--i', i % 4); g.appendChild(b); });
      el.appendChild(g);
    },
    /* lluvia: pájaros que aparecen cuando sale el sol */
    'th-lluvia'(el) {
      birds(el, 4, 'x-lbird');
    },
    /* sakura: monte nevado a lo lejos y pájaros */
    'th-sakura'(el) {
      el.appendChild(depth(h('div', 'x-mount', '<i></i>'), 4));
      birds(el, 3, 'x-sbird');
    },
    /* océano: medusas que laten y reflejos de luz en movimiento */
    'th-mar'(el) {
      el.appendChild(h('div', 'x-caustics'));
      many(small() ? 2 : 3, (i) => {
        const j = h('span', 'x-jelly j' + i, '<i class="bell"></i><i class="tent"></i>');
        j.style.left = [12, 82, 60][i] + '%';
        el.appendChild(j);
      });
    },
    /* cine: público que se mueve en las butacas */
    'th-cine'(el) {
      const crowd = h('div', 'x-crowd');
      many(Math.round(innerWidth / 70), (i) => { const p = h('i'); p.style.left = (i / Math.round(innerWidth / 70)) * 100 + rand(0, 4) + '%'; p.style.setProperty('--dl', (-rand(0, 3)).toFixed(2) + 's'); crowd.appendChild(p); });
      el.appendChild(crowd);
    },
    /* nieve: cabaña con chimenea humeando y aurora */
    'th-nieve'(el) {
      el.appendChild(h('div', 'aurora x-naurora', '<i></i><i></i>'));
      el.appendChild(depth(h('div', 'x-cabin', '<i class="roof"></i><i class="win"></i><i class="chim"></i><i class="smoke s1"></i><i class="smoke s2"></i><i class="smoke s3"></i>'), 10));
    },
    /* globos: globo aerostático a lo lejos */
    'th-globos'(el) {
      el.appendChild(depth(h('div', 'x-air', '<i class="env"></i><i class="ropes"></i><i class="basket"></i>'), 6));
    },
    /* luciérnagas: hongos que brillan y búho que parpadea */
    'th-bosque'(el) {
      const sh = h('div', 'x-shrooms');
      many(small() ? 4 : 7, (i) => { const m = PX.img('mushroom', pick([2, 3]), 'x-shroom'); m.style.left = rand(2, 96) + '%'; m.style.setProperty('--dl', (-rand(0, 3)).toFixed(2) + 's'); sh.appendChild(m); });
      el.appendChild(sh);
      many(2, (i) => el.appendChild(h('span', 'x-eyes e' + i, '<i></i><i></i>')));
    },
    /* música: bola de disco girando con destellos que barren la escena */
    'th-musica'(el) {
      el.appendChild(h('div', 'x-disco', '<i class="string"></i><i class="ball"></i>'));
      el.appendChild(h('div', 'x-spots', '<i></i><i></i><i></i><i></i>'));
    }
  };
})();
