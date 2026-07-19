/**
 * Field-by-field content verification: fetches every document through the
 * web app's own GROQ queries + mappers (the exact code path pages use) and
 * deep-compares the result against the static content/*.ts source.
 *
 * Images are verified by content: a Sanity image passes only if its CDN URL
 * embeds the SHA-1 of the original file at the static src path (byte-exact
 * proof the right image is wired at the right field). width/height added by
 * the asset pipeline are ignored.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/verify-content.ts --with-user-token
 */
import {createHash} from 'node:crypto'
import {readFileSync} from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

import {
  ARTICLE_QUERY,
  BLOG_INDEX_QUERY,
  BLOG_POST_QUERY,
  CLIMBING_KILIMANJARO_PAGE_QUERY,
  COMBO_HUB_QUERY,
  DESTINATION_DETAIL_QUERY,
  DESTINATIONS_PAGE_QUERY,
  HOME_PAGE_QUERY,
  ABOUT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  PACKAGES_HUB_QUERY,
  REQUEST_QUOTE_PAGE_QUERY,
  ROUTE_QUERY,
  ROUTES_HUB_QUERY,
  SAFARI_TOURS_PAGE_QUERY,
  SHARED_TRIP_CONTENT_QUERY,
  SITE_SETTINGS_QUERY,
  STANDARD_PAGE_QUERY,
  TANZANIA_SAFARI_PAGE_QUERY,
  TRIP_QUERY,
  ZANZIBAR_PAGE_QUERY,
} from '../../climbingkilimanjarotanzania/lib/sanity/queries'
import {
  toAboutPageData,
  toArticleDetailData,
  toBlogPostData,
  toClimbingKilimanjaroPageData,
  toComboHubData,
  toContactPageData,
  toDestinationDetailData,
  toDestinationsPageData,
  toGuideArticleData,
  toHomeData,
  toLegalPageData,
  toPackageDetailData,
  toPackagesHubData,
  toRequestQuotePageData,
  toRouteDetailData,
  toRoutesHubData,
  toSafariDetailData,
  toSafariToursPageData,
  toSharedTripContent,
  toSimpleArticleData,
  toSiteSettings,
  toStandardPageData,
  toTanzaniaSafariPageData,
  toZanzibarPageData,
} from '../../climbingkilimanjarotanzania/lib/sanity/mappers'

import {siteFooter, siteInfo, siteNav} from '../../climbingkilimanjarotanzania/content/site'
import {cookiesPolicy, privacyPolicy, termsAndConditions} from '../../climbingkilimanjarotanzania/content/legal'
import {whyTravelWithUsData} from '../../climbingkilimanjarotanzania/content/why-travel-with-us'
import {articlePages} from '../../climbingkilimanjarotanzania/content/articles'
import {mountKilimanjaroData} from '../../climbingkilimanjarotanzania/content/mount-kilimanjaro'
import {guideArticlePages} from '../../climbingkilimanjarotanzania/content/guide-articles'
import {simpleArticlePages} from '../../climbingkilimanjarotanzania/content/simple-articles'
import {blogIndexData, iringaBlogPost} from '../../climbingkilimanjarotanzania/content/blog'
import {packages, packageHubCards, packageHubHero, packageTrustBadges, packageStandardIntro, packageInterestedCta, packageExpertCta, packageHeroImage} from '../../climbingkilimanjarotanzania/content/packages'
import {combos, comboHubCards, comboHubCta, comboHubIntro, comboTrustBadges, comboPriceDisclaimer, comboStandardIntro, comboHeroImage} from '../../climbingkilimanjarotanzania/content/combo'
import {safaris, safariTrustBadges, safariInterestedCta} from '../../climbingkilimanjarotanzania/content/safari'
import {routes, routeHubData, routeTrustBadges, routeCtaBand, hubCtaBandImage, routeGuidePromos, routeRelatedGuides, routeReviewStats, routeTestimonials, routeGuestReviews, routePackagesCta} from '../../climbingkilimanjarotanzania/content/routes'
import {destinationsData} from '../../climbingkilimanjarotanzania/content/destinations'
import {serengetiDetail} from '../../climbingkilimanjarotanzania/content/destination-detail'
import {aboutData} from '../../climbingkilimanjarotanzania/content/about'
import {contactData} from '../../climbingkilimanjarotanzania/content/contact'
import {requestQuoteData} from '../../climbingkilimanjarotanzania/content/request-quote'
import {zanzibarData} from '../../climbingkilimanjarotanzania/content/zanzibar'
import {tanzaniaSafariData} from '../../climbingkilimanjarotanzania/content/tanzania-safari'
import {safariToursData} from '../../climbingkilimanjarotanzania/content/safari-tours'
import {homeData} from '../../climbingkilimanjarotanzania/content/home'
import {climbingKilimanjaroPageData} from '../../climbingkilimanjarotanzania/content/climbing-kilimanjaro-page'

