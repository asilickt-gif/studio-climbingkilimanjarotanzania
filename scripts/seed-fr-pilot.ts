/**
 * Phase 5 pilot: seed French (fr) content for a representative slice of the
 * site so the translation workflow + quality can be reviewed before
 * translating the full ~65-document corpus.
 *
 * Covers: homePage-fr, climbingKilimanjaroPage-fr, siteSettings-fr
 * (singletons — no translation.metadata needed, fixed `<type>-fr` id only),
 * plus one `article` and one `trip` document (repeatables — these DO need a
 * `translation.metadata` document linking the new fr doc to its en source,
 * per @sanity/document-internationalization's expected shape).
 *
 * Translations are authored directly in this file (by Claude, per the
 * approved "AI-draft + human review" workflow) rather than via Sanity
 * Assist, which requires a paid AI Assistance token that isn't enabled on
 * this project. Human review of this draft should happen in Studio before
 * publishing/flipping `fr` active in i18n/routing.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-pilot.ts --with-user-token
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

/** Links a newly created fr document to its already-published en source via a translation.metadata doc. */
async function linkTranslation(type: string, enId: string, frId: string) {
  const metaId = `translation.metadata.${type}.${enId}`
  await client.createOrReplace({
    _id: metaId,
    _type: 'translation.metadata',
    schemaTypes: [type],
    translations: [
      {
        _key: key(),
        _type: 'internationalizedArrayReferenceValue',
        language: 'en',
        value: {_type: 'reference', _ref: enId, _weak: true, _strengthenOnPublish: {type}},
      },
      {
        _key: key(),
        _type: 'internationalizedArrayReferenceValue',
        language: 'fr',
        value: {_type: 'reference', _ref: frId, _weak: true, _strengthenOnPublish: {type}},
      },
    ],
  })
  console.log(`  linked translation.metadata for ${type} (${enId} <-> ${frId})`)
}

// ---------- homePage-fr ----------

