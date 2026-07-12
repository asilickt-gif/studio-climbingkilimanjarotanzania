import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Singleton (document id: "siteSettings"): site-wide name/contact info,
 * header navigation, and footer content. Managed via the pinned
 * "Site Settings" entry in the Studio structure.
 */
export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'info',
      title: 'Site info',
      type: 'object',
      fields: [
        defineField({name: 'name', title: 'Site name', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'tagline', title: 'Tagline', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'phone', title: 'Phone', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required().email()}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'nav',
      title: 'Header navigation',
      type: 'object',
      fields: [
        defineField({
          name: 'groups',
          title: 'Dropdown groups',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'navGroup',
              title: 'Dropdown group',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'href',
                  title: 'Group URL',
                  type: 'string',
                  description: 'Optional: makes the group label itself a link',
                }),
                defineField({
                  name: 'links',
                  title: 'Links',
                  type: 'array',
                  of: [defineArrayMember({type: 'navLink'})],
                  validation: (rule) => rule.min(1),
                }),
              ],
              preview: {select: {title: 'label'}},
            }),
          ],
        }),
        defineField({
          name: 'links',
          title: 'Plain links',
          type: 'array',
          of: [defineArrayMember({type: 'navLink'})],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({name: 'newsletterHeading', title: 'Newsletter heading', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'newsletterSubheading', title: 'Newsletter subheading', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'columns',
          title: 'Link columns',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'footerColumn',
              title: 'Link column',
              type: 'object',
              fields: [
                defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'links',
                  title: 'Links',
                  type: 'array',
                  of: [defineArrayMember({type: 'navLink'})],
                  validation: (rule) => rule.min(1),
                }),
              ],
              preview: {select: {title: 'heading'}},
            }),
          ],
        }),
        defineField({
          name: 'contact',
          title: 'Contact block',
          type: 'object',
          fields: [
            defineField({name: 'phone', title: 'Phone', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required().email()}),
            defineField({name: 'address', title: 'Address', type: 'string', validation: (rule) => rule.required()}),
          ],
        }),
        defineField({name: 'copyright', title: 'Copyright line', type: 'string', validation: (rule) => rule.required()}),
        defineField({
          name: 'legalLinks',
          title: 'Legal links',
          type: 'array',
          of: [defineArrayMember({type: 'navLink'})],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
