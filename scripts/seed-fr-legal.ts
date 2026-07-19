/**
 * Phase 5: French translation for the 3 remaining legal standardPage docs
 * (privacy-policy, terms-and-conditions, cookies-policy). why-travel-with-us
 * was already seeded in seed-fr-pilot.ts.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-fr-legal.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock, bulletBlock} from './lib/pt'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface FrBlock {
  type: 'paragraph' | 'list'
  text?: string
  items?: string[]
}

interface FrLegalPage {
  slug: string
  seoTitle: string
  seoDescription: string
  pageTitle: string
  intro: string
  sections: {heading: string; blocks: FrBlock[]}[]
}

const pages: FrLegalPage[] = [
  {
    slug: 'privacy-policy',
    seoTitle: 'Politique de confidentialité | Asili Climbing Kilimanjaro',
    seoDescription:
      "Consultez la politique de confidentialité de Climbing Kilimanjaro Tanzania pour savoir comment nous collectons, utilisons, conservons et protégeons vos informations personnelles.",
    pageTitle: 'Politique de confidentialité',
    intro:
      "Chez Climbing Kilimanjaro Tanzania, votre vie privée est importante pour nous. Cette politique de confidentialité explique comment nous collectons, utilisons, conservons et protégeons vos informations personnelles lorsque vous interagissez avec notre site web ou nos services.",
    sections: [
      {
        heading: 'Quelles informations nous collectons',
        blocks: [
          {type: 'paragraph', text: "Nous pouvons collecter les types d'informations personnelles suivants :"},
          {
            type: 'list',
            items: [
              "Détails personnels : nom, adresse e-mail, numéro de téléphone, nationalité, informations de passeport (pour les réservations).",
              "Informations de réservation : dates de voyage, préférences d'hébergement, besoins alimentaires, contacts d'urgence.",
              "Informations de paiement : adresse de facturation et moyen de paiement (Remarque : nous ne stockons pas les informations de carte de crédit).",
              "Données d'utilisation du site : adresse IP, type de navigateur, pages visitées et autres données analytiques.",
            ],
          },
        ],
      },
      {
        heading: 'Comment nous utilisons vos informations',
        blocks: [
          {type: 'paragraph', text: 'Nous utilisons vos informations aux fins suivantes :'},
          {
            type: 'list',
            items: [
              'Répondre aux demandes de renseignements',
              'Traiter et gérer votre réservation',
              'Personnaliser votre expérience et recommander des itinéraires adaptés',
              'Améliorer notre site web et nos services',
              'Respecter nos obligations légales',
            ],
          },
          {
            type: 'paragraph',
            text: 'Nous ne vendrons, ne louerons ni ne partagerons jamais vos données personnelles avec des tiers à des fins marketing.',
          },
        ],
      },
      {
        heading: 'Qui a accès à vos données',
        blocks: [
          {
            type: 'paragraph',
            text: "Seuls les membres autorisés du personnel de Climbing Kilimanjaro et les prestataires de confiance (tels que les lodges de safari, hôtels ou sociétés de transport) impliqués dans l'organisation de votre circuit auront accès à vos données personnelles. Ces prestataires sont tenus de garder vos informations sécurisées et confidentielles.",
          },
        ],
      },
      {
        heading: 'Cookies et suivi',
        blocks: [
          {type: 'paragraph', text: 'Notre site web utilise des cookies pour :'},
          {
            type: 'list',
            items: [
              'Mémoriser vos préférences',
              'Comprendre comment les utilisateurs interagissent avec notre contenu',
              'Améliorer les performances et les fonctionnalités du site',
            ],
          },
          {
            type: 'paragraph',
            text: 'Vous pouvez ajuster vos paramètres de cookies ou les désactiver entièrement via les paramètres de votre navigateur.',
          },
        ],
      },
      {
        heading: 'Sécurité des données',
        blocks: [
          {
            type: 'paragraph',
            text: "Nous prenons toutes les mesures raisonnables pour protéger vos informations personnelles à l'aide de serveurs sécurisés, d'outils de chiffrement et d'un accès restreint. Bien que nous suivions les meilleures pratiques, veuillez noter qu'aucune méthode de transmission de données sur Internet n'est sûre à 100 %.",
          },
        ],
      },
      {
        heading: 'Vos droits',
        blocks: [
          {type: 'paragraph', text: 'Vous avez le droit de :'},
          {
            type: 'list',
            items: [
              'Accéder aux données personnelles que nous détenons à votre sujet',
              'Demander des corrections ou des mises à jour',
              'Retirer votre consentement ou demander la suppression de vos données',
              'Déposer une plainte auprès d\'une autorité de protection des données si nécessaire',
            ],
          },
          {type: 'paragraph', text: 'Pour exercer vos droits, veuillez nous contacter.'},
        ],
      },
      {
        heading: 'Liens vers des tiers',
        blocks: [
          {
            type: 'paragraph',
            text: 'Notre site web peut contenir des liens vers des sites externes. Nous ne sommes pas responsables des pratiques de confidentialité ou du contenu de ces sites tiers.',
          },
        ],
      },
      {
        heading: 'Modifications de cette politique',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page avec une « date d\'entrée en vigueur » actualisée. Veuillez consulter régulièrement cette politique pour rester informé.',
          },
        ],
      },
      {
        heading: 'Nous contacter',
        blocks: [
          {
            type: 'paragraph',
            text: 'Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité ou la manière dont vos données sont traitées, veuillez nous contacter.',
          },
          {type: 'paragraph', text: 'Téléphone : +255 767 140 150. Lieu : Arusha, Tanzanie.'},
        ],
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    seoTitle: 'Conditions générales | Asili Climbing Kilimanjaro',
    seoDescription:
      'Consultez les conditions générales applicables à tous les treks, safaris et forfaits combinés d\'Asili Climbing Kilimanjaro.',
    pageTitle: 'Conditions générales',
    intro:
      "En réservant un voyage avec Asili Climbing Kilimanjaro, vous acceptez les conditions générales décrites ci-dessous. Ces conditions s'appliquent à tous nos treks, safaris et forfaits combinés.",
    sections: [
      {
        heading: '1. Réservation et confirmation',
        blocks: [
          {
            type: 'list',
            items: [
              "Une réservation n'est confirmée qu'après réception d'un acompte et d'une confirmation écrite d'Asili Climbing Kilimanjaro.",
              "Tous les voyageurs doivent fournir des informations personnelles exactes, y compris leur nom complet (tel qu'indiqué sur le passeport), leurs dates de voyage et tout besoin médical ou alimentaire.",
              'Réserver au nom d\'un groupe implique que vous acceptez la responsabilité de tous les membres du groupe.',
            ],
          },
        ],
      },
      {
        heading: '2. Paiements',
        blocks: [
          {
            type: 'list',
            items: [
              'Un acompte de 30 % est requis au moment de la réservation.',
              'Le solde doit être réglé au moins 30 jours avant le début du voyage.',
              'Les paiements peuvent être effectués par virement bancaire, carte de crédit ou autres méthodes sécurisées (des frais peuvent s\'appliquer).',
              'Tout retard de paiement peut entraîner une annulation sans remboursement.',
            ],
          },
        ],
      },
      {
        heading: '3. Annulations et remboursements',
        blocks: [
          {type: 'paragraph', text: 'Par le client :'},
          {
            type: 'list',
            items: [
              '60 jours ou plus avant le départ : remboursement de 90 %',
              '30 à 59 jours avant le départ : remboursement de 50 %',
              'Moins de 30 jours : aucun remboursement',
            ],
          },
          {type: 'paragraph', text: 'Par Asili Climbing Kilimanjaro :'},
          {
            type: 'list',
            items: [
              'Nous nous réservons le droit d\'annuler tout voyage pour des raisons de sécurité, météorologiques ou d\'événements imprévus. Dans ce cas, vous recevrez un remboursement intégral ou une date alternative vous sera proposée.',
            ],
          },
        ],
      },
      {
        heading: '4. Modifications',
        blocks: [
          {
            type: 'list',
            items: [
              'Les modifications de voyage demandées par le client peuvent être possibles selon la disponibilité et peuvent entraîner des frais supplémentaires.',
              'Les changements de nom sont autorisés jusqu\'à 15 jours avant le voyage.',
              'Asili Climbing Kilimanjaro se réserve le droit d\'apporter des ajustements mineurs à l\'itinéraire en fonction des conditions locales.',
            ],
          },
        ],
      },
      {
        heading: '5. Assurance voyage',
        blocks: [
          {
            type: 'list',
            items: [
              'Tous les participants doivent disposer d\'une assurance voyage valide couvrant le trekking en haute altitude (pour le Kilimandjaro)',
              "L'évacuation d'urgence",
              'Les frais médicaux',
              'L\'annulation et l\'interruption de voyage',
            ],
          },
          {type: 'paragraph', text: 'Une preuve d\'assurance peut être demandée avant le début du voyage.'},
        ],
      },
      {
        heading: '6. Exigences de santé et de condition physique',
        blocks: [
          {
            type: 'list',
            items: [
              'Gravir le Kilimandjaro et partir en safari nécessite une préparation physique et mentale.',
              'Les participants doivent déclarer toute condition médicale préexistante.',
              'Asili Climbing Kilimanjaro n\'est pas responsable des problèmes médicaux survenant pendant le voyage.',
            ],
          },
        ],
      },
      {
        heading: "7. Visas et conditions d'entrée",
        blocks: [
          {
            type: 'list',
            items: [
              'Il incombe au voyageur d\'obtenir un visa tanzanien valide avant son arrivée.',
              'Les passeports doivent être valides pendant au moins six (6) mois à compter de la date de voyage.',
            ],
          },
        ],
      },
      {
        heading: '8. Responsabilité',
        blocks: [
          {
            type: 'list',
            items: [
              'Nous nous engageons à assurer votre sécurité, mais la participation à un voyage d\'aventure comporte des risques inhérents.',
              'Asili Climbing Kilimanjaro n\'est pas responsable de la perte ou des dommages aux biens personnels',
              'Des blessures ou maladies',
              'Des retards ou changements causés par la météo, des problèmes de vol ou des décisions gouvernementales',
            ],
          },
          {
            type: 'paragraph',
            text: 'Nous nous engageons cependant à agir de manière professionnelle et à minimiser les risques autant que possible.',
          },
        ],
      },
      {
        heading: '9. Comportement et conduite',
        blocks: [
          {
            type: 'list',
            items: [
              'Le respect des guides, du personnel, des communautés locales et des autres voyageurs est attendu.',
              'Tout comportement jugé dangereux ou offensant peut entraîner l\'exclusion du voyage sans remboursement.',
            ],
          },
        ],
      },
      {
        heading: '10. Utilisation des photos et témoignages',
        blocks: [
          {
            type: 'list',
            items: [
              'Nous pouvons utiliser les photos et avis partagés par les clients à des fins promotionnelles, sauf demande contraire écrite de votre part.',
            ],
          },
        ],
      },
      {
        heading: '11. Droit applicable',
        blocks: [
          {
            type: 'paragraph',
            text: 'Toutes les présentes conditions sont régies par le droit tanzanien. Tout litige sera résolu devant les tribunaux locaux d\'Arusha, en Tanzanie.',
          },
        ],
      },
      {
        heading: '12. Coordonnées',
        blocks: [
          {type: 'paragraph', text: 'Pour toute question concernant ces conditions, contactez-nous :'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. E-mail : info@asiliclimbingkilimanjaro.com. Téléphone : +255 767 140 150. Lieu : Arusha, Tanzanie.',
          },
        ],
      },
    ],
  },
  {
    slug: 'cookies-policy',
    seoTitle: 'Politique relative aux cookies | Asili Climbing Kilimanjaro',
    seoDescription:
      'Découvrez comment Asili Climbing Kilimanjaro utilise les cookies et technologies similaires lors de votre visite sur notre site web.',
    pageTitle: 'Politique relative aux cookies',
    intro:
      "Cette politique relative aux cookies explique comment Asili Climbing Kilimanjaro utilise les cookies et technologies similaires lors de votre visite sur notre site web. En continuant à naviguer sur notre site, vous acceptez notre utilisation des cookies telle que décrite ci-dessous.",
    sections: [
      {
        heading: '1. Que sont les cookies ?',
        blocks: [
          {
            type: 'paragraph',
            text: 'Les cookies sont de petits fichiers texte placés sur votre appareil (ordinateur, tablette ou smartphone) lorsque vous visitez un site web. Ils aident les sites web à fonctionner correctement, améliorent l\'expérience utilisateur et collectent des données utiles pour la performance du site et le marketing.',
          },
        ],
      },
      {
        heading: '2. Comment nous utilisons les cookies',
        blocks: [
          {type: 'paragraph', text: 'Nous utilisons des cookies pour :'},
          {
            type: 'list',
            items: [
              'Mémoriser vos préférences et paramètres',
              'Améliorer la vitesse et les performances du site',
              'Analyser la manière dont les visiteurs interagissent avec notre contenu',
              'Activer les fonctionnalités de réservation',
              "Afficher des publicités et contenus pertinents en fonction de vos centres d'intérêt (le cas échéant)",
            ],
          },
        ],
      },
      {
        heading: '3. Types de cookies que nous utilisons',
        blocks: [
          {
            type: 'list',
            items: [
              'Cookies essentiels — nécessaires au fonctionnement de base du site, comme la navigation et l\'accès aux zones sécurisées.',
              'Cookies de performance et d\'analyse — nous aident à comprendre comment les visiteurs utilisent notre site (pages visitées, temps passé, taux de rebond) afin d\'améliorer l\'expérience utilisateur.',
              'Cookies de fonctionnalité — mémorisent les choix que vous avez faits, comme la langue ou la région, pour offrir une expérience plus personnalisée.',
              'Cookies publicitaires (le cas échéant) — peuvent être utilisés pour vous montrer des publicités pertinentes sur des plateformes comme Google ou Facebook. Vous pouvez refuser la publicité ciblée à tout moment.',
            ],
          },
        ],
      },
      {
        heading: '4. Cookies tiers',
        blocks: [
          {type: 'paragraph', text: 'Nous pouvons utiliser des outils tiers de confiance tels que :'},
          {
            type: 'list',
            items: [
              "Google Analytics (pour surveiller l'utilisation du site)",
              'Facebook Pixel (pour le marketing et la performance publicitaire)',
              'Les widgets TripAdvisor ou Booking (pour afficher les avis ou les disponibilités)',
            ],
          },
          {
            type: 'paragraph',
            text: 'Ces services peuvent placer leurs propres cookies sur votre appareil. Veuillez consulter leurs politiques respectives pour plus de détails.',
          },
        ],
      },
      {
        heading: '5. Gérer et contrôler les cookies',
        blocks: [
          {type: 'paragraph', text: 'Vous pouvez contrôler les cookies via les paramètres de votre navigateur. La plupart des navigateurs vous permettent de :'},
          {
            type: 'list',
            items: [
              'Consulter et supprimer les cookies existants',
              'Bloquer les cookies tiers',
              'Définir des préférences pour des sites spécifiques',
              'Désactiver tous les cookies (non recommandé, car cela peut affecter le fonctionnement du site)',
            ],
          },
        ],
      },
      {
        heading: '6. Mises à jour de cette politique',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nous pouvons mettre à jour cette politique relative aux cookies si nécessaire. Les modifications seront publiées sur cette page avec une nouvelle date d\'entrée en vigueur.',
          },
        ],
      },
      {
        heading: '7. Nous contacter',
        blocks: [
          {type: 'paragraph', text: 'Si vous avez des questions ou des préoccupations concernant notre utilisation des cookies, veuillez contacter :'},
          {
            type: 'paragraph',
            text: 'Asili Climbing Kilimanjaro. E-mail : info@asiliclimbingkilimanjaro.com. Téléphone : +255 767 140 150. Lieu : Arusha, Tanzanie.',
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
    const frId = await upsertTranslatedDoc(client, 'standardPage', page.slug, 'fr', fields)
    await linkTranslationMetadata(client, 'standardPage', [
      {language: 'en', id: enId},
      {language: 'fr', id: frId},
    ])
    console.log(`${page.slug}-fr done (${frId})`)
  }
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
