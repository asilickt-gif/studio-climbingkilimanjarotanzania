/**
 * Phase 6 (German): the mount-kilimanjaro detail article and the 2 simple
 * (text-only) articles. Mirrors seed-it-articles-misc.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-articles-misc.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedMountKilimanjaroDe() {
  const slug = 'mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Kilimandscharo | Climbing Kilimanjaro Tanzania', description: 'Ein Überblick über den Kilimandscharo — Afrikas höchsten Gipfel — seine Lage, seine Höhe, seine Routen und die beste Zeit für die Besteigung.'},
    heading: 'Kilimandscharo',
    heroBackgroundImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'Der schneebedeckte Gipfel des Kilimandscharo'}),
    intro:
      'Der Kilimandscharo ist Afrikas höchster Gipfel und der höchste freistehende Berg der Welt — ein ruhender Vulkan, der sich direkt aus den tansanischen Ebenen auf 5.895 Meter erhebt. Er ist auch einer der zugänglichsten Höhengipfel der Welt: Es sind keine technischen Fähigkeiten oder Kletterausrüstung erforderlich, sondern nur gute körperliche Fitness, das richtige Tempo und genügend Zeit auf dem Berg, um sich gut zu akklimatisieren.',
    sections: [
      {
        heading: 'Wo befindet sich der Kilimandscharo?',
        body: 'Der Kilimandscharo liegt im Norden Tansanias, nahe der Grenze zu Kenia, innerhalb des Kilimandscharo-Nationalparks — einer UNESCO-Weltkulturerbestätte. Die nächstgelegenen Städte sind Moshi und Arusha, beide als üblicher Ausgangspunkt für Besteigungen genutzt, mit dem Kilimanjaro International Airport (JRO) als Haupttor für internationale Ankünfte.',
      },
      {
        heading: 'Wie hoch ist der Kilimandscharo?',
        body: 'Der Gipfel, Uhuru Peak, gipfelt auf 5.895 m über dem Meeresspiegel — der höchste Punkt Afrikas und einer der berühmten „Seven Summits", dem höchsten Berg jedes Kontinents. Der Kilimandscharo besteht aus drei vulkanischen Kegeln: Kibo (der höchste, wo sich Uhuru Peak befindet), Mawenzi und Shira. Kibo ist ruhend, nicht erloschen, obwohl er in der bekannten Geschichte keine Ausbrüche hatte.',
      },
      {
        heading: 'Besteigungsrouten',
        body: 'Es gibt mehrere etablierte Routen zum Gipfel, jede mit unterschiedlicher Länge, Schwierigkeit und Landschaft — von der beliebten Marangu-Route mit ihren Hütten bis zu den landschaftlich reizvollen Lemosho- und Northern-Circuit-Routen, die mehr Akklimatisierungstage bieten. Sehen Sie sich unseren vollständigen Überblick über jede Route an, oder durchsuchen Sie die gebrauchsfertigen Tag-für-Tag-Pakete für jede von ihnen.',
      },
      {
        heading: 'Beste Zeit für die Besteigung',
        body: 'Der Kilimandscharo kann technisch das ganze Jahr über bestiegen werden, aber die zwei Trockenzeiten — von Ende Juni bis Oktober und von Januar bis Mitte März — bieten den klarsten Himmel und die besten Gipfelerfolgsquoten. Die großen Regenfälle (April-Mai) und die kleinen Regenfälle (November) bringen feuchtere Pfade und verringerte Sicht mit sich, obwohl manche erfahrenen Trekker diese ruhigeren, grüneren Monate dennoch bevorzugen.',
      },
      {
        heading: 'Wie hoch ist der Schwierigkeitsgrad?',
        body: 'Der Kilimandscharo erfordert keine Seile, Klettergurte oder Kletter­erfahrung — es ist ein langes Höhentrekking, keine technische Besteigung. Die eigentliche Herausforderung ist die Höhe: Die Wahl einer längeren Route mit mehr Akklimatisierungstagen verbessert Ihre Chancen auf einen komfortablen und erfolgreichen Gipfel erheblich. Eine gute Grundfitness, hochwertige Ausrüstung und ein erfahrenes Guide-Team machen den entscheidenden Unterschied.',
      },
    ].map((section) => ({_type: 'articleSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const deId = await upsertTranslatedDoc(client, 'article', slug, 'de', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`${slug}-de done (${deId})`)
}

async function seedSimpleArticleDe(
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
  const deId = await upsertTranslatedDoc(client, 'article', slug, 'de', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`${slug}-de done (${deId})`)
}

async function run() {
  await seedMountKilimanjaroDe()

  await seedSimpleArticleDe(
    'best-time-to-climb-mount-kilimanjaro',
    'Beste Zeit für die Besteigung des Kilimandscharo',
    'Was ist die beste Jahreszeit, um den Kilimandscharo zu besteigen? Die empfohlene Zeit ist die Trockenzeit.',
    'Beste Zeit für die Besteigung des Kilimandscharo',
    'Was ist die beste Jahreszeit, um den Kilimandscharo zu besteigen',
    [
      [
        {
          text: 'Die empfohlene Zeit für die Besteigung des Kilimandscharo ist die Trockenzeit, die von Dezember bis Mitte März und von Ende Juni bis Oktober reicht. Die günstigsten Monate sind Januar, Februar, Juli, August, September und Oktober. Während dieser Monate sind die Wetterbedingungen optimal. Klarer Himmel, herrliche Aussichten, wenig bis kein Regen und Sonnenschein.',
        },
      ],
      [{text: 'Dennoch besteht immer die Möglichkeit, dass sich das Wetter unabhängig von der Jahreszeit drastisch ändert.'}],
      [
        {
          text: 'Sie können den Kilimandscharo zu jeder Jahreszeit besteigen, aber manche Monate sind anderen vorzuziehen. Wir empfehlen, den Kilimandscharo während der trockeneren Monate zu besteigen. Wir vermeiden April und November, die Haupt-Regenzeiten, da diese die Pfade gefährlicher machen.',
        },
      ],
    ],
  )

  await seedSimpleArticleDe(
    'kilimanjaro-climbling-routes',
    'Kilimandscharo-Besteigungsrouten: Überblick',
    'Ein schneller Überblick über die Kilimandscharo-Route, die zu Ihren Zielen passt: Einsteiger, Landschaften, Budget, mäßige Trekker, Experten und Erfolgsquote.',
    'Kilimandscharo-Besteigungsrouten: Überblick',
    undefined,
    [
      [{text: 'Ideal für Einsteiger', bold: true}, {text: ' – Marangu- oder Machame-Route'}],
      [{text: 'Spektakuläre Landschaften', bold: true}, {text: ' – Lemosho- oder Machame-Route'}],
      [{text: 'Einsteiger mit begrenztem Budget', bold: true}, {text: ' – Marangu-Route'}],
      [{text: 'Für mäßige Trekker', bold: true}, {text: ' – Machame- oder Lemosho-Route'}],
      [{text: 'Erfahrene Trekker', bold: true}, {text: ' – Umbwe-Route'}],
      [{text: 'Beliebteste Kilimandscharo-Route', bold: true}, {text: ' – Machame-Route'}],
      [{text: 'Längste Kilimandscharo-Route', bold: true}, {text: ' – Northern Circuit'}],
      [{text: 'Während der Regenzeit', bold: true}, {text: ' – Rongai-Route'}],
      [{text: 'Beste Erfolgsquote?', bold: true}, {text: ' – Lemosho-Route 8 Tage oder Northern Circuit 9 Tage'}],
    ],
  )

  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
