/**
 * Phase 6 (Italian): seed homePage-it, climbingKilimanjaroPage-it, siteSettings-it.
 * Mirrors seed-fr-pilot.ts's structure exactly; these 3 are singletons (fixed
 * `<type>-it` id, no translation.metadata needed).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-singletons.ts --with-user-token
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

// ---------- homePage-it ----------

async function seedHomeIt() {
  const d = homeData

  const destinationsIt = [
    {
      ...d.hero.destinations[0],
      eyebrow: 'Monte Kilimangiaro',
      heading: "Il Tetto dell'Africa",
      body: 'Affronta la sfida di un trekking indimenticabile fino alla vetta della montagna indipendente più alta del mondo.',
      stats: [
        {label: 'Esperienza', value: 'Trekking in montagna'},
        {label: 'Durata', value: 'Da 6 a 9 giorni'},
        {label: 'Altitudine', value: '5.895 m'},
      ],
    },
    {
      ...d.hero.destinations[1],
      eyebrow: 'Safari in Tanzania',
      heading: 'Il Cuore Selvaggio dell\'Africa',
      body: 'Esplora il Serengeti, il cratere del Ngorongoro e Tarangire alla ricerca dei Big Five e della Grande Migrazione.',
      stats: [
        {label: 'Esperienza', value: 'Safari fotografici'},
        {label: 'Durata', value: 'Da 5 a 9 giorni'},
        {label: 'Fauna', value: 'I Big Five'},
      ],
    },
    {
      ...d.hero.destinations[2],
      eyebrow: 'Arcipelago di Zanzibar',
      heading: 'Paradiso Tropicale',
      body: "Rilassati su spiagge di sabbia bianca, immergiti tra le barriere coralline turchesi e passeggia tra i vicoli profumati di spezie della storica Stone Town.",
      stats: [
        {label: 'Esperienza', value: 'Spiaggia e cultura'},
        {label: 'Durata', value: 'Da 3 a 6 giorni'},
        {label: 'Costa', value: 'Oceano Indiano'},
      ],
    },
  ]
  const posterAltIt = [
    'Scalata del Monte Kilimangiaro',
    'Safari fotografico nel Serengeti',
    'Spiaggia di Zanzibar e oceano turchese',
  ]
  const thumbnailAltIt = [
    'Cartello della vetta Uhuru Peak, Monte Kilimangiaro',
    'Parco nazionale del Serengeti',
    'Spiaggia di Paje, Zanzibar',
  ]

  const destinations = []
  for (let i = 0; i < d.hero.destinations.length; i++) {
    const dest = d.hero.destinations[i]
    const it = destinationsIt[i]
    destinations.push({
      _type: 'heroDestination',
      _key: key(),
      key: dest.key,
      eyebrow: it.eyebrow,
      heading: it.heading,
      body: it.body,
      stats: it.stats.map((stat) => ({_type: 'heroStat', _key: key(), label: stat.label, value: stat.value})),
      mediaType: dest.media.type,
      ...(dest.media.type === 'video'
        ? {videoSrc: dest.media.src, poster: await uploadImage(client, {src: dest.media.poster.src, alt: posterAltIt[i]})}
        : {image: await uploadImage(client, dest.media.image)}),
      thumbnail: await uploadImage(client, {src: dest.thumbnail.src, alt: thumbnailAltIt[i]}),
      ctaHref: dest.ctaHref,
    })
  }

  const featuresIt = [
    {
      title: 'Di Proprietà e Gestione Locale',
      description:
        "Essendo un'azienda tanzaniana, conosciamo la terra, la gente e la montagna come nessun altro. Non scali solo con delle guide, scali con una famiglia.",
    },
    {
      title: 'Guide di Montagna Esperte',
      description:
        'Tutte le nostre guide sono certificate, esperte e formate per il trekking in alta quota. La tua sicurezza e il tuo successo sono le nostre massime priorità.',
    },
    {
      title: 'Itinerari su Misura',
      description:
        'Che tu sia un escursionista alle prime armi o un avventuriero esperto, offriamo itinerari del Kilimangiaro personalizzabili in base al tuo ritmo, ai tuoi obiettivi e al tuo programma.',
    },
  ]

  const introBodyIt: {text: string; bold?: boolean; href?: string}[][] = [
    [
      {text: 'La scalata del Monte Kilimangiaro', bold: true, href: '/climbing-mount-kilimanjaro/'},
      {text: ' non è una semplice escursione, è un\'avventura che cambia la vita. Con '},
      {text: 'Climbing Kilimanjaro Tanzania', bold: true},
      {
        text: ', ogni dettaglio viene curato con attenzione affinché il tuo viaggio sia fluido, sicuro e davvero indimenticabile durante la scalata della ',
      },
      {text: "montagna più alta d'Africa", bold: true},
      {text: '.'},
    ],
    [
      {text: 'Dal momento in cui ti accogliamo '},
      {text: 'in aeroporto', bold: true},
      {
        text: ", passando per la preparazione dell'attrezzatura e l'accompagnamento esperto lungo il sentiero, fino alla celebrazione in vetta, siamo con te in ogni fase. La maggior parte degli escursionisti sceglie il proprio ",
      },
      {text: 'itinerario del Kilimangiaro', bold: true},
      {text: " in base al tempo di acclimatamento, ai paesaggi e ai tassi di successo in vetta."},
    ],
    [
      {text: 'Che tu preferisca un '},
      {text: 'itinerario popolare', bold: true},
      {text: " o un'esperienza più tranquilla e fuori dai sentieri battuti, abbiamo il "},
      {text: 'trekking del Kilimangiaro', bold: true},
      {text: ' ideale per te. Tutti i nostri '},
      {text: 'pacchetti', bold: true},
      {
        text: ' offrono date di partenza flessibili, e i trek privati possono iniziare in qualsiasi giorno. Gli ',
      },
      {text: 'itinerari', bold: true},
      {text: ' più lunghi permettono un\'acclimatazione migliore, aumentando notevolmente le tue possibilità di raggiungere la vetta.'},
    ],
    [
      {text: 'Durante una '},
      {text: 'scalata privata', bold: true},
      {text: ', il tuo gruppo è accompagnato da un team dedicato di '},
      {text: 'guide', bold: true},
      {
        text: " professionali, portatori e un cuoco personale, con i pasti serviti in una tenda ristorante privata. Anche se i sentieri e i campeggi sono condivisi con altri escursionisti, la tua esperienza rimane comoda, personalizzata e ben assistita.",
      },
    ],
    [
      {text: 'Siamo orgogliosi di essere una delle principali aziende locali per la scalata del '},
      {text: 'Monte Kilimangiaro', bold: true},
      {text: ', impegnati a offrire esperienze di vetta sicure, memorabili e gratificanti.'},
    ],
  ]

  const introFeaturesIt = [
    {
      title: 'Un Team Locale Accogliente',
      description: 'Nati e cresciuti all\'ombra del Kilimangiaro, conosciamo la montagna come la nostra stessa famiglia.',
    },
    {
      title: 'Un Trekking Sicuro e a Ritmo Adeguato',
      description:
        'Procediamo « pole pole » (piano piano). Scalate accuratamente guidate, controlli di comfort e assistenza completa.',
    },
    {
      title: 'Un Legame Autentico, non Solo un Tour',
      description:
        'Tornerai a casa con molto più delle foto in vetta — con legami duraturi e una storia da raccontare.',
    },
  ]

  const routeGuideItemsIt = [
    {name: 'Lemosho / Shira (7-9 giorni):', detail: "Offre un'ottima acclimatazione, paesaggi magnifici e ottime possibilità di raggiungere la vetta."},
    {name: 'Machame (6-8 giorni):', detail: 'Molto popolare e pittoresca; spesso soprannominata la « Whiskey Route ».'},
    {name: 'Rongai (6-7 giorni):', detail: 'Un itinerario più tranquillo e più secco, ideale durante la stagione delle piogge.'},
    {name: 'Marangu (5-6 giorni):', detail: "L'itinerario più breve, noto per il suo percorso semplice e per l'alloggio in rifugi."},
  ]

  const kiliCardTitlesIt = [
    'Route Machame 9 Giorni – Circuiti in Piccolo Gruppo',
    'Trekking del Monte Kilimangiaro – Route Machame 6 Giorni',
    'Trekking del Monte Kilimangiaro – Route Lemosho 8 Giorni',
    'Trekking del Monte Kilimangiaro – Route Machame 7 Giorni',
    'Trekking del Monte Kilimangiaro – Route Marangu 6 Giorni',
    'Trekking del Monte Kilimangiaro – Route Rongai 6 Giorni',
  ]
  const kiliCardTourTypeIt = ['Piccolo gruppo / Base', 'Privato • Base', 'Privato • Base', 'Privato • Base', 'Privato • Base', 'Privato • Base']
  const kiliCardLocationIt = [
    'Arusha › Machame › Kilimangiaro',
    'Arusha › Kilimangiaro',
    'Arusha › Kilimangiaro',
    'Arusha › Kilimangiaro',
    'Arusha › Kilimangiaro',
    'Arusha › Kilimangiaro',
  ]

  const safariCardTitlesIt = [
    'Safari della Migrazione sul Fiume Mara - 07 Giorni',
    'Safari Simba - 05 Giorni',
    'Tanzania Classica - 07 Giorni',
    'Esperienza Comfort Tanzania - 07 Giorni',
    'Esperienza Safari Glamping Tanzania - 05 Giorni',
    'Safari della Migrazione degli Gnu - 09 Giorni',
  ]
  const safariCardTourTypeIt = ['Privato • Comfort', 'Privato • Comfort', 'Privato • Comfort', 'Privato • Comfort', 'Privato • Comfort', 'Privato • Comfort Plus']
  const safariCardLocationIt = [
    'Arusha › Serengeti Centrale › Cratere del Ngorongoro',
    'Parco Nazionale del Serengeti › Ngorongoro › Cratere del Ngorongoro',
    'Arusha › Lago Manyara › Serengeti › Serengeti Centrale › Ngorongoro',
    'Arusha › Parco Nazionale di Tarangire › Serengeti › Ngorongoro',
    'Arusha › Parco Nazionale di Tarangire › Serengeti › Ngorongoro',
    'Arusha › Lago Manyara › Serengeti › Ngorongoro › Tarangire',
  ]

  const zanzibarCardTitlesIt = [
    'Zanzibar Oceano Indiano - 06 Giorni',
    'Oceano Indiano di Zanzibar - 06 Giorni',
    "L'Isola di Zanzibar in Tanzania - 05 Giorni",
    'Una Luna di Miele a Zanzibar - 06 Giorni',
    "Scoprire l'Isola di Zanzibar - 03 Giorni",
    "Scoprire l'Oceano Indiano - 06 Giorni",
  ]
  const zanzibarCardTourTypeIt = ['Privato • Lusso', 'Privato • Comfort', 'Privato • Lusso', 'Privato • Base', 'Privato • Base', 'Privato • Base']
  const zanzibarCardLocationIt = [
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Aeroporto Internazionale Abeid Amani Karume › Zanzibar › Stone Town Zanzibar',
    'Zanzibar › Stone Town Zanzibar',
  ]

  const routeOptionsIt = [
    {
      title: 'Route Marangu 5 Giorni',
      summary: "Un viaggio di cinque giorni per scalare la vetta più alta d'Africa attraverso la celebre Route Marangu. Aspettati una varietà di paesaggi…",
      duration: '5 giorni / 4 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $2.008 a persona', '2 escursionisti in condivisione - $1.783 a persona', 'Da 3 a 4 escursionisti in condivisione - $1.678 a persona'],
    },
    {
      title: 'Route Marangu 6 Giorni',
      summary: "Un viaggio di sei giorni per scalare la vetta più alta d'Africa attraverso la celebre Route Marangu. Aspettati una varietà di paesaggi…",
      duration: '6 giorni / 5 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $2.308 a persona', '2 escursionisti in condivisione - $1.928 a persona', 'Da 3 a 4 escursionisti in condivisione - $1.678 a persona'],
    },
    {
      title: 'Route Machame o Umbwe 6 Giorni',
      summary: 'La Route Umbwe è rinomata per la sua ascensione impegnativa e ripida e per il suo splendido sentiero meno frequentato.',
      duration: '6 giorni / 5 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $2.308 a persona', '2 escursionisti in condivisione - $2.058 a persona', 'Da 3 a 4 escursionisti in condivisione - $2.058 a persona'],
    },
    {
      title: 'Route Machame o Umbwe 7 Giorni',
      summary: "Percorri la celebre Route Machame, in un viaggio di sette giorni in totale, che ti offre così ancora più tempo per l'acclimatazione",
      duration: '7 giorni / 6 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $2.608 a persona', '2 escursionisti in condivisione - $2.608 a persona', 'Da 3 a 4 escursionisti in condivisione - $2.348 a persona'],
    },
    {
      title: '6 giorni / 5 notti di trekking + 2 notti in hotel',
      summary: "Un viaggio di sei giorni per scalare la vetta più alta d'Africa attraverso la celebre Route Marangu. Aspettati una varietà di paesaggi…",
      duration: '6 giorni / 5 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $2.648 a persona', '2 escursionisti in condivisione - $2.648 a persona', 'Da 3 a 4 escursionisti in condivisione - $2.063 a persona'],
    },
    {
      title: 'Route Shira, Lemosho o Rongai 7 Giorni',
      summary: 'Affrontata da nord, questa route offre una prospettiva unica del Kilimangiaro ed è perfetta per chi…',
      duration: '7 giorni / 6 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $2.938 a persona', '2 escursionisti in condivisione - $2.938 a persona', 'Da 3 a 4 escursionisti in condivisione - $2.313 a persona'],
    },
    {
      title: 'Route Shira, Lemosho o Rongai 8 Giorni',
      summary: 'Affrontata da nord, questa route offre una prospettiva unica del Kilimangiaro ed è perfetta per chi…',
      duration: '8 giorni / 7 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $3.228 a persona', '2 escursionisti in condivisione - $2.773 a persona', 'Da 3 a 4 escursionisti in condivisione - $2.568 a persona'],
    },
    {
      title: '8 giorni / 7 notti di trekking + 2 notti in hotel',
      summary: "Percorri la celebre Route Machame, in un viaggio di sette giorni in totale, che ti offre così ancora più tempo per l'acclimatazione",
      duration: '8 giorni / 7 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $3.588 a persona', '2 escursionisti in condivisione - $2.938 a persona', 'Da 3 a 4 escursionisti in condivisione - $2.938 a persona'],
    },
    {
      title: 'Route Northern Circuit 9 Giorni, Noleggio Toilette Incluso',
      summary: "L'itinerario più recente e più lungo, che offre viste a 360 gradi e i migliori tassi di successo per raggiungere la vetta.",
      duration: '9 giorni / 8 notti di trekking + 2 notti in hotel',
      prices: ['1 escursionista da solo - $3.918 a persona', '2 escursionisti in condivisione - $3.228 a persona', 'Da 3 a 4 escursionisti in condivisione - $3.228 a persona'],
    },
  ]

  const whyUsCardsIt = [
    {
      title: '100% Proprietà Locale',
      description:
        "Non siamo un operatore turistico straniero — siamo nati e cresciuti a Moshi, all'ombra del Kilimangiaro. Quando scali con Asili, sostieni direttamente famiglie e comunità locali, e vivi la montagna attraverso gli occhi di chi la conosce meglio.",
    },
    {
      title: 'I Più Alti Standard di Sicurezza',
      description:
        'Trasportiamo ossigeno di emergenza, pulsossimetri, ed effettuiamo controlli sanitari due volte al giorno. Le nostre guide sono formate per individuare e gestire tempestivamente il mal di montagna. La tua sicurezza è la nostra priorità — sempre.',
    },
    {
      title: 'Scalate Private, Date Flessibili e Opzioni Personalizzate',
      description:
        'Vuoi scalare da solo, in coppia o con un piccolo gruppo di amici? Offriamo partenze private adattate al tuo programma. Il tuo ritmo. Il tuo percorso. Il tuo Kilimangiaro.',
    },
    {
      title: 'Tassi di Successo in Vetta Comprovati',
      description:
        "Grazie al nostro approccio incentrato sull'acclimatazione, a un ritmo adeguato e a personale esperto, registriamo un tasso di successo in vetta superiore al 95% sui nostri itinerari più lunghi. Quando ci affidi il tuo sogno, facciamo di tutto per aiutarti a realizzarlo.",
    },
    {
      title: 'Trasferimento Aeroportuale, Prenotazione Hotel e Assistenza Completa',
      description:
        "Dal momento dell'atterraggio all'aeroporto del Kilimangiaro fino al tuo arrivo a Uhuru Peak, siamo al tuo fianco. Trasferimenti aeroportuali, controllo dell'attrezzatura, prenotazioni alberghiere e assistenza logistica — tutto questo fa parte dell'esperienza Asili.",
    },
    {
      title: 'Trekking Equi ed Etici',
      description:
        "Orgogliosi sostenitori del Kilimanjaro Porters Assistance Project (KPAP), ci assicuriamo che ogni portatore sia pagato equamente, adeguatamente nutrito e dotato di attrezzatura di qualità. Quando scali con Asili, scali con integrità.",
    },
  ]

  const comboTilesIt = [
    {title: 'Kilimangiaro e Safari Fauna Selvatica', subtitle: '12 giorni in Tanzania'},
    {title: 'Kilimangiaro e Safari Fauna Selvatica', subtitle: '10 giorni in Tanzania'},
    {title: 'Kilimangiaro, Serengeti e Ngorongoro', subtitle: '12 giorni in Tanzania'},
    {title: 'Kilimangiaro, Tarangire e Lago Manyara', subtitle: '10 giorni di scalata del Kili e safari fauna selvatica'},
  ]

  const testimonialsIt = [
    {
      timeAgo: '9 mesi fa',
      quote:
        'Questa azienda ha realizzato il mio sogno di scalare il Kilimangiaro! Un accompagnamento eccellente, pasti deliziosi in montagna, e un…',
    },
    {
      timeAgo: '9 mesi fa',
      quote:
        "Altamente consigliato per chiunque stia pianificando di scalare la montagna più alta d'Africa. Il team è stato molto solidale, il cibo…",
    },
  ]

  const faqQ = {
    q1: 'Quanto tempo ci vuole per scalare il Monte Kilimangiaro?',
    a1: 'La durata dipende dall\'itinerario scelto. La maggior parte delle scalate del Kilimangiaro dura tra 6 e 9 giorni. Gli itinerari più lunghi offrono più tempo per l\'acclimatazione, il che aumenta le tue possibilità di raggiungere la vetta con successo.',
    q2: 'Ho bisogno di esperienza di arrampicata precedente?',
    a2: 'Non è richiesta alcuna esperienza tecnica di arrampicata precedente. Tuttavia, una buona forma fisica e una preparazione mentale sono essenziali, poiché il Kilimangiaro è un trekking in alta quota, non un\'arrampicata tecnica.',
    q3: 'Qual è il periodo migliore per scalare il Kilimangiaro?',
    a3: 'I mesi migliori per la scalata sono da gennaio a marzo e da giugno a ottobre, quando il tempo è generalmente secco e la visibilità è ottima.',
    q4: 'Che tipo di alloggio è previsto durante la scalata?',
    a4: 'L\'alloggio varia in base all\'itinerario. La maggior parte degli itinerari prevede comode tende da montagna, mentre la Route Marangu offre alloggio in rifugi lungo il sentiero.',
    q5: 'Cosa devo portare per la scalata?',
    a5: 'Avrai bisogno di buone scarpe da trekking, abbigliamento caldo, un sacco a pelo, attrezzatura impermeabile ed effetti personali essenziali. Ti forniremo un elenco dettagliato per aiutarti a preparare il tuo viaggio.',
    q6: 'Il mal di montagna è frequente sul Kilimangiaro?',
    a6: 'Sì, il mal di montagna può colpire chiunque, indipendentemente dal livello di forma fisica. Le nostre guide sono formate per monitorare attentamente la tua salute e garantire una scalata sicura e progressiva per una migliore acclimatazione.',
    q7: 'Perché prenotare con Climbing Kilimanjaro Tanzania?',
    a7: 'Siamo un operatore turistico locale ed esperto, con guide di montagna professionali, attrezzatura di alta qualità e un servizio personalizzato per garantire una scalata sicura, piacevole e memorabile.',
  }
  const faqItem = (q: string, a: string) => ({_type: 'faqItem', _key: key(), question: q, answer: a})

  await client.createOrReplace({
    _id: 'homePage-it',
    _type: 'homePage',
    language: 'it',
    hero: {
      exploreLabel: 'Esplora',
      primaryCtaLabel: 'Vedi i Pacchetti',
      secondaryCtaLabel: 'Personalizza il Viaggio',
      secondaryCtaHref: d.hero.secondaryCtaHref,
      destinations,
    },
    features: featuresIt.map((item) => ({_type: 'featureItem', _key: key(), title: item.title, description: item.description})),
    intro: {
      heading: "Dall'arrivo alla vetta — ci pensiamo noi a tutto.",
      body: segmentParagraphsToPt(introBodyIt),
      ctaLabel: 'Scopri di Più su di Noi',
      ctaHref: d.intro.ctaHref,
      image: await uploadImage(client, {src: d.intro.image.src, alt: 'Escursionista sul Monte Kilimangiaro'}),
    },
    introFeatures: introFeaturesIt.map((item) => ({_type: 'introFeature', _key: key(), title: item.title, description: item.description})),
    routeGuide: {
      eyebrow: 'Scegli il tuo itinerario. Scala a modo tuo. Guida completa su tariffe e consigli di prenotazione con guide locali',
      heading: 'Guida alle Avventure in Tanzania: safari, Kilimangiaro e vacanze a Zanzibar',
      items: routeGuideItemsIt.map((item) => ({_type: 'routeGuideItem', _key: key(), name: item.name, detail: item.detail})),
    },
    kilimanjaroPackages: {
      heading: 'Pacchetti Tour Kilimangiaro',
      viewAllHref: d.kilimanjaroPackages.viewAllHref,
      cards: await Promise.all(
        d.kilimanjaroPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: kiliCardTitlesIt[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: kiliCardTourTypeIt[i],
          tourId: card.tourId,
          price: card.price,
          location: kiliCardLocationIt[i],
        })),
      ),
    },
    safariPackages: {
      heading: 'Pacchetti Safari e Tour',
      viewAllHref: d.safariPackages.viewAllHref,
      cards: await Promise.all(
        d.safariPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: safariCardTitlesIt[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: safariCardTourTypeIt[i],
          tourId: card.tourId,
          price: card.price,
          location: safariCardLocationIt[i],
        })),
      ),
    },
    zanzibarPackages: {
      heading: 'Pacchetti Tour Zanzibar',
      viewAllHref: d.zanzibarPackages.viewAllHref,
      cards: await Promise.all(
        d.zanzibarPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: zanzibarCardTitlesIt[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: zanzibarCardTourTypeIt[i],
          tourId: card.tourId,
          price: card.price,
          location: zanzibarCardLocationIt[i],
        })),
      ),
    },
    routeOptions: {
      heading: 'Scegli il tuo Itinerario: confronta tutti i pacchetti e gli itinerari del Kilimangiaro con una guida locale',
      cards: await Promise.all(
        d.routeOptions.cards.map(async (card, i) => ({
          _type: 'routeOptionCard',
          _key: key(),
          title: routeOptionsIt[i].title,
          href: card.href,
          image: await uploadImage(client, card.image),
          summary: routeOptionsIt[i].summary,
          duration: routeOptionsIt[i].duration,
          prices: routeOptionsIt[i].prices,
        })),
      ),
    },
    notSureBand: {
      heading: 'Non sai quale itinerario fa per te?',
      body: 'Offriamo una gamma di itinerari del Kilimangiaro adatti alla tua condizione fisica, al tuo programma e al tuo stile di trekking. Che tu stia cercando paesaggi splendidi, meno affollamento o il miglior tasso di successo, ti aiuteremo a scegliere il percorso ideale verso la vetta.',
      ctaLabel: 'Chiama Ora',
      ctaHref: d.notSureBand.ctaHref,
    },
    whyUs: {
      heading: 'Perché Scalare il Kilimangiaro con Noi?',
      body: 'Scegliere il team giusto può fare la differenza tra una semplice escursione e un\'avventura che cambia la vita.',
      cards: whyUsCardsIt.map((card, i) => ({
        _type: 'whyUsCard',
        _key: key(),
        title: card.title,
        description: card.description,
        icon: d.whyUs.cards[i].icon,
      })),
    },
    comboExperience: {
      heading: 'Esperienza Scalata del Kilimangiaro e Safari',
      body: "Rendi la tua avventura tanzaniana davvero indimenticabile: scala il maestoso Monte Kilimangiaro, poi esplora i parchi safari più iconici d'Africa. Con Asili, la tua scalata e il tuo safari si susseguono perfettamente, guidati da esperti locali che conoscono ogni sentiero, ogni paesaggio e ogni momento che merita di essere vissuto.",
      cardTitle: 'Scala più in alto. Esplora più selvaggio. Vivi un viaggio indimenticabile',
      cardBody:
        "Raggiungi la vetta della montagna indipendente più alta del mondo, poi immergiti nella natura selvaggia mozzafiato della Tanzania. Con i nostri pacchetti Kilimangiaro + Safari, goditi il mix perfetto di avventura: conquistare il Kilimangiaro, poi scoprire le meraviglie del Serengeti, del cratere del Ngorongoro e del parco nazionale di Tarangire.",
      ctaLabel: 'Iniziamo a Pianificare',
      ctaHref: d.comboExperience.ctaHref,
      tiles: await Promise.all(
        d.comboExperience.tiles.map(async (tile, i) => ({
          _type: 'comboTile',
          _key: key(),
          title: comboTilesIt[i].title,
          subtitle: comboTilesIt[i].subtitle,
          href: tile.href,
          image: await uploadImage(client, tile.image),
        })),
      ),
      body2:
        "Raggiungi la vetta della montagna indipendente più alta del mondo, poi immergiti nella natura selvaggia mozzafiato della Tanzania. Con i nostri pacchetti Kilimangiaro + Safari, goditi il mix perfetto di avventura: conquistare il Kilimangiaro, poi scoprire le meraviglie del Serengeti, del cratere del Ngorongoro e del parco nazionale di Tarangire.",
      viewToursLabel: 'Vedi Altri Tour',
      viewToursHref: d.comboExperience.viewToursHref,
    },
    testimonials: {
      heading: 'Cosa Dicono i Nostri Scalatori Soddisfatti',
      items: d.testimonials.items.map((item, i) => ({
        _type: 'testimonial',
        _key: key(),
        name: item.name,
        timeAgo: testimonialsIt[i].timeAgo,
        rating: item.rating,
        quote: testimonialsIt[i].quote,
      })),
    },
    faq: {
      heading: 'Domande Frequenti',
      tabs: [
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Tutte le Domande',
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
          label: 'Periodo per Scalare il Kilimangiaro',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q3, faqQ.a3)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Alloggio',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q6, faqQ.a6), faqItem(faqQ.q7, faqQ.a7)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Prenotazione',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2)],
        },
      ],
    },
  })
  console.log('homePage-it created/replaced')
}

// ---------- climbingKilimanjaroPage-it ----------

async function seedClimbIt() {
  const d = climbingKilimanjaroPageData

  await client.createOrReplace({
    _id: 'climbingKilimanjaroPage-it',
    _type: 'climbingKilimanjaroPage',
    language: 'it',
    trustBadges: {
      heading: 'Pacchetti di Scalata del Kilimangiaro',
      badges: [
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Scelta Migliore su TripAdvisor',
          description:
            "Con centinaia di recensioni eccellenti, il nostro impegno verso la qualità e la soddisfazione del cliente ci distingue tra gli operatori turistici del Kilimangiaro.",
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Affidabili ed Esperti',
          description:
            "Le nostre guide altamente qualificate garantiscono una scalata ben assistita, dando priorità alla sicurezza, a un trekking etico e a un percorso agevole verso la vetta.",
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Con Sede in Tanzania',
          description:
            "Organizziamo esperienze di trekking personalizzate al Kilimangiaro, dalle scalate economiche alle spedizioni di lusso, tutte basate su pratiche di scalata responsabili ed etiche.",
        },
      ],
    },
    challengeBand: {
      heading: 'Pronto ad Affrontare la Sfida del Kilimangiaro?',
      body: 'Il tuo viaggio verso il Tetto dell\'Africa inizia qui. Che tu stia cercando l\'avventura di una vita o voglia spingerti oltre i tuoi limiti fino alla vetta, siamo qui per guidarti in ogni fase.',
      backgroundImage: await uploadImage(client, d.challengeBand.backgroundImage),
      primaryCtaLabel: 'Sfida della Vetta',
      secondaryCtaLabel: 'Inizia la Scalata',
    },
    routeSelector: {
      heading: 'Itinerari e Mappe di Scalata del Kilimangiaro',
      tabs: await Promise.all([
        {
          name: 'Route Machame',
          body: "Conosciuta come Whiskey Route, Machame è l'itinerario più popolare del Kilimangiaro, che offre paesaggi mozzafiato e un terreno vario. Sebbene impegnativa, con sentieri ripidi e campeggi in tenda, offre un'ottima acclimatazione per gli scalatori in cerca di un trek più breve ma gratificante.",
          map: d.routeSelector.tabs[0].map,
        },
        {
          name: 'Route Lemosho',
          body: "Uno degli itinerari più pittoreschi del Kilimangiaro, Lemosho inizia all'isolata Londorossi Gate e attraversa il magnifico plateau dello Shira. In definitiva, esiste un itinerario per tutti coloro che desiderano vivere l'avventura della scalata del Kilimangiaro.",
          map: d.routeSelector.tabs[1].map,
        },
        {
          name: 'Route Rongai',
          body: 'Unico itinerario settentrionale del Kilimangiaro, Rongai è meno frequentato e più dolce, il che lo rende una scelta eccellente per chi preferisce una scalata calma e regolare. Questo itinerario è ideale durante la stagione delle piogge poiché riceve meno precipitazioni e offre un trekking piacevole attraverso una natura selvaggia incontaminata.',
          map: d.routeSelector.tabs[2].map,
        },
        {
          name: 'Route Northern Circuit',
          body: "L'itinerario più lungo e più pittoresco, il Northern Circuit offre la migliore acclimatazione girando progressivamente attorno al Kilimangiaro. Con viste panoramiche e un alto tasso di successo, questo itinerario offre un'esperienza di trekking tranquilla e immersiva.",
          map: d.routeSelector.tabs[3].map,
        },
      ].map(async (tab) => ({_type: 'routeTab', _key: key(), name: tab.name, body: tab.body, map: await uploadImage(client, tab.map)}))),
    },
    conquerBand: {
      heading: "Conquista il Kilimangiaro. Vivi l'Avventura.",
      body: "Spingi oltre i tuoi limiti e mettiti in piedi sul punto più alto d'Africa. Affronta la sfida del Kilimangiaro e trasforma il tuo sogno in realtà!",
      backgroundImage: await uploadImage(client, d.conquerBand.backgroundImage),
      primaryCtaLabel: "Domina l'Africa",
      secondaryCtaLabel: 'Inizia la Tua Scalata',
      primaryCtaHref: d.conquerBand.primaryCtaHref,
      secondaryCtaHref: d.conquerBand.secondaryCtaHref,
    },
    promoStrip: {
      heading: "Conquista il Kilimangiaro. Vivi l'Avventura.",
      cards: await Promise.all([
        {
          title: '📖 Consulta la Nostra Guida al Kilimangiaro',
          body: 'Ottieni tutte le informazioni essenziali per preparare la tua scalata. La nostra guida copre tutto, dagli itinerari ai consigli di sicurezza, per una scalata fluida e di successo.',
          linkLabel: 'Continua a Leggere',
          href: d.promoStrip.cards[0].href,
          backgroundImage: d.promoStrip.cards[0].backgroundImage,
        },
        {
          title: '🎯 Consigli di Esperti per la Tua Scalata',
          body: 'Sebbene il Kilimangiaro accolga scalatori di tutti i livelli, è essenziale fare trekking con prudenza. Le nostre guide esperte monitorano la tua salute e ti offrono un supporto completo per un viaggio sicuro e piacevole.',
          linkLabel: 'Continua a Leggere',
          href: d.promoStrip.cards[1].href,
          backgroundImage: d.promoStrip.cards[1].backgroundImage,
        },
        {
          title: "🎒 La Tua Lista dell'Equipaggiamento per il Kilimangiaro",
          body: "Preparati al meglio grazie alla nostra lista completa dell'equipaggiamento, che dettaglia tutto il materiale essenziale di cui avrai bisogno per una scalata confortevole e di successo.",
          linkLabel: "Vedi la Lista dell'Equipaggiamento",
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
        label: 'Scelta degli Itinerari',
        heading: 'Quali Itinerari sono Disponibili per il Kilimangiaro?',
        intro: segmentParagraphsToPt([
          [
            {
              text: 'Il Monte Kilimangiaro offre diversi itinerari adatti a scalatori di ogni livello, preferenza e stile di trekking. Ogni itinerario offre un\'esperienza unica, che va da un ritmo rilassato a un\'avventura più impegnativa, con sistemazioni che vanno dal campeggio a strutture più confortevoli.',
            },
          ],
          [
            {text: 'Da '},
            {text: 'Asili Explorer African Safaris,', bold: true},
            {text: ' siamo specializzati nei quattro itinerari più popolari del Kilimangiaro: '},
            {text: 'Rongai Route, Lemosho Route, Northern Circuit Route e Machame Route.', bold: true},
            {text: ' Le nostre scalate guidate garantiscono sicurezza, un\'acclimatazione adeguata e un viaggio indimenticabile fino alla vetta.'},
          ],
        ]),
        faqCards: [
          {
            question: "Qual è l'itinerario del Kilimangiaro meno frequentato?",
            answer: [
              {text: 'La '},
              {text: 'Northern Circuit Route', accent: true},
              {text: " è la meno frequentata, offrendo un'esperienza di trekking tranquilla e isolata."},
            ],
          },
          {
            question: "Qual è l'itinerario più facile per scalare il Kilimangiaro?",
            answer: [
              {text: 'La '},
              {text: 'Rongai Route', accent: true},
              {text: ' è considerata la più facile grazie ai suoi pendii progressivi e alla sua ascesa diretta.'},
            ],
          },
          {
            question: "Qual è l'itinerario del Kilimangiaro più pittoresco?",
            answer: [
              {text: 'La '},
              {text: 'Lemosho Route', accent: true},
              {text: ' è spesso considerata la più pittoresca, con paesaggi mozzafiato, ecosistemi vari e viste panoramiche.'},
            ],
          },
        ].map((card) => ({_type: 'richFaqCard', _key: key(), question: card.question, answer: segmentsToRichText(card.answer)})),
        closingNote: segmentsToRichText([
          {text: 'In definitiva, esiste un itinerario per tutti coloro che desiderano vivere l\'avventura della '},
          {text: 'scalata del Kilimangiaro.', bold: true},
        ]),
      },
      {
        _type: 'routesComparisonTab',
        _key: key(),
        label: 'Confronto tra gli Itinerari',
        heading: 'Come si Confrontano gli Itinerari del Kilimangiaro?',
        table: {
          _type: 'dataTable',
          columns: ["Nome dell'itinerario", 'Livello di difficoltà', 'Lunghezza (km)', 'Durata (giorni)', 'Affluenza', 'Prezzo (USD)', 'Tasso di successo (%)'],
          rows: [{_type: 'tableRow', _key: key(), cells: ['Northern Circuit', 'Da moderato a difficile', '90', '9-10', 'Bassa', '$2.500–3.500', '95']}],
        },
        noteLabel: 'NOTA:',
        noteBody:
          "I prezzi e i tassi di successo sono approssimativi e possono variare in base a fattori come la dimensione del gruppo, l'acclimatazione e le condizioni meteorologiche.",
      },
      {
        _type: 'bestTimeTab',
        _key: key(),
        label: 'Periodo Migliore per Scalare',
        heading: 'Quando Dovresti Scalare il Kilimangiaro?',
        intro: segmentParagraphsToPt([
          [
            {text: 'Il periodo migliore per scalare il Kilimangiaro va da '},
            {text: 'giugno a marzo', accent: true},
            {text: ". Tuttavia, a causa dell'evoluzione delle condizioni meteorologiche, le condizioni possono variare."},
          ],
          [
            {
              text: "Durante questo periodo, il tempo è generalmente più secco e stabile, offrendo un cielo più limpido e migliori condizioni di scalata. Questo riduce i rischi di pioggia, neve e scarsa visibilità, migliorando sia la sicurezza che il piacere del viaggio.",
            },
          ],
        ]),
        cards: [
          {
            title: 'Considerazioni sulla Temperatura:',
            bullets: [
              [
                {text: 'Le temperature diurne variano da '},
                {text: '20°C a 27°C', accent: true},
                {text: ' a bassa quota, ma scendono sotto lo zero ad alta quota, soprattutto di notte.'},
              ],
              [
                {text: "L'abbigliamento a strati", accent: true},
                {text: ' è essenziale per adattarsi alle variazioni di temperatura durante tutta la scalata.'},
              ],
            ],
          },
          {
            title: 'Vegetazione e Paesaggi:',
            bullets: [
              [{text: 'Le stagioni secche offrono viste più limpide, fiori selvatici in fiore e foreste lussureggianti lungo i sentieri.'}],
              [{text: 'Le stagioni più umide possono comportare condizioni nebbiose e una fitta copertura nuvolosa.'}],
            ],
          },
          {
            title: 'Livelli di Affluenza:',
            bullets: [
              [
                {text: 'Le alte stagioni', accent: true},
                {text: ' (gennaio-febbraio e luglio-settembre) attirano più scalatori.'},
              ],
              [
                {text: 'Le stagioni intermedie', accent: true},
                {text: ' (fine marzo-maggio e novembre-inizio dicembre) offrono esperienze più tranquille.'},
              ],
            ],
          },
          {
            title: 'Preferenze Personali e Obiettivi:',
            bullets: [
              [
                {
                  text: 'Gli scalatori dovrebbero considerare le condizioni meteorologiche, le proprie preferenze di temperatura, il livello di affluenza e il proprio programma personale quando pianificano la scalata.',
                },
              ],
              [{text: 'Anche le opportunità di osservare la fauna selvatica e le preferenze paesaggistiche possono influenzare la decisione.'}],
            ],
          },
        ].map((card) => ({
          _type: 'bestTimeCard',
          _key: key(),
          title: card.title,
          bullets: card.bullets.map((bullet) => ({_type: 'bulletItem', _key: key(), body: segmentsToRichText(bullet)})),
        })),
        closingNote: segmentsToRichText([
          {text: 'Per un consiglio personalizzato sul periodo migliore in base ai tuoi obiettivi, consulta le nostre guide esperte del Kilimangiaro presso '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: '.'},
        ]),
      },
      {
        _type: 'climbCostTab',
        _key: key(),
        label: 'Costo della Scalata',
        heading: 'Quanto Costa Scalare il Kilimangiaro?',
        intro: segmentsToRichText([
          {text: 'Il costo della scalata del Kilimangiaro varia da '},
          {text: '2.500 $ a 4.000 $', accent: true},
          {text: ', a seconda di:'},
        ]),
        items: [
          "La scelta dell'itinerario",
          'La durata della scalata',
          'La dimensione del gruppo',
          'Il livello di servizio (Classico o Premium)',
          'Cosa è incluso o escluso dal pacchetto',
        ],
        closingNote: segmentsToRichText([
          {text: 'Sebbene il budget sia importante, '},
          {text: 'la sicurezza e la qualità', bold: true},
          {text: ' devono essere le priorità assolute nella scelta di un operatore di scalate. Presso '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ", garantiamo guide ben formate, standard di sicurezza elevati e un'esperienza complessiva eccezionale."},
        ]),
      },
      {
        _type: 'climbingInsightsTab',
        _key: key(),
        label: 'Consigli per la Scalata',
        heading: 'Consigli Importanti per una Scalata di Successo',
        intro: segmentsToRichText([
          {text: 'Raggiungere la vetta della montagna indipendente più alta del mondo non è cosa da poco. '},
          {text: 'Una buona preparazione è essenziale.', bold: true},
          {text: ' Ecco alcuni consigli chiave:'},
        ]),
        tips: [
          {label: 'Vai Piano:', description: 'Un ritmo costante riduce il rischio di mal di montagna ed esaurimento.'},
          {label: 'Idratati:', description: "Bevi molta acqua per favorire l'acclimatazione."},
          {
            label: "Procurati l'Attrezzatura Giusta:",
            description: 'Investi in strati di abbigliamento adeguati, scarpe da trekking robuste e attrezzatura di qualità.',
          },
          {
            label: 'Preparati Fisicamente e Mentalmente:',
            description: "Il cardio e l'allenamento della forza rafforzeranno la tua resistenza, mentre la determinazione mentale ti permetterà di resistere.",
          },
          {label: 'Divertiti e Crea Legami:', description: 'Creare legami con gli altri scalatori rende il viaggio più arricchente.'},
        ].map((tip) => ({_type: 'tip', _key: key(), label: tip.label, description: tip.description})),
        closingNote:
          'Seguendo questi consigli, massimizzerai le tue possibilità di raggiungere la vetta godendoti ogni fase della scalata.',
      },
      {
        _type: 'guidedClimbsTab',
        _key: key(),
        label: 'Scalate Guidate',
        heading: 'Hai Bisogno di una Guida per Scalare il Kilimangiaro?',
        intro: segmentsToRichText([
          {text: "Sì! La scalata del Kilimangiaro senza una guida autorizzata non è "},
          {text: 'consentita.', bold: true},
        ]),
        faqs: [
          {
            question: 'Perché ho bisogno di una guida?',
            answer:
              "Le guide apportano la loro competenza, monitorano la tua salute, garantiscono la tua sicurezza e ti aiutano a orientarti nel terreno impegnativo del Kilimangiaro.",
          },
          {
            question: 'Gli scalatori esperti possono fare a meno di una guida?',
            answer:
              "Anche gli scalatori esperti devono essere accompagnati da una guida. L'alta quota e le condizioni imprevedibili rendono indispensabile un accompagnamento professionale.",
          },
          {
            question: 'In che modo le guide migliorano la sicurezza?',
            answer:
              "Le guide monitorano l'acclimatazione, forniscono primo soccorso, valutano le condizioni meteorologiche e prendono decisioni critiche per il successo della scalata.",
          },
        ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
        closingNote: segmentsToRichText([
          {text: 'Presso '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ", offriamo guide esperte e certificate per garantire un'avventura al Kilimangiaro sicura, ben organizzata e memorabile."},
        ]),
        ctaLabel: 'Vedi la Guida al Kilimangiaro',
        ctaHref: d.infoTabs.guidedClimbs.ctaHref,
      },
    ],
    reviews: {
      tripAdvisor: {
        heading: 'Lascia una Recensione su TripAdvisor',
        cardHeading: 'TripAdvisor Celebra Asili Climbing Kilimanjaro',
        cardBody:
          'Con oltre 779 recensioni e in continuo aumento, il 95% ci valuta Eccellente e il 5% Molto Buono, a testimonianza del nostro impegno nell\'offrire esperienze di safari e trekking indimenticabili.',
        cards: [
          {
            name: 'Pastacieo',
            date: 'Agosto 2024',
            title: 'La Scalata di una Vita!',
            quote:
              "La nostra scalata del Kilimangiaro con Asili Climbing Kilimanjaro è stata davvero straordinaria! Dall'inizio alla fine, il team ha garantito un'esperienza indimenticabile, rendendo il nostro viaggio verso la vetta fluido, sicuro e memorabile.",
          },
          {
            name: 'Danny G',
            date: 'Set. 2023',
            title: "Un'Escursione Fuori dal Comune",
            quote:
              "Non sorprende che Asili Climbing Kilimanjaro mantenga una reputazione a 5 stelle. La loro competenza, professionalità e impegno verso la soddisfazione del cliente li distinguono. Se cerchi la migliore agenzia di trekking al Kilimangiaro, non cercare oltre!",
          },
          {
            name: 'Christian R',
            date: 'Set. 2024',
            title: 'Trekking del Kilimangiaro Vivamente Consigliato',
            quote:
              "Nell'ottobre 2023, abbiamo effettuato un trekking di sei giorni fino alla vetta del Kilimangiaro con Asili Climbing Kilimanjaro. L'esperienza è stata fenomenale, e lo consiglio vivamente a chiunque stia considerando questa avventura.",
          },
        ].map((card) => ({_type: 'reviewCard', _key: key(), name: card.name, date: card.date, title: card.title, quote: card.quote})),
      },
      google: {
        cardHeading: 'Le Recensioni Google Elogiano il Nostro Servizio',
        cardBody:
          'Con oltre 99 recensioni a cinque stelle, Asili Climbing Kilimanjaro continua a superare le aspettative, offrendo un servizio di alto livello, tour guidati da esperti e avventure uniche.',
      },
    },
  })
  console.log('climbingKilimanjaroPage-it created/replaced')
}

// ---------- siteSettings-it ----------

async function seedSiteSettingsIt() {
  const navGroupLabelsIt = ['Kilimangiaro e Safari', 'Itinerari del Kilimangiaro', 'Perché Viaggiare con Noi']
  const navGroupLinkLabelsIt = [
    ['9 Giorni Kilimangiaro e Safari', '10 Giorni Kilimangiaro e Safari', '11 Giorni Kilimangiaro e Safari', '12 Giorni Kilimangiaro e Safari'],
    [
      '5 Giorni Route Marangu',
      '6 Giorni Route Machame',
      '6 Giorni Route Marangu',
      '6 Giorni Route Umbwe',
      '7 Giorni Route Lemosho',
      '7 Giorni Route Machame',
      '7 Giorni Route Rongai',
      '8 Giorni Route Lemosho',
      '9 Giorni Route Northern Circuit',
    ],
    ['Safari'],
  ]
  const topLinkLabelsIt = ['Blog', 'Contatti']

  const columnHeadingsIt = ['Scalata', 'AZIENDA', 'ASSISTENZA', 'Link Rapidi']
  const columnLinkLabelsIt = [
    [
      'Il Monte Kilimangiaro',
      'Itinerari del Kilimangiaro',
      'Pacchetti Kilimangiaro',
      'Pacchetti Combinati',
      'Guida al Kilimangiaro',
      "Lista dell'Equipaggiamento",
      'Partenze di Gruppo',
      'Trekking Privati',
      'Tour di Lusso',
      'Tour a Zanzibar',
    ],
    [
      'Chi è CKT',
      'Perché Viaggiare con Noi',
      'Termini e Condizioni',
      'Guida di Montagna',
      'Recensioni',
      'Guida Autista Safari',
      'Valori Fondamentali',
      'Veicolo Safari',
      'Contattaci',
    ],
    ['Note di Viaggio Kili', 'Note di Viaggio Safari', 'Metodi di Pagamento', 'Informativa sulla Privacy', 'Consigli di Viaggio'],
    ['Calendario di Viaggio in Africa', 'Incontra il Nostro Team', 'Recensioni dei Clienti', 'Il Nostro Blog di Viaggio', 'Riconoscimenti'],
  ]
  const legalLinkLabelsIt = ['Informativa sulla Privacy', 'Termini e Condizioni', 'Politica sui Cookie']

  await client.createOrReplace({
    _id: 'siteSettings-it',
    _type: 'siteSettings',
    language: 'it',
    info: {
      name: siteInfo.name,
      tagline: 'La Migliore Agenzia per il Monte Kilimangiaro - Asili Climbing Kilimanjaro',
      phone: siteInfo.phone,
      email: siteInfo.email,
    },
    nav: {
      groups: siteNav.groups.map((group, gi) => ({
        _type: 'navGroup',
        _key: key(),
        label: navGroupLabelsIt[gi],
        ...(group.href ? {href: group.href} : {}),
        links: group.links.map((link, li) => navLink(link, navGroupLinkLabelsIt[gi][li])),
      })),
      links: siteNav.links.map((link, i) => navLink(link, topLinkLabelsIt[i])),
    },
    footer: {
      newsletterHeading: 'Stai Ancora Cercando il Viaggio Ideale?',
      newsletterSubheading: 'Ricevi ogni settimana ispirazione direttamente nella tua casella di posta!',
      columns: siteFooter.columns.map((column, ci) => ({
        _type: 'footerColumn',
        _key: key(),
        heading: columnHeadingsIt[ci],
        links: column.links.map((link, li) => navLink(link, columnLinkLabelsIt[ci][li])),
      })),
      contact: {
        phone: siteFooter.contact.phone,
        email: siteFooter.contact.email,
        address: siteFooter.contact.address,
      },
      copyright: '© Copyright 2025 Asili Climbing Kilimanjaro. Tutti i diritti riservati.',
      legalLinks: siteFooter.legalLinks.map((link, i) => navLink(link, legalLinkLabelsIt[i])),
    },
  })
  console.log('siteSettings-it created/replaced')
}

async function run() {
  await seedHomeIt()
  await seedClimbIt()
  await seedSiteSettingsIt()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
