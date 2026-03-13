import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import TagSelector from '@/components/TagSelector';
import { DAILY_RECORD_LIMIT } from '@/lib/utils';

export default async function DailyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const t = await getTranslations('daily');

  const today = new Date().toISOString().split('T')[0];
  const userId = session.user.id;

  const dailyUsage = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  const todayCount = dailyUsage?.count ?? 0;
  const remaining = DAILY_RECORD_LIMIT - todayCount;

  const tags = await prisma.tag.findMany({ orderBy: { nameEn: 'asc' } });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-2">{t('subtitle')}</p>
      </div>

      {/* Daily limit info */}
      <div className={`rounded-xl px-5 py-3 mb-6 text-sm font-medium flex items-center gap-2 ${
        remaining === 0
          ? 'bg-red-50 text-red-700 border border-red-100'
          : remaining <= 2
          ? 'bg-yellow-50 text-yellow-700 border border-yellow-100'
          : 'bg-green-50 text-green-700 border border-green-100'
      }`}>
        <span>{remaining === 0 ? '🚫' : remaining <= 2 ? '⚠️' : '✅'}</span>
        <span>
          {t('dailyLimit', { count: todayCount, limit: DAILY_RECORD_LIMIT })}
          {remaining > 0 && ` (${remaining} remaining)`}
        </span>
      </div>

      <TagSelector tags={tags} disabled={remaining === 0} />
    </div>
  );
}
