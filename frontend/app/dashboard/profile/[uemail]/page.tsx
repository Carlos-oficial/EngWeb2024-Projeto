'use client';

import { listResourcesByUser, getUser } from '@/lib/data';
import { ResourceDTO, UserDTO } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ResourceCard from '@/components/resource_card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';

export default function Profile({ params }: { params: { uemail: string } }) {
  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [error, setError] = useState<string>('');
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated')
      listResourcesByUser(session.data?.user?.email ?? '')
        .then((resources) => setResources(resources))
        .catch((error: Error) => setError(error.message));
  }, [session]);

  const [userData, setUserData] = useState<UserDTO | null>(null);

  useEffect(() => {
    getUser(session.data?.user?.email ?? '')
      .then((userData) => setUserData(userData))
      .catch((error: Error) => setError(error.message));
  }, [session]);

  return (
    <div>
      <div>
        <p></p>
        <div className='p-5 space-y-3 overflow-scroll w-full'>
          <div className="mx-16 my-4 mb-8">
            <div className='flex flew-col gap-3"'>
              <div className='rounded-full overflow-hidden'>
                <Avatar>
                  <AvatarImage src={userData?.image} />
                </Avatar>
              </div>

              <div className='mx-8 my-4'>
                <p className='text-5xl font-semibold'>{userData?.name}</p>
                <p className='text-lg font-normal mt-2'>{userData?.email}</p>
                {
                  session.data?.user.email === params.uemail && (
                    <Button variant={'outline'} className='mt-4'>
                      Edit Profiler
                    </Button>
                  )
                }
              </div>
            </div>
          </div>          
        </div>
        <div className='px-5 space-y-3 overflow-scroll w-full py-2 border-t border-border'>
            <p className='text-2xl font-bold my-4'>Resources</p>
            <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
            {resources
              ? resources.map((resource) => (
                  <ResourceCard resource={resource} key={resource._id} />
                ))
              : 'Loading...'}
            </div>
          </div>
        
      </div>
    </div>
  );
}
