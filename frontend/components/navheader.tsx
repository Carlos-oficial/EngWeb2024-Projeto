'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import ModeToggle from './mode_toggle';
import Link from 'next/link';

export default function NavHeader({
  setIsNavbarOpen,
}: {
  setIsNavbarOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page_title =
    pathname === '/dashboard'
      ? 'Popular'
      : pathname === '/dashboard/favorites'
        ? 'Favorites'
        : pathname === '/dashboard/newest'
          ? 'Newest'
          : pathname.startsWith('/dashboard/resource/')
            ? 'Resource'
            : 'Profile';

  return (
    <header className='py-2 px-5 w-full border-b border-border h-fit'>
      <div className='flex h-11 items-center justify-between'>
        <div className='flex space-x-4 items-center'>
          {page_title === 'Resource' && (
            <Link
              className='flex items-center rounded-full p-2 hover:bg-accent transition-colors'
              href={`/dashboard/${searchParams.get('from') === 'dashboard' ? '' : searchParams.get('from')}`}
            >
              <i className='ph-bold ph-arrow-left text-xl'></i>
            </Link>
          )}
          <h1 className='text-xl font-bold'>{page_title}</h1>
        </div>
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
