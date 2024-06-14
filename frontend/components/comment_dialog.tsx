import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CardTitle, CardDescription, CardHeader, CardContent } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { formatNumber } from '@/lib/utils';
import { ResourceDTO } from '@/lib/types';
import { addComment, getUser } from '@/lib/data';
import { useEffect, useState } from 'react';
import { nameInitials } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { timeAgo } from '@/lib/utils';

export default function CommentDialog({ resource }: { resource: ResourceDTO }) {
  const session = useSession();
  const { toast } = useToast();

  const [commentsCounter, setCommentsCounter] = useState<number>(
    resource.commentsNr,
  );
  const [image, setImage] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  function handleComment(formData: FormData) {
    if (session.status === 'authenticated') {
      const comment = formData.get('comment') as string;

      addComment(resource._id, session.data.user.email, comment)
        .then(() => {
          setOpen(false);
          setCommentsCounter(commentsCounter + 1);
          setTimeout(() => {
            toast({
              description: 'Your comment has been sent.',
            });
          }, 300);
        })
        .catch(() => {});
    }
  }

  useEffect(() => {
    if (open) {
      getUser(resource?.userEmail ?? '')
        .then((user) => setImage(user.image))
        .catch(() => {});
    }
  }, [resource, open]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <button
          disabled={session.status !== 'authenticated'}
          className={`flex space-x-1 ${session.status === 'authenticated' && 'hover:text-green-500'} transition-all text-muted-foreground`}
          title='Comment'
        >
          <i className={`ph ph-chat-circle text-lg`}></i>
          <p className='text-sm'>{formatNumber(commentsCounter)}</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className='flex justify-start space-x-4 h-fit'>
            <div className='space-y-1.5 h-full'>
              <Avatar>
                <AvatarImage src={image} />
                <AvatarFallback>
                  {nameInitials(resource.userName)}
                </AvatarFallback>
              </Avatar>
              <div className='w-0.5 bg-border grow h-[calc(100%-2.75rem)] m-auto'></div>
            </div>
            <div className='space-y-3 w-full'>
              <p className='text-sm text-left'>
                <span className='font-bold'>{resource.userName}</span>{' '}
                <span className='text-muted-foreground'>
                  {resource.userEmail} · {timeAgo(resource.createdAt)}
                </span>
              </p>
              <div className='w-full border-border border rounded-lg space-y-2'>
                <CardHeader>
                  <div className='flex justify-between pb-2'>
                    <div className='flex space-x-2'>
                      <Badge>{resource.documentType.name}</Badge>
                      <Badge variant={'secondary'}>
                        {resource.documentFormat}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className='text-left'>{resource.title}</CardTitle>
                  {resource.description && resource.description.length > 0 && (
                    <CardDescription className='text-left'>
                      {resource.description}
                    </CardDescription>
                  )}
                  {resource.hashtags && resource.hashtags.length > 0 && (
                    <div className='flex text-sm text-muted-foreground space-x-2'>
                      {resource.hashtags.map((hashtag) => (
                        <span key={hashtag}>{hashtag}</span>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className='space-y-1 text-sm overflow-hidden'>
                    <li className='flex space-x-2 font-semibold'>
                      <i className='ph ph-chalkboard-teacher text-lg'></i>
                      <span>{resource.subject.name}</span>
                    </li>
                    <li className='flex space-x-2 max-w-full text-muted-foreground'>
                      <i className='ph ph-graduation-cap text-lg'></i>
                      <span>{resource.course.name}</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
              <div className='text-sm text-left'>
                <span className='text-muted-foreground'>
                  Replying to{' '}
                  <span className='text-primary'>{resource.userEmail}</span>
                </span>
              </div>
            </div>
          </div>
          <form className='flex flex-col space-y-3' action={handleComment}>
            <div className='flex space-x-3 items-center'>
              <Avatar>
                <AvatarImage src={session.data?.user.image ?? '...'} />
                <AvatarFallback>
                  {nameInitials(session.data?.user.name ?? '...')}
                </AvatarFallback>
              </Avatar>
              <TextareaAutosize
                name='comment'
                placeholder={
                  commentsCounter > 0
                    ? 'Write your comment here...'
                    : 'Be the first to comment!'
                }
                rows={1}
                className='placeholder:text-muted-foreground focus-visible:outline-none rounded w-full resize-none h-fit bg-background'
                autoComplete='off'
                maxLength={280}
                required
              ></TextareaAutosize>
            </div>
            <div className='flex w-full justify-end'>
              <Button className='flex space-x-1 items-center' type='submit'>
                <i className='ph ph-paper-plane-tilt'></i>
                <span>Comment</span>
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
