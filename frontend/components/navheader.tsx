'use client';

import { usePathname } from 'next/navigation';

export default function NavHeader() {
  const pathname = usePathname();
  const page_title =
    pathname === '/resources'
      ? 'Resources'
      : pathname === '/favorites'
        ? 'Favorites'
        : pathname === '/feed'
          ? 'Feed'
          : 'Profile';

  return (
    <header className='py-2 px-5 w-full border-b border-border h-fit'>
      <div className='flex h-11 items-center'>
        <h1 className='text-xl font-bold'>{page_title}</h1>
      </div>
    </header>
  );
}
