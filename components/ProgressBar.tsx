interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
}

export default function ProgressBar({ progress, color = 'bg-indigo-500' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`${color} h-3 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
