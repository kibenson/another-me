'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  isPremium: boolean;
}

export default function ProfileForm({ user }: { user: User }) {
  const t = useTranslations('profile');
  const [form, setForm] = useState({ name: user.name || '', bio: user.bio || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Error saving profile');
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            {t('saved')}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('bio')}</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            placeholder={t('bioPlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {user.isPremium && (
          <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 rounded-lg px-4 py-3">
            <span>⭐</span>
            <span className="font-medium">{t('isPremium')}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '...' : t('save')}
        </button>
      </form>
    </div>
  );
}
