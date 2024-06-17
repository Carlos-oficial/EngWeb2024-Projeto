'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignOut() {
  function handleSignOut() {
    signOut({ callbackUrl: '/dashboard' }).catch(() => {});
  }

  return (
    <main className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col space-y-3'>
        <h2 className='text-center'>Are you sure you want to sign out?</h2>
        <Button
          className='w-fit m-auto'
          variant={'default'}
          onClick={() => handleSignOut()}
        >
          Sign out
        </Button>
      </div>
    </main>
  );
}
