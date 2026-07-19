/**
 * Phase 6 (Italian): the 6 `route` documents (Machame, Marangu, Lemosho,
 * Rongai, Umbwe, Northern Circuit) plus the routesHubPage singleton.
 * Mirrors seed-fr-routes.ts's field construction but with Italian text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-routes.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

const arrivalStopIt = {
  label: 'Arrivo e Briefing',
  meta: ['🏨 Classico: Ameg Lodge | Premium: Kaliwa Lodge'],
  body: [
    "Al tuo arrivo all'aeroporto internazionale del Kilimangiaro, sarai trasferito al tuo alloggio, dove la tua guida effettuerà un briefing completo e un controllo dell'attrezzatura per prepararti all'avventura che ti aspetta.",
  ],
}
const departureStopIt = {
  label: 'Partenza o Prosecuzione del Viaggio',
  body: ["🚗 Trasferimento all'aeroporto internazionale del Kilimangiaro per il tuo volo di ritorno, oppure continua la tua avventura tanzaniana!"],
}

interface RouteInfoBlockIt {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  pricingTable?: {columns: string[]; rows: {label: string; values: string[]}[]}
}
interface RouteIt {
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
  tabs: {id: string; label: string; blocks: RouteInfoBlockIt[]}[]
  secondaryHeading: string
  secondaryTagline: string
  faqHeading: string
  faqs: {number: number; question: string; answer: string}[]
}

const machame: RouteIt = {
  slug: 'machame-route',
  name: 'Route Machame',
  seoTitle: 'Route Machame | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Scopri la Route Machame, l\'itinerario di scalata più popolare del Kilimangiaro, conosciuto come Whiskey Route. Itinerario giorno per giorno reale, tariffe e consigli di esperti.',
  heroHeading: 'Scopri la Route Machame del Kilimangiaro',
  heroTagline: 'L\'itinerario più popolare verso la vetta del Kilimangiaro',
  heroBody: [
    'Soprannominata la Whiskey Route, la Route Machame è l\'itinerario di scalata più popolare del Kilimangiaro, scelto da quasi la metà degli escursionisti ogni anno.',
    'Questo itinerario pittoresco affronta il Monte Kilimangiaro da sud, scalando i versanti meridionali mozzafiato prima di ridiscendere tramite la Route Mweka. Lungo il percorso, gli scalatori vengono ricompensati con alcuni dei tramonti e albe più spettacolari del Kilimangiaro.',
    'Estendendosi per 62 km, l\'itinerario viene generalmente percorso in sei giorni, sebbene un itinerario di sette giorni sia vivamente consigliato per una migliore acclimatazione — aumentando notevolmente i tassi di successo in vetta.',
    'Per chi cerca un\'avventura indimenticabile con un terreno impegnativo ma gratificante, la Route Machame è un\'ottima scelta.',
  ],
  heroImage: {src: '/images/routes/machame/hero.webp', alt: 'Escursionisti che camminano verso il Monte Kilimangiaro sulla Route Machame'},
  itineraryHeading: 'Itinerario della Route Machame',
  itinerarySubheading: 'Senza il whisky – Un diario di viaggio giorno per giorno',
  daysLabel: '7 Giorni',
  stops: [
    arrivalStopIt,
    {
      label: 'Giorno di Trekking 1 - Da Machame Gate a Machame Camp',
      meta: ['📍 Machame Gate (1.800 m/5.900 piedi) → Machame Camp (3.000 m/9.800 piedi)', '📈 Dislivello positivo: 1.200 m / 3.900 piedi', '⏳ Durata: 6-7 ore'],
      body: [
        "Il tuo viaggio inizia con un tragitto di 45 minuti da Moshi a Machame Gate. Dopo la registrazione, il trekking inizia lungo un sentiero tortuoso attraverso una foresta pluviale lussureggiante, la zona più umida della montagna. Aspettati acquazzoni occasionali nel pomeriggio, che rendono il sentiero a volte scivoloso.",
        'La salita si addolcisce progressivamente man mano che ci si avvicina a Machame Camp, situato nella zona di transizione tra la foresta e le zone di erica gigante.',
      ],
    },
    {
      label: 'Giorno di Trekking 2 - Da Machame Camp a Shira Camp',
      meta: ['📍 Machame Camp (3.000 m/9.800 piedi) → Shira Camp (3.840 m/12.600 piedi)', '📈 Dislivello positivo: 840 m / 2.800 piedi', '⏳ Durata: 5-6 ore'],
      body: [
        'La giornata inizia con una salita ripida lungo una cresta, che conduce a Picnic Rock, un punto panoramico fantastico che domina il Kibo e il bordo frastagliato del plateau dello Shira.',
        'Il sentiero si appiana poi attraversando il plateau dello Shira, il terzo dei coni vulcanici del Kilimangiaro, prima di arrivare a Shira Camp, dove potrai goderti splendidi panorami montani.',
      ],
    },
    {
      label: 'Giorno di Trekking 3 - Da Shira Camp a Barranco Camp via Lava Tower',
      meta: [
        '📍 Shira Camp (3.840 m/12.600 piedi) → Lava Tower (4.550 m/14.900 piedi) → Barranco Camp (3.850 m/12.650 piedi)',
        '📈 Dislivello positivo: 710 m / 2.300 piedi',
        '📉 Dislivello negativo: 700 m / 2.250 piedi',
        '⏳ Durata: 6-7 ore',
      ],
      body: [
        "Una giornata di acclimatazione impegnativa ma cruciale, attraverserai un terreno desertico d'alta quota verso la Lava Tower, un pinnacolo vulcanico alto 90 metri che offre incredibili viste panoramiche.",
        'Dopo pranzo, scendi nella valle di Barranco, che ospita gli unici senecio giganti. Questa discesa prepara il tuo corpo alla scalata del sommet in alta quota che ti aspetta. Barranco Camp si trova in una valle pittoresca e riparata, ai piedi della famosa Barranco Wall.',
      ],
    },
    {
      label: 'Giorno di Trekking 4 - Da Barranco Camp a Karanga Camp via la Barranco Wall',
      meta: [
        '📍 Barranco Camp (3.850 m/12.600 piedi) → Barranco Wall (4.200 m/13.800 piedi) → Karanga Camp (3.950 m/13.000 piedi)',
        '📈 Dislivello positivo: 350 m / 1.150 piedi',
        '📉 Dislivello negativo: 250 m / 820 piedi',
        '⏳ Durata: 3-4 ore',
      ],
      body: [
        "Inizia la giornata affrontando l'imponente Barranco Wall, una scalata entusiasmante che ti ricompensa con viste mozzafiato.",
        'Dopo aver raggiunto la cima a 4.200 m, segui un sentiero pittoresco e ondulato intorno al fianco della montagna, con il Monte Meru visibile alla tua destra e il Kibo che si erge alla tua sinistra.',
        'Una discesa nella valle di Karanga è seguita da una salita breve ma ripida fino a Karanga Camp, la tua tappa per la notte.',
      ],
    },
    {
      label: 'Giorno di Trekking 5 - Da Karanga Camp a Barafu Camp',
      meta: ['📍 Karanga Camp (3.950 m/13.000 piedi) → Barafu Camp (4.600 m/15.100 piedi)', '📈 Dislivello positivo: 650 m / 2.150 piedi', '⏳ Durata: 3-4 ore'],
      body: [
        "Una salita costante al mattino conduce a Barafu Camp, che significa « ghiaccio » in swahili. Questo campo d'alta quota si trova su una cresta sotto il cono sommitale e segna il completamento del circuito sud del Kilimangiaro, offrendo viste spettacolari sulla vetta da più angolazioni.",
        'Arriverai in tempo per un riposo pomeridiano e una cena anticipata per prepararti alla notte del sommet.',
      ],
    },
    {
      label: 'Giorno di Trekking 6 - Da Barafu Camp a Uhuru Peak poi Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.600 m/15.100 piedi) → Uhuru Peak (5.895 m/19.300 piedi) → Mweka Camp (3.110 m/10.200 piedi)',
        '📈 Dislivello positivo: 1.295 m / 4.200 piedi',
        '📉 Dislivello negativo: 2.785 m / 9.100 piedi',
        '⏳ Ascesa verso la vetta: 6-8 ore',
        '⏳ Discesa: 6 ore',
      ],
      body: [
        "A mezzanotte inizia la tua ascesa finale verso la vetta. Il sentiero è ripido ed impegnativo, con temperature ben sotto lo zero. All'alba, il magnifico sorgere del sole rosso dietro il picco Mawenzi ti terrà motivato.",
        "Raggiungendo Stella Point (5.750 m), camminerai lungo il bordo del cratere prima di arrivare a Uhuru Peak (5.895 m), il punto più alto d'Africa!",
        'Dopo aver festeggiato in vetta, inizia la lunga discesa verso Mweka Camp, attraversando un terreno vario e facendo una pausa pranzo lungo il percorso. Questa sera gusterai la tua ultima cena sulla montagna.',
      ],
    },
    {
      label: 'Giorno di Trekking 7 - Da Mweka Camp a Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m/10.200 piedi) → Mweka Gate (1.830 m/6.000 piedi)', '📉 Dislivello negativo: 1.280 m / 4.220 piedi', '⏳ Durata: 2-3 ore'],
      body: [
        'La discesa finale ti porta attraverso una foresta pluviale lussureggiante, con la possibilità di avvistare scimmie giocose lungo il percorso.',
        'A Mweka Gate, riceverai i tuoi certificati di vetta, e dal villaggio di Mweka sarai trasferito al tuo hotel a Moshi.',
      ],
    },
    departureStopIt,
  ],
  infoTabsHeading: 'Perché Scegliere Machame?',
  tabs: [
    {
      id: 'duration',
      label: 'Durata del Viaggio',
      blocks: [
        {
          heading: 'Quali sono i vantaggi di scegliere la Route Machame?',
          paragraphs: [
            'La Route Machame del Kilimangiaro si distingue per i suoi paesaggi mozzafiato e gli alti tassi di successo. Se cerchi una sfida pittoresca e gratificante, questo itinerario offre:',
            'I nostri pacchetti di scalata del Kilimangiaro per la Route Machame sono progettati per massimizzare l\'acclimatazione e la sicurezza complessiva.',
          ],
          bullets: [
            'Terreni variegati – Da foreste pluviali lussureggianti a deserti alpini e ghiacciai.',
            'Punti di riferimento pittoreschi – L\'itinerario presenta punti salienti magnifici come il plateau dello Shira e l\'iconica Barranco Wall.',
            'Ottima acclimatazione – La strategia « salire in alto, dormire in basso » riduce al minimo i rischi di mal di montagna.',
            'Alto tasso di successo in vetta – Con un itinerario ben ritmato, gli scalatori si adattano meglio, aumentando le loro possibilità di raggiungere Uhuru Peak.',
          ],
        },
        {
          heading: 'Quanto tempo ci vuole per percorrere la Route Machame?',
          paragraphs: [
            'Sebbene la distanza della Route Machame possa essere percorsa in 6 giorni, raccomandiamo vivamente l\'itinerario di 7 giorni per una scalata più confortevole e di successo. 🕒 Perché scegliere 7 giorni?',
            '📌 Consiglio speciale: per una guida dettagliata sulla durata ideale dell\'itinerario del Kilimangiaro, consulta il nostro approfondito articolo del blog.',
          ],
          bullets: [
            'Tempo extra = migliore acclimatazione e rischio ridotto di mal di montagna.',
            'Ti permette di goderti i paesaggi a un ritmo confortevole.',
            'Aumenta le tue possibilità di successo in vetta.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Dettaglio delle Tariffe',
      blocks: [
        {
          heading: 'Qual è il costo associato alla Route Machame?',
          paragraphs: [
            'Il prezzo della Route Machame di 7 giorni varia in base a fattori come la dimensione del gruppo, il livello di servizio e le opzioni aggiuntive. Ecco un dettaglio:',
            '💰 Scalata di gruppo: a partire da 2.285 $ a persona   💰 Scalata privata: a partire da 2.585 $ a persona',
            '🔍 Fattori che influenzano il prezzo:',
            '📅 Consiglio da esperto: il periodo migliore per scalare influisce sui costi. Le alte stagioni (luglio-sett. e genn.-febbr.) offrono un tempo eccellente ma sono più costose.',
          ],
          bullets: [
            'Durata della tua scalata guidata del Monte Kilimangiaro',
            'Dimensione del gruppo – Gruppi più numerosi possono ridurre il costo a persona',
            'Servizi classici o premium – Più comfort = costo leggermente più alto',
            'Inclusioni ed esclusioni – Consulta i dettagli del nostro pacchetto per maggiore chiarezza',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dove Alloggerai',
      blocks: [
        {
          heading: 'Quali sono i campeggi lungo la Route Machame?',
          paragraphs: [
            'Il tuo viaggio di scalata del Monte Kilimangiaro includerà soste notturne in questi campeggi strategici:',
            '⛺ Ogni campeggio offre servizi essenziali come alloggio in tenda, aree ristoro e servizi igienici, garantendo un soggiorno confortevole.',
          ],
          bullets: ['Machame Camp', 'Shira Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popolarità e Affluenza',
      blocks: [
        {
          heading: 'La Route Machame è Affollata?',
          paragraphs: [
            'Essendo uno degli itinerari più apprezzati del Kilimangiaro, la Route Machame attira molti scalatori ogni anno. Principali motivi della sua popolarità:',
            '🌍 Viste mozzafiato – Paesaggi spettacolari ed ecosistemi variegati.   ⏳ Durata più breve – Può essere percorsa in soli 6 giorni.   📈 Alti tassi di successo – Eccellente profilo di acclimatazione.',
            '🤔 Preoccupato per l\'affluenza? Sebbene le alte stagioni attirino più scalatori, scegliere i mesi di bassa stagione (marzo, novembre) offre un\'esperienza più tranquilla.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opinioni di Esperti',
      blocks: [
        {
          heading: 'Quali sono le nostre impressioni sulla Route Machame?',
          paragraphs: [
            'Presso African Scenic Safaris, raccomandiamo vivamente la Route Machame per i suoi paesaggi variegati e gli alti tassi di successo. Tuttavia, se cerchi un\'alternativa meno affollata, considera la Route Lemosho.',
            '📍 Differenza chiave: Lemosho inizia in modo più tranquillo ma si unisce a Machame al giorno 3.',
            '⚠️ Attenzione!: aspettati più scalatori su Machame, soprattutto in alta stagione.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Machame',
  secondaryTagline: 'Vivi il viaggio pittoresco verso la vetta del Kilimangiaro. Attraversa Machame e cattura la maestosità della vetta.',
  faqHeading: '10 Domande sulla Route Machame',
  faqs: [
    {number: 1, question: 'Quanto tempo ci vuole per percorrere la Route Machame?', answer: 'La Route Machame richiede generalmente da 6 a 7 giorni. Questa durata consente un\'adeguata acclimatazione, aumentando notevolmente le possibilità di successo in vetta al Kilimangiaro.'},
    {number: 2, question: 'Qual è il livello di difficoltà della Route Machame?', answer: 'La Route Machame è considerata moderatamente difficile. Comporta salite ripide, terreno accidentato e lunghe giornate di cammino, richiedendo sia resistenza fisica che resilienza mentale.'},
    {number: 3, question: 'Qual è il tasso di successo per raggiungere la vetta tramite la Route Machame?', answer: 'Presso African Scenic Safaris, riteniamo che una scalata di successo significhi raggiungere la vetta in sicurezza e tornare. A questo proposito, il nostro tasso di successo è del 100%. Nel complesso, la Route Machame mostra un alto tasso di successo in vetta, grazie al suo profilo di acclimatazione progressivo.'},
    {number: 4, question: 'La Route Machame è pittoresca?', answer: 'Sì! La Route Machame è conosciuta come la « Whiskey Route » per i suoi paesaggi mozzafiato. Gli scalatori attraversano foreste pluviali lussureggianti, brughiere di erica e deserti alpini, con viste magnifiche sul Monte Kilimangiaro in ogni tappa.'},
    {number: 5, question: 'Qual è la distanza media di trekking giornaliera sulla Route Machame?', answer: 'In media, gli scalatori percorrono da 10 a 12 chilometri al giorno, ovvero da 6 a 8 ore di cammino a seconda dell\'itinerario e del ritmo.'},
    {number: 6, question: 'La Route Machame è affollata rispetto ad altri itinerari?', answer: 'La Route Machame è uno degli itinerari più popolari del Kilimangiaro, il che significa che può essere affollata durante le alte stagioni (giugno-ottobre e dicembre-marzo).'},
    {number: 7, question: 'È necessario allenarsi per scalare la Route Machame?', answer: 'Sebbene un\'esperienza di trekking precedente non sia obbligatoria, raccomandiamo vivamente esercizi cardio, allenamento di resistenza e camminate in salita per sviluppare la tua resistenza in vista della scalata del Kilimangiaro.'},
    {number: 8, question: 'Qual è il periodo migliore per scalare il Kilimangiaro tramite la Route Machame?', answer: 'Il periodo migliore per scalare il Kilimangiaro tramite la Route Machame va da giugno a marzo, quando il tempo è stabile, con cielo sereno e minor rischio di precipitazioni — ideale per un trekking sicuro e piacevole.'},
    {number: 9, question: 'Quanti campeggi ci sono sulla Route Machame?', answer: 'La Route Machame conta sei campeggi per la notte, ciascuno che offre un luogo di riposo e acclimatazione: Machame Camp, Shira Camp, Barranco Camp, Karanga Camp, Barafu Camp, Mweka Camp.'},
    {number: 10, question: 'Quali sono le principali attrazioni della Route Machame?', answer: 'Tra i punti salienti della Route Machame: l\'attraversamento della lussureggiante foresta pluviale ai piedi del Kilimangiaro, la scalata dell\'iconica Barranco Wall — un\'ascesa emozionante con viste magnifiche — e l\'arrivo a Uhuru Peak, il punto più alto d\'Africa a 5.895 m (19.341 piedi).'},
  ],
}

const marangu: RouteIt = {
  slug: 'marangu-route',
  name: 'Route Marangu',
  seoTitle: 'Route Marangu | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Scala il Kilimangiaro tramite la Route Marangu, l'unico itinerario con alloggio in rifugi. Itinerario giorno per giorno reale, tariffe e consigli di esperti.",
  heroHeading: 'Scala il Kilimangiaro tramite la Route Marangu',
  heroTagline: 'Il trekking classico del Kilimangiaro',
  heroBody: [
    'Conosciuta come la « Coca-Cola Route », la Route Marangu è l\'itinerario più consolidato e confortevole verso la vetta del Monte Kilimangiaro. È l\'unico itinerario con alloggio in rifugi, il che la rende una scelta popolare per chi cerca un\'esperienza di trekking meno dura.',
    "Il sentiero offre pendii dolci attraverso una foresta pluviale lussureggiante, una brughiera e un deserto alpino prima di raggiungere la vetta ghiacciata di Uhuru Peak. È ideale per escursionisti alle prime armi o per chi cerca una scalata più diretta.",
  ],
  heroImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Rifugio di montagna a forma di A sulla Route Marangu con la foresta sullo sfondo'},
  itineraryHeading: 'Itinerario della Route Marangu',
  itinerarySubheading: 'Il percorso confortevole verso il Tetto dell\'Africa',
  daysLabel: '5 Giorni',
  stops: [
    arrivalStopIt,
    {
      label: 'Giorno di Trekking 1: Marangu Gate → Mandara Hut',
      meta: ['📍 Marangu Gate (1.870 m/6.135 piedi) → Mandara Hut (2.700 m/8.858 piedi)', '📈 Dislivello positivo: 830 m / 2.723 piedi', '⏳ Durata: 4-5 ore'],
      body: [
        "Il tuo trekking inizia con un tragitto da Moshi a Marangu Gate. Dopo la registrazione, entrerai nella lussureggiante foresta pluviale e inizierai il tuo cammino lungo un sentiero ben mantenuto. Il percorso è spesso umido e ombreggiato, con alberi ricoperti di muschio, canti di uccelli e scimmie giocose lungo la strada.",
        'Arriverai a Mandara Hut nel tardo pomeriggio. Se il tempo e l\'energia lo permettono, fai una breve passeggiata fino al cratere di Maundi per splendide viste sul Kenya e sul nord della Tanzania.',
      ],
    },
    {
      label: 'Giorno di Trekking 2: Mandara Hut → Horombo Hut',
      meta: ['📍 Mandara Hut (2.700 m/8.858 piedi) → Horombo Hut (3.720 m/12.204 piedi)', '📈 Dislivello positivo: 1.020 m / 3.346 piedi', '⏳ Durata: 6-7 ore'],
      body: [
        'Lasciando la foresta pluviale alle spalle, entrerai nella zona di brughiera, dove il paesaggio cambia radicalmente. Il sentiero sale costantemente attraverso un terreno aperto pieno di senecio giganti e lobelie.',
        'Lungo il percorso, avrai la tua prima vista completa sui picchi Kibo e Mawenzi. Horombo Hut ti attende con panorami mozzafiato e l\'occasione di incontrare altri escursionisti.',
      ],
    },
    {
      label: 'Giorno di Trekking 3: Horombo Hut → Kibo Hut',
      meta: ['📍 Horombo Hut (3.720 m/12.204 piedi) → Kibo Hut (4.703 m/15.430 piedi)', '📈 Dislivello positivo: 983 m / 3.226 piedi', '⏳ Durata: 6-7 ore'],
      body: [
        "L'itinerario di oggi è lungo e secco, attraversando il deserto alpino. Camminerai attraverso la sella tra i picchi Mawenzi e Kibo, un paesaggio vasto e arido con viste spettacolari. L'aria è più rarefatta, quindi cammina lentamente e resta idratato.",
        'Arriverai a Kibo Hut nel primo pomeriggio — riposati presto e preparati per il tentativo di vetta che inizia a mezzanotte.',
      ],
    },
    {
      label: 'Giorno di Trekking 4: Kibo Hut → Uhuru Peak → Horombo Hut',
      meta: [
        '📍 Kibo Hut (4.703 m/15.430 piedi) → Uhuru Peak (5.895 m/19.341 piedi) → Horombo Hut (3.720 m/12.204 piedi)',
        '📈 Dislivello positivo: 1.192 m / 3.911 piedi (salita), poi discesa',
        '⏳ Durata: 11-14 ore',
      ],
      body: [
        "Il tuo viaggio verso la vetta inizia presto al mattino, camminando nell'oscurità attraverso tornanti e ghiaione fino a Gilman's Point (5.685 m), poi lungo il bordo del cratere fino a Uhuru Peak — il tetto dell'Africa.",
        'Dopo aver immortalato il tuo momento in vetta, ridiscendi a Kibo Hut per un breve riposo, poi continua verso Horombo Hut per una notte di sonno ben meritata.',
      ],
    },
    {
      label: 'Giorno di Trekking 5: Horombo Hut → Marangu Gate',
      meta: ['📍 Horombo Hut (3.720 m/12.204 piedi) → Marangu Gate (1.870 m/6.135 piedi)', '📉 Dislivello negativo: 1.850 m / 6.070 piedi', '⏳ Durata: 6-7 ore'],
      body: [
        'Per il tuo ultimo giorno, scendi attraverso la brughiera e la lussureggiante foresta pluviale per tornare al punto di partenza. Il sentiero è più facile in discesa, ma fai attenzione ai tuoi passi nelle sezioni umide.',
        "All'entrata, riceverai il tuo certificato di vetta prima di tornare a Moshi — stanco ma fiero.",
      ],
    },
    departureStopIt,
  ],
  infoTabsHeading: 'Perché Scegliere Marangu?',
  tabs: [
    {
      id: 'duration',
      label: 'Durata del Viaggio',
      blocks: [
        {
          heading: 'Quali sono i vantaggi di scegliere la Route Marangu?',
          bullets: [
            'Unico itinerario con alloggio in rifugi – A differenza degli altri itinerari che richiedono il campeggio, la Route Marangu offre un alloggio condiviso in rifugi con letti a castello in stile dormitorio. Questo è un grande vantaggio per gli scalatori che preferiscono dormire al chiuso piuttosto che in tenda — soprattutto durante la stagione delle piogge.',
            'Opzione più economica – Poiché utilizza lo stesso sentiero sia per la salita che per la discesa, la logistica è più semplice, il che rende Marangu uno degli itinerari più economici del Kilimangiaro.',
            'Sentiero dolce e progressivo – Il sentiero è ben mantenuto, con una pendenza regolare e moderata, che lo rende ideale per gli escursionisti alle prime armi o per chi cerca una scalata meno impegnativa fisicamente rispetto a itinerari più ripidi come Umbwe o Machame.',
            'Opzioni di durata più brevi (5 o 6 giorni) – Puoi scegliere tra un itinerario di 5 o 6 giorni. La versione di 6 giorni include una giornata di acclimatazione, che migliora le tue possibilità di raggiungere la vetta.',
            'Ideale per le scalate in stagione delle piogge – Poiché offre rifugi e attraversa un terreno meno fangoso rispetto ad altri itinerari, Marangu è una scelta migliore durante le stagioni delle piogge in Tanzania (marzo-maggio e novembre).',
            'Itinerario di ritorno diretto – Lo stesso sentiero viene utilizzato per la discesa, il che può essere più facile da gestire logisticamente, soprattutto se hai poco tempo o preferisci un itinerario semplice.',
            'Diversità pittoresca in poco tempo – Sebbene sia uno degli itinerari più brevi, scoprirai comunque diverse zone di vegetazione — a partire dalla lussureggiante foresta pluviale, passando per la brughiera, fino al deserto alpino prima di raggiungere la vetta ghiacciata.',
            'Accesso al cratere di Maundi – Il primo giorno, una breve passeggiata opzionale conduce al cratere di Maundi — un punto panoramico tranquillo con belle viste sul nord della Tanzania e sul Kenya.',
          ],
        },
        {
          heading: 'Esempio di Tariffazione (a persona in USD)',
          paragraphs: [
            "La scalata del Kilimangiaro tramite la Route Marangu richiede generalmente 5 o 6 giorni, a seconda dell'itinerario scelto. Ogni giorno comporta da 4 a 7 ore di trekking, tranne la notte del sommet, la più impegnativa — che dura fino a 12-14 ore, discesa inclusa. I prezzi variano leggermente in base alla stagione e alla dimensione del gruppo.",
          ],
          bullets: [
            'Opzione 5 giorni: una scalata più rapida con acclimatazione limitata, ideale per escursionisti esperti ma con un tasso di successo in vetta più basso.',
            "Opzione 6 giorni: include una giornata supplementare a Horombo Hut per l'acclimatazione. Questo migliora l'adattamento del tuo corpo all'altitudine e aumenta notevolmente le possibilità di successo in vetta.",
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Dettaglio delle Tariffe',
      blocks: [
        {
          heading: 'Qual è il costo associato alla Route Marangu?',
          pricingTable: {
            columns: ['Durata', '1 persona', '2-3 persone', '4-6 persone', '7+ persone'],
            rows: [
              {label: '5 giorni', values: ['1.850 $', '1.750 $', '1.600 $', '1.450 $']},
              {label: '6 giorni', values: ['2.050 $', '1.950 $', '1.750 $', '1.600 $']},
            ],
          },
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dove Alloggerai',
      blocks: [
        {
          heading: 'Confortevoli rifugi di montagna lungo il percorso — non serve campeggiare!',
          paragraphs: [
            "A differenza degli altri itinerari del Kilimangiaro che richiedono tende, la Route Marangu è l'unico itinerario con rifugi di montagna permanenti, offrendo un'esperienza più confortevole e protetta dalle intemperie. È un'ottima opzione se preferisci un vero letto, un tetto sopra la testa e un riparo condiviso ma solido.",
            "🛏️ Panoramica dell'alloggio:",
          ],
          bullets: [
            'Mandara Hut (2.700 m / 8.858 piedi): situato nella zona di foresta pluviale, Mandara offre accoglienti rifugi a forma di A circondati da un verde lussureggiante. Ogni rifugio ospita da 4 a 8 scalatori e dispone di servizi igienici condivisi nelle vicinanze.',
            'Horombo Hut (3.720 m / 12.205 piedi): situato nella zona di brughiera, Horombo è più grande e ospita gli escursionisti sia in salita che in discesa. Offre splendide viste sul picco Mawenzi e sulle pianure sottostanti.',
            "Kibo Hut (4.703 m / 15.430 piedi): una semplice struttura in pietra nella zona di deserto alpino, Kibo è l'ultima base prima della vetta. Aspettati camere in stile dormitorio con letti a castello e un'atmosfera sobria d'alta quota.",
            '🚿 I servizi includono: materassi e cuscini, sale da pranzo per pasti caldi, illuminazione solare in alcuni rifugi, servizi igienici condivisi puliti ma essenziali, niente docce (porta salviette umidificate o acqua per una pulizia rapida).',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popolarità e Affluenza',
      blocks: [
        {
          heading: 'Molto apprezzata, molto frequentata, e spesso la prima scelta degli scalatori alle prime armi.',
          paragraphs: [
            'La Route Marangu è uno degli itinerari più popolari del Monte Kilimangiaro — spesso chiamata la « Coca-Cola Route » per il suo accesso più facile e i suoi alloggi in rifugi. Attira un gran numero di scalatori, in particolare durante le alte stagioni di trekking (gennaio-marzo e giugno-ottobre).',
            "📌 Perché è popolare? È l'unico itinerario con rifugi di montagna, il che lo rende attraente per chi preferisce non campeggiare. La sua durata più breve (5-6 giorni) attrae chi ha un programma di viaggio serrato. È considerata meno impegnativa fisicamente (sebbene l'altitudine rimanga una sfida seria).",
            "🙋‍♂️ Cosa aspettarsi in termini di affluenza: aspettati più escursionisti su questo itinerario rispetto ad altri come Lemosho o Rongai. I rifugi possono essere affollati, in particolare a Horombo e Kibo, che ospitano escursionisti sia in salita che in discesa.",
            '⚠️ Consiglio: se cerchi solitudine e meno affluenza, valuta di scalare durante le stagioni intermedie (fine marzo o inizio novembre) o di scegliere un itinerario più lungo e meno frequentato.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opinioni di Esperti',
      blocks: [
        {
          heading: 'Riflessioni di guide esperte e specialisti del Kilimangiaro.',
          paragraphs: [
            'La Route Marangu è spesso considerata il modo « più facile » per scalare il Kilimangiaro, ma gli esperti concordano sul fatto che non debba essere sottovalutata.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Marangu',
  secondaryTagline: 'Il Kilimangiaro in tutta semplicità – Dormi in rifugi, non in tenda.',
  faqHeading: '10 Domande sulla Route Marangu',
  faqs: [
    {number: 1, question: 'Quanto tempo ci vuole per percorrere la Route Marangu?', answer: "La Route Marangu richiede generalmente 5 o 6 giorni. L'itinerario di 6 giorni include una giornata supplementare di acclimatazione a Horombo Hut, il che aumenta le tue possibilità di raggiungere la vetta con successo."},
    {number: 2, question: 'Qual è il livello di difficoltà della Route Marangu?', answer: "È considerata moderatamente difficile. Il sentiero è progressivo e ben tracciato, il che la rende una buona scelta per gli scalatori alle prime armi — ma l'altitudine può comunque rappresentare una sfida."},
    {number: 3, question: 'Qual è il tasso di successo per raggiungere la vetta tramite la Route Marangu?', answer: "I tassi di successo variano in base al numero di giorni. L'opzione 5 giorni ha un tasso di successo più basso a causa del minor tempo per l'acclimatazione, mentre la versione 6 giorni offre migliori possibilità, con un tasso di successo di circa l'80% se eseguita correttamente."},
    {number: 4, question: 'La Route Marangu è pittoresca?', answer: 'Sì, la Route Marangu offre bei paesaggi. Attraverserai zone di foresta pluviale, brughiera e deserto alpino, con viste magnifiche vicino alla vetta — sebbene meno variegata rispetto a itinerari come Lemosho o Machame.'},
    {number: 5, question: 'Qual è la distanza media di trekking giornaliera sulla Route Marangu?', answer: 'Gli escursionisti percorrono in media da 8 a 12 km al giorno, a seconda del segmento. Il giorno della vetta è il più lungo, con oltre 18 km di cammino.'},
    {number: 6, question: 'La Route Marangu è affollata rispetto ad altri itinerari?', answer: 'La Route Marangu è uno degli itinerari più popolari e frequentati, in particolare durante le stagioni secche. Attira gli scalatori che preferiscono l\'alloggio in rifugi e un itinerario più breve.'},
    {number: 7, question: 'È necessario allenarsi per scalare la Route Marangu?', answer: 'Sì, un allenamento di base e una preparazione fisica sono vivamente consigliati. Concentrati su cardio, pratica del trekking ed esercizi di resistenza diverse settimane prima del tuo viaggio.'},
    {number: 8, question: 'Qual è il periodo migliore per scalare il Kilimangiaro tramite la Route Marangu?', answer: 'I mesi migliori sono durante le stagioni secche: da gennaio a metà marzo e da giugno a ottobre, quando i sentieri sono più asciutti e le viste più limpide.'},
    {number: 9, question: 'Quanti rifugi ci sono sulla Route Marangu?', answer: 'Ci sono tre stazioni di rifugio principali: Mandara Hut, Horombo Hut e Kibo Hut, tutte dotate di letti a castello, aree ristoro essenziali e servizi igienici.'},
    {number: 10, question: 'Quali sono le principali attrazioni della Route Marangu?', answer: "L'itinerario è rinomato per i suoi confortevoli rifugi, la sua importanza storica e la sua diversità pittoresca. Offre anche l'accesso al cratere di Maundi e viste sul picco Mawenzi — rendendola una scalata classica con un tocco di comfort."},
  ],
}

const lemosho: RouteIt = {
  slug: 'lemosho-route',
  name: 'Route Lemosho',
  seoTitle: 'Route Lemosho | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Scala il Kilimangiaro tramite la Route Lemosho, uno degli itinerari più pittoreschi ed equilibrati della montagna. Itinerario giorno per giorno reale, tariffe e consigli di esperti.",
  heroHeading: 'Scala il Kilimangiaro tramite la Route Lemosho',
  heroTagline: 'Una scalata pittoresca e progressiva verso la vetta del Kilimangiaro',
  heroBody: [
    "La Route Lemosho è uno dei modi più belli ed equilibrati per scalare il Monte Kilimangiaro. Iniziando sul lato ovest remoto della montagna, offre una partenza tranquilla con meno affluenza, viste magnifiche e un ritmo regolare che aiuta il tuo corpo ad adattarsi all'altitudine.",
    "Questo itinerario è apprezzato sia dagli escursionisti esperti che dai principianti per il suo alto tasso di successo, i suoi paesaggi variegati e il suo eccellente profilo di acclimatazione. Che tu scelga la versione di 7 o 8 giorni, godrai di un viaggio gratificante attraverso la foresta pluviale, la brughiera, il deserto alpino e infine i ghiacciai a Uhuru Peak.",
  ],
  heroImage: {src: '/images/routes/lemosho/hero.webp', alt: 'Tende a Barafu Camp con la vetta innevata del Kibo sopra le nuvole'},
  itineraryHeading: 'Itinerario della Route Lemosho',
  itinerarySubheading: "Una partenza tranquilla verso il Tetto dell'Africa",
  daysLabel: '7 Giorni',
  stops: [
    arrivalStopIt,
    {
      label: 'Giorno di Trekking 1: Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2.100 m/6.890 piedi) → Mti Mkubwa (2.650 m/8.690 piedi)', '📈 Dislivello positivo: 550 m / 1.800 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Dopo la registrazione, inizia il tuo trekking attraverso la lussureggiante foresta pluviale, con buone probabilità di avvistare scimmie e uccelli colorati. Arriverai a Mti Mkubwa, o « Big Tree Camp », nel tardo pomeriggio.'],
    },
    {
      label: 'Giorno di Trekking 2: Mti Mkubwa – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m/11.843 piedi)', '📈 Dislivello positivo: 960 m / 3.150 piedi', '⏳ Durata: 5-6 ore'],
      body: ['Oggi il sentiero esce dalla foresta per entrare nella zona di brughiera. Le viste si aprono in modo spettacolare attraversando il plateau dello Shira — un\'antica colata di lava.'],
    },
    {
      label: 'Giorno di Trekking 3: Shira 1 – Shira 2 Camp',
      meta: ['📍 Shira 1 (3.610 m) → Shira 2 Camp (3.850 m/12.630 piedi)', '📈 Dislivello positivo: 240 m / 787 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Una giornata rilassante con leggere salite e discese attraverso il plateau. Scorgerai per la prima volta il picco Kibo e ti acclimaterai lentamente sistemandoti al campo.'],
    },
    {
      label: 'Giorno di Trekking 4: Shira 2 – Lava Tower – Barranco Camp',
      meta: ['📍 Shira 2 (3.850 m) → Lava Tower (4.600 m) → Barranco Camp (3.976 m)', '📈 Dislivello: 750 m in salita / 624 m in discesa', '⏳ Durata: 6-7 ore'],
      body: ['Si tratta di una giornata di acclimatazione. Sali in alto fino a Lava Tower, poi ridiscendi per dormire a Barranco — questo approccio « salire in alto, dormire in basso » aiuta il tuo corpo ad adattarsi all\'altitudine.'],
    },
    {
      label: 'Giorno di Trekking 5: Barranco – Karanga Camp – Barafu Camp',
      meta: ['📍 Barranco Camp (3.976 m) → Karanga Camp (4.035 m) → Barafu Camp (4.673 m)', '📈 Dislivello positivo: 697 m / 2.286 piedi', '⏳ Durata: 8-9 ore'],
      body: [
        "La tua giornata inizia con una salita lungo l'iconica Barranco Wall — un'arrampicata ripida ma gratificante con viste epiche. Dopo una breve sosta a Karanga Camp, continuerai con un trekking regolare in salita attraverso il deserto alpino fino a Barafu Camp.",
        'Questa è la tua base per il tentativo di vetta. Cena presto e riposati prima dello sforzo di mezzanotte verso Uhuru Peak.',
      ],
    },
    {
      label: 'Giorno di Trekking 6: Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.673 m/15.330 piedi) → Uhuru Peak (5.895 m/19.341 piedi) → Mweka Camp (3.110 m/10.204 piedi)',
        '📈 Dislivello: 1.222 m / 4.011 piedi in salita, 2.785 m / 9.137 piedi in discesa',
        '⏳ Durata: 12-14 ore',
      ],
      body: [
        "Il giorno della vetta inizia verso mezzanotte sotto un cielo stellato. Il sentiero è lungo e ripido, ma lentezza e costanza vincono la gara. Dopo aver raggiunto Stella Point (5.739 m), continua lungo il bordo del cratere fino a Uhuru Peak, il punto più alto d'Africa.",
        'Festeggia la tua impresa, scatta foto, e inizia la discesa verso Mweka Camp. Aspettati gambe indolenzite e un sonno profondo e ristoratore.',
      ],
    },
    {
      label: 'Giorno di Trekking 7: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m/10.204 piedi) → Mweka Gate (1.640 m/5.380 piedi)', '📉 Dislivello negativo: 1.470 m / 4.823 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Il tuo ultimo giorno è una piacevole discesa attraverso la lussureggiante foresta pluviale, piena di canti di uccelli e forse anche scimmie. A Mweka Gate, firmerai la tua partenza, riceverai i tuoi certificati di vetta, e ritroverai il tuo autista per il ritorno a Moshi.'],
    },
    departureStopIt,
  ],
  infoTabsHeading: 'Perché Scegliere Lemosho?',
  tabs: [
    {
      id: 'duration',
      label: 'Durata del Viaggio',
      blocks: [
        {
          heading: 'Quali sono i vantaggi di scegliere la Route Lemosho?',
          paragraphs: [
            'La Route Lemosho è ampiamente considerata l\'itinerario più pittoresco ed equilibrato del Monte Kilimangiaro — e a ragione. Offre un mix perfetto di bellezza, sfida e acclimatazione, rendendola una delle migliori scelte sia per principianti che per escursionisti esperti.',
            'A differenza di altri itinerari, Lemosho inizia sul lato ovest remoto della montagna, offrendo una partenza tranquilla attraverso una foresta pluviale incontaminata prima di unirsi alla più frequentata Route Machame in seguito. Questo significa meno affluenza all\'inizio, più osservazioni della fauna selvatica, e viste panoramiche mozzafiato dall\'inizio alla fine.',
            "Un altro motivo per scegliere Lemosho? Il tasso di successo. Grazie al suo itinerario più lungo (7 o 8 giorni), guadagni altitudine in modo più progressivo — lasciando al tuo corpo il tempo di adattarsi. Questo migliora notevolmente le tue possibilità di raggiungere la vetta in sicurezza e di sentirti forte nella notte della vetta.",
            "Se cerchi un itinerario che offra paesaggi incredibili, un solido tempo di acclimatazione e un'avventura gratificante senza l'affluenza iniziale, Lemosho è difficile da superare.",
          ],
        },
        {
          heading: 'Quanto tempo ci vuole per percorrere la Route Lemosho?',
          paragraphs: [
            "La Route Lemosho viene generalmente percorsa in 7 o 8 giorni, a seconda dell'itinerario scelto. L'opzione 8 giorni include una giornata supplementare di acclimatazione a Karanga Camp, aumentando le tue possibilità di raggiungere la vetta comodamente. Questa durata prolungata la rende uno dei migliori itinerari per l'adattamento all'altitudine e un ritmo di trekking più rilassato.",
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Dettaglio delle Tariffe',
      blocks: [
        {
          heading: 'Qual è il costo associato alla Route Lemosho?',
          paragraphs: [
            "I prezzi della Route Lemosho variano in base alla dimensione del gruppo e al livello di servizio, ma ecco una panoramica generale. Questi costi includono generalmente le tasse di parco, il supporto di guide e portatori, i pasti, le tende e il trasporto. Scalate private e pacchetti di lusso sono disponibili anche a tariffe più elevate.",
          ],
          bullets: ['Trekking di 7 giorni: a partire da 2.200 $ a 2.700 $ a persona', 'Trekking di 8 giorni: a partire da 2.400 $ a 2.900 $ a persona'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dove Alloggerai',
      blocks: [
        {
          heading: 'Quali sono i campeggi lungo la Route Lemosho?',
          paragraphs: [
            "A differenza della Route Marangu, Lemosho è un trekking esclusivamente in campeggio. Dormirai in tende di montagna di alta qualità fornite dal tuo operatore. Campeggi come Shira, Barranco e Barafu offrono viste incredibili — pensa a albe sopra le nuvole e notti stellate. Tutti i pasti sono preparati freschi dal tuo cuoco di montagna, e avrai a disposizione una tenda ristorante per il tuo comfort.",
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popolarità e Affluenza',
      blocks: [
        {
          heading: 'La Route Lemosho è Affollata?',
          paragraphs: [
            "La Route Lemosho inizia sul lato ovest remoto del Kilimangiaro, il che significa meno escursionisti nei primi giorni. Si unisce alla Route Machame al giorno 4, diventando quindi più affollata vicino alla vetta. Tuttavia, Lemosho è meno affollata di Marangu o Machame nelle sue prime tappe, offrendo una partenza più tranquilla e pittoresca.",
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opinioni di Esperti',
      blocks: [
        {
          heading: 'Quali sono le nostre impressioni sulla Route Lemosho?',
          paragraphs: [
            "Lemosho è spesso considerato l'itinerario più bello ed equilibrato del Kilimangiaro. Combina eccellenti paesaggi, un'ottima acclimatazione e un alto tasso di successo in vetta. La maggior parte delle guide esperte lo raccomanda agli scalatori alle prime armi in cerca delle migliori possibilità di successo senza affrettarsi. L'approccio da ovest offre anche un'esperienza di natura selvaggia più remota all'inizio del trekking.",
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Lemosho',
  secondaryTagline: 'Lemosho inizia dove gli altri non lo fanno — e questo cambia tutto.',
  faqHeading: '10 Domande sulla Route Lemosho',
  faqs: [
    {number: 1, question: 'Quanto tempo ci vuole per scalare il Kilimangiaro tramite la Route Lemosho?', answer: "La maggior parte degli scalatori percorre la Route Lemosho in 7 o 8 giorni. L'opzione 8 giorni include una giornata supplementare di acclimatazione, migliorando le tue possibilità di raggiungere la vetta."},
    {number: 2, question: 'La Route Lemosho è difficile?', answer: 'Lemosho è considerata da moderata a difficile. Non è tecnica, ma il giorno della vetta è lungo e faticoso. La durata più lunga aiuta l\'acclimatazione, rendendola gestibile per la maggior parte degli escursionisti in buona forma fisica.'},
    {number: 3, question: 'Qual è il tasso di successo in vetta sulla Route Lemosho?', answer: "Lemosho mostra uno dei tassi di successo più alti tra tutti gli itinerari del Kilimangiaro — fino al 90% per l'itinerario di 8 giorni, grazie al suo guadagno di altitudine progressivo e al suo eccellente profilo di acclimatazione."},
    {number: 4, question: 'La Route Lemosho è pittoresca?', answer: 'Sì — Lemosho è spesso definita l\'itinerario più bello del Kilimangiaro. Offre paesaggi variegati, dalla foresta pluviale e brughiera al deserto alpino e viste sui ghiacciai.'},
    {number: 5, question: 'La Route Lemosho è affollata?', answer: 'Lemosho inizia sul lato ovest tranquillo della montagna, quindi i primi giorni sono tranquilli e poco affollati. Si unisce alla più frequentata Route Machame vicino a Lava Tower, ma nel complesso è meno affollata di itinerari come Marangu.'},
    {number: 6, question: 'Che tipo di alloggio è disponibile sulla Route Lemosho?', answer: 'Lemosho è un itinerario esclusivamente in campeggio. Dormirai in tende di alta qualità in campeggi designati. I portatori trasportano e allestiscono tutta l\'attrezzatura da campeggio per te.'},
    {number: 7, question: 'La Route Lemosho è adatta ai principianti?', answer: "Sì, soprattutto se scegli la versione di 8 giorni. L'itinerario più lungo dà ai principianti più tempo per acclimatarsi e riposarsi, aumentando il loro successo in vetta e il loro comfort."},
    {number: 8, question: 'Qual è il periodo migliore per scalare la Route Lemosho?', answer: 'I mesi migliori sono gennaio-marzo e giugno-ottobre, quando il tempo è più secco e la visibilità migliore. Questi periodi offrono un trekking più sicuro e viste più limpide in vetta.'},
    {number: 9, question: 'Devo allenarmi per la Route Lemosho?', answer: "L'allenamento è vivamente consigliato. Punta su esercizi di cardio, forza e resistenza. Le lunghe escursioni con uno zaino sono il modo migliore per prepararti all'altitudine e alle ore di trekking quotidiane."},
    {number: 10, question: 'Perché scegliere la Route Lemosho rispetto ad altri itinerari?', answer: "Lemosho offre il miglior equilibrio tra paesaggi, tasso di successo e gestione dell'affluenza. È ideale per gli escursionisti che desiderano un'esperienza più remota con migliori possibilità di raggiungere la vetta."},
  ],
}

const rongai: RouteIt = {
  slug: 'rongai-route',
  name: 'Route Rongai',
  seoTitle: 'Route Rongai | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Scala il Kilimangiaro tramite la Route Rongai, l'unico itinerario che affronta la montagna da nord. Itinerario giorno per giorno reale, tariffe e consigli di esperti.",
  heroHeading: "Route Rongai, l'itinerario settentrionale remoto del Kilimangiaro",
  heroTagline: 'Il dolce sentiero settentrionale verso il Kilimangiaro.',
  heroBody: [
    "La Route Rongai è l'unico itinerario che affronta il Kilimangiaro dal lato nord, vicino al confine keniota, offrendo un'esperienza più tranquilla e remota con paesaggi che cambiano progressivamente e meno affluenza. È perfetta per chi desidera una scalata pacifica, apprezza le osservazioni della fauna selvatica e preferisce un itinerario più asciutto — specialmente durante la stagione delle piogge.",
    "Sebbene leggermente meno pittoresca all'inizio rispetto a itinerari come Lemosho, la Route Rongai compensa con la sua solitudine, i suoi tassi di successo e un approccio finale spettacolare alla vetta tramite il bordo del cratere di Kibo. La discesa avviene tramite la Route Marangu, offrendoti l'occasione di vedere entrambi i lati della montagna.",
  ],
  heroImage: {src: '/images/routes/rongai/hero.webp', alt: 'Uno scalatore in posa davanti al cartello della vetta Uhuru Peak sul Kilimangiaro'},
  itineraryHeading: 'Itinerario della Route Rongai',
  itinerarySubheading: 'Il sentiero tranquillo proveniente da nord',
  daysLabel: '7 Giorni',
  stops: [
    arrivalStopIt,
    {
      label: 'Giorno di Trekking 1: Nalemoru Gate – Simba Camp',
      meta: ['📍 Nalemoru Gate (1.950 m / 6.398 piedi) → Simba Camp (2.600 m / 8.530 piedi)', '📈 Dislivello positivo: 650 m / 2.132 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Partenza dal lato nord-est del Kilimangiaro vicino al confine keniota. Il sentiero attraversa foreste lussureggianti e terreni agricoli aperti prima di raggiungere Simba Camp, situato nella zona di erica.'],
    },
    {
      label: 'Giorno di Trekking 2: Simba Camp – Second Cave Camp',
      meta: ['📍 Simba Camp (2.600 m / 8.530 piedi) → Second Cave Camp (3.450 m / 11.318 piedi)', '📈 Dislivello positivo: 850 m / 2.788 piedi', '⏳ Durata: 5-6 ore'],
      body: ['Il sentiero sale progressivamente attraverso una brughiera aperta con viste panoramiche sulle pianure sottostanti e il picco frastagliato di Mawenzi davanti a te.'],
    },
    {
      label: 'Giorno di Trekking 3: Second Cave Camp – Kikelewa Camp',
      meta: ['📍 Second Cave Camp (3.450 m / 11.318 piedi) → Kikelewa Camp (3.600 m / 11.811 piedi)', '📈 Dislivello positivo: 150 m / 492 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Un trekking più breve oggi con un dislivello leggero, offrendo tempo per acclimatarsi. La vegetazione diventa più rada man mano che procedi verso la zona alpina.'],
    },
    {
      label: 'Giorno di Trekking 4: Kikelewa Camp – Mawenzi Tarn',
      meta: ['📍 Kikelewa Camp (3.600 m / 11.811 piedi) → Mawenzi Tarn (4.330 m / 14.206 piedi)', '📈 Dislivello positivo: 730 m / 2.395 piedi', '⏳ Durata: 4-5 ore'],
      body: ['Il sentiero diventa più ripido, conducendo a un magnifico lago glaciale situato sotto le spettacolari guglie di Mawenzi. È uno dei campeggi più pittoreschi del Kilimangiaro.'],
    },
    {
      label: 'Giorno di Trekking 5: Mawenzi Tarn – Kibo Hut',
      meta: ['📍 Mawenzi Tarn (4.330 m / 14.206 piedi) → Kibo Hut (4.700 m / 15.420 piedi)', '📈 Dislivello positivo: 370 m / 1.214 piedi', '⏳ Durata: 5-6 ore'],
      body: ['Attraversa la vasta sella desertica alpina tra Mawenzi e Kibo. Il paesaggio è austero e silenzioso, preparandoti mentalmente alla sfida della vetta che ti aspetta.'],
    },
    {
      label: 'Giorno di Trekking 6: Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        '📍 Kibo Hut (4.700 m / 15.420 piedi) → Uhuru Peak (5.895 m / 19.341 piedi) → Horombo Hut (3.720 m / 12.205 piedi)',
        '📈 Dislivello positivo: 1.195 m / 3.921 piedi',
        '📉 Dislivello negativo: 2.175 m / 7.136 piedi',
        '⏳ Durata: 12-14 ore',
      ],
      body: ["Il giorno della vetta inizia poco dopo mezzanotte. Dopo aver raggiunto Uhuru Peak per un'alba indimenticabile, ridiscendi fino a Horombo Hut per un meritato riposo."],
    },
    {
      label: 'Giorno di Trekking 7: Horombo Hut – Marangu Gate',
      meta: ['📍 Horombo Hut (3.720 m / 12.205 piedi) → Marangu Gate (1.860 m / 6.102 piedi)', '📉 Dislivello negativo: 1.860 m / 6.102 piedi', '⏳ Durata: 5-6 ore'],
      body: ['Scendi attraverso la lussureggiante foresta pluviale, dove potresti avvistare scimmie blu e uccelli esotici. A Marangu Gate, riceverai il tuo certificato di vetta e dirai addio alla montagna.'],
    },
    departureStopIt,
  ],
  infoTabsHeading: 'Perché Scegliere Rongai?',
  tabs: [
    {
      id: 'duration',
      label: 'Durata del Viaggio',
      blocks: [
        {
          heading: 'Quali sono i vantaggi di scegliere la Route Rongai?',
          paragraphs: [
            "La Route Rongai è l'unico itinerario del Kilimangiaro che affronta la vetta da nord, vicino al confine keniota. È rinomata per essere meno affollata, più asciutta e più remota, offrendo un'esperienza unica con eccellenti viste sulle pianure di Amboseli in Kenya. Con pendii dolci, è ideale per gli scalatori in cerca di una scalata più progressiva e un'esperienza di trekking più tranquilla. La diversità pittoresca — che va dalla foresta pluviale e brughiera al deserto alpino — la rende una scelta notevole per gli amanti della natura e i fotografi.",
          ],
        },
        {
          heading: 'Quanto tempo ci vuole per percorrere la Route Rongai?',
          paragraphs: [
            '7 giorni / 6 notti sulla montagna.',
            'Una giornata di acclimatazione opzionale può essere aggiunta per un ritmo più rilassato e un migliore tasso di successo in vetta.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Dettaglio delle Tariffe',
      blocks: [
        {
          heading: 'Qual è il costo associato alla Route Rongai?',
          paragraphs: ["I prezzi possono variare in base alla dimensione del gruppo, alle prestazioni incluse e alla qualità dell'operatore. In media:"],
          bullets: ['Trekking privato: a partire da 2.200 $ a 2.800 $ a persona', 'Trekking di gruppo: a partire da 1.900 $ a 2.300 $ a persona'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dove Alloggerai',
      blocks: [
        {
          heading: 'Quali sono i campeggi lungo la Route Rongai?',
          paragraphs: [
            'A differenza della Route Marangu che utilizza rifugi, Rongai è un itinerario interamente in campeggio. Dormirai in tende di montagna 4 stagioni con materassini in schiuma, e i pasti sono serviti in una tenda ristorante comune. I campeggi includono:',
            'Questi campeggi sono tranquilli e poco frequentati, offrendo magnifici cieli stellati e viste sulla montagna.',
          ],
          bullets: ['Simba Camp', 'Second Cave Camp', 'Kikelewa Camp', 'Mawenzi Tarn', 'Kibo Hut (campo base)', 'Horombo Hut (discesa via la Route Marangu)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popolarità e Affluenza',
      blocks: [
        {
          heading: 'La Route Rongai è Affollata?',
          paragraphs: [
            "La Route Rongai è uno degli itinerari meno affollati, il che la rende una scelta perfetta per gli escursionisti in cerca di solitudine. Mentre itinerari come Machame e Marangu conoscono una maggiore affluenza, Rongai offre un'esperienza tranquilla, in particolare durante i primi giorni del trekking. Anche in alta stagione, mantiene un'atmosfera più calma.",
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opinioni di Esperti',
      blocks: [
        {
          heading: 'Quali sono le nostre impressioni sulla Route Rongai?',
          bullets: [
            "Tasso di successo: superiore alla media grazie a una salita lenta e regolare e alla possibilità di acclimatarsi a Mawenzi Tarn.",
            'Meteo: un sentiero più asciutto sul lato nord significa meno interruzioni dovute alla pioggia.',
            "Notte della vetta: inizia da Kibo Hut, offrendo una salita diretta e ripida verso Gilman's Point prima di continuare verso Uhuru Peak.",
            'Particolarità: scendi dal lato Marangu, offrendoti un\'esperienza di attraversamento della montagna — un piacere raro tra gli itinerari del Kilimangiaro.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Rongai',
  secondaryTagline: 'Scopri entrambi i lati del Kilimangiaro in un unico viaggio indimenticabile.',
  faqHeading: '10 Domande sulla Route Rongai',
  faqs: [
    {number: 1, question: 'Quanto tempo ci vuole per percorrere la Route Rongai?', answer: "L'itinerario standard richiede 7 giorni, ma alcuni scalatori aggiungono una giornata supplementare di acclimatazione per aumentare le loro possibilità di successo in vetta."},
    {number: 2, question: 'La Route Rongai è adatta ai principianti?', answer: "Sì. Ha una pendenza più dolce e meno salite ripide, il che la rende un'ottima opzione per i principianti nel trekking d'alta quota."},
    {number: 3, question: 'Cosa rende unica la Route Rongai?', answer: 'È l\'unico itinerario che inizia dal lato nord del Kilimangiaro vicino al confine keniota, offrendo condizioni asciutte e viste uniche sul parco nazionale di Amboseli.'},
    {number: 4, question: 'Qual è il tasso di successo in vetta tramite la Route Rongai?', answer: "Con 7 giorni, il tasso di successo è di circa l'85-90%, soprattutto se è inclusa una giornata di acclimatazione."},
    {number: 5, question: 'La Route Rongai è affollata rispetto alle altre?', answer: 'È uno degli itinerari più tranquilli del Kilimangiaro, perfetto per chi desidera evitare le folle più numerose presenti su itinerari come Machame e Marangu.'},
    {number: 6, question: 'Come sono i campeggi su Rongai?', answer: 'Dormirai in tenda in campeggi pittoreschi come Mawenzi Tarn e Kikelewa, rinomati per le loro ambientazioni remote e tranquille e i loro paesaggi spettacolari.'},
    {number: 7, question: 'Si scende dallo stesso sentiero?', answer: "No. Sali da nord e ridiscendi tramite la Route Marangu a sud, offrendo un'esperienza più variegata della montagna."},
    {number: 8, question: "Qual è il periodo migliore dell'anno per scalare la Route Rongai?", answer: 'Da gennaio a metà marzo e da giugno a ottobre offrono il tempo migliore. È anche una buona opzione durante la stagione delle piogge, poiché il lato nord rimane relativamente asciutto.'},
    {number: 9, question: 'Il mal di montagna è frequente su questo itinerario?', answer: 'Come su tutti gli itinerari, il mal di montagna è possibile. Tuttavia, la scalata progressiva di Rongai aiuta il corpo ad adattarsi più facilmente — soprattutto con un itinerario di 7 giorni.'},
    {number: 10, question: 'Perché dovrei scegliere la Route Rongai rispetto ad altre opzioni?', answer: "Se cerchi un sentiero più tranquillo, un'ottima acclimatazione e una diversità pittoresca senza l'affluenza, Rongai offre una delle migliori esperienze complessive del Kilimangiaro."},
  ],
}

const umbwe: RouteIt = {
  slug: 'umbwe-route',
  name: 'Route Umbwe',
  seoTitle: 'Route Umbwe | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Scala il Kilimangiaro tramite la Route Umbwe, l'itinerario più ripido e diretto della montagna. Itinerario giorno per giorno reale, tariffe e consigli di esperti.",
  heroHeading: 'Route Umbwe',
  heroTagline: 'Il sentiero ripido verso la solitudine e la gloria della vetta',
  heroBody: [
    "La Route Umbwe è l'itinerario più diretto — e probabilmente il più impegnativo — verso la vetta del Monte Kilimangiaro. Conosciuta per le sue salite ripide, le sue creste accidentate e il suo terreno emozionante, è privilegiata dagli escursionisti esperti in cerca di un itinerario audace e meno frequentato.",
    "A differenza degli itinerari più popolari, Umbwe offre una natura selvaggia autentica, meno affluenza e una sfida accelerata attraverso la lussureggiante foresta pluviale, creste ripide e zone alpine elevate. Sebbene fisicamente intensa, la ricompensa è una solitudine impareggiabile e paesaggi montani spettacolari.",
  ],
  heroImage: {src: '/images/routes/umbwe/hero.jpg', alt: 'Tende colorate a Karanga Camp con il Kibo innevato sullo sfondo'},
  itineraryHeading: 'Itinerario della Route Umbwe',
  itinerarySubheading: 'Il percorso più ripido e diretto verso la vetta',
  daysLabel: '6 Giorni',
  stops: [
    arrivalStopIt,
    {
      label: 'Giorno di Trekking 1: Umbwe Gate – Umbwe Cave Camp',
      meta: ['📍 Umbwe Gate (1.800 m/5.905 piedi) → Umbwe Cave Camp (2.850 m/9.350 piedi)', '📈 Dislivello positivo: 1.050 m / 3.445 piedi', '⏳ Durata: 5-7 ore'],
      body: ["Dopo la registrazione a Umbwe Gate, il sentiero si immerge direttamente nella foresta pluviale. Percorrerai una cresta stretta e ripida fiancheggiata da alberi giganti, muschio e radici intrecciate. Aspettati una sfida fisica fin dall'inizio — ma anche viste incredibili salendo sopra la canopia forestale."],
    },
    {
      label: 'Giorno di Trekking 2: Umbwe Cave Camp – Barranco Camp',
      meta: ['📍 Umbwe Cave Camp (2.850 m/9.350 piedi) → Barranco Camp (3.900 m/12.800 piedi)', '📈 Dislivello positivo: 1.050 m / 3.450 piedi', '⏳ Durata: 4-6 ore'],
      body: ['Lasci la foresta alle spalle per entrare nella brughiera ed erica, arrampicandoti lungo creste taglienti con viste mozzafiato sulle valli sottostanti. Ti unirai agli escursionisti di Machame e Lemosho a Barranco Camp.'],
    },
    {
      label: 'Giorno di Trekking 3: Barranco Camp – Karanga Camp',
      meta: ['📍 Barranco Camp (3.900 m/12.800 piedi) → Karanga Camp (3.995 m/13.106 piedi)', '📈 Dislivello positivo: 95 m / 306 piedi', '⏳ Durata: 4-5 ore'],
      body: ['Dopo aver affrontato la celebre Barranco Wall, un\'arrampicata divertente con viste panoramiche, il sentiero scende e risale attraverso valli prima di raggiungere Karanga Camp, arroccato su una cresta spazzata dal vento.'],
    },
    {
      label: 'Giorno di Trekking 4: Karanga Camp – Barafu Camp',
      meta: ['📍 Karanga Camp (3.995 m/13.106 piedi) → Barafu Camp (4.673 m/15.331 piedi)', '📈 Dislivello positivo: 678 m / 2.225 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Una giornata di trekking più breve lascia al tuo corpo il tempo di riposare e prepararsi per la notte della vetta. Arriverai a Barafu Camp a metà giornata. Il pomeriggio è dedicato all\'idratazione, ai pasti e al riposo prima che la scalata finale inizi a mezzanotte.'],
    },
    {
      label: 'Giorno di Trekking 5: Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.673 m/15.331 piedi) → Uhuru Peak (5.895 m/19.341 piedi) → Mweka Camp (3.110 m/10.204 piedi)',
        '📈 Dislivello positivo: 1.222 m / 4.010 piedi',
        '📉 Dislivello negativo: 2.785 m / 9.137 piedi',
        '⏳ Durata: 12-16 ore',
      ],
      body: ['Una partenza a mezzanotte ti conduce alla vetta sotto le stelle. Raggiungi Uhuru Peak all\'alba, poi inizia una lunga discesa verso Mweka Camp. È la giornata più difficile — mentalmente e fisicamente — ma anche la più indimenticabile.'],
    },
    {
      label: 'Giorno di Trekking 6: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m/10.204 piedi) → Mweka Gate (1.640 m/5.380 piedi)', '📉 Dislivello negativo: 1.470 m / 4.823 piedi', '⏳ Durata: 3-4 ore'],
      body: ['La discesa finale ti conduce attraverso la lussureggiante foresta pluviale fino a Mweka Gate, dove ti attende il tuo certificato di vetta. Saluta la montagna e goditi il viaggio di ritorno verso Moshi o Arusha.'],
    },
    departureStopIt,
  ],
  infoTabsHeading: 'Perché Scegliere Umbwe?',
  tabs: [
    {
      id: 'duration',
      label: 'Durata del Viaggio',
      blocks: [
        {
          heading: 'Quali sono i vantaggi di scegliere la Route Umbwe?',
          paragraphs: [
            "Se cerchi un'avventura audace e piena di adrenalina sul Kilimangiaro, la Route Umbwe è fatta per te. È l'itinerario più ripido e diretto verso la vetta — offrendo una scalata entusiasmante attraverso paesaggi selvaggi e incontaminati. Essendo meno frequentata, offre sentieri tranquilli, una bellezza naturale autentica e una connessione intima con la montagna che pochi altri itinerari offrono. È privilegiata da escursionisti esperti e appassionati di avventura in cerca di un'esperienza tranquilla, fuori dai sentieri battuti, senza essere scoraggiati dalla sfida aggiuntiva.",
            'Scegli Umbwe se desideri:',
            '⚠️ Nota: a causa della rapida ascesa e del ridotto tempo di acclimatazione, questo itinerario è più adatto a escursionisti esperti o in ottima condizione fisica.',
          ],
          bullets: [
            'Un sentiero più tranquillo e più remoto',
            'Meno affluenza, anche in alta stagione',
            "Una salita ripida e diretta che guadagna rapidamente altitudine",
            'Creste pittoresche e viste spettacolari lungo tutto il percorso',
            'Una scalata più rapida con una distanza totale più breve',
          ],
        },
        {
          heading: 'Quanto tempo ci vuole per percorrere la Route Umbwe?',
          paragraphs: [
            'È uno degli itinerari più brevi e diretti verso la vetta, il che significa meno tempo sulla montagna — ma anche una sfida fisica e d\'altitudine maggiore.',
          ],
          bullets: ['Giorni totali: 6 giorni (5 giorni di trekking + vetta)', 'Distanza: circa 53 km', 'Punto di partenza: Umbwe Gate (1.800 m)', 'Vetta: Uhuru Peak (5.895 m)', 'Punto di arrivo: Mweka Gate (1.640 m)'],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Dettaglio delle Tariffe',
      blocks: [
        {
          heading: 'Qual è il costo associato alla Route Umbwe?',
          paragraphs: [
            'Sebbene i prezzi varino in base alla dimensione del gruppo, all\'operatore e alle prestazioni incluse, ecco una stima generale per una scalata Umbwe di 6 giorni:',
            "Le prestazioni incluse coprono generalmente: le tasse di parco e soccorso, le tende, l'attrezzatura da campeggio e i pasti, guide esperte, portatori e cuochi, il trasporto andata e ritorno verso il punto di partenza, il certificato di vetta.",
            "🧾 Consiglio: verifica sempre se il prezzo include l'alloggio prima/dopo, il noleggio dell'attrezzatura e le mance per portatori e guide.",
          ],
          bullets: ['Tour di gruppo: 1.800 $ a 2.300 $ a persona', 'Trekking privato: 2.400 $ a oltre 3.000 $ a persona'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dove Alloggerai',
      blocks: [
        {
          heading: 'Quali sono i campeggi lungo la Route Umbwe?',
          paragraphs: [
            'A differenza della Route Marangu (che utilizza rifugi), la Route Umbwe è un\'esperienza interamente in campeggio. Alloggerai in campeggi allestiti ogni giorno dai tuoi portatori. I campi si trovano a:',
            'Aspettati cieli notturni spettacolari, aria di montagna fresca e il comfort di un sacco a pelo caldo sotto tela.',
          ],
          bullets: ['Umbwe Cave Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp (in discesa)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popolarità e Affluenza',
      blocks: [
        {
          heading: 'La Route Umbwe è Affollata?',
          paragraphs: [
            "Umbwe è uno degli itinerari meno frequentati del Kilimangiaro. Potresti persino ritrovarti da solo sul sentiero per ore, in particolare nelle sezioni inferiori. Una volta che ti unisci agli scalatori di Machame e Lemosho a Barranco Camp, diventa un po' più animato — ma rimane più tranquillo di altri itinerari. Se la solitudine conta per te, è una scelta eccellente.",
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opinioni di Esperti',
      blocks: [
        {
          heading: 'Quali sono le nostre impressioni sulla Route Umbwe?',
          bullets: [
            "L'acclimatazione è limitata, il che aumenta la sfida. Questo itinerario non è ideale per gli escursionisti alle prime armi in alta quota.",
            'Le guide raccomandano escursioni di pre-acclimatazione o un allenamento in alta quota se scegli Umbwe.',
            'Il tasso di successo in vetta è più basso rispetto agli itinerari più lunghi, ma gli escursionisti robusti con un buon ritmo e una buona idratazione riescono spesso bene.',
            'Per chi ha esperienza di trekking tecnico, la Barranco Wall è una sezione divertente e pittoresca, non una scalata spaventosa.',
            'La durata più breve significa meno giorni di ferie o di viaggio — ma richiede anche una migliore condizione fisica.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Umbwe',
  secondaryTagline: 'Il sentiero ripido verso la solitudine e la gloria della vetta.',
  faqHeading: '10 Domande sulla Route Umbwe',
  faqs: [
    {number: 1, question: 'Quanto tempo ci vuole per scalare il Kilimangiaro tramite la Route Umbwe?', answer: 'La Route Umbwe richiede generalmente 6 giorni, includendo il giorno della vetta e la discesa. Alcuni scalatori optano per una versione di 7 giorni per lasciare più tempo per acclimatarsi, sebbene 6 giorni sia la norma.'},
    {number: 2, question: 'La Route Umbwe è difficile?', answer: 'Sì — Umbwe è considerata l\'itinerario non tecnico più difficile del Kilimangiaro. La sua salita ripida e rapida lascia poco tempo per l\'acclimatazione, rendendola più adatta agli escursionisti esperti e in buona forma fisica.'},
    {number: 3, question: 'Qual è il tasso di successo per la Route Umbwe?', answer: 'A causa della sua breve durata e del suo profilo ripido, il tasso di successo in vetta è più basso rispetto agli itinerari più lunghi — spesso intorno al 60-70%. Giorni supplementari di acclimatazione possono migliorare le tue possibilità.'},
    {number: 4, question: 'La Route Umbwe è affollata?', answer: 'Per niente. È uno degli itinerari meno frequentati della montagna. Godrai di sentieri tranquilli e campeggi pacifici, in particolare nelle prime tappe prima di unirti ad altri itinerari a Barranco.'},
    {number: 5, question: 'La Route Umbwe è pittoresca?', answer: "È incredibilmente pittoresca! L'itinerario sale attraverso una foresta pluviale densa, creste spettacolari e valli profonde, offrendo viste panoramiche fin dall'inizio del trekking e panorami magnifici lungo tutto il percorso."},
    {number: 6, question: 'Dove si dorme sulla Route Umbwe?', answer: 'Alloggerai in campeggi allestiti dal tuo team di supporto. A differenza della Route Marangu, che utilizza rifugi, Umbwe è un\'esperienza interamente in campeggio.'},
    {number: 7, question: 'I principianti possono fare la Route Umbwe?', answer: "Non è consigliata per i principianti. L'itinerario è fisicamente impegnativo e ha un tempo di acclimatazione limitato. Se sei alle prime armi nel trekking d'alta quota, un itinerario più lungo e progressivo come Lemosho o Machame sarà più adatto."},
    {number: 8, question: 'Qual è il periodo migliore per scalare tramite la Route Umbwe?', answer: 'I mesi migliori sono gennaio-marzo e giugno-ottobre, che offrono tempo asciutto e cielo sereno. Anche dicembre è possibile, sebbene leggermente più umido.'},
    {number: 9, question: 'La Route Umbwe si unisce ad altri sentieri?', answer: 'Sì. Intorno a Barranco Camp, la Route Umbwe si unisce alle Route Machame e Lemosho, condividendo il circuito sud verso la vetta e ridiscendendo tramite la Route Mweka.'},
    {number: 10, question: 'Perché scegliere la Route Umbwe rispetto ad altre?', answer: "Scegli Umbwe se desideri una scalata più difficile, remota e pittoresca con meno affluenza. È ideale per gli escursionisti in cerca di solitudine, paesaggi spettacolari e una durata totale più breve — preparati semplicemente per l'intensità."},
  ],
}

const northernCircuit: RouteIt = {
  slug: 'northern-circuit-route',
  name: 'Route Northern Circuit',
  seoTitle: 'Route Northern Circuit | Climbing Kilimanjaro Tanzania',
  seoDescription:
    "Scala il Kilimangiaro tramite la Route Northern Circuit, l'itinerario più lungo e pittoresco con il tasso di successo più alto. Itinerario giorno per giorno reale, tariffe e consigli di esperti.",
  heroHeading: 'Route Northern Circuit sul Monte Kilimangiaro',
  heroTagline: "L'itinerario più popolare verso la vetta del Kilimangiaro",
  heroBody: [
    "La Route Northern Circuit è l'itinerario più lungo e pittoresco del Monte Kilimangiaro, offrendo viste impareggiabili e il tasso di successo più alto tra tutti gli itinerari. Facendo quasi il giro completo della montagna, permette un'eccellente acclimatazione, il che la rende ideale per gli escursionisti in cerca di una scalata più progressiva con meno affluenza.",
    "Scoprirai tutto, dalla lussureggiante foresta pluviale e la brughiera alpina agli altopiani accidentati e ai vasti cieli aperti sui versanti nord — una regione che pochi hanno l'occasione di vedere. Con la sua bellezza remota e il suo ritmo strategico, il Northern Circuit offre un'esperienza di trekking premium per chi dispone di tempo e di uno spirito d'avventura.",
  ],
  heroImage: {src: '/images/routes/northern-circuit/hero.jpg', alt: "Tende a Mweka Camp con la vetta del Kibo all'alba"},
  itineraryHeading: 'Itinerario della Route Northern Circuit',
  itinerarySubheading: 'Andare lontano per andare più in alto',
  daysLabel: '9 Giorni',
  stops: [
    arrivalStopIt,
    {
      label: 'Giorno di Trekking 1: Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2.100 m/6.890 piedi) → Mti Mkubwa Camp (2.650 m/8.692 piedi)', '📈 Dislivello positivo: 550 m / 1.800 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Il tuo trekking inizia con un tragitto fino a Londorossi Gate per la registrazione, seguito da una camminata dolce attraverso la lussureggiante foresta pluviale, che ospita colobi e una ricca avifauna. Arriva a Mti Mkubwa (Big Tree) Camp per la tua prima notte sotto le stelle.'],
    },
    {
      label: 'Giorno di Trekking 2: Mti Mkubwa Camp – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m/11.843 piedi)', '📈 Dislivello positivo: 960 m / 3.151 piedi', '⏳ Durata: 6-7 ore'],
      body: ['Esci dalla foresta per entrare nella zona di erica e brughiera, dove il paesaggio si apre con viste sul picco Kibo. Goditi un\'escursione tranquilla attraverso il plateau dello Shira per raggiungere il tuo campo.'],
    },
    {
      label: 'Giorno di Trekking 3: Shira 1 Camp – Shira 2 Camp',
      meta: ['📍 Shira 1 Camp (3.610 m) → Shira 2 Camp (3.850 m/12.631 piedi)', '📈 Dislivello positivo: 240 m / 787 piedi', '⏳ Durata: 3-4 ore'],
      body: ['Un breve trekking attraverso il vasto plateau aperto della Shira Ridge ti lascia il tempo di riposare e acclimatarti. Se il tempo lo permette, avrai viste panoramiche sul Kibo e sul Monte Meru in lontananza.'],
    },
    {
      label: 'Giorno di Trekking 4: Shira 2 Camp – Lava Tower – Moir Hut',
      meta: [
        '📍 Shira 2 (3.850 m) → Lava Tower (4.630 m/15.190 piedi) → Moir Hut (4.200 m/13.780 piedi)',
        '📈 Dislivello positivo: 780 m / 2.559 piedi',
        '📉 Dislivello negativo: 430 m / 1.410 piedi',
        '⏳ Durata: 6-7 ore',
      ],
      body: ['Oggi include una salita fino a Lava Tower — un punto chiave di acclimatazione — prima di ridiscendere leggermente verso Moir Hut, remoto e tranquillo, situato in una valle d\'alta quota.'],
    },
    {
      label: 'Giorno di Trekking 5: Moir Hut – Buffalo Camp',
      meta: ['📍 Moir Hut (4.200 m) → Buffalo Camp (4.020 m/13.189 piedi)', '📉 Dislivello negativo: 180 m / 591 piedi', '⏳ Durata: 5-7 ore'],
      body: ['Cammina lungo i raramente visti versanti nord del Kilimangiaro, con viste panoramiche verso le pianure keniote. Il percorso è selvaggio e tranquillo — è qui che il Northern Circuit guadagna la sua reputazione.'],
    },
    {
      label: 'Giorno di Trekking 6: Buffalo Camp – Third Cave Camp',
      meta: ['📍 Buffalo Camp (4.020 m) → Third Cave (3.870 m/12.697 piedi)', '📉 Dislivello negativo: 150 m / 492 piedi', '⏳ Durata: 5-6 ore'],
      body: ["Un'altra giornata di trekking dolce attraverso il deserto alpino. Continuando verso est, il senso di isolamento è impareggiabile. Sistemati a Third Cave Camp e preparati per lo sforzo finale."],
    },
    {
      label: 'Giorno di Trekking 7: Third Cave Camp – School Hut',
      meta: ['📍 Third Cave (3.870 m) → School Hut (4.750 m/15.584 piedi)', '📈 Dislivello positivo: 880 m / 2.887 piedi', '⏳ Durata: 4-5 ore'],
      body: ['Una giornata più breve con una salita regolare verso School Hut, la tua ultima base prima del tentativo di vetta. Arriva presto per la cena e il riposo prima della tua scalata di mezzanotte.'],
    },
    {
      label: 'Giorno di Trekking 8: School Hut – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 School Hut (4.750 m) → Uhuru Peak (5.895 m/19.341 piedi) → Mweka Camp (3.110 m/10.204 piedi)',
        '📈 Dislivello positivo: 1.145 m / 3.757 piedi',
        '📉 Dislivello negativo: 2.785 m / 9.137 piedi',
        '⏳ Durata: 12-15 ore',
      ],
      body: ["Giorno della vetta! Inizia la tua scalata verso mezzanotte, raggiungi Stella Point all'alba, poi spingi fino a Uhuru Peak, il punto più alto d'Africa. Dopo aver festeggiato, ridiscendi a Mweka Camp per un riposo ben meritato."],
    },
    {
      label: 'Giorno di Trekking 9: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m) → Mweka Gate (1.640 m/5.380 piedi)', '📉 Dislivello negativo: 1.470 m / 4.823 piedi', '⏳ Durata: 3-4 ore'],
      body: ["Un'ultima escursione attraverso la foresta pluviale ti conduce a Mweka Gate, dove firmerai la tua partenza, riceverai il tuo certificato di vetta, e tornerai a Moshi per festeggiare e riposarti."],
    },
    departureStopIt,
  ],
  infoTabsHeading: 'Perché Scegliere il Northern Circuit?',
  tabs: [
    {
      id: 'duration',
      label: 'Durata del Viaggio',
      blocks: [
        {
          heading: 'Quali sono i vantaggi di scegliere la Route Northern Circuit?',
          bullets: [
            'Il tasso di successo più alto grazie al suo periodo di acclimatazione prolungato.',
            "L'itinerario più lungo del Kilimangiaro (9 giorni), che offre più tempo per adattarsi e godersi il viaggio.",
            'Paesaggi spettacolari da ogni angolazione — lussureggiante foresta pluviale, plateau dello Shira e natura selvaggia del nord.',
            'Pochissima affluenza — raramente vedrai altri gruppi prima della notte della vetta.',
            'Ideale per gli escursionisti esperti o per chi desidera un ritmo più rilassato.',
            'Ottima possibilità di osservare la fauna selvatica, tra cui eland e bufali, sui versanti inferiori.',
          ],
        },
        {
          heading: 'Quanto tempo ci vuole per percorrere la Route Northern Circuit?',
          paragraphs: [
            'Giorni totali sulla montagna: 9. Giorni di salita: 8 (con un dislivello progressivo). Giorno di discesa: 1. Questo tempo supplementare migliora notevolmente il successo in vetta permettendo al tuo corpo di adattarsi naturalmente all\'altitudine.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Dettaglio delle Tariffe',
      blocks: [
        {
          heading: 'Qual è il costo associato alla Route Northern Circuit?',
          paragraphs: [
            'I prezzi del Northern Circuit di 9 giorni includono generalmente:',
            '💵 Fascia stimata: 2.500 $ a 3.700 $ a persona, a seconda della dimensione del gruppo e della qualità dell\'operatore.',
          ],
          bullets: [
            'Tutte le tasse di parco, permessi e imposte',
            'Guide di montagna professionali, portatori e cuochi',
            'Pensione completa sulla montagna (pasti, acqua purificata, snack)',
            'Attrezzatura da campeggio (tende, materassini, tenda ristorante, ecc.)',
            'Trasferimenti aeroportuali e soggiorni in hotel prima/dopo la scalata',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Dove Alloggerai',
      blocks: [
        {
          heading: 'Quali sono i campeggi lungo la Route Northern Circuit?',
          bullets: [
            'Campeggio per tutto il percorso – non ci sono rifugi su questo itinerario.',
            'Tende di montagna 3 stagioni confortevoli con materassini in schiuma.',
            'Tende toilette private e tende ristorante per gli operatori di fascia alta.',
            'I campeggi sono tranquilli, pittoreschi e meno frequentati rispetto ad altri itinerari.',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Popolarità e Affluenza',
      blocks: [
        {
          heading: 'La Route Northern Circuit è Affollata?',
          bullets: [
            'Il Northern Circuit è l\'itinerario meno frequentato del Kilimangiaro.',
            'Perfetto per gli escursionisti che preferiscono un sentiero più remoto e tranquillo.',
            'Vedrai meno gruppi finché non ti unirai ai sentieri Marangu/Machame vicino alla vetta.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Opinioni di Esperti',
      blocks: [
        {
          heading: 'Quali sono le nostre impressioni sulla Route Northern Circuit?',
          bullets: [
            'Consigliato per fotografi e amanti della natura che desiderano vedere tutti i lati del Kilimangiaro.',
            'Con la sua durata di 9 giorni, è ideale per gli escursionisti preoccupati per il mal di montagna.',
            'Sebbene non tecnicamente difficile, avrai bisogno di una buona resistenza per le lunghe giornate.',
            'Offre un\'esperienza di natura selvaggia unica, lontano dai principali sentieri turistici.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Route Northern Circuit',
  secondaryTagline: 'Il percorso pittoresco verso la vetta – Andare lontano per andare più in alto.',
  faqHeading: '10 Domande sulla Route Northern Circuit',
  faqs: [
    {number: 1, question: 'Quanto tempo richiede la Route Northern Circuit?', answer: "La Route Northern Circuit richiede generalmente 9-10 giorni. Questa durata consente un'adeguata acclimatazione, aumentando notevolmente le possibilità di successo in vetta al Kilimangiaro."},
    {number: 2, question: 'È difficile scalare il Kilimangiaro tramite il Northern Circuit?', answer: "È un lungo trekking, ma l'acclimatazione graduale lo rende gestibile per i principianti in buona forma fisica."},
    {number: 3, question: 'Qual è il tasso di successo in vetta su questo itinerario?', answer: 'Circa il 90-95%, il più alto tra tutti gli itinerari grazie a un guadagno di altitudine progressivo.'},
    {number: 4, question: 'Qual è il periodo migliore per scalare tramite il Northern Circuit?', answer: 'Gennaio-marzo e giugno-ottobre offrono il tempo migliore e le migliori condizioni del sentiero.'},
    {number: 5, question: 'Il Northern Circuit è più costoso di altri itinerari?', answer: "Sì, poiché è più lungo e più remoto — ma l'esperienza è impareggiabile."},
    {number: 6, question: "Ho bisogno di un'esperienza di trekking precedente?", answer: 'No, ma una buona condizione fisica e una buona preparazione sono essenziali.'},
    {number: 7, question: 'Quale fauna potrei osservare?', answer: 'Scimmie blu, colobi, bufali, e talvolta elefanti sui versanti inferiori.'},
    {number: 8, question: 'Il Northern Circuit è affollato?', answer: "No. È l'itinerario più tranquillo con un'affluenza molto bassa."},
    {number: 9, question: 'È un itinerario in campeggio?', answer: 'Sì, tutte le notti si passano in tenda. Nessun rifugio è disponibile.'},
    {number: 10, question: "Posso noleggiare l'attrezzatura sul posto?", answer: 'Sì, la maggior parte degli operatori affidabili offre attrezzatura a noleggio di alta qualità a Moshi o Arusha.'},
  ],
}

const routesIt: RouteIt[] = [machame, marangu, lemosho, rongai, umbwe, northernCircuit]

// ---------- routesHubPage-it ----------

async function seedRoutesHubIt() {
  const cards = [
    {title: 'Route Machame', slug: 'machame-route', summary: "Conosciuta come Whiskey Route, Machame è l'itinerario più popolare del Kilimangiaro, che offre paesaggi mozzafiato e un terreno vario. Sebbene impegnativa, con sentieri ripidi e campeggi in tenda, offre un'ottima acclimatazione per gli scalatori in cerca di un trek più breve ma gratificante.", image: {src: '/images/routes/hub/card-machame.png', alt: 'Mappa illustrata della Route Machame'}},
    {title: 'Route Lemosho', slug: 'lemosho-route', summary: "Uno degli itinerari più pittoreschi del Kilimangiaro, Lemosho inizia all'isolata Londorossi Gate, attraversando il magnifico plateau dello Shira. Questo itinerario offre una scalata tranquilla con viste spettacolari, una fauna ricca e una salita progressiva per un'esperienza confortevole.", image: {src: '/images/routes/hub/card-lemosho.png', alt: 'Mappa illustrata della Route Lemosho'}},
    {title: 'Route Rongai', slug: 'rongai-route', summary: 'Unico itinerario settentrionale del Kilimangiaro, Rongai è meno frequentato e più dolce, il che lo rende una scelta eccellente per chi preferisce una scalata calma e regolare. Questo itinerario è ideale durante la stagione delle piogge poiché riceve meno precipitazioni e offre un trekking piacevole attraverso una natura selvaggia incontaminata.', image: {src: '/images/routes/hub/card-rongai.png', alt: 'Mappa illustrata della Route Rongai'}},
    {title: 'Route Northern Circuit', slug: 'northern-circuit-route', summary: "L'itinerario più lungo e più pittoresco, il Northern Circuit offre la migliore acclimatazione girando progressivamente attorno al Kilimangiaro. Con viste panoramiche e un alto tasso di successo, questo itinerario offre un'esperienza di trekking tranquilla e immersiva.", image: {src: '/images/routes/hub/card-northern-circuit.png', alt: 'Mappa illustrata della Route Northern Circuit'}},
  ]
  await client.createOrReplace({
    _id: 'routesHubPage-it',
    _type: 'routesHubPage',
    language: 'it',
    seo: {_type: 'seo', title: 'Itinerari di Scalata del Kilimangiaro | Climbing Kilimanjaro Tanzania', description: 'Confronta i migliori itinerari per scalare il Monte Kilimangiaro — Machame, Lemosho, Rongai e il Northern Circuit — con itinerari reali e consigli di esperti.'},
    hero: {eyebrow: "Il Tetto dell'Africa.", heading: 'I Migliori Itinerari per Scalare il Kilimangiaro', locationPill: 'Nord della Tanzania'},
    ctaBandButtons: [
      {_type: 'ctaButton', _key: key(), label: 'Richiedi un Preventivo Ora', href: '/request-a-quote-tanzania-safari/', variant: 'solid'},
      {_type: 'ctaButton', _key: key(), label: 'Parla con il Nostro Esperto', href: 'https://wa.me/255767140150', variant: 'outline'},
    ],
    promoSection: {heading: 'Cosa Sapere Prima di Scalare il Kilimangiaro', exploreLabel: 'Esplora Tutte le Informazioni', exploreHref: '/kilimanjaro-climbing-guide/'},
    tabsHeading: 'Itinerari e Mappe di Scalata del Kilimangiaro',
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'routeHubCard', _key: key(), title: card.title, routeSlug: card.slug, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
    testimonials: [
      {name: 'Obazee', date: '2023-11-28', quote: 'La scalata di una vita! La nostra scalata del Kilimangiaro con Asili Explorer African Safaris è stata davvero straordinaria! Dall\'inizio alla fine, il team ha garantito un\'esperienza indimenticabile, rendendo il nostro viaggio verso la vetta fluido, sicuro e memorabile.'},
      {name: 'Romy H', date: '2023-11-28', quote: 'Non sorprende che Asili Explorer African Safaris mantenga una reputazione a 5 stelle. La loro competenza, professionalità e impegno verso la soddisfazione del cliente li distinguono. Se cerchi la migliore agenzia di trekking al Kilimangiaro, non cercare oltre!'},
      {name: 'Rony V', date: '2023-12-27', quote: 'Nell\'ottobre 2023, abbiamo effettuato un trekking di sei giorni fino alla vetta del Kilimangiaro con Asili Explorer African Safaris. L\'esperienza è stata fenomenale, e lo consiglio vivamente a chiunque stia considerando questa avventura.'},
      {name: 'Avdb', date: '2023-11-28', quote: 'Joe è stato una guida e un autista perfetto. Ci ha fatto visitare e scoprire la vera fauna della Tanzania. Niente era troppo complicato per lui. La sua conoscenza di tutti i luoghi principali dei diversi animali è impressionante.'},
    ].map((t) => ({_type: 'hubTestimonial', _key: key(), name: t.name, date: t.date, quote: t.quote})),
    faqHeading: 'Domande Frequenti',
    faqSubheading: 'Le Tue Domande e le Nostre Risposte',
    faqIntro: "Hai domande sulla prenotazione di un safari in Tanzania con noi? Consulta le nostre FAQ qui sotto per risposte rapide. Se non trovi quello che cerchi, non esitare a contattarci — i nostri esperti sono qui per aiutarti a pianificare l'avventura tanzaniana perfetta.",
    faqs: [
      {question: 'Quali itinerari sono disponibili per il Kilimangiaro?', answer: "Il Monte Kilimangiaro offre diversi itinerari adatti a scalatori di ogni livello, preferenza e stile di trekking. Presso Asili Explorer African Safaris, siamo specializzati nei quattro itinerari più popolari del Kilimangiaro: Rongai Route, Lemosho Route, Northern Circuit Route e Machame Route. Le nostre scalate guidate garantiscono sicurezza, un'acclimatazione adeguata e un viaggio indimenticabile fino alla vetta."},
      {question: "Qual è l'itinerario del Kilimangiaro meno frequentato?", answer: "La Northern Circuit Route è la meno frequentata, offrendo un'esperienza di trekking tranquilla e isolata."},
      {question: "Qual è l'itinerario più facile per scalare il Kilimangiaro?", answer: 'La Rongai Route è considerata la più facile grazie ai suoi pendii progressivi e alla sua ascesa diretta.'},
      {question: 'Qual è l\'itinerario del Kilimangiaro più pittoresco?', answer: 'La Lemosho Route è spesso considerata la più pittoresca, con paesaggi mozzafiato, ecosistemi vari e viste panoramiche.'},
      {question: 'Quanto costa scalare il Kilimangiaro?', answer: "Il costo della scalata del Kilimangiaro varia da 2.500 $ a 4.000 $, a seconda della scelta dell'itinerario, della durata, della dimensione del gruppo, del livello di servizio e delle prestazioni incluse. Presso Asili Explorer African Safaris, garantiamo guide ben formate, standard di sicurezza elevati e un'esperienza complessiva eccezionale."},
      {question: 'Quanto tempo ci vuole per scalare il Monte Kilimangiaro?', answer: "La scalata richiede generalmente da 6 a 9 giorni, a seconda dell'itinerario scelto. Un itinerario più lungo permette una migliore acclimatazione, aumentando le possibilità di un'esperienza di vetta riuscita e piacevole."},
      {question: 'I principianti possono scalare il Monte Kilimangiaro?', answer: 'Sì! Sebbene non sia richiesta alcuna competenza tecnica di arrampicata, i principianti devono seguire un allenamento fisico adeguato prima di tentare la scalata. Le nostre guide esperte assicurano che gli scalatori principianti ricevano il supporto e l\'accompagnamento necessari durante tutto il viaggio.'},
      {question: 'Qual è il periodo migliore per scalare il Monte Kilimangiaro?', answer: 'Le migliori stagioni per scalare il Kilimangiaro sono i mesi secchi: da gennaio a marzo e da giugno a ottobre. Questi mesi offrono le migliori condizioni meteorologiche, un cielo più sereno e un\'esperienza di trekking più piacevole.'},
      {question: 'Serve una guida per scalare il Kilimangiaro?', answer: 'Sì! La scalata del Kilimangiaro senza una guida autorizzata non è consentita. Le guide apportano la loro competenza, monitorano la tua salute, garantiscono la tua sicurezza e ti aiutano a orientarti nel terreno impegnativo del Kilimangiaro — anche gli scalatori esperti devono averne una.'},
      {question: 'Qual è il livello di difficoltà per scalare il Monte Kilimangiaro?', answer: "Scalare il Monte Kilimangiaro è un'avventura impegnativa ma gratificante. La principale difficoltà deriva dall'alta quota e dal terreno vario. Con una buona preparazione, un itinerario ben pianificato e un accompagnamento esperto, scalatori di diversi livelli di esperienza possono raggiungere la vetta con successo."},
      {question: 'Come si dorme sul Kilimangiaro?', answer: 'Durante il tuo trekking sul Kilimangiaro, alloggerai in tende di alta qualità, resistenti alle intemperie e progettate per il comfort in condizioni estreme, con tende spaziose, materassini isolanti e sacchi a pelo caldi per una notte riposante nei nostri campeggi designati.'},
      {question: 'Serve ossigeno per scalare il Kilimangiaro?', answer: "La maggior parte degli scalatori non ha bisogno di ossigeno supplementare per scalare il Kilimangiaro. La chiave per una scalata di successo è una buona acclimatazione. Nei rari casi di grave mal di montagna, l'ossigeno è disponibile per motivi di sicurezza."},
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  })
  console.log('routesHubPage-it created/replaced')
}

async function routeToFieldsIt(data: RouteIt) {
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
  for (const route of routesIt) {
    const enId = await findEnId(client, 'route', route.slug)
    if (!enId) {
      console.log(`SKIP ${route.slug}: no en source found`)
      continue
    }
    const fields = await routeToFieldsIt(route)
    const itId = await upsertTranslatedDoc(client, 'route', route.slug, 'it', fields)
    await linkTranslationMetadata(client, 'route', [
      {language: 'en', id: enId},
      {language: 'it', id: itId},
    ])
    console.log(`${route.slug}-it done (${itId})`)
  }
  await seedRoutesHubIt()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
