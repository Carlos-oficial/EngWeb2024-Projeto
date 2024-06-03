import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

import { getUser } from '@/lib/data';
import { UserDB } from '@/lib/types';
import Spinner from './spinner';
import { nameInitials } from '@/lib/utils';

export default function ProfileCard({ email }: { email: string }) {
  const [user, setUser] = useState<UserDB | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      const user = await getUser(email);
      setUser(user);
    }

    fetchUserData().catch(() => {});
  }, [email]);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant='link'
          className='p-0 text-muted-foreground font-normal h-fit'
        >
          {user !== null
            ? user.name.length > 15
              ? user.name.slice(0, 15) + '...'
              : user.name
            : email.length > 15
              ? email.slice(0, 15) + '...'
              : email}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit'>
        {user !== null ? (
          <div className='flex justify-start space-x-4'>
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>{nameInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <h4 className='text-sm font-semibold'>{user.name}</h4>
              <p className='text-sm'>{email}</p>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
