'use client';

import { listResourcesByUser, getUser } from '@/lib/data';
import { ResourceDTO, UserDTO } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ResourceCard from '@/components/resource_card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

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
              <div className='basis-2/3 rounded-full overflow-hidden'>
                <Avatar>
                  <AvatarImage src={userData?.image} />
                </Avatar>
              </div>
              <div className='mx-8 my-4'>
                <p className='text-5xl font-semibold'>{userData?.name}</p>
                <p className='text-lg font-normal mt-2'>{userData?.email}</p>
                <p className='text-md font-normal mt-2'>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tellus nunc. Suspendisse potenti. Suspendisse eget aliquam quam. Sed viverra justo pharetra arcu auctor rutrum. Donec porta nibh ac mi pulvinar aliquet. Pellentesque vestibulum libero id enim lobortis viverra nec in tortor. Nulla ultricies ut dui eu posuere. Morbi eu quam nec velit fringilla finibus id vitae nisi. Fusce interdum a purus id lacinia. Nulla laoreet diam ut tincidunt tincidunt. Duis aliquet, quam ac accumsan pharetra, felis eros mollis nunc, vitae consectetur dolor nisi nec metus. Etiam leo purus, semper et aliquam a, sodales id enim. </p>
              </div>
            </div>
          </div>
          <hr/>
          <div>
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
    </div>
  );
}
