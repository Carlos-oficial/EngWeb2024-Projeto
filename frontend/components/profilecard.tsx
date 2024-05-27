import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

export default function ProfileCard({ username }: { username: string }) {
  // TODO: fetch profile information with username

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          variant='link'
          className='p-0 text-muted-foreground font-normal h-fit'
        >
          {username}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-80'>
        <div className='flex justify-between space-x-4'>
          <Avatar>
            <AvatarImage src='https://github.com/vercel.png' />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>@nextjs</h4>
            <p className='text-sm'>
              The React Framework – created and maintained by @vercel.
            </p>
            <div className='flex items-center pt-2'>
              <i className='ph ph-calendar-blank'></i>{' '}
              <span className='text-xs text-muted-foreground'>
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
