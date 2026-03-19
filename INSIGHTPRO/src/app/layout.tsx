import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'AI Clone — Enterprise AI Search Engine',
  description:
    'AI Clone is an enterprise-grade AI search engine with multi-query expansion, source reranking, and deep research synthesis for professionals.',
  keywords: ['AI search', 'research engine', 'enterprise AI', 'AI Clone'],
  authors: [{ name: 'AI Clone Team' }],
  openGraph: {
    title: 'AI Clone — Enterprise AI Search Engine',
    description: 'Deep research AI that thinks before it answers.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
