'use client';

import { CommentDTO } from '@/lib/types';
import { nameInitials, timeAgo } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function Comment({ comment }: { comment: CommentDTO }) {
  const router = useRouter();

  return (
    <div className='flex space-x-3 items-center py-4 border-b border-border w-full'>
      <div className='space-y-1.5 h-full'>
        <Avatar
          className='cursor-pointer'
          onClick={() => router.push(`/dashboard/profile/${comment.userEmail}`)}
        >
          <AvatarImage src={comment.userImage} />
          <AvatarFallback>{nameInitials(comment.userName)}</AvatarFallback>
        </Avatar>
      </div>
      <div className='space-y-1 w-full'>
        <div
          className='text-sm text-left cursor-pointer'
          onClick={() => router.push(`/dashboard/profile/${comment.userEmail}`)}
        >
          <span className='font-bold'>{comment.userName}</span>{' '}
          <span className='text-muted-foreground'>
            {comment.userEmail} · {timeAgo(comment.createdAt)}
          </span>
        </div>
        <div className='text-lg'>{comment.message}</div>
      </div>
    </div>
  );
}
