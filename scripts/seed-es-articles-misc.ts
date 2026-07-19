/**
 * Phase 6 (Spanish): the mount-kilimanjaro detail article and the 2 simple
 * (text-only) articles. Mirrors seed-it-articles-misc.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-articles-misc.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedMountKilimanjaroEs() {
  const slug = 'mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Monte Kilimanjaro | Climbing Kilimanjaro Tanzania', description: "Un resumen del Monte Kilimanjaro — el pico más alto de África — su ubicación, su altitud, sus rutas y la mejor época para escalar."},
    heading: 'Monte Kilimanjaro',
    heroBackgroundImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'La cima nevada del Monte Kilimanjaro'}),
    intro:
      "El Monte Kilimanjaro es el pico más alto de África y la montaña independiente más alta del mundo — un volcán inactivo que se eleva directamente desde las llanuras tanzanas hasta los 5.895 metros. También es una de las cumbres de gran altitud más accesibles del mundo: no se requiere ninguna habilidad técnica de escalada ni equipo especializado, solo una buena condición física, el ritmo adecuado y suficiente tiempo en la montaña para aclimatarse correctamente.",
    sections: [
      {
        heading: '¿Dónde Está el Monte Kilimanjaro?',
        body: "El Kilimanjaro se encuentra en el norte de Tanzania, cerca de la frontera con Kenia, dentro del Parque Nacional Kilimanjaro — un sitio declarado Patrimonio de la Humanidad por la UNESCO. Las ciudades más cercanas son Moshi y Arusha, ambas utilizadas habitualmente como punto de partida para las escaladas, con el Aeropuerto Internacional del Kilimanjaro (JRO) como principal puerta de entrada para las llegadas internacionales.",
      },
      {
        heading: '¿Cuál es la Altitud del Monte Kilimanjaro?',
        body: 'La cumbre, Uhuru Peak, se eleva a 5.895 m sobre el nivel del mar — el punto más alto de África y una de las célebres «Siete Cumbres», la montaña más alta de cada continente. El Kilimanjaro está formado por tres conos volcánicos: Kibo (el más alto, y donde se encuentra Uhuru Peak), Mawenzi y Shira. Kibo está inactivo, no extinto, aunque no ha entrado en erupción en la historia conocida.',
      },
      {
        heading: 'Rutas de Escalada',
        body: "Existen varias rutas consolidadas hacia la cumbre, cada una con una longitud, dificultad y paisajes diferentes — desde la popular Route Marangu con sus refugios hasta las pintorescas Route Lemosho y Northern Circuit, que ofrecen más días de aclimatación. Consulta nuestro desglose completo de cada ruta, o explora los paquetes día a día ya preparados para cada una de ellas.",
      },
      {
        heading: 'Mejor Época para Escalar',
        body: 'El Kilimanjaro técnicamente se puede escalar durante todo el año, pero las dos temporadas secas — de finales de junio a octubre, y de enero a mediados de marzo — ofrecen los cielos más despejados y las mejores tasas de éxito en la cumbre. Las grandes lluvias (abril-mayo) y las pequeñas lluvias (noviembre) traen senderos más húmedos y menor visibilidad, aunque algunos excursionistas experimentados siguen eligiendo estos meses más tranquilos y verdes.',
      },
      {
        heading: '¿Cuál es el Nivel de Dificultad?',
        body: "El Kilimanjaro no requiere cuerdas, arneses ni experiencia de escalada — es un largo trekking en alta montaña, no una escalada técnica. El verdadero desafío es la altitud: elegir una ruta más larga con más días de aclimatación mejora notablemente tus posibilidades de una cumbre cómoda y exitosa. Una buena condición física de base, un equipo de calidad y un equipo de guías experimentados marcan la mayor diferencia.",
      },
    ].map((section) => ({_type: 'articleSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const esId = await upsertTranslatedDoc(client, 'article', slug, 'es', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${slug}-es done (${esId})`)
}

async function seedSimpleArticleEs(
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
  const esId = await upsertTranslatedDoc(client, 'article', slug, 'es', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${slug}-es done (${esId})`)
}

async function run() {
  await seedMountKilimanjaroEs()

  await seedSimpleArticleEs(
    'best-time-to-climb-mount-kilimanjaro',
    'Mejor Época para Escalar el Monte Kilimanjaro',
    '¿Cuál es la mejor época del año para escalar el Kilimanjaro? La época recomendada es la temporada seca.',
    'Mejor época para escalar el Kilimanjaro',
    '¿Cuál es la mejor época del año para escalar el Kilimanjaro',
    [
      [
        {
          text: 'La época recomendada para escalar el Kilimanjaro es su temporada seca, que va de diciembre a mediados de marzo y de finales de junio a octubre. Los meses más favorables son enero, febrero, julio, agosto, septiembre y octubre. Es durante estos meses cuando las condiciones climáticas son óptimas. Cielos despejados, vistas magníficas, poca o ninguna lluvia, y sol.',
        },
      ],
      [{text: 'Sin embargo, siempre existe la posibilidad de que el clima cambie drásticamente, independientemente de la temporada.'}],
      [
        {
          text: 'Puedes escalar el Kilimanjaro en cualquier época del año, pero algunos meses son preferibles a otros. Recomendamos escalar el Monte Kilimanjaro durante los meses más secos. Evitamos abril y noviembre, que son las principales temporadas de lluvias, lo que hace que los senderos sean más peligrosos.',
        },
      ],
    ],
  )

  await seedSimpleArticleEs(
    'kilimanjaro-climbling-routes',
    'Rutas de Escalada del Kilimanjaro: Resumen',
    "Un resumen rápido de qué ruta del Kilimanjaro se adapta a tus objetivos: principiantes, paisajes, presupuesto, excursionistas moderados, expertos y tasa de éxito.",
    'Rutas de Escalada del Kilimanjaro: Resumen',
    undefined,
    [
      [{text: 'Ideal para principiantes', bold: true}, {text: ' – Route Marangu o Machame'}],
      [{text: 'Paisajes espectaculares', bold: true}, {text: ' – Route Lemosho o Machame'}],
      [{text: 'Principiantes con presupuesto limitado', bold: true}, {text: ' – Route Marangu'}],
      [{text: 'Para excursionistas moderados', bold: true}, {text: ' – Route Machame o Lemosho'}],
      [{text: 'Excursionistas expertos', bold: true}, {text: ' – Route Umbwe'}],
      [{text: 'Ruta más popular del Monte Kilimanjaro', bold: true}, {text: ' – Route Machame'}],
      [{text: 'Ruta más larga del Monte Kilimanjaro', bold: true}, {text: ' – Northern Circuit'}],
      [{text: 'Durante la temporada de lluvias', bold: true}, {text: ' – Route Rongai'}],
      [{text: '¿Mejor tasa de éxito?', bold: true}, {text: ' – Route Lemosho de 8 días o Northern Circuit de 9 días'}],
    ],
  )

  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
