/**
 * Phase 6 (German): sharedTripContent singleton and the two remaining hub-page
 * singletons (packagesHubPage, comboHubPage). routesHubPage-de is seeded in
 * seed-de-routes.ts. Mirrors seed-it-shared-hubs.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-shared-hubs.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const badges = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((b) => ({_type: typeName, _key: key(), title: b.title, description: b.description}))

async function seedSharedDe() {
  await client.createOrReplace({
    _id: 'sharedTripContent-de',
    _type: 'sharedTripContent',
    language: 'de',
    routeTrustBadges: [
      {title: 'Beste Wahl auf TripAdvisor', subtitle: 'Von Reisenden hoch bewertet', description: 'Mit Hunderten von exzellenten Bewertungen hebt sich unser Engagement für Qualität und Kundenzufriedenheit unter den Kilimandscharo-Veranstaltern ab.'},
      {title: 'Zuverlässig und Erfahren', subtitle: 'Begleitung auf Basis von Integrität', description: 'Unsere hochqualifizierten Guides gewährleisten eine gut betreute Besteigung, wobei Sicherheit, ethisches Trekking und ein reibungsloser Weg zum Gipfel im Vordergrund stehen.'},
      {title: 'Mit Sitz in Tansania', subtitle: 'Lokale Experten, exklusive Touren', description: 'Wir organisieren maßgeschneiderte Kilimandscharo-Trekking-Erlebnisse, von günstigen Besteigungen bis zu Luxusexpeditionen, alle basierend auf verantwortungsvollen und ethischen Besteigungspraktiken.'},
    ].map((b) => ({_type: 'routeTrustBadge', _key: key(), title: b.title, subtitle: b.subtitle, description: b.description})),
    routeCtaBand: {
      heading: 'Bereit, die Herausforderung des Kilimandscharo anzunehmen?',
      body: 'Ihre Reise zum Dach Afrikas beginnt hier. Ob Sie das Abenteuer Ihres Lebens suchen oder sich über Ihre Grenzen hinaus bis zum Gipfel drängen möchten, wir sind hier, um Sie in jeder Phase zu führen.',
      buttons: [
        {_type: 'ctaButton', _key: key(), label: 'Gipfel-Herausforderung', href: '/contact-us/', variant: 'outline'},
        {_type: 'ctaButton', _key: key(), label: 'Besteigung Beginnen', href: '/contact-us/', variant: 'solid'},
      ],
      image: await uploadImage(client, {src: '/images/routes/shared/section-bg.webp', alt: 'Felsen des Kilimandscharo-Kraters glänzen im aufgehenden Sonnenlicht'}),
    },
    hubCtaBandImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'Silhouette eines Trekkers, der den Sonnenaufgang vom Kilimandscharo aus beobachtet'}),
    routeGuidePromos: [
      {color: 'bg-primary', heading: 'Lesen Sie Unseren Kilimandscharo-Leitfaden', body: 'Erhalten Sie alle wesentlichen Informationen, um sich auf Ihre Besteigung vorzubereiten. Unser Leitfaden deckt alles ab, von Routen bis zu Sicherheitstipps, für eine reibungslose und erfolgreiche Besteigung.', ctaLabel: 'Weiterlesen', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-secondary', heading: 'Expertentipps für Ihre Besteigung', body: 'Obwohl der Kilimandscharo Kletternde jeden Niveaus willkommen heißt, ist es unerlässlich, vorsichtig zu trekken. Unsere erfahrenen Guides überwachen Ihre Gesundheit und bieten Ihnen umfassende Unterstützung für eine sichere und angenehme Reise.', ctaLabel: 'Weiterlesen', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-[#a05a52]', heading: 'Ihre Kilimandscharo-Packliste', body: 'Bereiten Sie sich optimal vor mit unserer vollständigen Ausrüstungsliste, die alle wesentlichen Materialien detailliert beschreibt, die Sie für eine komfortable und erfolgreiche Besteigung benötigen.', ctaLabel: 'Weiterlesen', href: '/kilimanjaro-packing-list/'},
    ].map((p) => ({_type: 'guidePromo', _key: key(), color: p.color, heading: p.heading, body: p.body, ctaLabel: p.ctaLabel, href: p.href})),
    routeRelatedGuides: [
      {label: 'Die beste Zeit für die Besteigung des Kilimandscharo', href: '/best-time-to-climb-kilimanjaro/'},
      {label: 'Kosten der Kilimandscharo-Besteigung', href: '/kilimanjaro-climb-cost/'},
      {label: 'Packliste für den Kilimandscharo', href: '/kilimanjaro-packing-list/'},
      {label: 'Solo-Kilimandscharo-Besteigung', href: '/solo-kilimanjaro-climb/'},
      {label: 'Ist die Besteigung des Kilimandscharo sicher?', href: '/is-climbing-kilimanjaro-safe/'},
      {label: 'Die Kilimandscharo-Träger', href: '/kilimanjaro-porters/'},
      {label: 'Essen am Kilimandscharo', href: '/kilimanjaro-food/'},
      {label: 'Höhenkrankheit am Kilimandscharo', href: '/kilimanjaro-altitude-sickness/'},
      {label: 'Kilimandscharo-Besteigung bei Vollmond', href: '/kilimanjaro-fullmoon-climb/'},
      {label: 'Ein typischer Tag am Kilimandscharo', href: '/typical-day-on-kilimanjaro/'},
      {label: 'Kilimandscharo-Safaris', href: '/kilimanjaro-safaris/'},
      {label: 'Fakten über den Kilimandscharo', href: '/mount-kilimanjaro-facts/'},
      {label: 'Anreise zum Kilimandscharo', href: '/getting-to-kilimanjaro/'},
    ].map((g) => ({_type: 'navLink', _key: key(), label: g.label, href: g.href})),
    routeReviewStats: {
      tripAdvisor: {
        heading: 'Hinterlassen Sie eine Bewertung auf TripAdvisor',
        subheading: 'TripAdvisor feiert Asili Explorer African Safaris',
        body: 'Mit über 779 Bewertungen und stetig steigend, bewerten uns 95 % als Ausgezeichnet und 5 % als Sehr Gut — ein Beweis für unser Engagement, unvergessliche Safari- und Trekking-Erlebnisse zu bieten.',
      },
      google: {
        subheading: 'Google-Bewertungen loben unseren Service',
        body: 'Mit über 99 Fünf-Sterne-Bewertungen übertrifft Asili Explorer African Safaris weiterhin die Erwartungen und bietet erstklassigen Service, von Experten geführte Touren und einzigartige Abenteuer.',
      },
    },
    routeTestimonials: [
      {
        name: 'Pastacieo',
        timeAgo: 'August 2024',
        heading: 'Die Besteigung meines Lebens!',
        quote: [{text: 'Unsere Kilimandscharo-Besteigung mit '}, {text: 'Asili Explorer African Safaris', bold: true}, {text: ' war wirklich außergewöhnlich! Von Anfang bis Ende sorgte das Team für ein unvergessliches Erlebnis und machte unsere Reise zum Gipfel reibungslos, sicher und denkwürdig.'}],
      },
      {
        name: 'Danny G',
        timeAgo: 'Sept. 2023',
        heading: 'Ein außergewöhnliches Trekking',
        quote: [{text: 'Es überrascht nicht, dass Asili Explorer African Safaris einen '}, {text: '5-Sterne-Ruf', bold: true}, {text: ' aufrechterhält. Ihr Fachwissen, ihre Professionalität und ihr Engagement für die Kundenzufriedenheit heben sie hervor. Wenn Sie die beste Kilimandscharo-Trekkingagentur suchen, brauchen Sie nicht weiterzusuchen!'}],
      },
      {
        name: 'Christian R',
        timeAgo: 'Sept. 2024',
        heading: 'Kilimandscharo-Trekking dringend empfohlen',
        quote: [{text: 'Im Oktober 2023 unternahmen wir ein '}, {text: 'sechstägiges Trekking zum Gipfel des Kilimandscharo', bold: true}, {text: ' mit Asili Explorer African Safaris. Das Erlebnis war phänomenal, und ich empfehle es jedem, der dieses Abenteuer in Betracht zieht, wärmstens.'}],
      },
    ].map((t) => ({_type: 'routeTestimonial', _key: key(), name: t.name, timeAgo: t.timeAgo, heading: t.heading, quote: [segmentsToBlock(t.quote)]})),
    routeGuestReviews: {
      heading: 'Was unsere Kunden sagen',
      items: [
        {name: 'Chelsea H', summitDate: 'Gipfel erreicht am: 27. Januar 2024', heading: 'Ein unglaubliches Erlebnis', quote: 'Wir haben Asili Explorer African Safaris durch das Kilimanjaro Porters Assistance Project entdeckt, da wir ein Unternehmen unterstützen wollten, das seine Träger gut behandelt…'},
        {name: 'Fabiola N', summitDate: 'Gipfel erreicht am: 30. August 2024', heading: 'Unglaubliche Flitterwochen!', quote: 'Unsere Erfahrung mit Asili Explorer African Safaris war einfach fantastisch! Von Beginn der Planung an wussten wir, dass wir in guten Händen waren. Albin hat sorgfältig…'},
        {name: 'Adeline P', summitDate: 'Gipfel erreicht am: 29. September 2024', heading: 'Der beste Urlaub aller Zeiten', quote: 'Meine Freundin und ich hatten ein absolut UNGLAUBLICHES Erlebnis mit Asili Explorer African Safaris! Von Anfang bis Ende wurde jedes Detail mit Sorgfalt und Präzision gehandhabt…'},
        {name: 'Anastasia F', summitDate: 'Gipfel erreicht am: 10. August 2024', heading: 'Die Besteigung meines Lebens!', quote: 'Unsere Kilimandscharo-Besteigung mit Asili Explorer African Safaris war einfach außergewöhnlich! Unser Guide, Godwin, war phänomenal — sein tiefes Wissen…'},
      ].map((r) => ({_type: 'guestReview', _key: key(), name: r.name, summitDate: r.summitDate, heading: r.heading, quote: r.quote})),
    },
    routePackagesCta: {
      heading: 'Kilimandscharo-Besteigungspakete',
      body: 'Wählen Sie aus unseren sorgfältig gestalteten Kilimandscharo-Besteigungspaketen, jedes darauf ausgelegt, das beste Erlebnis entsprechend Ihren Vorlieben, Ihrem Fitnessniveau und Ihrer gewünschten Route zu bieten. Ob Sie eine schnelle Besteigung oder ein verlängertes, landschaftlich reizvolles Trekking suchen, wir haben die perfekte Route für Sie.',
      ctaLabel: 'Pakete Ansehen',
      href: '/kilimanjaro-packages/',
    },
    packageTrustBadges: badges('packageBadge', [
      {title: 'Beste Servicegarantie', description: 'Zertifizierte Bergführer, Koch und Träger'},
      {title: 'Schnelle Antwort', description: '24/7-Unterstützung'},
    ]),
    packageStandardIntro:
      'Bei Asili Climbing Kilimanjaro glauben wir, dass jeder Trekker einzigartig ist. Deshalb sind alle unsere Reiseverläufe flexibel und können an Ihr Tempo, Ihre Vorlieben und Ihre Ziele angepasst werden. Lassen Sie uns Ihnen helfen, ein einmaliges Bergabenteuer zu gestalten.',
    packageInterestedCta: {
      heading: 'Interessiert an dieser Route?',
      body: 'Wenn Sie diese Route begeistert, warten Sie nicht! Buchen Sie jetzt Ihren Platz und bereiten Sie sich auf eine unvergessliche Reise voller außergewöhnlicher Erlebnisse vor. Buchen Sie Ihre Reise noch heute und lassen Sie das Abenteuer beginnen!',
      ctaLabel: 'Diese Route Buchen',
    },
    packageExpertCta: {
      heading: 'Verwandeln Sie Ihren Traumurlaub mit einem Tansania-Experten in die Realität.',
      body: 'Mit einem Tansania-Experten können Sie Ihr Abenteuer individuell gestalten. Unsere vorgeschlagenen Reiseverläufe können an Ihre Vorlieben angepasst werden. Unsere Spezialisten arbeiten mit Ihnen zusammen, um Ihre perfekte Reise zu gestalten!',
      ctaLabel: 'Jetzt Angebot Anfordern',
    },
    packageHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: 'Zelte unter der Milchstraße am Fuß des Kilimandscharo-Gipfels'}),
    comboTrustBadges: badges('comboBadge', [
      {title: 'Beste Preis- und Servicegarantie', description: 'Beste Safari-Guide-Fahrer'},
      {title: 'Schnelle Antwort', description: '24/7-Unterstützung'},
    ]),
    comboPriceDisclaimer: '*Preis pro Person, einschließlich Guide, Safarifahrzeug, Hotel und Parkeintrittsgebühren, ohne internationalen Flug (basierend auf sechs Personen)',
    comboStandardIntro:
      'Verwirklichen Sie die Reise Ihrer Träume mit Asili Climbing Kilimanjaro. Bei Asili Explorer Tanzania Safari können Sie Ihre Reise individuell gestalten. Unsere Beispielreiseverläufe können entsprechend Ihren Vorlieben angepasst werden.',
    comboHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: 'Zelte unter der Milchstraße am Fuß des Kilimandscharo-Gipfels'}),
    safariTrustBadges: badges('safariBadge', [
      {title: 'Beste Preis- und Servicegarantie', description: 'Beste Safari-Guide-Fahrer'},
      {title: 'Schnelle Antwort', description: '24/7-Unterstützung'},
    ]),
    safariInterestedCta: {
      heading: 'Interessiert an dieser Route?',
      body: 'Wenn Sie diese Route begeistert, warten Sie nicht! Buchen Sie jetzt Ihren Platz und bereiten Sie sich auf eine unvergessliche Reise voller außergewöhnlicher Erlebnisse vor. Buchen Sie Ihre Reise noch heute und lassen Sie das Abenteuer beginnen!',
      ctaLabel: 'Diese Route Buchen',
    },
  })
  console.log('sharedTripContent-de created/replaced')
}

async function seedPackagesHubDe() {
  const cards = [
    {title: 'Lemosho-Route 8 Tage', slug: '8-days-lemosho-route', nights: '7 Nächte', summary: 'Mit acht Reisetagen dauert Ihr Kilimandscharo-Trekking auf der Lemosho-Route länger als Alternativen.', image: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Lemosho-Route 8 Tage'}},
    {title: 'Machame-Route 7 Tage', slug: '7-days-machame-route', nights: '6 Nächte', summary: 'Bewältigen Sie die berühmte Machame-Route, eine Reise mit insgesamt sieben Tagen, die Ihnen noch mehr Zeit zur Akklimatisierung bietet', image: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Machame-Route 7 Tage'}},
    {title: 'Marangu-Route 6 Tage', slug: '6-days-marangu-route', nights: '5 Nächte', summary: 'Eine sechstägige Reise zur Besteigung von Afrikas höchstem Gipfel über die berühmte Marangu-Route. Erwarten Sie eine Vielfalt an Landschaften…', image: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Marangu-Route 6 Tage'}},
    {title: 'Umbwe-Route 6 Tage', slug: '6-days-umbwe-route', nights: '5 Nächte', summary: 'Die Umbwe-Route ist bekannt für ihren anspruchsvollen, steilen Aufstieg und ihren wunderschönen, weniger frequentierten Pfad.', image: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Umbwe-Route 6 Tage'}},
    {title: 'Northern Circuit 9 Tage', slug: '9-days-northern-circuit-route', nights: '8 Nächte', summary: 'Die neueste und längste Route, die 360-Grad-Ausblicke und die besten Erfolgsquoten für die Gipfelbesteigung bietet.', image: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit 9 Tage'}},
    {title: 'Rongai-Route 7 Tage', slug: '7-days-rongai-route', nights: '6 Nächte', summary: 'Von Norden angegangen, bietet diese Route eine einzigartige Perspektive des Kilimandscharo und ist perfekt für alle, die…', image: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Rongai-Route 7 Tage'}},
  ]
  await client.createOrReplace({
    _id: 'packagesHubPage-de',
    _type: 'packagesHubPage',
    language: 'de',
    hero: {
      eyebrow: 'Das Dach Afrikas.',
      heading: 'Kilimandscharo-Besteigungspakete',
      locationPill: 'Nordtansania',
      tagline: 'Wählen Sie Ihre Route. Besteigen Sie auf Ihre Weise.',
      introHeading: 'Kilimandscharo-Besteigungspakete',
      intro: 'Durchsuchen Sie unsere Auswahl an Kilimandscharo-Paketen, jedes darauf ausgelegt, zu Ihrem Abenteuerstil, Ihrem Fitnessniveau und Ihrem Zeitplan zu passen. Ob Sie eine beliebte Route oder eine ruhigere, abseits ausgetretener Pfade liegende Besteigung suchen, wir haben die perfekte Option für Sie.',
    },
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'packageHubCard', _key: key(), title: card.title, packageSlug: card.slug, nights: card.nights, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
  })
  console.log('packagesHubPage-de created/replaced')
}

async function seedComboHubDe() {
  const cards = [
    {title: 'Kilimandscharo & Safari 9 Tage', href: '/combo/9-days-kilimanjaro-safari/', nights: '8 Nächte', summary: 'Perfekt für Abenteurer mit knapper Zeit. Besteigen Sie den Kilimandscharo über eine 6-tägige Route und genießen Sie anschließend eine kurze 3-tägige Safari durch Tansanias legendäre Parks wie Ngorongoro und Tarangire.', image: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: 'Kilimandscharo & Safari 9 Tage'}},
    {title: 'Kilimandscharo & Safari 10 Tage', href: '/combo/10-days-kilimanjaro-and-safari/', nights: '9 Nächte', summary: 'Ein ausgewogenes Abenteuer, das eine 7-tägige Kilimandscharo-Besteigung (wie die Machame-Route) mit einer 3-tägigen Wildtier-Safari verbindet — ideal, um sowohl den Berg als auch die Savanne von ihrer besten Seite zu erleben.', image: {src: '/images/combo/shared/7-days-machame-route.webp', alt: 'Kilimandscharo & Safari 10 Tage'}},
    {title: 'Kilimandscharo & Safari 11 Tage', href: '/combo/11-days-kilimanjaro-safari/', nights: '10 Nächte', summary: 'Diese Option gibt Ihnen Zeit für eine gründliche Akklimatisierung während einer 7-tägigen Besteigung und anschließend Entspannung bei einer 4-tägigen Safari durch die Serengeti, Ngorongoro und weitere unverzichtbare Parks.', image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Kilimandscharo & Safari 11 Tage'}},
    {title: 'Kilimandscharo & Safari 12 Tage', href: '/combo/12-days-kilimanjaro-safari/', nights: '11 Nächte', summary: 'Ein vollständiges Erlebnis für Naturliebhaber. Besteigen Sie Afrikas höchsten Gipfel über 8 Tage (wie die Lemosho-Route) und lassen Sie 4 unvergessliche Tage auf Safari zur Tierbeobachtung folgen.', image: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: 'Kilimandscharo & Safari 12 Tage'}},
    {title: 'Kilimandscharo & Safari 13 Tage', nights: '12 Nächte', summary: 'Konzipiert für Reisende, die es entspannt angehen möchten. Umfasst eine längere Kilimandscharo-Besteigung und eine ausführliche Safari, die sowohl ein gut getaktetes Trekking als auch immersive Fotosafaris ermöglicht.', image: {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: 'Kilimandscharo & Safari 13 Tage'}},
    {title: 'Kilimandscharo & Safari 14 Tage', nights: '13 Nächte', summary: 'Die ultimative zweiwöchige Reise nach Tansania. Beginnen Sie mit einer landschaftlich reizvollen, weniger frequentierten Kilimandscharo-Route, dann tauchen Sie ein in einen vollständigen Safari-Circuit durch die Serengeti, Ngorongoro, Tarangire und mehr.', image: {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: 'Kilimandscharo & Safari 14 Tage'}},
  ]
  await client.createOrReplace({
    _id: 'comboHubPage-de',
    _type: 'comboHubPage',
    language: 'de',
    intro: {
      heading: 'Kombipakete',
      body: [
        'Besteigen Sie das Dach Afrikas, dann entspannen Sie sich in der Wildnis. Eine einzige Reise, zwei unvergessliche Erlebnisse.',
        'Bei Asili Climbing Kilimanjaro glauben wir, dass das ultimative tansanische Abenteuer über ein einzelnes Reiseziel hinausgeht. Unsere Kilimandscharo-und-Safari-Kombipakete sind für Reisende gedacht, die alles möchten — die Herausforderung der Besteigung des Kilimandscharo verbunden mit dem Nervenkitzel einer klassischen afrikanischen Wildtier-Safari. Diese sorgfältig ausgearbeiteten Reiseverläufe kombinieren zwei unverzichtbare Erlebnisse in einer einzigen, nahtlosen und lohnenden Reise.',
        'Ob Sie die ikonische Lemosho-Route bewältigen oder die landschaftlich reizvolle Marangu-Route bezwingen, Ihre Besteigung kann harmonisch in eine aufregende Safari durch Tansanias legendärste Nationalparks übergehen — Serengeti, Ngorongoro-Krater, Tarangire, Lake Manyara und mehr.',
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
    cta: {label: 'Bereit für die Herausforderung?', href: '/contact-us/'},
  })
  console.log('comboHubPage-de created/replaced')
}

async function run() {
  await seedSharedDe()
  await seedPackagesHubDe()
  await seedComboHubDe()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