const client = getCliClient({apiVersion: '2026-07-01'})
const WEB_ROOT = path.resolve(process.cwd(), '../climbingkilimanjarotanzania')

const shaCache = new Map<string, string | null>()
function shaOf(publicSrc: string): string | null {
  if (!shaCache.has(publicSrc)) {
    try {
      const buf = readFileSync(path.join(WEB_ROOT, 'public', publicSrc))
      shaCache.set(publicSrc, createHash('sha1').update(buf).digest('hex'))
    } catch {
      shaCache.set(publicSrc, null)
    }
  }
  return shaCache.get(publicSrc) ?? null
}

interface Issue {
  group: string
  path: string
  detail: string
}
const issues: Issue[] = []
let fieldChecks = 0
let imageChecks = 0
let normalizedEmpties = 0

const isImage = (v: unknown): v is {src: string; alt: string} =>
  !!v && typeof v === 'object' && typeof (v as any).src === 'string' && typeof (v as any).alt === 'string'

function compare(group: string, p: string, expected: unknown, actual: unknown) {
  if (isImage(expected) && isImage(actual)) {
    fieldChecks++
    imageChecks++
    if (expected.alt !== actual.alt) issues.push({group, path: `${p}.alt`, detail: `"${expected.alt}" != "${actual.alt}"`})
    const sha = shaOf(expected.src)
    if (!sha) issues.push({group, path: `${p}.src`, detail: `source file unreadable: ${expected.src}`})
    else if (!actual.src.includes(sha))
      issues.push({group, path: `${p}.src`, detail: `CDN asset hash mismatch for ${expected.src}`})
    return
  }
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) {
      issues.push({group, path: p, detail: `array/non-array mismatch`})
      return
    }
    if (expected.length !== actual.length) {
      issues.push({group, path: p, detail: `length ${expected.length} != ${actual.length}`})
      return
    }
    expected.forEach((item, i) => compare(group, `${p}[${i}]`, item, actual[i]))
    return
  }
  if (expected && actual && typeof expected === 'object' && typeof actual === 'object') {
    const eObj = expected as Record<string, unknown>
    const aObj = actual as Record<string, unknown>
    const keys = new Set([...Object.keys(eObj), ...Object.keys(aObj)])
    for (const key of keys) {
      const e = eObj[key]
      const a = aObj[key]
      if (e === undefined && a === undefined) continue
      if (e === undefined) {
        issues.push({group, path: `${p}.${key}`, detail: `unexpected extra value in Sanity: ${JSON.stringify(a)?.slice(0, 60)}`})
        continue
      }
      if (a === undefined) {
        if (e === '') {
          // Static placeholder empty string vs omitted optional field: the
          // components treat both as "no content" — benign normalization.
          fieldChecks++
          normalizedEmpties++
          continue
        }
        issues.push({group, path: `${p}.${key}`, detail: `missing in Sanity (static: ${JSON.stringify(e)?.slice(0, 60)})`})
        continue
      }
      compare(group, `${p}.${key}`, e, a)
    }
    return
  }
  fieldChecks++
  if (expected !== actual) {
    issues.push({
      group,
      path: p,
      detail: `"${String(expected).slice(0, 60)}" != "${String(actual).slice(0, 60)}"`,
    })
  }
}

async function check(group: string, query: string, params: Record<string, unknown>, mapper: ((d: any) => unknown) | null, expected: unknown) {
  const doc = await client.fetch(query, params)
  if (!doc) {
    issues.push({group, path: '(document)', detail: 'NOT FOUND in Sanity'})
    return
  }
  compare(group, '', expected, mapper ? mapper(doc) : doc)
}

