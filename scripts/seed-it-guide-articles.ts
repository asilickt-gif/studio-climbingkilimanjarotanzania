/**
 * Phase 6 (Italian): the 6 remaining guide articles (mount-kilimanjaro was
 * already seeded separately in seed-it-articles-misc.ts).
 * Mirrors seed-fr-guide-articles.ts's structure but with Italian text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-guide-articles.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface TableIt {
  columns: string[]
  rows: string[][]
}
interface SectionIt {
  heading: string
  body?: string
  table?: TableIt
}
interface FaqIt {
  question: string
  answer: string
}
interface GuideArticleIt {
  slug: string
  seoTitle: string
  seoDescription: string
  heading: string
  heroImage?: {src: string; alt: string}
  intro: string
  sections: SectionIt[]
  faqHeading?: string
  faqs?: FaqIt[]
}

function tableToDoc(table?: TableIt) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedGuideArticleIt(data: GuideArticleIt) {
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
  const itId = await upsertTranslatedDoc(client, 'article', data.slug, 'it', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${data.slug}-it done (${itId})`)
}

const kilimanjaroClimbingSeasonsIt: GuideArticleIt = {
  slug: 'kilimanjaro-climbing-seasons',
  seoTitle: 'Miglior Mese per Scalare il Monte Kilimangiaro | Guida Meteo',
  seoDescription: 'Una guida meteo mese per mese per scalare il Monte Kilimangiaro: mesi migliori, stagioni secche, mesi da evitare e consigli di esperti sulla tempistica.',
  heading: 'Miglior Mese per Scalare il Monte Kilimangiaro',
  intro:
    'I mesi migliori per scalare il Monte Kilimangiaro sono durante le stagioni secche, ovvero da gennaio a marzo e da giugno a ottobre. Questi periodi offrono un cielo sereno e sentieri più asciutti, portando a condizioni di trekking più favorevoli. Per un equilibrio tra bel tempo e minore affluenza, valuta di scalare a gennaio, febbraio o ottobre.',
  sections: [
    {
      heading: 'Miglior Mese per Scalare il Monte Kilimangiaro: la Guida Meteo Definitiva',
      body: "Gli itinerari del Kilimangiaro sono i percorsi ufficialmente designati utilizzati dagli escursionisti per raggiungere la vetta della montagna più alta d'Africa, Uhuru Peak (5.895 m). Scegliere il giusto itinerario di scalata del Monte Kilimangiaro è una delle decisioni più importanti che prenderai pianificando il tuo trekking. Ogni itinerario differisce per paesaggi, difficoltà, profilo di acclimatazione, tasso di successo ed esperienza complessiva.",
    },
    {
      heading: 'Perché il Miglior Mese per Scalare il Monte Kilimangiaro è Importante',
      body: "Il clima del Kilimangiaro oscilla tra foreste pluviali umide e vette artiche — scegliere il miglior mese per scalare il Monte Kilimangiaro influisce sullo stato dei sentieri, sui rischi di mal acuto di montagna e sulle viste. Le stagioni secche (gen-mar, giu-ott) offrono sentieri stabili e panorami sereni, mentre le piogge (apr-mag, nov) portano fango e nebbia. Le nostre guide raccomandano itinerari di 7 giorni o più durante le alte stagioni per un'acclimatazione ottimale. Scegliere le stagioni intermedie permette di risparmiare dal 10 al 20% sui costi pur beneficiando di un buon tempo.",
    },
    {
      heading: 'Mese per Mese: i Migliori Mesi per Scalare il Monte Kilimangiaro — Guida Meteo',
      body: 'Ecco una panoramica dettagliata dei migliori mesi per scalare il Monte Kilimangiaro, inclusi il punteggio complessivo, il meteo, l\'affluenza e consigli sugli itinerari.',
      table: {
        columns: ['Periodo', 'Punteggio Complessivo', 'Meteo', 'Affluenza', 'Itinerario Consigliato'],
        rows: [
          ['16 gen-28 feb', 'Ottimo', 'Temperature ragionevoli, precipitazioni medie, poche nuvole', 'Media', 'Tutti gli itinerari aperti'],
          ['01 mar-31 mar', 'Variabile', 'Temperature ragionevoli, rischio crescente di pioggia e neve, nuvole dense a bassa quota', 'Bassa', 'Più orientato verso la Route Rongai, soprattutto a fine periodo'],
          ['01 apr-15 giu', 'Difficile e pericoloso', 'Temperature ragionevoli, forti precipitazioni, rischio di neve, nuvole dense a bassa quota', 'Molto bassa', 'Tutti gli itinerari sono difficili'],
          ['16 giu-15 lug', 'Variabile', 'Molto freddo, neve e ghiaccio in vetta, precipitazioni in calo, visibilità in miglioramento', 'Media', 'Più orientato verso la Route Rongai, soprattutto a inizio periodo'],
          ['16 lug-31 ago', 'Buono', 'Molto freddo, neve e ghiaccio in vetta, precipitazioni scarse, spesso sereno', 'Alta', 'Tutti gli itinerari aperti'],
          ['01 set-15 ott', 'Molto buono', 'Temperature ragionevoli, precipitazioni scarse, spesso sereno', 'Alta', 'Tutti gli itinerari aperti'],
          ['16 ott-31 ott', 'Variabile', 'Temperature ragionevoli, rischio crescente di pioggia, visibilità ridotta', 'Media', 'Più orientato verso la Route Rongai, soprattutto a fine periodo'],
          ['01 nov-15 dic', 'Difficile e pericoloso', 'Temperature ridotte, pioggia e neve moderate, temporali', 'Bassa', 'Tutti gli itinerari sono difficili'],
          ['16 dic-15 gen', 'Variabile', 'Temperature ridotte, pioggia e neve moderate, nuvole dense a bassa quota', 'Molto alta', 'Più orientato verso la Route Rongai, soprattutto a inizio periodo'],
        ],
      },
    },
    {heading: 'Periodo Migliore per Scalare il Monte Kilimangiaro: Focus sulle Stagioni Secche'},
    {heading: 'Gennaio a Inizio Marzo (Breve Stagione Secca)', body: 'Caldo, soleggiato con poca pioggia — eccellente per le viste e il comfort.'},
    {heading: 'Fine Giugno a Ottobre (Lunga Stagione Secca)', body: "L'età dell'oro del Kilimangiaro: sentieri asciutti, aria frizzante, panorami grandiosi."},
    {
      heading: 'Stagioni Intermedie: Alternative Valide ai Mesi Migliori',
      body: 'Novembre (piogge di fine ciclo) e dicembre (affluenza festiva) offrono un tempo di transizione — gestibile con Rongai o Northern Circuit per meno fango.',
    },
    {
      heading: 'Mesi da Evitare: Condizioni Meteo Difficili sul Kilimangiaro',
      body: 'Fine marzo-maggio (grandi piogge) e novembre (piccole piogge) presentano le condizioni più difficili — forti acquazzoni, sentieri scivolosi e nebbia.',
    },
    {
      heading: 'Consigli Chiave per Scalare durante il Miglior Mese per Scalare il Monte Kilimangiaro',
      body: "Scelta dell'itinerario: Rongai per gli inizi delle stagioni intermedie/secche; tutti aperti in alta stagione. Luna piena: prenota per la visibilità in vetta — affollato ma magico. Imprevedibilità: porta strati; la vetta è sempre sotto zero. Impatto sui costi: stagioni secche +10-20%; sconti in stagione intermedia.",
    },
  ],
  faqHeading: 'FAQ sul Miglior Mese per Scalare il Monte Kilimangiaro',
  faqs: [
    {question: 'Qual è il miglior mese per scalare il Monte Kilimangiaro?', answer: 'Settembre o febbraio — asciutto, sereno, affluenza equilibrata.'},
    {question: 'Quali sono i mesi migliori per scalare il Monte Kilimangiaro?', answer: 'Gennaio-marzo e giugno-ottobre per un tempo ottimale.'},
    {question: 'È possibile scalare il Kilimangiaro durante la stagione delle piogge?', answer: 'Sì, ma più rischioso — privilegia la stagione intermedia per un compromesso.'},
    {question: 'Il periodo migliore per scalare il Monte Kilimangiaro influisce sul costo?', answer: "Sì — le alte stagioni aggiungono circa il 20%; la bassa stagione permette risparmi."},
  ],
}

const whatIsTheBestRouteUpKilimanjaroIt: GuideArticleIt = {
  slug: 'what-is-the-best-route-up-kilimanjaro',
  seoTitle: 'Qual è il Miglior Itinerario per Scalare il Monte Kilimangiaro? | Guida Completa',
  seoDescription: 'Una guida completa dei 7 itinerari di scalata del Monte Kilimangiaro: tassi di successo, distanze di trekking, e come scegliere il miglior itinerario per la tua scalata.',
  heading: 'Itinerari del Monte Kilimangiaro',
  intro:
    'Esistono sette itinerari consolidati per scalare il Monte Kilimangiaro, uno che inizia dal lato nord e gli altri dal lato sud: Northern Circuit, Lemosho, Shira, Machame (route « Whiskey »), Rongai, Marangu (route « Coca-Cola ») e Umbwe. Il Northern Circuit è l\'itinerario più recente e attraversa quasi tutta la montagna, offrendo una vera esperienza di natura selvaggia e viste a 360 gradi. Gli itinerari Lemosho e Shira affrontano da ovest, mentre l\'itinerario Rongai inizia da nord.',
  sections: [
    {
      heading: 'Itinerari del Kilimangiaro: Guida Completa agli Itinerari di Scalata del Monte Kilimangiaro',
      body: "Gli itinerari del Kilimangiaro sono i percorsi ufficialmente designati utilizzati dagli escursionisti per raggiungere la vetta della montagna più alta d'Africa, Uhuru Peak (5.895 m). Scegliere il giusto itinerario di scalata del Monte Kilimangiaro è una delle decisioni più importanti che prenderai pianificando il tuo trekking. Ogni itinerario differisce per paesaggi, difficoltà, profilo di acclimatazione, tasso di successo ed esperienza complessiva.",
    },
    {heading: 'Quanti Itinerari Esistono per Scalare il Monte Kilimangiaro?', body: 'Esistono 7 principali itinerari del Kilimangiaro utilizzati per scalare la montagna: Northern Circuit, Lemosho, Shira, Machame, Rongai, Marangu e Umbwe.'},
    {heading: 'Elementi da Considerare per Scegliere il Tuo Itinerario di Scalata del Monte Kilimangiaro', body: 'Per scegliere il miglior itinerario del Monte Kilimangiaro per te, ci sono molte variabili da considerare.'},
    {heading: 'CHI:', body: 'Chi scala? Le capacità dell\'intero gruppo devono essere considerate nella scelta di un itinerario. Ci sono principianti nel tuo gruppo? Ci sono persone che non sono mai state in alta quota? Scegli un itinerario adatto a tutti.'},
    {heading: 'COSA:', body: 'Quali sono i limiti della tua scalata? Hai un budget limitato? O un numero limitato di giorni per il tuo viaggio? Esistono itinerari più o meno costosi e durate più o meno lunghe. Abbi un\'idea del budget e del numero di giorni che sei disposto a dedicare alla montagna.'},
    {heading: 'COME:', body: 'Come immagini il tuo trekking? Vuoi l\'itinerario più difficile o un itinerario meno impegnativo? Il Kilimangiaro può generare molto disagio e sofferenza. Alcuni itinerari sono più clementi di altri.'},
    {heading: 'DOVE:', body: 'Dove desideri iniziare la tua scalata? Gli itinerari iniziano da tutti i lati della montagna. Il tuo punto di partenza influisce sul costo, sui paesaggi e sulla loro diversità.'},
    {heading: 'PERCHÉ:', body: 'Perché scali? È molto importante per te raggiungere la vetta? Allora scegli un itinerario con un alto tasso di successo. Vuoi scattare le foto migliori? Allora scegli un itinerario pittoresco. Vuoi semplicemente esserci? Allora scegli un itinerario rapido ed economico.'},
    {heading: 'QUANDO:', body: 'Quando scali? Se scali durante la stagione secca, perfetto. Ma se scali durante la stagione delle piogge o le stagioni intermedie, l\'itinerario scelto può influenzare la difficoltà della scalata. Le scalate intorno alle vacanze e alle lune piene sono particolarmente frequentate.'},
    {
      heading: 'Qual è il Miglior Itinerario per Scalare il Monte Kilimangiaro?',
      body: 'Il miglior itinerario del Kilimangiaro dipende dalle tue priorità: per il tasso di successo più alto, scegli il Northern Circuit o Lemosho. Per i paesaggi, scegli Lemosho o Machame. Per budget e tempo, scegli Marangu. Per una sfida, scegli Umbwe.',
    },
    {
      heading: 'Mappa degli Itinerari del Kilimangiaro e Distanze di Trekking',
      body: 'Le distanze totali di trekking variano in base all\'itinerario.',
      table: {columns: ['Itinerario', 'Distanza Totale'], rows: [['Lemosho', '70 km'], ['Machame', '62 km'], ['Marangu', '64 km'], ['Northern Circuit', '96 km'], ['Rongai', '65 km']]},
    },
    {
      heading: 'Tasso di Successo del Monte Kilimangiaro per Itinerario',
      table: {columns: ['Itinerario', 'Tasso di Successo'], rows: [['Northern Circuit', '95%'], ['Lemosho', '90%'], ['Machame', '85%'], ['Rongai', '80%'], ['Marangu', '65%'], ['Umbwe', '50%']]},
    },
    {
      heading: 'Come Scegliere il Tuo Itinerario del Kilimangiaro',
      body: "Per scegliere tra gli itinerari del Monte Kilimangiaro, considera le capacità del tuo gruppo, il tuo budget, il tempo disponibile, la difficoltà desiderata, il punto di partenza, la tua motivazione personale e la stagione prevista per la tua scalata.",
    },
    {
      heading: 'Perché Prenotare il Tuo Itinerario del Kilimangiaro con Climbing Kilimanjaro Tanzania?',
      body: 'Scegliere il giusto itinerario è solo una parte del tuo successo. Prenotare presso un operatore locale di fiducia ed esperto come Asili Climbing Kilimanjaro garantisce guide certificate, un trattamento equo dei portatori e un approccio incentrato sulla sicurezza su ogni itinerario.',
    },
    {
      heading: 'Pianifica Oggi Stesso il Tuo Itinerario Ideale del Kilimangiaro',
      body: 'Scopri analisi dettagliate di tutti gli itinerari del Kilimangiaro, esempi di itinerari e consigli di esperti presso Climbing Kilimanjaro Tanzania — la tua risorsa di fiducia per scalare il Monte Kilimangiaro in sicurezza e con successo.',
    },
  ],
  faqHeading: 'FAQ sugli Itinerari del Kilimangiaro',
  faqs: [
    {question: 'Quale itinerario del Kilimangiaro ha il tasso di successo più alto?', answer: "Il Northern Circuit ha il tasso di successo più alto grazie a un'eccellente acclimatazione."},
    {question: 'Quanti itinerari esistono per scalare il Kilimangiaro?', answer: 'Esistono sette principali itinerari di scalata del Monte Kilimangiaro.'},
    {question: 'Qual è il miglior itinerario per il Kilimangiaro?', answer: "La Route Lemosho è la più raccomandata per l'esperienza complessiva, il tasso di successo e i paesaggi."},
    {question: 'Qual è la distanza di trekking del Kilimangiaro?', answer: 'Variabile: da 50 a 90 km in totale, a seconda dell\'itinerario.'},
    {question: 'Qual è il tasso di successo del Monte Kilimangiaro?', answer: 'Complessivamente dal 65 all\'80%; a seconda dell\'itinerario, dal 50% (breve) al 98% (lungo).'},
  ],
}

const kilimanjaroGuideCostIt: GuideArticleIt = {
  slug: 'kilimanjaro-guide-cost',
  seoTitle: 'Costo della Guida del Kilimangiaro | Guida Completa alle Tariffe per Scalare il Monte Kilimangiaro',
  seoDescription: "Una guida completa alle tariffe per scalare il Monte Kilimangiaro: costi per itinerario, per pacchetto, cosa è incluso, e il legame tra costo e tasso di successo in vetta.",
  heading: 'Costo della Scalata del Kilimangiaro in Tanzania',
  intro:
    "Scalare il Monte Kilimangiaro costa tra 1.680 $ e oltre 7.000 $ a persona, a seconda dell'operatore e del livello di servizio. I viaggi economici variano da circa 1.680 $ a 2.500 $, i tour di fascia media da 2.500 $ a 4.000 $, e le scalate di lusso possono costare 4.000 $ o più, con le opzioni di fascia alta che possono raggiungere oltre 7.000 $. Il costo totale varia in base a fattori come l'itinerario, il numero di giorni, la dimensione del gruppo e le prestazioni incluse, con una parte importante del prezzo destinata alle tasse obbligatorie del parco.",
  sections: [
    {
      heading: 'Costo della Guida del Kilimangiaro: Guida Completa alle Tariffe per Scalare il Monte Kilimangiaro',
      body: "Comprendere il costo della guida del Kilimangiaro è essenziale per pianificare la tua spedizione da sogno verso la vetta più alta d'Africa. Il prezzo totale della scalata del Monte Kilimangiaro dipende da molteplici fattori, tra cui la scelta dell'itinerario, il numero di giorni, il livello di comfort, la dimensione del gruppo e la qualità dell'azienda di guide.",
    },
    {heading: 'Fattori che Influenzano il Costo', body: "Livello di servizio: i pacchetti premium includono più prestazioni, un cibo migliore e un'attrezzatura di qualità superiore, mentre le opzioni economiche si concentrano sull'essenziale."},
    {heading: 'Costi Supplementari da Considerare', body: 'Mance: dare la mancia a guide, portatori e cuochi è consuetudine e può variare da 150 $ a 300 $ a persona. Voli: i biglietti aerei internazionali e nazionali non sono generalmente inclusi nei pacchetti.'},
    {
      heading: 'Pacchetti del Monte Kilimangiaro',
      body: "Scala la vetta più alta d'Africa in un'avventura privata e personalizzata guidata da guide locali esperte. Tutti i pacchetti includono date di partenza flessibili e il tuo team privato di guide, portatori e cuochi. I pasti sono serviti nella tua tenda ristorante privata. I sentieri e i campeggi sono condivisi con altri escursionisti.",
    },
    {heading: 'Route Marangu (5 giorni / 4 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '2.008 $'], ['2 escursionisti in condivisione', '1.783 $'], ['3-4 escursionisti in condivisione', '1.678 $']]}},
    {heading: 'Route Marangu (6 giorni / 5 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '3.588 $'], ['2 escursionisti in condivisione', '2.938 $'], ['3-4 escursionisti in condivisione', '2.668 $']]}},
    {heading: 'Route Machame o Umbwe (6 giorni / 5 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '2.328 $'], ['2 escursionisti in condivisione', '2.078 $'], ['3-4 escursionisti in condivisione', '1.948 $']]}},
    {heading: 'Route Machame o Umbwe (7 giorni / 6 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '2.608 $'], ['2 escursionisti in condivisione', '2.348 $'], ['3-4 escursionisti in condivisione', '2.203 $']]}},
    {heading: 'Route Shira, Lemosho o Rongai (6 giorni / 5 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '2.648 $'], ['2 escursionisti in condivisione', '2.243 $'], ['3-4 escursionisti in condivisione', '2.063 $']]}},
    {heading: 'Route Shira, Lemosho o Rongai (7 giorni / 6 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '2.938 $'], ['2 escursionisti in condivisione', '2.513 $'], ['3-4 escursionisti in condivisione', '2.313 $']]}},
    {heading: 'Route Shira, Lemosho o Rongai (8 giorni / 7 notti di trekking + 2 notti in hotel)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '3.228 $'], ['2 escursionisti in condivisione', '2.773 $'], ['3-4 escursionisti in condivisione', '2.568 $']]}},
    {heading: 'Route Northern Circuit (8 giorni / 7 notti + noleggio toilette)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '3.588 $'], ['2 escursionisti in condivisione', '2.938 $'], ['3-4 escursionisti in condivisione', '2.668 $']]}},
    {heading: 'Route Northern Circuit (9 giorni / 8 notti + noleggio toilette)', table: {columns: ['Tipo di Escursionista', 'Prezzo'], rows: [['1 escursionista da solo', '3.918 $'], ['2 escursionisti in condivisione', '3.228 $'], ['3-4 escursionisti in condivisione', '2.683 $']]}},
    {
      heading: 'Costo del Trekking del Kilimangiaro rispetto al Tasso di Successo',
      body: "Costi più elevati sono generalmente correlati a tassi di successo in vetta più alti sul Kilimangiaro, poiché i trekking più costosi utilizzano itinerari più lunghi che permettono una migliore acclimatazione, includono migliori misure di sicurezza e si avvalgono di operatori di qualità superiore. I trekking economici sono meno costosi ma hanno un tasso di successo più basso a causa di durate più brevi e minori precauzioni di sicurezza, e possono risparmiare sul benessere del team e sull'attrezzatura. Per una scalata di successo, si consiglia di scegliere un itinerario di almeno sette giorni e un operatore affidabile.",
    },
    {
      heading: 'Costo più Alto, Tasso di Successo più Alto',
      body: "Itinerari: gli itinerari più lunghi come Lemosho o Northern Circuit offrono tassi di successo più alti (fino al 98-99%) perché lasciano più tempo al corpo per acclimatarsi all'altitudine. Costo: questi itinerari costano spesso di più (2.000 $ a 4.550 $ o più) a causa della durata più lunga e della necessità di più supporto logistico. Qualità dell'operatore: gli operatori affidabili applicano tariffe più elevate ma forniscono misure di sicurezza essenziali come attrezzatura adeguata, cibo di qualità, salari equi per i portatori e guide esperte.",
    },
    {
      heading: 'Costo più Basso, Tasso di Successo più Basso',
      body: "Itinerari: gli itinerari più brevi come Marangu (5-6 giorni) sono meno costosi ma hanno tassi di successo più bassi (65-70%) perché non lasciano abbastanza tempo per l'acclimatazione. Costo: i trekking economici possono costare anche solo 1.500 $ a 2.500 $, ma questo spesso deriva da risparmi su aspetti cruciali. Qualità dell'operatore: gli operatori economici possono sottopagare i portatori, fornire cibo inadeguato e utilizzare attrezzatura di scarsa qualità, il che può compromettere la sicurezza e il morale.",
    },
    {
      heading: 'Prezzo del Trekking del Kilimangiaro: Cosa Deve Includere?',
      body: "Un pacchetto affidabile deve sempre includere: tutte le tasse di parco, i soccorsi governativi e l'assistenza di emergenza, l'alloggio sulla montagna, i trasferimenti dall'aeroporto, guide professionali, i pasti e l'acqua potabile, bombole di ossigeno e primo soccorso. Evita gli operatori che nascondono questi costi essenziali.",
    },
  ],
}

const kilimanjaroClimbingGuideIt: GuideArticleIt = {
  slug: 'kilimanjaro-climbing-guide',
  seoTitle: 'Guida alla Scalata del Kilimangiaro | Consigli Essenziali per Scalare il Monte Kilimangiaro',
  seoDescription: "Consigli essenziali per scalare il Monte Kilimangiaro: allenamento, acclimatazione, stagioni, sicurezza, ossigeno, kit medici e cosa aspettarsi sulla montagna.",
  heading: 'Consigli Essenziali per Scalare il Monte Kilimangiaro',
  heroImage: {src: '/images/articles/guide-hero.webp', alt: 'Uno scalatore davanti al cartello della vetta Uhuru Peak'},
  intro:
    "Il Kilimangiaro, che culmina a 5.895 metri sopra il livello del mare, è la montagna indipendente più alta del mondo e il « Tetto dell'Africa ». Essendo una delle destinazioni di viaggio più ambite del continente, il Monte Kilimangiaro attira oltre 40.000 visitatori ogni anno. Questo magnifico trekking non richiede alcuna competenza tecnica di arrampicata, rendendolo accessibile a chiunque abbia una buona condizione fisica media. Questa guida è pensata per aiutare gli scalatori a preparare la loro avventura unica nella vita. Le nostre raccomandazioni si basano sulla nostra vasta esperienza — presso Asili Climbing Kilimanjaro, abbiamo organizzato con successo trekking per migliaia di scalatori.",
  sections: [
    {heading: 'Fatti da Conoscere Prima del Tuo Trekking al Kilimangiaro', body: "La vetta del Monte Kilimangiaro, Uhuru Peak, culmina a 5.895 m — il punto più alto d'Africa e la montagna indipendente più alta del mondo."},
    {heading: "Prepararsi e Allenarsi per il Kilimangiaro"},
    {
      heading: 'Come Dovrei Allenarmi per una Scalata del Monte Kilimangiaro?',
      body: "Mantenere una buona condizione fisica è essenziale per scalare il Kilimangiaro. Tuttavia, non è necessario essere un atleta per raggiungere la vetta. Una buona condizione fisica media è sufficiente. Per valutare la tua preparazione, verifica se riesci a camminare comodamente per 8-10 km. Se è così, sei sufficientemente in forma per scalare il Monte Kilimangiaro. La corsa è un ottimo esercizio di preparazione — punta a correre 4-5 km con sicurezza. Il nuoto è un altro ottimo complemento al tuo allenamento, poiché rafforza la resistenza cardiovascolare.",
    },
    {
      heading: 'Quali sono le Stagioni delle Piogge e Secche in Tanzania?',
      body: "La Tanzania conosce due stagioni delle piogge e due stagioni secche. La breve stagione delle piogge inizia all'inizio di novembre e continua fino a fine dicembre, seguita da una stagione secca che dura fino a metà marzo. La lunga stagione delle piogge inizia a metà marzo e termina a metà giugno. Per scalare il Kilimangiaro durante la stagione delle piogge, valuta i versanti nord — questa zona riceve notevolmente meno precipitazioni. Gli itinerari consigliati includono Rongai, Northern Circuit e Marangu. Da giugno a ottobre, l'Africa orientale conosce notti fredde, soprattutto in alta quota.",
    },
    {heading: 'Altre Informazioni di Trekking'},
    {heading: "Lista dell'Equipaggiamento per il Kilimangiaro", body: "Una guida gratuita all'equipaggiamento per il Kilimangiaro che presenta il materiale essenziale e le raccomandazioni di esperti di Asili Climbing Kilimanjaro."},
    {heading: 'Stai Pianificando di Scalare il Kilimangiaro?', body: 'Siamo qui per fornirti risposte chiare e consigli di esperti — contattaci per qualsiasi domanda e fai il primo passo con fiducia.'},
  ],
  faqHeading: 'Domande sulla Sicurezza al Kilimangiaro',
  faqs: [
    {
      question: "Puoi consigliare un'assicurazione di viaggio affidabile?",
      answer: "Asili Climbing Kilimanjaro consiglia Global Rescue per una copertura assicurativa di viaggio affidabile. Assicurati che la tua polizza includa tre elementi chiave: copertura per il trekking in alta quota fino a 6.000 metri, evacuazione in elicottero e servizi medici completi.",
    },
    {
      question: 'Hai consigli per una migliore acclimatazione durante la scalata del Kilimangiaro?',
      answer: "Per acclimatarti bene e riuscire nella tua scalata, ti consigliamo di: camminare lentamente (il tuo corpo ha bisogno di tempo per adattarsi ai livelli di ossigeno più bassi, e un ritmo moderato lo aiuta a produrre più globuli rossi); bere 3-4 litri d'acqua al giorno; partecipare alle nostre escursioni giornaliere di acclimatazione in quota e ritorno (generalmente non più di 2 ore); e, se hai tempo, valutare di scalare il Monte Meru prima del tuo viaggio al Kilimangiaro. Scegliere itinerari di sette giorni o più lascia anche più tempo al tuo corpo per adattarsi, migliorando le tue possibilità di raggiungere la vetta.",
    },
    {question: "Qual è il miglior itinerario per l'acclimatazione?", answer: 'Per acclimatarti meglio sul Kilimangiaro, i migliori itinerari sono Lemosho, Machame e Rongai — o altri itinerari di sette giorni o più.'},
    {
      question: 'Quanti giorni di acclimatazione supplementari dovrei prendere?',
      answer: "Sulla Route Machame di sette giorni, non avrai bisogno di alcun giorno di acclimatazione supplementare. Rongai e Lemosho sono opzioni altrettanto buone. Tuttavia, se pensi di non essere in ottima forma fisica, puoi aggiungere uno o due giorni di riposo supplementari.",
    },
    {
      question: 'Servono sistemi di ossigeno per scalare il Kilimangiaro?',
      answer: "In vetta al Kilimangiaro, il livello di ossigeno nell'aria è circa la metà di quello a livello del mare. La maggior parte degli scalatori può raggiungere Uhuru Peak senza ossigeno supplementare, ma per sicurezza, trasportiamo sempre numerose bombole di ossigeno durante le nostre spedizioni, e il costo è incluso nel prezzo del tour.",
    },
    {
      question: 'Devo portare un kit medico?',
      answer: "Durante le spedizioni al Kilimangiaro, i nostri team trasportano kit medici completi — piccoli kit tattici durante le escursioni per lesioni, graffi o distorsioni, e kit da campo più grandi con farmaci per problemi comuni come nausea, mal di testa, vomito e disturbi digestivi. Se assumi farmaci su prescrizione, è meglio portarli con te durante il tuo viaggio in Tanzania.",
    },
    {
      question: 'Qual è il tasso di mortalità sul Kilimangiaro?',
      answer: "Rispetto ad altre montagne, il Kilimangiaro ha un basso tasso di mortalità sui suoi sette itinerari. Delle circa 50.000 persone che scalano il Monte Kilimangiaro ogni anno, dalle 3 alle 5 perdono la vita, principalmente a causa di problemi cerebrali e polmonari legati all'altitudine o di attacchi cardiaci dovuti al mancato rispetto dell'acclimatazione. Il tasso di mortalità tra i portatori del Kilimangiaro è notevolmente più alto, in gran parte a causa degli operatori ultra-economici che forniscono attrezzatura inadeguata. Scegli sempre un'azienda registrata presso il KPAP per contribuire a garantire un trattamento equo dei portatori.",
    },
    {question: 'Perché la vetta del Kilimangiaro si chiama Uhuru Peak?', answer: '« Uhuru » significa « libertà » in swahili. La vetta più alta del Kilimangiaro è stata chiamata Uhuru Peak per celebrare l\'indipendenza della Tanzania dalla Gran Bretagna nel 1961.'},
    {
      question: 'Posso fare un safari dopo aver scalato il Kilimangiaro?',
      answer: "Sì — la Tanzania possiede destinazioni celebri per ogni tipo di avventura africana, le più popolari essendo il parco nazionale del Serengeti e il cratere del Ngorongoro. È un'ottima idea pianificare un safari prima o dopo la scalata.",
    },
  ],
}

const planATripToClimbKilimanjaroIt: GuideArticleIt = {
  slug: 'information-on-how-to-plan-a-trip-to-climb-mount-kilimanjaro-in-tanzania',
  seoTitle: 'Come Pianificare un Viaggio per Scalare il Monte Kilimangiaro | Guida di Riferimento Completa',
  seoDescription: "Tutto ciò di cui hai bisogno per pianificare un viaggio al Kilimangiaro: campeggi di montagna, tasse di parco, ghiacciai, dislivello per itinerario, rischi di altitudine e come arrivarci.",
  heading: 'Informazioni sulla Pianificazione di un Viaggio per Scalare il Monte Kilimangiaro in Tanzania',
  intro:
    "Pianificare un viaggio per scalare il Monte Kilimangiaro implica molto più che scegliere una data. Questa guida di riferimento copre l'essenziale: dove si trova la montagna, il suo costo in tasse ufficiali di parco, i campeggi dove dormirai lungo il percorso, i ghiacciai che vedrai vicino alla vetta, il dislivello di ogni itinerario, e i rischi reali che comporta — affinché tu possa pianificare con fiducia e scalare con Asili Climbing Kilimanjaro.",
  sections: [
    {
      heading: 'Dove si Trova il Monte Kilimangiaro?',
      body: 'Il Monte Kilimangiaro si trova nel nord della Tanzania, vicino al confine con il Kenya, all\'interno del parco nazionale del Kilimangiaro. Le città più vicine sono Moshi e Arusha, entrambe servite dall\'aeroporto internazionale del Kilimangiaro (JRO).',
    },
    {
      heading: 'Dislivello del Monte Kilimangiaro',
      body: "Il Monte Kilimangiaro è la montagna più alta d'Africa e la montagna indipendente più alta del mondo, con un dislivello di circa 4.900 metri dalla base alla vetta. La vetta della montagna, Uhuru Peak, culmina a 5.895 metri sopra il livello del mare. Il dislivello è notevole ed impegnativo, rendendo l'acclimatazione cruciale per gli scalatori per evitare il mal di montagna.",
      table: {
        columns: ['Itinerario', 'Altitudine di Partenza'],
        rows: [
          ['Northern Circuit', '2.100 m (6.890 piedi) a Lemosho Gate'],
          ['Route Lemosho', '2.100 m (6.890 piedi) a Lemosho Gate'],
          ['Route Shira', '3.414 m (11.200 piedi) a Morum Barrier'],
          ['Route Machame', '1.640 m (5.380 piedi) a Machame Gate'],
          ['Route Marangu', '1.843 m (6.047 piedi) a Marangu Gate'],
          ['Route Rongai', '1.950 m (6.398 piedi) a Rongai Gate'],
          ['Route Umbwe', '1.800 m (5.906 piedi) a Umbwe Gate'],
        ],
      },
    },
    {
      heading: 'Campeggi di Montagna sul Kilimangiaro',
      body: 'A seconda del tuo itinerario, trascorrerai la notte in una serie di rifugi o campeggi in tenda lungo la montagna. I campeggi comuni includono Mandara Hut, Horombo Hut, Kibo Hut, Machame Camp, Barafu Hut Camp, Lava Tower Camp, Barranco Hut Camp, Karanga Hut Camp, Mweka Camp, Shira 1 & 2 Camps, School Hut Camp e Umbwe Cave Camp, tra gli altri. La tua guida e il tuo team di portatori allestiscono il campo prima del tuo arrivo ogni giorno.',
    },
    {
      heading: 'I Ghiacciai in Ritirata del Monte Kilimangiaro',
      body: "Il Monte Kilimangiaro è rinomato per i suoi quattro celebri ghiacciai: il Northern Ice Field, l'Eastern Ice Field, il Southern Ice Field e il ghiacciaio Furtwängler. Questi ghiacciai esistono vicino all'equatore solo a causa dell'alta quota della montagna — ma si stanno ritirando rapidamente a causa del cambiamento climatico. Il solo ghiacciaio Furtwängler ha perso oltre l'80% della sua massa dall'inizio del XX secolo, e le stime attuali suggeriscono che i campi di ghiaccio del Kilimangiaro potrebbero scomparire completamente entro qualche decennio.",
    },
    {
      heading: 'Tasse del Parco Nazionale del Kilimangiaro',
      body: "Le tasse del parco nazionale del Kilimangiaro sono costi obbligatori per i visitatori che desiderano esplorare il parco e scalare la montagna. Queste tasse includono l'ingresso al parco, il campeggio, le tasse di soccorso e i servizi di guida e portatori, e variano generalmente da 2.000 $ a 6.000 $ a persona a seconda dell'itinerario e della durata.",
      table: {
        columns: ['Tipo di Tassa', 'Costo'],
        rows: [
          ['Tassa di soccorso', '20 $ (una tantum)'],
          ['Tassa di conservazione', '70 $ a persona al giorno'],
          ['Tassa di campeggio', '50 $ a persona a notte'],
          ['Tassa di rifugio (Route Marangu)', '60 $ a persona a notte'],
          ['Tassa di cratere', '100 $ a persona a notte'],
        ],
      },
    },
    {
      heading: 'Decessi sul Monte Kilimangiaro',
      body: "Nonostante la sua popolarità, la scalata del Kilimangiaro comporta un rischio reale: si stima che dai 3 ai 7 scalatori muoiano ogni anno, principalmente a causa del mal di montagna (mal acuto di montagna, che può evolvere in HAPE o HACE), ipotermia e cadute. La « zona della morte » indica le altitudini oltre circa 8.000 piedi dove la ridotta quantità di ossigeno rende la sopravvivenza sempre più difficile senza un'adeguata acclimatazione. Scegliere un itinerario più lungo, un operatore affidabile e seguire il ritmo della tua guida riduce notevolmente questo rischio.",
    },
    {heading: 'Dove si Trova il Monte Kilimangiaro?', body: 'Scopri la posizione della montagna sulla mappa qui sotto.'},
  ],
}

const kilimanjaroClimbingIt: GuideArticleIt = {
  slug: 'kilimanjaro-climbing',
  seoTitle: 'Scalare il Monte Kilimangiaro | Avventure su Misura',
  seoDescription: "Avventure di scalata del Kilimangiaro su misura. Scopri i nostri itinerari, pacchetti e tutto ciò che devi sapere prima di scalare la vetta più alta d'Africa.",
  heading: 'Scalare il Monte Kilimangiaro',
  heroImage: {src: '/images/articles/climbing-hero.jpg', alt: 'Escursionista sul sentiero del Kilimangiaro'},
  intro:
    "Il Kilimangiaro, che culmina a 5.895 metri, è la montagna indipendente più alta del mondo, il che gli vale il titolo di « Tetto dell'Africa ». Ogni anno, migliaia di avventurieri percorrono i suoi sentieri pittoreschi, scoprendo paesaggi variegati e viste mozzafiato. Non è richiesta alcuna competenza tecnica di arrampicata — solo buona salute, determinazione e il team giusto per guidarti. Da Asili Climbing Kilimanjaro, progettiamo avventure su misura per la scalata del Kilimangiaro dei tuoi sogni.",
  sections: [
    {
      heading: 'Itinerari di Scalata del Kilimangiaro',
      body:
        "Route Machame: conosciuta come la Whiskey Route, Machame è l'itinerario più popolare del Kilimangiaro, che offre paesaggi mozzafiato e terreno variegato. Sebbene impegnativa con sentieri ripidi e campeggi in tenda, offre un'eccellente acclimatazione per gli scalatori che cercano un trek più breve ma gratificante.\nRoute Lemosho: uno degli itinerari più pittoreschi del Kilimangiaro, Lemosho inizia dall'isolato Londorossi Gate, attraversando lo splendido altopiano di Shira. Questo itinerario offre una scalata tranquilla con viste spettacolari, una ricca fauna selvatica e una salita graduale per un'esperienza confortevole.\nRoute Rongai: unico itinerario nordico del Kilimangiaro, Rongai è meno frequentato e più dolce, il che lo rende una scelta eccellente per chi preferisce una scalata calma e regolare. Questo itinerario è ideale durante la stagione delle piogge poiché riceve meno precipitazioni.\nRoute Northern Circuit: l'itinerario più lungo e pittoresco, il Northern Circuit offre la migliore acclimatazione circumnavigando gradualmente il Kilimangiaro. Con viste panoramiche e un alto tasso di successo, questo itinerario offre un'esperienza di trekking tranquilla e immersiva.",
    },
    {
      heading: 'Pacchetti di Scalata del Kilimangiaro',
      body:
        "Scegli tra i nostri pacchetti di scalata del Kilimangiaro accuratamente progettati, ciascuno pensato per offrire la migliore esperienza in base alle tue preferenze, al tuo livello di forma fisica e all'itinerario desiderato. Che tu cerchi una scalata rapida o un trek prolungato e panoramico, abbiamo l'itinerario perfetto per te.\nRoute Lemosho 8 Giorni: con otto giorni di viaggio, il tuo trek del Kilimangiaro sulla route Lemosho dura più a lungo delle alternative, permettendo un'eccellente acclimatazione.\nRoute Machame 7 Giorni: la celebre route Machame con un tempo di viaggio totale di sette giorni, offrendoti ancora più tempo di acclimatazione.\nRoute Marangu 6 Giorni: un viaggio di sei giorni per scalare la vetta più alta d'Africa attraverso la celebre route Marangu, con pernottamento in rifugi e una varietà di paesaggi.\nRoute Umbwe 6 Giorni: rinomata per la sua scalata difficile e ripida e il suo splendido sentiero meno frequentato.\nNorthern Circuit 9 Giorni: l'itinerario più recente e più lungo, che offre viste a 360 gradi e i migliori tassi di successo per raggiungere la vetta.\nRoute Rongai 7 Giorni: affrontata da nord, questa route offre una prospettiva unica del Kilimangiaro ed è perfetta per chi cerca un trek più tranquillo.",
    },
    {
      heading: 'Cosa Sapere Prima di Scalare il Kilimangiaro',
      body:
        "Ottieni tutte le informazioni essenziali per prepararti alla tua scalata — dagli itinerari ai consigli di sicurezza, per una scalata fluida e riuscita.\nConsiderazioni sulla temperatura: le temperature diurne variano da 20°C a 27°C a bassa quota, ma scendono sotto zero ad alta quota, soprattutto di notte. Abbigliamento a strati è essenziale.\nVegetazione e paesaggi: le stagioni secche offrono viste più limpide, fiori selvatici in fiore e foreste rigogliose lungo i sentieri. Le stagioni più umide possono comportare condizioni nebbiose e una densa copertura nuvolosa.\nLivelli di affluenza: le alte stagioni (gennaio-febbraio e luglio-settembre) attirano più scalatori. Le stagioni intermedie (fine marzo-maggio e inizio novembre-dicembre) offrono esperienze più tranquille.\nPreferenze personali e obiettivi: gli scalatori devono considerare le condizioni meteorologiche, le proprie preferenze di temperatura, il livello di affluenza e i propri impegni personali nella pianificazione della scalata.",
    },
    {
      heading: 'Pronto ad Affrontare la Sfida del Kilimangiaro?',
      body: 'Il tuo viaggio verso il Tetto dell\'Africa inizia qui. Che tu miri all\'avventura di una vita o che tu voglia spingerti oltre i tuoi limiti fino alla vetta, siamo qui per guidarti in ogni fase.',
    },
  ],
  faqHeading: 'Le Tue Domande e le Nostre Risposte',
  faqs: [
    {
      question: 'Quali itinerari sono disponibili per il Kilimangiaro?',
      answer:
        'Il Monte Kilimangiaro offre diversi itinerari adatti a scalatori di ogni livello, preferenza e stile di trekking. Da Asili Climbing Kilimanjaro, siamo specializzati nei quattro itinerari più popolari: Rongai, Lemosho, Northern Circuit e Machame. Le nostre scalate guidate garantiscono sicurezza, un\'adeguata acclimatazione e un viaggio indimenticabile fino alla vetta.',
    },
    {question: 'Quale itinerario del Kilimangiaro è il meno frequentato?', answer: 'La Northern Circuit Route è la meno frequentata, e offre un\'esperienza di trekking tranquilla e isolata.'},
    {question: 'Qual è l\'itinerario più facile per scalare il Kilimangiaro?', answer: 'La Rongai Route è considerata la più facile grazie alle sue pendenze graduali e alla sua salita diretta.'},
    {question: 'Quale itinerario del Kilimangiaro è il più panoramico?', answer: 'La Lemosho Route è spesso considerata la più panoramica, con paesaggi mozzafiato, ecosistemi variegati e viste panoramiche.'},
    {
      question: 'Quanto costa scalare il Kilimangiaro?',
      answer:
        'Il costo della scalata del Kilimangiaro varia da 2.500 $ a 4.000 $, a seconda della scelta dell\'itinerario, della durata, delle dimensioni del gruppo, del livello di servizio e delle prestazioni incluse. Da Asili Climbing Kilimanjaro, garantiamo guide ben addestrate, elevati standard di sicurezza e un\'esperienza complessiva eccezionale.',
    },
    {question: 'Quanto tempo ci vuole per scalare il Monte Kilimangiaro?', answer: 'La scalata richiede generalmente dai 6 ai 9 giorni, a seconda dell\'itinerario scelto. Un itinerario più lungo consente una migliore acclimatazione, aumentando le probabilità di un\'esperienza di vetta riuscita e piacevole.'},
    {
      question: 'I principianti possono scalare il Monte Kilimangiaro?',
      answer:
        'Sì! Sebbene non sia richiesta alcuna competenza tecnica di arrampicata, i principianti devono seguire un allenamento fisico adeguato prima di tentare la scalata. Le nostre guide esperte assicurano che gli scalatori principianti ricevano il supporto necessario durante tutto il viaggio.',
    },
    {question: 'Qual è il periodo migliore per scalare il Monte Kilimangiaro?', answer: 'Le migliori stagioni per la scalata sono i mesi secchi: da gennaio a marzo e da giugno a ottobre, che offrono le migliori condizioni meteorologiche e un cielo più limpido.'},
    {
      question: 'Consigli importanti per il successo della tua scalata',
      answer:
        'Vai piano — un ritmo costante riduce il rischio di mal di montagna. Idratati — bevi molta acqua. Procurati l\'attrezzatura giusta — strati adeguati, scarpe robuste e attrezzatura di qualità. Preparati fisicamente e mentalmente. Divertiti e crea legami — legare con altri scalatori rende il viaggio più arricchente.',
    },
    {question: 'Serve una guida per scalare il Kilimangiaro?', answer: 'Sì! Scalare il Kilimangiaro senza una guida autorizzata non è consentito.'},
    {question: 'Perché ho bisogno di una guida?', answer: 'Le guide apportano la loro competenza, monitorano la tua salute, garantiscono la tua sicurezza e ti aiutano a muoverti nel terreno impegnativo del Kilimangiaro.'},
    {question: 'Gli scalatori esperti possono fare a meno di una guida?', answer: 'Anche gli scalatori esperti devono essere accompagnati da una guida. L\'alta quota e le condizioni imprevedibili rendono indispensabile un accompagnamento professionale.'},
    {question: 'Come migliorano la sicurezza le guide?', answer: 'Le guide monitorano l\'acclimatazione, prestano il primo soccorso, valutano le condizioni meteorologiche e prendono decisioni critiche per il successo della scalata.'},
    {
      question: 'Qual è il livello di difficoltà per scalare il Monte Kilimangiaro?',
      answer:
        'Scalare il Monte Kilimangiaro è un\'avventura impegnativa ma gratificante. La difficoltà principale deriva dall\'alta quota e dal terreno variegato. Con una buona preparazione e una guida esperta, scalatori di diversi livelli di esperienza possono raggiungere la vetta con successo.',
    },
    {
      question: 'Come si dorme sul Kilimangiaro?',
      answer:
        'Durante il tuo trek al Kilimangiaro con noi, alloggerai in tende di alta qualità, resistenti alle intemperie e progettate per il comfort in condizioni estreme, con tende spaziose, materassini isolanti e sacchi a pelo caldi.',
    },
    {
      question: 'Serve ossigeno per scalare il Kilimangiaro?',
      answer: "La maggior parte degli scalatori non ha bisogno di ossigeno supplementare. La chiave per una scalata riuscita è una buona acclimatazione. In rari casi di grave mal di montagna, l'ossigeno è disponibile come misura di sicurezza.",
    },
  ],
}

async function run() {
  await seedGuideArticleIt(kilimanjaroClimbingSeasonsIt)
  await seedGuideArticleIt(whatIsTheBestRouteUpKilimanjaroIt)
  await seedGuideArticleIt(kilimanjaroGuideCostIt)
  await seedGuideArticleIt(kilimanjaroClimbingGuideIt)
  await seedGuideArticleIt(planATripToClimbKilimanjaroIt)
  await seedGuideArticleIt(kilimanjaroClimbingIt)
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
