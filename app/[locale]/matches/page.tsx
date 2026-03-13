import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { computeMatches, buildTagVector } from '@/lib/matching';
import { TAG_SLUGS } from '@/lib/tags';
import { RECORDS_REQUIRED_FOR_MATCH, formatSimilarity } from '@/lib/utils';
import MatchCard from '@/components/MatchCard';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const t = await getTranslations('matches');
  const userId = session.user.id;

  const totalRecords = await prisma.record.count({ where: { userId } });

  if (totalRecords < RECORDS_REQUIRED_FOR_MATCH) {
    const remaining = RECORDS_REQUIRED_FOR_MATCH - totalRecords;
    const progressPct = Math.round((totalRecords / RECORDS_REQUIRED_FOR_MATCH) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('notUnlocked.title')}</h1>
        <p className="text-gray-500 mb-8">{t('notUnlocked.description', { remaining })}</p>
        <ProgressBar progress={progressPct} />
        <p className="text-sm text-gray-400 mt-2 mb-8">{totalRecords} / {RECORDS_REQUIRED_FOR_MATCH} records</p>
        <Link href="/daily" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
          {t('notUnlocked.cta')}
        </Link>
      </div>
    );
  }

  // Build current user's tag counts
  const myRecords = await prisma.record.findMany({
    where: { userId },
    include: { tag: true },
  });

  const myTagCounts: Record<string, number> = {};
  for (const rec of myRecords) {
    myTagCounts[rec.tag.slug] = (myTagCounts[rec.tag.slug] ?? 0) + 1;
  }

  // Get all other users who have >= 20 records
  const eligibleUsers = await prisma.user.findMany({
    where: {
      id: { not: userId },
      records: { some: {} },
    },
    include: {
      records: { include: { tag: true } },
    },
  });

  const othersData = eligibleUsers
    .filter((u) => u.records.length >= RECORDS_REQUIRED_FOR_MATCH)
    .map((u) => {
      const tagCounts: Record<string, number> = {};
      for (const rec of u.records) {
        tagCounts[rec.tag.slug] = (tagCounts[rec.tag.slug] ?? 0) + 1;
      }
      return { userId: u.id, name: u.name, email: u.email, tagCounts };
    });

  const matches = computeMatches(myTagCounts, othersData, TAG_SLUGS, 0.2);

  // Get existing requests
  const existingRequests = await prisma.penpalRequest.findMany({
    where: { senderId: userId },
    select: { receiverId: true, status: true },
  });

  const requestMap = new Map(existingRequests.map((r) => [r.receiverId, r.status]));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">{t('noMatches')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard
              key={match.userId}
              match={match}
              requestStatus={requestMap.get(match.userId) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
