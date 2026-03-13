'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatSimilarity } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MatchResult {
  userId: string;
  name: string | null;
  email: string;
  similarity: number;
  sharedTags: string[];
}

interface MatchCardProps {
  match: MatchResult;
  requestStatus: string | null;
}

export default function MatchCard({ match, requestStatus }: MatchCardProps) {
  const t = useTranslations('matches');
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(requestStatus === 'PENDING' || requestStatus === 'ACCEPTED');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isAccepted = requestStatus === 'ACCEPTED';
  const similarityPct = Math.round(match.similarity * 100);

  async function sendRequest() {
    setSending(true);
    setError('');

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: match.userId, message: message.trim() || undefined }),
    });

    if (res.ok) {
      setSent(true);
      setShowForm(false);
      router.refresh();
    } else {
      const data = await res.json();
      if (data.error === 'ALREADY_SENT') {
        setSent(true);
      } else {
        setError(data.error || 'Error sending request');
      }
    }
    setSending(false);
  }

  const colorClass =
    similarityPct >= 80
      ? 'text-green-600 bg-green-50'
      : similarityPct >= 60
      ? 'text-blue-600 bg-blue-50'
      : similarityPct >= 40
      ? 'text-purple-600 bg-purple-50'
      : 'text-gray-600 bg-gray-100';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {(match.name || match.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{match.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-400">
              {isAccepted ? match.email : '****@****'}
            </p>
          </div>
        </div>

        <div className={`${colorClass} px-3 py-1.5 rounded-full text-sm font-bold`}>
          {formatSimilarity(match.similarity)}
        </div>
      </div>

      {match.sharedTags.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">{t('sharedActivities')}</p>
          <div className="flex flex-wrap gap-2">
            {match.sharedTags.slice(0, 6).map((slug) => (
              <span key={slug} className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-1 rounded-full">
                {slug}
              </span>
            ))}
            {match.sharedTags.length > 6 && (
              <span className="text-xs text-gray-400">+{match.sharedTags.length - 6} more</span>
            )}
          </div>
        </div>
      )}

      {/* Similarity bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${similarityPct}%` }}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}

      <div className="mt-4">
        {isAccepted ? (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
            <span>✉️</span>
            <span>{t('requestAccepted')}</span>
            <a href={`mailto:${match.email}`} className="ml-auto underline text-xs">
              {match.email}
            </a>
          </div>
        ) : sent ? (
          <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2.5">
            ✅ {t('requestSent')}
          </div>
        ) : showForm ? (
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message.placeholder')}
              rows={2}
              maxLength={500}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={sendRequest}
                disabled={sending}
                className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {sending ? '...' : t('sendRequest')}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-gray-50"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {t('sendRequest')}
          </button>
        )}
      </div>
    </div>
  );
}
