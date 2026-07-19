/**
 * Phase 6 (Spanish): the 6 remaining guide articles (mount-kilimanjaro was
 * already seeded separately in seed-es-articles-misc.ts).
 * Mirrors seed-it-guide-articles.ts's structure but with Spanish text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-guide-articles.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface TableEs {
  columns: string[]
  rows: string[][]
}
interface SectionEs {
  heading: string
  body?: string
  table?: TableEs
}
interface FaqEs {
  question: string
  answer: string
}
interface GuideArticleEs {
  slug: string
  seoTitle: string
  seoDescription: string
  heading: string
  heroImage?: {src: string; alt: string}
  intro: string
  sections: SectionEs[]
  faqHeading?: string
  faqs?: FaqEs[]
}

function tableToDoc(table?: TableEs) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedGuideArticleEs(data: GuideArticleEs) {
  const enId = await findEnId(client, 'article', data.slug)
  if (!enId) {
    console.log(`SKIP ${data.slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    heading: data.heading,
    ...(data.heroImage ? {topImage: await uploadImage(client, data.heroImage)} : {}),
    intro: data.intro,
    sections: data.sections.map((section) => ({
      _type: 'articleSection',
      _key: key(),
      heading: section.heading,
      ...(section.body ? {body: stringToPt(section.body)} : {}),
      ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
    })),
    ...(data.faqHeading ? {faqHeading: data.faqHeading} : {}),
    ...(data.faqs?.length ? {faqs: data.faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer}))} : {}),
  }
  const esId = await upsertTranslatedDoc(client, 'article', data.slug, 'es', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${data.slug}-es done (${esId})`)
}

const kilimanjaroClimbingSeasonsEs: GuideArticleEs = {
  slug: 'kilimanjaro-climbing-seasons',
  seoTitle: 'Mejor Mes para Escalar el Monte Kilimanjaro | Guía del Clima',
  seoDescription: 'Una guía del clima mes a mes para escalar el Monte Kilimanjaro: mejores meses, temporadas secas, meses que evitar y consejos de expertos sobre el momento ideal.',
  heading: 'Mejor Mes para Escalar el Monte Kilimanjaro',
  intro:
    'Los mejores meses para escalar el Monte Kilimanjaro son durante las temporadas secas, que van de enero a marzo y de junio a octubre. Estos períodos ofrecen cielos despejados y senderos más secos, lo que se traduce en condiciones de trekking más favorables. Para un equilibrio entre buen clima y menos afluencia, considera escalar en enero, febrero u octubre.',
  sections: [
    {
      heading: 'Mejor Mes para Escalar el Monte Kilimanjaro: la Guía Definitiva del Clima',
      body: "Las rutas del Kilimanjaro son los caminos oficialmente designados que utilizan los excursionistas para llegar a la cumbre de la montaña más alta de África, Uhuru Peak (5.895 m). Elegir la ruta de escalada del Monte Kilimanjaro adecuada es una de las decisiones más importantes que tomarás al planificar tu trekking. Cada ruta difiere en paisajes, dificultad, perfil de aclimatación, tasa de éxito y experiencia general.",
    },
    {
      heading: 'Por Qué Importa el Mejor Mes para Escalar el Monte Kilimanjaro',
      body: "El clima del Kilimanjaro oscila entre selvas tropicales húmedas y cumbres árticas — elegir el mejor mes para escalar el Monte Kilimanjaro afecta el estado de los senderos, los riesgos de mal de altura y las vistas. Las temporadas secas (ene-mar, jun-oct) ofrecen senderos estables y panoramas despejados, mientras que las lluvias (abr-may, nov) traen barro y niebla. Nuestros guías recomiendan rutas de 7 días o más durante las temporadas altas para una aclimatación óptima. Elegir las temporadas intermedias permite ahorrar entre un 10 y un 20% en costos disfrutando de buen clima.",
    },
    {
      heading: 'Mes a Mes: los Mejores Meses para Escalar el Monte Kilimanjaro — Guía del Clima',
      body: 'Aquí tienes un desglose detallado de cuáles son los mejores meses para escalar el Monte Kilimanjaro, incluyendo la puntuación general, el clima, la afluencia y consejos sobre rutas.',
      table: {
        columns: ['Período', 'Puntuación General', 'Clima', 'Afluencia', 'Ruta Recomendada'],
        rows: [
          ['16 ene-28 feb', 'Excelente', 'Temperaturas razonables, precipitación media, pocas nubes', 'Media', 'Todas las rutas abiertas'],
          ['01 mar-31 mar', 'Variable', 'Temperaturas razonables, riesgo creciente de lluvia y nieve, nubes densas en altitudes bajas', 'Baja', 'Más orientado hacia la Route Rongai, sobre todo hacia el final del período'],
          ['01 abr-15 jun', 'Difícil y peligroso', 'Temperaturas razonables, lluvias intensas, riesgo de nieve, nubes densas en altitudes bajas', 'Muy baja', 'Todas las rutas son difíciles'],
          ['16 jun-15 jul', 'Variable', 'Muy frío, nieve y hielo en la cumbre, precipitación decreciente, visibilidad en mejora', 'Media', 'Más orientado hacia la Route Rongai, sobre todo hacia el inicio del período'],
          ['16 jul-31 ago', 'Bueno', 'Muy frío, nieve y hielo en la cumbre, precipitación baja, a menudo despejado', 'Alta', 'Todas las rutas abiertas'],
          ['01 sep-15 oct', 'Muy bueno', 'Temperaturas razonables, precipitación baja, a menudo despejado', 'Alta', 'Todas las rutas abiertas'],
          ['16 oct-31 oct', 'Variable', 'Temperaturas razonables, riesgo creciente de lluvia, visibilidad reducida', 'Media', 'Más orientado hacia la Route Rongai, sobre todo hacia el final del período'],
          ['01 nov-15 dic', 'Difícil y peligroso', 'Temperaturas reducidas, lluvia y nieve moderadas, tormentas eléctricas', 'Baja', 'Todas las rutas son difíciles'],
          ['16 dic-15 ene', 'Variable', 'Temperaturas reducidas, lluvia y nieve moderadas, nubes densas en altitudes bajas', 'Muy alta', 'Más orientado hacia la Route Rongai, sobre todo hacia el inicio del período'],
        ],
      },
    },
    {heading: 'Mejor Época para Escalar el Monte Kilimanjaro: en Detalle las Temporadas Secas'},
    {heading: 'Enero a Principios de Marzo (Temporada Seca Corta)', body: 'Cálido, soleado y con poca lluvia — excelente para las vistas y la comodidad.'},
    {heading: 'Finales de Junio a Octubre (Temporada Seca Larga)', body: 'La época dorada del Kilimanjaro: senderos secos, aire fresco, panoramas espectaculares.'},
    {
      heading: 'Temporadas Intermedias: Alternativas Válidas a los Mejores Meses',
      body: 'Noviembre (lluvias en retirada) y diciembre (afluencia festiva) ofrecen un clima de transición — manejable con Rongai o Northern Circuit para menos barro.',
    },
    {
      heading: 'Meses que Evitar: Condiciones Climáticas Difíciles en el Kilimanjaro',
      body: 'De finales de marzo a mayo (grandes lluvias) y noviembre (pequeñas lluvias) presentan las condiciones más difíciles — fuertes aguaceros, senderos resbaladizos y niebla.',
    },
    {
      heading: 'Consejos Clave para Escalar en el Mejor Mes para Escalar el Monte Kilimanjaro',
      body: 'Elección de ruta: Rongai para los inicios de temporada intermedia/seca; todas abiertas en temporada alta. Luna llena: reserva para tener visibilidad en la cumbre — concurrido pero mágico. Imprevisibilidad: lleva capas de ropa; la cumbre siempre está bajo cero. Impacto en el costo: temporadas secas +10-20%; descuentos en temporada intermedia.',
    },
  ],
  faqHeading: 'Preguntas Frecuentes sobre el Mejor Mes para Escalar el Monte Kilimanjaro',
  faqs: [
    {question: '¿Cuál es el Mejor Mes para Escalar el Monte Kilimanjaro?', answer: 'Septiembre o febrero — seco, despejado, afluencia equilibrada.'},
    {question: '¿Cuáles son los Mejores Meses para Escalar el Monte Kilimanjaro?', answer: 'De enero a marzo y de junio a octubre para un clima óptimo.'},
    {question: '¿Es Posible Escalar el Kilimanjaro en Temporada de Lluvias?', answer: 'Sí, pero es más arriesgado — opta por la temporada intermedia para un buen equilibrio.'},
    {question: '¿La Mejor Época para Escalar el Monte Kilimanjaro Afecta el Costo?', answer: 'Sí — las temporadas altas añaden aproximadamente un 20%; la temporada baja permite ahorrar.'},
  ],
}

const whatIsTheBestRouteUpKilimanjaroEs: GuideArticleEs = {
  slug: 'what-is-the-best-route-up-kilimanjaro',
  seoTitle: '¿Cuál es la Mejor Ruta para Escalar el Monte Kilimanjaro? | Guía Completa',
  seoDescription: 'Una guía completa de las 7 rutas de escalada del Monte Kilimanjaro: tasas de éxito, distancias de trekking y cómo elegir la mejor ruta para tu escalada.',
  heading: 'Rutas del Monte Kilimanjaro',
  intro:
    'Existen siete rutas consolidadas para escalar el Monte Kilimanjaro, una que comienza en el lado norte y las demás en el lado sur: Northern Circuit, Lemosho, Shira, Machame (Route «Whiskey»), Rongai, Marangu (Route «Coca-Cola») y Umbwe. El Northern Circuit es la ruta más reciente y atraviesa casi toda la montaña, ofreciendo una auténtica experiencia de naturaleza salvaje y vistas de 360 grados. Las rutas Lemosho y Shira se abordan desde el oeste, mientras que la ruta Rongai comienza desde el norte.',
  sections: [
    {
      heading: 'Rutas del Kilimanjaro: Guía Completa de las Rutas de Escalada del Monte Kilimanjaro',
      body: "Las rutas del Kilimanjaro son los caminos oficialmente designados que utilizan los excursionistas para llegar a la cumbre de la montaña más alta de África, Uhuru Peak (5.895 m). Elegir la ruta de escalada del Monte Kilimanjaro adecuada es una de las decisiones más importantes que tomarás al planificar tu trekking. Cada ruta difiere en paisajes, dificultad, perfil de aclimatación, tasa de éxito y experiencia general.",
    },
    {heading: '¿Cuántas Rutas Existen para Escalar el Monte Kilimanjaro?', body: 'Existen 7 rutas principales del Kilimanjaro utilizadas para escalar la montaña: Northern Circuit, Lemosho, Shira, Machame, Rongai, Marangu y Umbwe.'},
    {heading: 'Elementos a Considerar para Elegir tu Ruta de Escalada del Monte Kilimanjaro', body: 'Para elegir la mejor ruta del Monte Kilimanjaro para ti, hay muchas variables a tener en cuenta.'},
    {heading: 'QUIÉN:', body: '¿Quién está escalando? Las capacidades de todo el grupo deben tenerse en cuenta al elegir una ruta. ¿Hay principiantes en tu grupo? ¿Hay personas que nunca han estado en alta montaña? Elige una ruta que se adapte a todos.'},
    {heading: 'QUÉ:', body: '¿Cuáles son los límites de tu escalada? ¿Tienes un presupuesto limitado? ¿O un número limitado de días para tu viaje? Existen rutas más o menos costosas y duraciones más o menos largas. Hazte una idea del presupuesto y del número de días que estás dispuesto a dedicar a la montaña.'},
    {heading: 'CÓMO:', body: '¿Cómo imaginas tu trekking? ¿Quieres la ruta más difícil o una ruta menos exigente? El Kilimanjaro puede generar mucha incomodidad y sufrimiento. Algunas rutas son más llevaderas que otras.'},
    {heading: 'DÓNDE:', body: '¿Dónde deseas comenzar tu escalada? Las rutas comienzan desde todos los lados de la montaña. Tu punto de partida influye en el costo, el paisaje y su diversidad.'},
    {heading: 'POR QUÉ:', body: '¿Por qué escalas? ¿Es muy importante para ti llegar a la cumbre? Entonces elige una ruta con una alta tasa de éxito. ¿Quieres tomar las mejores fotos? Entonces elige una ruta pintoresca. ¿Solo quieres estar allí? Entonces elige una ruta rápida y económica.'},
    {heading: 'CUÁNDO:', body: '¿Cuándo escalas? Si escalas durante la temporada seca, perfecto. Pero si escalas durante la temporada de lluvias o las temporadas intermedias, la ruta que elijas puede influir en la dificultad de la escalada. Las escaladas en torno a festividades y lunas llenas son especialmente concurridas.'},
    {
      heading: '¿Cuál es la Mejor Ruta para Escalar el Monte Kilimanjaro?',
      body: 'La mejor ruta del Kilimanjaro depende de tus prioridades: para la tasa de éxito más alta, elige el Northern Circuit o Lemosho. Para el paisaje, elige Lemosho o Machame. Para presupuesto y tiempo, elige Marangu. Para un desafío, elige Umbwe.',
    },
    {
      heading: 'Mapa de Rutas del Kilimanjaro y Distancias de Trekking',
      body: 'Las distancias totales de trekking varían según la ruta.',
      table: {columns: ['Ruta', 'Distancia Total'], rows: [['Lemosho', '70 km'], ['Machame', '62 km'], ['Marangu', '64 km'], ['Northern Circuit', '96 km'], ['Rongai', '65 km']]},
    },
    {
      heading: 'Tasa de Éxito del Monte Kilimanjaro por Ruta',
      table: {columns: ['Ruta', 'Tasa de Éxito'], rows: [['Northern Circuit', '95%'], ['Lemosho', '90%'], ['Machame', '85%'], ['Rongai', '80%'], ['Marangu', '65%'], ['Umbwe', '50%']]},
    },
    {
      heading: 'Cómo Elegir tu Ruta del Kilimanjaro',
      body: "Para elegir entre las rutas del Monte Kilimanjaro, considera las capacidades de tu grupo, tu presupuesto, el tiempo disponible, la dificultad deseada, el punto de partida, tu motivación personal y la temporada en la que planeas escalar.",
    },
    {
      heading: '¿Por Qué Reservar tu Ruta del Kilimanjaro con Climbing Kilimanjaro Tanzania?',
      body: 'Elegir la ruta correcta es solo una parte de tu éxito. Reservar con un operador local de confianza y experimentado como Asili Climbing Kilimanjaro garantiza guías certificados, un trato justo para los porteadores y un enfoque centrado en la seguridad en cada ruta.',
    },
    {
      heading: 'Planifica Hoy Mismo tu Ruta Ideal del Kilimanjaro',
      body: 'Descubre desgloses detallados de todas las rutas del Kilimanjaro, ejemplos de itinerarios y consejos de expertos en Climbing Kilimanjaro Tanzania — tu recurso de confianza para escalar el Monte Kilimanjaro con seguridad y éxito.',
    },
  ],
  faqHeading: 'Preguntas Frecuentes sobre las Rutas del Kilimanjaro',
  faqs: [
    {question: '¿Qué ruta del Kilimanjaro tiene la tasa de éxito más alta?', answer: 'El Northern Circuit tiene la tasa de éxito más alta gracias a una excelente aclimatación.'},
    {question: '¿Cuántas rutas existen para escalar el Kilimanjaro?', answer: 'Existen siete rutas principales de escalada del Monte Kilimanjaro.'},
    {question: '¿Cuál es la mejor ruta para el Kilimanjaro?', answer: 'La Route Lemosho es la más recomendada por la experiencia general, la tasa de éxito y el paisaje.'},
    {question: '¿Cuál es la distancia de trekking del Kilimanjaro?', answer: 'Variable: de 50 a 90 km en total, según la ruta.'},
    {question: '¿Cuál es la tasa de éxito del Monte Kilimanjaro?', answer: 'En general, del 65 al 80%; según la ruta, desde el 50% (corta) hasta el 98% (larga).'},
  ],
}

const kilimanjaroGuideCostEs: GuideArticleEs = {
  slug: 'kilimanjaro-guide-cost',
  seoTitle: 'Costo de la Guía del Kilimanjaro | Guía Completa de Tarifas para Escalar el Monte Kilimanjaro',
  seoDescription: "Una guía completa de tarifas para escalar el Monte Kilimanjaro: costos por ruta, por paquete, qué está incluido y la relación entre el costo y la tasa de éxito en la cumbre.",
  heading: 'Costo de Escalar el Kilimanjaro en Tanzania',
  intro:
    "Escalar el Monte Kilimanjaro cuesta entre 1.680 $ y más de 7.000 $ por persona, según el operador y el nivel de servicio. Los viajes económicos van de aproximadamente 1.680 $ a 2.500 $, los tours de gama media de 2.500 $ a 4.000 $, y las escaladas de lujo pueden costar 4.000 $ o más, con las opciones de gama alta que pueden llegar a superar los 7.000 $. El costo total varía según factores como la ruta, el número de días, el tamaño del grupo y los servicios incluidos, y una parte importante del precio se destina a las tasas obligatorias del parque.",
  sections: [
    {
      heading: 'Costo de la Guía del Kilimanjaro: Guía Completa de Tarifas para Escalar el Monte Kilimanjaro',
      body: "Comprender el costo de la guía del Kilimanjaro es esencial para planificar tu expedición soñada a la cumbre más alta de África. El precio total de escalar el Monte Kilimanjaro depende de múltiples factores, entre ellos la elección de la ruta, el número de días, el nivel de comodidad, el tamaño del grupo y la calidad de la empresa de guías.",
    },
    {heading: 'Factores que Influyen en el Costo', body: "Nivel de servicio: los paquetes premium incluyen más servicios, mejor comida y equipo de mayor calidad, mientras que las opciones económicas se centran en lo esencial."},
    {heading: 'Costos Adicionales a Considerar', body: 'Propinas: dar propina a los guías, porteadores y cocineros es una costumbre y puede variar entre 150 $ y 300 $ por persona. Vuelos: los billetes aéreos internacionales y nacionales normalmente no están incluidos en los paquetes del tour.'},
    {
      heading: 'Paquetes del Monte Kilimanjaro',
      body: "Escala la cumbre más alta de África en una aventura privada y personalizada guiada por guías locales experimentados. Todos los paquetes incluyen fechas de salida flexibles y tu propio equipo privado de guías, porteadores y cocineros. Las comidas se sirven en tu tienda comedor privada. Los senderos y campamentos se comparten con otros excursionistas.",
    },
    {heading: 'Route Marangu (5 días / 4 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '2.008 $'], ['2 excursionistas compartiendo', '1.783 $'], ['3-4 excursionistas compartiendo', '1.678 $']]}},
    {heading: 'Route Marangu (6 días / 5 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '3.588 $'], ['2 excursionistas compartiendo', '2.938 $'], ['3-4 excursionistas compartiendo', '2.668 $']]}},
    {heading: 'Route Machame o Umbwe (6 días / 5 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '2.328 $'], ['2 excursionistas compartiendo', '2.078 $'], ['3-4 excursionistas compartiendo', '1.948 $']]}},
    {heading: 'Route Machame o Umbwe (7 días / 6 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '2.608 $'], ['2 excursionistas compartiendo', '2.348 $'], ['3-4 excursionistas compartiendo', '2.203 $']]}},
    {heading: 'Route Shira, Lemosho o Rongai (6 días / 5 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '2.648 $'], ['2 excursionistas compartiendo', '2.243 $'], ['3-4 excursionistas compartiendo', '2.063 $']]}},
    {heading: 'Route Shira, Lemosho o Rongai (7 días / 6 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '2.938 $'], ['2 excursionistas compartiendo', '2.513 $'], ['3-4 excursionistas compartiendo', '2.313 $']]}},
    {heading: 'Route Shira, Lemosho o Rongai (8 días / 7 noches de trekking + 2 noches de hotel)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '3.228 $'], ['2 excursionistas compartiendo', '2.773 $'], ['3-4 excursionistas compartiendo', '2.568 $']]}},
    {heading: 'Route Northern Circuit (8 días / 7 noches + alquiler de baño portátil)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '3.588 $'], ['2 excursionistas compartiendo', '2.938 $'], ['3-4 excursionistas compartiendo', '2.668 $']]}},
    {heading: 'Route Northern Circuit (9 días / 8 noches + alquiler de baño portátil)', table: {columns: ['Tipo de Excursionista', 'Precio'], rows: [['1 excursionista solo', '3.918 $'], ['2 excursionistas compartiendo', '3.228 $'], ['3-4 excursionistas compartiendo', '2.683 $']]}},
    {
      heading: 'Costo del Trekking del Kilimanjaro en Comparación con la Tasa de Éxito',
      body: "Los costos más altos generalmente se correlacionan con tasas de éxito en la cumbre más altas en el Kilimanjaro, ya que los treks más caros utilizan rutas más largas que permiten una mejor aclimatación, incluyen mejores medidas de seguridad y recurren a operadores de mayor calidad. Los treks económicos son más baratos pero tienen una tasa de éxito más baja debido a duraciones más cortas y menos precauciones de seguridad, y pueden recortar gastos en el bienestar del equipo y el equipo técnico. Para una escalada exitosa, se recomienda elegir una ruta de al menos siete días y un operador de confianza.",
    },
    {
      heading: 'Mayor Costo, Mayor Tasa de Éxito',
      body: "Rutas: las rutas más largas como Lemosho o Northern Circuit ofrecen tasas de éxito más altas (hasta el 98-99%) porque dan más tiempo para que el cuerpo se aclimate a la altitud. Costo: estas rutas suelen costar más (2.000 $ a 4.550 $ o más) debido a la mayor duración y la necesidad de más apoyo logístico. Calidad del operador: los operadores de confianza cobran más, pero ofrecen medidas de seguridad esenciales como equipo adecuado, buena comida, salarios justos para los porteadores y guías experimentados.",
    },
    {
      heading: 'Menor Costo, Menor Tasa de Éxito',
      body: "Rutas: las rutas más cortas como Marangu (5-6 días) son más baratas pero tienen tasas de éxito más bajas (65-70%) porque no dejan suficiente tiempo para la aclimatación. Costo: los treks económicos pueden costar tan poco como 1.500 $ a 2.500 $, pero esto a menudo se debe a recortes en aspectos cruciales. Calidad del operador: los operadores económicos pueden pagar mal a los porteadores, ofrecer comida inadecuada y utilizar equipo de baja calidad, lo que puede comprometer la seguridad y la moral del equipo.",
    },
    {
      heading: 'Precio del Trekking del Kilimanjaro: ¿Qué Debe Incluir?',
      body: "Un paquete de confianza siempre debe incluir: todas las tasas del parque, rescates gubernamentales y asistencia de emergencia, alojamiento en la montaña, traslados desde el aeropuerto, guías profesionales, comidas y agua potable, bombonas de oxígeno y primeros auxilios. Evita los operadores que ocultan estos costos esenciales.",
    },
  ],
}

const kilimanjaroClimbingGuideEs: GuideArticleEs = {
  slug: 'kilimanjaro-climbing-guide',
  seoTitle: 'Guía de Escalada del Kilimanjaro | Consejos Esenciales para Escalar el Monte Kilimanjaro',
  seoDescription: "Consejos esenciales para escalar el Monte Kilimanjaro: entrenamiento, aclimatación, temporadas, seguridad, oxígeno, botiquines médicos y qué esperar en la montaña.",
  heading: 'Consejos Esenciales para Escalar el Monte Kilimanjaro',
  heroImage: {src: '/images/articles/guide-hero.webp', alt: 'Un escalador frente al cartel de la cumbre Uhuru Peak'},
  intro:
    "El Kilimanjaro, que se eleva a 5.895 metros sobre el nivel del mar, es la montaña independiente más alta del mundo y el «Techo de África». Al ser uno de los destinos de viaje más codiciados del continente, el Monte Kilimanjaro recibe a más de 40.000 visitantes cada año. Este impresionante trekking no requiere ninguna habilidad técnica de escalada, lo que lo hace accesible para cualquier persona con un buen nivel de condición física media. Esta guía está pensada para ayudar a los escaladores a preparar su aventura única en la vida. Nuestras recomendaciones se basan en nuestra amplia experiencia — en Asili Climbing Kilimanjaro, hemos organizado con éxito treks para miles de escaladores.",
  sections: [
    {heading: 'Datos que Debes Conocer Antes de tu Trekking al Kilimanjaro', body: "La cumbre del Monte Kilimanjaro, Uhuru Peak, se eleva a 5.895 m — el punto más alto de África y la montaña independiente más alta del mundo."},
    {heading: 'Prepararse y Entrenar para el Kilimanjaro'},
    {
      heading: '¿Cómo Debería Entrenar para una Escalada al Monte Kilimanjaro?',
      body: "Mantener un buen nivel de condición física es esencial para escalar el Kilimanjaro. Sin embargo, no necesitas ser un atleta para llegar a la cumbre. Un buen nivel de condición física media es suficiente. Para evaluar tu preparación, comprueba si puedes caminar cómodamente entre 8 y 10 km. Si es así, estás lo bastante en forma para escalar el Monte Kilimanjaro. Correr es un excelente ejercicio de preparación — intenta trotar entre 4 y 5 km con seguridad. Nadar es otro gran complemento para tu entrenamiento, ya que fortalece la resistencia cardiovascular.",
    },
    {
      heading: '¿Cuándo son las Temporadas de Lluvias y Secas en Tanzania?',
      body: "Tanzania tiene dos temporadas de lluvias y dos temporadas secas. La temporada corta de lluvias comienza a principios de noviembre y continúa hasta finales de diciembre, seguida de una temporada seca que dura hasta mediados de marzo. La temporada larga de lluvias comienza a mediados de marzo y termina a mediados de junio. Para escalar el Kilimanjaro durante la temporada de lluvias, considera las laderas norte — esta zona recibe considerablemente menos precipitación. Las rutas recomendadas incluyen Rongai, Northern Circuit y Marangu. De junio a octubre, África Oriental tiene noches frías, especialmente en altitudes elevadas.",
    },
    {heading: 'Otra Información de Trekking'},
    {heading: 'Lista de Equipaje para el Kilimanjaro', body: "Una guía gratuita de equipaje para el Kilimanjaro con el material esencial y las recomendaciones de los expertos de Asili Climbing Kilimanjaro."},
    {heading: '¿Estás Planeando Escalar el Kilimanjaro?', body: 'Estamos aquí para darte respuestas claras y consejos de expertos — contáctanos con cualquier pregunta y da el primer paso con confianza.'},
  ],
  faqHeading: 'Preguntas sobre la Seguridad en el Kilimanjaro',
  faqs: [
    {
      question: '¿Puedes recomendar un seguro de viaje confiable?',
      answer: "Asili Climbing Kilimanjaro recomienda Global Rescue para una cobertura de seguro de viaje confiable. Asegúrate de que tu póliza incluya tres elementos clave: cobertura para trekking en alta montaña hasta 6.000 metros, evacuación en helicóptero y servicios médicos completos.",
    },
    {
      question: '¿Tienes consejos para una mejor aclimatación al escalar el Kilimanjaro?',
      answer: "Para aclimatarte bien y llegar a la cumbre con éxito, te recomendamos: caminar despacio (tu cuerpo necesita tiempo para adaptarse a niveles más bajos de oxígeno, y un ritmo moderado le ayuda a producir más glóbulos rojos); beber de 3 a 4 litros de agua al día; unirte a nuestras caminatas diarias de aclimatación a mayor altitud y de regreso (generalmente no más de 2 horas); y, si tienes tiempo, considerar escalar el Monte Meru antes de tu viaje al Kilimanjaro. Elegir rutas de siete días o más también le da a tu cuerpo más tiempo para adaptarse, mejorando tus posibilidades de llegar a la cumbre.",
    },
    {question: '¿Cuál es la mejor ruta para la aclimatación?', answer: 'Para aclimatarte mejor en el Kilimanjaro, las mejores rutas son Lemosho, Machame y Rongai — u otros itinerarios de siete días o más.'},
    {
      question: '¿Cuántos días adicionales de aclimatación debería tomar?',
      answer: "En la Route Machame de siete días, no necesitarás ningún día adicional de aclimatación. Rongai y Lemosho son opciones igualmente buenas. Sin embargo, si crees que no estás en muy buena forma física, puedes añadir uno o dos días adicionales de descanso.",
    },
    {
      question: '¿Se necesitan sistemas de oxígeno para escalar el Kilimanjaro?',
      answer: "En la cumbre del Kilimanjaro, el nivel de oxígeno en el aire es aproximadamente la mitad del que hay al nivel del mar. La mayoría de los escaladores pueden llegar a Uhuru Peak sin oxígeno adicional, pero para mayor seguridad, siempre llevamos numerosas bombonas de oxígeno en nuestras expediciones, y el costo está incluido en el precio del tour.",
    },
    {
      question: '¿Debo llevar un botiquín médico?',
      answer: "Durante las expediciones al Kilimanjaro, nuestros equipos llevan botiquines médicos completos — botiquines tácticos más pequeños durante las caminatas para lesiones, rasguños o torceduras, y botiquines de campamento más grandes con medicamentos para problemas comunes como náuseas, dolores de cabeza, vómitos y trastornos estomacales. Si tomas algún medicamento recetado, es mejor que lo lleves contigo en tu viaje a Tanzania.",
    },
    {
      question: '¿Cuál es la tasa de mortalidad en el Kilimanjaro?',
      answer: "En comparación con otras montañas, el Kilimanjaro tiene una tasa de mortalidad baja en sus siete rutas. De las aproximadamente 50.000 personas que escalan el Monte Kilimanjaro cada año, entre 3 y 5 pierden la vida, principalmente por problemas cerebrales y pulmonares relacionados con la altitud o ataques cardíacos por no respetar la aclimatación. La tasa de mortalidad entre los porteadores del Kilimanjaro es notablemente más alta, en gran parte debido a los operadores ultraeconómicos que proporcionan equipo inadecuado. Elige siempre una empresa registrada en el KPAP para ayudar a garantizar un trato justo a los porteadores.",
    },
    {question: '¿Por qué la cumbre del Kilimanjaro se llama Uhuru Peak?', answer: '«Uhuru» significa «libertad» en suajili. La cumbre más alta del Kilimanjaro fue nombrada Uhuru Peak para celebrar la independencia de Tanzania de Gran Bretaña en 1961.'},
    {
      question: '¿Puedo hacer un safari después de escalar el Kilimanjaro?',
      answer: "Sí — Tanzania tiene destinos famosos para cualquier tipo de aventura africana, siendo los más populares el Parque Nacional Serengeti y el Cráter de Ngorongoro. Es una excelente idea planificar un safari antes o después de la escalada.",
    },
  ],
}

const planATripToClimbKilimanjaroEs: GuideArticleEs = {
  slug: 'information-on-how-to-plan-a-trip-to-climb-mount-kilimanjaro-in-tanzania',
  seoTitle: 'Cómo Planificar un Viaje para Escalar el Monte Kilimanjaro | Guía de Referencia Completa',
  seoDescription: "Todo lo que necesitas para planificar un viaje al Kilimanjaro: campamentos de montaña, tasas del parque, glaciares, desnivel por ruta, riesgos de altitud y cómo llegar.",
  heading: 'Información sobre Cómo Planificar un Viaje para Escalar el Monte Kilimanjaro en Tanzania',
  intro:
    "Planificar un viaje para escalar el Monte Kilimanjaro implica mucho más que elegir una fecha. Esta guía de referencia cubre lo esencial: dónde se encuentra la montaña, cuánto cuesta en tasas oficiales del parque, los campamentos donde dormirás en el camino, los glaciares que verás cerca de la cumbre, cuánto desnivel ganarás en cada ruta, y los riesgos reales que implica — para que puedas planificar con confianza y escalar con Asili Climbing Kilimanjaro.",
  sections: [
    {
      heading: '¿Dónde se Encuentra el Monte Kilimanjaro?',
      body: 'El Monte Kilimanjaro se encuentra en el norte de Tanzania, cerca de la frontera con Kenia, dentro del Parque Nacional Kilimanjaro. Las ciudades más cercanas son Moshi y Arusha, ambas atendidas por el Aeropuerto Internacional del Kilimanjaro (JRO).',
    },
    {
      heading: 'Desnivel del Monte Kilimanjaro',
      body: "El Monte Kilimanjaro es la montaña más alta de África y la montaña independiente más alta del mundo, con un desnivel de aproximadamente 4.900 metros desde su base hasta la cumbre. La cumbre de la montaña, Uhuru Peak, se eleva a 5.895 metros sobre el nivel del mar. El desnivel es considerable y exigente, lo que hace que la aclimatación sea crucial para que los escaladores eviten el mal de altura.",
      table: {
        columns: ['Ruta', 'Altitud de Partida'],
        rows: [
          ['Northern Circuit', '2.100 m (6.890 pies) en Lemosho Gate'],
          ['Route Lemosho', '2.100 m (6.890 pies) en Lemosho Gate'],
          ['Route Shira', '3.414 m (11.200 pies) en Morum Barrier'],
          ['Route Machame', '1.640 m (5.380 pies) en Machame Gate'],
          ['Route Marangu', '1.843 m (6.047 pies) en Marangu Gate'],
          ['Route Rongai', '1.950 m (6.398 pies) en Rongai Gate'],
          ['Route Umbwe', '1.800 m (5.906 pies) en Umbwe Gate'],
        ],
      },
    },
    {
      heading: 'Campamentos de Montaña en el Kilimanjaro',
      body: 'Según tu ruta, pasarás la noche en una serie de refugios o campamentos con tiendas a lo largo de la montaña. Los campamentos comunes incluyen Mandara Hut, Horombo Hut, Kibo Hut, Machame Camp, Barafu Hut Camp, Lava Tower Camp, Barranco Hut Camp, Karanga Hut Camp, Mweka Camp, Shira 1 & 2 Camps, School Hut Camp y Umbwe Cave Camp, entre otros. Tu guía y tu equipo de porteadores instalan el campamento antes de tu llegada cada día.',
    },
    {
      heading: 'Los Glaciares en Retirada del Monte Kilimanjaro',
      body: "El Monte Kilimanjaro es famoso por sus cuatro glaciares emblemáticos: el Northern Ice Field, el Eastern Ice Field, el Southern Ice Field y el glaciar Furtwängler. Estos glaciares existen cerca del ecuador solo debido a la gran altitud de la montaña — pero se han estado retirando rápidamente debido al cambio climático. Solo el glaciar Furtwängler ha perdido más del 80% de su masa desde principios del siglo XX, y las estimaciones actuales sugieren que los campos de hielo del Kilimanjaro podrían desaparecer por completo dentro de unas pocas décadas.",
    },
    {
      heading: 'Tasas del Parque Nacional Kilimanjaro',
      body: "Las tasas del Parque Nacional Kilimanjaro son costos obligatorios para los visitantes que desean explorar el parque y escalar la montaña. Estas tasas incluyen la entrada al parque, el campamento, las tasas de rescate y los servicios de guías y porteadores, y generalmente varían entre 2.000 $ y 6.000 $ por persona según la ruta y la duración.",
      table: {
        columns: ['Tipo de Tasa', 'Costo'],
        rows: [
          ['Tasa de rescate', '20 $ (pago único)'],
          ['Tasa de conservación', '70 $ por persona al día'],
          ['Tasa de campamento', '50 $ por persona por noche'],
          ['Tasa de refugio (Route Marangu)', '60 $ por persona por noche'],
          ['Tasa de cráter', '100 $ por persona por noche'],
        ],
      },
    },
    {
      heading: 'Muertes en el Monte Kilimanjaro',
      body: "A pesar de su popularidad, escalar el Kilimanjaro conlleva un riesgo real: se estima que entre 3 y 7 escaladores mueren cada año, principalmente por mal de altura (mal agudo de montaña, que puede evolucionar a HAPE o HACE), hipotermia y caídas. La «zona de la muerte» se refiere a las altitudes por encima de aproximadamente 8.000 pies, donde la reducción de oxígeno hace que la supervivencia sea cada vez más difícil sin una aclimatación adecuada. Elegir una ruta más larga, un operador de confianza y seguir el ritmo de tu guía reduce drásticamente este riesgo.",
    },
    {heading: '¿Dónde Está el Monte Kilimanjaro?', body: 'Explora la ubicación de la montaña en el mapa a continuación.'},
  ],
}

const kilimanjaroClimbingEs: GuideArticleEs = {
  slug: 'kilimanjaro-climbing',
  seoTitle: 'Escalar el Monte Kilimanjaro | Aventuras a Medida',
  seoDescription: "Aventuras de escalada al Kilimanjaro a medida. Descubre nuestras rutas, paquetes y todo lo que necesitas saber antes de escalar la cumbre más alta de África.",
  heading: 'Escalar el Monte Kilimanjaro',
  heroImage: {src: '/images/articles/climbing-hero.jpg', alt: 'Excursionista en el sendero del Kilimanjaro'},
  intro:
    "El Kilimanjaro, que se eleva a 5.895 metros, es la montaña independiente más alta del mundo, lo que le da el título de «Techo de África». Cada año, miles de aventureros recorren sus pintorescos senderos, descubriendo paisajes variados y vistas impresionantes. No se requiere ninguna habilidad técnica de escalada — solo buena salud, determinación y el equipo adecuado para guiarte. En Asili Climbing Kilimanjaro, diseñamos aventuras a medida para la escalada de tus sueños al Kilimanjaro.",
  sections: [
    {
      heading: 'Rutas de Escalada del Kilimanjaro',
      body:
        "Route Machame: conocida como la Whiskey Route, Machame es la ruta más popular del Kilimanjaro, que ofrece paisajes impresionantes y un terreno variado. Aunque exigente, con senderos empinados y campamentos con tiendas, ofrece una excelente aclimatación para los escaladores que buscan un trek más corto pero gratificante.\nRoute Lemosho: una de las rutas más pintorescas del Kilimanjaro, Lemosho comienza en el aislado Londorossi Gate, atravesando la espléndida meseta de Shira. Esta ruta ofrece una escalada tranquila con vistas espectaculares, una rica fauna y un ascenso gradual para una experiencia cómoda.\nRoute Rongai: el único sendero norte del Kilimanjaro, Rongai es menos concurrido y más suave, lo que la convierte en una excelente opción para quienes prefieren una escalada tranquila y constante. Esta ruta es ideal durante la temporada de lluvias, ya que recibe menos precipitación.\nRoute Northern Circuit: la ruta más larga y pintoresca, el Northern Circuit ofrece la mejor aclimatación al rodear gradualmente el Kilimanjaro. Con vistas panorámicas y una alta tasa de éxito, esta ruta ofrece una experiencia de trekking tranquila e inmersiva.",
    },
    {
      heading: 'Paquetes de Escalada del Kilimanjaro',
      body:
        "Elige entre nuestros paquetes de escalada al Kilimanjaro cuidadosamente diseñados, cada uno pensado para ofrecer la mejor experiencia según tus preferencias, tu nivel de condición física y la ruta deseada. Ya sea que busques un ascenso rápido o un trek panorámico y prolongado, tenemos el itinerario perfecto para ti.\nRoute Lemosho de 8 Días: con ocho días de viaje, tu trek al Kilimanjaro por la Route Lemosho dura más que las alternativas, permitiendo una excelente aclimatación.\nRoute Machame de 7 Días: la popular Route Machame con un tiempo total de viaje de siete días, dándote aún más tiempo de aclimatación.\nRoute Marangu de 6 Días: un viaje de seis días para ascender a la cumbre más alta de África por la popular Route Marangu, con alojamiento en refugios y una variedad de paisajes.\nRoute Umbwe de 6 Días: reconocida por su ascenso empinado y exigente y su espléndido sendero menos transitado.\nNorthern Circuit de 9 Días: la ruta más nueva y más larga, que ofrece vistas de 360 grados y las tasas de éxito más altas para llegar a la cumbre.\nRoute Rongai de 7 Días: abordada desde el norte, esta ruta ofrece una perspectiva única del Kilimanjaro y es ideal para quienes buscan un trek más tranquilo.",
    },
    {
      heading: 'Qué Saber Antes de Escalar el Kilimanjaro',
      body:
        "Obtén toda la información esencial para prepararte para tu escalada — desde rutas hasta consejos de seguridad, garantizando un ascenso fluido y exitoso.\nConsideraciones sobre la temperatura: las temperaturas diurnas oscilan entre 20°C y 27°C en altitudes bajas, pero descienden por debajo de cero en altitudes más altas, especialmente de noche. La ropa por capas es esencial.\nVegetación y paisajes: las temporadas secas ofrecen vistas más despejadas, flores silvestres en flor y bosques exuberantes a lo largo de los senderos. Las temporadas más húmedas pueden provocar condiciones de niebla y una densa cobertura de nubes.\nNiveles de afluencia: las temporadas altas (enero-febrero y julio-septiembre) atraen a más escaladores. Las temporadas intermedias (finales de marzo-mayo y principios de noviembre-diciembre) ofrecen experiencias más tranquilas.\nPreferencias personales y objetivos: los escaladores deben considerar las condiciones climáticas, sus preferencias de temperatura, los niveles de afluencia y sus compromisos personales al planificar su ascenso.",
    },
    {
      heading: '¿Listo para Aceptar el Desafío del Kilimanjaro?',
      body: 'Tu viaje hacia el Techo de África comienza aquí. Ya sea que aspires a la aventura de tu vida o quieras superar tus límites hasta la cumbre, estamos aquí para guiarte en cada paso del camino.',
    },
  ],
  faqHeading: 'Tus Preguntas y Nuestras Respuestas',
  faqs: [
    {
      question: '¿Qué rutas están disponibles para el Kilimanjaro?',
      answer:
        'El Monte Kilimanjaro ofrece varias rutas adecuadas para escaladores con distintos niveles de habilidad, preferencias y estilos de trekking. En Asili Climbing Kilimanjaro, nos especializamos en las cuatro rutas más populares: Rongai, Lemosho, Northern Circuit y Machame. Nuestras escaladas guiadas garantizan seguridad, una aclimatación adecuada y un viaje inolvidable hasta la cumbre.',
    },
    {question: '¿Qué ruta del Kilimanjaro es la menos concurrida?', answer: 'La Northern Circuit Route es la menos concurrida, y ofrece una experiencia de trekking tranquila y aislada.'},
    {question: '¿Cuál es la ruta más fácil para escalar el Kilimanjaro?', answer: 'La Rongai Route se considera la más fácil gracias a sus pendientes graduales y su ascenso directo.'},
    {question: '¿Qué ruta del Kilimanjaro es la más pintoresca?', answer: 'La Lemosho Route suele considerarse la más pintoresca, con paisajes impresionantes, ecosistemas variados y vistas panorámicas.'},
    {
      question: '¿Cuánto cuesta escalar el Kilimanjaro?',
      answer:
        'El costo de escalar el Kilimanjaro varía entre 2.500 $ y 4.000 $, según la elección de la ruta, la duración, el tamaño del grupo, el nivel de servicio y los servicios incluidos. En Asili Climbing Kilimanjaro, garantizamos guías bien capacitados, altos estándares de seguridad y una experiencia general excepcional.',
    },
    {question: '¿Cuánto tiempo se tarda en escalar el Monte Kilimanjaro?', answer: 'La escalada generalmente toma entre 6 y 9 días, según la ruta elegida. Un itinerario más largo permite una mejor aclimatación, aumentando las posibilidades de una experiencia de cumbre exitosa y placentera.'},
    {
      question: '¿Pueden los principiantes escalar el Monte Kilimanjaro?',
      answer:
        '¡Sí! Aunque no se requiere ninguna habilidad técnica de escalada, los principiantes deben realizar un entrenamiento físico adecuado antes de intentar el ascenso. Nuestros guías experimentados aseguran que los escaladores primerizos reciban el apoyo necesario durante todo el viaje.',
    },
    {question: '¿Cuál es el mejor momento para escalar el Monte Kilimanjaro?', answer: 'Las mejores temporadas para escalar son los meses secos: de enero a marzo y de junio a octubre, que ofrecen las mejores condiciones climáticas y cielos más despejados.'},
    {
      question: 'Consejos importantes para el éxito de tu escalada',
      answer:
        'Ve despacio — un ritmo constante reduce el riesgo de mal de altura. Hidrátate — bebe mucha agua. Consigue el equipo adecuado — capas apropiadas, botas resistentes y equipo de calidad. Prepárate física y mentalmente. Disfruta y haz vínculos — relacionarte con otros escaladores hace que el viaje sea más gratificante.',
    },
    {question: '¿Se necesita un guía para escalar el Kilimanjaro?', answer: '¡Sí! No está permitido escalar el Kilimanjaro sin un guía autorizado.'},
    {question: '¿Por qué necesito un guía?', answer: 'Los guías aportan su experiencia, monitorean tu salud, garantizan tu seguridad y te ayudan a moverte por el exigente terreno del Kilimanjaro.'},
    {question: '¿Pueden los escaladores experimentados prescindir de un guía?', answer: 'Incluso los escaladores experimentados deben ir acompañados de un guía. La gran altitud y las condiciones impredecibles hacen indispensable el acompañamiento profesional.'},
    {question: '¿Cómo mejoran la seguridad los guías?', answer: 'Los guías monitorean la aclimatación, brindan primeros auxilios, evalúan las condiciones climáticas y toman decisiones críticas para el éxito de la escalada.'},
    {
      question: '¿Cuál es el nivel de dificultad para escalar el Monte Kilimanjaro?',
      answer:
        'Escalar el Monte Kilimanjaro es una aventura exigente pero gratificante. La principal dificultad proviene de la gran altitud y el terreno variado. Con una buena preparación y una guía experta, escaladores de diferentes niveles de experiencia pueden llegar a la cumbre con éxito.',
    },
    {
      question: '¿Cómo se duerme en el Kilimanjaro?',
      answer:
        'Durante tu trek al Kilimanjaro con nosotros, te alojarás en tiendas de alta calidad, resistentes a la intemperie y diseñadas para la comodidad en condiciones extremas, con tiendas espaciosas, esterillas aislantes y sacos de dormir cálidos.',
    },
    {
      question: '¿Se necesita oxígeno para escalar el Kilimanjaro?',
      answer: "La mayoría de los escaladores no necesita oxígeno suplementario. La clave para un ascenso exitoso es una buena aclimatación. En raros casos de mal de altura grave, el oxígeno está disponible como medida de seguridad.",
    },
  ],
}

async function run() {
  await seedGuideArticleEs(kilimanjaroClimbingSeasonsEs)
  await seedGuideArticleEs(whatIsTheBestRouteUpKilimanjaroEs)
  await seedGuideArticleEs(kilimanjaroGuideCostEs)
  await seedGuideArticleEs(kilimanjaroClimbingGuideEs)
  await seedGuideArticleEs(planATripToClimbKilimanjaroEs)
  await seedGuideArticleEs(kilimanjaroClimbingEs)
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
