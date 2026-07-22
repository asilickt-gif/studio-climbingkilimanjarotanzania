/**
 * German: seed all 17 unified `trip` documents (9 Kilimanjaro packages, 4
 * combos, 2 safaris) — mirrors seed-fr-trips.ts's structure exactly.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-trips.ts --with-user-token
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

interface FaqDe {
  question: string
  answer: string
}

interface ItineraryDayDe {
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

interface SafariDayDe {
  day: number
  label: string
  image?: Img
  body: {text: string; bold?: boolean}[][]
  overnightStay?: string
  accommodationTiers?: string[]
}

const seo = (title: string, description: string) => ({_type: 'seo', title, description})

const faqs = (items: FaqDe[]) =>
  items.map((f) => ({_type: 'faqItem', _key: key(), question: f.question, answer: f.answer}))

const paragraphBlock = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

async function dayToDoc(stop: ItineraryDayDe) {
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

async function safariDayToDoc(stop: SafariDayDe) {
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

async function upsertTripDe(slug: string, fields: Record<string, unknown>) {
  const enId = await findEnId(client, 'trip', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const deId = await upsertTranslatedDoc(client, 'trip', slug, 'de', fields)
  await linkTranslationMetadata(client, 'trip', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`${slug}-de done (${deId})`)
}

// ---------------------------------------------------------------------------
// Shared fragments (translated once, reused verbatim across trips — mirrors
// the English source's own reuse of `arrival`/`departure`/`includesVariantX`).
// ---------------------------------------------------------------------------

const arrivalDe: ItineraryDayDe = {
  day: 0,
  label: 'Ankunft und Briefing',
  body: [
    'Nach Ihrer Ankunft am Kilimandscharo International Airport werden Sie zu Ihrer Unterkunft gebracht, wo Ihr Guide ein vollständiges Briefing und eine Ausrüstungskontrolle durchführt, um Sie auf das bevorstehende Abenteuer vorzubereiten.',
  ],
  overnightStay: 'Ameg Lodge / Kaliwa Lodge',
  image: {src: '/images/packages/shared/kilimanjaro-airport.jpg', alt: 'Kilimandscharo International Airport'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/packages/shared/ameg-lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/packages/shared/kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'}},
  ],
}

const comboArrivalDe = (): ItineraryDayDe => ({
  day: 0,
  label: 'Ankunft und Briefing',
  body: [
    'Nach Ihrer Ankunft am Kilimandscharo International Airport werden Sie zu Ihrer Unterkunft gebracht, wo Ihr Guide ein vollständiges Briefing und eine Ausrüstungskontrolle durchführt, um Sie auf das bevorstehende Abenteuer vorzubereiten.',
  ],
  image: {src: '/images/combo/shared/kilimanjaro-airport.jpg', alt: 'Ankunft und Briefing'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/combo/shared/Ameg-Lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Kaliwa Lodge'}},
  ],
})

const departureDe: ItineraryDayDe = {
  day: -1,
  label: 'Abreise oder Weiterreise',
  body: ['Transfer zum Kilimandscharo International Airport für Ihren Rückflug — oder setzen Sie Ihr Tansania-Abenteuer fort!'],
}

const includesVariantADe = [
  'Professionelle, erfahrene englischsprachige Bergführer und Hilfsguides',
  'Kompetente und freundliche Träger für Ausrüstung und Gepäck',
  'Koch und alle Mahlzeiten auf dem Berg (Frühstück, Mittag- und Abendessen)',
  'Trinkwasser (gefiltert und aufbereitet) sowie heiße Getränke während des gesamten Treks',
  'Nationalpark-Gebühren und Genehmigungen für den Kilimandscharo',
  'Rettungsgebühren',
  'Camping-Unterkunft in hochwertigen Zelten mit Isomatten',
  'Transfers vom/zum Kilimandscharo International Airport (JRO) und Moshi/Arusha',
  'Gipfelzertifikat nach erfolgreichem Abschluss',
  'Umfassendes Vorbesteigungs-Briefing und Ausrüstungscheck',
]
const excludesVariantADe = [
  'Internationale und nationale Flüge von/nach Tansania',
  'Visagebühren für die Einreise nach Tansania',
  'Trinkgelder für Guides, Träger und Koch',
  'Persönliche Trekking-Ausrüstung (Schlafsack, Trekkingstöcke, Kleidung)',
  'Reiseversicherung (für medizinische Versorgung und Evakuierung obligatorisch)',
  'Snacks, alkoholische Getränke und persönliche Ausgaben',
  'Zusätzliche Hotelnächte vor oder nach der Besteigung (optional)',
]

const includesVariantBDe = [
  'Eintrittsgebühren / Zulassungsgebühr',
  'Naturschutzgebühren',
  'Alle im Reiseverlauf genannten Aktivitäten',
  'Alle im Reiseverlauf angegebenen Unterkünfte',
  'Der gesamte Transport',
  'Alle Steuern / MwSt. 18 %',
  'Flughafenabholung und -transfer',
  'Alle im Reiseverlauf angegebenen Mahlzeiten',
]
const excludesVariantBDe = [
  'Internationale oder lokale Flüge (von/nach Hause)',
  'Trinkgelder (Richtwert US$10,00 pro Person und Tag)',
  'Persönliche Gegenstände (Souvenirs, Reiseversicherung, Visagebühren usw.)',
  'Reiseversicherung und medizinische Rückführung',
  'Gegenstände persönlicher Natur',
]

const comboFaqHeadingDe = 'Ihre Fragen, unsere Antworten'
const comboFaqIntroDe =
  'Haben Sie Fragen zur Buchung einer Tansania-Safari bei uns? Werfen Sie einen Blick auf unsere FAQ unten für schnelle Antworten. Sollten Sie nicht finden, wonach Sie suchen, zögern Sie nicht, uns zu kontaktieren — unsere Experten helfen Ihnen gerne, das perfekte Tansania-Abenteuer zu planen.'
const comboFaqsDe: FaqDe[] = [
  {
    question: 'Was kann ich von einer Safari in Tansania mit Asili Explorer erwarten?',
    answer:
      'Unsere Safaris in Tansania bieten die Gelegenheit, die unglaubliche Tierwelt und atemberaubenden Landschaften des Landes zu erkunden. Wir sind auf private Safaris spezialisiert — das bedeutet, Sie haben einen 4×4-Landcruiser oder Jeep ganz für sich allein. Sie können flexibel entscheiden, wann Ihre Safari beginnt und endet, und unsere erfahrenen Guides helfen Ihnen gerne, diese Entscheidung am Tag Ihres Abenteuers zu treffen. Ob Sie die Tiere bei Sonnenauf- und -untergang, wenn die Temperaturen angenehm sind, am aktivsten erleben möchten, oder den Tag lieber am Pool ausklingen lassen — das liegt ganz bei Ihnen. Tansanias vielfältige Tierwelt ist zu verschiedenen Tageszeiten aktiv, sodass Sie zahlreiche Gelegenheiten haben werden, die Tiere in Aktion zu beobachten.',
  },
  {
    question: 'Bieten Sie Flughafentransfers an?',
    answer:
      'Ja, wir sorgen für einen reibungslosen Start und Abschluss Ihrer Reise mit inkludierten Flughafentransfers in unseren Safari-Paketen — reisen Sie ganz ohne Stress, vom Moment Ihrer Ankunft an!',
  },
  {
    question: 'Welche Unterkunftsmöglichkeiten bieten Sie auf Ihren Safaris an?',
    answer:
      'Von gehobenen Lodges bis zu gemütlichen Budget-Camps bieten wir vielfältige Unterkünfte, die den Geschmack jedes Reisenden treffen und Komfort mit der wilden tansanischen Landschaft verbinden.',
  },
  {
    question: 'Benötige ich ein Visum für die Reise nach Tansania?',
    answer:
      'Die meisten Besucher benötigen ein Visum, um Tansania zu bereisen. Wir empfehlen, die aktuellen Visabestimmungen für Ihre Nationalität vor der Abreise zu überprüfen.',
  },
  {
    question: 'Was sollte ich für eine Tansania-Safari mitbringen?',
    answer:
      'Packen Sie leichte, luftige Kleidung, einen Sonnenhut, Sonnenschutz, robuste Schuhe und eine gute Kamera ein, um die Magie festzuhalten. Unser Team teilt gerne einen vollständigen Packleitfaden mit Ihnen!',
  },
  {
    question: 'Sind Ihre Safaris für Familien geeignet?',
    answer:
      'Ja, wir gestalten familienfreundliche Safari-Pakete voller unterhaltsamer Aktivitäten, die Kindern und Erwachsenen gleichermaßen gefallen — perfekt für einen unvergesslichen Gruppenausflug.',
  },
  {
    question: 'Werde ich auf Ihren Safaris die Big Five sehen?',
    answer:
      'Aber sicher! Unsere Routen führen Sie durch erstklassige Wildtier-Hotspots wie die Serengeti und den Ngorongoro-Krater, was Ihre Chancen erhöht, die legendären Big Five zu sehen.',
  },
  {
    question: 'Wie bezahle ich meine Safari-Buchung?',
    answer:
      'Wir machen es Ihnen leicht mit flexiblen Zahlungsoptionen, einschließlich Banküberweisungen und Kreditkarten. Kontaktieren Sie unser Team für die genauen Zahlungsdetails.',
  },
  {
    question: 'Was passiert, wenn ich meine Safari ändern oder stornieren muss?',
    answer:
      'Das Leben ist unvorhersehbar, und wir verstehen das! Unsere Stornierungs- und Umbuchungsrichtlinien sind reisefreundlich, wobei die genauen Bedingungen vom Zeitpunkt abhängen — kontaktieren Sie uns, um Ihre Buchung zu besprechen.',
  },
]

const safariExpectFaqDe: FaqDe = {
  question: 'Was kann ich von einer Safari in Tansania mit Asili Explorer erwarten?',
  answer:
    'Unsere Safaris in Tansania bieten die Gelegenheit, die unglaubliche Tierwelt und atemberaubenden Landschaften des Landes zu erkunden. Wir sind auf private Safaris spezialisiert — das bedeutet, Sie haben einen 4×4-Landcruiser oder Jeep ganz für sich allein. Sie können flexibel entscheiden, wann Ihre Safari beginnt und endet, und unsere erfahrenen Guides helfen Ihnen gerne, diese Entscheidung am Tag Ihres Abenteuers zu treffen.',
}
const sharedSafariFaqsDe: FaqDe[] = [
  {
    question: 'Bieten Sie Flughafentransfers an?',
    answer:
      'Ja, wir sorgen für einen reibungslosen Start und Abschluss Ihrer Reise mit inkludierten Flughafentransfers in unseren Safari-Paketen — reisen Sie ganz ohne Stress, vom Moment Ihrer Ankunft an!',
  },
  {
    question: 'Welche Unterkunftsmöglichkeiten bieten Sie auf Ihren Safaris an?',
    answer:
      'Von gehobenen Lodges bis zu gemütlichen Budget-Camps bieten wir vielfältige Unterkünfte, die den Geschmack jedes Reisenden treffen und Komfort mit der wilden tansanischen Landschaft verbinden.',
  },
  {
    question: 'Benötige ich ein Visum für die Reise nach Tansania?',
    answer:
      'Die meisten Besucher benötigen ein Visum, um Tansania zu bereisen. Wir empfehlen, die aktuellen Visabestimmungen für Ihre Nationalität vor der Abreise zu überprüfen.',
  },
  {
    question: 'Was sollte ich für eine Tansania-Safari mitbringen?',
    answer:
      'Packen Sie leichte, luftige Kleidung, einen Sonnenhut, Sonnenschutz, robuste Schuhe und eine gute Kamera ein, um die Magie festzuhalten. Unser Team teilt gerne einen vollständigen Packleitfaden mit Ihnen!',
  },
  {
    question: 'Sind Ihre Safaris für Familien geeignet?',
    answer:
      'Ja, wir gestalten familienfreundliche Safari-Pakete voller unterhaltsamer Aktivitäten, die Kindern und Erwachsenen gleichermaßen gefallen — perfekt für einen unvergesslichen Gruppenausflug.',
  },
  {
    question: 'Werde ich auf Ihren Safaris die Big Five sehen?',
    answer:
      'Aber sicher! Unsere Routen führen Sie durch erstklassige Wildtier-Hotspots wie die Serengeti und den Ngorongoro-Krater, was Ihre Chancen erhöht, die legendären Big Five zu sehen.',
  },
  {
    question: 'Wie bezahle ich meine Safari-Buchung?',
    answer:
      'Wir machen es Ihnen leicht mit flexiblen Zahlungsoptionen, einschließlich Banküberweisungen und Kreditkarten. Kontaktieren Sie unser Team für die genauen Zahlungsdetails.',
  },
  {
    question: 'Was passiert, wenn ich meine Safari ändern oder stornieren muss?',
    answer:
      'Das Leben ist unvorhersehbar, und wir verstehen das! Unsere Stornierungs- und Umbuchungsrichtlinien sind reisefreundlich, wobei die genauen Bedingungen vom Zeitpunkt abhängen — kontaktieren Sie uns, um Ihre Buchung zu besprechen.',
  },
]

// ---------------------------------------------------------------------------
// Shared itinerary-day bodies reused across multiple Kilimanjaro packages
// (the English source repeats these verbatim across route variants).
// ---------------------------------------------------------------------------

const bodyMachameGateToCampDe = [
  'Ihre Reise beginnt mit einer 45-minütigen Fahrt von Moshi zum Machame Gate. Nach der Registrierung führt der Trek über einen sich windenden Pfad durch üppigen Regenwald, die feuchteste Zone des Berges. Rechnen Sie mit gelegentlichen Nachmittagsschauern, die den Pfad zeitweise rutschig machen.',
  'Der Aufstieg wird allmählich sanfter, während Sie sich Machame Camp nähern, das am Übergang zwischen Wald- und Riesenheidezone liegt.',
]
const bodyMachameCampToShiraDe = [
  'Der Tag beginnt mit einem steilen Aufstieg über einen Bergrücken zum Picnic Rock, einem fantastischen Aussichtspunkt mit Blick auf Kibo und den zerklüfteten Rand des Shira-Plateaus.',
  'Der Pfad flacht anschließend ab, während Sie das Shira-Plateau überqueren — den dritten vulkanischen Kegel des Kilimandscharo — bevor Sie Shira Camp erreichen, wo Sie mit atemberaubenden Bergpanoramen belohnt werden.',
]
const bodyShiraToBarrancoViaLavaTowerDe = [
  'Ein anspruchsvoller, aber entscheidender Akklimatisierungstag: Sie wandern durch hochgelegenes Wüstengelände zum 90 Meter hohen Lava Tower, einem vulkanischen Gesteinspfropfen mit unglaublichem Panoramablick.',
  'Nach dem Mittagessen geht es hinab ins Barranco-Tal, Heimat der einzigartigen Riesen-Senecien. Dieser Abstieg bereitet Ihren Körper auf den bevorstehenden Gipfelanstieg in großer Höhe vor. Barranco Camp liegt in einem malerischen, geschützten Tal unterhalb der berühmten Barranco Wall.',
]
const bodyBarrancoWallToKarangaDe = [
  'Der Tag beginnt mit der eindrucksvollen Barranco Wall, einem spannenden Anstieg, der mit atemberaubenden Ausblicken belohnt.',
  'Nach Erreichen des Gipfels auf 4.200 m folgen Sie einem malerischen, wellenförmigen Pfad um die Bergflanke, mit dem Mount Meru rechts und dem aufragenden Kibo links von Ihnen.',
  'Ein Abstieg ins Karanga-Tal wird von einem kurzen, aber steilen Aufstieg zu Karanga Camp gefolgt, Ihrem Etappenziel für die Nacht.',
]
const bodyKarangaToBarafuDe = [
  'Ein gleichmäßiger Vormittagsanstieg führt zu Barafu Camp, was auf Suaheli „Eis“ bedeutet. Dieses hochgelegene Camp liegt auf einem Grat unterhalb des Gipfelkegels und markiert den Abschluss des südlichen Rundwegs am Kilimandscharo, mit spektakulären Gipfelblicken aus mehreren Perspektiven.',
  'Sie kommen rechtzeitig für eine Nachmittagsruhe und ein frühes Abendessen an, um sich auf die Gipfelnacht vorzubereiten.',
]
const bodySummitToMwekaDe = [
  'Um Mitternacht beginnt Ihr letzter Aufstieg zum Gipfel. Der Pfad ist steil und anspruchsvoll, bei Temperaturen deutlich unter dem Gefrierpunkt. Mit der Morgendämmerung wird der prächtige rote Sonnenaufgang hinter dem Mawenzi-Gipfel Sie motiviert halten.',
  'An Stella Point (5.750 m) angekommen, wandern Sie entlang des Kraterrands, bevor Sie Uhuru Peak (5.895 m) erreichen — den höchsten Punkt Afrikas!',
  'Nach der Feier am Gipfel beginnt der lange Abstieg zu Mweka Camp, vorbei an vielfältigem Gelände mit einer Mittagspause unterwegs. Heute Abend genießen Sie Ihr letztes Abendessen auf dem Berg.',
]
const bodyMwekaToGateDe = [
  'Der letzte Abstieg führt Sie durch üppigen Regenwald, mit der Chance, verspielte Affen entlang des Weges zu entdecken.',
  'Am Mweka Gate erhalten Sie Ihre Gipfelzertifikate, und von Mweka Village aus werden Sie zurück zu Ihrem Hotel in Moshi gebracht.',
]

async function seedTripDe(data: TripDe) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await dayToDoc(stop))
  await upsertTripDe(data.slug, {
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

interface TripDe {
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
  itinerary: ItineraryDayDe[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqDe[]
  hubSummary: string
  hubImage: Img
}

interface SafariDe {
  slug: string
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  overviewBody: string[]
  gallery: Img[]
  mapImage?: Img
  itinerary: SafariDayDe[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqDe[]
}

async function seedSafariDe(data: SafariDe) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await safariDayToDoc(stop))
  await upsertTripDe(data.slug, {
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

// ---------------------------------------------------------------------------
// 9 Kilimanjaro packages
// ---------------------------------------------------------------------------

const machame7De: TripDe = {
  slug: '7-days-machame-route',
  category: 'package',
  name: '7 Tage Machame-Route',
  durationDays: 7,
  seoTitle: '7 Tage Machame-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 7 Tage Machame-Route.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp und Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Machame-Route, auch als „Whiskey-Route“ bekannt, ist der beliebteste Aufstiegsweg am Kilimandscharo und wird jedes Jahr von fast der Hälfte aller Trekker gewählt. Diese landschaftlich reizvolle Route nähert sich dem Kilimandscharo von Süden, führt über die atemberaubenden südlichen Hänge hinauf und über die Mweka-Route wieder hinab. Unterwegs werden Kletternde mit einigen der spektakulärsten Sonnenauf- und -untergänge des Kilimandscharo belohnt.',
    'Mit einer Länge von 62 km wird die Route meist in sechs Tagen bewältigt, wobei ein siebentägiger Reiseverlauf für eine bessere Akklimatisierung dringend empfohlen wird — dies erhöht die Erfolgsquote beim Erreichen des Gipfels deutlich. Für alle, die ein unvergessliches Abenteuer mit anspruchsvollem, aber lohnendem Gelände suchen, ist die Machame-Route eine ausgezeichnete Wahl.',
  ],
  mapImage: {src: '/images/packages/7-days-machame-route/hero.jpg', alt: 'Karte der Machame-Route in 7 Tagen'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern-Circuit-Route in 9 Tagen'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Machame Gate zu Machame Camp',
      location: 'Machame Gate (1.800 m) → Machame Camp (3.000 m)',
      meta: ['Höhengewinn: 1.200 m', 'Dauer: 6-7 Stunden'],
      body: bodyMachameGateToCampDe,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/7-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/7-days-machame-route/day1-machame-2.jpg',
        alt: 'Regenwald-Pfadbrücke auf dem Weg zu Machame Camp',
      },
    },
    {
      day: 2,
      label: 'Machame Camp zu Shira Camp',
      location: 'Machame Camp (3.000 m) → Shira Camp (3.840 m)',
      meta: ['Höhengewinn: 840 m', 'Dauer: 5-6 Stunden'],
      body: bodyMachameCampToShiraDe,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day2-shira-2.jpg', alt: 'Shira-Plateau'},
    },
    {
      day: 3,
      label: 'Shira Camp zu Barranco Camp via Lava Tower',
      location: 'Shira Camp (3.840 m) → Lava Tower (4.550 m) → Barranco Camp (3.850 m)',
      meta: ['Höhengewinn: 710 m', 'Höhenverlust: 700 m', 'Dauer: 6-7 Stunden'],
      body: bodyShiraToBarrancoViaLavaTowerDe,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day3-lava-tower.jpg', alt: 'Lava Tower mit Zeltlager'},
    },
    {
      day: 4,
      label: 'Barranco Camp zu Karanga Camp über die Barranco Wall',
      location: 'Barranco Camp (3.850 m) → Barranco Wall (4.200 m) → Karanga Camp (3.950 m)',
      meta: ['Höhengewinn: 350 m', 'Höhenverlust: 250 m', 'Dauer: 3-4 Stunden'],
      body: bodyBarrancoWallToKarangaDe,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-machame-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day4-karanga-2.jpg', alt: 'Karanga-Tal'},
    },
    {
      day: 5,
      label: 'Karanga Camp zu Barafu Camp',
      location: 'Karanga Camp (3.950 m) → Barafu Camp (4.600 m)',
      meta: ['Höhengewinn: 650 m', 'Dauer: 3-4 Stunden'],
      body: bodyKarangaToBarafuDe,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-machame-route/day5-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day5-barafu-2.jpg', alt: 'Pfad Richtung Barafu Camp'},
    },
    {
      day: 6,
      label: 'Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp',
      location: 'Barafu Camp (4.600 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
      meta: ['Höhengewinn: 1.295 m', 'Höhenverlust: 2.785 m', 'Gipfelaufstieg: 6-8 Stunden', 'Abstieg: 6 Stunden'],
      body: bodySummitToMwekaDe,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-machame-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day6-mweka-2.jpg', alt: 'Zelte in Mweka Camp'},
    },
    {
      day: 7,
      label: 'Mweka Camp zu Mweka Gate',
      location: 'Mweka Camp (3.110 m) → Mweka Gate (1.830 m)',
      meta: ['Höhenverlust: 1.280 m', 'Dauer: 2-3 Stunden'],
      body: bodyMwekaToGateDe,
      image: {src: '/images/packages/7-days-machame-route/day7-mweka-gate.jpg', alt: 'Feier mit Gipfelzertifikat am Mweka Gate'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: '7 Tage Machame-Route FAQs',
  faqs: [
    {
      question: 'Wie schwierig ist die Machame-Route?',
      answer:
        'Die Machame-Route, oft „Whiskey-Route“ genannt, ist mäßig bis anspruchsvoll. Sie ist bekannt für ihre landschaftliche Schönheit und die schrittweise Akklimatisierung, doch einige steile Abschnitte und lange Tage machen sie körperlich fordernd. Mit dem richtigen Tempo, guter körperlicher Vorbereitung und Entschlossenheit ist sie jedoch für die meisten Kletternden zugänglich.',
    },
    {
      question: 'Wie lang ist die Machame-Route?',
      answer: 'Die gesamte Trekking-Distanz der 7-Tage-Machame-Route beträgt etwa 62 km. Sie bietet ein allmähliches Aufstiegsprofil und beinhaltet einen Akklimatisierungstag, um die Gipfelerfolgsquote zu erhöhen.',
    },
    {
      question: 'Wann ist die beste Zeit, um den Kilimandscharo über die Machame-Route zu besteigen?',
      answer: 'Die besten Jahreszeiten sind die trockenen Monate Januar–März und Juni–Oktober. Diese Monate bieten klarere Himmel, weniger Niederschlag und stabilere Bedingungen. Meiden Sie die lange Regenzeit (März–Mai) für einen sichereren und angenehmeren Trek.',
    },
    {
      question: 'Wie sieht die Unterkunft aus?',
      answer: 'Die Unterkunft entlang der Machame-Route erfolgt in Zeltlagern. Sie schlafen in hochwertigen, von der Crew aufgebauten Bergzelten mit komfortablen Isomatten und einem separaten Speisezelt für die Mahlzeiten. Die Camps sind gut organisiert und von atemberaubender Natur umgeben.',
    },
    {
      question: 'Wie hoch ist der Gipfel des Kilimandscharo?',
      answer: 'Der höchste Punkt ist Uhuru Peak, der 5.895 Meter über dem Meeresspiegel liegt. Dies ist das Ziel des letzten Anstiegs von Barafu Camp aus, der während der Nacht und in den frühen Morgenstunden erreicht wird.',
    },
    {
      question: 'Wie lang ist der Gipfeltag?',
      answer: 'Der Gipfeltag dauert in der Regel 12–14 Stunden, einschließlich des Aufstiegs zum Uhuru Peak und des Abstiegs zu Mweka Camp. Es ist ein anstrengender Tag mit dünner Luft und kalten Temperaturen, doch der atemberaubende Sonnenaufgang und das Erfolgserlebnis machen ihn unvergesslich.',
    },
    {
      question: 'Was ist bei der Machame-Route-Besteigung inbegriffen?',
      answer: 'Eine hochwertige Besteigung umfasst professionelle Guides, Träger, Zelte, Mahlzeiten, Parkgebühren und Transfers. Die meisten Pakete beinhalten zudem Akklimatisierungsunterstützung, ein Gipfelzertifikat und sicheres Trinkwasser. Prüfen Sie unbedingt die detaillierten Leistungen.',
    },
    {
      question: 'Ist Höhenkrankheit häufig?',
      answer: 'Ja, Höhenkrankheit ist ein relevantes Thema. Der allmähliche Aufstieg der Machame-Route und ein zusätzlicher Akklimatisierungstag verringern das Risiko, doch Symptome wie Kopfschmerzen und Übelkeit können weiterhin auftreten. Ausreichend trinken, das eigene Tempo halten und auf den Guide hören sind entscheidend.',
    },
    {
      question: 'Wie bereite ich mich auf die Machame-Route vor?',
      answer: 'Training ist wichtig. Konzentrieren Sie sich auf Ausdauertraining (Wandern, Laufen, Radfahren) und Krafttraining (Beine und Rumpf). Üben Sie das Wandern mit beladenem Rucksack und planen Sie lange Spaziergänge an aufeinanderfolgenden Tagen ein, um Ihre Ausdauer zu steigern. Höhensimulation und Übung im Trinkverhalten werden ebenfalls empfohlen.',
    },
    {
      question: 'Wie hoch ist die Erfolgsquote für die 7-Tage-Machame-Route?',
      answer: 'Die Erfolgsquote ist hoch — 85–90 % bei gut unterstützten Besteigungen mit erfahrenen Guides. Der zusätzliche Tag zur Akklimatisierung verbessert Ihre Chancen erheblich, den Gipfel sicher zu erreichen.',
    },
  ],
  hubSummary: 'Nehmen Sie die beliebte Machame-Route, mit einer Gesamtreisezeit von sieben Tagen, was Ihnen noch mehr Zeit zur Akklimatisierung gibt',
  hubImage: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Machame-Route in 7 Tagen'},
}

const machame6De: TripDe = {
  slug: '6-days-machame-route',
  category: 'package',
  name: '6 Tage Machame-Route',
  durationDays: 6,
  seoTitle: '6 Tage Machame-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 6 Tage Machame-Route.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp und Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die 6-Tage-Machame-Route ist eine der beliebtesten und landschaftlich reizvollsten Aufstiegsrouten am Kilimandscharo, bekannt für ihre vielfältigen Landschaften und hohen Gipfelerfolgsquoten. Als „Whiskey-Route“ bezeichnet, wird sie von Trekkern bevorzugt, die eine anspruchsvolle, aber lohnende Besteigung suchen. Obwohl etwas kürzer als die 7-Tage-Version, bietet sie dank ihres „hoch klettern, tief schlafen“-Profils weiterhin eine ausgezeichnete Akklimatisierung. Diese Route führt Sie durch üppige Regenwälder, Moorlandschaften, alpine Wüsten und schließlich in die arktische Gipfelzone von Uhuru Peak (5.895 m).',
    'Wenn Sie eine unvergessliche, gut getaktete Besteigung mit weniger Tagen auf dem Berg suchen, ist die Machame-Route in 6 Tagen eine ausgezeichnete Wahl.',
  ],
  mapImage: {src: '/images/packages/6-days-machame-route/hero.jpg', alt: 'Karte der Machame-Route in 6 Tagen'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern-Circuit-Route in 9 Tagen'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Machame Gate zu Machame Camp',
      location: 'Machame Gate (1.800 m) → Machame Camp (3.000 m)',
      meta: ['Höhengewinn: 1.200 m', 'Dauer: 6-7 Stunden'],
      body: bodyMachameGateToCampDe,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/6-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/6-days-machame-route/day1-machame-2.jpg',
        alt: 'Regenwald-Pfadbrücke auf dem Weg zu Machame Camp',
      },
    },
    {
      day: 2,
      label: 'Machame Camp zu Shira Camp',
      location: 'Machame Camp (3.000 m) → Shira Camp (3.840 m)',
      meta: ['Höhengewinn: 840 m', 'Dauer: 5-6 Stunden'],
      body: bodyMachameCampToShiraDe,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/6-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day2-shira-2.jpg', alt: 'Shira-Plateau'},
    },
    {
      day: 3,
      label: 'Shira Camp zu Barranco Camp via Lava Tower',
      location: 'Shira Camp (3.840 m) → Lava Tower (4.550 m) → Barranco Camp (3.850 m)',
      meta: ['Höhengewinn: 710 m', 'Höhenverlust: 700 m', 'Dauer: 6-7 Stunden'],
      body: bodyShiraToBarrancoViaLavaTowerDe,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day3-barranco-2.jpg', alt: 'Barranco-Tal'},
    },
    {
      day: 4,
      label: 'Barranco Camp zu Barafu Camp',
      location: 'Barranco Camp (3.960 m) zu Barafu Camp (4.640 m)',
      meta: ['Höhengewinn: 680 m', 'Dauer: 7–9 Stunden'],
      body: [
        'Beginnen Sie mit der spannenden Kletterpartie über die Barranco Wall, einem abenteuerlichen Aufstieg mit lohnenden Ausblicken. Der Pfad windet sich anschließend durch alpines Wüstengelände, vorbei am Karanga-Tal, bis Barafu Camp erreicht wird. Hier legen Sie sich früh zur Ruhe und bereiten sich auf den Gipfelanstieg vor Sonnenaufgang vor.',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-machame-route/day4-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day4-barafu-2.jpg', alt: 'Pfad Richtung Barafu Camp'},
    },
    {
      day: 5,
      label: 'Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp',
      location: 'Barafu Camp (4.640 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.080 m)',
      meta: ['Höhengewinn: 1.255 m', 'Höhenverlust: 2.815 m', 'Dauer: 12–14 Stunden'],
      body: [
        'Der Gipfeltag beginnt unter dem Sternenhimmel mit einem Mitternachtsaufstieg zu Stella Point und weiter zu Uhuru Peak — dem höchsten Punkt Afrikas. Erleben Sie einen unvergesslichen Sonnenaufgang vom Gipfel aus, bevor der lange Abstieg zu Mweka Camp beginnt. An einem einzigen Tag durchqueren Sie ein breites Spektrum an Landschaften und Klimazonen.',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-machame-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day5-mweka-2.jpg', alt: 'Hütten in Mweka Camp'},
    },
    {
      day: 6,
      label: 'Mweka Camp zu Mweka Gate',
      location: 'Mweka Camp (3.080 m) → Mweka Gate (1.640 m)',
      meta: ['Höhenverlust: 1.440 m', 'Dauer: 3–4 Stunden'],
      body: [
        'Ihr letzter Trek führt über grüne Regenwaldpfade zum Mweka Gate, wo Sie Ihren Erfolg feiern, Ihre Gipfelzertifikate erhalten und sich von Ihrer Bergcrew verabschieden.',
      ],
      image: {src: '/images/packages/6-days-machame-route/day6-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureDe,
  ],
  includes: includesVariantADe,
  excludes: [...excludesVariantADe, 'Miete für ein tragbares WC (falls nicht vorab vereinbart)'],
  faqHeading: '6 Tage Machame-Route FAQs',
  faqs: [
    {
      question: 'Wie schwierig ist die Machame-Route?',
      answer:
        'Die Machame-Route, oft „Whiskey-Route“ genannt, ist mäßig bis anspruchsvoll. Sie ist bekannt für ihre landschaftliche Schönheit und die schrittweise Akklimatisierung, doch einige steile Abschnitte und lange Tage machen sie körperlich fordernd. Mit dem richtigen Tempo, guter körperlicher Vorbereitung und Entschlossenheit ist sie jedoch für die meisten Kletternden zugänglich.',
    },
    {
      question: 'Wie lang ist die Machame-Route?',
      answer: 'Die gesamte Trekking-Distanz der 6-Tage-Machame-Route beträgt etwa 62 km. Sie bietet ein allmähliches Aufstiegsprofil und beinhaltet einen Akklimatisierungstag, um die Gipfelerfolgsquote zu erhöhen.',
    },
    {
      question: 'Wann ist die beste Zeit, um den Kilimandscharo über die Machame-Route zu besteigen?',
      answer: 'Die besten Jahreszeiten sind die trockenen Monate Januar–März und Juni–Oktober. Diese Monate bieten klarere Himmel, weniger Niederschlag und stabilere Bedingungen. Meiden Sie die lange Regenzeit (März–Mai) für einen sichereren und angenehmeren Trek.',
    },
    {
      question: 'Wie sieht die Unterkunft aus?',
      answer: 'Die Unterkunft entlang der Machame-Route erfolgt in Zeltlagern. Sie schlafen in hochwertigen, von der Crew aufgebauten Bergzelten mit komfortablen Isomatten und einem separaten Speisezelt für die Mahlzeiten. Die Camps sind gut organisiert und von atemberaubender Natur umgeben.',
    },
    {
      question: 'Wie hoch ist der Gipfel des Kilimandscharo?',
      answer: 'Der höchste Punkt ist Uhuru Peak, der 5.895 Meter über dem Meeresspiegel liegt. Dies ist das Ziel des letzten Anstiegs von Barafu Camp aus, der während der Nacht und in den frühen Morgenstunden erreicht wird.',
    },
    {
      question: 'Wie lang ist der Gipfeltag?',
      answer: 'Der Gipfeltag dauert in der Regel 12–14 Stunden, einschließlich des Aufstiegs zum Uhuru Peak und des Abstiegs zu Mweka Camp. Es ist ein anstrengender Tag mit dünner Luft und kalten Temperaturen, doch der atemberaubende Sonnenaufgang und das Erfolgserlebnis machen ihn unvergesslich.',
    },
    {
      question: 'Was ist bei der Machame-Route-Besteigung inbegriffen?',
      answer: 'Eine hochwertige Besteigung umfasst professionelle Guides, Träger, Zelte, Mahlzeiten, Parkgebühren und Transfers. Die meisten Pakete beinhalten zudem Akklimatisierungsunterstützung, ein Gipfelzertifikat und sicheres Trinkwasser. Prüfen Sie unbedingt die detaillierten Leistungen.',
    },
    {
      question: 'Ist Höhenkrankheit häufig?',
      answer: 'Ja, Höhenkrankheit ist ein relevantes Thema. Der allmähliche Aufstieg der Machame-Route und ein zusätzlicher Akklimatisierungstag verringern das Risiko, doch Symptome wie Kopfschmerzen und Übelkeit können weiterhin auftreten. Ausreichend trinken, das eigene Tempo halten und auf den Guide hören sind entscheidend.',
    },
    {
      question: 'Wie bereite ich mich auf die Machame-Route vor?',
      answer: 'Training ist wichtig. Konzentrieren Sie sich auf Ausdauertraining (Wandern, Laufen, Radfahren) und Krafttraining (Beine und Rumpf). Üben Sie das Wandern mit beladenem Rucksack und planen Sie lange Spaziergänge an aufeinanderfolgenden Tagen ein, um Ihre Ausdauer zu steigern. Höhensimulation und Übung im Trinkverhalten werden ebenfalls empfohlen.',
    },
    {
      question: 'Wie hoch ist die Erfolgsquote für die 6-Tage-Machame-Route?',
      answer: 'Die Erfolgsquote ist hoch — 80–85 % bei gut unterstützten Besteigungen mit erfahrenen Guides. Der zusätzliche Tag zur Akklimatisierung verbessert Ihre Chancen erheblich, den Gipfel sicher zu erreichen.',
    },
  ],
  hubSummary: 'Die Machame-Route, oft „Whiskey-Route“ genannt, ist einer der landschaftlich reizvollsten und abwechslungsreichsten Pfade am Kilimandscharo.',
  hubImage: {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 6 Tagen'},
}

const marangu5De: TripDe = {
  slug: '5-days-marangu-route',
  category: 'package',
  name: '5 Tage Marangu-Route',
  durationDays: 5,
  seoTitle: '5 Tage Marangu-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 5 Tage Marangu-Route.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Hüttenunterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Als „Coca-Cola-Route“ bekannt, ist die Marangu-Route der am besten erschlossene und komfortabelste Weg zum Gipfel des Kilimandscharo. Sie ist die einzige Route mit Hüttenunterkünften und daher eine beliebte Wahl für alle, die ein weniger raues Trekking-Erlebnis suchen. Der Pfad führt über sanfte Hänge durch üppigen Regenwald, Moorland und alpine Wüste, bevor er den eisigen Gipfel von Uhuru Peak erreicht. Ideal für Trekking-Einsteiger oder alle, die einen unkomplizierteren Aufstieg suchen.',
    '5-Tage-Marangu-Route — ein schnellerer Aufstieg, ideal für erfahrene Wanderer oder Zeitknappe. Sie umfasst: Tag 1: Marangu Gate zu Mandara Hut (Regenwald); Tag 2: Mandara Hut zu Horombo Hut (Moorland); Tag 3: Horombo Hut zu Kibo Hut (alpine Wüste); Tag 4: Mitternächtlicher Gipfelanstieg zu Uhuru Peak, dann Abstieg zu Horombo Hut; Tag 5: Rückkehr zum Marangu Gate.',
  ],
  mapImage: {src: '/images/packages/5-days-marangu-route/hero.jpg', alt: 'Berghütten der Marangu-Route'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
    {src: '/images/packages/5-days-marangu-route/horombo-2.jpeg', alt: 'Horombo Hut'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Marangu Gate zu Mandara Hut',
      location: 'Höhe: 1.860 m → 2.700 m',
      meta: ['Höhengewinn: 830 m', 'Dauer: 4–5 Stunden'],
      body: [
        'Ihr Trek beginnt mit einer Fahrt von Moshi zum Marangu Gate. Nach der Registrierung betreten Sie den üppigen Regenwald und starten Ihre Wanderung auf einem gut gepflegten Pfad. Der Weg ist oft feucht und schattig, mit moosbewachsenen Bäumen, zwitschernden Vögeln und verspielten Affen entlang der Strecke.',
        'Am späten Nachmittag erreichen Sie Mandara Hut. Falls Zeit und Kraft es zulassen, lohnt sich ein kurzer Spaziergang zum Maundi-Krater mit herrlichen Ausblicken auf Kenia und Nordtansania.',
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/5-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day1-mandara-2.jpg', alt: 'Hütten von Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut zu Horombo Hut',
      location: 'Höhe: 2.700 m → 3.720 m',
      meta: ['Höhengewinn: 1.020 m', 'Dauer: 6–7 Stunden'],
      body: [
        'Sie verlassen den Regenwald und betreten die Moorlandzone, wo sich die Landschaft dramatisch verändert. Der Pfad steigt stetig durch offenes Gelände voller riesiger Kraut- und Lobelienpflanzen an.',
        'Unterwegs erhaschen Sie Ihren ersten vollen Blick auf die Gipfel Kibo und Mawenzi. Horombo Hut erwartet Sie mit atemberaubenden Ausblicken und der Gelegenheit, andere Trekker kennenzulernen.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day2-horombo-2.jpg', alt: 'Hütten von Horombo Hut'},
    },
    {
      day: 3,
      label: 'Horombo Hut zu Kibo Hut',
      location: 'Höhe: 3.720 m → 4.703 m',
      meta: ['Höhengewinn: 983 m', 'Dauer: 6–7 Stunden'],
      body: [
        'Die heutige Route ist lang und trocken und durchquert die alpine Wüste. Sie wandern durch die Senke zwischen den Gipfeln Mawenzi und Kibo, eine weite, karge Landschaft mit eindrucksvollen Ausblicken. Die Luft wird dünner, gehen Sie also langsam und trinken Sie ausreichend.',
        'Sie erreichen Kibo Hut am frühen Nachmittag — ruhen Sie sich früh aus und bereiten Sie sich auf den um Mitternacht beginnenden Gipfelanstieg vor.',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day3-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day3-kibo-2.jpg', alt: 'Steingebäude von Kibo Hut'},
    },
    {
      day: 4,
      label: 'Kibo Hut zu Uhuru Peak zu Horombo Hut',
      location: 'Höhe: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
      meta: ['Höhengewinn: 1.192 m (Aufstieg), dann Abstieg', 'Dauer: 11–14 Stunden'],
      body: [
        'Ihre Gipfelbesteigung beginnt in den frühen Morgenstunden, mit einer Wanderung im Dunkeln über Serpentinen und Geröll zu Gilman\'s Point (5.685 m), dann entlang des Kraterrands zu Uhuru Peak — dem Dach Afrikas.',
        'Nach dem Festhalten Ihres Gipfelmoments steigen Sie zurück zu Kibo Hut für eine kurze Rast ab, bevor Sie weiter zu Horombo Hut für eine wohlverdiente Nachtruhe ziehen.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day4-horombo-hut-return.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day4-horombo-3.jpg', alt: 'Hütten von Horombo Hut'},
    },
    {
      day: 5,
      label: 'Horombo Hut zu Marangu Gate',
      location: 'Höhe: 3.720 m → 1.860 m',
      meta: ['Höhenverlust: 1.850 m', 'Dauer: 6–7 Stunden'],
      body: [
        'An Ihrem letzten Tag steigen Sie durch Moorland und üppigen Regenwald zurück zum Ausgangspunkt ab. Der Pfad ist bergab leichter, achten Sie jedoch auf Ihre Schritte auf den nassen Abschnitten.',
        'Am Gate erhalten Sie Ihr Gipfelzertifikat, bevor es zurück nach Moshi geht — müde, aber stolz.',
      ],
      image: {src: '/images/packages/5-days-marangu-route/day5-marangu-gate.jpg', alt: 'Kletternde nahe dem Gipfel bei Sonnenaufgang'},
    },
    departureDe,
  ],
  includes: includesVariantADe,
  excludes: excludesVariantADe,
  faqHeading: '5 Tage Marangu-Route FAQs',
  faqIntro: 'Haben Sie Fragen zur Besteigung des Kilimandscharo mit uns? Werfen Sie einen Blick auf unsere FAQ unten für hilfreiche Einblicke.',
  faqs: [
    {
      question: 'Wie viele Tage dauert die Marangu-Route?',
      answer: 'Der Standard-Reiseverlauf dauert 5 oder 6 Tage, wobei die 6-Tage-Version dringend empfohlen wird. Der zusätzliche Tag ermöglicht eine bessere Akklimatisierung und erhöht Ihre Chancen, Uhuru Peak erfolgreich zu erreichen.',
    },
    {
      question: 'Ist die Marangu-Route der einfachste Weg auf den Kilimandscharo?',
      answer: 'Sie wird oft als „einfachste“ Route beworben aufgrund ihrer sanften Hänge und Hüttenunterkünfte — doch lassen Sie sich nicht täuschen. Die kürzere Akklimatisierungszeit macht sie bei Höhenkrankheit weniger nachsichtig, daher ist gute Vorbereitung entscheidend.',
    },
    {
      question: 'Warum wird Marangu die „Coca-Cola-Route“ genannt?',
      answer: 'Weil es die einzige Route am Kilimandscharo ist, auf der Sie in festen Hütten statt in Zelten schlafen — und an einigen Rastpunkten früher Coca-Cola verkauft wurde. Der Spitzname spiegelt den relativen Komfort im Vergleich zu Camping-Routen wider.',
    },
    {
      question: 'Wie lang ist die Marangu-Route und wie groß ist der Höhengewinn?',
      answer: 'Die Route umfasst etwa 72 km Hin- und Rückweg. Der Höhengewinn beträgt etwa 4.005 Meter vom Marangu Gate (1.860 m) bis zum Gipfel (5.895 m), danach steigen Sie auf demselben Pfad ab.',
    },
    {
      question: 'Welche Art von Unterkunft ist auf der Marangu-Route verfügbar?',
      answer: 'Sie schlafen in gemeinsamen A-Rahmen-Hütten mit Etagenbetten. Jede Hütte verfügt über Schlafsäle, Solarbeleuchtung und einfache Gemeinschaftswaschräume. Eine gute Option, wenn Sie nicht im Freien campen möchten.',
    },
    {
      question: 'Wie überlaufen ist die Marangu-Route?',
      answer: 'Sie ist eine der beliebtesten Routen, besonders bei budgetbewussten Trekkern. Da für Auf- und Abstieg derselbe Pfad genutzt wird, treffen Sie häufig auf andere Gruppen in beide Richtungen.',
    },
    {
      question: 'Wie hoch ist die Erfolgsquote bei Besteigungen der Marangu-Route?',
      answer: 'Die Erfolgsquoten für den 5-Tage-Reiseverlauf sind aufgrund unzureichender Akklimatisierung relativ niedrig. Die 6-Tage-Version verzeichnet jedoch deutlich bessere Erfolge, besonders wenn Sie es langsam angehen und ausreichend trinken.',
    },
    {
      question: 'Für wen eignet sich die Marangu-Route am besten?',
      answer: 'Die Marangu-Route ist ideal für Erstbesteiger, die den Komfort von Hütten bevorzugen, während der Regenzeit reisen oder eine kürzere Route mit weniger Logistik wünschen. Sie ist weniger geeignet für alle, die Einsamkeit oder abgelegene Wildniserlebnisse suchen.',
    },
  ],
  hubSummary: 'Eine fünftägige Reise zum höchsten Gipfel Afrikas über die beliebte Marangu-Route. Erwarten Sie vielfältige Landschaften…',
  hubImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Marangu-Route in 5 Tagen'},
}

const marangu6De: TripDe = {
  slug: '6-days-marangu-route',
  category: 'package',
  name: '6 Tage Marangu-Route',
  durationDays: 6,
  seoTitle: '6 Tage Marangu-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 6 Tage Marangu-Route.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Hüttenunterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Marangu-Route, oft „Coca-Cola-Route“ genannt, ist der einzige Kilimandscharo-Pfad mit Hüttenunterkünften statt Camping. Mit ihrem gut ausgetretenen Pfad und zusätzlichem Komfort ist sie eine beliebte Wahl für Trekker, die eine landschaftlich reizvolle, aber unkomplizierte Besteigung des höchsten Gipfels Afrikas suchen.',
    'Diese 6-Tage-Version bietet mehr Zeit zur Akklimatisierung als der 5-Tage-Trek, was Ihre Gipfelerfolgsquote erhöht. Sie durchqueren markante Vegetationszonen, vom Regenwald bis zur alpinen Wüste, mit einem abschließenden Mitternachtsanstieg zu Uhuru Peak über Gilman\'s Point.',
  ],
  mapImage: {src: '/images/packages/6-days-marangu-route/hero.jpg', alt: 'Berghütten der Marangu-Route'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/routes/marangu/hero.jpg', alt: 'Hütte der Marangu-Route'},
    {src: '/images/packages/shared/card-6-days-marangu-alt.webp', alt: 'Marangu-Route in 6 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      location: 'Höhe: 1.860 m → 2.700 m',
      meta: ['Höhengewinn: 840 m', 'Dauer: 4–5 Stunden'],
      body: ['Beginnen Sie Ihre Reise durch üppigen Regenwald voller Guerezas und lebendiger Flora. Nach einem stetigen Anstieg erreichen Sie Mandara Hut für Ihre erste Nacht auf dem Berg.'],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/6-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day1-mandara-2.jpg', alt: 'Hütten von Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      location: 'Höhe: 2.700 m → 3.720 m',
      meta: ['Höhengewinn: 1.020 m', 'Dauer: 6–7 Stunden'],
      body: ['Beim Verlassen des Waldes wechselt der Pfad in Heide- und Moorland. Genießen Sie unterwegs Ausblicke auf die Gipfel Kibo und Mawenzi.'],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day2-horombo-2.jpg', alt: 'Hütten von Horombo Hut'},
    },
    {
      day: 3,
      label: 'Akklimatisierung bei Horombo Hut',
      location: 'Höhe: 3.720 m → 4.000 m (Zebra Rocks) → 3.720 m',
      meta: ['Höhengewinn: 280 m', 'Höhenverlust: 280 m', 'Dauer: 2–3 Stunden (optionale Wanderung)'],
      body: ['Ein wichtiger Akklimatisierungstag, der Ihrem Körper hilft, sich anzupassen. Sie können eine kurze Wanderung zu den Zebra Rocks unternehmen und für Mittagessen und Ruhe nach Horombo zurückkehren.'],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day3-horombo-acclimatization.jpg', alt: 'Wegweiser von Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      location: 'Höhe: 3.720 m → 4.703 m',
      meta: ['Höhengewinn: 983 m', 'Dauer: 6–7 Stunden'],
      body: ['Der heutige Trek führt Sie durch alpines Wüstengelände in Richtung des Basislagers Kibo Hut. Ruhen Sie sich früh aus, um sich auf die Gipfelnacht vorzubereiten.'],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day4-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day4-kibo-2.jpg', alt: 'Steingebäude von Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      location: 'Höhe: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
      meta: ['Höhengewinn: 1.192 m', 'Höhenverlust: 2.175 m', 'Dauer: 12–14 Stunden'],
      body: ['Beginnen Sie Ihren Gipfelanstieg kurz nach Mitternacht, erreichen Sie Gilman\'s Point und dann bei Sonnenaufgang Uhuru Peak. Nach der Feier am Gipfel steigen Sie zu Horombo Hut für Ihre letzte Übernachtung ab.'],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day5-horombo-3.jpg', alt: 'Horombo Hut bei Sonnenuntergang'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Transfer',
      location: 'Höhe: 3.720 m → 1.860 m',
      meta: ['Höhenverlust: 1.860 m', 'Dauer: 5–6 Stunden'],
      body: ['Steigen Sie durch Moorland und Regenwald zurück zum Gate ab. Nach Erhalt Ihres Gipfelzertifikats werden Sie zu Ihrem Hotel transferiert.'],
      overnightStay: 'Hotel in Moshi/Arusha (inbegriffen)',
      image: {src: '/images/packages/6-days-marangu-route/day6-marangu-gate.jpg', alt: 'Marangu Gate'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day6-kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'},
    },
    departureDe,
  ],
  includes: [
    'Nationalpark-Eintrittsgebühren',
    'Alle Mahlzeiten und Wasser während des Treks',
    'Hüttenunterkunft (Mandara, Horombo, Kibo)',
    'Privater Transport von/zum Marangu Gate',
    'Hotelaufenthalte vor und nach der Besteigung (je 1 Nacht)',
    'Zertifizierte Bergführer, Koch und Träger',
    'Sauerstoffflasche und Erste-Hilfe-Set',
    'Staatliche Steuern und MwSt.',
    'Gipfelzertifikat',
    'Rettungsgebühren',
  ],
  excludes: [
    'Internationale und nationale Flüge',
    'Tansanisches Visum',
    'Trinkgelder für Guides und Träger',
    'Persönliche Trekking-Ausrüstung (mietbar)',
    'Reiseversicherung',
    'Snacks und zusätzliche Getränke',
    'Zusätzliche Hotelnächte vor/nach der Besteigung',
  ],
  faqHeading: 'Haben Sie Fragen zur Besteigung des Kilimandscharo mit uns?',
  faqIntro: 'Werfen Sie einen Blick auf unsere FAQ unten für hilfreiche Einblicke. Sollten Sie die gesuchte Antwort nicht finden, zögern Sie nicht, uns zu kontaktieren — unsere Kilimandscharo-Experten helfen Ihnen gerne bei jedem Schritt Ihres unvergesslichen Abenteuers.',
  faqs: [
    {
      question: 'Wie viele Tage dauert die Marangu-Route?',
      answer: 'Der Standard-Reiseverlauf dauert 5 oder 6 Tage, wobei die 6-Tage-Version dringend empfohlen wird. Der zusätzliche Tag ermöglicht eine bessere Akklimatisierung und erhöht Ihre Chancen, Uhuru Peak erfolgreich zu erreichen.',
    },
    {
      question: 'Ist die Marangu-Route der einfachste Weg auf den Kilimandscharo?',
      answer: 'Sie wird oft als „einfachste“ Route beworben aufgrund ihrer sanften Hänge und Hüttenunterkünfte — doch lassen Sie sich nicht täuschen. Die kürzere Akklimatisierungszeit macht sie bei Höhenkrankheit weniger nachsichtig, daher ist gute Vorbereitung entscheidend.',
    },
    {
      question: 'Warum wird Marangu die „Coca-Cola-Route“ genannt?',
      answer: 'Weil es die einzige Route am Kilimandscharo ist, auf der Sie in festen Hütten statt in Zelten schlafen — und an einigen Rastpunkten früher Coca-Cola verkauft wurde. Der Spitzname spiegelt den relativen Komfort im Vergleich zu Camping-Routen wider.',
    },
    {
      question: 'Wie lang ist die Marangu-Route und wie groß ist der Höhengewinn?',
      answer: 'Die Route umfasst etwa 72 km Hin- und Rückweg. Der Höhengewinn beträgt etwa 4.005 Meter vom Marangu Gate (1.860 m) bis zum Gipfel (5.895 m), danach steigen Sie auf demselben Pfad ab.',
    },
    {
      question: 'Welche Art von Unterkunft ist auf der Marangu-Route verfügbar?',
      answer: 'Sie schlafen in gemeinsamen A-Rahmen-Hütten mit Etagenbetten. Jede Hütte verfügt über Schlafsäle, Solarbeleuchtung und einfache Gemeinschaftswaschräume. Eine gute Option, wenn Sie nicht im Freien campen möchten.',
    },
    {
      question: 'Wie überlaufen ist die Marangu-Route?',
      answer: 'Sie ist eine der beliebtesten Routen, besonders bei budgetbewussten Trekkern. Da für Auf- und Abstieg derselbe Pfad genutzt wird, treffen Sie häufig auf andere Gruppen in beide Richtungen.',
    },
    {
      question: 'Wie hoch ist die Erfolgsquote bei Besteigungen der Marangu-Route?',
      answer: 'Die Erfolgsquoten für den 5-Tage-Reiseverlauf sind aufgrund unzureichender Akklimatisierung relativ niedrig. Die 6-Tage-Version verzeichnet jedoch deutlich bessere Erfolge, besonders wenn Sie es langsam angehen und ausreichend trinken.',
    },
    {
      question: 'Wann ist die beste Zeit, um die Marangu-Route zu besteigen?',
      answer: 'Die besten Monate sind Januar bis Anfang März und Juni bis Oktober, wenn die Wetterbedingungen stabiler und die Pfade trocken sind. Dank des Hüttensystems ist Marangu jedoch auch in der Regenzeit eine machbare Option.',
    },
    {
      question: 'Was sollte ich für einen Marangu-Route-Trek mitbringen?',
      answer: 'Schichtkleidung für alle Temperaturbereiche, ein Vier-Jahreszeiten-Schlafsack, warme Mütze und Handschuhe, Trekkingstöcke, persönliche Hygieneartikel und eine Stirnlampe sind unerlässlich. Zudem benötigen Sie einen kleinen Tagesrucksack, während Träger Ihr Hauptgepäck tragen.',
    },
    {
      question: 'Für wen eignet sich die Marangu-Route am besten?',
      answer: 'Die Marangu-Route ist ideal für Erstbesteiger, die den Komfort von Hütten bevorzugen, während der Regenzeit reisen oder eine kürzere Route mit weniger Logistik wünschen. Sie ist weniger geeignet für alle, die Einsamkeit oder abgelegene Wildniserlebnisse suchen.',
    },
  ],
  hubSummary: 'Eine sechstägige Reise zum höchsten Gipfel Afrikas über die beliebte Marangu-Route. Erwarten Sie vielfältige Landschaften…',
  hubImage: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Marangu-Route in 6 Tagen'},
}

const lemosho7De: TripDe = {
  slug: '7-days-lemosho-route',
  category: 'package',
  name: '7 Tage Lemosho-Route',
  durationDays: 7,
  seoTitle: '7 Tage Lemosho-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 7 Tage Lemosho-Route.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira 2 Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp und Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Lemosho-Route ist für ihre landschaftliche Schönheit und ihr hervorragendes Akklimatisierungsprofil bekannt und damit eine Top-Wahl für Trekker, die eine allmählichere, lohnendere Besteigung suchen. Ausgehend vom Westhang des Kilimandscharo führt diese Route durch üppige Regenwälder, offene Moorlandschaften und hochgelegene alpine Wüsten mit atemberaubenden Ausblicken auf den Berg und die umliegenden Landschaften.',
    'Mit einer höheren Erfolgsquote als viele andere Routen eignet sich die 7-Tage-Lemosho-Route ideal für alle, die sowohl eine Herausforderung als auch die Gelegenheit suchen, die vielfältigen Umgebungen des Kilimandscharo zu genießen.',
  ],
  mapImage: {src: '/images/packages/7-days-lemosho-route/hero.png', alt: 'Karte der Lemosho-Route am Kilimandscharo'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern-Circuit-Route in 9 Tagen'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Lemosho Gate zu Mti Mkubwa Camp',
      location: 'Lemosho Gate (2.100 m) → Mti Mkubwa (2.650 m)',
      meta: ['Höhengewinn: 550 m', 'Dauer: 3–4 Stunden'],
      body: ['Betreten Sie den bezaubernden Bergwald, umgeben von hoch aufragenden Bäumen und den Klängen der Tierwelt. Ein relativ sanfter Trek bringt Sie zu Mti Mkubwa Camp, wo Sie Ihre erste Nacht auf dem Berg verbringen.'],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa zu Shira 2 Camp',
      location: 'Mti Mkubwa Camp (2.650 m) → Shira 2 Camp (3.850 m)',
      meta: ['Höhengewinn: 1.200 m', 'Dauer: 7–8 Stunden'],
      body: ['Der heutige, lange Trek führt Sie vom Wald zum weiten Shira-Plateau. Steigen Sie durch Moorland mit atemberaubenden Ausblicken auf, bevor Sie Shira 2 Camp erreichen, wo sich die Erhabenheit der Kilimandscharo-Gipfel in voller Pracht zeigt.'],
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day2-shira-2.jpg', alt: 'Campingplatz Shira Camp'},
    },
    {
      day: 3,
      label: 'Shira 2 Camp zu Barranco Camp via Lava Tower',
      location: 'Shira 2 Camp (3.840 m) → Lava Tower (4.550 m) → Barranco Camp (3.850 m)',
      meta: ['Höhengewinn: 710 m', 'Höhenverlust: 700 m', 'Dauer: 6-7 Stunden'],
      body: bodyShiraToBarrancoViaLavaTowerDe,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day3-lava-tower.jpg', alt: 'Lava Tower mit Zeltlager'},
    },
    {
      day: 4,
      label: 'Barranco Camp zu Karanga Camp über die Barranco Wall',
      location: 'Barranco Camp (3.850 m) → Barranco Wall (4.200 m) → Karanga Camp (3.950 m)',
      meta: ['Höhengewinn: 350 m', 'Höhenverlust: 250 m', 'Dauer: 3-4 Stunden'],
      body: bodyBarrancoWallToKarangaDe,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day4-karanga-2.jpg', alt: 'Karanga-Tal'},
    },
    {
      day: 5,
      label: 'Karanga Camp zu Barafu Camp',
      location: 'Karanga Camp (3.950 m) → Barafu Camp (4.600 m)',
      meta: ['Höhengewinn: 650 m', 'Dauer: 3-4 Stunden'],
      body: bodyKarangaToBarafuDe,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day5-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day5-barafu-2.jpg', alt: 'Pfad Richtung Barafu Camp'},
    },
    {
      day: 6,
      label: 'Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp',
      location: 'Barafu Camp (4.600 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
      meta: ['Höhengewinn: 1.295 m', 'Höhenverlust: 2.785 m', 'Gipfelaufstieg: 6-8 Stunden', 'Abstieg: 6 Stunden'],
      body: bodySummitToMwekaDe,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day6-mweka-2.jpg', alt: 'Zelte in Mweka Camp'},
    },
    {
      day: 7,
      label: 'Mweka Camp zu Mweka Gate',
      location: 'Mweka Camp (3.110 m) → Mweka Gate (1.830 m)',
      meta: ['Höhenverlust: 1.280 m', 'Dauer: 2-3 Stunden'],
      body: bodyMwekaToGateDe,
      image: {src: '/images/packages/7-days-lemosho-route/day7-mweka-gate.jpg', alt: 'Feier mit Gipfelzertifikat am Mweka Gate'},
    },
    departureDe,
  ],
  includes: [...includesVariantADe, 'Transfers zum Lemosho Gate und vom Mweka Gate'],
  excludes: excludesVariantADe,
  faqHeading: '7 Tage Lemosho-Route FAQs',
  faqs: [
    {
      question: 'Ist die 7-Tage-Lemosho-Route für Anfänger geeignet?',
      answer: 'Ja. Der Kilimandscharo ist zwar eine ernsthafte Herausforderung, doch die Lemosho-Route bietet einen allmählichen Aufstieg mit mehr Zeit zur Akklimatisierung. Das macht sie zu einer der besten Routen sowohl für Anfänger als auch erfahrene Trekker.',
    },
    {
      question: 'Wie hoch ist die Gipfelerfolgsquote über die 7-Tage-Lemosho-Route?',
      answer: 'Die Erfolgsquote ist sehr hoch — etwa 85 % oder mehr. Die längere Dauer und der gleichmäßige Höhengewinn verbessern die Akklimatisierung deutlich und erhöhen die Chancen, Uhuru Peak zu erreichen.',
    },
    {
      question: 'Wie viele Stunden werde ich täglich wandern?',
      answer: 'Die meisten Trekking-Tage umfassen 4 bis 7 Stunden Wanderung. Der Gipfeltag ist jedoch deutlich länger und dauert 12 bis 14 Stunden hin und zurück (Auf- und Abstieg).',
    },
    {
      question: 'Wie lang ist die Gesamtstrecke der 7-Tage-Lemosho-Route?',
      answer: 'Die Route umfasst etwa 70 Kilometer vom Startpunkt am Lemosho Gate bis zum Gipfel und hinab zum Mweka Gate.',
    },
    {
      question: 'Benötige ich vorherige Höhenerfahrung?',
      answer: 'Nicht zwingend. Technisches Klettern ist nicht erforderlich, doch ein gutes Fitnessniveau ist wichtig. Vorherige Erfahrung mit Höhe ist nicht nötig, doch Höhenkrankheit kann jeden treffen, weshalb Akklimatisierung entscheidend ist.',
    },
    {
      question: 'Welche Art von Unterkunft wird auf der Lemosho-Route genutzt?',
      answer: 'Die Unterkunft erfolgt in hochwertigen Zelten, die von Ihrer Trekking-Crew bereitgestellt und aufgebaut werden. Jede Nacht schlafen Sie in festgelegten Bergcamps wie Mti Mkubwa, Shira, Barranco, Karanga, Barafu und Mweka.',
    },
    {
      question: 'Was muss ich für diese Route einpacken?',
      answer: 'Zu den Essentials gehören robuste Wanderschuhe, ein warmer Schlafsack (bis -10 °C), Thermoschichten, wetterfeste Ausrüstung, Handschuhe, eine Stirnlampe und ein Tagesrucksack. Die meisten Anbieter stellen eine vollständige Ausrüstungscheckliste bereit.',
    },
    {
      question: 'Gibt es eine Toilette auf dem Berg?',
      answer: 'An jedem Camp stehen öffentliche Grubenlatrinen zur Verfügung. Private mobile Toiletten sind jedoch oft inbegriffen oder als Zusatzoption für mehr Komfort und Hygiene erhältlich.',
    },
    {
      question: 'Wann ist die beste Zeit, um die Lemosho-Route zu besteigen?',
      answer: 'Die besten Jahreszeiten sind Januar bis Anfang März und Juni bis Oktober. Diese Monate bieten klarere Himmel, weniger Niederschlag und insgesamt bessere Trekking-Bedingungen.',
    },
    {
      question: 'Kann ich diesen Reiseverlauf anpassen oder zusätzliche Tage hinzufügen?',
      answer: 'Absolut! Der Reiseverlauf kann für eine bessere Akklimatisierung auf eine 8-Tage-Version verlängert oder an Ihr Tempo angepasst werden. Unser Team arbeitet mit Ihnen zusammen, um den Trek nach Ihren Wünschen und Bedürfnissen zu gestalten.',
    },
  ],
  hubSummary: 'Mit acht Tagen Reisezeit dauert Ihr Kilimandscharo-Trek auf der Lemosho-Route länger als die Alternativen.',
  hubImage: {src: '/images/packages/shared/8-days-lemosho-route.webp', alt: 'Lemosho-Route in 7 Tagen'},
}

const lemosho8De: TripDe = {
  slug: '8-days-lemosho-route',
  category: 'package',
  name: '8 Tage Lemosho-Route',
  durationDays: 8,
  seoTitle: '8 Tage Lemosho-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 8 Tage Lemosho-Route.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira Camp 1, Shira Camp 2, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Lemosho-Route ist eine der schönsten und ausgewogensten Routen zur Besteigung des Kilimandscharo. Sie bietet reiche Artenvielfalt, weniger Andrang in den ersten Tagen und dank ihres allmählichen Aufstiegsprofils eine hervorragende Akklimatisierung. Wenn Sie eine Route suchen, die landschaftliche Schönheit, vielfältige Landschaften und eine hohe Gipfelerfolgsquote vereint, ist die 8-Tage-Lemosho-Route eine fantastische Wahl.',
    'Ausgehend von der Westseite des Kilimandscharo durchquert diese Route üppigen Regenwald, weite Moorlandschaften und hochalpine Wüsten, bevor sie sich mit der Machame-Route vereint und über Barafu Camp zum Gipfel führt.',
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Karte der Lemosho-Route in 8 Tagen'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern-Circuit-Route in 9 Tagen'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Von Lemosho Gate zu Mti Mkubwa',
      location: 'Höhe: 2.100 m → 2.650 m',
      meta: ['Höhengewinn: 550 m', 'Dauer: 3-4 Stunden'],
      body: [
        'Nach dem Frühstück fahren Sie von Arusha zum Londorossi Gate zur Registrierung. Dann geht es weiter zum Lemosho Gate, wo die Wanderung durch üppigen Regenwald beginnt. Dieses Gebiet ist reich an Tierwelt wie schwarz-weißen Guerezas und Waldvögeln. Sie wandern unter einem Blätterdach hindurch, bevor Sie Mti Mkubwa (Big Tree) Camp für die Nacht erreichen.',
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Von Mti Mkubwa Camp zu Shira 1 Camp',
      location: 'Mti Mkubwa Camp (2.650 m) – Shira 1 Camp (3.610 m)',
      meta: ['Höhengewinn: 960 m', 'Dauer: 6-7 Stunden'],
      body: [
        'Der heutige Pfad steigt allmählich aus dem Regenwald in die Zone von Heidekraut und Moorland an. Mit zunehmender Höhe lichten sich die Bäume, und die Landschaft öffnet sich mit herrlichen Ausblicken auf den Shira-Grat und den Kibo-Gipfel. Nach einer malerischen Wanderung über sanfte Hügel und vulkanische Gesteinsformationen erreichen Sie Shira 1 Camp auf dem Shira-Plateau.',
      ],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Shira-Plateau'},
    },
    {
      day: 3,
      label: 'Von Shira 1 Camp zu Shira 2 Camp',
      location: 'Shira 1 Camp (3.610 m) – Shira 2 Camp (3.850 m)',
      meta: ['Höhengewinn: 240 m', 'Dauer: 3-4 Stunden'],
      body: [
        'Ein kurzer Trek über das weite, offene Plateau des Shira-Grats gibt Ihnen Zeit zum Ausruhen und Akklimatisieren. Bei entsprechendem Wetter genießen Sie Panoramablicke auf Kibo und den Mount Meru in der Ferne.',
      ],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Ausblick von Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Von Shira 2 Camp zu Lava Tower und weiter zu Barranco Camp',
      location: 'Shira 2 Camp (3.850 m) → Lava Tower (4.630 m) → Barranco Camp',
      meta: ['Höhengewinn: 780 m', 'Höhenverlust: 654 m', 'Dauer: 6-7 Stunden'],
      body: [
        'Steigen Sie stetig zum eindrucksvollen Lava Tower auf, wo Sie eine Mittagspause einlegen. Steigen Sie anschließend hinab ins wunderschöne Barranco-Tal für die Nacht. Dies ist einer der wichtigsten Akklimatisierungstage des Reiseverlaufs.',
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: 'Von Barranco Camp zu Karanga Camp',
      location: 'Barranco Camp (3.976 m) → Karanga Camp (4.035 m)',
      meta: ['Höhengewinn: 59 m', 'Dauer: 4-5 Stunden'],
      body: [
        'Erklimmen Sie die berühmte Barranco Wall — anspruchsvoll, aber nicht technisch. Setzen Sie den Weg über alpines Gelände zu Karanga Camp fort. Dieser kürzere Tag gibt Ihrem Körper mehr Zeit zur Akklimatisierung vor der Gipfelnacht.',
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Ausblick von Karanga Camp'},
    },
    {
      day: 6,
      label: 'Von Karanga Camp zu Barafu Camp',
      location: 'Karanga Camp (4.035 m) → Barafu Camp (4.703 m)',
      meta: ['Höhengewinn: 668 m', 'Dauer: 3-4 Stunden'],
      body: [
        'Ein kurzer, aber steiler Trek durch hochgelegene alpine Wüste zu Ihrem letzten Camp vor der Gipfelnacht. Ruhen Sie sich aus, trinken Sie ausreichend und bereiten Sie sich mental auf die bevorstehende Herausforderung vor.',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: 'Pfad Richtung Barafu Camp'},
    },
    {
      day: 7,
      label: 'Von Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp',
      location: 'Barafu Camp (4.703 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.720 m)',
      meta: ['Höhengewinn: 1.192 m', 'Höhenverlust: 2.175 m', 'Dauer: 12-14 Stunden'],
      body: [
        'Beginnen Sie Ihren Gipfelanstieg gegen Mitternacht, im Dunkeln in Richtung Stella Point und weiter zu Uhuru Peak — dem höchsten Punkt Afrikas. Nach Sonnenaufgang und Gipfelfotos steigen Sie zu Barafu für eine Pause ab, dann weiter zu Mweka Camp für die Nacht.',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Von Mweka Camp zu Mweka Gate, Transfer nach Arusha',
      location: 'Mweka Camp (3.720 m) → Mweka Gate (1.640 m)',
      meta: ['Höhenverlust: 2.080 m', 'Dauer: 3-4 Stunden'],
      body: [
        'Durchqueren Sie üppigen Regenwald bis zum Parkausgang, wo Sie Ihr Kilimandscharo-Zertifikat erhalten. Ihr Fahrer bringt Sie zu Ihrem Hotel für eine heiße Dusche und wohlverdiente Erholung.',
      ],
      overnightStay: 'Arusha',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: '8 Tage Lemosho-Route FAQs',
  faqIntro:
    'Haben Sie Fragen zur Besteigung des Kilimandscharo mit uns? Werfen Sie einen Blick auf unsere FAQ zur Lemosho-Route unten für klare, hilfreiche Antworten. Sollten Sie nicht finden, wonach Sie suchen, zögern Sie nicht, uns zu kontaktieren — unsere Bergexperten bei Asili Climbing Kilimanjaro helfen Ihnen gerne, ein sicheres, erfolgreiches und unvergessliches Gipfelabenteuer zu planen.',
  faqs: [
    {
      question: 'Warum die Lemosho-Route für die Besteigung des Kilimandscharo wählen?',
      answer: 'Die Lemosho-Route gilt weithin als die landschaftlich reizvollste Route am Kilimandscharo. Sie bietet atemberaubende Ausblicke, wenig Andrang in den frühen Etappen und eine hervorragende Akklimatisierung. Mit ihrem allmählichen Aufstieg und vielfältigen Landschaften eignet sie sich ideal für Trekker, die eine erfolgreiche Besteigung anstreben.',
    },
    {
      question: 'Wie schwierig ist die 8-Tage-Lemosho-Route?',
      answer: 'Der Reiseverlauf ist mäßig anspruchsvoll, aber mit guter Vorbereitung durchaus machbar. Der 8-Tage-Reiseverlauf ermöglicht eine bessere Akklimatisierung und erhöht Ihre Chancen, Uhuru Peak ohne schwere Höhenkrankheit-Symptome zu erreichen.',
    },
    {
      question: 'Was ist bei der 8-Tage-Besteigung über die Lemosho-Route mit Asili Climbing Kilimanjaro inbegriffen?',
      answer: 'Ihre Besteigung umfasst professionelle Bergführer, Träger, vollständige Camping-Ausrüstung, Mahlzeiten, Parkgebühren, Rettungsgebühren und Flughafentransfers. Hotelaufenthalte vor und nach dem Trek können ebenfalls arrangiert werden.',
    },
    {
      question: 'Welche Art von Unterkunft wird während des Treks genutzt?',
      answer: 'Sie schlafen in hochwertigen Vier-Jahreszeiten-Bergzelten, jeweils zu zweit geteilt. Komfortable Isomatten werden bereitgestellt. Alle Camps werden täglich von unseren Trägern auf- und abgebaut.',
    },
    {
      question: 'Wann ist die beste Zeit im Jahr, um die Lemosho-Route zu wandern?',
      answer: 'Wir empfehlen die Besteigung während der Trockenzeiten: Januar bis Mitte März und Juni bis Oktober. Diese Monate bieten das beste Wetter und die beste Sicht für Panoramablicke und Fotografie.',
    },
    {
      question: 'Wie viele Personen umfasst meine Gruppe?',
      answer: 'Wir halten unsere Gruppen klein — in der Regel zwischen 2 und 10 Trekkern —, um ein persönlicheres Erlebnis zu bieten und Sicherheit sowie Unterstützung während der gesamten Reise zu gewährleisten.',
    },
    {
      question: 'Wie fit muss ich für diesen Trek sein?',
      answer: 'Sie müssen kein Spitzensportler sein, sollten aber ein gutes Fitnessniveau haben und mehrere Stunden an aufeinanderfolgenden Tagen wandern können. Wir empfehlen, sich mehrere Wochen im Voraus mit Wanderungen, Ausdauer- und Krafttraining vorzubereiten.',
    },
    {
      question: 'Welche Art von Verpflegung wird auf dem Berg angeboten?',
      answer: 'Unsere Bergköche bereiten dreimal täglich heiße, nahrhafte Mahlzeiten zu. Erwarten Sie Gerichte wie Suppen, Nudeln, Reis, Fleisch, Gemüse, frisches Obst und Snacks. Besondere Ernährungsbedürfnisse können auf Anfrage berücksichtigt werden.',
    },
    {
      question: 'Habe ich Zugang zu sauberem Trinkwasser?',
      answer: 'Ja. Wir behandeln und kochen täglich Wasser aus natürlichen Quellen entlang der Route. Sie erhalten jeden Tag sicheres Trinkwasser zum Auffüllen Ihrer Flaschen oder Ihres Trinksystems.',
    },
    {
      question: 'Ist es sicher, mit Asili Climbing Kilimanjaro den Kilimandscharo zu besteigen?',
      answer: 'Sicherheit hat für uns oberste Priorität. Unsere Guides sind als Wilderness First Responder (WFR) ausgebildet, und wir führen tägliche Gesundheitschecks mit Pulsoximetern durch. Notfallsauerstoff und eine tragbare Trage werden stets mitgeführt. Falls erforderlich, organisieren wir eine schnelle Evakuierung über offizielle Rettungsdienste.',
    },
  ],
  hubSummary: 'Mit acht Tagen Reisezeit dauert Ihr Kilimandscharo-Trek auf der Lemosho-Route länger als die Alternativen.',
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Lemosho-Route in 8 Tagen'},
}

const lemosho9De: TripDe = {
  slug: '9-days-lemosho-route',
  category: 'package',
  name: '9 Tage Lemosho-Route',
  durationDays: 9,
  seoTitle: '9 Tage Lemosho-Route – Schlafen im Krater | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 9 Tage Lemosho-Route, inklusive einer seltenen Übernachtung im Krater des Kilimandscharo-Gipfels.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira One Camp, Shira Two Camp, Barranco Camp, Karanga Camp, Kosovo Camp, Crater Camp, Uhuru Peak, Mweka Camp, Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte einschließlich der speziellen Krater-Camping-Genehmigung, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Lemosho-Route zählt bereits zu den landschaftlich schönsten und zuverlässigsten Routen zur Besteigung des Kilimandscharo, und dieser verlängerte neuntägige Reiseverlauf fügt ein Erlebnis hinzu, das nur eine Handvoll Kletternde jedes Jahr wagt: eine Nacht im Zelt innerhalb des Kraters am Kilimandscharo-Gipfel, nur wenige hundert Meter von Uhuru Peak entfernt. Ausgehend von der ruhigeren Westseite des Berges durchqueren Sie Regenwald, hochgelegenes Moorland und das weite Shira-Plateau, bevor Sie sich der klassischen Gipfelroute oberhalb von Barranco Camp anschließen.',
    'Anstatt direkt von einem Hochlager aus zum Gipfel vorzustoßen, fügt dieser Reiseverlauf eine zusätzliche Akklimatisierungsnacht in Kosovo Camp und eine zweite in Crater Camp hinzu, auf 5.730 m Höhe, innerhalb des Vulkankraters selbst. Die zusätzliche Zeit oberhalb von 4.700 m verbessert Ihre Akklimatisierung erheblich, und die Nacht im Krater bietet Ihnen die seltene Gelegenheit, die Aschegrube und das Eis am Kraterboden zu erkunden, bevor ein kurzer, letzter Gipfelanstieg bei Sonnenaufgang folgt.',
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Karte der Lemosho-Route in 9 Tagen'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira Camp auf dem Plateau'},
    {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
    {src: '/images/packages/9-days-northern-circuit-route/day8-uhuru-peak.webp', alt: 'Gipfelschild Uhuru Peak'},
    {src: '/images/packages/shared/hero-night.jpg', alt: 'Zelte unter der Milchstraße nahe dem Gipfel des Kilimandscharo'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Von Lemosho Gate zu Mti Mkubwa Camp',
      location: 'Lemosho Gate (2.300 m) → Mti Mkubwa Camp (2.800 m)',
      meta: ['Höhengewinn: 500 m', 'Dauer: 3 Stunden'],
      body: [
        'Nach dem Frühstück fahren Sie etwa drei bis vier Stunden von Arusha zum Lemosho Gate, auf der Westseite des Kilimandscharo. Nach Abschluss der Registrierung folgen Sie dem Waldpfad nach Osten — lokal als Chamber\'s Route bekannt — durch dichten Regenwald bis Mti Mkubwa, dem „Big Tree Camp“, Ihrer ersten Nacht auf dem Berg.',
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Registrierungsstelle Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Von Mti Mkubwa Camp zu Shira One Camp',
      location: 'Mti Mkubwa Camp (2.800 m) → Shira One Camp (3.500 m)',
      meta: ['Höhengewinn: 700 m', 'Dauer: 5-6 Stunden'],
      body: [
        'Der Pfad steigt stetig aus dem Regenwald in die Riesenheide und das Moorland an. Es ist ein voller Tag mit erheblichem Höhengewinn, halten Sie also Ihr Tempo und trinken Sie viel Wasser. Eine Mittagspause ist nahe dem Grat unterhalb des Shira-Kraters vorgesehen, bevor es weiter auf das hochgelegene Shira-Plateau geht, wo Sie erste Nahblicke auf Kibo, den zentralen Vulkankegel des Kilimandscharo, erhalten.',
      ],
      overnightStay: 'Shira One Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira One Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Shira-Plateau'},
    },
    {
      day: 3,
      label: 'Von Shira One Camp zu Shira Two Camp',
      location: 'Shira One Camp (3.500 m) → Shira Two Camp (3.900 m)',
      meta: ['Höhengewinn: 400 m', 'Dauer: 4-5 Stunden'],
      body: [
        'Ein sanfterer Tag über das weite Shira-Plateau, vorbei an der Felsformation der Shira-Kathedrale, mit freien Ausblicken über das Plateau, den Berg und die Ebenen in der Ferne. Nach dem Mittagessen im Camp unternehmen die meisten Gruppen eine kurze Akklimatisierungswanderung von etwa einer Stunde, gewinnen dabei etwas zusätzliche Höhe, bevor sie zum Schlafen nach Shira Two zurückkehren.',
      ],
      overnightStay: 'Shira Two Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira Two Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Ausblicke auf das Shira-Plateau'},
    },
    {
      day: 4,
      label: 'Von Shira Two Camp zu Barranco Camp via Lava Tower',
      location: 'Shira Two Camp (3.900 m) → Lava Tower (4.640 m) → Barranco Camp (3.950 m)',
      meta: ['Höhengewinn: 740 m', 'Höhenverlust: 690 m', 'Dauer: 7 Stunden'],
      body: [
        'Ein anspruchsvoller, aber lohnender Tag. Der Pfad steigt stetig zum eindrucksvollen vulkanischen Gesteinspfropfen Lava Tower an, wo Sie ein warmes Mittagessen auf über 4.600 m einnehmen — eine ausgezeichnete Akklimatisierung für das, was folgt. Von dort führt der Pfad hinab ins üppige Barranco-Tal, mit Ausblicken auf die Breach Wall und die Gletscher der Südseite des Kilimandscharo entlang des Weges.',
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: 'Von Barranco Camp zu Karanga Camp',
      location: 'Barranco Camp (3.950 m) → Karanga Camp (4.050 m)',
      meta: ['Höhengewinn: 100 m', 'Dauer: 4-5 Stunden'],
      body: [
        'Der Tag beginnt mit der Barranco Wall — einer 300 m hohen Kletterpartie, die einschüchternd wirkt, aber mit Hilfe Ihres Guides gut zu bewältigen ist, und die Sie mit dem Anblick des Heim-Gletschers an der Südflanke des Kilimandscharo belohnt. Vom oberen Ende der Wand führt der Pfad weiter nach Osten unterhalb der Decken- und Rebmann-Gletscher zu Karanga Camp, hoch über dem Karanga-Tal gelegen.',
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Karanga-Tal'},
    },
    {
      day: 6,
      label: 'Von Karanga Camp zu Kosovo Camp',
      location: 'Karanga Camp (4.050 m) → Kosovo Camp (4.900 m)',
      meta: ['Höhengewinn: 850 m', 'Dauer: 4 Stunden'],
      body: [
        'Ein bewusst kurzer Tag, der ausschließlich der Akklimatisierung vor Ihrem Gipfelversuch dient. Kosovo Camp liegt deutlich höher als das übliche Barafu Camp, das bei kürzeren Routen genutzt wird, und diese zusätzliche Höhe — verbunden mit einer frühen Nachtruhe — macht einen echten Unterschied dafür, wie Sie sich am Gipfeltag fühlen werden.',
      ],
      overnightStay: 'Kosovo Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: 'Hochgelegenes Wüstencamp unterhalb des Gipfels'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: 'Pfad durch die alpine Wüste'},
    },
    {
      day: 7,
      label: 'Von Kosovo Camp zu Crater Camp via Stella Point',
      location: 'Kosovo Camp (4.900 m) → Stella Point (5.756 m) → Crater Camp (5.730 m)',
      meta: ['Höhengewinn: 830 m', 'Dauer: 5-6 Stunden'],
      body: [
        'Dies ist das Herzstück der Reise. Nach einem frühen Frühstück steigen Sie durch dichtes Geröll zu Stella Point auf dem Kraterrand auf — mental und körperlich der schwierigste Abschnitt des gesamten Reiseverlaufs. Von dort steigen Sie etwa 30 Minuten hinab in den Krater selbst, wo das Camp auf 5.730 m aufgebaut wird. Am freien Nachmittag erkunden die meisten Gruppen die Aschegrube und das Eis am Kraterboden, bevor ein unvergessliches Abendessen mit Blick auf den Sonnenuntergang vom Dach Afrikas folgt.',
      ],
      overnightStay: 'Crater Camp (innerhalb des Kraters am Kilimandscharo-Gipfel)',
      image: {src: '/images/packages/shared/hero-night.jpg', alt: 'Camping unter den Sternen nahe dem Gipfel des Kilimandscharo'},
    },
    {
      day: 8,
      label: 'Von Crater Camp zu Uhuru Peak und weiter zu Mweka Camp',
      location: 'Crater Camp (5.730 m) → Uhuru Peak (5.896 m) → Mweka Camp (3.100 m)',
      meta: ['Höhengewinn: 166 m', 'Höhenverlust: 2.796 m', 'Dauer: 10-11 Stunden'],
      body: [
        'Da Sie bereits ganz in der Nähe des Gipfels übernachten, ist der heutige Aufstieg zu Uhuru Peak kurz — etwa neunzig Minuten — und so getaktet, dass Sie zum Sonnenaufgang ankommen. Nach der Feier am höchsten Punkt des Kontinents beginnt die eigentliche Arbeit: ein langer Abstieg zurück über Kosovo Camp bis Mweka Camp, mit fast 2.800 m Höhenverlust im Laufe des Tages.',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-uhuru-peak.webp', alt: 'Gipfelschild Uhuru Peak, das Dach Afrikas'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 9,
      label: 'Von Mweka Camp zu Mweka Gate, Transfer nach Arusha',
      location: 'Mweka Camp (3.100 m) → Mweka Gate (1.640 m)',
      meta: ['Höhenverlust: 1.460 m', 'Dauer: 3-4 Stunden'],
      body: [
        'Eine letzte, leichte Wanderung durch den Regenwald bis zum Mweka Gate, wo sich Ihr Team zu einer Abschiedszeremonie versammelt, bevor Sie sich verabschieden und Ihr Gipfelzertifikat erhalten. Vom Parkeingang bringt Sie ein kurzer Transfer zurück zu Ihrem Hotel in Arusha für eine heiße Dusche und wohlverdiente Erholung.',
      ],
      overnightStay: 'Arusha',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureDe,
  ],
  includes: [
    'Eintrittsgebühren / Zulassungsgebühr',
    'Naturschutzgebühren',
    'Spezielle Krater-Camping-Genehmigung',
    'Alle im Reiseverlauf genannten Aktivitäten',
    'Alle im Reiseverlauf angegebenen Unterkünfte',
    'Der gesamte Transport',
    'Alle Steuern / MwSt. 18 %',
    'Flughafenabholung und -transfer',
    'Alle im Reiseverlauf angegebenen Mahlzeiten',
  ],
  excludes: excludesVariantBDe,
  faqHeading: '9 Tage Lemosho-Route FAQs',
  faqIntro:
    'Haben Sie Fragen zum Schlafen im Krater des Kilimandscharo? Werfen Sie einen Blick auf unsere FAQ zur 9-Tage-Lemosho-Route unten für klare, hilfreiche Antworten. Sollten Sie nicht finden, wonach Sie suchen, zögern Sie nicht, uns zu kontaktieren — unsere Bergexperten bei Asili Climbing Kilimanjaro helfen Ihnen gerne, ein sicheres, erfolgreiches und unvergessliches Gipfelabenteuer zu planen.',
  faqs: [
    {
      question: 'Wie unterscheidet sich die 9-Tage-Lemosho-Route von der Standard-8-Tage-Version?',
      answer:
        'Dieser Reiseverlauf fügt eine zusätzliche Nacht in Höhe hinzu — Kosovo Camp, statt direkt zu einem Gipfelnacht-Camp weiterzuziehen — sowie eine Nacht im Zelt innerhalb des Kraters am Kilimandscharo-Gipfel, auf 5.730 m, vor einem kurzen Gipfelanstieg bei Sonnenaufgang zu Uhuru Peak. Der zusätzliche Tag in Höhe verbessert die Akklimatisierung und die Erfolgschancen deutlich, und das Camp im Krater ist ein Erlebnis, das nur sehr wenige Kletternde erfahren dürfen.',
    },
    {
      question: 'Ist es sicher, im Krater auf 5.730 m zu schlafen?',
      answer:
        'Ja, mit der richtigen Vorbereitung. Es ist kalt — nachts deutlich unter dem Gefrierpunkt — und die Höhe bedeutet, dass Sie bei Ihrer Ankunft bereits gut akklimatisiert sein sollten. Unsere Guides führen Zusatzsauerstoff und ein Pulsoximeter mit, um jeden zweimal täglich zu überwachen, und jeder, der Anzeichen von Höhenkrankheit zeigt, wird sofort nach unten begleitet.',
    },
    {
      question: 'Benötige ich eine besondere Genehmigung, um im Krater zu campen?',
      answer:
        'Ja. Das Camping im Krater erfordert zusätzlich zu den üblichen Parkgebühren eine separate Genehmigung des Kilimandscharo-Nationalparks, und die Platzzahl ist begrenzt. Wir kümmern uns im Rahmen dieses Pakets um die Genehmigungsbeantragung für Sie.',
    },
    {
      question: 'Wie anspruchsvoll ist dieser Reiseverlauf im Vergleich zu anderen Kilimandscharo-Routen?',
      answer:
        'Es ist einer unserer anspruchsvolleren Reiseverläufe, hauptsächlich wegen der längeren Zeit oberhalb von 4.700 m und des langen Abstiegs am Gipfeltag. Die zusätzliche, in den Reiseverlauf integrierte Akklimatisierung — einschließlich der Nacht in Kosovo Camp — verschafft Ihnen jedoch einen echten Vorteil gegenüber kürzeren Routen, und vorherige Höhenerfahrung ist zwar nicht erforderlich, aber hilfreich.',
    },
    {
      question: 'Was ist die beste Jahreszeit für diesen Trek?',
      answer:
        'Die Trockenzeiten — Januar bis Mitte März und Juni bis Oktober — bieten die klarsten Himmel und die besten Bedingungen für die Nacht im Krater, wo eine ruhige, klare Nacht den entscheidenden Unterschied für Komfort und Ausblicke macht.',
    },
    {
      question: 'Wie viele Personen umfasst meine Gruppe?',
      answer:
        'Wir organisieren diesen Reiseverlauf als Kleingruppenerlebnis, typischerweise zwischen 2 und 10 Trekkern, unterstützt von einem vollständigen Team aus Guides, einem Koch und Trägern.',
    },
    {
      question: 'Wie sieht die Unterkunft auf dem Berg aus?',
      answer:
        'Sie schlafen jede Nacht — auch in Crater Camp — in robusten Vier-Jahreszeiten-Bergzelten auf hochwertigen Isomatten. Unsere Crew baut das Camp jeden Tag auf und ab, damit es bei Ihrer Ankunft bereit ist.',
    },
    {
      question: 'Benötige ich einen wärmeren Schlafsack für die Nacht im Krater?',
      answer:
        'Wir empfehlen dringend einen Schlafsack, der für mindestens -15 °C zertifiziert ist, idealerweise mit Daunenfüllung, sowie eine besonders warme Basisschicht speziell für die Nacht im Krater — die Temperaturen auf 5.730 m sinken regelmäßig deutlich unter das, was die meisten Trekker sonst irgendwo auf dem Berg erleben.',
    },
  ],
  hubSummary:
    'Unser längster und exklusivster Lemosho-Reiseverlauf fügt eine zusätzliche Akklimatisierungsnacht sowie eine seltene Übernachtung im Krater des Kilimandscharo-Gipfels hinzu.',
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Lemosho-Route in 9 Tagen'},
}

const rongai7De: TripDe = {
  slug: '7-days-rongai-route',
  category: 'package',
  name: '7 Tage Rongai-Route',
  durationDays: 7,
  seoTitle: '7 Tage Rongai-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 7 Tage Rongai-Route.',
  stopsLine: 'Nalemoru Gate, Simba Camp, Second Cave Camp, Kikelewa Camp, Mawenzi Tarn, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Rongai-Route ist der einzige Pfad, der sich dem Kilimandscharo von der Nordseite nahe der kenianischen Grenze nähert und ein ruhigeres, abgelegeneres Erlebnis mit stetig ansteigenden Landschaften und weniger Andrang bietet. Sie ist perfekt für alle, die einen friedlichen Aufstieg suchen, Tierbeobachtungen genießen und eine trockenere Route bevorzugen — besonders während der Regenzeit.',
    'Über sieben Tage durchqueren Sie üppigen Regenwald, offenes Moorland und hochalpine Wüste, bis Sie schließlich auf Uhuru Peak stehen — dem höchsten Punkt Afrikas.',
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Karte der Rongai-Route in 7 Tagen'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: 'Kletternde auf dem Pfad'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Nalemoru Gate zu Simba Camp',
      location: 'Nalemoru Gate (1.950 m) → Simba Camp (2.620 m)',
      meta: ['Höhengewinn: 670 m', 'Dauer: 3–4 Stunden'],
      body: ['Ihr Trek startet am Nalemoru Gate mit einem allmählichen Aufstieg durch üppigen Bergwald. Halten Sie Ausschau nach Guerezas und Waldvögeln. Ankunft bei Simba Camp, am Rand des Moorlands gelegen.'],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Wegweiser von Simba Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'Simba Camp zu Second Cave Camp',
      location: 'Simba Camp (2.620 m) → Second Cave Camp (3.450 m)',
      meta: ['Höhengewinn: 830 m', 'Dauer: 5-6 Stunden'],
      body: ['Der heutige Pfad öffnet sich zu Heide- und Moorland, während Sie den Wald hinter sich lassen. Genießen Sie herrliche Ausblicke auf den Kibo-Gipfel auf dem Weg zu Second Cave Camp, einem ruhigen Ort inmitten alpiner Flora.'],
      overnightStay: 'Second Cave Camp',
      image: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-camp.webp', alt: 'Zelte in Second Cave Camp'},
    },
    {
      day: 3,
      label: 'Second Cave zu Kikelewa Camp',
      location: 'Second Cave (3.450 m) → Kikelewa Camp (3.630 m)',
      meta: ['Höhengewinn: 180 m', 'Dauer: 3–4 Stunden'],
      body: ['Ein kürzerer, aber wunderschöner Tag: Der Pfad windet sich durch raues Moorland mit zunehmend dramatischen Ausblicken auf die Gipfel des Kilimandscharo. Ankunft bei Kikelewa Camp, eingebettet in ein geschütztes Tal mit Panoramablick.'],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
    },
    {
      day: 4,
      label: 'Kikelewa zu Mawenzi Tarn',
      location: 'Kikelewa (3.630 m) → Mawenzi Tarn (4.310 m)',
      meta: ['Höhengewinn: 680 m', 'Dauer: 4–5 Stunden'],
      body: ['Der heutige Anstieg ist steiler, aber sehr lohnend. Sie wandern Richtung Mawenzi, dem zweiten Gipfel des Kilimandscharo, mit herrlichen Ausblicken und einer unwirklichen Hochgebirgslandschaft. Mawenzi Tarn Camp liegt in einem dramatischen Kar unterhalb aufragender Felswände.'],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 5,
      label: 'Mawenzi Tarn zu Kibo Hut',
      location: 'Mawenzi Tarn (4.310 m) → Kibo Hut (4.700 m)',
      meta: ['Höhengewinn: 390 m', 'Dauer: 5–6 Stunden'],
      body: ['Überqueren Sie die mondähnliche Senke zwischen Mawenzi und Kibo und erreichen Sie Kibo Hut bis zum Mittag. Ruhen Sie sich aus, trinken Sie ausreichend und bereiten Sie sich auf den anspruchsvollen Gipfelversuch vor, der gegen Mitternacht beginnt.'],
      overnightStay: 'Kibo Hut (Unterkunft im Schlafsaal)',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Steingebäude von Kibo Hut'},
    },
    {
      day: 6,
      label: 'Kibo Hut zu Uhuru Peak und weiter zu Horombo Hut',
      location: 'Kibo Hut (4.700 m) → Uhuru Peak (5.895 m) → Horombo Hut (3.720 m)',
      meta: ['Höhengewinn: 1.195 m', 'Höhenverlust: 2.175 m', 'Gipfelaufstieg: 6-8 Stunden', 'Abstieg: 6 Stunden'],
      body: ['Ihr Gipfelanstieg beginnt unter dem Sternenhimmel mit steilen Serpentinen zu Gilman\'s Point (5.685 m), dann entlang des Kraterrands zu Uhuru Peak — dem Dach Afrikas. Feiern Sie kurz, bevor Sie durch Kibo hinab zu Horombo Hut für eine wohlverdiente Rast absteigen.'],
      overnightStay: 'Horombo Hut (Unterkunft im Schlafsaal)',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: 'Gipfel Uhuru Peak'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 7,
      label: 'Horombo Hut zu Marangu Gate',
      location: 'Horombo Hut (3.720 m) → Marangu Gate (1.860 m)',
      meta: ['Höhenverlust: 1.860 m', 'Dauer: 5–6 Stunden'],
      body: ['Steigen Sie durch üppigen Regenwald zum Marangu Gate ab, wo Sie Ihr Kletterzertifikat erhalten und Ihren Erfolg feiern. Transfer zurück nach Moshi oder Arusha.'],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: 'Abstieg Richtung Marangu Gate'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: '7 Tage Rongai-Route FAQs',
  faqs: [
    {
      question: 'Ist die Rongai-Route weniger überlaufen als andere Kilimandscharo-Routen?',
      answer: 'Ja, die Rongai-Route ist der einzige Pfad, der sich dem Kilimandscharo von Norden nahe der kenianischen Grenze nähert. Sie gilt als deutlich ruhiger und weniger befahren als beliebte Routen wie Machame oder Marangu und bietet ein friedlicheres Trekking-Erlebnis.',
    },
    {
      question: 'Wie schwierig ist die 7-Tage-Rongai-Route?',
      answer: 'Die Rongai-Route gilt als mäßig schwierig, mit einem allmählichen Aufstiegsprofil, das die Akklimatisierung unterstützt. Eine gute Wahl für alle, die eine Balance zwischen körperlicher Herausforderung und höherer Erfolgschance suchen.',
    },
    {
      question: 'Wie hoch ist die Erfolgsquote auf der 7-Tage-Rongai-Route?',
      answer: 'Der 7-Tage-Reiseverlauf verbessert die Akklimatisierung und führt zu einer Gipfelerfolgsquote von etwa 85 % oder höher, besonders im Vergleich zu kürzeren Versionen derselben Route.',
    },
    {
      question: 'Wie sieht die Unterkunft auf der Rongai-Route aus?',
      answer: 'Sie übernachten in hochwertigen Bergzelten, die von unserer professionellen Crew aufgebaut und gepflegt werden. Beim Abstieg (über Marangu) schlafen Sie in Horombo Hut, einem warmen, geschützten Rastplatz. Für zusätzlichen Komfort ist zudem ein privates Toilettenzelt inbegriffen.',
    },
    {
      question: 'Wie sieht die Landschaft im Vergleich zu anderen Routen aus?',
      answer: 'Die Rongai-Route bietet vielfältige, einzigartige Landschaften, darunter abgelegene Wildnis, bewaldete Hänge und eindrucksvolle Ausblicke auf den Mawenzi-Gipfel. Der Abstieg über die Marangu-Route sorgt für einen Landschaftswechsel durch üppigen Regenwald.',
    },
    {
      question: 'Eignet sich diese Route besser für die Regenzeit?',
      answer: 'Ja. Die Nordseite des Kilimandscharo erhält weniger Regen, was Rongai zu einer klugen Wahl macht, wenn Sie zwischen März und Mai oder im November klettern. Sie ist zudem eine zuverlässige Option für Treks das ganze Jahr über mit weniger Wetterstörungen.',
    },
    {
      question: 'Werden Mahlzeiten und Wasser bereitgestellt?',
      answer: 'Ja. Wir servieren dreimal täglich frische, heiße Mahlzeiten, zubereitet von unseren Bergköchen. Zudem stellen wir während der gesamten Besteigung sicheres, gefiltertes Trinkwasser bereit. Besondere Ernährungswünsche berücksichtigen wir auf Anfrage — lassen Sie es uns einfach im Voraus wissen.',
    },
    {
      question: 'Welche Art von Unterstützungsteam werde ich haben?',
      answer: 'Sie werden von einer vollständigen Unterstützungscrew begleitet: erfahrene Guides, Träger und Köche, alle geschult und zertifiziert. Unser Team gewährleistet Ihre Sicherheit und Ihren Komfort von Anfang bis Ende — Ihr Erfolg ist unsere Mission.',
    },
    {
      question: 'Wie läuft die Gipfelnacht ab?',
      answer: 'Die Gipfelnacht ist die anspruchsvollste, aber auch inspirierendste Etappe. Wir verlassen Kibo Hut gegen Mitternacht und erreichen Uhuru Peak bei Sonnenaufgang. Unsere Guides begleiten Sie Schritt für Schritt mit Unterstützung und Motivation auf dem gesamten Weg.',
    },
    {
      question: 'Kann ich diese Besteigung mit einer Tansania-Safari kombinieren?',
      answer: 'Ja, und das ist sehr empfehlenswert! Bei Asili Climbing Kilimanjaro bieten wir individuelle Safari-Erweiterungen nach Ihrem Trek an. Erkunden Sie die Serengeti, den Ngorongoro-Krater oder entspannen Sie auf Sansibar — ganz nach Ihrem Reisetraum.',
    },
  ],
  hubSummary: 'Von Norden angegangen, bietet diese Route eine einzigartige Perspektive auf den Kilimandscharo und eignet sich hervorragend für alle, die…',
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Rongai-Route in 7 Tagen'},
}

const rongai6De: TripDe = {
  slug: '6-days-rongai-route',
  category: 'package',
  name: '6 Tage Rongai-Route',
  durationDays: 6,
  seoTitle: '6 Tage Rongai-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 6 Tage Rongai-Route.',
  stopsLine: 'Nalemoru Gate, Simba Camp, Kikelewa Camp, Mawenzi Tarn, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Rongai-Route ist der einzige Pfad, der sich dem Kilimandscharo von der Nordseite nahe der kenianischen Grenze nähert und ein ruhigeres, abgelegeneres Erlebnis mit stetig ansteigenden Landschaften und weniger Andrang bietet. Diese sechstägige Version verdichtet den Standard-Reiseverlauf, indem zwei der sanfteren unteren Etappen zu einem einzigen, längeren Trekking-Tag zusammengefasst werden — eine gute Wahl für Kletternde mit weniger Zeit oder bereits vorhandener Höhenerfahrung.',
    'Sie durchqueren üppigen Regenwald, offenes Moorland und hochalpine Wüste im Aufstieg, bevor Sie über die Marangu-Seite des Berges vorbei an Horombo Hut absteigen und schließlich auf Uhuru Peak stehen — dem höchsten Punkt Afrikas.',
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Karte der Rongai-Route in 6 Tagen'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: 'Kletternde auf dem Pfad'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Nalemoru Gate zu Simba Camp',
      location: 'Nalemoru Gate (1.950 m) → Simba Camp (2.600 m)',
      meta: ['Höhengewinn: 650 m', 'Dauer: 5 Stunden'],
      body: [
        'Ihr Trek beginnt am Nalemoru Gate, auf der ruhigeren Nordseite des Kilimandscharo, ganz in der Nähe der kenianischen Grenze. Nach der Registrierung im Nationalpark folgen Sie einem allmählichen Aufstieg durch Bergwald — halten Sie Ausschau nach Guerezas und Waldvögeln — bevor Sie Simba Camp am Rand des Moorlands erreichen.',
      ],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Wegweiser von Simba Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'Simba Camp zu Kikelewa Camp',
      location: 'Simba Camp (2.600 m) → Kikelewa Camp (3.600 m)',
      meta: ['Höhengewinn: 1.000 m', 'Dauer: 6–7 Stunden'],
      body: [
        'Ein längerer Tag, der zwei der sanfteren Etappen der Standardroute zu einer zusammenfasst. Der Pfad öffnet sich zu Heide- und Moorland, vorbei an Second Cave etwa auf halber Strecke — ein guter Ort für ein mitgebrachtes Mittagessen — bevor es weiter zu Kikelewa Camp geht, eingebettet in ein geschütztes Tal mit weiten Ausblicken auf den Mawenzi und die Ebenen in der Ferne.',
      ],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave, die Mittagspause auf dem Weg nach Kikelewa'},
    },
    {
      day: 3,
      label: 'Kikelewa Camp zu Mawenzi Tarn',
      location: 'Kikelewa Camp (3.600 m) → Mawenzi Tarn (4.330 m)',
      meta: ['Höhengewinn: 730 m', 'Dauer: 4 Stunden'],
      body: [
        'Ein kurzer, aber stetig steiler Anstieg ins hochgelegene Moorland, gesäumt von riesigen Lobelien und Kraut. Mawenzi Tarn Camp liegt in einem dramatischen Kar am Fuß des Mawenzi, dem zweithöchsten Gipfel des Kilimandscharo — ein spektakulärer Ort zum Ausruhen und um Ihrem Körper Zeit zur Höhenanpassung zu geben.',
      ],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 4,
      label: 'Mawenzi Tarn zu Kibo Hut',
      location: 'Mawenzi Tarn (4.330 m) → Kibo Hut (4.700 m)',
      meta: ['Höhengewinn: 370 m', 'Dauer: 5 Stunden'],
      body: [
        'Überqueren Sie die mondähnliche Senke zwischen Mawenzi und Kibo, den beiden höchsten Gipfeln des Kilimandscharo, und erreichen Sie Kibo Hut am frühen Nachmittag. Mit einem frühen Abendessen und einer Nachtruhe deutlich vor Sonnenuntergang dient dieser kurze Tag vor allem der Erholung und Vorbereitung auf den Gipfelversuch, der noch in derselben Nacht beginnt.',
      ],
      overnightStay: 'Kibo Hut (Unterkunft im Schlafsaal)',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Steingebäude von Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut zu Uhuru Peak und weiter zu Horombo Hut',
      location: 'Kibo Hut (4.700 m) → Uhuru Peak (5.895 m) → Horombo Hut (3.720 m)',
      meta: ['Höhengewinn: 1.195 m', 'Höhenverlust: 2.175 m', 'Dauer: 14 Stunden'],
      body: [
        'Ihr Guide weckt Sie gegen Mitternacht für Tee und Kekse, bevor der abschließende Gipfelanstieg beginnt. Der Pfad steigt stetig über Hans Meyer Cave zu Gilman\'s Point auf dem Kraterrand an und führt weiter — oft über Schnee — zu Uhuru Peak, dem Dach Afrikas. Nach der Feier am Gipfel führt Sie ein langer Abstieg zurück über Kibo Hut für ein warmes Mittagessen, dann weiter zu Horombo Hut für ein wohlverdientes Abendessen und Ruhe.',
      ],
      overnightStay: 'Horombo Hut (Unterkunft im Schlafsaal)',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: 'Gipfel Uhuru Peak'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut zu Marangu Gate',
      location: 'Horombo Hut (3.720 m) → Marangu Gate (1.980 m)',
      meta: ['Höhenverlust: 1.740 m', 'Dauer: 6 Stunden'],
      body: [
        'Eine wohlverdiente Feier mit Ihrer Crew — voller Gesang und Tanz — läutet Ihren letzten Morgen ein. Steigen Sie durch üppigen Regenwald zum Marangu Gate ab, wo Sie sich ins Register eintragen und Ihr Gipfelzertifikat erhalten, bevor Sie zurück nach Moshi transferiert werden, für eine heiße Dusche und eine echte Feier.',
      ],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: 'Abstieg Richtung Marangu Gate'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: '6 Tage Rongai-Route FAQs',
  faqIntro:
    'Haben Sie Fragen zur 6-Tage-Rongai-Route? Werfen Sie einen Blick auf unsere FAQ unten für klare, hilfreiche Antworten. Sollten Sie nicht finden, wonach Sie suchen, zögern Sie nicht, uns zu kontaktieren — unsere Bergexperten bei Asili Climbing Kilimanjaro helfen Ihnen gerne, ein sicheres, erfolgreiches und unvergessliches Gipfelabenteuer zu planen.',
  faqs: [
    {
      question: 'Wie unterscheidet sich die 6-Tage-Rongai-Route von der 7-Tage-Version?',
      answer:
        'Der sechstägige Reiseverlauf fasst zwei der sanfteren unteren Etappen — von Simba Camp zu Second Cave und von Second Cave zu Kikelewa — zu einem einzigen, längeren Trekking-Tag zusammen. Der Rest folgt genau demselben Pfad, denselben Camps und derselben Gipfelnacht wie die 7-Tage-Route, lediglich mit einem Akklimatisierungstag weniger.',
    },
    {
      question: 'Reichen sechs Tage für eine gute Akklimatisierung auf der Rongai-Route?',
      answer:
        'Das kann durchaus reichen, besonders für Kletternde mit etwas vorheriger Höhenerfahrung — das allmähliche Aufstiegsprofil der Rongai-Route bietet weiterhin einen echten Vorteil gegenüber steileren Routen. Falls dies jedoch Ihr erster Aufenthalt oberhalb von 4.000 m ist, empfehlen wir die 7-Tage-Version für bessere Chancen, den Gipfel komfortabel zu erreichen.',
    },
    {
      question: 'Wie hoch ist die Gipfelerfolgsquote auf dieser Route?',
      answer:
        'Der 6-Tage-Rongai-Reiseverlauf hat eine gute Erfolgsquote, wenn auch etwas niedriger als die 7-Tage-Version, einfach weil ein Akklimatisierungstag weniger eingebaut ist. Ihr Guide überwacht Sie während der gesamten Strecke genau und passt das Tempo bei Bedarf an.',
    },
    {
      question: 'Ist die Rongai-Route weniger überlaufen als andere Kilimandscharo-Routen?',
      answer:
        'Ja. Sie ist die einzige Route, die sich dem Kilimandscharo von Norden nahe der kenianischen Grenze nähert, und erfordert die längste Anfahrt zum Ausgangspunkt des Pfads — was sie deutlich ruhiger macht als Routen wie Machame oder Marangu.',
    },
    {
      question: 'Wie sieht die Unterkunft auf dieser Route aus?',
      answer:
        'Sie schlafen die ersten vier Nächte in hochwertigen Bergzelten, danach in Unterkünften im Schlafsaalstil in Kibo und Horombo. Für zusätzlichen Komfort stellen wir durchgehend ein privates Toilettenzelt bereit.',
    },
    {
      question: 'Ist diese Route während der Regenzeit eine gute Wahl?',
      answer:
        'Ja — die Nordseite des Kilimandscharo erhält deutlich weniger Regen als die südlichen Zugänge, was Rongai zu einer klugen Wahl macht, wenn Sie in den Übergangszeiten von März bis Mai oder im November klettern.',
    },
    {
      question: 'Wie läuft die Gipfelnacht ab?',
      answer:
        'Sie verlassen Kibo Hut gegen Mitternacht, steigen im Dunkeln über Hans Meyer Cave und Gilman\'s Point auf und erreichen Uhuru Peak etwa bei Sonnenaufgang, gefolgt von einem langen Abstieg zu Horombo Hut noch am selben Tag. Es ist der anspruchsvollste Tag des Treks, doch unsere Guides begleiten Sie dabei Schritt für Schritt.',
    },
    {
      question: 'Kann ich diese Besteigung mit einer Tansania-Safari kombinieren?',
      answer:
        'Auf jeden Fall. Wir bieten individuelle Safari-Erweiterungen nach Ihrer Besteigung an — die Serengeti, der Ngorongoro-Krater oder ein entspannter Aufenthalt auf Sansibar sind beliebte Ergänzungen.',
    },
  ],
  hubSummary:
    'Eine schnellere Variante der ruhigen nördlichen Route — sechs Tage vom Nalemoru Gate bis Uhuru Peak, mit weniger Andrang als die klassischen südlichen Zugänge.',
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Rongai-Route in 6 Tagen'},
}

const umbwe6De: TripDe = {
  slug: '6-days-umbwe-route',
  category: 'package',
  name: '6 Tage Umbwe-Route',
  durationDays: 6,
  seoTitle: '6 Tage Umbwe-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 6 Tage Umbwe-Route.',
  stopsLine: 'Umbwe Gate, Umbwe Cave Camp, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp und Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Umbwe-Route gilt als der direkteste, steilste und anspruchsvollste Weg zum Gipfel des Kilimandscharo. Diese Route ist nichts für schwache Nerven. Sie erfordert gute körperliche Fitness, mentale Widerstandsfähigkeit und etwas Trekking-Erfahrung. Was Umbwe besonders macht, ist ihre Abgeschiedenheit, dramatische Landschaft und die raue, wilde Atmosphäre, die sie von Anfang bis Ende bietet.',
    'Wenn Sie ein erfahrener Wanderer sind und einen ruhigen Pfad mit minimalem Andrang und schnellem Aufstieg suchen, könnte die Umbwe-Route perfekt zu Ihnen passen. Trotz ihrer Härte trifft die Route am zweiten oder dritten Tag auf den Machame-Pfad, was etwas Akklimatisierung vor der Gipfelnacht ermöglicht.',
  ],
  mapImage: {src: '/images/packages/6-days-umbwe-route/hero.jpg', alt: 'Camping auf der Umbwe-Route mit dem Gipfel des Kilimandscharo im Hintergrund'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern-Circuit-Route in 9 Tagen'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Umbwe Gate zu Umbwe Cave Camp',
      location: 'Umbwe Gate (1.600 m) → Umbwe Cave Camp (2.850 m)',
      meta: ['Höhengewinn: 1.250 m', 'Dauer: 5–6 Stunden'],
      body: ['Ihre Reise beginnt mit einer kurzen Fahrt von Moshi zum Umbwe Gate. Nach der Registrierung taucht der Pfad direkt in einen dichten, feuchten Regenwald ein. Der steile Weg klettert rasch über Baumwurzeln und moosbewachsene Grate, bis Sie Umbwe Cave Camp erreichen — Ihre erste Nacht auf dem Berg.'],
      overnightStay: 'Umbwe Cave Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-camp.jpg', alt: 'Umbwe Cave Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-2.jpg', alt: 'Wegweiser Umbwe Gate'},
    },
    {
      day: 2,
      label: 'Umbwe Cave zu Barranco Camp',
      location: 'Umbwe Cave Camp (2.850 m) → Barranco Camp (3.976 m)',
      meta: ['Höhengewinn: 1.126 m', 'Dauer: 4–5 Stunden'],
      body: ['Sie steigen steil aus der Waldzone auf und betreten die Heide- und Moorlandregion. Der Pfad verengt sich entlang felsiger Grate und offenbart weite Ausblicke auf den Kibo-Gipfel und die Western Breach. Am frühen Nachmittag erreichen Sie Barranco Camp, eingebettet unterhalb der aufragenden Barranco Wall.'],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day2-barranco-camp.jpg', alt: 'Zelte in Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day2-barranco-2.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 3,
      label: 'Barranco Camp zu Karanga Camp über die Barranco Wall',
      location: 'Barranco Camp (3.850 m) → Barranco Wall (4.200 m) → Karanga Camp (3.950 m)',
      meta: ['Höhengewinn: 350 m', 'Höhenverlust: 250 m', 'Dauer: 3-4 Stunden'],
      body: bodyBarrancoWallToKarangaDe,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day3-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day3-karanga-2.jpg', alt: 'Karanga-Tal'},
    },
    {
      day: 4,
      label: 'Karanga Camp zu Barafu Camp',
      location: 'Karanga Camp (3.950 m) → Barafu Camp (4.600 m)',
      meta: ['Höhengewinn: 650 m', 'Dauer: 3-4 Stunden'],
      body: bodyKarangaToBarafuDe,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day4-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day4-barafu-2.jpg', alt: 'Pfad Richtung Barafu Camp'},
    },
    {
      day: 5,
      label: 'Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp',
      location: 'Barafu Camp (4.600 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
      meta: ['Höhengewinn: 1.295 m', 'Höhenverlust: 2.785 m', 'Gipfelaufstieg: 6-8 Stunden', 'Abstieg: 6 Stunden'],
      body: bodySummitToMwekaDe,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day5-mweka-2.jpg', alt: 'Zelte in Mweka Camp'},
    },
    {
      day: 6,
      label: 'Mweka Camp zu Mweka Gate',
      location: 'Mweka Camp (3.110 m) → Mweka Gate (1.830 m)',
      meta: ['Höhenverlust: 1.280 m', 'Dauer: 2-3 Stunden'],
      body: bodyMwekaToGateDe,
      image: {src: '/images/packages/6-days-umbwe-route/day6-mweka-gate.jpg', alt: 'Feier mit Gipfelzertifikat am Mweka Gate'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: '6 Tage Umbwe-Route FAQs',
  faqs: [
    {
      question: 'Ist die Umbwe-Route schwierig?',
      answer: 'Ja, die Umbwe-Route gilt aufgrund ihres steilen Anstiegs und des schnellen Höhengewinns als eine der anspruchsvollsten Routen am Kilimandscharo. Sie eignet sich am besten für erfahrene Wanderer oder Personen in ausgezeichneter körperlicher Verfassung, die mit steilen Pfaden und großer Höhe vertraut sind.',
    },
    {
      question: 'Was macht die Umbwe-Route einzigartig?',
      answer: 'Ihr direkter und ruhiger Zugang macht Umbwe besonders. Sie ist die am wenigsten überlaufene Route und bietet dramatische Landschaften, dichten Regenwald und Grattrekking. Zudem trifft sie nahe Barranco Camp auf den landschaftlich reizvolleren südlichen Rundweg mit atemberaubenden Ausblicken.',
    },
    {
      question: 'Wie viele Tage dauert die Besteigung des Kilimandscharo über Umbwe?',
      answer: 'Der Standard-Umbwe-Reiseverlauf dauert 6 Tage, doch manche Kletternde entscheiden sich für eine Verlängerung auf 7 Tage, um eine bessere Akklimatisierung zu ermöglichen und die Gipfelerfolgsquote zu erhöhen.',
    },
    {
      question: 'Wie hoch ist die Erfolgsquote für die 6-Tage-Umbwe-Route?',
      answer: 'Aufgrund des schnellen Höhengewinns und der fehlenden Akklimatisierungszeit ist die Erfolgsquote der 6-Tage-Umbwe-Route niedriger als bei längeren Routen — in der Regel um 60–70 %. Fitte, gut vorbereitete Kletternde mit vorheriger Höhenerfahrung sind jedoch oft erfolgreich.',
    },
    {
      question: 'Ist die Umbwe-Route gefährlich?',
      answer: 'Die Route ist bei richtiger Herangehensweise nicht gefährlich, jedoch körperlich anspruchsvoller als andere Routen. Das Hauptrisiko ist Höhenkrankheit aufgrund des schnellen Aufstiegs. Wir nehmen Sicherheit ernst und überwachen alle Kletternden engmaschig auf Anzeichen einer akuten Höhenkrankheit (AMS).',
    },
    {
      question: 'Welche Art von Unterkunft wird auf der Umbwe-Route bereitgestellt?',
      answer: 'Die gesamte Unterkunft erfolgt in Bergzelten an festgelegten Camping-Plätzen. Wir stellen hochwertige Schlafzelte, dicke Isomatten und ein separates Speisezelt mit Tischen und Stühlen für Ihren Komfort bereit.',
    },
    {
      question: 'Was ist im Umbwe-Besteigungspaket enthalten?',
      answer: 'Unser Paket umfasst professionelle Bergführer, Träger, Parkgebühren, Camping-Ausrüstung, Mahlzeiten auf dem Berg sowie Transfers von/zu Ihrem Hotel. Internationale Flüge, Trinkgelder, persönliche Ausrüstung und zusätzliche Lodge-Nächte sind nicht inbegriffen.',
    },
    {
      question: 'Kann ich Ausrüstung mieten, falls mir etwas fehlt?',
      answer: 'Ja, wir bieten Ausrüstungsverleih in Moshi oder Arusha an. Artikel wie Schlafsäcke, Trekkingstöcke, Jacken und Stiefel sind zu angemessenen Preisen mietbar. Wir stellen Ihnen vor Ihrer Reise eine Ausrüstungscheckliste zur Verfügung.',
    },
    {
      question: 'Wie ist das Wetter auf der Umbwe-Route?',
      answer: 'Das Wetter variiert je nach Höhenlage. Rechnen Sie mit feuchten Regenwaldbedingungen am Anfang, kalten und trockenen alpinen Bedingungen auf mittlerer Strecke und eisigen Temperaturen nahe dem Gipfel. Wichtig ist, Kleidung in Schichten zu packen und auf plötzliche Wetteränderungen vorbereitet zu sein.',
    },
    {
      question: 'Wann ist die beste Zeit, um die Umbwe-Route zu besteigen?',
      answer: 'Die besten Zeiten für den Trek sind die Trockenzeiten: Januar bis Anfang März und Juni bis Oktober. Diese Monate bieten die klarsten Himmel, die besten Pfadbedingungen und das stabilste Wetter.',
    },
  ],
  hubSummary: 'Die Umbwe-Route ist bekannt für ihren anspruchsvollen, steilen Aufstieg und ihren wunderschönen, wenig begangenen Pfad.',
  hubImage: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Umbwe-Route in 6 Tagen'},
}

const northernCircuit9De: TripDe = {
  slug: '9-days-northern-circuit-route',
  category: 'package',
  name: '9 Tage Northern Circuit',
  durationDays: 9,
  seoTitle: '9 Tage Northern-Circuit-Route | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Paket 9 Tage Northern-Circuit-Route.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Moir Hut, Buffalo Camp, Third Cave Camp, School Hut, Uhuru Peak, Mweka Camp und Mweka Gate',
  priceDisclaimer:
    '*Der Preis pro Person beinhaltet: einen professionellen Bergführer, Nationalpark-Gebühren, alle Camping-Unterkünfte, Mahlzeiten während des Treks, Transfers von/zum Parkeingang sowie einen Hotelaufenthalt in Moshi/Arusha nach der Besteigung.',
  overviewBody: [
    'Die Northern-Circuit-Route ist der neueste und aufregendste Pfad am Kilimandscharo — und wohl auch der lohnendste. Sie bietet unvergleichliche 360°-Ausblicke, weniger Andrang und das beste Akklimatisierungsprofil aller Kilimandscharo-Routen. Über neun Tage beginnt dieser Trek an der abgelegenen Westseite des Berges und umrundet die selten begangenen Nordhänge, bevor er von Osten aus zum Gipfel führt. Ideal für alle, die ein intensiveres, landschaftlich reizvolleres Erlebnis mit einer sehr hohen Gipfelerfolgsquote suchen.',
    'Wenn Sie ein ruhigeres Abenteuer abseits ausgetretener Pfade mit atemberaubenden Landschaften und viel Zeit zur Höhenanpassung suchen, ist der Northern Circuit Ihre perfekte Route.',
  ],
  mapImage: {src: '/images/packages/9-days-northern-circuit-route/hero.png', alt: 'Karte der Northern-Circuit-Route am Kilimandscharo'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Der Kilimandscharo über der Akaziensavanne'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Bergsteiger nähern sich dem Gipfel durch den Schnee'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame-Route in 7 Tagen'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern-Circuit-Route in 9 Tagen'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai-Route in 7 Tagen'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe-Route in 6 Tagen'},
  ],
  itinerary: [
    arrivalDe,
    {
      day: 1,
      label: 'Londorossi Gate – Mti Mkubwa Camp',
      location: 'Londorossi Gate (2.100 m) → Mti Mkubwa Camp (2.650 m)',
      meta: ['Höhengewinn: 550 m', 'Dauer: 3–4 Stunden'],
      body: ['Wandern Sie durch dichten Regenwald voller Vogelstimmen und Affen. Dieser kurze erste Tag unterstützt die Akklimatisierung.'],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa – Shira 1 Camp',
      location: 'Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m)',
      meta: ['Höhengewinn: 960 m', 'Dauer: 5-6 Stunden'],
      body: ['Steigen Sie stetig aus dem Wald ins Moorland auf. Genießen Sie weite Ausblicke auf das Shira-Plateau und den Mount Meru in der Ferne.'],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-2.jpg', alt: 'Shira-Plateau'},
    },
    {
      day: 3,
      label: 'Shira 1 – Shira 2 Camp',
      location: 'Shira 1 Camp (3.610 m) → Shira 2 Camp (3.850 m)',
      meta: ['Höhengewinn: 240 m', 'Dauer: 4-5 Stunden'],
      body: ['Heute erwartet Sie ein sanfter Spaziergang über das hochgelegene Plateau. Sie spüren allmählich die Weite des Berges, während Sie vulkanische Landschaften durchqueren.'],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-2.jpg', alt: 'Ausblick von Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Shira 2 – Lava Tower – Moir Hut',
      location: 'Shira 2 (3.850 m) → Lava Tower (4.600 m) → Moir Hut (4.200 m)',
      meta: ['Höhengewinn: 750 m', 'Höhenverlust: 400 m', 'Dauer: 6–7 Stunden'],
      body: ['Steigen Sie zur Akklimatisierung zum Lava Tower auf, bevor Sie zu Moir Hut absteigen. Ein entscheidender Tag für die Anpassung an die Höhe.'],
      overnightStay: 'Moir Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day4-moir-hut.jpg', alt: 'Moir Hut'},
    },
    {
      day: 5,
      label: 'Moir Hut – Buffalo Camp',
      location: 'Moir Hut (4.200 m) → Buffalo Camp (4.020 m)',
      meta: ['Höhengewinn: 200 m', 'Höhenverlust: 380 m', 'Dauer: 5-6 Stunden'],
      body: ['Erkunden Sie die unberührten Nordhänge mit weiten Ausblicken auf Kenia. Eine friedliche Route mit minimalem Wanderaufkommen.'],
      overnightStay: 'Buffalo Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day5-buffalo-camp.jpg', alt: 'Buffalo Camp'},
    },
    {
      day: 6,
      label: 'Buffalo Camp – Third Cave Camp',
      location: 'Buffalo Camp (4.020 m) → Third Cave Camp (3.870 m)',
      meta: ['Höhengewinn: 150 m', 'Dauer: 5–6 Stunden'],
      body: ['Ein sanfter Tag Richtung Osten durch alpines Wüstengelände. Weniger Andrang, mehr Ruhe.'],
      overnightStay: 'Third Cave Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-camp.jpg', alt: 'Third Cave Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-2.jpg', alt: 'Third Cave Camp'},
    },
    {
      day: 7,
      label: 'Third Cave Camp – School Hut',
      location: 'Third Cave (3.870 m) → School Hut (4.750 m)',
      meta: ['Höhengewinn: 880 m', 'Dauer: 4–5 Stunden'],
      body: ['Ein steiler Anstieg durch zunehmend karge Landschaften. Ruhen Sie sich früh aus für Ihren nächtlichen Gipfelanstieg.'],
      overnightStay: 'School Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut.jpg', alt: 'School Hut'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut-2.webp', alt: 'Wegweiser von School Hut'},
    },
    {
      day: 8,
      label: 'Gipfeltag (Uhuru Peak) – Mweka Camp',
      location: 'School Hut (4.750 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.100 m)',
      meta: ['Höhengewinn: 1.145 m', 'Höhenverlust: 2.795 m', 'Dauer: 12–14 Stunden'],
      body: ['Beginnen Sie Ihren Aufstieg um Mitternacht. Erreichen Sie Stella Point bei Sonnenaufgang, dann den Gipfel von Uhuru Peak. Steigen Sie durch Geröll und Moorland zu Mweka Camp ab.'],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-2.jpg', alt: 'Hütten in Mweka Camp'},
    },
    {
      day: 9,
      label: 'Mweka Camp zu Mweka Gate',
      location: 'Mweka Camp (3.110 m) → Mweka Gate (1.830 m)',
      meta: ['Höhenverlust: 1.280 m', 'Dauer: 2-3 Stunden'],
      body: bodyMwekaToGateDe,
      image: {src: '/images/packages/9-days-northern-circuit-route/day9-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: '9 Tage Northern-Circuit-Route FAQs',
  faqIntro:
    'Haben Sie Fragen zur Besteigung des Kilimandscharo mit uns? Werfen Sie einen Blick auf unsere FAQ zur Northern-Circuit-Route unten für klare, hilfreiche Antworten. Sollten Sie nicht finden, wonach Sie suchen, zögern Sie nicht, uns zu kontaktieren — unsere Bergexperten bei Asili Climbing Kilimanjaro helfen Ihnen gerne, ein sicheres, erfolgreiches und unvergessliches Gipfelabenteuer zu planen.',
  faqs: [
    {
      question: 'Wie schwierig ist die Northern-Circuit-Route?',
      answer: 'Es ist eine mäßig bis anspruchsvolle Route, doch ihre lange Dauer macht sie hinsichtlich der Akklimatisierung zu einer der leichtesten. Mit neun Tagen hat Ihr Körper reichlich Zeit, sich an die Höhe anzupassen.',
    },
    {
      question: 'Was unterscheidet diese Route von anderen?',
      answer: 'Der Northern Circuit ist die längste und ruhigste Route am Kilimandscharo. Sie umrundet die abgelegenen Nordhänge und bietet atemberaubende Ausblicke sowie eine hohe Gipfelerfolgsquote.',
    },
    {
      question: 'Sind 9 Tage zu lang für den Berg?',
      answer: 'Keineswegs. Die verlängerte Zeit ermöglicht einen allmählichen Höhengewinn, eine bessere Akklimatisierung und weniger höhenbedingte Probleme, was Ihre Chancen erhöht, Uhuru Peak sicher zu erreichen.',
    },
    {
      question: 'Wie läuft die Gipfelnacht ab?',
      answer: 'Sie beginnen Ihren Aufstieg um Mitternacht von School Hut aus. Ziel ist es, den Gipfel bei Sonnenaufgang zu erreichen und dann noch am selben Tag zu Mweka Camp abzusteigen — insgesamt 12–14 Stunden Wanderung.',
    },
    {
      question: 'Wie sieht die Unterkunft während des Treks aus?',
      answer: 'Alle Nächte verbringen Sie in Bergzelten, bereitgestellt von Asili Climbing Kilimanjaro. Die Zelte sind warm, wasserdicht und werden von unserer Crew aufgebaut, bevor Sie im Camp ankommen.',
    },
    {
      question: 'Werden Träger und Personal fair behandelt?',
      answer: 'Absolut. Wir folgen den Standards des Kilimanjaro Porters Assistance Project (KPAP), um sicherzustellen, dass alle Träger und Crewmitglieder fair bezahlt werden und unter sicheren Bedingungen arbeiten.',
    },
    {
      question: 'Benötige ich vorherige Trekking-Erfahrung?',
      answer: 'Nicht zwingend. Sie sollten körperlich fit und mental vorbereitet sein. Unsere Guides passen das Tempo des Treks an Ihre Fähigkeiten an und sorgen für eine angemessene Akklimatisierung.',
    },
    {
      question: 'Was ist die beste Zeit für den Northern Circuit?',
      answer: 'Juni bis Oktober sowie Januar bis Anfang März sind ideal. Diese Monate bieten klare Himmel, weniger Niederschlag und bessere Pfadbedingungen.',
    },
    {
      question: 'Werde ich in einer Gruppe klettern?',
      answer: 'Wir bieten sowohl private Besteigungen als auch offene Gruppentreks an. Sie können Ihren bevorzugten Stil bei der Buchung wählen.',
    },
    {
      question: 'Was passiert, wenn ich Höhenkrankheit bekomme?',
      answer: 'Ihr Guide überwacht Ihre Gesundheit täglich. Bei auftretenden Symptomen handeln wir sofort — passen das Tempo an, bieten Sauerstoffunterstützung oder organisieren bei Bedarf eine Evakuierung.',
    },
  ],
  hubSummary: 'Die neueste und längste Route, mit 360-Grad-Ausblicken und den höchsten Erfolgsquoten für das Erreichen des Gipfels.',
  hubImage: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit in 9 Tagen'},
}

// ---------------------------------------------------------------------------
// 4 Kilimanjaro + Safari combos
// ---------------------------------------------------------------------------

const combo9De: TripDe = {
  slug: '9-days-kilimanjaro-safari',
  category: 'combo',
  name: '9 Tage Kilimandscharo & Safari',
  durationDays: 9,
  seoTitle: '9 Tage Kilimandscharo & Safari | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Kombi-Paket 9 Tage Kilimandscharo & Safari.',
  stopsLine:
    'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate, Tarangire-Nationalpark, Ngorongoro-Krater, Lake-Manyara-Nationalpark',
  overviewBody: [
    'Dieses 9-tägige Abenteuer ist die ultimative Art, das Herz Tansanias zu erleben — es verbindet den Nervenkitzel der Besteigung des Kilimandscharo über die landschaftlich reizvolle und komfortable Marangu-Route mit der Aufregung einer klassischen Nord-Circuit-Safari durch den Tarangire-Nationalpark, den Ngorongoro-Krater und den Lake Manyara.',
    'Ob Sie zum ersten Mal Tansania besuchen oder sich einen langgehegten Traum erfüllen — diese Reise bietet die perfekte Balance aus körperlicher Leistung, atemberaubenden Landschaften und hautnahen Begegnungen mit der Tierwelt, alles begleitet von der fachkundigen Betreuung des Asili-Climbing-Kilimanjaro-Teams.',
  ],
  mapImage: {src: '/images/combo/9-days-kilimanjaro-safari/marangu-trekkers.jpg', alt: 'Trekker auf der Marangu-Route'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '9 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '9 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '9 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '9 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '9 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '9 Tage Kilimandscharo & Safari'},
  ],
  itinerary: [
    comboArrivalDe(),
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      meta: ['Höhe: 1.860 m → 2.700 m', 'Höhengewinn: 840 m', 'Dauer: 4–5 Stunden'],
      body: ['Beginnen Sie Ihre Reise durch üppigen Regenwald voller Guerezas und lebendiger Flora. Nach einem stetigen Anstieg erreichen Sie Mandara Hut für Ihre erste Nacht auf dem Berg.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/mandara.jpg', alt: 'Marangu Gate – Mandara Hut'},
      overnightStay: 'Mandara Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/mandara-hut.webp', alt: 'Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      meta: ['Höhe: 2.700 m → 3.720 m', 'Höhengewinn: 1.020 m', 'Dauer: 6–7 Stunden'],
      body: ['Beim Verlassen des Waldes wechselt der Pfad in Heide- und Moorland. Genießen Sie unterwegs Ausblicke auf die Gipfel Kibo und Mawenzi.'],
      image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Mandara Hut – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 3,
      label: 'Akklimatisierung bei Horombo Hut',
      meta: ['Höhe: 3.720 m → 4.000 m (Zebra Rocks) → 3.720 m', 'Höhengewinn: 280 m', 'Höhenverlust: 280 m', 'Dauer: 2–3 Stunden (optionale Wanderung)'],
      body: ['Ein wichtiger Akklimatisierungstag, der Ihrem Körper hilft, sich anzupassen. Sie können eine kurze Wanderung zu den Zebra Rocks unternehmen und für Mittagessen und Ruhe nach Horombo zurückkehren.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-2.jpeg', alt: 'Akklimatisierung bei Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo3.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      meta: ['Höhe: 3.720 m → 4.703 m', 'Höhengewinn: 983 m', 'Dauer: 6–7 Stunden'],
      body: ['Der heutige Trek führt Sie durch alpines Wüstengelände in Richtung des Basislagers Kibo Hut. Ruhen Sie sich früh aus, um sich auf die Gipfelnacht vorzubereiten.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut2.jpg', alt: 'Horombo Hut – Kibo Hut'},
      overnightStay: 'Kibo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut-1.jpg', alt: 'Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: ['Höhe: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m', 'Höhengewinn: 1.192 m', 'Höhenverlust: 2.175 m', 'Dauer: 12–14 Stunden'],
      body: ['Beginnen Sie Ihren Gipfelanstieg kurz nach Mitternacht, erreichen Sie Gilman\'s Point und dann bei Sonnenaufgang Uhuru Peak. Nach der Feier am Gipfel steigen Sie zu Horombo Hut für Ihre letzte Übernachtung ab.'],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Kibo Hut – Uhuru Peak – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Transfer',
      meta: ['Höhe: 3.720 m → 1.860 m', 'Höhenverlust: 1.860 m', 'Dauer: 5–6 Stunden'],
      body: ['Steigen Sie durch Moorland und Regenwald zurück zum Gate ab. Nach Erhalt Ihres Gipfelzertifikats werden Sie zu Ihrem Hotel transferiert.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/marangu.jpg', alt: 'Horombo Hut – Marangu Gate – Transfer'},
      overnightStay: 'Hotel in Arusha (inbegriffen)',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Hotel in Arusha (inbegriffen)'},
    },
    {
      day: 7,
      label: 'Arusha – Tarangire-Nationalpark',
      meta: ['Fahrzeit: ca. 2,5 Stunden ab Arusha', 'Highlight: Elefantenherden & uralte Affenbrotbäume'],
      body: ['Fahren Sie nach dem Frühstück von Arusha direkt zum Tarangire-Nationalpark, bekannt für seine dramatischen, mit Affenbrotbäumen gesäumten Landschaften und große Elefantenpopulationen. Der Park ist Heimat von Löwen, Giraffen, Zebras, Gnus und über 500 Vogelarten. Nach einer ganztägigen Pirschfahrt geht es weiter zu Ihrer Lodge bei Lake Manyara oder Karatu für Abendessen und Übernachtung.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/Gallery-img07.webp', alt: 'Arusha – Tarangire-Nationalpark'},
      overnightStay: 'Lodge in Karatu oder am Lake Manyara',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Lodge in Karatu oder am Lake Manyara'},
    },
    {
      day: 8,
      label: 'Ngorongoro-Krater',
      meta: ['Fahrzeit: 45 Minuten bis 1 Stunde zum Kratertor', 'Highlight: Big-Five-Sichtungen in einer vulkanischen Caldera'],
      body: ['Nach einem frühen Frühstück steigen Sie hinab in den atemberaubenden Ngorongoro-Krater, ein UNESCO-Weltkulturerbe, oft als „achtes Weltwunder“ bezeichnet. Diese gewaltige Caldera ist ein Zufluchtsort für Wildtiere — darunter Elefanten, Löwen, Büffel, Nilpferde, Flamingos und der bedrohte Spitzmaulnashorn. Genießen Sie ein Picknick-Mittagessen auf dem Kraterboden, bevor es zurück zu Ihrer Lodge geht.'],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Ngorongoro-Krater'},
      overnightStay: 'Dieselbe Lodge in Karatu',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Dieselbe Lodge in Karatu'},
    },
    {
      day: 9,
      label: 'Lake-Manyara-Nationalpark – Arusha',
      meta: ['Fahrzeit: ca. 1,5 Stunden zurück nach Arusha', 'Highlight: Baumkletternde Löwen & Flamingos'],
      body: ['Starten Sie Ihren Morgen mit einer Fahrt zum Lake-Manyara-Nationalpark, berühmt für seinen üppigen Grundwasserwald, den von Flamingos gesäumten See und die baumkletternden Löwen. Dieser kompakte, aber vielfältige Park eignet sich perfekt für eine entspannte letzte Pirschfahrt. Nach dem Mittagessen kehren Sie nach Arusha zurück, wo Ihre Safari endet. Optional bringen wir Sie zum Flughafen für Ihren Weiterflug.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/tanzania-safari.jpg', alt: 'Lake-Manyara-Nationalpark – Arusha'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: comboFaqHeadingDe,
  faqIntro: comboFaqIntroDe,
  faqs: comboFaqsDe,
  hubSummary: 'Perfekt für Abenteurer mit knapper Zeit. Besteigen Sie den Kilimandscharo über eine 6-tägige Route und genießen Sie anschließend eine kurze 3-tägige Safari durch Tansanias legendäre Parks wie Ngorongoro und Tarangire.',
  hubImage: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: '9 Tage Kilimandscharo & Safari'},
}

const combo10De: TripDe = {
  slug: '10-days-kilimanjaro-and-safari',
  category: 'combo',
  name: '10 Tage Kilimandscharo & Safari',
  durationDays: 10,
  seoTitle: '10 Tage Kilimandscharo & Safari | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Kombi-Paket 10 Tage Kilimandscharo & Safari.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Tarangire-Nationalpark, Ngorongoro-Krater, Lake-Manyara-Nationalpark',
  overviewBody: [
    'Dieses 10-tägige Abenteuer ist perfekt, wenn Sie den Kilimandscharo besteigen und gleichzeitig die Magie einer klassischen afrikanischen Safari erleben möchten — alles in einer unvergesslichen Reise. Sie beginnen mit einem 7-tägigen Trek auf der Machame-Route, bekannt für ihre atemberaubende Landschaft und hervorragende Akklimatisierung. Sie ist bei Kletternden aus gutem Grund beliebt: Sie wandern durch üppigen Regenwald, hochgelegenes Moorland und raues alpines Gelände, bevor Sie den Gipfel von Afrikas höchstem Berg erreichen — Uhuru Peak auf 5.895 Metern.',
  ],
  mapImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/machame.png', alt: 'Karte 10 Tage Kilimandscharo & Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '10 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '10 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '10 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '10 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '10 Tage Kilimandscharo & Safari'},
  ],
  itinerary: [
    comboArrivalDe(),
    {
      day: 1,
      label: 'Machame Gate zu Machame Camp',
      meta: ['Machame Gate (1.800 m) → Machame Camp (3.000 m)', 'Höhengewinn: 1.200 m', 'Dauer: 6-7 Stunden'],
      body: ['Ihre Reise beginnt mit einer 45-minütigen Fahrt von Moshi zum Machame Gate. Nach der Registrierung führt der Trek über einen sich windenden Pfad durch üppigen Regenwald, die feuchteste Zone des Berges. Rechnen Sie mit gelegentlichen Nachmittagsschauern, die den Pfad zeitweise rutschig machen.'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-.jpg', alt: 'Machame Gate zu Machame Camp'},
      overnightStay: 'Machame Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-Camp.jpg', alt: 'Machame Camp'},
    },
    {
      day: 2,
      label: 'Machame Camp zu Shira Camp',
      meta: ['Machame Camp (3.000 m) → Shira Camp (3.840 m)', 'Höhengewinn: 840 m', 'Dauer: 5-6 Stunden'],
      body: ['Der Tag beginnt mit einem steilen Aufstieg über einen Bergrücken zum Picnic Rock, einem fantastischen Aussichtspunkt mit Blick auf Kibo und den zerklüfteten Rand des Shira-Plateaus.'],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'Machame Camp zu Shira Camp'},
      overnightStay: 'Shira Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira Camp'},
    },
    {
      day: 3,
      label: 'Shira Camp zu Barranco Camp via Lava Tower',
      meta: ['Shira Camp (3.840 m) → Lava Tower (4.550 m) → Barranco Camp (3.850 m)', 'Höhengewinn: 710 m', 'Höhenverlust: 700 m', 'Dauer: 6-7 Stunden'],
      body: ['Ein anspruchsvoller, aber entscheidender Akklimatisierungstag: Sie wandern durch hochgelegenes Wüstengelände zum 90 Meter hohen Lava Tower, einem vulkanischen Gesteinspfropfen mit unglaublichem Panoramablick.'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lava-Tower.jpg', alt: 'Shira Camp zu Barranco Camp via Lava Tower'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 4,
      label: 'Barranco Camp zu Karanga Camp über die Barranco Wall',
      meta: ['Barranco Camp (3.850 m) → Barranco Wall (4.200 m) → Karanga Camp (3.950 m)', 'Höhengewinn: 350 m', 'Höhenverlust: 250 m', 'Dauer: 3-4 Stunden'],
      body: ['Der Tag beginnt mit der eindrucksvollen Barranco Wall, einem spannenden Anstieg, der mit atemberaubenden Ausblicken belohnt.'],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'Barranco Camp zu Karanga Camp über die Barranco Wall'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 5,
      label: 'Karanga Camp zu Barafu Camp',
      meta: ['Karanga Camp (3.950 m) → Barafu Camp (4.600 m)', 'Höhengewinn: 650 m', 'Dauer: 3-4 Stunden'],
      body: ['Ein gleichmäßiger Vormittagsanstieg führt zu Barafu Camp, was auf Suaheli „Eis“ bedeutet. Dieses hochgelegene Camp liegt auf einem Grat unterhalb des Gipfelkegels und markiert den Abschluss des südlichen Rundwegs am Kilimandscharo, mit spektakulären Gipfelblicken aus mehreren Perspektiven.'],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'Karanga Camp zu Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Barafu-Camp.webp', alt: 'Barafu Camp'},
    },
    {
      day: 6,
      label: 'Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp',
      meta: ['Barafu Camp (4.600 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)', 'Höhengewinn: 1.295 m', 'Höhenverlust: 2.785 m', 'Gipfelaufstieg: 6-8 Stunden', 'Abstieg: 6 Stunden'],
      body: ['Um Mitternacht beginnt Ihr letzter Aufstieg zum Gipfel. Der Pfad ist steil und anspruchsvoll, bei Temperaturen deutlich unter dem Gefrierpunkt. Mit der Morgendämmerung wird der prächtige rote Sonnenaufgang hinter dem Mawenzi-Gipfel Sie motiviert halten.'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Uhuru-Peak.webp', alt: 'Barafu Camp zu Uhuru Peak und weiter zu Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Mweka-Camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 7,
      label: 'Mweka Camp zu Mweka Gate',
      meta: ['Mweka Camp (3.110 m) → Mweka Gate (1.830 m)', 'Höhenverlust: 1.280 m', 'Dauer: 2-3 Stunden'],
      body: ['Der letzte Abstieg führt Sie durch üppigen Regenwald, mit der Chance, verspielte Affen entlang des Weges zu entdecken.'],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka-Gate-Schild am Kilimandscharo-Nationalpark'},
      overnightStay: 'Planet Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/planet-lodge1.jpg', alt: 'Planet Lodge'},
    },
    {
      day: 8,
      label: 'Arusha – Tarangire-Nationalpark',
      meta: ['Fahrzeit: ca. 2,5 Stunden ab Arusha', 'Highlight: Elefantenherden & uralte Affenbrotbäume'],
      body: ['Fahren Sie nach dem Frühstück von Arusha direkt zum Tarangire-Nationalpark, bekannt für seine dramatischen, mit Affenbrotbäumen gesäumten Landschaften und große Elefantenpopulationen. Der Park ist Heimat von Löwen, Giraffen, Zebras, Gnus und über 500 Vogelarten. Nach einer ganztägigen Pirschfahrt geht es weiter zu Ihrer Lodge bei Lake Manyara oder Karatu für Abendessen und Übernachtung.'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/h.jpg', alt: 'Arusha – Tarangire-Nationalpark'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/marera-2.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 9,
      label: 'Ngorongoro-Krater-Pirschfahrt',
      meta: ['Fahrzeit: 45 Minuten bis 1 Stunde zum Kratertor', 'Highlight: Big-Five-Sichtungen in einer vulkanischen Caldera'],
      body: ['Nach einem frühen Frühstück steigen Sie hinab in den atemberaubenden Ngorongoro-Krater, ein UNESCO-Weltkulturerbe, oft als „achtes Weltwunder“ bezeichnet. Diese gewaltige Caldera ist ein Zufluchtsort für Wildtiere — darunter Elefanten, Löwen, Büffel, Nilpferde, Flamingos und der bedrohte Spitzmaulnashorn. Genießen Sie ein Picknick-Mittagessen auf dem Kraterboden, bevor es zurück zu Ihrer Lodge geht.'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Ngorongoro-Crater.jpg', alt: 'Ngorongoro-Krater-Pirschfahrt'},
      overnightStay: 'Ngorongoro Rhino Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Rhino-Lodge1.jpeg', alt: 'Ngorongoro Rhino Lodge'},
    },
    {
      day: 10,
      label: 'Lake-Manyara-Nationalpark – Arusha',
      meta: ['Fahrzeit: ca. 1,5 Stunden zurück nach Arusha', 'Highlight: Baumkletternde Löwen & Flamingos'],
      body: ['Starten Sie Ihren Morgen mit einer Fahrt zum Lake-Manyara-Nationalpark, berühmt für seinen üppigen Grundwasserwald, den von Flamingos gesäumten See und die baumkletternden Löwen. Dieser kompakte, aber vielfältige Park eignet sich perfekt für eine entspannte letzte Pirschfahrt. Nach dem Mittagessen kehren Sie nach Arusha zurück, wo Ihre Safari endet. Optional bringen wir Sie zum Flughafen für Ihren Weiterflug.'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lake-Manyara-National-Park.jpg', alt: 'Lake-Manyara-Nationalpark – Arusha'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: comboFaqHeadingDe,
  faqIntro: comboFaqIntroDe,
  faqs: comboFaqsDe,
  hubSummary: 'Ein ausgewogenes Abenteuer, das eine 7-tägige Kilimandscharo-Besteigung (wie die Machame-Route) mit einer 3-tägigen Wildtier-Safari verbindet — ideal, um sowohl den Berg als auch die Savanne von ihrer besten Seite zu erleben.',
  hubImage: {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Tage Kilimandscharo & Safari'},
}

const combo11De: TripDe = {
  slug: '11-days-kilimanjaro-safari',
  category: 'combo',
  name: '11 Tage Kilimandscharo & Safari',
  durationDays: 11,
  seoTitle: '11 Tage Kilimandscharo & Safari | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Kombi-Paket 11 Tage Kilimandscharo & Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Tarangire, Ngorongoro-Krater, Lake-Manyara-Nationalpark',
  overviewBody: [
    'Diese 11-tägige Reise verbindet zwei der größten Schätze Tansanias — den majestätischen Gipfel des Kilimandscharo und die raue, unvergessliche Schönheit seiner Nationalparks. Mit 8 Tagen auf der Lemosho-Route, einer der landschaftlich reizvollsten und erfolgreichsten Trekking-Routen des Kilimandscharo, gefolgt von 3 Tagen klassischer Safari, bietet dieser Reiseverlauf eine einmalige Kombination aus Herausforderung, Entdeckung und tiefer Verbundenheit mit der Natur.',
  ],
  mapImage: {src: '/images/combo/11-days-kilimanjaro-safari/lemosho.png', alt: 'Karte 11 Tage Kilimandscharo & Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '11 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '11 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '11 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '11 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '11 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '11 Tage Kilimandscharo & Safari'},
  ],
  itinerary: [
    comboArrivalDe(),
    {
      day: 1,
      label: 'Lemosho Gate zu Mti Mkubwa',
      meta: ['Höhe: 2.100 m → 2.650 m', 'Höhengewinn: 550 m', 'Dauer: 3–4 Stunden'],
      body: ['Nach dem Frühstück fahren Sie von Arusha zum Londorossi Gate zur Registrierung. Dann geht es weiter zum Lemosho Gate, wo die Wanderung durch üppigen Regenwald beginnt. Dieses Gebiet ist reich an Tierwelt wie schwarz-weißen Guerezas und Waldvögeln. Sie wandern unter einem Blätterdach hindurch, bevor Sie Mti Mkubwa (Big Tree) Camp für die Nacht erreichen.'],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'Lemosho Gate zu Mti Mkubwa'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/mti-mkubwa-1.webp', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa Camp zu Shira 1 Camp',
      meta: ['Mti Mkubwa Camp (2.650 m) – Shira 1 Camp (3.610 m)', 'Höhengewinn: 960 m', 'Dauer: 6–7 Stunden'],
      body: ['Der heutige Pfad steigt allmählich aus dem Regenwald in die Zone von Heidekraut und Moorland an. Mit zunehmender Höhe lichten sich die Bäume, und die Landschaft öffnet sich mit herrlichen Ausblicken auf den Shira-Grat und den Kibo-Gipfel. Nach einer malerischen Wanderung über sanfte Hügel und vulkanische Gesteinsformationen erreichen Sie Shira 1 Camp auf dem Shira-Plateau.'],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'Mti Mkubwa Camp zu Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'Shira 1 Camp zu Shira 2 Camp',
      meta: ['Shira 1 Camp (3.610 m) – Shira 2 Camp (3.850 m)', 'Höhengewinn: 240 m', 'Dauer: 3–4 Stunden'],
      body: ['Ein anspruchsvoller, aber entscheidender Akklimatisierungstag: Sie wandern durch hochgelegenes Wüstengelände zum 90 Meter hohen Lava Tower, einem vulkanischen Gesteinspfropfen mit unglaublichem Panoramablick.'],
      image: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 1 Camp zu Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Shira 2 Camp zu Lava Tower und weiter zu Barranco Camp',
      meta: ['Shira 2 Camp (3.850 m) → Lava Tower (4.630 m) → Barranco Camp', 'Höhengewinn: 780 m', 'Höhenverlust: 654 m', 'Dauer: 6–7 Stunden'],
      body: ['Steigen Sie stetig zum eindrucksvollen Lava Tower auf, wo Sie eine Mittagspause einlegen. Steigen Sie anschließend hinab ins wunderschöne Barranco-Tal für die Nacht. Dies ist einer der wichtigsten Akklimatisierungstage des Reiseverlaufs.'],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'Shira 2 Camp zu Lava Tower und weiter zu Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'Barranco Camp zu Karanga Camp',
      meta: ['Barranco Camp (3.976 m) → Karanga Camp (4.035 m)', 'Höhengewinn: 59 m', 'Dauer: 4–5 Stunden'],
      body: ['Erklimmen Sie die berühmte Barranco Wall — anspruchsvoll, aber nicht technisch. Setzen Sie den Weg über alpines Gelände zu Karanga Camp fort. Dieser kürzere Tag gibt Ihrem Körper mehr Zeit zur Akklimatisierung vor der Gipfelnacht.'],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'Barranco Camp zu Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'Karanga Camp zu Barafu Camp',
      meta: ['Karanga Camp (4.035 m) → Barafu Camp (4.703 m)', 'Höhengewinn: 668 m', 'Dauer: 3–4 Stunden'],
      body: ['Ein kurzer, aber steiler Trek durch hochgelegene alpine Wüste zu Ihrem letzten Camp vor der Gipfelnacht. Ruhen Sie sich aus, trinken Sie ausreichend und bereiten Sie sich mental auf die bevorstehende Herausforderung vor.'],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'Karanga Camp zu Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/barafu-camp1.jpg', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Barafu Camp → Uhuru Peak → Mweka Camp',
      meta: ['Barafu Camp (4.703 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.720 m)', 'Höhengewinn: 1.192 m', 'Höhenverlust: 2.175 m', 'Dauer: 12–14 Stunden'],
      body: ['Beginnen Sie Ihren Gipfelanstieg um Mitternacht. Erreichen Sie Stella Point zum Sonnenaufgang und setzen Sie den Weg zu Uhuru Peak fort — dem höchsten Punkt Afrikas. Nach der Feier am Gipfel steigen Sie durchgehend bis Mweka Camp ab.'],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Barafu Camp → Uhuru Peak → Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp → Mweka Gate',
      meta: ['Mweka Camp (3.720 m) → Mweka Gate (1.640 m)', 'Höhenverlust: 2.080 m', 'Dauer: 3–4 Stunden'],
      body: ['Durchqueren Sie üppigen Regenwald bis zum Parkausgang, wo Sie Ihr Kilimandscharo-Zertifikat erhalten. Ihr Fahrer bringt Sie zu Ihrem Hotel für eine heiße Dusche und wohlverdiente Erholung.'],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp → Mweka Gate'},
      overnightStay: 'Lodge in Arusha',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/Kaliwa-Lodge.jpg', alt: 'Lodge in Arusha'},
    },
    {
      day: 9,
      label: 'Tarangire-Nationalpark',
      meta: ['Fahrzeit: ca. 2,5 Stunden ab Arusha', 'Highlight: Elefantenherden & uralte Affenbrotbäume'],
      body: ['Fahren Sie nach dem Frühstück von Arusha direkt zum Tarangire-Nationalpark, bekannt für seine dramatischen, mit Affenbrotbäumen gesäumten Landschaften und große Elefantenpopulationen. Der Park ist Heimat von Löwen, Giraffen, Zebras, Gnus und über 500 Vogelarten. Nach einer ganztägigen Pirschfahrt geht es weiter zu Ihrer Lodge bei Lake Manyara oder Karatu für Abendessen und Übernachtung.'],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/Gallery-img04-1.webp', alt: 'Tarangire-Nationalpark'},
      overnightStay: 'Lodge in Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Lodge in Karatu'},
    },
    {
      day: 10,
      label: 'Ngorongoro-Krater',
      meta: ['Fahrzeit: 45 Minuten bis 1 Stunde zum Kratertor', 'Highlight: Big-Five-Sichtungen in einer vulkanischen Caldera'],
      body: ['Nach einem frühen Frühstück steigen Sie hinab in den atemberaubenden Ngorongoro-Krater, ein UNESCO-Weltkulturerbe, oft als „achtes Weltwunder“ bezeichnet. Diese gewaltige Caldera ist ein Zufluchtsort für Wildtiere — darunter Elefanten, Löwen, Büffel, Nilpferde, Flamingos und der bedrohte Spitzmaulnashorn. Genießen Sie ein Picknick-Mittagessen auf dem Kraterboden, bevor es zurück zu Ihrer Lodge geht.'],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Ngorongoro-Krater'},
      overnightStay: 'Dieselbe Lodge in Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Dieselbe Lodge in Karatu'},
    },
    {
      day: 11,
      label: 'Lake-Manyara-Nationalpark – Arusha',
      meta: ['Fahrzeit: ca. 1,5 Stunden zurück nach Arusha', 'Highlight: Baumkletternde Löwen & Flamingos'],
      body: ['Starten Sie Ihren Morgen mit einer Fahrt zum Lake-Manyara-Nationalpark, berühmt für seinen üppigen Grundwasserwald, den von Flamingos gesäumten See und die baumkletternden Löwen. Dieser kompakte, aber vielfältige Park eignet sich perfekt für eine entspannte letzte Pirschfahrt. Nach dem Mittagessen kehren Sie nach Arusha zurück, wo Ihre Safari endet. Optional bringen wir Sie zum Flughafen für Ihren Weiterflug.'],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/zebra.jpg', alt: 'Lake-Manyara-Nationalpark – Arusha'},
    },
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: comboFaqHeadingDe,
  faqIntro: comboFaqIntroDe,
  faqs: comboFaqsDe,
  hubSummary: 'Diese Option gibt Ihnen Zeit für eine gründliche Akklimatisierung während einer 7-tägigen Besteigung und anschließend Entspannung bei einer 4-tägigen Safari durch die Serengeti, Ngorongoro und weitere unverzichtbare Parks.',
  hubImage: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: '11 Tage Kilimandscharo & Safari'},
}

const combo12De: TripDe = {
  slug: '12-days-kilimanjaro-safari',
  category: 'combo',
  name: '12 Tage Kilimandscharo & Safari',
  durationDays: 12,
  seoTitle: '12 Tage Kilimandscharo & Safari | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für das Kombi-Paket 12 Tage Kilimandscharo & Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Tarangire-Nationalpark, Serengeti-Nationalpark, Ngorongoro-Krater',
  overviewBody: [
    'Dieses 12-tägige Abenteuer verbindet die landschaftlich reizvolle Lemosho-Route auf den Kilimandscharo mit einer vollständigen Nord-Circuit-Safari durch Tarangire, die Serengeti und den Ngorongoro-Krater. Beginnend an den abgelegenen Westhängen des Berges bietet die Besteigung einen ruhigeren Start, vielfältige Ökosysteme und eine hervorragende Akklimatisierung über acht Tage auf dem Berg.',
    'Nach Ihrem Gipfelversuch geht es nahtlos weiter in vier Tage Pirschfahrten — Sie verfolgen Elefanten und Affenbrotbäume im Tarangire, verbringen einen ganzen Tag mit der Beobachtung der Gnu-Wanderung und großer Raubkatzen auf den endlosen Ebenen der Serengeti und steigen anschließend in den Ngorongoro-Krater hinab, oft als „achtes Weltwunder“ bezeichnet, bevor es zurück nach Arusha geht.',
  ],
  mapImage: {src: '/images/combo/12-days-kilimanjaro-safari/lemosho4.png', alt: 'Karte 12 Tage Kilimandscharo & Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '12 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '12 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '12 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/simba-camp-2.jpg', alt: '12 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro-climb.webp', alt: '12 Tage Kilimandscharo & Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Tage Kilimandscharo & Safari'},
  ],
  itinerary: [
    comboArrivalDe(),
    {
      day: 1,
      label: 'Londorossi Gate zu Mti Mkubwa Camp',
      meta: ['Lemosho Gate (2.100 m) → Mti Mkubwa (2.650 m)', 'Höhengewinn: 550 m', 'Dauer: 3–4 Stunden'],
      body: ['Beginnen Sie Ihre Kilimandscharo-Besteigung mit einer malerischen Fahrt zum Londorossi Gate, wo Genehmigungen und Registrierung abgewickelt werden. Vom Tor führt eine kurze Fahrt durch Bergwald zum Ausgangspunkt in Lemosho. Der Trek zu Mti Mkubwa (Big Tree Camp) führt Sie durch üppigen Regenwald, Heimat von Blauaffen und vielfältiger Vogelwelt.'],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'Londorossi Gate zu Mti Mkubwa Camp'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/mti-mkubwa-camp-scaled.jpg', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa Camp zu Shira 1 Camp',
      meta: ['Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m)', 'Höhengewinn: 960 m', 'Dauer: 5-6 Stunden'],
      body: ['Heute treten Sie aus dem Wald in die Heide- und Moorlandzone, steigen stetig zum Shira-Grat an und sinken leicht ab, um im Camp auf dem Shira-Plateau mit Ausblicken auf die oberen Hänge des Kilimandscharo zu übernachten.'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro_climbing-1.jpg', alt: 'Mti Mkubwa Camp zu Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/second-camp.webp', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'Shira 1 Camp zu Shira 2 Camp',
      meta: ['Shira 1 (3.610 m) → Shira 2 Camp (3.850 m)', 'Höhengewinn: 240 m', 'Dauer: 3–4 Stunden'],
      body: ['Ein kürzerer Tag zur Unterstützung der Akklimatisierung, der über das malerische Shira-Plateau führt. Sie genießen weite Ausblicke und ein entspanntes Tempo bis Shira 2 Camp.'],
      image: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 1 Camp zu Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Shira 2 Camp zu Barranco Camp (via Lava Tower)',
      meta: ['Shira 2 (3.850 m) → Lava Tower (4.630 m) → Barranco Camp (3.976 m)', 'Höhengewinn: 780 m', 'Höhenverlust: 654 m', 'Dauer: 6–7 Stunden'],
      body: ['Hoch klettern, tief schlafen — dieser entscheidende Akklimatisierungstag bringt Sie zum Lava Tower zum Mittagessen, bevor Sie ins grüne Barranco-Tal absteigen. Ein eindrucksvoller Tag mit ständig wechselnden Landschaften.'],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'Shira 2 Camp zu Barranco Camp (via Lava Tower)'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'Barranco Camp zu Karanga Camp',
      meta: ['Barranco (3.976 m) → Karanga Camp (3.995 m)', 'Höhengewinn: 240 m', 'Höhenverlust: 220 m', 'Dauer: 4–5 Stunden'],
      body: ['Bewältigen Sie die eindrucksvolle Barranco Wall, einen Höhepunkt des Treks, und durchqueren Sie anschließend Grate und Täler, bevor Sie Karanga Camp erreichen. Ein weiterer wichtiger Tag zur Akklimatisierung.'],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'Barranco Camp zu Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'Karanga Camp zu Barafu Camp',
      meta: ['Karanga (3.995 m) → Barafu Camp (4.673 m)', 'Höhengewinn: 678 m', 'Dauer: 3–4 Stunden'],
      body: ['Sie steigen durch alpine Wüste auf, um Barafu zu erreichen, Ihr Basislager für den Gipfelversuch. Ruhen Sie sich aus, trinken Sie ausreichend und bereiten Sie sich mental auf den Mitternachtsaufstieg zum Dach Afrikas vor.'],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'Karanga Camp zu Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/barafu-camp-1.webp', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Barafu Camp zu Uhuru Peak zu Mweka Camp',
      meta: ['Barafu (4.673 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)', 'Höhengewinn: 1.222 m', 'Höhenverlust: 2.785 m', 'Dauer: 12–14 Stunden'],
      body: ['Gipfeltag! Starten Sie vor Mitternacht, um Stella Point bei Sonnenaufgang zu erreichen, und setzen Sie den Weg bis Uhuru Peak fort. Nach der Feier am Gipfel steigen Sie zu Barafu für eine kurze Pause ab, dann weiter zu Mweka Camp für eine wohlverdiente Rast.'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/solo-climb.jpeg', alt: 'Barafu Camp zu Uhuru Peak zu Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp zu Mweka Gate',
      meta: ['Mweka Camp (3.110 m) → Mweka Gate (1.640 m)', 'Höhenverlust: 1.470 m', 'Dauer: 3–4 Stunden'],
      body: ['Genießen Sie Ihre letzte Wanderung durch den Regenwald. Bei Ankunft am Tor erhalten Sie Ihr Gipfelzertifikat und werden zu Ihrem Hotel transferiert — mit Erinnerungen für ein Leben lang.'],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp zu Mweka Gate'},
      overnightStay: 'Hotel in Arusha',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Hotel in Arusha'},
    },
    {
      day: 9,
      label: 'Arusha – Tarangire-Nationalpark',
      meta: ['Ca. 2,5 Stunden Fahrt ab Arusha', 'Highlight: Elefantenherden, Affenbrotbäume und abgeschiedene Atmosphäre'],
      body: ['Nach dem Frühstück in Arusha trifft Sie Ihr Asili-Safariguide für die Fahrt zum Tarangire-Nationalpark, einem der am meisten unterschätzten Juwelen Tansanias. Oft zugunsten der Serengeti übersehen, überrascht Tarangire Besucher mit seiner wilden Schönheit, riesigen Affenbrotbäumen und einer bemerkenswerten Elefantendichte. Während der Trockenzeit lockt der Tarangire-Fluss zahllose Tiere an und sorgt für spannende Tierbeobachtungen.'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/elephant-tara.jpg', alt: 'Arusha – Tarangire-Nationalpark'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 10,
      label: 'Tarangire – Serengeti-Nationalpark',
      meta: ['Ca. 4–5 Stunden Fahrt über das Ngorongoro-Hochland', 'Highlight: Serengeti-Ebenen und raubtierreiche Landschaften'],
      body: ['Nach dem Frühstück führt Ihre Reise weiter durch das Ngorongoro-Schutzgebiet auf dem Weg zur Serengeti. Unterwegs genießen Sie Panoramablicke und Massai-Dörfer, bevor Sie den Park durch das Naabi-Hill-Tor betreten. Im Inneren beginnt Ihre Serengeti-Pirschfahrt mit der Chance, Großkatzen, Gnuherden, Giraffen und mehr zu entdecken.'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/wildebeest-migration-serengeti.jpg', alt: 'Tarangire – Serengeti-Nationalpark'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 11,
      label: 'Ganztägige Pirschfahrt in der Serengeti',
      meta: ['Flexible Routenführung je nach Tieraktivität', 'Highlight: Ganztägige Großwildbeobachtung und Raubtierverfolgung'],
      body: ['Stehen Sie früh auf für einen ganzen Tag Tierbeobachtung im Serengeti-Nationalpark, bekannt für seine offenen Ebenen und dramatischen Räuber-Beute-Interaktionen. Je nach Saison lenkt Ihr Guide zu den aktivsten Gebieten — ob in Seronera, Ndutu oder weiter nördlich. Beobachten Sie Löwen auf der Jagd nach Büffeln, Leoparden, die sich in Bäumen ausruhen, und Elefanten, die in saisonalen Flüssen baden.'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/lion-serengeti1.jpg', alt: 'Ganztägige Pirschfahrt in der Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 12,
      label: 'Serengeti – Ngorongoro-Krater – Arusha',
      meta: ['Ganztägige Reise mit Kraterabstieg (Fahrzeit insgesamt: 7–8 Stunden)', 'Highlight: Big-Five- und Spitzmaulnashorn-Sichtungen im Krater'],
      body: ['Nach einem frühen Frühstück verlassen Sie die Serengeti und fahren zum Ngorongoro-Krater, wo Sie in die größte intakte vulkanische Caldera der Welt hinabsteigen. Verbringen Sie den Tag mit der Erkundung dieses natürlichen Amphitheaters voller Löwen, Elefanten, Flamingos, Schakale und sogar Nashörner. Nach einem Picknick-Mittagessen an einem Nilpferdteich geht es wieder hinauf und zurück nach Arusha, wo Sie am Abend ankommen.'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/rhino.jpg', alt: 'Serengeti – Ngorongoro-Krater – Arusha'},
    },
    departureDe,
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: comboFaqHeadingDe,
  faqIntro: comboFaqIntroDe,
  faqs: [
    {
      question: 'Was ist im 12-tägigen Kilimandscharo- und Safari-Paket enthalten?',
      answer: 'Ihr Paket umfasst Flughafentransfers, Hotelunterkünfte in Arusha, eine vollständig geführte Kilimandscharo-Besteigung (mit Parkgebühren, Trägern, Zelten, Mahlzeiten und zertifizierten Bergführern) sowie eine 4-tägige private Wildtier-Safari mit Parkeintrittsgebühren, Lodge-Unterkünften, Mahlzeiten, einem 4×4-Safarifahrzeug und einem professionellen Guide. Internationale Flüge, Trinkgelder und persönliche Ausgaben sind nicht inbegriffen.',
    },
    {
      question: 'Sind 12 Tage genug, um sowohl den Kilimandscharo als auch eine Safari zu genießen?',
      answer: 'Ja, 12 Tage sind ideal. Sie haben 7 oder 8 Tage, um den Kilimandscharo sicher zu besteigen (über Routen wie Lemosho oder Machame), gefolgt von einer 4-tägigen Safari durch Tansanias bekannteste Parks wie Serengeti, Ngorongoro-Krater und Tarangire. So erleben Sie das Beste aus Berg und Tierwelt in einem Abenteuer.',
    },
    {
      question: 'Was ist die beste Zeit für diese 12-tägige Reise?',
      answer: 'Die besten Monate sind Januar bis Anfang März und Juni bis Oktober, wenn die Bedingungen sowohl für die Kilimandscharo-Besteigung als auch für die Tierbeobachtung günstig sind. Dies sind Tansanias Trockenzeiten mit klareren Himmeln und hervorragenden Tiersichtungen.',
    },
    {
      question: 'Wie körperlich anspruchsvoll ist die Kilimandscharo-Besteigung?',
      answer: 'Die Besteigung des Kilimandscharo ist ein nicht-technischer Trek, jedoch aufgrund der großen Höhe körperlich anspruchsvoll. Gute Fitness, mentale Entschlossenheit und angemessene Akklimatisierung (die wir mit längeren Routen wie Lemosho sicherstellen) sind entscheidend für den Gipfelerfolg. Vorherige Klettererfahrung ist nicht erforderlich.',
    },
    {
      question: 'Kann ich Ausrüstung für den Kilimandscharo mieten, falls mir etwas fehlt?',
      answer: 'Ja. Asili Climbing Kilimanjaro bietet hochwertige Mietausrüstung wie Schlafsäcke, Daunenjacken, Trekkingstöcke, Stirnlampen und mehr an. Eine vollständige Packlistenempfehlung wird bereitgestellt, und Sie können benötigte Mietartikel im Voraus buchen.',
    },
    {
      question: 'Welche Art von Unterkunft habe ich während der Safari?',
      answer: 'Wir nutzen sorgfältig ausgewählte Lodges und Zeltcamps, die sauber, komfortabel und in der Nähe der Parks für maximalen Zugang zur Tierwelt gelegen sind. Ob im mittleren oder Luxussegment — alle bieten eigene Bäder, gutes Essen und herzliche Gastfreundschaft.',
    },
    {
      question: 'Bin ich Teil einer Gruppe, oder handelt es sich um eine private Tour?',
      answer: 'Die meisten unserer Kilimandscharo-und-Safari-Kombinationen sind private Touren, speziell für Sie oder Ihre Gruppe konzipiert. Dies ermöglicht mehr Flexibilität beim Tempo, persönliche Betreuung und ein individuelles Erlebnis sowohl auf dem Berg als auch auf Safari.',
    },
    {
      question: 'Ist Höhenkrankheit häufig, und wie gehen Sie damit um?',
      answer: 'Höhenkrankheit kann jeden treffen, unabhängig von der Fitness. Wir überwachen Ihre Gesundheit auf dem Berg täglich mit Pulsoximetern und erfahrenen, in Höhen-Erster-Hilfe geschulten Guides. Längere Reiseverläufe wie die 8-tägige Lemosho-Route verbessern die Akklimatisierung und den Gipfelerfolg. In ernsten Fällen sind Notfallevakuierungsprotokolle vorhanden.',
    },
    {
      question: 'Welche Art von Verpflegung wird während der Besteigung und Safari angeboten?',
      answer: 'Auf dem Kilimandscharo bereiten unsere Bergköche täglich heiße, nahrhafte Mahlzeiten zu — erwarten Sie Suppen, Reis, Nudeln, Gemüse, Fleischgerichte und Obst. Vegetarische und besondere Ernährungsweisen werden berücksichtigt. Auf Safari bieten Lodges Buffet- oder À-la-carte-Mahlzeiten mit afrikanischen und internationalen Optionen.',
    },
    {
      question: 'Benötige ich eine Reiseversicherung?',
      answer: 'Ja, eine umfassende Reiseversicherung ist obligatorisch. Ihre Police sollte medizinische Notfälle, Evakuierung (einschließlich aus großer Höhe), Reiseabsagen und Verzögerungen abdecken. Wir können Ihnen bei Bedarf seriöse Anbieter empfehlen.',
    },
    {
      question: 'Wie bereite ich mich körperlich auf diese Reise vor?',
      answer: 'Beginnen Sie 8–12 Wochen vor der Abreise mit einem Trainingsplan, der Ausdauertraining, Wandern mit Rucksack und Krafttraining umfasst. Wochenendwanderungen und lange Spaziergänge mit Höhenunterschied bereiten Ihre Beine und Lunge auf die Anforderungen des Kilimandscharo vor.',
    },
    {
      question: 'Wie buche ich dieses 12-tägige Erlebnis bei Asili Climbing Kilimanjaro?',
      answer: 'Die Buchung ist ganz einfach! Kontaktieren Sie uns über unsere Website oder WhatsApp, und einer unserer Spezialisten hilft Ihnen, Ihre Kilimandscharo- und Safari-Reise individuell zu gestalten. Eine Anzahlung von 20–30 % sichert Ihren Platz, und wir begleiten Sie durch jeden Schritt bis zu Ihrer Ankunft in Tansania.',
    },
  ],
  hubSummary: 'Ein vollständiges Erlebnis für Naturliebhaber. Besteigen Sie Afrikas höchsten Gipfel über 8 Tage (wie die Lemosho-Route) und lassen Sie 4 unvergessliche Tage auf Safari zur Tierbeobachtung folgen.',
  hubImage: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Tage Kilimandscharo & Safari'},
}

// ---------------------------------------------------------------------------
// 2 standalone safaris
// ---------------------------------------------------------------------------

const sharedSafariDaysDe = (): SafariDayDe[] => [
  {
    day: 1,
    label: 'Arusha - Tarangire-Nationalpark',
    image: {src: '/images/safari/shared/elephant-tara.jpg', alt: 'Arusha - Tarangire-Nationalpark'},
    body: [
      [{text: 'Morgens nach dem Frühstück:', bold: true}, {text: ' Unser Safari-Guide holt Sie von Ihrem Hotel in Arusha City ab. Anschließend legen Sie etwa 120 km, fast 2 Stunden Fahrt, in Richtung Tarangire-Nationalpark zurück.'}],
      [{text: 'Tarangire-Nationalpark:', bold: true}, {text: ' Der Tarangire-Nationalpark ist bekannt für seine großen Elefantenherden, die frei entlang der Ufer des Tarangire-Flusses umherziehen — ein wahrhaftiges Symbol einer tansanischen Familien-Safari, neben vielen weiteren Tierarten. Wir erleben die saisonalen Sümpfe (Feuchtgebiete), die Savanne und den Tarangire-Fluss, die eine wichtige Rolle im Ökosystem des Parks spielen und während der Trockenzeit Tiere anziehen.'}],
      [{text: 'Tierbeobachtung:', bold: true}, {text: ' Wir werden so viele Tiere wie möglich entdecken, darunter Löwen, Zebras, Mungos, Erdferkel, Gnus, Büffel, Elefanten und Giraffen (um nur einige zu nennen). Mit etwas Glück erhaschen wir auch einen kurzen Blick auf Löwen und Leoparden.'}],
      [{text: 'Picknick und Pirschfahrt:', bold: true}, {text: ' Unser professioneller und erfahrener Safari-Guide wählt einen geeigneten Picknickplatz für ein köstliches Mittagessen am dafür vorgesehenen Rastplatz. Anschließend setzen Sie die Pirschfahrt bis in den späten Abend fort.'}],
      [{text: 'Abendtransfer:', bold: true}, {text: ' Am Abend werden Sie zu einem unserer sorgfältig ausgewählten Hotelpartner für Abendessen und Übernachtung gebracht.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
  {
    day: 2,
    label: 'Serengeti-Nationalpark',
    image: {src: '/images/safari/shared/lake-manyara.webp', alt: 'Serengeti-Nationalpark'},
    body: [
      [
        {
          text: 'Morgens nach dem Frühstück beginnen Sie Ihre Safari in Richtung der endlosen Ebenen des Serengeti-Nationalparks, wobei Sie am Ngorongoro View Point einen Blick auf den Ngorongoro-Krater erhaschen, bevor Sie weiter zum Serengeti-Nationalpark reisen (den Sie am Nachmittag erreichen). Unser professioneller, erfahrener Safari-Guide wählt einen guten Zeitpunkt für ein köstliches Mittagessen und etwas Sekt inmitten der atemberaubenden Landschaft.',
        },
      ],
      [
        {
          text: 'Der Serengeti-Nationalpark ist berühmt für seinen vielfältigen Bestand an einheimischer Tierwelt, einschließlich der „Big Five“, die bekannt sind, da sie die fünf ikonischsten Tiertrophäen sind, nach denen Jäger suchen. In der Serengeti wird die größte Löwenpopulation Afrikas vermutet (etwa 2.950 Tiere), aufgrund der Vielfalt der hier lebenden Beutetiere.',
        },
      ],
      [{text: 'Der scheue Leopard wird häufig in der Seronera-Region gesichtet, ist aber im gesamten Park zu finden. Seine Population wird auf etwa 1.000 Tiere geschätzt.'}],
      [{text: 'Optionale Safari-Aktivität:', bold: true}, {text: ' Serengeti-Ballon-Safari (600 USD pro Person)'}],
      [{text: 'Nach der Pirschfahrt geht es zu Ihrer Unterkunft für Abendessen und Übernachtung.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
  {
    day: 3,
    label: 'Serengeti-Nationalpark',
    image: {src: '/images/safari/shared/honeymoon1.jpg', alt: 'Serengeti-Nationalpark'},
    body: [
      [
        {
          text: 'Morgens nach dem Frühstück beginnen Sie Ihre Safari in Richtung der endlosen Ebenen des Serengeti-Nationalparks, wobei Sie am Ngorongoro View Point einen Blick auf den Ngorongoro-Krater erhaschen, bevor Sie weiter zum Serengeti-Nationalpark reisen (den Sie am Nachmittag erreichen). Unser professioneller, erfahrener Safari-Guide wählt einen guten Zeitpunkt für ein köstliches Mittagessen und etwas Sekt inmitten der atemberaubenden Landschaft.',
        },
      ],
      [
        {
          text: 'Der Serengeti-Nationalpark ist berühmt für seinen vielfältigen Bestand an einheimischer Tierwelt, einschließlich der „Big Five“, die bekannt sind, da sie die fünf ikonischsten Tiertrophäen sind, nach denen Jäger suchen. In der Serengeti wird die größte Löwenpopulation Afrikas vermutet (etwa 2.950 Tiere), aufgrund der Vielfalt der hier lebenden Beutetiere.',
        },
      ],
      [{text: 'Der scheue Leopard wird häufig in der Seronera-Region gesichtet, ist aber im gesamten Park zu finden. Seine Population wird auf etwa 1.000 Tiere geschätzt.'}],
      [{text: 'Optionale Safari-Aktivität:', bold: true}, {text: ' Serengeti-Ballon-Safari (600 USD pro Person)'}],
      [{text: 'Nach der Pirschfahrt geht es zu Ihrer Unterkunft für Abendessen und Übernachtung.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
  {
    day: 4,
    label: 'Serengeti-Nationalpark / Ngorongoro-Krater',
    image: {src: '/images/safari/shared/h.jpg', alt: 'Serengeti-Nationalpark / Ngorongoro-Krater'},
    body: [
      [{text: 'Morgens nach dem Frühstück brechen Sie vom Camp mit einem Picknick-Mittagessen zum Ngorongoro-Krater auf. Dieses Gebiet liegt westlich der Region Arusha innerhalb des geologischen Crater-Highlands-Gebiets Tansanias.'}],
      [
        {
          text: 'Bei Ankunft am Kraterrand erhalten Sie einen ersten Blick auf das, was Sie am nächsten Tag auf den offenen Grasebenen erwartet, gemeinsam mit einer großen Zahl an Tieren, die Sie aus National-Geographic-Dokumentationen kennen. Im Krater bestehen gute Chancen, alle „Big Five“ (Löwe, Leopard, Elefant, Büffel und Nashorn) zu sichten, je nach Glück.',
        },
      ],
      [{text: 'Am Nachmittag wird Ihnen an einem eigens dafür vorgesehenen Picknickplatz Mittagessen serviert, danach folgt eine Nachmittagspirschfahrt bis in den späten Abend. Abendessen und Übernachtung finden in der Lodge statt.'}],
      [{text: 'Optionale Safari-Aktivität:', bold: true}],
      [{text: 'Besuch der Olduvai-Schlucht und des Museums pro Person (40 USD pro Person)'}],
      [{text: 'Ngorongoro-Kraterrand-Wandersafari (30 USD pro Person)'}],
      [{text: 'Besuch eines Massai-Dorfes (50 USD pro Fahrzeug)'}],
    ],
    overnightStay: 'Ngorongoro Rhino Lodge',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
  {
    day: 5,
    label: 'Ngorongoro-Krater',
    image: {src: '/images/safari/shared/ngorongoro.jpg', alt: 'Ngorongoro-Krater'},
    body: [
      [
        {
          text: 'Nach einem frühen Frühstück steigen Sie hinab in den atemberaubenden Ngorongoro-Krater, ein UNESCO-Weltkulturerbe, oft als „achtes Weltwunder“ bezeichnet. Diese gewaltige Caldera ist ein Zufluchtsort für Wildtiere — darunter Elefanten, Löwen, Büffel, Nilpferde, Flamingos und der bedrohte Spitzmaulnashorn.',
        },
      ],
      [{text: 'Genießen Sie ein Picknick-Mittagessen auf dem Kraterboden, bevor Sie zurück zu Ihrer Lodge für die Nacht aufsteigen.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
  {
    day: 6,
    label: 'Lake-Manyara-Nationalpark',
    image: {src: '/images/safari/shared/manyara.jpg', alt: 'Lake-Manyara-Nationalpark'},
    body: [
      [
        {
          text: 'Morgens nach dem Frühstück werden Sie von Ihrer Lodge abgeholt und zum Lake-Manyara-Nationalpark gefahren (etwa 30 Minuten). Der Park ist ein perfekter Spielplatz für Fotografie-Enthusiasten und bietet einige der besten Tierbeobachtungen der Welt. Sie können viele der berühmtesten Tiere Afrikas entdecken, wobei die einzigartigen baumkletternden Löwen ein ideales Fotomotiv darstellen. Diese ikonischen Raubtiere räkeln sich in Akazienbäumen und laden geradezu dazu ein, fotografiert zu werden.',
        },
      ],
      [
        {
          text: 'Auch Vogelbeobachter und -liebhaber finden am Lake Manyara ein perfektes Ziel, mit einer riesigen Vielfalt an Vogelarten im Park. Selbst Birder dürfen sich auf eine große Gruppe Flamingos (Flamboyance), kreisende Greifvögel und den wunderschön gefärbten Gabelracken freuen.',
        },
      ],
      [{text: 'Mittagessen wird im Park am Picknickplatz serviert, und am Nachmittag geht es zurück nach Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
  {
    day: 7,
    label: 'Lake-Manyara-Nationalpark',
    image: {src: '/images/safari/shared/e7636d2be5e1edef3f8c3756db7fe4d5df583879-1600x1067-1-1.jpg', alt: 'Lake-Manyara-Nationalpark'},
    body: [
      [
        {
          text: 'Morgens nach dem Frühstück werden Sie von Ihrer Lodge abgeholt und zum Lake-Manyara-Nationalpark gefahren (etwa 30 Minuten). Der Park ist ein perfekter Spielplatz für Fotografie-Enthusiasten und bietet einige der besten Tierbeobachtungen der Welt. Sie können viele der berühmtesten Tiere Afrikas entdecken, wobei die einzigartigen baumkletternden Löwen ein ideales Fotomotiv darstellen. Diese ikonischen Raubtiere räkeln sich in Akazienbäumen und laden geradezu dazu ein, fotografiert zu werden.',
        },
      ],
      [
        {
          text: 'Auch Vogelbeobachter und -liebhaber finden am Lake Manyara ein perfektes Ziel, mit einer riesigen Vielfalt an Vogelarten im Park. Selbst Birder dürfen sich auf eine große Gruppe Flamingos (Flamboyance), kreisende Greifvögel und den wunderschön gefärbten Gabelracken freuen.',
        },
      ],
      [{text: 'Mittagessen wird im Park am Picknickplatz serviert, und am Nachmittag geht es zurück nach Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
  },
]

const safari15De: SafariDe = {
  slug: '15-days-tanzania-safari',
  name: '15 Tage Tansania-Safari',
  durationDays: 15,
  seoTitle: '15 Tage Tansania-Safari | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für die 15 Tage Tansania-Safari.',
  stopsLine: 'Tarangire-Nationalpark, Serengeti-Nationalpark, Ngorongoro-Krater, Lake-Manyara-Nationalpark, Sansibar',
  overviewBody: [
    'Diese 15-tägige Tansania-Safari verbindet eine klassische Nord-Circuit-Pirschfahrt-Safari — Tarangire, die Serengeti, den Ngorongoro-Krater und Lake Manyara — mit einem verlängerten Aufenthalt an den Stränden Sansibars und gibt Ihnen Zeit für sowohl eine ausgiebige Wildtier-Safari als auch einen entspannten Inselurlaub in einer Reise.',
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Karte der Nord-Circuit-Safariroute'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Gnu-Wanderung in der Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Massai-Kultur in Tansania'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: 'Zebras trinken an einem Wasserloch'},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Giraffe auf Safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Luxuriöse Safari-Lodge'},
  ],
  itinerary: [
    ...sharedSafariDaysDe(),
    {
      day: 8,
      label: 'Ankunft auf Sansibar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Ankunft auf Sansibar'},
      body: [[{text: 'Fliegen Sie von Arusha nach Sansibar und transferieren Sie zu Ihrem Strandhotel, wo der restliche Tag zur freien Verfügung steht, um sich am Indischen Ozean einzuleben und zu entspannen.'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
    },
    {
      day: 9,
      label: 'Sansibar',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: 'Sansibar'},
      body: [[{text: 'Ein freier Tag auf Sansibar zum Entspannen am Strand, oder arrangieren Sie über Ihr Gasthotel einen optionalen Ausflug nach Stone Town, zu einer Gewürzfarm oder zum Schnorcheln.'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
    },
    {
      day: 10,
      label: 'Sansibar-Strandverlängerung (Tag 10–14)',
      body: [[{text: 'Verbringen Sie fünf ruhige Tage mit Entspannung an den Stränden Sansibars, mit Zeit, um die verwinkelten Gassen von Stone Town zu erkunden, eine optionale Gewürzfarm-Tour zu unternehmen oder vor der Küste zu schnorcheln — in Ihrem eigenen Tempo, mit Basis im selben Strandhotel.'}]],
      overnightStay: 'Tulia Boutique Hotel',
    },
    {
      day: 15,
      label: 'Abreise',
      body: [[{text: 'Transfer zum Flughafen für Ihren Rückflug — das Ende Ihrer Tansania-Safari und Ihres Sansibar-Ausflugs.'}]],
    },
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: comboFaqHeadingDe,
  faqIntro: comboFaqIntroDe,
  faqs: [safariExpectFaqDe, ...sharedSafariFaqsDe],
}

const safari10HoneymoonDe: SafariDe = {
  slug: '10-days-tanzania-luxury-honeymoon-safaris',
  name: '10 Tage Tansania Luxus-Flitterwochen-Safaris',
  durationDays: 10,
  seoTitle: '10 Tage Tansania Luxus-Flitterwochen-Safaris | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Echter Reiseverlauf Tag für Tag, Preise und Leistungen für die 10 Tage Tansania Luxus-Flitterwochen-Safaris.',
  stopsLine: 'Tarangire-Nationalpark, Serengeti-Nationalpark, Ngorongoro-Krater, Lake-Manyara-Nationalpark, Sansibar',
  overviewBody: [
    'Die 10-tägige Asilia-Tansania-Luxus-Safari ist darauf ausgelegt, Ihnen ein Erlebnis fürs Leben zu bieten — von den vielfältigen Kulturen der einheimischen Bevölkerung über die Tierwelt bis hin zu beeindruckenden, atemberaubenden Landschaften — eine klassische Nord-Circuit-Safari durch den Tarangire-Nationalpark, die Serengeti, Lake Manyara und den Ngorongoro-Krater, gefolgt von einem entspannten Aufenthalt an den Stränden Sansibars.',
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Karte der Nord-Circuit-Safariroute'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Gnu-Wanderung in der Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Massai-Kultur in Tansania'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: 'Zebras trinken an einem Wasserloch'},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Giraffe auf Safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Luxuriöse Safari-Lodge'},
  ],
  itinerary: [
    ...sharedSafariDaysDe(),
    {
      day: 8,
      label: 'Ankunft auf Sansibar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Ankunft auf Sansibar'},
      body: [[{text: 'Fliegen Sie von Arusha nach Sansibar und transferieren Sie zu Ihrem Strandhotel, wo der restliche Tag zur freien Verfügung steht, um sich am Indischen Ozean einzuleben und zu entspannen.'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
    },
    {
      day: 9,
      label: 'Sansibar',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: 'Sansibar'},
      body: [[{text: 'Ein freier Tag auf Sansibar zum Entspannen am Strand, oder arrangieren Sie über Ihr Gasthotel einen optionalen Ausflug nach Stone Town, zu einer Gewürzfarm oder zum Schnorcheln.'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mittelklasse', 'Luxus'],
    },
    {
      day: 10,
      label: 'Abreise',
      body: [[{text: 'Transfer zum Flughafen für Ihren Rückflug — das Ende Ihrer tansanischen Flitterwochen-Safari.'}]],
    },
  ],
  includes: includesVariantBDe,
  excludes: excludesVariantBDe,
  faqHeading: comboFaqHeadingDe,
  faqIntro: comboFaqIntroDe,
  faqs: [safariExpectFaqDe, ...sharedSafariFaqsDe],
}

async function run() {
  await seedTripDe(machame7De)
  await seedTripDe(machame6De)
  await seedTripDe(marangu5De)
  await seedTripDe(marangu6De)
  await seedTripDe(lemosho7De)
  await seedTripDe(lemosho8De)
  await seedTripDe(lemosho9De)
  await seedTripDe(rongai7De)
  await seedTripDe(rongai6De)
  await seedTripDe(umbwe6De)
  await seedTripDe(northernCircuit9De)
  await seedTripDe(combo9De)
  await seedTripDe(combo10De)
  await seedTripDe(combo11De)
  await seedTripDe(combo12De)
  await seedSafariDe(safari15De)
  await seedSafariDe(safari10HoneymoonDe)
  console.log('done — all 17 trips seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
