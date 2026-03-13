'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestActionButtons({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: 'ACCEPTED' | 'REJECTED') {
    setLoading(true);
    await fetch(`/api/requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus('ACCEPTED')}
        disabled={loading}
        className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
      >
        Accept
      </button>
      <button
        onClick={() => updateStatus('REJECTED')}
        disabled={loading}
        className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
