/**
 * Phase 6 (German): the 6 remaining guide articles (mount-kilimanjaro was
 * already seeded separately in seed-de-articles-misc.ts).
 * Mirrors seed-it-guide-articles.ts's structure but with German text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-guide-articles.ts --with-user-token
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
}
interface FaqDe {
  question: string
  answer: string
}
interface GuideArticleDe {
  slug: string
  seoTitle: string
  seoDescription: string
  heading: string
  heroImage?: {src: string; alt: string}
  intro: string
  sections: SectionDe[]
  faqHeading?: string
  faqs?: FaqDe[]
}

function tableToDoc(table?: TableDe) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedGuideArticleDe(data: GuideArticleDe) {
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
  const deId = await upsertTranslatedDoc(client, 'article', data.slug, 'de', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`${data.slug}-de done (${deId})`)
}

const kilimanjaroClimbingSeasonsDe: GuideArticleDe = {
  slug: 'kilimanjaro-climbing-seasons',
  seoTitle: 'Bester Monat für die Besteigung des Kilimandscharo | Wetterleitfaden',
  seoDescription: 'Ein monatlicher Wetterleitfaden für die Besteigung des Kilimandscharo: beste Monate, Trockenzeiten, zu vermeidende Monate und Experten-Timing-Tipps.',
  heading: 'Bester Monat für die Besteigung des Kilimandscharo',
  intro:
    'Die besten Monate für die Besteigung des Kilimandscharo sind während der Trockenzeiten, nämlich von Januar bis März und von Juni bis Oktober. Diese Zeiträume bieten klaren Himmel und trockenere Pfade, was zu günstigeren Trekking-Bedingungen führt. Für eine Balance zwischen gutem Wetter und geringerem Andrang, erwägen Sie eine Besteigung im Januar, Februar oder Oktober.',
  sections: [
    {
      heading: 'Bester Monat für die Besteigung des Kilimandscharo: Der ultimative Wetterleitfaden',
      body: 'Die Kilimandscharo-Routen sind die offiziell ausgewiesenen Pfade, die von Trekkern genutzt werden, um den Gipfel des höchsten Berges Afrikas, Uhuru Peak (5.895 m), zu erreichen. Die Wahl der richtigen Kilimandscharo-Besteigungsroute ist eine der wichtigsten Entscheidungen, die Sie bei der Planung Ihres Treks treffen werden. Jede Route unterscheidet sich in Landschaft, Schwierigkeit, Akklimatisierungsprofil, Erfolgsquote und Gesamterlebnis.',
    },
    {
      heading: 'Warum der beste Monat für die Besteigung des Kilimandscharo wichtig ist',
      body: 'Das Klima des Kilimandscharo schwankt zwischen feuchten Regenwäldern und arktischen Gipfeln — die Wahl des besten Monats für die Besteigung des Kilimandscharo beeinflusst den Zustand der Pfade, die Risiken akuter Höhenkrankheit und die Ausblicke. Die Trockenzeiten (Jan-März, Juni-Okt) bieten stabile Pfade und klare Panoramen, während die Regenzeiten (April-Mai, Nov) Schlamm und Nebel mit sich bringen. Unsere Guides empfehlen 7-tägige oder längere Routen während der Hochsaisonen für eine optimale Akklimatisierung. Die Wahl der Zwischensaisonen ermöglicht Einsparungen von 10 bis 20 % bei den Kosten, während weiterhin gutes Wetter genossen wird.',
    },
    {
      heading: 'Monat für Monat: Die besten Monate für die Besteigung des Kilimandscharo — Wetterleitfaden',
      body: 'Hier ist ein detaillierter Überblick über die besten Monate für die Besteigung des Kilimandscharo, einschließlich Gesamtbewertung, Wetter, Andrang und Routenempfehlungen.',
      table: {
        columns: ['Zeitraum', 'Gesamtbewertung', 'Wetter', 'Andrang', 'Empfohlene Route'],
        rows: [
          ['16. Jan-28. Feb', 'Ausgezeichnet', 'Angemessene Temperaturen, mittlerer Niederschlag, wenig Bewölkung', 'Mittel', 'Alle Routen geöffnet'],
          ['01. März-31. März', 'Variabel', 'Angemessene Temperaturen, zunehmendes Regen- und Schneerisiko, dichte Bewölkung in niedrigeren Höhen', 'Niedrig', 'Eher Rongai-Route, besonders gegen Ende des Zeitraums'],
          ['01. April-15. Juni', 'Schwierig und gefährlich', 'Angemessene Temperaturen, starker Niederschlag, Schneerisiko, dichte Bewölkung in niedrigeren Höhen', 'Sehr niedrig', 'Alle Routen sind schwierig'],
          ['16. Juni-15. Juli', 'Variabel', 'Sehr kalt, Schnee und Eis am Gipfel, abnehmender Niederschlag, verbesserte Sicht', 'Mittel', 'Eher Rongai-Route, besonders zu Beginn des Zeitraums'],
          ['16. Juli-31. Aug', 'Gut', 'Sehr kalt, Schnee und Eis am Gipfel, geringer Niederschlag, oft klar', 'Hoch', 'Alle Routen geöffnet'],
          ['01. Sept-15. Okt', 'Sehr gut', 'Angemessene Temperaturen, geringer Niederschlag, oft klar', 'Hoch', 'Alle Routen geöffnet'],
          ['16. Okt-31. Okt', 'Variabel', 'Angemessene Temperaturen, zunehmendes Regenrisiko, verringerte Sicht', 'Mittel', 'Eher Rongai-Route, besonders gegen Ende des Zeitraums'],
          ['01. Nov-15. Dez', 'Schwierig und gefährlich', 'Verringerte Temperaturen, mäßiger Regen und Schnee, Gewitter', 'Niedrig', 'Alle Routen sind schwierig'],
          ['16. Dez-15. Jan', 'Variabel', 'Verringerte Temperaturen, mäßiger Regen und Schnee, dichte Bewölkung in niedrigeren Höhen', 'Sehr hoch', 'Eher Rongai-Route, besonders zu Beginn des Zeitraums'],
        ],
      },
    },
    {heading: 'Beste Zeit für die Besteigung des Kilimandscharo: Fokus auf die Trockenzeiten'},
    {heading: 'Januar bis Anfang März (kurze Trockenzeit)', body: 'Warm, sonnig mit wenig Regen — ausgezeichnet für Aussichten und Komfort.'},
    {heading: 'Ende Juni bis Oktober (lange Trockenzeit)', body: 'Das goldene Zeitalter des Kilimandscharo: trockene Pfade, frische Luft, großartige Panoramen.'},
    {
      heading: 'Zwischensaisonen: Valide Alternativen zu den besten Monaten',
      body: 'November (Regenfälle am Ende des Zyklus) und Dezember (Feiertagsandrang) bieten Übergangswetter — mit Rongai oder Northern Circuit für weniger Schlamm bewältigbar.',
    },
    {
      heading: 'Zu vermeidende Monate: Schwierige Wetterbedingungen am Kilimandscharo',
      body: 'Ende März-Mai (große Regenzeit) und November (kleine Regenzeit) bieten die schwierigsten Bedingungen — starke Regengüsse, rutschige Pfade und Nebel.',
    },
    {
      heading: 'Wichtige Tipps für die Besteigung während des besten Monats für den Kilimandscharo',
      body: 'Routenwahl: Rongai für Beginn der Zwischen-/Trockenzeiten; alle geöffnet in der Hochsaison. Vollmond: buchen Sie für die Gipfelsicht — überlaufen, aber magisch. Unvorhersehbarkeit: bringen Sie Schichten mit; der Gipfel ist immer unter dem Gefrierpunkt. Kostenauswirkung: Trockenzeiten +10-20 %; Rabatte in der Zwischensaison.',
    },
  ],
  faqHeading: 'FAQ zum besten Monat für die Besteigung des Kilimandscharo',
  faqs: [
    {question: 'Was ist der beste Monat, um den Kilimandscharo zu besteigen?', answer: 'September oder Februar — trocken, klar, ausgeglichener Andrang.'},
    {question: 'Was sind die besten Monate für die Besteigung des Kilimandscharo?', answer: 'Januar-März und Juni-Oktober für optimales Wetter.'},
    {question: 'Ist es möglich, den Kilimandscharo während der Regenzeit zu besteigen?', answer: 'Ja, aber riskanter — bevorzugen Sie die Zwischensaison für einen Kompromiss.'},
    {question: 'Beeinflusst die beste Zeit für die Besteigung des Kilimandscharo die Kosten?', answer: 'Ja — Hochsaisonen fügen etwa 20 % hinzu; die Nebensaison ermöglicht Einsparungen.'},
  ],
}

const whatIsTheBestRouteUpKilimanjaroDe: GuideArticleDe = {
  slug: 'what-is-the-best-route-up-kilimanjaro',
  seoTitle: 'Was ist die beste Route auf den Kilimandscharo? | Vollständiger Leitfaden',
  seoDescription: 'Ein vollständiger Leitfaden zu den 7 Kilimandscharo-Besteigungsrouten: Erfolgsquoten, Trekking-Distanzen und wie Sie die beste Route für Ihre Besteigung wählen.',
  heading: 'Kilimandscharo-Routen',
  intro:
    'Es gibt sieben etablierte Routen zur Besteigung des Kilimandscharo, eine beginnt von der Nordseite und die anderen von der Südseite: Northern Circuit, Lemosho, Shira, Machame (die „Whiskey"-Route), Rongai, Marangu (die „Coca-Cola"-Route) und Umbwe. Der Northern Circuit ist die neueste Route und durchquert fast den gesamten Berg, was ein echtes Wildniserlebnis und 360-Grad-Ausblicke bietet. Die Routen Lemosho und Shira nähern sich von Westen, während die Rongai-Route von Norden beginnt.',
  sections: [
    {
      heading: 'Kilimandscharo-Routen: Vollständiger Leitfaden zu den Kilimandscharo-Besteigungsrouten',
      body: 'Die Kilimandscharo-Routen sind die offiziell ausgewiesenen Pfade, die von Trekkern genutzt werden, um den Gipfel des höchsten Berges Afrikas, Uhuru Peak (5.895 m), zu erreichen. Die Wahl der richtigen Kilimandscharo-Besteigungsroute ist eine der wichtigsten Entscheidungen, die Sie bei der Planung Ihres Treks treffen werden. Jede Route unterscheidet sich in Landschaft, Schwierigkeit, Akklimatisierungsprofil, Erfolgsquote und Gesamterlebnis.',
    },
    {heading: 'Wie viele Routen gibt es zur Besteigung des Kilimandscharo?', body: 'Es gibt 7 Hauptrouten am Kilimandscharo, die zur Besteigung des Berges genutzt werden: Northern Circuit, Lemosho, Shira, Machame, Rongai, Marangu und Umbwe.'},
    {heading: 'Elemente, die bei der Wahl Ihrer Kilimandscharo-Besteigungsroute zu berücksichtigen sind', body: 'Um die beste Kilimandscharo-Route für Sie zu wählen, gibt es viele Variablen zu berücksichtigen.'},
    {heading: 'WER:', body: 'Wer besteigt? Die Fähigkeiten der gesamten Gruppe müssen bei der Wahl einer Route berücksichtigt werden. Gibt es Anfänger in Ihrer Gruppe? Gibt es Personen, die noch nie in großer Höhe waren? Wählen Sie eine Route, die für alle geeignet ist.'},
    {heading: 'WAS:', body: 'Was sind die Grenzen Ihrer Besteigung? Haben Sie ein begrenztes Budget? Oder eine begrenzte Anzahl von Tagen für Ihre Reise? Es gibt teurere und günstigere Routen sowie längere und kürzere Dauern. Machen Sie sich ein Bild vom Budget und der Anzahl der Tage, die Sie dem Berg widmen möchten.'},
    {heading: 'WIE:', body: 'Wie stellen Sie sich Ihr Trekking vor? Möchten Sie die schwierigste Route oder eine weniger anspruchsvolle Route? Der Kilimandscharo kann viel Unbehagen und Leiden verursachen. Manche Routen sind gnädiger als andere.'},
    {heading: 'WO:', body: 'Wo möchten Sie Ihre Besteigung beginnen? Die Routen beginnen von allen Seiten des Berges. Ihr Ausgangspunkt beeinflusst die Kosten, die Landschaften und deren Vielfalt.'},
    {heading: 'WARUM:', body: 'Warum besteigen Sie? Ist es Ihnen sehr wichtig, den Gipfel zu erreichen? Dann wählen Sie eine Route mit hoher Erfolgsquote. Möchten Sie die besten Fotos machen? Dann wählen Sie eine landschaftlich reizvolle Route. Möchten Sie einfach dabei sein? Dann wählen Sie eine schnelle und günstige Route.'},
    {heading: 'WANN:', body: 'Wann besteigen Sie? Wenn Sie während der Trockenzeit besteigen, perfekt. Aber wenn Sie während der Regenzeit oder der Zwischensaisonen besteigen, kann die gewählte Route die Schwierigkeit der Besteigung beeinflussen. Besteigungen rund um Feiertage und Vollmonde sind besonders stark frequentiert.'},
    {
      heading: 'Was ist die beste Route zur Besteigung des Kilimandscharo?',
      body: 'Die beste Kilimandscharo-Route hängt von Ihren Prioritäten ab: für die höchste Erfolgsquote, wählen Sie den Northern Circuit oder Lemosho. Für die Landschaft, wählen Sie Lemosho oder Machame. Für Budget und Zeit, wählen Sie Marangu. Für eine Herausforderung, wählen Sie Umbwe.',
    },
    {
      heading: 'Karte der Kilimandscharo-Routen und Trekking-Distanzen',
      body: 'Die Gesamt-Trekking-Distanzen variieren je nach Route.',
      table: {columns: ['Route', 'Gesamtdistanz'], rows: [['Lemosho', '70 km'], ['Machame', '62 km'], ['Marangu', '64 km'], ['Northern Circuit', '96 km'], ['Rongai', '65 km']]},
    },
    {
      heading: 'Erfolgsquote des Kilimandscharo nach Route',
      table: {columns: ['Route', 'Erfolgsquote'], rows: [['Northern Circuit', '95%'], ['Lemosho', '90%'], ['Machame', '85%'], ['Rongai', '80%'], ['Marangu', '65%'], ['Umbwe', '50%']]},
    },
    {
      heading: 'Wie Sie Ihre Kilimandscharo-Route wählen',
      body: 'Um zwischen den Kilimandscharo-Routen zu wählen, berücksichtigen Sie die Fähigkeiten Ihrer Gruppe, Ihr Budget, die verfügbare Zeit, den gewünschten Schwierigkeitsgrad, den Ausgangspunkt, Ihre persönliche Motivation und die geplante Saison für Ihre Besteigung.',
    },
    {
      heading: 'Warum Ihre Kilimandscharo-Route bei Climbing Kilimanjaro Tanzania buchen?',
      body: 'Die Wahl der richtigen Route ist nur ein Teil Ihres Erfolgs. Die Buchung bei einem vertrauenswürdigen, erfahrenen lokalen Veranstalter wie Asili Climbing Kilimanjaro garantiert zertifizierte Guides, faire Behandlung der Träger und einen sicherheitsorientierten Ansatz auf jeder Route.',
    },
    {
      heading: 'Planen Sie noch heute Ihre ideale Kilimandscharo-Route',
      body: 'Entdecken Sie detaillierte Analysen aller Kilimandscharo-Routen, Beispielreiseverläufe und Expertenrat bei Climbing Kilimanjaro Tanzania — Ihrer vertrauenswürdigen Ressource für eine sichere und erfolgreiche Besteigung des Kilimandscharo.',
    },
  ],
  faqHeading: 'FAQ zu den Kilimandscharo-Routen',
  faqs: [
    {question: 'Welche Kilimandscharo-Route hat die höchste Erfolgsquote?', answer: 'Der Northern Circuit hat dank ausgezeichneter Akklimatisierung die höchste Erfolgsquote.'},
    {question: 'Wie viele Routen gibt es zur Besteigung des Kilimandscharo?', answer: 'Es gibt sieben Hauptrouten zur Besteigung des Kilimandscharo.'},
    {question: 'Was ist die beste Route für den Kilimandscharo?', answer: 'Die Lemosho-Route wird am meisten empfohlen für das Gesamterlebnis, die Erfolgsquote und die Landschaften.'},
    {question: 'Wie lang ist die Trekking-Distanz am Kilimandscharo?', answer: 'Variabel: von 50 bis 90 km insgesamt, je nach Route.'},
    {question: 'Wie hoch ist die Erfolgsquote am Kilimandscharo?', answer: 'Insgesamt 65 bis 80 %; je nach Route, von 50 % (kurz) bis 98 % (lang).'},
  ],
}

const kilimanjaroGuideCostDe: GuideArticleDe = {
  slug: 'kilimanjaro-guide-cost',
  seoTitle: 'Kosten für den Kilimandscharo-Guide | Vollständiger Preisleitfaden für die Besteigung des Kilimandscharo',
  seoDescription: 'Ein vollständiger Preisleitfaden für die Besteigung des Kilimandscharo: Kosten nach Route, nach Paket, was enthalten ist, und die Verbindung zwischen Kosten und Gipfelerfolgsquote.',
  heading: 'Kosten der Kilimandscharo-Besteigung in Tansania',
  intro:
    'Die Besteigung des Kilimandscharo kostet zwischen 1.680 $ und über 7.000 $ pro Person, je nach Veranstalter und Serviceniveau. Budgetreisen variieren von etwa 1.680 $ bis 2.500 $, mittelklassige Touren von 2.500 $ bis 4.000 $, und Luxusbesteigungen können 4.000 $ oder mehr kosten, wobei High-End-Optionen über 7.000 $ erreichen können. Die Gesamtkosten variieren je nach Faktoren wie Route, Anzahl der Tage, Gruppengröße und enthaltenen Leistungen, wobei ein erheblicher Teil des Preises für obligatorische Parkgebühren bestimmt ist.',
  sections: [
    {
      heading: 'Kosten für den Kilimandscharo-Guide: Vollständiger Preisleitfaden für die Besteigung des Kilimandscharo',
      body: 'Das Verständnis der Kosten für den Kilimandscharo-Guide ist entscheidend für die Planung Ihrer Traumexpedition zum höchsten Gipfel Afrikas. Der Gesamtpreis der Kilimandscharo-Besteigung hängt von mehreren Faktoren ab, darunter die Wahl der Route, die Anzahl der Tage, das Komfortniveau, die Gruppengröße und die Qualität des Guide-Unternehmens.',
    },
    {heading: 'Faktoren, die die Kosten beeinflussen', body: 'Serviceniveau: Premium-Pakete umfassen mehr Leistungen, besseres Essen und hochwertigere Ausrüstung, während Budgetoptionen sich auf das Wesentliche konzentrieren.'},
    {heading: 'Zusätzliche zu berücksichtigende Kosten', body: 'Trinkgelder: Trinkgeld für Guides, Träger und Köche ist üblich und kann zwischen 150 $ und 300 $ pro Person variieren. Flüge: internationale und inländische Flugtickets sind in der Regel nicht in den Paketen enthalten.'},
    {
      heading: 'Kilimandscharo-Pakete',
      body: 'Besteigen Sie Afrikas höchsten Gipfel in einem privaten, maßgeschneiderten Abenteuer, geführt von erfahrenen lokalen Guides. Alle Pakete umfassen flexible Abreisetermine und Ihr privates Team aus Guides, Trägern und Köchen. Mahlzeiten werden in Ihrem privaten Speisezelt serviert. Pfade und Camps werden mit anderen Trekkern geteilt.',
    },
    {heading: 'Marangu-Route (5 Tage / 4 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '2.008 $'], ['2 Trekker geteilt', '1.783 $'], ['3-4 Trekker geteilt', '1.678 $']]}},
    {heading: 'Marangu-Route (6 Tage / 5 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '3.588 $'], ['2 Trekker geteilt', '2.938 $'], ['3-4 Trekker geteilt', '2.668 $']]}},
    {heading: 'Machame- oder Umbwe-Route (6 Tage / 5 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '2.328 $'], ['2 Trekker geteilt', '2.078 $'], ['3-4 Trekker geteilt', '1.948 $']]}},
    {heading: 'Machame- oder Umbwe-Route (7 Tage / 6 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '2.608 $'], ['2 Trekker geteilt', '2.348 $'], ['3-4 Trekker geteilt', '2.203 $']]}},
    {heading: 'Shira-, Lemosho- oder Rongai-Route (6 Tage / 5 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '2.648 $'], ['2 Trekker geteilt', '2.243 $'], ['3-4 Trekker geteilt', '2.063 $']]}},
    {heading: 'Shira-, Lemosho- oder Rongai-Route (7 Tage / 6 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '2.938 $'], ['2 Trekker geteilt', '2.513 $'], ['3-4 Trekker geteilt', '2.313 $']]}},
    {heading: 'Shira-, Lemosho- oder Rongai-Route (8 Tage / 7 Trekkingnächte + 2 Hotelnächte)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '3.228 $'], ['2 Trekker geteilt', '2.773 $'], ['3-4 Trekker geteilt', '2.568 $']]}},
    {heading: 'Northern-Circuit-Route (8 Tage / 7 Nächte + Toilettenmiete)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '3.588 $'], ['2 Trekker geteilt', '2.938 $'], ['3-4 Trekker geteilt', '2.668 $']]}},
    {heading: 'Northern-Circuit-Route (9 Tage / 8 Nächte + Toilettenmiete)', table: {columns: ['Art des Trekkers', 'Preis'], rows: [['1 Trekker allein', '3.918 $'], ['2 Trekker geteilt', '3.228 $'], ['3-4 Trekker geteilt', '2.683 $']]}},
    {
      heading: 'Kosten des Kilimandscharo-Trekkings im Vergleich zur Erfolgsquote',
      body: 'Höhere Kosten korrelieren im Allgemeinen mit höheren Gipfelerfolgsquoten am Kilimandscharo, da teurere Treks längere Routen nutzen, die eine bessere Akklimatisierung ermöglichen, bessere Sicherheitsmaßnahmen umfassen und sich hochwertigerer Veranstalter bedienen. Budget-Treks sind günstiger, haben aber aufgrund kürzerer Dauer und geringerer Sicherheitsvorkehrungen eine niedrigere Erfolgsquote und können am Wohlergehen des Teams und der Ausrüstung sparen. Für eine erfolgreiche Besteigung wird empfohlen, eine Route von mindestens sieben Tagen und einen zuverlässigen Veranstalter zu wählen.',
    },
    {
      heading: 'Höhere Kosten, höhere Erfolgsquote',
      body: 'Routen: längere Routen wie Lemosho oder Northern Circuit bieten höhere Erfolgsquoten (bis zu 98-99 %), da sie dem Körper mehr Zeit zur Höhenanpassung geben. Kosten: diese Routen kosten oft mehr (2.000 $ bis 4.550 $ oder mehr) aufgrund der längeren Dauer und des höheren logistischen Unterstützungsbedarfs. Qualität des Veranstalters: zuverlässige Veranstalter berechnen höhere Preise, bieten aber wesentliche Sicherheitsmaßnahmen wie angemessene Ausrüstung, hochwertiges Essen, faire Löhne für Träger und erfahrene Guides.',
    },
    {
      heading: 'Niedrigere Kosten, niedrigere Erfolgsquote',
      body: 'Routen: kürzere Routen wie Marangu (5-6 Tage) sind günstiger, haben aber niedrigere Erfolgsquoten (65-70 %), da sie nicht genug Zeit für die Akklimatisierung lassen. Kosten: Budget-Treks können nur 1.500 $ bis 2.500 $ kosten, aber dies resultiert oft aus Einsparungen bei entscheidenden Aspekten. Qualität des Veranstalters: Budget-Veranstalter könnten Träger unterbezahlen, unzureichendes Essen bereitstellen und Ausrüstung von geringer Qualität verwenden, was Sicherheit und Moral beeinträchtigen kann.',
    },
    {
      heading: 'Preis des Kilimandscharo-Trekkings: Was sollte enthalten sein?',
      body: 'Ein zuverlässiges Paket sollte immer Folgendes umfassen: alle Parkgebühren, staatliche Rettungsdienste und Notfallhilfe, Unterkunft auf dem Berg, Flughafentransfers, professionelle Guides, Mahlzeiten und Trinkwasser, Sauerstoffflaschen und Erste Hilfe. Vermeiden Sie Veranstalter, die diese wesentlichen Kosten verstecken.',
    },
  ],
}

const kilimanjaroClimbingGuideDe: GuideArticleDe = {
  slug: 'kilimanjaro-climbing-guide',
  seoTitle: 'Kilimandscharo-Besteigungsleitfaden | Wesentliche Tipps für die Besteigung des Kilimandscharo',
  seoDescription: 'Wesentliche Tipps für die Besteigung des Kilimandscharo: Training, Akklimatisierung, Saisons, Sicherheit, Sauerstoff, medizinische Ausrüstung und was Sie auf dem Berg erwartet.',
  heading: 'Wesentliche Tipps für die Besteigung des Kilimandscharo',
  heroImage: {src: '/images/articles/guide-hero.webp', alt: 'Ein Kletterer vor dem Uhuru-Peak-Gipfelschild'},
  intro:
    'Der Kilimandscharo, der auf 5.895 Metern über dem Meeresspiegel gipfelt, ist der höchste freistehende Berg der Welt und das „Dach Afrikas". Als eines der begehrtesten Reiseziele des Kontinents zieht der Kilimandscharo jedes Jahr über 40.000 Besucher an. Dieses großartige Trekking erfordert keine technischen Kletterfähigkeiten, was es für jeden mit durchschnittlich guter körperlicher Verfassung zugänglich macht. Dieser Leitfaden soll Kletternden helfen, sich auf ihr einmaliges Abenteuer vorzubereiten. Unsere Empfehlungen basieren auf unserer umfangreichen Erfahrung — bei Asili Climbing Kilimanjaro haben wir erfolgreich Treks für Tausende von Kletternden organisiert.',
  sections: [
    {heading: 'Fakten, die Sie vor Ihrem Kilimandscharo-Trekking kennen sollten', body: 'Der Gipfel des Kilimandscharo, Uhuru Peak, gipfelt auf 5.895 m — der höchste Punkt Afrikas und der höchste freistehende Berg der Welt.'},
    {heading: 'Sich auf den Kilimandscharo vorbereiten und trainieren'},
    {
      heading: 'Wie sollte ich für eine Besteigung des Kilimandscharo trainieren?',
      body: 'Eine gute körperliche Verfassung ist entscheidend für die Besteigung des Kilimandscharo. Sie müssen jedoch kein Spitzensportler sein, um den Gipfel zu erreichen. Eine durchschnittlich gute körperliche Verfassung reicht aus. Um Ihre Vorbereitung einzuschätzen, prüfen Sie, ob Sie bequem 8-10 km gehen können. Wenn ja, sind Sie fit genug, um den Kilimandscharo zu besteigen. Laufen ist eine ausgezeichnete Vorbereitungsübung — streben Sie an, 4-5 km sicher laufen zu können. Schwimmen ist eine weitere ausgezeichnete Ergänzung zu Ihrem Training, da es die kardiovaskuläre Ausdauer stärkt.',
    },
    {
      heading: 'Was sind die Regen- und Trockenzeiten in Tansania?',
      body: 'Tansania kennt zwei Regenzeiten und zwei Trockenzeiten. Die kurze Regenzeit beginnt Anfang November und dauert bis Ende Dezember, gefolgt von einer Trockenzeit, die bis Mitte März anhält. Die lange Regenzeit beginnt Mitte März und endet Mitte Juni. Um den Kilimandscharo während der Regenzeit zu besteigen, ziehen Sie die Nordhänge in Betracht — dieses Gebiet erhält deutlich weniger Niederschlag. Empfohlene Routen umfassen Rongai, Northern Circuit und Marangu. Von Juni bis Oktober erlebt Ostafrika kalte Nächte, besonders in großer Höhe.',
    },
    {heading: 'Weitere Trekking-Informationen'},
    {heading: 'Packliste für den Kilimandscharo', body: 'Ein kostenloser Ausrüstungsleitfaden für den Kilimandscharo mit wesentlicher Ausrüstung und Expertenempfehlungen von Asili Climbing Kilimanjaro.'},
    {heading: 'Planen Sie, den Kilimandscharo zu besteigen?', body: 'Wir sind hier, um Ihnen klare Antworten und Expertenrat zu geben — kontaktieren Sie uns bei Fragen und machen Sie den ersten Schritt mit Zuversicht.'},
  ],
  faqHeading: 'Fragen zur Sicherheit am Kilimandscharo',
  faqs: [
    {
      question: 'Können Sie eine zuverlässige Reiseversicherung empfehlen?',
      answer: 'Asili Climbing Kilimanjaro empfiehlt Global Rescue für einen zuverlässigen Reiseversicherungsschutz. Stellen Sie sicher, dass Ihre Police drei Schlüsselelemente umfasst: Deckung für Höhentrekking bis zu 6.000 Metern, Hubschrauberevakuierung und umfassende medizinische Dienstleistungen.',
    },
    {
      question: 'Haben Sie Tipps für eine bessere Akklimatisierung während der Besteigung des Kilimandscharo?',
      answer: 'Um sich gut zu akklimatisieren und Ihre Besteigung erfolgreich zu meistern, empfehlen wir: langsam zu gehen (Ihr Körper braucht Zeit, um sich an niedrigere Sauerstoffwerte anzupassen, und ein moderates Tempo hilft ihm, mehr rote Blutkörperchen zu produzieren); 3-4 Liter Wasser pro Tag zu trinken; an unseren täglichen Akklimatisierungswanderungen in die Höhe und zurück teilzunehmen (in der Regel nicht länger als 2 Stunden); und, wenn Sie Zeit haben, eine Besteigung des Mount Meru vor Ihrer Kilimandscharo-Reise in Betracht zu ziehen. Die Wahl von Routen mit sieben oder mehr Tagen gibt Ihrem Körper ebenfalls mehr Zeit zur Anpassung und verbessert Ihre Chancen, den Gipfel zu erreichen.',
    },
    {question: 'Was ist die beste Route für die Akklimatisierung?', answer: 'Um sich am besten am Kilimandscharo zu akklimatisieren, sind die besten Routen Lemosho, Machame und Rongai — oder andere Routen mit sieben oder mehr Tagen.'},
    {
      question: 'Wie viele zusätzliche Akklimatisierungstage sollte ich einplanen?',
      answer: 'Auf der siebentägigen Machame-Route benötigen Sie keine zusätzlichen Akklimatisierungstage. Rongai und Lemosho sind ebenso gute Optionen. Wenn Sie jedoch glauben, nicht in optimaler körperlicher Verfassung zu sein, können Sie ein oder zwei zusätzliche Ruhetage hinzufügen.',
    },
    {
      question: 'Werden Sauerstoffsysteme benötigt, um den Kilimandscharo zu besteigen?',
      answer: 'Am Gipfel des Kilimandscharo beträgt der Sauerstoffgehalt in der Luft etwa die Hälfte des Werts auf Meereshöhe. Die meisten Kletternden können Uhuru Peak ohne zusätzlichen Sauerstoff erreichen, aber zur Sicherheit tragen wir während unserer Expeditionen immer mehrere Sauerstoffflaschen mit, und die Kosten sind im Tourpreis enthalten.',
    },
    {
      question: 'Muss ich ein medizinisches Set mitbringen?',
      answer: 'Während der Kilimandscharo-Expeditionen tragen unsere Teams vollständige medizinische Sets mit — kleine taktische Sets während der Wanderungen für Verletzungen, Kratzer oder Verstauchungen, und größere Feldsets mit Medikamenten für häufige Probleme wie Übelkeit, Kopfschmerzen, Erbrechen und Verdauungsstörungen. Wenn Sie verschreibungspflichtige Medikamente einnehmen, ist es am besten, diese während Ihrer Reise nach Tansania mitzunehmen.',
    },
    {
      question: 'Wie hoch ist die Sterblichkeitsrate am Kilimandscharo?',
      answer: 'Im Vergleich zu anderen Bergen hat der Kilimandscharo auf seinen sieben Routen eine niedrige Sterblichkeitsrate. Von den etwa 50.000 Menschen, die jedes Jahr den Kilimandscharo besteigen, verlieren 3 bis 5 ihr Leben, hauptsächlich aufgrund höhenbedingter Gehirn- und Lungenprobleme oder Herzinfarkten durch mangelnde Akklimatisierung. Die Sterblichkeitsrate unter den Kilimandscharo-Trägern ist deutlich höher, größtenteils aufgrund von Billigveranstaltern, die unzureichende Ausrüstung bereitstellen. Wählen Sie immer ein bei KPAP registriertes Unternehmen, um zu einer fairen Behandlung der Träger beizutragen.',
    },
    {question: 'Warum heißt der Gipfel des Kilimandscharo Uhuru Peak?', answer: '„Uhuru" bedeutet auf Suaheli „Freiheit". Der höchste Gipfel des Kilimandscharo wurde Uhuru Peak genannt, um Tansanias Unabhängigkeit von Großbritannien im Jahr 1961 zu feiern.'},
    {
      question: 'Kann ich nach der Besteigung des Kilimandscharo eine Safari machen?',
      answer: 'Ja — Tansania besitzt berühmte Reiseziele für jede Art von afrikanischem Abenteuer, wobei der Serengeti-Nationalpark und der Ngorongoro-Krater die beliebtesten sind. Es ist eine ausgezeichnete Idee, eine Safari vor oder nach der Besteigung zu planen.',
    },
  ],
}

const planATripToClimbKilimanjaroDe: GuideArticleDe = {
  slug: 'information-on-how-to-plan-a-trip-to-climb-mount-kilimanjaro-in-tanzania',
  seoTitle: 'Wie Sie eine Reise zur Besteigung des Kilimandscharo planen | Vollständiger Referenzleitfaden',
  seoDescription: 'Alles, was Sie brauchen, um eine Reise zum Kilimandscharo zu planen: Bergcamps, Parkgebühren, Gletscher, Höhenmeter pro Route, Höhenrisiken und wie Sie hingelangen.',
  heading: 'Informationen zur Planung einer Reise zur Besteigung des Kilimandscharo in Tansania',
  intro:
    'Die Planung einer Reise zur Besteigung des Kilimandscharo umfasst weit mehr als die Wahl eines Datums. Dieser Referenzleitfaden deckt das Wesentliche ab: wo sich der Berg befindet, seine Kosten an offiziellen Parkgebühren, die Camps, in denen Sie unterwegs übernachten werden, die Gletscher, die Sie nahe dem Gipfel sehen werden, die Höhenmeter jeder Route und die realen Risiken, die damit verbunden sind — damit Sie mit Zuversicht planen und mit Asili Climbing Kilimanjaro klettern können.',
  sections: [
    {
      heading: 'Wo befindet sich der Kilimandscharo?',
      body: 'Der Kilimandscharo befindet sich im Norden Tansanias, nahe der Grenze zu Kenia, innerhalb des Kilimandscharo-Nationalparks. Die nächstgelegenen Städte sind Moshi und Arusha, beide vom Kilimanjaro International Airport (JRO) aus erreichbar.',
    },
    {
      heading: 'Höhenmeter des Kilimandscharo',
      body: 'Der Kilimandscharo ist Afrikas höchster Berg und der höchste freistehende Berg der Welt, mit einem Höhenunterschied von etwa 4.900 Metern von der Basis bis zum Gipfel. Der Gipfel des Berges, Uhuru Peak, gipfelt auf 5.895 Metern über dem Meeresspiegel. Der Höhenunterschied ist beträchtlich und anspruchsvoll, was die Akklimatisierung für Kletternde entscheidend macht, um Höhenkrankheit zu vermeiden.',
      table: {
        columns: ['Route', 'Starthöhe'],
        rows: [
          ['Northern Circuit', '2.100 m am Lemosho Gate'],
          ['Lemosho-Route', '2.100 m am Lemosho Gate'],
          ['Shira-Route', '3.414 m an der Morum Barrier'],
          ['Machame-Route', '1.640 m am Machame Gate'],
          ['Marangu-Route', '1.843 m am Marangu Gate'],
          ['Rongai-Route', '1.950 m am Rongai Gate'],
          ['Umbwe-Route', '1.800 m am Umbwe Gate'],
        ],
      },
    },
    {
      heading: 'Bergcamps am Kilimandscharo',
      body: 'Je nach Ihrer Route übernachten Sie in einer Reihe von Hütten oder Zeltcamps entlang des Berges. Häufige Camps umfassen Mandara Hut, Horombo Hut, Kibo Hut, Machame Camp, Barafu Hut Camp, Lava Tower Camp, Barranco Hut Camp, Karanga Hut Camp, Mweka Camp, Shira 1 & 2 Camps, School Hut Camp und Umbwe Cave Camp, unter anderem. Ihr Guide und Ihr Trägerteam bauen das Camp jeden Tag vor Ihrer Ankunft auf.',
    },
    {
      heading: 'Die schwindenden Gletscher des Kilimandscharo',
      body: 'Der Kilimandscharo ist bekannt für seine vier berühmten Gletscher: das Northern Ice Field, das Eastern Ice Field, das Southern Ice Field und den Furtwängler-Gletscher. Diese Gletscher existieren nahe dem Äquator nur aufgrund der großen Höhe des Berges — aber sie schwinden aufgrund des Klimawandels rapide. Allein der Furtwängler-Gletscher hat seit Beginn des 20. Jahrhunderts über 80 % seiner Masse verloren, und aktuelle Schätzungen deuten darauf hin, dass die Eisfelder des Kilimandscharo innerhalb weniger Jahrzehnte vollständig verschwinden könnten.',
    },
    {
      heading: 'Gebühren des Kilimandscharo-Nationalparks',
      body: 'Die Gebühren des Kilimandscharo-Nationalparks sind obligatorische Kosten für Besucher, die den Park erkunden und den Berg besteigen möchten. Diese Gebühren umfassen den Parkeintritt, Camping, Rettungsgebühren sowie Guide- und Träger-Dienstleistungen und variieren im Allgemeinen zwischen 2.000 $ und 6.000 $ pro Person, je nach Route und Dauer.',
      table: {
        columns: ['Gebührenart', 'Kosten'],
        rows: [
          ['Rettungsgebühr', '20 $ (einmalig)'],
          ['Naturschutzgebühr', '70 $ pro Person und Tag'],
          ['Campinggebühr', '50 $ pro Person und Nacht'],
          ['Hüttengebühr (Marangu-Route)', '60 $ pro Person und Nacht'],
          ['Kratergebühr', '100 $ pro Person und Nacht'],
        ],
      },
    },
    {
      heading: 'Todesfälle am Kilimandscharo',
      body: 'Trotz seiner Beliebtheit birgt die Besteigung des Kilimandscharo ein reales Risiko: Schätzungen zufolge sterben jedes Jahr 3 bis 7 Kletternde, hauptsächlich aufgrund von Höhenkrankheit (akute Höhenkrankheit, die sich zu HAPE oder HACE entwickeln kann), Unterkühlung und Stürzen. Die „Todeszone" bezeichnet Höhen über etwa 8.000 Fuß, wo die verringerte Sauerstoffmenge das Überleben ohne angemessene Akklimatisierung zunehmend erschwert. Die Wahl einer längeren Route, eines zuverlässigen Veranstalters und das Befolgen des Tempos Ihres Guides verringert dieses Risiko erheblich.',
    },
    {heading: 'Wo befindet sich der Kilimandscharo?', body: 'Entdecken Sie die Lage des Berges auf der Karte unten.'},
  ],
}

const kilimanjaroClimbingDe: GuideArticleDe = {
  slug: 'kilimanjaro-climbing',
  seoTitle: 'Besteigung des Kilimandscharo | Maßgeschneiderte Abenteuer',
  seoDescription: 'Maßgeschneiderte Kilimandscharo-Besteigungsabenteuer. Entdecken Sie unsere Routen, Pakete und alles, was Sie vor der Besteigung von Afrikas höchstem Gipfel wissen müssen.',
  heading: 'Besteigung des Kilimandscharo',
  heroImage: {src: '/images/articles/climbing-hero.jpg', alt: 'Trekker auf dem Kilimandscharo-Pfad'},
  intro:
    'Der Kilimandscharo, der auf 5.895 Metern gipfelt, ist der höchste freistehende Berg der Welt, was ihm den Titel „Dach Afrikas" einbringt. Jedes Jahr durchqueren Tausende von Abenteurern seine landschaftlich reizvollen Pfade und entdecken vielfältige Landschaften und atemberaubende Ausblicke. Es sind keine technischen Kletterfähigkeiten erforderlich — nur gute Gesundheit, Entschlossenheit und das richtige Team, das Sie führt. Bei Asili Climbing Kilimanjaro gestalten wir maßgeschneiderte Abenteuer für Ihre Traum-Kilimandscharo-Besteigung.',
  sections: [
    {
      heading: 'Kilimandscharo-Besteigungsrouten',
      body:
        'Machame-Route: bekannt als die Whiskey Route, ist Machame die beliebteste Kilimandscharo-Route, die atemberaubende Landschaften und vielfältiges Gelände bietet. Obwohl anspruchsvoll mit steilen Pfaden und Zeltcamps, bietet sie eine ausgezeichnete Akklimatisierung für Kletternde, die ein kürzeres, aber lohnendes Trekking suchen.\nLemosho-Route: eine der landschaftlich reizvollsten Routen am Kilimandscharo, Lemosho beginnt am abgelegenen Londorossi Gate und durchquert das prächtige Shira-Plateau. Diese Route bietet eine ruhige Besteigung mit spektakulären Ausblicken, reicher Tierwelt und einem schrittweisen Aufstieg für ein komfortables Erlebnis.\nRongai-Route: die einzige nördliche Route am Kilimandscharo, Rongai ist weniger frequentiert und sanfter, was sie zu einer ausgezeichneten Wahl für alle macht, die eine ruhige und gleichmäßige Besteigung bevorzugen. Diese Route ist ideal während der Regenzeit, da sie weniger Niederschlag erhält.\nNorthern-Circuit-Route: die längste und landschaftlich reizvollste Route, der Northern Circuit bietet die beste Akklimatisierung, indem er schrittweise um den Kilimandscharo herumführt. Mit Panoramablicken und einer hohen Erfolgsquote bietet diese Route ein ruhiges und immersives Trekking-Erlebnis.',
    },
    {
      heading: 'Kilimandscharo-Besteigungspakete',
      body:
        'Wählen Sie aus unseren sorgfältig gestalteten Kilimandscharo-Besteigungspaketen, jedes darauf ausgelegt, das beste Erlebnis entsprechend Ihren Vorlieben, Ihrem Fitnessniveau und Ihrer gewünschten Route zu bieten. Ob Sie eine schnelle Besteigung oder ein verlängertes, landschaftlich reizvolles Trekking suchen, wir haben die perfekte Route für Sie.\nLemosho-Route 8 Tage: mit acht Reisetagen dauert Ihr Kilimandscharo-Trekking auf der Lemosho-Route länger als Alternativen und ermöglicht eine ausgezeichnete Akklimatisierung.\nMachame-Route 7 Tage: die berühmte Machame-Route mit einer Gesamtreisezeit von sieben Tagen, die Ihnen noch mehr Akklimatisierungszeit bietet.\nMarangu-Route 6 Tage: eine sechstägige Reise zur Besteigung von Afrikas höchstem Gipfel über die berühmte Marangu-Route, mit Hüttenübernachtung und vielfältigen Landschaften.\nUmbwe-Route 6 Tage: bekannt für ihre schwierige, steile Besteigung und ihren wunderschönen, weniger frequentierten Pfad.\nNorthern Circuit 9 Tage: die neueste und längste Route, die 360-Grad-Ausblicke und die besten Erfolgsquoten für die Gipfelbesteigung bietet.\nRongai-Route 7 Tage: von Norden angegangen, bietet diese Route eine einzigartige Perspektive des Kilimandscharo und ist perfekt für alle, die ein ruhigeres Trekking suchen.',
    },
    {
      heading: 'Was Sie vor der Besteigung des Kilimandscharo wissen sollten',
      body:
        'Erhalten Sie alle wesentlichen Informationen, um sich auf Ihre Besteigung vorzubereiten — von Routen bis zu Sicherheitstipps, für eine reibungslose und erfolgreiche Besteigung.\nTemperaturüberlegungen: die Tagestemperaturen variieren von 20°C bis 27°C in niedrigeren Höhen, fallen aber in großer Höhe unter den Gefrierpunkt, besonders nachts. Schichtkleidung ist unerlässlich.\nVegetation und Landschaften: die Trockenzeiten bieten klarere Ausblicke, blühende Wildblumen und üppige Wälder entlang der Pfade. Feuchtere Saisons können neblige Bedingungen und dichte Wolkendecke mit sich bringen.\nAndrangsniveaus: die Hochsaisonen (Januar-Februar und Juli-September) ziehen mehr Kletternde an. Die Zwischensaisonen (Ende März-Mai und Anfang November-Dezember) bieten ruhigere Erlebnisse.\nPersönliche Vorlieben und Ziele: Kletternde sollten Wetterbedingungen, ihre eigenen Temperaturvorlieben, das Andrangsniveau und ihre persönlichen Verpflichtungen bei der Planung ihrer Besteigung berücksichtigen.',
    },
    {
      heading: 'Bereit, die Herausforderung des Kilimandscharo anzunehmen?',
      body: 'Ihre Reise zum Dach Afrikas beginnt hier. Ob Sie das Abenteuer Ihres Lebens anstreben oder sich über Ihre Grenzen hinaus bis zum Gipfel drängen möchten, wir sind hier, um Sie in jeder Phase zu führen.',
    },
  ],
  faqHeading: 'Ihre Fragen und Unsere Antworten',
  faqs: [
    {
      question: 'Welche Routen stehen für den Kilimandscharo zur Verfügung?',
      answer:
        'Der Kilimandscharo bietet mehrere Routen, die für Kletternde jeden Niveaus, jeder Präferenz und jedes Trekking-Stils geeignet sind. Bei Asili Climbing Kilimanjaro sind wir auf die vier beliebtesten Routen spezialisiert: Rongai, Lemosho, Northern Circuit und Machame. Unsere geführten Besteigungen gewährleisten Sicherheit, angemessene Akklimatisierung und eine unvergessliche Reise zum Gipfel.',
    },
    {question: 'Welche Kilimandscharo-Route ist die am wenigsten frequentierte?', answer: 'Die Northern Circuit Route ist die am wenigsten frequentierte und bietet ein ruhiges, isoliertes Trekking-Erlebnis.'},
    {question: 'Welche ist die einfachste Route, um den Kilimandscharo zu besteigen?', answer: 'Die Rongai Route gilt dank ihrer schrittweisen Steigungen und ihres direkten Aufstiegs als die einfachste.'},
    {question: 'Welche Kilimandscharo-Route ist die landschaftlich reizvollste?', answer: 'Die Lemosho Route wird oft als die landschaftlich reizvollste angesehen, mit atemberaubenden Landschaften, vielfältigen Ökosystemen und Panoramablicken.'},
    {
      question: 'Was kostet die Besteigung des Kilimandscharo?',
      answer:
        'Die Kosten für die Besteigung des Kilimandscharo variieren zwischen 2.500 $ und 4.000 $, je nach Routenwahl, Dauer, Gruppengröße, Serviceniveau und enthaltenen Leistungen. Bei Asili Climbing Kilimanjaro garantieren wir gut ausgebildete Guides, hohe Sicherheitsstandards und ein insgesamt außergewöhnliches Erlebnis.',
    },
    {question: 'Wie lange dauert es, den Kilimandscharo zu besteigen?', answer: 'Die Besteigung dauert in der Regel 6 bis 9 Tage, je nach gewählter Route. Ein längerer Reiseverlauf ermöglicht eine bessere Akklimatisierung und erhöht die Chancen auf ein erfolgreiches und angenehmes Gipfelerlebnis.'},
    {
      question: 'Können Einsteiger den Kilimandscharo besteigen?',
      answer:
        'Ja! Obwohl keine technischen Kletterkenntnisse erforderlich sind, sollten Einsteiger ein angemessenes körperliches Training vor dem Versuch absolvieren. Unsere erfahrenen Guides sorgen dafür, dass Einsteiger-Kletternde während der gesamten Reise die notwendige Unterstützung erhalten.',
    },
    {question: 'Wann ist die beste Zeit, um den Kilimandscharo zu besteigen?', answer: 'Die besten Saisons für die Besteigung sind die Trockenmonate: Januar bis März und Juni bis Oktober, die die besten Wetterbedingungen und einen klareren Himmel bieten.'},
    {
      question: 'Wichtige Tipps für den Erfolg Ihrer Besteigung',
      answer:
        'Gehen Sie langsam — ein gleichmäßiges Tempo verringert das Risiko von Höhenkrankheit. Hydrieren Sie sich — trinken Sie viel Wasser. Besorgen Sie sich die richtige Ausrüstung — angemessene Schichten, robuste Schuhe und hochwertige Ausrüstung. Bereiten Sie sich körperlich und mental vor. Genießen Sie es und knüpfen Sie Kontakte — die Verbindung mit anderen Kletternden macht die Reise bereichernder.',
    },
    {question: 'Braucht man einen Guide, um den Kilimandscharo zu besteigen?', answer: 'Ja! Die Besteigung des Kilimandscharo ohne lizenzierten Guide ist nicht erlaubt.'},
    {question: 'Warum brauche ich einen Guide?', answer: 'Guides bringen ihr Fachwissen ein, überwachen Ihre Gesundheit, gewährleisten Ihre Sicherheit und helfen Ihnen, sich im anspruchsvollen Gelände des Kilimandscharo zurechtzufinden.'},
    {question: 'Können erfahrene Kletternde auf einen Guide verzichten?', answer: 'Auch erfahrene Kletternde müssen von einem Guide begleitet werden. Die große Höhe und die unvorhersehbaren Bedingungen machen professionelle Begleitung unerlässlich.'},
    {question: 'Wie verbessern Guides die Sicherheit?', answer: 'Guides überwachen die Akklimatisierung, leisten Erste Hilfe, bewerten die Wetterbedingungen und treffen entscheidende Entscheidungen für den Erfolg der Besteigung.'},
    {
      question: 'Wie schwierig ist die Besteigung des Kilimandscharo?',
      answer:
        'Die Besteigung des Kilimandscharo ist ein anspruchsvolles, aber lohnendes Abenteuer. Die Hauptschwierigkeit ergibt sich aus der großen Höhe und dem vielfältigen Gelände. Mit guter Vorbereitung und erfahrener Begleitung können Kletternde unterschiedlicher Erfahrungsniveaus erfolgreich den Gipfel erreichen.',
    },
    {
      question: 'Wie schläft man auf dem Kilimandscharo?',
      answer:
        'Während Ihres Kilimandscharo-Treks mit uns übernachten Sie in hochwertigen, wetterfesten Zelten, die für Komfort unter extremen Bedingungen ausgelegt sind, mit geräumigen Zelten, isolierenden Matten und warmen Schlafsäcken.',
    },
    {
      question: 'Braucht man Sauerstoff, um den Kilimandscharo zu besteigen?',
      answer: 'Die meisten Kletternden benötigen keinen zusätzlichen Sauerstoff. Der Schlüssel zu einer erfolgreichen Besteigung ist eine gute Akklimatisierung. In seltenen Fällen schwerer Höhenkrankheit steht Sauerstoff als Sicherheitsmaßnahme zur Verfügung.',
    },
  ],
}

async function run() {
  await seedGuideArticleDe(kilimanjaroClimbingSeasonsDe)
  await seedGuideArticleDe(whatIsTheBestRouteUpKilimanjaroDe)
  await seedGuideArticleDe(kilimanjaroGuideCostDe)
  await seedGuideArticleDe(kilimanjaroClimbingGuideDe)
  await seedGuideArticleDe(planATripToClimbKilimanjaroDe)
  await seedGuideArticleDe(kilimanjaroClimbingDe)
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
