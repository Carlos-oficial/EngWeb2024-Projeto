'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import { LiteralUnion, useForm, SubmitHandler } from 'react-hook-form';
import { BuiltInProviderType } from 'next-auth/providers/index';

import { useToast } from './ui/use-toast';
import { signUp } from '@/lib/data';
import { UserSignUp } from '@/lib/types';
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
  firstName: z
    .string({ required_error: 'Please provide your first name' })
    .min(1, { message: 'Please provide your first name' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  lastName: z
    .string({ required_error: 'Please provide your last name' })
    .min(1, { message: 'Please provide your last name' })
    .max(50, { message: 'Last name must be at most 50 characters' }),
  email: z
    .string({ required_error: 'Please provide a valid email' })
    .email()
    .min(1, { message: 'Please provide a valid email' }),
  password: z
    .string({ required_error: 'Please provide a valid password' })
    .min(16, { message: 'Password must be at least 16 characters long' })
    .max(100, { message: 'Password must be at most 100 characters long' }),
});

export default function SignUpForm({
  providers,
}: {
  providers:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
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

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    signUp(values as UserSignUp)
      .then(() => {
        toast({
          description: 'Sign up successful!',
        });
        handleCredentialSignIn(values.email, values.password);
      })
      .catch((error: Error) => {
        toast({
          title: 'Sign up failed!',
          description: error.message,
        });
      });
  };

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className='mx-auto grid w-[350px] gap-6'>
      <div className='grid gap-2 text-center'>
        <h1 className='text-3xl font-bold'>Sign up</h1>
        <p className='text-balance text-muted-foreground'>
          Enter your information to create an account
        </p>
      </div>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Max' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Robinson' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
                      type='email'
                      placeholder='m@example.com'
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full'>
            Create an account
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
              <p>Create an account with {provider.name}</p>
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
            {error} Error
          </p>
        </div>
      )}
      <div className='mt-4 text-center text-sm'>
        Already have an account?{' '}
        <Link href='/auth/signin' className='underline'>
          Sign in
        </Link>
      </div>
    </div>
  );
}
