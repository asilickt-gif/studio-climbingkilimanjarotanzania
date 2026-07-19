/**
 * Phase 5: French translation for the sharedTripContent singleton and the
 * two remaining hub-page singletons (packagesHubPage, comboHubPage).
 * routesHubPage-fr was already seeded in seed-fr-routes.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-shared-hubs.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

const badges = (typeName: string, items: {title: string; description: string}[]) =>
  items.map((b) => ({_type: typeName, _key: key(), title: b.title, description: b.description}))

async function seedSharedFr() {
  await client.createOrReplace({
    _id: 'sharedTripContent-fr',
    _type: 'sharedTripContent',
    language: 'fr',
    routeTrustBadges: [
      {title: 'Meilleur choix TripAdvisor', subtitle: 'Très bien noté par les voyageurs', description: "Avec des centaines d'avis excellents, notre engagement envers la qualité et la satisfaction client nous distingue parmi les opérateurs de circuits au Kilimandjaro."},
      {title: 'Fiables et expérimentés', subtitle: "Un accompagnement basé sur l'intégrité", description: 'Nos guides hautement qualifiés assurent une ascension bien encadrée, en donnant la priorité à la sécurité, à un trekking éthique et à un parcours sans encombre vers le sommet.'},
      {title: 'Basés en Tanzanie', subtitle: 'Experts locaux, circuits exclusifs', description: "Nous organisons des expériences de trekking personnalisées au Kilimandjaro, des ascensions économiques aux expéditions de luxe, toutes fondées sur des pratiques d'escalade responsables et éthiques."},
    ].map((b) => ({_type: 'routeTrustBadge', _key: key(), title: b.title, subtitle: b.subtitle, description: b.description})),
    routeCtaBand: {
      heading: 'Prêt à relever le défi du Kilimandjaro ?',
      body: "Votre voyage vers le Toit de l'Afrique commence ici. Que vous visiez l'aventure d'une vie ou que vous cherchiez à repousser vos limites jusqu'au sommet, nous sommes là pour vous guider à chaque étape.",
      buttons: [
        {_type: 'ctaButton', _key: key(), label: 'Défi du sommet', href: '/contact-us/', variant: 'outline'},
        {_type: 'ctaButton', _key: key(), label: "Commencer l'ascension", href: '/contact-us/', variant: 'solid'},
      ],
      image: await uploadImage(client, {src: '/images/routes/shared/section-bg.webp', alt: 'Rochers du cratère du Kilimandjaro brillant au lever du soleil'}),
    },
    hubCtaBandImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: "Silhouette d'un randonneur observant le lever du soleil depuis le Mont Kilimandjaro"}),
    routeGuidePromos: [
      {color: 'bg-primary', heading: 'Consultez notre guide du Kilimandjaro', body: 'Obtenez toutes les informations essentielles pour préparer votre ascension. Notre guide couvre tout, des itinéraires aux conseils de sécurité, pour une ascension fluide et réussie.', ctaLabel: 'Lire la suite', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-secondary', heading: "Conseils d'experts pour votre ascension", body: 'Bien que le Kilimandjaro accueille des grimpeurs de tous niveaux, il est essentiel de trekker avec prudence. Nos guides expérimentés surveillent votre santé et vous apportent un soutien complet pour un voyage sûr et agréable.', ctaLabel: 'Lire la suite', href: '/kilimanjaro-climbing-guide/'},
      {color: 'bg-[#a05a52]', heading: "Votre liste d'équipement pour le Kilimandjaro", body: "Soyez pleinement préparé grâce à notre liste d'équipement complète, détaillant tout le matériel essentiel dont vous aurez besoin pour une ascension confortable et réussie.", ctaLabel: 'Lire la suite', href: '/kilimanjaro-packing-list/'},
    ].map((p) => ({_type: 'guidePromo', _key: key(), color: p.color, heading: p.heading, body: p.body, ctaLabel: p.ctaLabel, href: p.href})),
    routeRelatedGuides: [
      {label: 'Meilleure période pour gravir le Kilimandjaro', href: '/best-time-to-climb-kilimanjaro/'},
      {label: "Coût de l'ascension du Kilimandjaro", href: '/kilimanjaro-climb-cost/'},
      {label: "Liste d'équipement pour le Kilimandjaro", href: '/kilimanjaro-packing-list/'},
      {label: 'Ascension du Kilimandjaro en solo', href: '/solo-kilimanjaro-climb/'},
      {label: "L'ascension du Kilimandjaro est-elle sûre ?", href: '/is-climbing-kilimanjaro-safe/'},
      {label: 'Porteurs du Kilimandjaro', href: '/kilimanjaro-porters/'},
      {label: 'Nourriture sur le Kilimandjaro', href: '/kilimanjaro-food/'},
      {label: "Mal d'altitude au Kilimandjaro", href: '/kilimanjaro-altitude-sickness/'},
      {label: 'Ascension du Kilimandjaro à la pleine lune', href: '/kilimanjaro-fullmoon-climb/'},
      {label: 'Une journée type sur le Kilimandjaro', href: '/typical-day-on-kilimanjaro/'},
      {label: 'Safaris au Kilimandjaro', href: '/kilimanjaro-safaris/'},
      {label: 'Faits sur le Mont Kilimandjaro', href: '/mount-kilimanjaro-facts/'},
      {label: 'Se rendre au Kilimandjaro', href: '/getting-to-kilimanjaro/'},
    ].map((g) => ({_type: 'navLink', _key: key(), label: g.label, href: g.href})),
    routeReviewStats: {
      tripAdvisor: {
        heading: 'Laissez-nous un avis sur TripAdvisor',
        subheading: 'TripAdvisor met à l\'honneur Asili Explorer African Safaris',
        body: 'Avec plus de 779 avis et toujours plus, 95 % nous notent Excellent et 5 % Très bien, témoignant de notre engagement à offrir des expériences de safari et de trekking inoubliables.',
      },
      google: {
        subheading: 'Les avis Google saluent notre service',
        body: 'Avec plus de 99 avis cinq étoiles, Asili Explorer African Safaris continue de dépasser les attentes, offrant un service haut de gamme, des circuits guidés par des experts et des aventures uniques.',
      },
    },
    routeTestimonials: [
      {
        name: 'Pastacieo',
        timeAgo: 'Août 2024',
        heading: "L'ascension d'une vie !",
        quote: [{text: 'Notre ascension du Kilimandjaro avec '}, {text: 'Asili Explorer African Safaris', bold: true}, {text: " fut véritablement extraordinaire ! Du début à la fin, l'équipe a assuré une expérience inoubliable, rendant notre voyage vers le sommet fluide, sûr et mémorable."}],
      },
      {
        name: 'Danny G',
        timeAgo: 'Sept. 2023',
        heading: 'Une randonnée hors du commun',
        quote: [{text: "Il n'est pas surprenant qu'Asili Explorer African Safaris maintienne une "}, {text: 'réputation 5 étoiles', bold: true}, {text: ". Leur expertise, leur professionnalisme et leur engagement envers la satisfaction client les distinguent. Si vous cherchez la meilleure agence de trekking au Kilimandjaro, ne cherchez plus !"}],
      },
      {
        name: 'Christian R',
        timeAgo: 'Sept. 2024',
        heading: 'Trek du Kilimandjaro vivement recommandé',
        quote: [{text: 'En octobre 2023, nous avons effectué un '}, {text: 'trek de six jours jusqu\'au sommet du Kilimandjaro', bold: true}, {text: " avec Asili Explorer African Safaris. L'expérience fut phénoménale, et je les recommande vivement à quiconque envisage cette aventure."}],
      },
    ].map((t) => ({_type: 'routeTestimonial', _key: key(), name: t.name, timeAgo: t.timeAgo, heading: t.heading, quote: [segmentsToBlock(t.quote)]})),
    routeGuestReviews: {
      heading: 'Ce que disent nos clients',
      items: [
        {name: 'Chelsea H', summitDate: 'Sommet atteint le : 27 janvier 2024', heading: 'Une expérience incroyable', quote: 'Nous avons découvert Asili Explorer African Safaris grâce au Kilimanjaro Porters Assistance Project, car nous voulions soutenir une entreprise qui traite bien ses porteurs…'},
        {name: 'Fabiola N', summitDate: 'Sommet atteint le : 30 août 2024', heading: 'Une lune de miel incroyable !', quote: 'Notre expérience avec Asili Explorer African Safaris fut tout simplement fantastique ! Dès le début de la planification, nous savions que nous étions entre de bonnes mains. Albin a méticuleusement…'},
        {name: 'Adeline P', summitDate: 'Sommet atteint le : 29 septembre 2024', heading: 'Les meilleures vacances de tous les temps', quote: 'Mon amie et moi avons vécu une expérience absolument INCROYABLE avec Asili Explorer African Safaris ! Du début à la fin, chaque détail a été géré avec soin et précision…'},
        {name: 'Anastasia F', summitDate: 'Sommet atteint le : 10 août 2024', heading: "L'ascension d'une vie !", quote: 'Notre ascension du Kilimandjaro avec Asili Explorer African Safaris fut tout simplement extraordinaire ! Notre guide, Godwin, fut phénoménal — ses connaissances approfondies…'},
      ].map((r) => ({_type: 'guestReview', _key: key(), name: r.name, summitDate: r.summitDate, heading: r.heading, quote: r.quote})),
    },
    routePackagesCta: {
      heading: "Forfaits d'ascension du Kilimandjaro",
      body: "Choisissez parmi nos forfaits d'ascension du Kilimandjaro soigneusement conçus, chacun adapté pour offrir la meilleure expérience selon vos préférences, votre niveau de forme physique et l'itinéraire souhaité. Que vous recherchiez une ascension rapide ou un trek prolongé et pittoresque, nous avons l'itinéraire parfait pour vous.",
      ctaLabel: 'Voir les forfaits',
      href: '/kilimanjaro-packages/',
    },
    packageTrustBadges: badges('packageBadge', [
      {title: 'Meilleure garantie de service', description: 'Guides de montagne certifiés, cuisinier et porteurs'},
      {title: 'Réponse rapide', description: 'Assistance 24 h/24 et 7 j/7'},
    ]),
    packageStandardIntro:
      "Chez Asili Climbing Kilimanjaro, nous croyons que chaque randonneur est unique. C'est pourquoi tous nos itinéraires sont flexibles et peuvent être adaptés à votre rythme, vos préférences et vos objectifs. Laissez-nous vous aider à créer une aventure en montagne unique dans votre vie.",
    packageInterestedCta: {
      heading: 'Intéressé par cet itinéraire ?',
      body: "Si cet itinéraire vous enthousiasme, n'attendez plus ! Réservez votre place dès maintenant et préparez-vous pour un voyage inoubliable rempli d'expériences extraordinaires. Réservez votre voyage aujourd'hui et que l'aventure commence !",
      ctaLabel: 'Réserver cet itinéraire',
    },
    packageExpertCta: {
      heading: 'Transformez vos vacances de rêve en réalité avec un expert de la Tanzanie.',
      body: 'Avec un expert de la Tanzanie, vous pouvez personnaliser votre aventure. Nos itinéraires suggérés peuvent être adaptés à vos préférences. Nos spécialistes collaborent avec vous pour concevoir votre voyage parfait !',
      ctaLabel: 'Demander un devis maintenant',
    },
    packageHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: "Tentes sous la Voie lactée en contrebas du sommet du Mont Kilimandjaro"}),
    comboTrustBadges: badges('comboBadge', [
      {title: 'Meilleure garantie de prix et de service', description: 'Meilleurs guides-chauffeurs de safari'},
      {title: 'Réponse rapide', description: 'Assistance 24 h/24 et 7 j/7'},
    ]),
    comboPriceDisclaimer: "*Prix par personne, incluant guide, véhicule de safari, hôtel et frais d'entrée aux parcs, hors vol international (basé sur six personnes)",
    comboStandardIntro:
      'Réalisez le voyage de vos rêves avec Asili Climbing Kilimanjaro. Chez Asili Explorer Tanzania Safari, vous pouvez personnaliser votre voyage. Nos exemples d\'itinéraires sont ajustables selon vos préférences.',
    comboHeroImage: await uploadImage(client, {src: '/images/packages/shared/hero-night.jpg', alt: "Tentes sous la Voie lactée en contrebas du sommet du Mont Kilimandjaro"}),
    safariTrustBadges: badges('safariBadge', [
      {title: 'Meilleure garantie de prix et de service', description: 'Meilleurs guides-chauffeurs de safari'},
      {title: 'Réponse rapide', description: 'Assistance 24 h/24 et 7 j/7'},
    ]),
    safariInterestedCta: {
      heading: 'Intéressé par cet itinéraire ?',
      body: "Si cet itinéraire vous enthousiasme, n'attendez plus ! Réservez votre place dès maintenant et préparez-vous pour un voyage inoubliable rempli d'expériences extraordinaires. Réservez votre voyage aujourd'hui et que l'aventure commence !",
      ctaLabel: 'Réserver cet itinéraire',
    },
  })
  console.log('sharedTripContent-fr created/replaced')
}

async function seedPackagesHubFr() {
  const cards = [
    {title: 'Route Lemosho 8 jours', slug: '8-days-lemosho-route', nights: '7 nuits', summary: 'Avec huit jours de voyage, votre trek du Kilimandjaro sur la route Lemosho dure plus longtemps que les alternatives.', image: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Route Lemosho 8 jours'}},
    {title: 'Route Machame 7 jours', slug: '7-days-machame-route', nights: '6 nuits', summary: "Empruntez la célèbre route Machame, sur un voyage de sept jours au total, vous offrant ainsi encore plus de temps d'acclimatation", image: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Route Machame 7 jours'}},
    {title: 'Route Marangu 6 jours', slug: '6-days-marangu-route', nights: '5 nuits', summary: 'Un voyage de six jours pour gravir le plus haut sommet d\'Afrique par la célèbre route Marangu. Attendez-vous à une variété de paysages…', image: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Route Marangu 6 jours'}},
    {title: 'Route Umbwe 6 jours', slug: '6-days-umbwe-route', nights: '5 nuits', summary: 'La route Umbwe est réputée pour son ascension difficile et abrupte et son sentier magnifique et moins fréquenté.', image: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Route Umbwe 6 jours'}},
    {title: 'Northern Circuit 9 jours', slug: '9-days-northern-circuit-route', nights: '8 nuits', summary: "L'itinéraire le plus récent et le plus long, offrant des vues à 360 degrés et les meilleurs taux de réussite pour atteindre le sommet.", image: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit 9 jours'}},
    {title: 'Route Rongai 7 jours', slug: '7-days-rongai-route', nights: '6 nuits', summary: 'Abordée par le nord, cette route offre une perspective unique du Kilimandjaro et convient parfaitement à ceux…', image: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Route Rongai 7 jours'}},
  ]
  await client.createOrReplace({
    _id: 'packagesHubPage-fr',
    _type: 'packagesHubPage',
    language: 'fr',
    hero: {
      eyebrow: "Toit de l'Afrique.",
      heading: 'Forfaits d\'ascension du Mont Kilimandjaro',
      locationPill: 'Nord de la Tanzanie',
      tagline: 'Choisissez votre itinéraire. Grimpez à votre façon.',
      introHeading: 'Forfaits d\'ascension du Kilimandjaro',
      intro: "Parcourez notre gamme de forfaits Kilimandjaro, chacun conçu pour s'adapter à votre style d'aventure, votre niveau de forme physique et votre emploi du temps. Que vous recherchiez un itinéraire populaire ou une ascension plus calme, hors des sentiers battus, nous avons l'option parfaite pour vous.",
    },
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'packageHubCard', _key: key(), title: card.title, packageSlug: card.slug, nights: card.nights, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
  })
  console.log('packagesHubPage-fr created/replaced')
}

async function seedComboHubFr() {
  const cards = [
    {title: 'Kilimandjaro et Safari 9 jours', href: '/combo/9-days-kilimanjaro-safari/', nights: '8 nuits', summary: "Parfait pour les aventuriers disposant de peu de temps. Gravissez le Mont Kilimandjaro via un itinéraire de 6 jours, puis profitez d'un safari rapide de 3 jours à travers les parcs emblématiques de Tanzanie comme Ngorongoro et Tarangire.", image: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: 'Kilimandjaro et Safari 9 jours'}},
    {title: 'Kilimandjaro et Safari 10 jours', href: '/combo/10-days-kilimanjaro-and-safari/', nights: '9 nuits', summary: 'Une aventure bien équilibrée qui combine une ascension du Kilimandjaro de 7 jours (comme la route Machame) avec un safari de 3 jours — idéal pour découvrir le meilleur de la montagne et de la savane.', image: {src: '/images/combo/shared/7-days-machame-route.webp', alt: 'Kilimandjaro et Safari 10 jours'}},
    {title: 'Kilimandjaro et Safari 11 jours', href: '/combo/11-days-kilimanjaro-safari/', nights: '10 nuits', summary: 'Cette option vous laisse le temps de vous acclimater correctement pendant une ascension de 7 jours, puis de vous détendre avec un safari de 4 jours à travers le Serengeti, le Ngorongoro et d\'autres parcs incontournables.', image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Kilimandjaro et Safari 11 jours'}},
    {title: 'Kilimandjaro et Safari 12 jours', href: '/combo/12-days-kilimanjaro-safari/', nights: '11 nuits', summary: 'Une expérience complète pour les amoureux de la nature. Gravissez le plus haut sommet d\'Afrique en 8 jours (comme la route Lemosho) puis enchaînez avec 4 jours inoubliables à suivre la faune en safari.', image: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: 'Kilimandjaro et Safari 12 jours'}},
    {title: 'Kilimandjaro et Safari 13 jours', nights: '12 nuits', summary: 'Conçu pour les voyageurs qui veulent prendre leur temps. Comprend une ascension du Kilimandjaro plus longue et un safari approfondi, permettant à la fois un trek bien rythmé et des safaris-photos immersifs.', image: {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: 'Kilimandjaro et Safari 13 jours'}},
    {title: 'Kilimandjaro et Safari 14 jours', nights: '13 nuits', summary: 'Le voyage ultime de deux semaines en Tanzanie. Commencez par un itinéraire du Kilimandjaro pittoresque et moins fréquenté, puis plongez dans un circuit de safari complet couvrant le Serengeti, le Ngorongoro, Tarangire et bien plus encore.', image: {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: 'Kilimandjaro et Safari 14 jours'}},
  ]
  await client.createOrReplace({
    _id: 'comboHubPage-fr',
    _type: 'comboHubPage',
    language: 'fr',
    intro: {
      heading: 'Forfaits combinés',
      body: [
        'Gravissez le toit de l\'Afrique, puis détendez-vous en pleine nature sauvage. Un seul voyage, deux expériences inoubliables.',
        "Chez Asili Climbing Kilimanjaro, nous pensons que l'aventure tanzanienne ultime va au-delà d'une seule destination. Nos forfaits combinés Kilimandjaro et Safari sont conçus pour les voyageurs qui veulent tout — le défi de gravir le Mont Kilimandjaro associé au frisson d'un safari classique de la faune africaine. Ces itinéraires soigneusement élaborés combinent deux expériences incontournables en un seul voyage fluide et gratifiant.",
        "Que vous trekkiez sur l'emblématique route Lemosho ou que vous conquériez la pittoresque route Marangu, votre ascension peut se transformer harmonieusement en un safari passionnant à travers les parcs nationaux les plus légendaires de Tanzanie — Serengeti, cratère du Ngorongoro, Tarangire, lac Manyara, et bien plus encore.",
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
    cta: {label: 'Prêt à relever le défi ?', href: '/contact-us/'},
  })
  console.log('comboHubPage-fr created/replaced')
}

async function run() {
  await seedSharedFr()
  await seedPackagesHubFr()
  await seedComboHubFr()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
