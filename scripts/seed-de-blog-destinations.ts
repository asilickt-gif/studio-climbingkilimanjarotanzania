/**
 * Phase 6 (German): blogIndexPage (singleton), the one blogPost (Iringa),
 * destinationsPage (singleton), and the one destinationDetail (Serengeti).
 * Mirrors seed-it-blog-destinations.ts's structure but with German text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-blog-destinations.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedBlogIndexDe() {
  await client.createOrReplace({
    _id: 'blogIndexPage-de',
    _type: 'blogIndexPage',
    language: 'de',
    seo: {_type: 'seo', title: 'Blog | Asili Climbing Kilimanjaro', description: 'Reisetipps, Reiseziel-Guides und Geschichten aus Tansania — Kilimandscharo-Besteigungen, Safaris und mehr, von Asili Climbing Kilimanjaro.'},
    heading: 'Unser Reiseblog',
    intro: 'Geschichten, Tipps und Guides, die Ihnen helfen, Ihr Tansania-Abenteuer zu planen — von der Besteigung des Kilimandscharo bis zur Entdeckung der versteckten Schätze des Landes.',
  })
  console.log('blogIndexPage-de created/replaced')
}

async function seedIringaBlogPostDe() {
  const slug = '5-reasons-you-should-visit-iringa-in-2025-2026'
  const enId = await findEnId(client, 'blogPost', slug)
  if (!enId) {
    console.log(`SKIP blogPost-de: no en source for ${slug}`)
    return
  }
  const sections = [
    {
      heading: '1. Tauchen Sie ein in das reiche kulturelle Mosaik von Iringa',
      body: 'Iringa vibriert vor kultureller Fülle und bietet einen Einblick in die Traditionen lokaler Stämme wie der Massai und Hehe. Die im Kolonialstil errichteten Gebäude der Stadt versetzen Sie in eine andere Zeit — betreten Sie die Old Boma, eine ehemalige deutsche Festung, die in ein Museum umgewandelt wurde, um die Geschichten von Iringas Vergangenheit zu entdecken. Wagen Sie sich mit uns in die umliegenden Dörfer, um herzliche Bewohner zu treffen, sich von traditionellen Tänzen mitreißen zu lassen und an eindrucksvollen kulturellen Erlebnissen teilzunehmen. Diese authentischen Momente lassen Sie das tansanische Leben hautnah erfahren und schaffen Erinnerungen, die weit über Ihre Reise hinaus bestehen bleiben.',
    },
    {
      heading: 'Staunen Sie über atemberaubende Naturwunder',
      body: 'Iringas Landschaften sind ein Traum für Naturliebhaber und vereinen weite Savannen, sanfte Hügel und üppige Wälder zu einer atemberaubenden Kulisse. Begleiten Sie uns in den Ruaha-Nationalpark, Tansanias größtes Wildreservat, für spannende Safaris. Beobachten Sie Elefanten, Löwen, Giraffen und eine farbenprächtige Vogelwelt in einer ruhigen, wenig frequentierten Umgebung. Für Wanderer erwartet der Udzungwa-Mountains-Nationalpark mit seinen Regenwaldpfaden, glitzernden Wasserfällen und seltenen Arten. Wandern Sie zu Aussichtspunkten und tauchen Sie ein in die Ruhe der Natur.',
    },
    {
      heading: '3. Reisen Sie zurück in die Geschichte von Iringa',
      body: 'Iringas historische Wurzeln reichen tief und bieten Geschichten, die neugierige Reisende faszinieren. Besuchen Sie die prähistorische Fundstätte Isimila, wo uralte Werkzeuge und Fossilien Millionen Jahre altes menschliches Frühleben offenbaren — eine seltene Gelegenheit, die Ursprünge der Menschheit zu berühren. Im Old-Boma-Museum tauchen Sie ein in das Erbe des Hehe-Volkes und seinen mutigen Widerstand gegen die Kolonialherrschaft.',
    },
    {
      heading: '4. Feiern Sie bei Iringas lebendigen Festivals',
      body: 'Planen Sie Ihren Besuch so, dass er mit Iringas lebendigen Kulturfestivals zusammenfällt, wie dem jährlichen Iringa-Kulturfestival im August. Diese farbenfrohe Veranstaltung ist voller traditioneller Musik, mitreißender Tänze und lokaler Kunst, die das tansanische Erbe zur Geltung bringen. Genießen Sie authentische Gerichte und wechseln Sie ein paar Worte mit den Einheimischen, um den wahren Geist von Iringa zu erleben.',
    },
    {
      heading: '5. Entdecken Sie den unberührten Charme von Iringa',
      body: 'Iringas Magie liegt in seinem abseits ausgetretener Pfade liegenden Charme, fernab der Touristenmassen. Hier werden Sie sich tief mit lokalen Gemeinschaften, unberührter Natur und authentischen Traditionen verbinden. Begleiten Sie uns bei Gemeinschaftstouren oder Freiwilligenprojekten zur Unterstützung nachhaltiger Initiativen, von Naturschutz bis Handwerk. Diese authentische Erfahrung bereichert Ihre Reise und hinterlässt einen positiven Fußabdruck in Iringa.',
    },
    {
      heading: 'Warum Iringa in tausend Farben erstrahlt',
      body: 'Iringa vereint kulturelle Tiefe, natürliche Pracht und unberührte Authentizität zu einem unvergleichlichen tansanischen Abenteuer. Ob Sie von lebendigen Traditionen, aufregender Tierwelt oder verborgenen Geschichten angezogen werden — Asili Climbing Kilimanjaro gestaltet Reisen, die Ihre kühnsten Träume übertreffen. Warten Sie nicht länger — planen Sie jetzt Ihre Flucht nach Iringa 2025/2026! Kontaktieren Sie uns, um Ihr Abenteuer zu beginnen.',
    },
  ]
  const faqs = [
    {q: 'Wann ist die beste Zeit, um Iringa zu besuchen?', a: 'Die Trockenzeit (Juni bis Oktober) ist ideal für Iringa, mit mildem Klima und ausgezeichneten Möglichkeiten zur Tierbeobachtung im Ruaha-Nationalpark. Die Regenzeit enthüllt üppige Landschaften für eine neue Perspektive. Wir organisieren Reisen das ganze Jahr über.'},
    {q: 'Welche einzigartigen kulturellen Erlebnisse erwarten Sie in Iringa?', a: 'Übernachten Sie bei Massai-Familien, um ihre Traditionen zu erleben, von der Perlenherstellung bis zur Viehzucht. Verpassen Sie nicht das Iringa-Kulturfestival im August mit seiner Musik, seinen Tänzen und lokalen Aromen.'},
    {q: 'Was sind die wichtigsten Attraktionen von Iringa?', a: 'Der Ruaha-Nationalpark verzaubert mit seiner Tierwelt, während die prähistorische Fundstätte Isimila einen Einblick in die antike Geschichte bietet. Das Old-Boma-Museum enthüllt Iringas koloniale Vergangenheit.'},
    {q: 'Welche Outdoor-Abenteuer kann ich in Iringa erleben?', a: 'Wandern Sie auf den Nyoni-Berg für epische Ausblicke oder erkunden Sie das Kilolo-Hochland zur Vogelbeobachtung. Die Parks Ruaha und Udzungwa bieten Safaris und Pfade im Überfluss.'},
    {q: 'Welche Tierwelt werde ich in Iringa sehen?', a: 'Der Ruaha-Nationalpark ist reich an Elefanten, Löwen, Geparden und über 570 Vogelarten sowie Zebras und seltenen Antilopen.'},
    {q: 'Kann ich eine Teeplantage in Iringa besuchen?', a: 'Ja! Entdecken Sie Iringas Teekultur mit Plantagenbesuchen, lernen Sie die Geheimnisse des Anbaus kennen und probieren Sie frisch aufgebrühten Tee.'},
    {q: 'Gibt es lokale Märkte zu besuchen?', a: 'Iringas Märkte sind reich an frischen Produkten, Handwerkskunst und Souvenirs wie Perlenarbeiten. Handeln Sie, um Schätze zu finden, und probieren Sie Street Food.'},
    {q: 'Wie ist die Gastronomie in Iringa?', a: 'Genießen Sie tansanische Klassiker wie Ugali und Nyama Choma sowie internationale Gerichte in lokalen Restaurants und bei Straßenhändlern.'},
    {q: 'Wie bewege ich mich mit öffentlichen Verkehrsmitteln in Iringa fort?', a: 'Nehmen Sie Dala-Dala-Busse, Taxis oder Bajaji (Tuk-Tuks), um sich einfach fortzubewegen. Für entlegenere Orte bieten wir private Transfers für mehr Komfort und Bequemlichkeit.'},
    {q: 'Kann ich in Iringa ehrenamtlich tätig sein?', a: 'Auf jeden Fall! Unterstützen Sie Schulen, Naturschutz- oder Gemeinschaftsprojekte — wir können Sie mit bereichernden Freiwilligenmöglichkeiten in Kontakt bringen.'},
    {q: 'Wo kann ich in Iringa übernachten?', a: 'Von gemütlichen Gästehäusern bis zu Luxus-Lodges hat Iringa alles zu bieten — wir buchen die besten Unterkünfte entsprechend Ihrem Budget.'},
    {q: 'Ist Iringa sicher für Reisende?', a: 'Iringa ist im Allgemeinen sicher, bleiben Sie jedoch wachsam. Behalten Sie Ihre persönlichen Gegenstände im Auge, nutzen Sie verlässliche Taxis und respektieren Sie lokale Bräuche.'},
    {q: 'Was kann ich in Iringa kaufen?', a: 'Shoppen Sie auf den Märkten nach Handwerkskunst, Textilien und Keramik, oder besuchen Sie Geschäfte für modernere Artikel.'},
    {q: 'Wie komme ich von Daressalam nach Iringa?', a: 'Nehmen Sie einen Flug zum Flughafen Iringa, einen Bus oder mieten Sie ein Auto ab Daressalam — wir organisieren reibungslose Transfers.'},
    {q: 'Welche Reisedokumente benötige ich für Iringa?', a: 'Besorgen Sie sich einen Reisepass (mindestens 6 Monate gültig) und prüfen Sie die Visabestimmungen für Tansania. Ein Nachweis der Gelbfieberimpfung könnte erforderlich sein.'},
    {q: 'Welche Aktivitäten bietet der Ruaha-Nationalpark?', a: 'Genießen Sie Fotosafaris, Fußsafaris und Vogelbeobachtung in Ruaha. Beobachten Sie Elefanten, Löwen und seltene Vögel mit erfahrenen Guides.'},
    {q: 'Welche Sprachen werden in Iringa gesprochen?', a: 'Suaheli ist die Hauptsprache, aber Englisch ist im Tourismus verbreitet. Ein paar Sätze Suaheli zu lernen wird sehr geschätzt.'},
    {q: 'Welche Währung wird in Iringa verwendet?', a: 'Der tansanische Schilling (TZS) ist die Standardwährung, aber der US-Dollar funktioniert an touristischen Orten. Tauschen Sie Ihr Geld bei einer Bank für faire Kurse.'},
    {q: 'Gibt es medizinische Einrichtungen in Iringa?', a: 'Es gibt Krankenhäuser und grundlegende Kliniken, aber schwere Fälle könnten eine Verlegung nach Daressalam erfordern. Eine Reiseversicherung wird dringend empfohlen.'},
    {q: 'Kann ich lokale Schulen oder Gemeinschaften besuchen?', a: 'Ja! Treffen Sie Schulen oder Gemeinschaftsgruppen für kulturellen Austausch — wir organisieren respektvolle Besuche.'},
  ]
  const fields = {
    seo: {_type: 'seo', title: '5 Gründe, Iringa 2025/2026 zu besuchen | Asili Climbing Kilimanjaro', description: 'Suchen Sie ein tansanisches Abenteuer abseits ausgetretener Pfade? Entdecken Sie 5 unwiderstehliche Gründe, Iringa 2025/2026 zu besuchen — Kultur, Tierwelt, Geschichte und Festivals.'},
    title: '5 Gründe, Iringa 2025/2026 zu besuchen',
    excerpt: 'Suchen Sie ein tansanisches Abenteuer abseits ausgetretener Pfade? Gelegen im südlichen Hochland, ist Iringa ein bezauberndes Juwel, das nur darauf wartet, Sie zu erobern.',
    publishedDate: '2025-05-02',
    coverImage: await uploadImage(client, {src: '/images/destinations/ruaha.webp', alt: 'Elefantenherde an einer Wasserstelle nahe dem Ruaha-Nationalpark in Iringa'}),
    intro:
      'Suchen Sie ein tansanisches Abenteuer abseits ausgetretener Pfade? Gelegen im südlichen Hochland, ist Iringa ein bezauberndes Juwel, das nur darauf wartet, Sie zu erobern. Fernab der üblichen Touristenrouten verspricht dieses lebendige Reiseziel unvergessliche Momente. Noch unentschlossen? Hier sind fünf unwiderstehliche Gründe, Iringa 2025/2026 mit Asili Climbing Kilimanjaro zu besuchen.',
    sections: sections.map((section) => ({_type: 'postSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
    faqHeading: 'Häufig Gestellte Fragen',
    faqs: faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.q, answer: faq.a})),
  }
  const deId = await upsertTranslatedDoc(client, 'blogPost', slug, 'de', fields)
  await linkTranslationMetadata(client, 'blogPost', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`blogPost-de done (${deId})`)
}

async function seedDestinationsPageDe() {
  const destinations = [
    {
      name: 'Kilimandscharo',
      image: {src: '/images/destinations/kilimanjaro.webp', alt: 'Weidender Elefant vor dem Kilimandscharo im Hintergrund'},
      body: 'Mit seinen 5.895 Metern ist der Kilimandscharo der höchste freistehende Berg der Welt und ein unvergessliches Erlebnis. Anders als andere große Gipfel erfordert er keine technische Kletterkunst, was ihn für körperlich fitte Trekker aus aller Welt zugänglich macht.',
      highlightsHeading: 'Höhepunkte',
      highlights: [
        'Mehrere landschaftlich reizvolle Routen (Machame, Lemosho, Marangu, Rongai, Umbwe)',
        'Vielfältige ökologische Zonen: Regenwald, Heideland, alpine Wüste und arktischer Gipfel',
        'Von Experten geführte Trekkings mit vollständiger Träger-Unterstützung, Akklimatisierungshilfe und erstklassigen Campingeinrichtungen',
        'Ein Gipfelerlebnis bei Sonnenaufgang über den Wolken von Uhuru Peak',
      ],
      bestTime: 'Januar–März, Juni–Oktober',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Asili bietet maßgeschneiderte Kilimandscharo-Besteigungen, die Sicherheit, Nachhaltigkeit und unvergessliche Aussichten miteinander verbinden.'],
    },
    {
      name: 'Serengeti-Nationalpark',
      href: '/serengeti-national-park/',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Goldene Ebenen der Serengeti'},
      body: 'Die Serengeti ist das Herzstück des afrikanischen Safari-Erlebnisses — endlose goldene Ebenen, spektakuläre Räuber-Beute-Begegnungen und die berühmte Große Migration. Es ist ein Land, in dem jede Fotosafari eine neue Geschichte erzählt.',
      highlightsHeading: 'Beste Tierbeobachtungserlebnisse',
      highlights: [
        'Erleben Sie die Große Migration der Gnus, ein ganzjähriges Spektakel mit über 1,5 Millionen Gnus und Zebras auf der Suche nach neuen Weidegründen.',
        'Die Flussüberquerungen (Juli–September) sind aufregend, mit lauernden Krokodilen und Herden, die ins Wasser springen.',
        'Die Geburtensaison (Januar–März) ist ebenso spektakulär, mit Raubtieren, die die Neugeborenen auf den südlichen Ebenen ins Visier nehmen.',
        'Ausgezeichnete Beobachtungen von Großkatzen — insbesondere Löwen, Leoparden und Geparden.',
        'Ballonsafaris über den Ebenen bei Sonnenaufgang (zusätzliche Option).',
      ],
      bestTime: 'Juni–Oktober (Trockenzeit, ideal für Raubtiere); Januar–März (Geburtensaison in der Ndutu-Region)',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Unsere Guides kennen die Migrationsmuster genau und passen die Fotosafaris an, um Sie näher ans Geschehen zu bringen — ohne die Menschenmassen.'],
    },
    {
      name: 'Ngorongoro-Krater',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Zwei Nashörner im Gras des Ngorongoro-Kraters'},
      body: 'Der Ngorongoro-Krater ist die größte intakte vulkanische Caldera der Welt und ein Mikrokosmos der afrikanischen Tierwelt. Es ist einer der seltenen Orte, an denen Sie die Big Five an einem einzigen Tag beobachten könnten.',
      highlightsHeading: 'Beste Erlebnisse',
      highlights: [
        'Steigen Sie 600 Meter hinab zum üppigen Kraterboden für eine ganztägige Fotosafari.',
        'Beobachten Sie Spitzmaulnashörner, Flusspferde, Löwen, Zebras, Büffel, Schakale und Flamingos.',
        'Eine spektakuläre Landschaft mit bewaldeten Wänden, Graslandschaften und einem zentralen See.',
        'Besuchen Sie nahegelegene Massai-Dörfer für kulturellen Austausch.',
      ],
      bestTime: 'Ganzjährig (die Trockenzeit bietet bessere Sicht)',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Wir gestalten Ihren Tag am Krater mit malerischen Picknicks und einem frühmorgendlichen Zugang, um die Menschenmassen zu vermeiden.'],
    },
    {
      name: 'Lake-Manyara-Nationalpark',
      image: {src: '/images/destinations/lake-manyara.webp', alt: 'Landschaft des Lake-Manyara-Nationalparks'},
      body: 'Der Lake Manyara mag kompakt sein, birgt aber eine beeindruckende Vielfalt an Lebensräumen — von Grundwasserwäldern über offene Ebenen bis hin zum alkalischen See selbst. Es ist eine ideale Einführung in Tansanias Ökosysteme.',
      highlightsHeading: 'Wichtigste Höhepunkte',
      highlights: [
        'Berühmt für seine baumkletternden Löwen, ein seltenes Verhalten, das in den meisten Parks nicht zu sehen ist',
        'Tausende Flamingos und Pelikane entlang der Seeufer',
        'Gruppen von Pavianen, Grünmeerkatzen, Elefanten und Flusspferden',
        'Kanufahrten verfügbar, wenn der Wasserstand es zulässt (saisonal)',
      ],
      bestTime: 'Juni–Oktober für Tierwelt, November–März für Vogelbeobachtung',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Wir nutzen Manyara oft als ersten Park Ihrer Reise — er liegt nahe Arusha und bietet ein perfektes Warm-up vor größeren Abenteuern.'],
    },
    {
      name: 'Tarangire-Nationalpark',
      image: {src: '/images/destinations/tarangire.jpg', alt: 'Tarangire-Nationalpark mit seinen Affenbrotbäumen'},
      body: 'Oft übersehen, ist Tarangire ein an Tierwelt reiches Juwel — besonders während der Trockenzeit, wenn Tiere zum Tarangire-Fluss strömen. Er ist bekannt für seine gewaltigen Elefantenherden und majestätischen Affenbrotbäume.',
      highlightsHeading: 'Beste Tierbeobachtungen',
      highlights: [
        'Gewaltige Elefantenherden — manchmal über 200 Tiere',
        'Großkatzen, Giraffen, Strauße und gelegentlich sogar Wildhunde',
        'Über 500 Vogelarten, was ihn zu einem Paradies für Vogelbeobachter macht',
        'Eine klassische Landschaft aus Akazien und Affenbrotbäumen, perfekt für die Fotografie',
      ],
      bestTime: 'Juni–Oktober (Trockenzeit, wenn Wasserstellen die Tierwelt anlocken)',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Wir integrieren Tarangire oft in unsere Nord-Circuit-Safaris, besonders für alle, die weniger Andrang und authentische Ausblicke suchen.'],
    },
    {
      name: 'Nyerere-Nationalpark',
      image: {src: '/images/destinations/nyerere.webp', alt: 'Feuchtgebiete des Nyerere-Nationalparks'},
      body: 'Nyerere ist Afrikas größter Nationalpark, mit abgelegenen Flüssen, Wäldern und Feuchtgebieten, die sich im Süden Tansanias so weit das Auge reicht erstrecken. Er ist ideal für Reisende, die eine authentische und wenig frequentierte Safari suchen.',
      highlightsHeading: 'Einzigartige Safari-Aktivitäten',
      highlights: [
        'Bootssafaris auf dem Rufiji-Fluss — beobachten Sie Flusspferde, Krokodile und Elefanten an den Ufern',
        'Fußsafaris mit bewaffneten Rangern — verfolgen Sie Tiere zu Fuß',
        'Fotosafaris mit der Möglichkeit, Löwen, Leoparden, Elefanten und sogar Wildhunde zu beobachten',
        'Weniger Touristen, authentischere Begegnungen mit der Wildnis',
      ],
      bestTime: 'Juni–Oktober (Trockenzeit)',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Für Kunden, die eine längere und tiefere Verbindung zum wilden Afrika suchen, helfen wir Ihnen, Erweiterungen nach Nyerere abseits ausgetretener Pfade zu planen.'],
    },
    {
      name: 'Ruaha-Nationalpark',
      image: {src: '/images/destinations/ruaha.webp', alt: 'Landschaft des Ruaha-Nationalparks'},
      body: 'Ruaha ist ein gut gehütetes Geheimnis, ideal für Safari-Kenner. Seine authentischen Landschaften und geringe Besucherzahl machen ihn zu einer echten wilden Grenze. Die Tierdichte ist hoch und die Raubtieraktivität intensiv.',
      highlightsHeading: 'Was Ruaha einzigartig macht',
      highlights: [
        'Gewaltige Löwenrudel (manche mit über 20 Tieren!)',
        'Seltene Antilopen wie die Rappenantilope, Pferdeantilope und der Kleine Kudu',
        'Ausgezeichnete Beobachtungen von Leoparden, Geparden und Hyänen',
        'Fantastische Vogelbeobachtung — über 500 Arten und spektakuläre Landschaften',
      ],
      bestTime: 'Juni–Oktober (Trockenzeit, erleichterte Tierbeobachtung)',
      bonusHeading: 'Der Asili-Vorteil',
      bonus: ['Für Tierliebhaber können wir Ruaha mit Nyerere für ein echtes Abenteuer im Süden Tansanias kombinieren.'],
    },
    {
      name: 'Mikumi-Nationalpark',
      image: {src: '/images/destinations/mikumi.jpg', alt: 'Savanne des Mikumi-Nationalparks'},
      body: 'Der Mikumi-Nationalpark ist einer der am leichtesten zugänglichen Safariparks Tansanias, nur wenige Autostunden von Daressalam entfernt. Er ist ideal für Reisende mit wenig Zeit, die dennoch die wilde Seite Tansanias entdecken möchten. Trotz seiner Zugänglichkeit überrascht Mikumi Besucher mit seiner reichen Tierwelt und offenen Savannen, die an die Serengeti erinnern.',
      highlightsHeading: 'Beste Tierbeobachtungen',
      highlights: [
        'Löwen, die sich im hohen Gras oder auf Termitenhügeln sonnen',
        'Große Herden von Büffeln, Zebras und Impalas über die Ebenen',
        'Elefanten in den Miombo-Wäldern',
        'Giraffen, Flusspferde, Gnus und Warzenschweine',
        'Ausgezeichnete Vogelbeobachtung — über 400 Arten, darunter bunte Bienenfresser und Adler',
      ],
      bestTime: 'Juni–Oktober (Trockenzeit für die beste Konzentration an Tierwelt nahe Wasserstellen); kann auch während der grünen Saison genossen werden, besonders von Vogelliebhabern',
      bonusHeading: 'Warum Mikumi mit Asili wählen',
      bonus: [
        'Perfekt für 2-tägige Safaris oder Wochenendausflüge von Daressalam',
        'Komfortable Unterkünfte innerhalb oder in der Nähe des Parks',
        'Anpassbare Touren für Alleinreisende, Familien oder Gruppen',
        'Kann mit den Udzungwa-Bergen oder sogar Ruaha für eine verlängerte Safari im Süden Tansanias kombiniert werden',
        'Wir bieten flexible Safaripakete in Mikumi mit privaten Transfers, Fotosafaris mit erfahrenen Guides, und die Möglichkeit, Ihren Reiseverlauf entsprechend Ihren Reisebedürfnissen anzupassen.',
      ],
    },
    {
      name: 'Natronsee',
      image: {src: '/images/destinations/lake-natron.jpg', alt: 'Zebras und Flamingos am Natronsee'},
      body: 'Der Natronsee ist eines der surrealsten und erstaunlichsten Reiseziele Tansanias. Gelegen im Großen Afrikanischen Grabenbruch nahe der kenianischen Grenze, ist der See flach, salzig und von auffallend roter Farbe. Er ist der wichtigste Brutplatz für Zwergflamingos, und Tausende von ihnen färben den See während der Nistsaison rosa. Aber es gibt nicht nur Vögel — der Ol-Doinyo-Lengai, der einzige aktive Karbonatit-Vulkan der Welt, erhebt sich in der Nähe und bietet ein einzigartiges (wenn auch anspruchsvolles) Trekking für Abenteuerliebhaber. Natron ist auch Heimat der halbnomadischen Massai, und kulturelle Besuche sind hier authentisch und schnörkellos.',
      highlightsHeading: 'Beste Erlebnisse',
      highlights: [
        'Beobachten Sie die gewaltigen Flamingokolonien an den Ufern',
        'Wandern Sie zu Wasserfällen durch enge Schluchten und heiße Quellen',
        'Besuchen Sie traditionelle Massai-Bomas (Dörfer)',
        'Optionale Besteigung des Ol Doinyo Lengai (für erfahrene Trekker)',
      ],
      bestTime: 'Juni–Oktober (Trockenzeit; ausgezeichnet für Trekking und Fotografie). Die Flamingo-Brutsaison erreicht ihren Höhepunkt von September bis November.',
      bonusHeading: 'Warum mit Asili Climbing Kilimanjaro besuchen',
      bonus: [
        'Von Experten geführte Trekking- und Kulturtouren',
        'Eine einzigartige Ergänzung zu Nord-Circuit-Safaris oder Kilimandscharo-Besteigungen',
        'Eine Unterstützung für lokale Massai-Gemeinschaften',
      ],
    },
    {
      name: 'Eyasisee',
      image: {src: '/images/destinations/lake-eyasi.jpg', alt: 'Mitglieder des Hadzabe-Stammes mit traditionellen Bögen bei einer Jagdexpedition'},
      body: 'Beim Eyasisee geht es nicht um große Tierwelt, sondern um ein tiefes kulturelles Eintauchen. Es ist das ideale Reiseziel, wenn Sie neugierig auf Tansanias indigene Stämme sind, insbesondere die Hadzabe, eines der letzten Jäger- und Sammlervölker Afrikas, sowie die Datoga, geschickte Schmiede. Die Region bietet eine seltene Gelegenheit, sich mit Traditionen zu verbinden, die sich seit Tausenden von Jahren kaum verändert haben. Sie können an morgendlichen Jagdausflügen teilnehmen, altehrwürdige Bräuche beobachten und Überlebenstechniken entdecken, die der modernen Zivilisation vorausgehen.',
      highlightsHeading: 'Beste Erlebnisse',
      highlights: [
        'Ein Jagderlebnis mit den Hadzabe, mit Pfeil und Bogen',
        'Erlernen der traditionellen Metallverarbeitung und Schmuckherstellung bei den Datoga',
        'Malerische Spaziergänge entlang des Sees und im umliegenden Buschland',
        'Vogelbeobachtung und Fotografie bei Sonnenuntergang',
      ],
      bestTime: 'Ganzjährig — die Kulturtouren sind weder von Tiermigrationen noch von Wetterbedingungen abhängig',
      bonusHeading: 'Warum mit Asili Climbing Kilimanjaro besuchen',
      bonus: [
        'Verantwortungsvolle und respektvolle kulturelle Besuche',
        'Übersetzer und erfahrene Guides zur Förderung des Verständnisses',
        'Eine ideale kulturelle Ergänzung zu einer Nordsafari oder einem Kilimandscharo-Trekking',
      ],
    },
  ]

  await client.createOrReplace({
    _id: 'destinationsPage-de',
    _type: 'destinationsPage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Reiseziele | Tansania-Safaris und Kilimandscharo-Reiseziele',
      description:
        'Entdecken Sie Tansanias beste Reiseziele mit Asili Climbing Kilimanjaro: Kilimandscharo, Serengeti, Ngorongoro-Krater, Tarangire, Natronsee und mehr.',
    },
    heading: 'Reiseziele',
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
  console.log('destinationsPage-de created/replaced')
}

async function seedSerengetiDetailDe() {
  const slug = 'serengeti-national-park'
  const enId = await findEnId(client, 'destinationDetail', slug)
  if (!enId) {
    console.log(`SKIP destinationDetail-de: no en source for ${slug}`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Serengeti-Nationalpark | Climbing Kilimanjaro Tanzania', description: 'Alles, was Sie für einen Besuch des Serengeti-Nationalparks wissen müssen — Aktivitäten, beste Reisezeit und authentische Fotos.'},
    name: 'Serengeti-Nationalpark',
    hero: {
      eyebrow: 'Ein endloses Wunder',
      heading: 'Serengeti-Nationalpark',
      locationPill: 'Nordtansania',
      backgroundImage: await uploadImage(client, {src: '/images/serengeti-national-park/serengeti-np.jpg', alt: 'Gnuherde in den Ebenen der Serengeti'}),
    },
    overview: {
      heading: 'Überblick',
      body: [
        'Der Serengeti-Nationalpark ist ein weltberühmtes Wildreservat im Norden Tansanias, bekannt für seine weiten Savannen, reichen Ökosysteme und unvergleichlichen Möglichkeiten zur Tierbeobachtung. Auf einer Fläche von etwa 14.750 Quadratkilometern beherbergt der Park die berühmte Große Migration der Gnus, bei der Millionen von Gnus, Zebras und Gazellen die Ebenen auf der Suche nach neuen Weidegründen durchqueren — ein beeindruckendes Naturschauspiel.',
        'Neben der Migration bietet die Serengeti ganzjährig Tierbeobachtungen, mit einer Fülle an Tieren, darunter Löwen, Leoparden, Elefanten, Giraffen, Geparden und über 500 Vogelarten. Der Name des Parks, abgeleitet vom Massai-Wort „Siringet", bedeutet „endlose Ebenen" — eine perfekte Beschreibung seiner atemberaubenden Landschaften, die sich so weit das Auge reicht erstrecken.',
        'Ob bei einer Fotosafari, beim Überfliegen der Ebenen im Heißluftballon oder bei einer geführten Wanderung durch die entlegensten Winkel des Buschlands — die Serengeti bietet ein wahrhaft authentisches und unvergessliches afrikanisches Safari-Erlebnis.',
      ].map(paragraphBlock),
    },
    activitiesHeading: 'Beliebte und unvergessliche Aktivitäten im Serengeti-Nationalpark',
    activities: [
      {title: 'Gnu-Migrationen', body: 'Je nach Saison können Sie über eine Million Gnus sowie Hunderttausende Zebras und Gazellen auf ihrer epischen Reise beobachten — besonders spektakulär während der Flussüberquerungen in der nördlichen Serengeti.'},
      {title: 'Ballonsafaris', body: 'Entdecken Sie die Serengeti aus der Vogelperspektive bei Sonnenaufgang. Überfliegen Sie die Ebenen, während sich die Tierwelt darunter bewegt, gefolgt von einem Champagnerfrühstück im Busch.'},
      {title: 'Fotosafari', body: 'Die ikonischste Aktivität — Fotosafaris bieten die Möglichkeit, die Big Five (Löwe, Elefant, Büffel, Leopard und Nashorn) sowie Geparden, Hyänen, Giraffen, Zebras und unzählige Gnus zu beobachten. Ausflüge können am frühen Morgen, am Nachmittag oder ganztägig stattfinden.'},
      {title: 'Vogelbeobachtung', body: 'Mit über 500 Vogelarten ist die Serengeti ein Paradies für Ornithologen. Entdecken Sie Sekretäre, Geier, Riesentrappen und bunte Bienenfresser, besonders rund um Wasserstellen und Waldgebiete.'},
      {title: 'Fußsafaris', body: 'Geführt von bewaffneten Rangern und erfahrenen Naturkundlern, ermöglichen Ihnen Fußsafaris, den Park zu Fuß zu erkunden — dabei lernen Sie, Spuren, Pflanzen und kleine Lebewesen zu erkennen, die bei Fotosafaris oft übersehen werden.'},
      {title: 'Spezialisierte Fotosafaris', body: 'Mit ihren prächtigen Landschaften, spektakulärem Licht und reicher Tierwelt ist die Serengeti sowohl für Amateur- als auch für professionelle Fotografen perfekt geeignet. Einige Anbieter bieten Fahrzeuge und auf Fotografie spezialisierte Guides an.'},
    ].map((activity) => ({_type: 'activity', _key: key(), title: activity.title, body: activity.body})),
    bestTimeToVisit: {
      heading: 'Beste Reisezeit',
      body: [
        'Die beste Zeit, um die Migration zu sehen, ist von Juli bis Oktober. Dies ist die Trockenzeit, und im Juni und Juli stellen sich die Herden ihrer größten Herausforderung: der Überquerung des Mara-Flusses. Wenn Sie Raubtiere in Aktion sehen möchten, reisen Sie im Januar oder Februar, wenn eine Pause in den jährlichen Regenfällen eintritt und die Gnus gebären.',
        'Beachten Sie, dass Reisen in der Hochsaison naturgemäß höhere Kosten mit sich bringen, und das Land während oder kurz nach den Regenfällen eine besondere Schönheit besitzt.',
      ].map(paragraphBlock),
    },
    gallery: await Promise.all(
      [
        {src: '/images/serengeti-national-park/wildebeest-migrations.webp', alt: 'Gnu-Migrationen'},
        {src: '/images/serengeti-national-park/balloon-safari.jpeg', alt: 'Ballonsafari'},
        {src: '/images/serengeti-national-park/elephant-serengeti.jpg', alt: 'Elefant in der Serengeti'},
        {src: '/images/serengeti-national-park/cheetah.jpg', alt: 'Gepard'},
        {src: '/images/serengeti-national-park/lion.jpg', alt: 'Löwe'},
        {src: '/images/serengeti-national-park/zebra-serengeti.jpg', alt: 'Zebra in der Serengeti'},
      ].map((img) => uploadImage(client, img)),
    ),
    otherDestinationsHeading: 'Weitere Safari-Reiseziele',
    otherDestinations: await Promise.all(
      [
        {name: 'Ngorongoro-Krater', href: '/destinations/', image: {src: '/images/serengeti-national-park/ngorongoro-crater.jpg', alt: 'Ngorongoro-Krater'}},
        {name: 'Tarangire-Nationalpark', href: '/destinations/', image: {src: '/images/serengeti-national-park/tarangire.webp', alt: 'Tarangire-Nationalpark'}},
        {name: 'Lake-Manyara-Nationalpark', href: '/destinations/', image: {src: '/images/serengeti-national-park/lake-manyara.jpg', alt: 'Lake-Manyara-Nationalpark'}},
        {name: 'Mkomazi-Nationalpark', href: '/destinations/', image: {src: '/images/serengeti-national-park/mkomazi.webp', alt: 'Mkomazi-Nationalpark'}},
        {name: 'Arusha-Nationalpark', href: '/destinations/', image: {src: '/images/serengeti-national-park/arusha-national-park.jpg', alt: 'Arusha-Nationalpark'}},
      ].map(async (dest) => ({_type: 'crossPromo', _key: key(), name: dest.name, href: dest.href, image: await uploadImage(client, dest.image)})),
    ),
  }
  const deId = await upsertTranslatedDoc(client, 'destinationDetail', slug, 'de', fields)
  await linkTranslationMetadata(client, 'destinationDetail', [
    {language: 'en', id: enId},
    {language: 'de', id: deId},
  ])
  console.log(`destinationDetail-de done (${deId})`)
}

async function run() {
  await seedBlogIndexDe()
  await seedIringaBlogPostDe()
  await seedDestinationsPageDe()
  await seedSerengetiDetailDe()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
