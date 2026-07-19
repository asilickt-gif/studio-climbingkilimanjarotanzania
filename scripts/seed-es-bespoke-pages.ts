/**
 * Spanish bespoke pages seed: the 6 bespoke page singletons (aboutPage, contactPage,
 * requestQuotePage, zanzibarPage, tanzaniaSafariPage, safariToursPage).
 * Mirrors seed-it-bespoke-pages.ts's structure but with Spanish text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-bespoke-pages.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, segmentsToBlock} from './lib/pt'
import {uploadImage} from './lib/assets'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedAboutEs() {
  await client.createOrReplace({
    _id: 'aboutPage-es',
    _type: 'aboutPage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Sobre Asili Climbing Kilimanjaro | La Mejor Agencia para el Monte Kilimanjaro',
      description:
        'Conoce Asili Climbing Kilimanjaro — un operador turístico boutique en Tanzania con profundas raíces locales, guías expertos y una pasión por las aventuras africanas inolvidables.',
    },
    hero: {
      heading: 'La Mejor Agencia para el Monte Kilimanjaro',
      backgroundImage: await uploadImage(client, {
        src: '/images/about-asili-explorer/hero.webp',
        alt: 'Una fila de excursionistas caminando hacia el Monte Kilimanjaro a través de vegetación de páramo',
      }),
    },
    intro: {
      eyebrow: 'SOBRE Climbing Kilimanjaro Tanzania',
      sections: [
        {
          body: 'Adaptamos cada experiencia de safari a tu presupuesto y preferencias, garantizando un itinerario perfecto solo para ti. Desde tu primera consulta hasta tu traslado final al aeropuerto, nos comprometemos a ofrecer un servicio al cliente excepcional en cada paso del camino.',
        },
        {
          body: 'En cuanto a la experiencia del safari, la impresionante variedad de fauna de Tanzania y sus numerosos y hermosos parques nacionales y reservas naturales la convierten en el lugar ideal de África para ir de safari. Ya sea que prefieras hacer tu safari desde la parte trasera de un vehículo o quieras intentar algo un poco más aventurero, como una caminata guiada o incluso el piragüismo, hay una gran variedad de opciones disponibles.',
        },
        {
          body: 'Los parques nacionales de Tanzania, como el lago Manyara, el Ngorongoro, Tarangire y el mundialmente famoso Serengeti, permiten observar a los legendarios Big Five y una enorme cantidad de otros animales, aves e insectos que probablemente no verás en ningún otro lugar del mundo.',
        },
        {
          body: 'Tanzania es también la cuna de la tribu Maasai, y ninguna visita a Tanzania estaría completa sin encontrarse con este pueblo y visitar la Cuna de la Humanidad en las gargantas de Olduvai. Para los más aventureros, también existe la posibilidad de escalar el legendario Monte Kilimanjaro o el más modesto pero igualmente hermoso Monte Meru. Los amantes del sol, la arena y la relajación pueden visitar la hermosa Zanzibar, un encantador refugio insular cuyo patrimonio cultural es tan atractivo como sus playas y sus bosques tropicales.',
        },
        {
          body: 'En Asili Climbing Kilimanjaro, llevamos las aventuras de safari a nuevos niveles de aventura y excelencia. Nuestra visión es ofrecer aventuras memorables y de alta calidad que muestren el esplendor natural de África. Con énfasis en la calidad y la atención al detalle, aspiramos a ser los mejores en excelencia de safari, ofreciendo encuentros excepcionales con la fauna salvaje y experiencias de viaje sobresalientes. Inspirados por la protección del medio ambiente, la sensibilidad cultural y el empoderamiento comunitario, buscamos promover un turismo responsable.',
        },
        {
          body: 'Cada uno de los miembros del equipo de Asili Climbing Kilimanjaro conoce y siente pasión por una inmensa cantidad de información sobre África. Desde nuestro personal local hasta nuestros agentes internacionales, cada persona de nuestro equipo puede considerarse un experto en safaris. Hemos visitado los hoteles, explorado los parques y negociado con las aerolíneas para que obtengas el mejor precio y la mejor experiencia posible.',
        },
        {
          heading: 'Tu Guía es tu Vínculo con África',
          body: 'Asili Climbing Kilimanjaro solo emplea a los conductores más amables y experimentados. Todos nuestros guías hablan inglés y comparten un verdadero amor por la fauna, las aves y la flora africanas. ¡Lo saben todo y estarán encantados de responder tus preguntas! Nuestros guías no solo conducirán cada día, también serán tu clave de acceso a los parques que visitas, la fauna que encuentras, la gente que conoces, y mucho más. Ya sea Dickson, Bashiru, Lomayani, Alex o alguno de nuestros otros conductores altamente capacitados, estás en buenas manos. También organizamos guías de otros idiomas como alemán, español, italiano, francés, chino, coreano, etc. bajo pedido.',
        },
        {
          body: 'Asili Climbing Kilimanjaro se especializa en diseñar safaris privados a medida que satisfacen todas tus necesidades. Ya sea que sueñes con reconectar con la naturaleza a través de un safari económico de campamento y trekking, o prefieras vivir tu experiencia africana con el máximo lujo, estamos aquí para guiarte en cada paso y crear el itinerario definitivo. Nos enorgullece ofrecer un servicio al cliente de talla mundial y satisfacer todas las necesidades de nuestros clientes.',
        },
        {
          body: 'Mientras que la mayoría de las demás empresas de safari imponen restricciones de kilometraje o combustible en sus safaris fotográficos, nosotros ofrecemos safaris fotográficos ilimitados de 6 a.m. a 6 p.m. cada día de tu estancia. Tienes el control total de tu día. ¿Quieres pasar todo el día de safari y hacer un picnic en el Serengeti? ¡Puedes! ¿Quieres dormir hasta tarde y disfrutar de una mañana tranquila antes de salir a un safari al atardecer? ¡También puedes! ¡Tú decides!',
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
      alt: 'Una pareja disfrutando de una cena al atardecer bajo una acacia en la sabana tanzana',
    }),
    fleetSection: {
      heading: 'Nuestra Flota y Comodidades a Bordo',
      body:
        'La flota de vehículos especialmente diseñados de Asili Climbing Kilimanjaro es la forma perfecta de vivir un safari africano. Nuestros Land Cruiser 4x4 han sido especialmente preparados para tu comodidad y protección, con techos abatibles, puertas correderas y una carrocería alargada para garantizarte vistas panorámicas de 360 grados de toda la acción. Todos nuestros vehículos se llevan a mantenimiento al final de cada safari y también reciben una revisión completa anual para garantizar altos estándares de seguridad y comodidad. Además, todos nuestros vehículos cuentan con estaciones de carga, botiquines de primeros auxilios, neveras y WiFi (solo en Tanzania).\n\nUna «lonchera de safari» tiene una reputación bastante negativa en el mundo de los safaris. Aunque cada lodge hace todo lo posible para que este momento sea agradable, es difícil evitar cierta repetición. Hemos contratado los servicios de un chef profesional para preparar nuestra lonchera desde el primer día, y la diferencia en calidad es notable. ¿Por qué conformarte con sándwiches secos y papas fritas en tu bolsa cuando puedes disfrutar de una comida caliente, productos recién horneados, y acompañarlo todo con una taza de café recién molido?\n\nPor todo esto y mucho más, somos el equipo ideal para ayudarte a crear el safari africano de tus sueños.\n\nSi aún no lo has hecho, no dudes en contactarnos para comenzar a planificar tu safari perfecto.',
    },
    quote:
      '«La base misma del espíritu vivo de un hombre es su pasión por la aventura. La alegría de vivir surge de nuestros encuentros con nuevas experiencias, y por eso no hay mayor alegría que tener un horizonte en constante cambio, que cada día tenga un sol nuevo y diferente»',
    ctaHeading: 'Déjanos Ayudarte',
  })
  console.log('aboutPage-es created/replaced')
}

async function seedContactEs() {
  await client.createOrReplace({
    _id: 'contactPage-es',
    _type: 'contactPage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Contacta a Asili | Climbing Kilimanjaro Tanzania',
      description:
        '¿Listo para conquistar el Kilimanjaro? Contacta hoy mismo a Climbing Kilimanjaro Tanzania y deja que nuestro equipo de expertos te ayude a planificar tu escalada.',
    },
    pageTitle: 'Contacta a Asili',
    hero: {
      backgroundImage: await uploadImage(client, {
        src: '/images/contact/hero.webp',
        alt: 'El Monte Kilimanjaro visto sobre las acacias de la sabana africana',
      }),
      heading: 'Contáctanos',
      subheading: '¿Listo para Conquistar el Kilimanjaro? ¡Hagámoslo Realidad!',
    },
    intro: {
      heading: 'Comienza tu Escalada con Climbing Kilimanjaro Tanzania',
      body: 'Ya sea que estés planeando tu primera cima o regreses para una nueva aventura, estamos aquí para guiarte en cada paso. Contáctanos hoy mismo — nuestro equipo de expertos está listo para responder tus preguntas, personalizar tu trekking y ayudarte a prepararte para el viaje de tu vida.',
      contactLabel: 'Contacta a Climbing Kilimanjaro Tanzania',
      location: 'Arusha – Tanzania',
      imageLeft: await uploadImage(client, {src: '/images/contact/camp.jpg', alt: 'Campamento del Kilimanjaro con tiendas bajo la cima'}),
      imageRight: await uploadImage(client, {src: '/images/contact/summit.webp', alt: 'Escalador celebrando frente al cartel de la cima Uhuru Peak'}),
    },
    form: {
      eyebrow: 'Contáctanos',
      heading: 'Nuestro experto se pondrá en contacto contigo pronto.',
      routeOptions: [
        '5 Días Route Marangu',
        '6 Días Route Machame',
        '6 Días Route Marangu',
        '6 Días Route Umbwe',
        '7 Días Route Lemosho',
        '7 Días Route Machame',
        '7 Días Route Rongai',
        '8 Días Route Lemosho',
        '9 Días Route Northern Circuit',
        'Aún no lo sé',
      ],
    },
  })
  console.log('contactPage-es created/replaced')
}

async function seedRequestQuoteEs() {
  await client.createOrReplace({
    _id: 'requestQuotePage-es',
    _type: 'requestQuotePage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Solicita un Presupuesto | Asili Climbing Kilimanjaro',
      description:
        'Obtén un presupuesto gratuito y personalizado para tu safari en Tanzania o tu escalada al Kilimanjaro con Asili Climbing Kilimanjaro. Indícanos tus fechas de viaje y tus necesidades, y nosotros nos encargamos del resto.',
    },
    hero: {
      heading: 'Solicita un Presupuesto para un Safari en Tanzania',
      subheading: 'Obtén ahora presupuestos gratuitos para tu safari en Tanzania',
    },
    contactInfo: {
      address: 'Sakina, Arusha',
      officeHours: 'Lunes - Domingo: 24/7',
      whatsappHref: 'https://wa.me/255767140150',
    },
    intro:
      '¿Listo para planificar el viaje de tus sueños a Tanzania? Tu aventura comienza aquí — descubre tours a medida adaptados a tus intereses a través de nuestra sección de solicitud de tours.',
    howToHeading: 'Cómo Solicitar un Presupuesto Personalizado',
    howToBody: [
      segmentsToBlock([
        {text: 'Contacta a nuestro equipo de expertos en safaris y '},
        {text: 'Kilimanjaro', bold: true, href: '/climbing-mount-kilimanjaro/'},
        {
          text: '. Hemos ayudado a miles de viajeros a cumplir con todos los puntos de su lista de deseos en Tanzania (y mantenerse dentro de su presupuesto) sin el estrés de planificar todo por su cuenta. Contáctanos hoy mismo sobre tu lista de deseos para Tanzania, y creemos juntos tu aventura definitiva de safari y trekking.',
        },
      ]),
    ],
  })
  console.log('requestQuotePage-es created/replaced')
}

async function seedZanzibarEs() {
  const cards = [
    {
      title: 'Una Luna de Miel en Zanzibar - 06 DÍAS',
      price: '875 $ POR PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/honeymoon.jpg', alt: 'Montaje romántico en la playa con una mesa para dos decorada con pétalos de rosa que forman la palabra LOVE'},
    },
    {
      title: 'Descubre la Isla de Zanzibar - 03 DÍAS',
      price: '528 $ POR PERSONA',
      location: 'Aeropuerto Internacional Abeid Amani Karume > Zanzibar > Stone Town Zanzibar',
      image: {src: '/images/zanzibar/island-3.webp', alt: 'Vista aérea de una pequeña isla boscosa de Zanzibar con una playa de arena blanca y un muelle de madera'},
    },
    {
      title: 'Descubre el Océano Índico - 06 DÍAS',
      price: '890 $ POR PERSONA',
      location: 'Zanzibar > Stone Town Zanzibar',
      image: {src: '/images/zanzibar/rock-restaurant.jpg', alt: 'El restaurante The Rock encaramado en un afloramiento de coral en las aguas turquesas frente a Zanzibar'},
    },
    {
      title: 'Zanzibar Océano Índico - 06 DÍAS',
      price: '1918 $ POR PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/zanzibar5.jpg', alt: 'Pareja relajándose en un camastro de playa contemplando el atardecer sobre el Océano Índico'},
    },
    {
      title: 'Océano Índico de Zanzibar - 06 DÍAS',
      price: '1146 $ POR PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/paje-beach.jpg', alt: 'Palmeras y sombrillas de paja a lo largo de una playa de arena blanca con aguas turquesas'},
    },
    {
      title: 'La Isla de Zanzibar en Tanzania - 05 DÍAS',
      price: '1439 $ POR PERSONA',
      location: 'Stone Town Zanzibar > Zanzibar',
      image: {src: '/images/zanzibar/hero.webp', alt: 'Buceador explorando un vibrante arrecife de coral en las aguas cristalinas frente a Zanzibar'},
    },
  ]
  await client.createOrReplace({
    _id: 'zanzibarPage-es',
    _type: 'zanzibarPage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Tours a Zanzibar | Asili Climbing Kilimanjaro',
      description:
        'Descubre Zanzibar con Asili Climbing Kilimanjaro — playas de arena blanca, la cultura de Stone Town y aventuras en el Océano Índico, combinadas a la perfección con tu viaje a Tanzania.',
    },
    hero: {
      heading: 'Zanzibar',
      backgroundImage: await uploadImage(client, {src: '/images/zanzibar/hero.webp', alt: 'Buceador explorando un vibrante arrecife de coral en las aguas cristalinas frente a Zanzibar'}),
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
  console.log('zanzibarPage-es created/replaced')
}

async function seedTanzaniaSafariEs() {
  const cards = [
    {
      title: 'Safari de la Migración del Río Mara - 07 DÍAS',
      price: '4692 $ POR PERSONA',
      image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Lodge de lujo con piscina infinita con vistas al Serengeti al atardecer'},
    },
    {
      title: 'Safari Simba - 05 DÍAS',
      price: '2422 $ POR PERSONA',
      image: {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Dos elefantes saludándose trompa con trompa en Tanzania'},
    },
    {
      title: 'Tanzania Clásica - 07 DÍAS',
      price: '3273 $ POR PERSONA',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Una leona descansando con sus dos cachorros en las llanuras del Serengeti'},
    },
    {
      title: 'Experiencia Confort Tanzania - 07 DÍAS',
      price: '3326 $ POR PERSONA',
      image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Elegante campamento de tiendas anidado bajo el dosel forestal'},
    },
    {
      title: 'Experiencia Safari Glamping Tanzania - 05 DÍAS',
      price: '2383 $ POR PERSONA',
      image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge con piscina y jardines exuberantes al atardecer'},
    },
    {
      title: 'Safari de la Migración del Ñu - 09 DÍAS',
      price: '6239 $ POR PERSONA',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Dos rinocerontes blancos enfrentándose en la hierba del Cráter del Ngorongoro'},
    },
  ]
  await client.createOrReplace({
    _id: 'tanzaniaSafariPage-es',
    _type: 'tanzaniaSafariPage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Paquetes de Safari en Tanzania | Asili Climbing Kilimanjaro',
      description:
        'Explora nuestros paquetes de safari más populares en Tanzania — safaris de migración, tours clásicos de fauna, glamping y experiencias confort con Asili Climbing Kilimanjaro.',
    },
    hero: {
      eyebrow: 'Tipo de Tour: Safari en Tanzania',
      heading: 'Paquetes de Safari en Tanzania',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Un león y un cachorro de león descansando juntos sobre una roca en Tanzania'}),
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
  console.log('tanzaniaSafariPage-es created/replaced')
}

async function seedSafariToursEs() {
  await client.createOrReplace({
    _id: 'safariToursPage-es',
    _type: 'safariToursPage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Safari de Fauna Salvaje en Tanzania | Asili Climbing Kilimanjaro',
      description:
        'Descubre el mayor espectáculo de fauna salvaje de África. Tours de safari en Tanzania por el Serengeti, el Cráter del Ngorongoro y más allá con Asili Climbing Kilimanjaro.',
    },
    hero: {
      eyebrow: 'Safari en Tanzania',
      heading: 'Safari de Fauna Salvaje en Tanzania',
      backgroundImage: await uploadImage(client, {src: '/images/tanzania-safari-tours/hero.webp', alt: 'Un león y un cachorro de león descansando juntos sobre una roca en Tanzania'}),
    },
    intro: {
      title: 'Safari de Fauna Salvaje en Tanzania: Descubre el Mayor Espectáculo de Fauna Salvaje de África',
      body: 'Tanzania es más que un destino — es una invitación a experimentar África en su estado más salvaje e impresionante. Con vastas sabanas rebosantes de vida silvestre, parques nacionales emblemáticos y auténticos encuentros culturales, un safari de fauna salvaje en Tanzania no se parece a nada más en el mundo. Ya seas un principiante en los safaris o un aventurero experimentado, Tanzania te ofrece momentos inolvidables cada día.\n\nDesde las legendarias llanuras del Serengeti hasta la caldera volcánica intacta más grande del mundo, el Cráter del Ngorongoro — Tanzania promete encuentros cercanos con los Big Five, migraciones de ñus, antiguos baobabs y atardeceres dorados interminables.',
    },
    whereToGo: {
      eyebrow: 'Todo lo que Necesitas Saber sobre Tanzania',
      heading: 'A Dónde Ir en Tanzania',
      body: 'Tanzania es una tierra de contrastes impresionantes — desde el pico nevado del Monte Kilimanjaro hasta las sabanas doradas del Serengeti, pasando por las exuberantes playas tropicales de Zanzibar y los profundos cráteres llenos de fauna de Ngorongoro. Ya sea que busques aventura, fauna salvaje, cultura o relax, Asili Climbing Kilimanjaro te ayuda a experimentar Tanzania mejor que nadie — con guías locales expertos y viajes hechos a medida.',
      image: await uploadImage(client, {src: '/images/tanzania-safari-tours/elephant.jpg', alt: 'Dos elefantes saludándose trompa con trompa en Tanzania'}),
    },
    tourStyles: {
      eyebrow: 'Explora los Tours de Safari',
      heading: 'Estilos de Safari Populares en Tanzania',
      styles: await Promise.all(
        [
          {label: 'Safari de Lujo en Tanzania', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Lodge de lujo con piscina infinita con vistas al Serengeti al atardecer'}},
          {label: 'Safari Confort en Tanzania', image: {src: '/images/tanzania-safari-tours/comfort.webp', alt: 'Elegante campamento de tiendas anidado bajo el dosel forestal'}},
          {label: 'Safari Gama Media en Tanzania', image: {src: '/images/tanzania-safari-tours/mid-range.webp', alt: 'Lodge de gama media con piscina y jardines exuberantes al atardecer'}},
          {label: 'Safari Económico de Campamento en Tanzania', image: {src: '/images/tanzania-safari-tours/luxury.webp', alt: 'Tiendas de safari de lona instaladas bajo los árboles para un safari de campamento'}},
        ].map(async (style) => ({_type: 'tourStyle', _key: key(), label: style.label, image: await uploadImage(client, style.image)})),
      ),
    },
    seasons: {
      eyebrow: 'Resumen de las Estaciones en Tanzania',
      heading: '¿Cuál es el Mejor Mes para Visitar Tanzania?',
      intro:
        'No existe una solución única para un safari en Tanzania. Querrás vivir la mejor experiencia posible, según tus preferencias. Recorre los meses para saber más sobre qué esperar durante tu visita.',
      months: [
        {month: 'Enero', body: 'Es el momento de experimentar la belleza natural de Tanzania en todo su magnífico, vibrante y colorido esplendor. Ya desde enero, podrás disfrutar de paisajes exuberantes y oportunidades fotográficas únicas en la vida que te dejarán sin aliento.'},
        {month: 'Febrero', body: 'Febrero en Tanzania es una época increíble para ver a los animales jóvenes dar sus primeros pasos en la sabana. Los mejores lugares para esto son Ndutu, donde millones de ñus se congregan y dan a luz durante un breve período conocido como la temporada de partos. Aunque pueden ocurrir tormentas por las tardes, la lluvia permitirá una transformación del paisaje.'},
        {month: 'Marzo', body: 'Marzo es una época del año a menudo pasada por alto para visitar Tanzania. Sin embargo, ofrece numerosas oportunidades de observación, con un hermoso avistamiento de aves y poca afluencia. Aunque a veces hace calor (y humedad), podrás presenciar todo tipo de fauna salvaje durante este período — ¡incluidas sus crías!'},
        {month: 'Abril', body: 'Tanzania es un paraíso para los fotógrafos en abril. Paisajes verdes y pintorescos, crías de animales y aves coloridas bordean los caminos para recibir a los viajeros que visitan el país en este período. El clima puede ser impredecible en abril, pero las observaciones y los paisajes valen totalmente la pena.'},
        {month: 'Mayo', body: 'Si quieres ver cómo es la vida en los parques nacionales de Tanzania antes de la temporada seca, esta es tu última oportunidad. Contempla hermosos bosques verdes y vastas llanuras herbosas llenas de crías durante mayo, justo antes de que el paisaje se transforme.'},
        {month: 'Junio', body: 'Junio en Tanzania es un momento excelente para visitar y explorar el paisaje seco. Los visitantes encontrarán numerosas oportunidades para observar la fauna salvaje, ya que los animales se agrupan alrededor de los abrevaderos durante este mes. Los días son frescos pero soleados, con la humedad justa sin ser demasiado húmedos ni polvorientos como ocurre más adelante en el año debido al viento.'},
        {month: 'Julio', body: 'Visitar Tanzania en julio es muy recomendable si buscas disfrutar de un safari tal como debe ser. Con las tierras secas volviéndose más escasas, los animales se congregan cerca de los abrevaderos y se pueden avistar fácilmente gracias al paisaje árido.'},
        {month: 'Agosto', body: 'La larga temporada seca ha terminado, y los animales han tenido la oportunidad de recuperar fuerzas. Agosto en Tanzania te ofrece una oportunidad poco frecuente — ¡una excelente ocasión para ver la fauna salvaje de cerca!'},
        {month: 'Septiembre', body: 'Una de las mejores épocas para visitar Tanzania es septiembre, cuando hay mejor visibilidad y el sol brilla. El final de la larga temporada seca significa que los animales están desesperados por encontrar comida, lo que aumenta tus posibilidades de presenciar acción durante tu safari.'},
        {month: 'Octubre', body: 'Octubre marca el final de la larga temporada seca en Tanzania, lo que significa que la actividad animal está en su punto máximo. Se pueden ver densas agrupaciones de animales durante cualquier excursión de un día o estancia más larga en el mismo lugar. Puedes recorrer los parques sin temor a quedar atrapado detrás de otros vehículos, ya que hay muy poco tráfico durante estos meses. Perfecto si buscas un ambiente auténtico de safari en Tanzania.'},
        {month: 'Noviembre', body: 'El paisaje tanzano promete ser espectacular en noviembre, mientras la naturaleza vuelve a la vida durante la breve temporada de lluvias. Con ríos desbordados y animales activos en busca de comida, esto promete fantásticas oportunidades de observación de fauna que no querrás perderte.'},
        {month: 'Diciembre', body: 'Diciembre es el momento ideal para visitar Tanzania y admirar la belleza natural de este magnífico país. Las aves estarán en todo su esplendor al regresar de su migración anual tras un año entero de ausencia. Termina tu año con calidez, comodidad y belleza natural visitando Tanzania en diciembre.'},
      ].map((month) => ({_type: 'seasonMonth', _key: key(), month: month.month, body: month.body})),
    },
    whyTravelWithUs: {
      heading: '¿Por Qué Viajar con Nosotros?',
      intro: 'Descubre la auténtica África con Asili Climbing Kilimanjaro — donde cada viaje está diseñado con pasión y experiencia.',
      features: [
        {description: 'Vive una aventura sin contratiempos con nuestros guías profesionales y conocedores, que garantizan una experiencia de viaje enriquecedora.'},
        {description: 'Como empresa local, ofrecemos una perspectiva auténtica, revelando tesoros escondidos y perspectivas culturales para un viaje verdaderamente inmersivo.'},
      ].map((feature) => ({_type: 'safariFeature', _key: key(), description: feature.description})),
    },
  })
  console.log('safariToursPage-es created/replaced')
}

async function run() {
  await seedAboutEs()
  await seedContactEs()
  await seedRequestQuoteEs()
  await seedZanzibarEs()
  await seedTanzaniaSafariEs()
  await seedSafariToursEs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
