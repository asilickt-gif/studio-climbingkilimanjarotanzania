/**
 * German: seed homePage-de, climbingKilimanjaroPage-de, siteSettings-de.
 * Mirrors seed-it-singletons.ts / seed-es-singletons.ts's structure exactly;
 * these 3 are singletons (fixed `<type>-de` id, no translation.metadata
 * needed).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-singletons.ts --with-user-token
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

// ---------- homePage-de ----------

async function seedHomeDe() {
  const d = homeData

  const destinationsDe = [
    {
      ...d.hero.destinations[0],
      eyebrow: 'Kilimandscharo',
      heading: 'Das Dach Afrikas',
      body: 'Stellen Sie sich der Herausforderung eines unvergesslichen Treks zum Gipfel des höchsten freistehenden Berges der Welt.',
      stats: [
        {label: 'Erlebnis', value: 'Bergtrekking'},
        {label: 'Dauer', value: '6 bis 9 Tage'},
        {label: 'Höhe', value: '5.895 m'},
      ],
    },
    {
      ...d.hero.destinations[1],
      eyebrow: 'Tansania-Safari',
      heading: 'Das wilde Herz Afrikas',
      body: 'Erkunden Sie Serengeti, den Ngorongoro-Krater und Tarangire auf der Suche nach den Big Five und der großen Tierwanderung.',
      stats: [
        {label: 'Erlebnis', value: 'Foto-Safaris'},
        {label: 'Dauer', value: '5 bis 9 Tage'},
        {label: 'Tierwelt', value: 'Die Big Five'},
      ],
    },
    {
      ...d.hero.destinations[2],
      eyebrow: 'Archipel Sansibar',
      heading: 'Tropisches Paradies',
      body: 'Entspannen Sie an schneeweißen Sandstränden, tauchen Sie in türkisfarbene Korallenriffe und schlendern Sie durch die von Gewürzen duftenden Gassen der historischen Stone Town.',
      stats: [
        {label: 'Erlebnis', value: 'Strand & Kultur'},
        {label: 'Dauer', value: '3 bis 6 Tage'},
        {label: 'Küste', value: 'Indischer Ozean'},
      ],
    },
  ]
  const posterAltDe = [
    'Besteigung des Kilimandscharo',
    'Foto-Safari in der Serengeti',
    'Strand von Sansibar und türkisfarbener Ozean',
  ]
  const thumbnailAltDe = [
    'Gipfelschild Uhuru Peak, Kilimandscharo',
    'Serengeti-Nationalpark',
    'Paje-Strand, Sansibar',
  ]

  const destinations = []
  for (let i = 0; i < d.hero.destinations.length; i++) {
    const dest = d.hero.destinations[i]
    const de = destinationsDe[i]
    destinations.push({
      _type: 'heroDestination',
      _key: key(),
      key: dest.key,
      eyebrow: de.eyebrow,
      heading: de.heading,
      body: de.body,
      stats: de.stats.map((stat) => ({_type: 'heroStat', _key: key(), label: stat.label, value: stat.value})),
      mediaType: dest.media.type,
      ...(dest.media.type === 'video'
        ? {videoSrc: dest.media.src, poster: await uploadImage(client, {src: dest.media.poster.src, alt: posterAltDe[i]})}
        : {image: await uploadImage(client, dest.media.image)}),
      thumbnail: await uploadImage(client, {src: dest.thumbnail.src, alt: thumbnailAltDe[i]}),
      ctaHref: dest.ctaHref,
    })
  }

  const featuresDe = [
    {
      title: 'Lokal geführt und im lokalen Besitz',
      description:
        'Als tansanisches Unternehmen kennen wir das Land, die Menschen und den Berg wie kein anderer. Sie besteigen nicht nur mit Guides — Sie besteigen mit einer Familie.',
    },
    {
      title: 'Erfahrene Bergführer',
      description:
        'Alle unsere Guides sind zertifiziert, erfahren und für Höhentrekking geschult. Ihre Sicherheit und Ihr Erfolg haben für uns oberste Priorität.',
    },
    {
      title: 'Maßgeschneiderte Routen',
      description:
        'Ob Trekking-Einsteiger oder erfahrener Abenteurer — wir bieten anpassbare Kilimandscharo-Routen, die zu Ihrem Tempo, Ihren Zielen und Ihrem Zeitplan passen.',
    },
  ]

  const introBodyDe: {text: string; bold?: boolean; href?: string}[][] = [
    [
      {text: 'Die Besteigung des Kilimandscharo', bold: true, href: '/climbing-mount-kilimanjaro/'},
      {text: ' ist keine gewöhnliche Wanderung — es ist ein Abenteuer, das Ihr Leben verändert. Bei '},
      {text: 'Climbing Kilimanjaro Tanzania', bold: true},
      {
        text: ' wird jedes Detail sorgfältig geplant, damit Ihre Reise reibungslos, sicher und wirklich unvergesslich verläuft, während Sie ',
      },
      {text: 'Afrikas höchsten Berg', bold: true},
      {text: ' besteigen.'},
    ],
    [
      {text: 'Vom Moment der '},
      {text: 'Ankunft am Flughafen', bold: true},
      {
        text: ' über die Ausrüstungsvorbereitung und die fachkundige Begleitung auf dem Trail bis hin zur Feier am Gipfel — wir sind bei jedem Schritt an Ihrer Seite. Die meisten Trekker wählen ihre ',
      },
      {text: 'Kilimandscharo-Route', bold: true},
      {text: ' anhand von Akklimatisierungszeit, Landschaft und Erfolgsquote am Gipfel aus.'},
    ],
    [
      {text: 'Ob Sie eine '},
      {text: 'beliebte Route', bold: true},
      {text: ' bevorzugen oder ein ruhigeres, weniger begangenes Erlebnis suchen — wir haben das passende '},
      {text: 'Kilimandscharo-Trekking', bold: true},
      {text: ' für Sie. Alle unsere '},
      {text: 'Pakete', bold: true},
      {
        text: ' bieten flexible Starttermine, und private Treks können an jedem beliebigen Tag beginnen. Längere ',
      },
      {text: 'Routen', bold: true},
      {text: ' ermöglichen eine bessere Akklimatisierung und erhöhen Ihre Chancen, den Gipfel zu erreichen, erheblich.'},
    ],
    [
      {text: 'Bei einer '},
      {text: 'privaten Besteigung', bold: true},
      {text: ' wird Ihre Gruppe von einem eigenen Team aus professionellen '},
      {text: 'Guides', bold: true},
      {
        text: ', Trägern und einem persönlichen Koch begleitet, mit Mahlzeiten in einem privaten Speisezelt. Auch wenn Trails und Camps mit anderen Trekkern geteilt werden, bleibt Ihr Erlebnis komfortabel, persönlich und bestens betreut.',
      },
    ],
    [
      {text: 'Wir sind stolz darauf, eines der führenden lokalen Unternehmen für die Besteigung des '},
      {text: 'Kilimandscharo', bold: true},
      {text: ' zu sein, mit dem Ziel, sichere, unvergessliche und lohnende Gipfelerlebnisse zu bieten.'},
    ],
  ]

  const introFeaturesDe = [
    {
      title: 'Ein herzliches, lokales Team',
      description: 'Aufgewachsen im Schatten des Kilimandscharo kennen wir den Berg wie unsere eigene Familie.',
    },
    {
      title: 'Sicheres Trekking im richtigen Tempo',
      description:
        'Wir gehen „pole pole“ (langsam, langsam) vor. Sorgfältig geführte Besteigungen, Wohlbefindenskontrollen und umfassende Betreuung.',
    },
    {
      title: 'Eine echte Verbindung, keine bloße Tour',
      description:
        'Sie kehren mit weit mehr als nur Gipfelfotos nach Hause zurück — mit bleibenden Freundschaften und einer Geschichte, die Sie erzählen werden.',
    },
  ]

  const routeGuideItemsDe = [
    {name: 'Lemosho / Shira (7–9 Tage):', detail: 'Bietet hervorragende Akklimatisierung, atemberaubende Landschaften und hohe Gipfelchancen.'},
    {name: 'Machame (6–8 Tage):', detail: 'Sehr beliebt und landschaftlich reizvoll; oft als „Whiskey-Route“ bezeichnet.'},
    {name: 'Rongai (6–7 Tage):', detail: 'Eine ruhigere Route mit trockenerem Zugang, ideal während der Regenzeit.'},
    {name: 'Marangu (5–6 Tage):', detail: 'Die kürzeste Route, bekannt für ihren unkomplizierten Weg und die Unterkunft in Hütten.'},
  ]

  const kiliCardTitlesDe = [
    'Lemosho Route 9 Tage – Schlafen im Krater',
    'Kilimandscharo-Trekking – Machame-Route 6 Tage',
    'Kilimandscharo-Trekking – Lemosho-Route 8 Tage',
    'Kilimandscharo-Trekking – Machame-Route 7 Tage',
    'Kilimandscharo-Trekking – Marangu-Route 6 Tage',
    'Kilimandscharo-Trekking – Rongai-Route 6 Tage',
  ]
  const kiliCardTourTypeDe = ['Kleingruppe / Basis', 'Privat • Basis', 'Privat • Basis', 'Privat • Basis', 'Privat • Basis', 'Privat • Basis']
  const kiliCardLocationDe = [
    'Arusha › Lemosho › Kilimandscharo',
    'Arusha › Kilimandscharo',
    'Arusha › Kilimandscharo',
    'Arusha › Kilimandscharo',
    'Arusha › Kilimandscharo',
    'Arusha › Kilimandscharo',
  ]

  const safariCardTitlesDe = [
    'Mara-Fluss-Migrations-Safari - 07 Tage',
    'Simba-Safari - 05 Tage',
    'Klassisches Tansania - 07 Tage',
    'Tansania-Komforterlebnis - 07 Tage',
    'Tansania-Glamping-Safari-Erlebnis - 05 Tage',
    'Gnu-Wanderungs-Safari - 09 Tage',
  ]
  const safariCardTourTypeDe = ['Privat • Komfort', 'Privat • Komfort', 'Privat • Komfort', 'Privat • Komfort', 'Privat • Komfort', 'Privat • Komfort Plus']
  const safariCardLocationDe = [
    'Arusha › Zentrale Serengeti › Ngorongoro-Krater',
    'Serengeti-Nationalpark › Ngorongoro › Ngorongoro-Krater',
    'Arusha › Lake Manyara › Serengeti › Zentrale Serengeti › Ngorongoro',
    'Arusha › Tarangire-Nationalpark › Serengeti › Ngorongoro',
    'Arusha › Tarangire-Nationalpark › Serengeti › Ngorongoro',
    'Arusha › Lake Manyara › Serengeti › Ngorongoro › Tarangire',
  ]

  const zanzibarCardTitlesDe = [
    'Sansibar Indischer Ozean - 06 Tage',
    'Sansibars Indischer Ozean - 06 Tage',
    'Die Insel Sansibar in Tansania - 05 Tage',
    'Flitterwochen auf Sansibar - 06 Tage',
    'Die Insel Sansibar entdecken - 03 Tage',
    'Den Indischen Ozean entdecken - 06 Tage',
  ]
  const zanzibarCardTourTypeDe = ['Privat • Luxus', 'Privat • Komfort', 'Privat • Luxus', 'Privat • Basis', 'Privat • Basis', 'Privat • Basis']
  const zanzibarCardLocationDe = [
    'Stone Town Sansibar › Sansibar',
    'Stone Town Sansibar › Sansibar',
    'Stone Town Sansibar › Sansibar',
    'Stone Town Sansibar › Sansibar',
    'Internationaler Flughafen Abeid Amani Karume › Sansibar › Stone Town Sansibar',
    'Sansibar › Stone Town Sansibar',
  ]

  const routeOptionsDe = [
    {
      title: 'Marangu-Route 5 Tage',
      summary: 'Eine fünftägige Reise zum höchsten Gipfel Afrikas über die berühmte Marangu-Route. Erwarten Sie vielfältige Landschaften…',
      duration: '5 Tage / 4 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $2.008 pro Person', '2 Trekker im Doppelzimmer - $1.783 pro Person', '3–4 Trekker im Mehrbettzimmer - $1.678 pro Person'],
    },
    {
      title: 'Marangu-Route 6 Tage',
      summary: 'Eine sechstägige Reise zum höchsten Gipfel Afrikas über die berühmte Marangu-Route. Erwarten Sie vielfältige Landschaften…',
      duration: '6 Tage / 5 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $2.308 pro Person', '2 Trekker im Doppelzimmer - $1.928 pro Person', '3–4 Trekker im Mehrbettzimmer - $1.678 pro Person'],
    },
    {
      title: 'Machame- oder Umbwe-Route 6 Tage',
      summary: 'Die Umbwe-Route ist bekannt für ihren anspruchsvollen, steilen Aufstieg und ihren wunderschönen, wenig begangenen Pfad.',
      duration: '6 Tage / 5 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $2.308 pro Person', '2 Trekker im Doppelzimmer - $2.058 pro Person', '3–4 Trekker im Mehrbettzimmer - $2.058 pro Person'],
    },
    {
      title: 'Machame- oder Umbwe-Route 7 Tage',
      summary: 'Nehmen Sie die beliebte Machame-Route, mit insgesamt sieben Reisetagen, was Ihnen noch mehr Akklimatisierungszeit gibt',
      duration: '7 Tage / 6 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $2.608 pro Person', '2 Trekker im Doppelzimmer - $2.608 pro Person', '3–4 Trekker im Mehrbettzimmer - $2.348 pro Person'],
    },
    {
      title: '6 Tage / 5 Trekkingnächte + 2 Hotelnächte',
      summary: 'Eine sechstägige Reise zum höchsten Gipfel Afrikas über die berühmte Marangu-Route. Erwarten Sie vielfältige Landschaften…',
      duration: '6 Tage / 5 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $2.648 pro Person', '2 Trekker im Doppelzimmer - $2.648 pro Person', '3–4 Trekker im Mehrbettzimmer - $2.063 pro Person'],
    },
    {
      title: 'Shira-, Lemosho- oder Rongai-Route 7 Tage',
      summary: 'Von Norden angegangen, bietet diese Route eine einzigartige Perspektive auf den Kilimandscharo und eignet sich hervorragend für alle, die…',
      duration: '7 Tage / 6 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $2.938 pro Person', '2 Trekker im Doppelzimmer - $2.938 pro Person', '3–4 Trekker im Mehrbettzimmer - $2.313 pro Person'],
    },
    {
      title: 'Shira-, Lemosho- oder Rongai-Route 8 Tage',
      summary: 'Von Norden angegangen, bietet diese Route eine einzigartige Perspektive auf den Kilimandscharo und eignet sich hervorragend für alle, die…',
      duration: '8 Tage / 7 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $3.228 pro Person', '2 Trekker im Doppelzimmer - $2.773 pro Person', '3–4 Trekker im Mehrbettzimmer - $2.568 pro Person'],
    },
    {
      title: '8 Tage / 7 Trekkingnächte + 2 Hotelnächte',
      summary: 'Nehmen Sie die beliebte Machame-Route, mit insgesamt sieben Reisetagen, was Ihnen noch mehr Akklimatisierungszeit gibt',
      duration: '8 Tage / 7 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $3.588 pro Person', '2 Trekker im Doppelzimmer - $2.938 pro Person', '3–4 Trekker im Mehrbettzimmer - $2.938 pro Person'],
    },
    {
      title: 'Northern-Circuit-Route 9 Tage, Toilettenmiete inklusive',
      summary: 'Die neueste und längste Route, mit 360-Grad-Aussichten und den höchsten Erfolgsquoten für das Erreichen des Gipfels.',
      duration: '9 Tage / 8 Trekkingnächte + 2 Hotelnächte',
      prices: ['1 Solo-Trekker - $3.918 pro Person', '2 Trekker im Doppelzimmer - $3.228 pro Person', '3–4 Trekker im Mehrbettzimmer - $3.228 pro Person'],
    },
  ]

  const whyUsCardsDe = [
    {
      title: '100 % lokal geführt',
      description:
        'Wir sind kein ausländischer Reiseveranstalter — wir sind in Moshi, im Schatten des Kilimandscharo, aufgewachsen. Wenn Sie mit Asili besteigen, unterstützen Sie direkt lokale Familien und Gemeinschaften und erleben den Berg durch die Augen derer, die ihn am besten kennen.',
    },
    {
      title: 'Höchste Sicherheitsstandards',
      description:
        'Wir führen Notfallsauerstoff und Pulsoximeter mit und führen zweimal täglich Gesundheitschecks durch. Unsere Guides sind geschult, Höhenkrankheit frühzeitig zu erkennen und zu behandeln. Ihre Sicherheit steht bei uns immer an erster Stelle.',
    },
    {
      title: 'Private Besteigungen, flexible Termine und individuelle Optionen',
      description:
        'Möchten Sie allein, zu zweit oder mit einer kleinen Gruppe von Freunden besteigen? Wir bieten private Abreisen, die sich Ihrem Zeitplan anpassen. Ihr Tempo. Ihr Weg. Ihr Kilimandscharo.',
    },
    {
      title: 'Bewährte Gipfelerfolgsquoten',
      description:
        'Dank unseres Fokus auf Akklimatisierung, angemessenes Tempo und erfahrenes Personal erzielen wir bei unseren längeren Routen eine Gipfelerfolgsquote von über 95 %. Wenn Sie uns Ihren Traum anvertrauen, setzen wir alles daran, ihn wahr werden zu lassen.',
    },
    {
      title: 'Flughafentransfer, Hotelbuchung und Rundum-Betreuung',
      description:
        'Vom Moment der Landung am Kilimandscharo-Flughafen bis zu Ihrer Ankunft am Uhuru Peak sind wir an Ihrer Seite. Flughafentransfers, Ausrüstungskontrolle, Hotelbuchungen und logistische Unterstützung — all das gehört zum Asili-Erlebnis.',
    },
    {
      title: 'Faires und ethisches Trekking',
      description:
        'Wir sind stolze Unterstützer des Kilimanjaro Porters Assistance Project (KPAP) und stellen sicher, dass jeder Träger fair bezahlt, angemessen verpflegt und mit guter Ausrüstung ausgestattet wird. Wenn Sie mit Asili besteigen, besteigen Sie mit Integrität.',
    },
  ]

  const comboTilesDe = [
    {title: 'Kilimandscharo & Wildtier-Safari', subtitle: '12 Tage in Tansania'},
    {title: 'Kilimandscharo & Wildtier-Safari', subtitle: '10 Tage in Tansania'},
    {title: 'Kilimandscharo, Serengeti & Ngorongoro', subtitle: '12 Tage in Tansania'},
    {title: 'Kilimandscharo, Tarangire & Lake Manyara', subtitle: '10 Tage Kili-Besteigung und Wildtier-Safari'},
  ]

  const testimonialsDe = [
    {
      timeAgo: 'vor 9 Monaten',
      quote:
        'Diese Firma hat mir meinen Traum von der Besteigung des Kilimandscharo erfüllt! Hervorragende Betreuung, köstliches Essen auf dem Berg und ein…',
    },
    {
      timeAgo: 'vor 9 Monaten',
      quote:
        'Sehr zu empfehlen für alle, die planen, den höchsten Berg Afrikas zu besteigen. Das Team war äußerst unterstützend, das Essen…',
    },
  ]

  const faqQ = {
    q1: 'Wie lange dauert die Besteigung des Kilimandscharo?',
    a1: 'Die Dauer hängt von der gewählten Route ab. Die meisten Kilimandscharo-Besteigungen dauern zwischen 6 und 9 Tagen. Längere Routen bieten mehr Zeit zur Akklimatisierung, was Ihre Chancen auf einen erfolgreichen Gipfelerfolg erhöht.',
    q2: 'Benötige ich vorherige Klettererfahrung?',
    a2: 'Es ist keine technische Klettererfahrung erforderlich. Gute körperliche Fitness und mentale Vorbereitung sind jedoch unerlässlich, da der Kilimandscharo ein Höhentrekking und keine technische Kletterei ist.',
    q3: 'Wann ist die beste Zeit, um den Kilimandscharo zu besteigen?',
    a3: 'Die besten Monate zum Besteigen sind Januar bis März und Juni bis Oktober, wenn das Wetter meist trocken und die Sicht am besten ist.',
    q4: 'Welche Art von Unterkunft ist während der Besteigung vorgesehen?',
    a4: 'Die Unterkunft variiert je nach Route. Die meisten Routen nutzen komfortable Bergzelte, während die Marangu-Route Unterkünfte in Hütten entlang des Weges bietet.',
    q5: 'Was muss ich für die Besteigung mitbringen?',
    a5: 'Sie benötigen gute Trekkingschuhe, warme Kleidung, einen Schlafsack, wetterfeste Ausrüstung und persönliche Gegenstände. Wir stellen Ihnen eine detaillierte Liste zur Vorbereitung Ihrer Reise zur Verfügung.',
    q6: 'Ist Höhenkrankheit auf dem Kilimandscharo häufig?',
    a6: 'Ja, Höhenkrankheit kann jeden treffen, unabhängig vom Fitnessniveau. Unsere Guides sind geschult, Ihre Gesundheit engmaschig zu überwachen und eine sichere, schrittweise Besteigung für eine bessere Akklimatisierung zu gewährleisten.',
    q7: 'Warum bei Climbing Kilimanjaro Tanzania buchen?',
    a7: 'Wir sind ein lokaler und erfahrener Reiseveranstalter mit professionellen Bergführern, hochwertiger Ausrüstung und persönlichem Service, um eine sichere, angenehme und unvergessliche Besteigung zu gewährleisten.',
  }
  const faqItem = (q: string, a: string) => ({_type: 'faqItem', _key: key(), question: q, answer: a})

  await client.createOrReplace({
    _id: 'homePage-de',
    _type: 'homePage',
    language: 'de',
    hero: {
      exploreLabel: 'Entdecken',
      primaryCtaLabel: 'Pakete ansehen',
      secondaryCtaLabel: 'Reise individuell gestalten',
      secondaryCtaHref: d.hero.secondaryCtaHref,
      destinations,
    },
    features: featuresDe.map((item) => ({_type: 'featureItem', _key: key(), title: item.title, description: item.description})),
    intro: {
      heading: 'Von der Ankunft bis zum Gipfel — wir kümmern uns um alles.',
      body: segmentParagraphsToPt(introBodyDe),
      ctaLabel: 'Mehr über uns erfahren',
      ctaHref: d.intro.ctaHref,
      image: await uploadImage(client, {src: d.intro.image.src, alt: 'Wanderer am Kilimandscharo'}),
    },
    introFeatures: introFeaturesDe.map((item) => ({_type: 'introFeature', _key: key(), title: item.title, description: item.description})),
    routeGuide: {
      eyebrow: 'Wählen Sie Ihre Route. Besteigen Sie auf Ihre Art. Vollständiger Leitfaden zu Preisen und Buchungstipps mit lokalen Guides',
      heading: 'Tansania-Abenteuerguide: Safari, Kilimandscharo und Sansibar-Urlaub',
      items: routeGuideItemsDe.map((item) => ({_type: 'routeGuideItem', _key: key(), name: item.name, detail: item.detail})),
    },
    kilimanjaroPackages: {
      heading: 'Kilimandscharo-Tourpakete',
      viewAllHref: d.kilimanjaroPackages.viewAllHref,
      cards: await Promise.all(
        d.kilimanjaroPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: kiliCardTitlesDe[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: kiliCardTourTypeDe[i],
          tourId: card.tourId,
          price: card.price,
          location: kiliCardLocationDe[i],
        })),
      ),
    },
    safariPackages: {
      heading: 'Safari- und Tourpakete',
      viewAllHref: d.safariPackages.viewAllHref,
      cards: await Promise.all(
        d.safariPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: safariCardTitlesDe[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: safariCardTourTypeDe[i],
          tourId: card.tourId,
          price: card.price,
          location: safariCardLocationDe[i],
        })),
      ),
    },
    zanzibarPackages: {
      heading: 'Sansibar-Tourpakete',
      viewAllHref: d.zanzibarPackages.viewAllHref,
      cards: await Promise.all(
        d.zanzibarPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: zanzibarCardTitlesDe[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: zanzibarCardTourTypeDe[i],
          tourId: card.tourId,
          price: card.price,
          location: zanzibarCardLocationDe[i],
        })),
      ),
    },
    routeOptions: {
      heading: 'Wählen Sie Ihre Route: Vergleichen Sie alle Kilimandscharo-Pakete und -Routen mit einem lokalen Guide',
      cards: await Promise.all(
        d.routeOptions.cards.map(async (card, i) => ({
          _type: 'routeOptionCard',
          _key: key(),
          title: routeOptionsDe[i].title,
          href: card.href,
          image: await uploadImage(client, card.image),
          summary: routeOptionsDe[i].summary,
          duration: routeOptionsDe[i].duration,
          prices: routeOptionsDe[i].prices,
        })),
      ),
    },
    notSureBand: {
      heading: 'Nicht sicher, welche Route zu Ihnen passt?',
      body: 'Wir bieten eine Reihe von Kilimandscharo-Routen, die zu Ihrer körperlichen Verfassung, Ihrem Zeitplan und Ihrem Trekking-Stil passen. Ob Sie beeindruckende Landschaften, weniger Andrang oder die beste Erfolgsquote suchen — wir helfen Ihnen, den richtigen Weg zum Gipfel zu finden.',
      ctaLabel: 'Jetzt anrufen',
      ctaHref: d.notSureBand.ctaHref,
    },
    whyUs: {
      heading: 'Warum den Kilimandscharo mit uns besteigen?',
      body: 'Das richtige Team kann den Unterschied zwischen einer bloßen Wanderung und einem lebensverändernden Abenteuer ausmachen.',
      cards: whyUsCardsDe.map((card, i) => ({
        _type: 'whyUsCard',
        _key: key(),
        title: card.title,
        description: card.description,
        icon: d.whyUs.cards[i].icon,
      })),
    },
    comboExperience: {
      heading: 'Kilimandscharo-Besteigung & Safari-Erlebnis',
      body: 'Machen Sie Ihr Tansania-Abenteuer wirklich unvergesslich: Besteigen Sie den majestätischen Kilimandscharo und erkunden Sie anschließend Afrikas bekannteste Safariparks. Mit Asili gehen Ihre Besteigung und Ihre Safari nahtlos ineinander über, geführt von lokalen Experten, die jeden Pfad, jede Landschaft und jeden erlebenswerten Moment kennen.',
      cardTitle: 'Höher hinaus. Wilder erkunden. Eine unvergessliche Reise erleben',
      cardBody:
        'Erreichen Sie den Gipfel des höchsten freistehenden Berges der Welt und tauchen Sie anschließend in Tansanias atemberaubende Wildnis ein. Mit unseren Kilimandscharo-plus-Safari-Paketen genießen Sie die perfekte Mischung aus Abenteuer: den Kilimandscharo bezwingen und danach die Wunder der Serengeti, des Ngorongoro-Kraters und des Tarangire-Nationalparks entdecken.',
      ctaLabel: 'Jetzt planen',
      ctaHref: d.comboExperience.ctaHref,
      tiles: await Promise.all(
        d.comboExperience.tiles.map(async (tile, i) => ({
          _type: 'comboTile',
          _key: key(),
          title: comboTilesDe[i].title,
          subtitle: comboTilesDe[i].subtitle,
          href: tile.href,
          image: await uploadImage(client, tile.image),
        })),
      ),
      body2:
        'Erreichen Sie den Gipfel des höchsten freistehenden Berges der Welt und tauchen Sie anschließend in Tansanias atemberaubende Wildnis ein. Mit unseren Kilimandscharo-plus-Safari-Paketen genießen Sie die perfekte Mischung aus Abenteuer: den Kilimandscharo bezwingen und danach die Wunder der Serengeti, des Ngorongoro-Kraters und des Tarangire-Nationalparks entdecken.',
      viewToursLabel: 'Weitere Touren ansehen',
      viewToursHref: d.comboExperience.viewToursHref,
    },
    testimonials: {
      heading: 'Was unsere zufriedenen Gipfelstürmer sagen',
      items: d.testimonials.items.map((item, i) => ({
        _type: 'testimonial',
        _key: key(),
        name: item.name,
        timeAgo: testimonialsDe[i].timeAgo,
        rating: item.rating,
        quote: testimonialsDe[i].quote,
      })),
    },
    faq: {
      heading: 'Häufig gestellte Fragen',
      tabs: [
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Alle Fragen',
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
          label: 'Zeitpunkt der Besteigung',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q3, faqQ.a3)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Unterkunft',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q6, faqQ.a6), faqItem(faqQ.q7, faqQ.a7)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Buchung',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2)],
        },
      ],
    },
  })
  console.log('homePage-de created/replaced')
}

// ---------- climbingKilimanjaroPage-de ----------

async function seedClimbDe() {
  const d = climbingKilimanjaroPageData

  await client.createOrReplace({
    _id: 'climbingKilimanjaroPage-de',
    _type: 'climbingKilimanjaroPage',
    language: 'de',
    trustBadges: {
      heading: 'Kilimandscharo-Besteigungspakete',
      badges: [
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'TripAdvisors Top-Wahl',
          description:
            'Mit Hunderten hervorragender Bewertungen hebt sich unser Engagement für Qualität und Kundenzufriedenheit unter den Kilimandscharo-Reiseveranstaltern ab.',
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Vertrauenswürdig und erfahren',
          description:
            'Unsere bestens ausgebildeten Guides sorgen für eine gut betreute Besteigung mit Fokus auf Sicherheit, ethisches Trekking und einen reibungslosen Weg zum Gipfel.',
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Ansässig in Tansania',
          description:
            'Wir organisieren individuelle Kilimandscharo-Trekkingerlebnisse, von günstigen Besteigungen bis zu Luxusexpeditionen, stets mit verantwortungsvollen und ethischen Klettermethoden.',
        },
      ],
    },
    challengeBand: {
      heading: 'Bereit, sich der Kilimandscharo-Herausforderung zu stellen?',
      body: 'Ihre Reise zum Dach Afrikas beginnt hier. Ob Sie das Abenteuer Ihres Lebens suchen oder sich bis zum Gipfel an Ihre Grenzen bringen wollen — wir begleiten Sie bei jedem Schritt.',
      backgroundImage: await uploadImage(client, d.challengeBand.backgroundImage),
      primaryCtaLabel: 'Gipfel-Challenge',
      secondaryCtaLabel: 'Besteigung starten',
    },
    routeSelector: {
      heading: 'Kilimandscharo-Routen und Besteigungskarten',
      tabs: await Promise.all([
        {
          name: 'Machame-Route',
          body: 'Bekannt als Whiskey-Route, ist Machame die beliebteste Kilimandscharo-Route und bietet atemberaubende Landschaften sowie abwechslungsreiches Gelände. Obwohl anspruchsvoll, mit steilen Pfaden und Zeltcamps, bietet sie eine hervorragende Akklimatisierung für Trekker, die einen kürzeren, aber lohnenden Trek suchen.',
          map: d.routeSelector.tabs[0].map,
        },
        {
          name: 'Lemosho-Route',
          body: 'Eine der landschaftlich schönsten Kilimandscharo-Routen: Lemosho beginnt am abgelegenen Londorossi Gate und führt über das prächtige Shira-Plateau. Letztlich gibt es für jeden, der das Abenteuer einer Kilimandscharo-Besteigung erleben möchte, die passende Route.',
          map: d.routeSelector.tabs[1].map,
        },
        {
          name: 'Rongai-Route',
          body: 'Als einzige nördliche Kilimandscharo-Route ist Rongai weniger begangen und sanfter, was sie zu einer ausgezeichneten Wahl für alle macht, die eine ruhige und gleichmäßige Besteigung bevorzugen. Diese Route ist ideal während der Regenzeit, da sie weniger Niederschlag erhält und ein angenehmes Trekking durch unberührte Wildnis bietet.',
          map: d.routeSelector.tabs[2].map,
        },
        {
          name: 'Northern-Circuit-Route',
          body: 'Die längste und landschaftlich reizvollste Route: Der Northern Circuit bietet die beste Akklimatisierung, indem er den Kilimandscharo schrittweise umrundet. Mit Panoramablicken und einer hohen Erfolgsquote bietet diese Route ein ruhiges und intensives Trekking-Erlebnis.',
          map: d.routeSelector.tabs[3].map,
        },
      ].map(async (tab) => ({_type: 'routeTab', _key: key(), name: tab.name, body: tab.body, map: await uploadImage(client, tab.map)}))),
    },
    conquerBand: {
      heading: 'Bezwingen Sie den Kilimandscharo. Erleben Sie das Abenteuer.',
      body: 'Gehen Sie über Ihre Grenzen hinaus und stellen Sie sich auf den höchsten Punkt Afrikas. Stellen Sie sich der Kilimandscharo-Herausforderung und machen Sie Ihren Traum wahr!',
      backgroundImage: await uploadImage(client, d.conquerBand.backgroundImage),
      primaryCtaLabel: 'Afrika bezwingen',
      secondaryCtaLabel: 'Ihre Besteigung starten',
      primaryCtaHref: d.conquerBand.primaryCtaHref,
      secondaryCtaHref: d.conquerBand.secondaryCtaHref,
    },
    promoStrip: {
      heading: 'Bezwingen Sie den Kilimandscharo. Erleben Sie das Abenteuer.',
      cards: await Promise.all([
        {
          title: '📖 Lesen Sie unseren Kilimandscharo-Guide',
          body: 'Erhalten Sie alle wichtigen Informationen zur Vorbereitung Ihrer Besteigung. Unser Guide deckt alles ab, von Routen bis zu Sicherheitstipps, für eine reibungslose und erfolgreiche Besteigung.',
          linkLabel: 'Weiterlesen',
          href: d.promoStrip.cards[0].href,
          backgroundImage: d.promoStrip.cards[0].backgroundImage,
        },
        {
          title: '🎯 Experten-Tipps für Ihre Besteigung',
          body: 'Obwohl der Kilimandscharo Trekker aller Erfahrungsstufen willkommen heißt, ist umsichtiges Trekking unerlässlich. Unsere erfahrenen Guides überwachen Ihre Gesundheit und bieten Ihnen umfassende Unterstützung für eine sichere und angenehme Reise.',
          linkLabel: 'Weiterlesen',
          href: d.promoStrip.cards[1].href,
          backgroundImage: d.promoStrip.cards[1].backgroundImage,
        },
        {
          title: '🎒 Ihre Kilimandscharo-Packliste',
          body: 'Bereiten Sie sich optimal vor mit unserer vollständigen Packliste, die alle wichtigen Ausrüstungsgegenstände für eine komfortable und erfolgreiche Besteigung im Detail auflistet.',
          linkLabel: 'Packliste ansehen',
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
        label: 'Routenwahl',
        heading: 'Welche Routen stehen am Kilimandscharo zur Verfügung?',
        intro: segmentParagraphsToPt([
          [
            {
              text: 'Der Kilimandscharo bietet mehrere Routen, die für Trekker jeden Niveaus, jeder Vorliebe und jedes Trekking-Stils geeignet sind. Jede Route bietet ein einzigartiges Erlebnis, von entspanntem Tempo bis zu einem anspruchsvolleren Abenteuer, mit Unterkünften vom Zeltcamp bis zu komfortableren Einrichtungen.',
            },
          ],
          [
            {text: 'Bei '},
            {text: 'Asili Explorer African Safaris', bold: true},
            {text: ' sind wir auf die vier beliebtesten Kilimandscharo-Routen spezialisiert: '},
            {text: 'Rongai-Route, Lemosho-Route, Northern-Circuit-Route und Machame-Route.', bold: true},
            {text: ' Unsere geführten Besteigungen gewährleisten Sicherheit, angemessene Akklimatisierung und eine unvergessliche Reise zum Gipfel.'},
          ],
        ]),
        faqCards: [
          {
            question: 'Welche Kilimandscharo-Route ist am wenigsten begangen?',
            answer: [
              {text: 'Die '},
              {text: 'Northern-Circuit-Route', accent: true},
              {text: ' ist am wenigsten begangen und bietet ein ruhiges, abgelegenes Trekking-Erlebnis.'},
            ],
          },
          {
            question: 'Welche Route ist am einfachsten für die Besteigung des Kilimandscharo?',
            answer: [
              {text: 'Die '},
              {text: 'Rongai-Route', accent: true},
              {text: ' gilt aufgrund ihrer gleichmäßigen Steigung und ihres geraden Aufstiegs als die einfachste.'},
            ],
          },
          {
            question: 'Welche Kilimandscharo-Route ist landschaftlich am schönsten?',
            answer: [
              {text: 'Die '},
              {text: 'Lemosho-Route', accent: true},
              {text: ' gilt oft als die landschaftlich schönste, mit atemberaubenden Landschaften, vielfältigen Ökosystemen und Panoramablicken.'},
            ],
          },
        ].map((card) => ({_type: 'richFaqCard', _key: key(), question: card.question, answer: segmentsToRichText(card.answer)})),
        closingNote: segmentsToRichText([
          {text: 'Letztlich gibt es für jeden, der das Abenteuer einer '},
          {text: 'Kilimandscharo-Besteigung', bold: true},
          {text: ' erleben möchte, die passende Route.'},
        ]),
      },
      {
        _type: 'routesComparisonTab',
        _key: key(),
        label: 'Routenvergleich',
        heading: 'Wie unterscheiden sich die Kilimandscharo-Routen?',
        table: {
          _type: 'dataTable',
          columns: ['Routenname', 'Schwierigkeitsgrad', 'Länge (km)', 'Dauer (Tage)', 'Andrang', 'Preis (USD)', 'Erfolgsquote (%)'],
          rows: [{_type: 'tableRow', _key: key(), cells: ['Northern Circuit', 'Mäßig bis schwer', '90', '9–10', 'Gering', '$2.500–3.500', '95']}],
        },
        noteLabel: 'HINWEIS:',
        noteBody:
          'Preise und Erfolgsquoten sind Näherungswerte und können je nach Gruppengröße, Akklimatisierung und Wetterbedingungen variieren.',
      },
      {
        _type: 'bestTimeTab',
        _key: key(),
        label: 'Beste Reisezeit',
        heading: 'Wann sollten Sie den Kilimandscharo besteigen?',
        intro: segmentParagraphsToPt([
          [
            {text: 'Die beste Zeit für die Besteigung des Kilimandscharo ist von '},
            {text: 'Juni bis März', accent: true},
            {text: '. Aufgrund sich wandelnder Wetterbedingungen können die Verhältnisse jedoch variieren.'},
          ],
          [
            {
              text: 'Während dieser Zeit ist das Wetter meist trockener und stabiler, mit klarerem Himmel und besseren Besteigungsbedingungen. Dies verringert die Risiken von Regen, Schnee und schlechter Sicht und verbessert sowohl die Sicherheit als auch den Genuss der Reise.',
            },
          ],
        ]),
        cards: [
          {
            title: 'Temperaturüberlegungen:',
            bullets: [
              [
                {text: 'Die Tagestemperaturen reichen von '},
                {text: '20 °C bis 27 °C', accent: true},
                {text: ' in niedrigeren Lagen, sinken aber in großer Höhe unter den Gefrierpunkt, besonders nachts.'},
              ],
              [
                {text: 'Schichtkleidung', accent: true},
                {text: ' ist unerlässlich, um sich an die Temperaturschwankungen während der gesamten Besteigung anzupassen.'},
              ],
            ],
          },
          {
            title: 'Vegetation und Landschaft:',
            bullets: [
              [{text: 'Trockenzeiten bieten klarere Ausblicke, blühende Wildblumen und üppige Wälder entlang der Pfade.'}],
              [{text: 'Feuchtere Jahreszeiten können nebelige Bedingungen und dichte Wolkendecke mit sich bringen.'}],
            ],
          },
          {
            title: 'Andrang:',
            bullets: [
              [
                {text: 'Die Hauptsaisons', accent: true},
                {text: ' (Januar–Februar und Juli–September) ziehen mehr Trekker an.'},
              ],
              [
                {text: 'Die Nebensaisons', accent: true},
                {text: ' (Ende März–Mai und November–Anfang Dezember) bieten ruhigere Erlebnisse.'},
              ],
            ],
          },
          {
            title: 'Persönliche Vorlieben und Ziele:',
            bullets: [
              [
                {
                  text: 'Trekker sollten bei der Planung ihrer Besteigung Wetterbedingungen, ihre Temperaturvorlieben, das Andrangsniveau und ihren persönlichen Zeitplan berücksichtigen.',
                },
              ],
              [{text: 'Auch Möglichkeiten zur Tierbeobachtung und landschaftliche Vorlieben können die Entscheidung beeinflussen.'}],
            ],
          },
        ].map((card) => ({
          _type: 'bestTimeCard',
          _key: key(),
          title: card.title,
          bullets: card.bullets.map((bullet) => ({_type: 'bulletItem', _key: key(), body: segmentsToRichText(bullet)})),
        })),
        closingNote: segmentsToRichText([
          {text: 'Für eine persönliche Beratung zur besten Reisezeit passend zu Ihren Zielen wenden Sie sich an unsere erfahrenen Kilimandscharo-Guides bei '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: '.'},
        ]),
      },
      {
        _type: 'climbCostTab',
        _key: key(),
        label: 'Kosten der Besteigung',
        heading: 'Wie viel kostet die Besteigung des Kilimandscharo?',
        intro: segmentsToRichText([
          {text: 'Die Kosten für die Besteigung des Kilimandscharo variieren zwischen '},
          {text: '2.500 $ und 4.000 $', accent: true},
          {text: ', abhängig von:'},
        ]),
        items: [
          'Der gewählten Route',
          'Der Dauer der Besteigung',
          'Der Gruppengröße',
          'Dem Serviceniveau (Klassisch oder Premium)',
          'Was im Paket enthalten oder ausgeschlossen ist',
        ],
        closingNote: segmentsToRichText([
          {text: 'Auch wenn das Budget wichtig ist, sollten '},
          {text: 'Sicherheit und Qualität', bold: true},
          {text: ' bei der Wahl eines Besteigungsanbieters oberste Priorität haben. Bei '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ' garantieren wir gut ausgebildete Guides, hohe Sicherheitsstandards und ein insgesamt herausragendes Erlebnis.'},
        ]),
      },
      {
        _type: 'climbingInsightsTab',
        _key: key(),
        label: 'Besteigungstipps',
        heading: 'Wichtige Tipps für eine erfolgreiche Besteigung',
        intro: segmentsToRichText([
          {text: 'Den Gipfel des höchsten freistehenden Berges der Welt zu erreichen, ist keine Kleinigkeit. '},
          {text: 'Gute Vorbereitung ist unerlässlich.', bold: true},
          {text: ' Hier sind einige wichtige Tipps:'},
        ]),
        tips: [
          {label: 'Gehen Sie langsam:', description: 'Ein gleichmäßiges Tempo verringert das Risiko von Höhenkrankheit und Erschöpfung.'},
          {label: 'Trinken Sie ausreichend:', description: 'Trinken Sie viel Wasser, um die Akklimatisierung zu unterstützen.'},
          {
            label: 'Besorgen Sie die richtige Ausrüstung:',
            description: 'Investieren Sie in geeignete Kleidungsschichten, robuste Trekkingschuhe und hochwertige Ausrüstung.',
          },
          {
            label: 'Bereiten Sie sich körperlich und mental vor:',
            description: 'Ausdauer- und Krafttraining stärken Ihre Belastbarkeit, während mentale Entschlossenheit Ihnen durchhilft.',
          },
          {label: 'Haben Sie Spaß und knüpfen Sie Kontakte:', description: 'Der Austausch mit anderen Trekkern macht die Reise bereichernder.'},
        ].map((tip) => ({_type: 'tip', _key: key(), label: tip.label, description: tip.description})),
        closingNote:
          'Wenn Sie diese Tipps befolgen, maximieren Sie Ihre Chancen, den Gipfel zu erreichen, während Sie jeden Schritt der Besteigung genießen.',
      },
      {
        _type: 'guidedClimbsTab',
        _key: key(),
        label: 'Geführte Besteigungen',
        heading: 'Benötigen Sie einen Guide für die Besteigung des Kilimandscharo?',
        intro: segmentsToRichText([
          {text: 'Ja! Die Besteigung des Kilimandscharo ohne einen lizenzierten Guide ist '},
          {text: 'nicht erlaubt.', bold: true},
        ]),
        faqs: [
          {
            question: 'Warum benötige ich einen Guide?',
            answer:
              'Guides bringen ihre Fachkenntnis ein, überwachen Ihre Gesundheit, gewährleisten Ihre Sicherheit und helfen Ihnen, sich im anspruchsvollen Gelände des Kilimandscharo zurechtzufinden.',
          },
          {
            question: 'Können erfahrene Trekker auf einen Guide verzichten?',
            answer:
              'Auch erfahrene Trekker müssen von einem Guide begleitet werden. Die große Höhe und die unvorhersehbaren Bedingungen machen eine professionelle Begleitung unerlässlich.',
          },
          {
            question: 'Wie verbessern Guides die Sicherheit?',
            answer:
              'Guides überwachen die Akklimatisierung, leisten Erste Hilfe, beurteilen Wetterbedingungen und treffen entscheidende Entscheidungen für den Erfolg der Besteigung.',
          },
        ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
        closingNote: segmentsToRichText([
          {text: 'Bei '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ' bieten wir erfahrene, zertifizierte Guides, um ein sicheres, gut organisiertes und unvergessliches Kilimandscharo-Abenteuer zu gewährleisten.'},
        ]),
        ctaLabel: 'Kilimandscharo-Guide ansehen',
        ctaHref: d.infoTabs.guidedClimbs.ctaHref,
      },
    ],
    reviews: {
      tripAdvisor: {
        heading: 'Bewertung auf TripAdvisor abgeben',
        cardHeading: 'TripAdvisor feiert Asili Climbing Kilimanjaro',
        cardBody:
          'Mit über 779 Bewertungen und stetig wachsend, bewerten uns 95 % als „Ausgezeichnet“ und 5 % als „Sehr gut“ — ein Beweis für unser Engagement für unvergessliche Safari- und Trekking-Erlebnisse.',
        cards: [
          {
            name: 'Pastacieo',
            date: 'August 2024',
            title: 'Die Besteigung eines Lebens!',
            quote:
              'Unsere Kilimandscharo-Besteigung mit Asili Climbing Kilimanjaro war wirklich außergewöhnlich! Von Anfang bis Ende sorgte das Team für ein unvergessliches Erlebnis und machte unsere Reise zum Gipfel reibungslos, sicher und einprägsam.',
          },
          {
            name: 'Danny G',
            date: 'Sept. 2023',
            title: 'Eine außergewöhnliche Wanderung',
            quote:
              'Es überrascht nicht, dass Asili Climbing Kilimanjaro einen 5-Sterne-Ruf hat. Ihre Kompetenz, Professionalität und ihr Engagement für Kundenzufriedenheit heben sie hervor. Wenn Sie den besten Kilimandscharo-Trekking-Anbieter suchen, brauchen Sie nicht weiterzusuchen!',
          },
          {
            name: 'Christian R',
            date: 'Sept. 2024',
            title: 'Kilimandscharo-Trekking sehr zu empfehlen',
            quote:
              'Im Oktober 2023 unternahmen wir mit Asili Climbing Kilimanjaro ein sechstägiges Trekking zum Gipfel des Kilimandscharo. Das Erlebnis war phänomenal, und ich empfehle es jedem, der dieses Abenteuer in Erwägung zieht, sehr.',
          },
        ].map((card) => ({_type: 'reviewCard', _key: key(), name: card.name, date: card.date, title: card.title, quote: card.quote})),
      },
      google: {
        cardHeading: 'Google-Bewertungen loben unseren Service',
        cardBody:
          'Mit über 99 Fünf-Sterne-Bewertungen übertrifft Asili Climbing Kilimanjaro weiterhin die Erwartungen und bietet erstklassigen Service, fachkundig geführte Touren und einzigartige Abenteuer.',
      },
    },
  })
  console.log('climbingKilimanjaroPage-de created/replaced')
}

// ---------- siteSettings-de ----------

async function seedSiteSettingsDe() {
  const navGroupLabelsDe = ['Kilimandscharo & Safari', 'Kilimandscharo-Routen', 'Warum mit uns reisen']
  const navGroupLinkLabelsDe = [
    ['9 Tage Kilimandscharo & Safari', '10 Tage Kilimandscharo & Safari', '11 Tage Kilimandscharo & Safari', '12 Tage Kilimandscharo & Safari'],
    [
      '5 Tage Marangu-Route',
      '6 Tage Machame-Route',
      '6 Tage Marangu-Route',
      '6 Tage Umbwe-Route',
      '7 Tage Lemosho-Route',
      '7 Tage Machame-Route',
      '7 Tage Rongai-Route',
      '8 Tage Lemosho-Route',
      '9 Tage Northern-Circuit-Route',
    ],
    ['Safari'],
  ]
  const topLinkLabelsDe = ['Blog', 'Kontakt']

  const columnHeadingsDe = ['Besteigung', 'UNTERNEHMEN', 'HILFE', 'Schnellzugriff']
  const columnLinkLabelsDe = [
    [
      'Der Kilimandscharo',
      'Kilimandscharo-Routen',
      'Kilimandscharo-Pakete',
      'Kombipakete',
      'Kilimandscharo-Guide',
      'Packliste',
      'Gruppenabreisen',
      'Private Treks',
      'Luxustouren',
      'Sansibar-Touren',
    ],
    [
      'Über CKT',
      'Warum mit uns reisen',
      'Allgemeine Geschäftsbedingungen',
      'Bergführer',
      'Bewertungen',
      'Safari-Fahrerguide',
      'Grundwerte',
      'Safari-Fahrzeug',
      'Kontaktieren Sie uns',
    ],
    ['Kili-Reisehinweise', 'Safari-Reisehinweise', 'Zahlungsmethoden', 'Datenschutzerklärung', 'Reisetipps'],
    ['Afrika-Reisekalender', 'Unser Team', 'Kundenbewertungen', 'Unser Reiseblog', 'Auszeichnungen'],
  ]
  const legalLinkLabelsDe = ['Datenschutzerklärung', 'Allgemeine Geschäftsbedingungen', 'Cookie-Richtlinie']

  await client.createOrReplace({
    _id: 'siteSettings-de',
    _type: 'siteSettings',
    language: 'de',
    info: {
      name: siteInfo.name,
      tagline: 'Die beste Agentur für den Kilimandscharo - Asili Climbing Kilimanjaro',
      phone: siteInfo.phone,
      email: siteInfo.email,
    },
    nav: {
      groups: siteNav.groups.map((group, gi) => ({
        _type: 'navGroup',
        _key: key(),
        label: navGroupLabelsDe[gi],
        ...(group.href ? {href: group.href} : {}),
        links: group.links.map((link, li) => navLink(link, navGroupLinkLabelsDe[gi][li])),
      })),
      links: siteNav.links.map((link, i) => navLink(link, topLinkLabelsDe[i])),
    },
    footer: {
      newsletterHeading: 'Noch auf der Suche nach der perfekten Reise?',
      newsletterSubheading: 'Erhalten Sie jede Woche Inspiration direkt in Ihr Postfach!',
      columns: siteFooter.columns.map((column, ci) => ({
        _type: 'footerColumn',
        _key: key(),
        heading: columnHeadingsDe[ci],
        links: column.links.map((link, li) => navLink(link, columnLinkLabelsDe[ci][li])),
      })),
      contact: {
        phone: siteFooter.contact.phone,
        email: siteFooter.contact.email,
        address: siteFooter.contact.address,
      },
      copyright: '© Copyright 2026 Asili Climbing Kilimanjaro. Alle Rechte vorbehalten.',
      legalLinks: siteFooter.legalLinks.map((link, i) => navLink(link, legalLinkLabelsDe[i])),
    },
  })
  console.log('siteSettings-de created/replaced')
}

async function run() {
  await seedHomeDe()
  await seedClimbDe()
  await seedSiteSettingsDe()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
