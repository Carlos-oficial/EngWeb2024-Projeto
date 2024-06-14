import Image from 'next/image';

import SignInForm from '@/components/signin_form';

import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { RedirectType, redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  const providers = (await getProviders()) ?? [];

  if (!session) {
    return (
      <div className='w-full h-screen lg:grid lg:grid-cols-2'>
        <div className='flex items-center justify-center py-12'>
          <SignInForm providers={providers} />
        </div>
        <div className='hidden bg-muted lg:block'>
          <Image
            src='/placeholder.svg'
            alt='Image'
            width='1920'
            height='1080'
            className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          />
        </div>
      </div>
    );
  } else {
    redirect('/dashboard', RedirectType.replace);
  }
}
