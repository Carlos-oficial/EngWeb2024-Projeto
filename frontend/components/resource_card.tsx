'use client';

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
import timeAgo from '@/lib/utils';
import { ResourceDTO } from '@/lib/types';

interface ResourceCardProps {
  resource: ResourceDTO;
  [key: string]: unknown;
}

export default function ResourceCard({
  resource,
  ...props
}: ResourceCardProps) {
  const router = useRouter();

  // TODO: fetch favorite counter information
  // TODO: update favorite counter when clicked, add to the user favorites list, etc

  return (
    <Card {...props}>
      <CardHeader>
        <div className='flex justify-between items-center pb-2'>
          <span className='text-sm text-muted-foreground'>
            <ProfileCard username={resource.username} /> ·{' '}
            {timeAgo(resource.createdAt)}
          </span>
          <button
            onClick={() => ''}
            className='flex text-muted-foreground space-x-1 items-center hover:text-yellow-500 transition-all'
          >
            <i className='ph ph-star'></i>
            <p className='text-sm'>1K</p>
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
              href={`/resources/${resource.course.id}/${resource.subject.id}`}
              className='hover:underline'
            >
              {resource.subject.name}
            </Link>
          </li>
          <li className='flex space-x-2 max-w-full text-muted-foreground'>
            <i className='ph ph-graduation-cap text-lg'></i>
            <Link
              href={`/resources/${resource.course.id}`}
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
        >
          <i className='ph ph-download-simple'></i>
          <span>Download</span>
        </Button>
        <Button
          variant={'outline'}
          onClick={() => router.push(`/api/download/${resource._id}`)}
        >
          <i className='ph ph-share'></i>
        </Button>
      </CardFooter>
    </Card>
  );
}
