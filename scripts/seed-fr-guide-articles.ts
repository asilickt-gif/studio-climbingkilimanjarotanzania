/**
 * Phase 5: French translation for the 6 remaining guide articles
 * (climbing-mount-kilimanjaro was already seeded separately).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-guide-articles.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface TableFr {
  columns: string[]
  rows: string[][]
}
interface SectionFr {
  heading: string
  body?: string
  table?: TableFr
}
interface FaqFr {
  question: string
  answer: string
}
interface GuideArticleFr {
  slug: string
  seoTitle: string
  seoDescription: string
  heading: string
  heroImage?: {src: string; alt: string}
  intro: string
  sections: SectionFr[]
  faqHeading?: string
  faqs?: FaqFr[]
}

function tableToDoc(table?: TableFr) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedGuideArticleFr(data: GuideArticleFr) {
  const enId = await findEnId(client, 'article', data.slug)
  if (!enId) {
    console.log(`SKIP ${data.slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    heading: data.heading,
    ...(data.heroImage ? {topImage: await uploadImage(client, data.heroImage)} : {}),
    intro: data.intro,
    sections: data.sections.map((section) => ({
      _type: 'articleSection',
      _key: key(),
      heading: section.heading,
      ...(section.body ? {body: stringToPt(section.body)} : {}),
      ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
    })),
    ...(data.faqHeading ? {faqHeading: data.faqHeading} : {}),
    ...(data.faqs?.length ? {faqs: data.faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer}))} : {}),
  }
  const frId = await upsertTranslatedDoc(client, 'article', data.slug, 'fr', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`${data.slug}-fr done (${frId})`)
}

const kilimanjaroClimbingSeasonsFr: GuideArticleFr = {
  slug: 'kilimanjaro-climbing-seasons',
  seoTitle: 'Meilleur mois pour gravir le Mont Kilimandjaro | Guide météo',
  seoDescription: "Un guide météo mois par mois pour gravir le Mont Kilimandjaro : meilleurs mois, saisons sèches, mois à éviter et conseils d'experts sur le timing.",
  heading: 'Meilleur mois pour gravir le Mont Kilimandjaro',
  intro:
    'Les meilleurs mois pour gravir le Mont Kilimandjaro sont pendant les saisons sèches, soit de janvier à mars et de juin à octobre. Ces périodes offrent un ciel dégagé et des sentiers plus secs, menant à des conditions de randonnée plus favorables. Pour un équilibre entre bon temps et moins d\'affluence, envisagez de grimper en janvier, février ou octobre.',
  sections: [
    {
      heading: 'Meilleur mois pour gravir le Mont Kilimandjaro : le guide météo ultime',
      body: "Les itinéraires du Kilimandjaro sont les chemins officiellement désignés utilisés par les randonneurs pour atteindre le sommet de la plus haute montagne d'Afrique, Uhuru Peak (5 895 m). Choisir le bon itinéraire d'ascension du Mont Kilimandjaro est l'une des décisions les plus importantes que vous prendrez en planifiant votre trek. Chaque itinéraire diffère par ses paysages, sa difficulté, son profil d'acclimatation, son taux de réussite et son expérience globale.",
    },
    {
      heading: 'Pourquoi le meilleur mois pour gravir le Mont Kilimandjaro est important',
      body: "Le climat du Kilimandjaro oscille entre forêts tropicales humides et sommets arctiques — choisir le meilleur mois pour gravir le Mont Kilimandjaro affecte l'état des sentiers, les risques de mal aigu des montagnes et les vues. Les saisons sèches (jan-mars, juin-oct) offrent des sentiers stables et des panoramas dégagés, tandis que les pluies (avr-mai, nov) apportent boue et brouillard. Nos guides recommandent des itinéraires de 7 jours ou plus pendant les hautes saisons pour une acclimatation optimale. Le choix des saisons intermédiaires permet d'économiser 10 à 20 % sur les coûts tout en bénéficiant d'un bon temps.",
    },
    {
      heading: 'Mois par mois : les meilleurs mois pour gravir le Mont Kilimandjaro — guide météo',
      body: 'Voici un aperçu détaillé des meilleurs mois pour gravir le Mont Kilimandjaro, incluant la note globale, la météo, l\'affluence et des conseils d\'itinéraires.',
      table: {
        columns: ['Période', 'Note globale', 'Météo', 'Affluence', 'Itinéraire recommandé'],
        rows: [
          ['16 jan-28 fév', 'Superbe', 'Températures raisonnables, précipitations moyennes, peu de nuages', 'Moyenne', 'Tous les itinéraires ouverts'],
          ['01 mars-31 mars', 'Variable', 'Températures raisonnables, risque croissant de pluie et de neige, nuages denses à basse altitude', 'Faible', 'Plutôt orienté vers la route Rongai, surtout en fin de période'],
          ['01 avr-15 juin', 'Difficile et dangereux', 'Températures raisonnables, fortes précipitations, risques de neige, nuages denses à basse altitude', 'Très faible', 'Tous les itinéraires sont difficiles'],
          ['16 juin-15 juil', 'Variable', 'Très froid, neige et glace au sommet, précipitations en baisse, visibilité en amélioration', 'Moyenne', 'Plutôt orienté vers la route Rongai, surtout en début de période'],
          ['16 juil-31 août', 'Bon', 'Très froid, neige et glace au sommet, faibles précipitations, souvent dégagé', 'Élevée', 'Tous les itinéraires ouverts'],
          ['01 sept-15 oct', 'Très bon', 'Températures raisonnables, faibles précipitations, souvent dégagé', 'Élevée', 'Tous les itinéraires ouverts'],
          ['16 oct-31 oct', 'Variable', 'Températures raisonnables, risque croissant de pluie, visibilité réduite', 'Moyenne', 'Plutôt orienté vers la route Rongai, surtout en fin de période'],
          ['01 nov-15 déc', 'Difficile et dangereux', 'Températures réduites, pluie et neige modérées, orages', 'Faible', 'Tous les itinéraires sont difficiles'],
          ['16 déc-15 jan', 'Variable', 'Températures réduites, pluie et neige modérées, nuages denses à basse altitude', 'Très élevée', 'Plutôt orienté vers la route Rongai, surtout en début de période'],
        ],
      },
    },
    {heading: 'Meilleure période pour gravir le Mont Kilimandjaro : zoom sur les saisons sèches'},
    {heading: 'Janvier à début mars (courte saison sèche)', body: 'Chaud, ensoleillé avec peu de pluie — excellent pour les vues et le confort.'},
    {heading: 'Fin juin à octobre (longue saison sèche)', body: "L'âge d'or du Kilimandjaro : sentiers secs, air vif, panoramas grandioses."},
    {
      heading: 'Saisons intermédiaires : des alternatives viables aux meilleurs mois',
      body: 'Novembre (pluies en fin de cycle) et décembre (affluence des fêtes) offrent un temps transitoire — gérable avec Rongai ou Northern Circuit pour moins de boue.',
    },
    {
      heading: 'Mois à éviter : conditions météo difficiles sur le Kilimandjaro',
      body: 'Fin mars-mai (grandes pluies) et novembre (petites pluies) présentent les conditions les plus difficiles — fortes averses, sentiers glissants et brouillard.',
    },
    {
      heading: 'Conseils clés pour grimper durant le meilleur mois pour gravir le Mont Kilimandjaro',
      body: "Choix d'itinéraire : Rongai pour les débuts de saisons intermédiaires/sèches ; tous ouverts en haute saison. Pleine lune : réservez pour la visibilité au sommet — bondé mais magique. Imprévisibilité : emportez des couches ; le sommet est toujours sous zéro. Impact sur le coût : saisons sèches +10-20 % ; réductions en saison intermédiaire.",
    },
  ],
  faqHeading: 'FAQ sur le meilleur mois pour gravir le Mont Kilimandjaro',
  faqs: [
    {question: 'Quel est le meilleur mois pour gravir le Mont Kilimandjaro ?', answer: 'Septembre ou février — sec, dégagé, affluence équilibrée.'},
    {question: 'Quels sont les meilleurs mois pour gravir le Mont Kilimandjaro ?', answer: 'Janvier-mars et juin-octobre pour un temps optimal.'},
    {question: 'Est-il possible de gravir le Kilimandjaro pendant la saison des pluies ?', answer: 'Oui, mais plus risqué — privilégiez la saison intermédiaire pour un compromis.'},
    {question: 'La meilleure période pour gravir le Mont Kilimandjaro affecte-t-elle le coût ?', answer: 'Oui — les hautes saisons ajoutent environ 20 % ; la basse saison permet des économies.'},
  ],
}

const whatIsTheBestRouteUpKilimanjaroFr: GuideArticleFr = {
  slug: 'what-is-the-best-route-up-kilimanjaro',
  seoTitle: 'Quel est le meilleur itinéraire pour gravir le Mont Kilimandjaro ? | Guide complet',
  seoDescription: "Un guide complet des 7 itinéraires d'ascension du Mont Kilimandjaro : taux de réussite, distances de trek, et comment choisir le meilleur itinéraire pour votre ascension.",
  heading: 'Itinéraires du Mont Kilimandjaro',
  intro:
    'Il existe sept itinéraires établis pour gravir le Mont Kilimandjaro, l\'un débutant du côté nord et les autres du côté sud : Northern Circuit, Lemosho, Shira, Machame (route « Whiskey »), Rongai, Marangu (route « Coca-Cola ») et Umbwe. Le Northern Circuit est l\'itinéraire le plus récent et traverse presque toute la montagne, offrant une véritable expérience de nature sauvage et des vues à 360 degrés. Les itinéraires Lemosho et Shira abordent par l\'ouest, tandis que l\'itinéraire Rongai débute par le nord.',
  sections: [
    {
      heading: "Itinéraires du Kilimandjaro : guide complet des itinéraires d'ascension du Mont Kilimandjaro",
      body: "Les itinéraires du Kilimandjaro sont les chemins officiellement désignés utilisés par les randonneurs pour atteindre le sommet de la plus haute montagne d'Afrique, Uhuru Peak (5 895 m). Choisir le bon itinéraire d'ascension du Mont Kilimandjaro est l'une des décisions les plus importantes que vous prendrez en planifiant votre trek. Chaque itinéraire diffère par ses paysages, sa difficulté, son profil d'acclimatation, son taux de réussite et son expérience globale.",
    },
    {heading: "Combien d'itinéraires existe-t-il pour gravir le Mont Kilimandjaro ?", body: 'Il existe 7 principaux itinéraires du Kilimandjaro utilisés pour gravir la montagne : Northern Circuit, Lemosho, Shira, Machame, Rongai, Marangu et Umbwe.'},
    {heading: "Éléments à considérer pour choisir votre itinéraire d'ascension du Mont Kilimandjaro", body: 'Pour choisir le meilleur itinéraire du Mont Kilimandjaro pour vous, de nombreuses variables sont à prendre en compte.'},
    {heading: 'QUI :', body: 'Qui grimpe ? Les capacités de tout le groupe doivent être prises en compte pour choisir un itinéraire. Y a-t-il des débutants dans votre groupe ? Y a-t-il des personnes n\'ayant jamais été en haute altitude ? Choisissez un itinéraire adapté à tous.'},
    {heading: 'QUOI :', body: "Quelles sont les limites de votre ascension ? Avez-vous un budget contraint ? Ou un nombre de jours limité pour votre voyage ? Il existe des itinéraires plus ou moins chers et des durées plus ou moins longues. Ayez une idée du budget et du nombre de jours que vous êtes prêt à consacrer à la montagne."},
    {heading: 'COMMENT :', body: 'Comment envisagez-vous votre trek ? Voulez-vous l\'itinéraire le plus difficile ou un itinéraire moins exigeant ? Le Kilimandjaro peut engendrer beaucoup d\'inconfort et de souffrance. Certains itinéraires sont plus cléments que d\'autres.'},
    {heading: 'OÙ :', body: 'Où souhaitez-vous commencer votre ascension ? Les itinéraires débutent de tous les côtés de la montagne. Votre point de départ affecte le coût, les paysages et leur diversité.'},
    {heading: 'POURQUOI :', body: 'Pourquoi grimpez-vous ? Est-il très important d\'atteindre le sommet ? Choisissez alors un itinéraire au taux de réussite élevé. Voulez-vous prendre les meilleures photos ? Choisissez alors un itinéraire pittoresque. Voulez-vous simplement y être ? Choisissez alors un itinéraire rapide et économique.'},
    {heading: 'QUAND :', body: "Quand grimpez-vous ? Si vous grimpez pendant la saison sèche, parfait. Mais si vous grimpez pendant la saison des pluies ou les saisons intermédiaires, l'itinéraire choisi peut influencer la difficulté de l'ascension. Les ascensions autour des vacances et des pleines lunes sont particulièrement fréquentées."},
    {
      heading: 'Quel est le meilleur itinéraire pour gravir le Mont Kilimandjaro ?',
      body: 'Le meilleur itinéraire du Kilimandjaro dépend de vos priorités : pour le taux de réussite le plus élevé, choisissez le Northern Circuit ou Lemosho. Pour les paysages, choisissez Lemosho ou Machame. Pour le budget et le temps, choisissez Marangu. Pour un défi, choisissez Umbwe.',
    },
    {
      heading: 'Carte des itinéraires du Kilimandjaro et distances de trek',
      body: 'Les distances totales de trek varient selon l\'itinéraire.',
      table: {columns: ['Itinéraire', 'Distance totale'], rows: [['Lemosho', '70 km'], ['Machame', '62 km'], ['Marangu', '64 km'], ['Northern Circuit', '96 km'], ['Rongai', '65 km']]},
    },
    {
      heading: 'Taux de réussite du Mont Kilimandjaro par itinéraire',
      table: {columns: ['Itinéraire', 'Taux de réussite'], rows: [['Northern Circuit', '95%'], ['Lemosho', '90%'], ['Machame', '85%'], ['Rongai', '80%'], ['Marangu', '65%'], ['Umbwe', '50%']]},
    },
    {
      heading: 'Comment choisir votre itinéraire du Kilimandjaro',
      body: "Pour choisir parmi les itinéraires du Mont Kilimandjaro, tenez compte des capacités de votre groupe, de votre budget, du temps disponible, de la difficulté souhaitée, du point de départ, de votre motivation personnelle et de la saison prévue pour votre ascension.",
    },
    {
      heading: 'Pourquoi réserver votre itinéraire du Kilimandjaro avec Climbing Kilimanjaro Tanzania ?',
      body: 'Choisir le bon itinéraire n\'est qu\'une partie de votre réussite. Réserver auprès d\'un opérateur local de confiance et expérimenté comme Asili Climbing Kilimanjaro garantit des guides certifiés, un traitement équitable des porteurs et une approche privilégiant la sécurité sur chaque itinéraire.',
    },
    {
      heading: "Planifiez dès aujourd'hui votre itinéraire idéal du Kilimandjaro",
      body: 'Découvrez des analyses détaillées de tous les itinéraires du Kilimandjaro, des exemples d\'itinéraires et des conseils d\'experts chez Climbing Kilimanjaro Tanzania — votre ressource de confiance pour gravir le Mont Kilimandjaro en toute sécurité et avec succès.',
    },
  ],
  faqHeading: 'FAQ sur les itinéraires du Kilimandjaro',
  faqs: [
    {question: 'Quel itinéraire du Kilimandjaro a le taux de réussite le plus élevé ?', answer: 'Le Northern Circuit a le taux de réussite le plus élevé grâce à une excellente acclimatation.'},
    {question: 'Combien d\'itinéraires existe-t-il pour gravir le Kilimandjaro ?', answer: 'Il existe sept principaux itinéraires d\'ascension du Mont Kilimandjaro.'},
    {question: 'Quel est le meilleur itinéraire pour le Kilimandjaro ?', answer: "La route Lemosho est la plus recommandée pour l'expérience globale, le taux de réussite et les paysages."},
    {question: 'Quelle est la distance de trek du Kilimandjaro ?', answer: "Variable : 50 à 90 km au total, selon l'itinéraire."},
    {question: 'Quel est le taux de réussite du Mont Kilimandjaro ?', answer: 'Globalement 65 à 80 % ; selon l\'itinéraire, de 50 % (court) à 98 % (long).'},
  ],
}

const kilimanjaroGuideCostFr: GuideArticleFr = {
  slug: 'kilimanjaro-guide-cost',
  seoTitle: 'Coût du guide du Kilimandjaro | Guide complet des tarifs pour gravir le Mont Kilimandjaro',
  seoDescription: "Un guide complet des tarifs pour gravir le Mont Kilimandjaro : coûts par itinéraire, par forfait, ce qui est inclus, et le lien entre coût et taux de réussite au sommet.",
  heading: "Coût de l'ascension du Kilimandjaro en Tanzanie",
  intro:
    "Gravir le Mont Kilimandjaro coûte entre 1 680 $ et plus de 7 000 $ par personne, selon l'opérateur et le niveau de service. Les voyages économiques varient d'environ 1 680 $ à 2 500 $, les circuits milieu de gamme de 2 500 $ à 4 000 $, et les ascensions de luxe peuvent coûter 4 000 $ ou plus, les options haut de gamme pouvant atteindre plus de 7 000 $. Le coût total varie selon des facteurs tels que l'itinéraire, le nombre de jours, la taille du groupe et les prestations incluses, une part importante du prix étant consacrée aux frais de parc obligatoires.",
  sections: [
    {
      heading: 'Coût du guide du Kilimandjaro : guide complet des tarifs pour gravir le Mont Kilimandjaro',
      body: 'Comprendre le coût du guide du Kilimandjaro est essentiel pour planifier votre expédition de rêve vers le plus haut sommet d\'Afrique. Le prix total de l\'ascension du Mont Kilimandjaro dépend de multiples facteurs, notamment le choix de l\'itinéraire, le nombre de jours, le niveau de confort, la taille du groupe et la qualité de l\'entreprise de guidage.',
    },
    {heading: 'Facteurs qui influencent le coût', body: "Niveau de service : les forfaits premium incluent plus de prestations, une meilleure nourriture et un équipement de meilleure qualité, tandis que les options économiques se concentrent sur l'essentiel."},
    {heading: 'Coûts supplémentaires à prendre en compte', body: 'Pourboires : donner un pourboire aux guides, porteurs et cuisiniers est de coutume et peut varier de 150 $ à 300 $ par personne. Vols : les billets d\'avion internationaux et domestiques ne sont généralement pas inclus dans les forfaits.'},
    {
      heading: 'Forfaits du Mont Kilimandjaro',
      body: "Gravissez le plus haut sommet d'Afrique lors d'une aventure privée et personnalisée menée par des guides locaux expérimentés. Tous les forfaits incluent des dates de départ flexibles et votre propre équipe privée de guides, porteurs et cuisiniers. Les repas sont servis dans votre tente-restaurant privée. Les sentiers et campements sont partagés avec d'autres randonneurs.",
    },
    {heading: "Route Marangu (5 jours / 4 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '2 008 $'], ['2 randonneurs partageant', '1 783 $'], ['3-4 randonneurs partageant', '1 678 $']]}},
    {heading: "Route Marangu (6 jours / 5 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '3 588 $'], ['2 randonneurs partageant', '2 938 $'], ['3-4 randonneurs partageant', '2 668 $']]}},
    {heading: "Route Machame ou Umbwe (6 jours / 5 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '2 328 $'], ['2 randonneurs partageant', '2 078 $'], ['3-4 randonneurs partageant', '1 948 $']]}},
    {heading: "Route Machame ou Umbwe (7 jours / 6 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '2 608 $'], ['2 randonneurs partageant', '2 348 $'], ['3-4 randonneurs partageant', '2 203 $']]}},
    {heading: "Route Shira, Lemosho ou Rongai (6 jours / 5 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '2 648 $'], ['2 randonneurs partageant', '2 243 $'], ['3-4 randonneurs partageant', '2 063 $']]}},
    {heading: "Route Shira, Lemosho ou Rongai (7 jours / 6 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '2 938 $'], ['2 randonneurs partageant', '2 513 $'], ['3-4 randonneurs partageant', '2 313 $']]}},
    {heading: "Route Shira, Lemosho ou Rongai (8 jours / 7 nuits de randonnée + 2 nuits d'hôtel)", table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '3 228 $'], ['2 randonneurs partageant', '2 773 $'], ['3-4 randonneurs partageant', '2 568 $']]}},
    {heading: 'Route Northern Circuit (8 jours / 7 nuits + location de toilettes)', table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '3 588 $'], ['2 randonneurs partageant', '2 938 $'], ['3-4 randonneurs partageant', '2 668 $']]}},
    {heading: 'Route Northern Circuit (9 jours / 8 nuits + location de toilettes)', table: {columns: ['Type de randonneur', 'Prix'], rows: [['1 randonneur seul', '3 918 $'], ['2 randonneurs partageant', '3 228 $'], ['3-4 randonneurs partageant', '2 683 $']]}},
    {
      heading: 'Coût du trek du Kilimandjaro par rapport au taux de réussite',
      body: "Des coûts plus élevés sont généralement corrélés à des taux de réussite au sommet plus élevés sur le Kilimandjaro, car les treks plus chers utilisent des itinéraires plus longs permettant une meilleure acclimatation, incluent de meilleures mesures de sécurité et font appel à des opérateurs de meilleure qualité. Les treks économiques sont moins chers mais ont un taux de réussite plus faible en raison de durées plus courtes et de moins de précautions de sécurité, et peuvent faire des économies sur le bien-être de l'équipe et l'équipement. Pour une ascension réussie, il est recommandé de choisir un itinéraire d'au moins sept jours et un opérateur réputé.",
    },
    {
      heading: 'Coût plus élevé, taux de réussite plus élevé',
      body: "Itinéraires : les itinéraires plus longs comme Lemosho ou Northern Circuit offrent des taux de réussite plus élevés (jusqu'à 98-99 %) car ils laissent plus de temps au corps pour s'acclimater à l'altitude. Coût : ces itinéraires coûtent souvent plus cher (2 000 $ à 4 550 $ ou plus) en raison de la durée plus longue et du besoin de plus de soutien logistique. Qualité de l'opérateur : les opérateurs réputés facturent plus cher mais fournissent des mesures de sécurité essentielles comme un équipement adéquat, une nourriture de qualité, des salaires équitables pour les porteurs et des guides expérimentés.",
    },
    {
      heading: 'Coût plus bas, taux de réussite plus bas',
      body: "Itinéraires : les itinéraires plus courts comme Marangu (5-6 jours) sont moins chers mais ont des taux de réussite plus faibles (65-70 %) car ils ne laissent pas assez de temps pour l'acclimatation. Coût : les treks économiques peuvent coûter aussi peu que 1 500 $ à 2 500 $, mais cela résulte souvent d'économies sur des aspects cruciaux. Qualité de l'opérateur : les opérateurs économiques peuvent sous-payer les porteurs, fournir une nourriture inadéquate et utiliser un équipement de mauvaise qualité, ce qui peut compromettre la sécurité et le moral.",
    },
    {
      heading: "Prix du trek du Kilimandjaro : que doit-il inclure ?",
      body: "Un forfait réputé doit toujours inclure : tous les frais de parc, les secours gouvernementaux et l'assistance d'urgence, l'hébergement sur la montagne, les transferts depuis l'aéroport, des guides professionnels, les repas et l'eau potable, des bouteilles d'oxygène et les premiers secours. Évitez les opérateurs qui dissimulent ces coûts essentiels.",
    },
  ],
}

const kilimanjaroClimbingGuideFr: GuideArticleFr = {
  slug: 'kilimanjaro-climbing-guide',
  seoTitle: "Guide d'ascension du Kilimandjaro | Conseils essentiels pour gravir le Mont Kilimandjaro",
  seoDescription: "Conseils essentiels pour gravir le Mont Kilimandjaro : entraînement, acclimatation, saisons, sécurité, oxygène, trousses médicales et à quoi s'attendre sur la montagne.",
  heading: 'Conseils essentiels pour gravir le Mont Kilimandjaro',
  heroImage: {src: '/images/articles/guide-hero.webp', alt: 'Un grimpeur devant le panneau du sommet Uhuru Peak'},
  intro:
    'Le Kilimandjaro, culminant à 5 895 mètres (19 340 pieds) au-dessus du niveau de la mer, est la plus haute montagne indépendante du monde et le « Toit de l\'Afrique ». Étant l\'une des destinations de voyage les plus prisées du continent, le Mont Kilimandjaro attire plus de 40 000 visiteurs chaque année. Ce trek magnifique ne nécessite aucune compétence technique en escalade, le rendant accessible à toute personne en bonne condition physique moyenne. Ce guide est conçu pour aider les grimpeurs à préparer leur aventure unique dans leur vie. Nos recommandations reposent sur notre vaste expérience — chez Asili Climbing Kilimanjaro, nous avons organisé avec succès des treks pour des milliers de grimpeurs.',
  sections: [
    {heading: 'Faits à connaître avant votre trek au Kilimandjaro', body: "Le sommet du Mont Kilimandjaro, Uhuru Peak, culmine à 19 340 pieds / 5 895 m — le point le plus élevé d'Afrique et la plus haute montagne indépendante du monde."},
    {heading: 'Se préparer et s\'entraîner pour le Kilimandjaro'},
    {
      heading: 'Comment devrais-je m\'entraîner pour une ascension du Mont Kilimandjaro ?',
      body: "Maintenir une bonne condition physique est essentiel pour gravir le Kilimandjaro. Cependant, il n'est pas nécessaire d'être un athlète pour atteindre le sommet. Une bonne condition physique moyenne suffit. Pour évaluer votre préparation, vérifiez si vous pouvez marcher confortablement 8 à 10 km. Si c'est le cas, vous êtes suffisamment en forme pour gravir le Mont Kilimandjaro. La course à pied est un excellent exercice de préparation — visez à courir 4 à 5 km avec assurance. La natation est un autre excellent complément à votre entraînement, car elle renforce l'endurance cardiovasculaire.",
    },
    {
      heading: 'Quelles sont les saisons des pluies et sèches en Tanzanie ?',
      body: "La Tanzanie connaît deux saisons des pluies et deux saisons sèches. La courte saison des pluies débute début novembre et se poursuit jusqu'à fin décembre, suivie d'une saison sèche qui dure jusqu'à mi-mars. La longue saison des pluies commence à mi-mars et se termine à mi-juin. Pour gravir le Kilimandjaro pendant la saison des pluies, envisagez les versants nord — cette zone reçoit nettement moins de précipitations. Les itinéraires recommandés incluent Rongai, Northern Circuit et Marangu. De juin à octobre, l'Afrique de l'Est connaît des nuits froides, surtout en haute altitude.",
    },
    {heading: 'Autres informations de trek'},
    {heading: 'Liste d\'équipement pour le Kilimandjaro', body: "Un guide d'équipement gratuit pour le Kilimandjaro présentant le matériel essentiel et les recommandations d'experts d'Asili Climbing Kilimanjaro."},
    {heading: 'Vous prévoyez de gravir le Kilimandjaro ?', body: 'Nous sommes là pour vous fournir des réponses claires et des conseils d\'experts — contactez-nous pour toute question et faites le premier pas en toute confiance.'},
  ],
  faqHeading: 'Questions sur la sécurité au Kilimandjaro',
  faqs: [
    {
      question: 'Pouvez-vous recommander une assurance voyage fiable ?',
      answer: 'Asili Climbing Kilimanjaro recommande Global Rescue pour une couverture d\'assurance voyage fiable. Assurez-vous que votre police inclut trois éléments clés : la couverture pour la randonnée en haute altitude jusqu\'à 6 000 mètres, l\'évacuation par hélicoptère et des services médicaux complets.',
    },
    {
      question: "Avez-vous des conseils pour une meilleure acclimatation lors de l'ascension du Kilimandjaro ?",
      answer: "Pour bien vous acclimater et réussir votre ascension, nous recommandons : marchez lentement (votre corps a besoin de temps pour s'adapter aux niveaux d'oxygène plus faibles, et un rythme modéré l'aide à produire plus de globules rouges) ; buvez 3 à 4 litres d'eau par jour ; participez à nos randonnées d'acclimatation quotidiennes en altitude et retour (généralement pas plus de 2 heures) ; et, si vous avez le temps, envisagez de gravir le Mont Meru avant votre voyage au Kilimandjaro. Choisir des itinéraires de sept jours ou plus laisse également plus de temps à votre corps pour s'adapter, améliorant vos chances d'atteindre le sommet.",
    },
    {question: "Quel est le meilleur itinéraire pour l'acclimatation ?", answer: 'Pour mieux vous acclimater sur le Kilimandjaro, les meilleurs itinéraires sont Lemosho, Machame et Rongai — ou d\'autres itinéraires de sept jours ou plus.'},
    {
      question: "Combien de jours d'acclimatation supplémentaires devrais-je prendre ?",
      answer: "Sur la route Machame de sept jours, vous n'aurez besoin d'aucun jour d'acclimatation supplémentaire. Rongai et Lemosho sont des options tout aussi bonnes. Cependant, si vous pensez ne pas être en très bonne forme physique, vous pouvez ajouter un ou deux jours de repos supplémentaires.",
    },
    {
      question: "Faut-il des systèmes d'oxygène pour gravir le Kilimandjaro ?",
      answer: "Au sommet du Kilimandjaro, le niveau d'oxygène dans l'air est environ la moitié de celui au niveau de la mer. La plupart des grimpeurs peuvent atteindre Uhuru Peak sans oxygène supplémentaire, mais par sécurité, nous transportons toujours de nombreuses bouteilles d'oxygène lors de nos expéditions, et le coût est inclus dans le prix du circuit.",
    },
    {
      question: 'Dois-je emporter une trousse médicale ?',
      answer: "Lors des expéditions au Kilimandjaro, nos équipes transportent des trousses médicales complètes — de petites trousses tactiques pendant les randonnées pour les blessures, égratignures ou entorses, et de plus grandes trousses de camp avec des médicaments pour les problèmes courants comme les nausées, maux de tête, vomissements et troubles digestifs. Si vous prenez des médicaments sur ordonnance, il est préférable de les apporter lors de votre voyage en Tanzanie.",
    },
    {
      question: 'Quel est le taux de mortalité sur le Kilimandjaro ?',
      answer: "Par rapport à d'autres montagnes, le Kilimandjaro a un faible taux de mortalité sur ses sept itinéraires. Sur les quelque 50 000 personnes qui gravissent le Mont Kilimandjaro chaque année, 3 à 5 perdent la vie, principalement à cause de problèmes cérébraux et pulmonaires liés à l'altitude ou de crises cardiaques dues au non-respect de l'acclimatation. Le taux de mortalité chez les porteurs du Kilimandjaro est nettement plus élevé, en grande partie à cause des opérateurs ultra-économiques fournissant un équipement inadéquat. Choisissez toujours une entreprise enregistrée auprès du KPAP pour contribuer à garantir un traitement équitable des porteurs.",
    },
    {question: 'Pourquoi le sommet du Kilimandjaro s\'appelle-t-il Uhuru Peak ?', answer: 'Le plus haut sommet du Kilimandjaro a été nommé Uhuru Peak pour célébrer l\'indépendance de la Tanzanie vis-à-vis de la Grande-Bretagne en 1961. « Uhuru » signifie « liberté » en swahili.'},
    {
      question: 'Puis-je faire un safari après avoir gravi le Kilimandjaro ?',
      answer: 'Oui — la Tanzanie possède des destinations célèbres pour tout type d\'aventure africaine, les plus populaires étant le parc national du Serengeti et le cratère du Ngorongoro. C\'est une excellente idée de planifier un safari avant ou après l\'ascension.',
    },
  ],
}

const planATripToClimbKilimanjaroFr: GuideArticleFr = {
  slug: 'information-on-how-to-plan-a-trip-to-climb-mount-kilimanjaro-in-tanzania',
  seoTitle: 'Comment planifier un voyage pour gravir le Mont Kilimandjaro | Guide de référence complet',
  seoDescription: "Tout ce dont vous avez besoin pour planifier un voyage au Kilimandjaro : campements de montagne, frais de parc, glaciers, dénivelé par itinéraire, risques d'altitude et comment s'y rendre.",
  heading: 'Informations sur la planification d\'un voyage pour gravir le Mont Kilimandjaro en Tanzanie',
  intro:
    "Planifier un voyage pour gravir le Mont Kilimandjaro implique bien plus que de choisir une date. Ce guide de référence couvre l'essentiel : où se trouve la montagne, son coût en frais de parc officiels, les campements où vous dormirez en chemin, les glaciers que vous verrez près du sommet, le dénivelé de chaque itinéraire, et les risques réels encourus — afin que vous puissiez planifier en toute confiance et grimper avec Asili Climbing Kilimanjaro.",
  sections: [
    {
      heading: 'Où se situe le Mont Kilimandjaro ?',
      body: 'Le Mont Kilimandjaro est situé dans le nord de la Tanzanie, près de la frontière avec le Kenya, au sein du parc national du Kilimandjaro. Les villes les plus proches sont Moshi et Arusha, toutes deux desservies par l\'aéroport international du Kilimandjaro (JRO).',
    },
    {
      heading: 'Dénivelé du Mont Kilimandjaro',
      body: "Le Mont Kilimandjaro est la plus haute montagne d'Afrique et la plus haute montagne indépendante unique du monde, avec un dénivelé d'environ 4 900 mètres (16 100 pieds) de sa base à son sommet. Le sommet de la montagne, Uhuru Peak, culmine à 5 895 mètres (19 341 pieds) au-dessus du niveau de la mer. Le dénivelé est important et exigeant, rendant l'acclimatation cruciale pour les grimpeurs afin d'éviter le mal des montagnes.",
      table: {
        columns: ['Itinéraire', 'Altitude de départ'],
        rows: [
          ['Northern Circuit', '2 100 m (6 890 pieds) à Lemosho Gate'],
          ['Route Lemosho', '2 100 m (6 890 pieds) à Lemosho Gate'],
          ['Route Shira', '3 414 m (11 200 pieds) à Morum Barrier'],
          ['Route Machame', '1 640 m (5 380 pieds) à Machame Gate'],
          ['Route Marangu', '1 843 m (6 047 pieds) à Marangu Gate'],
          ['Route Rongai', '1 950 m (6 398 pieds) à Rongai Gate'],
          ['Route Umbwe', '1 800 m (5 906 pieds) à Umbwe Gate'],
        ],
      },
    },
    {
      heading: 'Campements de montagne sur le Kilimandjaro',
      body: 'Selon votre itinéraire, vous passerez la nuit dans une série de refuges ou de campements sous tente le long de la montagne. Les campements courants incluent Mandara Hut, Horombo Hut, Kibo Hut, Machame Camp, Barafu Hut Camp, Lava Tower Camp, Barranco Hut Camp, Karanga Hut Camp, Mweka Camp, Shira 1 & 2 Camps, School Hut Camp et Umbwe Cave Camp, entre autres. Votre guide et votre équipe de porteurs installent le camp avant votre arrivée chaque jour.',
    },
    {
      heading: 'Les glaciers en recul du Mont Kilimandjaro',
      body: "Le Mont Kilimandjaro est réputé pour ses quatre glaciers célèbres : le Northern Ice Field, l'Eastern Ice Field, le Southern Ice Field et le glacier Furtwängler. Ces glaciers n'existent près de l'équateur qu'en raison de la haute altitude de la montagne — mais ils reculent rapidement à cause du changement climatique. Le seul glacier Furtwängler a perdu plus de 80 % de sa masse depuis le début du XXe siècle, et les estimations actuelles suggèrent que les champs de glace du Kilimandjaro pourraient disparaître complètement d'ici quelques décennies.",
    },
    {
      heading: 'Frais du parc national du Kilimandjaro',
      body: 'Les frais du parc national du Kilimandjaro sont des coûts obligatoires pour les visiteurs souhaitant explorer le parc et gravir la montagne. Ces frais incluent l\'entrée du parc, le camping, les frais de secours et les services de guide et de porteurs, et varient généralement de 2 000 $ à 6 000 $ par personne selon l\'itinéraire et la durée.',
      table: {
        columns: ['Type de frais', 'Coût'],
        rows: [
          ['Frais de secours', '20 $ (unique)'],
          ['Frais de conservation', '70 $ par personne et par jour'],
          ['Frais de camping', '50 $ par personne et par nuit'],
          ["Frais de refuge (route Marangu)", '60 $ par personne et par nuit'],
          ['Frais de cratère', '100 $ par personne et par nuit'],
        ],
      },
    },
    {
      heading: 'Décès sur le Mont Kilimandjaro',
      body: 'Malgré sa popularité, l\'ascension du Kilimandjaro comporte un risque réel : on estime que 3 à 7 grimpeurs meurent chaque année, principalement à cause du mal des montagnes (mal aigu des montagnes, pouvant évoluer en HAPE ou HACE), de l\'hypothermie et de chutes. La « zone de la mort » désigne les altitudes au-delà d\'environ 8 000 pieds où l\'oxygène réduit rend la survie de plus en plus difficile sans acclimatation adéquate. Choisir un itinéraire plus long, un opérateur réputé et suivre le rythme de votre guide réduit considérablement ce risque.',
    },
    {heading: 'Où se trouve le Mont Kilimandjaro ?', body: 'Découvrez l\'emplacement de la montagne sur la carte ci-dessous.'},
  ],
}

const kilimanjaroClimbingFr: GuideArticleFr = {
  slug: 'kilimanjaro-climbing',
  seoTitle: 'Gravir le Mont Kilimandjaro | Aventures sur mesure',
  seoDescription: "Des aventures d'ascension du Kilimandjaro sur mesure. Découvrez nos itinéraires, forfaits et tout ce que vous devez savoir avant de gravir le plus haut sommet d'Afrique.",
  heading: 'Gravir le Mont Kilimandjaro',
  heroImage: {src: '/images/articles/climbing-hero.jpg', alt: 'Randonneur sur le sentier du Kilimandjaro'},
  intro:
    'Le Kilimandjaro, culminant à 5 895 mètres (19 341 pieds), est la plus haute montagne indépendante du monde, ce qui lui vaut le titre de « Toit de l\'Afrique ». Chaque année, des milliers d\'aventuriers empruntent ses sentiers pittoresques, découvrant des paysages variés et des vues à couper le souffle. Aucune compétence technique en escalade n\'est requise — seulement une bonne santé, de la détermination et la bonne équipe pour vous guider. Chez Asili Climbing Kilimanjaro, nous concevons des aventures sur mesure pour l\'ascension du Kilimandjaro de vos rêves.',
  sections: [
    {
      heading: 'Itinéraires d\'ascension du Kilimandjaro',
      body: "Route Machame : connue sous le nom de Whiskey Route, Machame est l'itinéraire le plus populaire du Kilimandjaro, offrant des paysages à couper le souffle et un terrain varié. Bien que difficile avec des sentiers escarpés et des campements sous tente, elle offre une excellente acclimatation pour les grimpeurs recherchant un trek plus court mais gratifiant.\nRoute Lemosho : l'un des itinéraires les plus pittoresques du Kilimandjaro, Lemosho débute à la porte isolée de Londorossi, traversant le magnifique plateau de Shira. Cet itinéraire offre une ascension paisible avec des vues spectaculaires, une faune riche et une montée progressive pour une expérience confortable.\nRoute Rongai : seul itinéraire nordique du Kilimandjaro, Rongai est moins fréquenté et plus doux, ce qui en fait un excellent choix pour ceux qui préfèrent une ascension calme et régulière. Cet itinéraire est idéal pendant la saison des pluies car il reçoit moins de précipitations.\nRoute Northern Circuit : l'itinéraire le plus long et le plus pittoresque, le Northern Circuit offre la meilleure acclimatation en contournant progressivement le Kilimandjaro. Avec des vues panoramiques et un taux de réussite élevé, cet itinéraire offre une expérience de trekking paisible et immersive.",
    },
    {
      heading: "Forfaits d'ascension du Kilimandjaro",
      body: "Choisissez parmi nos forfaits d'ascension du Kilimandjaro soigneusement conçus, chacun adapté pour offrir la meilleure expérience selon vos préférences, votre niveau de forme physique et l'itinéraire souhaité. Que vous recherchiez une ascension rapide ou un trek prolongé et pittoresque, nous avons l'itinéraire parfait pour vous.\nRoute Lemosho 8 jours : avec huit jours de voyage, votre trek du Kilimandjaro sur la route Lemosho dure plus longtemps que les alternatives, permettant une excellente acclimatation.\nRoute Machame 7 jours : la célèbre route Machame avec un temps de voyage total de sept jours, vous offrant encore plus de temps d'acclimatation.\nRoute Marangu 6 jours : un voyage de six jours pour gravir le plus haut sommet d'Afrique via la célèbre route Marangu, avec hébergement en refuges et une variété de paysages.\nRoute Umbwe 6 jours : réputée pour son ascension difficile et abrupte et son sentier magnifique et moins fréquenté.\nNorthern Circuit 9 jours : l'itinéraire le plus récent et le plus long, offrant des vues à 360 degrés et les meilleurs taux de réussite pour atteindre le sommet.\nRoute Rongai 7 jours : abordée par le nord, cette route offre une perspective unique du Kilimandjaro et convient parfaitement à ceux recherchant un trek plus calme.",
    },
    {
      heading: 'Ce qu\'il faut savoir avant de gravir le Kilimandjaro',
      body: "Obtenez toutes les informations essentielles pour préparer votre ascension — des itinéraires aux conseils de sécurité, pour une ascension fluide et réussie.\nConsidérations de température : les températures diurnes varient de 20°C à 27°C (68°F à 81°F) à basse altitude, mais descendent en dessous de zéro à haute altitude, surtout la nuit. Des vêtements superposés sont essentiels.\nVégétation et paysages : les saisons sèches offrent des vues plus dégagées, des fleurs sauvages en fleurs et des forêts luxuriantes le long des sentiers. Les saisons plus humides peuvent entraîner des conditions brumeuses et une couverture nuageuse dense.\nNiveaux d'affluence : les hautes saisons (janvier-février et juillet-septembre) attirent davantage de grimpeurs. Les saisons intermédiaires (fin mars-mai et début novembre-décembre) offrent des expériences plus calmes.\nPréférences personnelles et objectifs : les grimpeurs doivent tenir compte des conditions météorologiques, de leurs préférences de température, du niveau d'affluence et de leur emploi du temps personnel lors de la planification de leur ascension.",
    },
    {
      heading: 'Prêt à relever le défi du Kilimandjaro ?',
      body: "Votre voyage vers le Toit de l'Afrique commence ici. Que vous visiez l'aventure d'une vie ou que vous cherchiez à repousser vos limites jusqu'au sommet, nous sommes là pour vous guider à chaque étape.",
    },
  ],
  faqHeading: 'Vos questions et nos réponses',
  faqs: [
    {
      question: 'Quels itinéraires sont disponibles pour le Kilimandjaro ?',
      answer: 'Le Mont Kilimandjaro propose plusieurs itinéraires adaptés aux grimpeurs de tous niveaux, préférences et styles de trekking. Chez Asili Climbing Kilimanjaro, nous sommes spécialisés dans les quatre itinéraires les plus populaires : Rongai, Lemosho, Northern Circuit et Machame. Nos ascensions guidées garantissent la sécurité, une acclimatation adéquate et un voyage inoubliable jusqu\'au sommet.',
    },
    {question: 'Quel itinéraire du Kilimandjaro est le moins fréquenté ?', answer: 'La Northern Circuit Route est la moins fréquentée, offrant une expérience de trek paisible et isolée.'},
    {question: 'Quel est l\'itinéraire le plus facile pour gravir le Kilimandjaro ?', answer: 'La Rongai Route est considérée comme la plus facile en raison de ses pentes progressives et de son ascension directe.'},
    {question: 'Quel itinéraire du Kilimandjaro est le plus pittoresque ?', answer: 'La Lemosho Route est souvent considérée comme la plus pittoresque, avec des paysages à couper le souffle, des écosystèmes variés et des vues panoramiques.'},
    {
      question: 'Combien coûte l\'ascension du Kilimandjaro ?',
      answer: 'Le coût de l\'ascension du Kilimandjaro varie de 2 500 $ à 4 000 $, selon le choix de l\'itinéraire, la durée, la taille du groupe, le niveau de service et les prestations incluses. Chez Asili Climbing Kilimanjaro, nous garantissons des guides bien formés, des normes de sécurité élevées et une expérience globale exceptionnelle.',
    },
    {question: 'Combien de temps faut-il pour gravir le Mont Kilimandjaro ?', answer: 'L\'ascension prend généralement entre 6 et 9 jours, selon l\'itinéraire choisi. Un itinéraire plus long permet une meilleure acclimatation, augmentant les chances d\'une expérience de sommet réussie et agréable.'},
    {
      question: 'Les débutants peuvent-ils gravir le Mont Kilimandjaro ?',
      answer: 'Oui ! Bien qu\'aucune compétence technique en escalade ne soit requise, les débutants doivent suivre un entraînement physique adapté avant de tenter l\'ascension. Nos guides expérimentés veillent à ce que les grimpeurs débutants bénéficient du soutien nécessaire tout au long du voyage.',
    },
    {question: 'Quelle est la meilleure période pour gravir le Mont Kilimandjaro ?', answer: 'Les meilleures saisons pour l\'ascension sont les mois secs : de janvier à mars et de juin à octobre, offrant les meilleures conditions météorologiques et un ciel plus dégagé.'},
    {
      question: 'Conseils importants pour réussir votre ascension',
      answer: 'Allez doucement — un rythme régulier réduit le risque de mal des montagnes. Hydratez-vous — buvez beaucoup d\'eau. Procurez-vous le bon équipement — des couches adaptées, des chaussures solides et un équipement de qualité. Préparez-vous physiquement et mentalement. Profitez-en et créez des liens — se lier avec d\'autres grimpeurs rend le voyage plus enrichissant.',
    },
    {question: 'Avez-vous besoin d\'un guide pour gravir le Kilimandjaro ?', answer: 'Oui ! L\'ascension du Kilimandjaro sans guide agréé n\'est pas autorisée.'},
    {question: "Pourquoi ai-je besoin d'un guide ?", answer: "Les guides apportent leur expertise, surveillent votre santé, garantissent votre sécurité et vous aident à naviguer sur le terrain difficile du Kilimandjaro."},
    {question: "Les grimpeurs expérimentés peuvent-ils se passer d'un guide ?", answer: 'Même les grimpeurs expérimentés doivent être accompagnés d\'un guide. La haute altitude et les conditions imprévisibles rendent un accompagnement professionnel indispensable.'},
    {question: 'Comment les guides améliorent-ils la sécurité ?', answer: 'Les guides surveillent l\'acclimatation, prodiguent les premiers secours, évaluent les conditions météorologiques et prennent des décisions critiques pour la réussite de l\'ascension.'},
    {
      question: 'Quel est le niveau de difficulté pour gravir le Mont Kilimandjaro ?',
      answer: 'Gravir le Mont Kilimandjaro est une aventure exigeante mais gratifiante. La principale difficulté provient de la haute altitude et du terrain varié. Avec une bonne préparation et un encadrement expert, des grimpeurs de différents niveaux d\'expérience peuvent atteindre le sommet avec succès.',
    },
    {
      question: 'Comment dort-on sur le Kilimandjaro ?',
      answer: 'Pendant votre trek au Kilimandjaro avec nous, vous séjournerez dans des tentes de haute qualité, résistantes aux intempéries et conçues pour le confort en conditions extrêmes, avec des tentes spacieuses, des matelas isolants et des sacs de couchage chauds.',
    },
    {
      question: "Faut-il de l'oxygène pour gravir le Kilimandjaro ?",
      answer: "La plupart des grimpeurs n'ont pas besoin d'oxygène supplémentaire. La clé d'une ascension réussie est une bonne acclimatation. Dans de rares cas de mal des montagnes sévère, de l'oxygène est disponible par mesure de sécurité.",
    },
  ],
}

async function run() {
  await seedGuideArticleFr(kilimanjaroClimbingSeasonsFr)
  await seedGuideArticleFr(whatIsTheBestRouteUpKilimanjaroFr)
  await seedGuideArticleFr(kilimanjaroGuideCostFr)
  await seedGuideArticleFr(kilimanjaroClimbingGuideFr)
  await seedGuideArticleFr(planATripToClimbKilimanjaroFr)
  await seedGuideArticleFr(kilimanjaroClimbingFr)
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