async function run() {
  await check('siteSettings', SITE_SETTINGS_QUERY, {}, toSiteSettings, {nav: siteNav, footer: siteFooter, info: siteInfo})

  for (const [slug, data] of [
    ['privacy-policy', privacyPolicy],
    ['terms-and-conditions', termsAndConditions],
    ['cookies-policy', cookiesPolicy],
  ] as const) {
    await check(`standardPage:${slug}`, STANDARD_PAGE_QUERY, {slug}, toLegalPageData, data)
  }
  await check('standardPage:why-travel-with-us', STANDARD_PAGE_QUERY, {slug: 'why-travel-with-us'}, toStandardPageData, whyTravelWithUsData)

  for (const article of [...articlePages, mountKilimanjaroData]) {
    await check(`article:${article.slug}`, ARTICLE_QUERY, {slug: article.slug}, toArticleDetailData, article)
  }
  for (const article of guideArticlePages) {
    await check(`article:${article.slug}`, ARTICLE_QUERY, {slug: article.slug}, toGuideArticleData, article)
  }
  for (const article of simpleArticlePages) {
    await check(`article:${article.slug}`, ARTICLE_QUERY, {slug: article.slug}, toSimpleArticleData, article)
  }

  await check('blogIndexPage', BLOG_INDEX_QUERY, {}, null, blogIndexData)
  await check(`blogPost:${iringaBlogPost.slug}`, BLOG_POST_QUERY, {slug: iringaBlogPost.slug}, toBlogPostData, iringaBlogPost)

  for (const pkg of packages) {
    await check(`trip:${pkg.slug}`, TRIP_QUERY, {slug: pkg.slug, category: 'package'}, toPackageDetailData, pkg)
  }
  for (const combo of combos) {
    await check(`trip:${combo.slug}`, TRIP_QUERY, {slug: combo.slug, category: 'combo'}, toPackageDetailData, combo)
  }
  for (const safari of safaris) {
    await check(`trip:${safari.slug}`, TRIP_QUERY, {slug: safari.slug, category: 'safari'}, toSafariDetailData, safari)
  }

  for (const route of routes) {
    await check(`route:${route.slug}`, ROUTE_QUERY, {slug: route.slug}, toRouteDetailData, route)
  }

  await check('destinationsPage', DESTINATIONS_PAGE_QUERY, {}, toDestinationsPageData, destinationsData)
  await check('destinationDetail:serengeti', DESTINATION_DETAIL_QUERY, {slug: serengetiDetail.slug}, toDestinationDetailData, serengetiDetail)

  await check('aboutPage', ABOUT_PAGE_QUERY, {}, toAboutPageData, aboutData)
  await check('contactPage', CONTACT_PAGE_QUERY, {}, toContactPageData, contactData)
  await check('requestQuotePage', REQUEST_QUOTE_PAGE_QUERY, {}, toRequestQuotePageData, requestQuoteData)
  await check('zanzibarPage', ZANZIBAR_PAGE_QUERY, {}, toZanzibarPageData, zanzibarData)
  await check('tanzaniaSafariPage', TANZANIA_SAFARI_PAGE_QUERY, {}, toTanzaniaSafariPageData, tanzaniaSafariData)
  await check('safariToursPage', SAFARI_TOURS_PAGE_QUERY, {}, toSafariToursPageData, safariToursData)
  await check('homePage', HOME_PAGE_QUERY, {}, toHomeData, homeData)
  await check('climbingKilimanjaroPage', CLIMBING_KILIMANJARO_PAGE_QUERY, {}, toClimbingKilimanjaroPageData, climbingKilimanjaroPageData)

  await check('sharedTripContent', SHARED_TRIP_CONTENT_QUERY, {}, toSharedTripContent, {
    routeTrustBadges, routeCtaBand, hubCtaBandImage, routeGuidePromos, routeRelatedGuides,
    routeReviewStats, routeTestimonials, routeGuestReviews, routePackagesCta,
    packageTrustBadges, packageStandardIntro, packageInterestedCta, packageExpertCta, packageHeroImage,
    comboTrustBadges, comboPriceDisclaimer, comboStandardIntro, comboHeroImage,
    safariTrustBadges, safariInterestedCta,
  })
  await check('routesHubPage', ROUTES_HUB_QUERY, {}, toRoutesHubData, routeHubData)
  await check('packagesHubPage', PACKAGES_HUB_QUERY, {}, toPackagesHubData, {hero: packageHubHero, cards: packageHubCards})
  await check('comboHubPage', COMBO_HUB_QUERY, {}, toComboHubData, {intro: comboHubIntro, cards: comboHubCards, cta: comboHubCta})

  // ---- focused article image report ----
  console.log('--- article images ---')
  for (const article of [...articlePages, mountKilimanjaroData, ...guideArticlePages]) {
    const doc = await client.fetch(ARTICLE_QUERY, {slug: article.slug})
    const parts: string[] = []
    const checkImg = (label: string, exp?: {src: string; alt: string}, act?: {src: string} | null) => {
      if (!exp) return
      const sha = shaOf(exp.src)
      const ok = !!act?.src && !!sha && act.src.includes(sha)
      parts.push(`${label}:${ok ? '✓' : '✗'}`)
    }
    const anyArticle = article as any
    checkImg('hero', anyArticle.hero?.backgroundImage, doc?.heroBackgroundImage)
    checkImg('top', anyArticle.heroImage, doc?.topImage)
    anyArticle.sections?.forEach((s: any, i: number) => checkImg(`s${i}`, s.image, doc?.sections?.[i]?.image))
    console.log(`  ${article.slug}: ${parts.length ? parts.join(' ') : '(no images)'}`)
  }

  console.log('')
  console.log(`field comparisons: ${fieldChecks} (${imageChecks} of them byte-verified images)`)
  if (normalizedEmpties) {
    console.log(`benign normalizations (static "" vs omitted optional field): ${normalizedEmpties}`)
  }
  if (issues.length === 0) {
    console.log('✓ ALL CONTENT MATCHES THE STATIC SOURCE EXACTLY')
  } else {
    console.log(`✗ ${issues.length} MISMATCHES:`)
    for (const issue of issues.slice(0, 60)) {
      console.log(`  [${issue.group}] ${issue.path}: ${issue.detail}`)
    }
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
