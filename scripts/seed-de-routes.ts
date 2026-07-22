/**
 * Phase 6 (German): the 6 `route` documents (Machame, Marangu, Lemosho,
 * Rongai, Umbwe, Northern Circuit) plus the routesHubPage singleton.
 * Mirrors seed-it-routes.ts's field construction but with German text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-routes.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

const arrivalStopDe = {
  label: 'Ankunft und Briefing',
  meta: ['🏨 Klassisch: Ameg Lodge | Premium: Kaliwa Lodge'],
  body: [
    'Nach Ihrer Ankunft am Kilimanjaro International Airport werden Sie zu Ihrer Unterkunft gebracht, wo Ihr Guide ein umfassendes Briefing sowie eine Ausrüstungskontrolle durchführt, um Sie auf das bevorstehende Abenteuer vorzubereiten.',
  ],
}
const departureStopDe = {
  label: 'Abreise oder Weiterreise',
  body: ['🚗 Transfer zum Kilimanjaro International Airport für Ihren Rückflug — oder setzen Sie Ihr tansanisches Abenteuer fort!'],
}

interface RouteInfoBlockDe {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  pricingTable?: {columns: string[]; rows: {label: string; values: string[]}[]}
}
interface RouteDe {
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
  tabs: {id: string; label: string; blocks: RouteInfoBlockDe[]}[]
  secondaryHeading: string
  secondaryTagline: string
  faqHeading: string
  faqs: {number: number; question: string; answer: string}[]
}

const machame: RouteDe = {
  slug: 'machame-route',
  name: 'Machame-Route',
  seoTitle: 'Machame-Route | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Entdecken Sie die Machame-Route, die beliebteste Aufstiegsroute am Kilimandscharo, bekannt als Whiskey Route. Echter Reiseverlauf Tag für Tag, Preise und Expertentipps.',
  heroHeading: 'Entdecken Sie die Machame-Route am Kilimandscharo',
  heroTagline: 'Die beliebteste Route zum Gipfel des Kilimandscharo',
  heroBody: [
    'Als Whiskey Route bekannt, ist die Machame-Route die beliebteste Aufstiegsroute am Kilimandscharo und wird jedes Jahr von fast der Hälfte aller Trekker gewählt.',
    'Diese landschaftlich reizvolle Route nähert sich dem Kilimandscharo von Süden, führt über die atemberaubenden Südhänge hinauf und steigt anschließend über die Mweka-Route wieder ab. Unterwegs werden Kletternde mit einigen der spektakulärsten Sonnenuntergängen und Sonnenaufgängen des Kilimandscharo belohnt.',
    'Mit einer Gesamtlänge von 62 km wird die Route üblicherweise in sechs Tagen bewältigt, wobei eine siebentägige Variante für eine bessere Akklimatisierung dringend empfohlen wird — was die Erfolgsquote beim Gipfelversuch deutlich erhöht.',
    'Für alle, die ein unvergessliches Abenteuer mit anspruchsvollem, aber lohnendem Gelände suchen, ist die Machame-Route eine hervorragende Wahl.',
  ],
  heroImage: {src: '/images/routes/machame/hero.webp', alt: 'Wanderer auf dem Weg zum Kilimandscharo auf der Machame-Route'},
  itineraryHeading: 'Reiseverlauf der Machame-Route',
  itinerarySubheading: 'Ohne den Whisky – Ein Reisetagebuch, Tag für Tag',
  daysLabel: '7 Tage',
  stops: [
    arrivalStopDe,
    {
      label: 'Trekkingtag 1 – Von Machame Gate zu Machame Camp',
      meta: ['📍 Machame Gate (1.800 m) → Machame Camp (3.000 m)', '📈 Höhengewinn: 1.200 m', '⏳ Dauer: 6-7 Stunden'],
      body: [
        'Ihre Reise beginnt mit einer 45-minütigen Fahrt von Moshi zum Machame Gate. Nach der Registrierung führt der Trek über einen sich windenden Pfad durch üppigen Regenwald, die feuchteste Zone des Berges. Rechnen Sie mit gelegentlichen Nachmittagsschauern, die den Pfad zeitweise rutschig machen.',
        'Der Anstieg wird zunehmend sanfter, je näher man Machame Camp kommt, das in der Übergangszone zwischen Wald und Riesenheide-Zonen liegt.',
      ],
    },
    {
      label: 'Trekkingtag 2 – Von Machame Camp zu Shira Camp',
      meta: ['📍 Machame Camp (3.000 m) → Shira Camp (3.840 m)', '📈 Höhengewinn: 840 m', '⏳ Dauer: 5-6 Stunden'],
      body: [
        'Der Tag beginnt mit einem steilen Aufstieg über einen Bergrücken, der zum Picnic Rock führt, einem fantastischen Aussichtspunkt mit Blick auf Kibo und den zerklüfteten Rand des Shira-Plateaus.',
        'Der Pfad wird anschließend flacher, während er das Shira-Plateau durchquert, den dritten der vulkanischen Kegel des Kilimandscharo, bevor Shira Camp erreicht wird, wo Sie herrliche Bergpanoramen genießen können.',
      ],
    },
    {
      label: 'Trekkingtag 3 – Von Shira Camp zu Barranco Camp via Lava Tower',
      meta: [
        '📍 Shira Camp (3.840 m) → Lava Tower (4.550 m) → Barranco Camp (3.850 m)',
        '📈 Höhengewinn: 710 m',
        '📉 Höhenverlust: 700 m',
        '⏳ Dauer: 6-7 Stunden',
      ],
      body: [
        'Ein anspruchsvoller, aber entscheidender Akklimatisierungstag: Sie durchqueren hochgelegenes Wüstengelände in Richtung Lava Tower, einem 90 Meter hohen vulkanischen Gesteinspfropfen mit unglaublichen Panoramablicken.',
        'Nach dem Mittagessen steigen Sie ins Barranco-Tal ab, Heimat der einzigartigen Riesen-Senecien. Dieser Abstieg bereitet Ihren Körper auf den bevorstehenden Höhenanstieg vor. Barranco Camp liegt in einem malerischen, geschützten Tal am Fuß der berühmten Barranco Wall.',
      ],
    },
    {
      label: 'Trekkingtag 4 – Von Barranco Camp zu Karanga Camp über die Barranco Wall',
      meta: [
        '📍 Barranco Camp (3.850 m) → Barranco Wall (4.200 m) → Karanga Camp (3.950 m)',
        '📈 Höhengewinn: 350 m',
        '📉 Höhenverlust: 250 m',
        '⏳ Dauer: 3-4 Stunden',
      ],
      body: [
        'Der Tag beginnt mit der eindrucksvollen Barranco Wall, einem spannenden Anstieg, der mit atemberaubenden Ausblicken belohnt.',
        'Nach Erreichen des Gipfels auf 4.200 m folgen Sie einem malerischen, wellenförmigen Pfad um die Flanke des Berges, mit dem Mount Meru rechts von Ihnen und dem aufragenden Kibo zu Ihrer Linken.',
        'Ein Abstieg ins Karanga-Tal folgt ein kurzer, aber steiler Anstieg zu Karanga Camp, Ihrer Unterkunft für die Nacht.',
      ],
    },
    {
      label: 'Trekkingtag 5 – Von Karanga Camp zu Barafu Camp',
      meta: ['📍 Karanga Camp (3.950 m) → Barafu Camp (4.600 m)', '📈 Höhengewinn: 650 m', '⏳ Dauer: 3-4 Stunden'],
      body: [
        'Ein gleichmäßiger Vormittagsanstieg führt zu Barafu Camp, was auf Suaheli „Eis" bedeutet. Dieses hochgelegene Camp liegt auf einem Grat unterhalb des Gipfelkegels und markiert den Abschluss des südlichen Rundwegs am Kilimandscharo, mit spektakulären Gipfelblicken aus mehreren Perspektiven.',
        'Sie kommen rechtzeitig für eine Nachmittagsruhe und ein frühes Abendessen an, um sich auf die Gipfelnacht vorzubereiten.',
      ],
    },
    {
      label: 'Trekkingtag 6 – Von Barafu Camp zu Uhuru Peak, dann Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.600 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
        '📈 Höhengewinn: 1.295 m',
        '📉 Höhenverlust: 2.785 m',
        '⏳ Gipfelaufstieg: 6-8 Stunden',
        '⏳ Abstieg: 6 Stunden',
      ],
      body: [
        'Um Mitternacht beginnt Ihr letzter Aufstieg zum Gipfel. Der Pfad ist steil und anspruchsvoll, bei Temperaturen deutlich unter dem Gefrierpunkt. Mit der Morgendämmerung wird der prächtige rote Sonnenaufgang hinter dem Mawenzi-Gipfel Sie motiviert halten.',
        'Nach Erreichen von Stella Point (5.750 m) wandern Sie am Kraterrand entlang, bevor Sie Uhuru Peak (5.895 m) erreichen, den höchsten Punkt Afrikas!',
        'Nach der Feier am Gipfel beginnt der lange Abstieg zu Mweka Camp, über vielfältiges Gelände mit einer Mittagspause unterwegs. An diesem Abend genießen Sie Ihr letztes Abendessen auf dem Berg.',
      ],
    },
    {
      label: 'Trekkingtag 7 – Von Mweka Camp zu Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m) → Mweka Gate (1.830 m)', '📉 Höhenverlust: 1.280 m', '⏳ Dauer: 2-3 Stunden'],
      body: [
        'Der letzte Abstieg führt Sie durch üppigen Regenwald, mit der Chance, verspielte Affen entlang des Weges zu entdecken.',
        'Am Mweka Gate erhalten Sie Ihre Gipfelzertifikate, und vom Dorf Mweka aus werden Sie zu Ihrem Hotel in Moshi gebracht.',
      ],
    },
    departureStopDe,
  ],
  infoTabsHeading: 'Warum Machame wählen?',
  tabs: [
    {
      id: 'duration',
      label: 'Reisedauer',
      blocks: [
        {
          heading: 'Was sind die Vorteile der Machame-Route?',
          paragraphs: [
            'Die Machame-Route am Kilimandscharo zeichnet sich durch atemberaubende Landschaften und hohe Erfolgsquoten aus. Wenn Sie eine landschaftlich reizvolle und lohnende Herausforderung suchen, bietet diese Route:',
            'Unsere Kilimandscharo-Besteigungspakete für die Machame-Route sind darauf ausgelegt, die Akklimatisierung und die Gesamtsicherheit zu maximieren.',
          ],
          bullets: [
            'Vielfältiges Gelände – Von üppigem Regenwald bis zu alpiner Wüste und Gletschern.',
            'Malerische Wahrzeichen – Die Route bietet grandiose Höhepunkte wie das Shira-Plateau und die ikonische Barranco Wall.',
            'Ausgezeichnete Akklimatisierung – Die Strategie „hoch steigen, tief schlafen" minimiert das Risiko von Höhenkrankheit.',
            'Hohe Gipfelerfolgsquote – Mit einem gut getakteten Reiseverlauf passen sich Kletternde besser an und erhöhen ihre Chancen, Uhuru Peak zu erreichen.',
          ],
        },
        {
          heading: 'Wie lange dauert die Machame-Route?',
          paragraphs: [
            'Obwohl die Strecke der Machame-Route in 6 Tagen bewältigt werden kann, empfehlen wir dringend den 7-Tage-Reiseverlauf für eine komfortablere und erfolgreichere Besteigung. 🕒 Warum 7 Tage wählen?',
            '📌 Spezialtipp: Für eine detaillierte Anleitung zur idealen Dauer des Kilimandscharo-Reiseverlaufs lesen Sie unseren ausführlichen Blogartikel.',
          ],
          bullets: [
            'Zusätzliche Zeit = bessere Akklimatisierung und geringeres Risiko von Höhenkrankheit.',
            'Ermöglicht es Ihnen, die Landschaften in einem angenehmen Tempo zu genießen.',
            'Erhöht Ihre Chancen auf einen erfolgreichen Gipfelaufstieg.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Preisübersicht',
      blocks: [
        {
          heading: 'Was kostet die Machame-Route?',
          paragraphs: [
            'Der Preis der 7-tägigen Machame-Route variiert je nach Faktoren wie Gruppengröße, Serviceniveau und Zusatzoptionen. Hier eine Übersicht:',
            '💰 Gruppenbesteigung: ab 2.285 $ pro Person   💰 Private Besteigung: ab 2.585 $ pro Person',
            '🔍 Faktoren, die den Preis beeinflussen:',
            '📅 Expertentipp: Der beste Zeitpunkt für die Besteigung beeinflusst die Kosten. Die Hochsaisonen (Juli–Sept. und Jan.–Febr.) bieten hervorragendes Wetter, sind aber teurer.',
          ],
          bullets: [
            'Dauer Ihrer geführten Kilimandscharo-Besteigung',
            'Gruppengröße – Größere Gruppen können die Kosten pro Person senken',
            'Klassische oder Premium-Leistungen – Mehr Komfort = leicht höhere Kosten',
            'Ein- und Ausschlüsse – Für mehr Klarheit sehen Sie sich die Details unseres Pakets an',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Wo Sie übernachten',
      blocks: [
        {
          heading: 'Welche Camps liegen entlang der Machame-Route?',
          paragraphs: [
            'Ihre Kilimandscharo-Besteigung umfasst Übernachtungen in diesen strategischen Camps:',
            '⛺ Jedes Camp bietet grundlegende Einrichtungen wie Zeltunterkünfte, Essbereiche und sanitäre Anlagen für einen komfortablen Aufenthalt.',
          ],
          bullets: ['Machame Camp', 'Shira Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Beliebtheit und Andrang',
      blocks: [
        {
          heading: 'Ist die Machame-Route überlaufen?',
          paragraphs: [
            'Als eine der beliebtesten Routen am Kilimandscharo zieht die Machame-Route jedes Jahr viele Kletternde an. Hauptgründe für ihre Beliebtheit:',
            '🌍 Atemberaubende Aussichten – Spektakuläre Landschaften und vielfältige Ökosysteme.   ⏳ Kürzere Dauer – Kann in nur 6 Tagen bewältigt werden.   📈 Hohe Erfolgsquoten – Ausgezeichnetes Akklimatisierungsprofil.',
            '🤔 Sorgen wegen des Andrangs? Obwohl die Hochsaisonen mehr Kletternde anziehen, bietet die Wahl der Nebensaison-Monate (März, November) ein ruhigeres Erlebnis.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Experteneinblicke',
      blocks: [
        {
          heading: 'Was sind unsere Eindrücke von der Machame-Route?',
          paragraphs: [
            'Bei African Scenic Safaris empfehlen wir die Machame-Route wegen ihrer vielfältigen Landschaften und hohen Erfolgsquoten. Wenn Sie jedoch eine weniger überlaufene Alternative suchen, ziehen Sie die Lemosho-Route in Betracht.',
            '📍 Wichtiger Unterschied: Lemosho beginnt ruhiger, trifft aber an Tag 3 auf Machame.',
            '⚠️ Zu beachten: Rechnen Sie mit mehr Kletternden auf Machame, besonders in der Hochsaison.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Machame-Route',
  secondaryTagline: 'Erleben Sie die landschaftlich reizvolle Reise zum Gipfel des Kilimandscharo. Durchqueren Sie Machame und erfassen Sie die Erhabenheit des Gipfels.',
  faqHeading: '10 Fragen zur Machame-Route',
  faqs: [
    {number: 1, question: 'Wie lange dauert die Machame-Route?', answer: 'Die Machame-Route dauert in der Regel 6 bis 7 Tage. Diese Dauer ermöglicht eine angemessene Akklimatisierung und erhöht die Erfolgschancen beim Gipfelversuch am Kilimandscharo deutlich.'},
    {number: 2, question: 'Wie schwierig ist die Machame-Route?', answer: 'Die Machame-Route gilt als mäßig anspruchsvoll. Sie beinhaltet steile Anstiege, unwegsames Gelände und lange Wandertage, was sowohl körperliche Ausdauer als auch mentale Widerstandsfähigkeit erfordert.'},
    {number: 3, question: 'Wie hoch ist die Erfolgsquote beim Gipfelversuch über die Machame-Route?', answer: 'Bei African Scenic Safaris ist für uns eine erfolgreiche Besteigung, sicher den Gipfel zu erreichen und zurückzukehren. In diesem Sinne liegt unsere Erfolgsquote bei 100 %. Insgesamt zeigt die Machame-Route eine hohe Gipfelerfolgsquote dank ihres schrittweisen Akklimatisierungsprofils.'},
    {number: 4, question: 'Ist die Machame-Route landschaftlich reizvoll?', answer: 'Ja! Die Machame-Route ist wegen ihrer atemberaubenden Landschaften als „Whiskey Route" bekannt. Kletternde durchqueren üppigen Regenwald, Heideland und alpine Wüste mit herrlichen Ausblicken auf den Kilimandscharo bei jeder Etappe.'},
    {number: 5, question: 'Wie lang ist die durchschnittliche tägliche Trekkingstrecke auf der Machame-Route?', answer: 'Im Durchschnitt legen Kletternde 10 bis 12 Kilometer pro Tag zurück, was 6 bis 8 Stunden Gehzeit entspricht, abhängig vom Reiseverlauf und Tempo.'},
    {number: 6, question: 'Ist die Machame-Route im Vergleich zu anderen Routen überlaufen?', answer: 'Die Machame-Route ist eine der beliebtesten Routen am Kilimandscharo, was bedeutet, dass sie während der Hochsaisonen (Juni–Oktober und Dezember–März) überlaufen sein kann.'},
    {number: 7, question: 'Muss ich für die Machame-Route trainieren?', answer: 'Obwohl vorherige Trekkingerfahrung nicht zwingend erforderlich ist, empfehlen wir dringend Cardio-Übungen, Ausdauertraining und Bergwanderungen, um Ihre Kondition für die Kilimandscharo-Besteigung aufzubauen.'},
    {number: 8, question: 'Wann ist die beste Zeit, um den Kilimandscharo über die Machame-Route zu besteigen?', answer: 'Die beste Zeit für die Besteigung des Kilimandscharo über die Machame-Route ist von Juni bis März, wenn das Wetter stabil ist, mit klarem Himmel und geringerem Niederschlagsrisiko – ideal für ein sicheres und angenehmes Trekking.'},
    {number: 9, question: 'Wie viele Camps gibt es auf der Machame-Route?', answer: 'Die Machame-Route umfasst sechs Übernachtungscamps, die jeweils einen Rast- und Akklimatisierungsplatz bieten: Machame Camp, Shira Camp, Barranco Camp, Karanga Camp, Barafu Camp, Mweka Camp.'},
    {number: 10, question: 'Was sind die wichtigsten Attraktionen der Machame-Route?', answer: 'Zu den Höhepunkten der Machame-Route zählen die Durchquerung des üppigen Regenwaldes am Fuß des Kilimandscharo, die Besteigung der ikonischen Barranco Wall – ein spannender Aufstieg mit herrlichen Ausblicken – und die Ankunft an Uhuru Peak, dem höchsten Punkt Afrikas auf 5.895 m.'},
  ],
}

const marangu: RouteDe = {
  slug: 'marangu-route',
  name: 'Marangu-Route',
  seoTitle: 'Marangu-Route | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Besteigen Sie den Kilimandscharo über die Marangu-Route, die einzige Route mit Hüttenunterkünften. Echter Reiseverlauf Tag für Tag, Preise und Expertentipps.',
  heroHeading: 'Besteigen Sie den Kilimandscharo über die Marangu-Route',
  heroTagline: 'Das klassische Kilimandscharo-Trekking',
  heroBody: [
    'Bekannt als die „Coca-Cola Route", ist die Marangu-Route die etablierteste und komfortabelste Route zum Gipfel des Kilimandscharo. Es ist die einzige Route mit Hüttenunterkünften, was sie zu einer beliebten Wahl für alle macht, die ein weniger strapaziöses Trekking-Erlebnis suchen.',
    'Der Pfad bietet sanfte Steigungen durch üppigen Regenwald, Heideland und alpine Wüste, bevor der vereiste Gipfel von Uhuru Peak erreicht wird. Er ist ideal für Einsteiger oder alle, die eine direktere Besteigung suchen.',
  ],
  heroImage: {src: '/images/routes/marangu/hero.jpg', alt: 'A-förmige Berghütte auf der Marangu-Route mit Wald im Hintergrund'},
  itineraryHeading: 'Reiseverlauf der Marangu-Route',
  itinerarySubheading: 'Der komfortable Weg zum Dach Afrikas',
  daysLabel: '5 Tage',
  stops: [
    arrivalStopDe,
    {
      label: 'Trekkingtag 1: Marangu Gate → Mandara Hut',
      meta: ['📍 Marangu Gate (1.870 m) → Mandara Hut (2.700 m)', '📈 Höhengewinn: 830 m', '⏳ Dauer: 4-5 Stunden'],
      body: [
        'Ihr Trekking beginnt mit einer Fahrt von Moshi zum Marangu Gate. Nach der Registrierung betreten Sie den üppigen Regenwald und beginnen Ihren Weg entlang eines gut gepflegten Pfades. Der Weg ist oft feucht und schattig, mit moosbewachsenen Bäumen, Vogelgesang und verspielten Affen entlang der Strecke.',
        'Sie erreichen Mandara Hut am späten Nachmittag. Wenn Wetter und Energie es zulassen, unternehmen Sie einen kurzen Spaziergang zum Maundi-Krater für herrliche Ausblicke auf Kenia und Nordtansania.',
      ],
    },
    {
      label: 'Trekkingtag 2: Mandara Hut → Horombo Hut',
      meta: ['📍 Mandara Hut (2.700 m) → Horombo Hut (3.720 m)', '📈 Höhengewinn: 1.020 m', '⏳ Dauer: 6-7 Stunden'],
      body: [
        'Sie verlassen den Regenwald und betreten die Heidezone, wo sich die Landschaft dramatisch verändert. Der Pfad steigt stetig durch offenes Gelände voller Riesen-Senecien und Lobelien an.',
        'Unterwegs erhalten Sie Ihren ersten vollständigen Blick auf die Gipfel Kibo und Mawenzi. Horombo Hut erwartet Sie mit atemberaubenden Panoramen und der Gelegenheit, andere Trekker zu treffen.',
      ],
    },
    {
      label: 'Trekkingtag 3: Horombo Hut → Kibo Hut',
      meta: ['📍 Horombo Hut (3.720 m) → Kibo Hut (4.703 m)', '📈 Höhengewinn: 983 m', '⏳ Dauer: 6-7 Stunden'],
      body: [
        'Der heutige Reiseverlauf ist lang und trocken und führt durch die alpine Wüste. Sie wandern über den Sattel zwischen den Gipfeln Mawenzi und Kibo, eine weite und karge Landschaft mit spektakulären Ausblicken. Die Luft wird dünner, also gehen Sie langsam und bleiben Sie hydriert.',
        'Sie erreichen Kibo Hut am frühen Nachmittag – ruhen Sie sich früh aus und bereiten Sie sich auf den Gipfelversuch vor, der um Mitternacht beginnt.',
      ],
    },
    {
      label: 'Trekkingtag 4: Kibo Hut → Uhuru Peak → Horombo Hut',
      meta: [
        '📍 Kibo Hut (4.703 m) → Uhuru Peak (5.895 m) → Horombo Hut (3.720 m)',
        '📈 Höhengewinn: 1.192 m (Aufstieg), dann Abstieg',
        '⏳ Dauer: 11-14 Stunden',
      ],
      body: [
        'Ihre Reise zum Gipfel beginnt früh am Morgen, wobei Sie im Dunkeln über Serpentinen und Geröll bis zu Gilman\'s Point (5.685 m) wandern, dann entlang des Kraterrands bis Uhuru Peak – dem Dach Afrikas.',
        'Nachdem Sie Ihren Moment am Gipfel festgehalten haben, steigen Sie zu Kibo Hut für eine kurze Rast ab, dann geht es weiter zu Horombo Hut für eine wohlverdiente Nachtruhe.',
      ],
    },
    {
      label: 'Trekkingtag 5: Horombo Hut → Marangu Gate',
      meta: ['📍 Horombo Hut (3.720 m) → Marangu Gate (1.870 m)', '📉 Höhenverlust: 1.850 m', '⏳ Dauer: 6-7 Stunden'],
      body: [
        'An Ihrem letzten Tag steigen Sie durch Heideland und üppigen Regenwald zurück zum Ausgangspunkt ab. Der Pfad ist bergab leichter, aber achten Sie in feuchten Abschnitten auf Ihre Schritte.',
        'Am Eingang erhalten Sie Ihr Gipfelzertifikat, bevor es zurück nach Moshi geht – müde, aber stolz.',
      ],
    },
    departureStopDe,
  ],
  infoTabsHeading: 'Warum Marangu wählen?',
  tabs: [
    {
      id: 'duration',
      label: 'Reisedauer',
      blocks: [
        {
          heading: 'Was sind die Vorteile der Marangu-Route?',
          bullets: [
            'Einzige Route mit Hüttenunterkünften – Im Gegensatz zu anderen Routen, die Camping erfordern, bietet die Marangu-Route eine gemeinsame Unterkunft in Hütten mit Etagenbetten im Schlafsaal-Stil. Dies ist ein großer Vorteil für Kletternde, die lieber drinnen als im Zelt schlafen – besonders während der Regenzeit.',
            'Kostengünstigere Option – Da für Auf- und Abstieg derselbe Pfad genutzt wird, ist die Logistik einfacher, was Marangu zu einer der preiswertesten Kilimandscharo-Routen macht.',
            'Sanfter, schrittweiser Pfad – Der Pfad ist gut gepflegt, mit gleichmäßiger, moderater Steigung, was ihn ideal für Einsteiger oder alle macht, die eine körperlich weniger anspruchsvolle Besteigung als bei steileren Routen wie Umbwe oder Machame suchen.',
            'Kürzere Dauervarianten (5 oder 6 Tage) – Sie können zwischen einem 5- oder 6-tägigen Reiseverlauf wählen. Die 6-tägige Version umfasst einen Akklimatisierungstag, der Ihre Chancen erhöht, den Gipfel zu erreichen.',
            'Ideal für Besteigungen in der Regenzeit – Da Hütten geboten werden und weniger schlammiges Gelände als bei anderen Routen durchquert wird, ist Marangu während der Regenzeiten in Tansania (März–Mai und November) die bessere Wahl.',
            'Direkter Rückweg – Derselbe Pfad wird für den Abstieg genutzt, was logistisch einfacher zu handhaben sein kann, besonders wenn Sie wenig Zeit haben oder einen unkomplizierten Reiseverlauf bevorzugen.',
            'Landschaftliche Vielfalt in kurzer Zeit – Obwohl es eine der kürzeren Routen ist, werden Sie dennoch mehrere Vegetationszonen entdecken – beginnend im üppigen Regenwald, durch Heideland, bis zur alpinen Wüste vor dem vereisten Gipfel.',
            'Zugang zum Maundi-Krater – Am ersten Tag führt ein kurzer optionaler Spaziergang zum Maundi-Krater – einem ruhigen Aussichtspunkt mit schönen Blicken auf Nordtansania und Kenia.',
          ],
        },
        {
          heading: 'Preisbeispiel (pro Person in USD)',
          paragraphs: [
            'Die Besteigung des Kilimandscharo über die Marangu-Route dauert in der Regel 5 oder 6 Tage, je nach gewähltem Reiseverlauf. Jeder Tag umfasst 4 bis 7 Stunden Trekking, außer der Gipfelnacht, der anspruchsvollsten – die bis zu 12–14 Stunden dauert, Abstieg inbegriffen. Die Preise variieren leicht je nach Saison und Gruppengröße.',
          ],
          bullets: [
            '5-Tage-Option: eine schnellere Besteigung mit begrenzter Akklimatisierung, ideal für erfahrene Trekker, aber mit niedrigerer Gipfelerfolgsquote.',
            '6-Tage-Option: umfasst einen zusätzlichen Akklimatisierungstag bei Horombo Hut. Dies verbessert die Anpassung Ihres Körpers an die Höhe und erhöht die Gipfelerfolgschancen deutlich.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Preisübersicht',
      blocks: [
        {
          heading: 'Was kostet die Marangu-Route?',
          pricingTable: {
            columns: ['Dauer', '1 Person', '2-3 Personen', '4-6 Personen', '7+ Personen'],
            rows: [
              {label: '5 Tage', values: ['1.850 $', '1.750 $', '1.600 $', '1.450 $']},
              {label: '6 Tage', values: ['2.050 $', '1.950 $', '1.750 $', '1.600 $']},
            ],
          },
        },
      ],
    },
    {
      id: 'stay',
      label: 'Wo Sie übernachten',
      blocks: [
        {
          heading: 'Komfortable Berghütten entlang der Strecke – kein Camping nötig!',
          paragraphs: [
            'Im Gegensatz zu anderen Kilimandscharo-Routen, die Zelte erfordern, ist die Marangu-Route die einzige Route mit dauerhaften Berghütten, die ein komfortableres und wettergeschütztes Erlebnis bieten. Es ist eine hervorragende Option, wenn Sie ein echtes Bett, ein Dach über dem Kopf und eine gemeinsame, aber solide Unterkunft bevorzugen.',
            '🛏️ Übersicht der Unterkünfte:',
          ],
          bullets: [
            'Mandara Hut (2.700 m): gelegen in der Regenwaldzone, bietet Mandara gemütliche A-förmige Hütten, umgeben von üppigem Grün. Jede Hütte beherbergt 4 bis 8 Kletternde und verfügt über gemeinsame sanitäre Anlagen in der Nähe.',
            'Horombo Hut (3.720 m): gelegen in der Heidezone, ist Horombo größer und beherbergt sowohl auf- als auch absteigende Trekker. Sie bietet herrliche Ausblicke auf den Mawenzi-Gipfel und die darunterliegenden Ebenen.',
            'Kibo Hut (4.703 m): ein einfaches Steingebäude in der alpinen Wüstenzone, ist Kibo die letzte Basis vor dem Gipfel. Erwarten Sie Schlafsaal-Zimmer mit Etagenbetten und eine schlichte Atmosphäre in großer Höhe.',
            '🚿 Zu den Annehmlichkeiten gehören: Matratzen und Kissen, Essräume für warme Mahlzeiten, Solarbeleuchtung in einigen Hütten, saubere, aber grundlegende gemeinsame sanitäre Anlagen, keine Duschen (bringen Sie Feuchttücher oder Wasser für eine schnelle Wäsche mit).',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Beliebtheit und Andrang',
      blocks: [
        {
          heading: 'Sehr beliebt, stark frequentiert, und oft die erste Wahl für Einsteiger.',
          paragraphs: [
            'Die Marangu-Route ist eine der beliebtesten Routen am Kilimandscharo – oft „Coca-Cola Route" genannt wegen ihres einfacheren Zugangs und ihrer Hüttenunterkünfte. Sie zieht eine große Zahl von Kletternden an, besonders während der Hochsaisonen (Januar–März und Juni–Oktober).',
            '📌 Warum ist sie beliebt? Sie ist die einzige Route mit Berghütten, was sie für alle attraktiv macht, die nicht campen möchten. Ihre kürzere Dauer (5-6 Tage) spricht Reisende mit engem Zeitplan an. Sie gilt als körperlich weniger anspruchsvoll (obwohl die Höhe weiterhin eine ernsthafte Herausforderung darstellt).',
            '🙋‍♂️ Was den Andrang betrifft: Rechnen Sie mit mehr Trekkern auf dieser Route als auf anderen wie Lemosho oder Rongai. Die Hütten können überfüllt sein, besonders in Horombo und Kibo, die sowohl auf- als auch absteigende Trekker beherbergen.',
            '⚠️ Tipp: Wenn Sie Ruhe und weniger Andrang suchen, erwägen Sie eine Besteigung in den Zwischensaisonen (Ende März oder Anfang November) oder wählen Sie eine längere, weniger frequentierte Route.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Experteneinblicke',
      blocks: [
        {
          heading: 'Überlegungen erfahrener Guides und Kilimandscharo-Spezialisten.',
          paragraphs: [
            'Die Marangu-Route gilt oft als der „einfachste" Weg, den Kilimandscharo zu besteigen, aber Experten sind sich einig, dass sie nicht unterschätzt werden sollte.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Marangu-Route',
  secondaryTagline: 'Der Kilimandscharo in aller Einfachheit – Schlafen Sie in Hütten, nicht im Zelt.',
  faqHeading: '10 Fragen zur Marangu-Route',
  faqs: [
    {number: 1, question: 'Wie lange dauert die Marangu-Route?', answer: 'Die Marangu-Route dauert in der Regel 5 oder 6 Tage. Der 6-tägige Reiseverlauf umfasst einen zusätzlichen Akklimatisierungstag bei Horombo Hut, was Ihre Chancen auf einen erfolgreichen Gipfelaufstieg erhöht.'},
    {number: 2, question: 'Wie schwierig ist die Marangu-Route?', answer: 'Sie gilt als mäßig anspruchsvoll. Der Pfad ist schrittweise und gut markiert, was ihn zu einer guten Wahl für Einsteiger macht – aber die Höhe kann dennoch eine Herausforderung darstellen.'},
    {number: 3, question: 'Wie hoch ist die Erfolgsquote beim Gipfelversuch über die Marangu-Route?', answer: 'Die Erfolgsquoten variieren je nach Anzahl der Tage. Die 5-Tage-Option hat aufgrund der kürzeren Akklimatisierungszeit eine niedrigere Erfolgsquote, während die 6-Tage-Version bessere Chancen bietet, mit einer Erfolgsquote von etwa 80 % bei korrekter Durchführung.'},
    {number: 4, question: 'Ist die Marangu-Route landschaftlich reizvoll?', answer: 'Ja, die Marangu-Route bietet schöne Landschaften. Sie durchqueren Regenwald-, Heide- und alpine Wüstenzonen mit herrlichen Ausblicken nahe dem Gipfel – wenn auch weniger vielfältig als Routen wie Lemosho oder Machame.'},
    {number: 5, question: 'Wie lang ist die durchschnittliche tägliche Trekkingstrecke auf der Marangu-Route?', answer: 'Trekker legen im Durchschnitt 8 bis 12 km pro Tag zurück, je nach Etappe. Der Gipfeltag ist der längste, mit über 18 km Gehstrecke.'},
    {number: 6, question: 'Ist die Marangu-Route im Vergleich zu anderen Routen überlaufen?', answer: 'Die Marangu-Route ist eine der beliebtesten und meistfrequentierten Routen, besonders während der Trockenzeiten. Sie zieht Kletternde an, die Hüttenunterkünfte und einen kürzeren Reiseverlauf bevorzugen.'},
    {number: 7, question: 'Muss ich für die Marangu-Route trainieren?', answer: 'Ja, ein grundlegendes Training und körperliche Vorbereitung werden dringend empfohlen. Konzentrieren Sie sich mehrere Wochen vor Ihrer Reise auf Cardio, Trekking-Übung und Ausdauertraining.'},
    {number: 8, question: 'Wann ist die beste Zeit, um den Kilimandscharo über die Marangu-Route zu besteigen?', answer: 'Die besten Monate liegen in den Trockenzeiten: von Januar bis Mitte März und von Juni bis Oktober, wenn die Pfade trockener und die Ausblicke klarer sind.'},
    {number: 9, question: 'Wie viele Hütten gibt es auf der Marangu-Route?', answer: 'Es gibt drei Haupt-Hüttenstationen: Mandara Hut, Horombo Hut und Kibo Hut, alle mit Etagenbetten, grundlegenden Essbereichen und sanitären Anlagen ausgestattet.'},
    {number: 10, question: 'Was sind die wichtigsten Attraktionen der Marangu-Route?', answer: 'Die Route ist bekannt für ihre komfortablen Hütten, ihre historische Bedeutung und ihre landschaftliche Vielfalt. Sie bietet auch Zugang zum Maundi-Krater und Ausblicke auf den Mawenzi-Gipfel – was sie zu einer klassischen Besteigung mit einem Hauch Komfort macht.'},
  ],
}

const lemosho: RouteDe = {
  slug: 'lemosho-route',
  name: 'Lemosho-Route',
  seoTitle: 'Lemosho-Route | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Besteigen Sie den Kilimandscharo über die Lemosho-Route, eine der landschaftlich reizvollsten und ausgewogensten Routen des Berges. Echter Reiseverlauf Tag für Tag, Preise und Expertentipps.',
  heroHeading: 'Besteigen Sie den Kilimandscharo über die Lemosho-Route',
  heroTagline: 'Eine landschaftlich reizvolle, schrittweise Besteigung zum Gipfel des Kilimandscharo',
  heroBody: [
    'Die Lemosho-Route ist einer der schönsten und ausgewogensten Wege, den Kilimandscharo zu besteigen. Sie beginnt an der abgelegenen Westflanke des Berges und bietet einen ruhigen Start mit weniger Andrang, herrlichen Ausblicken und einem gleichmäßigen Tempo, das Ihrem Körper hilft, sich an die Höhe anzupassen.',
    'Diese Route wird sowohl von erfahrenen Trekkern als auch von Einsteigern für ihre hohe Erfolgsquote, ihre vielfältigen Landschaften und ihr exzellentes Akklimatisierungsprofil geschätzt. Ob Sie sich für die 7- oder 8-Tage-Version entscheiden, Sie genießen eine lohnende Reise durch Regenwald, Heideland, alpine Wüste und schließlich Gletscher an Uhuru Peak.',
  ],
  heroImage: {src: '/images/routes/lemosho/hero.webp', alt: 'Zelte bei Barafu Camp mit dem schneebedeckten Kibo-Gipfel über den Wolken'},
  itineraryHeading: 'Reiseverlauf der Lemosho-Route',
  itinerarySubheading: 'Ein ruhiger Start zum Dach Afrikas',
  daysLabel: '7 Tage',
  stops: [
    arrivalStopDe,
    {
      label: 'Trekkingtag 1: Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2.100 m) → Mti Mkubwa (2.650 m)', '📈 Höhengewinn: 550 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Nach der Registrierung beginnt Ihr Trekking durch üppigen Regenwald mit guten Chancen, Affen und bunte Vögel zu entdecken. Sie erreichen Mti Mkubwa, oder „Big Tree Camp", am späten Nachmittag.'],
    },
    {
      label: 'Trekkingtag 2: Mti Mkubwa – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m)', '📈 Höhengewinn: 960 m', '⏳ Dauer: 5-6 Stunden'],
      body: ['Heute verlässt der Pfad den Wald und betritt die Heidezone. Die Ausblicke öffnen sich spektakulär, während Sie das Shira-Plateau durchqueren – einen uralten Lavastrom.'],
    },
    {
      label: 'Trekkingtag 3: Shira 1 – Shira 2 Camp',
      meta: ['📍 Shira 1 (3.610 m) → Shira 2 Camp (3.850 m)', '📈 Höhengewinn: 240 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Ein entspannter Tag mit leichten Auf- und Abstiegen über das Plateau. Sie erhalten Ihren ersten Blick auf den Kibo-Gipfel und akklimatisieren sich langsam beim Einrichten im Camp.'],
    },
    {
      label: 'Trekkingtag 4: Shira 2 – Lava Tower – Barranco Camp',
      meta: ['📍 Shira 2 (3.850 m) → Lava Tower (4.600 m) → Barranco Camp (3.976 m)', '📈 Höhenprofil: 750 m Aufstieg / 624 m Abstieg', '⏳ Dauer: 6-7 Stunden'],
      body: ['Dies ist ein Akklimatisierungstag. Sie steigen hoch bis zum Lava Tower und dann wieder ab, um in Barranco zu schlafen – dieser Ansatz „hoch steigen, tief schlafen" hilft Ihrem Körper, sich an die Höhe anzupassen.'],
    },
    {
      label: 'Trekkingtag 5: Barranco – Karanga Camp – Barafu Camp',
      meta: ['📍 Barranco Camp (3.976 m) → Karanga Camp (4.035 m) → Barafu Camp (4.673 m)', '📈 Höhengewinn: 697 m', '⏳ Dauer: 8-9 Stunden'],
      body: [
        'Ihr Tag beginnt mit einem Aufstieg entlang der ikonischen Barranco Wall – einer steilen, aber lohnenden Kletterpartie mit epischen Ausblicken. Nach einem kurzen Halt bei Karanga Camp setzen Sie mit einem gleichmäßigen Anstieg durch die alpine Wüste bis Barafu Camp fort.',
        'Dies ist Ihre Basis für den Gipfelversuch. Essen Sie früh zu Abend und ruhen Sie sich vor der Mitternachtsanstrengung zu Uhuru Peak aus.',
      ],
    },
    {
      label: 'Trekkingtag 6: Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.673 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
        '📈 Höhenprofil: 1.222 m Aufstieg, 2.785 m Abstieg',
        '⏳ Dauer: 12-14 Stunden',
      ],
      body: [
        'Der Gipfeltag beginnt gegen Mitternacht unter einem sternenklaren Himmel. Der Pfad ist lang und steil, aber langsam und stetig gewinnt das Rennen. Nach Erreichen von Stella Point (5.739 m) geht es weiter entlang des Kraterrands bis Uhuru Peak, dem höchsten Punkt Afrikas.',
        'Feiern Sie Ihre Leistung, machen Sie Fotos, und beginnen Sie den Abstieg zu Mweka Camp. Rechnen Sie mit müden Beinen und einem tiefen, erholsamen Schlaf.',
      ],
    },
    {
      label: 'Trekkingtag 7: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m) → Mweka Gate (1.640 m)', '📉 Höhenverlust: 1.470 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Ihr letzter Tag ist ein angenehmer Abstieg durch üppigen Regenwald, voller Vogelgesang und vielleicht auch Affen. Am Mweka Gate unterschreiben Sie Ihre Abreise, erhalten Ihre Gipfelzertifikate und treffen Ihren Fahrer für die Rückfahrt nach Moshi.'],
    },
    departureStopDe,
  ],
  infoTabsHeading: 'Warum Lemosho wählen?',
  tabs: [
    {
      id: 'duration',
      label: 'Reisedauer',
      blocks: [
        {
          heading: 'Was sind die Vorteile der Lemosho-Route?',
          paragraphs: [
            'Die Lemosho-Route gilt weithin als die landschaftlich reizvollste und ausgewogenste Route am Kilimandscharo – und das aus gutem Grund. Sie bietet eine perfekte Mischung aus Schönheit, Herausforderung und Akklimatisierung, was sie zu einer der besten Wahlen sowohl für Einsteiger als auch für erfahrene Trekker macht.',
            'Anders als andere Routen beginnt Lemosho an der abgelegenen Westflanke des Berges und bietet einen ruhigen Start durch unberührten Regenwald, bevor sie später auf die stärker frequentierte Machame-Route trifft. Das bedeutet weniger Andrang zu Beginn, mehr Tierbeobachtungen und atemberaubende Panoramablicke von Anfang bis Ende.',
            'Ein weiterer Grund, Lemosho zu wählen? Die Erfolgsquote. Dank ihres längeren Reiseverlaufs (7 oder 8 Tage) gewinnen Sie schrittweiser an Höhe – was Ihrem Körper Zeit gibt, sich anzupassen. Dies verbessert Ihre Chancen erheblich, den Gipfel sicher zu erreichen und sich in der Gipfelnacht stark zu fühlen.',
            'Wenn Sie eine Route suchen, die unglaubliche Landschaften, eine solide Akklimatisierungszeit und ein lohnendes Abenteuer ohne den anfänglichen Andrang bietet, ist Lemosho schwer zu übertreffen.',
          ],
        },
        {
          heading: 'Wie lange dauert die Lemosho-Route?',
          paragraphs: [
            'Die Lemosho-Route wird in der Regel in 7 oder 8 Tagen bewältigt, je nach gewähltem Reiseverlauf. Die 8-Tage-Option umfasst einen zusätzlichen Akklimatisierungstag bei Karanga Camp, was Ihre Chancen erhöht, den Gipfel bequem zu erreichen. Diese verlängerte Dauer macht sie zu einer der besten Routen für die Höhenanpassung und ein entspannteres Trekking-Tempo.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Preisübersicht',
      blocks: [
        {
          heading: 'Was kostet die Lemosho-Route?',
          paragraphs: [
            'Die Preise der Lemosho-Route variieren je nach Gruppengröße und Serviceniveau, aber hier ein allgemeiner Überblick. Diese Kosten umfassen in der Regel Parkgebühren, Guide- und Trägerunterstützung, Mahlzeiten, Zelte und Transport. Private Besteigungen und Luxuspakete sind ebenfalls zu höheren Preisen erhältlich.',
          ],
          bullets: ['7-Tage-Trekking: ab 2.200 $ bis 2.700 $ pro Person', '8-Tage-Trekking: ab 2.400 $ bis 2.900 $ pro Person'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Wo Sie übernachten',
      blocks: [
        {
          heading: 'Welche Camps liegen entlang der Lemosho-Route?',
          paragraphs: [
            'Im Gegensatz zur Marangu-Route ist Lemosho ein reines Camping-Trekking. Sie schlafen in hochwertigen Bergzelten Ihres Veranstalters. Camps wie Shira, Barranco und Barafu bieten unglaubliche Ausblicke – denken Sie an Sonnenaufgänge über den Wolken und sternenklare Nächte. Alle Mahlzeiten werden frisch von Ihrem Bergkoch zubereitet, und Sie haben ein Speisezelt für Ihren Komfort zur Verfügung.',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Beliebtheit und Andrang',
      blocks: [
        {
          heading: 'Ist die Lemosho-Route überlaufen?',
          paragraphs: [
            'Die Lemosho-Route beginnt an der abgelegenen Westflanke des Kilimandscharo, was weniger Trekker in den ersten Tagen bedeutet. Sie trifft an Tag 4 auf die Machame-Route und wird dadurch näher am Gipfel stärker frequentiert. Dennoch ist Lemosho in ihren ersten Etappen weniger überlaufen als Marangu oder Machame und bietet einen ruhigeren, landschaftlich reizvolleren Start.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Experteneinblicke',
      blocks: [
        {
          heading: 'Was sind unsere Eindrücke von der Lemosho-Route?',
          paragraphs: [
            'Lemosho gilt oft als die schönste und ausgewogenste Route am Kilimandscharo. Sie vereint ausgezeichnete Landschaften, eine hervorragende Akklimatisierung und eine hohe Gipfelerfolgsquote. Die meisten erfahrenen Guides empfehlen sie Einsteigern, die die besten Erfolgschancen suchen, ohne sich zu hetzen. Der Ansatz von Westen bietet zudem ein abgelegeneres Wildniserlebnis zu Beginn des Treks.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Lemosho-Route',
  secondaryTagline: 'Lemosho beginnt, wo andere es nicht tun – und das verändert alles.',
  faqHeading: '10 Fragen zur Lemosho-Route',
  faqs: [
    {number: 1, question: 'Wie lange dauert es, den Kilimandscharo über die Lemosho-Route zu besteigen?', answer: 'Die meisten Kletternden bewältigen die Lemosho-Route in 7 oder 8 Tagen. Die 8-Tage-Option umfasst einen zusätzlichen Akklimatisierungstag, der Ihre Chancen erhöht, den Gipfel zu erreichen.'},
    {number: 2, question: 'Ist die Lemosho-Route schwierig?', answer: 'Lemosho gilt als mäßig bis schwierig. Sie ist nicht technisch, aber der Gipfeltag ist lang und anstrengend. Die längere Dauer unterstützt die Akklimatisierung und macht sie für die meisten körperlich fitten Trekker bewältigbar.'},
    {number: 3, question: 'Wie hoch ist die Gipfelerfolgsquote auf der Lemosho-Route?', answer: 'Lemosho zeigt eine der höchsten Erfolgsquoten aller Kilimandscharo-Routen – bis zu 90 % beim 8-Tage-Reiseverlauf, dank ihres schrittweisen Höhengewinns und ihres exzellenten Akklimatisierungsprofils.'},
    {number: 4, question: 'Ist die Lemosho-Route landschaftlich reizvoll?', answer: 'Ja – Lemosho wird oft als die schönste Route am Kilimandscharo bezeichnet. Sie bietet vielfältige Landschaften, von Regenwald und Heideland bis zu alpiner Wüste und Gletscherblicken.'},
    {number: 5, question: 'Ist die Lemosho-Route überlaufen?', answer: 'Lemosho beginnt an der ruhigen Westflanke des Berges, sodass die ersten Tage ruhig und wenig frequentiert sind. Sie trifft in der Nähe des Lava Tower auf die stärker frequentierte Machame-Route, ist aber insgesamt weniger überlaufen als Routen wie Marangu.'},
    {number: 6, question: 'Welche Art von Unterkunft ist auf der Lemosho-Route verfügbar?', answer: 'Lemosho ist eine reine Camping-Route. Sie schlafen in hochwertigen Zelten an ausgewiesenen Camps. Träger transportieren und errichten die gesamte Campingausrüstung für Sie.'},
    {number: 7, question: 'Ist die Lemosho-Route für Einsteiger geeignet?', answer: 'Ja, besonders wenn Sie sich für die 8-Tage-Version entscheiden. Der längere Reiseverlauf gibt Einsteigern mehr Zeit zur Akklimatisierung und Erholung, was ihren Gipfelerfolg und Komfort erhöht.'},
    {number: 8, question: 'Wann ist die beste Zeit, um die Lemosho-Route zu besteigen?', answer: 'Die besten Monate sind Januar–März und Juni–Oktober, wenn das Wetter trockener und die Sicht besser ist. Diese Zeiträume bieten ein sichereres Trekking und klarere Ausblicke am Gipfel.'},
    {number: 9, question: 'Muss ich für die Lemosho-Route trainieren?', answer: 'Training wird dringend empfohlen. Konzentrieren Sie sich auf Cardio-, Kraft- und Ausdauerübungen. Lange Wanderungen mit Rucksack sind der beste Weg, sich auf die Höhe und die täglichen Trekking-Stunden vorzubereiten.'},
    {number: 10, question: 'Warum die Lemosho-Route anderen Routen vorziehen?', answer: 'Lemosho bietet die beste Balance zwischen Landschaften, Erfolgsquote und Andrangmanagement. Sie ist ideal für Trekker, die ein abgelegeneres Erlebnis mit besseren Gipfelchancen wünschen.'},
  ],
}

const rongai: RouteDe = {
  slug: 'rongai-route',
  name: 'Rongai-Route',
  seoTitle: 'Rongai-Route | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Besteigen Sie den Kilimandscharo über die Rongai-Route, die einzige Route, die den Berg von Norden aus angeht. Echter Reiseverlauf Tag für Tag, Preise und Expertentipps.',
  heroHeading: 'Rongai-Route, die abgelegene nördliche Route des Kilimandscharo',
  heroTagline: 'Der sanfte nördliche Pfad zum Kilimandscharo.',
  heroBody: [
    'Die Rongai-Route ist die einzige Route, die den Kilimandscharo von der Nordseite nahe der kenianischen Grenze angeht und ein ruhigeres, abgelegeneres Erlebnis mit schrittweise wechselnden Landschaften und weniger Andrang bietet. Sie ist perfekt für alle, die eine friedliche Besteigung wünschen, Tierbeobachtungen schätzen und eine trockenere Route bevorzugen – besonders während der Regenzeit.',
    'Obwohl anfangs etwas weniger landschaftlich reizvoll als Routen wie Lemosho, gleicht die Rongai-Route dies mit ihrer Abgeschiedenheit, ihren Erfolgsquoten und einem spektakulären finalen Zugang zum Gipfel über den Kraterrand von Kibo aus. Der Abstieg erfolgt über die Marangu-Route, was Ihnen die Gelegenheit gibt, beide Seiten des Berges zu sehen.',
  ],
  heroImage: {src: '/images/routes/rongai/hero.webp', alt: 'Ein Kletterer posiert vor dem Uhuru-Peak-Gipfelschild am Kilimandscharo'},
  itineraryHeading: 'Reiseverlauf der Rongai-Route',
  itinerarySubheading: 'Der ruhige Pfad aus dem Norden',
  daysLabel: '7 Tage',
  stops: [
    arrivalStopDe,
    {
      label: 'Trekkingtag 1: Nalemoru Gate – Simba Camp',
      meta: ['📍 Nalemoru Gate (1.950 m) → Simba Camp (2.600 m)', '📈 Höhengewinn: 650 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Start von der Nordostflanke des Kilimandscharo nahe der kenianischen Grenze. Der Pfad durchquert üppige Wälder und offenes Ackerland, bevor Simba Camp erreicht wird, das in der Heidezone liegt.'],
    },
    {
      label: 'Trekkingtag 2: Simba Camp – Second Cave Camp',
      meta: ['📍 Simba Camp (2.600 m) → Second Cave Camp (3.450 m)', '📈 Höhengewinn: 850 m', '⏳ Dauer: 5-6 Stunden'],
      body: ['Der Pfad steigt schrittweise durch offenes Heideland mit Panoramablicken auf die darunterliegenden Ebenen und den zerklüfteten Mawenzi-Gipfel vor Ihnen.'],
    },
    {
      label: 'Trekkingtag 3: Second Cave Camp – Kikelewa Camp',
      meta: ['📍 Second Cave Camp (3.450 m) → Kikelewa Camp (3.600 m)', '📈 Höhengewinn: 150 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Ein kürzeres Trekking heute mit leichtem Höhengewinn, das Zeit zur Akklimatisierung bietet. Die Vegetation wird spärlicher, während Sie sich der alpinen Zone nähern.'],
    },
    {
      label: 'Trekkingtag 4: Kikelewa Camp – Mawenzi Tarn',
      meta: ['📍 Kikelewa Camp (3.600 m) → Mawenzi Tarn (4.330 m)', '📈 Höhengewinn: 730 m', '⏳ Dauer: 4-5 Stunden'],
      body: ['Der Pfad wird steiler und führt zu einem herrlichen Gletschersee unterhalb der spektakulären Mawenzi-Zinnen. Es ist eines der malerischsten Camps am Kilimandscharo.'],
    },
    {
      label: 'Trekkingtag 5: Mawenzi Tarn – Kibo Hut',
      meta: ['📍 Mawenzi Tarn (4.330 m) → Kibo Hut (4.700 m)', '📈 Höhengewinn: 370 m', '⏳ Dauer: 5-6 Stunden'],
      body: ['Durchqueren Sie den weiten alpinen Wüstensattel zwischen Mawenzi und Kibo. Die Landschaft ist karg und still und bereitet Sie mental auf die bevorstehende Gipfelherausforderung vor.'],
    },
    {
      label: 'Trekkingtag 6: Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        '📍 Kibo Hut (4.700 m) → Uhuru Peak (5.895 m) → Horombo Hut (3.720 m)',
        '📈 Höhengewinn: 1.195 m',
        '📉 Höhenverlust: 2.175 m',
        '⏳ Dauer: 12-14 Stunden',
      ],
      body: ['Der Gipfeltag beginnt kurz nach Mitternacht. Nach Erreichen von Uhuru Peak für einen unvergesslichen Sonnenaufgang steigen Sie zu Horombo Hut für eine wohlverdiente Rast ab.'],
    },
    {
      label: 'Trekkingtag 7: Horombo Hut – Marangu Gate',
      meta: ['📍 Horombo Hut (3.720 m) → Marangu Gate (1.860 m)', '📉 Höhenverlust: 1.860 m', '⏳ Dauer: 5-6 Stunden'],
      body: ['Steigen Sie durch üppigen Regenwald ab, wo Sie möglicherweise Blauaffen und exotische Vögel entdecken. Am Marangu Gate erhalten Sie Ihr Gipfelzertifikat und verabschieden sich vom Berg.'],
    },
    departureStopDe,
  ],
  infoTabsHeading: 'Warum Rongai wählen?',
  tabs: [
    {
      id: 'duration',
      label: 'Reisedauer',
      blocks: [
        {
          heading: 'Was sind die Vorteile der Rongai-Route?',
          paragraphs: [
            'Die Rongai-Route ist die einzige Kilimandscharo-Route, die den Gipfel von Norden aus angeht, nahe der kenianischen Grenze. Sie ist bekannt dafür, weniger überlaufen, trockener und abgelegener zu sein und bietet ein einzigartiges Erlebnis mit hervorragenden Ausblicken auf die Amboseli-Ebenen in Kenia. Mit sanften Steigungen ist sie ideal für Kletternde, die eine schrittweisere Besteigung und ein ruhigeres Trekking-Erlebnis suchen. Die landschaftliche Vielfalt – von Regenwald und Heideland bis zur alpinen Wüste – macht sie zu einer bemerkenswerten Wahl für Naturliebhaber und Fotografen.',
          ],
        },
        {
          heading: 'Wie lange dauert die Rongai-Route?',
          paragraphs: [
            '7 Tage / 6 Nächte auf dem Berg.',
            'Ein optionaler Akklimatisierungstag kann für ein entspannteres Tempo und eine bessere Gipfelerfolgsquote hinzugefügt werden.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Preisübersicht',
      blocks: [
        {
          heading: 'Was kostet die Rongai-Route?',
          paragraphs: ['Die Preise können je nach Gruppengröße, enthaltenen Leistungen und Qualität des Veranstalters variieren. Im Durchschnitt:'],
          bullets: ['Privates Trekking: ab 2.200 $ bis 2.800 $ pro Person', 'Gruppentrekking: ab 1.900 $ bis 2.300 $ pro Person'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Wo Sie übernachten',
      blocks: [
        {
          heading: 'Welche Camps liegen entlang der Rongai-Route?',
          paragraphs: [
            'Im Gegensatz zur Marangu-Route, die Hütten nutzt, ist Rongai eine reine Camping-Route. Sie schlafen in 4-Jahreszeiten-Bergzelten mit Schaumstoffmatten, und Mahlzeiten werden in einem gemeinsamen Speisezelt serviert. Zu den Camps gehören:',
            'Diese Camps sind ruhig und wenig frequentiert und bieten herrliche Sternenhimmel und Bergblicke.',
          ],
          bullets: ['Simba Camp', 'Second Cave Camp', 'Kikelewa Camp', 'Mawenzi Tarn', 'Kibo Hut (Basislager)', 'Horombo Hut (Abstieg über die Marangu-Route)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Beliebtheit und Andrang',
      blocks: [
        {
          heading: 'Ist die Rongai-Route überlaufen?',
          paragraphs: [
            'Die Rongai-Route ist eine der am wenigsten überlaufenen Routen, was sie zu einer perfekten Wahl für Trekker macht, die Abgeschiedenheit suchen. Während Routen wie Machame und Marangu einen stärkeren Andrang erfahren, bietet Rongai ein ruhiges Erlebnis, besonders in den ersten Tagen des Treks. Selbst in der Hochsaison bleibt sie ruhiger.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Experteneinblicke',
      blocks: [
        {
          heading: 'Was sind unsere Eindrücke von der Rongai-Route?',
          bullets: [
            'Erfolgsquote: überdurchschnittlich dank eines langsamen, gleichmäßigen Anstiegs und der Möglichkeit zur Akklimatisierung bei Mawenzi Tarn.',
            'Wetter: ein trockenerer Pfad auf der Nordseite bedeutet weniger regenbedingte Unterbrechungen.',
            'Gipfelnacht: beginnt bei Kibo Hut und bietet einen direkten, steilen Aufstieg zu Gilman\'s Point, bevor es weiter zu Uhuru Peak geht.',
            'Besonderheit: Sie steigen auf der Marangu-Seite ab, was Ihnen ein Überquerungserlebnis des Berges ermöglicht – ein seltenes Vergnügen unter den Kilimandscharo-Routen.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Rongai-Route',
  secondaryTagline: 'Entdecken Sie beide Seiten des Kilimandscharo auf einer einzigen unvergesslichen Reise.',
  faqHeading: '10 Fragen zur Rongai-Route',
  faqs: [
    {number: 1, question: 'Wie lange dauert die Rongai-Route?', answer: 'Der Standardreiseverlauf dauert 7 Tage, aber manche Kletternde fügen einen zusätzlichen Akklimatisierungstag hinzu, um ihre Gipfelerfolgschancen zu erhöhen.'},
    {number: 2, question: 'Ist die Rongai-Route für Einsteiger geeignet?', answer: 'Ja. Sie hat eine sanftere Steigung und weniger steile Anstiege, was sie zu einer hervorragenden Option für Einsteiger im Höhentrekking macht.'},
    {number: 3, question: 'Was macht die Rongai-Route einzigartig?', answer: 'Sie ist die einzige Route, die von der Nordseite des Kilimandscharo nahe der kenianischen Grenze beginnt und trockene Bedingungen sowie einzigartige Ausblicke auf den Amboseli-Nationalpark bietet.'},
    {number: 4, question: 'Wie hoch ist die Gipfelerfolgsquote auf der Rongai-Route?', answer: 'Bei 7 Tagen liegt die Erfolgsquote bei etwa 85-90 %, besonders wenn ein Akklimatisierungstag enthalten ist.'},
    {number: 5, question: 'Ist die Rongai-Route im Vergleich zu anderen überlaufen?', answer: 'Sie ist eine der ruhigsten Routen am Kilimandscharo, perfekt für alle, die die größeren Menschenmengen auf Routen wie Machame und Marangu vermeiden möchten.'},
    {number: 6, question: 'Wie sind die Camps auf Rongai?', answer: 'Sie schlafen im Zelt an malerischen Camps wie Mawenzi Tarn und Kikelewa, bekannt für ihre abgelegene, ruhige Lage und ihre spektakulären Landschaften.'},
    {number: 7, question: 'Steigt man auf demselben Pfad ab?', answer: 'Nein. Sie steigen von Norden auf und über die Marangu-Route im Süden wieder ab, was ein vielfältigeres Erlebnis des Berges bietet.'},
    {number: 8, question: 'Wann ist die beste Jahreszeit, um die Rongai-Route zu besteigen?', answer: 'Januar bis Mitte März und Juni bis Oktober bieten das beste Wetter. Sie ist auch während der Regenzeit eine gute Option, da die Nordseite relativ trocken bleibt.'},
    {number: 9, question: 'Ist Höhenkrankheit auf dieser Route häufig?', answer: 'Wie auf allen Routen ist Höhenkrankheit möglich. Der schrittweise Anstieg von Rongai hilft dem Körper jedoch, sich leichter anzupassen – besonders bei einem 7-tägigen Reiseverlauf.'},
    {number: 10, question: 'Warum sollte ich die Rongai-Route anderen Optionen vorziehen?', answer: 'Wenn Sie einen ruhigeren Pfad, eine hervorragende Akklimatisierung und landschaftliche Vielfalt ohne den Andrang suchen, bietet Rongai eines der besten Gesamterlebnisse am Kilimandscharo.'},
  ],
}

const umbwe: RouteDe = {
  slug: 'umbwe-route',
  name: 'Umbwe-Route',
  seoTitle: 'Umbwe-Route | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Besteigen Sie den Kilimandscharo über die Umbwe-Route, die steilste und direkteste Route des Berges. Echter Reiseverlauf Tag für Tag, Preise und Expertentipps.',
  heroHeading: 'Umbwe-Route',
  heroTagline: 'Der steile Pfad zu Abgeschiedenheit und Gipfelruhm',
  heroBody: [
    'Die Umbwe-Route ist die direkteste – und wohl anspruchsvollste – Route zum Gipfel des Kilimandscharo. Bekannt für ihre steilen Anstiege, zerklüfteten Grate und aufregendes Gelände, wird sie von erfahrenen Trekkern bevorzugt, die eine kühne und weniger frequentierte Route suchen.',
    'Anders als die beliebteren Routen bietet Umbwe echte Wildnis, weniger Andrang und eine beschleunigte Herausforderung durch üppigen Regenwald, steile Grate und hochgelegene alpine Zonen. Obwohl körperlich intensiv, ist die Belohnung unvergleichliche Abgeschiedenheit und spektakuläre Bergpanoramen.',
  ],
  heroImage: {src: '/images/routes/umbwe/hero.jpg', alt: 'Bunte Zelte bei Karanga Camp mit schneebedecktem Kibo im Hintergrund'},
  itineraryHeading: 'Reiseverlauf der Umbwe-Route',
  itinerarySubheading: 'Der steilste, direkteste Weg zum Gipfel',
  daysLabel: '6 Tage',
  stops: [
    arrivalStopDe,
    {
      label: 'Trekkingtag 1: Umbwe Gate – Umbwe Cave Camp',
      meta: ['📍 Umbwe Gate (1.800 m) → Umbwe Cave Camp (2.850 m)', '📈 Höhengewinn: 1.050 m', '⏳ Dauer: 5-7 Stunden'],
      body: ['Nach der Registrierung am Umbwe Gate taucht der Pfad direkt in den Regenwald ein. Sie folgen einem schmalen, steilen Grat, gesäumt von riesigen Bäumen, Moos und verschlungenen Wurzeln. Rechnen Sie von Anfang an mit einer körperlichen Herausforderung – aber auch mit unglaublichen Ausblicken, während Sie über das Blätterdach des Waldes aufsteigen.'],
    },
    {
      label: 'Trekkingtag 2: Umbwe Cave Camp – Barranco Camp',
      meta: ['📍 Umbwe Cave Camp (2.850 m) → Barranco Camp (3.900 m)', '📈 Höhengewinn: 1.050 m', '⏳ Dauer: 4-6 Stunden'],
      body: ['Sie verlassen den Wald und betreten Heide- und Erikagelände, während Sie scharfe Grate mit atemberaubenden Blicken in die darunterliegenden Täler erklimmen. Bei Barranco Camp treffen Sie auf Trekker der Machame- und Lemosho-Route.'],
    },
    {
      label: 'Trekkingtag 3: Barranco Camp – Karanga Camp',
      meta: ['📍 Barranco Camp (3.900 m) → Karanga Camp (3.995 m)', '📈 Höhengewinn: 95 m', '⏳ Dauer: 4-5 Stunden'],
      body: ['Nach der Bewältigung der berühmten Barranco Wall, einer unterhaltsamen Kletterpartie mit Panoramablicken, steigt der Pfad durch Täler ab und wieder auf, bevor Karanga Camp erreicht wird, das auf einem windgepeitschten Grat thront.'],
    },
    {
      label: 'Trekkingtag 4: Karanga Camp – Barafu Camp',
      meta: ['📍 Karanga Camp (3.995 m) → Barafu Camp (4.673 m)', '📈 Höhengewinn: 678 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Ein kürzerer Trekkingtag gibt Ihrem Körper Zeit, sich auszuruhen und auf die Gipfelnacht vorzubereiten. Sie erreichen Barafu Camp zur Tagesmitte. Der Nachmittag ist der Hydrierung, Mahlzeiten und Ruhe gewidmet, bevor die letzte Besteigung um Mitternacht beginnt.'],
    },
    {
      label: 'Trekkingtag 5: Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp (4.673 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
        '📈 Höhengewinn: 1.222 m',
        '📉 Höhenverlust: 2.785 m',
        '⏳ Dauer: 12-16 Stunden',
      ],
      body: ['Ein Start um Mitternacht führt Sie unter den Sternen zum Gipfel. Sie erreichen Uhuru Peak bei Sonnenaufgang, dann beginnt ein langer Abstieg zu Mweka Camp. Es ist der schwierigste Tag – mental und körperlich – aber auch der unvergesslichste.'],
    },
    {
      label: 'Trekkingtag 6: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m) → Mweka Gate (1.640 m)', '📉 Höhenverlust: 1.470 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Der letzte Abstieg führt Sie durch üppigen Regenwald bis zum Mweka Gate, wo Ihr Gipfelzertifikat auf Sie wartet. Verabschieden Sie sich vom Berg und genießen Sie die Rückfahrt nach Moshi oder Arusha.'],
    },
    departureStopDe,
  ],
  infoTabsHeading: 'Warum Umbwe wählen?',
  tabs: [
    {
      id: 'duration',
      label: 'Reisedauer',
      blocks: [
        {
          heading: 'Was sind die Vorteile der Umbwe-Route?',
          paragraphs: [
            'Wenn Sie ein kühnes, adrenalingeladenes Abenteuer am Kilimandscharo suchen, ist die Umbwe-Route für Sie gemacht. Sie ist die steilste und direkteste Route zum Gipfel – und bietet eine spannende Besteigung durch wilde, unberührte Landschaften. Da sie weniger frequentiert ist, bietet sie ruhige Pfade, authentische Naturschönheit und eine intime Verbindung zum Berg, die nur wenige andere Routen bieten. Sie wird von erfahrenen Trekkern und Abenteuerlustigen bevorzugt, die ein ruhiges, abseits ausgetretener Pfade liegendes Erlebnis suchen, ohne von der zusätzlichen Herausforderung abgeschreckt zu werden.',
            'Wählen Sie Umbwe, wenn Sie Folgendes wünschen:',
            '⚠️ Hinweis: Aufgrund des schnellen Anstiegs und der begrenzten Akklimatisierungszeit eignet sich diese Route am besten für erfahrene Trekker oder Personen in ausgezeichneter körperlicher Verfassung.',
          ],
          bullets: [
            'Einen ruhigeren, abgelegeneren Pfad',
            'Weniger Andrang, auch in der Hochsaison',
            'Einen steilen, direkten Anstieg, der schnell an Höhe gewinnt',
            'Malerische Grate und spektakuläre Ausblicke auf der gesamten Strecke',
            'Eine schnellere Besteigung mit kürzerer Gesamtdistanz',
          ],
        },
        {
          heading: 'Wie lange dauert die Umbwe-Route?',
          paragraphs: [
            'Sie ist eine der kürzesten und direktesten Routen zum Gipfel, was weniger Zeit auf dem Berg bedeutet – aber auch eine größere körperliche und höhenbedingte Herausforderung.',
          ],
          bullets: ['Gesamttage: 6 Tage (5 Trekkingtage + Gipfel)', 'Distanz: etwa 53 km', 'Startpunkt: Umbwe Gate (1.800 m)', 'Gipfel: Uhuru Peak (5.895 m)', 'Ankunftspunkt: Mweka Gate (1.640 m)'],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Preisübersicht',
      blocks: [
        {
          heading: 'Was kostet die Umbwe-Route?',
          paragraphs: [
            'Obwohl die Preise je nach Gruppengröße, Veranstalter und enthaltenen Leistungen variieren, hier eine allgemeine Schätzung für eine 6-tägige Umbwe-Besteigung:',
            'Die enthaltenen Leistungen umfassen in der Regel: Park- und Rettungsgebühren, Zelte, Campingausrüstung und Mahlzeiten, erfahrene Guides, Träger und Köche, Hin- und Rücktransport zum Startpunkt, das Gipfelzertifikat.',
            '🧾 Tipp: Prüfen Sie immer, ob der Preis Unterkunft vor/nach der Tour, Ausrüstungsverleih und Trinkgelder für Träger und Guides umfasst.',
          ],
          bullets: ['Gruppentour: 1.800 $ bis 2.300 $ pro Person', 'Privates Trekking: 2.400 $ bis über 3.000 $ pro Person'],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Wo Sie übernachten',
      blocks: [
        {
          heading: 'Welche Camps liegen entlang der Umbwe-Route?',
          paragraphs: [
            'Im Gegensatz zur Marangu-Route (die Hütten nutzt) ist die Umbwe-Route ein reines Camping-Erlebnis. Sie übernachten in täglich von Ihren Trägern aufgestellten Camps. Die Camps befinden sich bei:',
            'Rechnen Sie mit spektakulären Nachthimmeln, frischer Bergluft und dem Komfort eines warmen Schlafsacks unter Zeltplanen.',
          ],
          bullets: ['Umbwe Cave Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp (Abstieg)'],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Beliebtheit und Andrang',
      blocks: [
        {
          heading: 'Ist die Umbwe-Route überlaufen?',
          paragraphs: [
            'Umbwe ist eine der am wenigsten frequentierten Routen am Kilimandscharo. Sie könnten sich sogar stundenlang allein auf dem Pfad wiederfinden, besonders in den unteren Abschnitten. Sobald Sie sich bei Barranco Camp den Kletternden von Machame und Lemosho anschließen, wird es etwas belebter – bleibt aber ruhiger als andere Routen. Wenn Ihnen Abgeschiedenheit wichtig ist, ist dies eine ausgezeichnete Wahl.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Experteneinblicke',
      blocks: [
        {
          heading: 'Was sind unsere Eindrücke von der Umbwe-Route?',
          bullets: [
            'Die Akklimatisierung ist begrenzt, was die Herausforderung erhöht. Diese Route ist für Einsteiger im Höhentrekking nicht ideal.',
            'Guides empfehlen Vorakklimatisierungswanderungen oder ein Höhentraining, wenn Sie sich für Umbwe entscheiden.',
            'Die Gipfelerfolgsquote ist niedriger als bei längeren Routen, aber robuste Trekker mit gutem Tempo und guter Hydrierung schaffen es oft gut.',
            'Für Personen mit technischer Trekkingerfahrung ist die Barranco Wall ein unterhaltsamer und malerischer Abschnitt, kein beängstigender Aufstieg.',
            'Die kürzere Dauer bedeutet weniger Urlaubs- oder Reisetage – erfordert aber auch eine bessere körperliche Verfassung.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Umbwe-Route',
  secondaryTagline: 'Der steile Pfad zu Abgeschiedenheit und Gipfelruhm.',
  faqHeading: '10 Fragen zur Umbwe-Route',
  faqs: [
    {number: 1, question: 'Wie lange dauert es, den Kilimandscharo über die Umbwe-Route zu besteigen?', answer: 'Die Umbwe-Route dauert in der Regel 6 Tage, einschließlich Gipfeltag und Abstieg. Manche Kletternde entscheiden sich für eine 7-Tage-Version, um mehr Zeit zur Akklimatisierung zu haben, obwohl 6 Tage die Norm sind.'},
    {number: 2, question: 'Ist die Umbwe-Route schwierig?', answer: 'Ja – Umbwe gilt als die schwierigste nicht-technische Route am Kilimandscharo. Ihr steiler, schneller Anstieg lässt wenig Zeit zur Akklimatisierung und macht sie am besten für erfahrene, körperlich fitte Trekker geeignet.'},
    {number: 3, question: 'Wie hoch ist die Erfolgsquote auf der Umbwe-Route?', answer: 'Aufgrund ihrer kurzen Dauer und ihres steilen Profils ist die Gipfelerfolgsquote niedriger als bei längeren Routen – oft um die 60-70 %. Zusätzliche Akklimatisierungstage können Ihre Chancen verbessern.'},
    {number: 4, question: 'Ist die Umbwe-Route überlaufen?', answer: 'Überhaupt nicht. Sie ist eine der am wenigsten frequentierten Routen des Berges. Sie genießen ruhige Pfade und friedliche Camps, besonders in den ersten Etappen, bevor Sie sich anderen Routen bei Barranco anschließen.'},
    {number: 5, question: 'Ist die Umbwe-Route landschaftlich reizvoll?', answer: 'Sie ist unglaublich malerisch! Die Route steigt durch dichten Regenwald, spektakuläre Grate und tiefe Täler an und bietet Panoramablicke von Beginn des Treks an sowie herrliche Aussichten auf der gesamten Strecke.'},
    {number: 6, question: 'Wo schläft man auf der Umbwe-Route?', answer: 'Sie übernachten in Camps, die von Ihrem Unterstützungsteam aufgestellt werden. Anders als die Marangu-Route, die Hütten nutzt, ist Umbwe ein reines Camping-Erlebnis.'},
    {number: 7, question: 'Können Einsteiger die Umbwe-Route bewältigen?', answer: 'Sie wird für Einsteiger nicht empfohlen. Die Route ist körperlich anspruchsvoll und bietet nur begrenzte Akklimatisierungszeit. Wenn Sie neu im Höhentrekking sind, ist eine längere, schrittweisere Route wie Lemosho oder Machame besser geeignet.'},
    {number: 8, question: 'Wann ist die beste Zeit, um über die Umbwe-Route zu besteigen?', answer: 'Die besten Monate sind Januar-März und Juni-Oktober, die trockenes Wetter und klaren Himmel bieten. Auch Dezember ist möglich, wenn auch etwas feuchter.'},
    {number: 9, question: 'Trifft die Umbwe-Route auf andere Pfade?', answer: 'Ja. In der Nähe von Barranco Camp trifft die Umbwe-Route auf die Machame- und Lemosho-Routen, teilt sich den südlichen Rundweg zum Gipfel und steigt über die Mweka-Route ab.'},
    {number: 10, question: 'Warum die Umbwe-Route anderen vorziehen?', answer: 'Wählen Sie Umbwe, wenn Sie eine anspruchsvollere, abgelegenere und malerischere Besteigung mit weniger Andrang wünschen. Sie ist ideal für Trekker, die Abgeschiedenheit, spektakuläre Landschaften und eine kürzere Gesamtdauer suchen – bereiten Sie sich einfach auf die Intensität vor.'},
  ],
}

const northernCircuit: RouteDe = {
  slug: 'northern-circuit-route',
  name: 'Northern-Circuit-Route',
  seoTitle: 'Northern-Circuit-Route | Climbing Kilimanjaro Tanzania',
  seoDescription:
    'Besteigen Sie den Kilimandscharo über die Northern-Circuit-Route, die längste und landschaftlich reizvollste Route mit der höchsten Erfolgsquote. Echter Reiseverlauf Tag für Tag, Preise und Expertentipps.',
  heroHeading: 'Northern-Circuit-Route am Kilimandscharo',
  heroTagline: 'Die beliebteste Route zum Gipfel des Kilimandscharo',
  heroBody: [
    'Die Northern-Circuit-Route ist die längste und landschaftlich reizvollste Route am Kilimandscharo und bietet unvergleichliche Ausblicke sowie die höchste Erfolgsquote aller Routen. Da sie fast einmal komplett um den Berg herumführt, ermöglicht sie eine ausgezeichnete Akklimatisierung, was sie ideal für Trekker macht, die eine schrittweisere Besteigung mit weniger Andrang suchen.',
    'Sie entdecken alles vom üppigen Regenwald und alpinem Heideland bis zu zerklüfteten Hochebenen und weiten offenen Himmeln an den Nordhängen – einer Region, die nur wenige zu Gesicht bekommen. Mit ihrer abgelegenen Schönheit und ihrem strategischen Tempo bietet der Northern Circuit ein Premium-Trekking-Erlebnis für alle mit Zeit und Abenteuergeist.',
  ],
  heroImage: {src: '/images/routes/northern-circuit/hero.jpg', alt: 'Zelte bei Mweka Camp mit dem Kibo-Gipfel bei Sonnenaufgang'},
  itineraryHeading: 'Reiseverlauf der Northern-Circuit-Route',
  itinerarySubheading: 'Weiter gehen, um höher zu kommen',
  daysLabel: '9 Tage',
  stops: [
    arrivalStopDe,
    {
      label: 'Trekkingtag 1: Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate (2.100 m) → Mti Mkubwa Camp (2.650 m)', '📈 Höhengewinn: 550 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Ihr Trekking beginnt mit einer Fahrt zum Londorossi Gate zur Registrierung, gefolgt von einem sanften Spaziergang durch üppigen Regenwald, Heimat von Guerezas und einer reichen Vogelwelt. Erreichen Sie Mti Mkubwa (Big Tree) Camp für Ihre erste Nacht unter den Sternen.'],
    },
    {
      label: 'Trekkingtag 2: Mti Mkubwa Camp – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa (2.650 m) → Shira 1 Camp (3.610 m)', '📈 Höhengewinn: 960 m', '⏳ Dauer: 6-7 Stunden'],
      body: ['Verlassen Sie den Wald und betreten Sie die Heide- und Erikazone, wo sich die Landschaft mit Ausblicken auf den Kibo-Gipfel öffnet. Genießen Sie eine ruhige Wanderung über das Shira-Plateau, um Ihr Camp zu erreichen.'],
    },
    {
      label: 'Trekkingtag 3: Shira 1 Camp – Shira 2 Camp',
      meta: ['📍 Shira 1 Camp (3.610 m) → Shira 2 Camp (3.850 m)', '📈 Höhengewinn: 240 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Ein kurzes Trekking über das weite, offene Plateau des Shira-Grats gibt Ihnen Zeit zum Ausruhen und Akklimatisieren. Bei gutem Wetter genießen Sie Panoramablicke auf den Kibo und den Mount Meru in der Ferne.'],
    },
    {
      label: 'Trekkingtag 4: Shira 2 Camp – Lava Tower – Moir Hut',
      meta: [
        '📍 Shira 2 (3.850 m) → Lava Tower (4.630 m) → Moir Hut (4.200 m)',
        '📈 Höhengewinn: 780 m',
        '📉 Höhenverlust: 430 m',
        '⏳ Dauer: 6-7 Stunden',
      ],
      body: ['Heute umfasst einen Aufstieg zum Lava Tower – einem wichtigen Akklimatisierungspunkt – bevor Sie leicht zum abgelegenen, ruhigen Moir Hut absteigen, gelegen in einem Tal in großer Höhe.'],
    },
    {
      label: 'Trekkingtag 5: Moir Hut – Buffalo Camp',
      meta: ['📍 Moir Hut (4.200 m) → Buffalo Camp (4.020 m)', '📉 Höhenverlust: 180 m', '⏳ Dauer: 5-7 Stunden'],
      body: ['Wandern Sie entlang der selten gesehenen Nordhänge des Kilimandscharo mit Panoramablicken in Richtung der kenianischen Ebenen. Der Pfad ist wild und ruhig – hier gewinnt der Northern Circuit seinen Ruf.'],
    },
    {
      label: 'Trekkingtag 6: Buffalo Camp – Third Cave Camp',
      meta: ['📍 Buffalo Camp (4.020 m) → Third Cave (3.870 m)', '📉 Höhenverlust: 150 m', '⏳ Dauer: 5-6 Stunden'],
      body: ['Ein weiterer sanfter Trekkingtag durch die alpine Wüste. Während Sie ostwärts weiterziehen, ist das Gefühl der Abgeschiedenheit unvergleichlich. Richten Sie sich bei Third Cave Camp ein und bereiten Sie sich auf die letzte Anstrengung vor.'],
    },
    {
      label: 'Trekkingtag 7: Third Cave Camp – School Hut',
      meta: ['📍 Third Cave (3.870 m) → School Hut (4.750 m)', '📈 Höhengewinn: 880 m', '⏳ Dauer: 4-5 Stunden'],
      body: ['Ein kürzerer Tag mit einem gleichmäßigen Aufstieg zu School Hut, Ihrer letzten Basis vor dem Gipfelversuch. Kommen Sie früh für Abendessen und Ruhe vor Ihrer Mitternachtsbesteigung an.'],
    },
    {
      label: 'Trekkingtag 8: School Hut – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 School Hut (4.750 m) → Uhuru Peak (5.895 m) → Mweka Camp (3.110 m)',
        '📈 Höhengewinn: 1.145 m',
        '📉 Höhenverlust: 2.785 m',
        '⏳ Dauer: 12-15 Stunden',
      ],
      body: ['Gipfeltag! Beginnen Sie Ihre Besteigung gegen Mitternacht, erreichen Sie Stella Point bei Sonnenaufgang und drücken Sie dann weiter bis Uhuru Peak, dem höchsten Punkt Afrikas. Nach der Feier steigen Sie zu Mweka Camp für eine wohlverdiente Rast ab.'],
    },
    {
      label: 'Trekkingtag 9: Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp (3.110 m) → Mweka Gate (1.640 m)', '📉 Höhenverlust: 1.470 m', '⏳ Dauer: 3-4 Stunden'],
      body: ['Eine letzte Wanderung durch den Regenwald führt Sie zum Mweka Gate, wo Sie Ihre Abreise unterschreiben, Ihr Gipfelzertifikat erhalten und nach Moshi zurückkehren, um zu feiern und sich auszuruhen.'],
    },
    departureStopDe,
  ],
  infoTabsHeading: 'Warum den Northern Circuit wählen?',
  tabs: [
    {
      id: 'duration',
      label: 'Reisedauer',
      blocks: [
        {
          heading: 'Was sind die Vorteile der Northern-Circuit-Route?',
          bullets: [
            'Die höchste Erfolgsquote dank ihrer verlängerten Akklimatisierungszeit.',
            'Die längste Route am Kilimandscharo (9 Tage), die mehr Zeit zur Anpassung und zum Genießen der Reise bietet.',
            'Spektakuläre Landschaften aus jedem Blickwinkel – üppiger Regenwald, Shira-Plateau und nördliche Wildnis.',
            'Sehr wenig Andrang – Sie werden vor der Gipfelnacht selten andere Gruppen sehen.',
            'Ideal für erfahrene Trekker oder alle, die ein entspannteres Tempo wünschen.',
            'Ausgezeichnete Möglichkeiten zur Tierbeobachtung, einschließlich Elenantilopen und Büffel, an den unteren Hängen.',
          ],
        },
        {
          heading: 'Wie lange dauert die Northern-Circuit-Route?',
          paragraphs: [
            'Gesamttage auf dem Berg: 9. Aufstiegstage: 8 (mit schrittweisem Höhengewinn). Abstiegstag: 1. Diese zusätzliche Zeit verbessert den Gipfelerfolg erheblich, indem sie Ihrem Körper ermöglicht, sich auf natürliche Weise an die Höhe anzupassen.',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Preisübersicht',
      blocks: [
        {
          heading: 'Was kostet die Northern-Circuit-Route?',
          paragraphs: [
            'Die Preise für den 9-tägigen Northern Circuit umfassen in der Regel:',
            '💵 Geschätzte Spanne: 2.500 $ bis 3.700 $ pro Person, je nach Gruppengröße und Qualität des Veranstalters.',
          ],
          bullets: [
            'Alle Parkgebühren, Genehmigungen und Steuern',
            'Professionelle Bergführer, Träger und Köche',
            'Vollpension auf dem Berg (Mahlzeiten, gereinigtes Wasser, Snacks)',
            'Campingausrüstung (Zelte, Matten, Speisezelt usw.)',
            'Flughafentransfers und Hotelaufenthalte vor/nach der Besteigung',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: 'Wo Sie übernachten',
      blocks: [
        {
          heading: 'Welche Camps liegen entlang der Northern-Circuit-Route?',
          bullets: [
            'Camping die gesamte Strecke über – es gibt keine Hütten auf dieser Route.',
            'Komfortable 3-Jahreszeiten-Bergzelte mit Schaumstoffmatten.',
            'Private Toilettenzelte und Speisezelte bei höherwertigen Veranstaltern.',
            'Die Camps sind ruhig, malerisch und weniger frequentiert als bei anderen Routen.',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: 'Beliebtheit und Andrang',
      blocks: [
        {
          heading: 'Ist die Northern-Circuit-Route überlaufen?',
          bullets: [
            'Der Northern Circuit ist die am wenigsten frequentierte Route am Kilimandscharo.',
            'Perfekt für Trekker, die einen abgelegeneren, ruhigeren Pfad bevorzugen.',
            'Sie sehen weniger Gruppen, bis Sie sich in der Nähe des Gipfels den Marangu-/Machame-Pfaden anschließen.',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: 'Experteneinblicke',
      blocks: [
        {
          heading: 'Was sind unsere Eindrücke von der Northern-Circuit-Route?',
          bullets: [
            'Empfohlen für Fotografen und Naturliebhaber, die alle Seiten des Kilimandscharo sehen möchten.',
            'Mit ihrer Dauer von 9 Tagen ist sie ideal für Trekker, die sich Sorgen um Höhenkrankheit machen.',
            'Obwohl technisch nicht schwierig, benötigen Sie gute Ausdauer für die langen Tage.',
            'Bietet ein einzigartiges Wildniserlebnis, abseits der wichtigsten Touristenpfade.',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Northern-Circuit-Route',
  secondaryTagline: 'Der landschaftlich reizvolle Weg zum Gipfel – Weiter gehen, um höher zu kommen.',
  faqHeading: '10 Fragen zur Northern-Circuit-Route',
  faqs: [
    {number: 1, question: 'Wie lange dauert die Northern-Circuit-Route?', answer: 'Die Northern-Circuit-Route dauert in der Regel 9-10 Tage. Diese Dauer ermöglicht eine angemessene Akklimatisierung und erhöht die Gipfelerfolgschancen am Kilimandscharo deutlich.'},
    {number: 2, question: 'Ist es schwierig, den Kilimandscharo über den Northern Circuit zu besteigen?', answer: 'Es ist ein langes Trekking, aber die schrittweise Akklimatisierung macht es für körperlich fitte Einsteiger bewältigbar.'},
    {number: 3, question: 'Wie hoch ist die Gipfelerfolgsquote auf dieser Route?', answer: 'Etwa 90-95 %, die höchste aller Routen dank des schrittweisen Höhengewinns.'},
    {number: 4, question: 'Wann ist die beste Zeit, um über den Northern Circuit zu besteigen?', answer: 'Januar-März und Juni-Oktober bieten das beste Wetter und die besten Pfadbedingungen.'},
    {number: 5, question: 'Ist der Northern Circuit teurer als andere Routen?', answer: 'Ja, da er länger und abgelegener ist – aber das Erlebnis ist unvergleichlich.'},
    {number: 6, question: 'Brauche ich vorherige Trekkingerfahrung?', answer: 'Nein, aber gute körperliche Verfassung und Vorbereitung sind essenziell.'},
    {number: 7, question: 'Welche Tierwelt könnte ich beobachten?', answer: 'Blauaffen, Guerezas, Büffel und gelegentlich Elefanten an den unteren Hängen.'},
    {number: 8, question: 'Ist der Northern Circuit überlaufen?', answer: 'Nein. Es ist die ruhigste Route mit sehr geringem Andrang.'},
    {number: 9, question: 'Ist es eine Camping-Route?', answer: 'Ja, alle Nächte werden im Zelt verbracht. Es gibt keine Hütten.'},
    {number: 10, question: 'Kann ich Ausrüstung vor Ort mieten?', answer: 'Ja, die meisten seriösen Veranstalter bieten hochwertige Mietausrüstung in Moshi oder Arusha an.'},
  ],
}

const routesDe: RouteDe[] = [machame, marangu, lemosho, rongai, umbwe, northernCircuit]

// ---------- routesHubPage-de ----------

async function seedRoutesHubDe() {
  const cards = [
    {title: 'Machame-Route', slug: 'machame-route', summary: 'Bekannt als Whiskey Route, ist Machame die beliebteste Route am Kilimandscharo und bietet atemberaubende Landschaften und vielfältiges Gelände. Obwohl anspruchsvoll, mit steilen Pfaden und Zeltcamps, bietet sie eine ausgezeichnete Akklimatisierung für Kletternde, die eine kürzere, aber lohnende Besteigung suchen.', image: {src: '/images/routes/hub/card-machame.png', alt: 'Illustrierte Karte der Machame-Route'}},
    {title: 'Lemosho-Route', slug: 'lemosho-route', summary: 'Eine der landschaftlich reizvollsten Routen am Kilimandscharo, Lemosho beginnt am abgelegenen Londorossi Gate und durchquert das großartige Shira-Plateau. Diese Route bietet eine ruhige Besteigung mit spektakulären Ausblicken, reicher Tierwelt und einem schrittweisen Aufstieg für ein komfortables Erlebnis.', image: {src: '/images/routes/hub/card-lemosho.png', alt: 'Illustrierte Karte der Lemosho-Route'}},
    {title: 'Rongai-Route', slug: 'rongai-route', summary: 'Als einzige nördliche Route am Kilimandscharo ist Rongai weniger frequentiert und sanfter, was sie zu einer ausgezeichneten Wahl für alle macht, die eine ruhige und gleichmäßige Besteigung bevorzugen. Diese Route ist ideal während der Regenzeit, da sie weniger Niederschlag erhält und ein angenehmes Trekking durch unberührte Wildnis bietet.', image: {src: '/images/routes/hub/card-rongai.png', alt: 'Illustrierte Karte der Rongai-Route'}},
    {title: 'Northern-Circuit-Route', slug: 'northern-circuit-route', summary: 'Die längste und landschaftlich reizvollste Route, der Northern Circuit bietet die beste Akklimatisierung, indem er schrittweise um den Kilimandscharo herumführt. Mit Panoramablicken und einer hohen Erfolgsquote bietet diese Route ein ruhiges und immersives Trekking-Erlebnis.', image: {src: '/images/routes/hub/card-northern-circuit.png', alt: 'Illustrierte Karte der Northern-Circuit-Route'}},
  ]
  await client.createOrReplace({
    _id: 'routesHubPage-de',
    _type: 'routesHubPage',
    language: 'de',
    seo: {_type: 'seo', title: 'Kilimandscharo-Besteigungsrouten | Climbing Kilimanjaro Tanzania', description: 'Vergleichen Sie die besten Routen zur Besteigung des Kilimandscharo — Machame, Lemosho, Rongai und den Northern Circuit — mit echten Reiseverläufen und Expertentipps.'},
    hero: {eyebrow: 'Das Dach Afrikas.', heading: 'Die besten Routen zur Besteigung des Kilimandscharo', locationPill: 'Nordtansania'},
    ctaBandButtons: [
      {_type: 'ctaButton', _key: key(), label: 'Jetzt Angebot Anfordern', href: '/request-a-quote-tanzania-safari/', variant: 'solid'},
      {_type: 'ctaButton', _key: key(), label: 'Mit Unserem Experten Sprechen', href: 'https://wa.me/255767140150', variant: 'outline'},
    ],
    promoSection: {heading: 'Was Sie vor der Besteigung des Kilimandscharo wissen sollten', exploreLabel: 'Alle Informationen Entdecken', exploreHref: '/kilimanjaro-climbing-guide/'},
    tabsHeading: 'Kilimandscharo-Besteigungsrouten und -Karten',
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'routeHubCard', _key: key(), title: card.title, routeSlug: card.slug, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
    testimonials: [
      {name: 'Obazee', date: '2023-11-28', quote: 'Die Besteigung meines Lebens! Unsere Kilimandscharo-Besteigung mit Asili Explorer African Safaris war wirklich außergewöhnlich! Von Anfang bis Ende sorgte das Team für ein unvergessliches Erlebnis und machte unsere Reise zum Gipfel reibungslos, sicher und denkwürdig.'},
      {name: 'Romy H', date: '2023-11-28', quote: 'Es überrascht nicht, dass Asili Explorer African Safaris einen 5-Sterne-Ruf aufrechterhält. Ihr Fachwissen, ihre Professionalität und ihr Engagement für die Kundenzufriedenheit heben sie hervor. Wenn Sie die beste Kilimandscharo-Trekkingagentur suchen, brauchen Sie nicht weiterzusuchen!'},
      {name: 'Rony V', date: '2023-12-27', quote: 'Im Oktober 2023 unternahmen wir ein sechstägiges Trekking zum Gipfel des Kilimandscharo mit Asili Explorer African Safaris. Das Erlebnis war phänomenal, und ich empfehle es jedem, der dieses Abenteuer in Betracht zieht, wärmstens.'},
      {name: 'Avdb', date: '2023-11-28', quote: 'Joe war ein perfekter Guide und Fahrer. Er hat uns die echte Tierwelt Tansanias gezeigt und entdecken lassen. Nichts war ihm zu kompliziert. Seine Kenntnis aller wichtigen Orte der verschiedenen Tiere ist beeindruckend.'},
    ].map((t) => ({_type: 'hubTestimonial', _key: key(), name: t.name, date: t.date, quote: t.quote})),
    faqHeading: 'Häufig Gestellte Fragen',
    faqSubheading: 'Ihre Fragen und Unsere Antworten',
    faqIntro: 'Haben Sie Fragen zur Buchung einer Tansania-Safari bei uns? Sehen Sie sich unsere FAQ unten für schnelle Antworten an. Wenn Sie nicht finden, wonach Sie suchen, zögern Sie nicht, uns zu kontaktieren — unsere Experten helfen Ihnen gerne, das perfekte tansanische Abenteuer zu planen.',
    faqs: [
      {question: 'Welche Routen stehen für den Kilimandscharo zur Verfügung?', answer: 'Der Kilimandscharo bietet mehrere Routen, die für Kletternde jeden Niveaus, jeder Präferenz und jedes Trekking-Stils geeignet sind. Bei Asili Explorer African Safaris sind wir auf die vier beliebtesten Kilimandscharo-Routen spezialisiert: Rongai Route, Lemosho Route, Northern Circuit Route und Machame Route. Unsere geführten Besteigungen gewährleisten Sicherheit, angemessene Akklimatisierung und eine unvergessliche Reise zum Gipfel.'},
      {question: 'Welche ist die am wenigsten frequentierte Kilimandscharo-Route?', answer: 'Die Northern Circuit Route ist die am wenigsten frequentierte und bietet ein ruhiges, isoliertes Trekking-Erlebnis.'},
      {question: 'Welche ist die einfachste Route, um den Kilimandscharo zu besteigen?', answer: 'Die Rongai Route gilt dank ihrer schrittweisen Steigungen und ihres direkten Aufstiegs als die einfachste.'},
      {question: 'Welche ist die landschaftlich reizvollste Kilimandscharo-Route?', answer: 'Die Lemosho Route wird oft als die landschaftlich reizvollste angesehen, mit atemberaubenden Landschaften, vielfältigen Ökosystemen und Panoramablicken.'},
      {question: 'Was kostet die Besteigung des Kilimandscharo?', answer: 'Die Kosten für die Besteigung des Kilimandscharo variieren zwischen 2.500 $ und 4.000 $, je nach Routenwahl, Dauer, Gruppengröße, Serviceniveau und enthaltenen Leistungen. Bei Asili Explorer African Safaris garantieren wir gut ausgebildete Guides, hohe Sicherheitsstandards und ein insgesamt außergewöhnliches Erlebnis.'},
      {question: 'Wie lange dauert es, den Kilimandscharo zu besteigen?', answer: 'Die Besteigung dauert in der Regel 6 bis 9 Tage, je nach gewählter Route. Ein längerer Reiseverlauf ermöglicht eine bessere Akklimatisierung und erhöht die Chancen auf ein erfolgreiches und angenehmes Gipfelerlebnis.'},
      {question: 'Können Einsteiger den Kilimandscharo besteigen?', answer: 'Ja! Obwohl keine technischen Kletterkenntnisse erforderlich sind, sollten Einsteiger ein angemessenes körperliches Training vor dem Versuch absolvieren. Unsere erfahrenen Guides sorgen dafür, dass Einsteiger-Kletternde während der gesamten Reise die notwendige Unterstützung und Begleitung erhalten.'},
      {question: 'Wann ist die beste Zeit, um den Kilimandscharo zu besteigen?', answer: 'Die besten Saisons für die Besteigung des Kilimandscharo sind die Trockenmonate: Januar bis März und Juni bis Oktober. Diese Monate bieten die besten Wetterbedingungen, einen klareren Himmel und ein angenehmeres Trekking-Erlebnis.'},
      {question: 'Braucht man einen Guide, um den Kilimandscharo zu besteigen?', answer: 'Ja! Die Besteigung des Kilimandscharo ohne lizenzierten Guide ist nicht erlaubt. Guides bringen ihr Fachwissen ein, überwachen Ihre Gesundheit, gewährleisten Ihre Sicherheit und helfen Ihnen, sich im anspruchsvollen Gelände des Kilimandscharo zurechtzufinden — selbst erfahrene Kletternde müssen einen haben.'},
      {question: 'Wie schwierig ist die Besteigung des Kilimandscharo?', answer: 'Die Besteigung des Kilimandscharo ist ein anspruchsvolles, aber lohnendes Abenteuer. Die Hauptschwierigkeit ergibt sich aus der großen Höhe und dem vielfältigen Gelände. Mit guter Vorbereitung, einem gut geplanten Reiseverlauf und erfahrener Begleitung können Kletternde unterschiedlichen Erfahrungsniveaus erfolgreich den Gipfel erreichen.'},
      {question: 'Wie schläft man auf dem Kilimandscharo?', answer: 'Während Ihres Kilimandscharo-Trekkings übernachten Sie in hochwertigen, wetterfesten Zelten, die für Komfort unter extremen Bedingungen ausgelegt sind, mit geräumigen Zelten, isolierenden Matten und warmen Schlafsäcken für eine erholsame Nacht an unseren ausgewiesenen Camps.'},
      {question: 'Braucht man Sauerstoff, um den Kilimandscharo zu besteigen?', answer: 'Die meisten Kletternden benötigen keinen zusätzlichen Sauerstoff, um den Kilimandscharo zu besteigen. Der Schlüssel zu einer erfolgreichen Besteigung ist eine gute Akklimatisierung. In seltenen Fällen schwerer Höhenkrankheit steht Sauerstoff aus Sicherheitsgründen zur Verfügung.'},
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  })
  console.log('routesHubPage-de created/replaced')
}

async function routeToFieldsDe(data: RouteDe) {
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
  for (const route of routesDe) {
    const enId = await findEnId(client, 'route', route.slug)
    if (!enId) {
      console.log(`SKIP ${route.slug}: no en source found`)
      continue
    }
    const fields = await routeToFieldsDe(route)
    const deId = await upsertTranslatedDoc(client, 'route', route.slug, 'de', fields)
    await linkTranslationMetadata(client, 'route', [
      {language: 'en', id: enId},
      {language: 'de', id: deId},
    ])
    console.log(`${route.slug}-de done (${deId})`)
  }
  await seedRoutesHubDe()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
