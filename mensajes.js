/* ╔══════════════════════════════════════════════════════════╗
   ║   ✏️  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR        ║
   ╚══════════════════════════════════════════════════════════╝

   Cómo agregar un mensaje:
   1. Copia un bloque completo desde {  hasta  },
   2. Cambia el nombre (entre comillas ' ').
   3. Escribe el mensaje entre las comillas invertidas ` `.
      - Puedes usar varias líneas.
      - Deja una línea en blanco para empezar otro párrafo.
      - No uses el carácter ` dentro del mensaje.

   El orden aquí es el orden en que se mostrarán las cartas.

   ── QUÉ ESTILO LE TOCA A CADA MENSAJE ──────────────────────
   Según su posición en esta lista:

     1. carta        Carta de papel: el sobre cae y estalla en corazones
     2. noche        Cielo estrellado con aurora y constelación de corazón
     3. jardin       Jardín de flores, mariposas y una catarina
     4. videojuego   Conejito estilo videojuego, el texto se escribe solo
     5. scrapbook    Nota pegada con cintas, stickers y polaroid
     6. lluvia       Tormenta que se despeja y sale el arcoíris
     7. mew          Mew llega en una burbuja y vuela riéndose alrededor
     8. pochita      Pochita llega corriendo con la carta en la boca
     9. oceano       Botella con mensaje bajo el mar
    10. cine         Telón, cuenta 3·2·1 y créditos con el nombre
    11. nieve        Ventana empañada en un paisaje nevado
    12. sakura       Tarjeta colgante con pétalos de cerezo y faroles
    13. globos       Tarjeta que sube con globos y confeti
    14. luciernagas  Bosque de noche; las luciérnagas encienden el texto
    15. musica       Tocadiscos y letra estilo karaoke

   ¿Quieres elegirlo tú? Agrega  estilo: 'nombre'  al mensaje:

     {
       nombre: 'Ana',
       estilo: 'pochita',
       mensaje: `...`,
     },

   Los mensajes sin "estilo" toman los que queden libres, en el
   orden de la tabla, sin repetirse. Además existen 'atardecer' y
   'espacio' por si quieres usarlos a mano.
*/

const MENSAJES = [

  {
    nombre: 'Persona 1',
    mensaje: `
      Mili, sé que estos días pesan, pero quiero que sepas
      que no tienes que cargar con todo tú sola.

      Aquí estoy, hoy y siempre, para lo que necesites.
    `,
  },

  {
    nombre: 'Persona 2',
    mensaje: `
      Eres de las personas más fuertes que conozco, incluso cuando
      no te sientes así. Respira, ve paso a paso. Lo estás haciendo
      mejor de lo que crees.
    `,
  },

  {
    nombre: 'Persona 3',
    mensaje: `
      Cada vez que te ríes, el lugar se ilumina. Vas a volver a reír así,
      te lo prometo. Mientras tanto, déjanos acompañarte.
    `,
  },

  {
    nombre: 'Persona 4',
    mensaje: `
      ¡Misión de hoy: recordar lo increíble que eres! Recompensa: un abrazo
      gigante de mi parte cuando nos veamos.
    `,
  },

  {
    nombre: 'Persona 5',
    mensaje: `
      Guardo muchos recuerdos bonitos contigo y sé que vendrán muchos más.
      Esto también va a pasar, y vas a salir más brillante.
    `,
  },

  {
    nombre: 'Persona 6',
    mensaje: `
      Después de la tormenta siempre sale el sol, aunque a veces tarde
      un poquito. Te esperamos con paciencia y con mucho cariño.
    `,
  },

  {
    nombre: 'Persona 7',
    mensaje: `
      Si algún día sientes que no puedes más, piensa en todas las personas
      que te quieren. Somos muchas, y estamos contigo.
    `,
  },

  {
    nombre: 'Persona 8',
    mensaje: `
      Las flores no florecen todas al mismo tiempo, y está bien.
      Tómate tu tiempo, Mili. Tu momento va a llegar.
    `,
  },

];


/* ── Ajustes opcionales (puedes dejarlos así) ───────────────── */
const AJUSTES = {
  // Nombre que aparece en la portada: "Para ..."
  para: 'Milagros',

  // Texto que forman las partículas al final (1 o 2 líneas cortas)
  finalLineas: ['Nunca estás sola', 'Milagros'],

  // Frase debajo del mensaje final
  finalSub: 'Cada una de estas cartas es tuya para siempre. Vuelve a leerlas cuando lo necesites.',

  // Música (opcional): empieza a sonar justo cuando ella abre la caja.
  // Las canciones suenan en este orden, con un fundido suave entre una y
  // otra, y al terminar la última vuelve a empezar por la primera.
  // 1. Copia los archivos .mp3 dentro de la carpeta "musica".
  // 2. Escribe aquí sus nombres, en el orden en que quieres que suenen.
  // Deja la lista vacía ([]) si no quieres música.
  canciones: [
    'musica/primero.mp3',
    'musica/segundo.mp3',
    // 'musica/tercera.mp3',
  ],

  // Segundos que dura el fundido entre una canción y la siguiente
  fundido: 5,

  // Volumen de la canción, de 0 (silencio) a 1 (máximo)
  volumen: 0.5,
};
