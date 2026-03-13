'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Tag {
  id: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  icon: string;
  promptEn: string;
  promptZh: string;
}

interface TagSelectorProps {
  tags: Tag[];
  disabled?: boolean;
}

export default function TagSelector({ tags, disabled = false }: TagSelectorProps) {
  const t = useTranslations('daily');
  const router = useRouter();
  const [selected, setSelected] = useState<Tag | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError('');

    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagId: selected.id, note: note.trim() || undefined }),
    });

    if (res.ok) {
      setSuccess(true);
      setSelected(null);
      setNote('');
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      if (data.error === 'DAILY_LIMIT_REACHED') {
        setError('Daily limit reached.');
      } else {
        setError(data.error || 'Error saving record.');
      }
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✅ {t('success')}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">{t('selectTag')}</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => !disabled && setSelected(selected?.id === tag.id ? null : tag)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50'}
                ${selected?.id === tag.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                  : 'border-gray-200 bg-white'
                }`}
            >
              <span className="text-2xl">{tag.icon}</span>
              <span className="text-xs font-medium text-gray-700 leading-tight">{tag.nameEn}</span>
              <span className="text-xs text-gray-400">{tag.nameZh}</span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selected.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{selected.nameEn}</p>
              <p className="text-sm text-gray-400 italic mt-0.5">{selected.promptEn}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('addNote')}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('notePlaceholder')}
              maxLength={500}
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{note.length}/500</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '...' : t('submit')}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(null); setNote(''); }}
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ✕
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
