'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import ModeToggle from './mode_toggle';

export default function NavHeader({
  setIsNavbarOpen,
}: {
  setIsNavbarOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const page_title =
    pathname === '/dashboard'
      ? 'Popular'
      : pathname === '/dashboard/favorites'
        ? 'Favorites'
        : pathname === '/dashboard/newest'
          ? 'Newest'
          : 'Profile';

  return (
    <header className='py-2 px-5 w-full border-b border-border h-fit'>
      <div className='flex h-11 items-center justify-between'>
        <h1 className='text-xl font-bold'>{page_title}</h1>
        <div className='flex space-x-2'>
          <ModeToggle />
          <Button
            variant='outline'
            className='flex lg:hidden w-11 h-11'
            onClick={() => setIsNavbarOpen(true)}
          >
            <i className='ph ph-list'></i>
          </Button>
        </div>
      </div>
    </header>
  );
}
