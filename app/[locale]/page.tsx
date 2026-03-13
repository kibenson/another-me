'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LandingPage() {
  const tc = useTranslations('common');
  const tl = useTranslations('landing');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block bg-white/20 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
            ✨ {tc('tagline')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            {tl('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto text-balance">
            {tl('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              {tl('hero.cta')}
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              {tl('hero.secondary')}
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl" />
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b shadow-sm py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600">10K+</div>
            <div className="text-gray-500 text-sm mt-1">{tl('stats.users')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">5K+</div>
            <div className="text-gray-500 text-sm mt-1">{tl('stats.connections')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">15</div>
            <div className="text-gray-500 text-sm mt-1">{tl('stats.tags')}</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {tl('features.title')}
            </h2>
            <p className="text-xl text-gray-500">{tl('features.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: tl('features.step1.title'), desc: tl('features.step1.description'), icon: '📝', color: 'from-blue-500 to-indigo-600' },
              { num: '02', title: tl('features.step2.title'), desc: tl('features.step2.description'), icon: '🔍', color: 'from-purple-500 to-pink-600' },
              { num: '03', title: tl('features.step3.title'), desc: tl('features.step3.description'), icon: '✉️', color: 'from-pink-500 to-red-500' },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-br ${step.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md`}>
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-gray-400 mb-2 tracking-widest">STEP {step.num}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tag Cloud Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">15 Activity Tags</h2>
          <p className="text-gray-500 mb-10">Track what matters to you</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '📚', label: 'Reading' }, { icon: '🎵', label: 'Music' },
              { icon: '🎮', label: 'Gaming' }, { icon: '✈️', label: 'Travel' },
              { icon: '🏃', label: 'Sports' }, { icon: '💼', label: 'Work' },
              { icon: '🍳', label: 'Cooking' }, { icon: '🎬', label: 'Movies' },
              { icon: '🎨', label: 'Art' }, { icon: '💻', label: 'Coding' },
              { icon: '🏋️', label: 'Fitness' }, { icon: '🧘', label: 'Meditation' },
              { icon: '📷', label: 'Photography' }, { icon: '📖', label: 'Learning' },
              { icon: '🤝', label: 'Socializing' },
            ].map((tag) => (
              <span key={tag.label} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-indigo-100 transition-colors">
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {tl('testimonials.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { text: tl('testimonials.t1.text'), author: tl('testimonials.t1.author'), avatar: '👩' },
              { text: tl('testimonials.t2.text'), author: tl('testimonials.t2.author'), avatar: '👨' },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md">
                <div className="text-4xl mb-4">❝</div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{testimonial.avatar}</span>
                  <span className="font-semibold text-gray-900">{testimonial.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{tl('cta.title')}</h2>
          <p className="text-xl text-white/90 mb-8">{tl('cta.subtitle')}</p>
          <Link
            href="/auth/register"
            className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-full text-lg hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            {tl('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
