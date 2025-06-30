import './global.css';
// import { RootProvider } from 'fumadocs-ui/provider';
import { Provider } from '@/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    default: 'Recipe Book',
    template: '%s – Recipe Book',
  },
  description: 'Your place for delicious recipes.',
};
