/**
 * Phase 6 (Italian): the 3 legal standardPage docs (privacy-policy,
 * terms-and-conditions, cookies-policy). why-travel-with-us was already
 * seeded in seed-it-bespoke-pages.ts's seedSafariToursIt (mirrors the FR
 * split, where why-travel-with-us was in seed-fr-pilot.ts).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-legal.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, bulletBlock} from './lib/pt'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface ItBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: string[]
}

interface ItLegalPage {
  slug: string
  seoTitle: string
  seoDescription: string
  pageTitle: string
  intro: string
  sections: {heading: string; blocks: ItBlock[]}[]
}

const pages: ItLegalPage[] = [
  {
    slug: 'privacy-policy',
    seoTitle: 'Informativa sulla Privacy | Asili Climbing Kilimanjaro',
    seoDescription:
      "Consulta l'informativa sulla privacy di Climbing Kilimanjaro Tanzania per sapere come raccogliamo, utilizziamo, conserviamo e proteggiamo le tue informazioni personali.",
    pageTitle: 'Informativa sulla Privacy',
    intro:
      "Presso Climbing Kilimanjaro Tanzania, la tua privacy è importante per noi. Questa informativa sulla privacy spiega come raccogliamo, utilizziamo, conserviamo e proteggiamo le tue informazioni personali quando interagisci con il nostro sito web o i nostri servizi.",
    sections: [
      {
        heading: 'Quali Informazioni Raccogliamo',
        blocks: [
          {type: 'paragraph', text: 'Possiamo raccogliere i seguenti tipi di informazioni personali:'},
          {
            type: 'list',
            items: [
              'Dati personali: nome, indirizzo email, numero di telefono, nazionalità, informazioni sul passaporto (per le prenotazioni).',
              'Informazioni di prenotazione: date di viaggio, preferenze di alloggio, esigenze alimentari, contatti di emergenza.',
              'Informazioni di pagamento: indirizzo di fatturazione e metodo di pagamento (Nota: non conserviamo i dati della carta di credito).',
              'Dati di utilizzo del sito: indirizzo IP, tipo di browser, pagine visitate e altri dati analitici.',
            ],
          },
        ],
      },
      {
        heading: 'Come Utilizziamo le Tue Informazioni',
        blocks: [
          {type: 'paragraph', text: 'Utilizziamo le tue informazioni per i seguenti scopi:'},
          {
            type: 'list',
            items: [
              'Rispondere alle richieste di informazioni',
              'Elaborare e gestire la tua prenotazione',
              'Personalizzare la tua esperienza e consigliare itinerari adatti',
              'Migliorare il nostro sito web e i nostri servizi',
              'Rispettare i nostri obblighi legali',
            ],
          },
          {
            type: 'paragraph',
            text: 'Non venderemo, affitteremo né condivideremo mai i tuoi dati personali con terze parti a fini di marketing.',
          },
        ],
      },
      {
        heading: 'Chi ha Accesso ai Tuoi Dati',
        blocks: [
          {
            type: 'paragraph',
            text: "Solo i membri autorizzati del personale di Climbing Kilimanjaro e i fornitori di fiducia (come lodge safari, hotel o compagnie di trasporto) coinvolti nell'organizzazione del tuo tour avranno accesso ai tuoi dati personali. Questi fornitori sono tenuti a mantenere le tue informazioni sicure e riservate.",
          },
        ],
      },
      {
        heading: 'Cookie e Tracciamento',
        blocks: [
          {type: 'paragraph', text: 'Il nostro sito web utilizza cookie per:'},
          {
            type: 'list',
            items: [
              'Ricordare le tue preferenze',
              'Capire come gli utenti interagiscono con i nostri contenuti',
              'Migliorare le prestazioni e le funzionalità del sito',
            ],
          },
          {
            type: 'paragraph',
            text: 'Puoi regolare le impostazioni dei cookie o disattivarli completamente tramite le impostazioni del tuo browser.',
          },
        ],
      },
      {
        heading: 'Sicurezza dei Dati',
        blocks: [
          {
            type: 'paragraph',
            text: "Adottiamo tutte le misure ragionevoli per proteggere le tue informazioni personali utilizzando server sicuri, strumenti di crittografia e accesso limitato. Sebbene seguiamo le migliori pratiche, ti preghiamo di notare che nessun metodo di trasmissione dei dati su Internet è sicuro al 100%.",
          },
        ],
      },
      {
        heading: 'I Tuoi Diritti',
        blocks: [
          {type: 'paragraph', text: 'Hai il diritto di:'},
          {
            type: 'list',
            items: [
              'Accedere ai dati personali che deteniamo su di te',
              'Richiedere correzioni o aggiornamenti',
              'Ritirare il tuo consenso o richiedere la cancellazione dei tuoi dati',
              'Presentare un reclamo a un\'autorità di protezione dei dati, se necessario',
            ],
          },
          {type: 'paragraph', text: 'Per esercitare i tuoi diritti, ti preghiamo di contattarci.'},
        ],
      },
      {
        heading: 'Link a Terze Parti',
        blocks: [
          {
            type: 'paragraph',
            text: 'Il nostro sito web può contenere link a siti esterni. Non siamo responsabili delle pratiche sulla privacy o dei contenuti di questi siti di terze parti.',
          },
        ],
      },
      {
        heading: 'Modifiche a Questa Informativa',
        blocks: [
          {
            type: 'paragraph',
            text: 'Potremmo aggiornare questa informativa sulla privacy di tanto in tanto. Qualsiasi modifica sarà pubblicata su questa pagina con una « data di entrata in vigore » aggiornata. Ti invitiamo a consultare regolarmente questa informativa per rimanere aggiornato.',
          },
        ],
      },
      {
        heading: 'Contattaci',
        blocks: [
          {
            type: 'paragraph',
            text: 'Se hai domande o preoccupazioni riguardo alla nostra informativa sulla privacy o al modo in cui i tuoi dati vengono trattati, ti preghiamo di contattarci.',
          },
          {type: 'paragraph', text: 'Telefono: +255 767 140 150. Sede: Arusha, Tanzania.'},
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    seoTitle: 'Termini e Condizioni | Asili Climbing Kilimanjaro',
    seoDescription:
      'Consulta i termini e condizioni applicabili a tutti i trekking, safari e pacchetti combinati di Asili Climbing Kilimanjaro.',
    pageTitle: 'Termini e Condizioni',
    intro:
      "Prenotando un viaggio con Asili Climbing Kilimanjaro, accetti i termini e condizioni descritti di seguito. Questi termini si applicano a tutti i nostri trekking, safari e pacchetti combinati.",
    sections: [
      {
        heading: '1. Prenotazione e Conferma',
        blocks: [
          {
            type: 'list',
            items: [
              'Una prenotazione è confermata solo dopo il ricevimento di un acconto e di una conferma scritta da Asili Climbing Kilimanjaro.',
              'Tutti i viaggiatori devono fornire informazioni personali accurate, incluso il nome completo (come riportato sul passaporto), le date di viaggio ed eventuali esigenze mediche o alimentari.',
              'Prenotare a nome di un gruppo implica che accetti la responsabilità di tutti i membri del gruppo.',
            ],
          },
        ],
      },
      {
        heading: '2. Pagamenti',
        blocks: [
          {
            type: 'list',
            items: [
              'È richiesto un acconto del 30% al momento della prenotazione.',
              'Il saldo deve essere versato almeno 30 giorni prima dell\'inizio del viaggio.',
              'I pagamenti possono essere effettuati tramite bonifico bancario, carta di credito o altri metodi sicuri (potrebbero essere applicate delle commissioni).',
              'Qualsiasi ritardo nel pagamento può comportare l\'annullamento senza rimborso.',
            ],
          },
        ],
      },
      {
        heading: '3. Cancellazioni e Rimborsi',
        blocks: [
          {type: 'paragraph', text: 'Da parte del cliente:'},
          {
            type: 'list',
            items: [
              '60 giorni o più prima della partenza: rimborso del 90%',
              'Da 30 a 59 giorni prima della partenza: rimborso del 50%',
              'Meno di 30 giorni: nessun rimborso',
            ],
          },
          {type: 'paragraph', text: 'Da parte di Asili Climbing Kilimanjaro:'},
          {
            type: 'list',
            items: [
              'Ci riserviamo il diritto di annullare qualsiasi viaggio per motivi di sicurezza, meteorologici o per eventi imprevisti. In tal caso, riceverai un rimborso completo o ti verrà proposta una data alternativa.',
            ],
          },
        ],
      },
      {
        heading: '4. Modifiche',
        blocks: [
          {
            type: 'list',
            items: [
              'Le modifiche al viaggio richieste dal cliente possono essere possibili in base alla disponibilità e potrebbero comportare costi aggiuntivi.',
              'I cambi di nome sono consentiti fino a 15 giorni prima del viaggio.',
              'Asili Climbing Kilimanjaro si riserva il diritto di apportare modifiche minori all\'itinerario in base alle condizioni locali.',
            ],
          },
        ],
      },
      {
        heading: '5. Assicurazione di Viaggio',
        blocks: [
          {
            type: 'list',
            items: [
              'Tutti i partecipanti devono disporre di un\'assicurazione di viaggio valida che copra il trekking in alta quota (per il Kilimangiaro)',
              "L'evacuazione di emergenza",
              'Le spese mediche',
              "L'annullamento e l'interruzione del viaggio",
            ],
          },
          {type: 'paragraph', text: "Una prova dell'assicurazione può essere richiesta prima dell'inizio del viaggio."},
        ],
      },
      {
        heading: '6. Requisiti di Salute e Forma Fisica',
        blocks: [
          {
            type: 'list',
            items: [
              'Scalare il Kilimangiaro e partire per un safari richiede una preparazione fisica e mentale.',
              'I partecipanti devono dichiarare qualsiasi condizione medica preesistente.',
              'Asili Climbing Kilimanjaro non è responsabile per problemi medici che si verificano durante il viaggio.',
            ],
          },
        ],
      },
      {
        heading: '7. Visti e Requisiti di Ingresso',
        blocks: [
          {
            type: 'list',
            items: [
              'È responsabilità del viaggiatore ottenere un visto tanzaniano valido prima dell\'arrivo.',
              'I passaporti devono essere validi per almeno sei (6) mesi dalla data del viaggio.',
            ],
          },
        ],
      },
      {
        heading: '8. Responsabilità',
        blocks: [
          {
            type: 'list',
            items: [
              "Ci impegniamo a garantire la tua sicurezza, ma la partecipazione a un viaggio d'avventura comporta rischi intrinseci.",
              'Asili Climbing Kilimanjaro non è responsabile per la perdita o il danneggiamento di beni personali',
              'Lesioni o malattie',
              'Ritardi o modifiche causati dal meteo, problemi di volo o decisioni governative',
            ],
          },
          {
            type: 'paragraph',
            text: 'Ci impegniamo tuttavia ad agire in modo professionale e a minimizzare i rischi quanto più possibile.',
          },
        ],
      },
      {
        heading: '9. Comportamento e Condotta',
        blocks: [
          {
            type: 'list',
            items: [
              'Ci si aspetta rispetto per le guide, il personale, le comunità locali e gli altri viaggiatori.',
              "Qualsiasi comportamento ritenuto pericoloso o offensivo può comportare l'esclusione dal viaggio senza rimborso.",
            ],
          },
        ],
      },
      {
        heading: '10. Uso di Foto e Testimonianze',
        blocks: [
          {
            type: 'list',
            items: [
              'Possiamo utilizzare foto e recensioni condivise dai clienti a fini promozionali, salvo diversa richiesta scritta da parte tua.',
            ],
          },
        ],
      },
      {
        heading: '11. Legge Applicabile',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutti i presenti termini sono regolati dalla legge tanzaniana. Qualsiasi controversia sarà risolta presso i tribunali locali di Arusha, in Tanzania.',
          },
        ],
      },
      {
        heading: '12. Contatti',
        blocks: [
          {type: 'paragraph', text: 'Per qualsiasi domanda riguardante questi termini, contattaci:'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. Email: info@asiliclimbingkilimanjaro.com. Telefono: +255 767 140 150. Sede: Arusha, Tanzania.',
          },
        ],
      },
    ],
  },
  {
    slug: 'cookies-policy',
    seoTitle: 'Politica sui Cookie | Asili Climbing Kilimanjaro',
    seoDescription:
      'Scopri come Asili Climbing Kilimanjaro utilizza i cookie e le tecnologie simili durante la tua visita sul nostro sito web.',
    pageTitle: 'Politica sui Cookie',
    intro:
      "Questa politica sui cookie spiega come Asili Climbing Kilimanjaro utilizza i cookie e le tecnologie simili durante la tua visita sul nostro sito web. Continuando a navigare sul nostro sito, accetti il nostro utilizzo dei cookie come descritto di seguito.",
    sections: [
      {
        heading: '1. Cosa Sono i Cookie?',
        blocks: [
          {
            type: 'paragraph',
            text: 'I cookie sono piccoli file di testo posizionati sul tuo dispositivo (computer, tablet o smartphone) quando visiti un sito web. Aiutano i siti web a funzionare correttamente, migliorano l\'esperienza utente e raccolgono dati utili per le prestazioni del sito e il marketing.',
          },
        ],
      },
      {
        heading: '2. Come Utilizziamo i Cookie',
        blocks: [
          {type: 'paragraph', text: 'Utilizziamo i cookie per:'},
          {
            type: 'list',
            items: [
              'Ricordare le tue preferenze e impostazioni',
              'Migliorare la velocità e le prestazioni del sito',
              'Analizzare come i visitatori interagiscono con i nostri contenuti',
              'Abilitare le funzionalità di prenotazione',
              'Mostrare pubblicità e contenuti pertinenti in base ai tuoi interessi (se applicabile)',
            ],
          },
        ],
      },
      {
        heading: '3. Tipi di Cookie che Utilizziamo',
        blocks: [
          {
            type: 'list',
            items: [
              'Cookie essenziali — necessari per il funzionamento di base del sito, come la navigazione e l\'accesso alle aree protette.',
              'Cookie di prestazione e analisi — ci aiutano a capire come i visitatori utilizzano il nostro sito (pagine visitate, tempo trascorso, tasso di rimbalzo) per migliorare l\'esperienza utente.',
              'Cookie di funzionalità — ricordano le scelte che hai fatto, come la lingua o la regione, per offrire un\'esperienza più personalizzata.',
              'Cookie pubblicitari (se applicabile) — possono essere utilizzati per mostrarti pubblicità pertinenti su piattaforme come Google o Facebook. Puoi rifiutare la pubblicità mirata in qualsiasi momento.',
            ],
          },
        ],
      },
      {
        heading: '4. Cookie di Terze Parti',
        blocks: [
          {type: 'paragraph', text: 'Possiamo utilizzare strumenti di terze parti affidabili come:'},
          {
            type: 'list',
            items: [
              "Google Analytics (per monitorare l'utilizzo del sito)",
              'Facebook Pixel (per il marketing e le prestazioni pubblicitarie)',
              'I widget TripAdvisor o Booking (per mostrare recensioni o disponibilità)',
            ],
          },
          {
            type: 'paragraph',
            text: 'Questi servizi possono posizionare i propri cookie sul tuo dispositivo. Ti invitiamo a consultare le rispettive politiche per maggiori dettagli.',
          },
        ],
      },
      {
        heading: '5. Gestire e Controllare i Cookie',
        blocks: [
          {type: 'paragraph', text: 'Puoi controllare i cookie tramite le impostazioni del tuo browser. La maggior parte dei browser ti consente di:'},
          {
            type: 'list',
            items: [
              'Consultare ed eliminare i cookie esistenti',
              'Bloccare i cookie di terze parti',
              'Impostare preferenze per siti specifici',
              'Disattivare tutti i cookie (non consigliato, poiché ciò può influire sul funzionamento del sito)',
            ],
          },
        ],
      },
      {
        heading: '6. Aggiornamenti a Questa Politica',
        blocks: [
          {
            type: 'paragraph',
            text: 'Potremmo aggiornare questa politica sui cookie se necessario. Le modifiche saranno pubblicate su questa pagina con una nuova data di entrata in vigore.',
          },
        ],
      },
      {
        heading: '7. Contattaci',
        blocks: [
          {type: 'paragraph', text: 'Se hai domande o preoccupazioni riguardo al nostro utilizzo dei cookie, ti preghiamo di contattare:'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. Email: info@asiliclimbingkilimanjaro.com. Telefono: +255 767 140 150. Sede: Arusha, Tanzania.',
          },
        ],
      },
    ],
  },
]

async function run() {
  for (const page of pages) {
    const enId = await findEnId(client, 'standardPage', page.slug)
    if (!enId) {
      console.log(`SKIP ${page.slug}: no en source found`)
      continue
    }
    const fields = {
      seo: {_type: 'seo', title: page.seoTitle, description: page.seoDescription},
      hero: {heading: page.pageTitle},
      intro: page.intro,
      sections: page.sections.map((section) => ({
        _type: 'pageSection',
        _key: key(),
        heading: section.heading,
        body: section.blocks.flatMap((block) =>
          block.type === 'paragraph' ? [paragraphBlock(block.text as string)] : (block.items as string[]).map(bulletBlock),
        ),
      })),
    }
    const itId = await upsertTranslatedDoc(client, 'standardPage', page.slug, 'it', fields)
    await linkTranslationMetadata(client, 'standardPage', [
      {language: 'en', id: enId},
      {language: 'it', id: itId},
    ])
    console.log(`${page.slug}-it done (${itId})`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
