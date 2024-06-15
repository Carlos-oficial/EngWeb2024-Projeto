import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { nameInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProfileCard({
  email,
  name,
  image,
}: {
  email: string;
  name: string;
  image: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <HoverCard onOpenChange={() => setOpen(!open)}>
      <HoverCardTrigger onClick={(e) => e.stopPropagation()}>
        <Button
          variant='link'
          className='p-0 text-muted-foreground font-normal h-fit'
          onClick={() => router.push(`/dashboard/profile/${email}`)}
        >
          {name.length > 15 ? name.slice(0, 15) + '...' : name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className='w-fit cursor-pointer'
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='flex justify-start space-x-4'
          onClick={() => router.push(`/dashboard/profile/${email}`)}
        >
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{nameInitials(name)}</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{name}</h4>
            <p className='text-sm'>{email}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
