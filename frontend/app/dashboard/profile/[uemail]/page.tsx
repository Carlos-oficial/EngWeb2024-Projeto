'use client';

import { listResourcesByUser, getUser } from '@/lib/data';
import { ResourceDTO, UserDTO } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ResourceCard from '@/components/resource_card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import ProfileEditDialog from '@/components/profile_dialog';

export default function Profile({ params }: { params: { uemail: string } }) {
  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [error, setError] = useState<string>('');
  const session = useSession();

  const decodeEmail = decodeURIComponent(params.uemail);

  useEffect(() => {
    if (params.uemail) {
      listResourcesByUser(decodeEmail)
        .then((resources) => setResources(resources))
        .catch((error: Error) => setError(error.message));
    }
  }, [params.uemail]);

  useEffect(() => {
    if (params.uemail) {
      getUser(decodeEmail)
        .then((userData) => setUserData(userData))
        .catch((error: Error) => setError(error.message));
    }
  }, [params.uemail]);

  return (
    <div className='flex h-full w-full'>
      <div className='p-5 space-y-3 overflow-scroll w-full'>
        <div className='px-5 space-y-3 overflow-scroll w-full py-2 border-border'>
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
      <div className='p-5 space-y-3 overflow-scroll w-1/3 h-full border-l border-border'>
        <div className='mx-16 my-4 mb-8'>
          <div className='rounded-full overflow-hidden'>
            <Avatar>
              <AvatarImage src={userData?.image} />
            </Avatar>
          </div>

          <p className='text-5xl font-semibold text-center mt-8'>{userData?.name}</p>
          <p className='text-lg font-normal text-center mt-2'>{userData?.email}</p>
          {session.data?.user.email === decodeURIComponent(params.uemail) && (
            <ProfileEditDialog />
          )}
          {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
        </div>
      </div>
    </div>
  );
}
