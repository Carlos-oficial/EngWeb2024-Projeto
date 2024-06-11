import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

import { getUser } from '@/lib/data';
import Spinner from './spinner';
import { nameInitials } from '@/lib/utils';

export default function ProfileCard({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    async function fetchUserData() {
      const user = await getUser(email);
      setImage(user.image);
    }
    if (open) {
      fetchUserData().catch(() => {});
    }
  }, [email, open]);

  return (
    <HoverCard onOpenChange={() => setOpen(!open)}>
      <HoverCardTrigger>
        <Button
          variant='link'
          className='p-0 text-muted-foreground font-normal h-fit'
        >
          {name.length > 15 ? name.slice(0, 15) + '...' : name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit'>
        {image !== '' ? (
          <div className='flex justify-start space-x-4'>
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>{nameInitials(name)}</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <h4 className='text-sm font-semibold'>{name}</h4>
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
