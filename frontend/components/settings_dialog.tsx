import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { UserDTO } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { signOut } from 'next-auth/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { updateUserPassword } from '@/lib/data';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'Please provide a valid password' })
    .max(100, { message: 'Password must be at most 100 characters' }),
  newPassword: z
    .string()
    .min(16, { message: 'Password must be at least 16 characters' })
    .max(100, { message: 'Password must be at most 100 characters' }),
});

const Separator = ({ name }: { name: string }) => (
  <div className='flex space-x-2 items-center'>
    <div className='w-4 h-0.5 bg-border' />
    <span className='font-semibold text-sm'>{name}</span>
    <div className='w-full h-0.5 bg-border' />
  </div>
);

export default function SettingsDialog({ user }: { user: UserDTO }) {
  const session = useSession();
  const { toast } = useToast();

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      newPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    updateUserPassword(user.email, values.password, values.newPassword)
      .then(() => {
        setOpen(false);
        toast({
          title: 'Password updated successfully',
          description:
            "You'll be redirected in 5 seconds to sign in with your new password.",
        });
        setTimeout(() => {
          signOut({ callbackUrl: '/auth/signin' }).catch(() => {});
        }, 5000);
      })
      .catch((error: Error) => {
        setOpen(false);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        });
      });
  };

  return (
    session.status === 'authenticated' &&
    session.data.user.email === decodeURIComponent(user.email) && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant='secondary'
            className='w-10 flex items-center'
            title='Account settings'
          >
            <i className='ph ph-user-gear text-lg'></i>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Make changes to your account here.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-col space-y-2'>
              <Separator name='Security' />
              <div className='flex space-x-2 items-center text-sm text-muted-foreground'>
                <i className='ph ph-password text-base'></i>
                <span>Password</span>
              </div>
              {user.hasPassword ? (
                <Form {...form}>
                  <form
                    className='space-y-4'
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className='flex space-x-2'>
                      <div className='space-y-2'>
                        <FormField
                          control={form.control}
                          name='password'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input {...field} type='password' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='space-y-2'>
                        <FormField
                          control={form.control}
                          name='newPassword'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type='password' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className='w-full flex justify-end'>
                      <Button variant='secondary'>Change password</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <p>
                  Your account doesn{"'"}t have an associated password since you
                  signed up with a third party provider.
                </p>
              )}
              <div className='flex flex-col space-y-2'>
                <Separator name='Others' />
                <div className='flex space-x-2 items-center text-sm text-muted-foreground'>
                  <i className='ph ph-user-minus'></i>
                  <span>Delete account</span>
                </div>
                <div className='w-full flex justify-end'>
                  <Button variant='destructive'>
                    Delete my account and all associated data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
