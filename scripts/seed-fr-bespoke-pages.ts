/**
 * Phase 5: French translation for the 6 bespoke page singletons
 * (aboutPage, contactPage, requestQuotePage, zanzibarPage,
 * tanzaniaSafariPage, safariToursPage). Mirrors seed-bespoke-pages.ts's
 * field construction but with translated text; images reuse the same
 * source files as the en docs (dedup by content hash).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-bespoke-pages.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedAboutFr() {
  await client.createOrReplace({
    _id: 'aboutPage-fr',
    _type: 'aboutPage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: "À propos d'Asili Climbing Kilimanjaro | La meilleure agence pour le Mont Kilimandjaro",
      description:
        'Découvrez Asili Climbing Kilimanjaro — un voyagiste de charme en Tanzanie aux racines locales profondes, avec des guides experts et une passion pour les aventures africaines inoubliables.',
    },
    hero: {
      heading: 'La meilleure agence pour le Mont Kilimandjaro',
      backgroundImage: await uploadImage(client, {
        src: '/images/about-asili-explorer/hero.webp',
        alt: 'Une file de randonneurs marchant vers le Mont Kilimandjaro à travers une végétation de lande',
      }),
    },
    intro: {
      eyebrow: 'À PROPOS DE Climbing Kilimanjaro Tanzania',
      sections: [
        {
          body: 'Nous adaptons chaque expérience de safari à votre budget et à vos préférences, garantissant un itinéraire parfait rien que pour vous. De votre première demande à votre dépose finale à l\'aéroport, nous nous engageons à offrir un service client exceptionnel à chaque étape.',
        },
        {
          body: "En ce qui concerne l'expérience du safari, la faune exceptionnelle de la Tanzanie ainsi que ses nombreux et magnifiques parcs nationaux et réserves naturelles en font l'endroit idéal en Afrique pour partir en safari. Que vous préfériez faire votre safari à l'arrière d'un véhicule ou tenter quelque chose de plus aventureux comme la marche guidée ou même le canoë, une multitude d'options s'offrent à vous.",
        },
        {
          body: "Les parcs nationaux tanzaniens, comme le lac Manyara, le Ngorongoro, Tarangire et le célèbre Serengeti, permettent d'observer les mythiques Big Five ainsi qu'un nombre considérable d'autres animaux, oiseaux et insectes que vous ne verrez probablement nulle part ailleurs dans le monde.",
        },
        {
          body: "La Tanzanie est également le berceau de la tribu Maasaï, et aucune visite en Tanzanie ne serait complète sans une rencontre avec ce peuple et une visite du Berceau de l'humanité aux gorges d'Olduvai. Pour les plus aventureux, l'ascension du légendaire Mont Kilimandjaro ou du Mont Meru, plus modeste mais tout aussi magnifique, est également possible. Les amateurs de soleil, de sable et de détente pourront visiter la magnifique Zanzibar, un havre insulaire dont le patrimoine culturel est aussi séduisant que ses plages et ses forêts tropicales.",
        },
        {
          body: "Chez Asili Climbing Kilimanjaro, nous élevons les aventures de safari à de nouveaux niveaux d'aventure et d'excellence. Notre vision est de proposer des aventures inoubliables et de haute qualité mettant en valeur la splendeur naturelle de l'Afrique. En mettant l'accent sur la qualité et le souci du détail, nous visons l'excellence en matière de safari, en offrant des rencontres exceptionnelles avec la faune et des expériences de voyage remarquables. Inspirés par la préservation de l'environnement, la sensibilité culturelle et l'autonomisation des communautés, nous œuvrons pour un tourisme responsable.",
        },
        {
          body: "Chaque membre du personnel d'Asili Climbing Kilimanjaro connaît et est passionné par une immense quantité d'informations sur l'Afrique. De notre personnel local à nos agents internationaux, chaque membre de notre équipe peut se targuer d'être un expert du safari. Nous avons visité les hôtels, exploré les parcs et négocié avec les compagnies aériennes afin que vous bénéficiiez du meilleur prix et de la meilleure expérience possible.",
        },
        {
          heading: 'Votre guide est votre lien avec l\'Afrique',
          body: "Asili Climbing Kilimanjaro n'emploie que les chauffeurs les plus sympathiques et expérimentés. Tous nos guides parlent anglais et partagent un véritable amour pour la faune, l'avifaune et la flore africaines. Ils savent tout et se feront un plaisir de répondre à vos questions ! Nos guides ne se contentent pas de conduire chaque jour, ils seront également votre clé d'accès aux parcs que vous visitez, à la faune que vous rencontrez, aux personnes que vous croisez, et bien plus encore. Que ce soit Dickson, Bashiru, Lomayani, Alex ou l'un de nos autres chauffeurs hautement qualifiés, vous êtes entre de bonnes mains. Nous organisons également des guides parlant d'autres langues comme l'allemand, l'espagnol, l'italien, le français, le chinois, le coréen, etc. sur demande.",
        },
        {
          body: "Asili Climbing Kilimanjaro est spécialisé dans la conception de safaris privés sur mesure répondant à tous vos besoins. Que vous rêviez de renouer avec la nature grâce à un safari de camping et de trekking économique, ou que vous préfériez vivre votre expérience africaine dans le luxe le plus total, nous sommes là pour vous guider à chaque étape afin de créer l'itinéraire ultime. Nous sommes fiers d'offrir un service client de classe mondiale et de répondre à tous les besoins de nos clients.",
        },
        {
          body: "Alors que la plupart des autres entreprises de safari imposent des restrictions de kilométrage ou de carburant sur leurs safaris-photos, nous proposons des safaris-photos illimités de 6 h à 18 h chaque jour de votre séjour. Vous avez un contrôle total sur votre journée. Envie de passer toute la journée en safari et de pique-niquer dans le Serengeti ? C'est possible ! Envie de faire la grasse matinée et de profiter d'une matinée tranquille avant de partir pour un safari-photo au coucher du soleil ? C'est possible aussi ! C'est vous qui décidez !",
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
      alt: "Un couple appréciant un dîner au coucher du soleil sous un acacia dans la savane tanzanienne",
    }),
    fleetSection: {
      heading: 'Notre flotte et le confort à bord',
      body:
        "La flotte de véhicules spécialement conçus d'Asili Climbing Kilimanjaro est la façon idéale de vivre un safari africain. Nos Land Cruiser 4x4 ont été spécialement aménagés pour votre confort et votre sécurité, avec des toits ouvrants, des portes coulissantes et une carrosserie allongée pour vous garantir une vue panoramique à 360 degrés sur toute l'action. Tous nos véhicules sont entretenus à la fin de chaque safari et font également l'objet d'une remise à neuf annuelle pour garantir des normes élevées de sécurité et de confort. De plus, tous nos véhicules disposent de stations de charge, de kits de premiers secours, de réfrigérateurs et du WiFi (Tanzanie uniquement).\n\nLe « panier-repas de safari » a plutôt mauvaise réputation dans le milieu du safari. Bien que chaque lodge fasse de son mieux pour rendre ce moment agréable, une certaine répétition est difficile à éviter. Nous avons fait appel aux services d'un chef professionnel pour préparer notre panier-repas dès le premier jour, et la différence de qualité est notable. Pourquoi se contenter de sandwichs secs et de chips dans votre sac quand vous pouvez déguster un repas chaud, des produits fraîchement préparés, le tout accompagné d'une tasse de café fraîchement moulu ?\n\nPour toutes ces raisons et bien d'autres encore, nous sommes l'équipe idéale pour vous aider à concrétiser votre safari africain de rêve.\n\nSi ce n'est pas encore fait, n'hésitez pas à nous contacter pour commencer à planifier votre safari idéal.",
    },
    quote:
      "« Le fondement même de l'esprit vivant d'un homme est sa passion pour l'aventure. La joie de vivre naît de nos rencontres avec de nouvelles expériences, et il n'y a donc pas de plus grande joie que d'avoir un horizon en perpétuel changement, que chaque jour ait un soleil nouveau et différent »",
    ctaHeading: 'Laissez-nous vous aider',
  })
  console.log('aboutPage-fr created/replaced')
}

async function seedContactFr() {
  await client.createOrReplace({
    _id: 'contactPage-fr',
    _type: 'contactPage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: 'Contactez Asili | Climbing Kilimanjaro Tanzania',
      description:
        "Prêt à conquérir le Kilimandjaro ? Contactez dès aujourd'hui Climbing Kilimanjaro Tanzania et laissez notre équipe d'experts vous aider à planifier votre ascension.",
    },
    pageTitle: 'Contactez Asili',
    hero: {
      backgroundImage: await uploadImage(client, {
        src: '/images/contact/hero.webp',
        alt: 'Le Mont Kilimandjaro vu au-dessus des acacias de la savane africaine',
      }),
      heading: 'Contactez-nous',
      subheading: 'Prêt à conquérir le Kilimandjaro ? Faisons-le ensemble !',
    },
    intro: {
      heading: 'Commencez votre ascension avec Climbing Kilimanjaro Tanzania',
      body: "Que vous planifiiez votre premier sommet ou reveniez pour une nouvelle aventure, nous sommes là pour vous guider à chaque étape. Contactez-nous dès aujourd'hui — notre équipe d'experts est prête à répondre à vos questions, personnaliser votre trek et vous aider à préparer le voyage de votre vie.",
      contactLabel: 'Contacter Climbing Kilimanjaro Tanzania',
      location: 'Arusha – Tanzanie',
      imageLeft: await uploadImage(client, {src: '/images/contact/camp.jpg', alt: 'Camp du Kilimandjaro avec tentes sous le sommet'}),
      imageRight: await uploadImage(client, {src: '/images/contact/summit.webp', alt: 'Un grimpeur célébrant devant le panneau du sommet Uhuru Peak'}),
    },
    form: {
      eyebrow: 'Contactez-nous',
      heading: 'Notre expert vous contactera bientôt.',
      routeOptions: [
        '5 jours Route Marangu',
        '6 jours Route Machame',
        '6 jours Route Marangu',
        '6 jours Route Umbwe',
        '7 jours Route Lemosho',
        '7 jours Route Machame',
        '7 jours Route Rongai',
        '8 jours Route Lemosho',
        '9 jours Route Northern Circuit',
        'Pas encore sûr',
      ],
    },
  })
  console.log('contactPage-fr created/replaced')
}

async function seedRequestQuoteFr() {
  await client.createOrReplace({
    _id: 'requestQuotePage-fr',
    _type: 'requestQuotePage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: 'Demander un devis | Asili Climbing Kilimanjaro',
      description:
        "Obtenez un devis gratuit et personnalisé pour votre safari en Tanzanie ou votre ascension du Kilimandjaro auprès d'Asili Climbing Kilimanjaro. Indiquez-nous vos dates de voyage et vos besoins, et nous nous occupons du reste.",
    },
    hero: {
      heading: 'Demander un devis pour un safari en Tanzanie',
      subheading: 'Obtenez dès maintenant des devis gratuits pour votre safari en Tanzanie',
    },
    contactInfo: {
      address: 'Sakina, Arusha',
      officeHours: 'Lundi - Dimanche : 24 h/24 et 7 j/7',
      whatsappHref: 'https://wa.me/255767140150',
    },
    intro:
      "Prêt à planifier le voyage de vos rêves en Tanzanie ? Votre aventure commence ici — découvrez des circuits sur mesure adaptés à vos centres d'intérêt grâce à notre section de demande de circuit.",
    howToHeading: 'Comment demander un devis personnalisé',
    howToBody: [
      segmentsToBlock([
        {text: "Contactez notre équipe d'experts en safari et "},
        {text: 'Kilimandjaro', bold: true, href: '/climbing-mount-kilimanjaro/'},
        {
          text: ". Nous avons aidé des milliers de voyageurs à cocher toutes les cases de leur liste de rêves en Tanzanie (tout en respectant leur budget) sans le stress de tout planifier seuls. Contactez-nous dès aujourd'hui au sujet de votre liste de souhaits pour la Tanzanie, et créons ensemble votre aventure de safari et de trekking ultime.",
        },
      ]),
    ],
  })
  console.log('requestQuotePage-fr created/replaced')
}

async function seedZanzibarFr() {
  const cards = [
    {
      title: 'Une lune de miel à Zanzibar - 06 JOURS',
      price: '875 $ PAR PERSONNE',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/honeymoon.jpg', alt: 'Installation romantique sur la plage avec une table pour deux décorée de pétales de rose formant le mot LOVE'},
    },
    {
      title: "Découvrir l'île de Zanzibar - 03 JOURS",
      price: '528 $ PAR PERSONNE',
      location: 'Abeid Amani Karume International Airport > Zanzibar > Stone Town Zanzibar',
      image: {src: '/images/zanzibar/island-3.webp', alt: 'Vue aérienne d\'une petite île boisée de Zanzibar avec une plage de sable blanc et une jetée en bois'},
    },
    {
      title: "Découvrir l'Océan Indien - 06 JOURS",
      price: '890 $ PAR PERSONNE',
      location: 'Zanzibar > Stone Town Zanzibar',
      image: {src: '/images/zanzibar/rock-restaurant.jpg', alt: 'Le restaurant The Rock perché sur un affleurement corallien dans les eaux turquoise au large de Zanzibar'},
    },
    {
      title: 'Zanzibar Océan Indien - 06 JOURS',
      price: '1918 $ PAR PERSONNE',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/zanzibar5.jpg', alt: 'Couple se détendant sur un lit de plage en admirant le coucher de soleil sur l\'océan Indien'},
    },
    {
      title: 'Océan Indien de Zanzibar - 06 JOURS',
      price: '1146 $ PAR PERSONNE',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/paje-beach.jpg', alt: 'Palmiers et parasols de plage en chaume le long d\'une plage de sable blanc aux eaux turquoise'},
    },
    {
      title: "L'île de Zanzibar en Tanzanie - 05 JOURS",
      price: '1439 $ PAR PERSONNE',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/hero.webp', alt: 'Plongeur explorant un récif corallien vibrant dans les eaux claires au large de Zanzibar'},
    },
  ]
  await client.createOrReplace({
    _id: 'zanzibarPage-fr',
    _type: 'zanzibarPage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: 'Circuits à Zanzibar | Asili Climbing Kilimanjaro',
      description:
        "Découvrez Zanzibar avec Asili Climbing Kilimanjaro — plages de sable blanc, culture de Stone Town et aventures dans l'océan Indien, parfaitement associées à votre voyage en Tanzanie.",
    },
    hero: {
      heading: 'Zanzibar',
      backgroundImage: await uploadImage(client, {src: '/images/zanzibar/hero.webp', alt: 'Plongeur explorant un récif corallien vibrant dans les eaux claires au large de Zanzibar'}),
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
  console.log('zanzibarPage-fr created/replaced')
}

async function seedTanzaniaSafariFr() {
  const cards = [
    {
      title: 'Safari de la migration sur la rivière Mara - 07 JOURS',
      price: '4692 $ PAR PERSONNE',
      image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Lodge de luxe avec piscine à débordement surplombant le Serengeti au crépuscule'},
    },
    {
      title: 'Safari Simba - 05 JOURS',
      price: '2422 $ PAR PERSONNE',
      image: {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Deux éléphants se saluant trompe contre trompe en Tanzanie'},
    },
    {
      title: 'Tanzanie Classique - 07 JOURS',
      price: '3273 $ PAR PERSONNE',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Une lionne se reposant avec ses deux petits dans les plaines du Serengeti'},
    },
    {
      title: 'Expérience Confort Tanzanie - 07 JOURS',
      price: '3326 $ PAR PERSONNE',
      image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Élégant camp de tentes niché sous la canopée forestière'},
    },
    {
      title: 'Expérience Safari Glamping Tanzanie - 05 JOURS',
      price: '2383 $ PAR PERSONNE',
      image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge avec piscine et jardins luxuriants au crépuscule'},
    },
    {
      title: 'Safari de la migration des gnous - 09 JOURS',
      price: '6239 $ PAR PERSONNE',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Deux rhinocéros blancs se faisant face dans l\'herbe du cratère du Ngorongoro'},
    },
  ]
  await client.createOrReplace({
    _id: 'tanzaniaSafariPage-fr',
    _type: 'tanzaniaSafariPage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: 'Forfaits safari en Tanzanie | Asili Climbing Kilimanjaro',
      description:
        'Parcourez nos forfaits safari les plus populaires en Tanzanie — safaris de migration, circuits classiques d\'observation de la faune, glamping et expériences confort avec Asili Climbing Kilimanjaro.',
    },
    hero: {
      eyebrow: 'Type de circuit : Safari en Tanzanie',
      heading: 'Forfaits safari en Tanzanie',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Un lion et un lionceau se reposant ensemble sur un rocher en Tanzanie'}),
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
  console.log('tanzaniaSafariPage-fr created/replaced')
}

async function seedSafariToursFr() {
  await client.createOrReplace({
    _id: 'safariToursPage-fr',
    _type: 'safariToursPage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: 'Safari faune sauvage en Tanzanie | Asili Climbing Kilimanjaro',
      description:
        "Découvrez le plus grand spectacle animalier d'Afrique. Circuits de safari en Tanzanie à travers le Serengeti, le cratère du Ngorongoro et au-delà avec Asili Climbing Kilimanjaro.",
    },
    hero: {
      eyebrow: 'Safari en Tanzanie',
      heading: 'Safari faune sauvage en Tanzanie',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Un lion et un lionceau se reposant ensemble sur un rocher en Tanzanie'}),
    },
    intro: {
      title: "Safari faune sauvage en Tanzanie : découvrez le plus grand spectacle animalier d'Afrique",
      body: "La Tanzanie n'est pas une simple destination — c'est une invitation à découvrir l'Afrique dans toute sa splendeur sauvage et impressionnante. Avec ses vastes savanes grouillantes de vie sauvage, ses parcs nationaux emblématiques et ses rencontres culturelles authentiques, un safari faune sauvage en Tanzanie est une expérience unique au monde. Que vous soyez un néophyte du safari ou un aventurier chevronné, la Tanzanie vous offre des moments inoubliables chaque jour.\n\nDes plaines légendaires du Serengeti à la plus grande caldeira volcanique intacte du monde, le cratère du Ngorongoro — la Tanzanie promet des rencontres rapprochées avec les Big Five, les migrations de gnous, d'antiques baobabs et d'interminables couchers de soleil dorés.",
    },
    whereToGo: {
      eyebrow: 'Tout ce que vous devez savoir sur la Tanzanie',
      heading: 'Où aller en Tanzanie',
      body: "La Tanzanie est une terre de contrastes à couper le souffle — du sommet enneigé du Mont Kilimandjaro aux savanes dorées du Serengeti, en passant par les plages tropicales luxuriantes de Zanzibar et les cratères profonds et riches en faune du Ngorongoro. Que vous recherchiez l'aventure, la faune, la culture ou la détente, Asili Climbing Kilimanjaro vous aide à découvrir la Tanzanie mieux que quiconque — avec des guides locaux experts et des voyages sur mesure.",
      image: await uploadImage(client, {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Deux éléphants se saluant trompe contre trompe en Tanzanie'}),
    },
    tourStyles: {
      eyebrow: 'Découvrir les circuits de safari',
      heading: 'Styles de safaris populaires en Tanzanie',
      styles: await Promise.all(
        [
          {label: 'Safari de luxe en Tanzanie', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Lodge de luxe avec piscine à débordement surplombant le Serengeti au crépuscule'}},
          {label: 'Safari confort en Tanzanie', image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Élégant camp de tentes niché sous la canopée forestière'}},
          {label: 'Safari milieu de gamme en Tanzanie', image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge milieu de gamme avec piscine et jardins luxuriants au crépuscule'}},
          {label: 'Safari camping économique en Tanzanie', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Tentes de safari en toile installées sous les arbres pour un safari camping'}},
        ].map(async (style) => ({_type: 'tourStyle', _key: key(), label: style.label, image: await uploadImage(client, style.image)})),
      ),
    },
    seasons: {
      eyebrow: 'Aperçu des saisons en Tanzanie',
      heading: 'Quel est le meilleur mois pour visiter la Tanzanie ?',
      intro:
        "Il n'existe pas de solution universelle pour un safari en Tanzanie. Vous souhaitez vivre la meilleure expérience possible, selon vos envies. Parcourez les mois pour en savoir plus sur ce à quoi vous attendre lors de votre visite.",
      months: [
        {month: 'Janvier', body: 'C\'est le moment de découvrir la beauté naturelle de la Tanzanie dans toute sa splendeur éclatante et colorée. Dès janvier, vous pourrez profiter de paysages luxuriants et d\'occasions photographiques uniques qui vous couperont le souffle !'},
        {month: 'Février', body: 'Février en Tanzanie est une période incroyable pour observer les jeunes animaux faire leurs premiers pas dans la savane. Les meilleurs endroits pour cela sont à Ndutu, où des millions de gnous se rassemblent et mettent bas sur une courte période appelée la saison des naissances. Bien que des orages puissent survenir l\'après-midi, la pluie permettra une transformation du paysage.'},
        {month: 'Mars', body: 'Mars est une période de l\'année souvent négligée pour visiter la Tanzanie. Elle offre pourtant de nombreuses occasions d\'observation, avec une magnifique ornithologie et peu de monde ! Bien qu\'il fasse parfois chaud (et humide), vous pourrez observer toutes sortes d\'animaux sauvages durant cette période — y compris leurs petits !'},
        {month: 'Avril', body: 'La Tanzanie est un paradis pour les photographes en avril. Des paysages verdoyants et pittoresques, de jeunes animaux et des oiseaux colorés bordent les routes pour accueillir les voyageurs qui viennent visiter le pays durant cette période ! La météo peut être imprévisible en avril, mais les observations et les paysages en valent largement la peine.'},
        {month: 'Mai', body: 'Si vous souhaitez découvrir la vie dans les parcs nationaux de Tanzanie avant la saison sèche, c\'est votre dernière chance. Admirez de magnifiques forêts verdoyantes et de vastes plaines herbeuses sauvages remplies de jeunes animaux en mai, juste avant que le paysage ne se transforme.'},
        {month: 'Juin', body: 'Juin en Tanzanie est une excellente période pour visiter et explorer le paysage sec. Les visiteurs auront de nombreuses occasions d\'observer la faune, les animaux se regroupant autour des points d\'eau durant ce mois. Les journées sont fraîches mais ensoleillées, offrant juste assez d\'humidité sans être trop humides ni poussiéreuses comme lors des conditions venteuses observées plus tard dans l\'année.'},
        {month: 'Juillet', body: 'Visiter la Tanzanie en juillet est vivement recommandé si vous souhaitez profiter d\'un safari tel qu\'il devrait être vécu. Les terres sèches se faisant plus rares, les animaux se rassemblent près des points d\'eau et sont facilement repérables grâce au paysage aride.'},
        {month: 'Août', body: 'La longue saison sèche est terminée, et les animaux ont eu l\'occasion de reprendre des forces. Août en Tanzanie vous offre une opportunité rare — une excellente chance d\'observer la faune de près !'},
        {month: 'Septembre', body: 'L\'une des meilleures périodes pour visiter la Tanzanie est septembre, lorsque la visibilité est meilleure et que le soleil brille. La fin de la longue saison sèche signifie que les animaux sont en quête désespérée de nourriture, ce qui augmente vos chances d\'assister à de l\'action pendant votre safari !'},
        {month: 'Octobre', body: 'Octobre marque la fin de la longue saison sèche en Tanzanie, ce qui signifie que l\'action animalière bat son plein ! De denses regroupements d\'animaux sont visibles lors de n\'importe quelle excursion d\'une journée ou d\'un séjour plus long au même endroit. Vous pouvez traverser les parcs sans craindre d\'être bloqué derrière d\'autres véhicules, car il y a très peu de circulation durant ces mois. Parfait si vous recherchez une ambiance de safari authentique en Tanzanie.'},
        {month: 'Novembre', body: 'Le paysage tanzanien s\'annonce spectaculaire en novembre, alors que la nature reprend vie durant la courte saison des pluies. Avec des rivières en crue et des animaux s\'activant à la recherche de nourriture, cela promet de fantastiques occasions d\'observation de la faune à ne pas manquer !'},
        {month: 'Décembre', body: 'Décembre est la période idéale pour visiter la Tanzanie et admirer la beauté naturelle de ce magnifique pays. Les oiseaux seront dans toute leur splendeur à leur retour de migration annuelle après une année entière d\'absence ! Terminez votre année dans la chaleur, le confort et la beauté naturelle en visitant la Tanzanie en décembre.'},
      ].map((month) => ({_type: 'seasonMonth', _key: key(), month: month.month, body: month.body})),
    },
    whyTravelWithUs: {
      heading: 'Pourquoi voyager avec nous ?',
      intro: 'Découvrez l\'Afrique authentique avec Asili Climbing Kilimanjaro — où chaque voyage est conçu avec passion et expertise.',
      features: [
        {description: 'Vivez une aventure fluide avec nos guides compétents et professionnels, garantissant une expérience de voyage enrichissante.'},
        {description: 'En tant qu\'entreprise locale, nous offrons une perspective authentique, révélant des trésors cachés et des perspectives culturelles pour un voyage véritablement immersif.'},
      ].map((feature) => ({_type: 'safariFeature', _key: key(), description: feature.description})),
    },
  })
  console.log('safariToursPage-fr created/replaced')
}

async function run() {
  await seedAboutFr()
  await seedContactFr()
  await seedRequestQuoteFr()
  await seedZanzibarFr()
  await seedTanzaniaSafariFr()
  await seedSafariToursFr()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
