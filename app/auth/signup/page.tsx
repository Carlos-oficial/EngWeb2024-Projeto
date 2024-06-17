import SignUpForm from '@/components/signup_form';

import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { RedirectType, redirect } from 'next/navigation';
import Logo from '@/components/logo';

export default async function SignUp() {
  const session = await getServerSession(authOptions);
  const providers = (await getProviders()) ?? [];

  if (!session) {
    return (
      <div className='w-full h-screen lg:grid lg:grid-cols-2'>
        <div className='flex items-center justify-center py-12'>
          <SignUpForm providers={providers} />
        </div>
        <div className='hidden bg-primary lg:flex justify-center items-center space-x-4'>
          <Logo size='7xl' />
        </div>
      </div>
    );
  } else {
    redirect('/dashboard', RedirectType.replace);
  }
}
