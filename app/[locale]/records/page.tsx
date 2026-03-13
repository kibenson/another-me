import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import RecordCard from '@/components/RecordCard';

export default async function RecordsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const t = await getTranslations('records');
  const userId = session.user.id;

  const records = await prisma.record.findMany({
    where: { userId },
    include: { tag: true },
    orderBy: { date: 'desc' },
  });

  const tags = await prisma.tag.findMany({ orderBy: { nameEn: 'asc' } });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('subtitle')} — {records.length} total
        </p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">{t('noRecords')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
