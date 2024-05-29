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

type ResourceCardProps = {
  id: string;
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  username: string;
  hashtags: string[];
  subject: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  createdAt: Date;
};

export default function ResourceCard({
  id,
  title,
  description,
  documentType,
  documentFormat,
  username,
  hashtags,
  subject,
  course,
  createdAt,
}: ResourceCardProps) {
  const router = useRouter();

  // TODO: fetch favorite counter information
  // TODO: update favorite counter when clicked, add to the user favorites list, etc

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center pb-2'>
          <span className='text-sm text-muted-foreground'>
            <ProfileCard username={username} /> · {timeAgo(createdAt)}
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
            <Badge>{documentType}</Badge>
            <Badge variant={'secondary'}>{documentFormat}</Badge>
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className='flex text-sm text-muted-foreground space-x-2'>
          {hashtags.map((hashtag) => (
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
              href={`/resources/${course.id}/${subject.id}`}
              className='hover:underline'
            >
              {subject.name}
            </Link>
          </li>
          <li className='flex space-x-2 max-w-full text-muted-foreground'>
            <i className='ph ph-graduation-cap text-lg'></i>
            <Link href={`/resources/${course.id}`} className='hover:underline'>
              {course.name}
            </Link>
          </li>
        </ul>
      </CardContent>
      <CardFooter className='space-x-2'>
        <a
          className='w-full space-x-2'
          href={`localhost:5000/resource/${id}/file`}
        > {/*TODO: Convert back to button */}
          <i className='ph ph-download-simple'></i>
          <span>Download</span> 
        </a>
        <Button
          variant={'outline'}
          onClick={() => router.push(`/feed/share/${id}`)}
        >
          <i className='ph ph-share'></i>
        </Button>
      </CardFooter>
    </Card>
  );
}
