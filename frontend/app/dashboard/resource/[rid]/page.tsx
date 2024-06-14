'use client';

import Spinner from '@/components/spinner';
import { getResource, listResourceComments } from '@/lib/data';
import { ResourceDTO, CommentDTO } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import TextareaAutosize from 'react-textarea-autosize';
import { nameInitials, timeAgo, formatNumber } from '@/lib/utils';
import {
  getUser,
  addComment,
  addFavorite,
  removeFavorite,
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
} from '@/lib/data';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import ActionsMenu from '@/components/actions_menu';

export default function ResourcePage({ params }: { params: { rid: string } }) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [image, setImage] = useState<string>('');
  const [resource, setResource] = useState<ResourceDTO | null>(null);
  const [favoriteCounter, setFavoriteCounter] = useState<number>(0);
  const [downloadCounter, setDownloadCounter] = useState<number>(0);
  const [upvoteCounter, setUpvoteCounter] = useState<number>(0);
  const [commentsCounter, setCommentsCounter] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [isDownvoted, setIsDownvoted] = useState<boolean>(false);

  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<CommentDTO[] | null>(null);

  const refreshResource = useCallback(() => {
    getResource(params.rid)
      .then((resource) => {
        setFavoriteCounter(resource.favoritesNr);
        setDownloadCounter(resource.downloadsNr);
        setUpvoteCounter(resource.upvotesNr);
        setIsFavorite(resource.isFavorite);
        setIsUpvoted(resource.isUpvoted);
        setIsDownvoted(resource.isDownvoted);
        setCommentsCounter(resource.commentsNr);
        setResource(resource);
      })
      .catch(() => {
        router.push('/404');
      });
  }, [params.rid, router]);

  const refreshComments = useCallback(() => {
    listResourceComments(params.rid)
      .then((comments) => {
        console.log(comments);
        setComments(comments);
      })
      .catch(() => {});
  }, [params.rid]);

  useEffect(() => {
    refreshResource();
  }, [refreshResource]);

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  useEffect(() => {
    getUser(resource?.userEmail ?? '')
      .then((user) => setImage(user.image))
      .catch(() => {});
  }, [resource]);

  function handleComment(formData: FormData) {
    if (session.status === 'authenticated' && resource) {
      const comment = formData.get('comment') as string;

      addComment(resource._id, session.data.user.email, comment)
        .then(() => {
          setNewComment('');
          setCommentsCounter(commentsCounter + 1);
          refreshResource();
          refreshComments();

          toast({
            description: 'Your comment has been sent.',
          });
        })
        .catch(() => {});
    }
  }

  function handleDownload(event: React.MouseEvent<HTMLButtonElement>) {
    if (resource) {
      try {
        event.stopPropagation();
        fetch(`/api/resources/${resource._id}/download`)
          .then((response) => {
            response
              .blob()
              .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resource._id}.${resource.documentFormat.toLowerCase()}`;
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
    if (resource) {
      try {
        if (session.status === 'authenticated') {
          if (isUpvoted) {
            setUpvoteCounter(upvoteCounter - 1);
            removeUpvote(session.data.user.email, resource._id)
              .then(() => {})
              .catch(() => setUpvoteCounter(upvoteCounter + 1));
          } else {
            setUpvoteCounter(upvoteCounter + 1);
            isDownvoted && handleDownvote();
            addUpvote(session.data.user.email, resource._id)
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
    if (resource) {
      try {
        if (session.status === 'authenticated') {
          if (isDownvoted) {
            removeDownvote(session.data.user.email, resource._id)
              .then(() => {})
              .catch(() => {});
          } else {
            isUpvoted && handleUpvote();
            addDownvote(session.data.user.email, resource._id)
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
    if (resource) {
      try {
        if (session.status === 'authenticated') {
          if (isFavorite) {
            setFavoriteCounter(favoriteCounter - 1);
            removeFavorite(session.data.user.email, resource._id)
              .then(() => {})
              .catch(() => setFavoriteCounter(favoriteCounter + 1));
          } else {
            setFavoriteCounter(favoriteCounter + 1);
            addFavorite(session.data.user.email, resource._id)
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

  return resource !== null ? (
    <main className='flex h-full'>
      <div className='flex flex-col p-4 h-full w-full sm:px-32 md:px-48 lg:px-40 2xl:px-96'>
        <div className='flex justify-start space-x-4 h-fit'>
          <div className='space-y-1.5 h-full'>
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>{nameInitials(resource.userName)}</AvatarFallback>
            </Avatar>
            <div className='w-0.5 bg-border grow h-[calc(100%-3.25rem)] m-auto'></div>
          </div>
          <div className='space-y-3 w-full'>
            <div className='text-sm text-left'>
              <span className='font-bold'>{resource.userName}</span>{' '}
              <span className='text-muted-foreground'>
                {resource.userEmail} · {timeAgo(resource.createdAt)}
                {resource.edited !== null && ' · Edited'}
              </span>
            </div>
            <div className='w-full border-border border rounded-lg space-y-2'>
              <CardHeader>
                <div className='flex justify-between pb-2'>
                  <div className='flex space-x-2'>
                    <Badge>{resource.documentType.name}</Badge>
                    <Badge variant={'secondary'}>
                      {resource.documentFormat}
                    </Badge>
                  </div>
                  {session.status === 'authenticated' &&
                  session.data.user.email === resource.userEmail ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionsMenu
                        resource={resource}
                        refreshResources={refreshResource}
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
                  <div className={`flex space-x-1 text-muted-foreground`}>
                    <i className={`ph ph-chat-circle text-lg`}></i>
                    <p className='text-sm'>{formatNumber(commentsCounter)}</p>
                  </div>
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
                <span className='text-primary'>{resource.userEmail}</span>
              </span>
            </div>
          </div>
        </div>
        <form
          className='flex flex-col space-y-2 pb-4 border-b border-border'
          action={handleComment}
        >
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
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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
        {comments !== null ? (
          <div className='flex flex-col justify-center items-start'>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className='flex space-x-3 items-center py-4 border-b border-border w-full'
              >
                <div className='space-y-1.5 h-full'>
                  <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>
                      {nameInitials(comment.userName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='space-y-1 w-full'>
                  <div className='text-sm text-left'>
                    <span className='font-bold'>{comment.userName}</span>{' '}
                    <span className='text-muted-foreground'>
                      {comment.userEmail} · {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <div>{comment.message}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </main>
  ) : (
    <div className='flex items-center justify-center h-[calc(100vh-10rem)]'>
      <Spinner />
    </div>
  );
}