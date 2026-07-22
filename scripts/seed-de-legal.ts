/**
 * Phase 6 (German): the 3 legal standardPage docs (privacy-policy,
 * terms-and-conditions, cookies-policy). why-travel-with-us was already
 * seeded in seed-de-bespoke-pages.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-legal.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, bulletBlock} from './lib/pt'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface DeBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: string[]
}

interface DeLegalPage {
  slug: string
  seoTitle: string
  seoDescription: string
  pageTitle: string
  intro: string
  sections: {heading: string; blocks: DeBlock[]}[]
}

const pages: DeLegalPage[] = [
  {
    slug: 'privacy-policy',
    seoTitle: 'Datenschutzerklärung | Asili Climbing Kilimanjaro',
    seoDescription:
      'Lesen Sie die Datenschutzerklärung von Climbing Kilimanjaro Tanzania, um zu erfahren, wie wir Ihre persönlichen Daten sammeln, verwenden, speichern und schützen.',
    pageTitle: 'Datenschutzerklärung',
    intro:
      'Bei Climbing Kilimanjaro Tanzania ist uns Ihre Privatsphäre wichtig. Diese Datenschutzerklärung erklärt, wie wir Ihre persönlichen Daten sammeln, verwenden, speichern und schützen, wenn Sie mit unserer Website oder unseren Dienstleistungen interagieren.',
    sections: [
      {
        heading: 'Welche Informationen wir sammeln',
        blocks: [
          {type: 'paragraph', text: 'Wir können folgende Arten von persönlichen Daten sammeln:'},
          {
            type: 'list',
            items: [
              'Persönliche Daten: Name, E-Mail-Adresse, Telefonnummer, Nationalität, Passinformationen (für Buchungen).',
              'Buchungsinformationen: Reisedaten, Unterkunftspräferenzen, Ernährungsbedürfnisse, Notfallkontakte.',
              'Zahlungsinformationen: Rechnungsadresse und Zahlungsmethode (Hinweis: Wir speichern keine Kreditkartendaten).',
              'Website-Nutzungsdaten: IP-Adresse, Browsertyp, besuchte Seiten und andere Analysedaten.',
            ],
          },
        ],
      },
      {
        heading: 'Wie wir Ihre Informationen verwenden',
        blocks: [
          {type: 'paragraph', text: 'Wir verwenden Ihre Informationen für folgende Zwecke:'},
          {
            type: 'list',
            items: [
              'Beantwortung von Informationsanfragen',
              'Bearbeitung und Verwaltung Ihrer Buchung',
              'Personalisierung Ihres Erlebnisses und Empfehlung geeigneter Reiserouten',
              'Verbesserung unserer Website und Dienstleistungen',
              'Einhaltung unserer rechtlichen Verpflichtungen',
            ],
          },
          {
            type: 'paragraph',
            text: 'Wir werden Ihre persönlichen Daten niemals zu Marketingzwecken an Dritte verkaufen, vermieten oder weitergeben.',
          },
        ],
      },
      {
        heading: 'Wer Zugang zu Ihren Daten hat',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nur autorisierte Mitarbeiter von Climbing Kilimanjaro und vertrauenswürdige Anbieter (wie Safari-Lodges, Hotels oder Transportunternehmen), die an der Organisation Ihrer Tour beteiligt sind, haben Zugang zu Ihren persönlichen Daten. Diese Anbieter sind verpflichtet, Ihre Informationen sicher und vertraulich zu behandeln.',
          },
        ],
      },
      {
        heading: 'Cookies und Tracking',
        blocks: [
          {type: 'paragraph', text: 'Unsere Website verwendet Cookies, um:'},
          {
            type: 'list',
            items: [
              'Ihre Präferenzen zu speichern',
              'Zu verstehen, wie Nutzer mit unseren Inhalten interagieren',
              'Die Leistung und Funktionalität der Website zu verbessern',
            ],
          },
          {
            type: 'paragraph',
            text: 'Sie können Ihre Cookie-Einstellungen über die Einstellungen Ihres Browsers anpassen oder vollständig deaktivieren.',
          },
        ],
      },
      {
        heading: 'Datensicherheit',
        blocks: [
          {
            type: 'paragraph',
            text: 'Wir treffen alle angemessenen Maßnahmen, um Ihre persönlichen Daten mithilfe sicherer Server, Verschlüsselungstools und eingeschränktem Zugriff zu schützen. Obwohl wir bewährte Verfahren befolgen, beachten Sie bitte, dass keine Methode der Datenübertragung im Internet zu 100 % sicher ist.',
          },
        ],
      },
      {
        heading: 'Ihre Rechte',
        blocks: [
          {type: 'paragraph', text: 'Sie haben das Recht:'},
          {
            type: 'list',
            items: [
              'Auf die persönlichen Daten zuzugreifen, die wir über Sie besitzen',
              'Korrekturen oder Aktualisierungen zu beantragen',
              'Ihre Zustimmung zu widerrufen oder die Löschung Ihrer Daten zu beantragen',
              'Bei Bedarf eine Beschwerde bei einer Datenschutzbehörde einzureichen',
            ],
          },
          {type: 'paragraph', text: 'Um Ihre Rechte auszuüben, kontaktieren Sie uns bitte.'},
        ],
      },
      {
        heading: 'Links zu Drittanbietern',
        blocks: [
          {
            type: 'paragraph',
            text: 'Unsere Website kann Links zu externen Websites enthalten. Wir sind nicht verantwortlich für die Datenschutzpraktiken oder Inhalte dieser Websites von Drittanbietern.',
          },
        ],
      },
      {
        heading: 'Änderungen an dieser Erklärung',
        blocks: [
          {
            type: 'paragraph',
            text: 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Alle Änderungen werden auf dieser Seite mit einem aktualisierten „Inkrafttretensdatum" veröffentlicht. Wir laden Sie ein, diese Erklärung regelmäßig zu konsultieren, um auf dem Laufenden zu bleiben.',
          },
        ],
      },
      {
        heading: 'Kontaktieren Sie uns',
        blocks: [
          {
            type: 'paragraph',
            text: 'Wenn Sie Fragen oder Bedenken bezüglich unserer Datenschutzerklärung oder der Art und Weise, wie Ihre Daten verarbeitet werden, haben, kontaktieren Sie uns bitte.',
          },
          {type: 'paragraph', text: 'Telefon: +255 767 140 150. Sitz: Arusha, Tansania.'},
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    seoTitle: 'Allgemeine Geschäftsbedingungen | Asili Climbing Kilimanjaro',
    seoDescription:
      'Lesen Sie die Allgemeinen Geschäftsbedingungen, die für alle Trekkings, Safaris und Kombipakete von Asili Climbing Kilimanjaro gelten.',
    pageTitle: 'Allgemeine Geschäftsbedingungen',
    intro:
      'Durch die Buchung einer Reise mit Asili Climbing Kilimanjaro akzeptieren Sie die unten beschriebenen Allgemeinen Geschäftsbedingungen. Diese Bedingungen gelten für alle unsere Trekkings, Safaris und Kombipakete.',
    sections: [
      {
        heading: '1. Buchung und Bestätigung',
        blocks: [
          {
            type: 'list',
            items: [
              'Eine Buchung wird erst nach Erhalt einer Anzahlung und einer schriftlichen Bestätigung von Asili Climbing Kilimanjaro bestätigt.',
              'Alle Reisenden müssen genaue persönliche Angaben machen, einschließlich vollständigem Namen (wie im Reisepass angegeben), Reisedaten und etwaigen medizinischen oder ernährungsbedingten Bedürfnissen.',
              'Eine Buchung im Namen einer Gruppe bedeutet, dass Sie die Verantwortung für alle Gruppenmitglieder akzeptieren.',
            ],
          },
        ],
      },
      {
        heading: '2. Zahlungen',
        blocks: [
          {
            type: 'list',
            items: [
              'Eine Anzahlung von 30 % ist bei der Buchung erforderlich.',
              'Der Restbetrag muss spätestens 30 Tage vor Reisebeginn bezahlt werden.',
              'Zahlungen können per Banküberweisung, Kreditkarte oder anderen sicheren Methoden erfolgen (es können Gebühren anfallen).',
              'Verspätete Zahlungen können zur Stornierung ohne Rückerstattung führen.',
            ],
          },
        ],
      },
      {
        heading: '3. Stornierungen und Rückerstattungen',
        blocks: [
          {type: 'paragraph', text: 'Seitens des Kunden:'},
          {
            type: 'list',
            items: [
              '60 Tage oder mehr vor Abreise: 90 % Rückerstattung',
              '30 bis 59 Tage vor Abreise: 50 % Rückerstattung',
              'Weniger als 30 Tage: keine Rückerstattung',
            ],
          },
          {type: 'paragraph', text: 'Seitens Asili Climbing Kilimanjaro:'},
          {
            type: 'list',
            items: [
              'Wir behalten uns das Recht vor, jede Reise aus Sicherheits-, Wetter- oder unvorhergesehenen Gründen zu stornieren. In diesem Fall erhalten Sie eine vollständige Rückerstattung oder es wird Ihnen ein alternativer Termin angeboten.',
            ],
          },
        ],
      },
      {
        heading: '4. Änderungen',
        blocks: [
          {
            type: 'list',
            items: [
              'Vom Kunden gewünschte Reiseänderungen können je nach Verfügbarkeit möglich sein und zusätzliche Kosten verursachen.',
              'Namensänderungen sind bis zu 15 Tage vor der Reise erlaubt.',
              'Asili Climbing Kilimanjaro behält sich das Recht vor, geringfügige Änderungen am Reiseverlauf aufgrund lokaler Bedingungen vorzunehmen.',
            ],
          },
        ],
      },
      {
        heading: '5. Reiseversicherung',
        blocks: [
          {
            type: 'list',
            items: [
              'Alle Teilnehmer müssen über eine gültige Reiseversicherung verfügen, die Höhentrekking (für den Kilimandscharo) abdeckt',
              'Notfallevakuierung',
              'Medizinische Kosten',
              'Reiseabbruch und -unterbrechung',
            ],
          },
          {type: 'paragraph', text: 'Ein Versicherungsnachweis kann vor Reisebeginn angefordert werden.'},
        ],
      },
      {
        heading: '6. Gesundheits- und Fitnessanforderungen',
        blocks: [
          {
            type: 'list',
            items: [
              'Die Besteigung des Kilimandscharo und die Teilnahme an einer Safari erfordern körperliche und mentale Vorbereitung.',
              'Teilnehmer müssen etwaige vorbestehende medizinische Erkrankungen angeben.',
              'Asili Climbing Kilimanjaro haftet nicht für medizinische Probleme, die während der Reise auftreten.',
            ],
          },
        ],
      },
      {
        heading: '7. Visa und Einreisebestimmungen',
        blocks: [
          {
            type: 'list',
            items: [
              'Es liegt in der Verantwortung des Reisenden, vor Ankunft ein gültiges tansanisches Visum zu erhalten.',
              'Reisepässe müssen ab dem Reisedatum mindestens sechs (6) Monate gültig sein.',
            ],
          },
        ],
      },
      {
        heading: '8. Haftung',
        blocks: [
          {
            type: 'list',
            items: [
              'Wir setzen uns für Ihre Sicherheit ein, aber die Teilnahme an einer Abenteuerreise birgt inhärente Risiken.',
              'Asili Climbing Kilimanjaro haftet nicht für den Verlust oder die Beschädigung persönlicher Gegenstände',
              'Verletzungen oder Krankheiten',
              'Verzögerungen oder Änderungen aufgrund von Wetter, Flugproblemen oder behördlichen Entscheidungen',
            ],
          },
          {
            type: 'paragraph',
            text: 'Wir verpflichten uns jedoch, professionell zu handeln und Risiken so weit wie möglich zu minimieren.',
          },
        ],
      },
      {
        heading: '9. Verhalten und Auftreten',
        blocks: [
          {
            type: 'list',
            items: [
              'Respekt gegenüber Guides, Personal, lokalen Gemeinschaften und anderen Reisenden wird erwartet.',
              'Jegliches Verhalten, das als gefährlich oder beleidigend angesehen wird, kann zum Ausschluss von der Reise ohne Rückerstattung führen.',
            ],
          },
        ],
      },
      {
        heading: '10. Verwendung von Fotos und Erfahrungsberichten',
        blocks: [
          {
            type: 'list',
            items: [
              'Wir können von Kunden geteilte Fotos und Bewertungen zu Werbezwecken verwenden, sofern Sie nicht schriftlich etwas anderes beantragen.',
            ],
          },
        ],
      },
      {
        heading: '11. Anwendbares Recht',
        blocks: [
          {
            type: 'paragraph',
            text: 'Alle vorliegenden Bedingungen unterliegen tansanischem Recht. Etwaige Streitigkeiten werden vor den örtlichen Gerichten in Arusha, Tansania, beigelegt.',
          },
        ],
      },
      {
        heading: '12. Kontakt',
        blocks: [
          {type: 'paragraph', text: 'Bei Fragen zu diesen Bedingungen kontaktieren Sie uns:'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. E-Mail: info@asiliclimbingkilimanjaro.com. Telefon: +255 767 140 150. Sitz: Arusha, Tansania.',
          },
        ],
      },
    ],
  },
  {
    slug: 'cookies-policy',
    seoTitle: 'Cookie-Richtlinie | Asili Climbing Kilimanjaro',
    seoDescription:
      'Erfahren Sie, wie Asili Climbing Kilimanjaro während Ihres Besuchs auf unserer Website Cookies verwendet.',
    pageTitle: 'Cookie-Richtlinie',
    intro:
      'Diese Cookie-Richtlinie erklärt, wie Asili Climbing Kilimanjaro Cookies und ähnliche Technologien während Ihres Besuchs auf unserer Website verwendet. Indem Sie weiterhin auf unserer Website navigieren, akzeptieren Sie unsere Verwendung von Cookies wie unten beschrieben.',
    sections: [
      {
        heading: '1. Was sind Cookies?',
        blocks: [
          {
            type: 'paragraph',
            text: 'Cookies sind kleine Textdateien, die auf Ihrem Gerät (Computer, Tablet oder Smartphone) platziert werden, wenn Sie eine Website besuchen. Sie helfen Websites, ordnungsgemäß zu funktionieren, verbessern die Nutzererfahrung und sammeln nützliche Daten für die Website-Leistung und das Marketing.',
          },
        ],
      },
      {
        heading: '2. Wie wir Cookies verwenden',
        blocks: [
          {type: 'paragraph', text: 'Wir verwenden Cookies, um:'},
          {
            type: 'list',
            items: [
              'Ihre Präferenzen und Einstellungen zu speichern',
              'Die Geschwindigkeit und Leistung der Website zu verbessern',
              'Zu analysieren, wie Besucher mit unseren Inhalten interagieren',
              'Buchungsfunktionen zu ermöglichen',
              'Relevante Werbung und Inhalte basierend auf Ihren Interessen anzuzeigen (falls zutreffend)',
            ],
          },
        ],
      },
      {
        heading: '3. Arten von Cookies, die wir verwenden',
        blocks: [
          {
            type: 'list',
            items: [
              'Essenzielle Cookies — notwendig für die grundlegende Funktion der Website, wie Navigation und Zugang zu geschützten Bereichen.',
              'Leistungs- und Analyse-Cookies — helfen uns zu verstehen, wie Besucher unsere Website nutzen (besuchte Seiten, verbrachte Zeit, Absprungrate), um die Nutzererfahrung zu verbessern.',
              'Funktionale Cookies — merken sich Ihre Entscheidungen, wie Sprache oder Region, um ein personalisierteres Erlebnis zu bieten.',
              'Werbe-Cookies (falls zutreffend) — können verwendet werden, um Ihnen relevante Werbung auf Plattformen wie Google oder Facebook zu zeigen. Sie können gezielte Werbung jederzeit ablehnen.',
            ],
          },
        ],
      },
      {
        heading: '4. Cookies von Drittanbietern',
        blocks: [
          {type: 'paragraph', text: 'Wir können vertrauenswürdige Tools von Drittanbietern verwenden wie:'},
          {
            type: 'list',
            items: [
              'Google Analytics (zur Überwachung der Website-Nutzung)',
              'Facebook Pixel (für Marketing und Werbeleistung)',
              'TripAdvisor- oder Booking-Widgets (zur Anzeige von Bewertungen oder Verfügbarkeit)',
            ],
          },
          {
            type: 'paragraph',
            text: 'Diese Dienste können ihre eigenen Cookies auf Ihrem Gerät platzieren. Wir laden Sie ein, deren jeweilige Richtlinien für weitere Details zu konsultieren.',
          },
        ],
      },
      {
        heading: '5. Verwaltung und Kontrolle von Cookies',
        blocks: [
          {type: 'paragraph', text: 'Sie können Cookies über die Einstellungen Ihres Browsers kontrollieren. Die meisten Browser ermöglichen es Ihnen:'},
          {
            type: 'list',
            items: [
              'Bestehende Cookies einzusehen und zu löschen',
              'Cookies von Drittanbietern zu blockieren',
              'Präferenzen für bestimmte Websites festzulegen',
              'Alle Cookies zu deaktivieren (nicht empfohlen, da dies die Funktion der Website beeinträchtigen kann)',
            ],
          },
        ],
      },
      {
        heading: '6. Aktualisierungen dieser Richtlinie',
        blocks: [
          {
            type: 'paragraph',
            text: 'Wir können diese Cookie-Richtlinie bei Bedarf aktualisieren. Änderungen werden auf dieser Seite mit einem neuen Inkrafttretensdatum veröffentlicht.',
          },
        ],
      },
      {
        heading: '7. Kontaktieren Sie uns',
        blocks: [
          {type: 'paragraph', text: 'Wenn Sie Fragen oder Bedenken bezüglich unserer Verwendung von Cookies haben, kontaktieren Sie bitte:'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. E-Mail: info@asiliclimbingkilimanjaro.com. Telefon: +255 767 140 150. Sitz: Arusha, Tansania.',
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
    const deId = await upsertTranslatedDoc(client, 'standardPage', page.slug, 'de', fields)
    await linkTranslationMetadata(client, 'standardPage', [
      {language: 'en', id: enId},
      {language: 'de', id: deId},
    ])
    console.log(`${page.slug}-de done (${deId})`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
