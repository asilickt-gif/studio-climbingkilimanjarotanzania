/**
 * Phase 6 (Italian): the mount-kilimanjaro detail article and the 2 simple
 * (text-only) articles. Mirrors seed-fr-articles-misc.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-articles-misc.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, segmentParagraphsToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedMountKilimanjaroIt() {
  const slug = 'mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Monte Kilimangiaro | Climbing Kilimanjaro Tanzania', description: "Una panoramica del Monte Kilimangiaro — la vetta più alta d'Africa — la sua posizione, la sua altitudine, i suoi itinerari e il periodo migliore per la scalata."},
    heading: 'Monte Kilimangiaro',
    heroBackgroundImage: await uploadImage(client, {src: '/images/routes/hub/hero-kilimanjaro.jpg', alt: 'La vetta innevata del Monte Kilimangiaro'}),
    intro:
      "Il Monte Kilimangiaro è la vetta più alta d'Africa e la montagna indipendente più alta del mondo — un vulcano dormiente che si erge direttamente dalle pianure tanzaniane fino a 5.895 metri. È anche una delle vette d'alta quota più accessibili al mondo: non è richiesta alcuna competenza tecnica né attrezzatura da arrampicata, solo una buona condizione fisica, il giusto ritmo e abbastanza tempo sulla montagna per acclimatarsi bene.",
    sections: [
      {
        heading: 'Dove si Trova il Monte Kilimangiaro?',
        body: "Il Kilimangiaro si trova nel nord della Tanzania, vicino al confine con il Kenya, all'interno del parco nazionale del Kilimangiaro — un sito classificato patrimonio mondiale dell'UNESCO. Le città più vicine sono Moshi e Arusha, entrambe utilizzate come punto di partenza abituale per le scalate, con l'aeroporto internazionale del Kilimangiaro (JRO) come principale porta d'ingresso per gli arrivi internazionali.",
      },
      {
        heading: "Qual è l'Altitudine del Monte Kilimangiaro?",
        body: 'La vetta, Uhuru Peak, culmina a 5.895 m sopra il livello del mare — il punto più alto d\'Africa e una delle celebri « Sette Vette », la montagna più alta di ogni continente. Il Kilimangiaro è composto da tre coni vulcanici: Kibo (il più alto, dove si trova Uhuru Peak), Mawenzi e Shira. Kibo è dormiente, non estinto, sebbene non abbia avuto eruzioni nella storia conosciuta.',
      },
      {
        heading: 'Itinerari di Scalata',
        body: "Esistono diversi itinerari consolidati verso la vetta, ciascuno con lunghezza, difficoltà e paesaggi diversi — dalla popolare Route Marangu con i suoi rifugi alle pittoresche Route Lemosho e Northern Circuit che offrono più giorni di acclimatazione. Consulta la nostra panoramica completa di ogni itinerario, oppure sfoglia i pacchetti giorno per giorno pronti all'uso per ciascuno di essi.",
      },
      {
        heading: 'Periodo Migliore per la Scalata',
        body: 'Il Kilimangiaro può tecnicamente essere scalato tutto l\'anno, ma le due stagioni secche — da fine giugno a ottobre, e da gennaio a metà marzo — offrono i cieli più sereni e i migliori tassi di successo in vetta. Le grandi piogge (aprile-maggio) e le piccole piogge (novembre) portano sentieri più umidi e visibilità ridotta, sebbene alcuni escursionisti esperti scelgano ancora questi mesi più tranquilli e più verdi.',
      },
      {
        heading: 'Qual è il Livello di Difficoltà?',
        body: "Il Kilimangiaro non richiede corde, imbragature o esperienza di arrampicata — è un lungo trekking in alta quota, non una scalata tecnica. La vera sfida è l'altitudine: scegliere un itinerario più lungo con più giorni di acclimatazione migliora notevolmente le tue possibilità di una vetta confortevole e riuscita. Una buona condizione fisica di base, un'attrezzatura di qualità e un team di guide esperte fanno tutta la differenza.",
      },
    ].map((section) => ({_type: 'articleSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const itId = await upsertTranslatedDoc(client, 'article', slug, 'it', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${slug}-it done (${itId})`)
}

async function seedSimpleArticleIt(
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
  const itId = await upsertTranslatedDoc(client, 'article', slug, 'it', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${slug}-it done (${itId})`)
}

async function run() {
  await seedMountKilimanjaroIt()

  await seedSimpleArticleIt(
    'best-time-to-climb-mount-kilimanjaro',
    'Periodo Migliore per Scalare il Monte Kilimangiaro',
    'Qual è il periodo migliore dell\'anno per scalare il Kilimangiaro? Il periodo consigliato è la stagione secca.',
    'Periodo Migliore per Scalare il Kilimangiaro',
    'Qual è il periodo migliore dell\'anno per scalare il Kilimangiaro',
    [
      [
        {
          text: 'Il periodo consigliato per scalare il Kilimangiaro è la sua stagione secca, che va da dicembre a metà marzo e da fine giugno a ottobre. I mesi più favorevoli sono gennaio, febbraio, luglio, agosto, settembre e ottobre. È durante questi mesi che le condizioni meteorologiche sono ottimali. Cielo sereno, viste splendide, poca o nessuna pioggia, e sole.',
        },
      ],
      [{text: 'Tuttavia, esiste sempre la possibilità che il tempo cambi radicalmente, indipendentemente dalla stagione.'}],
      [
        {
          text: 'Puoi scalare il Kilimangiaro in qualsiasi momento dell\'anno, ma alcuni mesi sono preferibili ad altri. Consigliamo di scalare il Monte Kilimangiaro durante i mesi più secchi. Evitiamo aprile e novembre, che sono le principali stagioni delle piogge, rendendo i sentieri più pericolosi.',
        },
      ],
    ],
  )

  await seedSimpleArticleIt(
    'kilimanjaro-climbling-routes',
    'Itinerari di Scalata del Kilimangiaro: Panoramica',
    "Una rapida panoramica dell'itinerario del Kilimangiaro adatto ai tuoi obiettivi: principianti, paesaggi, budget, escursionisti moderati, esperti e tasso di successo.",
    'Itinerari di Scalata del Kilimangiaro: Panoramica',
    undefined,
    [
      [{text: 'Ideale per i principianti', bold: true}, {text: ' – Route Marangu o Machame'}],
      [{text: 'Paesaggi spettacolari', bold: true}, {text: ' – Route Lemosho o Machame'}],
      [{text: 'Principianti con budget limitato', bold: true}, {text: ' – Route Marangu'}],
      [{text: 'Per escursionisti moderati', bold: true}, {text: ' – Route Machame o Lemosho'}],
      [{text: 'Escursionisti esperti', bold: true}, {text: ' – Route Umbwe'}],
      [{text: 'Itinerario più popolare del Monte Kilimangiaro', bold: true}, {text: ' – Route Machame'}],
      [{text: 'Itinerario più lungo del Monte Kilimangiaro', bold: true}, {text: ' – Northern Circuit'}],
      [{text: 'Durante la stagione delle piogge', bold: true}, {text: ' – Route Rongai'}],
      [{text: 'Miglior tasso di successo?', bold: true}, {text: ' – Route Lemosho 8 giorni o Northern Circuit 9 giorni'}],
    ],
  )

  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
