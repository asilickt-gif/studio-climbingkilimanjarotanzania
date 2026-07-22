/**
 * Phase 6 (Chinese): the 6 remaining guide articles (mount-kilimanjaro was
 * already seeded separately in seed-zh-articles-misc.ts).
 * Mirrors seed-it-guide-articles.ts's structure but with Chinese text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-guide-articles.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

interface TableZh {
  columns: string[]
  rows: string[][]
}
interface SectionZh {
  heading: string
  body?: string
  table?: TableZh
}
interface FaqZh {
  question: string
  answer: string
}
interface GuideArticleZh {
  slug: string
  seoTitle: string
  seoDescription: string
  heading: string
  heroImage?: {src: string; alt: string}
  intro: string
  sections: SectionZh[]
  faqHeading?: string
  faqs?: FaqZh[]
}

function tableToDoc(table?: TableZh) {
  if (!table) return undefined
  return {_type: 'dataTable', columns: table.columns, rows: table.rows.map((cells) => ({_type: 'tableRow', _key: key(), cells}))}
}

async function seedGuideArticleZh(data: GuideArticleZh) {
  const enId = await findEnId(client, 'article', data.slug)
  if (!enId) {
    console.log(`SKIP ${data.slug}: no en source found`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    heading: data.heading,
    ...(data.heroImage ? {topImage: await uploadImage(client, data.heroImage)} : {}),
    intro: data.intro,
    sections: data.sections.map((section) => ({
      _type: 'articleSection',
      _key: key(),
      heading: section.heading,
      ...(section.body ? {body: stringToPt(section.body)} : {}),
      ...(tableToDoc(section.table) ? {table: tableToDoc(section.table)} : {}),
    })),
    ...(data.faqHeading ? {faqHeading: data.faqHeading} : {}),
    ...(data.faqs?.length ? {faqs: data.faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer}))} : {}),
  }
  const zhId = await upsertTranslatedDoc(client, 'article', data.slug, 'zh', fields)
  await linkTranslationMetadata(client, 'article', [
    {language: 'en', id: enId},
    {language: 'zh', id: zhId},
  ])
  console.log(`${data.slug}-zh done (${zhId})`)
}

const kilimanjaroClimbingSeasonsZh: GuideArticleZh = {
  slug: 'kilimanjaro-climbing-seasons',
  seoTitle: '攀登乞力马扎罗的最佳月份 | 天气指南',
  seoDescription: '攀登乞力马扎罗按月份划分的天气指南：最佳月份、旱季、应避开的月份，以及专家的时间安排建议。',
  heading: '攀登乞力马扎罗的最佳月份',
  intro:
    '攀登乞力马扎罗的最佳月份是旱季期间，即1月至3月，以及6月至10月。这些时段天空晴朗，步道更为干燥，带来更为理想的徒步条件。若想在良好天气与较少人流之间取得平衡，可考虑在1月、2月或10月登山。',
  sections: [
    {
      heading: '攀登乞力马扎罗的最佳月份：终极天气指南',
      body: '乞力马扎罗路线是徒步者用来抵达非洲最高峰 Uhuru Peak（5,895米）山顶的官方指定步道。选择正确的乞力马扎罗登山路线，是您规划徒步行程时最重要的决定之一。每条路线在风光、难度、高原适应曲线、成功率及整体体验上都各不相同。',
    },
    {
      heading: '为什么攀登乞力马扎罗的最佳月份如此重要',
      body: '乞力马扎罗的气候在潮湿雨林与北极般的山顶之间摆动——选择攀登乞力马扎罗的最佳月份会影响步道状况、急性高原反应的风险以及景观视野。旱季（1-3月、6-10月）步道稳定、景色清晰，而雨季（4-5月、11月）则带来泥泞与浓雾。我们的向导建议在旺季选择7天或更长的路线，以获得最佳的高原适应效果。选择过渡季节则可节省10%至20%的费用，同时依然享有良好的天气。',
    },
    {
      heading: '逐月分析：攀登乞力马扎罗的最佳月份——天气指南',
      body: '以下是攀登乞力马扎罗最佳月份的详细概览，包括总体评分、天气、人流及路线建议。',
      table: {
        columns: ['时间段', '总体评分', '天气', '人流', '推荐路线'],
        rows: [
          ['1月16日-2月28日', '极佳', '气温适宜，中等降水，云量较少', '中等', '所有路线开放'],
          ['3月1日-3月31日', '不稳定', '气温适宜，降雨降雪风险上升，低海拔云层密集', '较低', '偏向 Rongai 路线，尤其是月末'],
          ['4月1日-6月15日', '艰难且危险', '气温适宜，降水强烈，有降雪风险，低海拔云层密集', '很低', '所有路线均具挑战性'],
          ['6月16日-7月15日', '不稳定', '寒冷刺骨，山顶有冰雪，降水减少，能见度提升', '中等', '偏向 Rongai 路线，尤其是月初'],
          ['7月16日-8月31日', '良好', '寒冷刺骨，山顶有冰雪，降水稀少，通常晴朗', '较高', '所有路线开放'],
          ['9月1日-10月15日', '非常好', '气温适宜，降水稀少，通常晴朗', '较高', '所有路线开放'],
          ['10月16日-10月31日', '不稳定', '气温适宜，降雨风险上升，能见度降低', '中等', '偏向 Rongai 路线，尤其是月末'],
          ['11月1日-12月15日', '艰难且危险', '气温降低，中等降雨降雪，雷暴天气', '较低', '所有路线均具挑战性'],
          ['12月16日-次年1月15日', '不稳定', '气温降低，中等降雨降雪，低海拔云层密集', '很高', '偏向 Rongai 路线，尤其是月初'],
        ],
      },
    },
    {heading: '攀登乞力马扎罗的最佳时段：聚焦旱季'},
    {heading: '1月至3月初（短旱季）', body: '天气温暖晴朗，降雨稀少——非常适合欣赏美景并享受舒适体验。'},
    {heading: '6月末至10月（长旱季）', body: '乞力马扎罗的黄金时代：步道干燥，空气清新，景色壮丽。'},
    {
      heading: '过渡季节：最佳月份之外的可行选择',
      body: '11月（周期末尾的降雨）与12月（假期人流）提供过渡性天气——搭配 Rongai 或 Northern Circuit 路线，可减少泥泞困扰。',
    },
    {
      heading: '应避开的月份：乞力马扎罗艰难的天气条件',
      body: '3月末至5月（大雨季）以及11月（小雨季）呈现最为艰难的条件——强降雨、步道湿滑及浓雾弥漫。',
    },
    {
      heading: '在乞力马扎罗最佳月份登山的关键建议',
      body: '路线选择：过渡/旱季初期偏向 Rongai；旺季则所有路线均开放。满月：请提前预订以获得登顶时的绝佳视野——虽然人多，但充满魔力。天气多变：请携带分层衣物；山顶始终低于冰点。费用影响：旱季价格上涨10-20%；过渡季节则有折扣优惠。',
    },
  ],
  faqHeading: '关于攀登乞力马扎罗最佳月份的常见问题',
  faqs: [
    {question: '攀登乞力马扎罗的最佳月份是什么时候？', answer: '9月或2月——干燥、晴朗，人流适中。'},
    {question: '攀登乞力马扎罗的最佳月份有哪些？', answer: '1月至3月及6月至10月，天气最为理想。'},
    {question: '可以在雨季攀登乞力马扎罗吗？', answer: '可以，但风险更高——建议选择过渡季节作为折中方案。'},
    {question: '攀登乞力马扎罗的最佳时间会影响费用吗？', answer: '会——旺季费用大约增加20%；淡季则可节省开支。'},
  ],
}

const whatIsTheBestRouteUpKilimanjaroZh: GuideArticleZh = {
  slug: 'what-is-the-best-route-up-kilimanjaro',
  seoTitle: '攀登乞力马扎罗的最佳路线是什么？| 完整指南',
  seoDescription: '关于乞力马扎罗7条登山路线的完整指南：成功率、徒步距离，以及如何为您的登山之旅选择最佳路线。',
  heading: '乞力马扎罗路线',
  intro:
    '攀登乞力马扎罗共有七条成熟路线，一条从北侧出发，其余则从南侧出发：Northern Circuit、Lemosho、Shira、Machame（「威士忌」路线）、Rongai、Marangu（「可口可乐」路线）及 Umbwe。Northern Circuit 是最新开发的路线，几乎环绕整座山体，带来真正的荒野体验及360度全景视野。Lemosho 与 Shira 路线从西侧进入，而 Rongai 路线则从北侧出发。',
  sections: [
    {
      heading: '乞力马扎罗路线：乞力马扎罗登山路线完整指南',
      body: '乞力马扎罗路线是徒步者用来抵达非洲最高峰 Uhuru Peak（5,895米）山顶的官方指定步道。选择正确的乞力马扎罗登山路线，是您规划徒步行程时最重要的决定之一。每条路线在风光、难度、高原适应曲线、成功率及整体体验上都各不相同。',
    },
    {heading: '攀登乞力马扎罗共有多少条路线？', body: '攀登乞力马扎罗共有7条主要路线：Northern Circuit、Lemosho、Shira、Machame、Rongai、Marangu 及 Umbwe。'},
    {heading: '选择乞力马扎罗登山路线时需考虑的因素', body: '要为自己选择最佳的乞力马扎罗路线，需要考虑许多变量。'},
    {heading: '谁：', body: '谁将登山？在选择路线时，必须考虑整个团队的能力。团队中是否有初学者？是否有从未去过高海拔地区的成员？请选择适合所有人的路线。'},
    {heading: '什么：', body: '您登山的限制条件是什么？预算是否有限？行程天数是否有限制？不同路线的费用与时长各不相同，有的更贵，有的更便宜；有的更长，有的更短。请明确自己的预算及愿意花在这座山上的天数。'},
    {heading: '如何：', body: '您如何设想自己的徒步之旅？您想要最具挑战性的路线，还是相对轻松的路线？乞力马扎罗可能带来不小的不适与艰辛。有些路线相较其他路线更为温和。'},
    {heading: '何处：', body: '您希望从哪里开始登山？各条路线从山体的四面八方出发。您的起点会影响费用、风光及其多样性。'},
    {heading: '为何：', body: '您为何登山？登顶对您来说是否至关重要？那就选择成功率高的路线。您想拍出最美的照片？那就选择风景秀丽的路线。您只是想亲身体验一番？那就选择快速经济的路线。'},
    {heading: '何时：', body: '您计划何时登山？如果是在旱季登山，那非常理想。但如果是在雨季或过渡季节登山，所选路线可能会影响登山的难度。节假日及满月前后的登山活动尤为热门。'},
    {
      heading: '攀登乞力马扎罗的最佳路线是什么？',
      body: '最适合乞力马扎罗的路线取决于您的优先考虑：若追求最高成功率，请选择 Northern Circuit 或 Lemosho。若看重风光，请选择 Lemosho 或 Machame。若考虑预算与时间，请选择 Marangu。若寻求挑战，请选择 Umbwe。',
    },
    {
      heading: '乞力马扎罗路线地图及徒步距离',
      body: '总徒步距离因路线而异。',
      table: {columns: ['路线', '总距离'], rows: [['Lemosho', '70公里'], ['Machame', '62公里'], ['Marangu', '64公里'], ['Northern Circuit', '96公里'], ['Rongai', '65公里']]},
    },
    {
      heading: '乞力马扎罗各路线的成功率',
      table: {columns: ['路线', '成功率'], rows: [['Northern Circuit', '95%'], ['Lemosho', '90%'], ['Machame', '85%'], ['Rongai', '80%'], ['Marangu', '65%'], ['Umbwe', '50%']]},
    },
    {
      heading: '如何选择您的乞力马扎罗路线',
      body: '在乞力马扎罗各路线之间做选择时，请考虑团队的能力、您的预算、可用时间、期望的难度、出发地点、您的个人动机，以及您计划登山的季节。',
    },
    {
      heading: '为什么要通过 Climbing Kilimanjaro Tanzania 预订您的乞力马扎罗路线？',
      body: '选择正确的路线只是成功的一部分。选择像 Asili Climbing Kilimanjaro 这样值得信赖、经验丰富的本地运营商，能确保持证向导、公平对待背夫，以及每条路线上以安全为核心的服务理念。',
    },
    {
      heading: '立即规划您理想的乞力马扎罗路线',
      body: '在 Climbing Kilimanjaro Tanzania，探索所有乞力马扎罗路线的详细分析、行程示例及专家建议——这是您安全、成功攀登乞力马扎罗的可信赖资源。',
    },
  ],
  faqHeading: '关于乞力马扎罗路线的常见问题',
  faqs: [
    {question: '哪条乞力马扎罗路线的成功率最高？', answer: '得益于出色的高原适应效果，Northern Circuit 的成功率最高。'},
    {question: '攀登乞力马扎罗共有多少条路线？', answer: '攀登乞力马扎罗共有七条主要路线。'},
    {question: '乞力马扎罗的最佳路线是什么？', answer: 'Lemosho 路线因其整体体验、成功率及风光，是最受推荐的路线。'},
    {question: '乞力马扎罗的徒步距离是多少？', answer: '因路线而异：总距离在50至90公里之间。'},
    {question: '乞力马扎罗的成功率是多少？', answer: '总体而言为65%至80%；具体因路线而异，从50%（较短路线）到98%（较长路线）不等。'},
  ],
}

const kilimanjaroGuideCostZh: GuideArticleZh = {
  slug: 'kilimanjaro-guide-cost',
  seoTitle: '乞力马扎罗向导费用 | 攀登乞力马扎罗的完整价格指南',
  seoDescription: '攀登乞力马扎罗的完整价格指南：按路线计费、按套餐计费、包含哪些项目，以及费用与登顶成功率之间的关系。',
  heading: '在坦桑尼亚攀登乞力马扎罗的费用',
  intro:
    '攀登乞力马扎罗每人费用在1,680美元至7,000美元以上不等，具体取决于运营商及服务水平。经济型行程费用约为1,680美元至2,500美元，中端旅行团为2,500美元至4,000美元，豪华登山则可能需要4,000美元甚至更多，高端选择的费用可高达7,000美元以上。总费用会因路线、天数、团队规模及包含的服务等因素而有所不同，其中很大一部分价格用于支付强制性的公园门票。',
  sections: [
    {
      heading: '乞力马扎罗向导费用：攀登乞力马扎罗的完整价格指南',
      body: '了解乞力马扎罗向导费用，对于规划您攀登非洲最高峰的梦想之旅至关重要。乞力马扎罗登山的总价格取决于多种因素，包括路线选择、天数、舒适程度、团队规模及向导公司的服务质量。',
    },
    {heading: '影响费用的因素', body: '服务水平：高端套餐包含更多服务、更优质的食物及更高品质的装备，而经济型选项则只专注于基本必需品。'},
    {heading: '需考虑的额外费用', body: '小费：给向导、背夫及厨师小费是惯例，通常每人在150美元至300美元之间。航班：国际及国内机票通常不包含在套餐费用之内。'},
    {
      heading: '乞力马扎罗套餐',
      body: '在经验丰富的本地向导带领下，开启一场私人定制的探险，登顶非洲最高峰。所有套餐均包含灵活的出发日期，以及您专属的向导、背夫及厨师团队。餐食在您的私人餐厅帐篷中供应。步道及营地则与其他徒步者共享。',
    },
    {heading: 'Marangu 路线（5天/4晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '2,008美元'], ['2人共享', '1,783美元'], ['3-4人共享', '1,678美元']]}},
    {heading: 'Marangu 路线（6天/5晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '3,588美元'], ['2人共享', '2,938美元'], ['3-4人共享', '2,668美元']]}},
    {heading: 'Machame 或 Umbwe 路线（6天/5晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '2,328美元'], ['2人共享', '2,078美元'], ['3-4人共享', '1,948美元']]}},
    {heading: 'Machame 或 Umbwe 路线（7天/6晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '2,608美元'], ['2人共享', '2,348美元'], ['3-4人共享', '2,203美元']]}},
    {heading: 'Shira、Lemosho 或 Rongai 路线（6天/5晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '2,648美元'], ['2人共享', '2,243美元'], ['3-4人共享', '2,063美元']]}},
    {heading: 'Shira、Lemosho 或 Rongai 路线（7天/6晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '2,938美元'], ['2人共享', '2,513美元'], ['3-4人共享', '2,313美元']]}},
    {heading: 'Shira、Lemosho 或 Rongai 路线（8天/7晚徒步+2晚酒店住宿）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '3,228美元'], ['2人共享', '2,773美元'], ['3-4人共享', '2,568美元']]}},
    {heading: 'Northern Circuit 路线（8天/7晚+租赁卫生间）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '3,588美元'], ['2人共享', '2,938美元'], ['3-4人共享', '2,668美元']]}},
    {heading: 'Northern Circuit 路线（9天/8晚+租赁卫生间）', table: {columns: ['徒步者类型', '价格'], rows: [['1人独行', '3,918美元'], ['2人共享', '3,228美元'], ['3-4人共享', '2,683美元']]}},
    {
      heading: '乞力马扎罗徒步费用与成功率的关系',
      body: '总体而言，费用越高，乞力马扎罗的登顶成功率也往往越高，因为费用更高的行程通常采用更长的路线，能实现更好的高原适应，配备更完善的安全措施，并由更优质的运营商提供服务。经济型行程费用较低，但由于时长较短、安全保障较少，成功率也相对较低，且可能在团队福利与装备方面有所削减。为确保登山成功，建议选择至少七天的路线，并选择可靠的运营商。',
    },
    {
      heading: '费用更高，成功率更高',
      body: '路线：Lemosho 或 Northern Circuit 等较长的路线，由于能让身体有更多时间适应海拔，成功率更高（最高可达98%-99%）。费用：由于行程时间更长、后勤支持需求更高，这些路线的费用通常也更高（2,000美元至4,550美元或更多）。运营商质量：可靠的运营商收费较高，但会提供必要的安全保障，例如合适的装备、优质的食物、公平的背夫薪酬及经验丰富的向导。',
    },
    {
      heading: '费用更低，成功率更低',
      body: '路线：Marangu（5-6天）等较短的路线费用较低，但由于没有足够的时间进行高原适应，成功率也较低（65%-70%）。费用：经济型徒步费用可能低至1,500美元至2,500美元，但这往往意味着在关键环节上有所削减。运营商质量：经济型运营商可能会克扣背夫薪酬、提供不足的食物，并使用质量较差的装备，这可能会影响安全性与士气。',
    },
    {
      heading: '乞力马扎罗徒步价格：应包含哪些内容？',
      body: '可靠的套餐应始终包含：所有公园门票、政府救援及紧急援助、山上住宿、机场接送、专业向导、餐食及饮用水、氧气瓶及急救用品。请避免选择隐藏这些必要费用的运营商。',
    },
  ],
}

const kilimanjaroClimbingGuideZh: GuideArticleZh = {
  slug: 'kilimanjaro-climbing-guide',
  seoTitle: '乞力马扎罗登山指南 | 攀登乞力马扎罗的必备贴士',
  seoDescription: '攀登乞力马扎罗的必备贴士：训练、高原适应、季节、安全、氧气、医疗包，以及山上的种种体验预期。',
  heading: '攀登乞力马扎罗的必备贴士',
  heroImage: {src: '/images/articles/guide-hero.webp', alt: '一名登山者站在 Uhuru Peak 山顶标志前'},
  intro:
    '乞力马扎罗海拔高达5,895米，是世界上最高的独立山峰，被誉为「非洲之巅」。作为非洲大陆最热门的旅游目的地之一，乞力马扎罗每年吸引超过4万名游客前来造访。这段壮丽的徒步旅程无需任何技术性攀登技巧，因此只要体能状况处于平均良好水平，任何人都能挑战成功。本指南旨在帮助登山者为这场一生难得的探险做好准备。我们的建议基于丰富的实践经验——在 Asili Climbing Kilimanjaro，我们已成功为数千名登山者组织了徒步之旅。',
  sections: [
    {heading: '乞力马扎罗徒步前应了解的事实', body: '乞力马扎罗的山顶 Uhuru Peak 海拔高达5,895米——这是非洲的最高点，也是世界上最高的独立山峰。'},
    {heading: '为乞力马扎罗做准备与训练'},
    {
      heading: '我应该如何为攀登乞力马扎罗进行训练？',
      body: '保持良好的体能状况对攀登乞力马扎罗至关重要。不过，登顶并不需要您成为运动健将，平均良好的体能水平即已足够。要评估自己的准备程度，可以测试自己能否舒适地步行8-10公里。如果可以，那么您的体能已足够挑战乞力马扎罗。跑步是极佳的准备锻炼——目标是能够稳健地跑完4-5公里。游泳也是训练的绝佳补充，因为它能增强心血管耐力。',
    },
    {
      heading: '坦桑尼亚的雨季与旱季是什么时候？',
      body: '坦桑尼亚有两个雨季和两个旱季。短雨季始于11月初，持续至12月底，随后是一个持续到3月中旬的旱季。长雨季则从3月中旬开始，至6月中旬结束。若要在雨季攀登乞力马扎罗，可考虑选择北坡路线——该区域降水量明显较少。推荐路线包括 Rongai、Northern Circuit 及 Marangu。从6月到10月，东非地区夜间气温较低，尤其是在高海拔地区。',
    },
    {heading: '更多徒步信息'},
    {heading: '乞力马扎罗装备清单', body: '一份免费的乞力马扎罗装备指南，由 Asili Climbing Kilimanjaro 提供必备装备清单及专家建议。'},
    {heading: '正在计划攀登乞力马扎罗吗？', body: '我们随时为您提供清晰的解答与专业建议——如有任何疑问，欢迎联系我们，让您自信地迈出第一步。'},
  ],
  faqHeading: '关于乞力马扎罗安全性的常见问题',
  faqs: [
    {
      question: '您能推荐可靠的旅行保险吗？',
      answer: 'Asili Climbing Kilimanjaro 推荐 Global Rescue，提供可靠的旅行保险保障。请确保您的保单包含三项关键内容：涵盖高达6,000米高海拔徒步的保障、直升机撤离服务，以及全面的医疗服务。',
    },
    {
      question: '您对攀登乞力马扎罗期间更好的高原适应有什么建议吗？',
      answer: '为了良好适应高原并成功完成登山，我们建议：放慢脚步（身体需要时间适应较低的氧气水平，适中的节奏有助于身体产生更多红细胞）；每天饮水3-4升；参加我们每日安排的高海拔适应徒步及返程活动（通常不超过2小时）；如果时间允许，可考虑在前往乞力马扎罗之前先攀登梅鲁山。选择7天或更长的路线，也能给身体更多适应时间，提高登顶成功的机会。',
    },
    {question: '哪条路线最适合高原适应？', answer: '为了在乞力马扎罗获得最佳的高原适应效果，最佳路线是 Lemosho、Machame 及 Rongai——或其他7天及以上的路线。'},
    {
      question: '我应该额外安排多少高原适应日？',
      answer: '在7天的 Machame 路线中，您无需额外增加高原适应日。Rongai 与 Lemosho 同样是不错的选择。不过，如果您认为自己的体能状况并非最佳，可以增加一到两天额外的休息日。',
    },
    {
      question: '攀登乞力马扎罗需要氧气系统吗？',
      answer: '在乞力马扎罗山顶，空气中的氧气含量约为海平面的一半。大多数登山者无需额外供氧即可抵达 Uhuru Peak，但出于安全考虑，我们在探险过程中始终携带多个氧气瓶，且相关费用已包含在行程价格之内。',
    },
    {
      question: '我需要携带医疗包吗？',
      answer: '在乞力马扎罗探险期间，我们的团队会携带完整的医疗包——徒步过程中携带小型战术包，用于应对伤口、擦伤或扭伤；同时携带较大的野外医疗包，配备针对恶心、头痛、呕吐及消化不适等常见问题的药物。如果您正在服用处方药，最好在前往坦桑尼亚的旅程中随身携带。',
    },
    {
      question: '乞力马扎罗的死亡率是多少？',
      answer: '与其他山峰相比，乞力马扎罗七条路线的死亡率较低。在每年约5万名攀登乞力马扎罗的人群中，有3至5人因意外身故，主要原因是与高海拔相关的脑部及肺部问题，或是因未能充分进行高原适应而导致的心脏病发作。乞力马扎罗背夫的死亡率明显更高，很大程度上是由于一些超低价运营商提供了不合格的装备所致。请务必选择在 KPAP 注册的公司，以帮助确保背夫获得公平待遇。',
    },
    {question: '为什么乞力马扎罗的山顶被称为 Uhuru Peak？', answer: '「Uhuru」在斯瓦希里语中意为「自由」。乞力马扎罗的最高峰之所以被命名为 Uhuru Peak，是为了纪念坦桑尼亚于1961年脱离英国统治获得独立。'},
    {
      question: '攀登乞力马扎罗后，我可以参加野生动物园吗？',
      answer: '当然可以——坦桑尼亚拥有各类非洲探险的著名目的地，其中最受欢迎的是塞伦盖蒂国家公园及 Ngorongoro 火山口。在登山前后安排一次野生动物园之旅，是绝佳的选择。',
    },
  ],
}

const planATripToClimbKilimanjaroZh: GuideArticleZh = {
  slug: 'information-on-how-to-plan-a-trip-to-climb-mount-kilimanjaro-in-tanzania',
  seoTitle: '如何规划一次攀登乞力马扎罗的旅程 | 完整参考指南',
  seoDescription: '规划一次乞力马扎罗之旅所需了解的一切：山间营地、公园门票、冰川、各路线爬升高度、高海拔风险，以及如何抵达。',
  heading: '关于规划一次坦桑尼亚乞力马扎罗登山之旅的信息',
  intro:
    '规划一次攀登乞力马扎罗的旅程，远不止选择一个日期那么简单。本参考指南涵盖了必备信息：这座山位于何处、官方公园门票的费用、您沿途将入住的营地、山顶附近可见的冰川、每条路线的爬升高度，以及其中真实存在的风险——助您自信地规划行程，并与 Asili Climbing Kilimanjaro 一同登山。',
  sections: [
    {
      heading: '乞力马扎罗山位于何处？',
      body: '乞力马扎罗山位于坦桑尼亚北部，靠近肯尼亚边境，坐落在乞力马扎罗国家公园内。最近的城镇是莫希与阿鲁沙，两地均可通过乞力马扎罗国际机场（JRO）抵达。',
    },
    {
      heading: '乞力马扎罗的爬升高度',
      body: '乞力马扎罗是非洲最高的山峰，也是世界上最高的独立山峰，从山脚到山顶的高度差约为4,900米。这座山的山顶 Uhuru Peak 海拔高达5,895米。如此巨大且富有挑战性的高度差，使得高原适应对登山者预防高原反应而言至关重要。',
      table: {
        columns: ['路线', '起始海拔'],
        rows: [
          ['Northern Circuit', 'Lemosho Gate，海拔2,100米'],
          ['Lemosho 路线', 'Lemosho Gate，海拔2,100米'],
          ['Shira 路线', 'Morum Barrier，海拔3,414米'],
          ['Machame 路线', 'Machame Gate，海拔1,640米'],
          ['Marangu 路线', 'Marangu Gate，海拔1,843米'],
          ['Rongai 路线', 'Rongai Gate，海拔1,950米'],
          ['Umbwe 路线', 'Umbwe Gate，海拔1,800米'],
        ],
      },
    },
    {
      heading: '乞力马扎罗的山间营地',
      body: '根据所选路线的不同，您将在沿途一系列小屋或帐篷营地过夜。常见的营地包括 Mandara Hut、Horombo Hut、Kibo Hut、Machame Camp、Barafu Hut Camp、Lava Tower Camp、Barranco Hut Camp、Karanga Hut Camp、Mweka Camp、Shira 1 与 2 号营地、School Hut Camp 及 Umbwe Cave Camp 等。您的向导及背夫团队会在您每天抵达之前提前搭建好营地。',
    },
    {
      heading: '乞力马扎罗日渐消退的冰川',
      body: '乞力马扎罗以其四大著名冰川而闻名：Northern Ice Field、Eastern Ice Field、Southern Ice Field 以及 Furtwängler 冰川。这些冰川之所以能在赤道附近存在，完全归因于这座山的高海拔——但由于气候变化，它们正在迅速消退。仅 Furtwängler 冰川自20世纪初以来就已流失超过80%的冰体，目前的估计显示，乞力马扎罗的冰原可能会在几十年内彻底消失。',
    },
    {
      heading: '乞力马扎罗国家公园门票费用',
      body: '乞力马扎罗国家公园门票是希望探索公园并攀登这座山的游客必须支付的强制性费用。这些费用包括公园门票、露营费、救援费用以及向导与背夫服务费，根据路线及天数的不同，通常每人在2,000美元至6,000美元之间。',
      table: {
        columns: ['费用类型', '费用'],
        rows: [
          ['救援费', '20美元（一次性）'],
          ['保护费', '每人每天70美元'],
          ['露营费', '每人每晚50美元'],
          ['小屋费（Marangu 路线）', '每人每晚60美元'],
          ['火山口费', '每人每晚100美元'],
        ],
      },
    },
    {
      heading: '乞力马扎罗的死亡事故',
      body: '尽管深受欢迎，攀登乞力马扎罗仍存在真实的风险：据估计，每年有3至7名登山者不幸身故，主要原因是高原反应（急性高原反应，可能发展为 HAPE 或 HACE）、体温过低及跌落事故。「死亡地带」指的是海拔约8,000英尺以上的区域，在这一高度，若没有充分的高原适应，氧气量的降低会使生存变得愈发困难。选择更长的路线、可靠的运营商，并遵循向导的节奏，能显著降低这一风险。',
    },
    {heading: '乞力马扎罗山位于何处？', body: '请查看下方地图，了解这座山的具体位置。'},
  ],
}

const kilimanjaroClimbingZh: GuideArticleZh = {
  slug: 'kilimanjaro-climbing',
  seoTitle: '攀登乞力马扎罗 | 量身定制的探险之旅',
  seoDescription: '量身定制的乞力马扎罗登山探险。探索我们的路线、套餐，以及攀登非洲最高峰前您需要了解的一切。',
  heading: '攀登乞力马扎罗',
  heroImage: {src: '/images/articles/climbing-hero.jpg', alt: '徒步者行走在乞力马扎罗步道上'},
  intro:
    '乞力马扎罗海拔高达5,895米，是世界上最高的独立山峰，这也为它赢得了「非洲之巅」的美誉。每年，数以千计的探险者穿越其风景秀丽的步道，探索多样的风光与令人叹为观止的美景。这里无需任何技术性攀登技巧——只需良好的体魄、坚定的决心，以及一支合适的团队为您引路。在 Asili Climbing Kilimanjaro，我们为您精心打造专属的乞力马扎罗梦想探险之旅。',
  sections: [
    {
      heading: '乞力马扎罗登山路线',
      body:
        'Machame 路线：人称威士忌路线的 Machame，是乞力马扎罗最受欢迎的路线，拥有壮丽风光与多样地形。尽管颇具挑战性，步道陡峭、需露营住宿，但它为寻求较短却回报丰厚徒步之旅的登山者提供了出色的高原适应效果。\nLemosho 路线：作为乞力马扎罗风景最秀丽的路线之一，Lemosho 从偏远的 Londorossi Gate 出发，穿越壮丽的 Shira 高原。这条路线提供一段宁静的登山之旅，拥有壮观景色、丰富的野生动物，以及渐进式的攀升，带来舒适的体验。\nRongai 路线：作为乞力马扎罗唯一的北线路线，Rongai 人流较少、坡度更为平缓，是偏好平静均衡登山体验者的绝佳选择。由于降水较少，这条路线在雨季尤为理想。\nNorthern Circuit 路线：作为最长、风景最秀丽的路线，Northern Circuit 通过逐步环绕乞力马扎罗，提供最佳的高原适应效果。凭借全景视野与较高的成功率，这条路线带来一段宁静而沉浸式的徒步体验。',
    },
    {
      heading: '乞力马扎罗登山套餐',
      body:
        '从我们精心设计的乞力马扎罗登山套餐中挑选，每一款都旨在根据您的喜好、体能状况及理想路线，为您带来最佳体验。无论您追求一次快速登山，还是希望体验一段更长、风景更秀丽的徒步之旅，我们都能为您提供完美的路线选择。\nLemosho 路线8天：8天的行程安排，让您在 Lemosho 路线上的乞力马扎罗徒步时间比其他选择更长，从而实现出色的高原适应效果。\nMachame 路线7天：这条广受欢迎的 Machame 路线，总行程为7天，为您提供更充裕的高原适应时间。\nMarangu 路线6天：通过著名的 Marangu 路线，用6天时间登顶非洲最高峰，途中入住小屋，欣赏多样的风光。\nUmbwe 路线6天：以其艰难陡峭的攀登过程及壮丽、人流稀少的步道而闻名。\nNorthern Circuit 9天：最新且路程最长的路线，提供360度全景视野及最佳的登顶成功率。\nRongai 路线7天：从北侧展开的这条路线，为您呈现乞力马扎罗独特的视角，非常适合寻求更宁静徒步体验的旅行者。',
    },
    {
      heading: '攀登乞力马扎罗前应了解的事项',
      body:
        '获取为登山做准备所需的全部关键信息——从路线选择到安全建议，助您顺利完成一次成功的登山之旅。\n气温考量：低海拔地区日间气温在20°C至27°C之间，但在高海拔地区，尤其是夜晚，气温会降至冰点以下。分层穿衣至关重要。\n植被与风光：旱季能带来更清晰的视野、盛开的野花及沿途郁郁葱葱的森林。较为潮湿的季节则可能伴随雾气弥漫及浓密云层。\n人流水平：旺季（1月至2月及7月至9月）会吸引更多登山者。过渡季节（3月末至5月及11月初至12月）则能带来更为宁静的体验。\n个人偏好与目标：登山者在规划行程时，应考虑天气条件、自身对气温的偏好、人流水平及个人时间安排。',
    },
    {
      heading: '准备好迎接乞力马扎罗的挑战了吗？',
      body: '您通往非洲之巅的旅程，从这里开始。无论您追求的是一生难忘的探险，还是希望突破自我极限、直至登顶，我们都将在每一步为您悉心引导。',
    },
  ],
  faqHeading: '您的问题，我们的解答',
  faqs: [
    {
      question: '乞力马扎罗有哪些可选路线？',
      answer:
        '乞力马扎罗提供多条路线，适合各个水平、偏好与徒步风格的登山者。在 Asili Climbing Kilimanjaro，我们专注于四条最受欢迎的路线：Rongai、Lemosho、Northern Circuit 及 Machame。我们的向导登山之旅确保安全、充分的高原适应，以及一段难忘的登顶旅程。',
    },
    {question: '哪条乞力马扎罗路线人流最少？', answer: 'Northern Circuit 路线人流最少，提供一段宁静、僻静的徒步体验。'},
    {question: '哪条是攀登乞力马扎罗最容易的路线？', answer: '得益于渐进的坡度与直接的攀升方式，Rongai 路线被认为是最容易的。'},
    {question: '哪条乞力马扎罗路线风景最秀丽？', answer: 'Lemosho 路线常被认为风景最为秀丽，拥有壮丽的景色、多样的生态系统及全景视野。'},
    {
      question: '攀登乞力马扎罗需要多少费用？',
      answer:
        '攀登乞力马扎罗的费用在2,500美元至4,000美元之间不等，具体取决于路线选择、时长、团队规模、服务水平及包含的服务。在 Asili Climbing Kilimanjaro，我们保证训练有素的向导、高安全标准及卓越的整体体验。',
    },
    {question: '攀登乞力马扎罗需要多长时间？', answer: '登山通常需要6至9天，具体取决于所选路线。更长的行程可实现更好的高原适应，提高成功且愉快的登顶体验的机会。'},
    {
      question: '初学者可以攀登乞力马扎罗吗？',
      answer:
        '可以！尽管不需要任何技术性攀登技能，初学者在尝试登山前仍应进行适当的体能训练。我们经验丰富的向导确保初学登山者在整个旅程中获得必要的支持。',
    },
    {question: '攀登乞力马扎罗的最佳时间是什么时候？', answer: '登山的最佳季节是旱季月份：1月至3月，以及6月至10月，此时天气条件最佳，天空也更加晴朗。'},
    {
      question: '成功登山的重要建议',
      answer:
        '放慢脚步——稳定的节奏能降低高原反应的风险。充分补水——多喝水。准备合适的装备——恰当的分层衣物、坚固的鞋履及优质装备。做好身体与心理上的准备。享受过程、结交朋友——与其他登山者建立联系，能让这段旅程更加充实难忘。',
    },
    {question: '攀登乞力马扎罗需要向导吗？', answer: '需要！未经持证向导陪同攀登乞力马扎罗是不被允许的。'},
    {question: '为什么我需要向导？', answer: '向导带来专业知识，监测您的健康状况，确保您的安全，并帮助您在乞力马扎罗充满挑战的地形中前行。'},
    {question: '经验丰富的登山者可以不配向导吗？', answer: '即使是经验丰富的登山者，也必须由向导陪同。高海拔及难以预测的天气条件，使得专业陪同不可或缺。'},
    {question: '向导如何提升安全性？', answer: '向导会监测高原适应情况、提供急救处理、评估天气状况，并为登山的成功做出关键决策。'},
    {
      question: '攀登乞力马扎罗的难度如何？',
      answer:
        '攀登乞力马扎罗是一场充满挑战却又回报丰厚的探险。主要难度来自高海拔与多样的地形。凭借良好的准备与经验丰富的陪同，不同经验水平的登山者都能成功登顶。',
    },
    {
      question: '在乞力马扎罗如何过夜？',
      answer:
        '在与我们一同进行的乞力马扎罗徒步期间，您将入住高品质、能抵御恶劣天气的帐篷，专为极端条件下的舒适而设计，配备宽敞的帐篷空间、隔热睡垫及保暖睡袋。',
    },
    {
      question: '攀登乞力马扎罗需要氧气吗？',
      answer: '大多数登山者并不需要额外供氧。成功登山的关键在于良好的高原适应。在严重高原反应的罕见情况下，出于安全考虑会提供氧气。',
    },
  ],
}

async function run() {
  await seedGuideArticleZh(kilimanjaroClimbingSeasonsZh)
  await seedGuideArticleZh(whatIsTheBestRouteUpKilimanjaroZh)
  await seedGuideArticleZh(kilimanjaroGuideCostZh)
  await seedGuideArticleZh(kilimanjaroClimbingGuideZh)
  await seedGuideArticleZh(planATripToClimbKilimanjaroZh)
  await seedGuideArticleZh(kilimanjaroClimbingZh)
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
