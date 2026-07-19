import type {SanityClient} from 'sanity'
import {key} from './pt'

/** Finds the _id of the existing en source document for a repeatable type, by slug. */
export async function findEnId(client: SanityClient, type: string, slug: string): Promise<string | null> {
  return client.fetch<string | null>(
    '*[_type == $type && language == "en" && slug.current == $slug][0]._id',
    {type, slug},
  )
}

/** Creates or updates a translated repeatable document (same slug, different language). Returns its _id. */
export async function upsertTranslatedDoc(
  client: SanityClient,
  type: string,
  slug: string,
  language: string,
  fields: Record<string, unknown>,
): Promise<string> {
  const existingId = await client.fetch<string | null>(
    '*[_type == $type && language == $language && slug.current == $slug][0]._id',
    {type, language, slug},
  )
  if (existingId) {
    await client.patch(existingId).set(fields).commit()
    return existingId
  }
  const created = await client.create({_type: type, language, slug: {_type: 'slug', current: slug}, ...fields})
  return created._id
}

/** Links translated repeatable documents together via a translation.metadata document (per @sanity/document-internationalization's expected shape). */
export async function linkTranslationMetadata(
  client: SanityClient,
  type: string,
  refs: {language: string; id: string}[],
) {
  const anchor = refs.find((r) => r.language === 'en')?.id ?? refs[0].id
  const metaId = `translation.metadata.${type}.${anchor}`
  await client.createOrReplace({
    _id: metaId,
    _type: 'translation.metadata',
    schemaTypes: [type],
    translations: refs.map((r) => ({
      _key: key(),
      _type: 'internationalizedArrayReferenceValue',
      language: r.language,
      value: {_type: 'reference', _ref: r.id, _weak: true, _strengthenOnPublish: {type}},
    })),
  })
}
