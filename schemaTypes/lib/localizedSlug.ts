import type {SlugIsUniqueValidator} from 'sanity'

/**
 * The site's URL strategy is "locale prefix + shared English slugs" — every
 * translated document intentionally reuses the exact same slug string as its
 * English source (the locale prefix in the URL, not the slug, distinguishes
 * them). Sanity's default slug uniqueness check ignores `language` and
 * compares across ALL documents of the type, so it incorrectly flags
 * "slug already in use" the moment a second language reuses it.
 *
 * This scopes uniqueness to (type, slug, language) instead.
 */
export const isSlugUniquePerLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const {document, getClient} = context
  if (!document) return true

  const id = document._id.replace(/^drafts\./, '')
  const client = getClient({apiVersion: '2026-07-01'})
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    type: document._type,
    language: (document as {language?: string}).language ?? null,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    _type == $type &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`

  return client.fetch(query, params)
}
