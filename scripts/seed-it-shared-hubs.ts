/**
 * Phase 6 (Italian): sharedTripContent singleton and the two remaining hub-page
 * singletons (packagesHubPage, comboHubPage). routesHubPage-it is seeded in
 * seed-it-routes.ts. Mirrors seed-fr-shared-hubs.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-shared-hubs.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const badges = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((b) => ({_type: typeName, _key: key(), title: b.title, description: b.description}))

async function seedSharedIt() {
  await client.createOrReplace({
    _id: 'sharedTripContent-it',
    _type: 'sharedTripContent',
    language: 'it',
    routeTrustBadges: [
      {title: 'Scelta Migliore su TripAdvisor', subtitle: 'Altamente Valutato dai Viaggiatori', description: "Con centinaia di recensioni eccellenti, il nostro impegno verso la qualità e la soddisfazione del cliente ci distingue tra gli operatori turistici del Kilimangiaro."},
      {title: 'Affidabili ed Esperti', subtitle: "Un Accompagnamento Basato sull'Integrità", description: 'Le nostre guide altamente qualificate garantiscono una scalata ben assistita, dando priorità alla sicurezza, a un trekking etico e a un percorso agevole verso la vetta.'},
      {title: 'Con Sede in Tanzania', subtitle: 'Esperti Locali, Tour Esclusivi', description: "Organizziamo esperienze di trekking personalizzate al Kilimangiaro, dalle scalate economiche alle spedizioni di lusso, tutte basate su pratiche di scalata responsabili ed etiche."},
    ].map((b) => ({_type: 'routeTrustBadge', _key: key(), title: b.title, subtitle: b.subtitle, description: b.description})),
    routeCtaBand: {
      heading: 'Pronto ad Affrontare la Sfida del Kilimangiaro?',
      body: "Il tuo viaggio verso il Tetto dell'Africa inizia qui. Che tu stia cercando l'avventura di una vita o voglia spingerti oltre i tuoi limiti fino alla vetta, siamo qui per guidarti in ogni fase.",
      buttons: [
        {_type: 'ctaButton', _key: key(), label: 'Sfida della Vetta', href: '/contact-us/', variant: 'outline'},
        {_type: 'ctaButton', _key: key(), label: 'Inizia la Scalata', href: '/contact-us/', variant: 'solid'},
      ],
      image: await uploadImage(client, {src: '/images/routes/shared/section-bg.webp', alt: 'Rocce del cratere del Kilimangiaro che brillano al sorgere del sole'}),
    },
    hubCtaBandImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'Silhouette di un escursionista che osserva il sorgere del sole dal Monte Kilimangiaro'}),
    routeGuidePromos: [
      {color: 'bg-primary', heading: 'Consulta la Nostra Guida al Kilimangiaro', body: 'Ottieni tutte le informazioni essenziali per preparare la tua scalata. La nostra guida copre tutto, dagli itinerari ai consigli di sicurezza, per una scalata fluida e di successo.', ctaLabel: 'Continua a Leggere', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-secondary', heading: 'Consigli di Esperti per la Tua Scalata', body: 'Sebbene il Kilimangiaro accolga scalatori di tutti i livelli, è essenziale fare trekking con prudenza. Le nostre guide esperte monitorano la tua salute e ti offrono un supporto completo per un viaggio sicuro e piacevole.', ctaLabel: 'Continua a Leggere', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-[#a05a52]', heading: 'La Tua Lista dell\'Equipaggiamento per il Kilimangiaro', body: "Preparati al meglio grazie alla nostra lista completa dell'equipaggiamento, che dettaglia tutto il materiale essenziale di cui avrai bisogno per una scalata confortevole e di successo.", ctaLabel: 'Continua a Leggere', href: '/kilimanjaro-packing-list/'},
    ].map((p) => ({_type: 'guidePromo', _key: key(), color: p.color, heading: p.heading, body: p.body, ctaLabel: p.ctaLabel, href: p.href})),
    routeRelatedGuides: [
      {label: 'Il Momento Migliore per Scalare il Kilimangiaro', href: '/best-time-to-climb-kilimanjaro/'},
      {label: 'Costo della Scalata del Kilimangiaro', href: '/kilimanjaro-climb-cost/'},
      {label: "Lista dell'Equipaggiamento per il Kilimangiaro", href: '/kilimanjaro-packing-list/'},
      {label: 'Scalata del Kilimangiaro in Solitaria', href: '/solo-kilimanjaro-climb/'},
      {label: 'La Scalata del Kilimangiaro è Sicura?', href: '/is-climbing-kilimanjaro-safe/'},
      {label: 'I Portatori del Kilimangiaro', href: '/kilimanjaro-porters/'},
      {label: 'Il Cibo sul Kilimangiaro', href: '/kilimanjaro-food/'},
      {label: 'Il Mal di Montagna sul Kilimangiaro', href: '/kilimanjaro-altitude-sickness/'},
      {label: 'Scalata del Kilimangiaro con la Luna Piena', href: '/kilimanjaro-fullmoon-climb/'},
      {label: 'Una Giornata Tipo sul Kilimangiaro', href: '/typical-day-on-kilimanjaro/'},
      {label: 'Safari al Kilimangiaro', href: '/kilimanjaro-safaris/'},
      {label: 'Curiosità sul Monte Kilimangiaro', href: '/mount-kilimanjaro-facts/'},
      {label: 'Come Arrivare al Kilimangiaro', href: '/getting-to-kilimanjaro/'},
    ].map((g) => ({_type: 'navLink', _key: key(), label: g.label, href: g.href})),
    routeReviewStats: {
      tripAdvisor: {
        heading: 'Lascia una Recensione su TripAdvisor',
        subheading: 'TripAdvisor Celebra Asili Explorer African Safaris',
        body: 'Con oltre 779 recensioni e in continuo aumento, il 95% ci valuta Eccellente e il 5% Molto Buono, a testimonianza del nostro impegno nell\'offrire esperienze di safari e trekking indimenticabili.',
      },
      google: {
        subheading: 'Le Recensioni Google Elogiano il Nostro Servizio',
        body: 'Con oltre 99 recensioni a cinque stelle, Asili Explorer African Safaris continua a superare le aspettative, offrendo un servizio di alto livello, tour guidati da esperti e avventure uniche.',
      },
    },
    routeTestimonials: [
      {
        name: 'Pastacieo',
        timeAgo: 'Agosto 2024',
        heading: 'La Scalata di una Vita!',
        quote: [{text: 'La nostra scalata del Kilimangiaro con '}, {text: 'Asili Explorer African Safaris', bold: true}, {text: " è stata davvero straordinaria! Dall'inizio alla fine, il team ha garantito un'esperienza indimenticabile, rendendo il nostro viaggio verso la vetta fluido, sicuro e memorabile."}],
      },
      {
        name: 'Danny G',
        timeAgo: 'Set. 2023',
        heading: "Un'Escursione Fuori dal Comune",
        quote: [{text: 'Non sorprende che Asili Explorer African Safaris mantenga una '}, {text: 'reputazione a 5 stelle', bold: true}, {text: '. La loro competenza, professionalità e impegno verso la soddisfazione del cliente li distinguono. Se cerchi la migliore agenzia di trekking al Kilimangiaro, non cercare oltre!'}],
      },
      {
        name: 'Christian R',
        timeAgo: 'Set. 2024',
        heading: 'Trekking del Kilimangiaro Vivamente Consigliato',
        quote: [{text: "Nell'ottobre 2023, abbiamo effettuato un "}, {text: 'trekking di sei giorni fino alla vetta del Kilimangiaro', bold: true}, {text: " con Asili Explorer African Safaris. L'esperienza è stata fenomenale, e lo consiglio vivamente a chiunque stia considerando questa avventura."}],
      },
    ].map((t) => ({_type: 'routeTestimonial', _key: key(), name: t.name, timeAgo: t.timeAgo, heading: t.heading, quote: [segmentsToBlock(t.quote)]})),
    routeGuestReviews: {
      heading: 'Cosa Dicono i Nostri Clienti',
      items: [
        {name: 'Chelsea H', summitDate: 'Vetta raggiunta il: 27 gennaio 2024', heading: "Un'Esperienza Incredibile", quote: 'Abbiamo scoperto Asili Explorer African Safaris grazie al Kilimanjaro Porters Assistance Project, poiché volevamo sostenere un\'azienda che tratta bene i propri portatori…'},
        {name: 'Fabiola N', summitDate: 'Vetta raggiunta il: 30 agosto 2024', heading: 'Una Luna di Miele Incredibile!', quote: 'La nostra esperienza con Asili Explorer African Safaris è stata semplicemente fantastica! Fin dall\'inizio della pianificazione, sapevamo di essere in buone mani. Albin ha meticolosamente…'},
        {name: 'Adeline P', summitDate: 'Vetta raggiunta il: 29 settembre 2024', heading: 'La Migliore Vacanza di Sempre', quote: 'Io e la mia amica abbiamo vissuto un\'esperienza assolutamente INCREDIBILE con Asili Explorer African Safaris! Dall\'inizio alla fine, ogni dettaglio è stato gestito con cura e precisione…'},
        {name: 'Anastasia F', summitDate: 'Vetta raggiunta il: 10 agosto 2024', heading: 'La Scalata di una Vita!', quote: 'La nostra scalata del Kilimangiaro con Asili Explorer African Safaris è stata semplicemente straordinaria! La nostra guida, Godwin, è stata fenomenale — la sua conoscenza approfondita…'},
      ].map((r) => ({_type: 'guestReview', _key: key(), name: r.name, summitDate: r.summitDate, heading: r.heading, quote: r.quote})),
    },
    routePackagesCta: {
      heading: 'Pacchetti di Scalata del Kilimangiaro',
      body: 'Scegli tra i nostri pacchetti di scalata del Kilimangiaro accuratamente progettati, ciascuno pensato per offrire la migliore esperienza in base alle tue preferenze, al tuo livello di forma fisica e all\'itinerario desiderato. Che tu stia cercando una scalata rapida o un trekking prolungato e pittoresco, abbiamo l\'itinerario perfetto per te.',
      ctaLabel: 'Vedi i Pacchetti',
      href: '/kilimanjaro-packages/',
    },
    packageTrustBadges: badges('packageBadge', [
      {title: 'Migliore Garanzia di Servizio', description: 'Guide di montagna certificate, cuoco e portatori'},
      {title: 'Risposta Rapida', description: 'Assistenza 24 ore su 24, 7 giorni su 7'},
    ]),
    packageStandardIntro:
      "Presso Asili Climbing Kilimanjaro, crediamo che ogni escursionista sia unico. Per questo tutti i nostri itinerari sono flessibili e possono essere adattati al tuo ritmo, alle tue preferenze e ai tuoi obiettivi. Lasciaci aiutarti a creare un'avventura in montagna unica nella vita.",
    packageInterestedCta: {
      heading: 'Interessato a Questo Itinerario?',
      body: "Se questo itinerario ti entusiasma, non aspettare! Prenota subito il tuo posto e preparati per un viaggio indimenticabile pieno di esperienze straordinarie. Prenota il tuo viaggio oggi e che l'avventura abbia inizio!",
      ctaLabel: 'Prenota Questo Itinerario',
    },
    packageExpertCta: {
      heading: 'Trasforma la Tua Vacanza da Sogno in Realtà con un Esperto della Tanzania.',
      body: 'Con un esperto della Tanzania, puoi personalizzare la tua avventura. I nostri itinerari suggeriti possono essere adattati alle tue preferenze. I nostri specialisti collaborano con te per progettare il tuo viaggio perfetto!',
      ctaLabel: 'Richiedi un Preventivo Ora',
    },
    packageHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: 'Tende sotto la Via Lattea ai piedi della vetta del Monte Kilimangiaro'}),
    comboTrustBadges: badges('comboBadge', [
      {title: 'Migliore Garanzia di Prezzo e Servizio', description: 'Migliori guide-autisti di safari'},
      {title: 'Risposta Rapida', description: 'Assistenza 24 ore su 24, 7 giorni su 7'},
    ]),
    comboPriceDisclaimer: "*Prezzo per persona, comprendente guida, veicolo di safari, hotel e tasse d'ingresso ai parchi, escluso il volo internazionale (basato su sei persone)",
    comboStandardIntro:
      'Realizza il viaggio dei tuoi sogni con Asili Climbing Kilimanjaro. Presso Asili Explorer Tanzania Safari, puoi personalizzare il tuo viaggio. I nostri itinerari di esempio sono modificabili in base alle tue preferenze.',
    comboHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: 'Tende sotto la Via Lattea ai piedi della vetta del Monte Kilimangiaro'}),
    safariTrustBadges: badges('safariBadge', [
      {title: 'Migliore Garanzia di Prezzo e Servizio', description: 'Migliori guide-autisti di safari'},
      {title: 'Risposta Rapida', description: 'Assistenza 24 ore su 24, 7 giorni su 7'},
    ]),
    safariInterestedCta: {
      heading: 'Interessato a Questo Itinerario?',
      body: "Se questo itinerario ti entusiasma, non aspettare! Prenota subito il tuo posto e preparati per un viaggio indimenticabile pieno di esperienze straordinarie. Prenota il tuo viaggio oggi e che l'avventura abbia inizio!",
      ctaLabel: 'Prenota Questo Itinerario',
    },
  })
  console.log('sharedTripContent-it created/replaced')
}

async function seedPackagesHubIt() {
  const cards = [
    {title: 'Route Lemosho 8 Giorni', slug: '8-days-lemosho-route', nights: '7 notti', summary: 'Con otto giorni di viaggio, il tuo trekking del Kilimangiaro sulla Route Lemosho dura più a lungo delle alternative.', image: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho 8 Giorni'}},
    {title: 'Route Machame 7 Giorni', slug: '7-days-machame-route', nights: '6 notti', summary: 'Percorri la celebre Route Machame, in un viaggio di sette giorni in totale, che ti offre così ancora più tempo per l\'acclimatazione', image: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Route Machame 7 Giorni'}},
    {title: 'Route Marangu 6 Giorni', slug: '6-days-marangu-route', nights: '5 notti', summary: 'Un viaggio di sei giorni per scalare la vetta più alta d\'Africa attraverso la celebre Route Marangu. Aspettati una varietà di paesaggi…', image: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Route Marangu 6 Giorni'}},
    {title: 'Route Umbwe 6 Giorni', slug: '6-days-umbwe-route', nights: '5 notti', summary: 'La Route Umbwe è rinomata per la sua ascensione impegnativa e ripida e per il suo splendido sentiero meno frequentato.', image: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Route Umbwe 6 Giorni'}},
    {title: 'Northern Circuit 9 Giorni', slug: '9-days-northern-circuit-route', nights: '8 notti', summary: "L'itinerario più recente e più lungo, che offre viste a 360 gradi e i migliori tassi di successo per raggiungere la vetta.", image: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit 9 Giorni'}},
    {title: 'Route Rongai 7 Giorni', slug: '7-days-rongai-route', nights: '6 notti', summary: 'Affrontata da nord, questa route offre una prospettiva unica del Kilimangiaro ed è perfetta per chi…', image: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai 7 Giorni'}},
  ]
  await client.createOrReplace({
    _id: 'packagesHubPage-it',
    _type: 'packagesHubPage',
    language: 'it',
    hero: {
      eyebrow: "Il Tetto dell'Africa.",
      heading: 'Pacchetti di Scalata del Monte Kilimangiaro',
      locationPill: 'Nord della Tanzania',
      tagline: 'Scegli il tuo itinerario. Scala a modo tuo.',
      introHeading: 'Pacchetti di Scalata del Kilimangiaro',
      intro: 'Sfoglia la nostra gamma di pacchetti Kilimangiaro, ciascuno pensato per adattarsi al tuo stile di avventura, al tuo livello di forma fisica e al tuo programma. Che tu stia cercando un itinerario popolare o una scalata più tranquilla e fuori dai sentieri battuti, abbiamo l\'opzione perfetta per te.',
    },
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'packageHubCard', _key: key(), title: card.title, packageSlug: card.slug, nights: card.nights, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
  })
  console.log('packagesHubPage-it created/replaced')
}

async function seedComboHubIt() {
  const cards = [
    {title: 'Kilimangiaro e Safari 9 Giorni', href: '/combo/9-days-kilimanjaro-safari/', nights: '8 notti', summary: 'Perfetto per gli avventurieri con poco tempo a disposizione. Scala il Monte Kilimangiaro tramite un itinerario di 6 giorni, poi goditi un rapido safari di 3 giorni attraverso i parchi iconici della Tanzania come Ngorongoro e Tarangire.', image: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: 'Kilimangiaro e Safari 9 Giorni'}},
    {title: 'Kilimangiaro e Safari 10 Giorni', href: '/combo/10-days-kilimanjaro-and-safari/', nights: '9 notti', summary: "Un'avventura ben equilibrata che combina una scalata del Kilimangiaro di 7 giorni (come la Route Machame) con un safari di 3 giorni — ideale per scoprire il meglio della montagna e della savana.", image: {src: '/images/combo/shared/7-days-machame-route.webp', alt: 'Kilimangiaro e Safari 10 Giorni'}},
    {title: 'Kilimangiaro e Safari 11 Giorni', href: '/combo/11-days-kilimanjaro-safari/', nights: '10 notti', summary: 'Questa opzione ti lascia il tempo di acclimatarti correttamente durante una scalata di 7 giorni, per poi rilassarti con un safari di 4 giorni attraverso il Serengeti, il Ngorongoro e altri parchi imperdibili.', image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Kilimangiaro e Safari 11 Giorni'}},
    {title: 'Kilimangiaro e Safari 12 Giorni', href: '/combo/12-days-kilimanjaro-safari/', nights: '11 notti', summary: "Un'esperienza completa per gli amanti della natura. Scala il più alto vertice d'Africa in 8 giorni (come la Route Lemosho) poi prosegui con 4 giorni indimenticabili a caccia di fauna in safari.", image: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: 'Kilimangiaro e Safari 12 Giorni'}},
    {title: 'Kilimangiaro e Safari 13 Giorni', nights: '12 notti', summary: 'Pensato per i viaggiatori che vogliono prendersela con calma. Include una scalata del Kilimangiaro più lunga e un safari approfondito, permettendo sia un trekking ben ritmato che safari fotografici immersivi.', image: {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: 'Kilimangiaro e Safari 13 Giorni'}},
    {title: 'Kilimangiaro e Safari 14 Giorni', nights: '13 notti', summary: 'Il viaggio definitivo di due settimane in Tanzania. Inizia con un itinerario del Kilimangiaro pittoresco e meno frequentato, poi immergiti in un circuito di safari completo che copre il Serengeti, il Ngorongoro, Tarangire e molto altro.', image: {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: 'Kilimangiaro e Safari 14 Giorni'}},
  ]
  await client.createOrReplace({
    _id: 'comboHubPage-it',
    _type: 'comboHubPage',
    language: 'it',
    intro: {
      heading: 'Pacchetti Combinati',
      body: [
        'Scala il tetto dell\'Africa, poi rilassati nella natura selvaggia. Un solo viaggio, due esperienze indimenticabili.',
        "Presso Asili Climbing Kilimanjaro, crediamo che l'avventura tanzaniana definitiva vada oltre una singola destinazione. I nostri pacchetti combinati Kilimangiaro e Safari sono pensati per i viaggiatori che vogliono tutto — la sfida di scalare il Monte Kilimangiaro unita al brivido di un classico safari della fauna africana. Questi itinerari accuratamente elaborati combinano due esperienze imperdibili in un unico viaggio fluido e gratificante.",
        'Che tu percorra l\'iconica Route Lemosho o conquisti la pittoresca Route Marangu, la tua scalata può trasformarsi armoniosamente in un emozionante safari attraverso i parchi nazionali più leggendari della Tanzania — Serengeti, cratere del Ngorongoro, Tarangire, lago Manyara e molto altro.',
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
    cta: {label: 'Pronto ad Affrontare la Sfida?', href: '/contact-us/'},
  })
  console.log('comboHubPage-it created/replaced')
}

async function run() {
  await seedSharedIt()
  await seedPackagesHubIt()
  await seedComboHubIt()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
