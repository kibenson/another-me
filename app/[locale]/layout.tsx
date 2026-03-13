import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Another Me / 另一个我',
  description: 'Find your behavioral twin. Record daily activities, match with similar users, become pen pals.',
};

const locales = ['en', 'zh'];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="font-sans min-h-screen flex flex-col bg-gray-50">
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
