'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface RequestButtonProps {
  receiverId: string;
  initialStatus?: string | null;
}

export default function RequestButton({ receiverId, initialStatus }: RequestButtonProps) {
  const t = useTranslations('matches');
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function send() {
    setLoading(true);
    setError('');

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, message: message.trim() || undefined }),
    });

    if (res.ok) {
      setStatus('PENDING');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Error');
    }
    setLoading(false);
  }

  if (status === 'ACCEPTED') {
    return (
      <span className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full">
        ✉️ {t('requestAccepted')}
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1.5 rounded-full">
        {t('requestSent')}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('message.placeholder')}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        maxLength={200}
      />
      <button
        onClick={send}
        disabled={loading}
        className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? '...' : t('sendRequest')}
      </button>
    </div>
  );
}
