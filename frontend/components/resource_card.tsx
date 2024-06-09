'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import {
  addFavorite,
  getResourceFavorites,
  getUserFavorites,
  removeFavorite,
} from '@/lib/data';

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
  const pathname = usePathname();
  const [favoriteCounter, setFavoriteCounter] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (session.data?.user?.email) {
      getUserFavorites(session.data?.user?.email)
        .then((favorites) => {
          setIsFavorite(favorites.includes(resource._id));
        })
        .catch((error: Error) => console.error(error.message));
    }
    getResourceFavorites(resource._id)
      .then((favorites) => {
        setFavoriteCounter(favorites.length);
      })
      .catch((error: Error) => console.error(error.message));
  }, [session, resource._id]);

  function handleFavorite() {
    if (session.status === 'authenticated') {
      if (isFavorite) {
        removeFavorite(session.data.user.email, resource._id)
          .then(() => setFavoriteCounter(favoriteCounter - 1))
          .catch(() => {});
      } else {
        addFavorite(session.data.user.email, resource._id)
          .then(() => setFavoriteCounter(favoriteCounter + 1))
          .catch(() => {});
      }
      setIsFavorite(!isFavorite);
    }
  }

  return (
    <Card {...props} className='flex flex-col justify-between overflow-hidden'>
      <CardHeader>
        <div className='flex justify-between items-center pb-2'>
          <span className='text-sm text-muted-foreground'>
            <ProfileCard email={resource.userEmail} name={resource.userName} />{' '}
            · {timeAgo(resource.createdAt)}
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
            <Badge>{resource.documentType.name}</Badge>
            <Badge variant={'secondary'}>{resource.documentFormat}</Badge>
          </div>
        </div>
        <CardTitle>{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
        <div className='flex text-sm text-muted-foreground space-x-2'>
          {resource.hashtags.map((hashtag) => (
            <Link
              key={hashtag}
              href={`${pathname}?tag=${hashtag}`}
              className='hover:underline'
            >
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
              href={`${pathname}?course=${resource.course._id}&subject=${resource.subject._id}`}
              className='hover:underline'
            >
              {resource.subject.name}
            </Link>
          </li>
          <li className='flex space-x-2 max-w-full text-muted-foreground'>
            <i className='ph ph-graduation-cap text-lg'></i>
            <Link
              href={`${pathname}?course=${resource.course._id}`}
              className='hover:underline'
            >
              {resource.course.name}
            </Link>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <div
          className={`grid ${session.status === 'authenticated' ? 'grid-rows-2' : 'grid-rows-1'}  xl:grid-cols-6 xl:grid-rows-none gap-2 w-full`}
        >
          <Button
            className={`w-full space-x-2 ${session.status === 'authenticated' ? 'xl:col-span-5' : 'xl:col-span-6'}`}
            onClick={() =>
              router.push(`/api/resources/${resource._id}/download`)
            }
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
              className='xl:col-span-1'
            >
              <i className='ph ph-share'></i>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
