/**
 * Spanish singletons seed: homePage-es, climbingKilimanjaroPage-es, siteSettings-es.
 * Mirrors seed-it-singletons.ts's structure exactly; these 3 are singletons (fixed
 * `<type>-es` id, no translation.metadata needed).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-singletons.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

import {homeData} from '../../climbingkilimanjarotanzania/content/home'
import {climbingKilimanjaroPageData} from '../../climbingkilimanjarotanzania/content/climbing-kilimanjaro-page'
import {siteFooter, siteInfo, siteNav} from '../../climbingkilimanjarotanzania/content/site'
import {key, segmentParagraphsToPt, segmentsToRichText, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const navLink = (link: {label: string; href: string}, label: string) => ({
  _type: 'navLink' as const,
  _key: key(),
  label,
  href: link.href,
})

// ---------- homePage-es ----------

async function seedHomeEs() {
  const d = homeData

  const destinationsEs = [
    {
      ...d.hero.destinations[0],
      eyebrow: 'Monte Kilimanjaro',
      heading: 'El Techo de África',
      body: 'Enfréntate al reto de un trekking inolvidable hasta la cima de la montaña independiente más alta del mundo.',
      stats: [
        {label: 'Experiencia', value: 'Trekking de montaña'},
        {label: 'Duración', value: 'De 6 a 9 días'},
        {label: 'Altitud', value: '5.895 m'},
      ],
    },
    {
      ...d.hero.destinations[1],
      eyebrow: 'Safari en Tanzania',
      heading: 'El Corazón Salvaje de África',
      body: 'Explora el Serengeti, el cráter del Ngorongoro y Tarangire en busca de los Big Five y la Gran Migración.',
      stats: [
        {label: 'Experiencia', value: 'Safaris fotográficos'},
        {label: 'Duración', value: 'De 5 a 9 días'},
        {label: 'Fauna', value: 'Los Big Five'},
      ],
    },
    {
      ...d.hero.destinations[2],
      eyebrow: 'Archipiélago de Zanzibar',
      heading: 'Paraíso Tropical',
      body: 'Relájate en playas de arena blanca, sumérgete en arrecifes de coral turquesa y pasea por los callejones perfumados de especias de la histórica Stone Town.',
      stats: [
        {label: 'Experiencia', value: 'Playa y cultura'},
        {label: 'Duración', value: 'De 3 a 6 días'},
        {label: 'Costa', value: 'Océano Índico'},
      ],
    },
  ]
  const posterAltEs = [
    'Escalada del Monte Kilimanjaro',
    'Safari fotográfico en el Serengeti',
    'Playa de Zanzibar y océano turquesa',
  ]
  const thumbnailAltEs = [
    'Cartel de la cima Uhuru Peak, Monte Kilimanjaro',
    'Parque Nacional del Serengeti',
    'Playa de Paje, Zanzibar',
  ]

  const destinations = []
  for (let i = 0; i < d.hero.destinations.length; i++) {
    const dest = d.hero.destinations[i]
    const es = destinationsEs[i]
    destinations.push({
      _type: 'heroDestination',
      _key: key(),
      key: dest.key,
      eyebrow: es.eyebrow,
      heading: es.heading,
      body: es.body,
      stats: es.stats.map((stat) => ({_type: 'heroStat', _key: key(), label: stat.label, value: stat.value})),
      mediaType: dest.media.type,
      ...(dest.media.type === 'video'
        ? {videoSrc: dest.media.src, poster: await uploadImage(client, {src: dest.media.poster.src, alt: posterAltEs[i]})}
        : {image: await uploadImage(client, dest.media.image)}),
      thumbnail: await uploadImage(client, {src: dest.thumbnail.src, alt: thumbnailAltEs[i]}),
      ctaHref: dest.ctaHref,
    })
  }

  const featuresEs = [
    {
      title: 'De Propiedad y Gestión Local',
      description:
        'Al ser una empresa tanzana, conocemos la tierra, la gente y la montaña como nadie más. No solo escalas con guías, escalas con una familia.',
    },
    {
      title: 'Guías de Montaña Expertos',
      description:
        'Todos nuestros guías están certificados, tienen experiencia y están formados en trekking de alta montaña. Tu seguridad y tu éxito son nuestras máximas prioridades.',
    },
    {
      title: 'Itinerarios a Medida',
      description:
        'Ya seas un excursionista primerizo o un aventurero experimentado, ofrecemos rutas del Kilimanjaro personalizables según tu ritmo, tus objetivos y tu calendario.',
    },
  ]

  const introBodyEs: {text: string; bold?: boolean; href?: string}[][] = [
    [
      {text: 'La escalada del Monte Kilimanjaro', bold: true, href: '/climbing-mount-kilimanjaro/'},
      {text: ' no es solo una caminata, es una aventura que cambia la vida. Con '},
      {text: 'Climbing Kilimanjaro Tanzania', bold: true},
      {
        text: ', cada detalle se cuida con esmero para que tu viaje sea fluido, seguro y verdaderamente inolvidable mientras asciendes ',
      },
      {text: 'la montaña más alta de África', bold: true},
      {text: '.'},
    ],
    [
      {text: 'Desde el momento en que te recibimos en el '},
      {text: 'aeropuerto', bold: true},
      {
        text: ', pasando por la preparación del equipo y el acompañamiento experto en el sendero, hasta la celebración en la cima, estamos contigo en cada paso. La mayoría de los excursionistas eligen su ',
      },
      {text: 'ruta del Kilimanjaro', bold: true},
      {text: ' según el tiempo de aclimatación, los paisajes y las tasas de éxito en la cima.'},
    ],
    [
      {text: 'Ya sea que prefieras una '},
      {text: 'ruta popular', bold: true},
      {text: ' o una experiencia más tranquila y alejada de lo habitual, tenemos el '},
      {text: 'trekking del Kilimanjaro', bold: true},
      {text: ' ideal para ti. Todos nuestros '},
      {text: 'paquetes', bold: true},
      {
        text: ' ofrecen fechas de salida flexibles, y los treks privados pueden comenzar cualquier día. Los ',
      },
      {text: 'itinerarios', bold: true},
      {text: ' más largos permiten una mejor aclimatación, aumentando notablemente tus posibilidades de alcanzar la cima.'},
    ],
    [
      {text: 'Durante una '},
      {text: 'escalada privada', bold: true},
      {text: ', tu grupo cuenta con el apoyo de un equipo dedicado de '},
      {text: 'guías', bold: true},
      {
        text: ' profesionales, porteadores y un cocinero personal, con las comidas servidas en una tienda comedor privada. Aunque los senderos y los campamentos se comparten con otros excursionistas, tu experiencia sigue siendo cómoda, personalizada y bien atendida.',
      },
    ],
    [
      {text: 'Nos enorgullece ser una de las principales empresas locales para la escalada del '},
      {text: 'Monte Kilimanjaro', bold: true},
      {text: ', comprometidos a ofrecer experiencias de cima seguras, memorables y gratificantes.'},
    ],
  ]

  const introFeaturesEs = [
    {
      title: 'Un Equipo Local Acogedor',
      description: 'Nacidos y criados a la sombra del Kilimanjaro, conocemos la montaña como a nuestra propia familia.',
    },
    {
      title: 'Un Trekking Seguro y a Buen Ritmo',
      description: 'Avanzamos «pole pole» (despacio). Ascensos cuidadosamente guiados, controles de bienestar y apoyo completo.',
    },
    {
      title: 'Una Conexión Auténtica, No Solo un Tour',
      description: 'Volverás a casa con mucho más que fotos en la cima — con conexiones duraderas y una historia que contar.',
    },
  ]

  const routeGuideItemsEs = [
    {name: 'Lemosho / Shira (7-9 días):', detail: 'Ofrece una excelente aclimatación, paisajes espectaculares y una alta probabilidad de alcanzar la cima.'},
    {name: 'Machame (6-8 días):', detail: 'Muy popular y pintoresca; a menudo llamada la «Whiskey Route».'},
    {name: 'Rongai (6-7 días):', detail: 'Una ruta más tranquila y seca, ideal durante la temporada de lluvias.'},
    {name: 'Marangu (5-6 días):', detail: 'La ruta más corta, conocida por su sendero sencillo y su alojamiento en refugios.'},
  ]

  const kiliCardTitlesEs = [
    'Route Machame 9 Días – Circuitos en Grupo Pequeño',
    'Trekking del Monte Kilimanjaro – Route Machame 6 Días',
    'Trekking del Monte Kilimanjaro – Route Lemosho 8 Días',
    'Trekking del Monte Kilimanjaro – Route Machame 7 Días',
    'Trekking del Monte Kilimanjaro – Route Marangu 6 Días',
    'Trekking del Monte Kilimanjaro – Route Rongai 6 Días',
  ]
  const kiliCardTourTypeEs = ['Grupo Pequeño / Básico', 'Privado • Básico', 'Privado • Básico', 'Privado • Básico', 'Privado • Básico', 'Privado • Básico']
  const kiliCardLocationEs = [
    'Arusha › Machame › Kilimanjaro',
    'Arusha › Kilimanjaro',
    'Arusha › Kilimanjaro',
    'Arusha › Kilimanjaro',
    'Arusha › Kilimanjaro',
    'Arusha › Kilimanjaro',
  ]

  const safariCardTitlesEs = [
    'Safari de la Migración del Río Mara - 07 Días',
    'Safari Simba - 05 Días',
    'Tanzania Clásica - 07 Días',
    'Experiencia Confort Tanzania - 07 Días',
    'Experiencia Safari Glamping Tanzania - 05 Días',
    'Safari de la Migración del Ñu - 09 Días',
  ]
  const safariCardTourTypeEs = ['Privado • Confort', 'Privado • Confort', 'Privado • Confort', 'Privado • Confort', 'Privado • Confort', 'Privado • Confort Plus']
  const safariCardLocationEs = [
    'Arusha › Serengeti Central › Cráter del Ngorongoro',
    'Parque Nacional del Serengeti › Ngorongoro › Cráter del Ngorongoro',
    'Arusha › Lago Manyara › Serengeti › Serengeti Central › Ngorongoro',
    'Arusha › Parque Nacional de Tarangire › Serengeti › Ngorongoro',
    'Arusha › Parque Nacional de Tarangire › Serengeti › Ngorongoro',
    'Arusha › Lago Manyara › Serengeti › Ngorongoro › Tarangire',
  ]

  const zanzibarCardTitlesEs = [
    'Zanzibar Océano Índico - 06 Días',
    'Océano Índico de Zanzibar - 06 Días',
    'La Isla de Zanzibar en Tanzania - 05 Días',
    'Una Luna de Miel en Zanzibar - 06 Días',
    'Descubre la Isla de Zanzibar - 03 Días',
    'Descubre el Océano Índico - 06 Días',
  ]
  const zanzibarCardTourTypeEs = ['Privado • Lujo', 'Privado • Confort', 'Privado • Lujo', 'Privado • Básico', 'Privado • Básico', 'Privado • Básico']
  const zanzibarCardLocationEs = [
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Aeropuerto Internacional Abeid Amani Karume › Zanzibar › Stone Town Zanzibar',
    'Zanzibar › Stone Town Zanzibar',
  ]

  const routeOptionsEs = [
    {
      title: 'Route Marangu 5 Días',
      summary: 'Un viaje de cinco días para ascender el pico más alto de África a través de la popular Route Marangu. Espera una variedad de paisajes…',
      duration: '5 días / 4 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 2.008 $ por persona', '2 excursionistas compartiendo - 1.783 $ por persona', 'De 3 a 4 excursionistas compartiendo - 1.678 $ por persona'],
    },
    {
      title: 'Route Marangu 6 Días',
      summary: 'Un viaje de seis días para ascender el pico más alto de África a través de la popular Route Marangu. Espera una variedad de paisajes…',
      duration: '6 días / 5 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 2.308 $ por persona', '2 excursionistas compartiendo - 1.928 $ por persona', 'De 3 a 4 excursionistas compartiendo - 1.678 $ por persona'],
    },
    {
      title: 'Route Machame o Umbwe 6 Días',
      summary: 'La Route Umbwe es conocida por su ascenso exigente y empinado y su espléndido sendero menos transitado.',
      duration: '6 días / 5 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 2.308 $ por persona', '2 excursionistas compartiendo - 2.058 $ por persona', 'De 3 a 4 excursionistas compartiendo - 2.058 $ por persona'],
    },
    {
      title: 'Route Machame o Umbwe 7 Días',
      summary: 'Recorre la popular Route Machame, en un viaje de siete días en total, lo que te da aún más tiempo para la aclimatación',
      duration: '7 días / 6 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 2.608 $ por persona', '2 excursionistas compartiendo - 2.608 $ por persona', 'De 3 a 4 excursionistas compartiendo - 2.348 $ por persona'],
    },
    {
      title: '6 días / 5 noches de trekking + 2 noches de hotel',
      summary: 'Un viaje de seis días para ascender el pico más alto de África a través de la popular Route Marangu. Espera una variedad de paisajes…',
      duration: '6 días / 5 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 2.648 $ por persona', '2 excursionistas compartiendo - 2.648 $ por persona', 'De 3 a 4 excursionistas compartiendo - 2.063 $ por persona'],
    },
    {
      title: 'Route Shira, Lemosho o Rongai 7 Días',
      summary: 'Abordada desde el norte, esta ruta ofrece una perspectiva única del Kilimanjaro y es perfecta para quienes…',
      duration: '7 días / 6 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 2.938 $ por persona', '2 excursionistas compartiendo - 2.938 $ por persona', 'De 3 a 4 excursionistas compartiendo - 2.313 $ por persona'],
    },
    {
      title: 'Route Shira, Lemosho o Rongai 8 Días',
      summary: 'Abordada desde el norte, esta ruta ofrece una perspectiva única del Kilimanjaro y es perfecta para quienes…',
      duration: '8 días / 7 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 3.228 $ por persona', '2 excursionistas compartiendo - 2.773 $ por persona', 'De 3 a 4 excursionistas compartiendo - 2.568 $ por persona'],
    },
    {
      title: '8 días / 7 noches de trekking + 2 noches de hotel',
      summary: 'Recorre la popular Route Machame, en un viaje de siete días en total, lo que te da aún más tiempo para la aclimatación',
      duration: '8 días / 7 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 3.588 $ por persona', '2 excursionistas compartiendo - 2.938 $ por persona', 'De 3 a 4 excursionistas compartiendo - 2.938 $ por persona'],
    },
    {
      title: 'Route Northern Circuit 9 Días, Alquiler de Baño Incluido',
      summary: 'La ruta más nueva y más larga, que ofrece vistas de 360 grados y las mejores tasas de éxito para alcanzar la cima.',
      duration: '9 días / 8 noches de trekking + 2 noches de hotel',
      prices: ['1 excursionista solo - 3.918 $ por persona', '2 excursionistas compartiendo - 3.228 $ por persona', 'De 3 a 4 excursionistas compartiendo - 3.228 $ por persona'],
    },
  ]

  const whyUsCardsEs = [
    {
      title: '100% de Propiedad Local',
      description:
        'No somos un operador turístico extranjero — nacimos y crecimos en Moshi, a la sombra del Kilimanjaro. Cuando escalas con Asili, apoyas directamente a familias y comunidades locales, y vives la montaña a través de los ojos de quienes mejor la conocen.',
    },
    {
      title: 'Los Más Altos Estándares de Seguridad',
      description:
        'Llevamos oxígeno de emergencia, pulsioxímetros, y realizamos controles de salud dos veces al día. Nuestros guías están formados para detectar y controlar el mal de altura a tiempo. Tu seguridad es nuestra prioridad — siempre.',
    },
    {
      title: 'Escaladas Privadas, Fechas Flexibles y Opciones Personalizadas',
      description:
        '¿Quieres escalar solo, en pareja o con un pequeño grupo de amigos? Ofrecemos salidas privadas adaptadas a tu calendario. Tu ritmo. Tu camino. Tu Kilimanjaro.',
    },
    {
      title: 'Tasas de Éxito en la Cima Comprobadas',
      description:
        'Gracias a nuestro enfoque centrado en la aclimatación, un ritmo adecuado y personal experimentado, alcanzamos una tasa de éxito en la cima superior al 95% en nuestras rutas más largas. Cuando confías en nosotros tu sueño, hacemos todo lo posible por ayudarte a lograrlo.',
    },
    {
      title: 'Traslados al Aeropuerto, Reserva de Hotel y Apoyo Completo',
      description:
        'Desde el momento en que aterrizas en el Aeropuerto del Kilimanjaro hasta el momento en que llegas a Uhuru Peak, estamos contigo. Traslados al aeropuerto, revisión de equipo, reservas de hotel y asistencia logística — todo esto forma parte de la experiencia Asili.',
    },
    {
      title: 'Trekking Justo y Ético',
      description:
        'Como orgullosos defensores del Kilimanjaro Porters Assistance Project (KPAP), nos aseguramos de que cada porteador reciba un pago justo, esté bien alimentado y cuente con equipo de calidad. Cuando escalas con Asili, escalas con integridad.',
    },
  ]

  const comboTilesEs = [
    {title: 'Kilimanjaro y Safari de Fauna Salvaje', subtitle: '12 Días en Tanzania'},
    {title: 'Kilimanjaro y Safari de Fauna Salvaje', subtitle: '10 Días en Tanzania'},
    {title: 'Kilimanjaro, Serengeti y Ngorongoro', subtitle: '12 Días en Tanzania'},
    {title: 'Kilimanjaro, Tarangire y Lago Manyara', subtitle: '10 días escalando el Kili y safari de fauna salvaje'},
  ]

  const testimonialsEs = [
    {
      timeAgo: 'hace 9 meses',
      quote:
        '¡Esta empresa hizo realidad mi sueño de escalar el Kilimanjaro! Un acompañamiento excelente, comidas deliciosas en la montaña, y un…',
    },
    {
      timeAgo: 'hace 9 meses',
      quote:
        'Muy recomendado para cualquiera que planee escalar la montaña más alta de África. El equipo fue muy atento, la comida…',
    },
  ]

  const faqQ = {
    q1: '¿Cuánto tiempo se tarda en escalar el Monte Kilimanjaro?',
    a1: 'La duración depende de la ruta que elijas. La mayoría de las escaladas al Kilimanjaro duran entre 6 y 9 días. Las rutas más largas ofrecen más tiempo para la aclimatación, lo que aumenta tus posibilidades de alcanzar la cima con éxito.',
    q2: '¿Necesito experiencia previa en escalada?',
    a2: 'No se requiere experiencia técnica previa en escalada. Sin embargo, una buena condición física y una preparación mental son esenciales, ya que el Kilimanjaro es un trekking de alta montaña, no una escalada técnica.',
    q3: '¿Cuál es la mejor época para escalar el Kilimanjaro?',
    a3: 'Los mejores meses para escalar son de enero a marzo y de junio a octubre, cuando el clima suele ser seco y la visibilidad es buena.',
    q4: '¿Qué tipo de alojamiento se ofrece durante la escalada?',
    a4: 'El alojamiento varía según la ruta. La mayoría de las rutas ofrecen cómodas tiendas de montaña, mientras que la Route Marangu ofrece alojamiento en refugios a lo largo del sendero.',
    q5: '¿Qué debo llevar para la escalada?',
    a5: 'Necesitarás buenas botas de trekking, ropa de abrigo, un saco de dormir, equipo impermeable y artículos personales esenciales. Te proporcionaremos una lista detallada para ayudarte a preparar tu viaje.',
    q6: '¿Es común el mal de altura en el Kilimanjaro?',
    a6: 'Sí, el mal de altura puede afectar a cualquier persona sin importar su nivel de condición física. Nuestros guías están formados para controlar de cerca tu salud y garantizar un ascenso seguro y gradual para una mejor aclimatación.',
    q7: '¿Por qué reservar con Climbing Kilimanjaro Tanzania?',
    a7: 'Somos un operador turístico local y experimentado, con guías de montaña profesionales, equipo de alta calidad y un servicio personalizado para garantizar una escalada segura, agradable e inolvidable.',
  }
  const faqItem = (q: string, a: string) => ({_type: 'faqItem', _key: key(), question: q, answer: a})

  await client.createOrReplace({
    _id: 'homePage-es',
    _type: 'homePage',
    language: 'es',
    hero: {
      exploreLabel: 'Explorar',
      primaryCtaLabel: 'Ver Paquetes',
      secondaryCtaLabel: 'Personalizar Viaje',
      secondaryCtaHref: d.hero.secondaryCtaHref,
      destinations,
    },
    features: featuresEs.map((item) => ({_type: 'featureItem', _key: key(), title: item.title, description: item.description})),
    intro: {
      heading: 'Desde la llegada hasta la cima — nosotros nos encargamos de todo.',
      body: segmentParagraphsToPt(introBodyEs),
      ctaLabel: 'Más Sobre Nosotros',
      ctaHref: d.intro.ctaHref,
      image: await uploadImage(client, {src: d.intro.image.src, alt: 'Excursionista en el Monte Kilimanjaro'}),
    },
    introFeatures: introFeaturesEs.map((item) => ({_type: 'introFeature', _key: key(), title: item.title, description: item.description})),
    routeGuide: {
      eyebrow: 'Elige tu ruta. Escala a tu manera. Guía completa de precios y consejos de reserva con guías locales',
      heading: 'Guía de Aventuras en Tanzania: safaris, Kilimanjaro y vacaciones en Zanzibar',
      items: routeGuideItemsEs.map((item) => ({_type: 'routeGuideItem', _key: key(), name: item.name, detail: item.detail})),
    },
    kilimanjaroPackages: {
      heading: 'Paquetes de Tours al Kilimanjaro',
      viewAllHref: d.kilimanjaroPackages.viewAllHref,
      cards: await Promise.all(
        d.kilimanjaroPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: kiliCardTitlesEs[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: kiliCardTourTypeEs[i],
          tourId: card.tourId,
          price: card.price,
          location: kiliCardLocationEs[i],
        })),
      ),
    },
    safariPackages: {
      heading: 'Paquetes de Safari y Tours',
      viewAllHref: d.safariPackages.viewAllHref,
      cards: await Promise.all(
        d.safariPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: safariCardTitlesEs[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: safariCardTourTypeEs[i],
          tourId: card.tourId,
          price: card.price,
          location: safariCardLocationEs[i],
        })),
      ),
    },
    zanzibarPackages: {
      heading: 'Paquetes de Tours a Zanzibar',
      viewAllHref: d.zanzibarPackages.viewAllHref,
      cards: await Promise.all(
        d.zanzibarPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: zanzibarCardTitlesEs[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: zanzibarCardTourTypeEs[i],
          tourId: card.tourId,
          price: card.price,
          location: zanzibarCardLocationEs[i],
        })),
      ),
    },
    routeOptions: {
      heading: 'Elige tu Ruta: compara todos los paquetes y rutas del Kilimanjaro con un guía local',
      cards: await Promise.all(
        d.routeOptions.cards.map(async (card, i) => ({
          _type: 'routeOptionCard',
          _key: key(),
          title: routeOptionsEs[i].title,
          href: card.href,
          image: await uploadImage(client, card.image),
          summary: routeOptionsEs[i].summary,
          duration: routeOptionsEs[i].duration,
          prices: routeOptionsEs[i].prices,
        })),
      ),
    },
    notSureBand: {
      heading: '¿No sabes qué ruta es la adecuada para ti?',
      body: 'Ofrecemos una variedad de rutas del Kilimanjaro adaptadas a tu condición física, tu calendario y tu estilo de trekking. Ya sea que busques paisajes espectaculares, menos aglomeraciones o la mejor tasa de éxito, te ayudaremos a elegir el camino ideal hacia la cima.',
      ctaLabel: 'Llama Ahora',
      ctaHref: d.notSureBand.ctaHref,
    },
    whyUs: {
      heading: '¿Por Qué Escalar el Kilimanjaro con Nosotros?',
      body: 'Elegir al equipo adecuado puede marcar la diferencia entre una simple caminata y una aventura que cambia la vida.',
      cards: whyUsCardsEs.map((card, i) => ({
        _type: 'whyUsCard',
        _key: key(),
        title: card.title,
        description: card.description,
        icon: d.whyUs.cards[i].icon,
      })),
    },
    comboExperience: {
      heading: 'Experiencia de Escalada al Kilimanjaro y Safari',
      body: 'Haz que tu aventura tanzana sea verdaderamente inolvidable: escala el majestuoso Monte Kilimanjaro y luego explora los parques de safari más emblemáticos de África. Con Asili, tu escalada y tu safari se combinan a la perfección, guiados por expertos locales que conocen cada sendero, cada paisaje y cada momento que merece la pena recordar.',
      cardTitle: 'Escala más alto. Explora lo más salvaje. Vive un viaje inolvidable',
      cardBody:
        'Alcanza la cima de la montaña independiente más alta del mundo, y luego sumérgete en la impresionante naturaleza salvaje de Tanzania. Con nuestros paquetes Kilimanjaro + Safari, disfruta de la combinación perfecta de aventura: conquistar el Kilimanjaro y después descubrir las maravillas del Serengeti, el cráter del Ngorongoro y el Parque Nacional de Tarangire.',
      ctaLabel: 'Empecemos a Planificar',
      ctaHref: d.comboExperience.ctaHref,
      tiles: await Promise.all(
        d.comboExperience.tiles.map(async (tile, i) => ({
          _type: 'comboTile',
          _key: key(),
          title: comboTilesEs[i].title,
          subtitle: comboTilesEs[i].subtitle,
          href: tile.href,
          image: await uploadImage(client, tile.image),
        })),
      ),
      body2:
        'Alcanza la cima de la montaña independiente más alta del mundo, y luego sumérgete en la impresionante naturaleza salvaje de Tanzania. Con nuestros paquetes Kilimanjaro + Safari, disfruta de la combinación perfecta de aventura: conquistar el Kilimanjaro y después descubrir las maravillas del Serengeti, el cráter del Ngorongoro y el Parque Nacional de Tarangire.',
      viewToursLabel: 'Ver Más Tours',
      viewToursHref: d.comboExperience.viewToursHref,
    },
    testimonials: {
      heading: 'Lo Que Dicen Nuestros Escaladores Satisfechos',
      items: d.testimonials.items.map((item, i) => ({
        _type: 'testimonial',
        _key: key(),
        name: item.name,
        timeAgo: testimonialsEs[i].timeAgo,
        rating: item.rating,
        quote: testimonialsEs[i].quote,
      })),
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      tabs: [
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Todas las Preguntas',
          faqs: [
            faqItem(faqQ.q1, faqQ.a1),
            faqItem(faqQ.q2, faqQ.a2),
            faqItem(faqQ.q3, faqQ.a3),
            faqItem(faqQ.q4, faqQ.a4),
            faqItem(faqQ.q5, faqQ.a5),
            faqItem(faqQ.q6, faqQ.a6),
            faqItem(faqQ.q7, faqQ.a7),
          ],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Época para Escalar el Kilimanjaro',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q3, faqQ.a3)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Alojamiento',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q6, faqQ.a6), faqItem(faqQ.q7, faqQ.a7)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Reservas',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2)],
        },
      ],
    },
  })
  console.log('homePage-es created/replaced')
}

// ---------- climbingKilimanjaroPage-es ----------

async function seedClimbEs() {
  const d = climbingKilimanjaroPageData

  await client.createOrReplace({
    _id: 'climbingKilimanjaroPage-es',
    _type: 'climbingKilimanjaroPage',
    language: 'es',
    trustBadges: {
      heading: 'Paquetes de Escalada al Kilimanjaro',
      badges: [
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'La Mejor Opción en TripAdvisor',
          description:
            'Con cientos de excelentes reseñas, nuestro compromiso con la calidad y la satisfacción del cliente nos distingue entre los operadores turísticos del Kilimanjaro.',
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Confiables y Experimentados',
          description:
            'Nuestros guías altamente capacitados garantizan una escalada bien asistida, priorizando la seguridad, el trekking ético y un camino fluido hacia la cima.',
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Con Sede en Tanzania',
          description:
            'Organizamos experiencias de trekking personalizadas al Kilimanjaro, desde escaladas económicas hasta expediciones de lujo, todas basadas en prácticas de escalada responsables y éticas.',
        },
      ],
    },
    challengeBand: {
      heading: '¿Listo para Aceptar el Reto del Kilimanjaro?',
      body: 'Tu viaje hacia el Techo de África comienza aquí. Ya sea que busques la aventura de tu vida o quieras superar tus límites hasta la cima, estamos aquí para guiarte en cada paso.',
      backgroundImage: await uploadImage(client, d.challengeBand.backgroundImage),
      primaryCtaLabel: 'Reto de la Cima',
      secondaryCtaLabel: 'Comienza tu Escalada',
    },
    routeSelector: {
      heading: 'Rutas y Mapas de Escalada al Kilimanjaro',
      tabs: await Promise.all([
        {
          name: 'Route Machame',
          body: 'Conocida como la Whiskey Route, Machame es la ruta más popular del Kilimanjaro, que ofrece paisajes impresionantes y un terreno variado. Aunque exigente, con senderos empinados y campamentos en tienda, ofrece una excelente aclimatación para escaladores que buscan un trek más corto pero gratificante.',
          map: d.routeSelector.tabs[0].map,
        },
        {
          name: 'Route Lemosho',
          body: 'Una de las rutas más pintorescas del Kilimanjaro, Lemosho comienza en la remota Puerta de Londorossi y atraviesa la espectacular meseta de Shira. Al final, existe una ruta para todos los que desean vivir la aventura de escalar el Kilimanjaro.',
          map: d.routeSelector.tabs[1].map,
        },
        {
          name: 'Route Rongai',
          body: 'Única ruta del norte del Kilimanjaro, Rongai es menos concurrida y más suave, lo que la convierte en una excelente opción para quienes prefieren una escalada tranquila y constante. Esta ruta es ideal durante la temporada de lluvias, ya que recibe menos precipitaciones y ofrece un trekking agradable a través de una naturaleza virgen.',
          map: d.routeSelector.tabs[2].map,
        },
        {
          name: 'Route Northern Circuit',
          body: 'La ruta más larga y pintoresca, el Northern Circuit ofrece la mejor aclimatación al rodear gradualmente el Kilimanjaro. Con vistas panorámicas y una alta tasa de éxito, esta ruta ofrece una experiencia de trekking tranquila e inmersiva.',
          map: d.routeSelector.tabs[3].map,
        },
      ].map(async (tab) => ({_type: 'routeTab', _key: key(), name: tab.name, body: tab.body, map: await uploadImage(client, tab.map)}))),
    },
    conquerBand: {
      heading: 'Conquista el Kilimanjaro. Vive la Aventura.',
      body: 'Supera tus límites y alcanza el punto más alto de África. ¡Acepta el reto del Kilimanjaro y convierte tu sueño en realidad!',
      backgroundImage: await uploadImage(client, d.conquerBand.backgroundImage),
      primaryCtaLabel: 'Domina África',
      secondaryCtaLabel: 'Comienza tu Escalada',
      primaryCtaHref: d.conquerBand.primaryCtaHref,
      secondaryCtaHref: d.conquerBand.secondaryCtaHref,
    },
    promoStrip: {
      heading: 'Conquista el Kilimanjaro. Vive la Aventura.',
      cards: await Promise.all([
        {
          title: '📖 Consulta Nuestra Guía del Kilimanjaro',
          body: 'Obtén toda la información esencial para preparar tu escalada. Nuestra guía cubre todo, desde rutas hasta consejos de seguridad, para una ascensión fluida y exitosa.',
          linkLabel: 'Leer Más',
          href: d.promoStrip.cards[0].href,
          backgroundImage: d.promoStrip.cards[0].backgroundImage,
        },
        {
          title: '🎯 Consejos de Expertos para tu Escalada',
          body: 'Aunque el Kilimanjaro recibe a escaladores de todos los niveles, es esencial hacer trekking con precaución. Nuestros guías experimentados supervisan tu salud y te ofrecen un apoyo completo para un viaje seguro y agradable.',
          linkLabel: 'Leer Más',
          href: d.promoStrip.cards[1].href,
          backgroundImage: d.promoStrip.cards[1].backgroundImage,
        },
        {
          title: '🎒 Tu Lista de Equipaje para el Kilimanjaro',
          body: 'Prepárate al máximo con nuestra completa lista de equipaje, que detalla todo el material esencial que necesitarás para una escalada cómoda y exitosa.',
          linkLabel: 'Ver Lista de Equipaje',
          href: d.promoStrip.cards[2].href,
          backgroundImage: d.promoStrip.cards[2].backgroundImage,
        },
      ].map(async (card) => ({
        _type: 'promoCard',
        _key: key(),
        title: card.title,
        body: card.body,
        linkLabel: card.linkLabel,
        href: card.href,
        backgroundImage: await uploadImage(client, card.backgroundImage),
      }))),
    },
    infoTabs: [
      {
        _type: 'routeChoicesTab',
        _key: key(),
        label: 'Elección de Ruta',
        heading: '¿Qué Rutas Están Disponibles para el Kilimanjaro?',
        intro: segmentParagraphsToPt([
          [
            {
              text: 'El Monte Kilimanjaro ofrece varias rutas adaptadas a escaladores de todos los niveles, preferencias y estilos de trekking. Cada ruta ofrece una experiencia única, que va desde un ritmo relajado hasta una aventura más exigente, con alojamientos que van desde el campamento hasta instalaciones más cómodas.',
            },
          ],
          [
            {text: 'En '},
            {text: 'Asili Explorer African Safaris,', bold: true},
            {text: ' nos especializamos en las cuatro rutas más populares del Kilimanjaro: '},
            {text: 'Route Rongai, Route Lemosho, Route Northern Circuit y Route Machame.', bold: true},
            {text: ' Nuestras escaladas guiadas garantizan seguridad, una aclimatación adecuada y un viaje inolvidable hasta la cima.'},
          ],
        ]),
        faqCards: [
          {
            question: '¿Cuál es la ruta menos concurrida del Kilimanjaro?',
            answer: [
              {text: 'La '},
              {text: 'Route Northern Circuit', accent: true},
              {text: ' es la menos concurrida, y ofrece una experiencia de trekking tranquila y aislada.'},
            ],
          },
          {
            question: '¿Cuál es la ruta más fácil para escalar el Kilimanjaro?',
            answer: [
              {text: 'La '},
              {text: 'Route Rongai', accent: true},
              {text: ' se considera la más fácil gracias a sus pendientes progresivas y su ascenso directo.'},
            ],
          },
          {
            question: '¿Cuál es la ruta más pintoresca del Kilimanjaro?',
            answer: [
              {text: 'La '},
              {text: 'Route Lemosho', accent: true},
              {text: ' suele considerarse la más pintoresca, con paisajes impresionantes, ecosistemas variados y vistas panorámicas.'},
            ],
          },
        ].map((card) => ({_type: 'richFaqCard', _key: key(), question: card.question, answer: segmentsToRichText(card.answer)})),
        closingNote: segmentsToRichText([
          {text: 'Al final, existe una ruta para todos los que desean vivir la aventura de '},
          {text: 'escalar el Kilimanjaro.', bold: true},
        ]),
      },
      {
        _type: 'routesComparisonTab',
        _key: key(),
        label: 'Comparación de Rutas',
        heading: '¿Cómo se Comparan las Rutas del Kilimanjaro?',
        table: {
          _type: 'dataTable',
          columns: ['Nombre de la Ruta', 'Nivel de Dificultad', 'Longitud (km)', 'Duración (días)', 'Afluencia', 'Precio (USD)', 'Tasa de Éxito (%)'],
          rows: [{_type: 'tableRow', _key: key(), cells: ['Northern Circuit', 'De Moderado a Difícil', '90', '9-10', 'Baja', '2.500–3.500 $', '95']}],
        },
        noteLabel: 'NOTA:',
        noteBody:
          'Los precios y las tasas de éxito son aproximados y pueden variar según factores como el tamaño del grupo, la aclimatación y las condiciones meteorológicas.',
      },
      {
        _type: 'bestTimeTab',
        _key: key(),
        label: 'Mejor Época para Escalar',
        heading: '¿Cuándo Deberías Escalar el Kilimanjaro?',
        intro: segmentParagraphsToPt([
          [
            {text: 'La mejor época para escalar el Kilimanjaro va de '},
            {text: 'junio a marzo', accent: true},
            {text: '. Sin embargo, debido a los patrones climáticos cambiantes, las condiciones pueden variar.'},
          ],
          [
            {
              text: 'Durante este período, el clima suele ser más seco y estable, con cielos más despejados y mejores condiciones de escalada. Esto reduce el riesgo de lluvia, nieve y poca visibilidad, mejorando tanto la seguridad como el disfrute del viaje.',
            },
          ],
        ]),
        cards: [
          {
            title: 'Consideraciones sobre la Temperatura:',
            bullets: [
              [
                {text: 'Las temperaturas diurnas oscilan entre '},
                {text: '20°C y 27°C', accent: true},
                {text: ' a menor altitud, pero descienden bajo cero a mayor altitud, especialmente por la noche.'},
              ],
              [
                {text: 'La ropa por capas', accent: true},
                {text: ' es esencial para adaptarse a las variaciones de temperatura durante toda la escalada.'},
              ],
            ],
          },
          {
            title: 'Vegetación y Paisajes:',
            bullets: [
              [{text: 'Las temporadas secas ofrecen vistas más despejadas, flores silvestres en floración y bosques exuberantes a lo largo de los senderos.'}],
              [{text: 'Las temporadas más húmedas pueden traer condiciones de neblina y una densa cobertura de nubes.'}],
            ],
          },
          {
            title: 'Niveles de Afluencia:',
            bullets: [
              [
                {text: 'Las temporadas altas', accent: true},
                {text: ' (enero-febrero y julio-septiembre) atraen a más escaladores.'},
              ],
              [
                {text: 'Las temporadas intermedias', accent: true},
                {text: ' (finales de marzo-mayo y noviembre-principios de diciembre) ofrecen experiencias más tranquilas.'},
              ],
            ],
          },
          {
            title: 'Preferencias Personales y Objetivos:',
            bullets: [
              [
                {
                  text: 'Los escaladores deben considerar las condiciones climáticas, sus preferencias de temperatura, el nivel de afluencia y su propio calendario al planificar su ascenso.',
                },
              ],
              [{text: 'Las oportunidades de observación de fauna y las preferencias paisajísticas también pueden influir en la decisión.'}],
            ],
          },
        ].map((card) => ({
          _type: 'bestTimeCard',
          _key: key(),
          title: card.title,
          bullets: card.bullets.map((bullet) => ({_type: 'bulletItem', _key: key(), body: segmentsToRichText(bullet)})),
        })),
        closingNote: segmentsToRichText([
          {text: 'Para una recomendación personalizada sobre la mejor época según tus objetivos, consulta a nuestros guías expertos del Kilimanjaro en '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: '.'},
        ]),
      },
      {
        _type: 'climbCostTab',
        _key: key(),
        label: 'Costo de la Escalada',
        heading: '¿Cuánto Cuesta Escalar el Kilimanjaro?',
        intro: segmentsToRichText([
          {text: 'El costo de escalar el Kilimanjaro varía de '},
          {text: '2.500 $ a 4.000 $', accent: true},
          {text: ', dependiendo de:'},
        ]),
        items: [
          'La elección de la ruta',
          'La duración de la escalada',
          'El tamaño del grupo',
          'El nivel de servicio (Clásico o Premium)',
          'Lo que está incluido o excluido del paquete',
        ],
        closingNote: segmentsToRichText([
          {text: 'Aunque el presupuesto es importante, '},
          {text: 'la seguridad y la calidad', bold: true},
          {text: ' deben ser las máximas prioridades al elegir un operador de escaladas. En '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ', garantizamos guías bien capacitados, altos estándares de seguridad y una experiencia general excepcional.'},
        ]),
      },
      {
        _type: 'climbingInsightsTab',
        _key: key(),
        label: 'Consejos para la Escalada',
        heading: 'Consejos Importantes para una Escalada Exitosa',
        intro: segmentsToRichText([
          {text: 'Alcanzar la cima de la montaña independiente más alta del mundo no es tarea fácil. '},
          {text: 'Una buena preparación es esencial.', bold: true},
          {text: ' Aquí tienes algunos consejos clave:'},
        ]),
        tips: [
          {label: 'Ve Despacio:', description: 'Un ritmo constante reduce el riesgo de mal de altura y agotamiento.'},
          {label: 'Hidrátate:', description: 'Bebe mucha agua para favorecer la aclimatación.'},
          {
            label: 'Consigue el Equipo Adecuado:',
            description: 'Invierte en capas de ropa adecuadas, botas de trekking resistentes y equipo de calidad.',
          },
          {
            label: 'Prepárate Física y Mentalmente:',
            description: 'El cardio y el entrenamiento de fuerza fortalecerán tu resistencia, mientras que la determinación mental te ayudará a seguir adelante.',
          },
          {label: 'Disfruta y Haz Amigos:', description: 'Crear vínculos con otros escaladores hace que el viaje sea más gratificante.'},
        ].map((tip) => ({_type: 'tip', _key: key(), label: tip.label, description: tip.description})),
        closingNote:
          'Siguiendo estos consejos, maximizarás tus posibilidades de alcanzar la cima disfrutando de cada paso de la escalada.',
      },
      {
        _type: 'guidedClimbsTab',
        _key: key(),
        label: 'Escaladas Guiadas',
        heading: '¿Necesitas un Guía para Escalar el Kilimanjaro?',
        intro: segmentsToRichText([
          {text: '¡Sí! Escalar el Kilimanjaro sin un guía autorizado no está '},
          {text: 'permitido.', bold: true},
        ]),
        faqs: [
          {
            question: '¿Por qué necesito un guía?',
            answer:
              'Los guías aportan su experiencia, supervisan tu salud, garantizan tu seguridad y te ayudan a orientarte en el exigente terreno del Kilimanjaro.',
          },
          {
            question: '¿Los escaladores experimentados pueden prescindir de un guía?',
            answer:
              'Incluso los escaladores experimentados deben ir acompañados de un guía. La gran altitud y las condiciones impredecibles hacen que el apoyo profesional sea indispensable.',
          },
          {
            question: '¿Cómo mejoran los guías la seguridad?',
            answer:
              'Los guías supervisan la aclimatación, proporcionan primeros auxilios, evalúan las condiciones climáticas y toman decisiones críticas para el éxito de la escalada.',
          },
        ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
        closingNote: segmentsToRichText([
          {text: 'En '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ', ofrecemos guías experimentados y certificados para garantizar una aventura en el Kilimanjaro segura, bien organizada y memorable.'},
        ]),
        ctaLabel: 'Ver Guía del Kilimanjaro',
        ctaHref: d.infoTabs.guidedClimbs.ctaHref,
      },
    ],
    reviews: {
      tripAdvisor: {
        heading: 'Déjanos una Reseña en TripAdvisor',
        cardHeading: 'TripAdvisor Celebra a Asili Climbing Kilimanjaro',
        cardBody:
          'Con más de 779 reseñas y en aumento, un impresionante 95% nos califica como Excelente y un 5% como Muy Bueno, lo que demuestra nuestro compromiso de ofrecer experiencias inolvidables de safari y trekking.',
        cards: [
          {
            name: 'Pastacieo',
            date: 'Ago. 2024',
            title: '¡La Escalada de mi Vida!',
            quote:
              '¡Nuestra escalada al Kilimanjaro con Asili Climbing Kilimanjaro fue verdaderamente extraordinaria! De principio a fin, el equipo garantizó una experiencia inolvidable, haciendo que nuestro viaje a la cima fuera fluido, seguro y memorable.',
          },
          {
            name: 'Danny G',
            date: 'Sept. 2023',
            title: 'Una Caminata Fuera de lo Común',
            quote:
              'No sorprende que Asili Climbing Kilimanjaro mantenga una reputación de 5 estrellas. Su experiencia, profesionalismo y compromiso con la satisfacción del cliente los distinguen. Si buscas la mejor empresa de trekking al Kilimanjaro, ¡no busques más!',
          },
          {
            name: 'Christian R',
            date: 'Sept. 2024',
            title: 'Trekking al Kilimanjaro Muy Recomendado',
            quote:
              'En octubre de 2023, completamos un trekking de seis días hasta la cima del Kilimanjaro con Asili Climbing Kilimanjaro. La experiencia fue fenomenal, y lo recomiendo ampliamente a cualquiera que esté considerando esta aventura.',
          },
        ].map((card) => ({_type: 'reviewCard', _key: key(), name: card.name, date: card.date, title: card.title, quote: card.quote})),
      },
      google: {
        cardHeading: 'Las Reseñas de Google Elogian Nuestro Servicio',
        cardBody:
          'Con más de 99 reseñas de cinco estrellas, Asili Climbing Kilimanjaro sigue superando las expectativas, ofreciendo un servicio de primer nivel, tours guiados por expertos y aventuras únicas en la vida.',
      },
    },
  })
  console.log('climbingKilimanjaroPage-es created/replaced')
}

// ---------- siteSettings-es ----------

async function seedSiteSettingsEs() {
  const navGroupLabelsEs = ['Kilimanjaro y Safari', 'Rutas del Kilimanjaro', 'Por Qué Viajar con Nosotros']
  const navGroupLinkLabelsEs = [
    ['9 Días Kilimanjaro y Safari', '10 Días Kilimanjaro y Safari', '11 Días Kilimanjaro y Safari', '12 Días Kilimanjaro y Safari'],
    [
      '5 Días Route Marangu',
      '6 Días Route Machame',
      '6 Días Route Marangu',
      '6 Días Route Umbwe',
      '7 Días Route Lemosho',
      '7 Días Route Machame',
      '7 Días Route Rongai',
      '8 Días Route Lemosho',
      '9 Días Route Northern Circuit',
    ],
    ['Safari'],
  ]
  const topLinkLabelsEs = ['Blog', 'Contacto']

  const columnHeadingsEs = ['Escalada', 'EMPRESA', 'SOPORTE', 'Enlaces Rápidos']
  const columnLinkLabelsEs = [
    [
      'El Monte Kilimanjaro',
      'Rutas del Kilimanjaro',
      'Paquetes del Kilimanjaro',
      'Paquetes Combinados',
      'Guía del Kilimanjaro',
      'Lista de Equipaje',
      'Salidas Grupales',
      'Trekking Privados',
      'Tours de Lujo',
      'Tours a Zanzibar',
    ],
    [
      'Sobre CKT',
      'Por Qué Viajar con Nosotros',
      'Términos y Condiciones',
      'Guía de Montaña',
      'Opiniones',
      'Guía Conductor de Safari',
      'Valores Fundamentales',
      'Vehículo de Safari',
      'Contáctanos',
    ],
    ['Notas de Viaje Kili', 'Notas de Viaje Safari', 'Métodos de Pago', 'Política de Privacidad', 'Consejos de Viaje'],
    ['Calendario de Viajes a África', 'Conoce a Nuestro Equipo', 'Opiniones de Clientes', 'Nuestro Blog de Viajes', 'Premios'],
  ]
  const legalLinkLabelsEs = ['Política de Privacidad', 'Términos y Condiciones', 'Política de Cookies']

  await client.createOrReplace({
    _id: 'siteSettings-es',
    _type: 'siteSettings',
    language: 'es',
    info: {
      name: siteInfo.name,
      tagline: 'La Mejor Agencia para el Monte Kilimanjaro - Asili Climbing Kilimanjaro',
      phone: siteInfo.phone,
      email: siteInfo.email,
    },
    nav: {
      groups: siteNav.groups.map((group, gi) => ({
        _type: 'navGroup',
        _key: key(),
        label: navGroupLabelsEs[gi],
        ...(group.href ? {href: group.href} : {}),
        links: group.links.map((link, li) => navLink(link, navGroupLinkLabelsEs[gi][li])),
      })),
      links: siteNav.links.map((link, i) => navLink(link, topLinkLabelsEs[i])),
    },
    footer: {
      newsletterHeading: '¿Sigues Buscando el Viaje Perfecto?',
      newsletterSubheading: '¡Recibe inspiración semanal directamente en tu bandeja de entrada!',
      columns: siteFooter.columns.map((column, ci) => ({
        _type: 'footerColumn',
        _key: key(),
        heading: columnHeadingsEs[ci],
        links: column.links.map((link, li) => navLink(link, columnLinkLabelsEs[ci][li])),
      })),
      contact: {
        phone: siteFooter.contact.phone,
        email: siteFooter.contact.email,
        address: siteFooter.contact.address,
      },
      copyright: '© Copyright 2025 Asili Climbing Kilimanjaro. Todos los derechos reservados.',
      legalLinks: siteFooter.legalLinks.map((link, i) => navLink(link, legalLinkLabelsEs[i])),
    },
  })
  console.log('siteSettings-es created/replaced')
}

async function run() {
  await seedHomeEs()
  await seedClimbEs()
  await seedSiteSettingsEs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
