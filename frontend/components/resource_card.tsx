'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/profilecard';
import { timeAgo, formatNumber } from '@/lib/utils';
import { ResourceDTO } from '@/lib/types';
import { useSession } from 'next-auth/react';
import CommentDialog from '@/components/comment_dialog';
import {
  addUpvote,
  removeUpvote,
  addDownvote,
  removeDownvote,
  addFavorite,
  removeFavorite,
} from '@/lib/data';
import { useToast } from './ui/use-toast';
import ActionsMenu from './actions_menu';
import { useRouter } from 'next/navigation';

interface ResourceCardProps {
  resource: ResourceDTO;
  refreshResources: () => void;
  [key: string]: unknown;
}

export default function ResourceCard({
  resource,
  refreshResources,
  ...props
}: ResourceCardProps) {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [favoriteCounter, setFavoriteCounter] = useState<number>(
    resource.favoritesNr,
  );
  const [downloadCounter, setDownloadCounter] = useState<number>(
    resource.downloadsNr,
  );
  const [upvoteCounter, setUpvoteCounter] = useState<number>(
    resource.upvotesNr,
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(resource.isFavorite);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(resource.isUpvoted);
  const [isDownvoted, setIsDownvoted] = useState<boolean>(resource.isDownvoted);

  function handleDownload(event: React.MouseEvent<HTMLButtonElement>) {
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

  function handleUpvote() {
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

  function handleDownvote() {
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

  function handleFavorite() {
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

  return (
    <Card
      {...props}
      className='flex flex-col justify-between overflow-hidden dark:hover:bg-gray-900 hover:bg-gray-50 hover:text-accent-foreground transition-all'
      onClick={() => router.push(`/dashboard/resource/${resource._id}`)}
    >
      <CardHeader>
        <div className='flex justify-between items-center pb-2'>
          <span className='text-sm text-muted-foreground'>
            <ProfileCard email={resource.userEmail} name={resource.userName} />{' '}
            · {timeAgo(resource.createdAt)}
            {resource.edited !== null && ' · Edited'}
          </span>
          <div className='flex space-x-2'>
            {session.status === 'authenticated' &&
            session.data.user.email === resource.userEmail ? (
              <div onClick={(e) => e.stopPropagation()}>
                <ActionsMenu
                  resource={resource}
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
        </div>
        <div className='flex justify-between pb-2'>
          <div className='flex space-x-2'>
            <Badge>{resource.documentType.name}</Badge>
            <Badge variant={'secondary'}>{resource.documentFormat}</Badge>
          </div>
        </div>
        <CardTitle>{resource.title}</CardTitle>
        {resource.description && resource.description.length > 0 && (
          <CardDescription>{resource.description}</CardDescription>
        )}
        {resource.hashtags && resource.hashtags.length > 0 && (
          <div className='flex text-sm text-muted-foreground space-x-2'>
            {resource.hashtags.map((hashtag) => (
              <Link
                key={hashtag}
                href={`${pathname}?tag=${hashtag.split('#')[1]}`}
                className='hover:underline'
                onClick={(e) => e.stopPropagation()}
              >
                {hashtag}
              </Link>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ul className='space-y-1 text-sm overflow-hidden'>
          <li className='flex space-x-2 font-semibold'>
            <i className='ph ph-chalkboard-teacher text-lg'></i>
            <Link
              href={`${pathname}?course=${resource.course._id}&subject=${resource.subject._id}`}
              className='hover:underline'
              onClick={(e) => e.stopPropagation()}
            >
              {resource.subject.name}
            </Link>
          </li>
          <li className='flex space-x-2 max-w-full text-muted-foreground'>
            <i className='ph ph-graduation-cap text-lg'></i>
            <Link
              href={`${pathname}?course=${resource.course._id}`}
              className='hover:underline'
              onClick={(e) => e.stopPropagation()}
            >
              {resource.course.name}
            </Link>
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
          <div onClick={(e) => e.stopPropagation()}>
            <CommentDialog resource={resource} />
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
    </Card>
  );
}
