import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import ProfileForm from './ProfileForm';
import RequestActionButtons from './RequestActionButtons';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const t = await getTranslations('profile');
  const userId = session.user.id;

  const [user, incomingRequests, outgoingRequests] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, bio: true, isPremium: true },
    }),
    prisma.penpalRequest.findMany({
      where: { receiverId: userId },
      include: { sender: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.penpalRequest.findMany({
      where: { senderId: userId },
      include: { receiver: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) redirect('/auth/login');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <ProfileForm user={user} />

      {/* Pen Pal Requests */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('penpalRequests.title')}</h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t('penpalRequests.incoming')}
          </h3>
          {incomingRequests.length === 0 ? (
            <p className="text-gray-400 text-sm">{t('penpalRequests.noIncoming')}</p>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{req.sender.name || req.sender.email}</p>
                    {req.message && <p className="text-sm text-gray-500 mt-0.5">"{req.message}"</p>}
                  </div>
                  <StatusBadge status={req.status} />
                  {req.status === 'PENDING' && (
                    <RequestActionButtons requestId={req.id} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t('penpalRequests.outgoing')}
          </h3>
          {outgoingRequests.length === 0 ? (
            <p className="text-gray-400 text-sm">{t('penpalRequests.noOutgoing')}</p>
          ) : (
            <div className="space-y-3">
              {outgoingRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{req.receiver.name || req.receiver.email}</p>
                  </div>
                  <StatusBadge status={req.status} />
                  {req.status === 'ACCEPTED' && (
                    <a
                      href={`mailto:${req.receiver.email}`}
                      className="text-indigo-600 text-sm font-medium hover:underline"
                    >
                      ✉️ {req.receiver.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
  };
  return (
    <span className={`${styles[status] || 'bg-gray-100 text-gray-700'} text-xs font-medium px-3 py-1 rounded-full`}>
      {labels[status] || status}
    </span>
  );
}


