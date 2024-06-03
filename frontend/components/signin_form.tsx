'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import { LiteralUnion } from 'react-hook-form';
import { BuiltInProviderType } from 'next-auth/providers/index';

export default function SignInForm({
  providers,
}: {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
}) {
  const handleProviderSignIn = async (provider: ClientSafeProvider) => {
    await signIn(provider.id, { redirectTo: '/dashboard/resources' })
      .then(() => {})
      .catch(() => {});
  };

  const handleCredentialSignIn = async (data: FormData) => {
    await signIn('credentials', {
      username: data.get('email') as string,
      password: data.get('password') as string,
      redirectTo: '/dashboard/resources',
    })
      .then(() => {})
      .catch(() => {});
  };

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className='mx-auto grid w-[350px] gap-6'>
      <div className='grid gap-2 text-center'>
        <h1 className='text-3xl font-bold'>Sign in</h1>
        <p className='text-balance text-muted-foreground'>
          Enter your email below to sign in to your account
        </p>
      </div>
      <form className='grid gap-4' action={handleCredentialSignIn}>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='m@example.com' required />
        </div>
        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Password</Label>
            <Link
              href='/forgot-password'
              className='ml-auto inline-block text-sm underline'
            >
              Forgot your password?
            </Link>
          </div>
          <Input id='password' type='password' required />
        </div>
        <Button type='submit' className='w-full'>
          Sign in
        </Button>
        {Object.values(providers).map((provider) => (
          <Button
            key={provider.name}
            variant='outline'
            className='flex space-x-2 w-full'
            onClick={() => handleProviderSignIn(provider)}
          >
            <i className={`ph-fill ph-${provider.name.toLowerCase()}-logo`}></i>
            <p>Sign in with {provider.name}</p>
          </Button>
        ))}
        {error && (
          <div className='space-y-1'>
            <span className='text-center text-red-500 flex space-x-2 items-center justify-center'>
              <i className='ph ph-warning'></i>
              <p>Sorry, something went wrong!</p>
            </span>
            <p className='flex text-xs justify-center text-red-500'>
              {error} Error
            </p>
          </div>
        )}
      </form>
      <div className='mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/signup' className='underline'>
          Sign up
        </Link>
      </div>
    </div>
  );
}
