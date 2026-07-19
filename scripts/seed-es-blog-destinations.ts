/**
 * Phase 6 (Spanish): blogIndexPage (singleton), the one blogPost (Iringa),
 * destinationsPage (singleton), and the one destinationDetail (Serengeti).
 * Mirrors seed-it-blog-destinations.ts's structure but with Spanish text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-blog-destinations.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedBlogIndexEs() {
  await client.createOrReplace({
    _id: 'blogIndexPage-es',
    _type: 'blogIndexPage',
    language: 'es',
    seo: {_type: 'seo', title: 'Blog | Asili Climbing Kilimanjaro', description: 'Consejos de viaje, guías de destinos e historias de Tanzania — ascensiones al Kilimanjaro, safaris y mucho más, de la mano de Asili Climbing Kilimanjaro.'},
    heading: 'Nuestro Blog de Viajes',
    intro: "Historias, consejos y guías para ayudarte a planificar tu aventura en Tanzania — desde la ascensión al Kilimanjaro hasta el descubrimiento de los tesoros escondidos del país.",
  })
  console.log('blogIndexPage-es created/replaced')
}

async function seedIringaBlogPostEs() {
  const slug = '5-reasons-you-should-visit-iringa-in-2025-2026'
  const enId = await findEnId(client, 'blogPost', slug)
  if (!enId) {
    console.log(`SKIP blogPost-es: no en source for ${slug}`)
    return
  }
  const sections = [
    {
      heading: '1. Sumérgete en el Vibrante Mosaico Cultural de Iringa',
      body: "Iringa vibra de riqueza cultural, ofreciendo una ventana a las tradiciones de tribus locales como los Maasai y los Hehe. Los edificios de la época colonial de la ciudad te transportan en el tiempo — entra en el Old Boma, un antiguo fuerte alemán convertido en museo, para descubrir los relatos del pasado de Iringa. Aventúrate con nosotros hasta las aldeas vecinas para conocer a los cálidos habitantes locales, dejarte llevar por las danzas tradicionales y participar en experiencias culturales prácticas. Estos momentos auténticos te permiten vivir a la manera tanzana, creando recuerdos que perduran mucho después de tu viaje.",
    },
    {
      heading: '2. Maravíllate ante Sorprendentes Maravillas Naturales',
      body: "Los paisajes de Iringa son el sueño de todo amante de la naturaleza, combinando vastas sabanas, colinas onduladas y frondosos bosques en un escenario impresionante. Únete a nosotros en el Parque Nacional de Ruaha, el mayor santuario de fauna de Tanzania, para vivir safaris emocionantes. Observa elefantes, leones, jirafas y una vibrante avifauna en un entorno tranquilo y poco concurrido. Para los senderistas, el Parque Nacional de las Montañas Udzungwa te espera con senderos de selva tropical, cascadas centelleantes y especies raras. Camina hasta miradores panorámicos y sumérgete en la calma de la naturaleza.",
    },
    {
      heading: '3. Retrocede en el Tiempo con la Historia de Iringa',
      body: "Las raíces históricas de Iringa son profundas, y ofrecen relatos que cautivan a los viajeros curiosos. Visita el yacimiento prehistórico de Isimila, donde herramientas y fósiles antiguos revelan la vida humana primitiva de hace millones de años — una oportunidad única de tocar los orígenes de la humanidad. En el museo Old Boma, sumérgete en el legado del pueblo Hehe y su audaz resistencia frente al dominio colonial.",
    },
    {
      heading: '4. Celébralo en los Animados Festivales de Iringa',
      body: "Planifica tu visita para coincidir con los vibrantes festivales culturales de Iringa, como el Festival Cultural de Iringa que se celebra cada agosto. Este colorido evento rebosa de música tradicional, danzas fascinantes y arte local, poniendo de relieve el patrimonio de Tanzania. Saborea platos auténticos y conversa con los lugareños para descubrir el verdadero espíritu de Iringa.",
    },
    {
      heading: '5. Descubre el Encanto Virgen de Iringa',
      body: "La magia de Iringa reside en su encanto fuera de lo común, libre de las multitudes turísticas. Aquí te conectarás profundamente con las comunidades locales, una naturaleza virgen y tradiciones auténticas. Únete a nosotros en tours comunitarios o proyectos de voluntariado que apoyan iniciativas sostenibles, desde la conservación hasta la artesanía local. Esta experiencia genuina enriquece tu viaje y deja una huella positiva en Iringa.",
    },
    {
      heading: 'Por Qué Iringa Brilla con Luz Propia',
      body: "Iringa combina profundidad cultural, esplendor natural y una autenticidad intacta en una aventura tanzana como ninguna otra. Ya sea que te atraigan las tradiciones vibrantes, la emoción de la fauna salvaje o las historias ocultas, Asili Climbing Kilimanjaro diseña viajes que superan tus sueños más ambiciosos. No esperes más — ¡planifica ahora tu escapada a Iringa en 2025/2026! Contáctanos para comenzar tu aventura.",
    },
  ]
  const faqs = [
    {q: '¿Cuál es la Mejor Época para Visitar Iringa?', a: 'La estación seca (de junio a octubre) es perfecta para Iringa, con un clima templado y excelentes oportunidades de avistamiento de fauna en el Parque Nacional de Ruaha. La estación de lluvias revela paisajes exuberantes y verdes para una perspectiva renovada. Organizamos viajes durante todo el año.'},
    {q: '¿Qué Experiencias Culturales Únicas te Esperan en Iringa?', a: 'Participa en estancias con familias Maasai para vivir sus tradiciones, desde el trabajo con cuentas hasta el pastoreo de ganado. No te pierdas el Festival Cultural de Iringa en agosto, con su música, danza y sabores locales.'},
    {q: '¿Cuáles Son las Principales Atracciones de Iringa?', a: 'El Parque Nacional de Ruaha deslumbra con su fauna, mientras que el yacimiento prehistórico de Isimila ofrece un vistazo a la historia antigua. El museo Old Boma revela el pasado colonial de Iringa.'},
    {q: '¿Qué Aventuras al Aire Libre Puedo Vivir en Iringa?', a: 'Haz senderismo en el monte Nyoni para disfrutar de vistas espectaculares, o explora las tierras altas de Kilolo para la observación de aves. Los parques de Ruaha y Udzungwa ofrecen safaris y senderos de sobra.'},
    {q: '¿Qué Fauna Veré en Iringa?', a: 'El Parque Nacional de Ruaha rebosa de elefantes, leones, guepardos y más de 570 especies de aves, además de cebras y antílopes poco comunes.'},
    {q: '¿Puedo Visitar una Plantación de Té en Iringa?', a: '¡Sí! Descubre la cultura del té de Iringa con visitas a las plantaciones, aprendiendo los secretos del cultivo y degustando infusiones frescas.'},
    {q: '¿Hay Mercados Locales para Visitar?', a: 'Los mercados de Iringa bullen de productos frescos, artesanías y recuerdos como bisutería de cuentas. Regatea para encontrar tesoros y prueba la comida callejera.'},
    {q: '¿Cómo Es la Gastronomía de Iringa?', a: 'Saborea platos típicos tanzanos como el ugali y el nyama choma, además de platos internacionales en restaurantes locales y puestos callejeros.'},
    {q: '¿Cómo Es el Transporte Público en Iringa?', a: 'Toma los autobuses dala dala, taxis o bajajis (tuk-tuks) para desplazarte con facilidad. Para los lugares más remotos, ofrecemos traslados privados para mayor comodidad y conveniencia.'},
    {q: '¿Puedo Hacer Voluntariado en Iringa?', a: '¡Por supuesto! Apoya escuelas, proyectos de conservación o iniciativas comunitarias — podemos ponerte en contacto con oportunidades de voluntariado significativas.'},
    {q: '¿Dónde Puedo Alojarme en Iringa?', a: 'Desde acogedoras casas de huéspedes hasta lodges de lujo, Iringa lo tiene todo — reservamos los mejores alojamientos según tu presupuesto.'},
    {q: '¿Es Iringa Segura para los Viajeros?', a: 'Iringa es, en general, segura, pero mantente alerta. Vigila tus pertenencias, utiliza taxis de confianza y respeta las costumbres locales.'},
    {q: '¿Qué Puedo Comprar en Iringa?', a: 'Recorre los mercados en busca de artesanías, textiles y cerámica, o visita las tiendas para encontrar productos modernos.'},
    {q: '¿Cómo Llego a Iringa desde Dar es Salaam?', a: 'Vuela hasta el aeropuerto de Iringa, toma un autobús o alquila un coche desde Dar es Salaam — organizamos traslados sin contratiempos.'},
    {q: '¿Qué Documentos de Viaje Necesito para Iringa?', a: 'Lleva un pasaporte (válido por al menos 6 meses) y consulta los requisitos de visado de Tanzania. Es posible que se exija un certificado de vacunación contra la fiebre amarilla.'},
    {q: '¿Qué Actividades Ofrece el Parque Nacional de Ruaha?', a: 'Disfruta de safaris fotográficos, safaris a pie y observación de aves en Ruaha. Observa elefantes, leones y aves poco comunes junto a guías expertos.'},
    {q: '¿Qué Idiomas se Hablan en Iringa?', a: 'El suajili es el idioma principal, pero el inglés es habitual en el sector turístico. Aprender algunas frases en suajili es muy apreciado.'},
    {q: '¿Qué Moneda se Usa en Iringa?', a: 'El chelín tanzano (TZS) es la moneda habitual, aunque el dólar estadounidense funciona en zonas turísticas. Cambia tu dinero en los bancos para obtener tasas justas.'},
    {q: '¿Hay Centros Médicos en Iringa?', a: 'Existen hospitales y clínicas básicas, pero los casos graves pueden requerir traslado a Dar es Salaam. Se recomienda encarecidamente contratar un seguro de viaje.'},
    {q: '¿Puedo Visitar Escuelas o Comunidades Locales?', a: '¡Sí! Conecta con escuelas o grupos comunitarios para adentrarte en la cultura local — organizamos visitas respetuosas.'},
  ]
  const fields = {
    seo: {_type: 'seo', title: '5 Motivos para Visitar Iringa en 2025/2026 | Asili Climbing Kilimanjaro', description: '¿Buscas una aventura tanzana fuera de lo común? Descubre 5 motivos irresistibles para visitar Iringa en 2025/2026 — cultura, fauna, historia y festivales.'},
    title: '5 Motivos para Visitar Iringa en 2025/2026',
    excerpt: "¿Buscas una aventura tanzana fuera de lo común? Ubicada en las tierras altas del sur, Iringa es una joya cautivadora que espera robarte el corazón.",
    publishedDate: '2025-05-02',
    coverImage: await uploadImage(client, {src: '/images/destinations/ruaha.webp', alt: 'Manada de elefantes en un abrevadero cerca del Parque Nacional de Ruaha en Iringa'}),
    intro:
      "¿Buscas una aventura tanzana fuera de lo común? Ubicada en las tierras altas del sur, Iringa es una joya cautivadora que espera robarte el corazón. Lejos de los circuitos turísticos habituales, este destino vibrante promete momentos inolvidables. ¿Aún tienes dudas? Aquí tienes cinco motivos irresistibles para visitar Iringa en 2025/2026 con Asili Climbing Kilimanjaro.",
    sections: sections.map((section) => ({_type: 'postSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
    faqHeading: 'Preguntas Frecuentes',
    faqs: faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.q, answer: faq.a})),
  }
  const esId = await upsertTranslatedDoc(client, 'blogPost', slug, 'es', fields)
  await linkTranslationMetadata(client, 'blogPost', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`blogPost-es done (${esId})`)
}

async function seedDestinationsPageEs() {
  const destinations = [
    {
      name: 'Monte Kilimanjaro',
      image: {src: '/images/destinations/kilimanjaro.webp', alt: 'Elefante pastando con el Monte Kilimanjaro de fondo'},
      body: "Con 5.895 metros de altitud, el Monte Kilimanjaro es la montaña independiente más alta del mundo y una experiencia verdaderamente única en la vida. A diferencia de otras grandes cumbres, no se requiere escalada técnica, lo que lo hace accesible a excursionistas en buena forma física de todo el mundo.",
      highlightsHeading: 'Puntos Destacados',
      highlights: [
        'Varias rutas panorámicas (Machame, Lemosho, Marangu, Rongai, Umbwe)',
        'Diversas zonas ecológicas: selva tropical, páramo, desierto alpino y cumbre ártica',
        'Trekkings guiados por expertos con apoyo completo de porteadores, orientación para la aclimatación e instalaciones de camping de primer nivel',
        'Llegada a la cumbre al amanecer, por encima de las nubes, desde el Uhuru Peak',
      ],
      bestTime: 'Enero-marzo, junio-octubre',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Asili ofrece ascensiones personalizadas al Kilimanjaro, combinando seguridad, sostenibilidad y vistas inolvidables.'],
    },
    {
      name: 'Parque Nacional del Serengeti',
      href: '/serengeti-national-park/',
      image: {src: '/images/destinations/serengeti.webp', alt: 'Doradas llanuras del Serengeti'},
      body: 'El Serengeti es el corazón de la experiencia del safari africano — interminables llanuras doradas, dramáticos encuentros entre depredadores y presas, y la mundialmente famosa Gran Migración. Es una tierra donde cada safari fotográfico cuenta una nueva historia.',
      highlightsHeading: 'Las Mejores Experiencias de Fauna',
      highlights: [
        'Presencia la Gran Migración de los Ñus, un espectáculo que se desarrolla durante todo el año e involucra a más de 1,5 millones de ñus y cebras en busca de pastos frescos.',
        'Los cruces de ríos (julio-septiembre) son emocionantes, con cocodrilos al acecho y manadas lanzándose al agua.',
        'La temporada de partos (enero-marzo) es igualmente espectacular, ya que los depredadores acechan a las crías recién nacidas en las llanuras del sur.',
        'Excelentes avistamientos de grandes felinos — especialmente leones, leopardos y guepardos.',
        'Safaris en globo aerostático sobre las llanuras al amanecer (mejora opcional).',
      ],
      bestTime: 'Junio-octubre (estación seca, ideal para los depredadores); enero-marzo (temporada de partos en la zona de Ndutu)',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Nuestros guías conocen a la perfección los patrones de la migración y ajustan los safaris fotográficos para acercarte a la acción — sin las multitudes.'],
    },
    {
      name: 'Cráter del Ngorongoro',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Dos rinocerontes entre la hierba en el cráter del Ngorongoro'},
      body: 'El cráter del Ngorongoro es la caldera volcánica intacta más grande del mundo y un microcosmos de la fauna africana. Es uno de los pocos lugares donde puedes llegar a ver a los Big Five en un solo día.',
      highlightsHeading: 'Las Mejores Experiencias',
      highlights: [
        'Desciende 600 metros hasta el exuberante fondo del cráter para disfrutar de un safari fotográfico de día completo.',
        'Observa rinocerontes negros, hipopótamos, leones, cebras, búfalos, chacales y flamencos.',
        'Un paisaje espectacular con paredes boscosas, llanuras herbosas y un lago central.',
        'Visita las aldeas Maasai cercanas para un intercambio cultural.',
      ],
      bestTime: 'Todo el año (la estación seca ofrece mejor visibilidad)',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Personalizamos tu día en el cráter con pícnics panorámicos y un acceso matutino para evitar las multitudes.'],
    },
    {
      name: 'Parque Nacional del Lago Manyara',
      image: {src: '/images/destinations/lake-manyara.webp', alt: 'Paisaje del Parque Nacional del Lago Manyara'},
      body: 'El lago Manyara puede ser compacto, pero alberga una variedad impresionante de hábitats — desde bosques de aguas subterráneas hasta llanuras abiertas y el propio lago alcalino. Es una introducción ideal a los ecosistemas de Tanzania.',
      highlightsHeading: 'Principales Puntos Destacados',
      highlights: [
        'Famoso por sus leones trepadores, un comportamiento excepcional que no se observa en la mayoría de los parques',
        'Miles de flamencos rosados y pelícanos bordeando la orilla del lago',
        'Grupos de babuinos, monos verdes, elefantes e hipopótamos',
        'Piragüismo disponible cuando el nivel del agua lo permite (estacional)',
      ],
      bestTime: 'Junio-octubre para la fauna, noviembre-marzo para la observación de aves',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Solemos utilizar Manyara como el primer parque de tu viaje — está cerca de Arusha y es un calentamiento perfecto antes de aventuras más grandes.'],
    },
    {
      name: 'Parque Nacional de Tarangire',
      image: {src: '/images/destinations/tarangire.jpg', alt: 'Parque Nacional de Tarangire con sus baobabs'},
      body: 'A menudo pasado por alto, Tarangire es una joya repleta de fauna — especialmente durante la estación seca, cuando los animales acuden en masa al río Tarangire. Es célebre por sus enormes manadas de elefantes y sus majestuosos baobabs.',
      highlightsHeading: 'Mejores Avistamientos de Fauna',
      highlights: [
        'Enormes manadas de elefantes — a veces de más de 200 individuos',
        'Grandes felinos, jirafas, avestruces e incluso licaones en los momentos de suerte',
        'Más de 500 especies de aves, lo que lo convierte en un paraíso para la observación de aves',
        'Un paisaje clásico de acacias y baobabs, perfecto para la fotografía',
      ],
      bestTime: 'Junio-octubre (estación seca, cuando los puntos de agua atraen a la fauna)',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Solemos incluir Tarangire en nuestros safaris del circuito norte, especialmente para quienes buscan menos multitudes y vistas auténticas.'],
    },
    {
      name: 'Parque Nacional de Nyerere',
      image: {src: '/images/destinations/nyerere.webp', alt: 'Humedales del Parque Nacional de Nyerere'},
      body: 'Nyerere es el parque nacional más grande de África, con ríos remotos, bosques y humedales que se extienden sin fin por el sur de Tanzania. Es ideal para los viajeros que buscan un safari auténtico y poco concurrido.',
      highlightsHeading: 'Actividades de Safari Únicas',
      highlights: [
        'Safaris en barco por el río Rufiji — observa hipopótamos, cocodrilos y elefantes en las orillas',
        'Safaris a pie con guardaparques armados — rastrea animales caminando',
        'Safaris fotográficos con posibilidad de observar leones, leopardos, elefantes e incluso licaones',
        'Menos turistas, encuentros más auténticos con la naturaleza salvaje',
      ],
      bestTime: 'Junio-octubre (estación seca)',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Para los huéspedes que buscan una conexión más larga y profunda con el África salvaje, te ayudamos a diseñar extensiones a Nyerere fuera de los circuitos habituales.'],
    },
    {
      name: 'Parque Nacional de Ruaha',
      image: {src: '/images/destinations/ruaha.webp', alt: 'Paisaje del Parque Nacional de Ruaha'},
      body: 'Ruaha es un secreto bien guardado, ideal para los conocedores del safari. Sus paisajes vírgenes y su baja afluencia turística lo convierten en una auténtica frontera salvaje. La densidad de fauna es alta y la actividad de los depredadores, intensa.',
      highlightsHeading: 'Qué Hace Único a Ruaha',
      highlights: [
        'Enormes manadas de leones (¡algunas de más de 20 individuos!)',
        'Antílopes poco comunes como el hipotrago negro, el hipotrago ruano y el pequeño kudú',
        'Excelentes avistamientos de leopardos, guepardos e hienas',
        'Una observación de aves fantástica — más de 500 especies y paisajes espectaculares',
      ],
      bestTime: 'Junio-octubre (estación seca, con avistamientos de fauna más sencillos)',
      bonusHeading: 'El Plus de Asili',
      bonus: ['Para los amantes de la fauna más entusiastas, podemos combinar Ruaha con Nyerere para una auténtica aventura en el sur de Tanzania.'],
    },
    {
      name: 'Parque Nacional de Mikumi',
      image: {src: '/images/destinations/mikumi.jpg', alt: 'Sabana del Parque Nacional de Mikumi'},
      body: 'El Parque Nacional de Mikumi es uno de los parques de safari más accesibles de Tanzania, situado a tan solo unas horas en coche desde Dar es Salaam. Es ideal para los viajeros con poco tiempo que aun así desean experimentar el lado salvaje de Tanzania. A pesar de su fácil acceso, Mikumi sorprende a los visitantes con su rica fauna y sus sabanas abiertas que recuerdan a las del Serengeti.',
      highlightsHeading: 'Mejores Avistamientos de Fauna',
      highlights: [
        'Leones descansando entre la hierba alta o sobre termiteros',
        'Grandes manadas de búfalos, cebras e impalas por las llanuras',
        'Elefantes en los bosques de miombo',
        'Jirafas, hipopótamos, ñus y facóceros',
        'Una excelente observación de aves — más de 400 especies, incluidos coloridos abejarucos y águilas',
      ],
      bestTime: 'Junio-octubre (estación seca, para la mejor concentración de fauna cerca de los abrevaderos); también se puede disfrutar en la temporada verde, especialmente por los amantes de las aves',
      bonusHeading: 'Por Qué Elegir Mikumi con Asili',
      bonus: [
        'Perfecto para safaris de 2 días o de fin de semana desde Dar es Salaam',
        'Alojamientos confortables dentro o cerca del parque',
        'Tours personalizables para viajeros solos, familias o grupos',
        'Se puede combinar con las Montañas Udzungwa o incluso con Ruaha para un safari prolongado por el sur de Tanzania',
        'Ofrecemos paquetes de safari flexibles a Mikumi con traslados privados, safaris fotográficos con guías experimentados, y la posibilidad de personalizar tu itinerario según tus necesidades de viaje.',
      ],
    },
    {
      name: 'Lago Natron',
      image: {src: '/images/destinations/lake-natron.jpg', alt: 'Cebras con flamencos en el lago Natron'},
      body: "El lago Natron es uno de los destinos más sorprendentes y singulares de Tanzania. Situado en el Gran Valle del Rift, cerca de la frontera con Kenia, el lago es poco profundo, salado y de un llamativo color rojo. Es el principal lugar de reproducción de los flamencos enanos, y miles de ellos tiñen el lago de rosa durante la temporada de anidación. Pero no se trata solo de aves — el monte Ol Doinyo Lengai, el único volcán de carbonatita activo del mundo, se alza cerca y ofrece una caminata única (aunque exigente) para los amantes de la aventura. Natron es también el hogar de los Maasai semi-nómadas, y las visitas culturales aquí resultan genuinas y auténticas.",
      highlightsHeading: 'Las Mejores Experiencias',
      highlights: [
        'Observar las enormes bandadas de flamencos en las orillas',
        'Caminar hasta cascadas a través de estrechos cañones y aguas termales',
        'Visitar bomas (aldeas) Maasai tradicionales',
        'Ascenso opcional al Ol Doinyo Lengai (para excursionistas experimentados)',
      ],
      bestTime: 'Junio-octubre (estación seca; excelente para caminatas y fotografía). La temporada de reproducción de los flamencos alcanza su punto máximo entre septiembre y noviembre.',
      bonusHeading: 'Por Qué Visitar con Asili Climbing Kilimanjaro',
      bonus: [
        'Caminatas y tours culturales guiados por expertos',
        'Un complemento único a los safaris del circuito norte o a las ascensiones al Kilimanjaro',
        'Apoyo a las comunidades Maasai locales',
      ],
    },
    {
      name: 'Lago Eyasi',
      image: {src: '/images/destinations/lake-eyasi.jpg', alt: 'Miembros de la tribu Hadzabe con arcos tradicionales durante una expedición de caza'},
      body: "El lago Eyasi no se trata de grandes safaris, sino de una inmersión cultural profunda. Es el destino perfecto si sientes curiosidad por las tribus indígenas de Tanzania, en particular los Hadzabe, uno de los últimos pueblos cazadores-recolectores de África, y los Datoga, hábiles herreros. La zona ofrece una oportunidad excepcional de conectar con tradiciones que apenas han cambiado en miles de años. Puedes unirte a caminatas de caza al amanecer, observar costumbres ancestrales y aprender técnicas de supervivencia anteriores a la civilización moderna.",
      highlightsHeading: 'Las Mejores Experiencias',
      highlights: [
        'Experiencia de caza con los Hadzabe usando arco y flechas',
        'Aprender la forja tradicional y la elaboración de joyas con los Datoga',
        'Caminatas panorámicas junto a la orilla del lago y por la sabana circundante',
        'Observación de aves y fotografía al atardecer',
      ],
      bestTime: 'Todo el año — los tours culturales no dependen de las migraciones de fauna ni de las condiciones meteorológicas',
      bonusHeading: 'Por Qué Visitar con Asili Climbing Kilimanjaro',
      bonus: [
        'Visitas culturales responsables y respetuosas',
        'Traductores y guías expertos para facilitar la comprensión',
        'Un complemento cultural perfecto a un safari por el norte o un trekking al Kilimanjaro',
      ],
    },
  ]

  await client.createOrReplace({
    _id: 'destinationsPage-es',
    _type: 'destinationsPage',
    language: 'es',
    seo: {
      _type: 'seo',
      title: 'Destinos | Safaris en Tanzania y Destinos del Kilimanjaro',
      description:
        'Explora los mejores destinos de Tanzania con Asili Climbing Kilimanjaro: Monte Kilimanjaro, Serengeti, cráter del Ngorongoro, Tarangire, lago Natron y mucho más.',
    },
    heading: 'Destinos',
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
  console.log('destinationsPage-es created/replaced')
}

async function seedSerengetiDetailEs() {
  const slug = 'serengeti-national-park'
  const enId = await findEnId(client, 'destinationDetail', slug)
  if (!enId) {
    console.log(`SKIP destinationDetail-es: no en source for ${slug}`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: 'Parque Nacional del Serengeti | Climbing Kilimanjaro Tanzania', description: 'Todo lo que necesitas saber para visitar el Parque Nacional del Serengeti — actividades, la mejor época para visitarlo y fotos auténticas.'},
    name: 'Parque Nacional del Serengeti',
    hero: {
      eyebrow: 'Una Maravilla sin Fin',
      heading: 'Parque Nacional del Serengeti',
      locationPill: 'Norte de Tanzania',
      backgroundImage: await uploadImage(client, {src: '/images/serengeti-national-park/serengeti-np.jpg', alt: 'Manada de ñus en las llanuras del Serengeti'}),
    },
    overview: {
      heading: 'Descripción General',
      body: [
        "El Parque Nacional del Serengeti es un santuario de fauna de fama mundial situado en el norte de Tanzania, célebre por sus vastas sabanas, sus ricos ecosistemas y sus inigualables oportunidades de observación de fauna. Con una extensión aproximada de 14.750 kilómetros cuadrados, el parque alberga la famosa Gran Migración de los Ñus, en la que millones de ñus, cebras y gacelas recorren las llanuras en busca de pastos frescos — un espectáculo de la naturaleza que deja sin aliento.",
        "Más allá de la migración, el Serengeti ofrece observación de fauna durante todo el año, con abundancia de vida silvestre que incluye leones, leopardos, elefantes, jirafas, guepardos y más de 500 especies de aves. El nombre del parque, derivado de la palabra maasai « Siringet », significa « llanuras infinitas » — una descripción perfecta de su impresionante paisaje, que se extiende hasta donde alcanza la vista.",
        "Ya sea explorando en un safari fotográfico, flotando sobre las llanuras en un globo aerostático, o caminando junto a un guía por los rincones más remotos de la sabana, el Serengeti ofrece una experiencia de safari africano verdaderamente auténtica e inolvidable.",
      ].map(paragraphBlock),
    },
    activitiesHeading: 'Actividades Populares e Inolvidables para Disfrutar en el Parque Nacional del Serengeti',
    activities: [
      {title: 'Migraciones de Ñus', body: 'Según la temporada, podrás ver a más de un millón de ñus y cientos de miles de cebras y gacelas en su épico viaje — especialmente espectacular durante los cruces de ríos en el norte del Serengeti.'},
      {title: 'Safari en Globo Aerostático', body: 'Descubre el Serengeti desde el cielo al amanecer. Flota sobre las llanuras mientras la fauna se mueve debajo de ti, seguido de un desayuno con champán en plena sabana.'},
      {title: 'Safari Fotográfico', body: 'La actividad más emblemática, los safaris fotográficos ofrecen la oportunidad de presenciar a los Big Five (león, elefante, búfalo, leopardo y rinoceronte), además de guepardos, hienas, jirafas, cebras e innumerables ñus. Los safaris se pueden realizar por la mañana temprano, por la tarde, o como excursiones de día completo.'},
      {title: 'Observación de Aves', body: 'Con más de 500 especies de aves, el Serengeti es un paraíso para los ornitólogos. Busca serpentarios, buitres, avutardas kori y coloridos abejarucos, especialmente cerca de los puntos de agua y las zonas boscosas.'},
      {title: 'Safari a Pie', body: 'Guiados por guardaparques armados y naturalistas expertos, los safaris a pie te permiten explorar el parque caminando — aprendiendo a reconocer huellas, plantas y pequeñas criaturas que a menudo pasan desapercibidas durante los safaris fotográficos.'},
      {title: 'Safaris Fotográficos Especializados', body: 'Con paisajes impresionantes, una luz espectacular y una fauna abundante, el Serengeti es perfecto tanto para fotógrafos aficionados como profesionales. Algunos operadores ofrecen vehículos y guías especializados en fotografía.'},
    ].map((activity) => ({_type: 'activity', _key: key(), title: activity.title, body: activity.body})),
    bestTimeToVisit: {
      heading: 'Mejor Época para Visitar',
      body: [
        'La mejor época para ver la migración es de julio a octubre. Es la estación seca, y en junio y julio las manadas afrontan su mayor desafío: el cruce del río Mara. Si te interesa ver a los depredadores en acción, ve en enero o febrero, cuando hay una pausa en las lluvias anuales y los ñus dan a luz.',
        'Ten en cuenta que viajar en temporada alta conlleva naturalmente costos más elevados, y el país tiene una belleza particular durante o justo después de las lluvias.',
      ].map(paragraphBlock),
    },
    gallery: await Promise.all(
      [
        {src: '/images/serengeti-national-park/wildebeest-migrations.webp', alt: 'Migraciones de Ñus'},
        {src: '/images/serengeti-national-park/balloon-safari.jpeg', alt: 'Safari en globo aerostático'},
        {src: '/images/serengeti-national-park/elephant-serengeti.jpg', alt: 'Elefante en el Serengeti'},
        {src: '/images/serengeti-national-park/cheetah.jpg', alt: 'Guepardo'},
        {src: '/images/serengeti-national-park/lion.jpg', alt: 'León'},
        {src: '/images/serengeti-national-park/zebra-serengeti.jpg', alt: 'Cebra en el Serengeti'},
      ].map((img) => uploadImage(client, img)),
    ),
    otherDestinationsHeading: 'Otros Destinos de Safari',
    otherDestinations: await Promise.all(
      [
        {name: 'Cráter del Ngorongoro', href: '/destinations/', image: {src: '/images/serengeti-national-park/ngorongoro-crater.jpg', alt: 'Cráter del Ngorongoro'}},
        {name: 'Parque Nacional de Tarangire', href: '/destinations/', image: {src: '/images/serengeti-national-park/tarangire.webp', alt: 'Parque Nacional de Tarangire'}},
        {name: 'Parque Nacional del Lago Manyara', href: '/destinations/', image: {src: '/images/serengeti-national-park/lake-manyara.jpg', alt: 'Parque Nacional del Lago Manyara'}},
        {name: 'Parque Nacional de Mkomazi', href: '/destinations/', image: {src: '/images/serengeti-national-park/mkomazi.webp', alt: 'Parque Nacional de Mkomazi'}},
        {name: 'Parque Nacional de Arusha', href: '/destinations/', image: {src: '/images/serengeti-national-park/arusha-national-park.jpg', alt: 'Parque Nacional de Arusha'}},
      ].map(async (dest) => ({_type: 'crossPromo', _key: key(), name: dest.name, href: dest.href, image: await uploadImage(client, dest.image)})),
    ),
  }
  const esId = await upsertTranslatedDoc(client, 'destinationDetail', slug, 'es', fields)
  await linkTranslationMetadata(client, 'destinationDetail', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`destinationDetail-es done (${esId})`)
}

async function run() {
  await seedBlogIndexEs()
  await seedIringaBlogPostEs()
  await seedDestinationsPageEs()
  await seedSerengetiDetailEs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
