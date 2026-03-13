import { getTranslations } from 'next-intl/server';
import PricingCard from '@/components/PricingCard';

export default async function PricingPage() {
  const t = await getTranslations('pricing');

  const freePlan = {
    name: t('free.name'),
    price: t('free.price'),
    period: t('free.period'),
    features: [
      t('free.features.0'),
      t('free.features.1'),
      t('free.features.2'),
      t('free.features.3'),
    ],
    cta: t('free.cta'),
    isPremium: false,
    href: '/auth/register',
  };

  const premiumPlan = {
    name: t('premium.name'),
    price: t('premium.price'),
    period: t('premium.period'),
    features: [
      t('premium.features.0'),
      t('premium.features.1'),
      t('premium.features.2'),
      t('premium.features.3'),
      t('premium.features.4'),
      t('premium.features.5'),
    ],
    cta: t('premium.cta'),
    isPremium: true,
    href: '/api/stripe/checkout',
  };

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">
        <PricingCard plan={freePlan} />
        <PricingCard plan={premiumPlan} />
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('faq.title')}</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
