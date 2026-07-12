import {seoType} from './objects/seoType'
import {siteImageType} from './objects/siteImageType'
import {richTextType} from './objects/richTextType'
import {navLinkType} from './objects/navLinkType'
import {faqItemType} from './objects/faqItemType'
import {dataTableType} from './objects/dataTableType'
import {itineraryDayType} from './objects/itineraryDayType'
import {standardPageType} from './documents/standardPageType'
import {siteSettingsType} from './documents/siteSettingsType'
import {articleType} from './documents/articleType'
import {blogPostType} from './documents/blogPostType'
import {blogIndexPageType} from './documents/blogIndexPageType'
import {tripType} from './documents/tripType'
import {routeType} from './documents/routeType'
import {destinationsPageType} from './documents/destinationsPageType'
import {destinationDetailType} from './documents/destinationDetailType'

export const schemaTypes = [
  // objects
  seoType,
  siteImageType,
  richTextType,
  navLinkType,
  faqItemType,
  dataTableType,
  itineraryDayType,
  // documents
  standardPageType,
  siteSettingsType,
  articleType,
  blogPostType,
  blogIndexPageType,
  tripType,
  routeType,
  destinationsPageType,
  destinationDetailType,
]
