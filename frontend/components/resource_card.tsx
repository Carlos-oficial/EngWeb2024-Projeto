'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfileCard from '@/components/profilecard';
import { timeAgo, formatNumber } from '@/lib/utils';
import { ResourceDTO } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { addFavorite, getResourceFavorites, getUserFavorites, rmFavorite } from '@/lib/data';

interface ResourceCardProps {
  resource: ResourceDTO;
  [key: string]: unknown;
}

export default function ResourceCard({
  resource,
  ...props
}: ResourceCardProps) {
  const session = useSession();
  const router = useRouter();
  const [favoriteCounter, setFavoriteCounter] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<String[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session.data?.user?.id)
      getUserFavorites(session.data?.user?.id)
        .then((favorites) => {setFavorites(favorites);setIsFavorite(favorites.includes(resource._id))})
        .catch((error: Error) => setError(error.message));
  }, [session]);

  useEffect(() => {
      getResourceFavorites(resource._id)
        .then((favorites) => {setFavoriteCounter(favorites.length)})
        .catch((error: Error) => setError(error.message));
  }, [session]);

  

  // TODO: fetch favorite counter information
  function handleFavorite() {
    if (!session.data?.user.email) {
      return;
    } else {
      if (isFavorite) {
        setFavoriteCounter(favoriteCounter - 1);
        rmFavorite(session.data.user.id,resource._id).catch(() => {}); 
      } else {
        setFavoriteCounter(favoriteCounter + 1);
        addFavorite(session.data.user.email, resource._id).catch(() => {});
      }
      setIsFavorite(!isFavorite);
    }
  }


  return (
    <Card {...props}>
      <CardHeader>
        <div className='flex justify-between items-center pb-2'>
          <span className='text-sm text-muted-foreground'>
            <ProfileCard email={resource.userEmail} /> ·{' '}
            {timeAgo(resource.createdAt)}
          </span>
          <button
            disabled={session.status !== 'authenticated'}
            onClick={
              session.status === 'authenticated' ? handleFavorite : () => {}
            }
            className={`flex space-x-1 items-center ${session.status === 'authenticated' ? 'hover:text-yellow-500' : ''} transition-all ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
          >
            <i className={`${isFavorite ? 'ph-fill' : 'ph'} ph-star`}></i>
            <p className='text-sm'>{formatNumber(favoriteCounter)}</p>
          </button>
        </div>
        <div className='flex justify-between items-center pb-2'>
          <div className='flex space-x-2'>
            <Badge>{resource.documentType}</Badge>
            <Badge variant={'secondary'}>{resource.documentFormat}</Badge>
          </div>
        </div>
        <CardTitle>{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
        <div className='flex text-sm text-muted-foreground space-x-2'>
          {resource.hashtags.map((hashtag) => (
            <Link key={hashtag} href='#' className='hover:underline'>
              {hashtag}
            </Link>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ul className='space-y-1 text-sm overflow-hidden'>
          <li className='flex space-x-2 font-semibold'>
            <i className='ph ph-chalkboard-teacher text-lg'></i>
            <Link
              href={`/resources/${resource.course._id}/${resource.subject._id}`}
              className='hover:underline'
            >
              {resource.subject.name}
            </Link>
          </li>
          <li className='flex space-x-2 max-w-full text-muted-foreground'>
            <i className='ph ph-graduation-cap text-lg'></i>
            <Link
              href={`/resources/${resource.course._id}`}
              className='hover:underline'
            >
              {resource.course.name}
            </Link>
          </li>
        </ul>
      </CardContent>
      <CardFooter className='space-x-2'>
        <Button
          className='w-full space-x-2'
          onClick={() => router.push(`/api/download/${resource._id}`)}
          variant={'outline'}
          title='Download resource'
        >
          <i className='ph ph-download-simple'></i>
          <span>Download</span>
        </Button>
        {session.status === 'authenticated' && (
          <Button
            variant={'outline'}
            onClick={() => router.push(`/api/download/${resource._id}`)}
            title='Share resource on feed'
          >
            <i className='ph ph-share'></i>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
