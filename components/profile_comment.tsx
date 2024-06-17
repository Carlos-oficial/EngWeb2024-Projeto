import { CommentWithResourceDTO } from '@/lib/types';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ActionsMenu from '@/components/actions_menu';
import { timeAgo, formatNumber, nameInitials } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  addFavorite,
  removeFavorite,
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
} from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';
import CommentDialog from './comment_dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname, useRouter } from 'next/navigation';

export default function ProfileComment({
  comment,
  refreshResources,
}: {
  comment: CommentWithResourceDTO;
  refreshResources: () => void;
}) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [favoriteCounter, setFavoriteCounter] = useState<number>(
    comment.resource.favoritesNr,
  );
  const [downloadCounter, setDownloadCounter] = useState<number>(
    comment.resource.downloadsNr,
  );
  const [upvoteCounter, setUpvoteCounter] = useState<number>(
    comment.resource.upvotesNr,
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(
    comment.resource.isFavorite,
  );
  const [isUpvoted, setIsUpvoted] = useState<boolean>(
    comment.resource.isUpvoted,
  );
  const [isDownvoted, setIsDownvoted] = useState<boolean>(
    comment.resource.isDownvoted,
  );

  function handleDownload(event: React.MouseEvent<HTMLButtonElement>) {
    if (comment) {
      try {
        event.stopPropagation();
        fetch(`/api/resources/${comment.resource._id}/download`)
          .then((response) => {
            response
              .blob()
              .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${comment.resource._id}.${comment.resource.documentFormat.toLowerCase()}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setDownloadCounter(downloadCounter + 1);
                toast({
                  description: 'Download started.',
                });
              })
              .catch(() => {});
          })
          .catch(() => {});
      } catch (error) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    }
  }

  function handleUpvote() {
    if (comment) {
      try {
        if (session.status === 'authenticated') {
          if (isUpvoted) {
            setUpvoteCounter(upvoteCounter - 1);
            removeUpvote(session.data.user.email, comment.resource._id)
              .then(() => {})
              .catch(() => setUpvoteCounter(upvoteCounter + 1));
          } else {
            setUpvoteCounter(upvoteCounter + 1);
            isDownvoted && handleDownvote();
            addUpvote(session.data.user.email, comment.resource._id)
              .then(() => {})
              .catch(() => {
                setUpvoteCounter(upvoteCounter - 1);
                handleDownvote();
              });
          }
          setIsUpvoted(!isUpvoted);
        }
      } catch (error) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    }
  }

  function handleDownvote() {
    if (comment) {
      try {
        if (session.status === 'authenticated') {
          if (isDownvoted) {
            removeDownvote(session.data.user.email, comment.resource._id)
              .then(() => {})
              .catch(() => {});
          } else {
            isUpvoted && handleUpvote();
            addDownvote(session.data.user.email, comment.resource._id)
              .then(() => {})
              .catch(() => {
                handleUpvote();
              });
          }
          setIsDownvoted(!isDownvoted);
        }
      } catch (error) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    }
  }

  function handleFavorite() {
    if (comment) {
      try {
        if (session.status === 'authenticated') {
          if (isFavorite) {
            setFavoriteCounter(favoriteCounter - 1);
            removeFavorite(session.data.user.email, comment.resource._id)
              .then(() => {})
              .catch(() => setFavoriteCounter(favoriteCounter + 1));
          } else {
            setFavoriteCounter(favoriteCounter + 1);
            addFavorite(session.data.user.email, comment.resource._id)
              .then(() => {})
              .catch(() => setFavoriteCounter(favoriteCounter - 1));
          }
          setIsFavorite(!isFavorite);
        }
      } catch (error) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    }
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <div className='flex justify-start space-x-4 h-fit'>
        <div className='space-y-1.5 h-full'>
          <Avatar
            className='cursor-pointer'
            onClick={() =>
              router.push(`/dashboard/profile/${comment.resource.userEmail}`)
            }
          >
            <AvatarImage src={comment.resource.userImage} />
            <AvatarFallback>
              {nameInitials(comment.resource.userName)}
            </AvatarFallback>
          </Avatar>
          <div className='w-0.5 bg-border grow h-[calc(100%-3.25rem)] m-auto'></div>
        </div>
        <div className='space-y-3 w-full'>
          <div
            className='text-sm text-left cursor-pointer'
            onClick={() =>
              router.push(`/dashboard/profile/${comment.resource.userEmail}`)
            }
          >
            <span className='font-bold'>{comment.resource.userName}</span>{' '}
            <span className='text-muted-foreground'>
              {comment.resource.userEmail} ·{' '}
              {timeAgo(comment.resource.createdAt)}
              {comment.resource.edited !== null && ' · Edited'}
            </span>
          </div>
          <div
            onClick={() =>
              router.push(
                `/dashboard/resource/${comment.resource._id}?from=${pathname}`,
              )
            }
            className='w-full border-border border rounded-lg space-y-2 dark:hover:bg-gray-900 hover:bg-gray-50 hover:text-accent-foreground transition-colors'
          >
            <CardHeader>
              <div className='flex justify-between pb-2'>
                <div className='flex space-x-2'>
                  <Badge>{comment.resource.documentType.name}</Badge>
                  <Badge variant={'secondary'}>
                    {comment.resource.documentFormat}
                  </Badge>
                </div>
                {session.status === 'authenticated' &&
                session.data.user.email === comment.resource.userEmail ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionsMenu
                      resource={comment.resource}
                      refreshResources={refreshResources}
                    />
                  </div>
                ) : (
                  <button
                    disabled={session.status !== 'authenticated'}
                    onClick={
                      session.status === 'authenticated'
                        ? (e) => {
                            e.stopPropagation();
                            handleFavorite();
                          }
                        : () => {}
                    }
                    className={`flex space-x-1 ${session.status === 'authenticated' ? 'hover:text-yellow-500' : ''} transition-all ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                    title='Favorite'
                  >
                    <i
                      className={`${isFavorite ? 'ph-fill' : 'ph'} ph-star text-lg`}
                    ></i>
                    <p className='text-sm'>{formatNumber(favoriteCounter)}</p>
                  </button>
                )}
              </div>
              <CardTitle className='text-left'>
                {comment.resource.title}
              </CardTitle>
              {comment.resource.description &&
                comment.resource.description.length > 0 && (
                  <CardDescription className='text-left'>
                    {comment.resource.description}
                  </CardDescription>
                )}
              {comment.resource.hashtags &&
                comment.resource.hashtags.length > 0 && (
                  <div className='flex text-sm text-muted-foreground space-x-2'>
                    {comment.resource.hashtags.map((hashtag) => (
                      <span key={hashtag}>{hashtag}</span>
                    ))}
                  </div>
                )}
            </CardHeader>
            <CardContent>
              <ul className='space-y-1 text-sm overflow-hidden'>
                <li className='flex space-x-2 font-semibold'>
                  <i className='ph ph-chalkboard-teacher text-lg'></i>
                  <span>{comment.resource.subject.name}</span>
                </li>
                <li className='flex space-x-2 max-w-full text-muted-foreground'>
                  <i className='ph ph-graduation-cap text-lg'></i>
                  <span>{comment.resource.course.name}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <div className='flex w-full justify-between'>
                <div className='flex space-x-4'>
                  <button
                    disabled={session.status !== 'authenticated'}
                    onClick={
                      session.status === 'authenticated'
                        ? (e) => {
                            e.stopPropagation();
                            handleUpvote();
                          }
                        : () => {}
                    }
                    className={`flex space-x-1 ${session.status === 'authenticated' ? 'hover:text-orange-500' : ''} transition-all ${isUpvoted ? 'text-orange-500' : 'text-muted-foreground'}`}
                    title='Upvote'
                  >
                    <i
                      className={`${isUpvoted ? 'ph-fill' : 'ph'} ph-arrow-fat-up text-lg`}
                    ></i>
                    <p className='text-sm'>{formatNumber(upvoteCounter)}</p>
                  </button>
                  <button
                    disabled={session.status !== 'authenticated'}
                    onClick={
                      session.status === 'authenticated'
                        ? (e) => {
                            e.stopPropagation();
                            handleDownvote();
                          }
                        : () => {}
                    }
                    className={`flex space-x-1 ${session.status === 'authenticated' ? 'hover:text-purple-500' : ''} transition-all ${isDownvoted ? 'text-purple-500' : 'text-muted-foreground'}`}
                    title='Downvote'
                  >
                    <i
                      className={`${isDownvoted ? 'ph-fill' : 'ph'} ph-arrow-fat-down text-lg`}
                    ></i>
                  </button>
                </div>
                <CommentDialog resource={comment.resource} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(e);
                  }}
                  className={`flex space-x-1 ${session.status === 'authenticated' && 'hover:text-primary'} transition-all text-muted-foreground`}
                  title='Download'
                  type='button'
                >
                  <i className={`ph ph-download-simple text-lg`}></i>
                  <p className='text-sm'>{formatNumber(downloadCounter)}</p>
                </button>
              </div>
            </CardFooter>
          </div>
          <div className='text-sm text-left'>
            <span className='text-muted-foreground'>
              Replying to{' '}
              <span className='text-primary'>{comment.resource.userEmail}</span>
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col space-y-2 pb-4 border-b border-border'>
        <div className='flex space-x-4 items-center'>
          <Avatar>
            <AvatarImage src={comment.userImage} />
            <AvatarFallback>{nameInitials(comment.userName)}</AvatarFallback>
          </Avatar>
          <span className='text-lg'>{comment.message}</span>
        </div>
      </div>
    </div>
  );
}
