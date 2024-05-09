import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import type { Metadata } from 'next';
import localFont from '@next/font/local';
import { ReactQueryProvider } from './ReactQueryProvider';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Footer } from '@/modules/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';

const gothicFont = localFont({
  src: [{ path: '../public/fonts/Gothic2Nacht.ttf', weight: '300' }],
  variable: '--font-gothic',
});

export const metadata: Metadata = {
  title: 'Gothicdle',
  description: 'Sprobuj odgadnac dzisiejsza postac w Gothicdle!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${gothicFont.variable} font-sans`}>
        <ReactQueryProvider>
          <SkeletonTheme baseColor='#0c161b' highlightColor='#3f7391'>
            {children}
            <Footer />
            <Toaster
              position='top-center'
              containerStyle={{ margin: '8px' }}
              toastOptions={{
                success: {
                  duration: 2000,
                },
                error: {
                  duration: 5000,
                },
                style: {
                  fontSize: '16px',
                  maxWidth: '500px',
                  padding: '16px 24px',
                  backgroundColor: '#182d39',
                  color: '#fdf7e6',
                },
              }}
            />
          </SkeletonTheme>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
