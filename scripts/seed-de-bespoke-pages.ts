/**
 * Phase 6 (German): the 6 bespoke page singletons (aboutPage, contactPage,
 * requestQuotePage, zanzibarPage, tanzaniaSafariPage, safariToursPage).
 * Mirrors seed-it-bespoke-pages.ts's structure but with German text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-de-bespoke-pages.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedAboutDe() {
  await client.createOrReplace({
    _id: 'aboutPage-de',
    _type: 'aboutPage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Über Asili Climbing Kilimanjaro | Die beste Kilimandscharo-Agentur',
      description:
        'Entdecken Sie Asili Climbing Kilimanjaro — ein Boutique-Reiseveranstalter in Tansania mit tiefen lokalen Wurzeln, erfahrenen Guides und einer Leidenschaft für unvergessliche afrikanische Abenteuer.',
    },
    hero: {
      heading: 'Die beste Kilimandscharo-Agentur',
      backgroundImage: await uploadImage(client, {
        src: '/images/about-asili-explorer/hero.webp',
        alt: 'Eine Reihe von Trekkern, die durch Heidevegetation zum Kilimandscharo wandern',
      }),
    },
    intro: {
      eyebrow: 'ÜBER UNS - Climbing Kilimanjaro Tanzania',
      sections: [
        {
          body: 'Wir passen jedes Safari-Erlebnis an Ihr Budget und Ihre Vorlieben an und gewährleisten einen perfekten, nur für Sie geplanten Reiseverlauf. Von Ihrer ersten Anfrage bis zum letzten Flughafentransfer setzen wir uns für einen außergewöhnlichen Kundenservice in jeder Phase ein.',
        },
        {
          body: 'Was das Safari-Erlebnis betrifft, machen Tansanias außergewöhnliche Tierwelt und seine zahlreichen prächtigen Nationalparks und Naturschutzgebiete es zum idealen Ort in Afrika für eine Safari. Ob Sie Ihre Safari lieber in einem Fahrzeug erleben oder etwas Abenteuerlicheres wie eine geführte Wanderung oder sogar eine Kanufahrt versuchen möchten, Ihnen stehen zahlreiche Optionen zur Verfügung.',
        },
        {
          body: 'Tansanias Nationalparks wie der Lake Manyara, Ngorongoro, Tarangire und die berühmte Serengeti ermöglichen es Ihnen, die legendären Big Five sowie eine beträchtliche Anzahl anderer Tiere, Vögel und Insekten zu beobachten, die Sie wahrscheinlich nirgendwo anders auf der Welt sehen werden.',
        },
        {
          body: 'Tansania ist auch die Heimat des Massai-Stammes, und kein Besuch in Tansania wäre vollständig ohne eine Begegnung mit diesem Volk und einen Besuch der Wiege der Menschheit an der Olduvai-Schlucht. Für die Abenteuerlustigen ist auch die Besteigung des legendären Kilimandscharo oder des bescheideneren, aber ebenso prächtigen Mount Meru möglich. Liebhaber von Sonne, Sand und Entspannung können das herrliche Sansibar besuchen, eine Inseloase, deren kulturelles Erbe genauso faszinierend ist wie seine Strände und tropischen Wälder.',
        },
        {
          body: 'Bei Asili Climbing Kilimanjaro heben wir Safari-Abenteuer auf ein neues Niveau von Erlebnis und Exzellenz. Unsere Vision ist es, unvergessliche und hochwertige Abenteuer zu bieten, die die natürliche Schönheit Afrikas zur Geltung bringen. Mit Schwerpunkt auf Qualität und Liebe zum Detail streben wir nach Exzellenz im Bereich Safaris, indem wir außergewöhnliche Tierbegegnungen und unvergessliche Reiseerlebnisse bieten. Inspiriert von Umweltschutz, kultureller Sensibilität und der Förderung von Gemeinschaften arbeiten wir für einen verantwortungsvollen Tourismus.',
        },
        {
          body: 'Jedes Mitglied des Asili Climbing Kilimanjaro-Teams kennt und ist begeistert von einer enormen Menge an Wissen über Afrika. Von unserem lokalen Personal bis zu unseren internationalen Agenten kann sich jedes Mitglied unseres Teams als Safari-Experte bezeichnen. Wir haben die Hotels besucht, die Parks erkundet und mit den Fluggesellschaften verhandelt, damit Sie den besten Preis und das beste Erlebnis genießen können.',
        },
        {
          heading: 'Ihr Guide ist Ihre Verbindung zu Afrika',
          body: 'Asili Climbing Kilimanjaro beschäftigt nur die freundlichsten und erfahrensten Fahrer. Alle unsere Guides sprechen Englisch und teilen eine echte Liebe für die afrikanische Tierwelt, Vogelwelt und Flora. Sie wissen alles und beantworten gerne Ihre Fragen! Unsere Guides fahren nicht nur jeden Tag, sie sind auch Ihr Schlüssel zu den Parks, die Sie besuchen, der Tierwelt, der Sie begegnen, den Menschen, die Sie treffen, und vielem mehr. Ob Dickson, Bashiru, Lomayani, Alex oder einer unserer anderen hochqualifizierten Fahrer — Sie sind in guten Händen. Wir organisieren auf Anfrage auch Guides, die andere Sprachen wie Deutsch, Spanisch, Italienisch, Französisch, Chinesisch, Koreanisch usw. sprechen.',
        },
        {
          body: 'Asili Climbing Kilimanjaro ist auf die Gestaltung maßgeschneiderter privater Safaris spezialisiert, die alle Ihre Bedürfnisse erfüllen. Ob Sie davon träumen, sich durch eine günstige Camping- und Trekking-Safari mit der Natur zu verbinden, oder Ihr afrikanisches Erlebnis lieber im höchsten Luxus erleben möchten — wir sind hier, um Sie in jeder Phase zu begleiten, um den ultimativen Reiseverlauf zu gestalten. Wir sind stolz darauf, einen erstklassigen Kundenservice zu bieten und alle Bedürfnisse unserer Kunden zu erfüllen.',
        },
        {
          body: 'Während die meisten anderen Safari-Unternehmen Kilometer- oder Kraftstoffbeschränkungen für ihre Fotosafaris auferlegen, bieten wir jeden Tag Ihres Aufenthalts unbegrenzte Fotosafaris von 6:00 bis 18:00 Uhr an. Sie haben die volle Kontrolle über Ihren Tag. Möchten Sie den ganzen Tag auf Safari verbringen und in der Serengeti picknicken? Das ist möglich! Möchten Sie lange schlafen und einen ruhigen Morgen genießen, bevor Sie zu einer Fotosafari bei Sonnenuntergang aufbrechen? Auch das ist möglich! Sie entscheiden!',
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
      alt: 'Ein Paar genießt ein Abendessen bei Sonnenuntergang unter einer Akazie in der tansanischen Savanne',
    }),
    fleetSection: {
      heading: 'Unsere Flotte und der Komfort an Bord',
      body:
        'Die eigens gestaltete Fahrzeugflotte von Asili Climbing Kilimanjaro ist der ideale Weg, eine afrikanische Safari zu erleben. Unsere Land Cruiser 4x4 wurden speziell für Ihren Komfort und Ihre Sicherheit ausgestattet, mit aufklappbaren Dächern, Schiebetüren und einer verlängerten Karosserie, um Ihnen einen 360-Grad-Panoramablick auf das gesamte Geschehen zu garantieren. Alle unsere Fahrzeuge werden nach jeder Safari gewartet und zusätzlich jährlich vollständig überholt, um hohe Sicherheits- und Komfortstandards zu gewährleisten. Darüber hinaus verfügen alle unsere Fahrzeuge über Ladestationen, Erste-Hilfe-Sets, Kühlschränke und WiFi (nur in Tansania).\n\nDie „Safari-Lunchbox" hat in der Safari-Branche einen eher schwachen Ruf. Obwohl sich jede Lodge bemüht, diesen Moment angenehm zu gestalten, ist eine gewisse Wiederholung schwer zu vermeiden. Wir haben einen professionellen Chefkoch engagiert, der unsere Lunchbox von Anfang an zubereitet, und der Qualitätsunterschied ist beträchtlich. Warum sich mit trockenen Sandwiches und Chips in Ihrer Tasche zufriedengeben, wenn Sie eine warme Mahlzeit, frisch zubereitete Produkte und dazu eine Tasse frisch gemahlenen Kaffee genießen können?\n\nAus all diesen und vielen weiteren Gründen sind wir das ideale Team, um Ihnen bei der Verwirklichung Ihrer afrikanischen Traumsafari zu helfen.\n\nWenn Sie es noch nicht getan haben, zögern Sie nicht, uns zu kontaktieren, um mit der Planung Ihrer idealen Safari zu beginnen.',
    },
    quote:
      '„Das eigentliche Fundament des lebendigen Geistes eines Menschen ist seine Leidenschaft für das Abenteuer. Die Freude am Leben entsteht aus unseren Begegnungen mit neuen Erfahrungen, und daher gibt es keine größere Freude, als einen sich ständig wandelnden Horizont zu haben, an dem jeder Tag eine neue und andere Sonne hat"',
    ctaHeading: 'Lassen Sie uns Ihnen helfen',
  })
  console.log('aboutPage-de created/replaced')
}

async function seedContactDe() {
  await client.createOrReplace({
    _id: 'contactPage-de',
    _type: 'contactPage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Kontaktieren Sie Asili | Climbing Kilimanjaro Tanzania',
      description:
        'Bereit, den Kilimandscharo zu bezwingen? Kontaktieren Sie Climbing Kilimanjaro Tanzania noch heute und lassen Sie unser Expertenteam Ihnen bei der Planung Ihrer Besteigung helfen.',
    },
    pageTitle: 'Kontaktieren Sie Asili',
    hero: {
      backgroundImage: await uploadImage(client, {
        src: '/images/contact/hero.webp',
        alt: 'Der Kilimandscharo über den Akazien der afrikanischen Savanne',
      }),
      heading: 'Kontaktieren Sie uns',
      subheading: 'Bereit, den Kilimandscharo zu bezwingen? Lassen Sie es uns gemeinsam tun!',
    },
    intro: {
      heading: 'Beginnen Sie Ihre Besteigung mit Climbing Kilimanjaro Tanzania',
      body: 'Ob Sie Ihren ersten Gipfel planen oder für ein neues Abenteuer zurückkommen, wir sind hier, um Sie in jeder Phase zu begleiten. Kontaktieren Sie uns noch heute — unser Expertenteam ist bereit, Ihre Fragen zu beantworten, Ihr Trekking individuell zu gestalten und Ihnen bei der Vorbereitung der Reise Ihres Lebens zu helfen.',
      contactLabel: 'Kontaktieren Sie Climbing Kilimanjaro Tanzania',
      location: 'Arusha – Tansania',
      imageLeft: await uploadImage(client, {src: '/images/contact/camp.jpg', alt: 'Kilimandscharo-Camp mit Zelten unterhalb des Gipfels'}),
      imageRight: await uploadImage(client, {src: '/images/contact/summit.webp', alt: 'Ein Kletterer feiert vor dem Uhuru-Peak-Gipfelschild'}),
    },
    form: {
      eyebrow: 'Kontaktieren Sie uns',
      heading: 'Unser Experte wird sich bald bei Ihnen melden.',
      routeOptions: [
        '5 Tage Marangu-Route',
        '6 Tage Machame-Route',
        '6 Tage Marangu-Route',
        '6 Tage Umbwe-Route',
        '7 Tage Lemosho-Route',
        '7 Tage Machame-Route',
        '7 Tage Rongai-Route',
        '8 Tage Lemosho-Route',
        '9 Tage Northern-Circuit-Route',
        'Noch nicht sicher',
      ],
    },
  })
  console.log('contactPage-de created/replaced')
}

async function seedRequestQuoteDe() {
  await client.createOrReplace({
    _id: 'requestQuotePage-de',
    _type: 'requestQuotePage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Angebot Anfordern | Asili Climbing Kilimanjaro',
      description:
        'Erhalten Sie ein kostenloses, personalisiertes Angebot für Ihre Tansania-Safari oder Ihre Kilimandscharo-Besteigung bei Asili Climbing Kilimanjaro. Teilen Sie uns Ihre Reisedaten und Bedürfnisse mit, und wir übernehmen den Rest.',
    },
    hero: {
      heading: 'Angebot für eine Tansania-Safari Anfordern',
      subheading: 'Erhalten Sie sofort kostenlose Angebote für Ihre Tansania-Safari',
    },
    contactInfo: {
      address: 'Sakina, Arusha',
      officeHours: 'Montag - Sonntag: 24 Stunden, 7 Tage die Woche',
      whatsappHref: 'https://wa.me/255767140150',
    },
    intro:
      'Bereit, die Reise Ihrer Träume nach Tansania zu planen? Ihr Abenteuer beginnt hier — entdecken Sie maßgeschneiderte Touren, die zu Ihren Interessen passen, mithilfe unseres Tour-Anfragebereichs.',
    howToHeading: 'Wie Sie ein Persönliches Angebot Anfordern',
    howToBody: [
      segmentsToBlock([
        {text: 'Kontaktieren Sie unser Team von Safari- und '},
        {text: 'Kilimandscharo', bold: true, href: '/climbing-mount-kilimanjaro/'},
        {
          text: '-Experten. Wir haben Tausenden von Reisenden geholfen, alle Punkte ihrer Tansania-Traumliste abzuhaken (unter Einhaltung ihres Budgets), ohne den Stress, alles selbst planen zu müssen. Kontaktieren Sie uns noch heute mit Ihrer Tansania-Wunschliste, und lassen Sie uns gemeinsam Ihr ultimatives Safari- und Trekking-Abenteuer gestalten.',
        },
      ]),
    ],
  })
  console.log('requestQuotePage-de created/replaced')
}

async function seedZanzibarDe() {
  const cards = [
    {
      title: 'Flitterwochen auf Sansibar - 06 TAGE',
      price: '875 $ PRO PERSON',
      location: 'Stone Town Sansibar > Sansibar',
      image: {src: '/images/zanzibar/honeymoon.jpg', alt: 'Romantisches Strand-Setup mit einem Tisch für zwei, dekoriert mit Rosenblättern, die das Wort LOVE bilden'},
    },
    {
      title: 'Die Insel Sansibar Entdecken - 03 TAGE',
      price: '528 $ PRO PERSON',
      location: 'Abeid Amani Karume International Airport > Sansibar > Stone Town Sansibar',
      image: {src: '/images/zanzibar/island-3.webp', alt: 'Luftaufnahme einer kleinen bewaldeten Insel Sansibars mit einem weißen Sandstrand und einem Holzsteg'},
    },
    {
      title: 'Den Indischen Ozean Entdecken - 06 TAGE',
      price: '890 $ PRO PERSON',
      location: 'Sansibar > Stone Town Sansibar',
      image: {src: '/images/zanzibar/rock-restaurant.jpg', alt: 'Das Restaurant The Rock, thronend auf einem Korallenriff in den türkisen Gewässern vor Sansibar'},
    },
    {
      title: 'Sansibar Indischer Ozean - 06 TAGE',
      price: '1918 $ PRO PERSON',
      location: 'Stone Town Sansibar > Sansibar',
      image: {src: '/images/zanzibar/zanzibar5.jpg', alt: 'Ein Paar entspannt sich auf einer Strandliege und bewundert den Sonnenuntergang über dem Indischen Ozean'},
    },
    {
      title: 'Indischer Ozean von Sansibar - 06 TAGE',
      price: '1146 $ PRO PERSON',
      location: 'Stone Town Sansibar > Sansibar',
      image: {src: '/images/zanzibar/paje-beach.jpg', alt: 'Palmen und Strohschirme entlang eines weißen Sandstrands mit türkisfarbenem Wasser'},
    },
    {
      title: 'Die Insel Sansibar in Tansania - 05 TAGE',
      price: '1439 $ PRO PERSON',
      location: 'Stone Town Sansibar > Sansibar',
      image: {src: '/images/zanzibar/hero.webp', alt: 'Taucher erforscht ein lebendiges Korallenriff in kristallklarem Wasser vor Sansibar'},
    },
  ]
  await client.createOrReplace({
    _id: 'zanzibarPage-de',
    _type: 'zanzibarPage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Sansibar-Touren | Asili Climbing Kilimanjaro',
      description:
        'Entdecken Sie Sansibar mit Asili Climbing Kilimanjaro — weiße Sandstrände, die Kultur von Stone Town und Abenteuer im Indischen Ozean, perfekt kombiniert mit Ihrer Tansania-Reise.',
    },
    hero: {
      heading: 'Sansibar',
      backgroundImage: await uploadImage(client, {src: '/images/zanzibar/hero.webp', alt: 'Taucher erforscht ein lebendiges Korallenriff in kristallklarem Wasser vor Sansibar'}),
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
  console.log('zanzibarPage-de created/replaced')
}

async function seedTanzaniaSafariDe() {
  const cards = [
    {
      title: 'Mara-Fluss-Migrations-Safari - 07 TAGE',
      price: '4692 $ PRO PERSON',
      image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Luxus-Lodge mit Infinity-Pool mit Blick auf die Serengeti in der Dämmerung'},
    },
    {
      title: 'Simba-Safari - 05 TAGE',
      price: '2422 $ PRO PERSON',
      image: {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Zwei Elefanten grüßen sich mit ihren Rüsseln in Tansania'},
    },
    {
      title: 'Klassisches Tansania - 07 TAGE',
      price: '3273 $ PRO PERSON',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Eine Löwin ruht mit ihren zwei Jungen in den Ebenen der Serengeti'},
    },
    {
      title: 'Tansania Komfort-Erlebnis - 07 TAGE',
      price: '3326 $ PRO PERSON',
      image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Elegantes Zeltcamp eingebettet unter dem Waldkronendach'},
    },
    {
      title: 'Tansania Glamping-Safari-Erlebnis - 05 TAGE',
      price: '2383 $ PRO PERSON',
      image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge mit Pool und üppigen Gärten in der Dämmerung'},
    },
    {
      title: 'Gnu-Migrations-Safari - 09 TAGE',
      price: '6239 $ PRO PERSON',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Zwei weiße Nashörner stehen sich im Gras des Ngorongoro-Kraters gegenüber'},
    },
  ]
  await client.createOrReplace({
    _id: 'tanzaniaSafariPage-de',
    _type: 'tanzaniaSafariPage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Tansania-Safaripakete | Asili Climbing Kilimanjaro',
      description:
        'Durchsuchen Sie unsere beliebtesten Safaripakete in Tansania — Migrations-Safaris, klassische Tierbeobachtungstouren, Glamping und Komfort-Erlebnisse mit Asili Climbing Kilimanjaro.',
    },
    hero: {
      eyebrow: 'Tourart: Tansania-Safari',
      heading: 'Tansania-Safaripakete',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Ein Löwe und ein Jungtier ruhen zusammen auf einem Felsen in Tansania'}),
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
  console.log('tanzaniaSafariPage-de created/replaced')
}

async function seedSafariToursDe() {
  await client.createOrReplace({
    _id: 'safariToursPage-de',
    _type: 'safariToursPage',
    language: 'de',
    seo: {
      _type: 'seo',
      title: 'Wildtier-Safaris in Tansania | Asili Climbing Kilimanjaro',
      description:
        'Entdecken Sie Afrikas größtes Tierschauspiel. Safari-Touren in Tansania durch die Serengeti, den Ngorongoro-Krater und darüber hinaus mit Asili Climbing Kilimanjaro.',
    },
    hero: {
      eyebrow: 'Tansania-Safari',
      heading: 'Wildtier-Safaris in Tansania',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Ein Löwe und ein Jungtier ruhen zusammen auf einem Felsen in Tansania'}),
    },
    intro: {
      title: 'Wildtier-Safaris in Tansania: Entdecken Sie Afrikas größtes Tierschauspiel',
      body: 'Tansania ist nicht einfach nur ein Reiseziel — es ist eine Einladung, Afrika in seiner ganzen wilden und beeindruckenden Pracht zu entdecken. Mit seinen weiten Savannen voller Tierleben, seinen ikonischen Nationalparks und seinen authentischen kulturellen Begegnungen ist eine Wildtier-Safari in Tansania ein weltweit einzigartiges Erlebnis. Ob Sie ein Safari-Neuling oder ein erfahrener Abenteurer sind, Tansania bietet Ihnen jeden Tag unvergessliche Momente.\n\nVon den legendären Ebenen der Serengeti bis zur größten intakten vulkanischen Caldera der Welt, dem Ngorongoro-Krater — Tansania verspricht hautnahe Begegnungen mit den Big Five, Gnu-Migrationen, uralten Affenbrotbäumen und endlosen goldenen Sonnenuntergängen.',
    },
    whereToGo: {
      eyebrow: 'Alles, was Sie über Tansania wissen müssen',
      heading: 'Wohin in Tansania Reisen',
      body: 'Tansania ist ein Land der atemberaubenden Kontraste — vom schneebedeckten Gipfel des Kilimandscharo über die goldenen Savannen der Serengeti bis zu den üppigen tropischen Strände Sansibars und den tierreichen, tiefen Kratern des Ngorongoro. Ob Sie Abenteuer, Tierwelt, Kultur oder Entspannung suchen, Asili Climbing Kilimanjaro hilft Ihnen, Tansania besser als jeder andere zu entdecken — mit erfahrenen lokalen Guides und maßgeschneiderten Reisen.',
      image: await uploadImage(client, {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Zwei Elefanten grüßen sich mit ihren Rüsseln in Tansania'}),
    },
    tourStyles: {
      eyebrow: 'Entdecken Sie die Safari-Touren',
      heading: 'Beliebte Safari-Stile in Tansania',
      styles: await Promise.all(
        [
          {label: 'Luxus-Safari in Tansania', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Luxus-Lodge mit Infinity-Pool mit Blick auf die Serengeti in der Dämmerung'}},
          {label: 'Komfort-Safari in Tansania', image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Elegantes Zeltcamp eingebettet unter dem Waldkronendach'}},
          {label: 'Mittelklasse-Safari in Tansania', image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Mittelklasse-Lodge mit Pool und üppigen Gärten in der Dämmerung'}},
          {label: 'Günstige Camping-Safari in Tansania', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Safari-Zelte aus Leinen unter Bäumen für eine Camping-Safari aufgestellt'}},
        ].map(async (style) => ({_type: 'tourStyle', _key: key(), label: style.label, image: await uploadImage(client, style.image)})),
      ),
    },
    seasons: {
      eyebrow: 'Übersicht der Jahreszeiten in Tansania',
      heading: 'Was ist der beste Monat, um Tansania zu besuchen?',
      intro:
        'Es gibt keine Universallösung für eine Tansania-Safari. Sie möchten das bestmögliche Erlebnis entsprechend Ihren Wünschen. Durchsuchen Sie die Monate, um mehr darüber zu erfahren, was Sie während Ihres Besuchs erwartet.',
      months: [
        {month: 'Januar', body: 'Es ist Zeit, Tansanias natürliche Schönheit in ihrer ganzen lebendigen und farbenfrohen Pracht zu entdecken. Schon im Januar können Sie üppige Landschaften und einzigartige Fotogelegenheiten genießen, die Ihnen den Atem rauben werden!'},
        {month: 'Februar', body: 'Der Februar in Tansania ist eine unglaubliche Zeit, um Jungtiere bei ihren ersten Schritten in der Savanne zu beobachten. Die besten Orte dafür sind in Ndutu, wo sich Millionen von Gnus versammeln und in einer kurzen Periode, der sogenannten Geburtensaison, gebären. Obwohl es nachmittags zu Gewittern kommen kann, ermöglicht der Regen eine Verwandlung der Landschaft.'},
        {month: 'März', body: 'Der März wird oft als Zeitpunkt für einen Tansania-Besuch übersehen. Er bietet jedoch zahlreiche Beobachtungsmöglichkeiten mit hervorragender Vogelbeobachtung und wenig Andrang! Auch wenn es manchmal heiß (und feucht) ist, können Sie während dieser Zeit alle Arten von Wildtieren beobachten — einschließlich ihrer Jungtiere!'},
        {month: 'April', body: 'Tansania ist im April ein Paradies für Fotografen. Grüne, malerische Landschaften, Jungtiere und farbenfrohe Vögel begleiten die Straßen und begrüßen Reisende, die das Land zu dieser Zeit besuchen! Das Wetter kann im April unvorhersehbar sein, aber die Beobachtungen und Landschaften sind es definitiv wert.'},
        {month: 'Mai', body: 'Wenn Sie das Leben in Tansanias Nationalparks vor der Trockenzeit entdecken möchten, ist dies Ihre letzte Chance. Bewundern Sie im Mai prächtige grüne Wälder und weite wilde Graslandschaften voller Jungtiere, kurz bevor sich die Landschaft verändert.'},
        {month: 'Juni', body: 'Der Juni ist in Tansania eine ausgezeichnete Zeit, um zu besuchen und die trockene Landschaft zu erkunden. Besucher haben zahlreiche Gelegenheiten, Wildtiere zu beobachten, da sich die Tiere in diesem Monat um Wasserstellen versammeln. Die Tage sind kühl, aber sonnig und bieten gerade genug Feuchtigkeit, ohne zu feucht oder so staubig wie bei den windigen Bedingungen später im Jahr zu sein.'},
        {month: 'Juli', body: 'Ein Besuch Tansanias im Juli wird dringend empfohlen, wenn Sie eine Safari erleben möchten, wie sie sein sollte. Da trockenes Land seltener wird, versammeln sich die Tiere in der Nähe von Wasserstellen und sind aufgrund der trockenen Landschaft leicht zu entdecken.'},
        {month: 'August', body: 'Die lange Trockenzeit ist beendet, und die Tiere hatten Zeit, sich zu erholen. Der August in Tansania bietet Ihnen eine seltene Gelegenheit — eine ausgezeichnete Chance, Wildtiere aus nächster Nähe zu beobachten!'},
        {month: 'September', body: 'Eine der besten Zeiten für einen Tansania-Besuch ist der September, wenn die Sicht besser ist und die Sonne scheint. Das Ende der langen Trockenzeit bedeutet, dass Tiere verzweifelt nach Nahrung suchen, was Ihre Chancen erhöht, während Ihrer Safari Action zu erleben!'},
        {month: 'Oktober', body: 'Der Oktober markiert das Ende der langen Trockenzeit in Tansania, was bedeutet, dass die Tieraktivität auf ihrem Höhepunkt ist! Dichte Tieransammlungen sind während jedes Tagesausflugs oder längeren Aufenthalts am selben Ort sichtbar. Sie können die Parks durchqueren, ohne Angst zu haben, hinter anderen Fahrzeugen festzustecken, da es in diesen Monaten sehr wenig Verkehr gibt. Perfekt, wenn Sie eine authentische Safari-Atmosphäre in Tansania suchen.'},
        {month: 'November', body: 'Die tansanische Landschaft verspricht im November spektakulär zu sein, während die Natur während der kurzen Regenzeit wieder zum Leben erwacht. Mit anschwellenden Flüssen und aktiven Tieren auf Nahrungssuche verspricht dies fantastische, nicht zu verpassende Möglichkeiten zur Tierbeobachtung!'},
        {month: 'Dezember', body: 'Der Dezember ist die ideale Zeit, um Tansania zu besuchen und die natürliche Schönheit dieses prächtigen Landes zu bewundern. Die Vögel werden in ihrer ganzen Pracht zu sehen sein, wenn sie von ihrer jährlichen Migration nach einem ganzen Jahr der Abwesenheit zurückkehren! Beenden Sie Ihr Jahr in Wärme, Komfort und natürlicher Schönheit mit einem Besuch Tansanias im Dezember.'},
      ].map((month) => ({_type: 'seasonMonth', _key: key(), month: month.month, body: month.body})),
    },
    whyTravelWithUs: {
      heading: 'Warum mit uns Reisen?',
      intro: 'Entdecken Sie das authentische Afrika mit Asili Climbing Kilimanjaro — wo jede Reise mit Leidenschaft und Fachwissen gestaltet wird.',
      features: [
        {description: 'Erleben Sie ein reibungsloses Abenteuer mit unseren kompetenten und professionellen Guides, die ein bereicherndes Reiseerlebnis garantieren.'},
        {description: 'Als lokales Unternehmen bieten wir eine authentische Perspektive und enthüllen versteckte Schätze und kulturelle Einblicke für eine wirklich immersive Reise.'},
      ].map((feature) => ({_type: 'safariFeature', _key: key(), description: feature.description})),
    },
  })
  console.log('safariToursPage-de created/replaced')
}

async function run() {
  await seedAboutDe()
  await seedContactDe()
  await seedRequestQuoteDe()
  await seedZanzibarDe()
  await seedTanzaniaSafariDe()
  await seedSafariToursDe()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
