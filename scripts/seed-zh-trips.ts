/**
 * Simplified Chinese: seed all 17 unified `trip` documents (9 Kilimanjaro
 * packages, 4 combos, 2 safaris) — mirrors seed-de-trips.ts's structure
 * exactly.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-trips.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface Img {
  src: string
  alt: string
}

interface FaqZh {
  question: string
  answer: string
}

interface ItineraryDayZh {
  day: number
  label: string
  location?: string
  meta?: string[]
  body: string[]
  overnightStay?: string
  image?: Img
  secondImage?: Img
  lodgeOptions?: {name: string; image: Img}[]
}

interface SafariDayZh {
  day: number
  label: string
  image?: Img
  body: {text: string; bold?: boolean}[][]
  overnightStay?: string
  accommodationTiers?: string[]
}

const seo = (title: string, description: string) => ({_type: 'seo', title, description})

const faqs = (items: FaqZh[]) =>
  items.map((f) => ({_type: 'faqItem', _key: key(), question: f.question, answer: f.answer}))

const paragraphBlock = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

async function dayToDoc(stop: ItineraryDayZh) {
  return {
    _type: 'itineraryDay',
    _key: key(),
    day: stop.day,
    label: stop.label,
    ...(stop.location ? {location: stop.location} : {}),
    ...(stop.meta?.length ? {meta: stop.meta} : {}),
    body: stop.body.map(paragraphBlock),
    ...(stop.overnightStay ? {overnightStay: stop.overnightStay} : {}),
    ...(stop.image ? {image: await uploadImage(client, stop.image)} : {}),
    ...(stop.secondImage ? {secondImage: await uploadImage(client, stop.secondImage)} : {}),
    ...(stop.lodgeOptions?.length
      ? {
          lodgeOptions: await Promise.all(
            stop.lodgeOptions.map(async (lodge) => ({
              _type: 'lodgeOption',
              _key: key(),
              name: lodge.name,
              image: await uploadImage(client, lodge.image),
            })),
          ),
        }
      : {}),
  }
}

const segmentsToBlock = (segments: {text: string; bold?: boolean}[]) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: segments.map((seg) => ({
    _type: 'span',
    _key: key(),
    text: seg.text,
    marks: seg.bold ? ['strong'] : [],
  })),
})

async function safariDayToDoc(stop: SafariDayZh) {
  return {
    _type: 'itineraryDay',
    _key: key(),
    day: stop.day,
    label: stop.label,
    body: stop.body.map(segmentsToBlock),
    ...(stop.overnightStay ? {overnightStay: stop.overnightStay} : {}),
    ...(stop.image ? {image: await uploadImage(client, stop.image)} : {}),
    ...(stop.accommodationTiers?.length ? {accommodationTiers: stop.accommodationTiers} : {}),
  }
}

async function upsertTripZh(slug: string, fields: Record<string, unknown>) {
  const enId = await findEnId(client, 'trip', slug)
  if (!enId) {
    console.log(`SKIP ${slug}: no en source found`)
    return
  }
  const zhId = await upsertTranslatedDoc(client, 'trip', slug, 'zh', fields)
  await linkTranslationMetadata(client, 'trip', [
    {language: 'en', id: enId},
    {language: 'zh', id: zhId},
  ])
  console.log(`${slug}-zh done (${zhId})`)
}

// ---------------------------------------------------------------------------
// Shared fragments (translated once, reused verbatim across trips — mirrors
// the English source's own reuse of `arrival`/`departure`/`includesVariantX`).
// ---------------------------------------------------------------------------

const arrivalZh: ItineraryDayZh = {
  day: 0,
  label: '抵达与行前说明',
  body: ['抵达乞力马扎罗国际机场后，您将被送往住宿地点，向导会在那里进行全面的行前说明并检查装备，为接下来的探险做好准备。'],
  overnightStay: 'Ameg Lodge / Kaliwa Lodge',
  image: {src: '/images/packages/shared/kilimanjaro-airport.jpg', alt: '乞力马扎罗国际机场'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/packages/shared/ameg-lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/packages/shared/kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'}},
  ],
}

const comboArrivalZh = (): ItineraryDayZh => ({
  day: 0,
  label: '抵达与行前说明',
  body: ['抵达乞力马扎罗国际机场后，您将被送往住宿地点，向导会在那里进行全面的行前说明并检查装备，为接下来的探险做好准备。'],
  image: {src: '/images/combo/shared/kilimanjaro-airport.jpg', alt: '抵达与行前说明'},
  lodgeOptions: [
    {name: 'Ameg Lodge', image: {src: '/images/combo/shared/Ameg-Lodge.jpeg', alt: 'Ameg Lodge'}},
    {name: 'Kaliwa Lodge', image: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Kaliwa Lodge'}},
  ],
})

const departureZh: ItineraryDayZh = {
  day: -1,
  label: '离境或继续行程',
  body: ['转往乞力马扎罗国际机场搭乘返程航班——或继续您的坦桑尼亚探险之旅！'],
}

const includesVariantAZh = [
  '经验丰富的专业英语登山向导及副向导',
  '经验丰富、友善的背夫，负责搬运装备与物资',
  '厨师及山上所有餐食（早餐、午餐、晚餐）',
  '全程提供饮用水（经过滤与净化处理）及热饮',
  '乞力马扎罗国家公园门票及许可证',
  '救援费用',
  '优质帐篷及睡垫的露营住宿',
  '往返乞力马扎罗国际机场（JRO）及莫希/阿鲁沙的接送服务',
  '登顶完成后颁发登顶证书',
  '完善的行前说明及装备检查',
]
const excludesVariantAZh = [
  '往返坦桑尼亚的国际及国内航班',
  '入境坦桑尼亚的签证费用',
  '向导、背夫及厨师的小费',
  '个人徒步装备（睡袋、登山杖、服装）',
  '旅行保险（医疗及紧急撤离为强制要求）',
  '零食、酒精饮料及个人消费',
  '攀登前后的额外酒店住宿（可选）',
]

const includesVariantBZh = [
  '门票 / 入园费',
  '保育费',
  '行程中列明的所有活动',
  '行程中列明的所有住宿',
  '所有交通费用',
  '所有税费 / 18% 增值税',
  '机场接送服务',
  '行程中列明的所有餐食',
]
const excludesVariantBZh = [
  '任何国际或国内航班（往返家乡）',
  '小费（建议标准：每人每天 10 美元）',
  '个人物品（纪念品、旅行保险、签证申请费等）',
  '旅行保险及医疗遣返',
  '个人性质的物品',
]

const comboFaqHeadingZh = '您的问题，我们的解答'
const comboFaqIntroZh =
  '对预订我们的坦桑尼亚野生动物园之旅有疑问吗？请查看下方常见问题，获取快速解答。如果没有找到您需要的答案，欢迎随时联系我们——我们的专家将协助您规划完美的坦桑尼亚探险之旅。'
const comboFaqsZh: FaqZh[] = [
  {
    question: '与 Asili Explorer 一起在坦桑尼亚参加野生动物园之旅，我可以期待什么？',
    answer:
      '我们的坦桑尼亚野生动物园之旅为您提供探索这个国家非凡野生动物与壮丽风光的绝佳机会。我们专注于私人野生动物园行程，这意味着您将独享一辆 4×4 越野车或吉普车。您可以灵活决定野生动物园之旅的开始与结束时间，我们经验丰富的向导也会在探险当天协助您做出决定。无论您想在气候宜人的日出日落时分观赏最活跃的动物，还是想以泡在泳池里的方式结束一天，一切都由您决定。坦桑尼亚多样的野生动物在一天中的不同时段都很活跃，因此您将有充分的机会捕捉动物活动的精彩瞬间。',
  },
  {
    question: '你们提供机场接送服务吗？',
    answer: '是的，我们的野生动物园套餐包含机场接送服务，确保您的行程从始至终顺畅无忧——从抵达的那一刻起，即可轻松出行！',
  },
  {
    question: '你们的野生动物园之旅提供哪些住宿选择？',
    answer: '从高档旅舍到舒适的经济型营地，我们提供多样化的住宿选择，满足每位旅行者的品味，将舒适与坦桑尼亚的野性风光完美结合。',
  },
  {
    question: '前往坦桑尼亚旅行需要签证吗？',
    answer: '大多数游客前往坦桑尼亚都需要签证。我们建议您在出发前，根据自己的国籍核实最新的签证规定。',
  },
  {
    question: '参加坦桑尼亚野生动物园之旅应该带些什么？',
    answer: '请携带轻便透气的衣物、遮阳帽、防晒霜、耐穿的鞋子，以及一部优质相机来捕捉这份精彩。我们的团队也很乐意为您提供完整的行李清单！',
  },
  {
    question: '你们的野生动物园之旅适合家庭出行吗？',
    answer: '是的，我们精心设计了适合家庭的野生动物园套餐，安排了丰富有趣的活动，深受大人小孩喜爱——非常适合难忘的家庭出游。',
  },
  {
    question: '在你们的野生动物园之旅中，我能看到非洲五大兽吗？',
    answer: '当然可以！我们的行程带您穿越塞伦盖蒂和恩戈罗恩戈罗火山口等顶级野生动物栖息地，大大提高您观赏到标志性非洲五大兽的机会。',
  },
  {
    question: '如何支付我的野生动物园预订款项？',
    answer: '我们提供灵活便捷的付款方式，包括银行转账和信用卡支付。请联系我们的团队获取详细的付款步骤。',
  },
  {
    question: '如果我需要更改或取消我的野生动物园之旅怎么办？',
    answer: '生活总有变数，我们完全理解！我们的取消或改期政策对旅行者十分友好，具体条款视预订时间而定——请联系我们详细讨论您的预订情况。',
  },
]

const safariExpectFaqZh: FaqZh = {
  question: '与 Asili Explorer 一起在坦桑尼亚参加野生动物园之旅，我可以期待什么？',
  answer:
    '我们的坦桑尼亚野生动物园之旅为您提供探索这个国家非凡野生动物与壮丽风光的绝佳机会。我们专注于私人野生动物园行程，这意味着您将独享一辆 4×4 越野车或吉普车。您可以灵活决定野生动物园之旅的开始与结束时间，我们经验丰富的向导也会在探险当天协助您做出决定。',
}
const sharedSafariFaqsZh: FaqZh[] = [
  {
    question: '你们提供机场接送服务吗？',
    answer: '是的，我们的野生动物园套餐包含机场接送服务，确保您的行程从始至终顺畅无忧——从抵达的那一刻起，即可轻松出行！',
  },
  {
    question: '你们的野生动物园之旅提供哪些住宿选择？',
    answer: '从高档旅舍到舒适的经济型营地，我们提供多样化的住宿选择，满足每位旅行者的品味，将舒适与坦桑尼亚的野性风光完美结合。',
  },
  {
    question: '前往坦桑尼亚旅行需要签证吗？',
    answer: '大多数游客前往坦桑尼亚都需要签证。我们建议您在出发前，根据自己的国籍核实最新的签证规定。',
  },
  {
    question: '参加坦桑尼亚野生动物园之旅应该带些什么？',
    answer: '请携带轻便透气的衣物、遮阳帽、防晒霜、耐穿的鞋子，以及一部优质相机来捕捉这份精彩。我们的团队也很乐意为您提供完整的行李清单！',
  },
  {
    question: '你们的野生动物园之旅适合家庭出行吗？',
    answer: '是的，我们精心设计了适合家庭的野生动物园套餐，安排了丰富有趣的活动，深受大人小孩喜爱——非常适合难忘的家庭出游。',
  },
  {
    question: '在你们的野生动物园之旅中，我能看到非洲五大兽吗？',
    answer: '当然可以！我们的行程带您穿越塞伦盖蒂和恩戈罗恩戈罗火山口等顶级野生动物栖息地，大大提高您观赏到标志性非洲五大兽的机会。',
  },
  {
    question: '如何支付我的野生动物园预订款项？',
    answer: '我们提供灵活便捷的付款方式，包括银行转账和信用卡支付。请联系我们的团队获取详细的付款步骤。',
  },
  {
    question: '如果我需要更改或取消我的野生动物园之旅怎么办？',
    answer: '生活总有变数，我们完全理解！我们的取消或改期政策对旅行者十分友好，具体条款视预订时间而定——请联系我们详细讨论您的预订情况。',
  },
]

// ---------------------------------------------------------------------------
// Shared itinerary-day bodies reused across multiple Kilimanjaro packages
// (the English source repeats these verbatim across route variants).
// ---------------------------------------------------------------------------

const bodyMachameGateToCampZh = [
  '您的旅程从莫希出发，乘车约 45 分钟抵达 Machame Gate 开始。完成登记后，徒步之旅沿蜿蜒小径穿越郁郁葱葱的雨林——这是山上最潮湿的区域。请留意午后偶尔出现的阵雨，届时步道可能会有些湿滑。',
  '随着您逐渐接近 Machame Camp，攀登坡度逐渐趋缓，该营地正位于森林与巨型石楠带的过渡地带。',
]
const bodyMachameCampToShiraZh = [
  '今日行程以沿山脊陡峭攀登开始，抵达 Picnic Rock——这是一处绝佳观景点，可俯瞰基博峰及 Shira 高原的锯齿状边缘。',
  '此后步道趋于平缓，您将穿越 Shira 高原——乞力马扎罗三座火山锥中的第三座——最终抵达 Shira Camp，在此可尽享壮丽的山景。',
]
const bodyShiraToBarrancoViaLavaTowerZh = [
  '这是充满挑战但至关重要的高原适应日：您将穿越高海拔荒漠地形，前往海拔 90 米高的 Lava Tower——这座火山岩塞拥有令人惊叹的全景视野。',
  '午餐后下降至 Barranco 谷地，这里生长着独特的巨型千里光植物。这段下降过程有助于身体为即将到来的高海拔登顶做好准备。Barranco Camp 坐落于风景秀丽、地势隐蔽的山谷中，位于著名的 Barranco Wall 之下。',
]
const bodyBarrancoWallToKarangaZh = [
  '今日以攀登壮观的 Barranco Wall 拉开序幕，这是一段令人兴奋的攀登，沿途美景令人心旷神怡。',
  '抵达 4,200 米高处后，沿着蜿蜒起伏的风景步道绕行山腰，右侧可见梅鲁火山，左侧则是巍然耸立的基博峰。',
  '下降至 Karanga 谷地后，紧接着是一段短而陡峭的攀登，最终抵达当晚落脚的 Karanga Camp。',
]
const bodyKarangaToBarafuZh = [
  '经过平稳的上午攀登，您将抵达 Barafu Camp——在斯瓦希里语中意为“冰”。这座高海拔营地坐落于顶峰锥体下方的山脊上，标志着乞力马扎罗南部环线的完成，可从多个角度饱览壮观的顶峰景色。',
  '您将及时抵达以享受午后休息，并提前用晚餐，为登顶之夜做好准备。',
]
const bodySummitToMwekaZh = [
  '午夜时分，您将开始最后的登顶冲刺。步道陡峭而艰难，气温远低于冰点。随着黎明破晓，马文济峰后方壮丽的红色日出将持续激励着您前行。',
  '抵达 Stella Point（5,750 米）后，您将沿火山口边缘徒步，最终抵达 Uhuru Peak（5,895 米）——非洲的最高点！',
  '在顶峰庆祝之后，开始漫长的下降前往 Mweka Camp，途经多变的地形并中途稍作午餐停留。今晚，您将在山上享用最后一顿晚餐。',
]
const bodyMwekaToGateZh = [
  '最后的下降路段带您穿越郁郁葱葱的雨林，途中或有机会邂逅活泼的猴子。',
  '抵达 Mweka Gate 后，您将领取登顶证书，随后从 Mweka 村出发，被送回莫希的酒店。',
]

async function seedTripZh(data: TripZh) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await dayToDoc(stop))
  await upsertTripZh(data.slug, {
    category: data.category,
    seo: seo(data.seoTitle, data.seoDescription),
    name: data.name,
    durationDays: data.durationDays,
    hero: {
      stopsLine: data.stopsLine,
      ...(data.priceDisclaimer ? {priceDisclaimer: data.priceDisclaimer} : {}),
    },
    overview: {
      body: data.overviewBody.map(paragraphBlock),
      mapImage: await uploadImage(client, data.mapImage),
      ...(data.mapImageIsPhoto !== undefined ? {mapImageIsPhoto: data.mapImageIsPhoto} : {}),
      gallery: await Promise.all(data.gallery.map((img) => uploadImage(client, img))),
    },
    itinerary,
    includes: data.includes,
    excludes: data.excludes,
    faqHeading: data.faqHeading,
    ...(data.faqIntro ? {faqIntro: data.faqIntro} : {}),
    faqs: faqs(data.faqs),
    hubSummary: data.hubSummary,
    hubImage: await uploadImage(client, data.hubImage),
  })
}

interface TripZh {
  slug: string
  category: 'package' | 'combo'
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  priceDisclaimer?: string
  overviewBody: string[]
  mapImage: Img
  mapImageIsPhoto?: boolean
  gallery: Img[]
  itinerary: ItineraryDayZh[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqZh[]
  hubSummary: string
  hubImage: Img
}

interface SafariZh {
  slug: string
  name: string
  durationDays: number
  seoTitle: string
  seoDescription: string
  stopsLine: string
  overviewBody: string[]
  gallery: Img[]
  mapImage?: Img
  itinerary: SafariDayZh[]
  includes: string[]
  excludes: string[]
  faqHeading: string
  faqIntro?: string
  faqs: FaqZh[]
}

async function seedSafariZh(data: SafariZh) {
  const itinerary = []
  for (const stop of data.itinerary) itinerary.push(await safariDayToDoc(stop))
  await upsertTripZh(data.slug, {
    category: 'safari',
    seo: seo(data.seoTitle, data.seoDescription),
    name: data.name,
    durationDays: data.durationDays,
    hero: {stopsLine: data.stopsLine},
    overview: {
      body: data.overviewBody.map(paragraphBlock),
      ...(data.mapImage ? {mapImage: await uploadImage(client, data.mapImage)} : {}),
      gallery: await Promise.all(data.gallery.map((img) => uploadImage(client, img))),
    },
    itinerary,
    includes: data.includes,
    excludes: data.excludes,
    faqHeading: data.faqHeading,
    ...(data.faqIntro ? {faqIntro: data.faqIntro} : {}),
    faqs: faqs(data.faqs),
  })
}

// ---------------------------------------------------------------------------
// 11 Kilimanjaro packages
// ---------------------------------------------------------------------------

const machame7Zh: TripZh = {
  slug: '7-days-machame-route',
  category: 'package',
  name: 'Machame 路线 7 天',
  durationDays: 7,
  seoTitle: 'Machame 路线 7 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Machame 路线 7 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Machame Gate、Machame Camp、Shira Camp、Barranco Camp、Lava Tower、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp 及 Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Machame 路线又被称为“威士忌路线”，是乞力马扎罗山最受欢迎的登山路线，每年近半数徒步者都会选择这条路线。这条风景优美的路线从南侧接近乞力马扎罗山，沿壮丽的南坡攀登而上，再经由 Mweka 路线下山。沿途，登山者将欣赏到乞力马扎罗山最令人惊叹的日出与日落景色。',
    '全程约 62 公里，通常需六天完成，但强烈建议选择七天行程以获得更好的高原适应——这能显著提高登顶成功率。对于寻求充满挑战却又值得回味的探险的人来说，Machame 路线是绝佳之选。',
  ],
  mapImage: {src: '/images/packages/7-days-machame-route/hero.jpg', alt: 'Machame 路线 7 天地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern Circuit 路线 9 天'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Machame Gate 至 Machame Camp',
      location: 'Machame Gate（1,800 米）→ Machame Camp（3,000 米）',
      meta: ['爬升高度：1,200 米', '用时：6-7 小时'],
      body: bodyMachameGateToCampZh,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/7-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day1-machame-2.jpg', alt: '通往 Machame Camp 途中的雨林步道桥'},
    },
    {
      day: 2,
      label: 'Machame Camp 至 Shira Camp',
      location: 'Machame Camp（3,000 米）→ Shira Camp（3,840 米）',
      meta: ['爬升高度：840 米', '用时：5-6 小时'],
      body: bodyMachameCampToShiraZh,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day2-shira-2.jpg', alt: 'Shira 高原'},
    },
    {
      day: 3,
      label: '经 Lava Tower 从 Shira Camp 至 Barranco Camp',
      location: 'Shira Camp（3,840 米）→ Lava Tower（4,550 米）→ Barranco Camp（3,850 米）',
      meta: ['爬升高度：710 米', '下降高度：700 米', '用时：6-7 小时'],
      body: bodyShiraToBarrancoViaLavaTowerZh,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day3-lava-tower.jpg', alt: 'Lava Tower 及营地帐篷'},
    },
    {
      day: 4,
      label: '经 Barranco Wall 从 Barranco Camp 至 Karanga Camp',
      location: 'Barranco Camp（3,850 米）→ Barranco Wall（4,200 米）→ Karanga Camp（3,950 米）',
      meta: ['爬升高度：350 米', '下降高度：250 米', '用时：3-4 小时'],
      body: bodyBarrancoWallToKarangaZh,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-machame-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day4-karanga-2.jpg', alt: 'Karanga 谷地'},
    },
    {
      day: 5,
      label: 'Karanga Camp 至 Barafu Camp',
      location: 'Karanga Camp（3,950 米）→ Barafu Camp（4,600 米）',
      meta: ['爬升高度：650 米', '用时：3-4 小时'],
      body: bodyKarangaToBarafuZh,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-machame-route/day5-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day5-barafu-2.jpg', alt: '通往 Barafu Camp 的步道'},
    },
    {
      day: 6,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      location: 'Barafu Camp（4,600 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
      meta: ['爬升高度：1,295 米', '下降高度：2,785 米', '登顶用时：6-8 小时', '下山用时：6 小时'],
      body: bodySummitToMwekaZh,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-machame-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-machame-route/day6-mweka-2.jpg', alt: 'Mweka Camp 帐篷'},
    },
    {
      day: 7,
      label: 'Mweka Camp 至 Mweka Gate',
      location: 'Mweka Camp（3,110 米）→ Mweka Gate（1,830 米）',
      meta: ['下降高度：1,280 米', '用时：2-3 小时'],
      body: bodyMwekaToGateZh,
      image: {src: '/images/packages/7-days-machame-route/day7-mweka-gate.jpg', alt: '在 Mweka Gate 庆祝并领取登顶证书'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: 'Machame 路线 7 天常见问题',
  faqs: [
    {
      question: 'Machame 路线难度如何？',
      answer: 'Machame 路线常被称为“威士忌路线”，难度为中等偏高。它以优美的风景和循序渐进的高原适应著称，但部分陡峭路段与漫长的行程使其对体能要求较高。不过，只要保持合适的节奏、做好体能准备并拥有坚定的决心，大多数登山者都能胜任。',
    },
    {
      question: 'Machame 路线全程有多长？',
      answer: 'Machame 路线 7 天行程的总徒步距离约为 62 公里。它提供循序渐进的攀升坡度，并包含一天的高原适应日，以提高登顶成功率。',
    },
    {
      question: '通过 Machame 路线攀登乞力马扎罗山的最佳时间是什么时候？',
      answer: '最佳季节是干季，即 1 月至 3 月以及 6 月至 10 月。这些月份天空更晴朗、降雨更少、气候更稳定。请避开漫长的雨季（3 月至 5 月），以确保更安全、更愉快的徒步体验。',
    },
    {
      question: '住宿情况如何？',
      answer: 'Machame 路线沿途住宿为帐篷营地。您将睡在由团队搭建的优质高山帐篷中，配有舒适的睡垫，并提供专门的餐厅帐篷供用餐。营地布置有序，被壮丽的自然景观环绕。',
    },
    {
      question: '乞力马扎罗山山顶有多高？',
      answer: '最高点为 Uhuru Peak，海拔 5,895 米。这是从 Barafu Camp 最后冲刺的目标，通常在夜间出发，于清晨抵达。',
    },
    {
      question: '登顶日需要多长时间？',
      answer: '登顶日通常需要 12 至 14 小时，包括攀登至 Uhuru Peak 及下降至 Mweka Camp。这是艰苦的一天，空气稀薄、气温寒冷，但令人叹为观止的日出与登顶成就感让这一切都难以忘怀。',
    },
    {
      question: 'Machame 路线的攀登费用包含哪些内容？',
      answer: '一次优质的攀登通常包括专业向导、背夫、帐篷、餐食、公园门票及接送服务。大多数套餐还包含高原适应支持、登顶证书及安全饮用水。请务必确认详细的包含项目。',
    },
    {
      question: '高原反应常见吗？',
      answer: '是的，高原反应是需要关注的问题。Machame 路线循序渐进的攀升坡度加上额外的适应日能够降低风险，但头痛、恶心等症状仍可能出现。保持水分充足、控制节奏并听从向导指示是关键。',
    },
    {
      question: '我该如何为 Machame 路线做准备？',
      answer: '训练非常重要。请着重进行有氧运动（徒步、跑步、骑行）和力量训练（腿部与核心）。练习背负重装徒步，并在连续几天安排长距离步行以增强耐力。同时也建议进行高原模拟训练与补水习惯的练习。',
    },
    {
      question: 'Machame 路线 7 天行程的成功率是多少？',
      answer: '成功率很高——在向导经验丰富、支持完善的情况下可达 85%–90%。额外增加的适应日大大提高了您安全登顶的机会。',
    },
  ],
  hubSummary: '选择广受欢迎的 Machame 路线，全程七天，为您留出更充裕的高原适应时间',
  hubImage: {src: '/images/packages/hub/card-7-days-machame.webp', alt: 'Machame 路线 7 天'},
}

const machame6Zh: TripZh = {
  slug: '6-days-machame-route',
  category: 'package',
  name: 'Machame 路线 6 天',
  durationDays: 6,
  seoTitle: 'Machame 路线 6 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Machame 路线 6 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Machame Gate、Machame Camp、Shira Camp、Barranco Camp、Lava Tower、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp 及 Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Machame 路线 6 天是乞力马扎罗山最受欢迎、风景也最优美的登山路线之一，以多样化的地貌和较高的登顶成功率著称。这条路线被称为“威士忌路线”，深受寻求富有挑战却又值得回味的攀登体验的徒步者青睐。虽然比 7 天版本略短，但得益于“高处攀登、低处睡眠”的高度适应策略，依然能提供出色的高原适应效果。这条路线将带您穿越郁郁葱葱的雨林、荒原、高山荒漠，最终抵达 Uhuru Peak（5,895 米）的极地般顶峰区域。',
    '如果您希望在更短的登山天数内，体验一段节奏适宜、令人难忘的攀登，6 天版的 Machame 路线是绝佳之选。',
  ],
  mapImage: {src: '/images/packages/6-days-machame-route/hero.jpg', alt: 'Machame 路线 6 天地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern Circuit 路线 9 天'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Machame Gate 至 Machame Camp',
      location: 'Machame Gate（1,800 米）→ Machame Camp（3,000 米）',
      meta: ['爬升高度：1,200 米', '用时：6-7 小时'],
      body: bodyMachameGateToCampZh,
      overnightStay: 'Machame Camp',
      image: {src: '/images/packages/6-days-machame-route/day1-machame-camp.jpg', alt: 'Machame Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day1-machame-2.jpg', alt: '通往 Machame Camp 途中的雨林步道桥'},
    },
    {
      day: 2,
      label: 'Machame Camp 至 Shira Camp',
      location: 'Machame Camp（3,000 米）→ Shira Camp（3,840 米）',
      meta: ['爬升高度：840 米', '用时：5-6 小时'],
      body: bodyMachameCampToShiraZh,
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/6-days-machame-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day2-shira-2.jpg', alt: 'Shira 高原'},
    },
    {
      day: 3,
      label: '经 Lava Tower 从 Shira Camp 至 Barranco Camp',
      location: 'Shira Camp（3,840 米）→ Lava Tower（4,550 米）→ Barranco Camp（3,850 米）',
      meta: ['爬升高度：710 米', '下降高度：700 米', '用时：6-7 小时'],
      body: bodyShiraToBarrancoViaLavaTowerZh,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-machame-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day3-barranco-2.jpg', alt: 'Barranco 谷地'},
    },
    {
      day: 4,
      label: 'Barranco Camp 至 Barafu Camp',
      location: 'Barranco Camp（3,960 米）至 Barafu Camp（4,640 米）',
      meta: ['爬升高度：680 米', '用时：7–9 小时'],
      body: [
        '从令人振奋的 Barranco Wall 攀爬开始，这是一段富有冒险精神、回报丰厚的攀登。之后步道蜿蜒穿越高山荒漠地貌，途经 Karanga 谷地，最终抵达 Barafu Camp。在此，您将提前休息，为凌晨的登顶冲刺做好准备。',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-machame-route/day4-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day4-barafu-2.jpg', alt: '通往 Barafu Camp 的步道'},
    },
    {
      day: 5,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      location: 'Barafu Camp（4,640 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,080 米）',
      meta: ['爬升高度：1,255 米', '下降高度：2,815 米', '用时：12–14 小时'],
      body: [
        '登顶日在星光下拉开序幕，午夜出发攀登至 Stella Point，继续前往 Uhuru Peak——非洲最高点。在山顶见证难忘的日出后，开始漫长的下降前往 Mweka Camp。这一天您将在同一天内穿越极其多样的地貌与气候带。',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-machame-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-machame-route/day5-mweka-2.jpg', alt: 'Mweka Camp 小屋'},
    },
    {
      day: 6,
      label: 'Mweka Camp 至 Mweka Gate',
      location: 'Mweka Camp（3,080 米）→ Mweka Gate（1,640 米）',
      meta: ['下降高度：1,440 米', '用时：3–4 小时'],
      body: ['最后一段徒步沿郁郁葱葱的雨林步道下降至 Mweka Gate，您将在此庆祝这份成就、领取登顶证书，并与山上的团队道别。'],
      image: {src: '/images/packages/6-days-machame-route/day6-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureZh,
  ],
  includes: includesVariantAZh,
  excludes: [...excludesVariantAZh, '便携式厕所租赁费用（如未提前安排）'],
  faqHeading: 'Machame 路线 6 天常见问题',
  faqs: [
    {
      question: 'Machame 路线难度如何？',
      answer: 'Machame 路线常被称为“威士忌路线”，难度为中等偏高。它以优美的风景和循序渐进的高原适应著称，但部分陡峭路段与漫长的行程使其对体能要求较高。不过，只要保持合适的节奏、做好体能准备并拥有坚定的决心，大多数登山者都能胜任。',
    },
    {
      question: 'Machame 路线全程有多长？',
      answer: 'Machame 路线 6 天行程的总徒步距离约为 62 公里。它提供循序渐进的攀升坡度，并包含一天的高原适应日，以提高登顶成功率。',
    },
    {
      question: '通过 Machame 路线攀登乞力马扎罗山的最佳时间是什么时候？',
      answer: '最佳季节是干季，即 1 月至 3 月以及 6 月至 10 月。这些月份天空更晴朗、降雨更少、气候更稳定。请避开漫长的雨季（3 月至 5 月），以确保更安全、更愉快的徒步体验。',
    },
    {
      question: '住宿情况如何？',
      answer: 'Machame 路线沿途住宿为帐篷营地。您将睡在由团队搭建的优质高山帐篷中，配有舒适的睡垫，并提供专门的餐厅帐篷供用餐。营地布置有序，被壮丽的自然景观环绕。',
    },
    {
      question: '乞力马扎罗山山顶有多高？',
      answer: '最高点为 Uhuru Peak，海拔 5,895 米。这是从 Barafu Camp 最后冲刺的目标，通常在夜间出发，于清晨抵达。',
    },
    {
      question: '登顶日需要多长时间？',
      answer: '登顶日通常需要 12 至 14 小时，包括攀登至 Uhuru Peak 及下降至 Mweka Camp。这是艰苦的一天，空气稀薄、气温寒冷，但令人叹为观止的日出与登顶成就感让这一切都难以忘怀。',
    },
    {
      question: 'Machame 路线的攀登费用包含哪些内容？',
      answer: '一次优质的攀登通常包括专业向导、背夫、帐篷、餐食、公园门票及接送服务。大多数套餐还包含高原适应支持、登顶证书及安全饮用水。请务必确认详细的包含项目。',
    },
    {
      question: '高原反应常见吗？',
      answer: '是的，高原反应是需要关注的问题。Machame 路线循序渐进的攀升坡度加上额外的适应日能够降低风险，但头痛、恶心等症状仍可能出现。保持水分充足、控制节奏并听从向导指示是关键。',
    },
    {
      question: '我该如何为 Machame 路线做准备？',
      answer: '训练非常重要。请着重进行有氧运动（徒步、跑步、骑行）和力量训练（腿部与核心）。练习背负重装徒步，并在连续几天安排长距离步行以增强耐力。同时也建议进行高原模拟训练与补水习惯的练习。',
    },
    {
      question: 'Machame 路线 6 天行程的成功率是多少？',
      answer: '成功率很高——在向导经验丰富、支持完善的情况下可达 80%–85%。额外增加的适应日大大提高了您安全登顶的机会。',
    },
  ],
  hubSummary: 'Machame 路线常被称为“威士忌路线”，是乞力马扎罗山风景最优美、地貌最多样的路线之一。',
  hubImage: {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 6 天'},
}

const marangu5Zh: TripZh = {
  slug: '5-days-marangu-route',
  category: 'package',
  name: 'Marangu 路线 5 天',
  durationDays: 5,
  seoTitle: 'Marangu 路线 5 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Marangu 路线 5 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Marangu Gate、Mandara Hut、Horombo Hut、Kibo Hut',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程小屋住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Marangu 路线被称为“可口可乐路线”，是通往乞力马扎罗山山顶最成熟、最舒适的路径。它是唯一提供小屋住宿的路线，因此深受寻求较为轻松的徒步体验的旅行者青睐。步道以平缓坡度穿越郁郁葱葱的雨林、荒原与高山荒漠，最终抵达冰雪覆盖的 Uhuru Peak 山顶。非常适合徒步新手或希望攀登过程更为直接明了的旅行者。',
    'Marangu 路线 5 天——适合经验丰富或时间有限的徒步者的更快速登顶方式。行程包括：第 1 天：Marangu Gate 至 Mandara Hut（雨林地带）；第 2 天：Mandara Hut 至 Horombo Hut（荒原地带）；第 3 天：Horombo Hut 至 Kibo Hut（高山荒漠）；第 4 天：午夜出发冲顶 Uhuru Peak，随后下降至 Horombo Hut；第 5 天：返回 Marangu Gate。',
  ],
  mapImage: {src: '/images/packages/5-days-marangu-route/hero.jpg', alt: 'Marangu 路线山间小屋'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
    {src: '/images/packages/5-days-marangu-route/horombo-2.jpeg', alt: 'Horombo Hut'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Marangu Gate 至 Mandara Hut',
      location: '海拔：1,860 米 → 2,700 米',
      meta: ['爬升高度：830 米', '用时：4–5 小时'],
      body: [
        '您的徒步之旅从莫希驱车前往 Marangu Gate 开始。完成登记后，您将进入郁郁葱葱的雨林，沿着维护良好的步道开始徒步。沿途小径常常潮湿而阴凉，苔藓覆盖的树木、鸟鸣声与嬉戏的猴子相伴左右。',
        '您将在傍晚时分抵达 Mandara Hut。如果时间与体力允许，可短途步行前往 Maundi 火山口，饱览肯尼亚与坦桑尼亚北部的壮丽景色。',
      ],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/5-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day1-mandara-2.jpg', alt: 'Mandara Hut 小屋'},
    },
    {
      day: 2,
      label: 'Mandara Hut 至 Horombo Hut',
      location: '海拔：2,700 米 → 3,720 米',
      meta: ['爬升高度：1,020 米', '用时：6–7 小时'],
      body: [
        '告别雨林后，您将进入荒原地带，景观随之发生显著变化。步道穿越开阔地形持续攀升，沿途可见巨型千里光与半边莲。',
        '途中，您将首次完整地眺望基博峰与马文济峰。Horombo Hut 静候您的到来，那里景色壮丽，还能结识其他徒步者。',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day2-horombo-2.jpg', alt: 'Horombo Hut 小屋'},
    },
    {
      day: 3,
      label: 'Horombo Hut 至 Kibo Hut',
      location: '海拔：3,720 米 → 4,703 米',
      meta: ['爬升高度：983 米', '用时：6–7 小时'],
      body: [
        '今天的路线漫长而干燥，需穿越高山荒漠。您将徒步穿过马文济峰与基博峰之间的鞍部，这是一片开阔而荒凉、景色震撼的地带。空气愈发稀薄，请放慢脚步并保持充足水分。',
        '您将在午后抵达 Kibo Hut——请提前休息，为午夜开始的登顶尝试做好准备。',
      ],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day3-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day3-kibo-2.jpg', alt: 'Kibo Hut 石屋'},
    },
    {
      day: 4,
      label: 'Kibo Hut 经 Uhuru Peak 至 Horombo Hut',
      location: '海拔：4,703 米 → 5,895 米（Uhuru Peak）→ 3,720 米',
      meta: ['爬升高度：1,192 米（上行），随后下降', '用时：11–14 小时'],
      body: [
        '您的登顶之旅在凌晨开始，在黑暗中沿之字形山路及碎石地带徒步，抵达 Gilman\'s Point（5,685 米），随后沿火山口边缘前往 Uhuru Peak——非洲屋脊。',
        '记录下登顶时刻后，下降返回 Kibo Hut 稍作休息，随后继续前往 Horombo Hut，享受一晚来之不易的安睡。',
      ],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/5-days-marangu-route/day4-horombo-hut-return.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/5-days-marangu-route/day4-horombo-3.jpg', alt: 'Horombo Hut 小屋'},
    },
    {
      day: 5,
      label: 'Horombo Hut 至 Marangu Gate',
      location: '海拔：3,720 米 → 1,860 米',
      meta: ['下降高度：1,850 米', '用时：6–7 小时'],
      body: [
        '在最后一天，您将穿越荒原与郁郁葱葱的雨林下降，返回出发点。下山路段相对轻松，但请留意湿滑路段，注意脚下安全。',
        '在大门处，您将领取登顶证书，随后返回莫希——虽然疲惫，却满怀自豪。',
      ],
      image: {src: '/images/packages/5-days-marangu-route/day5-marangu-gate.jpg', alt: '日出时分接近山顶的登山者'},
    },
    departureZh,
  ],
  includes: includesVariantAZh,
  excludes: excludesVariantAZh,
  faqHeading: 'Marangu 路线 5 天常见问题',
  faqIntro: '对与我们一起攀登乞力马扎罗山有疑问吗？欢迎查看下方常见问题，获取实用参考信息。',
  faqs: [
    {
      question: 'Marangu 路线需要多少天完成？',
      answer: '标准行程为 5 天或 6 天，我们强烈建议选择 6 天版本。多出的一天可帮助更好地适应高原，提高成功抵达 Uhuru Peak 的机会。',
    },
    {
      question: 'Marangu 路线是攀登乞力马扎罗山最简单的方式吗？',
      answer: '由于坡度平缓且提供小屋住宿，这条路线常被宣传为“最简单”的路线——但请不要被误导。较短的适应时间意味着一旦出现高原反应，情况可能更为棘手，因此充分的准备至关重要。',
    },
    {
      question: '为什么 Marangu 被称为“可口可乐路线”？',
      answer: '因为这是乞力马扎罗山上唯一一条可以睡在永久性小屋而非帐篷中的路线——而且过去曾在一些休息点出售可口可乐。这个绰号反映了它相较于露营路线所具备的相对舒适性。',
    },
    {
      question: 'Marangu 路线的距离与爬升高度是多少？',
      answer: '这条路线往返全程约 72 公里。从 Marangu Gate（1,860 米）到山顶（5,895 米），爬升高度约为 4,005 米，随后您将沿同一条步道下山。',
    },
    {
      question: 'Marangu 路线提供哪种类型的住宿？',
      answer: '您将睡在带双层床的共享 A 字形小屋中。每间小屋均设有宿舍式房间、太阳能照明及基础的公共盥洗设施。如果您不希望在户外露营，这是一个不错的选择。',
    },
    {
      question: 'Marangu 路线人流拥挤吗？',
      answer: '这是最受欢迎的路线之一，尤其受预算有限的徒步者青睐。由于上山和下山使用同一条步道，您常会遇到往返两个方向的其他团队。',
    },
    {
      question: 'Marangu 路线攀登的成功率是多少？',
      answer: '由于高原适应不足，5 天行程的成功率相对较低。而 6 天版本的成功率则明显更高，尤其是在放慢节奏并保持充分补水的情况下。',
    },
    {
      question: 'Marangu 路线最适合哪类人群？',
      answer: 'Marangu 路线非常适合偏好小屋住宿舒适性的初次徒步者、在雨季出行的旅行者，或希望路线更短、后勤更简便的人群。对于寻求独处或深度荒野体验的旅行者，这条路线则并非理想之选。',
    },
  ],
  hubSummary: '通过广受欢迎的 Marangu 路线，用五天时间登上非洲最高峰。沿途风光多样……',
  hubImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Marangu 路线 5 天'},
}

const marangu6Zh: TripZh = {
  slug: '6-days-marangu-route',
  category: 'package',
  name: 'Marangu 路线 6 天',
  durationDays: 6,
  seoTitle: 'Marangu 路线 6 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Marangu 路线 6 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Marangu Gate、Mandara Hut、Horombo Hut、Horombo Hut、Kibo Hut、Horombo Hut、Marangu Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程小屋住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Marangu 路线常被称为“可口可乐路线”，是乞力马扎罗山唯一提供小屋住宿而非露营的路线。凭借这条经过充分踩踏的步道和额外的舒适性，它深受寻求风景优美又相对直接的登顶体验的徒步者青睐。',
    '这条 6 天版本相较于 5 天行程提供了更多的高原适应时间，从而提高了登顶成功率。您将穿越从雨林到高山荒漠的多个鲜明植被带，最终在午夜时分经由 Gilman\'s Point 冲刺 Uhuru Peak。',
  ],
  mapImage: {src: '/images/packages/6-days-marangu-route/hero.jpg', alt: 'Marangu 路线山间小屋'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/routes/marangu/hero.jpg', alt: 'Marangu 路线小屋'},
    {src: '/images/packages/shared/card-6-days-marangu-alt.webp', alt: 'Marangu 路线 6 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      location: '海拔：1,860 米 → 2,700 米',
      meta: ['爬升高度：840 米', '用时：4–5 小时'],
      body: ['开启您的旅程，穿越遍布疣猴与繁茂植被的郁郁葱葱雨林。经过稳步攀升后，您将抵达 Mandara Hut，度过在山上的第一晚。'],
      overnightStay: 'Mandara Hut',
      image: {src: '/images/packages/6-days-marangu-route/day1-mandara-hut.webp', alt: 'Mandara Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day1-mandara-2.jpg', alt: 'Mandara Hut 小屋'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      location: '海拔：2,700 米 → 3,720 米',
      meta: ['爬升高度：1,020 米', '用时：6–7 小时'],
      body: ['走出森林后，步道转入石楠与荒原地带。沿途可欣赏基博峰与马文济峰的壮丽景色。'],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day2-horombo-hut.jpg', alt: 'Horombo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day2-horombo-2.jpg', alt: 'Horombo Hut 小屋'},
    },
    {
      day: 3,
      label: '在 Horombo Hut 进行高原适应',
      location: '海拔：3,720 米 → 4,000 米（Zebra Rocks）→ 3,720 米',
      meta: ['爬升高度：280 米', '下降高度：280 米', '用时：2–3 小时（可选徒步）'],
      body: ['这是帮助身体适应高原的重要一天。您可以短途徒步前往 Zebra Rocks，随后返回 Horombo 享用午餐并休息。'],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day3-horombo-acclimatization.jpg', alt: 'Horombo Hut 路标'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      location: '海拔：3,720 米 → 4,703 米',
      meta: ['爬升高度：983 米', '用时：6–7 小时'],
      body: ['今日行程带您穿越高山荒漠地形，前往位于 Kibo Hut 的大本营。请提前休息，为登顶之夜做好准备。'],
      overnightStay: 'Kibo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day4-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day4-kibo-2.jpg', alt: 'Kibo Hut 石屋'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      location: '海拔：4,703 米 → 5,895 米（Uhuru Peak）→ 3,720 米',
      meta: ['爬升高度：1,192 米', '下降高度：2,175 米', '用时：12–14 小时'],
      body: ['刚过午夜，开始您的登顶冲刺，先抵达 Gilman\'s Point，随后在日出时分到达 Uhuru Peak。在山顶庆祝之后，下降至 Horombo Hut，度过此行最后一晚。'],
      overnightStay: 'Horombo Hut',
      image: {src: '/images/packages/6-days-marangu-route/day5-horombo-3.jpg', alt: '日落时分的 Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – 转运',
      location: '海拔：3,720 米 → 1,860 米',
      meta: ['下降高度：1,860 米', '用时：5–6 小时'],
      body: ['穿越荒原与雨林下降，返回大门。领取登顶证书后，您将被转运至酒店。'],
      overnightStay: '莫希/阿鲁沙酒店（已包含）',
      image: {src: '/images/packages/6-days-marangu-route/day6-marangu-gate.jpg', alt: 'Marangu Gate'},
      secondImage: {src: '/images/packages/6-days-marangu-route/day6-kaliwa-lodge.jpg', alt: 'Kaliwa Lodge'},
    },
    departureZh,
  ],
  includes: [
    '国家公园门票',
    '徒步期间的所有餐食及饮用水',
    '小屋住宿（Mandara、Horombo、Kibo）',
    '往返 Marangu Gate 的私人交通',
    '登顶前后的酒店住宿（各 1 晚）',
    '持证登山向导、厨师及背夫',
    '氧气瓶及急救箱',
    '政府税费及增值税',
    '登顶证书',
    '救援费用',
  ],
  excludes: [
    '国际及国内航班',
    '坦桑尼亚签证',
    '向导及背夫小费',
    '个人徒步装备（可租赁）',
    '旅行保险',
    '零食及额外饮品',
    '攀登前后的额外酒店住宿',
  ],
  faqHeading: '对与我们一起攀登乞力马扎罗山有疑问吗？',
  faqIntro: '欢迎查看下方常见问题，获取实用参考信息。如果没有找到您需要的答案，欢迎随时联系我们——我们的乞力马扎罗专家将协助您规划这段难忘探险的每一步。',
  faqs: [
    {
      question: 'Marangu 路线需要多少天完成？',
      answer: '标准行程为 5 天或 6 天，我们强烈建议选择 6 天版本。多出的一天可帮助更好地适应高原，提高成功抵达 Uhuru Peak 的机会。',
    },
    {
      question: 'Marangu 路线是攀登乞力马扎罗山最简单的方式吗？',
      answer: '由于坡度平缓且提供小屋住宿，这条路线常被宣传为“最简单”的路线——但请不要被误导。较短的适应时间意味着一旦出现高原反应，情况可能更为棘手，因此充分的准备至关重要。',
    },
    {
      question: '为什么 Marangu 被称为“可口可乐路线”？',
      answer: '因为这是乞力马扎罗山上唯一一条可以睡在永久性小屋而非帐篷中的路线——而且过去曾在一些休息点出售可口可乐。这个绰号反映了它相较于露营路线所具备的相对舒适性。',
    },
    {
      question: 'Marangu 路线的距离与爬升高度是多少？',
      answer: '这条路线往返全程约 72 公里。从 Marangu Gate（1,860 米）到山顶（5,895 米），爬升高度约为 4,005 米，随后您将沿同一条步道下山。',
    },
    {
      question: 'Marangu 路线提供哪种类型的住宿？',
      answer: '您将睡在带双层床的共享 A 字形小屋中。每间小屋均设有宿舍式房间、太阳能照明及基础的公共盥洗设施。如果您不希望在户外露营，这是一个不错的选择。',
    },
    {
      question: 'Marangu 路线人流拥挤吗？',
      answer: '这是最受欢迎的路线之一，尤其受预算有限的徒步者青睐。由于上山和下山使用同一条步道，您常会遇到往返两个方向的其他团队。',
    },
    {
      question: 'Marangu 路线攀登的成功率是多少？',
      answer: '由于高原适应不足，5 天行程的成功率相对较低。而 6 天版本的成功率则明显更高，尤其是在放慢节奏并保持充分补水的情况下。',
    },
    {
      question: '攀登 Marangu 路线的最佳时间是什么时候？',
      answer: '最佳月份是 1 月至 3 月初，以及 6 月至 10 月，此时天气条件更为稳定、步道也更为干燥。不过，得益于小屋住宿系统，即使在雨季，Marangu 路线依然是可行的选择。',
    },
    {
      question: '进行 Marangu 路线徒步时应携带什么？',
      answer: '适应各种温度的分层衣物、四季睡袋、保暖帽及手套、登山杖、个人洗漱用品以及头灯都是必备物品。此外还需要一个小型日间背包，主背包则由背夫负责搬运。',
    },
    {
      question: 'Marangu 路线最适合哪类人群？',
      answer: 'Marangu 路线非常适合偏好小屋住宿舒适性的初次徒步者、在雨季出行的旅行者，或希望路线更短、后勤更简便的人群。对于寻求独处或深度荒野体验的旅行者，这条路线则并非理想之选。',
    },
  ],
  hubSummary: '通过广受欢迎的 Marangu 路线，用六天时间登上非洲最高峰。沿途风光多样……',
  hubImage: {src: '/images/packages/hub/card-6-days-marangu.webp', alt: 'Marangu 路线 6 天'},
}

const lemosho7Zh: TripZh = {
  slug: '7-days-lemosho-route',
  category: 'package',
  name: 'Lemosho 路线 7 天',
  durationDays: 7,
  seoTitle: 'Lemosho 路线 7 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Lemosho 路线 7 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Lemosho Gate、Mti Mkubwa Camp、Shira 2 Camp、Barranco Camp、Lava Tower、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp 及 Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Lemosho 路线以其优美的风景与出色的高原适应曲线著称，是寻求更循序渐进、更值得回味攀登体验的徒步者的首选路线。这条路线从乞力马扎罗山的西侧出发，穿越郁郁葱葱的雨林、开阔的荒原及高山荒漠，沿途可欣赏到这座山峰及周边景观的壮丽景色。',
    '相较于许多其他路线，Lemosho 路线 7 天行程的成功率更高，非常适合希望在挑战自我的同时，充分领略乞力马扎罗山多样生态环境的旅行者。',
  ],
  mapImage: {src: '/images/packages/7-days-lemosho-route/hero.png', alt: '乞力马扎罗 Lemosho 路线地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern Circuit 路线 9 天'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Lemosho Gate 至 Mti Mkubwa Camp',
      location: 'Lemosho Gate（2,100 米）→ Mti Mkubwa（2,650 米）',
      meta: ['爬升高度：550 米', '用时：3–4 小时'],
      body: ['踏入迷人的山地森林，高耸的树木与野生动物的声响将您环绕。相对平缓的徒步旅程将带您抵达 Mti Mkubwa Camp，在此度过山上的第一晚。'],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa 至 Shira 2 Camp',
      location: 'Mti Mkubwa Camp（2,650 米）→ Shira 2 Camp（3,850 米）',
      meta: ['爬升高度：1,200 米', '用时：7–8 小时'],
      body: ['今日行程较长，从森林一路延伸至广阔的 Shira 高原。穿越荒原地带持续攀升，沿途景色壮丽，最终抵达 Shira 2 Camp，届时乞力马扎罗群峰的宏伟景象将尽收眼底。'],
      overnightStay: 'Shira Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day2-shira-camp.jpg', alt: 'Shira Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day2-shira-2.jpg', alt: 'Shira Camp 营地'},
    },
    {
      day: 3,
      label: '经 Lava Tower 从 Shira 2 Camp 至 Barranco Camp',
      location: 'Shira 2 Camp（3,840 米）→ Lava Tower（4,550 米）→ Barranco Camp（3,850 米）',
      meta: ['爬升高度：710 米', '下降高度：700 米', '用时：6-7 小时'],
      body: bodyShiraToBarrancoViaLavaTowerZh,
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day3-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day3-lava-tower.jpg', alt: 'Lava Tower 及营地帐篷'},
    },
    {
      day: 4,
      label: '经 Barranco Wall 从 Barranco Camp 至 Karanga Camp',
      location: 'Barranco Camp（3,850 米）→ Barranco Wall（4,200 米）→ Karanga Camp（3,950 米）',
      meta: ['爬升高度：350 米', '下降高度：250 米', '用时：3-4 小时'],
      body: bodyBarrancoWallToKarangaZh,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day4-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day4-karanga-2.jpg', alt: 'Karanga 谷地'},
    },
    {
      day: 5,
      label: 'Karanga Camp 至 Barafu Camp',
      location: 'Karanga Camp（3,950 米）→ Barafu Camp（4,600 米）',
      meta: ['爬升高度：650 米', '用时：3-4 小时'],
      body: bodyKarangaToBarafuZh,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day5-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day5-barafu-2.jpg', alt: '通往 Barafu Camp 的步道'},
    },
    {
      day: 6,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      location: 'Barafu Camp（4,600 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
      meta: ['爬升高度：1,295 米', '下降高度：2,785 米', '登顶用时：6-8 小时', '下山用时：6 小时'],
      body: bodySummitToMwekaZh,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/7-days-lemosho-route/day6-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/7-days-lemosho-route/day6-mweka-2.jpg', alt: 'Mweka Camp 帐篷'},
    },
    {
      day: 7,
      label: 'Mweka Camp 至 Mweka Gate',
      location: 'Mweka Camp（3,110 米）→ Mweka Gate（1,830 米）',
      meta: ['下降高度：1,280 米', '用时：2-3 小时'],
      body: bodyMwekaToGateZh,
      image: {src: '/images/packages/7-days-lemosho-route/day7-mweka-gate.jpg', alt: '在 Mweka Gate 庆祝并领取登顶证书'},
    },
    departureZh,
  ],
  includes: [...includesVariantAZh, '往返 Lemosho Gate 及 Mweka Gate 的接送服务'],
  excludes: excludesVariantAZh,
  faqHeading: 'Lemosho 路线 7 天常见问题',
  faqs: [
    {
      question: 'Lemosho 路线 7 天适合新手吗？',
      answer: '适合。虽然乞力马扎罗山是一项严峻的挑战，但 Lemosho 路线提供循序渐进的攀升坡度，让您有更充裕的时间适应高原。这使其成为最适合新手与经验丰富的徒步者的路线之一。',
    },
    {
      question: '经由 Lemosho 路线 7 天登顶的成功率是多少？',
      answer: '成功率非常高——约为 85% 或更高。较长的行程时间与稳步的爬升高度大幅改善了高原适应效果，提高了抵达 Uhuru Peak 的机会。',
    },
    {
      question: '我每天需要徒步多少小时？',
      answer: '大多数徒步日需要 4 至 7 小时的行走时间。不过，登顶日则要长得多，往返（上山与下山）共需 12 至 14 小时。',
    },
    {
      question: 'Lemosho 路线 7 天的总距离是多少？',
      answer: '从起点 Lemosho Gate 至山顶，再下降至 Mweka Gate，全程约为 70 公里。',
    },
    {
      question: '我需要有高海拔经验吗？',
      answer: '不一定需要。此行程无需技术性攀登，但良好的体能水平非常重要。您不需要事先的高海拔经验，不过高原反应可能影响任何人，因此高原适应至关重要。',
    },
    {
      question: 'Lemosho 路线使用哪种类型的住宿？',
      answer: '住宿为徒步团队提供并搭建的优质帐篷。每晚您将在指定的山间营地过夜，如 Mti Mkubwa、Shira、Barranco、Karanga、Barafu 及 Mweka。',
    },
    {
      question: '这条路线我需要携带哪些装备？',
      answer: '必备物品包括结实的登山靴、保暖睡袋（耐受温度 -10°C）、保暖内层衣物、防水装备、手套、头灯及日间背包。大多数运营商会提供完整的装备清单。',
    },
    {
      question: '山上有厕所吗？',
      answer: '每个营地都设有公共旱厕。不过，为了更舒适、更卫生，通常也会包含私人移动厕所，或可作为附加选项提供。',
    },
    {
      question: '攀登 Lemosho 路线的最佳时间是什么时候？',
      answer: '最佳季节为 1 月至 3 月初以及 6 月至 10 月。这些月份天空更晴朗、降雨更少，整体徒步条件也更好。',
    },
    {
      question: '我可以自定义这个行程或增加额外天数吗？',
      answer: '当然可以！为了更好地适应高原，行程可延长为 8 天版本，也可根据您的节奏进行调整。我们的团队会与您合作，根据您的偏好与需求量身定制这段徒步之旅。',
    },
  ],
  hubSummary: '拥有八天行程时间，您在 Lemosho 路线上的乞力马扎罗徒步之旅比其他选择耗时更长。',
  hubImage: {src: '/images/packages/shared/8-days-lemosho-route.webp', alt: 'Lemosho 路线 7 天'},
}

const lemosho8Zh: TripZh = {
  slug: '8-days-lemosho-route',
  category: 'package',
  name: 'Lemosho 路线 8 天',
  durationDays: 8,
  seoTitle: 'Lemosho 路线 8 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Lemosho 路线 8 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Lemosho Gate、Mti Mkubwa Camp、Shira Camp 1、Shira Camp 2、Barranco Camp、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp、Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Lemosho 路线是攀登乞力马扎罗山最美丽、最均衡的路线之一。它拥有丰富的生物多样性，前几日人流较少，且得益于循序渐进的攀升曲线，能带来出色的高原适应效果。如果您正在寻找一条兼具风景之美、多样地貌与较高登顶成功率的路线，8 天版的 Lemosho 路线是绝佳之选。',
    '这条路线从乞力马扎罗山西侧出发，穿越郁郁葱葱的雨林、广阔的荒原及高山荒漠，随后与 Machame 路线交汇，经由 Barafu Camp 通往山顶。',
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Lemosho 路线 8 天地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern Circuit 路线 9 天'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: '从 Lemosho Gate 至 Mti Mkubwa',
      location: '海拔：2,100 米 → 2,650 米',
      meta: ['爬升高度：550 米', '用时：3-4 小时'],
      body: [
        '早餐后，您将从阿鲁沙驱车前往 Londorossi Gate 办理登记手续，随后继续前往 Lemosho Gate，在此开始穿越郁郁葱葱雨林的徒步之旅。这一区域野生动物资源丰富，可见黑白疣猴与各类森林鸟类。您将在林荫之下徒步前行，最终抵达 Mti Mkubwa（大树）营地过夜。',
      ],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: '从 Mti Mkubwa Camp 至 Shira 1 Camp',
      location: 'Mti Mkubwa Camp（2,650 米）– Shira 1 Camp（3,610 米）',
      meta: ['爬升高度：960 米', '用时：6-7 小时'],
      body: [
        '今日步道逐渐爬出雨林，进入石楠与荒原地带。随着海拔升高，树木逐渐稀疏，视野开阔，可欣赏到 Shira 山脊与基博峰的壮丽景色。经过一段风景如画、穿越连绵丘陵与火山岩地貌的徒步后，您将抵达 Shira 高原上的 Shira 1 Camp。',
      ],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Shira 高原'},
    },
    {
      day: 3,
      label: '从 Shira 1 Camp 至 Shira 2 Camp',
      location: 'Shira 1 Camp（3,610 米）– Shira 2 Camp（3,850 米）',
      meta: ['爬升高度：240 米', '用时：3-4 小时'],
      body: [
        '沿 Shira 山脊广阔开阔的高原短途徒步，为您留出充分的休息与适应时间。天气晴朗时，您还能远眺基博峰与梅鲁火山的全景。',
      ],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Shira 2 Camp 景观'},
    },
    {
      day: 4,
      label: '从 Shira 2 Camp 经 Lava Tower 至 Barranco Camp',
      location: 'Shira 2 Camp（3,850 米）→ Lava Tower（4,630 米）→ Barranco Camp',
      meta: ['爬升高度：780 米', '下降高度：654 米', '用时：6-7 小时'],
      body: [
        '稳步攀登至令人印象深刻的 Lava Tower，在此稍作午餐休息。随后下降至风景秀丽的 Barranco 谷地过夜。这是整个行程中最重要的高原适应日之一。',
      ],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: '从 Barranco Camp 至 Karanga Camp',
      location: 'Barranco Camp（3,976 米）→ Karanga Camp（4,035 米）',
      meta: ['爬升高度：59 米', '用时：4-5 小时'],
      body: [
        '攀登著名的 Barranco Wall——具有挑战性，但无需专业攀登技巧。继续穿越高山地形前往 Karanga Camp。这一天行程较短，让身体有更多时间适应高原，为登顶之夜做好准备。',
      ],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Karanga Camp 景观'},
    },
    {
      day: 6,
      label: '从 Karanga Camp 至 Barafu Camp',
      location: 'Karanga Camp（4,035 米）→ Barafu Camp（4,703 米）',
      meta: ['爬升高度：668 米', '用时：3-4 小时'],
      body: [
        '经过短暂但陡峭的徒步穿越高海拔荒漠地形，抵达登顶之夜前的最后一个营地。请在此休息、补充水分，并做好心理准备迎接即将到来的挑战。',
      ],
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: '通往 Barafu Camp 的步道'},
    },
    {
      day: 7,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      location: 'Barafu Camp（4,703 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,720 米）',
      meta: ['爬升高度：1,192 米', '下降高度：2,175 米', '用时：12-14 小时'],
      body: [
        '在午夜时分开始您的登顶冲刺，在黑暗中朝 Stella Point 前进，随后继续前往非洲最高点——Uhuru Peak。日出与登顶合影之后，下降至 Barafu 稍作休息，随后继续前往 Mweka Camp 过夜。',
      ],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: '从 Mweka Camp 至 Mweka Gate，转往阿鲁沙',
      location: 'Mweka Camp（3,720 米）→ Mweka Gate（1,640 米）',
      meta: ['下降高度：2,080 米', '用时：3-4 小时'],
      body: [
        '穿越郁郁葱葱的雨林抵达公园大门，在此领取您的乞力马扎罗登顶证书。司机将送您前往酒店，享受一场热水澡与来之不易的休息。',
      ],
      overnightStay: '阿鲁沙',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: 'Lemosho 路线 8 天常见问题',
  faqIntro: '对与我们一起攀登乞力马扎罗山有疑问吗？欢迎查看下方 Lemosho 路线常见问题，获取清晰实用的解答。如果没有找到您需要的答案，欢迎随时联系我们——Asili Climbing Kilimanjaro 的登山专家将协助您规划一段安全、成功且难忘的登顶探险。',
  faqs: [
    {
      question: '为什么选择 Lemosho 路线攀登乞力马扎罗山？',
      answer: 'Lemosho 路线被广泛认为是乞力马扎罗山风景最优美的路线。它拥有令人叹为观止的美景、前期人流较少，且高原适应效果出色。循序渐进的攀升与多样的地貌，使其成为追求成功登顶的徒步者的理想选择。',
    },
    {
      question: 'Lemosho 路线 8 天的难度如何？',
      answer: '这段行程难度中等，只要做好充分准备便完全可以胜任。8 天的行程安排有助于更好地适应高原，提高在没有严重高原反应症状的情况下抵达 Uhuru Peak 的机会。',
    },
    {
      question: '与 Asili Climbing Kilimanjaro 一起进行 8 天 Lemosho 路线攀登，费用包含哪些内容？',
      answer: '您的攀登费用包括专业登山向导、背夫、齐全的露营装备、餐食、公园门票、救援费用及机场接送服务。攀登前后的酒店住宿也可另行安排。',
    },
    {
      question: '徒步期间使用哪种类型的住宿？',
      answer: '您将睡在高品质的四季高山帐篷中，每顶帐篷供两人共用。我们提供舒适的睡垫。所有营地均由背夫每日负责搭建与拆卸。',
    },
    {
      question: '徒步 Lemosho 路线的最佳时间是什么时候？',
      answer: '我们建议在干季攀登：1 月至 3 月中旬，以及 6 月至 10 月。这些月份天气与能见度最佳，非常适合欣赏全景与摄影。',
    },
    {
      question: '我的团队会有多少人？',
      answer: '我们保持小团队规模——通常为 2 至 10 人——以提供更个性化的体验，并确保全程的安全与支持。',
    },
    {
      question: '完成这段徒步需要多好的体能？',
      answer: '您无需成为运动健将，但应具备良好的体能水平，并能够连续数日进行数小时的徒步。我们建议提前数周通过徒步、有氧运动及力量训练进行准备。',
    },
    {
      question: '山上提供哪些类型的食物？',
      answer: '我们的高山厨师每日三餐提供热腾腾、营养丰富的餐食。您可以期待汤类、意面、米饭、肉类、蔬菜、新鲜水果及零食。如有特殊饮食需求，可提前告知我们予以满足。',
    },
    {
      question: '我能获得清洁饮用水吗？',
      answer: '可以。我们每天对沿途天然水源的水进行处理和煮沸。您每天都能获得安全的饮用水，用于补充水瓶或补水系统。',
    },
    {
      question: '与 Asili Climbing Kilimanjaro 一起攀登乞力马扎罗山安全吗？',
      answer: '安全是我们的首要任务。我们的向导均接受过荒野急救员（WFR）培训，并使用血氧仪进行每日健康检查。我们随时携带应急氧气及便携式担架。如有需要，我们会通过官方救援服务安排快速撤离。',
    },
  ],
  hubSummary: '拥有八天行程时间，您在 Lemosho 路线上的乞力马扎罗徒步之旅比其他选择耗时更长。',
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Lemosho 路线 8 天'},
}

const lemosho9Zh: TripZh = {
  slug: '9-days-lemosho-route',
  category: 'package',
  name: 'Lemosho 路线 9 天',
  durationDays: 9,
  seoTitle: 'Lemosho 路线 9 天 – 火山口露营体验 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Lemosho 路线 9 天套餐的真实每日行程、价格与包含服务，含一晚在乞力马扎罗山顶火山口内的珍贵露营体验。',
  stopsLine: 'Lemosho Gate、Mti Mkubwa Camp、Shira One Camp、Shira Two Camp、Barranco Camp、Karanga Camp、Kosovo Camp、Crater Camp、Uhuru Peak、Mweka Camp、Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿（含特殊火山口露营许可）、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Lemosho 路线本已是攀登乞力马扎罗山中风景最优美、成功率最高的路线之一，而这条延长至九天的行程更增添了一项每年仅有少数登山者能体验的独特之旅：在乞力马扎罗山顶火山口内露营一晚，距离 Uhuru Peak 仅几百米之遥。从相对安静的山体西侧出发，您将穿越雨林、高海拔荒原及广阔的 Shira 高原，随后在 Barranco Camp 上方与经典登顶路线汇合。',
    '这条行程并未选择从高海拔营地直接冲顶，而是增加了一晚在 Kosovo Camp 的额外高原适应，以及第二晚在海拔 5,730 米、火山口内的 Crater Camp 露营。在 4,700 米以上停留更长时间，能显著改善您的高原适应效果，而火山口之夜更给您带来难得的机会，可在清晨短暂冲顶前，探索火山口底部的灰坑与冰川。',
  ],
  mapImage: {src: '/images/packages/8-days-lemosho-route/hero.png', alt: 'Lemosho 路线 9 天地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: '高原上的 Shira 营地'},
    {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
    {src: '/images/packages/9-days-northern-circuit-route/day8-uhuru-peak.webp', alt: 'Uhuru Peak 山顶标志'},
    {src: '/images/packages/shared/hero-night.jpg', alt: '乞力马扎罗山顶附近银河下的帐篷'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: '从 Lemosho Gate 至 Mti Mkubwa Camp',
      location: 'Lemosho Gate（2,300 米）→ Mti Mkubwa Camp（2,800 米）',
      meta: ['爬升高度：500 米', '用时：3 小时'],
      body: ['早餐后，从阿鲁沙驱车约三至四小时抵达乞力马扎罗西侧的 Lemosho Gate。完成登记手续后，沿林间步道向东——当地称为 Chamber\'s Route——穿越茂密雨林，抵达绰号“大树营地”的 Mti Mkubwa，这是您在山上的第一晚。'],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate 登记点'},
    },
    {
      day: 2,
      label: '从 Mti Mkubwa Camp 至 Shira One Camp',
      location: 'Mti Mkubwa Camp（2,800 米）→ Shira One Camp（3,500 米）',
      meta: ['爬升高度：700 米', '用时：5-6 小时'],
      body: ['步道稳步爬出雨林，进入巨型石楠与荒原地带。这是充实的一天，海拔提升明显，请保持自己的节奏并多补充水分。您将在 Shira 火山口下方的山脊附近稍作午餐休息，随后继续前往高海拔的 Shira 高原，在那里首次近距离眺望乞力马扎罗中央火山锥——基博峰。'],
      overnightStay: 'Shira One Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day2-shira1-camp.jpg', alt: 'Shira One Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day2-shira1-2.jpg', alt: 'Shira 高原'},
    },
    {
      day: 3,
      label: '从 Shira One Camp 至 Shira Two Camp',
      location: 'Shira One Camp（3,500 米）→ Shira Two Camp（3,900 米）',
      meta: ['爬升高度：400 米', '用时：4-5 小时'],
      body: ['今日行程较为轻松，穿越广阔的 Shira 高原，途经 Shira 大教堂岩石地貌，可俯瞰高原、山体及远方平原的开阔景色。午餐后，大多数团队会进行约一小时的短途高原适应徒步，稍微提升海拔，随后返回 Shira Two 过夜。'],
      overnightStay: 'Shira Two Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day3-shira2-camp.jpg', alt: 'Shira Two Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day3-shira2-2.jpg', alt: 'Shira 高原景观'},
    },
    {
      day: 4,
      label: '经 Lava Tower 从 Shira Two Camp 至 Barranco Camp',
      location: 'Shira Two Camp（3,900 米）→ Lava Tower（4,640 米）→ Barranco Camp（3,950 米）',
      meta: ['爬升高度：740 米', '下降高度：690 米', '用时：7 小时'],
      body: ['充满挑战却又值回票价的一天。步道稳步攀升至令人惊叹的火山岩塞 Lava Tower，您将在海拔超过 4,600 米处享用热腾腾的午餐——为接下来的行程做绝佳的高原适应。随后步道下降进入郁郁葱葱的 Barranco 谷地，沿途可见 Breach Wall 及乞力马扎罗南侧冰川的壮丽景色。'],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day4-barranco-camp.jpg', alt: 'Barranco Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day4-barranco-wall.webp', alt: 'Barranco Wall'},
    },
    {
      day: 5,
      label: '从 Barranco Camp 至 Karanga Camp',
      location: 'Barranco Camp（3,950 米）→ Karanga Camp（4,050 米）',
      meta: ['爬升高度：100 米', '用时：4-5 小时'],
      body: ['这一天从 Barranco Wall 开始——一段 300 米高的攀爬，看起来令人生畏，但在向导的协助下相当顺利，并以乞力马扎罗南面浮现的海姆冰川美景作为回报。从崖顶开始，步道继续向东，沿 Decken 冰川与 Rebmann 冰川下方前行，抵达高踞于 Karanga 谷地上方的 Karanga Camp。'],
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day5-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day5-karanga-2.webp', alt: 'Karanga 谷地'},
    },
    {
      day: 6,
      label: '从 Karanga Camp 至 Kosovo Camp',
      location: 'Karanga Camp（4,050 米）→ Kosovo Camp（4,900 米）',
      meta: ['爬升高度：850 米', '用时：4 小时'],
      body: ['这是刻意安排的短程一天，专为在冲顶前进行高原适应而设。Kosovo Camp 的海拔明显高于较短行程通常使用的 Barafu Camp，这份额外的高度——加上提早休息——将在登顶日为您的状态带来切实的差别。'],
      overnightStay: 'Kosovo Camp',
      image: {src: '/images/packages/8-days-lemosho-route/day6-barafu-camp.jpg', alt: '山顶下方的高海拔荒漠营地'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day6-barafu-2.jpg', alt: '穿越高海拔荒漠的步道'},
    },
    {
      day: 7,
      label: '经 Stella Point 从 Kosovo Camp 至 Crater Camp',
      location: 'Kosovo Camp（4,900 米）→ Stella Point（5,756 米）→ Crater Camp（5,730 米）',
      meta: ['爬升高度：830 米', '用时：5-6 小时'],
      body: ['这是整段旅程的核心所在。清晨早餐后，穿越厚重的碎石区攀登至火山口边缘的 Stella Point——这在心理与体力上都是全程最艰难的一段。从这里下降约 30 分钟，即可进入火山口内部，营地就设在海拔 5,730 米处。下午时间自由安排，大多数团队会前往探索火山口底部的灰坑与冰川，随后在非洲屋脊上欣赏日落，享用一顿终生难忘的晚餐。'],
      overnightStay: 'Crater Camp（乞力马扎罗山顶火山口内）',
      image: {src: '/images/packages/shared/hero-night.jpg', alt: '乞力马扎罗山顶附近星空下露营'},
    },
    {
      day: 8,
      label: '从 Crater Camp 经 Uhuru Peak 至 Mweka Camp',
      location: 'Crater Camp（5,730 米）→ Uhuru Peak（5,896 米）→ Mweka Camp（3,100 米）',
      meta: ['爬升高度：166 米', '下降高度：2,796 米', '用时：10-11 小时'],
      body: ['由于您已经在山顶附近过夜，当日前往 Uhuru Peak 的冲顶路程十分短暂——约九十分钟——并特意安排在日出时分抵达。在非洲最高点庆祝之后，真正的挑战才刚开始：漫长的下降路程重新经过 Kosovo Camp，一路下降至 Mweka Camp，当天累计下降近 2,800 米。'],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-uhuru-peak.webp', alt: 'Uhuru Peak 山顶标志，非洲屋脊'},
      secondImage: {src: '/images/packages/8-days-lemosho-route/day7-mweka-camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 9,
      label: '从 Mweka Camp 至 Mweka Gate，转往阿鲁沙',
      location: 'Mweka Camp（3,100 米）→ Mweka Gate（1,640 米）',
      meta: ['下降高度：1,460 米', '用时：3-4 小时'],
      body: ['最后一段轻松的雨林徒步，抵达 Mweka Gate，您的团队将在此举行欢送仪式，随后互道珍重，领取登顶证书。从公园大门出发，短暂转运后即可返回阿鲁沙的酒店，享受一场热水澡与来之不易的休息。'],
      overnightStay: '阿鲁沙',
      image: {src: '/images/packages/8-days-lemosho-route/day8-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureZh,
  ],
  includes: [
    '门票 / 入园费',
    '保育费',
    '特殊火山口露营许可',
    '行程中列明的所有活动',
    '行程中列明的所有住宿',
    '所有交通费用',
    '所有税费 / 18% 增值税',
    '机场接送服务',
    '行程中列明的所有餐食',
  ],
  excludes: excludesVariantBZh,
  faqHeading: 'Lemosho 路线 9 天常见问题',
  faqIntro: '对在乞力马扎罗火山口露营有疑问吗？欢迎查看下方 Lemosho 路线 9 天常见问题，获取清晰实用的解答。如果没有找到您需要的答案，欢迎随时联系我们——Asili Climbing Kilimanjaro 的登山专家将协助您规划一段安全、成功且难忘的登顶探险。',
  faqs: [
    {
      question: 'Lemosho 路线 9 天与标准的 8 天版本有何不同？',
      answer: '这条行程增加了一晚更高海拔的住宿——Kosovo Camp，而非直接前往登顶前的高海拔营地——并在海拔 5,730 米的乞力马扎罗山顶火山口内露营一晚，随后于清晨短暂冲顶 Uhuru Peak。这一天额外的高海拔停留能显著改善高原适应与登顶成功率，而火山口露营更是极少数登山者才能体验的珍贵经历。',
    },
    {
      question: '在海拔 5,730 米的火山口内露营安全吗？',
      answer: '是的，只要做好充分准备。那里夜间气温远低于冰点，而这样的海拔意味着您抵达时应已具备良好的高原适应状态。我们的向导会随身携带补充氧气及血氧仪，每日两次监测每位队员的状态，一旦发现高原反应迹象，会立即安排下撤。',
    },
    {
      question: '在火山口露营需要特殊许可吗？',
      answer: '是的。除标准公园门票外，火山口露营还需要乞力马扎罗国家公园单独核发的许可，且名额有限。这项许可申请工作已包含在本套餐中，由我们全权为您办理。',
    },
    {
      question: '与乞力马扎罗其他行程相比，这条路线的难度如何？',
      answer: '这是我们难度较高的行程之一，主要是因为在 4,700 米以上停留时间较长，且登顶日下降路程漫长。不过，行程中额外安排的高原适应——包括 Kosovo Camp 那一晚——能为您带来相较于较短路线的切实优势；此前的高海拔徒步经验虽非必需，但会有所帮助。',
    },
    {
      question: '这段徒步最佳的季节是什么时候？',
      answer: '干季——1 月至 3 月中旬，以及 6 月至 10 月——天空最为晴朗，也为火山口之夜提供最佳条件，宁静清澈的夜晚将带来截然不同的舒适度与视野体验。',
    },
    {
      question: '我的团队会有多少人？',
      answer: '我们以小团体形式组织这条行程，通常为 2 至 10 名徒步者，并由完整的向导团队、厨师及背夫全程支持。',
    },
    {
      question: '山上的住宿情况如何？',
      answer: '每晚——包括在 Crater Camp 的那一晚——您都将睡在坚固的四季高山帐篷内，配有优质睡垫。我们的团队每日负责搭建与拆卸营地，确保您抵达时已准备就绪。',
    },
    {
      question: '火山口那晚我需要更保暖的睡袋吗？',
      answer: '我们强烈建议使用耐受温度至少达到 -15°C 的睡袋，最好是羽绒材质，并为火山口那一晚专门准备保暖的贴身内层——海拔 5,730 米处的气温经常远低于山上其他任何地方，登山者需要格外注意保暖。',
    },
  ],
  hubSummary: '我们最长、最独特的 Lemosho 行程，增加了一晚额外的高原适应，以及一次珍贵的乞力马扎罗山顶火山口露营体验。',
  hubImage: {src: '/images/packages/hub/card-8-days-lemosho.webp', alt: 'Lemosho 路线 9 天'},
}

const rongai7Zh: TripZh = {
  slug: '7-days-rongai-route',
  category: 'package',
  name: 'Rongai 路线 7 天',
  durationDays: 7,
  seoTitle: 'Rongai 路线 7 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Rongai 路线 7 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Nalemoru Gate、Simba Camp、Second Cave Camp、Kikelewa Camp、Mawenzi Tarn、Kibo Hut、Horombo Hut、Marangu Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Rongai 路线是唯一从肯尼亚边境附近的北侧接近乞力马扎罗山的路线，提供更为宁静、偏远的体验，地势稳步上升，人流较少。这条路线非常适合追求平静登山之旅、喜爱观赏野生动物，并偏好较为干燥路线的旅行者——尤其是在雨季时。',
    '在七天的行程中，您将穿越郁郁葱葱的雨林、开阔的荒原以及高山荒漠，最终登上非洲最高点——Uhuru Peak。',
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Rongai 路线 7 天地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: '步道上的登山者'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Nalemoru Gate 至 Simba Camp',
      location: 'Nalemoru Gate（1,950 米）→ Simba Camp（2,620 米）',
      meta: ['爬升高度：670 米', '用时：3–4 小时'],
      body: ['您的徒步之旅从 Nalemoru Gate 开始，沿郁郁葱葱的山地森林缓步攀升。请留意沿途出没的疣猴与森林鸟类。抵达 Simba Camp，营地坐落于荒原边缘。'],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Simba Camp 路标'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'Simba Camp 至 Second Cave Camp',
      location: 'Simba Camp（2,620 米）→ Second Cave Camp（3,450 米）',
      meta: ['爬升高度：830 米', '用时：5-6 小时'],
      body: ['告别森林后，今日步道逐渐开阔为石楠与荒原地带。沿途可欣赏基博峰的壮丽景色，一路前往 Second Cave Camp——一处被高山植被环绕的宁静之地。'],
      overnightStay: 'Second Cave Camp',
      image: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-camp.webp', alt: 'Second Cave Camp 帐篷'},
    },
    {
      day: 3,
      label: 'Second Cave 至 Kikelewa Camp',
      location: 'Second Cave（3,450 米）→ Kikelewa Camp（3,630 米）',
      meta: ['爬升高度：180 米', '用时：3–4 小时'],
      body: ['这是较短却十分优美的一天，步道蜿蜒穿越崎岖荒原，乞力马扎罗群峰的景色愈发壮观。抵达 Kikelewa Camp，营地坐落于视野开阔的隐蔽谷地之中。'],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
    },
    {
      day: 4,
      label: 'Kikelewa 至 Mawenzi Tarn',
      location: 'Kikelewa（3,630 米）→ Mawenzi Tarn（4,310 米）',
      meta: ['爬升高度：680 米', '用时：4–5 小时'],
      body: ['今日的攀升更为陡峭，但回报同样丰厚。您将朝乞力马扎罗第二高峰马文济峰徒步前行，沿途景色壮丽，宛如置身于超凡脱俗的高海拔地貌之中。Mawenzi Tarn Camp 坐落于高耸悬崖下的壮观山谷中。'],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 5,
      label: 'Mawenzi Tarn 至 Kibo Hut',
      location: 'Mawenzi Tarn（4,310 米）→ Kibo Hut（4,700 米）',
      meta: ['爬升高度：390 米', '用时：5–6 小时'],
      body: ['穿越马文济峰与基博峰之间宛如月球表面般的鞍部，于中午前后抵达 Kibo Hut。请在此休息、补充水分，为约在午夜开始的艰巨登顶尝试做好准备。'],
      overnightStay: 'Kibo Hut（宿舍式住宿）',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Kibo Hut 石屋'},
    },
    {
      day: 6,
      label: '从 Kibo Hut 经 Uhuru Peak 至 Horombo Hut',
      location: 'Kibo Hut（4,700 米）→ Uhuru Peak（5,895 米）→ Horombo Hut（3,720 米）',
      meta: ['爬升高度：1,195 米', '下降高度：2,175 米', '登顶用时：6-8 小时', '下山用时：6 小时'],
      body: ['您的登顶冲刺在星空下展开，沿陡峭的之字形步道攀登至 Gilman\'s Point（5,685 米），随后沿火山口边缘前往 Uhuru Peak——非洲屋脊。短暂庆祝之后，经由 Kibo 下降至 Horombo Hut，享受一份来之不易的休息。'],
      overnightStay: 'Horombo Hut（宿舍式住宿）',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: 'Uhuru Peak 山顶'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 7,
      label: 'Horombo Hut 至 Marangu Gate',
      location: 'Horombo Hut（3,720 米）→ Marangu Gate（1,860 米）',
      meta: ['下降高度：1,860 米', '用时：5–6 小时'],
      body: ['穿越郁郁葱葱的雨林下降至 Marangu Gate，在此领取登山证书，庆祝这份成就。随后转运返回莫希或阿鲁沙。'],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: '前往 Marangu Gate 的下降路段'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: 'Rongai 路线 7 天常见问题',
  faqs: [
    {
      question: 'Rongai 路线是否比乞力马扎罗其他路线更为清静？',
      answer: '是的，Rongai 路线是唯一从肯尼亚边境附近的北侧接近乞力马扎罗山的路线。相较于 Machame 或 Marangu 等热门路线，它以更为清静、人流更少著称，提供更为宁静的徒步体验。',
    },
    {
      question: 'Rongai 路线 7 天的难度如何？',
      answer: 'Rongai 路线难度中等，坡度循序渐进，有助于高原适应。对于希望在体力挑战与更高成功率之间取得平衡的旅行者来说，是不错的选择。',
    },
    {
      question: 'Rongai 路线 7 天的成功率是多少？',
      answer: '7 天行程能提升高原适应效果，登顶成功率约为 85% 或更高，尤其相较于同一路线的更短版本更为明显。',
    },
    {
      question: 'Rongai 路线的住宿情况如何？',
      answer: '您将入住由专业团队搭建并维护的高品质高山帐篷。下山（经由 Marangu）时，您将在 Horombo Hut 过夜，这是一处温暖舒适的休息点。我们还提供私人厕所帐篷，提升整体舒适度。',
    },
    {
      question: '相比其他路线，这里的风景如何？',
      answer: 'Rongai 路线拥有多样而独特的地貌，包括偏远的荒野、林木覆盖的山坡，以及马文济峰的壮丽景观。经由 Marangu 路线下山，则带来景色的转变，途经郁郁葱葱的雨林。',
    },
    {
      question: '这条路线在雨季表现更好吗？',
      answer: '是的。乞力马扎罗北侧降雨较少，如果您计划在 3 月至 5 月或 11 月攀登，Rongai 是明智之选。同时，它也是全年徒步中天气干扰较少、较为可靠的选择。',
    },
    {
      question: '是否提供餐食与饮用水？',
      answer: '是的。我们的高山厨师每日三次提供新鲜、热腾腾的餐食，并全程供应经过过滤处理的安全饮用水。如有特殊饮食需求，请提前告知，我们会予以满足。',
    },
    {
      question: '我会得到怎样的支持团队？',
      answer: '您将由一支完整的支持团队全程陪伴：经验丰富、经过培训及认证的向导、背夫与厨师。我们的团队从始至终确保您的安全与舒适——您的成功，就是我们的使命。',
    },
    {
      question: '登顶之夜是什么样的体验？',
      answer: '登顶之夜是全程中最具挑战、同时也最鼓舞人心的部分。我们大约在午夜从 Kibo Hut 出发，于日出时分抵达 Uhuru Peak。我们的向导将全程陪伴您，一步一步给予支持与鼓励。',
    },
    {
      question: '我可以将这次登山与坦桑尼亚野生动物园结合吗？',
      answer: '当然可以，我们也强烈推荐这样做！在 Asili Climbing Kilimanjaro，我们提供徒步后的定制野生动物园延伸行程。探索塞伦盖蒂、恩戈罗恩戈罗火山口，或前往桑给巴尔放松身心——一切取决于您的旅行梦想。',
    },
  ],
  hubSummary: '从北侧出发，这条路线呈现独特的乞力马扎罗山视角，非常适合……',
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Rongai 路线 7 天'},
}

const rongai6Zh: TripZh = {
  slug: '6-days-rongai-route',
  category: 'package',
  name: 'Rongai 路线 6 天',
  durationDays: 6,
  seoTitle: 'Rongai 路线 6 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Rongai 路线 6 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Nalemoru Gate、Simba Camp、Kikelewa Camp、Mawenzi Tarn、Kibo Hut、Horombo Hut、Marangu Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Rongai 路线是唯一从肯尼亚边境附近的北侧接近乞力马扎罗山的路线，提供更为宁静、偏远的体验，地势稳步上升，人流较少。这条 6 天版本将标准行程中两个较为平缓的下段路程合并为一天较长的徒步，非常适合时间有限或已具备一定高海拔经验的登山者。',
    '上山途中，您将穿越郁郁葱葱的雨林、开阔的荒原以及高山荒漠，随后经由乞力马扎罗山的 Marangu 一侧下山，途经 Horombo Hut，最终登上非洲最高点——Uhuru Peak。',
  ],
  mapImage: {src: '/images/packages/7-days-rongai-route/hero.png', alt: 'Rongai 路线 6 天地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/7-days-rongai-route/simba-camp-2.jpg', alt: 'Simba Camp'},
    {src: '/images/packages/shared/kilimanjaro-climb.webp', alt: '步道上的登山者'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Nalemoru Gate 至 Simba Camp',
      location: 'Nalemoru Gate（1,950 米）→ Simba Camp（2,600 米）',
      meta: ['爬升高度：650 米', '用时：5 小时'],
      body: [
        '您的徒步之旅从 Nalemoru Gate 开始，坐落于乞力马扎罗更为宁静的北侧，紧邻肯尼亚边境。完成国家公园登记手续后，沿山地森林缓步攀升——请留意沿途出没的疣猴与森林鸟类——最终抵达位于荒原边缘的 Simba Camp。',
      ],
      overnightStay: 'Simba Camp',
      image: {src: '/images/packages/7-days-rongai-route/day1-simba-camp.jpg', alt: 'Simba Camp 路标'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day1-simba-camp-2.jpg', alt: 'Simba Camp'},
    },
    {
      day: 2,
      label: 'Simba Camp 至 Kikelewa Camp',
      location: 'Simba Camp（2,600 米）→ Kikelewa Camp（3,600 米）',
      meta: ['爬升高度：1,000 米', '用时：6–7 小时'],
      body: [
        '这是较长的一天，将标准路线中两段较为平缓的路程合并为一。步道逐渐开阔为石楠与荒原地带，途经 Second Cave 大约行程中点处——是享用便携午餐的好地方——随后继续前往 Kikelewa Camp，营地坐落于视野开阔的隐蔽谷地中，可远眺马文济峰及远处的平原。',
      ],
      overnightStay: 'Kikelewa Camp',
      image: {src: '/images/packages/7-days-rongai-route/day3-kikelewa-camp.jpg', alt: 'Kikelewa Camp'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day2-second-cave.webp', alt: 'Second Cave，前往 Kikelewa 途中的午餐休息点'},
    },
    {
      day: 3,
      label: 'Kikelewa Camp 至 Mawenzi Tarn',
      location: 'Kikelewa Camp（3,600 米）→ Mawenzi Tarn（4,330 米）',
      meta: ['爬升高度：730 米', '用时：4 小时'],
      body: [
        '这是一段短暂却持续陡峭的攀登，通往高海拔荒原地带，沿途生长着巨型半边莲与草本植物。Mawenzi Tarn Camp 坐落于马文济峰脚下一处壮观的冰斗地形中——马文济峰是乞力马扎罗的第二高峰——这里是休息与让身体适应高海拔的绝佳之地。',
      ],
      overnightStay: 'Mawenzi Tarn Camp',
      image: {src: '/images/packages/7-days-rongai-route/day4-mawenzi-tarn.jpg', alt: 'Mawenzi Tarn Camp'},
    },
    {
      day: 4,
      label: 'Mawenzi Tarn 至 Kibo Hut',
      location: 'Mawenzi Tarn（4,330 米）→ Kibo Hut（4,700 米）',
      meta: ['爬升高度：370 米', '用时：5 小时'],
      body: [
        '穿越马文济峰与基博峰——乞力马扎罗两座最高峰——之间宛如月球表面般的鞍部，于午后早些时候抵达 Kibo Hut。晚餐提前供应，并在日落前早早就寝，这短暂的一天主要是为了休息，并为当晚开始的登顶尝试做好准备。',
      ],
      overnightStay: 'Kibo Hut（宿舍式住宿）',
      image: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut.webp', alt: 'Kibo Hut'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day5-kibo-hut-1.jpg', alt: 'Kibo Hut 石屋'},
    },
    {
      day: 5,
      label: '从 Kibo Hut 经 Uhuru Peak 至 Horombo Hut',
      location: 'Kibo Hut（4,700 米）→ Uhuru Peak（5,895 米）→ Horombo Hut（3,720 米）',
      meta: ['爬升高度：1,195 米', '下降高度：2,175 米', '用时：14 小时'],
      body: [
        '向导会在午夜时分唤醒您，享用茶水与饼干，随后开始最后的冲顶。步道稳步攀升，经过 Hans Meyer Cave 抵达火山口边缘的 Gilman\'s Point，随后继续前行——常需穿越积雪路段——最终抵达非洲屋脊 Uhuru Peak。登顶庆祝之后，漫长的下降之路重新经过 Kibo Hut，享用热腾腾的午餐，随后继续前往 Horombo Hut，享用一顿来之不易的晚餐并好好休息。',
      ],
      overnightStay: 'Horombo Hut（宿舍式住宿）',
      image: {src: '/images/packages/7-days-rongai-route/day6-uhuru-peak.webp', alt: 'Uhuru Peak 山顶'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day6-horombo-hut-2.jpeg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut 至 Marangu Gate',
      location: 'Horombo Hut（3,720 米）→ Marangu Gate（1,980 米）',
      meta: ['下降高度：1,740 米', '用时：6 小时'],
      body: [
        '与团队一同举行的庆祝仪式——载歌载舞——为您的最后一个清晨拉开序幕。穿越郁郁葱葱的雨林下降至 Marangu Gate，在此签署登记册并领取登顶证书，随后转运返回莫希，享受一场热水澡与真正的庆祝时刻。',
      ],
      image: {src: '/images/packages/7-days-rongai-route/day7-marangu-gate-descent.jpg', alt: '前往 Marangu Gate 的下降路段'},
      secondImage: {src: '/images/packages/7-days-rongai-route/day7-horombo-hut-1.jpg', alt: 'Horombo Hut'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: 'Rongai 路线 6 天常见问题',
  faqIntro: '对 Rongai 路线 6 天有疑问吗？欢迎查看下方常见问题，获取清晰实用的解答。如果没有找到您需要的答案，欢迎随时联系我们——Asili Climbing Kilimanjaro 的登山专家将协助您规划一段安全、成功且难忘的登顶探险。',
  faqs: [
    {
      question: 'Rongai 路线 6 天与 7 天版本有何不同？',
      answer: '6 天行程将两段较为平缓的下段路程——从 Simba Camp 至 Second Cave，以及从 Second Cave 至 Kikelewa——合并为一天较长的徒步。其余部分与 7 天路线完全相同，包括路径、营地及登顶之夜，只是少了一天高原适应时间。',
    },
    {
      question: '在 Rongai 路线上，六天时间是否足以充分适应高原？',
      answer: '对于已具备一定高海拔经验的登山者而言，六天可能已经足够——Rongai 路线循序渐进的坡度依然比更陡峭的路线更具优势。不过，如果这是您首次前往 4,000 米以上区域，我们建议选择 7 天版本，以更舒适地登顶。',
    },
    {
      question: '这条路线的成功率是多少？',
      answer: 'Rongai 6 天行程的成功率表现良好，但由于少了一天高原适应，略低于 7 天版本。您的向导会全程密切监测您的状态，并在必要时调整节奏。',
    },
    {
      question: 'Rongai 路线是否比乞力马扎罗其他路线更为清静？',
      answer: '是的。这是唯一从肯尼亚边境附近的北侧接近乞力马扎罗山的路线，前往登山起点所需车程也最长——这使其明显比 Machame 或 Marangu 等路线更为清静。',
    },
    {
      question: '这条路线的住宿情况如何？',
      answer: '前四晚，您将睡在优质高山帐篷中，之后则入住 Kibo 与 Horombo 的宿舍式住宿。全程我们均提供私人厕所帐篷，提升舒适度。',
    },
    {
      question: '这条路线在雨季是否是个不错的选择？',
      answer: '是的——乞力马扎罗北侧的降雨量明显少于南侧路线，如果您计划在 3 月至 5 月或 11 月的过渡季节攀登，Rongai 是明智之选。',
    },
    {
      question: '登顶之夜是什么样的体验？',
      answer: '您将在午夜时分离开 Kibo Hut，在黑暗中经过 Hans Meyer Cave 与 Gilman\'s Point 攀登，于日出前后抵达 Uhuru Peak，随后当天即长途下降至 Horombo Hut。这是全程中最具挑战性的一天，但我们的向导会全程陪伴、一步一步支持您。',
    },
    {
      question: '我可以将这次登山与坦桑尼亚野生动物园结合吗？',
      answer: '当然可以。我们提供登顶后的定制野生动物园延伸行程——塞伦盖蒂、恩戈罗恩戈罗火山口，或前往桑给巴尔享受悠闲时光，都是广受欢迎的附加选择。',
    },
  ],
  hubSummary: '这条更快节奏的北线之旅——六天从 Nalemoru Gate 直达 Uhuru Peak，人流比经典的南侧路线更少。',
  hubImage: {src: '/images/packages/hub/card-7-days-rongai.webp', alt: 'Rongai 路线 6 天'},
}

const umbwe6Zh: TripZh = {
  slug: '6-days-umbwe-route',
  category: 'package',
  name: 'Umbwe 路线 6 天',
  durationDays: 6,
  seoTitle: 'Umbwe 路线 6 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Umbwe 路线 6 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Umbwe Gate、Umbwe Cave Camp、Barranco Camp、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp 及 Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Umbwe 路线被公认为通往乞力马扎罗山顶最直接、最陡峭、也最具挑战性的路径。这条路线并非人人皆宜，需要良好的体能、坚韧的心理素质及一定的徒步经验。Umbwe 路线的独特之处在于其孤寂感、震撼的景观，以及从头到尾散发出的原始野性氛围。',
    '如果您是经验丰富的徒步者，正在寻找一条人流稀少、攀登迅速的清静路线，Umbwe 路线或许正合您意。尽管难度较大，这条路线会在第二或第三天与 Machame 路线交汇，从而在登顶之夜前提供一定的高原适应机会。',
  ],
  mapImage: {src: '/images/packages/6-days-umbwe-route/hero.jpg', alt: '在 Umbwe 路线露营，背景是乞力马扎罗山顶'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern Circuit 路线 9 天'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Umbwe Gate 至 Umbwe Cave Camp',
      location: 'Umbwe Gate（1,600 米）→ Umbwe Cave Camp（2,850 米）',
      meta: ['爬升高度：1,250 米', '用时：5–6 小时'],
      body: ['您的旅程从莫希短途驱车前往 Umbwe Gate 开始。完成登记后，步道直接进入茂密潮湿的雨林。陡峭的路径穿越树根与苔藓覆盖的山脊迅速攀升，直至抵达 Umbwe Cave Camp——这是您在山上的第一晚。'],
      overnightStay: 'Umbwe Cave Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-camp.jpg', alt: 'Umbwe Cave Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day1-umbwe-cave-2.jpg', alt: 'Umbwe Gate 路标'},
    },
    {
      day: 2,
      label: 'Umbwe Cave 至 Barranco Camp',
      location: 'Umbwe Cave Camp（2,850 米）→ Barranco Camp（3,976 米）',
      meta: ['爬升高度：1,126 米', '用时：4–5 小时'],
      body: ['您将陡峭地爬出森林地带，进入石楠与荒原区域。步道沿岩石山脊逐渐变窄，展现出基博峰与西侧缺口（Western Breach）的壮阔景色。午后不久，您将抵达坐落在高耸 Barranco Wall 脚下的 Barranco Camp。'],
      overnightStay: 'Barranco Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day2-barranco-camp.jpg', alt: 'Barranco Camp 帐篷'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day2-barranco-2.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 3,
      label: '经 Barranco Wall 从 Barranco Camp 至 Karanga Camp',
      location: 'Barranco Camp（3,850 米）→ Barranco Wall（4,200 米）→ Karanga Camp（3,950 米）',
      meta: ['爬升高度：350 米', '下降高度：250 米', '用时：3-4 小时'],
      body: bodyBarrancoWallToKarangaZh,
      overnightStay: 'Karanga Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day3-karanga-camp.jpg', alt: 'Karanga Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day3-karanga-2.jpg', alt: 'Karanga 谷地'},
    },
    {
      day: 4,
      label: 'Karanga Camp 至 Barafu Camp',
      location: 'Karanga Camp（3,950 米）→ Barafu Camp（4,600 米）',
      meta: ['爬升高度：650 米', '用时：3-4 小时'],
      body: bodyKarangaToBarafuZh,
      overnightStay: 'Barafu Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day4-barafu-camp.webp', alt: 'Barafu Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day4-barafu-2.jpg', alt: '通往 Barafu Camp 的步道'},
    },
    {
      day: 5,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      location: 'Barafu Camp（4,600 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
      meta: ['爬升高度：1,295 米', '下降高度：2,785 米', '登顶用时：6-8 小时', '下山用时：6 小时'],
      body: bodySummitToMwekaZh,
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/6-days-umbwe-route/day5-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/6-days-umbwe-route/day5-mweka-2.jpg', alt: 'Mweka Camp 帐篷'},
    },
    {
      day: 6,
      label: 'Mweka Camp 至 Mweka Gate',
      location: 'Mweka Camp（3,110 米）→ Mweka Gate（1,830 米）',
      meta: ['下降高度：1,280 米', '用时：2-3 小时'],
      body: bodyMwekaToGateZh,
      image: {src: '/images/packages/6-days-umbwe-route/day6-mweka-gate.jpg', alt: '在 Mweka Gate 庆祝并领取登顶证书'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: 'Umbwe 路线 6 天常见问题',
  faqs: [
    {
      question: 'Umbwe 路线难度大吗？',
      answer: '是的，由于攀升陡峭、海拔提升迅速，Umbwe 路线被认为是乞力马扎罗最具挑战性的路线之一。它最适合体能状况优秀、经验丰富，并能适应陡峭步道与高海拔环境的徒步者。',
    },
    {
      question: 'Umbwe 路线有什么独特之处？',
      answer: '直接而清静的路径正是 Umbwe 路线的特别之处。它是人流最少的路线，沿途景色震撼，穿越茂密雨林并沿山脊徒步。此外，它还在 Barranco Camp 附近与风景更为秀丽的南部环线交汇，可欣赏到壮丽景色。',
    },
    {
      question: '经由 Umbwe 攀登乞力马扎罗山需要多少天？',
      answer: 'Umbwe 标准行程为 6 天，但部分登山者会选择延长至 7 天，以获得更好的高原适应并提高登顶成功率。',
    },
    {
      question: 'Umbwe 路线 6 天的成功率是多少？',
      answer: '由于海拔提升迅速、缺乏充分的高原适应时间，Umbwe 路线 6 天版本的成功率低于较长路线——通常约为 60%–70%。不过，体能良好、准备充分且具备高海拔经验的登山者往往能够成功登顶。',
    },
    {
      question: 'Umbwe 路线危险吗？',
      answer: '如果方法得当，这条路线并不危险，但相较于其他路线，体力要求更高。主要风险来自快速攀升导致的高原反应。我们高度重视安全，会密切监测所有登山者是否出现急性高原病（AMS）的迹象。',
    },
    {
      question: 'Umbwe 路线提供哪种类型的住宿？',
      answer: '全程住宿均为在指定营地搭建的高山帐篷。我们提供优质睡帐、厚实睡垫，以及配有桌椅的独立餐厅帐篷，确保您的舒适。',
    },
    {
      question: 'Umbwe 攀登套餐包含哪些内容？',
      answer: '我们的套餐包括专业登山向导、背夫、公园门票、露营装备、山上餐食，以及往返酒店的接送服务。国际航班、小费、个人装备及旅舍额外住宿不包含在内。',
    },
    {
      question: '如果我的装备不齐全，可以租赁吗？',
      answer: '可以，我们在莫希或阿鲁沙提供装备租赁服务。睡袋、登山杖、外套及登山靴等物品均可以合理价格租借。我们会在出发前为您提供装备清单。',
    },
    {
      question: 'Umbwe 路线的天气如何？',
      answer: '天气因海拔而异。行程初期为潮湿的雨林气候，中段为寒冷干燥的高山气候，接近山顶时则气温冰冷。请务必准备分层衣物，并做好应对天气骤变的准备。',
    },
    {
      question: '攀登 Umbwe 路线的最佳时间是什么时候？',
      answer: '最佳徒步时间为干季：1 月至 3 月初，以及 6 月至 10 月。这些月份天空最为晴朗，步道状况最佳，天气也最为稳定。',
    },
  ],
  hubSummary: 'Umbwe 路线以其陡峭而富有挑战性的攀登过程，以及壮美却鲜有人涉足的小径而闻名。',
  hubImage: {src: '/images/packages/hub/card-6-days-umbwe.webp', alt: 'Umbwe 路线 6 天'},
}

const northernCircuit9Zh: TripZh = {
  slug: '9-days-northern-circuit-route',
  category: 'package',
  name: 'Northern Circuit 路线 9 天',
  durationDays: 9,
  seoTitle: 'Northern Circuit 路线 9 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: 'Northern Circuit 路线 9 天套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Londorossi Gate、Mti Mkubwa Camp、Shira 1 Camp、Shira 2 Camp、Moir Hut、Buffalo Camp、Third Cave Camp、School Hut、Uhuru Peak、Mweka Camp 及 Mweka Gate',
  priceDisclaimer: '*每人价格包含：专业登山向导、国家公园门票、全程露营住宿、徒步期间的餐食、往返公园大门的接送，以及登顶后在莫希/阿鲁沙的酒店住宿。',
  overviewBody: [
    'Northern Circuit 路线是乞力马扎罗山最新、也最令人兴奋的路线——可以说也是回报最丰厚的一条。它提供无与伦比的 360° 全景视野、更少的人流，以及乞力马扎罗所有路线中最佳的高原适应曲线。这段为期九天的徒步之旅，从山体西侧偏远地带出发，环绕鲜有人涉足的北坡，最终从东侧冲顶。非常适合追求更为沉浸式、更具观赏性体验，且期望获得极高登顶成功率的旅行者。',
    '如果您正在寻找一段更为宁静、远离常规路线、拥有壮丽风光并有充裕时间适应高原的探险，Northern Circuit 正是您的理想之选。',
  ],
  mapImage: {src: '/images/packages/9-days-northern-circuit-route/hero.png', alt: '乞力马扎罗 Northern Circuit 路线地图'},
  gallery: [
    {src: '/images/packages/shared/gallery-generic-1.jpg', alt: '乞力马扎罗山与金合欢草原'},
    {src: '/images/packages/shared/approaching-kilimanjaro.jpg', alt: '登山者踏雪接近山顶'},
    {src: '/images/packages/shared/7-days-machame-route.webp', alt: 'Machame 路线 7 天'},
    {src: '/images/packages/shared/9-days-northern-circuit-1.webp', alt: 'Northern Circuit 路线 9 天'},
    {src: '/images/packages/shared/7-days-rongai-routes-1.webp', alt: 'Rongai 路线 7 天'},
    {src: '/images/packages/shared/6-days-umbwe-route.webp', alt: 'Umbwe 路线 6 天'},
  ],
  itinerary: [
    arrivalZh,
    {
      day: 1,
      label: 'Londorossi Gate – Mti Mkubwa Camp',
      location: 'Londorossi Gate（2,100 米）→ Mti Mkubwa Camp（2,650 米）',
      meta: ['爬升高度：550 米', '用时：3–4 小时'],
      body: ['徒步穿越鸟类与猴群众多的茂密雨林。这短暂的第一天有助于高原适应。'],
      overnightStay: 'Mti Mkubwa Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day1-mti-mkubwa-camp.jpg', alt: 'Mti Mkubwa Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day1-londorossi-gate.jpg', alt: 'Londorossi Gate'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa – Shira 1 Camp',
      location: 'Mti Mkubwa（2,650 米）→ Shira 1 Camp（3,610 米）',
      meta: ['爬升高度：960 米', '用时：5-6 小时'],
      body: ['稳步爬出森林进入荒原地带。沿途可欣赏 Shira 高原与远处梅鲁火山的开阔景色。'],
      overnightStay: 'Shira 1 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-camp.jpg', alt: 'Shira 1 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day2-shira1-2.jpg', alt: 'Shira 高原'},
    },
    {
      day: 3,
      label: 'Shira 1 – Shira 2 Camp',
      location: 'Shira 1 Camp（3,610 米）→ Shira 2 Camp（3,850 米）',
      meta: ['爬升高度：240 米', '用时：4-5 小时'],
      body: ['今天是穿越高海拔高原的轻松一天。随着您穿越火山地貌，将开始感受到这座山的辽阔壮丽。'],
      overnightStay: 'Shira 2 Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-camp.jpg', alt: 'Shira 2 Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day3-shira2-2.jpg', alt: 'Shira 2 Camp 景观'},
    },
    {
      day: 4,
      label: 'Shira 2 – Lava Tower – Moir Hut',
      location: 'Shira 2（3,850 米）→ Lava Tower（4,600 米）→ Moir Hut（4,200 米）',
      meta: ['爬升高度：750 米', '下降高度：400 米', '用时：6–7 小时'],
      body: ['攀升至 Lava Tower 进行高原适应，随后下降至 Moir Hut。这是适应高海拔环境至关重要的一天。'],
      overnightStay: 'Moir Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day4-moir-hut.jpg', alt: 'Moir Hut'},
    },
    {
      day: 5,
      label: 'Moir Hut – Buffalo Camp',
      location: 'Moir Hut（4,200 米）→ Buffalo Camp（4,020 米）',
      meta: ['爬升高度：200 米', '下降高度：380 米', '用时：5-6 小时'],
      body: ['探索未经雕琢的北坡，远眺肯尼亚壮阔景色。这是一段人流稀少、宁静祥和的路段。'],
      overnightStay: 'Buffalo Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day5-buffalo-camp.jpg', alt: 'Buffalo Camp'},
    },
    {
      day: 6,
      label: 'Buffalo Camp – Third Cave Camp',
      location: 'Buffalo Camp（4,020 米）→ Third Cave Camp（3,870 米）',
      meta: ['爬升高度：150 米', '用时：5–6 小时'],
      body: ['向东穿越高山荒漠地形的平缓一天。人流更少，宁静更多。'],
      overnightStay: 'Third Cave Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-camp.jpg', alt: 'Third Cave Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day6-third-cave-2.jpg', alt: 'Third Cave Camp'},
    },
    {
      day: 7,
      label: 'Third Cave Camp – School Hut',
      location: 'Third Cave（3,870 米）→ School Hut（4,750 米）',
      meta: ['爬升高度：880 米', '用时：4–5 小时'],
      body: ['沿愈发荒芜的地貌陡峭攀升。请提早休息，为午夜的登顶冲刺做好准备。'],
      overnightStay: 'School Hut',
      image: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut.jpg', alt: 'School Hut'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day7-school-hut-2.webp', alt: 'School Hut 路标'},
    },
    {
      day: 8,
      label: '登顶日（Uhuru Peak）– Mweka Camp',
      location: 'School Hut（4,750 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,100 米）',
      meta: ['爬升高度：1,145 米', '下降高度：2,795 米', '用时：12–14 小时'],
      body: ['午夜开始攀登。于日出时分抵达 Stella Point，随后登顶 Uhuru Peak。穿越碎石与荒原地带下降至 Mweka Camp。'],
      overnightStay: 'Mweka Camp',
      image: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-camp.jpg', alt: 'Mweka Camp'},
      secondImage: {src: '/images/packages/9-days-northern-circuit-route/day8-mweka-2.jpg', alt: 'Mweka Camp 小屋'},
    },
    {
      day: 9,
      label: 'Mweka Camp 至 Mweka Gate',
      location: 'Mweka Camp（3,110 米）→ Mweka Gate（1,830 米）',
      meta: ['下降高度：1,280 米', '用时：2-3 小时'],
      body: bodyMwekaToGateZh,
      image: {src: '/images/packages/9-days-northern-circuit-route/day9-mweka-gate.jpg', alt: 'Mweka Gate'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: 'Northern Circuit 路线 9 天常见问题',
  faqIntro: '对与我们一起攀登乞力马扎罗山有疑问吗？欢迎查看下方 Northern Circuit 路线常见问题，获取清晰实用的解答。如果没有找到您需要的答案，欢迎随时联系我们——Asili Climbing Kilimanjaro 的登山专家将协助您规划一段安全、成功且难忘的登顶探险。',
  faqs: [
    {
      question: 'Northern Circuit 路线难度如何？',
      answer: '这是一条中等偏高难度的路线，但由于行程较长，在高原适应方面反而是最容易的路线之一。凭借九天的时间，您的身体有充分的机会适应高海拔环境。',
    },
    {
      question: '这条路线与其他路线有何不同？',
      answer: 'Northern Circuit 是乞力马扎罗最长、也最为清静的路线。它环绕鲜有人涉足的北坡，提供壮丽景色以及较高的登顶成功率。',
    },
    {
      question: '在山上待 9 天会不会太长？',
      answer: '完全不会。延长的时间能让海拔逐步提升，实现更好的高原适应，减少高原反应相关问题，从而提高安全抵达 Uhuru Peak 的机会。',
    },
    {
      question: '登顶之夜是什么样的体验？',
      answer: '您将于午夜从 School Hut 出发开始攀登。目标是在日出时分抵达山顶，随后于当天下降至 Mweka Camp——全程共计 12–14 小时的徒步。',
    },
    {
      question: '徒步期间的住宿情况如何？',
      answer: '所有夜晚均在 Asili Climbing Kilimanjaro 提供的高山帐篷中度过。帐篷保暖、防水，并在您抵达营地前由团队搭建完毕。',
    },
    {
      question: '背夫与工作人员是否受到公平对待？',
      answer: '当然。我们遵循乞力马扎罗背夫援助项目（KPAP）的标准，确保所有背夫与团队成员都能获得公平薪酬，并在安全的条件下工作。',
    },
    {
      question: '我需要事先具备徒步经验吗？',
      answer: '不一定需要。您需要具备良好的体能状况与充分的心理准备。我们的向导会根据您的能力调整徒步节奏，确保适当的高原适应。',
    },
    {
      question: 'Northern Circuit 路线的最佳时间是什么时候？',
      answer: '6 月至 10 月，以及 1 月至 3 月初是理想时段。这些月份天空晴朗、降雨较少、步道状况更佳。',
    },
    {
      question: '我会与团队一起攀登吗？',
      answer: '我们提供私人攀登及公开拼团徒步两种选择。您可以在预订时选择自己偏好的方式。',
    },
    {
      question: '如果我出现高原反应会怎样？',
      answer: '您的向导会每日监测您的健康状况。一旦出现症状，我们会立即采取行动——调整节奏、提供氧气支持，或在必要时安排撤离。',
    },
  ],
  hubSummary: '最新、最长的路线，提供 360 度全景视野，登顶成功率也是最高的。',
  hubImage: {src: '/images/packages/hub/card-9-days-northern-circuit.webp', alt: 'Northern Circuit 9 天'},
}

const combo9Zh: TripZh = {
  slug: '9-days-kilimanjaro-safari',
  category: 'combo',
  name: '乞力马扎罗与野生动物园 9 天',
  durationDays: 9,
  seoTitle: '乞力马扎罗与野生动物园 9 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: '乞力马扎罗与野生动物园 9 天组合套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Marangu Gate、Mandara Hut、Horombo Hut、Kibo Hut、Horombo Hut、Marangu Gate、Tarangire 国家公园、Ngorongoro 火山口、Lake Manyara 国家公园',
  overviewBody: [
    '这段为期 9 天的探险，是体验坦桑尼亚精华的终极方式——将沿风景秀丽且相对舒适的 Marangu 路线攀登乞力马扎罗山的刺激，与穿越 Tarangire 国家公园、Ngorongoro 火山口及 Lake Manyara 的经典北线野生动物园之旅完美结合。',
    '无论您是第一次来到坦桑尼亚，还是终于圆了心中多年的梦想，这段旅程都能在体能挑战、震撼风光与近距离的野生动物邂逅之间取得完美平衡，全程由 Asili Climbing Kilimanjaro 团队的专业照料相伴。',
  ],
  mapImage: {src: '/images/combo/9-days-kilimanjaro-safari/marangu-trekkers.jpg', alt: 'Marangu 路线上的徒步者'},
  mapImageIsPhoto: true,
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '乞力马扎罗与野生动物园 9 天'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '乞力马扎罗与野生动物园 9 天'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '乞力马扎罗与野生动物园 9 天'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '乞力马扎罗与野生动物园 9 天'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '乞力马扎罗与野生动物园 9 天'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '乞力马扎罗与野生动物园 9 天'},
  ],
  itinerary: [
    comboArrivalZh(),
    {
      day: 1,
      label: 'Marangu Gate – Mandara Hut',
      meta: ['海拔：1,860 米 → 2,700 米', '爬升高度：840 米', '用时：4–5 小时'],
      body: ['旅程从穿越郁郁葱葱、栖息着黑白疣猴与丰富植被的雨林开始。经过一段稳步攀升后，您将抵达 Mandara Hut，在山上度过第一晚。'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/mandara.jpg', alt: 'Marangu Gate – Mandara Hut'},
      overnightStay: 'Mandara Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/mandara-hut.webp', alt: 'Mandara Hut'},
    },
    {
      day: 2,
      label: 'Mandara Hut – Horombo Hut',
      meta: ['海拔：2,700 米 → 3,720 米', '爬升高度：1,020 米', '用时：6–7 小时'],
      body: ['离开森林后，步道转入石楠与荒原地带。沿途可欣赏基博峰与马文济峰的美景。'],
      image: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: 'Mandara Hut – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 3,
      label: '在 Horombo Hut 进行高原适应',
      meta: ['海拔：3,720 米 → 4,000 米（Zebra Rocks）→ 3,720 米', '爬升高度：280 米', '下降高度：280 米', '用时：2–3 小时（可选徒步）'],
      body: ['这是重要的高原适应日，帮助身体逐步适应海拔。您可以选择前往 Zebra Rocks 进行短途徒步，随后返回 Horombo 用午餐并休息。'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-2.jpeg', alt: '在 Horombo Hut 进行高原适应'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo3.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 4,
      label: 'Horombo Hut – Kibo Hut',
      meta: ['海拔：3,720 米 → 4,703 米', '爬升高度：983 米', '用时：6–7 小时'],
      body: ['今天的徒步穿越高山荒漠地形，前往 Kibo Hut 大本营。请提早休息，为登顶夜做好准备。'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut2.jpg', alt: 'Horombo Hut – Kibo Hut'},
      overnightStay: 'Kibo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/kibo-hut-1.jpg', alt: 'Kibo Hut'},
    },
    {
      day: 5,
      label: 'Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: ['海拔：4,703 米 → 5,895 米（Uhuru Peak）→ 3,720 米', '爬升高度：1,192 米', '下降高度：2,175 米', '用时：12–14 小时'],
      body: ['午夜后不久开始登顶冲刺，抵达 Gilman\'s Point，随后在日出时分登顶 Uhuru Peak。庆祝登顶后，下降至 Horombo Hut 度过最后一晚。'],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Kibo Hut – Uhuru Peak – Horombo Hut'},
      overnightStay: 'Horombo Hut',
      secondImage: {src: '/images/combo/9-days-kilimanjaro-safari/horombo-1.jpg', alt: 'Horombo Hut'},
    },
    {
      day: 6,
      label: 'Horombo Hut – Marangu Gate – 转场',
      meta: ['海拔：3,720 米 → 1,860 米', '下降高度：1,860 米', '用时：5–6 小时'],
      body: ['穿越荒原与雨林下降回到大门。领取登顶证书后，您将被送往酒店。'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/marangu.jpg', alt: 'Horombo Hut – Marangu Gate – 转场'},
      overnightStay: '阿鲁沙酒店（已含）',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: '阿鲁沙酒店（已含）'},
    },
    {
      day: 7,
      label: '阿鲁沙 – Tarangire 国家公园',
      meta: ['车程：自阿鲁沙约 2.5 小时', '亮点：象群与古老猴面包树'],
      body: ['早餐后从阿鲁沙直接驱车前往 Tarangire 国家公园，这里以猴面包树点缀的壮丽景观与庞大的象群而闻名。公园内还栖息着狮子、长颈鹿、斑马、角马及超过 500 种鸟类。经过一整天的游猎后，前往位于 Lake Manyara 或 Karatu 附近的旅馆用晚餐并过夜。'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/Gallery-img07.webp', alt: '阿鲁沙 – Tarangire 国家公园'},
      overnightStay: 'Karatu 或 Lake Manyara 旅馆',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Karatu 或 Lake Manyara 旅馆'},
    },
    {
      day: 8,
      label: 'Ngorongoro 火山口',
      meta: ['车程：至火山口大门 45 分钟至 1 小时', '亮点：在火山口内探寻非洲五霸'],
      body: ['清晨用过早餐后，下降进入令人叹为观止的 Ngorongoro 火山口——这是联合国教科文组织世界遗产，常被誉为「世界第八大奇迹」。这片巨大的火山口是野生动物的庇护所，栖息着大象、狮子、水牛、河马、火烈鸟，以及濒危的黑犀牛。在火山口底享用野餐午餐后，返回旅馆。'],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Ngorongoro 火山口'},
      overnightStay: 'Karatu 同一旅馆',
      secondImage: {src: '/images/combo/shared/Kaliwa-Lodge4.jpg', alt: 'Karatu 同一旅馆'},
    },
    {
      day: 9,
      label: 'Lake Manyara 国家公园 – 阿鲁沙',
      meta: ['车程：返回阿鲁沙约 1.5 小时', '亮点：树栖狮与火烈鸟'],
      body: ['清晨驱车前往 Lake Manyara 国家公园，这里以茂密的地下水林、火烈鸟遍布的湖面以及树栖狮而闻名。这座小巧却生态多样的公园，非常适合作为轻松惬意的最后一次游猎。午餐后返回阿鲁沙，您的野生动物园之旅在此结束。我们也可根据需要将您送往机场搭乘转机航班。'],
      image: {src: '/images/combo/9-days-kilimanjaro-safari/tanzania-safari.jpg', alt: 'Lake Manyara 国家公园 – 阿鲁沙'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: comboFaqHeadingZh,
  faqIntro: comboFaqIntroZh,
  faqs: comboFaqsZh,
  hubSummary: '非常适合时间有限的探险者。以 6 天路线登顶乞力马扎罗山，随后享受为期 3 天的短途野生动物园，游览 Ngorongoro 与 Tarangire 等坦桑尼亚著名公园。',
  hubImage: {src: '/images/combo/9-days-kilimanjaro-safari/8-days-lemosho-route.webp', alt: '乞力马扎罗与野生动物园 9 天'},
}

const combo10Zh: TripZh = {
  slug: '10-days-kilimanjaro-and-safari',
  category: 'combo',
  name: '乞力马扎罗与野生动物园 10 天',
  durationDays: 10,
  seoTitle: '乞力马扎罗与野生动物园 10 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: '乞力马扎罗与野生动物园 10 天组合套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Machame Gate、Machame Camp、Shira Camp、Barranco Camp、Lava Tower、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp、Mweka Gate、Tarangire 国家公园、Ngorongoro 火山口、Lake Manyara 国家公园',
  overviewBody: [
    '这段为期 10 天的探险非常适合希望在攀登乞力马扎罗山的同时，体验经典非洲野生动物园魅力的旅行者——所有精彩都浓缩在一段难忘的旅程中。您将从为期 7 天的 Machame 路线徒步开始，这条路线以壮丽风光与出色的高原适应效果著称。它备受登山者青睐并非没有原因：您将穿越茂密雨林、高海拔荒原及严酷的高山地形，最终登顶非洲最高峰——海拔 5,895 米的 Uhuru Peak。',
  ],
  mapImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/machame.png', alt: '乞力马扎罗与野生动物园 10 天地图'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '乞力马扎罗与野生动物园 10 天'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '乞力马扎罗与野生动物园 10 天'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '乞力马扎罗与野生动物园 10 天'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '乞力马扎罗与野生动物园 10 天'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '乞力马扎罗与野生动物园 10 天'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '乞力马扎罗与野生动物园 10 天'},
  ],
  itinerary: [
    comboArrivalZh(),
    {
      day: 1,
      label: 'Machame Gate 至 Machame Camp',
      meta: ['Machame Gate（1,800 米）→ Machame Camp（3,000 米）', '爬升高度：1,200 米', '用时：6-7 小时'],
      body: ['旅程从莫希出发，驱车 45 分钟抵达 Machame Gate。完成登记后，步道沿蜿蜒的小径穿越茂密雨林——这是全山最潮湿的地带。请留意午后偶尔出现的阵雨，可能使路面湿滑。'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-.jpg', alt: 'Machame Gate 至 Machame Camp'},
      overnightStay: 'Machame Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Machame-Camp.jpg', alt: 'Machame Camp'},
    },
    {
      day: 2,
      label: 'Machame Camp 至 Shira Camp',
      meta: ['Machame Camp（3,000 米）→ Shira Camp（3,840 米）', '爬升高度：840 米', '用时：5-6 小时'],
      body: ['今天以沿山脊陡峭攀升开始，抵达 Picnic Rock——一处极佳的观景点，可俯瞰基博峰与 Shira 高原崎岖的边缘。'],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'Machame Camp 至 Shira Camp'},
      overnightStay: 'Shira Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira Camp'},
    },
    {
      day: 3,
      label: '经 Lava Tower 从 Shira Camp 至 Barranco Camp',
      meta: ['Shira Camp（3,840 米）→ Lava Tower（4,550 米）→ Barranco Camp（3,850 米）', '爬升高度：710 米', '下降高度：700 米', '用时：6-7 小时'],
      body: ['这是充满挑战却至关重要的高原适应日：您将穿越高海拔荒漠地形，抵达高 90 米的 Lava Tower——一座拥有惊人全景视野的火山岩柱。'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lava-Tower.jpg', alt: '经 Lava Tower 从 Shira Camp 至 Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 4,
      label: '经 Barranco Wall 从 Barranco Camp 至 Karanga Camp',
      meta: ['Barranco Camp（3,850 米）→ Barranco Wall（4,200 米）→ Karanga Camp（3,950 米）', '爬升高度：350 米', '下降高度：250 米', '用时：3-4 小时'],
      body: ['今天从令人印象深刻的 Barranco Wall 开始，这段刺激的攀登将以壮丽景色作为回报。'],
      image: {src: '/images/combo/shared/karanga.jpg', alt: '经 Barranco Wall 从 Barranco Camp 至 Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 5,
      label: 'Karanga Camp 至 Barafu Camp',
      meta: ['Karanga Camp（3,950 米）→ Barafu Camp（4,600 米）', '爬升高度：650 米', '用时：3-4 小时'],
      body: ['上午稳步攀升至 Barafu Camp，其斯瓦希里语意为「冰」。这处高海拔营地位于登顶锥体之下的山脊上，标志着乞力马扎罗南部环线的终点，可从多个角度欣赏壮观的山顶景色。'],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'Karanga Camp 至 Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Barafu-Camp.webp', alt: 'Barafu Camp'},
    },
    {
      day: 6,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      meta: ['Barafu Camp（4,600 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）', '爬升高度：1,295 米', '下降高度：2,785 米', '登顶用时：6-8 小时', '下山用时：6 小时'],
      body: ['午夜开始您的最后冲刺。步道陡峭而艰苦，气温远低于冰点。黎明时分，马文济峰后方绚丽的红色日出将持续为您注入动力。'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Uhuru-Peak.webp', alt: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Mweka-Camp.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 7,
      label: 'Mweka Camp 至 Mweka Gate',
      meta: ['Mweka Camp（3,110 米）→ Mweka Gate（1,830 米）', '下降高度：1,280 米', '用时：2-3 小时'],
      body: ['最后的下降穿越茂密雨林，途中还有机会邂逅嬉戏的猴群。'],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: '乞力马扎罗国家公园 Mweka Gate 路标'},
      overnightStay: 'Planet Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/planet-lodge1.jpg', alt: 'Planet Lodge'},
    },
    {
      day: 8,
      label: '阿鲁沙 – Tarangire 国家公园',
      meta: ['车程：自阿鲁沙约 2.5 小时', '亮点：象群与古老猴面包树'],
      body: ['早餐后从阿鲁沙直接驱车前往 Tarangire 国家公园，这里以猴面包树点缀的壮丽景观与庞大的象群而闻名。公园内还栖息着狮子、长颈鹿、斑马、角马及超过 500 种鸟类。经过一整天的游猎后，前往位于 Lake Manyara 或 Karatu 附近的旅馆用晚餐并过夜。'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/h.jpg', alt: '阿鲁沙 – Tarangire 国家公园'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/marera-2.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 9,
      label: 'Ngorongoro 火山口游猎',
      meta: ['车程：至火山口大门 45 分钟至 1 小时', '亮点：在火山口内探寻非洲五霸'],
      body: ['清晨用过早餐后，下降进入令人叹为观止的 Ngorongoro 火山口——这是联合国教科文组织世界遗产，常被誉为「世界第八大奇迹」。这片巨大的火山口是野生动物的庇护所，栖息着大象、狮子、水牛、河马、火烈鸟，以及濒危的黑犀牛。在火山口底享用野餐午餐后，返回旅馆。'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Ngorongoro-Crater.jpg', alt: 'Ngorongoro 火山口游猎'},
      overnightStay: 'Ngorongoro Rhino Lodge',
      secondImage: {src: '/images/combo/10-days-kilimanjaro-and-safari/Rhino-Lodge1.jpeg', alt: 'Ngorongoro Rhino Lodge'},
    },
    {
      day: 10,
      label: 'Lake Manyara 国家公园 – 阿鲁沙',
      meta: ['车程：返回阿鲁沙约 1.5 小时', '亮点：树栖狮与火烈鸟'],
      body: ['清晨驱车前往 Lake Manyara 国家公园，这里以茂密的地下水林、火烈鸟遍布的湖面以及树栖狮而闻名。这座小巧却生态多样的公园，非常适合作为轻松惬意的最后一次游猎。午餐后返回阿鲁沙，您的野生动物园之旅在此结束。我们也可根据需要将您送往机场搭乘转机航班。'],
      image: {src: '/images/combo/10-days-kilimanjaro-and-safari/Lake-Manyara-National-Park.jpg', alt: 'Lake Manyara 国家公园 – 阿鲁沙'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: comboFaqHeadingZh,
  faqIntro: comboFaqIntroZh,
  faqs: comboFaqsZh,
  hubSummary: '一段均衡的探险之旅，将 7 天的乞力马扎罗登顶（如 Machame 路线）与 3 天的野生动物游猎相结合——是同时领略高山与草原精华的理想之选。',
  hubImage: {src: '/images/combo/shared/7-days-machame-route.webp', alt: '乞力马扎罗与野生动物园 10 天'},
}

const combo11Zh: TripZh = {
  slug: '11-days-kilimanjaro-safari',
  category: 'combo',
  name: '乞力马扎罗与野生动物园 11 天',
  durationDays: 11,
  seoTitle: '乞力马扎罗与野生动物园 11 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: '乞力马扎罗与野生动物园 11 天组合套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Londorossi Gate、Mti Mkubwa Camp、Shira 1 Camp、Shira 2 Camp、Lava Tower、Barranco Camp、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp、Mweka Gate、Tarangire、Ngorongoro 火山口、Lake Manyara 国家公园',
  overviewBody: [
    '这段为期 11 天的旅程，将坦桑尼亚两大珍宝融为一体——乞力马扎罗雄伟的山巅，以及其国家公园粗犷而令人难忘的美景。行程包括 8 天 Lemosho 路线徒步——乞力马扎罗风景最壮丽、成功率也最高的路线之一——随后是 3 天经典野生动物园，为您带来挑战、探索与深度亲近自然的独特结合。',
  ],
  mapImage: {src: '/images/combo/11-days-kilimanjaro-safari/lemosho.png', alt: '乞力马扎罗与野生动物园 11 天地图'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '乞力马扎罗与野生动物园 11 天'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '乞力马扎罗与野生动物园 11 天'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '乞力马扎罗与野生动物园 11 天'},
    {src: '/images/combo/shared/9-days-northern-circuit-1.webp', alt: '乞力马扎罗与野生动物园 11 天'},
    {src: '/images/combo/shared/7-days-rongai-routes-1.webp', alt: '乞力马扎罗与野生动物园 11 天'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '乞力马扎罗与野生动物园 11 天'},
  ],
  itinerary: [
    comboArrivalZh(),
    {
      day: 1,
      label: 'Lemosho Gate 至 Mti Mkubwa',
      meta: ['海拔：2,100 米 → 2,650 米', '爬升高度：550 米', '用时：3–4 小时'],
      body: ['早餐后从阿鲁沙驱车前往 Londorossi Gate 办理登记。随后继续前往 Lemosho Gate，徒步穿越茂密雨林由此展开。这片区域野生动物资源丰富，栖息着黑白疣猴与各类森林鸟类。您将穿行于林冠之下，直至抵达 Mti Mkubwa（大树）营地过夜。'],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'Lemosho Gate 至 Mti Mkubwa'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/mti-mkubwa-1.webp', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa Camp 至 Shira 1 Camp',
      meta: ['Mti Mkubwa Camp（2,650 米）– Shira 1 Camp（3,610 米）', '爬升高度：960 米', '用时：6–7 小时'],
      body: ['今天的步道从雨林逐渐攀升，进入石楠与荒原地带。随着海拔上升，树木逐渐稀疏，视野也随之开阔，可欣赏 Shira 山脊与基博峰的壮丽景色。经过一段风光旖旎的徒步，穿越缓坡与火山岩地貌后，您将抵达位于 Shira 高原上的 Shira 1 Camp。'],
      image: {src: '/images/combo/shared/shira.jpg', alt: 'Mti Mkubwa Camp 至 Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.jpg', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'Shira 1 Camp 至 Shira 2 Camp',
      meta: ['Shira 1 Camp（3,610 米）– Shira 2 Camp（3,850 米）', '爬升高度：240 米', '用时：3–4 小时'],
      body: ['这是充满挑战却至关重要的高原适应日：您将穿越高海拔荒漠地形，抵达高 90 米的 Lava Tower——一座拥有惊人全景视野的火山岩柱。'],
      image: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 1 Camp 至 Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: '从 Shira 2 Camp 经 Lava Tower 至 Barranco Camp',
      meta: ['Shira 2 Camp（3,850 米）→ Lava Tower（4,630 米）→ Barranco Camp', '爬升高度：780 米', '下降高度：654 米', '用时：6–7 小时'],
      body: ['稳步攀升至令人震撼的 Lava Tower，在此稍作午间休息。随后下降进入风景秀丽的 Barranco 山谷过夜。这是整段行程中最重要的高原适应日之一。'],
      image: {src: '/images/combo/shared/barranco.jpg', alt: '从 Shira 2 Camp 经 Lava Tower 至 Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'Barranco Camp 至 Karanga Camp',
      meta: ['Barranco Camp（3,976 米）→ Karanga Camp（4,035 米）', '爬升高度：59 米', '用时：4–5 小时'],
      body: ['攀登著名的 Barranco Wall——具有挑战性，但并非技术性攀登。随后继续穿越高山地形前往 Karanga Camp。这一天路程较短，为登顶夜之前的身体提供更充分的高原适应时间。'],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'Barranco Camp 至 Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'Karanga Camp 至 Barafu Camp',
      meta: ['Karanga Camp（4,035 米）→ Barafu Camp（4,703 米）', '爬升高度：668 米', '用时：3–4 小时'],
      body: ['这是一段短促却陡峭的高山荒漠徒步，通往登顶夜前的最后一处营地。请充分休息、补充水分，并为即将到来的挑战做好心理准备。'],
      image: {src: '/images/combo/shared/barafu-to-kilimanjaro.jpg', alt: 'Karanga Camp 至 Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/barafu-camp1.jpg', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: 'Barafu Camp → Uhuru Peak → Mweka Camp',
      meta: ['Barafu Camp（4,703 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,720 米）', '爬升高度：1,192 米', '下降高度：2,175 米', '用时：12–14 小时'],
      body: ['午夜开始登顶冲刺。日出时分抵达 Stella Point，继续前往 Uhuru Peak——非洲最高点。庆祝登顶后，一路下降直至 Mweka Camp。'],
      image: {src: '/images/combo/shared/kilimanjaro-trek.jpg', alt: 'Barafu Camp → Uhuru Peak → Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp → Mweka Gate',
      meta: ['Mweka Camp（3,720 米）→ Mweka Gate（1,640 米）', '下降高度：2,080 米', '用时：3–4 小时'],
      body: ['穿越茂密雨林抵达公园出口，在此领取您的乞力马扎罗登顶证书。司机将送您回酒店，尽情享受热水淋浴与应得的休息。'],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp → Mweka Gate'},
      overnightStay: '阿鲁沙旅馆',
      secondImage: {src: '/images/combo/11-days-kilimanjaro-safari/Kaliwa-Lodge.jpg', alt: '阿鲁沙旅馆'},
    },
    {
      day: 9,
      label: 'Tarangire 国家公园',
      meta: ['车程：自阿鲁沙约 2.5 小时', '亮点：象群与古老猴面包树'],
      body: ['早餐后从阿鲁沙直接驱车前往 Tarangire 国家公园，这里以猴面包树点缀的壮丽景观与庞大的象群而闻名。公园内还栖息着狮子、长颈鹿、斑马、角马及超过 500 种鸟类。经过一整天的游猎后，前往位于 Lake Manyara 或 Karatu 附近的旅馆用晚餐并过夜。'],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/Gallery-img04-1.webp', alt: 'Tarangire 国家公园'},
      overnightStay: 'Karatu 旅馆',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Karatu 旅馆'},
    },
    {
      day: 10,
      label: 'Ngorongoro 火山口',
      meta: ['车程：至火山口大门 45 分钟至 1 小时', '亮点：在火山口内探寻非洲五霸'],
      body: ['清晨用过早餐后，下降进入令人叹为观止的 Ngorongoro 火山口——这是联合国教科文组织世界遗产，常被誉为「世界第八大奇迹」。这片巨大的火山口是野生动物的庇护所，栖息着大象、狮子、水牛、河马、火烈鸟，以及濒危的黑犀牛。在火山口底享用野餐午餐后，返回旅馆。'],
      image: {src: '/images/combo/shared/Serengeti-to-Ngorongoro-Conservation-Area.webp', alt: 'Ngorongoro 火山口'},
      overnightStay: 'Karatu 同一旅馆',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Karatu 同一旅馆'},
    },
    {
      day: 11,
      label: 'Lake Manyara 国家公园 – 阿鲁沙',
      meta: ['车程：返回阿鲁沙约 1.5 小时', '亮点：树栖狮与火烈鸟'],
      body: ['清晨驱车前往 Lake Manyara 国家公园，这里以茂密的地下水林、火烈鸟遍布的湖面以及树栖狮而闻名。这座小巧却生态多样的公园，非常适合作为轻松惬意的最后一次游猎。午餐后返回阿鲁沙，您的野生动物园之旅在此结束。我们也可根据需要将您送往机场搭乘转机航班。'],
      image: {src: '/images/combo/11-days-kilimanjaro-safari/zebra.jpg', alt: 'Lake Manyara 国家公园 – 阿鲁沙'},
    },
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: comboFaqHeadingZh,
  faqIntro: comboFaqIntroZh,
  faqs: comboFaqsZh,
  hubSummary: '这一方案让您有充分时间在 7 天的登顶行程中彻底适应高原，随后于 4 天的野生动物园中放松身心，游览塞伦盖蒂、Ngorongoro 及其他不容错过的公园。',
  hubImage: {src: '/images/combo/shared/6-days-marangu-route.webp', alt: '乞力马扎罗与野生动物园 11 天'},
}

const combo12Zh: TripZh = {
  slug: '12-days-kilimanjaro-safari',
  category: 'combo',
  name: '乞力马扎罗与野生动物园 12 天',
  durationDays: 12,
  seoTitle: '乞力马扎罗与野生动物园 12 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: '乞力马扎罗与野生动物园 12 天组合套餐的真实每日行程、价格与包含服务。',
  stopsLine: 'Londorossi Gate、Mti Mkubwa Camp、Shira 1 Camp、Shira 2 Camp、Lava Tower、Barranco Camp、Karanga Camp、Barafu Camp、Uhuru Peak、Mweka Camp、Mweka Gate、Tarangire 国家公园、塞伦盖蒂国家公园、Ngorongoro 火山口',
  overviewBody: [
    '这段为期 12 天的探险，将风景如画的 Lemosho 路线乞力马扎罗登顶之旅，与穿越 Tarangire、塞伦盖蒂及 Ngorongoro 火山口的完整北线野生动物园相结合。从山体偏远的西侧出发，此次登顶提供更为宁静的起点、多样的生态系统，以及长达 8 天、极为出色的高原适应过程。',
    '登顶挑战结束后，紧接着便是 4 天的游猎体验——您将在 Tarangire 追踪象群与猴面包树，在塞伦盖蒂无垠的草原上花上一整天观察角马大迁徙与大型猫科动物，随后下降进入常被誉为「世界第八大奇迹」的 Ngorongoro 火山口，最终返回阿鲁沙。',
  ],
  mapImage: {src: '/images/combo/12-days-kilimanjaro-safari/lemosho4.png', alt: '乞力马扎罗与野生动物园 12 天地图'},
  gallery: [
    {src: '/images/combo/shared/istockphoto-494601577-612x612-1.jpg', alt: '乞力马扎罗与野生动物园 12 天'},
    {src: '/images/combo/shared/approaching-kilimanjaro.jpg', alt: '乞力马扎罗与野生动物园 12 天'},
    {src: '/images/combo/shared/7-days-machame-route.webp', alt: '乞力马扎罗与野生动物园 12 天'},
    {src: '/images/combo/12-days-kilimanjaro-safari/simba-camp-2.jpg', alt: '乞力马扎罗与野生动物园 12 天'},
    {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro-climb.webp', alt: '乞力马扎罗与野生动物园 12 天'},
    {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '乞力马扎罗与野生动物园 12 天'},
  ],
  itinerary: [
    comboArrivalZh(),
    {
      day: 1,
      label: 'Londorossi Gate 至 Mti Mkubwa Camp',
      meta: ['Lemosho Gate（2,100 米）→ Mti Mkubwa（2,650 米）', '爬升高度：550 米', '用时：3–4 小时'],
      body: ['乞力马扎罗登顶之旅从一段风景优美的驱车前往 Londorossi Gate 开始，在此办理许可与登记手续。从大门出发，短途驱车穿越山地森林抵达 Lemosho 徒步起点。前往 Mti Mkubwa（大树营地）的徒步将带您穿越茂密雨林，这里栖息着蓝猴与丰富的鸟类。'],
      image: {src: '/images/combo/shared/londross-gate.jpg', alt: 'Londorossi Gate 至 Mti Mkubwa Camp'},
      overnightStay: 'Mti Mkubwa Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/mti-mkubwa-camp-scaled.jpg', alt: 'Mti Mkubwa Camp'},
    },
    {
      day: 2,
      label: 'Mti Mkubwa Camp 至 Shira 1 Camp',
      meta: ['Mti Mkubwa（2,650 米）→ Shira 1 Camp（3,610 米）', '爬升高度：960 米', '用时：5-6 小时'],
      body: ['今天将走出森林，进入石楠与荒原地带，稳步攀升至 Shira 山脊，随后略微下降，抵达坐落在 Shira 高原上的营地，可眺望乞力马扎罗上部山坡的景色。'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/kilimanjaro_climbing-1.jpg', alt: 'Mti Mkubwa Camp 至 Shira 1 Camp'},
      overnightStay: 'Shira 1 Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/second-camp.webp', alt: 'Shira 1 Camp'},
    },
    {
      day: 3,
      label: 'Shira 1 Camp 至 Shira 2 Camp',
      meta: ['Shira 1（3,610 米）→ Shira 2 Camp（3,850 米）', '爬升高度：240 米', '用时：3–4 小时'],
      body: ['为帮助高原适应而安排的较短一天，途经风景如画的 Shira 高原。您将在开阔的视野与轻松的节奏中，徒步抵达 Shira 2 Camp。'],
      image: {src: '/images/combo/shared/shira-camp.webp', alt: 'Shira 1 Camp 至 Shira 2 Camp'},
      overnightStay: 'Shira 2 Camp',
      secondImage: {src: '/images/combo/shared/shira-two-1.jpg', alt: 'Shira 2 Camp'},
    },
    {
      day: 4,
      label: '从 Shira 2 Camp 经 Lava Tower 至 Barranco Camp',
      meta: ['Shira 2（3,850 米）→ Lava Tower（4,630 米）→ Barranco Camp（3,976 米）', '爬升高度：780 米', '下降高度：654 米', '用时：6–7 小时'],
      body: ['「高处攀登，低处扎营」——这一关键的高原适应日将带您抵达 Lava Tower 用午餐，随后下降进入绿意盎然的 Barranco 山谷。这是风光不断变换、令人印象深刻的一天。'],
      image: {src: '/images/combo/shared/barranco.jpg', alt: '从 Shira 2 Camp 经 Lava Tower 至 Barranco Camp'},
      overnightStay: 'Barranco Camp',
      secondImage: {src: '/images/combo/shared/Barranco-Camp.jpg', alt: 'Barranco Camp'},
    },
    {
      day: 5,
      label: 'Barranco Camp 至 Karanga Camp',
      meta: ['Barranco（3,976 米）→ Karanga Camp（3,995 米）', '爬升高度：240 米', '下降高度：220 米', '用时：4–5 小时'],
      body: ['征服令人印象深刻的 Barranco Wall——这是徒步旅程中的一大亮点，随后穿越山脊与谷地，最终抵达 Karanga Camp。这又是一个至关重要的高原适应日。'],
      image: {src: '/images/combo/shared/barranco-wall.webp', alt: 'Barranco Camp 至 Karanga Camp'},
      overnightStay: 'Karanga Camp',
      secondImage: {src: '/images/combo/shared/Karanga-Camp.jpg', alt: 'Karanga Camp'},
    },
    {
      day: 6,
      label: 'Karanga Camp 至 Barafu Camp',
      meta: ['Karanga（3,995 米）→ Barafu Camp（4,673 米）', '爬升高度：678 米', '用时：3–4 小时'],
      body: ['穿越高山荒漠攀升，抵达 Barafu——您登顶冲刺的大本营。请充分休息、补充水分，并为午夜出发挑战非洲之巅做好心理准备。'],
      image: {src: '/images/combo/shared/karanga.jpg', alt: 'Karanga Camp 至 Barafu Camp'},
      overnightStay: 'Barafu Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/barafu-camp-1.webp', alt: 'Barafu Camp'},
    },
    {
      day: 7,
      label: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      meta: ['Barafu（4,673 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）', '爬升高度：1,222 米', '下降高度：2,785 米', '用时：12–14 小时'],
      body: ['登顶日！午夜前出发，于日出时分抵达 Stella Point，随后继续前往 Uhuru Peak。庆祝登顶后，下降至 Barafu 稍作休息，随后继续前往 Mweka Camp，享受应得的休整。'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/solo-climb.jpeg', alt: '从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp'},
      overnightStay: 'Mweka Camp',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: 'Mweka Camp'},
    },
    {
      day: 8,
      label: 'Mweka Camp 至 Mweka Gate',
      meta: ['Mweka Camp（3,110 米）→ Mweka Gate（1,640 米）', '下降高度：1,470 米', '用时：3–4 小时'],
      body: ['享受最后一段穿越雨林的徒步。抵达大门后，您将领取登顶证书，并被送往酒店——满载一生难忘的回忆。'],
      image: {src: '/images/combo/shared/mweka-gate-sign.jpg', alt: 'Mweka Camp 至 Mweka Gate'},
      overnightStay: '阿鲁沙酒店',
      secondImage: {src: '/images/combo/shared/mweka-camp-1.jpg', alt: '阿鲁沙酒店'},
    },
    {
      day: 9,
      label: '阿鲁沙 – Tarangire 国家公园',
      meta: ['自阿鲁沙车程约 2.5 小时', '亮点：象群、猴面包树与远离尘嚣的氛围'],
      body: ['在阿鲁沙用过早餐后，您的 Asili 野生动物园向导将陪同您驱车前往 Tarangire 国家公园——坦桑尼亚最被低估的瑰宝之一。这里常因塞伦盖蒂的盛名而被忽视，却以其原始的自然之美、巨大的猴面包树以及惊人的象群密度令游客惊艳。在旱季，Tarangire 河吸引着无数动物前来，带来精彩纷呈的观赏体验。'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/elephant-tara.jpg', alt: '阿鲁沙 – Tarangire 国家公园'},
      overnightStay: 'Marera Valley Lodge',
      secondImage: {src: '/images/combo/shared/Marera1.jpg', alt: 'Marera Valley Lodge'},
    },
    {
      day: 10,
      label: 'Tarangire – 塞伦盖蒂国家公园',
      meta: ['途经 Ngorongoro 高地，车程约 4–5 小时', '亮点：塞伦盖蒂草原与猛兽云集的地貌'],
      body: ['早餐后，旅程继续穿越 Ngorongoro 保护区前往塞伦盖蒂。沿途您将欣赏壮阔全景与马赛村庄，随后经由 Naabi Hill 大门进入公园。入园后，您的塞伦盖蒂游猎正式展开，有机会邂逅大型猫科动物、角马群、长颈鹿等各类野生动物。'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/wildebeest-migration-serengeti.jpg', alt: 'Tarangire – 塞伦盖蒂国家公园'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 11,
      label: '塞伦盖蒂全天游猎',
      meta: ['行程根据动物活动灵活调整', '亮点：全天大型野生动物观赏与猛兽追踪'],
      body: ['清晨早起，在塞伦盖蒂国家公园度过完整的一天进行野生动物观赏，这里以开阔的草原与激烈的捕食者与猎物互动而闻名。向导会根据季节，将您带往动物活动最活跃的区域——无论是 Seronera、Ndutu，还是更北部的区域。您将有机会目睹狮子猎捕水牛、栖息在树上休憩的豹，以及在季节性河流中戏水的象群。'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/lion-serengeti1.jpg', alt: '塞伦盖蒂全天游猎'},
      overnightStay: 'Tukaone Serengeti Camp',
      secondImage: {src: '/images/combo/12-days-kilimanjaro-safari/Tukaone.jpg', alt: 'Tukaone Serengeti Camp'},
    },
    {
      day: 12,
      label: '塞伦盖蒂 – Ngorongoro 火山口 – 阿鲁沙',
      meta: ['全天行程，含火山口下降（总车程 7–8 小时）', '亮点：火山口内非洲五霸与黑犀牛观赏'],
      body: ['清晨用过早餐后，离开塞伦盖蒂，驱车前往 Ngorongoro 火山口——世界上最大且完整无缺的火山破火山口。您将花上一整天探索这座天然圆形剧场，这里栖息着狮子、大象、火烈鸟、豺狼，甚至还有犀牛。在河马塘边享用野餐午餐后，沿路返回，傍晚抵达阿鲁沙。'],
      image: {src: '/images/combo/12-days-kilimanjaro-safari/rhino.jpg', alt: '塞伦盖蒂 – Ngorongoro 火山口 – 阿鲁沙'},
    },
    departureZh,
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: comboFaqHeadingZh,
  faqIntro: comboFaqIntroZh,
  faqs: [
    {
      question: '12 天乞力马扎罗与野生动物园套餐包含哪些内容？',
      answer: '您的套餐包括机场接送、阿鲁沙酒店住宿、全程向导陪同的乞力马扎罗登顶（含公园门票、背夫、帐篷、餐食及持证登山向导），以及一段为期 4 天的私人野生动物游猎，包含公园门票、旅馆住宿、餐食、4×4 游猎车及专业向导。国际航班、小费及个人开支不包含在内。',
    },
    {
      question: '12 天时间是否足够同时体验乞力马扎罗与野生动物园？',
      answer: '是的，12 天是理想的时长。您将有 7 到 8 天的时间安全登顶乞力马扎罗（经由 Lemosho 或 Machame 等路线），随后进行一段 4 天的野生动物园，游览塞伦盖蒂、Ngorongoro 火山口及 Tarangire 等坦桑尼亚最著名的公园。这样，您可以在一次探险中，同时领略高山与野生动物的精华。',
    },
    {
      question: '这段 12 天旅程的最佳时间是什么时候？',
      answer: '最佳月份为 1 月至 3 月初，以及 6 月至 10 月，此时乞力马扎罗登顶与野生动物观赏的条件均十分理想。这些是坦桑尼亚的旱季，天空更为晴朗，动物观赏效果也更佳。',
    },
    {
      question: '乞力马扎罗登顶的体能要求高吗？',
      answer: '攀登乞力马扎罗属于非技术性徒步，但由于海拔较高，对体能仍有一定要求。良好的体能状态、坚定的心理准备，以及充分的高原适应（我们通过 Lemosho 等较长路线来确保）是登顶成功的关键。无需具备此前的登山经验。',
    },
    {
      question: '如果我缺少装备，可以租赁乞力马扎罗所需的装备吗？',
      answer: '可以。Asili Climbing Kilimanjaro 提供优质租赁装备，包括睡袋、羽绒服、登山杖、头灯等。我们会提供完整的装备清单建议，您也可以提前预订所需的租赁物品。',
    },
    {
      question: '野生动物园期间的住宿是怎样的？',
      answer: '我们精心挑选了旅馆与帐篷营地，均干净舒适，且靠近公园，便于最大程度地观赏野生动物。无论是中端还是豪华选择，均配有独立卫浴、优质餐饮及热情周到的服务。',
    },
    {
      question: '我会与团队一起出行，还是私人行程？',
      answer: '我们大多数乞力马扎罗与野生动物园组合行程均为私人定制之旅，专为您或您的团队量身打造。这样能在节奏安排、个性化关怀以及登山与游猎的整体体验上，拥有更大的灵活性。',
    },
    {
      question: '高原反应常见吗？你们如何应对？',
      answer: '无论体能状况如何，高原反应都可能发生在任何人身上。我们每天使用血氧仪监测您在山上的健康状况，并配备经过高原急救培训的经验丰富向导。较长的行程安排（如 8 天 Lemosho 路线）有助于提升高原适应效果与登顶成功率。若遇严重情况，我们也备有紧急撤离方案。',
    },
    {
      question: '登顶及野生动物园期间提供什么样的餐食？',
      answer: '在乞力马扎罗山上，我们的高山厨师每日准备热腾腾、营养丰富的餐食——包括汤品、米饭、意面、蔬菜、肉类菜肴及水果。我们也能满足素食及特殊饮食需求。在野生动物园期间，旅馆提供自助餐或单点式餐食，涵盖非洲及国际风味。',
    },
    {
      question: '我需要购买旅行保险吗？',
      answer: '是的，购买全面的旅行保险是必需的。您的保单应涵盖医疗紧急情况、撤离（包括高海拔撤离）、行程取消及延误。如有需要，我们也可以为您推荐信誉良好的保险公司。',
    },
    {
      question: '我应该如何为这段旅程做体能准备？',
      answer: '建议在出发前 8 至 12 周开始训练计划，包括有氧运动、负重徒步以及力量训练。周末徒步和长距离、有高度落差的步行，能帮助您的腿部与肺部为乞力马扎罗的挑战做好准备。',
    },
    {
      question: '如何在 Asili Climbing Kilimanjaro 预订这段 12 天的行程？',
      answer: '预订非常简单！通过我们的官网或 WhatsApp 联系我们，我们的专家团队将协助您量身定制乞力马扎罗与野生动物园之旅。支付 20%–30% 的定金即可确认您的名额，从预订到抵达坦桑尼亚，我们将全程为您提供协助。',
    },
  ],
  hubSummary: '为自然爱好者打造的完整体验。用 8 天时间登顶非洲最高峰（如 Lemosho 路线），随后享受 4 天令人难忘的野生动物观赏之旅。',
  hubImage: {src: '/images/combo/shared/6-days-umbwe-route.webp', alt: '乞力马扎罗与野生动物园 12 天'},
}

// ---------------------------------------------------------------------------
// 2 standalone safaris
// ---------------------------------------------------------------------------

const sharedSafariDaysZh = (): SafariDayZh[] => [
  {
    day: 1,
    label: '阿鲁沙 - Tarangire 国家公园',
    image: {src: '/images/safari/shared/elephant-tara.jpg', alt: '阿鲁沙 - Tarangire 国家公园'},
    body: [
      [{text: '早餐后：', bold: true}, {text: ' 我们的野生动物园向导将从您在阿鲁沙市区的酒店接您，随后驱车约 120 公里、近 2 小时前往 Tarangire 国家公园。'}],
      [{text: 'Tarangire 国家公园：', bold: true}, {text: ' Tarangire 国家公园以大批自由漫步于 Tarangire 河沿岸的象群而闻名——这是坦桑尼亚家庭野生动物园的真正象征，此外还栖息着众多其他动物。我们将穿越季节性沼泽（湿地）、稀树草原及 Tarangire 河，这些区域在公园生态系统中扮演着重要角色，并在旱季吸引大量动物聚集。'}],
      [{text: '野生动物观赏：', bold: true}, {text: ' 我们将尽可能多地探寻各类动物，包括狮子、斑马、猫鼬、土豚、角马、水牛及长颈鹿（仅举几例）。运气好的话，我们还有机会瞥见狮子与豹的踪影。'}],
      [{text: '野餐与游猎：', bold: true}, {text: ' 我们专业且经验丰富的野生动物园向导将挑选合适的野餐地点，在指定休息区为您提供美味午餐。随后继续游猎，直至傍晚时分。'}],
      [{text: '傍晚转场：', bold: true}, {text: ' 傍晚时分，您将被送往我们精心挑选的合作酒店，享用晚餐并过夜。'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
  {
    day: 2,
    label: '塞伦盖蒂国家公园',
    image: {src: '/images/safari/shared/lake-manyara.webp', alt: '塞伦盖蒂国家公园'},
    body: [
      [
        {
          text: '早餐后，您将启程前往塞伦盖蒂国家公园无垠的草原，途中在 Ngorongoro 观景点可远眺 Ngorongoro 火山口，随后继续前往塞伦盖蒂国家公园（预计下午抵达）。我们专业且经验丰富的野生动物园向导会选择合适的时机，让您在壮丽景色中享用美味午餐并小酌香槟。',
        },
      ],
      [
        {
          text: '塞伦盖蒂国家公园以其丰富多样的本土野生动物而闻名，包括「非洲五霸」——因其是猎人最为追寻的五种标志性猎物而得名。由于此地猎物资源丰富，塞伦盖蒂被认为拥有非洲最大的狮群数量（约 2,950 头）。',
        },
      ],
      [{text: '性情羞怯的豹常见于 Seronera 地区，但整个公园范围内都能觅得其踪迹。据估计，其数量约为 1,000 只。'}],
      [{text: '可选游猎活动：', bold: true}, {text: ' 塞伦盖蒂热气球之旅（每人 600 美元）'}],
      [{text: '游猎结束后，前往住宿地点享用晚餐并过夜。'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
  {
    day: 3,
    label: '塞伦盖蒂国家公园',
    image: {src: '/images/safari/shared/honeymoon1.jpg', alt: '塞伦盖蒂国家公园'},
    body: [
      [
        {
          text: '早餐后，您将启程前往塞伦盖蒂国家公园无垠的草原，途中在 Ngorongoro 观景点可远眺 Ngorongoro 火山口，随后继续前往塞伦盖蒂国家公园（预计下午抵达）。我们专业且经验丰富的野生动物园向导会选择合适的时机，让您在壮丽景色中享用美味午餐并小酌香槟。',
        },
      ],
      [
        {
          text: '塞伦盖蒂国家公园以其丰富多样的本土野生动物而闻名，包括「非洲五霸」——因其是猎人最为追寻的五种标志性猎物而得名。由于此地猎物资源丰富，塞伦盖蒂被认为拥有非洲最大的狮群数量（约 2,950 头）。',
        },
      ],
      [{text: '性情羞怯的豹常见于 Seronera 地区，但整个公园范围内都能觅得其踪迹。据估计，其数量约为 1,000 只。'}],
      [{text: '可选游猎活动：', bold: true}, {text: ' 塞伦盖蒂热气球之旅（每人 600 美元）'}],
      [{text: '游猎结束后，前往住宿地点享用晚餐并过夜。'}],
    ],
    overnightStay: 'Serengeti Heritage Camp',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
  {
    day: 4,
    label: '塞伦盖蒂国家公园 / Ngorongoro 火山口',
    image: {src: '/images/safari/shared/h.jpg', alt: '塞伦盖蒂国家公园 / Ngorongoro 火山口'},
    body: [
      [{text: '早餐后，携带野餐午餐从营地出发前往 Ngorongoro 火山口。该区域位于阿鲁沙以西，坐落于坦桑尼亚地质火山口高地范围内。'}],
      [
        {
          text: '抵达火山口边缘时，您将初步领略次日在开阔草原上将见到的景象，以及大量您在国家地理纪录片中熟悉的动物。在火山口内，视运气而定，有很大机会集齐「非洲五霸」（狮子、豹、大象、水牛与犀牛）。',
        },
      ],
      [{text: '下午，午餐将在专设的野餐地点为您供应，随后进行下午游猎，直至傍晚时分。晚餐与住宿安排在旅馆内。'}],
      [{text: '可选游猎活动：', bold: true}],
      [{text: '参观 Olduvai 峡谷及博物馆（每人 40 美元）'}],
      [{text: 'Ngorongoro 火山口边缘徒步游猎（每人 30 美元）'}],
      [{text: '参观马赛村庄（每车 50 美元）'}],
    ],
    overnightStay: 'Ngorongoro Rhino Lodge',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
  {
    day: 5,
    label: 'Ngorongoro 火山口',
    image: {src: '/images/safari/shared/ngorongoro.jpg', alt: 'Ngorongoro 火山口'},
    body: [
      [
        {
          text: '清晨用过早餐后，下降进入令人叹为观止的 Ngorongoro 火山口——这是联合国教科文组织世界遗产，常被誉为「世界第八大奇迹」。这片巨大的火山口是野生动物的庇护所，栖息着大象、狮子、水牛、河马、火烈鸟，以及濒危的黑犀牛。',
        },
      ],
      [{text: '在火山口底享用野餐午餐，随后返回旅馆过夜。'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
  {
    day: 6,
    label: 'Lake Manyara 国家公园',
    image: {src: '/images/safari/shared/manyara.jpg', alt: 'Lake Manyara 国家公园'},
    body: [
      [
        {
          text: '早餐后，您将从旅馆出发，驱车前往 Lake Manyara 国家公园（约 30 分钟）。这座公园是摄影爱好者的绝佳去处，提供世界一流的野生动物观赏体验。您可以邂逅许多非洲最富盛名的动物，其中独特的树栖狮堪称完美的拍摄对象。这些标志性的猛兽悠然栖息于金合欢树上，仿佛专为镜头而生。',
        },
      ],
      [
        {
          text: '观鸟爱好者同样能在 Lake Manyara 找到理想之地，公园内鸟类种类极为丰富。观鸟者还可期待邂逅成群的火烈鸟、盘旋的猛禽，以及色彩绚丽的紫胸佛法僧。',
        },
      ],
      [{text: '午餐将在公园的野餐点供应，下午返回阿鲁沙。'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
  {
    day: 7,
    label: 'Lake Manyara 国家公园',
    image: {src: '/images/safari/shared/e7636d2be5e1edef3f8c3756db7fe4d5df583879-1600x1067-1-1.jpg', alt: 'Lake Manyara 国家公园'},
    body: [
      [
        {
          text: '早餐后，您将从旅馆出发，驱车前往 Lake Manyara 国家公园（约 30 分钟）。这座公园是摄影爱好者的绝佳去处，提供世界一流的野生动物观赏体验。您可以邂逅许多非洲最富盛名的动物，其中独特的树栖狮堪称完美的拍摄对象。这些标志性的猛兽悠然栖息于金合欢树上，仿佛专为镜头而生。',
        },
      ],
      [
        {
          text: '观鸟爱好者同样能在 Lake Manyara 找到理想之地，公园内鸟类种类极为丰富。观鸟者还可期待邂逅成群的火烈鸟、盘旋的猛禽，以及色彩绚丽的紫胸佛法僧。',
        },
      ],
      [{text: '午餐将在公园的野餐点供应，下午返回阿鲁沙。'}],
    ],
    overnightStay: 'Tulia Boutique Hotel',
    accommodationTiers: ['经济型', '中端', '豪华型'],
  },
]

const safari15Zh: SafariZh = {
  slug: '15-days-tanzania-safari',
  name: '坦桑尼亚野生动物园 15 天',
  durationDays: 15,
  seoTitle: '坦桑尼亚野生动物园 15 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: '坦桑尼亚野生动物园 15 天的真实每日行程、价格与包含服务。',
  stopsLine: 'Tarangire 国家公园、塞伦盖蒂国家公园、Ngorongoro 火山口、Lake Manyara 国家公园、桑给巴尔',
  overviewBody: [
    '这段为期 15 天的坦桑尼亚野生动物园，将经典北线游猎——Tarangire、塞伦盖蒂、Ngorongoro 火山口与 Lake Manyara——与桑给巴尔海滩的悠长假期相结合，让您在同一趟旅程中，既能尽享深度野生动物园之旅，又能享受一段惬意的海岛度假时光。',
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: '北线野生动物园路线地图'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: '塞伦盖蒂角马大迁徙'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: '坦桑尼亚马赛文化'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: '斑马在水塘边饮水'},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: '野生动物园中的长颈鹿'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: '豪华野生动物园旅馆'},
  ],
  itinerary: [
    ...sharedSafariDaysZh(),
    {
      day: 8,
      label: '抵达桑给巴尔',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: '抵达桑给巴尔'},
      body: [[{text: '从阿鲁沙飞往桑给巴尔，转场至您的海滩酒店，余下时间可自由安排，尽情在印度洋畔放松身心。'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['经济型', '中端', '豪华型'],
    },
    {
      day: 9,
      label: '桑给巴尔',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: '桑给巴尔'},
      body: [[{text: '在桑给巴尔度过自由的一天，尽情享受沙滩时光，或通过您的酒店安排前往石头城、香料农场或浮潜的可选行程。'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['经济型', '中端', '豪华型'],
    },
    {
      day: 10,
      label: '桑给巴尔海滩延伸假期（第 10–14 天）',
      body: [[{text: '在桑给巴尔的海滩上度过五天宁静的休闲时光，您可以自由安排时间探索石头城蜿蜒的街巷，参加可选的香料农场之旅，或在近海浮潜——一切以您自己的节奏进行，全程入住同一家海滩酒店。'}]],
      overnightStay: 'Tulia Boutique Hotel',
    },
    {
      day: 15,
      label: '离境',
      body: [[{text: '转送机场搭乘返程航班——您的坦桑尼亚野生动物园与桑给巴尔之旅至此圆满结束。'}]],
    },
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: comboFaqHeadingZh,
  faqIntro: comboFaqIntroZh,
  faqs: [safariExpectFaqZh, ...sharedSafariFaqsZh],
}

const safari10HoneymoonZh: SafariZh = {
  slug: '10-days-tanzania-luxury-honeymoon-safaris',
  name: '坦桑尼亚豪华蜜月野生动物园 10 天',
  durationDays: 10,
  seoTitle: '坦桑尼亚豪华蜜月野生动物园 10 天 | Climbing Kilimanjaro Tanzania',
  seoDescription: '坦桑尼亚豪华蜜月野生动物园 10 天的真实每日行程、价格与包含服务。',
  stopsLine: 'Tarangire 国家公园、塞伦盖蒂国家公园、Ngorongoro 火山口、Lake Manyara 国家公园、桑给巴尔',
  overviewBody: [
    '这段为期 10 天的坦桑尼亚豪华野生动物园之旅，旨在为您带来终生难忘的体验——从当地丰富多元的文化，到野生动物，再到令人惊叹的壮丽风光——涵盖穿越 Tarangire 国家公园、塞伦盖蒂、Lake Manyara 与 Ngorongoro 火山口的经典北线游猎，随后在桑给巴尔的海滩享受悠闲假期。',
  ],
  mapImage: {src: '/images/safari/shared/ss.png', alt: '北线野生动物园路线地图'},
  gallery: [
    {src: '/images/safari/shared/wildebeest-migration-serengeti.jpg', alt: '塞伦盖蒂角马大迁徙'},
    {src: '/images/safari/shared/masai-culture-tanzania.webp', alt: '坦桑尼亚马赛文化'},
    {src: '/images/safari/shared/zebras-waterhole.webp', alt: '斑马在水塘边饮水'},
    {src: '/images/safari/shared/giraffe-7924549_1920.jpg', alt: '野生动物园中的长颈鹿'},
    {src: '/images/safari/shared/luxury-safari-lodge.jpg', alt: '豪华野生动物园旅馆'},
  ],
  itinerary: [
    ...sharedSafariDaysZh(),
    {
      day: 8,
      label: '抵达桑给巴尔',
      image: {src: '/images/safari/shared/zanzibar-honeymoon.jpg', alt: '抵达桑给巴尔'},
      body: [[{text: '从阿鲁沙飞往桑给巴尔，转场至您的海滩酒店，余下时间可自由安排，尽情在印度洋畔放松身心。'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['经济型', '中端', '豪华型'],
    },
    {
      day: 9,
      label: '桑给巴尔',
      image: {src: '/images/safari/shared/zanzibar5.jpg', alt: '桑给巴尔'},
      body: [[{text: '在桑给巴尔度过自由的一天，尽情享受沙滩时光，或通过您的酒店安排前往石头城、香料农场或浮潜的可选行程。'}]],
      overnightStay: 'Tulia Boutique Hotel',
      accommodationTiers: ['经济型', '中端', '豪华型'],
    },
    {
      day: 10,
      label: '离境',
      body: [[{text: '转送机场搭乘返程航班——您的坦桑尼亚蜜月野生动物园之旅至此圆满结束。'}]],
    },
  ],
  includes: includesVariantBZh,
  excludes: excludesVariantBZh,
  faqHeading: comboFaqHeadingZh,
  faqIntro: comboFaqIntroZh,
  faqs: [safariExpectFaqZh, ...sharedSafariFaqsZh],
}

async function run() {
  await seedTripZh(machame7Zh)
  await seedTripZh(machame6Zh)
  await seedTripZh(marangu5Zh)
  await seedTripZh(marangu6Zh)
  await seedTripZh(lemosho7Zh)
  await seedTripZh(lemosho8Zh)
  await seedTripZh(lemosho9Zh)
  await seedTripZh(rongai7Zh)
  await seedTripZh(rongai6Zh)
  await seedTripZh(umbwe6Zh)
  await seedTripZh(northernCircuit9Zh)
  await seedTripZh(combo9Zh)
  await seedTripZh(combo10Zh)
  await seedTripZh(combo11Zh)
  await seedTripZh(combo12Zh)
  await seedSafariZh(safari15Zh)
  await seedSafariZh(safari10HoneymoonZh)
  console.log('done — all 17 trips seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
