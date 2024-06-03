'use client';

import { listResourcesByUser, getUser } from '@/lib/data';
import { ResourceDTO, UserDTO } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ResourceCard from '@/components/resource_card';

export default function Profile() {
  const [resources, setResources] = useState<ResourceDTO[] | null>(null);
  const [error, setError] = useState<string>('');
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated')
      listResourcesByUser(session.data?.user?.id ?? '')
        .then((resources) => setResources(resources))
        .catch((error: Error) => setError(error.message));
  }, [session]);

  const [userData, setUserData] = useState<UserDTO | null>(null);

  useEffect(() => {
    getUser(session.data?.user?.id ?? '')
      .then((userData) => setUserData(userData))
      .catch((error: Error) => setError(error.message));
  }, [session]);

  return (
    <div>
      <div>
        <p>me: {JSON.stringify(userData)}</p>
        <p></p>
        {resources
          ? resources.map((resource) => (
              <ResourceCard resource={resource} key={resource._id} />
            ))
          : 'Loading...'}
      </div>
      ;
    </div>
  );
}
