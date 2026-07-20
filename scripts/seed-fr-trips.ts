/**
 * Phase 5: French translations for the 15 unified `trip` documents
 * (9 Kilimanjaro packages, 4 combo packages, 2 safaris).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-trips.ts --with-user-token
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

interface FaqFr {
  question: string
  answer: string
}

interface ItineraryDayFr {
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

interface SafariDayFr {
  day: number
  label: string
  image?: Img
  body: {text: string; bold?: boolean}[][]
  overnightStay?: string
  accommodationTiers?: string[]
}

const seo = (title: string, description: string) => ({_type: 'seo', title, description})

const faqs = (items: FaqFr[]) =>
  items.map((f) => ({_type: 'faqItem', _key: key(), question: f.question, answer: f.answer}))

const paragraphBlock = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

async function dayToDoc(stop: ItineraryDayFr) {
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

async function safariDayToDoc(stop: SafariDayFr) {
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

async function upsertTripFr(slug: string, fields: Record<string, unknown>) {
  const enId = await findEnId(client, 'trip', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const frId = await upsertTranslatedDoc(client, 'trip', slug, 'fr', fields)
  await linkTranslationMetadata(client, 'trip', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`${slug}-fr done (${frId})`)
}

// ---------------------------------------------------------------------------
// Shared fragments (translated once, reused verbatim across trips — mirrors
// the English source's own reuse of `arrival`/`departure`/`includesVariantX`).
// ---------------------------------------------------------------------------

const arrivalFr: ItineraryDayFr = {
  day: 0,
  label: 'Arrivée et briefing',
  body: [
    "À votre arrivée à l'aéroport international du Kilimandjaro, vous serez transféré à votre hébergement, où votre guide effectuera un briefing complet et une vérification de l'équipement pour vous préparer à l'aventure à venir.",
  ],
  overnightStay: 'Ameg Lodge / Kaliwa Lodge',
  image: {src: '/images/packages/shared/kilimanjaro-airport.jpg', alt: "Aéroport international du Kilimandjaro"},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/packages/shared/ameg-lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/packages/shared/kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'}},
  ],
}

const comboArrivalFr = (): ItineraryDayFr => ({
  day: 0,
  label: 'Arrivée et briefing',
  body: [
    "À votre arrivée à l'aéroport international du Kilimandjaro, vous serez transféré à votre hébergement, où votre guide effectuera un briefing complet et une vérification de l'équipement pour vous préparer à l'aventure à venir.",
  ],
  image: {src: '/images/combo/shared/kilimanjaro-airport.jpg', alt: 'Arrivée et briefing'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/combo/shared/Ameg-Lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Kaliwa Lodge'}},
  ],
})

const departureFr: ItineraryDayFr = {
  day: -1,
  label: 'Départ ou poursuite du voyage',
  body: ["Transfert à l'aéroport international du Kilimandjaro pour votre vol retour, ou poursuivez votre aventure tanzanienne !"],
}

const includesVariantAFr = [
  'Guides de montagne professionnels et expérimentés parlant anglais, ainsi que des guides assistants',
  "Porteurs compétents et sympathiques pour transporter l'équipement et les provisions",
  'Cuisinier et tous les repas sur la montagne (petit-déjeuner, déjeuner, dîner)',
  'Eau potable (filtrée et traitée) et boissons chaudes tout au long du trek',
  'Frais et permis du parc national du Kilimandjaro',
  'Frais de secours',
  'Hébergement en camping sous tentes de qualité avec tapis de sol',
  "Transferts depuis et vers l'aéroport international du Kilimandjaro (JRO) et Moshi/Arusha",
  "Certificat de sommet à l'issue de l'ascension",
  "Briefing complet avant l'ascension et vérification de l'équipement",
]
const excludesVariantAFr = [
  'Vols internationaux et intérieurs depuis/vers la Tanzanie',
  "Frais de visa pour l'entrée en Tanzanie",
  'Pourboires pour les guides, porteurs et le cuisinier',
  'Équipement de trek personnel (sac de couchage, bâtons de marche, vêtements)',
  "Assurance voyage (obligatoire pour la couverture médicale et d'évacuation)",
  'Collations, boissons alcoolisées et dépenses personnelles',
  "Nuits d'hôtel supplémentaires avant ou après l'ascension (facultatif)",
]

const includesVariantBFr = [
  "Frais d'entrée / droits d'admission",
  'Frais de conservation',
  "Toutes les activités mentionnées dans l'itinéraire",
  "Tous les hébergements indiqués dans l'itinéraire",
  'Tous les transports',
  'Toutes les taxes / TVA de 18 %',
  "Prise en charge et dépose à l'aéroport",
  "Tous les repas indiqués dans l'itinéraire",
]
const excludesVariantBFr = [
  'Tout vol international ou local (aller-retour depuis votre pays)',
  'Pourboires (indication : 10 $ US par personne et par jour)',
  'Effets personnels (souvenirs, assurance voyage, frais de demande de visa, etc.)',
  'Assurance voyage et rapatriement médical',
  'Dépenses à caractère personnel',
]

// Day-body fragments reused verbatim across Machame (7d/6d), Lemosho (7d),
// and Umbwe (6d) — the English source repeats the exact same paragraphs too.
const bodyMachameGateToCampFr = [
  "Votre voyage commence par un trajet de 45 minutes depuis Moshi jusqu'à Machame Gate. Après l'enregistrement, le trek débute le long d'un sentier sinueux traversant une forêt tropicale luxuriante, la zone la plus humide de la montagne. Attendez-vous à des averses occasionnelles l'après-midi, rendant le sentier parfois glissant.",
  "L'ascension s'adoucit progressivement à l'approche de Machame Camp, situé à la transition entre la forêt et les zones de bruyère géante.",
]
const bodyMachameCampToShiraFr = [
  "La journée débute par une montée raide le long d'une crête, menant à Picnic Rock, un point de vue fantastique surplombant Kibo et le rebord déchiqueté du plateau du Shira.",
  "Le sentier s'aplanit ensuite lorsque vous traversez le plateau du Shira, le troisième des cônes volcaniques du Kilimandjaro, avant d'arriver à Shira Camp, où de superbes vues sur la montagne vous attendent.",
]
const bodyShiraToBarrancoViaLavaTowerFr = [
  "Journée d'acclimatation exigeante mais essentielle, vous traverserez un désert de haute altitude en direction de la Lava Tower, haute de 90 mètres, un dyke volcanique offrant des vues panoramiques incroyables.",
  "Après le déjeuner, descendez dans la vallée de Barranco, où poussent les étonnants séneçons géants. Cette descente prépare votre corps à l'ascension du sommet à haute altitude qui vous attend. Barranco Camp se trouve dans une vallée pittoresque et abritée, en contrebas de la célèbre Barranco Wall.",
]
const bodyBarrancoWallToKarangaFr = [
  "Commencez la journée en affrontant l'impressionnante Barranco Wall, une ascension palpitante récompensée par des vues à couper le souffle.",
  "Après avoir atteint le sommet à 4 200 m, suivez un sentier pittoresque et vallonné autour du flanc de la montagne, avec le mont Meru visible sur votre droite et Kibo qui se dresse sur votre gauche.",
  "Une descente dans la vallée de Karanga est suivie d'une montée courte mais raide jusqu'à Karanga Camp, votre étape pour la nuit.",
]
const bodyKarangaToBarafuFr = [
  "Une montée régulière en matinée mène à Barafu Camp, qui signifie « glace » en swahili. Ce camp de haute altitude se trouve sur une crête sous le cône sommital et marque la fin du South Circuit du Kilimandjaro, offrant des vues spectaculaires sur le sommet sous plusieurs angles.",
  "Vous arriverez à temps pour vous reposer l'après-midi et dîner tôt afin de vous préparer pour la nuit du sommet.",
]
const bodySummitToMwekaFr = [
  "À minuit commence votre ascension finale vers le sommet. Le sentier est raide et exigeant, avec des températures bien en dessous de zéro. À l'aube, le magnifique lever de soleil rouge derrière le pic Mawenzi vous gardera motivé.",
  "En atteignant Stella Point (5 750 m), vous marcherez le long du rebord du cratère avant d'arriver à Uhuru Peak (5 895 m), le point culminant de l'Afrique !",
  "Après avoir célébré votre réussite au sommet, entamez la longue descente vers Mweka Camp, en traversant des terrains variés et en vous arrêtant pour déjeuner en chemin. Ce soir, vous savourerez votre dernier dîner sur la montagne.",
]
const bodyMwekaToGateFr = [
  "La dernière descente vous fait traverser une forêt tropicale luxuriante, avec la possibilité d'apercevoir des singes joueurs en chemin.",
  "À Mweka Gate, vous recevrez vos certificats de sommet, et depuis le village de Mweka, vous serez transféré à votre hôtel à Moshi.",
]

// Shared safari FAQ block: 8 Q&A used identically in combos (9/10/11-day) and
// both standalone safaris; combos additionally prepend `safariExpectFaqFr`.
const safariExpectFaqFr: FaqFr = {
  question: "Que puis-je attendre d'un safari en Tanzanie avec Asili Explorer ?",
  answer:
    "Nos safaris en Tanzanie offrent l'occasion d'explorer l'incroyable faune et les paysages magnifiques du pays. Nous sommes spécialisés dans les safaris privés, ce qui signifie que vous disposez d'un 4×4 Landcruiser ou d'une jeep rien que pour vous. Vous avez la liberté de décider quand le safari commence et se termine, et nos guides expérimentés peuvent vous aider à prendre cette décision le jour même de votre aventure. Que vous souhaitiez observer les animaux au moment où ils sont les plus actifs, au lever et au coucher du soleil lorsque les températures sont agréables, ou que vous préfériez terminer la journée au bord de la piscine, le choix vous appartient entièrement. La faune variée de la Tanzanie est active à différents moments de la journée, vous aurez donc de nombreuses occasions d'observer les animaux en action.",
}
const sharedSafariFaqsFr: FaqFr[] = [
  {
    question: "Assurez-vous la prise en charge et la dépose à l'aéroport ?",
    answer:
      "Oui, nous garantissons un début et une fin de voyage sans accroc grâce aux transferts aéroport inclus dans nos formules de safari — voyagez sans souci dès votre arrivée !",
  },
  {
    question: 'Quelles options d\'hébergement proposez-vous lors de vos safaris ?',
    answer:
      "Des lodges haut de gamme aux camps économiques confortables, nous proposons des hébergements variés adaptés aux goûts de chaque voyageur, alliant confort et immersion dans le paysage sauvage tanzanien.",
  },
  {
    question: 'Ai-je besoin d\'un visa pour me rendre en Tanzanie ?',
    answer:
      "La plupart des visiteurs ont besoin d'un visa pour explorer la Tanzanie. Nous vous conseillons de vérifier les dernières règles de visa en fonction de votre nationalité avant de partir.",
  },
  {
    question: 'Que dois-je emporter pour un safari en Tanzanie ?',
    answer:
      "Prévoyez des vêtements légers et amples, un chapeau de soleil, de la crème solaire, des chaussures robustes et un bon appareil photo pour capturer la magie du moment. Notre équipe se fera un plaisir de vous fournir un guide de bagages complet !",
  },
  {
    question: 'Vos safaris conviennent-ils aux familles ?',
    answer:
      "Oui, nous concevons des formules de safari familiales riches en activités qui raviront petits et grands — parfait pour une escapade en groupe mémorable.",
  },
  {
    question: 'Pourrai-je observer les Big Five lors de vos safaris ?',
    answer:
      "Absolument ! Nos itinéraires vous emmènent dans des hauts lieux de la faune comme le Serengeti et le cratère du Ngorongoro, augmentant vos chances d'apercevoir les emblématiques Big Five.",
  },
  {
    question: 'Comment puis-je régler ma réservation de safari ?',
    answer:
      "Nous simplifions les choses avec des options de paiement flexibles, y compris les virements bancaires et les cartes de crédit. Contactez notre équipe pour connaître les modalités de paiement étape par étape.",
  },
  {
    question: 'Que se passe-t-il si je dois modifier ou annuler mon safari ?',
    answer:
      "La vie est imprévisible, nous le savons ! Nos politiques d'annulation ou de report sont conçues pour les voyageurs, bien que les conditions précises dépendent du délai — contactez-nous pour discuter de votre réservation.",
  },
]
const comboPriceDisclaimerFr =
  "*Prix par personne, comprenant le guide, le véhicule de safari, l'hôtel et les frais d'entrée aux parcs, hors vol international (sur la base de six personnes)"
const comboFaqsFr: FaqFr[] = [safariExpectFaqFr, ...sharedSafariFaqsFr]
const comboFaqHeadingFr = 'Vos questions, nos réponses'
const comboFaqIntroFr =
  "Vous avez des questions sur la réservation d'un safari en Tanzanie avec nous ? Consultez nos FAQ ci-dessous pour des réponses rapides. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter — nos experts sont là pour vous aider à planifier l'aventure tanzanienne parfaite."

// FAQ fragments reused verbatim across several packages (mirrors the English
// source repeating the same Q&A text across Machame/Marangu/Umbwe variants).
const faqMachameDifficultyFr: FaqFr = {
  question: 'La route Machame est-elle difficile ?',
  answer:
    "La route Machame, souvent appelée « Whiskey Route », est d'un niveau modéré à difficile. Elle est réputée pour sa beauté paysagère et son acclimatation progressive, mais certaines sections raides et de longues journées la rendent physiquement exigeante. Cependant, avec le bon rythme, une bonne préparation physique et de la détermination, elle reste accessible à la plupart des grimpeurs.",
}
const faqMachameLengthFr = (days: number): FaqFr => ({
  question: 'Quelle est la longueur de la route Machame ?',
  answer: `La distance totale de trek pour la route Machame en ${days} jours est d'environ 62 km. Elle offre un profil d'ascension progressif et comprend une journée d'acclimatation pour augmenter les taux de réussite au sommet.`,
})
const faqBestTimeMachameFr: FaqFr = {
  question: 'Quelle est la meilleure période pour gravir le Kilimandjaro par la route Machame ?',
  answer:
    'Les meilleures saisons sont les mois secs de janvier à mars et de juin à octobre. Ces mois offrent des ciels plus dégagés, moins de précipitations et des conditions plus stables. Évitez la grande saison des pluies (mars-mai) pour un trek plus sûr et plus agréable.',
}
const faqAccommodationTentsFr: FaqFr = {
  question: "Quel est le type d'hébergement ?",
  answer:
    "L'hébergement le long de la route Machame se fait sous des camps de tentes. Vous dormirez dans des tentes de montagne de qualité montées par l'équipe, avec des tapis de sol confortables et des tentes-restaurant prévues pour les repas. Les camps sont bien organisés et entourés d'une nature magnifique.",
}
const faqSummitHeightFr: FaqFr = {
  question: 'Quelle est l\'altitude du sommet du Kilimandjaro ?',
  answer:
    "Le point culminant est Uhuru Peak, qui s'élève à 5 895 mètres au-dessus du niveau de la mer. C'est l'objectif de la poussée finale depuis Barafu Camp, atteint de nuit et au petit matin.",
}
const faqSummitDayLengthFr: FaqFr = {
  question: 'Combien de temps dure le jour du sommet ?',
  answer:
    "Le jour du sommet dure généralement de 12 à 14 heures, incluant l'ascension jusqu'à Uhuru Peak et la descente vers Mweka Camp. C'est une journée difficile avec un air raréfié et des températures froides, mais le lever de soleil à couper le souffle et l'accomplissement rendent ce moment inoubliable.",
}
const faqIncludedMachameFr: FaqFr = {
  question: "Qu'est-ce qui est inclus dans l'ascension par la route Machame ?",
  answer:
    "Une ascension de qualité comprend des guides professionnels, des porteurs, des tentes, des repas, les frais de parc et les transferts. La plupart des forfaits incluent également un accompagnement pour l'acclimatation, un certificat de sommet et de l'eau potable sûre. Assurez-vous de vérifier le détail des prestations incluses.",
}
const faqAltitudeSicknessMachameFr: FaqFr = {
  question: 'Le mal aigu des montagnes est-il fréquent ?',
  answer:
    "Oui, c'est une préoccupation réelle. L'ascension progressive de la route Machame et une journée d'acclimatation supplémentaire réduisent le risque, mais des symptômes comme des maux de tête et des nausées peuvent tout de même survenir. Rester hydraté, adapter son rythme et écouter son guide sont essentiels.",
}
const faqPreparationMachameFr: FaqFr = {
  question: 'Comment me préparer pour la route Machame ?',
  answer:
    "L'entraînement est important. Concentrez-vous sur le cardio (randonnée, course, vélo) et le renforcement musculaire (jambes et tronc). Entraînez-vous à randonner avec un sac chargé, et incluez de longues marches sur des jours consécutifs pour développer votre endurance. La simulation d'altitude et la pratique de l'hydratation sont également recommandées.",
}

interface TripFr {
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
  itinerary: ItineraryDayFr[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqFr[]
  hubSummary: string
  hubImage: Img
}

async function seedTripFr(data: TripFr) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await dayToDoc(stop))
  await upsertTripFr(data.slug, {
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

interface SafariFr {
  slug: string
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  overviewBody: string[]
  gallery: Img[]
  mapImage?: Img
  itinerary: SafariDayFr[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqFr[]
}

// ---------------------------------------------------------------------------
// 9 Kilimanjaro packages
// ---------------------------------------------------------------------------

const machame7Fr: TripFr = {
  slug: '7-days-machame-route',
  category: 'package',
  name: '7 Jours Route Machame',
  durationDays: 7,
  seoTitle: '7 Jours Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription: "Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 7 Jours Route Machame.",
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp et Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "Surnommée la « Whiskey Route », la route Machame est l'itinéraire le plus populaire pour gravir le Kilimandjaro, choisi par près de la moitié des randonneurs chaque année. Cet itinéraire pittoresque aborde le Mont Kilimandjaro par le sud, gravissant les flancs sud à couper le souffle avant de redescendre par la route Mweka. En chemin, les grimpeurs sont récompensés par certains des levers et couchers de soleil les plus époustouflants du Kilimandjaro.",
    "S'étendant sur 62 km, l'itinéraire est généralement parcouru en six jours, bien qu'un itinéraire de sept jours soit vivement recommandé pour une meilleure acclimatation — augmentant significativement les taux de réussite au sommet. Pour ceux qui recherchent une aventure inoubliable sur un terrain exigeant mais gratifiant, la route Machame est un excellent choix.",
  ],
  mapImage: {src: '/images/packages/7-days-machame-route/hero.jpg', alt: 'Carte de la route Machame en 7 jours'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 jours'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Machame Gate à Machame Camp',
      location: 'Machame Gate (1 800 m/5 900 pieds) → Machame Camp (3 000 m/9 800 pieds)',
      meta: ['Dénivelé positif : 1 200 m / 3 900 pieds', 'Durée : 6-7 heures'],
      body: bodyMachameGateToCampFr,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/7-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/7-days-machame-route/day1-machame-2.jpg',
        alt: 'Pont sur le sentier en forêt tropicale en direction de Machame Camp',
      },
    },
    {
      day: 2,
      label: 'De Machame Camp à Shira Camp',
      location: 'Machame Camp (3 000 m/9 800 pieds) → Shira Camp (3 840 m/12 600 pieds)',
      meta: ['Dénivelé positif : 840 m / 2 800 pieds', 'Durée : 5-6 heures'],
      body: bodyMachameCampToShiraFr,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day2-shira-2.jpg', alt: 'Plateau du Shira'},
    },
    {
      day: 3,
      label: 'De Shira Camp à Barranco Camp via Lava Tower',
      location: 'Shira Camp (3 840 m/12 600 pieds) → Lava Tower (4 550 m/14 900 pieds) → Barranco Camp (3 850 m/12 650 pieds)',
      meta: ['Dénivelé positif : 710 m / 2 300 pieds', 'Dénivelé négatif : 700 m / 2 250 pieds', 'Durée : 6-7 heures'],
      body: bodyShiraToBarrancoViaLavaTowerFr,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day3-lava-tower.jpg', alt: 'Lava Tower avec les tentes du camp'},
    },
    {
      day: 4,
      label: 'De Barranco Camp à Karanga Camp via la Barranco Wall',
      location:
        'Barranco Camp (3 850 m/12 600 pieds) → Barranco Wall (4 200 m/13 800 pieds) → Karanga Camp (3 950 m/13 000 pieds)',
      meta: ['Dénivelé positif : 350 m / 1 150 pieds', 'Dénivelé négatif : 250 m / 820 pieds', 'Durée : 3-4 heures'],
      body: bodyBarrancoWallToKarangaFr,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-machame-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day4-karanga-2.jpg', alt: 'Vallée de Karanga'},
    },
    {
      day: 5,
      label: 'De Karanga Camp à Barafu Camp',
      location: 'Karanga Camp (3 950 m/13 000 pieds) → Barafu Camp (4 600 m/15 100 pieds)',
      meta: ['Dénivelé positif : 650 m / 2 150 pieds', 'Durée : 3-4 heures'],
      body: bodyKarangaToBarafuFr,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-machame-route/day5-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day5-barafu-2.jpg', alt: 'Sentier vers Barafu Camp'},
    },
    {
      day: 6,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      location:
        'Barafu Camp (4 600 m/15 100 pieds) → Uhuru Peak (5 895 m/19 300 pieds) → Mweka Camp (3 110 m/10 200 pieds)',
      meta: [
        'Dénivelé positif : 1 295 m / 4 200 pieds',
        'Dénivelé négatif : 2 785 m / 9 100 pieds',
        'Ascension du sommet : 6-8 heures',
        'Descente : 6 heures',
      ],
      body: bodySummitToMwekaFr,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-machame-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day6-mweka-2.jpg', alt: 'Tentes de Mweka Camp'},
    },
    {
      day: 7,
      label: 'De Mweka Camp à Mweka Gate',
      location: 'Mweka Camp (3 110 m/10 200 pieds) → Mweka Gate (1 830 m/6 000 pieds)',
      meta: ['Dénivelé négatif : 1 280 m / 4 220 pieds', 'Durée : 2-3 heures'],
      body: bodyMwekaToGateFr,
      image: {
        src: '/images/packages/7-days-machame-route/day7-mweka-gate.jpg',
        alt: 'Célébration du certificat de sommet à Mweka Gate',
      },
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Machame en 7 jours',
  faqs: [
    faqMachameDifficultyFr,
    faqMachameLengthFr(7),
    faqBestTimeMachameFr,
    faqAccommodationTentsFr,
    faqSummitHeightFr,
    faqSummitDayLengthFr,
    faqIncludedMachameFr,
    faqAltitudeSicknessMachameFr,
    faqPreparationMachameFr,
    {
      question: 'Quel est le taux de réussite pour la route Machame en 7 jours ?',
      answer:
        'Le taux de réussite est élevé — entre 85 % et 90 % pour des ascensions bien encadrées avec des guides expérimentés. La journée supplémentaire d\'acclimatation améliore considérablement vos chances d\'atteindre le sommet en toute sécurité.',
    },
  ],
  hubSummary:
    "Empruntez la populaire route Machame, avec une durée totale de sept jours, vous offrant ainsi encore plus de temps d'acclimatation",
  hubImage: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Route Machame en 7 jours'},
}

const machame6Fr: TripFr = {
  slug: '6-days-machame-route',
  category: 'package',
  name: '6 Jours Route Machame',
  durationDays: 6,
  seoTitle: '6 Jours Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription: "Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 6 Jours Route Machame.",
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp et Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Machame en 6 jours est l'un des itinéraires les plus populaires et pittoresques du Kilimandjaro, réputé pour ses paysages variés et ses solides taux de réussite au sommet. Surnommée la « Whiskey Route », elle est privilégiée par les randonneurs en quête d'une ascension exigeante mais gratifiante. Bien qu'un peu plus courte que la version en 7 jours, elle offre tout de même une excellente acclimatation grâce à son profil « monter haut, dormir bas ». Cet itinéraire vous fait traverser des forêts tropicales luxuriantes, des landes, des déserts alpins, et enfin la zone sommitale arctique d'Uhuru Peak (5 895 m).",
    "Si vous recherchez une ascension mémorable et bien rythmée avec moins de jours sur la montagne, la route Machame en 6 jours est un excellent choix.",
  ],
  mapImage: {src: '/images/packages/6-days-machame-route/hero.jpg', alt: 'Carte de la route Machame en 6 jours'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 jours'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Machame Gate à Machame Camp',
      location: 'Machame Gate (1 800 m/5 900 pieds) → Machame Camp (3 000 m/9 800 pieds)',
      meta: ['Dénivelé positif : 1 200 m / 3 900 pieds', 'Durée : 6-7 heures'],
      body: bodyMachameGateToCampFr,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/6-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {
        src: '/images/packages/6-days-machame-route/day1-machame-2.jpg',
        alt: 'Pont sur le sentier en forêt tropicale en direction de Machame Camp',
      },
    },
    {
      day: 2,
      label: 'De Machame Camp à Shira Camp',
      location: 'Machame Camp (3 000 m/9 800 pieds) → Shira Camp (3 840 m/12 600 pieds)',
      meta: ['Dénivelé positif : 840 m / 2 800 pieds', 'Durée : 5-6 heures'],
      body: bodyMachameCampToShiraFr,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/6-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day2-shira-2.jpg', alt: 'Plateau du Shira'},
    },
    {
      day: 3,
      label: 'De Shira Camp à Barranco Camp via Lava Tower',
      location: 'Shira Camp (3 840 m/12 600 pieds) → Lava Tower (4 550 m/14 900 pieds) → Barranco Camp (3 850 m/12 650 pieds)',
      meta: ['Dénivelé positif : 710 m / 2 300 pieds', 'Dénivelé négatif : 700 m / 2 250 pieds', 'Durée : 6-7 heures'],
      body: bodyShiraToBarrancoViaLavaTowerFr,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day3-barranco-2.jpg', alt: 'Vallée de Barranco'},
    },
    {
      day: 4,
      label: 'De Barranco Camp à Barafu Camp',
      location: 'Barranco Camp (3 960 m) à Barafu Camp (4 640 m)',
      meta: ['Dénivelé positif : 680 m (2 231 pieds)', 'Durée : 7–9 heures'],
      body: [
        "Commencez par l'ascension exaltante de la Barranco Wall, une montée aventureuse offrant des vues gratifiantes. Le sentier serpente ensuite à travers des paysages de désert alpin, traversant la vallée de Karanga avant d'atteindre Barafu Camp. Ici, vous vous reposerez tôt et vous préparerez pour la poussée vers le sommet avant l'aube.",
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-machame-route/day4-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day4-barafu-2.jpg', alt: 'Sentier vers Barafu Camp'},
    },
    {
      day: 5,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      location:
        'Barafu Camp (4 640 m/15 223 pieds) → Uhuru Peak (5 895 m/19 341 pieds) → Mweka Camp (3 080 m/10 105 pieds)',
      meta: ['Dénivelé positif : 1 255 m / 4 117 pieds', 'Dénivelé négatif : 2 815 m / 9 236 pieds', 'Durée : 12–14 heures'],
      body: [
        "Le jour du sommet commence sous un ciel étoilé, avec une ascension à minuit vers Stella Point puis vers Uhuru Peak — le point culminant de l'Afrique. Assistez à un lever de soleil inoubliable depuis le sommet, puis entamez la longue descente vers Mweka Camp. Vous découvrirez une grande variété de paysages et de climats en une seule journée.",
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-machame-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day5-mweka-2.jpg', alt: 'Huttes de Mweka Camp'},
    },
    {
      day: 6,
      label: 'De Mweka Camp à Mweka Gate',
      location: 'Mweka Camp (3 080 m/10 105 pieds) → Mweka Gate (1 640 m/5 381 pieds)',
      meta: ['Dénivelé négatif : 1 440 m / 4 724 pieds', 'Durée : 3–4 heures'],
      body: [
        'Votre dernier trek descend à travers des sentiers de forêt tropicale verdoyante jusqu\'à Mweka Gate, où vous célébrerez votre réussite, recevrez vos certificats de sommet et ferez vos adieux à votre équipe de montagne.',
      ],
      image: {src: '/images/packages/6-days-machame-route/day6-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureFr,
  ],
  includes: includesVariantAFr,
  excludes: [...excludesVariantAFr, 'Location de toilettes portables (si non prévue à l\'avance)'],
  faqHeading: 'FAQ Route Machame en 6 jours',
  faqs: [
    faqMachameDifficultyFr,
    faqMachameLengthFr(6),
    faqBestTimeMachameFr,
    faqAccommodationTentsFr,
    faqSummitHeightFr,
    faqSummitDayLengthFr,
    faqIncludedMachameFr,
    faqAltitudeSicknessMachameFr,
    faqPreparationMachameFr,
    {
      question: 'Quel est le taux de réussite pour la route Machame en 6 jours ?',
      answer:
        "Le taux de réussite est élevé — entre 80 % et 85 % pour des ascensions bien encadrées avec des guides expérimentés. La journée supplémentaire d'acclimatation améliore considérablement vos chances d'atteindre le sommet en toute sécurité.",
    },
  ],
  hubSummary: "La route Machame, souvent appelée « Whiskey Route », est l'un des itinéraires les plus pittoresques et variés du Kilimandjaro.",
  hubImage: {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 6 jours'},
}

// FAQ fragments shared between the 5-day and 6-day Marangu packages.
const faqMaranguDaysFr: FaqFr = {
  question: 'Combien de jours faut-il pour parcourir la route Marangu ?',
  answer:
    "L'itinéraire standard prend 5 ou 6 jours, la version de 6 jours étant fortement recommandée. Le jour supplémentaire permet une meilleure acclimatation, améliorant vos chances d'atteindre Uhuru Peak avec succès.",
}
const faqMaranguEasiestFr: FaqFr = {
  question: 'La route Marangu est-elle le moyen le plus facile de gravir le Mont Kilimandjaro ?',
  answer:
    "Elle est souvent présentée comme la route « la plus facile » en raison de ses pentes douces et de son hébergement en refuges — mais ne vous y trompez pas. Le temps d'acclimatation plus court la rend moins clémente face au mal aigu des montagnes, la préparation est donc essentielle.",
}
const faqMaranguCocaColaFr: FaqFr = {
  question: 'Pourquoi la route Marangu est-elle appelée « Coca-Cola Route » ?',
  answer:
    "Parce que c'est le seul itinéraire du Kilimandjaro où l'on dort dans des refuges permanents plutôt que sous des tentes — et du Coca-Cola était autrefois vendu à certains points de repos. C'est un surnom qui reflète le confort relatif par rapport aux itinéraires en camping.",
}
const faqMaranguDistanceFr: FaqFr = {
  question: 'Quelle est la distance et le dénivelé de la route Marangu ?',
  answer:
    "L'itinéraire couvre environ 72 km aller-retour. Le dénivelé positif est d'environ 4 005 mètres, de Marangu Gate (1 860 m) jusqu'au sommet (5 895 m), puis vous redescendez par le même sentier.",
}
const faqMaranguAccommodationFr: FaqFr = {
  question: "Quel type d'hébergement est disponible sur la route Marangu ?",
  answer:
    "Vous dormirez dans des refuges partagés en forme de A avec des lits superposés. Chaque refuge dispose de chambres de type dortoir, d'un éclairage solaire et de sanitaires communs basiques. C'est une bonne option si vous préférez ne pas camper en extérieur.",
}
const faqMaranguCrowdedFr: FaqFr = {
  question: 'La route Marangu est-elle très fréquentée ?',
  answer:
    "C'est l'un des itinéraires les plus populaires, en particulier auprès des randonneurs soucieux de leur budget. Comme le même sentier est utilisé pour la montée et la descente, vous croiserez souvent d'autres groupes se dirigeant dans les deux sens.",
}
const faqMaranguSuccessRateFr: FaqFr = {
  question: 'Quel est le taux de réussite pour les ascensions par la route Marangu ?',
  answer:
    "Les taux de réussite pour l'itinéraire de 5 jours sont relativement faibles en raison d'une acclimatation insuffisante. Cependant, la version en 6 jours connaît un bien meilleur taux de réussite, surtout si vous prenez votre temps et vous hydratez bien.",
}
const faqMaranguSuitedForFr: FaqFr = {
  question: 'À qui la route Marangu convient-elle le mieux ?',
  answer:
    "La route Marangu est idéale pour les randonneurs débutants qui préfèrent le confort des refuges, voyagent pendant la saison des pluies, ou souhaitent un itinéraire plus court avec une logistique simplifiée. Elle n'est pas idéale pour ceux qui recherchent la solitude ou une expérience de nature sauvage isolée.",
}

const marangu5Fr: TripFr = {
  slug: '5-days-marangu-route',
  category: 'package',
  name: '5 Jours Route Marangu',
  durationDays: 5,
  seoTitle: '5 Jours Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 5 Jours Route Marangu.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en refuge, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "Connue sous le nom de « Coca-Cola Route », la route Marangu est l'itinéraire le plus établi et le plus confortable vers le sommet du Mont Kilimandjaro. C'est le seul itinéraire proposant un hébergement en refuges, ce qui en fait un choix populaire pour ceux qui recherchent une expérience de trek moins rude. Le sentier offre des pentes douces à travers une forêt tropicale luxuriante, des landes et un désert alpin avant d'atteindre le sommet glacé d'Uhuru Peak. Il est idéal pour les randonneurs débutants ou ceux qui recherchent une ascension plus simple.",
    "Route Marangu en 5 jours — une ascension plus rapide, idéale pour les randonneurs expérimentés ou ceux disposant de peu de temps. Elle comprend : Jour 1 : de Marangu Gate à Mandara Hut (forêt tropicale) ; Jour 2 : de Mandara Hut à Horombo Hut (landes) ; Jour 3 : de Horombo Hut à Kibo Hut (désert alpin) ; Jour 4 : poussée vers le sommet à minuit jusqu'à Uhuru Peak, puis descente vers Horombo Hut ; Jour 5 : retour à Marangu Gate.",
  ],
  mapImage: {src: '/images/packages/5-days-marangu-route/hero.jpg', alt: 'Refuges de montagne de la route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
    {src: '/images/packages/5-days-marangu-route/horombo-2.jpeg', alt: 'Horombo Hut'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Marangu Gate à Mandara Hut',
      location: 'Altitude : 1 860 m → 2 700 m',
      meta: ['Dénivelé positif : 830 m / 2 723 pieds', 'Durée : 4-5 heures'],
      body: [
        "Votre trek commence par un trajet en voiture depuis Moshi jusqu'à Marangu Gate. Après l'enregistrement, vous entrerez dans la forêt tropicale luxuriante et commencerez votre randonnée le long d'un sentier bien entretenu. Le chemin est souvent humide et ombragé, avec des arbres couverts de mousse, des oiseaux gazouillant et des singes joueurs en chemin.",
        "Vous atteindrez Mandara Hut en fin d'après-midi. Si le temps et l'énergie le permettent, faites une courte marche jusqu'au cratère Maundi pour des vues magnifiques sur le Kenya et le nord de la Tanzanie.",
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/5-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day1-mandara-2.jpg', alt: 'Cabanes de Mandara Hut'},
    },
    {
      day: 2,
      label: 'De Mandara Hut à Horombo Hut',
      location: 'Altitude : 2 700 m → 3 720 m',
      meta: ['Dénivelé positif : 1 020 m / 3 346 pieds', 'Durée : 6-7 heures'],
      body: [
        "En laissant la forêt tropicale derrière vous, vous entrerez dans la zone de landes, où le paysage change radicalement. Le sentier grimpe régulièrement à travers un terrain dégagé rempli de séneçons géants et de lobélias.",
        "En chemin, vous aurez votre première vue complète sur les pics Kibo et Mawenzi. Horombo Hut vous attend avec des vues à couper le souffle et l'occasion de rencontrer d'autres randonneurs.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day2-horombo-2.jpg', alt: 'Cabanes de Horombo Hut'},
    },
    {
      day: 3,
      label: 'De Horombo Hut à Kibo Hut',
      location: 'Altitude : 3 720 m → 4 703 m',
      meta: ['Dénivelé positif : 983 m / 3 226 pieds', 'Durée : 6-7 heures'],
      body: [
        "L'itinéraire d'aujourd'hui est long et sec, traversant le désert alpin. Vous marcherez à travers la selle entre les pics Mawenzi et Kibo, un vaste paysage aride aux vues spectaculaires. L'air est plus rare, alors marchez lentement et restez hydraté.",
        "Vous atteindrez Kibo Hut en milieu d'après-midi — reposez-vous tôt et préparez-vous pour la tentative de sommet qui débute à minuit.",
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day3-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day3-kibo-2.jpg', alt: 'Bâtiment en pierre de Kibo Hut'},
    },
    {
      day: 4,
      label: 'De Kibo Hut à Uhuru Peak puis à Horombo Hut',
      location: 'Altitude : 4 703 m → 5 895 m (Uhuru Peak) → 3 720 m',
      meta: ['Dénivelé positif : 1 192 m / 3 911 pieds (montée), puis descente', 'Durée : 11-14 heures'],
      body: [
        "Votre ascension vers le sommet débute aux premières heures, en marchant dans l'obscurité à travers des lacets et des éboulis jusqu'à Gilman's Point (5 685 m), puis le long du rebord du cratère jusqu'à Uhuru Peak — le toit de l'Afrique.",
        "Après avoir immortalisé votre moment au sommet, redescendez à Kibo Hut pour une courte pause, puis continuez vers Horombo Hut pour une nuit de sommeil bien méritée.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day4-horombo-hut-return.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day4-horombo-3.jpg', alt: 'Cabanes de Horombo Hut'},
    },
    {
      day: 5,
      label: 'De Horombo Hut à Marangu Gate',
      location: 'Altitude : 3 720 m → 1 860 m',
      meta: ['Dénivelé négatif : 1 850 m / 6 070 pieds', 'Durée : 6-7 heures'],
      body: [
        "Pour votre dernière journée, descendez à travers les landes et la forêt tropicale luxuriante pour retourner au point de départ. Le sentier est plus facile à la descente, mais faites attention où vous mettez les pieds sur les sections humides.",
        "À l'entrée du parc, vous recevrez votre certificat de sommet avant de retourner à Moshi — fatigué mais fier.",
      ],
      image: {src: '/images/packages/5-days-marangu-route/day5-marangu-gate.jpg', alt: 'Grimpeurs près du sommet au lever du soleil'},
    },
    departureFr,
  ],
  includes: includesVariantAFr,
  excludes: excludesVariantAFr,
  faqHeading: 'FAQ Route Marangu en 5 jours',
  faqIntro:
    "Vous avez des questions sur l'ascension du Kilimandjaro avec nous ? Consultez nos FAQ ci-dessous pour des informations utiles.",
  faqs: [
    faqMaranguDaysFr,
    faqMaranguEasiestFr,
    faqMaranguCocaColaFr,
    faqMaranguDistanceFr,
    faqMaranguAccommodationFr,
    faqMaranguCrowdedFr,
    faqMaranguSuccessRateFr,
    faqMaranguSuitedForFr,
  ],
  hubSummary:
    "Un voyage de cinq jours pour gravir le plus haut sommet d'Afrique, via la populaire route Marangu. Attendez-vous à une variété de paysages…",
  hubImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Route Marangu en 5 jours'},
}

const marangu6Fr: TripFr = {
  slug: '6-days-marangu-route',
  category: 'package',
  name: '6 Jours Route Marangu',
  durationDays: 6,
  seoTitle: '6 Jours Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 6 Jours Route Marangu.',
  stopsLine: 'Marangu Gate, Mandara Hut, Horombo Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en refuge, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Marangu, souvent surnommée la « Coca-Cola Route », est le seul itinéraire du Kilimandjaro proposant un hébergement en refuges plutôt qu'en camping. Avec son sentier bien tracé et son confort supplémentaire, c'est un choix populaire pour les randonneurs recherchant une ascension pittoresque mais simple vers le sommet du plus haut pic d'Afrique.",
    "Cette version en 6 jours laisse plus de temps pour l'acclimatation que le trek de 5 jours, ce qui augmente votre taux de réussite au sommet. Vous traverserez des zones de végétation distinctes, de la forêt tropicale au désert alpin, avant de terminer par une poussée à minuit vers Uhuru Peak via Gilman's Point.",
  ],
  mapImage: {src: '/images/packages/6-days-marangu-route/hero.jpg', alt: 'Refuges de montagne de la route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/routes/marangu/hero.jpg', alt: 'Refuge de la route Marangu'},
    {src: '/images/packages/shared/card-6-days-marangu-alt.webp', alt: 'Route Marangu en 6 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      location: 'Altitude : 1 860 m → 2 700 m',
      meta: ['Dénivelé positif : 840 m (2 755 pieds)', 'Durée : 4-5 heures'],
      body: [
        "Commencez votre voyage à travers une forêt tropicale luxuriante peuplée de colobes et d'une flore vibrante. Après une montée régulière, vous atteindrez Mandara Hut pour votre première nuit sur la montagne.",
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/6-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day1-mandara-2.jpg', alt: 'Cabanes de Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      location: 'Altitude : 2 700 m → 3 720 m',
      meta: ['Dénivelé positif : 1 020 m (3 346 pieds)', 'Durée : 6-7 heures'],
      body: [
        'En sortant de la forêt, le sentier se transforme en lande et bruyère. En chemin, profitez des vues sur les pics Kibo et Mawenzi.',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day2-horombo-2.jpg', alt: 'Cabanes de Horombo Hut'},
    },
    {
      day: 3,
      label: 'Acclimatation à Horombo Hut',
      location: 'Altitude : 3 720 m → 4 000 m (Zebra Rocks) → 3 720 m',
      meta: ['Dénivelé positif : 280 m (918 pieds)', 'Dénivelé négatif : 280 m (918 pieds)', 'Durée : 2-3 heures (randonnée facultative)'],
      body: [
        "Une journée d'acclimatation essentielle pour aider votre corps à s'adapter. Vous pouvez faire une courte randonnée jusqu'à Zebra Rocks et revenir pour déjeuner et vous reposer à Horombo.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day3-horombo-acclimatization.jpg', alt: 'Panneau de Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      location: 'Altitude : 3 720 m → 4 703 m',
      meta: ['Dénivelé positif : 983 m (3 225 pieds)', 'Durée : 6-7 heures'],
      body: [
        'Le trek d\'aujourd\'hui vous fait traverser un terrain de désert alpin en direction du camp de base à Kibo Hut. Reposez-vous tôt pour vous préparer à la nuit du sommet.',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day4-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day4-kibo-2.jpg', alt: 'Bâtiment en pierre de Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      location: 'Altitude : 4 703 m → 5 895 m (Uhuru Peak) → 3 720 m',
      meta: ['Dénivelé positif : 1 192 m (3 910 pieds)', 'Dénivelé négatif : 2 175 m (7 136 pieds)', 'Durée : 12-14 heures'],
      body: [
        "Entamez votre poussée vers le sommet juste après minuit, atteignant Gilman's Point puis Uhuru Peak au lever du soleil. Après avoir célébré au sommet, descendez vers Horombo Hut pour votre dernière nuit.",
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day5-horombo-3.jpg', alt: 'Horombo Hut au coucher du soleil'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Transfert',
      location: 'Altitude : 3 720 m → 1 860 m',
      meta: ['Dénivelé négatif : 1 860 m (6 102 pieds)', 'Durée : 5-6 heures'],
      body: [
        "Descendez à travers les landes et la forêt tropicale jusqu'à l'entrée du parc. Après avoir reçu votre certificat de sommet, vous serez transféré à votre hôtel.",
      ],
      overnightStay: 'Hôtel à Moshi/Arusha (inclus)',
      image: {src: '/images/packages/6-days-marangu-route/day6-marangu-gate.jpg', alt: 'Marangu Gate'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day6-kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'},
    },
    departureFr,
  ],
  includes: [
    "Frais d'entrée au parc",
    "Tous les repas et l'eau pendant le trek",
    'Hébergement en refuge (Mandara, Horombo, Kibo)',
    'Transport privé depuis/vers Marangu Gate',
    'Séjours à l\'hôtel avant et après l\'ascension (1 nuit chacun)',
    'Guides de montagne certifiés, cuisinier et porteurs',
    'Bouteille d\'oxygène et trousse de premiers secours',
    'Taxes gouvernementales et TVA',
    'Certificat de sommet',
    'Frais de secours',
  ],
  excludes: [
    'Vols internationaux et intérieurs',
    'Visa tanzanien',
    'Pourboires pour les guides et porteurs',
    'Assurance voyage',
    'Équipement de trek personnel (disponible à la location)',
    'Collations et boissons supplémentaires',
    "Nuits d'hôtel supplémentaires avant/après l'ascension",
  ],
  faqHeading: "Vous avez des questions sur l'ascension du Kilimandjaro avec nous ?",
  faqIntro:
    "Consultez nos FAQ ci-dessous pour des informations utiles. Si vous ne trouvez pas la réponse que vous cherchez, n'hésitez pas à nous contacter — nos experts du Kilimandjaro sont prêts à vous aider à planifier chaque étape de votre aventure inoubliable.",
  faqs: [
    faqMaranguDaysFr,
    faqMaranguEasiestFr,
    faqMaranguCocaColaFr,
    faqMaranguDistanceFr,
    faqMaranguAccommodationFr,
    faqMaranguCrowdedFr,
    faqMaranguSuccessRateFr,
    {
      question: 'Quelle est la meilleure période pour gravir la route Marangu ?',
      answer:
        "Les meilleurs mois sont de janvier à début mars et de juin à octobre, lorsque les conditions météorologiques sont plus stables et les sentiers secs. Cependant, le système de refuges de Marangu en fait une option viable même pendant les saisons des pluies.",
    },
    {
      question: 'Que dois-je emporter pour un trek sur la route Marangu ?',
      answer:
        "Des vêtements en couches pour toutes les plages de températures, un sac de couchage 4 saisons, un bonnet chaud et des gants, des bâtons de marche, des articles de toilette personnels et une lampe frontale sont essentiels. Vous aurez également besoin d'un petit sac à dos de jour, les porteurs se chargeant de votre sac principal.",
    },
    faqMaranguSuitedForFr,
  ],
  hubSummary:
    "Un voyage de six jours pour gravir le plus haut sommet d'Afrique, via la populaire route Marangu. Attendez-vous à une variété de paysages…",
  hubImage: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Route Marangu en 6 jours'},
}

const lemosho7Fr: TripFr = {
  slug: '7-days-lemosho-route',
  category: 'package',
  name: '7 Jours Route Lemosho',
  durationDays: 7,
  seoTitle: '7 Jours Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 7 Jours Route Lemosho.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira 2 Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp et Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Lemosho est réputée pour sa beauté paysagère et son excellent profil d'acclimatation, ce qui en fait un choix de premier plan pour les randonneurs recherchant une ascension plus progressive et gratifiante. Partant du côté ouest du Kilimandjaro, cet itinéraire traverse des forêts tropicales luxuriantes, de vastes landes et de hauts déserts alpins, offrant des vues à couper le souffle sur la montagne et les paysages environnants.",
    "Avec un taux de réussite plus élevé que de nombreux autres itinéraires, la route Lemosho en 7 jours est idéale pour ceux qui recherchent à la fois un défi et l'occasion de profiter des environnements variés du Kilimandjaro.",
  ],
  mapImage: {src: '/images/packages/7-days-lemosho-route/hero.png', alt: 'Carte de la route Lemosho au Kilimandjaro'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 jours'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Lemosho Gate à Mti Mkubwa Camp',
      location: 'Lemosho Gate (2 100 m/6 890 pieds) → Mti Mkubwa (2 650 m/8 694 pieds)',
      meta: ['Dénivelé positif : 550 m / 1 804 pieds', 'Durée : 3-4 heures'],
      body: [
        "Entrez dans la forêt montagnarde enchanteresse, où des arbres imposants et les sons de la faune vous entourent. Un trek relativement doux vous mène à Mti Mkubwa Camp, où vous passerez votre première nuit sur la montagne.",
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa à Shira 2 Camp',
      location: 'Mti Mkubwa Camp (2 650 m/8 694 pieds) → Shira 2 Camp (3 850 m/12 631 pieds)',
      meta: ['Dénivelé positif : 1 200 m (3 937 pieds)', 'Durée : 7-8 heures'],
      body: [
        "Le long trek d'aujourd'hui vous mène de la forêt au vaste plateau du Shira. Montez à travers des landes offrant des vues magnifiques avant d'atteindre Shira 2 Camp, où la grandeur des pics du Kilimandjaro se dévoile pleinement.",
      ],
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day2-shira-2.jpg', alt: 'Campement de Shira Camp'},
    },
    {
      day: 3,
      label: 'De Shira 2 Camp à Barranco Camp via Lava Tower',
      location: 'Shira 2 Camp (3 840 m/12 600 pieds) → Lava Tower (4 550 m/14 900 pieds) → Barranco Camp (3 850 m/12 650 pieds)',
      meta: ['Dénivelé positif : 710 m / 2 300 pieds', 'Dénivelé négatif : 700 m / 2 250 pieds', 'Durée : 6-7 heures'],
      body: bodyShiraToBarrancoViaLavaTowerFr,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day3-lava-tower.jpg', alt: 'Lava Tower avec les tentes du camp'},
    },
    {
      day: 4,
      label: 'De Barranco Camp à Karanga Camp via la Barranco Wall',
      location:
        'Barranco Camp (3 850 m/12 600 pieds) → Barranco Wall (4 200 m/13 800 pieds) → Karanga Camp (3 950 m/13 000 pieds)',
      meta: ['Dénivelé positif : 350 m / 1 150 pieds', 'Dénivelé négatif : 250 m / 820 pieds', 'Durée : 3-4 heures'],
      body: bodyBarrancoWallToKarangaFr,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day4-karanga-2.jpg', alt: 'Vallée de Karanga'},
    },
    {
      day: 5,
      label: 'De Karanga Camp à Barafu Camp',
      location: 'Karanga Camp (3 950 m/13 000 pieds) → Barafu Camp (4 600 m/15 100 pieds)',
      meta: ['Dénivelé positif : 650 m / 2 150 pieds', 'Durée : 3-4 heures'],
      body: bodyKarangaToBarafuFr,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day5-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day5-barafu-2.jpg', alt: 'Sentier vers Barafu Camp'},
    },
    {
      day: 6,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      location:
        'Barafu Camp (4 600 m/15 100 pieds) → Uhuru Peak (5 895 m/19 300 pieds) → Mweka Camp (3 110 m/10 200 pieds)',
      meta: [
        'Dénivelé positif : 1 295 m / 4 200 pieds',
        'Dénivelé négatif : 2 785 m / 9 100 pieds',
        'Ascension du sommet : 6-8 heures',
        'Descente : 6 heures',
      ],
      body: bodySummitToMwekaFr,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day6-mweka-2.jpg', alt: 'Tentes de Mweka Camp'},
    },
    {
      day: 7,
      label: 'De Mweka Camp à Mweka Gate',
      location: 'Mweka Camp (3 110 m/10 200 pieds) → Mweka Gate (1 830 m/6 000 pieds)',
      meta: ['Dénivelé négatif : 1 280 m / 4 220 pieds', 'Durée : 2-3 heures'],
      body: bodyMwekaToGateFr,
      image: {
        src: '/images/packages/7-days-lemosho-route/day7-mweka-gate.jpg',
        alt: 'Célébration du certificat de sommet à Mweka Gate',
      },
    },
    departureFr,
  ],
  includes: [...includesVariantAFr, 'Transferts vers Lemosho Gate et depuis Mweka Gate'],
  excludes: excludesVariantAFr,
  faqHeading: 'FAQ Route Lemosho en 7 jours',
  faqs: [
    {
      question: 'La route Lemosho en 7 jours convient-elle aux débutants ?',
      answer:
        "Oui. Bien que le Kilimandjaro représente un défi sérieux, la route Lemosho offre une ascension progressive, laissant plus de temps pour l'acclimatation. Cela en fait l'un des meilleurs itinéraires, tant pour les débutants que pour les randonneurs expérimentés.",
    },
    {
      question: 'Quel est le taux de réussite pour atteindre le sommet via la route Lemosho en 7 jours ?',
      answer:
        "Le taux de réussite est très élevé — environ 85 % ou plus. Sa durée plus longue et son dénivelé progressif améliorent considérablement l'acclimatation et augmentent les chances d'atteindre Uhuru Peak.",
    },
    {
      question: "Combien d'heures marcherai-je chaque jour ?",
      answer:
        "La plupart des jours de trek impliquent de 4 à 7 heures de marche. Cependant, le jour du sommet est beaucoup plus long, durant de 12 à 14 heures aller-retour (montée et descente).",
    },
    {
      question: 'Quelle est la distance totale de la route Lemosho en 7 jours ?',
      answer:
        "L'itinéraire couvre environ 70 kilomètres depuis le point de départ à Lemosho Gate jusqu'au sommet et la descente vers Mweka Gate.",
    },
    {
      question: "Ai-je besoin d'une expérience préalable de l'altitude ?",
      answer:
        "Pas nécessairement. Aucune escalade technique n'est requise, mais un bon niveau de forme physique est important. Vous n'avez pas besoin d'expérience préalable de l'altitude, bien que le mal aigu des montagnes puisse affecter n'importe qui, ce qui explique l'importance de l'acclimatation.",
    },
    {
      question: 'Quel type d\'hébergement est utilisé sur la route Lemosho ?',
      answer:
        "L'hébergement se fait sous des tentes de haute qualité fournies et montées par votre équipe de trek. Chaque nuit, vous dormirez dans des camps de montagne désignés comme Mti Mkubwa, Shira, Barranco, Karanga, Barafu et Mweka.",
    },
    {
      question: 'Que dois-je emporter pour cet itinéraire ?',
      answer:
        "Les indispensables comprennent des chaussures de randonnée robustes, un sac de couchage chaud (résistant jusqu'à -10 °C), des couches thermiques, un équipement imperméable, des gants, une lampe frontale et un sac à dos de jour. La plupart des opérateurs fournissent une liste complète de l'équipement.",
    },
    {
      question: 'Y a-t-il des toilettes sur la montagne ?',
      answer:
        "Des latrines publiques sont disponibles à chaque camp. Cependant, des toilettes portables privées sont souvent incluses ou disponibles en option pour plus de confort et d'hygiène.",
    },
    {
      question: 'Quelle est la meilleure période pour gravir la route Lemosho ?',
      answer:
        "Les meilleures saisons sont de janvier à début mars et de juin à octobre. Ces mois offrent des ciels plus dégagés, moins de précipitations et de meilleures conditions de trek en général.",
    },
    {
      question: 'Puis-je personnaliser cet itinéraire ou ajouter des jours supplémentaires ?',
      answer:
        "Absolument ! L'itinéraire peut être prolongé en une version de 8 jours pour une meilleure acclimatation, ou ajusté selon votre rythme. Notre équipe travaillera avec vous pour adapter le trek à vos préférences et besoins.",
    },
  ],
  hubSummary:
    "Avec huit jours de voyage, votre trek au Kilimandjaro sur la route Lemosho dure plus longtemps que les alternatives.",
  hubImage: {src: '/images/packages/shared/8-days-lemosho-route.webp', alt: 'Route Lemosho en 7 jours'},
}

const lemosho8Fr: TripFr = {
  slug: '8-days-lemosho-route',
  category: 'package',
  name: '8 Jours Route Lemosho',
  durationDays: 8,
  seoTitle: '8 Jours Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 8 Jours Route Lemosho.',
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira Camp 1, Shira Camp 2, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Lemosho est l'un des itinéraires les plus beaux et les mieux équilibrés pour gravir le Mont Kilimandjaro. Elle offre une riche biodiversité, moins de fréquentation durant les premiers jours, et une excellente acclimatation grâce à son profil d'ascension progressif. Si vous recherchez un itinéraire alliant beauté paysagère, paysages variés et taux de réussite élevé au sommet, la route Lemosho en 8 jours est un choix fantastique.",
    "Partant du côté ouest du Kilimandjaro, cet itinéraire traverse une forêt tropicale luxuriante, de vastes landes et des zones de désert alpin avant de rejoindre la route Machame et de se diriger vers le sommet via Barafu Camp.",
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Carte de la route Lemosho en 8 jours'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 jours'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Lemosho Gate à Mti Mkubwa',
      location: 'Altitude : 2 100 m → 2 650 m',
      meta: ['Dénivelé positif : 550 m (1 805 pieds)', 'Durée : 3-4 heures'],
      body: [
        "Après le petit-déjeuner, vous roulerez d'Arusha jusqu'à Londorossi Gate pour l'enregistrement. Puis vous poursuivrez jusqu'à Lemosho Gate, où la randonnée débute à travers une forêt tropicale luxuriante. Cette zone est riche en faune, avec des colobes noir et blanc et des oiseaux forestiers. Vous marcherez sous une canopée d'arbres avant d'arriver à Mti Mkubwa (Big Tree) Camp pour la nuit.",
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp à Shira 1 Camp',
      location: 'Mti Mkubwa Camp (2 650 m) – Shira 1 Camp (3 610 m)',
      meta: ['Dénivelé positif : 960 m (3 150 pieds)', 'Durée : 6-7 heures'],
      body: [
        "Le sentier d'aujourd'hui grimpe progressivement hors de la forêt tropicale vers la zone de bruyère et de landes. À mesure que vous montez, les arbres s'éclaircissent et le paysage s'ouvre, offrant des vues magnifiques sur la crête du Shira et le pic Kibo. Après une randonnée pittoresque à travers des collines ondulantes et des formations rocheuses volcaniques, vous atteindrez Shira 1 Camp sur le plateau du Shira.",
      ],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Plateau du Shira'},
    },
    {
      day: 3,
      label: 'De Shira 1 Camp à Shira 2 Camp',
      location: 'Shira 1 Camp (3 610 m) – Shira 2 Camp (3 850 m)',
      meta: ['Dénivelé positif : 240 m (787 pieds)', 'Durée : 3-4 heures'],
      body: [
        'Un court trek à travers le vaste plateau ouvert de la crête du Shira vous donne le temps de vous reposer et de vous acclimater. Si le temps le permet, vous aurez des vues panoramiques sur Kibo et le mont Meru au loin.',
      ],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Vue de Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'De Shira 2 Camp à Lava Tower puis à Barranco Camp',
      location: 'Shira 2 Camp (3 850 m) → Lava Tower (4 630 m) → Barranco Camp',
      meta: ['Dénivelé positif : 780 m', 'Dénivelé négatif : 654 m', 'Durée : 6-7 heures'],
      body: [
        "Montez régulièrement jusqu'à l'impressionnante Lava Tower, où vous vous arrêterez pour déjeuner. Descendez ensuite dans la magnifique vallée de Barranco pour la nuit. C'est l'une des journées d'acclimatation les plus importantes de l'itinéraire.",
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: 'De Barranco Camp à Karanga Camp',
      location: 'Barranco Camp (3 976 m) → Karanga Camp (4 035 m)',
      meta: ['Dénivelé positif : 59 m / 194 pieds', 'Durée : 4-5 heures'],
      body: [
        'Gravissez la célèbre Barranco Wall — exigeante mais non technique. Continuez à travers un terrain alpin jusqu\'à Karanga Camp. Cette journée plus courte laisse à votre corps plus de temps pour s\'acclimater avant la nuit du sommet.',
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Vue de Karanga Camp'},
    },
    {
      day: 6,
      label: 'De Karanga Camp à Barafu Camp',
      location: 'Karanga Camp (4 035 m / 13 238 pieds) → Barafu Camp (4 703 m)',
      meta: ['Dénivelé positif : 668 m / 2 192 pieds', 'Durée : 3-4 heures'],
      body: [
        'Un trek court mais raide à travers un désert alpin de haute altitude jusqu\'à votre dernier camp avant la nuit du sommet. Reposez-vous, hydratez-vous et préparez-vous mentalement au défi qui vous attend.',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: 'Sentier vers Barafu Camp'},
    },
    {
      day: 7,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      location:
        'Barafu Camp (4 703 m / 15 430 pieds) → Uhuru Peak (5 895 m / 19 341 pieds) → Mweka Camp (3 720 m / 12 205 pieds)',
      meta: ['Dénivelé positif : 1 192 m / 3 910 pieds', 'Dénivelé négatif : 2 175 m / 7 136 pieds', 'Durée : 12-14 heures'],
      body: [
        "Entamez votre tentative de sommet vers minuit, en marchant dans l'obscurité vers Stella Point puis Uhuru Peak — le point culminant de l'Afrique. Après le lever du soleil et les photos au sommet, redescendez à Barafu pour une pause, puis jusqu'à Mweka Camp pour la nuit.",
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'De Mweka Camp à Mweka Gate, transfert à Arusha',
      location: 'Mweka Camp (3 720 m / 12 205 pieds) → Mweka Gate (1 640 m / 5 380 pieds)',
      meta: ['Dénivelé négatif : 2 080 m / 6 824 pieds', 'Durée : 3-4 heures'],
      body: [
        'Traversez une forêt tropicale luxuriante jusqu\'à l\'entrée du parc, où vous recevrez votre certificat du Kilimandjaro. Votre chauffeur vous transférera à votre hôtel pour une douche chaude et un repos bien mérité.',
      ],
      overnightStay: 'Arusha',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Lemosho en 8 jours',
  faqIntro:
    "Vous avez des questions sur l'ascension du Kilimandjaro avec nous ? Consultez nos FAQ sur la route Lemosho ci-dessous pour des réponses claires et utiles. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter — nos experts de la montagne chez Asili Climbing Kilimanjaro sont là pour vous aider à planifier une aventure au sommet sûre, réussie et inoubliable.",
  faqs: [
    {
      question: 'Pourquoi choisir la route Lemosho pour gravir le Kilimandjaro ?',
      answer:
        "La route Lemosho est largement considérée comme l'itinéraire le plus pittoresque du Kilimandjaro. Elle offre des vues à couper le souffle, peu d'affluence durant les premières étapes, et une excellente acclimatation. Avec une ascension progressive et des paysages variés, elle est idéale pour les randonneurs visant une ascension réussie.",
    },
    {
      question: 'Quel est le niveau de difficulté de la route Lemosho en 8 jours ?',
      answer:
        "L'itinéraire est modérément exigeant mais tout à fait gérable avec une bonne préparation. L'itinéraire de 8 jours permet une meilleure acclimatation, augmentant vos chances d'atteindre Uhuru Peak sans symptômes d'altitude sévères.",
    },
    {
      question: "Qu'est-ce qui est inclus dans l'ascension de 8 jours par la route Lemosho avec Asili Climbing Kilimanjaro ?",
      answer:
        "Votre ascension comprend des guides de montagne professionnels, des porteurs, un équipement de camping complet, les repas, les frais de parc, les frais de secours et les transferts aéroport. Des séjours à l'hôtel avant et après le trek peuvent également être organisés.",
    },
    {
      question: 'Quel type d\'hébergement est utilisé pendant le trek ?',
      answer:
        "Vous dormirez dans des tentes de montagne quatre saisons de haute qualité, chacune partagée entre deux grimpeurs. Des tapis de sol confortables sont fournis. Tous les camps sont montés et démontés chaque jour par nos porteurs.",
    },
    {
      question: "Quelle est la meilleure période de l'année pour randonner sur la route Lemosho ?",
      answer:
        "Nous recommandons de grimper pendant les saisons sèches : de janvier à mi-mars et de juin à octobre. Ces mois offrent la meilleure météo et visibilité pour les vues panoramiques et la photographie.",
    },
    {
      question: 'Combien de personnes composeront mon groupe ?',
      answer:
        "Nous maintenons des groupes de petite taille — généralement entre 2 et 10 randonneurs — pour offrir une expérience plus personnalisée et garantir la sécurité et le soutien tout au long du voyage.",
    },
    {
      question: 'Quel niveau de forme physique me faut-il pour terminer ce trek ?',
      answer:
        "Vous n'avez pas besoin d'être un athlète, mais vous devriez avoir un bon niveau de forme physique et être à l'aise pour marcher plusieurs heures sur des jours consécutifs. Nous recommandons de vous entraîner par la randonnée, le cardio et le renforcement musculaire plusieurs semaines à l'avance.",
    },
    {
      question: 'Quel type de nourriture est fourni sur la montagne ?',
      answer:
        "Nos cuisiniers de montagne préparent des repas chauds et nutritifs trois fois par jour. Attendez-vous à des plats comme des soupes, des pâtes, du riz, de la viande, des légumes, des fruits frais et des collations. Les besoins alimentaires particuliers peuvent être satisfaits avec un préavis.",
    },
    {
      question: "Aurai-je accès à de l'eau potable propre ?",
      answer:
        "Oui. Nous traitons et faisons bouillir quotidiennement l'eau provenant de sources naturelles le long de l'itinéraire. De l'eau potable sûre vous sera fournie chaque jour pour remplir vos bouteilles ou votre système d'hydratation.",
    },
    {
      question: 'Est-il sûr de gravir le Kilimandjaro avec Asili Climbing Kilimanjaro ?',
      answer:
        "La sécurité est notre priorité absolue. Nos guides sont formés en tant que Wilderness First Responders (WFR), et nous effectuons des contrôles de santé quotidiens à l'aide d'oxymètres de pouls. De l'oxygène d'urgence et une civière portable sont toujours transportés. Si nécessaire, nous organisons une évacuation rapide via les services de secours officiels.",
    },
  ],
  hubSummary:
    "Avec huit jours de voyage, votre trek au Kilimandjaro sur la route Lemosho dure plus longtemps que les alternatives.",
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho en 8 jours'},
}

const lemosho9Fr: TripFr = {
  slug: '9-days-lemosho-route',
  category: 'package',
  name: '9 Jours Route Lemosho',
  durationDays: 9,
  seoTitle: '9 Jours Route Lemosho – Dormir dans le Cratère | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 9 Jours Route Lemosho, incluant une nuit rare campée à l'intérieur du cratère sommital du Kilimandjaro.",
  stopsLine:
    'Lemosho Gate, Mti Mkubwa Camp, Shira One Camp, Shira Two Camp, Barranco Camp, Karanga Camp, Kosovo Camp, Crater Camp, Uhuru Peak, Mweka Camp, Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping y compris le permis spécial de camping dans le cratère, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Lemosho compte déjà parmi les itinéraires les plus pittoresques et les plus fiables pour gravir le Kilimandjaro, et cet itinéraire prolongé de neuf jours ajoute une expérience que seule une poignée de grimpeurs tentent chaque année : une nuit campée à l'intérieur du cratère sommital du Kilimandjaro, à quelques centaines de mètres seulement d'Uhuru Peak. En partant du côté ouest, plus tranquille, de la montagne, vous traverserez la forêt tropicale, les landes d'altitude et le vaste plateau du Shira avant de rejoindre l'itinéraire classique du sommet au-dessus de Barranco Camp.",
    "Plutôt que de foncer vers le sommet directement depuis un camp d'altitude, cet itinéraire ajoute une nuit d'acclimatation supplémentaire à Kosovo Camp puis une seconde à Crater Camp, à 5 730 m d'altitude, à l'intérieur même du cratère du volcan. Ce temps supplémentaire passé au-dessus de 4 700 m améliore considérablement votre acclimatation, et la nuit dans le cratère vous offre la rare occasion d'explorer le puits de cendres et la glace du fond du cratère avant une courte ascension finale au lever du soleil.",
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Carte de la route Lemosho en 9 jours'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Camp Shira sur le plateau'},
    {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
    {src: '/images/packages/9-days-northern-circuit-route/day8-uhuru-peak.webp', alt: "Panneau du sommet d'Uhuru Peak"},
    {src: '/images/packages/shared/hero-night.jpg', alt: 'Tentes sous la Voie lactée près du sommet du Kilimandjaro'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Lemosho Gate à Mti Mkubwa Camp',
      location: 'Lemosho Gate (2 300 m) → Mti Mkubwa Camp (2 800 m)',
      meta: ['Dénivelé positif : 500 m (1 640 pieds)', 'Durée : 3 heures'],
      body: [
        "Après le petit-déjeuner, comptez environ trois à quatre heures de route depuis Arusha jusqu'à Lemosho Gate, sur le versant ouest du Kilimandjaro. Une fois l'enregistrement terminé, suivez la piste forestière vers l'est — connue localement sous le nom de Chamber's Route — à travers une forêt tropicale dense jusqu'à Mti Mkubwa, ou « Big Tree Camp », votre première nuit sur la montagne.",
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {
        src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg',
        alt: "Point d'enregistrement de Londorossi Gate",
      },
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp à Shira One Camp',
      location: 'Mti Mkubwa Camp (2 800 m) → Shira One Camp (3 500 m)',
      meta: ['Dénivelé positif : 700 m (2 300 pieds)', 'Durée : 5-6 heures'],
      body: [
        "Le sentier grimpe régulièrement hors de la forêt tropicale vers la bruyère géante et les landes. C'est une journée complète avec un gain d'altitude important, alors gardez votre rythme et buvez beaucoup d'eau. Une pause déjeuner est prévue près de la crête sous le cratère du Shira, avant de poursuivre vers le plateau du Shira, en haute altitude, où vous aurez vos premières vues rapprochées sur Kibo, le cône volcanique central du Kilimandjaro.",
      ],
      overnightStay: 'Shira One Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira One Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Plateau du Shira'},
    },
    {
      day: 3,
      label: 'De Shira One Camp à Shira Two Camp',
      location: 'Shira One Camp (3 500 m) → Shira Two Camp (3 900 m)',
      meta: ['Dénivelé positif : 400 m (1 310 pieds)', 'Durée : 4-5 heures'],
      body: [
        "Une journée plus douce à travers le vaste plateau du Shira, passant près de la formation rocheuse de la Cathédrale du Shira, avec des vues dégagées sur le plateau, la montagne et les plaines en contrebas. Après le déjeuner au camp, la plupart des groupes font une courte marche d'acclimatation d'environ une heure, gagnant un peu d'altitude supplémentaire avant de redescendre dormir à Shira Two.",
      ],
      overnightStay: 'Shira Two Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira Two Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Vues du plateau du Shira'},
    },
    {
      day: 4,
      label: 'De Shira Two Camp à Barranco Camp via Lava Tower',
      location: 'Shira Two Camp (3 900 m) → Lava Tower (4 640 m) → Barranco Camp (3 950 m)',
      meta: ['Dénivelé positif : 740 m (2 430 pieds)', 'Dénivelé négatif : 690 m (2 260 pieds)', 'Durée : 7 heures'],
      body: [
        "Une journée exigeante mais gratifiante. Le sentier grimpe régulièrement jusqu'à l'impressionnant piton volcanique de Lava Tower, où vous ferez une pause déjeuner chaud à plus de 4 600 m — une excellente acclimatation pour la suite. De là, le sentier redescend dans la luxuriante vallée de Barranco, avec des vues sur la Breach Wall et les glaciers du versant sud du Kilimandjaro en chemin.",
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: 'De Barranco Camp à Karanga Camp',
      location: 'Barranco Camp (3 950 m) → Karanga Camp (4 050 m)',
      meta: ['Dénivelé positif : 100 m (330 pieds)', 'Durée : 4-5 heures'],
      body: [
        "La journée débute par la Barranco Wall — une escalade de 300 m qui semble intimidante mais reste accessible avec l'aide de votre guide, et qui vous récompense par la vue sur le glacier Heim, sur le versant sud du Kilimandjaro. Depuis le sommet de la paroi, le sentier continue vers l'est sous les glaciers Decken et Rebmann jusqu'à Karanga Camp, perché au-dessus de la vallée de Karanga.",
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Vallée de Karanga'},
    },
    {
      day: 6,
      label: 'De Karanga Camp à Kosovo Camp',
      location: 'Karanga Camp (4 050 m) → Kosovo Camp (4 900 m)',
      meta: ['Dénivelé positif : 850 m (2 790 pieds)', 'Durée : 4 heures'],
      body: [
        "Une journée volontairement courte, prévue uniquement pour l'acclimatation avant votre tentative de sommet. Kosovo Camp se situe nettement plus haut que le Barafu Camp habituel utilisé sur les itinéraires plus courts, et cette altitude supplémentaire — combinée à un coucher tôt — fait une réelle différence sur votre forme le jour du sommet.",
      ],
      overnightStay: 'Kosovo Camp',
      image: {
        src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg',
        alt: 'Camp de désert alpin en haute altitude sous le sommet',
      },
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: 'Sentier à travers le désert alpin'},
    },
    {
      day: 7,
      label: 'De Kosovo Camp à Crater Camp via Stella Point',
      location: 'Kosovo Camp (4 900 m) → Stella Point (5 756 m) → Crater Camp (5 730 m)',
      meta: ['Dénivelé positif : 830 m (2 720 pieds)', 'Durée : 5-6 heures'],
      body: [
        "C'est le cœur du voyage. Après un petit-déjeuner matinal, grimpez à travers des éboulis épais jusqu'à Stella Point, sur le rebord du cratère — mentalement et physiquement le passage le plus difficile de tout l'itinéraire. De là, descendez environ 30 minutes à l'intérieur même du cratère, où le camp est installé à 5 730 m. L'après-midi étant libre, la plupart des groupes explorent le puits de cendres et la glace du fond du cratère avant un dîner inoubliable en regardant le soleil se coucher depuis le toit de l'Afrique.",
      ],
      overnightStay: "Crater Camp (à l'intérieur du cratère sommital du Kilimandjaro)",
      image: {src: '/images/packages/shared/hero-night.jpg', alt: 'Camping sous les étoiles près du sommet du Kilimandjaro'},
    },
    {
      day: 8,
      label: 'De Crater Camp à Uhuru Peak puis à Mweka Camp',
      location: 'Crater Camp (5 730 m) → Uhuru Peak (5 896 m) → Mweka Camp (3 100 m)',
      meta: ['Dénivelé positif : 166 m (545 pieds)', 'Dénivelé négatif : 2 796 m (9 175 pieds)', 'Durée : 10-11 heures'],
      body: [
        "Comme vous dormez déjà tout près du sommet, l'ascension du jour vers Uhuru Peak est courte — environ quatre-vingt-dix minutes — et calculée pour arriver au lever du soleil. Après avoir célébré au point culminant du continent, le vrai travail commence : une longue descente en repassant par Kosovo Camp jusqu'à Mweka Camp, avec près de 2 800 m de dénivelé négatif au cours de la journée.",
      ],
      overnightStay: 'Mweka Camp',
      image: {
        src: '/images/packages/9-days-northern-circuit-route/day8-uhuru-peak.webp',
        alt: "Panneau du sommet d'Uhuru Peak, le toit de l'Afrique",
      },
      secondImage: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 9,
      label: 'De Mweka Camp à Mweka Gate, transfert à Arusha',
      location: 'Mweka Camp (3 100 m) → Mweka Gate (1 640 m)',
      meta: ['Dénivelé négatif : 1 460 m (4 790 pieds)', 'Durée : 3-4 heures'],
      body: [
        "Une dernière marche facile à travers la forêt tropicale jusqu'à Mweka Gate, où votre équipe se rassemblera pour une cérémonie d'adieu avant que vous ne fassiez vos adieux et receviez votre certificat de sommet. Depuis l'entrée du parc, un court transfert vous ramène à votre hôtel d'Arusha pour une douche chaude et un repos bien mérité.",
      ],
      overnightStay: 'Arusha',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureFr,
  ],
  includes: [
    "Frais d'entrée / droits d'admission",
    'Frais de conservation',
    'Permis spécial de camping dans le cratère',
    "Toutes les activités mentionnées dans l'itinéraire",
    "Tous les hébergements indiqués dans l'itinéraire",
    'Tout le transport',
    'Toutes les taxes / TVA 18 %',
    "Prise en charge et dépose à l'aéroport",
    "Tous les repas indiqués dans l'itinéraire",
  ],
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Lemosho en 9 jours',
  faqIntro:
    "Vous avez des questions sur le fait de dormir dans le cratère du Kilimandjaro ? Consultez nos FAQ sur la route Lemosho en 9 jours ci-dessous pour des réponses claires et utiles. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter — nos experts de la montagne chez Asili Climbing Kilimanjaro sont là pour vous aider à planifier une aventure au sommet sûre, réussie et inoubliable.",
  faqs: [
    {
      question: 'En quoi la route Lemosho en 9 jours diffère-t-elle de la version standard en 8 jours ?',
      answer:
        "Cet itinéraire ajoute une nuit supplémentaire en altitude — Kosovo Camp, au lieu de rejoindre directement un camp de nuit de sommet — ainsi qu'une nuit passée à camper à l'intérieur du cratère sommital du Kilimandjaro, à 5 730 m, avant une courte ascension au lever du soleil jusqu'à Uhuru Peak. Ce jour supplémentaire en altitude améliore sensiblement l'acclimatation et les chances de réussite, et le camp dans le cratère est une expérience que très peu de grimpeurs ont l'occasion de vivre.",
    },
    {
      question: 'Est-il sûr de dormir dans le cratère à 5 730 m ?',
      answer:
        "Oui, avec la préparation adéquate. Il fait froid — bien en dessous de zéro la nuit — et l'altitude implique que vous devriez déjà être bien acclimaté à votre arrivée. Nos guides transportent de l'oxygène d'appoint et un oxymètre de pouls pour surveiller chaque participant deux fois par jour, et toute personne présentant des signes de mal aigu des montagnes est immédiatement redescendue.",
    },
    {
      question: 'Faut-il une autorisation spéciale pour camper dans le cratère ?',
      answer:
        "Oui. Le camping dans le cratère nécessite un permis distinct délivré par le parc national du Kilimandjaro, en plus des frais de parc habituels, et le nombre de places est limité. Nous nous chargeons de la demande de permis pour vous dans le cadre de ce forfait.",
    },
    {
      question: 'Quel est le niveau de difficulté de cet itinéraire par rapport aux autres itinéraires du Kilimandjaro ?',
      answer:
        "C'est l'un de nos itinéraires les plus exigeants, principalement en raison du temps prolongé passé au-dessus de 4 700 m et de la longue descente le jour du sommet. Cela dit, l'acclimatation supplémentaire intégrée au programme — dont la nuit à Kosovo Camp — vous donne un réel avantage par rapport aux itinéraires plus courts, et une expérience préalable de la haute altitude, bien que non obligatoire, est utile.",
    },
    {
      question: "Quelle est la meilleure période de l'année pour ce trek ?",
      answer:
        "Les saisons sèches — de janvier à mi-mars et de juin à octobre — offrent les ciels les plus dégagés et les meilleures conditions pour la nuit dans le cratère, où une nuit calme et claire change tout en termes de confort et de vues.",
    },
    {
      question: 'Combien de personnes composeront mon groupe ?',
      answer:
        "Nous organisons cet itinéraire en petit groupe, généralement entre 2 et 10 randonneurs, accompagnés d'une équipe complète de guides, d'un cuisinier et de porteurs.",
    },
    {
      question: "Quel type d'hébergement est utilisé sur la montagne ?",
      answer:
        "Vous dormirez dans des tentes de montagne solides, quatre saisons, sur des tapis de sol de qualité chaque nuit, y compris à Crater Camp. Notre équipe monte et démonte le camp chaque jour afin qu'il soit prêt à votre arrivée.",
    },
    {
      question: "Aurai-je besoin d'un sac de couchage plus chaud pour la nuit dans le cratère ?",
      answer:
        "Nous recommandons vivement un sac de couchage garanti jusqu'à au moins -15 °C, idéalement en duvet, ainsi qu'une couche de base bien chaude spécifiquement pour la nuit dans le cratère — les températures à 5 730 m descendent régulièrement bien en dessous de ce que la plupart des randonneurs connaissent ailleurs sur la montagne.",
    },
  ],
  hubSummary:
    "Notre itinéraire Lemosho le plus long et le plus exclusif ajoute une nuit d'acclimatation supplémentaire et une rare nuit campée à l'intérieur du cratère sommital du Kilimandjaro.",
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho en 9 jours'},
}

const rongai7Fr: TripFr = {
  slug: '7-days-rongai-route',
  category: 'package',
  name: '7 Jours Route Rongai',
  durationDays: 7,
  seoTitle: '7 Jours Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 7 Jours Route Rongai.',
  stopsLine: 'Nalemoru Gate, Simba Camp, Second Cave Camp, Kikelewa Camp, Mawenzi Tarn, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Rongai est le seul itinéraire qui aborde le Kilimandjaro par le côté nord, près de la frontière kényane, offrant une expérience plus paisible et plus isolée avec des paysages qui s'élèvent progressivement et moins d'affluence. Elle est parfaite pour ceux qui souhaitent une ascension tranquille, apprécient l'observation de la faune, et préfèrent un itinéraire plus sec — surtout pendant la saison des pluies.",
    "Sur sept jours, vous traverserez une forêt tropicale luxuriante, de vastes landes et un haut désert alpin, pour finalement vous tenir au sommet d'Uhuru Peak — le point culminant de l'Afrique.",
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Carte de la route Rongai en 7 jours'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: 'Grimpeurs sur le sentier'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Nalemoru Gate à Simba Camp',
      location: 'Nalemoru Gate (1 950 m / 6 398 pieds) → Simba Camp (2 620 m / 8 596 pieds)',
      meta: ['Dénivelé positif : 670 m / 2 198 pieds', 'Durée : 3-4 heures'],
      body: [
        'Votre trek débute à Nalemoru Gate, avec une ascension progressive à travers une forêt montagnarde luxuriante. Gardez l\'œil ouvert pour repérer des colobes et des oiseaux forestiers. Arrivez à Simba Camp, perché en lisière des landes.',
      ],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Panneau de Simba Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'De Simba Camp à Second Cave Camp',
      location: 'Simba Camp (2 620 m / 8 596 pieds) → Second Cave Camp (3 450 m / 11 318 pieds)',
      meta: ['Dénivelé positif : 830 m / 2 723 pieds', 'Durée : 5-6 heures'],
      body: [
        'Le sentier d\'aujourd\'hui s\'ouvre sur la bruyère et les landes à mesure que vous laissez la forêt derrière vous. Profitez de vues magnifiques sur le pic Kibo en vous dirigeant vers Second Cave Camp, un endroit paisible entouré de flore alpine.',
      ],
      overnightStay: 'Second Cave Camp',
      image: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-camp.webp', alt: 'Tentes de Second Cave Camp'},
    },
    {
      day: 3,
      label: 'De Second Cave à Kikelewa Camp',
      location: 'Second Cave (3 450 m / 11 318 pieds) → Kikelewa Camp (3 630 m / 11 910 pieds)',
      meta: ['Dénivelé positif : 180 m / 591 pieds', 'Durée : 3-4 heures'],
      body: [
        "Une journée plus courte mais magnifique, le sentier serpente à travers des landes accidentées, avec des vues de plus en plus spectaculaires sur les pics du Kilimandjaro. Arrivez à Kikelewa Camp, niché dans une vallée abritée aux vues panoramiques.",
      ],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
    },
    {
      day: 4,
      label: 'De Kikelewa à Mawenzi Tarn',
      location: 'Kikelewa (3 630 m / 11 910 pieds) → Mawenzi Tarn (4 310 m / 14 140 pieds)',
      meta: ['Dénivelé positif : 680 m / 2 231 pieds', 'Durée : 4-5 heures'],
      body: [
        "L'ascension d'aujourd'hui est plus raide mais très gratifiante. Vous marcherez vers Mawenzi, le deuxième pic du Kilimandjaro, avec des vues magnifiques et un paysage de haute altitude presque irréel. Mawenzi Tarn Camp se trouve dans un cirque spectaculaire au pied de falaises imposantes.",
      ],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 5,
      label: 'De Mawenzi Tarn à Kibo Hut',
      location: 'Mawenzi Tarn (4 310 m / 14 140 pieds) → Kibo Hut (4 700 m / 15 420 pieds)',
      meta: ['Dénivelé positif : 390 m / 1 280 pieds', 'Durée : 5-6 heures'],
      body: [
        'Traversez la selle d\'aspect lunaire entre Mawenzi et Kibo, atteignant Kibo Hut à midi. Reposez-vous, hydratez-vous et préparez-vous pour la difficile tentative de sommet débutant vers minuit.',
      ],
      overnightStay: 'Kibo Hut (refuge de type dortoir)',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Bâtiment en pierre de Kibo Hut'},
    },
    {
      day: 6,
      label: 'De Kibo Hut à Uhuru Peak puis à Horombo Hut',
      location: 'Kibo Hut (4 700 m / 15 420 pieds) → Uhuru Peak (5 895 m / 19 341 pieds) → Horombo Hut (3 720 m / 12 205 pieds)',
      meta: [
        'Dénivelé positif : 1 195 m / 3 920 pieds',
        'Dénivelé négatif : 2 175 m / 7 136 pieds',
        'Ascension du sommet : 6-8 heures',
        'Descente : 6 heures',
      ],
      body: [
        "Votre poussée vers le sommet débute sous un ciel étoilé, en gravissant des lacets raides jusqu'à Gilman's Point (5 685 m), puis le long du rebord du cratère jusqu'à Uhuru Peak — le toit de l'Afrique. Célébrez brièvement, puis redescendez à travers Kibo jusqu'à Horombo Hut pour un repos bien mérité.",
      ],
      overnightStay: 'Horombo Hut (refuge de type dortoir)',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: "Sommet d'Uhuru Peak"},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 7,
      label: 'De Horombo Hut à Marangu Gate',
      location: 'Horombo Hut (3 720 m / 12 205 pieds) → Marangu Gate (1 860 m / 6 102 pieds)',
      meta: ['Dénivelé négatif : 1 860 m / 6 102 pieds', 'Durée : 5-6 heures'],
      body: [
        "Descendez à travers une forêt tropicale luxuriante jusqu'à Marangu Gate, où vous recevrez votre certificat d'ascension et célébrerez votre exploit. Transfert de retour à Moshi ou Arusha.",
      ],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: 'Descente vers Marangu Gate'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Rongai en 7 jours',
  faqs: [
    {
      question: 'La route Rongai est-elle moins fréquentée que les autres itinéraires du Kilimandjaro ?',
      answer:
        "Oui, la route Rongai est le seul itinéraire qui aborde le Kilimandjaro par le nord, près de la frontière kényane. Elle est réputée pour être bien plus calme et moins fréquentée que des itinéraires populaires comme Machame ou Marangu, offrant une expérience de trek plus paisible.",
    },
    {
      question: 'Quel est le niveau de difficulté de la route Rongai en 7 jours ?',
      answer:
        "La route Rongai est considérée comme d'un niveau de difficulté modéré, avec un profil d'ascension progressif qui favorise l'acclimatation. C'est un bon choix pour ceux qui recherchent un équilibre entre défi physique et de meilleures chances de réussite.",
    },
    {
      question: 'Quel est le taux de réussite sur la route Rongai en 7 jours ?',
      answer:
        "L'itinéraire de 7 jours améliore l'acclimatation et se traduit par un taux de réussite au sommet d'environ 85 % ou plus, surtout par rapport aux versions plus courtes du même itinéraire.",
    },
    {
      question: 'À quoi ressemblent les hébergements sur la route Rongai ?',
      answer:
        "Vous logerez dans des tentes de montagne de haute qualité, montées et entretenues par notre équipe professionnelle. Lors de la descente (via Marangu), vous dormirez à Horombo Hut, un point de repos chaud et abrité. Nous incluons également une tente-toilette privée pour plus de confort.",
    },
    {
      question: 'À quoi ressemble le paysage par rapport aux autres itinéraires ?',
      answer:
        "La route Rongai offre des paysages variés et uniques, incluant une nature sauvage isolée, des versants boisés et des vues saisissantes sur le pic Mawenzi. La descente via la route Marangu offre un changement de décor, en traversant une forêt tropicale luxuriante.",
    },
    {
      question: 'Cet itinéraire est-il préférable pendant la saison des pluies ?',
      answer:
        "Oui. Le côté nord du Kilimandjaro reçoit moins de pluie, ce qui fait de Rongai un choix judicieux si vous grimpez entre mars et mai ou en novembre. C'est également une option fiable pour des treks toute l'année avec moins de perturbations météorologiques.",
    },
    {
      question: 'Les repas et l\'eau sont-ils fournis ?',
      answer:
        "Oui. Nous servons des repas frais et chauds préparés par nos cuisiniers de montagne trois fois par jour. Nous fournissons également de l'eau potable filtrée et sûre tout au long de l'ascension. Nous nous adaptons aux régimes particuliers sur demande — informez-nous simplement à l'avance.",
    },
    {
      question: "Quel type d'équipe de soutien aurai-je ?",
      answer:
        "Vous serez accompagné par une équipe de soutien complète : des guides expérimentés, des porteurs et des cuisiniers, tous formés et certifiés. Notre équipe assure votre sécurité et votre confort du début à la fin — votre réussite est notre mission.",
    },
    {
      question: 'À quoi ressemble la nuit du sommet ?',
      answer:
        "La nuit du sommet est la plus exigeante mais aussi la plus inspirante. Nous quittons Kibo Hut vers minuit, atteignant Uhuru Peak au lever du soleil. Nos guides marcheront avec vous pas à pas, vous offrant soutien et motivation tout au long du parcours.",
    },
    {
      question: 'Puis-je combiner cette ascension avec un safari en Tanzanie ?',
      answer:
        "Oui, et c'est vivement recommandé ! Chez Asili Climbing Kilimanjaro, nous proposons des extensions de safari personnalisées après votre trek. Explorez le Serengeti, le cratère du Ngorongoro, ou détendez-vous à Zanzibar — selon ce qui correspond à votre rêve de voyage.",
    },
  ],
  hubSummary:
    "En abordant le Kilimandjaro par le nord, cet itinéraire offre une perspective unique de la montagne et convient parfaitement à ceux…",
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai en 7 jours'},
}

const rongai6Fr: TripFr = {
  slug: '6-days-rongai-route',
  category: 'package',
  name: '6 Jours Route Rongai',
  durationDays: 6,
  seoTitle: '6 Jours Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription: "Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 6 Jours Route Rongai.",
  stopsLine: 'Nalemoru Gate, Simba Camp, Kikelewa Camp, Mawenzi Tarn, Kibo Hut, Horombo Hut, Marangu Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Rongai est le seul itinéraire qui aborde le Kilimandjaro par le versant nord, près de la frontière kényane, offrant une expérience plus tranquille et plus isolée, avec des paysages en pente régulière et moins d'affluence. Cette version en six jours condense l'itinéraire standard en combinant deux des étapes les plus douces du bas de la montagne en une seule journée de marche plus longue, ce qui en fait un bon choix pour les grimpeurs disposant de moins de temps ou ayant déjà une certaine expérience de la haute altitude.",
    "Vous traverserez une forêt tropicale luxuriante, des landes dégagées et un désert alpin d'altitude à la montée, puis redescendrez par le versant Marangu de la montagne en passant par Horombo Hut, avant de vous tenir enfin au sommet d'Uhuru Peak — le point culminant de l'Afrique.",
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Carte de la route Rongai en 6 jours'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: 'Grimpeurs sur le sentier'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Nalemoru Gate à Simba Camp',
      location: 'Nalemoru Gate (1 950 m) → Simba Camp (2 600 m)',
      meta: ['Dénivelé positif : 650 m (2 133 pieds)', 'Durée : 5 heures'],
      body: [
        "Votre trek débute à Nalemoru Gate, sur le versant nord plus tranquille du Kilimandjaro, tout près de la frontière kényane. Après l'enregistrement auprès du parc national, suivez une ascension progressive à travers la forêt de montagne — gardez l'œil ouvert pour les colobes et les oiseaux forestiers — avant d'arriver à Simba Camp, à la lisière des landes.",
      ],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Panneau de Simba Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'De Simba Camp à Kikelewa Camp',
      location: 'Simba Camp (2 600 m) → Kikelewa Camp (3 600 m)',
      meta: ['Dénivelé positif : 1 000 m (3 281 pieds)', 'Durée : 6-7 heures'],
      body: [
        "Une journée plus longue qui combine deux des étapes les plus douces de l'itinéraire standard en une seule. Le sentier s'ouvre sur la bruyère et les landes, passant par Second Cave à mi-parcours environ — un bon endroit pour un déjeuner tiré du sac — avant de continuer jusqu'à Kikelewa Camp, niché dans une vallée abritée avec des vues dégagées sur le Mawenzi et les plaines en contrebas.",
      ],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
      secondImage: {
        src: '/images/packages/7-days-rongai-route/day2-second-cave.webp',
        alt: 'Second Cave, la halte déjeuner en route vers Kikelewa',
      },
    },
    {
      day: 3,
      label: 'De Kikelewa Camp à Mawenzi Tarn',
      location: 'Kikelewa Camp (3 600 m) → Mawenzi Tarn (4 330 m)',
      meta: ['Dénivelé positif : 730 m (2 395 pieds)', 'Durée : 4 heures'],
      body: [
        "Une montée courte mais régulièrement raide vers les landes d'altitude, bordée de lobélies géantes et de séneçons. Mawenzi Tarn Camp se niche dans un cirque spectaculaire au pied du Mawenzi, le deuxième plus haut sommet du Kilimandjaro — un endroit magnifique pour se reposer et laisser votre corps s'adapter à l'altitude.",
      ],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 4,
      label: 'De Mawenzi Tarn à Kibo Hut',
      location: 'Mawenzi Tarn (4 330 m) → Kibo Hut (4 700 m)',
      meta: ['Dénivelé positif : 370 m (1 214 pieds)', 'Durée : 5 heures'],
      body: [
        "Traversez la Selle, ce paysage lunaire situé entre le Mawenzi et le Kibo, les deux plus hauts sommets du Kilimandjaro, pour atteindre Kibo Hut en début d'après-midi. Avec un dîner servi tôt et un coucher bien avant le crépuscule, cette courte journée est avant tout consacrée au repos et à la préparation de la tentative de sommet qui débute cette même nuit.",
      ],
      overnightStay: 'Kibo Hut (refuge de type dortoir)',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Bâtiment en pierre de Kibo Hut'},
    },
    {
      day: 5,
      label: 'De Kibo Hut à Uhuru Peak puis à Horombo Hut',
      location: 'Kibo Hut (4 700 m) → Uhuru Peak (5 895 m) → Horombo Hut (3 720 m)',
      meta: ['Dénivelé positif : 1 195 m (3 920 pieds)', 'Dénivelé négatif : 2 175 m (7 136 pieds)', 'Durée : 14 heures'],
      body: [
        "Votre guide vous réveille vers minuit pour un thé et des biscuits avant que ne débute la montée finale. Le sentier grimpe régulièrement en passant par Hans Meyer Cave jusqu'à Gilman's Point, sur le rebord du cratère, puis continue — souvent sur la neige — jusqu'à Uhuru Peak, le toit de l'Afrique. Après avoir célébré au sommet, une longue descente vous ramène par Kibo Hut pour un déjeuner chaud, puis jusqu'à Horombo Hut pour un dîner et un repos bien mérités.",
      ],
      overnightStay: 'Horombo Hut (refuge de type dortoir)',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: "Sommet d'Uhuru Peak"},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'De Horombo Hut à Marangu Gate',
      location: 'Horombo Hut (3 720 m) → Marangu Gate (1 980 m)',
      meta: ['Dénivelé négatif : 1 740 m (5 709 pieds)', 'Durée : 6 heures'],
      body: [
        "Une célébration bien méritée avec votre équipe — pleine de chants et de danses — marque le début de votre dernière matinée. Descendez à travers la forêt tropicale luxuriante jusqu'à Marangu Gate, où vous signerez le registre et recevrez votre certificat de sommet avant de repartir vers Moshi pour une douche chaude et une vraie célébration.",
      ],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: 'Descente vers Marangu Gate'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Rongai en 6 jours',
  faqIntro:
    "Vous avez des questions sur la route Rongai en 6 jours ? Consultez nos FAQ ci-dessous pour des réponses claires et utiles. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter — nos experts de la montagne chez Asili Climbing Kilimanjaro sont là pour vous aider à planifier une aventure au sommet sûre, réussie et inoubliable.",
  faqs: [
    {
      question: 'En quoi la route Rongai en 6 jours diffère-t-elle de la version en 7 jours ?',
      answer:
        "L'itinéraire en six jours combine deux des étapes les plus douces du bas de la montagne — de Simba Camp à Second Cave, puis de Second Cave à Kikelewa — en une seule journée de marche plus longue. Le reste suit exactement le même chemin, les mêmes camps et la même nuit de sommet que la route en 7 jours, avec simplement un jour d'acclimatation en moins.",
    },
    {
      question: "Six jours suffisent-ils pour bien s'acclimater sur la route Rongai ?",
      answer:
        "Cela peut suffire, en particulier pour les grimpeurs ayant déjà une certaine expérience de la haute altitude — la pente régulière de la route Rongai offre un réel avantage par rapport aux itinéraires plus raides. Cela dit, si c'est votre première expérience au-dessus de 4 000 m, nous recommandons plutôt la version en 7 jours pour de meilleures chances d'atteindre le sommet confortablement.",
    },
    {
      question: 'Quel est le taux de réussite sur cet itinéraire ?',
      answer:
        "L'itinéraire Rongai en 6 jours affiche un bon taux de réussite, bien que légèrement inférieur à la version en 7 jours, simplement parce qu'il comporte un jour d'acclimatation de moins. Votre guide vous surveillera de près tout au long du trek et ajustera le rythme si nécessaire.",
    },
    {
      question: "La route Rongai est-elle moins fréquentée que les autres itinéraires du Kilimandjaro ?",
      answer:
        "Oui. C'est le seul itinéraire qui aborde le Kilimandjaro par le nord, près de la frontière kényane, et qui nécessite le plus long trajet en voiture pour atteindre le départ du sentier — ce qui la rend nettement plus tranquille que des routes comme Machame ou Marangu.",
    },
    {
      question: 'Quels sont les hébergements sur cet itinéraire ?',
      answer:
        "Vous dormirez sous tente de montagne de qualité pendant les quatre premières nuits, puis dans des refuges de type dortoir à Kibo et Horombo. Nous fournissons une tente toilette privée tout au long du trek pour plus de confort.",
    },
    {
      question: 'Cet itinéraire est-il un bon choix pendant la saison des pluies ?',
      answer:
        "Oui — le versant nord du Kilimandjaro reçoit nettement moins de pluie que les approches sud, ce qui fait de Rongai un choix judicieux si vous grimpez pendant les saisons intermédiaires de mars à mai ou en novembre.",
    },
    {
      question: 'Que se passe-t-il pendant la nuit du sommet ?',
      answer:
        "Vous quitterez Kibo Hut vers minuit, grimpant de nuit en passant par Hans Meyer Cave et Gilman's Point pour atteindre Uhuru Peak vers le lever du soleil, avant une longue descente jusqu'à Horombo Hut le jour même. C'est la journée la plus exigeante du trek, mais nos guides vous accompagnent pas à pas.",
    },
    {
      question: 'Puis-je combiner cette ascension avec un safari en Tanzanie ?',
      answer:
        "Absolument. Nous proposons des extensions de safari personnalisées après votre ascension — le Serengeti, le cratère du Ngorongoro ou un séjour détente à Zanzibar sont des options très appréciées.",
    },
  ],
  hubSummary:
    "Une version plus rapide de l'itinéraire tranquille du nord — six jours de Nalemoru Gate à Uhuru Peak, avec moins d'affluence que les approches classiques du sud.",
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai en 6 jours'},
}

const umbwe6Fr: TripFr = {
  slug: '6-days-umbwe-route',
  category: 'package',
  name: '6 Jours Route Umbwe',
  durationDays: 6,
  seoTitle: '6 Jours Route Umbwe | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 6 Jours Route Umbwe.',
  stopsLine: 'Umbwe Gate, Umbwe Cave Camp, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp et Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Umbwe est reconnue comme l'itinéraire le plus direct, le plus raide et le plus exigeant vers le sommet du Mont Kilimandjaro. Cet itinéraire n'est pas pour les âmes sensibles. Il exige une bonne condition physique, une résilience mentale et une certaine expérience du trek. Ce qui distingue Umbwe, c'est sa solitude, ses paysages spectaculaires et l'atmosphère brute et sauvage qu'il offre du début à la fin.",
    "Si vous êtes un randonneur expérimenté à la recherche d'un sentier tranquille avec peu d'affluence et une ascension rapide, la route Umbwe pourrait être parfaite pour vous. Malgré sa difficulté, l'itinéraire rejoint le sentier Machame au deuxième ou troisième jour, permettant une certaine acclimatation avant la nuit du sommet.",
  ],
  mapImage: {
    src: '/images/packages/6-days-umbwe-route/hero.jpg',
    alt: 'Camping sur la route Umbwe avec le sommet du Kilimandjaro en arrière-plan',
  },
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 jours'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'De Umbwe Gate à Umbwe Cave Camp',
      location: 'Umbwe Gate (1 600 m) → Umbwe Cave Camp (2 850 m)',
      meta: ['Dénivelé positif : 1 250 m / 4 100 pieds', 'Durée : 5-6 heures'],
      body: [
        "Votre voyage commence par un court trajet depuis Moshi jusqu'à Umbwe Gate. Après l'enregistrement, le sentier plonge directement dans une forêt tropicale dense et humide. Le chemin raide grimpe rapidement à travers des racines d'arbres et des crêtes moussues jusqu'à ce que vous atteigniez Umbwe Cave Camp — votre première nuit sur la montagne.",
      ],
      overnightStay: 'Umbwe Cave Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-camp.jpg', alt: 'Umbwe Cave Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-2.jpg', alt: 'Panneau de Umbwe Gate'},
    },
    {
      day: 2,
      label: 'De Umbwe Cave à Barranco Camp',
      location: 'Umbwe Cave Camp (2 850 m/9 350 pieds) → Barranco Camp (3 976 m/13 044 pieds)',
      meta: ['Dénivelé positif : 1 126 m (3 694 pieds)', 'Durée : 4-5 heures'],
      body: [
        "Vous grimperez de manière abrupte hors de la zone forestière pour entrer dans la région de bruyère et de landes. Le sentier se rétrécit le long de crêtes rocheuses, révélant de vastes vues sur le pic Kibo et la Western Breach. En début d'après-midi, vous atteindrez Barranco Camp, niché au pied de l'imposante Barranco Wall.",
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day2-barranco-camp.jpg', alt: 'Tentes de Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day2-barranco-2.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 3,
      label: 'De Barranco Camp à Karanga Camp via la Barranco Wall',
      location:
        'Barranco Camp (3 850 m/12 600 pieds) → Barranco Wall (4 200 m/13 800 pieds) → Karanga Camp (3 950 m/13 000 pieds)',
      meta: ['Dénivelé positif : 350 m / 1 150 pieds', 'Dénivelé négatif : 250 m / 820 pieds', 'Durée : 3-4 heures'],
      body: bodyBarrancoWallToKarangaFr,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day3-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day3-karanga-2.jpg', alt: 'Vallée de Karanga'},
    },
    {
      day: 4,
      label: 'De Karanga Camp à Barafu Camp',
      location: 'Karanga Camp (3 950 m/13 000 pieds) → Barafu Camp (4 600 m/15 100 pieds)',
      meta: ['Dénivelé positif : 650 m / 2 150 pieds', 'Durée : 3-4 heures'],
      body: bodyKarangaToBarafuFr,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day4-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day4-barafu-2.jpg', alt: 'Sentier vers Barafu Camp'},
    },
    {
      day: 5,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      location:
        'Barafu Camp (4 600 m/15 100 pieds) → Uhuru Peak (5 895 m/19 300 pieds) → Mweka Camp (3 110 m/10 200 pieds)',
      meta: [
        'Dénivelé positif : 1 295 m / 4 200 pieds',
        'Dénivelé négatif : 2 785 m / 9 100 pieds',
        'Ascension du sommet : 6-8 heures',
        'Descente : 6 heures',
      ],
      body: bodySummitToMwekaFr,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day5-mweka-2.jpg', alt: 'Tentes de Mweka Camp'},
    },
    {
      day: 6,
      label: 'De Mweka Camp à Mweka Gate',
      location: 'Mweka Camp (3 110 m/10 200 pieds) → Mweka Gate (1 830 m/6 000 pieds)',
      meta: ['Dénivelé négatif : 1 280 m / 4 220 pieds', 'Durée : 2-3 heures'],
      body: bodyMwekaToGateFr,
      image: {
        src: '/images/packages/6-days-umbwe-route/day6-mweka-gate.jpg',
        alt: 'Célébration du certificat de sommet à Mweka Gate',
      },
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Umbwe en 6 jours',
  faqs: [
    {
      question: 'La route Umbwe est-elle difficile ?',
      answer:
        "Oui, la route Umbwe est considérée comme l'un des itinéraires les plus exigeants du Mont Kilimandjaro en raison de son ascension raide et de son gain d'altitude rapide. Elle convient mieux aux randonneurs expérimentés ou en excellente condition physique, à l'aise avec des sentiers raides et la haute altitude.",
    },
    {
      question: "Qu'est-ce qui rend la route Umbwe unique ?",
      answer:
        "Son approche directe et tranquille est ce qui rend Umbwe spéciale. C'est l'itinéraire le moins fréquenté, offrant des paysages spectaculaires, une forêt tropicale dense et un trek le long de crêtes. Il rejoint également le circuit sud plus pittoresque près de Barranco Camp, offrant des vues magnifiques.",
    },
    {
      question: 'Combien de jours faut-il pour gravir le Kilimandjaro via Umbwe ?',
      answer:
        "L'itinéraire standard d'Umbwe est de 6 jours, mais certains grimpeurs choisissent de le prolonger à 7 jours pour permettre une meilleure acclimatation et augmenter les taux de réussite au sommet.",
    },
    {
      question: 'Quel est le taux de réussite pour la route Umbwe en 6 jours ?',
      answer:
        "En raison du gain d'altitude rapide et du manque de temps d'acclimatation, le taux de réussite pour la route Umbwe en 6 jours est plus faible que pour les itinéraires plus longs — généralement entre 60 % et 70 %. Cependant, les grimpeurs en forme et bien préparés ayant une expérience préalable de l'altitude réussissent souvent.",
    },
    {
      question: 'La route Umbwe est-elle dangereuse ?',
      answer:
        "L'itinéraire n'est pas dangereux s'il est abordé correctement, mais il est physiquement plus exigeant que les autres. Le principal risque est le mal aigu des montagnes en raison de l'ascension rapide. Nous prenons la sécurité au sérieux et surveillons étroitement tous les grimpeurs pour détecter les signes de MAM (mal aigu des montagnes).",
    },
    {
      question: "Quel type d'hébergement est fourni sur la route Umbwe ?",
      answer:
        "Tout l'hébergement se fait sous des tentes de montagne, installées à des emplacements désignés. Nous fournissons des tentes de couchage de qualité, des tapis de sol épais, et une tente-restaurant séparée avec tables et chaises pour votre confort.",
    },
    {
      question: "Qu'est-ce qui est inclus dans le forfait d'ascension Umbwe ?",
      answer:
        "Notre forfait comprend des guides de montagne professionnels, des porteurs, les frais de parc, l'équipement de camping, les repas sur la montagne et les transferts depuis/vers votre hôtel. Les vols internationaux, les pourboires, l'équipement personnel et les nuits supplémentaires au lodge ne sont pas inclus.",
    },
    {
      question: "Puis-je louer de l'équipement si je ne l'ai pas tout ?",
      answer:
        "Oui, nous proposons la location d'équipement à Moshi ou Arusha. Des articles comme des sacs de couchage, bâtons de marche, vestes et chaussures sont disponibles à la location à des prix raisonnables. Nous vous fournirons une liste de vérification de l'équipement avant votre voyage.",
    },
    {
      question: 'À quoi ressemble la météo sur la route Umbwe ?',
      answer:
        "La météo varie selon l'altitude. Attendez-vous à des conditions humides de forêt tropicale au départ, des conditions alpines froides et sèches à mi-parcours, et des températures glaciales près du sommet. Il est important de s'habiller en couches et de se préparer à des changements météorologiques soudains.",
    },
    {
      question: 'Quelle est la meilleure période pour gravir la route Umbwe ?',
      answer:
        "Les meilleures périodes pour randonner sont pendant les saisons sèches : de janvier à début mars et de juin à octobre. Ces mois offrent les ciels les plus dégagés, les meilleures conditions de sentier et une météo plus stable.",
    },
  ],
  hubSummary:
    'La route Umbwe est réputée pour son ascension exigeante et raide, ainsi que pour son sentier magnifique et moins fréquenté.',
  hubImage: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Route Umbwe en 6 jours'},
}

const northernCircuit9Fr: TripFr = {
  slug: '9-days-northern-circuit-route',
  category: 'package',
  name: '9 Jours Northern Circuit',
  durationDays: 9,
  seoTitle: '9 Jours Route Northern Circuit | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait 9 Jours Route Northern Circuit.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Moir Hut, Buffalo Camp, Third Cave Camp, School Hut, Uhuru Peak, Mweka Camp et Mweka Gate',
  priceDisclaimer:
    "*Le prix par personne comprend : un guide de montagne professionnel, les frais d'entrée au parc, tous les hébergements en camping, les repas pendant le trek, les transferts depuis/vers l'entrée du parc, et un séjour à l'hôtel à Moshi/Arusha après l'ascension.",
  overviewBody: [
    "La route Northern Circuit est l'itinéraire le plus récent et le plus passionnant du Kilimandjaro — et sans doute le plus gratifiant. Elle offre des vues à 360° incomparables, moins d'affluence, et le meilleur profil d'acclimatation de tous les itinéraires du Kilimandjaro. S'étendant sur neuf jours, ce trek débute sur le côté ouest isolé de la montagne et contourne les versants nord rarement empruntés avant de gravir le sommet par l'est. Il est idéal pour ceux qui recherchent une expérience plus immersive et pittoresque avec un taux de réussite au sommet très élevé.",
    "Si vous recherchez une aventure plus tranquille et hors des sentiers battus, avec des paysages magnifiques et suffisamment de temps pour vous adapter à l'altitude, la route Northern Circuit est votre itinéraire idéal.",
  ],
  mapImage: {
    src: '/images/packages/9-days-northern-circuit-route/hero.png',
    alt: 'Carte de la route Northern Circuit au Kilimandjaro',
  },
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: "Le Kilimandjaro au-dessus de la savane d'acacias"},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: 'Grimpeurs approchant du sommet dans la neige'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Route Machame en 7 jours'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Route Northern Circuit en 9 jours'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Route Rongai en 7 jours'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Route Umbwe en 6 jours'},
  ],
  itinerary: [
    arrivalFr,
    {
      day: 1,
      label: 'Londorossi Gate – Mti Mkubwa Camp',
      location: 'Londorossi Gate (2 100 m/6 890 pieds) → Mti Mkubwa Camp (2 650 m/8 694 pieds)',
      meta: ['Dénivelé positif : 550 m / 1 804 pieds', 'Durée : 3-4 heures'],
      body: ["Randonnez à travers une forêt tropicale dense grouillant d'oiseaux et de singes. Cette courte première journée favorise l'acclimatation."],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa – Shira 1 Camp',
      location: 'Mti Mkubwa (2 650 m/8 694 pieds) → Shira 1 Camp (3 610 m/11 844 pieds)',
      meta: ['Dénivelé positif : 960 m / 3 150 pieds', 'Durée : 5-6 heures'],
      body: ['Montez régulièrement hors de la forêt vers les landes. Profitez de vastes vues sur le plateau du Shira et le mont Meru au loin.'],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-2.jpg', alt: 'Plateau du Shira'},
    },
    {
      day: 3,
      label: 'Shira 1 – Shira 2 Camp',
      location: 'Shira 1 Camp (3 610 m/11 844 pieds) → Shira 2 Camp (3 850 m/12 631 pieds)',
      meta: ['Dénivelé positif : 240 m / 787 pieds', 'Durée : 4-5 heures'],
      body: ["Aujourd'hui, c'est une marche douce à travers le plateau de haute altitude. Vous commencerez à ressentir l'immensité de la montagne en traversant des paysages volcaniques."],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-2.jpg', alt: 'Vue de Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'Shira 2 – Lava Tower – Moir Hut',
      location: 'Shira 2 (3 850 m/12 631 pieds) → Lava Tower (4 600 m/15 091 pieds) → Moir Hut (4 200 m/13 780 pieds)',
      meta: ['Dénivelé positif : 750 m / 2 460 pieds', 'Dénivelé négatif : 400 m / 1 311 pieds', 'Durée : 6-7 heures'],
      body: ["Montez jusqu'à Lava Tower pour l'acclimatation avant de redescendre vers Moir Hut. C'est une journée essentielle pour s'adapter à l'altitude."],
      overnightStay: 'Moir Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day4-moir-hut.jpg', alt: 'Moir Hut'},
    },
    {
      day: 5,
      label: 'Moir Hut – Buffalo Camp',
      location: 'Moir Hut (4 200 m/13 780 pieds) → Buffalo Camp (4 020 m/13 188 pieds)',
      meta: ['Dénivelé positif : 200 m / 656 pieds', 'Dénivelé négatif : 380 m / 1 247 pieds', 'Durée : 5-6 heures'],
      body: ['Explorez les versants nord préservés avec de vastes vues sur le Kenya. Un itinéraire paisible avec très peu d\'affluence.'],
      overnightStay: 'Buffalo Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day5-buffalo-camp.jpg', alt: 'Buffalo Camp'},
    },
    {
      day: 6,
      label: 'Buffalo Camp – Third Cave Camp',
      location: 'Buffalo Camp (4 020 m/13 188 pieds) → Third Cave Camp (3 870 m/12 697 pieds)',
      meta: ['Dénivelé positif : 150 m / 492 pieds', 'Durée : 5-6 heures'],
      body: ['Une journée douce en direction de l\'est à travers un terrain de désert alpin. Moins d\'affluence, plus de tranquillité.'],
      overnightStay: 'Third Cave Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-camp.jpg', alt: 'Third Cave Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-2.jpg', alt: 'Vue de Third Cave Camp'},
    },
    {
      day: 7,
      label: 'Third Cave Camp – School Hut',
      location: 'Third Cave (3 870 m/12 697 pieds) → School Hut (4 750 m/15 584 pieds)',
      meta: ['Dénivelé positif : 880 m / 2 887 pieds', 'Durée : 4-5 heures'],
      body: ['Une ascension raide à travers des paysages de plus en plus arides. Reposez-vous tôt pour votre poussée vers le sommet à minuit.'],
      overnightStay: 'School Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut.jpg', alt: 'School Hut'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut-2.webp', alt: 'Panneau de School Hut'},
    },
    {
      day: 8,
      label: 'Jour du sommet (Uhuru Peak) – Mweka Camp',
      location: 'School Hut (4 750 m/15 584 pieds) → Uhuru Peak (5 895 m/19 341 pieds) → Mweka Camp (3 100 m/10 170 pieds)',
      meta: ['Dénivelé positif : 1 145 m / 3 757 pieds', 'Dénivelé négatif : 2 795 m / 9 169 pieds', 'Durée : 12-14 heures'],
      body: [
        "Commencez votre ascension à minuit. Atteignez Stella Point au lever du soleil, puis le sommet d'Uhuru Peak. Descendez à travers les éboulis et les landes jusqu'à Mweka Camp.",
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-2.jpg', alt: 'Huttes de Mweka Camp'},
    },
    {
      day: 9,
      label: 'De Mweka Camp à Mweka Gate',
      location: 'Mweka Camp (3 110 m/10 200 pieds) → Mweka Gate (1 830 m/6 000 pieds)',
      meta: ['Dénivelé négatif : 1 280 m / 4 220 pieds', 'Durée : 2-3 heures'],
      body: bodyMwekaToGateFr,
      image: {src: '/images/packages/9-days-northern-circuit-route/day9-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: 'FAQ Route Northern Circuit en 9 jours',
  faqIntro:
    "Vous avez des questions sur l'ascension du Kilimandjaro avec nous ? Consultez nos FAQ sur la route Northern Circuit ci-dessous pour des réponses claires et utiles. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter — nos experts de la montagne chez Asili Climbing Kilimanjaro sont là pour vous aider à planifier une aventure au sommet sûre, réussie et inoubliable.",
  faqs: [
    {
      question: 'Quel est le niveau de difficulté de la route Northern Circuit ?',
      answer:
        "C'est un itinéraire de difficulté modérée à exigeante, mais sa longue durée en fait l'un des plus faciles en termes d'acclimatation. Avec neuf jours, votre corps dispose de largement assez de temps pour s'adapter à l'altitude.",
    },
    {
      question: "Qu'est-ce qui différencie cet itinéraire des autres ?",
      answer:
        "Le Northern Circuit est l'itinéraire le plus long et le plus calme du Kilimandjaro. Il contourne les versants nord isolés, offrant des vues magnifiques et un taux de réussite élevé au sommet.",
    },
    {
      question: '9 jours est-ce trop long à passer sur la montagne ?',
      answer:
        "Pas du tout. Ce temps prolongé permet un gain d'altitude progressif, une meilleure acclimatation et moins de problèmes liés à l'altitude, augmentant vos chances d'atteindre Uhuru Peak en toute sécurité.",
    },
    {
      question: 'À quoi ressemble la nuit du sommet ?',
      answer:
        "Vous débuterez votre ascension à minuit depuis School Hut. L'objectif est d'atteindre le sommet au lever du soleil, puis de redescendre à Mweka Camp le même jour — un total de 12 à 14 heures de marche.",
    },
    {
      question: "À quoi ressemble l'hébergement pendant le trek ?",
      answer:
        "Toutes les nuits se passent sous des tentes de montagne fournies par Asili Climbing Kilimanjaro. Les tentes sont chaudes, imperméables, et montées par notre équipe avant votre arrivée au camp.",
    },
    {
      question: 'Les porteurs et le personnel sont-ils traités équitablement ?',
      answer:
        "Absolument. Nous suivons les normes du KPAP (Kilimanjaro Porters Assistance Project) pour garantir que tous les porteurs et l'équipe sont payés équitablement et travaillent dans des conditions sûres.",
    },
    {
      question: "Ai-je besoin d'une expérience préalable de trek ?",
      answer:
        "Pas nécessairement. Vous devez être en bonne forme physique et mentalement préparé. Nos guides adaptent le rythme du trek à vos capacités et assurent une acclimatation adéquate.",
    },
    {
      question: 'Quelle est la meilleure période pour faire le Northern Circuit ?',
      answer:
        "Juin à octobre et janvier à début mars sont idéaux. Ces mois offrent des ciels dégagés, moins de précipitations et de meilleures conditions de sentier.",
    },
    {
      question: 'Est-ce que je grimperai avec un groupe ?',
      answer:
        "Nous proposons à la fois des ascensions privées et des treks de groupe ouverts. Vous pouvez choisir le style que vous préférez lors de la réservation.",
    },
    {
      question: 'Que se passe-t-il si j\'ai le mal aigu des montagnes ?',
      answer:
        "Votre guide surveille votre santé quotidiennement. Si des symptômes apparaissent, nous agissons immédiatement — en ajustant le rythme, en proposant un soutien en oxygène, ou en organisant une évacuation si nécessaire.",
    },
  ],
  hubSummary:
    'L\'itinéraire le plus récent et le plus long, offrant des vues à 360 degrés et les taux de réussite les plus élevés pour atteindre le sommet.',
  hubImage: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit en 9 jours'},
}

// ---------------------------------------------------------------------------
// 4 combo packages (Kilimanjaro + safari)
// ---------------------------------------------------------------------------

const combo9Fr: TripFr = {
  slug: '9-days-kilimanjaro-safari',
  category: 'combo',
  name: '9 Jours Kilimandjaro et Safari',
  durationDays: 9,
  seoTitle: '9 Jours Kilimandjaro et Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait combiné 9 Jours Kilimandjaro et Safari.',
  stopsLine:
    'Marangu Gate, Mandara Hut, Horombo Hut, Kibo Hut, Horombo Hut, Marangu Gate, Parc national de Tarangire, Cratère du Ngorongoro, Parc national du lac Manyara',
  priceDisclaimer: comboPriceDisclaimerFr,
  overviewBody: [
    "Cette aventure de 9 jours est la façon ultime de découvrir le cœur de la Tanzanie — combinant le frisson de l'ascension du Mont Kilimandjaro via la pittoresque et confortable route Marangu, avec l'excitation d'un safari classique du circuit nord à travers le parc national de Tarangire, le cratère du Ngorongoro et le lac Manyara.",
    "Que vous visitiez la Tanzanie pour la première fois ou que vous réalisiez un rêve de toujours, ce voyage offre l'équilibre parfait entre accomplissement physique, paysages à couper le souffle et rencontres rapprochées avec la faune — le tout soutenu par l'expertise et le soin de l'équipe Asili Climbing Kilimanjaro.",
  ],
  mapImage: {src: '/images/combo/9-days-kilimanjaro-safari/marangu-trekkers.jpg', alt: 'Randonneurs sur la route Marangu'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '9 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '9 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '9 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '9 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '9 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '9 Jours Kilimandjaro et Safari'},
  ],
  itinerary: [
    comboArrivalFr(),
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      meta: ['Altitude : 1 860 m → 2 700 m', 'Dénivelé positif : 840 m (2 755 pieds)', 'Durée : 4-5 heures'],
      body: [
        "Commencez votre voyage à travers une forêt tropicale luxuriante peuplée de colobes et d'une flore vibrante. Après une montée régulière, vous atteindrez Mandara Hut pour votre première nuit sur la montagne.",
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/mandara.jpg', alt: 'Marangu Gate – Mandara Hut'},
      overnightStay: 'Mandara Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/mandara-hut.webp', alt: 'Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      meta: ['Altitude : 2 700 m → 3 720 m', 'Dénivelé positif : 1 020 m (3 346 pieds)', 'Durée : 6-7 heures'],
      body: ['En sortant de la forêt, le sentier se transforme en lande et bruyère. En chemin, profitez des vues sur les pics Kibo et Mawenzi.'],
      image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Mandara Hut – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 3,
      label: 'Acclimatation à Horombo Hut',
      meta: [
        'Altitude : 3 720 m → 4 000 m (Zebra Rocks) → 3 720 m',
        'Dénivelé positif : 280 m (918 pieds)',
        'Dénivelé négatif : 280 m (918 pieds)',
        'Durée : 2-3 heures (randonnée facultative)',
      ],
      body: ["Une journée d'acclimatation essentielle pour aider votre corps à s'adapter. Vous pouvez faire une courte randonnée jusqu'à Zebra Rocks et revenir pour déjeuner et vous reposer à Horombo."],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-2.jpeg', alt: 'Acclimatation à Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo3.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      meta: ['Altitude : 3 720 m → 4 703 m', 'Dénivelé positif : 983 m (3 225 pieds)', 'Durée : 6-7 heures'],
      body: ['Le trek d\'aujourd\'hui vous fait traverser un terrain de désert alpin en direction du camp de base à Kibo Hut. Reposez-vous tôt pour vous préparer à la nuit du sommet.'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut2.jpg', alt: 'Horombo Hut – Kibo Hut'},
      overnightStay: 'Kibo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut-1.jpg', alt: 'Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        'Altitude : 4 703 m → 5 895 m (Uhuru Peak) → 3 720 m',
        'Dénivelé positif : 1 192 m (3 910 pieds)',
        'Dénivelé négatif : 2 175 m (7 136 pieds)',
        'Durée : 12-14 heures',
      ],
      body: [
        "Entamez votre poussée vers le sommet juste après minuit, atteignant Gilman's Point puis Uhuru Peak au lever du soleil. Après avoir célébré au sommet, descendez vers Horombo Hut pour votre dernière nuit.",
      ],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Kibo Hut – Uhuru Peak – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – Transfert',
      meta: ['Altitude : 3 720 m → 1 860 m', 'Dénivelé négatif : 1 860 m (6 102 pieds)', 'Durée : 5-6 heures'],
      body: ["Descendez à travers les landes et la forêt tropicale jusqu'à l'entrée du parc. Après avoir reçu votre certificat de sommet, vous serez transféré à votre hôtel."],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/marangu.jpg', alt: 'Horombo Hut – Marangu Gate – Transfert'},
      overnightStay: 'Hôtel à Arusha (inclus)',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Hôtel à Arusha (inclus)'},
    },
    {
      day: 7,
      label: 'Arusha – Parc national de Tarangire',
      meta: ["Temps de trajet : environ 2,5 heures depuis Arusha", "Point fort : troupeaux d'éléphants et baobabs anciens"],
      body: [
        "Partez d'Arusha après le petit-déjeuner et dirigez-vous directement vers le parc national de Tarangire, réputé pour ses paysages spectaculaires parsemés de baobabs et ses importantes populations d'éléphants. Le parc abrite des lions, des girafes, des zèbres, des gnous et plus de 500 espèces d'oiseaux. Après une journée complète de safari-vision, vous rejoindrez votre lodge près du lac Manyara ou de Karatu pour le dîner et la nuit.",
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/Gallery-img07.webp', alt: 'Arusha – Parc national de Tarangire'},
      overnightStay: 'Lodge à Karatu ou dans la région du lac Manyara',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Lodge à Karatu ou dans la région du lac Manyara'},
    },
    {
      day: 8,
      label: 'Cratère du Ngorongoro',
      meta: ["Temps de trajet : 45 minutes à 1 heure jusqu'à l'entrée du cratère", 'Point fort : observation des Big Five dans une caldeira volcanique'],
      body: [
        'Après un petit-déjeuner matinal, descendez dans le magnifique cratère du Ngorongoro, site classé au patrimoine mondial de l\'UNESCO, souvent surnommé la « huitième merveille du monde ». Cette immense caldeira est un refuge pour la faune — notamment les éléphants, lions, buffles, hippopotames, flamants roses et le rhinocéros noir en danger. Profitez d\'un pique-nique au fond du cratère avant de retourner à votre lodge.',
      ],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Cratère du Ngorongoro'},
      overnightStay: 'Même lodge à Karatu',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Même lodge à Karatu'},
    },
    {
      day: 9,
      label: 'Parc national du lac Manyara – Arusha',
      meta: ['Temps de trajet : environ 1,5 heure de retour vers Arusha', 'Point fort : lions grimpeurs d\'arbres et flamants roses'],
      body: [
        "Commencez votre matinée par un trajet vers le parc national du lac Manyara, célèbre pour sa luxuriante forêt d'eaux souterraines, son lac couvert de flamants roses et ses lions grimpeurs d'arbres. Ce parc compact mais varié est parfait pour un dernier safari-vision détendu. Après le déjeuner, retournez à Arusha où votre safari se termine. En option, nous pouvons vous transférer à l'aéroport pour votre vol de correspondance.",
      ],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/tanzania-safari.jpg', alt: 'Parc national du lac Manyara – Arusha'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: comboFaqHeadingFr,
  faqIntro: comboFaqIntroFr,
  faqs: comboFaqsFr,
  hubSummary:
    "Parfait pour les aventuriers disposant de peu de temps. Gravissez le Mont Kilimandjaro via un itinéraire de 6 jours, puis profitez d'un safari rapide de 3 jours à travers les parcs emblématiques de la Tanzanie comme le Ngorongoro et Tarangire.",
  hubImage: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: '9 Jours Kilimandjaro et Safari'},
}

const combo10Fr: TripFr = {
  slug: '10-days-kilimanjaro-and-safari',
  category: 'combo',
  name: '10 Jours Kilimandjaro et Safari',
  durationDays: 10,
  seoTitle: '10 Jours Kilimandjaro et Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait combiné 10 Jours Kilimandjaro et Safari.',
  stopsLine:
    'Machame Gate, Machame Camp, Shira Camp, Barranco Camp, Lava Tower, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Parc national de Tarangire, Cratère du Ngorongoro, Parc national du lac Manyara',
  priceDisclaimer: comboPriceDisclaimerFr,
  overviewBody: [
    "Cette aventure de 10 jours est parfaite si vous souhaitez gravir le Mont Kilimandjaro tout en découvrant la magie d'un safari africain classique — le tout en un seul voyage inoubliable. Vous commencerez par un trek de 7 jours sur la route Machame, réputée pour ses paysages magnifiques et sa bonne acclimatation. Elle est appréciée des grimpeurs pour de bonnes raisons : vous traverserez une forêt tropicale luxuriante, de hautes landes et un terrain alpin accidenté avant d'atteindre le sommet de la plus haute montagne d'Afrique — Uhuru Peak à 5 895 mètres.",
  ],
  mapImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/machame.png', alt: 'Carte du 10 Jours Kilimandjaro et Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '10 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '10 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '10 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '10 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '10 Jours Kilimandjaro et Safari'},
  ],
  itinerary: [
    comboArrivalFr(),
    {
      day: 1,
      label: 'De Machame Gate à Machame Camp',
      meta: ['Machame Gate (1 800 m/5 900 pieds) → Machame Camp (3 000 m/9 800 pieds)', 'Dénivelé positif : 1 200 m / 3 900 pieds', 'Durée : 6-7 heures'],
      body: [bodyMachameGateToCampFr[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-.jpg', alt: 'De Machame Gate à Machame Camp'},
      overnightStay: 'Machame Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-Camp.jpg', alt: 'Machame Camp'},
    },
    {
      day: 2,
      label: 'De Machame Camp à Shira Camp',
      meta: ['Machame Camp (3 000 m/9 800 pieds) → Shira Camp (3 840 m/12 600 pieds)', 'Dénivelé positif : 840 m / 2 800 pieds', 'Durée : 5-6 heures'],
      body: [bodyMachameCampToShiraFr[0]],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'De Machame Camp à Shira Camp'},
      overnightStay: 'Shira Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira Camp'},
    },
    {
      day: 3,
      label: 'De Shira Camp à Barranco Camp via Lava Tower',
      meta: [
        'Shira Camp (3 840 m/12 600 pieds) → Lava Tower (4 550 m/14 900 pieds) → Barranco Camp (3 850 m/12 650 pieds)',
        'Dénivelé positif : 710 m / 2 300 pieds',
        'Dénivelé négatif : 700 m / 2 250 pieds',
        'Durée : 6-7 heures',
      ],
      body: [bodyShiraToBarrancoViaLavaTowerFr[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lava-Tower.jpg', alt: 'De Shira Camp à Barranco Camp via Lava Tower'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 4,
      label: 'De Barranco Camp à Karanga Camp via la Barranco Wall',
      meta: [
        'Barranco Camp (3 850 m/12 600 pieds) → Barranco Wall (4 200 m/13 800 pieds) → Karanga Camp (3 950 m/13 000 pieds)',
        'Dénivelé positif : 350 m / 1 150 pieds',
        'Dénivelé négatif : 250 m / 820 pieds',
        'Durée : 3-4 heures',
      ],
      body: [bodyBarrancoWallToKarangaFr[0]],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'De Barranco Camp à Karanga Camp via la Barranco Wall'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 5,
      label: 'De Karanga Camp à Barafu Camp',
      meta: ['Karanga Camp (3 950 m/13 000 pieds) → Barafu Camp (4 600 m/15 100 pieds)', 'Dénivelé positif : 650 m / 2 150 pieds', 'Durée : 3-4 heures'],
      body: [bodyKarangaToBarafuFr[0]],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'De Karanga Camp à Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Barafu-Camp.webp', alt: 'Barafu Camp'},
    },
    {
      day: 6,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      meta: [
        'Barafu Camp (4 600 m/15 100 pieds) → Uhuru Peak (5 895 m/19 300 pieds) → Mweka Camp (3 110 m/10 200 pieds)',
        'Dénivelé positif : 1 295 m / 4 200 pieds',
        'Dénivelé négatif : 2 785 m / 9 100 pieds',
        'Ascension du sommet : 6-8 heures',
        'Descente : 6 heures',
      ],
      body: [bodySummitToMwekaFr[0]],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Uhuru-Peak.webp', alt: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Mweka-Camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 7,
      label: 'De Mweka Camp à Mweka Gate',
      meta: ['Mweka Camp (3 110 m/10 200 pieds) → Mweka Gate (1 830 m/6 000 pieds)', 'Dénivelé négatif : 1 280 m / 4 220 pieds', 'Durée : 2-3 heures'],
      body: [bodyMwekaToGateFr[0]],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Panneau de Mweka Gate au parc national du Kilimandjaro'},
      overnightStay: 'Planet Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/planet-lodge1.jpg', alt: 'Planet Lodge'},
    },
    {
      day: 8,
      label: 'Arusha – Parc national de Tarangire',
      meta: ["Temps de trajet : environ 2,5 heures depuis Arusha", "Point fort : troupeaux d'éléphants et baobabs anciens"],
      body: [
        "Partez d'Arusha après le petit-déjeuner et dirigez-vous directement vers le parc national de Tarangire, réputé pour ses paysages spectaculaires parsemés de baobabs et ses importantes populations d'éléphants. Le parc abrite des lions, des girafes, des zèbres, des gnous et plus de 500 espèces d'oiseaux. Après une journée complète de safari-vision, vous rejoindrez votre lodge près du lac Manyara ou de Karatu pour le dîner et la nuit.",
      ],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/h.jpg', alt: 'Arusha – Parc national de Tarangire'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/marera-2.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 9,
      label: 'Safari-vision au cratère du Ngorongoro',
      meta: ["Temps de trajet : 45 minutes à 1 heure jusqu'à l'entrée du cratère", 'Point fort : observation des Big Five dans une caldeira volcanique'],
      body: [
        'Après un petit-déjeuner matinal, descendez dans le magnifique cratère du Ngorongoro, site classé au patrimoine mondial de l\'UNESCO, souvent surnommé la « huitième merveille du monde ». Cette immense caldeira est un refuge pour la faune — notamment les éléphants, lions, buffles, hippopotames, flamants roses et le rhinocéros noir en danger. Profitez d\'un pique-nique au fond du cratère avant de retourner à votre lodge.',
      ],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Ngorongoro-Crater.jpg', alt: 'Safari-vision au cratère du Ngorongoro'},
      overnightStay: 'Ngorongoro Rhino Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Rhino-Lodge1.jpeg', alt: 'Ngorongoro Rhino Lodge'},
    },
    {
      day: 10,
      label: 'Parc national du lac Manyara – Arusha',
      meta: ['Temps de trajet : environ 1,5 heure de retour vers Arusha', 'Point fort : lions grimpeurs d\'arbres et flamants roses'],
      body: [
        "Commencez votre matinée par un trajet vers le parc national du lac Manyara, célèbre pour sa luxuriante forêt d'eaux souterraines, son lac couvert de flamants roses et ses lions grimpeurs d'arbres. Ce parc compact mais varié est parfait pour un dernier safari-vision détendu. Après le déjeuner, retournez à Arusha où votre safari se termine. En option, nous pouvons vous transférer à l'aéroport pour votre vol de correspondance.",
      ],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lake-Manyara-National-Park.jpg', alt: 'Parc national du lac Manyara – Arusha'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: comboFaqHeadingFr,
  faqIntro: comboFaqIntroFr,
  faqs: comboFaqsFr,
  hubSummary:
    "Une aventure bien équilibrée qui combine une ascension du Kilimandjaro de 7 jours (comme la route Machame) avec un safari faunique de 3 jours — idéal pour découvrir le meilleur de la montagne et de la savane.",
  hubImage: {src: '/images/combo/shared/7-days-machame-route.webp', alt: '10 Jours Kilimandjaro et Safari'},
}

const combo11Fr: TripFr = {
  slug: '11-days-kilimanjaro-safari',
  category: 'combo',
  name: '11 Jours Kilimandjaro et Safari',
  durationDays: 11,
  seoTitle: '11 Jours Kilimandjaro et Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait combiné 11 Jours Kilimandjaro et Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Tarangire, Cratère du Ngorongoro, Parc national du lac Manyara',
  priceDisclaimer: comboPriceDisclaimerFr,
  overviewBody: [
    "Ce voyage de 11 jours associe deux des plus grands trésors de la Tanzanie — le majestueux sommet du Mont Kilimandjaro et la beauté brute et inoubliable de ses parcs nationaux. Avec 8 jours sur la route Lemosho, l'un des itinéraires de trek les plus pittoresques et les plus réussis du Kilimandjaro, suivis de 3 jours de safari classique, cet itinéraire offre une combinaison unique de défi, de découverte et de connexion profonde avec la nature.",
  ],
  mapImage: {src: '/images/combo/11-days-kilimanjaro-safari/lemosho.png', alt: 'Carte du 11 Jours Kilimandjaro et Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '11 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '11 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '11 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '11 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '11 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '11 Jours Kilimandjaro et Safari'},
  ],
  itinerary: [
    comboArrivalFr(),
    {
      day: 1,
      label: 'De Lemosho Gate à Mti Mkubwa',
      meta: ['Altitude : 2 100 m → 2 650 m', 'Dénivelé positif : 550 m (1 805 pieds)', 'Durée : 3-4 heures'],
      body: [
        "Après le petit-déjeuner, vous roulerez d'Arusha jusqu'à Londorossi Gate pour l'enregistrement. Puis vous poursuivrez jusqu'à Lemosho Gate, où la randonnée débute à travers une forêt tropicale luxuriante. Cette zone est riche en faune, avec des colobes noir et blanc et des oiseaux forestiers. Vous marcherez sous une canopée d'arbres avant d'arriver à Mti Mkubwa (Big Tree) Camp pour la nuit.",
      ],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'De Lemosho Gate à Mti Mkubwa'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/mti-mkubwa-1.webp', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp à Shira 1 Camp',
      meta: ['Mti Mkubwa Camp (2 650 m) – Shira 1 Camp (3 610 m)', 'Dénivelé positif : 960 m (3 150 pieds)', 'Durée : 6-7 heures'],
      body: [
        "Le sentier d'aujourd'hui grimpe progressivement hors de la forêt tropicale vers la zone de bruyère et de landes. À mesure que vous montez, les arbres s'éclaircissent et le paysage s'ouvre, offrant des vues magnifiques sur la crête du Shira et le pic Kibo. Après une randonnée pittoresque à travers des collines ondulantes et des formations rocheuses volcaniques, vous atteindrez Shira 1 Camp sur le plateau du Shira.",
      ],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'De Mti Mkubwa Camp à Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'De Shira 1 Camp à Shira 2 Camp',
      meta: ['Shira 1 Camp (3 610 m) – Shira 2 Camp (3 850 m)', 'Dénivelé positif : 240 m (787 pieds)', 'Durée : 3-4 heures'],
      body: [bodyShiraToBarrancoViaLavaTowerFr[0]],
      image: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'De Shira 1 Camp à Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'De Shira 2 Camp à Lava Tower puis à Barranco Camp',
      meta: ['Shira 2 Camp (3 850 m) → Lava Tower (4 630 m) → Barranco Camp', 'Dénivelé positif : 780 m', 'Dénivelé négatif : 654 m', 'Durée : 6-7 heures'],
      body: [
        "Montez régulièrement jusqu'à l'impressionnante Lava Tower, où vous vous arrêterez pour déjeuner. Descendez ensuite dans la magnifique vallée de Barranco pour la nuit. C'est l'une des journées d'acclimatation les plus importantes de l'itinéraire.",
      ],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'De Shira 2 Camp à Lava Tower puis à Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'De Barranco Camp à Karanga Camp',
      meta: ['Barranco Camp (3 976 m) → Karanga Camp (4 035 m)', 'Dénivelé positif : 59 m / 194 pieds', 'Durée : 4-5 heures'],
      body: [
        'Gravissez la célèbre Barranco Wall — exigeante mais non technique. Continuez à travers un terrain alpin jusqu\'à Karanga Camp. Cette journée plus courte laisse à votre corps plus de temps pour s\'acclimater avant la nuit du sommet.',
      ],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'De Barranco Camp à Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'De Karanga Camp à Barafu Camp',
      meta: ['Karanga Camp (4 035 m / 13 238 pieds) → Barafu Camp (4 703 m / 15 430 pieds)', 'Dénivelé positif : 668 m / 2 192 pieds', 'Durée : 3-4 heures'],
      body: [
        'Un trek court mais raide à travers un désert alpin de haute altitude jusqu\'à votre dernier camp avant la nuit du sommet. Reposez-vous, hydratez-vous et préparez-vous mentalement au défi qui vous attend.',
      ],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'De Karanga Camp à Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/barafu-camp1.jpg', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Barafu Camp → Uhuru Peak → Mweka Camp',
      meta: [
        'Barafu Camp (4 703 m / 15 430 pieds) → Uhuru Peak (5 895 m / 19 341 pieds) → Mweka Camp (3 720 m / 12 205 pieds)',
        'Dénivelé positif : 1 192 m / 3 910 pieds',
        'Dénivelé négatif : 2 175 m / 7 136 pieds',
        'Durée : 12-14 heures',
      ],
      body: [
        "Entamez votre poussée vers le sommet à minuit. Atteignez Stella Point au lever du soleil, puis continuez vers Uhuru Peak — le point culminant de l'Afrique. Après avoir célébré au sommet, descendez jusqu'à Mweka Camp.",
      ],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Barafu Camp → Uhuru Peak → Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp → Mweka Gate',
      meta: ['Mweka Camp (3 720 m / 12 205 pieds) → Mweka Gate (1 640 m / 5 380 pieds)', 'Dénivelé négatif : 2 080 m / 6 824 pieds', 'Durée : 3-4 heures'],
      body: [
        "Traversez une forêt tropicale luxuriante jusqu'à l'entrée du parc, où vous recevrez votre certificat du Kilimandjaro. Votre chauffeur vous transférera à votre hôtel pour une douche chaude et un repos bien mérité.",
      ],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp → Mweka Gate'},
      overnightStay: 'Lodge à Arusha',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/Kaliwa-Lodge.jpg', alt: 'Lodge à Arusha'},
    },
    {
      day: 9,
      label: 'Parc national de Tarangire',
      meta: ["Temps de trajet : environ 2,5 heures depuis Arusha", "Point fort : troupeaux d'éléphants et baobabs anciens"],
      body: [
        "Partez d'Arusha après le petit-déjeuner et dirigez-vous directement vers le parc national de Tarangire, réputé pour ses paysages spectaculaires parsemés de baobabs et ses importantes populations d'éléphants. Le parc abrite des lions, des girafes, des zèbres, des gnous et plus de 500 espèces d'oiseaux. Après une journée complète de safari-vision, vous rejoindrez votre lodge près du lac Manyara ou de Karatu pour le dîner et la nuit.",
      ],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/Gallery-img04-1.webp', alt: 'Parc national de Tarangire'},
      overnightStay: 'Lodge à Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Lodge à Karatu'},
    },
    {
      day: 10,
      label: 'Cratère du Ngorongoro',
      meta: ["Temps de trajet : 45 minutes à 1 heure jusqu'à l'entrée du cratère", 'Point fort : observation des Big Five dans une caldeira volcanique'],
      body: [
        'Après un petit-déjeuner matinal, descendez dans le magnifique cratère du Ngorongoro, site classé au patrimoine mondial de l\'UNESCO, souvent surnommé la « huitième merveille du monde ». Cette immense caldeira est un refuge pour la faune — notamment les éléphants, lions, buffles, hippopotames, flamants roses et le rhinocéros noir en danger. Profitez d\'un pique-nique au fond du cratère avant de retourner à votre lodge.',
      ],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Cratère du Ngorongoro'},
      overnightStay: 'Même lodge à Karatu',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Même lodge à Karatu'},
    },
    {
      day: 11,
      label: 'Parc national du lac Manyara – Arusha',
      meta: ['Temps de trajet : environ 1,5 heure de retour vers Arusha', 'Point fort : lions grimpeurs d\'arbres et flamants roses'],
      body: [
        "Commencez votre matinée par un trajet vers le parc national du lac Manyara, célèbre pour sa luxuriante forêt d'eaux souterraines, son lac couvert de flamants roses et ses lions grimpeurs d'arbres. Ce parc compact mais varié est parfait pour un dernier safari-vision détendu. Après le déjeuner, retournez à Arusha où votre safari se termine. Optionnellement, nous pouvons vous transférer à l'aéroport pour votre vol de correspondance.",
      ],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/zebra.jpg', alt: 'Parc national du lac Manyara – Arusha'},
    },
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: comboFaqHeadingFr,
  faqIntro: comboFaqIntroFr,
  faqs: comboFaqsFr,
  hubSummary:
    'Cette option vous laisse le temps de vous acclimater correctement pendant une ascension de 7 jours, puis de vous détendre avec un safari de 4 jours à travers le Serengeti, le Ngorongoro et d\'autres parcs incontournables.',
  hubImage: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: '11 Jours Kilimandjaro et Safari'},
}

const combo12Fr: TripFr = {
  slug: '12-days-kilimanjaro-safari',
  category: 'combo',
  name: '12 Jours Kilimandjaro et Safari',
  durationDays: 12,
  seoTitle: '12 Jours Kilimandjaro et Safari | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinéraire jour par jour réel, tarifs et prestations incluses pour le forfait combiné 12 Jours Kilimandjaro et Safari.',
  stopsLine:
    'Londorossi Gate, Mti Mkubwa Camp, Shira 1 Camp, Shira 2 Camp, Lava Tower, Barranco Camp, Karanga Camp, Barafu Camp, Uhuru Peak, Mweka Camp, Mweka Gate, Parc national de Tarangire, Parc national du Serengeti, Cratère du Ngorongoro',
  priceDisclaimer: comboPriceDisclaimerFr,
  overviewBody: [
    "Cette aventure de 12 jours associe la pittoresque route Lemosho vers le Mont Kilimandjaro à un safari complet du circuit nord à travers Tarangire, le Serengeti et le cratère du Ngorongoro. Débutant sur les versants ouest isolés de la montagne, l'ascension offre un départ plus tranquille, des écosystèmes variés et une excellente acclimatation sur huit jours sur la montagne.",
    "Après votre tentative de sommet, enchaînez directement avec quatre jours de safari-vision — traquant les éléphants et les baobabs à Tarangire, passant une journée complète à suivre la migration des gnous et les grands félins à travers les plaines infinies du Serengeti, puis descendant dans le cratère du Ngorongoro, souvent surnommé la « huitième merveille du monde », avant de retourner à Arusha.",
  ],
  mapImage: {src: '/images/combo/12-days-kilimanjaro-safari/lemosho4.png', alt: 'Carte du 12 Jours Kilimandjaro et Safari'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '12 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '12 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '12 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/simba-camp-2.jpg', alt: '12 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro-climb.webp', alt: '12 Jours Kilimandjaro et Safari'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Jours Kilimandjaro et Safari'},
  ],
  itinerary: [
    comboArrivalFr(),
    {
      day: 1,
      label: 'De Londorossi Gate à Mti Mkubwa Camp',
      meta: ['Lemosho Gate (2 100 m / 6 890 pieds) → Mti Mkubwa (2 650 m / 8 694 pieds)', 'Dénivelé positif : 550 m / 1 804 pieds', 'Durée : 3-4 heures'],
      body: [
        "Commencez votre ascension du Kilimandjaro par un trajet pittoresque jusqu'à Londorossi Gate, où les permis et l'enregistrement sont traités. Depuis l'entrée, un court trajet à travers la forêt montagnarde vous mène au point de départ à Lemosho. Le trek jusqu'à Mti Mkubwa (Big Tree Camp) vous conduit à travers une forêt tropicale luxuriante, abritant des cercopithèques bleus et une grande variété d'oiseaux.",
      ],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'De Londorossi Gate à Mti Mkubwa Camp'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/mti-mkubwa-camp-scaled.jpg', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'De Mti Mkubwa Camp à Shira 1 Camp',
      meta: ['Mti Mkubwa (2 650 m / 8 694 pieds) → Shira 1 Camp (3 610 m / 11 843 pieds)', 'Dénivelé positif : 960 m / 3 150 pieds', 'Durée : 5-6 heures'],
      body: [
        "Aujourd'hui, vous émergez de la forêt vers la zone de bruyère et de landes, montant régulièrement vers la crête du Shira et redescendant légèrement pour camper sur le plateau du Shira, avec vue sur les versants supérieurs du Kilimandjaro.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro_climbing-1.jpg', alt: 'De Mti Mkubwa Camp à Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/second-camp.webp', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'De Shira 1 Camp à Shira 2 Camp',
      meta: ['Shira 1 (3 610 m / 11 843 pieds) → Shira 2 Camp (3 850 m / 12 631 pieds)', 'Dénivelé positif : 240 m / 787 pieds', 'Durée : 3-4 heures'],
      body: [
        "Une journée plus courte pour favoriser l'acclimatation, traversant le pittoresque plateau du Shira. Vous profiterez de vastes vues et d'un rythme détendu jusqu'à Shira 2 Camp.",
      ],
      image: {src: '/images/combo/shared/shira-camp.webp', alt: 'De Shira 1 Camp à Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: 'De Shira 2 Camp à Barranco Camp (via Lava Tower)',
      meta: [
        'Shira 2 (3 850 m / 12 631 pieds) → Lava Tower (4 630 m / 15 190 pieds) → Barranco Camp (3 976 m / 13 044 pieds)',
        'Dénivelé positif : 780 m / 2 559 pieds',
        'Dénivelé négatif : 654 m / 2 145 pieds',
        'Durée : 6-7 heures',
      ],
      body: [
        "Monter haut, dormir bas — cette journée d'acclimatation essentielle vous amène à Lava Tower pour le déjeuner avant de descendre dans la verdoyante vallée de Barranco. Une journée spectaculaire aux paysages en constante évolution.",
      ],
      image: {src: '/images/combo/shared/barranco.jpg', alt: 'De Shira 2 Camp à Barranco Camp (via Lava Tower)'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'De Barranco Camp à Karanga Camp',
      meta: ['Barranco (3 976 m / 13 044 pieds) → Karanga Camp (3 995 m / 13 107 pieds)', 'Dénivelé positif : 240 m / 787 pieds', 'Dénivelé négatif : 220 m / 722 pieds', 'Durée : 4-5 heures'],
      body: [
        'Affrontez l\'impressionnante Barranco Wall, un temps fort du trek, puis traversez crêtes et vallées avant d\'atteindre Karanga Camp. Une autre journée importante pour l\'acclimatation.',
      ],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'De Barranco Camp à Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'De Karanga Camp à Barafu Camp',
      meta: ['Karanga (3 995 m / 13 107 pieds) → Barafu Camp (4 673 m / 15 331 pieds)', 'Dénivelé positif : 678 m / 2 224 pieds', 'Durée : 3-4 heures'],
      body: [
        "Vous monterez à travers le désert alpin pour atteindre Barafu, votre camp de base pour la tentative de sommet. Reposez-vous, hydratez-vous et préparez-vous mentalement pour l'ascension de minuit vers le sommet de l'Afrique.",
      ],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'De Karanga Camp à Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/barafu-camp-1.webp', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp',
      meta: [
        'Barafu (4 673 m / 15 331 pieds) → Uhuru Peak (5 895 m / 19 341 pieds) → Mweka Camp (3 110 m / 10 204 pieds)',
        'Dénivelé positif : 1 222 m / 4 010 pieds',
        'Dénivelé négatif : 2 785 m / 9 137 pieds',
        'Durée : 12-14 heures',
      ],
      body: [
        "Jour du sommet ! Partez avant minuit pour atteindre Stella Point au lever du soleil et poussez jusqu'à Uhuru Peak. Après avoir célébré au sommet, redescendez à Barafu pour une courte pause, puis continuez vers Mweka Camp pour un repos bien mérité.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/solo-climb.jpeg', alt: 'De Barafu Camp à Uhuru Peak puis à Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'De Mweka Camp à Mweka Gate',
      meta: ['Mweka Camp (3 110 m / 10 204 pieds) → Mweka Gate (1 640 m / 5 380 pieds)', 'Dénivelé négatif : 1 470 m / 4 823 pieds', 'Durée : 3-4 heures'],
      body: [
        "Profitez de votre dernière randonnée à travers la forêt tropicale. À votre arrivée à l'entrée du parc, recevez votre certificat de sommet et retournez à votre hôtel avec des souvenirs pour toute une vie.",
      ],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'De Mweka Camp à Mweka Gate'},
      overnightStay: 'Hôtel à Arusha',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Hôtel à Arusha'},
    },
    {
      day: 9,
      label: 'Arusha – Parc national de Tarangire',
      meta: ['Environ 2,5 heures de route depuis Arusha', 'Point fort : troupeaux d\'éléphants, baobabs et ambiance hors des sentiers battus'],
      body: [
        "Après le petit-déjeuner à Arusha, votre guide de safari Asili vous retrouvera pour le trajet vers le parc national de Tarangire, l'un des joyaux les plus sous-estimés de la Tanzanie. Souvent délaissé au profit du Serengeti, Tarangire surprend les visiteurs par sa beauté sauvage, ses immenses baobabs et sa remarquable densité d'éléphants. Pendant la saison sèche, la rivière Tarangire attire d'innombrables animaux, créant des scènes fauniques palpitantes.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/elephant-tara.jpg', alt: 'Arusha – Parc national de Tarangire'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 10,
      label: 'Tarangire – Parc national du Serengeti',
      meta: ['Environ 4-5 heures de route via les hauts plateaux du Ngorongoro', 'Point fort : plaines du Serengeti et paysages riches en prédateurs'],
      body: [
        "Après le petit-déjeuner, votre voyage se poursuit à travers la zone de conservation du Ngorongoro en direction du Serengeti. En chemin, profitez de vues panoramiques et de villages maasaï avant d'entrer dans le parc par Naabi Hill Gate. Une fois à l'intérieur, vous commencerez votre safari-vision au Serengeti, avec l'occasion d'apercevoir les grands félins, des troupeaux de gnous, des girafes et bien plus encore.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/wildebeest-migration-serengeti.jpg', alt: 'Tarangire – Parc national du Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 11,
      label: 'Journée complète de safari-vision au Serengeti',
      meta: ["Itinéraire flexible selon l'activité de la faune", 'Point fort : une journée complète d\'observation de la grande faune et de traque des prédateurs'],
      body: [
        "Levez-vous tôt pour une journée complète d'observation de la faune dans le parc national du Serengeti, réputé pour ses plaines ouvertes et ses interactions spectaculaires entre prédateurs et proies. Selon la saison, votre guide vous orientera vers les zones les plus actives — que ce soit à Seronera, Ndutu, ou plus au nord. Observez des lions traquant des buffles, des léopards se reposant dans les arbres, et des éléphants se baignant dans les rivières saisonnières.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/lion-serengeti1.jpg', alt: 'Journée complète de safari-vision au Serengeti'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 12,
      label: 'Serengeti – Cratère du Ngorongoro – Arusha',
      meta: ["Trajet d'une journée complète avec descente dans le cratère (temps de trajet total : 7-8 heures)", 'Point fort : observation des Big Five et du rhinocéros noir à l\'intérieur du cratère'],
      body: [
        "Après un petit-déjeuner matinal, vous quitterez le Serengeti pour rejoindre le cratère du Ngorongoro, où vous descendrez dans la plus grande caldeira volcanique intacte du monde. Passez la journée à explorer cet amphithéâtre naturel peuplé de lions, d'éléphants, de flamants roses, de chacals et même de rhinocéros. Après un pique-nique près d'un point d'eau à hippopotames, remontez et entamez votre retour vers Arusha, où vous arriverez en soirée.",
      ],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/rhino.jpg', alt: 'Serengeti – Cratère du Ngorongoro – Arusha'},
    },
    departureFr,
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: comboFaqHeadingFr,
  faqIntro: comboFaqIntroFr,
  faqs: [
    {
      question: 'Qu\'est-ce qui est inclus dans le forfait Kilimandjaro et safari de 12 jours ?',
      answer:
        "Votre forfait comprend les transferts aéroport, l'hébergement en hôtel à Arusha, un trek du Kilimandjaro entièrement guidé (avec frais de parc, porteurs, tentes, repas et guides de montagne certifiés), ainsi qu'un safari faunique privé de 4 jours avec frais d'entrée aux parcs, hébergement en lodge, repas, un véhicule de safari 4×4 et un guide professionnel. Les vols internationaux, les pourboires et les dépenses personnelles ne sont pas inclus.",
    },
    {
      question: '12 jours suffisent-ils pour profiter à la fois du Kilimandjaro et d\'un safari ?',
      answer:
        "Oui, 12 jours est idéal. Vous aurez 7 ou 8 jours pour gravir le Kilimandjaro en toute sécurité (via des itinéraires comme Lemosho ou Machame), suivis d'un safari de 4 jours à travers les parcs les plus emblématiques de la Tanzanie, comme le Serengeti, le cratère du Ngorongoro et Tarangire. Vous découvrirez le meilleur de la montagne et de la faune en une seule aventure.",
    },
    {
      question: 'Quelle est la meilleure période pour faire ce voyage de 12 jours ?',
      answer:
        "Les meilleurs mois sont de janvier à début mars et de juin à octobre, lorsque les conditions sont favorables à la fois pour le trek du Kilimandjaro et l'observation de la faune en safari. Ce sont les saisons sèches de la Tanzanie, offrant des ciels plus dégagés et d'excellentes observations de la faune.",
    },
    {
      question: "L'ascension du Kilimandjaro est-elle physiquement exigeante ?",
      answer:
        "Gravir le Kilimandjaro est un trek non technique, mais il est physiquement exigeant en raison de la haute altitude. Une bonne condition physique, une détermination mentale et une acclimatation adéquate (que nous assurons avec des itinéraires plus longs comme Lemosho) sont essentielles pour réussir le sommet. Aucune expérience d'escalade préalable n'est requise.",
    },
    {
      question: "Puis-je louer de l'équipement pour le Kilimandjaro si je ne l'ai pas tout ?",
      answer:
        "Oui. Asili Climbing Kilimanjaro propose de la location d'équipement de haute qualité tel que sacs de couchage, doudounes, bâtons de marche, lampes frontales et bien plus. Une liste complète d'équipement recommandé vous sera fournie, et vous pouvez pré-réserver tout article de location dont vous avez besoin.",
    },
    {
      question: "Quel type d'hébergement aurai-je pendant le safari ?",
      answer:
        "Nous utilisons des lodges et camps de tentes soigneusement sélectionnés, propres, confortables et situés près des parcs pour un accès maximal à la faune. Qu'ils soient milieu de gamme ou de luxe, tous offrent des chambres avec salle de bain privée, une bonne cuisine et une hospitalité chaleureuse.",
    },
    {
      question: "Serai-je dans un groupe ou s'agit-il d'un circuit privé ?",
      answer:
        "La plupart de nos combinés Kilimandjaro et safari sont des circuits privés, conçus spécifiquement pour vous ou votre groupe. Cela permet plus de flexibilité dans le rythme, une attention personnalisée et une expérience sur mesure, tant sur la montagne qu'en safari.",
    },
    {
      question: 'Le mal aigu des montagnes est-il fréquent, et comment le gérez-vous ?',
      answer:
        "Le mal aigu des montagnes peut affecter tout le monde, quel que soit le niveau de forme physique. Nous surveillons votre santé quotidiennement sur la montagne à l'aide d'oxymètres de pouls et de guides expérimentés formés aux premiers secours en haute altitude. Des itinéraires plus longs comme la route Lemosho en 8 jours améliorent l'acclimatation et la réussite au sommet. Dans les cas graves, des protocoles d'évacuation d'urgence sont en place.",
    },
    {
      question: "Quel type de nourriture est servi pendant l'ascension et le safari ?",
      answer:
        "Sur le Kilimandjaro, nos cuisiniers de montagne préparent des repas chauds et nutritifs chaque jour — attendez-vous à des soupes, du riz, des pâtes, des légumes, des plats de viande et des fruits. Les régimes végétariens et particuliers sont pris en compte. En safari, les lodges proposent des repas buffet ou à la carte avec des options africaines et internationales.",
    },
    {
      question: "Ai-je besoin d'une assurance voyage ?",
      answer:
        "Oui, une assurance voyage complète est obligatoire. Votre police doit couvrir les urgences médicales, l'évacuation (y compris depuis la haute altitude), les annulations de voyage et les retards. Nous pouvons vous recommander des assureurs réputés si vous n'êtes pas sûr.",
    },
    {
      question: 'Comment me préparer physiquement pour ce voyage ?',
      answer:
        "Commencez un plan d'entraînement 8 à 12 semaines avant le départ, comprenant du cardio, de la randonnée avec un sac à dos, et un renforcement musculaire. Des randonnées le week-end et de longues marches avec du dénivelé aideront à préparer vos jambes et vos poumons aux exigences du Kilimandjaro.",
    },
    {
      question: 'Comment réserver cette expérience de 12 jours avec Asili Climbing Kilimanjaro ?',
      answer:
        "Réserver est simple ! Contactez-nous simplement via notre site web ou WhatsApp, et l'un de nos spécialistes vous aidera à personnaliser votre voyage Kilimandjaro et safari. Un acompte de 20 à 30 % sécurise votre place, et nous vous accompagnerons à chaque étape jusqu'à votre arrivée en Tanzanie.",
    },
  ],
  hubSummary:
    "Une expérience complète pour les amoureux de la nature. Gravissez le plus haut sommet d'Afrique en 8 jours (comme la route Lemosho) et enchaînez avec 4 jours inoubliables à traquer la faune en safari.",
  hubImage: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '12 Jours Kilimandjaro et Safari'},
}

// ---------------------------------------------------------------------------
// 2 safaris (days 1-7 are identical across both safari itineraries)
// ---------------------------------------------------------------------------

const safariSharedDays1to7Fr: SafariDayFr[] = [
  {
    day: 1,
    label: 'Arusha - Parc national de Tarangire',
    image: {src: '/images/safari/shared/elephant-tara.jpg', alt: 'Arusha - Parc national de Tarangire'},
    body: [
      [
        {text: 'Le matin après le petit-déjeuner :', bold: true},
        {text: " Notre guide de safari viendra vous chercher à votre hôtel dans la ville d'Arusha. Vous parcourrez ensuite environ 120 km, soit presque 2 heures de route, en direction du parc national de Tarangire."},
      ],
      [
        {text: 'Parc national de Tarangire :', bold: true},
        {text: " Le parc national de Tarangire est réputé pour ses grands troupeaux d'éléphants errant librement près des rives de la rivière Tarangire, qui représentent véritablement un safari familial en Tanzanie, aux côtés de nombreuses autres créatures. Nous découvrirons les marécages saisonniers (zones humides), la savane et la rivière Tarangire, qui jouent un rôle essentiel dans l'écosystème du parc national de Tarangire et attirent les animaux pendant la saison sèche."},
      ],
      [
        {text: 'Observation de la faune :', bold: true},
        {text: " Nous observerons autant d'animaux que possible, notamment des lions, des zèbres, des mangoustes, des oryctéropes, des gnous, des buffles, des éléphants et des girafes (pour n'en citer que quelques-uns). Nous pourrions également apercevoir brièvement des lions et des léopards."},
      ],
      [
        {text: 'Pique-nique et safari-vision :', bold: true},
        {text: ' Notre guide de safari professionnel et expérimenté choisira un endroit adapté pour un délicieux déjeuner sur le site de pique-nique désigné. Ensuite, vous reprendrez le safari-vision jusqu\'en fin de soirée.'},
      ],
      [
        {text: 'Transfert en soirée :', bold: true},
        {text: ' En soirée, vous serez transféré vers l\'un de nos hôtels partenaires soigneusement sélectionnés pour le dîner et la nuit.'},
      ],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 2,
    label: 'Parc national du Serengeti',
    image: {src: '/images/safari/shared/lake-manyara.webp', alt: 'Parc national du Serengeti'},
    body: [
      [
        {
          text: "Le matin après le petit-déjeuner, vous débuterez votre safari vers les plaines infinies du parc national du Serengeti, où vous aurez un aperçu du cratère du Ngorongoro depuis le point de vue du Ngorongoro avant de poursuivre vers le parc national du Serengeti (que vous atteindrez dans l'après-midi). Notre guide de safari professionnel et expérimenté choisira un bon moment pour un délicieux déjeuner accompagné d'un peu de vin pétillant au milieu de paysages magnifiques.",
        },
      ],
      [
        {
          text: 'Le parc national du Serengeti est célèbre pour sa faune résidente variée, y compris les « Big Five », bien connus car ce sont les cinq trophées animaliers les plus emblématiques recherchés par les chasseurs. Le Serengeti abriterait la plus grande population de lions d\'Afrique (environ 2 950), en raison de la diversité des proies qui y vivent.',
        },
      ],
      [{text: 'Le léopard, insaisissable, est fréquemment observé dans la région de Seronera, mais on le trouve dans tout le parc. Sa population est estimée à environ 1 000 individus.'}],
      [{text: 'Activité de safari en option :', bold: true}, {text: ' Safari en montgolfière au Serengeti (600 $ US par personne)'}],
      [{text: 'Après le safari-vision, vous rejoindrez votre hébergement pour le dîner et la nuit.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 3,
    label: 'Parc national du Serengeti',
    image: {src: '/images/safari/shared/honeymoon1.jpg', alt: 'Parc national du Serengeti'},
    body: [
      [
        {
          text: "Le matin après le petit-déjeuner, vous débuterez votre safari vers les plaines infinies du parc national du Serengeti, où vous aurez un aperçu du cratère du Ngorongoro depuis le point de vue du Ngorongoro avant de poursuivre vers le parc national du Serengeti (que vous atteindrez dans l'après-midi). Notre guide de safari professionnel et expérimenté choisira un bon moment pour un délicieux déjeuner accompagné d'un peu de vin pétillant au milieu de paysages magnifiques.",
        },
      ],
      [
        {
          text: 'Le parc national du Serengeti est célèbre pour sa faune résidente variée, y compris les « Big Five », bien connus car ce sont les cinq trophées animaliers les plus emblématiques recherchés par les chasseurs. Le Serengeti abriterait la plus grande population de lions d\'Afrique (environ 2 950), en raison de la diversité des proies qui y vivent.',
        },
      ],
      [{text: 'Le léopard, insaisissable, est fréquemment observé dans la région de Seronera, mais on le trouve dans tout le parc. Sa population est estimée à environ 1 000 individus.'}],
      [{text: 'Activité de safari en option :', bold: true}, {text: ' Safari en montgolfière au Serengeti (600 $ US par personne)'}],
      [{text: 'Après le safari-vision, vous rejoindrez votre hébergement pour le dîner et la nuit.'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 4,
    label: 'Parc national du Serengeti / Cratère du Ngorongoro',
    image: {src: '/images/safari/shared/h.jpg', alt: 'Parc national du Serengeti / Cratère du Ngorongoro'},
    body: [
      [
        {
          text: 'Le matin après le petit-déjeuner, vous quitterez le camp avec un pique-nique préparé pour le cratère du Ngorongoro. Cette zone est située à l\'ouest de la région d\'Arusha, dans la zone géologique des Crater Highlands en Tanzanie.',
        },
      ],
      [
        {
          text: 'À votre arrivée au bord du cratère, vous aurez un premier aperçu de ce qui vous attend le lendemain sur la prairie ouverte, avec un grand nombre d\'animaux que vous avez vus dans les documentaires de National Geographic. Dans le cratère, vous aurez de nombreuses possibilités d\'observer les « Big Five » (lion, léopard, éléphant, buffle et rhinocéros), selon votre chance.',
        },
      ],
      [
        {
          text: 'Dans l\'après-midi, le déjeuner vous sera servi sur un site de pique-nique spécialement désigné, puis vous partirez pour un safari-vision l\'après-midi jusqu\'en fin de soirée. Le dîner et la nuit se dérouleront au lodge.',
        },
      ],
      [{text: 'Activité de safari en option :', bold: true}],
      [{text: "Visite des gorges d'Olduvai et de son musée (40 $ US par personne)"}],
      [{text: 'Randonnée à pied sur le rebord du cratère du Ngorongoro (30 $ US par personne)'}],
      [{text: "Visite d'un village maasaï (50 $ US par véhicule)"}],
    ],
    overnightStay: 'Ngorongoro Rhino Lodge',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 5,
    label: 'Cratère du Ngorongoro',
    image: {src: '/images/safari/shared/ngorongoro.jpg', alt: 'Cratère du Ngorongoro'},
    body: [
      [
        {
          text: 'Après un petit-déjeuner matinal, descendez dans le magnifique cratère du Ngorongoro, site classé au patrimoine mondial de l\'UNESCO, souvent surnommé la « huitième merveille du monde ». Cette immense caldeira est un refuge pour la faune — notamment les éléphants, lions, buffles, hippopotames, flamants roses et le rhinocéros noir en danger.',
        },
      ],
      [{text: 'Profitez d\'un déjeuner pique-nique au fond du cratère avant de remonter vers votre lodge pour la nuit.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 6,
    label: 'Parc national du lac Manyara',
    image: {src: '/images/safari/shared/manyara.jpg', alt: 'Parc national du lac Manyara'},
    body: [
      [
        {
          text: "Le matin après le petit-déjeuner, vous serez pris en charge à votre lodge et conduit au parc national du lac Manyara (environ 30 minutes). Le parc est un terrain de jeu idéal pour les passionnés de photographie et offre certaines des meilleures observations de faune au monde. Vous pourrez apercevoir de nombreux animaux emblématiques d'Afrique, les célèbres lions grimpeurs d'arbres étant un sujet idéal pour les amateurs de photographie. Ces prédateurs emblématiques se prélassent dans les acacias, comme s'ils attendaient d'être photographiés.",
        },
      ],
      [
        {
          text: "Les ornithologues et passionnés d'oiseaux trouveront également le lac Manyara comme une destination parfaite, avec une grande variété d'espèces d'oiseaux visibles dans le parc. Même les ornithologues chevronnés seront émerveillés par un grand groupe de flamants roses, des rapaces tournoyant dans le ciel, et le rollier à longs brins aux couleurs magnifiques.",
        },
      ],
      [{text: 'Le déjeuner sera servi dans le parc sur le site de pique-nique, et dans l\'après-midi, vous retournerez vers Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    day: 7,
    label: 'Parc national du lac Manyara',
    image: {src: '/images/safari/shared/e7636d2be5e1edef3f8c3756db7fe4d5df583879-1600x1067-1-1.jpg', alt: 'Parc national du lac Manyara'},
    body: [
      [
        {
          text: "Le matin après le petit-déjeuner, vous serez pris en charge à votre lodge et conduit au parc national du lac Manyara (environ 30 minutes). Le parc est un terrain de jeu idéal pour les passionnés de photographie et offre certaines des meilleures observations de faune au monde. Vous pourrez apercevoir de nombreux animaux emblématiques d'Afrique, les célèbres lions grimpeurs d'arbres étant un sujet idéal pour les amateurs de photographie. Ces prédateurs emblématiques se prélassent dans les acacias, comme s'ils attendaient d'être photographiés.",
        },
      ],
      [
        {
          text: "Les ornithologues et passionnés d'oiseaux trouveront également le lac Manyara comme une destination parfaite, avec une grande variété d'espèces d'oiseaux visibles dans le parc. Même les ornithologues chevronnés seront émerveillés par un grand groupe de flamants roses, des rapaces tournoyant dans le ciel, et le rollier à longs brins aux couleurs magnifiques.",
        },
      ],
      [{text: 'Le déjeuner sera servi dans le parc sur le site de pique-nique, et dans l\'après-midi, vous retournerez vers Arusha.'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
  },
]

const safari15Fr: SafariFr = {
  slug: '15-days-tanzania-safari',
  name: '15 Jours Safari en Tanzanie',
  durationDays: 15,
  seoTitle: '15 Jours Safari en Tanzanie | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Itinéraire jour par jour réel, tarifs et prestations incluses pour le safari de 15 jours en Tanzanie.',
  stopsLine: 'Parc national de Tarangire, Parc national du Serengeti, Cratère du Ngorongoro, Parc national du lac Manyara, Zanzibar',
  overviewBody: [
    "Ce safari de 15 jours en Tanzanie associe un safari-vision classique du circuit nord — Tarangire, le Serengeti, le cratère du Ngorongoro et le lac Manyara — à un séjour prolongé sur les plages de Zanzibar, vous laissant le temps pour un véritable safari faunique et une escapade insulaire détendue en un seul voyage.",
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Carte de l\'itinéraire du circuit nord'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Migration des gnous dans le Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Culture maasaï en Tanzanie'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: "Zèbres s'abreuvant à un point d'eau"},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Girafe en safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Lodge de safari de luxe'},
  ],
  itinerary: [
    ...safariSharedDays1to7Fr,
    {
      day: 8,
      label: 'Arrivée à Zanzibar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Arrivée à Zanzibar'},
      body: [
        [
          {
            text: "Envolez-vous d'Arusha vers Zanzibar et transférez-vous à votre hôtel en bord de mer, où le reste de la journée est libre pour vous installer et vous détendre au bord de l'océan Indien.",
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
            text: "Une journée libre à Zanzibar pour vous détendre sur la plage, ou organiser une excursion optionnelle à Stone Town, dans une plantation d'épices, ou de snorkeling via votre hôtel d'accueil.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 10,
      label: 'Extension plage à Zanzibar (jours 10-14)',
      body: [
        [
          {
            text: "Passez cinq jours sans hâte à vous détendre sur les plages de Zanzibar, avec le temps d'explorer les ruelles sinueuses de Stone Town, de faire une visite optionnelle d'une plantation d'épices, ou de faire du snorkeling au large de la côte — à votre propre rythme, en restant au même hôtel en bord de mer.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
    },
    {
      day: 15,
      label: 'Départ',
      body: [
        [
          {
            text: 'Transfert à l\'aéroport pour votre vol retour, marquant la fin de votre safari en Tanzanie et de votre escapade à Zanzibar.',
          },
        ],
      ],
    },
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: comboFaqHeadingFr,
  faqIntro: comboFaqIntroFr,
  faqs: sharedSafariFaqsFr,
}

const safari10HoneymoonFr: SafariFr = {
  slug: '10-days-tanzania-luxury-honeymoon-safaris',
  name: '10 Jours Safari de Luxe Lune de Miel en Tanzanie',
  durationDays: 10,
  seoTitle: '10 Jours Safari de Luxe Lune de Miel en Tanzanie | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Itinéraire jour par jour réel, tarifs et prestations incluses pour le safari de luxe lune de miel de 10 jours en Tanzanie.',
  stopsLine: 'Parc national de Tarangire, Parc national du Serengeti, Cratère du Ngorongoro, Parc national du lac Manyara, Zanzibar',
  overviewBody: [
    "Le safari de luxe Asilia Tanzania de 10 jours est conçu pour vous offrir une expérience unique, des cultures locales variées à la faune et aux paysages impressionnants et à couper le souffle — un safari-vision classique du circuit nord à travers le parc national de Tarangire, le Serengeti, le lac Manyara et le cratère du Ngorongoro, suivi d'un séjour détendu sur les plages de Zanzibar.",
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: 'Carte de l\'itinéraire du circuit nord'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: 'Migration des gnous dans le Serengeti'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: 'Culture maasaï en Tanzanie'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: "Zèbres s'abreuvant à un point d'eau"},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: 'Girafe en safari'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: 'Lodge de safari de luxe'},
  ],
  itinerary: [
    ...safariSharedDays1to7Fr,
    {
      day: 8,
      label: 'Arrivée à Zanzibar',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: 'Arrivée à Zanzibar'},
      body: [
        [
          {
            text: "Envolez-vous d'Arusha vers Zanzibar et transférez-vous à votre hôtel en bord de mer, où le reste de la journée est libre pour vous installer et vous détendre au bord de l'océan Indien.",
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
            text: "Une journée libre à Zanzibar pour vous détendre sur la plage, ou organiser une excursion optionnelle à Stone Town, dans une plantation d'épices, ou de snorkeling via votre hôtel d'accueil.",
          },
        ],
      ],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['Budget', 'Mid-range', 'Luxury'],
    },
    {
      day: 10,
      label: 'Départ',
      body: [
        [{text: "Transfert à l'aéroport pour votre vol retour, marquant la fin de votre safari lune de miel en Tanzanie."}],
      ],
    },
  ],
  includes: includesVariantBFr,
  excludes: excludesVariantBFr,
  faqHeading: comboFaqHeadingFr,
  faqIntro: comboFaqIntroFr,
  faqs: sharedSafariFaqsFr,
}

async function seedSafariFr(data: SafariFr) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await safariDayToDoc(stop))
  await upsertTripFr(data.slug, {
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
  await seedTripFr(machame7Fr)
  await seedTripFr(machame6Fr)
  await seedTripFr(marangu5Fr)
  await seedTripFr(marangu6Fr)
  await seedTripFr(lemosho7Fr)
  await seedTripFr(lemosho8Fr)
  await seedTripFr(lemosho9Fr)
  await seedTripFr(rongai7Fr)
  await seedTripFr(rongai6Fr)
  await seedTripFr(umbwe6Fr)
  await seedTripFr(northernCircuit9Fr)
  await seedTripFr(combo9Fr)
  await seedTripFr(combo10Fr)
  await seedTripFr(combo11Fr)
  await seedTripFr(combo12Fr)
  await seedSafariFr(safari15Fr)
  await seedSafariFr(safari10HoneymoonFr)
  console.log('done — all 17 trips seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
