import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tags = [
  {
    slug: 'reading',
    nameEn: 'Reading',
    nameZh: '读书',
    icon: '📚',
    promptEn: 'What did you read today? Books, articles, or something else?',
    promptZh: '今天读了什么？书籍、文章还是其他内容？',
  },
  {
    slug: 'music',
    nameEn: 'Music',
    nameZh: '音乐',
    icon: '🎵',
    promptEn: 'What music did you listen to or play today?',
    promptZh: '今天听了或演奏了什么音乐？',
  },
  {
    slug: 'gaming',
    nameEn: 'Gaming',
    nameZh: '游戏',
    icon: '🎮',
    promptEn: 'What game did you play today?',
    promptZh: '今天玩了什么游戏？',
  },
  {
    slug: 'travel',
    nameEn: 'Travel',
    nameZh: '旅游',
    icon: '✈️',
    promptEn: 'Where did you go or plan to go?',
    promptZh: '今天去了哪里或计划去哪里？',
  },
  {
    slug: 'sports',
    nameEn: 'Sports',
    nameZh: '运动',
    icon: '🏃',
    promptEn: 'What sport or physical activity did you do today?',
    promptZh: '今天做了什么运动或体育活动？',
  },
  {
    slug: 'work',
    nameEn: 'Work',
    nameZh: '工作',
    icon: '💼',
    promptEn: 'What did you accomplish at work today?',
    promptZh: '今天在工作上完成了什么？',
  },
  {
    slug: 'cooking',
    nameEn: 'Cooking',
    nameZh: '烹饪',
    icon: '🍳',
    promptEn: 'What did you cook or eat today?',
    promptZh: '今天做了什么菜或吃了什么？',
  },
  {
    slug: 'movies',
    nameEn: 'Movies',
    nameZh: '电影',
    icon: '🎬',
    promptEn: 'What movie or show did you watch today?',
    promptZh: '今天看了什么电影或剧集？',
  },
  {
    slug: 'art',
    nameEn: 'Art',
    nameZh: '艺术',
    icon: '🎨',
    promptEn: 'What creative or artistic work did you do today?',
    promptZh: '今天做了什么创意或艺术创作？',
  },
  {
    slug: 'coding',
    nameEn: 'Coding',
    nameZh: '编程',
    icon: '💻',
    promptEn: 'What did you build or code today?',
    promptZh: '今天做了什么编程项目？',
  },
  {
    slug: 'fitness',
    nameEn: 'Fitness',
    nameZh: '健身',
    icon: '🏋️',
    promptEn: 'What fitness routine did you follow today?',
    promptZh: '今天进行了什么健身锻炼？',
  },
  {
    slug: 'meditation',
    nameEn: 'Meditation',
    nameZh: '冥想',
    icon: '🧘',
    promptEn: 'How was your meditation or mindfulness practice today?',
    promptZh: '今天的冥想或正念练习怎么样？',
  },
  {
    slug: 'photography',
    nameEn: 'Photography',
    nameZh: '摄影',
    icon: '📷',
    promptEn: 'What did you photograph or capture today?',
    promptZh: '今天拍摄了什么？',
  },
  {
    slug: 'learning',
    nameEn: 'Learning',
    nameZh: '学习',
    icon: '📖',
    promptEn: 'What new thing did you learn today?',
    promptZh: '今天学到了什么新东西？',
  },
  {
    slug: 'socializing',
    nameEn: 'Socializing',
    nameZh: '社交',
    icon: '🤝',
    promptEn: 'Who did you connect with or meet today?',
    promptZh: '今天和谁交流或见面了？',
  },
];

async function main() {
  console.log('Seeding tags...');
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }
  console.log(`Seeded ${tags.length} tags successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
