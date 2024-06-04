'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavLink from '@/components/navlink';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { nameInitials } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const isProfile =
    session.status === 'authenticated' &&
    session.data.user.email === pathname.split('/').pop() &&
    pathname.includes('/dashboard/') &&
    !pathname.includes('/dashboard/favorites') &&
    !pathname.includes('/dashboard/feed');

  return (
    <div className='w-80 border-r border-border'>
      <div className='p-2 border-b border-border'>
        <Button
          variant={'outline'}
          className={`w-full h-11 justify-between ${isProfile && 'ring-1 ring-ring'}`}
          onClick={
            session.status === 'authenticated'
              ? () => router.push('/dashboard/' + session.data.user.email)
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
      </div>
      <nav className='grid gap-1 p-2'>
        <NavLink active={pathname === '/dashboard'} href='/dashboard'>
          <i className='ph ph-folder text-xl'></i>
          <span>Resources</span>
        </NavLink>
        <NavLink
          active={pathname === '/dashboard/favorites'}
          href='/dashboard/favorites'
        >
          <i className='ph ph-star text-xl'></i>
          <span>Favorites</span>
        </NavLink>
        <NavLink active={pathname === '/dashboard/feed'} href='/dashboard/feed'>
          <i className='ph ph-users-three text-xl'></i>
          <span>Feed</span>
        </NavLink>
      </nav>
    </div>
  );
}
