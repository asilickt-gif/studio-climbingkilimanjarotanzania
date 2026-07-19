/**
 * Phase 6 (Italian): blogIndexPage (singleton), the one blogPost (Iringa),
 * destinationsPage (singleton), and the one destinationDetail (Serengeti).
 * Mirrors seed-fr-blog-destinations.ts's structure but with Italian text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-blog-destinations.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedBlogIndexIt() {
  await client.createOrReplace({
    _id: 'blogIndexPage-it',
    _type: 'blogIndexPage',
    language: 'it',
    seo: {_type: 'seo', title: 'Blog | Asili Climbing Kilimanjaro', description: 'Consigli di viaggio, guide alle destinazioni e racconti dalla Tanzania — scalate del Kilimangiaro, safari e molto altro, a cura di Asili Climbing Kilimanjaro.'},
    heading: 'Il Nostro Blog di Viaggio',
    intro: "Racconti, consigli e guide per aiutarti a pianificare la tua avventura in Tanzania — dalla scalata del Kilimangiaro alla scoperta dei tesori nascosti del paese.",
  })
  console.log('blogIndexPage-it created/replaced')
}

async function seedIringaBlogPostIt() {
  const slug = '5-reasons-you-should-visit-iringa-in-2025-2026'
  const enId = await findEnId(client, 'blogPost', slug)
  if (!enId) {
    console.log(`SKIP blogPost-it: no en source for ${slug}`)
    return
  }
  const sections = [
    {
      heading: '1. Immergiti nel Ricco Mosaico Culturale di Iringa',
      body: "Iringa vibra di una ricchezza culturale, offrendo uno scorcio sulle tradizioni delle tribù locali come i Maasai e gli Hehe. Gli edifici in stile coloniale della città ti riportano indietro nel tempo — entra nell'Old Boma, un'antica fortezza tedesca trasformata in museo, per scoprire i racconti del passato di Iringa. Avventurati con noi nei villaggi vicini per incontrare abitanti calorosi, lasciarti trasportare dalle danze tradizionali e partecipare a esperienze culturali immersive. Questi momenti autentici ti permettono di vivere alla tanzaniana, creando ricordi che durano ben oltre il tuo viaggio.",
    },
    {
      heading: 'Meravigliati Davanti a Meraviglie Naturali Mozzafiato',
      body: "I paesaggi di Iringa sono un sogno per gli amanti della natura, che uniscono vaste savane, colline ondulate e foreste lussureggianti in uno scenario mozzafiato. Unisciti a noi al parco nazionale di Ruaha, il più grande santuario di fauna selvatica della Tanzania, per safari emozionanti. Osserva elefanti, leoni, giraffe e un'avifauna sgargiante in un ambiente sereno e poco frequentato. Per gli escursionisti, il parco nazionale dei monti Udzungwa ti aspetta con i suoi sentieri nella foresta pluviale, le sue cascate scintillanti e le sue specie rare. Fai trekking fino a punti panoramici e immergiti nella calma della natura.",
    },
    {
      heading: '3. Torna Indietro nel Tempo con la Storia di Iringa',
      body: "Le radici storiche di Iringa sono profonde, offrendo racconti che affascinano i viaggiatori curiosi. Visita il sito preistorico di Isimila, dove antichi strumenti e fossili rivelano la vita umana primitiva vecchia di milioni di anni — un'opportunità rara di toccare le origini dell'umanità. Al museo Old Boma, immergiti nell'eredità del popolo Hehe e nella sua audace resistenza al regime coloniale.",
    },
    {
      heading: '4. Festeggia ai Vivaci Festival di Iringa',
      body: "Pianifica la tua visita per farla coincidere con i vivaci festival culturali di Iringa, come il festival culturale annuale di Iringa ad agosto. Questo evento pieno di colore è ricco di musica tradizionale, danze avvincenti e arte locale, che mettono in risalto il patrimonio tanzaniano. Assapora piatti autentici e scambia due parole con gli abitanti per assaporare il vero spirito di Iringa.",
    },
    {
      heading: '5. Scopri il Fascino Incontaminato di Iringa',
      body: "La magia di Iringa risiede nel suo fascino fuori dai sentieri battuti, lontano dalle folle turistiche. Qui ti connetterai profondamente con le comunità locali, una natura incontaminata e tradizioni autentiche. Unisciti a noi per tour comunitari o progetti di volontariato a sostegno di iniziative sostenibili, dalla conservazione all'artigianato. Questa esperienza autentica arricchisce il tuo viaggio e lascia un'impronta positiva a Iringa.",
    },
    {
      heading: 'Perché Iringa Brilla di Mille Luci',
      body: "Iringa unisce profondità culturale, splendore naturale e autenticità incontaminata per un'avventura tanzaniana senza pari. Che tu sia attratto da tradizioni vibranti, emozioni faunistiche o storie nascoste, Asili Climbing Kilimanjaro progetta viaggi che superano i tuoi sogni più sfrenati. Non aspettare oltre — pianifica ora la tua fuga a Iringa nel 2025/2026! Contattaci per iniziare la tua avventura.",
    },
  ]
  const faqs = [
    {q: 'Qual è il periodo migliore per visitare Iringa?', a: "La stagione secca (da giugno a ottobre) è ideale per Iringa, con un clima mite ed eccellenti opportunità di osservazione della fauna al parco nazionale di Ruaha. La stagione delle piogge svela paesaggi rigogliosi per una prospettiva rinnovata. Organizziamo viaggi tutto l'anno."},
    {q: 'Quali esperienze culturali uniche ti aspettano a Iringa?', a: "Soggiorna presso famiglie Maasai per vivere le loro tradizioni, dalla lavorazione delle perline all'allevamento del bestiame. Non perdere il festival culturale di Iringa ad agosto per la sua musica, le sue danze e i suoi sapori locali."},
    {q: 'Quali sono le principali attrazioni di Iringa?', a: "Il parco nazionale di Ruaha incanta con la sua fauna, mentre il sito preistorico di Isimila offre uno scorcio sulla storia antica. Il museo Old Boma svela il passato coloniale di Iringa."},
    {q: 'Quali avventure all\'aperto posso vivere a Iringa?', a: 'Fai trekking sul monte Nyoni per viste epiche o esplora gli altopiani di Kilolo per il birdwatching. I parchi di Ruaha e Udzungwa offrono safari e sentieri in abbondanza.'},
    {q: 'Quale fauna vedrò a Iringa?', a: 'Il parco nazionale di Ruaha è ricco di elefanti, leoni, ghepardi e oltre 570 specie di uccelli, oltre a zebre e antilopi rare.'},
    {q: 'Posso visitare una piantagione di tè a Iringa?', a: 'Sì! Scopri la cultura del tè di Iringa con visite alle piantagioni, imparando i segreti della coltivazione e degustando infusi freschi.'},
    {q: 'Esistono mercati locali da visitare?', a: "I mercati di Iringa sono ricchi di prodotti freschi, artigianato e souvenir come le perline. Contratta per scovare tesori e assaggia lo street food."},
    {q: 'Com\'è la gastronomia di Iringa?', a: "Assapora piatti tanzaniani immancabili come l'ugali e il nyama choma, oltre a piatti internazionali nei ristoranti locali e dai venditori ambulanti."},
    {q: 'Come spostarsi con i mezzi pubblici a Iringa?', a: 'Prendi i bus dala dala, i taxi o i bajaji (tuk-tuk) per spostarti facilmente. Per i luoghi più remoti, offriamo trasferimenti privati per maggiore comfort e comodità.'},
    {q: 'Posso fare volontariato a Iringa?', a: 'Assolutamente! Sostieni scuole, progetti di conservazione o comunitari — possiamo metterti in contatto con opportunità di volontariato arricchenti.'},
    {q: 'Dove posso alloggiare a Iringa?', a: 'Da accoglienti guest house a lodge di lusso, Iringa ha di tutto — prenotiamo i migliori alloggi in base al tuo budget.'},
    {q: 'Iringa è sicura per i viaggiatori?', a: 'Iringa è generalmente sicura, ma resta vigile. Tieni d\'occhio i tuoi effetti personali, usa taxi affidabili e rispetta le usanze locali.'},
    {q: 'Cosa posso acquistare a Iringa?', a: 'Fai shopping nei mercati per artigianato, tessuti e ceramiche, oppure visita i negozi per articoli moderni.'},
    {q: 'Come arrivare a Iringa da Dar es Salaam?', a: "Prendi un volo per l'aeroporto di Iringa, un autobus, o noleggia un'auto da Dar es Salaam — organizziamo trasferimenti senza intoppi."},
    {q: 'Quali documenti di viaggio mi servono per Iringa?', a: 'Munisciti di un passaporto (valido almeno 6 mesi) e verifica le regole del visto per la Tanzania. Potrebbe essere richiesta una prova di vaccinazione contro la febbre gialla.'},
    {q: 'Quali attività offre il parco nazionale di Ruaha?', a: 'Goditi safari fotografici, safari a piedi e birdwatching a Ruaha. Osserva elefanti, leoni e uccelli rari con guide esperte.'},
    {q: 'Quali lingue si parlano a Iringa?', a: "Lo swahili è la lingua principale, ma l'inglese è comune nel turismo. Imparare qualche frase in swahili è molto apprezzato."},
    {q: 'Quale valuta si usa a Iringa?', a: 'Lo scellino tanzaniano (TZS) è la valuta standard, ma il dollaro americano funziona nei luoghi turistici. Cambia il tuo denaro in banca per tassi equi.'},
    {q: 'Esistono strutture mediche a Iringa?', a: "Esistono ospedali e cliniche di base, ma i casi gravi potrebbero richiedere un trasferimento a Dar es Salaam. Un'assicurazione di viaggio è fortemente consigliata."},
    {q: 'Posso visitare scuole o comunità locali?', a: 'Sì! Incontra scuole o gruppi comunitari per scambi culturali — organizziamo visite rispettose.'},
  ]
  const fields = {
    seo: {_type: 'seo', title: '5 Motivi per Visitare Iringa nel 2025/2026 | Asili Climbing Kilimanjaro', description: "Vuoi un'avventura tanzaniana fuori dai sentieri battuti? Scopri 5 motivi irresistibili per visitare Iringa nel 2025/2026 — cultura, fauna, storia e festival."},
    title: '5 Motivi per Visitare Iringa nel 2025/2026',
    excerpt: "Vuoi un'avventura tanzaniana fuori dai sentieri battuti? Situata negli altopiani del sud, Iringa è un gioiello affascinante che non aspetta altro che conquistarti.",
    publishedDate: '2025-05-02',
    coverImage: await uploadImage(client, {src: '/images/destinations/ruaha.webp', alt: 'Branco di elefanti a un punto d\'acqua vicino al parco nazionale di Ruaha a Iringa'}),
    intro:
      "Vuoi un'avventura tanzaniana fuori dai sentieri battuti? Situata negli altopiani del sud, Iringa è un gioiello affascinante che non aspetta altro che conquistarti. Lontana dai soliti circuiti turistici, questa vivace destinazione promette momenti indimenticabili. Ancora indeciso? Ecco cinque motivi irresistibili per visitare Iringa nel 2025/2026 con Asili Climbing Kilimanjaro.",
    sections: sections.map((section) => ({_type: 'postSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
    faqHeading: 'Domande Frequenti',
    faqs: faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.q, answer: faq.a})),
  }
  const itId = await upsertTranslatedDoc(client, 'blogPost', slug, 'it', fields)
  await linkTranslationMetadata(client, 'blogPost', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`blogPost-it done (${itId})`)
}

async function seedDestinationsPageIt() {
  const destinations = [
    {
      name: 'Monte Kilimangiaro',
      image: {src: '/images/destinations/kilimanjaro.webp', alt: 'Elefante al pascolo con il Monte Kilimangiaro sullo sfondo'},
      body: "Con i suoi 5.895 metri, il Monte Kilimangiaro è la montagna indipendente più alta del mondo e un'esperienza imperdibile. A differenza di altre grandi vette, non è richiesta alcuna scalata tecnica, il che lo rende accessibile a escursionisti in buona forma fisica da tutto il mondo.",
      highlightsHeading: 'Punti Salienti',
      highlights: [
        'Diversi itinerari pittoreschi (Machame, Lemosho, Marangu, Rongai, Umbwe)',
        'Zone ecologiche variegate: foresta pluviale, brughiera, deserto alpino e vetta artica',
        "Trekking guidati da esperti con supporto completo dei portatori, assistenza per l'acclimatazione e strutture di campeggio di alto livello",
        'Una vetta al sorgere del sole sopra le nuvole da Uhuru Peak',
      ],
      bestTime: 'Gennaio-marzo, giugno-ottobre',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Asili propone scalate personalizzate del Kilimangiaro, che uniscono sicurezza, sostenibilità e viste indimenticabili.'],
    },
    {
      name: 'Parco Nazionale del Serengeti',
      href: '/serengeti-national-park/',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Pianure dorate del Serengeti'},
      body: 'Il Serengeti è il cuore dell\'esperienza del safari africano — infinite pianure dorate, spettacolari incontri tra predatori e prede, e la celebre Grande Migrazione. È una terra dove ogni safari fotografico racconta una nuova storia.',
      highlightsHeading: 'Migliori Esperienze Faunistiche',
      highlights: [
        'Assisti alla Grande Migrazione degli gnu, uno spettacolo che si svolge tutto l\'anno e coinvolge oltre 1,5 milioni di gnu e zebre alla ricerca di nuovi pascoli.',
        'Gli attraversamenti dei fiumi (luglio-settembre) sono emozionanti, con coccodrilli in agguato e mandrie che si tuffano in acqua.',
        'La stagione delle nascite (gennaio-marzo) è altrettanto spettacolare, con i predatori che prendono di mira i nuovi nati nelle pianure del sud.',
        'Eccellenti osservazioni di grandi felini — in particolare leoni, leopardi e ghepardi.',
        'Safari in mongolfiera sopra le pianure all\'alba (opzione supplementare).',
      ],
      bestTime: 'Giugno-ottobre (stagione secca, ideale per i predatori); gennaio-marzo (stagione delle nascite nella regione di Ndutu)',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Le nostre guide conoscono perfettamente gli schemi di migrazione e adattano i safari fotografici per avvicinarti all\'azione — senza la folla.'],
    },
    {
      name: 'Cratere del Ngorongoro',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Due rinoceronti nell\'erba al cratere del Ngorongoro'},
      body: 'Il cratere del Ngorongoro è la più grande caldera vulcanica intatta del mondo e un microcosmo della fauna africana. È uno dei rari luoghi in cui potresti osservare i Big Five in un solo giorno.',
      highlightsHeading: 'Migliori Esperienze',
      highlights: [
        'Scendi di 600 metri fino al lussureggiante fondo del cratere per un safari fotografico di un\'intera giornata.',
        'Osserva rinoceronti neri, ippopotami, leoni, zebre, bufali, sciacalli e fenicotteri.',
        'Un paesaggio spettacolare con pareti boscose, pianure erbose e un lago centrale.',
        'Visita i vicini villaggi Maasai per scambi culturali.',
      ],
      bestTime: 'Tutto l\'anno (la stagione secca offre una migliore visibilità)',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Personalizziamo la tua giornata al cratere con pic-nic pittoreschi e un accesso mattutino per evitare la folla.'],
    },
    {
      name: 'Parco Nazionale del Lago Manyara',
      image: {src: '/images/destinations/lake-manyara.webp', alt: 'Paesaggio del parco nazionale del lago Manyara'},
      body: 'Il lago Manyara è forse compatto, ma racchiude una varietà impressionante di habitat — dalle foreste di acque sotterranee alle pianure aperte, fino al lago alcalino stesso. È un\'introduzione ideale agli ecosistemi della Tanzania.',
      highlightsHeading: 'Principali Punti Salienti',
      highlights: [
        'Famoso per i suoi leoni che si arrampicano sugli alberi, un comportamento raro che non si vede nella maggior parte dei parchi',
        'Migliaia di fenicotteri e pellicani lungo le rive del lago',
        'Gruppi di babbuini, cercopitechi verdi, elefanti e ippopotami',
        'Canoa disponibile quando il livello dell\'acqua lo permette (stagionale)',
      ],
      bestTime: 'Giugno-ottobre per la fauna, novembre-marzo per il birdwatching',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Usiamo spesso Manyara come primo parco del tuo viaggio — è vicino ad Arusha e costituisce un perfetto riscaldamento prima di avventure più grandi.'],
    },
    {
      name: 'Parco Nazionale di Tarangire',
      image: {src: '/images/destinations/tarangire.jpg', alt: 'Parco nazionale di Tarangire con i suoi baobab'},
      body: 'Spesso trascurato, Tarangire è un gioiello ricco di fauna selvatica — in particolare durante la stagione secca, quando gli animali affluiscono verso il fiume Tarangire. È famoso per le sue immense mandrie di elefanti e i suoi maestosi baobab.',
      highlightsHeading: 'Migliori Osservazioni della Fauna',
      highlights: [
        'Immense mandrie di elefanti — a volte oltre 200 individui',
        'Grandi felini, giraffe, struzzi e a volte persino licaoni',
        'Oltre 500 specie di uccelli, che ne fanno un paradiso per il birdwatching',
        'Un paesaggio classico di acacie e baobab, perfetto per la fotografia',
      ],
      bestTime: 'Giugno-ottobre (stagione secca, quando i punti d\'acqua attirano la fauna)',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Includiamo spesso Tarangire nei nostri safari del circuito nord, in particolare per chi cerca meno folla e viste autentiche.'],
    },
    {
      name: 'Parco Nazionale di Nyerere',
      image: {src: '/images/destinations/nyerere.webp', alt: 'Zone umide del parco nazionale di Nyerere'},
      body: 'Nyerere è il più grande parco nazionale d\'Africa, con fiumi remoti, foreste e zone umide che si estendono a perdita d\'occhio nel sud della Tanzania. È ideale per i viaggiatori in cerca di un safari autentico e poco frequentato.',
      highlightsHeading: 'Attività di Safari Uniche',
      highlights: [
        'Safari in barca sul fiume Rufiji — osserva ippopotami, coccodrilli ed elefanti sulle rive',
        'Safari a piedi con ranger armati — traccia gli animali a piedi',
        'Safari fotografici con possibilità di osservare leoni, leopardi, elefanti e persino licaoni',
        'Meno turisti, incontri più autentici con la natura selvaggia',
      ],
      bestTime: 'Giugno-ottobre (stagione secca)',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Per i clienti in cerca di una connessione più lunga e profonda con l\'Africa selvaggia, ti aiutiamo a progettare estensioni a Nyerere fuori dai sentieri battuti.'],
    },
    {
      name: 'Parco Nazionale di Ruaha',
      image: {src: '/images/destinations/ruaha.webp', alt: 'Paesaggio del parco nazionale di Ruaha'},
      body: 'Ruaha è un segreto ben custodito, ideale per gli intenditori di safari. I suoi paesaggi autentici e la sua bassa affluenza turistica ne fanno una vera frontiera selvaggia. La densità della fauna è elevata e l\'azione dei predatori è intensa.',
      highlightsHeading: 'Cosa Rende Ruaha Unico',
      highlights: [
        'Immensi branchi di leoni (alcuni di oltre 20 individui!)',
        'Antilopi rare come l\'ippotrago nero, l\'ippotrago roano e il piccolo kudù',
        'Eccellenti osservazioni di leopardi, ghepardi e iene',
        'Un birdwatching fantastico — oltre 500 specie e paesaggi spettacolari',
      ],
      bestTime: 'Giugno-ottobre (stagione secca, osservazione della fauna facilitata)',
      bonusHeading: 'Il Plus di Asili',
      bonus: ['Per gli appassionati di fauna selvatica, possiamo combinare Ruaha con Nyerere per una vera avventura nel sud della Tanzania.'],
    },
    {
      name: 'Parco Nazionale di Mikumi',
      image: {src: '/images/destinations/mikumi.jpg', alt: 'Savana del parco nazionale di Mikumi'},
      body: 'Il parco nazionale di Mikumi è uno dei parchi safari più accessibili della Tanzania, situato a poche ore di auto da Dar es Salaam. È ideale per i viaggiatori con poco tempo a disposizione ma che desiderano comunque scoprire il lato selvaggio della Tanzania. Nonostante la sua accessibilità, Mikumi sorprende i visitatori con la sua ricca fauna e le sue savane aperte che ricordano quelle del Serengeti.',
      highlightsHeading: 'Migliori Osservazioni della Fauna',
      highlights: [
        'Leoni che si crogiolano nell\'erba alta o sui termitai',
        'Grandi mandrie di bufali, zebre e impala attraverso le pianure',
        'Elefanti nelle foreste di miombo',
        'Giraffe, ippopotami, gnu e facoceri',
        'Un eccellente birdwatching — oltre 400 specie, tra cui variopinti gruccioni e aquile',
      ],
      bestTime: 'Giugno-ottobre (stagione secca per la migliore concentrazione di fauna vicino ai punti d\'acqua); può anche essere apprezzato durante la stagione verde, in particolare dagli amanti degli uccelli',
      bonusHeading: 'Perché Scegliere Mikumi con Asili',
      bonus: [
        'Perfetto per safari di 2 giorni o nel weekend da Dar es Salaam',
        'Alloggi confortevoli all\'interno o nei pressi del parco',
        'Tour personalizzabili per viaggiatori singoli, famiglie o gruppi',
        'Può essere combinato con i monti Udzungwa o persino Ruaha per un safari prolungato nel sud della Tanzania',
        'Offriamo pacchetti safari flessibili a Mikumi con trasferimenti privati, safari fotografici con guide esperte, e la possibilità di personalizzare il tuo itinerario in base alle tue esigenze di viaggio.',
      ],
    },
    {
      name: 'Lago Natron',
      image: {src: '/images/destinations/lake-natron.jpg', alt: 'Zebre e fenicotteri al lago Natron'},
      body: "Il lago Natron è una delle destinazioni più surreali e sorprendenti della Tanzania. Situato nella Grande Rift Valley vicino al confine keniota, il lago è poco profondo, salato e di un colore rosso sorprendente. È il principale sito di riproduzione dei fenicotteri minori, e migliaia di essi tingono il lago di rosa durante la stagione della nidificazione. Ma non ci sono solo uccelli — il monte Ol Doinyo Lengai, l'unico vulcano carbonatitico attivo al mondo, si erge nelle vicinanze e offre un trekking unico (anche se impegnativo) per gli amanti dell'avventura. Natron ospita anche i Maasai semi-nomadi, e le visite culturali qui sono autentiche e senza fronzoli.",
      highlightsHeading: 'Migliori Esperienze',
      highlights: [
        'Osservare le immense colonie di fenicotteri sulle rive',
        'Fare trekking fino a cascate attraverso strette gole e sorgenti termali',
        'Visitare boma (villaggi) Maasai tradizionali',
        'Scalata opzionale dell\'Ol Doinyo Lengai (per escursionisti esperti)',
      ],
      bestTime: 'Giugno-ottobre (stagione secca; eccellente per il trekking e la fotografia). La stagione di riproduzione dei fenicotteri raggiunge il picco da settembre a novembre.',
      bonusHeading: 'Perché Visitare con Asili Climbing Kilimanjaro',
      bonus: [
        'Trekking e tour culturali guidati da esperti',
        'Un complemento unico ai safari del circuito nord o alle scalate del Kilimangiaro',
        'Un sostegno alle comunità Maasai locali',
      ],
    },
    {
      name: 'Lago Eyasi',
      image: {src: '/images/destinations/lake-eyasi.jpg', alt: 'Membri della tribù Hadzabe con archi tradizionali durante una spedizione di caccia'},
      body: "Il lago Eyasi non riguarda la grande fauna selvatica, ma un'immersione culturale profonda. È la destinazione ideale se sei curioso delle tribù indigene della Tanzania, in particolare gli Hadzabe, uno degli ultimi popoli cacciatori-raccoglitori d'Africa, e i Datoga, abili fabbri. La regione offre una rara occasione di connettersi con tradizioni appena modificate da migliaia di anni. Puoi partecipare a battute di caccia mattutine, osservare usanze ancestrali e scoprire tecniche di sopravvivenza anteriori alla civiltà moderna.",
      highlightsHeading: 'Migliori Esperienze',
      highlights: [
        'Un\'esperienza di caccia con gli Hadzabe, con arco e frecce',
        'Imparare la lavorazione tradizionale del metallo e la creazione di gioielli con i Datoga',
        'Passeggiate pittoresche lungo il lago e nella boscaglia circostante',
        'Birdwatching e fotografia al tramonto',
      ],
      bestTime: 'Tutto l\'anno — i tour culturali non dipendono dalle migrazioni animali né dalle condizioni meteorologiche',
      bonusHeading: 'Perché Visitare con Asili Climbing Kilimanjaro',
      bonus: [
        'Visite culturali responsabili e rispettose',
        'Traduttori e guide esperte per facilitare la comprensione',
        'Un complemento culturale ideale a un safari del nord o un trekking al Kilimangiaro',
      ],
    },
  ]

  await client.createOrReplace({
    _id: 'destinationsPage-it',
    _type: 'destinationsPage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: 'Destinazioni | Safari in Tanzania e Destinazioni del Kilimangiaro',
      description:
        'Esplora le migliori destinazioni della Tanzania con Asili Climbing Kilimanjaro: Monte Kilimangiaro, Serengeti, cratere del Ngorongoro, Tarangire, lago Natron e molto altro.',
    },
    heading: 'Destinazioni',
    destinations: await Promise.all(
      destinations.map(async (dest) => ({
        _type: 'destinationEntry',
        _key: key(),
        name: dest.name,
        ...(dest.href ? {href: dest.href} : {}),
        image: await uploadImage(client, dest.image),
        body: dest.body,
        highlightsHeading: dest.highlightsHeading,
        highlights: dest.highlights,
        bestTime: dest.bestTime,
        ...(dest.bonusHeading ? {bonusHeading: dest.bonusHeading} : {}),
        ...(dest.bonus?.length ? {bonus: dest.bonus} : {}),
      })),
    ),
  })
  console.log('destinationsPage-it created/replaced')
}

async function seedSerengetiDetailIt() {
  const slug = 'serengeti-national-park'
  const enId = await findEnId(client, 'destinationDetail', slug)
  if (!enId) {
    console.log(`SKIP destinationDetail-it: no en source for ${slug}`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Parco Nazionale del Serengeti | Climbing Kilimanjaro Tanzania', description: 'Tutto ciò che devi sapere per visitare il parco nazionale del Serengeti — attività, periodo migliore per visitarlo e foto autentiche.'},
    name: 'Parco Nazionale del Serengeti',
    hero: {
      eyebrow: 'Una Meraviglia Senza Fine',
      heading: 'Parco Nazionale del Serengeti',
      locationPill: 'Nord della Tanzania',
      backgroundImage: await uploadImage(client, {src: '/images/serengeti-national-park/serengeti-np.jpg', alt: 'Mandria di gnu nelle pianure del Serengeti'}),
    },
    overview: {
      heading: 'Panoramica',
      body: [
        "Il parco nazionale del Serengeti è un santuario faunistico di fama mondiale situato nel nord della Tanzania, celebre per le sue vaste savane, i suoi ricchi ecosistemi e le sue impareggiabili opportunità di osservazione della fauna. Estendendosi per circa 14.750 chilometri quadrati, il parco ospita la celebre Grande Migrazione degli gnu, dove milioni di gnu, zebre e gazzelle attraversano le pianure alla ricerca di nuovi pascoli — uno spettacolo naturale impressionante.",
        "Oltre alla migrazione, il Serengeti offre osservazione della fauna tutto l'anno, con un'abbondanza di animali, tra cui leoni, leopardi, elefanti, giraffe, ghepardi e oltre 500 specie di uccelli. Il nome del parco, derivato dalla parola maasai « Siringet », significa « pianure infinite » — una descrizione perfetta dei suoi paesaggi mozzafiato che si estendono a perdita d'occhio.",
        "Che si tratti di un safari fotografico, di sorvolare le pianure in mongolfiera, o di camminare con una guida attraverso gli angoli più remoti della boscaglia, il Serengeti offre un'esperienza di safari africano davvero autentica e indimenticabile.",
      ].map(paragraphBlock),
    },
    activitiesHeading: 'Attività Popolari e Memorabili da Fare nel Parco Nazionale del Serengeti',
    activities: [
      {title: 'Migrazioni degli Gnu', body: 'A seconda della stagione, potrai osservare oltre un milione di gnu e centinaia di migliaia di zebre e gazzelle nel loro epico viaggio — particolarmente spettacolare durante gli attraversamenti dei fiumi nel Serengeti settentrionale.'},
      {title: 'Safari in Mongolfiera', body: 'Scopri il Serengeti visto dal cielo all\'alba. Sorvola le pianure mentre la fauna si muove sottostante, seguito da una colazione a base di champagne nella boscaglia.'},
      {title: 'Safari Fotografico', body: "L'attività più iconica, i safari fotografici offrono la possibilità di osservare i Big Five (leone, elefante, bufalo, leopardo e rinoceronte) oltre a ghepardi, iene, giraffe, zebre e innumerevoli gnu. Le escursioni possono svolgersi al mattino presto, nel pomeriggio, o per un'intera giornata."},
      {title: 'Birdwatching', body: "Con oltre 500 specie di uccelli, il Serengeti è un paradiso per gli ornitologi. Individua i serpentari, gli avvoltoi, le otarde kori e i variopinti gruccioni, in particolare intorno ai punti d'acqua e alle zone boschive."},
      {title: 'Safari a Piedi', body: 'Guidati da ranger armati e naturalisti esperti, i safari a piedi ti permettono di esplorare il parco a piedi — imparando a riconoscere le tracce, le piante e le piccole creature spesso non notate durante i safari fotografici.'},
      {title: 'Safari Fotografici Specializzati', body: 'Con i suoi splendidi paesaggi, la sua luce spettacolare e la sua abbondante fauna selvatica, il Serengeti è perfetto sia per fotografi amatoriali che professionisti. Alcuni operatori offrono veicoli e guide specializzati in fotografia.'},
    ].map((activity) => ({_type: 'activity', _key: key(), title: activity.title, body: activity.body})),
    bestTimeToVisit: {
      heading: 'Periodo Migliore per Visitare',
      body: [
        'Il periodo migliore per vedere la migrazione è da luglio a ottobre. È la stagione secca, e a giugno e luglio le mandrie affrontano la loro sfida più grande: l\'attraversamento del fiume Mara. Se desideri vedere i predatori in azione, parti a gennaio o febbraio, quando c\'è una tregua nelle piogge annuali e gli gnu partoriscono.',
        'Nota che viaggiare in alta stagione comporta naturalmente costi più elevati, e il paese possiede una certa bellezza durante o subito dopo le piogge.',
      ].map(paragraphBlock),
    },
    gallery: await Promise.all(
      [
        {src: '/images/serengeti-national-park/wildebeest-migrations.webp', alt: 'Migrazioni degli gnu'},
        {src: '/images/serengeti-national-park/balloon-safari.jpeg', alt: 'Safari in mongolfiera'},
        {src: '/images/serengeti-national-park/elephant-serengeti.jpg', alt: 'Elefante nel Serengeti'},
        {src: '/images/serengeti-national-park/cheetah.jpg', alt: 'Ghepardo'},
        {src: '/images/serengeti-national-park/lion.jpg', alt: 'Leone'},
        {src: '/images/serengeti-national-park/zebra-serengeti.jpg', alt: 'Zebra nel Serengeti'},
      ].map((img) => uploadImage(client, img)),
    ),
    otherDestinationsHeading: 'Altre Destinazioni Safari',
    otherDestinations: await Promise.all(
      [
        {name: 'Cratere del Ngorongoro', href: '/destinations/', image: {src: '/images/serengeti-national-park/ngorongoro-crater.jpg', alt: 'Cratere del Ngorongoro'}},
        {name: 'Parco Nazionale di Tarangire', href: '/destinations/', image: {src: '/images/serengeti-national-park/tarangire.webp', alt: 'Parco Nazionale di Tarangire'}},
        {name: 'Parco Nazionale del Lago Manyara', href: '/destinations/', image: {src: '/images/serengeti-national-park/lake-manyara.jpg', alt: 'Parco Nazionale del Lago Manyara'}},
        {name: 'Parco Nazionale di Mkomazi', href: '/destinations/', image: {src: '/images/serengeti-national-park/mkomazi.webp', alt: 'Parco Nazionale di Mkomazi'}},
        {name: 'Parco Nazionale di Arusha', href: '/destinations/', image: {src: '/images/serengeti-national-park/arusha-national-park.jpg', alt: 'Parco Nazionale di Arusha'}},
      ].map(async (dest) => ({_type: 'crossPromo', _key: key(), name: dest.name, href: dest.href, image: await uploadImage(client, dest.image)})),
    ),
  }
  const itId = await upsertTranslatedDoc(client, 'destinationDetail', slug, 'it', fields)
  await linkTranslationMetadata(client, 'destinationDetail', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`destinationDetail-it done (${itId})`)
}

async function run() {
  await seedBlogIndexIt()
  await seedIringaBlogPostIt()
  await seedDestinationsPageIt()
  await seedSerengetiDetailIt()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
