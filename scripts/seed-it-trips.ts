/**
 * Phase 6 (Italian): Italian translations for the 15 unified `trip` documents
 * (9 Kilimanjaro packages, 4 combo packages, 2 safaris). Mirrors seed-fr-trips.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-trips.ts --with-user-token
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

interface FaqIt {
  question: string
  answer: string
}

interface ItineraryDayIt {
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

interface SafariDayIt {
  day: number
  label: string
  image?: Img
  body: {text: string; bold?: boolean}[][]
  overnightStay?: string
  accommodationTiers?: string[]
}

const seo = (title: string, description: string) => ({_type: 'seo', title, description})

const faqs = (items: FaqIt[]) =>
  items.map((f) => ({_type: 'faqItem', _key: key(), question: f.question, answer: f.answer}))

const paragraphBlock = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

async function dayToDoc(stop: ItineraryDayIt) {
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

async function safariDayToDoc(stop: SafariDayIt) {
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

async function upsertTripIt(slug: string, fields: Record<string, unknown>) {
  const enId = await findEnId(client, 'trip', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const itId = await upsertTranslatedDoc(client, 'trip', slug, 'it', fields)
  await linkTranslationMetadata(client, 'trip', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${slug}-it done (${itId})`)
}

// ---------------------------------------------------------------------------
// Shared fragments (translated once, reused verbatim across trips — mirrors
// the English source's own reuse of `arrival`/`departure`/`includesVariantX`).
// ---------------------------------------------------------------------------

const arrivalIt: ItineraryDayIt = {
  day: 0,
  label: 'Arrivo e briefing',
  body: [
    "Al tuo arrivo all'aeroporto internazionale del Kilimangiaro, sarai trasferito al tuo alloggio, dove la tua guida effettuerà un briefing completo e un controllo dell'attrezzatura per prepararti all'avventura che ti aspetta.",
  ],
  overnightStay: 'Ameg Lodge / Kaliwa Lodge',
  image: {src: '/images/packages/shared/kilimanjaro-airport.jpg', alt: 'Aeroporto internazionale del Kilimangiaro'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/packages/shared/ameg-lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/packages/shared/kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'}},
  ],
}

const comboArrivalIt = (): ItineraryDayIt => ({
  day: 0,
  label: 'Arrivo e briefing',
  body: [
    "Al tuo arrivo all'aeroporto internazionale del Kilimangiaro, sarai trasferito al tuo alloggio, dove la tua guida effettuerà un briefing completo e un controllo dell'attrezzatura per prepararti all'avventura che ti aspetta.",
  ],
  image: {src: '/images/combo/shared/kilimanjaro-airport.jpg', alt: 'Arrivo e briefing'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/combo/shared/Ameg-Lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Kaliwa Lodge'}},
  ],
})

const departureIt: ItineraryDayIt = {
  day: -1,
  label: 'Partenza o proseguimento del viaggio',
  body: ["Trasferimento all'aeroporto internazionale del Kilimangiaro per il tuo volo di ritorno, oppure continua la tua avventura tanzaniana!"],
}

const includesVariantAIt = [
  'Guide di montagna professionali ed esperte, di lingua inglese, oltre a guide assistenti',
  "Portatori competenti e cordiali per trasportare l'attrezzatura e le provviste",
  'Cuoco e tutti i pasti in montagna (colazione, pranzo, cena)',
  'Acqua potabile (filtrata e trattata) e bevande calde durante tutto il trek',
  'Tasse e permessi del parco nazionale del Kilimangiaro',
  'Tassa di soccorso',
  'Alloggio in campeggio con tende di qualità e materassini',
  "Trasferimenti da e per l'aeroporto internazionale del Kilimangiaro (JRO) e Moshi/Arusha",
  'Certificato di vetta al termine della scalata',
  "Briefing completo prima della scalata e controllo dell'attrezzatura",
]
const excludesVariantAIt = [
  'Voli internazionali e interni da/per la Tanzania',
  "Costi del visto per l'ingresso in Tanzania",
  'Mance per guide, portatori e cuoco',
  'Attrezzatura da trekking personale (sacco a pelo, bastoncini da trekking, abbigliamento)',
  "Assicurazione di viaggio (obbligatoria per la copertura medica e di evacuazione)",
  'Snack, bevande alcoliche e spese personali',
  "Notti d'hotel aggiuntive prima o dopo la scalata (facoltative)",
]

const includesVariantBIt = [
  "Tasse d'ingresso / diritti di ammissione",
  'Tasse di conservazione',
  "Tutte le attività menzionate nell'itinerario",
  "Tutti gli alloggi indicati nell'itinerario",
  'Tutti i trasporti',
  'Tutte le tasse / IVA del 18%',
  "Prelievo e riaccompagnamento in aeroporto",
  "Tutti i pasti indicati nell'itinerario",
]
const excludesVariantBIt = [
  'Qualsiasi volo internazionale o locale (andata e ritorno dal tuo paese)',
  'Mance (indicativamente: 10 $ USA a persona al giorno)',
  'Effetti personali (souvenir, assicurazione di viaggio, costi della domanda di visto, ecc.)',
  'Assicurazione di viaggio e rimpatrio medico',
  'Spese di natura personale',
]

// Day-body fragments reused verbatim across Machame (7d/6d), Lemosho (7d),
// and Umbwe (6d) — the English source repeats the exact same paragraphs too.
const bodyMachameGateToCampIt = [
  "Il tuo viaggio inizia con un tragitto di 45 minuti da Moshi fino a Machame Gate. Dopo la registrazione, il trek inizia lungo un sentiero tortuoso che attraversa una rigogliosa foresta pluviale, la zona più umida della montagna. Aspettati acquazzoni occasionali nel pomeriggio, che possono rendere il sentiero scivoloso.",
  'La salita si addolcisce progressivamente avvicinandosi a Machame Camp, situato alla transizione tra la foresta e le zone di brughiera gigante.',
]
const bodyMachameCampToShiraIt = [
  "La giornata inizia con una salita ripida lungo una cresta, che conduce a Picnic Rock, un punto panoramico fantastico che domina Kibo e il bordo frastagliato dell'altopiano di Shira.",
  "Il sentiero si appiana poi mentre attraversi l'altopiano di Shira, il terzo dei coni vulcanici del Kilimangiaro, prima di arrivare a Shira Camp, dove ti attendono splendide viste sulla montagna.",
]
const bodyShiraToBarrancoViaLavaTowerIt = [
  "Giornata di acclimatazione impegnativa ma essenziale, attraverserai un deserto d'alta quota in direzione della Lava Tower, alta 90 metri, un dicco vulcanico che offre viste panoramiche incredibili.",
  'Dopo pranzo, scendi nella valle di Barranco, dove crescono gli straordinari senecio giganti. Questa discesa prepara il tuo corpo alla scalata in vetta ad alta quota che ti attende. Barranco Camp si trova in una valle pittoresca e riparata, ai piedi della celebre Barranco Wall.',
]
const bodyBarrancoWallToKarangaIt = [
  "Inizia la giornata affrontando l'imponente Barranco Wall, una scalata emozionante ricompensata da viste mozzafiato.",
  'Dopo aver raggiunto la cima a 4.200 m, segui un sentiero pittoresco e ondulato intorno al fianco della montagna, con il monte Meru visibile sulla tua destra e Kibo che si staglia sulla tua sinistra.',
  'Una discesa nella valle di Karanga è seguita da una salita breve ma ripida fino a Karanga Camp, la tua tappa per la notte.',
]
const bodyKarangaToBarafuIt = [
  'Una salita costante al mattino conduce a Barafu Camp, che significa « ghiaccio » in swahili. Questo campo d\'alta quota si trova su una cresta sotto il cono sommitale e segna la fine del South Circuit del Kilimangiaro, offrendo viste spettacolari sulla vetta da diverse angolazioni.',
  'Arriverai in tempo per riposarti nel pomeriggio e cenare presto per prepararti alla notte di vetta.',
]
const bodySummitToMwekaIt = [
  'A mezzanotte inizia la tua salita finale verso la vetta. Il sentiero è ripido e impegnativo, con temperature ben al di sotto dello zero. All\'alba, la magnifica alba rossa dietro il picco Mawenzi ti terrà motivato.',
  'Raggiungendo Stella Point (5.750 m), camminerai lungo il bordo del cratere prima di arrivare a Uhuru Peak (5.895 m), il punto più alto d\'Africa!',
  "Dopo aver festeggiato il tuo successo in vetta, inizia la lunga discesa verso Mweka Camp, attraversando terreni variegati e fermandoti per pranzo lungo il percorso. Questa sera, gusterai la tua ultima cena in montagna.",
]
const bodyMwekaToGateIt = [
  "L'ultima discesa ti fa attraversare una rigogliosa foresta pluviale, con la possibilità di scorgere scimmie giocose lungo il cammino.",
  'A Mweka Gate, riceverai i tuoi certificati di vetta, e dal villaggio di Mweka sarai trasferito al tuo hotel a Moshi.',
]

// Shared safari FAQ block: 8 Q&A used identically in combos (9/10/11-day) and
// both standalone safaris; combos additionally prepend `safariExpectFaqIt`.
const safariExpectFaqIt: FaqIt = {
  question: 'Cosa posso aspettarmi da un safari in Tanzania con Asili Explorer?',
  answer:
    "I nostri safari in Tanzania offrono l'opportunità di esplorare l'incredibile fauna selvatica e i paesaggi magnifici del paese. Siamo specializzati in safari privati, il che significa che disponi di un 4×4 Landcruiser o di una jeep tutta per te. Hai la libertà di decidere quando inizia e finisce il safari, e le nostre guide esperte possono aiutarti a prendere questa decisione il giorno stesso della tua avventura. Che tu voglia osservare gli animali nel momento in cui sono più attivi, all'alba e al tramonto quando le temperature sono piacevoli, o che tu preferisca terminare la giornata a bordo piscina, la scelta è interamente tua. La fauna variegata della Tanzania è attiva in diversi momenti della giornata, quindi avrai numerose occasioni per osservare gli animali in azione.",
}
const sharedSafariFaqsIt: FaqIt[] = [
  {
    question: 'Garantite il prelievo e il riaccompagnamento in aeroporto?',
    answer:
      'Sì, garantiamo un inizio e una fine del viaggio senza intoppi grazie ai trasferimenti aeroportuali inclusi nelle nostre formule di safari — viaggia senza pensieri fin dal tuo arrivo!',
  },
  {
    question: 'Quali opzioni di alloggio offrite durante i vostri safari?',
    answer:
      'Dai lodge di fascia alta ai campi economici confortevoli, offriamo alloggi variegati adatti ai gusti di ogni viaggiatore, combinando comfort e immersione nel paesaggio selvaggio tanzaniano.',
  },
  {
    question: 'Ho bisogno di un visto per recarmi in Tanzania?',
    answer:
      'La maggior parte dei visitatori ha bisogno di un visto per esplorare la Tanzania. Ti consigliamo di verificare le ultime regole sui visti in base alla tua nazionalità prima di partire.',
  },
  {
    question: 'Cosa devo portare per un safari in Tanzania?',
    answer:
      'Prevedi abiti leggeri e comodi, un cappello da sole, crema solare, scarpe robuste e una buona fotocamera per catturare la magia del momento. Il nostro team sarà lieto di fornirti una guida completa ai bagagli!',
  },
  {
    question: 'I vostri safari sono adatti alle famiglie?',
    answer:
      'Sì, progettiamo formule di safari familiari ricche di attività che delizieranno grandi e piccini — perfette per una fuga di gruppo memorabile.',
  },
  {
    question: 'Potrò osservare i Big Five durante i vostri safari?',
    answer:
      'Assolutamente! I nostri itinerari ti portano in luoghi simbolo della fauna selvatica come il Serengeti e il cratere del Ngorongoro, aumentando le tue possibilità di avvistare gli emblematici Big Five.',
  },
  {
    question: 'Come posso pagare la mia prenotazione di safari?',
    answer:
      'Semplifichiamo le cose con opzioni di pagamento flessibili, inclusi bonifici bancari e carte di credito. Contatta il nostro team per conoscere le modalità di pagamento passo dopo passo.',
  },
  {
    question: 'Cosa succede se devo modificare o annullare il mio safari?',
    answer:
      'La vita è imprevedibile, lo sappiamo! Le nostre politiche di cancellazione o rinvio sono pensate per i viaggiatori, anche se le condizioni precise dipendono dai tempi — contattaci per discutere della tua prenotazione.',
  },
]
const comboPriceDisclaimerIt =
  "*Prezzo a persona, comprensivo di guida, veicolo da safari, hotel e tasse d'ingresso ai parchi, escluso il volo internazionale (sulla base di sei persone)"
const comboFaqsIt: FaqIt[] = [safariExpectFaqIt, ...sharedSafariFaqsIt]
const comboFaqHeadingIt = 'Le tue domande, le nostre risposte'
const comboFaqIntroIt =
  "Hai domande sulla prenotazione di un safari in Tanzania con noi? Consulta le nostre FAQ qui sotto per risposte rapide. Se non trovi quello che cerchi, non esitare a contattarci — i nostri esperti sono qui per aiutarti a pianificare l'avventura tanzaniana perfetta."

// FAQ fragments reused verbatim across several packages (mirrors the English
// source repeating the same Q&A text across Machame/Marangu/Umbwe variants).
const faqMachameDifficultyIt: FaqIt = {
  question: 'La route Machame è difficile?',
  answer:
    "La route Machame, spesso chiamata « Whiskey Route », ha un livello da moderato a difficile. È rinomata per la sua bellezza paesaggistica e la sua acclimatazione graduale, ma alcune sezioni ripide e giornate lunghe la rendono fisicamente impegnativa. Tuttavia, con il ritmo giusto, una buona preparazione fisica e determinazione, rimane accessibile alla maggior parte degli scalatori.",
}
const faqMachameLengthIt = (days: number): FaqIt => ({
  question: 'Quanto è lunga la route Machame?',
  answer: `La distanza totale di trekking per la route Machame in ${days} giorni è di circa 62 km. Offre un profilo di salita graduale e include una giornata di acclimatazione per aumentare i tassi di successo in vetta.`,
})
const faqBestTimeMachameIt: FaqIt = {
  question: 'Qual è il periodo migliore per scalare il Kilimangiaro tramite la route Machame?',
  answer:
    'Le stagioni migliori sono i mesi secchi da gennaio a marzo e da giugno a ottobre. Questi mesi offrono cieli più limpidi, meno precipitazioni e condizioni più stabili. Evita la grande stagione delle piogge (marzo-maggio) per un trek più sicuro e piacevole.',
}
const faqAccommodationTentsIt: FaqIt = {
  question: "Che tipo di alloggio è previsto?",
  answer:
    "L'alloggio lungo la route Machame avviene in campi tendati. Dormirai in tende di montagna di qualità montate dal team, con materassini confortevoli e tende-ristorante previste per i pasti. I campi sono ben organizzati e circondati da una natura magnifica.",
}
const faqSummitHeightIt: FaqIt = {
  question: "Qual è l'altitudine della vetta del Kilimangiaro?",
  answer:
    'Il punto più alto è Uhuru Peak, che si eleva a 5.895 metri sopra il livello del mare. È l\'obiettivo della spinta finale da Barafu Camp, raggiunto di notte e nelle prime ore del mattino.',
}
const faqSummitDayLengthIt: FaqIt = {
  question: 'Quanto dura il giorno della vetta?',
  answer:
    'Il giorno della vetta dura generalmente dalle 12 alle 14 ore, includendo la salita fino a Uhuru Peak e la discesa verso Mweka Camp. È una giornata difficile con aria rarefatta e temperature fredde, ma l\'alba mozzafiato e il senso di realizzazione rendono questo momento indimenticabile.',
}
const faqIncludedMachameIt: FaqIt = {
  question: 'Cosa è incluso nella scalata tramite la route Machame?',
  answer:
    'Una scalata di qualità comprende guide professionali, portatori, tende, pasti, tasse di parco e trasferimenti. La maggior parte dei pacchetti include anche un accompagnamento per l\'acclimatazione, un certificato di vetta e acqua potabile sicura. Assicurati di verificare il dettaglio delle prestazioni incluse.',
}
const faqAltitudeSicknessMachameIt: FaqIt = {
  question: 'Il mal acuto di montagna è frequente?',
  answer:
    'Sì, è una preoccupazione reale. La salita graduale della route Machame e una giornata di acclimatazione supplementare riducono il rischio, ma sintomi come mal di testa e nausea possono comunque verificarsi. Rimanere idratati, adattare il proprio ritmo e ascoltare la propria guida sono essenziali.',
}
const faqPreparationMachameIt: FaqIt = {
  question: 'Come mi preparo per la route Machame?',
  answer:
    "L'allenamento è importante. Concentrati sul cardio (escursionismo, corsa, bicicletta) e sul rafforzamento muscolare (gambe e core). Allenati a camminare con uno zaino carico, e includi lunghe camminate in giorni consecutivi per sviluppare la tua resistenza. Si consiglia anche la simulazione dell'altitudine e la pratica dell'idratazione.",
}

interface TripIt {
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
  itinerary: ItineraryDayIt[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqIt[]
  hubSummary: string
  hubImage: Img
}

async function seedTripIt(data: TripIt) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await dayToDoc(stop))
  await upsertTripIt(data.slug, {
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

interface SafariIt {
  slug: string
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  overviewBody: string[]
  gallery: Img[]
  mapImage?: Img
  itinerary: SafariDayIt[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqIt[]
}

// ---------------------------------------------------------------------------
// 9 Kilimanjaro packages
// ---------------------------------------------------------------------------

const machame7It: TripIt = {
  slug: '7-days-machame-route',
  category: 'package',
  name: '7 Giorni Route Machame',
  durationDays: 7,
  seoTitle: '7 Giorni Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 7 Giorni Route Machame.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp e Mweka Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "Soprannominata la « Whiskey Route », la route Machame è l'itinerario più popolare per scalare il Kilimangiaro, scelto da quasi la metà degli escursionisti ogni anno. Questo itinerario panoramico affronta il Monte Kilimangiaro da sud, scalando i fianchi meridionali mozzafiato prima di ridiscendere tramite la route Mweka. Lungo il percorso, gli scalatori vengono ricompensati con alcune delle albe e dei tramonti più mozzafiato del Kilimangiaro.",
    "Estendendosi per 62 km, l'itinerario viene generalmente percorso in sei giorni, sebbene un itinerario di sette giorni sia vivamente consigliato per una migliore acclimatazione — aumentando significativamente i tassi di successo in vetta. Per chi cerca un'avventura indimenticabile su un terreno impegnativo ma gratificante, la route Machame è una scelta eccellente.",
  ],
  mapImage: {src: '/images/packages/7-days-machame-route/hero.jpg', alt: 'Mappa della route Machame in 7 giorni'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit in 9 giorni'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai in 7 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Machame Gate a Machame Camp',
      location: 'Machame Gate (1.800 m/5.900 piedi) → Machame Camp (3.000 m/9.800 piedi)',
      meta: ['Dislivello positivo: 1.200 m / 3.900 piedi', 'Durata: 6-7 ore'],
      body: bodyMachameGateToCampIt,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/7-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/7-days-machame-route/day1-machame-2.jpg',
        alt: 'Ponte sul sentiero nella foresta pluviale in direzione di Machame Camp',
      },
    },
    {
      day: 2,
      label: 'Da Machame Camp a Shira Camp',
      location: 'Machame Camp (3.000 m/9.800 piedi) → Shira Camp (3.840 m/12.600 piedi)',
      meta: ['Dislivello positivo: 840 m / 2.800 piedi', 'Durata: 5-6 ore'],
      body: bodyMachameCampToShiraIt,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day2-shira-2.jpg', alt: 'Altopiano di Shira'},
    },
    {
      day: 3,
      label: 'Da Shira Camp a Barranco Camp via Lava Tower',
      location: 'Shira Camp (3.840 m/12.600 piedi) → Lava Tower (4.550 m/14.900 piedi) → Barranco Camp (3.850 m/12.650 piedi)',
      meta: ['Dislivello positivo: 710 m / 2.300 piedi', 'Dislivello negativo: 700 m / 2.250 piedi', 'Durata: 6-7 ore'],
      body: bodyShiraToBarrancoViaLavaTowerIt,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day3-lava-tower.jpg', alt: 'Lava Tower con le tende del campo'},
    },
    {
      day: 4,
      label: 'Da Barranco Camp a Karanga Camp via la Barranco Wall',
      location:
        'Barranco Camp (3.850 m/12.600 piedi) → Barranco Wall (4.200 m/13.800 piedi) → Karanga Camp (3.950 m/13.000 piedi)',
      meta: ['Dislivello positivo: 350 m / 1.150 piedi', 'Dislivello negativo: 250 m / 820 piedi', 'Durata: 3-4 ore'],
      body: bodyBarrancoWallToKarangaIt,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-machame-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day4-karanga-2.jpg', alt: 'Valle di Karanga'},
    },
    {
      day: 5,
      label: 'Da Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (3.950 m/13.000 piedi) → Barafu Camp (4.600 m/15.100 piedi)',
      meta: ['Dislivello positivo: 650 m / 2.150 piedi', 'Durata: 3-4 ore'],
      body: bodyKarangaToBarafuIt,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-machame-route/day5-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day5-barafu-2.jpg', alt: 'Sentiero verso Barafu Camp'},
    },
    {
      day: 6,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      location:
        'Barafu Camp (4.600 m/15.100 piedi) → Uhuru Peak (5.895 m/19.300 piedi) → Mweka Camp (3.110 m/10.200 piedi)',
      meta: [
        'Dislivello positivo: 1.295 m / 4.200 piedi',
        'Dislivello negativo: 2.785 m / 9.100 piedi',
        'Salita alla vetta: 6-8 ore',
        'Discesa: 6 ore',
      ],
      body: bodySummitToMwekaIt,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-machame-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day6-mweka-2.jpg', alt: 'Tende di Mweka Camp'},
    },
    {
      day: 7,
      label: 'Da Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 piedi) → Mweka Gate (1.830 m/6.000 piedi)',
      meta: ['Dislivello negativo: 1.280 m / 4.220 piedi', 'Durata: 2-3 ore'],
      body: bodyMwekaToGateIt,
      image: {
        src: '/images/packages/7-days-machame-route/day7-mweka-gate.jpg',
        alt: 'Celebrazione del certificato di vetta a Mweka Gate',
      },
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: 'FAQ Route Machame in 7 Giorni',
  faqs: [
    faqMachameDifficultyIt,
    faqMachameLengthIt(7),
    faqBestTimeMachameIt,
    faqAccommodationTentsIt,
    faqSummitHeightIt,
    faqSummitDayLengthIt,
    faqIncludedMachameIt,
    faqAltitudeSicknessMachameIt,
    faqPreparationMachameIt,
    {
      question: 'Qual è il tasso di successo per la route Machame in 7 giorni?',
      answer:
        "Il tasso di successo è elevato — tra l'85% e il 90% per scalate ben organizzate con guide esperte. La giornata supplementare di acclimatazione migliora notevolmente le tue possibilità di raggiungere la vetta in sicurezza.",
    },
  ],
  hubSummary:
    "Percorri la popolare route Machame, con una durata totale di sette giorni, offrendoti così ancora più tempo di acclimatazione",
  hubImage: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Route Machame in 7 giorni'},
}

const machame6It: TripIt = {
  slug: '6-days-machame-route',
  category: 'package',
  name: '6 Giorni Route Machame',
  durationDays: 6,
  seoTitle: '6 Giorni Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 6 Giorni Route Machame.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp e Mweka Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Machame in 6 giorni è uno degli itinerari più popolari e panoramici del Kilimangiaro, rinomato per i suoi paesaggi variegati e i suoi solidi tassi di successo in vetta. Soprannominata la « Whiskey Route », è preferita dagli escursionisti in cerca di una scalata impegnativa ma gratificante. Sebbene leggermente più breve della versione in 7 giorni, offre comunque un'eccellente acclimatazione grazie al suo profilo « salire in alto, dormire in basso ». Questo itinerario ti fa attraversare rigogliose foreste pluviali, brughiere, deserti alpini, e infine la zona sommitale artica di Uhuru Peak (5.895 m).",
    "Se cerchi una scalata memorabile e ben ritmata con meno giorni in montagna, la route Machame in 6 giorni è una scelta eccellente.",
  ],
  mapImage: {src: '/images/packages/6-days-machame-route/hero.jpg', alt: 'Mappa della route Machame in 6 giorni'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit in 9 giorni'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai in 7 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Machame Gate a Machame Camp',
      location: 'Machame Gate (1.800 m/5.900 piedi) → Machame Camp (3.000 m/9.800 piedi)',
      meta: ['Dislivello positivo: 1.200 m / 3.900 piedi', 'Durata: 6-7 ore'],
      body: bodyMachameGateToCampIt,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/6-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/6-days-machame-route/day1-machame-2.jpg',
        alt: 'Ponte sul sentiero nella foresta pluviale in direzione di Machame Camp',
      },
    },
    {
      day: 2,
      label: 'Da Machame Camp a Shira Camp',
      location: 'Machame Camp (3.000 m/9.800 piedi) → Shira Camp (3.840 m/12.600 piedi)',
      meta: ['Dislivello positivo: 840 m / 2.800 piedi', 'Durata: 5-6 ore'],
      body: bodyMachameCampToShiraIt,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/6-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day2-shira-2.jpg', alt: 'Altopiano di Shira'},
    },
    {
      day: 3,
      label: 'Da Shira Camp a Barranco Camp via Lava Tower',
      location: 'Shira Camp (3.840 m/12.600 piedi) → Lava Tower (4.550 m/14.900 piedi) → Barranco Camp (3.850 m/12.650 piedi)',
      meta: ['Dislivello positivo: 710 m / 2.300 piedi', 'Dislivello negativo: 700 m / 2.250 piedi', 'Durata: 6-7 ore'],
      body: bodyShiraToBarrancoViaLavaTowerIt,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day3-barranco-2.jpg', alt: 'Valle di Barranco'},
    },
    {
      day: 4,
      label: 'Da Barranco Camp a Barafu Camp',
      location: 'Barranco Camp (3.960 m) a Barafu Camp (4.640 m)',
      meta: ['Dislivello positivo: 680 m (2.231 piedi)', 'Durata: 7-9 ore'],
      body: [
        "Inizia con la scalata esaltante della Barranco Wall, una salita avventurosa che offre viste gratificanti. Il sentiero poi serpeggia attraverso paesaggi di deserto alpino, attraversando la valle di Karanga prima di raggiungere Barafu Camp. Qui riposerai presto e ti preparerai per la spinta verso la vetta prima dell'alba.",
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-machame-route/day4-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day4-barafu-2.jpg', alt: 'Sentiero verso Barafu Camp'},
    },
    {
      day: 5,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      location:
        'Barafu Camp (4.640 m/15.223 piedi) → Uhuru Peak (5.895 m/19.341 piedi) → Mweka Camp (3.080 m/10.105 piedi)',
      meta: ['Dislivello positivo: 1.255 m / 4.117 piedi', 'Dislivello negativo: 2.815 m / 9.236 piedi', 'Durata: 12-14 ore'],
      body: [
        "Il giorno della vetta inizia sotto un cielo stellato, con una salita a mezzanotte verso Stella Point e poi verso Uhuru Peak — il punto più alto d'Africa. Assisti a un'alba indimenticabile dalla vetta, poi inizia la lunga discesa verso Mweka Camp. Scoprirai una grande varietà di paesaggi e climi in un solo giorno.",
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-machame-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day5-mweka-2.jpg', alt: 'Baite di Mweka Camp'},
    },
    {
      day: 6,
      label: 'Da Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.080 m/10.105 piedi) → Mweka Gate (1.640 m/5.381 piedi)',
      meta: ['Dislivello negativo: 1.440 m / 4.724 piedi', 'Durata: 3-4 ore'],
      body: [
        'Il tuo ultimo trek scende attraverso sentieri di foresta pluviale verdeggiante fino a Mweka Gate, dove festeggerai il tuo successo, riceverai i tuoi certificati di vetta e saluterai il tuo team di montagna.',
      ],
      image: {src: '/images/packages/6-days-machame-route/day6-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureIt,
  ],
  includes: includesVariantAIt,
  excludes: [...excludesVariantAIt, 'Noleggio di servizi igienici portatili (se non previsto in anticipo)'],
  faqHeading: 'FAQ Route Machame in 6 Giorni',
  faqs: [
    faqMachameDifficultyIt,
    faqMachameLengthIt(6),
    faqBestTimeMachameIt,
    faqAccommodationTentsIt,
    faqSummitHeightIt,
    faqSummitDayLengthIt,
    faqIncludedMachameIt,
    faqAltitudeSicknessMachameIt,
    faqPreparationMachameIt,
    {
      question: 'Qual è il tasso di successo per la route Machame in 6 giorni?',
      answer:
        "Il tasso di successo è elevato — tra l'80% e l'85% per scalate ben organizzate con guide esperte. La giornata supplementare di acclimatazione migliora notevolmente le tue possibilità di raggiungere la vetta in sicurezza.",
    },
  ],
  hubSummary: "La route Machame, spesso chiamata « Whiskey Route », è uno degli itinerari più panoramici e variegati del Kilimangiaro.",
  hubImage: {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 6 giorni'},
}

// FAQ fragments shared between the 5-day and 6-day Marangu packages.
const faqMaranguDaysIt: FaqIt = {
  question: 'Quanti giorni ci vogliono per percorrere la route Marangu?',
  answer:
    "L'itinerario standard richiede 5 o 6 giorni, con la versione di 6 giorni fortemente consigliata. Il giorno supplementare consente una migliore acclimatazione, migliorando le tue possibilità di raggiungere Uhuru Peak con successo.",
}
const faqMaranguEasiestIt: FaqIt = {
  question: 'La route Marangu è il modo più facile per scalare il Monte Kilimangiaro?',
  answer:
    "Viene spesso presentata come la route « più facile » grazie alle sue pendenze dolci e al suo alloggio in rifugi — ma non lasciarti ingannare. Il tempo di acclimatazione più breve la rende meno clemente nei confronti del mal acuto di montagna, quindi la preparazione è essenziale.",
}
const faqMaranguCocaColaIt: FaqIt = {
  question: 'Perché la route Marangu è chiamata « Coca-Cola Route »?',
  answer:
    'Perché è l\'unico itinerario del Kilimangiaro dove si dorme in rifugi permanenti anziché in tenda — e la Coca-Cola veniva un tempo venduta in alcuni punti di sosta. È un soprannome che riflette il comfort relativo rispetto agli itinerari in campeggio.',
}
const faqMaranguDistanceIt: FaqIt = {
  question: 'Qual è la distanza e il dislivello della route Marangu?',
  answer:
    "L'itinerario copre circa 72 km andata e ritorno. Il dislivello positivo è di circa 4.005 metri, da Marangu Gate (1.860 m) fino alla vetta (5.895 m), per poi ridiscendere lungo lo stesso sentiero.",
}
const faqMaranguAccommodationIt: FaqIt = {
  question: 'Che tipo di alloggio è disponibile sulla route Marangu?',
  answer:
    "Dormirai in rifugi condivisi a forma di A con letti a castello. Ogni rifugio dispone di camere in stile dormitorio, illuminazione solare e servizi igienici comuni di base. È una buona opzione se preferisci non campeggiare all'aperto.",
}
const faqMaranguCrowdedIt: FaqIt = {
  question: 'La route Marangu è molto frequentata?',
  answer:
    "È uno degli itinerari più popolari, in particolare tra gli escursionisti attenti al budget. Poiché lo stesso sentiero viene utilizzato sia per la salita che per la discesa, incontrerai spesso altri gruppi che procedono in entrambe le direzioni.",
}
const faqMaranguSuccessRateIt: FaqIt = {
  question: 'Qual è il tasso di successo per le scalate tramite la route Marangu?',
  answer:
    "I tassi di successo per l'itinerario di 5 giorni sono relativamente bassi a causa di un'acclimatazione insufficiente. Tuttavia, la versione in 6 giorni ha un tasso di successo molto migliore, soprattutto se prendi il tuo tempo e ti idrati bene.",
}
const faqMaranguSuitedForIt: FaqIt = {
  question: 'A chi si addice meglio la route Marangu?',
  answer:
    "La route Marangu è ideale per gli escursionisti principianti che preferiscono il comfort dei rifugi, viaggiano durante la stagione delle piogge, o desiderano un itinerario più breve con una logistica semplificata. Non è ideale per chi cerca la solitudine o un'esperienza di natura selvaggia isolata.",
}

const marangu5It: TripIt = {
  slug: '5-days-marangu-route',
  category: 'package',
  name: '5 Giorni Route Marangu',
  durationDays: 5,
  seoTitle: '5 Giorni Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 5 Giorni Route Marangu.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in rifugio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "Conosciuta come la « Coca-Cola Route », la route Marangu è l'itinerario più consolidato e confortevole verso la vetta del Monte Kilimangiaro. È l'unico itinerario che offre un alloggio in rifugi, il che lo rende una scelta popolare per chi cerca un'esperienza di trek meno rude. Il sentiero offre pendenze dolci attraverso una rigogliosa foresta pluviale, brughiere e un deserto alpino prima di raggiungere la vetta ghiacciata di Uhuru Peak. È ideale per gli escursionisti principianti o per chi cerca una scalata più semplice.",
    "Route Marangu in 5 Giorni — una scalata più rapida, ideale per escursionisti esperti o per chi ha poco tempo a disposizione. Comprende: Giorno 1: da Marangu Gate a Mandara Hut (foresta pluviale); Giorno 2: da Mandara Hut a Horombo Hut (brughiera); Giorno 3: da Horombo Hut a Kibo Hut (deserto alpino); Giorno 4: spinta verso la vetta a mezzanotte fino a Uhuru Peak, poi discesa verso Horombo Hut; Giorno 5: ritorno a Marangu Gate.",
  ],
  mapImage: {src: '/images/packages/5-days-marangu-route/hero.jpg', alt: 'Rifugi di montagna della route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
    {src: '/images/packages/5-days-marangu-route/horombo-2.jpeg', alt: 'Horombo Hut'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Marangu Gate a Mandara Hut',
      location: 'Altitudine: 1.860 m → 2.700 m',
      meta: ['Dislivello positivo: 830 m / 2.723 piedi', 'Durata: 4-5 ore'],
      body: [
        "Il tuo trek inizia con un tragitto in auto da Moshi fino a Marangu Gate. Dopo la registrazione, entrerai nella rigogliosa foresta pluviale e inizierai la tua escursione lungo un sentiero ben curato. Il percorso è spesso umido e ombreggiato, con alberi ricoperti di muschio, uccelli che cinguettano e scimmie giocose lungo il cammino.",
        "Raggiungerai Mandara Hut nel tardo pomeriggio. Se il tempo e l'energia lo permettono, fai una breve camminata fino al cratere Maundi per viste magnifiche sul Kenya e sul nord della Tanzania.",
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/5-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day1-mandara-2.jpg', alt: 'Baite di Mandara Hut'},
    },
    {
      day: 2,
      label: 'Da Mandara Hut a Horombo Hut',
      location: 'Altitudine: 2.700 m → 3.720 m',
      meta: ['Dislivello positivo: 1.020 m / 3.346 piedi', 'Durata: 6-7 ore'],
      body: [
        'Lasciandoti alle spalle la foresta pluviale, entrerai nella zona di brughiera, dove il paesaggio cambia radicalmente. Il sentiero sale costantemente attraverso un terreno aperto pieno di senecio giganti e lobelie.',
        'Lungo il percorso, avrai la tua prima vista completa sui picchi Kibo e Mawenzi. Horombo Hut ti aspetta con viste mozzafiato e l\'occasione di incontrare altri escursionisti.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day2-horombo-2.jpg', alt: 'Baite di Horombo Hut'},
    },
    {
      day: 3,
      label: 'Da Horombo Hut a Kibo Hut',
      location: 'Altitudine: 3.720 m → 4.703 m',
      meta: ['Dislivello positivo: 983 m / 3.226 piedi', 'Durata: 6-7 ore'],
      body: [
        "L'itinerario di oggi è lungo e secco, attraversando il deserto alpino. Camminerai attraverso la sella tra i picchi Mawenzi e Kibo, un vasto paesaggio arido con viste spettacolari. L'aria è più rarefatta, quindi cammina lentamente e resta idratato.",
        'Raggiungerai Kibo Hut nel primo pomeriggio — riposati presto e preparati per il tentativo di vetta che inizia a mezzanotte.',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day3-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day3-kibo-2.jpg', alt: 'Edificio in pietra di Kibo Hut'},
    },
    {
      day: 4,
      label: 'Da Kibo Hut a Uhuru Peak e poi a Horombo Hut',
      location: 'Altitudine: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
      meta: ['Dislivello positivo: 1.192 m / 3.911 piedi (salita), poi discesa', 'Durata: 11-14 ore'],
      body: [
        "La tua salita verso la vetta inizia nelle prime ore, camminando nell'oscurità attraverso tornanti e ghiaione fino a Gilman's Point (5.685 m), poi lungo il bordo del cratere fino a Uhuru Peak — il tetto dell'Africa.",
        "Dopo aver immortalato il tuo momento in vetta, ridiscendi a Kibo Hut per una breve pausa, poi continua verso Horombo Hut per una notte di sonno ben meritato.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day4-horombo-hut-return.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day4-horombo-3.jpg', alt: 'Baite di Horombo Hut'},
    },
    {
      day: 5,
      label: 'Da Horombo Hut a Marangu Gate',
      location: 'Altitudine: 3.720 m → 1.860 m',
      meta: ['Dislivello negativo: 1.850 m / 6.070 piedi', 'Durata: 6-7 ore'],
      body: [
        "Per la tua ultima giornata, scendi attraverso la brughiera e la rigogliosa foresta pluviale per tornare al punto di partenza. Il sentiero è più facile in discesa, ma fai attenzione a dove metti i piedi nelle sezioni umide.",
        "All'ingresso del parco, riceverai il tuo certificato di vetta prima di tornare a Moshi — stanco ma fiero.",
      ],
      image: {src: '/images/packages/5-days-marangu-route/day5-marangu-gate.jpg', alt: "Scalatori vicino alla vetta all'alba"},
    },
    departureIt,
  ],
  includes: includesVariantAIt,
  excludes: excludesVariantAIt,
  faqHeading: 'FAQ Route Marangu in 5 Giorni',
  faqIntro:
    'Hai domande sulla scalata del Kilimangiaro con noi? Consulta le nostre FAQ qui sotto per informazioni utili.',
  faqs: [
    faqMaranguDaysIt,
    faqMaranguEasiestIt,
    faqMaranguCocaColaIt,
    faqMaranguDistanceIt,
    faqMaranguAccommodationIt,
    faqMaranguCrowdedIt,
    faqMaranguSuccessRateIt,
    faqMaranguSuitedForIt,
  ],
  hubSummary:
    "Un viaggio di cinque giorni per scalare la vetta più alta d'Africa, tramite la popolare route Marangu. Aspettati una varietà di paesaggi…",
  hubImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Route Marangu in 5 giorni'},
}

const marangu6It: TripIt = {
  slug: '6-days-marangu-route',
  category: 'package',
  name: '6 Giorni Route Marangu',
  durationDays: 6,
  seoTitle: '6 Giorni Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 6 Giorni Route Marangu.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in rifugio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Marangu, spesso soprannominata la « Coca-Cola Route », è l'unico itinerario del Kilimangiaro che offre un alloggio in rifugi anziché in campeggio. Con il suo sentiero ben tracciato e il suo comfort supplementare, è una scelta popolare per gli escursionisti in cerca di una scalata panoramica ma semplice verso la vetta del picco più alto d'Africa.",
    "Questa versione in 6 giorni lascia più tempo per l'acclimatazione rispetto al trek di 5 giorni, il che aumenta il tuo tasso di successo in vetta. Attraverserai zone di vegetazione distinte, dalla foresta pluviale al deserto alpino, prima di concludere con una spinta a mezzanotte verso Uhuru Peak via Gilman's Point.",
  ],
  mapImage: {src: '/images/packages/6-days-marangu-route/hero.jpg', alt: 'Rifugi di montagna della route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/routes/marangu/hero.jpg', alt: 'Rifugio della route Marangu'},
    {src: '/images/packages/shared/card-6-days-marangu-alt.webp', alt: 'Route Marangu in 6 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      location: 'Altitudine: 1.860 m → 2.700 m',
      meta: ['Dislivello positivo: 840 m (2.755 piedi)', 'Durata: 4-5 ore'],
      body: [
        "Inizia il tuo viaggio attraverso una rigogliosa foresta pluviale popolata da colobi e una flora vibrante. Dopo una salita costante, raggiungerai Mandara Hut per la tua prima notte in montagna.",
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/6-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day1-mandara-2.jpg', alt: 'Baite di Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      location: 'Altitudine: 2.700 m → 3.720 m',
      meta: ['Dislivello positivo: 1.020 m (3.346 piedi)', 'Durata: 6-7 ore'],
      body: [
        'Uscendo dalla foresta, il sentiero si trasforma in brughiera ed erica. Lungo il percorso, goditi le viste sui picchi Kibo e Mawenzi.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day2-horombo-2.jpg', alt: 'Baite di Horombo Hut'},
    },
    {
      day: 3,
      label: 'Acclimatazione a Horombo Hut',
      location: 'Altitudine: 3.720 m → 4.000 m (Zebra Rocks) → 3.720 m',
      meta: ['Dislivello positivo: 280 m (918 piedi)', 'Dislivello negativo: 280 m (918 piedi)', 'Durata: 2-3 ore (escursione facoltativa)'],
      body: [
        "Una giornata di acclimatazione essenziale per aiutare il tuo corpo ad adattarsi. Puoi fare una breve escursione fino a Zebra Rocks e tornare per pranzare e riposarti a Horombo.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day3-horombo-acclimatization.jpg', alt: 'Cartello di Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      location: 'Altitudine: 3.720 m → 4.703 m',
      meta: ['Dislivello positivo: 983 m (3.225 piedi)', 'Durata: 6-7 ore'],
      body: [
        'Il trek di oggi ti fa attraversare un terreno di deserto alpino in direzione del campo base a Kibo Hut. Riposati presto per prepararti alla notte di vetta.',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day4-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day4-kibo-2.jpg', alt: 'Edificio in pietra di Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      location: 'Altitudine: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
      meta: ['Dislivello positivo: 1.192 m (3.910 piedi)', 'Dislivello negativo: 2.175 m (7.136 piedi)', 'Durata: 12-14 ore'],
      body: [
        "Inizia la tua spinta verso la vetta subito dopo mezzanotte, raggiungendo Gilman's Point e poi Uhuru Peak all'alba. Dopo aver festeggiato in vetta, scendi verso Horombo Hut per la tua ultima notte.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day5-horombo-3.jpg', alt: 'Horombo Hut al tramonto'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Trasferimento',
      location: 'Altitudine: 3.720 m → 1.860 m',
      meta: ['Dislivello negativo: 1.860 m (6.102 piedi)', 'Durata: 5-6 ore'],
      body: [
        "Scendi attraverso la brughiera e la foresta pluviale fino all'ingresso del parco. Dopo aver ricevuto il tuo certificato di vetta, sarai trasferito al tuo hotel.",
      ],
      overnightStay: 'Hotel a Moshi/Arusha (incluso)',
      image: {src: '/images/packages/6-days-marangu-route/day6-marangu-gate.jpg', alt: 'Marangu Gate'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day6-kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'},
    },
    departureIt,
  ],
  includes: [
    "Tasse d'ingresso al parco",
    "Tutti i pasti e l'acqua durante il trek",
    'Alloggio in rifugio (Mandara, Horombo, Kibo)',
    'Trasporto privato da/per Marangu Gate',
    'Soggiorni in hotel prima e dopo la scalata (1 notte ciascuno)',
    'Guide di montagna certificate, cuoco e portatori',
    'Bombola di ossigeno e kit di primo soccorso',
    'Tasse governative e IVA',
    'Certificato di vetta',
    'Tassa di soccorso',
  ],
  excludes: [
    'Voli internazionali e interni',
    'Visto tanzaniano',
    'Mance per guide e portatori',
    'Assicurazione di viaggio',
    'Attrezzatura da trekking personale (disponibile a noleggio)',
    'Snack e bevande supplementari',
    "Notti d'hotel aggiuntive prima/dopo la scalata",
  ],
  faqHeading: 'Hai domande sulla scalata del Kilimangiaro con noi?',
  faqIntro:
    'Consulta le nostre FAQ qui sotto per informazioni utili. Se non trovi la risposta che cerchi, non esitare a contattarci — i nostri esperti del Kilimangiaro sono pronti ad aiutarti a pianificare ogni tappa della tua avventura indimenticabile.',
  faqs: [
    faqMaranguDaysIt,
    faqMaranguEasiestIt,
    faqMaranguCocaColaIt,
    faqMaranguDistanceIt,
    faqMaranguAccommodationIt,
    faqMaranguCrowdedIt,
    faqMaranguSuccessRateIt,
    {
      question: 'Qual è il periodo migliore per scalare la route Marangu?',
      answer:
        "I mesi migliori sono da gennaio a inizio marzo e da giugno a ottobre, quando le condizioni meteorologiche sono più stabili e i sentieri asciutti. Tuttavia, il sistema di rifugi di Marangu la rende un'opzione praticabile anche durante le stagioni delle piogge.",
    },
    {
      question: 'Cosa devo portare per un trek sulla route Marangu?',
      answer:
        "Abbigliamento a strati per tutte le fasce di temperatura, un sacco a pelo 4 stagioni, un berretto caldo e guanti, bastoncini da trekking, articoli da toeletta personali e una lampada frontale sono essenziali. Avrai anche bisogno di un piccolo zaino giornaliero, poiché i portatori si occuperanno del tuo borsone principale.",
    },
    faqMaranguSuitedForIt,
  ],
  hubSummary:
    "Un viaggio di sei giorni per scalare la vetta più alta d'Africa, tramite la popolare route Marangu. Aspettati una varietà di paesaggi…",
  hubImage: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Route Marangu in 6 giorni'},
}

const lemosho7It: TripIt = {
  slug: '7-days-lemosho-route',
  category: 'package',
  name: '7 Giorni Route Lemosho',
  durationDays: 7,
  seoTitle: '7 Giorni Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 7 Giorni Route Lemosho.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira 2 Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp e Mweka Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Lemosho è rinomata per la sua bellezza paesaggistica e il suo eccellente profilo di acclimatazione, il che la rende una scelta di primo piano per gli escursionisti in cerca di una scalata più graduale e gratificante. Partendo dal lato ovest del Kilimangiaro, questo itinerario attraversa rigogliose foreste pluviali, vaste brughiere e alti deserti alpini, offrendo viste mozzafiato sulla montagna e sui paesaggi circostanti.",
    "Con un tasso di successo più elevato rispetto a molti altri itinerari, la route Lemosho in 7 giorni è ideale per chi cerca sia una sfida sia l'occasione di godersi gli ambienti variegati del Kilimangiaro.",
  ],
  mapImage: {src: '/images/packages/7-days-lemosho-route/hero.png', alt: 'Mappa della route Lemosho al Kilimangiaro'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit in 9 giorni'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai in 7 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Lemosho Gate a Mti Mkubwa Camp',
      location: 'Lemosho Gate (2.100 m/6.890 piedi) → Mti Mkubwa (2.650 m/8.694 piedi)',
      meta: ['Dislivello positivo: 550 m / 1.804 piedi', 'Durata: 3-4 ore'],
      body: [
        "Entra nell'incantevole foresta montana, dove alberi imponenti e i suoni della fauna selvatica ti circondano. Un trek relativamente dolce ti conduce a Mti Mkubwa Camp, dove trascorrerai la tua prima notte in montagna.",
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Da Mti Mkubwa a Shira 2 Camp',
      location: 'Mti Mkubwa Camp (2.650 m/8.694 piedi) → Shira 2 Camp (3.850 m/12.631 piedi)',
      meta: ['Dislivello positivo: 1.200 m (3.937 piedi)', 'Durata: 7-8 ore'],
      body: [
        "Il lungo trek di oggi ti conduce dalla foresta al vasto altopiano di Shira. Sali attraverso brughiere che offrono viste magnifiche prima di raggiungere Shira 2 Camp, dove la grandiosità dei picchi del Kilimangiaro si rivela pienamente.",
      ],
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day2-shira-2.jpg', alt: 'Campo di Shira Camp'},
    },
    {
      day: 3,
      label: 'Da Shira 2 Camp a Barranco Camp via Lava Tower',
      location: 'Shira 2 Camp (3.840 m/12.600 piedi) → Lava Tower (4.550 m/14.900 piedi) → Barranco Camp (3.850 m/12.650 piedi)',
      meta: ['Dislivello positivo: 710 m / 2.300 piedi', 'Dislivello negativo: 700 m / 2.250 piedi', 'Durata: 6-7 ore'],
      body: bodyShiraToBarrancoViaLavaTowerIt,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day3-lava-tower.jpg', alt: 'Lava Tower con le tende del campo'},
    },
    {
      day: 4,
      label: 'Da Barranco Camp a Karanga Camp via la Barranco Wall',
      location:
        'Barranco Camp (3.850 m/12.600 piedi) → Barranco Wall (4.200 m/13.800 piedi) → Karanga Camp (3.950 m/13.000 piedi)',
      meta: ['Dislivello positivo: 350 m / 1.150 piedi', 'Dislivello negativo: 250 m / 820 piedi', 'Durata: 3-4 ore'],
      body: bodyBarrancoWallToKarangaIt,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day4-karanga-2.jpg', alt: 'Valle di Karanga'},
    },
    {
      day: 5,
      label: 'Da Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (3.950 m/13.000 piedi) → Barafu Camp (4.600 m/15.100 piedi)',
      meta: ['Dislivello positivo: 650 m / 2.150 piedi', 'Durata: 3-4 ore'],
      body: bodyKarangaToBarafuIt,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day5-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day5-barafu-2.jpg', alt: 'Sentiero verso Barafu Camp'},
    },
    {
      day: 6,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      location:
        'Barafu Camp (4.600 m/15.100 piedi) → Uhuru Peak (5.895 m/19.300 piedi) → Mweka Camp (3.110 m/10.200 piedi)',
      meta: [
        'Dislivello positivo: 1.295 m / 4.200 piedi',
        'Dislivello negativo: 2.785 m / 9.100 piedi',
        'Salita alla vetta: 6-8 ore',
        'Discesa: 6 ore',
      ],
      body: bodySummitToMwekaIt,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day6-mweka-2.jpg', alt: 'Tende di Mweka Camp'},
    },
    {
      day: 7,
      label: 'Da Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 piedi) → Mweka Gate (1.830 m/6.000 piedi)',
      meta: ['Dislivello negativo: 1.280 m / 4.220 piedi', 'Durata: 2-3 ore'],
      body: bodyMwekaToGateIt,
      image: {
        src: '/images/packages/7-days-lemosho-route/day7-mweka-gate.jpg',
        alt: 'Celebrazione del certificato di vetta a Mweka Gate',
      },
    },
    departureIt,
  ],
  includes: [...includesVariantAIt, 'Trasferimenti verso Lemosho Gate e da Mweka Gate'],
  excludes: excludesVariantAIt,
  faqHeading: 'FAQ Route Lemosho in 7 Giorni',
  faqs: [
    {
      question: 'La route Lemosho in 7 giorni è adatta ai principianti?',
      answer:
        "Sì. Sebbene il Kilimangiaro rappresenti una sfida seria, la route Lemosho offre una scalata graduale, lasciando più tempo per l'acclimatazione. Questo la rende uno dei migliori itinerari, sia per i principianti che per gli escursionisti esperti.",
    },
    {
      question: 'Qual è il tasso di successo per raggiungere la vetta tramite la route Lemosho in 7 giorni?',
      answer:
        "Il tasso di successo è molto elevato — circa l'85% o più. La sua durata più lunga e il suo dislivello graduale migliorano notevolmente l'acclimatazione e aumentano le possibilità di raggiungere Uhuru Peak.",
    },
    {
      question: 'Quante ore camminerò ogni giorno?',
      answer:
        "La maggior parte dei giorni di trek comporta dalle 4 alle 7 ore di cammino. Tuttavia, il giorno della vetta è molto più lungo, con una durata di 12-14 ore andata e ritorno (salita e discesa).",
    },
    {
      question: 'Qual è la distanza totale della route Lemosho in 7 giorni?',
      answer:
        "L'itinerario copre circa 70 chilometri dal punto di partenza a Lemosho Gate fino alla vetta e alla discesa verso Mweka Gate.",
    },
    {
      question: "Ho bisogno di un'esperienza pregressa con l'altitudine?",
      answer:
        "Non necessariamente. Non è richiesta alcuna arrampicata tecnica, ma un buon livello di forma fisica è importante. Non hai bisogno di esperienza pregressa con l'altitudine, sebbene il mal acuto di montagna possa colpire chiunque, il che spiega l'importanza dell'acclimatazione.",
    },
    {
      question: 'Che tipo di alloggio si usa sulla route Lemosho?',
      answer:
        "L'alloggio avviene in tende di alta qualità fornite e montate dal tuo team di trek. Ogni notte dormirai in campi di montagna designati come Mti Mkubwa, Shira, Barranco, Karanga, Barafu e Mweka.",
    },
    {
      question: 'Cosa devo portare per questo itinerario?',
      answer:
        "Gli indispensabili comprendono scarponi da trekking robusti, un sacco a pelo caldo (resistente fino a -10°C), strati termici, attrezzatura impermeabile, guanti, una lampada frontale e uno zaino giornaliero. La maggior parte degli operatori fornisce una lista completa dell'attrezzatura.",
    },
    {
      question: 'Ci sono servizi igienici in montagna?',
      answer:
        "Latrine pubbliche sono disponibili in ogni campo. Tuttavia, servizi igienici portatili privati sono spesso inclusi o disponibili come opzione per maggiore comfort e igiene.",
    },
    {
      question: 'Qual è il periodo migliore per scalare la route Lemosho?',
      answer:
        "Le stagioni migliori sono da gennaio a inizio marzo e da giugno a ottobre. Questi mesi offrono cieli più limpidi, meno precipitazioni e migliori condizioni di trek in generale.",
    },
    {
      question: 'Posso personalizzare questo itinerario o aggiungere giorni supplementari?',
      answer:
        "Assolutamente! L'itinerario può essere esteso in una versione di 8 giorni per una migliore acclimatazione, oppure adattato secondo il tuo ritmo. Il nostro team lavorerà con te per adattare il trek alle tue preferenze e necessità.",
    },
  ],
  hubSummary:
    "Con otto giorni di viaggio, il tuo trek del Kilimangiaro sulla route Lemosho dura più a lungo delle alternative.",
  hubImage: {src: '/images/packages/shared/8-days-lemosho-route.webp', alt: 'Route Lemosho in 7 giorni'},
}

const lemosho8It: TripIt = {
  slug: '8-days-lemosho-route',
  category: 'package',
  name: '8 Giorni Route Lemosho',
  durationDays: 8,
  seoTitle: '8 Giorni Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 8 Giorni Route Lemosho.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira Camp 1, Shira Camp 2, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Lemosho è uno degli itinerari più belli ed equilibrati per scalare il Monte Kilimangiaro. Offre una ricca biodiversità, meno affluenza durante i primi giorni, e un'eccellente acclimatazione grazie al suo profilo di salita graduale. Se cerchi un itinerario che unisca bellezza paesaggistica, paesaggi variegati e un alto tasso di successo in vetta, la route Lemosho in 8 giorni è una scelta fantastica.",
    "Partendo dal lato ovest del Kilimangiaro, questo itinerario attraversa una rigogliosa foresta pluviale, vaste brughiere e zone di deserto alpino prima di unirsi alla route Machame e dirigersi verso la vetta via Barafu Camp.",
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Mappa della route Lemosho in 8 giorni'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit in 9 giorni'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai in 7 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Lemosho Gate a Mti Mkubwa',
      location: 'Altitudine: 2.100 m → 2.650 m',
      meta: ['Dislivello positivo: 550 m (1.805 piedi)', 'Durata: 3-4 ore'],
      body: [
        "Dopo la colazione, guiderai da Arusha fino a Londorossi Gate per la registrazione. Poi proseguirai fino a Lemosho Gate, dove l'escursione inizia attraverso una rigogliosa foresta pluviale. Questa zona è ricca di fauna selvatica, con colobi bianchi e neri e uccelli forestali. Camminerai sotto una fitta chioma di alberi prima di arrivare a Mti Mkubwa (Big Tree) Camp per la notte.",
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Da Mti Mkubwa Camp a Shira 1 Camp',
      location: 'Mti Mkubwa Camp (2.650 m) – Shira 1 Camp (3.610 m)',
      meta: ['Dislivello positivo: 960 m (3.150 piedi)', 'Durata: 6-7 ore'],
      body: [
        "Il sentiero di oggi sale progressivamente fuori dalla foresta pluviale verso la zona di erica e brughiera. Man mano che sali, gli alberi si diradano e il paesaggio si apre, offrendo viste magnifiche sulla cresta di Shira e sul picco Kibo. Dopo un'escursione pittoresca attraverso colline ondulate e formazioni rocciose vulcaniche, raggiungerai Shira 1 Camp sull'altopiano di Shira.",
      ],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Altopiano di Shira'},
    },
    {
      day: 3,
      label: 'Da Shira 1 Camp a Shira 2 Camp',
      location: 'Shira 1 Camp (3.610 m) – Shira 2 Camp (3.850 m)',
      meta: ['Dislivello positivo: 240 m (787 piedi)', 'Durata: 3-4 ore'],
      body: [
        "Un breve trek attraverso il vasto altopiano aperto della cresta di Shira ti dà il tempo di riposarti e acclimatarti. Se il tempo lo permette, avrai viste panoramiche su Kibo e sul monte Meru in lontananza.",
      ],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Vista di Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Da Shira 2 Camp a Lava Tower e poi a Barranco Camp',
      location: 'Shira 2 Camp (3.850 m) → Lava Tower (4.630 m) → Barranco Camp',
      meta: ['Dislivello positivo: 780 m', 'Dislivello negativo: 654 m', 'Durata: 6-7 ore'],
      body: [
        "Sali costantemente fino all'imponente Lava Tower, dove ti fermerai per il pranzo. Scendi poi nella magnifica valle di Barranco per la notte. Questa è una delle giornate di acclimatazione più importanti dell'itinerario.",
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: 'Da Barranco Camp a Karanga Camp',
      location: 'Barranco Camp (3.976 m) → Karanga Camp (4.035 m)',
      meta: ['Dislivello positivo: 59 m / 194 piedi', 'Durata: 4-5 ore'],
      body: [
        'Scala la celebre Barranco Wall — impegnativa ma non tecnica. Continua attraverso un terreno alpino fino a Karanga Camp. Questa giornata più breve lascia al tuo corpo più tempo per acclimatarsi prima della notte di vetta.',
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Vista di Karanga Camp'},
    },
    {
      day: 6,
      label: 'Da Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (4.035 m / 13.238 piedi) → Barafu Camp (4.703 m)',
      meta: ['Dislivello positivo: 668 m / 2.192 piedi', 'Durata: 3-4 ore'],
      body: [
        'Un trek breve ma ripido attraverso un deserto alpino d\'alta quota fino al tuo ultimo campo prima della notte di vetta. Riposati, idratati e preparati mentalmente alla sfida che ti attende.',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: 'Sentiero verso Barafu Camp'},
    },
    {
      day: 7,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      location:
        'Barafu Camp (4.703 m / 15.430 piedi) → Uhuru Peak (5.895 m / 19.341 piedi) → Mweka Camp (3.720 m / 12.205 piedi)',
      meta: ['Dislivello positivo: 1.192 m / 3.910 piedi', 'Dislivello negativo: 2.175 m / 7.136 piedi', 'Durata: 12-14 ore'],
      body: [
        "Inizia il tuo tentativo di vetta verso mezzanotte, camminando nell'oscurità verso Stella Point e poi Uhuru Peak — il punto più alto d'Africa. Dopo l'alba e le foto in vetta, ridiscendi a Barafu per una pausa, poi fino a Mweka Camp per la notte.",
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Da Mweka Camp a Mweka Gate, trasferimento ad Arusha',
      location: 'Mweka Camp (3.720 m / 12.205 piedi) → Mweka Gate (1.640 m / 5.380 piedi)',
      meta: ['Dislivello negativo: 2.080 m / 6.824 piedi', 'Durata: 3-4 ore'],
      body: [
        "Attraversa una rigogliosa foresta pluviale fino all'ingresso del parco, dove riceverai il tuo certificato del Kilimangiaro. Il tuo autista ti trasferirà al tuo hotel per una doccia calda e un riposo ben meritato.",
      ],
      overnightStay: 'Arusha',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: 'FAQ Route Lemosho in 8 Giorni',
  faqIntro:
    "Hai domande sulla scalata del Kilimangiaro con noi? Consulta le nostre FAQ sulla route Lemosho qui sotto per risposte chiare e utili. Se non trovi quello che cerchi, non esitare a contattarci — i nostri esperti di montagna di Asili Climbing Kilimanjaro sono qui per aiutarti a pianificare un'avventura in vetta sicura, riuscita e indimenticabile.",
  faqs: [
    {
      question: 'Perché scegliere la route Lemosho per scalare il Kilimangiaro?',
      answer:
        "La route Lemosho è ampiamente considerata l'itinerario più panoramico del Kilimangiaro. Offre viste mozzafiato, poca affluenza durante le prime tappe, e un'eccellente acclimatazione. Con una salita graduale e paesaggi variegati, è ideale per gli escursionisti che puntano a una scalata riuscita.",
    },
    {
      question: 'Qual è il livello di difficoltà della route Lemosho in 8 giorni?',
      answer:
        "L'itinerario è moderatamente impegnativo ma del tutto gestibile con una buona preparazione. L'itinerario di 8 giorni consente una migliore acclimatazione, aumentando le tue possibilità di raggiungere Uhuru Peak senza gravi sintomi da altitudine.",
    },
    {
      question: 'Cosa è incluso nella scalata di 8 giorni tramite la route Lemosho con Asili Climbing Kilimanjaro?',
      answer:
        "La tua scalata comprende guide di montagna professionali, portatori, attrezzatura da campeggio completa, i pasti, le tasse di parco, la tassa di soccorso e i trasferimenti aeroportuali. Possono inoltre essere organizzati soggiorni in hotel prima e dopo il trek.",
    },
    {
      question: 'Che tipo di alloggio si usa durante il trek?',
      answer:
        "Dormirai in tende di montagna quattro stagioni di alta qualità, ciascuna condivisa tra due scalatori. Vengono forniti materassini confortevoli. Tutti i campi vengono montati e smontati ogni giorno dai nostri portatori.",
    },
    {
      question: "Qual è il periodo migliore dell'anno per fare trekking sulla route Lemosho?",
      answer:
        "Consigliamo di scalare durante le stagioni secche: da gennaio a metà marzo e da giugno a ottobre. Questi mesi offrono il meteo e la visibilità migliori per le viste panoramiche e la fotografia.",
    },
    {
      question: 'Quante persone comporranno il mio gruppo?',
      answer:
        "Manteniamo gruppi di piccole dimensioni — generalmente tra 2 e 10 escursionisti — per offrire un'esperienza più personalizzata e garantire sicurezza e supporto durante tutto il viaggio.",
    },
    {
      question: 'Che livello di forma fisica mi serve per completare questo trek?',
      answer:
        "Non devi essere un atleta, ma dovresti avere un buon livello di forma fisica ed essere a tuo agio nel camminare per diverse ore su giorni consecutivi. Consigliamo di allenarti con escursionismo, cardio e rafforzamento muscolare diverse settimane in anticipo.",
    },
    {
      question: 'Che tipo di cibo viene fornito in montagna?',
      answer:
        "I nostri cuochi di montagna preparano pasti caldi e nutrienti tre volte al giorno. Aspettati piatti come zuppe, pasta, riso, carne, verdure, frutta fresca e snack. Le esigenze alimentari particolari possono essere soddisfatte con preavviso.",
    },
    {
      question: 'Avrò accesso ad acqua potabile pulita?',
      answer:
        "Sì. Trattiamo e facciamo bollire quotidianamente l'acqua proveniente da fonti naturali lungo l'itinerario. Acqua potabile sicura ti verrà fornita ogni giorno per riempire le tue bottiglie o il tuo sistema di idratazione.",
    },
    {
      question: 'È sicuro scalare il Kilimangiaro con Asili Climbing Kilimanjaro?',
      answer:
        "La sicurezza è la nostra massima priorità. Le nostre guide sono formate come Wilderness First Responder (WFR), ed effettuiamo controlli sanitari quotidiani tramite pulsossimetri. Ossigeno d'emergenza e una barella portatile vengono sempre trasportati. Se necessario, organizziamo un'evacuazione rapida tramite i servizi di soccorso ufficiali.",
    },
  ],
  hubSummary:
    "Con otto giorni di viaggio, il tuo trek del Kilimangiaro sulla route Lemosho dura più a lungo delle alternative.",
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho in 8 giorni'},
}

const rongai7It: TripIt = {
  slug: '7-days-rongai-route',
  category: 'package',
  name: '7 Giorni Route Rongai',
  durationDays: 7,
  seoTitle: '7 Giorni Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 7 Giorni Route Rongai.',
  stopsLine: 'Nalemoru Gate, Simba Camp, Second Cave Camp, Kikelewa Camp, Mawenzi Tarn, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Rongai è l'unico itinerario che affronta il Kilimangiaro dal lato nord, vicino al confine con il Kenya, offrendo un'esperienza più tranquilla e isolata con paesaggi che si elevano gradualmente e meno affluenza. È perfetta per chi desidera una scalata tranquilla, apprezza l'osservazione della fauna selvatica, e preferisce un itinerario più asciutto — soprattutto durante la stagione delle piogge.",
    "Nell'arco di sette giorni, attraverserai una rigogliosa foresta pluviale, vaste brughiere e un alto deserto alpino, per infine ritrovarti in vetta a Uhuru Peak — il punto più alto d'Africa.",
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Mappa della route Rongai in 7 giorni'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: 'Scalatori sul sentiero'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Nalemoru Gate a Simba Camp',
      location: 'Nalemoru Gate (1.950 m / 6.398 piedi) → Simba Camp (2.620 m / 8.596 piedi)',
      meta: ['Dislivello positivo: 670 m / 2.198 piedi', 'Durata: 3-4 ore'],
      body: [
        "Il tuo trek inizia a Nalemoru Gate, con una salita graduale attraverso una rigogliosa foresta montana. Tieni gli occhi aperti per avvistare colobi e uccelli forestali. Arriva a Simba Camp, appollaiato al limitare della brughiera.",
      ],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Cartello di Simba Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'Da Simba Camp a Second Cave Camp',
      location: 'Simba Camp (2.620 m / 8.596 piedi) → Second Cave Camp (3.450 m / 11.318 piedi)',
      meta: ['Dislivello positivo: 830 m / 2.723 piedi', 'Durata: 5-6 ore'],
      body: [
        'Il sentiero di oggi si apre su erica e brughiera man mano che ti lasci la foresta alle spalle. Goditi viste magnifiche sul picco Kibo mentre ti dirigi verso Second Cave Camp, un luogo tranquillo circondato da flora alpina.',
      ],
      overnightStay: 'Second Cave Camp',
      image: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-camp.webp', alt: 'Tende di Second Cave Camp'},
    },
    {
      day: 3,
      label: 'Da Second Cave a Kikelewa Camp',
      location: 'Second Cave (3.450 m / 11.318 piedi) → Kikelewa Camp (3.630 m / 11.910 piedi)',
      meta: ['Dislivello positivo: 180 m / 591 piedi', 'Durata: 3-4 ore'],
      body: [
        'Una giornata più breve ma magnifica, il sentiero serpeggia attraverso brughiere accidentate, con viste sempre più spettacolari sui picchi del Kilimangiaro. Arriva a Kikelewa Camp, adagiato in una valle riparata con viste panoramiche.',
      ],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
    },
    {
      day: 4,
      label: 'Da Kikelewa a Mawenzi Tarn',
      location: 'Kikelewa (3.630 m / 11.910 piedi) → Mawenzi Tarn (4.310 m / 14.140 piedi)',
      meta: ['Dislivello positivo: 680 m / 2.231 piedi', 'Durata: 4-5 ore'],
      body: [
        "La salita di oggi è più ripida ma molto gratificante. Camminerai verso Mawenzi, il secondo picco del Kilimangiaro, con viste magnifiche e un paesaggio d'alta quota quasi irreale. Mawenzi Tarn Camp si trova in un circo spettacolare ai piedi di imponenti scogliere.",
      ],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 5,
      label: 'Da Mawenzi Tarn a Kibo Hut',
      location: 'Mawenzi Tarn (4.310 m / 14.140 piedi) → Kibo Hut (4.700 m / 15.420 piedi)',
      meta: ['Dislivello positivo: 390 m / 1.280 piedi', 'Durata: 5-6 ore'],
      body: [
        "Attraversa la sella dall'aspetto lunare tra Mawenzi e Kibo, raggiungendo Kibo Hut a mezzogiorno. Riposati, idratati e preparati per il difficile tentativo di vetta che inizia verso mezzanotte.",
      ],
      overnightStay: 'Kibo Hut (rifugio in stile dormitorio)',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Edificio in pietra di Kibo Hut'},
    },
    {
      day: 6,
      label: 'Da Kibo Hut a Uhuru Peak e poi a Horombo Hut',
      location: 'Kibo Hut (4.700 m / 15.420 piedi) → Uhuru Peak (5.895 m / 19.341 piedi) → Horombo Hut (3.720 m / 12.205 piedi)',
      meta: [
        'Dislivello positivo: 1.195 m / 3.920 piedi',
        'Dislivello negativo: 2.175 m / 7.136 piedi',
        'Salita alla vetta: 6-8 ore',
        'Discesa: 6 ore',
      ],
      body: [
        "La tua spinta verso la vetta inizia sotto un cielo stellato, scalando tornanti ripidi fino a Gilman's Point (5.685 m), poi lungo il bordo del cratere fino a Uhuru Peak — il tetto dell'Africa. Festeggia brevemente, poi ridiscendi attraverso Kibo fino a Horombo Hut per un riposo ben meritato.",
      ],
      overnightStay: 'Horombo Hut (rifugio in stile dormitorio)',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: 'Vetta di Uhuru Peak'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 7,
      label: 'Da Horombo Hut a Marangu Gate',
      location: 'Horombo Hut (3.720 m / 12.205 piedi) → Marangu Gate (1.860 m / 6.102 piedi)',
      meta: ['Dislivello negativo: 1.860 m / 6.102 piedi', 'Durata: 5-6 ore'],
      body: [
        "Scendi attraverso una rigogliosa foresta pluviale fino a Marangu Gate, dove riceverai il tuo certificato di scalata e festeggerai la tua impresa. Trasferimento di ritorno a Moshi o Arusha.",
      ],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: 'Discesa verso Marangu Gate'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: 'FAQ Route Rongai in 7 Giorni',
  faqs: [
    {
      question: 'La route Rongai è meno frequentata rispetto agli altri itinerari del Kilimangiaro?',
      answer:
        "Sì, la route Rongai è l'unico itinerario che affronta il Kilimangiaro da nord, vicino al confine con il Kenya. È rinomata per essere molto più tranquilla e meno frequentata rispetto a itinerari popolari come Machame o Marangu, offrendo un'esperienza di trekking più pacifica.",
    },
    {
      question: 'Qual è il livello di difficoltà della route Rongai in 7 giorni?',
      answer:
        "La route Rongai è considerata di livello di difficoltà moderato, con un profilo di salita graduale che favorisce l'acclimatazione. È una buona scelta per chi cerca un equilibrio tra sfida fisica e migliori possibilità di successo.",
    },
    {
      question: 'Qual è il tasso di successo sulla route Rongai in 7 giorni?',
      answer:
        "L'itinerario di 7 giorni migliora l'acclimatazione e si traduce in un tasso di successo in vetta di circa l'85% o più, soprattutto rispetto alle versioni più brevi dello stesso itinerario.",
    },
    {
      question: 'Come sono gli alloggi sulla route Rongai?',
      answer:
        "Alloggerai in tende di montagna di alta qualità, montate e mantenute dal nostro team professionale. Durante la discesa (via Marangu), dormirai a Horombo Hut, un punto di sosta caldo e riparato. Includiamo anche una tenda-bagno privata per maggiore comfort.",
    },
    {
      question: 'Come si presenta il paesaggio rispetto agli altri itinerari?',
      answer:
        "La route Rongai offre paesaggi variegati e unici, tra cui una natura selvaggia isolata, versanti boscosi e viste sorprendenti sul picco Mawenzi. La discesa via la route Marangu offre un cambio di scenario, attraversando una rigogliosa foresta pluviale.",
    },
    {
      question: 'Questo itinerario è preferibile durante la stagione delle piogge?',
      answer:
        "Sì. Il lato nord del Kilimangiaro riceve meno pioggia, il che rende Rongai una scelta saggia se scali tra marzo e maggio o a novembre. È anche un'opzione affidabile per trek durante tutto l'anno con meno perturbazioni meteorologiche.",
    },
    {
      question: "Sono forniti i pasti e l'acqua?",
      answer:
        "Sì. Serviamo pasti freschi e caldi preparati dai nostri cuochi di montagna tre volte al giorno. Forniamo anche acqua potabile filtrata e sicura durante tutta la scalata. Ci adattiamo a diete particolari su richiesta — basta informarci in anticipo.",
    },
    {
      question: 'Che tipo di team di supporto avrò?',
      answer:
        "Sarai accompagnato da un team di supporto completo: guide esperte, portatori e cuochi, tutti formati e certificati. Il nostro team garantisce la tua sicurezza e il tuo comfort dall'inizio alla fine — il tuo successo è la nostra missione.",
    },
    {
      question: 'Come si presenta la notte di vetta?',
      answer:
        "La notte di vetta è la più impegnativa ma anche la più ispiratrice. Partiamo da Kibo Hut verso mezzanotte, raggiungendo Uhuru Peak all'alba. Le nostre guide cammineranno con te passo dopo passo, offrendoti supporto e motivazione lungo tutto il percorso.",
    },
    {
      question: 'Posso combinare questa scalata con un safari in Tanzania?',
      answer:
        "Sì, ed è vivamente consigliato! Da Asili Climbing Kilimanjaro, proponiamo estensioni di safari personalizzate dopo il tuo trek. Esplora il Serengeti, il cratere del Ngorongoro, o rilassati a Zanzibar — a seconda di cosa corrisponde al tuo sogno di viaggio.",
    },
  ],
  hubSummary:
    "Affrontando il Kilimangiaro da nord, questo itinerario offre una prospettiva unica della montagna ed è perfetto per chi…",
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai in 7 giorni'},
}

const umbwe6It: TripIt = {
  slug: '6-days-umbwe-route',
  category: 'package',
  name: '6 Giorni Route Umbwe',
  durationDays: 6,
  seoTitle: '6 Giorni Route Umbwe | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 6 Giorni Route Umbwe.',
  stopsLine: 'Umbwe Gate, Umbwe Cave Camp, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp e Mweka Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Umbwe è riconosciuta come l'itinerario più diretto, ripido ed impegnativo verso la vetta del Monte Kilimangiaro. Questo itinerario non è per gli animi sensibili. Richiede una buona condizione fisica, resilienza mentale e una certa esperienza di trekking. Ciò che distingue Umbwe è la sua solitudine, i suoi paesaggi spettacolari e l'atmosfera grezza e selvaggia che offre dall'inizio alla fine.",
    "Se sei un escursionista esperto in cerca di un sentiero tranquillo con poca affluenza e una scalata rapida, la route Umbwe potrebbe essere perfetta per te. Nonostante la sua difficoltà, l'itinerario si unisce al sentiero Machame al secondo o terzo giorno, permettendo una certa acclimatazione prima della notte di vetta.",
  ],
  mapImage: {
    src: '/images/packages/6-days-umbwe-route/hero.jpg',
    alt: 'Campeggio sulla route Umbwe con la vetta del Kilimangiaro sullo sfondo',
  },
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit in 9 giorni'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai in 7 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Da Umbwe Gate a Umbwe Cave Camp',
      location: 'Umbwe Gate (1.600 m) → Umbwe Cave Camp (2.850 m)',
      meta: ['Dislivello positivo: 1.250 m / 4.100 piedi', 'Durata: 5-6 ore'],
      body: [
        "Il tuo viaggio inizia con un breve tragitto da Moshi fino a Umbwe Gate. Dopo la registrazione, il sentiero si tuffa direttamente in una fitta e umida foresta pluviale. Il ripido percorso sale rapidamente attraverso radici d'albero e creste muscose fino a raggiungere Umbwe Cave Camp — la tua prima notte in montagna.",
      ],
      overnightStay: 'Umbwe Cave Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-camp.jpg', alt: 'Umbwe Cave Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-2.jpg', alt: 'Cartello di Umbwe Gate'},
    },
    {
      day: 2,
      label: 'Da Umbwe Cave a Barranco Camp',
      location: 'Umbwe Cave Camp (2.850 m/9.350 piedi) → Barranco Camp (3.976 m/13.044 piedi)',
      meta: ['Dislivello positivo: 1.126 m (3.694 piedi)', 'Durata: 4-5 ore'],
      body: [
        'Salirai bruscamente fuori dalla zona forestale per entrare nella regione di erica e brughiera. Il sentiero si restringe lungo creste rocciose, rivelando ampie viste sul picco Kibo e sulla Western Breach. Nel primo pomeriggio, raggiungerai Barranco Camp, adagiato ai piedi dell\'imponente Barranco Wall.',
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day2-barranco-camp.jpg', alt: 'Tende di Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day2-barranco-2.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 3,
      label: 'Da Barranco Camp a Karanga Camp via la Barranco Wall',
      location:
        'Barranco Camp (3.850 m/12.600 piedi) → Barranco Wall (4.200 m/13.800 piedi) → Karanga Camp (3.950 m/13.000 piedi)',
      meta: ['Dislivello positivo: 350 m / 1.150 piedi', 'Dislivello negativo: 250 m / 820 piedi', 'Durata: 3-4 ore'],
      body: bodyBarrancoWallToKarangaIt,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day3-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day3-karanga-2.jpg', alt: 'Valle di Karanga'},
    },
    {
      day: 4,
      label: 'Da Karanga Camp a Barafu Camp',
      location: 'Karanga Camp (3.950 m/13.000 piedi) → Barafu Camp (4.600 m/15.100 piedi)',
      meta: ['Dislivello positivo: 650 m / 2.150 piedi', 'Durata: 3-4 ore'],
      body: bodyKarangaToBarafuIt,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day4-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day4-barafu-2.jpg', alt: 'Sentiero verso Barafu Camp'},
    },
    {
      day: 5,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      location:
        'Barafu Camp (4.600 m/15.100 piedi) → Uhuru Peak (5.895 m/19.300 piedi) → Mweka Camp (3.110 m/10.200 piedi)',
      meta: [
        'Dislivello positivo: 1.295 m / 4.200 piedi',
        'Dislivello negativo: 2.785 m / 9.100 piedi',
        'Salita alla vetta: 6-8 ore',
        'Discesa: 6 ore',
      ],
      body: bodySummitToMwekaIt,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day5-mweka-2.jpg', alt: 'Tende di Mweka Camp'},
    },
    {
      day: 6,
      label: 'Da Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 piedi) → Mweka Gate (1.830 m/6.000 piedi)',
      meta: ['Dislivello negativo: 1.280 m / 4.220 piedi', 'Durata: 2-3 ore'],
      body: bodyMwekaToGateIt,
      image: {
        src: '/images/packages/6-days-umbwe-route/day6-mweka-gate.jpg',
        alt: 'Celebrazione del certificato di vetta a Mweka Gate',
      },
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: 'FAQ Route Umbwe in 6 Giorni',
  faqs: [
    {
      question: 'La route Umbwe è difficile?',
      answer:
        "Sì, la route Umbwe è considerata uno degli itinerari più impegnativi del Monte Kilimangiaro a causa della sua salita ripida e del suo rapido guadagno di altitudine. È più adatta a escursionisti esperti o in ottima forma fisica, a proprio agio con sentieri ripidi e l'alta quota.",
    },
    {
      question: 'Cosa rende unica la route Umbwe?',
      answer:
        "Il suo approccio diretto e tranquillo è ciò che rende Umbwe speciale. È l'itinerario meno frequentato, che offre paesaggi spettacolari, una fitta foresta pluviale e un trek lungo le creste. Si unisce anche al circuito sud più panoramico vicino a Barranco Camp, offrendo viste magnifiche.",
    },
    {
      question: 'Quanti giorni ci vogliono per scalare il Kilimangiaro via Umbwe?',
      answer:
        "L'itinerario standard di Umbwe è di 6 giorni, ma alcuni scalatori scelgono di estenderlo a 7 giorni per consentire una migliore acclimatazione e aumentare i tassi di successo in vetta.",
    },
    {
      question: 'Qual è il tasso di successo per la route Umbwe in 6 giorni?',
      answer:
        "A causa del rapido guadagno di altitudine e della mancanza di tempo di acclimatazione, il tasso di successo per la route Umbwe in 6 giorni è più basso rispetto agli itinerari più lunghi — generalmente tra il 60% e il 70%. Tuttavia, gli scalatori in forma e ben preparati con esperienza pregressa in altitudine spesso hanno successo.",
    },
    {
      question: 'La route Umbwe è pericolosa?',
      answer:
        "L'itinerario non è pericoloso se affrontato correttamente, ma è fisicamente più impegnativo degli altri. Il rischio principale è il mal acuto di montagna a causa della salita rapida. Prendiamo la sicurezza sul serio e monitoriamo attentamente tutti gli scalatori per rilevare i segni di MAM (mal acuto di montagna).",
    },
    {
      question: 'Che tipo di alloggio è fornito sulla route Umbwe?',
      answer:
        "Tutto l'alloggio avviene in tende di montagna, installate in luoghi designati. Forniamo tende da notte di qualità, materassini spessi, e una tenda-ristorante separata con tavoli e sedie per il tuo comfort.",
    },
    {
      question: 'Cosa è incluso nel pacchetto di scalata Umbwe?',
      answer:
        "Il nostro pacchetto comprende guide di montagna professionali, portatori, tasse di parco, attrezzatura da campeggio, i pasti in montagna e i trasferimenti da/per il tuo hotel. Voli internazionali, mance, attrezzatura personale e notti aggiuntive in lodge non sono inclusi.",
    },
    {
      question: "Posso noleggiare l'attrezzatura se non la possiedo tutta?",
      answer:
        "Sì, offriamo il noleggio di attrezzatura a Moshi o Arusha. Articoli come sacchi a pelo, bastoncini da trekking, giacche e scarponi sono disponibili a noleggio a prezzi ragionevoli. Ti forniremo una lista di controllo dell'attrezzatura prima del tuo viaggio.",
    },
    {
      question: 'Come è il meteo sulla route Umbwe?',
      answer:
        "Il meteo varia in base all'altitudine. Aspettati condizioni umide da foresta pluviale all'inizio, condizioni alpine fredde e secche a metà percorso, e temperature glaciali vicino alla vetta. È importante vestirsi a strati e prepararsi a cambiamenti meteorologici improvvisi.",
    },
    {
      question: 'Qual è il periodo migliore per scalare la route Umbwe?',
      answer:
        "I periodi migliori per il trekking sono durante le stagioni secche: da gennaio a inizio marzo e da giugno a ottobre. Questi mesi offrono i cieli più limpidi, le migliori condizioni dei sentieri e un meteo più stabile.",
    },
  ],
  hubSummary:
    'La route Umbwe è rinomata per la sua scalata impegnativa e ripida, oltre che per il suo sentiero magnifico e meno frequentato.',
  hubImage: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Route Umbwe in 6 giorni'},
}

const northernCircuit9It: TripIt = {
  slug: '9-days-northern-circuit-route',
  category: 'package',
  name: '9 Giorni Northern Circuit',
  durationDays: 9,
  seoTitle: '9 Giorni Route Northern Circuit | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto 9 Giorni Route Northern Circuit.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Moir Hut, Buffalo Camp, Third Cave Camp, School Hut, Uhuru Peak, Mweka Camp e Mweka Gate',
  priceDisclaimer:
    "*Il prezzo a persona comprende: una guida di montagna professionale, le tasse d'ingresso al parco, tutti gli alloggi in campeggio, i pasti durante il trek, i trasferimenti da/per l'ingresso del parco, e un soggiorno in hotel a Moshi/Arusha dopo la scalata.",
  overviewBody: [
    "La route Northern Circuit è l'itinerario più recente ed entusiasmante del Kilimangiaro — e probabilmente il più gratificante. Offre viste a 360° impareggiabili, meno affluenza, e il miglior profilo di acclimatazione tra tutti gli itinerari del Kilimangiaro. Estendendosi per nove giorni, questo trek inizia sul lato ovest isolato della montagna e aggira i versanti nord raramente percorsi prima di scalare la vetta da est. È ideale per chi cerca un'esperienza più immersiva e panoramica con un tasso di successo in vetta molto elevato.",
    "Se cerchi un'avventura più tranquilla e fuori dai sentieri battuti, con paesaggi magnifici e abbastanza tempo per adattarti all'altitudine, la route Northern Circuit è il tuo itinerario ideale.",
  ],
  mapImage: {
    src: '/images/packages/9-days-northern-circuit-route/hero.png',
    alt: 'Mappa della route Northern Circuit al Kilimangiaro',
  },
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: 'Il Kilimangiaro sopra la savana di acacie'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Scalatori che si avvicinano alla vetta nella neve'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame in 7 giorni'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit in 9 giorni'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai in 7 giorni'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe in 6 giorni'},
  ],
  itinerary: [
    arrivalIt,
    {
      day: 1,
      label: 'Londorossi Gate – Mti Mkubwa Camp',
      location: 'Londorossi Gate (2.100 m/6.890 piedi) → Mti Mkubwa Camp (2.650 m/8.694 piedi)',
      meta: ['Dislivello positivo: 550 m / 1.804 piedi', 'Durata: 3-4 ore'],
      body: ["Fai un'escursione attraverso una fitta foresta pluviale brulicante di uccelli e scimmie. Questa breve prima giornata favorisce l'acclimatazione."],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa – Shira 1 Camp',
      location: 'Mti Mkubwa (2.650 m/8.694 piedi) → Shira 1 Camp (3.610 m/11.844 piedi)',
      meta: ['Dislivello positivo: 960 m / 3.150 piedi', 'Durata: 5-6 ore'],
      body: ["Sali costantemente fuori dalla foresta verso la brughiera. Goditi ampie viste sull'altopiano di Shira e sul monte Meru in lontananza."],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-2.jpg', alt: 'Altopiano di Shira'},
    },
    {
      day: 3,
      label: 'Shira 1 – Shira 2 Camp',
      location: 'Shira 1 Camp (3.610 m/11.844 piedi) → Shira 2 Camp (3.850 m/12.631 piedi)',
      meta: ['Dislivello positivo: 240 m / 787 piedi', 'Durata: 4-5 ore'],
      body: ["Oggi è una camminata dolce attraverso l'altopiano d'alta quota. Inizierai a percepire l'immensità della montagna attraversando paesaggi vulcanici."],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-2.jpg', alt: 'Vista di Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Shira 2 – Lava Tower – Moir Hut',
      location: 'Shira 2 (3.850 m/12.631 piedi) → Lava Tower (4.600 m/15.091 piedi) → Moir Hut (4.200 m/13.780 piedi)',
      meta: ['Dislivello positivo: 750 m / 2.460 piedi', 'Dislivello negativo: 400 m / 1.311 piedi', 'Durata: 6-7 ore'],
      body: ["Sali fino a Lava Tower per l'acclimatazione prima di ridiscendere verso Moir Hut. Questa è una giornata essenziale per adattarsi all'altitudine."],
      overnightStay: 'Moir Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day4-moir-hut.jpg', alt: 'Moir Hut'},
    },
    {
      day: 5,
      label: 'Moir Hut – Buffalo Camp',
      location: 'Moir Hut (4.200 m/13.780 piedi) → Buffalo Camp (4.020 m/13.188 piedi)',
      meta: ['Dislivello positivo: 200 m / 656 piedi', 'Dislivello negativo: 380 m / 1.247 piedi', 'Durata: 5-6 ore'],
      body: ['Esplora i versanti nord incontaminati con ampie viste sul Kenya. Un itinerario tranquillo con pochissima affluenza.'],
      overnightStay: 'Buffalo Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day5-buffalo-camp.jpg', alt: 'Buffalo Camp'},
    },
    {
      day: 6,
      label: 'Buffalo Camp – Third Cave Camp',
      location: 'Buffalo Camp (4.020 m/13.188 piedi) → Third Cave Camp (3.870 m/12.697 piedi)',
      meta: ['Dislivello positivo: 150 m / 492 piedi', 'Durata: 5-6 ore'],
      body: ['Una giornata dolce in direzione est attraverso un terreno di deserto alpino. Meno affluenza, più tranquillità.'],
      overnightStay: 'Third Cave Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-camp.jpg', alt: 'Third Cave Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-2.jpg', alt: 'Vista di Third Cave Camp'},
    },
    {
      day: 7,
      label: 'Third Cave Camp – School Hut',
      location: 'Third Cave (3.870 m/12.697 piedi) → School Hut (4.750 m/15.584 piedi)',
      meta: ['Dislivello positivo: 880 m / 2.887 piedi', 'Durata: 4-5 ore'],
      body: ['Una salita ripida attraverso paesaggi sempre più aridi. Riposati presto per la tua spinta verso la vetta a mezzanotte.'],
      overnightStay: 'School Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut.jpg', alt: 'School Hut'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut-2.webp', alt: 'Cartello di School Hut'},
    },
    {
      day: 8,
      label: 'Giorno della Vetta (Uhuru Peak) – Mweka Camp',
      location: 'School Hut (4.750 m/15.584 piedi) → Uhuru Peak (5.895 m/19.341 piedi) → Mweka Camp (3.100 m/10.170 piedi)',
      meta: ['Dislivello positivo: 1.145 m / 3.757 piedi', 'Dislivello negativo: 2.795 m / 9.169 piedi', 'Durata: 12-14 ore'],
      body: [
        "Inizia la tua scalata a mezzanotte. Raggiungi Stella Point all'alba, poi la vetta di Uhuru Peak. Scendi attraverso ghiaioni e brughiere fino a Mweka Camp.",
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-2.jpg', alt: 'Baite di Mweka Camp'},
    },
    {
      day: 9,
      label: 'Da Mweka Camp a Mweka Gate',
      location: 'Mweka Camp (3.110 m/10.200 piedi) → Mweka Gate (1.830 m/6.000 piedi)',
      meta: ['Dislivello negativo: 1.280 m / 4.220 piedi', 'Durata: 2-3 ore'],
      body: bodyMwekaToGateIt,
      image: {src: '/images/packages/9-days-northern-circuit-route/day9-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: 'FAQ Route Northern Circuit in 9 Giorni',
  faqIntro:
    "Hai domande sulla scalata del Kilimangiaro con noi? Consulta le nostre FAQ sulla route Northern Circuit qui sotto per risposte chiare e utili. Se non trovi quello che cerchi, non esitare a contattarci — i nostri esperti di montagna di Asili Climbing Kilimanjaro sono qui per aiutarti a pianificare un'avventura in vetta sicura, riuscita e indimenticabile.",
  faqs: [
    {
      question: 'Qual è il livello di difficoltà della route Northern Circuit?',
      answer:
        "È un itinerario di difficoltà da moderata a impegnativa, ma la sua lunga durata lo rende uno dei più facili in termini di acclimatazione. Con nove giorni, il tuo corpo ha ampiamente il tempo di adattarsi all'altitudine.",
    },
    {
      question: 'Cosa differenzia questo itinerario dagli altri?',
      answer:
        "Il Northern Circuit è l'itinerario più lungo e tranquillo del Kilimangiaro. Aggira i versanti nord isolati, offrendo viste magnifiche e un alto tasso di successo in vetta.",
    },
    {
      question: '9 giorni sono troppi da trascorrere in montagna?',
      answer:
        "Assolutamente no. Questo tempo prolungato consente un guadagno di altitudine graduale, una migliore acclimatazione e meno problemi legati all'altitudine, aumentando le tue possibilità di raggiungere Uhuru Peak in sicurezza.",
    },
    {
      question: 'Come si presenta la notte di vetta?',
      answer:
        "Inizierai la tua scalata a mezzanotte da School Hut. L'obiettivo è raggiungere la vetta all'alba, per poi ridiscendere a Mweka Camp lo stesso giorno — un totale di 12-14 ore di cammino.",
    },
    {
      question: "Come è l'alloggio durante il trek?",
      answer:
        "Tutte le notti si trascorrono in tende di montagna fornite da Asili Climbing Kilimanjaro. Le tende sono calde, impermeabili, e montate dal nostro team prima del tuo arrivo al campo.",
    },
    {
      question: 'I portatori e il personale sono trattati equamente?',
      answer:
        "Assolutamente. Seguiamo gli standard del KPAP (Kilimanjaro Porters Assistance Project) per garantire che tutti i portatori e il team siano pagati equamente e lavorino in condizioni sicure.",
    },
    {
      question: "Ho bisogno di un'esperienza di trekking pregressa?",
      answer:
        "Non necessariamente. Devi essere in buona forma fisica e mentalmente preparato. Le nostre guide adattano il ritmo del trek alle tue capacità e garantiscono un'acclimatazione adeguata.",
    },
    {
      question: 'Qual è il periodo migliore per fare il Northern Circuit?',
      answer:
        "Giugno-ottobre e gennaio-inizio marzo sono ideali. Questi mesi offrono cieli limpidi, meno precipitazioni e migliori condizioni dei sentieri.",
    },
    {
      question: 'Scalerò con un gruppo?',
      answer:
        "Offriamo sia scalate private sia trek di gruppo aperti. Puoi scegliere lo stile che preferisci al momento della prenotazione.",
    },
    {
      question: 'Cosa succede se ho il mal acuto di montagna?',
      answer:
        "La tua guida monitora la tua salute quotidianamente. Se compaiono sintomi, agiamo immediatamente — adattando il ritmo, offrendo supporto con ossigeno, o organizzando un'evacuazione se necessario.",
    },
  ],
  hubSummary:
    "L'itinerario più recente e più lungo, che offre viste a 360 gradi e i tassi di successo più elevati per raggiungere la vetta.",
  hubImage: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit in 9 giorni'},
}

// ---------------------------------------------------------------------------
// 4 combo packages (Kilimanjaro + safari)
// ---------------------------------------------------------------------------

const combo9It: TripIt = {
  slug: '9-days-kilimanjaro-safari',
  category: 'combo',
  name: '9 Giorni Kilimangiaro e Safari',
  durationDays: 9,
  seoTitle: '9 Giorni Kilimangiaro e Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto combinato 9 Giorni Kilimangiaro e Safari.',
  stopsLine:
    'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate, Parco Nazionale di Tarangire, Cratere del Ngorongoro, Parco Nazionale del Lago Manyara',
  priceDisclaimer: comboPriceDisclaimerIt,
  overviewBody: [
    "Questa avventura di 9 giorni è il modo definitivo per scoprire il cuore della Tanzania — combinando il brivido della scalata del Monte Kilimangiaro tramite la pittoresca e confortevole route Marangu, con l'emozione di un classico safari del circuito nord attraverso il parco nazionale di Tarangire, il cratere del Ngorongoro e il lago Manyara.",
    "Che tu visiti la Tanzania per la prima volta o che tu stia realizzando un sogno di sempre, questo viaggio offre l'equilibrio perfetto tra realizzazione fisica, paesaggi mozzafiato e incontri ravvicinati con la fauna selvatica — il tutto sostenuto dall'esperienza e dalla cura del team di Asili Climbing Kilimanjaro.",
  ],
  mapImage: {src: '/images/combo/9-days-kilimanjaro-safari/marangu-trekkers.jpg', alt: 'Escursionisti sulla route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '9 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '9 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '9 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '9 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '9 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '9 Giorni Kilimangiaro e Safari'},
  ],
  itinerary: [
    comboArrivalIt(),
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      meta: ['Altitudine: 1.860 m → 2.700 m', 'Dislivello positivo: 840 m (2.755 piedi)', 'Durata: 4-5 ore'],
      body: [
        "Inizia il tuo viaggio attraverso una rigogliosa foresta pluviale popolata da colobi e una flora vibrante. Dopo una salita costante, raggiungerai Mandara Hut per la tua prima notte in montagna.",
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/mandara.jpg', alt: 'Marangu Gate – Mandara Hut'},
      overnightStay: 'Mandara Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/mandara-hut.webp', alt: 'Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      meta: ['Altitudine: 2.700 m → 3.720 m', 'Dislivello positivo: 1.020 m (3.346 piedi)', 'Durata: 6-7 ore'],
      body: ['Uscendo dalla foresta, il sentiero si trasforma in brughiera ed erica. Lungo il percorso, goditi le viste sui picchi Kibo e Mawenzi.'],
      image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Mandara Hut – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 3,
      label: 'Acclimatazione a Horombo Hut',
      meta: [
        'Altitudine: 3.720 m → 4.000 m (Zebra Rocks) → 3.720 m',
        'Dislivello positivo: 280 m (918 piedi)',
        'Dislivello negativo: 280 m (918 piedi)',
        'Durata: 2-3 ore (escursione facoltativa)',
      ],
      body: ["Una giornata di acclimatazione essenziale per aiutare il tuo corpo ad adattarsi. Puoi fare una breve escursione fino a Zebra Rocks e tornare per pranzare e riposarti a Horombo."],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-2.jpeg', alt: 'Acclimatazione a Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo3.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      meta: ['Altitudine: 3.720 m → 4.703 m', 'Dislivello positivo: 983 m (3.225 piedi)', 'Durata: 6-7 ore'],
      body: ['Il trek di oggi ti fa attraversare un terreno di deserto alpino in direzione del campo base a Kibo Hut. Riposati presto per prepararti alla notte di vetta.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut2.jpg', alt: 'Horombo Hut – Kibo Hut'},
      overnightStay: 'Kibo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut-1.jpg', alt: 'Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        'Altitudine: 4.703 m → 5.895 m (Uhuru Peak) → 3.720 m',
        'Dislivello positivo: 1.192 m (3.910 piedi)',
        'Dislivello negativo: 2.175 m (7.136 piedi)',
        'Durata: 12-14 ore',
      ],
      body: [
        "Inizia la tua spinta verso la vetta subito dopo mezzanotte, raggiungendo Gilman's Point e poi Uhuru Peak all'alba. Dopo aver festeggiato in vetta, scendi verso Horombo Hut per la tua ultima notte.",
      ],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Kibo Hut – Uhuru Peak – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Trasferimento',
      meta: ['Altitudine: 3.720 m → 1.860 m', 'Dislivello negativo: 1.860 m (6.102 piedi)', 'Durata: 5-6 ore'],
      body: ["Scendi attraverso la brughiera e la foresta pluviale fino all'ingresso del parco. Dopo aver ricevuto il tuo certificato di vetta, sarai trasferito al tuo hotel."],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/marangu.jpg', alt: 'Horombo Hut – Marangu Gate – Trasferimento'},
      overnightStay: 'Hotel ad Arusha (incluso)',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Hotel ad Arusha (incluso)'},
    },
    {
      day: 7,
      label: 'Arusha – Parco Nazionale di Tarangire',
      meta: ['Tempo di percorrenza: circa 2,5 ore da Arusha', 'Punto forte: mandrie di elefanti e antichi baobab'],
      body: [
        "Parti da Arusha dopo colazione e dirigiti direttamente verso il parco nazionale di Tarangire, rinomato per i suoi paesaggi spettacolari punteggiati di baobab e le sue importanti popolazioni di elefanti. Il parco ospita leoni, giraffe, zebre, gnu e oltre 500 specie di uccelli. Dopo una giornata completa di game drive, raggiungerai il tuo lodge vicino al lago Manyara o a Karatu per la cena e il pernottamento.",
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/Gallery-img07.webp', alt: 'Arusha – Parco Nazionale di Tarangire'},
      overnightStay: 'Lodge a Karatu o nella regione del lago Manyara',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Lodge a Karatu o nella regione del lago Manyara'},
    },
    {
      day: 8,
      label: 'Cratere del Ngorongoro',
      meta: ["Tempo di percorrenza: 45 minuti-1 ora fino all'ingresso del cratere", 'Punto forte: osservazione dei Big Five in una caldera vulcanica'],
      body: [
        "Dopo una colazione mattutina, scendi nel magnifico cratere del Ngorongoro, sito Patrimonio dell'Umanità UNESCO, spesso soprannominato l'« ottava meraviglia del mondo ». Questa immensa caldera è un rifugio per la fauna selvatica — tra cui elefanti, leoni, bufali, ippopotami, fenicotteri e il rinoceronte nero in pericolo. Goditi un picnic sul fondo del cratere prima di tornare al tuo lodge.",
      ],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Cratere del Ngorongoro'},
      overnightStay: 'Stesso lodge a Karatu',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Stesso lodge a Karatu'},
    },
    {
      day: 9,
      label: 'Parco Nazionale del Lago Manyara – Arusha',
      meta: ['Tempo di percorrenza: circa 1,5 ore di ritorno verso Arusha', 'Punto forte: leoni che si arrampicano sugli alberi e fenicotteri'],
      body: [
        "Inizia la tua mattinata con un tragitto verso il parco nazionale del lago Manyara, famoso per la sua rigogliosa foresta di acque sotterranee, il suo lago coperto di fenicotteri e i suoi leoni che si arrampicano sugli alberi. Questo parco compatto ma variegato è perfetto per un ultimo game drive rilassato. Dopo il pranzo, ritorna ad Arusha dove il tuo safari si conclude. Su richiesta, possiamo trasferirti in aeroporto per il tuo volo di coincidenza.",
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/tanzania-safari.jpg', alt: 'Parco Nazionale del Lago Manyara – Arusha'},
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: comboFaqHeadingIt,
  faqIntro: comboFaqIntroIt,
  faqs: comboFaqsIt,
  hubSummary:
    "Perfetto per gli avventurieri con poco tempo a disposizione. Scala il Monte Kilimangiaro tramite un itinerario di 6 giorni, poi goditi un rapido safari di 3 giorni attraverso i parchi emblematici della Tanzania come il Ngorongoro e Tarangire.",
  hubImage: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: '9 Giorni Kilimangiaro e Safari'},
}

const combo10It: TripIt = {
  slug: '10-days-kilimanjaro-and-safari',
  category: 'combo',
  name: '10 Giorni Kilimangiaro e Safari',
  durationDays: 10,
  seoTitle: '10 Giorni Kilimangiaro e Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto combinato 10 Giorni Kilimangiaro e Safari.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Parco Nazionale di Tarangire, Cratere del Ngorongoro, Parco Nazionale del Lago Manyara',
  priceDisclaimer: comboPriceDisclaimerIt,
  overviewBody: [
    "Questa avventura di 10 giorni è perfetta se desideri scalare il Monte Kilimangiaro scoprendo al contempo la magia di un classico safari africano — il tutto in un unico viaggio indimenticabile. Inizierai con un trek di 7 giorni sulla route Machame, rinomata per i suoi paesaggi magnifici e la sua buona acclimatazione. È apprezzata dagli scalatori per buone ragioni: attraverserai una rigogliosa foresta pluviale, alte brughiere e un accidentato terreno alpino prima di raggiungere la vetta della montagna più alta d'Africa — Uhuru Peak a 5.895 metri.",
  ],
  mapImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/machame.png', alt: 'Mappa del 10 Giorni Kilimangiaro e Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '10 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '10 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '10 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '10 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '10 Giorni Kilimangiaro e Safari'},
  ],
  itinerary: [
    comboArrivalIt(),
    {
      day: 1,
      label: 'Da Machame Gate a Machame Camp',
      meta: ['Machame Gate (1.800 m/5.900 piedi) → Machame Camp (3.000 m/9.800 piedi)', 'Dislivello positivo: 1.200 m / 3.900 piedi', 'Durata: 6-7 ore'],
      body: [bodyMachameGateToCampIt[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-.jpg', alt: 'Da Machame Gate a Machame Camp'},
      overnightStay: 'Machame Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-Camp.jpg', alt: 'Machame Camp'},
    },
    {
      day: 2,
      label: 'Da Machame Camp a Shira Camp',
      meta: ['Machame Camp (3.000 m/9.800 piedi) → Shira Camp (3.840 m/12.600 piedi)', 'Dislivello positivo: 840 m / 2.800 piedi', 'Durata: 5-6 ore'],
      body: [bodyMachameCampToShiraIt[0]],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'Da Machame Camp a Shira Camp'},
      overnightStay: 'Shira Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira Camp'},
    },
    {
      day: 3,
      label: 'Da Shira Camp a Barranco Camp via Lava Tower',
      meta: [
        'Shira Camp (3.840 m/12.600 piedi) → Lava Tower (4.550 m/14.900 piedi) → Barranco Camp (3.850 m/12.650 piedi)',
        'Dislivello positivo: 710 m / 2.300 piedi',
        'Dislivello negativo: 700 m / 2.250 piedi',
        'Durata: 6-7 ore',
      ],
      body: [bodyShiraToBarrancoViaLavaTowerIt[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lava-Tower.jpg', alt: 'Da Shira Camp a Barranco Camp via Lava Tower'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 4,
      label: 'Da Barranco Camp a Karanga Camp via la Barranco Wall',
      meta: [
        'Barranco Camp (3.850 m/12.600 piedi) → Barranco Wall (4.200 m/13.800 piedi) → Karanga Camp (3.950 m/13.000 piedi)',
        'Dislivello positivo: 350 m / 1.150 piedi',
        'Dislivello negativo: 250 m / 820 piedi',
        'Durata: 3-4 ore',
      ],
      body: [bodyBarrancoWallToKarangaIt[0]],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'Da Barranco Camp a Karanga Camp via la Barranco Wall'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 5,
      label: 'Da Karanga Camp a Barafu Camp',
      meta: ['Karanga Camp (3.950 m/13.000 piedi) → Barafu Camp (4.600 m/15.100 piedi)', 'Dislivello positivo: 650 m / 2.150 piedi', 'Durata: 3-4 ore'],
      body: [bodyKarangaToBarafuIt[0]],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'Da Karanga Camp a Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Barafu-Camp.webp', alt: 'Barafu Camp'},
    },
    {
      day: 6,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      meta: [
        'Barafu Camp (4.600 m/15.100 piedi) → Uhuru Peak (5.895 m/19.300 piedi) → Mweka Camp (3.110 m/10.200 piedi)',
        'Dislivello positivo: 1.295 m / 4.200 piedi',
        'Dislivello negativo: 2.785 m / 9.100 piedi',
        'Salita alla vetta: 6-8 ore',
        'Discesa: 6 ore',
      ],
      body: [bodySummitToMwekaIt[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Uhuru-Peak.webp', alt: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Mweka-Camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 7,
      label: 'Da Mweka Camp a Mweka Gate',
      meta: ['Mweka Camp (3.110 m/10.200 piedi) → Mweka Gate (1.830 m/6.000 piedi)', 'Dislivello negativo: 1.280 m / 4.220 piedi', 'Durata: 2-3 ore'],
      body: [bodyMwekaToGateIt[0]],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Cartello di Mweka Gate al parco nazionale del Kilimangiaro'},
      overnightStay: 'Planet Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/planet-lodge1.jpg', alt: 'Planet Lodge'},
    },
    {
      day: 8,
      label: 'Arusha – Parco Nazionale di Tarangire',
      meta: ['Tempo di percorrenza: circa 2,5 ore da Arusha', 'Punto forte: mandrie di elefanti e antichi baobab'],
      body: [
        "Parti da Arusha dopo colazione e dirigiti direttamente verso il parco nazionale di Tarangire, rinomato per i suoi paesaggi spettacolari punteggiati di baobab e le sue importanti popolazioni di elefanti. Il parco ospita leoni, giraffe, zebre, gnu e oltre 500 specie di uccelli. Dopo una giornata completa di game drive, raggiungerai il tuo lodge vicino al lago Manyara o a Karatu per la cena e il pernottamento.",
      ],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/h.jpg', alt: 'Arusha – Parco Nazionale di Tarangire'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/marera-2.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 9,
      label: 'Game Drive al Cratere del Ngorongoro',
      meta: ["Tempo di percorrenza: 45 minuti-1 ora fino all'ingresso del cratere", 'Punto forte: osservazione dei Big Five in una caldera vulcanica'],
      body: [
        "Dopo una colazione mattutina, scendi nel magnifico cratere del Ngorongoro, sito Patrimonio dell'Umanità UNESCO, spesso soprannominato l'« ottava meraviglia del mondo ». Questa immensa caldera è un rifugio per la fauna selvatica — tra cui elefanti, leoni, bufali, ippopotami, fenicotteri e il rinoceronte nero in pericolo. Goditi un picnic sul fondo del cratere prima di tornare al tuo lodge.",
      ],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Ngorongoro-Crater.jpg', alt: 'Game Drive al Cratere del Ngorongoro'},
      overnightStay: 'Ngorongoro Rhino Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Rhino-Lodge1.jpeg', alt: 'Ngorongoro Rhino Lodge'},
    },
    {
      day: 10,
      label: 'Parco Nazionale del Lago Manyara – Arusha',
      meta: ['Tempo di percorrenza: circa 1,5 ore di ritorno verso Arusha', 'Punto forte: leoni che si arrampicano sugli alberi e fenicotteri'],
      body: [
        "Inizia la tua mattinata con un tragitto verso il parco nazionale del lago Manyara, famoso per la sua rigogliosa foresta di acque sotterranee, il suo lago coperto di fenicotteri e i suoi leoni che si arrampicano sugli alberi. Questo parco compatto ma variegato è perfetto per un ultimo game drive rilassato. Dopo il pranzo, ritorna ad Arusha dove il tuo safari si conclude. Su richiesta, possiamo trasferirti in aeroporto per il tuo volo di coincidenza.",
      ],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lake-Manyara-National-Park.jpg', alt: 'Parco Nazionale del Lago Manyara – Arusha'},
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: comboFaqHeadingIt,
  faqIntro: comboFaqIntroIt,
  faqs: comboFaqsIt,
  hubSummary:
    "Un'avventura ben equilibrata che combina una scalata del Kilimangiaro di 7 giorni (come la route Machame) con un safari faunistico di 3 giorni — ideale per scoprire il meglio della montagna e della savana.",
  hubImage: {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Giorni Kilimangiaro e Safari'},
}

const combo11It: TripIt = {
  slug: '11-days-kilimanjaro-safari',
  category: 'combo',
  name: '11 Giorni Kilimangiaro e Safari',
  durationDays: 11,
  seoTitle: '11 Giorni Kilimangiaro e Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto combinato 11 Giorni Kilimangiaro e Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Tarangire, Cratere del Ngorongoro, Parco Nazionale del Lago Manyara',
  priceDisclaimer: comboPriceDisclaimerIt,
  overviewBody: [
    "Questo viaggio di 11 giorni unisce due dei più grandi tesori della Tanzania — la maestosa vetta del Monte Kilimangiaro e la bellezza grezza e indimenticabile dei suoi parchi nazionali. Con 8 giorni sulla route Lemosho, uno degli itinerari di trekking più panoramici e di maggior successo del Kilimangiaro, seguiti da 3 giorni di classico safari, questo itinerario offre una combinazione unica di sfida, scoperta e connessione profonda con la natura.",
  ],
  mapImage: {src: '/images/combo/11-days-kilimanjaro-safari/lemosho.png', alt: 'Mappa del 11 Giorni Kilimangiaro e Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '11 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '11 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '11 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '11 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '11 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '11 Giorni Kilimangiaro e Safari'},
  ],
  itinerary: [
    comboArrivalIt(),
    {
      day: 1,
      label: 'Da Lemosho Gate a Mti Mkubwa',
      meta: ['Altitudine: 2.100 m → 2.650 m', 'Dislivello positivo: 550 m (1.805 piedi)', 'Durata: 3-4 ore'],
      body: [
        "Dopo la colazione, guiderai da Arusha fino a Londorossi Gate per la registrazione. Poi proseguirai fino a Lemosho Gate, dove l'escursione inizia attraverso una rigogliosa foresta pluviale. Questa zona è ricca di fauna selvatica, con colobi bianchi e neri e uccelli forestali. Camminerai sotto una fitta chioma di alberi prima di arrivare a Mti Mkubwa (Big Tree) Camp per la notte.",
      ],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'Da Lemosho Gate a Mti Mkubwa'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/mti-mkubwa-1.webp', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'Da Mti Mkubwa Camp a Shira 1 Camp',
      meta: ['Mti Mkubwa Camp (2.650 m) – Shira 1 Camp (3.610 m)', 'Dislivello positivo: 960 m (3.150 piedi)', 'Durata: 6-7 ore'],
      body: [
        "Il sentiero di oggi sale progressivamente fuori dalla foresta pluviale verso la zona di erica e brughiera. Man mano che sali, gli alberi si diradano e il paesaggio si apre, offrendo viste magnifiche sulla cresta di Shira e sul picco Kibo. Dopo un'escursione pittoresca attraverso colline ondulate e formazioni rocciose vulcaniche, raggiungerai Shira 1 Camp sull'altopiano di Shira.",
      ],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'Da Mti Mkubwa Camp a Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'Da Shira 1 Camp a Shira 2 Camp',
      meta: ['Shira 1 Camp (3.610 m) – Shira 2 Camp (3.850 m)', 'Dislivello positivo: 240 m (787 piedi)', 'Durata: 3-4 ore'],
      body: [bodyShiraToBarrancoViaLavaTowerIt[0]],
      image: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Da Shira 1 Camp a Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Da Shira 2 Camp a Lava Tower e poi a Barranco Camp',
      meta: ['Shira 2 Camp (3.850 m) → Lava Tower (4.630 m) → Barranco Camp', 'Dislivello positivo: 780 m', 'Dislivello negativo: 654 m', 'Durata: 6-7 ore'],
      body: [
        "Sali costantemente fino all'imponente Lava Tower, dove ti fermerai per il pranzo. Scendi poi nella magnifica valle di Barranco per la notte. Questa è una delle giornate di acclimatazione più importanti dell'itinerario.",
      ],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'Da Shira 2 Camp a Lava Tower e poi a Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'Da Barranco Camp a Karanga Camp',
      meta: ['Barranco Camp (3.976 m) → Karanga Camp (4.035 m)', 'Dislivello positivo: 59 m / 194 piedi', 'Durata: 4-5 ore'],
      body: [
        'Scala la celebre Barranco Wall — impegnativa ma non tecnica. Continua attraverso un terreno alpino fino a Karanga Camp. Questa giornata più breve lascia al tuo corpo più tempo per acclimatarsi prima della notte di vetta.',
      ],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'Da Barranco Camp a Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'Da Karanga Camp a Barafu Camp',
      meta: ['Karanga Camp (4.035 m / 13.238 piedi) → Barafu Camp (4.703 m / 15.430 piedi)', 'Dislivello positivo: 668 m / 2.192 piedi', 'Durata: 3-4 ore'],
      body: [
        'Un trek breve ma ripido attraverso un deserto alpino d\'alta quota fino al tuo ultimo campo prima della notte di vetta. Riposati, idratati e preparati mentalmente alla sfida che ti attende.',
      ],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'Da Karanga Camp a Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/barafu-camp1.jpg', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Barafu Camp → Uhuru Peak → Mweka Camp',
      meta: [
        'Barafu Camp (4.703 m / 15.430 piedi) → Uhuru Peak (5.895 m / 19.341 piedi) → Mweka Camp (3.720 m / 12.205 piedi)',
        'Dislivello positivo: 1.192 m / 3.910 piedi',
        'Dislivello negativo: 2.175 m / 7.136 piedi',
        'Durata: 12-14 ore',
      ],
      body: [
        "Inizia la tua spinta verso la vetta a mezzanotte. Raggiungi Stella Point all'alba, poi continua verso Uhuru Peak — il punto più alto d'Africa. Dopo aver festeggiato in vetta, scendi fino a Mweka Camp.",
      ],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Barafu Camp → Uhuru Peak → Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp → Mweka Gate',
      meta: ['Mweka Camp (3.720 m / 12.205 piedi) → Mweka Gate (1.640 m / 5.380 piedi)', 'Dislivello negativo: 2.080 m / 6.824 piedi', 'Durata: 3-4 ore'],
      body: [
        "Attraversa una rigogliosa foresta pluviale fino all'ingresso del parco, dove riceverai il tuo certificato del Kilimangiaro. Il tuo autista ti trasferirà al tuo hotel per una doccia calda e un riposo ben meritato.",
      ],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp → Mweka Gate'},
      overnightStay: 'Lodge ad Arusha',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/Kaliwa-Lodge.jpg', alt: 'Lodge ad Arusha'},
    },
    {
      day: 9,
      label: 'Parco Nazionale di Tarangire',
      meta: ['Tempo di percorrenza: circa 2,5 ore da Arusha', 'Punto forte: mandrie di elefanti e antichi baobab'],
      body: [
        "Parti da Arusha dopo colazione e dirigiti direttamente verso il parco nazionale di Tarangire, rinomato per i suoi paesaggi spettacolari punteggiati di baobab e le sue importanti popolazioni di elefanti. Il parco ospita leoni, giraffe, zebre, gnu e oltre 500 specie di uccelli. Dopo una giornata completa di game drive, raggiungerai il tuo lodge vicino al lago Manyara o a Karatu per la cena e il pernottamento.",
      ],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/Gallery-img04-1.webp', alt: 'Parco Nazionale di Tarangire'},
      overnightStay: 'Lodge a Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Lodge a Karatu'},
    },
    {
      day: 10,
      label: 'Cratere del Ngorongoro',
      meta: ["Tempo di percorrenza: 45 minuti-1 ora fino all'ingresso del cratere", 'Punto forte: osservazione dei Big Five in una caldera vulcanica'],
      body: [
        "Dopo una colazione mattutina, scendi nel magnifico cratere del Ngorongoro, sito Patrimonio dell'Umanità UNESCO, spesso soprannominato l'« ottava meraviglia del mondo ». Questa immensa caldera è un rifugio per la fauna selvatica — tra cui elefanti, leoni, bufali, ippopotami, fenicotteri e il rinoceronte nero in pericolo. Goditi un picnic sul fondo del cratere prima di tornare al tuo lodge.",
      ],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Cratere del Ngorongoro'},
      overnightStay: 'Stesso lodge a Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Stesso lodge a Karatu'},
    },
    {
      day: 11,
      label: 'Parco Nazionale del Lago Manyara – Arusha',
      meta: ['Tempo di percorrenza: circa 1,5 ore di ritorno verso Arusha', 'Punto forte: leoni che si arrampicano sugli alberi e fenicotteri'],
      body: [
        "Inizia la tua mattinata con un tragitto verso il parco nazionale del lago Manyara, famoso per la sua rigogliosa foresta di acque sotterranee, il suo lago coperto di fenicotteri e i suoi leoni che si arrampicano sugli alberi. Questo parco compatto ma variegato è perfetto per un ultimo game drive rilassato. Dopo il pranzo, ritorna ad Arusha dove il tuo safari si conclude. Facoltativamente, possiamo trasferirti in aeroporto per il tuo volo di coincidenza.",
      ],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/zebra.jpg', alt: 'Parco Nazionale del Lago Manyara – Arusha'},
    },
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: comboFaqHeadingIt,
  faqIntro: comboFaqIntroIt,
  faqs: comboFaqsIt,
  hubSummary:
    "Questa opzione ti lascia il tempo di acclimatarti correttamente durante una scalata di 7 giorni, per poi rilassarti con un safari di 4 giorni attraverso il Serengeti, il Ngorongoro e altri parchi imperdibili.",
  hubImage: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: '11 Giorni Kilimangiaro e Safari'},
}

const combo12It: TripIt = {
  slug: '12-days-kilimanjaro-safari',
  category: 'combo',
  name: '12 Giorni Kilimangiaro e Safari',
  durationDays: 12,
  seoTitle: '12 Giorni Kilimangiaro e Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il pacchetto combinato 12 Giorni Kilimangiaro e Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Parco Nazionale di Tarangire, Parco Nazionale del Serengeti, Cratere del Ngorongoro',
  priceDisclaimer: comboPriceDisclaimerIt,
  overviewBody: [
    "Questa avventura di 12 giorni unisce la pittoresca route Lemosho verso il Monte Kilimangiaro a un safari completo del circuito nord attraverso Tarangire, il Serengeti e il cratere del Ngorongoro. Iniziando sui versanti ovest isolati della montagna, la scalata offre una partenza più tranquilla, ecosistemi variegati e un'eccellente acclimatazione durante otto giorni in montagna.",
    "Dopo il tuo tentativo di vetta, prosegui direttamente con quattro giorni di game drive — inseguendo elefanti e baobab a Tarangire, trascorrendo una giornata intera a seguire la migrazione degli gnu e i grandi felini attraverso le pianure infinite del Serengeti, per poi scendere nel cratere del Ngorongoro, spesso soprannominato l'« ottava meraviglia del mondo », prima di tornare ad Arusha.",
  ],
  mapImage: {src: '/images/combo/12-days-kilimanjaro-safari/lemosho4.png', alt: 'Mappa del 12 Giorni Kilimangiaro e Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '12 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '12 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '12 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/simba-camp-2.jpg', alt: '12 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro-climb.webp', alt: '12 Giorni Kilimangiaro e Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Giorni Kilimangiaro e Safari'},
  ],
  itinerary: [
    comboArrivalIt(),
    {
      day: 1,
      label: 'Da Londorossi Gate a Mti Mkubwa Camp',
      meta: ['Lemosho Gate (2.100 m / 6.890 piedi) → Mti Mkubwa (2.650 m / 8.694 piedi)', 'Dislivello positivo: 550 m / 1.804 piedi', 'Durata: 3-4 ore'],
      body: [
        "Inizia la tua scalata del Kilimangiaro con un tragitto panoramico fino a Londorossi Gate, dove vengono gestiti i permessi e la registrazione. Dall'ingresso, un breve tragitto attraverso la foresta montana ti conduce al punto di partenza a Lemosho. Il trek fino a Mti Mkubwa (Big Tree Camp) ti conduce attraverso una rigogliosa foresta pluviale, che ospita cercopitechi blu e una grande varietà di uccelli.",
      ],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'Da Londorossi Gate a Mti Mkubwa Camp'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/mti-mkubwa-camp-scaled.jpg', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'Da Mti Mkubwa Camp a Shira 1 Camp',
      meta: ['Mti Mkubwa (2.650 m / 8.694 piedi) → Shira 1 Camp (3.610 m / 11.843 piedi)', 'Dislivello positivo: 960 m / 3.150 piedi', 'Durata: 5-6 ore'],
      body: [
        "Oggi emergerai dalla foresta verso la zona di erica e brughiera, salendo costantemente verso la cresta di Shira e ridiscendendo leggermente per accamparti sull'altopiano di Shira, con vista sui versanti superiori del Kilimangiaro.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro_climbing-1.jpg', alt: 'Da Mti Mkubwa Camp a Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/second-camp.webp', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'Da Shira 1 Camp a Shira 2 Camp',
      meta: ['Shira 1 (3.610 m / 11.843 piedi) → Shira 2 Camp (3.850 m / 12.631 piedi)', 'Dislivello positivo: 240 m / 787 piedi', 'Durata: 3-4 ore'],
      body: [
        "Una giornata più breve per favorire l'acclimatazione, attraversando il pittoresco altopiano di Shira. Ti godrai ampie viste e un ritmo rilassato fino a Shira 2 Camp.",
      ],
      image: {src: '/images/combo/shared/shira-camp.webp', alt: 'Da Shira 1 Camp a Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Da Shira 2 Camp a Barranco Camp (via Lava Tower)',
      meta: [
        'Shira 2 (3.850 m / 12.631 piedi) → Lava Tower (4.630 m / 15.190 piedi) → Barranco Camp (3.976 m / 13.044 piedi)',
        'Dislivello positivo: 780 m / 2.559 piedi',
        'Dislivello negativo: 654 m / 2.145 piedi',
        'Durata: 6-7 ore',
      ],
      body: [
        "Salire in alto, dormire in basso — questa giornata di acclimatazione essenziale ti porta a Lava Tower per il pranzo prima di scendere nella verdeggiante valle di Barranco. Una giornata spettacolare con paesaggi in costante evoluzione.",
      ],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'Da Shira 2 Camp a Barranco Camp (via Lava Tower)'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'Da Barranco Camp a Karanga Camp',
      meta: ['Barranco (3.976 m / 13.044 piedi) → Karanga Camp (3.995 m / 13.107 piedi)', 'Dislivello positivo: 240 m / 787 piedi', 'Dislivello negativo: 220 m / 722 piedi', 'Durata: 4-5 ore'],
      body: [
        "Affronta l'imponente Barranco Wall, un momento clou del trek, poi attraversa creste e valli prima di raggiungere Karanga Camp. Un'altra giornata importante per l'acclimatazione.",
      ],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'Da Barranco Camp a Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'Da Karanga Camp a Barafu Camp',
      meta: ['Karanga (3.995 m / 13.107 piedi) → Barafu Camp (4.673 m / 15.331 piedi)', 'Dislivello positivo: 678 m / 2.224 piedi', 'Durata: 3-4 ore'],
      body: [
        "Salirai attraverso il deserto alpino per raggiungere Barafu, il tuo campo base per il tentativo di vetta. Riposati, idratati e preparati mentalmente per la scalata di mezzanotte verso la vetta d'Africa.",
      ],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'Da Karanga Camp a Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/barafu-camp-1.webp', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp',
      meta: [
        'Barafu (4.673 m / 15.331 piedi) → Uhuru Peak (5.895 m / 19.341 piedi) → Mweka Camp (3.110 m / 10.204 piedi)',
        'Dislivello positivo: 1.222 m / 4.010 piedi',
        'Dislivello negativo: 2.785 m / 9.137 piedi',
        'Durata: 12-14 ore',
      ],
      body: [
        "Giorno della vetta! Parti prima di mezzanotte per raggiungere Stella Point all'alba e spingiti fino a Uhuru Peak. Dopo aver festeggiato in vetta, ridiscendi a Barafu per una breve pausa, poi continua verso Mweka Camp per un riposo ben meritato.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/solo-climb.jpeg', alt: 'Da Barafu Camp a Uhuru Peak e poi a Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Da Mweka Camp a Mweka Gate',
      meta: ['Mweka Camp (3.110 m / 10.204 piedi) → Mweka Gate (1.640 m / 5.380 piedi)', 'Dislivello negativo: 1.470 m / 4.823 piedi', 'Durata: 3-4 ore'],
      body: [
        "Goditi la tua ultima escursione attraverso la foresta pluviale. Al tuo arrivo all'ingresso del parco, ricevi il tuo certificato di vetta e torna al tuo hotel con ricordi per tutta la vita.",
      ],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Da Mweka Camp a Mweka Gate'},
      overnightStay: 'Hotel ad Arusha',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Hotel ad Arusha'},
    },
    {
      day: 9,
      label: 'Arusha – Parco Nazionale di Tarangire',
      meta: ['Circa 2,5 ore di strada da Arusha', 'Punto forte: mandrie di elefanti, baobab e atmosfera fuori dai sentieri battuti'],
      body: [
        "Dopo la colazione ad Arusha, la tua guida safari di Asili ti raggiungerà per il tragitto verso il parco nazionale di Tarangire, uno dei gioielli più sottovalutati della Tanzania. Spesso trascurato a favore del Serengeti, Tarangire sorprende i visitatori con la sua bellezza selvaggia, i suoi immensi baobab e la sua notevole densità di elefanti. Durante la stagione secca, il fiume Tarangire attira innumerevoli animali, creando scene faunistiche emozionanti.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/elephant-tara.jpg', alt: 'Arusha – Parco Nazionale di Tarangire'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 10,
      label: 'Tarangire – Parco Nazionale del Serengeti',
      meta: ['Circa 4-5 ore di strada attraverso gli altopiani del Ngorongoro', 'Punto forte: pianure del Serengeti e paesaggi ricchi di predatori'],
      body: [
        "Dopo la colazione, il tuo viaggio prosegue attraverso l'area di conservazione del Ngorongoro in direzione del Serengeti. Lungo il percorso, goditi viste panoramiche e villaggi masai prima di entrare nel parco tramite Naabi Hill Gate. Una volta dentro, inizierai il tuo game drive al Serengeti, con l'occasione di avvistare i grandi felini, mandrie di gnu, giraffe e molto altro.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/wildebeest-migration-serengeti.jpg', alt: 'Tarangire – Parco Nazionale del Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 11,
      label: 'Giornata Completa di Game Drive al Serengeti',
      meta: ["Itinerario flessibile in base all'attività della fauna selvatica", 'Punto forte: una giornata completa di osservazione della grande fauna e ricerca dei predatori'],
      body: [
        "Alzati presto per una giornata completa di osservazione della fauna selvatica nel parco nazionale del Serengeti, rinomato per le sue pianure aperte e le sue spettacolari interazioni tra predatori e prede. A seconda della stagione, la tua guida ti orienterà verso le zone più attive — che sia a Seronera, Ndutu, o più a nord. Osserva leoni che inseguono bufali, leopardi che riposano sugli alberi, ed elefanti che si bagnano nei fiumi stagionali.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/lion-serengeti1.jpg', alt: 'Giornata Completa di Game Drive al Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 12,
      label: 'Serengeti – Cratere del Ngorongoro – Arusha',
      meta: ['Tragitto di una giornata intera con discesa nel cratere (tempo di percorrenza totale: 7-8 ore)', "Punto forte: osservazione dei Big Five e del rinoceronte nero all'interno del cratere"],
      body: [
        "Dopo una colazione mattutina, lascerai il Serengeti per raggiungere il cratere del Ngorongoro, dove scenderai nella più grande caldera vulcanica intatta del mondo. Trascorri la giornata esplorando questo anfiteatro naturale popolato da leoni, elefanti, fenicotteri, sciacalli e persino rinoceronti. Dopo un picnic vicino a un punto d'acqua per ippopotami, risali e inizia il tuo ritorno verso Arusha, dove arriverai in serata.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/rhino.jpg', alt: 'Serengeti – Cratere del Ngorongoro – Arusha'},
    },
    departureIt,
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: comboFaqHeadingIt,
  faqIntro: comboFaqIntroIt,
  faqs: [
    {
      question: 'Cosa è incluso nel pacchetto Kilimangiaro e safari di 12 giorni?',
      answer:
        "Il tuo pacchetto comprende i trasferimenti aeroportuali, l'alloggio in hotel ad Arusha, un trek del Kilimangiaro interamente guidato (con tasse di parco, portatori, tende, pasti e guide di montagna certificate), oltre a un safari faunistico privato di 4 giorni con tasse d'ingresso ai parchi, alloggio in lodge, pasti, un veicolo da safari 4×4 e una guida professionale. Voli internazionali, mance e spese personali non sono inclusi.",
    },
    {
      question: '12 giorni bastano per godersi sia il Kilimangiaro che un safari?',
      answer:
        "Sì, 12 giorni sono l'ideale. Avrai 7 o 8 giorni per scalare il Kilimangiaro in sicurezza (tramite itinerari come Lemosho o Machame), seguiti da un safari di 4 giorni attraverso i parchi più emblematici della Tanzania, come il Serengeti, il cratere del Ngorongoro e Tarangire. Scoprirai il meglio della montagna e della fauna selvatica in un'unica avventura.",
    },
    {
      question: 'Qual è il periodo migliore per fare questo viaggio di 12 giorni?',
      answer:
        "I mesi migliori sono da gennaio a inizio marzo e da giugno a ottobre, quando le condizioni sono favorevoli sia per il trek del Kilimangiaro sia per l'osservazione della fauna in safari. Queste sono le stagioni secche della Tanzania, che offrono cieli più limpidi ed eccellenti osservazioni della fauna.",
    },
    {
      question: 'La scalata del Kilimangiaro è fisicamente impegnativa?',
      answer:
        "Scalare il Kilimangiaro è un trek non tecnico, ma è fisicamente impegnativo a causa dell'alta quota. Una buona condizione fisica, una determinazione mentale e un'adeguata acclimatazione (che garantiamo con itinerari più lunghi come Lemosho) sono essenziali per raggiungere la vetta con successo. Non è richiesta alcuna esperienza di arrampicata pregressa.",
    },
    {
      question: "Posso noleggiare l'attrezzatura per il Kilimangiaro se non la possiedo tutta?",
      answer:
        "Sì. Asili Climbing Kilimanjaro offre il noleggio di attrezzatura di alta qualità come sacchi a pelo, piumini, bastoncini da trekking, lampade frontali e molto altro. Ti verrà fornita una lista completa dell'attrezzatura consigliata, e puoi pre-prenotare qualsiasi articolo a noleggio di cui hai bisogno.",
    },
    {
      question: 'Che tipo di alloggio avrò durante il safari?',
      answer:
        "Utilizziamo lodge e campi tendati accuratamente selezionati, puliti, confortevoli e situati vicino ai parchi per il massimo accesso alla fauna selvatica. Che siano di fascia media o di lusso, tutti offrono camere con bagno privato, una buona cucina e un'ospitalità calorosa.",
    },
    {
      question: 'Sarò in un gruppo o si tratta di un circuito privato?',
      answer:
        "La maggior parte dei nostri combinati Kilimangiaro e safari sono circuiti privati, progettati specificamente per te o il tuo gruppo. Questo consente maggiore flessibilità nel ritmo, un'attenzione personalizzata e un'esperienza su misura, sia in montagna che in safari.",
    },
    {
      question: 'Il mal acuto di montagna è frequente, e come lo gestite?',
      answer:
        "Il mal acuto di montagna può colpire chiunque, indipendentemente dal livello di forma fisica. Monitoriamo la tua salute quotidianamente in montagna tramite pulsossimetri e guide esperte formate nel primo soccorso in alta quota. Itinerari più lunghi come la route Lemosho in 8 giorni migliorano l'acclimatazione e il successo in vetta. Nei casi gravi, sono predisposti protocolli di evacuazione d'emergenza.",
    },
    {
      question: 'Che tipo di cibo viene servito durante la scalata e il safari?',
      answer:
        "Sul Kilimangiaro, i nostri cuochi di montagna preparano pasti caldi e nutrienti ogni giorno — aspettati zuppe, riso, pasta, verdure, piatti di carne e frutta. Le diete vegetariane e particolari vengono prese in considerazione. In safari, i lodge offrono pasti a buffet o à la carte con opzioni africane e internazionali.",
    },
    {
      question: "Ho bisogno di un'assicurazione di viaggio?",
      answer:
        "Sì, un'assicurazione di viaggio completa è obbligatoria. La tua polizza deve coprire le emergenze mediche, l'evacuazione (anche dall'alta quota), le cancellazioni di viaggio e i ritardi. Possiamo consigliarti assicuratori affidabili se non sei sicuro.",
    },
    {
      question: 'Come mi preparo fisicamente per questo viaggio?',
      answer:
        "Inizia un piano di allenamento 8-12 settimane prima della partenza, che includa cardio, escursionismo con uno zaino e rafforzamento muscolare. Escursioni nel fine settimana e lunghe camminate con dislivello aiuteranno a preparare le tue gambe e i tuoi polmoni alle esigenze del Kilimangiaro.",
    },
    {
      question: 'Come prenoto questa esperienza di 12 giorni con Asili Climbing Kilimanjaro?',
      answer:
        "Prenotare è semplice! Contattaci semplicemente tramite il nostro sito web o WhatsApp, e uno dei nostri specialisti ti aiuterà a personalizzare il tuo viaggio Kilimangiaro e safari. Un acconto del 20-30% assicura il tuo posto, e ti accompagneremo in ogni fase fino al tuo arrivo in Tanzania.",
    },
  ],
  hubSummary:
    "Un'esperienza completa per gli amanti della natura. Scala la vetta più alta d'Africa in 8 giorni (come la route Lemosho) e prosegui con 4 giorni indimenticabili a caccia di fauna selvatica in safari.",
  hubImage: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Giorni Kilimangiaro e Safari'},
}

// ---------------------------------------------------------------------------
// 2 safaris (days 1-7 are identical across both safari itineraries)
// ---------------------------------------------------------------------------

const safariSharedDays1to7It: SafariDayIt[] = [
  {
    day: 1,
    label: 'Arusha - Parco Nazionale di Tarangire',
    image: {src: '/images/safari/shared/elephant-tara.jpg', alt: 'Arusha - Parco Nazionale di Tarangire'},
    body: [
      [
        {text: 'La mattina dopo colazione:', bold: true},
        {text: " La nostra guida safari verrà a prenderti al tuo hotel nella città di Arusha. Percorrerai poi circa 120 km, quasi 2 ore di strada, in direzione del parco nazionale di Tarangire."},
      ],
      [
        {text: 'Parco Nazionale di Tarangire:', bold: true},
        {text: " Il parco nazionale di Tarangire è rinomato per le sue grandi mandrie di elefanti che vagano liberamente vicino alle rive del fiume Tarangire, che rappresentano veramente un safari familiare in Tanzania, insieme a molte altre creature. Scopriremo le paludi stagionali (zone umide), la savana e il fiume Tarangire, che svolgono un ruolo essenziale nell'ecosistema del parco nazionale di Tarangire e attirano gli animali durante la stagione secca."},
      ],
      [
        {text: 'Osservazione della fauna selvatica:', bold: true},
        {text: " Osserveremo quanti più animali possibile, tra cui leoni, zebre, manguste, oritteropi, gnu, bufali, elefanti e giraffe (per citarne solo alcuni). Potremmo anche intravedere brevemente leoni e leopardi."},
      ],
      [
        {text: 'Picnic e game drive:', bold: true},
        {text: ' La nostra guida safari professionale ed esperta sceglierà un luogo adatto per un delizioso pranzo nel sito pic-nic designato. In seguito, riprenderai il game drive fino a tarda sera.'},
      ],
      [
        {text: 'Trasferimento serale:', bold: true},
        {text: ' In serata, sarai trasferito a uno dei nostri hotel partner accuratamente selezionati per la cena e il pernottamento.'},
      ],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 2,
    label: 'Parco Nazionale del Serengeti',
    image: {src: '/images/safari/shared/lake-manyara.webp', alt: 'Parco Nazionale del Serengeti'},
    body: [
      [
        {
          text: "La mattina dopo colazione, inizierai il tuo safari verso le pianure infinite del parco nazionale del Serengeti, dove avrai una vista del cratere del Ngorongoro dal punto panoramico del Ngorongoro prima di proseguire verso il parco nazionale del Serengeti (che raggiungerai nel pomeriggio). La nostra guida safari professionale ed esperta sceglierà un buon momento per un delizioso pranzo accompagnato da un po' di vino frizzante in mezzo a paesaggi magnifici.",
        },
      ],
      [
        {
          text: "Il parco nazionale del Serengeti è famoso per la sua variegata fauna residente, inclusi i « Big Five », ben noti in quanto sono i cinque trofei animali più emblematici ricercati dai cacciatori. Il Serengeti ospiterebbe la più grande popolazione di leoni d'Africa (circa 2.950), grazie alla diversità delle prede che vi abitano.",
        },
      ],
      [{text: "Il leopardo, elusivo, viene frequentemente osservato nella regione di Seronera, ma lo si trova in tutto il parco. La sua popolazione è stimata in circa 1.000 individui."}],
      [{text: 'Attività di safari opzionale:', bold: true}, {text: ' Safari in mongolfiera nel Serengeti (600 $ USA a persona)'}],
      [{text: 'Dopo il game drive, raggiungerai il tuo alloggio per la cena e il pernottamento.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 3,
    label: 'Parco Nazionale del Serengeti',
    image: {src: '/images/safari/shared/honeymoon1.jpg', alt: 'Parco Nazionale del Serengeti'},
    body: [
      [
        {
          text: "La mattina dopo colazione, inizierai il tuo safari verso le pianure infinite del parco nazionale del Serengeti, dove avrai una vista del cratere del Ngorongoro dal punto panoramico del Ngorongoro prima di proseguire verso il parco nazionale del Serengeti (che raggiungerai nel pomeriggio). La nostra guida safari professionale ed esperta sceglierà un buon momento per un delizioso pranzo accompagnato da un po' di vino frizzante in mezzo a paesaggi magnifici.",
        },
      ],
      [
        {
          text: "Il parco nazionale del Serengeti è famoso per la sua variegata fauna residente, inclusi i « Big Five », ben noti in quanto sono i cinque trofei animali più emblematici ricercati dai cacciatori. Il Serengeti ospiterebbe la più grande popolazione di leoni d'Africa (circa 2.950), grazie alla diversità delle prede che vi abitano.",
        },
      ],
      [{text: "Il leopardo, elusivo, viene frequentemente osservato nella regione di Seronera, ma lo si trova in tutto il parco. La sua popolazione è stimata in circa 1.000 individui."}],
      [{text: 'Attività di safari opzionale:', bold: true}, {text: ' Safari in mongolfiera nel Serengeti (600 $ USA a persona)'}],
      [{text: 'Dopo il game drive, raggiungerai il tuo alloggio per la cena e il pernottamento.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 4,
    label: 'Parco Nazionale del Serengeti / Cratere del Ngorongoro',
    image: {src: '/images/safari/shared/h.jpg', alt: 'Parco Nazionale del Serengeti / Cratere del Ngorongoro'},
    body: [
      [
        {
          text: "La mattina dopo colazione, lascerai il campo con un picnic preparato per il cratere del Ngorongoro. Quest'area si trova a ovest della regione di Arusha, nella zona geologica dei Crater Highlands in Tanzania.",
        },
      ],
      [
        {
          text: 'Al tuo arrivo sul bordo del cratere, avrai un primo assaggio di ciò che ti attende il giorno seguente sulla prateria aperta, con un gran numero di animali che hai visto nei documentari di National Geographic. Nel cratere, avrai numerose possibilità di osservare i « Big Five » (leone, leopardo, elefante, bufalo e rinoceronte), a seconda della tua fortuna.',
        },
      ],
      [
        {
          text: 'Nel pomeriggio, il pranzo ti verrà servito in un sito pic-nic appositamente designato, poi partirai per un game drive pomeridiano fino a tarda sera. La cena e il pernottamento si svolgeranno al lodge.',
        },
      ],
      [{text: 'Attività di safari opzionale:', bold: true}],
      [{text: 'Visita alle gole di Olduvai e al suo museo (40 $ USA a persona)'}],
      [{text: 'Escursione a piedi sul bordo del cratere del Ngorongoro (30 $ USA a persona)'}],
      [{text: 'Visita a un villaggio masai (50 $ USA a veicolo)'}],
    ],
    overnightStay: 'Ngorongoro Rhino Lodge',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 5,
    label: 'Cratere del Ngorongoro',
    image: {src: '/images/safari/shared/ngorongoro.jpg', alt: 'Cratere del Ngorongoro'},
    body: [
      [
        {
          text: "Dopo una colazione mattutina, scendi nel magnifico cratere del Ngorongoro, sito Patrimonio dell'Umanità UNESCO, spesso soprannominato l'« ottava meraviglia del mondo ». Questa immensa caldera è un rifugio per la fauna selvatica — tra cui elefanti, leoni, bufali, ippopotami, fenicotteri e il rinoceronte nero in pericolo.",
        },
      ],
      [{text: 'Goditi un pranzo pic-nic sul fondo del cratere prima di risalire verso il tuo lodge per la notte.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 6,
    label: 'Parco Nazionale del Lago Manyara',
    image: {src: '/images/safari/shared/manyara.jpg', alt: 'Parco Nazionale del Lago Manyara'},
    body: [
      [
        {
          text: "La mattina dopo colazione, sarai prelevato dal tuo lodge e condotto al parco nazionale del lago Manyara (circa 30 minuti). Il parco è un terreno di gioco ideale per gli appassionati di fotografia e offre alcune delle migliori osservazioni di fauna selvatica al mondo. Potrai avvistare molti animali emblematici d'Africa, con i celebri leoni che si arrampicano sugli alberi come soggetto ideale per gli amanti della fotografia. Questi predatori iconici si crogiolano sulle acacie, come se aspettassero di essere fotografati.",
        },
      ],
      [
        {
          text: "Gli ornitologi e gli appassionati di uccelli troveranno anche nel lago Manyara una destinazione perfetta, con un'ampia varietà di specie di uccelli visibili nel parco. Anche gli ornitologi esperti rimarranno stupiti da un grande stormo di fenicotteri, rapaci che volteggiano nel cielo, e lo splendido gruccione dal codino lungo dai colori vivaci.",
        },
      ],
      [{text: 'Il pranzo verrà servito nel parco nel sito pic-nic, e nel pomeriggio farai ritorno verso Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 7,
    label: 'Parco Nazionale del Lago Manyara',
    image: {src: '/images/safari/shared/e7636d2be5e1edef3f8c3756db7fe4d5df583879-1600x1067-1-1.jpg', alt: 'Parco Nazionale del Lago Manyara'},
    body: [
      [
        {
          text: "La mattina dopo colazione, sarai prelevato dal tuo lodge e condotto al parco nazionale del lago Manyara (circa 30 minuti). Il parco è un terreno di gioco ideale per gli appassionati di fotografia e offre alcune delle migliori osservazioni di fauna selvatica al mondo. Potrai avvistare molti animali emblematici d'Africa, con i celebri leoni che si arrampicano sugli alberi come soggetto ideale per gli amanti della fotografia. Questi predatori iconici si crogiolano sulle acacie, come se aspettassero di essere fotografati.",
        },
      ],
      [
        {
          text: "Gli ornitologi e gli appassionati di uccelli troveranno anche nel lago Manyara una destinazione perfetta, con un'ampia varietà di specie di uccelli visibili nel parco. Anche gli ornitologi esperti rimarranno stupiti da un grande stormo di fenicotteri, rapaci che volteggiano nel cielo, e lo splendido gruccione dal codino lungo dai colori vivaci.",
        },
      ],
      [{text: 'Il pranzo verrà servito nel parco nel sito pic-nic, e nel pomeriggio farai ritorno verso Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
]

const safari15It: SafariIt = {
  slug: '15-days-tanzania-safari',
  name: '15 Giorni Safari in Tanzania',
  durationDays: 15,
  seoTitle: '15 Giorni Safari in Tanzania | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il safari di 15 giorni in Tanzania.',
  stopsLine: 'Parco Nazionale di Tarangire, Parco Nazionale del Serengeti, Cratere del Ngorongoro, Parco Nazionale del Lago Manyara, Zanzibar',
  overviewBody: [
    "Questo safari di 15 giorni in Tanzania unisce un classico game drive del circuito nord — Tarangire, il Serengeti, il cratere del Ngorongoro e il lago Manyara — a un soggiorno prolungato sulle spiagge di Zanzibar, lasciandoti il tempo per un vero safari faunistico e una rilassante fuga insulare in un unico viaggio.",
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Mappa dell\'itinerario del circuito nord'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Migrazione degli gnu nel Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Cultura masai in Tanzania'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: "Zebre che si abbeverano a un punto d'acqua"},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Giraffa in safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Lodge di safari di lusso'},
  ],
  itinerary: [
    ...safariSharedDays1to7It,
    {
      day: 8,
      label: 'Arrivo a Zanzibar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Arrivo a Zanzibar'},
      body: [
        [
          {
            text: "Vola da Arusha a Zanzibar e trasferisciti al tuo hotel sul mare, dove il resto della giornata è libero per sistemarti e rilassarti sulle rive dell'oceano Indiano.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 9,
      label: 'Zanzibar',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: 'Zanzibar'},
      body: [
        [
          {
            text: "Una giornata libera a Zanzibar per rilassarti in spiaggia, oppure organizzare un'escursione opzionale a Stone Town, in una piantagione di spezie, o di snorkeling tramite il tuo hotel ospitante.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 10,
      label: 'Estensione mare a Zanzibar (giorni 10-14)',
      body: [
        [
          {
            text: "Trascorri cinque giorni senza fretta rilassandoti sulle spiagge di Zanzibar, con il tempo di esplorare i vicoli tortuosi di Stone Town, fare una visita opzionale a una piantagione di spezie, o fare snorkeling al largo della costa — al tuo ritmo, restando nello stesso hotel sul mare.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
    },
    {
      day: 15,
      label: 'Partenza',
      body: [
        [
          {
            text: 'Trasferimento in aeroporto per il tuo volo di ritorno, che segna la fine del tuo safari in Tanzania e della tua fuga a Zanzibar.',
          },
        ],
      ],
    },
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: comboFaqHeadingIt,
  faqIntro: comboFaqIntroIt,
  faqs: sharedSafariFaqsIt,
}

const safari10HoneymoonIt: SafariIt = {
  slug: '10-days-tanzania-luxury-honeymoon-safaris',
  name: '10 Giorni Safari di Lusso Luna di Miele in Tanzania',
  durationDays: 10,
  seoTitle: '10 Giorni Safari di Lusso Luna di Miele in Tanzania | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinerario giorno per giorno reale, tariffe e prestazioni incluse per il safari di lusso luna di miele di 10 giorni in Tanzania.',
  stopsLine: 'Parco Nazionale di Tarangire, Parco Nazionale del Serengeti, Cratere del Ngorongoro, Parco Nazionale del Lago Manyara, Zanzibar',
  overviewBody: [
    "Il safari di lusso Asilia Tanzania di 10 giorni è pensato per offrirti un'esperienza unica, dalle variegate culture locali alla fauna selvatica e ai paesaggi impressionanti e mozzafiato — un classico game drive del circuito nord attraverso il parco nazionale di Tarangire, il Serengeti, il lago Manyara e il cratere del Ngorongoro, seguito da un rilassante soggiorno sulle spiagge di Zanzibar.",
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Mappa dell\'itinerario del circuito nord'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Migrazione degli gnu nel Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Cultura masai in Tanzania'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: "Zebre che si abbeverano a un punto d'acqua"},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Giraffa in safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Lodge di safari di lusso'},
  ],
  itinerary: [
    ...safariSharedDays1to7It,
    {
      day: 8,
      label: 'Arrivo a Zanzibar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Arrivo a Zanzibar'},
      body: [
        [
          {
            text: "Vola da Arusha a Zanzibar e trasferisciti al tuo hotel sul mare, dove il resto della giornata è libero per sistemarti e rilassarti sulle rive dell'oceano Indiano.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 9,
      label: 'Zanzibar',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: 'Zanzibar'},
      body: [
        [
          {
            text: "Una giornata libera a Zanzibar per rilassarti in spiaggia, oppure organizzare un'escursione opzionale a Stone Town, in una piantagione di spezie, o di snorkeling tramite il tuo hotel ospitante.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 10,
      label: 'Partenza',
      body: [
        [{text: "Trasferimento in aeroporto per il tuo volo di ritorno, che segna la fine del tuo safari luna di miele in Tanzania."}],
      ],
    },
  ],
  includes: includesVariantBIt,
  excludes: excludesVariantBIt,
  faqHeading: comboFaqHeadingIt,
  faqIntro: comboFaqIntroIt,
  faqs: sharedSafariFaqsIt,
}

async function seedSafariIt(data: SafariIt) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await safariDayToDoc(stop))
  await upsertTripIt(data.slug, {
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
  await seedTripIt(machame7It)
  await seedTripIt(machame6It)
  await seedTripIt(marangu5It)
  await seedTripIt(marangu6It)
  await seedTripIt(lemosho7It)
  await seedTripIt(lemosho8It)
  await seedTripIt(rongai7It)
  await seedTripIt(umbwe6It)
  await seedTripIt(northernCircuit9It)
  await seedTripIt(combo9It)
  await seedTripIt(combo10It)
  await seedTripIt(combo11It)
  await seedTripIt(combo12It)
  await seedSafariIt(safari15It)
  await seedSafariIt(safari10HoneymoonIt)
  console.log('done — all 15 trips seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
