/**
 * Phase 6 (German): German translation for the 13 detail articles in content/articles.ts.
 * Mirrors seed-it-detail-articles.ts's structure.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-detail-articles.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface TableDe {
  columns: string[]
  rows: string[][]
}
interface SectionDe {
  heading: string
  body?: string
  table?: TableDe
  image?: {src: string; alt: string}
}
interface DetailArticleDe {
  slug: string
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroImage: {src: string; alt: string}
  intro: string
  sections: SectionDe[]
}

function tableToDoc(table?: TableDe) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedDetailArticleDe(data: DetailArticleDe) {
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
  const deId = await upsertTranslatedDoc(client, 'article', data.slug, 'de', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`${data.slug}-de done (${deId})`)
}

const isClimbingKilimanjaroSafeDe: DetailArticleDe = {
  slug: 'is-climbing-kilimanjaro-safe',
  seoTitle: 'Ist die Besteigung des Kilimandscharo sicher? | Asili Climbing Kilimanjaro',
  seoDescription: 'Ist die Besteigung des Kilimandscharo sicher? Erfahren Sie mehr über Höhenkrankheit, Sicherheitsmaßnahmen und wie Asili Climbing Kilimanjaro die Sicherheit jedes Trekkers gewährleistet.',
  heroTitle: 'Ist die Besteigung des Kilimandscharo sicher: Was jeder Trekker wissen sollte',
  heroImage: {src: '/images/articles/is-safe-hero.jpg', alt: 'Trekker besteigen den Kilimandscharo bei Sonnenaufgang'},
  intro:
    'Der Kilimandscharo ist eines der zugänglichsten und lohnendsten Höhenabenteuer der Welt. Obwohl keine technischen Kletterfähigkeiten erforderlich sind, sollte die Sicherheit am Kilimandscharo nicht auf die leichte Schulter genommen werden. Bei Asili Climbing Kilimanjaro ist Sicherheit nicht nur eine Priorität — sie ist das Fundament all unseres Handelns. Ob Sie ein Trekking-Neuling oder ein erfahrener Abenteurer sind, dieser Leitfaden hilft Ihnen zu verstehen, wie Sie den Kilimandscharo sicher und selbstbewusst besteigen.',
  sections: [
    {
      heading: 'Ist die Besteigung des Kilimandscharo sicher?',
      body: 'Ja — mit guter Vorbereitung, erfahrenen Guides und einem verantwortungsvollen Veranstalter ist die Besteigung des Kilimandscharo für die meisten gesunden Menschen sicher. Dennoch handelt es sich um ein Höhentrekking, nicht um eine einfache lange Wanderung. Das bedeutet, dass Höhenkrankheit, extreme Wetterbedingungen und körperliche Anstrengung allesamt eine Rolle bei den Risiken spielen. Die Wahl eines professionellen, sicherheitsorientierten Veranstalters wie Asili ist entscheidend, um diese Risiken zu minimieren.',
    },
    {
      heading: '🧭 Wichtigste Sicherheitsmaßnahmen von Asili Climbing Kilimanjaro',
      body: 'Wir gehen über die Grundlagen hinaus, um Ihre Sicherheit während der gesamten Besteigung zu gewährleisten:\n1. Zertifizierte und erfahrene Bergführer — Zertifizierte Wilderness First Responder (WFR), geschult in medizinischer Versorgung und Höhenevakuierung, lokale Experten, die das Gelände und die Wetterbedingungen des Berges genau kennen.\n2. Tägliche Gesundheitsüberwachung — Zweimal tägliche Gesundheitschecks: Sauerstoffsättigung (SpO2), Herzfrequenz und allgemeine Symptome. Erfasste und ausgewertete Kontrollen auf akute Höhenkrankheit (AMS). Sie bestimmen Ihr Tempo — wir passen uns Ihren Bedürfnissen an.\n3. Notfallsauerstoff und Pulsoximeter — Auf jedem Trek oberhalb von 3.000 Metern mitgeführt. Tragbarer Sauerstoff und Pulsoximeter für eine Echtzeitreaktion auf die Höhe. Sofortige Abstiegsprotokolle bei Bedarf.\n4. Evakuierungspläne und Unterstützung — 24/7-Notfallreaktion. Koordination mit dem Kilimandscharo-Nationalpark und lokalen Rettungsteams. Abstieg per Privatfahrzeug oder Trage bei Bedarf verfügbar.',
    },
    {
      heading: '⛰️ Die Risiken des Kilimandscharo verstehen',
      body: 'Obwohl jedes Jahr Tausende von Menschen sicher den Gipfel erreichen, hilft Ihnen das Wissen um die Risiken, klüger zu besteigen:\n🧠 Höhenkrankheit — AMS kann jeden treffen, unabhängig von Alter oder Fitness. Häufige Symptome: Kopfschmerzen, Übelkeit, Schwindel, Erschöpfung. Schwere Formen (HAPE/HACE) sind selten, aber gefährlich. Präventionstipp: Wählen Sie längere Routen (7-9 Tage) wie Lemosho oder Northern Circuit für eine bessere Akklimatisierung.\n🌧️ Wetter und Witterungsexposition — Das Klima des Kilimandscharo ändert sich schnell: intensive Sonne, Regen, Wind und eisige Nächte. Schichtkleidung und geeignete Ausrüstung sind unerlässlich, um sicher und bequem zu bleiben.\n🥾 Körperliche Anstrengung — Ein gleichmäßiges mehrtägiges Trekking. Kein Klettern, aber die Höhenmeter können körperlich anspruchsvoll sein. Eine gute Grundfitness ist hilfreich, besonders am Gipfeltag.',
    },
    {
      heading: '💡 Wie Sie während der Kilimandscharo-Besteigung sicher bleiben',
      body: 'Hier ist, was Sie als Kletternder tun können, um Ihre Sicherheit zu verbessern:\n🕒 Lassen Sie sich Zeit: Hetzen Sie nicht — „Pole Pole" (langsam, langsam) ist mehr als ein Sprichwort, es ist eine Sicherheitsregel.\n💧 Trinken und essen Sie ausreichend: Ihr Körper braucht in der Höhe Treibstoff und Wasser.\n📋 Wählen Sie die richtige Route: Entscheiden Sie sich für längere Routen, damit sich Ihr Körper anpassen kann.\n🧳 Packen Sie Ihren Rucksack gut: Die richtige Ausrüstung verhindert Kälteverletzungen und Erschöpfung.\n🩺 Seien Sie ehrlich über Ihre Symptome: Informieren Sie Ihren Guide sofort, wenn Sie sich nicht gut fühlen.\n🧠 Bereiten Sie sich mental vor: Eine positive Einstellung hilft, besonders während des schwierigen letzten Anstiegs zum Gipfel.',
    },
    {
      heading: '🧍 Alleinreisende Kletternde und Sicherheit',
      body: 'Alleinreisende Kletternde werden vollständig von ihrem persönlichen Guide und Team unterstützt. Auch wenn Sie allein trekken, sind Sie nie ohne Begleitung, Betreuung und Notfallunterstützung.',
    },
    {
      heading: '👨‍👩‍👧‍👦 Ist es sicher für Frauen und ältere Trekker?',
      body: 'Ja. Der Kilimandscharo ist ein einladender Berg für Reisende, ältere Kletternde und sogar Teenager (Mindestalter von 10 Jahren gemäß Parkregeln erlaubt). Unser Team sorgt dafür, dass sich jeder, unabhängig von Alter oder Geschlecht, wohl und sicher fühlt.',
    },
    {
      heading: '🔎 Einen sicheren Veranstalter wählen: Worauf Sie achten sollten',
      body: 'Nicht alle Veranstalter am Kilimandscharo sind gleich. Sicherheit sollte immer Vorrang vor dem Preis haben. Das sollte ein sicherer und ethischer Veranstalter bieten: lizenzierte und erfahrene Guides; transparente Evakuierungspläne; faire Behandlung der Träger (achten Sie auf die KPAP-Zugehörigkeit); sauberes Wasser, nahrhafte Mahlzeiten und gute Hygiene; verantwortungsvolle Kunden-Guide-Verhältnisse. Asili Climbing Kilimanjaro befolgt jede dieser Sicherheitspraktiken — und noch viel mehr.',
    },
    {
      heading: '🗓️ Was ist die sicherste Zeit, um den Kilimandscharo zu besteigen?',
      body: 'Die zwei trockensten und stabilsten Wetterfenster sind: Januar-März (kühler, weniger Andrang) und Juni-Oktober (Trockenzeit und beliebt). Vermeiden Sie April-Mai und November, wenn Niederschläge das Risiko rutschiger Pfade und Witterungsexposition erhöhen.',
    },
    {
      heading: '📣 Die letzten Worte unserer erfahrenen Guides',
      body: '„Wir sagen immer: \'Der Gipfel ist optional — Sicherheit ist es nicht.\' Der Kilimandscharo ist kein Rennen. Mit dem richtigen Plan, dem richtigen Team und Respekt vor dem Berg können Sie ein sicheres und unvergessliches Abenteuer erleben." — Guide Daudi, 158-facher Gipfelführer bei Asili',
    },
    {
      heading: '🎒 Bereit, sicher mit Asili zu klettern?',
      body: '👉 Mit fachkundiger Planung, ehrlicher Begleitung und einem engagierten Sicherheitsteam an Ihrer Seite kann Ihre Kilimandscharo-Besteigung das Abenteuer Ihres Lebens werden — vollkommen sicher verwirklicht. Kontaktieren Sie Asili Climbing Kilimanjaro, um mehr zu erfahren oder mit der Planung zu beginnen.',
    },
  ],
}

const gettingToKilimanjaroDe: DetailArticleDe = {
  slug: 'getting-to-kilimanjaro',
  seoTitle: 'Anreise zum Kilimandscharo | Reiseführer zum höchsten Gipfel Tansanias',
  seoDescription: 'Alles, was Sie über die Anreise zum Kilimandscharo wissen müssen: Flüge, Flughäfen, Visa und Checkliste vor der Ankunft.',
  heroTitle: 'Anreise zum Kilimandscharo: Ihr Reiseführer zum höchsten Gipfel Tansanias',
  heroImage: {src: '/images/articles/getting-to-hero.jpg', alt: 'KLM-Flugzeug fliegt am blauen Himmel'},
  intro:
    'Bevor Sie Ihr Trekking zum Dach Afrikas beginnen, müssen Sie zunächst dorthin gelangen — und zu verstehen, wie man den Kilimandscharo erreicht, ist ein wesentlicher Teil Ihrer Planung. Ob Sie aus den USA, Europa, Asien oder anderswo auf der Welt kommen, dieser Leitfaden hilft Ihnen, Ihre Reise entspannt zu meistern. Hier ist alles, was Sie über die Anreise zum Kilimandscharo wissen müssen.',
  sections: [
    {
      heading: '🌍 Wo liegt der Kilimandscharo?',
      body: 'Der Kilimandscharo liegt im Norden Tansanias, nahe der Grenze zu Kenia. Die nächstgelegene größere Stadt ist Moshi, mit Arusha als weiterer Basis in der Nähe, besonders wenn Sie Ihre Besteigung mit einer Safari kombinieren. Die meisten Treks beginnen mit einem Transfer von einer dieser Städte zu den verschiedenen Toren des Berges.',
    },
    {
      heading: '✈️ Der beste Flughafen für Kilimandscharo-Besteigungen',
      body: 'Der Kilimanjaro International Airport (JRO) ist der Hauptflughafen für Kletternde. Auf halbem Weg zwischen Arusha und Moshi gelegen, ist der JRO nur 45-60 Autominuten von beiden Städten entfernt. IATA-Code: JRO. Vollständiger Name: Kilimanjaro International Airport. Transfers: Die meisten Veranstalter bieten einen Flughafenabholdienst an.\nDirektflüge zum JRO: Sie können von großen Städten wie Amsterdam (KLM Royal Dutch Airlines), Doha (Qatar Airways), Istanbul (Turkish Airlines), Addis Abeba (Ethiopian Airlines), Nairobi (Kenya Airways) und Daressalam (lokale Anschlussflüge) fliegen. Wenn Sie aus den USA, dem Vereinigten Königreich, Kanada oder Australien kommen, haben Sie in der Regel einen Zwischenstopp in Europa oder im Nahen Osten, bevor Sie in Tansania ankommen.',
    },
    {
      heading: '🛬 Alternative Flughäfen',
      body: 'Wenn Flüge zum JRO begrenzt oder teuer sind, gibt es zwei Alternativen:\n1. Julius Nyerere International Airport (DAR) – Daressalam: der größte internationale Flughafen Tansanias. Erfordert einen Inlandsflug zum Kilimandscharo oder eine über 10-stündige Autofahrt. Inlandsfluggesellschaften: Air Tanzania, Precision Air und Coastal Aviation.\n2. Jomo Kenyatta International Airport (NBO) – Nairobi, Kenia: ein häufiges Drehkreuz mit mehr internationalen Flügen. Nehmen Sie einen kurzen Anschlussflug zum JRO (1 Stunde) oder fahren Sie über einen Grenzübergang (achten Sie auf Visabestimmungen). Der Flug wird gegenüber der Landroute wegen Zeit und Komfort empfohlen.',
    },
    {
      heading: '🚌 Landtransport zum Kilimandscharo',
      body: 'Wenn Sie sich bereits in Ostafrika befinden, können Sie den Kilimandscharo per Bus oder Shuttle von Nairobi nach Arusha oder Moshi erreichen (ca. 6-8 Stunden), oder über private Transfers oder von Ihrer Trekkingagentur organisierte Taxis. Hinweis: Ein Gelbfieberzertifikat könnte erforderlich sein, wenn Sie durch Kenia reisen.',
    },
    {
      heading: '🛂 Einreisebestimmungen: Vergessen Sie Ihr Visum nicht',
      body: 'Die meisten Reisenden benötigen ein Touristenvisum für die Einreise nach Tansania. Kosten: 50 $ (oder 100 $ für US-Bürger). Wo erhältlich: online über das eVisa-Portal Tansanias beantragen oder bei Ankunft am JRO erhalten. Passgültigkeit: mindestens 6 Monate ab Einreisedatum.',
    },
    {
      heading: '🧳 Checkliste vor der Ankunft',
      body: 'Stellen Sie vor der Abreise sicher, dass Sie Folgendes haben: einen gültigen Reisepass und ein gültiges Visum, ein Gelbfieberzertifikat (falls erforderlich), eine Reiseversicherung (mit Evakuierungsschutz), gebuchte internationale Flüge zum JRO (oder Anschlussflüge), einen mit Ihrem Kilimandscharo-Veranstalter organisierten Flughafentransfer, und einen Ankunftspuffer (kommen Sie mindestens 1 Tag vor Ihrer Besteigung an).',
    },
    {
      heading: '🏨 Wo Sie vor Ihrer Besteigung übernachten',
      body: 'Die meisten Kletternden übernachten in Moshi oder Arusha in der Nacht vor Beginn des Treks. Beide Städte bieten komfortable Hotels und Lodges, Ausrüstungsverleihgeschäfte, letzte Einkäufe (Snacks, SIM-Karten usw.) sowie kulturelle Aktivitäten und Besuche von Kaffeeplantagen. Tipp: Kommen Sie mindestens einen vollen Tag im Voraus an, um sich auszuruhen, Ihre Guides kennenzulernen und eine letzte Ausrüstungskontrolle vor dem Trek durchzuführen.',
    },
    {
      heading: '🧭 Abschließende Worte',
      body: 'Die Anreise zum Kilimandscharo ist einfacher, als Sie denken — mit einem gut angebundenen internationalen Flughafen und zuverlässiger Unterstützung landen Sie nur eine kurze Fahrt von Ihrem Abenteuer entfernt. Ob Sie allein oder in der Gruppe reisen, eine frühe und gut vorbereitete Ankunft stellt sicher, dass Sie Ihre Besteigung entspannt und bereit beginnen. Mit Asili Climbing Kilimanjaro kümmern wir uns um Ihre Ankunft, Ihre Transfers und Ihre Logistik — damit Sie sich auf die bevorstehende Reise konzentrieren können.',
    },
  ],
}

const mountKilimanjaroFactsDe: DetailArticleDe = {
  slug: 'mount-kilimanjaro-facts',
  seoTitle: 'Fakten über den Kilimandscharo | Das ikonische Dach Afrikas enthüllt',
  seoDescription: 'Faszinierende Fakten über den Kilimandscharo: seine vulkanischen Kegel, seine fünf Klimazonen, seine Gletscher, seine Träger und was das Dach Afrikas so ikonisch macht.',
  heroTitle: 'Fakten über den Kilimandscharo: Das ikonische Dach Afrikas enthüllt',
  heroImage: {src: '/images/contact/hero.webp', alt: 'Der Kilimandscharo über den Akazien der afrikanischen Savanne'},
  intro:
    'Der Kilimandscharo ist weit mehr als nur eine Besteigung — er ist ein Naturwunder, eine kulturelle Ikone und ein kraftvolles Symbol des Abenteuers. Bekannt als „Dach Afrikas", zieht der Kilimandscharo jedes Jahr Zehntausende von Trekkern an. Aber was wissen Sie wirklich über diesen legendären Berg? Hier sind einige der faszinierendsten, überraschendsten und wichtigsten Fakten über den Kilimandscharo — die Ihnen helfen sollen, jede Etappe Ihrer Reise zu schätzen.',
  sections: [
    {
      heading: '🌍 1. Der Kilimandscharo ist Afrikas höchster Berg',
      body: 'Höhe: 5.895 Meter über dem Meeresspiegel. Weltweiter Rang: Er ist der höchste freistehende Berg der Welt — nicht Teil eines Gebirgszugs. Lage: Norden Tansanias, nahe der Grenze zu Kenia.',
    },
    {
      heading: '🧊 2. Er ist ein Vulkan — genauer gesagt drei Vulkane',
      body: 'Der Kilimandscharo ist kein einzelner Gipfel — er besteht aus drei vulkanischen Kegeln: Kibo (der höchste und einzige ruhende Kegel, wo der Gipfel erreicht wird), Mawenzi (zerklüftet und spektakulär, nicht bis zur Spitze besteigbar), und Shira (größtenteils erodiert, aber noch auf den westlichen Routen sichtbar). Kibo gilt als ruhend, nicht erloschen, was bedeutet, dass er wieder ausbrechen könnte — obwohl seine letzte größere Aktivität über 360.000 Jahre zurückliegt.',
    },
    {
      heading: '🌦️ 3. Sie durchqueren fünf Klimazonen',
      body: 'Den Kilimandscharo zu besteigen ist, als würde man vom Äquator bis zur Arktis wandern. Der Berg umfasst fünf ökologische Zonen, jede mit ihrem eigenen Klima, ihrer eigenen Tierwelt und ihren eigenen einzigartigen Landschaften: Anbauzone (800-1.800 m) — Ackerland, Bananen und Dörfer. Regenwaldzone (1.800-2.800 m) — üppiger Dschungel mit Affen und exotischen Vögeln. Heide-/Moorlandzone (2.800-4.000 m) — Riesen-Lobelien und wellige Heidelandschaften. Alpine Wüstenzone (4.000-5.000 m) — trocken, felsig und fast lebensfrei. Arktische Zone (5.000-5.895 m) — Gletscher, eisige Temperaturen und dünne Luft.',
    },
    {
      heading: '🧗‍♀️ 4. Es ist keine technische Kletterei erforderlich',
      body: 'Trotz seiner beeindruckenden Höhe ist der Kilimandscharo ein Trekking-Gipfel, kein Bergsteiger-Gipfel. Das bedeutet, dass keine Seile, Eispickel oder technische Ausrüstung erforderlich sind. Er ist für jeden mit guter körperlicher Fitness und Entschlossenheit zugänglich. Der Erfolg hängt mehr von der Höhenanpassung als von Kletterfähigkeiten ab.',
    },
    {
      heading: '⏳ 5. Die meisten Besteigungen dauern 6-9 Tage',
      body: 'Die besten Besteigungen lassen Ihrem Körper Zeit zur Akklimatisierung. Zu den beliebtesten Routen gehören: Machame-Route (7 Tage) — landschaftlich reizvoll und vielfältig. Lemosho-Route (8-9 Tage) — ausgezeichnet für die Akklimatisierung und weniger Andrang. Marangu-Route (5-6 Tage) — die einzige mit Hüttenübernachtung. Northern Circuit (9 Tage) — die längste und ruhigste für die Akklimatisierung. Rongai oder Umbwe — für alle, die einzigartige Routen suchen.',
    },
    {
      heading: '🌕 6. Sie können bei Vollmond besteigen',
      body: 'Ein Trek bei Vollmond beleuchtet den schneebedeckten Gipfel und bietet ein magisches, surreales Erlebnis. Viele Kletternde planen ihre Gipfelnacht so, dass sie mit dem Vollmond zusammenfällt, für bessere Sicht und unvergessliche Fotos.',
    },
    {
      heading: '🎒 7. Etwa 30.000 Menschen versuchen die Besteigung jedes Jahr',
      body: 'Der Kilimandscharo zieht Abenteurer aus aller Welt an. Etwa 65-75 % der Kletternden erreichen den Gipfel, abhängig von der Route und der Akklimatisierungszeit. Die Wahl einer längeren Route erhöht Ihre Erfolgschancen erheblich.',
    },
    {
      heading: '💨 8. Höhenkrankheit ist die größte Herausforderung',
      body: 'Die Luft wird beim Aufstieg dünner, und viele Trekker verspüren die Auswirkungen der akuten Höhenkrankheit (AMS). Symptome können Kopfschmerzen, Übelkeit und Erschöpfung umfassen. Ein langsames Tempo, Hydrierung und Ruhetage sind entscheidend, um das Risiko zu verringern.',
    },
    {
      heading: '🍲 9. Sie werden auf dem Berg gut essen',
      body: 'Vergessen Sie fade Überlebensrationen — die meisten Kilimandscharo-Treks umfassen warme Mahlzeiten, Snacks und sogar frisches Obst. Ein guter Veranstalter wie Asili Climbing Kilimanjaro sorgt dafür, dass Sie jeden Tag mit ausgewogenen, energiespendenden Mahlzeiten gut ernährt werden.',
    },
    {
      heading: '🙌 10. Sie werden nicht allein klettern — Lernen Sie die Träger kennen',
      body: 'Jeder Trekker wird von einem Team unterstützt, das Guides (zertifiziert und erfahren), Träger (die Ihre Ausrüstung tragen und das Lager aufbauen) und Köche (die die Mahlzeiten zubereiten) umfassen kann. Ihre Besteigung ist nur dank dieser unermüdlichen lokalen Helden möglich. Verantwortungsbewusste Agenturen arbeiten mit dem KPAP (Kilimanjaro Porters Assistance Project) zusammen, um faire Behandlung und Löhne zu gewährleisten.',
    },
    {
      heading: '🧊 11. Die Gletscher des Kilimandscharo verschwinden',
      body: 'Der Kilimandscharo besaß einst gewaltige Gletscher nahe dem Gipfel. Aufgrund des Klimawandels schrumpfen diese Eisfelder rapide — einige Experten schätzen, dass sie innerhalb weniger Jahrzehnte vollständig verschwinden könnten. Sie jetzt zu sehen, ist wirklich ein einmaliges Erlebnis.',
    },
    {
      heading: '📸 12. Das Uhuru-Peak-Schild ist ikonisch',
      body: 'Uhuru Peak (was auf Suaheli „Gipfel der Freiheit" bedeutet) ist der höchste Punkt des Kraterrands von Kibo. Das grün-gelbe Holzschild zu erreichen, ist ein Moment des Stolzes und der Emotion für jeden Trekker — und ja, Sie werden definitiv ein Foto wollen! Bereit, es selbst zu erleben? Lassen Sie sich von Asili Climbing Kilimanjaro sicher und verantwortungsvoll zum Gipfel führen — mit fachkundiger Planung, lokalem Wissen und unvergesslichen Erinnerungen.',
    },
  ],
}

const typicalDayOnKilimanjaroDe: DetailArticleDe = {
  slug: 'typical-day-on-kilimanjaro',
  seoTitle: 'Ein typischer Tag am Kilimandscharo | Was Sie jeden Tag erwarten können',
  seoDescription: 'Wie sieht ein typischer Tag bei der Besteigung des Kilimandscharo aus? Vom Wecken bis zur Gipfelnacht — hier ist der tägliche Rhythmus Ihres Treks.',
  heroTitle: 'Ein typischer Tag am Kilimandscharo: Was Sie jeden Tag beim Besteigen von Afrikas höchstem Berg erwarten können',
  heroImage: {src: '/images/articles/typical-day-hero.webp', alt: 'Aufgebaute Zelte bei Barafu Camp am Kilimandscharo'},
  intro:
    'Die Besteigung des Kilimandscharo ist ein unvergessliches Erlebnis — aber sie ist auch strukturiert, sicher und überraschend komfortabel, wenn sie gut geplant ist. Ob Sie sich fragen, wie Ihre Tage ablaufen werden, wie viel Sie wandern werden oder wann Sie sich ausruhen werden — diese Seite gibt Ihnen einen konkreten Einblick in einen typischen Tag am Kilimandscharo mit Asili Climbing Kilimanjaro. Wir gehen dies von Sonnenaufgang bis Sonnenuntergang durch — und darüber hinaus.',
  sections: [
    {
      heading: '☀️ Die Morgenstunden auf dem Berg',
      body: '6:00-6:30 Uhr: Wecken — Ihr Tag beginnt mit einem sanften Klopfen an Ihrem Zelt und einem fröhlichen „Guten Morgen" von Ihrem Lagerteam. Sie bringen Ihnen eine Schüssel warmes Wasser zum Erfrischen und ein warmes Getränk (normalerweise Tee, Kaffee oder heiße Schokolade), um Ihre Hände und Ihren Geist zu wärmen.\n7:00-7:30 Uhr: Frühstück — Energie tanken ist unerlässlich. Das Frühstück wird im Speisezelt serviert und umfasst normalerweise Brei oder Haferflocken, Eier (gebraten, gerührt oder gekocht), Toast mit Marmelade, Erdnussbutter oder Honig, frisches Obst und Saft sowie Tee und Kaffee. Gegen Ende der Woche wird das Frühstück zu einem der Höhepunkte des Tages!',
    },
    {
      heading: '🥾 Die Trekking-Zeit',
      body: '8:00 Uhr: Beginn der Tageswanderung. Nach dem Frühstück geben Ihre Guides ein kurzes Briefing — Einzelheiten zur Route, geschätzte Gehzeit und Wettervorhersage. Dann geht es auf den Pfad. Die tägliche Wanderung variiert je nach Route und Höhe. Sie werden im Allgemeinen 4-7 Stunden pro Tag gehen, in einem langsamen, gleichmäßigen Tempo („Pole Pole" — Suaheli für „langsam, langsam"), mit häufigen Pausen für Wasser, Snacks und Fotos, immer begleitet von Ihrem Guide. Die Vormittagspausen umfassen oft leichte Snacks oder Obst, um Ihre Energie aufrechtzuerhalten.',
    },
    {
      heading: '🏕️ Mittagszeit und Mittagspause',
      body: 'Je nach Route und Gelände kann das Mittagessen an einem ausgewiesenen Picknickplatz entlang des Pfades oder im nächsten Camp serviert werden. Ein typisches Mittagessen umfasst Gemüseeintopf oder Nudeln, Reis oder Kartoffeln, Avocado oder Salate sowie Fruchtsaft und Tee. Nach dem Mittagessen und einer kurzen Pause gehen Sie noch einige weitere Stunden, oder Sie entspannen sich im Camp, wenn das Trekking des Tages beendet ist.',
    },
    {
      heading: '🌄 Ankunft im Camp',
      body: 'Sobald Sie in Ihrem nächsten Camp ankommen, haben Ihre Träger bereits Ihr Zelt, Ihre Nachtausrüstung und den Essbereich aufgebaut. Sie werden mit warmem Wasser zum Waschen und Snacks wie Popcorn oder Keksen mit heißem Tee oder Kaffee empfangen. Es ist Zeit, sich zu entspannen: in Ihr Tagebuch schreiben, die Aussicht genießen, sich mit anderen Kletternden unterhalten, ausruhen und hydrieren.',
    },
    {
      heading: '🍽️ Abendessen und tägliches Briefing',
      body: '18:00-19:00 Uhr: Das Abendessen wird serviert. Das Abendessen ist eine reichhaltige, warme Mahlzeit, die dazu gedacht ist, Ihre Energie wiederherzustellen. Erwarten Sie eine Suppe (immer beliebt), ein Hauptgericht (Reis, Fleisch, Gemüse oder Nudeln), ein Stück Obst als Nachtisch und einen Ingwer- oder Kräutertee zur Förderung der Verdauung und des Schlafs. Ihre Guides führen auch ein kurzes Abendbriefing durch, um zu erklären, was Sie erwartet, wie Ihre Akklimatisierung verläuft und geben Ratschläge zu Ausrüstung oder Kleidung für den nächsten Tag.',
    },
    {
      heading: '🌙 Schlafen unter den Sternen',
      body: '20:00-21:00 Uhr: Lichter aus. Mit wenig bis gar keiner Lichtverschmutzung ist der Nachthimmel des Kilimandscharo atemberaubend. Die meisten Kletternden gehen früh ins Bett. Ihr Schlafsack hält Sie warm — auch in großer Höhe. Die Nächte sind ruhig, kalt und friedlich. Manche Nächte können durch Wind oder ein natürliches Bedürfnis unterbrochen werden, aber die meisten Trekker schlafen dank eines ganzen Tages des Wanderns tief.',
    },
    {
      heading: '⛰️ Die Gipfelnacht: Die Ausnahme',
      body: 'Der einzige Tag, der die Routine durchbricht, ist die Gipfelnacht. Sie werden gegen 23:00 Uhr oder Mitternacht geweckt, ziehen sich in warmen Schichten an und beginnen den letzten Anstieg zum Gipfel im Mondlicht. Es ist ein langsamer und anspruchsvoller Aufstieg — aber Uhuru Peak bei Sonnenaufgang zu erreichen, macht alles lohnenswert. Nach dem Gipfel steigen Sie zum Basislager ab, um sich auszuruhen, bevor Sie am nächsten Tag den Berg weiter hinabsteigen.',
    },
    {
      heading: '🔄 Zusammenfassung des täglichen Rhythmus',
      table: {
        columns: ['Uhrzeit', 'Aktivität'],
        rows: [
          ['6:00', 'Wecken + warme Getränke'],
          ['7:00', 'Frühstück'],
          ['8:00', 'Beginn des Treks'],
          ['12:30-13:30', 'Mittagessen und Rast'],
          ['15:00-16:00', 'Ankunft im nächsten Camp'],
          ['16:30', 'Tee und Snacks'],
          ['18:00', 'Abendessen und Briefing des Guides'],
          ['20:00-21:00', 'Schlaf'],
        ],
      },
    },
    {
      heading: '💬 Abschließende Gedanken',
      body: 'Die Besteigung des Kilimandscharo ist eine Reise des Rhythmus, der Einfachheit und der Natur. Jeder Tag folgt einem vorhersehbaren und wohlwollenden Ablauf — mit viel Ruhe, nahrhaftem Essen, fachkundiger Begleitung und Zeit, den Berg zu schätzen. Mit Asili Climbing Kilimanjaro wandern Sie nicht nur zu einem Gipfel — Sie umarmen einen Lebensstil, wenn auch nur für ein paar Tage. Und am Ende werden Sie sich nicht nur erfüllt fühlen — Sie werden sich verwandelt fühlen.',
    },
  ],
}

const kilimanjaroFullmoonClimbDe: DetailArticleDe = {
  slug: 'kilimanjaro-fullmoon-climb',
  seoTitle: 'Kilimandscharo-Besteigung bei Vollmond | Ein magisches Gipfelerlebnis',
  seoDescription: 'Erreichen Sie den Gipfel des Kilimandscharo unter dem Vollmond. Entdecken Sie die besten Routen, Zeitpunkte und Vorbereitungstipps für eine magische Vollmond-Besteigung.',
  heroTitle: 'Kilimandscharo-Besteigung bei Vollmond: Ein magisches Gipfelerlebnis',
  heroImage: {src: '/images/articles/fullmoon-hero.jpg', alt: 'Beleuchtete Zelte in einem Kilimandscharo-Camp bei Nacht'},
  intro:
    'Den Kilimandscharo zu besteigen ist bereits ein einmaliges Abenteuer — aber dies unter dem Licht des Vollmonds zu tun? Das ist ein Erlebnis ganz anderer Art. Die Kilimandscharo-Besteigung bei Vollmond bietet Trekkern eine seltene und unvergessliche Gelegenheit, Afrikas höchsten Gipfel mit dem Schein des Mondes zu erreichen, der den Weg erhellt. Bei Asili Climbing Kilimanjaro bieten wir sorgfältig geplante Vollmond-Besteigungen für alle, die ihr Abenteuer noch besonderer — und ein wenig magischer — gestalten möchten.',
  sections: [
    {
      heading: '🌙 Warum den Kilimandscharo bei Vollmond besteigen?',
      body: 'Bei einer Vollmond-Besteigung geht es nicht nur um die Aussicht. Es geht darum, wie das Mondlicht das Erlebnis verwandelt — besonders während Ihrer letzten Gipfelnacht. Das macht sie besonders: Natürliche Beleuchtung — der schneebedeckte Gipfel schimmert im Mondlicht und verringert den Bedarf an Stirnlampen während des letzten Aufstiegs. Größere Sichtbarkeit — Sie können Ihre Umgebung auch um Mitternacht klar sehen, was eine surreale, fast traumhafte Atmosphäre schafft. Atemberaubende Aussichten — Sie beobachten die Landschaft des Kilimandscharo in sanftes silbernes Licht getaucht, etwas, das nur sehr wenige Menschen zu sehen das Glück haben. Spektakulärer Gipfel-Sonnenaufgang — Uhuru Peak genau in dem Moment zu erreichen, in dem die Sonne über einem mondbeschienenen Himmel aufgeht, ist eine Erinnerung, die Sie ein Leben lang bewahren werden.',
    },
    {
      heading: '📆 Wann ist die beste Zeit für eine Vollmond-Besteigung?',
      body: 'Der Vollmond tritt einmal im Monat auf, und der beste Zeitpunkt, um Ihr Trekking daran auszurichten, ist es, den Gipfel in der Vollmondnacht oder einen Tag davor oder danach zu erreichen. Dies bietet Ihnen maximale Mondlicht-Exposition während des wichtigsten Teils Ihrer Reise — der Gipfelnacht. Kommende Vollmond-Termine (für 2026): 13. Januar, 12. Februar, 14. März, 12. April, 11. Mai (die Termine ändern sich jedes Jahr — kontaktieren Sie uns für aktualisierte Kalender der Vollmond-Besteigungen). Um in einer Vollmondnacht den Gipfel zu erreichen, müssen Sie Ihre Besteigung 6-8 Tage vor dem Vollmond beginnen, je nach gewählter Route.',
    },
    {
      heading: '🥾 Beste Routen für eine Vollmond-Besteigung',
      body: 'Alle wichtigen Kilimandscharo-Routen können um den Vollmond herum geplant werden, aber einige eignen sich besser für diese Art von Erlebnis. Empfohlene Routen: Machame-Route (7 Tage) — eine der landschaftlich reizvollsten und beliebtesten Routen mit ausgezeichneter Akklimatisierung. Lemosho-Route (8 Tage) — bietet einen ruhigeren Ansatz und Panoramablicke. Rongai-Route (7 Tage) — ideal für alle, die eine weniger frequentierte Route und einen Vollmond-Gipfel von Norden suchen. Jede dieser Optionen bietet Ihnen das richtige Tempo und die nötige Flexibilität, um sich mit dem Vollmond abzustimmen und dabei eine sichere und angenehme Besteigung zu gewährleisten.',
    },
    {
      heading: '💡 Ist eine Vollmond-Besteigung das Richtige für Sie?',
      body: 'Eine Vollmond-Besteigung ist perfekt für Fotografen und visuelle Geschichtenerzähler, romantische Abenteurer (ideal für Paare!), alle, die eine spirituelle oder symbolische Reise suchen, und jeden, der sein Kilimandscharo-Erlebnis erheben möchte — buchstäblich und emotional. Allerdings können Vollmond-Besteigungen auch beliebter sein, besonders während trockener Monate wie Juli-Oktober und Januar-März. Eine frühzeitige Buchung wird dringend empfohlen.',
    },
    {
      heading: '🎒 Wie Sie sich auf ein Vollmond-Trekking vorbereiten',
      body: 'Abgesehen vom richtigen Timing Ihrer Besteigung gibt es keine großen Unterschiede in der Vorbereitung. Wir empfehlen jedoch, Schichten zu tragen (auch im Mondlicht ist die Gipfelnacht kalt!), eine Stirnlampe mitzubringen (Sie benötigen sie möglicherweise weniger, aber sie bleibt für die Sicherheit unerlässlich), und frühzeitig zu buchen (begrenzte Genehmigungen und Campingplätze sind für Vollmond-Termine schnell ausgebucht). Bei Asili Climbing Kilimanjaro helfen wir Ihnen, den perfekten Reiseverlauf zu planen, um sich mit dem Mondzyklus abzustimmen, ohne Ihre Akklimatisierung zu überstürzen oder die Sicherheit zu gefährden.',
    },
    {
      heading: '🌍 Eine tiefere Verbindung zum Berg',
      body: 'Es gibt etwas zutiefst Demütigendes daran, mitten in der Nacht auf dem Kilimandscharo zu stehen, nur vom Mond und den Sternen beleuchtet, während sich der Horizont mit den ersten Schimmern des Morgengrauens erhellt. Es ist ruhig. Es ist kraftvoll. Es ist etwas, das Worte nicht vollständig einfangen können — aber das Ihr Herz nie vergessen wird.',
    },
    {
      heading: '🚀 Bereit für die Vollmond-Besteigung Ihres Lebens?',
      body: 'Lassen Sie uns Ihnen helfen, dies Wirklichkeit werden zu lassen. Ob Sie allein, zu zweit oder in der Gruppe reisen, unsere Kilimandscharo-Besteigungen bei Vollmond sind für ein einmaliges Erlebnis konzipiert — mit erfahrenen Guides, persönlicher Begleitung und tiefem Respekt vor dem Berg. Kontaktieren Sie uns noch heute, um Ihren Platz bei der nächsten Vollmond-Besteigung mit Asili Climbing Kilimanjaro zu buchen.',
    },
  ],
}

const kilimanjaroAltitudeSicknessDe: DetailArticleDe = {
  slug: 'kilimanjaro-altitude-sickness',
  seoTitle: 'Höhenkrankheit am Kilimandscharo | Was Sie vor der Besteigung wissen müssen',
  seoDescription: 'Verstehen Sie die akute Höhenkrankheit (AMS) am Kilimandscharo: Symptome, Schweregrade, Prävention und wie Asili Climbing Kilimanjaro Ihre Sicherheit gewährleistet.',
  heroTitle: 'Höhenkrankheit am Kilimandscharo: Was Sie vor der Besteigung wissen müssen',
  heroImage: {src: '/images/articles/altitude-sickness-hero.jpg', alt: 'Erschöpfter Kletterer ruht sich auf Felsen neben einem Rucksack aus'},
  intro:
    'Die Besteigung des Kilimandscharo ist ein unvergessliches Abenteuer — aber sie ist auch eine Höhenherausforderung. Eines der wichtigsten Dinge, die Sie vor Beginn Ihres Treks verstehen sollten, ist die Höhenkrankheit, auch bekannt als akute Höhenkrankheit (AMS). Bei Asili Climbing Kilimanjaro ist Ihre Sicherheit unsere höchste Priorität. Das bedeutet, Kletternde über die Höhenrisiken aufzuklären und wie man sich mental und körperlich auf die Reise zum Gipfel vorbereitet.',
  sections: [
    {
      heading: '🌬️ Was ist Höhenkrankheit?',
      body: 'Höhenkrankheit tritt auf, wenn sich Ihr Körper nicht gut an die niedrigeren Sauerstoffwerte in großer Höhe anpasst. Der Kilimandscharo gipfelt auf 5.895 Metern — und die meisten Menschen spüren Höheneffekte oberhalb von 2.500 Metern. Wenn Sie zu schnell aufsteigen, hat Ihr Körper Schwierigkeiten, sich anzupassen. Das Ergebnis kann von leichten Kopfschmerzen bis zu schweren Komplikationen reichen, wenn es ignoriert wird.',
    },
    {
      heading: '🚦 Drei Stufen der Höhenkrankheit',
      body: '🟢 Leichte AMS — Kopfschmerzen, Erschöpfung, Übelkeit, Appetitlosigkeit, Schlafschwierigkeiten. Häufig und beherrschbar; die meisten Kletternde verspüren ein gewisses Maß davon.\n🟠 Mittelschwere AMS — starke Kopfschmerzen, Schwindel, Erbrechen, Atemnot in Ruhe. Erfordert medizinische Aufmerksamkeit und oft einen Abstieg.\n🔴 Schwere AMS (HAPE/HACE) — Höhenlungenödem (Flüssigkeit in der Lunge), Höhenhirnödem (Gehirnschwellung), Verwirrtheit, Gehunfähigkeit, blaue Lippen/Fingerspitzen, extreme Erschöpfung. Dies ist ein medizinischer Notfall, der einen sofortigen Abstieg und professionelle Behandlung erfordert.',
    },
    {
      heading: '⏳ Wann setzt sie ein?',
      body: 'Symptome treten im Allgemeinen innerhalb von 6-24 Stunden nach Ankunft in größerer Höhe auf. Deshalb ist eine schrittweise Akklimatisierung unerlässlich. Langsamere Besteigungen bedeuten weniger Symptome und höhere Gipfelerfolgsquoten.',
    },
    {
      heading: '✅ Wie wir Ihnen helfen, Höhenkrankheit vorzubeugen',
      body: 'Ihre Gesundheit ist unsere höchste Priorität. Unsere Guides sind in der Höhenreaktion geschult und führen tägliche Gesundheitsüberwachung mittels Pulsoximetern durch, Notfallsauerstoffflaschen und Erste-Hilfe-Sets, tragbare Tragen für Notfallevakuierung, und vorbereitete Evakuierungspläne mit Unterstützung lokaler Rettungsdienste. Sie werden auch täglich über Ihren Zustand informiert, und wir passen das Tempo oder die Route bei Bedarf an.',
    },
    {
      heading: '🥾 Wie die Höhe Ihre Gipfelchancen beeinflusst',
      body: 'Höhenkrankheit ist der Hauptgrund, warum Kletternde den Gipfel nicht erreichen — nicht die körperliche Fitness, nicht die Ausrüstung. Deshalb ist die Wahl der richtigen Route und einer zuverlässigen Guide-Agentur entscheidend für Ihren Erfolg. Mit guter Vorbereitung, Bewusstsein und Unterstützung können Sie Uhuru Peak sicher erreichen und die atemberaubenden Ausblicke vom Dach Afrikas genießen.',
    },
    {
      heading: '🌄 Abschließender Gedanke: Fürchten Sie die Höhe nicht — respektieren Sie sie',
      body: 'Höhenkrankheit ist nichts, wovor man sich fürchten muss — aber sie ist etwas, das man antizipieren sollte. Mit Asili Climbing Kilimanjaro sind Sie in guten Händen. Wir führen Sie nicht nur zum Gipfel — wir helfen Ihnen, sicher dorthin zu gelangen. Haben Sie weitere Fragen zur Akklimatisierung, den Sauerstoffwerten oder den Routenoptionen? Wir sind hier, um Ihnen zu helfen, eine sichere, erfolgreiche und transformative Besteigung zu planen.',
    },
  ],
}

const kilimanjaroFoodDe: DetailArticleDe = {
  slug: 'kilimanjaro-food',
  seoTitle: 'Essen am Kilimandscharo | Was Sie auf dem Berg essen werden',
  seoDescription: 'Welches Essen werden Sie bei der Besteigung des Kilimandscharo essen? Mahlzeiten, Ernährungsoptionen, Wassersicherheit und Snacks — alles über das Essen auf dem Berg.',
  heroTitle: 'Essen am Kilimandscharo: Was Sie auf dem Berg essen werden',
  heroImage: {src: '/images/articles/food-hero.webp', alt: 'Lagerküche-Mahlzeit in den Bergen bestehend aus Nudeln, Eiern und Gemüsesalat'},
  intro:
    'Die Besteigung des Kilimandscharo ist eine körperliche und mentale Herausforderung — aber mit dem richtigen Treibstoff kann Ihr Körper in großer Höhe gedeihen. Eine der häufigsten Fragen von Trekkern ist: „Welche Art von Essen werde ich am Kilimandscharo essen?" Bei Asili Climbing Kilimanjaro glauben wir, dass gutes Essen mehr als eine Notwendigkeit ist — es ist Teil des Erlebnisses. Von frischem Obst zum Frühstück bis zu warmen Suppen am Abend wird jede Mahlzeit sorgfältig zubereitet, um Sie während Ihrer gesamten Besteigung energiegeladen, zufrieden und gesund zu halten.',
  sections: [
    {
      heading: '🧑‍🍳 Frisch zubereitete Mahlzeiten in den Bergen',
      body: 'Jeder Trek mit Asili umfasst einen engagierten Bergkoch und ein Team, das täglich warme, reichhaltige Mahlzeiten in einer tragbaren Küche zubereitet. Wir transportieren frische Zutaten und kochen von Grund auf — keine gefriergetrockneten Beutel oder Dosenüberraschungen hier. Sie werden überrascht sein, wie köstlich Bergmahlzeiten sein können, sogar auf 4.000 Metern!',
    },
    {
      heading: '🍳 Was Sie erwarten können',
      body: 'Wir bevorzugen energiereiche, nahrhafte und leicht verdauliche Lebensmittel, die Ihnen helfen, die Höhe und die Kälte zu bewältigen.\n🌅 Frühstück: Brei (Mais, Hirse, Hafer), Eier (gekocht, gebraten oder als Omelett), Toast mit Marmelade, Erdnussbutter oder Honig, Pfannkuchen oder Chapati, frisches Obst (Bananen, Orangen, Mango), warme Getränke (Tee, Kaffee, heiße Schokolade).\n🥪 Mittagessen: je nach Tagesprogramm, eine Lunchbox (Sandwiches oder gegrilltes Hähnchen, gekochte Eier, Obst, Kekse oder Energieriegel, Saft oder Tee), oder eine warme Mahlzeit an kürzeren Trekkingtagen (Nudeln mit Gemüse oder Fleischsauce, Reis mit Bohnen oder Hähnchen, gedünstetes Gemüse).\n🍲 Abendessen: serviert in einem gemütlichen Speisezelt — Suppe (Gemüse, Lauch, Karotten oder Kürbis), Reis, Nudeln oder Kartoffeln, gegrilltes oder geschmortes Fleisch (Hähnchen oder Rind), gekochtes Gemüse (Kohl, Spinat, Karotten), Chapati oder Brötchen, frisches Obst als Nachtisch, Kräutertee oder heiße Schokolade.',
    },
    {
      heading: '🥗 Spezielle Ernährungsbedürfnisse? Kein Problem.',
      body: 'Ob Sie Vegetarier, Veganer, glutenintolerant sind oder spezifische Nahrungsmittelallergien haben, wir können Ihre Ernährungsbedürfnisse erfüllen. Informieren Sie uns einfach im Voraus, und unsere Köche planen entsprechend. Alle Mahlzeiten werden hygienisch zubereitet und mit sauberem Geschirr und gefiltertem Wasser serviert.',
    },
    {
      heading: '💧 Und was ist mit Trinkwasser?',
      body: 'Wir stellen während Ihres gesamten Treks sicheres, aufbereitetes Trinkwasser zur Verfügung. Das Wasser wird aus nahegelegenen Bächen gesammelt und für Ihre Sicherheit abgekocht, gefiltert oder chemisch behandelt. Sie sollten wiederverwendbare Wasserflaschen oder einen täglich nachfüllbaren Wassersack mitbringen.',
    },
    {
      heading: '🧂 Lebensmittelsicherheit und Hygiene',
      body: 'In großer Höhe schwächt sich Ihr Immunsystem leicht ab, daher ist Lebensmittelsicherheit unerlässlich. Unser Team befolgt strenge Hygieneprotokolle, darunter gründliches Waschen von Händen und Ausrüstung, Zubereitung der Mahlzeiten in einem sauberen, eigenen Küchenzelt, sicherstellen, dass Zutaten frisch und sicher gelagert sind, und Verhinderung von Kreuzkontamination.',
    },
    {
      heading: '🍫 Snacks: Bringen Sie Ihre Favoriten mit',
      body: 'Obwohl wir drei vollständige Mahlzeiten pro Tag anbieten, möchten Sie vielleicht Ihre eigenen Snacks für zusätzliche Energie zwischen den Mahlzeiten mitbringen: Energie- oder Proteinriegel, Trockenfrüchte, Studentenfutter, Elektrolyttabletten oder -pulver, harte Bonbons oder Schokolade für schnelle Zuckerzufuhr. Tipp: Die Höhe kann Ihren Appetit verringern, also bringen Sie Snacks mit, die Ihnen wirklich schmecken — auch wenn sie auf Meereshöhe banal erscheinen.',
    },
    {
      heading: '🧘 Wie Essen bei der Bewältigung der Höhe hilft',
      body: 'Die Besteigung des Kilimandscharo erfordert mehr als nur Ausdauer — sie erfordert angemessene Ernährung. Kohlenhydratreiche, fettarme Mahlzeiten helfen Ihrem Körper, sich an die niedrigeren Sauerstoffwerte anzupassen. Warme Suppen und Tees helfen auch dabei, hydriert zu bleiben und höhenbedingte Symptome wie Kopfschmerzen oder Übelkeit zu bekämpfen.',
    },
    {
      heading: '🏔️ Sich für den Gipfel ernähren',
      body: 'Jeden Tag stellen Sie Ihren Körper am Kilimandscharo auf die Probe, und was Sie essen, wirkt sich direkt auf Ihre Leistung, Ihre Stimmung und Ihren Erfolg aus. Bei Asili Climbing Kilimanjaro nehmen wir das Essen ernst — denn Ihr Gipfelerfolg hängt davon ab. Bereit, gut ernährt und sorgenfrei zu klettern? Kontaktieren Sie uns, um mehr über unsere Ernährungspläne zu erfahren oder mit ehemaligen Kletternden zu sprechen, die mit uns auf dem Dach Afrikas gespeist haben.',
    },
  ],
}

const kilimanjaroPortersDe: DetailArticleDe = {
  slug: 'kilimanjaro-porters',
  seoTitle: 'Kilimandscharo-Träger | Das schlagende Herz jeder erfolgreichen Besteigung',
  seoDescription: 'Lernen Sie die Kilimandscharo-Träger kennen, die jede Besteigung möglich machen. Erfahren Sie mehr über ethische Behandlung, KPAP, Trinkgeldtipps und wie Sie Ihre Wertschätzung zeigen können.',
  heroTitle: 'Kilimandscharo-Träger: Das schlagende Herz jeder erfolgreichen Besteigung',
  heroImage: {src: '/images/articles/porters-hero.webp', alt: 'Ein Träger transportiert Ausrüstung auf dem Kilimandscharo-Pfad'},
  intro:
    'Wenn man an die Besteigung des Kilimandscharo denkt, ist es natürlich, sich den Gipfel, die Herausforderung und die atemberaubenden Ausblicke vorzustellen. Aber hinter jedem erfolgreichen Trek steht ein Team engagierter und fleißiger Menschen, die die Reise möglich machen: die Kilimandscharo-Träger. Bei Asili Climbing Kilimanjaro ehren und respektieren wir die entscheidende Rolle, die Träger spielen — nicht nur als Helfer, sondern als Helden des Berges.',
  sections: [
    {
      heading: '👣 Wer sind die Kilimandscharo-Träger?',
      body: 'Träger sind lokale tansanische Männer und Frauen, die die für Ihr Trekking notwendige Ausrüstung, Nahrung, Wasser und Vorräte transportieren. Sie bauen das Lager auf und ab, helfen bei der Logistik und leisten oft Unterstützung, wenn Sie Ermutigung oder Hilfe auf dem Pfad benötigen. Ohne sie wären Kilimandscharo-Besteigungen — für die meisten Menschen — fast unmöglich.',
    },
    {
      heading: '🧭 Was machen die Träger auf dem Berg?',
      body: '🏕️ Sie transportieren Ausrüstung: Zelte, Schlafsäcke, Küchenvorräte, Ihre Reisetasche (bis zu 15 kg).\n🧑‍🍳 Sie unterstützen das Team: helfen den Köchen, servieren Mahlzeiten, holen Wasser und bauen die Speisezelte auf.\n🛖 Sie bauen das Lager auf und ab: manchmal kommen sie Stunden vor Ihnen im Camp an.\n🧤 Sie unterstützen Kletternde: gelegentlich helfen sie müden oder in Schwierigkeiten geratenen Kletternden.\nSie tun dies oft mit einem Lächeln, auch nach langen Stunden auf steilem und unwegsamem Gelände.',
    },
    {
      heading: '🎒 Wie viel tragen die Kilimandscharo-Träger?',
      body: 'Träger sind durch die Vorschriften des Kilimandscharo-Nationalparks und des KPAP (Kilimanjaro Porters Assistance Project) auf maximal 20 kg begrenzt — dies schließt ihre persönlichen Gegenstände ein. Allerdings setzen nicht alle Veranstalter diese Grenze fair durch. Deshalb ist es entscheidend, mit einem KPAP-konformen Veranstalter wie Asili Climbing Kilimanjaro zu klettern, der sich für faire Behandlung und das Wohlergehen der Träger einsetzt.',
    },
    {
      heading: '🤝 Ethische Behandlung der Träger: Was das bedeutet',
      body: 'Ethisches Trekking bedeutet, dass Träger fair bezahlt werden (pünktlich und transparent), angemessene Mahlzeiten auf dem Berg erhalten, über angemessene Unterkunft und warme Ausrüstung verfügen, auf die gesetzlich zulässigen Lasten beschränkt sind, in die Trinkgeldzeremonien einbezogen werden, und als vollwertige Teammitglieder respektiert werden. Bei Asili ist dies kein bloßes Häkchen — so führen wir jede Besteigung durch.',
    },
    {
      heading: '📣 Warum das für Sie als Trekker wichtig ist',
      body: 'Wenn Sie ein Unternehmen wählen, das seine Träger gut behandelt, klettern Sie verantwortungsvoll. Sie unterstützen lokale Existenzgrundlagen, verbessern Arbeitsbedingungen und tragen dazu bei, den Tourismus in Tansania zu einer positiven Kraft zu verwandeln. Sie erleben auch ein besseres Trekking. Ein gut unterstütztes Trägerteam ist motiviert, zuverlässig und stolz auf seine Rolle bei Ihrem Erfolg.',
    },
    {
      heading: '💡 Wie viele Träger werden pro Kletterer benötigt?',
      body: 'Ein durchschnittlicher Kilimandscharo-Trek erfordert 3-4 Träger pro Kletterer, abhängig von der Routenlänge und Gruppengröße, plus zusätzliche Teammitglieder wie Guides, Köche und Assistenzguides. Bei Asili sparen wir niemals, indem wir unsere Besteigungen unterbesetzen. Jedes Teammitglied spielt eine Rolle dabei, Ihren Komfort und Ihre Sicherheit zu gewährleisten.',
    },
    {
      heading: '🎖️ Kilimanjaro Porters Assistance Project (KPAP)',
      body: 'Wir arbeiten stolz mit dem KPAP zusammen, um die höchsten Standards für das Wohlergehen der Träger zu respektieren und zu übertreffen. Das KPAP ist eine gemeinnützige Organisation, die die Bedingungen der Träger überwacht und Unternehmen für ethische Behandlung zur Verantwortung zieht. Wir ermutigen alle Trekker zu fragen, ob ihr Veranstalter KPAP-zertifiziert ist — es ist der absolute Maßstab am Kilimandscharo.',
    },
    {
      heading: '💰 Trinkgelder für Träger: Ein Zeichen der Dankbarkeit',
      body: 'Trinkgeld ist eine gängige und bedeutungsvolle Möglichkeit, Ihre Wertschätzung zu zeigen. Auch wenn es nicht obligatorisch ist, wird es erwartet und sehr geschätzt. Unser Team bietet transparente Richtlinien für faire Trinkgelder, und wir stellen sicher, dass Trinkgelder direkt an jedes Teammitglied auf öffentliche und respektvolle Weise verteilt werden.',
      table: {columns: ['Rolle', 'Übliches Trinkgeld (pro Kletterer, 7-tägiger Trek)'], rows: [['Träger', '6-10 $/Tag'], ['Koch', '10-15 $/Tag'], ['Guide', '20-25 $/Tag']]},
    },
    {
      heading: '🧍 Die Geschichten hinter den Lächeln',
      body: 'Viele Träger am Kilimandscharo sind Studenten, Bauern oder Gemeindeführer, die ein Einkommen verdienen, um ihre Familien zu unterstützen. Manche werden Köche oder Guides — und wir begleiten stolz diejenigen, die von einer Karriere träumen. Bei Asili kennen wir ihre Namen, ihre Geschichten und ihre Ambitionen — und behandeln jedes Teammitglied mit Respekt. „Sie tragen nicht nur Ausrüstung — sie tragen Träume, und sie helfen Ihnen, Ihre eigenen zu erreichen." — Joseph, Chefguide bei Asili Climbing Kilimanjaro',
    },
    {
      heading: '📷 Wie Sie Ihre Wertschätzung zeigen können',
      body: 'Lernen Sie die Namen Ihrer Träger, erkundigen Sie sich nach ihrem Leben und teilen Sie ein Lächeln, nehmen Sie an der abschließenden Trinkgeldzeremonie teil, machen Sie Fotos und teilen Sie diese mit ihrer Erlaubnis, und hinterlassen Sie eine Bewertung, in der Sie Ihre positive Erfahrung erwähnen.',
    },
    {
      heading: '🚶 Klettern Sie mit Respekt. Klettern Sie mit Herz.',
      body: 'Bei Asili Climbing Kilimanjaro glauben wir, dass Träger mehr als Beifall verdienen — sie verdienen Würde. Indem Sie mit uns klettern, tragen Sie dazu bei, einen höheren Standard für den Bergtourismus zu setzen, bei dem Menschen genauso geschätzt werden wie der Gipfel. Möchten Sie mehr über unsere Trägerrichtlinien erfahren oder das Team treffen, das all dies möglich macht? Kontaktieren Sie Asili Climbing Kilimanjaro oder beginnen Sie noch heute mit der Planung Ihres ethischen Treks.',
    },
  ],
}

const kilimanjaroPackingListDe: DetailArticleDe = {
  slug: 'kilimanjaro-packing-list',
  seoTitle: 'Packliste für den Kilimandscharo | Ausrüstungs- und Kleidungsleitfaden',
  seoDescription: 'Die vollständige Ausrüstungsliste für den Kilimandscharo: Kleidungsschichten, Schuhwerk, Nachtausrüstung, Tagesrucksack-Essentials und was Ihr Veranstalter bereitstellt.',
  heroTitle: 'Vollständige Ausrüstungsliste für den Kilimandscharo',
  heroImage: {src: '/images/articles/packing-hero.webp', alt: 'Trekking- und Kletterausrüstung auf einem Holzboden ausgelegt'},
  intro:
    'Die Besteigung des Kilimandscharo ist kein gewöhnlicher Urlaub. Auf 5.895 Metern erfordert sie sowohl mentale Ausdauer als auch die richtige Ausrüstung. Die gute Nachricht? Sie müssen kein Vermögen ausgeben — aber Sie müssen klug packen. Dieser Leitfaden deckt alles ab, was Sie für eine sichere, komfortable und erfolgreiche Besteigung mitbringen müssen. Ob Sie sich einem geführten Trek anschließen oder mit einem privaten Team klettern, diese Liste ist auf Klarheit, Komfort und Kältevorbereitung ausgelegt.',
  sections: [
    {
      heading: '🎒 Die Essentials-Liste: Was Sie unbedingt mitbringen müssen',
      body: 'Hier sind die absoluten Must-haves — Ausrüstung und Kleidung, die Sie jeden Tag verwenden werden.\n🧥 Kleidungsschichten: Der Kilimandscharo umfasst fünf ökologische Zonen, und die Temperaturen variieren enorm. Denken Sie: Schichtensystem. Basisschichten (Thermounterwäsche) — 2-3 Sets (Ober- und Unterteil), atmungsaktiv. Mittlere Schichten — Fleece- oder Softshell-Jacken. Isolierjacke — Daune oder synthetisch für die Gipfelnacht. Außenschicht — wasserdichte und winddichte Jacke und Hose (Gore-Tex bevorzugt). Trekkinghosen — 2 Paar, schnelltrocknend. T-Shirts — 3-4 atmungsaktiv. Warme Mütze — die die Ohren bedeckt. Hut oder Sonnenschirm — für niedrigere Höhen. Handschuhe — dünne leichte Handschuhe + isolierende wasserdichte Handschuhe. Buff oder Halswärmer — für Wind, Staub und Wärme.',
      image: {src: '/images/articles/packing-gear.jpg', alt: 'Illustriertes Diagramm der Kilimandscharo-Trekking-Ausrüstung, einschließlich Kleidung, Schuhwerk und Accessoires'},
    },
    {
      heading: '👟 Schuhwerk',
      body: 'Sie werden 6-8 Stunden am Tag gehen, daher ist Komfort unerlässlich. Trekkingstiefel — wasserdicht, bereits eingelaufen, mit Knöchelunterstützung. Camp-Schuhe — Crocs oder Trailschuhe für die Abende. Woll- oder Kunstfasersocken — 4-6 Paar. Gamaschen — optional, aber nützlich in schlammigen/verschneiten Bereichen.',
      image: {src: '/images/articles/packing-boot.jpg', alt: 'Wasserdichter Trekkingstiefel'},
    },
    {
      heading: '🛏️ Nachtausrüstung',
      body: 'Die meisten Touren umfassen Zelte und Matten, aber bestätigen Sie, was bereitgestellt wird. Schlafsack — geeignet für mindestens -10°C oder kälter. Schlafsackinlett — fügt Wärme hinzu und hält den Sack sauber. Reisekissen oder aufblasbares Kissen.',
      image: {src: '/images/articles/packing-sleeping-bag.jpg', alt: 'Ausgerollter Schlafsack und Inlett'},
    },
    {
      heading: '🎒 Tagesrucksack-Essentials',
      body: 'Sie tragen Ihren Tagesrucksack mit den zwischen den Camps benötigten Gegenständen: 30-40 L Tagesrucksack mit gepolsterten Schultergurten und Hüftgurt. Hydriersystem — 2-3 L (CamelBak oder Wasserflaschen). Snacks — Studentenfutter, Energieriegel, getrocknetes Obst. Sonnenbrille — UV-Schutz, Gletscherkategorie bevorzugt. Sonnencreme und Lippenbalsam — SPF 30+. Stirnlampe — mit Ersatzbatterien (für die Gipfelnacht). Kamera oder Smartphone — optional, für Fotos. Notizbuch und Stift — optional, um Tagebuch zu führen.',
    },
    {
      heading: '🧼 Persönliche Hygiene und Gesundheit',
      body: 'Bleiben Sie frisch (oder so frisch wie möglich) mit diesem minimalistischen Hygiene-Set: Toilettenartikel (biologisch abbaubare Seife, Zahnbürste, Zahnpasta, Deodorant), Feuchttücher (Ihr bester Freund in den Bergen), Handdesinfektionsgel (unerlässlich vor Mahlzeiten), Schnelltrocknendes Handtuch (mittlere Größe), Toilettenpapier (bringen Sie eine Rolle in einem Ziploc-Beutel mit), Basis-Erste-Hilfe-Set (Blasenbehandlung, Schmerzmittel, Durchfallmedikamente), Höhenkrankheitsmedikament (Diamox — konsultieren Sie Ihren Arzt), persönliche Medikamente (einschließlich Malariatabletten falls erforderlich), Ohrstöpsel (für schnarchende Zeltgenossen).',
    },
    {
      heading: '📦 Optionale, aber nützliche Extras',
      body: 'Diese Artikel sind nicht obligatorisch, können aber einen großen Unterschied in Bezug auf Komfort machen: Externer Akku (solarbetrieben oder vorgeladen), Trekkingstöcke (dringend empfohlen für Knie und Gleichgewicht), Packbeutel/wasserdichte Beutel (um Ausrüstung organisiert und trocken zu halten), Energieergänzungen (Elektrolyttabletten oder Hydriersalze), Klebeband (für schnelle Reparaturen), Buch oder E-Reader (für Entspannungsmomente), Ziploc-Beutel (für Müll, Snacks, elektronische Geräte), wiederverwendbare Flasche oder Trichter zum Urinieren (nächtlicher Komfort).',
    },
    {
      heading: '🧳 Was der Veranstalter bereitstellt',
      body: 'Die meisten zuverlässigen Unternehmen wie Asili Climbing Kilimanjaro stellen Zelte, Matten, Speisezelte und Geschirr, Essen, Wasser, Küchenpersonal und Träger (die Ihre Haupttasche tragen) bereit. Sie sind im Allgemeinen für Ihre Kleidung, Ihren Schlafsack, Ihre persönliche Ausrüstung und Ihren Tagesrucksack verantwortlich. Viele Artikel können in Moshi oder Arusha gemietet werden — erkundigen Sie sich im Voraus bei Ihrem Veranstalter.',
    },
  ],
}

const kilimanjaroClimbCostDe: DetailArticleDe = {
  slug: 'kilimanjaro-climb-cost',
  seoTitle: 'Kosten der Kilimandscharo-Besteigung | Was Sie wissen müssen',
  seoDescription: 'Wie viel kostet die Besteigung des Kilimandscharo? Vollständige Kostenaufschlüsselung nach Route, Gruppengröße, Ausrüstungsmiete, Trinkgeldern und was enthalten ist.',
  heroTitle: 'Kosten der Kilimandscharo-Besteigung: Was Sie wissen müssen',
  heroImage: {src: '/images/articles/cost-hero.webp', alt: 'Ein Kletterer feiert vor dem Uhuru-Peak-Gipfelschild'},
  intro:
    'Die Besteigung des Kilimandscharo ist ein lebensveränderndes Abenteuer, hat aber ihren Preis. Zu verstehen, wohin Ihr Geld fließt — und was Sie erwarten können — ist entscheidend für die Planung einer erfolgreichen und sicheren Besteigung. Die Gesamtkosten können je nach Route, Anzahl der Tage, gewünschtem Komfortniveau und gewählter Agentur erheblich variieren.',
  sections: [
    {
      heading: '💰 Wie viel kostet die Besteigung des Kilimandscharo?',
      body: 'Im Durchschnitt variieren die Kosten zwischen 1.700 $ und 6.000 $ pro Person. Jede Kilimandscharo-Route hat unterschiedliche logistische Anforderungen, Träger-Verhältnisse und Parkgebühren je nach Anzahl der Tage:',
      table: {
        columns: ['Route', 'Tage', 'Ungefähre Kosten (Mittelklasse)', 'Warum der Preis variiert'],
        rows: [
          ['Marangu', '5-6', '1.800 $ - 2.500 $', 'Nutzt Hütten, weniger Träger'],
          ['Machame', '6-7', '2.000 $ - 3.000 $', 'Beliebte landschaftliche Route'],
          ['Lemosho', '7-8', '2.300 $ - 3.500 $', 'Länger, abgelegener Start'],
          ['Rongai', '6-7', '2.200 $ - 3.200 $', 'Weniger frequentiert, Nordanflug'],
          ['Umbwe', '6', '2.100 $ - 3.100 $', 'Steile und schnelle Besteigung'],
          ['Northern Circuit', '8-9', '2.800 $ - 4.200 $', 'Die längste, höchste Erfolgsquote'],
        ],
      },
    },
    {
      heading: '🧾 2. Kostenaufschlüsselung nach Position',
      body: 'Hier fließt Ihr Geld hin, für eine mittelklassige 7-tägige Besteigung:',
      table: {
        columns: ['Ausgabenkategorie', 'Geschätzte Kosten (USD)'],
        rows: [
          ['Parkgebühren und Genehmigungen', '800 $ - 1.100 $'],
          ['Gehälter für Guide und Team', '400 $ - 600 $'],
          ['Essen und Küchenvorräte', '150 $ - 250 $'],
          ['Ausrüstung (Zelte usw.)', '100 $ - 200 $'],
          ['Transfers (zum Startpunkt)', '50 $ - 100 $'],
          ['Verwaltung und Sicherheitsunterstützung', '100 $ - 200 $'],
          ['Gewinnspanne des Veranstalters', '200 $ - 400 $'],
        ],
      },
    },
    {
      heading: '👥 3. Gruppengröße und Kosten für private Besteigungen',
      body: 'Offene Gruppenbesteigung (6-12 Personen): niedrigere Kosten pro Person. Private Besteigung (allein oder maßgeschneiderte Gruppe): normalerweise 300-800 $ mehr pro Person. Luxusbesteigungen (mit tragbaren Toiletten, verbesserten Mahlzeiten, weniger Kletternden): können 5.000-7.000 $ erreichen.',
      image: {src: '/images/articles/cost-route.jpg', alt: 'Gruppe von Trekkern, die zum Kilimandscharo wandern'},
    },
    {
      heading: '🏨 4. Unterkunft vor und nach der Besteigung',
      body: 'Die meisten Pakete beinhalten 1 Nacht vor der Besteigung und 1 Nacht danach in einem 2-3-Sterne-Hotel in Moshi oder Arusha (mit Upgrade-Möglichkeiten). Rechnen Sie mit etwa 50-150 $ pro Nacht, wenn Sie selbst buchen.',
      image: {src: '/images/articles/cost-lodge.jpg', alt: 'Lodge-Unterkunft in der Nähe des Kilimandscharo'},
    },
    {
      heading: '🎒 5. Ausrüstungsmiete oder -kauf',
      body: 'Wenn Sie Ihre eigene Ausrüstung nicht besitzen, müssen Sie sie vor Ort mieten:',
      table: {
        columns: ['Artikel', 'Mietkosten (USD)'],
        rows: [
          ['Schlafsack', '30 $ - 50 $'],
          ['Daunenjacke', '20 $ - 40 $'],
          ['Trekkingstöcke', '10 $ - 15 $'],
          ['Gamaschen', '10 $ - 15 $'],
          ['Stirnlampe', '10 $ - 20 $'],
        ],
      },
    },
    {
      heading: '💸 6. Tipps zum Trinkgeld',
      body: 'Trinkgelder werden erwartet und sehr geschätzt. Das Kilimanjaro Porters Assistance Project (KPAP) empfiehlt: Guide — 20 $/Tag, Assistenzguide — 15 $/Tag, Koch — 12 $/Tag, Träger — jeweils 6-10 $/Tag. Gesamttrinkgeld pro Kletterer (7-tägige Besteigung): 250-300 $ (abhängig von der Gruppengröße).',
      image: {src: '/images/articles/cost-tipping.jpg', alt: 'Ein Kletterer und ein Guide auf dem Kilimandscharo-Pfad'},
    },
    {
      heading: '🚑 7. Versicherungskosten',
      body: 'Reiseversicherung ist bei den meisten Veranstaltern obligatorisch. Rechnen Sie mit 80-150 $ für einen Schutz, der Höhentrekking (über 5.000 m), Notfallevakuierung und Reiseabbruch oder -unterbrechung abdeckt.',
    },
    {
      heading: '🧭 8. Kosten versus Wert: Wofür zahlen Sie wirklich?',
      table: {
        columns: ['Günstigster Veranstalter', 'Mittelklasse-Veranstalter', 'Premium-Veranstalter'],
        rows: [
          ['1.500 $ - 1.900 $', '2.000 $ - 3.200 $', '4.000 $ - über 6.000 $'],
          ['Unerfahrene Guides', 'Zertifizierte und erfahrene Guides', 'Zertifizierte Wilderness First Responder (WFR) Guides'],
          ['Ausrüstung von geringer Qualität', 'Gute Zelte, Sicherheitsausrüstung', 'Hochwertige Ausrüstung + tragbare Toiletten'],
          ['Kein Sauerstoff oder Sicherheitschecks', 'Tägliche Gesundheitsüberwachung', 'Reservesauerstoff, privates medizinisches Team'],
          ['Unethische Behandlung der Träger', 'Faire Löhne durch KPAP-Zugehörigkeit', 'Bestes Träger-zu-Kunden-Verhältnis'],
        ],
      },
    },
    {
      heading: 'Was ist in den Kosten enthalten?',
      body: 'Parkgebühren (die bis zu 50 % der Gesamtkosten ausmachen können), Camping-/Hüttenunterkunft, alle Mahlzeiten auf dem Berg, professionelle Bergguides, Träger und Köche, Zelte, Matten und Küchenausrüstung, Hin- und Rücktransport zum Startpunkt, Rettungsgebühren und Genehmigungen.',
    },
    {
      heading: 'Was ist NICHT enthalten?',
      body: 'Internationale oder Inlandsflüge, Visagebühren, Reiseversicherung (obligatorisch), Trinkgelder für Guides und Träger, Ausrüstungsmiete oder -kauf, Hotelaufenthalte vor/nach der Besteigung, persönliche Ausgaben (Snacks, Getränke, Souvenirs).',
      image: {src: '/images/articles/cost-notincluded.jpg', alt: 'Ein Kletterer auf dem felsigen Gelände des Kilimandscharo'},
    },
    {
      heading: 'Hinweis',
      body: 'Die Besteigung des Kilimandscharo ist ein ernsthaftes Abenteuer, und der Preis, den Sie zahlen, sollte die Qualität, Sicherheit und Erfahrung widerspiegeln, die Sie erwarten. Auch wenn Sie kein Vermögen ausgeben müssen, sparen Sie nicht am Berg. Es ist nicht nur eine Wanderung — es ist eine einmalige Reise.',
    },
  ],
}

const bestTimeToClimbKilimanjaroDe: DetailArticleDe = {
  slug: 'best-time-to-climb-kilimanjaro',
  seoTitle: 'Die beste Zeit für die Besteigung des Kilimandscharo | Saison-für-Saison-Leitfaden',
  seoDescription: 'Was ist die beste Zeit, um den Kilimandscharo zu besteigen? Eine monatliche Aufschlüsselung von Wetter, Andrang und Bedingungen, um Ihnen bei der Wahl Ihrer Besteigungstermine zu helfen.',
  heroTitle: '🕒 Die beste Zeit für die Besteigung des Kilimandscharo',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Weidender Elefant mit dem Kilimandscharo im Hintergrund'},
  intro:
    'Die Besteigung des Kilimandscharo ist ein unglaubliches Abenteuer — und die Wahl des richtigen Zeitpunkts kann genauso wichtig sein wie die Wahl der Anreise. Mit seinen imposanten Gipfeln, wechselnden Wetterbedingungen und spektakulären Landschaften kann eine gute zeitliche Planung Ihres Treks den Unterschied zwischen einer komfortablen und einer schwierigen Besteigung ausmachen. Was ist also die beste Zeit, um den Kilimandscharo zu besteigen? Lassen Sie uns dies Saison für Saison analysieren, basierend auf echter Erfahrung und Expertenrat.',
  sections: [
    {
      heading: 'Beste Monate für die Besteigung des Kilimandscharo',
      body:
        'Es gibt zwei ideale Trekking-Saisons am Kilimandscharo.\n🗓️ Januar bis Mitte März — Wetter: warm, überwiegend trocken, sonnige Tage. Landschaften: klare Sicht, besonders am frühen Morgen. Andrang: mäßig, weniger frequentiert als die Hochsaison. Stärken: ausgezeichnete Zeit für Fotografie mit schneebedeckten Gipfeln. Diese Zeit ist ausgezeichnet für Kletternde, die milde Temperaturen und weniger Andrang wünschen, besonders von Januar bis Anfang Februar. März markiert jedoch den Beginn der großen Regenzeit, daher ist es besser, vor Mitte März zu gehen.\n🗓️ Juni bis Oktober (Hochsaison) — Wetter: trocken und stabil. Landschaften: großartig, besonders mit prächtigem Himmel bei Sonnenaufgang. Andrang: dies ist die am stärksten frequentierte Zeit auf dem Berg. Stärken: ausgezeichnete Gipfelbedingungen und Pfadsicht. Dies ist die beliebteste Zeit, um den Kilimandscharo zu besteigen, besonders während der europäischen und nordamerikanischen Sommerferien. Die Pfade sind trockener und die Bedingungen zuverlässiger — bereiten Sie sich einfach darauf vor, sie mit anderen Trekkern zu teilen.\n🌧️ Zu vermeidende Saisons (wenn möglich)\n🗓️ Mitte März bis Mai (große Regenzeit) — starke Regenfälle machen Pfade rutschig und die Sicht schlecht. Höheres Risiko höhenbedingter Beschwerden aufgrund kalter/feuchter Bedingungen. Weniger Trekker, was manche schätzen können — aber das hat seinen Preis. Es sei denn, Sie sind sehr erfahren und gut vorbereitet, ist dies nicht die ideale Zeit zum Klettern. Camps können matschig werden, und die Aussichten sind oft verschleiert.\n🗓️ November bis Anfang Dezember (kleine Regenzeit) — weniger intensiv als die großen Regenfälle, aber immer noch unvorhersehbar. Weniger Kletternde auf dem Pfad. Sie könnten einige klare, kühle Tage haben — aber es ist ein Glücksspiel. Diese Saison ist besser als die großen Regenfälle, wird aber dennoch nicht empfohlen, es sei denn, Sie sind mit gelegentlich feuchtem Wetter vertraut.',
      image: {src: '/images/articles/besttime-uhuru.webp', alt: 'Uhuru-Peak-Gipfelschild'},
    },
    {
      heading: '❄️ Und was ist mit Schnee am Kilimandscharo?',
      body: 'Schnee ist am Gipfel das ganze Jahr über üblich, aber wenn Sie hoffen, Uhuru Peak schneebedeckt zu sehen, sind Ihre besten Chancen von Januar bis März und während oder kurz nach den Regenzeiten (April oder Anfang Dezember). Schnee verleiht dem Gipfeltag Magie — fügt aber auch eine Herausforderung hinzu, also planen Sie entsprechend.',
    },
    {
      heading: '📊 Übersicht über das Kilimandscharo-Wetter nach Monat',
      table: {
        columns: ['Monat', 'Saison', 'Bedingungen', 'Andrang'],
        rows: [
          ['Januar', 'Trocken (beste)', 'Klarer Himmel, milde Temperaturen', 'Mittel'],
          ['Februar', 'Trocken (beste)', 'Warm, ausgezeichnete Sicht', 'Mittel'],
          ['März', 'Übergang', 'Zunehmender Regen', 'Niedrig'],
          ['April', 'Regnerisch (vermeiden)', 'Feucht, bewölkt, rutschig', 'Sehr niedrig'],
          ['Mai', 'Regnerisch (vermeiden)', 'Schlechte Pfadbedingungen', 'Sehr niedrig'],
          ['Juni', 'Trocken (Hochsaison)', 'Kühle Morgen, klare Sicht', 'Hoch'],
          ['Juli', 'Trocken (Hochsaison)', 'Kalte Nächte, sonnige Tage', 'Sehr hoch'],
          ['August', 'Trocken (Hochsaison)', 'Ausgezeichnetes Gipfelwetter', 'Sehr hoch'],
          ['September', 'Trocken (Hochsaison)', 'Prächtige Aussichten, mildes Klima', 'Hoch'],
          ['Oktober', 'Übergang', 'Etwas Regen gegen Monatsende', 'Mittel'],
          ['November', 'Regnerisch (vermeiden)', 'Kleine Regenfälle, unvorhersehbar', 'Niedrig'],
          ['Dezember', 'Übergang', 'Klar zu Monatsbeginn, feuchter zum Monatsende', 'Mittel'],
        ],
      },
    },
    {
      heading: '🏔️ Expertentipps zur Wahl der richtigen Zeit',
      body: 'Vermeiden Sie Schulferien (Juli und August), wenn Sie weniger Andrang wünschen. Wenn es die Regenzeit sein muss, reisen Sie mit einem erfahrenen Veranstalter und planen Sie zusätzlichen Wetterschutz ein. Akklimatisierung ist wichtiger als Sonnenschein — längere Routen wie Lemosho und Northern Circuit bieten eine bessere Höhenanpassung, unabhängig von der Saison. Kältere Monate bedeuten bessere Gipfelfotos (weniger Wolkendecke), aber wärmere Monate bedeuten mehr Komfort auf dem Pfad.',
    },
  ],
}

const kilimanjaroSafarisDe: DetailArticleDe = {
  slug: 'kilimanjaro-safaris',
  seoTitle: 'Kilimandscharo-Safaris | Kombinieren Sie Gipfel und Savanne',
  seoDescription: 'Kombinieren Sie Ihre Kilimandscharo-Besteigung mit einer Tansania-Safari. Erkunden Sie Tarangire, Lake Manyara, den Ngorongoro-Krater und die Serengeti nach Ihrem Gipfel.',
  heroTitle: '🐘 Kilimandscharo-Safaris: Kombinieren Sie Gipfel und Savanne',
  heroImage: {src: '/images/articles/besttime-hero.webp', alt: 'Weidender Elefant mit dem Kilimandscharo im Hintergrund'},
  intro:
    'Ihr afrikanisches Abenteuer endet nicht am Gipfel — es beginnt dort, wo wilde Tiere umherziehen. Die Besteigung des Kilimandscharo ist ein unverzichtbares Unterfangen, aber die Kombination Ihres Treks mit einer unvergesslichen Tansania-Safari rundet das Erlebnis ab. Nach Tagen des Höhentrekkings, stellen Sie sich vor, Ihre Trekkingstiefel gegen ein Fernglas und staubige Pfade gegen goldene Ebenen zu tauschen — auf der Verfolgung von Löwen, Elefanten und Gnus durch die ikonischsten Landschaften Ostafrikas. Bei Asili Climbing Kilimanjaro helfen wir Ihnen, von schneebedeckten Gipfeln zur Savanne überzugehen, mit nahtlosen Safari-Erlebnissen vor oder nach dem Trekking, angepasst an Ihre Zeit, Ihr Budget und Ihre Interessen.',
  sections: [
    {
      heading: '🌍 Was ist eine Kilimandscharo-Safari?',
      body: 'Eine Kilimandscharo-Safari bezieht sich im Allgemeinen auf einen Wildlife-Circuit im Norden Tansanias, kombiniert mit einer Kilimandscharo-Besteigung. Da der Berg in der Nähe einiger der besten Wildparks Afrikas liegt, sind Sie bereits in der idealen Position, um sie zu erkunden. Ob Sie einen schnellen 2-tägigen Ausflug oder eine vollständige 5-7-tägige Safari wünschen, die Möglichkeiten sind endlos — und episch.',
    },
    {
      heading: '🏞️ Beste Safariparks in der Nähe des Kilimandscharo',
      body: '1. Tarangire-Nationalpark — berühmt für seine gewaltigen Elefantenherden, seine Affenbrotbäume, seine abseits ausgetretener Pfade liegende Atmosphäre. Entfernung von Arusha: etwa 2 Stunden. Ideal für einen entspannten Start oder Abschluss Ihres Kilimandscharo-Abenteuers.\n2. Lake-Manyara-Nationalpark — berühmt für seine baumkletternden Löwen, seine Flamingos, seinen Grundwasserwald. Entfernung: etwa 2,5 Stunden. Ideal für schnelle Wildbeobachtungserlebnisse, besonders auf dem Weg zur Ngorongoro-Region.\n3. Ngorongoro-Krater — berühmt für die Beobachtung der Big Five an einem einzigen Tag. Ein UNESCO-Weltkulturerbe und die größte intakte Caldera der Welt. Ideal für Wildtierkonzentration und Fotografie.\n4. Serengeti-Nationalpark — berühmt für die Große Migration, seine endlosen Ebenen, Löwen und Leoparden. Ein einmaliges Reiseziel. Ideal für 3-5-tägige Safaris mit tiefer Immersion in die Wildnis.',
      image: {src: '/images/articles/safaris-gallery1.webp', alt: 'Eine ruhende Löwin mit zwei Jungen'},
    },
    {
      heading: '🗓️ Wann zur Safari nach dem Kilimandscharo aufbrechen',
      body: 'Sie können das ganze Jahr über zur Safari aufbrechen, aber die besten Zeiten für Wildbeobachtung sind: Juni-Oktober (Trockenzeit) — Tiere versammeln sich an Wasserstellen, und die Vegetation ist spärlicher, ideal für Beobachtungen. Dezember-März — Geburtensaison im südlichen Serengeti, reich an spektakulären Räuber-Beute-Interaktionen. Kombinieren Sie Ihre Safari mit einer Kilimandscharo-Besteigung von Juni bis Oktober für die ultimative Abenteuerkombination.',
    },
    {
      heading: '🦓 Was Sie auf Safari sehen werden',
      body: 'Je nach Parks und Saison könnten Sie die Big Five (Löwe, Leopard, Elefant, Büffel, Nashorn) beobachten, Geparden, die über die Ebenen sprinten, Giraffen, die sich zwischen Akazienwäldern bewegen, Flusspferde, die sich an Flussufern sonnen, Flamingos am Lake Manyara oder Natron, und die Große Migration von Gnus und Zebras (das Timing zählt!).',
      image: {src: '/images/articles/safaris-gallery2.webp', alt: 'Ein Elefant steht auf einer grünen Grasfläche'},
    },
    {
      heading: '🛏️ Wo Sie übernachten werden',
      body: 'Ob Sie Komfort oder Abenteuer suchen, Safari-Unterkünfte kommen in Stilen, die zu jedem Reisenden passen: Luxus-Lodges mit Ausblick auf Savannen und Kraterränder, mittelklassige Zeltcamps, die Komfort und Immersion bieten, mobile Camps, die sich mit der Großen Migration bewegen, und budgetfreundliche Optionen für Rucksacktouristen oder Alleinreisende. Bei Asili helfen wir Ihnen, die beste Safari-Unterkunft entsprechend Ihrem Stil, Ihrer Gruppengröße und Ihrem Budget zu finden.',
    },
    {
      heading: '💡 Warum eine Safari mit einer Kilimandscharo-Besteigung kombinieren?',
      body: 'Erholen und entspannen: nach der Intensität des Treks lässt die Safari Ihren Körper ruhen, ohne Ihr Abenteuer zu beenden. Maximieren Sie Ihre Reise: Sie sind bereits bis nach Tansania gereist, verlängern Sie Ihren Aufenthalt und machen Sie ihn noch lohnender. Entdecken Sie Afrikas Vielfalt: von schneebedeckten Gipfeln bis zu wildreichen Ebenen, das ist Afrika von seiner besten Seite. Perfekt für Freunde oder Familie, die später zu Ihnen stoßen: manche Familienmitglieder klettern vielleicht nicht, treffen Sie aber zur Safari.',
      table: {
        columns: ['Tag', 'Aktivität'],
        rows: [
          ['1-7', 'Besteigung des Kilimandscharo (z.B. Machame- oder Lemosho-Route)'],
          ['8', 'Transfer nach Tarangire zur Safari'],
          ['9', 'Safari am Ngorongoro-Krater'],
          ['10', 'Rückfahrt nach Arusha oder Abflug'],
        ],
      },
    },
    {
      heading: '💰 Wie viel kostet eine Kilimandscharo-Safari?',
      body: 'Der Safaripreis hängt von der Dauer, der Art der Unterkunft und den besuchten Parks ab: 2-3-tägige Safaris ab 600-1.200 $ pro Person, 4-5-tägige Safaris 1.200-2.000 $ pro Person, Luxussafaris ab 2.500 $ je nach Wahl der Lodges und privaten Fahrzeuge. Bei Asili Climbing Kilimanjaro bieten wir transparente Preise ohne versteckte Kosten. Gruppen-, Familien- und private Circuits sind alle verfügbar.',
    },
    {
      heading: 'Bereit, vom Gipfel in die Ebenen überzugehen?',
      body: 'Ob Sie den Kilimandscharo allein, mit Freunden oder der Familie besteigen, eine Safari ist das perfekte nächste Kapitel. Lassen Sie uns Ihnen helfen, die Reise Ihres Lebens zu planen — zu Fuß und auf vier Rädern. Kontaktieren Sie Asili Climbing Kilimanjaro, um noch heute Ihre Berg-plus-Safari-Kombination zu erstellen.',
    },
  ],
}

const soloKilimanjaroClimbDe: DetailArticleDe = {
  slug: 'solo-kilimanjaro-climb',
  seoTitle: 'Solo-Kilimandscharo-Besteigung | Ihre persönliche Reise zum Dach Afrikas',
  seoDescription: 'Alles, was Sie über die Solo-Besteigung des Kilimandscharo wissen müssen: ist sie sicher, Gruppen- oder private Treks, Kosten und Expertentipps für unabhängige Trekker.',
  heroTitle: 'Solo-Kilimandscharo-Besteigung',
  heroImage: {src: '/images/articles/solo-hero.jpg', alt: 'Ein Alleinreisender beobachtet den Sonnenaufgang vom Kilimandscharo'},
  intro:
    'Wenn Sie ein Alleinreisender sind, der davon träumt, auf Afrikas höchstem Gipfel zu stehen, ist die Solo-Besteigung des Kilimandscharo mehr als möglich — es ist ein unglaublich lohnendes Erlebnis. Bei Asili Climbing Kilimanjaro sind wir darauf spezialisiert, Alleinreisende zu begleiten, und bieten die Unterstützung, Sicherheit und Flexibilität, die nötig sind, um diese Reise wirklich zu Ihrer eigenen zu machen. Hier ist alles, was Sie über die Besteigung des Kilimandscharo als Alleinreisender wissen müssen.',
  sections: [
    {
      heading: 'Kann man den Kilimandscharo allein besteigen?',
      body: 'Obwohl es nicht erlaubt ist, den Kilimandscharo völlig allein zu besteigen (ein lizenzierter Guide ist obligatorisch), können Sie definitiv einen privaten Solo-Trek buchen oder sich als Alleinreisender einer Gruppe anschließen. Ob Sie totale Unabhängigkeit oder ein soziales Erlebnis mit anderen Trekkern bevorzugen, es gibt eine perfekte Option für Sie.',
    },
    {
      heading: 'Warum viele Reisende sich entscheiden, den Kilimandscharo allein zu besteigen',
      body: 'Solo klettern bedeutet nicht nur allein zu reisen — es geht darum zu entdecken, wozu Sie fähig sind, in Ihrem eigenen Tempo. Deshalb brechen viele Abenteurer allein auf: eine persönliche Herausforderung, um über sich hinauszuwachsen, totale Freiheit und Flexibilität, Zeit für persönliche Reflexion und mentale Klarheit, und eine bedeutungsvolle Reise — für einen Geburtstag, eine Auszeit von der Karriere oder einen Lebensübergang.',
    },
    {
      heading: 'Gruppenbesteigung oder privater Trek — Was sollten Alleinreisende wählen?',
      body: '🟩 Einer Gruppen-Trekking beitreten: niedrigere Kosten (geteilte Logistik), gesellige Atmosphäre (andere Trekker treffen), feste Abreisetermine, ideal für Anfänger oder alle, die Kameradschaft suchen.\n🟦 Private Solo-Besteigung: flexible Zeitplanung und Tempo, persönliche Begleitung und Aufmerksamkeit, ideal für erfahrene Trekker oder unabhängige Reisende, höhere Kosten, aber vollständig personalisiert.\nAsili Climbing Kilimanjaro bietet beide Optionen an, ohne Druck und ohne Einzelreisendenzuschläge.',
    },
    {
      heading: '🏕️ Wie eine Solo-Besteigung aussieht',
      body: 'Auch bei einem Solo-Trek sind Sie nie wirklich allein. Sie werden von einem vollständigen Team unterstützt, das einen zertifizierten Bergführer, einen Koch und Träger umfasst. Sie gehen in Ihrem eigenen Tempo, essen warme, speziell für Sie zubereitete Mahlzeiten und schlafen jede Nacht in einem komfortablen Zelt. Private Besteigungen bieten vollständige Flexibilität und Intimität. Gruppenbesteigungen bieten Ihnen gemeinsame Unterstützung und Ermutigung. Ihr Guide wird zu Ihrem vertrauten Begleiter auf dem Pfad.',
      image: {src: '/images/articles/is-safe-hero.jpg', alt: 'Trekker besteigen den Kilimandscharo bei Sonnenaufgang'},
    },
    {
      heading: '🛡️ Ist es sicher, den Kilimandscharo allein zu besteigen?',
      body: 'Ja — wenn Sie mit einem zuverlässigen Veranstalter wie Asili Climbing Kilimanjaro klettern, sind Sie in guten Händen. Wir priorisieren Ihre Sicherheit mit zertifizierten und erfahrenen Bergführern, täglichen Gesundheitschecks und Höhenüberwachung, Notfallsauerstoff- und Evakuierungsplänen, und gut ausgebildeten Trägern mit 24/7-Unterstützung. Viele Alleinreisende wählen Asili auch wegen unserer zuverlässigen, respektvollen und professionellen Teams.',
    },
    {
      heading: '💰 Ist die Solo-Besteigung des Kilimandscharo teurer?',
      body: 'Allein auf einer privaten Besteigung aufzubrechen, kostet mehr als sich einer Gruppe anzuschließen, da Sie die gesamten logistischen Kosten, Parkgebühren und das Unterstützungspersonal decken. Der Wert liegt jedoch in einem maßgeschneiderten Erlebnis.',
      table: {columns: ['Option', 'Typische Kostenspanne'], rows: [['Gruppenbesteigung (6-8 Tage)', '1.850 $ - 2.300 $'], ['Private Solo-Besteigung (6-8 Tage)', '2.500 $ - 3.400 $']]},
    },
    {
      heading: '🎒 Ausrüstungstipps für die Solo-Besteigung des Kilimandscharo',
      body: 'Bringen Sie einen externen Akku oder ein zusätzliches Solarladegerät mit. Persönliche Trostgegenstände (Tagebuch, Buch, Snacks) können die Stimmung heben. Packen Sie leicht, aber klug — konsultieren Sie unsere Kilimandscharo-Packliste. Laufen Sie Ihre Stiefel im Voraus ein!',
    },
    {
      heading: '📅 Beste Zeit für die Besteigung des Kilimandscharo als Alleinreisender',
      body: 'Für Alleinreisende zählt das Timing: Die besten Saisons sind Januar-März und Juni-Oktober. Vermeiden Sie April-Mai (starke Regenfälle) und November (kleine Regenfälle). Die Besteigung in der Hochsaison gibt Ihnen die Möglichkeit, andere Menschen unterwegs zu treffen — auch während einer privaten Besteigung.',
    },
    {
      heading: '💡 Expertenmeinung',
      body: 'Die Solo-Besteigung des Kilimandscharo ist eine der lohnendsten Entscheidungen, die Sie treffen können. Mit der Unterstützung eines erfahrenen lokalen Teams genießen Sie die Freiheit, allein zu reisen, mit der Gewissheit, gut begleitet zu sein. Bei Asili Climbing Kilimanjaro verstehen wir, was Alleinreisende brauchen: Respekt, Flexibilität und ein engagiertes Team, das Ihre Reise unvergesslich — und sicher — macht.',
    },
    {
      heading: '🌍 Bereit, Ihr Solo-Abenteuer zu beginnen?',
      body: 'Ob Sie die Einsamkeit eines privaten Treks oder die Energie einer kleinen Gruppe wünschen, wir helfen Ihnen, Ihren perfekten Reiseverlauf, Zeitplan und Ihr Tempo zu planen. Wir verwirklichen Ihren Kilimandscharo-Traum — nur für Sie. Kontaktieren Sie Asili Climbing Kilimanjaro, um mit der Planung Ihres Solo-Gipfels zu beginnen.',
    },
  ],
}

async function run() {
  await seedDetailArticleDe(isClimbingKilimanjaroSafeDe)
  await seedDetailArticleDe(gettingToKilimanjaroDe)
  await seedDetailArticleDe(mountKilimanjaroFactsDe)
  await seedDetailArticleDe(typicalDayOnKilimanjaroDe)
  await seedDetailArticleDe(kilimanjaroFullmoonClimbDe)
  await seedDetailArticleDe(kilimanjaroAltitudeSicknessDe)
  await seedDetailArticleDe(kilimanjaroFoodDe)
  await seedDetailArticleDe(kilimanjaroPortersDe)
  await seedDetailArticleDe(kilimanjaroPackingListDe)
  await seedDetailArticleDe(kilimanjaroClimbCostDe)
  await seedDetailArticleDe(bestTimeToClimbKilimanjaroDe)
  await seedDetailArticleDe(kilimanjaroSafarisDe)
  await seedDetailArticleDe(soloKilimanjaroClimbDe)
  console.log('done — all 13 detail articles seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
