/**
 * Phase 6 (Spanish): sharedTripContent singleton and the two remaining hub-page
 * singletons (packagesHubPage, comboHubPage). routesHubPage-es is seeded in
 * seed-es-routes.ts. Mirrors seed-it-shared-hubs.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-shared-hubs.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const badges = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((b) => ({_type: typeName, _key: key(), title: b.title, description: b.description}))

async function seedSharedEs() {
  await client.createOrReplace({
    _id: 'sharedTripContent-es',
    _type: 'sharedTripContent',
    language: 'es',
    routeTrustBadges: [
      {title: 'La Mejor Opción en TripAdvisor', subtitle: 'Altamente Valorados por los Viajeros', description: 'Con cientos de reseñas excelentes, nuestra dedicación a la calidad y a la satisfacción del cliente nos distingue entre los operadores turísticos del Kilimanjaro.'},
      {title: 'De Confianza y con Experiencia', subtitle: 'Guiando con Integridad', description: 'Nuestros guías, altamente capacitados, garantizan una ascensión bien acompañada, priorizando la seguridad, un trekking ético y un camino fluido hacia la cumbre.'},
      {title: 'Con Sede en Tanzania', subtitle: 'Expertos Locales, Tours Exclusivos', description: 'Organizamos experiencias de trekking personalizadas al Kilimanjaro, desde ascensiones económicas hasta expediciones de lujo, todas basadas en prácticas de escalada responsables y éticas.'},
    ].map((b) => ({_type: 'routeTrustBadge', _key: key(), title: b.title, subtitle: b.subtitle, description: b.description})),
    routeCtaBand: {
      heading: '¿Listo para Afrontar el Reto del Kilimanjaro?',
      body: 'Tu viaje hacia el Techo de África comienza aquí. Ya sea que busques una aventura única en la vida o quieras superar tus límites hasta alcanzar la cumbre, estamos aquí para guiarte en cada paso del camino.',
      buttons: [
        {_type: 'ctaButton', _key: key(), label: 'Reto a la Cumbre', href: '/contact-us/', variant: 'outline'},
        {_type: 'ctaButton', _key: key(), label: 'Comienza a Escalar', href: '/contact-us/', variant: 'solid'},
      ],
      image: await uploadImage(client, {src: '/images/routes/shared/section-bg.webp', alt: 'Rocas del cráter del Kilimanjaro brillando al amanecer'}),
    },
    hubCtaBandImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'Silueta de un excursionista contemplando el amanecer desde el Monte Kilimanjaro'}),
    routeGuidePromos: [
      {color: 'bg-primary', heading: 'Consulta Nuestra Guía del Kilimanjaro', body: 'Obtén toda la información esencial para preparar tu ascensión. Nuestra guía cubre todo, desde las rutas hasta los consejos de seguridad, garantizando una ascensión fluida y exitosa.', ctaLabel: 'Leer Más', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-secondary', heading: 'Consejos de Expertos para Tu Ascensión', body: 'Aunque el Kilimanjaro recibe a escaladores de todos los niveles, es fundamental hacer trekking con precaución. Nuestros guías experimentados supervisan tu salud y te ofrecen un apoyo completo para un viaje seguro y placentero.', ctaLabel: 'Leer Más', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-[#a05a52]', heading: 'Tu Lista de Equipaje para el Kilimanjaro', body: "Prepárate al máximo con nuestra completa lista de equipaje, que detalla todo el material y equipo esencial que necesitarás para una ascensión cómoda y exitosa.", ctaLabel: 'Leer Más', href: '/kilimanjaro-packing-list/'},
    ].map((p) => ({_type: 'guidePromo', _key: key(), color: p.color, heading: p.heading, body: p.body, ctaLabel: p.ctaLabel, href: p.href})),
    routeRelatedGuides: [
      {label: 'El Mejor Momento para Escalar el Kilimanjaro', href: '/best-time-to-climb-kilimanjaro/'},
      {label: 'Costo de la Ascensión al Kilimanjaro', href: '/kilimanjaro-climb-cost/'},
      {label: 'Lista de Equipaje para el Kilimanjaro', href: '/kilimanjaro-packing-list/'},
      {label: 'Ascensión en Solitario al Kilimanjaro', href: '/solo-kilimanjaro-climb/'},
      {label: '¿Es Segura la Ascensión al Kilimanjaro?', href: '/is-climbing-kilimanjaro-safe/'},
      {label: 'Los Porteadores del Kilimanjaro', href: '/kilimanjaro-porters/'},
      {label: 'La Comida en el Kilimanjaro', href: '/kilimanjaro-food/'},
      {label: 'El Mal de Altura en el Kilimanjaro', href: '/kilimanjaro-altitude-sickness/'},
      {label: 'Ascensión al Kilimanjaro con Luna Llena', href: '/kilimanjaro-fullmoon-climb/'},
      {label: 'Un Día Típico en el Kilimanjaro', href: '/typical-day-on-kilimanjaro/'},
      {label: 'Safaris en el Kilimanjaro', href: '/kilimanjaro-safaris/'},
      {label: 'Datos Curiosos del Monte Kilimanjaro', href: '/mount-kilimanjaro-facts/'},
      {label: 'Cómo Llegar al Kilimanjaro', href: '/getting-to-kilimanjaro/'},
    ].map((g) => ({_type: 'navLink', _key: key(), label: g.label, href: g.href})),
    routeReviewStats: {
      tripAdvisor: {
        heading: 'Déjanos una Reseña en TripAdvisor',
        subheading: 'TripAdvisor Celebra a Asili Explorer African Safaris',
        body: 'Con más de 779 reseñas y en aumento, un impresionante 95% nos califica como Excelente y un 5% como Muy Bueno, lo que demuestra nuestra dedicación a ofrecer experiencias de safari y trekking inolvidables.',
      },
      google: {
        subheading: 'Las Reseñas de Google Elogian Nuestro Servicio',
        body: 'Con más de 99 reseñas de cinco estrellas, Asili Explorer African Safaris sigue superando las expectativas, ofreciendo un servicio de primer nivel, tours guiados por expertos y aventuras únicas en la vida.',
      },
    },
    routeTestimonials: [
      {
        name: 'Pastacieo',
        timeAgo: 'Ago. 2024',
        heading: '¡La Escalada de Mi Vida!',
        quote: [{text: 'Nuestra ascensión al Kilimanjaro con '}, {text: 'Asili Explorer African Safaris', bold: true}, {text: ' fue realmente extraordinaria. De principio a fin, el equipo garantizó una experiencia inolvidable, haciendo que nuestro camino hacia la cumbre fuera fluido, seguro y memorable.'}],
      },
      {
        name: 'Danny G',
        timeAgo: 'Sep. 2023',
        heading: 'Una Caminata como Ninguna Otra',
        quote: [{text: 'No sorprende que Asili Explorer African Safaris mantenga una '}, {text: 'reputación de 5 estrellas', bold: true}, {text: '. Su experiencia, profesionalismo y dedicación a la satisfacción del cliente los distinguen. Si buscas la mejor empresa de trekking al Kilimanjaro, ¡no busques más!'}],
      },
      {
        name: 'Christian R',
        timeAgo: 'Sep. 2024',
        heading: 'Trekking al Kilimanjaro Muy Recomendado',
        quote: [{text: 'En octubre de 2023, completamos un '}, {text: 'trekking de seis días hasta la cumbre del Kilimanjaro', bold: true}, {text: ' con Asili Explorer African Safaris. La experiencia fue fenomenal, y los recomiendo encarecidamente a cualquiera que esté planeando esta aventura.'}],
      },
    ].map((t) => ({_type: 'routeTestimonial', _key: key(), name: t.name, timeAgo: t.timeAgo, heading: t.heading, quote: [segmentsToBlock(t.quote)]})),
    routeGuestReviews: {
      heading: 'Lo Que Dicen Nuestros Huéspedes',
      items: [
        {name: 'Chelsea H', summitDate: 'Cumbre alcanzada el: 27 de enero de 2024', heading: 'Una Experiencia Increíble', quote: 'Descubrimos Asili Explorer African Safaris a través del Kilimanjaro Porters Assistance Project, ya que queríamos apoyar a una empresa que trata bien a sus porteadores…'},
        {name: 'Fabiola N', summitDate: 'Cumbre alcanzada el: 30 de agosto de 2024', heading: '¡Una Luna de Miel Increíble!', quote: '¡Nuestra experiencia con Asili Explorer African Safaris fue simplemente fantástica! Desde el momento en que empezamos a planificar, supimos que estábamos en muy buenas manos. Albin, de manera meticulosa…'},
        {name: 'Adeline P', summitDate: 'Cumbre alcanzada el: 29 de septiembre de 2024', heading: 'Las Mejores Vacaciones de Mi Vida', quote: '¡Mi amiga y yo tuvimos una experiencia absolutamente INCREÍBLE con Asili Explorer African Safaris! De principio a fin, cada detalle se gestionó con cuidado y precisión…'},
        {name: 'Anastasia F', summitDate: 'Cumbre alcanzada el: 10 de agosto de 2024', heading: '¡La Escalada de Mi Vida!', quote: '¡Nuestra ascensión al Kilimanjaro con Asili Explorer African Safaris fue sencillamente extraordinaria! Nuestro guía, Godwin, fue fenomenal — su amplio conocimiento…'},
      ].map((r) => ({_type: 'guestReview', _key: key(), name: r.name, summitDate: r.summitDate, heading: r.heading, quote: r.quote})),
    },
    routePackagesCta: {
      heading: 'Paquetes de Ascensión al Kilimanjaro',
      body: 'Elige entre nuestros paquetes de ascensión al Kilimanjaro, cuidadosamente diseñados para ofrecerte la mejor experiencia según tus preferencias, tu nivel de forma física y la ruta deseada. Ya sea que busques una ascensión rápida o un trekking panorámico y prolongado, tenemos el itinerario perfecto para ti.',
      ctaLabel: 'Ver Paquetes',
      href: '/kilimanjaro-packages/',
    },
    packageTrustBadges: badges('packageBadge', [
      {title: 'Mejor Garantía de Servicio', description: 'Guías de montaña certificados, cocinero y porteadores'},
      {title: 'Respuesta Rápida', description: 'Asistencia las 24 horas, los 7 días de la semana'},
    ]),
    packageStandardIntro:
      'En Asili Climbing Kilimanjaro, creemos que cada excursionista es único. Por eso, todos nuestros itinerarios son flexibles y pueden adaptarse a tu ritmo, tus preferencias y tus objetivos. Déjanos ayudarte a crear una aventura de montaña única en la vida.',
    packageInterestedCta: {
      heading: '¿Interesado en Este Itinerario?',
      body: '¡Si este itinerario te entusiasma, no esperes más! Asegura tu plaza ahora y prepárate para un viaje inolvidable lleno de experiencias increíbles. ¡Reserva tu viaje hoy y que comience la aventura!',
      ctaLabel: 'Reserva Este Itinerario',
    },
    packageExpertCta: {
      heading: 'Convierte tus Vacaciones Soñadas en Realidad con un Experto en Tanzania.',
      body: 'Con un experto en Tanzania, puedes personalizar tu aventura. Nuestros itinerarios sugeridos se pueden adaptar a tus preferencias. ¡Nuestros especialistas colaboran contigo para diseñar tu viaje perfecto!',
      ctaLabel: 'Solicita un Presupuesto Ahora',
    },
    packageHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: 'Tiendas de campaña bajo la Vía Láctea a los pies de la cumbre del Monte Kilimanjaro'}),
    comboTrustBadges: badges('comboBadge', [
      {title: 'Mejor Garantía de Precio y Servicio', description: 'Los mejores guías-conductores de safari'},
      {title: 'Respuesta Rápida', description: 'Asistencia las 24 horas, los 7 días de la semana'},
    ]),
    comboPriceDisclaimer: '*Precio por persona, incluye guía, vehículo de safari, hotel y tasas de entrada a los parques, no incluye el vuelo internacional (basado en seis personas)',
    comboStandardIntro:
      'Haz realidad el viaje de tus sueños con Asili Climbing Kilimanjaro. En Asili Explorer Tanzania Safari, puedes personalizar tu viaje. Nuestros itinerarios de ejemplo son ajustables según tus preferencias.',
    comboHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: 'Tiendas de campaña bajo la Vía Láctea a los pies de la cumbre del Monte Kilimanjaro'}),
    safariTrustBadges: badges('safariBadge', [
      {title: 'Mejor Garantía de Precio y Servicio', description: 'Los mejores guías-conductores de safari'},
      {title: 'Respuesta Rápida', description: 'Asistencia las 24 horas, los 7 días de la semana'},
    ]),
    safariInterestedCta: {
      heading: '¿Interesado en Este Itinerario?',
      body: '¡Si este itinerario te entusiasma, no esperes más! Asegura tu plaza ahora y prepárate para un viaje inolvidable lleno de experiencias increíbles. ¡Reserva tu viaje hoy y que comience la aventura!',
      ctaLabel: 'Reserva Este Itinerario',
    },
  })
  console.log('sharedTripContent-es created/replaced')
}

async function seedPackagesHubEs() {
  const cards = [
    {title: 'Route Lemosho 8 Días', slug: '8-days-lemosho-route', nights: '7 noches', summary: 'Con ocho días de viaje, tu trekking al Kilimanjaro por la Route Lemosho dura más que las alternativas.', image: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho 8 Días'}},
    {title: 'Route Machame 7 Días', slug: '7-days-machame-route', nights: '6 noches', summary: 'Recorre la popular Route Machame, con un tiempo total de viaje de siete días, lo que te da aún más tiempo para la aclimatación', image: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Route Machame 7 Días'}},
    {title: 'Route Marangu 6 Días', slug: '6-days-marangu-route', nights: '5 noches', summary: 'Un viaje de seis días para ascender el pico más alto de África a través de la popular Route Marangu. Espera una variedad de paisajes…', image: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Route Marangu 6 Días'}},
    {title: 'Route Umbwe 6 Días', slug: '6-days-umbwe-route', nights: '5 noches', summary: 'La Route Umbwe es conocida por su exigente y empinada ascensión y por su impresionante sendero, poco transitado.', image: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Route Umbwe 6 Días'}},
    {title: 'Northern Circuit 9 Días', slug: '9-days-northern-circuit-route', nights: '8 noches', summary: 'La ruta más reciente y más larga, que ofrece vistas de 360 grados y las mejores tasas de éxito para alcanzar la cumbre.', image: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit 9 Días'}},
    {title: 'Route Rongai 7 Días', slug: '7-days-rongai-route', nights: '6 noches', summary: 'Abordada desde el norte, esta ruta ofrece una perspectiva única del Kilimanjaro y es perfecta para quienes…', image: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai 7 Días'}},
  ]
  await client.createOrReplace({
    _id: 'packagesHubPage-es',
    _type: 'packagesHubPage',
    language: 'es',
    hero: {
      eyebrow: 'El Techo de África.',
      heading: 'Paquetes de Ascensión al Monte Kilimanjaro',
      locationPill: 'Norte de Tanzania',
      tagline: 'Elige tu Ruta. Escala a tu Manera.',
      introHeading: 'Paquetes de Ascensión al Kilimanjaro',
      intro: 'Explora nuestra gama de paquetes al Kilimanjaro, cada uno diseñado para adaptarse a tu estilo de aventura, tu nivel de forma física y tu horario. Ya sea que busques una ruta popular o una ascensión más tranquila y fuera de lo común, tenemos la opción perfecta para ti.',
    },
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'packageHubCard', _key: key(), title: card.title, packageSlug: card.slug, nights: card.nights, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
  })
  console.log('packagesHubPage-es created/replaced')
}

async function seedComboHubEs() {
  const cards = [
    {title: 'Kilimanjaro y Safari 9 Días', href: '/combo/9-days-kilimanjaro-safari/', nights: '8 noches', summary: 'Perfecto para los aventureros con poco tiempo disponible. Escala el Monte Kilimanjaro a través de una ruta de 6 días, y luego disfruta de un rápido safari de 3 días por los parques emblemáticos de Tanzania, como el Ngorongoro y Tarangire.', image: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: 'Kilimanjaro y Safari 9 Días'}},
    {title: 'Kilimanjaro y Safari 10 Días', href: '/combo/10-days-kilimanjaro-and-safari/', nights: '9 noches', summary: 'Una aventura bien equilibrada que combina una ascensión al Kilimanjaro de 7 días (como la Route Machame) con un safari de fauna de 3 días — ideal para descubrir lo mejor de la montaña y de la sabana.', image: {src: '/images/combo/shared/7-days-machame-route.webp', alt: 'Kilimanjaro y Safari 10 Días'}},
    {title: 'Kilimanjaro y Safari 11 Días', href: '/combo/11-days-kilimanjaro-safari/', nights: '10 noches', summary: 'Esta opción te da tiempo para aclimatarte correctamente durante una ascensión de 7 días, y luego relajarte con un safari de 4 días por el Serengeti, el Ngorongoro y otros parques imprescindibles.', image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Kilimanjaro y Safari 11 Días'}},
    {title: 'Kilimanjaro y Safari 12 Días', href: '/combo/12-days-kilimanjaro-safari/', nights: '11 noches', summary: 'Una experiencia completa para los amantes de la naturaleza. Alcanza la cumbre del pico más alto de África en 8 días (como la Route Lemosho) y continúa con 4 días inolvidables rastreando fauna en safari.', image: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: 'Kilimanjaro y Safari 12 Días'}},
    {title: 'Kilimanjaro y Safari 13 Días', nights: '12 noches', summary: 'Pensado para los viajeros que quieren tomarse su tiempo. Incluye una ascensión al Kilimanjaro más larga y un safari en profundidad, permitiendo tanto un trekking bien ritmado como safaris fotográficos inmersivos.', image: {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: 'Kilimanjaro y Safari 13 Días'}},
    {title: 'Kilimanjaro y Safari 14 Días', nights: '13 noches', summary: 'El viaje definitivo de dos semanas por Tanzania. Comienza con una ruta panorámica y menos concurrida al Kilimanjaro, y luego sumérgete en un circuito de safari completo que recorre el Serengeti, el Ngorongoro, Tarangire y mucho más.', image: {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: 'Kilimanjaro y Safari 14 Días'}},
  ]
  await client.createOrReplace({
    _id: 'comboHubPage-es',
    _type: 'comboHubPage',
    language: 'es',
    intro: {
      heading: 'Paquetes Combinados',
      body: [
        'Escala hasta el techo de África, y luego relájate en plena naturaleza salvaje. Un solo viaje, dos experiencias inolvidables.',
        'En Asili Climbing Kilimanjaro, creemos que la aventura tanzana definitiva va más allá de un único destino. Nuestros Paquetes Combinados de Kilimanjaro y Safari están diseñados para los viajeros que lo quieren todo — el reto de alcanzar la cumbre del Monte Kilimanjaro junto con la emoción de un safari clásico de fauna africana. Estos itinerarios, cuidadosamente elaborados, combinan dos experiencias imprescindibles en un solo viaje fluido y gratificante.',
        'Ya sea que hagas trekking por la icónica Route Lemosho o conquistes la panorámica Route Marangu, tu ascensión puede transformarse sin problemas en un emocionante safari por los parques nacionales más legendarios de Tanzania — el Serengeti, el cráter del Ngorongoro, Tarangire, el lago Manyara y mucho más.',
      ].map(paragraphBlock),
    },
    cards: await Promise.all(
      cards.map(async (card) => ({
        _type: 'comboHubCard',
        _key: key(),
        title: card.title,
        ...(card.href ? {href: card.href} : {}),
        nights: card.nights,
        summary: card.summary,
        image: await uploadImage(client, card.image),
      })),
    ),
    cta: {label: '¿Listo para Afrontar el Reto?', href: '/contact-us/'},
  })
  console.log('comboHubPage-es created/replaced')
}

async function run() {
  await seedSharedEs()
  await seedPackagesHubEs()
  await seedComboHubEs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