async function seedHomeFr() {
  const d = homeData

  const destinationsFr = [
    {
      ...d.hero.destinations[0],
      eyebrow: 'Mont Kilimandjaro',
      heading: "Toit de l'Afrique",
      body: "Relevez le défi d'un trek inoubliable jusqu'au sommet de la plus haute montagne indépendante du monde.",
      stats: [
        {label: 'Expérience', value: 'Trek en montagne'},
        {label: 'Durée', value: '6 à 9 jours'},
        {label: 'Altitude', value: '5 895 m'},
      ],
    },
    {
      ...d.hero.destinations[1],
      eyebrow: 'Safari en Tanzanie',
      heading: "Cœur sauvage de l'Afrique",
      body: 'Parcourez le Serengeti, le cratère du Ngorongoro et Tarangire à la recherche des Big Five et de la Grande Migration.',
      stats: [
        {label: 'Expérience', value: 'Safaris-photos'},
        {label: 'Durée', value: '5 à 9 jours'},
        {label: 'Faune', value: 'Les Big Five'},
      ],
    },
    {
      ...d.hero.destinations[2],
      eyebrow: 'Archipel de Zanzibar',
      heading: 'Paradis tropical',
      body: "Détendez-vous sur des plages de sable blanc, plongez dans des récifs turquoise et flânez dans les ruelles parfumées d'épices de la ville historique de Stone Town.",
      stats: [
        {label: 'Expérience', value: 'Plage et culture'},
        {label: 'Durée', value: '3 à 6 jours'},
        {label: 'Littoral', value: 'Océan Indien'},
      ],
    },
  ]
  const posterAltFr = [
    'Ascension du Mont Kilimandjaro',
    'Safari-photo dans le Serengeti',
    'Plage de Zanzibar et océan turquoise',
  ]
  const thumbnailAltFr = [
    'Panneau du sommet Uhuru Peak, Mont Kilimandjaro',
    'Parc national du Serengeti',
    'Plage de Paje, Zanzibar',
  ]

  const destinations = []
  for (let i = 0; i < d.hero.destinations.length; i++) {
    const dest = d.hero.destinations[i]
    const fr = destinationsFr[i]
    destinations.push({
      _type: 'heroDestination',
      _key: key(),
      key: dest.key,
      eyebrow: fr.eyebrow,
      heading: fr.heading,
      body: fr.body,
      stats: fr.stats.map((stat) => ({_type: 'heroStat', _key: key(), label: stat.label, value: stat.value})),
      mediaType: dest.media.type,
      ...(dest.media.type === 'video'
        ? {videoSrc: dest.media.src, poster: await uploadImage(client, {src: dest.media.poster.src, alt: posterAltFr[i]})}
        : {image: await uploadImage(client, dest.media.image)}),
      thumbnail: await uploadImage(client, {src: dest.thumbnail.src, alt: thumbnailAltFr[i]}),
      ctaHref: dest.ctaHref,
    })
  }

  const featuresFr = [
    {
      title: 'Détenu et exploité localement',
      description:
        "En tant qu'entreprise tanzanienne, nous connaissons la terre, les habitants et la montagne comme personne d'autre. Vous ne grimpez pas seulement avec des guides, vous grimpez avec une famille.",
    },
    {
      title: 'Guides de montagne experts',
      description:
        'Tous nos guides sont certifiés, expérimentés et formés au trekking en haute altitude. Votre sécurité et votre réussite sont nos priorités absolues.',
    },
    {
      title: 'Itinéraires sur mesure',
      description:
        'Que vous soyez un randonneur débutant ou un aventurier chevronné, nous proposons des itinéraires du Kilimandjaro personnalisables selon votre rythme, vos objectifs et votre emploi du temps.',
    },
  ]

  const introBodyFr: {text: string; bold?: boolean; href?: string}[][] = [
    [
      {text: "L'ascension du Mont Kilimandjaro", bold: true, href: '/climbing-mount-kilimanjaro/'},
      {text: " n'est pas une simple randonnée, c'est une aventure qui change une vie. Avec "},
      {text: 'Climbing Kilimanjaro Tanzania', bold: true},
      {
        text: ', chaque détail est soigneusement géré pour que votre voyage soit fluide, sûr et véritablement inoubliable lors de l\'ascension de ',
      },
      {text: "la plus haute montagne d'Afrique", bold: true},
      {text: '.'},
    ],
    [
      {text: "Dès l'instant où nous vous accueillons à "},
      {text: "l'aéroport", bold: true},
      {
        text: ", en passant par la préparation du matériel et l'accompagnement expert sur le sentier, jusqu'à la célébration au sommet, nous sommes avec vous à chaque étape. La plupart des randonneurs choisissent leur ",
      },
      {text: 'itinéraire du Kilimandjaro', bold: true},
      {text: " en fonction du temps d'acclimatation, des paysages et des taux de réussite au sommet."},
    ],
    [
      {text: 'Que vous préfériez un '},
      {text: 'itinéraire populaire', bold: true},
      {text: ' ou une expérience plus tranquille, hors des sentiers battus, nous avons le '},
      {text: 'trek du Kilimandjaro', bold: true},
      {text: ' idéal pour vous. Tous nos '},
      {text: 'forfaits', bold: true},
      {
        text: " offrent des dates de départ flexibles, et les treks privés peuvent commencer n'importe quel jour. Des ",
      },
      {text: 'itinéraires', bold: true},
      {text: " plus longs permettent une meilleure acclimatation, augmentant considérablement vos chances d'atteindre le sommet."},
    ],
    [
      {text: 'Lors d\'une '},
      {text: 'ascension privée', bold: true},
      {text: ', votre groupe est accompagné par une équipe dédiée de '},
      {text: 'guides', bold: true},
      {
        text: " professionnels, de porteurs et d'un cuisinier personnel, avec des repas servis dans une tente-restaurant privée. Bien que les sentiers et les campements soient partagés avec d'autres randonneurs, votre expérience reste confortable, personnalisée et bien encadrée.",
      },
    ],
    [
      {text: "Nous sommes fiers d'être l'une des principales entreprises locales pour l'ascension du "},
      {text: 'Mont Kilimandjaro', bold: true},
      {text: ', engagés à offrir des expériences de sommet sûres, mémorables et gratifiantes.'},
    ],
  ]

  const introFeaturesFr = [
    {
      title: 'Une équipe locale accueillante',
      description: "Nés et élevés à l'ombre du Kilimandjaro, nous connaissons la montagne comme notre propre famille.",
    },
    {
      title: 'Un trekking sûr et à un rythme adapté',
      description:
        'Nous avançons « pole pole » (doucement). Des ascensions soigneusement guidées, des vérifications de confort et un accompagnement complet.',
    },
    {
      title: "Une vraie connexion, pas seulement un circuit",
      description:
        'Vous repartirez avec bien plus que des photos du sommet — avec des liens durables et une histoire à raconter.',
    },
  ]

  const routeGuideItemsFr = [
    {name: 'Lemosho / Shira (7 à 9 jours) :', detail: "Offre une excellente acclimatation, des paysages magnifiques et de grandes chances d'atteindre le sommet."},
    {name: 'Machame (6 à 8 jours) :', detail: 'Très populaire et pittoresque ; souvent surnommée la « Whiskey Route ».'},
    {name: 'Rongai (6 à 7 jours) :', detail: 'Un itinéraire plus tranquille et plus sec, idéal pendant la saison des pluies.'},
    {name: 'Marangu (5 à 6 jours) :', detail: "L'itinéraire le plus court, connu pour son tracé simple et son hébergement en refuges."},
  ]

  const kiliCardTitlesFr = [
    'Route Machame 9 jours – Circuits en petit groupe',
    'Trek du Mont Kilimandjaro – Route Machame 6 jours',
    'Trek du Mont Kilimandjaro – Route Lemosho 8 jours',
    'Trek du Mont Kilimandjaro – Route Machame 7 jours',
    'Trek du Mont Kilimandjaro – Route Marangu 6 jours',
    'Trek du Mont Kilimandjaro – Route Rongai 6 jours',
  ]
  const kiliCardTourTypeFr = ['Petit groupe / Basique', 'Privé • Basique', 'Privé • Basique', 'Privé • Basique', 'Privé • Basique', 'Privé • Basique']
  const kiliCardLocationFr = [
    'Arusha › Machame › Kilimandjaro',
    'Arusha › Kilimandjaro',
    'Arusha › Kilimandjaro',
    'Arusha › Kilimandjaro',
    'Arusha › Kilimandjaro',
    'Arusha › Kilimandjaro',
  ]

  const safariCardTitlesFr = [
    'Safari de la migration sur la rivière Mara - 07 jours',
    'Safari Simba - 05 jours',
    'Tanzanie Classique - 07 jours',
    'Expérience Confort Tanzanie - 07 jours',
    'Expérience Safari Glamping Tanzanie - 05 jours',
    'Safari de la migration des gnous - 09 jours',
  ]
  const safariCardTourTypeFr = ['Privé • Confort', 'Privé • Confort', 'Privé • Confort', 'Privé • Confort', 'Privé • Confort', 'Privé • Confort Plus']
  const safariCardLocationFr = [
    'Arusha › Serengeti central › Cratère du Ngorongoro',
    'Parc national du Serengeti › Ngorongoro › Cratère du Ngorongoro',
    'Arusha › Lac Manyara › Serengeti › Serengeti central › Ngorongoro',
    'Arusha › Parc national de Tarangire › Serengeti › Ngorongoro',
    'Arusha › Parc national de Tarangire › Serengeti › Ngorongoro',
    'Arusha › Lac Manyara › Serengeti › Ngorongoro › Tarangire',
  ]

  const zanzibarCardTitlesFr = [
    'Zanzibar Océan Indien - 06 jours',
    'Océan Indien de Zanzibar - 06 jours',
    "L'île de Zanzibar en Tanzanie - 05 jours",
    'Une lune de miel à Zanzibar - 06 jours',
    "Découvrir l'île de Zanzibar - 03 jours",
    "Découvrir l'Océan Indien - 06 jours",
  ]
  const zanzibarCardTourTypeFr = ['Privé • Luxe', 'Privé • Confort', 'Privé • Luxe', 'Privé • Basique', 'Privé • Basique', 'Privé • Basique']
  const zanzibarCardLocationFr = [
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Stone Town Zanzibar › Zanzibar',
    'Aéroport international Abeid Amani Karume › Zanzibar › Stone Town Zanzibar',
    'Zanzibar › Stone Town Zanzibar',
  ]

  const routeOptionsFr = [
    {
      title: 'Route Marangu 5 jours',
      summary: "Un voyage de cinq jours pour gravir le plus haut sommet d'Afrique par la célèbre route Marangu. Attendez-vous à une variété de paysages…",
      duration: '5 jours / 4 nuits de randonnée + 2 nuits d\'hôtel',
      prices: ['1 randonneur seul - $2,008 p/p', '2 randonneurs partageant - $1,783 p/p', '3 à 4 randonneurs partageant - $1,678 p/p'],
    },
    {
      title: 'Route Marangu 6 jours',
      summary: "Un voyage de six jours pour gravir le plus haut sommet d'Afrique par la célèbre route Marangu. Attendez-vous à une variété de paysages…",
      duration: "6 jours / 5 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $2,308 p/p', '2 randonneurs partageant - $1,928 p/p', '3 à 4 randonneurs partageant - $1,678 p/p'],
    },
    {
      title: 'Route Machame ou Umbwe 6 jours',
      summary: 'La route Umbwe est réputée pour son ascension difficile et abrupte et son sentier magnifique et moins fréquenté.',
      duration: "6 jours / 5 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $2,308 p/p', '2 randonneurs partageant - $2,058 p/p', '3 à 4 randonneurs partageant - $2,058 p/p'],
    },
    {
      title: 'Route Machame ou Umbwe 7 jours',
      summary: 'Empruntez la célèbre route Machame, sur un voyage de sept jours au total, vous offrant ainsi encore plus de temps d\'acclimatation',
      duration: "7 jours / 6 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $2,608 p/p', '2 randonneurs partageant - $2,608 p/p', '3 à 4 randonneurs partageant - $2,348 p/p'],
    },
    {
      title: "6 jours / 5 nuits de randonnée + 2 nuits d'hôtel",
      summary: "Un voyage de six jours pour gravir le plus haut sommet d'Afrique par la célèbre route Marangu. Attendez-vous à une variété de paysages…",
      duration: "6 jours / 5 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $2,648 p/p', '2 randonneurs partageant - $2,648 p/p', '3 à 4 randonneurs partageant - $2,063 p/p'],
    },
    {
      title: 'Route Shira, Lemosho ou Rongai 7 jours',
      summary: 'Abordée par le nord, cette route offre une perspective unique du Kilimandjaro et convient parfaitement à ceux…',
      duration: "7 jours / 6 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $2,938 p/p', '2 randonneurs partageant - $2,938 p/p', '3 à 4 randonneurs partageant - $2,313 p/p'],
    },
    {
      title: 'Route Shira, Lemosho ou Rongai 8 jours',
      summary: 'Abordée par le nord, cette route offre une perspective unique du Kilimandjaro et convient parfaitement à ceux…',
      duration: "8 jours / 7 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $3,228 p/p', '2 randonneurs partageant - $2,773 p/p', '3 à 4 randonneurs partageant - $2,568 p/p'],
    },
    {
      title: "8 jours / 7 nuits de randonnée + 2 nuits d'hôtel",
      summary: 'Empruntez la célèbre route Machame, sur un voyage de sept jours au total, vous offrant ainsi encore plus de temps d\'acclimatation',
      duration: "8 jours / 7 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $3,588 p/p', '2 randonneurs partageant - $2,938 p/p', '3 à 4 randonneurs partageant - $2,938 p/p'],
    },
    {
      title: 'Route Northern Circuit 9 jours, location de toilettes incluse',
      summary: 'L\'itinéraire le plus récent et le plus long, offrant des vues à 360 degrés et les meilleurs taux de réussite pour atteindre le sommet.',
      duration: "9 jours / 8 nuits de randonnée + 2 nuits d'hôtel",
      prices: ['1 randonneur seul - $3,918 p/p', '2 randonneurs partageant - $3,228 p/p', '3 à 4 randonneurs partageant - $3,228 p/p'],
    },
  ]

  const whyUsCardsFr = [
    {
      title: '100 % propriété locale',
      description:
        "Nous ne sommes pas un opérateur touristique étranger — nous sommes nés et avons grandi à Moshi, à l'ombre du Kilimandjaro. Quand vous grimpez avec Asili, vous soutenez directement des familles et des communautés locales, et vous vivez la montagne à travers les yeux de ceux qui la connaissent le mieux.",
    },
    {
      title: 'Normes de sécurité les plus élevées',
      description:
        'Nous transportons de l\'oxygène d\'urgence, des oxymètres de pouls, et effectuons des contrôles de santé deux fois par jour. Nos guides sont formés pour détecter et gérer précocement le mal des montagnes. Votre sécurité est notre priorité — toujours.',
    },
    {
      title: 'Ascensions privées, dates flexibles et options personnalisées',
      description:
        "Envie de grimper en solo, en couple ou avec un petit groupe d'amis ? Nous proposons des départs privés adaptés à votre emploi du temps. Votre rythme. Votre parcours. Votre Kilimandjaro.",
    },
    {
      title: 'Taux de réussite au sommet prouvés',
      description:
        "Grâce à notre approche axée sur l'acclimatation, un rythme adapté et un personnel expérimenté, nous affichons un taux de réussite au sommet de plus de 95 % sur nos itinéraires les plus longs. Lorsque vous nous confiez votre rêve, nous faisons tout pour vous aider à l'accomplir.",
    },
    {
      title: "Prise en charge à l'aéroport, réservation d'hôtel et accompagnement complet",
      description:
        "Dès votre atterrissage à l'aéroport du Kilimandjaro jusqu'à votre arrivée à Uhuru Peak, nous sommes à vos côtés. Transferts aéroport, vérification du matériel, réservations d'hôtel et aide logistique — tout cela fait partie de l'expérience Asili.",
    },
    {
      title: 'Des treks justes et éthiques',
      description:
        "Fiers soutiens du Kilimanjaro Porters Assistance Project (KPAP), nous veillons à ce que chaque porteur soit payé équitablement, correctement nourri et équipé de matériel de qualité. Quand vous grimpez avec Asili, vous grimpez avec intégrité.",
    },
  ]

  const comboTilesFr = [
    {title: 'Kilimandjaro et safari faune sauvage', subtitle: '12 jours en Tanzanie'},
    {title: 'Kilimandjaro et safari faune sauvage', subtitle: '10 jours en Tanzanie'},
    {title: 'Kilimandjaro, Serengeti et Ngorongoro', subtitle: '12 jours en Tanzanie'},
    {title: 'Kilimandjaro, Tarangire et lac Manyara', subtitle: '10 jours d\'ascension du Kili et de safari faune sauvage'},
  ]

  const testimonialsFr = [
    {
      timeAgo: 'il y a 9 mois',
      quote:
        "Cette entreprise a réalisé mon rêve de gravir le Kilimandjaro ! Un excellent accompagnement, des repas délicieux sur la montagne, et une…",
    },
    {
      timeAgo: 'il y a 9 mois',
      quote:
        "Fortement recommandé pour quiconque prévoit de gravir la plus haute montagne d'Afrique. L'équipe était très solidaire, la nourriture…",
    },
  ]

  const faqQ = {
    q1: 'Combien de temps faut-il pour gravir le Mont Kilimandjaro ?',
    a1: 'La durée dépend de l\'itinéraire choisi. La plupart des ascensions du Kilimandjaro durent entre 6 et 9 jours. Les itinéraires plus longs offrent plus de temps d\'acclimatation, ce qui augmente vos chances d\'atteindre le sommet avec succès.',
    q2: "Ai-je besoin d'une expérience d'escalade préalable ?",
    a2: 'Aucune expérience technique d\'escalade préalable n\'est requise. Cependant, une bonne condition physique et une préparation mentale sont essentielles, car le Kilimandjaro est un trek en haute altitude, et non une escalade technique.',
    q3: 'Quelle est la meilleure période pour gravir le Kilimandjaro ?',
    a3: 'Les meilleurs mois pour l\'ascension sont de janvier à mars et de juin à octobre, lorsque le temps est généralement sec et la visibilité dégagée.',
    q4: "Quel type d'hébergement est proposé pendant l'ascension ?",
    a4: "L'hébergement varie selon l'itinéraire. La plupart des itinéraires proposent des tentes de montagne confortables, tandis que la route Marangu offre un hébergement en refuges le long du sentier.",
    q5: "Que dois-je emporter pour l'ascension ?",
    a5: "Vous aurez besoin de bonnes chaussures de randonnée, de vêtements chauds, d'un sac de couchage, d'équipement imperméable et d'effets personnels essentiels. Nous vous fournirons une liste détaillée pour vous aider à préparer votre voyage.",
    q6: 'Le mal des montagnes est-il fréquent sur le Kilimandjaro ?',
    a6: "Oui, le mal des montagnes peut affecter n'importe qui, quel que soit son niveau de forme physique. Nos guides sont formés pour surveiller étroitement votre santé et garantir une ascension sûre et progressive pour une meilleure acclimatation.",
    q7: 'Pourquoi réserver avec Climbing Kilimanjaro Tanzania ?',
    a7: 'Nous sommes un opérateur touristique local et expérimenté, avec des guides de montagne professionnels, un équipement de haute qualité et un service personnalisé pour garantir une ascension sûre, agréable et mémorable.',
  }
  const faqItem = (q: string, a: string) => ({_type: 'faqItem', _key: key(), question: q, answer: a})

  await client.createOrReplace({
    _id: 'homePage-fr',
    _type: 'homePage',
    language: 'fr',
    hero: {
      exploreLabel: 'Explorer',
      primaryCtaLabel: 'Voir les forfaits',
      secondaryCtaLabel: 'Personnaliser le voyage',
      secondaryCtaHref: d.hero.secondaryCtaHref,
      destinations,
    },
    features: featuresFr.map((item) => ({_type: 'featureItem', _key: key(), title: item.title, description: item.description})),
    intro: {
      heading: "De l'arrivée au sommet — nous nous occupons de tout.",
      body: segmentParagraphsToPt(introBodyFr),
      ctaLabel: 'En savoir plus sur nous',
      ctaHref: d.intro.ctaHref,
      image: await uploadImage(client, {src: d.intro.image.src, alt: 'Randonneur sur le Mont Kilimandjaro'}),
    },
    introFeatures: introFeaturesFr.map((item) => ({_type: 'introFeature', _key: key(), title: item.title, description: item.description})),
    routeGuide: {
      eyebrow: 'Choisissez votre itinéraire. Grimpez à votre façon. Guide complet des tarifs et conseils de réservation avec des guides locaux',
      heading: 'Guide des aventures en Tanzanie : safaris, Kilimandjaro et vacances à Zanzibar',
      items: routeGuideItemsFr.map((item) => ({_type: 'routeGuideItem', _key: key(), name: item.name, detail: item.detail})),
    },
    kilimanjaroPackages: {
      heading: 'Forfaits circuits Kilimandjaro',
      viewAllHref: d.kilimanjaroPackages.viewAllHref,
      cards: await Promise.all(
        d.kilimanjaroPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: kiliCardTitlesFr[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: kiliCardTourTypeFr[i],
          tourId: card.tourId,
          price: card.price,
          location: kiliCardLocationFr[i],
        })),
      ),
    },
    safariPackages: {
      heading: 'Forfaits safaris et circuits',
      viewAllHref: d.safariPackages.viewAllHref,
      cards: await Promise.all(
        d.safariPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: safariCardTitlesFr[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: safariCardTourTypeFr[i],
          tourId: card.tourId,
          price: card.price,
          location: safariCardLocationFr[i],
        })),
      ),
    },
    zanzibarPackages: {
      heading: 'Forfaits circuits Zanzibar',
      viewAllHref: d.zanzibarPackages.viewAllHref,
      cards: await Promise.all(
        d.zanzibarPackages.cards.map(async (card, i) => ({
          _type: 'tourCard',
          _key: key(),
          title: zanzibarCardTitlesFr[i],
          href: card.href,
          image: await uploadImage(client, card.image),
          tourType: zanzibarCardTourTypeFr[i],
          tourId: card.tourId,
          price: card.price,
          location: zanzibarCardLocationFr[i],
        })),
      ),
    },
    routeOptions: {
      heading: 'Choisissez votre itinéraire : comparez tous les forfaits et itinéraires du Kilimandjaro avec un guide local',
      cards: await Promise.all(
        d.routeOptions.cards.map(async (card, i) => ({
          _type: 'routeOptionCard',
          _key: key(),
          title: routeOptionsFr[i].title,
          href: card.href,
          image: await uploadImage(client, card.image),
          summary: routeOptionsFr[i].summary,
          duration: routeOptionsFr[i].duration,
          prices: routeOptionsFr[i].prices,
        })),
      ),
    },
    notSureBand: {
      heading: 'Vous ne savez pas quel itinéraire vous convient ?',
      body: "Nous proposons une gamme d'itinéraires du Kilimandjaro adaptés à votre condition physique, votre emploi du temps et votre style de trekking. Que vous recherchiez de beaux paysages, moins de monde ou le meilleur taux de réussite, nous vous aiderons à choisir le parcours idéal vers le sommet.",
      ctaLabel: 'Appelez maintenant',
      ctaHref: d.notSureBand.ctaHref,
    },
    whyUs: {
      heading: 'Pourquoi grimper le Kilimandjaro avec nous ?',
      body: 'Choisir la bonne équipe peut faire la différence entre une simple randonnée et une aventure qui change une vie.',
      cards: whyUsCardsFr.map((card, i) => ({
        _type: 'whyUsCard',
        _key: key(),
        title: card.title,
        description: card.description,
        icon: d.whyUs.cards[i].icon,
      })),
    },
    comboExperience: {
      heading: 'Expérience Ascension du Kilimandjaro & Safari',
      body: "Rendez votre aventure tanzanienne véritablement inoubliable : gravissez le majestueux Mont Kilimandjaro, puis explorez les parcs de safari les plus emblématiques d'Afrique. Avec Asili, votre ascension et votre safari s'enchaînent parfaitement, guidés par des experts locaux qui connaissent chaque sentier, chaque paysage et chaque instant qui mérite d'être vécu.",
      cardTitle: 'Grimpez plus haut. Explorez plus sauvage. Vivez un voyage inoubliable',
      cardBody:
        "Atteignez le sommet de la plus haute montagne indépendante du monde, puis plongez dans la nature sauvage à couper le souffle de la Tanzanie. Avec nos forfaits Kilimandjaro + Safari, profitez du mélange parfait d'aventure : conquérir le Kilimandjaro, puis découvrir les merveilles du Serengeti, du cratère du Ngorongoro et du parc national de Tarangire.",
      ctaLabel: 'Commençons à planifier',
      ctaHref: d.comboExperience.ctaHref,
      tiles: await Promise.all(
        d.comboExperience.tiles.map(async (tile, i) => ({
          _type: 'comboTile',
          _key: key(),
          title: comboTilesFr[i].title,
          subtitle: comboTilesFr[i].subtitle,
          href: tile.href,
          image: await uploadImage(client, tile.image),
        })),
      ),
      body2:
        "Atteignez le sommet de la plus haute montagne indépendante du monde, puis plongez dans la nature sauvage à couper le souffle de la Tanzanie. Avec nos forfaits Kilimandjaro + Safari, profitez du mélange parfait d'aventure : conquérir le Kilimandjaro, puis découvrir les merveilles du Serengeti, du cratère du Ngorongoro et du parc national de Tarangire.",
      viewToursLabel: 'Voir plus de circuits',
      viewToursHref: d.comboExperience.viewToursHref,
    },
    testimonials: {
      heading: 'Ce que disent nos grimpeurs satisfaits',
      items: d.testimonials.items.map((item, i) => ({
        _type: 'testimonial',
        _key: key(),
        name: item.name,
        timeAgo: testimonialsFr[i].timeAgo,
        rating: item.rating,
        quote: testimonialsFr[i].quote,
      })),
    },
    faq: {
      heading: 'Questions fréquentes',
      tabs: [
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Toutes les questions',
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
          label: 'Période pour gravir le Kilimandjaro',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q3, faqQ.a3)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Hébergement',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2), faqItem(faqQ.q6, faqQ.a6), faqItem(faqQ.q7, faqQ.a7)],
        },
        {
          _type: 'faqTab',
          _key: key(),
          label: 'Réservation',
          faqs: [faqItem(faqQ.q1, faqQ.a1), faqItem(faqQ.q2, faqQ.a2)],
        },
      ],
    },
  })
  console.log('homePage-fr created/replaced')
}

