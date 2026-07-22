/**
 * Phase 6 (Chinese): blogIndexPage (singleton), the one blogPost (Iringa),
 * destinationsPage (singleton), and the one destinationDetail (Serengeti).
 * Mirrors seed-it-blog-destinations.ts's structure but with Chinese text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-blog-destinations.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, stringToPt, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

async function seedBlogIndexZh() {
  await client.createOrReplace({
    _id: 'blogIndexPage-zh',
    _type: 'blogIndexPage',
    language: 'zh',
    seo: {_type: 'seo', title: '博客 | Asili Climbing Kilimanjaro', description: '来自坦桑尼亚的旅行贴士、目的地指南与故事——乞力马扎罗登山、野生动物园及更多内容，由 Asili Climbing Kilimanjaro 呈现。'},
    heading: '我们的旅行博客',
    intro: '故事、贴士与指南，助您规划坦桑尼亚探险之旅——从攀登乞力马扎罗到探索这个国家的隐藏瑰宝。',
  })
  console.log('blogIndexPage-zh created/replaced')
}

async function seedIringaBlogPostZh() {
  const slug = '5-reasons-you-should-visit-iringa-in-2025-2026'
  const enId = await findEnId(client, 'blogPost', slug)
  if (!enId) {
    console.log(`SKIP blogPost-zh: no en source for ${slug}`)
    return
  }
  const sections = [
    {
      heading: '1. 沉浸于伊林加丰富多彩的文化拼图',
      body: '伊林加洋溢着浓厚的文化气息，让您得以一窥马赛人与赫赫人等当地部落的传统。城内殖民风格的建筑仿佛将您带回旧日时光——走进 Old Boma，这座曾经的德国要塞如今已改建为博物馆，探寻伊林加往昔的故事。与我们一同探访周边村庄，结识热情的居民，感受传统舞蹈的魅力，并参与身临其境的文化体验。这些真实的时刻让您得以体验坦桑尼亚人的生活方式，留下远超此次旅程的珍贵回忆。'
    },
    {
      heading: '为壮丽的自然奇观而惊叹',
      body: '伊林加的风光是自然爱好者的梦想之地，广袤的稀树草原、连绵起伏的丘陵与郁郁葱葱的森林交织成一幅令人叹为观止的画卷。与我们同行前往鲁阿哈国家公园——坦桑尼亚最大的野生动物保护区，体验精彩刺激的野生动物园之旅。在宁静而人迹罕至的环境中，观赏大象、狮子、长颈鹿及色彩斑斓的鸟类。对于徒步爱好者而言，乌宗瓦山国家公园正等待着您，那里有雨林步道、闪耀的瀑布及珍稀物种。徒步前往观景点，沉浸于大自然的宁静之中。'
    },
    {
      heading: '3. 穿越时光，探寻伊林加的历史',
      body: '伊林加的历史根基深厚，其故事令好奇的旅行者深深着迷。参观 Isimila 史前遗址，那里的古老工具与化石揭示了数百万年前的人类早期生活——这是一次触碰人类起源的难得机会。在 Old Boma 博物馆，深入了解赫赫人的传承及其对殖民统治的英勇抵抗。'
    },
    {
      heading: '4. 在伊林加热闹的节庆中尽情欢庆',
      body: '不妨将您的行程安排在伊林加热闹的文化节庆期间，例如每年 8 月举行的伊林加文化节。这场色彩斑斓的盛会充满了传统音乐、动人的舞蹈及本地艺术，充分展现坦桑尼亚的文化传承。品尝地道美食，与当地居民交流几句，感受伊林加真正的精神风貌。'
    },
    {
      heading: '5. 探索伊林加未经雕琢的魅力',
      body: '伊林加的魅力在于它远离游客人潮、鲜为人知的独特韵味。在这里，您将与当地社区、原始的自然风光及真实的传统建立深厚的联系。与我们一同参与社区旅游或志愿者项目，支持从自然保护到手工艺等可持续发展倡议。这段真实的体验将丰富您的旅程，并为伊林加留下积极的印记。'
    },
    {
      heading: '为什么伊林加光彩夺目',
      body: '伊林加将深厚的文化底蕴、壮丽的自然风光与未经雕琢的真实感融为一体，打造出无与伦比的坦桑尼亚探险体验。无论您被生机勃勃的传统、令人兴奋的野生动物，还是隐藏的故事所吸引，Asili Climbing Kilimanjaro 都能为您打造超越梦想的旅程。不要再等待——现在就规划您 2025/2026 年的伊林加之旅！联系我们，开启您的探险之旅。'
    },
  ]
  const faqs = [
    {q: '什么时候是游览伊林加的最佳时间？', a: '旱季（6月至10月）是游览伊林加的理想时段，气候温和，且能在鲁阿哈国家公园获得绝佳的野生动物观赏机会。雨季则呈现出郁郁葱葱的全新景致。我们全年都可安排行程。'},
    {q: '在伊林加可以体验哪些独特的文化活动？', a: '入住马赛族家庭，体验他们的传统生活，从串珠工艺到畜牧养殖。切勿错过每年 8 月举行的伊林加文化节，感受当地的音乐、舞蹈与美食。'},
    {q: '伊林加的主要景点有哪些？', a: '鲁阿哈国家公园以其野生动物令人着迷，而 Isimila 史前遗址则让人得以一窥远古历史。Old Boma 博物馆则揭示了伊林加的殖民历史。'},
    {q: '在伊林加可以体验哪些户外探险活动？', a: '徒步登上尼奥尼山，欣赏壮阔景色，或探索基洛洛高地，进行观鸟活动。鲁阿哈与乌宗瓦公园则提供丰富的野生动物园与徒步步道。'},
    {q: '在伊林加能看到哪些野生动物？', a: '鲁阿哈国家公园栖息着丰富的大象、狮子、猎豹以及超过 570 种鸟类，还有斑马与珍稀羚羊。'},
    {q: '我可以参观伊林加的茶园吗？', a: '当然可以！通过参观茶园，探索伊林加的茶文化，了解种植的奥秘，并品尝新鲜冲泡的茶饮。'},
    {q: '有当地市场可以参观吗？', a: '伊林加的市场汇聚了新鲜农产品、手工艺品及串珠等纪念品。不妨讨价还价寻宝，并品尝街头小吃。'},
    {q: '伊林加的美食如何？', a: '在当地餐馆及街头小贩处，品尝乌加利、烤肉等坦桑尼亚经典美食，以及各式国际料理。'},
    {q: '在伊林加如何乘坐公共交通出行？', a: '搭乘 dala dala 小巴、出租车或 bajaji（嘟嘟车）出行十分便利。若前往较偏远地区，我们也提供私人接送服务，带来更舒适便捷的体验。'},
    {q: '我可以在伊林加做志愿者吗？', a: '当然可以！支持学校、自然保护或社区项目——我们可以为您牵线搭桥，参与充实且有意义的志愿服务机会。'},
    {q: '在伊林加可以住在哪里？', a: '从舒适温馨的旅舍到豪华旅馆，伊林加应有尽有——我们会根据您的预算，为您预订最合适的住宿。'},
    {q: '伊林加对旅行者安全吗？', a: '伊林加总体而言是安全的，但仍需保持警惕。请留意随身物品，搭乘可靠的出租车，并尊重当地风俗习惯。'},
    {q: '在伊林加可以购买什么？', a: '在市场选购手工艺品、纺织品及陶器，或前往商店选购更现代化的商品。'},
    {q: '如何从达累斯萨拉姆前往伊林加？', a: '可搭乘飞机抵达伊林加机场，或搭乘巴士，也可从达累斯萨拉姆租车前往——我们会为您安排顺畅的接送服务。'},
    {q: '前往伊林加需要哪些旅行证件？', a: '请准备好护照（有效期至少 6 个月），并核实坦桑尼亚的签证规定。可能需要提供黄热病疫苗接种证明。'},
    {q: '鲁阿哈国家公园提供哪些活动？', a: '在鲁阿哈尽享摄影野生动物园、徒步野生动物园及观鸟活动。在经验丰富的向导陪同下，观赏大象、狮子及珍稀鸟类。'},
    {q: '伊林加使用哪些语言？', a: '斯瓦希里语是主要语言，但英语在旅游业中也十分常见。学习几句简单的斯瓦希里语会备受当地人欢迎。'},
    {q: '伊林加使用哪种货币？', a: '坦桑尼亚先令（TZS）是标准货币，但美元在旅游场所也可通用。请在银行兑换货币，以获得公平的汇率。'},
    {q: '伊林加有医疗设施吗？', a: '当地设有医院及基础诊所，但严重病例可能需要转送至达累斯萨拉姆。强烈建议购买旅行保险。'},
    {q: '我可以参观当地学校或社区吗？', a: '可以！探访学校或社区团体，进行文化交流——我们会安排充满尊重的参访活动。'},
  ]
  const fields = {
    seo: {_type: 'seo', title: '2025/2026 年游览伊林加的 5 大理由 | Asili Climbing Kilimanjaro', description: '寻找一场远离人潮的坦桑尼亚探险之旅？探索 2025/2026 年游览伊林加不容错过的 5 大理由——文化、野生动物、历史与节庆。'},
    title: '2025/2026 年游览伊林加的 5 大理由',
    excerpt: '寻找一场远离人潮的坦桑尼亚探险之旅？坐落于南部高地的伊林加，是一颗迷人的瑰宝，正等待您前来探索。',
    publishedDate: '2025-05-02',
    coverImage: await uploadImage(client, {src: '/images/destinations/ruaha.webp', alt: '伊林加鲁阿哈国家公园附近水坑边的象群'}),
    intro:
      '寻找一场远离人潮的坦桑尼亚探险之旅？坐落于南部高地的伊林加，是一颗迷人的瑰宝，正等待您前来探索。远离常规的旅游路线，这个充满活力的目的地承诺带给您难忘的时光。仍在犹豫？以下是与 Asili Climbing Kilimanjaro 一起在 2025/2026 年游览伊林加的五大理由。',
    sections: sections.map((section) => ({_type: 'postSection', _key: key(), heading: section.heading, body: stringToPt(section.body)})),
    faqHeading: '常见问题',
    faqs: faqs.map((faq) => ({_type: 'faqItem', _key: key(), question: faq.q, answer: faq.a})),
  }
  const zhId = await upsertTranslatedDoc(client, 'blogPost', slug, 'zh', fields)
  await linkTranslationMetadata(client, 'blogPost', [
    {language: 'en', id: enId},
    {language: 'zh', id: zhId},
  ])
  console.log(`blogPost-zh done (${zhId})`)
}

async function seedDestinationsPageZh() {
  const destinations = [
    {
      name: '乞力马扎罗山',
      image: {src: '/images/destinations/kilimanjaro.webp', alt: '大象在乞力马扎罗山背景下觅食'},
      body: '乞力马扎罗山海拔 5,895 米，是世界上最高的独立山峰，堪称一场毕生难忘的体验。与其他高峰不同，它无需任何技术性攀登技巧，因此体能良好的世界各地徒步者都能轻松挑战。',
      highlightsHeading: '亮点',
      highlights: [
        '多条风景秀丽的路线（Machame、Lemosho、Marangu、Rongai、Umbwe）',
        '多样的生态区域：雨林、石楠荒原、高山荒漠及北极般的山顶',
        '由专家带领的徒步之旅，配备全程背夫支持、高原适应协助及高端露营设施',
        '在 Uhuru Peak 云端之上迎接日出的登顶体验',
      ],
      bestTime: '1月至3月，6月至10月',
      bonusHeading: 'Asili 特色优势',
      bonus: ['Asili 提供定制化的乞力马扎罗登山之旅，将安全性、可持续性与难忘景致完美融合。'],
    },
    {
      name: '塞伦盖蒂国家公园',
      href: '/serengeti-national-park/',
      image: {src: '/images/destinations/serengeti.webp', alt: '塞伦盖蒂金色草原'},
      body: '塞伦盖蒂是非洲野生动物园体验的核心所在——无边无际的金色草原、震撼人心的捕食者与猎物邂逅，以及著名的角马大迁徙。在这里，每一次摄影游猎都在诉说一个全新的故事。',
      highlightsHeading: '最佳野生动物观赏体验',
      highlights: [
        '见证角马大迁徙——这是一场全年上演的壮观景象，超过 150 万只角马与斑马为寻找新牧场而迁徙。',
        '渡河场面（7月至9月）扣人心弦，鳄鱼潜伏其中，兽群纷纷跃入水中。',
        '产仔季（1月至3月）同样精彩纷呈，捕食者在南部草原上瞄准新生的幼崽。',
        '绝佳的大型猫科动物观赏体验——尤其是狮子、豹与猎豹。',
        '日出时分的热气球草原游猎（附加选项）。',
      ],
      bestTime: '6月至10月（旱季，捕食者活动的理想时段）；1月至3月（Ndutu 地区的产仔季）',
      bonusHeading: 'Asili 特色优势',
      bonus: ['我们的向导对迁徙模式了如指掌，量身定制摄影游猎路线，带您更贴近精彩瞬间——同时避开人群。'],
    },
    {
      name: 'Ngorongoro 火山口',
      image: {src: '/images/destinations/ngorongoro.webp', alt: 'Ngorongoro 火山口草地上的两头犀牛'},
      body: 'Ngorongoro 火山口是世界上最大且完整无缺的火山破火山口，堪称非洲野生动物的缩影。这是少数几个能在一天之内观赏到非洲五霸的地方之一。',
      highlightsHeading: '最佳体验',
      highlights: [
        '下降 600 米，抵达郁郁葱葱的火山口底部，展开一整天的摄影游猎。',
        '观赏黑犀牛、河马、狮子、斑马、水牛、豺狼及火烈鸟。',
        '壮丽的景观，森林覆盖的火山壁、草原及中央的湖泊交相辉映。',
        '探访附近的马赛村庄，进行文化交流。',
      ],
      bestTime: '全年皆宜（旱季能见度更佳）',
      bonusHeading: 'Asili 特色优势',
      bonus: ['我们为您的火山口之旅精心安排风景如画的野餐及清晨入园时段，以避开人群。'],
    },
    {
      name: 'Lake Manyara 国家公园',
      image: {src: '/images/destinations/lake-manyara.webp', alt: 'Lake Manyara 国家公园风光'},
      body: 'Lake Manyara 或许面积不大，却蕴藏着令人惊叹的多样栖息地——从地下水林到开阔草原，再到碱性湖泊本身。这里是了解坦桑尼亚生态系统的理想入门之地。',
      highlightsHeading: '主要亮点',
      highlights: [
        '以树栖狮闻名，这种在大多数公园中难得一见的罕见行为',
        '成千上万的火烈鸟与鹈鹕栖息于湖岸沿线',
        '狒狒群、绿长尾猴、大象与河马',
        '水位允许时可体验独木舟活动（季节性）',
      ],
      bestTime: '6月至10月适合观赏野生动物，11月至3月适合观鸟',
      bonusHeading: 'Asili 特色优势',
      bonus: ['我们通常将 Manyara 作为您行程的第一站——它靠近阿鲁沙，是踏上更大探险之前的完美热身。'],
    },
    {
      name: 'Tarangire 国家公园',
      image: {src: '/images/destinations/tarangire.jpg', alt: '拥有猴面包树的 Tarangire 国家公园'},
      body: 'Tarangire 常被忽视，却是一座野生动物资源丰富的瑰宝——尤其是在旱季，动物纷纷涌向 Tarangire 河畔。它以庞大的象群与雄伟的猴面包树而闻名。',
      highlightsHeading: '最佳野生动物观赏',
      highlights: [
        '庞大的象群——有时超过 200 头',
        '大型猫科动物、长颈鹿、鸵鸟，偶尔还能见到野狗',
        '超过 500 种鸟类，是观鸟爱好者的天堂',
        '经典的金合欢与猴面包树景观，是绝佳的摄影题材',
      ],
      bestTime: '6月至10月（旱季，水源吸引野生动物聚集）',
      bonusHeading: 'Asili 特色优势',
      bonus: ['我们常将 Tarangire 纳入北线野生动物园行程，尤其适合寻求更少人流与原生态景观的旅行者。'],
    },
    {
      name: 'Nyerere 国家公园',
      image: {src: '/images/destinations/nyerere.webp', alt: 'Nyerere 国家公园湿地'},
      body: 'Nyerere 是非洲最大的国家公园，坦桑尼亚南部的偏远河流、森林及湿地一望无际。它非常适合寻求原汁原味、人流稀少的野生动物园体验的旅行者。',
      highlightsHeading: '独特的野生动物园活动',
      highlights: [
        'Rufiji 河船上游猎——在河岸边观赏河马、鳄鱼与大象',
        '配备武装护林员的徒步野生动物园——徒步追踪动物踪迹',
        '摄影游猎，有机会观赏狮子、豹、大象，甚至野狗',
        '游客更少，与野生自然的邂逅更为真实',
      ],
      bestTime: '6月至10月（旱季）',
      bonusHeading: 'Asili 特色优势',
      bonus: ['对于寻求与非洲荒野建立更长久、更深厚联系的客人，我们协助您规划前往人迹罕至的 Nyerere 延伸行程。'],
    },
    {
      name: 'Ruaha 国家公园',
      image: {src: '/images/destinations/ruaha.webp', alt: 'Ruaha 国家公园风光'},
      body: 'Ruaha 是一处鲜为人知的秘境，是野生动物园行家的理想之选。原始的风光与稀少的游客量，使其成为一片真正的荒野前沿。这里动物密度高，捕食活动也十分活跃。',
      highlightsHeading: 'Ruaha 的独特之处',
      highlights: [
        '庞大的狮群（有些群体超过 20 头！）',
        '珍稀羚羊，如黑马羚、驴羚及小捻角羚',
        '绝佳的豹、猎豹与鬣狗观赏体验',
        '出色的观鸟体验——超过 500 种鸟类及壮丽的景观',
      ],
      bestTime: '6月至10月（旱季，便于观赏野生动物）',
      bonusHeading: 'Asili 特色优势',
      bonus: ['对于野生动物爱好者，我们可以将 Ruaha 与 Nyerere 结合，打造一场坦桑尼亚南部的真正探险之旅。'],
    },
    {
      name: 'Mikumi 国家公园',
      image: {src: '/images/destinations/mikumi.jpg', alt: 'Mikumi 国家公园草原'},
      body: 'Mikumi 国家公园是坦桑尼亚最容易到达的野生动物园公园之一，距达累斯萨拉姆仅几小时车程。它非常适合时间有限、却仍想探索坦桑尼亚野性一面的旅行者。尽管交通便利，Mikumi 却以其丰富的野生动物及形似塞伦盖蒂的开阔草原，令游客惊喜连连。',
      highlightsHeading: '最佳野生动物观赏',
      highlights: [
        '狮子在高草丛或蚁丘上晒太阳',
        '成群的水牛、斑马与黑斑羚穿越草原',
        '大象出没于 miombo 林地',
        '长颈鹿、河马、角马及疣猪',
        '出色的观鸟体验——超过 400 种鸟类，包括色彩斑斓的蜂虎与鹰类',
      ],
      bestTime: '6月至10月（旱季，水源附近野生动物最为集中）；绿意盎然的雨季同样值得一游，尤其适合观鸟爱好者',
      bonusHeading: '为什么选择 Asili 前往 Mikumi',
      bonus: [
        '非常适合从达累斯萨拉姆出发的 2 日游或周末游',
        '公园内或附近提供舒适的住宿',
        '可为单人旅行者、家庭或团体量身定制行程',
        '可与乌宗瓦山脉甚至 Ruaha 结合，打造坦桑尼亚南部的延伸野生动物园之旅',
        '我们提供 Mikumi 灵活的野生动物园套餐，配备私人接送、经验丰富向导带领的摄影游猎，并可根据您的出行需求定制行程。',
      ],
    },
    {
      name: '纳特龙湖',
      image: {src: '/images/destinations/lake-natron.jpg', alt: '纳特龙湖畔的斑马与火烈鸟'},
      body: '纳特龙湖是坦桑尼亚最超现实、最令人惊叹的目的地之一。它坐落于大裂谷靠近肯尼亚边境处，湖水浅而咸，呈现出引人注目的红色。这里是小火烈鸟的主要繁殖地，筑巢季节数以千计的火烈鸟将湖面染成粉色。但这里不仅仅有鸟类——世界上唯一活跃的碳酸盐火山 Ol Doinyo Lengai 就矗立在附近，为热爱冒险的旅行者提供一段独特（虽颇具挑战）的徒步体验。纳特龙同时也是半游牧马赛人的家园，这里的文化参访真实而质朴，毫不矫饰。',
      highlightsHeading: '最佳体验',
      highlights: [
        '观赏湖岸边庞大的火烈鸟群',
        '穿越狭窄峡谷与温泉，徒步前往瀑布',
        '参观传统的马赛村落（boma）',
        '可选攀登 Ol Doinyo Lengai（适合经验丰富的徒步者）',
      ],
      bestTime: '6月至10月（旱季；非常适合徒步与摄影）。火烈鸟繁殖季在9月至11月达到高峰。',
      bonusHeading: '为什么选择与 Asili Climbing Kilimanjaro 一起游览',
      bonus: [
        '由专家带领的徒步与文化之旅',
        '北线野生动物园或乞力马扎罗登山之旅的独特补充',
        '支持当地马赛社区',
      ],
    },
    {
      name: 'Eyasi 湖',
      image: {src: '/images/destinations/lake-eyasi.jpg', alt: 'Hadzabe 部落成员携带传统弓箭进行狩猎远征'},
      body: 'Eyasi 湖的魅力不在于宏大的野生动物，而在于深度的文化沉浸。如果您对坦桑尼亚的原住民部落充满好奇——尤其是非洲最后的狩猎采集族群之一 Hadzabe，以及技艺精湛的铁匠 Datoga 人——这里正是理想的目的地。这片地区提供了一次难得的机会，让您与数千年来几乎未曾改变的传统建立联系。您可以参与清晨的狩猎活动，观察祖辈流传下来的习俗，探索早于现代文明的生存技艺。',
      highlightsHeading: '最佳体验',
      highlights: [
        '与 Hadzabe 人一同体验弓箭狩猎',
        '向 Datoga 人学习传统金属加工与首饰制作技艺',
        '沿湖及周边灌木丛的风景步道漫步',
        '日落时分的观鸟与摄影活动',
      ],
      bestTime: '全年皆宜——文化之旅不受动物迁徙或天气条件的影响',
      bonusHeading: '为什么选择与 Asili Climbing Kilimanjaro 一起游览',
      bonus: [
        '负责任且充满尊重的文化参访',
        '配备翻译及经验丰富的向导，促进理解',
        '与北线野生动物园或乞力马扎罗徒步之旅相得益彰的理想文化补充',
      ],
    },
  ]

  await client.createOrReplace({
    _id: 'destinationsPage-zh',
    _type: 'destinationsPage',
    language: 'zh',
    seo: {
      _type: 'seo',
      title: '目的地 | 坦桑尼亚野生动物园与乞力马扎罗目的地',
      description:
        '与 Asili Climbing Kilimanjaro 一起探索坦桑尼亚最佳目的地：乞力马扎罗山、塞伦盖蒂、Ngorongoro 火山口、Tarangire、纳特龙湖及更多精彩去处。',
    },
    heading: '目的地',
    destinations: await Promise.all(
      destinations.map(async (dest) => ({
        _type: 'destinationEntry',
        _key: key(),
        name: dest.name,
        ...(dest.href ? {href: dest.href} : {}),
        image: await uploadImage(client, dest.image),
        body: dest.body,
        highlightsHeading: dest.highlightsHeading,
        highlights: dest.highlights,
        bestTime: dest.bestTime,
        ...(dest.bonusHeading ? {bonusHeading: dest.bonusHeading} : {}),
        ...(dest.bonus?.length ? {bonus: dest.bonus} : {}),
      })),
    ),
  })
  console.log('destinationsPage-zh created/replaced')
}

async function seedSerengetiDetailZh() {
  const slug = 'serengeti-national-park'
  const enId = await findEnId(client, 'destinationDetail', slug)
  if (!enId) {
    console.log(`SKIP destinationDetail-zh: no en source for ${slug}`)
    return
  }
  const fields = {
    seo: {_type: 'seo', title: '塞伦盖蒂国家公园 | Climbing Kilimanjaro Tanzania', description: '游览塞伦盖蒂国家公园所需了解的一切——活动项目、最佳游览时间及真实照片。'},
    name: '塞伦盖蒂国家公园',
    hero: {
      eyebrow: '无尽的奇迹',
      heading: '塞伦盖蒂国家公园',
      locationPill: '坦桑尼亚北部',
      backgroundImage: await uploadImage(client, {src: '/images/serengeti-national-park/serengeti-np.jpg', alt: '塞伦盖蒂草原上的角马群'}),
    },
    overview: {
      heading: '概览',
      body: [
        '塞伦盖蒂国家公园是坦桑尼亚北部一处享誉世界的野生动物保护区，以其广阔的稀树草原、丰富的生态系统及无与伦比的野生动物观赏机会而闻名。公园占地约 14,750 平方公里，是著名的角马大迁徙的家园，数百万只角马、斑马及瞪羚为寻找新牧场而穿越草原——这是一场令人叹为观止的自然奇观。',
        '除了迁徙景观外，塞伦盖蒂全年都能观赏到丰富的野生动物，包括狮子、豹、大象、长颈鹿、猎豹以及超过 500 种鸟类。公园的名字源自马赛语「Siringet」，意为「无尽的草原」——完美诠释了这片一望无际、令人惊叹的风光。',
        '无论是参加摄影游猎、乘坐热气球俯瞰草原，还是在向导陪同下徒步探索灌木丛中最偏远的角落，塞伦盖蒂都能带给您一段真正原汁原味、令人难忘的非洲野生动物园体验。',
      ].map(paragraphBlock),
    },
    activitiesHeading: '塞伦盖蒂国家公园热门难忘活动',
    activities: [
      {title: '角马迁徙', body: '根据季节不同，您可以观赏到超过一百万只角马以及数十万只斑马与瞪羚展开其史诗般的迁徙旅程——在塞伦盖蒂北部的渡河场景中尤为壮观。'},
      {title: '热气球野生动物园', body: '在日出时分，从空中俯瞰塞伦盖蒂。当野生动物在下方移动时，乘坐热气球飞越草原，随后在灌木丛中享用香槟早餐。'},
      {title: '摄影游猎', body: '这是最具代表性的活动，摄影游猎让您有机会观赏非洲五霸（狮子、大象、水牛、豹与犀牛），以及猎豹、鬣狗、长颈鹿、斑马及数不清的角马。游猎行程可安排在清晨、下午，或全天进行。'},
      {title: '观鸟', body: '塞伦盖蒂拥有超过 500 种鸟类，是鸟类学家的天堂。寻找蛇鹫、秃鹫、灰冠鹤及色彩斑斓的蜂虎，尤其是在水源与林地周边。'},
      {title: '徒步野生动物园', body: '在武装护林员及经验丰富的自然学家带领下，徒步野生动物园让您得以步行探索公园——学习辨认足迹、植物及摄影游猎中常被忽略的小型生物。'},
      {title: '专业摄影游猎', body: '凭借壮丽的风光、绝美的光线及丰富的野生动物，塞伦盖蒂无论对业余摄影师还是专业摄影师而言都堪称完美。部分运营商还提供专为摄影设计的车辆与专业向导。'},
    ].map((activity) => ({_type: 'activity', _key: key(), title: activity.title, body: activity.body})),
    bestTimeToVisit: {
      heading: '最佳游览时间',
      body: [
        '观赏迁徙的最佳时间是 7 月至 10 月。这是旱季，6 月与 7 月期间，兽群将面临最大的挑战——渡过马拉河。如果您想观赏捕食者的活动，请在 1 月或 2 月出发，此时正值年度降雨间歇期，也是角马产仔的季节。',
        '请注意，旺季出行自然会带来更高的费用，而在雨季期间或雨后不久，这片土地则展现出别样的美丽。',
      ].map(paragraphBlock),
    },
    gallery: await Promise.all(
      [
        {src: '/images/serengeti-national-park/wildebeest-migrations.webp', alt: '角马迁徙'},
        {src: '/images/serengeti-national-park/balloon-safari.jpeg', alt: '热气球野生动物园'},
        {src: '/images/serengeti-national-park/elephant-serengeti.jpg', alt: '塞伦盖蒂的大象'},
        {src: '/images/serengeti-national-park/cheetah.jpg', alt: '猎豹'},
        {src: '/images/serengeti-national-park/lion.jpg', alt: '狮子'},
        {src: '/images/serengeti-national-park/zebra-serengeti.jpg', alt: '塞伦盖蒂的斑马'},
      ].map((img) => uploadImage(client, img)),
    ),
    otherDestinationsHeading: '其他野生动物园目的地',
    otherDestinations: await Promise.all(
      [
        {name: 'Ngorongoro 火山口', href: '/destinations/', image: {src: '/images/serengeti-national-park/ngorongoro-crater.jpg', alt: 'Ngorongoro 火山口'}},
        {name: 'Tarangire 国家公园', href: '/destinations/', image: {src: '/images/serengeti-national-park/tarangire.webp', alt: 'Tarangire 国家公园'}},
        {name: 'Lake Manyara 国家公园', href: '/destinations/', image: {src: '/images/serengeti-national-park/lake-manyara.jpg', alt: 'Lake Manyara 国家公园'}},
        {name: 'Mkomazi 国家公园', href: '/destinations/', image: {src: '/images/serengeti-national-park/mkomazi.webp', alt: 'Mkomazi 国家公园'}},
        {name: 'Arusha 国家公园', href: '/destinations/', image: {src: '/images/serengeti-national-park/arusha-national-park.jpg', alt: 'Arusha 国家公园'}},
      ].map(async (dest) => ({_type: 'crossPromo', _key: key(), name: dest.name, href: dest.href, image: await uploadImage(client, dest.image)})),
    ),
  }
  const zhId = await upsertTranslatedDoc(client, 'destinationDetail', slug, 'zh', fields)
  await linkTranslationMetadata(client, 'destinationDetail', [
    {language: 'en', id: enId},
    {language: 'zh', id: zhId},
  ])
  console.log(`destinationDetail-zh done (${zhId})`)
}

async function run() {
  await seedBlogIndexZh()
  await seedIringaBlogPostZh()
  await seedDestinationsPageZh()
  await seedSerengetiDetailZh()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
