'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('common.nav');
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = session
    ? [
        { href: `/${locale}/dashboard`, label: t('dashboard') },
        { href: `/${locale}/daily`, label: t('daily') },
        { href: `/${locale}/records`, label: t('records') },
        { href: `/${locale}/matches`, label: t('matches') },
        { href: `/${locale}/pricing`, label: t('pricing') },
        { href: `/${locale}/profile`, label: t('profile') },
      ]
    : [
        { href: `/${locale}/pricing`, label: t('pricing') },
      ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <span className="text-2xl">🪞</span>
            <span className="hidden sm:block">Another Me</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="hidden md:block text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                {t('logout')}
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-2"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: `/${locale}` }); }}
                className="block w-full text-left text-gray-500 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm mt-1"
              >
                {t('logout')}
              </button>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} onClick={() => setMenuOpen(false)} className="block text-gray-700 px-3 py-2.5 hover:bg-indigo-50 rounded-lg text-sm">
                  {t('login')}
                </Link>
                <Link href={`/${locale}/auth/register`} onClick={() => setMenuOpen(false)} className="block mt-1 bg-indigo-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium">
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
