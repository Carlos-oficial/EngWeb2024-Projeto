'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavLink from '@/components/navlink';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { nameInitials } from '@/lib/utils';

export default function Navbar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const isProfile =
    session.status === 'authenticated' &&
    session.data.user.email === pathname.split('/').pop() &&
    pathname.includes('/dashboard/profile/');

  return (
    <div
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} absolute bg-background w-full lg:min-w-64 lg:w-auto h-screen border-r border-border lg:translate-x-0 lg:relative transition-all duration-300`}
    >
      <div className='p-2 border-b border-border'>
        <div className='flex space-x-2 items-center'>
          <Button
            variant={'outline'}
            className={`w-full h-11 justify-between ${isProfile && 'ring-1 ring-ring'}`}
            onClick={
              session.status === 'authenticated'
                ? () =>
                    router.push('/dashboard/profile/' + session.data.user.email)
                : () => router.push('/auth/signin')
            }
          >
            <div className='flex space-x-3 items-center'>
              <Avatar className='h-6 w-6'>
                {session.status === 'authenticated' ? (
                  <>
                    <AvatarImage
                      src={session.data.user?.image}
                      alt={session.data.user?.name}
                    />
                    <AvatarFallback>
                      {nameInitials(session.data.user.name)}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback>G</AvatarFallback>
                )}
              </Avatar>
              {session.status === 'authenticated' ? (
                <span>{session.data.user?.name}</span>
              ) : (
                <span>Guest</span>
              )}
            </div>
            <span>{'->'}</span>
          </Button>
          <Button
            variant='outline'
            className='lg:hidden h-11 w-12'
            onClick={() => setIsOpen(false)}
          >
            <i className='ph ph-x'></i>
          </Button>
        </div>
      </div>
      <nav className='grid gap-1 p-2'>
        <NavLink active={pathname === '/dashboard'} href='/dashboard'>
          <i className='ph ph-fire text-xl'></i>
          <span>Popular</span>
        </NavLink>
        <NavLink
          active={pathname === '/dashboard/newest'}
          href='/dashboard/newest'
        >
          <i className='ph ph-seal text-xl'></i>
          <span>Newest</span>
        </NavLink>
        <NavLink
          active={pathname === '/dashboard/favorites'}
          href='/dashboard/favorites'
        >
          <i className='ph ph-star text-xl'></i>
          <span>Favorites</span>
        </NavLink>
      </nav>
      <div className='p-2 border-t border-border justify-end'>
        <div className='flex space-x-2 items-center'>
          <Button
            variant={'outline'}
            className={`w-full h-11 justify-between ${isProfile && 'ring-1 ring-ring'}`}
            onClick={
              session.status === 'authenticated'
                ? () =>
                    router.push('/dashboard/profile/' + session.data.user.email)
                : () => router.push('/auth/signin')
            }
          >
            <div className='flex space-x-3 items-center'>
              Sign Out
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
