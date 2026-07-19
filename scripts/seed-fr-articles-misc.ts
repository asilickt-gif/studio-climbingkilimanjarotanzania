/**
 * Phase 5: French translation for the mount-kilimanjaro detail article and
 * the 2 simple (text-only) articles.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-articles-misc.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedMountKilimanjaroFr() {
  const slug = 'mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Mont Kilimandjaro | Climbing Kilimanjaro Tanzania', description: "Un aperçu du Mont Kilimandjaro — le plus haut sommet d'Afrique — son emplacement, son altitude, ses itinéraires et la meilleure période pour l'ascension."},
    heading: 'Mont Kilimandjaro',
    heroBackgroundImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'Le sommet enneigé du Mont Kilimandjaro'}),
    intro:
      "Le Mont Kilimandjaro est le plus haut sommet d'Afrique et la plus haute montagne indépendante du monde — un volcan endormi s'élevant directement des plaines tanzaniennes jusqu'à 5 895 mètres. C'est également l'un des sommets de haute altitude les plus accessibles au monde : aucune compétence technique ni équipement d'escalade n'est requis, seulement une bonne condition physique, le bon rythme et suffisamment de temps sur la montagne pour bien s'acclimater.",
    sections: [
      {
        heading: 'Où se trouve le Mont Kilimandjaro ?',
        body: "Le Kilimandjaro se situe dans le nord de la Tanzanie, près de la frontière avec le Kenya, au sein du parc national du Kilimandjaro — un site classé au patrimoine mondial de l'UNESCO. Les villes les plus proches sont Moshi et Arusha, toutes deux servant de point de départ habituel pour les ascensions, l'aéroport international du Kilimandjaro (JRO) étant la principale porte d'entrée pour les arrivées internationales.",
      },
      {
        heading: "Quelle est l'altitude du Mont Kilimandjaro ?",
        body: 'Le sommet, Uhuru Peak, culmine à 5 895 m (19 341 pieds) au-dessus du niveau de la mer — le point le plus élevé d\'Afrique et l\'un des célèbres « Sept Sommets », la plus haute montagne de chaque continent. Le Kilimandjaro est composé de trois cônes volcaniques : Kibo (le plus haut, où se trouve Uhuru Peak), Mawenzi et Shira. Kibo est endormi, et non éteint, bien qu\'il n\'ait pas connu d\'éruption dans l\'histoire connue.',
      },
      {
        heading: "Itinéraires d'ascension",
        body: "Il existe plusieurs itinéraires établis vers le sommet, chacun avec une longueur, une difficulté et des paysages différents — de la populaire route Marangu avec ses refuges aux pittoresques routes Lemosho et Northern Circuit offrant plus de jours d'acclimatation. Consultez notre aperçu complet de chaque itinéraire, ou parcourez les forfaits jour par jour prêts à l'emploi pour chacun d'eux.",
      },
      {
        heading: "Meilleure période pour l'ascension",
        body: 'Le Kilimandjaro peut techniquement être gravi toute l\'année, mais les deux saisons sèches — de fin juin à octobre, et de janvier à mi-mars — offrent les ciels les plus dégagés et les meilleurs taux de réussite au sommet. Les grandes pluies (avril-mai) et les petites pluies (novembre) apportent des sentiers plus humides et une visibilité réduite, bien que certains randonneurs expérimentés choisissent encore ces mois plus calmes et plus verts.',
      },
      {
        heading: 'Quel est le niveau de difficulté ?',
        body: "Le Kilimandjaro ne nécessite ni cordes, ni baudriers, ni expérience d'escalade — c'est un long trek en haute altitude, pas une ascension technique. Le véritable défi est l'altitude : choisir un itinéraire plus long avec plus de jours d'acclimatation améliore considérablement vos chances d'un sommet confortable et réussi. Une bonne condition physique de base, un équipement de qualité et une équipe de guides expérimentés font toute la différence.",
      },
    ].map((section) => ({_type: 'articleSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const frId = await upsertTranslatedDoc(client, 'article', slug, 'fr', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`${slug}-fr done (${frId})`)
}

async function seedSimpleArticleFr(
  slug: string,
  seoTitle: string,
  seoDescription: string,
  heading: string,
  subheading: string | undefined,
  paragraphs: {text: string; bold?: boolean}[][],
) {
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: seoTitle, description: seoDescription},
    heading,
    ...(subheading ? {subheading} : {}),
    sections: [{_type: 'articleSection', _key: key(), body: segmentParagraphsToPt(paragraphs)}],
  }
  const frId = await upsertTranslatedDoc(client, 'article', slug, 'fr', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`${slug}-fr done (${frId})`)
}

async function run() {
  await seedMountKilimanjaroFr()

  await seedSimpleArticleFr(
    'best-time-to-climb-mount-kilimanjaro',
    'Meilleure période pour gravir le Mont Kilimandjaro',
    'Quelle est la meilleure période de l\'année pour gravir le Kilimandjaro ? La période recommandée est la saison sèche.',
    'Meilleure période pour gravir le Kilimandjaro',
    'Quelle est la meilleure période de l\'année pour gravir le Kilimandjaro',
    [
      [
        {
          text: 'La période recommandée pour gravir le Kilimandjaro est sa saison sèche, s\'étendant de décembre à mi-mars et de fin juin à octobre. Les mois les plus favorables sont janvier, février, juillet, août, septembre et octobre. C\'est durant ces mois que les conditions météorologiques sont optimales. Ciel dégagé, superbes vues, peu ou pas de pluie, et du soleil.',
        },
      ],
      [{text: 'Cependant, il existe toujours une possibilité que le temps change radicalement, quelle que soit la saison.'}],
      [
        {
          text: 'Vous pouvez gravir le Kilimandjaro à tout moment de l\'année, mais certains mois sont préférables à d\'autres. Nous recommandons de gravir le Mont Kilimandjaro pendant les mois les plus secs. Nous évitons avril et novembre, qui sont les principales saisons des pluies, rendant les sentiers plus dangereux.',
        },
      ],
    ],
  )

  await seedSimpleArticleFr(
    'kilimanjaro-climbling-routes',
    'Itinéraires d\'ascension du Kilimandjaro : aperçu',
    "Un aperçu rapide de l'itinéraire du Kilimandjaro adapté à vos objectifs : débutants, paysages, budget, randonneurs modérés, experts et taux de réussite.",
    "Itinéraires d'ascension du Kilimandjaro : aperçu",
    undefined,
    [
      [{text: 'Idéal pour les débutants', bold: true}, {text: ' – Routes Marangu ou Machame'}],
      [{text: 'Paysages spectaculaires', bold: true}, {text: ' – Routes Lemosho ou Machame'}],
      [{text: 'Débutants avec un budget limité', bold: true}, {text: ' – Route Marangu'}],
      [{text: 'Pour randonneurs modérés', bold: true}, {text: ' – Routes Machame ou Lemosho'}],
      [{text: 'Randonneurs experts', bold: true}, {text: ' – Route Umbwe'}],
      [{text: 'Itinéraire le plus populaire du Mont Kilimandjaro', bold: true}, {text: ' – Route Machame'}],
      [{text: 'Itinéraire le plus long du Mont Kilimandjaro', bold: true}, {text: ' – Northern Circuit'}],
      [{text: 'Pendant la saison des pluies', bold: true}, {text: ' – Route Rongai'}],
      [{text: 'Meilleur taux de réussite ?', bold: true}, {text: ' – Route Lemosho 8 jours ou Northern Circuit 9 jours'}],
    ],
  )

  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
