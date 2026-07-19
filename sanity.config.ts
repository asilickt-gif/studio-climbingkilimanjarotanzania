import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {assist} from '@sanity/assist'
import {schemaTypes} from './schemaTypes'

// Locales supported by the content model. The website controls which are
// publicly live (web repo i18n/routing.ts); the Studio always offers all of
// them so translations can be prepared before a locale launches.
const LOCALES = [
  {id: 'en', title: 'English'},
  {id: 'fr', title: 'French'},
  {id: 'de', title: 'German'},
  {id: 'it', title: 'Italian'},
  {id: 'es', title: 'Spanish'},
]
const DEFAULT_LOCALE = 'en'

// Repeatable document types localized via @sanity/document-internationalization
// (language field + translation metadata linking).
const translatableTypes = [
  'article',
  'trip',
  'route',
  'blogPost',
  'destinationDetail',
  'standardPage',
]

// Singleton document types: localized via fixed per-locale IDs
// (`<type>-<locale>`), pinned in the structure with create/delete disabled.
const singletonTypes = new Set([
  'siteSettings',
  'blogIndexPage',
  'destinationsPage',
  'aboutPage',
  'contactPage',
  'requestQuotePage',
  'zanzibarPage',
  'tanzaniaSafariPage',
  'safariToursPage',
  'climbingKilimanjaroPage',
  'homePage',
  'sharedTripContent',
  'routesHubPage',
  'packagesHubPage',
  'comboHubPage',
])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

const singletonListItems: [type: string, title: string][] = [
  ['siteSettings', 'Site Settings'],
  ['blogIndexPage', 'Blog Index Page'],
  ['destinationsPage', 'Destinations Page'],
  ['aboutPage', 'About Page'],
  ['contactPage', 'Contact Page'],
  ['requestQuotePage', 'Request a Quote Page'],
  ['zanzibarPage', 'Zanzibar Page'],
  ['tanzaniaSafariPage', 'Tanzania Safari Page'],
  ['safariToursPage', 'Safari Tours Page'],
  ['climbingKilimanjaroPage', 'Climbing Kilimanjaro Page'],
  ['homePage', 'Home Page'],
  ['sharedTripContent', 'Shared Trip Content'],
  ['routesHubPage', 'Routes Hub Page'],
  ['packagesHubPage', 'Packages Hub Page'],
  ['comboHubPage', 'Combo Hub Page'],
]

export default defineConfig({
  name: 'default',
  title: 'climbingkilimanjarotanzania',

  projectId: '19nbwjcc',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...singletonListItems.map(([type, title]) =>
              S.listItem()
                .title(title)
                .id(type)
                .child(
                  S.list()
                    .title(title)
                    .items(
                      LOCALES.map((locale) =>
                        S.listItem()
                          .title(`${title} (${locale.id.toUpperCase()})`)
                          .id(`${type}-${locale.id}`)
                          .child(
                            S.document()
                              .schemaType(type)
                              .documentId(`${type}-${locale.id}`)
                              .title(`${title} (${locale.id.toUpperCase()})`),
                          ),
                      ),
                    ),
                ),
            ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !singletonTypes.has(item.getId() ?? '') &&
                item.getId() !== 'translation.metadata',
            ),
          ]),
    }),
    documentInternationalization({
      supportedLanguages: LOCALES,
      schemaTypes: translatableTypes,
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
        },
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },
})

export {DEFAULT_LOCALE, LOCALES, translatableTypes}
