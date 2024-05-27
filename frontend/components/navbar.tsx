'use client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavLink from '@/components/navlink';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='w-80 border-r border-border'>
      <div className='p-2 border-b border-border'>
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
              <AvatarImage src='https://github.com/shadcn.png' alt='username' />
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
            <span>Diogo Matos</span>
          </div>
          <span>{'->'}</span>
        </Button>
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
