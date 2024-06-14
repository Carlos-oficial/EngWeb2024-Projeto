'use client';

import Spinner from '@/components/spinner';
import { getResource } from '@/lib/data';
import { ResourceDTO } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResourcePage({ params }: { params: { rid: string } }) {
  const router = useRouter();

  const [resource, setResource] = useState<ResourceDTO | null>(null);

  useEffect(() => {
    getResource(params.rid)
      .then((resource) => setResource(resource))
      .catch(() => {
        router.push('/404');
      });
  }, [params.rid, router]);

  return resource !== null ? (
    <div>hey there {resource.title}</div>
  ) : (
    <div className='flex items-center justify-center h-[calc(100vh-10rem)]'>
      <Spinner />
    </div>
  );
}
