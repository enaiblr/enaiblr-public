import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

// export async function generateMetadata({
//   searchParams
// }: {
//   searchParams: Promise<{ q?: string }>
// }): Promise<Metadata> {
//   const params = await searchParams;
//   const query = params?.q;
//   return {
//     title: query ? `Search: ${query} | enaiblr` : 'enaiblr - AI Tools Search Engine',
//   };
// }

export const metadata: Metadata = {
  metadataBase: new URL('https://enaiblr.org'),
  title: {
    template: '%s | enaiblr',
    default: 'enaiblr - AI Tools Search Engine',
  },
  description: 'Simple and Straightforward Search Engine for Finding the Best AI Tools and Resources',
  icons: {
    icon: ['/icon.png'],
  },
  openGraph: {
    title: 'enaiblr - AI Tools Search Engine',
    description: 'Simple and Straightforward Search Engine for Finding the Best AI Tools and Resources',
    url: 'https://enaiblr.org',
    siteName: 'enaiblr - AI Tools Search Engine',
    locale: 'en_ID, en_US',
    alternateLocale: 'en_ID, en_US',
    type: 'website',
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'enaiblr - AI Tools Search Engine',
    description: 'Simple and Straightforward Search Engine for Finding the Best AI Tools and Resources',
  },

  // Additional metadata
  keywords: ['search engine', 'artificial intelligence', 'ai tools', 'ai apps', 'ai resources', 'ai search engine', 'ai tools search engine', 'ai apps search engine', 'ai resources search engine', 'ai tools search', 'ai apps search', 'ai resources search', 'ai tools finder', 'ai apps finder', 'ai resources finder', 'ai tools directory', 'ai apps directory', 'ai resources directory', 'ai tools catalog', 'ai apps catalog', 'ai resources catalog', 'ai tools index', 'ai apps index', 'ai resources index', 'ai tools database', 'ai apps database', 'ai resources database', 'ai tools list', 'ai apps list', 'ai resources list', 'ai tools directory', 'ai apps directory', 'ai resources directory', 'ai tools catalog', 'ai apps catalog', 'ai resources catalog', 'ai tools index', 'ai apps index', 'ai resources index', 'ai tools database', 'ai apps database', 'ai resources database', 'ai tools list', 'ai apps list', 'ai resources list'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tFxU99IkWGK2ZMCtAscR_8k4yrvRWYdziVbgZniK3Pc', // From Google Search Console 
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en_US, en_ID" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}