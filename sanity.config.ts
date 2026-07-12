import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Singleton document types: pinned in the structure with fixed IDs,
// excluded from the "create new" menus and the generic type lists.
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
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

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
                .child(S.document().schemaType(type).documentId(type)),
            ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() ?? ''),
            ),
          ]),
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
