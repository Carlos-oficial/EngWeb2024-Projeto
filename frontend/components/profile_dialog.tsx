'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
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

interface ProfileDialogProps {
  name: string;
  email: string;
}

export default function ProfileDialog({ name, email }: ProfileDialogProps) {
  const session = useSession();
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
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
            <DialogTitle>Edit Profile</DialogTitle>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant='destructive' className='pt-4'>
                    <AlertTitle className='flex items-center space-x-1'>
                      <p>Error</p>
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter className='pt-3'>
                  <Button type='submit' className='flex space-x-1'>
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
