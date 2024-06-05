'use client';
// others
import Navbar from '@/components/navbar';
import NavHeader from '@/components/navheader';

import { useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(true);

  return (
    <>
      <div className='min-h-screen flex flex-row'>
        <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />
        <div className='w-full flex flex-col'>
          <NavHeader setIsNavbarOpen={setIsNavbarOpen} />
          <main className='grow w-full overflow-x-auto overflow-y-scroll max-h-[calc(100vh-61px)]'>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
