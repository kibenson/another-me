import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import { RECORDS_REQUIRED_FOR_MATCH } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const t = await getTranslations('dashboard');
  const locale = 'en';

  const userId = session.user.id;

  const [totalRecords, user, recentRecords] = await Promise.all([
    prisma.record.count({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, isPremium: true } }),
    prisma.record.findMany({
      where: { userId },
      include: { tag: true },
      orderBy: { date: 'desc' },
      take: 5,
    }),
  ]);

  const daysActiveResult = await prisma.record.findMany({
    where: { userId },
    select: { date: true },
    distinct: ['date'],
  });

  const uniqueDays = new Set(
    daysActiveResult.map((r) => r.date.toISOString().split('T')[0])
  ).size;

  const tagCounts = await prisma.record.groupBy({
    by: ['tagId'],
    where: { userId },
    _count: { tagId: true },
    orderBy: { _count: { tagId: 'desc' } },
    take: 1,
  });

  let topTagName = '—';
  if (tagCounts.length > 0) {
    const topTag = await prisma.tag.findUnique({ where: { id: tagCounts[0].tagId } });
    topTagName = topTag ? `${topTag.icon} ${topTag.nameEn}` : '—';
  }

  const remaining = Math.max(0, RECORDS_REQUIRED_FOR_MATCH - totalRecords);
  const progressPct = Math.min(100, (totalRecords / RECORDS_REQUIRED_FOR_MATCH) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('welcome', { name: user?.name || session.user.email || 'User' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('stats.totalRecords'), value: totalRecords, icon: '📝', color: 'bg-indigo-50 text-indigo-700' },
          { label: t('stats.daysActive'), value: uniqueDays, icon: '📅', color: 'bg-purple-50 text-purple-700' },
          { label: t('stats.topTag'), value: topTagName, icon: '🏆', color: 'bg-pink-50 text-pink-700' },
          { label: t('stats.matchScore'), value: `${Math.round(progressPct)}%`, icon: '🎯', color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs mt-1 opacity-70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('progress.title')}</h2>
        {totalRecords >= RECORDS_REQUIRED_FOR_MATCH ? (
          <div className="flex items-center gap-3 text-green-600 bg-green-50 rounded-xl px-4 py-3">
            <span className="text-2xl">🎉</span>
            <span className="font-medium">{t('progress.unlocked')}</span>
            <Link href="/matches" className="ml-auto text-sm underline font-semibold">
              View →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-3">
              {t('progress.description', { remaining })}
            </p>
            <ProgressBar progress={progressPct} />
            <p className="text-right text-xs text-gray-400 mt-2">
              {t('progress.records', { count: totalRecords })}
            </p>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('recentActivity')}</h2>
          <Link href="/records" className="text-sm text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>{t('noRecords')}</p>
            <Link
              href="/daily"
              className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {t('goToDaily')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-2xl">{record.tag.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{record.tag.nameEn}</p>
                  {record.note && (
                    <p className="text-sm text-gray-500 truncate">{record.note}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(record.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
