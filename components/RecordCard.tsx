import { formatDate } from '@/lib/utils';

interface Tag {
  icon: string;
  nameEn: string;
  nameZh: string;
  slug: string;
}

interface Record {
  id: string;
  date: Date;
  note: string | null;
  tag: Tag;
}

export default function RecordCard({ record }: { record: Record }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
        {record.tag.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">{record.tag.nameEn}</p>
            <p className="text-xs text-gray-400">{record.tag.nameZh}</p>
          </div>
          <time className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {formatDate(record.date)}
          </time>
        </div>
        {record.note && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{record.note}</p>
        )}
      </div>
    </div>
  );
}
