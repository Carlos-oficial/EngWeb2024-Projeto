'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { LiteralUnion, useForm, SubmitHandler } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z
    .string({ required_error: 'Please provide a valid email' })
    .email()
    .min(1, { message: 'Please provide a valid email' }),
  password: z
    .string({ required_error: 'Please provide a password' })
    .min(1, { message: 'Please provide a password' }),
});

export default function SignInForm({
  providers,
}: {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleProviderSignIn = (provider: ClientSafeProvider) => {
    signIn(provider.id, { callbackUrl: '/dashboard' })
      .then(() => {})
      .catch(() => {});
  };

  const handleCredentialSignIn = (email: string, password: string) => {
    signIn('credentials', {
      email: email,
      password: password,
      callbackUrl: '/dashboard',
    })
      .then(() => {})
      .catch(() => {});
  };

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    handleCredentialSignIn(values.email, values.password);
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
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='m@example.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      href='/forgot-password'
                      className='ml-auto inline-block text-sm underline'
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full'>
            Sign in
          </Button>
        </form>
      </Form>
      {Object.values(providers).map((provider) => {
        if (provider.name !== 'Email') {
          return (
            <Button
              key={provider.name}
              variant='outline'
              className='flex space-x-2 w-full'
              onClick={() => handleProviderSignIn(provider)}
            >
              <i
                className={`ph-fill ph-${provider.name.toLowerCase()}-logo`}
              ></i>
              <p>Sign in with {provider.name}</p>
            </Button>
          );
        }
      })}
      {error && (
        <div className='space-y-1'>
          <span className='text-center text-red-500 flex space-x-2 items-center justify-center'>
            <i className='ph ph-warning'></i>
            <p>Sorry, something went wrong!</p>
          </span>
          <p className='flex text-xs justify-center text-red-500'>
            {error === 'CredentialsSignin'
              ? 'Invalid email or password'
              : error}
          </p>
        </div>
      )}
      <div className='mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/signup' className='underline'>
          Sign up
        </Link>
      </div>
    </div>
  );
}
