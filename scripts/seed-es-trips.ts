/**
 * Phase 6 (Spanish): Spanish translations for the 15 unified `trip` documents
 * (9 Kilimanjaro packages, 4 combo packages, 2 safaris). Mirrors seed-it-trips.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-trips.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface Img {
  src: string
  alt: string
}

interface FaqEs {
  question: string
  answer: string
}

interface ItineraryDayEs {
  day: number
  label: string
  location?: string
  meta?: string[]
  body: string[]
  overnightStay?: string
  image?: Img
  secondImage?: Img
  lodgeOptions?: {name: string; image: Img}[]
}

interface SafariDayEs {
  day: number
  label: string
  image?: Img
  body: {text: string; bold?: boolean}[][]
  overnightStay?: string
  accommodationTiers?: string[]
}

const seo = (title: string, description: string) => ({_type: 'seo', title, description})

const faqs = (items: FaqEs[]) =>
  items.map((f) => ({_type: 'faqItem', _key: key(), question: f.question, answer: f.answer}))

const paragraphBlock = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

async function dayToDoc(stop: ItineraryDayEs) {
  return {
    _type: 'itineraryDay',
    _key: key(),
    day: stop.day,
    label: stop.label,
    ...(stop.location ? {location: stop.location} : {}),
    ...(stop.meta?.length ? {meta: stop.meta} : {}),
    body: stop.body.map(paragraphBlock),
    ...(stop.overnightStay ? {overnightStay: stop.overnightStay} : {}),
    ...(stop.image ? {image: await uploadImage(client, stop.image)} : {}),
    ...(stop.secondImage ? {secondImage: await uploadImage(client, stop.secondImage)} : {}),
    ...(stop.lodgeOptions?.length
      ? {
          lodgeOptions: await Promise.all(
            stop.lodgeOptions.map(async (lodge) => ({
              _type: 'lodgeOption',
              _key: key(),
              name: lodge.name,
              image: await uploadImage(client, lodge.image),
            })),
          ),
        }
      : {}),
  }
}

const segmentsToBlock = (segments: {text: string; bold?: boolean}[]) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: segments.map((seg) => ({
    _type: 'span',
    _key: key(),
    text: seg.text,
    marks: seg.bold ? ['strong'] : [],
  })),
})

async function safariDayToDoc(stop: SafariDayEs) {
  return {
    _type: 'itineraryDay',
    _key: key(),
    day: stop.day,
    label: stop.label,
    body: stop.body.map(segmentsToBlock),
    ...(stop.overnightStay ? {overnightStay: stop.overnightStay} : {}),
    ...(stop.image ? {image: await uploadImage(client, stop.image)} : {}),
    ...(stop.accommodationTiers?.length ? {accommodationTiers: stop.accommodationTiers} : {}),
  }
}

async function upsertTripEs(slug: string, fields: Record<string, unknown>) {
  const enId = await findEnId(client, 'trip', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const esId = await upsertTranslatedDoc(client, 'trip', slug, 'es', fields)
  await linkTranslationMetadata(client, 'trip', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${slug}-es done (${esId})`)
}

// ---------------------------------------------------------------------------
// Shared fragments (translated once, reused verbatim across trips — mirrors
// the English source's own reuse of `arrival`/`departure`/`includesVariantX`).
// ---------------------------------------------------------------------------

const arrivalEs: ItineraryDayEs = {
  day: 0,
  label: 'Llegada y briefing',
  body: [
    'A tu llegada al Aeropuerto Internacional del Kilimanjaro, serás trasladado a tu alojamiento, donde tu guía realizará un briefing completo y una revisión del equipo para prepararte para la aventura que te espera.',
  ],
  overnightStay: 'Ameg Lodge / Kaliwa Lodge',
  image: {src: '/images/packages/shared/kilimanjaro-airport.jpg', alt: 'Aeropuerto Internacional del Kilimanjaro'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/packages/shared/ameg-lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/packages/shared/kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'}},
  ],
}

const comboArrivalEs = (): ItineraryDayEs => ({
  day: 0,
  label: 'Llegada y briefing',
  body: [
    'A tu llegada al Aeropuerto Internacional del Kilimanjaro, serás trasladado a tu alojamiento, donde tu guía realizará un briefing completo y una revisión del equipo para prepararte para la aventura que te espera.',
  ],
  image: {src: '/images/combo/shared/kilimanjaro-airport.jpg', alt: 'Llegada y briefing'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/combo/shared/Ameg-Lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Kaliwa Lodge'}},
  ],
})

const departureEs: ItineraryDayEs = {
  day: -1,
  label: 'Salida o continuación del viaje',
  body: ['Traslado al Aeropuerto Internacional del Kilimanjaro para tu vuelo de regreso, ¡o continúa tu aventura tanzana!'],
}

const includesVariantAEs = [
  'Guías de montaña profesionales y experimentados, de habla inglesa, además de guías asistentes',
  'Porteadores competentes y cordiales para transportar el equipo y las provisiones',
  'Cocinero y todas las comidas en la montaña (desayuno, almuerzo, cena)',
  'Agua potable (filtrada y tratada) y bebidas calientes durante todo el trek',
  'Tasas y permisos del Parque Nacional del Kilimanjaro',
  'Tasa de rescate',
  'Alojamiento en campamento con tiendas de calidad y colchonetas',
  'Traslados desde y hacia el Aeropuerto Internacional del Kilimanjaro (JRO) y Moshi/Arusha',
  'Certificado de cumbre al finalizar la escalada',
  'Briefing completo antes de la escalada y revisión del equipo',
]
const excludesVariantAEs = [
  'Vuelos internacionales e internos desde/hacia Tanzania',
  'Costos de visado para el ingreso a Tanzania',
  'Propinas para guías, porteadores y cocinero',
  'Equipo de trekking personal (saco de dormir, bastones de trekking, ropa)',
  'Seguro de viaje (obligatorio para la cobertura médica y de evacuación)',
  'Snacks, bebidas alcohólicas y gastos personales',
  'Noches de hotel adicionales antes o después de la escalada (opcionales)',
]

const includesVariantBEs = [
  'Tasas de entrada / derechos de admisión',
  'Tasas de conservación',
  'Todas las actividades mencionadas en el itinerario',
  'Todos los alojamientos indicados en el itinerario',
  'Todos los transportes',
  'Todas las tasas / IVA del 18%',
  'Recogida y traslado al aeropuerto',
  'Todas las comidas indicadas en el itinerario',
]
const excludesVariantBEs = [
  'Cualquier vuelo internacional o local (ida y vuelta desde tu país)',
  'Propinas (orientativamente: 10 $ USA por persona al día)',
  'Efectos personales (souvenirs, seguro de viaje, costos de solicitud de visado, etc.)',
  'Seguro de viaje y repatriación médica',
  'Gastos de naturaleza personal',
]

// Day-body fragments reused verbatim across Machame (7d/6d), Lemosho (7d),
// and Umbwe (6d) — reusing the Spanish text already translated in seed-es-routes.ts.
const bodyMachameGateToCampEs = [
  'Tu viaje comienza con un trayecto de 45 minutos desde Moshi hasta Machame Gate. Después del registro, el trekking comienza por un sendero sinuoso a través de una exuberante selva tropical, la zona más húmeda de la montaña. Espera aguaceros ocasionales por la tarde, que a veces hacen resbaladizo el sendero.',
  'La subida se suaviza progresivamente a medida que te acercas a Machame Camp, situado en la zona de transición entre el bosque y las zonas de brezo gigante.',
]
const bodyMachameCampToShiraEs = [
  'El día comienza con una empinada subida por una cresta, que conduce a Picnic Rock, un fantástico mirador que domina el Kibo y el borde irregular de la meseta de Shira.',
  'El sendero se allana luego al atravesar la meseta de Shira, el tercero de los conos volcánicos del Kilimanjaro, antes de llegar a Shira Camp, donde podrás disfrutar de espléndidas vistas de la montaña.',
]
const bodyShiraToBarrancoViaLavaTowerEs = [
  'Un día de aclimatación exigente pero crucial, atravesarás un terreno desértico de alta montaña hacia la Lava Tower, un pináculo volcánico de 90 metros de altura que ofrece increíbles vistas panorámicas.',
  'Después del almuerzo, desciendes al valle de Barranco, hogar de los únicos senecios gigantes. Este descenso prepara tu cuerpo para la ascensión a la cumbre en altitud que te espera. Barranco Camp se encuentra en un valle pintoresco y resguardado, a los pies de la famosa Barranco Wall.',
]
const bodyBarrancoWallToKarangaEs = [
  'Comienza el día enfrentando la imponente Barranco Wall, una escalada emocionante que te recompensa con vistas impresionantes.',
  'Después de alcanzar la cima a 4.200 m, sigue un sendero pintoresco y ondulado alrededor del flanco de la montaña, con el Monte Meru visible a tu derecha y el Kibo alzándose a tu izquierda.',
  'Un descenso al valle de Karanga es seguido por una subida corta pero empinada hasta Karanga Camp, tu parada para pasar la noche.',
]
const bodyKarangaToBarafuEs = [
  'Una subida constante por la mañana conduce a Barafu Camp, que significa «hielo» en suajili. Este campamento de alta montaña se encuentra en una cresta bajo el cono cumbre y marca la finalización del circuito sur del Kilimanjaro, ofreciendo vistas espectaculares de la cumbre desde varios ángulos.',
  'Llegarás a tiempo para descansar por la tarde y cenar temprano para prepararte para la noche de la cumbre.',
]
const bodySummitToMwekaEs = [
  'A medianoche comienza tu ascenso final hacia la cumbre. El sendero es empinado y exigente, con temperaturas muy por debajo de cero. Al amanecer, la magnífica salida del sol rojo detrás del pico Mawenzi te mantendrá motivado.',
  'Al llegar a Stella Point (5.750 m), caminarás por el borde del cráter antes de llegar a Uhuru Peak (5.895 m), ¡el punto más alto de África!',
  'Después de celebrar en la cumbre, comienza el largo descenso hacia Mweka Camp, atravesando un terreno variado y haciendo una pausa para almorzar en el camino. Esta noche disfrutarás de tu última cena en la montaña.',
]
const bodyMwekaToGateEs = [
  'El descenso final te lleva a través de una exuberante selva tropical, con la posibilidad de avistar monos juguetones en el camino.',
  'En Mweka Gate, recibirás tus certificados de cumbre, y desde el pueblo de Mweka serás trasladado a tu hotel en Moshi.',
]

// Shared safari FAQ block: 8 Q&A used identically in combos (9/10/11-day) and
// both standalone safaris; combos additionally prepend `safariExpectFaqEs`.
const safariExpectFaqEs: FaqEs = {
  question: '¿Qué puedo esperar de un safari en Tanzania con Asili Explorer?',
  answer:
    'Nuestros safaris en Tanzania ofrecen la oportunidad de explorar la increíble fauna y los paisajes magníficos del país. Nos especializamos en safaris privados, lo que significa que dispones de un 4x4 Landcruiser o un jeep solo para ti. Tienes la libertad de decidir cuándo comienza y termina el safari, y nuestros guías experimentados pueden ayudarte a tomar esta decisión el mismo día de tu aventura. Ya quieras observar a los animales cuando están más activos, al amanecer y al atardecer cuando las temperaturas son agradables, o prefieras terminar el día junto a la piscina, la elección es totalmente tuya. La variada fauna de Tanzania está activa en diferentes momentos del día, por lo que tendrás numerosas ocasiones para observar a los animales en acción.',
}
const sharedSafariFaqsEs: FaqEs[] = [
  {
    question: '¿Garantizan la recogida y el traslado al aeropuerto?',
    answer:
      'Sí, garantizamos un inicio y un final de viaje sin contratiempos gracias a los traslados de aeropuerto incluidos en nuestros paquetes de safari — ¡viaja sin preocupaciones desde tu llegada!',
  },
  {
    question: '¿Qué opciones de alojamiento ofrecen durante sus safaris?',
    answer:
      'Desde lodges de gama alta hasta campamentos económicos cómodos, ofrecemos alojamientos variados adaptados a los gustos de cada viajero, combinando comodidad e inmersión en el paisaje salvaje tanzano.',
  },
  {
    question: '¿Necesito una visa para viajar a Tanzania?',
    answer:
      'La mayoría de los visitantes necesitan una visa para explorar Tanzania. Te recomendamos verificar las últimas normas de visado según tu nacionalidad antes de partir.',
  },
  {
    question: '¿Qué debo llevar para un safari en Tanzania?',
    answer:
      'Prevé ropa ligera y cómoda, un sombrero para el sol, protector solar, calzado resistente y una buena cámara para capturar la magia del momento. ¡Nuestro equipo estará encantado de proporcionarte una guía completa de equipaje!',
  },
  {
    question: '¿Sus safaris son adecuados para familias?',
    answer:
      'Sí, diseñamos paquetes de safari familiares llenos de actividades que deleitarán a grandes y pequeños — perfectos para una escapada grupal memorable.',
  },
  {
    question: '¿Podré observar los Big Five durante sus safaris?',
    answer:
      '¡Por supuesto! Nuestros itinerarios te llevan a lugares emblemáticos de la fauna como el Serengeti y el cráter del Ngorongoro, aumentando tus posibilidades de avistar a los icónicos Big Five.',
  },
  {
    question: '¿Cómo puedo pagar mi reserva de safari?',
    answer:
      'Simplificamos las cosas con opciones de pago flexibles, incluidas transferencias bancarias y tarjetas de crédito. Contacta a nuestro equipo para conocer las modalidades de pago paso a paso.',
  },
  {
    question: '¿Qué sucede si necesito modificar o cancelar mi safari?',
    answer:
      '¡La vida es impredecible, lo sabemos! Nuestras políticas de cancelación o aplazamiento están pensadas para los viajeros, aunque las condiciones precisas dependen de los plazos — contáctanos para hablar sobre tu reserva.',
  },
]
const comboPriceDisclaimerEs =
  '*Precio por persona, que incluye guía, vehículo de safari, hotel y tasas de entrada a los parques, excluyendo el vuelo internacional (según base de seis personas)'
const comboFaqsEs: FaqEs[] = [safariExpectFaqEs, ...sharedSafariFaqsEs]
const comboFaqHeadingEs = 'Tus preguntas, nuestras respuestas'
const comboFaqIntroEs =
  '¿Tienes preguntas sobre reservar un safari en Tanzania con nosotros? Consulta nuestras FAQ a continuación para obtener respuestas rápidas. Si no encuentras lo que buscas, no dudes en contactarnos — nuestros expertos están aquí para ayudarte a planificar la aventura tanzana perfecta.'

// FAQ fragments reused verbatim across several packages (mirrors the English
// source repeating the same Q&A text across Machame/Marangu/Umbwe variants).
const faqMachameDifficultyEs: FaqEs = {
  question: '¿Es difícil la Route Machame?',
  answer:
    'La Route Machame, a menudo llamada «Whiskey Route», tiene un nivel de moderado a difícil. Es conocida por su belleza paisajística y su aclimatación gradual, pero algunas secciones empinadas y jornadas largas la hacen físicamente exigente. Sin embargo, con el ritmo adecuado, una buena preparación física y determinación, sigue siendo accesible para la mayoría de los escaladores.',
}
const faqMachameLengthEs = (days: number): FaqEs => ({
  question: '¿Cuán larga es la Route Machame?',
  answer: `La distancia total de trekking para la Route Machame en ${days} días es de aproximadamente 62 km. Ofrece un perfil de subida gradual e incluye un día de aclimatación para aumentar las tasas de éxito en la cumbre.`,
})
const faqBestTimeMachameEs: FaqEs = {
  question: '¿Cuál es la mejor época para escalar el Kilimanjaro por la Route Machame?',
  answer:
    'Las mejores temporadas son los meses secos de enero a marzo y de junio a octubre. Estos meses ofrecen cielos más despejados, menos precipitaciones y condiciones más estables. Evita la temporada larga de lluvias (marzo-mayo) para un trek más seguro y placentero.',
}
const faqAccommodationTentsEs: FaqEs = {
  question: '¿Qué tipo de alojamiento se ofrece?',
  answer:
    'El alojamiento en la Route Machame se realiza en campamentos con tiendas. Dormirás en tiendas de montaña de calidad montadas por el equipo, con colchonetas cómodas y tiendas comedor previstas para las comidas. Los campamentos están bien organizados y rodeados de una naturaleza magnífica.',
}
const faqSummitHeightEs: FaqEs = {
  question: '¿Cuál es la altitud de la cumbre del Kilimanjaro?',
  answer:
    'El punto más alto es Uhuru Peak, que se eleva a 5.895 metros sobre el nivel del mar. Es el objetivo del esfuerzo final desde Barafu Camp, alcanzado de noche y en las primeras horas de la mañana.',
}
const faqSummitDayLengthEs: FaqEs = {
  question: '¿Cuánto dura el día de la cumbre?',
  answer:
    'El día de la cumbre dura generalmente entre 12 y 14 horas, incluyendo la subida hasta Uhuru Peak y el descenso hacia Mweka Camp. Es una jornada difícil con aire enrarecido y temperaturas frías, pero el amanecer impresionante y la sensación de logro hacen este momento inolvidable.',
}
const faqIncludedMachameEs: FaqEs = {
  question: '¿Qué está incluido en la escalada por la Route Machame?',
  answer:
    'Una escalada de calidad incluye guías profesionales, porteadores, tiendas, comidas, tasas de parque y traslados. La mayoría de los paquetes también incluye acompañamiento para la aclimatación, un certificado de cumbre y agua potable segura. Asegúrate de verificar el detalle de las prestaciones incluidas.',
}
const faqAltitudeSicknessMachameEs: FaqEs = {
  question: '¿Es frecuente el mal agudo de montaña?',
  answer:
    'Sí, es una preocupación real. La subida gradual de la Route Machame y un día adicional de aclimatación reducen el riesgo, pero síntomas como dolor de cabeza y náuseas pueden ocurrir de todos modos. Mantenerse hidratado, adaptar el ritmo y escuchar a tu guía son esenciales.',
}
const faqPreparationMachameEs: FaqEs = {
  question: '¿Cómo me preparo para la Route Machame?',
  answer:
    'El entrenamiento es importante. Concéntrate en el cardio (senderismo, carrera, bicicleta) y el fortalecimiento muscular (piernas y core). Entrena caminando con una mochila cargada, e incluye caminatas largas en días consecutivos para desarrollar tu resistencia. También se recomienda la simulación de altitud y la práctica de la hidratación.',
}

interface TripEs {
  slug: string
  category: 'package' | 'combo'
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  priceDisclaimer?: string
  overviewBody: string[]
  mapImage: Img
  mapImageIsPhoto?: boolean
  gallery: Img[]
  itinerary: ItineraryDayEs[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqEs[]
  hubSummary: string
  hubImage: Img
}

async function seedTripEs(data: TripEs) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await dayToDoc(stop))
  await upsertTripEs(data.slug, {
    category: data.category,
    seo: seo(data.seoTitle, data.seoDescription),
    name: data.name,
    durationDays: data.durationDays,
    hero: {
      stopsLine: data.stopsLine,
      ...(data.priceDisclaimer ? {priceDisclaimer: data.priceDisclaimer} : {}),
    },
    overview: {
      body: data.overviewBody.map(paragraphBlock),
      mapImage: await uploadImage(client, data.mapImage),
      ...(data.mapImageIsPhoto !== undefined ? {mapImageIsPhoto: data.mapImageIsPhoto} : {}),
      gallery: await Promise.all(data.gallery.map((img) => uploadImage(client, img))),
    },
    itinerary,
    includes: data.includes,
    excludes: data.excludes,
    faqHeading: data.faqHeading,
    ...(data.faqIntro ? {faqIntro: data.faqIntro} : {}),
    faqs: faqs(data.faqs),
    hubSummary: data.hubSummary,
    hubImage: await uploadImage(client, data.hubImage),
  })
}

interface SafariEs {
  slug: string
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  overviewBody: string[]
  gallery: Img[]
  mapImage?: Img
  itinerary: SafariDayEs[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqEs[]
}

// ---------------------------------------------------------------------------
// 9 Kilimanjaro packages
// ---------------------------------------------------------------------------

const machame7Es: TripEs = {
  slug: '7-days-machame-route',
  category: 'package',
  name: '7 Días Route Machame',
  durationDays: 7,
  seoTitle: '7 Días Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 7 Días Route Machame.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp y Mweka Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'Apodada la «Whiskey Route», la Route Machame es la ruta más popular para escalar el Kilimanjaro, elegida por casi la mitad de los excursionistas cada año. Esta ruta panorámica aborda el Monte Kilimanjaro desde el sur, ascendiendo las impresionantes laderas meridionales antes de descender por la Route Mweka. A lo largo del camino, los escaladores son recompensados con algunos de los amaneceres y atardeceres más impresionantes del Kilimanjaro.',
    'Con una extensión de 62 km, la ruta se recorre generalmente en seis días, aunque se recomienda encarecidamente un itinerario de siete días para una mejor aclimatación — aumentando notablemente las tasas de éxito en la cumbre. Para quienes buscan una aventura inolvidable en un terreno exigente pero gratificante, la Route Machame es una excelente elección.',
  ],
  mapImage: {src: '/images/packages/7-days-machame-route/hero.jpg', alt: 'Mapa de la Route Machame en 7 días'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 días'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Machame Gate a Machame Camp',
      location: 'Machame Gate (1.800 m/5.900 pies) → Machame Camp (3.000 m/9.800 pies)',
      meta: ['Desnivel positivo: 1.200 m / 3.900 pies', 'Duración: 6-7 horas'],
      body: bodyMachameGateToCampEs,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/7-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/7-days-machame-route/day1-machame-2.jpg',
        alt: 'Puente en el sendero de la selva tropical hacia Machame Camp',
      },
    },
    {
      day: 2,
      label: 'De Machame Camp a Shira Camp',
      location: 'Machame Camp (3.000 m/9.800 pies) → Shira Camp (3.840 m/12.600 pies)',
      meta: ['Desnivel positivo: 840 m / 2.800 pies', 'Duración: 5-6 horas'],
      body: bodyMachameCampToShiraEs,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day2-shira-2.jpg', alt: 'Meseta de Shira'},
    },
    {
      day: 3,
      label: 'De Shira Camp a Barranco Camp vía Lava Tower',
      location: 'Shira Camp (3.840 m/12.600 pies) → Lava Tower (4.550 m/14.900 pies) → Barranco Camp (3.850 m/12.650 pies)',
      meta: ['Desnivel positivo: 710 m / 2.300 pies', 'Desnivel negativo: 700 m / 2.250 pies', 'Duración: 6-7 horas'],
      body: bodyShiraToBarrancoViaLavaTowerEs,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day3-lava-tower.jpg', alt: 'Lava Tower con las tiendas del campamento'},
    },
    {
      day: 4,
      label: 'De Barranco Camp a Karanga Camp vía la Barranco Wall',
      location:
        'Barranco Camp (3.850 m/12.600 pies) → Barranco Wall (4.200 m/13.800 pies) → Karanga Camp (3.950 m/13.000 pies)',
      meta: ['Desnivel positivo: 350 m / 1.150 pies', 'Desnivel negativo: 250 m / 820 pies', 'Duración: 3-4 horas'],
      body: bodyBarrancoWallToKarangaEs,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-machame-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day4-karanga-2.jpg', alt: 'Valle de Karanga'},
    },
    {
      day: 5,
      label: 'De Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (3.950 m/13.000 pies) → Barafu Camp (4.600 m/15.100 pies)',
      meta: ['Desnivel positivo: 650 m / 2.150 pies', 'Duración: 3-4 horas'],
      body: bodyKarangaToBarafuEs,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-machame-route/day5-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day5-barafu-2.jpg', alt: 'Sendero hacia Barafu Camp'},
    },
    {
      day: 6,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      location:
        'Barafu Camp (4.600 m/15.100 pies) → Uhuru Peak (5.895 m/19.300 pies) → Mweka Camp (3.110 m/10.200 pies)',
      meta: [
        'Desnivel positivo: 1.295 m / 4.200 pies',
        'Desnivel negativo: 2.785 m / 9.100 pies',
        'Subida a la cumbre: 6-8 horas',
        'Descenso: 6 horas',
      ],
      body: bodySummitToMwekaEs,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-machame-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day6-mweka-2.jpg', alt: 'Tiendas de Mweka Camp'},
    },
    {
      day: 7,
      label: 'De Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 pies) → Mweka Gate (1.830 m/6.000 pies)',
      meta: ['Desnivel negativo: 1.280 m / 4.220 pies', 'Duración: 2-3 horas'],
      body: bodyMwekaToGateEs,
      image: {
        src: '/images/packages/7-days-machame-route/day7-mweka-gate.jpg',
        alt: 'Celebración del certificado de cumbre en Mweka Gate',
      },
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: 'FAQ Route Machame en 7 Días',
  faqs: [
    faqMachameDifficultyEs,
    faqMachameLengthEs(7),
    faqBestTimeMachameEs,
    faqAccommodationTentsEs,
    faqSummitHeightEs,
    faqSummitDayLengthEs,
    faqIncludedMachameEs,
    faqAltitudeSicknessMachameEs,
    faqPreparationMachameEs,
    {
      question: '¿Cuál es la tasa de éxito para la Route Machame en 7 días?',
      answer:
        'La tasa de éxito es alta — entre el 85% y el 90% para escaladas bien organizadas con guías experimentados. El día adicional de aclimatación mejora notablemente tus posibilidades de llegar a la cumbre con seguridad.',
    },
  ],
  hubSummary:
    'Recorre la popular Route Machame, con una duración total de siete días, dándote así aún más tiempo de aclimatación',
  hubImage: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Route Machame en 7 días'},
}

const machame6Es: TripEs = {
  slug: '6-days-machame-route',
  category: 'package',
  name: '6 Días Route Machame',
  durationDays: 6,
  seoTitle: '6 Días Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 6 Días Route Machame.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp y Mweka Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Machame en 6 días es una de las rutas más populares y panorámicas del Kilimanjaro, conocida por sus paisajes variados y sus sólidas tasas de éxito en la cumbre. Apodada la «Whiskey Route», es preferida por los excursionistas que buscan una escalada exigente pero gratificante. Aunque ligeramente más corta que la versión de 7 días, sigue ofreciendo una excelente aclimatación gracias a su perfil «subir alto, dormir bajo». Esta ruta te hace atravesar exuberantes selvas tropicales, brezales, desiertos alpinos, y finalmente la zona cumbre ártica de Uhuru Peak (5.895 m).',
    'Si buscas una escalada memorable y bien ritmada con menos días en la montaña, la Route Machame en 6 días es una excelente elección.',
  ],
  mapImage: {src: '/images/packages/6-days-machame-route/hero.jpg', alt: 'Mapa de la Route Machame en 6 días'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 días'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Machame Gate a Machame Camp',
      location: 'Machame Gate (1.800 m/5.900 pies) → Machame Camp (3.000 m/9.800 pies)',
      meta: ['Desnivel positivo: 1.200 m / 3.900 pies', 'Duración: 6-7 horas'],
      body: bodyMachameGateToCampEs,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/6-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/6-days-machame-route/day1-machame-2.jpg',
        alt: 'Puente en el sendero de la selva tropical hacia Machame Camp',
      },
    },
    {
      day: 2,
      label: 'De Machame Camp a Shira Camp',
      location: 'Machame Camp (3.000 m/9.800 pies) → Shira Camp (3.840 m/12.600 pies)',
      meta: ['Desnivel positivo: 840 m / 2.800 pies', 'Duración: 5-6 horas'],
      body: bodyMachameCampToShiraEs,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/6-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day2-shira-2.jpg', alt: 'Meseta de Shira'},
    },
    {
      day: 3,
      label: 'De Shira Camp a Barranco Camp vía Lava Tower',
      location: 'Shira Camp (3.840 m/12.600 pies) → Lava Tower (4.550 m/14.900 pies) → Barranco Camp (3.850 m/12.650 pies)',
      meta: ['Desnivel positivo: 710 m / 2.300 pies', 'Desnivel negativo: 700 m / 2.250 pies', 'Duración: 6-7 horas'],
      body: bodyShiraToBarrancoViaLavaTowerEs,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day3-barranco-2.jpg', alt: 'Valle de Barranco'},
    },
    {
      day: 4,
      label: 'De Barranco Camp a Barafu Camp',
      location: 'Barranco Camp (3.960 m) a Barafu Camp (4.640 m)',
      meta: ['Desnivel positivo: 680 m (2.231 pies)', 'Duración: 7-9 horas'],
      body: [
        'Comienza con la emocionante escalada de la Barranco Wall, una subida aventurera que ofrece vistas gratificantes. El sendero luego serpentea a través de paisajes de desierto alpino, atravesando el valle de Karanga antes de llegar a Barafu Camp. Aquí descansarás temprano y te prepararás para el esfuerzo hacia la cumbre antes del amanecer.',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-machame-route/day4-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day4-barafu-2.jpg', alt: 'Sendero hacia Barafu Camp'},
    },
    {
      day: 5,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      location:
        'Barafu Camp (4.640 m/15.223 pies) → Uhuru Peak (5.895 m/19.341 pies) → Mweka Camp (3.080 m/10.105 pies)',
      meta: ['Desnivel positivo: 1.255 m / 4.117 pies', 'Desnivel negativo: 2.815 m / 9.236 pies', 'Duración: 12-14 horas'],
      body: [
        'El día de la cumbre comienza bajo un cielo estrellado, con una subida a medianoche hacia Stella Point y luego hacia Uhuru Peak — el punto más alto de África. Presencia un amanecer inolvidable desde la cumbre, luego comienza el largo descenso hacia Mweka Camp. Descubrirás una gran variedad de paisajes y climas en un solo día.',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-machame-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day5-mweka-2.jpg', alt: 'Cabañas de Mweka Camp'},
    },
    {
      day: 6,
      label: 'De Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.080 m/10.105 pies) → Mweka Gate (1.640 m/5.381 pies)',
      meta: ['Desnivel negativo: 1.440 m / 4.724 pies', 'Duración: 3-4 horas'],
      body: [
        'Tu último trek desciende por senderos de selva tropical verdeante hasta Mweka Gate, donde celebrarás tu logro, recibirás tus certificados de cumbre y te despedirás de tu equipo de montaña.',
      ],
      image: {src: '/images/packages/6-days-machame-route/day6-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureEs,
  ],
  includes: includesVariantAEs,
  excludes: [...excludesVariantAEs, 'Alquiler de servicios sanitarios portátiles (si no se ha previsto con antelación)'],
  faqHeading: 'FAQ Route Machame en 6 Días',
  faqs: [
    faqMachameDifficultyEs,
    faqMachameLengthEs(6),
    faqBestTimeMachameEs,
    faqAccommodationTentsEs,
    faqSummitHeightEs,
    faqSummitDayLengthEs,
    faqIncludedMachameEs,
    faqAltitudeSicknessMachameEs,
    faqPreparationMachameEs,
    {
      question: '¿Cuál es la tasa de éxito para la Route Machame en 6 días?',
      answer:
        'La tasa de éxito es alta — entre el 80% y el 85% para escaladas bien organizadas con guías experimentados. El día adicional de aclimatación mejora notablemente tus posibilidades de llegar a la cumbre con seguridad.',
    },
  ],
  hubSummary: 'La Route Machame, a menudo llamada «Whiskey Route», es una de las rutas más panorámicas y variadas del Kilimanjaro.',
  hubImage: {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 6 días'},
}

// FAQ fragments shared between the 5-day and 6-day Marangu packages.
const faqMaranguDaysEs: FaqEs = {
  question: '¿Cuántos días se necesitan para recorrer la Route Marangu?',
  answer:
    'El itinerario estándar requiere 5 o 6 días, recomendándose encarecidamente la versión de 6 días. El día adicional permite una mejor aclimatación, mejorando tus posibilidades de llegar a Uhuru Peak con éxito.',
}
const faqMaranguEasiestEs: FaqEs = {
  question: '¿Es la Route Marangu la forma más fácil de escalar el Monte Kilimanjaro?',
  answer:
    'A menudo se presenta como la ruta «más fácil» gracias a sus pendientes suaves y su alojamiento en refugios — pero no te dejes engañar. El tiempo de aclimatación más corto la hace menos indulgente con el mal agudo de montaña, por lo que la preparación es esencial.',
}
const faqMaranguCocaColaEs: FaqEs = {
  question: '¿Por qué se llama a la Route Marangu «Coca-Cola Route»?',
  answer:
    'Porque es la única ruta del Kilimanjaro donde se duerme en refugios permanentes en lugar de en tienda — y en su día se vendía Coca-Cola en algunos puntos de parada. Es un apodo que refleja la comodidad relativa frente a las rutas en campamento.',
}
const faqMaranguDistanceEs: FaqEs = {
  question: '¿Cuál es la distancia y el desnivel de la Route Marangu?',
  answer:
    'El itinerario cubre aproximadamente 72 km de ida y vuelta. El desnivel positivo es de aproximadamente 4.005 metros, desde Marangu Gate (1.860 m) hasta la cumbre (5.895 m), para luego descender por el mismo sendero.',
}
const faqMaranguAccommodationEs: FaqEs = {
  question: '¿Qué tipo de alojamiento está disponible en la Route Marangu?',
  answer:
    'Dormirás en refugios compartidos en forma de A con literas. Cada refugio dispone de habitaciones estilo dormitorio, iluminación solar y servicios sanitarios comunes básicos. Es una buena opción si prefieres no acampar al aire libre.',
}
const faqMaranguCrowdedEs: FaqEs = {
  question: '¿Está muy concurrida la Route Marangu?',
  answer:
    'Es una de las rutas más populares, en particular entre los excursionistas atentos al presupuesto. Como se utiliza el mismo sendero tanto para la subida como para la bajada, encontrarás a menudo a otros grupos avanzando en ambas direcciones.',
}
const faqMaranguSuccessRateEs: FaqEs = {
  question: '¿Cuál es la tasa de éxito para las escaladas por la Route Marangu?',
  answer:
    'Las tasas de éxito para el itinerario de 5 días son relativamente bajas debido a una aclimatación insuficiente. Sin embargo, la versión de 6 días tiene una tasa de éxito mucho mejor, especialmente si te tomas tu tiempo y te hidratas bien.',
}
const faqMaranguSuitedForEs: FaqEs = {
  question: '¿A quién le conviene más la Route Marangu?',
  answer:
    'La Route Marangu es ideal para excursionistas principiantes que prefieren la comodidad de los refugios, viajan durante la temporada de lluvias, o desean un itinerario más corto con una logística simplificada. No es ideal para quienes buscan soledad o una experiencia de naturaleza salvaje aislada.',
}

const marangu5Es: TripEs = {
  slug: '5-days-marangu-route',
  category: 'package',
  name: '5 Días Route Marangu',
  durationDays: 5,
  seoTitle: '5 Días Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 5 Días Route Marangu.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en refugio, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'Conocida como la «Coca-Cola Route», la Route Marangu es la ruta más consolidada y cómoda hacia la cumbre del Monte Kilimanjaro. Es la única ruta que ofrece alojamiento en refugios, lo que la convierte en una opción popular para quienes buscan una experiencia de trek menos dura. El sendero ofrece pendientes suaves a través de una exuberante selva tropical, brezales y un desierto alpino antes de llegar a la cumbre helada de Uhuru Peak. Es ideal para excursionistas principiantes o para quienes buscan una escalada más sencilla.',
    'Route Marangu en 5 Días — una escalada más rápida, ideal para excursionistas experimentados o con poco tiempo disponible. Incluye: Día 1: de Marangu Gate a Mandara Hut (selva tropical); Día 2: de Mandara Hut a Horombo Hut (brezal); Día 3: de Horombo Hut a Kibo Hut (desierto alpino); Día 4: esfuerzo hacia la cumbre a medianoche hasta Uhuru Peak, luego descenso hacia Horombo Hut; Día 5: regreso a Marangu Gate.',
  ],
  mapImage: {src: '/images/packages/5-days-marangu-route/hero.jpg', alt: 'Refugios de montaña de la Route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
    {src: '/images/packages/5-days-marangu-route/horombo-2.jpeg', alt: 'Horombo Hut'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Marangu Gate a Mandara Hut',
      location: 'Altitud: 1.860 m → 2.700 m',
      meta: ['Desnivel positivo: 830 m / 2.723 pies', 'Duración: 4-5 horas'],
      body: [
        'Tu trek comienza con un trayecto en coche desde Moshi hasta Marangu Gate. Después del registro, entrarás en la exuberante selva tropical e iniciarás tu caminata por un sendero bien cuidado. El recorrido suele ser húmedo y sombreado, con árboles cubiertos de musgo, cantos de aves y monos juguetones en el camino.',
        'Llegarás a Mandara Hut a última hora de la tarde. Si el tiempo y la energía lo permiten, haz una breve caminata hasta el cráter Maundi para disfrutar de vistas magníficas de Kenia y el norte de Tanzania.',
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/5-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day1-mandara-2.jpg', alt: 'Cabañas de Mandara Hut'},
    },
    {
      day: 2,
      label: 'De Mandara Hut a Horombo Hut',
      location: 'Altitud: 2.700 m → 3.720 m',
      meta: ['Desnivel positivo: 1.020 m / 3.346 pies', 'Duración: 6-7 horas'],
      body: [
        'Dejando atrás la selva tropical, entrarás en la zona de brezal, donde el paisaje cambia radicalmente. El sendero asciende constantemente por un terreno abierto lleno de senecios gigantes y lobelias.',
        'En el camino, tendrás tu primera vista completa de los picos Kibo y Mawenzi. Horombo Hut te espera con panoramas impresionantes y la oportunidad de conocer a otros excursionistas.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day2-horombo-2.jpg', alt: 'Cabañas de Horombo Hut'},
    },
    {
      day: 3,
      label: 'De Horombo Hut a Kibo Hut',
      location: 'Altitud: 3.720 m → 4.703 m',
      meta: ['Desnivel positivo: 983 m / 3.226 pies', 'Duración: 6-7 horas'],
      body: [
        'El itinerario de hoy es largo y seco, atravesando el desierto alpino. Caminarás por la silla entre los picos Mawenzi y Kibo, un paisaje vasto y árido con vistas espectaculares. El aire es más enrarecido, así que camina despacio y mantente hidratado.',
        'Llegarás a Kibo Hut a primera hora de la tarde — descansa temprano y prepárate para el intento de cumbre que comienza a medianoche.',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day3-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day3-kibo-2.jpg', alt: 'Edificio de piedra de Kibo Hut'},
    },
    {
      day: 4,
      label: 'De Kibo Hut a Uhuru Peak y luego a Horombo Hut',
      location: 'Altitud: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
      meta: ['Desnivel positivo: 1.192 m / 3.911 pies (subida), luego descenso', 'Duración: 11-14 horas'],
      body: [
        'Tu subida hacia la cumbre comienza en las primeras horas, caminando en la oscuridad por zigzags y pedregal hasta Gilman\'s Point (5.685 m), luego por el borde del cráter hasta Uhuru Peak — el techo de África.',
        'Después de inmortalizar tu momento en la cumbre, desciende a Kibo Hut para una breve pausa, luego continúa hacia Horombo Hut para una noche de sueño bien merecida.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day4-horombo-hut-return.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day4-horombo-3.jpg', alt: 'Cabañas de Horombo Hut'},
    },
    {
      day: 5,
      label: 'De Horombo Hut a Marangu Gate',
      location: 'Altitud: 3.720 m → 1.860 m',
      meta: ['Desnivel negativo: 1.850 m / 6.070 pies', 'Duración: 6-7 horas'],
      body: [
        'En tu último día, desciende por el brezal y la exuberante selva tropical para regresar al punto de partida. El sendero es más fácil en descenso, pero ten cuidado con tus pasos en las secciones húmedas.',
        'En la entrada del parque, recibirás tu certificado de cumbre antes de regresar a Moshi — cansado pero orgulloso.',
      ],
      image: {src: '/images/packages/5-days-marangu-route/day5-marangu-gate.jpg', alt: 'Escaladores cerca de la cumbre al amanecer'},
    },
    departureEs,
  ],
  includes: includesVariantAEs,
  excludes: excludesVariantAEs,
  faqHeading: 'FAQ Route Marangu en 5 Días',
  faqIntro:
    '¿Tienes preguntas sobre la escalada del Kilimanjaro con nosotros? Consulta nuestras FAQ a continuación para obtener información útil.',
  faqs: [
    faqMaranguDaysEs,
    faqMaranguEasiestEs,
    faqMaranguCocaColaEs,
    faqMaranguDistanceEs,
    faqMaranguAccommodationEs,
    faqMaranguCrowdedEs,
    faqMaranguSuccessRateEs,
    faqMaranguSuitedForEs,
  ],
  hubSummary:
    'Un viaje de cinco días para escalar la cumbre más alta de África, por la popular Route Marangu. Espera una variedad de paisajes…',
  hubImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Route Marangu en 5 días'},
}

const marangu6Es: TripEs = {
  slug: '6-days-marangu-route',
  category: 'package',
  name: '6 Días Route Marangu',
  durationDays: 6,
  seoTitle: '6 Días Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 6 Días Route Marangu.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en refugio, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Marangu, a menudo apodada la «Coca-Cola Route», es la única ruta del Kilimanjaro que ofrece alojamiento en refugios en lugar de en campamento. Con su sendero bien trazado y su comodidad adicional, es una opción popular para los excursionistas que buscan una escalada panorámica pero sencilla hacia la cumbre del pico más alto de África.',
    'Esta versión de 6 días deja más tiempo para la aclimatación que el trek de 5 días, lo que aumenta tu tasa de éxito en la cumbre. Atravesarás zonas de vegetación distintas, desde la selva tropical hasta el desierto alpino, antes de concluir con un esfuerzo a medianoche hacia Uhuru Peak vía Gilman\'s Point.',
  ],
  mapImage: {src: '/images/packages/6-days-marangu-route/hero.jpg', alt: 'Refugios de montaña de la Route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/routes/marangu/hero.jpg', alt: 'Refugio de la Route Marangu'},
    {src: '/images/packages/shared/card-6-days-marangu-alt.webp', alt: 'Route Marangu en 6 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      location: 'Altitud: 1.860 m → 2.700 m',
      meta: ['Desnivel positivo: 840 m (2.755 pies)', 'Duración: 4-5 horas'],
      body: [
        'Inicia tu viaje a través de una exuberante selva tropical poblada por colobos y una flora vibrante. Después de una subida constante, llegarás a Mandara Hut para tu primera noche en la montaña.',
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/6-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day1-mandara-2.jpg', alt: 'Cabañas de Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      location: 'Altitud: 2.700 m → 3.720 m',
      meta: ['Desnivel positivo: 1.020 m (3.346 pies)', 'Duración: 6-7 horas'],
      body: [
        'Saliendo del bosque, el sendero se transforma en brezal y erica. En el camino, disfruta de las vistas de los picos Kibo y Mawenzi.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day2-horombo-2.jpg', alt: 'Cabañas de Horombo Hut'},
    },
    {
      day: 3,
      label: 'Aclimatación en Horombo Hut',
      location: 'Altitud: 3.720 m → 4.000 m (Zebra Rocks) → 3.720 m',
      meta: ['Desnivel positivo: 280 m (918 pies)', 'Desnivel negativo: 280 m (918 pies)', 'Duración: 2-3 horas (caminata opcional)'],
      body: [
        'Un día de aclimatación esencial para ayudar a tu cuerpo a adaptarse. Puedes hacer una breve caminata hasta Zebra Rocks y regresar para almorzar y descansar en Horombo.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day3-horombo-acclimatization.jpg', alt: 'Cartel de Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      location: 'Altitud: 3.720 m → 4.703 m',
      meta: ['Desnivel positivo: 983 m (3.225 pies)', 'Duración: 6-7 horas'],
      body: [
        'El trek de hoy te hace atravesar un terreno de desierto alpino en dirección al campo base en Kibo Hut. Descansa temprano para prepararte para la noche de la cumbre.',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day4-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day4-kibo-2.jpg', alt: 'Edificio de piedra de Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      location: 'Altitud: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
      meta: ['Desnivel positivo: 1.192 m (3.910 pies)', 'Desnivel negativo: 2.175 m (7.136 pies)', 'Duración: 12-14 horas'],
      body: [
        'Inicia tu esfuerzo hacia la cumbre poco después de medianoche, alcanzando Gilman\'s Point y luego Uhuru Peak al amanecer. Después de celebrar en la cumbre, desciende hacia Horombo Hut para tu última noche.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day5-horombo-3.jpg', alt: 'Horombo Hut al atardecer'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Traslado',
      location: 'Altitud: 3.720 m → 1.860 m',
      meta: ['Desnivel negativo: 1.860 m (6.102 pies)', 'Duración: 5-6 horas'],
      body: [
        'Desciende por el brezal y la selva tropical hasta la entrada del parque. Después de recibir tu certificado de cumbre, serás trasladado a tu hotel.',
      ],
      overnightStay: 'Hotel en Moshi/Arusha (incluido)',
      image: {src: '/images/packages/6-days-marangu-route/day6-marangu-gate.jpg', alt: 'Marangu Gate'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day6-kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'},
    },
    departureEs,
  ],
  includes: [
    'Tasas de entrada al parque',
    'Todas las comidas y el agua durante el trek',
    'Alojamiento en refugio (Mandara, Horombo, Kibo)',
    'Transporte privado desde/hacia Marangu Gate',
    'Estancias en hotel antes y después de la escalada (1 noche cada una)',
    'Guías de montaña certificados, cocinero y porteadores',
    'Botella de oxígeno y kit de primeros auxilios',
    'Tasas gubernamentales e IVA',
    'Certificado de cumbre',
    'Tasa de rescate',
  ],
  excludes: [
    'Vuelos internacionales e internos',
    'Visa tanzana',
    'Propinas para guías y porteadores',
    'Seguro de viaje',
    'Equipo de trekking personal (disponible en alquiler)',
    'Snacks y bebidas adicionales',
    'Noches de hotel adicionales antes/después de la escalada',
  ],
  faqHeading: '¿Tienes preguntas sobre la escalada del Kilimanjaro con nosotros?',
  faqIntro:
    'Consulta nuestras FAQ a continuación para obtener información útil. Si no encuentras la respuesta que buscas, no dudes en contactarnos — nuestros expertos del Kilimanjaro están listos para ayudarte a planificar cada etapa de tu aventura inolvidable.',
  faqs: [
    faqMaranguDaysEs,
    faqMaranguEasiestEs,
    faqMaranguCocaColaEs,
    faqMaranguDistanceEs,
    faqMaranguAccommodationEs,
    faqMaranguCrowdedEs,
    faqMaranguSuccessRateEs,
    {
      question: '¿Cuál es la mejor época para escalar la Route Marangu?',
      answer:
        'Los mejores meses son de enero a principios de marzo y de junio a octubre, cuando las condiciones climáticas son más estables y los senderos están secos. Sin embargo, el sistema de refugios de Marangu la convierte en una opción viable incluso durante las temporadas de lluvias.',
    },
    {
      question: '¿Qué debo llevar para un trek en la Route Marangu?',
      answer:
        'Ropa por capas para todas las gamas de temperatura, un saco de dormir de 4 estaciones, un gorro cálido y guantes, bastones de trekking, artículos de aseo personal y una linterna frontal son esenciales. También necesitarás una pequeña mochila diaria, ya que los porteadores se encargarán de tu bolso principal.',
    },
    faqMaranguSuitedForEs,
  ],
  hubSummary:
    'Un viaje de seis días para escalar la cumbre más alta de África, por la popular Route Marangu. Espera una variedad de paisajes…',
  hubImage: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Route Marangu en 6 días'},
}

const lemosho7Es: TripEs = {
  slug: '7-days-lemosho-route',
  category: 'package',
  name: '7 Días Route Lemosho',
  durationDays: 7,
  seoTitle: '7 Días Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 7 Días Route Lemosho.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira 2 Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp y Mweka Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Lemosho es conocida por su belleza paisajística y su excelente perfil de aclimatación, lo que la convierte en una opción destacada para los excursionistas que buscan una escalada más gradual y gratificante. Partiendo del lado oeste del Kilimanjaro, este itinerario atraviesa exuberantes selvas tropicales, vastos brezales y altos desiertos alpinos, ofreciendo vistas impresionantes de la montaña y los paisajes circundantes.',
    'Con una tasa de éxito más alta que muchas otras rutas, la Route Lemosho en 7 días es ideal para quienes buscan tanto un desafío como la oportunidad de disfrutar de los variados entornos del Kilimanjaro.',
  ],
  mapImage: {src: '/images/packages/7-days-lemosho-route/hero.png', alt: 'Mapa de la Route Lemosho en el Kilimanjaro'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 días'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Lemosho Gate a Mti Mkubwa Camp',
      location: 'Lemosho Gate (2.100 m/6.890 pies) → Mti Mkubwa (2.650 m/8.694 pies)',
      meta: ['Desnivel positivo: 550 m / 1.804 pies', 'Duración: 3-4 horas'],
      body: [
        'Entra en el encantador bosque montano, donde árboles imponentes y los sonidos de la fauna te rodean. Un trek relativamente suave te conduce a Mti Mkubwa Camp, donde pasarás tu primera noche en la montaña.',
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa a Shira 2 Camp',
      location: 'Mti Mkubwa Camp (2.650 m/8.694 pies) → Shira 2 Camp (3.850 m/12.631 pies)',
      meta: ['Desnivel positivo: 1.200 m (3.937 pies)', 'Duración: 7-8 horas'],
      body: [
        'El largo trek de hoy te conduce del bosque a la vasta meseta de Shira. Sube a través de brezales que ofrecen vistas magníficas antes de llegar a Shira 2 Camp, donde la grandeza de los picos del Kilimanjaro se revela plenamente.',
      ],
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day2-shira-2.jpg', alt: 'Campamento de Shira Camp'},
    },
    {
      day: 3,
      label: 'De Shira 2 Camp a Barranco Camp vía Lava Tower',
      location: 'Shira 2 Camp (3.840 m/12.600 pies) → Lava Tower (4.550 m/14.900 pies) → Barranco Camp (3.850 m/12.650 pies)',
      meta: ['Desnivel positivo: 710 m / 2.300 pies', 'Desnivel negativo: 700 m / 2.250 pies', 'Duración: 6-7 horas'],
      body: bodyShiraToBarrancoViaLavaTowerEs,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day3-lava-tower.jpg', alt: 'Lava Tower con las tiendas del campamento'},
    },
    {
      day: 4,
      label: 'De Barranco Camp a Karanga Camp vía la Barranco Wall',
      location:
        'Barranco Camp (3.850 m/12.600 pies) → Barranco Wall (4.200 m/13.800 pies) → Karanga Camp (3.950 m/13.000 pies)',
      meta: ['Desnivel positivo: 350 m / 1.150 pies', 'Desnivel negativo: 250 m / 820 pies', 'Duración: 3-4 horas'],
      body: bodyBarrancoWallToKarangaEs,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day4-karanga-2.jpg', alt: 'Valle de Karanga'},
    },
    {
      day: 5,
      label: 'De Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (3.950 m/13.000 pies) → Barafu Camp (4.600 m/15.100 pies)',
      meta: ['Desnivel positivo: 650 m / 2.150 pies', 'Duración: 3-4 horas'],
      body: bodyKarangaToBarafuEs,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day5-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day5-barafu-2.jpg', alt: 'Sendero hacia Barafu Camp'},
    },
    {
      day: 6,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      location:
        'Barafu Camp (4.600 m/15.100 pies) → Uhuru Peak (5.895 m/19.300 pies) → Mweka Camp (3.110 m/10.200 pies)',
      meta: [
        'Desnivel positivo: 1.295 m / 4.200 pies',
        'Desnivel negativo: 2.785 m / 9.100 pies',
        'Subida a la cumbre: 6-8 horas',
        'Descenso: 6 horas',
      ],
      body: bodySummitToMwekaEs,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day6-mweka-2.jpg', alt: 'Tiendas de Mweka Camp'},
    },
    {
      day: 7,
      label: 'De Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 pies) → Mweka Gate (1.830 m/6.000 pies)',
      meta: ['Desnivel negativo: 1.280 m / 4.220 pies', 'Duración: 2-3 horas'],
      body: bodyMwekaToGateEs,
      image: {
        src: '/images/packages/7-days-lemosho-route/day7-mweka-gate.jpg',
        alt: 'Celebración del certificado de cumbre en Mweka Gate',
      },
    },
    departureEs,
  ],
  includes: [...includesVariantAEs, 'Traslados hacia Lemosho Gate y desde Mweka Gate'],
  excludes: excludesVariantAEs,
  faqHeading: 'FAQ Route Lemosho en 7 Días',
  faqs: [
    {
      question: '¿Es adecuada la Route Lemosho en 7 días para principiantes?',
      answer:
        'Sí. Aunque el Kilimanjaro representa un desafío serio, la Route Lemosho ofrece una escalada gradual, dejando más tiempo para la aclimatación. Esto la convierte en una de las mejores rutas, tanto para principiantes como para excursionistas experimentados.',
    },
    {
      question: '¿Cuál es la tasa de éxito para llegar a la cumbre por la Route Lemosho en 7 días?',
      answer:
        'La tasa de éxito es muy alta — alrededor del 85% o más. Su duración más larga y su desnivel gradual mejoran notablemente la aclimatación y aumentan las posibilidades de llegar a Uhuru Peak.',
    },
    {
      question: '¿Cuántas horas caminaré cada día?',
      answer:
        'La mayoría de los días de trek implican de 4 a 7 horas de caminata. Sin embargo, el día de la cumbre es mucho más largo, con una duración de 12-14 horas de ida y vuelta (subida y descenso).',
    },
    {
      question: '¿Cuál es la distancia total de la Route Lemosho en 7 días?',
      answer:
        'El itinerario cubre aproximadamente 70 kilómetros desde el punto de partida en Lemosho Gate hasta la cumbre y el descenso hacia Mweka Gate.',
    },
    {
      question: '¿Necesito experiencia previa con la altitud?',
      answer:
        'No necesariamente. No se requiere ninguna escalada técnica, pero un buen nivel de condición física es importante. No necesitas experiencia previa con la altitud, aunque el mal agudo de montaña puede afectar a cualquiera, lo que explica la importancia de la aclimatación.',
    },
    {
      question: '¿Qué tipo de alojamiento se usa en la Route Lemosho?',
      answer:
        'El alojamiento se realiza en tiendas de alta calidad proporcionadas y montadas por tu equipo de trek. Cada noche dormirás en campamentos de montaña designados como Mti Mkubwa, Shira, Barranco, Karanga, Barafu y Mweka.',
    },
    {
      question: '¿Qué debo llevar para este itinerario?',
      answer:
        'Los imprescindibles incluyen botas de trekking resistentes, un saco de dormir cálido (resistente hasta -10°C), capas térmicas, equipo impermeable, guantes, una linterna frontal y una mochila diaria. La mayoría de los operadores proporcionan una lista completa del equipo.',
    },
    {
      question: '¿Hay servicios sanitarios en la montaña?',
      answer:
        'Hay letrinas públicas disponibles en cada campamento. Sin embargo, a menudo se incluyen o están disponibles como opción servicios sanitarios portátiles privados para mayor comodidad e higiene.',
    },
    {
      question: '¿Cuál es la mejor época para escalar la Route Lemosho?',
      answer:
        'Las mejores temporadas son de enero a principios de marzo y de junio a octubre. Estos meses ofrecen cielos más despejados, menos precipitaciones y mejores condiciones de trek en general.',
    },
    {
      question: '¿Puedo personalizar este itinerario o añadir días adicionales?',
      answer:
        '¡Por supuesto! El itinerario puede extenderse a una versión de 8 días para una mejor aclimatación, o adaptarse según tu ritmo. Nuestro equipo trabajará contigo para adaptar el trek a tus preferencias y necesidades.',
    },
  ],
  hubSummary:
    'Con ocho días de viaje, tu trek del Kilimanjaro por la Route Lemosho dura más que las alternativas.',
  hubImage: {src: '/images/packages/shared/8-days-lemosho-route.webp', alt: 'Route Lemosho en 7 días'},
}

const lemosho8Es: TripEs = {
  slug: '8-days-lemosho-route',
  category: 'package',
  name: '8 Días Route Lemosho',
  durationDays: 8,
  seoTitle: '8 Días Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 8 Días Route Lemosho.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira Camp 1, Shira Camp 2, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Lemosho es una de las rutas más bellas y equilibradas para escalar el Monte Kilimanjaro. Ofrece una rica biodiversidad, menos afluencia durante los primeros días, y una excelente aclimatación gracias a su perfil de subida gradual. Si buscas un itinerario que combine belleza paisajística, paisajes variados y una alta tasa de éxito en la cumbre, la Route Lemosho en 8 días es una elección fantástica.',
    'Partiendo del lado oeste del Kilimanjaro, este itinerario atraviesa una exuberante selva tropical, vastos brezales y zonas de desierto alpino antes de unirse a la Route Machame y dirigirse hacia la cumbre vía Barafu Camp.',
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Mapa de la Route Lemosho en 8 días'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 días'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Lemosho Gate a Mti Mkubwa',
      location: 'Altitud: 2.100 m → 2.650 m',
      meta: ['Desnivel positivo: 550 m (1.805 pies)', 'Duración: 3-4 horas'],
      body: [
        'Después del desayuno, conducirás desde Arusha hasta Londorossi Gate para el registro. Luego continuarás hasta Lemosho Gate, donde la excursión comienza a través de una exuberante selva tropical. Esta zona es rica en fauna, con colobos blancos y negros y aves forestales. Caminarás bajo un denso dosel de árboles antes de llegar a Mti Mkubwa (Big Tree) Camp para pasar la noche.',
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp a Shira 1 Camp',
      location: 'Mti Mkubwa Camp (2.650 m) – Shira 1 Camp (3.610 m)',
      meta: ['Desnivel positivo: 960 m (3.150 pies)', 'Duración: 6-7 horas'],
      body: [
        'El sendero de hoy sube progresivamente saliendo de la selva tropical hacia la zona de erica y brezal. A medida que subes, los árboles se dispersan y el paisaje se abre, ofreciendo vistas magníficas de la cresta de Shira y el pico Kibo. Después de una caminata pintoresca a través de colinas onduladas y formaciones rocosas volcánicas, llegarás a Shira 1 Camp en la meseta de Shira.',
      ],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Meseta de Shira'},
    },
    {
      day: 3,
      label: 'De Shira 1 Camp a Shira 2 Camp',
      location: 'Shira 1 Camp (3.610 m) – Shira 2 Camp (3.850 m)',
      meta: ['Desnivel positivo: 240 m (787 pies)', 'Duración: 3-4 horas'],
      body: [
        'Un breve trek a través de la vasta meseta abierta de la cresta de Shira te da tiempo para descansar y aclimatarte. Si el clima lo permite, tendrás vistas panorámicas del Kibo y del Monte Meru a lo lejos.',
      ],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Vista de Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'De Shira 2 Camp a Lava Tower y luego a Barranco Camp',
      location: 'Shira 2 Camp (3.850 m) → Lava Tower (4.630 m) → Barranco Camp',
      meta: ['Desnivel positivo: 780 m', 'Desnivel negativo: 654 m', 'Duración: 6-7 horas'],
      body: [
        'Sube constantemente hasta la imponente Lava Tower, donde te detendrás para almorzar. Luego desciende al magnífico valle de Barranco para pasar la noche. Este es uno de los días de aclimatación más importantes del itinerario.',
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: 'De Barranco Camp a Karanga Camp',
      location: 'Barranco Camp (3.976 m) → Karanga Camp (4.035 m)',
      meta: ['Desnivel positivo: 59 m / 194 pies', 'Duración: 4-5 horas'],
      body: [
        'Escala la célebre Barranco Wall — exigente pero no técnica. Continúa a través de un terreno alpino hasta Karanga Camp. Este día más corto le da a tu cuerpo más tiempo para aclimatarse antes de la noche de la cumbre.',
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Vista de Karanga Camp'},
    },
    {
      day: 6,
      label: 'De Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (4.035 m / 13.238 pies) → Barafu Camp (4.703 m)',
      meta: ['Desnivel positivo: 668 m / 2.192 pies', 'Duración: 3-4 horas'],
      body: [
        'Un trek corto pero empinado a través de un desierto alpino de alta montaña hasta tu último campamento antes de la noche de la cumbre. Descansa, hidrátate y prepárate mentalmente para el desafío que te espera.',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: 'Sendero hacia Barafu Camp'},
    },
    {
      day: 7,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      location:
        'Barafu Camp (4.703 m / 15.430 pies) → Uhuru Peak (5.895 m / 19.341 pies) → Mweka Camp (3.720 m / 12.205 pies)',
      meta: ['Desnivel positivo: 1.192 m / 3.910 pies', 'Desnivel negativo: 2.175 m / 7.136 pies', 'Duración: 12-14 horas'],
      body: [
        'Inicia tu intento de cumbre hacia medianoche, caminando en la oscuridad hacia Stella Point y luego Uhuru Peak — el punto más alto de África. Después del amanecer y las fotos en la cumbre, desciende a Barafu para una pausa, luego hasta Mweka Camp para pasar la noche.',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'De Mweka Camp a Mweka Gate, traslado a Arusha',
      location: 'Mweka Camp (3.720 m / 12.205 pies) → Mweka Gate (1.640 m / 5.380 pies)',
      meta: ['Desnivel negativo: 2.080 m / 6.824 pies', 'Duración: 3-4 horas'],
      body: [
        'Atraviesa una exuberante selva tropical hasta la entrada del parque, donde recibirás tu certificado del Kilimanjaro. Tu conductor te trasladará a tu hotel para una ducha caliente y un descanso bien merecido.',
      ],
      overnightStay: 'Arusha',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: 'FAQ Route Lemosho en 8 Días',
  faqIntro:
    '¿Tienes preguntas sobre la escalada del Kilimanjaro con nosotros? Consulta nuestras FAQ sobre la Route Lemosho a continuación para obtener respuestas claras y útiles. Si no encuentras lo que buscas, no dudes en contactarnos — nuestros expertos de montaña de Asili Climbing Kilimanjaro están aquí para ayudarte a planificar una aventura de cumbre segura, exitosa e inolvidable.',
  faqs: [
    {
      question: '¿Por qué elegir la Route Lemosho para escalar el Kilimanjaro?',
      answer:
        'La Route Lemosho es ampliamente considerada la ruta más panorámica del Kilimanjaro. Ofrece vistas impresionantes, poca afluencia durante las primeras etapas, y una excelente aclimatación. Con una subida gradual y paisajes variados, es ideal para los excursionistas que apuntan a una escalada exitosa.',
    },
    {
      question: '¿Cuál es el nivel de dificultad de la Route Lemosho en 8 días?',
      answer:
        'El itinerario es moderadamente exigente pero totalmente manejable con una buena preparación. El itinerario de 8 días permite una mejor aclimatación, aumentando tus posibilidades de llegar a Uhuru Peak sin síntomas graves de altitud.',
    },
    {
      question: '¿Qué está incluido en la escalada de 8 días por la Route Lemosho con Asili Climbing Kilimanjaro?',
      answer:
        'Tu escalada incluye guías de montaña profesionales, porteadores, equipo de campamento completo, las comidas, las tasas de parque, la tasa de rescate y los traslados de aeropuerto. También se pueden organizar estancias en hotel antes y después del trek.',
    },
    {
      question: '¿Qué tipo de alojamiento se usa durante el trek?',
      answer:
        'Dormirás en tiendas de montaña de cuatro estaciones de alta calidad, cada una compartida entre dos escaladores. Se proporcionan colchonetas cómodas. Todos los campamentos son montados y desmontados cada día por nuestros porteadores.',
    },
    {
      question: '¿Cuál es la mejor época del año para hacer trekking en la Route Lemosho?',
      answer:
        'Recomendamos escalar durante las temporadas secas: de enero a mediados de marzo y de junio a octubre. Estos meses ofrecen el mejor clima y visibilidad para las vistas panorámicas y la fotografía.',
    },
    {
      question: '¿Cuántas personas formarán mi grupo?',
      answer:
        'Mantenemos grupos de tamaño pequeño — generalmente entre 2 y 10 excursionistas — para ofrecer una experiencia más personalizada y garantizar seguridad y apoyo durante todo el viaje.',
    },
    {
      question: '¿Qué nivel de condición física necesito para completar este trek?',
      answer:
        'No necesitas ser un atleta, pero deberías tener un buen nivel de condición física y sentirte cómodo caminando varias horas en días consecutivos. Recomendamos entrenar con senderismo, cardio y fortalecimiento muscular varias semanas antes.',
    },
    {
      question: '¿Qué tipo de comida se proporciona en la montaña?',
      answer:
        'Nuestros cocineros de montaña preparan comidas calientes y nutritivas tres veces al día. Espera platos como sopas, pasta, arroz, carne, verduras, fruta fresca y snacks. Las necesidades alimentarias particulares pueden atenderse con previo aviso.',
    },
    {
      question: '¿Tendré acceso a agua potable limpia?',
      answer:
        'Sí. Tratamos y hervimos diariamente el agua proveniente de fuentes naturales a lo largo del itinerario. Se te proporcionará agua potable segura cada día para llenar tus botellas o tu sistema de hidratación.',
    },
    {
      question: '¿Es seguro escalar el Kilimanjaro con Asili Climbing Kilimanjaro?',
      answer:
        'La seguridad es nuestra máxima prioridad. Nuestros guías están formados como Wilderness First Responder (WFR), y realizamos controles de salud diarios mediante oxímetros de pulso. Siempre se transportan oxígeno de emergencia y una camilla portátil. Si es necesario, organizamos una evacuación rápida a través de los servicios de rescate oficiales.',
    },
  ],
  hubSummary:
    'Con ocho días de viaje, tu trek del Kilimanjaro por la Route Lemosho dura más que las alternativas.',
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho en 8 días'},
}

const rongai7Es: TripEs = {
  slug: '7-days-rongai-route',
  category: 'package',
  name: '7 Días Route Rongai',
  durationDays: 7,
  seoTitle: '7 Días Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 7 Días Route Rongai.',
  stopsLine: 'Nalemoru Gate, Simba Camp, Second Cave Camp, Kikelewa Camp, Mawenzi Tarn, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Rongai es la única ruta que aborda el Kilimanjaro desde el lado norte, cerca de la frontera con Kenia, ofreciendo una experiencia más tranquila y aislada con paisajes que se elevan gradualmente y menos afluencia. Es perfecta para quienes desean una escalada tranquila, aprecian la observación de la fauna, y prefieren un itinerario más seco — especialmente durante la temporada de lluvias.',
    'A lo largo de siete días, atravesarás una exuberante selva tropical, vastos brezales y un alto desierto alpino, para finalmente llegar a la cumbre en Uhuru Peak — el punto más alto de África.',
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Mapa de la Route Rongai en 7 días'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: 'Escaladores en el sendero'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Nalemoru Gate a Simba Camp',
      location: 'Nalemoru Gate (1.950 m / 6.398 pies) → Simba Camp (2.620 m / 8.596 pies)',
      meta: ['Desnivel positivo: 670 m / 2.198 pies', 'Duración: 3-4 horas'],
      body: [
        'Tu trek comienza en Nalemoru Gate, con una subida gradual a través de un exuberante bosque montano. Mantén los ojos abiertos para avistar colobos y aves forestales. Llega a Simba Camp, ubicado en el límite del brezal.',
      ],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Cartel de Simba Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'De Simba Camp a Second Cave Camp',
      location: 'Simba Camp (2.620 m / 8.596 pies) → Second Cave Camp (3.450 m / 11.318 pies)',
      meta: ['Desnivel positivo: 830 m / 2.723 pies', 'Duración: 5-6 horas'],
      body: [
        'El sendero de hoy se abre a erica y brezal a medida que dejas atrás el bosque. Disfruta de vistas magníficas del pico Kibo mientras te diriges hacia Second Cave Camp, un lugar tranquilo rodeado de flora alpina.',
      ],
      overnightStay: 'Second Cave Camp',
      image: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-camp.webp', alt: 'Tiendas de Second Cave Camp'},
    },
    {
      day: 3,
      label: 'De Second Cave a Kikelewa Camp',
      location: 'Second Cave (3.450 m / 11.318 pies) → Kikelewa Camp (3.630 m / 11.910 pies)',
      meta: ['Desnivel positivo: 180 m / 591 pies', 'Duración: 3-4 horas'],
      body: [
        'Un día más corto pero magnífico, el sendero serpentea a través de brezales accidentados, con vistas cada vez más espectaculares de los picos del Kilimanjaro. Llega a Kikelewa Camp, situado en un valle resguardado con vistas panorámicas.',
      ],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
    },
    {
      day: 4,
      label: 'De Kikelewa a Mawenzi Tarn',
      location: 'Kikelewa (3.630 m / 11.910 pies) → Mawenzi Tarn (4.310 m / 14.140 pies)',
      meta: ['Desnivel positivo: 680 m / 2.231 pies', 'Duración: 4-5 horas'],
      body: [
        'La subida de hoy es más empinada pero muy gratificante. Caminarás hacia Mawenzi, el segundo pico del Kilimanjaro, con vistas magníficas y un paisaje de alta montaña casi irreal. Mawenzi Tarn Camp se encuentra en un circo espectacular a los pies de imponentes acantilados.',
      ],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 5,
      label: 'De Mawenzi Tarn a Kibo Hut',
      location: 'Mawenzi Tarn (4.310 m / 14.140 pies) → Kibo Hut (4.700 m / 15.420 pies)',
      meta: ['Desnivel positivo: 390 m / 1.280 pies', 'Duración: 5-6 horas'],
      body: [
        'Atraviesa la silla de aspecto lunar entre Mawenzi y Kibo, llegando a Kibo Hut al mediodía. Descansa, hidrátate y prepárate para el difícil intento de cumbre que comienza hacia medianoche.',
      ],
      overnightStay: 'Kibo Hut (refugio estilo dormitorio)',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Edificio de piedra de Kibo Hut'},
    },
    {
      day: 6,
      label: 'De Kibo Hut a Uhuru Peak y luego a Horombo Hut',
      location: 'Kibo Hut (4.700 m / 15.420 pies) → Uhuru Peak (5.895 m / 19.341 pies) → Horombo Hut (3.720 m / 12.205 pies)',
      meta: [
        'Desnivel positivo: 1.195 m / 3.920 pies',
        'Desnivel negativo: 2.175 m / 7.136 pies',
        'Subida a la cumbre: 6-8 horas',
        'Descenso: 6 horas',
      ],
      body: [
        'Tu esfuerzo hacia la cumbre comienza bajo un cielo estrellado, escalando empinados zigzags hasta Gilman\'s Point (5.685 m), luego por el borde del cráter hasta Uhuru Peak — el techo de África. Celebra brevemente, luego desciende a través de Kibo hasta Horombo Hut para un descanso bien merecido.',
      ],
      overnightStay: 'Horombo Hut (refugio estilo dormitorio)',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: 'Cumbre de Uhuru Peak'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 7,
      label: 'De Horombo Hut a Marangu Gate',
      location: 'Horombo Hut (3.720 m / 12.205 pies) → Marangu Gate (1.860 m / 6.102 pies)',
      meta: ['Desnivel negativo: 1.860 m / 6.102 pies', 'Duración: 5-6 horas'],
      body: [
        'Desciende por una exuberante selva tropical hasta Marangu Gate, donde recibirás tu certificado de escalada y celebrarás tu logro. Traslado de regreso a Moshi o Arusha.',
      ],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: 'Descenso hacia Marangu Gate'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: 'FAQ Route Rongai en 7 Días',
  faqs: [
    {
      question: '¿Es la Route Rongai menos concurrida que otras rutas del Kilimanjaro?',
      answer:
        'Sí, la Route Rongai es la única ruta que aborda el Kilimanjaro desde el norte, cerca de la frontera con Kenia. Es conocida por ser mucho más tranquila y menos concurrida que rutas populares como Machame o Marangu, ofreciendo una experiencia de trekking más pacífica.',
    },
    {
      question: '¿Cuál es el nivel de dificultad de la Route Rongai en 7 días?',
      answer:
        'La Route Rongai se considera de nivel de dificultad moderado, con un perfil de subida gradual que favorece la aclimatación. Es una buena elección para quienes buscan un equilibrio entre desafío físico y mejores posibilidades de éxito.',
    },
    {
      question: '¿Cuál es la tasa de éxito en la Route Rongai en 7 días?',
      answer:
        'El itinerario de 7 días mejora la aclimatación y se traduce en una tasa de éxito en la cumbre de aproximadamente el 85% o más, especialmente en comparación con las versiones más cortas de la misma ruta.',
    },
    {
      question: '¿Cómo son los alojamientos en la Route Rongai?',
      answer:
        'Te alojarás en tiendas de montaña de alta calidad, montadas y mantenidas por nuestro equipo profesional. Durante el descenso (vía Marangu), dormirás en Horombo Hut, un punto de parada cálido y resguardado. También incluimos una tienda-baño privada para mayor comodidad.',
    },
    {
      question: '¿Cómo es el paisaje en comparación con otras rutas?',
      answer:
        'La Route Rongai ofrece paisajes variados y únicos, incluyendo naturaleza salvaje aislada, laderas boscosas y vistas sorprendentes del pico Mawenzi. El descenso por la Route Marangu ofrece un cambio de escenario, atravesando una exuberante selva tropical.',
    },
    {
      question: '¿Es preferible este itinerario durante la temporada de lluvias?',
      answer:
        'Sí. El lado norte del Kilimanjaro recibe menos lluvia, lo que hace de Rongai una elección sabia si escalas entre marzo y mayo o en noviembre. También es una opción confiable para treks durante todo el año con menos perturbaciones climáticas.',
    },
    {
      question: '¿Se proporcionan las comidas y el agua?',
      answer:
        'Sí. Servimos comidas frescas y calientes preparadas por nuestros cocineros de montaña tres veces al día. También proporcionamos agua potable filtrada y segura durante toda la escalada. Nos adaptamos a dietas particulares bajo solicitud — solo infórmanos con antelación.',
    },
    {
      question: '¿Qué tipo de equipo de apoyo tendré?',
      answer:
        'Estarás acompañado por un equipo de apoyo completo: guías experimentados, porteadores y cocineros, todos formados y certificados. Nuestro equipo garantiza tu seguridad y comodidad de principio a fin — tu éxito es nuestra misión.',
    },
    {
      question: '¿Cómo es la noche de la cumbre?',
      answer:
        'La noche de la cumbre es la más exigente pero también la más inspiradora. Partimos desde Kibo Hut hacia medianoche, llegando a Uhuru Peak al amanecer. Nuestros guías caminarán contigo paso a paso, ofreciéndote apoyo y motivación en todo el recorrido.',
    },
    {
      question: '¿Puedo combinar esta escalada con un safari en Tanzania?',
      answer:
        '¡Sí, y es muy recomendable! En Asili Climbing Kilimanjaro, ofrecemos extensiones de safari personalizadas después de tu trek. Explora el Serengeti, el cráter del Ngorongoro, o relájate en Zanzíbar — según lo que corresponda a tu sueño de viaje.',
    },
  ],
  hubSummary:
    'Abordando el Kilimanjaro desde el norte, este itinerario ofrece una perspectiva única de la montaña y es perfecto para quienes…',
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai en 7 días'},
}

const umbwe6Es: TripEs = {
  slug: '6-days-umbwe-route',
  category: 'package',
  name: '6 Días Route Umbwe',
  durationDays: 6,
  seoTitle: '6 Días Route Umbwe | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 6 Días Route Umbwe.',
  stopsLine: 'Umbwe Gate, Umbwe Cave Camp, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp y Mweka Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Umbwe es reconocida como la ruta más directa, empinada y exigente hacia la cumbre del Monte Kilimanjaro. Este itinerario no es para los débiles de corazón. Requiere una buena condición física, resiliencia mental y cierta experiencia de trekking. Lo que distingue a Umbwe es su soledad, sus paisajes espectaculares y el ambiente crudo y salvaje que ofrece de principio a fin.',
    'Si eres un excursionista experimentado en busca de un sendero tranquilo con poca afluencia y una escalada rápida, la Route Umbwe podría ser perfecta para ti. A pesar de su dificultad, el itinerario se une al sendero Machame en el segundo o tercer día, permitiendo cierta aclimatación antes de la noche de la cumbre.',
  ],
  mapImage: {
    src: '/images/packages/6-days-umbwe-route/hero.jpg',
    alt: 'Campamento en la Route Umbwe con la cumbre del Kilimanjaro de fondo',
  },
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 días'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'De Umbwe Gate a Umbwe Cave Camp',
      location: 'Umbwe Gate (1.600 m) → Umbwe Cave Camp (2.850 m)',
      meta: ['Desnivel positivo: 1.250 m / 4.100 pies', 'Duración: 5-6 horas'],
      body: [
        'Tu viaje comienza con un breve trayecto desde Moshi hasta Umbwe Gate. Después del registro, el sendero se sumerge directamente en una densa y húmeda selva tropical. El empinado recorrido sube rápidamente a través de raíces de árboles y crestas musgosas hasta llegar a Umbwe Cave Camp — tu primera noche en la montaña.',
      ],
      overnightStay: 'Umbwe Cave Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-camp.jpg', alt: 'Umbwe Cave Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-2.jpg', alt: 'Cartel de Umbwe Gate'},
    },
    {
      day: 2,
      label: 'De Umbwe Cave a Barranco Camp',
      location: 'Umbwe Cave Camp (2.850 m/9.350 pies) → Barranco Camp (3.976 m/13.044 pies)',
      meta: ['Desnivel positivo: 1.126 m (3.694 pies)', 'Duración: 4-5 horas'],
      body: [
        'Subirás bruscamente saliendo de la zona forestal para entrar en la región de erica y brezal. El sendero se estrecha por crestas rocosas, revelando amplias vistas del pico Kibo y la Western Breach. A primera hora de la tarde, llegarás a Barranco Camp, situado a los pies de la imponente Barranco Wall.',
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day2-barranco-camp.jpg', alt: 'Tiendas de Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day2-barranco-2.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 3,
      label: 'De Barranco Camp a Karanga Camp vía la Barranco Wall',
      location:
        'Barranco Camp (3.850 m/12.600 pies) → Barranco Wall (4.200 m/13.800 pies) → Karanga Camp (3.950 m/13.000 pies)',
      meta: ['Desnivel positivo: 350 m / 1.150 pies', 'Desnivel negativo: 250 m / 820 pies', 'Duración: 3-4 horas'],
      body: bodyBarrancoWallToKarangaEs,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day3-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day3-karanga-2.jpg', alt: 'Valle de Karanga'},
    },
    {
      day: 4,
      label: 'De Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (3.950 m/13.000 pies) → Barafu Camp (4.600 m/15.100 pies)',
      meta: ['Desnivel positivo: 650 m / 2.150 pies', 'Duración: 3-4 horas'],
      body: bodyKarangaToBarafuEs,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day4-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day4-barafu-2.jpg', alt: 'Sendero hacia Barafu Camp'},
    },
    {
      day: 5,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      location:
        'Barafu Camp (4.600 m/15.100 pies) → Uhuru Peak (5.895 m/19.300 pies) → Mweka Camp (3.110 m/10.200 pies)',
      meta: [
        'Desnivel positivo: 1.295 m / 4.200 pies',
        'Desnivel negativo: 2.785 m / 9.100 pies',
        'Subida a la cumbre: 6-8 horas',
        'Descenso: 6 horas',
      ],
      body: bodySummitToMwekaEs,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day5-mweka-2.jpg', alt: 'Tiendas de Mweka Camp'},
    },
    {
      day: 6,
      label: 'De Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 pies) → Mweka Gate (1.830 m/6.000 pies)',
      meta: ['Desnivel negativo: 1.280 m / 4.220 pies', 'Duración: 2-3 horas'],
      body: bodyMwekaToGateEs,
      image: {
        src: '/images/packages/6-days-umbwe-route/day6-mweka-gate.jpg',
        alt: 'Celebración del certificado de cumbre en Mweka Gate',
      },
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: 'FAQ Route Umbwe en 6 Días',
  faqs: [
    {
      question: '¿Es difícil la Route Umbwe?',
      answer:
        'Sí, la Route Umbwe se considera una de las rutas más exigentes del Monte Kilimanjaro debido a su empinada subida y su rápida ganancia de altitud. Es más adecuada para excursionistas experimentados o en excelente forma física, cómodos con senderos empinados y la alta montaña.',
    },
    {
      question: '¿Qué hace única a la Route Umbwe?',
      answer:
        'Su enfoque directo y tranquilo es lo que hace especial a Umbwe. Es la ruta menos concurrida, que ofrece paisajes espectaculares, una densa selva tropical y un trek por crestas. También se une al circuito sur más panorámico cerca de Barranco Camp, ofreciendo vistas magníficas.',
    },
    {
      question: '¿Cuántos días se necesitan para escalar el Kilimanjaro por Umbwe?',
      answer:
        'El itinerario estándar de Umbwe es de 6 días, pero algunos escaladores eligen extenderlo a 7 días para permitir una mejor aclimatación y aumentar las tasas de éxito en la cumbre.',
    },
    {
      question: '¿Cuál es la tasa de éxito para la Route Umbwe en 6 días?',
      answer:
        'Debido a la rápida ganancia de altitud y la falta de tiempo de aclimatación, la tasa de éxito para la Route Umbwe en 6 días es más baja que en rutas más largas — generalmente entre el 60% y el 70%. Sin embargo, los escaladores en forma y bien preparados con experiencia previa en altitud a menudo tienen éxito.',
    },
    {
      question: '¿Es peligrosa la Route Umbwe?',
      answer:
        'El itinerario no es peligroso si se aborda correctamente, pero es físicamente más exigente que otros. El principal riesgo es el mal agudo de montaña debido a la subida rápida. Nos tomamos la seguridad muy en serio y monitoreamos atentamente a todos los escaladores para detectar signos de MAM (mal agudo de montaña).',
    },
    {
      question: '¿Qué tipo de alojamiento se proporciona en la Route Umbwe?',
      answer:
        'Todo el alojamiento se realiza en tiendas de montaña, instaladas en lugares designados. Proporcionamos tiendas de noche de calidad, colchonetas gruesas, y una tienda comedor separada con mesas y sillas para tu comodidad.',
    },
    {
      question: '¿Qué está incluido en el paquete de escalada Umbwe?',
      answer:
        'Nuestro paquete incluye guías de montaña profesionales, porteadores, tasas de parque, equipo de campamento, las comidas en la montaña y los traslados desde/hacia tu hotel. Vuelos internacionales, propinas, equipo personal y noches adicionales en lodge no están incluidos.',
    },
    {
      question: '¿Puedo alquilar equipo si no lo tengo todo?',
      answer:
        'Sí, ofrecemos alquiler de equipo en Moshi o Arusha. Artículos como sacos de dormir, bastones de trekking, chaquetas y botas están disponibles en alquiler a precios razonables. Te proporcionaremos una lista de verificación del equipo antes de tu viaje.',
    },
    {
      question: '¿Cómo es el clima en la Route Umbwe?',
      answer:
        'El clima varía según la altitud. Espera condiciones húmedas de selva tropical al principio, condiciones alpinas frías y secas a mitad de recorrido, y temperaturas glaciales cerca de la cumbre. Es importante vestirse por capas y prepararse para cambios climáticos repentinos.',
    },
    {
      question: '¿Cuál es la mejor época para escalar la Route Umbwe?',
      answer:
        'Los mejores períodos para el trekking son durante las temporadas secas: de enero a principios de marzo y de junio a octubre. Estos meses ofrecen los cielos más despejados, las mejores condiciones de los senderos y un clima más estable.',
    },
  ],
  hubSummary:
    'La Route Umbwe es conocida por su escalada exigente y empinada, además de su magnífico sendero menos concurrido.',
  hubImage: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Route Umbwe en 6 días'},
}

const northernCircuit9Es: TripEs = {
  slug: '9-days-northern-circuit-route',
  category: 'package',
  name: '9 Días Northern Circuit',
  durationDays: 9,
  seoTitle: '9 Días Route Northern Circuit | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete 9 Días Route Northern Circuit.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Moir Hut, Buffalo Camp, Third Cave Camp, School Hut, Uhuru Peak, Mweka Camp y Mweka Gate',
  priceDisclaimer:
    '*El precio por persona incluye: un guía de montaña profesional, las tasas de entrada al parque, todo el alojamiento en campamento, las comidas durante el trek, los traslados desde/hacia la entrada del parque, y una estancia en hotel en Moshi/Arusha después de la escalada.',
  overviewBody: [
    'La Route Northern Circuit es la ruta más reciente y emocionante del Kilimanjaro — y probablemente la más gratificante. Ofrece vistas de 360° incomparables, menos afluencia, y el mejor perfil de aclimatación entre todas las rutas del Kilimanjaro. Extendiéndose por nueve días, este trek comienza en el lado oeste aislado de la montaña y rodea las laderas norte raramente recorridas antes de escalar la cumbre desde el este. Es ideal para quienes buscan una experiencia más inmersiva y panorámica con una tasa de éxito en la cumbre muy alta.',
    'Si buscas una aventura más tranquila y fuera de lo común, con paisajes magníficos y suficiente tiempo para adaptarte a la altitud, la Route Northern Circuit es tu itinerario ideal.',
  ],
  mapImage: {
    src: '/images/packages/9-days-northern-circuit-route/hero.png',
    alt: 'Mapa de la Route Northern Circuit en el Kilimanjaro',
  },
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'El Kilimanjaro sobre la sabana de acacias'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Escaladores acercándose a la cumbre en la nieve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 días'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 días'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 días'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 días'},
  ],
  itinerary: [
    arrivalEs,
    {
      day: 1,
      label: 'Londorossi Gate – Mti Mkubwa Camp',
      location: 'Londorossi Gate (2.100 m/6.890 pies) → Mti Mkubwa Camp (2.650 m/8.694 pies)',
      meta: ['Desnivel positivo: 550 m / 1.804 pies', 'Duración: 3-4 horas'],
      body: ['Haz una caminata a través de una densa selva tropical llena de aves y monos. Este breve primer día favorece la aclimatación.'],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa – Shira 1 Camp',
      location: 'Mti Mkubwa (2.650 m/8.694 pies) → Shira 1 Camp (3.610 m/11.844 pies)',
      meta: ['Desnivel positivo: 960 m / 3.150 pies', 'Duración: 5-6 horas'],
      body: ['Sube constantemente saliendo del bosque hacia el brezal. Disfruta de amplias vistas de la meseta de Shira y del Monte Meru a lo lejos.'],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-2.jpg', alt: 'Meseta de Shira'},
    },
    {
      day: 3,
      label: 'Shira 1 – Shira 2 Camp',
      location: 'Shira 1 Camp (3.610 m/11.844 pies) → Shira 2 Camp (3.850 m/12.631 pies)',
      meta: ['Desnivel positivo: 240 m / 787 pies', 'Duración: 4-5 horas'],
      body: ['Hoy es una caminata suave a través de la meseta de alta montaña. Comenzarás a percibir la inmensidad de la montaña atravesando paisajes volcánicos.'],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-2.jpg', alt: 'Vista de Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Shira 2 – Lava Tower – Moir Hut',
      location: 'Shira 2 (3.850 m/12.631 pies) → Lava Tower (4.600 m/15.091 pies) → Moir Hut (4.200 m/13.780 pies)',
      meta: ['Desnivel positivo: 750 m / 2.460 pies', 'Desnivel negativo: 400 m / 1.311 pies', 'Duración: 6-7 horas'],
      body: ['Sube hasta Lava Tower para la aclimatación antes de descender hacia Moir Hut. Este es un día esencial para adaptarte a la altitud.'],
      overnightStay: 'Moir Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day4-moir-hut.jpg', alt: 'Moir Hut'},
    },
    {
      day: 5,
      label: 'Moir Hut – Buffalo Camp',
      location: 'Moir Hut (4.200 m/13.780 pies) → Buffalo Camp (4.020 m/13.188 pies)',
      meta: ['Desnivel positivo: 200 m / 656 pies', 'Desnivel negativo: 380 m / 1.247 pies', 'Duración: 5-6 horas'],
      body: ['Explora las laderas norte prístinas con amplias vistas de Kenia. Un itinerario tranquilo con muy poca afluencia.'],
      overnightStay: 'Buffalo Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day5-buffalo-camp.jpg', alt: 'Buffalo Camp'},
    },
    {
      day: 6,
      label: 'Buffalo Camp – Third Cave Camp',
      location: 'Buffalo Camp (4.020 m/13.188 pies) → Third Cave Camp (3.870 m/12.697 pies)',
      meta: ['Desnivel positivo: 150 m / 492 pies', 'Duración: 5-6 horas'],
      body: ['Un día suave en dirección este a través de un terreno de desierto alpino. Menos afluencia, más tranquilidad.'],
      overnightStay: 'Third Cave Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-camp.jpg', alt: 'Third Cave Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-2.jpg', alt: 'Vista de Third Cave Camp'},
    },
    {
      day: 7,
      label: 'Third Cave Camp – School Hut',
      location: 'Third Cave (3.870 m/12.697 pies) → School Hut (4.750 m/15.584 pies)',
      meta: ['Desnivel positivo: 880 m / 2.887 pies', 'Duración: 4-5 horas'],
      body: ['Una subida empinada a través de paisajes cada vez más áridos. Descansa temprano para tu esfuerzo hacia la cumbre a medianoche.'],
      overnightStay: 'School Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut.jpg', alt: 'School Hut'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut-2.webp', alt: 'Cartel de School Hut'},
    },
    {
      day: 8,
      label: 'Día de la Cumbre (Uhuru Peak) – Mweka Camp',
      location: 'School Hut (4.750 m/15.584 pies) → Uhuru Peak (5.895 m/19.341 pies) → Mweka Camp (3.100 m/10.170 pies)',
      meta: ['Desnivel positivo: 1.145 m / 3.757 pies', 'Desnivel negativo: 2.795 m / 9.169 pies', 'Duración: 12-14 horas'],
      body: [
        'Inicia tu escalada a medianoche. Llega a Stella Point al amanecer, luego a la cumbre de Uhuru Peak. Desciende a través de pedregales y brezales hasta Mweka Camp.',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-2.jpg', alt: 'Cabañas de Mweka Camp'},
    },
    {
      day: 9,
      label: 'De Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 pies) → Mweka Gate (1.830 m/6.000 pies)',
      meta: ['Desnivel negativo: 1.280 m / 4.220 pies', 'Duración: 2-3 horas'],
      body: bodyMwekaToGateEs,
      image: {src: '/images/packages/9-days-northern-circuit-route/day9-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: 'FAQ Route Northern Circuit en 9 Días',
  faqIntro:
    '¿Tienes preguntas sobre la escalada del Kilimanjaro con nosotros? Consulta nuestras FAQ sobre la Route Northern Circuit a continuación para obtener respuestas claras y útiles. Si no encuentras lo que buscas, no dudes en contactarnos — nuestros expertos de montaña de Asili Climbing Kilimanjaro están aquí para ayudarte a planificar una aventura de cumbre segura, exitosa e inolvidable.',
  faqs: [
    {
      question: '¿Cuál es el nivel de dificultad de la Route Northern Circuit?',
      answer:
        'Es un itinerario de dificultad moderada a exigente, pero su larga duración lo convierte en uno de los más fáciles en términos de aclimatación. Con nueve días, tu cuerpo tiene ampliamente el tiempo de adaptarse a la altitud.',
    },
    {
      question: '¿Qué diferencia a este itinerario de los demás?',
      answer:
        'El Northern Circuit es el itinerario más largo y tranquilo del Kilimanjaro. Rodea las laderas norte aisladas, ofreciendo vistas magníficas y una alta tasa de éxito en la cumbre.',
    },
    {
      question: '¿Son 9 días demasiado tiempo para pasar en la montaña?',
      answer:
        'Para nada. Este tiempo prolongado permite una ganancia de altitud gradual, una mejor aclimatación y menos problemas relacionados con la altitud, aumentando tus posibilidades de llegar a Uhuru Peak con seguridad.',
    },
    {
      question: '¿Cómo es la noche de la cumbre?',
      answer:
        'Iniciarás tu escalada a medianoche desde School Hut. El objetivo es llegar a la cumbre al amanecer, para luego descender a Mweka Camp el mismo día — un total de 12-14 horas de caminata.',
    },
    {
      question: '¿Cómo es el alojamiento durante el trek?',
      answer:
        'Todas las noches se pasan en tiendas de montaña proporcionadas por Asili Climbing Kilimanjaro. Las tiendas son cálidas, impermeables, y montadas por nuestro equipo antes de tu llegada al campamento.',
    },
    {
      question: '¿Se trata equitativamente a los porteadores y al personal?',
      answer:
        'Absolutamente. Seguimos los estándares del KPAP (Kilimanjaro Porters Assistance Project) para garantizar que todos los porteadores y el equipo reciban un pago justo y trabajen en condiciones seguras.',
    },
    {
      question: '¿Necesito experiencia de trekking previa?',
      answer:
        'No necesariamente. Debes estar en buena condición física y mentalmente preparado. Nuestros guías adaptan el ritmo del trek a tus capacidades y garantizan una aclimatación adecuada.',
    },
    {
      question: '¿Cuál es la mejor época para hacer el Northern Circuit?',
      answer:
        'Junio-octubre y enero-principios de marzo son ideales. Estos meses ofrecen cielos despejados, menos precipitaciones y mejores condiciones de los senderos.',
    },
    {
      question: '¿Escalaré con un grupo?',
      answer:
        'Ofrecemos tanto escaladas privadas como treks de grupo abiertos. Puedes elegir el estilo que prefieras al momento de la reserva.',
    },
    {
      question: '¿Qué pasa si tengo mal agudo de montaña?',
      answer:
        'Tu guía monitorea tu salud diariamente. Si aparecen síntomas, actuamos de inmediato — adaptando el ritmo, ofreciendo apoyo con oxígeno, u organizando una evacuación si es necesario.',
    },
  ],
  hubSummary:
    'El itinerario más reciente y más largo, que ofrece vistas de 360 grados y las tasas de éxito más altas para llegar a la cumbre.',
  hubImage: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit en 9 días'},
}

// ---------------------------------------------------------------------------
// 4 combo packages (Kilimanjaro + safari)
// ---------------------------------------------------------------------------

const bodyTarangireEs = [
  'Sal de Arusha después del desayuno y dirígete directamente hacia el Parque Nacional de Tarangire, conocido por sus paisajes espectaculares salpicados de baobabs y sus importantes poblaciones de elefantes. El parque alberga leones, jirafas, cebras, ñus y más de 500 especies de aves. Después de un día completo de game drive, llegarás a tu lodge cerca del lago Manyara o en Karatu para la cena y el pernocte.',
]
const bodyNgorongoroEs = [
  'Después de un desayuno matutino, desciende al magnífico cráter del Ngorongoro, sitio Patrimonio de la Humanidad de la UNESCO, a menudo apodado la «octava maravilla del mundo». Esta inmensa caldera es un refugio para la fauna — incluyendo elefantes, leones, búfalos, hipopótamos, flamencos y el rinoceronte negro en peligro. Disfruta de un picnic en el fondo del cráter antes de regresar a tu lodge.',
]
const bodyManyaraEs = [
  'Comienza tu mañana con un trayecto hacia el Parque Nacional del Lago Manyara, famoso por su exuberante bosque de aguas subterráneas, su lago cubierto de flamencos y sus leones trepadores de árboles. Este parque compacto pero variado es perfecto para un último game drive relajado. Después del almuerzo, regresa a Arusha donde tu safari concluye. Bajo solicitud, podemos trasladarte al aeropuerto para tu vuelo de conexión.',
]

const combo9Es: TripEs = {
  slug: '9-days-kilimanjaro-safari',
  category: 'combo',
  name: '9 Días Kilimanjaro y Safari',
  durationDays: 9,
  seoTitle: '9 Días Kilimanjaro y Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete combinado 9 Días Kilimanjaro y Safari.',
  stopsLine:
    'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate, Parque Nacional de Tarangire, Cráter del Ngorongoro, Parque Nacional del Lago Manyara',
  priceDisclaimer: comboPriceDisclaimerEs,
  overviewBody: [
    'Esta aventura de 9 días es la forma definitiva de descubrir el corazón de Tanzania — combinando la emoción de escalar el Monte Kilimanjaro por la pintoresca y cómoda Route Marangu, con la emoción de un clásico safari del circuito norte a través del Parque Nacional de Tarangire, el cráter del Ngorongoro y el lago Manyara.',
    'Ya sea que visites Tanzania por primera vez o estés cumpliendo un sueño de toda la vida, este viaje ofrece el equilibrio perfecto entre logro físico, paisajes impresionantes y encuentros cercanos con la fauna — todo respaldado por la experiencia y el cuidado del equipo de Asili Climbing Kilimanjaro.',
  ],
  mapImage: {src: '/images/combo/9-days-kilimanjaro-safari/marangu-trekkers.jpg', alt: 'Excursionistas en la Route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '9 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '9 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '9 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '9 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '9 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '9 Días Kilimanjaro y Safari'},
  ],
  itinerary: [
    comboArrivalEs(),
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      meta: ['Altitud: 1.860 m → 2.700 m', 'Desnivel positivo: 840 m (2.755 pies)', 'Duración: 4-5 horas'],
      body: [
        'Inicia tu viaje a través de una exuberante selva tropical poblada por colobos y una flora vibrante. Después de una subida constante, llegarás a Mandara Hut para tu primera noche en la montaña.',
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/mandara.jpg', alt: 'Marangu Gate – Mandara Hut'},
      overnightStay: 'Mandara Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/mandara-hut.webp', alt: 'Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      meta: ['Altitud: 2.700 m → 3.720 m', 'Desnivel positivo: 1.020 m (3.346 pies)', 'Duración: 6-7 horas'],
      body: ['Saliendo del bosque, el sendero se transforma en brezal y erica. En el camino, disfruta de las vistas de los picos Kibo y Mawenzi.'],
      image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Mandara Hut – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 3,
      label: 'Aclimatación en Horombo Hut',
      meta: [
        'Altitud: 3.720 m → 4.000 m (Zebra Rocks) → 3.720 m',
        'Desnivel positivo: 280 m (918 pies)',
        'Desnivel negativo: 280 m (918 pies)',
        'Duración: 2-3 horas (caminata opcional)',
      ],
      body: ['Un día de aclimatación esencial para ayudar a tu cuerpo a adaptarse. Puedes hacer una breve caminata hasta Zebra Rocks y regresar para almorzar y descansar en Horombo.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-2.jpeg', alt: 'Aclimatación en Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo3.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      meta: ['Altitud: 3.720 m → 4.703 m', 'Desnivel positivo: 983 m (3.225 pies)', 'Duración: 6-7 horas'],
      body: ['El trek de hoy te hace atravesar un terreno de desierto alpino en dirección al campo base en Kibo Hut. Descansa temprano para prepararte para la noche de la cumbre.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut2.jpg', alt: 'Horombo Hut – Kibo Hut'},
      overnightStay: 'Kibo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut-1.jpg', alt: 'Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        'Altitud: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
        'Desnivel positivo: 1.192 m (3.910 pies)',
        'Desnivel negativo: 2.175 m (7.136 pies)',
        'Duración: 12-14 horas',
      ],
      body: [
        'Inicia tu esfuerzo hacia la cumbre poco después de medianoche, alcanzando Gilman\'s Point y luego Uhuru Peak al amanecer. Después de celebrar en la cumbre, desciende hacia Horombo Hut para tu última noche.',
      ],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Kibo Hut – Uhuru Peak – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Traslado',
      meta: ['Altitud: 3.720 m → 1.860 m', 'Desnivel negativo: 1.860 m (6.102 pies)', 'Duración: 5-6 horas'],
      body: ['Desciende por el brezal y la selva tropical hasta la entrada del parque. Después de recibir tu certificado de cumbre, serás trasladado a tu hotel.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/marangu.jpg', alt: 'Horombo Hut – Marangu Gate – Traslado'},
      overnightStay: 'Hotel en Arusha (incluido)',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Hotel en Arusha (incluido)'},
    },
    {
      day: 7,
      label: 'Arusha – Parque Nacional de Tarangire',
      meta: ['Tiempo de trayecto: aproximadamente 2,5 horas desde Arusha', 'Punto destacado: manadas de elefantes y antiguos baobabs'],
      body: bodyTarangireEs,
      image: {src: '/images/combo/9-days-kilimanjaro-safari/Gallery-img07.webp', alt: 'Arusha – Parque Nacional de Tarangire'},
      overnightStay: 'Lodge en Karatu o en la región del lago Manyara',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Lodge en Karatu o en la región del lago Manyara'},
    },
    {
      day: 8,
      label: 'Cráter del Ngorongoro',
      meta: ['Tiempo de trayecto: 45 minutos-1 hora hasta la entrada del cráter', 'Punto destacado: observación de los Big Five en una caldera volcánica'],
      body: bodyNgorongoroEs,
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Cráter del Ngorongoro'},
      overnightStay: 'Mismo lodge en Karatu',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Mismo lodge en Karatu'},
    },
    {
      day: 9,
      label: 'Parque Nacional del Lago Manyara – Arusha',
      meta: ['Tiempo de trayecto: aproximadamente 1,5 horas de regreso a Arusha', 'Punto destacado: leones trepadores de árboles y flamencos'],
      body: bodyManyaraEs,
      image: {src: '/images/combo/9-days-kilimanjaro-safari/tanzania-safari.jpg', alt: 'Parque Nacional del Lago Manyara – Arusha'},
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: comboFaqHeadingEs,
  faqIntro: comboFaqIntroEs,
  faqs: comboFaqsEs,
  hubSummary:
    'Perfecto para los aventureros con poco tiempo disponible. Escala el Monte Kilimanjaro por un itinerario de 6 días, luego disfruta de un rápido safari de 3 días a través de los parques emblemáticos de Tanzania como el Ngorongoro y Tarangire.',
  hubImage: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: '9 Días Kilimanjaro y Safari'},
}

const combo10Es: TripEs = {
  slug: '10-days-kilimanjaro-and-safari',
  category: 'combo',
  name: '10 Días Kilimanjaro y Safari',
  durationDays: 10,
  seoTitle: '10 Días Kilimanjaro y Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete combinado 10 Días Kilimanjaro y Safari.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Parque Nacional de Tarangire, Cráter del Ngorongoro, Parque Nacional del Lago Manyara',
  priceDisclaimer: comboPriceDisclaimerEs,
  overviewBody: [
    'Esta aventura de 10 días es perfecta si deseas escalar el Monte Kilimanjaro descubriendo al mismo tiempo la magia de un clásico safari africano — todo en un único viaje inolvidable. Comenzarás con un trek de 7 días por la Route Machame, conocida por sus paisajes magníficos y su buena aclimatación. Es apreciada por los escaladores por buenas razones: atravesarás una exuberante selva tropical, altos brezales y un accidentado terreno alpino antes de llegar a la cumbre de la montaña más alta de África — Uhuru Peak a 5.895 metros.',
  ],
  mapImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/machame.png', alt: 'Mapa del 10 Días Kilimanjaro y Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '10 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '10 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '10 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '10 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '10 Días Kilimanjaro y Safari'},
  ],
  itinerary: [
    comboArrivalEs(),
    {
      day: 1,
      label: 'De Machame Gate a Machame Camp',
      meta: ['Machame Gate (1.800 m/5.900 pies) → Machame Camp (3.000 m/9.800 pies)', 'Desnivel positivo: 1.200 m / 3.900 pies', 'Duración: 6-7 horas'],
      body: [bodyMachameGateToCampEs[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-.jpg', alt: 'De Machame Gate a Machame Camp'},
      overnightStay: 'Machame Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-Camp.jpg', alt: 'Machame Camp'},
    },
    {
      day: 2,
      label: 'De Machame Camp a Shira Camp',
      meta: ['Machame Camp (3.000 m/9.800 pies) → Shira Camp (3.840 m/12.600 pies)', 'Desnivel positivo: 840 m / 2.800 pies', 'Duración: 5-6 horas'],
      body: [bodyMachameCampToShiraEs[0]],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'De Machame Camp a Shira Camp'},
      overnightStay: 'Shira Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira Camp'},
    },
    {
      day: 3,
      label: 'De Shira Camp a Barranco Camp vía Lava Tower',
      meta: [
        'Shira Camp (3.840 m/12.600 pies) → Lava Tower (4.550 m/14.900 pies) → Barranco Camp (3.850 m/12.650 pies)',
        'Desnivel positivo: 710 m / 2.300 pies',
        'Desnivel negativo: 700 m / 2.250 pies',
        'Duración: 6-7 horas',
      ],
      body: [bodyShiraToBarrancoViaLavaTowerEs[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lava-Tower.jpg', alt: 'De Shira Camp a Barranco Camp vía Lava Tower'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 4,
      label: 'De Barranco Camp a Karanga Camp vía la Barranco Wall',
      meta: [
        'Barranco Camp (3.850 m/12.600 pies) → Barranco Wall (4.200 m/13.800 pies) → Karanga Camp (3.950 m/13.000 pies)',
        'Desnivel positivo: 350 m / 1.150 pies',
        'Desnivel negativo: 250 m / 820 pies',
        'Duración: 3-4 horas',
      ],
      body: [bodyBarrancoWallToKarangaEs[0]],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'De Barranco Camp a Karanga Camp vía la Barranco Wall'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 5,
      label: 'De Karanga Camp a Barafu Camp',
      meta: ['Karanga Camp (3.950 m/13.000 pies) → Barafu Camp (4.600 m/15.100 pies)', 'Desnivel positivo: 650 m / 2.150 pies', 'Duración: 3-4 horas'],
      body: [bodyKarangaToBarafuEs[0]],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'De Karanga Camp a Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Barafu-Camp.webp', alt: 'Barafu Camp'},
    },
    {
      day: 6,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      meta: [
        'Barafu Camp (4.600 m/15.100 pies) → Uhuru Peak (5.895 m/19.300 pies) → Mweka Camp (3.110 m/10.200 pies)',
        'Desnivel positivo: 1.295 m / 4.200 pies',
        'Desnivel negativo: 2.785 m / 9.100 pies',
        'Subida a la cumbre: 6-8 horas',
        'Descenso: 6 horas',
      ],
      body: [bodySummitToMwekaEs[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Uhuru-Peak.webp', alt: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Mweka-Camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 7,
      label: 'De Mweka Camp a Mweka Gate',
      meta: ['Mweka Camp (3.110 m/10.200 pies) → Mweka Gate (1.830 m/6.000 pies)', 'Desnivel negativo: 1.280 m / 4.220 pies', 'Duración: 2-3 horas'],
      body: [bodyMwekaToGateEs[0]],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Cartel de Mweka Gate en el Parque Nacional del Kilimanjaro'},
      overnightStay: 'Planet Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/planet-lodge1.jpg', alt: 'Planet Lodge'},
    },
    {
      day: 8,
      label: 'Arusha – Parque Nacional de Tarangire',
      meta: ['Tiempo de trayecto: aproximadamente 2,5 horas desde Arusha', 'Punto destacado: manadas de elefantes y antiguos baobabs'],
      body: bodyTarangireEs,
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/h.jpg', alt: 'Arusha – Parque Nacional de Tarangire'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/marera-2.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 9,
      label: 'Game Drive en el Cráter del Ngorongoro',
      meta: ['Tiempo de trayecto: 45 minutos-1 hora hasta la entrada del cráter', 'Punto destacado: observación de los Big Five en una caldera volcánica'],
      body: bodyNgorongoroEs,
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Ngorongoro-Crater.jpg', alt: 'Game Drive en el Cráter del Ngorongoro'},
      overnightStay: 'Ngorongoro Rhino Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Rhino-Lodge1.jpeg', alt: 'Ngorongoro Rhino Lodge'},
    },
    {
      day: 10,
      label: 'Parque Nacional del Lago Manyara – Arusha',
      meta: ['Tiempo de trayecto: aproximadamente 1,5 horas de regreso a Arusha', 'Punto destacado: leones trepadores de árboles y flamencos'],
      body: bodyManyaraEs,
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lake-Manyara-National-Park.jpg', alt: 'Parque Nacional del Lago Manyara – Arusha'},
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: comboFaqHeadingEs,
  faqIntro: comboFaqIntroEs,
  faqs: comboFaqsEs,
  hubSummary:
    'Una aventura bien equilibrada que combina una escalada del Kilimanjaro de 7 días (por la Route Machame) con un safari de fauna de 3 días — ideal para descubrir lo mejor de la montaña y la sabana.',
  hubImage: {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Días Kilimanjaro y Safari'},
}

const combo11Es: TripEs = {
  slug: '11-days-kilimanjaro-safari',
  category: 'combo',
  name: '11 Días Kilimanjaro y Safari',
  durationDays: 11,
  seoTitle: '11 Días Kilimanjaro y Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete combinado 11 Días Kilimanjaro y Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Tarangire, Cráter del Ngorongoro, Parque Nacional del Lago Manyara',
  priceDisclaimer: comboPriceDisclaimerEs,
  overviewBody: [
    'Este viaje de 11 días une dos de los mayores tesoros de Tanzania — la majestuosa cumbre del Monte Kilimanjaro y la belleza cruda e inolvidable de sus parques nacionales. Con 8 días en la Route Lemosho, una de las rutas de trekking más panorámicas y exitosas del Kilimanjaro, seguidos de 3 días de clásico safari, este itinerario ofrece una combinación única de desafío, descubrimiento y conexión profunda con la naturaleza.',
  ],
  mapImage: {src: '/images/combo/11-days-kilimanjaro-safari/lemosho.png', alt: 'Mapa del 11 Días Kilimanjaro y Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '11 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '11 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '11 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '11 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '11 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '11 Días Kilimanjaro y Safari'},
  ],
  itinerary: [
    comboArrivalEs(),
    {
      day: 1,
      label: 'De Lemosho Gate a Mti Mkubwa',
      meta: ['Altitud: 2.100 m → 2.650 m', 'Desnivel positivo: 550 m (1.805 pies)', 'Duración: 3-4 horas'],
      body: [
        'Después del desayuno, conducirás desde Arusha hasta Londorossi Gate para el registro. Luego continuarás hasta Lemosho Gate, donde la excursión comienza a través de una exuberante selva tropical. Esta zona es rica en fauna, con colobos blancos y negros y aves forestales. Caminarás bajo un denso dosel de árboles antes de llegar a Mti Mkubwa (Big Tree) Camp para pasar la noche.',
      ],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'De Lemosho Gate a Mti Mkubwa'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/mti-mkubwa-1.webp', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp a Shira 1 Camp',
      meta: ['Mti Mkubwa Camp (2.650 m) – Shira 1 Camp (3.610 m)', 'Desnivel positivo: 960 m (3.150 pies)', 'Duración: 6-7 horas'],
      body: [
        'El sendero de hoy sube progresivamente saliendo de la selva tropical hacia la zona de erica y brezal. A medida que subes, los árboles se dispersan y el paisaje se abre, ofreciendo vistas magníficas de la cresta de Shira y el pico Kibo. Después de una caminata pintoresca a través de colinas onduladas y formaciones rocosas volcánicas, llegarás a Shira 1 Camp en la meseta de Shira.',
      ],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'De Mti Mkubwa Camp a Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'De Shira 1 Camp a Shira 2 Camp',
      meta: ['Shira 1 Camp (3.610 m) – Shira 2 Camp (3.850 m)', 'Desnivel positivo: 240 m (787 pies)', 'Duración: 3-4 horas'],
      body: [bodyShiraToBarrancoViaLavaTowerEs[0]],
      image: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'De Shira 1 Camp a Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'De Shira 2 Camp a Lava Tower y luego a Barranco Camp',
      meta: ['Shira 2 Camp (3.850 m) → Lava Tower (4.630 m) → Barranco Camp', 'Desnivel positivo: 780 m', 'Desnivel negativo: 654 m', 'Duración: 6-7 horas'],
      body: [
        'Sube constantemente hasta la imponente Lava Tower, donde te detendrás para almorzar. Luego desciende al magnífico valle de Barranco para pasar la noche. Este es uno de los días de aclimatación más importantes del itinerario.',
      ],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'De Shira 2 Camp a Lava Tower y luego a Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'De Barranco Camp a Karanga Camp',
      meta: ['Barranco Camp (3.976 m) → Karanga Camp (4.035 m)', 'Desnivel positivo: 59 m / 194 pies', 'Duración: 4-5 horas'],
      body: [
        'Escala la célebre Barranco Wall — exigente pero no técnica. Continúa a través de un terreno alpino hasta Karanga Camp. Este día más corto le da a tu cuerpo más tiempo para aclimatarse antes de la noche de la cumbre.',
      ],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'De Barranco Camp a Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'De Karanga Camp a Barafu Camp',
      meta: ['Karanga Camp (4.035 m / 13.238 pies) → Barafu Camp (4.703 m / 15.430 pies)', 'Desnivel positivo: 668 m / 2.192 pies', 'Duración: 3-4 horas'],
      body: [
        'Un trek corto pero empinado a través de un desierto alpino de alta montaña hasta tu último campamento antes de la noche de la cumbre. Descansa, hidrátate y prepárate mentalmente para el desafío que te espera.',
      ],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'De Karanga Camp a Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/barafu-camp1.jpg', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Barafu Camp → Uhuru Peak → Mweka Camp',
      meta: [
        'Barafu Camp (4.703 m / 15.430 pies) → Uhuru Peak (5.895 m / 19.341 pies) → Mweka Camp (3.720 m / 12.205 pies)',
        'Desnivel positivo: 1.192 m / 3.910 pies',
        'Desnivel negativo: 2.175 m / 7.136 pies',
        'Duración: 12-14 horas',
      ],
      body: [
        'Inicia tu esfuerzo hacia la cumbre a medianoche. Llega a Stella Point al amanecer, luego continúa hacia Uhuru Peak — el punto más alto de África. Después de celebrar en la cumbre, desciende hasta Mweka Camp.',
      ],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Barafu Camp → Uhuru Peak → Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp → Mweka Gate',
      meta: ['Mweka Camp (3.720 m / 12.205 pies) → Mweka Gate (1.640 m / 5.380 pies)', 'Desnivel negativo: 2.080 m / 6.824 pies', 'Duración: 3-4 horas'],
      body: [
        'Atraviesa una exuberante selva tropical hasta la entrada del parque, donde recibirás tu certificado del Kilimanjaro. Tu conductor te trasladará a tu hotel para una ducha caliente y un descanso bien merecido.',
      ],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp → Mweka Gate'},
      overnightStay: 'Lodge en Arusha',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/Kaliwa-Lodge.jpg', alt: 'Lodge en Arusha'},
    },
    {
      day: 9,
      label: 'Parque Nacional de Tarangire',
      meta: ['Tiempo de trayecto: aproximadamente 2,5 horas desde Arusha', 'Punto destacado: manadas de elefantes y antiguos baobabs'],
      body: bodyTarangireEs,
      image: {src: '/images/combo/11-days-kilimanjaro-safari/Gallery-img04-1.webp', alt: 'Parque Nacional de Tarangire'},
      overnightStay: 'Lodge en Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Lodge en Karatu'},
    },
    {
      day: 10,
      label: 'Cráter del Ngorongoro',
      meta: ['Tiempo de trayecto: 45 minutos-1 hora hasta la entrada del cráter', 'Punto destacado: observación de los Big Five en una caldera volcánica'],
      body: bodyNgorongoroEs,
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Cráter del Ngorongoro'},
      overnightStay: 'Mismo lodge en Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Mismo lodge en Karatu'},
    },
    {
      day: 11,
      label: 'Parque Nacional del Lago Manyara – Arusha',
      meta: ['Tiempo de trayecto: aproximadamente 1,5 horas de regreso a Arusha', 'Punto destacado: leones trepadores de árboles y flamencos'],
      body: [
        'Comienza tu mañana con un trayecto hacia el Parque Nacional del Lago Manyara, famoso por su exuberante bosque de aguas subterráneas, su lago cubierto de flamencos y sus leones trepadores de árboles. Este parque compacto pero variado es perfecto para un último game drive relajado. Después del almuerzo, regresa a Arusha donde tu safari concluye. Opcionalmente, podemos trasladarte al aeropuerto para tu vuelo de conexión.',
      ],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/zebra.jpg', alt: 'Parque Nacional del Lago Manyara – Arusha'},
    },
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: comboFaqHeadingEs,
  faqIntro: comboFaqIntroEs,
  faqs: comboFaqsEs,
  hubSummary:
    'Esta opción te deja tiempo para aclimatarte correctamente durante una escalada de 7 días, para luego relajarte con un safari de 4 días a través del Serengeti, el Ngorongoro y otros parques imperdibles.',
  hubImage: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: '11 Días Kilimanjaro y Safari'},
}

const combo12Es: TripEs = {
  slug: '12-days-kilimanjaro-safari',
  category: 'combo',
  name: '12 Días Kilimanjaro y Safari',
  durationDays: 12,
  seoTitle: '12 Días Kilimanjaro y Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario día por día real, tarifas y prestaciones incluidas para el paquete combinado 12 Días Kilimanjaro y Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Parque Nacional de Tarangire, Parque Nacional del Serengeti, Cráter del Ngorongoro',
  priceDisclaimer: comboPriceDisclaimerEs,
  overviewBody: [
    'Esta aventura de 12 días une la pintoresca Route Lemosho hacia el Monte Kilimanjaro con un safari completo del circuito norte a través de Tarangire, el Serengeti y el cráter del Ngorongoro. Comenzando en las laderas oeste aisladas de la montaña, la escalada ofrece un inicio más tranquilo, ecosistemas variados y una excelente aclimatación durante ocho días en la montaña.',
    'Después de tu intento de cumbre, continúa directamente con cuatro días de game drive — persiguiendo elefantes y baobabs en Tarangire, pasando un día completo siguiendo la migración de ñus y los grandes felinos a través de las llanuras infinitas del Serengeti, para luego descender al cráter del Ngorongoro, a menudo apodado la «octava maravilla del mundo», antes de regresar a Arusha.',
  ],
  mapImage: {src: '/images/combo/12-days-kilimanjaro-safari/lemosho4.png', alt: 'Mapa del 12 Días Kilimanjaro y Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '12 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '12 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '12 Días Kilimanjaro y Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/simba-camp-2.jpg', alt: '12 Días Kilimanjaro y Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro-climb.webp', alt: '12 Días Kilimanjaro y Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Días Kilimanjaro y Safari'},
  ],
  itinerary: [
    comboArrivalEs(),
    {
      day: 1,
      label: 'De Londorossi Gate a Mti Mkubwa Camp',
      meta: ['Lemosho Gate (2.100 m / 6.890 pies) → Mti Mkubwa (2.650 m / 8.694 pies)', 'Desnivel positivo: 550 m / 1.804 pies', 'Duración: 3-4 horas'],
      body: [
        'Inicia tu escalada del Kilimanjaro con un trayecto panorámico hasta Londorossi Gate, donde se gestionan los permisos y el registro. Desde la entrada, un breve trayecto a través del bosque montano te lleva al punto de partida en Lemosho. El trek hasta Mti Mkubwa (Big Tree Camp) te lleva a través de una exuberante selva tropical, hogar de cercopitecos azules y una gran variedad de aves.',
      ],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'De Londorossi Gate a Mti Mkubwa Camp'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/mti-mkubwa-camp-scaled.jpg', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp a Shira 1 Camp',
      meta: ['Mti Mkubwa (2.650 m / 8.694 pies) → Shira 1 Camp (3.610 m / 11.843 pies)', 'Desnivel positivo: 960 m / 3.150 pies', 'Duración: 5-6 horas'],
      body: [
        'Hoy emergerás del bosque hacia la zona de erica y brezal, subiendo constantemente hacia la cresta de Shira y descendiendo ligeramente para acampar en la meseta de Shira, con vista de las laderas superiores del Kilimanjaro.',
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro_climbing-1.jpg', alt: 'De Mti Mkubwa Camp a Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/second-camp.webp', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'De Shira 1 Camp a Shira 2 Camp',
      meta: ['Shira 1 (3.610 m / 11.843 pies) → Shira 2 Camp (3.850 m / 12.631 pies)', 'Desnivel positivo: 240 m / 787 pies', 'Duración: 3-4 horas'],
      body: [
        'Un día más corto para favorecer la aclimatación, atravesando la pintoresca meseta de Shira. Disfrutarás de amplias vistas y un ritmo relajado hasta Shira 2 Camp.',
      ],
      image: {src: '/images/combo/shared/shira-camp.webp', alt: 'De Shira 1 Camp a Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'De Shira 2 Camp a Barranco Camp (vía Lava Tower)',
      meta: [
        'Shira 2 (3.850 m / 12.631 pies) → Lava Tower (4.630 m / 15.190 pies) → Barranco Camp (3.976 m / 13.044 pies)',
        'Desnivel positivo: 780 m / 2.559 pies',
        'Desnivel negativo: 654 m / 2.145 pies',
        'Duración: 6-7 horas',
      ],
      body: [
        'Subir alto, dormir bajo — este día de aclimatación esencial te lleva a Lava Tower para almorzar antes de descender al frondoso valle de Barranco. Un día espectacular con paisajes en constante cambio.',
      ],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'De Shira 2 Camp a Barranco Camp (vía Lava Tower)'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'De Barranco Camp a Karanga Camp',
      meta: ['Barranco (3.976 m / 13.044 pies) → Karanga Camp (3.995 m / 13.107 pies)', 'Desnivel positivo: 240 m / 787 pies', 'Desnivel negativo: 220 m / 722 pies', 'Duración: 4-5 horas'],
      body: [
        'Enfrenta la imponente Barranco Wall, un momento clave del trek, luego atraviesa crestas y valles antes de llegar a Karanga Camp. Otro día importante para la aclimatación.',
      ],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'De Barranco Camp a Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'De Karanga Camp a Barafu Camp',
      meta: ['Karanga (3.995 m / 13.107 pies) → Barafu Camp (4.673 m / 15.331 pies)', 'Desnivel positivo: 678 m / 2.224 pies', 'Duración: 3-4 horas'],
      body: [
        'Subirás a través del desierto alpino para llegar a Barafu, tu campo base para el intento de cumbre. Descansa, hidrátate y prepárate mentalmente para la escalada de medianoche hacia la cumbre de África.',
      ],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'De Karanga Camp a Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/barafu-camp-1.webp', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp',
      meta: [
        'Barafu (4.673 m / 15.331 pies) → Uhuru Peak (5.895 m / 19.341 pies) → Mweka Camp (3.110 m / 10.204 pies)',
        'Desnivel positivo: 1.222 m / 4.010 pies',
        'Desnivel negativo: 2.785 m / 9.137 pies',
        'Duración: 12-14 horas',
      ],
      body: [
        '¡Día de la cumbre! Sal antes de medianoche para llegar a Stella Point al amanecer y continuar hasta Uhuru Peak. Después de celebrar en la cumbre, desciende a Barafu para una breve pausa, luego continúa hacia Mweka Camp para un descanso bien merecido.',
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/solo-climb.jpeg', alt: 'De Barafu Camp a Uhuru Peak y luego a Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'De Mweka Camp a Mweka Gate',
      meta: ['Mweka Camp (3.110 m / 10.204 pies) → Mweka Gate (1.640 m / 5.380 pies)', 'Desnivel negativo: 1.470 m / 4.823 pies', 'Duración: 3-4 horas'],
      body: [
        'Disfruta de tu última caminata a través de la selva tropical. A tu llegada a la entrada del parque, recibe tu certificado de cumbre y regresa a tu hotel con recuerdos para toda la vida.',
      ],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'De Mweka Camp a Mweka Gate'},
      overnightStay: 'Hotel en Arusha',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Hotel en Arusha'},
    },
    {
      day: 9,
      label: 'Arusha – Parque Nacional de Tarangire',
      meta: ['Aproximadamente 2,5 horas de trayecto desde Arusha', 'Punto destacado: manadas de elefantes, baobabs y ambiente fuera de lo común'],
      body: [
        'Después del desayuno en Arusha, tu guía de safari de Asili te recogerá para el trayecto hacia el Parque Nacional de Tarangire, una de las joyas más subestimadas de Tanzania. A menudo pasado por alto en favor del Serengeti, Tarangire sorprende a los visitantes con su belleza salvaje, sus inmensos baobabs y su notable densidad de elefantes. Durante la temporada seca, el río Tarangire atrae a innumerables animales, creando escenas de fauna emocionantes.',
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/elephant-tara.jpg', alt: 'Arusha – Parque Nacional de Tarangire'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 10,
      label: 'Tarangire – Parque Nacional del Serengeti',
      meta: ['Aproximadamente 4-5 horas de trayecto a través de los altiplanos del Ngorongoro', 'Punto destacado: llanuras del Serengeti y paisajes ricos en depredadores'],
      body: [
        'Después del desayuno, tu viaje continúa a través del área de conservación del Ngorongoro en dirección al Serengeti. En el camino, disfruta de vistas panorámicas y pueblos masáis antes de entrar en el parque por Naabi Hill Gate. Una vez dentro, iniciarás tu game drive en el Serengeti, con la oportunidad de avistar a los grandes felinos, manadas de ñus, jirafas y mucho más.',
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/wildebeest-migration-serengeti.jpg', alt: 'Tarangire – Parque Nacional del Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 11,
      label: 'Día Completo de Game Drive en el Serengeti',
      meta: ['Itinerario flexible según la actividad de la fauna', 'Punto destacado: un día completo de observación de grandes animales y búsqueda de depredadores'],
      body: [
        'Levántate temprano para un día completo de observación de la fauna en el Parque Nacional del Serengeti, conocido por sus llanuras abiertas y sus espectaculares interacciones entre depredadores y presas. Según la temporada, tu guía te orientará hacia las zonas más activas — ya sea en Seronera, Ndutu, o más al norte. Observa leones persiguiendo búfalos, leopardos descansando en los árboles, y elefantes bañándose en los ríos estacionales.',
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/lion-serengeti1.jpg', alt: 'Día Completo de Game Drive en el Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 12,
      label: 'Serengeti – Cráter del Ngorongoro – Arusha',
      meta: ['Trayecto de un día completo con descenso al cráter (tiempo de trayecto total: 7-8 horas)', 'Punto destacado: observación de los Big Five y del rinoceronte negro dentro del cráter'],
      body: [
        'Después de un desayuno matutino, dejarás el Serengeti para llegar al cráter del Ngorongoro, donde descenderás a la caldera volcánica intacta más grande del mundo. Pasa el día explorando este anfiteatro natural poblado por leones, elefantes, flamencos, chacales e incluso rinocerontes. Después de un picnic cerca de un abrevadero de hipopótamos, sube de nuevo e inicia tu regreso hacia Arusha, donde llegarás por la tarde.',
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/rhino.jpg', alt: 'Serengeti – Cráter del Ngorongoro – Arusha'},
    },
    departureEs,
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: comboFaqHeadingEs,
  faqIntro: comboFaqIntroEs,
  faqs: [
    {
      question: '¿Qué está incluido en el paquete Kilimanjaro y safari de 12 días?',
      answer:
        'Tu paquete incluye los traslados de aeropuerto, el alojamiento en hotel en Arusha, un trek del Kilimanjaro totalmente guiado (con tasas de parque, porteadores, tiendas, comidas y guías de montaña certificados), además de un safari de fauna privado de 4 días con tasas de entrada a los parques, alojamiento en lodge, comidas, un vehículo de safari 4x4 y un guía profesional. Vuelos internacionales, propinas y gastos personales no están incluidos.',
    },
    {
      question: '¿Bastan 12 días para disfrutar tanto del Kilimanjaro como de un safari?',
      answer:
        'Sí, 12 días son ideales. Tendrás 7 u 8 días para escalar el Kilimanjaro con seguridad (por rutas como Lemosho o Machame), seguidos de un safari de 4 días a través de los parques más emblemáticos de Tanzania, como el Serengeti, el cráter del Ngorongoro y Tarangire. Descubrirás lo mejor de la montaña y la fauna en una única aventura.',
    },
    {
      question: '¿Cuál es la mejor época para hacer este viaje de 12 días?',
      answer:
        'Los mejores meses son de enero a principios de marzo y de junio a octubre, cuando las condiciones son favorables tanto para el trek del Kilimanjaro como para la observación de fauna en safari. Estas son las temporadas secas de Tanzania, que ofrecen cielos más despejados y excelentes observaciones de fauna.',
    },
    {
      question: '¿Es físicamente exigente la escalada del Kilimanjaro?',
      answer:
        'Escalar el Kilimanjaro es un trek no técnico, pero es físicamente exigente debido a la alta altitud. Una buena condición física, una determinación mental y una aclimatación adecuada (que garantizamos con itinerarios más largos como Lemosho) son esenciales para llegar a la cumbre con éxito. No se requiere ninguna experiencia de escalada previa.',
    },
    {
      question: '¿Puedo alquilar equipo para el Kilimanjaro si no lo tengo todo?',
      answer:
        'Sí. Asili Climbing Kilimanjaro ofrece alquiler de equipo de alta calidad como sacos de dormir, plumíferos, bastones de trekking, linternas frontales y mucho más. Se te proporcionará una lista completa del equipo recomendado, y puedes reservar con antelación cualquier artículo en alquiler que necesites.',
    },
    {
      question: '¿Qué tipo de alojamiento tendré durante el safari?',
      answer:
        'Utilizamos lodges y campamentos con tiendas cuidadosamente seleccionados, limpios, cómodos y situados cerca de los parques para el máximo acceso a la fauna. Ya sean de gama media o de lujo, todos ofrecen habitaciones con baño privado, buena cocina y una cálida hospitalidad.',
    },
    {
      question: '¿Estaré en un grupo o se trata de un circuito privado?',
      answer:
        'La mayoría de nuestros combinados Kilimanjaro y safari son circuitos privados, diseñados específicamente para ti o tu grupo. Esto permite mayor flexibilidad en el ritmo, atención personalizada y una experiencia a medida, tanto en la montaña como en safari.',
    },
    {
      question: '¿Es frecuente el mal agudo de montaña, y cómo lo gestionan?',
      answer:
        'El mal agudo de montaña puede afectar a cualquiera, independientemente del nivel de condición física. Monitoreamos tu salud diariamente en la montaña mediante oxímetros de pulso y guías experimentados formados en primeros auxilios de alta montaña. Itinerarios más largos como la Route Lemosho en 8 días mejoran la aclimatación y el éxito en la cumbre. En casos graves, se disponen protocolos de evacuación de emergencia.',
    },
    {
      question: '¿Qué tipo de comida se sirve durante la escalada y el safari?',
      answer:
        'En el Kilimanjaro, nuestros cocineros de montaña preparan comidas calientes y nutritivas cada día — espera sopas, arroz, pasta, verduras, platos de carne y fruta. Se toman en cuenta las dietas vegetarianas y particulares. En safari, los lodges ofrecen comidas de buffet o à la carte con opciones africanas e internacionales.',
    },
    {
      question: '¿Necesito un seguro de viaje?',
      answer:
        'Sí, un seguro de viaje completo es obligatorio. Tu póliza debe cubrir las emergencias médicas, la evacuación (incluso desde alta altitud), las cancelaciones de viaje y los retrasos. Podemos recomendarte aseguradoras confiables si no estás seguro.',
    },
    {
      question: '¿Cómo me preparo físicamente para este viaje?',
      answer:
        'Comienza un plan de entrenamiento 8-12 semanas antes de la partida, que incluya cardio, senderismo con mochila y fortalecimiento muscular. Las caminatas de fin de semana y las largas caminatas con desnivel ayudarán a preparar tus piernas y tus pulmones para las exigencias del Kilimanjaro.',
    },
    {
      question: '¿Cómo reservo esta experiencia de 12 días con Asili Climbing Kilimanjaro?',
      answer:
        '¡Reservar es sencillo! Simplemente contáctanos a través de nuestro sitio web o WhatsApp, y uno de nuestros especialistas te ayudará a personalizar tu viaje Kilimanjaro y safari. Un depósito del 20-30% asegura tu lugar, y te acompañaremos en cada etapa hasta tu llegada a Tanzania.',
    },
  ],
  hubSummary:
    'Una experiencia completa para los amantes de la naturaleza. Escala la cumbre más alta de África en 8 días (por la Route Lemosho) y continúa con 4 días inolvidables de búsqueda de fauna en safari.',
  hubImage: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Días Kilimanjaro y Safari'},
}

// ---------------------------------------------------------------------------
// 2 safaris (days 1-7 are identical across both safari itineraries)
// ---------------------------------------------------------------------------

const safariSharedDays1to7Es: SafariDayEs[] = [
  {
    day: 1,
    label: 'Arusha - Parque Nacional de Tarangire',
    image: {src: '/images/safari/shared/elephant-tara.jpg', alt: 'Arusha - Parque Nacional de Tarangire'},
    body: [
      [
        {text: 'La mañana después del desayuno:', bold: true},
        {text: ' Nuestro guía de safari te recogerá en tu hotel en la ciudad de Arusha. Luego recorrerás unos 120 km, casi 2 horas de trayecto, en dirección al Parque Nacional de Tarangire.'},
      ],
      [
        {text: 'Parque Nacional de Tarangire:', bold: true},
        {text: ' El Parque Nacional de Tarangire es conocido por sus grandes manadas de elefantes que deambulan libremente cerca de las orillas del río Tarangire, que representan verdaderamente un safari familiar en Tanzania, junto con muchas otras criaturas. Descubriremos los pantanos estacionales (zonas húmedas), la sabana y el río Tarangire, que desempeñan un papel esencial en el ecosistema del Parque Nacional de Tarangire y atraen a los animales durante la temporada seca.'},
      ],
      [
        {text: 'Observación de la fauna:', bold: true},
        {text: ' Observaremos tantos animales como sea posible, incluidos leones, cebras, mangostas, cerdos hormigueros, ñus, búfalos, elefantes y jirafas (por nombrar solo algunos). También podríamos vislumbrar brevemente leones y leopardos.'},
      ],
      [
        {text: 'Picnic y game drive:', bold: true},
        {text: ' Nuestro guía de safari profesional y experimentado elegirá un lugar adecuado para un delicioso almuerzo en el sitio de picnic designado. Después, retomarás el game drive hasta bien entrada la tarde.'},
      ],
      [
        {text: 'Traslado vespertino:', bold: true},
        {text: ' Por la tarde, serás trasladado a uno de nuestros hoteles asociados cuidadosamente seleccionados para la cena y el pernocte.'},
      ],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 2,
    label: 'Parque Nacional del Serengeti',
    image: {src: '/images/safari/shared/lake-manyara.webp', alt: 'Parque Nacional del Serengeti'},
    body: [
      [
        {
          text: 'La mañana después del desayuno, iniciarás tu safari hacia las llanuras infinitas del Parque Nacional del Serengeti, donde tendrás una vista del cráter del Ngorongoro desde el mirador del Ngorongoro antes de continuar hacia el Parque Nacional del Serengeti (al que llegarás por la tarde). Nuestro guía de safari profesional y experimentado elegirá un buen momento para un delicioso almuerzo acompañado de un poco de vino espumoso en medio de paisajes magníficos.',
        },
      ],
      [
        {
          text: 'El Parque Nacional del Serengeti es famoso por su variada fauna residente, incluidos los «Big Five», bien conocidos por ser los cinco trofeos animales más emblemáticos buscados por los cazadores. El Serengeti albergaría la mayor población de leones de África (aproximadamente 2.950), gracias a la diversidad de presas que lo habitan.',
        },
      ],
      [{text: 'El leopardo, esquivo, se observa con frecuencia en la región de Seronera, pero se encuentra en todo el parque. Su población se estima en unos 1.000 individuos.'}],
      [{text: 'Actividad de safari opcional:', bold: true}, {text: ' Safari en globo aerostático en el Serengeti (600 $ USA por persona)'}],
      [{text: 'Después del game drive, llegarás a tu alojamiento para la cena y el pernocte.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 3,
    label: 'Parque Nacional del Serengeti',
    image: {src: '/images/safari/shared/honeymoon1.jpg', alt: 'Parque Nacional del Serengeti'},
    body: [
      [
        {
          text: 'La mañana después del desayuno, iniciarás tu safari hacia las llanuras infinitas del Parque Nacional del Serengeti, donde tendrás una vista del cráter del Ngorongoro desde el mirador del Ngorongoro antes de continuar hacia el Parque Nacional del Serengeti (al que llegarás por la tarde). Nuestro guía de safari profesional y experimentado elegirá un buen momento para un delicioso almuerzo acompañado de un poco de vino espumoso en medio de paisajes magníficos.',
        },
      ],
      [
        {
          text: 'El Parque Nacional del Serengeti es famoso por su variada fauna residente, incluidos los «Big Five», bien conocidos por ser los cinco trofeos animales más emblemáticos buscados por los cazadores. El Serengeti albergaría la mayor población de leones de África (aproximadamente 2.950), gracias a la diversidad de presas que lo habitan.',
        },
      ],
      [{text: 'El leopardo, esquivo, se observa con frecuencia en la región de Seronera, pero se encuentra en todo el parque. Su población se estima en unos 1.000 individuos.'}],
      [{text: 'Actividad de safari opcional:', bold: true}, {text: ' Safari en globo aerostático en el Serengeti (600 $ USA por persona)'}],
      [{text: 'Después del game drive, llegarás a tu alojamiento para la cena y el pernocte.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 4,
    label: 'Parque Nacional del Serengeti / Cráter del Ngorongoro',
    image: {src: '/images/safari/shared/h.jpg', alt: 'Parque Nacional del Serengeti / Cráter del Ngorongoro'},
    body: [
      [
        {
          text: 'La mañana después del desayuno, dejarás el campamento con un picnic preparado hacia el cráter del Ngorongoro. Esta zona se encuentra al oeste de la región de Arusha, en la zona geológica de los Crater Highlands en Tanzania.',
        },
      ],
      [
        {
          text: 'A tu llegada al borde del cráter, tendrás un primer vistazo de lo que te espera al día siguiente en la pradera abierta, con un gran número de animales que has visto en los documentales de National Geographic. En el cráter, tendrás numerosas posibilidades de observar a los «Big Five» (león, leopardo, elefante, búfalo y rinoceronte), según tu suerte.',
        },
      ],
      [
        {
          text: 'Por la tarde, el almuerzo se te servirá en un sitio de picnic especialmente designado, luego partirás para un game drive vespertino hasta bien entrada la tarde. La cena y el pernocte se realizarán en el lodge.',
        },
      ],
      [{text: 'Actividad de safari opcional:', bold: true}],
      [{text: 'Visita a las gargantas de Olduvai y su museo (40 $ USA por persona)'}],
      [{text: 'Caminata por el borde del cráter del Ngorongoro (30 $ USA por persona)'}],
      [{text: 'Visita a un poblado masái (50 $ USA por vehículo)'}],
    ],
    overnightStay: 'Ngorongoro Rhino Lodge',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 5,
    label: 'Cráter del Ngorongoro',
    image: {src: '/images/safari/shared/ngorongoro.jpg', alt: 'Cráter del Ngorongoro'},
    body: [
      [
        {
          text: 'Después de un desayuno matutino, desciende al magnífico cráter del Ngorongoro, sitio Patrimonio de la Humanidad de la UNESCO, a menudo apodado la «octava maravilla del mundo». Esta inmensa caldera es un refugio para la fauna — incluyendo elefantes, leones, búfalos, hipopótamos, flamencos y el rinoceronte negro en peligro.',
        },
      ],
      [{text: 'Disfruta de un almuerzo de picnic en el fondo del cráter antes de subir de nuevo hacia tu lodge para la noche.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 6,
    label: 'Parque Nacional del Lago Manyara',
    image: {src: '/images/safari/shared/manyara.jpg', alt: 'Parque Nacional del Lago Manyara'},
    body: [
      [
        {
          text: 'La mañana después del desayuno, serás recogido en tu lodge y llevado al Parque Nacional del Lago Manyara (aproximadamente 30 minutos). El parque es un terreno de juego ideal para los aficionados a la fotografía y ofrece algunas de las mejores observaciones de fauna del mundo. Podrás avistar muchos animales emblemáticos de África, con los célebres leones trepadores de árboles como sujeto ideal para los amantes de la fotografía. Estos depredadores icónicos se recuestan en las acacias, como si esperaran ser fotografiados.',
        },
      ],
      [
        {
          text: 'Los ornitólogos y los aficionados a las aves también encontrarán en el lago Manyara un destino perfecto, con una amplia variedad de especies de aves visibles en el parque. Incluso los ornitólogos expertos quedarán asombrados por una gran bandada de flamencos, rapaces que sobrevuelan el cielo, y el espléndido abejaruco de cola larga de colores vivos.',
        },
      ],
      [{text: 'El almuerzo se servirá en el parque en el sitio de picnic, y por la tarde regresarás hacia Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 7,
    label: 'Parque Nacional del Lago Manyara',
    image: {src: '/images/safari/shared/e7636d2be5e1edef3f8c3756db7fe4d5df583879-1600x1067-1-1.jpg', alt: 'Parque Nacional del Lago Manyara'},
    body: [
      [
        {
          text: 'La mañana después del desayuno, serás recogido en tu lodge y llevado al Parque Nacional del Lago Manyara (aproximadamente 30 minutos). El parque es un terreno de juego ideal para los aficionados a la fotografía y ofrece algunas de las mejores observaciones de fauna del mundo. Podrás avistar muchos animales emblemáticos de África, con los célebres leones trepadores de árboles como sujeto ideal para los amantes de la fotografía. Estos depredadores icónicos se recuestan en las acacias, como si esperaran ser fotografiados.',
        },
      ],
      [
        {
          text: 'Los ornitólogos y los aficionados a las aves también encontrarán en el lago Manyara un destino perfecto, con una amplia variedad de especies de aves visibles en el parque. Incluso los ornitólogos expertos quedarán asombrados por una gran bandada de flamencos, rapaces que sobrevuelan el cielo, y el espléndido abejaruco de cola larga de colores vivos.',
        },
      ],
      [{text: 'El almuerzo se servirá en el parque en el sitio de picnic, y por la tarde regresarás hacia Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
]

const safari15Es: SafariEs = {
  slug: '15-days-tanzania-safari',
  name: '15 Días Safari en Tanzania',
  durationDays: 15,
  seoTitle: '15 Días Safari en Tanzania | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario día por día real, tarifas y prestaciones incluidas para el safari de 15 días en Tanzania.',
  stopsLine: 'Parque Nacional de Tarangire, Parque Nacional del Serengeti, Cráter del Ngorongoro, Parque Nacional del Lago Manyara, Zanzíbar',
  overviewBody: [
    'Este safari de 15 días en Tanzania une un clásico game drive del circuito norte — Tarangire, el Serengeti, el cráter del Ngorongoro y el lago Manyara — con una estancia prolongada en las playas de Zanzíbar, dejándote tiempo para un verdadero safari de fauna y una relajante escapada isleña en un único viaje.',
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Mapa del itinerario del circuito norte'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Migración de ñus en el Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Cultura masái en Tanzania'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: 'Cebras bebiendo en un abrevadero'},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Jirafa en safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Lodge de safari de lujo'},
  ],
  itinerary: [
    ...safariSharedDays1to7Es,
    {
      day: 8,
      label: 'Llegada a Zanzíbar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Llegada a Zanzíbar'},
      body: [
        [
          {
            text: 'Vuela desde Arusha a Zanzíbar y trasládate a tu hotel junto al mar, donde el resto del día está libre para instalarte y relajarte en las orillas del océano Índico.',
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 9,
      label: 'Zanzíbar',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: 'Zanzíbar'},
      body: [
        [
          {
            text: 'Un día libre en Zanzíbar para relajarte en la playa, o organizar una excursión opcional a Stone Town, a una plantación de especias, o de snorkel a través de tu hotel anfitrión.',
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 10,
      label: 'Extensión de playa en Zanzíbar (días 10-14)',
      body: [
        [
          {
            text: 'Pasa cinco días sin prisa relajándote en las playas de Zanzíbar, con tiempo para explorar los callejones sinuosos de Stone Town, hacer una visita opcional a una plantación de especias, o hacer snorkel frente a la costa — a tu propio ritmo, permaneciendo en el mismo hotel junto al mar.',
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
    },
    {
      day: 15,
      label: 'Salida',
      body: [
        [
          {
            text: 'Traslado al aeropuerto para tu vuelo de regreso, que marca el fin de tu safari en Tanzania y tu escapada a Zanzíbar.',
          },
        ],
      ],
    },
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: comboFaqHeadingEs,
  faqIntro: comboFaqIntroEs,
  faqs: sharedSafariFaqsEs,
}

const safari10HoneymoonEs: SafariEs = {
  slug: '10-days-tanzania-luxury-honeymoon-safaris',
  name: '10 Días Safari de Lujo Luna de Miel en Tanzania',
  durationDays: 10,
  seoTitle: '10 Días Safari de Lujo Luna de Miel en Tanzania | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario día por día real, tarifas y prestaciones incluidas para el safari de lujo luna de miel de 10 días en Tanzania.',
  stopsLine: 'Parque Nacional de Tarangire, Parque Nacional del Serengeti, Cráter del Ngorongoro, Parque Nacional del Lago Manyara, Zanzíbar',
  overviewBody: [
    'El safari de lujo Asilia Tanzania de 10 días está pensado para ofrecerte una experiencia única, desde las variadas culturas locales hasta la fauna y los paisajes impresionantes — un clásico game drive del circuito norte a través del Parque Nacional de Tarangire, el Serengeti, el lago Manyara y el cráter del Ngorongoro, seguido de una relajante estancia en las playas de Zanzíbar.',
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Mapa del itinerario del circuito norte'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Migración de ñus en el Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Cultura masái en Tanzania'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: 'Cebras bebiendo en un abrevadero'},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Jirafa en safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Lodge de safari de lujo'},
  ],
  itinerary: [
    ...safariSharedDays1to7Es,
    {
      day: 8,
      label: 'Llegada a Zanzíbar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Llegada a Zanzíbar'},
      body: [
        [
          {
            text: 'Vuela desde Arusha a Zanzíbar y trasládate a tu hotel junto al mar, donde el resto del día está libre para instalarte y relajarte en las orillas del océano Índico.',
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 9,
      label: 'Zanzíbar',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: 'Zanzíbar'},
      body: [
        [
          {
            text: 'Un día libre en Zanzíbar para relajarte en la playa, o organizar una excursión opcional a Stone Town, a una plantación de especias, o de snorkel a través de tu hotel anfitrión.',
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 10,
      label: 'Salida',
      body: [
        [{text: 'Traslado al aeropuerto para tu vuelo de regreso, que marca el fin de tu safari de luna de miel en Tanzania.'}],
      ],
    },
  ],
  includes: includesVariantBEs,
  excludes: excludesVariantBEs,
  faqHeading: comboFaqHeadingEs,
  faqIntro: comboFaqIntroEs,
  faqs: sharedSafariFaqsEs,
}

async function seedSafariEs(data: SafariEs) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await safariDayToDoc(stop))
  await upsertTripEs(data.slug, {
    category: 'safari',
    seo: seo(data.seoTitle, data.seoDescription),
    name: data.name,
    durationDays: data.durationDays,
    hero: {stopsLine: data.stopsLine},
    overview: {
      body: data.overviewBody.map(paragraphBlock),
      ...(data.mapImage ? {mapImage: await uploadImage(client, data.mapImage)} : {}),
      gallery: await Promise.all(data.gallery.map((img) => uploadImage(client, img))),
    },
    itinerary,
    includes: data.includes,
    excludes: data.excludes,
    faqHeading: data.faqHeading,
    ...(data.faqIntro ? {faqIntro: data.faqIntro} : {}),
    faqs: faqs(data.faqs),
  })
}

async function run() {
  await seedTripEs(machame7Es)
  await seedTripEs(machame6Es)
  await seedTripEs(marangu5Es)
  await seedTripEs(marangu6Es)
  await seedTripEs(lemosho7Es)
  await seedTripEs(lemosho8Es)
  await seedTripEs(rongai7Es)
  await seedTripEs(umbwe6Es)
  await seedTripEs(northernCircuit9Es)
  await seedTripEs(combo9Es)
  await seedTripEs(combo10Es)
  await seedTripEs(combo11Es)
  await seedTripEs(combo12Es)
  await seedSafariEs(safari15Es)
  await seedSafariEs(safari10HoneymoonEs)
  console.log('done — all 15 trips seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
