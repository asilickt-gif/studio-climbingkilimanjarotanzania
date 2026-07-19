/**
 * Phase 5: French translation for the 6 `route` documents (Machame, Marangu,
 * Lemosho, Rongai, Umbwe, Northern Circuit) plus the routesHubPage
 * singleton. Mirrors seed-routes.ts's field construction.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-routes.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

const arrivalStopFr = {
  label: 'Arrivée et briefing',
  meta: ['🏨 Classique : Ameg Lodge | Premium : Kaliwa Lodge'],
  body: [
    "À votre arrivée à l'aéroport international du Kilimandjaro, vous serez transféré à votre hébergement, où votre guide effectuera un briefing complet et une vérification de l'équipement pour vous préparer à l'aventure à venir.",
  ],
}
const departureStopFr = {
  label: 'Départ ou poursuite du voyage',
  body: ["🚗 Transfert vers l'aéroport international du Kilimandjaro pour votre vol retour, ou poursuivez votre aventure tanzanienne !"],
}

interface RouteInfoBlockFr {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  pricingTable?: {columns: string[]; rows: {label: string; values: string[]}[]}
}
interface RouteFr {
  slug: string
  name: string
  seoTitle: string
  seoDescription: string
  heroHeading: string
  heroTagline: string
  heroBody: string[]
  heroImage: {src: string; alt: string}
  itineraryHeading: string
  itinerarySubheading: string
  daysLabel: string
  stops: {label: string; meta?: string[]; body: string[]}[]
  infoTabsHeading: string
  tabs: {id: string; label: string; blocks: RouteInfoBlockFr[]}[]
  secondaryHeading: string
  secondaryTagline: string
  faqHeading: string
  faqs: {number: number; question: string; answer: string}[]
}

const machame: RouteFr = {
  slug: 'machame-route',
  name: 'Route Machame',
  seoTitle: 'Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Découvrez la route Machame, l'itinéraire d'ascension le plus populaire du Kilimandjaro, connu sous le nom de Whiskey Route. Itinéraire jour par jour réel, tarifs et conseils d'experts.",
  heroHeading: 'Découvrez la route Machame du Kilimandjaro',
  heroTagline: "L'itinéraire le plus populaire vers le sommet du Kilimandjaro",
  heroBody: [
    'Surnommée la Whiskey Route, la route Machame est l\'itinéraire d\'ascension le plus populaire du Kilimandjaro, choisi par près de la moitié des randonneurs chaque année.',
    'Cet itinéraire pittoresque aborde le Mont Kilimandjaro par le sud, gravissant les versants méridionaux à couper le souffle avant de redescendre par la route Mweka. En chemin, les grimpeurs sont récompensés par certains des levers et couchers de soleil les plus spectaculaires du Kilimandjaro.',
    "S'étendant sur 62 km, l'itinéraire est généralement parcouru en six jours, bien qu'un itinéraire de sept jours soit vivement recommandé pour une meilleure acclimatation — augmentant considérablement les taux de réussite au sommet.",
    'Pour ceux qui recherchent une aventure inoubliable avec un terrain exigeant mais gratifiant, la route Machame est un excellent choix.',
  ],
  heroImage: {src: '/images/routes/machame/hero.webp', alt: 'Randonneurs marchant vers le Mont Kilimandjaro sur la route Machame'},
  itineraryHeading: 'Itinéraire de la route Machame',
  itinerarySubheading: 'Sans le whisky – Un carnet de voyage jour par jour',
  daysLabel: '7 jours',
  stops: [
    arrivalStopFr,
    {
      label: 'Jour de trek 1 - Machame Gate à Machame Camp',
      meta: ['📍 Machame Gate (1 800 m/5 900 pieds) → Machame Camp (3 000 m/9 800 pieds)', '📈 Dénivelé positif : 1 200 m / 3 900 pieds', '⏳ Durée : 6-7 heures'],
      body: [
        "Votre voyage commence par un trajet de 45 minutes depuis Moshi jusqu'à Machame Gate. Après l'enregistrement, le trek débute le long d'un sentier sinueux à travers une forêt tropicale luxuriante, la zone la plus humide de la montagne. Attendez-vous à des averses occasionnelles l'après-midi, rendant le sentier parfois glissant.",
        "L'ascension s'adoucit progressivement à l'approche de Machame Camp, situé à la transition entre la forêt et les zones de bruyère géante.",
      ],
    },
    {
      label: 'Jour de trek 2 - Machame Camp à Shira Camp',
      meta: ['📍 Machame Camp (3 000 m/9 800 pieds) → Shira Camp (3 840 m/12 600 pieds)', '📈 Dénivelé positif : 840 m / 2 800 pieds', '⏳ Durée : 5-6 heures'],
      body: [
        'La journée débute par une montée abrupte le long d\'une crête, menant à Picnic Rock, un point de vue fantastique surplombant le Kibo et le rebord déchiqueté du plateau de Shira.',
        'Le sentier s\'aplanit ensuite en traversant le plateau de Shira, le troisième des cônes volcaniques du Kilimandjaro, avant d\'arriver à Shira Camp, où vous profiterez de superbes panoramas montagneux.',
      ],
    },
    {
      label: 'Jour de trek 3 - Shira Camp à Barranco Camp via Lava Tower',
      meta: [
        '📍 Shira Camp (3 840 m/12 600 pieds) → Lava Tower (4 550 m/14 900 pieds) → Barranco Camp (3 850 m/12 650 pieds)',
        '📈 Dénivelé positif : 710 m / 2 300 pieds',
        '📉 Dénivelé négatif : 700 m / 2 250 pieds',
        '⏳ Durée : 6-7 heures',
      ],
      body: [
        "Une journée d'acclimatation difficile mais cruciale, vous traverserez un terrain désertique de haute altitude vers la Lava Tower, un pinacle volcanique de 90 mètres de haut offrant d'incroyables vues panoramiques.",
        "Après le déjeuner, descendez dans la vallée de Barranco, abritant les uniques séneçons géants. Cette descente prépare votre corps à l'ascension du sommet en haute altitude qui vous attend. Barranco Camp se trouve dans une vallée pittoresque et abritée, en contrebas de la célèbre Barranco Wall.",
      ],
    },
    {
      label: 'Jour de trek 4 - Barranco Camp à Karanga Camp via la Barranco Wall',
      meta: [
        '📍 Barranco Camp (3 850 m/12 600 pieds) → Barranco Wall (4 200 m/13 800 pieds) → Karanga Camp (3 950 m/13 000 pieds)',
        '📈 Dénivelé positif : 350 m / 1 150 pieds',
        '📉 Dénivelé négatif : 250 m / 820 pieds',
        '⏳ Durée : 3-4 heures',
      ],
      body: [
        "Commencez la journée en affrontant l'impressionnante Barranco Wall, une ascension exaltante qui vous récompense avec des vues à couper le souffle.",
        'Après avoir atteint le sommet à 4 200 m, suivez un sentier pittoresque et vallonné autour du flanc de la montagne, avec le Mont Meru visible à votre droite et le Kibo se dressant à votre gauche.',
        'Une descente dans la vallée de Karanga est suivie d\'une ascension courte mais raide jusqu\'à Karanga Camp, votre étape pour la nuit.',
      ],
    },
    {
      label: 'Jour de trek 5 - Karanga Camp à Barafu Camp',
      meta: ['📍 Karanga Camp (3 950 m/13 000 pieds) → Barafu Camp (4 600 m/15 100 pieds)', '📈 Dénivelé positif : 650 m / 2 150 pieds', '⏳ Durée : 3-4 heures'],
      body: [
        "Une montée régulière le matin mène à Barafu Camp, qui signifie « glace » en swahili. Ce camp de haute altitude est situé sur une crête sous le cône sommital et marque l'achèvement du circuit sud du Kilimandjaro, offrant des vues spectaculaires sur le sommet sous plusieurs angles.",
        'Vous arriverez à temps pour un repos l\'après-midi et un dîner précoce afin de vous préparer pour la nuit du sommet.',
      ],
    },
    {
      label: 'Jour de trek 6 - Barafu Camp à Uhuru Peak puis Mweka Camp',
      meta: [
        '📍 Barafu Camp (4 600 m/15 100 pieds) → Uhuru Peak (5 895 m/19 300 pieds) → Mweka Camp (3 110 m/10 200 pieds)',
        '📈 Dénivelé positif : 1 295 m / 4 200 pieds',
        '📉 Dénivelé négatif : 2 785 m / 9 100 pieds',
        '⏳ Ascension vers le sommet : 6-8 heures',
        '⏳ Descente : 6 heures',
      ],
      body: [
        'À minuit commence votre ascension finale vers le sommet. Le sentier est raide et exigeant, avec des températures bien en dessous de zéro. À l\'aube, le magnifique lever de soleil rouge derrière le pic Mawenzi vous gardera motivé.',
        'En atteignant Stella Point (5 750 m), vous marcherez le long du rebord du cratère avant d\'arriver à Uhuru Peak (5 895 m), le point culminant de l\'Afrique !',
        'Après avoir célébré au sommet, entamez la longue descente vers Mweka Camp, traversant un terrain varié et faisant une pause déjeuner en chemin. Ce soir, vous savourerez votre dernier dîner sur la montagne.',
      ],
    },
    {
      label: 'Jour de trek 7 - Mweka Camp à Mweka Gate',
      meta: ['📍 Mweka Camp (3 110 m/10 200 pieds) → Mweka Gate (1 830 m/6 000 pieds)', '📉 Dénivelé négatif : 1 280 m / 4 220 pieds', '⏳ Durée : 2-3 heures'],
      body: [
        'La descente finale vous emmène à travers une forêt tropicale luxuriante, avec une chance d\'apercevoir des singes joueurs en chemin.',
        'À Mweka Gate, vous recevrez vos certificats de sommet, et depuis le village de Mweka, vous serez transféré à votre hôtel à Moshi.',
      ],
    },
    departureStopFr,
  ],
  infoTabsHeading: 'Pourquoi choisir Machame ?',
  tabs: [
    {
      id: 'duration',
      label: 'Durée du voyage',
      blocks: [
        {
          heading: 'Quels sont les avantages de choisir la route Machame ?',
          paragraphs: [
            'La route Machame du Kilimandjaro se distingue par ses paysages à couper le souffle et ses taux de réussite élevés. Si vous recherchez un défi pittoresque et gratifiant, cet itinéraire offre :',
            'Nos forfaits d\'ascension du Kilimandjaro pour la route Machame sont conçus pour maximiser l\'acclimatation et la sécurité globale.',
          ],
          bullets: [
            'Terrains variés – Des forêts tropicales luxuriantes aux déserts alpins et glaciers.',
            'Points de repère pittoresques – L\'itinéraire présente des points forts magnifiques comme le plateau de Shira et l\'emblématique Barranco Wall.',
            'Excellente acclimatation – La stratégie « monter haut, dormir bas » minimise les risques de mal des montagnes.',
            'Taux de réussite élevé au sommet – Avec un itinéraire bien rythmé, les grimpeurs s\'adaptent mieux, augmentant leurs chances d\'atteindre Uhuru Peak.',
          ],
        },
        {
          heading: 'Combien de temps faut-il pour parcourir la route Machame ?',
          paragraphs: [
            'Bien que la distance de la route Machame puisse être parcourue en 6 jours, nous recommandons vivement l\'itinéraire de 7 jours pour une ascension plus confortable et réussie. 🕒 Pourquoi prendre 7 jours ?',
            '📌 Conseil spécial : pour un guide détaillé sur la meilleure durée d\'itinéraire du Kilimandjaro, consultez notre article de blog approfondi.',
          ],
          bullets: [
            'Temps supplémentaire = meilleure acclimatation et risque réduit de mal des montagnes.',
            'Vous permet de profiter des paysages à un rythme confortable.',
            'Augmente vos chances de réussite au sommet.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Détail des tarifs',
      blocks: [
        {
          heading: 'Quel est le coût associé à la route Machame ?',
          paragraphs: [
            'Le prix de la route Machame sur 7 jours varie selon des facteurs tels que la taille du groupe, le niveau de service et les options supplémentaires. Voici un détail :',
            '💰 Ascension en groupe : à partir de 2 285 $ par personne   💰 Ascension privée : à partir de 2 585 $ par personne',
            '🔍 Facteurs influençant le prix :',
            '📅 Conseil de pro : la meilleure période pour grimper affecte les coûts. Les hautes saisons (juillet-sept. et janv.-févr.) offrent un temps excellent mais sont plus chères.',
          ],
          bullets: [
            'Durée de votre ascension guidée du Mont Kilimandjaro',
            'Taille du groupe – Les groupes plus importants peuvent réduire le coût par personne',
            'Services classiques ou premium – Plus de confort = coût légèrement plus élevé',
            'Inclusions et exclusions – Consultez les détails de notre forfait pour plus de clarté',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Où vous séjournerez',
      blocks: [
        {
          heading: 'Quels sont les campements le long de la route Machame ?',
          paragraphs: [
            'Votre voyage d\'ascension du Mont Kilimandjaro comprendra des arrêts nocturnes dans ces campements stratégiques :',
            '⛺ Chaque campement propose des équipements essentiels comme des hébergements sous tente, des espaces de restauration et des toilettes, garantissant un séjour confortable.',
          ],
          bullets: ['Machame Camp', 'Shira Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularité et affluence',
      blocks: [
        {
          heading: 'La route Machame est-elle fréquentée ?',
          paragraphs: [
            'En tant que l\'un des itinéraires les plus prisés du Kilimandjaro, la route Machame attire de nombreux grimpeurs chaque année. Principales raisons de sa popularité :',
            '🌍 Vues à couper le souffle – Paysages spectaculaires et écosystèmes variés.   ⏳ Durée plus courte – Peut être parcourue en seulement 6 jours.   📈 Taux de réussite élevés – Excellent profil d\'acclimatation.',
            '🤔 Inquiet à propos de l\'affluence ? Bien que les hautes saisons attirent davantage de grimpeurs, choisir les mois creux (mars, novembre) offre une expérience plus calme.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Avis d\'experts',
      blocks: [
        {
          heading: 'Quelles sont nos impressions sur la route Machame ?',
          paragraphs: [
            'Chez African Scenic Safaris, nous recommandons vivement la route Machame pour ses paysages variés et ses taux de réussite élevés. Cependant, si vous recherchez une alternative moins fréquentée, envisagez la route Lemosho.',
            '📍 Différence clé : Lemosho débute plus calmement mais rejoint Machame au jour 3.',
            '⚠️ Attention ! : attendez-vous à plus de grimpeurs sur Machame, surtout en haute saison.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Machame',
  secondaryTagline: 'Vivez le voyage pittoresque vers le sommet du Kilimandjaro. Traversez Machame et capturez la majesté du sommet.',
  faqHeading: '10 questions sur la route Machame',
  faqs: [
    {number: 1, question: 'Combien de temps faut-il pour parcourir la route Machame ?', answer: 'La route Machame prend généralement 6 à 7 jours. Cette durée permet une acclimatation adéquate, augmentant considérablement les chances de réussite au sommet du Kilimandjaro.'},
    {number: 2, question: 'Quel est le niveau de difficulté de la route Machame ?', answer: 'La route Machame est considérée comme modérément difficile. Elle implique des montées raides, un terrain accidenté et de longues journées de marche, nécessitant à la fois endurance physique et résilience mentale.'},
    {number: 3, question: 'Quel est le taux de réussite pour atteindre le sommet via la route Machame ?', answer: 'Chez African Scenic Safaris, nous estimons qu\'une ascension réussie signifie atteindre le sommet en toute sécurité et en revenir. À cet égard, notre taux de réussite est de 100 %. Globalement, la route Machame affiche un taux de réussite élevé au sommet, grâce à son profil d\'acclimatation progressif.'},
    {number: 4, question: 'La route Machame est-elle pittoresque ?', answer: 'Oui ! La route Machame est connue comme la « Whiskey Route » en raison de ses paysages à couper le souffle. Les grimpeurs traversent des forêts tropicales luxuriantes, des landes de bruyère et des déserts alpins, avec des vues magnifiques sur le Mont Kilimandjaro à chaque étape.'},
    {number: 5, question: 'Quelle est la distance de trek quotidienne moyenne sur la route Machame ?', answer: 'En moyenne, les grimpeurs parcourent 10 à 12 kilomètres par jour, soit 6 à 8 heures de marche selon l\'itinéraire et le rythme.'},
    {number: 6, question: 'La route Machame est-elle fréquentée par rapport aux autres itinéraires ?', answer: 'La route Machame est l\'un des itinéraires les plus populaires du Kilimandjaro, ce qui signifie qu\'elle peut être fréquentée pendant les hautes saisons (juin-octobre et décembre-mars).'},
    {number: 7, question: 'Un entraînement est-il nécessaire pour gravir la route Machame ?', answer: 'Bien qu\'une expérience de randonnée préalable ne soit pas obligatoire, nous recommandons vivement des exercices cardio, un entraînement d\'endurance et des marches en côte pour développer votre résistance en vue de l\'ascension du Kilimandjaro.'},
    {number: 8, question: 'Quelle est la meilleure période pour gravir le Kilimandjaro via la route Machame ?', answer: 'La meilleure période pour gravir le Kilimandjaro via la route Machame est de juin à mars, lorsque le temps est stable, avec un ciel dégagé et moins de risques de précipitations — idéal pour un trek sûr et agréable.'},
    {number: 9, question: 'Combien de campements y a-t-il sur la route Machame ?', answer: 'La route Machame compte six campements pour la nuit, chacun offrant un lieu de repos et d\'acclimatation : Machame Camp, Shira Camp, Barranco Camp, Karanga Camp, Barafu Camp, Mweka Camp.'},
    {number: 10, question: 'Quelles sont les principales attractions de la route Machame ?', answer: 'Parmi les points forts de la route Machame : la traversée de la forêt tropicale luxuriante au pied du Kilimandjaro, l\'ascension de l\'emblématique Barranco Wall — une montée palpitante avec des vues magnifiques — et l\'arrivée à Uhuru Peak, le point culminant de l\'Afrique à 5 895 m (19 341 pieds).'},
  ],
}

const marangu: RouteFr = {
  slug: 'marangu-route',
  name: 'Route Marangu',
  seoTitle: 'Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Gravissez le Kilimandjaro via la route Marangu, le seul itinéraire avec hébergement en refuges. Itinéraire jour par jour réel, tarifs et conseils d'experts.",
  heroHeading: 'Gravissez le Kilimandjaro par la route Marangu',
  heroTagline: 'Le trek classique du Kilimandjaro',
  heroBody: [
    'Connue sous le nom de « Coca-Cola Route », la route Marangu est l\'itinéraire le plus établi et le plus confortable vers le sommet du Mont Kilimandjaro. C\'est le seul itinéraire avec hébergement en refuges, ce qui en fait un choix populaire pour ceux recherchant une expérience de trek moins rude.',
    'Le sentier offre des pentes douces à travers une forêt tropicale luxuriante, une lande et un désert alpin avant d\'atteindre le sommet glacé d\'Uhuru Peak. Il est idéal pour les randonneurs débutants ou ceux recherchant une ascension plus directe.',
  ],
  heroImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Refuge de montagne en forme de A sur la route Marangu avec la forêt en arrière-plan'},
  itineraryHeading: 'Itinéraire de la route Marangu',
  itinerarySubheading: 'Le chemin confortable vers le Toit de l\'Afrique',
  daysLabel: '5 jours',
  stops: [
    arrivalStopFr,
    {
      label: 'Jour de trek 1 : Marangu Gate → Mandara Hut',
      meta: ['📍 Marangu Gate (1 870 m/6 135 pieds) → Mandara Hut (2 700 m/8 858 pieds)', '📈 Dénivelé positif : 830 m / 2 723 pieds', '⏳ Durée : 4-5 heures'],
      body: [
        "Votre trek commence par un trajet depuis Moshi jusqu'à Marangu Gate. Après l'enregistrement, vous entrerez dans la forêt tropicale luxuriante et commencerez votre randonnée le long d'un sentier bien entretenu. Le chemin est souvent humide et ombragé, avec des arbres couverts de mousse, des chants d'oiseaux et des singes joueurs en chemin.",
        'Vous atteindrez Mandara Hut en fin d\'après-midi. Si le temps et l\'énergie le permettent, faites une courte promenade jusqu\'au cratère de Maundi pour de superbes vues sur le Kenya et le nord de la Tanzanie.',
      ],
    },
    {
      label: 'Jour de trek 2 : Mandara Hut → Horombo Hut',
      meta: ['📍 Mandara Hut (2 700 m/8 858 pieds) → Horombo Hut (3 720 m/12 204 pieds)', '📈 Dénivelé positif : 1 020 m / 3 346 pieds', '⏳ Durée : 6-7 heures'],
      body: [
        'En laissant la forêt tropicale derrière vous, vous entrerez dans la zone de lande, où le paysage change radicalement. Le sentier monte régulièrement à travers un terrain ouvert rempli de séneçons géants et de lobélies.',
        'En chemin, vous aurez votre première vue complète sur les pics Kibo et Mawenzi. Horombo Hut vous attend avec des panoramas à couper le souffle et l\'occasion de rencontrer d\'autres randonneurs.',
      ],
    },
    {
      label: 'Jour de trek 3 : Horombo Hut → Kibo Hut',
      meta: ['📍 Horombo Hut (3 720 m/12 204 pieds) → Kibo Hut (4 703 m/15 430 pieds)', '📈 Dénivelé positif : 983 m / 3 226 pieds', '⏳ Durée : 6-7 heures'],
      body: [
        "L'itinéraire d'aujourd'hui est long et sec, traversant le désert alpin. Vous marcherez à travers la selle entre les pics Mawenzi et Kibo, un paysage vaste et aride avec des vues spectaculaires. L'air est plus rare, alors marchez lentement et restez hydraté.",
        'Vous atteindrez Kibo Hut en milieu d\'après-midi — reposez-vous tôt et préparez-vous pour la tentative de sommet qui débute à minuit.',
      ],
    },
    {
      label: 'Jour de trek 4 : Kibo Hut → Uhuru Peak → Horombo Hut',
      meta: [
        '📍 Kibo Hut (4 703 m/15 430 pieds) → Uhuru Peak (5 895 m/19 341 pieds) → Horombo Hut (3 720 m/12 204 pieds)',
        '📈 Dénivelé positif : 1 192 m / 3 911 pieds (montée), puis descente',
        '⏳ Durée : 11-14 heures',
      ],
      body: [
        'Votre voyage vers le sommet commence tôt le matin, en marchant dans l\'obscurité à travers des lacets et des éboulis jusqu\'à Gilman\'s Point (5 685 m), puis le long du rebord du cratère jusqu\'à Uhuru Peak — le toit de l\'Afrique.',
        'Après avoir capturé votre moment au sommet, redescendez à Kibo Hut pour un court repos, puis continuez vers Horombo Hut pour une nuit de sommeil bien méritée.',
      ],
    },
    {
      label: 'Jour de trek 5 : Horombo Hut → Marangu Gate',
      meta: ['📍 Horombo Hut (3 720 m/12 204 pieds) → Marangu Gate (1 870 m/6 135 pieds)', '📉 Dénivelé négatif : 1 850 m / 6 070 pieds', '⏳ Durée : 6-7 heures'],
      body: [
        'Pour votre dernier jour, descendez à travers la lande et la forêt tropicale luxuriante pour revenir au point de départ. Le sentier est plus facile en descente, mais faites attention à vos pas sur les sections humides.',
        'À la porte, vous recevrez votre certificat de sommet avant de retourner à Moshi — fatigué mais fier.',
      ],
    },
    departureStopFr,
  ],
  infoTabsHeading: 'Pourquoi choisir Marangu ?',
  tabs: [
    {
      id: 'duration',
      label: 'Durée du voyage',
      blocks: [
        {
          heading: 'Quels sont les avantages de choisir la route Marangu ?',
          bullets: [
            'Seul itinéraire avec hébergement en refuges – Contrairement aux autres itinéraires nécessitant du camping, la route Marangu offre un hébergement partagé en refuges avec des lits superposés de type dortoir. C\'est un avantage majeur pour les grimpeurs préférant dormir à l\'intérieur plutôt que sous tente — surtout pendant la saison des pluies.',
            'Option plus abordable – Comme elle utilise le même sentier pour la montée et la descente, la logistique est plus simple, ce qui fait de Marangu l\'un des itinéraires les plus économiques du Kilimandjaro.',
            'Sentier doux et progressif – Le sentier est bien entretenu, avec une pente régulière et modérée, ce qui le rend idéal pour les randonneurs débutants ou ceux recherchant une ascension moins exigeante physiquement par rapport à des itinéraires plus raides comme Umbwe ou Machame.',
            'Options de durée plus courtes (5 ou 6 jours) – Vous pouvez choisir entre un itinéraire de 5 ou 6 jours. La version de 6 jours inclut une journée d\'acclimatation, ce qui améliore vos chances d\'atteindre le sommet.',
            'Idéal pour les ascensions en saison des pluies – Comme elle offre des refuges et traverse un terrain moins boueux que d\'autres itinéraires, Marangu est un meilleur choix pendant les saisons des pluies en Tanzanie (mars-mai et novembre).',
            'Itinéraire de retour direct – Le même sentier est utilisé pour la descente, ce qui peut être plus facile à gérer logistiquement, surtout si vous manquez de temps ou préférez un itinéraire simple.',
            'Diversité pittoresque en peu de temps – Bien que ce soit l\'un des itinéraires les plus courts, vous découvrirez tout de même diverses zones de végétation — en commençant par la forêt tropicale luxuriante, en passant par la lande, et en terminant par le désert alpin avant d\'atteindre le sommet glacé.',
            'Accès au cratère de Maundi – Le premier jour, une courte promenade optionnelle mène au cratère de Maundi — un point de vue tranquille avec de belles vues sur le nord de la Tanzanie et le Kenya.',
          ],
        },
        {
          heading: 'Exemple de tarification (par personne en USD)',
          paragraphs: [
            'L\'ascension du Kilimandjaro via la route Marangu prend généralement 5 ou 6 jours, selon l\'itinéraire choisi. Chaque jour implique 4 à 7 heures de trek, sauf la nuit du sommet, la plus exigeante — durant jusqu\'à 12-14 heures, descente incluse. Les prix varient légèrement selon la saison et la taille du groupe.',
          ],
          bullets: [
            'Option 5 jours : une ascension plus rapide avec une acclimatation limitée, idéale pour les randonneurs expérimentés mais avec un taux de réussite au sommet plus faible.',
            'Option 6 jours : inclut une journée supplémentaire à Horombo Hut pour l\'acclimatation. Cela améliore l\'adaptation de votre corps à l\'altitude et augmente considérablement les chances de réussite au sommet.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Détail des tarifs',
      blocks: [
        {
          heading: 'Quel est le coût associé à la route Marangu ?',
          pricingTable: {
            columns: ['Durée', '1 personne', '2-3 personnes', '4-6 personnes', '7+ personnes'],
            rows: [
              {label: '5 jours', values: ['1 850 $', '1 750 $', '1 600 $', '1 450 $']},
              {label: '6 jours', values: ['2 050 $', '1 950 $', '1 750 $', '1 600 $']},
            ],
          },
        },
      ],
    },
    {
      id: 'stay',
      label: "Où vous séjournerez",
      blocks: [
        {
          heading: 'Des refuges de montagne confortables en chemin — pas besoin de camper !',
          paragraphs: [
            'Contrairement aux autres itinéraires du Kilimandjaro nécessitant des tentes, la route Marangu est le seul itinéraire avec des refuges de montagne permanents, offrant une expérience plus confortable et protégée des intempéries. C\'est une excellente option si vous préférez un vrai lit, un toit au-dessus de votre tête, et un abri partagé mais solide.',
            '🛏️ Aperçu de l\'hébergement :',
          ],
          bullets: [
            'Mandara Hut (2 700 m / 8 858 pieds) : situé dans la zone de forêt tropicale, Mandara offre des refuges douillets en forme de A entourés d\'une verdure luxuriante. Chaque refuge accueille 4 à 8 grimpeurs et dispose de sanitaires partagés à proximité.',
            'Horombo Hut (3 720 m / 12 205 pieds) : situé dans la zone de lande, Horombo est plus grand et accueille les randonneurs en montée comme en descente. Il offre de superbes vues sur le pic Mawenzi et les plaines en contrebas.',
            'Kibo Hut (4 703 m / 15 430 pieds) : une simple structure en pierre dans la zone de désert alpin, Kibo est la dernière base avant le sommet. Attendez-vous à des chambres de type dortoir avec des lits superposés et une ambiance sobre de haute altitude.',
            '🚿 Les équipements comprennent : matelas et oreillers, salles à manger pour repas chauds, éclairage solaire dans certains refuges, toilettes partagées propres mais basiques, pas de douches (apportez des lingettes ou de l\'eau pour une toilette rapide).',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularité et affluence',
      blocks: [
        {
          heading: 'Très apprécié, très fréquenté, et souvent le premier choix des grimpeurs débutants.',
          paragraphs: [
            'La route Marangu est l\'un des itinéraires les plus populaires du Mont Kilimandjaro — souvent appelée la « Coca-Cola Route » en raison de son accès plus facile et de ses hébergements en refuges. Elle attire un grand nombre de grimpeurs, en particulier pendant les hautes saisons de trek (janvier-mars et juin-octobre).',
            '📌 Pourquoi est-elle populaire ? C\'est le seul itinéraire avec des refuges de montagne, ce qui la rend attrayante pour ceux préférant ne pas camper. Sa durée plus courte (5-6 jours) séduit ceux ayant un emploi du temps de voyage serré. Elle est considérée comme moins exigeante physiquement (bien que l\'altitude reste un défi sérieux).',
            '🙋‍♂️ À quoi s\'attendre en termes d\'affluence : attendez-vous à plus de randonneurs sur cet itinéraire par rapport à d\'autres comme Lemosho ou Rongai. Les refuges peuvent être bondés, en particulier à Horombo et Kibo, qui accueillent les randonneurs en montée comme en descente.',
            '⚠️ Conseil : si vous recherchez la solitude et moins d\'affluence, envisagez de grimper pendant les saisons intermédiaires (fin mars ou début novembre) ou de choisir un itinéraire plus long et moins fréquenté.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Avis d\'experts',
      blocks: [
        {
          heading: 'Réflexions de guides expérimentés et de spécialistes du Kilimandjaro.',
          paragraphs: [
            'La route Marangu est souvent considérée comme le moyen « le plus facile » de gravir le Kilimandjaro, mais les experts s\'accordent à dire qu\'elle ne doit pas être sous-estimée.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Marangu',
  secondaryTagline: 'Le Kilimandjaro en toute simplicité – Dormez en refuges, pas sous tente.',
  faqHeading: '10 questions sur la route Marangu',
  faqs: [
    {number: 1, question: 'Combien de temps faut-il pour parcourir la route Marangu ?', answer: 'La route Marangu prend généralement 5 ou 6 jours. L\'itinéraire de 6 jours inclut une journée supplémentaire d\'acclimatation à Horombo Hut, ce qui augmente vos chances d\'atteindre le sommet avec succès.'},
    {number: 2, question: 'Quel est le niveau de difficulté de la route Marangu ?', answer: 'Elle est considérée comme modérément difficile. Le sentier est progressif et bien établi, ce qui en fait un bon choix pour les grimpeurs débutants — mais l\'altitude peut tout de même être un défi.'},
    {number: 3, question: 'Quel est le taux de réussite pour atteindre le sommet via la route Marangu ?', answer: 'Les taux de réussite varient selon le nombre de jours. L\'option 5 jours a un taux de réussite plus faible en raison de moins de temps pour l\'acclimatation, tandis que la version 6 jours offre de meilleures chances, avec un taux de réussite d\'environ 80 % lorsqu\'elle est bien réalisée.'},
    {number: 4, question: 'La route Marangu est-elle pittoresque ?', answer: 'Oui, la route Marangu offre de beaux paysages. Vous traverserez des zones de forêt tropicale, de lande et de désert alpin, avec des vues magnifiques près du sommet — bien que moins variée que des itinéraires comme Lemosho ou Machame.'},
    {number: 5, question: 'Quelle est la distance de trek quotidienne moyenne sur la route Marangu ?', answer: 'Les randonneurs parcourent en moyenne 8 à 12 km par jour, selon le segment. Le jour du sommet est le plus long, avec plus de 18 km de marche.'},
    {number: 6, question: 'La route Marangu est-elle fréquentée par rapport aux autres itinéraires ?', answer: 'La route Marangu est l\'un des itinéraires les plus populaires et fréquentés, en particulier pendant les saisons sèches. Elle attire les grimpeurs préférant l\'hébergement en refuges et un itinéraire plus court.'},
    {number: 7, question: 'Un entraînement est-il nécessaire pour gravir la route Marangu ?', answer: 'Oui, un entraînement de base et une préparation physique sont vivement recommandés. Concentrez-vous sur le cardio, la pratique de la randonnée et des exercices d\'endurance plusieurs semaines avant votre voyage.'},
    {number: 8, question: 'Quelle est la meilleure période pour gravir le Kilimandjaro via la route Marangu ?', answer: 'Les meilleurs mois sont pendant les saisons sèches : de janvier à mi-mars et de juin à octobre, lorsque les sentiers sont plus secs et les vues plus dégagées.'},
    {number: 9, question: 'Combien de refuges y a-t-il sur la route Marangu ?', answer: 'Il y a trois stations de refuges principales : Mandara Hut, Horombo Hut et Kibo Hut, toutes équipées de lits superposés, d\'espaces de restauration basiques et de toilettes.'},
    {number: 10, question: 'Quelles sont les principales attractions de la route Marangu ?', answer: 'L\'itinéraire est réputé pour ses refuges confortables, son importance historique et sa diversité pittoresque. Il offre également l\'accès au cratère de Maundi et des vues sur le pic Mawenzi — en faisant une ascension classique avec une touche de confort.'},
  ],
}

const lemosho: RouteFr = {
  slug: 'lemosho-route',
  name: 'Route Lemosho',
  seoTitle: 'Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Gravissez le Kilimandjaro via la route Lemosho, l'un des itinéraires les plus pittoresques et équilibrés de la montagne. Itinéraire jour par jour réel, tarifs et conseils d'experts.",
  heroHeading: 'Gravissez le Kilimandjaro via la route Lemosho',
  heroTagline: "Une ascension pittoresque et progressive vers le sommet du Kilimandjaro",
  heroBody: [
    "La route Lemosho est l'une des façons les plus belles et équilibrées de gravir le Mont Kilimandjaro. Débutant sur le côté ouest reculé de la montagne, elle offre un départ paisible avec moins d'affluence, des vues magnifiques et un rythme régulier qui aide votre corps à s'adapter à l'altitude.",
    "Cet itinéraire est apprécié aussi bien des randonneurs expérimentés que des débutants pour son taux de réussite élevé, ses paysages variés et son excellent profil d'acclimatation. Que vous choisissiez la version 7 jours ou 8 jours, vous profiterez d'un voyage gratifiant à travers la forêt tropicale, la lande, le désert alpin, et enfin les glaciers à Uhuru Peak.",
  ],
  heroImage: {src: '/images/routes/lemosho/hero.webp', alt: 'Tentes à Barafu Camp avec le sommet enneigé du Kibo au-dessus des nuages'},
  itineraryHeading: 'Itinéraire de la route Lemosho',
  itinerarySubheading: "Un départ paisible vers le Toit de l'Afrique",
  daysLabel: '7 jours',
  stops: [
    arrivalStopFr,
    {
      label: 'Jour de trek 1 : Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2 100 m/6 890 pieds) → Mti Mkubwa (2 650 m/8 690 pieds)', '📈 Dénivelé positif : 550 m / 1 800 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Après l\'enregistrement, commencez votre trek à travers la forêt tropicale luxuriante, avec de bonnes chances d\'apercevoir des singes et des oiseaux colorés. Vous atteindrez Mti Mkubwa, ou « Big Tree Camp », en fin d\'après-midi.'],
    },
    {
      label: 'Jour de trek 2 : Mti Mkubwa – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2 650 m) → Shira 1 Camp (3 610 m/11 843 pieds)', '📈 Dénivelé positif : 960 m / 3 150 pieds', '⏳ Durée : 5-6 heures'],
      body: ['Aujourd\'hui, le sentier sort de la forêt pour entrer dans la zone de lande. Les vues s\'ouvrent de façon spectaculaire en traversant le plateau de Shira — une ancienne coulée de lave.'],
    },
    {
      label: 'Jour de trek 3 : Shira 1 – Shira 2 Camp',
      meta: ['📍 Shira 1 (3 610 m) → Shira 2 Camp (3 850 m/12 630 pieds)', '📈 Dénivelé positif : 240 m / 787 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Une journée relaxante avec de légères montées et descentes à travers le plateau. Vous apercevrez pour la première fois le pic Kibo et vous acclimaterez lentement en vous installant au camp.'],
    },
    {
      label: 'Jour de trek 4 : Shira 2 – Lava Tower – Barranco Camp',
      meta: ['📍 Shira 2 (3 850 m) → Lava Tower (4 600 m) → Barranco Camp (3 976 m)', '📈 Dénivelé : 750 m en montée / 624 m en descente', '⏳ Durée : 6-7 heures'],
      body: ['Il s\'agit d\'une journée d\'acclimatation. Vous montez haut jusqu\'à Lava Tower, puis redescendez pour dormir à Barranco — cette approche « monter haut, dormir bas » aide votre corps à s\'adapter à l\'altitude.'],
    },
    {
      label: 'Jour de trek 5 : Barranco – Karanga Camp – Barafu Camp',
      meta: ['📍 Barranco Camp (3 976 m) → Karanga Camp (4 035 m) → Barafu Camp (4 673 m)', '📈 Dénivelé positif : 697 m / 2 286 pieds', '⏳ Durée : 8-9 heures'],
      body: [
        "Votre journée débute par une montée le long de l'emblématique Barranco Wall — une escalade raide mais gratifiante avec des vues épiques. Après une courte pause à Karanga Camp, vous continuerez sur un trek régulier en montée à travers le désert alpin jusqu'à Barafu Camp.",
        'C\'est votre base pour la tentative de sommet. Prenez un dîner tôt et reposez-vous avant l\'effort de minuit vers Uhuru Peak.',
      ],
    },
    {
      label: 'Jour de trek 6 : Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4 673 m/15 330 pieds) → Uhuru Peak (5 895 m/19 341 pieds) → Mweka Camp (3 110 m/10 204 pieds)',
        '📈 Dénivelé : 1 222 m / 4 011 pieds en montée, 2 785 m / 9 137 pieds en descente',
        '⏳ Durée : 12-14 heures',
      ],
      body: [
        'Le jour du sommet commence vers minuit sous un ciel étoilé. Le sentier est long et raide, mais lenteur et régularité gagnent la course. Après avoir atteint Stella Point (5 739 m), continuez le long du rebord du cratère jusqu\'à Uhuru Peak, le point culminant de l\'Afrique.',
        'Célébrez votre exploit, prenez des photos, et entamez la descente vers Mweka Camp. Attendez-vous à des jambes endolories et un sommeil profond et réparateur.',
      ],
    },
    {
      label: 'Jour de trek 7 : Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3 110 m/10 204 pieds) → Mweka Gate (1 640 m/5 380 pieds)', '📉 Dénivelé négatif : 1 470 m / 4 823 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Votre dernier jour est une agréable descente à travers la forêt tropicale luxuriante, remplie de chants d\'oiseaux et peut-être même de singes. À Mweka Gate, vous signerez votre départ, recevrez vos certificats de sommet, et retrouverez votre chauffeur pour le retour à Moshi.'],
    },
    departureStopFr,
  ],
  infoTabsHeading: 'Pourquoi choisir Lemosho ?',
  tabs: [
    {
      id: 'duration',
      label: 'Durée du voyage',
      blocks: [
        {
          heading: 'Quels sont les avantages de choisir la route Lemosho ?',
          paragraphs: [
            "La route Lemosho est largement considérée comme l'itinéraire le plus pittoresque et équilibré du Mont Kilimandjaro — et pour cause. Elle offre un mélange parfait de beauté, de défi et d'acclimatation, en faisant l'un des meilleurs choix tant pour les débutants que pour les randonneurs expérimentés.",
            "Contrairement à d'autres itinéraires, Lemosho débute sur le côté ouest reculé de la montagne, offrant un départ paisible à travers une forêt tropicale intacte avant de rejoindre la route Machame plus fréquentée par la suite. Cela signifie moins d'affluence au début, plus d'observations de la faune, et des vues panoramiques à couper le souffle du début à la fin.",
            "Une autre raison de choisir Lemosho ? Le taux de réussite. Grâce à son itinéraire plus long (7 ou 8 jours), vous gagnez de l'altitude plus progressivement — laissant à votre corps le temps de s'adapter. Cela améliore grandement vos chances d'atteindre le sommet en toute sécurité et de vous sentir fort la nuit du sommet.",
            "Si vous recherchez un itinéraire offrant des paysages incroyables, un temps d'acclimatation solide et une aventure gratifiante sans l'affluence du début, Lemosho est difficile à surpasser.",
          ],
        },
        {
          heading: 'Combien de temps faut-il pour parcourir la route Lemosho ?',
          paragraphs: [
            "La route Lemosho est généralement parcourue en 7 ou 8 jours, selon l'itinéraire choisi. L'option 8 jours inclut une journée d'acclimatation supplémentaire à Karanga Camp, augmentant vos chances d'atteindre le sommet confortablement. Cette durée prolongée en fait l'un des meilleurs itinéraires pour l'adaptation à l'altitude et un rythme de trek plus détendu.",
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Détail des tarifs',
      blocks: [
        {
          heading: 'Quel est le coût associé à la route Lemosho ?',
          paragraphs: [
            "Les prix de la route Lemosho varient selon la taille du groupe et le niveau de service, mais voici un aperçu général. Ces coûts incluent généralement les frais de parc, le soutien des guides et porteurs, les repas, les tentes et le transport. Des ascensions privées et des forfaits de luxe sont également disponibles à des tarifs plus élevés.",
          ],
          bullets: ['Trek de 7 jours : à partir de 2 200 $ à 2 700 $ par personne', 'Trek de 8 jours : à partir de 2 400 $ à 2 900 $ par personne'],
        },
      ],
    },
    {
      id: 'stay',
      label: "Où vous séjournerez",
      blocks: [
        {
          heading: 'Quels sont les campements le long de la route Lemosho ?',
          paragraphs: [
            "Contrairement à la route Marangu, Lemosho est un trek exclusivement en camping. Vous dormirez dans des tentes de montagne de haute qualité fournies par votre opérateur. Des campements comme Shira, Barranco et Barafu offrent des vues incroyables — pensez à des levers de soleil au-dessus des nuages et des nuits étoilées. Tous les repas sont préparés frais par votre chef de montagne, et vous disposerez d'une tente-restaurant pour votre confort.",
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularité et affluence',
      blocks: [
        {
          heading: 'La route Lemosho est-elle fréquentée ?',
          paragraphs: [
            "La route Lemosho débute sur le côté ouest reculé du Kilimandjaro, ce qui signifie moins de randonneurs les premiers jours. Elle rejoint la route Machame au jour 4, devenant donc plus fréquentée près du sommet. Néanmoins, Lemosho est moins fréquentée que Marangu ou Machame dans ses premières étapes, offrant un départ plus paisible et pittoresque.",
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: "Avis d'experts",
      blocks: [
        {
          heading: 'Quelles sont nos impressions sur la route Lemosho ?',
          paragraphs: [
            "Lemosho est souvent considéré comme l'itinéraire le plus beau et le plus équilibré du Kilimandjaro. Il combine d'excellents paysages, une excellente acclimatation et un taux de réussite élevé au sommet. La plupart des guides expérimentés le recommandent aux grimpeurs débutants recherchant les meilleures chances de réussite sans se précipiter. L'approche par l'ouest offre également une expérience de nature sauvage plus reculée en début de trek.",
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Lemosho',
  secondaryTagline: 'Lemosho commence là où les autres ne le font pas — et cela change tout.',
  faqHeading: '10 questions sur la route Lemosho',
  faqs: [
    {number: 1, question: 'Combien de temps faut-il pour gravir le Kilimandjaro via la route Lemosho ?', answer: 'La plupart des grimpeurs parcourent la route Lemosho en 7 ou 8 jours. L\'option 8 jours inclut une journée d\'acclimatation supplémentaire, améliorant vos chances d\'atteindre le sommet.'},
    {number: 2, question: 'La route Lemosho est-elle difficile ?', answer: 'Lemosho est considérée comme modérée à difficile. Elle n\'est pas technique, mais le jour du sommet est long et éprouvant. La durée plus longue aide à l\'acclimatation, la rendant gérable pour la plupart des randonneurs en bonne forme physique.'},
    {number: 3, question: 'Quel est le taux de réussite au sommet sur la route Lemosho ?', answer: 'Lemosho affiche l\'un des taux de réussite les plus élevés parmi tous les itinéraires du Kilimandjaro — jusqu\'à 90 % pour l\'itinéraire de 8 jours, grâce à son gain d\'altitude progressif et son excellent profil d\'acclimatation.'},
    {number: 4, question: 'La route Lemosho est-elle pittoresque ?', answer: 'Oui — Lemosho est souvent qualifiée de plus bel itinéraire du Kilimandjaro. Elle offre des paysages variés, de la forêt tropicale et la lande au désert alpin et aux vues sur les glaciers.'},
    {number: 5, question: 'La route Lemosho est-elle fréquentée ?', answer: 'Lemosho débute sur le côté ouest tranquille de la montagne, donc les premiers jours sont paisibles et peu fréquentés. Elle rejoint la route Machame plus fréquentée près de Lava Tower, mais dans l\'ensemble elle est moins fréquentée que des itinéraires comme Marangu.'},
    {number: 6, question: 'Quel type d\'hébergement est disponible sur la route Lemosho ?', answer: 'Lemosho est un itinéraire uniquement en camping. Vous dormirez dans des tentes de haute qualité dans des campements désignés. Les porteurs transportent et installent tout l\'équipement de camping pour vous.'},
    {number: 7, question: 'La route Lemosho convient-elle aux débutants ?', answer: 'Oui, surtout si vous choisissez la version 8 jours. L\'itinéraire plus long donne aux débutants plus de temps pour s\'acclimater et se reposer, augmentant leur réussite au sommet et leur confort.'},
    {number: 8, question: 'Quelle est la meilleure période pour gravir la route Lemosho ?', answer: 'Les meilleurs mois sont janvier-mars et juin-octobre, lorsque le temps est plus sec et la visibilité meilleure. Ces périodes offrent un trek plus sûr et des vues plus dégagées au sommet.'},
    {number: 9, question: 'Dois-je m\'entraîner pour la route Lemosho ?', answer: 'L\'entraînement est vivement recommandé. Visez des exercices de cardio, de force et d\'endurance. Les longues randonnées avec un sac à dos sont le meilleur moyen de vous préparer à l\'altitude et aux heures de trek quotidiennes.'},
    {number: 10, question: 'Pourquoi choisir la route Lemosho plutôt que d\'autres itinéraires ?', answer: 'Lemosho offre le meilleur équilibre entre paysages, taux de réussite et gestion de l\'affluence. Elle est idéale pour les randonneurs souhaitant une expérience plus reculée avec de meilleures chances d\'atteindre le sommet.'},
  ],
}

const rongai: RouteFr = {
  slug: 'rongai-route',
  name: 'Route Rongai',
  seoTitle: 'Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Gravissez le Kilimandjaro via la route Rongai, le seul itinéraire abordant la montagne par le nord. Itinéraire jour par jour réel, tarifs et conseils d'experts.",
  heroHeading: 'Route Rongai, l\'itinéraire nordique reculé du Kilimandjaro',
  heroTagline: 'Le doux sentier nordique vers le Kilimandjaro.',
  heroBody: [
    "La route Rongai est le seul itinéraire abordant le Kilimandjaro par le côté nord, près de la frontière kenyane, offrant une expérience plus calme et reculée avec des paysages progressivement changeants et moins d'affluence. Elle est parfaite pour ceux qui souhaitent une ascension paisible, apprécient les observations de la faune et préfèrent un itinéraire plus sec — notamment pendant la saison des pluies.",
    "Bien que légèrement moins pittoresque au début que des itinéraires comme Lemosho, la route Rongai compense par sa solitude, ses taux de réussite et une approche finale spectaculaire du sommet via le rebord du cratère de Kibo. La descente se fait par la route Marangu, vous offrant l'occasion de voir les deux côtés de la montagne.",
  ],
  heroImage: {src: '/images/routes/rongai/hero.webp', alt: "Un grimpeur posant devant le panneau du sommet Uhuru Peak sur le Kilimandjaro"},
  itineraryHeading: 'Itinéraire de la route Rongai',
  itinerarySubheading: 'Le sentier tranquille venu du nord',
  daysLabel: '7 jours',
  stops: [
    arrivalStopFr,
    {
      label: 'Jour de trek 1 : Nalemoru Gate – Simba Camp',
      meta: ['📍 Nalemoru Gate (1 950 m / 6 398 pieds) → Simba Camp (2 600 m / 8 530 pieds)', '📈 Dénivelé positif : 650 m / 2 132 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Départ depuis le côté nord-est du Kilimandjaro près de la frontière kenyane. Le sentier traverse des forêts luxuriantes et des terres agricoles ouvertes avant d\'atteindre Simba Camp, niché dans la zone de bruyère.'],
    },
    {
      label: 'Jour de trek 2 : Simba Camp – Second Cave Camp',
      meta: ['📍 Simba Camp (2 600 m / 8 530 pieds) → Second Cave Camp (3 450 m / 11 318 pieds)', '📈 Dénivelé positif : 850 m / 2 788 pieds', '⏳ Durée : 5-6 heures'],
      body: ['Le sentier monte progressivement à travers une lande ouverte avec des vues panoramiques sur les plaines en contrebas et le pic accidenté de Mawenzi devant vous.'],
    },
    {
      label: 'Jour de trek 3 : Second Cave Camp – Kikelewa Camp',
      meta: ['📍 Second Cave Camp (3 450 m / 11 318 pieds) → Kikelewa Camp (3 600 m / 11 811 pieds)', '📈 Dénivelé positif : 150 m / 492 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Un trek plus court aujourd\'hui avec un dénivelé léger, offrant du temps pour s\'acclimater. La végétation devient plus clairsemée à mesure que vous progressez vers la zone alpine.'],
    },
    {
      label: 'Jour de trek 4 : Kikelewa Camp – Mawenzi Tarn',
      meta: ['📍 Kikelewa Camp (3 600 m / 11 811 pieds) → Mawenzi Tarn (4 330 m / 14 206 pieds)', '📈 Dénivelé positif : 730 m / 2 395 pieds', '⏳ Durée : 4-5 heures'],
      body: ['Le sentier devient plus raide, menant à un magnifique lac glaciaire niché sous les flèches spectaculaires de Mawenzi. C\'est l\'un des campements les plus pittoresques du Kilimandjaro.'],
    },
    {
      label: 'Jour de trek 5 : Mawenzi Tarn – Kibo Hut',
      meta: ['📍 Mawenzi Tarn (4 330 m / 14 206 pieds) → Kibo Hut (4 700 m / 15 420 pieds)', '📈 Dénivelé positif : 370 m / 1 214 pieds', '⏳ Durée : 5-6 heures'],
      body: ['Traversez la vaste selle désertique alpine entre Mawenzi et Kibo. Le paysage est austère et silencieux, vous préparant mentalement au défi du sommet à venir.'],
    },
    {
      label: 'Jour de trek 6 : Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        '📍 Kibo Hut (4 700 m / 15 420 pieds) → Uhuru Peak (5 895 m / 19 341 pieds) → Horombo Hut (3 720 m / 12 205 pieds)',
        '📈 Dénivelé positif : 1 195 m / 3 921 pieds',
        '📉 Dénivelé négatif : 2 175 m / 7 136 pieds',
        '⏳ Durée : 12-14 heures',
      ],
      body: ['Le jour du sommet commence juste après minuit. Après avoir atteint Uhuru Peak pour un lever de soleil inoubliable, redescendez jusqu\'à Horombo Hut pour un repos bien mérité.'],
    },
    {
      label: 'Jour de trek 7 : Horombo Hut – Marangu Gate',
      meta: ['📍 Horombo Hut (3 720 m / 12 205 pieds) → Marangu Gate (1 860 m / 6 102 pieds)', '📉 Dénivelé négatif : 1 860 m / 6 102 pieds', '⏳ Durée : 5-6 heures'],
      body: ['Descendez à travers la forêt tropicale luxuriante, où vous pourriez apercevoir des singes bleus et des oiseaux exotiques. À Marangu Gate, vous recevrez votre certificat de sommet et direz au revoir à la montagne.'],
    },
    departureStopFr,
  ],
  infoTabsHeading: 'Pourquoi choisir Rongai ?',
  tabs: [
    {
      id: 'duration',
      label: 'Durée du voyage',
      blocks: [
        {
          heading: 'Quels sont les avantages de choisir la route Rongai ?',
          paragraphs: [
            "La route Rongai est le seul itinéraire du Kilimandjaro abordant le sommet par le nord, près de la frontière kenyane. Elle est réputée pour être moins fréquentée, plus sèche et plus reculée, offrant une expérience unique avec d'excellentes vues sur les plaines d'Amboseli au Kenya. Avec des pentes douces, elle est idéale pour les grimpeurs recherchant une ascension plus progressive et une expérience de trek plus calme. La diversité pittoresque — allant de la forêt tropicale et la lande au désert alpin — en fait un choix remarquable pour les amoureux de la nature et les photographes.",
          ],
        },
        {
          heading: 'Combien de temps faut-il pour parcourir la route Rongai ?',
          paragraphs: [
            '7 jours / 6 nuits sur la montagne.',
            "Une journée d'acclimatation optionnelle peut être ajoutée pour un rythme plus détendu et un meilleur taux de réussite au sommet.",
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Détail des tarifs',
      blocks: [
        {
          heading: 'Quel est le coût associé à la route Rongai ?',
          paragraphs: ["Les prix peuvent varier selon la taille du groupe, les prestations incluses et la qualité de l'opérateur. En moyenne :"],
          bullets: ['Trek privé : à partir de 2 200 $ à 2 800 $ par personne', 'Trek en groupe : à partir de 1 900 $ à 2 300 $ par personne'],
        },
      ],
    },
    {
      id: 'stay',
      label: "Où vous séjournerez",
      blocks: [
        {
          heading: 'Quels sont les campements le long de la route Rongai ?',
          paragraphs: [
            "Contrairement à la route Marangu qui utilise des refuges, Rongai est un itinéraire entièrement en camping. Vous dormirez dans des tentes de montagne 4 saisons avec des matelas en mousse, et les repas sont servis dans une tente-restaurant commune. Les campements comprennent :",
            'Ces campements sont paisibles et peu fréquentés, offrant de magnifiques ciels étoilés et des vues sur la montagne.',
          ],
          bullets: ['Simba Camp', 'Second Cave Camp', 'Kikelewa Camp', 'Mawenzi Tarn', 'Kibo Hut (camp de base)', 'Horombo Hut (descente via la route Marangu)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularité et affluence',
      blocks: [
        {
          heading: 'La route Rongai est-elle fréquentée ?',
          paragraphs: [
            "La route Rongai est l'un des itinéraires les moins fréquentés, ce qui en fait un choix parfait pour les randonneurs recherchant la solitude. Alors que des itinéraires comme Machame et Marangu connaissent une plus forte affluence, Rongai offre une expérience tranquille, en particulier durant les premiers jours du trek. Même en haute saison, elle conserve une atmosphère plus calme.",
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: "Avis d'experts",
      blocks: [
        {
          heading: 'Quelles sont nos impressions sur la route Rongai ?',
          bullets: [
            "Taux de réussite : supérieur à la moyenne grâce à une montée lente et régulière et à la possibilité de s'acclimater à Mawenzi Tarn.",
            'Météo : un sentier plus sec du côté nord signifie moins de perturbations dues à la pluie.',
            "Nuit du sommet : débute depuis Kibo Hut, offrant une montée directe et raide vers Gilman's Point avant de continuer vers Uhuru Peak.",
            'Particularité : vous descendez du côté Marangu, vous offrant une expérience de traversée de la montagne — un plaisir rare parmi les itinéraires du Kilimandjaro.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Rongai',
  secondaryTagline: 'Découvrez les deux côtés du Kilimandjaro en un seul voyage inoubliable.',
  faqHeading: '10 questions sur la route Rongai',
  faqs: [
    {number: 1, question: 'Combien de temps faut-il pour parcourir la route Rongai ?', answer: 'L\'itinéraire standard prend 7 jours, mais certains grimpeurs ajoutent une journée d\'acclimatation supplémentaire pour augmenter leurs chances de réussite au sommet.'},
    {number: 2, question: 'La route Rongai convient-elle aux débutants ?', answer: 'Oui. Elle a une pente plus douce et moins de montées raides, ce qui en fait une excellente option pour les débutants en trekking de haute altitude.'},
    {number: 3, question: 'Qu\'est-ce qui rend la route Rongai unique ?', answer: 'C\'est le seul itinéraire débutant du côté nord du Kilimandjaro près de la frontière kenyane, offrant des conditions sèches et des vues uniques sur le parc national d\'Amboseli.'},
    {number: 4, question: 'Quel est le taux de réussite au sommet via la route Rongai ?', answer: 'Avec 7 jours, le taux de réussite est d\'environ 85 à 90 %, surtout si une journée d\'acclimatation est incluse.'},
    {number: 5, question: 'La route Rongai est-elle fréquentée par rapport aux autres ?', answer: 'C\'est l\'un des itinéraires les plus tranquilles du Kilimandjaro, parfait pour ceux souhaitant éviter les foules plus importantes présentes sur des itinéraires comme Machame et Marangu.'},
    {number: 6, question: 'À quoi ressemblent les campements sur Rongai ?', answer: 'Vous dormirez sous tente dans des campements pittoresques comme Mawenzi Tarn et Kikelewa, réputés pour leurs cadres reculés et paisibles et leurs paysages spectaculaires.'},
    {number: 7, question: 'Redescend-on par le même sentier ?', answer: 'Non. Vous montez par le nord et redescendez via la route Marangu au sud, offrant une expérience plus variée de la montagne.'},
    {number: 8, question: 'Quelle est la meilleure période de l\'année pour gravir la route Rongai ?', answer: 'De janvier à mi-mars et de juin à octobre offrent le meilleur temps. C\'est également une bonne option pendant la saison des pluies, car le côté nord reste relativement sec.'},
    {number: 9, question: 'Le mal des montagnes est-il fréquent sur cet itinéraire ?', answer: 'Comme sur tous les itinéraires, le mal des montagnes est possible. Cependant, l\'ascension progressive de Rongai aide le corps à s\'adapter plus facilement — surtout avec un itinéraire de 7 jours.'},
    {number: 10, question: 'Pourquoi devrais-je choisir la route Rongai plutôt que d\'autres options ?', answer: 'Si vous recherchez un sentier plus calme, une excellente acclimatation et une diversité pittoresque sans l\'affluence, Rongai offre l\'une des meilleures expériences globales du Kilimandjaro.'},
  ],
}

const umbwe: RouteFr = {
  slug: 'umbwe-route',
  name: 'Route Umbwe',
  seoTitle: 'Route Umbwe | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Gravissez le Kilimandjaro via la route Umbwe, l'itinéraire le plus raide et le plus direct de la montagne. Itinéraire jour par jour réel, tarifs et conseils d'experts.",
  heroHeading: 'Route Umbwe',
  heroTagline: 'Le sentier raide vers la solitude et la gloire du sommet',
  heroBody: [
    "La route Umbwe est l'itinéraire le plus direct — et sans doute le plus exigeant — vers le sommet du Mont Kilimandjaro. Connue pour ses montées raides, ses crêtes accidentées et son terrain palpitant, elle est privilégiée par les randonneurs expérimentés recherchant un itinéraire audacieux et moins fréquenté.",
    "Contrairement aux itinéraires plus populaires, Umbwe offre une nature sauvage brute, moins d'affluence et un défi accéléré à travers la forêt tropicale luxuriante, des crêtes raides et des zones alpines élevées. Bien que physiquement intense, la récompense est une solitude inégalée et des paysages montagneux spectaculaires.",
  ],
  heroImage: {src: '/images/routes/umbwe/hero.jpg', alt: 'Tentes colorées à Karanga Camp avec le Kibo enneigé en arrière-plan'},
  itineraryHeading: 'Itinéraire de la route Umbwe',
  itinerarySubheading: 'Le chemin le plus raide et le plus direct vers le sommet',
  daysLabel: '6 jours',
  stops: [
    arrivalStopFr,
    {
      label: 'Jour de trek 1 : Umbwe Gate – Umbwe Cave Camp',
      meta: ['📍 Umbwe Gate (1 800 m/5 905 pieds) → Umbwe Cave Camp (2 850 m/9 350 pieds)', '📈 Dénivelé positif : 1 050 m / 3 445 pieds', '⏳ Durée : 5-7 heures'],
      body: ["Après l'enregistrement à Umbwe Gate, le sentier plonge directement dans la forêt tropicale. Vous trekkerez sur une crête étroite et raide bordée d'arbres géants, de mousse et de racines enchevêtrées. Attendez-vous à un défi physique dès le départ — mais aussi à des vues incroyables en vous élevant au-dessus de la canopée forestière."],
    },
    {
      label: 'Jour de trek 2 : Umbwe Cave Camp – Barranco Camp',
      meta: ['📍 Umbwe Cave Camp (2 850 m/9 350 pieds) → Barranco Camp (3 900 m/12 800 pieds)', '📈 Dénivelé positif : 1 050 m / 3 450 pieds', '⏳ Durée : 4-6 heures'],
      body: ['Vous laissez la forêt derrière vous pour entrer dans la lande et les landes de bruyère, en grimpant le long de crêtes acérées avec des vues à couper le souffle sur les vallées en contrebas. Vous rejoindrez les randonneurs de Machame et Lemosho à Barranco Camp.'],
    },
    {
      label: 'Jour de trek 3 : Barranco Camp – Karanga Camp',
      meta: ['📍 Barranco Camp (3 900 m/12 800 pieds) → Karanga Camp (3 995 m/13 106 pieds)', '📈 Dénivelé positif : 95 m / 306 pieds', '⏳ Durée : 4-5 heures'],
      body: ['Après avoir affronté la célèbre Barranco Wall, une escalade amusante avec des vues panoramiques, le sentier descend et remonte à travers des vallées avant d\'atteindre Karanga Camp, perché sur une crête balayée par le vent.'],
    },
    {
      label: 'Jour de trek 4 : Karanga Camp – Barafu Camp',
      meta: ['📍 Karanga Camp (3 995 m/13 106 pieds) → Barafu Camp (4 673 m/15 331 pieds)', '📈 Dénivelé positif : 678 m / 2 225 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Une journée de trek plus courte laisse à votre corps le temps de se reposer et de se préparer pour la nuit du sommet. Vous arriverez à Barafu Camp en milieu de journée. L\'après-midi est consacré à l\'hydratation, aux repas et au repos avant que l\'ascension finale ne débute à minuit.'],
    },
    {
      label: 'Jour de trek 5 : Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4 673 m/15 331 pieds) → Uhuru Peak (5 895 m/19 341 pieds) → Mweka Camp (3 110 m/10 204 pieds)',
        '📈 Dénivelé positif : 1 222 m / 4 010 pieds',
        '📉 Dénivelé négatif : 2 785 m / 9 137 pieds',
        '⏳ Durée : 12-16 heures',
      ],
      body: ['Un départ à minuit vous mène au sommet sous les étoiles. Atteignez Uhuru Peak au lever du soleil, puis entamez une longue descente vers Mweka Camp. C\'est la journée la plus difficile — mentalement et physiquement — mais aussi la plus inoubliable.'],
    },
    {
      label: 'Jour de trek 6 : Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3 110 m/10 204 pieds) → Mweka Gate (1 640 m/5 380 pieds)', '📉 Dénivelé négatif : 1 470 m / 4 823 pieds', '⏳ Durée : 3-4 heures'],
      body: ['La descente finale vous mène à travers la forêt tropicale luxuriante jusqu\'à Mweka Gate, où votre certificat de sommet vous attend. Dites au revoir à la montagne et profitez du trajet retour vers Moshi ou Arusha.'],
    },
    departureStopFr,
  ],
  infoTabsHeading: 'Pourquoi choisir Umbwe ?',
  tabs: [
    {
      id: 'duration',
      label: 'Durée du voyage',
      blocks: [
        {
          heading: 'Quels sont les avantages de choisir la route Umbwe ?',
          paragraphs: [
            "Si vous recherchez une aventure audacieuse et pleine d'adrénaline sur le Kilimandjaro, la route Umbwe est faite pour vous. C'est l'itinéraire le plus raide et le plus direct vers le sommet — offrant une ascension exaltante à travers des paysages sauvages et intacts. Étant moins fréquentée, elle offre des sentiers paisibles, une beauté naturelle brute et une connexion intime avec la montagne que peu d'autres itinéraires offrent. Elle est privilégiée par les randonneurs chevronnés et les amateurs d'aventure recherchant une expérience calme, hors des sentiers battus, sans être rebutés par le défi supplémentaire.",
            'Choisissez Umbwe si vous souhaitez :',
            "⚠️ Remarque : en raison de l'ascension rapide et du temps d'acclimatation réduit, cet itinéraire convient mieux aux randonneurs expérimentés ou en excellente condition physique.",
          ],
          bullets: [
            'Un sentier plus calme et plus reculé',
            "Moins d'affluence, même en haute saison",
            'Une ascension raide et directe qui gagne rapidement de l\'altitude',
            'Des crêtes pittoresques et des vues spectaculaires tout au long du parcours',
            'Une ascension plus rapide avec une distance totale plus courte',
          ],
        },
        {
          heading: 'Combien de temps faut-il pour parcourir la route Umbwe ?',
          paragraphs: [
            "C'est l'un des itinéraires les plus courts et les plus directs vers le sommet, ce qui signifie moins de temps sur la montagne — mais aussi un défi physique et d'altitude plus important.",
          ],
          bullets: ['Jours au total : 6 jours (5 jours de trek + sommet)', 'Distance : environ 53 km', 'Point de départ : Umbwe Gate (1 800 m)', 'Sommet : Uhuru Peak (5 895 m)', 'Point d\'arrivée : Mweka Gate (1 640 m)'],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Détail des tarifs',
      blocks: [
        {
          heading: 'Quel est le coût associé à la route Umbwe ?',
          paragraphs: [
            'Bien que les prix varient selon la taille du groupe, l\'opérateur et les prestations incluses, voici une estimation générale pour une ascension Umbwe de 6 jours :',
            "Les prestations incluses couvrent généralement : les frais de parc et de secours, les tentes, l'équipement de camping et les repas, des guides expérimentés, des porteurs et cuisiniers, le transport aller-retour vers le point de départ, le certificat de sommet.",
            "🧾 Conseil : vérifiez toujours si le prix inclut l'hébergement avant/après, la location d'équipement et les pourboires pour les porteurs et guides.",
          ],
          bullets: ['Circuit en groupe : 1 800 $ à 2 300 $ par personne', 'Trek privé : 2 400 $ à plus de 3 000 $ par personne'],
        },
      ],
    },
    {
      id: 'stay',
      label: "Où vous séjournerez",
      blocks: [
        {
          heading: 'Quels sont les campements le long de la route Umbwe ?',
          paragraphs: [
            'Contrairement à la route Marangu (qui utilise des refuges), la route Umbwe est une expérience entièrement en camping. Vous séjournerez dans des campements installés chaque jour par vos porteurs. Les camps sont situés à :',
            'Attendez-vous à des ciels nocturnes spectaculaires, un air de montagne frais et le confort d\'un sac de couchage chaud sous toile.',
          ],
          bullets: ['Umbwe Cave Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp (à la descente)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularité et affluence',
      blocks: [
        {
          heading: 'La route Umbwe est-elle fréquentée ?',
          paragraphs: [
            "Umbwe est l'un des itinéraires les moins fréquentés du Kilimandjaro. Vous pourriez même vous retrouver seul sur le sentier pendant des heures, en particulier sur les sections inférieures. Une fois que vous rejoignez les grimpeurs de Machame et Lemosho à Barranco Camp, cela devient un peu plus animé — mais reste plus paisible que d'autres itinéraires. Si la solitude compte pour vous, c'est un excellent choix.",
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: "Avis d'experts",
      blocks: [
        {
          heading: 'Quelles sont nos impressions sur la route Umbwe ?',
          bullets: [
            "L'acclimatation est limitée, ce qui augmente le défi. Cet itinéraire n'est pas idéal pour les randonneurs débutants en haute altitude.",
            'Les guides recommandent des randonnées de pré-acclimatation ou un entraînement en haute altitude si vous choisissez Umbwe.',
            'Le taux de réussite au sommet est plus faible que sur les itinéraires plus longs, mais les randonneurs solides avec un bon rythme et une bonne hydratation réussissent souvent bien.',
            'Pour ceux ayant une expérience de randonnée technique, la Barranco Wall est une section amusante et pittoresque, pas une ascension effrayante.',
            'La durée plus courte signifie moins de jours de congé ou de voyage — mais nécessite également une meilleure condition physique.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Umbwe',
  secondaryTagline: 'Le sentier raide vers la solitude et la gloire du sommet.',
  faqHeading: '10 questions sur la route Umbwe',
  faqs: [
    {number: 1, question: 'Combien de temps faut-il pour gravir le Kilimandjaro via la route Umbwe ?', answer: 'La route Umbwe prend généralement 6 jours, incluant le jour du sommet et la descente. Certains grimpeurs optent pour une version de 7 jours afin de laisser plus de temps pour s\'acclimater, bien que 6 jours soit la norme.'},
    {number: 2, question: 'La route Umbwe est-elle difficile ?', answer: 'Oui — Umbwe est considérée comme l\'itinéraire non technique le plus difficile du Kilimandjaro. Son ascension raide et rapide laisse peu de temps pour l\'acclimatation, la rendant plus adaptée aux randonneurs expérimentés et en bonne forme physique.'},
    {number: 3, question: 'Quel est le taux de réussite pour la route Umbwe ?', answer: 'En raison de sa courte durée et de son profil raide, le taux de réussite au sommet est plus faible que sur les itinéraires plus longs — souvent autour de 60 à 70 %. Des jours supplémentaires d\'acclimatation peuvent améliorer vos chances.'},
    {number: 4, question: 'La route Umbwe est-elle fréquentée ?', answer: 'Pas du tout. C\'est l\'un des itinéraires les moins fréquentés de la montagne. Vous profiterez de sentiers calmes et de campements paisibles, en particulier dans les premières étapes avant de rejoindre d\'autres itinéraires à Barranco.'},
    {number: 5, question: 'La route Umbwe est-elle pittoresque ?', answer: 'Elle est incroyablement pittoresque ! L\'itinéraire monte à travers une forêt tropicale dense, des crêtes spectaculaires et des vallées profondes, offrant des vues panoramiques dès le début du trek et des panoramas magnifiques tout au long.'},
    {number: 6, question: 'Où dort-on sur la route Umbwe ?', answer: 'Vous séjournerez dans des campements installés par votre équipe de soutien. Contrairement à la route Marangu, qui utilise des refuges, Umbwe est une expérience entièrement en camping.'},
    {number: 7, question: 'Les débutants peuvent-ils faire la route Umbwe ?', answer: 'Elle n\'est pas recommandée pour les débutants. L\'itinéraire est physiquement exigeant et a un temps d\'acclimatation limité. Si vous débutez en trekking de haute altitude, un itinéraire plus long et progressif comme Lemosho ou Machame conviendra mieux.'},
    {number: 8, question: 'Quelle est la meilleure période pour gravir via la route Umbwe ?', answer: 'Les meilleurs mois sont janvier-mars et juin-octobre, offrant un temps sec et un ciel dégagé. Décembre est également possible, bien que légèrement plus humide.'},
    {number: 9, question: 'La route Umbwe rejoint-elle d\'autres sentiers ?', answer: 'Oui. Autour de Barranco Camp, la route Umbwe rejoint les routes Machame et Lemosho, partageant le circuit sud vers le sommet et redescendant via la route Mweka.'},
    {number: 10, question: 'Pourquoi choisir la route Umbwe plutôt que d\'autres ?', answer: 'Choisissez Umbwe si vous souhaitez une ascension plus difficile, reculée et pittoresque avec moins d\'affluence. Elle est idéale pour les randonneurs recherchant la solitude, des paysages spectaculaires et une durée totale plus courte — soyez simplement prêt pour l\'intensité.'},
  ],
}

const northernCircuit: RouteFr = {
  slug: 'northern-circuit-route',
  name: 'Route Northern Circuit',
  seoTitle: 'Route Northern Circuit | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Gravissez le Kilimandjaro via la route Northern Circuit, l'itinéraire le plus long et le plus pittoresque avec le taux de réussite le plus élevé. Itinéraire jour par jour réel, tarifs et conseils d'experts.",
  heroHeading: 'Route Northern Circuit sur le Mont Kilimandjaro',
  heroTagline: "L'itinéraire le plus populaire vers le sommet du Kilimandjaro",
  heroBody: [
    "La route Northern Circuit est l'itinéraire le plus long et le plus pittoresque du Mont Kilimandjaro, offrant des vues inégalées et le taux de réussite le plus élevé de tous les itinéraires. Faisant presque le tour complet de la montagne, elle permet une excellente acclimatation, ce qui la rend idéale pour les randonneurs recherchant une ascension plus progressive avec moins d'affluence.",
    "Vous découvrirez tout, de la forêt tropicale luxuriante et la lande alpine aux hauts plateaux accidentés et aux vastes ciels ouverts sur les versants nord — une région que peu de gens ont l'occasion de voir. Avec sa beauté reculée et son rythme stratégique, le Northern Circuit offre une expérience de trek premium pour ceux disposant de temps et d'un esprit d'aventure.",
  ],
  heroImage: {src: '/images/routes/northern-circuit/hero.jpg', alt: 'Tentes à Mweka Camp avec le sommet du Kibo au lever du soleil'},
  itineraryHeading: 'Itinéraire de la route Northern Circuit',
  itinerarySubheading: 'Aller loin pour aller plus haut',
  daysLabel: '9 jours',
  stops: [
    arrivalStopFr,
    {
      label: 'Jour de trek 1 : Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2 100 m/6 890 pieds) → Mti Mkubwa Camp (2 650 m/8 692 pieds)', '📈 Dénivelé positif : 550 m / 1 800 pieds', '⏳ Durée : 3-4 heures'],
      body: ["Votre trek commence par un trajet jusqu'à Londorossi Gate pour l'enregistrement, suivi d'une marche douce à travers la forêt tropicale luxuriante, abritant des colobes et une riche avifaune. Arrivez à Mti Mkubwa (Big Tree) Camp pour votre première nuit sous les étoiles."],
    },
    {
      label: 'Jour de trek 2 : Mti Mkubwa Camp – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2 650 m) → Shira 1 Camp (3 610 m/11 843 pieds)', '📈 Dénivelé positif : 960 m / 3 151 pieds', '⏳ Durée : 6-7 heures'],
      body: ["Sortez de la forêt pour entrer dans la zone de bruyère et de lande, où le paysage s'ouvre avec des vues sur le pic Kibo. Profitez d'une randonnée paisible à travers le plateau de Shira pour atteindre votre camp."],
    },
    {
      label: 'Jour de trek 3 : Shira 1 Camp – Shira 2 Camp',
      meta: ['📍 Shira 1 Camp (3 610 m) → Shira 2 Camp (3 850 m/12 631 pieds)', '📈 Dénivelé positif : 240 m / 787 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Un court trek à travers le vaste plateau ouvert de Shira Ridge vous laisse du temps pour vous reposer et vous acclimater. Si le temps le permet, vous aurez des vues panoramiques sur le Kibo et le Mont Meru au loin.'],
    },
    {
      label: 'Jour de trek 4 : Shira 2 Camp – Lava Tower – Moir Hut',
      meta: [
        '📍 Shira 2 (3 850 m) → Lava Tower (4 630 m/15 190 pieds) → Moir Hut (4 200 m/13 780 pieds)',
        '📈 Dénivelé positif : 780 m / 2 559 pieds',
        '📉 Dénivelé négatif : 430 m / 1 410 pieds',
        '⏳ Durée : 6-7 heures',
      ],
      body: ["Aujourd'hui inclut une montée jusqu'à Lava Tower — un point d'acclimatation clé — avant de redescendre légèrement vers le Moir Hut, reculé et tranquille, niché dans une vallée de haute altitude."],
    },
    {
      label: 'Jour de trek 5 : Moir Hut – Buffalo Camp',
      meta: ['📍 Moir Hut (4 200 m) → Buffalo Camp (4 020 m/13 189 pieds)', '📉 Dénivelé négatif : 180 m / 591 pieds', '⏳ Durée : 5-7 heures'],
      body: ['Marchez le long des versants nord rarement vus du Kilimandjaro, avec des vues panoramiques vers les plaines kenyanes. Le chemin est sauvage et tranquille — c\'est ici que le Northern Circuit gagne sa réputation.'],
    },
    {
      label: 'Jour de trek 6 : Buffalo Camp – Third Cave Camp',
      meta: ['📍 Buffalo Camp (4 020 m) → Third Cave (3 870 m/12 697 pieds)', '📉 Dénivelé négatif : 150 m / 492 pieds', '⏳ Durée : 5-6 heures'],
      body: ["Une autre journée de trek doux à travers le désert alpin. En continuant vers l'est, le sentiment d'isolement est inégalé. Installez-vous à Third Cave Camp et préparez-vous pour l'effort final."],
    },
    {
      label: 'Jour de trek 7 : Third Cave Camp – School Hut',
      meta: ['📍 Third Cave (3 870 m) → School Hut (4 750 m/15 584 pieds)', '📈 Dénivelé positif : 880 m / 2 887 pieds', '⏳ Durée : 4-5 heures'],
      body: ['Une journée plus courte avec une montée régulière vers School Hut, votre dernière base avant la tentative de sommet. Arrivez tôt pour le dîner et le repos avant votre ascension de minuit.'],
    },
    {
      label: 'Jour de trek 8 : School Hut – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 School Hut (4 750 m) → Uhuru Peak (5 895 m/19 341 pieds) → Mweka Camp (3 110 m/10 204 pieds)',
        '📈 Dénivelé positif : 1 145 m / 3 757 pieds',
        '📉 Dénivelé négatif : 2 785 m / 9 137 pieds',
        '⏳ Durée : 12-15 heures',
      ],
      body: ['Jour du sommet ! Commencez votre ascension vers minuit, atteignez Stella Point au lever du soleil, puis poussez jusqu\'à Uhuru Peak, le point culminant de l\'Afrique. Après avoir célébré, redescendez à Mweka Camp pour un repos bien mérité.'],
    },
    {
      label: 'Jour de trek 9 : Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3 110 m) → Mweka Gate (1 640 m/5 380 pieds)', '📉 Dénivelé négatif : 1 470 m / 4 823 pieds', '⏳ Durée : 3-4 heures'],
      body: ['Une dernière randonnée à travers la forêt tropicale vous mène à Mweka Gate, où vous signerez votre départ, recevrez votre certificat de sommet, et retournerez à Moshi pour célébrer et vous reposer.'],
    },
    departureStopFr,
  ],
  infoTabsHeading: 'Pourquoi choisir le Northern Circuit ?',
  tabs: [
    {
      id: 'duration',
      label: 'Durée du voyage',
      blocks: [
        {
          heading: 'Quels sont les avantages de choisir la route Northern Circuit ?',
          bullets: [
            "Taux de réussite le plus élevé grâce à sa période d'acclimatation prolongée.",
            "L'itinéraire le plus long du Kilimandjaro (9 jours), offrant plus de temps pour s'adapter et profiter.",
            'Des paysages spectaculaires sous tous les angles — forêt tropicale luxuriante, plateau de Shira et nature sauvage du nord.',
            "Très peu de fréquentation — vous verrez rarement d'autres groupes avant la nuit du sommet.",
            'Idéal pour les randonneurs expérimentés ou ceux souhaitant un rythme plus détendu.',
            'Excellente chance d\'observer la faune, y compris élands et buffles, sur les versants inférieurs.',
          ],
        },
        {
          heading: 'Combien de temps faut-il pour parcourir la route Northern Circuit ?',
          paragraphs: [
            "Jours total sur la montagne : 9. Jours d'ascension : 8 (avec un dénivelé progressif). Jour de descente : 1. Ce temps supplémentaire améliore considérablement la réussite au sommet tout en permettant à votre corps de s'adapter naturellement à l'altitude.",
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Détail des tarifs',
      blocks: [
        {
          heading: 'Quel est le coût associé à la route Northern Circuit ?',
          paragraphs: [
            'Les prix du Northern Circuit de 9 jours incluent généralement :',
            '💵 Fourchette estimée : 2 500 $ à 3 700 $ par personne, selon la taille du groupe et la qualité de l\'opérateur.',
          ],
          bullets: [
            'Tous les frais de parc, permis et taxes',
            'Guides de montagne professionnels, porteurs et cuisiniers',
            'Pension complète sur la montagne (repas, eau purifiée, collations)',
            'Équipement de camping (tentes, matelas, tente-restaurant, etc.)',
            'Transferts aéroport et séjours à l\'hôtel avant/après l\'ascension',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: "Où vous séjournerez",
      blocks: [
        {
          heading: 'Quels sont les campements le long de la route Northern Circuit ?',
          bullets: [
            "Camping tout au long du parcours – il n'y a pas de refuges sur cet itinéraire.",
            'Tentes de montagne 3 saisons confortables avec matelas en mousse.',
            'Tentes toilettes privées et tentes-restaurants pour les opérateurs haut de gamme.',
            'Les campements sont calmes, pittoresques et moins fréquentés que sur d\'autres itinéraires.',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popularité et affluence',
      blocks: [
        {
          heading: 'La route Northern Circuit est-elle fréquentée ?',
          bullets: [
            'Le Northern Circuit est l\'itinéraire le moins fréquenté du Kilimandjaro.',
            'Parfait pour les randonneurs préférant un sentier plus reculé et paisible.',
            'Vous verrez moins de groupes jusqu\'à ce que vous rejoigniez les sentiers Marangu/Machame près du sommet.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: "Avis d'experts",
      blocks: [
        {
          heading: 'Quelles sont nos impressions sur la route Northern Circuit ?',
          bullets: [
            'Recommandé pour les photographes et amoureux de la nature souhaitant voir tous les côtés du Kilimandjaro.',
            'Avec sa durée de 9 jours, il est idéal pour les randonneurs préoccupés par le mal des montagnes.',
            'Bien que non techniquement difficile, vous aurez besoin d\'une bonne endurance pour les longues journées.',
            'Offre une expérience de nature sauvage unique, loin des sentiers touristiques principaux.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Northern Circuit',
  secondaryTagline: 'Le chemin pittoresque vers le sommet – Aller loin pour aller plus haut.',
  faqHeading: '10 questions sur la route Northern Circuit',
  faqs: [
    {number: 1, question: 'Combien de temps prend la route Northern Circuit ?', answer: 'La route Northern Circuit prend généralement 9 à 10 jours. Cette durée permet une acclimatation adéquate, augmentant considérablement les chances de réussite au sommet du Kilimandjaro.'},
    {number: 2, question: 'Est-il difficile de gravir le Kilimandjaro via le Northern Circuit ?', answer: 'C\'est un long trek, mais l\'acclimatation en douceur le rend gérable pour les débutants en bonne forme physique.'},
    {number: 3, question: 'Quel est le taux de réussite au sommet sur cet itinéraire ?', answer: 'Environ 90 à 95 %, le plus élevé de tous les itinéraires grâce à un gain d\'altitude progressif.'},
    {number: 4, question: 'Quelle est la meilleure période pour gravir via le Northern Circuit ?', answer: 'Janvier-mars et juin-octobre offrent le meilleur temps et les meilleures conditions de sentier.'},
    {number: 5, question: 'Le Northern Circuit est-il plus cher que d\'autres itinéraires ?', answer: 'Oui, car il est plus long et plus reculé — mais l\'expérience est inégalée.'},
    {number: 6, question: 'Ai-je besoin d\'une expérience de trekking préalable ?', answer: 'Non, mais une bonne condition physique et une bonne préparation sont essentielles.'},
    {number: 7, question: 'Quelle faune pourrais-je observer ?', answer: 'Singes bleus, colobes, buffles, et parfois des éléphants sur les versants inférieurs.'},
    {number: 8, question: 'Le Northern Circuit est-il fréquenté ?', answer: 'Non. C\'est l\'itinéraire le plus calme avec une fréquentation très faible.'},
    {number: 9, question: 'Est-ce un itinéraire de camping ?', answer: 'Oui, toutes les nuits se passent sous tente. Aucun refuge n\'est disponible.'},
    {number: 10, question: 'Puis-je louer du matériel sur place ?', answer: 'Oui, la plupart des opérateurs réputés proposent du matériel de location de haute qualité à Moshi ou Arusha.'},
  ],
}

const routesFr: RouteFr[] = [machame, marangu, lemosho, rongai, umbwe, northernCircuit]

// ---------- routesHubPage-fr ----------

async function seedRoutesHubFr() {
  const cards = [
    {title: 'Route Machame', slug: 'machame-route', summary: "Connue sous le nom de Whiskey Route, Machame est l'itinéraire le plus populaire du Kilimandjaro, offrant des paysages à couper le souffle et un terrain varié. Bien que difficile avec des sentiers escarpés et des campements sous tente, elle offre une excellente acclimatation pour les grimpeurs recherchant un trek plus court mais gratifiant.", image: {src: '/images/routes/hub/card-machame.png', alt: 'Carte illustrée de la route Machame'}},
    {title: 'Route Lemosho', slug: 'lemosho-route', summary: "L'un des itinéraires les plus pittoresques du Kilimandjaro, Lemosho débute à la porte isolée de Londorossi, traversant le magnifique plateau de Shira. Cet itinéraire offre une ascension paisible avec des vues spectaculaires, une faune riche et une montée progressive pour une expérience confortable.", image: {src: '/images/routes/hub/card-lemosho.png', alt: 'Carte illustrée de la route Lemosho'}},
    {title: 'Route Rongai', slug: 'rongai-route', summary: "Seul itinéraire nordique du Kilimandjaro, Rongai est moins fréquenté et plus doux, ce qui en fait un excellent choix pour ceux qui préfèrent une ascension calme et régulière. Cet itinéraire est idéal pendant la saison des pluies car il reçoit moins de précipitations et offre un trek agréable à travers une nature sauvage préservée.", image: {src: '/images/routes/hub/card-rongai.png', alt: 'Carte illustrée de la route Rongai'}},
    {title: 'Route Northern Circuit', slug: 'northern-circuit-route', summary: "L'itinéraire le plus long et le plus pittoresque, le Northern Circuit offre la meilleure acclimatation en contournant progressivement le Kilimandjaro. Avec des vues panoramiques et un taux de réussite élevé, cet itinéraire offre une expérience de trekking paisible et immersive.", image: {src: '/images/routes/hub/card-northern-circuit.png', alt: 'Carte illustrée de la route Northern Circuit'}},
  ]
  await client.createOrReplace({
    _id: 'routesHubPage-fr',
    _type: 'routesHubPage',
    language: 'fr',
    seo: {_type: 'seo', title: 'Itinéraires d\'ascension du Kilimandjaro | Climbing Kilimanjaro Tanzania', description: 'Comparez les meilleurs itinéraires pour gravir le Mont Kilimandjaro — Machame, Lemosho, Rongai et le Northern Circuit — avec des itinéraires réels et des conseils d\'experts.'},
    hero: {eyebrow: "Toit de l'Afrique.", heading: 'Les meilleurs itinéraires pour gravir le Kilimandjaro', locationPill: 'Nord de la Tanzanie'},
    ctaBandButtons: [
      {_type: 'ctaButton', _key: key(), label: 'Demander un devis maintenant', href: '/request-a-quote-tanzania-safari/', variant: 'solid'},
      {_type: 'ctaButton', _key: key(), label: 'Discutez avec notre expert', href: 'https://wa.me/255767140150', variant: 'outline'},
    ],
    promoSection: {heading: 'Ce qu\'il faut savoir avant de gravir le Kilimandjaro', exploreLabel: 'Explorer toutes les infos', exploreHref: '/kilimanjaro-climbing-guide/'},
    tabsHeading: 'Itinéraires et cartes d\'ascension du Kilimandjaro',
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'routeHubCard', _key: key(), title: card.title, routeSlug: card.slug, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
    testimonials: [
      {name: 'Obazee', date: '2023-11-28', quote: "L'ascension d'une vie ! Notre ascension du Kilimandjaro avec Asili Explorer African Safaris fut véritablement extraordinaire ! Du début à la fin, l'équipe a assuré une expérience inoubliable, rendant notre voyage vers le sommet fluide, sûr et mémorable."},
      {name: 'Romy H', date: '2023-11-28', quote: "Il n'est pas surprenant qu'Asili Explorer African Safaris maintienne une réputation 5 étoiles. Leur expertise, leur professionnalisme et leur engagement envers la satisfaction client les distinguent. Si vous cherchez la meilleure agence de trekking au Kilimandjaro, ne cherchez plus !"},
      {name: 'Rony V', date: '2023-12-27', quote: "En octobre 2023, nous avons effectué un trek de six jours jusqu'au sommet du Kilimandjaro avec Asili Explorer African Safaris. L'expérience fut phénoménale, et je les recommande vivement à quiconque envisage cette aventure."},
      {name: 'Avdb', date: '2023-11-28', quote: "Joe était un guide et chauffeur parfait. Il nous a fait visiter et découvrir la vraie faune de la Tanzanie. Rien n'était trop compliqué pour lui. Sa connaissance de tous les hauts lieux des différents animaux est impressionnante."},
    ].map((t) => ({_type: 'hubTestimonial', _key: key(), name: t.name, date: t.date, quote: t.quote})),
    faqHeading: 'Questions fréquentes',
    faqSubheading: 'Vos questions et nos réponses',
    faqIntro: "Vous avez des questions sur la réservation d'un safari en Tanzanie avec nous ? Consultez nos FAQ ci-dessous pour des réponses rapides. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter — nos experts sont là pour vous aider à planifier l'aventure tanzanienne parfaite.",
    faqs: [
      {question: 'Quels itinéraires sont disponibles pour le Kilimandjaro ?', answer: 'Le Mont Kilimandjaro propose plusieurs itinéraires adaptés aux grimpeurs de tous niveaux, préférences et styles de trekking. Chez Asili Explorer African Safaris, nous sommes spécialisés dans les quatre itinéraires les plus populaires du Kilimandjaro : Rongai Route, Lemosho Route, Northern Circuit Route et Machame Route. Nos ascensions guidées garantissent la sécurité, une acclimatation adéquate et un voyage inoubliable jusqu\'au sommet.'},
      {question: 'Quel itinéraire du Kilimandjaro est le moins fréquenté ?', answer: 'La Northern Circuit Route est la moins fréquentée, offrant une expérience de trek paisible et isolée.'},
      {question: 'Quel est l\'itinéraire le plus facile pour gravir le Kilimandjaro ?', answer: 'La Rongai Route est considérée comme la plus facile en raison de ses pentes progressives et de son ascension directe.'},
      {question: 'Quel itinéraire du Kilimandjaro est le plus pittoresque ?', answer: 'La Lemosho Route est souvent considérée comme la plus pittoresque, avec des paysages à couper le souffle, des écosystèmes variés et des vues panoramiques.'},
      {question: 'Combien coûte l\'ascension du Kilimandjaro ?', answer: 'Le coût de l\'ascension du Kilimandjaro varie de 2 500 $ à 4 000 $, selon le choix de l\'itinéraire, la durée, la taille du groupe, le niveau de service et les prestations incluses. Chez Asili Explorer African Safaris, nous garantissons des guides bien formés, des normes de sécurité élevées et une expérience globale exceptionnelle.'},
      {question: 'Combien de temps faut-il pour gravir le Mont Kilimandjaro ?', answer: 'L\'ascension prend généralement entre 6 et 9 jours, selon l\'itinéraire choisi. Un itinéraire plus long permet une meilleure acclimatation, augmentant les chances d\'une expérience de sommet réussie et agréable.'},
      {question: 'Les débutants peuvent-ils gravir le Mont Kilimandjaro ?', answer: 'Oui ! Bien qu\'aucune compétence technique en escalade ne soit requise, les débutants doivent suivre un entraînement physique adapté avant de tenter l\'ascension. Nos guides expérimentés veillent à ce que les grimpeurs débutants bénéficient du soutien et de l\'accompagnement nécessaires tout au long du voyage.'},
      {question: 'Quelle est la meilleure période pour gravir le Mont Kilimandjaro ?', answer: 'Les meilleures saisons pour gravir le Kilimandjaro sont les mois secs : de janvier à mars et de juin à octobre. Ces mois offrent les meilleures conditions météorologiques, un ciel plus dégagé et une expérience de trek plus agréable.'},
      {question: 'Avez-vous besoin d\'un guide pour gravir le Kilimandjaro ?', answer: 'Oui ! L\'ascension du Kilimandjaro sans guide agréé n\'est pas autorisée. Les guides apportent leur expertise, surveillent votre santé, garantissent votre sécurité et vous aident à naviguer sur le terrain difficile du Kilimandjaro — même les grimpeurs expérimentés doivent en avoir un.'},
      {question: 'Quel est le niveau de difficulté pour gravir le Mont Kilimandjaro ?', answer: 'Gravir le Mont Kilimandjaro est une aventure exigeante mais gratifiante. La principale difficulté provient de la haute altitude et du terrain varié. Avec une bonne préparation, un itinéraire bien planifié et un encadrement expert, des grimpeurs de différents niveaux d\'expérience peuvent atteindre le sommet avec succès.'},
      {question: 'Comment dort-on sur le Kilimandjaro ?', answer: 'Pendant votre trek au Kilimandjaro, vous séjournerez dans des tentes de haute qualité, résistantes aux intempéries et conçues pour le confort en conditions extrêmes, avec des tentes spacieuses, des matelas isolants et des sacs de couchage chauds pour une nuit reposante dans nos campements désignés.'},
      {question: 'Faut-il de l\'oxygène pour gravir le Kilimandjaro ?', answer: 'La plupart des grimpeurs n\'ont pas besoin d\'oxygène supplémentaire pour gravir le Kilimandjaro. La clé d\'une ascension réussie est une bonne acclimatation. Dans de rares cas de mal des montagnes sévère, de l\'oxygène est disponible par mesure de sécurité.'},
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  })
  console.log('routesHubPage-fr created/replaced')
}

async function routeToFieldsFr(data: RouteFr) {
  return {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    name: data.name,
    hero: {
      heading: data.heroHeading,
      tagline: data.heroTagline,
      body: data.heroBody.map(paragraphBlock),
      image: await uploadImage(client, data.heroImage),
    },
    itinerary: {
      heading: data.itineraryHeading,
      subheading: data.itinerarySubheading,
      daysLabel: data.daysLabel,
      stops: data.stops.map((stop) => ({
        _type: 'routeStop',
        _key: key(),
        label: stop.label,
        ...(stop.meta?.length ? {meta: stop.meta} : {}),
        body: stop.body.map(paragraphBlock),
      })),
    },
    infoTabs: {
      heading: data.infoTabsHeading,
      tabs: data.tabs.map((tab) => ({
        _type: 'routeInfoTab',
        _key: key(),
        tabId: tab.id,
        label: tab.label,
        blocks: tab.blocks.map((block) => ({
          _type: 'routeInfoBlock',
          _key: key(),
          heading: block.heading,
          ...(block.paragraphs?.length ? {paragraphs: block.paragraphs.map(paragraphBlock)} : {}),
          ...(block.bullets?.length ? {bullets: block.bullets} : {}),
          ...(block.pricingTable
            ? {
                pricingTable: {
                  columns: block.pricingTable.columns,
                  rows: block.pricingTable.rows.map((row) => ({_type: 'pricingRow', _key: key(), label: row.label, values: row.values})),
                },
              }
            : {}),
        })),
      })),
    },
    secondaryBanner: {heading: data.secondaryHeading, tagline: data.secondaryTagline},
    faqHeading: data.faqHeading,
    faqs: data.faqs.map((faq) => ({_type: 'numberedFaq', _key: key(), number: faq.number, question: faq.question, answer: faq.answer})),
  }
}

async function run() {
  for (const route of routesFr) {
    const enId = await findEnId(client, 'route', route.slug)
    if (!enId) {
      console.log(`SKIP ${route.slug}: no en source found`)
      continue
    }
    const fields = await routeToFieldsFr(route)
    const frId = await upsertTranslatedDoc(client, 'route', route.slug, 'fr', fields)
    await linkTranslationMetadata(client, 'route', [
      {language: 'en', id: enId},
      {language: 'fr', id: frId},
    ])
    console.log(`${route.slug}-fr done (${frId})`)
  }
  await seedRoutesHubFr()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
