/**
 * Phase 6 (Chinese): the 6 `route` documents (Machame, Marangu, Lemosho,
 * Rongai, Umbwe, Northern Circuit) plus the routesHubPage singleton.
 * Mirrors seed-it-routes.ts's field construction but with Chinese text.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/seed-zh-routes.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'
import {key, paragraphBlock} from './lib/pt'
import {uploadImage} from './lib/assets'
import {findEnId, upsertTranslatedDoc, linkTranslationMetadata} from './lib/i18n'

const client = getCliClient({apiVersion: '2026-07-01'})

const arrivalStopZh = {
  label: '抵达与行前说明',
  meta: ['🏨 经典型：Ameg Lodge | 高级型：Kaliwa Lodge'],
  body: [
    '抵达乞力马扎罗国际机场后，您将被送往下榻的住所，向导会在那里为您进行全面的行前说明与装备检查，帮助您为即将到来的探险做好准备。',
  ],
}
const departureStopZh = {
  label: '离境或继续行程',
  body: ['🚗 送往乞力马扎罗国际机场搭乘返程航班，或继续您的坦桑尼亚探险之旅！'],
}

interface RouteInfoBlockZh {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  pricingTable?: {columns: string[]; rows: {label: string; values: string[]}[]}
}
interface RouteZh {
  slug: string
  name: string
  seoTitle: string
  seoDescription: string
  heroHeading: string
  heroTagline: string
  heroBody: string[]
  heroImage: {src: string; alt: string}
  itineraryHeading: string
  itinerarySubheading: string
  daysLabel: string
  stops: {label: string; meta?: string[]; body: string[]}[]
  infoTabsHeading: string
  tabs: {id: string; label: string; blocks: RouteInfoBlockZh[]}[]
  secondaryHeading: string
  secondaryTagline: string
  faqHeading: string
  faqs: {number: number; question: string; answer: string}[]
}

const machame: RouteZh = {
  slug: 'machame-route',
  name: 'Machame 路线',
  seoTitle: 'Machame 路线 | Climbing Kilimanjaro Tanzania',
  seoDescription: '探索 Machame 路线——乞力马扎罗最受欢迎的登顶路线，人称「威士忌路线」。真实每日行程、价格与专家建议。',
  heroHeading: '探索乞力马扎罗 Machame 路线',
  heroTagline: '通往乞力马扎罗山顶最受欢迎的路线',
  heroBody: [
    '素有「威士忌路线」之称的 Machame 路线，是乞力马扎罗最受欢迎的登顶路线，每年近一半的徒步者都会选择这条路线。',
    '这条风景秀丽的路线从南侧进入乞力马扎罗，攀登壮丽的南坡，随后经由 Mweka 路线下山。沿途，登山者将收获乞力马扎罗最壮观的日落与日出景色。',
    '全程约 62 公里，通常以六天完成，但我们强烈建议选择七天行程以获得更好的高原适应——这将显著提高登顶成功率。',
    '对于寻求一场令人难忘、地形富有挑战却又回报丰厚的探险者而言，Machame 路线是绝佳之选。',
  ],
  heroImage: {src: '/images/routes/machame/hero.webp', alt: '徒步者沿 Machame 路线前往乞力马扎罗山'},
  itineraryHeading: 'Machame 路线行程',
  itinerarySubheading: '没有威士忌——一份逐日旅行日志',
  daysLabel: '7 天',
  stops: [
    arrivalStopZh,
    {
      label: '徒步第 1 天 – 从 Machame Gate 至 Machame Camp',
      meta: ['📍 Machame Gate（1,800 米）→ Machame Camp（3,000 米）', '📈 爬升高度：1,200 米', '⏳ 用时：6-7 小时'],
      body: [
        '旅程从莫希出发，驱车 45 分钟抵达 Machame Gate。完成登记后，徒步沿蜿蜒小径穿越茂密雨林——全山最潮湿的地带。请留意午后偶尔出现的阵雨，可能使路面湿滑。',
        '随着逐渐接近 Machame Camp，坡度趋于平缓。该营地位于森林与巨型石楠带之间的过渡区域。',
      ],
    },
    {
      label: '徒步第 2 天 – 从 Machame Camp 至 Shira Camp',
      meta: ['📍 Machame Camp（3,000 米）→ Shira Camp（3,840 米）', '📈 爬升高度：840 米', '⏳ 用时：5-6 小时'],
      body: [
        '今天以沿山脊陡峭攀升开始，抵达 Picnic Rock——一处极佳的观景点，可俯瞰基博峰与 Shira 高原崎岖的边缘。',
        '随后步道趋于平缓，穿越 Shira 高原——乞力马扎罗三大火山锥之一，最终抵达 Shira Camp，在此可欣赏壮丽的山间全景。',
      ],
    },
    {
      label: '徒步第 3 天 – 经 Lava Tower 从 Shira Camp 至 Barranco Camp',
      meta: [
        '📍 Shira Camp（3,840 米）→ Lava Tower（4,550 米）→ Barranco Camp（3,850 米）',
        '📈 爬升高度：710 米',
        '📉 下降高度：700 米',
        '⏳ 用时：6-7 小时',
      ],
      body: [
        '这是充满挑战却至关重要的高原适应日：您将穿越高海拔荒漠地形，抵达高 90 米的 Lava Tower——一座拥有惊人全景视野的火山岩柱。',
        '午餐后，下降进入 Barranco 谷地，这里是独特的巨型千里光植物的家园。这段下降有助于身体为即将到来的高海拔登顶做好准备。Barranco Camp 坐落于风景如画、地势隐蔽的山谷中，紧邻著名的 Barranco Wall 脚下。',
      ],
    },
    {
      label: '徒步第 4 天 – 经 Barranco Wall 从 Barranco Camp 至 Karanga Camp',
      meta: [
        '📍 Barranco Camp（3,850 米）→ Barranco Wall（4,200 米）→ Karanga Camp（3,950 米）',
        '📈 爬升高度：350 米',
        '📉 下降高度：250 米',
        '⏳ 用时：3-4 小时',
      ],
      body: [
        '今天从令人印象深刻的 Barranco Wall 开始，这段刺激的攀登将以壮丽景色作为回报。',
        '抵达 4,200 米的顶部后，沿着风景如画、起伏不平的步道绕行山腰，梅鲁火山耸立于右侧，基博峰矗立于左侧。',
        '下降进入 Karanga 谷地后，紧接着是一段短促而陡峭的攀升，抵达当晚落脚的 Karanga Camp。',
      ],
    },
    {
      label: '徒步第 5 天 – 从 Karanga Camp 至 Barafu Camp',
      meta: ['📍 Karanga Camp（3,950 米）→ Barafu Camp（4,600 米）', '📈 爬升高度：650 米', '⏳ 用时：3-4 小时'],
      body: [
        '上午稳步攀升至 Barafu Camp，其斯瓦希里语意为「冰」。这处高海拔营地位于登顶锥体之下的山脊上，标志着乞力马扎罗南部环线的终点，可从多个角度欣赏壮观的山顶景色。',
        '您将及时抵达，享受下午的休息与提前的晚餐，为登顶夜做好准备。',
      ],
    },
    {
      label: '徒步第 6 天 – 从 Barafu Camp 经 Uhuru Peak 至 Mweka Camp',
      meta: [
        '📍 Barafu Camp（4,600 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
        '📈 爬升高度：1,295 米',
        '📉 下降高度：2,785 米',
        '⏳ 登顶用时：6-8 小时',
        '⏳ 下山用时：6 小时',
      ],
      body: [
        '午夜开始您的最后冲刺。步道陡峭而艰苦，气温远低于冰点。黎明时分，马文济峰后方绚丽的红色日出将持续为您注入动力。',
        '抵达 Stella Point（5,750 米）后，沿火山口边缘前行，最终抵达 Uhuru Peak（5,895 米）——非洲最高点！',
        '庆祝登顶后，开始漫长的下降前往 Mweka Camp，途经多样地形并在途中稍作午餐休息。当晚，您将在山上享用最后一顿晚餐。',
      ],
    },
    {
      label: '徒步第 7 天 – 从 Mweka Camp 至 Mweka Gate',
      meta: ['📍 Mweka Camp（3,110 米）→ Mweka Gate（1,830 米）', '📉 下降高度：1,280 米', '⏳ 用时：2-3 小时'],
      body: [
        '最后的下降穿越茂密雨林，途中还有机会邂逅嬉戏的猴群。',
        '在 Mweka Gate，您将领取登顶证书，随后从 Mweka 村出发前往莫希的酒店。',
      ],
    },
    departureStopZh,
  ],
  infoTabsHeading: '为什么选择 Machame？',
  tabs: [
    {
      id: 'duration',
      label: '行程时长',
      blocks: [
        {
          heading: '选择 Machame 路线有哪些优势？',
          paragraphs: [
            '乞力马扎罗的 Machame 路线以其壮丽风光与高成功率著称。如果您正在寻找一段风景优美且回报丰厚的挑战，这条路线可以提供：',
            '我们为 Machame 路线设计的乞力马扎罗登顶套餐，旨在最大程度地提升高原适应效果与整体安全性。',
          ],
          bullets: [
            '多样地形——从茂密雨林到高山荒漠与冰川。',
            '风景地标——路线沿途拥有 Shira 高原及标志性 Barranco Wall 等壮丽亮点。',
            '出色的高原适应——「高处攀登，低处扎营」的策略将高原反应的风险降至最低。',
            '较高的登顶成功率——凭借节奏合理的行程安排，登山者能更好地适应环境，提升登顶 Uhuru Peak 的机会。',
          ],
        },
        {
          heading: 'Machame 路线需要多长时间？',
          paragraphs: [
            '虽然 Machame 路线的全程可以在 6 天内完成，但我们强烈推荐 7 天行程，以获得更舒适、更成功的登顶体验。🕒 为什么选择 7 天？',
            '📌 特别提示：如需了解乞力马扎罗理想行程时长的详细指南，请参阅我们深入的博客文章。',
          ],
          bullets: [
            '额外的时间 = 更好的高原适应与更低的高原反应风险。',
            '让您能以舒适的节奏欣赏沿途风光。',
            '提升您登顶成功的机会。',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: '价格详情',
      blocks: [
        {
          heading: 'Machame 路线的费用是多少？',
          paragraphs: [
            '7 天 Machame 路线的价格因团队规模、服务水平及附加选项等因素而异。以下是详细说明：',
            '💰 团队登山：每人起价 2,285 美元   💰 私人登山：每人起价 2,585 美元',
            '🔍 影响价格的因素：',
            '📅 专家提示：最佳登山时间会影响成本。旺季（7月-9月及1月-2月）天气极佳，但费用也更高。',
          ],
          bullets: [
            '您所选乞力马扎罗向导登山的时长',
            '团队规模——人数越多，人均费用可能越低',
            '经典或高级服务——更多舒适度 = 略高的费用',
            '包含与不包含项目——请查阅我们的套餐详情以获得更清晰的了解',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: '住宿地点',
      blocks: [
        {
          heading: 'Machame 路线沿途有哪些营地？',
          paragraphs: [
            '您的乞力马扎罗登顶之旅将在以下战略性营地过夜：',
            '⛺ 每个营地都提供帐篷住宿、用餐区及卫生设施等基本服务，确保舒适的停留体验。',
          ],
          bullets: ['Machame Camp', 'Shira Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp'],
        },
      ],
    },
    {
      id: 'crowds',
      label: '人气与人流',
      blocks: [
        {
          heading: 'Machame 路线拥挤吗？',
          paragraphs: [
            '作为乞力马扎罗最受欢迎的路线之一，Machame 路线每年吸引大量登山者。其受欢迎的主要原因：',
            '🌍 壮丽景色——壮观的风光与多样的生态系统。   ⏳ 时间更短——仅需 6 天即可完成。   📈 成功率高——出色的高原适应表现。',
            '🤔 担心人流拥挤？虽然旺季会吸引更多登山者，但选择淡季月份（3 月、11 月）出行，能带来更为宁静的体验。',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: '专家见解',
      blocks: [
        {
          heading: '我们对 Machame 路线的看法是什么？',
          paragraphs: [
            '在 African Scenic Safaris，我们高度推荐 Machame 路线，因其风光多样、成功率高。不过，如果您正在寻找一条人流较少的替代路线，可以考虑 Lemosho 路线。',
            '📍 关键区别：Lemosho 起点更为清静，但会在第 3 天与 Machame 汇合。',
            '⚠️ 请注意：Machame 路线上登山者较多，尤其是在旺季。',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Machame 路线',
  secondaryTagline: '体验前往乞力马扎罗山顶的风景之旅。穿越 Machame，领略山巅的雄伟壮观。',
  faqHeading: '关于 Machame 路线的 10 个问题',
  faqs: [
    {number: 1, question: 'Machame 路线需要多长时间？', answer: 'Machame 路线通常需要 6 至 7 天。这一时长可实现充分的高原适应，大幅提高乞力马扎罗登顶成功的机会。'},
    {number: 2, question: 'Machame 路线的难度如何？', answer: 'Machame 路线被认为具有中等难度。它涉及陡峭的攀升、崎岖的地形以及漫长的徒步日程，需要良好的体能与坚韧的心理素质。'},
    {number: 3, question: '经由 Machame 路线登顶的成功率是多少？', answer: '在 African Scenic Safaris，我们认为成功的登山意味着安全登顶并平安返回。以此标准衡量，我们的成功率为 100%。总体而言，得益于其渐进式的高原适应过程，Machame 路线展现出较高的登顶成功率。'},
    {number: 4, question: 'Machame 路线风景优美吗？', answer: '当然！Machame 路线因其壮丽风光被称为「威士忌路线」。登山者将穿越茂密雨林、石楠荒原与高山荒漠，每一段行程都能欣赏到乞力马扎罗的壮丽景色。'},
    {number: 5, question: 'Machame 路线每日平均徒步距离是多少？', answer: '平均而言，登山者每天徒步 10 至 12 公里，即根据行程与节奏的不同，需要 6 至 8 小时的步行时间。'},
    {number: 6, question: '相比其他路线，Machame 路线拥挤吗？', answer: 'Machame 路线是乞力马扎罗最受欢迎的路线之一，这意味着在旺季（6月-10月及12月-3月）可能会较为拥挤。'},
    {number: 7, question: '攀登 Machame 路线需要训练吗？', answer: '虽然此前的徒步经验并非必需，但我们强烈建议进行有氧运动、耐力训练以及爬坡步行，以增强体能，为攀登乞力马扎罗做好准备。'},
    {number: 8, question: '经由 Machame 路线攀登乞力马扎罗的最佳时间是什么时候？', answer: '经由 Machame 路线攀登乞力马扎罗的最佳时间是 6 月至次年 3 月，此时天气稳定，天空晴朗，降水风险较低——非常适合安全愉快的徒步。'},
    {number: 9, question: 'Machame 路线有多少个营地？', answer: 'Machame 路线共设有六个夜宿营地，每个营地都提供休息与高原适应的场所：Machame Camp、Shira Camp、Barranco Camp、Karanga Camp、Barafu Camp、Mweka Camp。'},
    {number: 10, question: 'Machame 路线的主要亮点有哪些？', answer: 'Machame 路线的亮点包括：穿越乞力马扎罗山脚下茂密的雨林、攀登标志性的 Barranco Wall——一段令人兴奋且景色壮丽的攀登，以及最终抵达 Uhuru Peak——非洲最高点，海拔 5,895 米。'},
  ],
}

const marangu: RouteZh = {
  slug: 'marangu-route',
  name: 'Marangu 路线',
  seoTitle: 'Marangu 路线 | Climbing Kilimanjaro Tanzania',
  seoDescription: '经由 Marangu 路线攀登乞力马扎罗——唯一提供小屋住宿的路线。真实每日行程、价格与专家建议。',
  heroHeading: '经由 Marangu 路线攀登乞力马扎罗',
  heroTagline: '经典的乞力马扎罗徒步之旅',
  heroBody: [
    '被称为「可口可乐路线」的 Marangu 路线，是通往乞力马扎罗山顶最成熟、最舒适的路线。它是唯一提供小屋住宿的路线，因此深受那些希望减少徒步艰辛的旅行者青睐。',
    '这条步道穿越茂密雨林、石楠荒原及高山荒漠，坡度平缓，最终抵达冰雪覆盖的 Uhuru Peak 山顶。它非常适合初次徒步者，或是希望采用更直接方式登顶的旅行者。',
  ],
  heroImage: {src: '/images/routes/marangu/hero.jpg', alt: 'Marangu 路线上的 A 字形山间小屋，背景为森林'},
  itineraryHeading: 'Marangu 路线行程',
  itinerarySubheading: '通往非洲之巅的舒适之路',
  daysLabel: '5 天',
  stops: [
    arrivalStopZh,
    {
      label: '徒步第 1 天：Marangu Gate → Mandara Hut',
      meta: ['📍 Marangu Gate（1,870 米）→ Mandara Hut（2,700 米）', '📈 爬升高度：830 米', '⏳ 用时：4-5 小时'],
      body: [
        '徒步之旅从莫希前往 Marangu Gate 开始。完成登记后，您将进入茂密雨林，沿着一条维护良好的步道展开徒步。步道通常潮湿而阴凉，沿途可见苔藓覆盖的树木、鸟鸣声及嬉戏的猴群。',
        '傍晚时分抵达 Mandara Hut。如果天气与体力允许，可进行一段短途步行，前往 Maundi 火山口，欣赏肯尼亚与坦桑尼亚北部的壮丽景色。',
      ],
    },
    {
      label: '徒步第 2 天：Mandara Hut → Horombo Hut',
      meta: ['📍 Mandara Hut（2,700 米）→ Horombo Hut（3,720 米）', '📈 爬升高度：1,020 米', '⏳ 用时：6-7 小时'],
      body: [
        '离开雨林后，您将进入石楠荒原地带，景观由此发生显著变化。步道稳步穿越开阔地带，沿途布满巨型千里光植物与半边莲。',
        '沿途，您将首次完整地看到基博峰与马文济峰。Horombo Hut 以壮丽全景以及结识其他徒步者的机会静候您的到来。',
      ],
    },
    {
      label: '徒步第 3 天：Horombo Hut → Kibo Hut',
      meta: ['📍 Horombo Hut（3,720 米）→ Kibo Hut（4,703 米）', '📈 爬升高度：983 米', '⏳ 用时：6-7 小时'],
      body: [
        '今天的行程漫长而干燥，穿越高山荒漠地形。您将徒步穿过马文济峰与基博峰之间的鞍部，这是一片广阔而荒凉、景色壮观的地带。空气愈发稀薄，请放慢脚步并保持充分补水。',
        '午后不久抵达 Kibo Hut——请提早休息，为午夜开始的登顶冲刺做好准备。',
      ],
    },
    {
      label: '徒步第 4 天：Kibo Hut → Uhuru Peak → Horombo Hut',
      meta: [
        '📍 Kibo Hut（4,703 米）→ Uhuru Peak（5,895 米）→ Horombo Hut（3,720 米）',
        '📈 爬升高度：1,192 米（上坡），随后下降',
        '⏳ 用时：11-14 小时',
      ],
      body: [
        '您的登顶之旅在清晨早早开始，在黑暗中沿着之字形步道与碎石坡前行，直至抵达 Gilman\'s Point（5,685 米），随后沿火山口边缘前往 Uhuru Peak——非洲之巅。',
        '记录下登顶时刻后，下降至 Kibo Hut 短暂休息，随后继续前往 Horombo Hut，享受一夜应得的安眠。',
      ],
    },
    {
      label: '徒步第 5 天：Horombo Hut → Marangu Gate',
      meta: ['📍 Horombo Hut（3,720 米）→ Marangu Gate（1,870 米）', '📉 下降高度：1,850 米', '⏳ 用时：6-7 小时'],
      body: [
        '在最后一天，您将穿越石楠荒原与茂密雨林，返回起点。下坡路段相对轻松，但在潮湿路段仍需留意脚下。',
        '在入口处，您将领取登顶证书，随后返回莫希——疲惫却满怀自豪。',
      ],
    },
    departureStopZh,
  ],
  infoTabsHeading: '为什么选择 Marangu？',
  tabs: [
    {
      id: 'duration',
      label: '行程时长',
      blocks: [
        {
          heading: '选择 Marangu 路线有哪些优势？',
          bullets: [
            '唯一提供小屋住宿的路线——与其他需要露营的路线不同，Marangu 路线提供宿舍式双层床的共享小屋住宿。对于偏好在室内而非帐篷中过夜的登山者而言，这是一大优势——尤其是在雨季期间。',
            '更经济的选择——由于上下山使用同一条步道，后勤更为简化，这使 Marangu 成为乞力马扎罗最经济实惠的路线之一。',
            '平缓渐进的步道——步道维护良好，坡度平稳适中，非常适合初次徒步者，或希望相较 Umbwe、Machame 等陡峭路线体能负担更小的登山者。',
            '更短行程时长的选择（5 或 6 天）——您可以选择 5 天或 6 天的行程。6 天版本包含一个高原适应日，有助于提高登顶成功的机会。',
            '雨季登山的理想选择——由于提供小屋住宿，且穿越的泥泞地形较其他路线更少，Marangu 是坦桑尼亚雨季（3月-5月及11月）期间更佳的选择。',
            '直接返程路线——下山使用同一条步道，在后勤管理上可能更为简便，尤其适合时间紧迫或偏好简单行程的旅行者。',
            '短时间内的风景多样性——尽管是较短的路线之一，您仍将穿越多个植被带——从茂密雨林开始，经过石楠荒原，最终抵达冰封山顶前的高山荒漠。',
            '可前往 Maundi 火山口——第一天，一段可选的短途步行可通往 Maundi 火山口——一处宁静的观景点，可欣赏坦桑尼亚北部与肯尼亚的美丽景色。',
          ],
        },
        {
          heading: '价格示例（每人，美元）',
          paragraphs: [
            '经由 Marangu 路线攀登乞力马扎罗通常需要 5 或 6 天，具体取决于所选行程。除了最具挑战性、耗时可达 12-14 小时（含下山）的登顶夜外，每天的徒步时间为 4 至 7 小时。价格会因季节与团队规模略有不同。',
          ],
          bullets: [
            '5 天方案：更快速的登山，高原适应时间有限，适合经验丰富的徒步者，但登顶成功率相对较低。',
            '6 天方案：在 Horombo Hut 增加一天用于高原适应。这有助于身体更好地适应海拔，大幅提高登顶成功的机会。',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: '价格详情',
      blocks: [
        {
          heading: 'Marangu 路线的费用是多少？',
          pricingTable: {
            columns: ['时长', '1 人', '2-3 人', '4-6 人', '7 人以上'],
            rows: [
              {label: '5 天', values: ['1,850 美元', '1,750 美元', '1,600 美元', '1,450 美元']},
              {label: '6 天', values: ['2,050 美元', '1,950 美元', '1,750 美元', '1,600 美元']},
            ],
          },
        },
      ],
    },
    {
      id: 'stay',
      label: '住宿地点',
      blocks: [
        {
          heading: '沿途舒适的山间小屋——无需露营！',
          paragraphs: [
            '与其他需要帐篷的乞力马扎罗路线不同，Marangu 路线是唯一拥有永久性山间小屋的路线，提供更为舒适且能遮风避雨的体验。如果您更偏好真正的床铺、遮头之所以及虽为共享但坚固可靠的住所，这是绝佳选择。',
            '🛏️ 住宿概览：',
          ],
          bullets: [
            'Mandara Hut（2,700 米）：位于雨林地带，Mandara 提供被葱郁绿意环绕的温馨 A 字形小屋。每间小屋可容纳 4 至 8 名登山者，附近设有共用卫生设施。',
            'Horombo Hut（3,720 米）：位于石楠荒原地带，Horombo 规模更大，同时容纳上山与下山的徒步者。这里可欣赏马文济峰及下方平原的壮丽景色。',
            'Kibo Hut（4,703 米）：位于高山荒漠地带的简朴石屋，Kibo 是登顶前的最后一处大本营。请预期宿舍式的双层床房间，以及高海拔地区简朴的氛围。',
            '🚿 设施包括：床垫与枕头、供应热食的用餐区、部分小屋配有太阳能照明、干净但基础的共用卫生设施、无淋浴设施（请自备湿巾或用水简单清洁）。',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: '人气与人流',
      blocks: [
        {
          heading: '备受欢迎，人气极高，常是初学者的首选。',
          paragraphs: [
            'Marangu 路线是乞力马扎罗最受欢迎的路线之一——常因其更便捷的通行方式及小屋住宿而被称为「可口可乐路线」。它吸引了大量登山者，尤其是在旺季（1月-3月及6月-10月）期间。',
            '📌 为何如此受欢迎？它是唯一提供山间小屋的路线，对不愿露营的人极具吸引力。较短的时长（5-6天）也吸引了行程紧凑的旅行者。它被认为体能要求相对较低（尽管高海拔仍是一项严峻挑战）。',
            '🙋‍♂️ 人流方面的预期：相较 Lemosho 或 Rongai 等路线，这条路线上的徒步者会更多。小屋可能会较为拥挤，尤其是同时接待上下山徒步者的 Horombo 与 Kibo。',
            '⚠️ 提示：如果您追求宁静、希望减少人流，可考虑在过渡季节（3月底或11月初）登山，或选择人流较少的更长路线。',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: '专家见解',
      blocks: [
        {
          heading: '经验丰富的向导与乞力马扎罗专家的见解。',
          paragraphs: [
            'Marangu 路线常被认为是攀登乞力马扎罗「最容易」的方式，但专家一致认为，绝不应低估这条路线。',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Marangu 路线',
  secondaryTagline: '轻松体验乞力马扎罗——住小屋，而非帐篷。',
  faqHeading: '关于 Marangu 路线的 10 个问题',
  faqs: [
    {number: 1, question: 'Marangu 路线需要多长时间？', answer: 'Marangu 路线通常需要 5 或 6 天。6 天行程在 Horombo Hut 增加一个额外的高原适应日，能提高成功登顶的机会。'},
    {number: 2, question: 'Marangu 路线的难度如何？', answer: '这条路线被认为难度中等。步道循序渐进且标记清晰，非常适合初学者——但高海拔仍可能带来挑战。'},
    {number: 3, question: '经由 Marangu 路线登顶的成功率是多少？', answer: '成功率因天数而异。5 天方案由于高原适应时间较短，成功率较低，而 6 天版本提供更好的机会，若操作得当，成功率约为 80%。'},
    {number: 4, question: 'Marangu 路线风景优美吗？', answer: '是的，Marangu 路线拥有美丽的风光。您将穿越雨林、石楠荒原及高山荒漠地带，山顶附近可见壮丽景色——不过相比 Lemosho 或 Machame 等路线，多样性略逊一筹。'},
    {number: 5, question: 'Marangu 路线每日平均徒步距离是多少？', answer: '徒步者平均每天徒步 8 至 12 公里，具体取决于路段。登顶日路程最长，徒步距离超过 18 公里。'},
    {number: 6, question: '相比其他路线，Marangu 路线拥挤吗？', answer: 'Marangu 路线是最受欢迎、人流最多的路线之一，尤其是在旱季期间。它吸引了偏好小屋住宿及较短行程的登山者。'},
    {number: 7, question: '攀登 Marangu 路线需要训练吗？', answer: '是的，强烈建议进行基础训练与体能准备。请在出发前数周专注于有氧运动、徒步练习及耐力训练。'},
    {number: 8, question: '经由 Marangu 路线攀登乞力马扎罗的最佳时间是什么时候？', answer: '最佳月份为旱季：1月至3月中旬，以及6月至10月，此时步道更为干燥，视野也更加清晰。'},
    {number: 9, question: 'Marangu 路线有多少个小屋？', answer: '共有三个主要小屋站点：Mandara Hut、Horombo Hut 与 Kibo Hut，均配备双层床、基础用餐区及卫生设施。'},
    {number: 10, question: 'Marangu 路线的主要亮点有哪些？', answer: '这条路线以舒适的小屋、深厚的历史意义及丰富的风景多样性而闻名。它还可通往 Maundi 火山口，并能欣赏马文济峰的景色——是一段兼具舒适感的经典登山之旅。'},
  ],
}

const lemosho: RouteZh = {
  slug: 'lemosho-route',
  name: 'Lemosho 路线',
  seoTitle: 'Lemosho 路线 | Climbing Kilimanjaro Tanzania',
  seoDescription: '经由 Lemosho 路线攀登乞力马扎罗——这座山上风景最秀丽、行程最均衡的路线之一。真实每日行程、价格与专家建议。',
  heroHeading: '经由 Lemosho 路线攀登乞力马扎罗',
  heroTagline: '通往乞力马扎罗山顶的一段风景秀丽、循序渐进的攀登',
  heroBody: [
    'Lemosho 路线是攀登乞力马扎罗最美丽、最均衡的方式之一。从山体偏远的西侧出发，提供了一个人流较少的宁静起点、壮丽的景色，以及帮助身体适应海拔的稳定节奏。',
    '这条路线因其较高的成功率、多样的风光及出色的高原适应表现，深受经验丰富的徒步者与初学者的喜爱。无论您选择 7 天还是 8 天版本，都将享受一段穿越雨林、石楠荒原、高山荒漠，最终抵达 Uhuru Peak 冰川的精彩旅程。',
  ],
  heroImage: {src: '/images/routes/lemosho/hero.webp', alt: 'Barafu Camp 的帐篷与云层之上白雪皑皑的基博峰'},
  itineraryHeading: 'Lemosho 路线行程',
  itinerarySubheading: '通往非洲之巅的宁静起点',
  daysLabel: '7 天',
  stops: [
    arrivalStopZh,
    {
      label: '徒步第 1 天：Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate（2,100 米）→ Mti Mkubwa（2,650 米）', '📈 爬升高度：550 米', '⏳ 用时：3-4 小时'],
      body: ['完成登记后，您的徒步之旅将穿越茂密雨林展开，途中很有机会邂逅猴群与色彩斑斓的鸟类。傍晚时分抵达 Mti Mkubwa，即「大树营地」。'],
    },
    {
      label: '徒步第 2 天：Mti Mkubwa – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa（2,650 米）→ Shira 1 Camp（3,610 米）', '📈 爬升高度：960 米', '⏳ 用时：5-6 小时'],
      body: ['今天步道离开森林，进入石楠荒原地带。穿越 Shira 高原——一处古老的熔岩流地貌——沿途景色豁然开朗，蔚为壮观。'],
    },
    {
      label: '徒步第 3 天：Shira 1 – Shira 2 Camp',
      meta: ['📍 Shira 1（3,610 米）→ Shira 2 Camp（3,850 米）', '📈 爬升高度：240 米', '⏳ 用时：3-4 小时'],
      body: ['这是轻松的一天，沿高原地带轻微起伏前行。您将首次瞥见基博峰，并在安顿营地的过程中逐渐完成高原适应。'],
    },
    {
      label: '徒步第 4 天：Shira 2 – Lava Tower – Barranco Camp',
      meta: ['📍 Shira 2（3,850 米）→ Lava Tower（4,600 米）→ Barranco Camp（3,976 米）', '📈 高度变化：上升 750 米 / 下降 624 米', '⏳ 用时：6-7 小时'],
      body: ['这是一个高原适应日。您将攀升至 Lava Tower 高处，随后下降至 Barranco 过夜——这种「高处攀登，低处扎营」的方式有助于身体适应海拔。'],
    },
    {
      label: '徒步第 5 天：Barranco – Karanga Camp – Barafu Camp',
      meta: ['📍 Barranco Camp（3,976 米）→ Karanga Camp（4,035 米）→ Barafu Camp（4,673 米）', '📈 爬升高度：697 米', '⏳ 用时：8-9 小时'],
      body: [
        '您的一天从沿着标志性的 Barranco Wall 攀升开始——这段陡峭却回报丰厚的攀登可欣赏震撼景色。在 Karanga Camp 短暂停留后，继续沿稳步上坡的高山荒漠地形前行，直至抵达 Barafu Camp。',
        '这里是您冲顶的大本营。请提前用晚餐并充分休息，为午夜出发冲击 Uhuru Peak 做好准备。',
      ],
    },
    {
      label: '徒步第 6 天：Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp（4,673 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
        '📈 高度变化：上升 1,222 米，下降 2,785 米',
        '⏳ 用时：12-14 小时',
      ],
      body: [
        '登顶日在星光璀璨的夜空下于午夜前后开始。步道漫长而陡峭，但慢而稳的节奏才是致胜关键。抵达 Stella Point（5,739 米）后，继续沿火山口边缘前行，直至抵达 Uhuru Peak——非洲最高点。',
        '庆祝这一壮举，拍照留念，随后开始下降前往 Mweka Camp。请做好双腿酸痛的准备，迎接一场深沉而恢复元气的睡眠。',
      ],
    },
    {
      label: '徒步第 7 天：Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp（3,110 米）→ Mweka Gate（1,640 米）', '📉 下降高度：1,470 米', '⏳ 用时：3-4 小时'],
      body: ['您的最后一天是一段惬意的下山旅程，穿越茂密雨林，伴随鸟鸣声，或许还能遇见猴群。在 Mweka Gate，您将办理离境手续，领取登顶证书，并与司机会合返回莫希。'],
    },
    departureStopZh,
  ],
  infoTabsHeading: '为什么选择 Lemosho？',
  tabs: [
    {
      id: 'duration',
      label: '行程时长',
      blocks: [
        {
          heading: '选择 Lemosho 路线有哪些优势？',
          paragraphs: [
            'Lemosho 路线被广泛认为是乞力马扎罗风景最秀丽、行程最均衡的路线——这并非没有原因。它完美融合了美景、挑战与高原适应，使其成为初学者与经验丰富的徒步者的最佳选择之一。',
            '与其他路线不同，Lemosho 从山体偏远的西侧出发，穿越未受破坏的雨林，提供宁静的起点，随后才与人流更多的 Machame 路线汇合。这意味着起初人流更少、观察野生动物的机会更多，从头到尾都能欣赏震撼的全景。',
            '选择 Lemosho 的另一个理由？成功率。得益于更长的行程（7 或 8 天），您将更循序渐进地获得海拔提升——为身体争取充分的适应时间。这将大大提高您安全登顶、并在登顶夜保持强健状态的机会。',
            '如果您正在寻找一条能提供绝美风光、充足高原适应时间以及一段回报丰厚的探险、同时又能避开初期人流的路线，Lemosho 难有对手。',
          ],
        },
        {
          heading: 'Lemosho 路线需要多长时间？',
          paragraphs: [
            'Lemosho 路线通常需要 7 或 8 天，具体取决于所选行程。8 天方案在 Karanga Camp 增加一个额外的高原适应日，提升您舒适登顶的机会。这一延长的时长使其成为高海拔适应及更为轻松的徒步节奏的最佳路线之一。',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: '价格详情',
      blocks: [
        {
          heading: 'Lemosho 路线的费用是多少？',
          paragraphs: [
            'Lemosho 路线的价格因团队规模及服务水平而异，以下是大致概览。这些费用通常包括公园门票、向导及背夫支持、餐食、帐篷及交通。私人登山及豪华套餐也可按更高价格预订。',
          ],
          bullets: ['7 天徒步：每人 2,200 至 2,700 美元起', '8 天徒步：每人 2,400 至 2,900 美元起'],
        },
      ],
    },
    {
      id: 'stay',
      label: '住宿地点',
      blocks: [
        {
          heading: 'Lemosho 路线沿途有哪些营地？',
          paragraphs: [
            '与 Marangu 路线不同，Lemosho 是一条纯露营路线。您将入住由运营方提供的高品质高山帐篷。Shira、Barranco 及 Barafu 等营地拥有令人惊叹的景色——试想云端之上的日出与繁星满天的夜晚。所有餐食均由山地厨师现场烹制，并为您提供餐厅帐篷以增添舒适感。',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: '人气与人流',
      blocks: [
        {
          heading: 'Lemosho 路线拥挤吗？',
          paragraphs: [
            'Lemosho 路线从乞力马扎罗偏远的西侧出发，意味着头几天的徒步者较少。第 4 天，它与 Machame 路线汇合，因此靠近山顶时人流会有所增加。尽管如此，Lemosho 在前期路段的人流仍少于 Marangu 或 Machame，提供了更为宁静、风景更佳的起点。',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: '专家见解',
      blocks: [
        {
          heading: '我们对 Lemosho 路线的看法是什么？',
          paragraphs: [
            'Lemosho 常被认为是乞力马扎罗最美、最均衡的路线。它兼具卓越的风光、出色的高原适应效果，以及较高的登顶成功率。大多数经验丰富的向导会将其推荐给希望在不匆忙的情况下获得最佳成功机会的初学者。从西侧出发的方式，也为徒步初期提供了更为原始的荒野体验。',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Lemosho 路线',
  secondaryTagline: 'Lemosho 从别处未曾涉足的地方开始——这改变了一切。',
  faqHeading: '关于 Lemosho 路线的 10 个问题',
  faqs: [
    {number: 1, question: '经由 Lemosho 路线攀登乞力马扎罗需要多长时间？', answer: '大多数登山者用 7 或 8 天完成 Lemosho 路线。8 天方案增加一个额外的高原适应日，提高登顶的机会。'},
    {number: 2, question: 'Lemosho 路线难度大吗？', answer: 'Lemosho 被认为难度中等偏高。它并非技术性路线，但登顶日漫长而艰苦。较长的时长有助于高原适应，使大多数体能良好的徒步者都能应对。'},
    {number: 3, question: 'Lemosho 路线的登顶成功率是多少？', answer: 'Lemosho 展现出乞力马扎罗所有路线中最高的成功率之一——8 天行程的成功率高达 90%，这得益于渐进式的海拔提升与出色的高原适应表现。'},
    {number: 4, question: 'Lemosho 路线风景优美吗？', answer: '是的——Lemosho 常被称为乞力马扎罗最美的路线。它拥有多样的风光，从雨林与石楠荒原到高山荒漠及冰川景色。'},
    {number: 5, question: 'Lemosho 路线拥挤吗？', answer: 'Lemosho 从山体宁静的西侧出发，因此头几天较为清静、人流较少。它在靠近 Lava Tower 处与人流更多的 Machame 路线汇合，但总体而言，仍比 Marangu 等路线人流更少。'},
    {number: 6, question: 'Lemosho 路线提供哪种类型的住宿？', answer: 'Lemosho 是一条纯露营路线。您将在指定营地入住高品质帐篷。背夫会为您运输并搭建全部露营装备。'},
    {number: 7, question: 'Lemosho 路线适合初学者吗？', answer: '是的，尤其是选择 8 天版本时。更长的行程能让初学者获得更多适应与休息的时间，提高登顶成功率与舒适度。'},
    {number: 8, question: '攀登 Lemosho 路线的最佳时间是什么时候？', answer: '最佳月份为 1 月至 3 月，以及 6 月至 10 月，此时天气更为干燥，能见度也更佳。这些时段能提供更安全的徒步体验及更清晰的登顶景色。'},
    {number: 9, question: '我需要为 Lemosho 路线进行训练吗？', answer: '强烈建议进行训练。请专注于有氧、力量及耐力训练。负重远足是为高海拔及每日徒步时长做准备的最佳方式。'},
    {number: 10, question: '为什么选择 Lemosho 路线而非其他路线？', answer: 'Lemosho 在风光、成功率与人流管理之间实现了最佳平衡。它非常适合希望获得更为原始的体验、同时提高登顶机会的徒步者。'},
  ],
}

const rongai: RouteZh = {
  slug: 'rongai-route',
  name: 'Rongai 路线',
  seoTitle: 'Rongai 路线 | Climbing Kilimanjaro Tanzania',
  seoDescription: '经由 Rongai 路线攀登乞力马扎罗——唯一从北侧进入这座山的路线。真实每日行程、价格与专家建议。',
  heroHeading: 'Rongai 路线，乞力马扎罗偏远的北线',
  heroTagline: '通往乞力马扎罗的和缓北方步道。',
  heroBody: [
    'Rongai 路线是唯一从靠近肯尼亚边境的北侧进入乞力马扎罗的路线，提供更为宁静、偏远的体验，风光循序渐进地变化，人流也更少。它非常适合那些渴望一段平静登山之旅、欣赏野生动物观赏、并偏好更干燥路线的旅行者——尤其是在雨季期间。',
    '虽然起初风景略逊于 Lemosho 等路线，但 Rongai 路线以其宁静氛围、成功率，以及经由基博峰火山口边缘最终登顶的壮观方式弥补了这一点。下山则经由 Marangu 路线，让您有机会领略这座山的两个侧面。',
  ],
  heroImage: {src: '/images/routes/rongai/hero.webp', alt: '登山者在乞力马扎罗 Uhuru Peak 山顶标志前留影'},
  itineraryHeading: 'Rongai 路线行程',
  itinerarySubheading: '来自北方的宁静步道',
  daysLabel: '7 天',
  stops: [
    arrivalStopZh,
    {
      label: '徒步第 1 天：Nalemoru Gate – Simba Camp',
      meta: ['📍 Nalemoru Gate（1,950 米）→ Simba Camp（2,600 米）', '📈 爬升高度：650 米', '⏳ 用时：3-4 小时'],
      body: ['从靠近肯尼亚边境的乞力马扎罗东北侧出发。步道穿越茂密森林与开阔农田，随后抵达位于石楠地带的 Simba Camp。'],
    },
    {
      label: '徒步第 2 天：Simba Camp – Second Cave Camp',
      meta: ['📍 Simba Camp（2,600 米）→ Second Cave Camp（3,450 米）', '📈 爬升高度：850 米', '⏳ 用时：5-6 小时'],
      body: ['步道循序渐进地穿越开阔的石楠荒原，可俯瞰下方平原全景，前方矗立着崎岖的马文济峰。'],
    },
    {
      label: '徒步第 3 天：Second Cave Camp – Kikelewa Camp',
      meta: ['📍 Second Cave Camp（3,450 米）→ Kikelewa Camp（3,600 米）', '📈 爬升高度：150 米', '⏳ 用时：3-4 小时'],
      body: ['今天的徒步较短，爬升高度较小，为高原适应留出时间。随着逐渐进入高山地带，植被也变得愈发稀疏。'],
    },
    {
      label: '徒步第 4 天：Kikelewa Camp – Mawenzi Tarn',
      meta: ['📍 Kikelewa Camp（3,600 米）→ Mawenzi Tarn（4,330 米）', '📈 爬升高度：730 米', '⏳ 用时：4-5 小时'],
      body: ['步道变得更加陡峭，通往坐落于壮观马文济尖峰下方的一处美丽冰川湖。这是乞力马扎罗最具风情的营地之一。'],
    },
    {
      label: '徒步第 5 天：Mawenzi Tarn – Kibo Hut',
      meta: ['📍 Mawenzi Tarn（4,330 米）→ Kibo Hut（4,700 米）', '📈 爬升高度：370 米', '⏳ 用时：5-6 小时'],
      body: ['穿越马文济峰与基博峰之间广阔的高山荒漠鞍部。地貌荒凉而寂静，让您在心理上为即将到来的登顶挑战做好准备。'],
    },
    {
      label: '徒步第 6 天：Kibo Hut – Uhuru Peak – Horombo Hut',
      meta: [
        '📍 Kibo Hut（4,700 米）→ Uhuru Peak（5,895 米）→ Horombo Hut（3,720 米）',
        '📈 爬升高度：1,195 米',
        '📉 下降高度：2,175 米',
        '⏳ 用时：12-14 小时',
      ],
      body: ['登顶日在午夜后不久开始。抵达 Uhuru Peak，欣赏一场难忘的日出后，下降至 Horombo Hut，享受应得的休息。'],
    },
    {
      label: '徒步第 7 天：Horombo Hut – Marangu Gate',
      meta: ['📍 Horombo Hut（3,720 米）→ Marangu Gate（1,860 米）', '📉 下降高度：1,860 米', '⏳ 用时：5-6 小时'],
      body: ['下降穿越茂密雨林，您可能会在途中发现蓝猴与珍奇鸟类。在 Marangu Gate，您将领取登顶证书，与这座山告别。'],
    },
    departureStopZh,
  ],
  infoTabsHeading: '为什么选择 Rongai？',
  tabs: [
    {
      id: 'duration',
      label: '行程时长',
      blocks: [
        {
          heading: '选择 Rongai 路线有哪些优势？',
          paragraphs: [
            'Rongai 路线是乞力马扎罗唯一从靠近肯尼亚边境的北侧登顶的路线。它以人流较少、更为干燥、更加偏远而闻名，可欣赏肯尼亚 Amboseli 平原的绝佳景色，带来独特体验。坡度平缓，非常适合寻求更循序渐进的攀登方式以及更宁静徒步体验的登山者。从雨林与石楠荒原到高山荒漠的多样风光，也使其成为自然爱好者与摄影师的绝佳之选。',
          ],
        },
        {
          heading: 'Rongai 路线需要多长时间？',
          paragraphs: [
            '在山上共 7 天 / 6 晚。',
            '可选择增加一个高原适应日，以获得更轻松的节奏与更高的登顶成功率。',
          ],
        },
      ],
    },
    {
      id: 'pricing',
      label: '价格详情',
      blocks: [
        {
          heading: 'Rongai 路线的费用是多少？',
          paragraphs: ['价格可能因团队规模、包含的服务及运营商的品质而有所不同。平均而言：'],
          bullets: ['私人徒步：每人 2,200 至 2,800 美元起', '团队徒步：每人 1,900 至 2,300 美元起'],
        },
      ],
    },
    {
      id: 'stay',
      label: '住宿地点',
      blocks: [
        {
          heading: 'Rongai 路线沿途有哪些营地？',
          paragraphs: [
            '与使用小屋的 Marangu 路线不同，Rongai 是一条完全露营的路线。您将入住配有泡沫睡垫的四季高山帐篷，餐食则在共用餐厅帐篷中供应。营地包括：',
            '这些营地清静且人流稀少，可欣赏壮丽星空与山景。',
          ],
          bullets: ['Simba Camp', 'Second Cave Camp', 'Kikelewa Camp', 'Mawenzi Tarn', 'Kibo Hut（大本营）', 'Horombo Hut（经由 Marangu 路线下山）'],
        },
      ],
    },
    {
      id: 'crowds',
      label: '人气与人流',
      blocks: [
        {
          heading: 'Rongai 路线拥挤吗？',
          paragraphs: [
            'Rongai 路线是人流最少的路线之一，是追求宁静的徒步者的完美选择。相比 Machame 和 Marangu 等人流更多的路线，Rongai 提供了一段清静的体验，尤其是在徒步初期的几天。即使在旺季，它依然保持着更为平静的氛围。',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: '专家见解',
      blocks: [
        {
          heading: '我们对 Rongai 路线的看法是什么？',
          bullets: [
            '成功率：得益于缓慢而稳定的攀升，以及在 Mawenzi Tarn 进行高原适应的机会，成功率高于平均水平。',
            '天气：北侧步道更为干燥，意味着降雨造成的中断更少。',
            '登顶夜：从 Kibo Hut 出发，直接陡峭攀登至 Gilman\'s Point，随后继续前往 Uhuru Peak。',
            '特色：从 Marangu 一侧下山，让您体验横穿整座山的独特感受——这在乞力马扎罗各条路线中实属难得的乐趣。',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Rongai 路线',
  secondaryTagline: '在一次难忘的旅程中，探索乞力马扎罗的两个侧面。',
  faqHeading: '关于 Rongai 路线的 10 个问题',
  faqs: [
    {number: 1, question: 'Rongai 路线需要多长时间？', answer: '标准行程需要 7 天，但部分登山者会增加一个额外的高原适应日，以提高登顶成功的机会。'},
    {number: 2, question: 'Rongai 路线适合初学者吗？', answer: '是的。它的坡度更为平缓，陡峭攀升较少，是高海拔徒步初学者的绝佳选择。'},
    {number: 3, question: 'Rongai 路线有什么独特之处？', answer: '它是唯一从靠近肯尼亚边境的乞力马扎罗北侧出发的路线，提供干燥的条件及可欣赏 Amboseli 国家公园的独特景色。'},
    {number: 4, question: 'Rongai 路线的登顶成功率是多少？', answer: '以 7 天计算，成功率约为 85-90%，尤其是在包含高原适应日的情况下。'},
    {number: 5, question: '相比其他路线，Rongai 路线拥挤吗？', answer: '它是乞力马扎罗最清静的路线之一，非常适合希望避开 Machame 与 Marangu 等路线上更大人群的旅行者。'},
    {number: 6, question: 'Rongai 路线的营地情况如何？', answer: '您将在 Mawenzi Tarn 和 Kikelewa 等风景如画的营地中露营，这些营地以偏远宁静的环境及壮丽的风光而闻名。'},
    {number: 7, question: '是否沿同一条步道下山？', answer: '不是。您从北侧上山，经由南侧的 Marangu 路线下山，体验更为多样的山体景观。'},
    {number: 8, question: '攀登 Rongai 路线的最佳季节是什么时候？', answer: '1 月至 3 月中旬，以及 6 月至 10 月，天气条件最佳。由于北侧相对干燥，它也是雨季期间的不错选择。'},
    {number: 9, question: '这条路线上高原反应常见吗？', answer: '与所有路线一样，高原反应都有可能发生。不过，Rongai 的渐进式攀登有助于身体更轻松地适应——尤其是采用 7 天行程时。'},
    {number: 10, question: '为什么我应该选择 Rongai 路线而非其他选择？', answer: '如果您正在寻找一条更为清静的步道、出色的高原适应表现，以及丰富的风景多样性而又不受人流困扰，Rongai 提供了乞力马扎罗最出色的整体体验之一。'},
  ],
}

const umbwe: RouteZh = {
  slug: 'umbwe-route',
  name: 'Umbwe 路线',
  seoTitle: 'Umbwe 路线 | Climbing Kilimanjaro Tanzania',
  seoDescription: '经由 Umbwe 路线攀登乞力马扎罗——这座山上最陡峭、最直接的路线。真实每日行程、价格与专家建议。',
  heroHeading: 'Umbwe 路线',
  heroTagline: '通往孤寂与登顶荣耀的陡峭步道',
  heroBody: [
    'Umbwe 路线是通往乞力马扎罗山顶最直接——也可以说是最具挑战性——的路线。以其陡峭的攀升、崎岖的山脊与令人兴奋的地形而著称，深受寻求大胆且人流较少路线的经验丰富徒步者青睐。',
    '与更受欢迎的路线不同，Umbwe 提供真正的荒野体验、更少的人流，以及穿越茂密雨林、陡峭山脊与高海拔高山地带的加速挑战。虽然体能消耗极大，但回报是无与伦比的孤寂感与壮观的山间美景。',
  ],
  heroImage: {src: '/images/routes/umbwe/hero.jpg', alt: 'Karanga Camp 色彩缤纷的帐篷，背景为白雪覆盖的基博峰'},
  itineraryHeading: 'Umbwe 路线行程',
  itinerarySubheading: '通往山顶最陡峭、最直接的路径',
  daysLabel: '6 天',
  stops: [
    arrivalStopZh,
    {
      label: '徒步第 1 天：Umbwe Gate – Umbwe Cave Camp',
      meta: ['📍 Umbwe Gate（1,800 米）→ Umbwe Cave Camp（2,850 米）', '📈 爬升高度：1,050 米', '⏳ 用时：5-7 小时'],
      body: ['在 Umbwe Gate 完成登记后，步道直接进入雨林。您将沿着一条狭窄陡峭、两旁生长着巨树、苔藓与交织树根的山脊前行。从一开始就请做好体能挑战的准备——但同时也能在攀升至林冠之上时，欣赏到令人难以置信的美景。'],
    },
    {
      label: '徒步第 2 天：Umbwe Cave Camp – Barranco Camp',
      meta: ['📍 Umbwe Cave Camp（2,850 米）→ Barranco Camp（3,900 米）', '📈 爬升高度：1,050 米', '⏳ 用时：4-6 小时'],
      body: ['您将离开森林，进入石楠与欧石南地带，攀爬陡峭的山脊，俯瞰下方山谷的壮丽景色。您将在 Barranco Camp 与来自 Machame 和 Lemosho 路线的徒步者会合。'],
    },
    {
      label: '徒步第 3 天：Barranco Camp – Karanga Camp',
      meta: ['📍 Barranco Camp（3,900 米）→ Karanga Camp（3,995 米）', '📈 爬升高度：95 米', '⏳ 用时：4-5 小时'],
      body: ['征服著名的 Barranco Wall——一段充满乐趣、可欣赏全景的攀登——之后，步道穿越山谷起伏前行，最终抵达坐落于风口山脊上的 Karanga Camp。'],
    },
    {
      label: '徒步第 4 天：Karanga Camp – Barafu Camp',
      meta: ['📍 Karanga Camp（3,995 米）→ Barafu Camp（4,673 米）', '📈 爬升高度：678 米', '⏳ 用时：3-4 小时'],
      body: ['较短的徒步行程让身体有时间休息，为登顶夜做好准备。您将于中午时分抵达 Barafu Camp。下午专注于补水、用餐与休息，为午夜开始的最后冲刺蓄力。'],
    },
    {
      label: '徒步第 5 天：Barafu Camp – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 Barafu Camp（4,673 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
        '📈 爬升高度：1,222 米',
        '📉 下降高度：2,785 米',
        '⏳ 用时：12-16 小时',
      ],
      body: ['午夜出发，带您在星空下登顶。日出时分抵达 Uhuru Peak，随后开始漫长的下降前往 Mweka Camp。这是最艰难的一天——无论在心理还是体力上——但也是最难忘的一天。'],
    },
    {
      label: '徒步第 6 天：Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp（3,110 米）→ Mweka Gate（1,640 米）', '📉 下降高度：1,470 米', '⏳ 用时：3-4 小时'],
      body: ['最后的下降穿越茂密雨林，抵达 Mweka Gate，您的登顶证书正在此等候。与这座山道别，尽情享受返回莫希或阿鲁沙的旅程。'],
    },
    departureStopZh,
  ],
  infoTabsHeading: '为什么选择 Umbwe？',
  tabs: [
    {
      id: 'duration',
      label: '行程时长',
      blocks: [
        {
          heading: '选择 Umbwe 路线有哪些优势？',
          paragraphs: [
            '如果您正在乞力马扎罗寻求一场大胆、充满肾上腺素的冒险，Umbwe 路线正是为您而设。它是通往山顶最陡峭、最直接的路线——带来一场穿越原始未经雕琢风光的刺激攀登。由于人流较少，这里步道清静、自然之美原汁原味，与山之间建立起许多其他路线难以比拟的亲密联系。它深受经验丰富的徒步者与冒险爱好者的青睐，他们追求一段远离人群、清静的体验，且不因额外的挑战而却步。',
            '如果您希望获得以下体验，请选择 Umbwe：',
            '⚠️ 注意：由于攀升速度快、高原适应时间有限，这条路线最适合经验丰富或体能极佳的徒步者。',
          ],
          bullets: [
            '更清静、更偏远的步道',
            '即使在旺季，人流也更少',
            '一段陡峭直接、快速获得海拔提升的攀登',
            '沿途风景如画的山脊与壮丽景色',
            '总里程更短、速度更快的攀登',
          ],
        },
        {
          heading: 'Umbwe 路线需要多长时间？',
          paragraphs: ['它是通往山顶最短、最直接的路线之一，意味着在山上停留的时间更短——但也带来更大的体能与海拔挑战。'],
          bullets: ['总天数：6 天（5 个徒步日 + 登顶）', '距离：约 53 公里', '起点：Umbwe Gate（1,800 米）', '山顶：Uhuru Peak（5,895 米）', '终点：Mweka Gate（1,640 米）'],
        },
      ],
    },
    {
      id: 'pricing',
      label: '价格详情',
      blocks: [
        {
          heading: 'Umbwe 路线的费用是多少？',
          paragraphs: [
            '尽管价格会因团队规模、运营商及包含服务而异，以下是 6 天 Umbwe 登山的大致估算：',
            '包含服务通常涵盖：公园及救援费用、帐篷、露营装备及餐食、经验丰富的向导、背夫与厨师、往返起点的交通、登顶证书。',
            '🧾 提示：请务必确认价格是否包含前后住宿、装备租赁，以及给背夫与向导的小费。',
          ],
          bullets: ['团队游：每人 1,800 至 2,300 美元', '私人徒步：每人 2,400 美元至 3,000 美元以上'],
        },
      ],
    },
    {
      id: 'stay',
      label: '住宿地点',
      blocks: [
        {
          heading: 'Umbwe 路线沿途有哪些营地？',
          paragraphs: [
            '与使用小屋的 Marangu 路线不同，Umbwe 路线是一次完全的露营体验。您将入住每天由背夫搭建的营地。营地位于：',
            '请期待壮观的夜空、清新的山间空气，以及帐篷中温暖睡袋带来的舒适感。',
          ],
          bullets: ['Umbwe Cave Camp', 'Barranco Camp', 'Karanga Camp', 'Barafu Camp', 'Mweka Camp（下山途中）'],
        },
      ],
    },
    {
      id: 'crowds',
      label: '人气与人流',
      blocks: [
        {
          heading: 'Umbwe 路线拥挤吗？',
          paragraphs: [
            'Umbwe 是乞力马扎罗人流最少的路线之一。您甚至可能在步道上独自行走数小时，尤其是在较低的路段。一旦在 Barranco Camp 与 Machame 和 Lemosho 的登山者会合，人流会稍微增多——但仍比其他路线更为清静。如果孤寂对您很重要，这是绝佳之选。',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: '专家见解',
      blocks: [
        {
          heading: '我们对 Umbwe 路线的看法是什么？',
          bullets: [
            '高原适应有限，这增加了挑战性。这条路线并不适合高海拔徒步的初学者。',
            '如果您选择 Umbwe，向导建议提前进行适应性徒步或高海拔训练。',
            '相比更长的路线，登顶成功率较低，但体能强健、节奏得当且补水充分的徒步者往往表现出色。',
            '对于有技术性徒步经验的人来说，Barranco Wall 是一段充满乐趣、风景优美的路段，而非令人畏惧的攀登。',
            '较短的时长意味着更少的假期或旅行天数——但同时也要求更好的体能状况。',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Umbwe 路线',
  secondaryTagline: '通往孤寂与登顶荣耀的陡峭步道。',
  faqHeading: '关于 Umbwe 路线的 10 个问题',
  faqs: [
    {number: 1, question: '经由 Umbwe 路线攀登乞力马扎罗需要多长时间？', answer: 'Umbwe 路线通常需要 6 天，包含登顶日与下山。部分登山者会选择 7 天版本，以获得更充分的高原适应时间，不过 6 天是常规安排。'},
    {number: 2, question: 'Umbwe 路线难度大吗？', answer: '是的——Umbwe 被认为是乞力马扎罗最难的非技术性路线。其陡峭快速的攀升留给高原适应的时间很少，因此更适合经验丰富、体能状况良好的徒步者。'},
    {number: 3, question: 'Umbwe 路线的成功率是多少？', answer: '由于行程较短、坡度陡峭，登顶成功率低于更长的路线——通常约为 60-70%。增加额外的高原适应日可以提高您的成功机会。'},
    {number: 4, question: 'Umbwe 路线拥挤吗？', answer: '完全不会。它是这座山上人流最少的路线之一。您将享受清静的步道与宁静的营地，尤其是在 Barranco 与其他路线会合之前的初期路段。'},
    {number: 5, question: 'Umbwe 路线风景优美吗？', answer: '风景极为壮丽！这条路线穿越茂密雨林、壮观的山脊与深邃的山谷向上攀升，从徒步开始便可欣赏全景视野，沿途风光同样令人惊叹。'},
    {number: 6, question: 'Umbwe 路线在哪里过夜？', answer: '您将入住由支援团队搭建的营地。与使用小屋的 Marangu 路线不同，Umbwe 是一次完全的露营体验。'},
    {number: 7, question: '初学者可以挑战 Umbwe 路线吗？', answer: '不建议初学者选择这条路线。它体能要求较高，且高原适应时间有限。如果您是高海拔徒步的新手，Lemosho 或 Machame 等更长、更循序渐进的路线会更为合适。'},
    {number: 8, question: '经由 Umbwe 路线攀登的最佳时间是什么时候？', answer: '最佳月份是 1 月至 3 月，以及 6 月至 10 月，此时天气干燥、天空晴朗。12 月也是可行的选择，尽管会稍微潮湿一些。'},
    {number: 9, question: 'Umbwe 路线会与其他步道汇合吗？', answer: '会的。在 Barranco Camp 附近，Umbwe 路线与 Machame 和 Lemosho 路线汇合，共享南部登顶环线，并经由 Mweka 路线下山。'},
    {number: 10, question: '为什么选择 Umbwe 路线而非其他路线？', answer: '如果您希望获得一段更具挑战性、更偏远、风景更壮丽且人流更少的登山体验，请选择 Umbwe。它非常适合追求孤寂感、壮丽风光及更短总时长的徒步者——只需为其强度做好准备即可。'},
  ],
}

const northernCircuit: RouteZh = {
  slug: 'northern-circuit-route',
  name: 'Northern Circuit 路线',
  seoTitle: 'Northern Circuit 路线 | Climbing Kilimanjaro Tanzania',
  seoDescription: '经由 Northern Circuit 路线攀登乞力马扎罗——这座山上最长、风景最秀丽、成功率最高的路线。真实每日行程、价格与专家建议。',
  heroHeading: '乞力马扎罗 Northern Circuit 路线',
  heroTagline: '通往乞力马扎罗山顶最受欢迎的路线',
  heroBody: [
    'Northern Circuit 路线是乞力马扎罗最长、风景最秀丽的路线，提供无与伦比的景色以及所有路线中最高的成功率。由于几乎完整环绕整座山，它能实现出色的高原适应，非常适合寻求更为循序渐进、人流较少的登山体验的徒步者。',
    '您将探索从茂密雨林、高山石楠荒原到崎岖高原及北坡辽阔天空的一切景观——这是一片鲜少有人踏足的区域。凭借其偏远的美景与策略性的节奏安排，Northern Circuit 为拥有充裕时间与冒险精神的旅行者，提供了一次高端的徒步体验。',
  ],
  heroImage: {src: '/images/routes/northern-circuit/hero.jpg', alt: 'Mweka Camp 的帐篷与日出时分的基博峰'},
  itineraryHeading: 'Northern Circuit 路线行程',
  itinerarySubheading: '走得更远，才能登得更高',
  daysLabel: '9 天',
  stops: [
    arrivalStopZh,
    {
      label: '徒步第 1 天：Londorossi Gate – Mti Mkubwa Camp',
      meta: ['📍 Londorossi Gate（2,100 米）→ Mti Mkubwa Camp（2,650 米）', '📈 爬升高度：550 米', '⏳ 用时：3-4 小时'],
      body: ['您的徒步旅程从前往 Londorossi Gate 办理登记手续开始，随后是一段穿越茂密雨林的轻松步行，这里栖息着黑白疣猴与丰富的鸟类。抵达 Mti Mkubwa（大树）营地，在星空下度过第一晚。'],
    },
    {
      label: '徒步第 2 天：Mti Mkubwa Camp – Shira 1 Camp',
      meta: ['📍 Mti Mkubwa（2,650 米）→ Shira 1 Camp（3,610 米）', '📈 爬升高度：960 米', '⏳ 用时：6-7 小时'],
      body: ['离开森林，进入石楠与欧石南地带，景色随之开阔，可见基博峰的壮丽景色。享受一段穿越 Shira 高原的宁静徒步，抵达当晚的营地。'],
    },
    {
      label: '徒步第 3 天：Shira 1 Camp – Shira 2 Camp',
      meta: ['📍 Shira 1 Camp（3,610 米）→ Shira 2 Camp（3,850 米）', '📈 爬升高度：240 米', '⏳ 用时：3-4 小时'],
      body: ['沿着 Shira 山脊广阔开放的高原进行一段短途徒步，让您有时间休息并适应高原。天气晴朗时，可远眺基博峰与远处的梅鲁火山全景。'],
    },
    {
      label: '徒步第 4 天：Shira 2 Camp – Lava Tower – Moir Hut',
      meta: [
        '📍 Shira 2（3,850 米）→ Lava Tower（4,630 米）→ Moir Hut（4,200 米）',
        '📈 爬升高度：780 米',
        '📉 下降高度：430 米',
        '⏳ 用时：6-7 小时',
      ],
      body: ['今天包括攀升至 Lava Tower——一处重要的高原适应点——随后轻微下降，抵达坐落于高海拔山谷中、偏远宁静的 Moir Hut。'],
    },
    {
      label: '徒步第 5 天：Moir Hut – Buffalo Camp',
      meta: ['📍 Moir Hut（4,200 米）→ Buffalo Camp（4,020 米）', '📉 下降高度：180 米', '⏳ 用时：5-7 小时'],
      body: ['沿着乞力马扎罗鲜为人见的北坡徒步，可远眺肯尼亚平原的全景。这段步道原始而宁静——正是 Northern Circuit 声誉的由来之处。'],
    },
    {
      label: '徒步第 6 天：Buffalo Camp – Third Cave Camp',
      meta: ['📍 Buffalo Camp（4,020 米）→ Third Cave（3,870 米）', '📉 下降高度：150 米', '⏳ 用时：5-6 小时'],
      body: ['又一天穿越高山荒漠的轻松徒步。随着继续向东前行，那种与世隔绝的感受无与伦比。在 Third Cave Camp 安顿下来，为最后的冲刺做好准备。'],
    },
    {
      label: '徒步第 7 天：Third Cave Camp – School Hut',
      meta: ['📍 Third Cave（3,870 米）→ School Hut（4,750 米）', '📈 爬升高度：880 米', '⏳ 用时：4-5 小时'],
      body: ['较短的一天，稳步攀升至 School Hut——登顶冲刺前的最后大本营。请提前抵达用晚餐并休息，为午夜出发的登山做好准备。'],
    },
    {
      label: '徒步第 8 天：School Hut – Uhuru Peak – Mweka Camp',
      meta: [
        '📍 School Hut（4,750 米）→ Uhuru Peak（5,895 米）→ Mweka Camp（3,110 米）',
        '📈 爬升高度：1,145 米',
        '📉 下降高度：2,785 米',
        '⏳ 用时：12-15 小时',
      ],
      body: ['登顶日！午夜前后开始攀登，日出时分抵达 Stella Point，随后继续冲向 Uhuru Peak——非洲最高点。庆祝之后，下降至 Mweka Camp，享受应得的休息。'],
    },
    {
      label: '徒步第 9 天：Mweka Camp – Mweka Gate',
      meta: ['📍 Mweka Camp（3,110 米）→ Mweka Gate（1,640 米）', '📉 下降高度：1,470 米', '⏳ 用时：3-4 小时'],
      body: ['最后一段穿越雨林的徒步，带您抵达 Mweka Gate，在那里您将办理离境手续，领取登顶证书，并返回莫希庆祝与休息。'],
    },
    departureStopZh,
  ],
  infoTabsHeading: '为什么选择 Northern Circuit？',
  tabs: [
    {
      id: 'duration',
      label: '行程时长',
      blocks: [
        {
          heading: '选择 Northern Circuit 路线有哪些优势？',
          bullets: [
            '得益于延长的高原适应时间，成功率是所有路线中最高的。',
            '乞力马扎罗最长的路线（9 天），提供更多时间进行适应，并充分享受旅程。',
            '从各个角度都能欣赏到壮丽景色——茂密雨林、Shira 高原及北部荒野。',
            '人流极少——在登顶夜之前，您很少会见到其他团队。',
            '非常适合经验丰富的徒步者，或希望获得更悠闲节奏的旅行者。',
            '在较低的山坡上，有绝佳的机会观察大羚羊与水牛等野生动物。',
          ],
        },
        {
          heading: 'Northern Circuit 路线需要多长时间？',
          paragraphs: ['山上总天数：9 天。上坡天数：8 天（逐步获得海拔）。下山天数：1 天。这一额外的时间让身体能够自然适应海拔，从而大幅提升登顶成功率。'],
        },
      ],
    },
    {
      id: 'pricing',
      label: '价格详情',
      blocks: [
        {
          heading: 'Northern Circuit 路线的费用是多少？',
          paragraphs: [
            '9 天 Northern Circuit 的价格通常包括：',
            '💵 预估区间：每人 2,500 至 3,700 美元，具体取决于团队规模与运营商品质。',
          ],
          bullets: [
            '所有公园门票、许可证及税费',
            '专业登山向导、背夫与厨师',
            '山上全食宿（餐食、净化水、零食）',
            '露营装备（帐篷、睡垫、餐厅帐篷等）',
            '登山前后的机场接送与酒店住宿',
          ],
        },
      ],
    },
    {
      id: 'stay',
      label: '住宿地点',
      blocks: [
        {
          heading: 'Northern Circuit 路线沿途有哪些营地？',
          bullets: [
            '全程露营——这条路线上没有小屋。',
            '配备泡沫睡垫的舒适三季高山帐篷。',
            '高端运营商提供私人卫生间帐篷与餐厅帐篷。',
            '相比其他路线，这里的营地更为清静、风景如画且人流较少。',
          ],
        },
      ],
    },
    {
      id: 'crowds',
      label: '人气与人流',
      blocks: [
        {
          heading: 'Northern Circuit 路线拥挤吗？',
          bullets: [
            'Northern Circuit 是乞力马扎罗人流最少的路线。',
            '非常适合偏好更偏远、更清静步道的徒步者。',
            '在靠近山顶与 Marangu/Machame 步道汇合之前，您遇到的团队会更少。',
          ],
        },
      ],
    },
    {
      id: 'insights',
      label: '专家见解',
      blocks: [
        {
          heading: '我们对 Northern Circuit 路线的看法是什么？',
          bullets: [
            '推荐给希望领略乞力马扎罗各个侧面的摄影师与自然爱好者。',
            '凭借 9 天的行程时长，非常适合担心高原反应的徒步者。',
            '虽然技术难度不高，但漫长的行程需要良好的耐力。',
            '提供远离主要旅游步道的独特荒野体验。',
          ],
        },
      ],
    },
  ],
  secondaryHeading: 'Northern Circuit 路线',
  secondaryTagline: '通往山顶的风景之路——走得更远，才能登得更高。',
  faqHeading: '关于 Northern Circuit 路线的 10 个问题',
  faqs: [
    {number: 1, question: 'Northern Circuit 路线需要多长时间？', answer: 'Northern Circuit 路线通常需要 9-10 天。这一时长可实现充分的高原适应，大幅提高乞力马扎罗登顶成功的机会。'},
    {number: 2, question: '经由 Northern Circuit 攀登乞力马扎罗难度大吗？', answer: '这是一段漫长的徒步旅程，但循序渐进的高原适应让体能良好的初学者也能应对。'},
    {number: 3, question: '这条路线的登顶成功率是多少？', answer: '约为 90-95%，得益于渐进式的海拔提升，是所有路线中最高的。'},
    {number: 4, question: '经由 Northern Circuit 攀登的最佳时间是什么时候？', answer: '1 月至 3 月，以及 6 月至 10 月，提供最佳的天气与步道状况。'},
    {number: 5, question: 'Northern Circuit 比其他路线更贵吗？', answer: '是的，由于路程更长、更为偏远——但这段体验也是无与伦比的。'},
    {number: 6, question: '我需要此前的徒步经验吗？', answer: '不需要，但良好的体能状况与充分的准备至关重要。'},
    {number: 7, question: '我可能会看到哪些野生动物？', answer: '蓝猴、黑白疣猴、水牛，偶尔还有出现在较低山坡的大象。'},
    {number: 8, question: 'Northern Circuit 拥挤吗？', answer: '不会。它是人流最少的路线，人流量非常低。'},
    {number: 9, question: '这是一条露营路线吗？', answer: '是的，所有夜晚都在帐篷中度过，没有小屋可供选择。'},
    {number: 10, question: '我可以在当地租赁装备吗？', answer: '可以，大多数信誉良好的运营商都在莫希或阿鲁沙提供高品质的租赁装备。'},
  ],
}

const routesZh: RouteZh[] = [machame, marangu, lemosho, rongai, umbwe, northernCircuit]

// ---------- routesHubPage-zh ----------

async function seedRoutesHubZh() {
  const cards = [
    {title: 'Machame 路线', slug: 'machame-route', summary: '人称威士忌路线的 Machame，是乞力马扎罗最受欢迎的路线，拥有壮丽风光与多样地形。尽管颇具挑战性，步道陡峭、需露营住宿，但它为寻求较短却回报丰厚徒步之旅的登山者提供了出色的高原适应效果。', image: {src: '/images/routes/hub/card-machame.png', alt: 'Machame 路线示意地图'}},
    {title: 'Lemosho 路线', slug: 'lemosho-route', summary: '作为乞力马扎罗风景最秀丽的路线之一，Lemosho 从偏远的 Londorossi Gate 出发，穿越壮丽的 Shira 高原。这条路线提供一段宁静的登山之旅，拥有壮观景色、丰富的野生动物，以及渐进式的攀升，带来舒适的体验。', image: {src: '/images/routes/hub/card-lemosho.png', alt: 'Lemosho 路线示意地图'}},
    {title: 'Rongai 路线', slug: 'rongai-route', summary: '作为乞力马扎罗唯一的北线路线，Rongai 人流较少、坡度更为平缓，是偏好平静均衡登山体验者的绝佳选择。由于降水较少，这条路线在雨季尤为理想，可带来一段穿越原始荒野的愉快徒步。', image: {src: '/images/routes/hub/card-rongai.png', alt: 'Rongai 路线示意地图'}},
    {title: 'Northern Circuit 路线', slug: 'northern-circuit-route', summary: '作为最长、风景最秀丽的路线，Northern Circuit 通过逐步环绕乞力马扎罗，提供最佳的高原适应效果。凭借全景视野与较高的成功率，这条路线带来一段宁静而沉浸式的徒步体验。', image: {src: '/images/routes/hub/card-northern-circuit.png', alt: 'Northern Circuit 路线示意地图'}},
  ]
  await client.createOrReplace({
    _id: 'routesHubPage-zh',
    _type: 'routesHubPage',
    language: 'zh',
    seo: {_type: 'seo', title: '乞力马扎罗登山路线 | Climbing Kilimanjaro Tanzania', description: '比较攀登乞力马扎罗山的最佳路线——Machame、Lemosho、Rongai 及 Northern Circuit——附真实行程与专家建议。'},
    hero: {eyebrow: '非洲之巅。', heading: '攀登乞力马扎罗的最佳路线', locationPill: '坦桑尼亚北部'},
    ctaBandButtons: [
      {_type: 'ctaButton', _key: key(), label: '立即索取报价', href: '/request-a-quote-tanzania-safari/', variant: 'solid'},
      {_type: 'ctaButton', _key: key(), label: '联系我们的专家', href: 'https://wa.me/255767140150', variant: 'outline'},
    ],
    promoSection: {heading: '攀登乞力马扎罗前应了解的信息', exploreLabel: '探索全部信息', exploreHref: '/kilimanjaro-climbing-guide/'},
    tabsHeading: '乞力马扎罗登山路线与地图',
    cards: await Promise.all(
      cards.map(async (card) => ({_type: 'routeHubCard', _key: key(), title: card.title, routeSlug: card.slug, summary: card.summary, image: await uploadImage(client, card.image)})),
    ),
    testimonials: [
      {name: 'Obazee', date: '2023-11-28', quote: '一生难忘的登山之旅！我们与 Asili Explorer African Safaris 一起进行的乞力马扎罗登山之旅真的非凡出色！从头到尾，团队都确保了一段难忘的体验，让我们的登顶之旅顺利、安全且值得铭记。'},
      {name: 'Romy H', date: '2023-11-28', quote: 'Asili Explorer African Safaris 保持五星口碑一点也不令人意外。他们的专业知识、职业素养以及对客户满意度的承诺使其脱颖而出。如果您正在寻找最好的乞力马扎罗徒步公司，不必再看别处！'},
      {name: 'Rony V', date: '2023-12-27', quote: '2023 年 10 月，我们与 Asili Explorer African Safaris 一起进行了为期六天的乞力马扎罗登顶徒步。这次体验非凡出色，我强烈推荐给任何正在考虑这场探险的人。'},
      {name: 'Avdb', date: '2023-11-28', quote: 'Joe 是一位完美的向导兼司机。他带我们参观并发现了坦桑尼亚真正的野生动物。对他而言，没有什么太复杂的事情。他对各种动物主要栖息地的了解令人印象深刻。'},
    ].map((t) => ({_type: 'hubTestimonial', _key: key(), name: t.name, date: t.date, quote: t.quote})),
    faqHeading: '常见问题',
    faqSubheading: '您的问题，我们的解答',
    faqIntro: '对于与我们一起预订坦桑尼亚野生动物园之旅有疑问吗？请查看下方常见问题，获取快速解答。如果没有找到您所需的答案，欢迎随时联系我们——我们的专家将协助您规划完美的坦桑尼亚探险之旅。',
    faqs: [
      {question: '乞力马扎罗有哪些可选路线？', answer: '乞力马扎罗提供多条路线，适合各个水平、偏好与徒步风格的登山者。在 Asili Explorer African Safaris，我们专注于乞力马扎罗最受欢迎的四条路线：Rongai 路线、Lemosho 路线、Northern Circuit 路线及 Machame 路线。我们的向导登山之旅确保安全、充分的高原适应，以及一段难忘的登顶旅程。'},
      {question: '哪条是人流最少的乞力马扎罗路线？', answer: 'Northern Circuit 路线人流最少，提供一段宁静、僻静的徒步体验。'},
      {question: '哪条是攀登乞力马扎罗最容易的路线？', answer: '得益于渐进的坡度与直接的攀升方式，Rongai 路线被认为是最容易的。'},
      {question: '哪条是乞力马扎罗风景最秀丽的路线？', answer: 'Lemosho 路线常被认为风景最为秀丽，拥有壮丽的景色、多样的生态系统及全景视野。'},
      {question: '攀登乞力马扎罗需要多少费用？', answer: '攀登乞力马扎罗的费用在 2,500 美元至 4,000 美元之间不等，具体取决于路线选择、时长、团队规模、服务水平及包含的服务。在 Asili Explorer African Safaris，我们保证训练有素的向导、高安全标准及卓越的整体体验。'},
      {question: '攀登乞力马扎罗需要多长时间？', answer: '登山通常需要 6 至 9 天，具体取决于所选路线。更长的行程可实现更好的高原适应，提高成功且愉快的登顶体验的机会。'},
      {question: '初学者可以攀登乞力马扎罗吗？', answer: '可以！尽管不需要任何技术性攀登技能，初学者在尝试登山前仍应进行适当的体能训练。我们经验丰富的向导确保初学登山者在整个旅程中获得必要的支持与陪伴。'},
      {question: '攀登乞力马扎罗的最佳时间是什么时候？', answer: '攀登乞力马扎罗的最佳季节是旱季月份：1 月至 3 月，以及 6 月至 10 月。这些月份提供最佳的天气条件、更晴朗的天空以及更愉快的徒步体验。'},
      {question: '攀登乞力马扎罗需要向导吗？', answer: '需要！未经持证向导陪同攀登乞力马扎罗是不被允许的。向导带来专业知识，监测您的健康状况，确保您的安全，并帮助您在乞力马扎罗充满挑战的地形中前行——即使是经验丰富的登山者也必须配备向导。'},
      {question: '攀登乞力马扎罗的难度如何？', answer: '攀登乞力马扎罗是一场充满挑战却又回报丰厚的探险。主要难度来自高海拔与多样的地形。凭借良好的准备、规划周全的行程以及经验丰富的陪同，不同经验水平的登山者都能成功登顶。'},
      {question: '在乞力马扎罗如何过夜？', answer: '在乞力马扎罗徒步期间，您将入住高品质、能抵御恶劣天气的帐篷，专为极端条件下的舒适而设计，配备宽敞的帐篷空间、隔热睡垫及保暖睡袋，让您在我们指定的营地中获得一夜安眠。'},
      {question: '攀登乞力马扎罗需要氧气吗？', answer: '大多数登山者攀登乞力马扎罗并不需要额外供氧。成功登山的关键在于良好的高原适应。在严重高原反应的罕见情况下，出于安全考虑会提供氧气。'},
    ].map((faq) => ({_type: 'faqItem', _key: key(), question: faq.question, answer: faq.answer})),
  })
  console.log('routesHubPage-zh created/replaced')
}

async function routeToFieldsZh(data: RouteZh) {
  return {
    seo: {_type: 'seo', title: data.seoTitle, description: data.seoDescription},
    name: data.name,
    hero: {
      heading: data.heroHeading,
      tagline: data.heroTagline,
      body: data.heroBody.map(paragraphBlock),
      image: await uploadImage(client, data.heroImage),
    },
    itinerary: {
      heading: data.itineraryHeading,
      subheading: data.itinerarySubheading,
      daysLabel: data.daysLabel,
      stops: data.stops.map((stop) => ({
        _type: 'routeStop',
        _key: key(),
        label: stop.label,
        ...(stop.meta?.length ? {meta: stop.meta} : {}),
        body: stop.body.map(paragraphBlock),
      })),
    },
    infoTabs: {
      heading: data.infoTabsHeading,
      tabs: data.tabs.map((tab) => ({
        _type: 'routeInfoTab',
        _key: key(),
        tabId: tab.id,
        label: tab.label,
        blocks: tab.blocks.map((block) => ({
          _type: 'routeInfoBlock',
          _key: key(),
          heading: block.heading,
          ...(block.paragraphs?.length ? {paragraphs: block.paragraphs.map(paragraphBlock)} : {}),
          ...(block.bullets?.length ? {bullets: block.bullets} : {}),
          ...(block.pricingTable
            ? {
                pricingTable: {
                  columns: block.pricingTable.columns,
                  rows: block.pricingTable.rows.map((row) => ({_type: 'pricingRow', _key: key(), label: row.label, values: row.values})),
                },
              }
            : {}),
        })),
      })),
    },
    secondaryBanner: {heading: data.secondaryHeading, tagline: data.secondaryTagline},
    faqHeading: data.faqHeading,
    faqs: data.faqs.map((faq) => ({_type: 'numberedFaq', _key: key(), number: faq.number, question: faq.question, answer: faq.answer})),
  }
}

async function run() {
  for (const route of routesZh) {
    const enId = await findEnId(client, 'route', route.slug)
    if (!enId) {
      console.log(`SKIP ${route.slug}: no en source found`)
      continue
    }
    const fields = await routeToFieldsZh(route)
    const zhId = await upsertTranslatedDoc(client, 'route', route.slug, 'zh', fields)
    await linkTranslationMetadata(client, 'route', [
      {language: 'en', id: enId},
      {language: 'zh', id: zhId},
    ])
    console.log(`${route.slug}-zh done (${zhId})`)
  }
  await seedRoutesHubZh()
  console.log('done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
