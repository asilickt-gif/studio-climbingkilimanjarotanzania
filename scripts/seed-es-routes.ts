/**
 * Phase 6 (Spanish): the 6 `route` documents (Machame, Marangu, Lemosho,
 * Rongai, Umbwe, Northern Circuit) plus the routesHubPage singleton.
 * Mirrors seed-it-routes.ts's field construction but with Spanish text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-routes.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

const arrivalStopEs = {
  label: 'Llegada y Briefing',
  meta: ['🏨 Clásico: Ameg Lodge | Premium: Kaliwa Lodge'],
  body: [
    'A tu llegada al Aeropuerto Internacional del Kilimanjaro, serás trasladado a tu alojamiento, donde tu guía realizará un briefing completo y una revisión del equipo para prepararte para la aventura que te espera.',
  ],
}
const departureStopEs = {
  label: 'Salida o Continuación del Viaje',
  body: ['🚗 Traslado al Aeropuerto Internacional del Kilimanjaro para tu vuelo de regreso, ¡o continúa tu aventura tanzana!'],
}

interface RouteInfoBlockEs {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  pricingTable?: {columns: string[]; rows: {label: string; values: string[]}[]}
}
interface RouteEs {
  slug: string
  name: string
  seoTitle: string
  seoDescription: string
  heroHeading: string
  heroTagline: string
  heroBody: string[]
  heroImage: {src: string; alt: string}
  itineraryHeading: string
  itinerarySubheading: string
  daysLabel: string
  stops: {label: string; meta?: string[]; body: string[]}[]
  infoTabsHeading: string
  tabs: {id: string; label: string; blocks: RouteInfoBlockEs[]}[]
  secondaryHeading: string
  secondaryTagline: string
  faqHeading: string
  faqs: {number: number; question: string; answer: string}[]
}

const machame: RouteEs = {
  slug: 'machame-route',
  name: 'Route Machame',
  seoTitle: 'Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Descubre la Route Machame, la ruta de escalada más popular del Kilimanjaro, conocida como Whiskey Route. Itinerario día por día real, tarifas y consejos de expertos.',
  heroHeading: 'Descubre la Route Machame del Kilimanjaro',
  heroTagline: 'La ruta más popular hacia la cumbre del Kilimanjaro',
  heroBody: [
    'Apodada la Whiskey Route, la Route Machame es la ruta de escalada más popular del Kilimanjaro, elegida por casi la mitad de los excursionistas cada año.',
    'Esta ruta pintoresca aborda el Monte Kilimanjaro desde el sur, ascendiendo las impresionantes laderas meridionales antes de descender por la Route Mweka. A lo largo del camino, los escaladores son recompensados con algunas de las puestas de sol y amaneceres más espectaculares del Kilimanjaro.',
    'Con una extensión de 62 km, la ruta se recorre generalmente en seis días, aunque se recomienda encarecidamente un itinerario de siete días para una mejor aclimatación — aumentando notablemente las tasas de éxito en la cumbre.',
    'Para quienes buscan una aventura inolvidable con un terreno exigente pero gratificante, la Route Machame es una excelente elección.',
  ],
  heroImage: {src: '/images/routes/machame/hero.webp', alt: 'Excursionistas caminando hacia el Monte Kilimanjaro por la Route Machame'},
  itineraryHeading: 'Itinerario de la Route Machame',
  itinerarySubheading: 'Sin el whisky – Un diario de viaje día por día',
  daysLabel: '7 Días',
  stops: [
    arrivalStopEs,
    {
      label: 'Día de Trekking 1 - De Machame Gate a Machame Camp',
      meta: ['📍 Machame Gate (1.800 m/5.900 pies) → Machame Camp (3.000 m/9.800 pies)', '📈 Desnivel positivo: 1.200 m / 3.900 pies', '⏳ Duración: 6-7 horas'],
      body: [
        'Tu viaje comienza con un trayecto de 45 minutos desde Moshi hasta Machame Gate. Después del registro, el trekking comienza por un sendero sinuoso a través de una exuberante selva tropical, la zona más húmeda de la montaña. Espera aguaceros ocasionales por la tarde, que a veces hacen resbaladizo el sendero.',
        'La subida se suaviza progresivamente a medida que te acercas a Machame Camp, situado en la zona de transición entre el bosque y las zonas de brezo gigante.',
      ],
    },
    {
      label: 'Día de Trekking 2 - De Machame Camp a Shira Camp',
      meta: ['📍 Machame Camp (3.000 m/9.800 pies) → Shira Camp (3.840 m/12.600 pies)', '📈 Desnivel positivo: 840 m / 2.800 pies', '⏳ Duración: 5-6 horas'],
      body: [
        'El día comienza con una empinada subida por una cresta, que conduce a Picnic Rock, un fantástico mirador que domina el Kibo y el borde irregular de la meseta de Shira.',
        'El sendero se allana luego al atravesar la meseta de Shira, el tercero de los conos volcánicos del Kilimanjaro, antes de llegar a Shira Camp, donde podrás disfrutar de espléndidas vistas de la montaña.',
      ],
    },
    {
      label: 'Día de Trekking 3 - De Shira Camp a Barranco Camp vía Lava Tower',
      meta: [
        '📍 Shira Camp (3.840 m/12.600 pies) → Lava Tower (4.550 m/14.900 pies) → Barranco Camp (3.850 m/12.650 pies)',
        '📈 Desnivel positivo: 710 m / 2.300 pies',
        '📉 Desnivel negativo: 700 m / 2.250 pies',
        '⏳ Duración: 6-7 horas',
      ],
      body: [
        'Un día de aclimatación exigente pero crucial, atravesarás un terreno desértico de alta montaña hacia la Lava Tower, un pináculo volcánico de 90 metros de altura que ofrece increíbles vistas panorámicas.',
        'Después del almuerzo, desciendes al valle de Barranco, hogar de los únicos senecios gigantes. Este descenso prepara tu cuerpo para la ascensión a la cumbre en altitud que te espera. Barranco Camp se encuentra en un valle pintoresco y resguardado, a los pies de la famosa Barranco Wall.',
      ],
    },
    {
      label: 'Día de Trekking 4 - De Barranco Camp a Karanga Camp vía la Barranco Wall',
      meta: [
        '📍 Barranco Camp (3.850 m/12.600 pies) → Barranco Wall (4.200 m/13.800 pies) → Karanga Camp (3.950 m/13.000 pies)',
        '📈 Desnivel positivo: 350 m / 1.150 pies',
        '📉 Desnivel negativo: 250 m / 820 pies',
        '⏳ Duración: 3-4 horas',
      ],
      body: [
        'Comienza el día enfrentando la imponente Barranco Wall, una escalada emocionante que te recompensa con vistas impresionantes.',
        'Después de alcanzar la cima a 4.200 m, sigue un sendero pintoresco y ondulado alrededor del flanco de la montaña, con el Monte Meru visible a tu derecha y el Kibo alzándose a tu izquierda.',
        'Un descenso al valle de Karanga es seguido por una subida corta pero empinada hasta Karanga Camp, tu parada para pasar la noche.',
      ],
    },
    {
      label: 'Día de Trekking 5 - De Karanga Camp a Barafu Camp',
      meta: ['📍 Karanga Camp (3.950 m/13.000 pies) → Barafu Camp (4.600 m/15.100 pies)', '📈 Desnivel positivo: 650 m / 2.150 pies', '⏳ Duración: 3-4 horas'],
      body: [
        'Una subida constante por la mañana conduce a Barafu Camp, que significa «hielo» en suajili. Este campamento de alta montaña se encuentra en una cresta bajo el cono cumbre y marca la finalización del circuito sur del Kilimanjaro, ofreciendo vistas espectaculares de la cumbre desde varios ángulos.',
        'Llegarás a tiempo para un descanso por la tarde y una cena anticipada para prepararte para la noche de la cumbre.',
      ],
    },
    {
      label: 'Día de Trekking 6 - De Barafu Camp a Uhuru Peak y luego Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.600 m/15.100 pies) → Uhuru Peak (5.895 m/19.300 pies) → Mweka Camp (3.110 m/10.200 pies)',
        '📈 Desnivel positivo: 1.295 m / 4.200 pies',
        '📉 Desnivel negativo: 2.785 m / 9.100 pies',
        '⏳ Ascenso a la cumbre: 6-8 horas',
        '⏳ Descenso: 6 horas',
      ],
      body: [
        'A medianoche comienza tu ascenso final hacia la cumbre. El sendero es empinado y exigente, con temperaturas muy por debajo de cero. Al amanecer, la magnífica salida del sol rojo detrás del pico Mawenzi te mantendrá motivado.',
        'Al llegar a Stella Point (5.750 m), caminarás por el borde del cráter antes de llegar a Uhuru Peak (5.895 m), ¡el punto más alto de África!',
        'Después de celebrar en la cumbre, comienza el largo descenso hacia Mweka Camp, atravesando un terreno variado y haciendo una pausa para almorzar en el camino. Esta noche disfrutarás de tu última cena en la montaña.',
      ],
    },
    {
      label: 'Día de Trekking 7 - De Mweka Camp a Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m/10.200 pies) → Mweka Gate (1.830 m/6.000 pies)', '📉 Desnivel negativo: 1.280 m / 4.220 pies', '⏳ Duración: 2-3 horas'],
      body: [
        'El descenso final te lleva a través de una exuberante selva tropical, con la posibilidad de avistar monos juguetones en el camino.',
        'En Mweka Gate, recibirás tus certificados de cumbre, y desde el pueblo de Mweka serás trasladado a tu hotel en Moshi.',
      ],
    },
    departureStopEs,
  ],
  infoTabsHeading: '¿Por Qué Elegir Machame?',
  tabs: [
    {
      id: 'duration',
      label: 'Duración del Viaje',
      blocks: [
        {
          heading: '¿Cuáles son las Ventajas de Elegir la Route Machame?',
          paragraphs: [
            'La Route Machame del Kilimanjaro destaca por sus paisajes impresionantes y sus altas tasas de éxito. Si buscas un desafío pintoresco y gratificante, esta ruta ofrece:',
            'Nuestros paquetes de escalada al Kilimanjaro para la Route Machame están diseñados para maximizar la aclimatación y la seguridad general.',
          ],
          bullets: [
            'Terrenos variados – De exuberantes selvas tropicales a desiertos alpinos y glaciares.',
            'Puntos de referencia pintorescos – La ruta presenta hitos magníficos como la meseta de Shira y la icónica Barranco Wall.',
            'Excelente aclimatación – La estrategia «subir alto, dormir bajo» minimiza los riesgos de mal de altura.',
            'Alta tasa de éxito en la cumbre – Con un itinerario bien ritmado, los escaladores se adaptan mejor, aumentando sus posibilidades de alcanzar Uhuru Peak.',
          ],
        },
        {
          heading: '¿Cuánto Tiempo se Necesita para Recorrer la Route Machame?',
          paragraphs: [
            'Aunque la distancia de la Route Machame puede recorrerse en 6 días, recomendamos encarecidamente el itinerario de 7 días para una escalada más cómoda y exitosa. 🕒 ¿Por qué elegir 7 días?',
            '📌 Consejo especial: para una guía detallada sobre la duración ideal del itinerario del Kilimanjaro, consulta nuestro artículo de blog en profundidad.',
          ],
          bullets: [
            'Tiempo extra = mejor aclimatación y menor riesgo de mal de altura.',
            'Te permite disfrutar de los paisajes a un ritmo cómodo.',
            'Aumenta tus posibilidades de éxito en la cumbre.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Detalle de las Tarifas',
      blocks: [
        {
          heading: '¿Cuál es el Costo Asociado a la Route Machame?',
          paragraphs: [
            'El precio de la Route Machame de 7 días varía según factores como el tamaño del grupo, el nivel de servicio y las opciones adicionales. Aquí un desglose:',
            '💰 Escalada en grupo: desde 2.285 $ por persona   💰 Escalada privada: desde 2.585 $ por persona',
            '🔍 Factores que influyen en el precio:',
            '📅 Consejo de experto: la época elegida para escalar influye en los costos. Las temporadas altas (julio-sept. y enero-febrero) ofrecen un tiempo excelente pero son más costosas.',
          ],
          bullets: [
            'Duración de tu escalada guiada al Monte Kilimanjaro',
            'Tamaño del grupo – Grupos más numerosos pueden reducir el costo por persona',
            'Servicios clásicos o premium – Más comodidad = costo ligeramente más alto',
            'Inclusiones y exclusiones – Consulta los detalles de nuestro paquete para mayor claridad',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dónde te Alojarás',
      blocks: [
        {
          heading: '¿Cuáles son los Campamentos a lo Largo de la Route Machame?',
          paragraphs: [
            'Tu viaje de escalada al Monte Kilimanjaro incluirá paradas nocturnas en estos campamentos estratégicos:',
            '⛺ Cada campamento ofrece servicios esenciales como alojamiento en tienda, áreas de comedor y servicios sanitarios, garantizando una estancia cómoda.',
          ],
          bullets: ['Machame Camp', 'Shira Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularidad y Afluencia',
      blocks: [
        {
          heading: '¿Está Concurrida la Route Machame?',
          paragraphs: [
            'Al ser una de las rutas más apreciadas del Kilimanjaro, la Route Machame atrae a muchos escaladores cada año. Principales razones de su popularidad:',
            '🌍 Vistas impresionantes – Paisajes espectaculares y ecosistemas variados.   ⏳ Duración más corta – Puede recorrerse en solo 6 días.   📈 Altas tasas de éxito – Excelente perfil de aclimatación.',
            '🤔 ¿Preocupado por la afluencia? Aunque las temporadas altas atraen a más escaladores, elegir los meses de temporada baja (marzo, noviembre) ofrece una experiencia más tranquila.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opiniones de Expertos',
      blocks: [
        {
          heading: '¿Cuáles son Nuestras Impresiones sobre la Route Machame?',
          paragraphs: [
            'En Asili Climbing Kilimanjaro, recomendamos encarecidamente la Route Machame por sus paisajes variados y sus altas tasas de éxito. Sin embargo, si buscas una alternativa menos concurrida, considera la Route Lemosho.',
            '📍 Diferencia clave: Lemosho comienza de forma más tranquila pero se une a Machame en el día 3.',
            '⚠️ ¡Atención!: espera más escaladores en Machame, especialmente en temporada alta.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Machame',
  secondaryTagline: 'Vive el viaje pintoresco hacia la cumbre del Kilimanjaro. Atraviesa Machame y captura la majestuosidad de la cumbre.',
  faqHeading: '10 Preguntas sobre la Route Machame',
  faqs: [
    {number: 1, question: '¿Cuánto tiempo se necesita para recorrer la Route Machame?', answer: 'La Route Machame requiere generalmente de 6 a 7 días. Esta duración permite una aclimatación adecuada, aumentando notablemente las posibilidades de éxito en la cumbre del Kilimanjaro.'},
    {number: 2, question: '¿Cuál es el nivel de dificultad de la Route Machame?', answer: 'La Route Machame se considera moderadamente difícil. Implica subidas empinadas, terreno accidentado y largas jornadas de caminata, lo que requiere tanto resistencia física como resiliencia mental.'},
    {number: 3, question: '¿Cuál es la tasa de éxito para llegar a la cumbre por la Route Machame?', answer: 'En Asili Climbing Kilimanjaro, creemos que una escalada exitosa significa alcanzar la cumbre de forma segura y regresar. En ese sentido, nuestra tasa de éxito es del 100%. En conjunto, la Route Machame muestra una alta tasa de éxito en la cumbre, gracias a su perfil de aclimatación progresivo.'},
    {number: 4, question: '¿Es pintoresca la Route Machame?', answer: '¡Sí! La Route Machame es conocida como la «Whiskey Route» por sus paisajes impresionantes. Los escaladores atraviesan exuberantes selvas tropicales, brezales y desiertos alpinos, con vistas magníficas del Monte Kilimanjaro en cada etapa.'},
    {number: 5, question: '¿Cuál es la distancia media de trekking diaria en la Route Machame?', answer: 'En promedio, los escaladores recorren de 10 a 12 kilómetros al día, es decir, de 6 a 8 horas de caminata según el itinerario y el ritmo.'},
    {number: 6, question: '¿Está la Route Machame concurrida en comparación con otras rutas?', answer: 'La Route Machame es una de las rutas más populares del Kilimanjaro, lo que significa que puede estar concurrida durante las temporadas altas (junio-octubre y diciembre-marzo).'},
    {number: 7, question: '¿Es necesario entrenar para escalar la Route Machame?', answer: 'Aunque no es obligatorio tener experiencia previa de trekking, recomendamos encarecidamente ejercicios cardiovasculares, entrenamiento de resistencia y caminatas en subida para desarrollar tu resistencia de cara a la escalada del Kilimanjaro.'},
    {number: 8, question: '¿Cuál es la mejor época para escalar el Kilimanjaro por la Route Machame?', answer: 'La mejor época para escalar el Kilimanjaro por la Route Machame va de junio a marzo, cuando el clima es estable, con cielos despejados y menor riesgo de precipitaciones — ideal para un trekking seguro y placentero.'},
    {number: 9, question: '¿Cuántos campamentos hay en la Route Machame?', answer: 'La Route Machame cuenta con seis campamentos nocturnos, cada uno de los cuales ofrece un lugar de descanso y aclimatación: Machame Camp, Shira Camp, Barranco Camp, Karanga Camp, Barafu Camp, Mweka Camp.'},
    {number: 10, question: '¿Cuáles son las principales atracciones de la Route Machame?', answer: 'Entre los puntos destacados de la Route Machame: el cruce de la exuberante selva tropical al pie del Kilimanjaro, la escalada de la icónica Barranco Wall — un ascenso emocionante con vistas magníficas — y la llegada a Uhuru Peak, el punto más alto de África a 5.895 m (19.341 pies).'},
  ],
}

const marangu: RouteEs = {
  slug: 'marangu-route',
  name: 'Route Marangu',
  seoTitle: 'Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Escala el Kilimanjaro por la Route Marangu, la única ruta con alojamiento en refugios. Itinerario día por día real, tarifas y consejos de expertos.',
  heroHeading: 'Escala el Kilimanjaro por la Route Marangu',
  heroTagline: 'El trekking clásico del Kilimanjaro',
  heroBody: [
    'Conocida como la «Coca-Cola Route», la Route Marangu es la ruta más consolidada y cómoda hacia la cumbre del Monte Kilimanjaro. Es la única ruta con alojamiento en refugios, lo que la convierte en una opción popular para quienes buscan una experiencia de trekking menos dura.',
    'El sendero ofrece pendientes suaves a través de una exuberante selva tropical, un brezal y un desierto alpino antes de llegar a la cumbre helada de Uhuru Peak. Es ideal para excursionistas primerizos o para quienes buscan una escalada más directa.',
  ],
  heroImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Refugio de montaña en forma de A en la Route Marangu con el bosque de fondo'},
  itineraryHeading: 'Itinerario de la Route Marangu',
  itinerarySubheading: 'El camino cómodo hacia el Techo de África',
  daysLabel: '5 Días',
  stops: [
    arrivalStopEs,
    {
      label: 'Día de Trekking 1: Marangu Gate → Mandara Hut',
      meta: ['📍 Marangu Gate (1.870 m/6.135 pies) → Mandara Hut (2.700 m/8.858 pies)', '📈 Desnivel positivo: 830 m / 2.723 pies', '⏳ Duración: 4-5 horas'],
      body: [
        'Tu trekking comienza con un trayecto desde Moshi hasta Marangu Gate. Después del registro, entrarás en la exuberante selva tropical e iniciarás tu camino por un sendero bien mantenido. El recorrido suele ser húmedo y sombreado, con árboles cubiertos de musgo, cantos de aves y monos juguetones en el camino.',
        'Llegarás a Mandara Hut a última hora de la tarde. Si el tiempo y la energía lo permiten, haz una breve caminata hasta el cráter de Maundi para disfrutar de espléndidas vistas de Kenia y el norte de Tanzania.',
      ],
    },
    {
      label: 'Día de Trekking 2: Mandara Hut → Horombo Hut',
      meta: ['📍 Mandara Hut (2.700 m/8.858 pies) → Horombo Hut (3.720 m/12.204 pies)', '📈 Desnivel positivo: 1.020 m / 3.346 pies', '⏳ Duración: 6-7 horas'],
      body: [
        'Dejando atrás la selva tropical, entrarás en la zona de brezal, donde el paisaje cambia radicalmente. El sendero asciende constantemente por un terreno abierto lleno de senecios gigantes y lobelias.',
        'En el camino, tendrás tu primera vista completa de los picos Kibo y Mawenzi. Horombo Hut te espera con panoramas impresionantes y la oportunidad de conocer a otros excursionistas.',
      ],
    },
    {
      label: 'Día de Trekking 3: Horombo Hut → Kibo Hut',
      meta: ['📍 Horombo Hut (3.720 m/12.204 pies) → Kibo Hut (4.703 m/15.430 pies)', '📈 Desnivel positivo: 983 m / 3.226 pies', '⏳ Duración: 6-7 horas'],
      body: [
        'El itinerario de hoy es largo y seco, atravesando el desierto alpino. Caminarás por la silla entre los picos Mawenzi y Kibo, un paisaje vasto y árido con vistas espectaculares. El aire es más enrarecido, así que camina despacio y mantente hidratado.',
        'Llegarás a Kibo Hut a primera hora de la tarde — descansa temprano y prepárate para el intento de cumbre que comienza a medianoche.',
      ],
    },
    {
      label: 'Día de Trekking 4: Kibo Hut → Uhuru Peak → Horombo Hut',
      meta: [
        '📍 Kibo Hut (4.703 m/15.430 pies) → Uhuru Peak (5.895 m/19.341 pies) → Horombo Hut (3.720 m/12.204 pies)',
        '📈 Desnivel positivo: 1.192 m / 3.911 pies (subida), luego descenso',
        '⏳ Duración: 11-14 horas',
      ],
      body: [
        'Tu viaje hacia la cumbre comienza temprano por la mañana, caminando en la oscuridad por zigzags y pedregal hasta Gilman\'s Point (5.685 m), luego por el borde del cráter hasta Uhuru Peak — el techo de África.',
        'Después de inmortalizar tu momento en la cumbre, desciende a Kibo Hut para un breve descanso, luego continúa hacia Horombo Hut para una noche de sueño bien merecida.',
      ],
    },
    {
      label: 'Día de Trekking 5: Horombo Hut → Marangu Gate',
      meta: ['📍 Horombo Hut (3.720 m/12.204 pies) → Marangu Gate (1.870 m/6.135 pies)', '📉 Desnivel negativo: 1.850 m / 6.070 pies', '⏳ Duración: 6-7 horas'],
      body: [
        'En tu último día, desciende por el brezal y la exuberante selva tropical para regresar al punto de partida. El sendero es más fácil en descenso, pero ten cuidado con tus pasos en las secciones húmedas.',
        'En la entrada, recibirás tu certificado de cumbre antes de regresar a Moshi — cansado pero orgulloso.',
      ],
    },
    departureStopEs,
  ],
  infoTabsHeading: '¿Por Qué Elegir Marangu?',
  tabs: [
    {
      id: 'duration',
      label: 'Duración del Viaje',
      blocks: [
        {
          heading: '¿Cuáles son las Ventajas de Elegir la Route Marangu?',
          bullets: [
            'Única ruta con alojamiento en refugios – A diferencia de las demás rutas que requieren acampar, la Route Marangu ofrece alojamiento compartido en refugios con literas estilo dormitorio. Esto es una gran ventaja para los escaladores que prefieren dormir bajo techo en lugar de en tienda — especialmente durante la temporada de lluvias.',
            'Opción más económica – Como utiliza el mismo sendero tanto para la subida como para la bajada, la logística es más sencilla, lo que hace de Marangu una de las rutas más económicas del Kilimanjaro.',
            'Sendero suave y progresivo – El sendero está bien mantenido, con una pendiente regular y moderada, lo que la hace ideal para excursionistas primerizos o para quienes buscan una escalada menos exigente físicamente que rutas más empinadas como Umbwe o Machame.',
            'Opciones de duración más cortas (5 o 6 días) – Puedes elegir entre un itinerario de 5 o 6 días. La versión de 6 días incluye un día de aclimatación, que mejora tus posibilidades de llegar a la cumbre.',
            'Ideal para escaladas en temporada de lluvias – Como ofrece refugios y atraviesa un terreno menos fangoso que otras rutas, Marangu es una mejor opción durante las temporadas de lluvias en Tanzania (marzo-mayo y noviembre).',
            'Ruta de regreso directa – Se utiliza el mismo sendero para el descenso, lo que puede ser más fácil de gestionar logísticamente, especialmente si dispones de poco tiempo o prefieres un itinerario sencillo.',
            'Diversidad pintoresca en poco tiempo – Aunque es una de las rutas más cortas, seguirás descubriendo varias zonas de vegetación — comenzando por la exuberante selva tropical, pasando por el brezal, hasta el desierto alpino antes de llegar a la cumbre helada.',
            'Acceso al cráter de Maundi – El primer día, una breve caminata opcional conduce al cráter de Maundi — un mirador tranquilo con hermosas vistas del norte de Tanzania y Kenia.',
          ],
        },
        {
          heading: 'Ejemplo de Tarifas (por persona en USD)',
          paragraphs: [
            'La escalada del Kilimanjaro por la Route Marangu requiere generalmente 5 o 6 días, según el itinerario elegido. Cada día implica de 4 a 7 horas de trekking, excepto la noche de la cumbre, la más exigente — que dura hasta 12-14 horas, incluido el descenso. Los precios varían ligeramente según la temporada y el tamaño del grupo.',
          ],
          bullets: [
            'Opción de 5 días: una escalada más rápida con aclimatación limitada, ideal para excursionistas experimentados pero con una tasa de éxito en la cumbre más baja.',
            'Opción de 6 días: incluye un día adicional en Horombo Hut para la aclimatación. Esto mejora la adaptación de tu cuerpo a la altitud y aumenta notablemente las posibilidades de éxito en la cumbre.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Detalle de las Tarifas',
      blocks: [
        {
          heading: '¿Cuál es el Costo Asociado a la Route Marangu?',
          pricingTable: {
            columns: ['Duración', '1 persona', '2-3 personas', '4-6 personas', '7+ personas'],
            rows: [
              {label: '5 días', values: ['1.850 $', '1.750 $', '1.600 $', '1.450 $']},
              {label: '6 días', values: ['2.050 $', '1.950 $', '1.750 $', '1.600 $']},
            ],
          },
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dónde te Alojarás',
      blocks: [
        {
          heading: 'Cómodos refugios de montaña en el camino — ¡no necesitas acampar!',
          paragraphs: [
            'A diferencia de las demás rutas del Kilimanjaro que requieren tiendas, la Route Marangu es la única ruta con refugios de montaña permanentes, ofreciendo una experiencia más cómoda y protegida de la intemperie. Es una excelente opción si prefieres una cama de verdad, un techo sobre tu cabeza y un refugio compartido pero sólido.',
            '🛏️ Panorama del alojamiento:',
          ],
          bullets: [
            'Mandara Hut (2.700 m / 8.858 pies): situado en la zona de selva tropical, Mandara ofrece acogedores refugios en forma de A rodeados de vegetación exuberante. Cada refugio aloja de 4 a 8 escaladores y cuenta con servicios sanitarios compartidos cerca.',
            'Horombo Hut (3.720 m / 12.205 pies): situado en la zona de brezal, Horombo es más grande y aloja a excursionistas tanto en subida como en bajada. Ofrece espléndidas vistas del pico Mawenzi y las llanuras de abajo.',
            'Kibo Hut (4.703 m / 15.430 pies): una simple estructura de piedra en la zona de desierto alpino, Kibo es la última base antes de la cumbre. Espera habitaciones estilo dormitorio con literas y un ambiente austero de alta montaña.',
            '🚿 Los servicios incluyen: colchonetas y almohadas, comedores para comidas calientes, iluminación solar en algunos refugios, servicios sanitarios compartidos limpios pero esenciales, sin duchas (lleva toallitas húmedas o agua para un aseo rápido).',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularidad y Afluencia',
      blocks: [
        {
          heading: 'Muy apreciada, muy frecuentada, y a menudo la primera opción de los escaladores primerizos.',
          paragraphs: [
            'La Route Marangu es una de las rutas más populares del Monte Kilimanjaro — a menudo llamada la «Coca-Cola Route» por su acceso más fácil y sus alojamientos en refugios. Atrae a un gran número de escaladores, en particular durante las temporadas altas de trekking (enero-marzo y junio-octubre).',
            '📌 ¿Por qué es popular? Es la única ruta con refugios de montaña, lo que la hace atractiva para quienes prefieren no acampar. Su duración más corta (5-6 días) atrae a quienes tienen un itinerario de viaje ajustado. Se considera menos exigente físicamente (aunque la altitud sigue siendo un desafío serio).',
            '🙋‍♂️ Qué esperar en cuanto a afluencia: espera más excursionistas en esta ruta que en otras como Lemosho o Rongai. Los refugios pueden estar concurridos, en particular en Horombo y Kibo, que alojan a excursionistas tanto en subida como en bajada.',
            '⚠️ Consejo: si buscas soledad y menos afluencia, considera escalar durante las temporadas intermedias (finales de marzo o principios de noviembre) o elegir una ruta más larga y menos frecuentada.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opiniones de Expertos',
      blocks: [
        {
          heading: 'Reflexiones de guías experimentados y especialistas del Kilimanjaro.',
          paragraphs: [
            'La Route Marangu suele considerarse la forma «más fácil» de escalar el Kilimanjaro, pero los expertos coinciden en que no debe subestimarse.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Marangu',
  secondaryTagline: 'El Kilimanjaro con toda sencillez – Duerme en refugios, no en tienda.',
  faqHeading: '10 Preguntas sobre la Route Marangu',
  faqs: [
    {number: 1, question: '¿Cuánto tiempo se necesita para recorrer la Route Marangu?', answer: 'La Route Marangu requiere generalmente 5 o 6 días. El itinerario de 6 días incluye un día adicional de aclimatación en Horombo Hut, lo que aumenta tus posibilidades de llegar a la cumbre con éxito.'},
    {number: 2, question: '¿Cuál es el nivel de dificultad de la Route Marangu?', answer: 'Se considera moderadamente difícil. El sendero es progresivo y está bien trazado, lo que la convierte en una buena opción para escaladores primerizos — pero la altitud puede seguir siendo un desafío.'},
    {number: 3, question: '¿Cuál es la tasa de éxito para llegar a la cumbre por la Route Marangu?', answer: 'Las tasas de éxito varían según el número de días. La opción de 5 días tiene una tasa de éxito más baja debido al menor tiempo de aclimatación, mientras que la versión de 6 días ofrece mejores posibilidades, con una tasa de éxito de alrededor del 80% si se realiza correctamente.'},
    {number: 4, question: '¿Es pintoresca la Route Marangu?', answer: 'Sí, la Route Marangu ofrece bellos paisajes. Atravesarás zonas de selva tropical, brezal y desierto alpino, con vistas magníficas cerca de la cumbre — aunque menos variadas que rutas como Lemosho o Machame.'},
    {number: 5, question: '¿Cuál es la distancia media de trekking diaria en la Route Marangu?', answer: 'Los excursionistas recorren en promedio de 8 a 12 km al día, según el tramo. El día de la cumbre es el más largo, con más de 18 km de caminata.'},
    {number: 6, question: '¿Está la Route Marangu concurrida en comparación con otras rutas?', answer: 'La Route Marangu es una de las rutas más populares y frecuentadas, en particular durante las temporadas secas. Atrae a los escaladores que prefieren el alojamiento en refugios y un itinerario más corto.'},
    {number: 7, question: '¿Es necesario entrenar para escalar la Route Marangu?', answer: 'Sí, se recomienda encarecidamente un entrenamiento básico y una preparación física. Concéntrate en el cardio, la práctica del trekking y ejercicios de resistencia varias semanas antes de tu viaje.'},
    {number: 8, question: '¿Cuál es la mejor época para escalar el Kilimanjaro por la Route Marangu?', answer: 'Los mejores meses son durante las temporadas secas: de enero a mediados de marzo y de junio a octubre, cuando los senderos están más secos y las vistas son más nítidas.'},
    {number: 9, question: '¿Cuántos refugios hay en la Route Marangu?', answer: 'Hay tres estaciones principales de refugio: Mandara Hut, Horombo Hut y Kibo Hut, todas equipadas con literas, comedores esenciales y servicios sanitarios.'},
    {number: 10, question: '¿Cuáles son las principales atracciones de la Route Marangu?', answer: 'La ruta es conocida por sus cómodos refugios, su importancia histórica y su diversidad pintoresca. También ofrece acceso al cráter de Maundi y vistas del pico Mawenzi — lo que la convierte en una escalada clásica con un toque de comodidad.'},
  ],
}

const lemosho: RouteEs = {
  slug: 'lemosho-route',
  name: 'Route Lemosho',
  seoTitle: 'Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Escala el Kilimanjaro por la Route Lemosho, una de las rutas más pintorescas y equilibradas de la montaña. Itinerario día por día real, tarifas y consejos de expertos.',
  heroHeading: 'Escala el Kilimanjaro por la Route Lemosho',
  heroTagline: 'Una escalada pintoresca y progresiva hacia la cumbre del Kilimanjaro',
  heroBody: [
    'La Route Lemosho es una de las formas más bellas y equilibradas de escalar el Monte Kilimanjaro. Comenzando en el remoto lado oeste de la montaña, ofrece un inicio tranquilo con menos afluencia, vistas magníficas y un ritmo regular que ayuda a tu cuerpo a adaptarse a la altitud.',
    'Esta ruta es apreciada tanto por excursionistas experimentados como por principiantes por su alta tasa de éxito, sus paisajes variados y su excelente perfil de aclimatación. Ya elijas la versión de 7 u 8 días, disfrutarás de un viaje gratificante a través de la selva tropical, el brezal, el desierto alpino y finalmente los glaciares en Uhuru Peak.',
  ],
  heroImage: {src: '/images/routes/lemosho/hero.webp', alt: 'Tiendas en Barafu Camp con la cumbre nevada del Kibo sobre las nubes'},
  itineraryHeading: 'Itinerario de la Route Lemosho',
  itinerarySubheading: 'Un inicio tranquilo hacia el Techo de África',
  daysLabel: '7 Días',
  stops: [
    arrivalStopEs,
    {
      label: 'Día de Trekking 1: Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2.100 m/6.890 pies) → Mti Mkubwa (2.650 m/8.690 pies)', '📈 Desnivel positivo: 550 m / 1.800 pies', '⏳ Duración: 3-4 horas'],
      body: ['Después del registro, comienza tu trekking a través de la exuberante selva tropical, con buenas probabilidades de avistar monos y aves de colores. Llegarás a Mti Mkubwa, o «Big Tree Camp», a última hora de la tarde.'],
    },
    {
      label: 'Día de Trekking 2: Mti Mkubwa – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m/11.843 pies)', '📈 Desnivel positivo: 960 m / 3.150 pies', '⏳ Duración: 5-6 horas'],
      body: ['Hoy el sendero sale del bosque para entrar en la zona de brezal. Las vistas se abren de forma espectacular al atravesar la meseta de Shira — una antigua colada de lava.'],
    },
    {
      label: 'Día de Trekking 3: Shira 1 – Shira 2 Camp',
      meta: ['📍 Shira 1 (3.610 m) → Shira 2 Camp (3.850 m/12.630 pies)', '📈 Desnivel positivo: 240 m / 787 pies', '⏳ Duración: 3-4 horas'],
      body: ['Un día relajante con ligeras subidas y bajadas a través de la meseta. Vislumbrarás por primera vez el pico Kibo y te aclimatarás lentamente instalándote en el campamento.'],
    },
    {
      label: 'Día de Trekking 4: Shira 2 – Lava Tower – Barranco Camp',
      meta: ['📍 Shira 2 (3.850 m) → Lava Tower (4.600 m) → Barranco Camp (3.976 m)', '📈 Desnivel: 750 m en subida / 624 m en bajada', '⏳ Duración: 6-7 horas'],
      body: ['Se trata de un día de aclimatación. Sube alto hasta Lava Tower, luego desciende para dormir en Barranco — este enfoque «subir alto, dormir bajo» ayuda a tu cuerpo a adaptarse a la altitud.'],
    },
    {
      label: 'Día de Trekking 5: Barranco – Karanga Camp – Barafu Camp',
      meta: ['📍 Barranco Camp (3.976 m) → Karanga Camp (4.035 m) → Barafu Camp (4.673 m)', '📈 Desnivel positivo: 697 m / 2.286 pies', '⏳ Duración: 8-9 horas'],
      body: [
        'Tu día comienza con una subida por la icónica Barranco Wall — una escalada empinada pero gratificante con vistas épicas. Después de una breve parada en Karanga Camp, continuarás con un trekking constante en subida a través del desierto alpino hasta Barafu Camp.',
        'Esta es tu base para el intento de cumbre. Cena temprano y descansa antes del esfuerzo de medianoche hacia Uhuru Peak.',
      ],
    },
    {
      label: 'Día de Trekking 6: Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.673 m/15.330 pies) → Uhuru Peak (5.895 m/19.341 pies) → Mweka Camp (3.110 m/10.204 pies)',
        '📈 Desnivel: 1.222 m / 4.011 pies en subida, 2.785 m / 9.137 pies en bajada',
        '⏳ Duración: 12-14 horas',
      ],
      body: [
        'El día de la cumbre comienza alrededor de la medianoche bajo un cielo estrellado. El sendero es largo y empinado, pero la lentitud y la constancia ganan la carrera. Después de alcanzar Stella Point (5.739 m), continúa por el borde del cráter hasta Uhuru Peak, el punto más alto de África.',
        'Celebra tu logro, toma fotos, y comienza el descenso hacia Mweka Camp. Espera piernas doloridas y un sueño profundo y reparador.',
      ],
    },
    {
      label: 'Día de Trekking 7: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m/10.204 pies) → Mweka Gate (1.640 m/5.380 pies)', '📉 Desnivel negativo: 1.470 m / 4.823 pies', '⏳ Duración: 3-4 horas'],
      body: ['Tu último día es un agradable descenso a través de la exuberante selva tropical, llena de cantos de aves y quizás también monos. En Mweka Gate, firmarás tu salida, recibirás tus certificados de cumbre, y te reencontrarás con tu conductor para el regreso a Moshi.'],
    },
    departureStopEs,
  ],
  infoTabsHeading: '¿Por Qué Elegir Lemosho?',
  tabs: [
    {
      id: 'duration',
      label: 'Duración del Viaje',
      blocks: [
        {
          heading: '¿Cuáles son las Ventajas de Elegir la Route Lemosho?',
          paragraphs: [
            'La Route Lemosho se considera ampliamente la ruta más pintoresca y equilibrada del Monte Kilimanjaro — y con razón. Ofrece una mezcla perfecta de belleza, desafío y aclimatación, lo que la convierte en una de las mejores opciones tanto para principiantes como para excursionistas experimentados.',
            'A diferencia de otras rutas, Lemosho comienza en el remoto lado oeste de la montaña, ofreciendo un inicio tranquilo a través de una selva tropical prístina antes de unirse a la más concurrida Route Machame más adelante. Esto significa menos afluencia al principio, más avistamientos de fauna, y vistas panorámicas impresionantes de principio a fin.',
            '¿Otra razón para elegir Lemosho? La tasa de éxito. Gracias a su itinerario más largo (7 u 8 días), ganas altitud de forma más progresiva — dando a tu cuerpo tiempo para adaptarse. Esto mejora notablemente tus posibilidades de llegar a la cumbre de forma segura y sentirte fuerte en la noche de la cumbre.',
            'Si buscas una ruta que ofrezca paisajes increíbles, un sólido tiempo de aclimatación y una aventura gratificante sin la afluencia inicial, Lemosho es difícil de superar.',
          ],
        },
        {
          heading: '¿Cuánto Tiempo se Necesita para Recorrer la Route Lemosho?',
          paragraphs: [
            'La Route Lemosho se recorre generalmente en 7 u 8 días, según el itinerario elegido. La opción de 8 días incluye un día adicional de aclimatación en Karanga Camp, aumentando tus posibilidades de llegar a la cumbre cómodamente. Esta duración prolongada la convierte en una de las mejores rutas para la adaptación a la altitud y un ritmo de trekking más relajado.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Detalle de las Tarifas',
      blocks: [
        {
          heading: '¿Cuál es el Costo Asociado a la Route Lemosho?',
          paragraphs: [
            'Los precios de la Route Lemosho varían según el tamaño del grupo y el nivel de servicio, pero aquí un panorama general. Estos costos suelen incluir las tasas de parque, el apoyo de guías y porteadores, las comidas, las tiendas y el transporte. Escaladas privadas y paquetes de lujo también están disponibles a tarifas más elevadas.',
          ],
          bullets: ['Trekking de 7 días: desde 2.200 $ hasta 2.700 $ por persona', 'Trekking de 8 días: desde 2.400 $ hasta 2.900 $ por persona'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dónde te Alojarás',
      blocks: [
        {
          heading: '¿Cuáles son los Campamentos a lo Largo de la Route Lemosho?',
          paragraphs: [
            'A diferencia de la Route Marangu, Lemosho es un trekking exclusivamente en campamento. Dormirás en tiendas de montaña de alta calidad proporcionadas por tu operador. Campamentos como Shira, Barranco y Barafu ofrecen vistas increíbles — piensa en amaneceres sobre las nubes y noches estrelladas. Todas las comidas son preparadas frescas por tu cocinero de montaña, y dispondrás de una tienda comedor para tu comodidad.',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularidad y Afluencia',
      blocks: [
        {
          heading: '¿Está Concurrida la Route Lemosho?',
          paragraphs: [
            'La Route Lemosho comienza en el remoto lado oeste del Kilimanjaro, lo que significa menos excursionistas en los primeros días. Se une a la Route Machame en el día 4, volviéndose por lo tanto más concurrida cerca de la cumbre. Sin embargo, Lemosho es menos concurrida que Marangu o Machame en sus primeras etapas, ofreciendo un inicio más tranquilo y pintoresco.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opiniones de Expertos',
      blocks: [
        {
          heading: '¿Cuáles son Nuestras Impresiones sobre la Route Lemosho?',
          paragraphs: [
            'Lemosho suele considerarse la ruta más bella y equilibrada del Kilimanjaro. Combina excelentes paisajes, una excelente aclimatación y una alta tasa de éxito en la cumbre. La mayoría de los guías experimentados la recomiendan a los escaladores primerizos que buscan las mejores posibilidades de éxito sin precipitarse. El enfoque desde el oeste también ofrece una experiencia de naturaleza salvaje más remota al inicio del trekking.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Lemosho',
  secondaryTagline: 'Lemosho comienza donde otras no lo hacen — y eso lo cambia todo.',
  faqHeading: '10 Preguntas sobre la Route Lemosho',
  faqs: [
    {number: 1, question: '¿Cuánto tiempo se necesita para escalar el Kilimanjaro por la Route Lemosho?', answer: 'La mayoría de los escaladores recorren la Route Lemosho en 7 u 8 días. La opción de 8 días incluye un día adicional de aclimatación, mejorando tus posibilidades de llegar a la cumbre.'},
    {number: 2, question: '¿Es difícil la Route Lemosho?', answer: 'Lemosho se considera de moderada a difícil. No es técnica, pero el día de la cumbre es largo y agotador. La duración más larga ayuda a la aclimatación, haciéndola manejable para la mayoría de los excursionistas en buena forma física.'},
    {number: 3, question: '¿Cuál es la tasa de éxito en la cumbre en la Route Lemosho?', answer: 'Lemosho muestra una de las tasas de éxito más altas entre todas las rutas del Kilimanjaro — hasta un 90% para el itinerario de 8 días, gracias a su ganancia de altitud progresiva y su excelente perfil de aclimatación.'},
    {number: 4, question: '¿Es pintoresca la Route Lemosho?', answer: 'Sí — Lemosho suele describirse como la ruta más bella del Kilimanjaro. Ofrece paisajes variados, desde la selva tropical y el brezal hasta el desierto alpino y vistas de los glaciares.'},
    {number: 5, question: '¿Está concurrida la Route Lemosho?', answer: 'Lemosho comienza en el lado oeste tranquilo de la montaña, por lo que los primeros días son tranquilos y poco concurridos. Se une a la más frecuentada Route Machame cerca de Lava Tower, pero en conjunto es menos concurrida que rutas como Marangu.'},
    {number: 6, question: '¿Qué tipo de alojamiento está disponible en la Route Lemosho?', answer: 'Lemosho es una ruta exclusivamente en campamento. Dormirás en tiendas de alta calidad en campamentos designados. Los porteadores transportan y montan todo el equipo de campamento por ti.'},
    {number: 7, question: '¿Es adecuada la Route Lemosho para principiantes?', answer: 'Sí, especialmente si eliges la versión de 8 días. El itinerario más largo da a los principiantes más tiempo para aclimatarse y descansar, aumentando su éxito en la cumbre y su comodidad.'},
    {number: 8, question: '¿Cuál es la mejor época para escalar la Route Lemosho?', answer: 'Los mejores meses son enero-marzo y junio-octubre, cuando el clima es más seco y la visibilidad mejor. Estos períodos ofrecen un trekking más seguro y vistas más nítidas en la cumbre.'},
    {number: 9, question: '¿Debo entrenar para la Route Lemosho?', answer: 'Se recomienda encarecidamente el entrenamiento. Apunta a ejercicios de cardio, fuerza y resistencia. Las largas caminatas con mochila son la mejor manera de prepararte para la altitud y las horas de trekking diarias.'},
    {number: 10, question: '¿Por qué elegir la Route Lemosho en lugar de otras rutas?', answer: 'Lemosho ofrece el mejor equilibrio entre paisajes, tasa de éxito y gestión de la afluencia. Es ideal para los excursionistas que desean una experiencia más remota con mejores posibilidades de llegar a la cumbre.'},
  ],
}

const rongai: RouteEs = {
  slug: 'rongai-route',
  name: 'Route Rongai',
  seoTitle: 'Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Escala el Kilimanjaro por la Route Rongai, la única ruta que aborda la montaña desde el norte. Itinerario día por día real, tarifas y consejos de expertos.',
  heroHeading: 'Route Rongai, la remota ruta septentrional del Kilimanjaro',
  heroTagline: 'El suave sendero septentrional hacia el Kilimanjaro.',
  heroBody: [
    'La Route Rongai es la única ruta que aborda el Kilimanjaro desde el lado norte, cerca de la frontera con Kenia, ofreciendo una experiencia más tranquila y remota con paisajes que cambian progresivamente y menos afluencia. Es perfecta para quienes desean una escalada pacífica, aprecian los avistamientos de fauna y prefieren una ruta más seca — especialmente durante la temporada de lluvias.',
    'Aunque ligeramente menos pintoresca al principio que rutas como Lemosho, la Route Rongai compensa con su soledad, sus tasas de éxito y un enfoque final espectacular hacia la cumbre por el borde del cráter de Kibo. El descenso se realiza por la Route Marangu, dándote la oportunidad de ver ambos lados de la montaña.',
  ],
  heroImage: {src: '/images/routes/rongai/hero.webp', alt: 'Un escalador posando frente al cartel de la cumbre Uhuru Peak en el Kilimanjaro'},
  itineraryHeading: 'Itinerario de la Route Rongai',
  itinerarySubheading: 'El sendero tranquilo que llega desde el norte',
  daysLabel: '7 Días',
  stops: [
    arrivalStopEs,
    {
      label: 'Día de Trekking 1: Nalemoru Gate – Simba Camp',
      meta: ['📍 Nalemoru Gate (1.950 m / 6.398 pies) → Simba Camp (2.600 m / 8.530 pies)', '📈 Desnivel positivo: 650 m / 2.132 pies', '⏳ Duración: 3-4 horas'],
      body: ['Salida desde el lado noreste del Kilimanjaro cerca de la frontera con Kenia. El sendero atraviesa bosques exuberantes y tierras de cultivo abiertas antes de llegar a Simba Camp, situado en la zona de brezo.'],
    },
    {
      label: 'Día de Trekking 2: Simba Camp – Second Cave Camp',
      meta: ['📍 Simba Camp (2.600 m / 8.530 pies) → Second Cave Camp (3.450 m / 11.318 pies)', '📈 Desnivel positivo: 850 m / 2.788 pies', '⏳ Duración: 5-6 horas'],
      body: ['El sendero asciende progresivamente por un brezal abierto con vistas panorámicas de las llanuras de abajo y el pico irregular de Mawenzi frente a ti.'],
    },
    {
      label: 'Día de Trekking 3: Second Cave Camp – Kikelewa Camp',
      meta: ['📍 Second Cave Camp (3.450 m / 11.318 pies) → Kikelewa Camp (3.600 m / 11.811 pies)', '📈 Desnivel positivo: 150 m / 492 pies', '⏳ Duración: 3-4 horas'],
      body: ['Un trekking más corto hoy con un desnivel ligero, dando tiempo para aclimatarse. La vegetación se vuelve más escasa a medida que avanzas hacia la zona alpina.'],
    },
    {
      label: 'Día de Trekking 4: Kikelewa Camp – Mawenzi Tarn',
      meta: ['📍 Kikelewa Camp (3.600 m / 11.811 pies) → Mawenzi Tarn (4.330 m / 14.206 pies)', '📈 Desnivel positivo: 730 m / 2.395 pies', '⏳ Duración: 4-5 horas'],
      body: ['El sendero se vuelve más empinado, conduciendo a una magnífica laguna glaciar situada bajo las espectaculares agujas de Mawenzi. Es uno de los campamentos más pintorescos del Kilimanjaro.'],
    },
    {
      label: 'Día de Trekking 5: Mawenzi Tarn – Kibo Hut',
      meta: ['📍 Mawenzi Tarn (4.330 m / 14.206 pies) → Kibo Hut (4.700 m / 15.420 pies)', '📈 Desnivel positivo: 370 m / 1.214 pies', '⏳ Duración: 5-6 horas'],
      body: ['Atraviesa la vasta silla desértica alpina entre Mawenzi y Kibo. El paisaje es austero y silencioso, preparándote mentalmente para el desafío de la cumbre que te espera.'],
    },
    {
      label: 'Día de Trekking 6: Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        '📍 Kibo Hut (4.700 m / 15.420 pies) → Uhuru Peak (5.895 m / 19.341 pies) → Horombo Hut (3.720 m / 12.205 pies)',
        '📈 Desnivel positivo: 1.195 m / 3.921 pies',
        '📉 Desnivel negativo: 2.175 m / 7.136 pies',
        '⏳ Duración: 12-14 horas',
      ],
      body: ['El día de la cumbre comienza poco después de medianoche. Después de llegar a Uhuru Peak para un amanecer inolvidable, desciende hasta Horombo Hut para un merecido descanso.'],
    },
    {
      label: 'Día de Trekking 7: Horombo Hut – Marangu Gate',
      meta: ['📍 Horombo Hut (3.720 m / 12.205 pies) → Marangu Gate (1.860 m / 6.102 pies)', '📉 Desnivel negativo: 1.860 m / 6.102 pies', '⏳ Duración: 5-6 horas'],
      body: ['Desciende por la exuberante selva tropical, donde podrías avistar monos azules y aves exóticas. En Marangu Gate, recibirás tu certificado de cumbre y te despedirás de la montaña.'],
    },
    departureStopEs,
  ],
  infoTabsHeading: '¿Por Qué Elegir Rongai?',
  tabs: [
    {
      id: 'duration',
      label: 'Duración del Viaje',
      blocks: [
        {
          heading: '¿Cuáles son las Ventajas de Elegir la Route Rongai?',
          paragraphs: [
            'La Route Rongai es la única ruta del Kilimanjaro que aborda la cumbre desde el norte, cerca de la frontera con Kenia. Es conocida por ser menos concurrida, más seca y más remota, ofreciendo una experiencia única con excelentes vistas de las llanuras de Amboseli en Kenia. Con pendientes suaves, es ideal para escaladores que buscan una escalada más progresiva y una experiencia de trekking más tranquila. La diversidad pintoresca — que va de la selva tropical y el brezal al desierto alpino — la convierte en una opción destacada para los amantes de la naturaleza y los fotógrafos.',
          ],
        },
        {
          heading: '¿Cuánto Tiempo se Necesita para Recorrer la Route Rongai?',
          paragraphs: [
            '7 días / 6 noches en la montaña.',
            'Se puede añadir un día opcional de aclimatación para un ritmo más relajado y una mejor tasa de éxito en la cumbre.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Detalle de las Tarifas',
      blocks: [
        {
          heading: '¿Cuál es el Costo Asociado a la Route Rongai?',
          paragraphs: ['Los precios pueden variar según el tamaño del grupo, las prestaciones incluidas y la calidad del operador. En promedio:'],
          bullets: ['Trekking privado: desde 2.200 $ hasta 2.800 $ por persona', 'Trekking en grupo: desde 1.900 $ hasta 2.300 $ por persona'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dónde te Alojarás',
      blocks: [
        {
          heading: '¿Cuáles son los Campamentos a lo Largo de la Route Rongai?',
          paragraphs: [
            'A diferencia de la Route Marangu que utiliza refugios, Rongai es una ruta enteramente en campamento. Dormirás en tiendas de montaña de 4 estaciones con esterillas de espuma, y las comidas se sirven en una tienda comedor común. Los campamentos incluyen:',
            'Estos campamentos son tranquilos y poco frecuentados, ofreciendo magníficos cielos estrellados y vistas de la montaña.',
          ],
          bullets: ['Simba Camp', 'Second Cave Camp', 'Kikelewa Camp', 'Mawenzi Tarn', 'Kibo Hut (campamento base)', 'Horombo Hut (descenso por la Route Marangu)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularidad y Afluencia',
      blocks: [
        {
          heading: '¿Está Concurrida la Route Rongai?',
          paragraphs: [
            'La Route Rongai es una de las rutas menos concurridas, lo que la convierte en una opción perfecta para los excursionistas que buscan soledad. Mientras que rutas como Machame y Marangu experimentan una mayor afluencia, Rongai ofrece una experiencia tranquila, en particular durante los primeros días del trekking. Incluso en temporada alta, mantiene un ambiente más calmado.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opiniones de Expertos',
      blocks: [
        {
          heading: '¿Cuáles son Nuestras Impresiones sobre la Route Rongai?',
          bullets: [
            'Tasa de éxito: superior a la media gracias a una subida lenta y regular y a la posibilidad de aclimatarse en Mawenzi Tarn.',
            'Clima: un sendero más seco en el lado norte significa menos interrupciones por la lluvia.',
            'Noche de la cumbre: comienza desde Kibo Hut, ofreciendo una subida directa y empinada hacia Gilman\'s Point antes de continuar hacia Uhuru Peak.',
            'Particularidad: desciendes por el lado Marangu, ofreciéndote una experiencia de travesía de la montaña — un placer poco común entre las rutas del Kilimanjaro.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Rongai',
  secondaryTagline: 'Descubre ambos lados del Kilimanjaro en un solo viaje inolvidable.',
  faqHeading: '10 Preguntas sobre la Route Rongai',
  faqs: [
    {number: 1, question: '¿Cuánto tiempo se necesita para recorrer la Route Rongai?', answer: 'El itinerario estándar requiere 7 días, pero algunos escaladores añaden un día adicional de aclimatación para aumentar sus posibilidades de éxito en la cumbre.'},
    {number: 2, question: '¿Es la Route Rongai adecuada para principiantes?', answer: 'Sí. Tiene una pendiente más suave y menos subidas empinadas, lo que la convierte en una excelente opción para los principiantes en el trekking de alta montaña.'},
    {number: 3, question: '¿Qué hace única a la Route Rongai?', answer: 'Es la única ruta que comienza desde el lado norte del Kilimanjaro cerca de la frontera con Kenia, ofreciendo condiciones secas y vistas únicas del Parque Nacional de Amboseli.'},
    {number: 4, question: '¿Cuál es la tasa de éxito en la cumbre por la Route Rongai?', answer: 'Con 7 días, la tasa de éxito es de aproximadamente 85-90%, especialmente si se incluye un día de aclimatación.'},
    {number: 5, question: '¿Está concurrida la Route Rongai en comparación con otras?', answer: 'Es una de las rutas más tranquilas del Kilimanjaro, perfecta para quienes desean evitar las multitudes más numerosas presentes en rutas como Machame y Marangu.'},
    {number: 6, question: '¿Cómo son los campamentos en Rongai?', answer: 'Dormirás en tienda en campamentos pintorescos como Mawenzi Tarn y Kikelewa, conocidos por sus entornos remotos y tranquilos y sus paisajes espectaculares.'},
    {number: 7, question: '¿Se desciende por el mismo sendero?', answer: 'No. Subes desde el norte y desciendes por la Route Marangu al sur, ofreciendo una experiencia más variada de la montaña.'},
    {number: 8, question: '¿Cuál es la mejor época del año para escalar la Route Rongai?', answer: 'De enero a mediados de marzo y de junio a octubre ofrecen el mejor clima. También es una buena opción durante la temporada de lluvias, ya que el lado norte permanece relativamente seco.'},
    {number: 9, question: '¿Es frecuente el mal de altura en esta ruta?', answer: 'Como en todas las rutas, el mal de altura es posible. Sin embargo, la escalada progresiva de Rongai ayuda al cuerpo a adaptarse más fácilmente — especialmente con un itinerario de 7 días.'},
    {number: 10, question: '¿Por qué debería elegir la Route Rongai en lugar de otras opciones?', answer: 'Si buscas un sendero más tranquilo, una excelente aclimatación y una diversidad pintoresca sin la afluencia, Rongai ofrece una de las mejores experiencias generales del Kilimanjaro.'},
  ],
}

const umbwe: RouteEs = {
  slug: 'umbwe-route',
  name: 'Route Umbwe',
  seoTitle: 'Route Umbwe | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Escala el Kilimanjaro por la Route Umbwe, la ruta más empinada y directa de la montaña. Itinerario día por día real, tarifas y consejos de expertos.',
  heroHeading: 'Route Umbwe',
  heroTagline: 'El sendero empinado hacia la soledad y la gloria de la cumbre',
  heroBody: [
    'La Route Umbwe es la ruta más directa — y probablemente la más exigente — hacia la cumbre del Monte Kilimanjaro. Conocida por sus subidas empinadas, sus crestas accidentadas y su terreno emocionante, es preferida por excursionistas experimentados que buscan una ruta audaz y menos frecuentada.',
    'A diferencia de las rutas más populares, Umbwe ofrece una naturaleza salvaje auténtica, menos afluencia y un desafío acelerado a través de la exuberante selva tropical, crestas empinadas y zonas alpinas elevadas. Aunque físicamente intensa, la recompensa es una soledad incomparable y paisajes montañosos espectaculares.',
  ],
  heroImage: {src: '/images/routes/umbwe/hero.jpg', alt: 'Tiendas de colores en Karanga Camp con el Kibo nevado de fondo'},
  itineraryHeading: 'Itinerario de la Route Umbwe',
  itinerarySubheading: 'El camino más empinado y directo hacia la cumbre',
  daysLabel: '6 Días',
  stops: [
    arrivalStopEs,
    {
      label: 'Día de Trekking 1: Umbwe Gate – Umbwe Cave Camp',
      meta: ['📍 Umbwe Gate (1.800 m/5.905 pies) → Umbwe Cave Camp (2.850 m/9.350 pies)', '📈 Desnivel positivo: 1.050 m / 3.445 pies', '⏳ Duración: 5-7 horas'],
      body: ['Después del registro en Umbwe Gate, el sendero se adentra directamente en la selva tropical. Recorrerás una cresta estrecha y empinada bordeada de árboles gigantes, musgo y raíces entrelazadas. Espera un desafío físico desde el principio — pero también vistas increíbles al subir por encima del dosel forestal.'],
    },
    {
      label: 'Día de Trekking 2: Umbwe Cave Camp – Barranco Camp',
      meta: ['📍 Umbwe Cave Camp (2.850 m/9.350 pies) → Barranco Camp (3.900 m/12.800 pies)', '📈 Desnivel positivo: 1.050 m / 3.450 pies', '⏳ Duración: 4-6 horas'],
      body: ['Dejas atrás el bosque para entrar en el brezal y las zonas de brezo, escalando por crestas afiladas con vistas impresionantes de los valles de abajo. Te unirás a los excursionistas de Machame y Lemosho en Barranco Camp.'],
    },
    {
      label: 'Día de Trekking 3: Barranco Camp – Karanga Camp',
      meta: ['📍 Barranco Camp (3.900 m/12.800 pies) → Karanga Camp (3.995 m/13.106 pies)', '📈 Desnivel positivo: 95 m / 306 pies', '⏳ Duración: 4-5 horas'],
      body: ['Después de enfrentar la célebre Barranco Wall, una escalada divertida con vistas panorámicas, el sendero desciende y asciende a través de valles antes de llegar a Karanga Camp, encaramado en una cresta azotada por el viento.'],
    },
    {
      label: 'Día de Trekking 4: Karanga Camp – Barafu Camp',
      meta: ['📍 Karanga Camp (3.995 m/13.106 pies) → Barafu Camp (4.673 m/15.331 pies)', '📈 Desnivel positivo: 678 m / 2.225 pies', '⏳ Duración: 3-4 horas'],
      body: ['Un día de trekking más corto deja a tu cuerpo tiempo para descansar y prepararse para la noche de la cumbre. Llegarás a Barafu Camp a mediodía. La tarde se dedica a la hidratación, las comidas y el descanso antes de que comience la escalada final a medianoche.'],
    },
    {
      label: 'Día de Trekking 5: Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.673 m/15.331 pies) → Uhuru Peak (5.895 m/19.341 pies) → Mweka Camp (3.110 m/10.204 pies)',
        '📈 Desnivel positivo: 1.222 m / 4.010 pies',
        '📉 Desnivel negativo: 2.785 m / 9.137 pies',
        '⏳ Duración: 12-16 horas',
      ],
      body: ['Una salida a medianoche te conduce a la cumbre bajo las estrellas. Alcanzas Uhuru Peak al amanecer, luego comienza un largo descenso hacia Mweka Camp. Es el día más difícil — mental y físicamente — pero también el más inolvidable.'],
    },
    {
      label: 'Día de Trekking 6: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m/10.204 pies) → Mweka Gate (1.640 m/5.380 pies)', '📉 Desnivel negativo: 1.470 m / 4.823 pies', '⏳ Duración: 3-4 horas'],
      body: ['El descenso final te lleva a través de la exuberante selva tropical hasta Mweka Gate, donde te espera tu certificado de cumbre. Despídete de la montaña y disfruta del viaje de regreso a Moshi o Arusha.'],
    },
    departureStopEs,
  ],
  infoTabsHeading: '¿Por Qué Elegir Umbwe?',
  tabs: [
    {
      id: 'duration',
      label: 'Duración del Viaje',
      blocks: [
        {
          heading: '¿Cuáles son las Ventajas de Elegir la Route Umbwe?',
          paragraphs: [
            'Si buscas una aventura audaz y llena de adrenalina en el Kilimanjaro, la Route Umbwe está hecha para ti. Es la ruta más empinada y directa hacia la cumbre — ofreciendo una escalada emocionante a través de paisajes salvajes y prístinos. Al ser menos frecuentada, ofrece senderos tranquilos, una belleza natural auténtica y una conexión íntima con la montaña que pocas otras rutas ofrecen. Es preferida por excursionistas experimentados y aficionados a la aventura que buscan una experiencia tranquila, fuera de lo común, sin dejarse disuadir por el desafío adicional.',
            'Elige Umbwe si deseas:',
            '⚠️ Nota: debido al rápido ascenso y al reducido tiempo de aclimatación, esta ruta es más adecuada para excursionistas experimentados o en excelente condición física.',
          ],
          bullets: [
            'Un sendero más tranquilo y remoto',
            'Menos afluencia, incluso en temporada alta',
            'Una subida empinada y directa que gana altitud rápidamente',
            'Crestas pintorescas y vistas espectaculares en todo el recorrido',
            'Una escalada más rápida con una distancia total más corta',
          ],
        },
        {
          heading: '¿Cuánto Tiempo se Necesita para Recorrer la Route Umbwe?',
          paragraphs: [
            'Es una de las rutas más cortas y directas hacia la cumbre, lo que significa menos tiempo en la montaña — pero también un mayor desafío físico y de altitud.',
          ],
          bullets: ['Días totales: 6 días (5 días de trekking + cumbre)', 'Distancia: aproximadamente 53 km', 'Punto de partida: Umbwe Gate (1.800 m)', 'Cumbre: Uhuru Peak (5.895 m)', 'Punto de llegada: Mweka Gate (1.640 m)'],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Detalle de las Tarifas',
      blocks: [
        {
          heading: '¿Cuál es el Costo Asociado a la Route Umbwe?',
          paragraphs: [
            'Aunque los precios varían según el tamaño del grupo, el operador y las prestaciones incluidas, aquí una estimación general para una escalada Umbwe de 6 días:',
            'Las prestaciones incluidas suelen cubrir: las tasas de parque y rescate, las tiendas, el equipo de campamento y las comidas, guías experimentados, porteadores y cocineros, el transporte de ida y vuelta al punto de partida, el certificado de cumbre.',
            '🧾 Consejo: verifica siempre si el precio incluye el alojamiento antes/después, el alquiler de equipo y las propinas para porteadores y guías.',
          ],
          bullets: ['Tour en grupo: 1.800 $ a 2.300 $ por persona', 'Trekking privado: 2.400 $ a más de 3.000 $ por persona'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dónde te Alojarás',
      blocks: [
        {
          heading: '¿Cuáles son los Campamentos a lo Largo de la Route Umbwe?',
          paragraphs: [
            'A diferencia de la Route Marangu (que utiliza refugios), la Route Umbwe es una experiencia enteramente en campamento. Te alojarás en campamentos montados cada día por tus porteadores. Los campamentos se encuentran en:',
            'Espera cielos nocturnos espectaculares, aire de montaña fresco y la comodidad de un saco de dormir cálido bajo lona.',
          ],
          bullets: ['Umbwe Cave Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp (en descenso)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularidad y Afluencia',
      blocks: [
        {
          heading: '¿Está Concurrida la Route Umbwe?',
          paragraphs: [
            'Umbwe es una de las rutas menos frecuentadas del Kilimanjaro. Incluso podrías encontrarte solo en el sendero durante horas, en particular en los tramos inferiores. Una vez que te unes a los escaladores de Machame y Lemosho en Barranco Camp, se anima un poco más — pero sigue siendo más tranquila que otras rutas. Si la soledad es importante para ti, es una excelente elección.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opiniones de Expertos',
      blocks: [
        {
          heading: '¿Cuáles son Nuestras Impresiones sobre la Route Umbwe?',
          bullets: [
            'La aclimatación es limitada, lo que aumenta el desafío. Esta ruta no es ideal para excursionistas primerizos en alta montaña.',
            'Los guías recomiendan caminatas de preaclimatación o un entrenamiento en altitud si eliges Umbwe.',
            'La tasa de éxito en la cumbre es más baja que en rutas más largas, pero los excursionistas robustos con un buen ritmo y una buena hidratación a menudo lo logran bien.',
            'Para quienes tienen experiencia en trekking técnico, la Barranco Wall es un tramo divertido y pintoresco, no una escalada aterradora.',
            'La duración más corta significa menos días de vacaciones o de viaje — pero también requiere una mejor condición física.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Umbwe',
  secondaryTagline: 'El sendero empinado hacia la soledad y la gloria de la cumbre.',
  faqHeading: '10 Preguntas sobre la Route Umbwe',
  faqs: [
    {number: 1, question: '¿Cuánto tiempo se necesita para escalar el Kilimanjaro por la Route Umbwe?', answer: 'La Route Umbwe requiere generalmente 6 días, incluyendo el día de la cumbre y el descenso. Algunos escaladores optan por una versión de 7 días para dejar más tiempo para aclimatarse, aunque 6 días es la norma.'},
    {number: 2, question: '¿Es difícil la Route Umbwe?', answer: 'Sí — Umbwe se considera la ruta no técnica más difícil del Kilimanjaro. Su subida empinada y rápida deja poco tiempo para la aclimatación, haciéndola más adecuada para excursionistas experimentados y en buena forma física.'},
    {number: 3, question: '¿Cuál es la tasa de éxito para la Route Umbwe?', answer: 'Debido a su corta duración y su perfil empinado, la tasa de éxito en la cumbre es más baja que en rutas más largas — a menudo alrededor del 60-70%. Días adicionales de aclimatación pueden mejorar tus posibilidades.'},
    {number: 4, question: '¿Está concurrida la Route Umbwe?', answer: 'Para nada. Es una de las rutas menos frecuentadas de la montaña. Disfrutarás de senderos tranquilos y campamentos pacíficos, en particular en las primeras etapas antes de unirte a otras rutas en Barranco.'},
    {number: 5, question: '¿Es pintoresca la Route Umbwe?', answer: '¡Es increíblemente pintoresca! La ruta asciende a través de una densa selva tropical, crestas espectaculares y valles profundos, ofreciendo vistas panorámicas desde el inicio del trekking y panoramas magníficos en todo el recorrido.'},
    {number: 6, question: '¿Dónde se duerme en la Route Umbwe?', answer: 'Te alojarás en campamentos montados por tu equipo de apoyo. A diferencia de la Route Marangu, que utiliza refugios, Umbwe es una experiencia enteramente en campamento.'},
    {number: 7, question: '¿Pueden los principiantes hacer la Route Umbwe?', answer: 'No se recomienda para principiantes. La ruta es físicamente exigente y tiene un tiempo de aclimatación limitado. Si eres nuevo en el trekking de alta montaña, una ruta más larga y progresiva como Lemosho o Machame será más adecuada.'},
    {number: 8, question: '¿Cuál es la mejor época para escalar por la Route Umbwe?', answer: 'Los mejores meses son enero-marzo y junio-octubre, que ofrecen clima seco y cielos despejados. Diciembre también es posible, aunque ligeramente más húmedo.'},
    {number: 9, question: '¿Se une la Route Umbwe a otros senderos?', answer: 'Sí. Cerca de Barranco Camp, la Route Umbwe se une a las Route Machame y Lemosho, compartiendo el circuito sur hacia la cumbre y descendiendo por la Route Mweka.'},
    {number: 10, question: '¿Por qué elegir la Route Umbwe en lugar de otras?', answer: 'Elige Umbwe si deseas una escalada más difícil, remota y pintoresca con menos afluencia. Es ideal para excursionistas que buscan soledad, paisajes espectaculares y una duración total más corta — simplemente prepárate para la intensidad.'},
  ],
}

const northernCircuit: RouteEs = {
  slug: 'northern-circuit-route',
  name: 'Route Northern Circuit',
  seoTitle: 'Route Northern Circuit | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Escala el Kilimanjaro por la Route Northern Circuit, la ruta más larga y pintoresca con la tasa de éxito más alta. Itinerario día por día real, tarifas y consejos de expertos.',
  heroHeading: 'Route Northern Circuit en el Monte Kilimanjaro',
  heroTagline: 'La ruta más popular hacia la cumbre del Kilimanjaro',
  heroBody: [
    'La Route Northern Circuit es la ruta más larga y pintoresca del Monte Kilimanjaro, ofreciendo vistas incomparables y la tasa de éxito más alta entre todas las rutas. Al rodear casi por completo la montaña, permite una excelente aclimatación, lo que la hace ideal para excursionistas que buscan una escalada más progresiva con menos afluencia.',
    'Descubrirás de todo, desde la exuberante selva tropical y el brezal alpino hasta los accidentados altiplanos y los vastos cielos abiertos en las laderas norte — una región que pocos tienen la oportunidad de ver. Con su belleza remota y su ritmo estratégico, el Northern Circuit ofrece una experiencia de trekking premium para quienes disponen de tiempo y espíritu de aventura.',
  ],
  heroImage: {src: '/images/routes/northern-circuit/hero.jpg', alt: 'Tiendas en Mweka Camp con la cumbre del Kibo al amanecer'},
  itineraryHeading: 'Itinerario de la Route Northern Circuit',
  itinerarySubheading: 'Ir lejos para llegar más alto',
  daysLabel: '9 Días',
  stops: [
    arrivalStopEs,
    {
      label: 'Día de Trekking 1: Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2.100 m/6.890 pies) → Mti Mkubwa Camp (2.650 m/8.692 pies)', '📈 Desnivel positivo: 550 m / 1.800 pies', '⏳ Duración: 3-4 horas'],
      body: ['Tu trekking comienza con un trayecto hasta Londorossi Gate para el registro, seguido de una caminata suave a través de la exuberante selva tropical, hogar de colobos y una rica avifauna. Llega a Mti Mkubwa (Big Tree) Camp para tu primera noche bajo las estrellas.'],
    },
    {
      label: 'Día de Trekking 2: Mti Mkubwa Camp – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m/11.843 pies)', '📈 Desnivel positivo: 960 m / 3.151 pies', '⏳ Duración: 6-7 horas'],
      body: ['Sales del bosque para entrar en la zona de brezo y brezal, donde el paisaje se abre con vistas del pico Kibo. Disfruta de una caminata tranquila a través de la meseta de Shira para llegar a tu campamento.'],
    },
    {
      label: 'Día de Trekking 3: Shira 1 Camp – Shira 2 Camp',
      meta: ['📍 Shira 1 Camp (3.610 m) → Shira 2 Camp (3.850 m/12.631 pies)', '📈 Desnivel positivo: 240 m / 787 pies', '⏳ Duración: 3-4 horas'],
      body: ['Un breve trekking a través de la vasta meseta abierta de Shira Ridge te deja tiempo para descansar y aclimatarte. Si el clima lo permite, tendrás vistas panorámicas del Kibo y del Monte Meru a lo lejos.'],
    },
    {
      label: 'Día de Trekking 4: Shira 2 Camp – Lava Tower – Moir Hut',
      meta: [
        '📍 Shira 2 (3.850 m) → Lava Tower (4.630 m/15.190 pies) → Moir Hut (4.200 m/13.780 pies)',
        '📈 Desnivel positivo: 780 m / 2.559 pies',
        '📉 Desnivel negativo: 430 m / 1.410 pies',
        '⏳ Duración: 6-7 horas',
      ],
      body: ['Hoy incluye una subida hasta Lava Tower — un punto clave de aclimatación — antes de descender ligeramente hacia Moir Hut, remoto y tranquilo, situado en un valle de alta montaña.'],
    },
    {
      label: 'Día de Trekking 5: Moir Hut – Buffalo Camp',
      meta: ['📍 Moir Hut (4.200 m) → Buffalo Camp (4.020 m/13.189 pies)', '📉 Desnivel negativo: 180 m / 591 pies', '⏳ Duración: 5-7 horas'],
      body: ['Camina por las raramente vistas laderas norte del Kilimanjaro, con vistas panorámicas hacia las llanuras kenianas. El recorrido es salvaje y tranquilo — aquí es donde el Northern Circuit se gana su reputación.'],
    },
    {
      label: 'Día de Trekking 6: Buffalo Camp – Third Cave Camp',
      meta: ['📍 Buffalo Camp (4.020 m) → Third Cave (3.870 m/12.697 pies)', '📉 Desnivel negativo: 150 m / 492 pies', '⏳ Duración: 5-6 horas'],
      body: ['Otro día de trekking suave a través del desierto alpino. Continuando hacia el este, la sensación de aislamiento es incomparable. Instálate en Third Cave Camp y prepárate para el esfuerzo final.'],
    },
    {
      label: 'Día de Trekking 7: Third Cave Camp – School Hut',
      meta: ['📍 Third Cave (3.870 m) → School Hut (4.750 m/15.584 pies)', '📈 Desnivel positivo: 880 m / 2.887 pies', '⏳ Duración: 4-5 horas'],
      body: ['Un día más corto con una subida regular hacia School Hut, tu última base antes del intento de cumbre. Llega temprano para la cena y el descanso antes de tu escalada de medianoche.'],
    },
    {
      label: 'Día de Trekking 8: School Hut – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 School Hut (4.750 m) → Uhuru Peak (5.895 m/19.341 pies) → Mweka Camp (3.110 m/10.204 pies)',
        '📈 Desnivel positivo: 1.145 m / 3.757 pies',
        '📉 Desnivel negativo: 2.785 m / 9.137 pies',
        '⏳ Duración: 12-15 horas',
      ],
      body: ['¡Día de la cumbre! Comienza tu escalada hacia medianoche, alcanza Stella Point al amanecer, luego continúa hasta Uhuru Peak, el punto más alto de África. Después de celebrar, desciende a Mweka Camp para un descanso bien merecido.'],
    },
    {
      label: 'Día de Trekking 9: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m) → Mweka Gate (1.640 m/5.380 pies)', '📉 Desnivel negativo: 1.470 m / 4.823 pies', '⏳ Duración: 3-4 horas'],
      body: ['Una última caminata a través de la selva tropical te lleva a Mweka Gate, donde firmarás tu salida, recibirás tu certificado de cumbre, y regresarás a Moshi para celebrar y descansar.'],
    },
    departureStopEs,
  ],
  infoTabsHeading: '¿Por Qué Elegir el Northern Circuit?',
  tabs: [
    {
      id: 'duration',
      label: 'Duración del Viaje',
      blocks: [
        {
          heading: '¿Cuáles son las Ventajas de Elegir la Route Northern Circuit?',
          bullets: [
            'La tasa de éxito más alta gracias a su prolongado período de aclimatación.',
            'La ruta más larga del Kilimanjaro (9 días), que ofrece más tiempo para adaptarse y disfrutar del viaje.',
            'Paisajes espectaculares desde todos los ángulos — exuberante selva tropical, meseta de Shira y naturaleza salvaje del norte.',
            'Muy poca afluencia — rara vez verás a otros grupos antes de la noche de la cumbre.',
            'Ideal para excursionistas experimentados o para quienes desean un ritmo más relajado.',
            'Excelente posibilidad de observar fauna, incluyendo elands y búfalos, en las laderas inferiores.',
          ],
        },
        {
          heading: '¿Cuánto Tiempo se Necesita para Recorrer la Route Northern Circuit?',
          paragraphs: [
            'Días totales en la montaña: 9. Días de subida: 8 (con un desnivel progresivo). Día de descenso: 1. Este tiempo adicional mejora notablemente el éxito en la cumbre al permitir que tu cuerpo se adapte naturalmente a la altitud.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Detalle de las Tarifas',
      blocks: [
        {
          heading: '¿Cuál es el Costo Asociado a la Route Northern Circuit?',
          paragraphs: [
            'Los precios del Northern Circuit de 9 días suelen incluir:',
            '💵 Rango estimado: 2.500 $ a 3.700 $ por persona, según el tamaño del grupo y la calidad del operador.',
          ],
          bullets: [
            'Todas las tasas de parque, permisos e impuestos',
            'Guías de montaña profesionales, porteadores y cocineros',
            'Pensión completa en la montaña (comidas, agua purificada, snacks)',
            'Equipo de campamento (tiendas, esterillas, tienda comedor, etc.)',
            'Traslados de aeropuerto y estancias en hotel antes/después de la escalada',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dónde te Alojarás',
      blocks: [
        {
          heading: '¿Cuáles son los Campamentos a lo Largo de la Route Northern Circuit?',
          bullets: [
            'Campamento durante todo el recorrido – no hay refugios en esta ruta.',
            'Cómodas tiendas de montaña de 3 estaciones con esterillas de espuma.',
            'Tiendas sanitarias privadas y tiendas comedor para los operadores de gama alta.',
            'Los campamentos son tranquilos, pintorescos y menos frecuentados que en otras rutas.',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularidad y Afluencia',
      blocks: [
        {
          heading: '¿Está Concurrida la Route Northern Circuit?',
          bullets: [
            'El Northern Circuit es la ruta menos frecuentada del Kilimanjaro.',
            'Perfecta para excursionistas que prefieren un sendero más remoto y tranquilo.',
            'Verás menos grupos hasta que te unas a los senderos Marangu/Machame cerca de la cumbre.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opiniones de Expertos',
      blocks: [
        {
          heading: '¿Cuáles son Nuestras Impresiones sobre la Route Northern Circuit?',
          bullets: [
            'Recomendada para fotógrafos y amantes de la naturaleza que desean ver todos los lados del Kilimanjaro.',
            'Con su duración de 9 días, es ideal para excursionistas preocupados por el mal de altura.',
            'Aunque no es técnicamente difícil, necesitarás buena resistencia para las largas jornadas.',
            'Ofrece una experiencia de naturaleza salvaje única, lejos de los principales senderos turísticos.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Northern Circuit',
  secondaryTagline: 'La ruta pintoresca hacia la cumbre – Ir lejos para llegar más alto.',
  faqHeading: '10 Preguntas sobre la Route Northern Circuit',
  faqs: [
    {number: 1, question: '¿Cuánto tiempo requiere la Route Northern Circuit?', answer: 'La Route Northern Circuit requiere generalmente de 9 a 10 días. Esta duración permite una aclimatación adecuada, aumentando notablemente las posibilidades de éxito en la cumbre del Kilimanjaro.'},
    {number: 2, question: '¿Es difícil escalar el Kilimanjaro por el Northern Circuit?', answer: 'Es un largo trekking, pero la aclimatación gradual lo hace manejable para principiantes en buena forma física.'},
    {number: 3, question: '¿Cuál es la tasa de éxito en la cumbre en esta ruta?', answer: 'Aproximadamente 90-95%, la más alta entre todas las rutas gracias a una ganancia de altitud progresiva.'},
    {number: 4, question: '¿Cuál es la mejor época para escalar por el Northern Circuit?', answer: 'Enero-marzo y junio-octubre ofrecen el mejor clima y las mejores condiciones del sendero.'},
    {number: 5, question: '¿Es el Northern Circuit más costoso que otras rutas?', answer: 'Sí, ya que es más larga y más remota — pero la experiencia es incomparable.'},
    {number: 6, question: '¿Necesito experiencia previa de trekking?', answer: 'No, pero una buena condición física y una buena preparación son esenciales.'},
    {number: 7, question: '¿Qué fauna podría observar?', answer: 'Monos azules, colobos, búfalos, y a veces elefantes en las laderas inferiores.'},
    {number: 8, question: '¿Está concurrido el Northern Circuit?', answer: 'No. Es la ruta más tranquila con una afluencia muy baja.'},
    {number: 9, question: '¿Es una ruta en campamento?', answer: 'Sí, todas las noches se pasan en tienda. No hay refugios disponibles.'},
    {number: 10, question: '¿Puedo alquilar equipo en el lugar?', answer: 'Sí, la mayoría de los operadores confiables ofrecen equipo de alquiler de alta calidad en Moshi o Arusha.'},
  ],
}

const routesEs: RouteEs[] = [machame, marangu, lemosho, rongai, umbwe, northernCircuit]

// ---------- routesHubPage-es ----------

async function seedRoutesHubEs() {
  const cards = [
    {title: 'Route Machame', slug: 'machame-route', summary: 'Conocida como Whiskey Route, Machame es la ruta más popular del Kilimanjaro, que ofrece paisajes impresionantes y un terreno variado. Aunque exigente, con senderos empinados y campamentos con tiendas, ofrece una excelente aclimatación para los escaladores que buscan un trek más corto pero gratificante.', image: {src: '/images/routes/hub/card-machame.png', alt: 'Mapa ilustrado de la Route Machame'}},
    {title: 'Route Lemosho', slug: 'lemosho-route', summary: 'Una de las rutas más pintorescas del Kilimanjaro, Lemosho comienza en el aislado Londorossi Gate, atravesando la magnífica meseta de Shira. Esta ruta ofrece una escalada tranquila con vistas espectaculares, una rica fauna y una subida progresiva para una experiencia cómoda.', image: {src: '/images/routes/hub/card-lemosho.png', alt: 'Mapa ilustrado de la Route Lemosho'}},
    {title: 'Route Rongai', slug: 'rongai-route', summary: 'Única ruta septentrional del Kilimanjaro, Rongai es menos frecuentada y más suave, lo que la convierte en una excelente opción para quienes prefieren una escalada calmada y regular. Esta ruta es ideal durante la temporada de lluvias, ya que recibe menos precipitación y ofrece un trekking placentero a través de una naturaleza salvaje prístina.', image: {src: '/images/routes/hub/card-rongai.png', alt: 'Mapa ilustrado de la Route Rongai'}},
    {title: 'Route Northern Circuit', slug: 'northern-circuit-route', summary: 'La ruta más larga y más pintoresca, el Northern Circuit ofrece la mejor aclimatación al rodear progresivamente el Kilimanjaro. Con vistas panorámicas y una alta tasa de éxito, esta ruta ofrece una experiencia de trekking tranquila e inmersiva.', image: {src: '/images/routes/hub/card-northern-circuit.png', alt: 'Mapa ilustrado de la Route Northern Circuit'}},
  ]
  await client.createOrReplace({
    _id: 'routesHubPage-es',
    _type: 'routesHubPage',
    language: 'es',
    seo: {_type: 'seo', title: 'Rutas de Escalada del Kilimanjaro | Climbing Kilimanjaro Tanzania', description: 'Compara las mejores rutas para escalar el Monte Kilimanjaro — Machame, Lemosho, Rongai y el Northern Circuit — con itinerarios reales y consejos de expertos.'},
    hero: {eyebrow: 'El Techo de África.', heading: 'Las Mejores Rutas para Escalar el Kilimanjaro', locationPill: 'Norte de Tanzania'},
    ctaBandButtons: [
      {_type: 'ctaButton', _key: key(), label: 'Solicita un Presupuesto Ahora', href: '/request-a-quote-tanzania-safari/', variant: 'solid'},
      {_type: 'ctaButton', _key: key(), label: 'Habla con Nuestro Experto', href: 'https://wa.me/255767140150', variant: 'outline'},
    ],
    promoSection: {heading: 'Qué Saber Antes de Escalar el Kilimanjaro', exploreLabel: 'Explora Toda la Información', exploreHref: '/kilimanjaro-climbing-guide/'},
    tabsHeading: 'Rutas y Mapas de Escalada del Kilimanjaro',
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'routeHubCard', _key: key(), title: card.title, routeSlug: card.slug, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
    testimonials: [
      {name: 'Obazee', date: '2023-11-28', quote: '¡La escalada de una vida! Nuestra escalada del Kilimanjaro con Asili Explorer African Safaris fue verdaderamente extraordinaria. De principio a fin, el equipo garantizó una experiencia inolvidable, haciendo que nuestro viaje hacia la cumbre fuera fluido, seguro y memorable.'},
      {name: 'Romy H', date: '2023-11-28', quote: 'No sorprende que Asili Explorer African Safaris mantenga una reputación de 5 estrellas. Su experiencia, profesionalismo y compromiso con la satisfacción del cliente los distinguen. Si buscas la mejor agencia de trekking en el Kilimanjaro, ¡no busques más!'},
      {name: 'Rony V', date: '2023-12-27', quote: 'En octubre de 2023, realizamos un trekking de seis días hasta la cumbre del Kilimanjaro con Asili Explorer African Safaris. La experiencia fue fenomenal, y lo recomiendo encarecidamente a cualquiera que esté considerando esta aventura.'},
      {name: 'Avdb', date: '2023-11-28', quote: 'Joe fue un guía y conductor perfecto. Nos hizo visitar y descubrir la verdadera fauna de Tanzania. Nada era demasiado complicado para él. Su conocimiento de todos los lugares principales de los diferentes animales es impresionante.'},
    ].map((t) => ({_type: 'hubTestimonial', _key: key(), name: t.name, date: t.date, quote: t.quote})),
    faqHeading: 'Preguntas Frecuentes',
    faqSubheading: 'Tus Preguntas y Nuestras Respuestas',
    faqIntro: '¿Tienes preguntas sobre reservar un safari en Tanzania con nosotros? Consulta nuestras preguntas frecuentes a continuación para obtener respuestas rápidas. Si no encuentras lo que buscas, no dudes en contactarnos — nuestros expertos están aquí para ayudarte a planificar la aventura tanzana perfecta.',
    faqs: [
      {question: '¿Qué rutas están disponibles para el Kilimanjaro?', answer: 'El Monte Kilimanjaro ofrece varias rutas adecuadas para escaladores de todos los niveles, preferencias y estilos de trekking. En Asili Explorer African Safaris, nos especializamos en las cuatro rutas más populares del Kilimanjaro: Rongai Route, Lemosho Route, Northern Circuit Route y Machame Route. Nuestras escaladas guiadas garantizan seguridad, una aclimatación adecuada y un viaje inolvidable hasta la cumbre.'},
      {question: '¿Cuál es la ruta menos frecuentada del Kilimanjaro?', answer: 'La Northern Circuit Route es la menos frecuentada, ofreciendo una experiencia de trekking tranquila y aislada.'},
      {question: '¿Cuál es la ruta más fácil para escalar el Kilimanjaro?', answer: 'La Rongai Route se considera la más fácil gracias a sus pendientes progresivas y su ascenso directo.'},
      {question: '¿Cuál es la ruta más pintoresca del Kilimanjaro?', answer: 'La Lemosho Route suele considerarse la más pintoresca, con paisajes impresionantes, ecosistemas variados y vistas panorámicas.'},
      {question: '¿Cuánto cuesta escalar el Kilimanjaro?', answer: 'El costo de escalar el Kilimanjaro varía de 2.500 $ a 4.000 $, según la elección de la ruta, la duración, el tamaño del grupo, el nivel de servicio y las prestaciones incluidas. En Asili Explorer African Safaris, garantizamos guías bien formados, altos estándares de seguridad y una experiencia general excepcional.'},
      {question: '¿Cuánto tiempo se necesita para escalar el Monte Kilimanjaro?', answer: 'La escalada requiere generalmente de 6 a 9 días, según la ruta elegida. Una ruta más larga permite una mejor aclimatación, aumentando las posibilidades de una experiencia de cumbre exitosa y placentera.'},
      {question: '¿Pueden los principiantes escalar el Monte Kilimanjaro?', answer: '¡Sí! Aunque no se requiere ninguna habilidad técnica de escalada, los principiantes deben seguir un entrenamiento físico adecuado antes de intentar la escalada. Nuestros guías experimentados aseguran que los escaladores principiantes reciban el apoyo y el acompañamiento necesarios durante todo el viaje.'},
      {question: '¿Cuál es la mejor época para escalar el Monte Kilimanjaro?', answer: 'Las mejores temporadas para escalar el Kilimanjaro son los meses secos: de enero a marzo y de junio a octubre. Estos meses ofrecen las mejores condiciones climáticas, un cielo más despejado y una experiencia de trekking más placentera.'},
      {question: '¿Se necesita un guía para escalar el Kilimanjaro?', answer: '¡Sí! No se permite escalar el Kilimanjaro sin un guía autorizado. Los guías aportan su experiencia, monitorean tu salud, garantizan tu seguridad y te ayudan a orientarte en el exigente terreno del Kilimanjaro — incluso los escaladores experimentados deben tener uno.'},
      {question: '¿Cuál es el nivel de dificultad para escalar el Monte Kilimanjaro?', answer: 'Escalar el Monte Kilimanjaro es una aventura exigente pero gratificante. La principal dificultad proviene de la alta altitud y el terreno variado. Con una buena preparación, un itinerario bien planificado y un acompañamiento experto, escaladores de diferentes niveles de experiencia pueden llegar a la cumbre con éxito.'},
      {question: '¿Cómo se duerme en el Kilimanjaro?', answer: 'Durante tu trekking en el Kilimanjaro, te alojarás en tiendas de alta calidad, resistentes a la intemperie y diseñadas para la comodidad en condiciones extremas, con tiendas espaciosas, colchonetas aislantes y sacos de dormir cálidos para una noche de descanso en nuestros campamentos designados.'},
      {question: '¿Se necesita oxígeno para escalar el Kilimanjaro?', answer: 'La mayoría de los escaladores no necesitan oxígeno suplementario para escalar el Kilimanjaro. La clave para una escalada exitosa es una buena aclimatación. En los raros casos de mal de altura grave, el oxígeno está disponible por motivos de seguridad.'},
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  })
  console.log('routesHubPage-es created/replaced')
}

async function routeToFieldsEs(data: RouteEs) {
  return {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    name: data.name,
    hero: {
      heading: data.heroHeading,
      tagline: data.heroTagline,
      body: data.heroBody.map(paragraphBlock),
      image: await uploadImage(client, data.heroImage),
    },
    itinerary: {
      heading: data.itineraryHeading,
      subheading: data.itinerarySubheading,
      daysLabel: data.daysLabel,
      stops: data.stops.map((stop) => ({
        _type: 'routeStop',
        _key: key(),
        label: stop.label,
        ...(stop.meta?.length ? {meta: stop.meta} : {}),
        body: stop.body.map(paragraphBlock),
      })),
    },
    infoTabs: {
      heading: data.infoTabsHeading,
      tabs: data.tabs.map((tab) => ({
        _type: 'routeInfoTab',
        _key: key(),
        tabId: tab.id,
        label: tab.label,
        blocks: tab.blocks.map((block) => ({
          _type: 'routeInfoBlock',
          _key: key(),
          heading: block.heading,
          ...(block.paragraphs?.length ? {paragraphs: block.paragraphs.map(paragraphBlock)} : {}),
          ...(block.bullets?.length ? {bullets: block.bullets} : {}),
          ...(block.pricingTable
            ? {
                pricingTable: {
                  columns: block.pricingTable.columns,
                  rows: block.pricingTable.rows.map((row) => ({_type: 'pricingRow', _key: key(), label: row.label, values: row.values})),
                },
              }
            : {}),
        })),
      })),
    },
    secondaryBanner: {heading: data.secondaryHeading, tagline: data.secondaryTagline},
    faqHeading: data.faqHeading,
    faqs: data.faqs.map((faq) => ({_type: 'numberedFaq', _key: key(), number: faq.number, question: faq.question, answer: faq.answer})),
  }
}

async function run() {
  for (const route of routesEs) {
    const enId = await findEnId(client, 'route', route.slug)
    if (!enId) {
      console.log(`SKIP ${route.slug}: no en source found`)
      continue
    }
    const fields = await routeToFieldsEs(route)
    const esId = await upsertTranslatedDoc(client, 'route', route.slug, 'es', fields)
    await linkTranslationMetadata(client, 'route', [
      {language: 'en', id: enId},
      {language: 'es', id: esId},
    ])
    console.log(`${route.slug}-es done (${esId})`)
  }
  await seedRoutesHubEs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
