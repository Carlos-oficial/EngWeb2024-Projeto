'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import SignInCard from '@/components/signin_card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/spinner';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name must be at least 1 character' }),
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
});

export default function ProfileEditDialog() {
  const session = useSession();
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "tester", // Replace this with the actual name from the user data
      email:"tester"
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    // Handle the form submission to update the user profile
    // Replace the following code with actual update logic
    console.log('Updated values:', values);
    setOpen(false);
    toast({
      title: 'Profile updated successfully!',
      description: 'Your profile has been updated.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {session.status === 'authenticated' && (
        <DialogTrigger asChild>
          <Button variant={'outline'} className='flex space-x-1 w-full mt-4'>
            <p>Edit Profile</p>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className='h-full md:max-h-[calc(70vh)] overflow-y-scroll'>
        {session.status === 'loading' ? (
          <Spinner />
        ) : session.status === 'authenticated' ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Your full name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' {...field} />
                      </FormControl>
                      <FormDescription>Your email address.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error.length > 0 && (
                  <Alert variant='destructive' className='pt-4'>
                    <AlertTitle className='flex items-center space-x-1'>
                      <i className='ph ph-warning'></i>
                      <p>Error</p>
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter className='pt-3'>
                  <Button type='submit' className='flex space-x-1'>
                    <i className='ph ph-file-arrow-up'></i>
                    <p>Save</p>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <SignInCard message='You need to be signed in to edit your profile.' />
        )}
      </DialogContent>
    </Dialog>
  );
}
