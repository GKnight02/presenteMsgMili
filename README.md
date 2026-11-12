# Cartas para Milagros 💌

Sitio estático (HTML + CSS + JS, sin dependencias ni build) con mensajes de ánimo para Milagros.

**Recorrido:** caja de regalo (se abre al tocarla, y empieza la canción) → una carta por persona, cada una con su propio estilo y transición → desfile de nombres y remolino final → cae un cofre con todas las cartas, que se abre para volver a leer cualquiera.

## Editar los mensajes (lo único que tienes que tocar)

Abre [`mensajes.js`](mensajes.js) y agrega un bloque por persona:

```js
{
  nombre: 'Nombre de quien escribe',
  mensaje: `
    Primer párrafo del mensaje, puede ocupar
    varias líneas.

    Una línea en blanco separa párrafos.
  `,
},
```

- El orden de la lista es el orden de las cartas.
- Al final del archivo, en `AJUSTES`, puedes cambiar el nombre de la portada y el mensaje que forma el remolino final.
- Hay 15 estilos de carta, uno distinto para cada mensaje (hasta 15), en este orden: carta, noche, jardin, videojuego, scrapbook, lluvia, mew, pochita, oceano, cine, nieve, sakura, globos, luciernagas y musica. La tabla completa está al inicio de `mensajes.js`.
- Para elegir el estilo de un mensaje a mano, agrégale `estilo: 'pochita'` (o cualquier otro nombre de la tabla). Los demás se reparten solos sin repetirse.
- Al terminar el remolino cae un cofre donde entran todas las cartas; al tocarlo se abre y se puede elegir qué carta volver a leer.

## Estructura

```
mensajes.js      ← nombres y mensajes (editar aquí)
index.html
src/
  css/styles.css
  js/pixel.js    pixel art generado por código
  js/fx.js       animaciones, transiciones y efectos
  js/scenes.js   portada, estilos 1–8, final y cofre
  js/themes-extra.js  estilos 9–15 (incluye Mew y Pochita)
  js/extras.js   detalles animados extra de cada escena
  css/themes-extra.css
  css/extras.css
  js/app.js      navegación
```

## Verlo en local

Doble clic en `index.html`, o con un servidor:

```bash
python -m http.server 5173
```

y abre http://localhost:5173

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `cartas-mili`).
2. Sube el proyecto a la rama `main`:

```bash
git init
git add .
git commit -m "Cartas para Milagros"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cartas-mili.git
git push -u origin main
```

3. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. El workflow `.github/workflows/deploy.yml` lo publica en cada push. La URL será `https://TU_USUARIO.github.io/cartas-mili/`.

## Controles

- Quien lee decide cuándo pasar a la siguiente carta. Cuando una carta termina de aparecer, el botón "Siguiente" late suavemente para indicarlo.
- Se puede avanzar con los botones de abajo, tocando un sobre del tendedero, con las flechas del teclado o deslizando el dedo en el móvil.
- `Esc` vuelve al cofre (una vez desbloqueado).
- El navegador recuerda que el cofre ya fue abierto. Desde entonces aparece un ícono discreto de cofre arriba a la derecha, tanto en la portada como en cada carta, para ir directo al cofre.

## Canción

1. Copia el archivo `.mp3` en la carpeta [`musica/`](musica/).
2. En `mensajes.js`, dentro de `AJUSTES`, escribe su nombre en `cancion` (por ejemplo `'musica/the-middle.mp3'`) y ajusta `volumen` (de 0 a 1).
3. La canción empieza en el momento en que ella abre la caja y suena una sola vez. Si no hay archivo, todo funciona igual, sin música.
4. Mientras suena aparece un ícono discreto de parlante arriba a la derecha (junto al cofre) para silenciarla o reactivarla.
5. Cuando ella abre el cofre, si la canción sigue sonando, se apaga suavemente y ya no vuelve a sonar.
