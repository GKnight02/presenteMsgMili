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
   Hay 15 estilos distintos: cada mensaje (hasta 15) tendrá el suyo.
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
};
