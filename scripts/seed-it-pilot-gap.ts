/**
 * Phase 6 (Italian) gap-fill: the `article` "climbing-mount-kilimanjaro" and
 * `standardPage` "why-travel-with-us" were seeded for FR/EN via the early
 * seed-fr-pilot.ts script but never had an IT/ES equivalent. This backfills
 * both documents for Italian, mirroring seed-fr-pilot.ts's field shape.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-pilot-gap.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedArticleIt() {
  const slug = 'climbing-mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {
      _type: 'seo',
      title: 'Scalare il Kilimangiaro con guide locali esperte',
      description:
        "Scala il Monte Kilimangiaro con guide locali esperte. Confronta gli itinerari, i pacchetti, le tariffe e ottieni risposte alle domande più frequenti sulla scalata.",
    },
    heading: 'Scalare il Kilimangiaro con guide locali esperte',
    topImage: await uploadImage(client, {src: '/images/articles/climbing2-hero.webp', alt: 'Gruppo di trekking che si avvicina alla vetta del Kilimangiaro'}),
    intro:
      "Conquista il Kilimangiaro. Vivi l'avventura. Che tu stia confrontando gli itinerari, controllando le liste dell'attrezzatura o cercando consigli di esperti, questa guida riunisce tutto ciò di cui hai bisogno per pianificare la tua scalata con Asili Climbing Kilimanjaro.",
    sections: [
      {
        heading: 'Itinerari e mappe di scalata del Kilimangiaro',
        body: "Route Machame: conosciuta come Whiskey Route, Machame è l'itinerario più popolare del Kilimangiaro, che offre paesaggi mozzafiato e un terreno vario.\nRoute Lemosho: uno degli itinerari più pittoreschi del Kilimangiaro, che inizia all'isolata Londorossi Gate e attraversa il magnifico altopiano di Shira.\nRoute Rongai: unico itinerario settentrionale del Kilimangiaro, meno frequentato e più dolce, ideale durante la stagione delle piogge.\nRoute Northern Circuit: l'itinerario più lungo e più pittoresco, che offre la migliore acclimatazione girando progressivamente attorno al Kilimangiaro.",
      },
      {
        heading: 'Come si confrontano gli itinerari del Kilimangiaro?',
        body: '',
        table: {
          columns: ["Nome dell'itinerario", 'Livello di difficoltà', 'Lunghezza (km)', 'Durata (giorni)', 'Affluenza', 'Prezzo (USD)', 'Tasso di successo (%)'],
          rows: [['Northern Circuit', 'Da moderato a difficile', '90', '9-10', 'Bassa', '2.500-3.500 $', '95']],
        },
      },
      {
        heading: 'Quando dovresti scalare il Kilimangiaro?',
        body: "Considerazioni sulla temperatura: le temperature diurne variano da 20°C a 27°C a bassa quota, ma scendono sotto lo zero in alta quota.\nVegetazione e paesaggi: le stagioni secche offrono viste più limpide, fiori selvatici in fiore e foreste lussureggianti; le stagioni più umide possono comportare condizioni nebbiose.\nLivelli di affluenza: le alte stagioni (gennaio-febbraio e luglio-settembre) attirano più scalatori; le stagioni intermedie (fine marzo-maggio e novembre-inizio dicembre) offrono esperienze più tranquille.\nPreferenze personali e obiettivi: considera le condizioni meteorologiche, le tue preferenze di temperatura, il livello di affluenza e il tuo programma personale nella pianificazione della tua scalata.",
      },
      {
        heading: 'Quanto costa la scalata del Kilimangiaro?',
        body: "Il costo della scalata del Kilimangiaro varia da 2.500 $ a 4.000 $, a seconda della scelta dell'itinerario, della durata, della dimensione del gruppo, del livello di servizio e delle prestazioni incluse. Presso Asili Climbing Kilimanjaro, garantiamo guide ben formate, standard di sicurezza elevati e un'esperienza complessiva eccezionale.",
      },
      {
        heading: 'Consigli importanti per una scalata di successo',
        body: "Vai piano, idratati bene, procurati l'attrezzatura giusta, preparati fisicamente e mentalmente, e goditi il viaggio — legare con altri scalatori rende l'esperienza più gratificante.",
      },
      {
        heading: 'Hai bisogno di una guida per scalare il Kilimangiaro?',
        body: "Sì — la scalata del Kilimangiaro senza una guida autorizzata non è consentita. Le guide apportano la loro competenza, monitorano la tua salute, garantiscono la tua sicurezza e ti aiutano a orientarti nel terreno impegnativo della montagna.",
      },
      {
        heading: 'Guida di scalata del Monte Kilimangiaro correlata',
        body: "La tua guida completa per conquistare il Kilimangiaro con fiducia — consulta la nostra guida completa di scalata del Kilimangiaro, i nostri consigli di esperti e la nostra lista dell'attrezzatura.",
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
    faqHeading: 'Domande frequenti sulla scalata del Monte Kilimangiaro',
    faqs: [
      {
        question: 'Qual è il livello di difficoltà per scalare il Monte Kilimangiaro?',
        answer:
          "Scalare il Monte Kilimangiaro è un'avventura impegnativa ma gratificante. La principale difficoltà deriva dall'alta quota e dal terreno vario. Con una buona preparazione e un accompagnamento esperto, scalatori di diversi livelli di esperienza possono raggiungere la vetta con successo.",
      },
      {
        question: 'I principianti possono scalare il Monte Kilimangiaro?',
        answer:
          "Sì! Sebbene non sia richiesta alcuna competenza tecnica di arrampicata, i principianti devono seguire un allenamento fisico adeguato prima di tentare la scalata. Le nostre guide esperte assicurano che gli scalatori principianti ricevano il supporto necessario durante tutto il viaggio.",
      },
      {
        question: 'Quanto tempo ci vuole per scalare il Monte Kilimangiaro?',
        answer:
          "La scalata dura generalmente da 6 a 9 giorni, a seconda dell'itinerario scelto. Un itinerario più lungo permette una migliore acclimatazione, aumentando le possibilità di un'esperienza di vetta riuscita e piacevole.",
      },
      {
        question: 'Serve ossigeno per scalare il Kilimangiaro?',
        answer:
          "La maggior parte degli scalatori non ha bisogno di ossigeno supplementare. La chiave per una scalata di successo è una buona acclimatazione. Nei rari casi di grave mal di montagna, l'ossigeno è disponibile per motivi di sicurezza.",
      },
      {
        question: 'Come si dorme sul Kilimangiaro?',
        answer:
          "Durante il tuo trekking sul Kilimangiaro con noi, alloggerai in tende di alta qualità, resistenti alle intemperie e progettate per il comfort in condizioni estreme, con tende spaziose, materassini isolanti e sacchi a pelo caldi.",
      },
      {
        question: 'Qual è il periodo migliore per scalare il Monte Kilimangiaro?',
        answer:
          'Le stagioni migliori per la scalata sono i mesi secchi: da gennaio a marzo e da giugno a ottobre, che offrono le condizioni meteorologiche migliori e un cielo più sereno.',
      },
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  }
  const itId = await upsertTranslatedDoc(client, 'article', slug, 'it', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${slug}-it done (${itId})`)
}

async function seedStandardPageIt() {
  const slug = 'why-travel-with-us'
  const enId = await findEnId(client, 'standardPage', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {
      _type: 'seo',
      title: 'Perché Viaggiare con Noi | Asili Climbing Kilimanjaro',
      description:
        "Siamo un tour operator boutique che propone una selezione dei migliori viaggi d'avventura in Tanzania. Scopri la differenza Asili Climbing Kilimanjaro.",
    },
    hero: {
      heading: 'Perché Viaggiare con Noi',
      subheading: "Siamo un tour operator boutique che propone una selezione dei migliori viaggi d'avventura.",
      backgroundImage: await uploadImage(client, {
        src: '/images/why-travel-with-us/hero.webp',
        alt: "Un'acacia solitaria sul bordo di una pista da safari nella savana tanzaniana",
      }),
    },
    sections: [
      {
        heading: "Perché viaggiare con noi – Siamo un tour operator boutique che propone una selezione dei migliori viaggi d'avventura.",
        body: "L'Africa occupa un posto speciale nei nostri cuori. Tutti i professionisti del nostro team di safari hanno radici africane locali. Cresciuti in riserve di caccia, avendo lavorato come ranger capo e gestori di lodge, e trascorso le nostre stesse vacanze in safari, comprendiamo profondamente cosa serve per rendere un viaggio in Africa davvero indimenticabile.\n\nOgni agenzia di viaggi afferma di essere la migliore, per questo abbiamo voluto impegnarci pubblicamente a mettere te, il cliente, al primo posto. Asili Climbing Kilimanjaro offre una garanzia chiamata i « Big 5 »: privato, flessibile, personalizzato, autentico, sicuro, locale, e un'assistenza 24 ore su 24, 7 giorni su 7 con garanzia del prezzo.",
      },
      {
        heading: 'Perché Viaggiare con Noi?',
        body: 'Privato, flessibile, personalizzato\nAutentico, sicuro, locale\nAssistenza 24 ore su 24, 7 giorni su 7\nGaranzia del prezzo',
      },
      {
        heading: 'Oltre 100 clienti conquistati',
        body: 'Il nostro tasso di soddisfazione clienti del 98% spiega perché molti clienti ci raccomandano ai loro amici e viaggiano di nuovo con noi ogni anno.',
      },
      {
        heading: 'Parla con un esperto',
        body: 'I nostri esperti di viaggio sono sempre disponibili per rispondere alle tue domande e aiutarti a pianificare il viaggio della tua vita. Contattaci per qualsiasi richiesta o informazione aggiuntiva.',
      },
    ].map((section) => ({_type: 'pageSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const itId = await upsertTranslatedDoc(client, 'standardPage', slug, 'it', fields)
  await linkTranslationMetadata(client, 'standardPage', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${slug}-it done (${itId})`)
}

async function run() {
  await seedArticleIt()
  await seedStandardPageIt()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
