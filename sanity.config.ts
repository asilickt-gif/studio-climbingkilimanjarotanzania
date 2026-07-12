import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Singleton document types: pinned in the structure with fixed IDs,
// excluded from the "create new" menus and the generic type lists.
const singletonTypes = new Set(['siteSettings', 'blogIndexPage', 'destinationsPage'])
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
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Blog Index Page')
              .id('blogIndexPage')
              .child(S.document().schemaType('blogIndexPage').documentId('blogIndexPage')),
            S.listItem()
              .title('Destinations Page')
              .id('destinationsPage')
              .child(S.document().schemaType('destinationsPage').documentId('destinationsPage')),
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
