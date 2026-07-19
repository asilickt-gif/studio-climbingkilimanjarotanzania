import {defineField, defineType} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'

/** Singleton (document id: "blogIndexPage"): heading/intro of /blog/. */
export const blogIndexPageType = defineType({
  name: 'blogIndexPage',
  title: 'Blog Index Page',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', validation: (rule) => rule.required()}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Blog Index Page'}
    },
  },
})
