/**
 * Phase 6 (Spanish) gap-fill: the `article` "climbing-mount-kilimanjaro" and
 * `standardPage` "why-travel-with-us" were seeded for FR/EN via the early
 * seed-fr-pilot.ts script but never had an IT/ES equivalent. This backfills
 * both documents for Spanish, mirroring seed-fr-pilot.ts's field shape.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-pilot-gap.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedArticleEs() {
  const slug = 'climbing-mount-kilimanjaro'
  const enId = await findEnId(client, 'article', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {
      _type: 'seo',
      title: 'Escalar el Kilimanjaro con guías locales expertos',
      description:
        'Escala el Monte Kilimanjaro con guías locales expertos. Compara los itinerarios, los paquetes, las tarifas y obtén respuestas a las preguntas más frecuentes sobre la escalada.',
    },
    heading: 'Escalar el Kilimanjaro con guías locales expertos',
    topImage: await uploadImage(client, {src: '/images/articles/climbing2-hero.webp', alt: 'Grupo de trekking acercándose a la cumbre del Kilimanjaro'}),
    intro:
      'Conquista el Kilimanjaro. Vive la aventura. Ya sea que estés comparando rutas, revisando listas de equipo o buscando consejos de expertos, esta guía reúne todo lo que necesitas para planificar tu escalada con Asili Climbing Kilimanjaro.',
    sections: [
      {
        heading: 'Rutas y mapas de escalada del Kilimanjaro',
        body: 'Route Machame: conocida como Whiskey Route, Machame es la ruta más popular del Kilimanjaro, que ofrece paisajes impresionantes y un terreno variado.\nRoute Lemosho: una de las rutas más pintorescas del Kilimanjaro, que comienza en el aislado Londorossi Gate y atraviesa la magnífica meseta de Shira.\nRoute Rongai: única ruta septentrional del Kilimanjaro, menos frecuentada y más suave, ideal durante la temporada de lluvias.\nRoute Northern Circuit: la ruta más larga y más pintoresca, que ofrece la mejor aclimatación al rodear progresivamente el Kilimanjaro.',
      },
      {
        heading: '¿Cómo se comparan las rutas del Kilimanjaro?',
        body: '',
        table: {
          columns: ['Nombre de la ruta', 'Nivel de dificultad', 'Longitud (km)', 'Duración (días)', 'Afluencia', 'Precio (USD)', 'Tasa de éxito (%)'],
          rows: [['Northern Circuit', 'De moderado a difícil', '90', '9-10', 'Baja', '2.500-3.500 $', '95']],
        },
      },
      {
        heading: '¿Cuándo deberías escalar el Kilimanjaro?',
        body: 'Consideraciones de temperatura: las temperaturas diurnas varían de 20°C a 27°C a baja altitud, pero descienden por debajo de cero en alta altitud.\nVegetación y paisajes: las temporadas secas ofrecen vistas más despejadas, flores silvestres en flor y bosques exuberantes; las temporadas más húmedas pueden traer condiciones nubladas.\nNiveles de afluencia: las temporadas altas (enero-febrero y julio-septiembre) atraen a más escaladores; las temporadas intermedias (finales de marzo-mayo y noviembre-principios de diciembre) ofrecen experiencias más tranquilas.\nPreferencias personales y objetivos: ten en cuenta las condiciones climáticas, tus preferencias de temperatura, el nivel de afluencia y tu propio calendario al planificar tu escalada.',
      },
      {
        heading: '¿Cuánto cuesta escalar el Kilimanjaro?',
        body: 'El costo de escalar el Kilimanjaro varía de 2.500 $ a 4.000 $, según la elección de la ruta, la duración, el tamaño del grupo, el nivel de servicio y las prestaciones incluidas. En Asili Climbing Kilimanjaro, garantizamos guías bien formados, altos estándares de seguridad y una experiencia general excepcional.',
      },
      {
        heading: 'Consejos importantes para una escalada exitosa',
        body: 'Ve despacio, hidrátate bien, consigue el equipo adecuado, prepárate física y mentalmente, y disfruta del viaje — hacer vínculos con otros escaladores hace la experiencia más gratificante.',
      },
      {
        heading: '¿Necesitas un guía para escalar el Kilimanjaro?',
        body: 'Sí — no se permite escalar el Kilimanjaro sin un guía autorizado. Los guías aportan su experiencia, monitorean tu salud, garantizan tu seguridad y te ayudan a orientarte en el exigente terreno de la montaña.',
      },
      {
        heading: 'Guía de escalada del Monte Kilimanjaro relacionada',
        body: 'Tu guía completa para conquistar el Kilimanjaro con confianza — consulta nuestra guía completa de escalada del Kilimanjaro, nuestros consejos de expertos y nuestra lista de equipo.',
      },
    ].map((section) => ({
      _type: 'articleSection',
      _key: key(),
      heading: section.heading,
      ...(section.body ? {body: stringToPt(section.body)} : {}),
      ...(section.table
        ? {table: {_type: 'dataTable', columns: section.table.columns, rows: section.table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}}
        : {}),
    })),
    faqHeading: 'Preguntas frecuentes sobre la escalada del Monte Kilimanjaro',
    faqs: [
      {
        question: '¿Cuál es el nivel de dificultad para escalar el Monte Kilimanjaro?',
        answer:
          'Escalar el Monte Kilimanjaro es una aventura exigente pero gratificante. La principal dificultad proviene de la alta altitud y el terreno variado. Con una buena preparación y un acompañamiento experto, escaladores de diferentes niveles de experiencia pueden llegar a la cumbre con éxito.',
      },
      {
        question: '¿Pueden los principiantes escalar el Monte Kilimanjaro?',
        answer:
          '¡Sí! Aunque no se requiere ninguna habilidad técnica de escalada, los principiantes deben seguir un entrenamiento físico adecuado antes de intentar la escalada. Nuestros guías experimentados aseguran que los escaladores principiantes reciban el apoyo necesario durante todo el viaje.',
      },
      {
        question: '¿Cuánto tiempo se necesita para escalar el Monte Kilimanjaro?',
        answer:
          'La escalada dura generalmente de 6 a 9 días, según la ruta elegida. Una ruta más larga permite una mejor aclimatación, aumentando las posibilidades de una experiencia de cumbre exitosa y placentera.',
      },
      {
        question: '¿Se necesita oxígeno para escalar el Kilimanjaro?',
        answer:
          'La mayoría de los escaladores no necesitan oxígeno suplementario. La clave para una escalada exitosa es una buena aclimatación. En los raros casos de mal de altura grave, el oxígeno está disponible por motivos de seguridad.',
      },
      {
        question: '¿Cómo se duerme en el Kilimanjaro?',
        answer:
          'Durante tu trekking en el Kilimanjaro con nosotros, te alojarás en tiendas de alta calidad, resistentes a la intemperie y diseñadas para la comodidad en condiciones extremas, con tiendas espaciosas, colchonetas aislantes y sacos de dormir cálidos.',
      },
      {
        question: '¿Cuál es la mejor época para escalar el Monte Kilimanjaro?',
        answer:
          'Las mejores temporadas para la escalada son los meses secos: de enero a marzo y de junio a octubre, que ofrecen las mejores condiciones climáticas y un cielo más despejado.',
      },
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  }
  const esId = await upsertTranslatedDoc(client, 'article', slug, 'es', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${slug}-es done (${esId})`)
}

async function seedStandardPageEs() {
  const slug = 'why-travel-with-us'
  const enId = await findEnId(client, 'standardPage', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const fields = {
    seo: {
      _type: 'seo',
      title: 'Por Qué Viajar con Nosotros | Asili Climbing Kilimanjaro',
      description:
        'Somos un operador turístico boutique que ofrece una selección de los mejores viajes de aventura en Tanzania. Descubre la diferencia Asili Climbing Kilimanjaro.',
    },
    hero: {
      heading: 'Por Qué Viajar con Nosotros',
      subheading: 'Somos un operador turístico boutique que ofrece una selección de los mejores viajes de aventura.',
      backgroundImage: await uploadImage(client, {
        src: '/images/why-travel-with-us/hero.webp',
        alt: 'Una acacia solitaria al borde de una pista de safari en la sabana tanzana',
      }),
    },
    sections: [
      {
        heading: 'Por qué viajar con nosotros – Somos un operador turístico boutique que ofrece una selección de los mejores viajes de aventura.',
        body: 'África ocupa un lugar especial en nuestros corazones. Todos los profesionales de nuestro equipo de safari tienen raíces africanas locales. Habiendo crecido en reservas de caza, trabajado como guardas jefe y gerentes de lodge, y pasado nuestras propias vacaciones en safari, entendemos profundamente lo que se necesita para hacer de un viaje a África algo verdaderamente inolvidable.\n\nCada agencia de viajes afirma ser la mejor, por eso quisimos comprometernos públicamente a ponerte a ti, el cliente, en primer lugar. Asili Climbing Kilimanjaro ofrece una garantía llamada los «Big 5»: privado, flexible, personalizado, auténtico, seguro, local, y asistencia 24/7 con garantía de precio.',
      },
      {
        heading: '¿Por Qué Viajar con Nosotros?',
        body: 'Privado, flexible, personalizado\nAuténtico, seguro, local\nAsistencia 24 horas al día, 7 días a la semana\nGarantía de precio',
      },
      {
        heading: 'Más de 100 clientes conquistados',
        body: 'Nuestra tasa de satisfacción del cliente del 98% explica por qué muchos clientes nos recomiendan a sus amigos y viajan de nuevo con nosotros cada año.',
      },
      {
        heading: 'Habla con un experto',
        body: 'Nuestros expertos en viajes están siempre disponibles para responder tus preguntas y ayudarte a planificar el viaje de tu vida. Contáctanos para cualquier consulta o información adicional.',
      },
    ].map((section) => ({_type: 'pageSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
  }
  const esId = await upsertTranslatedDoc(client, 'standardPage', slug, 'es', fields)
  await linkTranslationMetadata(client, 'standardPage', [
    {language: 'en', id: enId},
    {language: 'es', id: esId},
  ])
  console.log(`${slug}-es done (${esId})`)
}

async function run() {
  await seedArticleEs()
  await seedStandardPageEs()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
