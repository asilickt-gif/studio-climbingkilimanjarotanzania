/**
 * Phase 6 (Italian): Italian translation for the 13 detail articles in content/articles.ts.
 * Mirrors seed-fr-detail-articles.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-it-detail-articles.ts --with-user-token
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
  image?: {src: string; alt: string}
}
interface DetailArticleIt {
  slug: string
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroImage: {src: string; alt: string}
  intro: string
  sections: SectionIt[]
}

function tableToDoc(table?: TableIt) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedDetailArticleIt(data: DetailArticleIt) {
  const enId = await findEnId(client, 'article', data.slug)
  if (!enId) {
    console.log(`SKIP ${data.slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    heading: data.heroTitle,
    heroBackgroundImage: await uploadImage(client, data.heroImage),
    intro: data.intro,
    sections: await Promise.all(
      data.sections.map(async (section) => ({
        _type: 'articleSection',
        _key: key(),
        heading: section.heading,
        ...(section.body ? {body: stringToPt(section.body)} : {}),
        ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
        ...(section.image ? {image: await uploadImage(client, section.image)} : {}),
      })),
    ),
  }
  const itId = await upsertTranslatedDoc(client, 'article', data.slug, 'it', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'it', id: itId},
  ])
  console.log(`${data.slug}-it done (${itId})`)
}

const isClimbingKilimanjaroSafeIt: DetailArticleIt = {
  slug: 'is-climbing-kilimanjaro-safe',
  seoTitle: 'La Scalata del Kilimangiaro è Sicura? | Asili Climbing Kilimanjaro',
  seoDescription: 'La scalata del Monte Kilimangiaro è sicura? Scopri il mal di montagna, le misure di sicurezza e come Asili Climbing Kilimanjaro garantisce la sicurezza di ogni escursionista.',
  heroTitle: 'La Scalata del Kilimangiaro è Sicura: Cosa Dovrebbe Sapere Ogni Escursionista',
  heroImage: {src: '/images/articles/is-safe-hero.jpg', alt: 'Escursionisti che scalano il Kilimangiaro all\'alba'},
  intro:
    "Il Monte Kilimangiaro è una delle avventure in alta quota più accessibili e gratificanti al mondo. Sebbene non richieda alcuna competenza tecnica di arrampicata, la sicurezza sul Kilimangiaro non va presa alla leggera. Da Asili Climbing Kilimanjaro, la sicurezza non è solo una priorità — è il fondamento di tutto ciò che facciamo. Che tu sia un escursionista alle prime armi o un avventuriero esperto, questa guida ti aiuterà a capire come scalare il Kilimangiaro in sicurezza e con fiducia.",
  sections: [
    {
      heading: 'La Scalata del Kilimangiaro è Sicura?',
      body: "Sì — con una buona preparazione, guide esperte e un operatore responsabile, scalare il Kilimangiaro è sicuro per la maggior parte delle persone in buona salute. Tuttavia, si tratta di un trek in alta quota, non di una semplice lunga escursione. Ciò significa che il mal di montagna, le condizioni meteorologiche estreme e lo sforzo fisico giocano tutti un ruolo nei rischi. Scegliere un operatore professionale orientato alla sicurezza come Asili è essenziale per ridurre questi rischi.",
    },
    {
      heading: '🧭 Principali Misure di Sicurezza Adottate da Asili Climbing Kilimanjaro',
      body: "Andiamo oltre le basi per garantire la tua sicurezza durante tutta la scalata:\n1. Guide di montagna certificate ed esperte — Certificate Wilderness First Responder (WFR), formate nelle cure mediche e nell'evacuazione in alta quota, esperti locali che conoscono il terreno della montagna e le condizioni meteorologiche.\n2. Monitoraggio quotidiano della salute — Controlli sanitari due volte al giorno: saturazione di ossigeno (SpO2), frequenza cardiaca e sintomi generali. Controlli del mal acuto di montagna (MAM) registrati ed esaminati. Decidi tu il tuo ritmo — noi ci adattiamo alle tue esigenze.\n3. Ossigeno d'emergenza e pulsossimetri — Trasportati su ogni trek sopra i 3.000 metri. Ossigeno portatile e pulsossimetri per una risposta in tempo reale all'altitudine. Protocolli di discesa immediata se necessario.\n4. Piani di evacuazione e supporto — Intervento di emergenza 24 ore su 24, 7 giorni su 7. Coordinamento con il parco nazionale del Kilimangiaro e i team di soccorso locali. Discesa in veicolo privato o in barella disponibile in caso di necessità.",
    },
    {
      heading: '⛰️ Comprendere i Rischi del Kilimangiaro',
      body: "Sebbene migliaia di persone raggiungano la vetta in sicurezza ogni anno, conoscere i rischi ti aiuta a scalare in modo più intelligente:\n🧠 Mal di montagna — Il MAM può colpire chiunque, indipendentemente dall'età o dalla forma fisica. Sintomi comuni: mal di testa, nausea, vertigini, affaticamento. Le forme gravi (HAPE/HACE) sono rare ma pericolose. Consiglio di prevenzione: scegli itinerari più lunghi (7-9 giorni) come la route Lemosho o Northern Circuit per una migliore acclimatazione.\n🌧️ Meteo ed esposizione — Il clima del Kilimangiaro cambia rapidamente: sole intenso, pioggia, vento e notti gelide. Abbigliamento a strati e attrezzatura adeguata sono essenziali per rimanere al sicuro e comodi.\n🥾 Sforzo fisico — Un trek costante su più giorni. Nessuna arrampicata, ma il dislivello può essere fisicamente impegnativo. Una buona forma fisica di base è utile, soprattutto per il giorno della vetta.",
    },
    {
      heading: '💡 Come Rimanere al Sicuro Durante la Scalata del Kilimangiaro',
      body: "Ecco cosa puoi fare come scalatore per migliorare la tua sicurezza:\n🕒 Prenditi il tuo tempo: non affrettarti — « pole pole » (piano piano) è più di un detto, è una regola di sicurezza.\n💧 Idratati e mangia bene: il tuo corpo ha bisogno di carburante e acqua in quota.\n📋 Scegli l'itinerario giusto: opta per itinerari più lunghi per lasciare che il tuo corpo si adatti.\n🧳 Prepara bene lo zaino: l'attrezzatura giusta previene lesioni da freddo e affaticamento.\n🩺 Sii onesto sui tuoi sintomi: informa immediatamente la tua guida se non ti senti bene.\n🧠 Preparati mentalmente: uno stato d'animo positivo aiuta, soprattutto durante la difficile spinta finale verso la vetta.",
    },
    {
      heading: '🧍 Scalatori Solitari e Sicurezza',
      body: "Gli scalatori solitari sono interamente supportati dalla loro guida personale e dal loro team. Anche se trekkerai da solo, non sarai mai lasciato senza accompagnamento, cure e supporto d'emergenza.",
    },
    {
      heading: '👨‍👩‍👧‍👦 È Sicuro per le Donne e gli Escursionisti Più Anziani?',
      body: "Sì. Il Kilimangiaro è una montagna accogliente per le viaggiatrici, gli scalatori più anziani e persino gli adolescenti (età minima di 10 anni consentita dalle regole del parco). Il nostro team si assicura che tutti, indipendentemente dall'età o dal genere, si sentano a proprio agio e al sicuro.",
    },
    {
      heading: '🔎 Scegliere un Operatore Sicuro: Cosa Cercare',
      body: "Non tutti gli operatori sul Kilimangiaro sono uguali. La sicurezza deve sempre avere la priorità sul prezzo. Ecco cosa dovrebbe fornire un operatore sicuro ed etico: guide autorizzate ed esperte; piani di evacuazione trasparenti; trattamento equo dei portatori (cerca l'affiliazione KPAP); acqua pulita, pasti nutrienti e buona igiene; rapporti clienti-guide responsabili. Asili Climbing Kilimanjaro segue ognuna di queste pratiche di sicurezza — e molto altro.",
    },
    {
      heading: '🗓️ Qual è il Periodo Più Sicuro per Scalare il Kilimangiaro?',
      body: "Le due finestre meteorologiche più secche e stabili sono: gennaio-marzo (più fresco, meno affluenza) e giugno-ottobre (stagione secca e popolare). Evita aprile-maggio e novembre, quando le precipitazioni aumentano il rischio di sentieri scivolosi ed esposizione.",
    },
    {
      heading: '📣 Le Parole Finali delle Nostre Guide Esperte',
      body: "« Diciamo sempre: \"La vetta è opzionale — la sicurezza no.\" Il Kilimangiaro non è una gara. Con il piano giusto, il team giusto e il rispetto per la montagna, puoi vivere un'avventura sicura e indimenticabile. » — Guida Daudi, 158 volte capo scalata in vetta da Asili",
    },
    {
      heading: '🎒 Pronto a Scalare in Sicurezza con Asili?',
      body: "👉 Con una pianificazione esperta, un accompagnamento onesto e un team di sicurezza dedicato al tuo fianco, la tua scalata del Kilimangiaro può essere l'avventura di una vita — realizzata in totale sicurezza. Contatta Asili Climbing Kilimanjaro per saperne di più o iniziare a pianificare.",
    },
  ],
}

const gettingToKilimanjaroIt: DetailArticleIt = {
  slug: 'getting-to-kilimanjaro',
  seoTitle: 'Come Arrivare al Kilimangiaro | Guida di Viaggio alla Vetta Più Alta della Tanzania',
  seoDescription: "Tutto ciò che devi sapere per arrivare al Monte Kilimangiaro: voli, aeroporti, visti e lista di controllo prima dell'arrivo.",
  heroTitle: 'Come Arrivare al Kilimangiaro: la Tua Guida di Viaggio alla Vetta Più Alta della Tanzania',
  heroImage: {src: '/images/articles/getting-to-hero.jpg', alt: 'Aereo KLM che vola in un cielo azzurro'},
  intro:
    "Prima di iniziare il tuo trek verso il Tetto dell'Africa, devi prima arrivarci — e capire come raggiungere il Monte Kilimangiaro fa parte integrante della tua pianificazione. Che tu venga dagli Stati Uniti, dall'Europa, dall'Asia o da altrove nel mondo, questa guida ti aiuterà a navigare serenamente nel tuo viaggio. Ecco tutto ciò che devi sapere per arrivare al Monte Kilimangiaro.",
  sections: [
    {
      heading: '🌍 Dove si Trova il Monte Kilimangiaro?',
      body: "Il Monte Kilimangiaro si trova nel nord della Tanzania, vicino al confine con il Kenya. La grande città più vicina è Moshi, con Arusha come altra base nelle vicinanze, specialmente se combini la tua scalata con un safari. La maggior parte dei trek inizia con un trasferimento da una di queste città verso i diversi cancelli della montagna.",
    },
    {
      heading: '✈️ Il Miglior Aeroporto per le Scalate del Kilimangiaro',
      body: "L'aeroporto internazionale del Kilimangiaro (JRO) è il principale aeroporto per gli scalatori. Situato a metà strada tra Arusha e Moshi, il JRO è a soli 45-60 minuti d'auto da entrambe le città. Codice IATA: JRO. Nome completo: Aeroporto Internazionale del Kilimangiaro. Trasferimenti: la maggior parte degli operatori offre il ritiro in aeroporto.\nVoli diretti verso il JRO: puoi volare da grandi città come Amsterdam (KLM Royal Dutch Airlines), Doha (Qatar Airways), Istanbul (Turkish Airlines), Addis Abeba (Ethiopian Airlines), Nairobi (Kenya Airways) e Dar es Salaam (coincidenze locali). Se vieni dagli Stati Uniti, dal Regno Unito, dal Canada o dall'Australia, avrai generalmente uno scalo in Europa o in Medio Oriente prima di arrivare in Tanzania.",
    },
    {
      heading: '🛬 Aeroporti Alternativi',
      body: "Se i voli verso il JRO sono limitati o costosi, ecco due alternative:\n1. Aeroporto Internazionale Julius Nyerere (DAR) – Dar es Salaam: il più grande aeroporto internazionale della Tanzania. Richiede un volo domestico verso il Kilimangiaro o un tragitto di oltre 10 ore in auto. Compagnie domestiche: Air Tanzania, Precision Air e Coastal Aviation.\n2. Aeroporto Internazionale Jomo Kenyatta (NBO) – Nairobi, Kenya: un hub comune con più voli internazionali. Prendi un breve volo di coincidenza verso il JRO (1 ora) oppure guida attraverso un valico di frontiera (attenzione ai requisiti del visto). Il volo è consigliato rispetto al tragitto via terra per il tempo e la comodità.",
    },
    {
      heading: '🚌 Trasporto Terrestre verso il Kilimangiaro',
      body: "Se sei già in Africa Orientale, puoi raggiungere il Kilimangiaro in autobus o navetta da Nairobi verso Arusha o Moshi (circa 6-8 ore), oppure tramite trasferimenti privati o taxi organizzati dalla tua agenzia di trekking. Nota: un certificato di febbre gialla potrebbe essere richiesto se transiti attraverso il Kenya.",
    },
    {
      heading: "🛂 Requisiti d'Ingresso: Non Dimenticare il Tuo Visto",
      body: "La maggior parte dei viaggiatori avrà bisogno di un visto turistico per entrare in Tanzania. Costo: 50 $ (o 100 $ per i cittadini statunitensi). Dove ottenerlo: richiedilo online tramite il portale eVisa della Tanzania oppure ottienilo all'arrivo al JRO. Validità del passaporto: minimo 6 mesi dalla data di ingresso.",
    },
    {
      heading: "🧳 Lista di Controllo Prima dell'Arrivo",
      body: "Prima di partire, assicurati di avere: un passaporto e un visto validi, un certificato di febbre gialla (se richiesto), un'assicurazione di viaggio (che includa la copertura per l'evacuazione), voli internazionali prenotati verso il JRO (o voli di coincidenza), un trasferimento aeroportuale organizzato con il tuo operatore del Kilimangiaro, e un margine di arrivo (arriva almeno 1 giorno prima della tua scalata).",
    },
    {
      heading: '🏨 Dove Alloggiare Prima della Tua Scalata',
      body: "La maggior parte degli scalatori alloggia a Moshi o Arusha la notte prima dell'inizio del trek. Entrambe le città offrono hotel e lodge confortevoli, negozi di noleggio attrezzatura, acquisti dell'ultimo minuto (snack, schede SIM, ecc.) e attività culturali e visite alle piantagioni di caffè. Consiglio: arriva almeno un giorno intero prima per riposarti, incontrare le tue guide ed effettuare un ultimo controllo dell'attrezzatura prima del trek.",
    },
    {
      heading: '🧭 Le Parole Finali',
      body: "Arrivare al Kilimangiaro è più facile di quanto pensi — con un aeroporto internazionale ben collegato e un supporto affidabile, atterrerai a solo un breve tragitto dalla tua avventura. Che tu viaggi da solo o in gruppo, arrivare presto e ben preparato ti garantisce di iniziare la tua scalata rilassato e pronto. Con Asili Climbing Kilimanjaro, gestiamo il tuo arrivo, i tuoi trasferimenti e la tua logistica — così puoi concentrarti sul viaggio che ti aspetta.",
    },
  ],
}

const mountKilimanjaroFactsIt: DetailArticleIt = {
  slug: 'mount-kilimanjaro-facts',
  seoTitle: "Fatti sul Monte Kilimangiaro | Il Tetto Emblematico dell'Africa Svelato",
  seoDescription: "Fatti affascinanti sul Monte Kilimangiaro: i suoi coni vulcanici, le sue cinque zone climatiche, i suoi ghiacciai, i suoi portatori e ciò che rende il Tetto dell'Africa così emblematico.",
  heroTitle: "Fatti sul Monte Kilimangiaro: il Tetto Emblematico dell'Africa Svelato",
  heroImage: {src: '/images/contact/hero.webp', alt: 'Il Monte Kilimangiaro visto sopra le acacie della savana africana'},
  intro:
    'Il Monte Kilimangiaro è molto più di una semplice scalata — è una meraviglia naturale, un\'icona culturale e un potente simbolo di avventura. Conosciuto come il « Tetto dell\'Africa », il Kilimangiaro attira decine di migliaia di escursionisti ogni anno. Ma cosa sai veramente di questa montagna leggendaria? Ecco alcuni dei fatti più affascinanti, sorprendenti ed essenziali sul Monte Kilimangiaro — pensati per aiutarti ad apprezzare ogni tappa del tuo viaggio.',
  sections: [
    {
      heading: "🌍 1. Il Kilimangiaro è la Montagna Più Alta d'Africa",
      body: "Altitudine: 5.895 metri sopra il livello del mare. Posizione mondiale: è la montagna indipendente più alta del mondo — non facente parte di una catena montuosa. Posizione: nord della Tanzania, vicino al confine con il Kenya.",
    },
    {
      heading: '🧊 2. È un Vulcano — Anzi, Tre Vulcani',
      body: "Il Monte Kilimangiaro non è un'unica vetta — è composto da tre coni vulcanici: Kibo (il più alto e l'unico cono dormiente, dove si raggiunge la vetta), Mawenzi (frastagliato e spettacolare, non scalabile fino in cima), e Shira (in gran parte eroso, ma ancora visibile sugli itinerari occidentali). Kibo è considerato dormiente, non estinto, il che significa che potrebbe eruttare di nuovo — sebbene la sua ultima attività importante risalga a oltre 360.000 anni fa.",
    },
    {
      heading: '🌦️ 3. Attraverserai Cinque Zone Climatiche',
      body: "Scalare il Kilimangiaro è come camminare dall'equatore fino all'Artico. La montagna conta cinque zone ecologiche, ciascuna con il proprio clima, la propria fauna e i propri paesaggi unici: Zona di coltivazione (800-1.800 m) — terreni agricoli, banani e villaggi. Zona di foresta pluviale (1.800-2.800 m) — giungla rigogliosa con scimmie e uccelli esotici. Zona di brughiera/landa (2.800-4.000 m) — lobelie giganti e brughiere ondulate. Zona di deserto alpino (4.000-5.000 m) — secco, roccioso e quasi privo di vita. Zona artica (5.000-5.895 m) — ghiacciai, temperature gelide e aria rarefatta.",
    },
    {
      heading: '🧗‍♀️ 4. Non è Richiesta Alcuna Arrampicata Tecnica',
      body: "Nonostante la sua altezza impressionante, il Kilimangiaro è una vetta da trekking, non da alpinismo. Ciò significa che non sono necessarie corde, picozze o attrezzatura tecnica. È accessibile a chiunque abbia una buona forma fisica e determinazione. Il successo dipende più dall'adattamento all'altitudine che dalle capacità di arrampicata.",
    },
    {
      heading: '⏳ 5. La Maggior Parte delle Scalate Dura 6-9 Giorni',
      body: "Le migliori scalate lasciano il tempo al tuo corpo di acclimatarsi. Gli itinerari più popolari includono: Route Machame (7 giorni) — panoramica e variegata. Route Lemosho (8-9 giorni) — eccellente per l'acclimatazione e meno affluenza. Route Marangu (5-6 giorni) — l'unica con pernottamento in rifugi. Northern Circuit (9 giorni) — la più lunga e la più tranquilla per l'acclimatazione. Rongai o Umbwe — per chi cerca itinerari unici.",
    },
    {
      heading: '🌕 6. Puoi Scalare Durante la Luna Piena',
      body: "Un trek durante la luna piena illumina la vetta innevata e offre un'esperienza magica e surreale. Molti scalatori pianificano la loro notte di vetta per coincidere con la luna piena, per una migliore visibilità e foto indimenticabili.",
    },
    {
      heading: '🎒 7. Circa 30.000 Persone Tentano la Scalata Ogni Anno',
      body: "Il Kilimangiaro attira avventurieri da tutto il mondo. Circa il 65-75% degli scalatori raggiunge la vetta, a seconda dell'itinerario e del tempo di acclimatazione. Scegliere un itinerario più lungo aumenta notevolmente le tue possibilità di successo.",
    },
    {
      heading: '💨 8. Il Mal di Montagna è la Sfida Numero Uno',
      body: "L'aria si rarefa man mano che si sale, e molti escursionisti avvertono gli effetti del mal acuto di montagna (MAM). I sintomi possono includere mal di testa, nausea e affaticamento. Un ritmo lento, l'idratazione e i giorni di riposo sono essenziali per ridurre il rischio.",
    },
    {
      heading: '🍲 9. Mangerai Bene sulla Montagna',
      body: "Dimentica le razioni di sopravvivenza insipide — la maggior parte dei trek del Kilimangiaro include pasti caldi, snack e persino frutta fresca. Un buon operatore come Asili Climbing Kilimanjaro si assicura che tu sia ben nutrito con pasti equilibrati ed energizzanti ogni giorno.",
    },
    {
      heading: '🙌 10. Non Scalerai da Solo — Incontra i Portatori',
      body: "Ogni escursionista è supportato da un team che può includere guide (certificate ed esperte), portatori (che trasportano la tua attrezzatura e allestiscono il campo) e cuochi (che preparano i pasti). La tua scalata è possibile solo grazie a questi instancabili eroi locali. Le agenzie responsabili collaborano con il KPAP (Kilimanjaro Porters Assistance Project) per garantire un trattamento e salari equi.",
    },
    {
      heading: '🧊 11. I Ghiacciai del Kilimangiaro Stanno Scomparendo',
      body: "Il Kilimangiaro un tempo possedeva immensi ghiacciai vicino alla vetta. A causa del cambiamento climatico, questi campi di ghiaccio si stanno riducendo rapidamente — alcuni esperti stimano che potrebbero scomparire completamente entro qualche decennio. Vederli ora è davvero un'esperienza unica nella vita.",
    },
    {
      heading: '📸 12. Il Cartello di Uhuru Peak è Iconico',
      body: "Uhuru Peak (che significa « Vetta della libertà » in swahili) è il punto più alto del bordo del cratere di Kibo. Raggiungere il cartello di legno verde e giallo è un momento di orgoglio ed emozione per ogni escursionista — e sì, vorrai sicuramente una foto! Pronto a viverlo in prima persona? Lascia che Asili Climbing Kilimanjaro ti guidi verso la vetta in sicurezza e in modo responsabile — con una pianificazione esperta, conoscenza locale e ricordi indimenticabili.",
    },
  ],
}

const typicalDayOnKilimanjaroIt: DetailArticleIt = {
  slug: 'typical-day-on-kilimanjaro',
  seoTitle: 'Una Giornata Tipo sul Kilimangiaro | Cosa Aspettarsi Ogni Giorno',
  seoDescription: 'Come si presenta una giornata tipo durante la scalata del Monte Kilimangiaro? Dalla sveglia alla notte di vetta, ecco il ritmo quotidiano del tuo trek.',
  heroTitle: 'Una Giornata Tipo sul Kilimangiaro: Cosa Aspettarsi Ogni Giorno Scalando la Montagna Più Alta d\'Africa',
  heroImage: {src: '/images/articles/typical-day-hero.webp', alt: 'Tende allestite al Barafu Camp sul Monte Kilimangiaro'},
  intro:
    "Scalare il Monte Kilimangiaro è un'esperienza indimenticabile — ma è anche strutturata, sicura e sorprendentemente confortevole quando è ben pianificata. Che tu sia curioso di sapere come si svolgeranno le tue giornate, quanto camminerai o quando ti riposerai, questa pagina ti offre uno sguardo concreto su una giornata tipo sul Kilimangiaro con Asili Climbing Kilimanjaro. Analizziamo tutto questo dall'alba al tramonto — e oltre.",
  sections: [
    {
      heading: '☀️ Le Mattine in Montagna',
      body: "6:00-6:30: sveglia — La tua giornata inizia con un leggero colpetto sulla tenda e un allegro « buongiorno » dal tuo team di campo. Ti porteranno una bacinella d'acqua calda per rinfrescarti e una bevanda calda (di solito tè, caffè o cioccolata calda) per riscaldare le mani e lo spirito.\n7:00-7:30: colazione — fare il pieno di energia è essenziale. La colazione viene servita nella tenda-ristorante e di solito comprende porridge o fiocchi d'avena, uova (fritte, strapazzate o sode), toast con marmellata, burro di arachidi o miele, frutta fresca e succo, oltre a tè e caffè. Verso la fine della settimana, la colazione diventa uno dei momenti salienti della giornata!",
    },
    {
      heading: "🥾 L'Ora del Trek",
      body: "8:00: inizio dell'escursione del giorno. Dopo colazione, le tue guide danno un breve briefing — dettagli dell'itinerario, tempo di marcia stimato e previsioni meteo. Poi è ora di prendere il sentiero. L'escursione quotidiana varia in base all'itinerario e all'altitudine. Camminerai generalmente 4-7 ore al giorno, a un ritmo lento e costante (« Pole Pole » — swahili per « piano piano »), con pause frequenti per acqua, snack e foto, sempre accompagnato dalla tua guida. Le pause di metà mattina spesso includono snack leggeri o frutta per mantenere la tua energia.",
    },
    {
      heading: "🏕️ L'Ora di Pranzo e la Pausa di Mezzogiorno",
      body: "A seconda dell'itinerario e del terreno, il pranzo può essere servito in un punto pic-nic designato lungo il sentiero o al prossimo campo. Il pranzo tipico comprende uno stufato di verdure o pasta, riso o patate, avocado o insalate, oltre a succo di frutta e tè. Dopo pranzo e una breve pausa, continuerai a camminare per qualche altra ora, oppure ti rilasserai al campo se il trek del giorno è terminato.",
    },
    {
      heading: '🌄 Arrivo al Campo',
      body: "Una volta arrivato al tuo prossimo campo, il tuo team di portatori avrà già allestito la tua tenda, il tuo equipaggiamento da notte e lo spazio pasti. Sarai accolto con acqua calda per lavarti e snack come popcorn o biscotti con tè o caffè caldo. È il momento di rilassarti: scrivere nel tuo diario, goderti le viste, chiacchierare con altri scalatori, riposarti e idratarti.",
    },
    {
      heading: '🍽️ Cena e Briefing Quotidiano',
      body: "18:00-19:00: viene servita la cena. La cena è un pasto abbondante e caldo pensato per ricostituire la tua energia. Aspettati una zuppa (sempre apprezzata), un piatto principale (riso, carne, verdure o pasta), un frutto come dessert e una tisana allo zenzero o alle erbe per favorire la digestione e il sonno. Le tue guide effettueranno anche un breve briefing serale per spiegare cosa ti aspetta, come procede la tua acclimatazione e qualsiasi consiglio su attrezzatura o abbigliamento per il giorno successivo.",
    },
    {
      heading: '🌙 Dormire Sotto le Stelle',
      body: "20:00-21:00: spegnimento delle luci. Con poco o nessun inquinamento luminoso, il cielo notturno del Kilimangiaro è mozzafiato. La maggior parte degli scalatori va a letto presto. Il tuo sacco a pelo ti mantiene al caldo — anche in alta quota. Le notti sono calme, fredde e tranquille. Alcune notti possono essere interrotte dal vento o da un bisogno naturale, ma la maggior parte degli escursionisti dorme profondamente grazie a una giornata intera di cammino.",
    },
    {
      heading: "⛰️ La Notte di Vetta: l'Eccezione",
      body: "L'unico giorno che rompe la routine è la notte di vetta. Ti sveglierai verso le 23:00 o mezzanotte, ti vestirai con strati caldi e inizierai la spinta finale verso la vetta al chiaro di luna. È una salita lenta ed impegnativa — ma raggiungere Uhuru Peak all'alba rende tutto questo gratificante. Dopo la vetta, scenderai al campo base per riposarti, per poi continuare a scendere dalla montagna il giorno successivo.",
    },
    {
      heading: '🔄 Riepilogo del Ritmo Quotidiano',
      table: {
        columns: ['Orario', 'Attività'],
        rows: [
          ['6:00', 'Sveglia + bevande calde'],
          ['7:00', 'Colazione'],
          ['8:00', 'Inizio del trek'],
          ['12:30-13:30', 'Pranzo e riposo'],
          ['15:00-16:00', 'Arrivo al prossimo campo'],
          ['16:30', 'Tè e snack'],
          ['18:00', 'Cena e briefing della guida'],
          ['20:00-21:00', 'Sonno'],
        ],
      },
    },
    {
      heading: '💬 Riflessioni Finali',
      body: "Scalare il Kilimangiaro è un viaggio di ritmo, semplicità e natura. Ogni giorno segue uno svolgimento prevedibile e benevolo — con molto riposo, cibo nutriente, un accompagnamento esperto e tempo per apprezzare la montagna. Con Asili Climbing Kilimanjaro, non cammini solo verso una vetta — abbracci uno stile di vita, anche solo per qualche giorno. E alla fine, non ti sentirai solo realizzato — ti sentirai trasformato.",
    },
  ],
}

const kilimanjaroFullmoonClimbIt: DetailArticleIt = {
  slug: 'kilimanjaro-fullmoon-climb',
  seoTitle: "Scalata del Kilimangiaro con la Luna Piena | Un'Esperienza di Vetta Magica",
  seoDescription: 'Raggiungi la vetta del Monte Kilimangiaro sotto la luna piena. Scopri i migliori itinerari, i tempi e i consigli di preparazione per una scalata magica con la luna piena.',
  heroTitle: "Scalata del Kilimangiaro con la Luna Piena: un'Esperienza di Vetta Magica",
  heroImage: {src: '/images/articles/fullmoon-hero.jpg', alt: 'Tende illuminate in un campo del Kilimangiaro di notte'},
  intro:
    "Scalare il Monte Kilimangiaro è già un'avventura unica nella vita — ma farlo sotto la luce della luna piena? È un'esperienza di tutt'altro livello. La scalata del Kilimangiaro con la luna piena offre agli escursionisti un'occasione rara e indimenticabile di raggiungere la vetta più alta d'Africa con il bagliore della luna a illuminare il cammino. Da Asili Climbing Kilimanjaro, proponiamo scalate accuratamente pianificate durante la luna piena per chi desidera rendere la propria avventura ancora più speciale — e un po' più magica.",
  sections: [
    {
      heading: '🌙 Perché Scalare il Kilimangiaro Durante la Luna Piena?',
      body: "Una scalata con la luna piena non riguarda solo la vista. Riguarda il modo in cui il chiaro di luna trasforma l'esperienza — in particolare durante la tua ultima notte di vetta. Ecco cosa la rende speciale: Illuminazione naturale — la vetta innevata scintilla al chiaro di luna, riducendo la necessità di lampade frontali durante la salita finale. Visibilità maggiore — puoi vedere chiaramente l'ambiente circostante anche a mezzanotte, creando un'atmosfera surreale, quasi onirica. Viste mozzafiato — osserverai il paesaggio del Kilimangiaro immerso in una dolce luce argentea, qualcosa che pochissime persone hanno la fortuna di vedere. Alba in vetta spettacolare — raggiungere Uhuru Peak proprio nel momento in cui il sole sorge su un cielo illuminato dalla luna è un ricordo che conserverai per tutta la vita.",
    },
    {
      heading: '📆 Qual è il Periodo Migliore per una Scalata con la Luna Piena?',
      body: "La luna piena si verifica una volta al mese, e il momento migliore per allineare il tuo trek è raggiungere la vetta la notte della luna piena o un giorno prima o dopo. Questo ti offre un'esposizione massima al chiaro di luna durante la parte più importante del tuo viaggio — la notte di vetta. Prossime date di luna piena (per il 2026): 13 gennaio, 12 febbraio, 14 marzo, 12 aprile, 11 maggio (le date cambiano ogni anno — contattaci per i calendari aggiornati delle scalate con la luna piena). Per raggiungere la vetta in una notte di luna piena, dovrai iniziare la tua scalata 6-8 giorni prima della luna piena, a seconda dell'itinerario scelto.",
    },
    {
      heading: '🥾 Migliori Itinerari per una Scalata con la Luna Piena',
      body: "Tutti i principali itinerari del Kilimangiaro possono essere pianificati intorno alla luna piena, ma alcuni sono più adatti a questo tipo di esperienza. Itinerari consigliati: Route Machame (7 giorni) — uno degli itinerari più panoramici e popolari con un'eccellente acclimatazione. Route Lemosho (8 giorni) — offre un approccio più tranquillo e viste panoramiche. Route Rongai (7 giorni) — ideale per chi cerca un percorso meno frequentato e una vetta con la luna piena da nord. Ognuna di queste opzioni ti offre il giusto ritmo e la flessibilità necessari per allinearti con la luna piena mantenendo comunque una scalata sicura e piacevole.",
    },
    {
      heading: '💡 Una Scalata con la Luna Piena Fa per Te?',
      body: "Una scalata con la luna piena è perfetta per fotografi e narratori visivi, avventurieri romantici (ideale per le coppie!), chi cerca un viaggio spirituale o simbolico, e chiunque desideri elevare la propria esperienza del Kilimangiaro — letteralmente ed emotivamente. Detto questo, le scalate con la luna piena possono anche essere più popolari, specialmente durante i mesi secchi come luglio-ottobre e gennaio-marzo. Si consiglia vivamente di prenotare in anticipo.",
    },
    {
      heading: '🎒 Come Prepararsi per un Trek con la Luna Piena',
      body: "A parte il giusto tempismo della tua scalata, non ci sono differenze importanti nella preparazione. Tuttavia, consigliamo di indossare strati (anche con il chiaro di luna, la notte di vetta è fredda!), di portare una lampada frontale (potresti averne meno bisogno, ma resta essenziale per la sicurezza), e di prenotare in anticipo (i permessi limitati e i posti campo si esauriscono rapidamente per le date di luna piena). Da Asili Climbing Kilimanjaro, ti aiuteremo a pianificare l'itinerario perfetto per allinearti al ciclo lunare, senza affrettare la tua acclimatazione né compromettere la sicurezza.",
    },
    {
      heading: '🌍 Una Connessione Più Profonda con la Montagna',
      body: "C'è qualcosa di profondamente umile nello stare sul Kilimangiaro nel cuore della notte, illuminati solo dalla luna e dalle stelle, mentre l'orizzonte inizia a illuminarsi dei primi bagliori dell'alba. È calmo. È potente. È qualcosa che le parole non possono catturare pienamente — ma che il tuo cuore non dimenticherà mai.",
    },
    {
      heading: '🚀 Pronto per la Scalata al Chiaro di Luna della Tua Vita?',
      body: "Lascia che ti aiutiamo a realizzarlo. Che tu viaggi da solo, in coppia o in gruppo, le nostre scalate del Kilimangiaro con la luna piena sono pensate per un'esperienza unica nella vita — con guide esperte, un accompagnamento personalizzato e un profondo rispetto per la montagna. Contattaci oggi stesso per prenotare il tuo posto nella prossima scalata con la luna piena con Asili Climbing Kilimanjaro.",
    },
  ],
}

const kilimanjaroAltitudeSicknessIt: DetailArticleIt = {
  slug: 'kilimanjaro-altitude-sickness',
  seoTitle: 'Mal di Montagna sul Kilimangiaro | Cosa Devi Sapere Prima di Scalare',
  seoDescription: 'Comprendi il mal acuto di montagna (MAM) sul Kilimangiaro: sintomi, livelli di gravità, prevenzione e come Asili Climbing Kilimanjaro garantisce la tua sicurezza.',
  heroTitle: 'Mal di Montagna sul Kilimangiaro: Cosa Devi Sapere Prima di Scalare',
  heroImage: {src: '/images/articles/altitude-sickness-hero.jpg', alt: 'Scalatore esausto che riposa sulle rocce accanto a uno zaino'},
  intro:
    "Scalare il Monte Kilimangiaro è un'avventura indimenticabile — ma è anche una sfida in alta quota. Una delle cose più importanti da capire prima di iniziare il tuo trek è il mal di montagna, noto anche come mal acuto di montagna (MAM). Da Asili Climbing Kilimanjaro, la tua sicurezza è la nostra massima priorità. Ciò significa educare gli scalatori sui rischi dell'altitudine e su come prepararsi mentalmente e fisicamente per il viaggio verso la vetta.",
  sections: [
    {
      heading: "🌬️ Cos'è il Mal di Montagna?",
      body: "Il mal di montagna si verifica quando il tuo corpo non si adatta bene ai livelli di ossigeno più bassi in alta quota. Il Kilimangiaro culmina a 5.895 metri — e la maggior parte delle persone avverte gli effetti dell'altitudine sopra i 2.500 metri. Quando sali troppo velocemente, il tuo corpo fatica ad adattarsi. Il risultato può variare da lievi mal di testa a gravi complicazioni se ignorato.",
    },
    {
      heading: '🚦 Tre Livelli di Mal di Montagna',
      body: "🟢 MAM lieve — mal di testa, affaticamento, nausea, perdita di appetito, difficoltà a dormire. Comune e gestibile; la maggior parte degli scalatori ne avverte una certa misura.\n🟠 MAM moderato — mal di testa intenso, vertigini, vomito, respiro affannoso a riposo. Richiede attenzione medica e spesso una discesa.\n🔴 MAM grave (HAPE/HACE) — Edema polmonare d'alta quota (liquido nei polmoni), edema cerebrale d'alta quota (gonfiore del cervello), confusione, incapacità di camminare, labbra/punte delle dita blu, affaticamento estremo. Si tratta di un'emergenza medica che richiede una discesa immediata e cure professionali.",
    },
    {
      heading: '⏳ Quando Inizia?',
      body: "I sintomi appaiono generalmente entro 6-24 ore dall'arrivo a un'altitudine più elevata. Ecco perché un'acclimatazione progressiva è essenziale. Scalate più lente significano meno sintomi e tassi di successo in vetta più elevati.",
    },
    {
      heading: '✅ Come Ti Aiutiamo a Prevenire il Mal di Montagna',
      body: "La tua salute è la nostra massima priorità. Le nostre guide sono formate nella risposta all'alta quota ed effettuano un monitoraggio sanitario quotidiano tramite pulsossimetri, bombole di ossigeno d'emergenza e kit di primo soccorso, barelle portatili per l'evacuazione d'emergenza, e piani di evacuazione predisposti con il supporto dei soccorsi locali. Sarai anche informato quotidianamente sul tuo stato, e adegueremo il ritmo o l'itinerario se necessario.",
    },
    {
      heading: "🥾 Come l'Altitudine Influisce sulle Tue Possibilità di Raggiungere la Vetta",
      body: "Il mal di montagna è la ragione numero uno per cui gli scalatori non raggiungono la vetta — non la forma fisica, non l'attrezzatura. Ecco perché scegliere l'itinerario giusto e un'agenzia di guide affidabile è essenziale per il tuo successo. Con una buona preparazione, consapevolezza e supporto, puoi raggiungere Uhuru Peak in sicurezza e goderti le viste mozzafiato dal Tetto dell'Africa.",
    },
    {
      heading: "🌄 Riflessione Finale: Non Temere l'Altitudine — Rispettala",
      body: "Il mal di montagna non è qualcosa da temere — ma è qualcosa da anticipare. Con Asili Climbing Kilimanjaro, sei in buone mani. Non ti guidiamo solo verso la vetta — ti aiutiamo ad arrivarci in sicurezza. Hai altre domande sull'acclimatazione, i livelli di ossigeno o le opzioni di itinerario? Siamo qui per aiutarti a pianificare una scalata sicura, riuscita e trasformativa.",
    },
  ],
}

const kilimanjaroFoodIt: DetailArticleIt = {
  slug: 'kilimanjaro-food',
  seoTitle: 'Cibo sul Kilimangiaro | Cosa Mangerai sulla Montagna',
  seoDescription: "Che cibo mangerai scalando il Kilimangiaro? Pasti, opzioni alimentari, sicurezza dell'acqua e snack — tutto sul cibo in montagna.",
  heroTitle: 'Cibo sul Kilimangiaro: Cosa Mangerai sulla Montagna',
  heroImage: {src: '/images/articles/food-hero.webp', alt: 'Pasto da campo in montagna composto da noodle, uova e insalata di verdure'},
  intro:
    "Scalare il Monte Kilimangiaro è una sfida fisica e mentale — ma con il giusto carburante, il tuo corpo può prosperare in altitudine. Una delle domande più frequenti degli escursionisti è: « Che tipo di cibo mangerò sul Kilimangiaro? » Da Asili Climbing Kilimanjaro, pensiamo che il buon cibo sia più di una necessità — fa parte dell'esperienza. Dalla frutta fresca a colazione alle zuppe calde la sera, ogni pasto è preparato con cura per mantenerti energico, soddisfatto e in buona salute durante tutta la tua scalata.",
  sections: [
    {
      heading: '🧑‍🍳 Pasti Cucinati Freschi in Montagna',
      body: "Ogni trek con Asili include uno chef di montagna dedicato e un team che preparano quotidianamente pasti caldi e abbondanti in una cucina portatile. Trasportiamo ingredienti freschi e cuciniamo da zero — niente buste liofilizzate o sorprese in scatola qui. Sarai sorpreso di quanto possano essere deliziosi i pasti di montagna, anche a 4.000 metri!",
    },
    {
      heading: '🍳 Cosa Puoi Aspettarti',
      body: "Privilegiamo alimenti ricchi di energia, nutrienti e facili da digerire che ti aiutano ad affrontare l'altitudine e il freddo.\n🌅 Colazione: porridge (mais, miglio, avena), uova (sode, fritte o in frittata), toast con marmellata, burro di arachidi o miele, pancake o chapati, frutta fresca (banane, arance, mango), bevande calde (tè, caffè, cioccolata calda).\n🥪 Pranzo: a seconda del programma del giorno, un cestino da pranzo (panini o pollo alla griglia, uova sode, frutta, biscotti o barrette energetiche, succo o tè), oppure un pasto caldo nei giorni di trek più brevi (pasta con verdure o sugo di carne, riso con fagioli o pollo, verdure stufate).\n🍲 Cena: servita in una tenda-ristorante dall'atmosfera accogliente — zuppa (verdure, porri, carote o zucca), riso, pasta o patate, carne alla griglia o stufata (pollo o manzo), verdure cotte (cavolo, spinaci, carote), chapati o panini, frutta fresca come dessert, tisana o cioccolata calda.",
    },
    {
      heading: '🥗 Diete Speciali? Nessun Problema.',
      body: "Che tu sia vegetariano, vegano, intollerante al glutine, o che tu abbia allergie alimentari specifiche, possiamo soddisfare le tue esigenze alimentari. Basta avvisarci in anticipo, e i nostri chef pianificheranno di conseguenza. Tutti i pasti sono preparati igienicamente e serviti con utensili puliti e acqua filtrata.",
    },
    {
      heading: "💧 E per Quanto Riguarda l'Acqua Potabile?",
      body: "Forniamo acqua potabile sicura e trattata durante tutto il tuo trek. L'acqua viene raccolta nei torrenti vicini e bollita, filtrata o trattata chimicamente per la tua sicurezza. Dovresti portare bottiglie d'acqua riutilizzabili o una sacca d'acqua da riempire quotidianamente.",
    },
    {
      heading: '🧂 Sicurezza Alimentare e Igiene',
      body: "In alta quota, il tuo sistema immunitario si indebolisce leggermente, quindi la sicurezza alimentare è essenziale. Il nostro team segue rigorosi protocolli igienici, tra cui il lavaggio accurato di mani e attrezzatura, la preparazione dei pasti in una tenda-cucina pulita dedicata, la garanzia che gli ingredienti siano freschi e conservati in sicurezza, e la prevenzione della contaminazione incrociata.",
    },
    {
      heading: '🍫 Snack: Porta i Tuoi Preferiti',
      body: "Sebbene forniamo tre pasti completi al giorno, potresti voler portare i tuoi snack per energia extra tra i pasti: barrette energetiche o proteiche, frutta secca, mix di frutta secca e noci, compresse o polveri di elettroliti, caramelle dure o cioccolato per apporti rapidi di zucchero. Consiglio: l'altitudine può ridurre il tuo appetito, quindi porta snack che ti piacciono davvero — anche se sembrano banali al livello del mare.",
    },
    {
      heading: "🧘 Come il Cibo Aiuta di Fronte all'Altitudine",
      body: "Scalare il Kilimangiaro richiede più della semplice resistenza — richiede una nutrizione adeguata. Pasti ricchi di carboidrati e poveri di grassi aiutano il tuo corpo ad adattarsi ai livelli di ossigeno più bassi. Zuppe e tè caldi aiutano anche a rimanere idratati e a combattere i sintomi legati all'altitudine come mal di testa o nausea.",
    },
    {
      heading: '🏔️ Nutrirsi per Raggiungere la Vetta',
      body: "Ogni giorno metti alla prova il tuo corpo sul Kilimangiaro, e ciò che mangi influisce direttamente sulle tue prestazioni, il tuo umore e il tuo successo. Da Asili Climbing Kilimanjaro, prendiamo il cibo sul serio — perché la tua vetta ne dipende. Pronto a scalare ben nutrito e senza preoccupazioni? Contattaci per saperne di più sui nostri piani alimentari o per parlare con ex scalatori che hanno cenato con noi sul Tetto dell'Africa.",
    },
  ],
}

const kilimanjaroPortersIt: DetailArticleIt = {
  slug: 'kilimanjaro-porters',
  seoTitle: 'Portatori del Kilimangiaro | Il Cuore Pulsante di Ogni Scalata Riuscita',
  seoDescription: 'Incontra i portatori del Kilimangiaro che rendono possibile ogni scalata. Scopri il trattamento etico, il KPAP, i consigli sulle mance e come mostrare la tua riconoscenza.',
  heroTitle: 'Portatori del Kilimangiaro: il Cuore Pulsante di Ogni Scalata Riuscita',
  heroImage: {src: '/images/articles/porters-hero.webp', alt: 'Un portatore che trasporta attrezzatura sul sentiero del Kilimangiaro'},
  intro:
    "Quando si pensa a scalare il Monte Kilimangiaro, è naturale immaginare la vetta, la sfida e le viste mozzafiato. Ma dietro ogni trek riuscito c'è un team di persone dedicate e laboriose che rendono possibile il viaggio: i portatori del Kilimangiaro. Da Asili Climbing Kilimanjaro, onoriamo e rispettiamo il ruolo vitale che svolgono i portatori — non solo come aiutanti, ma come eroi della montagna.",
  sections: [
    {
      heading: '👣 Chi Sono i Portatori del Kilimangiaro?',
      body: "I portatori sono uomini e donne tanzaniani locali che trasportano l'attrezzatura, il cibo, l'acqua e le forniture necessarie per il tuo trek. Montano e smontano il campo, aiutano con la logistica e spesso danno una mano quando hai bisogno di incoraggiamento o assistenza sul sentiero. Senza di loro, le scalate del Kilimangiaro — per la maggior parte delle persone — sarebbero quasi impossibili.",
    },
    {
      heading: '🧭 Cosa Fanno i Portatori in Montagna?',
      body: "🏕️ Trasportano l'attrezzatura: tende, sacchi a pelo, forniture da cucina, il tuo borsone da viaggio (fino a 15 kg).\n🧑‍🍳 Supportano il team: aiutano i cuochi, servono i pasti, vanno a prendere l'acqua e allestiscono le tende-ristorante.\n🛖 Montano e smontano il campo: a volte arrivano al campo ore prima di te.\n🧤 Assistono gli scalatori: talvolta aiutando scalatori stanchi o in difficoltà.\nSpesso fanno tutto questo con il sorriso, anche dopo lunghe ore su un terreno ripido e accidentato.",
    },
    {
      heading: '🎒 Quanto Trasportano i Portatori del Kilimangiaro?',
      body: "I portatori sono limitati dai regolamenti del parco nazionale del Kilimangiaro e dal KPAP (Kilimanjaro Porters Assistance Project) a trasportare al massimo 20 kg — questo include i loro effetti personali. Tuttavia, non tutti gli operatori fanno rispettare questo limite equamente. Ecco perché è fondamentale scalare con un operatore aderente al KPAP come Asili Climbing Kilimanjaro, che si impegna per un trattamento equo e il benessere dei portatori.",
    },
    {
      heading: '🤝 Trattamento Etico dei Portatori: Cosa Significa',
      body: "Un trekking etico significa che i portatori sono pagati equamente (puntualmente e in modo trasparente), ricevono pasti adeguati in montagna, dispongono di un riparo adeguato e attrezzatura calda, sono limitati ai carichi consentiti dalla legge, sono inclusi nelle cerimonie delle mance, e sono rispettati come membri a pieno titolo del team. Da Asili, questo non è una semplice casella da spuntare — è così che conduciamo ogni scalata.",
    },
    {
      heading: '📣 Perché Questo Conta per Te come Escursionista',
      body: "Quando scegli un'azienda che tratta bene i suoi portatori, scali in modo responsabile. Sostieni i mezzi di sussistenza locali, migliori le condizioni di lavoro e contribuisci a trasformare il turismo in una forza positiva in Tanzania. Vivi anche un trek migliore. Un team di portatori ben supportato è motivato, affidabile e orgoglioso del proprio ruolo nel tuo successo.",
    },
    {
      heading: '💡 Quanti Portatori Sono Necessari per Scalatore?',
      body: "Un trek medio sul Kilimangiaro richiede 3-4 portatori per scalatore, a seconda della lunghezza dell'itinerario e delle dimensioni del gruppo, oltre a membri aggiuntivi del team come guide, cuochi e guide assistenti. Da Asili, non risparmiamo mai sottodimensionando il personale delle nostre scalate. Ogni membro del team svolge un ruolo per garantire il tuo comfort e la tua sicurezza.",
    },
    {
      heading: '🎖️ Kilimanjaro Porters Assistance Project (KPAP)',
      body: "Collaboriamo con orgoglio con il KPAP per rispettare e superare i più alti standard in materia di benessere dei portatori. Il KPAP è un'organizzazione senza scopo di lucro che monitora le condizioni dei portatori e ritiene le aziende responsabili di un trattamento etico. Incoraggiamo tutti gli escursionisti a chiedere se il loro operatore è certificato KPAP — è il punto di riferimento assoluto sul Kilimangiaro.",
    },
    {
      heading: '💰 Mance ai Portatori: un Segno di Gratitudine',
      body: "La mancia è un modo comune e significativo per mostrare la tua riconoscenza. Anche se non è obbligatoria, è attesa e molto apprezzata. Il nostro team fornisce linee guida trasparenti sulle mance eque, e ci assicuriamo che le mance vengano distribuite direttamente a ogni membro del team in modo pubblico e rispettoso.",
      table: {columns: ['Ruolo', 'Mancia tipica (per scalatore, trek di 7 giorni)'], rows: [['Portatori', '6-10 $/giorno'], ['Cuoco', '10-15 $/giorno'], ['Guida', '20-25 $/giorno']]},
    },
    {
      heading: '🧍 Le Storie Dietro i Sorrisi',
      body: "Molti portatori sul Kilimangiaro sono studenti, agricoltori o leader di comunità che guadagnano un reddito per sostenere le loro famiglie. Alcuni diventano cuochi o guide — e accompagniamo con orgoglio coloro che sognano di fare carriera. Da Asili, conosciamo i loro nomi, le loro storie e le loro ambizioni — e trattiamo ogni membro del team con rispetto. « Non portano solo attrezzatura — portano sogni, e ti aiutano a raggiungere i tuoi. » — Joseph, guida capo da Asili Climbing Kilimanjaro",
    },
    {
      heading: '📷 Come Mostrare la Tua Riconoscenza',
      body: "Impara i nomi dei tuoi portatori, informati sulla loro vita e condividi un sorriso, partecipa alla cerimonia finale delle mance, scatta e condividi foto con il loro permesso, e lascia una recensione menzionando la tua esperienza positiva.",
    },
    {
      heading: '🚶 Scala con Rispetto. Scala con Cuore.',
      body: "Da Asili Climbing Kilimanjaro, crediamo che i portatori meritino più di un applauso — meritano dignità. Scalando con noi, contribuisci a stabilire uno standard più alto per il turismo di montagna, dove le persone sono valorizzate quanto la vetta. Vuoi saperne di più sulle nostre politiche verso i portatori o incontrare il team che rende tutto questo possibile? Contatta Asili Climbing Kilimanjaro o inizia a pianificare oggi stesso il tuo trek etico.",
    },
  ],
}

const kilimanjaroPackingListIt: DetailArticleIt = {
  slug: 'kilimanjaro-packing-list',
  seoTitle: "Lista dell'Equipaggiamento per il Monte Kilimangiaro | Guida a Materiale e Abbigliamento",
  seoDescription: "La lista completa dell'equipaggiamento per il Monte Kilimangiaro: strati di abbigliamento, calzature, attrezzatura da notte, essenziali dello zaino giornaliero e ciò che fornisce il tuo operatore.",
  heroTitle: "Lista Completa dell'Equipaggiamento per il Monte Kilimangiaro",
  heroImage: {src: '/images/articles/packing-hero.webp', alt: 'Attrezzatura da trekking e arrampicata disposta su un pavimento in legno'},
  intro:
    "Scalare il Monte Kilimangiaro non è una vacanza qualsiasi. A 5.895 metri, richiede sia resistenza mentale che l'attrezzatura giusta. La buona notizia? Non devi spendere una fortuna — ma devi fare i bagagli in modo intelligente. Questa guida copre tutto ciò che devi portare per una scalata sicura, confortevole e riuscita. Che tu ti unisca a un trek guidato o scali con un team privato, questa lista è pensata per chiarezza, comfort e preparazione al freddo.",
  sections: [
    {
      heading: '🎒 Lista degli Essenziali: Cosa Devi Assolutamente Portare',
      body: "Ecco gli indispensabili assoluti — attrezzatura e abbigliamento che userai ogni giorno.\n🧥 Strati di abbigliamento: il Kilimangiaro conta cinque zone ecologiche, e le temperature variano enormemente. Pensa: sistema a strati. Strati base (intimo termico) — 2-3 set (superiore e inferiore), traspiranti. Strati intermedi — pile o giacche softshell. Giacca isolante — piuma o sintetica per la notte di vetta. Strato esterno — giacca e pantaloni impermeabili e antivento (Gore-Tex preferito). Pantaloni da trekking — 2 paia, ad asciugatura rapida. T-shirt — 3-4 traspiranti. Berretto caldo — che copra le orecchie. Cappello o visiera da sole — per le altitudini più basse. Guanti — guanti leggeri sottili + guanti impermeabili isolanti. Buff o scaldacollo — per vento, polvere e calore.",
      image: {src: '/images/articles/packing-gear.jpg', alt: 'Diagramma illustrato dell\'attrezzatura da trekking del Kilimangiaro, inclusi abbigliamento, calzature e accessori'},
    },
    {
      heading: '👟 Calzature',
      body: "Camminerai 6-8 ore al giorno, quindi il comfort è essenziale. Scarponi da trekking — impermeabili, già rodati, con supporto alla caviglia. Scarpe da campo — Crocs o scarpe da trail per le sere. Calze di lana o sintetiche — 4-6 paia. Ghette — opzionali, ma utili nelle zone fangose/innevate.",
      image: {src: '/images/articles/packing-boot.jpg', alt: 'Scarpone da trekking impermeabile'},
    },
    {
      heading: '🛏️ Attrezzatura da Notte',
      body: "La maggior parte dei circuiti include tende e materassini, ma conferma cosa viene fornito. Sacco a pelo — adatto ad almeno -10°C o meno. Lenzuolo per sacco a pelo — aggiunge calore e mantiene il sacco pulito. Cuscino da viaggio o cuscino gonfiabile.",
      image: {src: '/images/articles/packing-sleeping-bag.jpg', alt: 'Sacco a pelo e lenzuolo srotolati'},
    },
    {
      heading: '🎒 Essenziali dello Zaino Giornaliero',
      body: "Porterai il tuo zaino giornaliero con gli articoli necessari tra un campo e l'altro: zaino giornaliero da 30-40 L con spallacci imbottiti e cintura in vita. Sistema di idratazione — 2-3 L (CamelBak o bottiglie d'acqua). Snack — mix di frutta secca, barrette energetiche, frutta essiccata. Occhiali da sole — anti-UV, categoria ghiacciaio preferita. Crema solare e burrocacao — SPF 30+. Lampada frontale — con batterie di ricambio (per la notte di vetta). Fotocamera o smartphone — opzionale, per le foto. Taccuino e penna — opzionale, per tenere un diario.",
    },
    {
      heading: '🧼 Igiene Personale e Salute',
      body: "Rimani fresco (o il più fresco possibile) con questo kit igienico minimalista: articoli da toeletta (sapone biodegradabile, spazzolino, dentifricio, deodorante), salviette umidificate (la tua migliore amica in montagna), gel igienizzante (essenziale prima dei pasti), asciugamano ad asciugatura rapida (taglia media), carta igienica (porta un rotolo in un sacchetto Ziploc), kit di primo soccorso di base (trattamento vesciche, antidolorifici, antidiarroici), farmaco per il mal di montagna (Diamox — consulta il tuo medico), farmaci personali (incluse compresse antimalariche se necessario), tappi per le orecchie (per i compagni di tenda che russano).",
    },
    {
      heading: '📦 Extra Opzionali ma Utili',
      body: "Questi elementi non sono obbligatori ma possono fare una grande differenza in termini di comfort: batteria esterna (solare o precaricata), bastoncini da trekking (vivamente consigliati per ginocchia ed equilibrio), sacchetti organizzatori/impermeabili (per tenere l'attrezzatura organizzata e asciutta), integratori energetici (compresse di elettroliti o sali di idratazione), nastro adesivo (per riparazioni rapide), libro o e-reader (per i momenti di relax), sacchetti Ziploc (per rifiuti, snack, dispositivi elettronici), bottiglia o imbuto riutilizzabile per urinare (comodità notturna).",
    },
    {
      heading: "🧳 Cosa Viene Fornito dall'Operatore?",
      body: "La maggior parte delle aziende affidabili come Asili Climbing Kilimanjaro include tende, materassini, tende-ristorante e utensili, cibo, acqua, personale di cucina e portatori (che trasportano il tuo borsone principale). Sei generalmente responsabile del tuo abbigliamento, sacco a pelo, attrezzatura personale e zaino giornaliero. Molti articoli possono essere noleggiati a Moshi o Arusha — informati con il tuo operatore in anticipo.",
    },
  ],
}

const kilimanjaroClimbCostIt: DetailArticleIt = {
  slug: 'kilimanjaro-climb-cost',
  seoTitle: 'Costo della Scalata del Kilimangiaro | Cosa Devi Sapere',
  seoDescription: 'Quanto costa scalare il Kilimangiaro? Dettaglio completo dei costi per itinerario, dimensione del gruppo, noleggio attrezzatura, mance e cosa è incluso.',
  heroTitle: 'Costo della Scalata del Kilimangiaro: Cosa Devi Sapere',
  heroImage: {src: '/images/articles/cost-hero.webp', alt: 'Uno scalatore che festeggia davanti al cartello della vetta Uhuru Peak'},
  intro:
    "Scalare il Monte Kilimangiaro è un'avventura che cambia la vita, ma ha un costo. Capire dove va il tuo denaro — e cosa aspettarti — è essenziale per pianificare una scalata riuscita e sicura. Il costo totale può variare notevolmente in base all'itinerario, al numero di giorni, al livello di comfort desiderato e all'agenzia scelta.",
  sections: [
    {
      heading: '💰 Quanto Costa Scalare il Kilimangiaro?',
      body: 'In media, il costo varia tra 1.700 $ e 6.000 $ a persona. Ogni itinerario del Kilimangiaro ha esigenze logistiche, rapporti portatori e tasse di parco diversi in base al numero di giorni:',
      table: {
        columns: ['Itinerario', 'Giorni', 'Costo approx. (fascia media)', 'Perché il prezzo varia'],
        rows: [
          ['Marangu', '5-6', '1.800 $ - 2.500 $', 'Usa rifugi, meno portatori'],
          ['Machame', '6-7', '2.000 $ - 3.000 $', 'Itinerario panoramico popolare'],
          ['Lemosho', '7-8', '2.300 $ - 3.500 $', 'Più lungo, partenza remota'],
          ['Rongai', '6-7', '2.200 $ - 3.200 $', 'Meno frequentato, approccio da nord'],
          ['Umbwe', '6', '2.100 $ - 3.100 $', 'Scalata ripida e rapida'],
          ['Northern Circuit', '8-9', '2.800 $ - 4.200 $', 'Il più lungo, tasso di successo più alto'],
        ],
      },
    },
    {
      heading: '🧾 2. Dettaglio dei Costi Voce per Voce',
      body: 'Ecco dove va il tuo denaro, per una scalata di fascia media di 7 giorni:',
      table: {
        columns: ['Categoria di Spesa', 'Costo Stimato (USD)'],
        rows: [
          ['Tasse di parco e permessi', '800 $ - 1.100 $'],
          ['Stipendi della guida e del team', '400 $ - 600 $'],
          ['Cibo e forniture da cucina', '150 $ - 250 $'],
          ['Attrezzatura (tende, ecc.)', '100 $ - 200 $'],
          ['Trasferimenti (verso il punto di partenza)', '50 $ - 100 $'],
          ['Amministrazione e supporto sicurezza', '100 $ - 200 $'],
          ["Margine di profitto dell'operatore", '200 $ - 400 $'],
        ],
      },
    },
    {
      heading: '👥 3. Dimensione del Gruppo e Costi della Scalata Privata',
      body: 'Scalata in gruppo aperto (6-12 persone): costo per persona più basso. Scalata privata (solo o gruppo personalizzato): generalmente 300-800 $ in più a persona. Scalate di lusso (con servizi igienici portatili, pasti migliorati, meno scalatori): possono raggiungere i 5.000-7.000 $.',
      image: {src: '/images/articles/cost-route.jpg', alt: 'Gruppo di escursionisti che camminano verso il Monte Kilimangiaro'},
    },
    {
      heading: '🏨 4. Alloggio Prima e Dopo la Scalata',
      body: 'La maggior parte dei pacchetti include 1 notte prima della scalata e 1 notte dopo, in un hotel 2-3 stelle a Moshi o Arusha (con possibilità di upgrade). Prevedi circa 50-150 $ a notte se prenoti autonomamente.',
      image: {src: '/images/articles/cost-lodge.jpg', alt: 'Alloggio in lodge vicino al Kilimangiaro'},
    },
    {
      heading: "🎒 5. Noleggio o Acquisto dell'Attrezzatura",
      body: 'Se non possiedi la tua attrezzatura, dovrai noleggiarla sul posto:',
      table: {
        columns: ['Articolo', 'Costo di Noleggio (USD)'],
        rows: [
          ['Sacco a pelo', '30 $ - 50 $'],
          ['Giacca in piuma', '20 $ - 40 $'],
          ['Bastoncini da trekking', '10 $ - 15 $'],
          ['Ghette', '10 $ - 15 $'],
          ['Lampada frontale', '10 $ - 20 $'],
        ],
      },
    },
    {
      heading: '💸 6. Consigli sulle Mance',
      body: 'Le mance sono attese e molto apprezzate. Il Kilimanjaro Porters Assistance Project (KPAP) raccomanda: guida — 20 $/giorno, guida assistente — 15 $/giorno, cuoco — 12 $/giorno, portatori — 6-10 $/giorno ciascuno. Totale mance per scalatore (scalata di 7 giorni): 250-300 $ (a seconda della dimensione del gruppo).',
      image: {src: '/images/articles/cost-tipping.jpg', alt: 'Uno scalatore e una guida sul sentiero del Kilimangiaro'},
    },
    {
      heading: "🚑 7. Costi dell'Assicurazione",
      body: "L'assicurazione di viaggio è obbligatoria per la maggior parte degli operatori. Aspettati di pagare 80-150 $ per una copertura di trekking in alta quota (sopra i 5.000 m), l'evacuazione d'emergenza e l'annullamento o l'interruzione del viaggio.",
    },
    {
      heading: '🧭 8. Costo contro Valore: Cosa Paghi Realmente?',
      table: {
        columns: ['Operatore più Economico', 'Operatore di Fascia Media', 'Operatore Premium'],
        rows: [
          ['1.500 $ - 1.900 $', '2.000 $ - 3.200 $', '4.000 $ - oltre 6.000 $'],
          ['Guide inesperte', 'Guide certificate ed esperte', 'Guide certificate Wilderness First Responder (WFR)'],
          ['Attrezzatura di scarsa qualità', 'Buone tende, attrezzatura di sicurezza', 'Attrezzatura di alta gamma + servizi igienici portatili'],
          ['Nessun ossigeno né controlli di sicurezza', 'Monitoraggio sanitario quotidiano', 'Ossigeno di riserva, team medico privato'],
          ['Trattamento non etico dei portatori', "Salari equi tramite l'affiliazione KPAP", 'Miglior rapporto portatori/clienti'],
        ],
      },
    },
    {
      heading: 'Cosa è Incluso nel Costo?',
      body: "Le tasse di parco (che possono rappresentare fino al 50% del costo totale), l'alloggio in campeggio/rifugi, tutti i pasti in montagna, guide di montagna professionali, portatori e cuochi, tende, materassini e attrezzatura da ristorazione, il trasporto andata e ritorno verso il punto di partenza, le tasse di soccorso e i permessi.",
    },
    {
      heading: 'Cosa NON è Incluso?',
      body: "I voli internazionali o domestici, le tasse per il visto, l'assicurazione di viaggio (obbligatoria), le mance per guide e portatori, il noleggio o l'acquisto dell'attrezzatura, i soggiorni in hotel prima/dopo la scalata, le spese personali (snack, bevande, souvenir).",
      image: {src: '/images/articles/cost-notincluded.jpg', alt: 'Uno scalatore sul terreno roccioso del Monte Kilimangiaro'},
    },
    {
      heading: 'Nota',
      body: "Scalare il Kilimangiaro è un'avventura seria, e il prezzo che paghi deve riflettere la qualità, la sicurezza e l'esperienza che ti aspetti. Anche se non devi spendere una fortuna, evita di risparmiare sulla montagna. Non è solo un'escursione — è un viaggio unico nella vita.",
    },
  ],
}

const bestTimeToClimbKilimanjaroIt: DetailArticleIt = {
  slug: 'best-time-to-climb-kilimanjaro',
  seoTitle: 'Il Periodo Migliore per Scalare il Kilimangiaro | Guida Stagione per Stagione',
  seoDescription: "Qual è il periodo migliore per scalare il Kilimangiaro? Un dettaglio mese per mese del meteo, dell'affluenza e delle condizioni per aiutarti a scegliere le date della tua scalata.",
  heroTitle: '🕒 Il Periodo Migliore per Scalare il Kilimangiaro',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Elefante al pascolo con il Monte Kilimangiaro sullo sfondo'},
  intro:
    "Scalare il Monte Kilimangiaro è un'avventura incredibile — e scegliere quando andare può essere altrettanto importante quanto scegliere come arrivarci. Con le sue vette imponenti, le condizioni meteorologiche mutevoli e i paesaggi spettacolari, pianificare bene i tempi del tuo trek può fare la differenza tra una scalata confortevole e una scalata difficile. Allora, qual è il periodo migliore per scalare il Monte Kilimangiaro? Analizziamolo stagione per stagione, basandoci su esperienza reale e consigli di esperti.",
  sections: [
    {
      heading: 'Mesi Migliori per Scalare il Kilimangiaro',
      body:
        "Esistono due stagioni di trek ideali sul Kilimangiaro.\n🗓️ Gennaio a metà marzo — Meteo: caldo, prevalentemente secco, giornate soleggiate. Paesaggi: viste limpide, specialmente al mattino presto. Affluenza: moderata, meno frequentata rispetto all'alta stagione. Punti di forza: periodo eccellente per la fotografia con vette innevate. Questo periodo è eccellente per gli scalatori che desiderano temperature miti e meno affluenza, in particolare da gennaio a inizio febbraio. Tuttavia, marzo segna l'inizio delle grandi piogge, quindi è meglio andare prima di metà marzo.\n🗓️ Giugno a ottobre (alta stagione) — Meteo: secco e stabile. Paesaggi: magnifici, specialmente con cieli splendenti all'alba. Affluenza: è il periodo più frequentato sulla montagna. Punti di forza: eccellenti condizioni di vetta e visibilità dei sentieri. Questo è il periodo più popolare per scalare il Kilimangiaro, in particolare durante le vacanze estive europee e nordamericane. I sentieri sono più asciutti e le condizioni più affidabili — preparati semplicemente a condividerli con altri escursionisti.\n🌧️ Stagioni da evitare (se possibile)\n🗓️ Metà marzo a maggio (grande stagione delle piogge) — forti piogge rendono i sentieri scivolosi e la visibilità scarsa. Rischio maggiore di disagio legato all'altitudine a causa delle condizioni fredde/umide. Meno escursionisti, cosa che alcuni possono apprezzare — ma questo ha un costo. A meno di essere molto esperti e ben preparati, non è il periodo ideale per scalare. I campeggi possono diventare fangosi, e le viste sono spesso velate.\n🗓️ Novembre a inizio dicembre (piccola stagione delle piogge) — meno intensa delle grandi piogge, ma comunque imprevedibile. Meno scalatori sul sentiero. Potresti avere alcune giornate limpide e fresche — ma è una scommessa. Questa stagione è migliore delle grandi piogge ma rimane poco consigliata a meno di essere a proprio agio con un tempo occasionalmente umido.",
      image: {src: '/images/articles/besttime-uhuru.webp', alt: 'Cartello della vetta Uhuru Peak'},
    },
    {
      heading: '❄️ E per Quanto Riguarda la Neve sul Kilimangiaro?',
      body: "La neve è comune in vetta tutto l'anno, ma se speri di vedere Uhuru Peak coperta di neve, le tue migliori possibilità sono da gennaio a marzo e durante o subito dopo le stagioni delle piogge (aprile o inizio dicembre). La neve aggiunge magia al giorno di vetta — ma aggiunge anche una sfida, quindi pianifica di conseguenza.",
    },
    {
      heading: '📊 Panoramica del Meteo del Kilimangiaro per Mese',
      table: {
        columns: ['Mese', 'Stagione', 'Condizioni', 'Affluenza'],
        rows: [
          ['Gennaio', 'Secco (migliore)', 'Cielo limpido, temperature miti', 'Media'],
          ['Febbraio', 'Secco (migliore)', 'Caldo, ottima visibilità', 'Media'],
          ['Marzo', 'Transizione', 'Pioggia in aumento', 'Bassa'],
          ['Aprile', 'Piovoso (da evitare)', 'Umido, nuvoloso, scivoloso', 'Molto bassa'],
          ['Maggio', 'Piovoso (da evitare)', 'Cattive condizioni dei sentieri', 'Molto bassa'],
          ['Giugno', 'Secco (alta stagione)', 'Mattine fresche, viste limpide', 'Alta'],
          ['Luglio', 'Secco (alta stagione)', 'Notti fredde, giornate soleggiate', 'Molto alta'],
          ['Agosto', 'Secco (alta stagione)', 'Meteo eccellente in vetta', 'Molto alta'],
          ['Settembre', 'Secco (alta stagione)', 'Viste splendide, clima mite', 'Alta'],
          ['Ottobre', 'Transizione', "Un po' di pioggia a fine mese", 'Media'],
          ['Novembre', 'Piovoso (da evitare)', 'Piccole piogge, imprevedibile', 'Bassa'],
          ['Dicembre', 'Transizione', 'Limpido a inizio mese, più umido a fine mese', 'Media'],
        ],
      },
    },
    {
      heading: '🏔️ Consigli di Esperti per Scegliere il Periodo Giusto',
      body: "Evita le vacanze scolastiche (luglio e agosto) se vuoi meno affluenza. Se deve essere la stagione delle piogge, parti con un operatore esperto e prevedi una protezione meteo supplementare. L'acclimatazione è più importante del sole — itinerari più lunghi come Lemosho e Northern Circuit offrono un migliore adattamento all'altitudine, indipendentemente dalla stagione. I mesi freddi significano foto migliori in vetta (meno copertura nuvolosa), ma i mesi caldi significano più comfort sul sentiero.",
    },
  ],
}

const kilimanjaroSafarisIt: DetailArticleIt = {
  slug: 'kilimanjaro-safaris',
  seoTitle: 'Safari al Kilimangiaro | Combina la Vetta e la Savana',
  seoDescription: 'Abbina la tua scalata del Kilimangiaro a un safari in Tanzania. Esplora Tarangire, il lago Manyara, il cratere del Ngorongoro e il Serengeti dopo la tua vetta.',
  heroTitle: '🐘 Safari al Kilimangiaro: Combina la Vetta e la Savana',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Elefante al pascolo con il Monte Kilimangiaro sullo sfondo'},
  intro:
    "La tua avventura africana non finisce in vetta — inizia dove si aggirano gli animali selvatici. Scalare il Monte Kilimangiaro è un'impresa imperdibile, ma abbinare il tuo trek a un safari indimenticabile in Tanzania completa l'esperienza. Dopo giorni di trekking in alta quota, immagina di scambiare i tuoi scarponi da trekking con un binocolo e i sentieri polverosi con pianure dorate — inseguendo leoni, elefanti e gnu attraverso i paesaggi più emblematici dell'Africa Orientale. Da Asili Climbing Kilimanjaro, ti aiutiamo a passare dalle vette innevate alla savana con esperienze di safari fluide prima o dopo il trek, adattate al tuo tempo, budget e interessi.",
  sections: [
    {
      heading: '🌍 Cos\'è un Safari Kilimangiaro?',
      body: "Un safari Kilimangiaro si riferisce generalmente a un circuito faunistico nel nord della Tanzania, combinato con una scalata del Kilimangiaro. Poiché la montagna si trova vicino ad alcuni dei migliori parchi faunistici d'Africa, sei già nella posizione ideale per esplorarli. Che tu voglia una rapida fuga di 2 giorni o un safari completo di 5-7 giorni, le possibilità sono infinite — ed epiche.",
    },
    {
      heading: '🏞️ Migliori Parchi di Safari Vicino al Kilimangiaro',
      body: "1. Parco Nazionale di Tarangire — famoso per le sue immense mandrie di elefanti, i suoi baobab, la sua atmosfera fuori dai sentieri battuti. Distanza da Arusha: circa 2 ore. Ideale per un inizio o una fine rilassata della tua avventura al Kilimangiaro.\n2. Parco Nazionale del Lago Manyara — famoso per i suoi leoni che si arrampicano sugli alberi, i suoi fenicotteri, la sua foresta di acque sotterranee. Distanza: circa 2,5 ore. Ideale per rapidi assaggi di fauna selvatica, specialmente lungo il percorso verso la regione del Ngorongoro.\n3. Cratere del Ngorongoro — famoso per l'osservazione dei Big Five in un solo giorno. Un sito Patrimonio dell'Umanità UNESCO e la caldera intatta più grande del mondo. Ideale per la concentrazione di fauna selvatica e la fotografia.\n4. Parco Nazionale del Serengeti — famoso per la Grande Migrazione, le sue pianure infinite, leoni e leopardi. Una destinazione unica nella vita. Ideale per safari di 3-5 giorni con un'immersione profonda nella natura selvaggia.",
      image: {src: '/images/articles/safaris-gallery1.webp', alt: 'Una leonessa che riposa con due cuccioli'},
    },
    {
      heading: '🗓️ Quando Partire per il Safari Dopo il Kilimangiaro',
      body: "Puoi partire per il safari tutto l'anno, ma i periodi migliori per osservare la fauna selvatica sono: giugno-ottobre (stagione secca) — gli animali si radunano ai punti d'acqua, e la vegetazione è più rada, ideale per le osservazioni. Dicembre-marzo — stagione delle nascite nel sud del Serengeti, ricca di azione spettacolare tra predatori e prede. Combina il tuo safari con una scalata del Kilimangiaro da giugno a ottobre per l'abbinamento di avventura definitivo.",
    },
    {
      heading: '🦓 Cosa Vedrai in Safari',
      body: "A seconda dei parchi e della stagione, potresti avvistare i Big Five (leone, leopardo, elefante, bufalo, rinoceronte), ghepardi che scattano attraverso le pianure, giraffe che si muovono tra i boschi di acacie, ippopotami che si crogiolano sulle rive dei fiumi, fenicotteri al lago Manyara o Natron, e la Grande Migrazione di gnu e zebre (il tempismo conta!).",
      image: {src: '/images/articles/safaris-gallery2.webp', alt: 'Un elefante in piedi in una prateria verde'},
    },
    {
      heading: '🛏️ Dove Alloggerai',
      body: "Che tu cerchi comfort o avventura, l'alloggio da safari si presenta in stili adatti a ogni viaggiatore: lodge di lusso con viste sulle savane e sui bordi dei crateri, campi tendati di fascia media che offrono comfort e immersione, campi mobili che si spostano con la Grande Migrazione, e opzioni economiche per backpacker o viaggiatori solitari. Da Asili, ti aiutiamo a trovare il miglior alloggio da safari in base al tuo stile, alla dimensione del tuo gruppo e al tuo budget.",
    },
    {
      heading: '💡 Perché Combinare un Safari con una Scalata del Kilimangiaro?',
      body: "Recupera e rilassati: dopo l'intensità del trek, il safari lascia riposare il tuo corpo senza porre fine alla tua avventura. Massimizza il tuo viaggio: hai già viaggiato fino in Tanzania, prolunga il tuo soggiorno e rendilo ancora più gratificante. Scopri la diversità dell'Africa: dalle vette innevate alle pianure ricche di fauna selvatica, questa è l'Africa al suo meglio. Perfetto per amici o familiari che ti raggiungono più tardi: alcuni membri della famiglia potrebbero non scalare ma incontrarti per il safari.",
      table: {
        columns: ['Giorno', 'Attività'],
        rows: [
          ['1-7', 'Scalare il Kilimangiaro (ad es., route Machame o Lemosho)'],
          ['8', 'Trasferimento a Tarangire per il safari'],
          ['9', 'Safari al cratere del Ngorongoro'],
          ['10', 'Ritorno in auto ad Arusha o partenza in aereo'],
        ],
      },
    },
    {
      heading: '💰 Quanto Costa un Safari Kilimangiaro?',
      body: "Il prezzo del safari dipende dalla durata, dal tipo di alloggio e dai parchi visitati: safari di 2-3 giorni a partire da 600-1.200 $ a persona, safari di 4-5 giorni 1.200-2.000 $ a persona, safari di lusso a partire da 2.500 $ a seconda della scelta dei lodge e dei veicoli privati. Da Asili Climbing Kilimanjaro, offriamo tariffe trasparenti senza costi nascosti. Circuiti di gruppo, in famiglia e privati tutti disponibili.",
    },
    {
      heading: 'Pronto a Passare dalla Vetta alle Pianure?',
      body: "Che tu scali il Kilimangiaro da solo, con amici o in famiglia, un safari è il capitolo perfetto successivo. Lascia che ti aiutiamo a pianificare il viaggio della tua vita — a piedi e su quattro ruote. Contatta Asili Climbing Kilimanjaro per iniziare a creare oggi stesso il tuo combinato montagna + safari.",
    },
  ],
}

const soloKilimanjaroClimbIt: DetailArticleIt = {
  slug: 'solo-kilimanjaro-climb',
  seoTitle: "Scalata del Kilimangiaro in Solitaria | Il Tuo Viaggio Personale verso il Tetto dell'Africa",
  seoDescription: 'Tutto ciò che devi sapere sulla scalata in solitaria del Kilimangiaro: è sicura, trek in gruppo o privati, costi, e consigli di esperti per escursionisti indipendenti.',
  heroTitle: 'Scalata del Kilimangiaro in Solitaria',
  heroImage: {src: '/images/articles/solo-hero.jpg', alt: "Uno scalatore solitario che osserva l'alba dal Kilimangiaro"},
  intro:
    "Se sei un viaggiatore solitario che sogna di stare sulla vetta più alta d'Africa, scalare il Kilimangiaro da solo è più che possibile — è un'esperienza incredibilmente appagante. Da Asili Climbing Kilimanjaro, siamo specializzati nell'accompagnare gli avventurieri solitari, offrendo il supporto, la sicurezza e la flessibilità necessari per rendere questo viaggio veramente tuo. Ecco tutto ciò che devi sapere sulla scalata del Kilimangiaro come viaggiatore solitario.",
  sections: [
    {
      heading: 'Si Può Scalare il Kilimangiaro in Solitaria?',
      body: "Sebbene non sia consentito scalare il Kilimangiaro completamente da soli (una guida autorizzata è obbligatoria), puoi assolutamente prenotare un trek privato in solitaria o unirti a un gruppo come viaggiatore solitario. Che tu preferisca una totale indipendenza o un'esperienza sociale con altri escursionisti, esiste un'opzione perfetta per te.",
    },
    {
      heading: 'Perché Molti Viaggiatori Scelgono di Scalare il Kilimangiaro in Solitaria',
      body: "Scalare in solitaria non significa solo viaggiare da soli — si tratta di scoprire di cosa sei capace, al tuo ritmo. Ecco perché molti avventurieri partono da soli: una sfida personale per superare i propri limiti e crescere, una libertà e flessibilità totali, tempo per la riflessione personale e la chiarezza mentale, e un viaggio significativo — per un compleanno, una pausa dalla carriera o una transizione di vita.",
    },
    {
      heading: 'Scalata in Gruppo o Trek Privato — Cosa Scegliere per i Viaggiatori Solitari?',
      body: "🟩 Unirsi a un trek di gruppo: costo più basso (logistica condivisa), atmosfera conviviale (incontrare altri escursionisti), date di partenza fisse, ideale per principianti o chi cerca cameratismo.\n🟦 Scalata privata in solitaria: orari e ritmo flessibili, accompagnamento e attenzione personalizzati, ideale per escursionisti esperti o viaggiatori indipendenti, costo più elevato ma completamente personalizzato.\nAsili Climbing Kilimanjaro offre entrambe le opzioni, senza pressione e senza supplementi per viaggiatori singoli.",
    },
    {
      heading: '🏕️ Come si Presenta una Scalata in Solitaria',
      body: "Anche durante un trek in solitaria, non sei mai veramente solo. Sarai supportato da un team completo che include una guida di montagna certificata, un cuoco e portatori. Camminerai al tuo ritmo, mangerai pasti caldi preparati apposta per te, e dormirai in una tenda confortevole ogni notte. Le scalate private offrono flessibilità e intimità complete. Le scalate in gruppo ti offrono supporto e incoraggiamento condiviso. La tua guida diventa il tuo compagno di fiducia sul sentiero.",
      image: {src: '/images/articles/is-safe-hero.jpg', alt: "Escursionisti che scalano il Kilimangiaro all'alba"},
    },
    {
      heading: '🛡️ È Sicuro Scalare il Kilimangiaro da Solo?',
      body: "Sì — quando scali con un operatore affidabile come Asili Climbing Kilimanjaro, sei in buone mani. Diamo priorità alla tua sicurezza con guide di montagna certificate ed esperte, controlli sanitari quotidiani e monitoraggio dell'altitudine, piani di ossigeno d'emergenza ed evacuazione, e portatori ben formati con supporto 24 ore su 24, 7 giorni su 7. Molte viaggiatrici solitarie scelgono anche Asili per i nostri team affidabili, rispettosi e professionali.",
    },
    {
      heading: '💰 È Più Costoso Scalare il Kilimangiaro in Solitaria?',
      body: "Partire da soli in una scalata privata costa di più rispetto a unirsi a un gruppo, poiché copri l'intero costo logistico, le tasse di parco e il personale di supporto. Tuttavia, il valore risiede in un'esperienza su misura.",
      table: {columns: ['Opzione', 'Fascia di Costo Tipica'], rows: [['Scalata in gruppo (6-8 giorni)', '1.850 $ - 2.300 $'], ['Scalata privata in solitaria (6-8 giorni)', '2.500 $ - 3.400 $']]},
    },
    {
      heading: "🎒 Consigli sull'Attrezzatura in Solitaria per il Kilimangiaro",
      body: "Porta una batteria esterna o un caricabatterie solare supplementare. Gli oggetti di conforto personale (diario, libro, snack) possono sollevare il morale. Fai i bagagli leggeri ma intelligenti — consulta la nostra lista di equipaggiamento per il Kilimangiaro. Rodaggio degli scarponi in anticipo!",
    },
    {
      heading: '📅 Periodo Migliore per Scalare il Kilimangiaro come Viaggiatore Solitario',
      body: "Per gli escursionisti solitari, il tempismo conta: le migliori stagioni sono gennaio-marzo e giugno-ottobre. Evita aprile-maggio (forti piogge) e novembre (piccole piogge). Scalare in alta stagione ti dà la possibilità di incontrare altre persone lungo il percorso — anche durante una scalata privata.",
    },
    {
      heading: '💡 Parere di un Esperto',
      body: "Scalare il Kilimangiaro in solitaria è una delle decisioni più gratificanti che tu possa prendere. Con il supporto di un team locale esperto, godi della libertà di viaggiare da solo con la certezza di essere ben accompagnato. Da Asili Climbing Kilimanjaro, comprendiamo di cosa hanno bisogno gli avventurieri solitari: rispetto, flessibilità e un team dedicato che rende il tuo viaggio indimenticabile — e sicuro.",
    },
    {
      heading: '🌍 Pronto a Iniziare la Tua Avventura in Solitaria?',
      body: "Che tu desideri la solitudine di un trek privato o l'energia di un piccolo gruppo, ti aiuteremo a pianificare il tuo itinerario, il tuo calendario e il tuo ritmo perfetti. Realizziamo il tuo sogno del Kilimangiaro — solo per te. Contatta Asili Climbing Kilimanjaro per iniziare a pianificare la tua vetta in solitaria.",
    },
  ],
}

async function run() {
  await seedDetailArticleIt(isClimbingKilimanjaroSafeIt)
  await seedDetailArticleIt(gettingToKilimanjaroIt)
  await seedDetailArticleIt(mountKilimanjaroFactsIt)
  await seedDetailArticleIt(typicalDayOnKilimanjaroIt)
  await seedDetailArticleIt(kilimanjaroFullmoonClimbIt)
  await seedDetailArticleIt(kilimanjaroAltitudeSicknessIt)
  await seedDetailArticleIt(kilimanjaroFoodIt)
  await seedDetailArticleIt(kilimanjaroPortersIt)
  await seedDetailArticleIt(kilimanjaroPackingListIt)
  await seedDetailArticleIt(kilimanjaroClimbCostIt)
  await seedDetailArticleIt(bestTimeToClimbKilimanjaroIt)
  await seedDetailArticleIt(kilimanjaroSafarisIt)
  await seedDetailArticleIt(soloKilimanjaroClimbIt)
  console.log('done — all 13 detail articles seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
