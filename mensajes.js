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
      - Para versos (canciones, poemas) empieza cada línea con  >
        y se respetará cada salto de línea.

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
    nombre: 'Melisa Mantilla',
    estilo: 'carta',
    mensaje: `
      Mi querida Mili ❤️

      Quiero que sepas que cuentas conmigo, que no estás sola y que, aunque sé
      que estás atravesando un momento muy difícil, deseo de corazón que
      encuentres mucha fortaleza para afrontar cada día.

      Ten mucha fe en Dios, confía en él y pídele que te dé las fuerzas
      necesarias para seguir adelante. Estoy segura de que encontrarás en él
      ese refugio, esa paz y esa fortaleza que tanto necesitas en estos momentos.

      Aquí estoy para escucharte, apoyarte y acompañarte en lo que necesites.
      No dudes en buscarme que ahí estaré.

      Te mando un abrazo enorme, recuerda que te quiero mucho mi Mili.
    `,
  },

  {
    nombre: 'Diana Cabrera',
    estilo: 'luciernagas',
    mensaje: `
      Amiga, ojalá pudieras verte con los ojos de quienes te queremos, para que
      descubras la fuerza y la luz que llevas dentro, incluso cuando tú no logras
      encontrarlas. No permitas que este capítulo difícil te haga olvidar lo
      valiosa que eres.

      A veces la vida nos rompe los planes, pero no los sueños ni la posibilidad
      de volver a empezar. Abraza tu proceso, no pierdas tu esencia y recuerda
      que todavía hay mucha vida bonita esperándote. Te mereces volver a ser
      feliz. ❤️
    `,
  },

  {
    nombre: 'Miriam Otiniano',
    estilo: 'lluvia',
    mensaje: `
      ¡Hola Milagros!

      Sé que estás pasando por un momento difícil y que hay días que pueden
      tornarse grises. A veces, la vida nos pone frente a situaciones que no
      esperamos, pero quiero pedirte que nunca pierdas esa fortaleza que te
      caracteriza. Recuerda que aquí cuentas con personas que te aprecian
      muchísimo y que te desean lo mejor.

      De todo corazón, te envío un abrazo muy fuerte a la distancia.
    `,
  },

  {
    nombre: 'Greysi Zavaleta',
    estilo: 'noche',
    mensaje: `
      Milagros, hay cosas que no podemos controlar como quisiéramos, como que
      todos nuestros seres queridos se encuentren bien, pero confío en que todo
      irá lo mejor posible.

      Le pido a Dios que te dé mucha fuerza y fortaleza en estos momentos
      difíciles que tienes que afrontar. Estoy orando por que todo salga bien
      para tu familia.

      Cuentas conmigo para lo que necesites y tienes mi apoyo incondicional.
      Tal vez no pueda estar físicamente apoyándote, pero mis oraciones van
      dirigidas para tu familia. Te mando un fuerte abrazo. 🩷
    `,
  },

  {
    nombre: 'Greysi Guzman',
    estilo: 'jardin',
    mensaje: `
      Amiga Milagros, tú sabes el cariño y el aprecio tan grande que te tengo.
      Tú bien sabes cómo nos conocimos y cómo, en una oportunidad, cuando estabas
      pasando por momentos difíciles, te brindé mis palabras de aliento. Hoy
      nuevamente quiero hacerlo.

      Sé que no es fácil pasar por una situación así. No existen palabras que
      puedan calmar el dolor que uno siente cuando una persona a quien ama con
      todo su corazón, como lo es una madre, se encuentra delicada de salud.

      Solo quiero decirte que tengas mucha fortaleza, amiga. Trata de mantenerte
      fuerte y que tu mamita te vea así. Dale todo tu amor, abrázala, llénala de
      besos y dile muchas veces cuánto la amas. Disfruta cada momento a su lado
      y ten mucha fe, porque todo está en las manos de Dios.

      Le pido a Dios que te dé esa fortaleza, esa tranquilidad y esa paz que
      tanto necesitas en estos momentos, y que también cuide de la salud de tu
      mamita.

      Te quiero mucho, amiga. Recuerda que aquí tienes a alguien que te aprecia
      y que te acompaña de corazón en estos momentos difíciles.

      Con mucho cariño, tu amiga Greisy. ❤️
    `,
  },

  {
    nombre: 'Rita Enciso',
    estilo: 'sakura',
    mensaje: `
      Milagritos, deseo de todo corazón que tu mamita se recupere pronto y no
      dejes de confiar en nuestro Padre amado 🙌🙏

      Que sea Él quien le brinde la salud y el bienestar que ella necesita.

      Qué lindo que la acompañes en estos momentos, llénala de mucho amor y
      cuidados 🙌🤗

      Te mando un abrazo con mucho cariño y fortaleza 🤗🤗🤗💖
    `,
  },

  {
    nombre: 'Pamela Palacios',
    estilo: 'musica',
    mensaje: `
      ¡Hola Milagros! Te envío este himno bonito porque Jesucristo es quien
      puede sentir lo que estás pasando ahora, y sí, puedes contar conmigo
      también. Un abrazo 🤗

      > No temas, no te angusties,
      > oigo al Señor decir.
      > En Su bondad descanso,
      > dejo el temor huir.

      > A Cristo paso a paso
      > yo siempre seguiré.
      > Si Él cuida de las aves,
      > cuidará de mí también.
      > Si Él cuida de las aves,
      > cuidará de mí también. 🎵🎶
    `,
  },

  {
    nombre: 'Nohelia Izquierdo',
    estilo: 'videojuego',
    mensaje: `
      Mili, sé que estás pasando por un momento difícil, pero quiero que
      recuerdes que ninguna situación difícil dura para siempre. Ten mucha
      fuerza, paciencia y fe en que las cosas van a mejorar; incluso en los días
      más complicados, siempre hay una razón para seguir adelante.

      Los problemas no duran para siempre. No pierdas la esperanza en que todo
      se va a solucionar. ¡Mucho ánimo y un abracito a la distancia! ❤️
    `,
  },

  {
    nombre: 'Ana Lucia Becerra',
    estilo: 'scrapbook',
    mensaje: `
      Hola Mila, ¿cómo te encuentras?

      No sé qué situación estés pasando en este momento, pero quiero que sepas
      que eres una mujer fuerte y que, aunque hoy estés atravesando un momento
      difícil, confío en que poco a poco todo irá mejorando.

      No te desanimes, date tiempo y recuerda lo valiosa que eres. Que nunca te
      falten fuerzas para seguir adelante ni motivos para sonreír. ¡Te deseo
      mucha fortaleza y cosas bonitas! 💗
    `,
  },

  {
    nombre: 'Wendy Lecca',
    estilo: 'globos',
    mensaje: `
      Mili, los momentos difíciles ocurren más a menudo de lo que imaginas, pero
      poco a poco vas a poder superar todas las adversidades y sentirte libre y
      plena si te lo propones.

      Mantente fuerte, amiga. Recuerda que aquí tienes a un grupo que te aprecia,
      te quiere mucho y espera que siempre estés bien. Te quiero mucho.
    `,
  },

  {
    nombre: '???',
    estilo: 'mew',
    mensaje: `
      Mili, sé que estás atravesando un momento muy difícil y quiero que
      recuerdes que no tienes que llevar todo ese peso tú sola. A veces las
      circunstancias nos sobrepasan y está bien sentirse cansada, triste o no
      tener fuerzas.

      No olvides que tienes personas que te quieren, que se preocupan por ti y
      que están dispuestas a acompañarte cuando más lo necesites. También es
      importante que te permitas descansar y cuidar de ti misma.

      Recuerda que Dios nos enseña que debemos llevar las cargas los unos de los
      otros, y que apoyarnos en quienes nos rodean también es una forma de
      encontrar fuerzas para seguir adelante. Afronta cada día a tu propio ritmo,
      un paso a la vez. ❤️
    `,
  },

  {
    nombre: 'Kinmerlyn Gavidia',
    estilo: 'pochita',
    mensaje: `
      Mily amiga, sé que estás pasando por un mal momento, pero debes ser fuerte
      por tu familia. Eres una persona muy fuerte que puede con todo.

      Te quiero mucho y siempre estaré para ti, en cualquier momento y a
      cualquier hora. Te quiero mucho.
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
    'musica/tercera.mp3',
  ],

  // Segundos que dura el fundido entre una canción y la siguiente
  fundido: 5,

  // Volumen de la canción, de 0 (silencio) a 1 (máximo)
  volumen: 0.5,
};
