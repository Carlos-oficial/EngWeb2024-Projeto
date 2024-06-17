import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { nameInitials } from '@/lib/utils';
import { UserDB } from '@/lib/types';
import { signOut } from 'next-auth/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { editUser } from '@/lib/data';
import { useToast } from './ui/use-toast';
import { useState } from 'react';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  firstName: z
    .string({ required_error: 'Please provide a first name.' })
    .min(1, { message: 'Please provide a first name.' })
    .max(50, { message: 'First name must be at most 50 characters' }),
  lastName: z
    .string({ required_error: 'Please provide a last name.' })
    .min(1, { message: 'Please provide a last name.' })
    .max(50, { message: 'Last name must be at most 50 characters' }),
  email: z.string().email(),
});

export default function EditProfileDialog({
  user,
  refreshUser,
}: {
  user: UserDB;
  refreshUser: () => void;
}) {
  const session = useSession();
  const { toast } = useToast();

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
      email: user.email,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    const userInfo = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email === user.email ? undefined : values.email,
    } as Partial<UserDB>;

    editUser(user.email, userInfo)
      .then(() => {
        if (values.email !== user.email) {
          setOpen(false);
          toast({
            title: 'Profile updated successfully',
            description:
              "You'll be redirected in 5 seconds to sign in with your new email.",
          });
          setTimeout(() => {
            signOut({ callbackUrl: '/auth/signin' }).catch(() => {});
          }, 5000);
        } else {
          refreshUser();
          setOpen(false);
          toast({
            description: 'Profile updated successfully',
          });
        }
      })
      .catch((error: Error) => {
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
          <Button className='flex space-x-1 items-center'>
            <i className='ph ph-pencil-simple'></i>
            <span>Edit profile</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you{"'"}re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-flow-row auto-rows-max'>
              <div className='bg-accent w-full h-40 col-start-1 row-start-1 row-end-3'></div>
              <div className='flex justify-between row-start-2 row-end-4 col-start-1 px-4 items-end'>
                <div className='absolute flex z-50 bg-gray-900/30 w-28 h-28 rounded-full items-center justify-center'>
                  <i className='ph ph-camera-plus text-white p-3 bg-gray-900/70 hover:bg-primary/70 transition-colors rounded-full text-lg cursor-pointer'></i>
                </div>
                <Avatar className='w-28 h-28 ring-4 ring-background'>
                  <AvatarImage src={user.image} />
                  <AvatarFallback className='text-5xl'>
                    {nameInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Form {...form}>
              <form
                className='space-y-4 px-4'
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className='flex space-x-2'>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='space-y-2'>
                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className='pt-2 translate-x-2'>
                  <Button type='submit'>Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
