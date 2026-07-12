import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThListIcon} from '@sanity/icons/ThList'

/**
 * Simple data table. Sanity doesn't allow arrays of arrays, so each row is
 * an object with a `cells` string array; the web app maps rows back to the
 * legacy string[][] shape.
 */
export const dataTableType = defineType({
  name: 'dataTable',
  title: 'Table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Column headings',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'tableRow',
          title: 'Row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}) {
              return {title: Array.isArray(cells) ? cells.join(' | ') : '(empty row)'}
            },
          },
        }),
      ],
    }),
  ],
})
