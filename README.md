# Cartas para Milagros 💌

Sitio estático (HTML + CSS + JS, sin dependencias ni build) con mensajes de ánimo para Milagros.

**Recorrido:** caja de regalo (se abre sola si nadie la toca) → una carta por persona, cada una con su propio estilo y transición, avanzando sola según el largo del mensaje → desfile de nombres y remolino final que forma un mensaje → cofre abierto para volver a leer cualquier carta.

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
- Hay 15 estilos de carta, uno distinto para cada mensaje (hasta 15): carta, noche estrellada, jardín, videojuego, scrapbook, lluvia → arcoíris, atardecer, sakura, océano, cine, nieve, espacio, globos, luciérnagas y música. Si hubiera más de 15, se repiten en orden.

## Estructura

```
mensajes.js      ← nombres y mensajes (editar aquí)
index.html
src/
  css/styles.css
  js/pixel.js    pixel art generado por código
  js/fx.js       animaciones, transiciones y efectos
  js/scenes.js   portada, estilos 1–8, final y cofre
  js/themes-extra.js  estilos 9–15
  css/themes-extra.css
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

- Las cartas avanzan solas: la barra del botón "Siguiente" muestra cuánto falta. El botón de arriba a la derecha (o la barra espaciadora) pausa y reanuda. Si la persona toca la pantalla o hace scroll, la cuenta espera unos segundos.
- También se puede avanzar con los botones de abajo, tocando un sobre del tendedero, con las flechas del teclado o deslizando el dedo en el móvil.
- `Esc` vuelve al cofre (una vez desbloqueado).
- El navegador recuerda que el cofre ya fue abierto y muestra un atajo en la portada.
