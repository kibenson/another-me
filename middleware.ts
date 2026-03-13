import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
});

// Apply i18n middleware to all routes except API endpoints,
// Next.js internals, and static files (images, fonts, etc.)
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
