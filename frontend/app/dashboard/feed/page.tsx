'use client';

import Spinner from '@/components/spinner';
import SignInCard from '@/components/signin_card';

import { useSession } from 'next-auth/react';

export default function Feed() {
  const session = useSession();

  return session.status === 'authenticated' ? (
    <></>
  ) : session.status === 'loading' ? (
    <div className='w-full h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  ) : (
    <div className='w-full h-screen flex items-center justify-center'>
      <SignInCard message='You need to be signed in to access the feed.' />
    </div>
  );
}
