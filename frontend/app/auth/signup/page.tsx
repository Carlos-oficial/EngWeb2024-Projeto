import Image from 'next/image';

import SignUpForm from '@/components/signup_form';

import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RedirectType, redirect } from 'next/navigation';

export default async function SignUp() {
  const session = await getServerSession(authOptions);
  const providers = (await getProviders()) ?? [];

  if (!session) {
    return (
      <div className='w-full h-screen lg:grid lg:grid-cols-2'>
        <div className='flex items-center justify-center py-12'>
          <SignUpForm providers={providers} />
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
