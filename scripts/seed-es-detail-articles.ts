/**
 * Phase 7 (Spanish): Spanish translation for the 13 detail articles in content/articles.ts.
 * Mirrors seed-it-detail-articles.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-detail-articles.ts --with-user-token
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
  image?: {src: string; alt: string}
}
interface DetailArticleEs {
  slug: string
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroImage: {src: string; alt: string}
  intro: string
  sections: SectionEs[]
}

function tableToDoc(table?: TableEs) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedDetailArticleEs(data: DetailArticleEs) {
  const enId = await findEnId(client, 'article', data.slug)
  if (!enId) {
    console.log(`SKIP ${data.slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    heading: data.heroTitle,
    heroBackgroundImage: await uploadImage(client, data.heroImage),
    intro: data.intro,
    sections: await Promise.all(
      data.sections.map(async (section) => ({
        _type: 'articleSection',
        _key: key(),
        heading: section.heading,
        ...(section.body ? {body: stringToPt(section.body)} : {}),
        ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
        ...(section.image ? {image: await uploadImage(client, section.image)} : {}),
      })),
    ),
  }
  const esId = await upsertTranslatedDoc(client, 'article', data.slug, 'es', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${data.slug}-es done (${esId})`)
}

const isClimbingKilimanjaroSafeEs: DetailArticleEs = {
  slug: 'is-climbing-kilimanjaro-safe',
  seoTitle: '¿Es Segura la Escalada del Kilimanjaro? | Asili Climbing Kilimanjaro',
  seoDescription: '¿Es seguro escalar el Monte Kilimanjaro? Descubre el mal de altura, las medidas de seguridad y cómo Asili Climbing Kilimanjaro garantiza la seguridad de cada excursionista.',
  heroTitle: '¿Es Segura la Escalada del Kilimanjaro?: Lo Que Todo Excursionista Debería Saber',
  heroImage: {src: '/images/articles/is-safe-hero.jpg', alt: 'Excursionistas escalando el Kilimanjaro al amanecer'},
  intro:
    "El Monte Kilimanjaro es una de las aventuras en alta montaña más accesibles y gratificantes del mundo. Aunque no requiere ninguna habilidad técnica de escalada, la seguridad en el Kilimanjaro no es algo que deba tomarse a la ligera. En Asili Climbing Kilimanjaro, la seguridad no es solo una prioridad — es la base de todo lo que hacemos. Ya seas un excursionista primerizo o un aventurero experimentado, esta guía te ayudará a entender cómo escalar el Kilimanjaro de forma segura y con confianza.",
  sections: [
    {
      heading: '¿Es Seguro Escalar el Kilimanjaro?',
      body: "Sí — con la preparación adecuada, guías experimentados y un operador turístico responsable, escalar el Kilimanjaro es seguro para la mayoría de las personas sanas. Sin embargo, se trata de un trekking en alta montaña, no de una simple caminata larga. Esto significa que el mal de altura, el clima extremo y el esfuerzo físico influyen todos en los riesgos. Elegir un operador profesional centrado en la seguridad como Asili es esencial para reducir esos riesgos.",
    },
    {
      heading: '🧭 Principales Medidas de Seguridad que Tomamos en Asili Climbing Kilimanjaro',
      body: "Vamos más allá de lo básico para mantenerte a salvo durante toda tu escalada:\n1. Guías de montaña certificados y experimentados — Certificados como Wilderness First Responder (WFR), formados en atención médica y evacuación en alta montaña, expertos locales que conocen el terreno de la montaña y los patrones climáticos.\n2. Monitoreo diario de la salud — Controles de salud dos veces al día: saturación de oxígeno (SpO2), frecuencia cardíaca y síntomas generales. Controles del mal agudo de montaña (MAM) registrados y revisados. Tú decides tu ritmo — nosotros nos adaptamos a tus necesidades.\n3. Oxígeno de emergencia y oxímetros — Se transportan en cada trekking por encima de los 3.000 metros. Oxígeno portátil y oxímetros de pulso para una respuesta en tiempo real a la altitud. Protocolos de descenso inmediato si es necesario.\n4. Planes y apoyo de evacuación — Respuesta de emergencia las 24 horas, los 7 días de la semana. Coordinación con el Parque Nacional del Kilimanjaro y los equipos de rescate locales. Descenso en vehículo privado o camilla disponible cuando sea necesario.",
    },
    {
      heading: '⛰️ Comprender los Riesgos del Kilimanjaro',
      body: "Aunque miles de personas alcanzan la cumbre de forma segura cada año, conocer los riesgos te ayuda a escalar con más inteligencia:\n🧠 Mal de altura — El MAM puede afectar a cualquiera, independientemente de la edad o la condición física. Síntomas comunes: dolor de cabeza, náuseas, mareos, fatiga. Las formas graves (HAPE/HACE) son raras pero peligrosas. Consejo de prevención: elige itinerarios más largos (7-9 días) como la route Lemosho o Northern Circuit para una mejor aclimatación.\n🌧️ Clima y exposición — El clima del Kilimanjaro cambia rápidamente: sol intenso, lluvia, viento y noches heladas. Vestirse en capas y llevar el equipo adecuado es esencial para mantenerte seguro y cómodo.\n🥾 Esfuerzo físico — Caminata constante durante varios días. No hay escalada técnica, pero el desnivel puede ser físicamente exigente. Una buena base de condición física es útil, especialmente para el día de la cumbre.",
    },
    {
      heading: '💡 Cómo Mantenerte Seguro Mientras Escalas el Kilimanjaro',
      body: "Esto es lo que puedes hacer como escalador para mejorar tu seguridad:\n🕒 Tómate tu tiempo: no te apresures — « pole pole » (despacio despacio) es más que un dicho, es una regla de seguridad.\n💧 Hidrátate y come bien: tu cuerpo necesita combustible y agua en altitud.\n📋 Elige la ruta adecuada: opta por rutas más largas para permitir que tu cuerpo se adapte.\n🧳 Prepara bien tu equipaje: el equipo adecuado previene lesiones por frío y el agotamiento.\n🩺 Sé honesto sobre tus síntomas: informa a tu guía de inmediato si no te sientes bien.\n🧠 Prepárate mentalmente: una actitud positiva ayuda, especialmente durante el difícil tramo final hacia la cumbre.",
    },
    {
      heading: '🧍 Escaladores Solitarios y Seguridad',
      body: "Los escaladores solitarios cuentan con el pleno apoyo de su guía personal y su equipo. Aunque hagas el trekking solo, nunca te quedarás sin orientación, cuidado y apoyo de emergencia.",
    },
    {
      heading: '👨‍👩‍👧‍👦 ¿Es Seguro para Mujeres y Excursionistas de Mayor Edad?',
      body: "Sí. El Kilimanjaro es una montaña acogedora para las viajeras, los escaladores de mayor edad e incluso los adolescentes (edad mínima de 10 años permitida por las normas del parque). Nuestro equipo se asegura de que todos, sin importar la edad o el género, se sientan cómodos y seguros.",
    },
    {
      heading: '🔎 Elegir un Operador Seguro: Qué Buscar',
      body: "No todos los operadores en el Kilimanjaro son iguales. La seguridad siempre debe tener prioridad sobre el precio. Esto es lo que debería ofrecer un operador seguro y ético: guías licenciados y experimentados; planes de evacuación transparentes; trato justo a los porteadores (busca la afiliación KPAP); agua limpia, comidas nutritivas y buena higiene; proporciones responsables entre clientes y guías. Asili Climbing Kilimanjaro sigue cada una de estas prácticas de seguridad — y muchas más.",
    },
    {
      heading: '🗓️ ¿Cuál es el Período Más Seguro para Escalar el Kilimanjaro?',
      body: "Las dos ventanas climáticas más secas y estables son: de enero a marzo (más fresco, menos afluencia) y de junio a octubre (temporada seca y popular). Evita abril-mayo y noviembre, cuando las lluvias aumentan el riesgo de senderos resbaladizos y exposición.",
    },
    {
      heading: '📣 Las Palabras Finales de Nuestros Guías Expertos',
      body: "« Siempre decimos: 'La cumbre es opcional — la seguridad no.' El Kilimanjaro no es una carrera. Con el plan adecuado, el equipo adecuado y el respeto por la montaña, puedes vivir una aventura segura e inolvidable. » — Guía Daudi, líder de cumbre en 158 ocasiones en Asili",
    },
    {
      heading: '🎒 ¿Listo para Escalar de Forma Segura con Asili?',
      body: "👉 Con una planificación experta, una orientación honesta y un equipo de seguridad dedicado a tu lado, tu escalada del Kilimanjaro puede ser la aventura de tu vida — realizada con total seguridad. Contacta con Asili Climbing Kilimanjaro para saber más o comenzar a planificar.",
    },
  ],
}

const gettingToKilimanjaroEs: DetailArticleEs = {
  slug: 'getting-to-kilimanjaro',
  seoTitle: 'Cómo Llegar al Kilimanjaro | Guía de Viaje al Pico Más Alto de Tanzania',
  seoDescription: 'Todo lo que necesitas saber para llegar al Monte Kilimanjaro: vuelos, aeropuertos, visados y lista de verificación antes de la llegada.',
  heroTitle: 'Cómo Llegar al Kilimanjaro: Tu Guía de Viaje al Pico Más Alto de Tanzania',
  heroImage: {src: '/images/articles/getting-to-hero.jpg', alt: 'Avión de KLM volando bajo un cielo azul'},
  intro:
    "Antes de comenzar tu trekking hacia el Techo de África, primero necesitas llegar hasta allí — y entender cómo llegar al Monte Kilimanjaro es una parte importante de tu planificación. Ya vengas de Estados Unidos, Europa, Asia o cualquier otro lugar del mundo, esta guía te ayudará a navegar el viaje sin contratiempos. Esto es todo lo que necesitas saber para llegar al Monte Kilimanjaro.",
  sections: [
    {
      heading: '🌍 ¿Dónde Está el Monte Kilimanjaro?',
      body: "El Monte Kilimanjaro se encuentra en el norte de Tanzania, cerca de la frontera con Kenia. La ciudad importante más cercana es Moshi, con Arusha como otra base cercana, especialmente si combinas tu escalada con un safari. La mayoría de los trekkings comienzan con un traslado desde una de estas ciudades hacia las distintas puertas de la montaña.",
    },
    {
      heading: '✈️ El Mejor Aeropuerto para las Escaladas del Kilimanjaro',
      body: "El Aeropuerto Internacional del Kilimanjaro (JRO) es el principal aeropuerto para los escaladores. Situado a medio camino entre Arusha y Moshi, el JRO está a tan solo 45-60 minutos en coche de ambas ciudades. Código IATA: JRO. Nombre completo: Aeropuerto Internacional del Kilimanjaro. Traslados: la mayoría de los operadores turísticos ofrecen recogida en el aeropuerto.\nVuelos directos al JRO: puedes volar desde grandes ciudades como Ámsterdam (KLM Royal Dutch Airlines), Doha (Qatar Airways), Estambul (Turkish Airlines), Adís Abeba (Ethiopian Airlines), Nairobi (Kenya Airways) y Dar es Salaam (conexiones locales). Si vuelas desde Estados Unidos, el Reino Unido, Canadá o Australia, normalmente tendrás una escala en Europa u Oriente Medio antes de llegar a Tanzania.",
    },
    {
      heading: '🛬 Aeropuertos Alternativos',
      body: "Si los vuelos al JRO son limitados o costosos, aquí tienes dos alternativas:\n1. Aeropuerto Internacional Julius Nyerere (DAR) – Dar es Salaam: el aeropuerto internacional más grande de Tanzania. Requiere un vuelo doméstico al Kilimanjaro o un trayecto de más de 10 horas en coche. Aerolíneas domésticas: Air Tanzania, Precision Air y Coastal Aviation.\n2. Aeropuerto Internacional Jomo Kenyatta (NBO) – Nairobi, Kenia: un centro de conexiones habitual con más vuelos internacionales. Toma un breve vuelo de conexión al JRO (1 hora) o conduce cruzando la frontera (ten en cuenta los requisitos de visado). Se recomienda volar en lugar de viajar por tierra por el tiempo y la comodidad.",
    },
    {
      heading: '🚌 Transporte Terrestre hacia el Kilimanjaro',
      body: "Si ya estás en África Oriental, puedes llegar al Kilimanjaro en autobús o furgoneta desde Nairobi hasta Arusha o Moshi (aproximadamente 6-8 horas), o mediante traslados privados o taxis organizados a través de tu agencia de trekking. Nota: puede requerirse un certificado de fiebre amarilla si transitas por Kenia.",
    },
    {
      heading: '🛂 Requisitos de Entrada: No Olvides tu Visado',
      body: "La mayoría de los viajeros necesitarán un visado turístico para entrar en Tanzania. Costo: 50 $ (o 100 $ para los ciudadanos estadounidenses). Dónde obtenerlo: solicítalo en línea a través del portal de eVisa de Tanzania u obténlo a tu llegada al JRO. Validez del pasaporte: mínimo 6 meses desde la fecha de entrada.",
    },
    {
      heading: '🧳 Lista de Verificación Antes de la Llegada',
      body: "Antes de partir, asegúrate de tener: un pasaporte y visado válidos, un certificado de fiebre amarilla (si se requiere), un seguro de viaje (que incluya cobertura de evacuación), vuelos internacionales reservados al JRO (o vuelos de conexión), un traslado desde el aeropuerto organizado con tu operador del Kilimanjaro, y un margen de llegada (llega al menos 1 día antes de tu escalada).",
    },
    {
      heading: '🏨 Dónde Alojarte Antes de Tu Escalada',
      body: "La mayoría de los escaladores se alojan en Moshi o Arusha la noche antes de comenzar el trekking. Ambas ciudades ofrecen hoteles y alojamientos cómodos, tiendas de alquiler de equipo, compras de última hora (snacks, tarjetas SIM, etc.) y actividades culturales y visitas a plantaciones de café. Consejo: llega al menos un día completo antes para descansar, conocer a tus guías y hacer una última revisión del equipo antes del trekking.",
    },
    {
      heading: '🧭 Las Palabras Finales',
      body: "Llegar al Kilimanjaro es más fácil de lo que crees — con un aeropuerto internacional bien conectado y un apoyo turístico confiable, aterrizarás a solo un breve trayecto de tu aventura. Ya viajes solo o en grupo, llegar temprano y bien preparado garantiza que comiences tu escalada relajado y listo. Con Asili Climbing Kilimanjaro, gestionamos tu llegada, tus traslados y tu logística — para que puedas concentrarte en el viaje que te espera.",
    },
  ],
}

const mountKilimanjaroFactsEs: DetailArticleEs = {
  slug: 'mount-kilimanjaro-facts',
  seoTitle: 'Datos sobre el Monte Kilimanjaro | El Icónico Techo de África al Descubierto',
  seoDescription: 'Datos fascinantes sobre el Monte Kilimanjaro: sus conos volcánicos, sus cinco zonas climáticas, sus glaciares, sus porteadores y lo que hace tan icónico al Techo de África.',
  heroTitle: 'Datos sobre el Monte Kilimanjaro: el Icónico Techo de África al Descubierto',
  heroImage: {src: '/images/contact/hero.webp', alt: 'El Monte Kilimanjaro visto sobre acacias en la sabana africana'},
  intro:
    'El Monte Kilimanjaro es mucho más que una simple escalada — es una maravilla natural, un ícono cultural y un poderoso símbolo de aventura. Conocido como el « Techo de África », el Kilimanjaro atrae a decenas de miles de excursionistas cada año. Pero ¿cuánto sabes realmente sobre esta montaña legendaria? Aquí tienes algunos de los datos más fascinantes, sorprendentes y esenciales sobre el Monte Kilimanjaro — pensados para ayudarte a apreciar cada paso de tu viaje.',
  sections: [
    {
      heading: '🌍 1. El Kilimanjaro es la Montaña Más Alta de África',
      body: "Altitud: 5.895 metros sobre el nivel del mar. Posición mundial: es la montaña independiente más alta del mundo — no forma parte de una cadena montañosa. Ubicación: norte de Tanzania, cerca de la frontera con Kenia.",
    },
    {
      heading: '🧊 2. Es un Volcán — De Hecho, Tres Volcanes',
      body: "El Monte Kilimanjaro no es un único pico — está formado por tres conos volcánicos: Kibo (el más alto y el único cono dormido, donde se alcanza la cumbre), Mawenzi (escarpado y espectacular, no se puede escalar hasta la cima), y Shira (en gran parte erosionado, pero aún visible en las rutas occidentales). Kibo se considera dormido, no extinto, lo que significa que podría entrar en erupción de nuevo — aunque su última actividad importante fue hace más de 360.000 años.",
    },
    {
      heading: '🌦️ 3. Atravesarás Cinco Zonas Climáticas',
      body: "Escalar el Kilimanjaro es como caminar desde el ecuador hasta el Ártico. La montaña cuenta con cinco zonas ecológicas, cada una con su propio clima, fauna y paisajes únicos: Zona de cultivo (800-1.800 m) — tierras de cultivo, plataneras y aldeas. Zona de selva tropical (1.800-2.800 m) — jungla exuberante con monos y aves exóticas. Zona de landa/páramo (2.800-4.000 m) — lobelias gigantes y páramos ondulados. Zona de desierto alpino (4.000-5.000 m) — seco, rocoso y casi sin vida. Zona ártica (5.000-5.895 m) — glaciares, temperaturas heladas y aire enrarecido.",
    },
    {
      heading: '🧗‍♀️ 4. No se Requiere Escalada Técnica',
      body: "A pesar de su impresionante altura, el Kilimanjaro es un pico de trekking, no de montañismo técnico. Esto significa que no se necesitan cuerdas, piolets ni equipo técnico. Es accesible para cualquiera con buena condición física y determinación. El éxito depende más de la adaptación a la altitud que de la habilidad para escalar.",
    },
    {
      heading: '⏳ 5. La Mayoría de las Escaladas Duran de 6 a 9 Días',
      body: "Las mejores escaladas dejan tiempo para que tu cuerpo se aclimate. Las rutas más populares incluyen: Route Machame (7 días) — panorámica y variada. Route Lemosho (8-9 días) — excelente para la aclimatación y con menos afluencia. Route Marangu (5-6 días) — la única con alojamiento en refugios. Northern Circuit (9 días) — la más larga y la más tranquila para la aclimatación. Rongai o Umbwe — para quienes buscan rutas únicas.",
    },
    {
      heading: '🌕 6. Puedes Escalar Durante la Luna Llena',
      body: "Un trekking durante la luna llena ilumina la cumbre nevada y ofrece una experiencia mágica y surrealista. Muchos escaladores planifican su noche de cumbre para que coincida con la luna llena, para una mejor visibilidad y fotos inolvidables.",
    },
    {
      heading: '🎒 7. Alrededor de 30.000 Personas Intentan la Escalada Cada Año',
      body: "El Kilimanjaro atrae a aventureros de todo el mundo. Aproximadamente el 65-75% de los escaladores alcanza la cumbre, según la ruta y el tiempo de aclimatación. Elegir una ruta más larga aumenta considerablemente tus posibilidades de éxito.",
    },
    {
      heading: '💨 8. El Mal de Altura es el Desafío Número Uno',
      body: "El aire se vuelve más escaso a medida que subes, y muchos excursionistas sienten los efectos del mal agudo de montaña (MAM). Los síntomas pueden incluir dolor de cabeza, náuseas y fatiga. Un ritmo lento, la hidratación y los días de descanso son esenciales para reducir el riesgo.",
    },
    {
      heading: '🍲 9. Comerás Bien en la Montaña',
      body: "Olvídate de las raciones de supervivencia insípidas — la mayoría de los trekkings del Kilimanjaro incluyen comidas calientes, snacks e incluso fruta fresca. Un buen operador turístico como Asili Climbing Kilimanjaro se asegura de que estés bien alimentado con comidas equilibradas y energizantes cada día.",
    },
    {
      heading: '🙌 10. No Escalarás Solo — Conoce a los Porteadores',
      body: "Cada excursionista cuenta con el apoyo de un equipo que puede incluir guías (certificados y experimentados), porteadores (que cargan tu equipo y montan el campamento) y cocineros (que preparan las comidas). Tu escalada solo es posible gracias a estos incansables héroes locales. Las agencias turísticas responsables colaboran con el KPAP (Kilimanjaro Porters Assistance Project) para garantizar un trato y salarios justos.",
    },
    {
      heading: '🧊 11. Los Glaciares del Kilimanjaro Están Desapareciendo',
      body: "El Kilimanjaro tenía en su día enormes glaciares cerca de la cumbre. Debido al cambio climático, estos campos de hielo se están reduciendo rápidamente — algunos expertos estiman que podrían desaparecer por completo en unas pocas décadas. Verlos ahora es realmente una experiencia única en la vida.",
    },
    {
      heading: '📸 12. El Cartel de Uhuru Peak es Icónico',
      body: "Uhuru Peak (que significa « Pico de la libertad » en suajili) es el punto más alto del borde del cráter de Kibo. Llegar al cartel de madera verde y amarillo es un momento de orgullo y emoción para cada excursionista — y sí, ¡definitivamente querrás una foto! ¿Listo para vivirlo tú mismo? Deja que Asili Climbing Kilimanjaro te guíe hacia la cumbre de forma segura y responsable — con planificación experta, conocimiento local y recuerdos inolvidables.",
    },
  ],
}

const typicalDayOnKilimanjaroEs: DetailArticleEs = {
  slug: 'typical-day-on-kilimanjaro',
  seoTitle: 'Un Día Típico en el Kilimanjaro | Qué Esperar Cada Día',
  seoDescription: '¿Cómo es un día típico durante la escalada del Monte Kilimanjaro? Desde el despertar hasta la noche de cumbre, este es el ritmo diario de tu trekking.',
  heroTitle: 'Un Día Típico en el Kilimanjaro: Qué Esperar Cada Día al Escalar la Montaña Más Alta de África',
  heroImage: {src: '/images/articles/typical-day-hero.webp', alt: 'Tiendas de campaña instaladas en el Barafu Camp en el Monte Kilimanjaro'},
  intro:
    "Escalar el Monte Kilimanjaro es una experiencia inolvidable — pero también es estructurada, segura y sorprendentemente cómoda cuando está bien planificada. Ya sientas curiosidad por saber cómo transcurrirán tus días, cuánto caminarás o cuándo descansarás, esta página te ofrece una visión real de un día típico en el Kilimanjaro con Asili Climbing Kilimanjaro. Vamos a analizarlo todo, desde el amanecer hasta el atardecer — y más allá.",
  sections: [
    {
      heading: '☀️ Las Mañanas en la Montaña',
      body: "6:00-6:30: despertar — Tu día comienza con un suave toque en tu tienda y un alegre « buenos días » de tu equipo de campamento. Te traerán un cuenco de agua tibia para refrescarte y una bebida caliente (normalmente té, café o chocolate caliente) para calentar tus manos y tu espíritu.\n7:00-7:30: desayuno — reponer energía es fundamental. El desayuno se sirve en la tienda comedor y normalmente incluye gachas o copos de avena, huevos (fritos, revueltos o duros), tostadas con mermelada, mantequilla de maní o miel, fruta fresca y zumo, además de té y café. Hacia el final de la semana, ¡el desayuno se convierte en uno de los momentos destacados del día!",
    },
    {
      heading: '🥾 La Hora del Trekking',
      body: "8:00: comienza la caminata del día. Después del desayuno, tus guías dan una breve charla informativa — detalles de la ruta, tiempo estimado de marcha y previsión meteorológica. Luego es hora de tomar el sendero. La caminata diaria varía según la ruta y la altitud. Normalmente caminarás de 4 a 7 horas al día, a un ritmo lento y constante (« Pole Pole » — suajili para « despacio despacio »), con pausas frecuentes para beber agua, comer snacks y hacer fotos, siempre acompañado de tu guía. Las pausas de media mañana a menudo incluyen snacks ligeros o fruta para mantener tu energía.",
    },
    {
      heading: '🏕️ La Hora del Almuerzo y el Descanso de Mediodía',
      body: "Dependiendo de la ruta y el terreno, el almuerzo puede servirse en un punto de picnic designado a lo largo del sendero o en el siguiente campamento. El almuerzo típico incluye guiso de verduras o pasta, arroz o patatas, aguacate o ensaladas, además de zumo de fruta y té. Después del almuerzo y un breve descanso, seguirás caminando algunas horas más, o te relajarás en el campamento si la caminata del día ha terminado.",
    },
    {
      heading: '🌄 Llegada al Campamento',
      body: "Una vez que llegues a tu próximo campamento, tu equipo de porteadores ya habrá montado tu tienda, tu equipo de dormir y el área de comidas. Serás recibido con agua tibia para lavarte y snacks como palomitas o galletas con té o café caliente. Es tu momento para relajarte: escribir en tu diario, disfrutar de las vistas, charlar con otros escaladores, descansar e hidratarte.",
    },
    {
      heading: '🍽️ Cena y Charla Informativa Diaria',
      body: "18:00-19:00: se sirve la cena. La cena es una comida abundante y caliente pensada para reponer tu energía. Puedes esperar una sopa (siempre bien recibida), un plato principal (arroz, carne, verduras o pasta), fruta de postre, y una infusión de jengibre o hierbas para ayudar a la digestión y a dormir. Tus guías también realizarán una breve charla informativa nocturna para explicar lo que viene, cómo va tu aclimatación y cualquier consejo sobre equipo o ropa para el día siguiente.",
    },
    {
      heading: '🌙 Dormir Bajo las Estrellas',
      body: "20:00-21:00: apagado de luces. Con poca o ninguna contaminación lumínica, el cielo nocturno del Kilimanjaro es impresionante. La mayoría de los escaladores se acuestan temprano. Tu saco de dormir te mantiene caliente — incluso a gran altitud. Las noches son tranquilas, frías y apacibles. Algunas noches pueden interrumpirse por el viento o una necesidad natural, pero la mayoría de los excursionistas duermen profundamente gracias a un día completo de caminata.",
    },
    {
      heading: '⛰️ La Noche de Cumbre: la Excepción',
      body: "El único día que rompe la rutina es la noche de cumbre. Te despertarás alrededor de las 23:00 o medianoche, te vestirás con capas cálidas y comenzarás el tramo final hacia la cumbre a la luz de la luna. Es una subida lenta y exigente — pero llegar a Uhuru Peak al amanecer hace que todo valga la pena. Después de la cumbre, descenderás al campamento base para descansar, y luego continuarás bajando la montaña al día siguiente.",
    },
    {
      heading: '🔄 Resumen del Ritmo Diario',
      table: {
        columns: ['Hora', 'Actividad'],
        rows: [
          ['6:00', 'Despertar + bebidas calientes'],
          ['7:00', 'Desayuno'],
          ['8:00', 'Inicio del trekking'],
          ['12:30-13:30', 'Almuerzo y descanso'],
          ['15:00-16:00', 'Llegada al siguiente campamento'],
          ['16:30', 'Té y snacks'],
          ['18:00', 'Cena y charla informativa de la guía'],
          ['20:00-21:00', 'Dormir'],
        ],
      },
    },
    {
      heading: '💬 Reflexiones Finales',
      body: "Escalar el Kilimanjaro es un viaje de ritmo, sencillez y naturaleza. Cada día sigue un desarrollo predecible y favorable — con mucho descanso, comida nutritiva, un acompañamiento experto y tiempo para apreciar la montaña. Con Asili Climbing Kilimanjaro, no solo caminas hacia una cumbre — abrazas un estilo de vida, aunque sea por unos días. Y al final, no solo te sentirás realizado — te sentirás transformado.",
    },
  ],
}

const kilimanjaroFullmoonClimbEs: DetailArticleEs = {
  slug: 'kilimanjaro-fullmoon-climb',
  seoTitle: 'Escalada del Kilimanjaro con Luna Llena | Una Experiencia de Cumbre Mágica',
  seoDescription: 'Alcanza la cumbre del Monte Kilimanjaro bajo la luna llena. Descubre las mejores rutas, los tiempos y los consejos de preparación para una escalada mágica con luna llena.',
  heroTitle: 'Escalada del Kilimanjaro con Luna Llena: una Experiencia de Cumbre Mágica',
  heroImage: {src: '/images/articles/fullmoon-hero.jpg', alt: 'Tiendas de campaña iluminadas en un campamento del Kilimanjaro de noche'},
  intro:
    "Escalar el Monte Kilimanjaro ya es una aventura única en la vida — pero ¿hacerlo bajo la luz de la luna llena? Eso es una experiencia de otro nivel. La Escalada del Kilimanjaro con Luna Llena ofrece a los excursionistas una oportunidad rara e inolvidable de alcanzar el pico más alto de África con el resplandor de la luna iluminando el camino. En Asili Climbing Kilimanjaro, ofrecemos escaladas cuidadosamente programadas durante la luna llena para quienes desean hacer su aventura aún más especial — y un poco más mágica.",
  sections: [
    {
      heading: '🌙 ¿Por Qué Escalar el Kilimanjaro Durante la Luna Llena?',
      body: "Una escalada con luna llena no se trata solo de la vista. Se trata de cómo la luz de la luna transforma la experiencia — especialmente durante tu última noche de cumbre. Esto es lo que la hace especial: Iluminación natural — la cumbre cubierta de nieve brilla bajo la luz de la luna, reduciendo la necesidad de linternas frontales durante la subida final. Mayor visibilidad — puedes ver claramente tu entorno incluso a medianoche, creando una atmósfera surrealista, casi onírica. Vistas impresionantes — presenciarás el paisaje del Kilimanjaro bañado en una suave luz plateada, algo que muy pocas personas tienen la suerte de ver. Amanecer de cumbre espectacular — llegar a Uhuru Peak justo cuando el sol sale sobre un cielo iluminado por la luna es un recuerdo que llevarás contigo toda la vida.",
    },
    {
      heading: '📆 ¿Cuál es el Mejor Momento para una Escalada con Luna Llena?',
      body: "La luna llena ocurre una vez al mes, y el mejor momento para alinear tu trekking es alcanzar la cumbre la noche de luna llena o un día antes o después. Esto te ofrece la máxima exposición a la luz de la luna durante la parte más importante de tu viaje — la noche de cumbre. Próximas fechas de luna llena (para 2026): 13 de enero, 12 de febrero, 14 de marzo, 12 de abril, 11 de mayo (las fechas cambian cada año — contáctanos para conocer los calendarios actualizados de escaladas con luna llena). Para alcanzar la cumbre en una noche de luna llena, deberás comenzar tu escalada de 6 a 8 días antes de la luna llena, según la ruta elegida.",
    },
    {
      heading: '🥾 Mejores Rutas para una Escalada con Luna Llena',
      body: "Todas las principales rutas del Kilimanjaro pueden planificarse en torno a la luna llena, pero algunas son más adecuadas para este tipo de experiencia. Rutas recomendadas: Route Machame (7 días) — una de las rutas más panorámicas y populares con una excelente aclimatación. Route Lemosho (8 días) — ofrece un enfoque más tranquilo y vistas panorámicas. Route Rongai (7 días) — ideal para quienes buscan un camino menos frecuentado y una cumbre con luna llena desde el norte. Cada una de estas opciones te ofrece el ritmo y la flexibilidad adecuados para alinearte con la luna llena manteniendo al mismo tiempo una escalada segura y agradable.",
    },
    {
      heading: '💡 ¿Es una Escalada con Luna Llena Adecuada para Ti?',
      body: "Una escalada con luna llena es perfecta para fotógrafos y narradores visuales, aventureros románticos (¡ideal para parejas!), quienes buscan un viaje espiritual o simbólico, y cualquiera que desee elevar su experiencia del Kilimanjaro — literal y emocionalmente. Dicho esto, las escaladas con luna llena también pueden ser más populares, especialmente durante los meses secos como julio a octubre y enero a marzo. Se recomienda encarecidamente reservar con antelación.",
    },
    {
      heading: '🎒 Cómo Prepararse para un Trekking con Luna Llena',
      body: "Aparte de programar bien tu escalada, no hay diferencias importantes en la preparación. Sin embargo, recomendamos vestir en capas (¡incluso con luz de luna, la noche de cumbre es fría!), llevar una linterna frontal (puede que la necesites menos, pero sigue siendo esencial para la seguridad), y reservar con antelación (los permisos limitados y el espacio en los campamentos se agotan rápido para las fechas de luna llena). En Asili Climbing Kilimanjaro, te ayudaremos a planificar el itinerario perfecto para alinearte con el ciclo lunar, sin apresurar tu aclimatación ni comprometer la seguridad.",
    },
    {
      heading: '🌍 Una Conexión Más Profunda con la Montaña',
      body: "Hay algo profundamente humilde en estar en el Kilimanjaro en plena noche, iluminado solo por la luna y las estrellas, mientras el horizonte comienza a iluminarse con la primera luz del amanecer. Es tranquilo. Es poderoso. Es algo que las palabras no pueden capturar por completo — pero que tu corazón nunca olvidará.",
    },
    {
      heading: '🚀 ¿Listo para la Escalada a la Luz de la Luna de tu Vida?',
      body: "Déjanos ayudarte a hacerlo realidad. Ya viajes solo, en pareja o en grupo, nuestras escaladas del Kilimanjaro con luna llena están diseñadas para una experiencia única en la vida — con guías experimentados, acompañamiento personalizado y un profundo respeto por la montaña. Contáctanos hoy mismo para reservar tu lugar en la próxima escalada con luna llena con Asili Climbing Kilimanjaro.",
    },
  ],
}

const kilimanjaroAltitudeSicknessEs: DetailArticleEs = {
  slug: 'kilimanjaro-altitude-sickness',
  seoTitle: 'Mal de Altura en el Kilimanjaro | Lo Que Debes Saber Antes de Escalar',
  seoDescription: 'Comprende el mal agudo de montaña (MAM) en el Kilimanjaro: síntomas, niveles de gravedad, prevención y cómo Asili Climbing Kilimanjaro garantiza tu seguridad.',
  heroTitle: 'Mal de Altura en el Kilimanjaro: Lo Que Debes Saber Antes de Escalar',
  heroImage: {src: '/images/articles/altitude-sickness-hero.jpg', alt: 'Escalador agotado descansando sobre rocas junto a una mochila'},
  intro:
    "Escalar el Monte Kilimanjaro es una aventura inolvidable — pero también es un desafío en alta montaña. Una de las cosas más importantes que debes entender antes de comenzar tu trekking es el mal de altura, también conocido como mal agudo de montaña (MAM). En Asili Climbing Kilimanjaro, tu seguridad es nuestra máxima prioridad. Esto significa educar a los escaladores sobre los riesgos de la altitud y cómo prepararse tanto mental como físicamente para el viaje hacia la cumbre.",
  sections: [
    {
      heading: '🌬️ ¿Qué es el Mal de Altura?',
      body: "El mal de altura ocurre cuando tu cuerpo no se adapta bien a los niveles más bajos de oxígeno en altitudes elevadas. El Kilimanjaro culmina a 5.895 metros — y la mayoría de las personas sienten los efectos de la altitud por encima de los 2.500 metros. Cuando asciendes demasiado rápido, tu cuerpo tiene dificultades para adaptarse. El resultado puede variar desde dolores de cabeza leves hasta complicaciones graves si se ignora.",
    },
    {
      heading: '🚦 Tres Niveles de Mal de Altura',
      body: "🟢 MAM leve — dolor de cabeza, fatiga, náuseas, pérdida de apetito, dificultad para dormir. Común y manejable; la mayoría de los escaladores lo experimenta en cierta medida.\n🟠 MAM moderado — dolor de cabeza intenso, mareos, vómitos, dificultad para respirar en reposo. Requiere atención médica y a menudo descenso.\n🔴 MAM grave (HAPE/HACE) — Edema pulmonar de altura (líquido en los pulmones), edema cerebral de altura (inflamación del cerebro), confusión, incapacidad para caminar, labios/dedos azulados, fatiga extrema. Esto es una emergencia médica y requiere un descenso inmediato y atención profesional.",
    },
    {
      heading: '⏳ ¿Cuándo Comienza?',
      body: "Los síntomas generalmente comienzan entre 6 y 24 horas después de llegar a una altitud más elevada. Por eso una aclimatación gradual es fundamental. Ascensos más lentos significan menos síntomas y mayores tasas de éxito en la cumbre.",
    },
    {
      heading: '✅ Cómo Te Ayudamos a Prevenir el Mal de Altura',
      body: "Tu salud es nuestra máxima prioridad. Nuestros guías están formados en respuesta a la alta montaña y realizan un monitoreo diario de la salud mediante oxímetros de pulso, tanques de oxígeno de emergencia y kits de primeros auxilios, camillas portátiles para evacuación de emergencia, y planes de evacuación establecidos con el apoyo de los equipos de rescate locales. También se te informará diariamente sobre tu estado, y ajustaremos el ritmo o el itinerario si es necesario.",
    },
    {
      heading: '🥾 Cómo Afecta la Altitud a Tus Posibilidades de Alcanzar la Cumbre',
      body: "El mal de altura es la razón número uno por la que los escaladores no logran alcanzar la cumbre — no la condición física, no el equipo. Por eso elegir la ruta adecuada y una agencia de guías confiable es fundamental para tu éxito. Con la preparación, la conciencia y el apoyo adecuados, puedes alcanzar Uhuru Peak de forma segura y disfrutar de las vistas impresionantes desde el Techo de África.",
    },
    {
      heading: '🌄 Reflexión Final: No Temas a la Altitud — Respétala',
      body: "El mal de altura no es algo que debas temer — pero sí es algo para lo que debes prepararte. Con Asili Climbing Kilimanjaro, estás en buenas manos. No solo te guiamos hasta la cima — te ayudamos a llegar allí de forma segura. ¿Tienes más preguntas sobre la aclimatación, los niveles de oxígeno o las opciones de ruta? Estamos aquí para ayudarte a planificar una escalada segura, exitosa y transformadora.",
    },
  ],
}

const kilimanjaroFoodEs: DetailArticleEs = {
  slug: 'kilimanjaro-food',
  seoTitle: 'Comida en el Kilimanjaro | Qué Comerás en la Montaña',
  seoDescription: '¿Qué comida comerás escalando el Kilimanjaro? Comidas, opciones alimentarias, seguridad del agua y snacks — todo sobre la comida en la montaña.',
  heroTitle: 'Comida en el Kilimanjaro: Qué Comerás en la Montaña',
  heroImage: {src: '/images/articles/food-hero.webp', alt: 'Comida de campamento en la montaña compuesta de fideos, huevos y ensalada de verduras'},
  intro:
    "Escalar el Monte Kilimanjaro es un desafío físico y mental — pero con el combustible adecuado, tu cuerpo puede prosperar en altitud. Una de las preguntas más frecuentes de los excursionistas es: « ¿Qué tipo de comida comeré en el Kilimanjaro? » En Asili Climbing Kilimanjaro, creemos que la buena comida es más que una necesidad — es parte de la experiencia. Desde frutas frescas en el desayuno hasta sopas calientes por la noche, cada comida se prepara con cuidado para mantenerte energizado, satisfecho y saludable durante toda tu escalada.",
  sections: [
    {
      heading: '🧑‍🍳 Comidas Recién Cocinadas en la Montaña',
      body: "Cada trekking con Asili incluye un chef de montaña dedicado y un equipo que prepara diariamente comidas calientes y abundantes en una cocina portátil. Transportamos ingredientes frescos y cocinamos desde cero — aquí no hay sobres liofilizados ni sorpresas enlatadas. Te sorprenderá lo deliciosas que pueden ser las comidas de montaña, ¡incluso a 4.000 metros!",
    },
    {
      heading: '🍳 Qué Puedes Esperar Comer',
      body: "Nos centramos en alimentos energéticos, nutritivos y fáciles de digerir que te ayudan a lidiar con la altitud y el frío.\n🌅 Desayuno: gachas (maíz, mijo, avena), huevos (duros, fritos o en tortilla), tostadas con mermelada, mantequilla de maní o miel, panqueques o chapati, fruta fresca (plátanos, naranjas, mango), bebidas calientes (té, café, chocolate caliente).\n🥪 Almuerzo: según el programa del día, ya sea empacado (sándwiches o pollo a la parrilla, huevos duros, fruta, galletas o barritas energéticas, zumo o té) o caliente en los días de trekking más cortos (pasta con verduras o salsa de carne, arroz con frijoles o pollo, verduras estofadas).\n🍲 Cena: servida en una tienda comedor con un ambiente acogedor — sopa (verduras, puerro, zanahoria o calabaza), arroz, pasta o patatas, carne a la parrilla o estofada (pollo o res), verduras cocidas (repollo, espinacas, zanahorias), chapati o panecillos, fruta fresca de postre, infusión de hierbas o chocolate caliente.",
    },
    {
      heading: '🥗 ¿Dietas Especiales? Ningún Problema.',
      body: "Ya seas vegetariano, vegano, intolerante al gluten o tengas alergias alimentarias específicas, podemos adaptarnos a tus necesidades dietéticas. Solo avísanos con antelación, y nuestros chefs planificarán en consecuencia. Todas las comidas se cocinan con higiene y se sirven con utensilios limpios y agua filtrada.",
    },
    {
      heading: '💧 ¿Y Qué Pasa con el Agua Potable?',
      body: "Proporcionamos agua potable segura y tratada durante todo tu trekking. El agua se recoge de arroyos cercanos y se hierve, filtra o trata químicamente para tu seguridad. Deberías traer botellas de agua reutilizables o una bolsa de hidratación para rellenar diariamente.",
    },
    {
      heading: '🧂 Seguridad Alimentaria e Higiene',
      body: "A gran altitud, tu sistema inmunológico se debilita ligeramente, por lo que la seguridad alimentaria es fundamental. Nuestro equipo sigue estrictos protocolos de higiene, incluyendo el lavado minucioso de manos y equipo, la preparación de comidas en una tienda de cocina limpia dedicada, la garantía de que los ingredientes estén frescos y almacenados de forma segura, y la prevención de la contaminación cruzada.",
    },
    {
      heading: '🍫 Snacks: Trae tus Favoritos',
      body: "Aunque proporcionamos tres comidas completas al día, es posible que quieras traer tus propios snacks para energía extra entre comidas: barritas energéticas o proteicas, fruta deshidratada, mezcla de frutos secos, comprimidos o polvos de electrolitos, caramelos duros o chocolate para un impulso rápido de azúcar. Consejo: la altitud puede reducir tu apetito, así que trae snacks que realmente te gusten — incluso si parecen básicos a nivel del mar.",
    },
    {
      heading: '🧘 Cómo Ayuda la Comida Frente a la Altitud',
      body: "Escalar el Kilimanjaro requiere más que resistencia — requiere una nutrición adecuada. Las comidas ricas en carbohidratos y bajas en grasas ayudan a tu cuerpo a adaptarse a los niveles más bajos de oxígeno. Las sopas y tés calientes también ayudan a mantenerte hidratado y a combatir síntomas relacionados con la altitud como el dolor de cabeza o las náuseas.",
    },
    {
      heading: '🏔️ Nutrición para Alcanzar la Cumbre',
      body: "Pones a prueba tu cuerpo cada día en el Kilimanjaro, y lo que comes afecta directamente tu rendimiento, tu estado de ánimo y tu éxito. En Asili Climbing Kilimanjaro, nos tomamos la comida en serio — porque tu cumbre depende de ello. ¿Listo para escalar bien alimentado y sin preocupaciones? Contáctanos para saber más sobre nuestros planes de comidas o hablar con antiguos escaladores que cenaron con nosotros en el Techo de África.",
    },
  ],
}

const kilimanjaroPortersEs: DetailArticleEs = {
  slug: 'kilimanjaro-porters',
  seoTitle: 'Porteadores del Kilimanjaro | El Corazón de Cada Escalada Exitosa',
  seoDescription: 'Conoce a los porteadores del Kilimanjaro que hacen posible cada escalada. Descubre el trato ético, el KPAP, los consejos sobre propinas y cómo mostrar tu agradecimiento.',
  heroTitle: 'Porteadores del Kilimanjaro: el Corazón de Cada Escalada Exitosa',
  heroImage: {src: '/images/articles/porters-hero.webp', alt: 'Un porteador cargando equipo en el sendero del Kilimanjaro'},
  intro:
    "Cuando piensas en escalar el Monte Kilimanjaro, es natural imaginar la cumbre, el desafío y las vistas impresionantes. Pero detrás de cada trekking exitoso hay un equipo de personas dedicadas y trabajadoras que hacen posible el viaje: los porteadores del Kilimanjaro. En Asili Climbing Kilimanjaro, honramos y respetamos el papel vital que desempeñan los porteadores — no solo como ayudantes, sino como héroes de la montaña.",
  sections: [
    {
      heading: '👣 ¿Quiénes Son los Porteadores del Kilimanjaro?',
      body: "Los porteadores son hombres y mujeres tanzanos locales que cargan el equipo, la comida, el agua y los suministros necesarios para tu trekking. Montan y desmontan el campamento, ayudan con la logística y a menudo echan una mano cuando necesitas ánimo o asistencia en el sendero. Sin ellos, las escaladas del Kilimanjaro — para la mayoría de las personas — serían casi imposibles.",
    },
    {
      heading: '🧭 ¿Qué Hacen los Porteadores en la Montaña?',
      body: "🏕️ Cargan el equipo: tiendas de campaña, sacos de dormir, suministros de cocina, tu bolsa de viaje (hasta 15 kg).\n🧑‍🍳 Apoyan al equipo: ayudan a los cocineros, sirven las comidas, buscan agua y montan las tiendas comedor.\n🛖 Montan y desmontan el campamento: a veces llegan al campamento horas antes que tú.\n🧤 Asisten a los escaladores: a veces ayudando a escaladores que están fatigados o enfrentando dificultades.\nA menudo hacen todo esto con una sonrisa, incluso después de largas horas en un terreno empinado y accidentado.",
    },
    {
      heading: '🎒 ¿Cuánto Cargan los Porteadores del Kilimanjaro?',
      body: "Los porteadores están limitados por las regulaciones del Parque Nacional del Kilimanjaro y el KPAP (Kilimanjaro Porters Assistance Project) a cargar un máximo de 20 kg — esto incluye sus pertenencias personales. Sin embargo, no todos los operadores hacen cumplir esto de manera justa. Por eso es fundamental escalar con un operador afiliado al KPAP como Asili Climbing Kilimanjaro, que se compromete con el trato justo y el bienestar de los porteadores.",
    },
    {
      heading: '🤝 Trato Ético de los Porteadores: Qué Significa',
      body: "El trekking ético significa que los porteadores reciben salarios justos (puntualmente y de forma transparente), se les proporcionan comidas adecuadas en la montaña, disponen de refugio adecuado y equipo cálido, están limitados a las cargas permitidas por la ley, se les incluye en las ceremonias de propinas, y se les respeta como miembros de pleno derecho del equipo. En Asili, esto no es simplemente una casilla que marcar — es cómo llevamos a cabo cada escalada.",
    },
    {
      heading: '📣 Por Qué Esto Importa para Ti como Excursionista',
      body: "Cuando eliges una empresa que trata bien a sus porteadores, escalas de forma responsable. Apoyas los medios de vida locales, mejoras las condiciones laborales y ayudas a transformar el turismo en una fuerza positiva en Tanzania. También vives un mejor trekking. Un equipo de porteadores bien apoyado está motivado, es confiable y se enorgullece de su papel en tu éxito.",
    },
    {
      heading: '💡 ¿Cuántos Porteadores se Necesitan por Escalador?',
      body: "El trekking promedio del Kilimanjaro requiere de 3 a 4 porteadores por escalador, según la duración de la ruta y el tamaño del grupo, además de miembros adicionales del equipo como guías, cocineros y guías asistentes. En Asili, nunca escatimamos reduciendo el personal de nuestras escaladas. Cada miembro del equipo desempeña un papel para garantizar tu comodidad y seguridad.",
    },
    {
      heading: '🎖️ Kilimanjaro Porters Assistance Project (KPAP)',
      body: "Colaboramos con orgullo con el KPAP para mantener y superar los más altos estándares en materia de bienestar de los porteadores. El KPAP es una organización sin fines de lucro que monitorea las condiciones de los porteadores y responsabiliza a las empresas por un trato ético. Animamos a todos los excursionistas a preguntar si su operador está certificado por el KPAP — es el estándar de referencia en el Kilimanjaro.",
    },
    {
      heading: '💰 Propinas a los Porteadores: una Muestra de Gratitud',
      body: "Las propinas son una forma común y significativa de mostrar tu agradecimiento. Aunque no son obligatorias, se esperan y se aprecian mucho. Nuestro equipo proporciona pautas transparentes sobre propinas justas, y nos aseguramos de que las propinas se distribuyan directamente a cada miembro del equipo de forma pública y respetuosa.",
      table: {columns: ['Rol', 'Propina típica (por escalador, trekking de 7 días)'], rows: [['Porteadores', '6-10 $/día'], ['Cocinero', '10-15 $/día'], ['Guía', '20-25 $/día']]},
    },
    {
      heading: '🧍 Las Historias Detrás de las Sonrisas',
      body: "Muchos porteadores en el Kilimanjaro son estudiantes, agricultores o líderes comunitarios que ganan un ingreso para mantener a sus familias. Algunos llegan a ser cocineros o guías — y nos enorgullece guiar a quienes sueñan con ascender profesionalmente. En Asili, conocemos sus nombres, sus historias y sus ambiciones — y tratamos a cada miembro del equipo con respeto. « No solo cargan equipo — cargan sueños, y te ayudan a alcanzar los tuyos. » — Joseph, guía principal en Asili Climbing Kilimanjaro",
    },
    {
      heading: '📷 Cómo Puedes Mostrar tu Agradecimiento',
      body: "Aprende los nombres de tus porteadores, pregunta sobre sus vidas y comparte una sonrisa, participa en la ceremonia final de propinas, toma y comparte fotos con su permiso, y deja una reseña mencionando tu experiencia positiva.",
    },
    {
      heading: '🚶 Escala con Respeto. Escala con Corazón.',
      body: "En Asili Climbing Kilimanjaro, creemos que los porteadores merecen más que aplausos — merecen dignidad. Al escalar con nosotros, ayudas a establecer un estándar más alto para el turismo de montaña, uno en el que las personas son valoradas tanto como la cumbre. ¿Quieres saber más sobre nuestras políticas hacia los porteadores o conocer al equipo que hace posible todo esto? Contacta con Asili Climbing Kilimanjaro o comienza a planificar hoy mismo tu trekking ético.",
    },
  ],
}

const kilimanjaroPackingListEs: DetailArticleEs = {
  slug: 'kilimanjaro-packing-list',
  seoTitle: 'Lista de Equipaje para el Monte Kilimanjaro | Guía de Equipo y Ropa',
  seoDescription: 'La lista completa de equipaje para el Monte Kilimanjaro: capas de ropa, calzado, equipo para dormir, esenciales de la mochila diaria y lo que proporciona tu operador turístico.',
  heroTitle: 'Lista Completa de Equipaje para el Monte Kilimanjaro',
  heroImage: {src: '/images/articles/packing-hero.webp', alt: 'Equipo de trekking y escalada dispuesto sobre un suelo de madera'},
  intro:
    "Escalar el Monte Kilimanjaro no es unas vacaciones normales. A 5.895 metros, exige tanto resistencia mental como el equipo adecuado. ¿La buena noticia? No necesitas gastar una fortuna — pero sí necesitas hacer el equipaje con inteligencia. Esta guía cubre todo lo que necesitas llevar para una escalada segura, cómoda y exitosa. Ya te unas a un trekking guiado o escales con un equipo privado, esta lista está pensada para la claridad, la comodidad y la preparación para el frío.",
  sections: [
    {
      heading: '🎒 Lista de Esenciales: Qué Debes Llevar Sí o Sí',
      body: "Estos son los imprescindibles absolutos — equipo y ropa que usarás todos los días.\n🧥 Capas de ropa: el Kilimanjaro cuenta con cinco zonas ecológicas, y las temperaturas varían enormemente. Piensa en: sistema de capas. Capas base (ropa interior térmica) — 2-3 conjuntos (superior e inferior), que absorban la humedad. Capas intermedias — forros polares o chaquetas softshell. Chaqueta aislante — de plumón o sintética para la noche de cumbre. Capa exterior — chaqueta y pantalones impermeables y cortavientos (se prefiere Gore-Tex). Pantalones de trekking — 2 pares, de secado rápido. Camisetas — 3-4 transpirables. Gorro cálido — que cubra las orejas. Sombrero o gorra de sol — para altitudes más bajas. Guantes — guantes finos interiores + guantes impermeables aislantes. Buff o cuello de tubo — para el viento, el polvo y el calor.",
      image: {src: '/images/articles/packing-gear.jpg', alt: 'Diagrama ilustrado del equipo de trekking del Kilimanjaro, incluyendo ropa, botas y accesorios'},
    },
    {
      heading: '👟 Calzado',
      body: "Caminarás de 6 a 8 horas al día, así que la comodidad es fundamental. Botas de trekking — impermeables, ya rodadas, con soporte para el tobillo. Zapatos de campamento — Crocs o zapatillas de trail para las noches. Calcetines de lana o sintéticos — 4-6 pares. Polainas — opcionales, pero útiles en zonas embarradas/nevadas.",
      image: {src: '/images/articles/packing-boot.jpg', alt: 'Bota de trekking impermeable'},
    },
    {
      heading: '🛏️ Equipo para Dormir',
      body: "La mayoría de los tours incluyen tiendas de campaña y colchonetas, pero confirma qué se proporciona. Saco de dormir — con calificación de al menos -10°C o menos. Forro para saco de dormir — añade calidez y mantiene el saco limpio. Almohada de viaje o almohada inflable.",
      image: {src: '/images/articles/packing-sleeping-bag.jpg', alt: 'Saco de dormir y forro desenrollados'},
    },
    {
      heading: '🎒 Esenciales de la Mochila Diaria',
      body: "Llevarás tu propia mochila diaria con los artículos que necesitas entre campamentos: mochila diaria de 30-40 L con correas acolchadas y cinturón de cadera. Sistema de hidratación — 2-3 L (CamelBak o botellas de agua). Snacks — mezcla de frutos secos, barritas energéticas, fruta deshidratada. Gafas de sol — con protección UV, se prefiere categoría glaciar. Protector solar y bálsamo labial — SPF 30+. Linterna frontal — con pilas de repuesto (para la noche de cumbre). Cámara o smartphone — opcional, para fotos. Cuaderno y bolígrafo — opcional, para escribir un diario.",
    },
    {
      heading: '🧼 Higiene Personal y Salud',
      body: "Mantente fresco (o lo más fresco posible) con este kit de higiene minimalista: artículos de aseo (jabón biodegradable, cepillo de dientes, pasta dental, desodorante), toallitas húmedas (tu mejor amiga en la montaña), gel desinfectante (esencial antes de las comidas), toalla de secado rápido (tamaño mediano), papel higiénico (lleva un rollo en una bolsa Ziploc), botiquín de primeros auxilios básico (tratamiento de ampollas, analgésicos, antidiarreicos), medicamento para la altitud (Diamox — consulta a tu médico), medicamentos personales (incluye pastillas antipalúdicas si es necesario), tapones para los oídos (para compañeros de tienda que roncan).",
    },
    {
      heading: '📦 Extras Opcionales pero Útiles',
      body: "Estos elementos no son obligatorios, pero pueden marcar una gran diferencia en la comodidad: batería externa (solar o precargada), bastones de trekking (muy recomendados para las rodillas y el equilibrio), bolsas de compresión/bolsas secas (para mantener tu equipo organizado y seco), suplementos energéticos (comprimidos de electrolitos o sales de hidratación), cinta adhesiva (para reparaciones rápidas), libro o e-reader (para los momentos de descanso), bolsas Ziploc (para residuos, snacks, dispositivos electrónicos), botella o embudo reutilizable para orinar (comodidad nocturna).",
    },
    {
      heading: '🧳 ¿Qué Proporciona el Operador?',
      body: "La mayoría de las empresas confiables como Asili Climbing Kilimanjaro incluyen tiendas de campaña, colchonetas, tiendas comedor y utensilios, comida, agua, personal de cocina y porteadores (que cargan tu bolsa de viaje principal). Por lo general, eres responsable de tu ropa, saco de dormir, equipo personal y mochila diaria. Muchos artículos se pueden alquilar en Moshi o Arusha — consulta con tu operador turístico con antelación.",
    },
  ],
}

const kilimanjaroClimbCostEs: DetailArticleEs = {
  slug: 'kilimanjaro-climb-cost',
  seoTitle: 'Costo de la Escalada del Kilimanjaro | Lo Que Debes Saber',
  seoDescription: '¿Cuánto cuesta escalar el Kilimanjaro? Desglose completo de costos por ruta, tamaño del grupo, alquiler de equipo, propinas y qué está incluido.',
  heroTitle: 'Costo de la Escalada del Kilimanjaro: Lo Que Debes Saber',
  heroImage: {src: '/images/articles/cost-hero.webp', alt: 'Escalador celebrando frente al cartel de la cumbre Uhuru Peak'},
  intro:
    "Escalar el Monte Kilimanjaro es una aventura que cambia la vida, pero tiene un costo. Entender adónde va tu dinero — y qué esperar — es fundamental para planificar un ascenso exitoso y seguro. El costo total puede variar mucho según la ruta, el número de días, el nivel de comodidad que desees y la agencia que elijas.",
  sections: [
    {
      heading: '💰 ¿Cuánto Cuesta Escalar el Kilimanjaro?',
      body: 'En promedio, el costo oscila entre 1.700 $ y 6.000 $ por persona. Cada ruta del Kilimanjaro tiene necesidades logísticas, proporciones de porteadores y tasas de parque diferentes según el número de días:',
      table: {
        columns: ['Ruta', 'Días', 'Costo aprox. (gama media)', 'Por qué varía el precio'],
        rows: [
          ['Marangu', '5-6', '1.800 $ - 2.500 $', 'Usa refugios, menos porteadores'],
          ['Machame', '6-7', '2.000 $ - 3.000 $', 'Ruta panorámica popular'],
          ['Lemosho', '7-8', '2.300 $ - 3.500 $', 'Más larga, inicio remoto'],
          ['Rongai', '6-7', '2.200 $ - 3.200 $', 'Menos tráfico, enfoque desde el norte'],
          ['Umbwe', '6', '2.100 $ - 3.100 $', 'Ascenso empinado y rápido'],
          ['Northern Circuit', '8-9', '2.800 $ - 4.200 $', 'La más larga, mayor tasa de éxito'],
        ],
      },
    },
    {
      heading: '🧾 2. Desglose de Costos Línea por Línea',
      body: 'Esto es adónde va tu dinero, en una escalada de 7 días de gama media:',
      table: {
        columns: ['Categoría de Gasto', 'Costo Estimado (USD)'],
        rows: [
          ['Tasas de parque y permisos', '800 $ - 1.100 $'],
          ['Salarios de guías y equipo', '400 $ - 600 $'],
          ['Comida y suministros de cocina', '150 $ - 250 $'],
          ['Equipo (tiendas, etc.)', '100 $ - 200 $'],
          ['Traslados (al punto de partida)', '50 $ - 100 $'],
          ['Administración y apoyo de seguridad', '100 $ - 200 $'],
          ['Margen de beneficio del operador', '200 $ - 400 $'],
        ],
      },
    },
    {
      heading: '👥 3. Tamaño del Grupo y Costos de la Escalada Privada',
      body: 'Escalada en grupo abierto (6-12 personas): menor costo por persona. Escalada privada (solo o grupo personalizado): normalmente 300-800 $ más por persona. Escaladas de lujo (con baños portátiles, comidas mejoradas, menos escaladores): pueden alcanzar los 5.000-7.000 $.',
      image: {src: '/images/articles/cost-route.jpg', alt: 'Grupo de excursionistas caminando hacia el Monte Kilimanjaro'},
    },
    {
      heading: '🏨 4. Alojamiento Antes y Después de la Escalada',
      body: 'La mayoría de los paquetes incluyen 1 noche antes de la escalada y 1 noche después, en un hotel de 2-3 estrellas en Moshi o Arusha (con posibilidad de mejora). Prevé alrededor de 50-150 $ por noche si reservas de forma independiente.',
      image: {src: '/images/articles/cost-lodge.jpg', alt: 'Alojamiento en lodge cerca del Kilimanjaro'},
    },
    {
      heading: '🎒 5. Alquiler o Compra de Equipo',
      body: 'Si no tienes tu propio equipo, tendrás que alquilarlo en el lugar:',
      table: {
        columns: ['Artículo', 'Costo de Alquiler (USD)'],
        rows: [
          ['Saco de dormir', '30 $ - 50 $'],
          ['Chaqueta de plumón', '20 $ - 40 $'],
          ['Bastones de trekking', '10 $ - 15 $'],
          ['Polainas', '10 $ - 15 $'],
          ['Linterna frontal', '10 $ - 20 $'],
        ],
      },
    },
    {
      heading: '💸 6. Pautas sobre Propinas',
      body: 'Las propinas se esperan y se aprecian profundamente. El Kilimanjaro Porters Assistance Project (KPAP) recomienda: guía — 20 $/día, guía asistente — 15 $/día, cocinero — 12 $/día, porteadores — 6-10 $/día cada uno. Propina total por escalador (escalada de 7 días): 250-300 $ (según el tamaño del grupo).',
      image: {src: '/images/articles/cost-tipping.jpg', alt: 'Un escalador y una guía en el sendero del Kilimanjaro'},
    },
    {
      heading: '🚑 7. Costos del Seguro',
      body: "El seguro de viaje es obligatorio para la mayoría de los operadores. Espera pagar entre 80-150 $ por una cobertura de trekking en alta montaña (por encima de los 5.000 m), evacuación de emergencia y cancelación o interrupción del viaje.",
    },
    {
      heading: '🧭 8. Costo vs. Valor: ¿Qué Estás Pagando Realmente?',
      table: {
        columns: ['Operador Más Económico', 'Operador de Gama Media', 'Operador Premium'],
        rows: [
          ['1.500 $ - 1.900 $', '2.000 $ - 3.200 $', '4.000 $ - más de 6.000 $'],
          ['Guías sin experiencia', 'Guías certificados y experimentados', 'Guías certificados como Wilderness First Responder (WFR)'],
          ['Equipo deficiente', 'Buenas tiendas, equipo de seguridad', 'Equipo de alta gama + baños portátiles'],
          ['Sin oxígeno ni controles de seguridad', 'Monitoreo diario de la salud', 'Oxígeno de respaldo, equipo médico privado'],
          ['Trato no ético a los porteadores', 'Salarios justos mediante afiliación KPAP', 'Mejor proporción porteadores-clientes'],
        ],
      },
    },
    {
      heading: '🧾 ¿Qué Está Incluido en el Costo?',
      body: "Las tasas de parque (que pueden representar hasta el 50% del costo total), el alojamiento en camping/refugios, todas las comidas en la montaña, guías de montaña profesionales, porteadores y cocineros, tiendas de campaña, colchonetas y equipo de comedor, el transporte de ida y vuelta al punto de partida, las tasas de rescate y los permisos.",
    },
    {
      heading: '🚫 ¿Qué NO Está Incluido?',
      body: "Los vuelos internacionales o domésticos, las tasas de visado, el seguro de viaje (obligatorio), las propinas para guías y porteadores, el alquiler o compra de equipo, las estancias en hotel antes/después de la escalada, los gastos personales (snacks, bebidas, souvenirs).",
      image: {src: '/images/articles/cost-notincluded.jpg', alt: 'Escalador en el terreno rocoso del Monte Kilimanjaro'},
    },
    {
      heading: 'Nota',
      body: "Escalar el Kilimanjaro es una aventura seria, y el precio que pagas debe reflejar la calidad, la seguridad y la experiencia que esperas. Aunque no necesitas gastar una fortuna, evita escatimar en la montaña. No es solo una caminata — es un viaje único en la vida.",
    },
  ],
}

const bestTimeToClimbKilimanjaroEs: DetailArticleEs = {
  slug: 'best-time-to-climb-kilimanjaro',
  seoTitle: 'El Mejor Momento para Escalar el Kilimanjaro | Guía Temporada por Temporada',
  seoDescription: '¿Cuándo es el mejor momento para escalar el Kilimanjaro? Un desglose mes a mes del clima, la afluencia y las condiciones para ayudarte a elegir las fechas de tu escalada.',
  heroTitle: '🕒 El Mejor Momento para Escalar el Kilimanjaro',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Elefante pastando con el Monte Kilimanjaro de fondo'},
  intro:
    "Escalar el Monte Kilimanjaro es una aventura increíble — y elegir cuándo ir puede ser tan importante como elegir cómo llegar. Con sus picos imponentes, sus patrones climáticos cambiantes y sus paisajes espectaculares, programar bien tu trekking puede marcar la diferencia entre una escalada cómoda y una difícil. Entonces, ¿cuál es el mejor momento para escalar el Monte Kilimanjaro? Vamos a analizarlo temporada por temporada, basándonos en experiencia real y en la opinión de expertos.",
  sections: [
    {
      heading: 'Mejores Meses para Escalar el Kilimanjaro',
      body:
        "Existen dos temporadas ideales para el trekking en el Kilimanjaro.\n🗓️ Enero a mediados de marzo — Clima: cálido, mayormente seco, días soleados. Paisaje: vistas despejadas, especialmente en las primeras horas de la mañana. Afluencia: moderada, no tan concurrida como en temporada alta. Puntos destacados: excelente época para la fotografía con picos nevados. Este período es excelente para los escaladores que desean temperaturas suaves y menos afluencia, especialmente de enero a principios de febrero. Sin embargo, marzo marca el inicio de las grandes lluvias, así que es mejor ir antes de mediados de marzo.\n🗓️ Junio a octubre (temporada alta) — Clima: seco y estable. Paisaje: impresionante, especialmente con cielos vibrantes al amanecer. Afluencia: es la época más concurrida en la montaña. Puntos destacados: excelentes condiciones de cumbre y visibilidad en los senderos. Esta es la época más popular para escalar el Kilimanjaro, especialmente durante las vacaciones de verano europeas y norteamericanas. Los senderos están más secos y las condiciones son más confiables — solo prepárate para compartirlos con otros excursionistas.\n🌧️ Temporadas a Evitar (si es posible)\n🗓️ Mediados de marzo a mayo (gran temporada de lluvias) — las fuertes lluvias hacen que los senderos sean resbaladizos y la visibilidad sea escasa. Mayor riesgo de malestar relacionado con la altitud debido a las condiciones frías/húmedas. Menos excursionistas, algo que algunos pueden disfrutar — pero esto tiene un costo. A menos que seas muy experimentado y estés bien preparado, este no es el momento ideal para escalar. Los campamentos pueden volverse embarrados, y las vistas suelen estar nubladas.\n🗓️ Noviembre a principios de diciembre (pequeña temporada de lluvias) — menos intensa que las grandes lluvias, pero aún impredecible. Menos escaladores en el sendero. Podrías tener algunos días despejados y frescos — pero es una apuesta. Esta temporada es mejor que las grandes lluvias, pero sigue sin ser muy recomendable a menos que estés dispuesto a aceptar clima ocasionalmente húmedo.",
      image: {src: '/images/articles/besttime-uhuru.webp', alt: 'Cartel de la cumbre Uhuru Peak'},
    },
    {
      heading: '❄️ ¿Qué Pasa con la Nieve en el Kilimanjaro?',
      body: "La nieve es común en la cumbre durante todo el año, pero si esperas ver Uhuru Peak cubierta de nieve, tus mejores oportunidades son de enero a marzo y durante o justo después de las temporadas de lluvias (abril o principios de diciembre). La nieve añade magia al día de la cumbre — pero también añade dificultad, así que planifica en consecuencia.",
    },
    {
      heading: '📊 Panorama del Clima del Kilimanjaro por Mes',
      table: {
        columns: ['Mes', 'Temporada', 'Condiciones', 'Afluencia'],
        rows: [
          ['Enero', 'Seco (mejor)', 'Cielos despejados, temperaturas suaves', 'Media'],
          ['Febrero', 'Seco (mejor)', 'Cálido, excelente visibilidad', 'Media'],
          ['Marzo', 'Transición', 'Lluvia en aumento', 'Baja'],
          ['Abril', 'Lluvioso (evitar)', 'Húmedo, nublado, resbaladizo', 'Muy baja'],
          ['Mayo', 'Lluvioso (evitar)', 'Malas condiciones de los senderos', 'Muy baja'],
          ['Junio', 'Seco (temporada alta)', 'Mañanas frescas, vistas despejadas', 'Alta'],
          ['Julio', 'Seco (temporada alta)', 'Noches frías, días soleados', 'Muy alta'],
          ['Agosto', 'Seco (temporada alta)', 'Excelente clima en la cumbre', 'Muy alta'],
          ['Septiembre', 'Seco (temporada alta)', 'Grandes vistas, clima suave', 'Alta'],
          ['Octubre', 'Transición', 'Algo de lluvia a finales de mes', 'Media'],
          ['Noviembre', 'Lluvioso (evitar)', 'Lluvias cortas, impredecible', 'Baja'],
          ['Diciembre', 'Transición', 'Despejado a principios de mes, más húmedo a finales', 'Media'],
        ],
      },
    },
    {
      heading: '🏔️ Consejos de Expertos para Elegir el Momento Adecuado',
      body: "Evita las vacaciones escolares (julio y agosto) si quieres menos afluencia. Si tiene que ser en temporada de lluvias, ve con un operador experimentado y prevé protección adicional contra el clima. La aclimatación es más importante que el sol — rutas más largas como Lemosho y Northern Circuit ofrecen una mejor adaptación a la altitud, sin importar la temporada. Los meses fríos significan mejores fotos en la cumbre (menos nubosidad), pero los meses cálidos significan más comodidad en el sendero.",
    },
  ],
}

const kilimanjaroSafarisEs: DetailArticleEs = {
  slug: 'kilimanjaro-safaris',
  seoTitle: 'Safaris del Kilimanjaro | Combina la Cumbre y la Sabana',
  seoDescription: 'Combina tu escalada del Kilimanjaro con un safari en Tanzania. Explora Tarangire, el lago Manyara, el cráter del Ngorongoro y el Serengeti después de tu cumbre.',
  heroTitle: '🐘 Safaris del Kilimanjaro: Combina la Cumbre y la Sabana',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Elefante pastando con el Monte Kilimanjaro de fondo'},
  intro:
    "Tu aventura africana no termina en la cumbre — comienza donde vagan los animales salvajes. Escalar el Monte Kilimanjaro es un logro imprescindible, pero combinar tu trekking con un inolvidable safari en Tanzania completa la experiencia. Después de días de caminata en alta montaña, imagina cambiar tus botas de trekking por binoculares y los senderos polvorientos por llanuras doradas — persiguiendo leones, elefantes y ñus por los paisajes más icónicos de África Oriental. En Asili Climbing Kilimanjaro, te ayudamos a pasar de los picos nevados a la sabana con experiencias de safari fluidas antes o después del trekking, adaptadas a tu tiempo, presupuesto e intereses.",
  sections: [
    {
      heading: '🌍 ¿Qué es un Safari del Kilimanjaro?',
      body: "Un safari del Kilimanjaro generalmente se refiere a un recorrido de vida silvestre en el norte de Tanzania, combinado con una escalada del Kilimanjaro. Como la montaña se encuentra cerca de algunos de los mejores parques de vida silvestre de África, ya estás en el lugar perfecto para explorarlos. Ya quieras una rápida escapada de 2 días o un safari completo de 5 a 7 días, las posibilidades son infinitas — y épicas.",
    },
    {
      heading: '🏞️ Mejores Parques de Safari Cerca del Kilimanjaro',
      body: "1. Parque Nacional de Tarangire — famoso por sus enormes manadas de elefantes, sus baobabs y su ambiente fuera de lo común. Distancia desde Arusha: aproximadamente 2 horas. Ideal para un inicio o un final relajado de tu aventura en el Kilimanjaro.\n2. Parque Nacional del Lago Manyara — famoso por sus leones trepadores, sus flamencos, su bosque de aguas subterráneas. Distancia: aproximadamente 2,5 horas. Ideal para vislumbres rápidos de vida silvestre, especialmente de camino a la región de Ngorongoro.\n3. Cráter del Ngorongoro — famoso por avistar a los Big Five en un solo día. Un Sitio del Patrimonio Mundial de la UNESCO y la caldera intacta más grande del mundo. Ideal para la concentración de vida silvestre y la fotografía.\n4. Parque Nacional del Serengeti — famoso por la Gran Migración, sus llanuras infinitas, leones y leopardos. Un destino único en la vida. Ideal para safaris de 3 a 5 días con una inmersión profunda en la naturaleza salvaje.",
      image: {src: '/images/articles/safaris-gallery1.webp', alt: 'Una leona descansando con dos cachorros'},
    },
    {
      heading: '🗓️ Cuándo Ir de Safari Después del Kilimanjaro',
      body: "Puedes ir de safari todo el año, pero las mejores épocas para observar la vida silvestre son: junio a octubre (temporada seca) — los animales se reúnen en los puntos de agua, y la vegetación es más escasa, ideal para las observaciones. Diciembre a marzo — temporada de nacimientos en el sur del Serengeti, llena de dramática acción entre depredadores y presas. Combina tu safari con una escalada del Kilimanjaro de junio a octubre para el emparejamiento de aventura definitivo.",
    },
    {
      heading: '🦓 Qué Verás en el Safari',
      body: "Dependiendo de los parques y la temporada, podrías avistar a los Big Five (león, leopardo, elefante, búfalo, rinoceronte), guepardos corriendo por las llanuras, jirafas moviéndose entre bosques de acacias, hipopótamos revolcándose en las orillas de los ríos, flamencos en el lago Manyara o Natron, y la Gran Migración de ñus y cebras (¡el momento importa!).",
      image: {src: '/images/articles/safaris-gallery2.webp', alt: 'Un elefante de pie en una pradera verde'},
    },
    {
      heading: '🛏️ Dónde te Alojarás',
      body: "Ya seas amante de la comodidad o del aventurero, el alojamiento de safari se presenta en estilos adecuados para todos los viajeros: lodges de lujo con vistas sobre las sabanas y los bordes de los cráteres, campamentos con tiendas de gama media que ofrecen comodidad e inmersión, campamentos móviles que se desplazan con la Gran Migración, y opciones económicas para mochileros o viajeros solitarios. En Asili, te ayudamos a encontrar el mejor alojamiento de safari según tu estilo, el tamaño de tu grupo y tu presupuesto.",
    },
    {
      heading: '💡 ¿Por Qué Combinar un Safari con una Escalada del Kilimanjaro?',
      body: "Recupérate y relájate: después de la intensidad del trekking, el safari deja que tu cuerpo descanse sin poner fin a tu aventura. Maximiza tu viaje: ya has viajado hasta Tanzania, extiende tu estancia y hazla aún más gratificante. Descubre la diversidad de África: desde picos nevados hasta llanuras repletas de vida silvestre, esta es África en su mejor momento. Perfecto para amigos o familiares que se unen más tarde: algunos miembros de la familia podrían no escalar, pero pueden reunirse contigo para el safari.",
      table: {
        columns: ['Día', 'Actividad'],
        rows: [
          ['1-7', 'Escalar el Kilimanjaro (por ejemplo, route Machame o Lemosho)'],
          ['8', 'Traslado a Tarangire para el safari'],
          ['9', 'Safari en el cráter del Ngorongoro'],
          ['10', 'Regreso en coche a Arusha o salida en avión'],
        ],
      },
    },
    {
      heading: '💰 ¿Cuánto Cuesta un Safari del Kilimanjaro?',
      body: "El precio del safari depende de la duración, el tipo de alojamiento y los parques visitados: safari de 2-3 días desde 600-1.200 $ por persona, safari de 4-5 días 1.200-2.000 $ por persona, safaris de lujo desde 2.500 $ según la elección de lodges y vehículos privados. En Asili Climbing Kilimanjaro, ofrecemos precios transparentes sin costos ocultos. Circuitos en grupo, familiares y privados, todos disponibles.",
    },
    {
      heading: '¿Listo para Pasar de la Cumbre a las Llanuras?',
      body: "Ya escales el Kilimanjaro solo, con amigos o en familia, un safari es el capítulo perfecto que sigue. Déjanos ayudarte a planificar el viaje de tu vida — a pie y sobre cuatro ruedas. Contacta con Asili Climbing Kilimanjaro para empezar a crear hoy mismo tu combinado de montaña + safari.",
    },
  ],
}

const soloKilimanjaroClimbEs: DetailArticleEs = {
  slug: 'solo-kilimanjaro-climb',
  seoTitle: 'Escalada en Solitario del Kilimanjaro | Tu Viaje Personal hacia el Techo de África',
  seoDescription: 'Todo lo que necesitas saber sobre la escalada en solitario del Kilimanjaro: si es segura, treks en grupo o privados, costos, y consejos de expertos para excursionistas independientes.',
  heroTitle: 'Escalada en Solitario del Kilimanjaro',
  heroImage: {src: '/images/articles/solo-hero.jpg', alt: 'Escalador solitario observando el amanecer desde el Kilimanjaro'},
  intro:
    "Si eres un viajero solitario que sueña con estar de pie en el pico más alto de África, escalar el Kilimanjaro solo es más que posible — es una experiencia increíblemente gratificante. En Asili Climbing Kilimanjaro, nos especializamos en guiar a aventureros solitarios, ofreciendo el apoyo, la seguridad y la flexibilidad que necesitas para hacer que el viaje sea verdaderamente tuyo. Esto es todo lo que necesitas saber sobre escalar el Kilimanjaro como viajero solitario.",
  sections: [
    {
      heading: '¿Se Puede Escalar el Kilimanjaro en Solitario?',
      body: "Aunque no está permitido escalar el Kilimanjaro completamente solo (un guía licenciado es obligatorio), definitivamente puedes reservar un trekking privado en solitario o unirte a un grupo como viajero solitario. Ya prefieras total independencia o una experiencia social con otros excursionistas, hay una opción perfecta para ti.",
    },
    {
      heading: 'Por Qué Muchos Viajeros Eligen Escalar el Kilimanjaro en Solitario',
      body: "Escalar en solitario no se trata solo de viajar solo — se trata de descubrir de qué eres capaz, a tu propio ritmo. Esta es la razón por la que muchos aventureros van solos: un desafío personal para superar límites y crecer, libertad y flexibilidad totales, tiempo para la reflexión personal y la claridad mental, y un viaje significativo — para un cumpleaños, una pausa profesional o una transición de vida.",
    },
    {
      heading: 'Trekking en Grupo o Trekking Privado — ¿Qué es Mejor para los Viajeros Solitarios?',
      body: "🟩 Unirse a un trekking en grupo: menor costo (logística compartida), ambiente social (conocer a otros excursionistas), fechas de salida fijas, ideal para principiantes o quienes buscan compañerismo.\n🟦 Escalada privada en solitario: horarios y ritmo flexibles, orientación y atención personalizadas, ideal para excursionistas experimentados o viajeros independientes, mayor costo pero completamente personalizado.\nAsili Climbing Kilimanjaro ofrece ambas opciones, sin presión y sin recargos por viajero individual.",
    },
    {
      heading: '🏕️ Cómo es Escalar en Solitario',
      body: "Incluso en un trekking en solitario, nunca estás verdaderamente solo. Contarás con el apoyo de un equipo completo que incluye un guía de montaña certificado, un cocinero y porteadores. Caminarás a tu propio ritmo, comerás comidas calientes preparadas especialmente para ti, y dormirás en una tienda cómoda cada noche. Las escaladas privadas ofrecen total flexibilidad y privacidad. Las escaladas en grupo te ofrecen apoyo y aliento compartido. Tu guía se convierte en tu compañero de confianza en el sendero.",
      image: {src: '/images/articles/is-safe-hero.jpg', alt: 'Excursionistas escalando el Kilimanjaro al amanecer'},
    },
    {
      heading: '🛡️ ¿Es Seguro Escalar el Kilimanjaro Solo?',
      body: "Sí — cuando escalas con un operador confiable como Asili Climbing Kilimanjaro, estás en buenas manos. Priorizamos tu seguridad con guías de montaña certificados y experimentados, controles de salud diarios y monitoreo de la altitud, planes de oxígeno de emergencia y evacuación, y porteadores bien formados con apoyo las 24 horas, los 7 días de la semana. Muchas viajeras solitarias también eligen Asili por nuestros equipos confiables, respetuosos y profesionales.",
    },
    {
      heading: '💰 ¿Es Más Costoso Escalar el Kilimanjaro en Solitario?',
      body: "Ir solo en una escalada privada cuesta más que unirse a un grupo, ya que cubres todo el costo logístico, las tasas de parque y el personal de apoyo. Sin embargo, el valor reside en tener una experiencia hecha a medida.",
      table: {columns: ['Opción', 'Rango de Costo Típico'], rows: [['Escalada en grupo (6-8 días)', '1.850 $ - 2.300 $'], ['Escalada privada en solitario (6-8 días)', '2.500 $ - 3.400 $']]},
    },
    {
      heading: '🎒 Consejos de Equipaje en Solitario para el Kilimanjaro',
      body: "Lleva una batería externa adicional o un cargador solar. Los objetos de confort personal (diario, libro, snacks) pueden levantar el ánimo. Haz el equipaje ligero pero inteligente — consulta nuestra Lista de Equipaje para el Kilimanjaro. ¡Rompe tus botas con antelación!",
    },
    {
      heading: '📅 Mejor Momento para Escalar el Kilimanjaro como Viajero Solitario',
      body: "Para los excursionistas solitarios, el momento importa: las mejores temporadas son enero-marzo y junio-octubre. Evita abril-mayo (fuertes lluvias) y noviembre (lluvias cortas). Escalar en temporada alta te da la opción de conocer a otras personas en el camino — incluso en una escalada privada.",
    },
    {
      heading: '💡 Opinión de un Experto',
      body: "Escalar el Kilimanjaro en solitario es una de las decisiones más empoderadoras que puedes tomar. Con el apoyo de un equipo local experimentado, obtienes la libertad de viajar solo con la tranquilidad de estar bien cuidado. En Asili Climbing Kilimanjaro, entendemos lo que necesitan los aventureros solitarios: respeto, flexibilidad y un equipo dedicado que hace que tu viaje sea inolvidable — y seguro.",
    },
    {
      heading: '🌍 ¿Listo para Comenzar tu Aventura en Solitario?',
      body: "Ya desees la soledad de un trekking privado o la energía de un grupo pequeño, te ayudaremos a planificar tu ruta, horario y ritmo perfectos. Hagamos realidad tu sueño del Kilimanjaro — solo para ti. Contacta con Asili Climbing Kilimanjaro para comenzar a planificar tu cumbre en solitario.",
    },
  ],
}

async function run() {
  await seedDetailArticleEs(isClimbingKilimanjaroSafeEs)
  await seedDetailArticleEs(gettingToKilimanjaroEs)
  await seedDetailArticleEs(mountKilimanjaroFactsEs)
  await seedDetailArticleEs(typicalDayOnKilimanjaroEs)
  await seedDetailArticleEs(kilimanjaroFullmoonClimbEs)
  await seedDetailArticleEs(kilimanjaroAltitudeSicknessEs)
  await seedDetailArticleEs(kilimanjaroFoodEs)
  await seedDetailArticleEs(kilimanjaroPortersEs)
  await seedDetailArticleEs(kilimanjaroPackingListEs)
  await seedDetailArticleEs(kilimanjaroClimbCostEs)
  await seedDetailArticleEs(bestTimeToClimbKilimanjaroEs)
  await seedDetailArticleEs(kilimanjaroSafarisEs)
  await seedDetailArticleEs(soloKilimanjaroClimbEs)
  console.log('done — all 13 detail articles seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
