// others
import Navbar from '@/components/navbar';
import NavHeader from '@/components/navheader';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='min-h-screen flex flex-row'>
        <Navbar />
        <div className='w-full flex flex-col'>
          <NavHeader />
          <main className='grow w-full overflow-x-auto overflow-y-scroll max-h-[calc(100vh-61px)]'>
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}
