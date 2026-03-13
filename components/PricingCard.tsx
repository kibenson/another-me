import Link from 'next/link';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  isPremium: boolean;
  href: string;
}

export default function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col ${
        plan.isPremium
          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl scale-105'
          : 'bg-white border border-gray-200 shadow-sm text-gray-900'
      }`}
    >
      {plan.isPremium && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow">
          ⭐ POPULAR
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-1 ${plan.isPremium ? 'text-white' : 'text-gray-900'}`}>
          {plan.name}
        </h3>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold">{plan.price}</span>
          <span className={`text-sm mb-1 ${plan.isPremium ? 'text-white/80' : 'text-gray-400'}`}>
            / {plan.period}
          </span>
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={`mt-0.5 flex-shrink-0 ${plan.isPremium ? 'text-white' : 'text-indigo-500'}`}>
              ✓
            </span>
            <span className={`text-sm ${plan.isPremium ? 'text-white/90' : 'text-gray-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`block text-center font-semibold py-3.5 px-6 rounded-xl transition-colors ${
          plan.isPremium
            ? 'bg-white text-indigo-600 hover:bg-gray-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}
