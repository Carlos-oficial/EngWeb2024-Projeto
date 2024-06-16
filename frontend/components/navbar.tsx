'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavLink from '@/components/navlink';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { nameInitials } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function Navbar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();

  function handleSignOut() {
    signOut({ callbackUrl: '/dashboard' }).catch(() => { });
  }

  const isProfile =
    session.status === 'authenticated' &&
    (session.data.user.email === pathname.split('/').pop() ||
      session.data.user.email === searchParams.get('from')?.split('/').pop()) &&
    (pathname.startsWith('/dashboard/profile/') ||
      searchParams.get('from')?.startsWith('/dashboard/profile/'));
  return (
    <div
      className={`  ${isOpen ? 'translate-x-0' : '-translate-x-full'} absolute z-50 bg-background w-full lg:min-w-64 lg:w-auto h-screen border-r border-border lg:translate-x-0 lg:relative lg:transition-all duration-300`}
    >
      <div className='p-2 border-b border-border'>
        <div className='flex space-x-2 items-center'>
          <div
            className={`flex rounded p-3  items-center w-full h-11 justify-between ${isProfile ? ('ring-1 ring-ring') : 'border border-input bg-background shadow-sm'}`}
          >
            <button
              title='Profile'
              className='flex space-x-2 items-center'
              disabled={session.status !== 'authenticated'}>
              <Avatar className='h-6 w-6' onClick={
                session.status === 'authenticated'
                  ? () =>
                    router.push('/dashboard/profile/' + session.data.user.email)
                  : () => router.push('/auth/signin')
              }>
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
                  <AvatarFallback>
                    <i className='ph ph-user'></i>
                  </AvatarFallback>
                )}
              </Avatar>
              {session.status === 'authenticated' ? (
                <span>{session.data.user?.name}</span>
              ) : (
                <span>Guest</span>
              )}
            </button>

            {session.status === 'unauthenticated' ? (
              <button title="signin" className='hover:scale-105 flex items-center' onClick={() => router.push('/auth/signin')}>
                <i className='ph ph-sign-in' ></i>
              </button>
            ) :
              <AlertDialog>
                <AlertDialogTrigger asChild >
                  <button title="signout" className='hover:scale-105 flex items-center'>
                    <i className='ph ph-sign-out' ></i>

                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="flex justify-between items-center">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel> Cancel</AlertDialogCancel>
                    <AlertDialogAction  onClick={() => handleSignOut()} >Sign out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            }
          </div>
          <Button
            variant='outline'
            className='lg:hidden h-11 w-11'
            onClick={() => setIsOpen(false)}
          >
            <i className='ph ph-x'></i>
          </Button>
        </div>
      </div>
      <nav className='grid gap-1 p-2'>
        <NavLink
          active={
            pathname === '/dashboard' ||
            searchParams.get('from') === '/dashboard'
          }
          href='/dashboard'
        >
          <i className='ph ph-fire text-xl'></i>
          <span>Popular</span>
        </NavLink>
        <NavLink
          active={
            pathname === '/dashboard/newest' ||
            searchParams.get('from') === '/dashboard/newest'
          }
          href='/dashboard/newest'
        >
          <i className='ph ph-seal text-xl'></i>
          <span>Newest</span>
        </NavLink>
        <NavLink
          active={
            pathname === '/dashboard/favorites' ||
            searchParams.get('from') === '/dashboard/favorites'
          }
          href='/dashboard/favorites'
        >
          <i className='ph ph-star text-xl'></i>
          <span>Favorites</span>
        </NavLink>
      </nav>
    </div>
  );
}
