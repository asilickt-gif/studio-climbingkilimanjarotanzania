/**
 * Phase 6 (Spanish): the 3 legal standardPage docs (privacy-policy,
 * terms-and-conditions, cookies-policy). why-travel-with-us was already
 * seeded in seed-es-bespoke-pages.ts's seedSafariToursEs (mirrors the IT
 * split, where why-travel-with-us was in seed-it-bespoke-pages.ts).
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-es-legal.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, bulletBlock} from './lib/pt'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface EsBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: string[]
}

interface EsLegalPage {
  slug: string
  seoTitle: string
  seoDescription: string
  pageTitle: string
  intro: string
  sections: {heading: string; blocks: EsBlock[]}[]
}

const pages: EsLegalPage[] = [
  {
    slug: 'privacy-policy',
    seoTitle: 'Política de Privacidad | Asili Climbing Kilimanjaro',
    seoDescription:
      'Consulta la política de privacidad de Climbing Kilimanjaro Tanzania para saber cómo recopilamos, utilizamos, almacenamos y protegemos tu información personal.',
    pageTitle: 'Política de Privacidad',
    intro:
      'En Climbing Kilimanjaro Tanzania, tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos tu información personal cuando interactúas con nuestro sitio web o nuestros servicios.',
    sections: [
      {
        heading: 'Qué Información Recopilamos',
        blocks: [
          {type: 'paragraph', text: 'Podemos recopilar los siguientes tipos de información personal:'},
          {
            type: 'list',
            items: [
              'Datos personales: nombre, dirección de correo electrónico, número de teléfono, nacionalidad, datos del pasaporte (para reservas).',
              'Información de reserva: fechas de viaje, preferencias de alojamiento, necesidades alimentarias, contactos de emergencia.',
              'Información de pago: dirección de facturación y método de pago (Nota: no almacenamos los datos de tarjetas de crédito).',
              'Datos de uso del sitio web: dirección IP, tipo de navegador, páginas visitadas y otros datos analíticos.',
            ],
          },
        ],
      },
      {
        heading: 'Cómo Utilizamos Tu Información',
        blocks: [
          {type: 'paragraph', text: 'Utilizamos tu información para los siguientes fines:'},
          {
            type: 'list',
            items: [
              'Responder a consultas o solicitudes',
              'Procesar y gestionar tu reserva',
              'Personalizar tu experiencia y recomendarte itinerarios adecuados',
              'Mejorar nuestro sitio web y nuestros servicios',
              'Cumplir con nuestras obligaciones legales',
            ],
          },
          {
            type: 'paragraph',
            text: 'Nunca venderemos, alquilaremos ni compartiremos tus datos personales con terceros con fines de marketing.',
          },
        ],
      },
      {
        heading: 'Quién Tiene Acceso a Tus Datos',
        blocks: [
          {
            type: 'paragraph',
            text: 'Solo el personal autorizado de Climbing Kilimanjaro y los proveedores de servicios de confianza (como lodges de safari, hoteles o empresas de transporte) implicados en la organización de tu tour tendrán acceso a tus datos personales. Estos proveedores están obligados a mantener tu información segura y confidencial.',
          },
        ],
      },
      {
        heading: 'Cookies y Seguimiento',
        blocks: [
          {type: 'paragraph', text: 'Nuestro sitio web utiliza cookies para:'},
          {
            type: 'list',
            items: [
              'Recordar tus preferencias',
              'Entender cómo interactúan los usuarios con nuestro contenido',
              'Mejorar el rendimiento y la funcionalidad del sitio web',
            ],
          },
          {
            type: 'paragraph',
            text: 'Puedes ajustar la configuración de las cookies o desactivarlas por completo a través de la configuración de tu navegador.',
          },
        ],
      },
      {
        heading: 'Seguridad de los Datos',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tomamos todas las medidas razonables para proteger tu información personal mediante servidores seguros, herramientas de cifrado y acceso restringido. Aunque seguimos las mejores prácticas, ten en cuenta que ningún método de transmisión de datos por Internet es 100% seguro.',
          },
        ],
      },
      {
        heading: 'Tus Derechos',
        blocks: [
          {type: 'paragraph', text: 'Tienes derecho a:'},
          {
            type: 'list',
            items: [
              'Acceder a los datos personales que tenemos sobre ti',
              'Solicitar correcciones o actualizaciones',
              'Retirar tu consentimiento o solicitar la eliminación de tus datos',
              'Presentar una reclamación ante una autoridad de protección de datos si es necesario',
            ],
          },
          {type: 'paragraph', text: 'Para ejercer tus derechos, ponte en contacto con nosotros.'},
        ],
      },
      {
        heading: 'Enlaces a Terceros',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nuestro sitio web puede contener enlaces a sitios externos. No somos responsables de las prácticas de privacidad ni del contenido de esos sitios web de terceros.',
          },
        ],
      },
      {
        heading: 'Cambios en Esta Política',
        blocks: [
          {
            type: 'paragraph',
            text: 'Es posible que actualicemos esta Política de Privacidad de vez en cuando. Cualquier cambio se publicará en esta página con una « fecha de entrada en vigor » actualizada. Te invitamos a revisar esta política con regularidad para mantenerte informado.',
          },
        ],
      },
      {
        heading: 'Contáctanos',
        blocks: [
          {
            type: 'paragraph',
            text: 'Si tienes preguntas o inquietudes sobre nuestra Política de Privacidad o sobre cómo se gestionan tus datos, ponte en contacto con nosotros.',
          },
          {type: 'paragraph', text: 'Teléfono: +255 767 140 150. Ubicación: Arusha, Tanzania.'},
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    seoTitle: 'Términos y Condiciones | Asili Climbing Kilimanjaro',
    seoDescription:
      'Consulta los términos y condiciones aplicables a todos los trekkings, safaris y paquetes combinados de Asili Climbing Kilimanjaro.',
    pageTitle: 'Términos y Condiciones',
    intro:
      'Al reservar un viaje con Asili Climbing Kilimanjaro, aceptas los términos y condiciones que se describen a continuación. Estos términos se aplican a todos nuestros trekkings, safaris y paquetes combinados.',
    sections: [
      {
        heading: '1. Reserva y Confirmación',
        blocks: [
          {
            type: 'list',
            items: [
              'Una reserva se confirma únicamente tras recibir un depósito y una confirmación por escrito de Asili Climbing Kilimanjaro.',
              'Todos los viajeros deben proporcionar datos personales exactos, incluidos el nombre completo (como figura en el pasaporte), las fechas de viaje y cualquier necesidad médica o alimentaria.',
              'Reservar en nombre de un grupo implica que aceptas la responsabilidad de todos los miembros del grupo.',
            ],
          },
        ],
      },
      {
        heading: '2. Pagos',
        blocks: [
          {
            type: 'list',
            items: [
              'Se requiere un depósito del 30% en el momento de la reserva.',
              'El saldo debe abonarse al menos 30 días antes del inicio del viaje.',
              'Los pagos pueden realizarse mediante transferencia bancaria, tarjeta de crédito u otros métodos seguros (pueden aplicarse comisiones).',
              'Los pagos tardíos pueden resultar en la cancelación sin reembolso.',
            ],
          },
        ],
      },
      {
        heading: '3. Cancelaciones y Reembolsos',
        blocks: [
          {type: 'paragraph', text: 'Por parte del cliente:'},
          {
            type: 'list',
            items: [
              '60 días o más antes de la salida: reembolso del 90%',
              'Entre 30 y 59 días antes de la salida: reembolso del 50%',
              'Menos de 30 días: sin reembolso',
            ],
          },
          {type: 'paragraph', text: 'Por parte de Asili Climbing Kilimanjaro:'},
          {
            type: 'list',
            items: [
              'Nos reservamos el derecho de cancelar cualquier viaje por motivos de seguridad, meteorológicos o por eventos imprevistos. En tales casos, recibirás un reembolso completo o se te ofrecerá una fecha alternativa.',
            ],
          },
        ],
      },
      {
        heading: '4. Modificaciones',
        blocks: [
          {
            type: 'list',
            items: [
              'Los cambios en el viaje solicitados por el cliente pueden ser posibles según la disponibilidad y pueden generar costos adicionales.',
              'Se permiten cambios de nombre hasta 15 días antes del viaje.',
              'Asili Climbing Kilimanjaro se reserva el derecho de realizar ajustes menores en el itinerario debido a las condiciones locales.',
            ],
          },
        ],
      },
      {
        heading: '5. Seguro de Viaje',
        blocks: [
          {
            type: 'list',
            items: [
              'Todos los participantes deben contar con un seguro de viaje válido que cubra el trekking en alta montaña (para el Kilimanjaro)',
              'Evacuación de emergencia',
              'Tratamiento médico',
              'Cancelación e interrupción del viaje',
            ],
          },
          {type: 'paragraph', text: 'Es posible que se solicite un comprobante del seguro antes del inicio del viaje.'},
        ],
      },
      {
        heading: '6. Requisitos de Salud y Forma Física',
        blocks: [
          {
            type: 'list',
            items: [
              'Escalar el Kilimanjaro e ir de safari requiere una preparación física y mental.',
              'Los participantes deben declarar cualquier condición médica preexistente.',
              'Asili Climbing Kilimanjaro no se hace responsable de los problemas médicos que surjan durante el viaje.',
            ],
          },
        ],
      },
      {
        heading: '7. Visados y Requisitos de Entrada',
        blocks: [
          {
            type: 'list',
            items: [
              'Es responsabilidad del viajero obtener un visado tanzano válido antes de la llegada.',
              'Los pasaportes deben tener una validez de al menos seis (6) meses desde la fecha de viaje.',
            ],
          },
        ],
      },
      {
        heading: '8. Responsabilidad',
        blocks: [
          {
            type: 'list',
            items: [
              'Nos comprometemos con tu seguridad, pero la participación en viajes de aventura conlleva riesgos inherentes.',
              'Asili Climbing Kilimanjaro no se hace responsable de la pérdida o el daño de bienes personales',
              'Lesiones o enfermedades',
              'Retrasos o cambios provocados por el clima, problemas de vuelos o decisiones gubernamentales',
            ],
          },
          {
            type: 'paragraph',
            text: 'No obstante, nos comprometemos a actuar de forma profesional y a minimizar los riesgos en la medida de lo posible.',
          },
        ],
      },
      {
        heading: '9. Comportamiento y Conducta',
        blocks: [
          {
            type: 'list',
            items: [
              'Se espera respeto hacia los guías, el personal, las comunidades locales y los demás viajeros.',
              'Cualquier comportamiento considerado peligroso u ofensivo puede resultar en la exclusión del viaje sin reembolso.',
            ],
          },
        ],
      },
      {
        heading: '10. Uso de Fotos y Testimonios',
        blocks: [
          {
            type: 'list',
            items: [
              'Podemos utilizar fotos y reseñas compartidas por los clientes con fines promocionales, salvo que solicites lo contrario por escrito.',
            ],
          },
        ],
      },
      {
        heading: '11. Ley Aplicable',
        blocks: [
          {
            type: 'paragraph',
            text: 'Todos estos términos se rigen por la legislación tanzana. Cualquier disputa se resolverá ante los tribunales locales de Arusha, Tanzania.',
          },
        ],
      },
      {
        heading: '12. Información de Contacto',
        blocks: [
          {type: 'paragraph', text: 'Para cualquier pregunta sobre estos términos, contáctanos:'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. Correo electrónico: info@asiliclimbingkilimanjaro.com. Teléfono: +255 767 140 150. Ubicación: Arusha, Tanzania.',
          },
        ],
      },
    ],
  },
  {
    slug: 'cookies-policy',
    seoTitle: 'Política de Cookies | Asili Climbing Kilimanjaro',
    seoDescription:
      'Descubre cómo Asili Climbing Kilimanjaro utiliza cookies y tecnologías similares cuando visitas nuestro sitio web.',
    pageTitle: 'Política de Cookies',
    intro:
      'Esta Política de Cookies explica cómo Asili Climbing Kilimanjaro utiliza cookies y tecnologías similares cuando visitas nuestro sitio web. Al continuar navegando por nuestro sitio, aceptas nuestro uso de cookies tal como se describe a continuación.',
    sections: [
      {
        heading: '1. Qué Son las Cookies',
        blocks: [
          {
            type: 'paragraph',
            text: 'Las cookies son pequeños archivos de texto que se colocan en tu dispositivo (ordenador, tableta o smartphone) cuando visitas un sitio web. Ayudan a que los sitios web funcionen correctamente, mejoran la experiencia del usuario y recopilan datos útiles para el rendimiento del sitio y el marketing.',
          },
        ],
      },
      {
        heading: '2. Cómo Utilizamos las Cookies',
        blocks: [
          {type: 'paragraph', text: 'Utilizamos cookies para:'},
          {
            type: 'list',
            items: [
              'Recordar tus preferencias y configuraciones',
              'Mejorar la velocidad y el rendimiento del sitio web',
              'Analizar cómo interactúan los visitantes con nuestro contenido',
              'Habilitar la funcionalidad de reservas',
              'Mostrar anuncios y contenido relevantes según tus intereses (si corresponde)',
            ],
          },
        ],
      },
      {
        heading: '3. Tipos de Cookies que Utilizamos',
        blocks: [
          {
            type: 'list',
            items: [
              'Cookies esenciales — necesarias para el funcionamiento básico del sitio, como la navegación por el sitio web y el acceso a áreas seguras.',
              'Cookies de rendimiento y análisis — nos ayudan a entender cómo utilizan los visitantes nuestro sitio web (por ejemplo, páginas visitadas, tiempo de permanencia, tasas de rebote) para poder mejorar la experiencia del usuario.',
              'Cookies de funcionalidad — recuerdan las opciones que has elegido, como el idioma o la región, para ofrecer una experiencia más personalizada.',
              'Cookies publicitarias (si corresponde) — pueden utilizarse para mostrarte anuncios relevantes en plataformas como Google o Facebook. Puedes rechazar la publicidad dirigida en cualquier momento.',
            ],
          },
        ],
      },
      {
        heading: '4. Cookies de Terceros',
        blocks: [
          {type: 'paragraph', text: 'Podemos utilizar herramientas de terceros de confianza como:'},
          {
            type: 'list',
            items: [
              'Google Analytics (para supervisar el uso del sitio web)',
              'Facebook Pixel (para marketing y rendimiento publicitario)',
              'Widgets de TripAdvisor o Booking (para mostrar reseñas o disponibilidad)',
            ],
          },
          {
            type: 'paragraph',
            text: 'Estos servicios pueden colocar sus propias cookies en tu dispositivo. Consulta sus políticas para más detalles.',
          },
        ],
      },
      {
        heading: '5. Gestionar y Controlar las Cookies',
        blocks: [
          {type: 'paragraph', text: 'Puedes controlar las cookies a través de la configuración de tu navegador. La mayoría de los navegadores te permiten:'},
          {
            type: 'list',
            items: [
              'Ver y eliminar las cookies existentes',
              'Bloquear las cookies de terceros',
              'Establecer preferencias para sitios web específicos',
              'Desactivar todas las cookies (no recomendado, ya que puede afectar la funcionalidad del sitio)',
            ],
          },
        ],
      },
      {
        heading: '6. Actualizaciones de Esta Política',
        blocks: [
          {
            type: 'paragraph',
            text: 'Podemos actualizar esta Política de Cookies según sea necesario. Los cambios se publicarán en esta página con una nueva fecha de entrada en vigor.',
          },
        ],
      },
      {
        heading: '7. Contáctanos',
        blocks: [
          {type: 'paragraph', text: 'Si tienes alguna pregunta o inquietud sobre cómo utilizamos las cookies, ponte en contacto con:'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. Correo electrónico: info@asiliclimbingkilimanjaro.com. Teléfono: +255 767 140 150. Ubicación: Arusha, Tanzania.',
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
    const esId = await upsertTranslatedDoc(client, 'standardPage', page.slug, 'es', fields)
    await linkTranslationMetadata(client, 'standardPage', [
      {language: 'en', id: enId},
      {language: 'es', id: esId},
    ])
    console.log(`${page.slug}-es done (${esId})`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