// ---------- climbingKilimanjaroPage-fr ----------

async function seedClimbFr() {
  const d = climbingKilimanjaroPageData

  await client.createOrReplace({
    _id: 'climbingKilimanjaroPage-fr',
    _type: 'climbingKilimanjaroPage',
    language: 'fr',
    trustBadges: {
      heading: "Forfaits d'ascension du Kilimandjaro",
      badges: [
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Meilleur choix TripAdvisor',
          description:
            "Avec des centaines d'avis excellents, notre engagement envers la qualité et la satisfaction client nous distingue parmi les opérateurs de circuits au Kilimandjaro.",
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Fiables et expérimentés',
          description:
            "Nos guides hautement qualifiés assurent une ascension bien encadrée, en donnant la priorité à la sécurité, à un trekking éthique et à un parcours sans encombre vers le sommet.",
        },
        {
          _type: 'trustBadge',
          _key: key(),
          title: 'Basés en Tanzanie',
          description:
            "Nous organisons des expériences de trekking personnalisées au Kilimandjaro, des ascensions économiques aux expéditions de luxe, toutes fondées sur des pratiques d'escalade responsables et éthiques.",
        },
      ],
    },
    challengeBand: {
      heading: 'Prêt à relever le défi du Kilimandjaro ?',
      body: "Votre voyage vers le Toit de l'Afrique commence ici. Que vous visiez l'aventure d'une vie ou que vous cherchiez à repousser vos limites jusqu'au sommet, nous sommes là pour vous guider à chaque étape.",
      backgroundImage: await uploadImage(client, d.challengeBand.backgroundImage),
      primaryCtaLabel: 'Défi du sommet',
      secondaryCtaLabel: "Commencer l'ascension",
    },
    routeSelector: {
      heading: "Itinéraires et cartes d'ascension du Kilimandjaro",
      tabs: await Promise.all([
        {
          name: 'Route Machame',
          body: "Connue sous le nom de Whiskey Route, Machame est l'itinéraire le plus populaire du Kilimandjaro, offrant des paysages à couper le souffle et un terrain varié. Bien que difficile avec des sentiers escarpés et des campements sous tente, elle offre une excellente acclimatation pour les grimpeurs recherchant un trek plus court mais gratifiant.",
          map: d.routeSelector.tabs[0].map,
        },
        {
          name: 'Route Lemosho',
          body: "L'un des itinéraires les plus pittoresques du Kilimandjaro, Lemosho débute à la porte isolée de Londorossi et traverse le magnifique plateau de Shira. En fin de compte, il existe un itinéraire pour tous ceux qui souhaitent vivre l'aventure de l'ascension du Kilimandjaro.",
          map: d.routeSelector.tabs[1].map,
        },
        {
          name: 'Route Rongai',
          body: 'Seul itinéraire nordique du Kilimandjaro, Rongai est moins fréquenté et plus doux, ce qui en fait un excellent choix pour ceux qui préfèrent une ascension calme et régulière. Cet itinéraire est idéal pendant la saison des pluies car il reçoit moins de précipitations et offre un trek agréable à travers une nature sauvage préservée.',
          map: d.routeSelector.tabs[2].map,
        },
        {
          name: 'Route Northern Circuit',
          body: "L'itinéraire le plus long et le plus pittoresque, le Northern Circuit offre la meilleure acclimatation en contournant progressivement le Kilimandjaro. Avec des vues panoramiques et un taux de réussite élevé, cet itinéraire offre une expérience de trekking paisible et immersive.",
          map: d.routeSelector.tabs[3].map,
        },
      ].map(async (tab) => ({_type: 'routeTab', _key: key(), name: tab.name, body: tab.body, map: await uploadImage(client, tab.map)}))),
    },
    conquerBand: {
      heading: 'Conquérez le Kilimandjaro. Vivez l\'aventure.',
      body: 'Repoussez vos limites et tenez-vous au point culminant de l\'Afrique. Relevez le défi du Kilimandjaro et transformez votre rêve en réalité !',
      backgroundImage: await uploadImage(client, d.conquerBand.backgroundImage),
      primaryCtaLabel: "Dominez l'Afrique",
      secondaryCtaLabel: 'Commencez votre ascension',
      primaryCtaHref: d.conquerBand.primaryCtaHref,
      secondaryCtaHref: d.conquerBand.secondaryCtaHref,
    },
    promoStrip: {
      heading: "Conquérez le Kilimandjaro. Vivez l'aventure.",
      cards: await Promise.all([
        {
          title: '📖 Consultez notre guide du Kilimandjaro',
          body: 'Obtenez toutes les informations essentielles pour préparer votre ascension. Notre guide couvre tout, des itinéraires aux conseils de sécurité, pour une ascension fluide et réussie.',
          linkLabel: 'Lire la suite',
          href: d.promoStrip.cards[0].href,
          backgroundImage: d.promoStrip.cards[0].backgroundImage,
        },
        {
          title: '🎯 Conseils d\'experts pour votre ascension',
          body: 'Bien que le Kilimandjaro accueille des grimpeurs de tous niveaux, il est essentiel de trekker avec prudence. Nos guides expérimentés surveillent votre santé et vous apportent un soutien complet pour un voyage sûr et agréable.',
          linkLabel: 'Lire la suite',
          href: d.promoStrip.cards[1].href,
          backgroundImage: d.promoStrip.cards[1].backgroundImage,
        },
        {
          title: "🎒 Votre liste d'équipement pour le Kilimandjaro",
          body: "Soyez pleinement préparé grâce à notre liste d'équipement complète, détaillant tout le matériel essentiel dont vous aurez besoin pour une ascension confortable et réussie.",
          linkLabel: "Voir la liste d'équipement",
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
        label: "Choix d'itinéraires",
        heading: 'Quels itinéraires sont disponibles pour le Kilimandjaro ?',
        intro: segmentParagraphsToPt([
          [
            {
              text: 'Le Mont Kilimandjaro propose plusieurs itinéraires adaptés aux grimpeurs de tous niveaux, préférences et styles de trekking. Chaque itinéraire offre une expérience unique, allant d\'un rythme détendu à une aventure plus exigeante, avec des hébergements variés allant du camping à des installations plus confortables.',
            },
          ],
          [
            {text: 'Chez '},
            {text: 'Asili Explorer African Safaris,', bold: true},
            {text: ' nous sommes spécialisés dans les quatre itinéraires les plus populaires du Kilimandjaro : '},
            {text: 'Rongai Route, Lemosho Route, Northern Circuit Route et Machame Route.', bold: true},
            {text: ' Nos ascensions guidées garantissent la sécurité, une acclimatation adéquate et un voyage inoubliable jusqu\'au sommet.'},
          ],
        ]),
        faqCards: [
          {
            question: 'Quel itinéraire du Kilimandjaro est le moins fréquenté ?',
            answer: [
              {text: 'La '},
              {text: 'Northern Circuit Route', accent: true},
              {text: ' est la moins fréquentée, offrant une expérience de trek paisible et isolée.'},
            ],
          },
          {
            question: "Quel est l'itinéraire le plus facile pour gravir le Kilimandjaro ?",
            answer: [
              {text: 'La '},
              {text: 'Rongai Route', accent: true},
              {text: ' est considérée comme la plus facile en raison de ses pentes progressives et de son ascension directe.'},
            ],
          },
          {
            question: 'Quel itinéraire du Kilimandjaro est le plus pittoresque ?',
            answer: [
              {text: 'La '},
              {text: 'Lemosho Route', accent: true},
              {text: ' est souvent considérée comme la plus pittoresque, avec des paysages à couper le souffle, des écosystèmes variés et des vues panoramiques.'},
            ],
          },
        ].map((card) => ({_type: 'richFaqCard', _key: key(), question: card.question, answer: segmentsToRichText(card.answer)})),
        closingNote: segmentsToRichText([
          {text: "En fin de compte, il existe un itinéraire pour tous ceux qui souhaitent vivre l'aventure de l'"},
          {text: 'ascension du Kilimandjaro.', bold: true},
        ]),
      },
      {
        _type: 'routesComparisonTab',
        _key: key(),
        label: 'Comparaison des itinéraires',
        heading: 'Comment se comparent les itinéraires du Kilimandjaro ?',
        table: {
          _type: 'dataTable',
          columns: ["Nom de l'itinéraire", 'Niveau de difficulté', 'Longueur (km)', 'Durée (jours)', 'Affluence', 'Prix (USD)', 'Taux de réussite (%)'],
          rows: [{_type: 'tableRow', _key: key(), cells: ['Northern Circuit', 'Modéré à difficile', '90', '9-10', 'Faible', '$2,500–3,500', '95']}],
        },
        noteLabel: 'REMARQUE :',
        noteBody:
          "Les prix et les taux de réussite sont approximatifs et peuvent varier selon des facteurs tels que la taille du groupe, l'acclimatation et les conditions météorologiques.",
      },
      {
        _type: 'bestTimeTab',
        _key: key(),
        label: 'Meilleure période pour grimper',
        heading: 'Quand devriez-vous gravir le Kilimandjaro ?',
        intro: segmentParagraphsToPt([
          [
            {text: 'La meilleure période pour gravir le Kilimandjaro se situe entre '},
            {text: 'juin et mars', accent: true},
            {text: ". Cependant, en raison de l'évolution des conditions météorologiques, les conditions peuvent varier."},
          ],
          [
            {
              text: "Durant cette période, le temps est généralement plus sec et plus stable, offrant un ciel plus dégagé et de meilleures conditions d'ascension. Cela réduit les risques de pluie, de neige et de mauvaise visibilité, améliorant à la fois la sécurité et le plaisir.",
            },
          ],
        ]),
        cards: [
          {
            title: 'Considérations de température :',
            bullets: [
              [
                {text: 'Les températures diurnes varient de '},
                {text: '20°C à 27°C (68°F à 81°F)', accent: true},
                {text: ' à basse altitude, mais descendent en dessous de zéro à haute altitude, surtout la nuit.'},
              ],
              [
                {text: 'Des vêtements superposés', accent: true},
                {text: " sont essentiels pour s'adapter aux variations de température tout au long de l'ascension."},
              ],
            ],
          },
          {
            title: 'Végétation et paysages :',
            bullets: [
              [{text: 'Les saisons sèches offrent des vues plus dégagées, des fleurs sauvages en fleurs et des forêts luxuriantes le long des sentiers.'}],
              [{text: 'Les saisons plus humides peuvent entraîner des conditions brumeuses et une couverture nuageuse dense.'}],
            ],
          },
          {
            title: "Niveaux d'affluence :",
            bullets: [
              [
                {text: 'Les hautes saisons', accent: true},
                {text: ' (janvier-février et juillet-septembre) attirent davantage de grimpeurs.'},
              ],
              [
                {text: 'Les saisons intermédiaires', accent: true},
                {text: ' (fin mars-mai et novembre-début décembre) offrent des expériences plus calmes.'},
              ],
            ],
          },
          {
            title: 'Préférences personnelles et objectifs :',
            bullets: [
              [
                {
                  text: "Les grimpeurs doivent tenir compte des conditions météorologiques, de leurs préférences de température, du niveau d'affluence et de leur emploi du temps personnel lors de la planification de leur ascension.",
                },
              ],
              [{text: "Les possibilités d'observation de la faune et les préférences paysagères peuvent également influencer la décision."}],
            ],
          },
        ].map((card) => ({
          _type: 'bestTimeCard',
          _key: key(),
          title: card.title,
          bullets: card.bullets.map((bullet) => ({_type: 'bulletItem', _key: key(), body: segmentsToRichText(bullet)})),
        })),
        closingNote: segmentsToRichText([
          {text: 'Pour une recommandation personnalisée sur la meilleure période selon vos objectifs, consultez nos guides expérimentés du Kilimandjaro chez '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: '.'},
        ]),
      },
      {
        _type: 'climbCostTab',
        _key: key(),
        label: "Coût de l'ascension",
        heading: "Combien coûte l'ascension du Kilimandjaro ?",
        intro: segmentsToRichText([
          {text: "Le coût de l'ascension du Kilimandjaro varie de "},
          {text: '2 500 $ à 4 000 $', accent: true},
          {text: ', selon :'},
        ]),
        items: [
          "Le choix de l'itinéraire",
          "La durée de l'ascension",
          'La taille du groupe',
          'Le niveau de service (Classique ou Premium)',
          'Ce qui est inclus ou exclu du forfait',
        ],
        closingNote: segmentsToRichText([
          {text: 'Bien que le budget soit important, '},
          {text: 'la sécurité et la qualité', bold: true},
          {text: " doivent être les priorités absolues lors du choix d'un opérateur d'ascension. Chez "},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ', nous garantissons des guides bien formés, des normes de sécurité élevées et une expérience globale exceptionnelle.'},
        ]),
      },
      {
        _type: 'climbingInsightsTab',
        _key: key(),
        label: "Conseils d'ascension",
        heading: 'Conseils importants pour réussir votre ascension',
        intro: segmentsToRichText([
          {text: "Atteindre le sommet de la plus haute montagne indépendante du monde n'est pas une mince affaire. "},
          {text: 'Une bonne préparation est essentielle.', bold: true},
          {text: ' Voici quelques conseils clés :'},
        ]),
        tips: [
          {label: 'Allez doucement :', description: 'Un rythme régulier réduit le risque de mal des montagnes et d\'épuisement.'},
          {label: 'Hydratez-vous :', description: "Buvez beaucoup d'eau pour favoriser l'acclimatation."},
          {
            label: 'Procurez-vous le bon équipement :',
            description: 'Investissez dans des couches vestimentaires adaptées, des chaussures de randonnée solides et un équipement de qualité.',
          },
          {
            label: 'Préparez-vous physiquement et mentalement :',
            description: 'Le cardio et la musculation renforceront votre endurance, tandis que la détermination mentale vous permettra de tenir bon.',
          },
          {label: 'Profitez-en et créez des liens :', description: 'Créer des liens avec les autres grimpeurs rend le voyage plus enrichissant.'},
        ].map((tip) => ({_type: 'tip', _key: key(), label: tip.label, description: tip.description})),
        closingNote:
          'En suivant ces conseils, vous maximiserez vos chances d\'atteindre le sommet tout en profitant de chaque étape de l\'ascension.',
      },
      {
        _type: 'guidedClimbsTab',
        _key: key(),
        label: 'Ascensions guidées',
        heading: 'Avez-vous besoin d\'un guide pour gravir le Kilimandjaro ?',
        intro: segmentsToRichText([
          {text: "Oui ! L'ascension du Kilimandjaro sans guide agréé n'est "},
          {text: 'pas autorisée.', bold: true},
        ]),
        faqs: [
          {
            question: "Pourquoi ai-je besoin d'un guide ?",
            answer:
              "Les guides apportent leur expertise, surveillent votre santé, garantissent votre sécurité et vous aident à naviguer sur le terrain difficile du Kilimandjaro.",
          },
          {
            question: 'Les grimpeurs expérimentés peuvent-ils se passer d\'un guide ?',
            answer:
              'Même les grimpeurs expérimentés doivent être accompagnés d\'un guide. La haute altitude et les conditions imprévisibles rendent un accompagnement professionnel indispensable.',
          },
          {
            question: 'Comment les guides améliorent-ils la sécurité ?',
            answer:
              'Les guides surveillent l\'acclimatation, prodiguent les premiers secours, évaluent les conditions météorologiques et prennent des décisions critiques pour la réussite de l\'ascension.',
          },
        ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
        closingNote: segmentsToRichText([
          {text: 'Chez '},
          {text: 'Asili Explorer African Safaris', accent: true},
          {text: ', nous proposons des guides expérimentés et certifiés pour garantir une aventure au Kilimandjaro sûre, bien organisée et mémorable.'},
        ]),
        ctaLabel: 'Voir le guide du Kilimandjaro',
        ctaHref: d.infoTabs.guidedClimbs.ctaHref,
      },
    ],
    reviews: {
      tripAdvisor: {
        heading: 'Laissez-nous un avis sur TripAdvisor',
        cardHeading: 'TripAdvisor met à l\'honneur Asili Climbing Kilimanjaro',
        cardBody:
          'Avec plus de 779 avis et toujours plus, 95 % nous notent Excellent et 5 % Très bien, témoignant de notre engagement à offrir des expériences de safari et de trekking inoubliables.',
        cards: [
          {
            name: 'Pastacieo',
            date: 'Août 2024',
            title: "L'ascension d'une vie !",
            quote:
              "Notre ascension du Kilimandjaro avec Asili Climbing Kilimanjaro fut véritablement extraordinaire ! Du début à la fin, l'équipe a assuré une expérience inoubliable, rendant notre voyage vers le sommet fluide, sûr et mémorable.",
          },
          {
            name: 'Danny G',
            date: 'Sept. 2023',
            title: 'Une randonnée hors du commun',
            quote:
              "Il n'est pas surprenant qu'Asili Climbing Kilimanjaro maintienne une réputation 5 étoiles. Leur expertise, leur professionnalisme et leur engagement envers la satisfaction client les distinguent. Si vous cherchez la meilleure agence de trekking au Kilimandjaro, ne cherchez plus !",
          },
          {
            name: 'Christian R',
            date: 'Sept. 2024',
            title: 'Trek du Kilimandjaro vivement recommandé',
            quote:
              'En octobre 2023, nous avons effectué un trek de six jours jusqu\'au sommet du Kilimandjaro avec Asili Climbing Kilimanjaro. L\'expérience fut phénoménale, et je les recommande vivement à quiconque envisage cette aventure.',
          },
        ].map((card) => ({_type: 'reviewCard', _key: key(), name: card.name, date: card.date, title: card.title, quote: card.quote})),
      },
      google: {
        cardHeading: 'Les avis Google saluent notre service',
        cardBody:
          'Avec plus de 99 avis cinq étoiles, Asili Climbing Kilimanjaro continue de dépasser les attentes, offrant un service haut de gamme, des circuits guidés par des experts et des aventures uniques.',
      },
    },
  })
  console.log('climbingKilimanjaroPage-fr created/replaced')
}

// ---------- siteSettings-fr ----------

async function seedSiteSettingsFr() {
  const navGroupLabelsFr = ['Kilimandjaro & Safari', 'Itinéraires du Kilimandjaro', 'Pourquoi voyager avec nous']
  const navGroupLinkLabelsFr = [
    ['9 jours Kilimandjaro & Safari', '10 jours Kilimandjaro et Safari', '11 jours Kilimandjaro & Safari', '12 jours Kilimandjaro & Safari'],
    [
      '5 jours Route Marangu',
      '6 jours Route Machame',
      '6 jours Route Marangu',
      '6 jours Route Umbwe',
      '7 jours Route Lemosho',
      '7 jours Route Machame',
      '7 jours Route Rongai',
      '8 jours Route Lemosho',
      '9 jours Route Northern Circuit',
    ],
    ['Safari'],
  ]
  const topLinkLabelsFr = ['Blog', 'Contact']

  const columnHeadingsFr = ['Ascension', 'ENTREPRISE', 'ASSISTANCE', 'Liens rapides']
  const columnLinkLabelsFr = [
    [
      'À propos du Mont Kilimandjaro',
      'Itinéraires du Kilimandjaro',
      'Forfaits Kilimandjaro',
      'Forfaits combinés',
      'Guide du Kilimandjaro',
      "Liste d'équipement",
      'Départs en groupe',
      'Randonnées privées',
      'Circuits de luxe',
      'Circuits à Zanzibar',
    ],
    [
      'À propos de CKT',
      'Pourquoi voyager avec nous',
      'Conditions générales',
      'Guide de montagne',
      'Avis',
      'Guide chauffeur de safari',
      'Valeurs fondamentales',
      'Véhicule de safari',
      'Contactez-nous',
    ],
    ['Notes de voyage Kili', 'Notes de voyage Safari', 'Moyens de paiement', 'Politique de confidentialité', 'Conseils de voyage'],
    ['Calendrier de voyage en Afrique', 'Rencontrez notre équipe', 'Avis clients', 'Notre blog de voyage', 'Récompenses'],
  ]
  const legalLinkLabelsFr = ['Politique de confidentialité', 'Conditions générales', 'Politique relative aux cookies']

  await client.createOrReplace({
    _id: 'siteSettings-fr',
    _type: 'siteSettings',
    language: 'fr',
    info: {
      name: siteInfo.name,
      tagline: 'Meilleure agence pour le Mont Kilimandjaro - Asili Climbing Kilimanjaro',
      phone: siteInfo.phone,
      email: siteInfo.email,
    },
    nav: {
      groups: siteNav.groups.map((group, gi) => ({
        _type: 'navGroup',
        _key: key(),
        label: navGroupLabelsFr[gi],
        ...(group.href ? {href: group.href} : {}),
        links: group.links.map((link, li) => navLink(link, navGroupLinkLabelsFr[gi][li])),
      })),
      links: siteNav.links.map((link, i) => navLink(link, topLinkLabelsFr[i])),
    },
    footer: {
      newsletterHeading: 'Vous cherchez encore le voyage idéal ?',
      newsletterSubheading: "Recevez chaque semaine de l'inspiration directement dans votre boîte mail !",
      columns: siteFooter.columns.map((column, ci) => ({
        _type: 'footerColumn',
        _key: key(),
        heading: columnHeadingsFr[ci],
        links: column.links.map((link, li) => navLink(link, columnLinkLabelsFr[ci][li])),
      })),
      contact: {
        phone: siteFooter.contact.phone,
        email: siteFooter.contact.email,
        address: siteFooter.contact.address,
      },
      copyright: '© Copyright 2025 Asili Climbing Kilimanjaro. Tous droits réservés.',
      legalLinks: siteFooter.legalLinks.map((link, i) => navLink(link, legalLinkLabelsFr[i])),
    },
  })
  console.log('siteSettings-fr created/replaced')
}

// ---------- article-fr: climbing-mount-kilimanjaro ----------

async function seedArticleFr() {
  const slug = 'climbing-mount-kilimanjaro'
  const enId = await client.fetch<string | null>(
    '*[_type == "article" && language == "en" && slug.current == $slug][0]._id',
    {slug},
  )
  if (!enId) {
    console.log(`  SKIP article-fr: no en source found for slug "${slug}"`)
    return
  }

  const fields = {
    seo: {_type: 'seo', title: 'Gravir le Kilimandjaro avec des guides locaux experts', description: "Gravissez le Mont Kilimandjaro avec des guides locaux experts. Comparez les itinéraires, les forfaits, les tarifs et obtenez des réponses aux questions les plus fréquentes sur l'ascension."},
    heading: 'Gravir le Kilimandjaro avec des guides locaux experts',
    topImage: await uploadImage(client, {src: '/images/articles/climbing2-hero.webp', alt: 'Groupe de trekking approchant du sommet du Kilimandjaro'}),
    intro:
      "Conquérez le Kilimandjaro. Vivez l'aventure. Que vous compariez les itinéraires, vérifiiez les listes d'équipement ou recherchiez des conseils d'experts, ce guide réunit tout ce dont vous avez besoin pour planifier votre ascension avec Asili Climbing Kilimanjaro.",
    sections: [
      {
        heading: 'Itinéraires et cartes d\'ascension du Kilimandjaro',
        body: "Route Machame : connue sous le nom de Whiskey Route, Machame est l'itinéraire le plus populaire du Kilimandjaro, offrant des paysages à couper le souffle et un terrain varié.\nRoute Lemosho : l'un des itinéraires les plus pittoresques du Kilimandjaro, débutant à la porte isolée de Londorossi et traversant le magnifique plateau de Shira.\nRoute Rongai : seul itinéraire nordique du Kilimandjaro, moins fréquenté et plus doux, idéal pendant la saison des pluies.\nRoute Northern Circuit : l'itinéraire le plus long et le plus pittoresque, offrant la meilleure acclimatation en contournant progressivement le Kilimandjaro.",
      },
      {
        heading: 'Comment se comparent les itinéraires du Kilimandjaro ?',
        body: '',
        table: {
          columns: ["Nom de l'itinéraire", 'Niveau de difficulté', 'Longueur (km)', 'Durée (jours)', 'Affluence', 'Prix (USD)', 'Taux de réussite (%)'],
          rows: [['Northern Circuit', 'Modéré à difficile', '90', '9-10', 'Faible', '$2,500-3,500', '95']],
        },
      },
      {
        heading: 'Quand devriez-vous gravir le Kilimandjaro ?',
        body: "Considérations de température : les températures diurnes varient de 20°C à 27°C (68°F à 81°F) à basse altitude, mais descendent en dessous de zéro à haute altitude.\nVégétation et paysages : les saisons sèches offrent des vues plus dégagées, des fleurs sauvages en fleurs et des forêts luxuriantes ; les saisons plus humides peuvent entraîner des conditions brumeuses.\nNiveaux d'affluence : les hautes saisons (janvier-février et juillet-septembre) attirent davantage de grimpeurs ; les saisons intermédiaires (fin mars-mai et novembre-début décembre) offrent des expériences plus calmes.\nPréférences personnelles et objectifs : tenez compte des conditions météorologiques, de vos préférences de température, du niveau d'affluence et de votre emploi du temps personnel lors de la planification de votre ascension.",
      },
      {
        heading: "Combien coûte l'ascension du Kilimandjaro ?",
        body: "Le coût de l'ascension du Kilimandjaro varie de 2 500 $ à 4 000 $, selon le choix de l'itinéraire, la durée, la taille du groupe, le niveau de service et les prestations incluses. Chez Asili Climbing Kilimanjaro, nous garantissons des guides bien formés, des normes de sécurité élevées et une expérience globale exceptionnelle.",
      },
      {
        heading: 'Conseils importants pour réussir votre ascension',
        body: 'Allez doucement, hydratez-vous bien, procurez-vous le bon équipement, préparez-vous physiquement et mentalement, et profitez du voyage — créer des liens avec les autres grimpeurs rend l\'expérience plus enrichissante.',
      },
      {
        heading: "Avez-vous besoin d'un guide pour gravir le Kilimandjaro ?",
        body: "Oui — l'ascension du Kilimandjaro sans guide agréé n'est pas autorisée. Les guides apportent leur expertise, surveillent votre santé, garantissent votre sécurité et vous aident à naviguer sur le terrain difficile de la montagne.",
      },
      {
        heading: 'Guide d\'ascension du Mont Kilimandjaro associé',
        body: "Votre guide complet pour conquérir le Kilimandjaro en toute confiance — consultez notre guide complet d'ascension du Kilimandjaro, nos conseils d'experts et notre liste d'équipement.",
      },
    ].map((section) => ({
      _type: 'articleSection',
      _key: key(),
      heading: section.heading,
      ...(section.body ? {body: stringToPt(section.body)} : {}),
      ...(section.table
        ? {table: {_type: 'dataTable', columns: section.table.columns, rows: section.table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}}
        : {}),
    })),
    faqHeading: "Questions fréquentes sur l'ascension du Mont Kilimandjaro",
    faqs: [
      {
        question: 'Quel est le niveau de difficulté pour gravir le Mont Kilimandjaro ?',
        answer:
          "Gravir le Mont Kilimandjaro est une aventure exigeante mais gratifiante. La principale difficulté provient de la haute altitude et du terrain varié. Avec une bonne préparation et un encadrement expert, des grimpeurs de différents niveaux d'expérience peuvent atteindre le sommet avec succès.",
      },
      {
        question: 'Les débutants peuvent-ils gravir le Mont Kilimandjaro ?',
        answer:
          "Oui ! Bien qu'aucune compétence technique en escalade ne soit requise, les débutants doivent suivre un entraînement physique adapté avant de tenter l'ascension. Nos guides expérimentés veillent à ce que les grimpeurs débutants bénéficient du soutien nécessaire tout au long du voyage.",
      },
      {
        question: 'Combien de temps faut-il pour gravir le Mont Kilimandjaro ?',
        answer:
          "L'ascension dure généralement entre 6 et 9 jours, selon l'itinéraire choisi. Un itinéraire plus long permet une meilleure acclimatation, augmentant les chances d'une expérience de sommet réussie et agréable.",
      },
      {
        question: "Faut-il de l'oxygène pour gravir le Kilimandjaro ?",
        answer:
          "La plupart des grimpeurs n'ont pas besoin d'oxygène supplémentaire. La clé d'une ascension réussie est une bonne acclimatation. Dans de rares cas de mal des montagnes sévère, de l'oxygène est disponible par mesure de sécurité.",
      },
      {
        question: 'Comment dort-on sur le Kilimandjaro ?',
        answer:
          "Pendant votre trek au Kilimandjaro avec nous, vous séjournerez dans des tentes de haute qualité, résistantes aux intempéries et conçues pour le confort en conditions extrêmes, avec des tentes spacieuses, des matelas isolants et des sacs de couchage chauds.",
      },
      {
        question: 'Quelle est la meilleure période pour gravir le Mont Kilimandjaro ?',
        answer:
          'Les meilleures saisons pour l\'ascension sont les mois secs : de janvier à mars et de juin à octobre, offrant les meilleures conditions météorologiques et un ciel plus dégagé.',
      },
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  }

  const existingFrId = await client.fetch<string | null>(
    '*[_type == "article" && language == "fr" && slug.current == $slug][0]._id',
    {slug},
  )
  let frId: string
  if (existingFrId) {
    await client.patch(existingFrId).set(fields).commit()
    frId = existingFrId
    console.log(`  article-fr updated (${frId})`)
  } else {
    const created = await client.create({_type: 'article', language: 'fr', slug: {_type: 'slug', current: slug}, ...fields})
    frId = created._id
    console.log(`  article-fr created (${frId})`)
  }
  await linkTranslation('article', enId, frId)
}

// ---------- standardPage-fr: why-travel-with-us ----------

async function seedStandardPageFr() {
  const slug = 'why-travel-with-us'
  const enId = await client.fetch<string | null>(
    '*[_type == "standardPage" && language == "en" && slug.current == $slug][0]._id',
    {slug},
  )
  if (!enId) {
    console.log(`  SKIP standardPage-fr: no en source found for slug "${slug}"`)
    return
  }

  const fields = {
    seo: {_type: 'seo', title: 'Pourquoi voyager avec nous | Asili Climbing Kilimanjaro', description: "Nous sommes un voyagiste de charme proposant une sélection des meilleurs voyages d'aventure en Tanzanie. Découvrez la différence Asili Climbing Kilimanjaro."},
    hero: {
      heading: 'Pourquoi voyager avec nous',
      subheading: "Nous sommes un voyagiste de charme proposant une sélection des meilleurs voyages d'aventure.",
      backgroundImage: await uploadImage(client, {
        src: '/images/why-travel-with-us/hero.webp',
        alt: "Un acacia solitaire au bord d'une piste de safari dans la savane tanzanienne",
      }),
    },
    sections: [
      {
        heading: 'Pourquoi voyager avec nous – Nous sommes un voyagiste de charme proposant une sélection des meilleurs voyages d\'aventure.',
        body: "L'Afrique occupe une place particulière dans nos cœurs. Tous les professionnels de notre équipe de safari ont des racines africaines locales. Ayant grandi dans des réserves de chasse, travaillé comme rangers en chef et gérants de lodge, et passé nos propres vacances en safari, nous comprenons profondément ce qu'il faut pour rendre un voyage en Afrique véritablement inoubliable.\n\nChaque agence de voyage prétend être la meilleure, c'est pourquoi nous avons voulu nous engager publiquement à vous placer, vous, le client, en premier. Asili Climbing Kilimanjaro propose une garantie appelée les « Big 5 » : privé, flexible, personnalisé, authentique, sûr, local, et une assistance 24 h/24 et 7 j/7 avec garantie de prix.",
      },
      {
        heading: 'Pourquoi voyager avec nous ?',
        body: 'Privé, flexible, personnalisé\nAuthentique, sûr, local\nAssistance 24 h/24 et 7 j/7\nGarantie de prix',
      },
      {
        heading: 'Plus de 100 clients conquis',
        body: 'Notre taux de satisfaction client de 98 % explique pourquoi de nombreux clients nous recommandent à leurs amis et voyagent à nouveau avec nous chaque année.',
      },
      {
        heading: 'Parlez à un expert',
        body: 'Nos experts en voyage sont toujours disponibles pour répondre à vos questions et vous aider à planifier le voyage de votre vie. Contactez-nous pour toute demande ou information complémentaire.',
      },
    ].map((section) => ({_type: 'pageSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }

  const existingFrId = await client.fetch<string | null>(
    '*[_type == "standardPage" && language == "fr" && slug.current == $slug][0]._id',
    {slug},
  )
  let frId: string
  if (existingFrId) {
    await client.patch(existingFrId).set(fields).commit()
    frId = existingFrId
    console.log(`  standardPage-fr updated (${frId})`)
  } else {
    const created = await client.create({_type: 'standardPage', language: 'fr', slug: {_type: 'slug', current: slug}, ...fields})
    frId = created._id
    console.log(`  standardPage-fr created (${frId})`)
  }
  await linkTranslation('standardPage', enId, frId)
}

async function run() {
  await seedHomeFr()
  await seedClimbFr()
  await seedSiteSettingsFr()
  await seedArticleFr()
  await seedStandardPageFr()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
