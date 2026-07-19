/**
 * Phase 5: French translation for the 13 detail articles in content/articles.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-detail-articles.ts --with-user-token
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
  image?: {src: string; alt: string}
}
interface DetailArticleFr {
  slug: string
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroImage: {src: string; alt: string}
  intro: string
  sections: SectionFr[]
}

function tableToDoc(table?: TableFr) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedDetailArticleFr(data: DetailArticleFr) {
  const enId = await findEnId(client, 'article', data.slug)
  if (!enId) {
    console.log(`SKIP ${data.slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    heading: data.heroTitle,
    heroBackgroundImage: await uploadImage(client, data.heroImage),
    intro: data.intro,
    sections: await Promise.all(
      data.sections.map(async (section) => ({
        _type: 'articleSection',
        _key: key(),
        heading: section.heading,
        ...(section.body ? {body: stringToPt(section.body)} : {}),
        ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
        ...(section.image ? {image: await uploadImage(client, section.image)} : {}),
      })),
    ),
  }
  const frId = await upsertTranslatedDoc(client, 'article', data.slug, 'fr', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`${data.slug}-fr done (${frId})`)
}

const isClimbingKilimanjaroSafeFr: DetailArticleFr = {
  slug: 'is-climbing-kilimanjaro-safe',
  seoTitle: "L'ascension du Kilimandjaro est-elle sûre ? | Asili Climbing Kilimanjaro",
  seoDescription: "Est-il sûr de gravir le Mont Kilimandjaro ? Découvrez le mal des montagnes, les mesures de sécurité et comment Asili Climbing Kilimanjaro assure la sécurité de chaque randonneur.",
  heroTitle: "L'ascension du Kilimandjaro est-elle sûre : ce que tout randonneur devrait savoir",
  heroImage: {src: '/images/articles/is-safe-hero.jpg', alt: 'Randonneurs gravissant le Kilimandjaro au lever du soleil'},
  intro:
    "Le Mont Kilimandjaro est l'une des aventures en haute altitude les plus accessibles et gratifiantes au monde. Bien qu'elle ne nécessite aucune compétence technique en escalade, la sécurité sur le Kilimandjaro n'est pas à prendre à la légère. Chez Asili Climbing Kilimanjaro, la sécurité n'est pas seulement une priorité — c'est le fondement de tout ce que nous faisons. Que vous soyez un randonneur débutant ou un aventurier expérimenté, ce guide vous aidera à comprendre comment gravir le Kilimandjaro en toute sécurité et confiance.",
  sections: [
    {
      heading: "L'ascension du Kilimandjaro est-elle sûre ?",
      body: "Oui — avec une bonne préparation, des guides expérimentés et un opérateur responsable, gravir le Kilimandjaro est sûr pour la plupart des personnes en bonne santé. Cependant, c'est un trek en haute altitude, pas une simple longue randonnée. Cela signifie que le mal des montagnes, les conditions météorologiques extrêmes et l'effort physique jouent tous un rôle dans les risques. Choisir un opérateur professionnel axé sur la sécurité comme Asili est essentiel pour réduire ces risques.",
    },
    {
      heading: '🧭 Principales mesures de sécurité prises par Asili Climbing Kilimanjaro',
      body: "Nous allons au-delà des bases pour assurer votre sécurité tout au long de votre ascension :\n1. Guides de montagne certifiés et expérimentés — Certifiés Wilderness First Responder (WFR), formés aux soins médicaux et à l'évacuation en haute altitude, experts locaux connaissant le terrain de la montagne et les conditions météorologiques.\n2. Surveillance quotidienne de la santé — Contrôles de santé deux fois par jour : saturation en oxygène (SpO2), fréquence cardiaque et symptômes généraux. Contrôles du mal aigu des montagnes (MAM) consignés et examinés. Vous décidez de votre rythme — nous nous adaptons à vos besoins.\n3. Oxygène d'urgence et oxymètres — Transportés sur chaque trek au-dessus de 3 000 mètres. Oxygène portable et oxymètres de pouls pour une réponse en temps réel à l'altitude. Protocoles de descente immédiate si nécessaire.\n4. Plans d'évacuation et soutien — Intervention d'urgence 24 h/24 et 7 j/7. Coordination avec le parc national du Kilimandjaro et les équipes de secours locales. Descente en véhicule privé ou en civière disponible en cas de besoin.",
    },
    {
      heading: '⛰️ Comprendre les risques du Kilimandjaro',
      body: "Bien que des milliers de personnes atteignent le sommet en toute sécurité chaque année, connaître les risques vous aide à grimper plus intelligemment :\n🧠 Mal des montagnes — Le MAM peut affecter n'importe qui, quel que soit l'âge ou la condition physique. Symptômes courants : maux de tête, nausées, vertiges, fatigue. Les formes sévères (HAPE/HACE) sont rares mais dangereuses. Conseil de prévention : choisissez des itinéraires plus longs (7-9 jours) comme la route Lemosho ou Northern Circuit pour une meilleure acclimatation.\n🌧️ Météo et exposition — Le climat du Kilimandjaro change rapidement : soleil intense, pluie, vent et nuits glaciales. Des couches vestimentaires et un équipement adéquats sont essentiels pour rester en sécurité et confortable.\n🥾 Effort physique — Un trek régulier sur plusieurs jours. Pas d'escalade, mais le dénivelé peut être physiquement exigeant. Une bonne condition physique de base est utile, surtout pour le jour du sommet.",
    },
    {
      heading: '💡 Comment rester en sécurité lors de l\'ascension du Kilimandjaro',
      body: "Voici ce que vous pouvez faire en tant que grimpeur pour améliorer votre sécurité :\n🕒 Prenez votre temps : ne vous précipitez pas — « pole pole » (doucement) est plus qu'un dicton, c'est une règle de sécurité.\n💧 Hydratez-vous et mangez bien : votre corps a besoin de carburant et d'eau en altitude.\n📋 Choisissez le bon itinéraire : optez pour des itinéraires plus longs pour laisser votre corps s'adapter.\n🧳 Préparez bien votre sac : le bon équipement prévient les blessures dues au froid et la fatigue.\n🩺 Soyez honnête sur vos symptômes : informez immédiatement votre guide si vous ne vous sentez pas bien.\n🧠 Préparez-vous mentalement : un état d'esprit positif aide, surtout lors de la difficile poussée finale vers le sommet.",
    },
    {
      heading: '🧍 Grimpeurs solos et sécurité',
      body: 'Les grimpeurs solos sont entièrement soutenus par leur guide personnel et leur équipe. Même si vous trekkez seul, vous ne serez jamais laissé sans accompagnement, soins et soutien d\'urgence.',
    },
    {
      heading: '👨‍👩‍👧‍👦 Est-ce sûr pour les femmes et les randonneurs plus âgés ?',
      body: 'Oui. Le Kilimandjaro est une montagne accueillante pour les voyageuses, les grimpeurs plus âgés, et même les adolescents (âge minimum de 10 ans autorisé par les règles du parc). Notre équipe veille à ce que chacun, quel que soit son âge ou son genre, se sente à l\'aise et en sécurité.',
    },
    {
      heading: '🔎 Choisir un opérateur sûr : que rechercher',
      body: "Tous les opérateurs sur le Kilimandjaro ne se valent pas. La sécurité doit toujours primer sur le prix. Voici ce qu'un opérateur sûr et éthique doit fournir : des guides agréés et expérimentés ; des plans d'évacuation transparents ; un traitement équitable des porteurs (recherchez l'affiliation KPAP) ; de l'eau propre, des repas nutritifs et une bonne hygiène ; des ratios clients-guides responsables. Asili Climbing Kilimanjaro suit chacune de ces pratiques de sécurité — et bien plus encore.",
    },
    {
      heading: '🗓️ Quelle est la période la plus sûre pour gravir le Kilimandjaro ?',
      body: 'Les deux fenêtres météorologiques les plus sèches et stables sont : janvier à mars (plus frais, moins d\'affluence) et juin à octobre (saison sèche et populaire). Évitez avril-mai et novembre, lorsque les précipitations augmentent le risque de sentiers glissants et d\'exposition.',
    },
    {
      heading: '📣 Le mot de la fin de nos guides experts',
      body: "« Nous disons toujours : 'Le sommet est optionnel — la sécurité ne l'est pas.' Le Kilimandjaro n'est pas une course. Avec le bon plan, la bonne équipe et le respect de la montagne, vous pouvez vivre une aventure sûre et inoubliable. » — Guide Daudi, 158 fois chef d'ascension au sommet chez Asili",
    },
    {
      heading: '🎒 Prêt à grimper en toute sécurité avec Asili ?',
      body: '👉 Avec une planification experte, un accompagnement honnête et une équipe de sécurité dédiée à vos côtés, votre ascension du Kilimandjaro peut être l\'aventure d\'une vie — réalisée en toute sécurité. Contactez Asili Climbing Kilimanjaro pour en savoir plus ou commencer à planifier.',
    },
  ],
}

const gettingToKilimanjaroFr: DetailArticleFr = {
  slug: 'getting-to-kilimanjaro',
  seoTitle: 'Se rendre au Kilimandjaro | Guide de voyage vers le plus haut sommet de Tanzanie',
  seoDescription: "Tout ce que vous devez savoir pour vous rendre au Mont Kilimandjaro : vols, aéroports, visas et liste de contrôle avant l'arrivée.",
  heroTitle: 'Se rendre au Kilimandjaro : votre guide de voyage vers le plus haut sommet de Tanzanie',
  heroImage: {src: '/images/articles/getting-to-hero.jpg', alt: 'Avion KLM volant dans un ciel bleu'},
  intro:
    "Avant de commencer votre trek vers le Toit de l'Afrique, vous devez d'abord vous y rendre — et comprendre comment rejoindre le Mont Kilimandjaro fait partie intégrante de votre planification. Que vous veniez des États-Unis, d'Europe, d'Asie ou d'ailleurs dans le monde, ce guide vous aidera à naviguer sereinement dans votre voyage. Voici tout ce que vous devez savoir pour vous rendre au Mont Kilimandjaro.",
  sections: [
    {
      heading: '🌍 Où se trouve le Mont Kilimandjaro ?',
      body: "Le Mont Kilimandjaro est situé dans le nord de la Tanzanie, près de la frontière kenyane. La grande ville la plus proche est Moshi, Arusha étant une autre base voisine, notamment si vous combinez votre ascension avec un safari. La plupart des treks commencent par un transfert depuis l'une de ces villes vers les différentes portes de la montagne.",
    },
    {
      heading: '✈️ Le meilleur aéroport pour les ascensions du Kilimandjaro',
      body: "L'aéroport international du Kilimandjaro (JRO) est le principal aéroport pour les grimpeurs. Situé à mi-chemin entre Arusha et Moshi, le JRO est à seulement 45-60 minutes en voiture des deux villes. Code IATA : JRO. Nom complet : Aéroport international du Kilimandjaro. Transferts : la plupart des opérateurs proposent des prises en charge à l'aéroport.\nVols directs vers le JRO : vous pouvez voler depuis des grandes villes comme Amsterdam (KLM Royal Dutch Airlines), Doha (Qatar Airways), Istanbul (Turkish Airlines), Addis-Abeba (Ethiopian Airlines), Nairobi (Kenya Airways) et Dar es Salaam (correspondances locales). Si vous venez des États-Unis, du Royaume-Uni, du Canada ou d'Australie, vous aurez généralement une escale en Europe ou au Moyen-Orient avant d'arriver en Tanzanie.",
    },
    {
      heading: '🛬 Aéroports alternatifs',
      body: "Si les vols vers le JRO sont limités ou coûteux, voici deux alternatives :\n1. Aéroport international Julius Nyerere (DAR) – Dar es Salaam : le plus grand aéroport international de Tanzanie. Nécessite un vol domestique vers le Kilimandjaro ou un trajet de plus de 10 heures en voiture. Compagnies domestiques : Air Tanzania, Precision Air et Coastal Aviation.\n2. Aéroport international Jomo Kenyatta (NBO) – Nairobi, Kenya : un hub courant avec plus de vols internationaux. Prenez un court vol de correspondance vers le JRO (1 h) ou conduisez via un poste-frontière (attention aux exigences de visa). Le vol est recommandé plutôt que le trajet terrestre pour le temps et la commodité.",
    },
    {
      heading: '🚌 Transport terrestre vers le Kilimandjaro',
      body: "Si vous êtes déjà en Afrique de l'Est, vous pouvez rejoindre le Kilimandjaro en bus ou en navette depuis Nairobi vers Arusha ou Moshi (environ 6-8 heures), ou via des transferts privés ou taxis organisés par votre agence de trekking. Remarque : un certificat de fièvre jaune peut être requis si vous transitez par le Kenya.",
    },
    {
      heading: '🛂 Conditions d\'entrée : n\'oubliez pas votre visa',
      body: "La plupart des voyageurs auront besoin d'un visa touristique pour entrer en Tanzanie. Coût : 50 $ (ou 100 $ pour les citoyens américains). Où l'obtenir : demandez-le en ligne via le portail eVisa de Tanzanie ou obtenez-le à l'arrivée au JRO. Validité du passeport : minimum 6 mois à compter de la date d'entrée.",
    },
    {
      heading: "🧳 Liste de contrôle avant l'arrivée",
      body: "Avant de décoller, assurez-vous d'avoir : un passeport et un visa valides, un certificat de fièvre jaune (si requis), une assurance voyage (incluant la couverture d'évacuation), des vols internationaux réservés vers le JRO (ou vols de correspondance), un transfert aéroport organisé avec votre opérateur du Kilimandjaro, et une marge d'arrivée (arrivez au moins 1 jour avant votre ascension).",
    },
    {
      heading: '🏨 Où loger avant votre ascension',
      body: "La plupart des grimpeurs logent à Moshi ou Arusha la nuit précédant le début de leur trek. Les deux villes offrent des hôtels et lodges confortables, des boutiques de location de matériel, des achats de dernière minute (collations, cartes SIM, etc.), et des activités culturelles et visites de plantations de café. Conseil : arrivez au moins une journée complète à l'avance pour vous reposer, rencontrer vos guides et effectuer une dernière vérification du matériel avant le trek.",
    },
    {
      heading: '🧭 Le mot de la fin',
      body: "Se rendre au Kilimandjaro est plus facile que vous ne le pensez — avec un aéroport international bien desservi et un soutien fiable, vous atterrirez à seulement un court trajet de votre aventure. Que vous voyagiez seul ou en groupe, arriver tôt et bien préparé vous garantit de commencer votre ascension détendu et prêt. Avec Asili Climbing Kilimanjaro, nous gérons votre arrivée, vos transferts et votre logistique — afin que vous puissiez vous concentrer sur le voyage à venir.",
    },
  ],
}

const mountKilimanjaroFactsFr: DetailArticleFr = {
  slug: 'mount-kilimanjaro-facts',
  seoTitle: "Faits sur le Mont Kilimandjaro | Le toit emblématique de l'Afrique dévoilé",
  seoDescription: "Faits fascinants sur le Mont Kilimandjaro : ses cônes volcaniques, ses cinq zones climatiques, ses glaciers, ses porteurs et ce qui rend le Toit de l'Afrique si emblématique.",
  heroTitle: "Faits sur le Mont Kilimandjaro : le toit emblématique de l'Afrique dévoilé",
  heroImage: {src: '/images/contact/hero.webp', alt: 'Le Mont Kilimandjaro vu au-dessus des acacias de la savane africaine'},
  intro:
    'Le Mont Kilimandjaro est bien plus qu\'une simple ascension — c\'est une merveille naturelle, une icône culturelle et un puissant symbole d\'aventure. Connu comme le « Toit de l\'Afrique », le Kilimandjaro attire des dizaines de milliers de randonneurs chaque année. Mais que savez-vous vraiment de cette montagne légendaire ? Voici quelques-uns des faits les plus fascinants, surprenants et essentiels sur le Mont Kilimandjaro — conçus pour vous aider à apprécier chaque étape de votre voyage.',
  sections: [
    {
      heading: "🌍 1. Le Kilimandjaro est la plus haute montagne d'Afrique",
      body: "Altitude : 5 895 mètres (19 341 pieds) au-dessus du niveau de la mer. Rang mondial : c'est la plus haute montagne indépendante du monde — ne faisant pas partie d'une chaîne de montagnes. Emplacement : nord de la Tanzanie, près de la frontière avec le Kenya.",
    },
    {
      heading: "🧊 2. C'est un volcan — en fait, trois volcans",
      body: "Le Mont Kilimandjaro n'est pas un seul sommet — il est composé de trois cônes volcaniques : Kibo (le plus haut et le seul cône endormi, où vous atteignez le sommet), Mawenzi (accidenté et spectaculaire, non escaladable jusqu'au sommet), et Shira (majoritairement érodé, mais toujours visible sur les itinéraires ouest). Kibo est considéré comme endormi, et non éteint, ce qui signifie qu'il pourrait à nouveau entrer en éruption — bien que sa dernière activité majeure remonte à plus de 360 000 ans.",
    },
    {
      heading: '🌦️ 3. Vous traverserez cinq zones climatiques',
      body: "Gravir le Kilimandjaro, c'est comme marcher de l'équateur jusqu'à l'Arctique. La montagne compte cinq zones écologiques, chacune avec sa météo, sa faune et ses paysages uniques : Zone de culture (800-1 800 m) — terres agricoles, bananiers et villages. Zone de forêt tropicale (1 800-2 800 m) — jungle luxuriante avec singes et oiseaux exotiques. Zone de lande/bruyère (2 800-4 000 m) — lobélies géantes et landes vallonnées. Zone de désert alpin (4 000-5 000 m) — sec, rocheux et presque sans vie. Zone arctique (5 000-5 895 m) — glaciers, températures glaciales et air raréfié.",
    },
    {
      heading: "🧗‍♀️ 4. Aucune escalade technique n'est requise",
      body: "Malgré sa hauteur impressionnante, le Kilimandjaro est un sommet de trekking, pas d'alpinisme. Cela signifie qu'aucune corde, piolet ou équipement technique n'est nécessaire. Il est accessible à quiconque a une bonne condition physique et de la détermination. La réussite dépend davantage de l'adaptation à l'altitude que des compétences d'escalade.",
    },
    {
      heading: '⏳ 5. La plupart des ascensions durent 6 à 9 jours',
      body: "Les meilleures ascensions laissent le temps à votre corps de s'acclimater. Les itinéraires les plus populaires incluent : Route Machame (7 jours) — pittoresque et variée. Route Lemosho (8-9 jours) — excellente pour l'acclimatation et moins d'affluence. Route Marangu (5-6 jours) — la seule avec hébergement en refuges. Northern Circuit (9 jours) — la plus longue et la plus tranquille pour l'acclimatation. Rongai ou Umbwe — pour ceux recherchant des itinéraires uniques.",
    },
    {
      heading: '🌕 6. Vous pouvez grimper pendant la pleine lune',
      body: "Un trek pendant la pleine lune illumine le sommet enneigé et offre une expérience magique et surréaliste. De nombreux grimpeurs planifient leur nuit de sommet pour coïncider avec la pleine lune, pour une meilleure visibilité et des photos inoubliables.",
    },
    {
      heading: '🎒 7. Environ 30 000 personnes tentent l\'ascension chaque année',
      body: "Le Kilimandjaro attire des aventuriers du monde entier. Environ 65 à 75 % des grimpeurs atteignent le sommet, selon l'itinéraire et le temps d'acclimatation. Choisir un itinéraire plus long augmente considérablement vos chances de réussite.",
    },
    {
      heading: '💨 8. Le mal des montagnes est le défi n°1',
      body: "L'air se raréfie à mesure que vous montez, et de nombreux randonneurs ressentent les effets du mal aigu des montagnes (MAM). Les symptômes peuvent inclure maux de tête, nausées et fatigue. Un rythme lent, l'hydratation et des jours de repos sont essentiels pour réduire le risque.",
    },
    {
      heading: '🍲 9. Vous mangerez bien sur la montagne',
      body: "Oubliez les rations de survie fades — la plupart des treks du Kilimandjaro incluent des repas chauds, des collations et même des fruits frais. Un bon opérateur comme Asili Climbing Kilimanjaro veille à ce que vous soyez bien nourri avec des repas équilibrés et énergisants chaque jour.",
    },
    {
      heading: '🙌 10. Vous ne grimperez pas seul — rencontrez les porteurs',
      body: "Chaque randonneur est soutenu par une équipe pouvant inclure des guides (certifiés et expérimentés), des porteurs (transportant votre équipement et installant le camp) et des cuisiniers (préparant les repas). Votre ascension n'est possible que grâce à ces héros locaux travailleurs. Les agences responsables s'associent avec le KPAP (Kilimanjaro Porters Assistance Project) pour garantir un traitement et des salaires équitables.",
    },
    {
      heading: '🧊 11. Les glaciers du Kilimandjaro disparaissent',
      body: "Le Kilimandjaro possédait autrefois d'immenses glaciers près du sommet. En raison du changement climatique, ces champs de glace rétrécissent rapidement — certains experts estiment qu'ils pourraient disparaître complètement d'ici quelques décennies. Les voir maintenant est véritablement une expérience unique dans une vie.",
    },
    {
      heading: "📸 12. Le panneau d'Uhuru Peak est emblématique",
      body: "Uhuru Peak (signifiant « Sommet de la liberté » en swahili) est le point le plus élevé du rebord du cratère de Kibo. Atteindre le panneau en bois vert et jaune est un moment de fierté et d'émotion pour chaque randonneur — et oui, vous voudrez certainement une photo ! Prêt à le vivre par vous-même ? Laissez Asili Climbing Kilimanjaro vous guider vers le sommet en toute sécurité et de manière responsable — avec une planification experte, une connaissance locale et des souvenirs inoubliables.",
    },
  ],
}

const typicalDayOnKilimanjaroFr: DetailArticleFr = {
  slug: 'typical-day-on-kilimanjaro',
  seoTitle: "Une journée type sur le Kilimandjaro | À quoi s'attendre au quotidien",
  seoDescription: "À quoi ressemble une journée type lors de l'ascension du Mont Kilimandjaro ? Du réveil à la nuit du sommet, voici le rythme quotidien de votre trek.",
  heroTitle: "Une journée type sur le Kilimandjaro : à quoi s'attendre au quotidien en gravissant la plus haute montagne d'Afrique",
  heroImage: {src: '/images/articles/typical-day-hero.webp', alt: 'Tentes dressées à Barafu Camp sur le Mont Kilimandjaro'},
  intro:
    "Gravir le Mont Kilimandjaro est une expérience inoubliable — mais elle est aussi structurée, sûre et étonnamment confortable lorsqu'elle est bien planifiée. Que vous soyez curieux de savoir comment se dérouleront vos journées, combien vous marcherez, ou quand vous vous reposerez, cette page vous donne un aperçu concret d'une journée type sur le Kilimandjaro avec Asili Climbing Kilimanjaro. Détaillons cela du lever au coucher du soleil — et au-delà.",
  sections: [
    {
      heading: '☀️ Les matins sur la montagne',
      body: "6 h-6 h 30 : réveil — Votre journée commence par un léger coup frappé à votre tente et un joyeux « bonjour » de votre équipe de camp. Ils vous apporteront un bol d'eau chaude pour vous rafraîchir et une boisson chaude (généralement thé, café ou chocolat chaud) pour réchauffer vos mains et votre esprit.\n7 h-7 h 30 : petit-déjeuner — faire le plein d'énergie est essentiel. Le petit-déjeuner est servi dans la tente-restaurant et comprend généralement du porridge ou des flocons d'avoine, des œufs (frits, brouillés ou durs), des toasts avec confiture, beurre de cacahuète ou miel, des fruits frais et du jus, ainsi que thé et café. À la fin de la semaine, le petit-déjeuner devient un moment fort de la journée !",
    },
    {
      heading: "🥾 L'heure du trek",
      body: "8 h : début de la randonnée du jour. Après le petit-déjeuner, vos guides donnent un bref briefing — détails de l'itinéraire, temps de marche estimé et prévisions météo. Puis c'est l'heure de prendre le sentier. La randonnée quotidienne varie selon l'itinéraire et l'altitude. Vous marcherez généralement 4 à 7 heures par jour, à un rythme lent et régulier (« Pole Pole » — swahili pour « doucement doucement »), avec des pauses fréquentes pour l'eau, les collations et les photos, toujours accompagné de votre guide. Les pauses de milieu de matinée incluent souvent des collations ou des fruits légers pour maintenir votre énergie.",
    },
    {
      heading: "🏕️ L'heure du déjeuner et le repos de midi",
      body: "Selon l'itinéraire et le terrain, le déjeuner peut être servi à un point de pique-nique désigné le long du sentier ou au prochain campement. Le déjeuner type comprend un ragoût de légumes ou des pâtes, du riz ou des pommes de terre, des avocats ou des salades, ainsi que du jus de fruits et du thé. Après le déjeuner et une courte pause, vous continuerez soit à marcher pendant quelques heures supplémentaires, soit à vous détendre au camp si le trek du jour est terminé.",
    },
    {
      heading: '🌄 Arrivée au camp',
      body: "Une fois arrivé à votre prochain campement, votre équipe de porteurs aura déjà installé votre tente, votre équipement de couchage et l'espace repas. Vous serez accueilli avec de l'eau chaude pour vous laver et des collations comme du popcorn ou des biscuits avec du thé ou du café chaud. C'est le moment de vous détendre : écrire dans votre journal, profiter des vues, discuter avec d'autres grimpeurs, vous reposer et vous hydrater.",
    },
    {
      heading: '🍽️ Dîner et briefing quotidien',
      body: "18 h-19 h : le dîner est servi. Le dîner est un repas copieux et chaud conçu pour reconstituer votre énergie. Attendez-vous à une soupe (toujours appréciée), un plat principal (riz, viande, légumes ou pâtes), un fruit en dessert, et une tisane au gingembre ou aux herbes pour faciliter la digestion et le sommeil. Vos guides effectueront également un bref briefing du soir pour expliquer ce qui vous attend, comment se passe votre acclimatation, et tout conseil sur l'équipement ou les vêtements pour le lendemain.",
    },
    {
      heading: '🌙 Dormir sous les étoiles',
      body: "20 h-21 h : extinction des feux. Avec peu ou pas de pollution lumineuse, le ciel nocturne du Kilimandjaro est à couper le souffle. La plupart des grimpeurs se couchent tôt. Votre sac de couchage vous garde au chaud — même en haute altitude. Les nuits sont calmes, froides et paisibles. Certaines nuits peuvent être interrompues par le vent ou un besoin naturel, mais la plupart des randonneurs dorment profondément grâce à une journée complète de marche.",
    },
    {
      heading: '⛰️ La nuit du sommet : l\'exception',
      body: "Le seul jour qui rompt la routine est la nuit du sommet. Vous vous réveillerez vers 23 h ou minuit, vous habillerez de couches chaudes, et entamerez la poussée finale vers le sommet au clair de lune. C'est une ascension lente et exigeante — mais atteindre Uhuru Peak au lever du soleil rend tout cela gratifiant. Après le sommet, vous redescendrez au camp de base pour vous reposer, puis continuerez à redescendre la montagne le lendemain.",
    },
    {
      heading: '🔄 Résumé du rythme quotidien',
      table: {
        columns: ['Heure', 'Activité'],
        rows: [
          ['6 h', 'Réveil + boissons chaudes'],
          ['7 h', 'Petit-déjeuner'],
          ['8 h', 'Début du trek'],
          ['12 h 30-13 h 30', 'Déjeuner et repos'],
          ['15 h-16 h', 'Arrivée au prochain campement'],
          ['16 h 30', 'Thé et collations'],
          ['18 h', 'Dîner et briefing du guide'],
          ['20 h-21 h', 'Sommeil'],
        ],
      },
    },
    {
      heading: '💬 Réflexions finales',
      body: "Gravir le Kilimandjaro est un voyage de rythme, de simplicité et de nature. Chaque jour suit un déroulement prévisible et bienveillant — avec beaucoup de repos, une nourriture nutritive, un accompagnement expert et du temps pour apprécier la montagne. Avec Asili Climbing Kilimanjaro, vous ne marchez pas seulement vers un sommet — vous embrassez un mode de vie, ne serait-ce que pour quelques jours. Et à la fin, vous ne vous sentirez pas seulement accompli — vous vous sentirez transformé.",
    },
  ],
}

const kilimanjaroFullmoonClimbFr: DetailArticleFr = {
  slug: 'kilimanjaro-fullmoon-climb',
  seoTitle: 'Ascension du Kilimandjaro à la pleine lune | Une expérience de sommet magique',
  seoDescription: 'Atteignez le sommet du Mont Kilimandjaro sous la pleine lune. Découvrez les meilleurs itinéraires, le timing et les conseils de préparation pour une ascension magique à la pleine lune.',
  heroTitle: 'Ascension du Kilimandjaro à la pleine lune : une expérience de sommet magique',
  heroImage: {src: '/images/articles/fullmoon-hero.jpg', alt: 'Tentes illuminées dans un campement du Kilimandjaro la nuit'},
  intro:
    "Gravir le Mont Kilimandjaro est déjà une aventure unique dans une vie — mais le faire sous la lumière de la pleine lune ? C'est une expérience d'un tout autre niveau. L'ascension du Kilimandjaro à la pleine lune offre aux randonneurs une occasion rare et inoubliable d'atteindre le plus haut sommet d'Afrique avec la lueur de la lune éclairant le chemin. Chez Asili Climbing Kilimanjaro, nous proposons des ascensions soigneusement planifiées à la pleine lune pour ceux qui souhaitent rendre leur aventure encore plus spéciale — et un peu plus magique.",
  sections: [
    {
      heading: '🌙 Pourquoi gravir le Kilimandjaro pendant la pleine lune ?',
      body: "Une ascension à la pleine lune ne concerne pas seulement la vue. Il s'agit de la façon dont le clair de lune transforme l'expérience — en particulier lors de votre dernière nuit de sommet. Voici ce qui la rend spéciale : Illumination naturelle — le sommet enneigé scintille au clair de lune, réduisant le besoin de lampes frontales lors de l'ascension finale. Visibilité accrue — vous pouvez voir clairement votre environnement même à minuit, créant une atmosphère surréaliste, presque onirique. Vues à couper le souffle — vous observerez le paysage du Kilimandjaro baigné d'une douce lumière argentée, quelque chose que très peu de gens ont la chance de voir. Lever de soleil au sommet spectaculaire — atteindre Uhuru Peak juste au moment où le soleil se lève sur un ciel éclairé par la lune est un souvenir que vous garderez toute votre vie.",
    },
    {
      heading: '📆 Quelle est la meilleure période pour une ascension à la pleine lune ?',
      body: "La pleine lune survient une fois par mois, et le meilleur moment pour aligner votre trek est d'atteindre le sommet la nuit de la pleine lune ou un jour avant ou après. Cela vous offre une exposition maximale au clair de lune lors de la partie la plus importante de votre voyage — la nuit du sommet. Prochaines dates de pleine lune (pour 2026) : 13 janvier, 12 février, 14 mars, 12 avril, 11 mai (les dates changent chaque année — veuillez nous contacter pour les calendriers actuels d'ascension à la pleine lune). Pour atteindre le sommet une nuit de pleine lune, vous devrez commencer votre ascension 6 à 8 jours avant la pleine lune, selon l'itinéraire choisi.",
    },
    {
      heading: '🥾 Meilleurs itinéraires pour une ascension à la pleine lune',
      body: "Tous les principaux itinéraires du Kilimandjaro peuvent être planifiés autour de la pleine lune, mais certains sont mieux adaptés à ce type d'expérience. Itinéraires recommandés : Route Machame (7 jours) — l'un des itinéraires les plus pittoresques et populaires avec une excellente acclimatation. Route Lemosho (8 jours) — offre une approche plus calme et des vues panoramiques. Route Rongai (7 jours) — idéale pour ceux recherchant un chemin moins fréquenté et un sommet à la pleine lune depuis le nord. Chacune de ces options vous offre le bon rythme et la flexibilité nécessaires pour vous aligner avec la pleine lune tout en maintenant une ascension sûre et agréable.",
    },
    {
      heading: '💡 Une ascension à la pleine lune est-elle faite pour vous ?',
      body: "Une ascension à la pleine lune est parfaite pour les photographes et conteurs visuels, les aventuriers romantiques (idéal pour les couples !), ceux recherchant un voyage spirituel ou symbolique, et quiconque souhaite élever son expérience du Kilimandjaro — littéralement et émotionnellement. Cela dit, les ascensions à la pleine lune peuvent aussi être plus populaires, notamment pendant les mois secs comme juillet à octobre et janvier à mars. Il est vivement recommandé de réserver tôt.",
    },
    {
      heading: '🎒 Comment se préparer pour un trek à la pleine lune',
      body: "Hormis le bon timing de votre ascension, il n'y a pas de différences majeures dans la préparation. Cependant, nous recommandons de porter des couches (même avec le clair de lune, la nuit du sommet est froide !), d'apporter une lampe frontale (vous en aurez peut-être moins besoin, mais elle reste essentielle pour la sécurité), et de réserver tôt (les permis limités et les places de campement partent vite pour les dates de pleine lune). Chez Asili Climbing Kilimanjaro, nous vous aiderons à planifier l'itinéraire parfait pour correspondre au cycle lunaire, sans précipiter votre acclimatation ni compromettre la sécurité.",
    },
    {
      heading: '🌍 Une connexion plus profonde avec la montagne',
      body: "Il y a quelque chose de profondément humble à se tenir sur le Kilimandjaro en pleine nuit, éclairé seulement par la lune et les étoiles, alors que l'horizon commence à s'illuminer des premières lueurs de l'aube. C'est calme. C'est puissant. C'est quelque chose que les mots ne peuvent pleinement capturer — mais que votre cœur n'oubliera jamais.",
    },
    {
      heading: '🚀 Prêt pour l\'ascension au clair de lune de votre vie ?',
      body: "Laissez-nous vous aider à concrétiser cela. Que vous voyagiez seul, en couple ou en groupe, nos ascensions du Kilimandjaro à la pleine lune sont conçues pour une expérience unique dans une vie — avec des guides expérimentés, un accompagnement personnalisé et un profond respect pour la montagne. Contactez-nous dès aujourd'hui pour réserver votre place lors de la prochaine ascension à la pleine lune avec Asili Climbing Kilimanjaro.",
    },
  ],
}

const kilimanjaroAltitudeSicknessFr: DetailArticleFr = {
  slug: 'kilimanjaro-altitude-sickness',
  seoTitle: 'Mal des montagnes au Kilimandjaro | Ce que vous devez savoir avant de grimper',
  seoDescription: 'Comprenez le mal aigu des montagnes (MAM) sur le Kilimandjaro : symptômes, niveaux de gravité, prévention, et comment Asili Climbing Kilimanjaro assure votre sécurité.',
  heroTitle: 'Mal des montagnes au Kilimandjaro : ce que vous devez savoir avant de grimper',
  heroImage: {src: '/images/articles/altitude-sickness-hero.jpg', alt: 'Grimpeur épuisé se reposant sur des rochers à côté d\'un sac à dos'},
  intro:
    "Gravir le Mont Kilimandjaro est une aventure inoubliable — mais c'est aussi un défi en haute altitude. L'une des choses les plus importantes à comprendre avant de commencer votre trek est le mal des montagnes, également connu sous le nom de mal aigu des montagnes (MAM). Chez Asili Climbing Kilimanjaro, votre sécurité est notre priorité absolue. Cela signifie éduquer les grimpeurs sur les risques de l'altitude et sur la façon de se préparer mentalement et physiquement pour le voyage vers le sommet.",
  sections: [
    {
      heading: '🌬️ Qu\'est-ce que le mal des montagnes ?',
      body: "Le mal des montagnes survient lorsque votre corps ne s'adapte pas bien aux niveaux d'oxygène plus faibles en haute altitude. Le Kilimandjaro culmine à 5 895 mètres (19 341 pieds) — et la plupart des gens ressentent les effets de l'altitude au-dessus de 2 500 mètres. Lorsque vous montez trop vite, votre corps a du mal à s'adapter. Le résultat peut aller de maux de tête légers à des complications graves si ignoré.",
    },
    {
      heading: '🚦 Trois niveaux de mal des montagnes',
      body: "🟢 MAM léger — maux de tête, fatigue, nausées, perte d'appétit, difficultés à dormir. Courant et gérable ; la plupart des grimpeurs en ressentent une certaine mesure.\n🟠 MAM modéré — maux de tête sévères, vertiges, vomissements, essoufflement au repos. Nécessite une attention médicale et souvent une descente.\n🔴 MAM sévère (HAPE/HACE) — Œdème pulmonaire de haute altitude (liquide dans les poumons), œdème cérébral de haute altitude (gonflement du cerveau), confusion, incapacité à marcher, lèvres/bouts des doigts bleus, fatigue extrême. Il s'agit d'une urgence médicale nécessitant une descente immédiate et des soins professionnels.",
    },
    {
      heading: '⏳ Quand cela commence-t-il ?',
      body: "Les symptômes apparaissent généralement dans les 6 à 24 heures suivant l'arrivée à une altitude plus élevée. C'est pourquoi une acclimatation progressive est essentielle. Des ascensions plus lentes signifient moins de symptômes et des taux de réussite au sommet plus élevés.",
    },
    {
      heading: '✅ Comment nous vous aidons à prévenir le mal des montagnes',
      body: "Votre santé est notre priorité absolue. Nos guides sont formés à la réponse en haute altitude et effectuent une surveillance quotidienne de la santé à l'aide d'oxymètres de pouls, de bouteilles d'oxygène d'urgence et de trousses de premiers secours, de civières portables pour l'évacuation d'urgence, et de plans d'évacuation en place avec le soutien des secours locaux. Vous serez également informé quotidiennement de votre état, et nous ajusterons le rythme ou l'itinéraire si nécessaire.",
    },
    {
      heading: '🥾 Comment l\'altitude affecte vos chances d\'atteindre le sommet',
      body: "Le mal des montagnes est la raison n°1 pour laquelle les grimpeurs n'atteignent pas le sommet — pas la condition physique, pas l'équipement. C'est pourquoi choisir le bon itinéraire et une agence de guides réputée est essentiel à votre réussite. Avec une bonne préparation, de la sensibilisation et du soutien, vous pouvez atteindre Uhuru Peak en toute sécurité et profiter des vues à couper le souffle depuis le Toit de l'Afrique.",
    },
    {
      heading: '🌄 Réflexion finale : ne craignez pas l\'altitude — respectez-la',
      body: "Le mal des montagnes n'est pas quelque chose à craindre — mais c'est quelque chose à anticiper. Avec Asili Climbing Kilimanjaro, vous êtes entre de bonnes mains. Nous ne vous guidons pas seulement vers le sommet — nous vous aidons à y arriver en toute sécurité. Vous avez d'autres questions sur l'acclimatation, les niveaux d'oxygène ou les options d'itinéraires ? Nous sommes là pour vous aider à planifier une ascension sûre, réussie et transformatrice.",
    },
  ],
}

const kilimanjaroFoodFr: DetailArticleFr = {
  slug: 'kilimanjaro-food',
  seoTitle: 'Nourriture sur le Kilimandjaro | Ce que vous mangerez sur la montagne',
  seoDescription: "Quelle nourriture mangerez-vous en gravissant le Kilimandjaro ? Repas, options alimentaires, sécurité de l'eau et collations — tout sur la nourriture sur la montagne.",
  heroTitle: 'Nourriture sur le Kilimandjaro : ce que vous mangerez sur la montagne',
  heroImage: {src: '/images/articles/food-hero.webp', alt: 'Repas de camp de montagne composé de nouilles, œufs et salade de légumes'},
  intro:
    "Gravir le Mont Kilimandjaro est un défi physique et mental — mais avec le bon carburant, votre corps peut s'épanouir en altitude. L'une des questions les plus fréquentes des randonneurs est : « Quel genre de nourriture vais-je manger sur le Kilimandjaro ? » Chez Asili Climbing Kilimanjaro, nous pensons qu'une bonne nourriture est plus qu'une nécessité — elle fait partie de l'expérience. Des fruits frais au petit-déjeuner aux soupes chaudes le soir, chaque repas est soigneusement préparé pour vous garder énergique, satisfait et en bonne santé tout au long de votre ascension.",
  sections: [
    {
      heading: '🧑‍🍳 Des repas fraîchement cuisinés sur la montagne',
      body: "Chaque trek avec Asili inclut un chef de montagne dédié et une équipe qui préparent quotidiennement des repas chauds et copieux dans une cuisine portable. Nous transportons des ingrédients frais et cuisinons à partir de zéro — pas de sachets lyophilisés ni de surprises en conserve ici. Vous serez surpris de voir à quel point les repas de montagne peuvent être délicieux, même à 4 000 mètres !",
    },
    {
      heading: '🍳 Ce à quoi vous pouvez vous attendre',
      body: "Nous privilégions des aliments riches en énergie, nutritifs et faciles à digérer qui vous aident à faire face à l'altitude et au froid.\n🌅 Petit-déjeuner : porridge (maïs, millet, avoine), œufs (durs, frits ou en omelette), toasts avec confiture, beurre de cacahuète ou miel, crêpes ou chapati, fruits frais (bananes, oranges, mangue), boissons chaudes (thé, café, chocolat chaud).\n🥪 Déjeuner : selon le programme du jour, soit un panier-repas (sandwichs ou poulet grillé, œufs durs, fruits, biscuits ou barres énergétiques, jus ou thé), soit un repas chaud les jours de trek plus courts (pâtes avec légumes ou sauce à la viande, riz avec haricots ou poulet, légumes mijotés).\n🍲 Dîner : servi dans une tente-restaurant à l'ambiance chaleureuse — soupe (légumes, poireaux, carottes ou potiron), riz, pâtes ou pommes de terre, viande grillée ou mijotée (poulet ou bœuf), légumes cuits (chou, épinards, carottes), chapati ou petits pains, fruits frais en dessert, tisane ou chocolat chaud.",
    },
    {
      heading: '🥗 Régimes spéciaux ? Pas de problème.',
      body: "Que vous soyez végétarien, végan, sans gluten, ou que vous ayez des allergies alimentaires spécifiques, nous pouvons répondre à vos besoins alimentaires. Il suffit de nous prévenir à l'avance, et nos chefs planifieront en conséquence. Tous les repas sont préparés hygiéniquement et servis avec des ustensiles propres et de l'eau filtrée.",
    },
    {
      heading: "💧 Qu'en est-il de l'eau potable ?",
      body: "Nous fournissons de l'eau potable sûre et traitée tout au long de votre trek. L'eau est collectée dans les ruisseaux voisins et bouillie, filtrée ou traitée chimiquement pour votre sécurité. Vous devriez apporter des bouteilles d'eau réutilisables ou une poche à eau à remplir quotidiennement.",
    },
    {
      heading: '🧂 Sécurité alimentaire et hygiène',
      body: "En haute altitude, votre système immunitaire s'affaiblit légèrement, donc la sécurité alimentaire est essentielle. Notre équipe suit des protocoles d'hygiène stricts, notamment le lavage minutieux des mains et de l'équipement, la préparation des repas dans une tente-cuisine propre dédiée, la garantie que les ingrédients sont frais et stockés en toute sécurité, et l'évitement de la contamination croisée.",
    },
    {
      heading: '🍫 Collations : apportez vos préférées',
      body: "Bien que nous fournissions trois repas complets par jour, vous pourriez vouloir apporter vos propres collations pour de l'énergie supplémentaire entre les repas : barres énergétiques ou protéinées, fruits secs, mélange de randonnée ou noix, comprimés ou poudres d'électrolytes, bonbons durs ou chocolat pour des apports rapides en sucre. Conseil : l'altitude peut réduire votre appétit, alors apportez des collations que vous aimez vraiment — même si elles semblent basiques au niveau de la mer.",
    },
    {
      heading: '🧘 Comment la nourriture aide face à l\'altitude',
      body: "Gravir le Kilimandjaro nécessite plus que de l'endurance — cela nécessite une nutrition adéquate. Des repas riches en glucides et pauvres en graisses aident votre corps à s'adapter aux niveaux d'oxygène plus faibles. Les soupes et thés chauds aident également à rester hydraté et à combattre les symptômes liés à l'altitude comme les maux de tête ou les nausées.",
    },
    {
      heading: '🏔️ Se nourrir pour atteindre le sommet',
      body: "Vous poussez votre corps chaque jour sur le Kilimandjaro, et ce que vous mangez affecte directement votre performance, votre humeur et votre réussite. Chez Asili Climbing Kilimanjaro, nous prenons la nourriture au sérieux — car votre sommet en dépend. Prêt à grimper bien nourri et sans souci ? Contactez-nous pour en savoir plus sur nos plans de repas ou pour parler à d'anciens grimpeurs qui ont dîné avec nous sur le Toit de l'Afrique.",
    },
  ],
}

const kilimanjaroPortersFr: DetailArticleFr = {
  slug: 'kilimanjaro-porters',
  seoTitle: 'Porteurs du Kilimandjaro | Le cœur battant de chaque ascension réussie',
  seoDescription: 'Rencontrez les porteurs du Kilimandjaro qui rendent chaque ascension possible. Découvrez le traitement éthique, le KPAP, les conseils sur les pourboires et comment montrer votre reconnaissance.',
  heroTitle: 'Porteurs du Kilimandjaro : le cœur battant de chaque ascension réussie',
  heroImage: {src: '/images/articles/porters-hero.webp', alt: 'Un porteur transportant du matériel sur le sentier du Kilimandjaro'},
  intro:
    "Quand on pense à gravir le Mont Kilimandjaro, il est naturel d'imaginer le sommet, le défi et les vues à couper le souffle. Mais derrière chaque trek réussi se trouve une équipe de personnes dévouées et travailleuses qui rendent le voyage possible : les porteurs du Kilimandjaro. Chez Asili Climbing Kilimanjaro, nous honorons et respectons le rôle vital que jouent les porteurs — non seulement comme aides, mais comme héros de la montagne.",
  sections: [
    {
      heading: '👣 Qui sont les porteurs du Kilimandjaro ?',
      body: "Les porteurs sont des hommes et des femmes tanzaniens locaux qui transportent l'équipement, la nourriture, l'eau et les fournitures nécessaires à votre trek. Ils montent et démontent le camp, aident à la logistique, et prêtent souvent main-forte lorsque vous avez besoin d'encouragement ou d'assistance sur le sentier. Sans eux, les ascensions du Kilimandjaro — pour la plupart des gens — seraient presque impossibles.",
    },
    {
      heading: '🧭 Que font les porteurs sur la montagne ?',
      body: "🏕️ Transportent l'équipement : tentes, sacs de couchage, fournitures de cuisine, votre sac de voyage (jusqu'à 15 kg).\n🧑‍🍳 Soutiennent l'équipe : aident les chefs, servent les repas, vont chercher l'eau, et installent les tentes-restaurants.\n🛖 Installent et démontent le camp : arrivant parfois au camp des heures avant vous.\n🧤 Assistent les grimpeurs : aidant parfois les grimpeurs fatigués ou en difficulté.\nIls font souvent tout cela avec le sourire, même après de longues heures sur un terrain raide et accidenté.",
    },
    {
      heading: '🎒 Combien les porteurs du Kilimandjaro transportent-ils ?',
      body: "Les porteurs sont limités par les règlements du parc national du Kilimandjaro et le KPAP (Kilimanjaro Porters Assistance Project) à transporter au maximum 20 kg — cela inclut leurs effets personnels. Cependant, tous les opérateurs ne font pas respecter cela équitablement. C'est pourquoi il est crucial de grimper avec un opérateur participant au KPAP comme Asili Climbing Kilimanjaro, qui s'engage envers un traitement équitable et le bien-être des porteurs.",
    },
    {
      heading: '🤝 Traitement éthique des porteurs : ce que cela signifie',
      body: "Un trekking éthique signifie que les porteurs sont payés équitablement (à temps et de manière transparente), reçoivent des repas adéquats sur la montagne, disposent d'un abri adéquat et d'équipement chaud, sont limités aux charges légales, sont inclus dans les cérémonies de pourboires, et sont respectés en tant que membres à part entière de l'équipe. Chez Asili, ce n'est pas une simple case à cocher — c'est ainsi que nous menons chaque ascension.",
    },
    {
      heading: '📣 Pourquoi cela compte pour vous en tant que randonneur',
      body: "Quand vous choisissez une entreprise qui traite bien ses porteurs, vous grimpez de manière responsable. Vous soutenez les moyens de subsistance locaux, améliorez les conditions de travail et contribuez à transformer le tourisme en une force positive en Tanzanie. Vous vivez également un meilleur trek. Une équipe de porteurs bien soutenue est motivée, fiable et fière de son rôle dans votre réussite.",
    },
    {
      heading: '💡 Combien de porteurs sont nécessaires par grimpeur ?',
      body: "Un trek moyen sur le Kilimandjaro nécessite 3 à 4 porteurs par grimpeur, selon la longueur de l'itinéraire et la taille du groupe, plus des membres d'équipe supplémentaires comme guides, cuisiniers et guides assistants. Chez Asili, nous ne faisons jamais d'économies en sous-dotant nos ascensions en personnel. Chaque membre de l'équipe joue un rôle pour assurer votre confort et votre sécurité.",
    },
    {
      heading: '🎖️ Kilimanjaro Porters Assistance Project (KPAP)',
      body: "Nous collaborons fièrement avec le KPAP pour respecter et dépasser les normes les plus élevées en matière de bien-être des porteurs. Le KPAP est une organisation à but non lucratif qui surveille les conditions des porteurs et tient les entreprises responsables d'un traitement éthique. Nous encourageons tous les randonneurs à demander si leur opérateur est certifié KPAP — c'est la référence absolue sur le Kilimandjaro.",
    },
    {
      heading: '💰 Pourboires aux porteurs : un signe de gratitude',
      body: "Le pourboire est un moyen courant et significatif de montrer sa reconnaissance. Bien qu'il ne soit pas obligatoire, il est attendu et grandement apprécié. Notre équipe fournit des directives transparentes sur les pourboires équitables, et nous veillons à ce que les pourboires soient distribués directement à chaque membre de l'équipe de manière publique et respectueuse.",
      table: {columns: ['Rôle', 'Pourboire type (par grimpeur, trek de 7 jours)'], rows: [['Porteurs', '6-10 $/jour'], ['Cuisinier', '10-15 $/jour'], ['Guide', '20-25 $/jour']]},
    },
    {
      heading: '🧍 Les histoires derrière les sourires',
      body: "De nombreux porteurs sur le Kilimandjaro sont des étudiants, agriculteurs ou leaders communautaires gagnant un revenu pour subvenir aux besoins de leur famille. Certains deviennent cuisiniers ou guides — et nous accompagnons fièrement ceux qui rêvent de gravir les échelons. Chez Asili, nous connaissons leurs noms, leurs histoires et leurs ambitions — et nous traitons chaque membre de l'équipe avec respect. « Ils ne portent pas seulement de l'équipement — ils portent des rêves, et vous aident à atteindre les vôtres. » — Joseph, guide principal chez Asili Climbing Kilimanjaro",
    },
    {
      heading: '📷 Comment montrer votre reconnaissance',
      body: "Apprenez les noms de vos porteurs, renseignez-vous sur leur vie et partagez un sourire, participez à la cérémonie finale des pourboires, prenez et partagez des photos avec leur permission, et laissez un avis mentionnant votre expérience positive.",
    },
    {
      heading: '🚶 Grimpez avec respect. Grimpez avec cœur.',
      body: "Chez Asili Climbing Kilimanjaro, nous pensons que les porteurs méritent plus que des applaudissements — ils méritent la dignité. En grimpant avec nous, vous contribuez à établir une norme plus élevée pour le tourisme de montagne, où les gens sont valorisés autant que le sommet. Vous voulez en savoir plus sur nos politiques envers les porteurs ou rencontrer l'équipe qui rend tout cela possible ? Contactez Asili Climbing Kilimanjaro ou commencez à planifier votre trek éthique dès aujourd'hui.",
    },
  ],
}

const kilimanjaroPackingListFr: DetailArticleFr = {
  slug: 'kilimanjaro-packing-list',
  seoTitle: "Liste d'équipement pour le Mont Kilimandjaro | Guide de matériel et vêtements",
  seoDescription: "La liste complète d'équipement pour le Mont Kilimandjaro : couches vestimentaires, chaussures, matériel de couchage, essentiels du sac de jour, et ce que votre opérateur fournit.",
  heroTitle: "Liste complète d'équipement pour le Mont Kilimandjaro",
  heroImage: {src: '/images/articles/packing-hero.webp', alt: 'Équipement de trek et d\'escalade disposé sur un plancher en bois'},
  intro:
    "Gravir le Mont Kilimandjaro n'est pas des vacances ordinaires. À 5 895 mètres (19 341 pieds), cela exige à la fois une résistance mentale et le bon équipement. La bonne nouvelle ? Vous n'avez pas besoin de dépenser une fortune — mais vous devez emballer intelligemment. Ce guide couvre tout ce que vous devez apporter pour une ascension sûre, confortable et réussie. Que vous rejoigniez un trek guidé ou grimpiez avec une équipe privée, cette liste est conçue pour la clarté, le confort et la préparation au froid.",
  sections: [
    {
      heading: '🎒 Liste des essentiels : ce que vous devez absolument apporter',
      body: "Voici les indispensables absolus — équipement et vêtements que vous utiliserez chaque jour.\n🧥 Couches vestimentaires : le Kilimandjaro compte cinq zones écologiques, et les températures varient énormément. Pensez : système de superposition. Couches de base (sous-vêtements thermiques) — 2-3 ensembles (haut et bas), évacuant l'humidité. Couches intermédiaires — polaires ou vestes softshell. Veste isolante — duvet ou synthétique pour la nuit du sommet. Couche externe — veste et pantalon imperméables et coupe-vent (Gore-Tex préféré). Pantalons de randonnée — 2 paires, séchage rapide. T-shirts — 3-4 respirants, évacuant l'humidité. Bonnet chaud — couvrant les oreilles. Chapeau ou casquette de soleil — pour les altitudes plus basses. Gants — gants légers fins + gants imperméables isolants. Buff ou tour de cou — pour le vent, la poussière et la chaleur.",
      image: {src: '/images/articles/packing-gear.jpg', alt: 'Diagramme légendé de l\'équipement de trek du Kilimandjaro, incluant vêtements, chaussures et accessoires'},
    },
    {
      heading: '👟 Chaussures',
      body: "Vous marcherez 6 à 8 heures par jour, donc le confort est essentiel. Chaussures de randonnée — imperméables, déjà rodées, avec support de cheville. Chaussures de camp — Crocs ou chaussures de trail pour les soirées. Chaussettes en laine ou synthétiques — 4-6 paires. Guêtres — optionnelles, mais utiles dans les zones boueuses/enneigées.",
      image: {src: '/images/articles/packing-boot.jpg', alt: 'Chaussure de randonnée imperméable'},
    },
    {
      heading: '🛏️ Matériel de couchage',
      body: "La plupart des circuits incluent tentes et matelas, mais confirmez ce qui est fourni. Sac de couchage — adapté à au moins -10°C ou moins. Drap de sac de couchage — ajoute de la chaleur et garde le sac propre. Oreiller de voyage ou oreiller gonflable.",
      image: {src: '/images/articles/packing-sleeping-bag.jpg', alt: 'Sac de couchage et drap déroulés'},
    },
    {
      heading: '🎒 Essentiels du sac de jour',
      body: "Vous porterez votre propre sac de jour avec les articles nécessaires entre les camps : sac de jour de 30-40 L avec bretelles rembourrées et ceinture ventrale. Système d'hydratation — 2-3 L (CamelBak ou bouteilles d'eau). Collations — mélange de randonnée, barres énergétiques, fruits secs. Lunettes de soleil — anti-UV, catégorie glacier préférée. Crème solaire et baume à lèvres — SPF 30+. Lampe frontale — avec piles de rechange (pour la nuit du sommet). Appareil photo ou smartphone — optionnel, pour les photos. Carnet et stylo — optionnel, pour tenir un journal.",
    },
    {
      heading: '🧼 Hygiène personnelle et santé',
      body: "Restez frais (ou aussi frais que possible) avec cette trousse d'hygiène minimaliste : articles de toilette (savon biodégradable, brosse à dents, dentifrice, déodorant), lingettes humides (votre meilleure amie sur la montagne), gel hydroalcoolique (essentiel avant les repas), serviette à séchage rapide (taille moyenne), papier toilette (transportez un rouleau dans un sac Ziploc), trousse de premiers secours basique (traitement des ampoules, antidouleurs, antidiarrhéiques), médicament contre l'altitude (Diamox — consultez votre médecin), médicaments personnels (incluant des comprimés antipaludiques si nécessaire), bouchons d'oreilles (pour les compagnons de tente qui ronflent).",
    },
    {
      heading: '📦 Extras optionnels mais utiles',
      body: "Ces éléments ne sont pas obligatoires mais peuvent faire une grande différence en termes de confort : batterie externe (solaire ou préchargée), bâtons de randonnée (vivement recommandés pour les genoux et l'équilibre), sacs de rangement/étanches (pour garder votre équipement organisé et sec), suppléments énergétiques (comprimés d'électrolytes ou sels d'hydratation), ruban adhésif (pour réparations rapides), livre ou liseuse (pour les moments de détente), sacs Ziploc (pour déchets, collations, appareils électroniques), bouteille ou entonnoir réutilisable pour uriner (commodité nocturne).",
    },
    {
      heading: "🧳 Ce qui est fourni par l'opérateur ?",
      body: "La plupart des entreprises réputées comme Asili Climbing Kilimanjaro incluent les tentes, matelas, tentes-restaurants et ustensiles, la nourriture, l'eau, le personnel de cuisine et les porteurs (qui transportent votre sac de voyage principal). Vous êtes généralement responsable de vos vêtements, sac de couchage, équipement personnel et sac de jour. De nombreux articles peuvent être loués à Moshi ou Arusha — renseignez-vous auprès de votre opérateur à l'avance.",
    },
  ],
}

const kilimanjaroClimbCostFr: DetailArticleFr = {
  slug: 'kilimanjaro-climb-cost',
  seoTitle: "Coût de l'ascension du Kilimandjaro | Ce que vous devez savoir",
  seoDescription: "Combien coûte l'ascension du Kilimandjaro ? Détail complet des coûts par itinéraire, taille de groupe, location de matériel, pourboires et ce qui est inclus.",
  heroTitle: "Coût de l'ascension du Kilimandjaro : ce que vous devez savoir",
  heroImage: {src: '/images/articles/cost-hero.webp', alt: 'Un grimpeur célébrant devant le panneau du sommet Uhuru Peak'},
  intro:
    "Gravir le Mont Kilimandjaro est une aventure qui change une vie, mais elle a un coût. Comprendre où va votre argent — et à quoi vous attendre — est essentiel pour planifier une ascension réussie et sûre. Le coût total peut varier considérablement selon l'itinéraire, le nombre de jours, le niveau de confort souhaité et l'agence choisie.",
  sections: [
    {
      heading: "💰 Combien coûte l'ascension du Kilimandjaro ?",
      body: 'En moyenne, le coût varie entre 1 700 $ et 6 000 $ par personne. Chaque itinéraire du Kilimandjaro a des besoins logistiques, des ratios de porteurs et des frais de parc différents selon le nombre de jours :',
      table: {
        columns: ['Itinéraire', 'Jours', 'Coût approx. (milieu de gamme)', 'Pourquoi le prix varie'],
        rows: [
          ['Marangu', '5-6', '1 800 $ - 2 500 $', 'Utilise des refuges, moins de porteurs'],
          ['Machame', '6-7', '2 000 $ - 3 000 $', 'Itinéraire pittoresque populaire'],
          ['Lemosho', '7-8', '2 300 $ - 3 500 $', 'Plus long, départ reculé'],
          ['Rongai', '6-7', '2 200 $ - 3 200 $', 'Moins fréquenté, approche par le nord'],
          ['Umbwe', '6', '2 100 $ - 3 100 $', 'Ascension raide et rapide'],
          ['Northern Circuit', '8-9', '2 800 $ - 4 200 $', 'Le plus long, taux de réussite le plus élevé'],
        ],
      },
    },
    {
      heading: '🧾 2. Détail des coûts ligne par ligne',
      body: 'Voici où va votre argent, pour une ascension milieu de gamme de 7 jours :',
      table: {
        columns: ['Catégorie de dépense', 'Coût estimé (USD)'],
        rows: [
          ['Frais de parc et permis', '800 $ - 1 100 $'],
          ["Salaires du guide et de l'équipe", '400 $ - 600 $'],
          ['Nourriture et fournitures de cuisine', '150 $ - 250 $'],
          ['Équipement (tentes, etc.)', '100 $ - 200 $'],
          ['Transferts (vers le point de départ)', '50 $ - 100 $'],
          ['Administration et soutien sécurité', '100 $ - 200 $'],
          ["Marge bénéficiaire de l'opérateur", '200 $ - 400 $'],
        ],
      },
    },
    {
      heading: "👥 3. Taille du groupe et coûts d'ascension privée",
      body: 'Ascension en groupe ouvert (6-12 personnes) : coût par personne plus faible. Ascension privée (solo ou groupe personnalisé) : généralement 300-800 $ de plus par personne. Ascensions de luxe (avec toilettes portables, repas améliorés, moins de grimpeurs) : peuvent atteindre 5 000-7 000 $.',
      image: {src: '/images/articles/cost-route.jpg', alt: 'Groupe de randonneurs marchant vers le Mont Kilimandjaro'},
    },
    {
      heading: "🏨 4. Hébergement avant et après l'ascension",
      body: 'La plupart des forfaits incluent 1 nuit avant l\'ascension et 1 nuit après, dans un hôtel 2-3 étoiles à Moshi ou Arusha (surclassable). Prévoyez environ 50-150 $ par nuit si vous réservez indépendamment.',
      image: {src: '/images/articles/cost-lodge.jpg', alt: 'Hébergement en lodge près du Kilimandjaro'},
    },
    {
      heading: '🎒 5. Location ou achat de matériel',
      body: 'Si vous ne possédez pas votre équipement, vous devrez le louer sur place :',
      table: {
        columns: ['Article', 'Coût de location (USD)'],
        rows: [
          ['Sac de couchage', '30 $ - 50 $'],
          ['Veste en duvet', '20 $ - 40 $'],
          ['Bâtons de randonnée', '10 $ - 15 $'],
          ['Guêtres', '10 $ - 15 $'],
          ['Lampe frontale', '10 $ - 20 $'],
        ],
      },
    },
    {
      heading: '💸 6. Conseils sur les pourboires',
      body: 'Les pourboires sont attendus et grandement appréciés. Le Kilimanjaro Porters Assistance Project (KPAP) recommande : guide — 20 $/jour, guide assistant — 15 $/jour, cuisinier — 12 $/jour, porteurs — 6-10 $/jour chacun. Total des pourboires par grimpeur (ascension de 7 jours) : 250-300 $ (selon la taille du groupe).',
      image: {src: '/images/articles/cost-tipping.jpg', alt: 'Un grimpeur et un guide sur le sentier du Kilimandjaro'},
    },
    {
      heading: "🚑 7. Coûts d'assurance",
      body: "L'assurance voyage est obligatoire pour la plupart des opérateurs. Attendez-vous à payer 80-150 $ pour une couverture de trekking en haute altitude (au-dessus de 5 000 m), l'évacuation d'urgence et l'annulation ou l'interruption de voyage.",
    },
    {
      heading: '🧭 8. Coût contre valeur : que payez-vous réellement ?',
      table: {
        columns: ['Opérateur le moins cher', 'Opérateur milieu de gamme', 'Opérateur premium'],
        rows: [
          ['1 500 $ - 1 900 $', '2 000 $ - 3 200 $', '4 000 $ - plus de 6 000 $'],
          ['Guides inexpérimentés', 'Guides certifiés et expérimentés', 'Guides certifiés Wilderness First Responder (WFR)'],
          ['Équipement de mauvaise qualité', 'Bonnes tentes, équipement de sécurité', 'Équipement haut de gamme + toilettes portables'],
          ['Pas d\'oxygène ni de contrôles de sécurité', 'Surveillance quotidienne de la santé', 'Oxygène de secours, équipe médicale privée'],
          ['Traitement non éthique des porteurs', 'Salaires équitables via l\'affiliation KPAP', 'Meilleur ratio porteurs/clients'],
        ],
      },
    },
    {
      heading: '🧾 Qu\'est-ce qui est inclus dans le coût ?',
      body: 'Les frais de parc (pouvant représenter jusqu\'à 50 % du coût total), l\'hébergement en camping/refuges, tous les repas sur la montagne, des guides de montagne professionnels, porteurs et cuisiniers, tentes, matelas et équipement de restauration, le transport aller-retour vers le point de départ, les frais de secours et permis.',
    },
    {
      heading: "🚫 Qu'est-ce qui n'est PAS inclus ?",
      body: 'Les vols internationaux ou domestiques, les frais de visa, l\'assurance voyage (obligatoire), les pourboires pour guides et porteurs, la location ou l\'achat de matériel, les séjours à l\'hôtel avant/après l\'ascension, les dépenses personnelles (collations, boissons, souvenirs).',
      image: {src: '/images/articles/cost-notincluded.jpg', alt: 'Un grimpeur sur le terrain rocheux du Mont Kilimandjaro'},
    },
    {
      heading: 'Remarque',
      body: "Gravir le Kilimandjaro est une aventure sérieuse, et le prix que vous payez doit refléter la qualité, la sécurité et l'expérience que vous attendez. Bien que vous n'ayez pas besoin de vous ruiner, évitez de faire des économies sur la montagne. Ce n'est pas juste une randonnée — c'est un voyage unique dans une vie.",
    },
  ],
}

const bestTimeToClimbKilimanjaroFr: DetailArticleFr = {
  slug: 'best-time-to-climb-kilimanjaro',
  seoTitle: 'La meilleure période pour gravir le Kilimandjaro | Guide saison par saison',
  seoDescription: "Quelle est la meilleure période pour gravir le Kilimandjaro ? Un détail mois par mois de la météo, de l'affluence et des conditions pour vous aider à choisir vos dates d'ascension.",
  heroTitle: '🕒 La meilleure période pour gravir le Kilimandjaro',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Éléphant broutant avec le Mont Kilimandjaro en arrière-plan'},
  intro:
    "Gravir le Mont Kilimandjaro est une aventure incroyable — et choisir quand y aller peut être tout aussi important que de choisir comment s'y rendre. Avec ses sommets imposants, ses conditions météorologiques changeantes et ses paysages spectaculaires, bien planifier le timing de votre trek peut faire la différence entre une ascension confortable et une ascension difficile. Alors, quelle est la meilleure période pour gravir le Mont Kilimandjaro ? Détaillons cela saison par saison, en nous basant sur une expérience réelle et des conseils d'experts.",
  sections: [
    {
      heading: 'Meilleurs mois pour gravir le Kilimandjaro',
      body: "Il existe deux saisons de trek idéales sur le Kilimandjaro.\n🗓️ Janvier à mi-mars — Météo : chaud, majoritairement sec, journées ensoleillées. Paysages : vues dégagées, surtout tôt le matin. Affluence : modérée, moins fréquentée qu'en haute saison. Points forts : excellente période pour la photographie avec des sommets enneigés. Cette période est excellente pour les grimpeurs souhaitant des températures douces et moins d'affluence, en particulier de janvier à début février. Cependant, mars marque le début des grandes pluies, donc il est préférable d'y aller avant mi-mars.\n🗓️ Juin à octobre (haute saison) — Météo : sèche et stable. Paysages : magnifiques, surtout avec des ciels éclatants au lever du soleil. Affluence : c'est la période la plus fréquentée sur la montagne. Points forts : excellentes conditions de sommet et visibilité des sentiers. C'est la période la plus populaire pour gravir le Kilimandjaro, en particulier pendant les vacances d'été européennes et nord-américaines. Les sentiers sont plus secs et les conditions plus fiables — soyez simplement prêt à les partager avec d'autres randonneurs.\n🌧️ Saisons à éviter (si possible)\n🗓️ Mi-mars à mai (grande saison des pluies) — de fortes pluies rendent les sentiers glissants et la visibilité mauvaise. Risque accru d'inconfort lié à l'altitude en raison des conditions froides/humides. Moins de randonneurs, ce que certains peuvent apprécier — mais cela a un coût. À moins d'être très expérimenté et bien préparé, ce n'est pas la période idéale pour grimper. Les campements peuvent devenir boueux, et les vues sont souvent voilées.\n🗓️ Novembre à début décembre (petite saison des pluies) — moins intense que les grandes pluies, mais toujours imprévisible. Moins de grimpeurs sur le sentier. Vous pourriez avoir quelques journées claires et fraîches — mais c'est un pari. Cette saison est meilleure que les grandes pluies mais reste peu recommandée à moins d'être à l'aise avec un temps occasionnellement humide.",
      image: {src: '/images/articles/besttime-uhuru.webp', alt: 'Panneau du sommet Uhuru Peak'},
    },
    {
      heading: '❄️ Qu\'en est-il de la neige sur le Kilimandjaro ?',
      body: "La neige est courante au sommet toute l'année, mais si vous espérez voir Uhuru Peak recouvert de neige, vos meilleures chances sont de janvier à mars et pendant ou juste après les saisons des pluies (avril ou début décembre). La neige ajoute de la magie au jour du sommet — mais elle ajoute aussi un défi, alors planifiez en conséquence.",
    },
    {
      heading: '📊 Aperçu de la météo du Kilimandjaro par mois',
      table: {
        columns: ['Mois', 'Saison', 'Conditions', 'Affluence'],
        rows: [
          ['Janvier', 'Sec (meilleur)', 'Ciel dégagé, températures douces', 'Moyenne'],
          ['Février', 'Sec (meilleur)', 'Chaud, excellente visibilité', 'Moyenne'],
          ['Mars', 'Transition', 'Pluie croissante', 'Faible'],
          ['Avril', 'Pluvieux (à éviter)', 'Humide, nuageux, glissant', 'Très faible'],
          ['Mai', 'Pluvieux (à éviter)', 'Mauvaises conditions de sentier', 'Très faible'],
          ['Juin', 'Sec (haute saison)', 'Matins frais, vues dégagées', 'Élevée'],
          ['Juillet', 'Sec (haute saison)', 'Nuits froides, journées ensoleillées', 'Très élevée'],
          ['Août', 'Sec (haute saison)', 'Excellente météo au sommet', 'Très élevée'],
          ['Septembre', 'Sec (haute saison)', 'Superbes vues, temps doux', 'Élevée'],
          ['Octobre', 'Transition', 'Un peu de pluie en fin de mois', 'Moyenne'],
          ['Novembre', 'Pluvieux (à éviter)', 'Petites pluies, imprévisible', 'Faible'],
          ['Décembre', 'Transition', 'Clair en début de mois, plus humide en fin', 'Moyenne'],
        ],
      },
    },
    {
      heading: '🏔️ Conseils d\'experts pour choisir la bonne période',
      body: "Évitez les vacances scolaires (juillet et août) si vous voulez moins d'affluence. Si cela doit être la saison des pluies, partez avec un opérateur expérimenté et prévoyez une protection météo supplémentaire. L'acclimatation est plus importante que le soleil — des itinéraires plus longs comme Lemosho et Northern Circuit offrent une meilleure adaptation à l'altitude, quelle que soit la saison. Les mois froids signifient de meilleures photos au sommet (moins de couverture nuageuse), mais les mois chauds signifient plus de confort sur le sentier.",
    },
  ],
}

const kilimanjaroSafarisFr: DetailArticleFr = {
  slug: 'kilimanjaro-safaris',
  seoTitle: 'Safaris au Kilimandjaro | Combinez le sommet et la savane',
  seoDescription: "Associez votre ascension du Kilimandjaro à un safari en Tanzanie. Explorez Tarangire, le lac Manyara, le cratère du Ngorongoro et le Serengeti après votre sommet.",
  heroTitle: '🐘 Safaris au Kilimandjaro : combinez le sommet et la savane',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Éléphant broutant avec le Mont Kilimandjaro en arrière-plan'},
  intro:
    "Votre aventure africaine ne se termine pas au sommet — elle commence là où rôdent les animaux sauvages. Gravir le Mont Kilimandjaro est un exploit incontournable, mais associer votre trek à un safari inoubliable en Tanzanie complète l'expérience. Après des jours de randonnée en haute altitude, imaginez échanger vos chaussures de randonnée contre des jumelles et les sentiers poussiéreux contre des plaines dorées — traquant lions, éléphants et gnous à travers les paysages les plus emblématiques d'Afrique de l'Est. Chez Asili Climbing Kilimanjaro, nous vous aidons à passer des sommets enneigés à la savane avec des expériences de safari fluides avant ou après le trek, adaptées à votre temps, budget et intérêts.",
  sections: [
    {
      heading: '🌍 Qu\'est-ce qu\'un safari Kilimandjaro ?',
      body: "Un safari Kilimandjaro fait généralement référence à un circuit faunique dans le nord de la Tanzanie, combiné à une ascension du Kilimandjaro. Comme la montagne est située près de certains des meilleurs parcs de faune d'Afrique, vous êtes déjà dans l'emplacement idéal pour les explorer. Que vous vouliez une escapade rapide de 2 jours ou un safari complet de 5 à 7 jours, les possibilités sont infinies — et épiques.",
    },
    {
      heading: '🏞️ Meilleurs parcs de safari près du Kilimandjaro',
      body: "1. Parc national de Tarangire — célèbre pour ses immenses troupeaux d'éléphants, ses baobabs, son ambiance hors des sentiers battus. Distance depuis Arusha : environ 2 heures. Idéal pour un début ou une fin détendue de votre aventure au Kilimandjaro.\n2. Parc national du lac Manyara — célèbre pour ses lions grimpeurs d'arbres, ses flamants roses, sa forêt d'eaux souterraines. Distance : environ 2,5 heures. Idéal pour des aperçus rapides de la faune, notamment en route vers la région du Ngorongoro.\n3. Cratère du Ngorongoro — célèbre pour observer les Big Five en une journée. Un site classé au patrimoine mondial de l'UNESCO et la plus grande caldeira intacte du monde. Idéal pour la concentration de faune et la photographie.\n4. Parc national du Serengeti — célèbre pour la Grande Migration, ses plaines infinies, lions et léopards. Une destination unique dans une vie. Idéal pour des safaris de 3 à 5 jours avec une immersion profonde dans la nature sauvage.",
      image: {src: '/images/articles/safaris-gallery1.webp', alt: 'Une lionne se reposant avec deux petits'},
    },
    {
      heading: '🗓️ Quand partir en safari après le Kilimandjaro',
      body: "Vous pouvez partir en safari toute l'année, mais les meilleures périodes pour observer la faune sont : juin à octobre (saison sèche) — les animaux se rassemblent aux points d'eau, et la végétation est plus clairsemée, idéal pour les observations. Décembre à mars — saison des naissances dans le sud du Serengeti, pleine d'action spectaculaire entre prédateurs et proies. Combinez votre safari avec une ascension du Kilimandjaro de juin à octobre pour l'association d'aventure ultime.",
    },
    {
      heading: '🦓 Ce que vous verrez en safari',
      body: "Selon les parcs et la saison, vous pourriez apercevoir les Big Five (lion, léopard, éléphant, buffle, rhinocéros), des guépards sprintant à travers les plaines, des girafes se déplaçant dans les bois d'acacias, des hippopotames se prélassant dans les berges des rivières, des flamants roses au lac Manyara ou Natron, et la Grande Migration des gnous et zèbres (le timing compte !).",
      image: {src: '/images/articles/safaris-gallery2.webp', alt: 'Un éléphant se tenant dans une prairie verte'},
    },
    {
      heading: '🛏️ Où vous logerez',
      body: "Que vous recherchiez le confort ou l'aventure, l'hébergement de safari se décline en styles adaptés à chaque voyageur : lodges de luxe avec vues sur les savanes et les rebords de cratères, camps de tentes milieu de gamme offrant confort et immersion, camps mobiles se déplaçant avec la Grande Migration, et options économiques pour routards ou voyageurs solos. Chez Asili, nous vous aidons à trouver le meilleur hébergement de safari selon votre style, la taille de votre groupe et votre budget.",
    },
    {
      heading: '💡 Pourquoi combiner un safari avec une ascension du Kilimandjaro ?',
      body: "Récupérez et détendez-vous : après l'intensité du trek, le safari laisse votre corps se reposer sans mettre fin à votre aventure. Maximisez votre voyage : vous avez déjà voyagé jusqu'en Tanzanie, prolongez votre séjour et rendez-le encore plus gratifiant. Découvrez la diversité de l'Afrique : des sommets enneigés aux plaines regorgeant de faune, c'est l'Afrique à son meilleur. Parfait pour les amis ou la famille qui vous rejoignent plus tard : certains membres de la famille peuvent ne pas grimper mais vous retrouver pour le safari.",
      table: {
        columns: ['Jour', 'Activité'],
        rows: [
          ['1-7', 'Gravir le Kilimandjaro (par ex., route Machame ou Lemosho)'],
          ['8', 'Transfert vers Tarangire pour le safari'],
          ['9', 'Safari au cratère du Ngorongoro'],
          ['10', 'Retour en voiture à Arusha ou départ en avion'],
        ],
      },
    },
    {
      heading: '💰 Combien coûte un safari Kilimandjaro ?',
      body: "Le prix du safari dépend de la durée, du type d'hébergement et des parcs visités : safari de 2-3 jours à partir de 600-1 200 $ par personne, safari de 4-5 jours 1 200-2 000 $ par personne, safaris de luxe à partir de 2 500 $ selon le choix des lodges et véhicules privés. Chez Asili Climbing Kilimanjaro, nous proposons des tarifs transparents sans frais cachés. Circuits en groupe, en famille et privés tous disponibles.",
    },
    {
      heading: 'Prêt à passer du sommet aux plaines ?',
      body: "Que vous gravissiez le Kilimandjaro seul, entre amis ou en famille, un safari est le chapitre parfait suivant. Laissez-nous vous aider à planifier le voyage de votre vie — à pied et sur quatre roues. Contactez Asili Climbing Kilimanjaro pour commencer à créer votre combiné montagne + safari dès aujourd'hui.",
    },
  ],
}

const soloKilimanjaroClimbFr: DetailArticleFr = {
  slug: 'solo-kilimanjaro-climb',
  seoTitle: 'Ascension du Kilimandjaro en solo | Votre voyage personnel vers le Toit de l\'Afrique',
  seoDescription: "Tout ce que vous devez savoir sur l'ascension solo du Kilimandjaro : est-ce sûr, treks en groupe ou privés, coûts, et conseils d'experts pour randonneurs indépendants.",
  heroTitle: 'Ascension du Kilimandjaro en solo',
  heroImage: {src: '/images/articles/solo-hero.jpg', alt: 'Un grimpeur solo observant le lever du soleil depuis le Kilimandjaro'},
  intro:
    "Si vous êtes un voyageur solo rêvant de vous tenir au sommet du plus haut sommet d'Afrique, gravir le Kilimandjaro seul est plus que possible — c'est une expérience incroyablement épanouissante. Chez Asili Climbing Kilimanjaro, nous sommes spécialisés dans l'accompagnement des aventuriers solos, offrant le soutien, la sécurité et la flexibilité nécessaires pour faire de ce voyage véritablement le vôtre. Voici tout ce que vous devez savoir sur l'ascension du Kilimandjaro en tant que voyageur solo.",
  sections: [
    {
      heading: 'Peut-on gravir le Kilimandjaro en solo ?',
      body: "Bien qu'il ne soit pas autorisé de gravir le Kilimandjaro complètement seul (un guide agréé est obligatoire), vous pouvez tout à fait réserver un trek privé solo ou rejoindre un groupe en tant que voyageur solo. Que vous préfériez une indépendance totale ou une expérience sociale avec d'autres randonneurs, il existe une option parfaite pour vous.",
    },
    {
      heading: 'Pourquoi de nombreux voyageurs choisissent de gravir le Kilimandjaro en solo',
      body: "L'ascension en solo ne consiste pas seulement à voyager seul — il s'agit de découvrir de quoi vous êtes capable, à votre propre rythme. Voici pourquoi de nombreux aventuriers partent en solo : un défi personnel pour repousser ses limites et grandir, une liberté et une flexibilité totales, du temps pour la réflexion personnelle et la clarté mentale, et un voyage marquant — pour un anniversaire, une pause de carrière ou une transition de vie.",
    },
    {
      heading: "Ascension en groupe ou trek privé — que choisir pour les voyageurs solos ?",
      body: "🟩 Rejoindre un trek de groupe : coût plus faible (logistique partagée), ambiance conviviale (rencontrer d'autres randonneurs), dates de départ fixes, idéal pour les débutants ou ceux recherchant la camaraderie.\n🟦 Ascension privée solo : horaires et rythme flexibles, accompagnement et attention individualisés, idéal pour les randonneurs expérimentés ou voyageurs indépendants, coût plus élevé mais entièrement personnalisé.\nAsili Climbing Kilimanjaro propose les deux options, sans pression et sans frais de supplément solo.",
    },
    {
      heading: '🏕️ À quoi ressemble une ascension en solo',
      body: "Même lors d'un trek solo, vous n'êtes jamais vraiment seul. Vous serez soutenu par une équipe complète incluant un guide de montagne certifié, un cuisinier et des porteurs. Vous marcherez à votre propre rythme, mangerez des repas chauds préparés juste pour vous, et dormirez dans une tente confortable chaque nuit. Les ascensions privées offrent une flexibilité et une intimité complètes. Les ascensions en groupe vous offrent soutien et encouragement partagé. Votre guide devient votre compagnon de confiance sur le sentier.",
      image: {src: '/images/articles/is-safe-hero.jpg', alt: 'Randonneurs gravissant le Kilimandjaro au lever du soleil'},
    },
    {
      heading: '🛡️ Est-il sûr de gravir le Kilimandjaro seul ?',
      body: "Oui — lorsque vous grimpez avec un opérateur réputé comme Asili Climbing Kilimanjaro, vous êtes entre de bonnes mains. Nous priorisons votre sécurité avec des guides de montagne certifiés et expérimentés, des contrôles de santé quotidiens et une surveillance de l'altitude, des plans d'oxygène d'urgence et d'évacuation, et des porteurs bien formés avec un soutien 24 h/24 et 7 j/7. De nombreuses voyageuses solos choisissent également Asili pour nos équipes fiables, respectueuses et professionnelles.",
    },
    {
      heading: '💰 Est-il plus coûteux de gravir le Kilimandjaro en solo ?',
      body: "Partir en solo sur une ascension privée coûte plus cher que rejoindre un groupe, car vous couvrez l'intégralité des coûts logistiques, des frais de parc et du personnel de soutien. Cependant, la valeur réside dans une expérience sur mesure.",
      table: {columns: ['Option', 'Fourchette de coût type'], rows: [['Ascension en groupe (6-8 jours)', '1 850 $ - 2 300 $'], ['Ascension privée solo (6-8 jours)', '2 500 $ - 3 400 $']]},
    },
    {
      heading: '🎒 Conseils d\'équipement solo pour le Kilimandjaro',
      body: "Apportez une batterie externe ou un chargeur solaire supplémentaire. Les objets de confort personnel (journal, livre, collations) peuvent remonter le moral. Faites vos bagages léger mais intelligent — consultez notre liste d'équipement pour le Kilimandjaro. Rodez vos chaussures à l'avance !",
    },
    {
      heading: '📅 Meilleure période pour gravir le Kilimandjaro en tant que voyageur solo',
      body: "Pour les randonneurs solos, le timing compte : les meilleures saisons sont janvier-mars et juin-octobre. Évitez avril-mai (fortes pluies) et novembre (petites pluies). Grimper en haute saison vous donne la possibilité de rencontrer d'autres personnes en chemin — même lors d'une ascension privée.",
    },
    {
      heading: '💡 Avis d\'expert',
      body: "Gravir le Kilimandjaro en solo est l'une des décisions les plus valorisantes que vous puissiez prendre. Avec le soutien d'une équipe locale expérimentée, vous bénéficiez de la liberté de voyager seul avec l'assurance d'être bien accompagné. Chez Asili Climbing Kilimanjaro, nous comprenons ce dont les aventuriers solos ont besoin : respect, flexibilité et une équipe dédiée qui rend votre voyage inoubliable — et sûr.",
    },
    {
      heading: '🌍 Prêt à commencer votre aventure solo ?',
      body: "Que vous souhaitiez la solitude d'un trek privé ou l'énergie d'un petit groupe, nous vous aiderons à planifier votre itinéraire, votre calendrier et votre rythme parfaits. Faisons de votre rêve du Kilimandjaro une réalité — rien que pour vous. Contactez Asili Climbing Kilimanjaro pour commencer à planifier votre sommet en solo.",
    },
  ],
}

async function run() {
  await seedDetailArticleFr(isClimbingKilimanjaroSafeFr)
  await seedDetailArticleFr(gettingToKilimanjaroFr)
  await seedDetailArticleFr(mountKilimanjaroFactsFr)
  await seedDetailArticleFr(typicalDayOnKilimanjaroFr)
  await seedDetailArticleFr(kilimanjaroFullmoonClimbFr)
  await seedDetailArticleFr(kilimanjaroAltitudeSicknessFr)
  await seedDetailArticleFr(kilimanjaroFoodFr)
  await seedDetailArticleFr(kilimanjaroPortersFr)
  await seedDetailArticleFr(kilimanjaroPackingListFr)
  await seedDetailArticleFr(kilimanjaroClimbCostFr)
  await seedDetailArticleFr(bestTimeToClimbKilimanjaroFr)
  await seedDetailArticleFr(kilimanjaroSafarisFr)
  await seedDetailArticleFr(soloKilimanjaroClimbFr)
  console.log('done — all 13 detail articles seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
