import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';
import NextAuthProvider from '@/app/context/NextAuthProvider';
import ThemeProvider from '@/app/context/ThemeProvider';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'UniShare',
  description: 'Empowering Learning Together',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css'
        />
      </head>
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>{children}</NextAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
