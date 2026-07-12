import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * Site-wide image type: a Sanity image with required alt text.
 * The web app projects this to its legacy {src, alt, width, height}
 * ImageAsset shape via GROQ (see the app's lib/sanity/queries.ts).
 */
export const siteImageType = defineType({
  name: 'siteImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      validation: (rule) => rule.required().warning('Alt text is important for SEO and accessibility'),
    }),
  ],
})
