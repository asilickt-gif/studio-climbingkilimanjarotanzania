/**
 * Phase 5: French translation for blogIndexPage (singleton), the one
 * blogPost (Iringa), destinationsPage (singleton), and the one
 * destinationDetail (Serengeti).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-blog-destinations.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedBlogIndexFr() {
  await client.createOrReplace({
    _id: 'blogIndexPage-fr',
    _type: 'blogIndexPage',
    language: 'fr',
    seo: {_type: 'seo', title: 'Blog | Asili Climbing Kilimanjaro', description: 'Conseils de voyage, guides de destinations et récits venus de Tanzanie — ascensions du Kilimandjaro, safaris et bien plus encore, par Asili Climbing Kilimanjaro.'},
    heading: 'Notre blog de voyage',
    intro: "Récits, conseils et guides pour vous aider à planifier votre aventure en Tanzanie — de l'ascension du Kilimandjaro à la découverte des trésors cachés du pays.",
  })
  console.log('blogIndexPage-fr created/replaced')
}

async function seedIringaBlogPostFr() {
  const slug = '5-reasons-you-should-visit-iringa-in-2025-2026'
  const enId = await findEnId(client, 'blogPost', slug)
  if (!enId) {
    console.log(`SKIP blogPost-fr: no en source for ${slug}`)
    return
  }
  const sections = [
    {
      heading: "1. Plongez dans la riche mosaïque culturelle d'Iringa",
      body: "Iringa vibre d'une richesse culturelle, offrant un aperçu des traditions des tribus locales comme les Maasaï et les Hehe. Les bâtiments de l'époque coloniale de la ville vous transportent dans le temps — entrez dans le Old Boma, un ancien fort allemand devenu musée, pour découvrir les récits du passé d'Iringa. Aventurez-vous avec nous dans les villages voisins pour rencontrer des habitants chaleureux, vous laisser porter par les danses traditionnelles et participer à des expériences culturelles immersives. Ces moments authentiques vous permettent de vivre à la tanzanienne, forgeant des souvenirs qui perdurent bien après votre voyage.",
    },
    {
      heading: 'Émerveillez-vous devant des merveilles naturelles à couper le souffle',
      body: "Les paysages d'Iringa sont un rêve pour les amoureux de la nature, mêlant vastes savanes, collines vallonnées et forêts luxuriantes dans un décor à couper le souffle. Rejoignez-nous au parc national de Ruaha, le plus grand sanctuaire de faune sauvage de Tanzanie, pour des safaris palpitants. Observez éléphants, lions, girafes et une avifaune éclatante dans un cadre serein et peu fréquenté. Pour les randonneurs, le parc national des monts Udzungwa vous attend avec ses sentiers en forêt tropicale, ses cascades scintillantes et ses espèces rares. Randonnez jusqu'à des points de vue panoramiques et imprégnez-vous du calme de la nature.",
    },
    {
      heading: "3. Remontez le temps avec l'histoire d'Iringa",
      body: "Les racines historiques d'Iringa sont profondes, offrant des récits qui captivent les voyageurs curieux. Visitez le site préhistorique d'Isimila, où d'anciens outils et fossiles révèlent la vie humaine primitive vieille de millions d'années — une occasion rare de toucher aux origines de l'humanité. Au musée Old Boma, plongez dans l'héritage du peuple Hehe et sa résistance audacieuse face au régime colonial.",
    },
    {
      heading: "4. Célébrez lors des festivals animés d'Iringa",
      body: "Planifiez votre visite pour coïncider avec les festivals culturels vibrants d'Iringa, comme le festival culturel annuel d'Iringa en août. Cet événement haut en couleur regorge de musique traditionnelle, de danses envoûtantes et d'art local, mettant en valeur le patrimoine tanzanien. Savourez des plats authentiques et échangez avec les habitants pour goûter au véritable esprit d'Iringa.",
    },
    {
      heading: "5. Découvrez le charme préservé d'Iringa",
      body: "La magie d'Iringa réside dans son charme hors des sentiers battus, loin des foules touristiques. Ici, vous vous connecterez profondément avec les communautés locales, une nature préservée et des traditions authentiques. Rejoignez-nous pour des circuits communautaires ou des projets de bénévolat soutenant des initiatives durables, de la conservation à l'artisanat. Cette expérience authentique enrichit votre voyage et laisse une empreinte positive à Iringa.",
    },
    {
      heading: 'Pourquoi Iringa brille de mille feux',
      body: "Iringa allie profondeur culturelle, splendeur naturelle et authenticité préservée pour une aventure tanzanienne sans pareille. Que vous soyez attiré par des traditions vibrantes, des frissons animaliers ou des histoires cachées, Asili Climbing Kilimanjaro conçoit des voyages qui dépassent vos rêves les plus fous. N'attendez plus — planifiez dès maintenant votre escapade à Iringa en 2025/2026 ! Contactez-nous pour démarrer votre aventure.",
    },
  ]
  const faqs = [
    {q: 'Quelle est la meilleure période pour visiter Iringa ?', a: 'La saison sèche (juin à octobre) est idéale pour Iringa, avec un climat doux et d\'excellentes occasions d\'observation de la faune au parc national de Ruaha. La saison des pluies dévoile des paysages verdoyants pour une perspective renouvelée. Nous organisons des voyages toute l\'année.'},
    {q: 'Quelles expériences culturelles uniques vous attendent à Iringa ?', a: 'Séjournez chez l\'habitant Maasaï pour vivre leurs traditions, du perlage à l\'élevage du bétail. Ne manquez pas le festival culturel d\'Iringa en août pour sa musique, ses danses et ses saveurs locales.'},
    {q: 'Quelles sont les principales attractions d\'Iringa ?', a: 'Le parc national de Ruaha éblouit par sa faune, tandis que le site préhistorique d\'Isimila offre un aperçu de l\'histoire ancienne. Le musée Old Boma dévoile le passé colonial d\'Iringa.'},
    {q: 'Quelles aventures en plein air puis-je vivre à Iringa ?', a: 'Randonnez sur le mont Nyoni pour des vues épiques ou explorez les hauts plateaux de Kilolo pour l\'observation des oiseaux. Les parcs de Ruaha et Udzungwa offrent safaris et sentiers à profusion.'},
    {q: 'Quelle faune verrai-je à Iringa ?', a: 'Le parc national de Ruaha regorge d\'éléphants, de lions, de guépards et de plus de 570 espèces d\'oiseaux, ainsi que de zèbres et d\'antilopes rares.'},
    {q: 'Puis-je visiter une plantation de thé à Iringa ?', a: 'Oui ! Découvrez la culture du thé d\'Iringa avec des visites de plantations, en apprenant les secrets de la culture et en dégustant des infusions fraîches.'},
    {q: 'Existe-t-il des marchés locaux à visiter ?', a: 'Les marchés d\'Iringa regorgent de produits frais, d\'artisanat et de souvenirs comme des perles. Négociez pour dénicher des trésors et goûtez à la street food.'},
    {q: 'À quoi ressemble la gastronomie d\'Iringa ?', a: 'Savourez des plats tanzaniens incontournables comme l\'ugali et le nyama choma, ainsi que des plats internationaux dans les restaurants locaux et chez les vendeurs de rue.'},
    {q: 'Comment se déplacer en transport public à Iringa ?', a: 'Prenez les bus dala dala, des taxis ou des bajajis (tuk-tuks) pour vous déplacer facilement. Pour les endroits reculés, nous proposons des transferts privés pour plus de confort et de commodité.'},
    {q: 'Puis-je faire du bénévolat à Iringa ?', a: 'Absolument ! Soutenez des écoles, des projets de conservation ou communautaires — nous pouvons vous mettre en relation avec des opportunités de bénévolat enrichissantes.'},
    {q: 'Où puis-je loger à Iringa ?', a: 'Des maisons d\'hôtes chaleureuses aux lodges de luxe, Iringa a tout pour plaire — nous réservons les meilleurs hébergements selon votre budget.'},
    {q: 'Iringa est-elle sûre pour les voyageurs ?', a: 'Iringa est globalement sûre, mais restez vigilant. Surveillez vos affaires, utilisez des taxis de confiance et respectez les coutumes locales.'},
    {q: 'Quels achats puis-je faire à Iringa ?', a: 'Faites du shopping sur les marchés pour l\'artisanat, les textiles et la poterie, ou visitez les boutiques pour des articles modernes.'},
    {q: 'Comment se rendre à Iringa depuis Dar es Salaam ?', a: 'Prenez l\'avion jusqu\'à l\'aéroport d\'Iringa, un bus, ou louez une voiture depuis Dar es Salaam — nous organisons des transferts sans accroc.'},
    {q: 'Quels documents de voyage me faut-il pour Iringa ?', a: 'Munissez-vous d\'un passeport (valide 6 mois ou plus) et vérifiez les règles de visa pour la Tanzanie. Une preuve de vaccination contre la fièvre jaune peut être exigée.'},
    {q: 'Quelles activités propose le parc national de Ruaha ?', a: 'Profitez de safaris-photos, de safaris à pied et d\'observation des oiseaux à Ruaha. Observez éléphants, lions et oiseaux rares avec des guides experts.'},
    {q: 'Quelles langues sont parlées à Iringa ?', a: 'Le swahili est la langue principale, mais l\'anglais est courant dans le tourisme. Apprendre quelques phrases en swahili est très apprécié.'},
    {q: 'Quelle monnaie est utilisée à Iringa ?', a: 'Le shilling tanzanien (TZS) est la monnaie standard, mais le dollar américain fonctionne dans les lieux touristiques. Changez votre argent en banque pour des taux équitables.'},
    {q: 'Existe-t-il des structures médicales à Iringa ?', a: 'Des hôpitaux et cliniques de base existent, mais les cas graves peuvent nécessiter un transfert à Dar es Salaam. Une assurance voyage est fortement recommandée.'},
    {q: 'Puis-je visiter des écoles ou communautés locales ?', a: 'Oui ! Rencontrez des écoles ou des groupes communautaires pour des échanges culturels — nous organisons des visites respectueuses.'},
  ]
  const fields = {
    seo: {_type: 'seo', title: '5 raisons de visiter Iringa en 2025/2026 | Asili Climbing Kilimanjaro', description: 'Envie d\'une aventure tanzanienne hors des sentiers battus ? Découvrez 5 raisons irrésistibles de visiter Iringa en 2025/2026 — culture, faune, histoire et festivals.'},
    title: '5 raisons de visiter Iringa en 2025/2026',
    excerpt: "Envie d'une aventure tanzanienne hors des sentiers battus ? Nichée dans les hauts plateaux du sud, Iringa est un joyau captivant qui n'attend que de vous séduire.",
    publishedDate: '2025-05-02',
    coverImage: await uploadImage(client, {src: '/images/destinations/ruaha.webp', alt: "Troupeau d'éléphants à un point d'eau près du parc national de Ruaha à Iringa"}),
    intro:
      "Envie d'une aventure tanzanienne hors des sentiers battus ? Nichée dans les hauts plateaux du sud, Iringa est un joyau captivant qui n'attend que de vous séduire. Loin des circuits touristiques habituels, cette destination vibrante promet des moments inoubliables. Toujours indécis ? Voici cinq raisons irrésistibles de visiter Iringa en 2025/2026 avec Asili Climbing Kilimanjaro.",
    sections: sections.map((section) => ({_type: 'postSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
    faqHeading: 'Questions fréquentes',
    faqs: faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.q, answer: faq.a})),
  }
  const frId = await upsertTranslatedDoc(client, 'blogPost', slug, 'fr', fields)
  await linkTranslationMetadata(client, 'blogPost', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`blogPost-fr done (${frId})`)
}

async function seedDestinationsPageFr() {
  const destinations = [
    {
      name: 'Mont Kilimandjaro',
      image: {src: '/images/destinations/kilimanjaro.webp', alt: 'Éléphant broutant avec le Mont Kilimandjaro en arrière-plan'},
      body: "Culminant à 5 895 mètres (19 341 pieds), le Mont Kilimandjaro est la plus haute montagne indépendante du monde et une expérience incontournable. Contrairement aux autres grands sommets, aucune escalade technique n'est requise, ce qui le rend accessible aux randonneurs en bonne forme physique du monde entier.",
      highlightsHeading: 'Points forts',
      highlights: [
        'Plusieurs itinéraires pittoresques (Machame, Lemosho, Marangu, Rongai, Umbwe)',
        'Des zones écologiques variées : forêt tropicale, lande, désert alpin et sommet arctique',
        "Des treks encadrés par des experts avec un soutien complet des porteurs, un accompagnement pour l'acclimatation et des installations de camping haut de gamme",
        "Un sommet au lever du soleil au-dessus des nuages depuis l'Uhuru Peak",
      ],
      bestTime: 'Janvier-mars, juin-octobre',
      bonusHeading: 'Le plus Asili',
      bonus: ['Asili propose des ascensions personnalisées du Kilimandjaro, alliant sécurité, durabilité et vues inoubliables.'],
    },
    {
      name: 'Parc national du Serengeti',
      href: '/serengeti-national-park/',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Plaines dorées du Serengeti'},
      body: 'Le Serengeti est le cœur de l\'expérience du safari africain — d\'infinies plaines dorées, des rencontres spectaculaires entre prédateurs et proies, et la célèbre Grande Migration. C\'est une terre où chaque safari-photo raconte une nouvelle histoire.',
      highlightsHeading: 'Meilleures expériences fauniques',
      highlights: [
        'Assistez à la Grande Migration des gnous, un spectacle qui se déroule toute l\'année et implique plus de 1,5 million de gnous et de zèbres en quête de nouveaux pâturages.',
        'Les traversées de rivières (juillet-septembre) sont palpitantes, avec des crocodiles à l\'affût et des troupeaux se jetant à l\'eau.',
        'La saison des naissances (janvier-mars) est tout aussi spectaculaire, les prédateurs ciblant les nouveau-nés dans les plaines du sud.',
        'D\'excellentes observations de grands félins — notamment lions, léopards et guépards.',
        'Safaris en montgolfière au-dessus des plaines au lever du soleil (option supplémentaire).',
      ],
      bestTime: 'Juin-octobre (saison sèche, idéale pour les prédateurs) ; janvier-mars (saison des naissances dans la région de Ndutu)',
      bonusHeading: 'Le plus Asili',
      bonus: ['Nos guides connaissent parfaitement les schémas de migration et adaptent les safaris-photos pour vous rapprocher de l\'action — sans la foule.'],
    },
    {
      name: 'Cratère du Ngorongoro',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Deux rhinocéros dans l\'herbe au cratère du Ngorongoro'},
      body: 'Le cratère du Ngorongoro est la plus grande caldeira volcanique intacte du monde et un microcosme de la faune africaine. C\'est l\'un des rares endroits où vous pourriez observer les cinq grands animaux (Big Five) en une seule journée.',
      highlightsHeading: 'Meilleures expériences',
      highlights: [
        'Descendez de 600 mètres (2 000 pieds) jusqu\'au fond luxuriant du cratère pour un safari-photo d\'une journée complète.',
        'Observez rhinocéros noirs, hippopotames, lions, zèbres, buffles, chacals et flamants roses.',
        'Un paysage spectaculaire avec des parois boisées, des plaines herbeuses et un lac central.',
        'Visitez les villages Maasaï voisins pour des échanges culturels.',
      ],
      bestTime: 'Toute l\'année (la saison sèche offre une meilleure visibilité)',
      bonusHeading: 'Le plus Asili',
      bonus: ['Nous personnalisons votre journée au cratère avec des pique-niques pittoresques et un accès matinal pour éviter la foule.'],
    },
    {
      name: 'Parc national du lac Manyara',
      image: {src: '/images/destinations/lake-manyara.webp', alt: 'Paysage du parc national du lac Manyara'},
      body: 'Le lac Manyara est peut-être compact, mais il regroupe une variété impressionnante d\'habitats — des forêts d\'eaux souterraines aux plaines ouvertes en passant par le lac alcalin lui-même. C\'est une introduction idéale aux écosystèmes de la Tanzanie.',
      highlightsHeading: 'Principaux points forts',
      highlights: [
        'Célèbre pour ses lions grimpeurs d\'arbres, un comportement rare que l\'on ne voit pas dans la plupart des parcs',
        'Des milliers de flamants roses et de pélicans bordant les rives du lac',
        'Des troupes de babouins, de singes vervets, d\'éléphants et d\'hippopotames',
        'Canoë disponible lorsque le niveau de l\'eau le permet (saisonnier)',
      ],
      bestTime: 'Juin-octobre pour la faune, novembre-mars pour l\'observation des oiseaux',
      bonusHeading: 'Le plus Asili',
      bonus: ['Nous utilisons souvent Manyara comme premier parc de votre voyage — il est proche d\'Arusha et constitue une parfaite mise en jambes avant de plus grandes aventures.'],
    },
    {
      name: 'Parc national de Tarangire',
      image: {src: '/images/destinations/tarangire.jpg', alt: 'Parc national de Tarangire avec ses baobabs'},
      body: 'Souvent négligé, Tarangire est un joyau regorgeant de faune — particulièrement pendant la saison sèche, lorsque les animaux affluent vers la rivière Tarangire. Il est célèbre pour ses immenses troupeaux d\'éléphants et ses majestueux baobabs.',
      highlightsHeading: 'Meilleures observations de faune',
      highlights: [
        'D\'immenses troupeaux d\'éléphants — parfois plus de 200 individus',
        'Grands félins, girafes, autruches et parfois même des lycaons',
        'Plus de 500 espèces d\'oiseaux, en faisant un paradis pour l\'observation ornithologique',
        'Un paysage classique d\'acacias et de baobabs, parfait pour la photographie',
      ],
      bestTime: 'Juin-octobre (saison sèche, lorsque les points d\'eau attirent la faune)',
      bonusHeading: 'Le plus Asili',
      bonus: ['Nous incluons souvent Tarangire dans nos safaris du circuit nord, notamment pour ceux qui recherchent moins de foule et des vues authentiques.'],
    },
    {
      name: 'Parc national de Nyerere',
      image: {src: '/images/destinations/nyerere.webp', alt: 'Zones humides du parc national de Nyerere'},
      body: 'Nyerere est le plus grand parc national d\'Afrique, avec des rivières reculées, des forêts et des zones humides s\'étendant à perte de vue dans le sud de la Tanzanie. Il est idéal pour les voyageurs recherchant un safari brut et peu fréquenté.',
      highlightsHeading: 'Activités de safari uniques',
      highlights: [
        'Safaris en bateau sur la rivière Rufiji — observez hippopotames, crocodiles et éléphants sur les rives',
        'Safaris à pied avec des rangers armés — traquez les animaux à pied',
        'Safaris-photos avec des chances d\'observer lions, léopards, éléphants et même des lycaons',
        'Moins de touristes, des rencontres plus authentiques avec la nature sauvage',
      ],
      bestTime: 'Juin-octobre (saison sèche)',
      bonusHeading: 'Le plus Asili',
      bonus: ['Pour les clients recherchant une connexion plus longue et plus profonde avec l\'Afrique sauvage, nous vous aidons à concevoir des extensions à Nyerere hors des sentiers battus.'],
    },
    {
      name: 'Parc national de Ruaha',
      image: {src: '/images/destinations/ruaha.webp', alt: 'Paysage du parc national de Ruaha'},
      body: 'Ruaha est un secret bien gardé, idéal pour les connaisseurs de safari. Ses paysages bruts et sa faible fréquentation touristique en font une véritable frontière sauvage. La densité de la faune y est élevée et l\'action des prédateurs y est intense.',
      highlightsHeading: 'Ce qui rend Ruaha unique',
      highlights: [
        'D\'immenses prides de lions (certaines de plus de 20 individus !)',
        'Des antilopes rares comme l\'hippotrague noir, l\'hippotrague rouan et le petit koudou',
        'D\'excellentes observations de léopards, guépards et hyènes',
        'Une observation ornithologique fantastique — plus de 500 espèces et des paysages spectaculaires',
      ],
      bestTime: 'Juin-octobre (saison sèche, observation de la faune facilitée)',
      bonusHeading: 'Le plus Asili',
      bonus: ['Pour les passionnés de faune sauvage, nous pouvons combiner Ruaha avec Nyerere pour une véritable aventure dans le sud de la Tanzanie.'],
    },
    {
      name: 'Parc national de Mikumi',
      image: {src: '/images/destinations/mikumi.jpg', alt: 'Savane du parc national de Mikumi'},
      body: 'Le parc national de Mikumi est l\'un des parcs de safari les plus accessibles de Tanzanie, situé à seulement quelques heures de route de Dar es Salaam. Il est idéal pour les voyageurs disposant de peu de temps mais souhaitant tout de même découvrir le côté sauvage de la Tanzanie. Malgré son accessibilité, Mikumi surprend les visiteurs par sa faune riche et ses savanes ouvertes rappelant celles du Serengeti.',
      highlightsHeading: 'Meilleures observations de faune',
      highlights: [
        'Des lions se prélassant dans les hautes herbes ou sur des termitières',
        'De grands troupeaux de buffles, de zèbres et d\'impalas à travers les plaines',
        'Des éléphants dans les forêts de miombo',
        'Girafes, hippopotames, gnous et phacochères',
        'Une excellente observation ornithologique — plus de 400 espèces, dont des guêpiers colorés et des aigles',
      ],
      bestTime: 'Juin-octobre (saison sèche pour la meilleure concentration de faune près des points d\'eau) ; peut également être apprécié pendant la saison verte, notamment par les amateurs d\'oiseaux',
      bonusHeading: 'Pourquoi choisir Mikumi avec Asili',
      bonus: [
        'Parfait pour des safaris de 2 jours ou de week-end depuis Dar es Salaam',
        'Des hébergements confortables dans ou à proximité du parc',
        'Des circuits personnalisables pour voyageurs solos, familles ou groupes',
        'Peut être combiné avec les monts Udzungwa ou même Ruaha pour un safari prolongé dans le sud de la Tanzanie',
        'Nous proposons des forfaits safari flexibles à Mikumi avec transferts privés, safaris-photos avec guides expérimentés, et la possibilité de personnaliser votre itinéraire selon vos besoins de voyage.',
      ],
    },
    {
      name: 'Lac Natron',
      image: {src: '/images/destinations/lake-natron.jpg', alt: 'Zèbres et flamants roses au lac Natron'},
      body: "Le lac Natron est l'une des destinations les plus surréalistes et saisissantes de Tanzanie. Situé dans la Grande Vallée du Rift près de la frontière kenyane, le lac est peu profond, salé et d'une couleur rouge frappante. C'est le principal site de reproduction des flamants nains, et des milliers d'entre eux teintent le lac de rose pendant la saison de nidification. Mais il n'y a pas que les oiseaux — le mont Ol Doinyo Lengai, le seul volcan carbonatitique actif au monde, se dresse à proximité et offre une randonnée unique (bien qu'exigeante) pour les amateurs d'aventure. Natron abrite également les Maasaï semi-nomades, et les visites culturelles y sont brutes et authentiques.",
      highlightsHeading: 'Meilleures expériences',
      highlights: [
        'Observer les immenses colonies de flamants roses sur les rives',
        'Randonner jusqu\'à des cascades à travers d\'étroites gorges et des sources chaudes',
        'Visiter des bomas (villages) Maasaï traditionnels',
        'Ascension optionnelle de l\'Ol Doinyo Lengai (pour randonneurs expérimentés)',
      ],
      bestTime: 'Juin-octobre (saison sèche ; excellente pour les randonnées et la photographie). La saison de reproduction des flamants roses atteint son pic de septembre à novembre.',
      bonusHeading: 'Pourquoi visiter avec Asili Climbing Kilimanjaro',
      bonus: [
        'Randonnées et circuits culturels encadrés par des experts',
        'Un complément unique aux safaris du circuit nord ou aux ascensions du Kilimandjaro',
        'Un soutien aux communautés Maasaï locales',
      ],
    },
    {
      name: 'Lac Eyasi',
      image: {src: '/images/destinations/lake-eyasi.jpg', alt: 'Membres de la tribu Hadzabé avec des arcs traditionnels lors d\'une expédition de chasse'},
      body: 'Le lac Eyasi n\'est pas une question de grande faune, mais d\'immersion culturelle profonde. C\'est la destination idéale si vous êtes curieux des tribus indigènes de Tanzanie, en particulier les Hadzabé, l\'un des derniers peuples chasseurs-cueilleurs d\'Afrique, et les Datoga, forgerons talentueux. La région offre une occasion rare de se connecter à des traditions à peine modifiées depuis des milliers d\'années. Vous pouvez participer à des sorties de chasse matinales, observer des coutumes ancestrales et découvrir des techniques de survie antérieures à la civilisation moderne.',
      highlightsHeading: 'Meilleures expériences',
      highlights: [
        'Une expérience de chasse avec les Hadzabé, à l\'arc et aux flèches',
        'Apprendre le travail traditionnel du métal et la fabrication de bijoux avec les Datoga',
        'Des promenades pittoresques le long du lac et dans la brousse environnante',
        'Observation des oiseaux et photographie au coucher du soleil',
      ],
      bestTime: 'Toute l\'année — les circuits culturels ne dépendent pas des migrations animales ni des conditions météorologiques',
      bonusHeading: 'Pourquoi visiter avec Asili Climbing Kilimanjaro',
      bonus: [
        'Des visites culturelles responsables et respectueuses',
        'Des traducteurs et guides experts pour faciliter la compréhension',
        'Un complément culturel idéal à un safari du nord ou un trek au Kilimandjaro',
      ],
    },
  ]

  await client.createOrReplace({
    _id: 'destinationsPage-fr',
    _type: 'destinationsPage',
    language: 'fr',
    seo: {
      _type: 'seo',
      title: 'Destinations | Safaris en Tanzanie et destinations du Kilimandjaro',
      description:
        'Explorez les meilleures destinations de Tanzanie avec Asili Climbing Kilimanjaro : Mont Kilimandjaro, Serengeti, cratère du Ngorongoro, Tarangire, lac Natron et bien plus encore.',
    },
    heading: 'Destinations',
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
  console.log('destinationsPage-fr created/replaced')
}

async function seedSerengetiDetailFr() {
  const slug = 'serengeti-national-park'
  const enId = await findEnId(client, 'destinationDetail', slug)
  if (!enId) {
    console.log(`SKIP destinationDetail-fr: no en source for ${slug}`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Parc national du Serengeti | Climbing Kilimanjaro Tanzania', description: 'Tout ce que vous devez savoir pour visiter le parc national du Serengeti — activités, meilleure période pour visiter, et photos authentiques.'},
    name: 'Parc national du Serengeti',
    hero: {
      eyebrow: 'Une merveille sans fin',
      heading: 'Parc national du Serengeti',
      locationPill: 'Nord de la Tanzanie',
      backgroundImage: await uploadImage(client, {src: '/images/serengeti-national-park/serengeti-np.jpg', alt: 'Troupeau de gnous dans les plaines du Serengeti'}),
    },
    overview: {
      heading: 'Aperçu',
      body: [
        "Le parc national du Serengeti est un sanctuaire faunique de renommée mondiale situé dans le nord de la Tanzanie, célèbre pour ses vastes savanes, ses écosystèmes riches et ses occasions d'observation de la faune inégalées. S'étendant sur environ 14 750 kilomètres carrés, le parc abrite la célèbre Grande Migration des gnous, où des millions de gnous, de zèbres et de gazelles traversent les plaines à la recherche de nouveaux pâturages — un spectacle naturel impressionnant.",
        "Au-delà de la migration, le Serengeti offre une observation de la faune toute l'année, avec une abondance d'animaux, notamment des lions, léopards, éléphants, girafes, guépards et plus de 500 espèces d'oiseaux. Le nom du parc, dérivé du mot maasaï « Siringet », signifie « plaines infinies » — une description parfaite de ses paysages à couper le souffle qui s'étendent à perte de vue.",
        "Que ce soit lors d'un safari-photo, en survolant les plaines en montgolfière, ou en marchant avec un guide à travers les recoins reculés de la brousse, le Serengeti offre une expérience de safari africain véritablement authentique et inoubliable.",
      ].map(paragraphBlock),
    },
    activitiesHeading: 'Activités populaires et mémorables à faire dans le parc national du Serengeti',
    activities: [
      {title: 'Migrations de gnous', body: "Selon la saison, vous pourrez observer plus d'un million de gnous et des centaines de milliers de zèbres et de gazelles lors de leur épique périple — particulièrement spectaculaire lors des traversées de rivières dans le nord du Serengeti."},
      {title: 'Safari en montgolfière', body: 'Découvrez le Serengeti vu du ciel au lever du soleil. Survolez les plaines pendant que la faune évolue en dessous, suivi d\'un petit-déjeuner au champagne dans la brousse.'},
      {title: 'Safari-photo', body: "L'activité la plus emblématique, les safaris-photos offrent la possibilité d'observer les Big Five (lion, éléphant, buffle, léopard et rhinocéros) ainsi que des guépards, hyènes, girafes, zèbres et d'innombrables gnous. Les excursions peuvent se faire tôt le matin, l'après-midi, ou sur une journée complète."},
      {title: 'Observation des oiseaux', body: "Avec plus de 500 espèces d'oiseaux, le Serengeti est un paradis pour les ornithologues. Repérez les messagers sagittaires, vautours, outardes kori et guêpiers colorés, notamment autour des points d'eau et des zones boisées."},
      {title: 'Safari à pied', body: 'Encadrés par des rangers armés et des naturalistes experts, les safaris à pied vous permettent d\'explorer le parc à pied — en apprenant à reconnaître les traces, les plantes et les petites créatures souvent manquées lors des safaris-photos.'},
      {title: 'Safaris photographiques', body: 'Avec ses paysages superbes, sa lumière spectaculaire et sa faune abondante, le Serengeti est parfait pour les photographes amateurs comme professionnels. Certains opérateurs proposent des véhicules et guides spécialisés en photographie.'},
    ].map((activity) => ({_type: 'activity', _key: key(), title: activity.title, body: activity.body})),
    bestTimeToVisit: {
      heading: 'Meilleure période pour visiter',
      body: [
        'La meilleure période pour voir la migration est de juillet à octobre. C\'est la saison sèche, et en juin et juillet, les troupeaux affrontent leur plus grand défi : la traversée de la rivière Mara. Si vous souhaitez voir les prédateurs en action, partez en janvier ou février, lorsqu\'il y a une accalmie dans les pluies annuelles et que les gnous mettent bas.',
        'Notez que voyager en haute saison implique naturellement des coûts plus élevés, et le pays possède une certaine beauté pendant ou juste après les pluies.',
      ].map(paragraphBlock),
    },
    gallery: await Promise.all(
      [
        {src: '/images/serengeti-national-park/wildebeest-migrations.webp', alt: 'Migrations de gnous'},
        {src: '/images/serengeti-national-park/balloon-safari.jpeg', alt: 'Safari en montgolfière'},
        {src: '/images/serengeti-national-park/elephant-serengeti.jpg', alt: 'Éléphant dans le Serengeti'},
        {src: '/images/serengeti-national-park/cheetah.jpg', alt: 'Guépard'},
        {src: '/images/serengeti-national-park/lion.jpg', alt: 'Lion'},
        {src: '/images/serengeti-national-park/zebra-serengeti.jpg', alt: 'Zèbre dans le Serengeti'},
      ].map((img) => uploadImage(client, img)),
    ),
    otherDestinationsHeading: 'Autres destinations de safari',
    otherDestinations: await Promise.all(
      [
        {name: 'Cratère du Ngorongoro', href: '/destinations/', image: {src: '/images/serengeti-national-park/ngorongoro-crater.jpg', alt: 'Cratère du Ngorongoro'}},
        {name: 'Parc national de Tarangire', href: '/destinations/', image: {src: '/images/serengeti-national-park/tarangire.webp', alt: 'Parc national de Tarangire'}},
        {name: 'Parc national du lac Manyara', href: '/destinations/', image: {src: '/images/serengeti-national-park/lake-manyara.jpg', alt: 'Parc national du lac Manyara'}},
        {name: 'Parc national de Mkomazi', href: '/destinations/', image: {src: '/images/serengeti-national-park/mkomazi.webp', alt: 'Parc national de Mkomazi'}},
        {name: "Parc national d'Arusha", href: '/destinations/', image: {src: '/images/serengeti-national-park/arusha-national-park.jpg', alt: "Parc national d'Arusha"}},
      ].map(async (dest) => ({_type: 'crossPromo', _key: key(), name: dest.name, href: dest.href, image: await uploadImage(client, dest.image)})),
    ),
  }
  const frId = await upsertTranslatedDoc(client, 'destinationDetail', slug, 'fr', fields)
  await linkTranslationMetadata(client, 'destinationDetail', [
    {language: 'en', id: enId},
    {language: 'fr', id: frId},
  ])
  console.log(`destinationDetail-fr done (${frId})`)
}

async function run() {
  await seedBlogIndexFr()
  await seedIringaBlogPostFr()
  await seedDestinationsPageFr()
  await seedSerengetiDetailFr()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
