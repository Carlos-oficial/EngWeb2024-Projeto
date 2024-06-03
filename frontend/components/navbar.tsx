'use client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavLink from '@/components/navlink';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  return (
    <div className='w-80 border-r border-border'>
      <div className='p-2 border-b border-border'>
        {session.status == 'authenticated' ? (
          <Button
            variant={'outline'}
            className='w-full h-11 justify-between'
            onClick={() => {
              router.push('/profile');
              return void 0;
            }}
          >
            <div className='flex space-x-3 items-center'>
              <Avatar className='h-6 w-6'>
                <AvatarImage
                  src={
                    session.data.user?.image ?? 'https://github.com/shadcn.png'
                  }
                  alt={session.data.user?.name ?? ''}
                />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              <span>{session.data.user?.name}</span>
            </div>
            <span>{'->'}</span>
          </Button>
        ) : (
          <Button
            variant={'outline'}
            className='w-full h-11 justify-between'
            onClick={() => {
              router.push('/api/auth/signin');
              return void 0;
            }}
          >
            <div className='flex space-x-3 items-center'>
              <>
                <span>Not Logged in</span>
              </>
            </div>
            <span>{'->'}</span>
          </Button>
        )}
      </div>
      <nav className='grid gap-1 p-2'>
        <NavLink active={pathname === '/resources'} href='/resources'>
          <i className='ph ph-folder text-xl'></i>
          <span>Resources</span>
        </NavLink>
        <NavLink active={pathname === '/favorites'} href='/favorites'>
          <i className='ph ph-star text-xl'></i>
          <span>Favorites</span>
        </NavLink>
        <NavLink active={pathname === '/feed'} href='/feed'>
          <i className='ph ph-users-three text-xl'></i>
          <span>Feed</span>
        </NavLink>
      </nav>
    </div>
  );
}
