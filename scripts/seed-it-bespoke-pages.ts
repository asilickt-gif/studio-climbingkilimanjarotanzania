/**
 * Phase 6 (Italian): the 6 bespoke page singletons (aboutPage, contactPage,
 * requestQuotePage, zanzibarPage, tanzaniaSafariPage, safariToursPage).
 * Mirrors seed-fr-bespoke-pages.ts's structure but with Italian text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-bespoke-pages.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedAboutIt() {
  await client.createOrReplace({
    _id: 'aboutPage-it',
    _type: 'aboutPage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: "Chi è Asili Climbing Kilimanjaro | La Migliore Agenzia per il Monte Kilimangiaro",
      description:
        'Scopri Asili Climbing Kilimanjaro — un operatore turistico boutique in Tanzania con profonde radici locali, guide esperte e una passione per le avventure africane indimenticabili.',
    },
    hero: {
      heading: 'La Migliore Agenzia per il Monte Kilimangiaro',
      backgroundImage: await uploadImage(client, {
        src: '/images/about-asili-explorer/hero.webp',
        alt: 'Una fila di escursionisti che camminano verso il Monte Kilimangiaro attraverso la vegetazione di brughiera',
      }),
    },
    intro: {
      eyebrow: 'CHI SIAMO - Climbing Kilimanjaro Tanzania',
      sections: [
        {
          body: 'Adattiamo ogni esperienza di safari al tuo budget e alle tue preferenze, garantendo un itinerario perfetto solo per te. Dalla tua prima richiesta fino al trasferimento finale in aeroporto, ci impegniamo a offrire un servizio clienti eccezionale in ogni fase.',
        },
        {
          body: "Per quanto riguarda l'esperienza del safari, l'eccezionale fauna selvatica della Tanzania e i suoi numerosi e magnifici parchi nazionali e riserve naturali ne fanno il luogo ideale in Africa per un safari. Che tu preferisca fare il tuo safari a bordo di un veicolo o tentare qualcosa di più avventuroso come una camminata guidata o persino la canoa, hai a disposizione una moltitudine di opzioni.",
        },
        {
          body: "I parchi nazionali tanzaniani, come il lago Manyara, il Ngorongoro, Tarangire e il celebre Serengeti, permettono di osservare i mitici Big Five oltre a un numero considerevole di altri animali, uccelli e insetti che probabilmente non vedrai da nessun'altra parte al mondo.",
        },
        {
          body: "La Tanzania è anche la culla della tribù Maasai, e nessuna visita in Tanzania sarebbe completa senza un incontro con questo popolo e una visita alla Culla dell'Umanità alle gole di Olduvai. Per i più avventurosi, è possibile anche la scalata del leggendario Monte Kilimangiaro o del più modesto ma altrettanto magnifico Monte Meru. Gli amanti del sole, della sabbia e del relax potranno visitare la splendida Zanzibar, un rifugio insulare il cui patrimonio culturale è affascinante quanto le sue spiagge e le sue foreste tropicali.",
        },
        {
          body: "Da Asili Climbing Kilimanjaro, portiamo le avventure di safari a nuovi livelli di avventura ed eccellenza. La nostra visione è offrire avventure indimenticabili e di alta qualità che valorizzino lo splendore naturale dell'Africa. Ponendo l'accento sulla qualità e sulla cura dei dettagli, puntiamo all'eccellenza in materia di safari, offrendo incontri eccezionali con la fauna selvatica ed esperienze di viaggio memorabili. Ispirati dalla tutela dell'ambiente, dalla sensibilità culturale e dalla valorizzazione delle comunità, lavoriamo per un turismo responsabile.",
        },
        {
          body: "Ogni membro del personale di Asili Climbing Kilimanjaro conosce ed è appassionato di un'immensa quantità di informazioni sull'Africa. Dal nostro personale locale ai nostri agenti internazionali, ogni membro del nostro team può vantarsi di essere un esperto di safari. Abbiamo visitato gli hotel, esplorato i parchi e negoziato con le compagnie aeree affinché tu possa beneficiare del miglior prezzo e della migliore esperienza possibile.",
        },
        {
          heading: "La Tua Guida è il Tuo Legame con l'Africa",
          body: "Asili Climbing Kilimanjaro impiega solo gli autisti più cordiali ed esperti. Tutte le nostre guide parlano inglese e condividono un vero amore per la fauna, l'avifauna e la flora africane. Sanno tutto e saranno felici di rispondere alle tue domande! Le nostre guide non si limitano a guidare ogni giorno, saranno anche la tua chiave d'accesso ai parchi che visiti, alla fauna che incontri, alle persone che incroci, e molto altro ancora. Che si tratti di Dickson, Bashiru, Lomayani, Alex o di uno dei nostri altri autisti altamente qualificati, sei in buone mani. Organizziamo anche guide che parlano altre lingue come tedesco, spagnolo, italiano, francese, cinese, coreano, ecc. su richiesta.",
        },
        {
          body: "Asili Climbing Kilimanjaro è specializzata nella progettazione di safari privati su misura che soddisfano tutte le tue esigenze. Che tu sogni di riconnetterti con la natura attraverso un safari economico in campeggio e trekking, o preferisca vivere la tua esperienza africana nel massimo del lusso, siamo qui per guidarti in ogni fase per creare l'itinerario definitivo. Siamo orgogliosi di offrire un servizio clienti di livello mondiale e di soddisfare tutte le esigenze dei nostri clienti.",
        },
        {
          body: "Mentre la maggior parte delle altre aziende di safari impone restrizioni di chilometraggio o carburante sui loro safari fotografici, noi offriamo safari fotografici illimitati dalle 6:00 alle 18:00 ogni giorno del tuo soggiorno. Hai il controllo totale della tua giornata. Vuoi passare tutta la giornata in safari e fare un pic-nic nel Serengeti? Si può fare! Vuoi dormire fino a tardi e goderti una mattinata tranquilla prima di partire per un safari fotografico al tramonto? Anche questo si può fare! Decidi tu!",
        },
      ].map((section) => ({
        _type: 'aboutSection',
        _key: key(),
        ...(section.heading ? {heading: section.heading} : {}),
        body: section.body,
      })),
    },
    bodyImage: await uploadImage(client, {
      src: '/images/about-asili-explorer/about-photo.jpg',
      alt: "Una coppia che gusta una cena al tramonto sotto un'acacia nella savana tanzaniana",
    }),
    fleetSection: {
      heading: 'La Nostra Flotta e il Comfort a Bordo',
      body:
        "La flotta di veicoli appositamente progettati di Asili Climbing Kilimanjaro è il modo ideale per vivere un safari africano. I nostri Land Cruiser 4x4 sono stati appositamente allestiti per il tuo comfort e la tua sicurezza, con tetti apribili, porte scorrevoli e una carrozzeria allungata per garantirti una vista panoramica a 360 gradi su tutta l'azione. Tutti i nostri veicoli vengono sottoposti a manutenzione al termine di ogni safari e vengono anche completamente revisionati ogni anno per garantire elevati standard di sicurezza e comfort. Inoltre, tutti i nostri veicoli dispongono di stazioni di ricarica, kit di pronto soccorso, frigoriferi e WiFi (solo in Tanzania).\n\nIl « cestino da pranzo per safari » ha una reputazione piuttosto scarsa nel settore dei safari. Sebbene ogni lodge faccia del suo meglio per rendere questo momento piacevole, una certa ripetitività è difficile da evitare. Abbiamo ingaggiato uno chef professionista per preparare il nostro cestino da pranzo fin dal primo giorno, e la differenza di qualità è notevole. Perché accontentarsi di panini secchi e patatine nella tua borsa quando puoi gustare un pasto caldo, prodotti appena preparati, il tutto accompagnato da una tazza di caffè macinato fresco?\n\nPer tutte queste ragioni e molte altre, siamo il team ideale per aiutarti a realizzare il tuo safari africano da sogno.\n\nSe non l'hai ancora fatto, non esitare a contattarci per iniziare a pianificare il tuo safari ideale.",
    },
    quote:
      "« Il fondamento stesso dello spirito vivo di un uomo è la sua passione per l'avventura. La gioia di vivere nasce dai nostri incontri con nuove esperienze, e quindi non c'è gioia più grande che avere un orizzonte in perenne mutamento, che ogni giorno abbia un sole nuovo e diverso »",
    ctaHeading: 'Lascia che ti Aiutiamo',
  })
  console.log('aboutPage-it created/replaced')
}

async function seedContactIt() {
  await client.createOrReplace({
    _id: 'contactPage-it',
    _type: 'contactPage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: 'Contatta Asili | Climbing Kilimanjaro Tanzania',
      description:
        "Pronto a conquistare il Kilimangiaro? Contatta oggi stesso Climbing Kilimanjaro Tanzania e lascia che il nostro team di esperti ti aiuti a pianificare la tua scalata.",
    },
    pageTitle: 'Contatta Asili',
    hero: {
      backgroundImage: await uploadImage(client, {
        src: '/images/contact/hero.webp',
        alt: 'Il Monte Kilimangiaro visto sopra gli acacia della savana africana',
      }),
      heading: 'Contattaci',
      subheading: 'Pronto a conquistare il Kilimangiaro? Facciamolo insieme!',
    },
    intro: {
      heading: 'Inizia la Tua Scalata con Climbing Kilimanjaro Tanzania',
      body: "Che tu stia pianificando la tua prima vetta o stia tornando per una nuova avventura, siamo qui per guidarti in ogni fase. Contattaci oggi stesso — il nostro team di esperti è pronto a rispondere alle tue domande, personalizzare il tuo trekking e aiutarti a preparare il viaggio della tua vita.",
      contactLabel: 'Contatta Climbing Kilimanjaro Tanzania',
      location: 'Arusha – Tanzania',
      imageLeft: await uploadImage(client, {src: '/images/contact/camp.jpg', alt: 'Campo del Kilimangiaro con tende sotto la vetta'}),
      imageRight: await uploadImage(client, {src: '/images/contact/summit.webp', alt: 'Uno scalatore che festeggia davanti al cartello della vetta Uhuru Peak'}),
    },
    form: {
      eyebrow: 'Contattaci',
      heading: 'Il nostro esperto ti contatterà presto.',
      routeOptions: [
        '5 Giorni Route Marangu',
        '6 Giorni Route Machame',
        '6 Giorni Route Marangu',
        '6 Giorni Route Umbwe',
        '7 Giorni Route Lemosho',
        '7 Giorni Route Machame',
        '7 Giorni Route Rongai',
        '8 Giorni Route Lemosho',
        '9 Giorni Route Northern Circuit',
        'Non ancora sicuro',
      ],
    },
  })
  console.log('contactPage-it created/replaced')
}

async function seedRequestQuoteIt() {
  await client.createOrReplace({
    _id: 'requestQuotePage-it',
    _type: 'requestQuotePage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: 'Richiedi un Preventivo | Asili Climbing Kilimanjaro',
      description:
        "Ottieni un preventivo gratuito e personalizzato per il tuo safari in Tanzania o la tua scalata del Kilimangiaro presso Asili Climbing Kilimanjaro. Indicaci le tue date di viaggio e le tue esigenze, e ci occupiamo noi del resto.",
    },
    hero: {
      heading: 'Richiedi un Preventivo per un Safari in Tanzania',
      subheading: 'Ottieni subito preventivi gratuiti per il tuo safari in Tanzania',
    },
    contactInfo: {
      address: 'Sakina, Arusha',
      officeHours: 'Lunedì - Domenica: 24 ore su 24, 7 giorni su 7',
      whatsappHref: 'https://wa.me/255767140150',
    },
    intro:
      "Pronto a pianificare il viaggio dei tuoi sogni in Tanzania? La tua avventura inizia qui — scopri tour su misura adatti ai tuoi interessi grazie alla nostra sezione di richiesta tour.",
    howToHeading: 'Come Richiedere un Preventivo Personalizzato',
    howToBody: [
      segmentsToBlock([
        {text: 'Contatta il nostro team di esperti in safari e '},
        {text: 'Kilimangiaro', bold: true, href: '/climbing-mount-kilimanjaro/'},
        {
          text: '. Abbiamo aiutato migliaia di viaggiatori a spuntare tutte le caselle della loro lista dei sogni in Tanzania (rispettando il loro budget) senza lo stress di pianificare tutto da soli. Contattaci oggi stesso riguardo alla tua lista dei desideri per la Tanzania, e creiamo insieme la tua avventura di safari e trekking definitiva.',
        },
      ]),
    ],
  })
  console.log('requestQuotePage-it created/replaced')
}

async function seedZanzibarIt() {
  const cards = [
    {
      title: 'Una Luna di Miele a Zanzibar - 06 GIORNI',
      price: '875 $ A PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/honeymoon.jpg', alt: 'Allestimento romantico sulla spiaggia con un tavolo per due decorato con petali di rosa che formano la parola LOVE'},
    },
    {
      title: "Scoprire l'Isola di Zanzibar - 03 GIORNI",
      price: '528 $ A PERSONA',
      location: 'Abeid Amani Karume International Airport > Zanzibar > Stone Town Zanzibar',
      image: {src: '/images/zanzibar/island-3.webp', alt: 'Vista aerea di una piccola isola boscosa di Zanzibar con una spiaggia di sabbia bianca e un molo in legno'},
    },
    {
      title: "Scoprire l'Oceano Indiano - 06 GIORNI",
      price: '890 $ A PERSONA',
      location: 'Zanzibar > Stone Town Zanzibar',
      image: {src: '/images/zanzibar/rock-restaurant.jpg', alt: 'Il ristorante The Rock arroccato su un affioramento corallino nelle acque turchesi al largo di Zanzibar'},
    },
    {
      title: 'Zanzibar Oceano Indiano - 06 GIORNI',
      price: '1918 $ A PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/zanzibar5.jpg', alt: "Coppia che si rilassa su un lettino da spiaggia ammirando il tramonto sull'oceano Indiano"},
    },
    {
      title: 'Oceano Indiano di Zanzibar - 06 GIORNI',
      price: '1146 $ A PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/paje-beach.jpg', alt: 'Palme e ombrelloni di paglia lungo una spiaggia di sabbia bianca con acque turchesi'},
    },
    {
      title: "L'Isola di Zanzibar in Tanzania - 05 GIORNI",
      price: '1439 $ A PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/hero.webp', alt: 'Sub che esplora una vibrante barriera corallina nelle acque cristalline al largo di Zanzibar'},
    },
  ]
  await client.createOrReplace({
    _id: 'zanzibarPage-it',
    _type: 'zanzibarPage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: 'Tour a Zanzibar | Asili Climbing Kilimanjaro',
      description:
        "Scopri Zanzibar con Asili Climbing Kilimanjaro — spiagge di sabbia bianca, cultura di Stone Town e avventure nell'oceano Indiano, perfettamente abbinate al tuo viaggio in Tanzania.",
    },
    hero: {
      heading: 'Zanzibar',
      backgroundImage: await uploadImage(client, {src: '/images/zanzibar/hero.webp', alt: 'Sub che esplora una vibrante barriera corallina nelle acque cristalline al largo di Zanzibar'}),
    },
    cards: await Promise.all(
      cards.map(async (card) => ({
        _type: 'zanzibarCard',
        _key: key(),
        title: card.title,
        price: card.price,
        location: card.location,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('zanzibarPage-it created/replaced')
}

async function seedTanzaniaSafariIt() {
  const cards = [
    {
      title: 'Safari della Migrazione sul Fiume Mara - 07 GIORNI',
      price: '4692 $ A PERSONA',
      image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Lodge di lusso con piscina a sfioro che si affaccia sul Serengeti al crepuscolo'},
    },
    {
      title: 'Safari Simba - 05 GIORNI',
      price: '2422 $ A PERSONA',
      image: {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Due elefanti che si salutano proboscide contro proboscide in Tanzania'},
    },
    {
      title: 'Tanzania Classica - 07 GIORNI',
      price: '3273 $ A PERSONA',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Una leonessa che riposa con i suoi due cuccioli nelle pianure del Serengeti'},
    },
    {
      title: 'Esperienza Comfort Tanzania - 07 GIORNI',
      price: '3326 $ A PERSONA',
      image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Elegante campo di tende immerso sotto la canopia forestale'},
    },
    {
      title: 'Esperienza Safari Glamping Tanzania - 05 GIORNI',
      price: '2383 $ A PERSONA',
      image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge con piscina e giardini lussureggianti al crepuscolo'},
    },
    {
      title: 'Safari della Migrazione degli Gnu - 09 GIORNI',
      price: '6239 $ A PERSONA',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Due rinoceronti bianchi che si fronteggiano nell\'erba del cratere del Ngorongoro'},
    },
  ]
  await client.createOrReplace({
    _id: 'tanzaniaSafariPage-it',
    _type: 'tanzaniaSafariPage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: 'Pacchetti Safari in Tanzania | Asili Climbing Kilimanjaro',
      description:
        'Sfoglia i nostri pacchetti safari più popolari in Tanzania — safari della migrazione, tour classici di osservazione della fauna, glamping ed esperienze comfort con Asili Climbing Kilimanjaro.',
    },
    hero: {
      eyebrow: 'Tipo di Tour: Safari in Tanzania',
      heading: 'Pacchetti Safari in Tanzania',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Un leone e un cucciolo che riposano insieme su una roccia in Tanzania'}),
    },
    cards: await Promise.all(
      cards.map(async (card) => ({
        _type: 'safariCard',
        _key: key(),
        title: card.title,
        price: card.price,
        image: await uploadImage(client, card.image),
      })),
    ),
  })
  console.log('tanzaniaSafariPage-it created/replaced')
}

async function seedSafariToursIt() {
  await client.createOrReplace({
    _id: 'safariToursPage-it',
    _type: 'safariToursPage',
    language: 'it',
    seo: {
      _type: 'seo',
      title: 'Safari Fauna Selvatica in Tanzania | Asili Climbing Kilimanjaro',
      description:
        "Scopri il più grande spettacolo faunistico d'Africa. Tour safari in Tanzania attraverso il Serengeti, il cratere del Ngorongoro e oltre con Asili Climbing Kilimanjaro.",
    },
    hero: {
      eyebrow: 'Safari in Tanzania',
      heading: 'Safari Fauna Selvatica in Tanzania',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Un leone e un cucciolo che riposano insieme su una roccia in Tanzania'}),
    },
    intro: {
      title: "Safari Fauna Selvatica in Tanzania: Scopri il Più Grande Spettacolo Faunistico d'Africa",
      body: "La Tanzania non è semplicemente una destinazione — è un invito a scoprire l'Africa in tutto il suo splendore selvaggio e imponente. Con le sue vaste savane brulicanti di vita selvatica, i suoi parchi nazionali iconici e i suoi autentici incontri culturali, un safari fauna selvatica in Tanzania è un'esperienza unica al mondo. Che tu sia un neofita del safari o un avventuriero esperto, la Tanzania ti offre momenti indimenticabili ogni giorno.\n\nDalle leggendarie pianure del Serengeti alla più grande caldera vulcanica intatta del mondo, il cratere del Ngorongoro — la Tanzania promette incontri ravvicinati con i Big Five, le migrazioni degli gnu, antichi baobab e infiniti tramonti dorati.",
    },
    whereToGo: {
      eyebrow: 'Tutto Quello che Devi Sapere sulla Tanzania',
      heading: 'Dove Andare in Tanzania',
      body: "La Tanzania è una terra di contrasti mozzafiato — dalla vetta innevata del Monte Kilimangiaro alle savane dorate del Serengeti, passando per le lussureggianti spiagge tropicali di Zanzibar e i profondi crateri ricchi di fauna del Ngorongoro. Che tu cerchi avventura, fauna selvatica, cultura o relax, Asili Climbing Kilimanjaro ti aiuta a scoprire la Tanzania meglio di chiunque altro — con guide locali esperte e viaggi su misura.",
      image: await uploadImage(client, {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Due elefanti che si salutano proboscide contro proboscide in Tanzania'}),
    },
    tourStyles: {
      eyebrow: 'Scopri i Tour Safari',
      heading: 'Stili di Safari Popolari in Tanzania',
      styles: await Promise.all(
        [
          {label: 'Safari di Lusso in Tanzania', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Lodge di lusso con piscina a sfioro che si affaccia sul Serengeti al crepuscolo'}},
          {label: 'Safari Comfort in Tanzania', image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Elegante campo di tende immerso sotto la canopia forestale'}},
          {label: 'Safari Fascia Media in Tanzania', image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge fascia media con piscina e giardini lussureggianti al crepuscolo'}},
          {label: 'Safari Campeggio Economico in Tanzania', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Tende da safari in tela allestite sotto gli alberi per un safari in campeggio'}},
        ].map(async (style) => ({_type: 'tourStyle', _key: key(), label: style.label, image: await uploadImage(client, style.image)})),
      ),
    },
    seasons: {
      eyebrow: 'Panoramica delle Stagioni in Tanzania',
      heading: 'Qual è il Mese Migliore per Visitare la Tanzania?',
      intro:
        "Non esiste una soluzione universale per un safari in Tanzania. Vuoi vivere la migliore esperienza possibile, in base ai tuoi desideri. Sfoglia i mesi per saperne di più su cosa aspettarti durante la tua visita.",
      months: [
        {month: 'Gennaio', body: 'È il momento di scoprire la bellezza naturale della Tanzania in tutto il suo splendore vivace e colorato. Già a gennaio potrai godere di paesaggi lussureggianti e occasioni fotografiche uniche che ti lasceranno senza fiato!'},
        {month: 'Febbraio', body: 'Febbraio in Tanzania è un periodo incredibile per osservare i cuccioli muovere i primi passi nella savana. I posti migliori per questo sono a Ndutu, dove milioni di gnu si radunano e partoriscono in un breve periodo chiamato la stagione delle nascite. Sebbene possano verificarsi temporali nel pomeriggio, la pioggia permetterà una trasformazione del paesaggio.'},
        {month: 'Marzo', body: 'Marzo è un periodo dell\'anno spesso trascurato per visitare la Tanzania. Offre tuttavia numerose occasioni di osservazione, con una magnifica birdwatching e poca folla! Anche se a volte fa caldo (e umido), potrai osservare ogni tipo di animale selvatico durante questo periodo — compresi i loro cuccioli!'},
        {month: 'Aprile', body: 'La Tanzania è un paradiso per i fotografi ad aprile. Paesaggi verdeggianti e pittoreschi, cuccioli e uccelli colorati costeggiano le strade per accogliere i viaggiatori che visitano il paese in questo periodo! Il meteo può essere imprevedibile ad aprile, ma le osservazioni e i paesaggi ne valgono decisamente la pena.'},
        {month: 'Maggio', body: 'Se desideri scoprire la vita nei parchi nazionali della Tanzania prima della stagione secca, questa è la tua ultima occasione. Ammira magnifiche foreste verdeggianti e vaste pianure erbose selvagge piene di cuccioli a maggio, poco prima che il paesaggio si trasformi.'},
        {month: 'Giugno', body: 'Giugno in Tanzania è un periodo eccellente per visitare ed esplorare il paesaggio secco. I visitatori avranno numerose occasioni per osservare la fauna selvatica, con gli animali che si radunano attorno ai punti d\'acqua durante questo mese. Le giornate sono fresche ma soleggiate, offrendo giusto abbastanza umidità senza essere troppo umide né polverose come nelle condizioni ventose osservate più avanti nell\'anno.'},
        {month: 'Luglio', body: 'Visitare la Tanzania a luglio è vivamente consigliato se desideri goderti un safari come dovrebbe essere vissuto. Con le terre secche che diventano più rare, gli animali si radunano vicino ai punti d\'acqua e sono facilmente individuabili grazie al paesaggio arido.'},
        {month: 'Agosto', body: 'La lunga stagione secca è terminata, e gli animali hanno avuto modo di riprendere le forze. Agosto in Tanzania ti offre un\'opportunità rara — un\'eccellente occasione per osservare la fauna selvatica da vicino!'},
        {month: 'Settembre', body: 'Uno dei periodi migliori per visitare la Tanzania è settembre, quando la visibilità è migliore e il sole splende. La fine della lunga stagione secca significa che gli animali sono alla disperata ricerca di cibo, il che aumenta le tue possibilità di assistere ad azione durante il tuo safari!'},
        {month: 'Ottobre', body: 'Ottobre segna la fine della lunga stagione secca in Tanzania, il che significa che l\'azione animale è al culmine! Densi raggruppamenti di animali sono visibili durante qualsiasi escursione di un giorno o soggiorno più lungo nello stesso luogo. Puoi attraversare i parchi senza temere di rimanere bloccato dietro altri veicoli, poiché c\'è pochissimo traffico durante questi mesi. Perfetto se cerchi un\'atmosfera di safari autentica in Tanzania.'},
        {month: 'Novembre', body: 'Il paesaggio tanzaniano si preannuncia spettacolare a novembre, mentre la natura riprende vita durante la breve stagione delle piogge. Con fiumi in piena e animali attivi alla ricerca di cibo, questo promette fantastiche occasioni di osservazione della fauna da non perdere!'},
        {month: 'Dicembre', body: 'Dicembre è il periodo ideale per visitare la Tanzania e ammirare la bellezza naturale di questo magnifico paese. Gli uccelli saranno in tutto il loro splendore al ritorno dalla migrazione annuale dopo un anno intero di assenza! Concludi il tuo anno nel calore, nel comfort e nella bellezza naturale visitando la Tanzania a dicembre.'},
      ].map((month) => ({_type: 'seasonMonth', _key: key(), month: month.month, body: month.body})),
    },
    whyTravelWithUs: {
      heading: 'Perché Viaggiare con Noi?',
      intro: 'Scopri l\'Africa autentica con Asili Climbing Kilimanjaro — dove ogni viaggio è progettato con passione e competenza.',
      features: [
        {description: 'Vivi un\'avventura senza intoppi con le nostre guide competenti e professionali, che garantiscono un\'esperienza di viaggio arricchente.'},
        {description: 'In qualità di azienda locale, offriamo una prospettiva autentica, rivelando tesori nascosti e prospettive culturali per un viaggio davvero immersivo.'},
      ].map((feature) => ({_type: 'safariFeature', _key: key(), description: feature.description})),
    },
  })
  console.log('safariToursPage-it created/replaced')
}

async function run() {
  await seedAboutIt()
  await seedContactIt()
  await seedRequestQuoteIt()
  await seedZanzibarIt()
  await seedTanzaniaSafariIt()
  await seedSafariToursIt()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
